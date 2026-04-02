const express = require('express');
const line = require('@line/bot-sdk');
const Anthropic = require('@anthropic-ai/sdk');

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

// ===== データストア（メモリ） =====
const conversationHistory = {};

// タスク・習慣データをユーザーごとに管理
const userData = {};

function getUser(userId) {
  if (!userData[userId]) {
    userData[userId] = {
      tasks: [
        { id: 1, name: '起床 7:30', priority: 'must', done: false },
        { id: 2, name: 'ランニング 4.5km → 出社', priority: 'must', done: false },
        { id: 3, name: 'Claudeの研究・API活用', priority: 'high', done: false },
        { id: 4, name: 'フードロスアプリ 営業パート', priority: 'high', done: false },
        { id: 5, name: '会社アパレル業務', priority: 'mid', done: false },
        { id: 6, name: 'レーシングシミュレーター', priority: 'low', done: false },
      ],
      habits: [],
    };
  }
  return userData[userId];
}

function todayStr() {
  const d = new Date();
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split('T')[0];
}

// ===== コマンド解析 =====
function parseCommand(msg) {
  const t = msg.trim();

  // タスク一覧
  if (/^(タスク|todo|今日|やること)$/i.test(t)) return { type: 'tasks_list' };

  // タスク完了
  const doneMatch = t.match(/^(完了|done)\s+(.+)/);
  if (doneMatch) return { type: 'task_done', name: doneMatch[2] };

  // タスク追加
  const addMatch = t.match(/^(追加|add)\s+(.+)/);
  if (addMatch) return { type: 'task_add', name: addMatch[2] };

  // 習慣記録
  // 例: 記録 走行4.5km 45min 睡眠7h 体重66kg
  if (/^(記録|log)/.test(t)) {
    const data = {};
    const kmMatch = t.match(/走行(\d+\.?\d*)km/);
    const minMatch = t.match(/(\d+)min/);
    const sleepMatch = t.match(/睡眠(\d+\.?\d*)h/);
    const weightMatch = t.match(/体重(\d+\.?\d*)kg/);
    const calMatch = t.match(/(\d+)kcal/);
    const simMatch = t.match(/シミュ(\d+)min/);
    if (kmMatch) data.runKm = parseFloat(kmMatch[1]);
    if (minMatch) data.runMin = parseInt(minMatch[1]);
    if (sleepMatch) data.sleepH = parseFloat(sleepMatch[1]);
    if (weightMatch) data.weightKg = parseFloat(weightMatch[1]);
    if (calMatch) data.calKcal = parseInt(calMatch[1]);
    if (simMatch) data.simMin = parseInt(simMatch[1]);
    return { type: 'habit_log', data };
  }

  // 今日の記録確認
  if (/^(今日の記録|記録確認|ログ)$/.test(t)) return { type: 'habit_today' };

  // AI分析
  if (/^(分析|analyze|週次|今週)$/.test(t)) return { type: 'analysis' };

  // アプリ
  if (/^(to do アプリ|todoアプリ|アプリ|todo)$/i.test(t)) return { type: 'app_url' };

  // ヘルプ
  if (/^(ヘルプ|help|\?)$/.test(t)) return { type: 'help' };

  // 通常会話
  return { type: 'chat' };
}

// ===== コマンド処理 =====
async function handleCommand(cmd, userId, originalMsg) {
  const user = getUser(userId);
  const today = todayStr();

  switch (cmd.type) {
    case 'tasks_list': {
      const pending = user.tasks.filter(t => !t.done);
      const done = user.tasks.filter(t => t.done);
      const priLabel = { must: '🔴', high: '🟠', mid: '🔵', low: '⚫' };
      let text = `📋 今日のタスク（${today}）\n\n`;
      if (pending.length) {
        text += '【未完了】\n';
        text += pending.map(t => `${priLabel[t.priority]} ${t.name}`).join('\n');
      }
      if (done.length) {
        text += '\n\n【完了済み ✓】\n';
        text += done.map(t => `✅ ${t.name}`).join('\n');
      }
      text += `\n\n完了: ${done.length}/${user.tasks.length}`;
      return text;
    }

    case 'task_add': {
      const newTask = { id: Date.now(), name: cmd.name, priority: 'mid', done: false };
      user.tasks.push(newTask);
      return `✅ タスクを追加しました！\n「${cmd.name}」`;
    }

    case 'task_done': {
      const task = user.tasks.find(t => t.name.includes(cmd.name));
      if (task) {
        task.done = true;
        return `🎉 完了しました！\n「${task.name}」\nお疲れ様！`;
      }
      return `「${cmd.name}」に一致するタスクが見つかりませんでした。\n「タスク」で一覧を確認してください。`;
    }

    case 'habit_log': {
      const existing = user.habits.find(h => h.date === today);
      const rec = existing || { date: today };
      Object.assign(rec, cmd.data);
      if (!existing) user.habits.push(rec);

      let text = `📊 ${today} の記録を保存しました！\n\n`;
      if (rec.runKm) text += `🏃 走行: ${rec.runKm}km${rec.runMin ? ` / ${rec.runMin}min` : ''}\n`;
      if (rec.sleepH) text += `🌙 睡眠: ${rec.sleepH}h\n`;
      if (rec.weightKg) text += `⚖️ 体重: ${rec.weightKg}kg\n`;
      if (rec.calKcal) text += `🍱 カロリー: ${rec.calKcal}kcal\n`;
      if (rec.simMin) text += `🎮 シミュレーター: ${rec.simMin}min\n`;
      return text.trim();
    }

    case 'habit_today': {
      const rec = user.habits.find(h => h.date === today);
      if (!rec) return `📊 今日（${today}）はまだ記録がありません。\n\n例: 記録 走行4.5km 45min 睡眠7h 体重66kg`;
      let text = `📊 今日（${today}）の記録\n\n`;
      if (rec.runKm) text += `🏃 走行: ${rec.runKm}km${rec.runMin ? ` / ${rec.runMin}min` : ''}\n`;
      if (rec.sleepH) text += `🌙 睡眠: ${rec.sleepH}h\n`;
      if (rec.weightKg) text += `⚖️ 体重: ${rec.weightKg}kg\n`;
      if (rec.calKcal) text += `🍱 カロリー: ${rec.calKcal}kcal\n`;
      if (rec.simMin) text += `🎮 シミュレーター: ${rec.simMin}min\n`;
      return text.trim();
    }

    case 'analysis': {
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
        last7.push(jst.toISOString().split('T')[0]);
      }
      const week = user.habits.filter(h => last7.includes(h.date));
      if (!week.length) return '📊 直近7日間のデータがありません。\nまず記録をつけてから分析してください！';

      const avg = f => {
        const v = week.map(h => h[f]).filter(x => x != null);
        return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '—';
      };
      const summary = week.map(r =>
        `${r.date}: 走行${r.runKm ?? '—'}km(${r.runMin ?? '—'}min), 睡眠${r.sleepH ?? '—'}h, 体重${r.weightKg ?? '—'}kg, カロリー${r.calKcal ?? '—'}kcal, シミュ${r.simMin ?? '—'}min`
      ).join('\n');

      const prompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のフィジカルコーチです。以下の直近7日間のデータを分析してください。\n\n${summary}\n\n平均: ランニング${avg('runKm')}km/日, 睡眠${avg('sleepH')}h/日\n\n1.今週の総評(2文) 2.良かった点 3.改善点 4.来週のアドバイス3つ を簡潔に日本語で。LINEで読みやすい形式で。`;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.content[0].text;
    }

    case 'app_url': {
      const appUrl = process.env.RENDER_EXTERNAL_URL
        ? `${process.env.RENDER_EXTERNAL_URL}/app`
        : 'https://line-claude-bot.onrender.com/app';
      return `📱 KOUTA OS はこちら！\n\n${appUrl}\n\nTo-do・習慣記録・グラフ・AI分析が使えます。`;
    }

    case 'help': {
      return `📖 使い方\n\n` +
        `【タスク】\n` +
        `・タスク → 今日の一覧\n` +
        `・追加 ○○ → タスク追加\n` +
        `・完了 ○○ → タスク完了\n\n` +
        `【習慣記録】\n` +
        `・記録 走行4.5km 45min 睡眠7h 体重66kg\n` +
        `・今日の記録 → 確認\n\n` +
        `【AI分析】\n` +
        `・分析 → 今週の習慣を分析\n\n` +
        `【その他】\n` +
        `・自由に話しかけるとコーチが返答します！`;
    }

    case 'chat':
    default: {
      // 通常会話（コーチモード）
      if (!conversationHistory[userId]) conversationHistory[userId] = [];

      const user2 = getUser(userId);
      const todayRec = user2.habits.find(h => h.date === today);
      const pendingTasks = user2.tasks.filter(t => !t.done).map(t => t.name).join(', ');

      const systemPrompt = `あなたはFIA F4レーシングドライバー兼カーショップオーナーのコウタさん専属のパーソナルコーチ兼アシスタントです。
コウタさんについて：
- 毎朝7時半起床、8時に4.5kmランニングして出社
- J's Racingというホンダ専門チューニングショップのオーナー兼マネージャー
- FIA F4レーシングドライバーとしても活動中
- フードロスアプリの営業担当も兼任

今日（${today}）の状況：
- 未完了タスク: ${pendingTasks || 'なし'}
- 今日の記録: ${todayRec ? `走行${todayRec.runKm ?? '—'}km, 睡眠${todayRec.sleepH ?? '—'}h, 体重${todayRec.weightKg ?? '—'}kg` : 'まだなし'}

日本語で簡潔に返答してください。LINEなので短めに。`;

      conversationHistory[userId].push({ role: 'user', content: originalMsg });
      if (conversationHistory[userId].length > 20) {
        conversationHistory[userId] = conversationHistory[userId].slice(-20);
      }

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: conversationHistory[userId],
      });

      const replyText = response.content[0].text;
      conversationHistory[userId].push({ role: 'assistant', content: replyText });
      return replyText;
    }
  }
}

// ===== Expressサーバー =====
const app = express();

// ヘルスチェック
app.get('/', (req, res) => res.send('KOUTA OS Bot is running! 🏎️'));

// Webhookエンドポイント
app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    await Promise.all(events.map(handleEvent));
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

// ===== イベント処理 =====
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const userId = event.source.userId;
  const userMessage = event.message.text;

  try {
    const cmd = parseCommand(userMessage);
    const replyText = await handleCommand(cmd, userId, userMessage);

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: replyText }],
    });
  } catch (err) {
    console.error('Error:', err);
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: 'すみません、エラーが発生しました。もう一度お試しください。' }],
    });
  }
}

// ===== サーバー起動 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`KOUTA OS Bot running on port ${PORT}`);
});
