// J'S RACING X304 Stainless Exhaust — 海外向け商品チラシ (A4 portrait)
// v2: 写真を小さく使い、タイポ/グラフィック主体で粗さを抑える
// 画像をbase64で埋め込んだ単一HTMLを生成 → Edge headless で PDF 化する
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const IMG = path.join(DIR, "img");

function b64(p) {
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === "svg" ? "svg+xml" : ext === "jpg" ? "jpeg" : ext;
  return `data:image/${mime};base64,` + fs.readFileSync(p).toString("base64");
}

const img = {
  hero: b64(path.join(IMG, "tail_hero.jpg")),
  black: b64(path.join(IMG, "tail_black.jpg")),
  under: b64(path.join(IMG, "underbody.jpg")),
  track: b64(path.join(IMG, "car_track.jpg")),
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>J'S RACING X304 Stainless Exhaust System</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root{
    --red:#e2001a; --red-d:#b00014; --paper:#0b0c0f;
    --steel:#cdd3da; --sub:#8a929c; --line:#262a31; --ti:#5fb6d6;
  }
  html,body{ font-family:"Arial","Helvetica Neue",Helvetica,sans-serif; color:#eef1f4; }
  img{ image-rendering:auto; }
  .page{
    width:210mm; height:297mm; position:relative; overflow:hidden;
    background:
      radial-gradient(110% 70% at 82% 4%, #1c2129 0%, #0b0c0f 52%),
      linear-gradient(#0b0c0f,#0b0c0f);
    display:flex; flex-direction:column;
  }
  .red{ color:var(--red); }

  /* ===== header ===== */
  .top{ position:relative; height:13mm; display:flex; align-items:center; justify-content:space-between;
        padding:0 11mm; border-bottom:1px solid var(--line); }
  .top::after{ content:""; position:absolute; left:0; top:0; height:100%; width:46%;
        background:linear-gradient(100deg, var(--red-d) 0%, var(--red) 62%, transparent 100%);
        clip-path:polygon(0 0, 100% 0, 86% 100%, 0% 100%); opacity:.92; }
  .brand{ position:relative; z-index:2; font-weight:900; font-style:italic; font-size:15pt; letter-spacing:.02em; }
  .brand small{ font-style:normal; font-weight:700; font-size:8pt; letter-spacing:.28em; opacity:.85; margin-left:3mm; }
  .top .rel{ position:relative; z-index:2; font-size:7.5pt; letter-spacing:.26em; color:var(--sub); font-weight:700; }

  /* ===== hero row: big type (left) + contained photo (right) ===== */
  .heroRow{ display:grid; grid-template-columns:1fr 92mm; gap:7mm; padding:7mm 11mm 0; align-items:center; }
  .kicker{ font-size:7.5pt; letter-spacing:.32em; color:var(--sub); font-weight:700; }
  .x304{ font-size:62pt; font-weight:900; font-style:italic; letter-spacing:-.01em; line-height:.82; margin-top:1.5mm;
        background:linear-gradient(180deg,#ffffff 0%,#9fb6c4 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .legal{ display:flex; align-items:center; gap:3mm; margin-top:3mm; }
  .legal .m{ font-size:17pt; font-weight:800; letter-spacing:.03em; }
  .legal .badge{ font-size:7.5pt; font-weight:800; letter-spacing:.12em; color:#fff; background:var(--red); padding:1.6mm 3mm; border-radius:3px; }
  .catch{ font-size:15.5pt; font-weight:900; font-style:italic; line-height:1.08; margin-top:6mm; }
  .lead{ font-size:8.6pt; line-height:1.55; color:#aeb6bf; margin-top:3mm; max-width:96mm; }

  .heroImg{ position:relative; height:62mm; border-radius:4px; overflow:hidden; border:1px solid var(--line);
        box-shadow:0 6px 22px rgba(0,0,0,.5); }
  .heroImg img{ width:100%; height:100%; object-fit:cover; object-position:center 46%; display:block; }
  .heroImg .vig{ position:absolute; inset:0; box-shadow:inset 0 0 40px rgba(0,0,0,.55); pointer-events:none; }

  /* ===== chips ===== */
  .chips{ display:flex; flex-wrap:wrap; gap:2.4mm; padding:6mm 11mm 0; }
  .chip{ font-size:7.6pt; font-weight:800; letter-spacing:.07em; padding:2mm 3.4mm; border:1px solid var(--line);
        border-radius:30px; color:var(--steel); background:#13161b; }
  .chip.k{ border-color:var(--red); color:#fff; background:linear-gradient(180deg,#2a0d11,#16080b); }
  .chip b{ color:var(--ti); }

  /* ===== features: 3 columns text ===== */
  .feats{ display:grid; grid-template-columns:repeat(3,1fr); gap:6mm; padding:6.5mm 11mm 0; }
  .feats .item{ position:relative; padding-top:4mm; border-top:2px solid var(--red); }
  .feats h3{ font-size:9.4pt; font-weight:900; letter-spacing:.01em; margin-bottom:1.6mm; line-height:1.15; }
  .feats p{ font-size:7.8pt; line-height:1.5; color:#a6aeb8; }

  /* ===== detail photos: 3 small, crisp ===== */
  .shots{ display:grid; grid-template-columns:repeat(3,1fr); gap:4mm; padding:6.5mm 11mm 0; }
  .shots figure{ position:relative; height:34mm; border:1px solid var(--line); border-radius:3px; overflow:hidden; }
  .shots img{ width:100%; height:100%; object-fit:cover; display:block; }
  .shots figcaption{ position:absolute; left:0; bottom:0; font-size:6.6pt; letter-spacing:.12em; font-weight:800;
        color:#fff; background:rgba(226,0,26,.88); padding:1mm 2.6mm; }

  /* ===== spec + price ===== */
  .info{ display:grid; grid-template-columns:1.42fr 1fr; gap:6mm; padding:6.5mm 11mm 0; align-items:start; }
  .spec{ border:1px solid var(--line); border-radius:3px; overflow:hidden; }
  .spec .h{ background:var(--red); color:#fff; font-size:8.5pt; font-weight:900; letter-spacing:.16em; padding:2mm 3.5mm; }
  .spec table{ width:100%; border-collapse:collapse; }
  .spec td{ font-size:7.7pt; padding:1.85mm 3.5mm; border-bottom:1px dashed var(--line); vertical-align:top; line-height:1.4; }
  .spec td.k{ width:34%; color:var(--sub); font-weight:700; letter-spacing:.04em; }
  .spec td.v{ color:#e7ebef; }
  .spec td.v b{ color:#fff; }
  .spec tr:last-child td{ border-bottom:none; }

  .pricecol{ display:flex; flex-direction:column; gap:4mm; }
  .pricebox{ border:1px solid var(--red); border-radius:4px; background:linear-gradient(180deg,#1a0a0d,#0c0709); padding:5mm 5mm 4.5mm; }
  .pricebox .lab{ font-size:8pt; letter-spacing:.3em; color:var(--sub); font-weight:700; }
  .pricebox .big{ font-size:27pt; font-weight:900; font-style:italic; color:#fff; line-height:1; margin-top:2mm; }
  .pricebox .big span{ font-size:13pt; }
  .pricebox .ex{ font-size:8pt; color:var(--steel); margin-top:2mm; letter-spacing:.04em; }
  .pricebox .tax{ display:inline-block; margin-top:3mm; font-size:7pt; font-weight:800; letter-spacing:.18em;
        color:#fff; background:var(--red); padding:1.4mm 3mm; border-radius:3px; }
  .legalnote{ font-size:6.8pt; line-height:1.5; color:#727a84; }

  /* ===== footer ===== */
  .foot{ margin-top:auto; border-top:1px solid var(--line); padding:3.5mm 11mm; display:flex;
        align-items:center; justify-content:space-between; }
  .foot .b{ font-weight:900; font-style:italic; font-size:11pt; }
  .foot .tag{ font-size:7pt; letter-spacing:.24em; color:var(--sub); font-weight:700; }
  .foot .cr{ font-size:6.6pt; color:#5b626b; text-align:right; line-height:1.5; }
</style>
</head>
<body>
<div class="page">

  <div class="top">
    <div class="brand">J'S RACING<small>JAPAN</small></div>
    <div class="rel">NEW PRODUCT &nbsp;·&nbsp; EXPORT RELEASE</div>
  </div>

  <div class="heroRow">
    <div>
      <div class="kicker">SUS304 STAINLESS EXHAUST SYSTEM SERIES</div>
      <div class="x304">X304</div>
      <div class="legal">
        <div class="m">75RS LEGAL</div>
        <div class="badge">JQR · STREET LEGAL</div>
      </div>
      <div class="catch">POWER. SOUND.<br>STREET&#8209;LEGAL.</div>
      <div class="lead">The exhaust note you crave — engineered to pass. A full vehicle-specific stainless system for the Honda Civic Type R (FL5), finished with a burnt-titanium twin tail.</div>
    </div>
    <div class="heroImg">
      <img src="${img.hero}" alt="X304 burnt-titanium twin tail">
      <div class="vig"></div>
    </div>
  </div>

  <div class="chips">
    <div class="chip k">CIVIC FL5 ONLY</div>
    <div class="chip">SUS304 · <b>1.5 mm</b></div>
    <div class="chip">TITANIUM TWIN TAIL</div>
    <div class="chip">+7 PS GAIN</div>
    <div class="chip">JQR STREET-LEGAL</div>
    <div class="chip">VALVELESS STRAIGHT</div>
  </div>

  <div class="feats">
    <div class="item">
      <h3>Straight-Through<br>Lightweight Design</h3>
      <p>A restriction-free straight layout with J'S RACING's proprietary silencing. Lighter than OEM, low back-pressure, razor-sharp throttle response.</p>
    </div>
    <div class="item">
      <h3>Burnt-Titanium<br>Twin Dolphin Tail</h3>
      <p>120&#966; twin dolphin tails in titanium alloy, hand-finished to the signature burnt-blue gradient. 75&#966; main splits to 60.5&#966;&#215;2.</p>
    </div>
    <div class="item">
      <h3>Certified for<br>the Street</h3>
      <p>JQR-certified and compliant with Japan's acceleration-noise regulations. Pass inspection and drive it daily — sound without compromise.</p>
    </div>
  </div>

  <div class="shots">
    <figure><img src="${img.black}" alt="Twin tail rear view"><figcaption>TWIN DOLPHIN TAIL</figcaption></figure>
    <figure><img src="${img.under}" alt="Stainless under-body routing"><figcaption>SUS304 ROUTING</figcaption></figure>
    <figure><img src="${img.track}" alt="Civic Type R FL5 on track"><figcaption>BORN ON THE TRACK</figcaption></figure>
  </div>

  <div class="info">
    <div class="spec">
      <div class="h">PRODUCT INFORMATION</div>
      <table>
        <tr><td class="k">PRODUCT NAME</td><td class="v"><b>X304 Stainless Exhaust System 75RS Legal</b></td></tr>
        <tr><td class="k">PART NUMBER</td><td class="v">X304-L5L-75RS</td></tr>
        <tr><td class="k">APPLICATION</td><td class="v">Honda Civic Type R (FL5)</td></tr>
        <tr><td class="k">MATERIAL</td><td class="v">SUS304 stainless 1.5&nbsp;mm (main) / Titanium alloy (rear tail)</td></tr>
        <tr><td class="k">WEIGHT</td><td class="v">18.5&nbsp;kg</td></tr>
        <tr><td class="k">CONFIGURATION</td><td class="v">75&#966; &#8594; 60.5&#966;&#215;2 &#8594; 120&#966;&#215;2 · valveless · twin dolphin tail</td></tr>
        <tr><td class="k">PERFORMANCE</td><td class="v"><b>356.5 PS / 54.5 kgm</b> with HYPER-ECU &nbsp;(<b class="red">+7 PS</b> vs. stock 349.7 PS)*</td></tr>
        <tr><td class="k">CERTIFICATION</td><td class="v">JQR Certified — street legal / inspection compliant</td></tr>
        <tr><td class="k">INCLUDES</td><td class="v">OEM actuator relocation kit · full vehicle-specific design</td></tr>
        <tr><td class="k">RELEASE</td><td class="v">March 14, 2026</td></tr>
      </table>
    </div>
    <div class="pricecol">
      <div class="pricebox">
        <div class="lab">PRICE</div>
        <div class="big">396,000 <span>JPY</span></div>
        <div class="ex">360,000 JPY excl. tax</div>
        <div class="tax">TAX INCLUDED</div>
      </div>
      <div class="legalnote">
        *In-house measured values; actual figures vary with individual vehicle and conditions. Tail coloring is hand-finished and may differ slightly from product images. Specifications subject to change without notice.
      </div>
    </div>
  </div>

  <div class="foot">
    <div>
      <div class="b">J'S RACING</div>
      <div class="tag">FAST · REVEAL · MUSIC · ENERGY · SATISFACTION</div>
    </div>
    <div class="cr">© 2026 J'S RACING / J'S CORPORATION CO.,LTD.<br>www.jsracing.co.jp</div>
  </div>

</div>
</body>
</html>`;

const htmlPath = path.join(DIR, "x304_flyer.html");
fs.writeFileSync(htmlPath, html, "utf8");
console.log("Wrote:", htmlPath);
