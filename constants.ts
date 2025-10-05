import { Planet, Star, DropZone, LevelData } from './types';

export const ALL_PLANETS: Planet[] = [
    { key: 'sun', ad: "Güneş", ozellik: "Sıcak Yıldız", bilgi: "Güneş Sistemi'nin merkezindeki devasa yıldızdır. Dünyamızın yaşam kaynağıdır.", resim: 'https://www.indyturk.com/sites/default/files/styles/1368x911/public/article/main_image/2022/05/03/926351-1705174227.jpg?itok=9YcQJAkv' },
    { key: 'mercury', ad: "Merkür", ozellik: "En Hızlı Gezegen", bilgi: "Güneş'e en yakın gezegen. Çok hızlı döner ve yüzeyinde kraterler bulunur.", resim: 'https://www.nasa.gov/wp-content/uploads/2023/03/729223main_728322main_messenger_orbit_image20130218_2_full_full_full.jpg?w=1041' },
    { key: 'venus', ad: "Venüs", ozellik: "En Sıcak Gezegen", bilgi: "Atmosferi zehirlidir. Sera etkisi nedeniyle Güneş'e yakın olmasa da en sıcak gezegendir.", resim: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR246Wy-xJhs08WM9o_1S_1_OZdLmGbp_HCvw&s' },
    { key: 'earth', ad: "Dünya", ozellik: "Mavi Gezegen", bilgi: "Üzerinde yaşam olduğu bilinen tek gezegendir. Yüzeyinin büyük kısmı su ile kaplıdır.", resim: 'https://c.files.bbci.co.uk/10ECC/production/_106542396_cd247099-a673-4e7b-ac6a-a68f2e42ffc3.jpg' },
    { key: 'mars', ad: "Mars", ozellik: "Kızıl Gezegen", bilgi: "Yüzeyindeki demir oksit nedeniyle kırmızıdır. İnsanların gelecekte gitmeyi planladığı yer.", resim: 'https://i0.wp.com/www.kozmikanafor.com/wp-content/uploads/2016/01/mars-gezegen-3652.jpg?resize=640%2C434&ssl=1' },
    { key: 'jupiter', ad: "Jüpiter", ozellik: "En Büyük Gezegen", bilgi: "Güneş Sistemi'nin devi. Üzerinde Büyük Kırmızı Leke denilen dev bir fırtına bulunur.", resim: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/330px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg' },
    { key: 'saturn', ad: "Satürn", ozellik: "Halkalı Gezegen", bilgi: "Buz ve kaya parçacıklarından oluşan muhteşem halkaları ile tanınır.", resim: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/p/i/a/0/PIA01364-1.jpg?w=1200&h=1500&fit=clip&crop=faces%2Cfocalpoint' },
    { key: 'uranus', ad: "Uranüs", ozellik: "Yan Yatan Gezegen", bilgi: "Eğik bir eksende döner, bu yüzden neredeyse yan yatmış gibi görünür. Buz devi.", resim: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Uranus_Voyager2_color_calibrated.png' },
    { key: 'neptune', ad: "Neptün", ozellik: "Çok Rüzgarlı Gezegen", bilgi: "Güneş'ten en uzaktaki gezegen. Üzerindeki rüzgarlar saatte 2000 km hıza ulaşır.", resim: 'https://bilimgenc.tubitak.gov.tr/sites/default/files/styles/bp-770px-custom_user_desktop_1x/public/1_PIA01492~large.jpg?itok=Snjf-o-U' },
    { key: 'pluto', ad: "Plüton", ozellik: "Cüce Gezegen", bilgi: "Eskiden 9. gezegen olarak bilinirdi. Artık Cüce Gezegenler sınıfındadır.", resim: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Pluto-01_Stern_03_Pluto_Color_TXT.jpg/960px-Pluto-01_Stern_03_Pluto_Color_TXT.jpg' },
    { key: 'kepler', ad: "Kepler-186f", ozellik: "Ötegezegen", bilgi: "Dünya büyüklüğünde, kendi yıldızının yaşanabilir bölgesinde yer alan uzak bir gezegen.", resim: 'https://svs.gsfc.nasa.gov/vis/a010000/a011500/a011538/pf-1024.jpg' }
];

// New planet groups for a more gradual tour
export const TOUR_GROUP_1 = ALL_PLANETS.slice(1, 3); // Mercury, Venus
export const TOUR_GROUP_2 = ALL_PLANETS.slice(3, 4); // Earth
export const TOUR_GROUP_3 = ALL_PLANETS.slice(4, 5); // Mars
export const TOUR_GROUP_4 = ALL_PLANETS.slice(5, 7); // Jupiter, Saturn
export const TOUR_GROUP_5 = ALL_PLANETS.slice(7, 9); // Uranus, Neptune
export const TOUR_GROUP_6 = [ALL_PLANETS[0], ...ALL_PLANETS.slice(9)]; // Sun, Pluto, Kepler

export const STAR_DATA: Star[] = [
    { id: 1, name: "Alkaid", info: "Büyük Ayı'nın kepçesinin sapının en ucundaki yıldızdır." },
    { id: 2, name: "Mizar", info: "Sapın ortasındaki yıldız. Yanında Alcor adında bir yoldaşı vardır, iyi gözler onu seçebilir." },
    { id: 3, name: "Alioth", info: "Saptaki en parlak yıldızdır ve kepçeye en yakın olandır." },
    { id: 4, name: "Megrez", info: "Sapın kepçeyle birleştiği yerdeki en sönük yıldızdır." },
    { id: 5, name: "Phecda", info: "Kepçenin alt kısmındaki yıldızlardan biridir." },
    { id: 6, name: "Dubhe", info: "Kepçenin üst kısmındaki 'işaretçi' yıldızdır. Kutup Yıldızı'nı bulmaya yardım eder." },
    { id: 7, name: "Merak", info: "Dubhe ile birlikte Kutup Yıldızı'nı gösteren diğer 'işaretçi' yıldızdır." }
];

export const DROP_ZONES_DATA: DropZone[] = [
    { id: 1, position: { top: '85%', left: '15%' }, filledBy: null }, // Alkaid
    { id: 2, position: { top: '70%', left: '30%' }, filledBy: null }, // Mizar
    { id: 3, position: { top: '55%', left: '45%' }, filledBy: null }, // Alioth
    { id: 4, position: { top: '45%', left: '60%' }, filledBy: null }, // Megrez
    { id: 5, position: { top: '65%', left: '70%' }, filledBy: null }, // Phecda
    { id: 6, position: { top: '25%', left: '75%' }, filledBy: null }, // Dubhe
    { id: 7, position: { top: '50%', left: '85%' }, filledBy: null }, // Merak
];

export const CONSTELLATION_LINES: [number, number][] = [
    [1, 2], // Alkaid to Mizar
    [2, 3], // Mizar to Alioth
    [3, 4], // Alioth to Megrez
    [4, 5], // Megrez to Phecda
    [4, 6], // Megrez to Dubhe
    [5, 7], // Phecda to Merak
    [6, 7], // Dubhe to Merak
];

export const MARS_ROVER_LEVELS: LevelData[] = [
  // 1. First Jump
  {
    terrain: [{x:0, y:250}, {x:500, y:250}, {x:700, y:220}, {x:900, y:220}, {x:1200, y:280}, {x:1400, y:280}, {x:2000, y:300}],
    gems: [{x: 800, y: 170}, {x: 1300, y: 230}, {x: 1800, y: 250}],
    meteorFrequency: 0.005
  },
  // 2. The Valley
  { 
    terrain: [{x:0, y:150}, {x:400, y:400}, {x:1000, y:450}, {x:1150, y:450}, {x:1600, y:300}, {x:2000, y:250}],
    gems: [{x: 700, y: 400}, {x: 1350, y: 250}],
    meteorFrequency: 0.007
  },
  // 3. The Big Drop & Climb
  {
    terrain: [{x:0, y:120}, {x:600, y:150}, {x:700, y:400}, {x:1200, y:420}, {x:1400, y:250}, {x:2000, y:250}],
    gems: [{x: 300, y: 70}, {x: 950, y: 370}, {x: 1700, y: 200}],
    meteorFrequency: 0.01
  },
  // 4. Bumpy Ride with Gaps
  {
    terrain: [{x:0,y:200},{x:200,y:180},{x:350,y:220},{x:450,y:220},{x:600,y:200},{x:800,y:240},{x:950,y:210},{x:1100,y:210},{x:1200,y:300},{x:1400,y:350},{x:1550,y:340},{x:1700,y:340},{x:2000,y:380}],
    gems: [{x: 400, y: 170}, {x: 1025, y: 160}, {x: 1625, y: 290}],
    meteorFrequency: 0.012
  },
  // 5. High Platforms
  {
    terrain: [{x:0,y:500},{x:500,y:500},{x:650,y:400},{x:1000,y:400},{x:1150,y:250},{x:1500,y:250},{x:1600,y:150},{x:2000,y:150}],
    gems: [{x: 800, y: 350}, {x: 1300, y: 200}, {x: 1800, y: 100}],
    meteorFrequency: 0.015
  },
  // 6. The Snake Den
  {
    terrain: [{x:0,y:450},{x:200,y:400},{x:600,y:300},{x:800,y:300},{x:1000,y:450},{x:1200,y:450},{x:1400,y:300},{x:1800,y:400},{x:2000,y:450}],
    gems: [{x: 400, y: 250}, {x: 1100, y: 400}, {x: 1600, y: 250}],
    meteorFrequency: 0.018
  },
  // 7. Rollercoaster Gaps
  {
    terrain: [{x:0,y:400},{x:300,y:300},{x:400,y:300},{x:600,y:450},{x:800,y:250},{x:900,y:250},{x:1200,y:350},{x:1400,y:200},{x:1500,y:200},{x:1800,y:300},{x:2000,y:250}],
    gems: [{x: 350, y: 250}, {x: 700, y: 200}, {x: 1300, y: 150}, {x: 1900, y: 200}],
    meteorFrequency: 0.02
  },
  // 8. Canyon Maze
  {
    terrain: [{x:0,y:200},{x:400,y:250},{x:500,y:250},{x:600,y:400},{x:900,y:400},{x:1000,y:250},{x:1300,y:250},{x:1400,y:450},{x:1700,y:450},{x:1800,y:200},{x:2000,y:200}],
    gems: [{x: 450, y: 200}, {x: 750, y: 350}, {x: 1150, y: 200}, {x: 1550, y: 400}],
    meteorFrequency: 0.022
  },
  // 9. Jagged Peaks
  {
    terrain: [{x:0,y:500},{x:200,y:450},{x:300,y:450},{x:400,y:500},{x:550,y:400},{x:650,y:400},{x:800,y:480},{x:950,y:350},{x:1050,y:350},{x:1200,y:450},{x:1350,y:300},{x:1450,y:300},{x:1600,y:400},{x:1750,y:250},{x:2000,y:200}],
    gems: [{x: 250, y: 400}, {x: 600, y: 350}, {x: 1000, y: 300}, {x: 1400, y: 250}, {x: 1850, y: 150}],
    meteorFrequency: 0.025
  },
  // 10. Final Gauntlet
  {
    terrain: [{x:0,y:120},{x:300,y:140},{x:450,y:300},{x:550,y:300},{x:700,y:150},{x:850,y:130},{x:1000,y:400},{x:1100,y:400},{x:1250,y:200},{x:1400,y:180},{x:1550,y:420},{x:1650,y:420},{x:1800,y:250},{x:2000,y:220}],
    gems: [{x: 150, y: 70}, {x: 500, y: 250}, {x: 775, y: 80}, {x: 1050, y: 350}, {x: 1600, y: 370}, {x: 1900, y: 170}],
    meteorFrequency: 0.03
  }
];