// おすそわけ 店頭チラシ C案（写真フルブリード・TABETE風 / A4タテ・QR3つ）
const fs = require("fs");
const path = require("path");
const DIR = "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\";
const LOGO = DIR + "logo_dark.png";

function b64(p){
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext==="svg"?"svg+xml":ext==="jpg"?"jpeg":ext;
  return `data:image/${mime};base64,`+fs.readFileSync(p).toString("base64");
}
const img = {
  logo:b64(LOGO), photo:b64(DIR+"cand1.jpg"),
  qrApp:b64(DIR+"qr_appstore.png"), qrWeb:b64(DIR+"qr_webapp.png"), qrIg:b64(DIR+"qr_instagram.png"),
};

const html = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><title>おすそわけ チラシ C</title>
<style>
  @page{ size:A4 portrait; margin:0; }
  *{ box-sizing:border-box; margin:0; padding:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  :root{ --coral:#ef8d8d; --coral-lt:#ffb9ab; }
  html,body{ font-family:"Yu Gothic","YuGothic","Meiryo",sans-serif; color:#fff; }
  .serif{ font-family:"Yu Mincho","YuMincho","Hiragino Mincho ProN",serif; }
  .page{ width:210mm; height:297mm; position:relative; overflow:hidden; }
  .bg{ position:absolute; inset:0; background:url("${img.photo}") center 38%/cover no-repeat; }
  .shade{ position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(18,11,7,.62) 0%, rgba(18,11,7,.10) 26%,
      rgba(18,11,7,.12) 48%, rgba(18,11,7,.55) 74%, rgba(15,9,6,.92) 100%); }
  .inner{ position:relative; height:100%; display:flex; flex-direction:column; padding:16mm 17mm 15mm; }

  .brand{ display:flex; align-items:center; gap:3.2mm; }
  .brand img{ width:15mm; height:auto; border-radius:11px; }
  .brand .t b{ font-size:14pt; letter-spacing:.05em; display:block; line-height:1; text-shadow:0 1px 6px rgba(0,0,0,.5); }
  .brand .t small{ font-size:6.8pt; letter-spacing:.32em; opacity:.85; display:block; margin-top:1.6mm; }

  .hero{ margin-top:auto; }
  .hero .ey{ font-size:12pt; letter-spacing:.28em; font-weight:700; margin-bottom:3mm;
    display:inline-block; border-left:2px solid var(--coral-lt); padding-left:3mm; }
  .hero h1{ font-size:42pt; font-weight:600; line-height:1.5; letter-spacing:.04em; text-shadow:0 3px 16px rgba(0,0,0,.5); }
  .hero h1 .c{ color:var(--coral-lt); }
  .hero .sub{ margin-top:7mm; font-size:11.5pt; letter-spacing:.06em; opacity:.95; text-shadow:0 1px 8px rgba(0,0,0,.6); }

  .bottom{ margin-top:11mm; display:flex; justify-content:space-between; align-items:flex-end; }
  .info{ font-size:8.5pt; line-height:1.9; opacity:.92; letter-spacing:.03em; }
  .info .big{ font-size:10pt; opacity:1; font-weight:700; letter-spacing:.05em; }
  .qrrow{ display:flex; gap:4.5mm; }
  .qr{ text-align:center; }
  .qr img{ width:27mm; height:27mm; background:#fff; padding:2mm; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,.4); }
  .qr .l{ font-size:7.5pt; margin-top:2.2mm; letter-spacing:.14em; font-weight:700; }
  .qr .s{ font-size:7.6pt; opacity:.88; margin-top:.7mm; line-height:1.3; }
</style></head>
<body>
<div class="page">
  <div class="bg"></div>
  <div class="shade"></div>
  <div class="inner">

    <div class="brand">
      <img src="${img.logo}" alt="おすそわけ">
      <div class="t"><b class="serif">おすそわけ</b><small>OSUSOWAKE</small></div>
    </div>

    <div class="hero">
      <div class="ey">2026.7.1 サービス開始</div>
      <h1 class="serif">食品ロスを<br><span class="c">おすそわけ</span></h1>
      <div class="sub">まだおいしい食品を、お得に。</div>
    </div>

    <div class="bottom">
      <div class="info">
        <span class="big">この店はおすそわけ加盟店です。</span><br>
        あなたの“おいしい”が地球とまちを元気にする<br>
        お問い合わせ　hello.osusowake@gmail.com
      </div>
      <div class="qrrow">
        <div class="qr"><img src="${img.qrApp}" alt="App"><div class="l">iPhoneの方はこちら</div></div>
        <div class="qr"><img src="${img.qrWeb}" alt="Web"><div class="l">Androidの方はこちら</div></div>
        <div class="qr"><img src="${img.qrIg}" alt="IG"><div class="l">Instagram</div></div>
      </div>
    </div>

  </div>
</div>
</body></html>`;

fs.writeFileSync(DIR+"osusowake_store_flyer_c.html", html, "utf8");
console.log("Wrote C:", DIR+"osusowake_store_flyer_c.html");
