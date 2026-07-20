// おすそわけ 店頭掲示チラシ（A4タテ・7/1スタート予告型）
// 画像をbase64で埋め込んだ単一HTMLを生成 → Edge headless で PDF 化する
const fs = require("fs");
const path = require("path");

const DIR = "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\";
const LOGO = "C:\\Users\\kusao\\OneDrive\\画像\\logo-01.png";

function b64(p) {
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === "svg" ? "svg+xml" : ext === "jpg" ? "jpeg" : ext;
  return `data:image/${mime};base64,` + fs.readFileSync(p).toString("base64");
}

const img = {
  logo: b64(LOGO),
  qrApp: b64(DIR + "qr_appstore.png"),
  qrWeb: b64(DIR + "qr_webapp.png"),
  qrIg: b64(DIR + "qr_instagram.png"),
};

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>おすそわけ 店頭チラシ</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root{
    --coral:#ef8d8d; --coral-d:#e07a66; --coral-l:#fbe6e1;
    --green:#5cb85c; --green-d:#3f9b46; --ink:#3a3a3a; --sub:#777;
  }
  html,body{ font-family:"Yu Gothic","YuGothic","Meiryo",sans-serif; color:var(--ink); }
  .page{
    width:210mm; height:297mm; position:relative; overflow:hidden;
    display:flex; flex-direction:column; background:#fff;
  }
  /* ===== ヘッダー ===== */
  .hd{ background:#fff; text-align:center; padding:8mm 10mm 4mm; }
  .hd img{ display:block; margin:0 auto; width:50mm; height:auto; }
  .subbar{
    background:var(--coral); color:#fff; text-align:center;
    font-weight:800; font-size:15.5pt; letter-spacing:.04em; padding:3.5mm 10mm;
  }
  .subbar b{ font-size:17.5pt; }
  /* ===== ヒーロー ===== */
  .hero{ text-align:center; padding:8mm 10mm 4mm; }
  .start{
    display:inline-flex; align-items:baseline; gap:3mm;
    color:var(--green-d); font-weight:900; line-height:1;
  }
  .start .d{ font-size:40pt; letter-spacing:-.01em; }
  .start .s{ font-size:19pt; background:var(--green-d); color:#fff; padding:2mm 5mm; border-radius:8px; letter-spacing:.12em; }
  .hero h1{ font-size:29pt; font-weight:900; margin-top:4mm; line-height:1.3; }
  .hero h1 .g{ color:var(--green-d); }
  .hero h1 .c{ color:var(--coral-d); }
  .hero p{ font-size:13pt; color:var(--sub); margin-top:4mm; line-height:1.6; }
  /* ===== STEP ===== */
  .steps{ display:flex; gap:5mm; padding:5mm 14mm 0; }
  .step{ flex:1; text-align:center; position:relative; }
  .step .n{
    width:14mm; height:14mm; margin:0 auto 3mm; border-radius:50%;
    background:var(--coral-l); color:var(--coral-d); font-weight:900; font-size:18pt;
    display:flex; align-items:center; justify-content:center; border:2px solid var(--coral);
  }
  .step .t{ font-size:11.5pt; font-weight:800; line-height:1.4; }
  .step .sub{ font-size:8.5pt; color:var(--sub); margin-top:1.5mm; line-height:1.4; }
  .step:not(:last-child)::after{
    content:"›"; position:absolute; top:4mm; right:-4mm; font-size:20pt; color:var(--coral); font-weight:900;
  }
  /* ===== メリット ===== */
  .merit{ display:flex; justify-content:center; gap:4mm; padding:6mm 14mm 0; }
  .merit div{
    flex:1; background:#f7faf7; border:1.5px solid #e2efe2; border-radius:10px;
    padding:4mm 2mm; text-align:center; font-size:10.5pt; font-weight:800; color:var(--green-d); line-height:1.4;
  }
  .merit div span{ display:block; font-size:8.5pt; color:var(--sub); font-weight:600; margin-top:1mm; }
  /* ===== QR ===== */
  .qrband{
    margin-top:auto; background:var(--coral-l);
    padding:6mm 12mm 5mm; text-align:center; border-top:3px dashed var(--coral);
  }
  .qrband .lead{ font-size:14pt; font-weight:900; color:var(--coral-d); margin-bottom:5mm; }
  .qrs{ display:flex; justify-content:center; align-items:flex-end; gap:9mm; }
  .qr{ text-align:center; }
  .qr img{ background:#fff; padding:2.5mm; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,.12); }
  .qr.main img{ width:38mm; height:38mm; }
  .qr.sub img{ width:27mm; height:27mm; }
  .qr .lab{ margin-top:2.5mm; font-size:10pt; font-weight:800; }
  .qr.main .lab{ color:var(--green-d); font-size:11.5pt; }
  .qr .lab small{ display:block; font-size:7.5pt; color:var(--sub); font-weight:600; margin-top:.5mm; }
  /* ===== フッター ===== */
  .ft{ background:var(--coral-d); color:#fff; text-align:center; padding:4mm 10mm; font-size:9pt; line-height:1.6; }
  .ft b{ font-size:11pt; letter-spacing:.05em; }
  .ft .accts{ opacity:.95; margin-top:1mm; }
  .ft .area{ display:inline-block; margin-top:1.5mm; background:rgba(255,255,255,.18); padding:1mm 5mm; border-radius:30px; font-weight:700; }
</style>
</head>
<body>
<div class="page">

  <div class="hd">
    <img src="${img.logo}" alt="おすそわけ">
  </div>
  <div class="subbar">この店は <b>おすそわけ</b> 加盟店です</div>

  <div class="hero">
    <div class="start"><span class="d">2026.7.1</span><span class="s">START</span></div>
    <h1>フードロスを、<span class="g">おすそわけ。</span></h1>
    <p>まだ美味しいのに、もったいない。<br>そんな食品を、<span style="color:var(--coral-d);font-weight:800">お得な価格</span>でお買い物できるアプリが始まります。</p>
  </div>

  <div class="steps">
    <div class="step"><div class="n">1</div><div class="t">お店を探す</div><div class="sub">アプリ / Web版で<br>近くの加盟店をチェック</div></div>
    <div class="step"><div class="n">2</div><div class="t">予約・購入</div><div class="sub">気になる商品を<br>その場で予約</div></div>
    <div class="step"><div class="n">3</div><div class="t">受け取る</div><div class="sub">指定の時間に<br>お店で受け取り</div></div>
  </div>

  <div class="merit">
    <div>お得に買える<span>通常よりうれしい価格で</span></div>
    <div>ロスを減らせる<span>食品ロス削減に貢献</span></div>
    <div>お店を応援<span>地元のお店を支える</span></div>
  </div>

  <div class="qrband">
    <div class="lead">スマホで読み取って、7/1までにチェック！</div>
    <div class="qrs">
      <div class="qr sub"><img src="${img.qrWeb}" alt="Web版"><div class="lab">Web版で見る<small>osusowakejapan.org</small></div></div>
      <div class="qr main"><img src="${img.qrApp}" alt="アプリDL"><div class="lab">アプリを ダウンロード<small>App Store で「おすそわけ」</small></div></div>
      <div class="qr sub"><img src="${img.qrIg}" alt="Instagram"><div class="lab">Instagram<small>@osusowake_official</small></div></div>
    </div>
  </div>

  <div class="ft">
    <b>おすそわけ</b><br>
    <span class="accts">お問い合わせ：hello.osusowake@gmail.com</span><br>
    <span class="area">対象エリア：大阪府高槻市</span>
  </div>

</div>
</body>
</html>`;

const out = DIR + "osusowake_store_flyer.html";
fs.writeFileSync(out, html, "utf8");
console.log("Wrote:", out);
