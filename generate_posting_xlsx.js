// おすそわけ ポスティング区割りシート（高槻17店）
const ExcelJS = require('exceljs');

const FONT = 'Meiryo';

// [クラスター, 優先, 最寄り登録店, 町丁目, 圏内, マンション密度, 備考]
const rows = [
  // A 高槻駅 中心・北西（最優先・7店密集）
  ['A',1,'A 高槻駅(7店)','芥川町2丁目','徒歩10分(800m)','高','ビーチアイランド/マウンテン直近・最重要'],
  ['A',1,'A 高槻駅(7店)','芥川町1丁目','徒歩10分(800m)','高',''],
  ['A',1,'A 高槻駅(7店)','芥川町3丁目','徒歩10分(800m)','高',''],
  ['A',1,'A 高槻駅(7店)','芥川町4丁目','徒歩10分(800m)','高',''],
  ['A',1,'A 高槻駅(7店)','城北町1丁目','徒歩10分(800m)','高','ワイン食堂バルバ'],
  ['A',1,'A 高槻駅(7店)','城北町2丁目','徒歩10分(800m)','高',''],
  ['A',1,'A 高槻駅(7店)','北園町','徒歩10分(800m)','高','ピケ/レモンド'],
  ['A',1,'A 高槻駅(7店)','高槻町','徒歩10分(800m)','高','BAR椿'],
  ['A',1,'A 高槻駅(7店)','松原町','徒歩10分(800m)','高','炒飯91kuppin'],
  ['A',1,'A 高槻駅(7店)','白梅町','徒歩10分(800m)','高','駅前マンション密'],
  ['A',1,'A 高槻駅(7店)','紺屋町','徒歩10分(800m)','高',''],
  ['A',1,'A 高槻駅(7店)','大手町','徒歩10分(800m)','高',''],
  ['A',1,'A 高槻駅(7店)','古曽部町1丁目','徒歩10分(800m)','中',''],
  ['A',1,'A 高槻駅(7店)','古曽部町2丁目','徒歩10分(800m)','中',''],
  ['A',2,'A 高槻駅(7店)','出丸町','徒歩10〜15分(1200m)','中',''],
  ['A',2,'A 高槻駅(7店)','京口町','徒歩10〜15分(1200m)','中',''],
  ['A',2,'A 高槻駅(7店)','城内町','徒歩10〜15分(1200m)','中',''],
  ['A',2,'A 高槻駅(7店)','野見町','徒歩10〜15分(1200m)','中',''],
  ['A',2,'A 高槻駅(7店)','天神町','徒歩10〜15分(1200m)','中',''],
  ['A',2,'A 高槻駅(7店)','桃園町','徒歩10〜15分(1200m)','中',''],
  ['A',2,'A 高槻駅(7店)','八丁畷町','徒歩10〜15分(1200m)','中',''],
  ['A',2,'A 高槻駅(7店)','千歳町','徒歩10〜15分(1200m)','中',''],

  // E 富田・摂津富田駅（団地・公団多＝高効率）
  ['E',1,'E 富田(2店)','富田町1丁目','徒歩10分(800m)','高','珈琲館松屋・団地多'],
  ['E',1,'E 富田(2店)','富田町2丁目','徒歩10分(800m)','高',''],
  ['E',1,'E 富田(2店)','富田町3丁目','徒歩10分(800m)','高',''],
  ['E',1,'E 富田(2店)','富田町4丁目','徒歩10分(800m)','高',''],
  ['E',1,'E 富田(2店)','富田町5丁目','徒歩10分(800m)','高',''],
  ['E',1,'E 富田(2店)','富田町6丁目','徒歩10分(800m)','高',''],
  ['E',1,'E 富田(2店)','富田丘町','徒歩10分(800m)','高','PEEKABOO'],
  ['E',1,'E 富田(2店)','昭和台町1丁目','徒歩10分(800m)','高',''],
  ['E',1,'E 富田(2店)','昭和台町2丁目','徒歩10分(800m)','高',''],
  ['E',1,'E 富田(2店)','北昭和台町','徒歩10分(800m)','中',''],
  ['E',1,'E 富田(2店)','緑町','徒歩10分(800m)','中',''],
  ['E',1,'E 富田(2店)','栄町','徒歩10分(800m)','中',''],

  // D 津之江（高槻駅南西）
  ['D',1,'D 津之江(2店)','津之江町1丁目','徒歩10分(800m)','中','anpan/LUCCA直近'],
  ['D',1,'D 津之江(2店)','津之江町2丁目','徒歩10分(800m)','中',''],
  ['D',1,'D 津之江(2店)','津之江町3丁目','徒歩10分(800m)','中',''],
  ['D',1,'D 津之江(2店)','辻子1丁目','徒歩10分(800m)','中',''],
  ['D',1,'D 津之江(2店)','辻子2丁目','徒歩10分(800m)','中',''],
  ['D',1,'D 津之江(2店)','辻子3丁目','徒歩10分(800m)','中',''],
  ['D',1,'D 津之江(2店)','城西町','徒歩10分(800m)','中',''],
  ['D',1,'D 津之江(2店)','深沢町','徒歩10分(800m)','低',''],

  // F 土室・上土室・氷室（北東部・戸建主体＋点在）
  ['F',1,'F 土室・氷室(3店)','土室町','徒歩10分(800m)','中','パティシエ コウタロウ'],
  ['F',1,'F 土室・氷室(3店)','上土室','徒歩10分(800m)','中','料理家三'],
  ['F',1,'F 土室・氷室(3店)','氷室町2丁目','徒歩10分(800m)','中','Taps BURGER'],
  ['F',1,'F 土室・氷室(3店)','氷室町1丁目','徒歩10分(800m)','中',''],
  ['F',1,'F 土室・氷室(3店)','氷室町3丁目','徒歩10分(800m)','中',''],
  ['F',1,'F 土室・氷室(3店)','宮田町1丁目','徒歩10分(800m)','中','分譲・賃貸多め＝優先'],
  ['F',1,'F 土室・氷室(3店)','宮田町2丁目','徒歩10分(800m)','中','分譲・賃貸多め＝優先'],
  ['F',1,'F 土室・氷室(3店)','別所新町','徒歩10分(800m)','低',''],
  ['F',1,'F 土室・氷室(3店)','川添1丁目','徒歩10分(800m)','低',''],
  ['F',1,'F 土室・氷室(3店)','川添2丁目','徒歩10分(800m)','低',''],
  ['F',2,'F 土室・氷室(3店)','大畑町','徒歩10〜15分(1200m)','低',''],

  // C 高垣（阪急高槻市駅 南）
  ['C',1,'C 高垣(1店)','高垣町','徒歩10分(800m)','中','Bake House Nagomi'],
  ['C',1,'C 高垣(1店)','城南町','徒歩10分(800m)','中',''],
  ['C',1,'C 高垣(1店)','登町','徒歩10分(800m)','中',''],
  ['C',1,'C 高垣(1店)','紫町','徒歩10分(800m)','中',''],
  ['C',1,'C 高垣(1店)','宮野町','徒歩10分(800m)','中',''],
  ['C',1,'C 高垣(1店)','明田町','徒歩10分(800m)','低',''],

  // B 南平台（北部・山手・戸建団地中心）
  ['B',1,'B 南平台(2店)','南平台1丁目','徒歩10分(800m)','中','づぼら食堂'],
  ['B',1,'B 南平台(2店)','南平台2丁目','徒歩10分(800m)','低',''],
  ['B',1,'B 南平台(2店)','南平台3丁目','徒歩10分(800m)','低',''],
  ['B',1,'B 南平台(2店)','南平台4丁目','徒歩10分(800m)','低','ベーカリーレヴェイユ'],
  ['B',1,'B 南平台(2店)','南平台5丁目','徒歩10分(800m)','低',''],
  ['B',1,'B 南平台(2店)','別所本町','徒歩10分(800m)','低',''],
  ['B',1,'B 南平台(2店)','古曽部町3丁目','徒歩10分(800m)','低',''],
  ['B',1,'B 南平台(2店)','古曽部町4丁目','徒歩10分(800m)','低',''],
  ['B',1,'B 南平台(2店)','宮之川原1丁目','徒歩10分(800m)','低',''],
  ['B',1,'B 南平台(2店)','宮之川原2丁目','徒歩10分(800m)','低',''],
];

const stores = [
  ['炒飯専門店91kuppin','高槻市松原町7-4','A',34.8516588,135.62729],
  ['ピケのチーズケーキ屋','高槻市北園町13-23','A',34.850643,135.621597],
  ['レモンド','高槻市北園町18-1','A',34.8498497,135.623138],
  ['BAR 椿','高槻市高槻町11-21','A',34.8501942,135.6206394],
  ['ワイン食堂バルバ','高槻市城北町1-14-28','A',34.846363,135.618927],
  ['ベーカリー ビーチアイランド高槻','高槻市芥川町2-16-5','A',34.8533464,135.6144381],
  ['自家焙煎コーヒー マウンテン','高槻市芥川町2-8-21','A',34.8521957,135.614822],
  ['anpan','高槻市津之江町1-60-10','D',34.8397064,135.606537],
  ['LUCCA','高槻市津之江町1-39-16','D',34.8401627,135.608036],
  ['Bake House Nagomi〜和〜','高槻市高垣町4-4','C',34.8591134,135.636461],
  ['づぼら食堂','高槻市南平台1-2-54','B',34.8584633,135.595947],
  ['ベーカリーレヴェイユ','高槻市南平台4-3-6','B',34.8594551,135.585999],
  ['珈琲館松屋','高槻市富田町1-13-22','E',34.83594,135.592755],
  ['PEEKABOO','高槻市富田丘町6-14','E',34.8364983,135.588257],
  ['Taps BURGER SHOP','高槻市氷室町2-37-10','F',34.8506995,135.590336],
  ['料理家三','高槻市上土室5-34-1','F',34.8531992,135.5765007],
  ['パティシエ コウタロウ','高槻市土室町9-5','F',34.8503304,135.583160],
];

const clusterName = {
  A:'高槻駅 中心・北西', E:'富田・摂津富田駅', D:'津之江',
  F:'土室・上土室・氷室', C:'高垣（阪急高槻市駅南）', B:'南平台（北部・山手）',
};
const clusterColor = { A:'FFFFCDD2', E:'FFFFE0B2', D:'FFBBDEFB', F:'FFFFF9C4', C:'FFC8E6C9', B:'FFE1BEE7' };

const wb = new ExcelJS.Workbook();

// ===== Sheet1: 配布管理 =====
const ws = wb.addWorksheet('配布管理');
const headers = ['クラスター','優先','最寄り登録店','配布エリア(町丁目)','圏内目安','想定マンション密度','担当者','配布予定日','配布状況','備考'];
ws.addRow(['おすそわけ ポスティング区割り（高槻17店・徒歩10分=800m / 15分=1200m）']);
ws.mergeCells('A1:J1');
ws.getCell('A1').font = { name: FONT, bold: true, size: 14 };
ws.getCell('A1').alignment = { vertical: 'middle' };
ws.getRow(1).height = 26;
ws.addRow(headers);
const hr = ws.getRow(2);
hr.eachCell(c => {
  c.font = { name: FONT, bold: true, color: { argb: 'FFFFFFFF' } };
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF37474F' } };
  c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  c.border = { bottom: { style: 'thin' } };
});

rows.forEach(r => {
  const row = ws.addRow([r[0], r[1], r[2], r[3], r[4], r[5], '', '', '未', r[6]]);
  row.eachCell({ includeEmpty: true }, c => { c.font = { name: FONT }; c.border = { bottom: { style: 'hair', color: { argb: 'FFCCCCCC' } } }; });
  const fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: clusterColor[r[0]] } };
  row.getCell(1).fill = fill;
  row.getCell(1).alignment = { horizontal: 'center' };
  row.getCell(2).alignment = { horizontal: 'center' };
  row.getCell(5).alignment = { horizontal: 'center' };
  row.getCell(6).alignment = { horizontal: 'center' };
  row.getCell(9).alignment = { horizontal: 'center' };
  // 密度に色
  const d = r[5];
  row.getCell(6).font = { name: FONT, bold: true, color: { argb: d==='高'?'FFC62828':d==='中'?'FFEF6C00':'FF757575' } };
});

const widths = [9,5,16,18,18,10,10,12,9,28];
widths.forEach((w,i)=>ws.getColumn(i+1).width=w);
ws.views = [{ state: 'frozen', ySplit: 2 }];
ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: 10 } };

// 配布状況 ドロップダウン
const lastRow = rows.length + 2;
for (let r = 3; r <= lastRow; r++) {
  ws.getCell(`I${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"未,済,一部"'] };
}

// ===== Sheet2: 進捗サマリ =====
const ss = wb.addWorksheet('進捗サマリ');
ss.addRow(['クラスター別 進捗']);
ss.mergeCells('A1:E1');
ss.getCell('A1').font = { name: FONT, bold: true, size: 14 };
ss.getRow(1).height = 24;
ss.addRow(['コード','エリア','対象町丁目数','配布済','進捗率']);
ss.getRow(2).eachCell(c => { c.font = { name: FONT, bold: true, color:{argb:'FFFFFFFF'} }; c.fill = { type:'pattern', pattern:'solid', fgColor:{argb:'FF37474F'} }; c.alignment={horizontal:'center'}; });
const order = ['A','E','D','F','C','B'];
order.forEach(code => {
  const total = rows.filter(r=>r[0]===code).length;
  const ref = `配布管理!$A$3:$A$${lastRow}`;
  const statusRef = `配布管理!$I$3:$I$${lastRow}`;
  const row = ss.addRow([code, clusterName[code], total, { formula: `COUNTIFS(${ref},"${code}",${statusRef},"済")` }, null]);
  const rn = row.number;
  ss.getCell(`E${rn}`).value = { formula: `IF(C${rn}=0,0,D${rn}/C${rn})` };
  ss.getCell(`E${rn}`).numFmt = '0%';
  row.eachCell(c=>{ c.font={name:FONT}; });
  ss.getCell(`A${rn}`).fill = { type:'pattern', pattern:'solid', fgColor:{argb:clusterColor[code]} };
  ss.getCell(`A${rn}`).alignment={horizontal:'center'};
});
const totRow = ss.addRow(['計','—', { formula:`SUM(C3:C8)` }, { formula:`SUM(D3:D8)` }, null]);
const tn = totRow.number;
ss.getCell(`E${tn}`).value = { formula:`IF(C${tn}=0,0,D${tn}/C${tn})` };
ss.getCell(`E${tn}`).numFmt='0%';
totRow.eachCell(c=>{ c.font={name:FONT,bold:true}; c.border={top:{style:'thin'}}; });
[8,22,14,8,8].forEach((w,i)=>ss.getColumn(i+1).width=w);

// ===== Sheet3: 店舗マスタ =====
const ms = wb.addWorksheet('店舗マスタ17店');
ms.addRow(['#','店名','住所','クラスター','緯度','経度']);
ms.getRow(1).eachCell(c=>{ c.font={name:FONT,bold:true,color:{argb:'FFFFFFFF'}}; c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF37474F'}}; c.alignment={horizontal:'center'}; });
stores.forEach((s,i)=>{
  const row = ms.addRow([i+1, s[0], s[1], s[2], s[3], s[4]]);
  row.eachCell(c=>c.font={name:FONT});
  row.getCell(4).fill={type:'pattern',pattern:'solid',fgColor:{argb:clusterColor[s[2]]}};
  row.getCell(4).alignment={horizontal:'center'};
});
[4,26,30,9,12,12].forEach((w,i)=>ms.getColumn(i+1).width=w);
ms.views=[{state:'frozen',ySplit:1}];

wb.xlsx.writeFile('osusowake_posting_takatsuki.xlsx').then(()=>{
  console.log('xlsx 出力完了: osusowake_posting_takatsuki.xlsx');
  console.log('配布管理 行数(町丁目):', rows.length, '/ 店舗:', stores.length);
});
