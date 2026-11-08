import { THREE, V3, __set_rnd, envTex, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mulberry, pickOn, rnd, seg, taperTube, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, loadSkeletonStatic } from './kit.js';
Object.assign(BIO_PDB, {"ins":{"title":"Инсулин 4INS","r":18.7,"chains":[{"id":"A","k":"p","seq":"GIVEQCCTSICSLYQLENYCN","num":1,"ss":"HHHHHHHHHHCHHHHHHCCCC","ca":"CACCAKIA/f9LAG4AQwAwAG0ARQAnALcA/v8QAL4ABgDY/4sAQwC+/64AMQDJ//gA6P+2//AAxP+g/7AAqf/H/3MAe/+5/zoAhP/D/+//Tf/3//H/d/8hACEAs/8aAPP/iv81ALn/jv95ANz/1/98AMn/zv90AH7/1v+yAFH/","o":"FrdA76EZHKAJCqYr4K0u6Z8ADqMh/L1KNbHh4FUrG6LtL1j/J0G/+1bOIF7yRD7XBD2xDWP2WhvfzkA716/W","brk":[]},{"id":"B","k":"p","seq":"FVNQHLCGSHLVEALYLVCGERGFFYTPKA","num":1,"ss":"CCCCCCCCHHHHHHHHHHHHCCCEEECCCC","ca":"N/9J/+v/V/86/y4Aff9k/2EAyP9h/1kABQBq/4UAOQCM/1oAfQCj/20AuQC//0YAvQCx//3/gACF/wEAVQDE/woAcwDj/8v/YgCl/6T/GQCp/7z/FgDz/6j/MgDh/2T/+/+s/1r/w//Z/3P/1v8ZAE7/+f/9/xH///8zANz+3f9pAAT/HgBnACz/IwB3AHb/RgCcAK//awB1AOT/bAChACEAiQCDAGEAjgCpAKQA0QDJALAA","o":"qAAwNzfBDJ0E9VkrLrHW6F4aBr+0ry7b2BWntevBrRfN1CqxzwKprf/Iuy/J1xqpv/20qhLQ3zy3P0MmJk/PDWMLov8jWRDUtNEtWC3wrxM4E1zeNaz80xNX","brk":[]}],"ligs":[],"res":[]}});
Object.assign(BIO_MOL, {"gap":{"name":"Глицеральдегид-3-фосфат","el":"O C C O C O P O O O H H H H H H H","xyz":"Lv9W/wgAVv+6/87/XP9AABYAbf+pALn/x/88AIIARQBjAFYAlAD2//r/LAEOAAoAdwBa/yYAcQALAFn/dv+y/2b/+v5PAEgAFv/IAJr/p/+CANIAyP/Z/7EAxQA+/1kAhgC2/y//","b":"AAABAAEAAgACAAMAAgAEAAQABQAFAAYABgAHAAYACAAGAAkAAQAKAAIACwADAAwABAANAAQADgAIAA8ACQAQAA==","o":"2111112111111111"}});


// @scene orbit makeOrbit | Глазница и глаз | @body Системы органов
/* =========================================================
   ТЕЛО · ГЛАЗНИЦА И ГЛАЗ: правая глазница на скане черепа — мышцы глаза (взгляд в 9 направлениях),
   нервы глазницы (II, III, IV, VI, V) с параличами, слёзный аппарат (моргание и ток слёз).
   Сверено с атласом Неттера (табл. 94–98). Единица ≈ 1 см; y вверх, z вперёд, x — влево от человека.
   Начало координат — точка скана черепа (0.11, 16.0, 0.6), 1 ед. скана ≈ 12,5 см (как в сценах nose, face, pharynx).
   Правый глаз: центр (−3.3, 2.4, 2.2), радиус 1,2; «к носу» = +x.
   ========================================================= */
const OR_MUS = [
  { id: 'lr', name: 'Латеральная прямая', lab: 'латеральная прямая', col: '#E8505E', nv: 'VI', text: '<b>Латеральная прямая мышца</b> идёт от общего кольца вдоль наружной стенки глазницы и крепится к склере в 7 мм от края роговицы. Её единственное действие — отводит глаз к виску. Иннервация — отводящий нерв (VI): при его поражении глаз не уходит наружу и косит к носу.' },
  { id: 'mr', name: 'Медиальная прямая', lab: 'медиальная прямая', col: '#F08A4B', nv: 'III', text: '<b>Медиальная прямая</b> — самая сильная из прямых мышц. Идёт вдоль внутренней стенки и крепится ближе всех к роговице (5,5 мм). Приводит глаз к носу, а вместе с мышцей другого глаза сводит глаза при взгляде вблизи. Иннервация — нижняя ветвь глазодвигательного нерва (III).' },
  { id: 'sr', name: 'Верхняя прямая', lab: 'верхняя прямая', col: '#E8C04A', nv: 'III', text: '<b>Верхняя прямая</b> лежит под мышцей, поднимающей веко. Ось глазницы отклонена от оси взгляда на ≈ 23°, поэтому мышца не только поднимает глаз, но и поворачивает его верхний край к носу и приводит. Чище всего она поднимает глаз, отведённый к виску. Иннервация — верхняя ветвь III.' },
  { id: 'ir', name: 'Нижняя прямая', lab: 'нижняя прямая', col: '#7FD39A', nv: 'III', text: '<b>Нижняя прямая</b> лежит над дном глазницы. Она опускает глаз, а из-за косого хода ещё поворачивает его верхний край к виску и приводит. Чище всего опускает глаз, отведённый к виску. Иннервация — нижняя ветвь III.' },
  { id: 'so', name: 'Верхняя косая', lab: 'верхняя косая', col: '#6FB7F0', nv: 'IV', text: '<b>Верхняя косая</b> идёт от вершины глазницы вперёд к блоку — хрящевой петле у верхневнутреннего края. Там сухожилие поворачивает назад и наружу, проходит под верхней прямой и крепится позади экватора. Опускает глаз, вращает внутрь и отводит; главная при взгляде вниз и к носу. Нерв — блоковый (IV).' },
  { id: 'io', name: 'Нижняя косая', lab: 'нижняя косая', col: '#C79BF0', nv: 'III', text: '<b>Нижняя косая</b> — единственная мышца глаза, которая начинается спереди: от дна глазницы рядом со слёзной ямкой. Она идёт назад и наружу под нижней прямой и крепится к задненаружной части глаза. Поднимает глаз, вращает наружу и отводит; главная при взгляде вверх и к носу. Нерв — III.' },
  { id: 'lps', name: 'Поднимающая веко', lab: 'мышца, поднимающая веко', col: '#E890C0', nv: 'III', text: '<b>Мышца, поднимающая верхнее веко,</b> лежит над верхней прямой и переходит в широкое сухожилие, вплетённое в веко. Иннервация — III. К ней прирастает гладкая мышца Мюллера с симпатической иннервацией, поэтому при синдроме Горнера веко опускается лишь на 1–2 мм.' },
];
const OR_GAZE = [   // взгляд правого глаза: yaw > 0 — к носу (влево для человека), pitch > 0 — вверх
  { id: 'ul', ar: '↖', name: 'вверх-влево', yaw: 0.42, pitch: 0.36, act: { io: 1 }, text: '<b>Вверх и влево.</b> Правый глаз приведён к носу. В этом положении ось нижней косой мышцы ближе всего к оси взгляда, и поднимает глаз почти только она — так проверяют нижнюю косую.' },
  { id: 'u', ar: '↑', name: 'вверх', yaw: 0, pitch: 0.4, act: { sr: 1, io: 0.7 }, text: '<b>Взгляд вверх</b> — вместе работают верхняя прямая и нижняя косая. Первая вращает глаз внутрь, вторая наружу, и вращения гасят друг друга; приведение и отведение тоже. Верхнее веко поднимается вслед за глазом.' },
  { id: 'ur', ar: '↗', name: 'вверх-вправо', yaw: -0.42, pitch: 0.36, act: { sr: 1 }, text: '<b>Вверх и вправо.</b> Правый глаз отведён к виску, и ось верхней прямой совпадает с осью взгляда — поднимает глаз почти только она. Так проверяют верхнюю прямую.' },
  { id: 'l', ar: '←', name: 'влево', yaw: 0.5, pitch: 0, act: { mr: 1 }, text: '<b>Взгляд влево.</b> Правый глаз приводится к носу медиальной прямой (III), а латеральная прямая в это время расслабляется: мышцы-антагонисты работают в паре. Левый глаз одновременно отводится — глаза движутся содружественно.' },
  { id: 'c', ar: '•', name: 'прямо', yaw: 0, pitch: 0, act: {}, text: '<b>Взгляд прямо.</b> Все мышцы слегка напряжены и уравновешивают друг друга. В шести положениях — вправо, влево и по четырём диагоналям — глаз движет в основном одна мышца: «рисуя» взглядом букву Н, врач проверяет каждую по отдельности.' },
  { id: 'r', ar: '→', name: 'вправо', yaw: -0.5, pitch: 0, act: { lr: 1 }, text: '<b>Взгляд вправо.</b> Правый глаз отводится к виску — работает латеральная прямая (VI). Левый глаз в это время приводится к носу своей медиальной прямой: команду обоим глазам даёт центр взора в стволе мозга.' },
  { id: 'dl', ar: '↙', name: 'вниз-влево', yaw: 0.42, pitch: -0.34, act: { so: 1 }, text: '<b>Вниз и влево.</b> В приведённом глазу опускает почти только верхняя косая. Так мы смотрим при чтении и спуске по лестнице — поэтому при параличе блокового нерва (IV) трудно идти вниз по ступеням.' },
  { id: 'd', ar: '↓', name: 'вниз', yaw: 0, pitch: -0.38, act: { ir: 1, so: 0.7 }, text: '<b>Взгляд вниз</b> — нижняя прямая и верхняя косая. Их вращения противоположны и гасят друг друга. Верхнее веко опускается вслед за глазом, и белок над радужкой не обнажается.' },
  { id: 'dr', ar: '↘', name: 'вниз-вправо', yaw: -0.42, pitch: -0.34, act: { ir: 1 }, text: '<b>Вниз и вправо.</b> В отведённом глазу ось нижней прямой совпадает с осью взгляда — опускает глаз почти только она. Так проверяют нижнюю прямую.' },
];
const OR_NERVE = [
  { id: 'II', name: 'II', col: '#F2E6A0', text: '<b>Зрительный нерв (II)</b> — пучок ≈ 1,2 млн аксонов клеток сетчатки. Из глазницы он уходит через зрительный канал вместе с глазной артерией. В глазнице нерв длиннее, чем расстояние до канала, и лежит S-образно — это запас, чтобы глаз мог поворачиваться. Его путь дальше — в теме «Зрение».' },
  { id: 'III', name: 'III', col: '#F0A04B', text: '<b>Глазодвигательный нерв (III)</b> входит через верхнюю глазничную щель внутри общего кольца. Верхняя ветвь идёт к верхней прямой и мышце, поднимающей веко, нижняя — к медиальной и нижней прямым и нижней косой. От нижней ветви к ресничному узлу идут волокна, которые суживают зрачок и настраивают хрусталик.', palsy: '<b>Паралич III нерва.</b> Работают только латеральная прямая (VI) и верхняя косая (IV), и глаз отведён наружу и вниз. Веко опущено (птоз), зрачок широкий и не сужается на свет. Если нерв сдавлен аневризмой, первым расширяется зрачок — это повод для срочной помощи.' },
  { id: 'IV', name: 'IV', col: '#7FD39A', text: '<b>Блоковый нерв (IV)</b> — самый тонкий черепной нерв и единственный, который выходит из ствола мозга сзади. Он входит в глазницу через верхнюю глазничную щель над общим кольцом, проходит над мышцей, поднимающей веко, и вступает в верхнюю косую мышцу.', palsy: '<b>Паралич IV нерва.</b> Без верхней косой глаз стоит чуть выше другого, а его верхний край наклонён к виску. Двоение по вертикали сильнее при взгляде вниз и к носу — при чтении и на лестнице. Чтобы убрать его, человек наклоняет голову к здоровому плечу.' },
  { id: 'VI', name: 'VI', col: '#6FB7F0', text: '<b>Отводящий нерв (VI)</b> проходит через общее кольцо и вступает во внутреннюю поверхность латеральной прямой мышцы. Внутри черепа у него самый длинный путь, поэтому он часто страдает при повышении внутричерепного давления.', palsy: '<b>Паралич VI нерва.</b> Латеральная прямая не работает, а медиальная тянет без противовеса — глаз косит к носу и не отводится к виску. Двоение по горизонтали, сильнее при взгляде вдаль и в сторону поражения.' },
  { id: 'V', name: 'V', col: '#C79BF0', text: '<b>Глазной нерв (V₁)</b> — чувствительная ветвь тройничного. Перед щелью он делится на слёзный, лобный и носоресничный нервы — они несут чувствительность глаза, роговицы, век, лба и носа. По дну глазницы идёт подглазничный нерв (V₂) к коже щеки. Роговичный рефлекс: касание роговицы (V₁) — моргание (VII).' },
];
const OR_TEAR = [
  { id: 'gland', name: 'Железа', col: '#6FB7F0', text: '<b>Слёзная железа</b> — размером с миндаль. Сухожилие мышцы, поднимающей веко, делит её на глазничную и вековую части; 6–12 протоков открываются в верхний свод конъюнктивы. Секреторные волокна — парасимпатические, из лицевого нерва через крылонёбный узел: при поражении нерва у ствола глаз сохнет.' },
  { id: 'canal', name: 'Канальцы', col: '#7FD39A', text: '<b>Слёзные точки и канальцы.</b> На внутреннем конце каждого века, на сосочке, — точка диаметром ≈ 0,3 мм, обращённая к глазу. От неё каналец идёт 2 мм вертикально, затем ≈ 8 мм к носу; обычно оба сливаются в общий каналец. Большую часть слёз отводит нижний.' },
  { id: 'sac', name: 'Мешок и проток', col: '#E8C04A', text: '<b>Слёзный мешок</b> (12–15 мм) лежит в ямке на внутренней стенке глазницы. При моргании круговая мышца глаза то растягивает, то сжимает его — как насос. <b>Носослёзный проток</b> (12–18 мм) открывается в нижний носовой ход под нижней раковиной: поэтому при плаче течёт из носа.' },
  { id: 'lids', name: 'Веки', col: '#E890C0', text: '<b>Веки.</b> Основа века — плотная пластинка (хрящ века). В ней ≈ 30 желёз вверху и 20 внизу: их жир — наружный слой слёзной плёнки, он не даёт ей испаряться. Смыкает веки круговая мышца глаза (VII), поднимает верхнее — мышца, поднимающая веко (III). Моргаем 15–20 раз в минуту.' },
];
function makeOrbit() {
  __set_rnd(mulberry(2205));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const sideL = new THREE.DirectionalLight(0xfff0e6, 0.6); sideL.position.set(-9, 6, 8); scene.add(sideL);
  const DK = !matchMedia('(max-width:700px)').matches;
  const E = V3(-3.3, 2.4, 2.2), R = 1.2, EL = V3(3.3, 2.4, 2.2);
  const OC = V3(-2.55, 2.55, 0.7);   // середина глазницы
  const vw = (C, dir, dist, sx, sy) => { const d = dir.clone().normalize(), f = d.clone().negate(), r = f.clone().cross(V3(0, 1, 0)).normalize(), u = r.clone().cross(f), S = r.multiplyScalar(-sx).addScaledVector(u, -sy); return flyTarget(C.clone().add(S), C.clone().addScaledVector(d, dist).add(S)); };
  const VP = DK ? { obl: [OC, V3(-0.62, 0.55, 0.56), 11.5, 1.9, 0.15], top: [V3(-2.5, 2.6, 0.7), V3(0, 1, -0.22), 17, 1.3, -0.6], side: [V3(-2.9, 2.4, 0.6), V3(-1, 0.18, 0.12), 12, 2.3, -0.2], front: [E, V3(0.05, 0.06, 1), 12.5, 2.0, -0.2], pal: [V3(0, 2.4, 2.2), V3(0, 0.04, 1), 17.5, 3.0, 1.2], tear: [V3(-2.6, 1.9, 2.5), V3(-0.12, 0.08, 1), 15.5, 1.9, -0.1], tcan: [V3(-1.9, 2.35, 2.7), V3(-0.3, 0.1, 1), 10, 2.2, 0],
      nobl: [V3(-2.5, 2.4, 0.3), V3(-0.62, 0.55, 0.56), 14.5, 1.4, 0.9], ntop: [V3(-2.3, 2.6, -1.2), V3(0, 1, -0.22), 19, 1.3, 0.4], nside: [V3(-2.5, 2.2, -0.2), V3(-1, 0.18, 0.12), 14.5, 1.6, 0.7] }
    : { obl: [OC, V3(-0.62, 0.55, 0.56), 11, 0, 0.5], top: [V3(-2.5, 2.6, 0.4), V3(0, 1, -0.22), 13.5, 0, 0.6], side: [V3(-2.9, 2.4, 0.6), V3(-1, 0.18, 0.12), 11.5, 0, 0.5], front: [E, V3(0.05, 0.06, 1), 10.5, 0, 0.5], pal: [V3(0, 2.3, 2.2), V3(0, 0.04, 1), 24, 0, 1.0], tear: [V3(-2.6, 1.9, 2.5), V3(-0.12, 0.08, 1), 12, 0, 0.5], tcan: [V3(-1.9, 2.35, 2.7), V3(-0.3, 0.1, 1), 7, 0, 0.4],
      nobl: [V3(-2.3, 2.4, -0.3), V3(-0.62, 0.55, 0.56), 13, 0, 0.5], ntop: [V3(-2.3, 2.6, 0.0), V3(0, 1, -0.22), 14, 0, 0.6], nside: [V3(-2.5, 2.2, -0.2), V3(-1, 0.18, 0.12), 13, 0, 0.5] };
  const VIEW = {}; Object.entries(VP).forEach(([k, a]) => { VIEW[k] = vw(...a); });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 400); camera.position.copy(VIEW.obl.pos);
  const controls = makeControls(camera, VIEW.obl.target); controls.minDistance = 6; controls.maxDistance = 80;
  const st = { t: 0, mode: 'mus', view: 'obl', msel: null, gaze: 'c', nsel: null, palsy: false, tsel: null, blink: true, flow: true, labels: true, rot: false, fly: null,
    yaw: 0, pitch: 0, pal: 0, bl: 0, bt: 1.2, pup: 0.17 };
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const mphys = (col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.9), roughness: o.r ?? 0.6, clearcoat: o.cc ?? 0.15, sheen: 0.2, sheenColor: new THREE.Color(0xffffff), emissive: new THREE.Color(o.emc ?? col), emissiveIntensity: o.em ?? 0.1, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined, vertexColors: !!o.vc }); m.userData.em0 = o.em ?? 0.1; return m; };
  const setOp = (m, op) => { const t = op < 0.999; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = op; m.depthWrite = op >= 0.999; };
  const cr3 = (arr) => new THREE.CatmullRomCurve3(arr.map((a) => (a.isVector3 ? a.clone() : V3(a[0], a[1], a[2]))), false, 'centripetal');
  const tubeOf = (pts, r, m, parent, seg = 48) => { const ms = new THREE.Mesh(new THREE.TubeGeometry(cr3(pts), seg, r, 8), m); parent.add(ms); return ms; };

  // =================== глаза ===================
  const EYE = new THREE.Group(); EYE.position.copy(E); scene.add(EYE);
  const EYEL = new THREE.Group(); EYEL.position.copy(EL); scene.add(EYEL);
  const sclM = mphys('#F1ECE4', { r: 0.4, cc: 0.4, em: 0.06 }), irisM = mphys('#7A5232', { r: 0.5, em: 0.08, side: THREE.DoubleSide }), pupM = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const corM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.18, depthWrite: false });
  const LIMB = Math.asin(0.58 / R);
  const PUP = [];
  [EYE, EYEL].forEach((G) => {
    const sg = new THREE.SphereGeometry(R, 48, 32, 0, 2 * Math.PI, LIMB, Math.PI - LIMB); sg.rotateX(Math.PI / 2); G.add(new THREE.Mesh(sg, sclM));
    const cg = new THREE.SphereGeometry(0.78, 40, 12, 0, 2 * Math.PI, 0, Math.asin(0.58 / 0.78)); cg.rotateX(Math.PI / 2); const co = new THREE.Mesh(cg, corM); co.position.z = 1.05 - Math.sqrt(0.78 * 0.78 - 0.58 * 0.58); co.renderOrder = 3; G.add(co);
    const ir = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.585, 48), irisM); ir.position.z = 1.02; G.add(ir);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.42, 48), mphys('#9A7044', { em: 0.12, side: THREE.DoubleSide })); ring.position.z = 1.022; G.add(ring);
    const pu = new THREE.Mesh(new THREE.CircleGeometry(1, 36), pupM); pu.position.z = 1.025; pu.scale.setScalar(0.17); G.add(pu); PUP.push(pu);
  });
  const qEye = new THREE.Quaternion();
  const onEye = (dl, r = R) => dl.clone().normalize().multiplyScalar(r).applyQuaternion(qEye).add(E);   // точка глаза (локальное направление) в мире
  const dirAP = (az, pol) => { const a = az * Math.PI / 180, p = pol * Math.PI / 180; return V3(Math.sin(p) * Math.cos(a), Math.sin(p) * Math.sin(a), Math.cos(p)); };   // az: 0 — к носу, 90 — вверх, 180 — к виску

  // =================== веки (лист вокруг глазной щели) ===================
  const RI = 1.25, RO = 1.38, NA = 72, NRW = 12, UL = -0.93, UM = 0.86;
  const bump = (u) => Math.pow(Math.max(0, Math.sin(Math.PI * (u - UL) / (UM - UL))), 0.75);
  const lidM = mphys('#C98C76', { r: 0.7, k: 0.92, em: 0.08, side: THREE.DoubleSide }), conjM = mphys('#E28C94', { r: 0.5, em: 0.1, side: THREE.DoubleSide }), margM = mphys('#C27A78', { r: 0.6, em: 0.08, side: THREE.DoubleSide });
  const lashM = new THREE.LineBasicMaterial({ color: 0x2a1c16 });
  function makeLids(G, sd) {
    const mk = (n, m) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3)); const ms = new THREE.Mesh(g, m); ms.frustumCulled = false; G.add(ms); return ms; };
    const nG = NA * (NRW + 1), skin = mk(nG, lidM), conj = mk(nG, conjM), marg = mk(NA * 2, margM);
    const gi = []; for (let i = 0; i < NA; i++) for (let j = 0; j < NRW; j++) { const i2 = (i + 1) % NA, a = i * (NRW + 1) + j, b = i2 * (NRW + 1) + j; gi.push(a, b, a + 1, b, b + 1, a + 1); }
    skin.geometry.setIndex(gi); conj.geometry.setIndex(gi);
    const mi = []; for (let i = 0; i < NA; i++) { const i2 = (i + 1) % NA; mi.push(2 * i, 2 * i2, 2 * i + 1, 2 * i2, 2 * i2 + 1, 2 * i + 1); } marg.geometry.setIndex(mi);
    const lash = new THREE.LineSegments(new THREE.BufferGeometry(), lashM); lash.frustumCulled = false; G.add(lash);
    const L = { skin, conj, marg, lash, sd, U: 0.38, Lo: 0.46, pOut: 0.95, upTop: V3(), key: '' };
    L.vU = (u) => L.U * bump(u); L.vL = (u) => -L.Lo * Math.pow(bump(u), 1.1);
    L.inside = (u, v) => u > UL && u < UM && v < L.vU(u) && v > L.vL(u);
    L.pt = (u, v, r) => { const w = Math.sqrt(Math.max(0, 1 - u * u - v * v)); return V3(sd * u * r, v * r, w * r); };   // локально (без поворота глаза)
    L.build = () => {
      const key = [L.U.toFixed(3), L.Lo.toFixed(3), L.pOut].join(); if (key === L.key) return; L.key = key;
      const uc = (UL + UM) / 2, vc = (L.vU(uc) + L.vL(uc)) / 2, open = L.vU(uc) > L.vL(uc) + 1e-3;
      const PS = skin.geometry.attributes.position, PC = conj.geometry.attributes.position, PM = marg.geometry.attributes.position, LS = [];
      for (let i = 0; i < NA; i++) {
        const a = (i / NA) * 2 * Math.PI, ca = Math.cos(a), sa = Math.sin(a);
        let lo = 0, hi = 1.2;
        if (open) { for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (L.inside(uc + m * ca, vc + m * sa)) lo = m; else hi = m; } } else lo = 0;
        const bu = uc + lo * ca, bv = vc + lo * sa, rr = Math.hypot(bu, bv), rB = Math.min(0.995, rr), pB = Math.asin(rB), sB = rr > 0.995 ? 0.995 / rr : 1;
        const pO = Math.max(L.pOut, pB + 0.3), B3 = V3(sd * bu * sB, bv * sB, Math.sqrt(Math.max(0, 1 - rB * rB))), O3 = V3(sd * Math.sin(pO) * ca, Math.sin(pO) * sa, Math.cos(pO));
        for (let j = 0; j <= NRW; j++) {
          const f = Math.pow(j / NRW, 1.25), q = B3.clone().lerp(O3, f).normalize(), dx = q.x, dy = q.y, dz = q.z, k = i * (NRW + 1) + j;
          PS.setXYZ(k, dx * RO, dy * RO, dz * RO); PC.setXYZ(k, dx * RI, dy * RI, dz * RI);
          if (j === 0) { PM.setXYZ(2 * i, dx * RI, dy * RI, dz * RI); PM.setXYZ(2 * i + 1, dx * RO, dy * RO, dz * RO);
            if (open && Math.abs(bu - uc) < 0.82 && Math.abs(sa) > 0.12) { const up = bv > vc ? 1 : -1, ln = up > 0 ? 0.3 : 0.2, x0 = dx * (RO - 0.02), y0 = dy * (RO - 0.02), z0 = dz * (RO - 0.02); LS.push(x0, y0, z0, x0 + dx * ln * 0.5, y0 + up * ln * 0.75, z0 + ln * 0.45); } }
          if (i === Math.round(NA / 4) && j === 0) L.upTop.set(dx, dy, dz);
        }
      }
      [PS, PC, PM].forEach((P) => { P.needsUpdate = true; }); [skin, conj, marg].forEach((ms) => ms.geometry.computeVertexNormals());
      lash.geometry.setAttribute('position', new THREE.Float32BufferAttribute(LS, 3));
    };
    return L;
  }
  const grpAt = (p) => { const g = new THREE.Group(); g.position.copy(p); scene.add(g); return g; };
  const GLL = grpAt(EL), LID = makeLids(grpAt(E), 1), LIDL = makeLids(GLL, -1);
  LID.build(); LIDL.build();
  const lidW = (L, u, v, r) => L.pt(u, v, r).add(L.sd > 0 ? E : EL);
  const car = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mphys('#E07888', { r: 0.4, cc: 0.4, em: 0.14 })); car.scale.set(0.1, 0.13, 0.08); car.position.copy(lidW(LID, 0.82, -0.03, 1.24)); scene.add(car);

  // =================== мышцы ===================
  const TR = V3(-1.85, 3.95, 2.3);   // блок
  const MUSD = {
    lr: { O: V3(-2.35, 2.35, -1.3), ins: [180, 62], w: [0.24, 0.8, 0.95], th: 0.32, tend: 0.65 },
    mr: { O: V3(-1.45, 2.35, -1.4), ins: [0, 55], w: [0.24, 0.85, 1.0], th: 0.34, tend: 0.45 },
    sr: { O: V3(-1.95, 2.85, -1.35), ins: [84, 66], w: [0.24, 0.8, 1.0], th: 0.3, tend: 0.55 },
    ir: { O: V3(-1.95, 1.95, -1.35), ins: [274, 60], w: [0.24, 0.8, 0.95], th: 0.3, tend: 0.55 },
    so: { O: V3(-1.45, 2.98, -1.3), via: TR, ins: [128, 106], w: [0.2, 0.26, 0.85], th: 0.24, tend: 0 },
    io: { O: V3(-2.0, 1.15, 2.55), ins: [205, 116], w: [0.24, 0.62, 0.9], th: 0.26, tend: 0.15, lift: (s) => 0.34 * sm(s / 0.2) * (1 - sm((s - 0.62) / 0.36)) },
    lps: { O: V3(-1.72, 3.08, -1.38), lid: true, w: [0.26, 0.5, 0.8], th: 0.16, tend: 0.9, lift: (s) => 0.44 * sm(s / 0.3) - 0.3 * sm((s - 0.82) / 0.18) },
  };
  const NS = 46, NK = 10, MM = {}, pick = [];
  const MCOL = {}; OR_MUS.forEach((m) => { MCOL[m.id] = new THREE.Color(m.col); });
  const NCOL = { III: new THREE.Color('#F0A04B'), IV: new THREE.Color('#7FD39A'), VI: new THREE.Color('#6FB7F0') };
  const TCOL = new THREE.Color('#F4EFE4');
  OR_MUS.forEach((m) => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(NS * NK * 3), 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(NS * NK * 3), 3));
    const idx = []; for (let j = 0; j < NS - 1; j++) for (let k = 0; k < NK; k++) { const k2 = (k + 1) % NK, a = j * NK + k, b = j * NK + k2, c = a + NK, d = b + NK; idx.push(a, c, b, b, c, d); } g.setIndex(idx);
    const mat = mphys('#ffffff', { k: 1, r: 0.5, cc: 0.3, em: 0.06, emc: m.col, vc: true, side: THREE.DoubleSide });
    const ms = new THREE.Mesh(g, mat); ms.frustumCulled = false; ms.userData.pick = m.id; scene.add(ms); pick.push(ms);
    MM[m.id] = { ms, mat, c: [], n: [], mo: [], wv: [], tv: [], tf: [], thk: 1, act: 0 };
  });
  function wrapPts(O, I, Rw) {
    const u = O.clone().sub(E), d = u.length(), ip = I.clone().sub(E);
    let n = u.clone().cross(ip); if (n.lengthSq() < 1e-9) n = V3(0, 1, 0).cross(u); n.normalize();
    const a = u.clone().divideScalar(d), b = n.clone().cross(a), phI = Math.atan2(ip.dot(b), ip.dot(a)), phT = Math.acos(cl(Rw / d, -1, 1));
    const out = [O.clone()];
    if (phI <= phT) { out.push(I.clone()); return { pts: out, n }; }
    const nA = Math.max(3, Math.ceil((phI - phT) / 0.07));
    for (let k = 0; k <= nA; k++) { const ph = phT + (phI - phT) * k / nA; out.push(E.clone().addScaledVector(a, Rw * Math.cos(ph)).addScaledVector(b, Rw * Math.sin(ph))); }
    return { pts: out, n };
  }
  const resample = (P, n) => { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + P[i].distanceTo(P[i - 1])); const T = L[L.length - 1], out = []; let k = 1; for (let j = 0; j < n; j++) { const s = T * j / (n - 1); while (k < P.length - 1 && L[k] < s) k++; const f = (s - L[k - 1]) / ((L[k] - L[k - 1]) || 1); out.push(P[k - 1].clone().lerp(P[k], cl(f))); } return { pts: out, len: T }; };
  const lpsEnd = () => { const d = LID.upTop.clone(), p = Math.asin(Math.min(0.99, Math.hypot(d.x, d.y))) + 0.3; return V3(0, Math.sin(p), Math.cos(p)).multiplyScalar(1.33).add(E); };
  function buildMus(id) {
    const D = MUSD[id], M = MM[id], Rw = R + 0.01;
    let P, n, sTr = -1;
    if (D.lid) { const w = wrapPts(D.O, lpsEnd(), Rw); P = w.pts; n = w.n; }
    else if (D.via) { const I = onEye(dirAP(...D.ins), Rw), w = wrapPts(D.via, I, Rw); P = [D.O.clone()].concat(w.pts); n = w.n; sTr = D.O.distanceTo(D.via); }
    else { const w = wrapPts(D.O, onEye(dirAP(...D.ins), Rw), Rw); P = w.pts; n = w.n; }
    const rs = resample(P, NS), C = rs.pts, len = rs.len;
    if (sTr > 0) M.sTr = sTr / len;
    if (D.lift) C.forEach((p, j) => { const s = j / (NS - 1), r = p.clone().sub(E), l = r.length(); p.addScaledVector(r.divideScalar(l), D.lift(s)); });
    const pos = M.ms.geometry.attributes.position, th0 = D.th * M.thk;
    M.c = C; M.n = n; M.mo = [];
    for (let j = 0; j < NS; j++) {
      const s = j / (NS - 1), sl = s * len, p = C[j], t = C[Math.min(NS - 1, j + 1)].clone().sub(C[Math.max(0, j - 1)]).normalize();
      let w, th;
      if (sTr > 0) { const sb = sl / sTr; if (sb < 1) { w = th = (D.w[0] + (D.w[1] - D.w[0]) * Math.sin(Math.PI * Math.min(1, sb * 1.1))) * (sb > 0.75 ? 1 - 0.55 * sm((sb - 0.75) / 0.25) : 1); th *= M.thk; } else { const f = (sl - sTr) / (len - sTr); w = 0.12 + (D.w[2] - 0.12) * sm((f - 0.45) / 0.55); th = 0.07 - 0.03 * f; } }
      else { w = s < 0.5 ? D.w[0] + (D.w[1] - D.w[0]) * sm(s / 0.5) : D.w[1] + (D.w[2] - D.w[1]) * sm((s - 0.5) / 0.5); const te = (len - sl) < D.tend ? 1 : 0; th = te ? 0.05 + 0.08 * cl((len - sl) / D.tend) : 0.12 + (th0 - 0.12) * Math.sin(Math.PI * cl((sl - 0.1) / (len - D.tend - 0.1))); }
      const nn = n.clone().sub(t.clone().multiplyScalar(n.dot(t))).normalize(), out = p.clone().sub(E); let m = t.clone().cross(nn).normalize(); if (m.dot(out) < 0) m.negate();
      M.mo.push(m);
      for (let k = 0; k < NK; k++) { const a = (k / NK) * 2 * Math.PI, q = p.clone().addScaledVector(nn, (w / 2) * Math.cos(a)).addScaledVector(m, (th / 2) * (1 + Math.sin(a)) + 0.004); pos.setXYZ(j * NK + k, q.x, q.y, q.z); }
      M.tv[j] = th;
      const tf = sTr > 0 ? (sl > sTr - 0.6 ? 1 : 0) : (len - sl < D.tend ? 1 : sl < 0.18 ? 0.7 : 0); M.tf[j] = tf;
    }
    pos.needsUpdate = true; M.ms.geometry.computeVertexNormals(); M.ms.geometry.computeBoundingSphere();
  }
  function colorMus() {
    OR_MUS.forEach((m) => { const M = MM[m.id], cA = M.ms.geometry.attributes.color, base = st.mode === 'nrv' ? NCOL[m.nv] : MCOL[m.id], c = new THREE.Color();
      for (let j = 0; j < NS; j++) { c.copy(base).multiplyScalar(j % 2 ? 0.86 : 1).lerp(TCOL, (M.tf[j] || 0) * (m.id === 'lps' ? 0.45 : 0.85)); for (let k = 0; k < NK; k++) cA.setXYZ(j * NK + k, c.r, c.g, c.b); }
      cA.needsUpdate = true; M.mat.emissive.copy(base); });
  }
  const muscPt = (id, s, out = 0.5) => { const M = MM[id], j = Math.round(cl(s) * (NS - 1)); return M.c[j].clone().addScaledVector(M.mo[j], (M.tv[j] || 0.2) * out); };
  // кольцо Цинна и блок
  const tendM = mphys('#F4EFE4', { r: 0.45, em: 0.1 });
  const ringAx = OC.clone().sub(V3(-1.85, 2.4, -1.4)).normalize();
  const RING = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 40), tendM); RING.position.set(-1.9, 2.4, -1.4); RING.quaternion.setFromUnitVectors(V3(0, 0, 1), ringAx); scene.add(RING);
  const TRO = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.05, 8, 24), mphys('#CFE3F0', { r: 0.45, cc: 0.4, em: 0.12 })); TRO.position.copy(TR); scene.add(TRO);
  // зрительный нерв
  const onM = mphys('#F2E6A0', { r: 0.6, em: 0.1 });
  const CAN = V3(-1.55, 2.6, -1.7), ONL = V3(0.25, 0, -0.97);
  const ONm = new THREE.Mesh(new THREE.BufferGeometry(), onM); scene.add(ONm); ONm.userData.pick = 'II';
  tubeOf([CAN, V3(-1.2, 2.55, -2.4), V3(-0.75, 2.45, -3.1)], 0.17, onM, scene, 16);
  let onC = null;
  function buildON() { const a = onEye(ONL, R - 0.05), b = onEye(ONL, R + 0.5), m = CAN.clone().lerp(b, 0.45).add(V3(-0.18, -0.1, 0)); onC = cr3([CAN, m, b, a]); ONm.geometry.dispose(); ONm.geometry = new THREE.TubeGeometry(onC, 40, 0.2, 12); }

  // =================== нервы ===================
  const NRV = new THREE.Group(); scene.add(NRV);
  const NM = {}; OR_NERVE.forEach((n) => { NM[n.id] = mphys(n.col, { r: 0.55, em: 0.22 }); });
  const NG = { II: [ONm], III: [], IV: [], VI: [], V: [] };
  const nerve = (id, pts, r) => { const ms = tubeOf(pts, r, NM[id], NRV); ms.userData.pick = id; NG[id].push(ms); pick.push(ms); return ms; };
  const DYNN = [];   // ресничные нервы: концы на глазу
  const LBP = {};
  function buildNerves() {
    const sr = muscPt('sr', 0.33, 0), lps = muscPt('lps', 0.36, 0), mr = muscPt('mr', 0.34, 0), ir = muscPt('ir', 0.32, 0), io = muscPt('io', 0.42, 0.5), so = muscPt('so', 0.32, 1.05), lr = muscPt('lr', 0.3, 0.2);
    // III
    const B3 = V3(-2.0, 2.25, -1.2), Bi = V3(-2.1, 1.85, -0.55);
    nerve('III', [V3(-1.3, 2.05, -3.4), V3(-1.5, 2.1, -2.8), V3(-1.8, 2.2, -1.9), B3], 0.09);
    nerve('III', [B3, V3(-2.3, 2.7, -0.9), V3(-2.15, 3.0, -0.5), sr], 0.06); nerve('III', [V3(-2.15, 3.0, -0.5), lps], 0.04);
    nerve('III', [B3, V3(-2.1, 1.95, -0.85), Bi], 0.065);
    nerve('III', [Bi, V3(-1.75, 1.95, -0.25), mr], 0.045); nerve('III', [Bi, ir], 0.045);
    nerve('III', [Bi, V3(-2.6, 1.55, 0.2), V3(-2.95, 1.3, 1.0), io], 0.04);
    // ресничный узел
    const CG = onC.getPoint(0.36).add(V3(-0.36, -0.06, 0.05)); LBP.cg = CG;
    const cgm = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), NM.III); cgm.scale.set(0.13, 0.09, 0.15); cgm.position.copy(CG); NRV.add(cgm); NG.III.push(cgm);
    nerve('III', [Bi.clone().lerp(B3, 0.3), CG.clone().add(V3(0, -0.05, -0.1))], 0.025);
    // IV
    nerve('IV', [V3(-1.55, 2.85, -3.4), V3(-1.7, 3.0, -2.7), V3(-1.85, 3.3, -1.5), V3(-1.55, 3.4, -0.9), so], 0.045);
    // VI
    nerve('VI', [V3(-1.25, 1.7, -3.4), V3(-1.6, 1.9, -2.7), V3(-2.1, 2.15, -1.4), V3(-2.55, 2.3, -0.9), lr], 0.065);
    // V: тройничный узел, V1 и его ветви, V2
    const TG = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), NM.V); TG.scale.set(0.75, 0.28, 0.42); TG.position.set(-2.55, 1.0, -3.75); TG.rotation.y = -0.5; NRV.add(TG); NG.V.push(TG);
    const BV = V3(-2.15, 2.55, -1.95);
    nerve('V', [V3(-2.3, 1.15, -3.5), V3(-2.3, 1.7, -3.0), V3(-2.2, 2.3, -2.4), BV], 0.1);
    nerve('V', [BV, V3(-2.5, 2.95, -1.4), V3(-3.2, 3.25, -0.4), V3(-3.9, 3.5, 0.6), V3(-4.25, 3.7, 1.2)], 0.045);   // слёзный
    const BF = V3(-2.65, 4.0, 1.4);
    nerve('V', [BV, V3(-2.05, 3.3, -1.4), V3(-2.3, 3.62, -0.4), V3(-2.6, 3.95, 0.8), BF], 0.07);   // лобный
    nerve('V', [BF, V3(-2.95, 4.32, 2.4), V3(-3.05, 4.55, 3.05)], 0.05); nerve('V', [BF, V3(-2.2, 4.05, 2.2), V3(-2.05, 4.25, 2.9)], 0.04);
    const NC1 = V3(-1.95, 2.92, -0.65), NC2 = V3(-1.5, 3.05, -0.2), NC3 = V3(-1.32, 3.15, 0.6);
    nerve('V', [BV, V3(-2.0, 2.65, -1.4), NC1, NC2, NC3, V3(-1.38, 3.32, 1.6), V3(-1.6, 3.6, 2.55)], 0.05);   // носоресничный → подблоковый
    nerve('V', [NC2, V3(-1.15, 3.15, -0.3)], 0.03); nerve('V', [NC3, V3(-1.05, 3.3, 0.7)], 0.03);
    nerve('V', [V3(-2.05, 2.75, -1.0), CG.clone().add(V3(0.02, 0.06, -0.08))], 0.022);
    nerve('V', [V3(-2.45, 0.8, -3.55), V3(-2.45, 0.55, -2.4), V3(-2.65, 0.55, -0.8), V3(-2.85, 0.58, 0.6), V3(-2.92, 0.42, 1.8), V3(-2.95, 0.02, 2.6), V3(-2.95, -0.38, 3.05)], 0.085);   // подглазничный (V2)
    nerve('V', [V3(-2.4, 0.85, -3.75), V3(-2.5, 0.1, -3.7)], 0.1);   // V3 — обрыв
    LBP.lac = V3(-3.6, 3.4, 0.2); LBP.fr = V3(-2.45, 3.82, 0.3); LBP.nc = NC3.clone(); LBP.v2 = V3(-2.85, 0.58, 0.6); LBP.v1 = V3(-2.28, 1.9, -2.8); LBP.tg = TG.position.clone(); LBP.s3 = V3(-2.3, 2.7, -0.9); LBP.i3 = V3(-2.6, 1.55, 0.2); LBP.t3 = V3(-1.5, 2.1, -2.8); LBP.iv = V3(-1.7, 3.0, -2.7); LBP.vi = V3(-1.15, 1.9, -2.7);
    // ресничные нервы (концы на глазу)
    for (let k = 0; k < 6; k++) { const a = (k / 6) * 2 * Math.PI; DYNN.push({ id: 'III', from: CG, dl: ONL.clone().add(V3(0.2 * Math.cos(a), 0.2 * Math.sin(a), 0)), r: 0.018 }); }
    DYNN.push({ id: 'V', from: NC1, dl: ONL.clone().add(V3(0.26, 0.12, 0)), r: 0.02 }, { id: 'V', from: NC1, dl: ONL.clone().add(V3(0.05, 0.27, 0)), r: 0.02 });
    DYNN.forEach((d) => { d.ms = new THREE.Mesh(new THREE.BufferGeometry(), NM[d.id]); NRV.add(d.ms); NG[d.id].push(d.ms); });
  }
  function buildCiliary() { DYNN.forEach((d) => { const e = onEye(d.dl, R), e2 = onEye(d.dl, R + 0.35); d.ms.geometry.dispose(); d.ms.geometry = new THREE.TubeGeometry(cr3([d.from, d.from.clone().lerp(e2, 0.5), e2, e]), 16, d.r, 5); }); }

  // =================== слёзный аппарат ===================
  const TEAR = new THREE.Group(); scene.add(TEAR);
  const glM = mphys('#7FB8E8', { r: 0.5, cc: 0.3, em: 0.16 }), ductM = mphys('#8ED0F0', { r: 0.4, cc: 0.4, em: 0.2 }), sacM = mphys('#E8C04A', { r: 0.45, cc: 0.3, em: 0.14 });
  const GL1 = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), glM); GL1.scale.set(0.78, 0.32, 0.48); GL1.position.set(-4.35, 3.85, 1.45); GL1.rotation.set(0.15, 0.7, -0.45); scene.add(GL1); GL1.userData.pick = 'gland';
  const GL2 = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), glM); GL2.scale.set(0.5, 0.2, 0.32); GL2.position.set(-4.25, 3.45, 2.3); GL2.rotation.set(0.3, 0.6, -0.6); TEAR.add(GL2); GL2.userData.pick = 'gland';
  const FORN = []; for (let k = 0; k < 6; k++) { const u = -0.78 + 0.08 * k; FORN.push(lidW(LID, u, 0.68 - 0.02 * k, 1.23)); }
  FORN.forEach((f, k) => tubeOf([GL2.position.clone().add(V3(0.1 * k - 0.2, -0.08, 0.1)), f], 0.022, ductM, TEAR, 8));
  const PU = { u: 0.68 }; PU.up = lidW(LID, PU.u, LID.vU(PU.u) + 0.01, 1.3); PU.lo = lidW(LID, PU.u, LID.vL(PU.u) - 0.01, 1.3);
  const SAC0 = V3(-1.55, 2.85, 2.6), SAC1 = V3(-1.55, 1.7, 2.62), DUCT1 = V3(-1.32, -0.15, 2.55);
  const CC = V3(-1.75, 2.38, 2.68);   // общий каналец у мешка
  const CANU = [PU.up, PU.up.clone().add(V3(0, 0.2, -0.04)), V3(-2.0, 2.62, 2.75), CC], CANL = [PU.lo, PU.lo.clone().add(V3(0, -0.2, -0.04)), V3(-2.0, 2.18, 2.75), CC];
  const canU = tubeOf(CANU, 0.055, ductM, TEAR, 24), canL = tubeOf(CANL, 0.055, ductM, TEAR, 24); canU.userData.pick = canL.userData.pick = 'canal';
  [PU.up, PU.lo].forEach((p) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: 0x1a0c0c })); d.position.copy(p); TEAR.add(d); });
  const sacG = new THREE.CapsuleGeometry(0.24, SAC0.y - SAC1.y, 8, 16); const SAC = new THREE.Mesh(sacG, sacM); SAC.position.copy(SAC0).lerp(SAC1, 0.5); SAC.scale.set(0.85, 1, 1); TEAR.add(SAC); SAC.userData.pick = 'sac';
  const DUCTC = cr3([SAC1, V3(-1.48, 0.9, 2.6), V3(-1.4, 0.3, 2.58), DUCT1]);
  const DUCT = new THREE.Mesh(taperTube(DUCTC, (u) => 0.17 - 0.05 * u + 0.05 * sm((u - 0.85) / 0.15), 30, 12), sacM); TEAR.add(DUCT); DUCT.userData.pick = 'sac';
  const ICON = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI), mphys('#D88A94', { r: 0.5, em: 0.08, op: 0.55, side: THREE.DoubleSide })); ICON.scale.set(0.3, 0.32, 1.1); ICON.rotation.y = -Math.PI / 2; ICON.position.set(-1.05, -0.05, 2.0); TEAR.add(ICON);   // нижняя раковина (передний конец)
  [GL2, SAC, DUCT, canU, canL].forEach((o) => pick.push(o)); pick.push(GL1);
  // ток слёз: частицы
  const surfW = (u, v, r = 1.265) => lidW(LID, u, v, r);
  const FLOW = (lower) => { const vm = (u) => (lower ? LID.vL(u) + 0.05 : LID.vU(u) - 0.05); const S = [FORN[2], surfW(-0.86, 0.12), surfW(-0.7, vm(-0.7)), surfW(-0.3, vm(-0.3)), surfW(0.2, vm(0.2)), surfW(0.55, vm(0.55)), surfW(0.76, -0.02)]; const C = lower ? CANL : CANU; return cr3(S.concat([C[0], C[1], C[2], CC, SAC.position.clone().add(V3(0.05, 0.2, 0.1)), SAC1, V3(-1.48, 0.9, 2.6), V3(-1.4, 0.3, 2.58), DUCT1, V3(-1.25, -0.4, 2.45)])); };
  const FC = [FLOW(true), FLOW(false)], FCL = FC.map((c) => c.getLength());
  const NP = 54, PM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 8, 6), new THREE.MeshBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: 0.95, depthTest: true }), NP); PM.frustumCulled = false; PM.renderOrder = 4; scene.add(PM);
  const PRT = Array.from({ length: NP }, (_, i) => ({ c: i % 4 === 0 ? 1 : 0, u: i / NP }));
  const dummy = new THREE.Object3D();

  // =================== скан черепа ===================
  const KS = 12.5, MX = 0.11;
  const SK = new THREE.Group(); SK.scale.setScalar(KS); SK.position.set(-MX * KS, -16 * KS, -0.6 * KS); scene.add(SK);
  const PL = (x, y, z, c) => { const n = V3(x, y, z), l = n.length(); return new THREE.Plane(n.divideScalar(l), c / l); };
  const CUT = {
    obl: [PL(1, -1, 0, 5.7), PL(0, 0, -1, -2.6), PL(0, 0, 1, -3.7), PL(0, 1, 0, -7), PL(1, 0, 0, 0.6)],   // верхненаружная часть стенок
    top: [PL(0, -1, 0, 3.22)],
    side: [PL(1, 0, 0.85, 3.5), PL(0, -1, 0, -0.1), PL(0, 1, 0, -5.3), PL(0, 0, -1, -2.8), PL(0, 0, 1, -3.4)],
    front: [], pal: [], tear: [],
  };
  const skM = new THREE.MeshPhysicalMaterial({ color: 0xE8DCC8, roughness: 0.65, clearcoat: 0.1, emissive: 0x4a4236, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.FrontSide, clipIntersection: true, clippingPlanes: CUT.obl });
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; }); if (!head) return;
    const g = head.geometry, P = g.attributes.position, IX = g.index.array, keep = [];
    const ok = (i) => { const y = (P.getY(i) - 16) * KS, z = (P.getZ(i) - 0.6) * KS; return y > -3.6 && z > -5.5; };
    for (let t = 0; t < IX.length; t += 3) if (ok(IX[t]) && ok(IX[t + 1]) && ok(IX[t + 2])) keep.push(IX[t], IX[t + 1], IX[t + 2]);
    g.setIndex(keep); g.computeVertexNormals(); const ms = new THREE.Mesh(g, skM); ms.renderOrder = 2; SK.add(ms);
    out.forEach((m) => { if (m !== head) m.geometry.dispose(); });
  }).catch(() => {});

  // =================== состояние и обновление ===================
  let lastKey = '';
  function geomUpdate(force) {
    const key = [st.yaw.toFixed(4), st.pitch.toFixed(4), LID.key, OR_MUS.map((m) => MM[m.id].thk.toFixed(3)).join()].join('|');
    if (!force && key === lastKey) return; lastKey = key;
    qEye.setFromUnitVectors(V3(0, 0, 1), V3(Math.sin(st.yaw) * Math.cos(st.pitch), Math.sin(st.pitch), Math.cos(st.yaw) * Math.cos(st.pitch))); EYE.quaternion.copy(qEye);
    OR_MUS.forEach((m) => buildMus(m.id)); buildON(); if (DYNN.length) buildCiliary();
  }
  const gz = () => OR_GAZE.find((g) => g.id === st.gaze);
  function target() {
    let yaw = 0, pitch = 0, ptos = 0, pup = 0.17;
    if (st.mode === 'mus') { const g = gz(); yaw = g.yaw; pitch = g.pitch; }
    if (st.mode === 'nrv' && st.palsy) { if (st.nsel === 'III') { yaw = -0.36; pitch = -0.2; ptos = 0.5; pup = 0.31; } else if (st.nsel === 'IV') { yaw = 0.05; pitch = 0.3; } else if (st.nsel === 'VI') { yaw = 0.5; } }
    return { yaw, pitch, ptos, pup };
  }
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly && st.mode !== 'tear'; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const T = target(), k = 1 - Math.exp(-dt * 3.2);
    st.yaw += (T.yaw - st.yaw) * k; st.pitch += (T.pitch - st.pitch) * k; st.pal += (T.ptos - st.pal) * k; st.pup += (T.pup - st.pup) * k;
    if (Math.abs(T.yaw - st.yaw) < 1e-4) st.yaw = T.yaw; if (Math.abs(T.pitch - st.pitch) < 1e-4) st.pitch = T.pitch;
    // моргание (режим 3)
    const M3 = st.mode === 'tear';
    if (M3 && st.blink) { st.bt -= dt; if (st.bt < 0) { st.bt = 3.6 + 1.4 * rnd(); } }
    st.bl = M3 && st.blink && st.bt > 3.18 ? Math.sin(Math.PI * cl((3.6 - st.bt) / 0.42)) : 0;
    // мышцы: сокращение
    const act = st.mode === 'mus' ? gz().act : {};
    OR_MUS.forEach((m) => { const M = MM[m.id], a = act[m.id] || 0; M.act += (a - M.act) * k; const anta = st.mode === 'mus' && Object.keys(act).length && !a; M.thk += ((a ? 1.18 : anta ? 0.92 : 1) - M.thk) * k; if (Math.abs(M.thk - 1) < 2e-3 && !a && !anta) M.thk = 1; });
    // веки
    const PAL = st.mode === 'nrv' && st.palsy, pOut = M3 || PAL || st.view === 'front' ? 0.95 : 0.72;
    const U0 = 0.38 + 0.75 * st.pitch, L0 = 0.46 - 0.45 * st.pitch;
    LID.U = U0 + (-L0 * 0.92 - U0) * Math.max(st.bl, 0.92 * st.pal); LID.Lo = L0; LID.pOut = pOut; LID.build();
    LIDL.U = 0.38 + (-0.46 * 0.92 - 0.38) * st.bl; LIDL.pOut = pOut; LIDL.build();
    geomUpdate(false);
    PUP[0].scale.setScalar(st.pup);
    // видимость
    const M1 = st.mode === 'mus', M2 = st.mode === 'nrv';
    EYEL.visible = GLL.visible = M3 || st.view === 'front' || (M2 && st.palsy);
    NRV.visible = M2 && !PAL; RING.visible = TRO.visible = !M3 && !PAL; ONm.visible = !PAL; TEAR.visible = M3; PM.visible = M3 && st.flow;
    OR_MUS.forEach((m) => { const M = MM[m.id]; M.ms.visible = !M3 && !PAL;
      let op = 1, em = M.mat.userData.em0;
      if (M1) { op = !st.msel || st.msel === m.id ? 1 : 0.16; em += 0.55 * M.act * (0.75 + 0.25 * Math.sin(st.t * 6)) + (st.msel === m.id ? 0.45 : 0); }
      if (M2) op = !st.nsel ? 0.45 : st.nsel === m.nv ? 0.7 : 0.12;
      setOp(M.mat, op); M.mat.emissiveIntensity = em; });
    setOp(onM, M2 && st.nsel && st.nsel !== 'II' ? 0.2 : 1);
    OR_NERVE.forEach((n) => { if (n.id === 'II') return; setOp(NM[n.id], !st.nsel || st.nsel === n.id ? 1 : 0.12); NM[n.id].emissiveIntensity = st.nsel === n.id ? (st.palsy ? 0.05 : 0.45) : 0.22; });
    GL1.visible = (M2 && !PAL) || M3;
    if (M3) { const on = (id) => !st.tsel || st.tsel === id; setOp(glM, on('gland') ? 1 : 0.25); setOp(ductM, on('canal') || on('gland') ? 1 : 0.25); setOp(sacM, on('sac') ? 1 : 0.25); glM.emissiveIntensity = st.tsel === 'gland' ? 0.4 : 0.16; sacM.emissiveIntensity = st.tsel === 'sac' ? 0.35 : 0.14; ductM.emissiveIntensity = st.tsel === 'canal' ? 0.45 : 0.2; lidM.emissiveIntensity = st.tsel === 'lids' ? 0.25 : 0.08; }
    else { setOp(glM, M2 && st.nsel && st.nsel !== 'V' ? 0.2 : 0.9); lidM.emissiveIntensity = 0.08; }
    // частицы слёз
    if (PM.visible) {
      const pump = st.bl > 0.05 ? 3.2 : 1;
      PRT.forEach((p, i) => { const L = FCL[p.c], f = p.u < 0.42 ? 0.55 : 1.4; p.u += dt * f * pump * 0.42 / L; if (p.u > 1) { p.u -= 1; p.c = rnd() < 0.3 ? 1 : 0; } const q = FC[p.c].getPointAt(cl(p.u)); dummy.position.copy(q); dummy.scale.setScalar(p.u > 0.95 ? (1 - p.u) * 20 : p.u < 0.03 ? p.u * 33 : 1); dummy.updateMatrix(); PM.setMatrixAt(i, dummy.matrix); });
      PM.instanceMatrix.needsUpdate = true;
    }
  }
  function applyView() { const v = st.mode === 'tear' ? 'tear' : st.mode === 'nrv' && st.palsy ? 'pal' : st.view; skM.clippingPlanes = CUT[v] || []; skM.needsUpdate = true; st.fly = VIEW[st.mode === 'tear' && st.tsel === 'canal' ? 'tcan' : st.mode === 'nrv' && VIEW['n' + v] ? 'n' + v : v]; }
  function setMode(m) {
    st.mode = m; if (m === 'mus' && st.view === 'top' && !st.vUser) st.view = 'obl'; if (m === 'nrv' && !st.vUser) st.view = DK ? 'side' : 'top';
    if (m !== 'nrv') st.palsy = false; colorMus(); applyView();
    refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo();
  }
  function setView(v) { st.view = v; st.vUser = true; st.palsy = false; refs.palT && refs.palT.sync(); applyView(); refs.vseg && refs.vseg.sync(); refs.setInfo && refs.setInfo(); }
  function setMus(id) { st.msel = id === 'all' || st.msel === id ? null : id; if (st.msel) st.gaze = 'c'; refs.mseg && refs.mseg.sync(); refs.gseg && refs.gseg.sync(); refs.setInfo && refs.setInfo(); }
  function setGaze(id) { st.gaze = id; st.msel = null; refs.mseg && refs.mseg.sync(); refs.gseg && refs.gseg.sync(); refs.setInfo && refs.setInfo(); }
  function setNerve(id) { st.nsel = id === 'all' || st.nsel === id ? null : id; if (!OR_NERVE.find((n) => n.id === st.nsel && n.palsy)) { if (st.palsy) { st.palsy = false; applyView(); } } refs.nseg && refs.nseg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setTear(id) { st.tsel = id === 'all' || st.tsel === id ? null : id; refs.tseg && refs.tseg.sync(); refs.setInfo && refs.setInfo(); applyView(); }
  pickOn(() => self, camera, () => pick, (id) => {
    if (st.mode === 'mus' && MM[id]) setMus(id);
    else if (st.mode === 'nrv' && NG[id]) setNerve(id);
    else if (st.mode === 'tear' && OR_TEAR.find((t) => t.id === id)) setTear(id);
  });

  // =================== подписи ===================
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const mus = () => st.mode === 'mus', nrv = () => st.mode === 'nrv', tear = () => st.mode === 'tear';
  const mOn = (id) => () => { if (!mus()) return false; if (st.msel) return st.msel === id; if (DK) return true; const a = gz().act; return Object.keys(a).length ? !!a[id] : ['lr', 'sr', 'so', 'io'].includes(id); };
  const MLS = { lr: 0.5, mr: 0.45, sr: 0.42, ir: 0.5, so: 0.3, io: 0.5, lps: 0.3 };
  const nOn = (id, dk) => () => nrv() && !st.palsy && (st.nsel === id || (!st.nsel && (!dk || DK)));
  const tOn = (id, dk) => () => tear() && (st.tsel === id || (!st.tsel && (!dk || DK)));
  const labels = [
    ...OR_MUS.map((m) => lb(m.lab, () => muscPt(m.id, MLS[m.id], 1.2), m.col, () => st.view !== 'front' && mOn(m.id)(), m.id === 'mr' || m.id === 'so')),
    ...OR_MUS.map((m) => lb(m.lab, () => muscPt(m.id, m.id === 'so' || m.id === 'lps' ? MLS[m.id] : 0.86, 1.2), m.col, () => st.view === 'front' && mOn(m.id)(), m.id === 'lr' || m.id === 'ir' || m.id === 'io')),
    lb('блок', () => TR.clone().add(V3(0.1, 0.18, 0.1)), '#CFE3F0', () => mus() && (st.msel === 'so' || (!st.msel && DK)), true),
    lb('общее сухожильное кольцо', () => RING.position.clone().add(V3(-0.2, -0.55, 0)), '#F4EFE4', () => mus() && !st.msel && DK && st.view !== 'front'),
    lb('зрительный нерв', () => onC.getPoint(0.3), '#F2E6A0', () => mus() && !st.msel && DK && st.view !== 'front'),
    lb('зрительный нерв (II)', () => onC.getPoint(0.45), '#F2E6A0', nOn('II')),
    lb('глазодвигательный (III)', () => LBP.t3, '#F8B878', nOn('III', true)),
    lb('верхняя ветвь III', () => LBP.s3, '#F8B878', () => nrv() && !st.palsy && st.nsel === 'III'),
    lb('нижняя ветвь III', () => LBP.i3, '#F8B878', () => nrv() && !st.palsy && st.nsel === 'III', true),
    lb('ресничный узел', () => LBP.cg, '#F8B878', () => nrv() && !st.palsy && (st.nsel === 'III' || (!st.nsel && DK)), true),
    lb('блоковый (IV)', () => LBP.iv, '#A8E8BC', nOn('IV')),
    lb('отводящий (VI)', () => LBP.vi, '#9CD0FF', nOn('VI'), true),
    lb('глазной нерв (V₁)', () => LBP.v1, '#DCC0FF', nOn('V'), true),
    lb('лобный', () => LBP.fr, '#DCC0FF', () => nrv() && st.nsel === 'V'),
    lb('слёзный', () => LBP.lac, '#DCC0FF', () => nrv() && st.nsel === 'V', true),
    lb('носоресничный', () => LBP.nc, '#DCC0FF', () => nrv() && st.nsel === 'V'),
    lb('подглазничный (V₂)', () => LBP.v2, '#DCC0FF', () => nrv() && st.nsel === 'V', true),
    lb('тройничный узел', () => LBP.tg, '#DCC0FF', () => nrv() && st.nsel === 'V' && DK, true),
    lb('слёзная железа', () => GL1.position.clone().add(V3(-0.3, 0.35, 0)), '#9CD0FF', () => (nrv() && st.nsel === 'V' && DK) || (tear() && st.tsel !== 'gland' && (!st.tsel || DK)), true),
    lb('глазничная часть', () => GL1.position.clone().add(V3(-0.3, 0.35, 0)), '#9CD0FF', () => tear() && st.tsel === 'gland', true),
    lb('вековая часть', () => GL2.position.clone().add(V3(-0.35, -0.05, 0.2)), '#9CD0FF', () => tear() && st.tsel === 'gland', true),
    lb('правый глаз', () => E.clone().add(V3(0, -1.6, 1)), '#F2EEE6', () => nrv() && st.palsy),
    lb('левый — норма', () => EL.clone().add(V3(0, -1.6, 1)), '#F2EEE6', () => nrv() && st.palsy),
    lb('слёзные точки', () => PU.up.clone().add(V3(0.0, 0.25, 0.15)), '#A8E8BC', tOn('canal', true)),
    lb('слёзные канальцы', () => V3(-2.0, 2.62, 2.8), '#A8E8BC', () => tear() && (st.tsel === 'canal' || (!st.tsel && DK))),
    lb('слёзное озеро', () => surfW(0.76, -0.02).add(V3(0, -0.1, 0.1)), '#9FE0FF', () => tear() && st.tsel === 'canal', true),
    lb('слёзный мешок', () => SAC0.clone().add(V3(0.15, -0.2, 0)), '#F0D880', tOn('sac')),
    lb('носослёзный проток', () => DUCTC.getPoint(0.55), '#F0D880', tOn('sac')),
    lb('устье в нижнем носовом ходе', () => DUCT1.clone().add(V3(0.1, -0.15, 0)), '#F0D880', () => tear() && st.tsel === 'sac'),
    lb('верхнее веко', () => lidW(LID, -0.2, 0.62, RO), '#F0B8A0', tOn('lids', true), true),
    lb('нижнее веко', () => lidW(LID, -0.25, -0.68, RO), '#F0B8A0', tOn('lids', true), true),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO = '<b>Глазница</b> — костная пирамида глубиной 4,5–5 см, обращённая вершиной назад. У вершины от общего сухожильного кольца начинаются четыре прямые мышцы глаза, косые подходят к глазу сверху и снизу. Выберите мышцу или направление взгляда: стрелки показывают, куда смотрит сам человек.';
  const INTRO2 = '<b>Нервы глазницы.</b> Через зрительный канал проходит зрительный нерв, через верхнюю глазничную щель — нервы мышц глаза (III, IV, VI) и глазной нерв (V₁). Мышцы окрашены по нерву: III — оранжевый, IV — зелёный, VI — синий. Выберите нерв; для III, IV и VI можно включить «Паралич».';
  const INTRO3 = '<b>Слёзный аппарат.</b> Слёзы выделяет железа в верхненаружном углу глазницы. Моргая, веки разносят их по глазу и сгоняют к внутреннему углу — к слёзному озеру. Оттуда через слёзные точки и канальцы слёзы уходят в слёзный мешок, а по носослёзному протоку — в нос.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'mus') { ib.info.innerHTML = st.msel ? OR_MUS.find((m) => m.id === st.msel).text : st.gaze !== 'c' ? gz().text : INTRO; return; }
      if (st.mode === 'nrv') { const n = OR_NERVE.find((x) => x.id === st.nsel); ib.info.innerHTML = n ? (st.palsy && n.palsy ? n.palsy : n.text) : INTRO2; return; }
      const t = OR_TEAR.find((x) => x.id === st.tsel); ib.info.innerHTML = t ? t.text : INTRO3;
    };
    refs.modeSeg = seg([{ id: 'mus', label: 'Мышцы' }, { id: 'nrv', label: 'Нервы' }, { id: 'tear', label: 'Слёзы' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.mseg = refs.gseg = refs.nseg = refs.tseg = refs.vseg = refs.palT = null;
      if (st.mode !== 'tear') { refs.vseg = seg([{ id: 'obl', label: 'Косо' }, { id: 'top', label: 'Сверху' }, { id: 'side', label: 'Сбоку' }, { id: 'front', label: 'Спереди' }], () => (st.mode === 'nrv' && st.palsy ? '' : st.view), (v) => setView(v)); view.append(refs.vseg); }
      if (st.mode === 'mus') {
        refs.mseg = seg([{ id: 'all', label: 'Все' }, ...OR_MUS.map((m) => ({ id: m.id, label: m.name, color: m.col }))], () => st.msel || 'all', (v) => setMus(v));
        refs.gseg = seg(OR_GAZE.map((g) => ({ id: g.id, label: g.ar })), () => st.gaze, (v) => setGaze(v));
        refs.gseg.style.cssText = 'display:grid;grid-template-columns:repeat(3,38px);gap:2px;width:max-content';
        [...refs.gseg.children].forEach((b, i) => { b.style.justifyContent = 'center'; b.style.padding = '4px 0'; b.title = OR_GAZE[i].name; b.setAttribute('aria-label', OR_GAZE[i].name); });
        box.append(h('div', { style: 'display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start' },
          h('div', { style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'Мышцы', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.mseg)),
          h('div', {}, h('div', { class: 'glabel' }, 'Взгляд'), h('div', { class: 'gctl' }, refs.gseg))));
        view.append(refs.rot);
      } else if (st.mode === 'nrv') {
        refs.nseg = seg([{ id: 'all', label: 'Все' }, ...OR_NERVE.map((n) => ({ id: n.id, label: n.name, color: n.col }))], () => st.nsel || 'all', (v) => setNerve(v));
        box.append(h('div', { class: 'glabel' }, 'Нерв', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.nseg));
        if (OR_NERVE.find((n) => n.id === st.nsel && n.palsy)) { refs.palT = toggle('Паралич', () => st.palsy, (v) => { st.palsy = v; refs.vseg && refs.vseg.sync(); applyView(); refs.setInfo(); }); box.lastChild.append(refs.palT); }
        view.append(refs.rot);
      } else {
        refs.tseg = seg([{ id: 'all', label: 'Все' }, ...OR_TEAR.map((t) => ({ id: t.id, label: t.name, color: t.col }))], () => st.tsel || 'all', (v) => setTear(v));
        box.append(h('div', { class: 'glabel' }, 'Часть', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.tseg));
        view.append(toggle('Моргание', () => st.blink, (v) => { st.blink = v; }), toggle('Ток слёз', () => st.flow, (v) => { st.flow = v; }));
      }
      view.append(refs.lab);
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'Вид', h('kbd', {}, 'N · V')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['mus', 'nrv', 'tear'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'mus') { setMus('all'); setGaze('c'); } else if (st.mode === 'nrv') setNerve('all'); else setTear('all'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if ((k === 'v' || k === 'м') && st.mode !== 'tear') { const L = ['obl', 'top', 'side', 'front']; setView(L[(L.indexOf(st.view) + 1) % 4]); return true; }
    if ((k === 'r' || k === 'к') && st.mode !== 'tear') { refs.rot.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'mus') { const g = gz(), a = Object.keys(g.act); if (!a.length) return [['Мышц глаза', '6 + 1', ''], ['Глубина', '4,5–5', 'см']]; return [['Взгляд', g.name, ''], ['Нерв', [...new Set(a.map((id) => OR_MUS.find((m) => m.id === id).nv))].join(' + '), '']]; }
    if (st.mode === 'nrv') return [['Нервов', 5, 'пар'], ['Ресничный узел', '≈ 2', 'мм']];
    return [['Слёз в сутки', '0,5–1', 'мл'], ['Морганий', '15–20', 'в мин']];
  }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'mus' ? (st.msel ? OR_MUS.find((m) => m.id === st.msel).col : '#E8505E') : st.mode === 'nrv' ? (st.nsel ? OR_NERVE.find((n) => n.id === st.nsel).col : '#F0A04B') : (st.tsel ? OR_TEAR.find((t) => t.id === st.tsel).col : '#6FB7F0'); },
    kicker: 'Тело · системы органов', title: 'Глазница и глаз',
    lede: 'Шесть мышц поворачивают глаз так точно, что оба глаза всегда смотрят в одну точку. Ими управляют три нерва, а слёзы непрерывно омывают глаз и уходят в нос. Посмотрите, какая мышца работает при каждом взгляде и что бывает при параличе нерва.',
    notes: `
      <div><h2>Устройство</h2>
        <p>Глазница — четырёхгранная пирамида из семи костей: лобной, клиновидной, решётчатой, слёзной, скуловой, верхнечелюстной и нёбной. Внутренние стенки обеих глазниц параллельны, а оси расходятся под углом ≈ 45°. Объём глазницы ≈ 30 мл, глаз занимает лишь его пятую часть; остальное — мышцы, жировое тело, сосуды и нервы.</p>
        <p>Прямые мышцы начинаются от общего сухожильного кольца вокруг зрительного канала, косые подходят к глазу спереди-снизу и (через блок) спереди-сверху и крепятся позади экватора. Оптика глаза и путь зрительного сигнала — в теме «Зрение».</p></div>
      <div><h2>Как это работает</h2>
        <p>Глаза движутся содружественно: центр взора в стволе мозга посылает одну команду мышцам обоих глаз, например латеральной прямой правого и медиальной прямой левого. Изображение попадает на одинаковые места сетчаток, и мы видим одно, а не два.</p>
        <p>Слёзная плёнка толщиной в несколько микрометров состоит из трёх слоёв: слизь от клеток конъюнктивы, водный слой от слёзной железы и жир от желёз век. Она питает роговицу, смывает пылинки и убивает микробы ферментом лизоцимом.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Косоглазие</b> — оси глаз не совпадают. У детей мозг подавляет изображение косящего глаза, и без лечения развивается «ленивый глаз» (амблиопия).</li>
        <li><b>Двоение (диплопия)</b> — частый первый признак паралича III, IV или VI нерва: при сахарном диабете, опухоли, аневризме, повышении внутричерепного давления.</li>
        <li><b>Перелом дна глазницы</b> от удара по глазу: нижняя прямая ущемляется в трещине, глаз не поднимается вверх, немеет щека (подглазничный нерв).</li>
        <li><b>Синдром Горнера</b> — поражение симпатического пути: небольшой птоз, узкий зрачок, сухость кожи лица на той же стороне.</li>
        <li><b>Сухой глаз</b> и <b>дакриоцистит</b> — недостаток слёз и воспаление слёзного мешка при закупорке носослёзного протока (у младенцев проток часто открывается не сразу).</li></ul></div>
      <div><h2>Условности</h2><ul><li>Скан черепа полупрозрачный, стенки глазницы над мышцами срезаны в зависимости от вида; жировое тело, фасции, конъюнктива, сосуды и содержимое левой глазницы (кроме глаза и век) не показаны.</li><li>Мышцы — ленты на прямых путях с огибанием глаза; места прикрепления, толщина и утолщение при сокращении — средние. Глаз поворачивается без вращения вокруг оси взгляда.</li><li>Веки — оболочка вокруг глазной щели без слоёв; хрящи век, их железы и круговая мышца не показаны. Нервы проведены схематично, артерии и вены глазницы не показаны; ток слёз ускорен.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>Esc</code> сбросить выбор</li><li><code>V</code> вид · <code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  geomUpdate(true); colorMus(); buildNerves(); buildCiliary();
  setMode('mus'); st.fly = null; camera.position.copy(VIEW.obl.pos); controls.target.copy(VIEW.obl.target);
  return self;
}
export { makeOrbit };
