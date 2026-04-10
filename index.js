const express = require('express');
const line = require('@line/bot-sdk');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

// ===== 設定 =====
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

// ===== DB操作 =====
async function getTasks(userId) {
  const today = todayStr();
  const { data, error } = await supabase
    .from('tasks').select('*')
    .eq('user_id', userId).eq('date', today).order('id');
  if (error || !data || data.length === 0) {
    const defaults = [
      { user_id: userId, name: '起床 7:30',             priority: 'must', cat: 'private', time: '07:30', done: false, date: today },
      { user_id: userId, name: 'ランニング 4.5km → 出社', priority: 'must', cat: 'private', time: '08:00', done: false, date: today },
      { user_id: userId, name: 'Claudeの研究・API活用',  priority: 'high', cat: 'work',    time: '',      done: false, date: today },
      { user_id: userId, name: 'フードロスアプリ 営業パート', priority: 'high', cat: 'work', time: '',   done: false, date: today },
      { user_id: userId, name: '会社アパレル業務',        priority: 'mid',  cat: 'work',    time: '',      done: false, date: today },
      { user_id: userId, name: 'レーシングシミュレーター', priority: 'low',  cat: 'private', time: '',     done: false, date: today },
    ];
    const { data: inserted } = await supabase.from('tasks').insert(defaults).select();
    return inserted || defaults;
  }
  return data;
}

async function addTask(userId, name, priority = 'mid') {
  const today = todayStr();
  const { data } = await supabase.from('tasks')
    .insert({ user_id: userId, name, priority, cat: 'work', time: '', done: false, date: today })
    .select();
  return data?.[0];
}

async function completeTask(userId, name) {
  const today = todayStr();
  const { data } = await supabase.from('tasks').select('*')
    .eq('user_id', userId).eq('date', today).ilike('name', `%${name}%`);
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
    return data?.[0];
  } else {
    const { data } = await supabase.from('habits')
      .insert({ user_id: userId, date, ...habitData }).select();
    return data?.[0];
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

// ===== オーケストレーター定義 =====
// Haikuが意図を判断してtool_useで振り分ける
// Claude呼び出しが不要な操作（タスク・習慣）はそのままDB処理へ
const ORCHESTRATOR_TOOLS = [
  {
    name: 'task_agent',
    description: 'タスクの一覧表示・追加・完了に関するすべての操作。「タスク」「今日やること」「〇〇を追加」「〇〇が終わった」など。',
    input_schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'add', 'complete'],
          description: 'list=一覧, add=追加, complete=完了',
        },
        task_name: {
          type: 'string',
          description: '追加・完了するタスク名（listの場合は不要）',
        },
        priority: {
          type: 'string',
          enum: ['must', 'high', 'mid', 'low'],
          description: 'タスク追加時の優先度（省略時はmid）',
        },
      },
      required: ['action'],
    },
  },
  {
    name: 'habit_agent',
    description: '習慣データの記録・確認。ランニング・睡眠・体重・カロリー・シミュレーターの記録や確認。',
    input_schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['log', 'view'],
          description: 'log=記録する, view=今日の記録を見る',
        },
        run_km:    { type: 'number', description: '走行距離(km)' },
        run_min:   { type: 'number', description: 'ランニング時間(分)' },
        sleep_h:   { type: 'number', description: '睡眠時間(時間)' },
        weight_kg: { type: 'number', description: '体重(kg)' },
        cal_kcal:  { type: 'number', description: 'カロリー(kcal)' },
        sim_min:   { type: 'number', description: 'シミュレーター練習時間(分)' },
      },
      required: ['action'],
    },
  },
  {
    name: 'analysis_agent',
    description: '直近7日間の習慣データをAIが分析してフィードバックする。「分析」「今週どうだった」「週次」など。',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'info_agent',
    description: 'アプリURLの案内やヘルプ表示。「アプリ」「使い方」「ヘルプ」など。',
    input_schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['app_url', 'help'],
        },
      },
      required: ['type'],
    },
  },
  {
    name: 'coach_agent',
    description: 'タスク・習慣・分析・アプリ以外のすべての会話。相談・励まし・雑談・レーシングの話など。',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
];

// ===== オーケストレーター =====
async function orchestrate(userId, userMessage) {
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: 'あなたはルーティング専用のオーケストレーターです。ユーザーのメッセージを分析し、必ず適切なツールを1つ呼び出してください。曖昧な場合はcoach_agentを選んでください。',
    messages: [{ role: 'user', content: userMessage }],
    tools: ORCHESTRATOR_TOOLS,
    tool_choice: { type: 'any' },
  });

  const toolUse = res.content.find(c => c.type === 'tool_use');
  if (!toolUse) return coachAgent(userId, userMessage);

  switch (toolUse.name) {
    case 'task_agent':     return taskAgent(userId, toolUse.input);
    case 'habit_agent':    return habitAgent(userId, toolUse.input);
    case 'analysis_agent': return analysisAgent(userId);
    case 'info_agent':     return infoAgent(toolUse.input.type);
    case 'coach_agent':    return coachAgent(userId, userMessage);
    default:               return coachAgent(userId, userMessage);
  }
}

// ===== 専門エージェント =====

// タスクエージェント — Claude不要、DBだけで完結
async function taskAgent(userId, { action, task_name, priority }) {
  const today = todayStr();
  const priLabel = { must: '🔴', high: '🟠', mid: '🔵', low: '⚫' };

  if (action === 'list') {
    const tasks = await getTasks(userId);
    const pending = tasks.filter(t => !t.done);
    const done    = tasks.filter(t => t.done);
    let text = `📋 今日のタスク（${today}）\n\n`;
    if (pending.length) {
      text += '【未完了】\n';
      text += pending.map(t => `${priLabel[t.priority]} ${t.name}`).join('\n');
    }
    if (done.length) {
      text += '\n\n【完了済み】\n';
      text += done.map(t => `✅ ${t.name}`).join('\n');
    }
    text += `\n\n完了: ${done.length}/${tasks.length}`;
    return text;
  }

  if (action === 'add') {
    if (!task_name) return 'タスク名を教えてください。';
    await addTask(userId, task_name, priority || 'mid');
    return `✅ タスクを追加しました！\n「${task_name}」`;
  }

  if (action === 'complete') {
    if (!task_name) return '完了するタスク名を教えてください。';
    const task = await completeTask(userId, task_name);
    if (task) return `🎉 完了しました！\n「${task.name}」\nお疲れ様！`;
    return `「${task_name}」に一致するタスクが見つかりませんでした。`;
  }
}

// 習慣エージェント — Claude不要、DBだけで完結
async function habitAgent(userId, input) {
  const today = todayStr();
  const { action, run_km, run_min, sleep_h, weight_kg, cal_kcal, sim_min } = input;

  if (action === 'log') {
    const habitData = {};
    if (run_km != null)    habitData.run_km    = run_km;
    if (run_min != null)   habitData.run_min   = run_min;
    if (sleep_h != null)   habitData.sleep_h   = sleep_h;
    if (weight_kg != null) habitData.weight_kg = weight_kg;
    if (cal_kcal != null)  habitData.cal_kcal  = cal_kcal;
    if (sim_min != null)   habitData.sim_min   = sim_min;

    if (Object.keys(habitData).length === 0) {
      return '記録する値が見つかりませんでした。\n例: 走行4.5km 45min 睡眠7h 体重66kg';
    }

    const rec = await saveHabit(userId, today, habitData);
    let text = `📊 ${today} の記録を保存しました！\n\n`;
    if (rec?.run_km)    text += `🏃 走行: ${rec.run_km}km${rec.run_min ? ` / ${rec.run_min}min` : ''}\n`;
    if (rec?.sleep_h)   text += `🌙 睡眠: ${rec.sleep_h}h\n`;
    if (rec?.weight_kg) text += `⚖️ 体重: ${rec.weight_kg}kg\n`;
    if (rec?.cal_kcal)  text += `🍱 カロリー: ${rec.cal_kcal}kcal\n`;
    if (rec?.sim_min)   text += `🎮 シミュレーター: ${rec.sim_min}min\n`;
    return text.trim();
  }

  if (action === 'view') {
    const rec = await getHabit(userId, today);
    if (!rec) return `📊 今日（${today}）はまだ記録がありません。\n\n例: 走行4.5km 45min 睡眠7h 体重66kg`;
    let text = `📊 今日（${today}）の記録\n\n`;
    if (rec.run_km)    text += `🏃 走行: ${rec.run_km}km${rec.run_min ? ` / ${rec.run_min}min` : ''}\n`;
    if (rec.sleep_h)   text += `🌙 睡眠: ${rec.sleep_h}h\n`;
    if (rec.weight_kg) text += `⚖️ 体重: ${rec.weight_kg}kg\n`;
    if (rec.cal_kcal)  text += `🍱 カロリー: ${rec.cal_kcal}kcal\n`;
    if (rec.sim_min)   text += `🎮 シミュレーター: ${rec.sim_min}min\n`;
    return text.trim();
  }
}

// 分析エージェント — Sonnetで高品質な分析
async function analysisAgent(userId) {
  const week = await getLast7Habits(userId);
  if (!week.length) return '直近7日間のデータがありません。\nまず記録をつけてから分析してください！';

  const avg = f => {
    const v = week.map(h => h[f]).filter(x => x != null);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '—';
  };
  const summary = week.map(r =>
    `${r.date}: 走行${r.run_km ?? '—'}km(${r.run_min ?? '—'}min), 睡眠${r.sleep_h ?? '—'}h, 体重${r.weight_kg ?? '—'}kg, カロリー${r.cal_kcal ?? '—'}kcal, シミュ${r.sim_min ?? '—'}min`
  ).join('\n');

  const prompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のフィジカルコーチです。以下の直近7日間のデータを分析してください。\n\n${summary}\n\n平均: ランニング${avg('run_km')}km/日, 睡眠${avg('sleep_h')}h/日\n\n1.今週の総評(2文) 2.良かった点 3.改善点 4.来週のアドバイス3つ を簡潔に日本語で。LINEなので短めに。`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.content[0].text;
}

// インフォエージェント — 静的応答、Claude不要
function infoAgent(type) {
  if (type === 'app_url') {
    return `📱 KOUTA OS はこちら！\nhttps://line-claude-bot-yznu.onrender.com/app\n\nTo-do・習慣記録・グラフ・AI分析が使えます。`;
  }
  if (type === 'help') {
    return `❓ 使い方\n\n【タスク】\n・「今日のタスク」→ 一覧\n・「〇〇を追加」→ タスク追加\n・「〇〇が終わった」→ 完了\n\n【習慣記録】\n・「走行4.5km 45min 睡眠7h 体重66kg」\n・「今日の記録見せて」→ 確認\n\n【AI分析】\n・「今週どうだった？」→ 週次分析\n\n【その他】\n・自由に話しかけるとコーチが返信します！`;
  }
}

// コーチエージェント — Sonnetでコンテキストを持った会話
async function coachAgent(userId, userMessage) {
  const today = todayStr();
  if (!conversationHistory[userId]) conversationHistory[userId] = [];

  // コンテキスト取得（並列）
  const [todayRec, tasks] = await Promise.all([
    getHabit(userId, today),
    getTasks(userId),
  ]);
  const pendingTasks = tasks.filter(t => !t.done).map(t => t.name).join('、');

  const systemPrompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のパーソナルコーチ兼アシスタントです。コウタさんについて:
- 毎朝7時頃起床、4.5kmランニングして出社
- J's Racingというホンダ系チューニングショップのオーナー兼マネージャー
- FIA F4レーシングドライバーとして活動中
- フードロスアプリの営業パートも兼任

今日（${today}）の状況:
- 未完了タスク: ${pendingTasks || 'なし'}
- 今日の記録: ${todayRec ? `走行${todayRec.run_km ?? '—'}km, 睡眠${todayRec.sleep_h ?? '—'}h, 体重${todayRec.weight_kg ?? '—'}kg` : 'まだなし'}

ユーザーのメッセージの言語を自動判定し、同じ言語で返答してください。LINEなので短めに簡潔に。`;

  conversationHistory[userId].push({ role: 'user', content: userMessage });
  if (conversationHistory[userId].length > 20) {
    conversationHistory[userId] = conversationHistory[userId].slice(-20);
  }

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: systemPrompt,
    messages: conversationHistory[userId],
  });
  const replyText = res.content[0].text;
  conversationHistory[userId].push({ role: 'assistant', content: replyText });
  return replyText;
}

// ===== Webアプリ用マルチエージェント =====
// localStorageのtasks・habitsをフロントから受け取って処理する

const WEB_ORCHESTRATOR_TOOLS = [
  {
    name: 'analysis_agent',
    description: '習慣データの分析・フィードバック。「分析して」「今週どうだった」「フィードバック」「評価」など。',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'task_agent',
    description: 'タスクへのコメント・アドバイス・優先順位の相談。「タスクどう思う？」「何から始める？」など。',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'coach_agent',
    description: 'それ以外のすべての会話。相談・励まし・レーシング・雑談など。',
    input_schema: { type: 'object', properties: {} },
  },
];

// 会話履歴をAnthropic形式に変換（現在のメッセージは含まない）
function toAnthropicHistory(history, currentMessage) {
  const messages = history
    .filter(m => m.role === 'user' || m.role === 'ai')
    .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
  messages.push({ role: 'user', content: currentMessage });
  return messages;
}

async function webOrchestrate(message, tasks = [], habits = [], history = []) {
  // ルーティングは現在のメッセージだけで判断（Haiku・高速）
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: 'ルーティング専用。必ず1つツールを呼び出してください。',
    messages: [{ role: 'user', content: message }],
    tools: WEB_ORCHESTRATOR_TOOLS,
    tool_choice: { type: 'any' },
  });

  const toolUse = res.content.find(c => c.type === 'tool_use');
  const agentName = toolUse?.name || 'coach_agent';

  // 各エージェントには会話履歴を渡す
  if (agentName === 'analysis_agent') return webAnalysisAgent(message, habits, history);
  if (agentName === 'task_agent')     return webTaskAgent(message, tasks, history);
  return webCoachAgent(message, tasks, habits, history);
}

async function webAnalysisAgent(message, habits, history) {
  if (!habits.length) return 'LOGタブでデータを入力してから分析してください。';

  const today = new Date();
  const last7Keys = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last7Keys.push(d.toISOString().split('T')[0]);
  }
  const week = habits.filter(h => last7Keys.includes(h.date));
  if (!week.length) return '直近7日間のデータがありません。';

  const avg = f => {
    const v = week.map(h => h[f]).filter(x => x != null);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '—';
  };
  const summary = week.map(r =>
    `${r.date}: 走行${r.runKm ?? '—'}km(${r.runMin ?? '—'}min), 睡眠${r.sleepH ?? '—'}h, 体重${r.weightKg ?? '—'}kg, カロリー${r.calKcal ?? '—'}kcal, シミュ${r.simMin ?? '—'}min`
  ).join('\n');

  const systemPrompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のフィジカルコーチです。\n\n直近7日のデータ:\n${summary}\n\n平均: ランニング${avg('runKm')}km/日, 睡眠${avg('sleepH')}h/日\n\n簡潔に日本語で答えてください。`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: systemPrompt,
    messages: toAnthropicHistory(history, message),
  });
  return res.content[0].text;
}

async function webTaskAgent(message, tasks, history) {
  const pending = tasks.filter(t => !t.done).map(t => `[${t.priority}] ${t.name}`).join('\n') || 'なし';
  const done    = tasks.filter(t => t.done).map(t => t.name).join('\n') || 'なし';

  const systemPrompt = `あなたはコウタさん専属のコーチです。\n\n今日のタスク:\n【未完了】\n${pending}\n【完了済み】\n${done}\n\n簡潔に日本語で答えてください。`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: systemPrompt,
    messages: toAnthropicHistory(history, message),
  });
  return res.content[0].text;
}

async function webCoachAgent(message, tasks, habits, history) {
  const today = new Date().toISOString().split('T')[0];
  const todayHabit = habits.find(h => h.date === today);
  const pendingTasks = tasks.filter(t => !t.done).map(t => t.name).join('、') || 'なし';

  const systemPrompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のパーソナルコーチ兼アシスタントです。コウタさんについて:
- 毎朝7時頃起床、4.5kmランニングして出社
- J's Racingというホンダ系チューニングショップのオーナー兼マネージャー
- FIA F4レーシングドライバーとして活動中
- フードロスアプリの営業パートも兼任

今日（${today}）の状況:
- 未完了タスク: ${pendingTasks}
- 今日の記録: ${todayHabit ? `走行${todayHabit.runKm ?? '—'}km, 睡眠${todayHabit.sleepH ?? '—'}h, 体重${todayHabit.weightKg ?? '—'}kg` : 'まだなし'}

簡潔に日本語で答えてください。`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: systemPrompt,
    messages: toAnthropicHistory(history, message),
  });
  return res.content[0].text;
}

// ===== サーバー =====
const app = express();
app.use(express.static(__dirname));

app.get('/', (req, res) => res.send('KOUTA OS Bot is running! 🏎️'));

app.get('/app', (req, res) => res.sendFile(__dirname + '/kouta_os.html'));

app.post('/api/analyze', express.json(), async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ text: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webアプリ用チャットエンドポイント（マルチエージェント）
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const { message, tasks = [], habits = [], history = [] } = req.body;
    const text = await webOrchestrate(message, tasks, habits, history);
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;
  const userId = event.source.userId;
  const userMessage = event.message.text;
  try {
    const replyText = await orchestrate(userId, userMessage);
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: replyText }],
    });
  } catch (err) {
    console.error('Event handling error:', err);
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: 'エラーが発生しました。もう一度試してください。' }],
    });
  }
}

// ===== レース走行シート OCR =====
app.post('/api/race-scan', express.json({ limit: '15mb' }), async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg' } = req.body;
    if (!image) return res.status(400).json({ error: 'image required' });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 5000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: image }
          },
          {
            type: 'text',
            text: `これはZAP SPEEDのレース走行記録シートです。手書きの文字・数字を最大限正確に読み取り、全データをJSONで返してください。

【読み取り精度向上のための注意】
- 手書き数字の混同に注意: 1と7、4と9、6と0、3と8 は特に間違えやすい
- 不鮮明な文字は前後の文脈（周回数の流れ、タイムの傾向）から推測する
- 迷った場合は前後のラップと比較して自然な方を選ぶ
- 文字・数字は1文字ずつ丁寧に確認する

【タイム読み取りルール】
- 区切り文字はアポストロフィ(')またはピリオド(.)。「47'10」「47.10」どちらも → "47.10"
- 分がある場合:「1:47'78」→ "1:47.78"
- 手書きのため数字が読みづらい場合は前後の周回タイムと比較して自然な値か確認する
- 1周ごとに1〜2秒程度の差が通常。極端に短いまたは長いタイムは読み間違いの可能性が高い

【ドライバーの読み取り】
- 「DRIVER」「ドライバー」「氏名」「NAME」などのラベルを探す
- セッションごとにドライバーが異なる場合は各セッションのdriverに入れる
- 全セッション共通の場合も各セッションのdriverに同じ名前を入れる
- 読み取れない場合は空文字("")

【除外ルール】
- 周回数の欄に「OUT」または「IN」と書かれている行は、同じ行に数字が書かれていても絶対にlapsに含めない
- セッション最初のラップ（ピットアウト直後）にOUTと書かれていることが多い
- セッション最後のラップ（ピットイン直前）にINと書かれていることが多い
- 「−」や空欄の行も含めない
- 迷ったら除外する

【気温の読み取り】
- 「AIR」「気温」「外気温」「A.TEMP」などのラベルを探す → airTemp
- 「ROAD」「路面」「TRACK」「R.TEMP」「T.TEMP」などのラベルを探す → trackTemp
- 数値が読み取れない場合はnullにする（0にしない）
- シート上部・下部・余白部分も確認する

【タイヤ内圧の読み取り】
- 内圧は①②などの丸数字で記載されている。これはピットイン回数を意味する（①=1回目のピットイン時の内圧）
- 各ピットインの内圧は2×2のグリッドで4輪分ある:
  上段左=フロント左(p1) | 上段右=フロント右(p2)
  下段左=リア左(p3)     | 下段右=リア右(p4)
- 例: 159|158 / 155|153 → p1:159, p2:158, p3:155, p4:153
- ①の内圧はsessions[0]に、②の内圧はsessions[1]にマッピングする
- 読み取れない場合や「−」はnull（0にしない）

【日付の読み取り】
- 「DATE」「日付」「年月日」などのラベルを探す
- 日本語表記（例: 2026年4月9日）→ "2026-04-09"
- 数字表記（例: 26.4.9）→ 年が2桁なら2000年代として補完

【その他】
- 1枚のシートに左右2セッション分ある場合は両方読む

以下のJSON形式のみ返してください（前後に説明文なし）:
{
  "date": "YYYY-MM-DD",
  "circuit": "サーキット名",
  "car": "シャシー・車番",
  "sessions": [
    {
      "label": "枠名または開始時刻",
      "driver": "ドライバー名または空文字",
      "airTemp": 数値またはnull,
      "trackTemp": 数値またはnull,
      "p1": 数値またはnull,
      "p2": 数値またはnull,
      "p3": 数値またはnull,
      "p4": 数値またはnull,
      "laps": [
        { "num": "周回数", "time": "タイム" }
      ]
    }
  ]
}`
          }
        ]
      }]
    });

    const text = response.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'parse failed' });
    res.json(JSON.parse(match[0]));
  } catch (e) {
    console.error('race-scan error:', e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KOUTA OS Bot running on port ${PORT}`));
