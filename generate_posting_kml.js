// おすそわけ ポスティング用 KML 生成（高槻17店・徒歩10分=800m / 15分=1200m リング）
// Google マイマップにインポート可能。クラスター別に色分け。
const fs = require('fs');

const stores = [
  // cluster, name, lat, lng
  ['A', '炒飯専門店91kuppin', 34.8516588, 135.62729],
  ['A', 'ピケのチーズケーキ屋', 34.850643157959, 135.621597290039],
  ['A', 'レモンド', 34.8498497009277, 135.623138427734],
  ['A', 'BAR 椿', 34.8501942, 135.6206394],
  ['A', 'ワイン食堂バルバ', 34.846363067627, 135.618927001953],
  ['A', 'ベーカリー ビーチアイランド高槻', 34.8533464, 135.6144381],
  ['A', '自家焙煎コーヒー マウンテン', 34.8521957397461, 135.614822387695],
  ['D', 'anpan', 34.8397064208984, 135.606536865234],
  ['D', 'LUCCA', 34.8401627317897, 135.608036407711],
  ['C', 'Bake House Nagomi〜和〜', 34.8591134285003, 135.636460552612],
  ['B', 'づぼら食堂', 34.8584632873535, 135.595947265625],
  ['B', 'ベーカリーレヴェイユ', 34.8594551086426, 135.585998535156],
  ['E', '珈琲館松屋', 34.83594, 135.592755],
  ['E', 'PEEKABOO', 34.836498260498, 135.588256835938],
  ['F', 'Taps BURGER SHOP', 34.8506995106943, 135.590335967271],
  ['F', '料理家三', 34.8531992, 135.5765007],
  ['F', 'パティシエ コウタロウ', 34.8503303527832, 135.583160400391],
];

// クラスター定義（色は KML aabbggrr）
const clusters = {
  A: { name: '高槻駅 中心・北西', color: 'ff0000ff', icon: 'red' },     // 赤
  E: { name: '富田・摂津富田駅', color: 'ff008cff', icon: 'orange' },   // 橙
  D: { name: '津之江',           color: 'ffff0000', icon: 'blue' },     // 青
  F: { name: '土室・上土室・氷室', color: 'ff00ddff', icon: 'ylw' },    // 黄
  C: { name: '高垣（阪急高槻市駅南）', color: 'ff00b000', icon: 'grn' }, // 緑
  B: { name: '南平台（北部・山手）', color: 'ffc800a0', icon: 'purple' },// 紫
};

const iconHref = {
  red: 'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png',
  orange: 'http://maps.google.com/mapfiles/kml/pushpin/orange-pushpin.png',
  blue: 'http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png',
  ylw: 'http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png',
  grn: 'http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png',
  purple: 'http://maps.google.com/mapfiles/kml/pushpin/purple-pushpin.png',
};

// 半径 r(m) の円ポリゴン座標を返す
function circle(lat, lng, r, seg = 60) {
  const dLat = r / 111320;
  const dLng = r / (111320 * Math.cos(lat * Math.PI / 180));
  const pts = [];
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * 2 * Math.PI;
    const plat = lat + dLat * Math.cos(t);
    const plng = lng + dLng * Math.sin(t);
    pts.push(`${plng.toFixed(6)},${plat.toFixed(6)},0`);
  }
  return pts.join(' ');
}

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
<name>おすそわけ ポスティング範囲（高槻17店）</name>
<description>徒歩10分=800m / 徒歩15分=1200m リング・クラスター色分け</description>
`;

// スタイル定義
for (const [key, c] of Object.entries(clusters)) {
  kml += `<Style id="pin_${key}"><IconStyle><scale>1.1</scale><Icon><href>${iconHref[c.icon]}</href></Icon></IconStyle></Style>\n`;
  kml += `<Style id="ring800_${key}"><LineStyle><color>${c.color}</color><width>2.4</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>\n`;
  kml += `<Style id="ring1200_${key}"><LineStyle><color>${c.color}</color><width>1.1</width></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>\n`;
}

// フォルダ1：店舗ピン
kml += `<Folder><name>① 店舗ピン（17店・クラスター別）</name>\n`;
for (const [cl, name, lat, lng] of stores) {
  kml += `<Placemark><name>${esc(name)}</name><description>クラスター${cl}：${clusters[cl].name}</description><styleUrl>#pin_${cl}</styleUrl><Point><coordinates>${lng},${lat},0</coordinates></Point></Placemark>\n`;
}
kml += `</Folder>\n`;

// フォルダ2：徒歩10分リング
kml += `<Folder><name>② 徒歩10分リング（800m）</name>\n`;
for (const [cl, name, lat, lng] of stores) {
  kml += `<Placemark><name>${esc(name)} 800m</name><styleUrl>#ring800_${cl}</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>${circle(lat, lng, 800)}</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>\n`;
}
kml += `</Folder>\n`;

// フォルダ3：徒歩15分リング
kml += `<Folder><name>③ 徒歩15分リング（1200m）</name>\n`;
for (const [cl, name, lat, lng] of stores) {
  kml += `<Placemark><name>${esc(name)} 1200m</name><styleUrl>#ring1200_${cl}</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>${circle(lat, lng, 1200)}</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>\n`;
}
kml += `</Folder>\n`;

kml += `</Document>\n</kml>\n`;

fs.writeFileSync('osusowake_posting_takatsuki.kml', kml, 'utf8');
console.log('KML 出力完了: osusowake_posting_takatsuki.kml');
console.log('店舗数:', stores.length, '/ フィーチャ数:', stores.length * 3);
