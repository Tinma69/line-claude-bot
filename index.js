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

// ユーザーごとの会話履歴（メモリ）
const conversationHistory = {};

// ===== Expressサーバー =====
const app = express();

// ヘルスチェック用（Renderが必要とする）
app.get('/', (req, res) => res.send('LINE Claude Bot is running!'));

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
  // テキストメッセージ以外は無視
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const userId = event.source.userId;
  const userMessage = event.message.text;

  // 会話履歴を初期化
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  // ユーザーのメッセージを追加
  conversationHistory[userId].push({
    role: 'user',
    content: userMessage,
  });

  // 履歴が長くなりすぎないよう最新20件だけ保持
  if (conversationHistory[userId].length > 20) {
    conversationHistory[userId] = conversationHistory[userId].slice(-20);
  }

  try {
    // Claudeに問い合わせ
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'あなたは親切なアシスタントです。日本語で簡潔に返答してください。',
      messages: conversationHistory[userId],
    });

    const replyText = response.content[0].text;

    // Claudeの返答を履歴に追加
    conversationHistory[userId].push({
      role: 'assistant',
      content: replyText,
    });

    // LINEに返信
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: replyText }],
    });
  } catch (err) {
    console.error('Claude API error:', err);
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: 'すみません、エラーが発生しました。もう一度お試しください。' }],
    });
  }
}

// ===== サーバー起動 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
