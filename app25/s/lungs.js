import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, button, dimOthers, displaceGeo, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, organMat, pickOn, rand, randUnit, range, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ДЫХАТЕЛЬНАЯ СИСТЕМА
   ========================================================= */
const LG_PARTS = [
  { id: 'nose', name: 'Нос и глотка', color: '#E8A890', text: '<b>Носовая полость</b> согревает, увлажняет и очищает воздух: волоски и слизь задерживают пыль, реснички мерцательного эпителия гонят её к глотке. Раковины носа закручивают поток. Дальше воздух проходит через <b>глотку</b> — перекрёсток с пищеварительным путём.' },
  { id: 'lar', name: 'Гортань', color: '#F2D18A', text: '<b>Гортань</b> — хрящевая «коробка» с голосовыми связками. При глотании её закрывает надгортанник, чтобы пища не попала в дыхательные пути. Колебания сомкнутых связок рождают голос.' },
  { id: 'tr', name: 'Трахея и бронхи', color: '#E8DCC8', text: '<b>Трахея</b> (10–12 см) держится открытой благодаря 16–20 хрящевым полукольцам. Она делится на два главных бронха, те — на долевые, сегментарные и всё более мелкие: около 23 поколений ветвлений до альвеол. Это бронхиальное дерево.' },
  { id: 'lung', name: 'Лёгкие', color: '#E89AA8', text: '<b>Лёгкие</b> — губчатые органы в плевральных мешках. Правое лёгкое больше и делится на три доли, левое — на две: часть места занимает сердце (сердечная вырезка). Внутри около 300–500 млн альвеол.' },
  { id: 'dia', name: 'Диафрагма', color: '#C86A6A', text: '<b>Диафрагма</b> — главная дыхательная мышца, купол между грудной и брюшной полостями. Сокращаясь, она уплощается и опускается на 1,5–7 см, объём грудной клетки растёт — воздух входит. Ей помогают наружные межрёберные мышцы, поднимающие рёбра.' },
];
function makeLungs() {
  __set_rnd(mulberry(1313));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06070a); scene.environment = envTex;
  labLights(scene, 0x8fc0ff);
  const VIEW = { tract: flyTarget(V3(0.0, 2.3, 0), V3(3.0, 3.65, 8.9)), alv: flyTarget(V3(29.6, -0.8, 0), V3(31.8, 0.9, 7.6)), mech: flyTarget(V3(0.0, 1.85, 0), V3(-2.2, 2.6, 7.6)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.tract.pos);
  const controls = makeControls(camera, VIEW.tract.target); controls.minDistance = 1.5; controls.maxDistance = 22;
  const body = new THREE.Group(); scene.add(body);
  bodyShell(body, { rim: 0.2, arms: true });
  const PART = Object.fromEntries(LG_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}, parent = body) => { const m = organMat(PART[id].color, o.k ?? 0.42, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  /* ---------- лёгкие ---------- */
  const LUNG = [1, -1].map((s) => ({ s, c: V3(0.5 * s, 2.25, -0.04), r: s < 0 ? V3(0.45, 0.66, 0.44) : V3(0.4, 0.72, 0.42) }));  // правое шире и короче (печень), левое уже (сердце)
  const inLung = (p, L, k = 0.92) => { const d = p.clone().sub(L.c), n = V3(d.x / L.r.x, d.y / L.r.y, d.z / L.r.z);
    if (n.x * L.s < -0.45) return false;                                         // за плоской медиальной стороной
    if (L.s > 0 && n.x < 0.05 && n.z > 0.05 && n.y < 0.1) return false;            // сердечная вырезка левого лёгкого
    return n.lengthSq() < k * k && p.x * L.s > 0.1; };
  const lungMeshes = LUNG.map((L) => {
    const g = displaceGeo(new THREE.SphereGeometry(1, 80, 60), (v) => {
      let x = v.x, y = v.y, z = v.z;
      if (y > 0) { const k = 1 - 0.45 * y ** 2.2; x *= k; z *= k; }                    // верхушка
      if (y < -0.6) y = -0.6 + (y + 0.6) * 0.35 + 0.18 * (1 - x * x - z * z) * 0.3;   // основание над диафрагмой
      if (x * L.s < -0.3) x = L.s * (-0.3 + (x * L.s + 0.3) * 0.35) * L.s * L.s;      // плоская медиальная сторона
      if (L.s > 0 && x < -0.1 && z > 0.1 && y < 0.1 && y > -0.75) x += 0.25 * smooth(0.1, 0.6, z) * smooth(-0.1, -0.5, x); // сердечная вырезка
      v.set(x * L.r.x, y * L.r.y, z * L.r.z).multiplyScalar(1 + 0.015 * noise3(v.x * 5, v.y * 5, v.z * 5));
    });
    g.translate(L.c.x, L.c.y, L.c.z);
    // щели между долями — тёмные полосы
    const pos = g.attributes.position, col = new Float32Array(pos.count * 3), v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); const ly = v.y - L.c.y, lz = v.z - L.c.z; const obl = ly - (-0.25 + 0.75 * lz); let k = 1 - 0.75 * Math.exp(-((obl / 0.025) ** 2)); if (L.s < 0 && obl > 0) k *= 1 - 0.75 * Math.exp(-(((ly - 0.05) / 0.022) ** 2)) * smooth(-0.2, 0.15, lz); col.set([k, k, k], i * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = add('lung', g, { k: 0.5, mat: { vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, sheen: 0.5, roughness: 0.6 } });
    m.userData.base = L.c.clone(); return m;
  });
  /* ---------- дыхательные пути ---------- */
  const TRACH = new THREE.CatmullRomCurve3([V3(0, 3.38, 0.12), V3(0, 3.0, 0.08), V3(0, 2.62, 0.02)]);
  add('tr', taperTube(TRACH, () => 0.075, 40, 16), { k: 0.5, mat: { transparent: true, opacity: 0.75 } });
  for (let i = 0; i < 16; i++) { const p = TRACH.getPointAt(i / 16 + 0.02), t2 = TRACH.getTangentAt(i / 16); const m = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 6, 24, Math.PI * 1.5), PART.tr.mats[0]); m.position.copy(p); m.quaternion.setFromUnitVectors(V3(0, 0, 1), t2); m.rotateZ(Math.PI * 0.75); body.add(m); }
  // гортань: щитовидный хрящ — две пластины углом вперёд (кадык), под ним перстневидное кольцо, внутри — просвет
  const lar = add('lar', (() => { const a = [];
    [1, -1].forEach((sd) => { const pl = new THREE.BoxGeometry(0.15, 0.17, 0.018, 2, 2, 1); pl.translate(0.075 * sd, 0, 0); pl.rotateY(-0.55 * sd); pl.translate(0, 3.52, 0.22); a.push(pl); });
    const cr = new THREE.TorusGeometry(0.085, 0.022, 10, 28); cr.rotateX(Math.PI / 2); cr.translate(0, 3.39, 0.14); a.push(cr);
    const lum = new THREE.CylinderGeometry(0.085, 0.08, 0.26, 16, 1); lum.translate(0, 3.5, 0.14); a.push(lum);
    return mergeGeometries(a.map((g) => g.toNonIndexed())); })(), { k: 0.5 });
  const epig = add('lar', ell3(0.07, 0.02, 0.06, V3(0, 3.66, 0.12)), { k: 0.6 });
  const NOSE = new THREE.CatmullRomCurve3([V3(0, 4.05, 0.5), V3(0, 4.12, 0.3), V3(0, 4.05, 0.05), V3(0, 3.85, -0.06), V3(0, 3.65, 0.02), V3(0, 3.5, 0.12)]);
  add('nose', taperTube(NOSE, (u) => (u < 0.4 ? 0.09 : 0.065), 60, 14), { k: 0.5, mat: { transparent: true, opacity: 0.7 } });
  [0.08, -0.02, -0.12].forEach((dy) => add('nose', ell3(0.03, 0.02, 0.16, V3(0.045, 4.12 + dy, 0.28)), { k: 0.55 }));
  // бронхиальное дерево
  const brArr = [], tips = [[], []];
  function grow(p, dir, len, r, depth, L, li) {
    let e = p.clone().addScaledVector(dir, len), tries = 0;
    while (!inLung(e, L) && tries++ < 6) { dir = dir.clone().lerp(L.c.clone().sub(p).normalize(), 0.4).normalize(); e = p.clone().addScaledVector(dir, len * 0.85); }
    brArr.push(taperTube(new THREE.CatmullRomCurve3([p, p.clone().lerp(e, 0.5).add(randUnit().multiplyScalar(len * 0.06)), e]), (u) => r * (1 - 0.25 * u), 6, 6));
    if (depth <= 0) { tips[li].push(e); return; }
    const ax = randUnit().cross(dir).normalize();
    [1, -1].forEach((sgn) => { const d2 = dir.clone().applyAxisAngle(ax, sgn * rand(0.35, 0.65)); grow(e, d2, len * 0.78, r * 0.72, depth - 1, L, li); });
  }
  LUNG.forEach((L, li) => {
    const start = V3(0, 2.62, 0.02), hil = V3(0.38 * L.s, 2.4, -0.02);
    brArr.push(taperTube(new THREE.CatmullRomCurve3([start, start.clone().lerp(hil, 0.5).add(V3(0, 0.02, 0)), hil]), () => 0.052, 12, 10));
    [V3(0.3 * L.s, 0.8, 0.1), V3(0.4 * L.s, -0.5, 0.25), V3(0.3 * L.s, -0.7, -0.4)].forEach((d) => grow(hil, d.normalize(), 0.28, 0.04, 6, L, li));
  });
  add('tr', mergeGeometries(brArr), { k: 0.36, mat: { emissiveIntensity: 0.03, color: new THREE.Color('#e0c0b8').multiplyScalar(0.36) } });
  /* ---------- диафрагма и рёбра ---------- */
  // купол: RingGeometry с кольцами (у CircleGeometry есть только центр и край — выходил конус)
  const diaG = displaceGeo(new THREE.RingGeometry(0.001, 1, 64, 16).rotateX(-Math.PI / 2), (v) => { const r = Math.hypot(v.x, v.z); v.y = 0.42 * (1 - r * r) + 0.08 * Math.exp(-(((v.x + 0.45) / 0.35) ** 2)) * (1 - r) - 0.05 * Math.exp(-((v.x / 0.2) ** 2)); v.x *= 0.9; v.z *= 0.52; });
  const dia = add('dia', diaG, { k: 0.38, mat: { side: THREE.DoubleSide, transparent: true, opacity: 0.55 } }); dia.position.y = 1.4;
  const ribs = new THREE.Group(); body.add(ribs); ribs.visible = false;
  const ribMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8d8bb).multiplyScalar(0.45), roughness: 0.6, transparent: true, opacity: 0.3, depthWrite: false, envMapIntensity: 0.4 });
  const RIBS = [];
  for (let i = 0; i < 10; i++) { const y = 2.85 - i * 0.16, w = 0.55 + 0.45 * Math.sin(Math.min(1, (i + 1) / 6) * Math.PI / 2) - (i > 6 ? (i - 6) * 0.04 : 0); const piv = new THREE.Group(); piv.position.set(0, y, -0.42); ribs.add(piv);
    [1, -1].forEach((s) => { const c = new THREE.CatmullRomCurve3([V3(0.08 * s, 0, 0), V3(w * 0.75 * s, -0.05, -0.02), V3(w * s, -0.18, 0.3), V3(w * 0.7 * s, -0.3, 0.75), V3(0.12 * s, -0.36 - i * 0.02, 0.92)]); piv.add(new THREE.Mesh(taperTube(c, () => 0.028, 40, 6), ribMat)); });
    RIBS.push(piv); }
  // позвоночник (17 позвонков с дисками-зазорами) и грудина — только в режиме «Вдох и выдох»
  const SPC = new THREE.CatmullRomCurve3([V3(0, 3.3, -0.45), V3(0, 2.4, -0.5), V3(0, 1.2, -0.42), V3(0, 0.2, -0.38)]), vertArr = [];
  for (let i = 0; i < 17; i++) { const u = (i + 0.5) / 17, p = SPC.getPointAt(u), g = new THREE.CylinderGeometry(0.06 + 0.025 * u, 0.06 + 0.025 * u, 0.13 + 0.05 * u, 12); g.translate(p.x, p.y, p.z); vertArr.push(g); }
  ribs.add(new THREE.Mesh(mergeGeometries(vertArr), ribMat));
  ribs.add(new THREE.Mesh(tube([V3(0, 2.82, 0.52), V3(0, 2.2, 0.56), V3(0, 1.85, 0.52)], 0.045, 16, 8), ribMat));
  // сердце: геометрия в нуле, место — через position (иначе поворот уносит его вокруг начала мира в правое лёгкое)
  // капля: широкое основание вверху справа, верхушка влево-вниз
  const heartGeo = displaceGeo(new THREE.SphereGeometry(1, 36, 28), (v) => { const k = v.y < 0 ? 1 + 0.55 * v.y : 1; v.set(v.x * 0.27 * k, v.y * 0.34, v.z * 0.24 * k); });
  const heartG = new THREE.Mesh(heartGeo, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xb8444a).multiplyScalar(0.5), roughness: 0.4, transparent: true, opacity: 0.55, depthWrite: false })); heartG.position.copy(BODY.heart).add(V3(0.06, 0, 0)); heartG.rotation.z = 0.55; body.add(heartG);
  /* ---------- альвеолы (вынесены в сторону) ---------- */
  const alv = new THREE.Group(); alv.position.set(30, 0, 0); scene.add(alv); alv.visible = false;
  const BRL = new THREE.CatmullRomCurve3([V3(-2.6, 1.0, 0), V3(-1.6, 0.6, 0.05), V3(-0.8, 0.15, 0)]);
  alv.add(new THREE.Mesh(taperTube(BRL, (u) => 0.22 - 0.06 * u, 30, 18), organMat('#d8b8b0', 0.36, { transparent: true, opacity: 0.6, depthWrite: false })));
  const ALV = [];
  const alvMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf0b0b8).multiplyScalar(0.45), roughness: 0.35, clearcoat: 0.6, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide, sheen: 0.6, sheenColor: new THREE.Color(0xffd0d8), envMapIntensity: 0.4 });
  const alvGlass = glassMat(0xffc0c8, { rim: 0.45, base: 0.01, pow: 2 });
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2, b = Math.acos(rand(-0.85, 0.95)), R = 0.75 + rnd() * 0.25; const c = V3(Math.cos(a) * Math.sin(b) * R, Math.cos(b) * R * 0.9 - 0.2, Math.sin(a) * Math.sin(b) * R).add(V3(0.15, -0.2, 0));
    if (c.x < -0.6) continue; const r = 0.32 + rnd() * 0.1;
    const g = new THREE.SphereGeometry(r, 28, 20); g.translate(c.x, c.y, c.z); alv.add(new THREE.Mesh(g, alvMat), new THREE.Mesh(g, alvGlass)); ALV.push({ c, r });
  }
  // капиллярная сеть на альвеолах
  const capArr = [], CAPS = [];
  ALV.forEach((A, i) => { for (let k = 0; k < 3; k++) { const n = randUnit(), t1 = randUnit().cross(n).normalize(), t2 = n.clone().cross(t1); const pts = []; for (let j = 0; j <= 10; j++) { const ang = j / 10 * Math.PI * 1.6 - 0.8; pts.push(A.c.clone().addScaledVector(t1.clone().multiplyScalar(Math.cos(ang)).add(n.clone().multiplyScalar(Math.sin(ang))), A.r * 1.04)); } const c = new THREE.CatmullRomCurve3(pts); capArr.push(new THREE.TubeGeometry(c, 20, 0.022, 5)); CAPS.push(c); } });
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0x8a3a50, roughness: 0.4, emissive: 0x401020, emissiveIntensity: 0.5, transparent: true, opacity: 0.85 });
  alv.add(new THREE.Mesh(mergeGeometries(capArr), capMat));
  // артериола (синяя) и венула (красная)
  alv.add(new THREE.Mesh(tube([V3(-2.4, -0.6, -0.6), V3(-1.2, -0.7, -0.7), V3(-0.3, -0.9, -0.8)], 0.09, 30, 10), organMat('#6C86E0', 0.5)));
  alv.add(new THREE.Mesh(tube([V3(-0.2, -1.1, 0.7), V3(-1.3, -0.95, 0.75), V3(-2.4, -0.85, 0.7)], 0.09, 30, 10), organMat('#E0605A', 0.5)));
  const RBC = []; const rbcG = new THREE.TorusGeometry(0.035, 0.02, 8, 16); const rbcM = []; for (let i = 0; i < 60; i++) { const m = new THREE.MeshPhysicalMaterial({ color: 0x6c86e0, roughness: 0.35, clearcoat: 0.5, emissive: 0x200810, emissiveIntensity: 0.4 }); const me = new THREE.Mesh(rbcG, m); alv.add(me); RBC.push({ me, m, c: CAPS[Math.floor(rnd() * CAPS.length)], u: rnd() }); }
  const fx = new Sparks(2400, 0.06); scene.add(fx.obj);

  /* ---------- состояние и дыхание ---------- */
  const st = { t: 0, mode: 'tract', sel: null, labels: true, rot: false, fly: null, rr: 16, act: 'calm', actT: -9, V: 2400, spiro: [], msg: null, ph: 0 };
  const ACT = {
    calm: { name: 'Спокойное дыхание', text: '<b>Спокойное дыхание.</b> 12–18 вдохов в минуту, дыхательный объём ~500 мл. Вдох активный (сокращаются диафрагма и наружные межрёберные мышцы), выдох пассивный: эластичные лёгкие сами спадаются.' },
    deep: { name: 'Глубокий вдох', text: '<b>Максимальный вдох.</b> Сверх обычного вдоха можно набрать ещё ~3000 мл — резервный объём вдоха. Работают и вспомогательные мышцы шеи и груди.' },
    forced: { name: 'Форсированный выдох', text: '<b>Форсированный выдох.</b> Брюшные и внутренние межрёберные мышцы выталкивают ещё ~1200 мл — резервный объём выдоха. Около 1200 мл остаётся в лёгких всегда (остаточный объём). Максимальный вдох + максимальный выдох = жизненная ёмкость лёгких, ЖЕЛ ≈ 3,5–5 л.' },
    hold: { name: 'Задержка дыхания', text: '<b>Задержка дыхания.</b> CO₂ в крови растёт, хеморецепторы продолговатого мозга и сонных артерий посылают всё более сильный сигнал в дыхательный центр — и вдох становится неизбежным. Главный стимул дыхания — именно CO₂, а не нехватка кислорода.' },
  };
  function volAt(t) {
    const base = 2400, tid = 500, w = 2 * Math.PI * st.rr / 60;
    let v = base + tid * 0.5 * (1 - Math.cos(w * t)); const k = t - st.actT;
    if (st.act === 'deep' && k > 0 && k < 6) v += 3000 * Math.sin(Math.min(1, k / 2.5) * Math.PI / 2) * (k > 3.5 ? Math.max(0, 1 - (k - 3.5) / 2.5) : 1);
    if (st.act === 'forced' && k > 0 && k < 6) v -= 1200 * Math.sin(Math.min(1, k / 2) * Math.PI / 2) * (k > 3.5 ? Math.max(0, 1 - (k - 3.5) / 2.5) : 1);
    if (st.act === 'hold' && k > 0 && k < 7) v = st.holdV;
    return v;
  }
  function act(a) { st.act = a; st.actT = st.t; if (a === 'hold') st.holdV = st.V; if (st.mode !== 'mech') setMode('mech'); st.msg = ACT[a].text; refs.setInfo(); }
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(LG_PARTS.map((p) => PART[p.id]), st.sel); lungMeshes.forEach((m) => { m.material.opacity = !st.sel ? 0.5 : st.sel === 'lung' ? 0.75 : 0.06; m.material.depthWrite = false; }); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = m === 'mech' ? ACT[st.act].text : null; body.visible = m !== 'alv'; alv.visible = m === 'alv'; ribs.visible = m === 'mech'; st.fly = VIEW[m]; refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode !== 'alv') select(id); });
  const C_O2 = new THREE.Color(0x9fe0ff), C_CO2 = new THREE.Color(0xf2c14e), C_B = new THREE.Color(0x6c86e0), C_R = new THREE.Color(0xe0605a);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    const V = volAt(t), dV = V - st.V; st.V = V; st.spiro.push([t, V]); while (st.spiro.length && t - st.spiro[0][0] > 12) st.spiro.shift();
    const k = (V - 2400) / 3000;  // 0 — покой, 1 — полный вдох
    lungMeshes.forEach((m, i) => { const L = LUNG[i]; m.scale.set(1 + 0.12 * k, 1 + 0.16 * k, 1 + 0.12 * k); m.position.copy(L.c).multiplyScalar(-1).multiply(m.scale).add(L.c).add(V3(0, -0.08 * k, 0)); });
    dia.position.y = 1.4 - 0.28 * k; dia.scale.y = 1 - 0.45 * Math.max(0, k);
    RIBS.forEach((r, i) => { r.rotation.x = -0.12 * k * (0.6 + i * 0.05); });
    // поток воздуха в путях
    if (st.mode !== 'alv' && Math.abs(dV) > 0.4) { const n = Math.min(4, Math.abs(dV) / 2); for (let j = 0; j < n; j++) { const u = rnd(); const p = u < 0.5 ? NOSE.getPointAt(u * 2) : TRACH.getPointAt((u - 0.5) * 2); fx.spawn(p.add(randUnit().multiplyScalar(0.03)), V3(0, dV > 0 ? -0.4 : 0.4, 0), dV > 0 ? C_O2 : C_CO2, 0.4, 1, 1.2); } }
    if (st.mode !== 'alv' && dV > 0.4) for (let j = 0; j < 3; j++) { const li = rnd() < 0.5 ? 0 : 1, tp = tips[li][Math.floor(rnd() * tips[li].length)]; fx.spawn(tp.clone(), randUnit().multiplyScalar(0.03), C_O2, 0.5, 2, 1.0); }
    // альвеолы: газообмен
    if (st.mode === 'alv') {
      const breath = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * st.rr / 60);
      alv.children.forEach((c) => { if (c.material === alvMat) c.scale.setScalar(1); });
      RBC.forEach((b) => { b.u += dt * 0.12; if (b.u > 1) { b.u = 0; b.c = CAPS[Math.floor(rnd() * CAPS.length)]; } const p = b.c.getPointAt(b.u); b.me.position.copy(p); b.me.lookAt(p.clone().add(b.c.getTangentAt(b.u))); b.m.color.copy(C_B).lerp(C_R, smooth(0.2, 0.7, b.u)); });
      for (let j = 0; j < 3; j++) { const A = ALV[Math.floor(rnd() * ALV.length)], d = randUnit(); fx.spawn(A.c.clone().addScaledVector(d, A.r * 0.6), d.clone().multiplyScalar(0.25), C_O2, 1.0, 0.5, 1.2); }
      for (let j = 0; j < 2; j++) { const A = ALV[Math.floor(rnd() * ALV.length)], d = randUnit(); fx.spawn(A.c.clone().addScaledVector(d, A.r * 1.08), d.clone().multiplyScalar(-0.22), C_CO2, 1.0, 0.5, 1.2); }
      if (rnd() < 0.3 + 0.5 * breath) fx.spawn(BRL.getPointAt(rnd()).add(randUnit().multiplyScalar(0.08)), BRL.getTangentAt(0.5).multiplyScalar(0.6), C_O2, 0.8, 0.3, 1.0);
    }
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); scopeShow(st.mode === 'mech'); if (st.mode !== 'mech') return;
    const Y = (v) => hgt - 10 - (v / 6200) * (hgt - 22), x = (tt) => 8 + (1 - (st.t - tt) / 12) * (w - 16);
    ctx.font = '500 9px JetBrains Mono, monospace';
    [[1200, 'ОО'], [2400, 'покой'], [2900, '+ДО'], [5900, 'макс.']].forEach(([v, l]) => { ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(8, Y(v)); ctx.lineTo(w - 8, Y(v)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillText(l, w - 40, Y(v) - 2); });
    ctx.lineWidth = 2; ctx.strokeStyle = '#9FE0FF'; ctx.beginPath(); st.spiro.forEach(([tt, v], i) => { i ? ctx.lineTo(x(tt), Y(v)) : ctx.moveTo(x(tt), Y(v)); }); ctx.stroke();
    ctx.fillStyle = '#9FE0FF'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('спирограмма, мл', 10, 13);
  }
  const TXT = {
    tract: '<b>Дыхательная система.</b> Воздух идёт через нос, глотку, гортань и трахею в бронхиальное дерево и заканчивается в альвеолах — микроскопических пузырьках, где кислород переходит в кровь, а углекислый газ — из крови в воздух. Нажмите на орган.',
    alv: '<b>Альвеолы и газообмен.</b> Каждая альвеола (0,2–0,3 мм) оплетена капиллярами. Барьер между воздухом и кровью тоньше 1 мкм, а общая площадь всех альвеол — 70–100 м², примерно треть теннисного корта. Кислород (голубой) диффундирует в кровь, где его связывает гемоглобин эритроцитов — они краснеют. CO₂ (жёлтый) уходит в воздух. Изнутри альвеолы покрыты сурфактантом — он не даёт им слипаться.',
    mech: '<b>Механика дыхания.</b> Лёгкие сами не сокращаются: они следуют за грудной клеткой. Диафрагма опускается, рёбра поднимаются — давление в лёгких падает ниже атмосферного, и воздух входит. Ритм задаёт дыхательный центр продолговатого мозга. Попробуйте кнопки справа.',
  };
  const labels = [
    { text: 'носовая полость', pos: V3(0.1, 4.2, 0.42), color: '#E8A890', show: () => st.labels && st.mode !== 'alv' },
    { text: 'гортань', pos: V3(0.15, 3.5, 0.22), color: '#F2D18A', show: () => st.labels && st.mode !== 'alv' },
    { text: 'трахея', pos: V3(0.12, 2.95, 0.12), color: '#E8DCC8', show: () => st.labels && st.mode !== 'alv' },
    { text: 'правое лёгкое · 3 доли', pos: V3(-0.85, 2.75, 0.2), color: '#E89AA8', show: () => st.labels && st.mode !== 'alv' },
    { text: 'левое лёгкое · 2 доли', pos: V3(0.85, 2.75, 0.2), color: '#E89AA8', show: () => st.labels && st.mode !== 'alv' },
    { text: 'диафрагма', pos: V3(0.6, 1.55, 0.45), color: '#C86A6A', show: () => st.labels && st.mode !== 'alv' },
    { text: 'сердце', pos: BODY.heart.clone().add(V3(0.1, -0.05, 0.3)), color: '#FF8A7A', show: () => st.labels && st.mode === 'tract' },
    { text: 'бронхиола', pos: V3(28.0, 0.9, 0.2), color: '#E8DCC8', show: () => st.labels && st.mode === 'alv' },
    { text: 'альвеолы', pos: V3(31.0, 0.75, 0.6), color: '#F0B0B8', show: () => st.labels && st.mode === 'alv' },
    { text: 'капилляры', pos: V3(30.6, -0.4, 1.05), color: '#c86a80', show: () => st.labels && st.mode === 'alv' },
    { text: 'от сердца (венозная)', pos: V3(27.7, -0.5, -0.6), color: '#8CA0F0', show: () => st.labels && st.mode === 'alv' },
    { text: 'к сердцу (артериальная)', pos: V3(27.7, -0.75, 0.75), color: '#E0605A', show: () => st.labels && st.mode === 'alv' },
    { text: 'O₂', pos: V3(30.9, 0.1, 0.9), color: '#9FE0FF', show: () => st.labels && st.mode === 'alv' },
    { text: 'CO₂', pos: V3(29.7, 0.4, 0.9), color: '#F2C14E', show: () => st.labels && st.mode === 'alv' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode !== 'alv' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'tract', label: 'Дыхательные пути' }, { id: 'alv', label: 'Альвеолы' }, { id: 'mech', label: 'Вдох и выдох' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...LG_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode === 'alv') setMode('tract'); select(v); });
    const rr = range('rr', 6, 40, 1, () => st.rr, (v) => { st.rr = v; }, (v) => v + '/мин');
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 420px' }, h('div', { class: 'glabel' }, 'Органы', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)),
      group('Дыхание', 'D · F · H', ...Object.entries(ACT).map(([k2, a], i) => button(a.name, () => act(k2), i === 1)), rr), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['tract', 'alv', 'mech'][n - 1]); return true; }
    if (k === 'd' || k === 'в') { act('deep'); return true; } if (k === 'f' || k === 'а') { act('forced'); return true; } if (k === 'h' || k === 'р') { act('hold'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'alv' ? [['Альвеол', '300–500', 'млн'], ['Площадь', '70–100', 'м²']] : [['Объём лёгких', Math.round(st.V), 'мл'], ['Частота', st.rr, '/мин']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#9FE0FF',
    kicker: 'Тело · дыхание', title: 'Дыхательная система',
    lede: 'Около 20 000 вдохов в сутки. Воздух проходит по ветвящемуся дереву бронхов к сотням миллионов альвеол, где кислород за доли секунды переходит в кровь.',
    notes: `
      <div><h2>Объёмы лёгких</h2><ul>
        <li>Дыхательный объём — ~500 мл (из них ~150 мл остаются в «мёртвом пространстве» путей).</li>
        <li>Резервный объём вдоха — ~3000 мл, выдоха — ~1200 мл.</li><li>Остаточный объём — ~1200 мл, выдохнуть его нельзя.</li>
        <li>ЖЕЛ = ДО + РОвд + РОвыд ≈ 3,5–5 л; у спортсменов больше.</li></ul>
        <h3>Перенос газов</h3><p>Кислород почти весь связан с гемоглобином эритроцитов. Углекислый газ переносится в основном в виде бикарбоната в плазме.</p></div>
      <div><h2>Регуляция</h2><p>Дыхательный центр продолговатого мозга задаёт ритм. Хеморецепторы следят за CO₂ и кислотностью крови: чем больше CO₂, тем чаще и глубже дыхание. Можно дышать произвольно (кора), но надолго «перебить» центр нельзя.</p>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Бронхиальное дерево показано до 7-го поколения из ~23.</li><li>Альвеолы увеличены примерно в 10 000 раз.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>D</code> глубокий вдох</li><li><code>F</code> форсированный выдох</li><li><code>H</code> задержка</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeLungs };
