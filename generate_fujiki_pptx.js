// 藤木議員MTG用プレゼン資料生成（詳細版・18枚）
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "おすそわけ 藤木議員MTG資料（詳細版）";
pres.author = "梅本幸汰";

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
  slide.addText("Osusowake / おすそわけ", {
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

const TOTAL = 18;

// =========================
// Slide 1: 表紙
// =========================
let s1 = pres.addSlide();
s1.background = { color: CORAL };
s1.addShape("rect", { x: 0, y: 0, w: 0.5, h: 7.5, fill: { color: GREEN } });
s1.addText("おすそわけ", {
  x: 1, y: 1.8, w: 11.3, h: 1.5,
  fontSize: 96, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s1.addText("Osusowake", {
  x: 1, y: 3.2, w: 11.3, h: 0.6,
  fontSize: 28, fontFace: FONT_BODY, color: WHITE, italic: true
});
s1.addShape("rect", { x: 1, y: 4.2, w: 8, h: 0.7, fill: { color: WHITE } });
s1.addText("食品ロスを、おすそわけに。", {
  x: 1, y: 4.2, w: 8, h: 0.7,
  fontSize: 28, fontFace: FONT_HEAD, color: CORAL, bold: true,
  align: "center", valign: "middle"
});
s1.addText("2026.05.18", {
  x: 1, y: 5.5, w: 11, h: 0.5,
  fontSize: 24, fontFace: FONT_BODY, color: WHITE, bold: true
});
s1.addText("高槻発スタートアップ｜藤木えいすけ先生 面談資料", {
  x: 1, y: 6.1, w: 11, h: 0.4,
  fontSize: 16, fontFace: FONT_BODY, color: WHITE
});

// =========================
// Slide 2: 本日のアジェンダ
// =========================
let s2 = pres.addSlide();
s2.background = { color: WHITE };
addSectionHeader(s2, "AGENDA", "本日お話しさせていただくこと");

const agenda = [
  { num: "01", title: "おすそわけの取り組み", desc: "ミッション・解決する課題・サービス概要" },
  { num: "02", title: "高槻での実績と進捗", desc: "営業状況・チーム体制・ローンチ予定" },
  { num: "03", title: "吹田市への展開ビジョン", desc: "北摂2市同時連携の構想" },
  { num: "04", title: "藤木先生へのお願い", desc: "市役所・商工会議所のご紹介について" },
  { num: "05", title: "先生へのお返し", desc: "継続的にご支援いただける関係性の構築" }
];

agenda.forEach((a, i) => {
  const y = 2.0 + i * 0.95;
  s2.addText(a.num, {
    x: 0.8, y: y, w: 0.9, h: 0.7,
    fontSize: 28, fontFace: FONT_HEAD, color: CORAL, bold: true, valign: "middle"
  });
  s2.addText(a.title, {
    x: 2.0, y: y, w: 5, h: 0.7,
    fontSize: 18, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle"
  });
  s2.addText(a.desc, {
    x: 7.2, y: y, w: 5.5, h: 0.7,
    fontSize: 13, fontFace: FONT_BODY, color: GRAY, valign: "middle"
  });
  if (i < 4) {
    s2.addShape("rect", { x: 0.8, y: y + 0.8, w: 11.8, h: 0.02, fill: { color: LIGHT_GRAY } });
  }
});

addFooter(s2, 2, TOTAL);

// =========================
// Slide 3: ミッション
// =========================
let s3 = pres.addSlide();
s3.background = { color: WHITE };
s3.addText("MISSION", {
  x: 0.6, y: 0.6, w: 4, h: 0.4,
  fontSize: 14, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4
});
s3.addShape("rect", { x: 0.6, y: 1.0, w: 1.0, h: 0.06, fill: { color: CORAL } });
s3.addText("食品ロスを、", {
  x: 0.6, y: 2.0, w: 12, h: 1.3,
  fontSize: 80, fontFace: FONT_HEAD, color: DARK, bold: true
});
s3.addText("おすそわけに。", {
  x: 0.6, y: 3.3, w: 12, h: 1.3,
  fontSize: 80, fontFace: FONT_HEAD, color: CORAL, bold: true
});
s3.addText("お店の売れ残りを、お得に・おいしく・地球に優しく。", {
  x: 0.6, y: 5.2, w: 12, h: 0.6,
  fontSize: 22, fontFace: FONT_BODY, color: GRAY
});
const missionItems = [
  { emoji: "🥖", label: "美味しい" },
  { emoji: "💰", label: "お得" },
  { emoji: "🌍", label: "地球に優しい" }
];
missionItems.forEach((item, i) => {
  const x = 1.0 + i * 4.0;
  s3.addShape("ellipse", { x: x, y: 6.0, w: 0.8, h: 0.8, fill: { color: CORAL_LIGHT } });
  s3.addText(item.emoji, { x: x, y: 6.0, w: 0.8, h: 0.8, fontSize: 28, align: "center", valign: "middle" });
  s3.addText(item.label, {
    x: x + 1.0, y: 6.1, w: 3, h: 0.6,
    fontSize: 20, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle"
  });
});
addFooter(s3, 3, TOTAL);

// =========================
// Slide 4: 問題提起（マクロ）
// =========================
let s4 = pres.addSlide();
s4.background = { color: DARK };
s4.addText("PROBLEM #1", {
  x: 0.6, y: 0.6, w: 4, h: 0.4,
  fontSize: 14, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4
});
s4.addText("日本の食品ロス、年間", {
  x: 0.6, y: 1.6, w: 12, h: 0.7,
  fontSize: 28, fontFace: FONT_BODY, color: WHITE
});
s4.addText("472", {
  x: 0.6, y: 2.3, w: 8, h: 3.2,
  fontSize: 280, fontFace: FONT_HEAD, color: CORAL, bold: true
});
s4.addText("万トン", {
  x: 7.0, y: 3.5, w: 5, h: 1.5,
  fontSize: 56, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s4.addShape("rect", { x: 0.6, y: 5.8, w: 12, h: 0.06, fill: { color: CORAL } });
s4.addText("国民1人あたり、毎日お茶碗1杯分のご飯を捨てている計算", {
  x: 0.6, y: 6.0, w: 12, h: 0.6,
  fontSize: 22, fontFace: FONT_BODY, color: WHITE
});
s4.addText("出典：環境省・農林水産省（令和3年度推計）", {
  x: 0.6, y: 6.7, w: 12, h: 0.4,
  fontSize: 11, fontFace: FONT_BODY, color: "AAAAAA", italic: true
});
s4.addText(`4 / ${TOTAL}`, {
  x: 12.5, y: 7.1, w: 0.5, h: 0.3,
  fontSize: 9, fontFace: FONT_BODY, color: "AAAAAA", align: "right"
});

// =========================
// Slide 5: 問題提起（ローカル）
// =========================
let s5 = pres.addSlide();
s5.background = { color: WHITE };
addSectionHeader(s5, "PROBLEM #2", "そして、北摂エリアでも。");

s5.addShape("roundRect", { x: 0.6, y: 2.2, w: 5.9, h: 4.6, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
s5.addText("高槻市", { x: 0.6, y: 2.4, w: 5.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center" });
s5.addText("約 9,300", { x: 0.6, y: 3.2, w: 5.9, h: 1.3, fontSize: 64, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
s5.addText("トン / 年（推計）", { x: 0.6, y: 4.6, w: 5.9, h: 0.5, fontSize: 16, color: GRAY, align: "center" });
s5.addText("市民一人あたり 約26kg / 年", { x: 0.6, y: 5.2, w: 5.9, h: 0.5, fontSize: 14, color: DARK, align: "center" });
s5.addText("人口 約35万人", { x: 0.6, y: 5.7, w: 5.9, h: 0.5, fontSize: 12, color: GRAY, align: "center", italic: true });

s5.addShape("roundRect", { x: 6.8, y: 2.2, w: 5.9, h: 4.6, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 1 }, rectRadius: 0.15 });
s5.addText("吹田市", { x: 6.8, y: 2.4, w: 5.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: GREEN, bold: true, align: "center" });
s5.addText("約 9,800", { x: 6.8, y: 3.2, w: 5.9, h: 1.3, fontSize: 64, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
s5.addText("トン / 年（推計）", { x: 6.8, y: 4.6, w: 5.9, h: 0.5, fontSize: 16, color: GRAY, align: "center" });
s5.addText("市民一人あたり 約26kg / 年", { x: 6.8, y: 5.2, w: 5.9, h: 0.5, fontSize: 14, color: DARK, align: "center" });
s5.addText("人口 約38万人", { x: 6.8, y: 5.7, w: 5.9, h: 0.5, fontSize: 12, color: GRAY, align: "center", italic: true });

s5.addText("※ 全国平均値（国民1人あたり約26kg/年）を市の人口に乗じた概算値", {
  x: 0.6, y: 6.9, w: 12, h: 0.3,
  fontSize: 10, fontFace: FONT_BODY, color: GRAY, italic: true
});
addFooter(s5, 5, TOTAL);

// =========================
// Slide 6: ソリューション（3ステップ）
// =========================
let s6 = pres.addSlide();
s6.background = { color: WHITE };
addSectionHeader(s6, "SOLUTION", "使い方は超シンプル、3ステップ");

const steps = [
  { num: "01", emoji: "🔍", title: "お店を探す", desc: "近くの加盟店の\n余り物をチェック" },
  { num: "02", emoji: "🛒", title: "購入する", desc: "特別価格でアプリから\n簡単に購入" },
  { num: "03", emoji: "🥖", title: "受け取る", desc: "指定時間にお店へ\nピックアップ" }
];
steps.forEach((step, i) => {
  const x = 0.6 + i * 4.2;
  s6.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.2, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
  s6.addText(step.num, { x: x + 0.2, y: 2.5, w: 2, h: 0.6, fontSize: 36, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s6.addText(step.emoji, { x: x, y: 3.3, w: 3.9, h: 1.2, fontSize: 64, align: "center", valign: "middle" });
  s6.addText(step.title, { x: x, y: 4.7, w: 3.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
  s6.addText(step.desc, { x: x + 0.2, y: 5.4, w: 3.5, h: 1.1, fontSize: 14, fontFace: FONT_BODY, color: GRAY, align: "center" });
});
addFooter(s6, 6, TOTAL);

// =========================
// Slide 7: ビジネスモデル
// =========================
let s7 = pres.addSlide();
s7.background = { color: WHITE };
addSectionHeader(s7, "BUSINESS MODEL", "お店リスクゼロの仕組み");
const fees = [
  { num: "¥0", label: "初期費用", color: GREEN },
  { num: "¥0", label: "月額固定費", color: GREEN },
  { num: "25%", label: "売れた分だけ手数料", color: CORAL }
];
fees.forEach((fee, i) => {
  const x = 0.6 + i * 4.2;
  s7.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 3.4, fill: { color: WHITE }, line: { color: fee.color, width: 3 }, rectRadius: 0.15 });
  s7.addText(fee.num, { x: x, y: 2.7, w: 3.9, h: 1.8, fontSize: 96, fontFace: FONT_HEAD, color: fee.color, bold: true, align: "center", valign: "middle" });
  s7.addText(fee.label, { x: x, y: 4.8, w: 3.9, h: 0.7, fontSize: 20, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
});
s7.addShape("roundRect", { x: 0.6, y: 6.1, w: 12.1, h: 0.7, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.1 });
s7.addText("✓ Stripe決済（クレジットカード業界最高水準のセキュリティ）｜売れ残っても費用は発生しません", {
  x: 0.6, y: 6.1, w: 12.1, h: 0.7,
  fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle"
});
addFooter(s7, 7, TOTAL);

// =========================
// Slide 8: 三方良し
// =========================
let s8 = pres.addSlide();
s8.background = { color: WHITE };
addSectionHeader(s8, "WHY IT WORKS", "三方良しの構造");

const sanpou = [
  { who: "お店", emoji: "🏪", benefit: "廃棄ロス削減\n+ 新規顧客獲得\n+ ブランド向上", color: CORAL },
  { who: "お客様", emoji: "👤", benefit: "お得に購入\n+ 食品ロス削減に\n  参加できる", color: GREEN },
  { who: "地域・地球", emoji: "🌍", benefit: "CO2削減\n+ 地域経済活性化\n+ SDGs達成", color: NAVY }
];
sanpou.forEach((s, i) => {
  const x = 0.6 + i * 4.2;
  s8.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.4, fill: { color: WHITE }, line: { color: s.color, width: 2 }, rectRadius: 0.15 });
  s8.addShape("rect", { x: x, y: 2.4, w: 3.9, h: 0.7, fill: { color: s.color }, line: { color: s.color, width: 0 } });
  s8.addText(s.who, { x: x, y: 2.4, w: 3.9, h: 0.7, fontSize: 22, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s8.addText(s.emoji, { x: x, y: 3.3, w: 3.9, h: 1.5, fontSize: 80, align: "center", valign: "middle" });
  s8.addText(s.benefit, { x: x + 0.2, y: 5.0, w: 3.5, h: 1.7, fontSize: 15, fontFace: FONT_BODY, color: DARK, align: "center", valign: "middle" });
});
addFooter(s8, 8, TOTAL);

// =========================
// Slide 9: 高槻実績
// =========================
let s9 = pres.addSlide();
s9.background = { color: WHITE };
addSectionHeader(s9, "TRACTION", "高槻で、もう動いています");

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
  s9.addShape("roundRect", { x: x, y: y, w: 6.0, h: 2.0, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
  s9.addText(t.icon, { x: x + 0.3, y: y + 0.3, w: 1.2, h: 1.4, fontSize: 48, align: "center", valign: "middle" });
  s9.addText(t.title, { x: x + 1.7, y: y + 0.2, w: 4.2, h: 0.5, fontSize: 14, fontFace: FONT_BODY, color: GRAY });
  s9.addText(t.value, { x: x + 1.7, y: y + 0.6, w: 4.2, h: 0.7, fontSize: 28, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s9.addText(t.sub, { x: x + 1.7, y: y + 1.4, w: 4.2, h: 0.5, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
});
addFooter(s9, 9, TOTAL);

// =========================
// Slide 10: チーム紹介
// =========================
let s10 = pres.addSlide();
s10.background = { color: WHITE };
addSectionHeader(s10, "TEAM", "関西3大学合同・8名体制");

const team = [
  { name: "佐藤 勇飛", role: "CEO / 代表", desc: "関西大学｜事業統括" },
  { name: "梅本 幸汰", role: "COO / 副代表", desc: "関西大学｜営業・運営" },
  { name: "吉澤 駿佑", role: "営業", desc: "関西大学｜店舗開拓" },
  { name: "竹倉 己博", role: "営業", desc: "立命館大学｜現場リード" },
  { name: "関本 達也", role: "営業", desc: "龍谷大学｜開発兼任" },
  { name: "今井 蒼空", role: "営業", desc: "龍谷大学｜SNS・DM" },
  { name: "岡本 悠希", role: "営業", desc: "龍谷大学｜店舗開拓" },
  { name: "谷川 碧唯", role: "営業", desc: "龍谷大学｜店舗開拓" }
];

team.forEach((m, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 0.6 + col * 3.1;
  const y = 2.4 + row * 2.1;
  s10.addShape("roundRect", { x: x, y: y, w: 2.95, h: 1.9, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
  s10.addShape("ellipse", { x: x + 0.2, y: y + 0.2, w: 0.7, h: 0.7, fill: { color: CORAL } });
  s10.addText(m.name.slice(0, 1), { x: x + 0.2, y: y + 0.2, w: 0.7, h: 0.7, fontSize: 22, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s10.addText(m.name, { x: x + 1.0, y: y + 0.15, w: 1.9, h: 0.4, fontSize: 13, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s10.addText(m.role, { x: x + 1.0, y: y + 0.55, w: 1.9, h: 0.3, fontSize: 10, fontFace: FONT_BODY, color: CORAL, bold: true, valign: "middle" });
  s10.addText(m.desc, { x: x + 0.2, y: y + 1.15, w: 2.6, h: 0.6, fontSize: 11, fontFace: FONT_BODY, color: GRAY });
});

s10.addText("関西大学・立命館大学・龍谷大学の同年代が集まった合同チーム。卒業後も事業として継続予定。", {
  x: 0.6, y: 6.8, w: 12, h: 0.3,
  fontSize: 12, fontFace: FONT_BODY, color: GRAY, italic: true, align: "center"
});
addFooter(s10, 10, TOTAL);

// =========================
// Slide 11: 営業チャネル（強化版）
// =========================
let s11 = pres.addSlide();
s11.background = { color: WHITE };
addSectionHeader(s11, "SALES CHANNEL", "6つのチャネルで、店舗獲得を加速。");

const channels = [
  { icon: "🚶", name: "訪問営業", target: "高槻のパン屋・飲食店", status: "50店超把握 / 31店営業中", color: CORAL },
  { icon: "📞", name: "テレアポ", target: "高槻エリア飲食店", status: "7店アポ獲得済み", color: CORAL },
  { icon: "💬", name: "Instagram DM", target: "カフェ・居酒屋・専門店", status: "37店接触・アポ獲得済み", color: GREEN },
  { icon: "📧", name: "本社営業（チェーン）", target: "地元チェーン・ベーカリー本社", status: "複数社へアプローチ中", color: NAVY },
  { icon: "🏛", name: "自治体ルート", target: "高槻市・吹田市", status: "本日ご相談 ←", color: CORAL },
  { icon: "🤝", name: "商工会議所", target: "高槻・吹田の事業者ネットワーク", status: "ご紹介依頼予定", color: GREEN }
];

channels.forEach((c, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.6 + col * 4.15;
  const y = 2.2 + row * 2.1;
  s11.addShape("roundRect", { x: x, y: y, w: 3.95, h: 1.95, fill: { color: WHITE }, line: { color: c.color, width: 2 }, rectRadius: 0.1 });
  s11.addText(c.icon, { x: x + 0.15, y: y + 0.25, w: 0.9, h: 1.4, fontSize: 34, align: "center", valign: "middle" });
  s11.addText(c.name, { x: x + 1.15, y: y + 0.15, w: 2.7, h: 0.45, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true });
  s11.addText(c.target, { x: x + 1.15, y: y + 0.6, w: 2.7, h: 0.55, fontSize: 10, fontFace: FONT_BODY, color: GRAY });
  s11.addText(c.status, { x: x + 1.15, y: y + 1.2, w: 2.7, h: 0.6, fontSize: 12, fontFace: FONT_HEAD, color: c.color, bold: true });
});

// 下部に成果サマリー
s11.addShape("roundRect", {
  x: 0.6, y: 6.5, w: 12.1, h: 0.55,
  fill: { color: CORAL },
  line: { color: CORAL, width: 0 },
  rectRadius: 0.1
});
s11.addText("🏆  すでに 9店 と契約締結済み｜50店超を把握｜複数の本社にアプローチ中", {
  x: 0.6, y: 6.5, w: 12.1, h: 0.55,
  fontSize: 15, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle"
});
addFooter(s11, 11, TOTAL);

// =========================
// Slide 12: SNS戦略
// =========================
let s12 = pres.addSlide();
s12.background = { color: WHITE };
addSectionHeader(s12, "MARKETING", "SNS でユーザーを獲得する");

const snsList = [
  { platform: "Instagram", handle: "@osusowake_official", current: "フォロワー 約100", target: "→ 目標 3,000", desc: "公式アカウント・店舗紹介・使い方発信" },
  { platform: "X (Twitter)", handle: "@Osusowake_offi", current: "2026.5 開設・運用開始", target: "→ 目標 1,000", desc: "リアルタイム情報・地域コミュニティ" },
  { platform: "TikTok", handle: "（ローンチに合わせて公開）", current: "コンテンツ準備中", target: "→ 目標 5,000", desc: "高槻パン屋紹介シリーズ・店主インタビュー" }
];

snsList.forEach((s, i) => {
  const y = 2.3 + i * 1.4;
  s12.addShape("roundRect", { x: 0.6, y: y, w: 12.1, h: 1.2, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
  s12.addText(s.platform, { x: 0.9, y: y + 0.1, w: 2.5, h: 0.5, fontSize: 18, fontFace: FONT_HEAD, color: DARK, bold: true });
  s12.addText(s.handle, { x: 0.9, y: y + 0.65, w: 2.5, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: CORAL });
  s12.addText(s.current, { x: 3.6, y: y + 0.1, w: 2.5, h: 0.5, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
  s12.addText(s.target, { x: 3.6, y: y + 0.65, w: 2.5, h: 0.4, fontSize: 14, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s12.addText(s.desc, { x: 6.3, y: y + 0.3, w: 6.4, h: 0.7, fontSize: 13, fontFace: FONT_BODY, color: DARK, valign: "middle" });
});

s12.addText("📌 ローンチ後30日のフォロワー獲得が最初の勝負どころ", {
  x: 0.6, y: 6.7, w: 12, h: 0.4,
  fontSize: 14, fontFace: FONT_BODY, color: DARK, italic: true, align: "center"
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
s14.addText("ゆうひが市役所知人経由で連携交渉中", { x: 0.6, y: 5.5, w: 5.8, h: 0.5, fontSize: 12, color: GRAY, italic: true, align: "center" });

s14.addText("＋", { x: 6.4, y: 3.8, w: 0.5, h: 1.2, fontSize: 48, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });

s14.addShape("roundRect", { x: 6.9, y: 2.3, w: 5.8, h: 4.3, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 2 }, rectRadius: 0.15 });
s14.addText("📍", { x: 6.9, y: 2.5, w: 5.8, h: 1.0, fontSize: 56, align: "center" });
s14.addText("吹田市", { x: 6.9, y: 3.6, w: 5.8, h: 0.7, fontSize: 36, fontFace: FONT_HEAD, color: GREEN, bold: true, align: "center" });
s14.addText("関大千里山キャンパスあり", { x: 6.9, y: 4.3, w: 5.8, h: 0.5, fontSize: 16, color: DARK, align: "center" });
s14.addText("学生×行政連携の最適エリア", { x: 6.9, y: 4.8, w: 5.8, h: 0.5, fontSize: 16, color: GRAY, align: "center" });
s14.addText("藤木先生のお力をお借りしたい ←", { x: 6.9, y: 5.5, w: 5.8, h: 0.5, fontSize: 13, color: GREEN, bold: true, italic: true, align: "center" });

s14.addText("北摂2市同時連携は、単市連携の 3倍 のPRインパクト。", {
  x: 0.6, y: 6.7, w: 12, h: 0.4,
  fontSize: 16, fontFace: FONT_BODY, color: DARK, italic: true, align: "center"
});
addFooter(s14, 14, TOTAL);

// =========================
// Slide 15: 吹田が最適な理由
// =========================
let s15 = pres.addSlide();
s15.background = { color: WHITE };
addSectionHeader(s15, "WHY SUITA", "吹田市が「次の一手」として最適な3つの理由", GREEN);

const reasons = [
  { num: "01", title: "関西大学千里山キャンパスがある", desc: "学生3万人 = アプリの初期ユーザー候補。\n大学発スタートアップとして「ホーム」の地で動ける必然性。" },
  { num: "02", title: "高槻からアクセスが良い", desc: "JR・阪急で15分。営業チームが\n両市を1日で回れる物理的近さは戦術的に大きい。" },
  { num: "03", title: "藤木先生のご支援をいただける可能性", desc: "父・梅本淳一の関大一中時代からのご縁。\n議員ルート経由なら市役所の対応速度が3倍違うと聞きます。" }
];

reasons.forEach((r, i) => {
  const y = 2.4 + i * 1.5;
  s15.addShape("ellipse", { x: 0.8, y: y, w: 1.0, h: 1.0, fill: { color: GREEN }, line: { color: GREEN, width: 0 } });
  s15.addText(r.num, { x: 0.8, y: y, w: 1.0, h: 1.0, fontSize: 22, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s15.addText(r.title, { x: 2.1, y: y - 0.05, w: 10.5, h: 0.5, fontSize: 18, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s15.addText(r.desc, { x: 2.1, y: y + 0.45, w: 10.5, h: 0.9, fontSize: 13, fontFace: FONT_BODY, color: GRAY });
  if (i < 2) s15.addShape("rect", { x: 2.1, y: y + 1.3, w: 10.5, h: 0.02, fill: { color: LIGHT_GRAY } });
});
addFooter(s15, 15, TOTAL);

// =========================
// Slide 16: お願い3点
// =========================
let s16 = pres.addSlide();
s16.background = { color: WHITE };
addSectionHeader(s16, "REQUEST", "藤木先生へ、3つのお願い。");

const asks = [
  { num: "01", title: "吹田市役所担当者のご紹介", desc: "環境部（食品ロス削減担当）／地域経済振興室" },
  { num: "02", title: "吹田商工会議所のご紹介", desc: "市内事業者様への展開を加速させたく存じます" },
  { num: "03", title: "関西大学との連携にお力添え", desc: "学生団体・SDGsゼミとの協働可能性のご助言" }
];

asks.forEach((ask, i) => {
  const y = 2.4 + i * 1.5;
  s16.addShape("ellipse", { x: 0.8, y: y, w: 1.2, h: 1.2, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
  s16.addText(ask.num, { x: 0.8, y: y, w: 1.2, h: 1.2, fontSize: 28, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s16.addText(ask.title, { x: 2.3, y: y, w: 10.5, h: 0.6, fontSize: 22, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s16.addText(ask.desc, { x: 2.3, y: y + 0.6, w: 10.5, h: 0.5, fontSize: 14, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
  if (i < 2) s16.addShape("rect", { x: 2.3, y: y + 1.3, w: 10.5, h: 0.02, fill: { color: LIGHT_GRAY } });
});
addFooter(s16, 16, TOTAL);

// =========================
// Slide 17: お返し7点（短期4 × 長期3）
// =========================
let s17 = pres.addSlide();
s17.background = { color: WHITE };
addSectionHeader(s17, "GIVE BACK", "先生にも、7つのお返しを。", GREEN);

// 上段 4つ（短期的メリット）
const shortTerm = [
  { icon: "📊", title: "月次レポート", desc: "市内削減量を毎月。\n議会質問・SNSで活用可。" },
  { icon: "🎫", title: "後援会先行案内枠", desc: "議員ご紹介枠を確保。\n後援会へ特別案内が可能。" },
  { icon: "📰", title: "メディアクレジット", desc: "取材・PR時に「藤木先生の\nお力添え」を必ず明示。" },
  { icon: "🎤", title: "イベント協力", desc: "SDGs・地域イベントで\nアプリのデモ・登壇に協力。" }
];

// 下段 3つ（長期パートナーシップ）
const longTerm = [
  { icon: "🤝", title: "四半期事業報告会", desc: "先生専用の事業報告枠を設置。\n継続的パートナーシップに。" },
  { icon: "📖", title: "事業ストーリーに議員名", desc: "メディア・ピッチ資料で\n「先生のご支援」を継続発信。" },
  { icon: "🎖️", title: "公式アンバサダー就任", desc: "食品ロス削減アンバサダーとして\n擁立。名誉肩書きで選挙PRにも。" }
];

// 上段ラベル
s17.addText("● 短期：直接的な議員メリット", {
  x: 0.6, y: 1.9, w: 6, h: 0.3,
  fontSize: 11, fontFace: FONT_HEAD, color: CORAL, bold: true
});

// 上段 4つ
shortTerm.forEach((g, i) => {
  const x = 0.6 + i * 3.1;
  const y = 2.25;
  s17.addShape("roundRect", { x: x, y: y, w: 2.95, h: 2.1, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 0 }, rectRadius: 0.12 });
  s17.addText(g.icon, { x: x, y: y + 0.15, w: 2.95, h: 0.7, fontSize: 32, align: "center", valign: "middle" });
  s17.addText(g.title, { x: x + 0.1, y: y + 0.85, w: 2.75, h: 0.45, fontSize: 13, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
  s17.addText(g.desc, { x: x + 0.15, y: y + 1.3, w: 2.65, h: 0.75, fontSize: 9, fontFace: FONT_BODY, color: GRAY, align: "center" });
});

// 下段ラベル
s17.addText("● 長期：パートナーシップ", {
  x: 0.6, y: 4.6, w: 6, h: 0.3,
  fontSize: 11, fontFace: FONT_HEAD, color: GREEN, bold: true
});

// 下段 3つ（中央寄せ）
// 総幅 = 3 * 2.95 + 2 * 0.2 = 8.85 + 0.4 = 9.25, x_start = (13.33 - 9.25)/2 ≈ 2.04
longTerm.forEach((g, i) => {
  const x = 2.04 + i * 3.15;
  const y = 4.95;
  s17.addShape("roundRect", { x: x, y: y, w: 2.95, h: 2.1, fill: { color: WHITE }, line: { color: GREEN, width: 2 }, rectRadius: 0.12 });
  s17.addText(g.icon, { x: x, y: y + 0.15, w: 2.95, h: 0.7, fontSize: 32, align: "center", valign: "middle" });
  s17.addText(g.title, { x: x + 0.1, y: y + 0.85, w: 2.75, h: 0.45, fontSize: 13, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
  s17.addText(g.desc, { x: x + 0.15, y: y + 1.3, w: 2.65, h: 0.75, fontSize: 9, fontFace: FONT_BODY, color: GRAY, align: "center" });
});

addFooter(s17, 17, TOTAL);

// =========================
// Slide 18: クロージング
// =========================
let s18 = pres.addSlide();
s18.background = { color: CORAL };
s18.addText("7月1日のローンチ後、", {
  x: 0.6, y: 1.3, w: 12, h: 0.9,
  fontSize: 36, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s18.addText("初月の実績をご報告に上がります。", {
  x: 0.6, y: 2.2, w: 12, h: 0.9,
  fontSize: 36, fontFace: FONT_HEAD, color: WHITE, bold: true
});
s18.addShape("rect", { x: 0.6, y: 3.5, w: 1.5, h: 0.05, fill: { color: WHITE } });
s18.addText("本日はお時間をいただき、ありがとうございました。", {
  x: 0.6, y: 3.8, w: 12, h: 0.5,
  fontSize: 18, fontFace: FONT_BODY, color: WHITE
});
s18.addShape("roundRect", { x: 0.6, y: 4.8, w: 12.1, h: 2.0, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.15 });
s18.addText("CONTACT", { x: 0.9, y: 4.95, w: 4, h: 0.3, fontSize: 11, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4 });

const contacts = [
  { label: "📧 Email", value: "hello.osusowake@gmail.com" },
  { label: "📷 Instagram", value: "@osusowake_official" },
  { label: "𝕏 X (Twitter)", value: "@Osusowake_offi" },
  { label: "📱 梅本幸汰", value: "080-1486-0699" }
];
contacts.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.9 + col * 6.0;
  const y = 5.3 + row * 0.6;
  s18.addText(c.label, { x: x, y: y, w: 1.8, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
  s18.addText(c.value, { x: x + 1.8, y: y, w: 4.0, h: 0.4, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true });
});

pres.writeFile({ fileName: "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\osusowake_fujiki_meeting_2026-05-18.pptx" })
  .then(fileName => console.log(`Created: ${fileName}`))
  .catch(err => console.error("Error:", err));
