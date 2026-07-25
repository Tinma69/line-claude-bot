// おすそわけ 営業メール送信スクリプト（Gmail SMTP・確認付き）
// 使い方:
//   node send_osusowake_email.js --to 宛先 --subject "件名" --body-file 本文.md            # ドライラン（内容確認のみ）
//   node send_osusowake_email.js --to 宛先 --subject "件名" --body-file 本文.md --live     # 実送信
//   オプション: --attach 添付ファイル.pdf（複数回指定可） --cc アドレス
//
// 必要な環境変数（--live時）:
//   GMAIL_USER          = hello.osusowake@gmail.com
//   GMAIL_APP_PASSWORD  = Googleアカウントの「アプリパスワード」（通常のPWではない）
//
// 仕様:
//   - From: おすそわけ運営事務局 <hello.osusowake@gmail.com>
//   - Reply-To: hello@osusowakejapan.org（返信は.orgで受ける＝ImprovMX経由でGmailに届く）
//   - 本文ファイルはUTF-8のプレーンテキスト/markdown（そのままテキストメールとして送る）
//   - 送信ログを sns_post_log.txt と同じフォルダの email_send_log.txt に追記

const fs = require("fs");
const path = require("path");
const nodemailer = require(path.join(__dirname, "node_modules", "nodemailer"));

const ARGS = process.argv.slice(2);
function getArg(name) {
  const i = ARGS.indexOf(name);
  return i >= 0 ? ARGS[i + 1] : null;
}
function getArgAll(name) {
  const out = [];
  ARGS.forEach((a, i) => { if (a === name && ARGS[i + 1]) out.push(ARGS[i + 1]); });
  return out;
}
const LIVE = ARGS.includes("--live");
const to = getArg("--to");
const cc = getArg("--cc");
const subject = getArg("--subject");
const bodyFile = getArg("--body-file");
const attachments = getArgAll("--attach");

if (!to || !subject || !bodyFile) {
  console.error("必須: --to 宛先 --subject 件名 --body-file 本文ファイル");
  process.exit(1);
}
if (!fs.existsSync(bodyFile)) { console.error(`本文ファイルが無い: ${bodyFile}`); process.exit(1); }
for (const a of attachments) {
  if (!fs.existsSync(a)) { console.error(`添付ファイルが無い: ${a}`); process.exit(1); }
}
const body = fs.readFileSync(bodyFile, "utf8");

console.log("======== 送信内容の確認 ========");
console.log(`To:      ${to}`);
if (cc) console.log(`Cc:      ${cc}`);
console.log(`From:    おすそわけ運営事務局 <hello.osusowake@gmail.com>`);
console.log(`Reply-To: hello@osusowakejapan.org`);
console.log(`Subject: ${subject}`);
console.log(`添付:    ${attachments.length ? attachments.map(a => path.basename(a)).join(", ") : "なし"}`);
console.log("---- 本文（先頭30行） ----");
console.log(body.split("\n").slice(0, 30).join("\n"));
console.log("...");
console.log("================================");

if (!LIVE) {
  console.log("🔍 ドライラン。内容が正しければ --live を付けて実行");
  process.exit(0);
}

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;
if (!user || !pass) { console.error("GMAIL_USER / GMAIL_APP_PASSWORD が未設定"); process.exit(1); }

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", port: 465, secure: true,
  auth: { user, pass },
});

(async () => {
  const info = await transporter.sendMail({
    from: `"おすそわけ運営事務局" <${user}>`,
    to,
    cc: cc || undefined,
    replyTo: "hello@osusowakejapan.org",
    subject,
    text: body,
    attachments: attachments.map((a) => ({ filename: path.basename(a), path: a })),
  });
  const line = `${new Date().toISOString()}\tTO:${to}\tSUBJ:${subject}\tID:${info.messageId}`;
  fs.appendFileSync(path.join(__dirname, "email_send_log.txt"), line + "\n");
  console.log(`✅ 送信成功: ${info.messageId}`);
})().catch((e) => { console.error("❌ 送信失敗:", e.message); process.exit(1); });
