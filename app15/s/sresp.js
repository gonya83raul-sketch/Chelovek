import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, ell3, envTex, flowTubeMat, flyStep, flyTarget, glowNucleus, group, infoBox, labLights, makeControls, mergeGeometries, mulberry, organMat, randUnit, rnd, scopeShow, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ЦИКЛ ПОЛОВОГО (СЕКСУАЛЬНОГО) ОТВЕТА — физиология
   ========================================================= */
const SR_PH = [
  { id: 'exc', name: 'Возбуждение', color: '#F2C14E', d: 6, text: '<b>1. Возбуждение.</b> Сигнал из мозга (мысли, образы, прикосновения) идёт по спинному мозгу к крестцовому парасимпатическому центру (S2–S4). Парасимпатические волокна расширяют артерии органов малого таза — к ним приливает кровь (вазоконгестия). Пульс, давление и дыхание начинают расти, повышается мышечный тонус. Длительность — от минут до часов.' },
  { id: 'pla', name: 'Плато', color: '#FF8A5C', d: 5, text: '<b>2. Плато.</b> Возбуждение достигает высокого устойчивого уровня. Кровенаполнение тканей максимальное, пульс 100–150 уд/мин, дыхание учащено, кожа может краснеть («сексуальный румянец»). Мышцы тазового дна напряжены.' },
  { id: 'org', name: 'Оргазм', color: '#FF5A7A', d: 2, text: '<b>3. Оргазм</b> — самая короткая фаза (секунды). Теперь ведущим становится <b>симпатический</b> центр (Th10–L2): ритмичные сокращения мышц тазового дна с интервалом ~0,8 с, пик пульса (до 110–180) и давления. Гипофиз выбрасывает <b>окситоцин</b>, в мозге активна система вознаграждения (дофамин).' },
  { id: 'res', name: 'Разрешение', color: '#7FD6FF', d: 7, text: '<b>4. Разрешение.</b> Кровь оттекает, пульс, давление и дыхание возвращаются к исходным. Выделяется <b>пролактин</b> — он участвует в чувстве насыщения и расслабления. У мужчин наступает <b>рефрактерный период</b> (от минут до часов), когда повторный ответ невозможен; у женщин его может не быть, возможны повторные оргазмы.' },
];
function makeSresp() {
  __set_rnd(mulberry(2424));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x08060a); scene.environment = envTex;
  labLights(scene, 0xff8ab0);
  const HOME = flyTarget(V3(0, 1.0, 0), V3(-3.2, 2.2, 11.6));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 2; controls.maxDistance = 20;
  bodyShell(scene, { rim: 0.2 });
  // мозг, гипоталамус, гипофиз
  const brain = new THREE.Mesh(ell3(0.34, 0.28, 0.4, V3(0, 4.25, 0)), new THREE.MeshPhysicalMaterial({ color: 0xe0b8c8, roughness: 0.6, transparent: true, opacity: 0.12, depthWrite: false })); scene.add(brain);
  const HYP = V3(0, 4.08, 0.08), LIMB = V3(0, 4.25, 0.0), CTX = V3(0, 4.42, 0.1);
  const gHyp = glowNucleus(scene, HYP, '#C77DFF', 0.045, 7), gLimb = glowNucleus(scene, LIMB, '#FF8AB0', 0.06, 7), gCtx = glowNucleus(scene, CTX, '#9FD0FF', 0.05, 7);
  // спинной мозг и центры
  // спинной мозг взрослого кончается на уровне L1–L2 (конус: сегменты S2–S4), ниже — конский хвост из корешков
  const CORD = new THREE.CatmullRomCurve3([V3(0, 3.9, -0.1), V3(0, 3.3, -0.4), V3(0, 2.2, -0.5), V3(0, 1.45, -0.45), V3(0, 1.05, -0.42)]);
  scene.add(new THREE.Mesh(taperTube(CORD, (u) => (u < 0.9 ? 0.035 : 0.035 * (1 - (u - 0.9) * 6)), 60, 10), organMat('#F2E6C8', 0.45)));
  scene.add(new THREE.Mesh(mergeGeometries([-2, -1, 0, 1, 2].map((k) => tube([V3(0.006 * k, 1.1, -0.42), V3(0.012 * k, 0.7, -0.41), V3(0.03 * k, 0.25, -0.36)], 0.006, 16, 4))), organMat('#F2E6C8', 0.45)));
  const SYM = V3(0, 1.45, -0.45), PARA = V3(0, 1.1, -0.425);
  const gSym = glowNucleus(scene, SYM, '#FF6A5A', 0.04, 7), gPara = glowNucleus(scene, PARA, '#5CC48A', 0.04, 7);
  const PEL = V3(0, 0.0, 0.08);
  const nSym = new THREE.CatmullRomCurve3([SYM, SYM.clone().add(V3(0.15, -0.3, 0.2)), V3(0.12, 0.35, 0.05), PEL]);
  const nPara = new THREE.CatmullRomCurve3([PARA, V3(0.02, 0.7, -0.41), V3(0.05, 0.28, -0.34), V3(0.1, 0.05, -0.1), PEL]);   // по конскому хвосту, из крестца — тазовые нервы
  const nDesc = new THREE.CatmullRomCurve3([HYP, V3(0, 3.8, -0.05), CORD.getPointAt(0.2), CORD.getPointAt(0.75)]);
  const mkN = (c, col) => { const f = flowTubeMat(col, 0.6, 2); f.uniforms.uOn.value = 0.15; scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.012, 6), f)); return f; };
  const fSym = mkN(nSym, '#FF6A5A'), fPara = mkN(nPara, '#5CC48A'), fDesc = mkN(nDesc, '#C77DFF');
  // органы малого таза (обобщённо) и сосуды
  const pelvis = new THREE.Mesh(ell3(0.32, 0.22, 0.24), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe88a9a).multiplyScalar(0.4), roughness: 0.4, transparent: true, opacity: 0.45, depthWrite: false, emissive: 0xff4a6a, emissiveIntensity: 0.05 })); pelvis.position.copy(PEL); scene.add(pelvis);
  const PEL_C0 = pelvis.material.color.clone(), PEL_C1 = new THREE.Color(0xff3a6a).multiplyScalar(0.6);   // прилив крови: орган набухает и краснеет
  const gPel = glowNucleus(scene, PEL, '#FF5A7A', 0.08, 6);
  const heart = new THREE.Mesh(ell3(0.25, 0.3, 0.22), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xc84a50).multiplyScalar(0.5), roughness: 0.4, transparent: true, opacity: 0.7, emissive: 0x501010, emissiveIntensity: 0.3 })); heart.position.copy(BODY.heart); heart.rotation.z = 0.4; scene.add(heart);   // геометрия в нуле — пульсирует на месте
  const ART = new THREE.CatmullRomCurve3([BODY.heart, V3(0.1, 2.5, -0.2), V3(0.08, 1.4, -0.3), V3(0.15, 0.4, -0.15), PEL]);
  const fArt = mkN(ART, '#E0605A');
  const lungs = [1, -1].map((s) => { const m = new THREE.Mesh(ell3(0.4, 0.66, 0.38), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe89aa8).multiplyScalar(0.35), roughness: 0.6, transparent: true, opacity: 0.16, depthWrite: false })); m.position.set(0.5 * s, 2.28, -0.04); scene.add(m); return m; });
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
    gPara.spr.material.opacity = 0.25 + 0.75 * (ph <= 1 ? L : 0.15); gSym.spr.material.opacity = 0.25 + 0.75 * (isOrg ? 1 : 0.1);
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
    if (st.model === 'basson') { const cx = w / 2, cy = hgt / 2 + 6, r = Math.min(w, hgt) * 0.34; const names = ['близость', 'стимулы', 'возбуждение', 'желание', 'удовлетворение']; ctx.strokeStyle = 'rgba(255,138,176,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.font = '500 9px JetBrains Mono, monospace'; names.forEach((n, i) => { const a = -Math.PI / 2 + i / names.length * Math.PI * 2; ctx.fillStyle = '#ffd0e0'; ctx.fillText(n, cx + Math.cos(a) * r - n.length * 2.6, cy + Math.sin(a) * r + 3); }); const a = -Math.PI / 2 + (st.ct / (TOT + 3)) * Math.PI * 2; ctx.fillStyle = '#ff8ab0'; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2); ctx.fill(); return; }
    let a = 0; SR_PH.forEach((p) => { ctx.fillStyle = p.color + '22'; ctx.fillRect(X(a), 14, X(a + p.d) - X(a), hgt - 24); a += p.d; });
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= TOT + 3; x += 0.1) { const y = Y(level(Math.min(x, TOT), st.pattern)); x ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); } ctx.stroke();
    ctx.strokeStyle = '#FF8AB0'; ctx.lineWidth = 2.2; ctx.beginPath(); st.trace.forEach(([x, v], i) => (i ? ctx.lineTo(X(x), Y(v)) : ctx.moveTo(X(x), Y(v)))); ctx.stroke();
    ctx.fillStyle = '#ffd0e0'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('уровень возбуждения', 10, 12);
  }
  const TXT_MJ = '<b>Цикл полового ответа</b> — последовательность физиологических изменений, описанная Уильямом Мастерсом и Вирджинией Джонсон (1966): возбуждение → плато → оргазм → разрешение. Им управляют мозг (кора, лимбическая система, гипоталамус) и вегетативная нервная система: <b>парасимпатическая</b> (зелёная, крестцовый отдел) отвечает за прилив крови, <b>симпатическая</b> (красная, грудопоясничный отдел) — за оргазм.';
  const TXT_B = '<b>Круговая модель Розмари Бэссон</b> (2000). У многих людей, особенно в длительных отношениях, желание не всегда возникает первым: человек может начать с готовности к близости, а желание появляется уже в ответ на стимулы и возбуждение. Удовлетворение (эмоциональное и физическое) поддерживает мотивацию к следующему циклу. Модель дополняет линейную схему Мастерса и Джонсон.';
  const labels = [
    { text: 'кора и лимбическая система', pos: V3(0.35, 4.5, 0.1), color: '#FF8AB0', show: () => st.labels },
    { text: 'гипоталамус и гипофиз', pos: V3(0.3, 4.0, 0.15), color: '#C77DFF', show: () => st.labels },
    { text: 'симпатический центр Th10–L2', pos: SYM.clone().add(V3(0.2, 0.05, 0)), color: '#FF6A5A', show: () => st.labels },
    { text: 'парасимпатический центр S2–S4', pos: PARA.clone().add(V3(0.2, -0.05, 0)), color: '#5CC48A', show: () => st.labels },
    { text: 'органы малого таза', pos: PEL.clone().add(V3(0.35, -0.05, 0.1)), color: '#FF5A7A', show: () => st.labels },
    { text: 'сердце', pos: BODY.heart.clone().add(V3(0.3, 0, 0.2)), color: '#FF8A7A', show: () => st.labels },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 380px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.model === 'basson' ? TXT_B : (st.run || st.ct > 0 ? SR_PH[st.ph].text : TXT_MJ)); };
    refs.phSeg = seg(SR_PH.map((p) => ({ id: p.id, label: p.name, color: p.color })), () => SR_PH[st.ph].id, (v) => { const i = SR_PH.findIndex((p) => p.id === v); st.ct = SR_PH.slice(0, i).reduce((a, p) => a + p.d, 0) + 0.01; st.trace = []; st.ph = i; st.msg = null; refs.setInfo(); });
    refs.patSeg = seg([{ id: 'm', label: 'Кривая A' }, { id: 'f', label: 'С повторным пиком' }, { id: 'b', label: 'Без оргазма' }], () => st.pattern, (v) => { st.pattern = v; st.ct = 0; st.trace = []; });
    refs.modSeg = seg([{ id: 'mj', label: 'Мастерс и Джонсон' }, { id: 'basson', label: 'Бэссон' }], () => st.model, (v) => { st.model = v; st.msg = null; refs.setInfo(); });
    const play = toggle('Идёт', () => st.run, (v) => { st.run = v; });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { play, lab });
    el.append(group('Фаза', '1–4', refs.phSeg, play), group('Вариант', '', refs.patSeg), group('Модель', '', refs.modSeg), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { refs.phSeg.querySelectorAll('button')[n - 1].click(); return true; }
    if (k === ' ') { refs.play.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Пульс', Math.round(st.hr || 70), 'уд/мин'], ['Дыхание', Math.round(st.rr || 14), '/мин'], ['Фаза', SR_PH[st.ph].name, '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8AB0',
    kicker: 'Тело · физиология', title: 'Цикл полового ответа',
    lede: 'Как мозг, вегетативная нервная система, сосуды и гормоны согласованно проводят тело через четыре фазы полового ответа — от возбуждения до разрешения.',
    notes: `
      <div><h2>Нервы и гормоны</h2><ul>
        <li><b>Мозг:</b> кора (мысли, образы), лимбическая система и гипоталамус запускают и регулируют ответ; дофамин связан с желанием и вознаграждением.</li>
        <li><b>Парасимпатическая система</b> (тазовые нервы из S2–S4) — расширение сосудов и прилив крови.</li>
        <li><b>Симпатическая система</b> (Th10–L2) — сокращения гладких мышц и оргазм.</li>
        <li><b>Окситоцин</b> — сокращения мышц и чувство близости; <b>пролактин</b> — расслабление и рефрактерность; <b>тестостерон</b> и <b>эстрогены</b> поддерживают либидо у обоих полов.</li></ul>
        <h3>Важно</h3><p>Длительность фаз и форма кривой сильно различаются у разных людей и в разных ситуациях — «нормы» здесь широкие. Стойкие трудности с желанием, возбуждением или оргазмом — повод обратиться к врачу (урологу, гинекологу, сексологу): часто причина в гормонах, сосудах, лекарствах или стрессе.</p></div>
      <div><h2>Условности</h2><ul><li>Кривые — усреднённые схемы из учебников физиологии.</li><li>Органы малого таза показаны обобщённо светящейся областью.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> фаза</li><li><code>Пробел</code> пауза</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  return self;
}
export { makeSresp };
