const fs = require("fs");
const path = require("path");

const dir = "C:/Users/kusao/OneDrive/デスクトップ/line-claude-bot";
const b64 = (f) => "data:image/png;base64," + fs.readFileSync(path.join(dir, f)).toString("base64");

const logo = b64("logo_trans.png");
const qrApp = b64("qr_appstore.png");
const qrWeb = b64("qr_webapp.png");
const qrIg = b64("qr_instagram.png");

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root {
    --coral: #E8786C;
    --coral-soft: #FBEDEB;
    --navy: #1F2A44;
    --green: #4CAF50;
    --gray: #6b7280;
  }
  html, body { font-family: "Noto Sans JP", "Yu Gothic", sans-serif; color: var(--navy); }
  .page {
    width: 210mm; height: 297mm; position: relative; overflow: hidden;
    background: #ffffff; padding: 12mm 14mm 9mm;
    display: flex; flex-direction: column;
  }
  /* 上下のコーラル装飾 */
  .blob-tl { position: absolute; top: -70mm; left: -50mm; width: 140mm; height: 140mm; background: var(--coral-soft); border-radius: 50%; }
  .blob-br { position: absolute; bottom: -80mm; right: -55mm; width: 150mm; height: 150mm; background: var(--coral-soft); border-radius: 50%; }
  .content { position: relative; z-index: 2; display: flex; flex-direction: column; height: 100%; }

  .top { text-align: center; }
  .logo { width: 42mm; height: auto; display: block; margin: 0 auto 4mm; }
  .badge {
    display: inline-block; background: var(--navy); color: #fff; font-weight: 700;
    font-size: 13pt; letter-spacing: .04em; padding: 4mm 9mm; border-radius: 999px;
  }
  .badge .hl { color: #ffd9d3; }

  .headline { text-align: center; margin-top: 9mm; }
  .headline h1 { font-size: 38pt; font-weight: 900; line-height: 1.22; letter-spacing: .01em; }
  .headline h1 .c { color: var(--coral); }
  .lead { text-align: center; margin-top: 5mm; }
  .lead .app { font-size: 15pt; font-weight: 700; color: var(--gray); }
  .lead .start {
    display: inline-block; margin-top: 4mm; font-size: 20pt; font-weight: 900; color: #fff;
    background: var(--coral); padding: 3mm 8mm; border-radius: 6mm; letter-spacing: .02em;
  }

  .benefits { display: flex; justify-content: center; gap: 8mm; margin-top: 9mm; }
  .benefit { text-align: center; width: 46mm; }
  .benefit .ic { width: 18mm; height: 18mm; border-radius: 50%; background: var(--coral-soft);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 3mm; font-size: 22pt; }
  .benefit .t { font-size: 13pt; font-weight: 700; }
  .benefit .d { font-size: 10pt; color: var(--gray); margin-top: 1mm; }

  .qrwrap { margin-top: 7mm; }
  .qrtitle { text-align: center; font-size: 14pt; font-weight: 700; margin-bottom: 4mm; color: var(--navy); }
  .qrtitle .u { border-bottom: 3px solid var(--coral); padding-bottom: 1mm; }
  .qrs { display: flex; justify-content: center; gap: 14mm; }
  .qr { text-align: center; }
  .qr .frame { background: #fff; border: 2px solid var(--navy); border-radius: 5mm; padding: 3.5mm; }
  .qr img { width: 35mm; height: 35mm; display: block; }
  .qr .label { margin-top: 2.5mm; font-size: 13pt; font-weight: 700; }
  .qr .sub { font-size: 9.5pt; color: var(--gray); }

  .foot { margin-top: 5mm; display: flex; align-items: center; justify-content: center; gap: 6mm;
    border-top: 1px dashed #d6c4c1; padding-top: 4mm; }
  .foot img { width: 17mm; height: 17mm; }
  .foot .info { font-size: 11pt; line-height: 1.55; }
  .foot .info b { color: var(--coral); }
  .foot .info .url { font-weight: 700; }
  .tagline { text-align: center; margin-top: 4mm; font-size: 12pt; font-weight: 700; color: var(--navy); }
</style>
</head>
<body>
  <div class="page">
    <div class="blob-tl"></div>
    <div class="blob-br"></div>
    <div class="content">
      <div class="top">
        <img class="logo" src="${logo}" alt="おすそわけ">
        <div class="badge">このお店は <span class="hl">「おすそわけ」参加店</span> です</div>
      </div>

      <div class="headline">
        <h1>まだ食べられるを、<br><span class="c">お得におすそわけ。</span></h1>
      </div>
      <div class="lead">
        <div class="app">食品ロス削減アプリ「おすそわけ」</div>
        <div class="start">7月1日(水) スタート</div>
      </div>

      <div class="benefits">
        <div class="benefit">
          <div class="ic">💰</div>
          <div class="t">お得に買える</div>
          <div class="d">売れ残りそうな品をお値打ち価格で</div>
        </div>
        <div class="benefit">
          <div class="ic">🌱</div>
          <div class="t">フードロス削減</div>
          <div class="d">あなたの一回が“もったいない”を減らす</div>
        </div>
        <div class="benefit">
          <div class="ic">📱</div>
          <div class="t">かんたん予約</div>
          <div class="d">アプリ・Webからその場で予約</div>
        </div>
      </div>

      <div class="qrwrap">
        <div class="qrtitle"><span class="u">スマホで読み取って、今すぐチェック</span></div>
        <div class="qrs">
          <div class="qr">
            <div class="frame"><img src="${qrApp}" alt="App Store"></div>
            <div class="label">📲 アプリ（iPhone）</div>
            <div class="sub">App Store からダウンロード</div>
          </div>
          <div class="qr">
            <div class="frame"><img src="${qrWeb}" alt="Web版"></div>
            <div class="label">💻 Web版</div>
            <div class="sub">アプリ不要・そのまま使える</div>
          </div>
        </div>

        <div class="foot">
          <img src="${qrIg}" alt="Instagram">
          <div class="info">
            <div>📷 Instagram <b>@osusowake_official</b></div>
            <div class="url">💻 osusowakejapan.org</div>
          </div>
        </div>
        <div class="tagline">捨てる前に、おすそわけ。― 高槻発のフードロス削減アプリ ―</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const outHtml = path.join(dir, "osusowake_poster_a4.html");
fs.writeFileSync(outHtml, html, "utf8");
console.log("HTML:", outHtml);
