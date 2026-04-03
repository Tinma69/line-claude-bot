const express = require(‘express’);
const line = require(’@line/bot-sdk’);
const Anthropic = require(’@anthropic-ai/sdk’);
const { createClient } = require(’@supabase/supabase-js’);

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
return jst.toISOString().split(‘T’)[0];
}

async function getTasks(userId) {
const today = todayStr();
const { data, error } = await supabase
.from(‘tasks’).select(’*’).eq(‘user_id’, userId).eq(‘date’, today).order(‘id’);
if (error || !data || data.length === 0) {
const defaults = [
{ user_id: userId, name: ‘起床 7:30’, priority: ‘must’, cat: ‘private’, time: ‘07:30’, done: false, date: today },
{ user_id: userId, name: ‘ランニング 4.5km → 出社’, priority: ‘must’, cat: ‘private’, time: ‘08:00’, done: false, date: today },
{ user_id: userId, name: ‘Claudeの研究・API活用’, priority: ‘high’, cat: ‘work’, time: ‘’, done: false, date: today },
{ user_id: userId, name: ‘フードロスアプリ 営業パート’, priority: ‘high’, cat: ‘work’, time: ‘’, done: false, date: today },
{ user_id: userId, name: ‘会社アパレル業務’, priority: ‘mid’, cat: ‘work’, time: ‘’, done: false, date: today },
{ user_id: userId, name: ‘レーシングシミュレーター’, priority: ‘low’, cat: ‘private’, time: ‘’, done: false, date: today },
];
const { data: inserted } = await supabase.from(‘tasks’).insert(defaults).select();
return inserted || defaults;
}
return data;
}

async function addTask(userId, name, priority = ‘mid’) {
const today = todayStr();
const { data } = await supabase.from(‘tasks’)
.insert({ user_id: userId, name, priority, cat: ‘work’, time: ‘’, done: false, date: today }).select();
return data?.[0];
}

async function completeTask(userId, name) {
const today = todayStr();
const { data } = await supabase.from(‘tasks’).select(’*’)
.eq(‘user_id’, userId).eq(‘date’, today).ilike(‘name’, `%${name}%`);
if (!data || data.length === 0) return null;
await supabase.from(‘tasks’).update({ done: true }).eq(‘id’, data[0].id);
return data[0];
}

async function getHabit(userId, date) {
const { data } = await supabase.from(‘habits’).select(’*’)
.eq(‘user_id’, userId).eq(‘date’, date).single();
return data;
}

async function saveHabit(userId, date, habitData) {
const existing = await getHabit(userId, date);
if (existing) {
const { data } = await supabase.from(‘habits’).update(habitData)
.eq(‘user_id’, userId).eq(‘date’, date).select();
return data?.[0];
} else {
const { data } = await supabase.from(‘habits’)
.insert({ user_id: userId, date, …habitData }).select();
return data?.[0];
}
}

async function getLast7Habits(userId) {
const last7 = [];
for (let i = 6; i >= 0; i–) {
const d = new Date(); d.setDate(d.getDate() - i);
const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
last7.push(jst.toISOString().split(‘T’)[0]);
}
const { data } = await supabase.from(‘habits’).select(’*’)
.eq(‘user_id’, userId).in(‘date’, last7);
return data || [];
}

function parseCommand(msg) {
const t = msg.trim();
if (/^(タスク|todo|今日|やること)$/i.test(t)) return { type: ‘tasks_list’ };
const doneMatch = t.match(/^(完了|done)\s+(.+)/);
if (doneMatch) return { type: ‘task_done’, name: doneMatch[2] };
const addMatch = t.match(/^(追加|add)\s+(.+)/);
if (addMatch) return { type: ‘task_add’, name: addMatch[2] };
if (/^(記録|log)/.test(t)) {
const data = {};
const kmMatch = t.match(/走行(\d+.?\d*)km/);
const minMatch = t.match(/(\d+)min/);
const sleepMatch = t.match(/睡眠(\d+.?\d*)h/);
const weightMatch = t.match(/体重(\d+.?\d*)kg/);
const calMatch = t.match(/(\d+)kcal/);
const simMatch = t.match(/シミュ(\d+)min/);
if (kmMatch) data.run_km = parseFloat(kmMatch[1]);
if (minMatch) data.run_min = parseInt(minMatch[1]);
if (sleepMatch) data.sleep_h = parseFloat(sleepMatch[1]);
if (weightMatch) data.weight_kg = parseFloat(weightMatch[1]);
if (calMatch) data.cal_kcal = parseInt(calMatch[1]);
if (simMatch) data.sim_min = parseInt(simMatch[1]);
return { type: ‘habit_log’, data };
}
if (/^(今日の記録|記録確認|ログ)$/.test(t)) return { type: ‘habit_today’ };
if (/^(分析|analyze|週次|今週)$/.test(t)) return { type: ‘analysis’ };
if (/^(to do アプリ|todoアプリ|アプリ|todo)$/i.test(t)) return { type: ‘app_url’ };
if (/^(ヘルプ|help|?)$/.test(t)) return { type: ‘help’ };
return { type: ‘chat’ };
}

async function handleCommand(cmd, userId, originalMsg) {
const today = todayStr();
switch (cmd.type) {
case ‘tasks_list’: {
const tasks = await getTasks(userId);
const pending = tasks.filter(t => !t.done);
const done = tasks.filter(t => t.done);
const priLabel = { must: ‘🔴’, high: ‘🟠’, mid: ‘🔵’, low: ‘⚫’ };
let text = `📋 今日のタスク（${today}）\n\n`;
if (pending.length) { text += ‘【未完了】\n’; text += pending.map(t => `${priLabel[t.priority]} ${t.name}`).join(’\n’); }
if (done.length) { text += ‘\n\n【完了済み ✓】\n’; text += done.map(t => `✅ ${t.name}`).join(’\n’); }
text += `\n\n完了: ${done.length}/${tasks.length}`;
return text;
}
case ‘task_add’: { await addTask(userId, cmd.name); return `✅ タスクを追加しました！\n「${cmd.name}」`; }
case ‘task_done’: {
const task = await completeTask(userId, cmd.name);
if (task) return `🎉 完了しました！\n「${task.name}」\nお疲れ様！`;
return `「${cmd.name}」に一致するタスクが見つかりませんでした。`;
}
case ‘habit_log’: {
const rec = await saveHabit(userId, today, cmd.data);
let text = `📊 ${today} の記録を保存しました！\n\n`;
if (rec?.run_km) text += `🏃 走行: ${rec.run_km}km${rec.run_min ? ` / ${rec.run_min}min` : ''}\n`;
if (rec?.sleep_h) text += `🌙 睡眠: ${rec.sleep_h}h\n`;
if (rec?.weight_kg) text += `⚖️ 体重: ${rec.weight_kg}kg\n`;
if (rec?.cal_kcal) text += `🍱 カロリー: ${rec.cal_kcal}kcal\n`;
if (rec?.sim_min) text += `🎮 シミュレーター: ${rec.sim_min}min\n`;
return text.trim();
}
case ‘habit_today’: {
const rec = await getHabit(userId, today);
if (!rec) return `📊 今日（${today}）はまだ記録がありません。\n\n例: 記録 走行4.5km 45min 睡眠7h 体重66kg`;
let text = `📊 今日（${today}）の記録\n\n`;
if (rec.run_km) text += `🏃 走行: ${rec.run_km}km${rec.run_min ? ` / ${rec.run_min}min` : ''}\n`;
if (rec.sleep_h) text += `🌙 睡眠: ${rec.sleep_h}h\n`;
if (rec.weight_kg) text += `⚖️ 体重: ${rec.weight_kg}kg\n`;
if (rec.cal_kcal) text += `🍱 カロリー: ${rec.cal_kcal}kcal\n`;
if (rec.sim_min) text += `🎮 シミュレーター: ${rec.sim_min}min\n`;
return text.trim();
}
case ‘analysis’: {
const week = await getLast7Habits(userId);
if (!week.length) return ‘📊 直近7日間のデータがありません。\nまず記録をつけてから分析してください！’;
const avg = f => { const v = week.map(h => h[f]).filter(x => x != null); return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : ‘—’; };
const summary = week.map(r => `${r.date}: 走行${r.run_km ?? '—'}km(${r.run_min ?? '—'}min), 睡眠${r.sleep_h ?? '—'}h, 体重${r.weight_kg ?? '—'}kg, カロリー${r.cal_kcal ?? '—'}kcal, シミュ${r.sim_min ?? '—'}min`).join(’\n’);
const prompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のフィジカルコーチです。以下の直近7日間のデータを分析してください。\n\n${summary}\n\n平均: ランニング${avg('run_km')}km/日, 睡眠${avg('sleep_h')}h/日\n\n1.今週の総評(2文) 2.良かった点 3.改善点 4.来週のアドバイス3つ を簡潔に日本語で。LINEで読みやすい形式で。`;
const response = await anthropic.messages.create({ model: ‘claude-sonnet-4-6’, max_tokens: 800, messages: [{ role: ‘user’, content: prompt }] });
return response.content[0].text;
}
case ‘app_url’: return `📱 KOUTA OS はこちら！\n\nhttps://line-claude-bot-yznu.onrender.com/app\n\nTo-do・習慣記録・グラフ・AI分析が使えます。`;
case ‘help’: return `📖 使い方\n\n【タスク】\n・タスク → 今日の一覧\n・追加 ○○ → タスク追加\n・完了 ○○ → タスク完了\n\n【習慣記録】\n・記録 走行4.5km 45min 睡眠7h 体重66kg\n・今日の記録 → 確認\n\n【AI分析】\n・分析 → 今週の習慣を分析\n\n【その他】\n・自由に話しかけるとコーチが返答します！`;
case ‘chat’:
default: {
if (!conversationHistory[userId]) conversationHistory[userId] = [];
const todayRec = await getHabit(userId, today);
const tasks = await getTasks(userId);
const pendingTasks = tasks.filter(t => !t.done).map(t => t.name).join(’, ’);
const systemPrompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のパーソナルコーチ兼アシスタントです。
コウタさんについて：

- 毎朝7時半起床、8時に4.5kmランニングして出社
- J’s Racingというホンダ専門チューニングショップのオーナー兼マネージャー
- FIA F4レーシングドライバーとしても活動中
- フードロスアプリの営業担当も兼任

今日（${today}）の状況：

- 未完了タスク: ${pendingTasks || ‘なし’}
- 今日の記録: ${todayRec ? `走行${todayRec.run_km ?? '—'}km, 睡眠${todayRec.sleep_h ?? '—'}h, 体重${todayRec.weight_kg ?? '—'}kg` : ‘まだなし’}

日本語で簡潔に返答してください。LINEなので短めに。`;
conversationHistory[userId].push({ role: ‘user’, content: originalMsg });
if (conversationHistory[userId].length > 20) conversationHistory[userId] = conversationHistory[userId].slice(-20);
const response = await anthropic.messages.create({ model: ‘claude-sonnet-4-6’, max_tokens: 1000, system: systemPrompt, messages: conversationHistory[userId] });
const replyText = response.content[0].text;
conversationHistory[userId].push({ role: ‘assistant’, content: replyText });
return replyText;
}
}
}

const app = express();
app.use(express.static(__dirname));
app.get(’/’, (req, res) => res.send(‘KOUTA OS Bot is running! 🏎️’));
app.get(’/app’, (req, res) => res.sendFile(__dirname + ‘/kouta_os.html’));
app.post(’/api/analyze’, express.json(), async (req, res) => {
try {
const { prompt } = req.body;
const response = await anthropic.messages.create({ model: ‘claude-sonnet-4-6’, max_tokens: 1000, messages: [{ role: ‘user’, content: prompt }] });
res.json({ text: response.content[0].text });
} catch (err) { res.status(500).json({ error: err.message }); }
});
app.post(’/webhook’, line.middleware(lineConfig), async (req, res) => {
try { await Promise.all(req.body.events.map(handleEvent)); res.sendStatus(200); }
catch (err) { console.error(‘Webhook error:’, err); res.sendStatus(500); }
});

async function handleEvent(event) {
if (event.type !== ‘message’ || event.message.type !== ‘text’) return;
const userId = event.source.userId;
const userMessage = event.message.text;
try {
const cmd = parseCommand(userMessage);
const replyText = await handleCommand(cmd, user
