// 3,000枚 配布計画タブを追加
const ExcelJS = require('exceljs');
const FONT = 'Meiryo';
const clColor = { 富田団地:'FFFFD54F', A:'FFFFCDD2', E:'FFFFE0B2', D:'FFBBDEFB', F:'FFFFF9C4', C:'FFC8E6C9', B:'FFE1BEE7' };

// [クラスター, エリア, 枚数, 人数, 主な投函先(団地・建物)]
const plan = [
  ['富田団地','牧田町（UR富田団地）',800,2,'★UR富田団地 約2,582戸に集中投函（1か所で大量消化＝最効率）。※UR管理事務所に投函可否を事前確認'],
  ['A','高槻駅 中心・北西',500,2,'古曽部団地群（スカイハイツ248/グランドハイツ171/メゾン111/ビューハイツ102）＋駅周辺M'],
  ['C','高垣（＋登町・宮野町）',500,2,'下田部団地1,140 / 大和サニーハイツ412'],
  ['F','土室・氷室',400,1,'大畑町 摂津マンション群（約647）/阪急ヒルズコート/グリーンマークス200'],
  ['E','富田・摂津富田駅',300,1,'ライオンズM高槻106/高槻セントポリア73/翠が丘団地56/コスモ高槻'],
  ['D','津之江',250,1,'府営高槻深沢住宅/メゾン津之江50/高槻ファミリーハイツ'],
  ['B','南平台',250,1,'サンハイツ高槻460/朝日プラザ126'],
];

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('osusowake_posting_takatsuki.xlsx');
  if (wb.getWorksheet('配布計画3000枚')) wb.removeWorksheet(wb.getWorksheet('配布計画3000枚').id);
  const ws = wb.addWorksheet('配布計画3000枚');

  ws.addRow(['チラシ3,000枚 配布計画（10人／1戸=1枚・団地の集合ポスト優先・富田団地を主役に）']);
  ws.mergeCells('A1:E1');
  ws.getCell('A1').font = { name: FONT, bold: true, size: 14 };
  ws.getRow(1).height = 26;

  const head = ['エリア','エリア名','枚数','担当人数','主な投函先（団地・大型マンション優先）'];
  ws.addRow(head);
  ws.getRow(2).eachCell(c => { c.font={name:FONT,bold:true,color:{argb:'FFFFFFFF'}}; c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF37474F'}}; c.alignment={horizontal:'center',wrapText:true}; });

  plan.forEach(r => {
    const row = ws.addRow([r[0], r[1], r[2], r[3], r[4]]);
    row.eachCell({includeEmpty:true}, c => { c.font={name:FONT}; c.alignment={vertical:'middle',wrapText:true}; c.border={bottom:{style:'hair',color:{argb:'FFCCCCCC'}}}; });
    row.getCell(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:clColor[r[0]]}};
    row.getCell(1).alignment={horizontal:'center',vertical:'middle'};
    row.getCell(3).alignment={horizontal:'right',vertical:'middle'};
    row.getCell(3).numFmt='#,##0"枚"';
    row.getCell(3).font={name:FONT,bold:true};
    row.getCell(4).alignment={horizontal:'center',vertical:'middle'};
    row.getCell(4).numFmt='0"人"';
    row.height = 34;
  });
  const n = plan.length;
  const tot = ws.addRow(['計','6エリア', {formula:`SUM(C3:C${2+n})`}, {formula:`SUM(D3:D${2+n})`}, '']);
  tot.getCell(3).numFmt='#,##0"枚"'; tot.getCell(4).numFmt='0"人"';
  tot.eachCell(c=>{ c.font={name:FONT,bold:true}; c.border={top:{style:'thin'}}; c.alignment={horizontal:'center'}; });
  tot.getCell(3).alignment={horizontal:'right'};

  ws.addRow([]);
  const notes = [
    '■ 進め方',
    '・1戸=1枚。団地・大型マンションの集合ポストにまとめて投函＝手間あたりのリーチ最大。',
    '・各エリアとも「想定マンション密度=高/中」の町丁目→大型団地から着手（建物リスト投函向けタブ参照）。',
    '・1人約300枚＝集合ポスト中心なら2〜3時間目安。',
    '・チラシのQRは“そのエリアの最寄り登録店”を入れる（近所で使える感を出す）。',
    '・「チラシお断り」掲示・管理規約NGのマンションには入れない。築浅め（グリーンマークス等）はオートロック要現地確認。',
    '■ もっと効率を上げたい場合',
    '・参考：UR富田団地（牧田町・約2,582戸）を足せば1か所で大量消化可。指定エリア外なので入れるかは要判断。',
  ];
  notes.forEach(t => { const r = ws.addRow([t]); r.getCell(1).font={name:FONT, bold:/^■/.test(t)}; ws.mergeCells(`A${r.number}:E${r.number}`); });

  [8,22,9,9,60].forEach((w,i)=>ws.getColumn(i+1).width=w);
  ws.views=[{state:'frozen',ySplit:2}];

  await wb.xlsx.writeFile('osusowake_posting_takatsuki.xlsx');
  console.log('配布計画3000枚 追加完了');
})();
