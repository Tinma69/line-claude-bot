const express = require(窶脇xpress窶・;
const line = require(窶僉line/bot-sdk窶・;
const Anthropic = require(窶僉anthropic-ai/sdk窶・;
const { createClient } = require('@supabase/supabase-js');


// ===== 險ｭ螳・=====
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
return jst.toISOString().split(窶狼窶・[0];
}

async function getTasks(userId) {
const today = todayStr();
const { data, error } = await supabase
.from(窶・asks窶・.select(窶・窶・.eq(窶・ser_id窶・ userId).eq(窶賄ate窶・ today).order(窶亙d窶・;
if (error || !data || data.length === 0) {
const defaults = [
{ user_id: userId, name: 窶倩ｵｷ蠎・7:30窶・ priority: 窶藁ust窶・ cat: 窶湾rivate窶・ time: 窶・7:30窶・ done: false, date: today },
{ user_id: userId, name: 窶倥Λ繝ｳ繝九Φ繧ｰ 4.5km 竊・蜃ｺ遉ｾ窶・ priority: 窶藁ust窶・ cat: 窶湾rivate窶・ time: 窶・8:00窶・ done: false, date: today },
{ user_id: userId, name: 窶呂laude縺ｮ遐皮ｩｶ繝ｻAPI豢ｻ逕ｨ窶・ priority: 窶鷲igh窶・ cat: 窶・ork窶・ time: 窶倪・ done: false, date: today },
{ user_id: userId, name: 窶倥ヵ繝ｼ繝峨Ο繧ｹ繧｢繝励Μ 蝟ｶ讌ｭ繝代・繝遺・ priority: 窶鷲igh窶・ cat: 窶・ork窶・ time: 窶倪・ done: false, date: today },
{ user_id: userId, name: 窶倅ｼ夂､ｾ繧｢繝代Ξ繝ｫ讌ｭ蜍吮・ priority: 窶藁id窶・ cat: 窶・ork窶・ time: 窶倪・ done: false, date: today },
{ user_id: userId, name: 窶倥Ξ繝ｼ繧ｷ繝ｳ繧ｰ繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ窶・ priority: 窶詫ow窶・ cat: 窶湾rivate窶・ time: 窶倪・ done: false, date: today },
];
const { data: inserted } = await supabase.from(窶・asks窶・.insert(defaults).select();
return inserted || defaults;
}
return data;
}

async function addTask(userId, name, priority = 窶藁id窶・ {
const today = todayStr();
const { data } = await supabase.from(窶・asks窶・
.insert({ user_id: userId, name, priority, cat: 窶・ork窶・ time: 窶倪・ done: false, date: today }).select();
return data?.[0];
}

async function completeTask(userId, name) {
const today = todayStr();
const { data } = await supabase.from(窶・asks窶・.select(窶・窶・
.eq(窶・ser_id窶・ userId).eq(窶賄ate窶・ today).ilike(窶蕨ame窶・ `%${name}%`);
if (!data || data.length === 0) return null;
await supabase.from(窶・asks窶・.update({ done: true }).eq(窶亙d窶・ data[0].id);
return data[0];
}

async function getHabit(userId, date) {
const { data } = await supabase.from(窶鷲abits窶・.select(窶・窶・
.eq(窶・ser_id窶・ userId).eq(窶賄ate窶・ date).single();
return data;
}

async function saveHabit(userId, date, habitData) {
const existing = await getHabit(userId, date);
if (existing) {
const { data } = await supabase.from(窶鷲abits窶・.update(habitData)
.eq(窶・ser_id窶・ userId).eq(窶賄ate窶・ date).select();
return data?.[0];
} else {
const { data } = await supabase.from(窶鷲abits窶・
.insert({ user_id: userId, date, ...habitData }).select();
return data?.[0];
}
}

async function getLast7Habits(userId) {
const last7 = [];
for (let i = 6; i >= 0; i--) {
const d = new Date(); d.setDate(d.getDate() - i);
const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
last7.push(jst.toISOString().split(窶狼窶・[0]);
}
const { data } = await supabase.from(窶鷲abits窶・.select(窶・窶・
.eq(窶・ser_id窶・ userId).in(窶賄ate窶・ last7);
return data || [];
}

function parseCommand(msg) {
const t = msg.trim();
if (/^(繧ｿ繧ｹ繧ｯ|todo|莉頑律|繧・ｋ縺薙→)$/i.test(t)) return { type: 窶・asks_list窶・};
const doneMatch = t.match(/^(螳御ｺ・done)\s+(.+)/);
if (doneMatch) return { type: 窶・ask_done窶・ name: doneMatch[2] };
const addMatch = t.match(/^(霑ｽ蜉|add)\s+(.+)/);
if (addMatch) return { type: 窶・ask_add窶・ name: addMatch[2] };
if (/^(險倬鹸|log)/.test(t)) {
const data = {};
const kmMatch = t.match(/襍ｰ陦・\d+.?\d*)km/);
const minMatch = t.match(/(\d+)min/);
const sleepMatch = t.match(/逹｡逵(\d+.?\d*)h/);
const weightMatch = t.match(/菴馴㍾(\d+.?\d*)kg/);
const calMatch = t.match(/(\d+)kcal/);
const simMatch = t.match(/繧ｷ繝溘Η(\d+)min/);
if (kmMatch) data.run_km = parseFloat(kmMatch[1]);
if (minMatch) data.run_min = parseInt(minMatch[1]);
if (sleepMatch) data.sleep_h = parseFloat(sleepMatch[1]);
if (weightMatch) data.weight_kg = parseFloat(weightMatch[1]);
if (calMatch) data.cal_kcal = parseInt(calMatch[1]);
if (simMatch) data.sim_min = parseInt(simMatch[1]);
return { type: 窶鷲abit_log窶・ data };
}
if (/^(莉頑律縺ｮ險倬鹸|險倬鹸遒ｺ隱鋼繝ｭ繧ｰ)$/.test(t)) return { type: 窶鷲abit_today窶・};
if (/^(蛻・梵|analyze|騾ｱ谺｡|莉企ｱ)$/.test(t)) return { type: 窶和nalysis窶・};
if (/^(to do 繧｢繝励Μ|todo繧｢繝励Μ|繧｢繝励Μ|todo)$/i.test(t)) return { type: 窶和pp_url窶・};
if (/^(繝倥Ν繝慾help|?)$/.test(t)) return { type: 窶鷲elp窶・};
return { type: 窶歪hat窶・};
}

async function handleCommand(cmd, userId, originalMsg) {
const today = todayStr();
switch (cmd.type) {
case 窶・asks_list窶・ {
const tasks = await getTasks(userId);
const pending = tasks.filter(t => !t.done);
const done = tasks.filter(t => t.done);
const priLabel = { must: 窶會沐ｴ窶・ high: 窶會沺窶・ mid: 窶會沐ｵ窶・ low: 窶倪圻窶・};
let text = `搭 莉頑律縺ｮ繧ｿ繧ｹ繧ｯ・・{today}・噂n\n`;
if (pending.length) { text += 窶倥先悴螳御ｺ・曾n窶・ text += pending.map(t => `${priLabel[t.priority]} ${t.name}`).join(窶兔n窶・; }
if (done.length) { text += 窶禄n\n縲仙ｮ御ｺ・ｸ医∩ 笨薙曾n窶・ text += done.map(t => `笨・${t.name}`).join(窶兔n窶・; }
text += `\n\n螳御ｺ・ ${done.length}/${tasks.length}`;
return text;
}
case 窶・ask_add窶・ { await addTask(userId, cmd.name); return `笨・繧ｿ繧ｹ繧ｯ繧定ｿｽ蜉縺励∪縺励◆・―n縲・{cmd.name}縲港; }
case 窶・ask_done窶・ {
const task = await completeTask(userId, cmd.name);
if (task) return `脂 螳御ｺ・＠縺ｾ縺励◆・―n縲・{task.name}縲構n縺顔夢繧梧ｧ假ｼ～;
return `縲・{cmd.name}縲阪↓荳閾ｴ縺吶ｋ繧ｿ繧ｹ繧ｯ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲Ａ;
}
case 窶鷲abit_log窶・ {
const rec = await saveHabit(userId, today, cmd.data);
let text = `投 ${today} 縺ｮ險倬鹸繧剃ｿ晏ｭ倥＠縺ｾ縺励◆・―n\n`;
if (rec?.run_km) text += `純 襍ｰ陦・ ${rec.run_km}km${rec.run_min ? ` / ${rec.run_min}min` : ''}\n`;
if (rec?.sleep_h) text += `嫌 逹｡逵: ${rec.sleep_h}h\n`;
if (rec?.weight_kg) text += `笞厄ｸ・菴馴㍾: ${rec.weight_kg}kg\n`;
if (rec?.cal_kcal) text += `些 繧ｫ繝ｭ繝ｪ繝ｼ: ${rec.cal_kcal}kcal\n`;
if (rec?.sim_min) text += `式 繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ: ${rec.sim_min}min\n`;
return text.trim();
}
case 窶鷲abit_today窶・ {
const rec = await getHabit(userId, today);
if (!rec) return `投 莉頑律・・{today}・峨・縺ｾ縺險倬鹸縺後≠繧翫∪縺帙ｓ縲・n\n萓・ 險倬鹸 襍ｰ陦・.5km 45min 逹｡逵7h 菴馴㍾66kg`;
let text = `投 莉頑律・・{today}・峨・險倬鹸\n\n`;
if (rec.run_km) text += `純 襍ｰ陦・ ${rec.run_km}km${rec.run_min ? ` / ${rec.run_min}min` : ''}\n`;
if (rec.sleep_h) text += `嫌 逹｡逵: ${rec.sleep_h}h\n`;
if (rec.weight_kg) text += `笞厄ｸ・菴馴㍾: ${rec.weight_kg}kg\n`;
if (rec.cal_kcal) text += `些 繧ｫ繝ｭ繝ｪ繝ｼ: ${rec.cal_kcal}kcal\n`;
if (rec.sim_min) text += `式 繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ: ${rec.sim_min}min\n`;
return text.trim();
}
case 窶和nalysis窶・ {
const week = await getLast7Habits(userId);
if (!week.length) return 窶會沒・逶ｴ霑・譌･髢薙・繝・・繧ｿ縺後≠繧翫∪縺帙ｓ縲・n縺ｾ縺夊ｨ倬鹸繧偵▽縺代※縺九ｉ蛻・梵縺励※縺上□縺輔＞・≫・
const avg = f => { const v = week.map(h => h[f]).filter(x => x != null); return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : 窶倪披・ };
const summary = week.map(r => `${r.date}: 襍ｰ陦・{r.run_km ?? '窶・}km(${r.run_min ?? '窶・}min), 逹｡逵${r.sleep_h ?? '窶・}h, 菴馴㍾${r.weight_kg ?? '窶・}kg, 繧ｫ繝ｭ繝ｪ繝ｼ${r.cal_kcal ?? '窶・}kcal, 繧ｷ繝溘Η${r.sim_min ?? '窶・}min`).join(窶兔n窶・;
const prompt = `縺ゅ↑縺溘・FIA F4繝ｬ繝ｼ繧ｷ繝ｳ繧ｰ繝峨Λ繧､繝舌・蜈ｼ繧ｫ繝ｼ繧ｷ繝ｧ繝・・繧ｪ繝ｼ繝翫・縺ｮ繧ｳ繧ｦ繧ｿ縺輔ｓ蟆ょｱ槭・繝輔ぅ繧ｸ繧ｫ繝ｫ繧ｳ繝ｼ繝√〒縺吶ゆｻ･荳九・逶ｴ霑・譌･髢薙・繝・・繧ｿ繧貞・譫舌＠縺ｦ縺上□縺輔＞縲・n\n${summary}\n\n蟷ｳ蝮・ 繝ｩ繝ｳ繝九Φ繧ｰ${avg('run_km')}km/譌･, 逹｡逵${avg('sleep_h')}h/譌･\n\n1.莉企ｱ縺ｮ邱剰ｩ・2譁・ 2.濶ｯ縺九▲縺溽せ 3.謾ｹ蝟・せ 4.譚･騾ｱ縺ｮ繧｢繝峨ヰ繧､繧ｹ3縺､ 繧堤ｰ｡貎斐↓譌･譛ｬ隱槭〒縲・INE縺ｧ隱ｭ縺ｿ繧・☆縺・ｽ｢蠑上〒縲Ａ;
const response = await anthropic.messages.create({ model: 窶歪laude-sonnet-4-6窶・ max_tokens: 800, messages: [{ role: 窶・ser窶・ content: prompt }] });
return response.content[0].text;
}
case 窶和pp_url窶・ return `導 KOUTA OS 縺ｯ縺薙■繧会ｼ―n\nhttps://line-claude-bot-yznu.onrender.com/app\n\nTo-do繝ｻ鄙呈・險倬鹸繝ｻ繧ｰ繝ｩ繝輔・AI蛻・梵縺御ｽｿ縺医∪縺吶Ａ;
case 窶鷲elp窶・ return `当 菴ｿ縺・婿\n\n縲舌ち繧ｹ繧ｯ縲曾n繝ｻ繧ｿ繧ｹ繧ｯ 竊・莉頑律縺ｮ荳隕ｧ\n繝ｻ霑ｽ蜉 笳銀雷 竊・繧ｿ繧ｹ繧ｯ霑ｽ蜉\n繝ｻ螳御ｺ・笳銀雷 竊・繧ｿ繧ｹ繧ｯ螳御ｺ・n\n縲千ｿ呈・險倬鹸縲曾n繝ｻ險倬鹸 襍ｰ陦・.5km 45min 逹｡逵7h 菴馴㍾66kg\n繝ｻ莉頑律縺ｮ險倬鹸 竊・遒ｺ隱構n\n縲植I蛻・梵縲曾n繝ｻ蛻・梵 竊・莉企ｱ縺ｮ鄙呈・繧貞・譫申n\n縲舌◎縺ｮ莉悶曾n繝ｻ閾ｪ逕ｱ縺ｫ隧ｱ縺励°縺代ｋ縺ｨ繧ｳ繝ｼ繝√′霑皮ｭ斐＠縺ｾ縺呻ｼ～;
case 窶歪hat窶・
default: {
if (!conversationHistory[userId]) conversationHistory[userId] = [];
const todayRec = await getHabit(userId, today);
const tasks = await getTasks(userId);
const pendingTasks = tasks.filter(t => !t.done).map(t => t.name).join(窶・ 窶・;
const systemPrompt = `縺ゅ↑縺溘・FIA F4繝ｬ繝ｼ繧ｷ繝ｳ繧ｰ繝峨Λ繧､繝舌・蜈ｼ繧ｫ繝ｼ繧ｷ繝ｧ繝・・繧ｪ繝ｼ繝翫・縺ｮ繧ｳ繧ｦ繧ｿ縺輔ｓ蟆ょｱ槭・繝代・繧ｽ繝翫Ν繧ｳ繝ｼ繝∝・繧｢繧ｷ繧ｹ繧ｿ繝ｳ繝医〒縺吶・繧ｳ繧ｦ繧ｿ縺輔ｓ縺ｫ縺､縺・※・・
- 豈取悃7譎ょ濠襍ｷ蠎翫・譎ゅ↓4.5km繝ｩ繝ｳ繝九Φ繧ｰ縺励※蜃ｺ遉ｾ
- J窶冱 Racing縺ｨ縺・≧繝帙Φ繝蟆る摩繝√Η繝ｼ繝九Φ繧ｰ繧ｷ繝ｧ繝・・縺ｮ繧ｪ繝ｼ繝翫・蜈ｼ繝槭ロ繝ｼ繧ｸ繝｣繝ｼ
- FIA F4繝ｬ繝ｼ繧ｷ繝ｳ繧ｰ繝峨Λ繧､繝舌・縺ｨ縺励※繧よｴｻ蜍穂ｸｭ
- 繝輔・繝峨Ο繧ｹ繧｢繝励Μ縺ｮ蝟ｶ讌ｭ諡・ｽ薙ｂ蜈ｼ莉ｻ

莉頑律・・{today}・峨・迥ｶ豕・ｼ・
- 譛ｪ螳御ｺ・ち繧ｹ繧ｯ: ${pendingTasks || 窶倥↑縺冷凩
- 莉頑律縺ｮ險倬鹸: ${todayRec ? `襍ｰ陦・{todayRec.run_km ?? '窶・}km, 逹｡逵${todayRec.sleep_h ?? '窶・}h, 菴馴㍾${todayRec.weight_kg ?? '窶・}kg` : 窶倥∪縺縺ｪ縺冷凩

譌･譛ｬ隱槭〒邁｡貎斐↓霑皮ｭ斐＠縺ｦ縺上□縺輔＞縲・INE縺ｪ縺ｮ縺ｧ遏ｭ繧√↓縲Ａ;
conversationHistory[userId].push({ role: 窶・ser窶・ content: originalMsg });
if (conversationHistory[userId].length > 20) conversationHistory[userId] = conversationHistory[userId].slice(-20);
const response = await anthropic.messages.create({ model: 窶歪laude-sonnet-4-6窶・ max_tokens: 1000, system: systemPrompt, messages: conversationHistory[userId] });
const replyText = response.content[0].text;
conversationHistory[userId].push({ role: 窶和ssistant窶・ content: replyText });
return replyText;
}
}
}

const app = express();
app.use(express.static(__dirname));
app.get(窶・窶・ (req, res) => res.send(窶婁OUTA OS Bot is running! 庶・鞘・);
app.get(窶・app窶・ (req, res) => res.sendFile(__dirname + 窶・kouta_os.html窶・);
app.post(窶・api/analyze窶・ express.json(), async (req, res) => {
try {
const { prompt } = req.body;
const response = await anthropic.messages.create({ model: 窶歪laude-sonnet-4-6窶・ max_tokens: 1000, messages: [{ role: 窶・ser窶・ content: prompt }] });
res.json({ text: response.content[0].text });
} catch (err) { res.status(500).json({ error: err.message }); }
});
app.post(窶・webhook窶・ line.middleware(lineConfig), async (req, res) => {
try { await Promise.all(req.body.events.map(handleEvent)); res.sendStatus(200); }
catch (err) { console.error(窶聾ebhook error:窶・ err); res.sendStatus(500); }
});

async function handleEvent(event) {
if (event.type !== 窶藁essage窶・|| event.message.type !== 窶・ext窶・ return;
const userId = event.source.userId;
const userMessage = event.message.text;
try {
const cmd = parseCommand(userMessage);
const replyText = await handleCommand(cmd, user


