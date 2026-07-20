import * as mupdf from 'mupdf';
import fs from 'fs';
const buf = fs.readFileSync(process.argv[2]);
const doc = mupdf.Document.openDocument(buf, 'application/pdf');
const n = doc.countPages();
console.log('pages:', n);
const out = process.argv[3]; fs.mkdirSync(out,{recursive:true});
for(let i=0;i<n;i++){
  const page = doc.loadPage(i);
  const pix = page.toPixmap(mupdf.Matrix.scale(2,2), mupdf.ColorSpace.DeviceRGB, false);
  fs.writeFileSync(`${out}/page-${String(i+1).padStart(2,'0')}.png`, pix.asPNG());
}
console.log('done');
