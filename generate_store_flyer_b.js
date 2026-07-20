// おすそわけ 店頭チラシ B案（和ミニマル・エディトリアル / A4タテ・7/1スタート予告）
const fs = require("fs");
const path = require("path");
const DIR = "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\";
const VARIANT = process.argv[2] === "circle" ? "circle" : "square";
const LOGO = DIR + (VARIANT === "circle" ? "logo_circle.png" : "logo_square.png");
const OUTNAME = VARIANT === "circle" ? "osusowake_store_flyer_b_circle" : "osusowake_store_flyer_b";

function b64(p){
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext==="svg"?"svg+xml":ext==="jpg"?"jpeg":ext;
  return `data:image/${mime};base64,`+fs.readFileSync(p).toString("base64");
}
const img = {
  logo:b64(LOGO), qrApp:b64(DIR+"qr_appstore.png"),
  qrWeb:b64(DIR+"qr_webapp.png"), qrIg:b64(DIR+"qr_instagram.png"),
};

const html = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><title>おすそわけ チラシ B</title>
<style>
  @page{ size:A4 portrait; margin:0; }
  *{ box-sizing:border-box; margin:0; padding:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  :root{ --green:#2f5e3f; --green-l:#5c8a6a; --coral:#e8806f; --coral-l:#f5d9d1;
         --ink:#2a2a2a; --sub:#7a756e; --cream:#faf6f0; --line:#e7e1d8; }
  html,body{ font-family:"Yu Gothic","YuGothic","Meiryo",sans-serif; color:var(--ink); }
  .page{ width:210mm; height:297mm; background:#fff; display:flex; flex-direction:column; position:relative; overflow:hidden; }
  .serif{ font-family:"Yu Mincho","YuMincho","Hiragino Mincho ProN",serif; }

  /* ヘッダー（見出し＋右に日付・ロゴ） */
  .top{ display:flex; justify-content:space-between; align-items:flex-start; padding:9mm 15mm 0; }
  .head{ flex:1; }
  .head .ey{ font-size:9pt; letter-spacing:.34em; color:var(--coral); font-weight:700; margin-bottom:6mm; }
  .head h1{ font-size:45pt; font-weight:600; line-height:1.24; letter-spacing:.03em; }
  .head h1 .c{ color:var(--coral); }
  .start{ text-align:right; flex-shrink:0; padding-left:8mm; }
  .datebox{ display:inline-block; background:var(--coral); border-radius:1.6mm; padding:2mm 5mm 2.4mm; line-height:1.02; }
  .datebox .lab{ font-size:8pt; letter-spacing:.5em; color:#fff; font-weight:700; }
  .datebox .dt{ font-size:22pt; font-weight:800; color:#fff; letter-spacing:.06em; margin-top:.8mm; }
  .start .logo{ display:block; width:38mm; height:auto; margin:5mm 0 0 auto; }

  /* サブコピー */
  .main{ padding:6mm 15mm 0; }
  .main p{ font-size:11pt; line-height:2.1; color:#3c3833; max-width:165mm; }
  .main p .u{ font-weight:600; color:var(--ink); border-bottom:2px solid var(--ink); padding-bottom:1.2mm; }

  /* フロー */
  .div{ height:1px; background:var(--line); margin:13mm 15mm 0; }
  .flow{ display:flex; padding:4mm 15mm 0; }
  .fl{ flex:1; padding-right:7mm; }
  .fl .no{ font-size:23pt; font-weight:700; color:var(--coral); letter-spacing:.02em; line-height:1; }
  .fl .ti{ font-size:11.5pt; font-weight:800; margin-top:3mm; }
  .fl .de{ font-size:8.5pt; color:#3c3833; font-weight:600; margin-top:2mm; line-height:1.7; }

  /* 3つのうれしい */
  .bens{ display:flex; gap:6mm; padding:8mm 15mm 0; }
  .ben{ flex:1; text-align:center; background:#eef6ea; border-radius:4mm; padding:6mm 4mm; }
  .ben .bh{ display:flex; align-items:center; justify-content:center; gap:2.5mm; margin-bottom:4mm; }
  .ben .bh svg{ width:9mm; height:9mm; }
  .ben .bk{ font-size:18pt; font-weight:800; color:#4f9e3a; letter-spacing:.03em; }
  .ben .bd{ font-size:9.5pt; font-weight:700; color:var(--ink); line-height:1.75; }

  /* セクション見出し */
  .sech{ padding:0 15mm; margin-top:4mm; font-size:8.5pt; letter-spacing:.34em; color:var(--coral); font-weight:700; }

  /* QR */
  .qrwrap{ margin-top:auto; background:var(--coral); padding:10mm 15mm 9mm; text-align:center; }
  .qrwrap .qh{ font-size:19pt; font-weight:800; color:#fff; letter-spacing:.06em; margin-bottom:2.5mm; }
  .qrwrap .qs{ font-size:11.5pt; font-weight:700; color:#fff; letter-spacing:.04em; margin-bottom:7mm; }
  .qrs{ display:flex; justify-content:center; gap:11mm; }
  .qr img{ background:#fff; padding:2mm; border:1px solid rgba(255,255,255,.5); width:29mm; height:29mm; }
  .qr .en{ margin-top:3mm; font-size:8pt; letter-spacing:.2em; font-weight:700; color:#fff; }
  .qr .jp{ font-size:10pt; font-weight:600; color:#fff; margin-top:3.5mm; }

  /* フッター */
  .foot{ display:flex; justify-content:space-between; align-items:center; gap:6mm; padding:6mm 13mm; font-size:9pt; font-weight:700; color:#fff; background:var(--coral); border-top:1px solid rgba(255,255,255,.25); }
  .foot .l b{ color:#fff; letter-spacing:.06em; }
</style></head>
<body>
<div class="page">

  <div class="top">
    <div class="head">
      <div class="ey">FOOD LOSS&nbsp;&nbsp;→&nbsp;&nbsp;OSUSOWAKE</div>
      <h1 class="serif">食品ロスを<br><span class="c">おすそわけ</span></h1>
    </div>
    <div class="start">
      <div class="datebox">
        <div class="lab serif">サービス開始</div>
        <div class="dt serif">2026.7.1</div>
      </div>
      <img class="logo" src="${img.logo}" alt="おすそわけ">
    </div>
  </div>

  <div class="main">
    <p><span class="u">まだおいしいのに、売れ残ってしまう商品があります。</span><br><span class="u">それをお得に買って、お店で受け取れるアプリです。</span></p>
  </div>

  <div class="bens">
    <div class="ben">
      <div class="bh"><svg viewBox="0 0 24 24" fill="#4f9e3a"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg><span class="bk">お得</span></div>
      <div class="bd">まだおいしい商品を<br>お得な価格で</div>
    </div>
    <div class="ben">
      <div class="bh"><svg viewBox="0 0 24 24" fill="#4f9e3a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg><span class="bk">エコ</span></div>
      <div class="bd">食品ロス・CO₂を<br>みんなで削減</div>
    </div>
    <div class="ben">
      <div class="bh"><svg viewBox="0 0 24 24" fill="#4f9e3a"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg><span class="bk">ご近所</span></div>
      <div class="bd">まだ知らない<br>地元の名店を発見。<br>すぐ近くで受け取り</div>
    </div>
  </div>

  <div class="sech">使い方</div>
  <div class="flow">
    <div class="fl"><div class="no serif">01</div><div class="ti">お店を探す</div><div class="de">アプリ / Web版で<br>今日のおすそわけをチェック</div></div>
    <div class="fl"><div class="no serif">02</div><div class="ti">予約・購入</div><div class="de">気になる商品を<br>その場で予約</div></div>
    <div class="fl"><div class="no serif">03</div><div class="ti">受け取る</div><div class="de">指定の時間に<br>お店で受け取り</div></div>
  </div>

  <div class="qrwrap">
    <div class="qh serif">まずは登録から</div>
    <div class="qs">下のQRコードを読み取るだけ</div>
    <div class="qrs">
      <div class="qr"><img src="${img.qrApp}" alt="App"><div class="jp">iPhoneの方はこちら</div></div>
      <div class="qr"><img src="${img.qrWeb}" alt="Web"><div class="jp">Androidの方はこちら</div></div>
    </div>
  </div>

  <div class="foot">
    <div class="l">お問い合わせ：hello.osusowake@gmail.com</div>
    <div class="c">Web版 osusowakejapan.org</div>
    <div class="r">アプリ登録・利用　無料</div>
  </div>

</div>
</body></html>`;

fs.writeFileSync(DIR+OUTNAME+".html", html, "utf8");
console.log("Wrote B("+VARIANT+"):", DIR+OUTNAME+".html");
