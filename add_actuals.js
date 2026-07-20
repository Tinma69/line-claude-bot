// 昨日の配布実績 記録シート
const ExcelJS = require('exceljs');
const FONT = 'Meiryo';

// [建物, 配布枚数(数値|''), 状態, メモ]
const NG = '投函禁止', OK = '配布済';
const rows = [
  // 計画用紙(A団地)で投函禁止だったところ
  ['高槻スカイハイツ', 0, NG, '★計画A団地。投函禁止'],
  ['ニチメン高槻グランドハイツ', 0, NG, '★計画A団地。投函禁止'],
  ['メゾン高槻古曽部', 0, NG, '★計画A団地。投函禁止'],
  ['高槻ビューハイツ槻の木', 0, NG, '★計画A団地。投函禁止'],
  ['ライオンズ高槻古曽部', 0, NG, '★計画A団地。投函禁止'],
  ['レオ高槻', 0, NG, '★計画A団地。投函禁止'],
  // 昨日 追加で配った（用紙外・現場で発見）
  ['レ・ジェイド', '', OK, '枚数未記入'],
  ['べヌール葵', '', OK, '枚数未記入'],
  ['プラウドシティ高槻シーズンレジデンス', '', OK, '枚数未記入'],
  ['グランレジェイド高槻', 28, OK, ''],
  ['ザ・パークハウス高槻', 38, OK, ''],
  ['グランドサリサ', 18, OK, ''],
  ['クレヴィア高槻サウスレジデンス', 57, OK, ''],
  ['la casa 高槻', 66, OK, ''],
  ['グランドール高槻', '', OK, '枚数未記入'],
  ['VIVRE高槻', 22, OK, ''],
  ['CHERRY AKUTA', 8, OK, ''],
  ['Mina Koti', 32, OK, ''],
  ['芥川マンション', 25, OK, ''],
  ['MIOビル芥川（旧:丹波パルネット）', '', OK, '枚数未記入'],
  ['エスペランズ芥川', '', OK, '枚数未記入'],
  ['シャーメゾン芥川', '', OK, '枚数未記入'],
  ['大和レジデンス高槻', 63, OK, ''],
  ['Shel Land', 10, OK, ''],
  ['エバーグリーン田中', '', OK, '枚数未記入'],
  ['アーバンパレス', 14, OK, ''],
  ['umiere高槻芥川', 18, OK, ''],
  ['シャトー芥川', 22, OK, ''],
  ['柳原第一パールマンション', 12, OK, ''],
  ['芥川グリーンハイツ', 16, OK, ''],
  ['芥川シティハイツ', 10, OK, ''],
  ['Excel Ⅱ', 14, OK, ''],
  ['ライオンズマンション高槻リバーサイド', 57, OK, ''],
  ['パークホームズ高槻殿町', 16, OK, ''],
  ['Sunlight Fuku', 17, OK, ''],
  ['カーサク芥川', 9, OK, ''],
  ['プロビナンス村橋', 19, OK, ''],
  ['Grand Cru芥川', 9, OK, ''],
  ['シーヴェシェン', 6, OK, ''],
  ['メゾン高槻', 11, OK, ''],
  ['Paffine芥川', 9, OK, ''],
  ['山﨑Mansion16 高槻芥川', 16, OK, ''],
  ['イトーピア高槻天神町', 0, NG, '投函禁止'],
  ['光栄ハイツ', 27, OK, ''],
  ['トレンディア高槻', 15, OK, ''],
  ['casa Mia', 8, OK, ''],
  ['チャルテ高槻天神', 10, OK, ''],
  ['クレール天神', 4, OK, ''],
  ['ワイズコート天神', 6, OK, ''],
  ['緑芥川ビル', 10, OK, ''],
  ['アップル古曽部', 10, OK, ''],
  ['Lago Drimajera古曽部', 36, OK, ''],
  ['光栄ハイツ古曽部2', 30, OK, ''],
  ['グリーンタウン', 21, OK, ''],
  ['Gran Avvews', 15, OK, ''],
  ['ベラヴィッタ古曽部', 10, OK, ''],
  ['HALLEY TAKATSUKI', 20, OK, ''],
  ['マンション一理塚', 10, OK, ''],
  ['バックス高槻古曽部', 11, OK, ''],
  ['HAL高槻弐番館', 9, OK, ''],
  ['パラッツォ', 0, NG, '投函禁止'],
  ['西島マンション', 3, OK, ''],
  ['シティコーポ真上', 18, OK, ''],
  ['ウエスコート', 9, OK, ''],
  ['Sunshine てんじんやま', 24, OK, ''],
  ['天川住宅', '', OK, '2・3・4・18〜28・29〜33棟（枚数未記入）'],
  ['高槻ローズハイツ', '', OK, '枚数未記入'],
  ['高槻センチュリーマンション', '', OK, '枚数未記入'],
];

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('osusowake_posting_takatsuki.xlsx');
  const w0 = wb.getWorksheet('昨日の配布実績'); if (w0) wb.removeWorksheet(w0.id);
  const ws = wb.addWorksheet('昨日の配布実績');

  ws.addRow(['ポスティング 配布実績（昨日）']);
  ws.mergeCells('A1:D1'); ws.getCell('A1').font={name:FONT,bold:true,size:14}; ws.getRow(1).height=24;
  ws.addRow(['#','建物','配布枚数','状態 / メモ']);
  ws.getRow(2).eachCell(c=>{c.font={name:FONT,bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF37474F'}};c.alignment={horizontal:'center'};});

  let i=0;
  rows.forEach(r=>{
    i++;
    const row = ws.addRow([i, r[0], r[1]===''?'':r[1], r[2]+(r[3]?'：'+r[3]:'')]);
    row.eachCell({includeEmpty:true},c=>{c.font={name:FONT};c.border={bottom:{style:'hair',color:{argb:'FFDDDDDD'}}};c.alignment={vertical:'middle',wrapText:true};});
    row.getCell(1).alignment={horizontal:'center'};
    row.getCell(3).alignment={horizontal:'right'}; row.getCell(3).numFmt='#,##0"枚"';
    if(r[2]===NG){ row.getCell(2).font={name:FONT,bold:true}; row.getCell(4).font={name:FONT,bold:true,color:{argb:'FFC62828'}}; row.getCell(2).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFCDD2'}}; }
    else { row.getCell(4).font={name:FONT,color:{argb:'FF2E7D32'}}; }
  });
  const last=ws.rowCount;
  const numFirst=3, numLast=last;
  const tot=ws.addRow(['','記載枚数の合計', {formula:`SUM(C${numFirst}:C${numLast})`}, '※枚数未記入・天川住宅は別']);
  tot.getCell(3).numFmt='#,##0"枚"'; tot.eachCell(c=>{c.font={name:FONT,bold:true};c.border={top:{style:'thin'}};}); tot.getCell(3).alignment={horizontal:'right'};

  ws.addRow([]);
  const ng = rows.filter(r=>r[2]===NG).map(r=>r[0]);
  ['■ 重要メモ',`・投函禁止 ${ng.length}棟：${ng.join('／')}`,'・うち6棟は計画用紙Aエリアの団地（古曽部団地群）。今後の計画から除外する。','・ザ・パークハウス/グランレジェイド/レ・ジェイド/クレヴィア/la casa 等は配布できた（オートロックでも集合ポスト投函可だった）。','・枚数未記入の建物（レ・ジェイド/べヌール葵/プラウドシティ/グランドール/MIOビル/エスペランズ/シャーメゾン/エバーグリーン田中/天川住宅/高槻ローズハイツ/高槻センチュリー）は実数を後で記入。']
    .forEach(t=>{const r=ws.addRow([t]);r.getCell(1).font={name:FONT,bold:/^■/.test(t)};ws.mergeCells(`A${r.number}:D${r.number}`);});

  [5,34,11,40].forEach((w,idx)=>ws.getColumn(idx+1).width=w);
  ws.views=[{state:'frozen',ySplit:2}];

  await wb.xlsx.writeFile('osusowake_posting_takatsuki.xlsx');
  const sum=rows.reduce((a,r)=>a+(typeof r[1]==='number'?r[1]:0),0);
  console.log('昨日の配布実績 作成 / 行数', rows.length, '/ 記載枚数合計', sum, '/ 投函禁止', ng.length, '棟');
})();
