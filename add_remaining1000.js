// 残り1000枚（後日）配布先リスト：E富田＋高槻駅周辺マンション＋B南平台
const ExcelJS = require('exceljs');
const FONT = 'Meiryo';
const clColor = { E:'FFFFE0B2', 'A駅周辺':'FFFFCDD2', B:'FFE1BEE7' };

// [区分, 近くの登録店, 建物名, 住所, 枚数, 投函可否, メモ]
const rows = [
  // E 富田（珈琲館松屋・PEEKABOO 徒歩1〜14分・全部 団地/古め＝投函しやすい）= 440
  ['E','珈琲館松屋(富田町1)','ライオンズマンション高槻','大阪府高槻市富田町1-7-7',106,'✅','徒歩2分'],
  ['E','珈琲館松屋(富田町1)','翠が丘団地','大阪府高槻市富田町1-32-7',56,'✅団地','徒歩2分'],
  ['E','珈琲館松屋(富田町1)','コスモ高槻センターコート','大阪府高槻市富田町1-14-9',54,'✅','徒歩2分'],
  ['E','珈琲館松屋(富田町1)','コスモ高槻パークステージ','大阪府高槻市富田町1-30-21',45,'✅','徒歩2分'],
  ['E','PEEKABOO(富田丘町)','ユニハイム高槻富田丘','大阪府高槻市富田丘町13-15',44,'✅','徒歩1分'],
  ['E','珈琲館松屋(富田町1)','ハイム富田','大阪府高槻市富田町1-31-1',40,'✅','徒歩2分'],
  ['E','PEEKABOO(富田丘町)','ユニーブル高槻富田丘','大阪府高槻市富田丘町9-3',28,'✅','徒歩1分'],
  ['E','珈琲館松屋(昭和台町)','プレアール昭和台','大阪府高槻市昭和台町1-4-10',27,'✅','徒歩12分'],
  ['E','珈琲館松屋(富田町6)','ウェルシーコート富田','大阪府高槻市富田町6-15-2',24,'✅','徒歩14分'],
  ['E','珈琲館松屋(富田町1)','プラザ富田','大阪府高槻市富田町1-13-25',16,'✅','徒歩2分'],

  // A 高槻駅周辺（今日未使用ぶん・小〜中規模分譲中心）= 468
  ['A駅周辺','poko/芥川/北園 徒歩圏','アルス高槻','大阪府高槻市古曽部町1-8-4',71,'✅','古め'],
  ['A駅周辺','炒飯91kuppin(松原町)','ファミール高槻フェリーク','大阪府高槻市松原町4-5',48,'⚠要確認','分譲・要現地確認'],
  ['A駅周辺','manu a manu/バルバ(城北町)','アソシア高槻 St-1','大阪府高槻市城北町1-1-2',42,'⚠要確認','分譲・要現地確認'],
  ['A駅周辺','芥川町','ザ・ガーデンスイート','大阪府高槻市芥川町4-6-23',33,'⚠要確認','分譲・要現地確認'],
  ['A駅周辺','ビーチアイランド/マウンテン(芥川町2)','グランドール高槻','大阪府高槻市芥川町2-13-26',32,'✅','古め'],
  ['A駅周辺','ピケ/レモンド(北園町)','プレディア高槻北園町','大阪府高槻市北園町4-8',30,'⚠要確認','分譲・要現地確認'],
  ['A駅周辺','ピケ/レモンド(北園町)','ファミール高槻北園町','大阪府高槻市北園町2-21',28,'⚠要確認','分譲・要現地確認'],
  ['A駅周辺','ビーチアイランド/マウンテン(芥川町2)','JOY&コーポ芥川','大阪府高槻市芥川町2-24-5',26,'✅','古め'],
  ['A駅周辺','ピケ/レモンド(北園町)','高槻北園町アーバンコンフォート','大阪府高槻市北園町4-1',25,'⚠要確認','分譲・要現地確認'],
  ['A駅周辺','ビーチアイランド/マウンテン(芥川町1)','トレンディア高槻','大阪府高槻市芥川町1-13-19',24,'✅','古め'],
  ['A駅周辺','poko(古曽部町1)','藤和シティホームズ高槻駅前','大阪府高槻市古曽部町1-2-20',24,'⚠要確認','分譲・要現地確認'],
  ['A駅周辺','BAR椿(高槻町/大手町)','シャトウ高槻','大阪府高槻市大手町4-21',21,'✅','古め'],
  ['A駅周辺','BAR椿(高槻町/大手町)','ハイツ大手町2','大阪府高槻市大手町3-18',19,'✅','古め'],
  ['A駅周辺','ビーチアイランド(芥川町4)','メゾン高槻','大阪府高槻市芥川町4-5-18',15,'✅','古め'],
  ['A駅周辺','BAR椿(高槻町/大手町)','ハイツ大手町1','大阪府高槻市大手町3-19',15,'✅','古め'],
  ['A駅周辺','poko(古曽部町2)','レオ高槻（残り）','大阪府高槻市古曽部町2-15-8',15,'✅','本日63投函済の残り15'],

  // B 南平台（づぼら・レヴェイユ 徒歩6分・大型は2棟のみ→残りは戸建て面配り）= 46＋面配り
  ['B','レヴェイユ(南平台4)','ブードワールビル','大阪府高槻市南平台4-15-22',32,'✅','徒歩6分'],
  ['B','レヴェイユ(南平台3)','南平台ヤタヒルズ2','大阪府高槻市南平台3-27-30',14,'✅','徒歩6分'],
  ['B','づぼら/レヴェイユ(南平台1〜5)','南平台の戸建て・小規模アパートに面配り','大阪府高槻市南平台1〜5丁目',46,'✅戸建','大型が無いので戸建て中心に面で'],
];

const grpName = { E:'E 富田', 'A駅周辺':'A 高槻駅周辺', B:'B 南平台' };
const mapsUrl = (name, addr) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ' ' + addr);

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('osusowake_posting_takatsuki.xlsx');
  const w0 = wb.getWorksheet('残り1000枚'); if (w0) wb.removeWorksheet(w0.id);
  const ws = wb.addWorksheet('残り1000枚');

  ws.addRow(['【残り1,000枚（後日）】E富田＋高槻駅周辺マンション＋B南平台／全体3,000の本日2,000以外']);
  ws.mergeCells('A1:I1');
  ws.getCell('A1').font = { name: FONT, bold: true, size: 14 };
  ws.getRow(1).height = 26;

  ws.addRow(['区分','近くの登録店','投函先（建物）','住所','枚数','投函可否','メモ','地図','配布状況']);
  ws.getRow(2).eachCell(c => { c.font={name:FONT,bold:true,color:{argb:'FFFFFFFF'}}; c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF37474F'}}; c.alignment={horizontal:'center',wrapText:true}; });

  rows.forEach(r => {
    const row = ws.addRow([grpName[r[0]], r[1], r[2], r[3], r[4], r[5], r[6], '地図で開く', '未']);
    row.eachCell({includeEmpty:true}, c => { c.font={name:FONT}; c.alignment={vertical:'middle',wrapText:true}; c.border={bottom:{style:'hair',color:{argb:'FFDDDDDD'}}}; });
    row.getCell(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:clColor[r[0]]}};
    row.getCell(1).alignment={horizontal:'center',vertical:'middle'};
    row.getCell(5).alignment={horizontal:'right',vertical:'middle'}; row.getCell(5).numFmt='#,##0"枚"'; row.getCell(5).font={name:FONT,bold:true};
    if (r[5].startsWith('⚠')) { row.getCell(6).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFE0B2'}}; row.getCell(6).font={name:FONT,bold:true,color:{argb:'FFE65100'}}; }
    else { row.getCell(6).font={name:FONT,color:{argb:'FF2E7D32'}}; }
    row.getCell(6).alignment={horizontal:'center',vertical:'middle'};
    const link=row.getCell(8); link.value={text:'地図で開く',hyperlink:mapsUrl(r[2],r[3])}; link.font={name:FONT,color:{argb:'FF1565C0'},underline:true}; link.alignment={horizontal:'center'};
    row.getCell(9).alignment={horizontal:'center'};
  });
  const n=rows.length;
  const tot=ws.addRow(['','','','合計',{formula:`SUM(E3:E${2+n})`},'','','','']);
  tot.getCell(5).numFmt='#,##0"枚"'; tot.eachCell(c=>{c.font={name:FONT,bold:true};c.border={top:{style:'thin'}};}); tot.getCell(5).alignment={horizontal:'right'};

  ws.addRow([]);
  const sub={}; rows.forEach(r=>sub[r[0]]=(sub[r[0]]||0)+r[4]);
  const sr=ws.addRow(['区分小計： '+Object.entries(sub).map(([k,v])=>`${grpName[k]} ${v}枚`).join(' ／ ')]);
  sr.getCell(1).font={name:FONT,bold:true}; ws.mergeCells(`A${sr.number}:I${sr.number}`);
  ['■ 注意','・E富田は全部 団地/古め＝投函しやすい（◎）。','・A高槻駅周辺は今日の団地を使い切った後の小〜中規模分譲が中心。⚠は築浅でオートロックの可能性→集合ポスト投函可否を現地で確認、NGは飛ばす。','・B南平台は大型が2棟だけ。残りは南平台1〜5の戸建て・小規模に面配り。','・本日2,000＋この1,000＝3,000で完了。']
    .forEach(t=>{const r=ws.addRow([t]);r.getCell(1).font={name:FONT,bold:/^■/.test(t)};ws.mergeCells(`A${r.number}:I${r.number}`);});
  for(let i=3;i<=2+n;i++) ws.getCell(`I${i}`).dataValidation={type:'list',allowBlank:true,formulae:['"未,済,一部"']};
  [11,24,28,24,8,11,22,11,9].forEach((w,i)=>ws.getColumn(i+1).width=w);
  ws.views=[{state:'frozen',ySplit:2}];

  await wb.xlsx.writeFile('osusowake_posting_takatsuki.xlsx');
  console.log('残り1000枚 作成 / 合計', rows.reduce((a,r)=>a+r[4],0), '枚 / 小計', JSON.stringify(sub));
})();
