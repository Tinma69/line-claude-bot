// 久保先生（高槻市議）面談用プレゼン資料（信用構築型・ゆうひ資料の強み統合版・17枚）
// 数字は memory/foodloss_official_stats_2026-05-30.md に基づく最新値（誤情報防止）
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "おすそわけ 久保先生 面談資料";
pres.author = "梅本幸汰";

const CORAL = "E8786C", CORAL_LIGHT = "FFF1EE";
const GREEN = "3FA535", GREEN_LIGHT = "E8F5E5";
const DARK = "2B2B2B", GRAY = "666666", LIGHT_GRAY = "F5F5F5", WHITE = "FFFFFF";
const NAVY = "1E2761", NAVY_LIGHT = "EAECF5";
const FONT_HEAD = "Yu Gothic UI", FONT_BODY = "Yu Gothic UI";
const LOGO = "C:\\Users\\kusao\\OneDrive\\画像\\logo-01.png";

const TOTAL = 13;
let _p = 0;
function footer(slide) {
  _p++;
  slide.addText(`${_p}`, { x: 12.5, y: 7.1, w: 0.5, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: GRAY, align: "right" });
}
function footerDark(slide) {
  _p++;
  slide.addText(`${_p}`, { x: 12.5, y: 7.1, w: 0.5, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: "AAAAAA", align: "right" });
}
function header(slide, eyebrow, title, color = CORAL) {
  // 英語ラベル(eyebrow)は非表示。アクセントの短い下線のみ残す
  slide.addShape("rect", { x: 0.6, y: 0.95, w: 0.7, h: 0.07, fill: { color: color }, line: { color: color, width: 0 } });
  slide.addText(title, { x: 0.6, y: 1.15, w: 12.1, h: 0.7, fontSize: 30, fontFace: FONT_HEAD, color: DARK, bold: true });
}

// ===== 表紙 =====
let s = pres.addSlide();
s.background = { color: CORAL };
s.addShape("rect", { x: 0, y: 0, w: 0.5, h: 7.5, fill: { color: GREEN } });
s.addShape("ellipse", { x: 10.85, y: 0.7, w: 1.7, h: 1.7, fill: { color: WHITE }, line: { color: WHITE, width: 0 } });
s.addImage({ path: LOGO, x: 11.1, y: 0.95, w: 1.2, h: 1.2 });
s.addText("高槻発 食品ロス削減アプリ", { x: 1, y: 1.5, w: 11, h: 0.5, fontSize: 18, fontFace: FONT_BODY, color: WHITE });
s.addText("おすそわけ", { x: 1, y: 2.1, w: 9.5, h: 1.5, fontSize: 92, fontFace: FONT_HEAD, color: WHITE, bold: true });
s.addText("Osusowake", { x: 1, y: 3.5, w: 9.5, h: 0.6, fontSize: 26, fontFace: FONT_BODY, color: WHITE, italic: true });
s.addShape("rect", { x: 1, y: 4.6, w: 9.2, h: 0.7, fill: { color: WHITE } });
s.addText("食品ロス削減と、高槻の地域活性化を。", { x: 1, y: 4.6, w: 9.2, h: 0.7, fontSize: 24, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center", valign: "middle" });

// ===== PROBLEM#1 日本 =====
s = pres.addSlide();
s.background = { color: DARK };
s.addShape("rect", { x: 0.6, y: 1.0, w: 0.7, h: 0.07, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
s.addText("日本の食品ロス、年間", { x: 0.6, y: 1.6, w: 12, h: 0.7, fontSize: 28, fontFace: FONT_BODY, color: WHITE });
s.addText("464", { x: 0.6, y: 2.3, w: 8, h: 3.2, fontSize: 280, fontFace: FONT_HEAD, color: CORAL, bold: true });
s.addText("万トン", { x: 7.6, y: 3.5, w: 5, h: 1.5, fontSize: 56, fontFace: FONT_HEAD, color: WHITE, bold: true });
s.addShape("rect", { x: 0.6, y: 5.8, w: 12, h: 0.06, fill: { color: CORAL } });
s.addText("国民1人あたり、お茶碗1杯分（約102g）の食品を毎日捨てている計算", { x: 0.6, y: 6.0, w: 12, h: 0.6, fontSize: 21, fontFace: FONT_BODY, color: WHITE });
s.addText("出典：環境省・農林水産省（令和5年度推計）", { x: 0.6, y: 6.7, w: 12, h: 0.4, fontSize: 11, fontFace: FONT_BODY, color: "AAAAAA", italic: true });
footerDark(s);

// ===== 6. PROBLEM#2 高槻市 =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "PROBLEM #2", "高槻市の場合");
// 左：一人あたりの家庭系食品ロス
s.addShape("roundRect", { x: 0.6, y: 2.2, w: 5.9, h: 4.3, fill: { color: DARK }, line: { color: DARK, width: 0 }, rectRadius: 0.15 });
s.addText("高槻市民 一人あたりの\n家庭系食品ロス", { x: 0.8, y: 2.6, w: 5.5, h: 0.8, fontSize: 15, fontFace: FONT_HEAD, color: "FFB3AA", bold: true, align: "center" });
s.addText([
  { text: "約 21", options: { fontSize: 88, color: WHITE, bold: true } },
  { text: "  kg/年", options: { fontSize: 24, color: WHITE, bold: false } },
], { x: 0.6, y: 3.7, w: 5.9, h: 1.3, fontFace: FONT_HEAD, align: "center", valign: "middle" });
// 右：認知度81.1%（市の調査・確定数字）
s.addShape("roundRect", { x: 6.8, y: 2.2, w: 5.9, h: 4.3, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
s.addText("食品ロスを「問題」と\n認知している市民", { x: 7.0, y: 2.6, w: 5.5, h: 0.8, fontSize: 15, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center" });
s.addText([
  { text: "81.1", options: { fontSize: 88, color: DARK, bold: true } },
  { text: " %", options: { fontSize: 32, color: GRAY, bold: false } },
], { x: 6.8, y: 3.7, w: 5.9, h: 1.3, fontFace: FONT_HEAD, align: "center", valign: "middle" });
s.addText("出典：高槻市 令和7年度 第2回 廃棄物減量等推進審議会（一般廃棄物処理基本計画 素案／消費生活意識調査）", { x: 0.6, y: 6.75, w: 12.1, h: 0.45, fontSize: 12, fontFace: FONT_HEAD, color: NAVY, bold: true, align: "center" });
footer(s);

// ===== 7. PERFECT FIT 市の計画と一致 =====
s = pres.addSlide();
s.background = { color: WHITE };
// ロゴ（枠なし・大きめ・中央上）
s.addImage({ path: LOGO, x: 5.67, y: 1.3, w: 2.0, h: 2.0 });
// おすそわけで解決するというメッセージ（画面中央に大きく）
s.addText([
  { text: "私たちはこの課題を\n", options: { fontSize: 30, color: DARK, bold: true } },
  { text: "「おすそわけ」", options: { fontSize: 30, color: CORAL, bold: true } },
  { text: "\nアプリを使って解決します。", options: { fontSize: 30, color: DARK, bold: true } },
], { x: 0.6, y: 3.6, w: 12.1, h: 2.2, fontFace: FONT_HEAD, align: "center", valign: "middle", lineSpacingMultiple: 1.2 });
footer(s);

// ===== 8. ソリューション3ステップ =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "SOLUTION", "実際の流れ");
[
  { num: "01", emoji: "🏪", title: "お店が出品する", desc: "売れ残りそうな商品を\nアプリで出品" },
  { num: "02", emoji: "🛒", title: "お客様が購入する", desc: "特別価格でアプリから\n簡単に購入" },
  { num: "03", emoji: "🥖", title: "受け取る", desc: "指定時間にお店へ\nピックアップ" },
].forEach((step, i) => {
  const x = 0.6 + i * 4.2;
  s.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.2, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
  s.addText(step.num, { x: x + 0.2, y: 2.5, w: 2, h: 0.6, fontSize: 36, fontFace: FONT_HEAD, color: CORAL, bold: true });
  s.addText(step.emoji, { x: x, y: 3.3, w: 3.9, h: 1.2, fontSize: 64, align: "center", valign: "middle" });
  s.addText(step.title, { x: x, y: 4.7, w: 3.9, h: 0.6, fontSize: 24, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
  s.addText(step.desc, { x: x + 0.2, y: 5.4, w: 3.5, h: 1.1, fontSize: 14, fontFace: FONT_BODY, color: GRAY, align: "center" });
});
footer(s);

// ===== 料金（実際の流れの直後に） =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "BUSINESS MODEL", "料金");
// 左：お店側
s.addShape("roundRect", { x: 0.6, y: 2.0, w: 5.9, h: 4.5, fill: { color: WHITE }, line: { color: GREEN, width: 2 }, rectRadius: 0.15 });
s.addShape("rect", { x: 0.6, y: 2.0, w: 5.9, h: 0.7, fill: { color: GREEN }, line: { color: GREEN, width: 0 } });
s.addText("お店", { x: 0.6, y: 2.0, w: 5.9, h: 0.7, fontSize: 20, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
[
  { num: "¥0", label: "初期費用", color: GREEN },
  { num: "¥0", label: "月額固定費", color: GREEN },
  { num: "25%", label: "売れた分の手数料", color: CORAL },
].forEach((fee, i) => {
  const y = 2.95 + i * 1.15;
  s.addText(fee.num, { x: 0.9, y: y, w: 2.2, h: 1.0, fontSize: 48, fontFace: FONT_HEAD, color: fee.color, bold: true, align: "center", valign: "middle" });
  s.addText(fee.label, { x: 3.1, y: y, w: 3.2, h: 1.0, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
});
// 右：ユーザー側
s.addShape("roundRect", { x: 6.8, y: 2.0, w: 5.9, h: 4.5, fill: { color: WHITE }, line: { color: CORAL, width: 2 }, rectRadius: 0.15 });
s.addShape("rect", { x: 6.8, y: 2.0, w: 5.9, h: 0.7, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
s.addText("お客様", { x: 6.8, y: 2.0, w: 5.9, h: 0.7, fontSize: 20, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
[
  { num: "¥0", label: "アプリのダウンロード", color: GREEN },
  { num: "5%", label: "購入時の手数料", color: CORAL },
].forEach((u, i) => {
  const y = 3.1 + i * 1.5;
  s.addText(u.num, { x: 7.1, y: y, w: 2.6, h: 1.1, fontSize: 48, fontFace: FONT_HEAD, color: u.color, bold: true, align: "center", valign: "middle" });
  s.addText(u.label, { x: 9.7, y: y, w: 2.8, h: 1.1, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
});
// 下帯
s.addShape("roundRect", { x: 0.6, y: 6.7, w: 12.1, h: 0.55, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.1 });
s.addText("✓ Stripe決済（業界最高水準のセキュリティ）", { x: 0.6, y: 6.7, w: 12.1, h: 0.55, fontSize: 15, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
footer(s);

// ===== 三方良し（料金の後に） =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "WHY IT WORKS", "三方良しの構造");
[
  { who: "お店", emoji: "🏪", benefit: "廃棄ロス削減\n+ 新規顧客獲得\n+ ブランド向上", color: CORAL },
  { who: "お客様", emoji: "👤", benefit: "お得に購入\n+ 食品ロス削減に\n  参加できる", color: GREEN },
  { who: "経済・環境", emoji: "🌍", benefit: "CO2削減\n+ 地域経済活性化\n+ SDGs達成", color: NAVY },
].forEach((it, i) => {
  const x = 0.6 + i * 4.2;
  s.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.4, fill: { color: WHITE }, line: { color: it.color, width: 2 }, rectRadius: 0.15 });
  s.addShape("rect", { x: x, y: 2.4, w: 3.9, h: 0.7, fill: { color: it.color }, line: { color: it.color, width: 0 } });
  s.addText(it.who, { x: x, y: 2.4, w: 3.9, h: 0.7, fontSize: 22, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s.addText(it.emoji, { x: x, y: 3.3, w: 3.9, h: 1.5, fontSize: 80, align: "center", valign: "middle" });
  s.addText(it.benefit, { x: x + 0.2, y: 5.0, w: 3.5, h: 1.7, fontSize: 15, fontFace: FONT_BODY, color: DARK, align: "center", valign: "middle" });
});
footer(s);

// ===== 現在の状況（進捗＋チーム統合） =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "TRACTION", "現在の状況");
// 上：進捗4項目（横並びコンパクト）
[
  { icon: "🤝", title: "加盟店", sub: "すでに複数店\n登録済み。" },
  { icon: "🏪", title: "高槻エリア開拓中", sub: "市内店舗を一軒ずつ\n訪問・交渉中。" },
  { icon: "📧", title: "地元チェーン", sub: "高槻の企業へも\n連携を提案中。" },
  { icon: "📱", title: "SNS・発信", sub: "IG @osusowake_official\nX @Osusowake_offi で発信。" },
].forEach((t, i) => {
  const x = 0.6 + i * 3.075;
  s.addShape("roundRect", { x: x, y: 1.95, w: 2.9, h: 2.3, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
  s.addText(t.icon, { x: x, y: 2.1, w: 2.9, h: 0.8, fontSize: 34, align: "center", valign: "middle" });
  s.addText(t.title, { x: x + 0.15, y: 2.9, w: 2.6, h: 0.45, fontSize: 14, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center" });
  s.addText(t.sub, { x: x + 0.15, y: 3.35, w: 2.6, h: 0.8, fontSize: 10.5, fontFace: FONT_BODY, color: DARK, align: "center" });
});
// 下：チーム（人数だけ・シンプル）
s.addShape("roundRect", { x: 0.6, y: 4.6, w: 12.1, h: 2.0, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.12 });
s.addText("TEAM", { x: 0.6, y: 4.85, w: 12.1, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: CORAL, bold: true, charSpacing: 3, align: "center" });
s.addText([
  { text: "高槻出身の大学生 ", options: { fontSize: 30, color: DARK, bold: true } },
  { text: "8人", options: { fontSize: 44, color: CORAL, bold: true } },
  { text: " のチーム", options: { fontSize: 30, color: DARK, bold: true } },
], { x: 0.6, y: 5.25, w: 12.1, h: 0.9, fontFace: FONT_HEAD, align: "center", valign: "middle" });
footer(s);


// ===== 6月：出品開始までの準備 =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "ROADMAP", "今後の予定");
[
  { date: "6月", title: "加盟店・認知の強化", items: "・店舗への訪問・登録\n・地元チェーンへ提案\n・行政との連携協議\n・SNSで加盟店紹介\n・地域への告知\n・利用者の事前獲得", color: CORAL },
  { date: "7/1〜", title: "🚀 出品開始・運用改善", items: "・サービス開始\n・運用で出る不具合や\n　トラブルに対応・改善\n・利用者/店舗の声を反映\n・サービスを安定させる", color: GREEN },
  { date: "今後", title: "北摂に拡大・法人化", items: "・茨木・吹田・摂津へ\n・加盟店の拡大\n・他自治体との連携\n・法人化", color: NAVY },
].forEach((m, i) => {
  const x = 0.6 + i * 4.1;
  s.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.4, fill: { color: WHITE }, line: { color: m.color, width: 2 }, rectRadius: 0.1 });
  s.addShape("rect", { x: x, y: 2.4, w: 3.9, h: 0.7, fill: { color: m.color }, line: { color: m.color, width: 0 } });
  s.addText(m.date, { x: x, y: 2.4, w: 3.9, h: 0.7, fontSize: 18, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s.addText(m.title, { x: x, y: 3.3, w: 3.9, h: 0.7, fontSize: 15, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
  s.addText(m.items, { x: x + 0.3, y: 4.2, w: 3.3, h: 2.4, fontSize: 12, fontFace: FONT_BODY, color: DARK });
});
footer(s);

// ===== 高槻市への貢献 =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "CONTRIBUTION", "具体的な高槻市への貢献内容", GREEN);
[
  { icon: "📊", title: "市の食品ロス削減目標に直接貢献", desc: "市民一人あたりの食品ロス削減に直結。アプリ利用が「具体的な取り組み」として市民の行動を可視化・後押しします。" },
  { icon: "🏪", title: "高槻市の飲食店・家庭の両方に貢献", desc: "お店の廃棄ロスを直接減らし、市民がお得に買い支える。市内の事業者と家庭、両方の食品ロス削減に同時に効きます。" },
  { icon: "🤝", title: "市のSDGs・地域活性の先進事例として発信できます", desc: "地元発の学生スタートアップ×高槻市の連携を、市の広報・議会でご活用いただけます。" },
].forEach((c, i) => {
  const y = 2.2 + i * 1.5;
  s.addShape("roundRect", { x: 0.6, y: y, w: 12.1, h: 1.35, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 0 }, rectRadius: 0.12 });
  s.addText(c.icon, { x: 0.8, y: y + 0.15, w: 1.1, h: 1.05, fontSize: 36, align: "center", valign: "middle" });
  s.addText(c.title, { x: 2.0, y: y + 0.15, w: 10.5, h: 0.45, fontSize: 17, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s.addText(c.desc, { x: 2.0, y: y + 0.6, w: 10.5, h: 0.7, fontSize: 12, fontFace: FONT_BODY, color: GRAY });
});
footer(s);

// ===== お願い3点（久保先生へ） =====
s = pres.addSlide();
s.background = { color: WHITE };
header(s, "REQUEST", "久保先生へ、お願いしたいこと。");
[
  ["01", "高槻市役所 担当部署のご紹介", "資源循環推進課（食品ロス削減担当）など"],
  ["02", "市の計画・議会での後押し", "策定中の食品ロス計画に、地元発の選択肢として言及いただけますと幸いです"],
  ["03", "高槻商工会議所のご紹介", "市内の事業者様への加盟店拡大を加速させたく存じます"],
].forEach((ask, i) => {
  const y = 2.4 + i * 1.5;
  s.addShape("ellipse", { x: 0.8, y: y, w: 1.2, h: 1.2, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
  s.addText(ask[0], { x: 0.8, y: y, w: 1.2, h: 1.2, fontSize: 28, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  s.addText(ask[1], { x: 2.3, y: y, w: 10.4, h: 0.6, fontSize: 19, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  s.addText(ask[2], { x: 2.3, y: y + 0.65, w: 10.4, h: 0.5, fontSize: 13, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
  if (i < 2) s.addShape("rect", { x: 2.3, y: y + 1.3, w: 10.4, h: 0.02, fill: { color: LIGHT_GRAY } });
});
footer(s);

// ===== クロージング＋連絡先 =====
s = pres.addSlide();
s.background = { color: CORAL };
s.addText("地元・高槻から、食品ロスのない街へ。", { x: 0.8, y: 1.6, w: 11.5, h: 1.0, fontSize: 34, fontFace: FONT_HEAD, color: WHITE, bold: true });
s.addText("本日はお時間をいただき、ありがとうございました。", { x: 0.8, y: 2.7, w: 11.5, h: 0.5, fontSize: 16, fontFace: FONT_BODY, color: "FFF1EE" });
s.addShape("roundRect", { x: 0.8, y: 3.7, w: 11.7, h: 2.4, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.12 });
s.addText("お問い合わせ", { x: 1.1, y: 3.95, w: 6, h: 0.4, fontSize: 13, fontFace: FONT_HEAD, color: CORAL, bold: true });
[
  ["📧 Email", "hello.osusowake@gmail.com"],
  ["🌐 Web", "osusowakejapan.org"],
  ["📷 Instagram", "@osusowake_official"],
  ["𝕏 X", "@Osusowake_offi"],
].forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 1.1 + col * 5.8, y = 4.5 + row * 0.7;
  s.addText(c[0], { x: x, y: y, w: 2.0, h: 0.5, fontSize: 13, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
  s.addText(c[1], { x: x + 2.0, y: y, w: 3.6, h: 0.5, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
});

pres.writeFile({ fileName: "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\osusowake_kubo_meeting.pptx" })
  .then(f => console.log("Created: " + f)).catch(e => console.error("Error:", e));
