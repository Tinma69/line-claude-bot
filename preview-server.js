const http = require('http');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// .envファイルから環境変数を読み込む
try {
  const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g,'');
  }
} catch {}

const { createClient } = require('@supabase/supabase-js');

const PORT = 3002;
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'POST' && req.url === '/api/race-scan') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        const { image, mimeType = 'image/jpeg' } = JSON.parse(body);
        let msg;
        {
          try {
            msg = await anthropic.messages.create({
              model: 'claude-sonnet-4-6',
              max_tokens: 4000,
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
- 分がある場合:「1:47'78」「1:47.10」→ "1:47.78"
- 手書きのため数字が読みづらい場合は前後の周回タイムと比較して自然な値か確認する
- 1周ごとに1〜2秒程度の差が通常。極端に短いまたは長いタイムは読み間違いの可能性が高い

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
- 数字表記（例: 26.4.9 / 26/4/9）→ 年が2桁なら2000年代として補完

【ドライバーの読み取り】
- 「DRIVER」「ドライバー」「氏名」「NAME」などのラベルを探す
- セッションごとにドライバーが異なる場合は各セッションのdriverに入れる
- 全セッション共通の場合も各セッションのdriverに同じ名前を入れる
- 読み取れない場合は空文字("")

【その他】
- 1枚のシートに左右2セッション分ある場合は両方読む
- サーキット名・車両名も読む

返却形式（JSON only、前後に説明文なし）:
{
  "date": "YYYY-MM-DD",
  "circuit": "サーキット名",
  "car": "車両名",
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
        {"num": "1", "time": "47.10"},
        {"num": "2", "time": "1:47.78"}
      ]
    }
  ]
}`
              }
            ]
          }]
            });
          } catch (modelErr) { throw modelErr; }
        }
        const raw = msg.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const data = JSON.parse(raw);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (e) {
        console.error('race-scan error:', e.message, e.status || '');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // データ同期API
  if (req.method === 'POST' && req.url === '/api/sync/save') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        if (!supabase) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: true, local: true })); return; }
        const { key, data } = JSON.parse(body);
        const { error } = await supabase.from('web_data').upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        if (error) throw error;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error('sync save error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/sync/load/')) {
    try {
      if (!supabase) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ data: null })); return; }
      const key = req.url.replace('/api/sync/load/', '');
      const { data, error } = await supabase.from('web_data').select('data, updated_at').eq('key', key).single();
      if (error && error.code === 'PGRST116') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ data: null })); return; }
      if (error) throw error;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: data.data, updated_at: data.updated_at }));
    } catch (e) {
      console.error('sync load error:', e.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Serve HTML
  const file = path.join(__dirname, 'kouta_os.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
