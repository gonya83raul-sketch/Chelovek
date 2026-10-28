import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, displaceGeo, ell3, envTex, flowTubeMat, flyStep, flyTarget, glowNucleus, group, infoBox, labLights, makeControls, mergeGeometries, mulberry, organMat, randUnit, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ЦИКЛ ПОЛОВОГО (СЕКСУАЛЬНОГО) ОТВЕТА — физиология
   ========================================================= */
const SR_PH = [
  { id: 'exc', name: 'Excitement', color: '#F2C14E', d: 6, text: '<b>1. Excitement.</b> A signal from the brain (thoughts, images, touch) travels down the spinal cord to the sacral parasympathetic center (S2–S4). Parasympathetic fibers dilate the arteries of the pelvic organs, and blood rushes to them (vasocongestion). Heart rate, blood pressure and breathing begin to rise, and muscle tone increases. Duration: from minutes to hours.' },
  { id: 'pla', name: 'Plateau', color: '#FF8A5C', d: 5, text: '<b>2. Plateau.</b> Arousal reaches a high, stable level. Blood filling of the tissues is at its maximum, heart rate is 100–150 bpm, breathing is rapid, and the skin may redden (the “sex flush”). The pelvic floor muscles are tense.' },
  { id: 'org', name: 'Orgasm', color: '#FF5A7A', d: 2, text: '<b>3. Orgasm</b> is the shortest phase (seconds). Now the <b>sympathetic</b> center (T10–L2) takes the lead: rhythmic contractions of the pelvic floor muscles at intervals of ~0.8 s, and a peak in heart rate (up to 110–180) and blood pressure. The pituitary releases <b>oxytocin</b>, and the brain’s reward system (dopamine) is active.' },
  { id: 'res', name: 'Resolution', color: '#7FD6FF', d: 7, text: '<b>4. Resolution.</b> Blood drains away, and heart rate, blood pressure and breathing return to baseline. <b>Prolactin</b> is released — it contributes to the feeling of satiety and relaxation. Men enter a <b>refractory period</b> (from minutes to hours) during which another response is impossible; women may not have one and can have repeated orgasms.' },
];
function makeSresp() {
  __set_rnd(mulberry(2424));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x08060a); scene.environment = envTex;
  labLights(scene, 0xff8ab0);
  const HOME = matchMedia('(max-width:700px)').matches ? flyTarget(V3(0.75, 2.1, 0), V3(-2.15, 3.15, 10.4)) : flyTarget(V3(0.3, 2.1, 0), V3(-2.6, 3.15, 10.4));   // телефон: тело левее — подписи справа помещаются
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 2; controls.maxDistance = 20;
  bodyShell(scene, { rim: 0.4 });
  // мозг, гипоталамус, гипофиз
  const brain = new THREE.Mesh(ell3(0.34, 0.28, 0.4, V3(0, 4.25, 0)), new THREE.MeshPhysicalMaterial({ color: 0xe0b8c8, roughness: 0.6, transparent: true, opacity: 0.12, depthWrite: false })); scene.add(brain);
  const HYP = V3(0, 4.08, 0.08), LIMB = V3(0, 4.25, 0.0), CTX = V3(0, 4.42, 0.1);
  const gHyp = glowNucleus(scene, HYP, '#C77DFF', 0.045, 7), gLimb = glowNucleus(scene, LIMB, '#FF8AB0', 0.06, 7), gCtx = glowNucleus(scene, CTX, '#9FD0FF', 0.05, 7);
  // спинной мозг и центры
  // спинной мозг взрослого кончается на уровне L1–L2 (конус: сегменты S2–S4), ниже — конский хвост из корешков
  const CORD = new THREE.CatmullRomCurve3([V3(0, 3.9, -0.1), V3(0, 3.3, -0.4), V3(0, 2.2, -0.5), V3(0, 1.45, -0.45), V3(0, 1.05, -0.42)]);
  // толщина: шейное (u≈0.15) и поясничное (u≈0.8) утолщения, к концу — конус
  scene.add(new THREE.Mesh(taperTube(CORD, (u) => (0.045 + 0.02 * Math.exp(-(((u - 0.15) / 0.08) ** 2)) + 0.018 * Math.exp(-(((u - 0.8) / 0.06) ** 2))) * (u < 0.9 ? 1 : 1 - (u - 0.9) * 6), 80, 12), organMat('#F2E6C8', 0.45)));
  scene.add(new THREE.Mesh(mergeGeometries([-2, -1, 0, 1, 2].map((k) => tube([V3(0.006 * k, 1.1, -0.42), V3(0.012 * k, 0.7, -0.41), V3(0.03 * k, 0.25, -0.36)], 0.006, 16, 4))), organMat('#F2E6C8', 0.45)));
  const SYM = V3(0, 1.45, -0.45), PARA = V3(0, 1.1, -0.425);
  const gSym = glowNucleus(scene, SYM, '#FF6A5A', 0.03, 6), gPara = glowNucleus(scene, PARA, '#5CC48A', 0.03, 6);
  // сегменты-центры — светящиеся участки спинного мозга нужной длины (Th10–L2 — над поясничным утолщением, S2–S4 — в мозговом конусе)
  const segM = (col, u0, u1) => { const pts = Array.from({ length: 9 }, (_, k) => CORD.getPointAt(u0 + (u1 - u0) * k / 8)); const m = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }); scene.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3(pts), () => 0.085, 20, 12), m)); return m; };
  // позвоночный столб: тела позвонков спереди от спинного мозга и межпозвонковые промежутки; ниже L2 — крестец, мозг кончается конусом
  { const vg = [], vm = new THREE.MeshPhysicalMaterial({ color: 0xe8dcc0, roughness: 0.6, transparent: true, opacity: 0.22, depthWrite: false });
    for (let k = 0; k < 24; k++) { const y = 3.85 - k * (3.85 - 0.62) / 23, u = Math.min(1, (3.9 - y) / (3.9 - 1.05)), c = y > 1.05 ? CORD.getPointAt(u) : V3(0, y, -0.42 + (1.05 - y) * 0.15); const g = new THREE.CylinderGeometry(0.1 + 0.05 * k / 23, 0.1 + 0.05 * k / 23, 0.09, 14); g.translate(c.x, y, c.z + 0.17); vg.push(g); }
    scene.add(new THREE.Mesh(mergeGeometries(vg), vm)); }
  const sSym = segM('#FF6A5A', 0.72, 0.87), sPara = segM('#5CC48A', 0.91, 0.975);
  const PEL = V3(0, 0.0, 0.08);
  const nSym = new THREE.CatmullRomCurve3([SYM, SYM.clone().add(V3(0.15, -0.3, 0.2)), V3(0.12, 0.35, 0.05), PEL]);
  const nPara = new THREE.CatmullRomCurve3([PARA, V3(0.02, 0.7, -0.41), V3(0.05, 0.28, -0.34), V3(0.1, 0.05, -0.1), PEL]);   // по конскому хвосту, из крестца — тазовые нервы
  const nDesc = new THREE.CatmullRomCurve3([HYP, V3(0, 3.8, -0.05), CORD.getPointAt(0.2), CORD.getPointAt(0.75)]);
  const mkN = (c, col) => { const f = flowTubeMat(col, 0.6, 2); f.uniforms.uOn.value = 0.15; scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.012, 6), f)); return f; };
  const fSym = mkN(nSym, '#FF6A5A'), fPara = mkN(nPara, '#5CC48A'), fDesc = mkN(nDesc, '#C77DFF');
  // органы малого таза (обобщённо) и сосуды
  const pelvis = new THREE.Mesh(ell3(0.25, 0.17, 0.19), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe88a9a).multiplyScalar(0.4), roughness: 0.4, transparent: true, opacity: 0.35, depthWrite: false, emissive: 0xff4a6a, emissiveIntensity: 0.03 })); pelvis.position.copy(PEL); scene.add(pelvis);
  const PEL_C0 = pelvis.material.color.clone(), PEL_C1 = new THREE.Color(0xff3a6a).multiplyScalar(0.6);   // прилив крови: орган набухает и краснеет
  const gPel = glowNucleus(scene, PEL, '#FF5A7A', 0.06, 5);
  const heart = new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(1, 36, 28), (v) => { const k = v.y < 0 ? 1 + 0.55 * v.y : 1; v.set(v.x * 0.27 * k, v.y * 0.34, v.z * 0.24 * k); }), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xc84a50).multiplyScalar(0.5), roughness: 0.4, transparent: true, opacity: 0.7, emissive: 0x501010, emissiveIntensity: 0.3 })); heart.position.copy(BODY.heart).add(V3(0.06, 0, 0)); heart.rotation.z = 0.55; scene.add(heart);   // геометрия в нуле — пульсирует на месте
  const ART = new THREE.CatmullRomCurve3([BODY.heart, V3(0.1, 2.5, -0.2), V3(0.08, 1.4, -0.3), V3(0.15, 0.4, -0.15), PEL]);
  const fArt = mkN(ART, '#E0605A');
  // лёгкие — та же форма, что в теме «Дыхание»: узкая верхушка, плоская медиальная сторона, основание над диафрагмой, сердечная вырезка слева
  const lungs = [1, -1].map((s) => { const r = s < 0 ? V3(0.45, 0.66, 0.44) : V3(0.4, 0.72, 0.42);
    const g = displaceGeo(new THREE.SphereGeometry(1, 64, 48), (v) => { let x = v.x, y = v.y, z = v.z;
      if (y > 0) { const k = 1 - 0.45 * y ** 2.2; x *= k; z *= k; }
      if (y < -0.6) y = -0.6 + (y + 0.6) * 0.35 + 0.18 * (1 - x * x - z * z) * 0.3;
      if (x * s < -0.3) x = s * (-0.3 + (x * s + 0.3) * 0.35);
      if (s > 0 && x < -0.1 && z > 0.1 && y < 0.1 && y > -0.75) x += 0.25 * smooth(0.1, 0.6, z) * smooth(-0.1, -0.5, x);
      v.set(x * r.x, y * r.y, z * r.z); });
    const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe89aa8).multiplyScalar(0.45), roughness: 0.6, sheen: 0.4, transparent: true, opacity: 0.2, depthWrite: false })); m.position.set(0.5 * s, 2.25, -0.04); scene.add(m); return m; });
  const fx = new Sparks(1600, 0.05); scene.add(fx.obj);
  /* ---------- модель цикла ---------- */
  const TOT = SR_PH.reduce((a, p) => a + p.d, 0);
  const st = { t: 0, labels: true, rot: false, fly: null, run: true, ct: 0, pattern: 'm', model: 'mj', msg: null, ph: 0, trace: [] };
  // уровень возбуждения 0..1 по времени цикла для разных кривых
  function level(x, pat) {
    const e = SR_PH[0].d, p = e + SR_PH[1].d, o = p + SR_PH[2].d;
    if (pat === 'b') { // плато без оргазма, медленное разрешение (кривая B по Мастерсу и Джонсон)
      if (x < e) return 0.1 + 0.55 * smooth(0, e, x); if (x < o) return 0.65 + 0.05 * Math.sin(x * 3); return 0.7 * (1 - smooth(o, TOT + 2, x)) + 0.1;
    }
    const base = x < e ? 0.1 + 0.6 * smooth(0, e, x) : x < p ? 0.7 + 0.12 * smooth(e, p, x) : x < o ? 0.82 + 0.18 * Math.sin(((x - p) / SR_PH[2].d) * Math.PI) : 0.82 * (1 - smooth(o, o + 3, x)) + 0.1;
    if (pat === 'f' && x > o) return Math.max(base, 0.78 + 0.18 * Math.max(0, Math.sin(((x - o) / 2) * Math.PI)) * (x - o < 2 ? 1 : 0));   // повторный пик
    return base;
  }
  const phaseAt = (x) => { let a = 0; for (let i = 0; i < SR_PH.length; i++) { a += SR_PH[i].d; if (x < a) return i; } return 3; };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    if (st.run) { st.ct += dt; if (st.ct > TOT + 3) { st.ct = 0; st.trace = []; } }
    const x = Math.min(st.ct, TOT), L = level(x, st.pattern), ph = phaseAt(x);
    if (ph !== st.ph) { st.ph = ph; st.msg = null; refs.setInfo && refs.setInfo(); refs.phSeg && refs.phSeg.sync(); }
    const hr = 70 + 85 * (L - 0.1) / 0.9, rr = 14 + 20 * (L - 0.1) / 0.9; st.hr = hr; st.rr = rr; st.L = L;
    const isOrg = ph === 2 && st.pattern !== 'b';
    // нервы и центры
    fPara.uniforms.uOn.value = 0.15 + 0.85 * (ph <= 1 ? L : 0.2); fSym.uniforms.uOn.value = 0.15 + 0.85 * (isOrg ? 1 : 0.1); fDesc.uniforms.uOn.value = 0.2 + 0.7 * L;
    [fPara, fSym, fDesc, fArt].forEach((f) => { f.uniforms.uTime.value = t; }); fArt.uniforms.uOn.value = 0.2 + 0.8 * L; fArt.uniforms.uSpeed.value = 0.3 + hr / 150;
    gPara.spr.material.opacity = 0.25 + 0.75 * (ph <= 1 ? L : 0.15); gSym.spr.material.opacity = 0.25 + 0.75 * (isOrg ? 1 : 0.1); sPara.opacity = 0.3 + 0.6 * (ph <= 1 ? L : 0.15); sSym.opacity = 0.3 + 0.6 * (isOrg ? 1 : 0.1);
    gLimb.spr.material.opacity = 0.3 + 0.7 * L; gCtx.spr.material.opacity = 0.3 + 0.4 * (ph === 0 ? 1 : 0.5); gHyp.spr.material.opacity = 0.3 + 0.7 * (isOrg || ph === 3 ? 1 : 0.3);
    gPel.spr.material.opacity = 0.2 + 0.8 * L; gPel.spr.scale.setScalar(0.08 * (5 + 6 * L) * (isOrg ? 1 + 0.15 * Math.max(0, Math.sin(t * Math.PI * 2 / 0.8)) : 1)); pelvis.material.emissiveIntensity = 0.05 + 0.5 * L; pelvis.scale.setScalar(1 + 0.25 * L); pelvis.material.color.copy(PEL_C0).lerp(PEL_C1, L);
    heart.scale.setScalar(1 + 0.06 * Math.max(0, Math.sin(t * Math.PI * 2 * hr / 60)) ** 6); lungs.forEach((m) => m.scale.setScalar(1 + 0.04 * Math.sin(t * Math.PI * 2 * rr / 60)));
    if (ph === 3 && x < TOT && rnd() < 0.3) fx.spawn(HYP.clone(), randUnit().multiplyScalar(0.3), new THREE.Color(0xf2c14e), 1.2, 0.5, 1.2);   // пролактин
    if (isOrg && rnd() < 0.5) fx.spawn(HYP.clone(), randUnit().multiplyScalar(0.3), new THREE.Color(0xff8ab0), 1.2, 0.5, 1.2);              // окситоцин
    if (rnd() < L * 0.6) fx.spawn(ART.getPointAt(rnd()), V3(0, 0, 0), new THREE.Color(0xe0605a), 0.4, 0, 1.2);
    st.trace.push([x, L]);
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); scopeShow(true);
    const X = (x) => 8 + (x / (TOT + 3)) * (w - 16), Y = (v) => hgt - 10 - v * (hgt - 26);
    if (st.model === 'basson') { const cx = w / 2, cy = hgt / 2 + 6, r = Math.min(w, hgt) * 0.34; const names = ['intimacy', 'stimuli', 'arousal', 'desire', 'satisfaction']; ctx.strokeStyle = 'rgba(255,138,176,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.font = '500 9px JetBrains Mono, monospace'; names.forEach((n, i) => { const a = -Math.PI / 2 + i / names.length * Math.PI * 2; ctx.fillStyle = '#ffd0e0'; ctx.fillText(n, cx + Math.cos(a) * r - n.length * 2.6, cy + Math.sin(a) * r + 3); }); const a = -Math.PI / 2 + (st.ct / (TOT + 3)) * Math.PI * 2; ctx.fillStyle = '#ff8ab0'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2); ctx.fill(); return; }
    let a = 0; SR_PH.forEach((p) => { ctx.fillStyle = p.color + '22'; ctx.fillRect(X(a), 14, X(a + p.d) - X(a), hgt - 24); a += p.d; });
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= TOT + 3; x += 0.1) { const y = Y(level(Math.min(x, TOT), st.pattern)); x ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); } ctx.stroke();
    ctx.strokeStyle = '#FF8AB0'; ctx.lineWidth = 2.2; ctx.beginPath(); st.trace.forEach(([x, v], i) => (i ? ctx.lineTo(X(x), Y(v)) : ctx.moveTo(X(x), Y(v)))); ctx.stroke();
    ctx.fillStyle = '#ffd0e0'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('arousal level', 10, 12);
  }
  const TXT_MJ = '<b>The sexual response cycle</b> is the sequence of physiological changes described by William Masters and Virginia Johnson (1966): excitement → plateau → orgasm → resolution. It is controlled by the brain (cortex, limbic system, hypothalamus) and the autonomic nervous system: the <b>parasympathetic</b> division (green, sacral) is responsible for blood inflow, and the <b>sympathetic</b> division (red, thoracolumbar) for orgasm.';
  const TXT_B = '<b>Rosemary Basson’s circular model</b> (2000). For many people, especially in long-term relationships, desire does not always come first: a person may start from a willingness to be intimate, and desire appears only in response to stimuli and arousal. Satisfaction (emotional and physical) sustains the motivation for the next cycle. The model complements Masters and Johnson’s linear scheme.';
  const labels = [
    { text: 'cortex and limbic system', pos: V3(0.35, 4.42, 0.1), color: '#FF8AB0', show: () => st.labels },
    { text: 'hypothalamus and pituitary', pos: V3(0.3, 4.0, 0.15), color: '#C77DFF', show: () => st.labels },
    { text: 'sympathetic center T10–L2', pos: SYM.clone().add(V3(0.45, 0.05, 0)), color: '#FF6A5A', show: () => st.labels },
    { text: 'parasympathetic center S2–S4', pos: PARA.clone().add(V3(0.5, -0.08, 0)), color: '#5CC48A', show: () => st.labels },
    { text: 'pelvic organs', pos: PEL.clone().add(V3(0.35, -0.05, 0.1)), color: '#FF5A7A', show: () => st.labels },
    { text: 'heart', pos: BODY.heart.clone().add(V3(0.3, 0, 0.2)), color: '#FF8A7A', show: () => st.labels },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 380px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.model === 'basson' ? TXT_B : (st.run || st.ct > 0 ? SR_PH[st.ph].text : TXT_MJ)); };
    refs.phSeg = seg(SR_PH.map((p) => ({ id: p.id, label: p.name, color: p.color })), () => SR_PH[st.ph].id, (v) => { const i = SR_PH.findIndex((p) => p.id === v); st.ct = SR_PH.slice(0, i).reduce((a, p) => a + p.d, 0) + 0.01; st.trace = []; st.ph = i; st.msg = null; refs.setInfo(); });
    refs.patSeg = seg([{ id: 'm', label: 'Curve A' }, { id: 'f', label: 'With a repeated peak' }, { id: 'b', label: 'Without orgasm' }], () => st.pattern, (v) => { st.pattern = v; st.ct = 0; st.trace = []; });
    refs.modSeg = seg([{ id: 'mj', label: 'Masters and Johnson' }, { id: 'basson', label: 'Basson' }], () => st.model, (v) => { st.model = v; st.msg = null; refs.setInfo(); });
    const play = toggle('Play', () => st.run, (v) => { st.run = v; });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { play, lab });
    el.append(group('Phase', '1–4', refs.phSeg, play), group('Variant', '', refs.patSeg), group('Model', '', refs.modSeg), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { refs.phSeg.querySelectorAll('button')[n - 1].click(); return true; }
    if (k === ' ') { refs.play.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Pulse', Math.round(st.hr || 70), 'bpm'], ['Breathing', Math.round(st.rr || 14), '/min'], ['Phase', SR_PH[st.ph].name, '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8AB0',
    kicker: 'Body · physiology', title: 'Sexual response cycle',
    lede: 'How the brain, the autonomic nervous system, blood vessels and hormones work together to carry the body through the four phases of the sexual response — from excitement to resolution.',
    notes: `
      <div><h2>Nerves and hormones</h2><ul>
        <li><b>Brain:</b> the cortex (thoughts, images), the limbic system and the hypothalamus initiate and regulate the response; dopamine is linked to desire and reward.</li>
        <li><b>Parasympathetic system</b> (pelvic nerves from S2–S4): vasodilation and blood inflow.</li>
        <li><b>Sympathetic system</b> (T10–L2): smooth muscle contractions and orgasm.</li>
        <li><b>Oxytocin</b>: muscle contractions and a feeling of closeness; <b>prolactin</b>: relaxation and refractoriness; <b>testosterone</b> and <b>estrogens</b> support libido in both sexes.</li></ul>
        <h3>Important</h3><p>The duration of the phases and the shape of the curve vary greatly between people and situations — the “norms” here are broad. Persistent difficulties with desire, arousal or orgasm are a reason to see a doctor (a urologist, gynecologist or sexologist): the cause is often hormones, blood vessels, medications or stress.</p></div>
      <div><h2>Simplifications</h2><ul><li>The curves are averaged diagrams from physiology textbooks.</li><li>The pelvic organs are shown generically as a glowing area.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>4</code> phase</li><li><code>Space</code> pause</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeSresp };
