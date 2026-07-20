const QRCode = require("qrcode");

const targets = [
  { name: "qr_appstore", url: "https://apps.apple.com/jp/app/おすそわけ/id6763268307" },
  { name: "qr_webapp", url: "https://osusowakejapan.org" },
  { name: "qr_instagram", url: "https://www.instagram.com/osusowake_official/" },
  { name: "qr_x", url: "https://x.com/Osusowake_offi" }
];

const opts = {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1000,
  color: { dark: "#2B2B2B", light: "#FFFFFF" }
};

(async () => {
  for (const t of targets) {
    const path = `C:\\Users\\kusao\\OneDrive\\デスクトップ\\line-claude-bot\\${t.name}.png`;
    await QRCode.toFile(path, t.url, opts);
    console.log(`Created: ${t.name}.png -> ${t.url}`);
  }
})();
