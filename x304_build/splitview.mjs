import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
const src = 'C:/Users/kusao/OneDrive/デスクトップ/line-claude-bot/x304_build/_preview.png';
const img = await loadImage(src);
const w = img.width, h = img.height;
// top half
for (const [name, y0, y1] of [['_top.png',0,0.52],['_bot.png',0.48,1.0]]){
  const sy = Math.round(h*y0), sh = Math.round(h*(y1-y0));
  const cv = createCanvas(w, sh); const ctx = cv.getContext('2d');
  ctx.drawImage(img, 0, sy, w, sh, 0, 0, w, sh);
  fs.writeFileSync('C:/Users/kusao/OneDrive/デスクトップ/line-claude-bot/x304_build/'+name, cv.toBuffer('image/png'));
}
console.log('size', w, h);
