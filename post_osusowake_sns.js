// おすそわけ SNS自動投稿スクリプト（X + Threads）
// 使い方:
//   node post_osusowake_sns.js --mode daily          # 17:00用: 本日の出品まとめ（ドライラン）
//   node post_osusowake_sns.js --mode theme          # 12:00用: 曜日テーマ投稿（ドライラン）
//   node post_osusowake_sns.js --mode daily --live   # 実際に投稿（要APIキー）
//
// 必要な環境変数（--live時のみ）:
//   X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_SECRET   (X: Read and Write権限)
//   THREADS_USER_ID / THREADS_ACCESS_TOKEN                        (Threads Graph API)
//
// データ源: https://osusowakejapan.org/api/bags （ライブ出品）
// 対外表現ルール: 高槻発 / DL3000 / 加盟27店 / 119袋 / メールは hello@osusowakejapan.org

const crypto = require("crypto");
const https = require("https");

const ARGS = process.argv.slice(2);
const MODE = ARGS.includes("--mode") ? ARGS[ARGS.indexOf("--mode") + 1] : "daily";
const LIVE = ARGS.includes("--live");

const SITE = "osusowakejapan.org";
const APP_URL = "https://osusowakejapan.org";

// ---------- 汎用HTTP ----------
function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ---------- 出品データ取得 ----------
async function fetchBags() {
  const res = await request({ hostname: SITE, path: "/api/bags", method: "GET" });
  if (res.status !== 200) throw new Error(`/api/bags HTTP ${res.status}`);
  const bags = JSON.parse(res.body);
  // 販売中のみ: isActive かつ 在庫あり
  return bags.filter((b) => b.isActive && b.stockCount > 0);
}

function discountPct(b) {
  if (!b.originalPrice || !b.discountedPrice) return 0;
  return Math.round((1 - b.discountedPrice / b.originalPrice) * 100);
}
function fmtTime(t) {
  // "13:45:00" -> "13:45"
  if (!t) return "";
  return String(t).slice(0, 5);
}

// ---------- ① 本日の出品まとめ（17:00） ----------
function buildDailyX(bags) {
  // Xは日本語1文字=2カウントで実質140字。コンパクトに上位を載せる
  const sorted = [...bags].sort((a, b) => discountPct(b) - discountPct(a));
  const top = sorted.slice(0, 3);
  const rest = sorted.length - top.length;
  const trunc = (s, n) => (s && s.length > n ? s.slice(0, n) + "…" : s || "");
  const lines = top.map((b) => {
    const pct = discountPct(b);
    return `・${trunc(b.store?.name, 12)} ${trunc(b.title, 14)} ¥${b.discountedPrice}${pct >= 10 ? `(${pct}%OFF)` : ""}`;
  });
  return [
    `🍱本日のおすそわけ（高槻）`,
    ...lines,
    rest > 0 ? `ほか計${sorted.length}件✨` : ``,
    `閉店前のおいしいをおトクに🕐早い者勝ち！`,
    `📲 ご予約はプロフィールのリンクから`,
    `#高槻 #フードロス`,
  ].filter(Boolean).join("\n");
}

function buildDailyThreads(bags) {
  const sorted = [...bags].sort((a, b) => discountPct(b) - discountPct(a));
  const lines = sorted.map((b) => {
    const pct = discountPct(b);
    const time = `${fmtTime(b.pickupStart)}〜${fmtTime(b.pickupEnd)}`;
    return `🛍 ${b.store?.name || ""}「${b.title}」\n　¥${b.originalPrice} → ¥${b.discountedPrice}${pct >= 10 ? `（${pct}%OFF）` : ""}・受取 ${time}`;
  });
  return [
    `🍱 本日のおすそわけ（高槻）`,
    ``,
    ...lines,
    ``,
    `お店の「まだ美味しい」を、閉店前におトクにレスキュー🌱`,
    `気になる袋は早い者勝ちです！`,
    `👉 ${APP_URL}`,
    ``,
    `#高槻 #フードロス削減 #おすそわけ #高槻グルメ`,
  ].join("\n");
}

// ---------- ② 曜日テーマ投稿（12:00） ----------
// X版はコンパクト、Threads版は少し長め。{n}件などの動的値は使わない（安定運用のため固定文）
const THEMES = {
  1: { // 月: フードロス豆知識
    x: `🌍知ってた？\n日本の食品ロスは年間464万トン。\nひとり毎日お茶碗1杯分💦\n\n高槻の「まだ美味しい」をおトクにレスキュー🍱\n📲プロフのリンクから\n#フードロス #高槻`,
    threads: `🌍 月曜のまめ知識\n\n日本では年間464万トンの食品が、まだ食べられるのに捨てられています。国民ひとりあたり毎日お茶碗1杯分💦\n\n「おすそわけ」は、高槻のお店の“まだ美味しい”を閉店前におトクにレスキューできるアプリです🍱\nあなたの1回の購入が、食品ロスを減らす一歩になります。\n\n👉 ${APP_URL}\n#フードロス削減 #高槻 #おすそわけ`,
  },
  2: { // 火: 加盟店紹介（店名は手動で差し替えても◎）
    x: `🏪高槻のすてきなお店が続々参加中！\nパン・スイーツ・お弁当・ラーメンまで27店🍞🍱\n\nお気に入り登録で出品を見逃さない🔔\n📲プロフのリンクから\n#高槻グルメ #おすそわけ`,
    threads: `🏪 火曜のお店紹介\n\nおすそわけには、高槻を中心に27店の地元のお店が参加しています。\nベーカリー、スイーツ、お弁当、ラーメン、コーヒー…どれも地元で愛されるお店ばかり🍞🍰🍱\n\nアプリでお店を「お気に入り」登録しておくと、出品された瞬間に通知が届きます🔔\n\n👉 ${APP_URL}\n#高槻グルメ #おすそわけ #フードロス削減`,
  },
  3: { // 水: 使い方
    x: `📱おすそわけの使い方はカンタン3ステップ\n①アプリで近くのお店をさがす\n②おトクな袋を予約\n③受取時間にお店へ🛍\n\n登録は最短30秒✨\n📲プロフのリンクから\n#高槻 #おすそわけ`,
    threads: `📱 水曜の使い方ガイド\n\nおすそわけはカンタン3ステップ✨\n① アプリで近くのお店をさがす\n② おトクな袋を予約（オンライン決済）\n③ 受取時間にお店でピックアップ🛍\n\n登録は最短30秒。登録・利用料は無料です。\n「今日の帰り、なにかおトクないかな？」って時にのぞいてみてください🍀\n\n👉 ${APP_URL}\n#高槻 #おすそわけ #フードロス削減`,
  },
  4: { // 木: 実績・感謝
    x: `🎉いつもありがとうございます！\n\n🍱119袋の食品をレスキュー\n🏪高槻中心に27店が参加\n📲累計3,000DL突破\n\n“捨てる”を“おすそわけ”に🌱\n📲プロフのリンクから\n#高槻 #フードロス`,
    threads: `🎉 木曜のご報告\n\nみなさんのおかげで、おすそわけはここまで来ました！\n\n🍱 119袋の食品を廃棄からレスキュー\n🏪 高槻を中心に27店の地元店が参加\n📲 累計3,000ダウンロード突破\n\n“捨てる”を“おすそわけ”に。\nこれからも高槻から、食品ロスのない街を目指します🌱\n\n👉 ${APP_URL}\n#高槻 #フードロス削減 #おすそわけ`,
  },
  5: { // 金: 週末の狙い目
    x: `🍞週末はおすそわけ日和✨\nパンやスイーツの出品が増える傾向🍰\n\n通知ONにして見逃しゼロで週末へ🔔\n📲プロフのリンクから\n#高槻 #週末 #おすそわけ`,
    threads: `🍞 金曜日！週末はおすそわけ日和✨\n\n週末はベーカリーやスイーツ店の出品が増える傾向があります🍰🥐\n「お気に入り」登録＆通知ONにしておくと、おトクな袋を見逃しません🔔\n\n家族のおやつに、自分へのごほうびに。\n高槻の“まだ美味しい”をレスキューしながら、ちょっと得する週末を🍀\n\n👉 ${APP_URL}\n#高槻 #おすそわけ #週末グルメ`,
  },
  6: { // 土: ゆるめ
    x: `☀️よい週末を！\n高槻のどこかで今日も「おすそわけ」が出てるかも🍱\nおでかけ前にチラッとチェック👀\n📲プロフのリンクから\n#高槻 #おすそわけ`,
    threads: `☀️ 土曜日、よい週末を！\n\n高槻のどこかで、今日も「おすそわけ」が出ているかもしれません🍱\nおでかけのついでに、アプリをチラッとのぞいてみてください👀\n\n閉店前のお店の“まだ美味しい”と、あなたの“ちょっとおトク”がつながりますように🍀\n\n👉 ${APP_URL}\n#高槻 #おすそわけ`,
  },
  0: { // 日: ゆるめ・感謝
    x: `🌙今週もありがとうございました！\nあなたの「1袋」が高槻の食品ロスを減らしています🌱\nまた来週もおすそわけで🍱\n📲プロフのリンクから\n#高槻 #フードロス`,
    threads: `🌙 日曜の夜に。\n\n今週も「おすそわけ」を使ってくださったみなさん、ありがとうございました！\nあなたがレスキューした1袋が、確実に高槻の食品ロスを減らしています🌱\n\nまた来週も、お店の“まだ美味しい”をおトクに。\nおやすみなさい🍀\n\n👉 ${APP_URL}\n#高槻 #おすそわけ #フードロス削減`,
  },
};

// ---------- X投稿（OAuth 1.0a・API v2） ----------
function pct(s) { return encodeURIComponent(s).replace(/[!*'()]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()); }
async function postToX(text) {
  const ck = process.env.X_API_KEY, cs = process.env.X_API_SECRET;
  const tk = process.env.X_ACCESS_TOKEN, ts = process.env.X_ACCESS_SECRET;
  if (!ck || !cs || !tk || !ts) throw new Error("X APIキーが未設定（X_API_KEY等）");
  const url = "https://api.x.com/2/tweets";
  const oauth = {
    oauth_consumer_key: ck,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: tk,
    oauth_version: "1.0",
  };
  const paramStr = Object.keys(oauth).sort().map((k) => `${pct(k)}=${pct(oauth[k])}`).join("&");
  const base = `POST&${pct(url)}&${pct(paramStr)}`;
  const key = `${pct(cs)}&${pct(ts)}`;
  oauth.oauth_signature = crypto.createHmac("sha1", key).update(base).digest("base64");
  const authHeader = "OAuth " + Object.keys(oauth).sort().map((k) => `${pct(k)}="${pct(oauth[k])}"`).join(", ");
  const body = JSON.stringify({ text });
  const res = await request({
    hostname: "api.x.com", path: "/2/tweets", method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  }, body);
  if (res.status !== 201) throw new Error(`X投稿失敗 HTTP ${res.status}: ${res.body}`);
  return JSON.parse(res.body);
}

// ---------- Threads投稿（Graph API 2段階） ----------
async function postToThreads(text) {
  const userId = process.env.THREADS_USER_ID, token = process.env.THREADS_ACCESS_TOKEN;
  if (!userId || !token) throw new Error("Threads APIキーが未設定（THREADS_USER_ID等）");
  // 1) コンテナ作成
  const createPath = `/v1.0/${userId}/threads?media_type=TEXT&text=${encodeURIComponent(text)}&access_token=${encodeURIComponent(token)}`;
  const c = await request({ hostname: "graph.threads.net", path: createPath, method: "POST" });
  if (c.status !== 200) throw new Error(`Threadsコンテナ作成失敗 HTTP ${c.status}: ${c.body}`);
  const containerId = JSON.parse(c.body).id;
  // 2) 公開
  const pubPath = `/v1.0/${userId}/threads_publish?creation_id=${containerId}&access_token=${encodeURIComponent(token)}`;
  const p = await request({ hostname: "graph.threads.net", path: pubPath, method: "POST" });
  if (p.status !== 200) throw new Error(`Threads公開失敗 HTTP ${p.status}: ${p.body}`);
  return JSON.parse(p.body);
}

// ---------- メイン ----------
(async () => {
  let xText, threadsText;

  if (MODE === "daily") {
    const bags = await fetchBags();
    if (bags.length === 0) {
      console.log("⚠️ 現在ライブの出品が0件のため、daily投稿はスキップします（空の告知は逆効果）");
      process.exit(0);
    }
    xText = buildDailyX(bags);
    threadsText = buildDailyThreads(bags);
    console.log(`📦 ライブ出品 ${bags.length}件を取得`);
  } else if (MODE === "theme") {
    const dow = new Date().getDay();
    const t = THEMES[dow];
    xText = t.x;
    threadsText = t.threads;
    console.log(`📅 曜日テーマ: ${["日","月","火","水","木","金","土"][dow]}曜`);
  } else {
    console.error(`不明なmode: ${MODE}（daily / theme）`);
    process.exit(1);
  }

  console.log("\n===== X 投稿文 =====\n" + xText);
  console.log("\n===== Threads 投稿文 =====\n" + threadsText);

  if (!LIVE) {
    console.log("\n🔍 ドライラン（--live を付けると実投稿）");
    return;
  }

  console.log("\n🚀 投稿中…");
  const results = [];
  try { const r = await postToX(xText); results.push(`✅ X: 投稿成功 (id: ${r.data?.id})`); }
  catch (e) { results.push(`${e.message.includes("未設定") ? "⏭" : "❌"} X: ${e.message}`); }
  try { const r = await postToThreads(threadsText); results.push(`✅ Threads: 投稿成功 (id: ${r.id})`); }
  catch (e) { results.push(`${e.message.includes("未設定") ? "⏭" : "❌"} Threads: ${e.message}`); }
  results.forEach((r) => console.log(r));
  if (results.some((r) => r.startsWith("❌"))) process.exit(1);
})().catch((e) => { console.error("エラー:", e.message); process.exit(1); });
