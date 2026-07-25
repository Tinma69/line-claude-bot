// おすそわけ 供給ウォッチ（休眠店検出＋声かけ文生成＋週次KPI）
// 使い方:
//   node watch_osusowake_supply.js            # 実行（履歴更新＋レポート生成）
//   ※月曜は週次KPIセクションが自動で付く
//
// 出力:
//   - コンソール＋「おすそわけ_供給レポート_最新.txt」（毎回上書き）
//   - 履歴: data_supply_history.json（日付→出品店ID。日々蓄積して休眠日数を正確化）
//   - LINE通知(任意): 環境変数 LINE_CHANNEL_ACCESS_TOKEN と LINE_TO_USER_ID があれば push
//
// データ源: osusowakejapan.org /api/stores /api/bags（公開API・読み取りのみ）

const fs = require("fs");
const path = require("path");
const https = require("https");

const SITE = "osusowakejapan.org";
const HISTORY_FILE = path.join(__dirname, "data_supply_history.json");
const REPORT_FILE = path.join(__dirname, "おすそわけ_供給レポート_最新.txt");

function get(pathname) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: SITE, path: pathname }, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => {
        if (res.statusCode !== 200) return reject(new Error(`${pathname} HTTP ${res.statusCode}`));
        try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function todayStr(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function loadHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8")); } catch { return {}; }
}

function callToAction(storeName, days) {
  if (days === null) {
    return `${storeName}さん、お世話になっております！最近ご出品がお休みのようですが、お変わりないですか？「今日は余りそう」という日がありましたら、ぜひ一袋からでもおすそわけをお願いします。楽しみに待っているお客様がいます！`;
  }
  return `${storeName}さん、お世話になっております！ここ${days}日ほどご出品がお休みのようですが、お変わりないですか？「今日は余りそう」という日がありましたら、ぜひ一袋からでもおすそわけをお願いします。楽しみに待っているお客様がいます！設定などでお困りごとがあればスタッフがすぐお手伝いします！`;
}

async function pushLine(text) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_TO_USER_ID;
  if (!token || !to) return false;
  const body = JSON.stringify({ to, messages: [{ type: "text", text: text.slice(0, 4900) }] });
  return new Promise((resolve) => {
    const req = https.request({
      hostname: "api.line.me", path: "/v2/bot/message/push", method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }, (res) => resolve(res.statusCode === 200));
    req.on("error", () => resolve(false));
    req.write(body);
    req.end();
  });
}

(async () => {
  const [stores, bags] = await Promise.all([get("/api/stores"), get("/api/bags")]);
  const liveBags = bags.filter((b) => b.isActive && b.stockCount > 0);
  const liveStoreIds = new Set(liveBags.map((b) => b.storeId));

  // 履歴更新（今日出品してた店を記録）
  const history = loadHistory();
  const today = todayStr();
  // 同日に複数回実行しても合算（朝出品→夕方完売の店を休眠扱いしない）
  history[today] = [...new Set([...(history[today] || []), ...liveStoreIds])];
  // 90日より古い履歴は削除
  for (const k of Object.keys(history)) {
    if ((new Date(today) - new Date(k)) / 86400000 > 90) delete history[k];
  }
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 1));

  // 店ごとの「最後に出品を確認した日」
  const lastSeen = {};
  for (const [date, ids] of Object.entries(history)) {
    for (const id of ids) {
      if (!lastSeen[id] || date > lastSeen[id]) lastSeen[id] = date;
    }
  }

  const activeStores = stores.filter((s) => s.isActive !== false);
  const dormant = activeStores
    .filter((s) => !liveStoreIds.has(s.id))
    .map((s) => {
      const seen = lastSeen[s.id];
      const days = seen && seen !== today ? Math.round((new Date(today) - new Date(seen)) / 86400000) : null;
      return { name: s.name, city: s.city || "", days };
    })
    .sort((a, b) => (a.days ?? 999) - (b.days ?? 999));

  // ===== レポート生成 =====
  const L = [];
  L.push(`📦 おすそわけ 供給ウォッチ（${today}）`);
  L.push(``);
  L.push(`✅ 本日出品中: ${liveStoreIds.size}店 / 承認${activeStores.length}店（出品${liveBags.length}件）`);
  const rate = activeStores.length ? Math.round((liveStoreIds.size / activeStores.length) * 100) : 0;
  L.push(`📊 稼働率: ${rate}%${rate < 40 ? " ⚠️ 低め。声かけ推奨" : ""}`);
  L.push(``);
  L.push(`💤 本日出品なし: ${dormant.length}店（声かけ文はコピペで使えます）`);
  L.push(``);
  const top = dormant.slice(0, 8);
  top.forEach((s, i) => {
    const label = s.days === null ? "記録期間内に出品なし" : `${s.days}日出品なし`;
    L.push(`${i + 1}. ${s.name}（${label}）`);
    L.push(`→ ${callToAction(s.name, s.days)}`);
    L.push(``);
  });
  if (dormant.length > top.length) {
    L.push(`…ほか ${dormant.length - top.length}店: ${dormant.slice(top.length).map((s) => s.name).join(" / ")}`);
    L.push(``);
  }

  // ===== 月曜のみ 週次KPI =====
  if (new Date().getDay() === 1) {
    const dates = Object.keys(history).sort().slice(-7);
    const counts = dates.map((d) => history[d].length);
    const avg = counts.length ? (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1) : "0";
    const everActive = new Set(dates.flatMap((d) => history[d]));
    L.push(`📈 ===== 週次KPI（直近${dates.length}日） =====`);
    L.push(`・1日あたり平均 稼働店数: ${avg}店`);
    L.push(`・週内に1回でも出品した店: ${everActive.size}店 / 承認${activeStores.length}店`);
    L.push(`・全く出品しなかった店: ${activeStores.length - everActive.size}店 ← 定期出品の案内を`);
    L.push(`・本日時点の総出品: ${liveBags.length}件`);
    L.push(``);
  }

  const report = L.join("\n");
  console.log(report);
  fs.writeFileSync(REPORT_FILE, report, "utf8");

  const sent = await pushLine(report);
  console.log(sent ? "📲 LINE通知: 送信済み" : "📲 LINE通知: 未設定のためスキップ（ファイル出力のみ）");
})().catch((e) => { console.error("エラー:", e.message); process.exit(1); });
