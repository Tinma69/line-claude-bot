# KOUTA OS — LINE × Claude Bot

LINEとWebアプリ両方で動くパーソナルコーチ＆タスク管理システム。

---

## アーキテクチャ

```
LINE メッセージ
      ↓
Orchestrator (Claude Haiku — 高速ルーティング)
      ↓
┌─────────────────────────────────────┐
│ TaskAgent     │ タスク管理 (DB only) │
│ HabitAgent    │ 習慣記録 (DB only)   │
│ AnalysisAgent │ 週次分析 (Sonnet)    │
│ InfoAgent     │ 静的応答 (Claude不要)│
│ CoachAgent    │ 自由会話 (Sonnet)    │
└─────────────────────────────────────┘

Webアプリ (KOUTA OS)
      ↓
/api/chat (Claude Haiku ルーティング)
      ↓
┌─────────────────────────────────────┐
│ AnalysisAgent │ 習慣データ分析       │
│ TaskAgent     │ タスクアドバイス     │
│ CoachAgent    │ 自由会話 (会話履歴付)│
└─────────────────────────────────────┘
```

---

## 機能

### LINEボット
| コマンド | 動作 |
|---|---|
| 自然な日本語で「タスク見せて」など | タスク一覧 |
| 「〇〇を追加して」 | タスク追加 |
| 「〇〇が終わった」 | タスク完了 |
| 「走行4.5km 睡眠7h 体重66kg」 | 習慣記録 |
| 「今日の記録見せて」 | 習慣確認 |
| 「今週どうだった？」 | AI週次分析 |
| 自由に話しかける | コーチが返答 |

### Webアプリ (KOUTA OS)
- **TODAY** — タスク管理・完了チェック
- **LOG** — 習慣記録（ランニング・睡眠・体重・カロリー・シミュレーター）
- **GRAPH** — 直近7日のグラフ
- **AI** — マルチエージェントチャット（会話履歴付き）

---

## 環境変数

| Key | 取得元 |
|---|---|
| `LINE_CHANNEL_SECRET` | LINE Developers |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Developers |
| `ANTHROPIC_API_KEY` | Anthropic Console |
| `SUPABASE_URL` | Supabase プロジェクト設定 |
| `SUPABASE_KEY` | Supabase プロジェクト設定 (anon key) |

---

## Supabase テーブル構成

```sql
-- タスク
create table tasks (
  id bigint generated always as identity primary key,
  user_id text,
  name text,
  priority text,  -- must / high / mid / low
  cat text,       -- work / private
  time text,
  done boolean default false,
  date text
);

-- 習慣記録
create table habits (
  id bigint generated always as identity primary key,
  user_id text,
  date text,
  run_km numeric,
  run_min int,
  sleep_h numeric,
  weight_kg numeric,
  cal_kcal int,
  sim_min int
);
```

---

## ファイル構成

```
line-claude-bot/
├── index.js        # サーバー + マルチエージェント
├── kouta_os.html   # Webアプリ (React CDN)
├── package.json
├── render.yaml
└── README.md
```

---

## デプロイ (Render)

1. GitHubにpush
2. Renderで Web Service として接続
3. 環境変数5つを設定
4. LINE DevelopersのWebhook URLに `https://your-url.onrender.com/webhook` を設定
