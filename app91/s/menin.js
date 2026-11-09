import { THREE, V3, __set_rnd, button, ell3, envTex, flyStep, flyTarget, group, h, infoBox, labLights, loadSkeletonStatic, makeControls, mulberry, pickOn, rnd, seg, taperTube, toggle } from '../core.js';


// @scene menin makeMenin | Оболочки мозга и синусы | @brain Устройство
/* =========================================================
   МОЗГ · ОБОЛОЧКИ И СИНУСЫ: 1) срез свода черепа от кожи до коры — скальп, кость, твёрдая, паутинная и мягкая оболочки,
   верхний сагиттальный синус с грануляциями; 2) три вида внутричерепных кровоизлияний; 3) синусы твёрдой оболочки на скане черепа
   (серп, намёт, ток крови к яремным венам, пещеристый синус с сонной артерией и нервами).
   Сверено с атласом Неттера (табл. 109–113). Координаты режима 3 — как в сценах orbit, nose: 1 ед. ≈ 1 см, y вверх, z вперёд,
   x > 0 — левая сторона человека; средняя линия черепа x ≈ −0,5.
   ========================================================= */
const MN_LAY = [
  { id: 'scalp', name: 'Скальп', col: '#E8B8A0', text: '<b>Мягкие ткани свода</b> — пять слоёв: кожа с волосами, плотная клетчатка с сосудами, сухожильный шлем (апоневроз), рыхлая клетчатка и надкостница. Сосуды плотного слоя не спадаются, поэтому раны головы сильно кровоточат. По рыхлому слою скальп легко сдвигается, и в нём растекаются гематомы.' },
  { id: 'bone', name: 'Кость', col: '#F2E6C8', text: '<b>Кости свода</b> — наружная и внутренняя компактные пластинки, а между ними губчатое диплоэ с красным костным мозгом и диплоическими венами. Внутренняя пластинка тоньше и хрупче. Выпускники соединяют вены скальпа с синусами через кость — путь, по которому инфекция может проникнуть внутрь черепа.' },
  { id: 'dura', name: 'Твёрдая', col: '#9FC2E8', text: '<b>Твёрдая мозговая оболочка</b> — плотная двухслойная пластинка. Наружный слой прирастает к кости, внутренний образует складки — серп мозга между полушариями и намёт мозжечка. Где слои расходятся, лежат венозные синусы. В оболочке идут менингеальные артерии и нервы — она чувствительна к боли, в отличие от самого мозга.' },
  { id: 'arach', name: 'Паутинная', col: '#C8D8E8', text: '<b>Паутинная оболочка</b> — тонкая прозрачная плёнка под твёрдой. От неё к мягкой оболочке тянутся нити-трабекулы, а между паутинной и мягкой — <b>подпаутинное пространство</b> с ликвором и крупными сосудами мозга. Ворсинки паутинной оболочки (пахионовы грануляции) вдаются в синусы и возвращают ликвор в кровь.' },
  { id: 'pia', name: 'Мягкая', col: '#E890A8', text: '<b>Мягкая оболочка</b> — самая тонкая, она плотно облегает мозг и заходит во все борозды. На ней лежат мелкие сосуды; входя в мозг, они уводят за собой мягкую оболочку, вокруг них остаются щели, по которым ликвор омывает ткань.' },
  { id: 'sss', name: 'Синус', col: '#6F8FE8', text: '<b>Верхний сагиттальный синус</b> — треугольный канал в твёрдой оболочке вдоль верхнего края серпа. Его стенки не сжимаются и не имеют клапанов. В него впадают вены мозга — мостовые вены пересекают подпаутинное пространство и паутинную оболочку — и через грануляции возвращается ликвор.' },
];
const MN_BLEED = [
  { id: 'none', name: 'Нет', text: '' },
  { id: 'epi', name: 'Эпидуральная', col: '#C83040', text: '<b>Эпидуральная гематома</b> — кровь между костью и твёрдой оболочкой, обычно из средней менингеальной артерии при переломе височной кости. Кровь отслаивает оболочку линзой, но не переходит за швы, где оболочка приросла. Типичен «светлый промежуток»: человек приходит в себя, а через часы теряет сознание. Нужна срочная операция.' },
  { id: 'sub', name: 'Субдуральная', col: '#8A2C3C', text: '<b>Субдуральная гематома</b> — кровь между твёрдой и паутинной оболочками от разрыва мостовых вен. Она растекается полумесяцем по поверхности полушария и переходит через швы. У пожилых и при алкоголизме мозг уменьшается, вены натягиваются и рвутся даже от лёгкой травмы; хроническая гематома нарастает неделями.' },
  { id: 'sah', name: 'Субарахноидальная', col: '#B03848', text: '<b>Субарахноидальное кровоизлияние</b> — кровь в подпаутинном пространстве, где она смешивается с ликвором и заполняет борозды. Без травмы чаще всего это разрыв аневризмы артерии основания мозга: внезапная «самая сильная головная боль в жизни», рвота, ригидность шеи. Опасно повторным разрывом и спазмом сосудов.' },
];
const MN_SIN = [
  { id: 'sss', name: 'Верхний сагиттальный', col: '#6F8FE8', text: '<b>Верхний сагиттальный синус</b> идёт по верхнему краю серпа от петушиного гребня до внутреннего затылочного выступа. В него впадают верхние мозговые вены и через грануляции возвращается ликвор. Сзади он сливается с другими синусами в <b>сток синусов</b>.' },
  { id: 'iss', name: 'Прямой и нижний', col: '#9F7FE8', text: '<b>Нижний сагиттальный синус</b> идёт по свободному нижнему краю серпа над мозолистым телом. Он впадает в <b>большую мозговую вену</b> (Галена), которая собирает кровь глубоких отделов мозга; от их слияния начинается <b>прямой синус</b> — по линии соединения серпа с намётом к стоку.' },
  { id: 'tr', name: 'Поперечный и сигмовидный', col: '#5FB8E0', text: '<b>Поперечные синусы</b> идут от стока в стороны по краю намёта мозжечка, затем изгибаются S-образно (<b>сигмовидные синусы</b>) и через яремные отверстия переходят во внутренние яремные вены. Правый обычно крупнее. Сигмовидный синус лежит сразу за сосцевидными ячейками — мастоидит может вызвать его тромбоз.' },
  { id: 'cav', name: 'Пещеристый', col: '#E8A050', text: '<b>Пещеристый синус</b> — венозное сплетение по бокам от турецкого седла. Сквозь него проходит внутренняя сонная артерия с отводящим нервом (VI), а в боковой стенке лежат III, IV, V₁ и V₂ нервы. Спереди в синус впадают глазные вены, поэтому инфекция из «опасного треугольника» лица может вызвать тромбоз пещеристого синуса.' },
  { id: 'pet', name: 'Каменистые', col: '#7FD3A8', text: '<b>Верхний и нижний каменистые синусы</b> отводят кровь из пещеристого синуса назад: верхний — по гребню пирамиды височной кости в поперечный синус, нижний — к яремному отверстию. Межпещеристые синусы соединяют правый и левый пещеристые вокруг гипофиза.' },
];
function makeMenin() {
  __set_rnd(mulberry(2411));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const keyL = new THREE.DirectionalLight(0xfff2e6, 0.7); keyL.position.set(8, 14, 16); scene.add(keyL);
  const DK = !matchMedia('(max-width:700px)').matches;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const mphys = (col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.9), roughness: o.r ?? 0.55, clearcoat: o.cc ?? 0.15, sheen: 0.2, sheenColor: new THREE.Color(0xffffff), emissive: new THREE.Color(o.emc ?? col), emissiveIntensity: o.em ?? 0.08, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined }); m.userData.em0 = o.em ?? 0.08; m.userData.op0 = o.op ?? 1; return m; };
  const setOp = (m, op) => { const t = op < 0.999; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = op; m.depthWrite = op >= 0.999; };
  const cr3 = (arr) => new THREE.CatmullRomCurve3(arr.map((a) => (a.isVector3 ? a.clone() : V3(a[0], a[1], a[2]))), false, 'centripetal');
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);
  const controls = makeControls(camera, V3(0, 0, 0)); controls.minDistance = 6; controls.maxDistance = 120;
  const vw = (C, dir, dist, sx, sy) => { const d = dir.clone().normalize(), f = d.clone().negate(), r = f.clone().cross(V3(0, 1, 0)).normalize(), u = r.clone().cross(f), S = r.multiplyScalar(-sx).addScaledVector(u, -sy); return flyTarget(C.clone().add(S), C.clone().addScaledVector(d, dist).add(S)); };
  const st = { mode: 'lay', sel: null, bleed: 'none', g: 0, sin: null, labels: true, rot: false, flow: true, fly: null, t: 0 };
  const pick = [];

  // =================== режимы 1–2: срез свода (своя система координат, вынесена в сторону) ===================
  const SLAB = new THREE.Group(); SLAB.position.set(80, 0, 0); scene.add(SLAB);
  const TH = 0.78, DZ = 5, ZF = DZ / 2;
  const KA = 0.45, P2 = (th, r) => new THREE.Vector2(r * Math.sin(KA * th), -6 + r * Math.cos(KA * th));   // th — условный угол, сжат в KA раз
  const SUL = [-0.6, -0.4, -0.2, 0.21, 0.4, 0.61];
  const Rc0 = (th) => 8.85 + 0.06 * Math.cos(th * 30) - SUL.reduce((s, k) => s + 0.8 * Math.exp(-(((th - k) / 0.03) ** 2)), 0);
  // смещения при кровоизлияниях: d — насколько отжаты внутрь слои под гематомой
  const shiftEpi = (th) => { const u = (th - 0.48) / 0.19; return Math.abs(u) < 1 ? 0.95 * Math.pow(1 - u * u, 0.9) : 0; };
  const shiftSub = (th) => (th > 0.15 && th < TH ? 0.42 * Math.sin(Math.PI * cl((th - 0.15) / (TH - 0.13))) ** 0.7 : 0);
  const dEpi = (th) => (st.bleed === 'epi' ? st.g * shiftEpi(th) : 0), dSub = (th) => (st.bleed === 'sub' ? st.g * shiftSub(th) : 0);
  const dIn = (th) => dEpi(th) + dSub(th);
  const R = {   // радиусы границ слоёв (от центра дуги)
    skin1: () => 11.2, skin0: () => 10.98, dense0: () => 10.72, apo0: () => 10.62, loose0: () => 10.44, peri0: () => 10.4,
    ot0: () => 10.26, dip0: () => 9.98, it0: () => 9.84,
    dp0: (th) => 9.64 - dEpi(th), dm0: (th) => 9.44 - dEpi(th), ar1: (th) => 9.44 - dIn(th), ar0: (th) => 9.34 - dIn(th),
    pia1: (th) => Rc0(th) + 0.08 - dIn(th) * 0.85, cx: (th) => Rc0(th) - dIn(th) * 0.85, wm: (th) => Rc0(th) - 0.6 - dIn(th) * 0.7,
  };
  function band(th0, th1, rOut, rIn, n = 90) {
    const s = new THREE.Shape(); for (let i = 0; i <= n; i++) { const th = th0 + (th1 - th0) * i / n, p = P2(th, rOut(th)); i ? s.lineTo(p.x, p.y) : s.moveTo(p.x, p.y); }
    for (let i = n; i >= 0; i--) { const th = th0 + (th1 - th0) * i / n, p = P2(th, rIn(th)); s.lineTo(p.x, p.y); } return s;
  }
  const LM = {}, layMesh = {}, LAYDEF = [];
  const lay = (key, part, col, th0, th1, rOut, rIn, o = {}) => { LAYDEF.push({ key, part, th0, th1, rOut, rIn, n: o.n || 90 }); LM[key] = mphys(col, { r: 0.6, em: 0.08, op: o.op, side: THREE.DoubleSide, ...o.m }); LM[key].userData.part = part; };
  const half = (key, part, col, rOut, rIn, a0 = 0.035, o) => { lay(key + 'R', part, col, -TH, -a0, rOut, rIn, o); lay(key + 'L', part, col, a0, TH, rOut, rIn, o); };
  lay('skin', 'scalp', '#D9A08C', -TH, TH, R.skin1, R.skin0); lay('dense', 'scalp', '#E8C4A8', -TH, TH, R.skin0, R.dense0); lay('apo', 'scalp', '#F0EEE8', -TH, TH, R.dense0, R.apo0);
  lay('loose', 'scalp', '#F4E2C8', -TH, TH, R.apo0, R.loose0); lay('peri', 'scalp', '#E8E0D0', -TH, TH, R.loose0, R.peri0);
  lay('ot', 'bone', '#F2E6C8', -TH, TH, R.peri0, R.ot0); lay('dip', 'bone', '#D8B890', -TH, TH, R.ot0, R.dip0); lay('it', 'bone', '#F2E6C8', -TH, TH, R.dip0, R.it0);
  lay('dp', 'dura', '#9FC2E8', -TH, TH, (th) => 9.84 - dEpi(th), R.dp0);
  half('dm', 'dura', '#86AEDC', R.dp0, R.dm0, 0.13);
  half('ar', 'arach', '#D8E4F0', R.ar1, R.ar0, 0.12);
  half('sas', 'arach', '#5FA8E0', R.ar0, R.pia1, 0.045, { op: 0.35 });
  half('pia', 'pia', '#E890A8', R.pia1, R.cx, 0.035);
  half('gm', 'pia', '#9C8C94', R.cx, R.wm, 0.035, { m: { em: 0.04 } });
  half('wm', 'pia', '#EDE6E0', R.wm, () => 8.2, 0.035, { m: { em: 0.04 } });
  function buildLayers() {
    LAYDEF.forEach((d) => {
      const g = new THREE.ExtrudeGeometry(band(d.th0, d.th1, d.rOut, d.rIn, d.n), { depth: DZ, bevelEnabled: false, curveSegments: 1, steps: 1 }); g.translate(0, 0, -ZF);
      let m = layMesh[d.key]; if (!m) { m = layMesh[d.key] = new THREE.Mesh(g, LM[d.key]); m.userData.pick = d.part; pick.push(m); SLAB.add(m); } else { m.geometry.dispose(); m.geometry = g; }
    });
  }
  buildLayers();
  // синус и серп
  const sssM = mphys('#3A4C8C', { r: 0.4, em: 0.2, emc: '#6F8FE8' });
  const sssS = new THREE.Shape(); [P2(-0.16, 9.64), P2(0.16, 9.64), P2(0, 8.8)].forEach((p, i) => (i ? sssS.lineTo(p.x, p.y) : sssS.moveTo(p.x, p.y)));
  const sssG = new THREE.ExtrudeGeometry(sssS, { depth: DZ + 0.02, bevelEnabled: false }); sssG.translate(0, 0, -ZF - 0.01);
  const SSSm = new THREE.Mesh(sssG, sssM); SSSm.userData.pick = 'sss'; pick.push(SSSm); SLAB.add(SSSm);
  const falxS = new THREE.Shape(); { const a = P2(0, 8.8); falxS.moveTo(a.x - 0.03, a.y); falxS.lineTo(-0.1, a.y - 0.4); falxS.lineTo(-0.1, 2.25); falxS.lineTo(0.1, 2.25); falxS.lineTo(0.1, a.y - 0.4); falxS.lineTo(a.x + 0.03, a.y); }
  const falxG = new THREE.ExtrudeGeometry(falxS, { depth: DZ, bevelEnabled: false }); falxG.translate(0, 0, -ZF);
  const FALX = new THREE.Mesh(falxG, LM.dmL); FALX.userData.pick = 'dura'; pick.push(FALX); SLAB.add(FALX);
  // мелкие детали на срезе (на передней грани, z = ZF)
  const FACE = new THREE.Group(); SLAB.add(FACE);
  const onFace = (g, m, z = 0.02) => { const ms = new THREE.Mesh(g, m); ms.position.z = ZF + z; FACE.add(ms); return ms; };
  const disc = (th, r, rad, m, part) => { const g = new THREE.CylinderGeometry(rad, rad, DZ + 0.06, 18); g.rotateX(Math.PI / 2); const ms = new THREE.Mesh(g, m); const p = P2(th, r); ms.position.set(p.x, p.y, 0); ms.userData.th = th; ms.userData.r = r; if (part) { ms.userData.pick = part; pick.push(ms); } SLAB.add(ms); return ms; };
  const artM = mphys('#D8404A', { r: 0.4, em: 0.18 }), veinM = mphys('#4A68C8', { r: 0.4, em: 0.18 }), granM = mphys('#E8EEF4', { r: 0.4, em: 0.15 });
  const MMA = disc(0.47, 9.74, 0.1, artM);   // средняя менингеальная артерия — в борозде кости, в наружном слое
  const CORT = [-0.7, -0.5, -0.3, -0.11, 0.12, 0.31, 0.5, 0.7].map((th) => disc(th, Rc0(th) + 0.14, 0.08, (th * 10) % 2 > 0.5 ? veinM : artM));
  const DIP = [-0.55, -0.3, 0.05, 0.35, 0.62].map((th) => disc(th, 10.12, 0.08, veinM));
  const SCV = [-0.65, -0.25, 0.15, 0.5].map((th) => disc(th, 10.85, 0.06, veinM));
  // трабекулы
  const trabM = new THREE.LineBasicMaterial({ color: 0xdfe8f0, transparent: true, opacity: 0.7 }), trabG = new THREE.BufferGeometry();
  const TRAB = new THREE.LineSegments(trabG, trabM); TRAB.position.z = ZF + 0.03; SLAB.add(TRAB);
  // грануляции в синусе и мостовая вена, выпускник
  const gran = [-1, 1].map((s) => { const g = new THREE.Group(); const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.35, 8), granM); const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), granM); g.add(stalk, head); g.userData = { s, stalk, head }; g.position.z = ZF + 0.04; SLAB.add(g); head.userData.pick = 'arach'; pick.push(head); return g; });
  let bridge = null, emiss = null;
  function buildFace() {
    const tp = []; for (let k = 0; k < 70; k++) { const th = (k % 2 ? 1 : -1) * (0.06 + (TH - 0.08) * (Math.floor(k / 2) / 35) + 0.008 * rnd()); const a = R.pia1(th) + 0.01, b = R.ar0(th) - 0.01; if (b - a < 0.06) continue; const p = P2(th, a), q = P2(th + 0.01 * (rnd() - 0.5), b); tp.push(p.x, p.y, 0, q.x, q.y, 0); }
    trabG.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3));
    gran.forEach((g) => { const s = g.userData.s, a = P2(0.17 * s, R.ar0(0.17 * s) + 0.02), b = P2(0.06 * s, 9.15); g.userData.stalk.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, 0); g.userData.stalk.lookAt(V3(b.x, b.y, 0)); g.userData.stalk.rotateX(Math.PI / 2); g.userData.stalk.scale.y = Math.hypot(a.x - b.x, a.y - b.y) / 0.35; g.userData.head.position.set(b.x, b.y, 0); });
    [MMA, ...CORT].forEach((d) => { const th = d.userData.th, r = d === MMA ? 9.74 - dEpi(th) * 0 : d.userData.r - dIn(th) * 0.85; const p = P2(th, d === MMA ? r : Rc0(th) + 0.14 - dIn(th) * 0.85); d.position.set(p.x, p.y, 0); });
    const tb = st.bleed === 'sub' && st.g > 0.2;   // мостовая вена рвётся при субдуральной
    const bp = [P2(0.24, R.cx(0.24) + 0.02), P2(0.21, R.ar0(0.21) + 0.05), P2(0.16, 9.34 - dIn(0.16)), P2(0.08, 9.2)].map((p) => V3(p.x, p.y, ZF + 0.06));
    if (tb) bp.splice(2, 0, bp[1].clone().lerp(bp[2], 0.4));
    if (bridge) { SLAB.remove(bridge); bridge.geometry.dispose(); }
    bridge = new THREE.Mesh(new THREE.TubeGeometry(cr3(tb ? bp.slice(0, 3) : bp), 30, 0.055, 8), veinM); SLAB.add(bridge); bridge.userData.pick = 'sss';
    if (!emiss) { emiss = new THREE.Mesh(new THREE.TubeGeometry(cr3([P2(-0.03, 9.64), P2(-0.06, 9.95), P2(-0.1, 10.3), P2(-0.14, 10.8)].map((p) => V3(p.x, p.y, ZF + 0.06))), 20, 0.05, 8), veinM); SLAB.add(emiss); }
  }
  // гематомы: лента между слоями на всю глубину среза
  const bloodM = mphys('#8A1C28', { r: 0.35, cc: 0.5, em: 0.25, emc: '#C83040' }), sahM = mphys('#B03040', { r: 0.4, em: 0.2, op: 0.75 });
  let HEM = null;
  function buildBleed() {
    if (HEM) { SLAB.remove(HEM); HEM.geometry.dispose(); HEM = null; }
    LM.sasR.color.set(st.bleed === 'sah' ? '#B03848' : '#5FA8E0').multiplyScalar(0.9); LM.sasL.color.copy(LM.sasR.color);
    const op = st.bleed === 'sah' ? 0.35 + 0.5 * st.g : 0.35; setOp(LM.sasR, op); setOp(LM.sasL, op);
    if (st.bleed === 'epi' && st.g > 0.01) HEM = new THREE.Mesh(new THREE.ExtrudeGeometry(band(0.29, 0.67, () => 9.84, (th) => 9.84 - dEpi(th) - 0.001, 60), { depth: DZ * 0.98, bevelEnabled: false }), bloodM);
    if (st.bleed === 'sub' && st.g > 0.01) HEM = new THREE.Mesh(new THREE.ExtrudeGeometry(band(0.15, TH, (th) => 9.44 - dEpi(th), (th) => 9.44 - dIn(th) - 0.001, 80), { depth: DZ * 0.98, bevelEnabled: false }), bloodM);
    if (HEM) { HEM.geometry.translate(0, 0, -ZF * 0.98); SLAB.add(HEM); }
  }
  buildFace(); buildBleed();

  // =================== режим 3: синусы на скане черепа ===================
  const SKG = new THREE.Group(); scene.add(SKG);
  const KS = 12.5, SKS = new THREE.Group(); SKS.scale.setScalar(KS); SKS.position.set(-0.11 * KS, -16 * KS, -0.6 * KS); SKG.add(SKS);
  const skM = new THREE.MeshPhysicalMaterial({ color: 0xE8DCC8, roughness: 0.65, clearcoat: 0.1, emissive: 0x4a4236, transparent: true, opacity: 0.13, depthWrite: false, side: THREE.DoubleSide });
  loadSkeletonStatic(new THREE.Group(), new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; }); if (!head) return;
    const g = head.geometry, P = g.attributes.position, IX = g.index.array, keep = [];
    const ok = (i) => (P.getY(i) - 16) * KS > -6.5;
    for (let t = 0; t < IX.length; t += 3) if (ok(IX[t]) && ok(IX[t + 1]) && ok(IX[t + 2])) keep.push(IX[t], IX[t + 1], IX[t + 2]);
    g.setIndex(keep); g.computeVertexNormals(); const ms = new THREE.Mesh(g, skM); ms.renderOrder = 2; SKS.add(ms); SKS.visible = st.sin !== 'cav';
    out.forEach((m) => { if (m !== head) m.geometry.dispose(); });
  }).catch(() => {});
  const XM = -0.5;
  const SSSP = [[5.3, 3.25], [10.11, 1.66], [12.28, -0.8], [13.17, -3.96], [13.42, -6.99], [13.4, -10.05], [12.25, -12.77], [10.3, -14.67], [7.35, -15.89], [4.6, -16.55]].map(([y, z]) => V3(XM, y, z));
  const CONF = V3(XM, 3.95, -16.55), GAL = V3(XM, 7.0, -10.3);
  const ISSP = [V3(XM, 6.2, 2.4), V3(XM, 7.2, 0.2), V3(XM, 8.1, -2.8), V3(XM, 8.4, -5.8), V3(XM, 8.0, -8.4), GAL];
  const STR = [GAL, V3(XM, 6.1, -12.3), V3(XM, 4.9, -14.6), CONF];
  const side = (s, pts) => pts.map(([x, y, z]) => V3(XM + s * x, y, z));   // s = −1 правая сторона
  const TRS = (s) => [CONF, ...side(s, s < 0 ? [[2.0, 3.79, -16.6], [4.79, 3.4, -15.59], [6.46, 2.95, -12.66], [6.82, 2.08, -10.39]] : [[2.0, 3.8, -16.52], [4.4, 3.53, -14.79], [6.29, 3.06, -12.29], [6.98, 2.13, -10.3]])];
  const SIG = (s) => [TRS(s)[4], ...side(s, [[7.0, 0.9, -9.7], [6.4, -0.6, -9.6], [5.4, -1.5, -9.9], [4.5, -2.4, -9.3], [4.2, -4.4, -8.9], [4.1, -6.6, -8.6]])];
  const CAVC = (s) => V3(XM + s * 1.55, 1.25, -4.8);
  const SPS = (s) => [CAVC(s).clone().add(V3(s * 0.3, 0.3, -1.1)), ...side(s, [[3.4, 2.0, -7.6], [5.4, 2.4, -9.4]]), TRS(s)[4]];
  const IPS = (s) => [CAVC(s).clone().add(V3(0, -0.4, -1.0)), ...side(s, [[2.4, -0.4, -7.2], [3.6, -1.6, -8.6]]), SIG(s)[4]];
  const SPH = (s) => [...side(s, [[5.6, 2.6, -1.2], [3.6, 2.2, -2.6]]), CAVC(s).clone().add(V3(s * 0.2, 0.2, 1.1))];
  const OPH = (s) => [...side(s, [[2.6, 3.0, 1.6], [2.0, 2.4, -1.4]]), CAVC(s).clone().add(V3(0, 0.25, 1.15))];
  const SINM = Object.fromEntries(MN_SIN.map((s) => [s.id, mphys(s.col, { r: 0.35, cc: 0.4, em: 0.22 })]));
  const SINCURVES = [];   // для потока: { c, id, r }
  const FARM = [], SINMESH = [], cavFar = SINM.cav.clone();   // клиновидно-теменной синус и глазная вена правой стороны — при выборе пещеристого приглушены (тянутся под текст)
  const sinus = (pts, r, id, mat) => { const c = cr3(pts); const m = new THREE.Mesh(taperTube(c, typeof r === 'function' ? r : () => r, 64, 10), mat || SINM[id]); m.userData.pick = 's:' + id; pick.push(m); SKG.add(m); SINMESH.push({ m, id }); if (mat === cavFar) FARM.push(m); SINCURVES.push({ c, id, len: c.getLength(), far: mat === cavFar }); return m; };
  sinus(SSSP, (u) => 0.22 + 0.3 * u, 'sss');
  sinus(ISSP, (u) => 0.12 + 0.08 * u, 'iss'); sinus(STR, 0.3, 'iss');
  const galv = sinus([V3(XM, 5.6, -7.9), V3(XM, 6.5, -9.4), GAL], 0.26, 'iss');
  [-1, 1].forEach((s) => { sinus(TRS(s), s < 0 ? 0.5 : 0.42, 'tr'); sinus(SIG(s), (u) => (s < 0 ? 0.5 : 0.42) + 0.15 * u, 'tr'); sinus(SPS(s), 0.12, 'pet'); sinus(IPS(s), 0.13, 'pet'); sinus(SPH(s), 0.11, 'cav', s < 0 ? cavFar : null); sinus(OPH(s), 0.12, 'cav', s < 0 ? cavFar : null); });
  const confM = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 14), SINM.sss); confM.position.copy(CONF); confM.userData.pick = 's:sss'; pick.push(confM); SKG.add(confM);
  // пещеристые синусы: губчатые объёмы с сонной артерией и нервами
  const CAVG = new THREE.Group(); SKG.add(CAVG);
  const CAVN = [], CAV_N = [[0.55, 0.6, 'III'], [0.63, 0.28, 'IV'], [0.66, -0.06, 'V₁'], [0.6, -0.42, 'V₂'], [0.2, -0.3, 'VI']];   // нервы и ВСА видны при выборе пещеристого
  const nEnd = (k) => CAVC(1).add(V3(CAV_N[k][0] * 0.9, CAV_N[k][1] + 0.1, 1.9));
  const cavM = mphys('#E8A050', { r: 0.4, em: 0.18, op: 0.42, side: THREE.DoubleSide });
  const icaM = mphys('#D8404A', { r: 0.4, em: 0.2 }), nM = mphys('#F4C542', { r: 0.45, em: 0.22 });
  [-1, 1].forEach((s) => {
    const c = CAVC(s), sp = new THREE.Mesh(ell3(0.75, 0.85, 1.55, c, 24), cavM); sp.userData.pick = 's:cav'; pick.push(sp); CAVG.add(sp);
    const ica = new THREE.Mesh(new THREE.TubeGeometry(cr3([c.clone().add(V3(s * 0.2, -2.6, -1.6)), c.clone().add(V3(s * 0.05, -0.6, -1.3)), c.clone().add(V3(0, -0.2, 0.4)), c.clone().add(V3(0, 0.3, 1.2)), c.clone().add(V3(-s * 0.1, 0.9, 0.8)), c.clone().add(V3(-s * 0.3, 1.5, 0.2))]), 48, 0.22, 10), icaM); CAVG.add(ica); CAVN.push(ica);
    CAV_N.forEach(([dx, dy]) => { const m = new THREE.Mesh(new THREE.TubeGeometry(cr3([c.clone().add(V3(s * dx, dy, -2.0)), c.clone().add(V3(s * dx, dy, 0)), c.clone().add(V3(s * dx * 0.9, dy + 0.1, 1.9))]), 16, 0.07, 6), nM); CAVG.add(m); CAVN.push(m); if (s < 0) m.userData.far = true; });
  });
  const ICS = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.1, 8, 32), SINM.pet); ICS.position.set(XM, 1.05, -4.8); ICS.rotation.x = Math.PI / 2; ICS.scale.set(1, 0.75, 1); SKG.add(ICS);
  const PIT = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), mphys('#E8B0C8', { r: 0.5, em: 0.12 })); PIT.position.set(XM, 0.9, -4.8); SKG.add(PIT);
  // серп и намёт
  const durM = mphys('#9FC2E8', { r: 0.6, em: 0.1, op: 0.26, side: THREE.DoubleSide });
  const sCurve = cr3(SSSP), lCurve = cr3([V3(XM, 2.8, 2.3), ...ISSP.slice(1), ...STR.slice(1)]);
  const sheet = (A, B, n, m) => { const pos = [], ix = []; for (let i = 0; i <= n; i++) { const a = A(i / n), b = B(i / n); for (let j = 0; j <= m; j++) { const p = a.clone().lerp(b, j / m); pos.push(p.x, p.y, p.z); } }
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const a = i * (m + 1) + j, b = a + 1, c = a + m + 1, d = c + 1; ix.push(a, c, b, b, c, d); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(ix); g.computeVertexNormals(); return g; };
  const FALX3 = new THREE.Mesh(sheet((u) => sCurve.getPointAt(u), (u) => lCurve.getPointAt(u), 60, 8), durM); SKG.add(FALX3);
  const TENT = [-1, 1].map((s) => {
    const att = cr3([CONF, ...TRS(s).slice(1), ...SPS(s).slice(1, -1).reverse(), CAVC(s).clone().add(V3(s * 0.4, 0.6, -1.0))]);
    const free = cr3([...STR.slice().reverse(), GAL.clone().add(V3(s * 1.8, -0.9, 1.6)), V3(XM + s * 2.4, 3.4, -5.4), CAVC(s).clone().add(V3(s * 0.2, 0.9, 0.9))]);
    const m = new THREE.Mesh(sheet((u) => att.getPointAt(u), (u) => free.getPointAt(u), 60, 6), durM); SKG.add(m); return m;
  });
  // поток крови: частицы по синусам к яремным венам
  const NPF = 220, PF = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.9 }), NPF); PF.frustumCulled = false; SKG.add(PF);
  const tot = SINCURVES.reduce((s, c) => s + c.len, 0), parts = [];
  for (let k = 0; k < NPF; k++) { let x = rnd() * tot, ci = 0; while (x > SINCURVES[ci].len && ci < SINCURVES.length - 1) { x -= SINCURVES[ci].len; ci++; } parts.push({ ci, u: rnd(), sp: 0.6 + 0.6 * rnd() }); }
  // направление: от начала кривой к концу (кривые заданы по току крови, кроме глазных/клиновидно-теменных — тоже к пещеристому)
  const dum = new THREE.Object3D();

  // =================== виды ===================
  const VP = DK ? { lay: [V3(80, 3.4, 2.5), V3(0.2, 0.14, 1), 13, 2, -0.2], sin: [V3(-0.5, 4.5, -6.5), V3(0.95, 0.42, 0.42), 55, 7.4, 0.3], cav: [V3(0.2, 1.0, -4.8), V3(0.45, 0.4, 1), 11, 2.6, 0] }
    : { lay: [V3(80, 3.5, 2.5), V3(0.2, 0.14, 1), 12.5, 0, -0.2], sin: [V3(-0.5, 4.5, -6.5), V3(0.95, 0.42, 0.42), 40, 0, -0.3], cav: [V3(0.2, 1.0, -4.8), V3(0.45, 0.4, 1), 20, 0, 0.3] };
  const VIEW = {}; Object.entries(VP).forEach(([k, a]) => { VIEW[k] = vw(...a); });
  const curView = () => (st.mode === 'sin' ? (st.sin === 'cav' ? 'cav' : 'sin') : 'lay');
  function applyView() { st.fly = VIEW[curView()]; }
  camera.position.copy(VIEW.lay.pos); controls.target.copy(VIEW.lay.target);

  // =================== подсветка ===================
  const DIMC = new THREE.Color(0x3a3f4a);
  const dimM = (m, on) => { if (!m.userData.c0) m.userData.c0 = m.color.clone(); m.color.copy(m.userData.c0); if (!on) m.color.lerp(DIMC, 0.7); m.emissiveIntensity = on ? m.userData.em0 : 0; };
  function colorAll() {
    const L = st.mode !== 'sin'; SLAB.visible = L; SKG.visible = !L;
    Object.values(LM).forEach((m) => { const p = m.userData.part, on = st.mode !== 'lay' || !st.sel || st.sel === p; if (!m.userData.c0) m.userData.c0 = m.color.clone();   // невыбранные слои — серые, но непрозрачные (иначе срез просвечивает насквозь)
      m.color.copy(m.userData.c0); if (!on) m.color.lerp(DIMC, 0.7); setOp(m, m.userData.op0); m.emissiveIntensity = st.mode === 'lay' && st.sel === p ? 0.32 : on ? m.userData.em0 : 0; });
    const sOn = st.mode !== 'lay' || !st.sel || st.sel === 'sss'; dimM(sssM, sOn); dimM(veinM, sOn || st.sel === 'bone' || st.sel === 'scalp');
    dimM(granM, st.mode !== 'lay' || !st.sel || st.sel === 'arach' || st.sel === 'sss'); dimM(artM, st.mode !== 'lay' || !st.sel || ['dura', 'arach', 'pia'].includes(st.sel));
    trabM.opacity = st.mode !== 'lay' || !st.sel || st.sel === 'arach' ? 0.7 : 0.1;
    MN_SIN.forEach((s) => { const m = SINM[s.id], on = !st.sin || st.sin === s.id; setOp(m, on ? 1 : st.sin === 'cav' ? (s.id === 'pet' ? 0.3 : 0.06) : 0.18); m.emissiveIntensity = st.sin === s.id ? 0.5 : 0.22; });
    setOp(cavFar, !st.sin ? 1 : 0.18); FARM.forEach((m) => { m.visible = st.sin !== 'cav'; }); SINMESH.forEach(({ m, id }) => { if (m.material !== cavFar) m.visible = st.sin !== 'cav' || id === 'cav' || id === 'pet'; }); confM.visible = st.sin !== 'cav'; cavFar.emissiveIntensity = 0.22;
    setOp(cavM, !st.sin || st.sin === 'cav' ? (st.sin === 'cav' ? 0.3 : 0.42) : 0.1); CAVN.forEach((m) => { m.visible = st.sin === 'cav' && !m.userData.far; }); SKS.visible = st.sin !== 'cav';
    setOp(durM, st.sin === 'cav' ? 0.04 : st.sin && st.sin !== 'sss' && st.sin !== 'iss' && st.sin !== 'tr' ? 0.1 : 0.26);
  }

  // =================== анимация ===================
  let lastG = -1;
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    if (st.mode === 'bleed' && st.bleed !== 'none' && st.g < 1) st.g = Math.min(1, st.g + dt / 2.6);
    const gq = Math.round(st.g * 40) / 40; if (gq !== lastG) { lastG = gq; buildLayers(); buildFace(); buildBleed(); }
    if (st.mode === 'sin') {
      let n = 0; parts.forEach((p) => { const c = SINCURVES[p.ci]; if (st.flow) { p.u += dt * p.sp * 2.2 / c.len; if (p.u > 1) p.u -= 1; } const on = (!st.sin || st.sin === c.id) && !(c.far && st.sin === 'cav'); dum.position.copy(c.c.getPointAt(p.u)); dum.scale.setScalar(on ? 1 : 0.001); dum.updateMatrix(); PF.setMatrixAt(n++, dum.matrix); });
      PF.instanceMatrix.needsUpdate = true; PF.visible = st.flow && st.sin !== 'cav';
    }
  }

  // =================== выбор ===================
  function setMode(m) { st.mode = m; if (m === 'bleed' && st.bleed === 'none') { st.bleed = 'epi'; st.g = 0; } if (m !== 'bleed') { st.bleed = 'none'; st.g = 0; } st.sel = null; colorAll(); applyView(); refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setSel(id) { st.sel = id === 'all' || st.sel === id ? null : id; colorAll(); refs.lseg && refs.lseg.sync(); refs.setInfo && refs.setInfo(); }
  function setBleed(id) { st.bleed = id; st.g = 0; colorAll(); refs.bseg && refs.bseg.sync(); refs.setInfo && refs.setInfo(); }
  function setSin(id) { const prev = st.sin; st.sin = id === 'all' || st.sin === id ? null : id; colorAll(); if ((prev === 'cav') !== (st.sin === 'cav')) applyView(); refs.sseg && refs.sseg.sync(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => pick.filter((m) => m.visible !== false && (st.mode === 'sin' ? m.userData.pick.startsWith('s:') : !m.userData.pick.startsWith('s:'))), (id) => {
    if (st.mode === 'lay') setSel(id); else if (st.mode === 'sin' && id.startsWith('s:')) setSin(id.slice(2));
  });

  // =================== подписи ===================
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const S = (th, r, z = ZF) => () => { const p = P2(th, typeof r === 'function' ? r(th) : r); return SLAB.localToWorld(V3(p.x, p.y, z)); };
  const lay1 = () => st.mode === 'lay', bl = () => st.mode === 'bleed', sinM = () => st.mode === 'sin';
  const lOn = (id, dk) => () => lay1() && (st.sel === id || (!st.sel && (!dk || DK)));
  const sOn = (id, dk) => () => sinM() && st.sin !== 'cav' && (st.sin === id || (!st.sin && (!dk || DK)));
  const labels = [
    lb('кожа', S(-0.66, 11.1), '#E8B8A0', lOn('scalp'), true),
    lb('сухожильный шлем', S(-0.5, 10.67), '#F0EEE8', () => lay1() && st.sel === 'scalp', true),
    lb('рыхлая клетчатка', S(-0.36, 10.53), '#F4E2C8', () => lay1() && st.sel === 'scalp', true),
    lb('надкостница', S(-0.22, 10.42), '#E8E0D0', () => lay1() && st.sel === 'scalp', true),
    lb('плотная клетчатка', S(-0.58, 10.85), '#E8C4A8', () => lay1() && st.sel === 'scalp', true),
    lb('наружный листок', S(0.3, 9.74), '#B8D4F0', () => lay1() && st.sel === 'dura'),
    lb('внутренний листок', S(0.62, 9.54), '#9FC2E8', () => lay1() && st.sel === 'dura'),
    lb('кость', S(-0.7, 10.1), '#F2E6C8', lOn('bone'), true),
    lb('диплоэ', S(0.62, 10.12), '#D8B890', () => lay1() && st.sel === 'bone'),
    lb('диплоическая вена', S(0.35, 10.12), '#9CB8FF', () => lay1() && st.sel === 'bone'),
    lb('выпускник', S(-0.12, 10.6, ZF + 0.06), '#9CB8FF', () => lay1() && (st.sel === 'bone' || st.sel === 'sss'), true),
    lb('твёрдая оболочка', S(0.45, 9.6), '#9FC2E8', lOn('dura')),
    lb('серп мозга', () => SLAB.localToWorld(V3(0, 2.8, ZF)), '#9FC2E8', () => lay1() && (st.sel === 'dura' || (!st.sel && DK)), true),
    lb('средняя менингеальная артерия', () => SLAB.localToWorld(MMA.position.clone().setZ(ZF)), '#F08A8A', () => (lay1() && st.sel === 'dura') || (bl() && st.bleed === 'epi')),
    lb('паутинная оболочка', S(0.55, (th) => R.ar1(th) - 0.04), '#D8E4F0', lOn('arach')),
    lb('подпаутинное пространство', S(0.65, (th) => (R.ar0(th) + R.pia1(th)) / 2), '#7FC0F0', () => lOn('arach', true)() || (bl() && st.bleed === 'sah')),
    lb('грануляции', () => SLAB.localToWorld(gran[1].userData.head.position.clone().setZ(ZF + 0.05)), '#E8EEF4', () => lay1() && (st.sel === 'arach' || st.sel === 'sss')),
    lb('мягкая оболочка', S(0.75, (th) => R.pia1(th) - 0.03), '#E890A8', lOn('pia')),
    lb('кора', S(0.5, (th) => R.cx(th) - 0.35), '#C8B0B8', () => lay1() && st.sel === 'pia'),
    lb('верхний сагиттальный синус', S(-0.07, 9.15), '#9CB0FF', () => lay1() || bl(), true),
    lb('мостовая вена', S(0.22, (th) => R.ar0(th) - 0.05, ZF + 0.06), '#9CB8FF', () => (lay1() && st.sel === 'sss') || (bl() && st.bleed === 'sub')),
    lb('гематома', S(0.48, (th) => 9.84 - dEpi(th) / 2), '#FF8A8A', () => bl() && st.bleed === 'epi' && st.g > 0.5),
    lb('гематома', S(0.42, (th) => 9.44 - dEpi(th) - dSub(th) / 2), '#FF8A8A', () => bl() && st.bleed === 'sub' && st.g > 0.5),
    lb('кровь в бороздах', S(0.2, (th) => R.cx(th) - 0.4), '#FF8A8A', () => bl() && st.bleed === 'sah' && st.g > 0.5),
    lb('кость', S(-0.6, 10.1), '#F2E6C8', bl, true),
    lb('твёрдая', S(-0.42, 9.6), '#9FC2E8', () => bl() && (DK || st.bleed !== 'epi'), true),
    lb('паутинная', S(-0.3, (th) => R.ar1(th)), '#D8E4F0', () => bl() && DK, true),
    lb('верхний сагиттальный синус', () => SSSP[3].clone(), '#9CB0FF', sOn('sss')),
    lb('сток синусов', () => CONF.clone(), '#9CB0FF', sOn('sss', true), true),
    lb('нижний сагиттальный', () => ISSP[2].clone(), '#C8B0FF', sOn('iss', true)),
    lb('большая мозговая вена', () => V3(XM, 5.9, -8.4), '#C8B0FF', () => sinM() && st.sin === 'iss'),
    lb('прямой синус', () => STR[1].clone(), '#C8B0FF', sOn('iss')),
    lb('поперечный синус', () => TRS(1)[2].clone(), '#8FD8F0', sOn('tr'), true),
    lb('сигмовидный синус', () => SIG(1)[2].clone(), '#8FD8F0', sOn('tr'), true),
    lb('внутренняя яремная вена', () => SIG(1)[6].clone(), '#8FD8F0', sOn('tr', true), true),
    lb('серп мозга', () => sCurve.getPointAt(0.35).lerp(lCurve.getPointAt(0.35), 0.5), '#B8D4F0', () => sinM() && !st.sin && DK),
    lb('намёт мозжечка', () => TRS(1)[3].clone().lerp(V3(XM, 4.2, -9), 0.45), '#B8D4F0', () => sinM() && (!st.sin || st.sin === 'tr') && DK),
    lb('пещеристый синус', () => CAVC(1).add(V3(0.35, 1.05, -0.9)), '#F0C080', () => sinM() && (st.sin === 'cav' || (!st.sin && DK))),
    lb('верхний каменистый', () => SPS(1)[1].clone(), '#A8E8C8', () => sinM() && st.sin === 'pet'),
    lb('нижний каменистый', () => IPS(1)[2].clone(), '#A8E8C8', () => sinM() && st.sin === 'pet'),
    lb('внутренняя сонная артерия', () => CAVC(1).add(V3(-0.3, 1.5, 0.2)), '#F08A8A', () => sinM() && st.sin === 'cav', true),
    lb('гипофиз', () => PIT.position.clone().add(V3(0, -0.5, 0)), '#F0B8D0', () => sinM() && st.sin === 'cav'),
    ...CAV_N.map((n, k) => lb(n[2], () => nEnd(k), '#F4D06A', () => sinM() && st.sin === 'cav', k === 4)),
    lb('межпещеристые синусы', () => V3(XM, 1.05, -3.8), '#A8E8C8', () => sinM() && st.sin === 'pet'),
    lb('глазная вена', () => OPH(1)[1].clone(), '#F0C080', () => sinM() && st.sin === 'cav'),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO = '<b>От кожи до коры</b> — около 1,5 см: скальп, кость и три оболочки мозга. Твёрдая прирастает к кости, паутинная прилегает к твёрдой, мягкая облегает мозг. Между паутинной и мягкой — подпаутинное пространство с ликвором, в котором мозг словно плавает. Толщины слоёв на срезе изменены для наглядности. Выберите слой.';
  const INTRO3 = '<b>Синусы твёрдой оболочки</b> — каналы между её слоями, по которым кровь мозга оттекает к внутренним яремным венам. Стенки синусов не спадаются, клапанов в них нет. Почти вся кровь сходится к стоку на затылке, а оттуда по поперечным и сигмовидным синусам уходит в шею. Выберите синус.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'lay') { const p = MN_LAY.find((x) => x.id === st.sel); ib.info.innerHTML = p ? p.text : INTRO; return; }
      if (st.mode === 'bleed') { ib.info.innerHTML = MN_BLEED.find((b) => b.id === st.bleed).text; return; }
      const s = MN_SIN.find((x) => x.id === st.sin); ib.info.innerHTML = s ? s.text : INTRO3;
    };
    refs.modeSeg = seg([{ id: 'lay', label: 'Слои' }, { id: 'bleed', label: 'Кровоизлияния' }, { id: 'sin', label: 'Синусы' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.lseg = refs.bseg = refs.sseg = null;
      if (st.mode === 'lay') {
        refs.lseg = seg([{ id: 'all', label: 'Все' }, ...MN_LAY.map((p) => ({ id: p.id, label: p.name, color: p.col }))], () => st.sel || 'all', (v) => setSel(v));
        box.append(h('div', { class: 'glabel' }, 'Слой', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.lseg));
      } else if (st.mode === 'bleed') {
        refs.bseg = seg(MN_BLEED.slice(1).map((b) => ({ id: b.id, label: b.name, color: b.col })), () => st.bleed, (v) => setBleed(v));
        box.append(h('div', { class: 'glabel' }, 'Кровоизлияние'), h('div', { class: 'gctl' }, refs.bseg, button('Заново', () => { st.g = 0; })));
      } else {
        refs.sseg = seg([{ id: 'all', label: 'Все' }, ...MN_SIN.map((s) => ({ id: s.id, label: s.name, color: s.col }))], () => st.sin || 'all', (v) => setSin(v));
        box.append(h('div', { class: 'glabel' }, 'Синус', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.sseg));
        view.append(toggle('Ток крови', () => st.flow, (v) => { st.flow = v; }));
      }
      view.append(refs.rot, refs.lab);
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'Вид', h('kbd', {}, 'R · N')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['lay', 'bleed', 'sin'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'lay') setSel('all'); else if (st.mode === 'sin') setSin('all'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'lay') return [['Ликвора', '≈ 150', 'мл'], ['Образуется', '≈ 500', 'мл/сут']];
    if (st.mode === 'bleed') return [['Пространство', st.bleed === 'epi' ? 'над твёрдой' : st.bleed === 'sub' ? 'под твёрдой' : 'с ликвором', '']];
    return [['Кровоток мозга', '≈ 750', 'мл/мин'], ['Синусов', '≈ 11', 'типов']];
  }
  const self = {
    labelBg: true, mobZoom: 0.85, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'lay' ? (st.sel ? MN_LAY.find((p) => p.id === st.sel).col : '#9FC2E8') : st.mode === 'bleed' ? '#C83040' : (st.sin ? MN_SIN.find((s) => s.id === st.sin).col : '#6F8FE8'); },
    kicker: 'Мозг · устройство', title: 'Оболочки мозга и синусы',
    lede: 'Мозг окружён тремя оболочками и плавает в ликворе, а кровь от него уходит по жёстким каналам в твёрдой оболочке — синусам. Здесь же видно, почему кровоизлияния над и под твёрдой оболочкой выглядят и протекают по-разному.',
    notes: `
      <div><h2>Устройство</h2>
        <p>Мозговые оболочки — твёрдая, паутинная и мягкая — продолжаются в позвоночный канал и окружают спинной мозг. Твёрдая оболочка черепа срастается с костью и образует перегородки: серп между полушариями, намёт над мозжечком, серп мозжечка и диафрагму седла над гипофизом.</p>
        <p>Синусы твёрдой оболочки собирают кровь от мозга, глаз, среднего уха и костей черепа. Через выпускники и глазные вены они связаны с венами лица и скальпа.</p></div>
      <div><h2>Как это работает</h2>
        <p>Ликвор (≈ 150 мл) вырабатывают сосудистые сплетения желудочков — около 500 мл в сутки, то есть он обновляется 3–4 раза. Из желудочков он выходит в подпаутинное пространство, омывает мозг и спинной мозг и всасывается в венозные синусы через грануляции паутинной оболочки. В ликворе мозг весит не 1,4 кг, а около 50 г.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Менингит</b> — воспаление мягкой и паутинной оболочек: головная боль, жар, ригидность мышц шеи. Бактериальный менингит смертельно опасен; от основных возбудителей есть прививки.</li>
        <li><b>Эпидуральную и субдуральную гематомы и субарахноидальное кровоизлияние</b> различают на КТ по форме: линза, полумесяц, кровь в бороздах и цистернах.</li>
        <li><b>Тромбоз венозных синусов</b> — редкая причина инсульта у молодых: при беременности, приёме гормональных контрацептивов, обезвоживании.</li>
        <li><b>Люмбальная пункция</b> — ликвор берут иглой ниже конца спинного мозга — между III и IV или IV и V поясничными позвонками.</li>
        <li><b>Головная боль</b> часто исходит от оболочек и их сосудов: сам мозг боли не чувствует.</li></ul></div>
      <div><h2>Условности</h2><ul><li>На срезе толщины слоёв изменены: оболочки и подпаутинное пространство показаны толще, чем на самом деле. Синусы — гладкие трубки одного сечения; серп и намёт — полупрозрачные листы, сосудистые сплетения и вены мозга, кроме мостовой и большой мозговой, не показаны. Ток крови ускорен.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим · <code>Esc</code> сбросить выбор</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`
  };
  colorAll();
  return self;
}
export { makeMenin };
