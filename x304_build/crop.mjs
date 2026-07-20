import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

const SRC = 'C:/Users/kusao/OneDrive/画像/スクリーンショット';
const OUT = 'C:/Users/kusao/OneDrive/デスクトップ/line-claude-bot/x304_build/img';
fs.mkdirSync(OUT, { recursive: true });

// top fraction to crop away (removes J'S RACING JAPAN + copyright/IP/timestamp watermark band)
const jobs = [
  { in: 'WriteIMG1507aws.jpg',     out: 'tail_hero.jpg',  topCut: 0.125, bottomCut: 0 },
  { in: 'WriteIMG1507aws (1).jpg', out: 'tail_black.jpg', topCut: 0.115, bottomCut: 0 },
  { in: 'WriteIMG1507aws (2).jpg', out: 'underbody.jpg',  topCut: 0.105, bottomCut: 0 },
  { in: 'WriteIMG1507aws (3).jpg', out: 'car_track.jpg',  topCut: 0.085, bottomCut: 0 },
];

// mild unsharp mask to counter JPEG softness (amount ~ subtle)
function sharpen(ctx, w, h, amount = 0.5) {
  const src = ctx.getImageData(0, 0, w, h);
  const out = ctx.createImageData(w, h);
  const s = src.data, d = out.data;
  // 3x3 kernel: center (1+4a), neighbors -a
  const a = amount;
  const k = [0, -a, 0, -a, 1 + 4 * a, -a, 0, -a, 0];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0, ki = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const yy = Math.min(h - 1, Math.max(0, y + dy));
            const xx = Math.min(w - 1, Math.max(0, x + dx));
            sum += s[(yy * w + xx) * 4 + c] * k[ki++];
          }
        }
        d[(y * w + x) * 4 + c] = sum < 0 ? 0 : sum > 255 ? 255 : sum;
      }
      d[(y * w + x) * 4 + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
}

for (const j of jobs) {
  const img = await loadImage(path.join(SRC, j.in));
  const w = img.width, h = img.height;
  const top = Math.round(h * j.topCut);
  const bot = Math.round(h * j.bottomCut);
  const nh = h - top - bot;
  const cv = createCanvas(w, nh);
  const ctx = cv.getContext('2d');
  ctx.drawImage(img, 0, top, w, nh, 0, 0, w, nh);
  sharpen(ctx, w, nh, 0.5);
  fs.writeFileSync(path.join(OUT, j.out), cv.toBuffer('image/jpeg', 0.94));
  console.log(`${j.out}: ${w}x${h} -> ${w}x${nh} (sharpened)`);
}
console.log('done');
