// おすそわけ 名刺生成（8人分・表面 + 共通裏面）
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");

const pres = new pptxgen();
// 名刺サイズ 91×55mm（インチ換算）
const CARD_W = 91 / 25.4;  // 3.5827"
const CARD_H = 55 / 25.4;  // 2.1654"
pres.defineLayout({ name: "MEISHI", width: CARD_W, height: CARD_H });
pres.layout = "MEISHI";
pres.title = "おすそわけ 名刺";

// カラー
const CORAL = "E8786C";
const CORAL_LIGHT = "FFF1EE";
const GREEN = "3FA535";
const DARK = "2B2B2B";
const GRAY = "777777";
const LIGHT_GRAY = "DDDDDD";
const WHITE = "FFFFFF";

const FONT_HEAD = "Yu Gothic UI";
const FONT_BODY = "Yu Gothic UI";

// ファイルパス
const LOGO = "C:\\Users\\kusao\\OneDrive\\画像\\logo-01.png";
const DIR = "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\";
const QR_APP = DIR + "qr_appstore.png";
const QR_WEB = DIR + "qr_webapp.png";
const QR_IG = DIR + "qr_instagram.png";
const QR_X = DIR + "qr_x.png";

// メンバー8人
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

const EMAIL = "hello.osusowake@gmail.com";
const INSTA = "@osusowake_official";
const X_ACC = "@Osusowake_offi";

// ===== 表面（8枚） =====
members.forEach((m) => {
  const s = pres.addSlide();
  s.background = { color: WHITE };

  // 左帯（コーラル）
  s.addShape("rect", { x: 0, y: 0, w: 0.08, h: CARD_H, fill: { color: CORAL } });

  // ロゴ（左上）
  s.addImage({ path: LOGO, x: 0.2, y: 0.18, w: 0.62, h: 0.53 });

  // 名前
  s.addText(m.name, {
    x: 0.95, y: 0.2, w: 2.45, h: 0.38,
    fontSize: 17, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle"
  });
  // ローマ字
  s.addText(m.roma, {
    x: 0.95, y: 0.58, w: 2.45, h: 0.22,
    fontSize: 8, fontFace: FONT_BODY, color: GRAY, valign: "middle"
  });
  // 役職
  s.addText(m.role, {
    x: 0.95, y: 0.82, w: 2.45, h: 0.25,
    fontSize: 9.5, fontFace: FONT_HEAD, color: CORAL, bold: true, valign: "middle"
  });

  // 区切り線
  s.addShape("line", { x: 0.2, y: 1.22, w: 3.2, h: 0, line: { color: LIGHT_GRAY, width: 0.75 } });

  // サービス名
  s.addText("おすそわけ｜高槻発 食品ロス削減アプリ", {
    x: 0.2, y: 1.26, w: 3.2, h: 0.2,
    fontSize: 7, fontFace: FONT_BODY, color: GREEN, bold: true, valign: "middle"
  });

  // 連絡先ブロック
  const contacts = [];
  contacts.push(`Mail :  ${EMAIL}`);
  if (m.tel) contacts.push(`Tel  :  ${m.tel}`);
  contacts.push(`IG   :  ${INSTA}    X : ${X_ACC}`);
  contacts.push(`Web  :  osusowakejapan.org`);

  contacts.forEach((c, i) => {
    s.addText(c, {
      x: 0.2, y: 1.5 + i * 0.16, w: 3.25, h: 0.16,
      fontSize: 7, fontFace: FONT_BODY, color: DARK, valign: "middle"
    });
  });
});

// ===== 裏面（共通・1枚・QR4つ） =====
const b = pres.addSlide();
b.background = { color: CORAL };

// コピー（上部）
b.addText("食品ロスを、おすそわけに。", {
  x: 0.2, y: 0.22, w: 3.2, h: 0.35,
  fontSize: 17, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center"
});
// サブ（初期費用ゼロ）
b.addText("✓ 初期費用ゼロ ／ 売れた分だけ手数料", {
  x: 0.2, y: 0.62, w: 3.2, h: 0.22,
  fontSize: 8.5, fontFace: FONT_BODY, color: "FFF1EE", align: "center"
});

// QR 4つ（横並び）
const qrs = [
  { img: QR_APP, label: "アプリDL" },
  { img: QR_WEB, label: "Web版" },
  { img: QR_IG, label: "Instagram" }
];
const qrW = 0.8;         // QRカード幅
const gap = 0.18;
const totalW = qrs.length * qrW + (qrs.length - 1) * gap; // 0.66*4 + 0.13*3 = 3.03
const startX = (CARD_W - totalW) / 2; // 中央寄せ
const qrY = 1.0;

qrs.forEach((q, i) => {
  const x = startX + i * (qrW + gap);
  // 白カード
  b.addShape("roundRect", { x: x, y: qrY, w: qrW, h: qrW, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.04 });
  // QR画像
  b.addImage({ path: q.img, x: x + 0.05, y: qrY + 0.05, w: qrW - 0.1, h: qrW - 0.1 });
  // ラベル
  b.addText(q.label, {
    x: x - 0.05, y: qrY + qrW + 0.04, w: qrW + 0.1, h: 0.16,
    fontSize: 7, fontFace: FONT_BODY, color: WHITE, align: "center", valign: "middle"
  });
});

pres.writeFile({ fileName: "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\osusowake_meishi.pptx" })
  .then(fileName => console.log(`Created: ${fileName}`))
  .catch(err => console.error("Error:", err));
