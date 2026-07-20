// 今日配る2000枚 重点店舗中心・徒歩15分以内・確実に投函できる団地/築古優先
const ExcelJS = require('exceljs');
const FONT = 'Meiryo';
const clColor = { A:'FFFFCDD2', F:'FFFFF9C4', D:'FFBBDEFB', C:'FFC8E6C9' };

// [エリア, 近くの重点店, 建物名, フル住所, 枚数, 投函可否, メモ]
const rows = [
  // A 高槻駅（重点5店）= 953：古曽部の大型団地＋北園町・城北 ＝全部 団地/古め＝投函しやすい
  ['A','poko/ビーチアイランド/マウンテン','高槻スカイハイツ','大阪府高槻市古曽部町2-10-10',248,'✅団地','248戸まるごと（poko真隣・徒歩1分）'],
  ['A','〃','ニチメン高槻グランドハイツ','大阪府高槻市古曽部町2-15-1',171,'✅団地','171戸まるごと'],
  ['A','〃','メゾン高槻古曽部','大阪府高槻市古曽部町2-6-1',111,'✅','111戸まるごと'],
  ['A','〃','高槻ビューハイツ槻の木','大阪府高槻市古曽部町2-14-10',102,'✅','102戸まるごと'],
  ['A','〃','ライオンズ高槻古曽部','大阪府高槻市古曽部町2-29',83,'✅','83戸まるごと'],
  ['A','〃','レオ高槻','大阪府高槻市古曽部町2-15-8',63,'✅','78戸のうち63戸（打ち止め）'],
  ['A','manu a manu BAKE(城北町)','ドゥーシェ高槻','大阪府高槻市城北町2-7-7',75,'✅','75戸まるごと（徒歩5分）'],
  ['A','ピケのチーズケーキ屋(北園町)','クラルテ高槻北園町','大阪府高槻市北園町2-3',41,'✅','41戸まるごと（徒歩2分）'],
  ['A','ピケのチーズケーキ屋(北園町)','グランアッシュ高槻北園町','大阪府高槻市北園町9-9',38,'✅','38戸まるごと'],
  ['A','ピケのチーズケーキ屋(北園町)','セレブ高槻北園町','大阪府高槻市北園町13-32',21,'✅','21戸まるごと（ピケ隣）'],

  // F 土室・氷室（重点3店）= 600：阪急ヒルズコート団地が主力。Taps直近のグリーンマークスのみ要確認
  ['F','Taps BURGER(氷室町2)','グリーンマークス高槻','大阪府高槻市氷室町2-26-1',200,'⚠️要確認','築浅2006・集合ポスト投函可否を現地確認。NGは阪急ヒルズコートへ回す（Taps徒歩5分）'],
  ['F','料理家三(上土室5)','阪急ヒルズコート高槻','大阪府高槻市上土室1-10',271,'✅団地','494戸の団地のうち271戸（投函しやすい・徒歩5分／余力223戸＝振替先）'],
  ['F','コウタロウ(土室町9)/宮田町','ロイヤルシャトー高槻','大阪府高槻市宮田町2-17-34',54,'✅','54戸まるごと（徒歩13分）'],
  ['F','コウタロウ(土室町9)','城第一マンション','大阪府高槻市土室町1-10',42,'✅','42戸まるごと（徒歩4分）'],
  ['F','宮田町','ロイヤルシャトー宮田町','大阪府高槻市宮田町2-18-5',18,'✅','18戸まるごと'],
  ['F','Taps(氷室町1)','グリーンエクセル高槻','大阪府高槻市氷室町1-28-1',15,'✅','15戸まるごと（徒歩7分）'],

  // D 津之江（重点2店）= 197：1970〜80年代の団地・築古のみ
  ['D','anpan/LUCCA(津之江町1)','メゾン津之江','大阪府高槻市津之江町3-1-1',50,'✅団地','50戸まるごと・1974築（徒歩8分）'],
  ['D','anpan/LUCCA(津之江町1)','エメラルドマンション高槻','大阪府高槻市津之江町1丁目',40,'✅','40戸まるごと・1987築（番地現地確認）'],
  ['D','城西町','高槻ファミリーハイツA棟','大阪府高槻市城西町4-15',40,'✅団地','40戸まるごと・1973築'],
  ['D','城西町','リヴェール城西','大阪府高槻市城西町3-35',30,'✅','32戸のうち30戸（打ち止め）'],
  ['D','anpan/LUCCA(津之江町2)','ローズコーポ高槻津之江','大阪府高槻市津之江町2丁目',18,'✅','18戸まるごと・1984築（番地現地確認）'],
  ['D','城西町','アソシアード高槻','大阪府高槻市城西町1-27',19,'✅','19戸まるごと'],

  // C 高垣（重点1店・高垣町自体は大型なし→宮野町の団地でカバー）= 250
  ['C','Bake House Nagomi(高垣町)/宮野町','大和サニーハイツ高槻 2棟','大阪府高槻市宮野町3-2',108,'✅団地','108戸まるごと（徒歩13分）'],
  ['C','〃','大和サニーハイツ高槻 1棟','大阪府高槻市宮野町3-1',88,'✅団地','88戸まるごと'],
  ['C','〃','大和サニーハイツ高槻 3棟','大阪府高槻市宮野町3-3',54,'✅団地','108戸のうち54戸（打ち止め）'],
];

const areaName = { A:'A 高槻駅', F:'F 土室・氷室', D:'D 津之江', C:'C 高垣' };
const han = { A:'班1', F:'班2', D:'班2', C:'班2' }; // 班1=A高槻駅 / 班2=F+D+C
const hanColor = { '班1':'FFBBDEFB', '班2':'FFFFE0B2' };
const mapsUrl = (name, addr) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + addr);

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('osusowake_posting_takatsuki.xlsx');
  ['今日2000枚_重点店舗','2000枚_重点店舗','3000枚_配布先確定'].forEach(nm => { const w=wb.getWorksheet(nm); if(w) wb.removeWorksheet(w.id); });
  const ws = wb.addWorksheet('今日2000枚_重点店舗');

  ws.addRow(['【今日配る2,000枚】2班に分割（班1=A高槻駅 953枚／班2=F+D+C 1,047枚）・重点店から徒歩15分以内＋投函できる団地/築古優先']);
  ws.mergeCells('A1:K1');
  ws.getCell('A1').font = { name: FONT, bold: true, size: 14 };
  ws.getRow(1).height = 26;

  ws.addRow(['班','エリア','近くの重点店','投函先（建物）','住所','枚数','投函可否','メモ','地図','担当','配布状況']);
  ws.getRow(2).eachCell(c => { c.font={name:FONT,bold:true,color:{argb:'FFFFFFFF'}}; c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF37474F'}}; c.alignment={horizontal:'center',wrapText:true}; });

  rows.forEach(r => {
    const h = han[r[0]];
    const row = ws.addRow([h, areaName[r[0]], r[1], r[2], r[3], r[4], r[5], r[6], '地図で開く', '', '未']);
    row.eachCell({includeEmpty:true}, c => { c.font={name:FONT}; c.alignment={vertical:'middle',wrapText:true}; c.border={bottom:{style:'hair',color:{argb:'FFDDDDDD'}}}; });
    row.getCell(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:hanColor[h]}};
    row.getCell(1).font={name:FONT,bold:true}; row.getCell(1).alignment={horizontal:'center',vertical:'middle'};
    row.getCell(2).fill={type:'pattern',pattern:'solid',fgColor:{argb:clColor[r[0]]}};
    row.getCell(2).alignment={horizontal:'center',vertical:'middle'};
    row.getCell(6).alignment={horizontal:'right',vertical:'middle'};
    row.getCell(6).numFmt='#,##0"枚"'; row.getCell(6).font={name:FONT,bold:true};
    if (r[5].startsWith('⚠')) { row.getCell(7).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFE0B2'}}; row.getCell(7).font={name:FONT,bold:true,color:{argb:'FFE65100'}}; }
    else { row.getCell(7).font={name:FONT,color:{argb:'FF2E7D32'}}; }
    row.getCell(7).alignment={horizontal:'center',vertical:'middle'};
    const link = row.getCell(9);
    link.value = { text:'地図で開く', hyperlink: mapsUrl(r[2], r[3]) };
    link.font = { name:FONT, color:{argb:'FF1565C0'}, underline:true };
    link.alignment = { horizontal:'center', vertical:'middle' };
    row.getCell(11).alignment={horizontal:'center'};
  });
  const n = rows.length;
  const tot = ws.addRow(['','','','','合計', {formula:`SUM(F3:F${2+n})`}, '', '', '', '', '']);
  tot.getCell(6).numFmt='#,##0"枚"';
  tot.eachCell(c=>{ c.font={name:FONT,bold:true}; c.border={top:{style:'thin'}}; });
  tot.getCell(6).alignment={horizontal:'right'};

  ws.addRow([]);
  const hsub={}; rows.forEach(r=>{const h=han[r[0]];hsub[h]=(hsub[h]||0)+r[4];});
  const hr = ws.addRow(['班別小計： 班1(A高槻駅) '+hsub['班1']+'枚 ／ 班2(F+D+C) '+hsub['班2']+'枚　＝計2,000枚（今日）']);
  hr.getCell(1).font={name:FONT,bold:true}; ws.mergeCells(`A${hr.number}:K${hr.number}`);
  const sub={}; rows.forEach(r=>sub[r[0]]=(sub[r[0]]||0)+r[4]);
  const sr = ws.addRow(['エリア小計： '+Object.entries(sub).map(([k,v])=>`${areaName[k]} ${v}枚`).join(' ／ ')]);
  sr.getCell(1).font={name:FONT}; ws.mergeCells(`A${sr.number}:K${sr.number}`);

  ['■ 班分け','・班1＝A高槻駅エリア(953枚)：古曽部・北園・城北。駅北西に集中、徒歩で回れる。','・班2＝F土室/氷室+D津之江+C高垣(1,047枚)：移動あり、自転車/車。サブエリアごとに固めて回る。','■ ポスティング前提','・✅＝団地/築古で集合ポストに投函しやすい。⚠️＝築浅でオートロックの可能性→現地で集合ポストの投函可否を1棟見てから。','・「まるごと」=全戸。「○戸のうち○戸」=残り枚数で打ち止め。','・⚠️グリーンマークスがNGなら、その200枚は阪急ヒルズコート（団地・余力223戸）へ回す。','・QRはそのエリアの最寄り重点店。「チラシお断り」掲示・規約NGは投函しない。','■ 全体3,000枚との関係','・本日2,000枚＝重点店中心(班1+班2)。残り1,000枚は後日（E富田・B南平台・富田団地 などへ）。']
    .forEach(t => { const r=ws.addRow([t]); r.getCell(1).font={name:FONT,bold:/^■/.test(t)}; ws.mergeCells(`A${r.number}:K${r.number}`); });

  for (let i=3;i<=2+n;i++) ws.getCell(`K${i}`).dataValidation={type:'list',allowBlank:true,formulae:['"未,済,一部"']};

  [6,9,22,22,24,8,11,28,11,9,9].forEach((w,i)=>ws.getColumn(i+1).width=w);
  ws.views=[{state:'frozen',ySplit:2}];

  await wb.xlsx.writeFile('osusowake_posting_takatsuki.xlsx');
  const warn = rows.filter(r=>r[5].startsWith('⚠')).length;
  console.log('今日2000枚_重点店舗 作成 / 合計', rows.reduce((a,r)=>a+r[4],0), '枚 /', n, '建物 / ⚠️要確認', warn, '棟 / 小計', JSON.stringify(sub));
})();
