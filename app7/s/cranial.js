import { THREE, V3, __set_rnd, accentSet, brainShell, envTex, flowTubeMat, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, pickOn, rand, rnd, seg, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 2 · 12 ПАР ЧЕРЕПНЫХ НЕРВОВ (рис. 2.8)
   ========================================================= */
const CN_TYPES = {
  sens: { name: 'Чувствительные', color: '#4FA3FF' },
  mot: { name: 'Двигательные', color: '#FF6A5A' },
  motp: { name: 'Двигательные + парасимпатические', color: '#FFA040' },
  mix: { name: 'Смешанные', color: '#C77DFF' },
};
const CN = [
  { n: 'I', name: 'Обонятельный', type: 'sens', target: 'нос', text: '<b>I — обонятельный нерв.</b> Около 30 тонких волокон поднимаются из носовой полости через решётчатую кость в обонятельную луковицу. Входит прямо в конечный мозг — единственный путь в кору мимо таламуса.' },
  { n: 'II', name: 'Зрительный', type: 'sens', target: 'глаз', text: '<b>II — зрительный нерв</b> идёт от сетчатки в промежуточный мозг и образует перекрёст (хиазму). По происхождению он, как и обонятельный, — тракт ЦНС, а не настоящий нерв.' },
  { n: 'III', name: 'Глазодвигательный', type: 'motp', target: 'мышцы глаза, зрачок', text: '<b>III — глазодвигательный нерв</b> выходит снизу из среднего мозга. Управляет четырьмя из шести мышц глаза. Его парасимпатические волокна сужают зрачок и меняют форму хрусталика — наводят изображение на резкость.' },
  { n: 'IV', name: 'Блоковый', type: 'mot', target: 'верхняя косая мышца глаза', text: '<b>IV — блоковый нерв</b> — единственный, который выходит с дорзальной стороны ствола (из-под нижних холмиков) и огибает его сбоку. Управляет одной мышцей глаза.' },
  { n: 'V', name: 'Тройничный', type: 'mix', target: 'кожа лица, жевательные мышцы', text: '<b>V — тройничный нерв</b>, самый крупный. Три ветви — глазная, верхнечелюстная и нижнечелюстная — сходятся в большой ганглий у моста, аналог спинномозгового. Собирает боль, кожную и мышечную чувствительность головы и управляет жевательными мышцами.' },
  { n: 'VI', name: 'Отводящий', type: 'mot', target: 'наружная прямая мышца глаза', text: '<b>VI — отводящий нерв</b> выходит на границе моста и продолговатого мозга. Отводит глаз наружу — движение по горизонтали.' },
  { n: 'VII', name: 'Лицевой', type: 'mix', target: 'мимические мышцы, слюнные и слёзные железы', text: '<b>VII — лицевой нерв</b> управляет мимикой, слёзными и слюнными железами и чувствует вкус передней частью языка. У рыб он связан с боковой линией, из которой в эволюции получилось внутреннее ухо.' },
  { n: 'VIII', name: 'Преддверно-улитковый', type: 'sens', target: 'внутреннее ухо', text: '<b>VIII — преддверно-улитковый нерв</b> выходит вместе с лицевым. У человека чисто чувствительный: слух от улитки и равновесие от преддверия.' },
  { n: 'IX', name: 'Языкоглоточный', type: 'mix', target: 'язык, глотка, околоушная железа', text: '<b>IX — языкоглоточный нерв</b>: вкус задней части языка, мышцы глотки и глотание, околоушная слюнная железа (парасимпатика).' },
  { n: 'X', name: 'Блуждающий', type: 'mix', target: 'сердце, лёгкие, ЖКТ', text: '<b>X — блуждающий нерв</b> — главный парасимпатический нерв тела. Иннервирует органы грудной и брюшной полости, получает от них информацию, управляет верхней частью пищевода и голосовыми связками.' },
  { n: 'XI', name: 'Добавочный', type: 'motp', target: 'трапециевидная и грудино-ключично-сосцевидная мышцы', text: '<b>XI — добавочный нерв</b> возникает у птиц и млекопитающих. Корешки отчасти идут из спинного мозга. Работает с мышцами плечевого пояса и шеи: поворачивает голову.' },
  { n: 'XII', name: 'Подъязычный', type: 'mot', target: 'мышцы языка', text: '<b>XII — подъязычный нерв</b> выходит из продолговатого мозга между пирамидой и оливой. Возник у рептилий при слиянии ветвей спинномозговых нервов. Управляет мышцами языка.' },
];

function makeCranial() {
  __set_rnd(mulberry(404));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0xc77dff);
  const HOME = flyTarget(V3(0.25, -1.05, 0), V3(4.8, -3.9, 1.4));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 1.2; controls.maxDistance = 12;
  const shell = brainShell(scene, { opacity: 0.24, rim: 0.3, stem: false, color: 0xb89aa6 });
  const mat = (c, o = {}) => tissue(new THREE.Color(c).multiplyScalar(0.4), o);

  /* ---------- нижняя поверхность ствола ---------- */
  const stemMat = mat(0xd8b8c4, { roughness: 0.5 });
  const sArr = [];
  { const c = new THREE.CatmullRomCurve3([V3(0.08, -0.38, 0), V3(-0.1, -0.75, 0), V3(-0.28, -1.15, 0), V3(-0.42, -1.6, 0), V3(-0.5, -2.35, 0)]);
    sArr.push(taperTube(c, (u) => 0.21 - u * 0.09, 60, 24)); }
  [1, -1].forEach((s) => { // ножки мозга
    const c = new THREE.CatmullRomCurve3([V3(0.2, -0.38, 0.18 * s), V3(0.08, -0.6, 0.12 * s), V3(-0.06, -0.8, 0.08 * s)]); sArr.push(taperTube(c, () => 0.085, 24, 14));
    const py = new THREE.CatmullRomCurve3([V3(-0.2, -1.16, 0.045 * s), V3(-0.3, -1.4, 0.04 * s), V3(-0.4, -1.68, 0.03 * s)]); // пирамиды
    const pyG = taperTube(py, (u) => 0.05 - u * 0.02, 24, 12); pyG.translate(0.13, 0, 0); sArr.push(pyG);
    const ol = new THREE.SphereGeometry(1, 20, 14); ol.scale(0.05, 0.12, 0.05); ol.rotateZ(0.35); ol.translate(-0.17, -1.33, 0.12 * s); sArr.push(ol);   // оливы
    const mm = new THREE.SphereGeometry(0.035, 14, 10); mm.translate(0.2, -0.5, 0.045 * s); sArr.push(mm);   // сосцевидные тела
  });
  { const pons = new THREE.SphereGeometry(1, 40, 28); pons.scale(0.24, 0.21, 0.34); pons.rotateZ(-0.35); pons.translate(-0.06, -0.96, 0); sArr.push(pons); }
  scene.add(new THREE.Mesh(mergeGeometries(sArr.map((g) => g.index ? g.toNonIndexed() : g).map((g) => { if (g.attributes.uv) g.deleteAttribute('uv'); return g; })), stemMat));
  // гипофиз, хиазма, зрительные и обонятельные тракты
  const pitMat = mat(0xe8b090), optMat = mat(0xe8e0d0), olfMat = mat(0xe8d8c0);
  scene.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([V3(0.3, -0.52, 0), V3(0.34, -0.62, 0), V3(0.37, -0.72, 0)]), () => 0.02, 10, 8), pitMat));
  { const p = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), pitMat); p.position.set(0.38, -0.78, 0); scene.add(p); }
  const CHI = V3(0.44, -0.54, 0);
  { const a = [];
    [1, -1].forEach((s) => {
      a.push(taperTube(new THREE.CatmullRomCurve3([CHI.clone().add(V3(0.02, 0, 0.03 * s)), V3(0.15, -0.48, 0.24 * s), V3(-0.05, -0.42, 0.32 * s)]), () => 0.025, 20, 8)); // зрительный тракт
      a.push(taperTube(new THREE.CatmullRomCurve3([V3(1.18, -0.6, 0.1 * s), V3(0.95, -0.55, 0.12 * s), V3(0.66, -0.5, 0.15 * s), V3(0.5, -0.47, 0.22 * s)]), () => 0.02, 20, 8));    // обонятельный тракт
    });
    scene.add(new THREE.Mesh(mergeGeometries(a), optMat)); }
  { const x = new THREE.BoxGeometry(0.08, 0.03, 0.12); x.translate(CHI.x, CHI.y, CHI.z); scene.add(new THREE.Mesh(x, optMat)); }
  [1, -1].forEach((s) => { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.12, 6, 12).rotateZ(Math.PI / 2), olfMat); b.position.set(1.25, -0.62, 0.1 * s); scene.add(b); });

  /* ---------- органы-мишени ---------- */
  const T = {};
  const eye = (s) => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 28, 20), mat(0xf4f0ea, { roughness: 0.2, clearcoat: 1 }))); const ir = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), new THREE.MeshPhysicalMaterial({ color: 0x3a6a8a, roughness: 0.3 })); ir.position.x = 0.171; ir.rotation.y = Math.PI / 2; g.add(ir); const pu = new THREE.Mesh(new THREE.CircleGeometry(0.035, 20), new THREE.MeshBasicMaterial({ color: 0x050505 })); pu.position.x = 0.172; pu.rotation.y = Math.PI / 2; g.add(pu); g.position.set(1.6, -0.38, 0.5 * s); scene.add(g); return g; };
  T.eye = [eye(1), eye(-1)];
  const icon = (geo, c, p) => { const m = new THREE.Mesh(geo, mat(c, { roughness: 0.35 })); m.position.copy(p); scene.add(m); return m; };
  T.nose = icon(new THREE.ConeGeometry(0.1, 0.28, 16).rotateZ(-Math.PI / 2 - 0.4), 0xd8a08c, V3(1.55, -1.0, 0));
  T.tongue = icon(new THREE.SphereGeometry(1, 24, 16).scale(0.28, 0.06, 0.16), 0xd06070, V3(1.1, -1.55, 0));
  T.ear = [1, -1].map((s) => { const g = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.022, 8, 24, Math.PI * 3.2), mat(0xe8c890)); g.position.set(-0.15, -1.1, 0.78 * s); g.rotation.y = Math.PI / 2; scene.add(g); return g; });
  T.heart = icon(new THREE.SphereGeometry(0.12, 24, 18).scale(1, 1.1, 0.9), 0xd04a50, V3(0.25, -3.22, 0.1));
  T.gut = icon(new THREE.TorusKnotGeometry(0.14, 0.05, 64, 10), 0xd08a70, V3(0.15, -3.75, -0.1));
  T.trap = [1, -1].map((s) => icon(new THREE.BoxGeometry(0.06, 0.36, 0.3).rotateX(0.5 * s), 0xd05a50, V3(-0.65, -2.45, 0.95 * s)));

  /* ---------- нервы ---------- */
  const nerves = [];
  const P = (x, y, z) => V3(x, y, z);
  const ROUTES = {
    I: (s) => [[T.nose.position.clone().add(P(-0.05, 0.08, 0.06 * s)), P(1.3, -0.82, 0.08 * s), P(1.25, -0.66, 0.1 * s)]],
    II: (s) => [[P(1.43, -0.38, 0.48 * s), P(1.0, -0.48, 0.32 * s), P(0.7, -0.53, 0.14 * s), CHI.clone().add(P(0.03, 0, 0.03 * s))]],
    III: (s) => [[P(0.12, -0.58, 0.04 * s), P(0.4, -0.66, 0.16 * s), P(0.95, -0.55, 0.38 * s), P(1.45, -0.48, 0.48 * s)]],
    IV: (s) => [[P(-0.28, -0.52, 0.08 * s), P(-0.15, -0.6, 0.24 * s), P(0.2, -0.62, 0.3 * s), P(0.9, -0.48, 0.42 * s), P(1.45, -0.28, 0.5 * s)]],
    V: (s) => [[P(-0.05, -0.92, 0.3 * s), P(0.12, -0.95, 0.42 * s), P(0.6, -0.55, 0.55 * s), P(1.42, -0.18, 0.55 * s)], [P(0.12, -0.95, 0.42 * s), P(0.7, -0.95, 0.62 * s), P(1.15, -1.05, 0.68 * s)], [P(0.12, -0.95, 0.42 * s), P(0.45, -1.3, 0.6 * s), P(0.75, -1.5, 0.6 * s)]],
    VI: (s) => [[P(-0.12, -1.13, 0.06 * s), P(0.2, -1.0, 0.18 * s), P(0.8, -0.65, 0.45 * s), P(1.47, -0.45, 0.6 * s)]],
    VII: (s) => [[P(-0.18, -1.12, 0.21 * s), P(-0.1, -1.18, 0.5 * s), P(0.4, -1.25, 0.72 * s), P(1.1, -1.1, 0.72 * s)]],
    VIII: (s) => [[P(-0.15, -1.1, 0.72 * s), P(-0.18, -1.12, 0.5 * s), P(-0.22, -1.12, 0.27 * s)]],
    IX: (s) => [[P(-0.3, -1.3, 0.17 * s), P(-0.15, -1.45, 0.35 * s), P(0.4, -1.62, 0.25 * s), P(0.95, -1.58, 0.1 * s)]],
    X: (s) => [[P(-0.33, -1.38, 0.17 * s), P(-0.25, -1.6, 0.35 * s), P(-0.05, -2.2, 0.3 * s), P(0.15, -2.8, 0.2 * s), P(0.25, -3.12, 0.12 * s)]],
    XI: (s) => [[P(-0.47, -1.95, 0.12 * s), P(-0.4, -1.55, 0.2 * s), P(-0.35, -1.48, 0.3 * s), P(-0.45, -2.0, 0.65 * s), P(-0.62, -2.35, 0.9 * s)]],
    XII: (s) => [[P(-0.22, -1.36, 0.08 * s), P(0.1, -1.5, 0.15 * s), P(0.6, -1.58, 0.1 * s), P(1.0, -1.56, 0.04 * s)]],
  };
  const flowDir = { sens: [-1], mot: [1], motp: [1], mix: [1, -1] };
  CN.forEach((nv, idx) => {
    const ty = CN_TYPES[nv.type], col = new THREE.Color(ty.color);
    const m = new THREE.MeshPhysicalMaterial({ color: col.clone().multiplyScalar(0.45), roughness: 0.4, clearcoat: 0.6, emissive: col, emissiveIntensity: 0.25, transparent: true, opacity: 1 });
    const flows = flowDir[nv.type].map((d) => { const f = flowTubeMat(ty.color, 0.5 * d, 2.2); f.uniforms.uOn.value = 0; return f; });
    const grp = new THREE.Group(); scene.add(grp);
    const meshes = [];
    [1, -1].forEach((s) => ROUTES[nv.n](s).forEach((pts, bi) => {
      const c = new THREE.CatmullRomCurve3(pts), r = nv.n === 'V' && bi === 0 ? 0.03 : nv.n === 'II' ? 0.028 : nv.n === 'I' ? 0.012 : 0.017;
      const g = taperTube(c, (u) => (nv.n === 'V' && bi === 0 ? 0.04 - u * 0.018 : r), 40, 8);
      const mm = new THREE.Mesh(g, m); mm.userData.pick = idx; grp.add(mm); meshes.push(mm);
      flows.forEach((f) => { const fg = taperTube(c, () => r * 1.6, 40, 8); grp.add(new THREE.Mesh(fg, f)); });
      if (bi === 0) nv['p' + s] = c.getPointAt(nv.type === 'sens' ? 0.05 : 0.45);
    }));
    if (nv.n === 'V') [1, -1].forEach((s) => { const gg = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12).scale(0.08, 0.05, 0.06), m); gg.position.set(0.12, -0.95, 0.42 * s); gg.userData.pick = idx; grp.add(gg); meshes.push(gg); });
    if (nv.n === 'I') [1, -1].forEach((s) => { for (let k = 0; k < 6; k++) { const a = P(1.22 + rand(-0.06, 0.06), -0.66, (0.1 + rand(-0.03, 0.03)) * s), b = P(1.32 + rand(-0.05, 0.05), -0.9, (0.07 + rand(-0.03, 0.03)) * s); grp.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, b]), 4, 0.005, 4), m)); } });
    nerves.push({ ...nv, m, flows, grp, meshes, col });
  });

  const st = { t: 0, sel: null, type: 'all', labels: true, rot: false, fly: null };
  function apply() {
    nerves.forEach((nv, i) => {
      const on = (st.sel === null || st.sel === i) && (st.type === 'all' || nv.type === st.type);
      if (nv.m.transparent === on) nv.m.needsUpdate = true; nv.m.opacity = on ? 1 : 0.1; nv.m.transparent = !on; nv.m.depthWrite = on; nv.m.emissiveIntensity = st.sel === i ? 0.9 : on ? 0.3 : 0.05;
      nv.flows.forEach((f) => { f.uniforms.uOn.value = st.sel === i ? 1.2 : on && st.type !== 'all' ? 0.6 : 0; });
    });
    accentSet(st.sel !== null ? CN_TYPES[nerves[st.sel].type].color : '#C77DFF');
  }
  function select(i) {
    st.sel = i === 'all' ? null : i; if (st.sel !== null) st.type = 'all';
    apply(); refs.seg && refs.seg.sync(); refs.tseg && refs.tseg.sync(); refs.setInfo && refs.setInfo();
    if (st.sel !== null) { const nv = nerves[st.sel], p = nv.p1.clone().lerp(V3(0.3, -1.0, 0.5), 0.3); st.fly = flyTarget(p, p.clone().add(V3(2.3, -1.6, 1.6))); } else st.fly = HOME;
  }
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4;
    flyStep(st, camera, controls, dt);
    nerves.forEach((nv) => nv.flows.forEach((f) => { f.uniforms.uTime.value = st.t; }));
    T.eye.forEach((e, i) => { e.rotation.z = 0.08 * Math.sin(st.t * 0.7 + i); e.rotation.y = 0.12 * Math.sin(st.t * 0.5); });
  }
  pickOn(() => self, camera, () => nerves.flatMap((nv) => nv.meshes), (i) => select(i));
  const labels = [
    ...nerves.map((nv, i) => ({ text: nv.n, pos: nv.p1.clone().add(V3(0, -0.04, 0.04)), color: CN_TYPES[nv.type].color, show: () => st.labels && (st.sel === null || st.sel === i) && (st.type === 'all' || st.type === nv.type) })),
    { text: 'мост', pos: V3(0.16, -1.0, 0.0), show: () => st.labels && st.sel === null },
    { text: 'продолговатый мозг', pos: V3(-0.2, -1.55, 0.05), show: () => st.labels && st.sel === null },
    { text: 'оливы и пирамиды', pos: V3(-0.13, -1.33, 0.14), show: () => st.labels && st.sel === null },
    { text: 'хиазма', pos: CHI.clone().add(V3(0.02, -0.05, 0)), color: '#e8e0d0', show: () => st.labels && st.sel === null },
    { text: 'гипофиз', pos: V3(0.42, -0.86, 0), color: '#e8b090', show: () => st.labels && st.sel === null },
    { text: 'обонятельная луковица', pos: V3(1.3, -0.66, -0.13), color: '#e8d8c0', show: () => st.labels && st.sel === null },
    ...nerves.map((nv, i) => ({ text: nv.target, pos: (ROUTES[nv.n](1)[0][nv.type === 'sens' ? 0 : ROUTES[nv.n](1)[0].length - 1]).clone().add(V3(0.05, -0.07, 0.05)), color: '#D2CBD0', show: () => st.labels && st.sel === i })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 300px');
    refs.setInfo = () => { ib.info.innerHTML = st.sel !== null ? nerves[st.sel].text : st.type !== 'all' ? `<b>${CN_TYPES[st.type].name}:</b> ` + nerves.filter((n) => n.type === st.type).map((n) => n.n + ' ' + n.name.toLowerCase()).join(', ') + '. Светлые волны показывают направление сигнала: к мозгу у чувствительных, от мозга у двигательных.' : 'Нижняя поверхность мозга. В спинном мозге 31 пара одинаковых нервов, а в головном — 12 пар уникальных, у каждого своё имя и функции. Нажмите на нерв или выберите его номер.'; };
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...nerves.map((nv, i) => ({ id: i, label: nv.n, color: CN_TYPES[nv.type].color }))], () => (st.sel === null ? 'all' : st.sel), (v) => select(v));
    refs.tseg = seg([{ id: 'all', label: 'Все типы' }, ...Object.entries(CN_TYPES).map(([k, v]) => ({ id: k, label: v.name, color: v.color }))], () => st.type, (v) => { st.type = v; st.sel = null; apply(); refs.seg.sync(); refs.setInfo(); });
    const rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { rot, lab });
    el.append(h('div', { class: 'grp', style: 'flex:1 1 520px' }, h('div', { class: 'glabel' }, 'Нерв', h('kbd', {}, 'клик по нерву · ← →')), h('div', { class: 'gctl' }, refs.seg), h('div', { class: 'gctl' }, refs.tseg)), group('Вид', 'R · N', rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (e.key === 'ArrowRight') { select(st.sel === null ? 0 : (st.sel + 1) % 12); return true; }
    if (e.key === 'ArrowLeft') { select(st.sel === null ? 11 : (st.sel + 11) % 12); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { if (st.sel !== null) { const nv = nerves[st.sel]; return [['Пара', nv.n, ''], ['Тип', CN_TYPES[nv.type].name.split(' ')[0], '']]; } return [['Пар', 12, ''], ['Чувствительных', 3, ''], ['Смешанных', 4, '']]; }
  apply();
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return st.sel !== null ? CN_TYPES[nerves[st.sel].type].color : '#C77DFF'; },
    kicker: 'Мозг · черепные нервы', title: 'Черепные нервы',
    lede: 'Двенадцать пар нервов головного мозга. Каждый уникален: одни только чувствуют, другие только управляют мышцами, третьи делают и то и другое.',
    notes: `
      <div><h2>Как их запомнить</h2>
        <p><b>Чувствительные</b> — I, II, VIII: обоняние, зрение, внутреннее ухо (слух и равновесие). <b>Двигательные</b> — IV, VI, XII. <b>Двигательные с парасимпатикой</b> — III и XI. <b>Смешанные</b> — V, VII, IX, X: по набору функций они ближе всего к спинномозговым нервам.</p>
        <h3>Откуда выходят</h3>
        <p>I входит в конечный мозг, II — в промежуточный. III и IV выходят из среднего мозга (IV — единственный с дорзальной стороны). V связан с мостом. VI, VII и VIII выходят на границе моста и продолговатого мозга, IX–XII — из продолговатого.</p>
        <h3>Эволюция</h3>
        <p>Набор формируется не сразу: у рыб части нервов ещё нет, у амфибий и рептилий нет добавочного XI, полный набор — у птиц и млекопитающих. В продолговатом мозге и мосту сохраняется план спинного: чувствительные ядра лежат латерально, двигательные — медиально, парасимпатические — между ними.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Места выхода нервов на нижней поверхности мозга.</li><li>Классификация по функциям и направление сигнала.</li><li>Ганглий и три ветви тройничного нерва.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Мишени (глаз, ухо, язык, сердце) придвинуты к мозгу и нарисованы значками.</li><li>Ход нервов в черепе упрощён.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li>клик по нерву: выбрать</li><li><code>←</code> <code>→</code> следующий нерв</li><li><code>Esc</code> все</li><li><code>R</code> вращение</li><li><code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeCranial };
