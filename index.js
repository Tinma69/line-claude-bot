const express = require(‘express’);
const line = require(’@line/bot-sdk’);
const Anthropic = require(’@anthropic-ai/sdk’);
const { createClient } = require(’@supabase/supabase-js’);

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
{ user_id: userId, name: ‘\u8d77\u5e8a 7:30’, priority: ‘must’, cat: ‘private’, time: ‘07:30’, done: false, date: today },
{ user_id: userId, name: ‘\u30e9\u30f3\u30cb\u30f3\u30b0 4.5km \u2192 \u51fa\u793e’, priority: ‘must’, cat: ‘private’, time: ‘08:00’, done: false, date: today },
{ user_id: userId, name: ‘Claude\u306e\u7814\u7a76\u30fbAPI\u6d3b\u7528’, priority: ‘high’, cat: ‘work’, time: ‘’, done: false, date: today },
{ user_id: userId, name: ‘\u30d5\u30fc\u30c9\u30ed\u30b9\u30a2\u30d7\u30ea \u55b6\u696d\u30d1\u30fc\u30c8’, priority: ‘high’, cat: ‘work’, time: ‘’, done: false, date: today },
{ user_id: userId, name: ‘\u4f1a\u793e\u30a2\u30d1\u30ec\u30eb\u696d\u52d9’, priority: ‘mid’, cat: ‘work’, time: ‘’, done: false, date: today },
{ user_id: userId, name: ‘\u30ec\u30fc\u30b7\u30f3\u30b0\u30b7\u30df\u30e5\u30ec\u30fc\u30bf\u30fc’, priority: ‘low’, cat: ‘private’, time: ‘’, done: false, date: today },
];
const { data: inserted } = await supabase.from(‘tasks’).insert(defaults).select();
return inserted || defaults;
}
return data;
}

async function addTask(userId, name, priority) {
priority = priority || ‘mid’;
const today = todayStr();
const { data } = await supabase.from(‘tasks’)
.insert({ user_id: userId, name: name, priority: priority, cat: ‘work’, time: ‘’, done: false, date: today }).select();
return data ? data[0] : null;
}

async function completeTask(userId, name) {
const today = todayStr();
const { data } = await supabase.from(‘tasks’).select(’*’)
.eq(‘user_id’, userId).eq(‘date’, today).ilike(‘name’, ‘%’ + name + ‘%’);
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
return data ? data[0] : null;
} else {
const insertData = Object.assign({ user_id: userId, date: date }, habitData);
const { data } = await supabase.from(‘habits’).insert(insertData).select();
return data ? data[0] : null;
}
}

async function getLast7Habits(userId) {
const last7 = [];
for (let i = 6; i >= 0; i–) {
const d = new Date();
d.setDate(d.getDate() - i);
const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
last7.push(jst.toISOString().split(‘T’)[0]);
}
const { data } = await supabase.from(‘habits’).select(’*’)
.eq(‘user_id’, userId).in(‘date’, last7);
return data || [];
}

function parseCommand(msg) {
const t = msg.trim();
if (/^(\u30bf\u30b9\u30af|\u4eca\u65e5|\u3084\u308b\u3053\u3068|task|todo|today)$/i.test(t)) return { type: ‘tasks_list’ };
const doneMatch = t.match(/^(\u5b8c\u4e86|done)\s+(.+)/);
if (doneMatch) return { type: ‘task_done’, name: doneMatch[2] };
const addMatch = t.match(/^(\u8ffd\u52a0|add)\s+(.+)/);
if (addMatch) return { type: ‘task_add’, name: addMatch[2] };
if (/^(\u8a18\u9332|log)/.test(t)) {
const data = {};
const kmMatch = t.match(/\u8d70\u884c([0-9.]+)km|([0-9.]+)km/);
const minMatch = t.match(/([0-9]+)min/);
const sleepMatch = t.match(/\u7761\u7720([0-9.]+)h|sleep([0-9.]+)/);
const weightMatch = t.match(/\u4f53\u91cd([0-9.]+)kg|([0-9.]+)kg/);
const calMatch = t.match(/([0-9]+)kcal/);
const simMatch = t.match(/\u30b7\u30df\u30e5([0-9]+)min|sim([0-9]+)/);
if (kmMatch) data.run_km = parseFloat(kmMatch[1] || kmMatch[2]);
if (minMatch) data.run_min = parseInt(minMatch[1]);
if (sleepMatch) data.sleep_h = parseFloat(sleepMatch[1] || sleepMatch[2]);
if (weightMatch) data.weight_kg = parseFloat(weightMatch[1] || weightMatch[2]);
if (calMatch) data.cal_kcal = parseInt(calMatch[1]);
if (simMatch) data.sim_min = parseInt(simMatch[1] || simMatch[2]);
return { type: ‘habit_log’, data: data };
}
if (/^(\u4eca\u65e5\u306e\u8a18\u9332|\u8a18\u9332\u78ba\u8a8d|\u30ed\u30b0)$/.test(t)) return { type: ‘habit_today’ };
if (/^(\u5206\u6790|analyze|\u4eca\u9031|\u9031\u6b21)$/.test(t)) return { type: ‘analysis’ };
if (/^(to do \u30a2\u30d7\u30ea|todo\u30a2\u30d7\u30ea|\u30a2\u30d7\u30ea|app)$/i.test(t)) return { type: ‘app_url’ };
if (/^(\u30d8\u30eb\u30d7|help)$/.test(t)) return { type: ‘help’ };
return { type: ‘chat’ };
}

async function handleCommand(cmd, userId, originalMsg) {
const today = todayStr();

if (cmd.type === ‘tasks_list’) {
const tasks = await getTasks(userId);
const pending = tasks.filter(function(t) { return !t.done; });
const done = tasks.filter(function(t) { return t.done; });
const priLabel = { must: ‘\u30de\u30b9\u30c8’, high: ‘\u9ad8’, mid: ‘\u4e2d’, low: ‘\u4f4e’ };
let text = ‘\u{1F4CB} \u4eca\u65e5\u306e\u30bf\u30b9\u30af\uff08’ + today + ‘\uff09\n\n’;
if (pending.length) {
text += ‘\u3010\u672a\u5b8c\u4e86\u3011\n’;
text += pending.map(function(t) { return ‘\u25a0’ + priLabel[t.priority] + ’ ’ + t.name; }).join(’\n’);
}
if (done.length) {
text += ‘\n\n\u3010\u5b8c\u4e86\u3011\n’;
text += done.map(function(t) { return ‘\u2705 ’ + t.name; }).join(’\n’);
}
text += ’\n\n\u5b8c\u4e86: ’ + done.length + ‘/’ + tasks.length;
return text;
}

if (cmd.type === ‘task_add’) {
await addTask(userId, cmd.name);
return ‘\u2705 \u30bf\u30b9\u30af\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f\uff01\n\u300c’ + cmd.name + ‘\u300d’;
}

if (cmd.type === ‘task_done’) {
const task = await completeTask(userId, cmd.name);
if (task) return ‘\u{1F389} \u5b8c\u4e86\uff01\n\u300c’ + task.name + ‘\u300d\n\u304a\u75b2\u308c\u69d8\uff01’;
return ‘\u300c’ + cmd.name + ‘\u300d\u306b\u4e00\u81f4\u3059\u308b\u30bf\u30b9\u30af\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002’;
}

if (cmd.type === ‘habit_log’) {
const rec = await saveHabit(userId, today, cmd.data);
let text = ‘\u{1F4CA} ’ + today + ’ \u306e\u8a18\u9332\u3092\u4fdd\u5b58\uff01\n\n’;
if (rec && rec.run_km) text += ’\u{1F3C3} ’ + rec.run_km + ‘km’ + (rec.run_min ? ’ / ’ + rec.run_min + ‘min’ : ‘’) + ‘\n’;
if (rec && rec.sleep_h) text += ’\u{1F319} \u7761\u7720: ’ + rec.sleep_h + ‘h\n’;
if (rec && rec.weight_kg) text += ’\u2696\uFE0F \u4f53\u91cd: ’ + rec.weight_kg + ‘kg\n’;
if (rec && rec.cal_kcal) text += ’\u{1F371} ’ + rec.cal_kcal + ‘kcal\n’;
if (rec && rec.sim_min) text += ’\u{1F3AE} \u30b7\u30df\u30e5: ’ + rec.sim_min + ‘min\n’;
return text.trim();
}

if (cmd.type === ‘habit_today’) {
const rec = await getHabit(userId, today);
if (!rec) return ‘\u4eca\u65e5\uff08’ + today + ‘\uff09\u306f\u307e\u3060\u8a18\u9332\u304c\u3042\u308a\u307e\u305b\u3093\u3002\n\n\u4f8b: \u8a18\u9332 \u8d70\u884c4.5km 45min \u7761\u77207h \u4f53\u91cd66kg’;
let text = ‘\u4eca\u65e5\u306e\u8a18\u9332\n\n’;
if (rec.run_km) text += ’\u{1F3C3} ’ + rec.run_km + ‘km’ + (rec.run_min ? ’ / ’ + rec.run_min + ‘min’ : ‘’) + ‘\n’;
if (rec.sleep_h) text += ’\u{1F319} \u7761\u7720: ’ + rec.sleep_h + ‘h\n’;
if (rec.weight_kg) text += ’\u2696\uFE0F \u4f53\u91cd: ’ + rec.weight_kg + ‘kg\n’;
if (rec.cal_kcal) text += ’\u{1F371} ’ + rec.cal_kcal + ‘kcal\n’;
if (rec.sim_min) text += ’\u{1F3AE} \u30b7\u30df\u30e5: ’ + rec.sim_min + ‘min\n’;
return text.trim();
}

if (cmd.type === ‘analysis’) {
const week = await getLast7Habits(userId);
if (!week.length) return ‘\u76f4\u8fd17\u65e5\u9593\u306e\u30c7\u30fc\u30bf\u304c\u3042\u308a\u307e\u305b\u3093\u3002\n\u307e\u305a\u8a18\u9332\u3092\u3064\u3051\u3066\u304b\u3089\u5206\u6790\u3057\u3066\u304f\u3060\u3055\u3044\uff01’;
const avg = function(f) {
const v = week.map(function(h) { return h[f]; }).filter(function(x) { return x != null; });
return v.length ? (v.reduce(function(a, b) { return a + b; }, 0) / v.length).toFixed(1) : ‘-’;
};
const summary = week.map(function(r) {
return r.date + ‘: \u8d70\u884c’ + (r.run_km || ‘-’) + ‘km(’ + (r.run_min || ‘-’) + ‘min), \u7761\u7720’ + (r.sleep_h || ‘-’) + ‘h, \u4f53\u91cd’ + (r.weight_kg || ‘-’) + ‘kg, \u30ab\u30ed\u30ea\u30fc’ + (r.cal_kcal || ‘-’) + ‘kcal, \u30b7\u30df\u30e5’ + (r.sim_min || ‘-’) + ‘min’;
}).join(’\n’);
const prompt = ‘FIA F4\u30c9\u30e9\u30a4\u30d0\u30fc\u5c71\u63a2\u30b3\u30a6\u30bf\u3055\u3093\u306e\u30b3\u30fc\u30c1\u3068\u3057\u3066\u3001\u4ee5\u4e0b\u306e\u30c7\u30fc\u30bf\u3092\u5206\u6790\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n\n’ + summary + ‘\n\n\u5e73\u5747: \u30e9\u30f3\u30cb\u30f3\u30b0’ + avg(‘run_km’) + ‘km/\u65e5, \u7761\u7720’ + avg(‘sleep_h’) + ‘h/\u65e5\n\n1.\u4eca\u9031\u306e\u7dcf\u8a55(2\u6587) 2.\u826f\u304b\u3063\u305f\u70b9 3.\u6539\u5584\u70b9 4.\u6765\u9031\u306e\u30a2\u30c9\u30d0\u30a4\u30b93\u3064 \u3092\u65e5\u672c\u8a9e\u3067\u3002LINE\u3067\u8aad\u307f\u3084\u3059\u3044\u5f62\u5f0f\u3067\u3002’;
const response = await anthropic.messages.create({
model: ‘claude-sonnet-4-6’,
max_tokens: 800,
messages: [{ role: ‘user’, content: prompt }]
});
return response.content[0].text;
}

if (cmd.type === ‘app_url’) {
return ‘\u{1F4F1} KOUTA OS\u306f\u3053\u3061\u3089\uff01\n\nhttps://lin
