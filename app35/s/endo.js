import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, button, clamp, dimOthers, displaceGeo, ell3, envTex, flyStep, flyTarget, glowNucleus, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, organMat, pickOn, randUnit, rnd, scopeShow, seg, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ЭНДОКРИННАЯ СИСТЕМА
   ========================================================= */
const EN_GL = [
  { id: 'hyp', name: 'Гипоталамус и гипофиз', color: '#C77DFF', p: V3(0, 4.05, 0.08), text: '<b>Гипоталамус</b> — мост между нервной и эндокринной системами: его нейроны выделяют рилизинг-гормоны. <b>Гипофиз</b> (0,5 г) — «главная железа»: передняя доля выпускает тропные гормоны (ТТГ, АКТГ, ФСГ, ЛГ), гормон роста и пролактин; задняя доля лишь хранит и выпускает вазопрессин и окситоцин, сделанные нейронами гипоталамуса.', hormones: 'ТТГ, АКТГ, СТГ, ФСГ, ЛГ, пролактин, АДГ, окситоцин', targets: ['thy', 'adr', 'gon', 'liver', 'kid'] },
  { id: 'pin', name: 'Эпифиз', color: '#9FA8FF', p: V3(0, 4.2, -0.12), text: '<b>Эпифиз</b> (шишковидная железа) ночью, в темноте выделяет мелатонин — сигнал «пора спать» для всего организма. Свет, особенно синий, подавляет его выработку.', hormones: 'мелатонин', targets: ['hyp'] },
  { id: 'thy', name: 'Щитовидная железа', color: '#5CC48A', p: V3(0, 3.3, 0.22), text: '<b>Щитовидная железа</b> в форме бабочки на передней стороне шеи. Её гормоны тироксин (T4) и трийодтиронин (T3) содержат йод и задают скорость обмена веществ почти во всех клетках, а у детей необходимы для развития мозга. Кальцитонин снижает кальций крови.', hormones: 'T4, T3, кальцитонин', targets: ['heart', 'liver', 'mus'] },
  { id: 'para', name: 'Паращитовидные', color: '#E8D86A', p: V3(0.09, 3.33, 0.14), text: '<b>Паращитовидные железы</b> — четыре «зёрнышка» на задней стороне щитовидной. Паратгормон повышает кальций в крови: забирает его из костей и удерживает в почках.', hormones: 'паратгормон', targets: ['bone', 'kid'] },
  { id: 'thym', name: 'Тимус', color: '#7FD6C8', p: V3(0, 2.72, 0.32), text: '<b>Тимус</b> (вилочковая железа) — школа T-лимфоцитов иммунной системы. Наиболее развит в детстве, после полового созревания постепенно замещается жиром.', hormones: 'тимозины', targets: [] },
  { id: 'adr', name: 'Надпочечники', color: '#F2C14E', p: V3(0.42, 1.38, -0.33), text: '<b>Надпочечники.</b> Кора выделяет кортизол (стресс, сахар крови, подавление воспаления), альдостерон (натрий и вода) и немного половых гормонов. Мозговое вещество — адреналин и норадреналин: реакция «бей или беги» за секунды.', hormones: 'кортизол, альдостерон, адреналин', targets: ['heart', 'liver', 'kid', 'mus'] },
  { id: 'panc', name: 'Островки поджелудочной', color: '#FF8A5C', p: V3(0.18, 1.08, -0.12), text: '<b>Островки Лангерганса</b> — 1–2% ткани поджелудочной железы, около миллиона скоплений клеток. Бета-клетки выделяют <b>инсулин</b>, открывающий клеткам вход для глюкозы, альфа-клетки — <b>глюкагон</b>, заставляющий печень выпускать глюкозу. Нехватка инсулина — сахарный диабет.', hormones: 'инсулин, глюкагон', targets: ['liver', 'mus'] },
  { id: 'gon', name: 'Половые железы', color: '#FF7AB0', p: V3(0.3, -0.05, 0.05), text: '<b>Половые железы</b> — яичники у женщин (эстрогены, прогестерон) и яички у мужчин (тестостерон). Их работой управляют ФСГ и ЛГ гипофиза. Гормоны запускают половое созревание, вторичные половые признаки, влияют на кости, мышцы и мозг.', hormones: 'эстрогены, прогестерон, тестостерон', targets: ['bone', 'mus'] },
  { id: 'hrt', name: 'Сердце', color: '#FF7A7A', diffuse: true, p: V3(0.06, 2.24, 0.3), text: '<b>Сердце</b> — тоже эндокринный орган. Растянутые избытком крови предсердия выделяют <b>натрийуретический пептид</b>: почки выводят больше соли и воды, сосуды расширяются, давление снижается. Анализ на родственный пептид BNP помогает распознать сердечную недостаточность.', hormones: 'натрийуретический пептид', targets: ['kid'] },
  { id: 'kidE', name: 'Почки', color: '#E89060', diffuse: true, p: V3(-0.45, 0.94, -0.26), text: '<b>Почки</b> выделяют <b>эритропоэтин</b> (при нехватке кислорода костный мозг делает больше эритроцитов), <b>ренин</b> (запускает систему ренин — ангиотензин — альдостерон, поднимающую давление) и превращают витамин D в активный <b>кальцитриол</b>, который усиливает всасывание кальция.', hormones: 'эритропоэтин, ренин, кальцитриол', targets: ['bone', 'adr'] },
  { id: 'gut', name: 'Желудок и кишка', color: '#F2B070', diffuse: true, p: V3(0.2, 1.45, 0.25), text: '<b>Желудок и кишка</b> — самая большая эндокринная «железа»: рассеянные в слизистой клетки выделяют <b>гастрин</b> (кислота желудка), <b>секретин</b> и <b>холецистокинин</b> (сок поджелудочной и желчь), <b>ГИП и ГЛП-1</b> (усиливают выброс инсулина после еды — на ГЛП-1 основаны лекарства от диабета и ожирения) и <b>грелин</b> — «гормон голода».', hormones: 'гастрин, секретин, ХЦК, ГИП, ГЛП-1, грелин', targets: ['liver', 'hyp'] },
  { id: 'fat', name: 'Жировая ткань', color: '#F2E08A', diffuse: true, p: V3(-0.25, 0.42, 0.42), text: '<b>Жировая ткань</b> выделяет <b>лептин</b>: чем больше жира, тем больше лептина и тем сильнее гипоталамус гасит аппетит; при ожирении мозг перестаёт слышать этот сигнал. <b>Адипонектин</b> повышает чувствительность к инсулину. В жире также образуются эстрогены.', hormones: 'лептин, адипонектин', targets: ['hyp', 'liver', 'mus'] },
];
function makeEndo() {
  __set_rnd(mulberry(1616));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0xc77dff);
  const VIEW = { map: flyTarget(V3(0.0, 1.45, 0), V3(2.3, 2.2, 12.8)), sugar: flyTarget(V3(-0.1, 0.75, 0), V3(1.8, 1.8, 6.2)), stress: flyTarget(V3(0.1, 1.9, 0), V3(-2.6, 3.0, 8.4)), thy: flyTarget(V3(0.0, 3.25, 0.1), V3(1.3, 3.6, 3.6)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.map.pos);
  const controls = makeControls(camera, VIEW.map.target); controls.minDistance = 1.2; controls.maxDistance = 22;
  bodyShell(scene, { rim: 0.36 });
  const GL = Object.fromEntries(EN_GL.map((g) => [g.id, { ...g, mats: [], meshes: [] }])), pick = [];
  const add = (id, geo, o = {}) => { const m = organMat(GL[id].color, 0.48, { emissiveIntensity: 0.12, ...o }); GL[id].mats.push(m); const me = new THREE.Mesh(geo, m); me.userData.pick = id; pick.push(me); scene.add(me); GL[id].meshes.push(me); return me; };
  // мозг-призрак
  const brainG = new THREE.Mesh(ell3(0.34, 0.28, 0.4, V3(0, 4.25, 0)), new THREE.MeshPhysicalMaterial({ color: 0xe0b8c8, roughness: 0.6, transparent: true, opacity: 0.1, depthWrite: false })); scene.add(brainG);
  add('hyp', ell3(0.05, 0.04, 0.05, V3(0, 4.1, 0.06))); add('hyp', ell3(0.045, 0.04, 0.045, V3(0, 3.98, 0.1))); add('hyp', tube([V3(0, 4.08, 0.07), V3(0, 4.0, 0.09)], 0.012, 6, 6));
  add('pin', ell3(0.03, 0.025, 0.04, GL.pin.p));
  const thyGrp = new THREE.Group(); thyGrp.position.copy(GL.thy.p); scene.add(thyGrp);
  [1, -1].forEach((s) => { const g = ell3(0.06, 0.12, 0.05); g.rotateZ(0.15 * s); g.translate(0.075 * s, 0, -0.02); const m = add('thy', g); thyGrp.add(m); });
  thyGrp.add(add('thy', ell3(0.05, 0.03, 0.03, V3(0, -0.05, 0.02))));
  [[0.09, 3.36], [0.09, 3.26], [-0.09, 3.36], [-0.09, 3.26]].forEach(([x, y]) => add('para', ell3(0.018, 0.022, 0.018, V3(x, y, 0.15))));
  [1, -1].forEach((s) => add('thym', ell3(0.08, 0.16, 0.05, V3(0.06 * s, 2.72, 0.3))));
  [1, -1].forEach((s) => { const g = ell3(0.1, 0.07, 0.06); g.rotateZ(0.3 * s); g.translate(0.42 * s, 1.38, -0.33); add('adr', g); });  // поворот до переноса: иначе железа уезжает к срединной линии
  const PANC = new THREE.CatmullRomCurve3([V3(-0.22, 0.97, -0.06), V3(0.0, 1.0, -0.14), V3(0.3, 1.08, -0.2), V3(0.56, 1.18, -0.2)]);
  add('panc', taperTube(PANC, (u) => 0.08 - 0.04 * u, 50, 14), { emissiveIntensity: 0.05 });
  const islets = []; for (let i = 0; i < 18; i++) islets.push(glowNucleus(scene, PANC.getPointAt(rnd()).add(randUnit().multiplyScalar(0.04)), '#FF8A5C', 0.012, 6));
  [1, -1].forEach((s) => add('gon', ell3(0.06, 0.04, 0.04, V3(0.3 * s, -0.05, 0.05))));
  // диффузная эндокринная система: предсердия, юкстагломерулярный аппарат почек, клетки слизистой ЖКТ, жир
  add('hrt', ell3(0.08, 0.07, 0.07, GL.hrt.p)); add('hrt', ell3(0.07, 0.06, 0.06, BODY.heart.clone().add(V3(0.15, 0.2, -0.08))));
  [-0.45, 0.45].forEach((x) => add('kidE', ell3(0.035, 0.07, 0.03, V3(x * 0.82, x > 0 ? 1.0 : 0.94, -0.26))));
  { const GUT = new THREE.CatmullRomCurve3([V3(0.35, 1.5, 0.2), V3(0.12, 1.38, 0.28), V3(-0.12, 1.3, 0.22), V3(-0.18, 1.15, 0.15)]); add('gut', taperTube(GUT, () => 0.035, 30, 8)); for (let i = 0; i < 10; i++) glowNucleus(scene, GUT.getPointAt(i / 9).add(randUnit().multiplyScalar(0.03)), '#F2B070', 0.01, 6); }
  [[-0.25, 0.42, 0.42], [0.2, 0.38, 0.44], [0.0, 0.25, 0.46], [-0.4, 0.2, 0.36], [0.38, 0.22, 0.36]].forEach(([x, y, z]) => add('fat', ell3(0.09, 0.06, 0.04, V3(x, y, z)), { transparent: true, opacity: 0.8 }));
  // органы-мишени (призраки)
  const ghostMat = (c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.35), roughness: 0.6, transparent: true, opacity: 0.22, depthWrite: false, emissive: new THREE.Color(c), emissiveIntensity: 0.05 });
  const TG = {
    liver: { p: V3(-0.35, 1.52, 0.12), m: new THREE.Mesh(ell3(0.55, 0.26, 0.38, V3(-0.35, 1.52, 0.12)), ghostMat('#b05a48')) },
    heart: { p: BODY.heart.clone(), m: new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(1, 36, 28), (v) => { const k = v.y < 0 ? 1 + 0.55 * v.y : 1; v.set(v.x * 0.27 * k, v.y * 0.34, v.z * 0.24 * k); }), ghostMat('#c84a50')) },   // сердце-капля, верхушкой вниз-влево
    kid: { p: V3(0.45, 1.0, -0.33), m: new THREE.Mesh(mergeGeometries([0.45, -0.45].map((x) => ell3(0.11, 0.18, 0.09, V3(x, x > 0 ? 1.0 : 0.94, -0.33)))), ghostMat('#b85a50')) },
    mus: { p: V3(-0.5, -1.0, 0.05), m: new THREE.Mesh(tube([V3(-0.5, -0.35, 0.05), V3(-0.52, -1.05, 0.08), V3(-0.5, -1.75, 0.05)], (u) => 0.03 + 0.15 * Math.sin(Math.PI * u), 30, 16), ghostMat('#c86a6a')) },   // мышца-веретено
    bone: { p: V3(0.5, -1.0, 0.0), m: new THREE.Mesh(mergeGeometries([tube([V3(0.5, -0.3, 0.0), V3(0.48, -1.8, 0.02)], 0.05, 20, 10), ell3(0.09, 0.08, 0.08, V3(0.5, -0.28, 0.0), 16), ell3(0.09, 0.08, 0.08, V3(0.48, -1.82, 0.02), 16)]), ghostMat('#e8d8bb')) },   // бедренная кость с головками
  };
  TG.heart.m.position.copy(BODY.heart).add(V3(0.06, 0, 0)); TG.heart.m.rotation.z = 0.55;   // геометрия в нуле — пульсирует на месте, верхушка влево
  Object.values(TG).forEach((x) => scene.add(x.m));
  TG.thy = { p: GL.thy.p }; TG.adr = { p: GL.adr.p }; TG.gon = { p: GL.gon.p }; TG.hyp = { p: GL.hyp.p }; TG.panc = { p: GL.panc.p };
  const arc = (a, b) => { const m = a.clone().lerp(b, 0.5); m.z += 0.35; m.x += (b.x - a.x) * 0.1; return new THREE.CatmullRomCurve3([a, m, b]); };
  const fx = new Sparks(2600, 0.065); scene.add(fx.obj);
  /* ---------- модели обратной связи ---------- */
  const SIM = { G: 5.0, I: 8, Gn: 60, meal: -99, C: 10, A: 0.1, HR: 70, stressT: -99, TSH: 2, T4: 1, iodine: 1 };
  const st = { t: 0, mode: 'map', sel: null, labels: true, rot: false, fly: null, trace: [], msg: null, flows: [] };
  function emit(from, to, color, n = 1) { for (let i = 0; i < n; i++) st.flows.push({ c: arc(from, to), u: 0, col: new THREE.Color(color), sp: 0.5 + rnd() * 0.3 }); }
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(EN_GL.map((g) => GL[g.id]), st.sel); Object.values(TG).forEach((x) => { if (x.m) x.m.material.opacity = 0.22; }); if (st.sel) GL[st.sel].targets.forEach((tg) => { if (TG[tg] && TG[tg].m) TG[tg].m.material.opacity = 0.45; }); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.fly = VIEW[m]; st.trace = []; st.msg = null; if (m === 'sugar') { SIM.meal = st.t + 1.5; } if (m === 'stress') SIM.stressT = st.t + 1; if (m === 'thy') { SIM.iodine = 1; } select('all'); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'map') select(id); });
  const C = { ins: '#FF8A5C', glc: '#7FE0A0', cor: '#F2C14E', adr: '#FF5A5A', tsh: '#C77DFF', t4: '#5CC48A', glu: '#FFE08A' };
  // мишени гормонов (мышца, кость) — только когда к ним идёт сигнал: в «Сахаре» мышца, в «Железах» — у выбранной железы
  const showTG = (k) => st.mode === 'sugar' ? k === 'mus' : st.mode === 'map' ? !!st.sel && GL[st.sel].targets.includes(k) : true;
  function update(dt) {
    ['mus', 'bone'].forEach((k) => { if (TG[k] && TG[k].m) TG[k].m.visible = showTG(k); });
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    const S = SIM, h2 = dt * 1.2; // ускоренное время модели
    // сахар крови: еда → глюкоза → инсулин → поглощение; голод → глюкагон → печень
    const meal = t > S.meal && t < S.meal + 4 ? 2.2 : 0;
    const insRel = Math.max(0, S.G - 5) * 9, glcRel = Math.max(0, 4.8 - S.G) * 70 + 15;
    S.I += h2 * (insRel - 0.6 * (S.I - 6)); S.Gn += h2 * (glcRel - 0.8 * (S.Gn - 50) - 0.5 * S.I);
    S.G += h2 * (meal - 0.022 * S.I * (S.G - 3.2) + 0.006 * Math.max(0, S.Gn - 40) * 1.0 + (S.C - 10) * 0.004 + S.A * 0.4 - 0.05 * (S.G - 5));
    S.G = clamp(S.G, 2.5, 14); S.I = clamp(S.I, 0, 120); S.Gn = clamp(S.Gn, 10, 200);
    // стресс
    const stress = t > S.stressT && t < S.stressT + 6;
    S.A += h2 * ((stress ? 3 : 0) - 1.4 * S.A); S.C += h2 * ((stress ? 22 : 10) - S.C) * 0.25; S.HR += h2 * ((70 + 60 * S.A) - S.HR) * 2;
    // щитовидная ось
    S.TSH += h2 * (2 + 6 * Math.max(0, 1 - S.T4) - 0.8 * S.TSH * S.T4) * 0.6; S.T4 += h2 * (0.35 * S.TSH * S.iodine - 0.7 * S.T4) * 0.6; S.TSH = clamp(S.TSH, 0.1, 30); S.T4 = clamp(S.T4, 0.05, 3);
    const goiter = 1 + Math.max(0, S.TSH - 3) * 0.06; thyGrp.scale.setScalar(Math.min(1.9, goiter));
    // частицы гормонов
    if (st.mode === 'map' && st.sel && rnd() < 0.25) { const g = GL[st.sel]; g.targets.forEach((tg) => { if (TG[tg]) emit(g.p, TG[tg].p, g.color); }); }
    if (st.mode === 'sugar') { if (rnd() < insRel * 0.004) emit(GL.panc.p, rnd() < 0.5 ? TG.liver.p : TG.mus.p, C.ins); if (rnd() < (S.Gn - 50) * 0.003) emit(GL.panc.p, TG.liver.p, C.glc); if (meal && rnd() < 0.5) emit(V3(0.2, 1.2, 0.2), TG.liver.p, C.glu); islets.forEach((x) => { x.spr.material.opacity = 0.3 + Math.min(1, insRel / 25); }); }
    if (st.mode === 'stress') { if (stress && rnd() < 0.3) emit(GL.hyp.p, GL.adr.p, C.tsh); if (rnd() < S.A * 0.3) emit(GL.adr.p, rnd() < 0.5 ? TG.heart.p : TG.liver.p, C.adr); if (rnd() < (S.C - 10) * 0.02) emit(GL.adr.p, TG.liver.p, C.cor); TG.heart.m.scale.setScalar(1 + 0.05 * Math.max(0, Math.sin(t * Math.PI * 2 * S.HR / 60)) ** 8); }
    if (st.mode === 'thy') { if (rnd() < S.TSH * 0.04) emit(GL.hyp.p, GL.thy.p, C.tsh); if (rnd() < S.T4 * 0.15) emit(GL.thy.p, rnd() < 0.5 ? TG.heart.p : TG.liver.p, C.t4); if (rnd() < S.T4 * 0.06) emit(GL.thy.p, GL.hyp.p, '#FF4A4A'); }
    st.flows = st.flows.filter((f) => { f.u += dt * f.sp; if (f.u > 1) return false; fx.spawn(f.c.getPointAt(f.u), V3(0, 0, 0), f.col, 0.3, 0, 1.5); return true; });
    if (st.flows.length > 400) st.flows.splice(0, st.flows.length - 400);
    const rec = st.mode === 'sugar' ? [S.G / 12, S.I / 80, S.Gn / 160] : st.mode === 'stress' ? [S.HR / 180, S.C / 30, S.A / 3] : [S.TSH / 20, S.T4 / 2.5, 0];
    st.trace.push([t, ...rec]); while (st.trace.length && t - st.trace[0][0] > 14) st.trace.shift();
    fx.update(dt);
  }
  const SC = { sugar: [['глюкоза', '#FFE08A'], ['инсулин', '#FF8A5C'], ['глюкагон', '#7FE0A0']], stress: [['пульс', '#FF5A5A'], ['кортизол', '#F2C14E'], ['адреналин', '#FF9AA0']], thy: [['ТТГ', '#C77DFF'], ['T4', '#5CC48A']] };
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); const on = st.mode !== 'map'; scopeShow(on); if (!on) return;
    const x = (tt) => 8 + (1 - (st.t - tt) / 14) * (w - 16), Y = (v) => hgt - 8 - Math.min(1.05, v) * (hgt - 24);
    SC[st.mode].forEach(([name, col], k) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); st.trace.forEach((r, i) => { const yy = Y(r[k + 1]); i ? ctx.lineTo(x(r[0]), yy) : ctx.moveTo(x(r[0]), yy); }); ctx.stroke(); ctx.fillStyle = col; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText(name, 10 + k * 76, 13); });
  }
  const TXT = {
    map: '<b>Эндокринная система</b> — железы внутренней секреции. У них нет протоков: гормоны выделяются прямо в кровь и разносятся по всему телу, но действуют только на клетки с подходящими рецепторами. Это медленная и долгая регуляция в отличие от быстрой нервной. Нажмите на железу — увидите, куда идут её гормоны.',
    sugar: '<b>Сахар крови.</b> После еды глюкоза в крови растёт (жёлтая линия) → бета-клетки островков выделяют <b>инсулин</b> → печень и мышцы забирают глюкозу и запасают её как гликоген → уровень возвращается к 4–6 ммоль/л. Когда сахар падает, альфа-клетки выделяют <b>глюкагон</b>, и печень выпускает глюкозу обратно. Это отрицательная обратная связь.',
    stress: '<b>Стресс.</b> Быстрая волна: симпатические нервы → мозговое вещество надпочечников → <b>адреналин</b> за секунды: сердце бьётся чаще, печень выбрасывает глюкозу, мышцы готовы. Медленная волна: гипоталамус (КРГ) → гипофиз (АКТГ) → кора надпочечников → <b>кортизол</b>, который держит организм в мобилизации часами. Долгий стресс с высоким кортизолом вредит иммунитету и памяти.',
    thy: '<b>Ось «гипоталамус — гипофиз — щитовидная железа».</b> ТРГ гипоталамуса → ТТГ гипофиза (фиолетовые частицы) → железа выделяет T4 и T3 (зелёные). Когда гормонов достаточно, они тормозят гипоталамус и гипофиз (красные частицы) — отрицательная обратная связь держит уровень постоянным. Нажмите «Мало йода».',
    iod: '<b>Нехватка йода.</b> Без йода железа не может сделать T4 → обратная связь ослабевает → гипофиз выделяет всё больше ТТГ → ТТГ заставляет железу расти: развивается эндемический зоб. Поэтому соль йодируют.',
  };
  const labels = [
    ...EN_GL.map((g) => ({ text: g.name, pos: g.p.clone().add({ para: V3(0.25, -0.14, 0.1), pin: V3(0.14, 0.16, 0.1), hyp: V3(0.14, -0.06, 0.12) }[g.id] || V3(0.14, 0.04, 0.12)), color: g.color, show: () => st.labels && (st.mode === 'map' ? (!st.sel || st.sel === g.id) : (st.mode === 'sugar' ? g.id === 'panc' : st.mode === 'stress' ? ['hyp', 'adr'].includes(g.id) : ['hyp', 'thy'].includes(g.id))) })),
    { text: 'Печень', pos: V3(-0.8, 1.6, 0.25), color: '#c88a70', show: () => st.labels && st.mode !== 'thy' },
    { text: 'Мышцы', pos: V3(-0.75, -1.0, 0.2), color: '#c86a6a', show: () => st.labels && (st.mode === 'sugar' || (st.mode === 'map' && st.sel)) },
    { text: 'Кость', pos: V3(0.62, -1.0, 0.1), color: '#e8d8bb', show: () => st.labels && st.mode === 'map' && st.sel && GL[st.sel].targets.includes('bone') },
    { text: 'Сердце', pos: BODY.heart.clone().add(V3(0.3, 0.0, 0.2)), color: '#FF8A7A', show: () => st.labels && (st.mode === 'stress' || (st.mode === 'map' && st.sel && st.sel !== 'hrt')) },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { const g = st.sel && GL[st.sel]; ib.info.innerHTML = st.msg || (st.mode === 'map' && g ? g.text + `<br><span style="opacity:.7">Гормоны: ${g.hormones}</span>` : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'map', label: 'Железы' }, { id: 'sugar', label: 'Сахар крови' }, { id: 'stress', label: 'Стресс' }, { id: 'thy', label: 'Щитовидная ось' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...EN_GL.map((g) => ({ id: g.id, label: g.name, color: g.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'map') setMode('map'); select(v); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–4', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 520px' }, h('div', { class: 'glabel' }, 'Железы', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)),
      group('Опыт', 'E · S · I', button('Поесть', () => { if (st.mode !== 'sugar') setMode('sugar'); SIM.meal = st.t; }, true), button('Испуг', () => { if (st.mode !== 'stress') setMode('stress'); SIM.stressT = st.t; }), button('Мало йода', () => { if (st.mode !== 'thy') setMode('thy'); SIM.iodine = 0.25; st.msg = TXT.iod; refs.setInfo(); }), button('Йод в норме', () => { SIM.iodine = 1; st.msg = null; refs.setInfo(); })),
      group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['map', 'sugar', 'stress', 'thy'][n - 1]); return true; }
    if (k === 'e' || k === 'у') { if (st.mode !== 'sugar') setMode('sugar'); SIM.meal = st.t; return true; }
    if (k === 's' || k === 'ы') { if (st.mode !== 'stress') setMode('stress'); SIM.stressT = st.t; return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { const S = SIM; return st.mode === 'sugar' ? [['Глюкоза', S.G.toFixed(1), 'ммоль/л'], ['Инсулин', Math.round(S.I), 'мкЕд/мл']] : st.mode === 'stress' ? [['Пульс', Math.round(S.HR), 'уд/мин'], ['Кортизол', Math.round(S.C * 30), 'нмоль/л']] : st.mode === 'thy' ? [['ТТГ', S.TSH.toFixed(1), 'мЕд/л'], ['T4', (S.T4 * 15).toFixed(0), 'пмоль/л']] : [['Желёз', 8, ''], ['Гормонов', '>50', '']]; }
  const self = {
    labelBg: true, mobZoom: 0.5, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#C77DFF',
    kicker: 'Тело · гормоны', title: 'Эндокринная система',
    lede: 'Крошечные железы управляют ростом, обменом веществ, сном, стрессом и сахаром крови, рассылая по кровотоку химические письма — гормоны.',
    notes: `
      <div><h2>Как действуют гормоны</h2>
        <p>Белковые гормоны (инсулин, АКТГ) не проходят через мембрану и действуют через рецепторы на поверхности клетки и вторичных посредников. Стероидные (кортизол, половые) и тиреоидные проникают в клетку и меняют работу генов — поэтому действуют медленнее, но дольше.</p>
        <h3>Обратная связь</h3><p>Почти все гормональные системы держатся на отрицательной обратной связи: продукт тормозит собственный запуск, как термостат.</p></div>
      <div><h2>Условности</h2><ul><li>Размер желёз увеличен для наглядности.</li><li>Кривые на графике — упрощённые модели, время ускорено.</li><li>Половые железы показаны в положении яичников; яички лежат вне брюшной полости.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим</li><li>клик: железа</li><li><code>E</code> поесть</li><li><code>S</code> испуг</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeEndo };
