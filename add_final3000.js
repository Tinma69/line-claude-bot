// 3000枚 配布先 確定リスト（建物レベル・フル住所＋Googleマップリンク）
const ExcelJS = require('exceljs');
const FONT = 'Meiryo';
const clColor = { 富田団地:'FFFFD54F', A:'FFFFCDD2', C:'FFC8E6C9', F:'FFFFF9C4', E:'FFFFE0B2', D:'FFBBDEFB', B:'FFE1BEE7' };

// [エリア, 建物名, フル住所, 枚数, 配り方/戸数メモ]
const rows = [
  ['富田団地','★UR富田団地','大阪府高槻市牧田町1',800,'約2,582戸／団地内の号棟を頭から。※管理事務所に投函可否を事前確認'],

  ['A','高槻スカイハイツ','大阪府高槻市古曽部町2-10-10',248,'248戸・まるごと'],
  ['A','ニチメン高槻グランドハイツ','大阪府高槻市古曽部町2-15-1',171,'171戸・まるごと'],
  ['A','メゾン高槻古曽部','大阪府高槻市古曽部町2-6-1',81,'111戸のうち81戸（残り枚数で打ち止め）'],

  ['C','下田部団地（A・B・C）','大阪府高槻市登町12',500,'1,140戸／団地の頭から500戸ぶん'],

  ['F','シャルマンコーポ摂津富田','大阪府高槻市大畑町21-1',283,'283戸・まるごと'],
  ['F','摂津マンションB棟','大阪府高槻市大畑町2-7',117,'176戸のうち117戸（残り枚数で打ち止め）'],

  ['E','ライオンズマンション高槻','大阪府高槻市富田町1-7-7',106,'106戸・まるごと'],
  ['E','高槻セントポリア','大阪府高槻市栄町4丁目',73,'73戸・まるごと（番地は現地確認）'],
  ['E','翠が丘団地','大阪府高槻市富田町1-32-7',56,'56戸・まるごと'],
  ['E','コスモ高槻センターコート','大阪府高槻市富田町1-14-9',54,'54戸・まるごと'],
  ['E','ユニハイム高槻富田丘','大阪府高槻市富田丘町13-15',11,'44戸のうち11戸（残り枚数で打ち止め）'],

  ['D','府営高槻深沢住宅','大阪府高槻市深沢町2丁目',160,'団地（10棟）の頭から160戸ぶん'],
  ['D','メゾン津之江','大阪府高槻市津之江町3-1-1',50,'50戸・まるごと'],
  ['D','高槻ファミリーハイツA棟','大阪府高槻市城西町4-15',40,'40戸・まるごと'],

  ['B','サンハイツ高槻','大阪府高槻市別所本町17',250,'460戸／団地の頭から250戸ぶん'],
];

const areaName = { 富田団地:'富田団地', A:'A 高槻駅', C:'C 高垣', F:'F 土室・氷室', E:'E 富田', D:'D 津之江', B:'B 南平台' };
const mapsUrl = (name, addr) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + addr);

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('osusowake_posting_takatsuki.xlsx');
  if (wb.getWorksheet('3000枚_配布先確定')) wb.removeWorksheet(wb.getWorksheet('3000枚_配布先確定').id);
  const ws = wb.addWorksheet('3000枚_配布先確定');

  ws.addRow(['チラシ3,000枚 配布先 確定リスト（住所・地図リンク付き／団地の集合ポスト優先・戸数の多い順に頭から）']);
  ws.mergeCells('A1:H1');
  ws.getCell('A1').font = { name: FONT, bold: true, size: 14 };
  ws.getRow(1).height = 26;

  ws.addRow(['エリア','投函先（建物）','住所','枚数','配り方・戸数','地図','担当','配布状況']);
  ws.getRow(2).eachCell(c => { c.font={name:FONT,bold:true,color:{argb:'FFFFFFFF'}}; c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF37474F'}}; c.alignment={horizontal:'center',wrapText:true}; });

  rows.forEach(r => {
    const row = ws.addRow([areaName[r[0]], r[1], r[2], r[3], r[4], '地図で開く', '', '未']);
    row.eachCell({includeEmpty:true}, c => { c.font={name:FONT}; c.alignment={vertical:'middle',wrapText:true}; c.border={bottom:{style:'hair',color:{argb:'FFDDDDDD'}}}; });
    row.getCell(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:clColor[r[0]]}};
    row.getCell(1).alignment={horizontal:'center',vertical:'middle'};
    row.getCell(4).alignment={horizontal:'right',vertical:'middle'};
    row.getCell(4).numFmt='#,##0"枚"'; row.getCell(4).font={name:FONT,bold:true};
    const link = row.getCell(6);
    link.value = { text:'地図で開く', hyperlink: mapsUrl(r[1], r[2]) };
    link.font = { name:FONT, color:{argb:'FF1565C0'}, underline:true };
    link.alignment = { horizontal:'center', vertical:'middle' };
    row.getCell(8).alignment={horizontal:'center'};
  });
  const n = rows.length;
  const tot = ws.addRow(['','','合計', {formula:`SUM(D3:D${2+n})`}, '', '', '', '']);
  tot.getCell(4).numFmt='#,##0"枚"';
  tot.eachCell(c=>{ c.font={name:FONT,bold:true}; c.border={top:{style:'thin'}}; });
  tot.getCell(4).alignment={horizontal:'right'};

  ws.addRow([]);
  ['■ 進め方','・上から順に、団地の集合ポストへまとめて投函。「地図で開く」をタップ＝Googleマップで現地へ。','・「まるごと」=その建物の全戸。「○戸のうち○戸」=残り枚数で打ち止め（次の建物に進まない）。','・QRはそのエリアの最寄り登録店を入れる。「チラシお断り」掲示・規約NGは投函しない。','・🚩富田団地はUR管理事務所に投函可否を事前確認。NGなら富田町・栄町の他マンションへ振替。']
    .forEach(t => { const r=ws.addRow([t]); r.getCell(1).font={name:FONT,bold:/^■/.test(t)}; ws.mergeCells(`A${r.number}:H${r.number}`); });

  for (let i=3;i<=2+n;i++) ws.getCell(`H${i}`).dataValidation={type:'list',allowBlank:true,formulae:['"未,済,一部"']};

  [9,24,26,8,30,11,9,9].forEach((w,i)=>ws.getColumn(i+1).width=w);
  ws.views=[{state:'frozen',ySplit:2}];

  await wb.xlsx.writeFile('osusowake_posting_takatsuki.xlsx');
  console.log('確定リスト(住所・地図リンク付き)更新 / 合計', rows.reduce((a,r)=>a+r[3],0), '枚 /', n, '建物');
})();
