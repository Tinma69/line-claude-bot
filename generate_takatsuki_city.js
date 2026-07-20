// おすそわけ 高槻市 行政連携提案版（市長・市議・資源循環推進課向け）
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "おすそわけ 高槻市連携提案";
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
const NAVY_LIGHT = "E8ECF7";

const FONT_HEAD = "Yu Gothic UI";
const FONT_BODY = "Yu Gothic UI";

const TOTAL = 16;

function addFooter(slide, pageNum) {
  slide.addText("おすそわけ｜高槻発 食品ロス削減アプリ", {
    x: 0.4, y: 7.1, w: 6, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: GRAY, italic: true
  });
  slide.addText(`${pageNum} / ${TOTAL}`, {
    x: 12.5, y: 7.1, w: 0.5, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: GRAY, align: "right"
  });
}

function addSectionHeader(slide, eyebrow, title, color = CORAL) {
  slide.addText(eyebrow, {
    x: 0.6, y: 0.6, w: 8, h: 0.4,
    fontSize: 14, fontFace: FONT_BODY, color: color, bold: true, charSpacing: 4
  });
  slide.addText(title, {
    x: 0.6, y: 1.1, w: 12.1, h: 0.7,
    fontSize: 30, fontFace: FONT_HEAD, color: DARK, bold: true
  });
}

// Slide 1: 表紙
let s1 = pres.addSlide();
s1.background = { color: NAVY };
s1.addShape("rect", { x: 0, y: 0, w: 0.5, h: 7.5, fill: { color: CORAL } });
s1.addText("おすそわけ", { x: 1, y: 1.6, w: 11.3, h: 1.5, fontSize: 88, fontFace: FONT_HEAD, color: WHITE, bold: true });
s1.addText("食品ロスを、おすそわけに。", { x: 1, y: 3.1, w: 11.3, h: 0.7, fontSize: 28, fontFace: FONT_BODY, color: "CADCFC" });
s1.addShape("rect", { x: 1, y: 4.2, w: 10.5, h: 0.9, fill: { color: WHITE } });
s1.addText("高槻市との食品ロス削減連携に関するご提案", { x: 1, y: 4.2, w: 10.5, h: 0.9, fontSize: 24, fontFace: FONT_HEAD, color: NAVY, bold: true, align: "center", valign: "middle" });
s1.addText("高槻発スタートアップ", { x: 1, y: 5.5, w: 11, h: 0.5, fontSize: 18, fontFace: FONT_BODY, color: WHITE });
s1.addText("2026年5月", { x: 1, y: 6.1, w: 11, h: 0.4, fontSize: 14, fontFace: FONT_BODY, color: "CADCFC" });

// Slide 2: ご挨拶
let s2 = pres.addSlide();
s2.background = { color: WHITE };
addSectionHeader(s2, "GREETING", "はじめに｜地元・高槻からのご挨拶", NAVY);
s2.addShape("roundRect", { x: 0.6, y: 2.3, w: 12.1, h: 4.2, fill: { color: NAVY_LIGHT }, line: { color: NAVY_LIGHT, width: 0 }, rectRadius: 0.15 });
s2.addText([
  { text: "私たちは、大阪府高槻市を拠点に活動する学生チームです。\n\n", options: { fontSize: 16, color: DARK } },
  { text: "食品ロス削減アプリ「おすそわけ」を開発・運営し、2026年7月1日に\n高槻市から正式リリースいたします。\n\n", options: { fontSize: 16, color: DARK } },
  { text: "高槻市が新たな一般廃棄物処理基本計画で掲げる\n", options: { fontSize: 16, color: DARK } },
  { text: "「先進的なアプリ・プラットフォームの活用」", options: { fontSize: 18, color: CORAL, bold: true } },
  { text: "に、\n地元発の私たちがお力添えできればと考え、本日お時間を頂戴しました。", options: { fontSize: 16, color: DARK } }
], { x: 1.1, y: 2.7, w: 11.1, h: 3.4, valign: "top", lineSpacingMultiple: 1.1 });
addFooter(s2, 2);

// Slide 3: タイミング（市の計画への言及）
let s3 = pres.addSlide();
s3.background = { color: NAVY };
s3.addText("THE TIMING", { x: 0.6, y: 0.6, w: 6, h: 0.4, fontSize: 14, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4 });
s3.addText("高槻市の新計画と、私たちの取り組みが重なりました。", { x: 0.6, y: 1.2, w: 12.1, h: 0.7, fontSize: 26, fontFace: FONT_HEAD, color: WHITE, bold: true });
s3.addShape("roundRect", { x: 0.6, y: 2.4, w: 12.1, h: 1.5, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.12 });
s3.addText("高槻市 一般廃棄物処理基本計画（策定中・2025年12月パブリックコメント予定）", { x: 0.9, y: 2.55, w: 11.5, h: 0.4, fontSize: 13, fontFace: FONT_BODY, color: GRAY, bold: true });
s3.addText("「事業系食品ロス対策として、先進的なアプリ・プラットフォームの活用を検討」", { x: 0.9, y: 3.0, w: 11.5, h: 0.8, fontSize: 19, fontFace: FONT_HEAD, color: NAVY, bold: true, valign: "middle" });
s3.addText("↓", { x: 0.6, y: 4.0, w: 12.1, h: 0.6, fontSize: 32, color: CORAL, bold: true, align: "center" });
s3.addShape("roundRect", { x: 0.6, y: 4.7, w: 12.1, h: 1.7, fill: { color: CORAL }, line: { color: CORAL, width: 0 }, rectRadius: 0.12 });
s3.addText("そのアプリが、地元高槻で、もう動いています。", { x: 0.9, y: 4.9, w: 11.5, h: 0.8, fontSize: 22, fontFace: FONT_HEAD, color: WHITE, bold: true, valign: "middle" });
s3.addText("市の「検討」を「実行」に変える、具体的な選択肢としてご提案いたします。", { x: 0.9, y: 5.7, w: 11.5, h: 0.5, fontSize: 14, fontFace: FONT_BODY, color: "FFF1EE", valign: "middle" });
s3.addText(`3 / ${TOTAL}`, { x: 12.5, y: 7.1, w: 0.5, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: "AAAAAA", align: "right" });

// Slide 4: おすそわけとは
let s4 = pres.addSlide();
s4.background = { color: WHITE };
addSectionHeader(s4, "WHAT IS IT", "おすそわけは、こんなサービスです。");
s4.addShape("roundRect", { x: 0.6, y: 2.4, w: 12.1, h: 2.6, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.2 });
s4.addText("お店の売れ残りを、", { x: 0.6, y: 2.7, w: 12.1, h: 0.9, fontSize: 38, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
s4.addText("お客様がお得に購入できるアプリ。", { x: 0.6, y: 3.6, w: 12.1, h: 0.9, fontSize: 38, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center" });
const w4 = [
  { emoji: "🏪", label: "お店", desc: "廃棄ロスを削減" },
  { emoji: "👤", label: "市民", desc: "お得に購入" },
  { emoji: "🌍", label: "地域", desc: "CO2削減・SDGs" }
];
w4.forEach((item, i) => {
  const x = 0.6 + i * 4.2;
  s4.addShape("roundRect", { x: x, y: 5.3, w: 3.9, h: 1.3, fill: { color: WHITE }, line: { color: CORAL, width: 1.5 }, rectRadius: 0.1 });
  s4.addText(item.emoji, { x: x + 0.2, y: 5.45, w: 1.0, h: 1.0, fontSize: 36, align: "center", valign: "middle" });
  s4.addText(item.label, { x: x + 1.3, y: 5.5, w: 2.4, h: 0.5, fontSize: 18, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s4.addText(item.desc, { x: x + 1.3, y: 5.95, w: 2.4, h: 0.5, fontSize: 13, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
});
addFooter(s4, 4);

// Slide 5: 高槻市の課題
let s5 = pres.addSlide();
s5.background = { color: WHITE };
addSectionHeader(s5, "THE CHALLENGE", "高槻市の食品ロス、3つの現状。", NAVY);
const challenges = [
  { num: "81.1%", label: "市民の認知度は高い", desc: "しかし「実際の取組」に\nつながっていないのが課題", color: NAVY },
  { num: "横ばい", label: "家庭系食品ロス", desc: "事業系は減少傾向だが\n家庭系は減っていない", color: CORAL },
  { num: "90%", label: "2030年度の目標", desc: "削減の取組を2項目以上行う\n市民を9割に引き上げる", color: GREEN }
];
challenges.forEach((c, i) => {
  const x = 0.6 + i * 4.2;
  s5.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.0, fill: { color: WHITE }, line: { color: c.color, width: 2 }, rectRadius: 0.15 });
  s5.addText(c.num, { x: x, y: 2.7, w: 3.9, h: 1.4, fontSize: 52, fontFace: FONT_HEAD, color: c.color, bold: true, align: "center", valign: "middle" });
  s5.addText(c.label, { x: x + 0.2, y: 4.2, w: 3.5, h: 0.6, fontSize: 17, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
  s5.addText(c.desc, { x: x + 0.2, y: 4.9, w: 3.5, h: 1.3, fontSize: 13, fontFace: FONT_BODY, color: GRAY, align: "center" });
});
s5.addText("出典：高槻市廃棄物減量等推進審議会（令和7年度）資料より", { x: 0.6, y: 6.6, w: 12, h: 0.3, fontSize: 10, fontFace: FONT_BODY, color: GRAY, italic: true });
addFooter(s5, 5);

// Slide 6: 計画とおすそわけの一致
let s6 = pres.addSlide();
s6.background = { color: WHITE };
addSectionHeader(s6, "PERFECT FIT", "高槻市の課題に、おすそわけが応えます。", GREEN);
const fits = [
  { problem: "「アプリ・プラットフォーム活用を検討」", solution: "そのアプリが、地元発でもう存在します" },
  { problem: "認知度81%だが「実際の取組」が課題", solution: "アプリは市民の「行動」を直接促します" },
  { problem: "家庭系食品ロスが横ばい", solution: "市民がアプリで買う＝家庭の食を救済に転換" },
  { problem: "事業系の具体施策を強化したい", solution: "店舗の廃棄を直接削減・売上にも貢献" }
];
fits.forEach((f, i) => {
  const y = 2.3 + i * 1.1;
  s6.addShape("roundRect", { x: 0.6, y: y, w: 5.7, h: 0.95, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.08 });
  s6.addText("高槻市の課題", { x: 0.8, y: y + 0.08, w: 5.3, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: GRAY, bold: true });
  s6.addText(f.problem, { x: 0.8, y: y + 0.35, w: 5.3, h: 0.55, fontSize: 12.5, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s6.addText("→", { x: 6.3, y: y, w: 0.7, h: 0.95, fontSize: 24, color: GREEN, bold: true, align: "center", valign: "middle" });
  s6.addShape("roundRect", { x: 7.0, y: y, w: 5.7, h: 0.95, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 0 }, rectRadius: 0.08 });
  s6.addText("おすそわけの解", { x: 7.2, y: y + 0.08, w: 5.3, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: GREEN, bold: true });
  s6.addText(f.solution, { x: 7.2, y: y + 0.35, w: 5.3, h: 0.55, fontSize: 12.5, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
});
addFooter(s6, 6);

// Slide 7: 3ステップ
let s7 = pres.addSlide();
s7.background = { color: WHITE };
addSectionHeader(s7, "HOW IT WORKS", "使い方は、3ステップ。");
const steps = [
  { num: "01", emoji: "🔍", title: "お店を探す", desc: "近くの加盟店の\n余り物をチェック" },
  { num: "02", emoji: "🛒", title: "購入する", desc: "特別価格でアプリから\n簡単に購入" },
  { num: "03", emoji: "🥖", title: "受け取る", desc: "指定時間にお店へ\nピックアップ" }
];
steps.forEach((step, i) => {
  const x = 0.6 + i * 4.2;
  s7.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.2, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
  s7.addText(step.num, { x: x + 0.2, y: 2.5, w: 2, h: 0.6, fontSize: 36, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s7.addText(step.emoji, { x: x, y: 3.3, w: 3.9, h: 1.2, fontSize: 64, align: "center", valign: "middle" });
  s7.addText(step.title, { x: x, y: 4.7, w: 3.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
  s7.addText(step.desc, { x: x + 0.2, y: 5.4, w: 3.5, h: 1.1, fontSize: 14, fontFace: FONT_BODY, color: GRAY, align: "center" });
});
addFooter(s7, 7);

// Slide 8: ビジネスモデル
let s8 = pres.addSlide();
s8.background = { color: WHITE };
addSectionHeader(s8, "BUSINESS MODEL", "店舗様のリスクは、ゼロ。");
const fees = [
  { num: "¥0", label: "初期費用", color: GREEN },
  { num: "¥0", label: "月額固定費", color: GREEN },
  { num: "25%", label: "売れた分だけ手数料", color: CORAL }
];
fees.forEach((fee, i) => {
  const x = 0.6 + i * 4.2;
  s8.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 3.4, fill: { color: WHITE }, line: { color: fee.color, width: 3 }, rectRadius: 0.15 });
  s8.addText(fee.num, { x: x, y: 2.7, w: 3.9, h: 1.8, fontSize: 96, fontFace: FONT_HEAD, color: fee.color, bold: true, align: "center", valign: "middle" });
  s8.addText(fee.label, { x: x, y: 4.8, w: 3.9, h: 0.7, fontSize: 20, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
});
s8.addShape("roundRect", { x: 0.6, y: 6.1, w: 12.1, h: 0.7, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.1 });
s8.addText("✓ 売れ残っても費用は発生しません｜だから市内の小さなお店も安心して参加できます", { x: 0.6, y: 6.1, w: 12.1, h: 0.7, fontSize: 15, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
addFooter(s8, 8);

// Slide 9: 高槻実績
let s9 = pres.addSlide();
s9.background = { color: WHITE };
addSectionHeader(s9, "TRACTION", "高槻で、もう動いています。");
const traction = [
  { icon: "🤝", title: "提携契約", value: "9店 締結済み", sub: "ベーカリー・飲食・スイーツ" },
  { icon: "🏪", title: "高槻エリア把握", value: "50店超", sub: "営業中31店・契約交渉中" },
  { icon: "🚀", title: "正式リリース", value: "7月1日(水)", sub: "App Store審査通過済み" },
  { icon: "👥", title: "チーム", value: "8名体制", sub: "関大・立命・龍谷の合同" }
];
traction.forEach((t, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.6 + col * 6.2;
  const y = 2.4 + row * 2.2;
  s9.addShape("roundRect", { x: x, y: y, w: 6.0, h: 2.0, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
  s9.addText(t.icon, { x: x + 0.3, y: y + 0.3, w: 1.2, h: 1.4, fontSize: 48, align: "center", valign: "middle" });
  s9.addText(t.title, { x: x + 1.7, y: y + 0.2, w: 4.2, h: 0.5, fontSize: 14, fontFace: FONT_BODY, color: GRAY });
  s9.addText(t.value, { x: x + 1.7, y: y + 0.6, w: 4.2, h: 0.7, fontSize: 26, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s9.addText(t.sub, { x: x + 1.7, y: y + 1.4, w: 4.2, h: 0.5, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
});
addFooter(s9, 9);

// Slide 10: 競合（北摂空白）
let s10 = pres.addSlide();
s10.background = { color: WHITE };
addSectionHeader(s10, "OPPORTUNITY", "北摂は、まだ「空白地帯」です。", NAVY);
s10.addShape("roundRect", { x: 0.6, y: 2.3, w: 5.9, h: 3.0, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.12 });
s10.addText("大手アプリ（TABETE等）の自治体連携", { x: 0.8, y: 2.5, w: 5.5, h: 0.4, fontSize: 13, fontFace: FONT_HEAD, color: DARK, bold: true });
s10.addText([
  { text: "大阪市（2020年）\n", options: { fontSize: 14, color: DARK } },
  { text: "堺市・岸和田市（連携済み）\n", options: { fontSize: 14, color: DARK } },
  { text: "京都市（2025年）・尼崎市\n\n", options: { fontSize: 14, color: DARK } },
  { text: "→ 高槻・吹田・茨木・摂津の\n　 北摂エリアは未連携", options: { fontSize: 14, color: CORAL, bold: true } }
], { x: 0.8, y: 3.0, w: 5.5, h: 2.1, valign: "top", lineSpacingMultiple: 1.15 });
s10.addShape("roundRect", { x: 6.8, y: 2.3, w: 5.9, h: 3.0, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 2 }, rectRadius: 0.12 });
s10.addText("高槻市が先行する意義", { x: 7.0, y: 2.5, w: 5.5, h: 0.4, fontSize: 13, fontFace: FONT_HEAD, color: GREEN, bold: true });
s10.addText([
  { text: "✓ 北摂初の食品ロスアプリ連携自治体に\n\n", options: { fontSize: 14, color: DARK } },
  { text: "✓ 地元発スタートアップとの連携という\n　 全国でも珍しいPRストーリー\n\n", options: { fontSize: 14, color: DARK } },
  { text: "✓ 関西大学×高槻市の地域連携モデル", options: { fontSize: 14, color: DARK } }
], { x: 7.0, y: 3.0, w: 5.5, h: 2.1, valign: "top", lineSpacingMultiple: 1.15 });
s10.addText("先進的な事例として、高槻市が北摂をリードする絶好のタイミングです。", { x: 0.6, y: 5.6, w: 12.1, h: 0.5, fontSize: 16, fontFace: FONT_HEAD, color: NAVY, bold: true, italic: true, align: "center" });
addFooter(s10, 10);

// Slide 11: 連携でできること
let s11 = pres.addSlide();
s11.background = { color: WHITE };
addSectionHeader(s11, "PARTNERSHIP", "高槻市との連携で、できること。", GREEN);
const partner = [
  { icon: "📊", title: "食品ロス削減レポート", desc: "市内の削減量を定期的にレポート。\n計画の進捗・効果の可視化に。" },
  { icon: "🏪", title: "市内事業者の支援", desc: "廃棄に困る地元店舗の\n販売チャネル・サポート窓口に。" },
  { icon: "🎓", title: "関西大学との地域連携", desc: "千里山キャンパスを起点に\n学生×行政の協働モデルを構築。" },
  { icon: "🌱", title: "計画目標への貢献", desc: "「2項目以上の取組90%」\n達成に向けた具体的施策に。" }
];
partner.forEach((p, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.6 + col * 6.2;
  const y = 2.4 + row * 2.2;
  s11.addShape("roundRect", { x: x, y: y, w: 6.0, h: 2.0, fill: { color: GREEN_LIGHT }, line: { color: GREEN_LIGHT, width: 0 }, rectRadius: 0.1 });
  s11.addText(p.icon, { x: x + 0.3, y: y + 0.3, w: 1.2, h: 1.4, fontSize: 42, align: "center", valign: "middle" });
  s11.addText(p.title, { x: x + 1.7, y: y + 0.25, w: 4.2, h: 0.5, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true });
  s11.addText(p.desc, { x: x + 1.7, y: y + 0.75, w: 4.2, h: 1.2, fontSize: 12, fontFace: FONT_BODY, color: DARK });
});
addFooter(s11, 11);

// Slide 12: 他自治体事例
let s12 = pres.addSlide();
s12.background = { color: WHITE };
addSectionHeader(s12, "REFERENCE", "他自治体でも、官民連携が進んでいます。", NAVY);
s12.addShape("roundRect", { x: 0.6, y: 2.3, w: 12.1, h: 1.6, fill: { color: NAVY_LIGHT }, line: { color: NAVY_LIGHT, width: 0 }, rectRadius: 0.12 });
s12.addText("食品ロス削減アプリ × 自治体の連携協定 事例", { x: 0.9, y: 2.45, w: 11.5, h: 0.4, fontSize: 13, fontFace: FONT_HEAD, color: NAVY, bold: true });
s12.addText("大阪市（2020年）／京都市（2025年）／世田谷区（2026年）／宇都宮市・一宮市・佐久市 など多数", { x: 0.9, y: 2.95, w: 11.5, h: 0.8, fontSize: 15, fontFace: FONT_BODY, color: DARK, valign: "middle" });
s12.addText("連携協定で一般的に行われること", { x: 0.6, y: 4.2, w: 12, h: 0.4, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true });
const refItems = [
  "市の広報媒体（HP・SNS・広報誌）でのサービス周知",
  "市内事業者・市民向けの食品ロス削減セミナー共催",
  "市の食品ロス削減施策との連動・データ連携",
  "市民への利用促進（モニター・キャンペーン等）"
];
refItems.forEach((item, i) => {
  const y = 4.7 + i * 0.55;
  s12.addText("✓", { x: 0.8, y: y, w: 0.4, h: 0.45, fontSize: 16, color: GREEN, bold: true, valign: "middle" });
  s12.addText(item, { x: 1.3, y: y, w: 11, h: 0.45, fontSize: 14, fontFace: FONT_BODY, color: DARK, valign: "middle" });
});
addFooter(s12, 12);

// Slide 13: ミッション
let s13 = pres.addSlide();
s13.background = { color: NAVY };
s13.addText("MISSION", { x: 0.6, y: 0.6, w: 4, h: 0.4, fontSize: 14, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 4 });
s13.addText("食品ロスを、", { x: 0.6, y: 2.3, w: 12, h: 1.3, fontSize: 76, fontFace: FONT_HEAD, color: WHITE, bold: true });
s13.addText("おすそわけに。", { x: 0.6, y: 3.6, w: 12, h: 1.3, fontSize: 76, fontFace: FONT_HEAD, color: CORAL, bold: true });
s13.addText("地元・高槻から、誰もが食品ロス削減に参加できる社会へ。", { x: 0.6, y: 5.4, w: 12, h: 0.6, fontSize: 20, fontFace: FONT_BODY, color: "CADCFC" });
s13.addText(`13 / ${TOTAL}`, { x: 12.5, y: 7.1, w: 0.5, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: "AAAAAA", align: "right" });

// Slide 14: ご相談
let s14 = pres.addSlide();
s14.background = { color: WHITE };
addSectionHeader(s14, "REQUEST", "高槻市へ、3つのご相談。", CORAL);
const asks = [
  { num: "01", title: "市の食品ロス削減施策との連携可能性", desc: "策定中の基本計画における具体的施策として、ご検討いただけませんか。" },
  { num: "02", title: "市の広報媒体での周知のご協力", desc: "市HP・SNS・広報誌等で市民の皆様にサービスをお知らせいただけませんか。" },
  { num: "03", title: "資源循環推進課様との実務的なご相談", desc: "今後の進め方について、ご担当部署と具体的にお話しさせていただけませんか。" }
];
asks.forEach((ask, i) => {
  const y = 2.4 + i * 1.5;
  s14.addShape("ellipse", { x: 0.8, y: y, w: 1.2, h: 1.2, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
  s14.addText(ask.num, { x: 0.8, y: y, w: 1.2, h: 1.2, fontSize: 28, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s14.addText(ask.title, { x: 2.3, y: y, w: 10.5, h: 0.6, fontSize: 19, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s14.addText(ask.desc, { x: 2.3, y: y + 0.6, w: 10.5, h: 0.6, fontSize: 13, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
  if (i < 2) s14.addShape("rect", { x: 2.3, y: y + 1.3, w: 10.5, h: 0.02, fill: { color: LIGHT_GRAY } });
});
addFooter(s14, 14);

// Slide 15: クロージング
let s15 = pres.addSlide();
s15.background = { color: CORAL };
s15.addText("地元・高槻から、", { x: 0.6, y: 1.6, w: 12, h: 0.9, fontSize: 38, fontFace: FONT_HEAD, color: WHITE, bold: true });
s15.addText("食品ロスのない街をつくりたい。", { x: 0.6, y: 2.5, w: 12, h: 0.9, fontSize: 38, fontFace: FONT_HEAD, color: WHITE, bold: true });
s15.addShape("rect", { x: 0.6, y: 3.8, w: 1.5, h: 0.05, fill: { color: WHITE } });
s15.addText("本日はお時間をいただき、誠にありがとうございました。", { x: 0.6, y: 4.1, w: 12, h: 0.5, fontSize: 18, fontFace: FONT_BODY, color: WHITE });
s15.addText("ぜひ、高槻市の皆様と一緒に取り組ませてください。", { x: 0.6, y: 4.6, w: 12, h: 0.5, fontSize: 18, fontFace: FONT_BODY, color: WHITE });
addFooter(s15, 15);

// Slide 16: 連絡先
let s16 = pres.addSlide();
s16.background = { color: WHITE };
addSectionHeader(s16, "CONTACT", "お問い合わせ先", NAVY);
s16.addShape("roundRect", { x: 0.6, y: 2.4, w: 12.1, h: 3.4, fill: { color: NAVY_LIGHT }, line: { color: NAVY_LIGHT, width: 0 }, rectRadius: 0.15 });
s16.addText("おすそわけプロジェクト", { x: 1.0, y: 2.8, w: 11, h: 0.7, fontSize: 26, fontFace: FONT_HEAD, color: NAVY, bold: true });
s16.addText("関西大学・立命館大学・龍谷大学の有志による合同チーム", { x: 1.0, y: 3.5, w: 11, h: 0.4, fontSize: 13, fontFace: FONT_BODY, color: GRAY });
const contacts = [
  { label: "担当", value: "副代表 梅本 幸汰" },
  { label: "📧 Email", value: "hello.osusowake@gmail.com" },
  { label: "📱 電話", value: "080-1486-0699" },
  { label: "🌐 Web版", value: "osusowakejapan.org" },
  { label: "📷 Instagram", value: "@osusowake_official" },
  { label: "𝕏 X", value: "@Osusowake_offi" }
];
contacts.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 1.0 + col * 6.0;
  const y = 4.2 + row * 0.5;
  s16.addText(c.label, { x: x, y: y, w: 1.8, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
  s16.addText(c.value, { x: x + 1.8, y: y, w: 4.2, h: 0.4, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true });
});
addFooter(s16, 16);

pres.writeFile({ fileName: "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\osusowake_takatsuki_city.pptx" })
  .then(fileName => console.log(`Created: ${fileName}`))
  .catch(err => console.error("Error:", err));
