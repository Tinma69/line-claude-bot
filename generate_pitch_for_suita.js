// おすそわけ 外部配布版（吹田市役所・商工会議所 提出用）
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "おすそわけ サービス概要（外部配布版）";
pres.author = "おすそわけプロジェクト";

const CORAL = "E8786C";
const CORAL_LIGHT = "FFF1EE";
const GREEN = "3FA535";
const GREEN_LIGHT = "E8F5E5";
const DARK = "2B2B2B";
const GRAY = "666666";
const LIGHT_GRAY = "F5F5F5";
const WHITE = "FFFFFF";
const NAVY = "1E2761";

const FONT_HEAD = "Yu Gothic UI";
const FONT_BODY = "Yu Gothic UI";

function addFooter(slide, pageNum, total) {
  slide.addText("おすそわけ｜Osusowake", {
    x: 0.4, y: 7.1, w: 4, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: GRAY, italic: true
  });
  slide.addText(`${pageNum} / ${total}`, {
    x: 12.5, y: 7.1, w: 0.5, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: GRAY, align: "right"
  });
}

function addSectionHeader(slide, eyebrow, title, color = CORAL) {
  slide.addText(eyebrow, {
    x: 0.6, y: 0.6, w: 6, h: 0.4,
    fontSize: 14, fontFace: FONT_BODY, color: color, bold: true, charSpacing: 4
  });
  slide.addText(title, {
    x: 0.6, y: 1.1, w: 12, h: 0.7,
    fontSize: 32, fontFace: FONT_HEAD, color: DARK, bold: true
  });
}

const TOTAL = 16;

// =========================
// Slide 1: 表紙
// =========================
let s1 = pres.addSlide();
s1.background = { color: CORAL };
s1.addShape("rect", { x: 0, y: 0, w: 0.5, h: 7.5, fill: { color: GREEN } });
s1.addText("おすそわけ", {
  x: 1, y: 1.5, w: 11.3, h: 1.5,
  fontSize: 96, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s1.addText("Osusowake", {
  x: 1, y: 2.9, w: 11.3, h: 0.6,
  fontSize: 28, fontFace: FONT_BODY, color: WHITE, italic: true
});
s1.addShape("rect", { x: 1, y: 3.9, w: 9, h: 0.7, fill: { color: WHITE } });
s1.addText("食品ロスを、おすそわけに。", {
  x: 1, y: 3.9, w: 9, h: 0.7,
  fontSize: 28, fontFace: FONT_HEAD, color: CORAL, bold: true,
  align: "center", valign: "middle"
});
s1.addText("高槻発の食品ロス削減アプリ", {
  x: 1, y: 5.0, w: 11, h: 0.5,
  fontSize: 22, fontFace: FONT_BODY, color: WHITE
});
s1.addText("サービス概要のご案内", {
  x: 1, y: 6.0, w: 11, h: 0.4,
  fontSize: 16, fontFace: FONT_BODY, color: WHITE
});
s1.addText("2026年5月", {
  x: 1, y: 6.5, w: 11, h: 0.4,
  fontSize: 14, fontFace: FONT_BODY, color: WHITE
});

// =========================
// Slide 2: 一言でいうと
// =========================
let s2 = pres.addSlide();
s2.background = { color: WHITE };
addSectionHeader(s2, "WHAT IS IT", "おすそわけは、こんなサービスです。");

s2.addShape("roundRect", {
  x: 0.6, y: 2.4, w: 12.1, h: 3.8,
  fill: { color: CORAL_LIGHT },
  line: { color: CORAL_LIGHT, width: 0 },
  rectRadius: 0.2
});

s2.addText("お店の売れ残りを、", {
  x: 0.6, y: 2.7, w: 12.1, h: 1.0,
  fontSize: 44, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center"
});
s2.addText("お客様がお得に購入できるアプリ。", {
  x: 0.6, y: 3.7, w: 12.1, h: 1.0,
  fontSize: 44, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center"
});
s2.addText("お店は廃棄ロスを減らし、お客様はお得に、地球は少しだけ優しく。", {
  x: 0.6, y: 5.0, w: 12.1, h: 0.7,
  fontSize: 18, fontFace: FONT_BODY, color: GRAY, align: "center"
});

s2.addText("海外で実証済みの「Too Good To Go」モデルを、日本向けに最適化しています。", {
  x: 0.6, y: 6.5, w: 12, h: 0.4,
  fontSize: 13, fontFace: FONT_BODY, color: GRAY, italic: true, align: "center"
});
addFooter(s2, 2, TOTAL);

// =========================
// Slide 3: なぜ始めたか - 全体
// =========================
let s3 = pres.addSlide();
s3.background = { color: DARK };
s3.addText("OUR STORY", {
  x: 0.6, y: 0.6, w: 4, h: 0.4,
  fontSize: 14, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4
});
s3.addText("なぜ、私たちはこの事業を始めたのか。", {
  x: 0.6, y: 1.2, w: 12, h: 0.7,
  fontSize: 28, fontFace: FONT_HEAD, color: WHITE, bold: true
});

s3.addShape("rect", { x: 0.6, y: 2.2, w: 1.0, h: 0.06, fill: { color: CORAL } });

s3.addText("\"", {
  x: 0.6, y: 2.6, w: 1, h: 1.5,
  fontSize: 120, fontFace: FONT_HEAD, color: CORAL, bold: true
});

s3.addText("一人の留学生の体験が、", {
  x: 1.5, y: 3.0, w: 11.5, h: 0.9,
  fontSize: 36, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s3.addText("地元・高槻で動き始めた小さな挑戦になった。", {
  x: 1.5, y: 4.0, w: 11.5, h: 0.9,
  fontSize: 32, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s3.addText("そして今、北摂のまち全体に広げたいと考えています。", {
  x: 1.5, y: 5.4, w: 11.5, h: 0.7,
  fontSize: 20, fontFace: FONT_BODY, color: "DDDDDD"
});

s3.addText(`3 / ${TOTAL}`, {
  x: 12.5, y: 7.1, w: 0.5, h: 0.3,
  fontSize: 9, fontFace: FONT_BODY, color: "AAAAAA", align: "right"
});

// =========================
// Slide 4: ゆうひの物語
// =========================
let s4 = pres.addSlide();
s4.background = { color: WHITE };
addSectionHeader(s4, "FOUNDER'S STORY", "代表・佐藤勇飛のイギリス留学体験から。");

s4.addShape("roundRect", {
  x: 0.6, y: 2.2, w: 4.0, h: 4.8,
  fill: { color: CORAL_LIGHT },
  line: { color: CORAL_LIGHT, width: 0 },
  rectRadius: 0.15
});
s4.addText("🇬🇧", {
  x: 0.6, y: 2.6, w: 4.0, h: 1.4,
  fontSize: 80, align: "center", valign: "middle"
});
s4.addText("2025年", {
  x: 0.6, y: 4.2, w: 4.0, h: 0.5,
  fontSize: 14, fontFace: FONT_BODY, color: GRAY, align: "center"
});
s4.addText("イギリス留学中", {
  x: 0.6, y: 4.6, w: 4.0, h: 0.7,
  fontSize: 22, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center"
});
s4.addText("生活費が底をついて\n困っていた時", {
  x: 0.6, y: 5.4, w: 4.0, h: 1.0,
  fontSize: 14, fontFace: FONT_BODY, color: GRAY, align: "center"
});

s4.addText("「Too Good To Go」というアプリに出会った。", {
  x: 5.0, y: 2.4, w: 8, h: 0.6,
  fontSize: 18, fontFace: FONT_HEAD, color: CORAL, bold: true
});
s4.addText("スーパーやパン屋の閉店前商品を、半額以下で買える仕組み。", {
  x: 5.0, y: 3.0, w: 8, h: 0.6,
  fontSize: 14, fontFace: FONT_BODY, color: DARK
});

s4.addShape("rect", { x: 5.0, y: 3.8, w: 0.8, h: 0.04, fill: { color: CORAL } });

s4.addText("毎日このアプリでお腹を満たしながら、気づいた。", {
  x: 5.0, y: 4.1, w: 8, h: 0.6,
  fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true
});
s4.addText("廃棄予定だった食べ物が、誰かを助ける食事になっている。\n食品ロスを減らしながら、お店もお客も幸せになる。", {
  x: 5.0, y: 4.7, w: 8, h: 1.2,
  fontSize: 14, fontFace: FONT_BODY, color: GRAY
});

s4.addText("「これを、日本でも作りたい」", {
  x: 5.0, y: 6.1, w: 8, h: 0.7,
  fontSize: 22, fontFace: FONT_HEAD, color: CORAL, bold: true, italic: true
});
addFooter(s4, 4, TOTAL);

// =========================
// Slide 5: コウタの物語
// =========================
let s5 = pres.addSlide();
s5.background = { color: WHITE };
addSectionHeader(s5, "CO-FOUNDER'S STORY", "副代表・梅本幸汰が参加した理由。", GREEN);

s5.addShape("roundRect", {
  x: 0.6, y: 2.2, w: 4.0, h: 4.8,
  fill: { color: GREEN_LIGHT },
  line: { color: GREEN_LIGHT, width: 0 },
  rectRadius: 0.15
});
s5.addText("🏘️", {
  x: 0.6, y: 2.6, w: 4.0, h: 1.4,
  fontSize: 80, align: "center", valign: "middle"
});
s5.addText("地元・大阪府高槻市", {
  x: 0.6, y: 4.2, w: 4.0, h: 0.7,
  fontSize: 18, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center"
});
s5.addText("商店街のパン屋さんや\nカフェに通いながら\n大きくなった", {
  x: 0.6, y: 5.0, w: 4.0, h: 1.5,
  fontSize: 13, fontFace: FONT_BODY, color: GRAY, align: "center"
});

s5.addText("父はゼロから事業を立ち上げた人。", {
  x: 5.0, y: 2.4, w: 8, h: 0.6,
  fontSize: 17, fontFace: FONT_HEAD, color: DARK, bold: true
});
s5.addText("その背中を見て「将来は自分の事業を持ちたい」と考えていた。", {
  x: 5.0, y: 3.0, w: 8, h: 0.6,
  fontSize: 13, fontFace: FONT_BODY, color: GRAY
});

s5.addShape("rect", { x: 5.0, y: 3.7, w: 0.8, h: 0.04, fill: { color: GREEN } });

s5.addText("勇飛とは小学校のサッカー時代からの仲間。", {
  x: 5.0, y: 4.0, w: 8, h: 0.6,
  fontSize: 17, fontFace: FONT_HEAD, color: DARK, bold: true
});
s5.addText("留学から帰ってきた彼が「これを日本でやりたい」と\n話した時、本気の目をしていた。", {
  x: 5.0, y: 4.6, w: 8, h: 1.0,
  fontSize: 13, fontFace: FONT_BODY, color: GRAY
});

s5.addShape("rect", { x: 5.0, y: 5.8, w: 0.8, h: 0.04, fill: { color: GREEN } });

s5.addText("「儲かる事業」ではなく", {
  x: 5.0, y: 6.0, w: 8, h: 0.5,
  fontSize: 18, fontFace: FONT_HEAD, color: GREEN, bold: true
});
s5.addText("「無くなったら誰かが困る事業」を作りたい。", {
  x: 5.0, y: 6.5, w: 8, h: 0.5,
  fontSize: 18, fontFace: FONT_HEAD, color: GREEN, bold: true
});
addFooter(s5, 5, TOTAL);

// =========================
// Slide 6: ミッション
// =========================
let s6 = pres.addSlide();
s6.background = { color: WHITE };
s6.addText("MISSION", {
  x: 0.6, y: 0.6, w: 4, h: 0.4,
  fontSize: 14, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4
});
s6.addShape("rect", { x: 0.6, y: 1.0, w: 1.0, h: 0.06, fill: { color: CORAL } });
s6.addText("食品ロスを、", {
  x: 0.6, y: 2.0, w: 12, h: 1.3,
  fontSize: 80, fontFace: FONT_HEAD, color: DARK, bold: true
});
s6.addText("おすそわけに。", {
  x: 0.6, y: 3.3, w: 12, h: 1.3,
  fontSize: 80, fontFace: FONT_HEAD, color: CORAL, bold: true
});
s6.addText("お店の売れ残りを、お得に・おいしく・地球に優しく。", {
  x: 0.6, y: 5.2, w: 12, h: 0.6,
  fontSize: 22, fontFace: FONT_BODY, color: GRAY
});
addFooter(s6, 6, TOTAL);

// =========================
// Slide 7: 食品ロス問題（マクロ）
// =========================
let s7 = pres.addSlide();
s7.background = { color: DARK };
s7.addText("PROBLEM", {
  x: 0.6, y: 0.6, w: 4, h: 0.4,
  fontSize: 14, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4
});
s7.addText("日本の食品ロス、年間", {
  x: 0.6, y: 1.6, w: 12, h: 0.7,
  fontSize: 28, fontFace: FONT_BODY, color: WHITE
});
s7.addText("472", {
  x: 0.6, y: 2.3, w: 8, h: 3.2,
  fontSize: 280, fontFace: FONT_HEAD, color: CORAL, bold: true
});
s7.addText("万トン", {
  x: 7.0, y: 3.5, w: 5, h: 1.5,
  fontSize: 56, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s7.addShape("rect", { x: 0.6, y: 5.8, w: 12, h: 0.06, fill: { color: CORAL } });
s7.addText("国民1人あたり、毎日お茶碗1杯分のご飯を捨てている計算", {
  x: 0.6, y: 6.0, w: 12, h: 0.6,
  fontSize: 22, fontFace: FONT_BODY, color: WHITE
});
s7.addText("出典：環境省・農林水産省（令和3年度推計）", {
  x: 0.6, y: 6.7, w: 12, h: 0.4,
  fontSize: 11, fontFace: FONT_BODY, color: "AAAAAA", italic: true
});
s7.addText(`7 / ${TOTAL}`, {
  x: 12.5, y: 7.1, w: 0.5, h: 0.3,
  fontSize: 9, fontFace: FONT_BODY, color: "AAAAAA", align: "right"
});

// =========================
// Slide 8: 地域の食品ロス
// =========================
let s8 = pres.addSlide();
s8.background = { color: WHITE };
addSectionHeader(s8, "LOCAL IMPACT", "そして、北摂エリアでも。");

s8.addShape("roundRect", { x: 0.6, y: 2.2, w: 5.9, h: 4.6, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
s8.addText("高槻市", { x: 0.6, y: 2.4, w: 5.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center" });
s8.addText("約 9,300", { x: 0.6, y: 3.2, w: 5.9, h: 1.3, fontSize: 64, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
s8.addText("トン / 年（推計）", { x: 0.6, y: 4.6, w: 5.9, h: 0.5, fontSize: 16, color: GRAY, align: "center" });
s8.addText("市民一人あたり 約26kg / 年", { x: 0.6, y: 5.2, w: 5.9, h: 0.5, fontSize: 14, color: DARK, align: "center" });
s8.addText("人口 約35万人", { x: 0.6, y: 5.7, w: 5.9, h: 0.5, fontSize: 12, color: GRAY, align: "center", italic: true });

s8.addShape("roundRect", { x: 6.8, y: 2.2, w: 5.9, h: 4.6, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 1 }, rectRadius: 0.15 });
s8.addText("吹田市", { x: 6.8, y: 2.4, w: 5.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: GREEN, bold: true, align: "center" });
s8.addText("約 9,800", { x: 6.8, y: 3.2, w: 5.9, h: 1.3, fontSize: 64, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
s8.addText("トン / 年（推計）", { x: 6.8, y: 4.6, w: 5.9, h: 0.5, fontSize: 16, color: GRAY, align: "center" });
s8.addText("市民一人あたり 約26kg / 年", { x: 6.8, y: 5.2, w: 5.9, h: 0.5, fontSize: 14, color: DARK, align: "center" });
s8.addText("人口 約38万人", { x: 6.8, y: 5.7, w: 5.9, h: 0.5, fontSize: 12, color: GRAY, align: "center", italic: true });

s8.addText("※ 全国平均値（国民1人あたり約26kg/年）を市の人口に乗じた概算値。正確な数値は自治体公表値をご参照ください。", {
  x: 0.6, y: 6.9, w: 12, h: 0.3,
  fontSize: 10, fontFace: FONT_BODY, color: GRAY, italic: true
});
addFooter(s8, 8, TOTAL);

// =========================
// Slide 9: ソリューション
// =========================
let s9 = pres.addSlide();
s9.background = { color: WHITE };
addSectionHeader(s9, "SOLUTION", "使い方は超シンプル、3ステップ");

const steps = [
  { num: "01", emoji: "🔍", title: "お店を探す", desc: "近くの加盟店の\n余り物をチェック" },
  { num: "02", emoji: "🛒", title: "購入する", desc: "特別価格でアプリから\n簡単に購入" },
  { num: "03", emoji: "🥖", title: "受け取る", desc: "指定時間にお店へ\nピックアップ" }
];
steps.forEach((step, i) => {
  const x = 0.6 + i * 4.2;
  s9.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.2, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
  s9.addText(step.num, { x: x + 0.2, y: 2.5, w: 2, h: 0.6, fontSize: 36, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s9.addText(step.emoji, { x: x, y: 3.3, w: 3.9, h: 1.2, fontSize: 64, align: "center", valign: "middle" });
  s9.addText(step.title, { x: x, y: 4.7, w: 3.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
  s9.addText(step.desc, { x: x + 0.2, y: 5.4, w: 3.5, h: 1.1, fontSize: 14, fontFace: FONT_BODY, color: GRAY, align: "center" });
});
addFooter(s9, 9, TOTAL);

// =========================
// Slide 10: ビジネスモデル
// =========================
let s10 = pres.addSlide();
s10.background = { color: WHITE };
addSectionHeader(s10, "BUSINESS MODEL", "お店リスクゼロの仕組み");
const fees = [
  { num: "¥0", label: "初期費用", color: GREEN },
  { num: "¥0", label: "月額固定費", color: GREEN },
  { num: "25%", label: "売れた分だけ手数料", color: CORAL }
];
fees.forEach((fee, i) => {
  const x = 0.6 + i * 4.2;
  s10.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 3.4, fill: { color: WHITE }, line: { color: fee.color, width: 3 }, rectRadius: 0.15 });
  s10.addText(fee.num, { x: x, y: 2.7, w: 3.9, h: 1.8, fontSize: 96, fontFace: FONT_HEAD, color: fee.color, bold: true, align: "center", valign: "middle" });
  s10.addText(fee.label, { x: x, y: 4.8, w: 3.9, h: 0.7, fontSize: 20, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
});
s10.addShape("roundRect", { x: 0.6, y: 6.1, w: 12.1, h: 0.7, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.1 });
s10.addText("✓ Stripe決済（業界最高水準のセキュリティ）｜売れ残っても費用は発生しません", {
  x: 0.6, y: 6.1, w: 12.1, h: 0.7,
  fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle"
});
addFooter(s10, 10, TOTAL);

// =========================
// Slide 11: 三方良し
// =========================
let s11 = pres.addSlide();
s11.background = { color: WHITE };
addSectionHeader(s11, "WHY IT WORKS", "三方良しの構造");

const sanpou = [
  { who: "お店", emoji: "🏪", benefit: "廃棄ロス削減\n+ 新規顧客獲得\n+ ブランド向上", color: CORAL },
  { who: "お客様", emoji: "👤", benefit: "お得に購入\n+ 食品ロス削減に\n  参加できる", color: GREEN },
  { who: "地域・地球", emoji: "🌍", benefit: "CO2削減\n+ 地域経済活性化\n+ SDGs達成", color: NAVY }
];
sanpou.forEach((s, i) => {
  const x = 0.6 + i * 4.2;
  s11.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.4, fill: { color: WHITE }, line: { color: s.color, width: 2 }, rectRadius: 0.15 });
  s11.addShape("rect", { x: x, y: 2.4, w: 3.9, h: 0.7, fill: { color: s.color }, line: { color: s.color, width: 0 } });
  s11.addText(s.who, { x: x, y: 2.4, w: 3.9, h: 0.7, fontSize: 22, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s11.addText(s.emoji, { x: x, y: 3.3, w: 3.9, h: 1.5, fontSize: 80, align: "center", valign: "middle" });
  s11.addText(s.benefit, { x: x + 0.2, y: 5.0, w: 3.5, h: 1.7, fontSize: 15, fontFace: FONT_BODY, color: DARK, align: "center", valign: "middle" });
});
addFooter(s11, 11, TOTAL);

// =========================
// Slide 12: 高槻実績
// =========================
let s12 = pres.addSlide();
s12.background = { color: WHITE };
addSectionHeader(s12, "TRACTION", "高槻で、もう動いています");

const traction = [
  { icon: "🤝", title: "提携契約", value: "9店 締結済み", sub: "ベーカリー・飲食・スイーツ" },
  { icon: "🏪", title: "高槻エリア把握", value: "50店超", sub: "営業中31店・契約交渉中" },
  { icon: "📧", title: "本社アプローチ", value: "複数社 接触中", sub: "地元チェーン含む" },
  { icon: "🚀", title: "正式リリース", value: "7月1日(水)", sub: "App Store審査通過済み" }
];
traction.forEach((t, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.6 + col * 6.2;
  const y = 2.4 + row * 2.2;
  s12.addShape("roundRect", { x: x, y: y, w: 6.0, h: 2.0, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
  s12.addText(t.icon, { x: x + 0.3, y: y + 0.3, w: 1.2, h: 1.4, fontSize: 48, align: "center", valign: "middle" });
  s12.addText(t.title, { x: x + 1.7, y: y + 0.2, w: 4.2, h: 0.5, fontSize: 14, fontFace: FONT_BODY, color: GRAY });
  s12.addText(t.value, { x: x + 1.7, y: y + 0.6, w: 4.2, h: 0.7, fontSize: 28, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s12.addText(t.sub, { x: x + 1.7, y: y + 1.4, w: 4.2, h: 0.5, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
});
addFooter(s12, 12, TOTAL);

// =========================
// Slide 13: ロードマップ
// =========================
let s13 = pres.addSlide();
s13.background = { color: WHITE };
addSectionHeader(s13, "ROADMAP", "ローンチ前後3ヶ月の計画");

const milestones = [
  { date: "5月", title: "ローンチ準備", items: "・営業強化\n・SNS立ち上げ\n・自治体連携交渉", color: GRAY },
  { date: "7/1", title: "🚀 高槻ローンチ", items: "・正式リリース\n・PR・SNS本格運用\n・初期ユーザー獲得", color: CORAL },
  { date: "7月", title: "吹田展開", items: "・吹田店舗開拓\n・関大連携開始\n・モニター運用", color: GREEN },
  { date: "8月", title: "北摂拡大", items: "・茨木・摂津に拡大\n・チェーン本社合意\n・1,000ユーザー", color: NAVY }
];
milestones.forEach((m, i) => {
  const x = 0.6 + i * 3.1;
  s13.addShape("roundRect", { x: x, y: 2.4, w: 2.95, h: 4.4, fill: { color: WHITE }, line: { color: m.color, width: 2 }, rectRadius: 0.1 });
  s13.addShape("rect", { x: x, y: 2.4, w: 2.95, h: 0.7, fill: { color: m.color }, line: { color: m.color, width: 0 } });
  s13.addText(m.date, { x: x, y: 2.4, w: 2.95, h: 0.7, fontSize: 20, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s13.addText(m.title, { x: x, y: 3.3, w: 2.95, h: 0.7, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
  s13.addText(m.items, { x: x + 0.2, y: 4.2, w: 2.55, h: 2.4, fontSize: 12, fontFace: FONT_BODY, color: DARK });
});
addFooter(s13, 13, TOTAL);

// =========================
// Slide 14: 吹田展開ビジョン
// =========================
let s14 = pres.addSlide();
s14.background = { color: WHITE };
addSectionHeader(s14, "EXPANSION", "北摂2市、同時連携へ。");

s14.addShape("roundRect", { x: 0.6, y: 2.3, w: 5.8, h: 4.3, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
s14.addText("📍", { x: 0.6, y: 2.5, w: 5.8, h: 1.0, fontSize: 56, align: "center" });
s14.addText("高槻市", { x: 0.6, y: 3.6, w: 5.8, h: 0.7, fontSize: 36, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center" });
s14.addText("起点エリア・営業ほぼ完了", { x: 0.6, y: 4.3, w: 5.8, h: 0.5, fontSize: 16, color: DARK, align: "center" });
s14.addText("7/1 ローンチ予定", { x: 0.6, y: 4.8, w: 5.8, h: 0.5, fontSize: 16, color: GRAY, align: "center" });

s14.addText("＋", { x: 6.4, y: 3.8, w: 0.5, h: 1.2, fontSize: 48, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });

s14.addShape("roundRect", { x: 6.9, y: 2.3, w: 5.8, h: 4.3, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 2 }, rectRadius: 0.15 });
s14.addText("📍", { x: 6.9, y: 2.5, w: 5.8, h: 1.0, fontSize: 56, align: "center" });
s14.addText("吹田市", { x: 6.9, y: 3.6, w: 5.8, h: 0.7, fontSize: 36, fontFace: FONT_HEAD, color: GREEN, bold: true, align: "center" });
s14.addText("関大千里山キャンパスあり", { x: 6.9, y: 4.3, w: 5.8, h: 0.5, fontSize: 16, color: DARK, align: "center" });
s14.addText("学生×行政連携の最適エリア", { x: 6.9, y: 4.8, w: 5.8, h: 0.5, fontSize: 16, color: GRAY, align: "center" });

s14.addText("北摂2市同時連携は、単市連携の 3倍 のPRインパクト。", {
  x: 0.6, y: 6.7, w: 12, h: 0.4,
  fontSize: 16, fontFace: FONT_BODY, color: DARK, italic: true, align: "center"
});
addFooter(s14, 14, TOTAL);

// =========================
// Slide 15: 自治体連携でできること
// =========================
let s15 = pres.addSlide();
s15.background = { color: WHITE };
addSectionHeader(s15, "PARTNERSHIP", "自治体・商工会議所との連携でできること", GREEN);

const partner = [
  { icon: "📊", title: "食品ロス削減レポート", desc: "市内の削減量を毎月レポート。\n施策の効果可視化に活用可能。" },
  { icon: "🤝", title: "市内事業者の支援", desc: "廃棄ロスに困っている\n地元店舗のサポート窓口に。" },
  { icon: "🎓", title: "関西大学との連携", desc: "千里山キャンパスを起点に\n学生×地域の協働モデル。" },
  { icon: "🌱", title: "SDGs目標への貢献", desc: "目標12「つくる責任つかう責任」\nの具体的な施策として。" }
];

partner.forEach((p, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.6 + col * 6.2;
  const y = 2.4 + row * 2.2;
  s15.addShape("roundRect", { x: x, y: y, w: 6.0, h: 2.0, fill: { color: GREEN_LIGHT }, line: { color: GREEN_LIGHT, width: 0 }, rectRadius: 0.1 });
  s15.addText(p.icon, { x: x + 0.3, y: y + 0.3, w: 1.2, h: 1.4, fontSize: 42, align: "center", valign: "middle" });
  s15.addText(p.title, { x: x + 1.7, y: y + 0.25, w: 4.2, h: 0.5, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true });
  s15.addText(p.desc, { x: x + 1.7, y: y + 0.75, w: 4.2, h: 1.2, fontSize: 12, fontFace: FONT_BODY, color: DARK });
});
addFooter(s15, 15, TOTAL);

// =========================
// Slide 16: ご相談・連絡先
// =========================
let s16 = pres.addSlide();
s16.background = { color: CORAL };

s16.addText("お気軽にご相談ください。", {
  x: 0.6, y: 1.5, w: 12, h: 0.9,
  fontSize: 36, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s16.addText("地域の食品ロス削減について、一緒に考えさせてください。", {
  x: 0.6, y: 2.5, w: 12, h: 0.6,
  fontSize: 18, fontFace: FONT_BODY, color: WHITE
});

s16.addShape("roundRect", { x: 0.6, y: 3.6, w: 12.1, h: 3.2, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.15 });
s16.addText("CONTACT", { x: 0.9, y: 3.75, w: 4, h: 0.3, fontSize: 11, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4 });

s16.addText("おすそわけプロジェクト", { x: 0.9, y: 4.1, w: 12, h: 0.5, fontSize: 22, fontFace: FONT_HEAD, color: DARK, bold: true });
s16.addText("関西大学・立命館大学・龍谷大学の有志による合同チーム", { x: 0.9, y: 4.6, w: 12, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: GRAY });

const contacts = [
  { label: "📧 Email", value: "hello.osusowake@gmail.com" },
  { label: "📷 Instagram", value: "@osusowake_official" },
  { label: "𝕏 X (Twitter)", value: "@Osusowake_offi" },
  { label: "🌐 Web版", value: "osusowakejapan.org" }
];
contacts.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.9 + col * 6.0;
  const y = 5.3 + row * 0.6;
  s16.addText(c.label, { x: x, y: y, w: 1.8, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
  s16.addText(c.value, { x: x + 1.8, y: y, w: 4.0, h: 0.4, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true });
});

pres.writeFile({ fileName: "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\osusowake_pitch_for_suita.pptx" })
  .then(fileName => console.log(`Created: ${fileName}`))
  .catch(err => console.error("Error:", err));
