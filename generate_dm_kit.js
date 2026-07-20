const fs = require("fs");

// [正式店名, IGハンドル, DMでの呼称]
// ===== 第1弾（56店・送信中）=====
const storesV1 = [
  // 居酒屋・バル（12）
  ["高槻地下酒場", "@takatsuki_chika_sakaba", "高槻地下酒場"],
  ["たご作 阪急高槻店", "@tagosaku_hankyutakatsuki", "たご作"],
  ["鶏処よしだ", "@toridokoro_yoshida", "鶏処よしだ"],
  ["吉鳥 JR高槻駅前店", "@kichho_jr_takatsuki", "吉鳥"],
  ["TORA鶏YA 高槻", "@toratoriya_takatsuki", "TORA鶏YA"],
  ["串あげ 草馬", "@kushiage_soma", "草馬"],
  ["串あげ 草馬 JR高槻店", "@kushiage_soma_jrtakatsuki", "草馬 JR高槻店"],
  ["居酒屋 WAtoWA", "@watowa_takatsuki", "WAtoWA"],
  ["RUDY STAND", "@rudystand_takatsuki", "RUDY STAND"],
  ["Shuval（シュバル）", "@shuval_takatsuki", "Shuval"],
  ["Wine.bar Apis", "@apiswine.bar", "Apis"],
  ["またふく 阪急高槻店", "@matafuku.hankyutakatsuki", "またふく"],
  // ランチ・定食・カレー・カフェ飯・弁当
  ["トライバルカリー", "@tribal_curry", "トライバルカリー"],
  ["ヴァスコ・ダ・ガマ 本店", "@vascodagama_honten", "ヴァスコ・ダ・ガマ"],
  ["808 Curry & Vegetable", "@delivegefarm_uo", "808 Curry & Vegetable"],
  ["熱帯食堂 高槻本店", "@nettai_staff", "熱帯食堂"],
  ["SHEEP かれー HOUSE", "@sheepcurryhouse", "SHEEP かれー HOUSE"],
  ["カトマンドゥカリーPUJA", "@takatsuki_puja_matsuzakaya", "PUJA"],
  ["#KOKUBAN", "@kokuban_tenjin", "KOKUBAN"],
  ["Le Coin Discret", "@lecoindiscret11.1", "Le Coin Discret"],
  ["nowa cafe", "@nowacafe_", "nowa cafe"],
  ["eatery SUN", "@eatery_sun", "eatery SUN"],
  ["MAKE E CAFE", "@make_e_cafe", "MAKE E CAFE"],
  ["珈琲屋ほっぺ", "@coffeeyahoppe", "珈琲屋ほっぺ"],
  ["小屋カフェ", "@koyacafetakatuki", "小屋カフェ"],
  ["LUCU CAFE", "@lucucafe", "LUCU CAFE"],
  ["6+E UNITED cafe", "@6_e_unitedcafe", "6+E UNITED cafe"],
  ["食堂椿 別館", "@shokudou_tsubaki_bekkann", "食堂椿"],
  ["あぶり肉丼 えんじゅう屋", "@aburinikudon", "えんじゅう屋"],
  ["一龍 A伍屋", "@a_5ya_ichiryu", "A伍屋"],
  ["テマヒマ", "@temahima.jp", "テマヒマ"],
  ["かごや", "@kagoya2017", "かごや"],
  ["pastacovo", "@pastacovo", "pastacovo"],
  ["-ICHI-いち-", "@ichi.shunsai1107", "-ICHI-いち-"],
  ["RICCIO 摂津富田店", "@riccio.cafe", "RICCIO"],
  ["キッチンたきざわ", "@kitchen.takizawa", "キッチンたきざわ"],
  // スイーツ・洋菓子・和菓子
  ["clove（クローヴ）", "@__clove1997", "clove"],
  ["SWEETS RIBOE", "@sweets_riboe", "RIBOE"],
  ["BAKE SHOP DOUDOU", "@doudou.bake", "DOUDOU"],
  ["LaLa-chocolat", "@lala_chocolat1021", "LaLa-chocolat"],
  ["ちゃりんこ喫茶10", "@kissa___ten", "ちゃりんこ喫茶10"],
  ["公園と、タルト", "@park_and_tart", "公園と、タルト"],
  ["Pâtisserie CanneLier", "@patisseriecannelier", "CanneLier"],
  ["COCONOMI", "@patisserie_coconomi", "COCONOMI"],
  ["berge お菓子の木", "@lenlen_ber", "berge お菓子の木"],
  ["Magasin de eclat", "@magasin_de_eclat", "Magasin de eclat"],
  ["パティシエールUTAKO", "@p.utako", "UTAKO"],
  ["Patisserie ENGRENAGE", "@engrenage5138", "ENGRENAGE"],
  ["Lembra", "@cafe_lembra", "Lembra"],
  ["DESSERT BOUQUET.大阪高槻", "@dessertbouquet_osaka.takatsuki", "DESSERT BOUQUET"],
  ["ピエスドデリス", "@piece_de_delice", "ピエスドデリス"],
  ["和菓子 薩喜庵", "@takatsuki.satsukian", "薩喜庵"],
  ["和菓子司 山茶菓", "@wagashi_sazanka", "山茶菓"],
  ["HELLO ベジおはぎ", "@hello_veggieohagi", "HELLOベジおはぎ"],
  // 惣菜・デリ・弁当専門
  ["肉のやまかわ", "@niku_yamakawa", "肉のやまかわ"],
  ["Puka Organics", "@pukaorganics", "Puka Organics"],
];

// ===== 第2弾（64店・新バッチ）=====
const storesV2 = [
  // カフェ・喫茶（チェーンは除外）
  ["カモセ珈琲焙煎所", "@kamosecoffee", "カモセ珈琲"],
  ["FIFTEEN COFFEE ROASTERS", "@fifteencoffeeroasters", "FIFTEEN COFFEE"],
  ["島珈琲 高槻店", "@shimacoffee", "島珈琲"],
  ["SALAM COFFEE", "@salamcoffee_stand", "SALAM COFFEE"],
  ["SPOOK COFFEE & BAKE", "@spook_coffeebake", "SPOOK"],
  ["SLIGHT COFFEE ROASTERY", "@slight.coffee.roastery", "SLIGHT COFFEE"],
  ["純喫茶モン", "@mon_junkissa", "純喫茶モン"],
  ["喫茶 時の砂", "@tokinosuna_cafe", "時の砂"],
  // 中華・和食（持ち帰り相性）
  ["餃子屋 藤", "@gyozaya.fuji", "餃子屋 藤"],
  ["中華料理 福宝", "@fubao_oishii", "福宝"],
  ["China Kitchen maomao", "@chinakitchenmaomao", "maomao"],
  ["麺屋 きん次郎", "@menya_kinjiro_takatsuki", "きん次郎"],
  ["手打ち蕎麦 あら木", "@soba.hananosato", "あら木"],
  ["ザ・テンプラバーおん 高槻店", "@temprabar_on1", "テンプラバーおん"],
  ["鰻の成瀬 高槻店", "@unagi_naruse_takatsuki", "鰻の成瀬"],
  // パン・和菓子・スイーツ専門
  ["ジュエボワット", "@jouetboite", "ジュエボワット"],
  ["Boulangerie Takamura", "@boulangerie_takamura", "Boulangerie Takamura"],
  ["もあんきゅい", "@magarimoins.cuit", "もあんきゅい"],
  ["あん小屋 どらサン", "@ankoya_dorasan", "あん小屋 どらサン"],
  ["mocche.", "@mocche_official", "mocche."],
  ["クレープとエスプレッソと高槻", "@crepe.espresso.takatsuki", "クレープとエスプレッソと高槻"],
  ["Lily PiPiCa", "@lilypipica.cafe", "Lily PiPiCa"],
  // 第3弾 お好み焼き・たこ焼き・鉄板
  ["お好み・鉄板焼 よしもと 高槻本店", "@okonomiyakiyoshimoto", "よしもと"],
  ["100円たこ焼き 高槻川西町", "@hyakuentakoyaki", "100円たこ焼き"],
  ["錦わらい 高槻店", "@waraitakatsuki", "錦わらい高槻店"],
  ["鉄板cuisine Feu", "@xiaogucong", "Feu"],
  // 第3弾 寿司・海鮮（チェーン除く）
  ["本まぐろ直売所 城北町店", "@honmagurochokubuy", "本まぐろ直売所"],
  ["高槻 山源", "@yamagen.takatsuki", "山源"],
  ["鮨芥", "@sushi.acta", "鮨芥"],
  ["居酒屋 希SAKU", "@izakayakisaku", "希SAKU"],
  // 第3弾 韓国
  ["韓国屋台 錦 NISHIKI 高槻店", "@nishiki.takatsuki", "NISHIKI"],
  ["OLIOLI", "@olioli_takatsuki", "OLIOLI"],
  ["韓国バル サラン 高槻店", "@saran_takatsuki", "サラン"],
  // 第3弾 タイ・ベトナム
  ["タイ料理 サバイサバイ", "@thaifood_sabaisabai", "サバイサバイ"],
  ["ホームチャ homcha", "@homcha_thai_cafe", "ホームチャ"],
  ["R Saï-gon", "@r.saigon103", "R Saï-gon"],
  // 第3弾 インド・ネパール
  ["Ganga", "@ganga_takatsuki", "Ganga"],
  ["ザ・ネクストキッチン", "@kittchenthenext", "ザ・ネクストキッチン"],
  // 第3弾 焼肉・ホルモン（15・量重視で全部）
  ["ホルモン焼肉 円蔵 高槻店", "@enzo_takatsuki", "円蔵"],
  ["焼肉ホルモン はまちゃん 高槻店", "@yakiniku_hamachan_takatsuki", "はまちゃん"],
  ["ハラミの向こう側 高槻本店", "@harami0916", "ハラミの向こう側"],
  ["ホルモンとハラミとわたし。", "@horuhara423", "ホルモンとハラミとわたし。"],
  ["焼肉しがらき 高槻", "@yakinikushigaraki", "しがらき"],
  ["焼肉 凪 -NAGI-", "@yakiniku__nagi", "凪"],
  ["炭火焼肉 しんちゃん 高槻店", "@shinchan_takatsuki", "しんちゃん"],
  ["焼肉 牛豊", "@yakiniku_gyuhou", "牛豊"],
  ["炭火焼肉 やまおか", "@yakiniku_yamaoka", "やまおか"],
  ["焼肉 三島", "@yakinikumishima", "三島"],
  ["炭火焼肉 もっくん 高槻店", "@yakiniku_mokkun_takatsuki", "もっくん"],
  ["焼肉よしおか", "@yakinikuyoshioka", "よしおか"],
  ["焼肉こじま", "@yakiniku_kojima1978", "こじま"],
  ["喜楽 大蔵司店", "@kiraku_daizouji", "喜楽"],
  ["24h無人ホルモン直売所 高槻城北町店", "@24h.horumon_takatuki_jyohoku", "24h無人ホルモン直売所"],
  // 第3弾 ラーメン（店舗単独11）
  ["つけ麺うまし", "@tsukemen_umashi", "つけ麺うまし"],
  ["食す〜kusu〜", "@kusu_tantanmen", "食す〜kusu〜"],
  ["担担麺 胡", "@yebisu_6556", "胡"],
  ["シビカラ担々麺 澤田商店 高槻店", "@sawada_shoten_takatsukiten", "澤田商店"],
  ["台流屋台 御気樂", "@tairyuyatai", "御気樂"],
  ["ラーメンはにわ家 高槻", "@ramen.haniwaya.takatsuki", "はにわ家"],
  ["いち花", "@ichihana187", "いち花"],
  ["老麺 田ぶち", "@ra_men.tabuchi", "田ぶち"],
  ["中村商店 高槻本店", "@nakamurahonten", "中村商店"],
  ["熟成豚骨ラーメン 一番軒 高槻店", "@1banken.takatsuki", "一番軒"],
  ["彩色ラーメンきんせい 高槻本店", "@kinsei.takatsuki.honten", "きんせい"],
];

// ===== 第3弾（33店・新バッチ2）=====
const storesV3 = [
  // 軽食・スイーツ・飲料・専門テイクアウト（14）
  ["RABBIT BAGELS 高槻店", "@rabbitbagels", "RABBIT BAGELS"],
  ["時差ぼけベーグル", "@tamae_pan", "時差ぼけベーグル"],
  ["かき氷とパフェ mikaku", "@mikaku_takatsuki", "mikaku"],
  ["かき氷専門店 えびす", "@ebisukakigoriten", "かき氷えびす"],
  ["21時にアイス 高槻店", "@21niice_takatsuki", "21時にアイス"],
  ["赫牛のアイス工房 上牧店", "@akaushi_no_icekobo", "赫牛のアイス工房"],
  ["元祖からあげ本舗 高槻店", "@daruma_oosakatakatuki", "元祖からあげ本舗"],
  ["花粒 高槻本店", "@hanatsubu_omusubi", "花粒"],
  ["おにぎり専門店 COROLY 高槻市駅前店", "@coroly.takatsukishiekimaeten", "COROLY"],
  ["おにぎり 星粒", "@hoshitsubu_r2k", "星粒"],
  ["京都古都果 高槻店", "@kotoka.takatsuki", "京都古都果"],
  ["ICHIBANYA FRUITS CAFE", "@ichibanya.fruits_cafe", "ICHIBANYA FRUITS CAFE"],
  ["旬果屋 フルーツスタンド", "@syunkayafruitstand", "旬果屋"],
  ["ねこのかえりみち", "@neko_kaerimichi", "ねこのかえりみち"],
  // イタリアン・洋食・フレンチ・ピザ・ステーキ（11）
  ["オステリア セーザモ", "@osteriasesamo", "オステリア セーザモ"],
  ["RESTAURANT&BAR LARGO", "@largo.2019", "LARGO"],
  ["PoeL kitchen 高槻店", "@poelkitchen_takatsuki", "PoeL kitchen"],
  ["bistro mon vieil ami（モナミ）", "@bistro_monami", "bistro モナミ"],
  ["フレンチバル COUCOU", "@frenchbarcoucou", "COUCOU"],
  ["Cafe&Bar FLAUTA", "@cafe.and.bar_flauta", "FLAUTA"],
  ["spanish bar & cafe NEUTRAL", "@cafe_neutral", "NEUTRAL"],
  ["T's Star Diner", "@tsstardiner", "T's Star Diner"],
  ["URGEステーキ", "@urge_steak", "URGEステーキ"],
  ["ピッツェリア スオナーレ SUONARE", "@suonare_takatsuki", "SUONARE"],
  ["Pulsultra", "@pulsultra415", "Pulsultra"],
  // 和食・うどん/そば・うなぎ・とんかつ・割烹（8）
  ["本格熟成うどん 一期一麺", "@ichigonodeai", "一期一麺"],
  ["きくの商店（旬菜旬魚きくの）", "@kikuno_unagi", "きくの商店"],
  ["炭火焼うなぎ 伊勢屋", "@iseya_unagi_takatsuki", "伊勢屋"],
  ["さんなんぼう", "@sannanbo_takatsuki", "さんなんぼう"],
  ["かつ乃 高槻店", "@tonkatsu_katsuno", "かつ乃"],
  ["日本料理 燈々庵", "@tou_tou_an", "燈々庵"],
  ["えい参", "@restaurant.eisan", "えい参"],
  ["くしや 鳥時々", "@kushiya_tori_tokidoki", "くしや 鳥時々"],
];

// ===== 第4弾（16店・食品小売/物販）=====
const storesV4 = [
  ["自然館 グリーンプラザ店", "@sizenkan.plaza", "自然館グリーンプラザ店"],
  ["ハローダイキョウ 高槻店", "@hellodaikyo", "ハローダイキョウ"],
  ["ハイポニカ野菜直売 ねっこラボ", "@neccolabo", "ねっこラボ"],
  ["安田農園", "@yasuda.nouen", "安田農園"],
  ["ベジ彩ファーム", "@vejisaifarm", "ベジ彩ファーム"],
  ["たかつきベリーファーム", "@takatsukiberryfarm", "たかつきベリーファーム"],
  ["高槻しいたけセンター", "@takatsuki.shiitake.center", "高槻しいたけセンター"],
  ["高槻森林観光センター", "@takatsuki_shinrin_k.c", "高槻森林観光センター"],
  ["八百浅", "@yaoasa", "八百浅"],
  ["肉屋 まがり 高槻店", "@nikuyamagari_takatsuki", "肉屋まがり"],
  ["榎本鮮魚店", "@enomoto_sengyo", "榎本鮮魚店"],
  ["魚政", "@uomasa_takatsuki", "魚政"],
  ["旬鮮家 仁丸", "@takatsuki.zinmaru", "仁丸"],
  ["acai nano", "@acai_nano", "acai nano"],
  ["川居精米所", "@kawaiseimaisyo", "川居精米所"],
  ["58 Gonpachi", "@gonpachi58", "58 Gonpachi"],
  ["高槻の納豆屋", "@nattoya7108", "高槻の納豆屋"],
  ["まる塩", "@marushio_takatsuki", "まる塩"],
  ["白菊屋", "@shiragikuya", "白菊屋"],
  ["西田本店", "@nishida_sake", "西田本店"],
  ["壽酒造 國乃長", "@kotobuki_brewing", "壽酒造 國乃長"],
  ["エノテカ イデンティタ", "@enotecaidentita_italia", "エノテカ イデンティタ"],
  ["BEER BASE 高槻", "@bbt.103", "BEER BASE 高槻"],
  ["高槻リアン", "@minato.beer_takatsuki.lien", "高槻リアン"],
  ["エシュロンティーハウス高槻", "@echelontakatsuki", "エシュロンティーハウス"],
  ["肉とチーズ Jajaja UNO", "@nikubarjajaja", "Jajaja UNO"],
  ["京きさらぎ漬 えんけい", "@kisaragiduke", "京きさらぎ漬 えんけい"],
  ["大阪たまご", "@osakatamago_dagashi", "大阪たまご"],
];

// ===== 第5弾（18店・総ざらい：未確認詰め＋新規オープン）=====
const storesV5 = [
  ["バル飛擦技", "@hisatsugi.official", "飛擦技"],
  ["come come食堂", "@comecome_shokudo", "come come食堂"],
  ["D.D. タイフード", "@dd_thai_food", "ディーディー"],
  ["商人らーめん", "@ramen.akindo", "商人らーめん"],
  ["鶏soba座銀 高槻店", "@zagintakatsuki", "座銀"],
  ["さふらん 駅前本店", "@saffran5690803", "さふらん"],
  ["そば處 とき", "@sobadokorotoki", "そば處とき"],
  ["森田屋 ベビーカステラ", "@heart_kasutera", "森田屋"],
  ["oh!huggy!! 高槻店", "@oh_huggy_takatsuki", "oh!huggy!!"],
  ["HALO, patissier KAORU YOSHIDA", "@halo_patisserie", "HALO"],
  ["atelier UNISSON", "@a_unisson.kammaki", "atelier UNISSON"],
  ["CAFE LE GRATIN", "@cafelegratin0305", "CAFE LE GRATIN"],
  ["ペペロンチーノ専門 ぺろん 高槻店", "@peron_takatsuki", "ぺろん"],
  ["OYAYUBI COFFEE & thee day", "@oyayubicoffee_and_theeday", "OYAYUBI COFFEE"],
  ["THE麺 the醤油 高槻店", "@the.men_the.syouyu", "THE麺 the醤油"],
  ["麺や晴斗", "@menya_haruto", "麺や晴斗"],
  ["TACORICE", "@taco_rice_lc", "TACORICE"],
  ["焼肉やまかわ NIKAI", "@yakiniku_yamakawa.nikai", "焼肉やまかわNIKAI"],
];

const body = (name) => `${name}さんの投稿を拝見して、ぜひお声がけしたくご連絡しました🍞
フードロス削減アプリ「おすそわけ」を運営しています。

売れ残りそうな商品を割引で販売できるのはもちろん、新商品のお試し販売や、空いた時間の集客・新規のお客さん獲得にも使えるサービスです。登録も掲載も無料で、初期費用や固定費は一切かかりません。

アプリ経由で新しいお客さんの来店につながり、実際、近隣の加盟店さんでは出品するとほぼ完売しています。

ご希望であれば直接お店にお伺いして、その場で登録まで一緒に完了できます。 面倒な設定はこちらでサポートするので、当日は数分で始められます。

5分ほどで概要をお伝えできればと思うのですが、一度お話しさせていただけませんか？店頭でもオンラインでも、ご都合に合わせます！

💻 Web版： https://osusowakejapan.org
📲 アプリ： https://apps.apple.com/jp/app/おすそわけ/id6763268307
✉️ hello@osusowakejapan.org`;

function renderMd(list, label) {
  let s = `# おすそわけ 飲食店IG営業 DM文面集（${label}）\n\n> 全${list.length}店。各店の投稿を開いて→DMにコピペで送れる形。✅を付けながら送ると管理しやすい。\n\n`;
  list.forEach(([name, handle, call], i) => {
    s += `---\n\n## ${i + 1}. ${name}　\`${handle}\`\n\n\`\`\`\n${body(call)}\n\`\`\`\n\n`;
  });
  return s;
}
function renderDoc(list, label) {
  let s = `# おすそわけ 飲食店IG営業 DM文面集（${label}）\n\n全${list.length}店\n\n`;
  list.forEach(([name, handle, call], i) => {
    s += `## ${i + 1}. ${name}（${handle}）\n\n${body(call)}\n\n---\n\n`;
  });
  return s;
}

const DESK = "C:/Users/kusao/OneDrive/デスクトップ/";
fs.writeFileSync(DESK + "おすそわけ_飲食店DM文面集_第1弾.md", renderMd(storesV1, "第1弾"), "utf8");
fs.writeFileSync(DESK + "おすそわけ_飲食店DM文面集_第2弾.md", renderMd(storesV2, "第2弾"), "utf8");
fs.writeFileSync(DESK + "おすそわけ_飲食店DM文面集_第3弾.md", renderMd(storesV3, "第3弾"), "utf8");
fs.writeFileSync(DESK + "おすそわけ_食品小売DM文面集_第4弾.md", renderMd(storesV4, "第4弾・食品小売"), "utf8");
fs.writeFileSync(DESK + "おすそわけ_飲食店DM文面集_第5弾.md", renderMd(storesV5, "第5弾・総ざらい"), "utf8");
// docx用ソース（第5弾）を引数パスへ
if (process.argv[2]) fs.writeFileSync(process.argv[2], renderDoc(storesV5, "第5弾・総ざらい"), "utf8");
console.log("V1:", storesV1.length, "V2:", storesV2.length, "V3:", storesV3.length, "V4:", storesV4.length, "V5:", storesV5.length);
