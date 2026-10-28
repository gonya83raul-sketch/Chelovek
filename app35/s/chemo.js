import { Sparks, THREE, V3, __set_rnd, displaceGeo, envTex, flyStep, flyTarget, glassMat, glowNucleus, group, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, organMat, rand, randUnit, rnd, seg, smooth, taperTube, toggle } from '../core.js';


/* =========================================================
   ОРГАНЫ ЧУВСТВ · ОБОНЯНИЕ И ВКУС
   ========================================================= */
const OD_TYPES = ['#FF6A5A', '#F2C14E', '#7FE0A0', '#4FA3FF', '#C77DFF', '#FF8AB0', '#7FD6C8', '#E8E0C0'];
const ODORS = [
  { id: 'rose', name: 'Роза', rec: [0, 5, 4], text: '<b>Роза.</b> Аромат — смесь десятков молекул (фенилэтиловый спирт, гераниол, цитронеллол…). Каждая возбуждает несколько типов рецепторов, и мозг узнаёт запах по <b>узору</b> активных клубочков.' },
  { id: 'coffee', name: 'Кофе', rec: [1, 2, 6, 3], text: '<b>Кофе</b> — больше 800 летучих веществ. Узор шире и сложнее: так мозг отличает «кофе» от отдельных его компонентов.' },
  { id: 'orange', name: 'Апельсин', rec: [1, 7, 2], text: '<b>Апельсин</b> — в основном лимонен. Другой набор рецепторов — другой узор клубочков в луковице.' },
  { id: 'smoke', name: 'Дым', rec: [3, 4, 0, 6], text: '<b>Дым.</b> Запах гари обрабатывается быстро и вызывает тревогу: обонятельный путь идёт прямо в миндалину и древнюю кору, минуя таламус.' },
];
const TASTES = [
  { id: 'sweet', name: 'Сладкое', color: '#FF8AB0', text: '<b>Сладкое</b> — сахара и некоторые белки и подсластители. Рецептор T1R2+T1R3 в клетках II типа. Сигнал «здесь энергия».' },
  { id: 'umami', name: 'Умами', color: '#F2C14E', text: '<b>Умами</b> — вкус глутамата (бульон, сыр, томаты, соевый соус), рецептор T1R1+T1R3. Сигнал «здесь белок». Описан японским химиком Кикунаэ Икэдой в 1908 году.' },
  { id: 'bitter', name: 'Горькое', color: '#7FE0A0', text: '<b>Горькое</b> — около 25 разных рецепторов T2R. Самая высокая чувствительность: многие яды горькие. Сигнал «осторожно».' },
  { id: 'sour', name: 'Кислое', color: '#7FD6FF', text: '<b>Кислое</b> — ионы водорода (кислоты), клетки III типа. Сигнал о незрелых или испорченных продуктах.' },
  { id: 'salty', name: 'Солёное', color: '#E8E0C0', text: '<b>Солёное</b> — ионы натрия проходят через натриевые каналы ENaC. Нужно для водно-солевого баланса.' },
];
function makeChemo() {
  __set_rnd(mulberry(2222));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0x7fe0a0);
  const VIEW = { smell: flyTarget(V3(-0.15, -0.05, 0), V3(-1.9, -0.2, 6.5)), tongue: flyTarget(V3(30, -0.9, 0.2), V3(30.0, 3.0, 4.4)), bud: flyTarget(V3(60, -0.75, 0), V3(61.8, 0.6, 5.8)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 120); camera.position.copy(VIEW.smell.pos);
  const controls = makeControls(camera, VIEW.smell.target); controls.minDistance = 1; controls.maxDistance = 16;
  /* ---------- обоняние ---------- */
  const sm = new THREE.Group(); scene.add(sm);
  // полость носа — сагиттальный профиль (вид с медиальной стороны на латеральную стенку): ноздря спереди-снизу, спинка носа,
  // свод под решётчатой пластинкой, клиновидная кость сзади, хоаны, дно — твёрдое нёбо
  const CAV_PTS = [[-2.38, -0.92], [-2.3, -0.62], [-2.0, -0.22], [-1.55, 0.12], [-1.0, 0.38], [-0.5, 0.47], [0.85, 0.47], [1.15, 0.3], [1.3, -0.05], [1.25, -0.55], [1.12, -0.98], [0.2, -1.06], [-1.2, -1.05], [-1.95, -1.02]];
  const cavShape = new THREE.Shape(new THREE.SplineCurve(CAV_PTS.concat([CAV_PTS[0]]).map(([x, y]) => new THREE.Vector2(x, y))).getPoints(120));
  const cav = new THREE.ExtrudeGeometry(cavShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 4, curveSegments: 60 }); cav.translate(0, 0, -0.3);
  sm.add(new THREE.Mesh(cav, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8a0a0).multiplyScalar(0.3), roughness: 0.4, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide })), new THREE.Mesh(cav, glassMat(0xffb8b0, { rim: 0.22, base: 0.006, pow: 2.2 })));
  // латеральная стенка — слизистая (на неё крепятся раковины)
  { const g = new THREE.ShapeGeometry(cavShape, 60); g.translate(0, 0, -0.3); sm.add(new THREE.Mesh(g, organMat('#B86A70', 0.2, { transparent: true, opacity: 0.6, depthWrite: false, side: THREE.DoubleSide }))); }
  // носовые раковины — завитки, приросшие к латеральной стенке верхним краем: выпуклость медиально, свободный нижний край («губа») подвёрнут
  // к стенке; верхняя короткая (у обонятельной зоны), средняя, нижняя — самая длинная. Сечение — дуга θ ∈ [0; 0,92π]
  const conchaGeo = (x0, x1, yTop, h, w, slope) => {
    const NU = 48, NV = 18, pos = [], idx = [];
    for (let i = 0; i <= NU; i++) { const u = i / NU, x = x0 + (x1 - x0) * u, sc = 0.3 + 0.7 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 0.5), yc = yTop - h * sc + slope * (u - 0.5);
      for (let j = 0; j <= NV; j++) { const th = 0.92 * Math.PI * j / NV; pos.push(x, yc + h * sc * Math.cos(th), -0.3 + w * sc * Math.sin(th) * (1 - 0.25 * j / NV)); } }
    for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) { const a = i * (NV + 1) + j, b = a + NV + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  };
  const conchaMat = organMat('#F0AAA8', 0.55, { side: THREE.DoubleSide });
  [[-0.7, 0.45, 0.2, 0.1, 0.2, 0.06], [-1.15, 0.75, -0.08, 0.15, 0.28, 0.08], [-1.65, 0.95, -0.5, 0.2, 0.34, 0.1]].forEach(([x0, x1, yTop, hh, ww, sl]) => sm.add(new THREE.Mesh(conchaGeo(x0, x1, yTop, hh, ww, sl), conchaMat)));
  // преддверие носа (ноздря)
  sm.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([V3(-2.45, -0.9, -0.05), V3(-2.25, -0.78, -0.05), V3(-2.0, -0.6, -0.05)]), (u) => 0.13 + 0.05 * u, 20, 14), organMat('#E8A0A0', 0.42, { transparent: true, opacity: 0.4, depthWrite: false })));
  // клубочки луковицы: по одному на тип рецептора, в ряд вдоль луковицы
  const GLOM = OD_TYPES.map((c, i) => { const p = V3(-0.42 + i * 0.16, 0.8 + (i % 2 ? 0.035 : -0.035), (i % 3 - 1) * 0.06); const n = glowNucleus(sm, p, c, 0.035, 6); n.spr.material.opacity = 0.25; return { p, n, act: 0 }; });
  // решётчатая пластинка — продырявленная: через каждое отверстие проходит пучок аксонов (обонятельные нити) к своему клубочку
  const HOLE = GLOM.map((g, i) => V3(g.p.x + 0.02, 0.5, (i % 2 ? 0.07 : -0.07)));
  { const sh = new THREE.Shape([new THREE.Vector2(-0.6, -0.3), new THREE.Vector2(0.9, -0.3), new THREE.Vector2(0.9, 0.3), new THREE.Vector2(-0.6, 0.3)]);
    HOLE.forEach((hp) => { const hc = new THREE.Path(); hc.absarc(hp.x, -hp.z, 0.04, 0, Math.PI * 2, true); sh.holes.push(hc); });
    for (let k = 0; k < 14; k++) { const hc = new THREE.Path(); hc.absarc(-0.5 + k * 0.1 + 0.03 * (k % 2), (k % 2 ? 0.2 : -0.21), 0.025, 0, Math.PI * 2, true); sh.holes.push(hc); }   // мелкие отверстия по краям
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: false, curveSegments: 16 }); g.rotateX(-Math.PI / 2); g.translate(0, 0.48, 0);
    sm.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8d8bb).multiplyScalar(0.45), roughness: 0.6, transparent: true, opacity: 0.75, side: THREE.DoubleSide }))); }
  const bulbG = displaceGeo(new THREE.SphereGeometry(1, 40, 28), (v) => { v.set(v.x * 0.78, v.y * 0.2, v.z * 0.24); }); bulbG.translate(0.15, 0.82, 0);
  sm.add(new THREE.Mesh(bulbG, organMat('#F2D8C0', 0.4, { transparent: true, opacity: 0.4, depthWrite: false })));
  const TRACT = new THREE.CatmullRomCurve3([V3(0.9, 0.86, 0), V3(1.4, 0.93, 0), V3(1.8, 1.02, 0), V3(2.2, 1.16, 0)]);
  sm.add(new THREE.Mesh(taperTube(TRACT, () => 0.07, 30, 10), organMat('#F2D8C0', 0.4)));
  // рецепторные нейроны: типы перемешаны в эпителии свода, но аксоны одного типа собираются в пучок и идут в один клубочек
  const REC = []; const recMatArr = OD_TYPES.map((c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.5), emissive: new THREE.Color(c), emissiveIntensity: 0.1, roughness: 0.4 }));
  const epiY = (x) => 0.3 - 0.08 * smooth(0.5, 0.9, x);
  { const eg = displaceGeo(new THREE.PlaneGeometry(1.35, 0.4, 30, 8).rotateX(-Math.PI / 2), (v) => { v.x += 0.12; v.y = epiY(v.x) - 0.04 + 0.01 * noise3(v.x * 9, 0, v.z * 9); });
    sm.add(new THREE.Mesh(eg, organMat('#7FE0A0', 0.3, { transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }))); }
  for (let i = 0; i < 40; i++) {
    const ty = i % 8, x = -0.5 + rnd() * 1.25, z = rand(-0.18, 0.18), y = epiY(x), H = HOLE[ty], G = GLOM[ty].p;
    const soma = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), recMatArr[ty]); soma.position.set(x, y, z); soma.scale.y = 1.6; sm.add(soma);
    const ax = new THREE.CatmullRomCurve3([V3(x, y + 0.03, z), V3((x + H.x) / 2, 0.4, (z + H.z) / 2), V3(H.x, 0.465, H.z), V3(H.x, 0.53, H.z), V3((H.x + G.x) / 2, 0.68, (H.z + G.z) / 2), G]);
    sm.add(new THREE.Mesh(new THREE.TubeGeometry(ax, 20, 0.005, 4), recMatArr[ty]));
    for (let k = 0; k < 4; k++) sm.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(V3(x, y - 0.03, z), V3(x + rand(-0.05, 0.05), y - 0.1, z + rand(-0.05, 0.05))), 2, 0.003, 3), recMatArr[ty]));   // реснички в слизь
    REC.push({ ty, p: V3(x, y, z), ax });
  }
  /* ---------- язык ---------- */
  const tg = new THREE.Group(); tg.position.set(30, 0, 0); scene.add(tg); tg.visible = false;
  // полюса сферы — на кончике и корне, не на спинке
  const tongueG = displaceGeo(new THREE.SphereGeometry(1, 96, 64).rotateX(Math.PI / 2), (v) => { let x = v.x * 0.9, y = v.y * 0.28, z = v.z * 1.5; if (z > 0.6) { const k = 1 - 0.3 * (z - 0.6) / 0.9; x *= k; } if (y > 0) y += 0.02 * noise3(v.x * 30, v.y * 30, v.z * 30) - 0.06 * Math.exp(-((x / 0.06) ** 2)); v.set(x, y, z); });
  const tongue = new THREE.Mesh(tongueG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xd87880).multiplyScalar(0.36), roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.5, sheen: 0.25, sheenColor: new THREE.Color(0xffb0b8), envMapIntensity: 0.35 })); tg.add(tongue);
  // грибовидные — только впереди пограничной борозды (за V желобоватых их нет), гуще к кончику
  const papG = []; for (let i = 0; i < 260; i++) { const z = rand(-0.4, 1.35), x = rand(-0.8, 0.8) * (z > 0.6 ? 1 - 0.3 * (z - 0.6) / 0.9 : 1); if (rnd() > 0.35 + 0.5 * (z + 0.4) / 1.75) continue; if (z < -0.5 + Math.abs(x) * 0.6 || x * x / 0.64 + z * z / 2.25 > 0.85) continue; const g = new THREE.SphereGeometry(0.022, 8, 6); g.translate(x, 0.27 * Math.sqrt(Math.max(0, 1 - x * x / 0.81 - z * z / 2.25)) + 0.01, z); papG.push(g); }
  tg.add(new THREE.Mesh(mergeGeometries(papG), organMat('#FF9AA8', 0.5)));
  const cvG = []; for (let i = 0; i < 9; i++) { const a = (i - 4) / 4, x = a * 0.5, z = -0.55 + Math.abs(a) * 0.3; const g = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16); g.translate(x, 0.24, z); cvG.push(g); }
  tg.add(new THREE.Mesh(mergeGeometries(cvG), organMat('#FFB0B8', 0.55)));
  [1, -1].forEach((s) => { for (let k = 0; k < 5; k++) { const g = new THREE.BoxGeometry(0.02, 0.06, 0.12); g.translate(0.8 * s, 0.12, -0.3 + k * 0.08); tg.add(new THREE.Mesh(g, organMat('#FFB0B8', 0.5))); } });
  /* ---------- вкусовая почка ---------- */
  const bud = new THREE.Group(); bud.position.set(60, 0, 0); scene.add(bud); bud.visible = false;
  const epi = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 1.6), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8a0a8).multiplyScalar(0.35), roughness: 0.5, transparent: true, opacity: 0.12, depthWrite: false })); epi.position.y = -0.38; bud.add(epi);   // верх эпителия = верх почки: пора открывается на поверхность
  { const g = new THREE.TorusGeometry(0.07, 0.018, 8, 28); g.rotateX(Math.PI / 2); g.translate(0, 0.42, 0); bud.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xffe0d0).multiplyScalar(0.5), roughness: 0.4, emissive: 0x402820, emissiveIntensity: 0.4 }))); }
  const budShell = displaceGeo(new THREE.SphereGeometry(1, 40, 30), (v) => { v.set(v.x * 0.42, v.y * 0.62, v.z * 0.42); }); budShell.translate(0, -0.2, 0);
  bud.add(new THREE.Mesh(budShell, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2d8c0).multiplyScalar(0.4), transparent: true, opacity: 0.2, depthWrite: false, roughness: 0.3 })), new THREE.Mesh(budShell, glassMat(0xffe0d0, { rim: 0.4, base: 0.01, pow: 2 })));
  const PORE = V3(0, 0.42, 0);
  const TC = []; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + rnd() * 0.2, r = 0.2 + rnd() * 0.1, ty = TASTES[i % 5]; const bot = V3(Math.cos(a) * r, -0.7, Math.sin(a) * r), top = V3(Math.cos(a) * 0.05, 0.35, Math.sin(a) * 0.05);
    const c = new THREE.CatmullRomCurve3([bot, V3(Math.cos(a) * (r + 0.1), -0.2, Math.sin(a) * (r + 0.1)), top]); const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(ty.color).multiplyScalar(0.45), emissive: new THREE.Color(ty.color), emissiveIntensity: 0.1, roughness: 0.4, transparent: true, opacity: 0.85 });
    bud.add(new THREE.Mesh(taperTube(c, (u) => 0.035 * Math.sin(Math.min(1, u * 1.1) * Math.PI) + 0.008, 20, 8), m));
    const nerve = new THREE.CatmullRomCurve3([bot, bot.clone().add(V3(0, -0.25, 0)), V3(bot.x * 0.3, -1.2, bot.z * 0.3)]); bud.add(new THREE.Mesh(new THREE.TubeGeometry(nerve, 10, 0.008, 4), new THREE.MeshPhysicalMaterial({ color: 0xf4c542, emissive: 0x403000, emissiveIntensity: 0.4 })));
    TC.push({ ty: ty.id, m, nerve, top }); }
  const fx = new Sparks(2400, 0.05); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'smell', labels: true, rot: false, fly: null, odor: null, odT: -99, taste: null, taT: -99, msg: null };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; sm.visible = m === 'smell'; tg.visible = m === 'tongue'; bud.visible = m === 'bud'; st.fly = VIEW[m]; refs.setInfo && refs.setInfo(); }
  function smell(id) { st.odor = ODORS.find((o) => o.id === id); st.odT = st.t; if (st.mode !== 'smell') setMode('smell'); st.msg = st.odor.text; refs.oSeg && refs.oSeg.sync(); refs.setInfo(); }
  function taste(id) { st.taste = TASTES.find((x) => x.id === id); st.taT = st.t; if (st.mode !== 'bud') setMode('bud'); st.msg = st.taste.text; refs.tSeg && refs.tSeg.sync(); refs.setInfo(); }
  const NOSTRIL = V3(-2.25, -0.8, 0);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    const ko = t - st.odT, od = st.odor;
    if (st.mode === 'smell') {
      if (od && ko > 0 && ko < 6) for (let j = 0; j < 3; j++) { const c = new THREE.Color(OD_TYPES[od.rec[Math.floor(rnd() * od.rec.length)]]); fx.spawn(NOSTRIL.clone().add(randUnit().multiplyScalar(0.08)), V3(1.1 + rnd() * 0.4, 0.45 + rnd() * 0.3, rand(-0.1, 0.1)), c, 1.4, 0.3, 1.0); }
      GLOM.forEach((g, i) => { const on = od && od.rec.includes(i) && ko > 1 && ko < 8; g.act += ((on ? 1 : 0) - g.act) * Math.min(1, dt * 3); g.n.spr.material.opacity = 0.2 + 0.8 * g.act; g.n.spr.scale.setScalar(0.035 * (6 + 6 * g.act)); });
      recMatArr.forEach((m, i) => { m.emissiveIntensity = 0.1 + 0.9 * GLOM[i].act; });
      REC.forEach((r) => { if (GLOM[r.ty].act > 0.3 && rnd() < 0.15) { fx.spawn(r.ax.getPointAt(rnd()), V3(0, 0, 0), new THREE.Color(OD_TYPES[r.ty]), 0.3, 0, 1.2); } });
      if (od && ko > 1.5 && ko < 8 && rnd() < 0.6) fx.spawn(TRACT.getPointAt(rnd()), V3(0.3, 0, 0), new THREE.Color(0xf4c542), 0.5, 0, 1.2);
    }
    const kt = t - st.taT, ta = st.taste;
    if (st.mode === 'bud') {
      if (ta && kt > 0 && kt < 5) for (let j = 0; j < 2; j++) fx.spawn(PORE.clone().add(bud.position).add(V3(rand(-0.5, 0.5), 0.8 + rnd() * 0.4, rand(-0.3, 0.3))), V3(0, -0.6, 0), new THREE.Color(ta.color), 1.4, 0.4, 1.2);
      TC.forEach((c) => { const on = ta && c.ty === ta.id && kt > 1 && kt < 6; c.m.emissiveIntensity += ((on ? 1.1 : 0.1) - c.m.emissiveIntensity) * Math.min(1, dt * 4); if (on && rnd() < 0.2) fx.spawn(c.nerve.getPointAt(rnd()).add(bud.position), V3(0, -0.4, 0), new THREE.Color(0xf4c542), 0.4, 0, 1.2); });
    }
    fx.update(dt);
  }
  const TXT = {
    smell: '<b>Обоняние.</b> В своде носовой полости — обонятельный эпителий (~5 см²) с ~10 млн рецепторных нейронов. Каждый нейрон несёт рецептор одного типа из ~400; все нейроны одного типа отправляют аксоны через решётчатую кость в один и тот же <b>клубочек</b> обонятельной луковицы. Запах кодируется узором активных клубочков. Обонятельные нейроны живут 1–2 месяца и постоянно обновляются. Выберите запах.',
    tongue: '<b>Язык</b> покрыт сосочками: грибовидными (по всей поверхности), желобоватыми (крупные, буквой V у корня) и листовидными (по бокам). Во вкусовых сосочках — 2000–8000 вкусовых почек. «Карта вкусов» с зонами сладкого на кончике и горького у корня — миф: все пять вкусов чувствуются всей поверхностью.',
    bud: '<b>Вкусовая почка</b> — «бочонок» из 50–100 клеток с порой на вершине. Клетки разных типов реагируют на разные вкусы и передают сигнал волокнам лицевого, языкоглоточного и блуждающего нервов → ствол → таламус → вкусовая кора островка. Клетки живут 10–14 дней. Выберите вкус.',
  };
  const labels = [
    { text: 'ноздря', pos: V3(-2.35, -0.95, 0.1), color: '#E8A0A0', show: () => st.labels && st.mode === 'smell' },
    { text: 'носовые раковины', pos: V3(-0.6, -0.5, 0.05), color: '#E8A0A0', show: () => st.labels && st.mode === 'smell' },
    { text: 'обонятельный эпителий', pos: V3(-0.55, 0.26, 0.2), color: '#7FE0A0', show: () => st.labels && st.mode === 'smell' },
    { text: 'решётчатая пластинка', pos: V3(0.9, 0.5, 0.3), color: '#e8d8bb', show: () => st.labels && st.mode === 'smell' },
    { text: 'обонятельная луковица · клубочки', pos: V3(-0.6, 1.05, 0.2), color: '#F2D8C0', show: () => st.labels && st.mode === 'smell' },
    { text: 'обонятельный тракт → кора и миндалина', pos: TRACT.getPointAt(0.3).add(V3(0, 0.05, 0)), color: '#F4C542', show: () => st.labels && st.mode === 'smell' },
    { text: 'кончик', pos: V3(30, 0.3, 1.5), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'желобоватые сосочки', pos: V3(30.6, 0.35, -0.45), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'листовидные', pos: V3(30.95, 0.2, -0.1), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'грибовидные', pos: V3(29.5, 0.35, 0.6), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'вкусовая пора', pos: V3(60.12, 0.5, 0.05), color: '#ffe0d0', show: () => st.labels && st.mode === 'bud' },
    { text: 'рецепторные клетки', pos: V3(60.5, -0.1, 0.3), color: '#ffb0b8', show: () => st.labels && st.mode === 'bud' },
    { text: 'нервные волокна', pos: V3(60.3, -1.15, 0.1), color: '#F4C542', show: () => st.labels && st.mode === 'bud' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 360px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'smell', label: 'Обоняние' }, { id: 'tongue', label: 'Язык' }, { id: 'bud', label: 'Вкусовая почка' }], () => st.mode, (v) => setMode(v));
    refs.oSeg = seg(ODORS.map((o) => ({ id: o.id, label: o.name })), () => st.odor && st.odor.id, (v) => smell(v));
    refs.tSeg = seg(TASTES.map((x) => ({ id: x.id, label: x.name, color: x.color })), () => st.taste && st.taste.id, (v) => taste(v));
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), group('Понюхать', '', refs.oSeg), group('Попробовать', '', refs.tSeg), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['smell', 'tongue', 'bud'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'smell' ? [['Типов рецепторов', '≈400', ''], ['Активных клубочков', GLOM.filter((g) => g.act > 0.5).length, '']] : [['Вкусовых почек', '2–8', 'тыс.'], ['Базовых вкусов', 5, '']]; }
  const self = {
    labelBg: true, mobZoom: 0.85, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#7FE0A0',
    kicker: 'Органы чувств · химические', title: 'Обоняние и вкус',
    lede: 'Два химических чувства: нос различает тысячи запахов по узору сотен рецепторов, язык — пять базовых вкусов. Вместе они дают то, что мы называем вкусом еды.',
    notes: `
      <div><h2>Вкус еды — это в основном запах</h2><p>Когда мы жуём, летучие вещества поднимаются из ротоглотки в нос (ретроназальное обоняние). Поэтому при насморке еда кажется безвкусной: язык по-прежнему чувствует сладкое и солёное, а «аромат» пропадает.</p>
        <h3>Особенность обоняния</h3><p>Это единственное чувство, сигналы которого попадают в кору, минуя таламус, — прямо в древнюю кору, миндалину и энторинальную кору. Поэтому запахи так сильно связаны с эмоциями и воспоминаниями. За открытие обонятельных рецепторов Ричард Аксель и Линда Бак получили Нобелевскую премию 2004 года.</p></div>
      <div><h2>Условности</h2><ul><li>Показаны 8 типов рецепторов вместо ~400.</li><li>Почка и эпителий сильно увеличены.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeChemo };
