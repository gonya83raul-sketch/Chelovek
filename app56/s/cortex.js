import { BKP, LOBES, Sparks, THREE, V3, __set_rnd, bkCs, bkLs, bkPo, brainKit, branchTree, button, envTex, flowTubeMat, flyStep, flyTarget, group, infoBox, labLights, makeControls, mergeGeometries, mulberry, pickOn, rand, randUnit, rnd, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 4 · КОРА: ДОЛИ, ПОЛЯ БРОДМАНА, СЛОИ, ЛАТЕРАЛИЗАЦИЯ
   ========================================================= */
const CX_ZONES = {
  motor: '#E9573F', motor2: '#F08A4B', pref: '#F4B860', speech: '#E65CB8', sens: '#4F8FEF', sens2: '#86B6FF',
  assoc: '#3FC1B0', vis: '#F2D14E', vis2: '#D9B23E', aud: '#5CC48A', aud2: '#9BDDB0', temp: '#8BB870', taste: '#C77DFF', limb: '#E58FC4', pole: '#9AA0B0',
};
const CX_FIELDS = [
  { id: '4', z: 'motor', name: 'Поле 4 · первичная моторная кора', text: '<b>Поле 4</b> — прецентральная извилина, первичная двигательная кора. Здесь гигантские пирамиды Беца, их аксоны образуют пирамидный тракт. Чёткая топика: каждый участок управляет своими мышцами.' },
  { id: '6', z: 'motor2', name: 'Поле 6 · премоторная кора', text: '<b>Поле 6</b> — премоторная область, вторичное двигательное поле. Здесь общая программа делится на отдельные движения.' },
  { id: '8', z: 'motor2', name: 'Поле 8 · движения глаз', text: '<b>Поле 8</b> — верхняя лобная извилина, управление движениями глаз.' },
  { id: '9', z: 'pref', name: 'Поле 9 · префронтальная кора', text: '<b>Префронтальная кора</b> (поле 9 и соседние) — самая общая двигательная программа: цели, планы, решения. Поток идёт «сверху вниз»: префронтальная кора → поля 6 и 8 → поле 4 → мышцы.' },
  { id: '44', z: 'speech', name: 'Поле 44 · зона Брока', text: '<b>Зона Брока</b> (поля 44 и 45, нижняя лобная извилина) — моторный центр речи: речедвигательные реакции. У правшей — в левом полушарии.' },
  { id: '45', z: 'speech', name: 'Поле 45 · зона Брока', text: '<b>Зона Брока</b> (поля 44 и 45) — моторный центр речи. При её поражении человек понимает речь, но говорит с трудом.' },
  { id: '47', z: 'speech', name: 'Поле 47 · пение', text: '<b>Поле 47</b> — по классической схеме связано с пением.' },
  { id: '3', z: 'sens', name: 'Поля 3, 1, 2 · соматосенсорная кора', text: '<b>Поля 3, 1, 2</b> — постцентральная извилина: кожная, мышечная и болевая чувствительность. Поле 3 первичное: получает почти необработанный сигнал от проекционных ядер таламуса.' },
  { id: '43', z: 'taste', name: 'Поле 43 · вкус', text: '<b>Поле 43</b> — вкусовая кора, у островковой доли.' },
  { id: '5', z: 'sens2', name: 'Поле 5 · вторичное', text: '<b>Поля 5 и 7</b> — вторичные чувствительные поля верхней теменной дольки: отдельные ощущения собираются в образ.' },
  { id: '7', z: 'sens2', name: 'Поле 7 · вторичное', text: '<b>Поле 7</b> — верхняя теменная долька, вторичное и частично ассоциативное поле: тело в пространстве.' },
  { id: '40', z: 'assoc', name: 'Поле 40 · надкраевая извилина', text: '<b>Надкраевая извилина</b> (40) — ассоциативная теменная кора: объединяет потоки от разных органов чувств. Поражение третичных полей нарушает сложное распознавание.' },
  { id: '39', z: 'assoc', name: 'Поле 39 · угловая извилина', text: '<b>Угловая извилина</b> (39) — зрительные образы слов, чтение. Часть затылочно-височно-теменной ассоциативной зоны.' },
  { id: '17', z: 'vis', name: 'Поле 17 · первичная зрительная', text: '<b>Поле 17</b> — первичная зрительная кора, в основном на медиальной стороне по краям шпорной борозды. Соседние колонки реагируют на линии разной ориентации.' },
  { id: '18', z: 'vis2', name: 'Поле 18 · вторичная зрительная', text: '<b>Поле 18</b> — вторичное зрительное: из линий собирается образ; по классической схеме — письменная речь.' },
  { id: '19', z: 'vis2', name: 'Поле 19 · вторичная зрительная', text: '<b>Поле 19</b> — вторичное зрительное, запоминание образов.' },
  { id: '41', z: 'aud', name: 'Поле 41 · первичная слуховая', text: '<b>Поле 41</b> — первичная слуховая кора (поперечные извилины в глубине боковой борозды), слуховое восприятие.' },
  { id: '42', z: 'aud2', name: 'Поле 42 · звукоразличение', text: '<b>Поле 42</b> — вторичная слуховая кора, звукоразличение.' },
  { id: '22', z: 'speech', name: 'Поле 22 · зона Вернике', text: '<b>Зона Вернике</b> (задняя часть поля 22, верхняя височная извилина) — сенсорный центр речи, слухоречевые образы слов. Поле 22 также — ориентирование на звук и музыкальный слух.' },
  { id: '21', z: 'temp', name: 'Поля 21, 20 · височная кора', text: '<b>Средняя и нижняя височные извилины</b> — распознавание предметов и лиц, ассоциативная височная кора.' },
  { id: '37', z: 'assoc', name: 'Поле 37', text: '<b>Поле 37</b> — затылочно-височная область; по классической схеме связано с произвольной речью.' },
  { id: '38', z: 'pole', name: 'Поле 38 · височный полюс', text: '<b>Височный полюс</b> (38) связан с лимбической системой, эмоциональной памятью.' },
  { id: '24', z: 'limb', name: 'Поля 24, 25 · поясная кора', text: '<b>Поясная извилина</b> (поля 24, 25 и соседние) — распознавание несовпадений и ошибок; часть лимбической доли.' },
];
const CX_F = Object.fromEntries(CX_FIELDS.map((f, i) => [f.id, { ...f, i }]));
function cxField(x, y, u, lobe) {
  if (u < -0.38) { if (lobe === 4) return y > -0.05 && x > -0.75 ? '24' : null; if (x < bkPo(y) - 0.05) return y > -0.25 && y < 0.35 ? '17' : '18'; return null; }
  const dLs = y - bkLs(x), dCs = x - bkCs(y);
  if (x < bkPo(y)) return x < -1.5 ? '17' : x < -1.34 ? '18' : '19';
  if (lobe === 2) {
    if (x > 0.62) return '38';
    if (dLs > -0.13) { if (x > -0.05 && x < 0.38) return dLs > -0.065 ? '41' : '42'; return '22'; }
    if (x < -0.55) return '37';
    return '21';
  }
  if (dLs < 0.11 && dCs > -0.16 && dCs < 0.1) return '43';
  if (dCs > 0) {
    if (dCs < 0.13) return '4';
    if (dLs < 0.3 && x > 0.2) return dCs < 0.36 ? '44' : dCs < 0.58 ? '45' : dCs < 0.78 ? '47' : '9';
    if (dCs < 0.36) return '6';
    if (y > 0.5 && dCs < 0.62) return '8';
    return '9';
  }
  if (dCs > -0.17) return '3';
  if (y > 0.52) return x > -0.62 ? '5' : '7';
  return x > -0.58 ? '40' : '39';
}
const CX_LAYERS = [
  { n: 'I', name: 'Молекулярный', f: 0.08, color: '#3a2c3c', text: 'волокна нейронов нижележащих слоёв, верхушки апикальных дендритов' },
  { n: 'II', name: 'Наружный зернистый', f: 0.09, color: '#2b3550', text: 'мелкие звездчатые клетки; вход от других зон коры' },
  { n: 'III', name: 'Наружный пирамидный', f: 0.27, color: '#40263a', text: 'малые и средние пирамиды; выход в другие зоны коры и через мозолистое тело' },
  { n: 'IV', name: 'Внутренний зернистый', f: 0.1, color: '#2b3a50', text: 'малые нейроны всех форм; вход от таламуса' },
  { n: 'V', name: 'Внутренний пирамидный', f: 0.23, color: '#4a2a32', text: 'гигантские пирамиды Беца: выход к стриатуму, стволу, спинному мозгу' },
  { n: 'VI', name: 'Полиморфный', f: 0.23, color: '#33293f', text: 'преимущественно веретенообразные нейроны' },
];
function makeCortex() {
  __set_rnd(mulberry(808));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0xe58fc4);
  { const k2 = new THREE.DirectionalLight(0xfff1e6, 1.15); k2.position.set(5, 8, -7); scene.add(k2); }   // ключевой свет и для левого полушария (z<0)
  const VIEWS = {
    lat: flyTarget(V3(0.55, -0.3, -0.55), V3(0.27, 0.75, -8.2)),   // левое полушарие (z<0) снаружи
    med: flyTarget(V3(-0.22, -0.3, -0.3), V3(-0.5, 0.55, 8.4)),      // его медиальная стенка, правое скрыто
    top: flyTarget(V3(-0.3, -0.1, 0), V3(-3.4, 7.4, 0.01)),
    col: flyTarget(V3(0.2, -0.75, 0), V3(4.4, 0.9, 8.0)),
  };
  const VIEWSM = {   // телефон: кадр выше и ниже — модель крупнее (mobZoom)
    lat: flyTarget(V3(-0.22, -0.25, -0.55), V3(-0.45, 0.6, -8.4)),   /* телефон: мозг крупнее */ med: flyTarget(V3(-0.22, -0.25, -0.3), V3(-0.5, 0.6, 9.2)),
    top: flyTarget(V3(-0.3, -0.1, 0), V3(-3.6, 8.2, 0.01)), col: flyTarget(V3(0.15, -0.6, 0), V3(5.4, 1.1, 9.8)),
  };
  const mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches ? VIEWSM : VIEWS)[m];
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VV('lat').pos);
  const controls = makeControls(camera, VV('lat').target); controls.minDistance = 2; controls.maxDistance = 16;
  const K = brainKit();
  const brain = new THREE.Group(); scene.add(brain);
  /* ---------- полушария с собственной раскраской ---------- */
  // рельеф: борозды из brainKit (атрибут sulc) углублены в 1,5 раза, цвет доли/поля приглушён и затенён по глубине борозды —
  // извилины читаются сквозь раскраску, как на окрашенном препарате
  const TIS = new THREE.Color(0xb39497);
  const H = K.hemi.map((g0, hi) => {
    const g = g0.clone(); const pos = g.attributes.position, n = pos.count, lobeA = g.attributes.lobe, sul = g.attributes.sulc;
    const field = new Int16Array(n), lobeCol = new Float32Array(n * 3), zoneCol = new Float32Array(n * 3), shade = new Float32Array(n);
    const side = hi === 0 ? 1 : -1, v = new THREE.Vector3(), c = new THREE.Color(), C0 = V3(0, -0.1, side * 0.55);
    for (let i = 0; i < n; i++) {
      v.fromBufferAttribute(pos, i); const u = v.z * side - 0.55, L = lobeA.getX(i), d = sul.getX(i);
      const f = cxField(v.x, v.y, u, L); field[i] = f ? CX_F[f].i : -1;
      const sh = shade[i] = 0.5 + 0.5 * smooth(-0.075, 0.02, d);
      c.set(LOBES[L].color).lerp(TIS, 0.42).multiplyScalar(sh); lobeCol.set([c.r, c.g, c.b], i * 3);
      if (f) c.set(CX_ZONES[CX_F[f].z]).lerp(TIS, 0.25); else c.set(LOBES[L].color).lerp(TIS, 0.6).multiplyScalar(0.4);
      c.multiplyScalar(sh); zoneCol.set([c.r, c.g, c.b], i * 3);
      v.addScaledVector(v.clone().sub(C0).normalize(), 0.5 * d); pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    const col = new THREE.BufferAttribute(new Float32Array(lobeCol), 3); g.setAttribute('color', col);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xa0a0a0, vertexColors: true, roughness: 0.62, clearcoat: 0.18, clearcoatRoughness: 0.6, sheen: 0.25, sheenColor: new THREE.Color(0xffd6e4), envMapIntensity: 0.35, transparent: true });
    const mesh = new THREE.Mesh(g, mat); mesh.userData.pick = 'h' + hi; brain.add(mesh);
    return { g, mesh, mat, field, lobeCol, zoneCol, col, side, lobe: lobeA, shade };
  });
  const cere = new THREE.Mesh(K.cere, tissue(new THREE.Color(0xc9a2a8).multiplyScalar(0.42), { roughness: 0.6 })); brain.add(cere);
  // ствол укорочен до продолговатого мозга (спинной мозг здесь не нужен — он тянул кадр вниз)
  const stemG = K.stem.clone(); { const ix = stemG.index.array, py = stemG.attributes.position, keep = [];
    for (let t = 0; t < ix.length; t += 3) if (Math.min(py.getY(ix[t]), py.getY(ix[t + 1]), py.getY(ix[t + 2])) > -1.72) keep.push(ix[t], ix[t + 1], ix[t + 2]);
    stemG.setIndex(keep); }
  const stem = new THREE.Mesh(stemG, tissue(new THREE.Color(0xd8b2b8).multiplyScalar(0.42), { side: THREE.DoubleSide })); brain.add(stem);
  // мозолистое тело (для латерализации)
  const ccCurve = new THREE.CatmullRomCurve3(BKP.cc.map((p) => p.clone()));
  const ccFlow = [];
  for (let k = 0; k < 12; k++) {
    const p = ccCurve.getPointAt(0.08 + k / 12 * 0.84); const f = flowTubeMat(k % 2 ? '#4FA3FF' : '#9fd0ff', 0.5, 1.2); f.uniforms.uOn.value = 0;
    ccFlow.push(f); brain.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p.clone().add(V3(0, 0.25, 0.75)), p.clone().add(V3(0, 0.05, 0.3)), p.clone(), p.clone().add(V3(0, 0.05, -0.3)), p.clone().add(V3(0, 0.25, -0.75))]), 30, 0.018, 6), f));
  }
  // поверхность: ближайшая вершина латеральной (или медиальной) стороны
  function surfAt(hi, x, y, medial = false) {
    const { g, side } = H[hi], pos = g.attributes.position, v = new THREE.Vector3(); let best = null, bd = 1e9;
    for (let i = 0; i < pos.count; i += 3) { v.fromBufferAttribute(pos, i); const u = v.z * side - 0.55; if (medial ? u > -0.4 : u < 0.15) continue; const d = (v.x - x) ** 2 + (v.y - y) ** 2 - (medial ? 0 : 0.02 * u); if (d < bd) { bd = d; best = v.clone(); } }
    return best.add(V3(0, 0, side * (medial ? -0.04 : 0.06)));
  }
  // центры полей (на левом полушарии: H[1], z < 0)
  const fieldPos = CX_FIELDS.map(() => ({ s: V3(0, 0, 0), n: 0, m: V3(0, 0, 0), mn: 0 }));
  { const { g, field, side } = H[1], pos = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { const f = field[i]; if (f < 0) continue; v.fromBufferAttribute(pos, i); const u = v.z * side - 0.55; if (u > 0.25) { fieldPos[f].s.add(v); fieldPos[f].n++; } else if (u < -0.4) { fieldPos[f].m.add(v); fieldPos[f].mn++; } } }
  const FPOS = fieldPos.map((p) => (p.n > 30 ? p.s.divideScalar(p.n).add(V3(0, 0, -0.32)) : null));
  const FPOSM = fieldPos.map((p) => (p.mn > 30 ? p.m.divideScalar(p.mn).add(V3(0, 0, 0.1)) : null));

  /* ---------- шестислойная колонка ---------- */
  const col = new THREE.Group(); scene.add(col); col.visible = false;
  const CW = 3.2, CD = 1.3, TOP = 1.25, THK = 2.7, WM = 0.55;
  const LY = []; { let y = TOP; CX_LAYERS.forEach((l) => { const h2 = l.f * THK; LY.push({ ...l, top: y, bot: y - h2, mid: y - h2 / 2 }); y -= h2; }); }
  const BOT = TOP - THK;
  LY.forEach((l, i) => {
    const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(l.color).multiplyScalar(1.1), roughness: 0.7, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.2 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(CW, l.top - l.bot - 0.006, CD), m); b.position.y = l.mid; col.add(b); l.mat = m;
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), new THREE.LineBasicMaterial({ color: 0x7a6a86, transparent: true, opacity: 0.35 })); e.position.y = l.mid; col.add(e);
  });
  const wm = new THREE.Mesh(new THREE.BoxGeometry(CW, WM, CD), new THREE.MeshPhysicalMaterial({ color: 0xb8aea0, roughness: 0.6, transparent: true, opacity: 0.22, depthWrite: false })); wm.position.y = BOT - WM / 2; col.add(wm);
  const pia = new THREE.Mesh(new THREE.BoxGeometry(CW + 0.04, 0.025, CD + 0.04), new THREE.MeshPhysicalMaterial({ color: 0xc86a7a, roughness: 0.4, transparent: true, opacity: 0.6 })); pia.position.y = TOP + 0.012; col.add(pia);
  // нейроны
  const N = { pyr: [], betz: [], stel: [], spin: [] }, cells = [];
  const rx = () => rand(-CW / 2 + 0.2, CW / 2 - 0.2), rz = () => rand(-CD / 2 + 0.15, CD / 2 - 0.15);
  function pyramid(arr, p, size, axonEnd) {
    const cone = new THREE.ConeGeometry(size, size * 2.4, 16); cone.translate(p.x, p.y + size * 0.5, p.z); arr.push(cone);
    const apTop = V3(p.x + rand(-0.08, 0.08), TOP - 0.06, p.z + rand(-0.06, 0.06));
    const ap = new THREE.CatmullRomCurve3([V3(p.x, p.y + size * 1.6, p.z), V3(p.x + rand(-0.05, 0.05), (p.y + apTop.y) / 2, p.z), apTop]);
    arr.push(taperTube(ap, (u) => size * 0.32 * (1 - u * 0.75), 28, 6));
    for (let j = 0; j < 4; j++) branchTree(arr, apTop, V3(rand(-1, 1), rand(-0.1, 0.4), rand(-1, 1)), 0.22, size * 0.09, 1, { spread: 0.9, wob: 0.4, segs: 8, rad: 4 });
    for (let j = 0; j < 3; j++) { const ob = ap.getPointAt(0.3 + j * 0.2); branchTree(arr, ob, V3(rand(-1, 1), 0.4, rand(-1, 1)), 0.2, size * 0.1, 1, { spread: 0.7, segs: 8, rad: 4 }); }
    for (let j = 0; j < 5; j++) branchTree(arr, p.clone().add(V3(0, -size * 0.4, 0)), V3(Math.cos(j * 1.3) * 1.2, -0.6, Math.sin(j * 1.3)), size * 3.2, size * 0.18, 1, { spread: 0.8, wob: 0.35, segs: 10, rad: 5 });
    const ax = new THREE.CatmullRomCurve3([p.clone().add(V3(0, -size * 0.6, 0)), ...axonEnd]);
    arr.push(taperTube(ax, () => size * 0.07, 40, 5));
    return ax;
  }
  function stellate(arr, p, size) {
    const s = new THREE.SphereGeometry(size, 10, 8); s.translate(p.x, p.y, p.z); arr.push(s);
    for (let j = 0; j < 6; j++) branchTree(arr, p, randUnit(), size * 4, size * 0.22, 1, { spread: 1, wob: 0.5, segs: 6, rad: 4 });
  }
  function spindle(arr, p, size) {
    const s = new THREE.SphereGeometry(size, 12, 10); s.scale(0.55, 2.2, 0.55); s.translate(p.x, p.y, p.z); arr.push(s);
    arr.push(taperTube(new THREE.CatmullRomCurve3([p.clone().add(V3(0, size * 2, 0)), p.clone().add(V3(rand(-0.05, 0.05), 0.45, 0)), p.clone().add(V3(rand(-0.1, 0.1), 0.9, rand(-0.05, 0.05)))]), (u) => size * 0.3 * (1 - u * 0.7), 20, 5));
    arr.push(taperTube(new THREE.CatmullRomCurve3([p.clone().add(V3(0, -size * 2, 0)), p.clone().add(V3(0, -0.4, 0)), V3(p.x, BOT - WM + 0.02, p.z)]), () => size * 0.12, 20, 4));
  }
  const L = (n) => LY.find((l) => l.n === n);
  const CENTER = { betz: V3(0.15, L('V').mid - 0.05, 0), III: V3(-0.55, L('III').mid - 0.05, 0.1), IV: V3(-0.25, L('IV').mid, 0.05) };
  // пирамиды III слоя: аксон уходит вбок (мозолистое тело / другие зоны)
  const axIII = [];
  for (let k = 0; k < 9; k++) { const p = k === 0 ? CENTER.III : V3(rx(), rand(L('III').bot + 0.12, L('III').top - 0.15), rz()); axIII.push(pyramid(N.pyr, p, 0.05 + rnd() * 0.02, [V3(p.x, BOT - 0.1, p.z), V3(p.x + 0.4, BOT - WM * 0.55, p.z), V3(CW / 2 + 0.6, BOT - WM * 0.6, p.z * 0.5)])); }
  // V слой: пирамиды и одна гигантская пирамида Беца
  let axBetz = null;
  for (let k = 0; k < 6; k++) { const big = k === 0, p = big ? CENTER.betz : V3(rx(), rand(L('V').bot + 0.15, L('V').top - 0.15), rz()); const ax = pyramid(big ? N.betz : N.pyr, p, big ? 0.13 : 0.07 + rnd() * 0.02, [V3(p.x, BOT - WM * 0.5, p.z), V3(p.x - 0.05, BOT - WM - 0.7, p.z)]); if (big) axBetz = ax; }
  for (let k = 0; k < 12; k++) stellate(N.stel, k === 0 ? CENTER.IV : V3(rx(), rand(L('IV').bot + 0.05, L('IV').top - 0.05), rz()), 0.035);
  for (let k = 0; k < 10; k++) stellate(N.stel, V3(rx(), rand(L('II').bot + 0.04, L('II').top - 0.04), rz()), 0.03);
  for (let k = 0; k < 7; k++) spindle(N.spin, V3(rx(), rand(L('VI').bot + 0.15, L('VI').top - 0.2), rz()), 0.05);
  const CELLM = {
    pyr: tissue(new THREE.Color(0xe28a9a).multiplyScalar(0.5), { emissive: 0x3a0c18, emissiveIntensity: 0.6 }),
    betz: tissue(new THREE.Color(0xff6a5a).multiplyScalar(0.55), { emissive: 0x5a1008, emissiveIntensity: 0.8 }),
    stel: tissue(new THREE.Color(0x6fb4ff).multiplyScalar(0.5), { emissive: 0x0c2448, emissiveIntensity: 0.7 }),
    spin: tissue(new THREE.Color(0xc77dff).multiplyScalar(0.5), { emissive: 0x2a0c48, emissiveIntensity: 0.7 }),
  };
  Object.keys(N).forEach((k) => { const m = new THREE.Mesh(mergeGeometries(N[k]), CELLM[k]); col.add(m); cells.push(m); });
  // волокна I слоя
  { const arr = []; for (let k = 0; k < 14; k++) { const y = rand(L('I').bot + 0.03, L('I').top - 0.03), z = rz(); arr.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-CW / 2, y, z), V3(-0.5, y + rand(-0.03, 0.03), z + rand(-0.1, 0.1)), V3(0.6, y, z), V3(CW / 2, y + rand(-0.03, 0.03), z)]), 30, 0.008, 4)); }
    col.add(new THREE.Mesh(mergeGeometries(arr), tissue(new THREE.Color(0xd8c8a8).multiplyScalar(0.45)))); }
  // таламический вход в IV слой
  const thalIn = [];
  for (let k = 0; k < 5; k++) { const x = -0.25 + (k - 2) * 0.32, z = (k % 2 ? 0.2 : -0.15); const c = new THREE.CatmullRomCurve3([V3(x - 0.3, BOT - WM - 0.7, z), V3(x - 0.1, BOT - WM * 0.4, z), V3(x, L('VI').mid, z), V3(x, L('IV').mid, z)]); thalIn.push(c); const f = flowTubeMat('#F4C542', 0.6, 1.2); f.uniforms.uOn.value = 0.5; ccFlow.push(f); col.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.012, 5), f)); }
  { const arr = []; thalIn.forEach((c) => { for (let j = 0; j < 5; j++) branchTree(arr, c.getPointAt(1), V3(rand(-1, 1), rand(-0.3, 0.3), rand(-1, 1)), 0.18, 0.007, 1, { segs: 6, rad: 3 }); });
    col.add(new THREE.Mesh(mergeGeometries(arr), new THREE.MeshBasicMaterial({ color: 0x8a6a20 }))); }
  // микроколонка
  const mc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, THK, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x7fd6c8, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  mc.position.set(-0.25, TOP - THK / 2, 0.05); col.add(mc); mc.visible = false;
  const mcRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.006, 6, 48), new THREE.MeshBasicMaterial({ color: 0x7fd6c8 })); mcRing.rotation.x = Math.PI / 2; mcRing.position.set(-0.25, TOP + 0.02, 0.05); col.add(mcRing); mcRing.visible = false;
  // пути сигнала
  const CHAIN = [
    { c: thalIn[2], col: 0xf4c542, d: 1.0 },
    { c: new THREE.CatmullRomCurve3([CENTER.IV, CENTER.IV.clone().add(V3(-0.15, 0.25, 0.02)), CENTER.III]), col: 0x6fb4ff, d: 0.7 },
    { c: new THREE.CatmullRomCurve3([CENTER.III, V3(-0.2, L('IV').bot, 0.05), CENTER.betz.clone().add(V3(0, 0.25, 0))]), col: 0xe28a9a, d: 0.8 },
    { c: axBetz, col: 0xff6a5a, d: 1.1, out: 'вниз: пирамидный тракт, стриатум, ствол' },
  ];
  const fx = new Sparks(1200, 0.06); scene.add(fx.obj);

  const st = { t: 0, mode: 'lobes', view: 'lat', sel: null, labels: true, rot: false, fly: VV('lat'), sigT: -9, split: false, msg: null, mc: false };
  function paint() {
    H.forEach((hh) => {
      const a = hh.col.array, src = st.mode === 'lobes' || st.mode === 'lat' ? hh.lobeCol : hh.zoneCol, tint = new THREE.Color(hh.side < 0 ? '#86B6FF' : '#F4B860');
      const si = st.sel != null ? CX_F[st.sel].i : -1;
      for (let i = 0; i < hh.field.length; i++) {
        let k = 1;
        if (st.mode === 'lat') k = 0.55;
        if (st.mode === 'zones' && si >= 0) k = hh.field[i] === si ? 1.25 : 0.3;
        if (st.mode === 'lobes' && st.selLobe != null) k = hh.lobe.getX(i) === st.selLobe ? 1.2 : 0.3;
        if (st.mode === 'lat') { const q = 0.8 * hh.shade[i]; a[i * 3] = tint.r * q; a[i * 3 + 1] = tint.g * q; a[i * 3 + 2] = tint.b * q; continue; }
        a[i * 3] = src[i * 3] * k; a[i * 3 + 1] = src[i * 3 + 1] * k; a[i * 3 + 2] = src[i * 3 + 2] * k;
      }
      hh.col.needsUpdate = true;
    });
  }
  function setView(v) {
    st.view = v; refs.viewSeg && refs.viewSeg.sync();
    H[0].mesh.visible = v !== 'med'; st.fly = VV(v);
  }
  function setMode(m) {
    st.mode = m; st.sel = null; st.selLobe = null; st.msg = null; refs.modeSeg && refs.modeSeg.sync();
    brain.visible = m !== 'layers'; col.visible = m === 'layers';
    ccFlow.forEach((f, i) => { if (i < 12) f.uniforms.uOn.value = m === 'lat' && !st.split ? 0.9 : 0; });
    H.forEach((hh) => { hh.mat.opacity = m === 'lat' ? 0.55 : 1; hh.mat.depthWrite = m !== 'lat'; });
    if (m === 'layers') st.fly = VV('col'); else if (m === 'lat') { H[0].mesh.visible = true; st.fly = VV('top'); st.view = 'top'; } else setView(st.view === 'top' && m !== 'lat' ? 'lat' : st.view);
    refs.viewSeg && refs.viewSeg.sync(); paint(); refs.setInfo && refs.setInfo();
  }
  function signal() { if (st.mode !== 'layers') setMode('layers'); st.sigT = st.t; st.msg = TXT.signal; refs.setInfo(); }
  pickOn(() => self, camera, () => H.map((x) => x.mesh), (id, hit) => {
    const hh = H[id === 'h0' ? 0 : 1], vi = hit.face.a;
    if (st.mode === 'zones') { const f = hh.field[vi]; st.sel = f >= 0 ? CX_FIELDS[f].id : null; st.msg = null; paint(); refs.setInfo(); }
    else if (st.mode === 'lobes') { st.selLobe = hh.lobe.getX(vi); paint(); refs.setInfo(); }
  });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    ccFlow.forEach((f) => { f.uniforms.uTime.value = t; });
    mc.visible = mcRing.visible = st.mc && st.mode === 'layers';
    const k = t - st.sigT; let acc = 0;
    if (k > 0 && k < 5) CHAIN.forEach((s) => { const u = (k - acc) / s.d; acc += s.d; if (u > 0 && u < 1) for (let j = 0; j < 4; j++) fx.spawn(s.c.getPointAt(u).add(randUnit().multiplyScalar(0.012)), randUnit().multiplyScalar(0.04), new THREE.Color(s.col), 0.6, 2, 2); });
    // III → мозолистое тело
    if (k > 1.7 && k < 3.2) { const u = (k - 1.7) / 1.5; fx.spawn(axIII[0].getPointAt(u), V3(0, 0, 0), new THREE.Color(0x4fa3ff), 0.6, 0, 2); }
    CELLM.betz.emissiveIntensity = k > 2.5 && k < 3.4 ? 2.2 : 0.8; CELLM.stel.emissiveIntensity = k > 1.0 && k < 1.8 ? 1.8 : 0.7;
    fx.update(dt);
  }
  const TXT = {
    lobes: '<b>Доли коры.</b> Центральная (Роландова) борозда отделяет лобную долю (красная) от теменной (синяя), боковая (Сильвиева) — височную (зелёная), теменно-затылочная — затылочную (жёлтая). Лимбическая доля (розовая) видна на медиальной стороне: поясная извилина, гиппокамп, обонятельная кора. Маленькая островковая доля спрятана на дне боковой борозды. Первичные борозды закладываются с 5-го месяца, третичные (индивидуальные, как отпечатки пальцев) — к концу 7-го.',
    zones: '<b>Поля Бродмана.</b> В 1909 году Корбиниан Бродман по окраске Ниссля разделил кору на 52 цитоархитектонических поля. Первичные поля (3, 4, 17, 41) получают сигнал прямо от проекционных ядер таламуса и имеют чёткую топику; вторичные (1, 2, 6, 18, 19, 42) собирают признаки в образы; третичные (ассоциативные) объединяют потоки от разных чувств. Нажмите на поле.',
    layers: '<b>Шесть слоёв новой коры.</b> 3/4 нейронов коры — пирамиды. Зернистые слои II и IV — вход (от других зон коры и от таламуса), пирамидные слои III и V — выход (III — в другие зоны и через мозолистое тело, V — к стриатуму, стволу и спинному мозгу), слои I и VI — интеграция, сюда приходят неспецифические ядра таламуса. Красная — гигантская пирамида Беца, фиолетовые — веретенообразные нейроны.',
    lat: '<b>Латерализация.</b> Левое полушарие: анализ правого поля зрения, ощупывание правой рукой, лексика и семантика речи, письмо, полноценная речь. Правое: левое поле зрения, ощупывание левой рукой, эмоциональная окраска речи, пространственное воображение, музыка. Полушария непрерывно обмениваются сигналами через мозолистое тело (синие потоки). Разделить функции выгодно: так меньше времени тратится на передачу.',
    split: '<b>Расщеплённый мозг.</b> В 1970-е годы, чтобы ослабить тяжёлые эпилептические припадки, пациентам разрезали мозолистое тело. Майкл Газзанига обнаружил, что полушария начинают работать почти независимо: предмет, показанный в левое поле зрения (правое полушарие), человек узнаёт, но не может назвать — речь в левом. Позже представление о жёстком разделении функций смягчилось.',
    signal: '<b>Путь сигнала через колонку.</b> Волокно из таламуса (жёлтое) приходит в IV слой → звездчатые клетки передают сигнал пирамидам III слоя → III слой отправляет его в другие зоны коры и через мозолистое тело (синее) и возбуждает пирамиду Беца в V слое → её аксон уходит из коры вниз, в пирамидный тракт.',
    mc: '<b>Колонка.</b> Вернон Маунткасл погружал электрод в соматосенсорную кору кошки вертикально — и все встреченные клетки отвечали на один и тот же стимул. Колонка проходит через все шесть слоёв и работает как отдельный процессор. В первичной зрительной коре соседние микроколонки реагируют на линии разной ориентации.',
  };
  const LOBE_LBL = [[0, 0.5, 0.28], [1, -0.55, 0.85], [2, -0.1, -0.5], [3, -1.35, 0.25]].map(([li, x, y]) => ({ li, x, y }));
  const latLbl = (t2, x, y, c, cond) => ({ text: t2, pos: V3(x, y, 0), color: c, show: () => st.labels && cond() && camera.position.z < -1, _surf: [x, y] });
  const labels = [
    ...LOBE_LBL.map((l) => latLbl(LOBES[l.li].name + ' доля', l.x, l.y, LOBES[l.li].color, () => st.mode === 'lobes' && st.view !== 'med')),
    latLbl('центральная борозда', bkCs(0.95) + 0.02, 0.95, '#ffffff', () => st.mode === 'lobes' && st.view !== 'med'),
    latLbl('боковая борозда', -0.1, bkLs(-0.1), '#ffffff', () => st.mode === 'lobes' && st.view !== 'med'),
    latLbl('теменно-затылочная', bkPo(0.75) - 0.02, 0.75, '#ffffff', () => st.mode === 'lobes' && st.view !== 'med'),
    { text: 'Лимбическая доля', pos: V3(0, 0, 0), color: LOBES[4].color, show: () => st.labels && st.mode === 'lobes' && st.view === 'med', _med: [-0.2, 0.42] },
    { text: 'мозолистое тело', pos: V3(0.0, 0.32, 0.15), color: '#efe8dc', show: () => st.labels && st.mode === 'lobes' && st.view === 'med' },
    { text: 'шпорная борозда', pos: V3(0, 0, 0), color: '#F2D14E', show: () => st.labels && st.mode === 'lobes' && st.view === 'med', _med: [-1.35, 0.1] },
    // номера мелких полей 41 и 42 (в глубине боковой борозды) — только когда поле выбрано, иначе они сбиваются в кучу с 22 и 43
    ...CX_FIELDS.map((f, i) => ({ text: f.id, pos: FPOS[i] ? FPOS[i].clone() : V3(0, -9, 0), color: '#ffffff', cls: 'num', show: () => st.labels && st.mode === 'zones' && !!FPOS[i] && st.view !== 'med' && camera.position.z < -1 && (!(f.id === '41' || f.id === '42') || st.sel === f.id) })),
    ...CX_FIELDS.map((f, i) => ({ text: f.id, pos: FPOSM[i] || V3(0, -9, 0), color: '#ffffff', show: () => st.labels && st.mode === 'zones' && !!FPOSM[i] && st.view === 'med' })),
    { text: 'Брока', pos: V3(0, 0, 0), color: CX_ZONES.speech, show: () => st.labels && st.mode === 'zones' && st.view === 'lat', _surf: [0.62, -0.02], dy: -0.16 },
    { text: 'Вернике', pos: V3(0, 0, 0), color: CX_ZONES.speech, show: () => st.labels && st.mode === 'zones' && st.view === 'lat', _surf: [-0.35, -0.02], dy: -0.14 },
    ...LY.map((l) => ({ text: l.n + ' · ' + l.name, pos: V3(-CW / 2 - 0.08, l.mid, CD / 2), color: '#d8c8e8', show: () => st.labels && st.mode === 'layers' })),
    { text: 'белое вещество', pos: V3(-CW / 2 - 0.08, BOT - WM / 2, CD / 2), color: '#c8c0b0', show: () => st.labels && st.mode === 'layers' },
    { text: 'пирамида Беца', pos: CENTER.betz.clone().add(V3(0.2, 0, 0.1)), color: '#FF8A7A', show: () => st.labels && st.mode === 'layers' },
    { text: 'из таламуса', pos: V3(-0.6, BOT - WM - 0.55, 0), color: '#F4C542', show: () => st.labels && st.mode === 'layers' },
    { text: 'в мозолистое тело', pos: V3(CW / 2 + 0.25, BOT - WM * 0.6 + 0.12, 0), color: '#4FA3FF', show: () => st.labels && st.mode === 'layers' },
    { text: 'к спинному мозгу', pos: V3(0.2, BOT - WM - 0.6, 0), color: '#FF6A5A', show: () => st.labels && st.mode === 'layers' },
    { text: 'левое: речь, письмо, логика', pos: V3(-0.2, 1.3, -0.75), color: '#86B6FF', show: () => st.labels && st.mode === 'lat' },
    { text: 'правое: образы, пространство, музыка', pos: V3(-0.2, 1.3, 0.75), color: '#F4B860', show: () => st.labels && st.mode === 'lat' },
    { text: 'мозолистое тело', pos: V3(0.0, 0.62, 0), color: '#9fd0ff', show: () => st.labels && st.mode === 'lat' },
  ];
  labels.forEach((l) => { if (l._surf) l.pos.copy(surfAt(1, l._surf[0], l._surf[1])).add(V3(0, l.dy || 0, -0.12)); if (l._med) l.pos.copy(surfAt(1, l._med[0], l._med[1], true)).add(V3(0, 0, 0.1)); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'zones' && st.sel ? CX_F[st.sel].text : st.mode === 'lobes' && st.selLobe != null ? `<b>${LOBES[st.selLobe].name} доля.</b> ` + LOBE_TXT[st.selLobe] : st.mode === 'lat' && st.split ? TXT.split : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'lobes', label: 'Доли и борозды' }, { id: 'zones', label: 'Поля Бродмана' }, { id: 'layers', label: 'Слои коры' }, { id: 'lat', label: 'Латерализация' }], () => st.mode, (v) => setMode(v));
    refs.viewSeg = seg([{ id: 'lat', label: 'Сбоку' }, { id: 'med', label: 'Медиально' }, { id: 'top', label: 'Сверху' }], () => st.view, (v) => { if (st.mode === 'layers') setMode('lobes'); setView(v); });
    const sp = toggle('Разрезать мозолистое тело', () => st.split, (v) => { st.split = v; if (st.mode !== 'lat') setMode('lat'); ccFlow.forEach((f, i) => { if (i < 12) f.uniforms.uOn.value = v ? 0 : 0.9; }); refs.setInfo(); });
    const mcT = toggle('Колонка', () => st.mc, (v) => { st.mc = v; if (st.mode !== 'layers') setMode('layers'); st.msg = v ? TXT.mc : null; refs.setInfo(); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { sp, mcT, lab });
    el.append(group('Режим', '1–4', refs.modeSeg), group('Вид', 'V', refs.viewSeg), group('Опыт', 'S · C · X', button('Сигнал из таламуса', signal, true), mcT, sp), group('Показ', 'R · N', refs.rot, lab), ib.el);
    paint(); refs.setInfo();
  }
  const LOBE_TXT = [
    'Впереди центральной борозды. Задняя часть — двигательная кора (поле 4) и премоторная (6), внизу — зона Брока, впереди — префронтальная кора: планы и решения.',
    'Между центральной и теменно-затылочной бороздами. Передняя часть — кожная, мышечная и болевая чувствительность (поля 3, 1, 2), задняя — ассоциативная теменная кора.',
    'Ниже боковой борозды. Слуховая кора (41, 42), зона Вернике (22), распознавание предметов; в глубине — гиппокамп и миндалина.',
    'Позади теменно-затылочной борозды. Зрительная кора: первичное поле 17 по краям шпорной борозды, вторичные 18 и 19.',
    'На медиальной стороне, окружает место отхода полушария от промежуточного мозга: поясная и парагиппокампальная извилины, гиппокамп, обонятельная кора. Эмоции и память.',
  ];
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['lobes', 'zones', 'layers', 'lat'][n - 1]); return true; }
    if (k === 'v' || k === 'м') { const o = ['lat', 'med', 'top']; if (st.mode === 'layers') setMode('lobes'); setView(o[(o.indexOf(st.view) + 1) % 3]); return true; }
    if (k === 's' || k === 'ы') { signal(); return true; } if (k === 'c' || k === 'с') { refs.mcT.click(); return true; } if (k === 'x' || k === 'ч') { refs.sp.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { st.sel = null; st.selLobe = null; st.msg = null; paint(); refs.setInfo(); return true; }
    return false;
  }
  function stats() { return st.mode === 'zones' ? [['Полей Бродмана', 52, ''], ['Год карты', 1909, '']] : st.mode === 'layers' ? [['Слоёв', 6, ''], ['Пирамид', '≈75', '%']] : [['Доли', 5, ''], ['Главные борозды', 3, '']]; }
  const self = {
    labelBg: true, mobZoom: 0.62, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#E9785F', mobZoom: 0.68,
    kicker: 'Мозг · новая кора', title: 'Кора больших полушарий',
    lede: 'Пять долей, 52 поля Бродмана, шесть слоёв и колонки-процессоры. Посмотрите, где говорит, видит и двигается кора и как сигнал проходит через её слои.',
    notes: `
      <div><h2>Борозды и извилины</h2>
        <p>Первичные борозды (центральная, боковая, теменно-затылочная) появляются с 5-го месяца внутриутробного развития и есть у всех людей. Вторичные — позже. Третичные дают мелкую исчерченность, их рисунок индивидуален.</p>
        <h3>Поля коры неравноценны</h3>
        <p><b>Первичные</b> — центральные части анализаторов, прямой вход от проекционных ядер таламуса, чёткая топика. <b>Вторичные</b> — рядом с первичными, связаны с ассоциативными ядрами, собирают признаки в образы. <b>Третичные</b> — нижняя теменная долька и затылочно-височно-теменная область: объединяют разные потоки.</p>
        <p>В сенсорных системах образ собирается из элементов; в двигательных поток идёт в обратную сторону: общая программа (префронтальная кора) → отдельные движения (6, 8) → сигналы мышцам (4).</p></div>
      <div><h2>Клетки коры</h2><ul>
        <li><b>Пирамиды</b> — 3/4 нейронов коры, много дендритных шипиков (признак обучения).</li>
        <li><b>Пирамиды Беца</b> — самые крупные нейроны мозга (В. А. Бец, 1874), V слой прецентральной извилины, аксоны — в пирамидный тракт.</li>
        <li><b>Нейроны фон Экономо</b> — крупные веретенообразные, есть только у человека, человекообразных обезьян, слонов и китообразных: быстрая связь лобной, теменной и поясной коры.</li>
        <li>Длинноаксонные клетки Гольджи I выходят за пределы коры, короткоаксонные Гольджи II образуют местные сети.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Границы полей на модели упрощены и проведены по классической схеме.</li><li>Толщина слоёв и размер клеток в колонке увеличены.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li><code>V</code> вид</li><li>клик: доля или поле</li><li><code>S</code> сигнал</li><li><code>C</code> колонка</li><li><code>X</code> мозолистое тело</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeCortex };
