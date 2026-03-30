# LINE × Claude Bot

LINEでClaudeと会話できるBotです。会話履歴も保持されます。

---

## 🚀 デプロイ手順（3ステップ）

### ① LINE Developersでの準備（5分）

1. [LINE Developers](https://developers.line.biz/) にログイン
2. 「プロバイダー作成」→「Messaging APIチャンネル作成」
3. チャンネル基本設定から **Channel Secret** をコピー
4. Messaging API設定から **Channel Access Token** を発行してコピー
5. 「応答メッセージ」→ **オフ** にする
6. 「Webhookの利用」→ **オン** にする（URLは後で設定）

---

### ② GitHubにpush

```bash
cd line-claude-bot
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/line-claude-bot.git
git push -u origin main
```

---

### ③ Renderにデプロイ（5分）

1. [render.com](https://render.com) にログイン（GitHub連携）
2. 「New +」→「Web Service」→ GitHubリポジトリを選択
3. 以下の環境変数を設定：

| Key | Value |
|-----|-------|
| `LINE_CHANNEL_SECRET` | LINE DevelopersのChannel Secret |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE DevelopersのChannel Access Token |
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/) のAPIキー |

4. 「Create Web Service」でデプロイ開始
5. デプロイ完了後、表示されるURL（例: `https://line-claude-bot.onrender.com`）をコピー

---

### ④ WebhookURLを設定（1分）

LINE Developers → Messaging API設定 → Webhook URL に：
```
https://line-claude-bot.onrender.com/webhook
```
を設定して「検証」ボタンを押す → 成功すればOK！

---

## ✅ 動作確認

LINE公式アカウントにメッセージを送ると、Claudeが返答します。
会話の文脈も覚えています（最新20件）。

---

## 📁 ファイル構成

```
line-claude-bot/
├── index.js        # メインサーバー
├── package.json    # 依存パッケージ
├── render.yaml     # Renderデプロイ設定
├── .gitignore
└── README.md
```
