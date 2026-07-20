# KOUTA OS — LINE × Claude Bot

> グローバル設定は `~/CLAUDE.md` 参照。アシスタント名はマロ。

## このプロジェクトは
LINE と Web アプリ両方で動くパーソナルコーチ＆タスク管理システム。Render デプロイ済み（`https://line-claude-bot-yznu.onrender.com`）。

## ファイル構成
```
line-claude-bot/
├── index.js        # サーバー + マルチエージェント全体（LINE + Web /api/chat）
├── kouta_os.html   # Webアプリ（React CDN, 4タブ: TODAY/LOG/GRAPH/AI）
├── package.json
├── render.yaml
└── README.md
```

## アーキテクチャ
- **LINE**: Orchestrator (Haiku) → TaskAgent / HabitAgent / AnalysisAgent / InfoAgent / CoachAgent
- **Web**: `/api/chat` (Haiku) → AnalysisAgent / TaskAgent / CoachAgent

## 使用モデル
- Orchestrator: `claude-haiku-4-5-20251001`
- Agent: `claude-sonnet-4-6`

## 環境変数（Render）
LINE_CHANNEL_SECRET / LINE_CHANNEL_ACCESS_TOKEN / ANTHROPIC_API_KEY / SUPABASE_URL / SUPABASE_KEY

## Supabase テーブル
- `tasks` (id, user_id, name, priority, cat, time, done, date)
- `habits` (id, user_id, date, run_km, run_min, sleep_h, weight_kg, cal_kcal, sim_min)
- `web_data` (key, data, updated_at) — RACE機能の同期用

## 開発時の注意
- `index.js` は文字エンコーディング厳守（UTF-8）。過去にShift-JIS混入の事故あり
- 文字化けが出たらすぐエンコーディング確認
- コミットは細かく。RenderはGitHub pushで自動デプロイ

## 進行中の機能
- マルチエージェント（実装済み）
- 会話履歴付きWebチャット（実装済み）
- RACE機能（写真スキャン・Supabase同期・バックアップ）
