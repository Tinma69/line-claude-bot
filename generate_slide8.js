// ゆうひ資料の8枚目（実績スライド・単体）生成
const pptxgen = require("C:\\Users\\kusao\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";

const CORAL = "E8786C", GREEN = "3FA535", DARK = "2B2B2B", GRAY = "666666", LIGHT_GRAY = "F5F5F5", WHITE = "FFFFFF";
const FH = "Yu Gothic UI", FB = "Yu Gothic UI";

const s = pres.addSlide();
s.background = { color: WHITE };
s.addText("TRACTION", { x: 0.6, y: 0.6, w: 8, h: 0.4, fontSize: 14, fontFace: FB, color: CORAL, bold: true, charSpacing: 4 });
s.addText("高槻で、もう動いています。", { x: 0.6, y: 1.1, w: 12.1, h: 0.7, fontSize: 30, fontFace: FH, color: DARK, bold: true });

const traction = [
  { icon: "🤝", title: "提携契約", value: "15店 締結済み", sub: "ベーカリー・カフェ・スイーツ・飲食" },
  { icon: "🏪", title: "高槻エリア把握", value: "35店超", sub: "営業中・契約交渉中" },
  { icon: "📧", title: "本社アプローチ", value: "18社 打診済み", sub: "地元チェーン本社含む" },
  { icon: "🚀", title: "正式リリース", value: "7月1日(水)", sub: "App Store審査通過済み" },
];
traction.forEach((t, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.6 + col * 6.2, y = 2.4 + row * 2.2;
  s.addShape("roundRect", { x: x, y: y, w: 6.0, h: 2.0, fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 }, rectRadius: 0.1 });
  s.addText(t.icon, { x: x + 0.3, y: y + 0.3, w: 1.2, h: 1.4, fontSize: 48, align: "center", valign: "middle" });
  s.addText(t.title, { x: x + 1.7, y: y + 0.2, w: 4.2, h: 0.5, fontSize: 14, fontFace: FB, color: GRAY });
  s.addText(t.value, { x: x + 1.7, y: y + 0.6, w: 4.2, h: 0.7, fontSize: 28, fontFace: FH, color: CORAL, bold: true });
  s.addText(t.sub, { x: x + 1.7, y: y + 1.4, w: 4.2, h: 0.5, fontSize: 12, fontFace: FB, color: GRAY });
});
s.addText("おすそわけ｜高槻発 食品ロス削減アプリ", { x: 0.6, y: 7.0, w: 8, h: 0.3, fontSize: 10, fontFace: FB, color: GRAY, italic: true });

pres.writeFile({ fileName: "C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\osusowake_slide8.pptx" })
  .then(f => console.log("Created: " + f)).catch(e => console.error(e));
