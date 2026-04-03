const express = require('express');
const line = require('@line/bot-sdk');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const lineConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: lineConfig.channelAccessToken,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const conversationHistory = {};

function todayStr() {
  const d = new Date();
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split('T')[0];
}

async function getTasks(userId) {
  const today = todayStr();
  const { data, error } = await supabase
    .from('tasks').select('*').eq('user_id', userId).eq('date', today).order('id');
  if (error || !data || data.length === 0) {
    const defaults = [
      { user_id: userId, name: 'Morning run 4.5km', priority: 'must', cat: 'private', time: '08:00', done: false, date: today },
      { user_id: userId, name: 'Claude research', priority: 'high', cat: 'work', time: '', done: false, date: today },
      { user_id: userId, name: 'Food loss app sales', priority: 'high', cat: 'work', time: '', done: false, date: today },
      { user_id: userId, name: 'Apparel work', priority: 'mid', cat: 'work', time: '', done: false, date: today },
      { user_id: userId, name: 'Racing simulator', priority: 'low', cat: 'private', time: '', done: false, date: today },
    ];
    const { data: inserted } = await supabase.from('tasks').insert(defaults).select();
    return inserted || defaults;
  }
  return data;
}

async function addTask(userId, name, priority) {
  priority = priority || 'mid';
  const today = todayStr();
  const { data } = await supabase.from('tasks')
    .insert({ user_id: userId, name: name, priority: priority, cat: 'work', time: '', done: false, date: today }).select();
  return data ? data[0] : null;
}

async function completeTask(userId, name) {
  const today = todayStr();
  const { data } = await supabase.from('tasks').select('*')
    .eq('user_id', userId).eq('date', today).ilike('name', '%' + name + '%');
  if (!data || data.length === 0) return null;
  await supabase.from('tasks').update({ done: true }).eq('id', data[0].id);
  return data[0];
}

async function getHabit(userId, date) {
  const { data } = await supabase.from('habits').select('*')
    .eq('user_id', userId).eq('date', date).single();
  return data;
}

async function saveHabit(userId, date, habitData) {
  const existing = await getHabit(userId, date);
  if (existing) {
    const { data } = await supabase.from('habits').update(habitData)
      .eq('user_id', userId).eq('date', date).select();
    return data ? data[0] : null;
  } else {
    const insertData = Object.assign({ user_id: userId, date: date }, habitData);
    const { data } = await supabase.from('habits').insert(insertData).select();
    return data ? data[0] : null;
  }
}

async function getLast7Habits(userId) {
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    last7.push(jst.toISOString().split('T')[0]);
  }
  const { data } = await supabase.from('habits').select('*')
    .eq('user_id', userId).in('date', last7);
  return data || [];
}

function parseCommand(msg) {
  const t = msg.trim();
  if (/^(task|todo|today)$/i.test(t)) return { type: 'tasks_list' };
  if (/^(タスク|今日|やること)$/.test(t)) return { type: 'tasks_list' };
  const doneMatch = t.match(/^(done|完了)\s+(.+)/);
  if (doneMatch) return { type: 'task_done', name: doneMatch[2] };
  const addMatch = t.match(/^(add|追加)\s+(.+)/);
  if (addMatch) return { type: 'task_add', name: addMatch[2] };
  if (/^(log|記録)/.test(t)) {
    const data = {};
    const kmMatch = t.match(/([0-9.]+)km/);
    const minMatch = t.match(/([0-9]+)min/);
    const sleepMatch = t.match(/sleep([0-9.]+)|睡眠([0-9.]+)/);
    const weightMatch = t.match(/([0-9.]+)kg/);
    const calMatch = t.match(/([0-9]+)kcal/);
    const simMatch = t.match(/sim([0-9]+)|シミュ([0-9]+)/);
    if (kmMatch) data.run_km = parseFloat(kmMatch[1]);
    if (minMatch) data.run_min = parseInt(minMatch[1]);
    if (sleepMatch) data.sleep_h = parseFloat(sleepMatch[1] || sleepMatch[2]);
    if (weightMatch) data.weight_kg = parseFloat(weightMatch[1]);
    if (calMatch) data.cal_kcal = parseInt(calMatch[1]);
    if (simMatch) data.sim_min = parseInt(simMatch[1] || simMatch[2]);
    return { type: 'habit_log', data: data };
  }
  if (/^(今日の記録|記録確認|ログ)$/.test(t)) return { type: 'habit_today' };
  if (/^(分析|analyze|今週|週次)$/.test(t)) return { type: 'analysis' };
  if (/^(to do アプリ|todoアプリ|アプリ|app)$/i.test(t)) return { type: 'app_url' };
  if (/^(help|ヘルプ)$/.test(t)) return { type: 'help' };
  return { type: 'chat' };
}

async function handleCommand(cmd, userId, originalMsg) {
  const today = todayStr();

  if (cmd.type === 'tasks_list') {
    const tasks = await getTasks(userId);
    const pending = tasks.filter(function(t) { return !t.done; });
    const done = tasks.filter(function(t) { return t.done; });
    const priLabel = { must: 'MUST', high: 'HIGH', mid: 'MID', low: 'LOW' };
    let text = 'Today tasks (' + today + ')\n\n';
    if (pending.length) {
      text += '[Pending]\n';
      text += pending.map(function(t) { return priLabel[t.priority] + ' ' + t.name; }).join('\n');
    }
    if (done.length) {
      text += '\n\n[Done]\n';
      text += done.map(function(t) { return 'OK ' + t.name; }).join('\n');
    }
    text += '\n\nDone: ' + done.length + '/' + tasks.length;
    return text;
  }

  if (cmd.type === 'task_add') {
    await addTask(userId, cmd.name);
    return 'Added: ' + cmd.name;
  }

  if (cmd.type === 'task_done') {
    const task = await completeTask(userId, cmd.name);
    if (task) return 'Completed: ' + task.name;
    return 'Task not found: ' + cmd.name;
  }

  if (cmd.type === 'habit_log') {
    const rec = await saveHabit(userId, today, cmd.data);
    let text = 'Saved ' + today + '\n\n';
    if (rec && rec.run_km) text += 'Run: ' + rec.run_km + 'km' + (rec.run_min ? ' / ' + rec.run_min + 'min' : '') + '\n';
    if (rec && rec.sleep_h) text += 'Sleep: ' + rec.sleep_h + 'h\n';
    if (rec && rec.weight_kg) text += 'Weight: ' + rec.weight_kg + 'kg\n';
    if (rec && rec.cal_kcal) text += 'Cal: ' + rec.cal_kcal + 'kcal\n';
    if (rec && rec.sim_min) text += 'Sim: ' + rec.sim_min + 'min\n';
    return text.trim();
  }

  if (cmd.type === 'habit_today') {
    const rec = await getHabit(userId, today);
    if (!rec) return 'No record today. Try: log 4.5km 45min sleep7 66kg';
    let text = 'Today record\n\n';
    if (rec.run_km) text += 'Run: ' + rec.run_km + 'km' + (rec.run_min ? ' / ' + rec.run_min + 'min' : '') + '\n';
    if (rec.sleep_h) text += 'Sleep: ' + rec.sleep_h + 'h\n';
    if (rec.weight_kg) text += 'Weight: ' + rec.weight_kg + 'kg\n';
    if (rec.cal_kcal) text += 'Cal: ' + rec.cal_kcal + 'kcal\n';
    if (rec.sim_min) text += 'Sim: ' + rec.sim_min + 'min\n';
    return text.trim();
  }

  if (cmd.type === 'analysis') {
    const week = await getLast7Habits(userId);
    if (!week.length) return 'No data for last 7 days. Please log first.';
    const avg = function(f) {
      const v = week.map(function(h) { return h[f]; }).filter(function(x) { return x != null; });
      return v.length ? (v.reduce(function(a, b) { return a + b; }, 0) / v.length).toFixed(1) : '-';
    };
    const summary = week.map(function(r) {
      return r.date + ': run' + (r.run_km || '-') + 'km, sleep' + (r.sleep_h || '-') + 'h, weight' + (r.weight_kg || '-') + 'kg';
    }).join('\n');
    const prompt = 'You are a coach for Kouta, FIA F4 driver and car shop owner. Analyze his last 7 days data and give advice in Japanese.\n\n' + summary + '\n\nAvg: run' + avg('run_km') + 'km/day, sleep' + avg('sleep_h') + 'h/day\n\n1.Summary 2.Good points 3.Improvements 4.3 actions for next week';
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content[0].text;
  }

  if (cmd.type === 'app_url') {
    return 'KOUTA OS: https://line-claude-bot-yznu.onrender.com/app';
  }

  if (cmd.type === 'help') {
    return 'Commands:\ntask - today list\nadd XX - add task\ndone XX - complete task\nlog 4.5km 45min sleep7 66kg - habit log\ntoday record - check today\nanalysis - weekly AI analysis\napp - open app';
  }

  if (!conversationHistory[userId]) conversationHistory[userId] = [];
  const todayRec = await getHabit(userId, today);
  const tasks = await getTasks(userId);
  const pendingTasks = tasks.filter(function(t) { return !t.done; }).map(function(t) { return t.name; }).join(', ');
  const systemPrompt = 'You are Kouta personal coach. Kouta is FIA F4 driver and J Racing shop owner. Today: pending tasks: ' + (pendingTasks || 'none') + '. Record: ' + (todayRec ? 'run' + todayRec.run_km + 'km sleep' + todayRec.sleep_h + 'h weight' + todayRec.weight_kg + 'kg' : 'none') + '. Reply in Japanese, short for LINE.';
  conversationHistory[userId].push({ role: 'user', content: originalMsg });
  if (conversationHistory[userId].length > 20) {
    conversationHistory[userId] = conversationHistory[userId].slice(-20);
  }
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: systemPrompt,
    messages: conversationHistory[userId]
  });
  const replyText = response.content[0].text;
  conversationHistory[userId].push({ role: 'assistant', content: replyText });
  return replyText;
}

const app = express();
app.use(express.static(__dirname));
app.get('/', function(req, res) { res.send('KOUTA OS Bot is running!'); });
app.get('/app', function(req, res) { res.sendFile(__dirname + '/kouta_os.html'); });
app.post('/api/analyze', express.json(), async function(req, res) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: req.body.prompt }]
    });
    res.json({ text: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/webhook', line.middleware(lineConfig), async function(req, res) {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;
  const userId = event.source.userId;
  const userMessage = event.message.text;
  try {
    const cmd = parseCommand(userMessage);
    const replyText = await handleCommand(cmd, userId, userMessage);
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: replyText }]
    });
  } catch (err) {
    console.error('Error:', err);
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: 'Error occurred. Please try again.' }]
    });
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('KOUTA OS Bot running on port ' + PORT);
});
