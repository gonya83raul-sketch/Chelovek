import { Sparks, THREE, V3, __set_rnd, button, clamp, displaceGeo, envTex, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, labLights, lerp, makeControls, mergeGeometries, mulberry, rand, randUnit, rnd, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 3 · ПРОМЕЖУТОЧНЫЙ МОЗГ: ТАЛАМУС, ГИПОТАЛАМУС, ГИПОФИЗ, ЭПИФИЗ
   ========================================================= */
const THAL_CH = [
  { id: 'vision', name: 'Зрение', color: '#5CC48A', nuc: 'латеральное коленчатое тело', cortex: 'зрительная кора (поле 17)' },
  { id: 'hearing', name: 'Слух', color: '#3FC1B0', nuc: 'медиальное коленчатое тело', cortex: 'слуховая кора (поля 41, 42)' },
  { id: 'touch', name: 'Касание и боль', color: '#5E8FEF', nuc: 'вентробазальный комплекс', cortex: 'постцентральная извилина (поля 1–3)' },
  { id: 'motor', name: 'Движение', color: '#FF8A5A', nuc: 'вентролатеральные ядра', cortex: 'моторная и премоторная кора' },
  { id: 'limbic', name: 'Память и эмоции', color: '#E58FC4', nuc: 'передние ядра', cortex: 'поясная извилина' },
];
const HYPO_DEMOS = [
  { id: 'thirst', name: 'Жажда', color: '#6FC3FF' },
  { id: 'stress', name: 'Стресс', color: '#FFB070' },
  { id: 'night', name: 'Ночь', color: '#B48CFF' },
  { id: 'baby', name: 'Кормление', color: '#FF8FB8' },
];
function makeDien() {
  __set_rnd(mulberry(606));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0xb9a4ff);
  const VIEW = { thal: flyTarget(V3(-0.1, -0.2, 0), V3(6.6, 4.2, 9.4)), hypo: flyTarget(V3(0.35, -2.15, 0), V3(4.6, -0.9, 6.2)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(VIEW.thal.pos);
  const controls = makeControls(camera, VIEW.thal.target); controls.minDistance = 2; controls.maxDistance = 25;
  const mat = (c, o = {}) => tissue(new THREE.Color(c).multiplyScalar(0.4), o);

  /* ---------- таламусы ---------- */
  const thal = new THREE.Group(); scene.add(thal);
  const thalGeo = (s) => displaceGeo(new THREE.SphereGeometry(1, 64, 44), (v) => {
    const back = smooth(0, -1, v.x); v.set(v.x * 1.05, v.y * (0.62 + 0.12 * back), v.z * (0.52 + 0.12 * back)); v.x += 0.06 * Math.exp(-(((v.y - 0.3) / 0.25) ** 2)) * smooth(0.6, 1, v.x / 1.05); v.z += 0.62 * s;
  });
  [1, -1].forEach((s) => { const g = thalGeo(s); thal.add(new THREE.Mesh(g, mat(0xb9a4ff, { transparent: true, opacity: 0.2, depthWrite: false })), new THREE.Mesh(g, glassMat(0xc9b6ff, { rim: 0.35, base: 0.008, pow: 2 }))); });
  { const ad = new THREE.CylinderGeometry(0.14, 0.14, 0.5, 20); ad.rotateX(Math.PI / 2); ad.translate(0.1, 0.02, 0); thal.add(new THREE.Mesh(ad, mat(0xe8e0f0))); }
  // ретикулярное ядро — «скорлупа» снаружи
  const retShell = [1, -1].map((s) => { const g = thalGeo(s); g.scale(1.06, 1.08, 1.0); g.translate(0, 0, 0.1 * s); const m = new THREE.Mesh(g, glassMat(0x8fb4ff, { rim: 0.2, base: 0.003, pow: 1.6 })); thal.add(m); return m; });
  // ядра
  const TN = {
    limbic: [V3(0.82, 0.28, 0.55), V3(0.82, 0.28, -0.55)], motor: [V3(0.3, -0.05, 0.85), V3(0.3, -0.05, -0.85)], touch: [V3(-0.3, -0.12, 0.8), V3(-0.3, -0.12, -0.8)],
    vision: [V3(-0.78, -0.42, 0.88), V3(-0.78, -0.42, -0.88)], hearing: [V3(-0.62, -0.5, 0.58), V3(-0.62, -0.5, -0.58)],
  };
  const nucG = {};
  THAL_CH.forEach((c) => { nucG[c.id] = TN[c.id].map((p) => glowNucleus(thal, p, c.color, 0.08, 5)); });
  const assoc = [V3(0.1, 0.15, 0.35), V3(0.1, 0.15, -0.35), V3(-0.98, 0.05, 0.62), V3(-0.98, 0.05, -0.62)].map((p, i) => glowNucleus(thal, p, i < 2 ? '#C77DFF' : '#B8E06A', 0.1, 6));
  // III желудочек
  const csfM = new THREE.MeshPhysicalMaterial({ color: 0x2f7fc0, transparent: true, opacity: 0.45, emissive: 0x06204a, emissiveIntensity: 0.6, depthWrite: false, side: THREE.DoubleSide });
  { const sh = new THREE.Shape(); sh.moveTo(0.95, 0.35); sh.bezierCurveTo(0.3, 0.55, -0.6, 0.5, -0.9, 0.25); sh.bezierCurveTo(-0.85, -0.3, -0.5, -0.9, -0.2, -1.2); sh.bezierCurveTo(0.2, -1.45, 0.55, -1.55, 0.45, -1.7); sh.bezierCurveTo(0.8, -1.4, 1.0, -0.6, 0.95, 0.35);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: false, curveSegments: 24 }); g.translate(0, 0, -0.04); scene.add(new THREE.Mesh(g, csfM)); }
  // кора — купол сверху
  const dome = new THREE.Group(); scene.add(dome);
  const domeG = new THREE.SphereGeometry(3.1, 72, 36, 0, Math.PI * 2, 0, Math.PI * 0.42); domeG.scale(1.25, 0.8, 1.05); domeG.translate(-0.1, 0.0, 0);
  dome.add(new THREE.Mesh(domeG, glassMat(0xf2c7d6, { rim: 0.25, base: 0.006, pow: 2.4 })));
  const CX = { vision: V3(-3.1, 1.5, 0.9), hearing: V3(-0.6, 1.7, 2.6), touch: V3(-0.6, 2.42, 1.0), motor: V3(0.6, 2.4, 1.0), limbic: V3(0.6, 2.1, 0.3) };
  Object.entries(CX).forEach(([id, p]) => { const c = THAL_CH.find((q) => q.id === id); const g = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(c.color).multiplyScalar(0.6), transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false })); g.position.copy(p); g.lookAt(V3(0, -0.5, 0)); dome.add(g); });

  /* ---------- входы и выходы таламуса ---------- */
  const flows = { in: {}, out: {} };
  const flowTube = (pts, color, r, arr) => { const f = flowTubeMat(color, 0.5, 2.0); arr.push(f); thal.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, r, 6), f)); return f; };
  const IN = {
    vision: [V3(2.2, -1.4, 0.3), V3(1.2, -1.1, 0.75), V3(0.0, -0.75, 1.0), TN.vision[0]],
    hearing: [V3(-1.0, -2.8, 0.55), V3(-0.85, -1.6, 0.6), TN.hearing[0]],
    touch: [V3(-0.6, -3.0, 0.25), V3(-0.4, -1.4, 0.5), TN.touch[0]],
    motor: [V3(-1.2, -2.6, -0.3), V3(-0.4, -1.3, 0.4), TN.motor[0]],
    limbic: [V3(-0.35, -1.3, 0.12), V3(0.3, -0.6, 0.35), TN.limbic[0]],
  };
  THAL_CH.forEach((c) => {
    flows.in[c.id] = []; flows.out[c.id] = [];
    [1, -1].forEach((s) => {
      const m = (p) => V3(p.x, p.y, p.z * s);
      flowTube(IN[c.id].map(m), c.color, 0.035, flows.in[c.id]);
      const a = m(TN[c.id][0]), b = m(CX[c.id]); flowTube([a, a.clone().lerp(b, 0.4).add(V3(0, 0.5, 0.2 * s)), b], c.color, 0.04, flows.out[c.id]);
    });
  });
  const alertFx = new Sparks(400, 0.2); scene.add(alertFx.obj);

  /* ---------- гипоталамус, гипофиз, эпифиз ---------- */
  const hypo = new THREE.Group(); scene.add(hypo);
  { const g = displaceGeo(new THREE.SphereGeometry(1, 48, 32), (v) => { v.set(v.x * 0.75, v.y * 0.38, v.z * 0.42); v.add(V3(0.25, -1.1, 0)); }); hypo.add(new THREE.Mesh(g, mat(0xf0b8a0, { transparent: true, opacity: 0.22, depthWrite: false })), new THREE.Mesh(g, glassMat(0xffc8a8, { rim: 0.55, base: 0.01, pow: 2 }))); }
  const HN = {
    scn: { p: [V3(0.82, -1.28, 0.06), V3(0.82, -1.28, -0.06)], c: '#B48CFF', name: 'супрахиазменные ядра' },
    son: { p: [V3(0.62, -1.3, 0.24), V3(0.62, -1.3, -0.24)], c: '#6FC3FF', name: 'супраоптические ядра' },
    pvn: { p: [V3(0.45, -0.85, 0.1), V3(0.45, -0.85, -0.1)], c: '#FFB070', name: 'паравентрикулярные ядра' },
    vmh: { p: [V3(0.1, -1.1, 0.18), V3(0.1, -1.1, -0.18)], c: '#F4C542', name: 'вентромедиальные ядра (насыщение)' },
    lat: { p: [V3(0.2, -0.95, 0.38), V3(0.2, -0.95, -0.38)], c: '#E9785F', name: 'латеральный гипоталамус (голод)' },
    mam: { p: [V3(-0.4, -1.38, 0.1), V3(-0.4, -1.38, -0.1)], c: '#E58FC4', name: 'сосцевидные тела' },
  };
  const hnG = {}; Object.entries(HN).forEach(([id, n]) => { hnG[id] = n.p.map((p) => glowNucleus(hypo, p, n.c, 0.07, 7)); });
  // хиазма и зрительные нервы
  { const om = mat(0xe8e0d0); const a = []; [1, -1].forEach((s) => a.push(taperTube(new THREE.CatmullRomCurve3([V3(1.0, -1.42, 0.03 * s), V3(1.6, -1.4, 0.35 * s), V3(2.2, -1.35, 0.55 * s)]), () => 0.05, 20, 8))); const x = new THREE.BoxGeometry(0.2, 0.06, 0.28); x.translate(1.0, -1.42, 0); a.push(x.toNonIndexed()); hypo.add(new THREE.Mesh(mergeGeometries(a.map((g) => g.index ? g.toNonIndexed() : g)), om)); }
  // гипофиз
  const ME = V3(0.3, -1.45, 0), ANT = V3(0.62, -2.3, 0), POST = V3(0.18, -2.28, 0);
  hypo.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([ME, V3(0.35, -1.8, 0), V3(0.38, -2.05, 0)]), () => 0.08, 20, 12), mat(0xf0c0a8)));
  const antM = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 24).scale(1, 0.85, 1.1), mat(0xffa070, { emissive: 0x3a1400 })); antM.position.copy(ANT); hypo.add(antM);
  const postM = new THREE.Mesh(new THREE.SphereGeometry(0.23, 32, 24).scale(1, 0.9, 1), mat(0xc0a0f0, { emissive: 0x1a1030 })); postM.position.copy(POST); hypo.add(postM);
  // аксоны к задней доле, портальные сосуды к передней
  const AX = {}, PORT = [];
  ['son', 'pvn'].forEach((id) => { AX[id] = HN[id].p.map((p) => new THREE.CatmullRomCurve3([p, ME.clone().add(V3(-0.02, 0, p.z * 0.3)), V3(0.3, -1.85, p.z * 0.15), POST.clone().add(V3(0, 0.08, p.z * 0.2))])); AX[id].forEach((c) => hypo.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.012, 5), mat(HN[id].c, { emissive: new THREE.Color(HN[id].c), emissiveIntensity: 0.25 })))); });
  [-0.06, 0.06].forEach((z) => { const c = new THREE.CatmullRomCurve3([ME.clone().add(V3(0.04, 0, z)), V3(0.48, -1.8, z), ANT.clone().add(V3(-0.05, 0.2, z))]); PORT.push(c); hypo.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.02, 6), mat(0xc83040, { emissive: 0x3a0408 }))); });
  const blood = new THREE.CatmullRomCurve3([V3(0.4, -2.65, 0.6), V3(0.4, -2.5, 0.2), V3(0.4, -2.55, -0.2), V3(0.6, -3.0, -0.8), V3(1.2, -3.6, -1.4)]);
  hypo.add(new THREE.Mesh(new THREE.TubeGeometry(blood, 50, 0.05, 8), mat(0xb02a30, { emissive: 0x2a0406 })));
  // эпифиз и поводки
  const pineal = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 20).rotateZ(Math.PI / 2 + 0.3), mat(0xd8c090, { emissive: 0x1a1000 })); pineal.position.set(-1.25, 0.35, 0); scene.add(pineal);
  const hyFx = new Sparks(1400, 0.14); scene.add(hyFx.obj);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'thal', att: 'none', alertT: -9, demo: null, demoT: -9, light: 1, labels: true, rot: false, fly: null, msg: null, hormone: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.fly = VIEW[m]; st.msg = null; refs.setInfo && refs.setInfo(); dome.visible = m === 'thal'; }
  function attend(id) { st.att = id; if (st.mode !== 'thal') setMode('thal'); refs.attSeg && refs.attSeg.sync(); st.msg = null; refs.setInfo(); }
  function alertMove() { if (st.mode !== 'thal') setMode('thal'); st.alertT = st.t; st.msg = '<b>Непроизвольное внимание.</b> На краю поля зрения что-то двинулось. Четверохолмие сообщает об этом таламусу, и тот открывает «зелёный коридор» зрительному потоку в кору — внимание переключается само, даже если мы были заняты другим.'; refs.setInfo(); }
  function demo(id) { if (st.mode !== 'hypo') setMode('hypo'); st.demo = id; st.demoT = st.t; st.msg = DEMO_TXT[id]; refs.setInfo(); }
  const C = Object.fromEntries(HYPO_DEMOS.map((d) => [d.id, new THREE.Color(d.color)]));
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.4;
    flyStep(st, camera, controls, dt);
    // внимание: открытый канал ярче, остальные приглушены
    const alert = t - st.alertT < 6;
    THAL_CH.forEach((c) => {
      const open = st.att === 'none' ? 0.55 : st.att === c.id ? 1.3 : 0.12;
      const g = st.mode === 'hypo' ? 0.0 : alert && c.id === 'vision' ? 1.5 : alert ? 0.1 : open;
      [...flows.in[c.id], ...flows.out[c.id]].forEach((f, i) => { f.uniforms.uTime.value = t; f.uniforms.uOn.value = lerp(f.uniforms.uOn.value, i < 2 && st.mode !== 'hypo' ? Math.max(0.35, g) : g, 1 - Math.exp(-dt * 4)); });
      nucG[c.id].forEach((n) => { n.spr.material.opacity = lerp(n.spr.material.opacity, Math.max(0.12, Math.min(1, g)), 1 - Math.exp(-dt * 4)); });
    });
    retShell.forEach((m) => { m.material.uniforms.uFlash.value = st.att !== 'none' || alert ? 0.25 + 0.1 * Math.sin(t * 4) : 0; });
    if (alert && t - st.alertT < 1.2) alertFx.spawn(V3(-1.5 + rand(-0.2, 0.2), -0.2, 0.9 + rand(-0.2, 0.2)), V3(1.0, 0, 0).add(randUnit().multiplyScalar(0.3)), C.thirst, 0.7, 0, 2);
    alertFx.update(dt);
    // гипоталамус: демонстрации
    const k = t - st.demoT;
    Object.values(hnG).flat().forEach((n) => { n.spr.material.opacity = lerp(n.spr.material.opacity, 0.5, 1 - Math.exp(-dt * 3)); });
    if (st.demo && k < 9) {
      const col = C[st.demo];
      const fire = (id) => hnG[id].forEach((n) => { n.spr.material.opacity = 1; });
      if (st.demo === 'thirst' || st.demo === 'baby') {
        const id = st.demo === 'thirst' ? 'son' : 'pvn'; fire(id);
        if (k < 3) AX[id].forEach((c) => { if (rnd() < dt * 20) hyFx.spawn(c.getPointAt(clamp(k / 2.5, 0, 1)), randUnit().multiplyScalar(0.05), col, 0.5, 1, 2); });
        if (k > 2.4 && k < 7) for (let j = 0; j < 2; j++) hyFx.spawn(POST.clone().add(randUnit().multiplyScalar(0.15)), V3(0.15, -0.5, 0).add(randUnit().multiplyScalar(0.3)), col, 2.5, 0.3, 1.6);
        postM.material.emissive.copy(col).multiplyScalar(k > 2.4 && k < 7 ? 0.4 : 0);
      } else if (st.demo === 'stress') {
        fire('pvn');
        if (k < 2) PORT.forEach((c) => { if (rnd() < dt * 20) hyFx.spawn(c.getPointAt(clamp(k / 2, 0, 1)), V3(0, 0, 0), col, 0.5, 0, 2); });
        if (k > 2 && k < 7.5) { antM.material.emissive.copy(col).multiplyScalar(0.5); for (let j = 0; j < 2; j++) { const u = clamp((k - 2) / 5 + rand(-0.1, 0.1), 0, 1); hyFx.spawn(blood.getPointAt(u).add(randUnit().multiplyScalar(0.05)), V3(0, 0, 0), col, 0.7, 0, 1.6); } } else antM.material.emissive.setHex(0x3a1400);
      } else if (st.demo === 'night') {
        st.light = lerp(st.light, 0.15, 1 - Math.exp(-dt * 1.5)); fire('scn');
        if (k > 1.5 && k < 3.5) { const p = HN.scn.p[0].clone().lerp(pineal.position, (k - 1.5) / 2); hyFx.spawn(p, V3(0, 0, 0), col, 0.5, 0, 2); }
        if (k > 3.5) { pineal.material.emissive.copy(col).multiplyScalar(0.5); for (let j = 0; j < 2; j++) hyFx.spawn(pineal.position.clone().add(randUnit().multiplyScalar(0.1)), randUnit().multiplyScalar(0.5), col, 2.5, 0.4, 1.6); }
      }
    } else { postM.material.emissive.setHex(0x1a1030); pineal.material.emissive.setHex(0x1a1000); st.light = lerp(st.light, 1, 1 - Math.exp(-dt)); }
    scene.background.setRGB(0.024 * st.light, 0.02 * st.light, 0.035 * st.light);
    hyFx.update(dt);
  }
  const DEMO_TXT = {
    thirst: '<b>Жажда.</b> Нейроны <b>супраоптических</b> ядер чувствуют, что кровь стала слишком концентрированной. Их аксоны идут по ножке прямо в <b>заднюю долю гипофиза</b> и выбрасывают в кровь <b>вазопрессин</b>. Почки начинают возвращать воду, а человек ищет, что попить.',
    stress: '<b>Стресс.</b> Паравентрикулярные ядра выделяют кортиколиберин в <b>воротные сосуды</b>. Они несут его к <b>передней доле</b> гипофиза, и та выбрасывает в кровь АКТГ. АКТГ доходит до надпочечников, они выделяют кортизол. Решение «бежать или драться» принимает миндалина, а исполняют задние зоны гипоталамуса.',
    night: '<b>Биологические часы.</b> <b>Супрахиазменные ядра</b> лежат прямо над перекрёстом зрительных нервов и узнают от сетчатки общий уровень освещённости. Когда темнеет, они дают сигнал <b>эпифизу</b>, и тот выделяет <b>мелатонин</b> — гормон, успокаивающий многие системы организма. Так держится суточный ритм.',
    baby: '<b>Окситоцин.</b> Паравентрикулярные ядра синтезируют окситоцин и по своим аксонам отправляют в заднюю долю гипофиза. Он запускает сокращения матки при родах, выделение молока и участвует в привязанности и заботе — центры родительского поведения лежат в передних зонах гипоталамуса.',
  };
  const TXT = {
    thal: '<b>Таламус</b> — информационный фильтр на входе в кору. Через него идут зрение (латеральное коленчатое тело), слух (медиальное), кожная и мышечная чувствительность (вентробазальный комплекс), двигательные программы от мозжечка и базальных ганглиев, сигналы памяти и эмоций. Обоняние — единственное исключение. Выберите, на что обратить внимание: таламус откроет «зелёный коридор» одному потоку и приглушит остальные. Тормозная «скорлупа» — ретикулярное ядро.',
    hypo: '<b>Гипоталамус</b> — нижняя часть промежуточного мозга, более 30 пар ядер. Здесь центры голода и жажды, полового и родительского поведения, страха и агрессии, сна и биологических часов. Вместе с <b>гипофизом</b> он управляет всеми эндокринными железами: задняя доля выпускает гормоны, сделанные в нейронах гипоталамуса, передняя слушается его либеринов и статинов. Попробуйте опыты.',
  };
  const labels = [
    ...THAL_CH.map((c) => ({ text: c.nuc, pos: TN[c.id][0].clone().add(V3(0.05, 0.16, 0.2)), color: c.color, show: () => st.labels && st.mode === 'thal' && (st.att === 'none' || st.att === c.id) })),
    ...THAL_CH.map((c) => ({ text: c.cortex, pos: CX[c.id].clone().add(V3(0, 0.25, 0)), color: c.color, show: () => st.labels && st.mode === 'thal' && st.att === c.id })),
    { text: 'подушка', pos: V3(-1.15, 0.25, 0.7), color: '#B8E06A', show: () => st.labels && st.mode === 'thal' && st.att === 'none' },
    { text: 'медиальные ядра', pos: V3(0.1, 0.35, 0.3), color: '#C77DFF', show: () => st.labels && st.mode === 'thal' && st.att === 'none' },
    { text: 'ретикулярное ядро', pos: V3(0.3, 0.6, 1.15), color: '#8fb4ff', show: () => st.labels && st.mode === 'thal' && st.att !== 'none' },
    { text: 'III желудочек', pos: V3(-0.4, -0.5, 0.05), color: '#8fd4ff', show: () => st.labels },
    { text: 'кора', pos: V3(-1.5, 2.3, -1.6), color: '#f2c7d6', show: () => st.labels && st.mode === 'thal' },
    { text: 'эпифиз', pos: pineal.position.clone().add(V3(-0.1, 0.2, 0)), color: '#d8c090', show: () => st.labels },
    ...Object.entries(HN).map(([id, n]) => ({ text: n.name, pos: n.p[0].clone().add(V3(0.04, 0.08, 0.12)), color: n.c, show: () => st.labels && st.mode === 'hypo' })),
    { text: 'передняя доля гипофиза', pos: ANT.clone().add(V3(0.2, -0.1, 0.25)), color: '#ffa070', show: () => st.labels && st.mode === 'hypo' },
    { text: 'задняя доля', pos: POST.clone().add(V3(-0.2, -0.15, 0.2)), color: '#c0a0f0', show: () => st.labels && st.mode === 'hypo' },
    { text: 'воротные сосуды', pos: V3(0.55, -1.8, 0.1), color: '#ff7080', show: () => st.labels && st.mode === 'hypo' },
    { text: 'зрительный перекрёст', pos: V3(1.1, -1.55, 0.1), color: '#e8e0d0', show: () => st.labels && st.mode === 'hypo' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 320px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'thal', label: 'Таламус' }, { id: 'hypo', label: 'Гипоталамус и гипофиз' }], () => st.mode, (v) => setMode(v));
    refs.attSeg = seg([{ id: 'none', label: 'Всё подряд' }, ...THAL_CH.map((c) => ({ id: c.id, label: c.name, color: c.color }))], () => st.att, (v) => attend(v));
    const rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { rot, lab });
    el.append(group('Отдел', '1 · 2', refs.modeSeg),
      h('div', { class: 'grp', style: 'flex:1 1 420px' }, h('div', { class: 'glabel' }, 'Внимание таламуса'), h('div', { class: 'gctl' }, refs.attSeg, button('Движение сбоку', alertMove))),
      group('Гипоталамус', 'T · S · M · O', ...HYPO_DEMOS.map((d, i) => button(d.name, () => demo(d.id), i === 0))),
      group('Вид', 'R · N', rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === '1') { setMode('thal'); return true; } if (k === '2') { setMode('hypo'); return true; }
    if (k === 't' || k === 'е') { demo('thirst'); return true; } if (k === 's' || k === 'ы') { demo('stress'); return true; } if (k === 'm' || k === 'ь') { demo('night'); return true; } if (k === 'o' || k === 'щ') { demo('baby'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'thal' ? [['Ядер таламуса', '≈40', ''], ['Длина', '≈4', 'см']] : [['Ядер', '>30', 'пар'], ['Гипофиз', '≈0,5', 'г']]; }
  setMode('thal');
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#B9A4FF',
    kicker: 'Мозг · промежуточный мозг', title: 'Таламус и гипоталамус',
    lede: 'Таламус решает, какая информация попадёт в кору. Гипоталамус следит за потребностями тела и через гипофиз управляет гормонами.',
    notes: `
      <div><h2>Промежуточный мозг</h2>
        <p>Развивается из переднего мозгового пузыря: нижняя стенка даёт <b>гипоталамус</b> (самая древняя часть), боковые — <b>таламус</b>, верхняя — эпиталамус с <b>эпифизом</b>, задняя — метаталамус (коленчатые тела). Все эти структуры выросли из дорзальной пластинки нервной трубки, поэтому в них нет мотонейронов — только переключательные нейроны и интернейроны.</p>
        <h3>Таламус</h3>
        <p>Нейроанатомы выделяют около 40 ядер, нейрохирурги — до 80. <b>Специфические</b> ядра передают в кору сенсорные и двигательные сигналы с точной картой тела, сетчатки или улитки. <b>Неспецифические</b> задают общий тонус коры и работают в системе сна и бодрствования. <b>Ассоциативные</b> (подушка, дорзальные ядра) связаны с лобной и теменной корой и помогают опознавать сложные образы. При хронической боли нейрохирурги точечно разрушают некоторые сети таламуса.</p>
        <h3>Гипоталамус</h3>
        <p>Передние ядра — эффекты парасимпатики (замедление сердца, сужение зрачка), задние — симпатики (расширение зрачка, рост давления). Медиальные зоны — пищевая и питьевая мотивация, передние — половое и родительское поведение, задние — страх и агрессия. Супрахиазменные ядра — биологические часы.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Расположение основных ядер таламуса и их связь с зонами коры.</li><li>Ретикулярное ядро как тормозная оболочка таламуса.</li><li>Задняя доля гипофиза получает аксоны супраоптических и паравентрикулярных ядер, передняя — либерины через воротные сосуды.</li><li>Путь «супрахиазменные ядра → эпифиз → мелатонин».</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Кора показана куполом, таламус и гипоталамус увеличены.</li><li>Гормоны нарисованы светящимися частицами, время сжато.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code> таламус, <code>2</code> гипоталамус</li><li><code>T</code> жажда, <code>S</code> стресс, <code>M</code> ночь, <code>O</code> окситоцин</li><li><code>R</code> вращение</li><li><code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeDien };
