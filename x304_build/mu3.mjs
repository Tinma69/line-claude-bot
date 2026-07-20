import * as mupdf from 'mupdf';import fs from 'fs';
const doc=mupdf.Document.openDocument(fs.readFileSync('X304_Stainless_Exhaust_FL5_EN.pdf'),'application/pdf');
const pix=doc.loadPage(0).toPixmap(mupdf.Matrix.scale(3,3),mupdf.ColorSpace.DeviceRGB,false);
fs.writeFileSync('_preview.png',pix.asPNG());console.log('hi-res done');
