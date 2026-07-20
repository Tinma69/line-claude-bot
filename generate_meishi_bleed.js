// おすそわけ 名刺（入稿用・塗り足し3mm込み 97×61mm）
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");
const pres = new pptxgen();
const TRIM_W = 91 / 25.4;
const BLEED = 3 / 25.4;
const CARD_W = 97 / 25.4;
const CARD_H = 61 / 25.4;
const B = BLEED;
pres.defineLayout({ name: "MB", width: CARD_W, height: CARD_H });
pres.layout = "MB";

const CORAL = "E8786C", GREEN = "3FA535", DARK = "2B2B2B", GRAY = "777777", LIGHT_GRAY = "DDDDDD", WHITE = "FFFFFF";
const FH = "Yu Gothic UI", FB = "Yu Gothic UI";
const LOGO = "C:\\Users\\kusao\\OneDrive\\画像\\logo-01.png";
const DIR = "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\";
const QR_APP = DIR + "qr_appstore.png", QR_WEB = DIR + "qr_webapp.png", QR_IG = DIR + "qr_instagram.png";

const members = [
  { name: "佐藤 勇飛", roma: "Yuhi Sato", role: "CEO / 代表", tel: "080-9579-0336" },
  { name: "梅本 幸汰", roma: "Kota Umemoto", role: "COO / 副代表", tel: "080-1486-0699" },
  { name: "関本 達也", roma: "Tatsuya Sekimoto", role: "営業", tel: "090-2041-6170" },
  { name: "今井 蒼空", roma: "Sora Imai", role: "営業", tel: "080-5737-0249" },
  { name: "竹倉 己博", roma: "Kihiro Takekura", role: "営業", tel: "080-8328-8015" },
  { name: "吉澤 駿佑", roma: "Shunsuke Yoshizawa", role: "営業", tel: "080-8692-5354" },
  { name: "岡本 悠希", roma: "Yuki Okamoto", role: "営業", tel: "090-2948-4839" },
  { name: "谷川 碧唯", roma: "Aoi Tanikawa", role: "営業", tel: "080-8308-6671" }
];
const EMAIL = "hello.osusowake@gmail.com", INSTA = "@osusowake_official", XA = "@Osusowake_offi";

members.forEach((m) => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addShape("rect", { x: 0, y: 0, w: B + 0.08, h: CARD_H, fill: { color: CORAL } });
  s.addImage({ path: LOGO, x: B + 0.2, y: B + 0.18, w: 0.62, h: 0.53 });
  s.addText(m.name, { x: B + 0.95, y: B + 0.2, w: 2.45, h: 0.38, fontSize: 17, fontFace: FH, color: DARK, bold: true, valign: "middle" });
  s.addText(m.roma, { x: B + 0.95, y: B + 0.58, w: 2.45, h: 0.22, fontSize: 8, fontFace: FB, color: GRAY, valign: "middle" });
  s.addText(m.role, { x: B + 0.95, y: B + 0.82, w: 2.45, h: 0.25, fontSize: 9.5, fontFace: FH, color: CORAL, bold: true, valign: "middle" });
  s.addShape("line", { x: B + 0.2, y: B + 1.22, w: 3.2, h: 0, line: { color: LIGHT_GRAY, width: 0.75 } });
  s.addText("おすそわけ｜高槻発 食品ロス削減アプリ", { x: B + 0.2, y: B + 1.26, w: 3.2, h: 0.2, fontSize: 7, fontFace: FB, color: GREEN, bold: true, valign: "middle" });
  const c = [`Mail :  ${EMAIL}`];
  if (m.tel) c.push(`Tel  :  ${m.tel}`);
  c.push(`IG   :  ${INSTA}    X : ${XA}`);
  c.push(`Web  :  osusowakejapan.org`);
  c.forEach((t, i) => s.addText(t, { x: B + 0.2, y: B + 1.5 + i * 0.16, w: 3.25, h: 0.16, fontSize: 7, fontFace: FB, color: DARK, valign: "middle" }));
});

const b = pres.addSlide();
b.background = { color: CORAL };
b.addText("食品ロスを、おすそわけに。", { x: B + 0.2, y: B + 0.22, w: 3.2, h: 0.35, fontSize: 17, fontFace: FH, color: WHITE, bold: true, align: "center" });
b.addText("✓ 初期費用ゼロ ／ 売れた分だけ手数料", { x: B + 0.2, y: B + 0.62, w: 3.2, h: 0.22, fontSize: 8.5, fontFace: FB, color: "FFF1EE", align: "center" });
const qrs = [{ img: QR_APP, label: "アプリDL" }, { img: QR_WEB, label: "Web版" }, { img: QR_IG, label: "Instagram" }];
const qrW = 0.8, gap = 0.18;
const totalW = qrs.length * qrW + (qrs.length - 1) * gap;
const startX = (TRIM_W - totalW) / 2 + B;
const qrY = B + 1.0;
qrs.forEach((q, i) => {
  const x = startX + i * (qrW + gap);
  b.addShape("roundRect", { x: x, y: qrY, w: qrW, h: qrW, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.04 });
  b.addImage({ path: q.img, x: x + 0.05, y: qrY + 0.05, w: qrW - 0.1, h: qrW - 0.1 });
  b.addText(q.label, { x: x - 0.05, y: qrY + qrW + 0.04, w: qrW + 0.1, h: 0.16, fontSize: 7, fontFace: FB, color: WHITE, align: "center", valign: "middle" });
});

pres.writeFile({ fileName: DIR + "osusowake_meishi_bleed.pptx" }).then(f => console.log("Created: " + f)).catch(e => console.error(e));
