// 高槻市長／副市長 面談用プレゼン資料（2バージョン同時生成）
// ベース：generate_kubo_pptx.js（久保先生向け）→ 市長向けへ改変
// 対外表現ルールは memory/feedback_osusowake_external_framing.md を厳守
//   - 「高槻発」で統一（「関西大学発」と書かない）
//   - 4本柱：加盟27店 / 3,000DL / 119袋救出 / 地元店へ¥45,263還元（累計GMV¥60,120）
//   - 登録者数（816/294）は出さない／内部運用数字（当日販売率・休眠店・手数料率）は主役にしない
// メール正本は memory/feedback_osusowake_email.md（対外掲載＝hello@osusowakejapan.org）
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");
const fs = require("fs");

const CORAL = "E8786C", CORAL_LIGHT = "FFF1EE";
const GREEN = "3FA535", GREEN_LIGHT = "E8F5E5";
const DARK = "2B2B2B", GRAY = "666666", LIGHT_GRAY = "F5F5F5", WHITE = "FFFFFF";
const NAVY = "1E2761", NAVY_LIGHT = "EAECF5";
const FONT_HEAD = "Yu Gothic UI", FONT_BODY = "Yu Gothic UI";
const LOGO = "C:\\Users\\kusao\\OneDrive\\画像\\logo-01.png";
const OUT_DIR = "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\";

// ===== アプリ実機スクショ（無ければ該当スライドをスキップ） =====
const SS_DIR = "C:\\Users\\kusao\\OneDrive\\画像\\スクリーンショット\\";
const SHOTS = [
  { file: "LINE_ALBUM_20260719 _2_260719_1.jpg", ratio: 0.467, num: "01", label: "さがす", desc: "近くの出品を一覧で" },
  { file: "LINE_ALBUM_20260719 _2_260719_2.jpg", ratio: 0.474, num: "02", label: "えらぶ", desc: "残り個数・受取時間を確認" },
  { file: "LINE_ALBUM_20260719 _2_260719_3.jpg", ratio: 0.463, num: "03", label: "受け取る", desc: "6桁コードで受取完了" },
];

// ===== お願い3点（宛先ごとの力点） =====
const ASKS = {
  // 市長版：政策・発信の力点
  policy: [
    ["01", "担当部署へのお引き合わせ　【本日の一番のお願い】", "今月中に、環境部 資源循環推進課の皆さまと実務の打ち合わせの場を一度いただけますと幸いです"],
    ["02", "市の計画への位置づけ", "策定中の一般廃棄物処理基本計画に、地元発の具体的な選択肢としてご明記・ご言及いただけますと幸いです"],
    ["03", "市の広報・SDGs事例としての発信", "市の広報誌・SNS・対外PRで、地元発の先進事例としてご紹介いただけますと幸いです"],
  ],
  // 副市長版：実務・庁内調整の力点
  ops: [
    ["01", "資源循環推進課との実務連携", "具体的な連携内容を詰める打ち合わせの場をいただけますと幸いです"],
    ["02", "庁内調整のお力添え", "環境部・地域経済振興室など関係課をまたぐ調整に、お力添えいただけますと幸いです"],
    ["03", "市の計画への反映", "策定中の食品ロス計画に、地元発の具体的な選択肢として反映いただけますと幸いです"],
  ],
};

function build(target) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = `おすそわけ 高槻${target.role} 面談資料`;
  pres.author = "梅本幸汰";

  let _p = 0;
  const footer = (slide) => {
    _p++;
    slide.addText(`${_p}`, { x: 12.5, y: 7.1, w: 0.5, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: GRAY, align: "right" });
  };
  const footerDark = (slide) => {
    _p++;
    slide.addText(`${_p}`, { x: 12.5, y: 7.1, w: 0.5, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: "AAAAAA", align: "right" });
  };
  const header = (slide, eyebrow, title, color = CORAL) => {
    slide.addShape("rect", { x: 0.6, y: 0.95, w: 0.7, h: 0.07, fill: { color: color }, line: { color: color, width: 0 } });
    slide.addText(title, { x: 0.6, y: 1.15, w: 12.1, h: 0.7, fontSize: 30, fontFace: FONT_HEAD, color: DARK, bold: true });
  };

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
  s.addText(`高槻市${target.role} ${target.name} 様 ご面談資料`, { x: 1, y: 5.6, w: 9.2, h: 0.5, fontSize: 15, fontFace: FONT_BODY, color: "FFF1EE" });

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

  // ===== PROBLEM#2 高槻市 =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "PROBLEM #2", "高槻市の場合");
  s.addShape("roundRect", { x: 0.6, y: 2.2, w: 5.9, h: 4.3, fill: { color: DARK }, line: { color: DARK, width: 0 }, rectRadius: 0.15 });
  s.addText("高槻市民 一人あたりの\n家庭系食品ロス", { x: 0.8, y: 2.6, w: 5.5, h: 0.8, fontSize: 15, fontFace: FONT_HEAD, color: "FFB3AA", bold: true, align: "center" });
  s.addText([
    { text: "約 21", options: { fontSize: 88, color: WHITE, bold: true } },
    { text: "  kg/年", options: { fontSize: 24, color: WHITE, bold: false } },
  ], { x: 0.6, y: 3.7, w: 5.9, h: 1.3, fontFace: FONT_HEAD, align: "center", valign: "middle" });
  s.addShape("roundRect", { x: 6.8, y: 2.2, w: 5.9, h: 4.3, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.15 });
  s.addText("食品ロスを「問題」と\n認知している市民", { x: 7.0, y: 2.6, w: 5.5, h: 0.8, fontSize: 15, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center" });
  s.addText([
    { text: "81.1", options: { fontSize: 88, color: DARK, bold: true } },
    { text: " %", options: { fontSize: 32, color: GRAY, bold: false } },
  ], { x: 6.8, y: 3.7, w: 5.9, h: 1.3, fontFace: FONT_HEAD, align: "center", valign: "middle" });
  s.addText("出典：高槻市 令和7年度 第2回 廃棄物減量等推進審議会（一般廃棄物処理基本計画 素案／消費生活意識調査）", { x: 0.6, y: 6.75, w: 12.1, h: 0.45, fontSize: 12, fontFace: FONT_HEAD, color: NAVY, bold: true, align: "center" });
  footer(s);

  // ===== POLICY FIT：市自身が「アプリ活用を検討」と明言 =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "POLICY FIT", "市が求める「先進的な取組」は、すでに高槻で動いています", NAVY);
  s.addText("高槻市 一般廃棄物処理基本計画（策定中・食品ロス削減を新たに重点化）", { x: 0.6, y: 2.15, w: 12.1, h: 0.5, fontSize: 16, fontFace: FONT_HEAD, color: GRAY, bold: true });
  s.addShape("roundRect", { x: 0.6, y: 2.85, w: 12.1, h: 2.6, fill: { color: NAVY_LIGHT }, line: { color: NAVY, width: 2 }, rectRadius: 0.12 });
  s.addShape("rect", { x: 0.6, y: 2.85, w: 0.12, h: 2.6, fill: { color: NAVY }, line: { color: NAVY, width: 0 } });
  s.addText("“", { x: 0.85, y: 2.75, w: 1.2, h: 1.0, fontSize: 72, fontFace: FONT_HEAD, color: NAVY, bold: true });
  s.addText("アプリ・プラットフォームを用いた先進的な取組について\n情報収集を行い、検討を進めて参りたい", { x: 1.7, y: 3.25, w: 10.5, h: 1.9, fontSize: 25, fontFace: FONT_HEAD, color: NAVY, bold: true, valign: "middle", lineSpacingMultiple: 1.15 });
  s.addText("出典：高槻市 令和7年度 第2回 廃棄物減量等推進審議会", { x: 0.6, y: 5.6, w: 12.1, h: 0.4, fontSize: 12, fontFace: FONT_BODY, color: GRAY, italic: true });
  s.addShape("roundRect", { x: 0.6, y: 6.2, w: 12.1, h: 0.75, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.1 });
  s.addText([
    { text: "構想でも実証実験でもありません。", options: { fontSize: 17, color: DARK, bold: true } },
    { text: "市内27店舗・3,000ダウンロード", options: { fontSize: 17, color: CORAL, bold: true } },
    { text: "で、すでに稼働しています。", options: { fontSize: 17, color: DARK, bold: true } },
  ], { x: 0.6, y: 6.2, w: 12.1, h: 0.75, fontFace: FONT_HEAD, align: "center", valign: "middle" });
  footer(s);

  // ===== ソリューション3ステップ =====
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

  // ===== 実際のアプリ画面（実機スクショ） =====
  if (SHOTS.every(p => fs.existsSync(SS_DIR + p.file))) {
    s = pres.addSlide();
    s.background = { color: WHITE };
    header(s, "PRODUCT", "実際のアプリ画面");
    SHOTS.forEach((p, i) => {
      const cx = 2.85 + i * 3.82;
      const h = 4.3, w = h * p.ratio;
      const x = cx - w / 2, y = 1.85;
      s.addShape("roundRect", { x: x - 0.07, y: y - 0.07, w: w + 0.14, h: h + 0.14, fill: { color: WHITE }, line: { color: "DDDDDD", width: 1 }, rectRadius: 0.08 });
      s.addImage({ path: SS_DIR + p.file, x: x, y: y, w: w, h: h });
      const uy = 6.45, ux = cx - 1.55;
      s.addShape("ellipse", { x: ux, y: uy, w: 0.6, h: 0.6, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
      s.addText(p.num, { x: ux, y: uy, w: 0.6, h: 0.6, fontSize: 17, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
      s.addText(p.label, { x: ux + 0.75, y: uy - 0.05, w: 2.3, h: 0.4, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
      s.addText(p.desc, { x: ux + 0.75, y: uy + 0.33, w: 2.3, h: 0.3, fontSize: 10, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
    });
    footer(s);
  } else {
    console.log("⚠️ アプリ画面スクショが見つからないため『実際のアプリ画面』スライドはスキップしました");
  }

  // ===== 料金（主役＝行政の財政負担ゼロ） =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "BUSINESS MODEL", "高槻市のご負担は、一切ありません。", GREEN);
  // 左：お店
  s.addShape("roundRect", { x: 0.6, y: 1.95, w: 5.9, h: 3.7, fill: { color: WHITE }, line: { color: GREEN, width: 2 }, rectRadius: 0.15 });
  s.addShape("rect", { x: 0.6, y: 1.95, w: 5.9, h: 0.65, fill: { color: GREEN }, line: { color: GREEN, width: 0 } });
  s.addText("お店", { x: 0.6, y: 1.95, w: 5.9, h: 0.65, fontSize: 19, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  [
    { num: "¥0", label: "初期費用", color: GREEN, big: true },
    { num: "¥0", label: "月額固定費", color: GREEN, big: true },
    { num: "25%", label: "売れた分だけの成果報酬", color: GRAY, big: false },
  ].forEach((fee, i) => {
    const y = 2.75 + i * 0.92;
    s.addText(fee.num, { x: 0.9, y: y, w: 2.2, h: 0.85, fontSize: fee.big ? 42 : 26, fontFace: FONT_HEAD, color: fee.color, bold: true, align: "center", valign: "middle" });
    s.addText(fee.label, { x: 3.1, y: y, w: 3.3, h: 0.85, fontSize: fee.big ? 15 : 12, fontFace: FONT_HEAD, color: fee.big ? DARK : GRAY, bold: fee.big, valign: "middle" });
  });
  // 右：お客様
  s.addShape("roundRect", { x: 6.8, y: 1.95, w: 5.9, h: 3.7, fill: { color: WHITE }, line: { color: CORAL, width: 2 }, rectRadius: 0.15 });
  s.addShape("rect", { x: 6.8, y: 1.95, w: 5.9, h: 0.65, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
  s.addText("お客様", { x: 6.8, y: 1.95, w: 5.9, h: 0.65, fontSize: 19, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  [
    { num: "¥0", label: "アプリのダウンロード", color: GREEN },
    { num: "5%", label: "購入時の手数料", color: CORAL },
  ].forEach((u, i) => {
    const y = 2.9 + i * 1.25;
    s.addText(u.num, { x: 7.1, y: y, w: 2.5, h: 1.1, fontSize: 42, fontFace: FONT_HEAD, color: u.color, bold: true, align: "center", valign: "middle" });
    s.addText(u.label, { x: 9.6, y: y, w: 2.9, h: 1.1, fontSize: 15, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  });
  // 下：高槻市の負担（この資料の主役）
  s.addShape("roundRect", { x: 0.6, y: 5.85, w: 12.1, h: 1.1, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 3 }, rectRadius: 0.12 });
  s.addText("高槻市の\nご負担", { x: 0.85, y: 5.85, w: 2.0, h: 1.1, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
  [
    { num: "¥0", label: "初期費用・導入費" },
    { num: "¥0", label: "運用費・委託費" },
    { num: "¥0", label: "補助金・予算措置" },
  ].forEach((c, i) => {
    const x = 3.1 + i * 3.15;
    s.addText(c.num, { x: x, y: 5.95, w: 1.3, h: 0.9, fontSize: 40, fontFace: FONT_HEAD, color: GREEN, bold: true, align: "center", valign: "middle" });
    s.addText(c.label, { x: x + 1.3, y: 5.95, w: 1.85, h: 0.9, fontSize: 12.5, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  });
  s.addText("✓ 運営はすべて民間で行います　／　Stripe決済（業界最高水準のセキュリティ）", { x: 0.6, y: 7.02, w: 11.5, h: 0.32, fontSize: 11, fontFace: FONT_BODY, color: GRAY, align: "center", valign: "middle" });
  footer(s);

  // ===== 三方良し =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "WHY IT WORKS", "三方良しの構造");
  [
    { who: "お店", emoji: "🏪", benefit: "廃棄ロス削減\n+ 新規顧客獲得\n+ ブランド向上", color: CORAL },
    { who: "お客様", emoji: "👤", benefit: "お得に購入\n+ 食品ロス削減に\n  参加できる", color: GREEN },
    { who: "高槻市", emoji: "🌍", benefit: "CO2削減\n+ 地域経済活性化\n+ SDGs達成", color: NAVY },
  ].forEach((it, i) => {
    const x = 0.6 + i * 4.2;
    s.addShape("roundRect", { x: x, y: 2.4, w: 3.9, h: 4.4, fill: { color: WHITE }, line: { color: it.color, width: 2 }, rectRadius: 0.15 });
    s.addShape("rect", { x: x, y: 2.4, w: 3.9, h: 0.7, fill: { color: it.color }, line: { color: it.color, width: 0 } });
    s.addText(it.who, { x: x, y: 2.4, w: 3.9, h: 0.7, fontSize: 22, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
    s.addText(it.emoji, { x: x, y: 3.3, w: 3.9, h: 1.5, fontSize: 80, align: "center", valign: "middle" });
    s.addText(it.benefit, { x: x + 0.2, y: 5.0, w: 3.5, h: 1.7, fontSize: 15, fontFace: FONT_BODY, color: DARK, align: "center", valign: "middle" });
  });
  footer(s);

  // ===== 現在の状況（実データ・稼働中の実績） =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "TRACTION", "すでに動いています（実績）");
  [
    { num: "3,000", unit: "", label: "累計ダウンロード", color: CORAL },
    { num: "27", unit: "店", label: "承認済み加盟店", color: GREEN },
    { num: "119", unit: "袋", label: "救った食品（累計）", color: NAVY },
    { num: "¥45,263", unit: "", label: "地元店へ還元（累計）", color: CORAL },
  ].forEach((t, i) => {
    const x = 0.6 + i * 3.075;
    s.addShape("roundRect", { x: x, y: 1.95, w: 2.9, h: 2.5, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
    s.addText([
      { text: t.num, options: { fontSize: t.num.length > 4 ? 34 : 52, color: t.color, bold: true } },
      { text: t.unit ? " " + t.unit : "", options: { fontSize: 20, color: t.color, bold: true } },
    ], { x: x, y: 2.35, w: 2.9, h: 1.2, fontFace: FONT_HEAD, align: "center", valign: "middle" });
    s.addText(t.label, { x: x + 0.1, y: 3.6, w: 2.7, h: 0.7, fontSize: 12.5, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
  });
  s.addShape("roundRect", { x: 0.6, y: 4.75, w: 12.1, h: 1.85, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.12 });
  s.addText([
    { text: "累計取扱高（GMV）¥60,120", options: { fontSize: 18, color: DARK, bold: true } },
    { text: "　／　iOSアプリ App Store公開中　／　Instagram・Xで発信中", options: { fontSize: 14, color: DARK, bold: false } },
  ], { x: 0.8, y: 5.0, w: 11.7, h: 0.55, fontFace: FONT_HEAD, valign: "middle" });
  s.addText("高槻を中心に、実際に食品ロス削減の取引が生まれています。", { x: 0.8, y: 5.6, w: 11.7, h: 0.5, fontSize: 15, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
  s.addText("出典：おすそわけ 自社ダッシュボード（2026年7月時点）", { x: 0.6, y: 6.75, w: 12.1, h: 0.4, fontSize: 11, fontFace: FONT_BODY, color: GRAY, italic: true, align: "center" });
  footer(s);

  // ===== 成長グラフ（画像1枚・16:9 全面） =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  s.addImage({
    path: "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\おすそわけ_成長グラフ.png",
    x: 0, y: 0, w: 13.33, h: 7.5,
  });
  footer(s);

  // ===== 社会的インパクト試算 =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "IMPACT", "これまでの削減インパクト（試算）", GREEN);
  // 左：救った食品
  s.addShape("roundRect", { x: 0.6, y: 2.1, w: 5.9, h: 3.5, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 2 }, rectRadius: 0.15 });
  s.addText("廃棄から救った食品", { x: 0.6, y: 2.35, w: 5.9, h: 0.5, fontSize: 16, fontFace: FONT_HEAD, color: GREEN, bold: true, align: "center" });
  s.addText([
    { text: "約 60", options: { fontSize: 82, color: DARK, bold: true } },
    { text: " kg", options: { fontSize: 30, color: DARK, bold: true } },
  ], { x: 0.6, y: 3.0, w: 5.9, h: 1.5, fontFace: FONT_HEAD, align: "center", valign: "middle" });
  s.addText("累計119袋 × 1袋あたり0.5kg換算", { x: 0.6, y: 4.6, w: 5.9, h: 0.5, fontSize: 13, fontFace: FONT_BODY, color: GRAY, align: "center" });
  // 右：CO2
  s.addShape("roundRect", { x: 6.8, y: 2.1, w: 5.9, h: 3.5, fill: { color: NAVY_LIGHT }, line: { color: NAVY, width: 2 }, rectRadius: 0.15 });
  s.addText("削減したCO₂", { x: 6.8, y: 2.35, w: 5.9, h: 0.5, fontSize: 16, fontFace: FONT_HEAD, color: NAVY, bold: true, align: "center" });
  s.addText([
    { text: "約 150", options: { fontSize: 82, color: NAVY, bold: true } },
    { text: " kg-CO₂", options: { fontSize: 26, color: NAVY, bold: true } },
  ], { x: 6.8, y: 3.0, w: 5.9, h: 1.5, fontFace: FONT_HEAD, align: "center", valign: "middle" });
  s.addText("🌲 杉の木 約11本の年間吸収量に相当", { x: 6.8, y: 4.6, w: 5.9, h: 0.5, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center" });
  // 結び
  s.addShape("roundRect", { x: 0.6, y: 5.85, w: 12.1, h: 0.8, fill: { color: CORAL_LIGHT }, line: { color: CORAL_LIGHT, width: 0 }, rectRadius: 0.1 });
  s.addText("すでに削減は始まっています。加盟店と利用者が増えるほど、市全体でのインパクトは大きくなります。", { x: 0.6, y: 5.85, w: 12.1, h: 0.8, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
  s.addText("※試算値。1袋0.5kg・食品ロス1kg≒2.5kg-CO₂で換算", { x: 0.6, y: 6.75, w: 12.1, h: 0.4, fontSize: 11, fontFace: FONT_BODY, color: GRAY, italic: true, align: "center" });
  footer(s);

  // ===== チーム =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "TEAM", "高槻にゆかりのある、学生8人のチーム");
  [
    { name: "佐藤 勇飛", uni: "関西大学", role: "代表・営業統括" },
    { name: "梅本 幸汰", uni: "関西大学", role: "副代表・戦略" },
    { name: "吉澤 駿佑", uni: "関西大学", role: "営業・SNS" },
    { name: "竹倉 己博", uni: "立命館大学", role: "営業統括" },
    { name: "関本 達也", uni: "龍谷大学", role: "開発・営業" },
    { name: "今井 蒼空", uni: "龍谷大学", role: "営業・SNS戦略" },
    { name: "岡本 ゆうき", uni: "龍谷大学", role: "営業" },
    { name: "谷川 碧唯", uni: "龍谷大学", role: "営業・偵察" },
  ].forEach((m, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.6 + col * 3.075;
    const y = 2.15 + row * 2.35;
    s.addShape("roundRect", { x: x, y: y, w: 2.9, h: 2.1, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
    s.addShape("ellipse", { x: x + 1.1, y: y + 0.15, w: 0.7, h: 0.7, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
    s.addText("👤", { x: x + 1.1, y: y + 0.15, w: 0.7, h: 0.7, fontSize: 26, align: "center", valign: "middle" });
    s.addText(m.name, { x: x + 0.1, y: y + 0.92, w: 2.7, h: 0.45, fontSize: 17, fontFace: FONT_HEAD, color: DARK, bold: true, align: "center", valign: "middle" });
    s.addText(m.role, { x: x + 0.1, y: y + 1.35, w: 2.7, h: 0.38, fontSize: 12, fontFace: FONT_HEAD, color: CORAL, bold: true, align: "center", valign: "middle" });
    s.addText(m.uni, { x: x + 0.1, y: y + 1.7, w: 2.7, h: 0.33, fontSize: 10, fontFace: FONT_BODY, color: GRAY, align: "center", valign: "middle" });
  });
  s.addText([
    { text: "全員が高槻にゆかりのある学生チーム", options: { fontSize: 14, color: DARK, bold: true } },
    { text: "　／　今後の法人化を予定しています", options: { fontSize: 13, color: GRAY, bold: false } },
  ], { x: 0.6, y: 6.85, w: 12.1, h: 0.35, fontFace: FONT_BODY, align: "center", valign: "middle" });
  footer(s);

  // ===== 今後の予定 =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "ROADMAP", "今後の予定");
  [
    { date: "〜7月", title: "✅ ローンチ・運用開始", items: "・iOSアプリ公開\n・出品／取引スタート\n・加盟店27店を承認\n・累計119袋を救出\n・行政との対話を開始", color: GREEN },
    { date: "今（拡大期）", title: "🚀 供給・利用者の拡大", items: "・加盟店の出品率UP\n・高槻市内の店舗拡大\n・利用者の獲得\n・店舗サポートの強化\n・行政連携の具体化", color: CORAL },
    { date: "今後", title: "北摂へ拡大・法人化", items: "・茨木・吹田・摂津へ\n・他自治体との連携\n・法人化", color: NAVY },
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
  header(s, "CONTRIBUTION", "高槻市への貢献", GREEN);
  [
    { icon: "📊", title: "市の計画目標の達成に、直接貢献します", desc: "策定中の一般廃棄物処理基本計画が掲げる食品ロス削減に直結。削減量・成約数・店舗還元額を月次レポートでご提供し、市の進捗管理にそのままお使いいただけます。" },
    { icon: "🏪", title: "市内の事業者と家庭を、同時に支えます", desc: "お店の廃棄ロスを直接減らして売上に変え、市民はお得に買い支える。市内事業者の経営支援と家庭の食費負担軽減が、同時に進みます。" },
    { icon: "📰", title: "地域メディアと連携し、市内に情報が広がっています", desc: "高槻の地域情報ポータル『まちポケ高槻』（takatsuki.machipoke.com）に、おすそわけの出品中商品がリアルタイムで掲載されています。アプリの外にも“今日おトクに買える地元の食品”が届く導線ができています。" },
    { icon: "🏆", title: "「地元の学生を応援する市」として、SDGs実績を発信できます", desc: "高槻にゆかりのある学生8人が地元課題に挑む取り組みです。市の広報・議会・対外PRで、若者支援とSDGsの両方の実績としてご活用いただけます。財政負担なしで進みます。" },
  ].forEach((c, i) => {
    const y = 1.98 + i * 1.27;
    s.addShape("roundRect", { x: 0.6, y: y, w: 12.1, h: 1.18, fill: { color: GREEN_LIGHT }, line: { color: GREEN, width: 0 }, rectRadius: 0.12 });
    s.addText(c.icon, { x: 0.8, y: y + 0.12, w: 1.1, h: 0.95, fontSize: 32, align: "center", valign: "middle" });
    s.addText(c.title, { x: 2.0, y: y + 0.1, w: 10.5, h: 0.42, fontSize: 16, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
    s.addText(c.desc, { x: 2.0, y: y + 0.52, w: 10.5, h: 0.62, fontSize: 11, fontFace: FONT_BODY, color: GRAY });
  });
  footer(s);

  // ===== お願いしたいこと（宛先ごとに力点を変える） =====
  s = pres.addSlide();
  s.background = { color: WHITE };
  header(s, "REQUEST", `高槻市${target.role}へ、お願いしたいこと。`);
  ASKS[target.askEmphasis].forEach((ask, i) => {
    const y = 2.25 + i * 1.42;
    // ①は最優先として強調（背景＋枠）
    if (i === 0) {
      s.addShape("roundRect", { x: 0.6, y: y - 0.18, w: 12.1, h: 1.55, fill: { color: CORAL_LIGHT }, line: { color: CORAL, width: 2.5 }, rectRadius: 0.12 });
    }
    s.addShape("ellipse", { x: 0.85, y: y, w: 1.15, h: 1.15, fill: { color: CORAL }, line: { color: CORAL, width: 0 } });
    s.addText(ask[0], { x: 0.85, y: y, w: 1.15, h: 1.15, fontSize: 27, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
    s.addText(ask[1], { x: 2.3, y: y - 0.02, w: 10.3, h: 0.55, fontSize: i === 0 ? 20 : 18, fontFace: FONT_HEAD, color: i === 0 ? CORAL : DARK, bold: true, valign: "middle" });
    s.addText(ask[2], { x: 2.3, y: y + 0.55, w: 10.3, h: 0.6, fontSize: 13, fontFace: FONT_BODY, color: i === 0 ? DARK : GRAY, valign: "middle" });
    if (i === 1) s.addShape("rect", { x: 2.3, y: y + 1.2, w: 10.3, h: 0.02, fill: { color: LIGHT_GRAY } });
  });
  // クロージングの一押し
  s.addShape("roundRect", { x: 0.6, y: 6.45, w: 12.1, h: 0.75, fill: { color: DARK }, line: { color: DARK, width: 0 }, rectRadius: 0.1 });
  s.addText("第一歩として、担当課との打ち合わせの場をいただけますと幸いです。", { x: 0.6, y: 6.45, w: 12.1, h: 0.75, fontSize: 17, fontFace: FONT_HEAD, color: WHITE, bold: true, align: "center", valign: "middle" });
  footer(s);

  // ===== クロージング＋連絡先 =====
  s = pres.addSlide();
  s.background = { color: CORAL };
  s.addText("地元・高槻から、食品ロスのない街へ。", { x: 0.8, y: 1.6, w: 11.5, h: 1.0, fontSize: 34, fontFace: FONT_HEAD, color: WHITE, bold: true });
  s.addText("本日はお時間をいただき、ありがとうございました。", { x: 0.8, y: 2.7, w: 11.5, h: 0.5, fontSize: 16, fontFace: FONT_BODY, color: "FFF1EE" });
  s.addShape("roundRect", { x: 0.8, y: 3.7, w: 11.7, h: 2.4, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.12 });
  s.addText("お問い合わせ", { x: 1.1, y: 3.95, w: 6, h: 0.4, fontSize: 13, fontFace: FONT_HEAD, color: CORAL, bold: true });
  [
    ["📧 Email", "hello@osusowakejapan.org"],
    ["🌐 Web", "osusowakejapan.org"],
    ["📷 Instagram", "@osusowake_official"],
    ["𝕏 X", "@Osusowake_offi"],
  ].forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 1.1 + col * 5.8, y = 4.5 + row * 0.7;
    s.addText(c[0], { x: x, y: y, w: 2.0, h: 0.5, fontSize: 13, fontFace: FONT_BODY, color: GRAY, valign: "middle" });
    s.addText(c[1], { x: x + 2.0, y: y, w: 3.6, h: 0.5, fontSize: 14, fontFace: FONT_HEAD, color: DARK, bold: true, valign: "middle" });
  });

  return pres.writeFile({ fileName: OUT_DIR + target.file });
}

// ===== 2バージョン生成 =====
const TARGETS = [
  { role: "市長",   name: "濱田 剛史", file: "osusowake_takatsuki_mayor.pptx",     askEmphasis: "policy" },
  { role: "副市長", name: "八十",     file: "osusowake_takatsuki_vicemayor.pptx", askEmphasis: "ops" },
];

(async () => {
  for (const t of TARGETS) {
    try {
      const f = await build(t);
      console.log(`Created (${t.role}版): ${f}`);
    } catch (e) {
      console.error(`Error (${t.role}版):`, e.message);
    }
  }
})();
