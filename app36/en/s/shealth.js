import { Sparks, THREE, V3, __set_rnd, bodyShell, brainShell, displaceGeo, ell3, envTex, flowTubeMat, flyStep, flyTarget, glowNucleus, group, infoBox, labLights, makeControls, mulberry, organMat, pickOn, randUnit, rnd, scopeShow, seg, taperTube, toggle } from '../core.js';


/* =========================================================
   ТЕЛО · ПОЛОВОЕ ВЛЕЧЕНИЕ И СЕКСУАЛЬНОЕ ЗДОРОВЬЕ
   ========================================================= */
const SH_BRAIN = [
  { id: 'poa', name: 'Hypothalamus', color: '#C77DFF', p: V3(0.0, 4.07, 0.1), text: '<b>The hypothalamus</b> (the medial preoptic area and other nuclei) is the main “center” of sexual behavior. It is sensitive to sex hormones and, via the pituitary (LH, FSH), controls the activity of the gonads.' },
  { id: 'vta', name: 'Reward system', color: '#F2C14E', p: V3(-0.02, 4.0, -0.05), text: '<b>The dopamine reward system</b>: ventral tegmental area of the midbrain → nucleus accumbens → prefrontal cortex. Dopamine creates motivation, “wanting” and anticipation. The same system works during eating and other pleasant events.' },
  { id: 'amy', name: 'Amygdala', color: '#FF6A9A', p: V3(0.2, 4.02, 0.06), text: '<b>The amygdala</b> assesses emotional significance: attractiveness, safety or threat. Fear and anxiety suppress desire.' },
  { id: 'pfc', name: 'Prefrontal cortex', color: '#7FD6FF', p: V3(0.0, 4.35, 0.3), text: '<b>The prefrontal cortex</b> is responsible for control, weighing consequences, social norms and decisions. It can both strengthen and inhibit desire — which is why human behavior is not determined by hormones alone.' },
  { id: 'gon', name: 'Gonads', color: '#FF8AB0', p: V3(0.0, -0.05, 0.08), text: '<b>The gonads</b> secrete testosterone and estrogens. <b>Testosterone</b> supports libido in both men and women (in women it is produced in smaller amounts by the ovaries and adrenal glands). Estrogens and progesterone influence desire at different phases of the cycle.' },
];
const SH_STATES = {
  base: { name: 'Baseline state', lev: { t: 0.5, da: 0.45, ne: 0.35, se: 0.55, ox: 0.35, co: 0.3 }, text: '' },
  love: { name: 'Being in love', lev: { t: 0.6, da: 0.95, ne: 0.8, se: 0.25, ox: 0.5, co: 0.45 }, text: '<b>Being in love (attraction to a specific person).</b> According to the model of anthropologist Helen Fisher, this is a separate system: lots of dopamine and norepinephrine (euphoria, energy, sleeplessness, thinking “only about him/her”), while serotonin is reduced — hence the obsessive thoughts. It usually lasts from a few months to 2–3 years.' },
  attach: { name: 'Attachment', lev: { t: 0.45, da: 0.5, ne: 0.3, se: 0.6, ox: 0.9, co: 0.25 }, text: '<b>Attachment.</b> In long-term relationships, oxytocin and vasopressin come to the fore — the hormones of trust, calm and closeness. They are released during hugs and touch.' },
  stress: { name: 'Stress and fatigue', lev: { t: 0.3, da: 0.25, ne: 0.6, se: 0.4, ox: 0.15, co: 0.95 }, text: '<b>Stress, fatigue, lack of sleep.</b> Cortisol and anxiety suppress sex hormones and the reward system — desire decreases. It is also reduced by depression, some medications (antidepressants, hormonal drugs), thyroid disease, alcohol and high prolactin.' },
};
const SH_LEV = [['t', 'Sex hormones', '#FF8AB0'], ['da', 'Dopamine', '#F2C14E'], ['ne', 'Norepinephrine', '#FF6A5A'], ['se', 'Serotonin', '#7FE0A0'], ['ox', 'Oxytocin', '#C77DFF'], ['co', 'Cortisol', '#9FA8B8']];
const SH_STI = [
  { id: 'hiv', name: 'HIV', color: '#FF6A5A', kind: 'virus', text: '<b>HIV</b> (human immunodeficiency virus) attacks CD4 lymphocytes. It is transmitted through sex without a condom, through blood (shared needles) and from mother to child. It may cause no symptoms for years; without treatment it leads to AIDS. Modern antiretroviral therapy allows people to live full lives, and a person with an undetectable viral load does not pass the virus to a partner. Pre-exposure prophylaxis (PrEP) is available.' },
  { id: 'hpv', name: 'HPV', color: '#F2C14E', kind: 'capsid', text: '<b>Human papillomavirus</b> is the most common STI. Most often it clears on its own, but some types cause genital warts, and the oncogenic types (16, 18) cause cancer of the cervix, throat and other organs. There is an effective <b>vaccine</b>, best given before the start of sexual activity; women are advised to have regular screening (cytology, HPV test).' },
  { id: 'hsv', name: 'Herpes', color: '#C77DFF', kind: 'env', text: '<b>Herpes simplex virus</b> (HSV-2 and HSV-1) causes painful blisters. After infection it stays in the nerve ganglia for life and flares up from time to time. Medication shortens flare-ups and lowers the risk of transmission.' },
  { id: 'chl', name: 'Chlamydia', color: '#7FE0A0', kind: 'cocci', text: '<b>Chlamydia</b> is a bacterial infection, often without symptoms (especially in women). Untreated, it can lead to pelvic inflammatory disease and infertility. It is treated with antibiotics; both partners must be treated.' },
  { id: 'gon', name: 'Gonococcus', color: '#9FD0FF', kind: 'diplo', text: '<b>Gonorrhea</b> is caused by a diplococcus bacterium. It causes discharge and pain on urination, but can also be silent. It is treated with antibiotics; resistance to them is growing, so self-treatment is not an option.' },
  { id: 'syph', name: 'Treponema pallidum', color: '#FFB070', kind: 'spiro', text: '<b>Syphilis</b> is caused by a spiral-shaped bacterium. First comes a painless sore, then a rash, then a latent stage; untreated, it damages the heart, blood vessels and nervous system. It responds well to penicillin. Testing is by a blood test.' },
  { id: 'hbv', name: 'Hepatitis B', color: '#E8D8A0', kind: 'small', text: '<b>Hepatitis B</b> damages the liver; it is transmitted through blood and sexually, can become chronic and lead to cirrhosis and liver cancer. There is a <b>vaccine</b>, which is part of the national immunization schedule.' },
];
const SH_CONTRA = [
  { name: 'No protection', typ: 85, perfect: 85, sti: false, color: '#9FA8B8' },
  { name: 'Withdrawal', typ: 20, perfect: 4, sti: false, color: '#B8A890' },
  { name: 'Calendar method', typ: 15, perfect: 3, sti: false, color: '#C8B070' },
  { name: 'Condom', typ: 13, perfect: 2, sti: true, color: '#5CC48A' },
  { name: 'Pill (COC)', typ: 7, perfect: 0.3, sti: false, color: '#F2C14E' },
  { name: 'Injection', typ: 4, perfect: 0.2, sti: false, color: '#FF8A5C' },
  { name: 'Copper IUD', typ: 0.8, perfect: 0.6, sti: false, color: '#E0A060' },
  { name: 'Hormonal IUD', typ: 0.2, perfect: 0.2, sti: false, color: '#FF8AB0' },
  { name: 'Implant', typ: 0.1, perfect: 0.1, sti: false, color: '#C77DFF' },
];
function makeShealth() {
  __set_rnd(mulberry(2525));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x08060a); scene.environment = envTex;
  labLights(scene, 0xc77dff);
  const MOB = matchMedia('(max-width:700px)').matches;
  // выноска: увеличенный мозг (координаты brainKit: x — вперёд, z — вбок к зрителю) справа от тела; на телефоне — над головой
  const CB = MOB ? V3(0.15, 6.15, 0) : V3(2.6, 3.2, 0), KB = MOB ? 0.82 : 0.8;
  const VIEW = { drive: MOB ? flyTarget(V3(0.15, 3.9, 0), V3(0.9, 4.5, 15)) : flyTarget(V3(1.15, 2.05, 0), V3(1.85, 2.7, 10.4)), sti: flyTarget(V3(30, -0.6, 0), V3(30, 0.8, 8.4)), protect: flyTarget(V3(60, -0.9, 0), V3(60.4, 1.6, 12.4)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 140); camera.position.copy(VIEW.drive.pos);
  const controls = makeControls(camera, VIEW.drive.target); controls.minDistance = 1.5; controls.maxDistance = 22;
  /* ---------- влечение ---------- */
  const dr = new THREE.Group(); scene.add(dr);
  bodyShell(dr, { rim: 0.34 });
  dr.add(new THREE.Mesh(ell3(0.34, 0.28, 0.4, V3(0, 4.25, 0)), new THREE.MeshPhysicalMaterial({ color: 0xe0b8c8, roughness: 0.6, transparent: true, opacity: 0.22, depthWrite: false })));
  const zb = new THREE.Group(); zb.position.copy(CB); zb.scale.setScalar(KB); dr.add(zb);
  brainShell(zb, { opacity: 0.06, rim: 0.9 });
  // где лежат структуры в увеличенном мозге (покрышка — в среднем мозге, миндалина — в височной доле, прилежащее ядро — под головкой хвостатого)
  const QB = { poa: V3(0.36, -0.44, 0.06), vta: V3(0.02, -0.6, 0.08), amy: V3(0.5, -0.6, 0.52), pfc: V3(1.25, 0.32, 0.3) };
  const QW = (q) => q.clone().multiplyScalar(KB).add(CB);   // точка выноски в мире
  const BN = Object.fromEntries(SH_BRAIN.map((b) => [b.id, { ...b, g: glowNucleus(QB[b.id] ? zb : dr, QB[b.id] || b.p, b.color, b.id === 'gon' ? 0.07 : 0.075, 7) }]));
  const pickBrain = SH_BRAIN.map((b) => { const m = new THREE.Mesh(new THREE.SphereGeometry(b.id === 'gon' ? 0.15 : 0.13, 12, 10), new THREE.MeshBasicMaterial({ visible: false })); m.position.copy(QB[b.id] || b.p); m.userData.pick = b.id; (QB[b.id] ? zb : dr).add(m); return m; });
  const NAC = V3(0.68, -0.26, 0.16), PITQ = V3(0.42, -0.84, 0);
  glowNucleus(zb, NAC, '#F2C14E', 0.04, 6);
  zb.add(new THREE.Mesh(ell3(0.07, 0.06, 0.07, PITQ), organMat('#C77DFF', 0.5, { emissiveIntensity: 0.4 })));
  zb.add(new THREE.Mesh(taperTube(new THREE.CatmullRomCurve3([V3(0.33, -0.55, 0), V3(0.37, -0.68, 0), V3(0.41, -0.79, 0)]), (u) => 0.03 - 0.012 * u, 12, 8), organMat('#C77DFF', 0.5, { transparent: true, opacity: 0.6 })));
  // в голове тела — маленькие гипоталамус и гипофиз, от головы к выноске — две тонкие линии
  glowNucleus(dr, SH_BRAIN[0].p, '#C77DFF', 0.03, 6);
  { const lm = new THREE.LineBasicMaterial({ color: 0xc8b0d8, transparent: true, opacity: 0.28 });
    const H = V3(0, 4.25, 0), ends = MOB ? [V3(-1.1, 0, 0), V3(1.1, 0, 0)] : [V3(-0.6, 0.9, 0), V3(-0.4, -1.9, 0)];
    ends.forEach((e) => { const a = MOB ? H.clone().add(V3(Math.sign(e.x) * 0.3, 0.25, 0)) : H.clone().add(V3(0.3, Math.sign(e.y) * 0.25, 0)); dr.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, QW(e)]), lm)); }); }
  [1, -1].forEach((s) => { const g = ell3(0.08, 0.05, 0.05); g.rotateZ(0.3 * s); g.translate(0.42 * s, 1.38, -0.33); dr.add(new THREE.Mesh(g, organMat('#F2C14E', 0.45, { transparent: true, opacity: 0.6 }))); });   // надпочечники — источник кортизола
  const PIT = V3(0, 3.98, 0.1);
  const flows = [];
  const mkF = (pts, col, par = dr, r = 0.012) => { const c = new THREE.CatmullRomCurve3(pts); const f = flowTubeMat(col, 0.5, 2); f.uniforms.uOn.value = 0.4; par.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, r, 6), f)); flows.push(f); return { c, f }; };
  const fDA = mkF([QB.vta, V3(0.32, -0.46, 0.12), NAC, V3(1.0, 0.0, 0.26), QB.pfc], '#F2C14E', zb, 0.02);
  const fLH = mkF([PIT, V3(0.1, 3.5, 0.1), V3(0.12, 2.0, 0.0), V3(0.08, 0.6, 0.05), BN.gon.p], '#C77DFF');
  const fT = mkF([BN.gon.p, V3(-0.08, 0.6, 0.0), V3(-0.12, 2.0, -0.05), V3(-0.1, 3.5, 0.05), BN.poa.p], '#FF8AB0');
  /* ---------- возбудители ИППП ---------- */
  const sti = new THREE.Group(); sti.position.set(30, 0, 0); scene.add(sti); sti.visible = false;
  const STM = [];
  SH_STI.forEach((p, i) => {
    const a = (i / SH_STI.length) * Math.PI * 2, pos = V3(Math.cos(a) * 2.3, Math.sin(a) * 1.25 - 0.2, Math.sin(a) * 0.6);
    const g = new THREE.Group(); g.position.copy(pos); sti.add(g);
    const mat = organMat(p.color, 0.5, { emissiveIntensity: 0.12, clearcoat: 0.6 });
    const add = (geo) => { const m = new THREE.Mesh(geo, mat); m.userData.pick = p.id; g.add(m); return m; };
    if (p.kind === 'virus') { add(new THREE.SphereGeometry(0.35, 32, 24)); for (let k = 0; k < 40; k++) { const d = randUnit(); const s2 = add(new THREE.SphereGeometry(0.05, 8, 6)); s2.position.copy(d.multiplyScalar(0.4)); } const core = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 12), new THREE.MeshBasicMaterial({ color: 0xffd0a0, transparent: true, opacity: 0.5 })); g.add(core); }
    if (p.kind === 'capsid') add(new THREE.IcosahedronGeometry(0.35, 1));
    if (p.kind === 'env') { add(new THREE.IcosahedronGeometry(0.22, 0)); const env = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 24), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(p.color).multiplyScalar(0.4), transparent: true, opacity: 0.3, depthWrite: false })); env.userData.pick = p.id; g.add(env); for (let k = 0; k < 24; k++) { const s2 = add(new THREE.CylinderGeometry(0.01, 0.025, 0.08, 6)); const d = randUnit(); s2.position.copy(d.clone().multiplyScalar(0.41)); s2.quaternion.setFromUnitVectors(V3(0, 1, 0), d); } }
    if (p.kind === 'cocci') for (let k = 0; k < 9; k++) { const s2 = add(new THREE.SphereGeometry(0.11, 16, 12)); s2.position.copy(randUnit().multiplyScalar(0.18 + rnd() * 0.08)); }
    if (p.kind === 'diplo') [[-0.12, 0], [0.12, 0], [-0.1, 0.3], [0.14, 0.3]].forEach(([x, y]) => { const s2 = add(displaceGeo(new THREE.SphereGeometry(0.13, 16, 12), (v) => { v.x *= 0.75; })); s2.position.set(x, y - 0.15, 0); });
    if (p.kind === 'spiro') add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 60 }, (_, k) => V3(-0.6 + k / 59 * 1.2, Math.sin(k * 0.8) * 0.08, Math.cos(k * 0.8) * 0.08))), 200, 0.025, 6));
    if (p.kind === 'small') { add(new THREE.SphereGeometry(0.22, 24, 18)); for (let k = 0; k < 20; k++) { const s2 = add(new THREE.SphereGeometry(0.035, 6, 4)); s2.position.copy(randUnit().multiplyScalar(0.24)); } }
    g.scale.setScalar(['cocci', 'diplo', 'spiro'].includes(p.kind) ? 1.3 : 0.7);   // бактерии крупнее вирусов (истинная разница — в 5–100 раз)
    STM.push({ p, g, mat, home: pos });
  });
  /* ---------- контрацепция: столбцы ---------- */
  const pr = new THREE.Group(); pr.position.set(60, 0, 0); scene.add(pr); pr.visible = false;
  const BARS = SH_CONTRA.map((c, i) => { const x = -3.2 + i * 0.8, hgt = Math.max(0.05, c.typ / 85 * 3.2);   /* линейная шкала: высота ∝ числу беременностей из 100 */ const m = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1, 32), organMat(c.color, 0.5, { emissiveIntensity: 0.15, clearcoat: 0.6 })); m.scale.y = hgt; m.position.set(x, -1.2 + hgt / 2, 0); pr.add(m);
    if (c.sti) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 32), new THREE.MeshBasicMaterial({ color: 0x7fe0a0 })); ring.rotation.x = Math.PI / 2; ring.position.set(x, -1.2, 0); pr.add(ring); }
    return { c, m, x, hgt }; });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.04, 1.2), new THREE.MeshPhysicalMaterial({ color: 0x302838, roughness: 0.6 })); floor.position.y = -1.22; pr.add(floor);
  const fx = new Sparks(1600, 0.05); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'drive', sel: null, labels: true, rot: true, fly: null, state: 'base', lev: { ...SH_STATES.base.lev }, msg: null };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.sel = null; st.msg = null; dr.visible = m === 'drive'; sti.visible = m === 'sti'; pr.visible = m === 'protect'; st.fly = VIEW[m]; STM.forEach((s) => { s.mat.opacity = 1; s.mat.transparent = false; }); refs.setInfo && refs.setInfo(); }
  function setState(k) { st.state = k; if (st.mode !== 'drive') setMode('drive'); st.msg = SH_STATES[k].text || null; refs.stSeg && refs.stSeg.sync(); refs.setInfo(); }
  function select(id) { st.sel = id; if (st.mode === 'sti') STM.forEach((s) => { const on = s.p.id === id; s.mat.transparent = !on; s.mat.opacity = on ? 1 : 0.25; s.mat.emissiveIntensity = on ? 0.5 : 0.12; s.mat.needsUpdate = true; }); st.msg = null; refs.setInfo(); }
  pickOn(() => self, camera, () => [...pickBrain, ...STM.flatMap((s) => s.g.children)], (id) => select(id));
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly && st.mode !== 'drive'; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    const L = SH_STATES[st.state].lev; Object.keys(st.lev).forEach((k) => { st.lev[k] += (L[k] - st.lev[k]) * Math.min(1, dt * 1.5); });
    flows.forEach((f) => { f.uniforms.uTime.value = t; });
    fDA.f.uniforms.uOn.value = 0.15 + 0.85 * st.lev.da; fT.f.uniforms.uOn.value = 0.15 + 0.85 * st.lev.t; fLH.f.uniforms.uOn.value = 0.15 + 0.7 * st.lev.t;
    BN.vta.g.spr.material.opacity = 0.2 + 0.8 * st.lev.da; BN.poa.g.spr.material.opacity = 0.2 + 0.8 * st.lev.t; BN.gon.g.spr.material.opacity = 0.2 + 0.8 * st.lev.t; BN.amy.g.spr.material.opacity = 0.2 + 0.6 * st.lev.co; BN.pfc.g.spr.material.opacity = 0.3 + 0.4 * st.lev.se;
    if (st.mode === 'drive') { if (rnd() < st.lev.ox * 0.4) fx.spawn(PIT.clone(), randUnit().multiplyScalar(0.25), new THREE.Color(0xc77dff), 1.2, 0.5, 1.1); if (rnd() < st.lev.co * 0.3) fx.spawn(V3(0.42 * (rnd() < 0.5 ? 1 : -1), 1.38, -0.33), randUnit().multiplyScalar(0.25), new THREE.Color(0x9fa8b8), 1.2, 0.5, 1.1); }
    STM.forEach((s, i) => { s.g.rotation.y += dt * 0.4; s.g.rotation.x = Math.sin(t * 0.3 + i) * 0.3; s.g.position.y = s.home.y + Math.sin(t * 0.8 + i) * 0.05; });
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); const on = st.mode === 'drive'; scopeShow(on); if (!on) return;
    const bw = (w - 20) / SH_LEV.length; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    // подпись под столбцом целиком: не влезает — в две строки (по пробелу или с переносом посередине)
    const wrap = (n) => { if (ctx.measureText(n).width <= bw - 2) return [n]; const sp = n.indexOf(' '); if (sp > 0) return [n.slice(0, sp), n.slice(sp + 1)]; const V = /[aeiouy\u0430\u0435\u0451\u0438\u043e\u0443\u044b\u044d\u044e\u044f]/i, c0 = Math.ceil(n.length / 2); let m = c0; for (let d = 0; d <= 3; d++) { if ([c0 - d, c0 + d].some((j) => { if (j > 1 && j < n.length - 2 && !V.test(n[j]) && V.test(n[j + 1])) { m = j; return true; } return false; })) break; } return [n.slice(0, m) + '-', n.slice(m)]; };
    SH_LEV.forEach(([k, n, c], i) => { const v = st.lev[k], bh = v * (hgt - 46), cx = 12 + i * bw + bw * 0.31; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(12 + i * bw, hgt - 28 - bh, bw * 0.62, bh); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.66)'; wrap(n).forEach((ln, j) => ctx.fillText(ln, cx, hgt - 17 + j * 10)); });
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd0e0'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('neurotransmitters and hormones', 10, 12);
  }
  const TXT = {
    drive: '<b>Sexual desire (libido)</b> arises from the interplay of the brain and hormones. The hypothalamus and pituitary control the gonads, and their hormones (testosterone, estrogens) return to the brain and make it more sensitive to cues; the dopamine system creates motivation, while the prefrontal cortex weighs the situation and makes decisions. The strength of desire is highly individual and changes with age, health, mood and relationships; a lack of desire (asexuality) is also a normal variant, as long as it does not bother the person. Choose a state.',
    sti: '<b>Sexually transmitted infections (STIs).</b> Many of them run <b>without symptoms</b> for a long time, so a person may not know they are infected and may pass the infection on. Protection: condoms, vaccines (HPV, hepatitis B), regular testing and treatment of both partners, HIV pre-exposure prophylaxis. Pathogens are not to scale: bacteria are usually 10–50 times larger than viruses in diameter and thousands of times larger in volume. Click a pathogen.',
    protect: '<b>Contraception</b> means ways to prevent an unwanted pregnancy. The bar height shows how many women out of 100 become pregnant within a year with typical (not perfect) use of the method. A green ring means the method also protects against STIs: of all methods, only the <b>condom</b> does this. It is best to discuss the choice of method with a gynecologist.<br><br><b>Consent.</b> Any sexual contact is possible only with the voluntary, informed consent of both partners, which can be withdrawn at any moment. Everyone has the right to say “no”. The law protects minors: in Russia the age of consent is 16.',
  };
  const labels = [
    ...SH_BRAIN.map((b) => ({ text: b.name, pos: QB[b.id] ? QW(QB[b.id].clone().add(V3(0.08, b.id === 'vta' ? -0.16 : b.id === 'amy' ? -0.14 : 0.06, 0.1))) : b.p.clone().add(V3(0.2, 0.04, 0.15)), color: b.color, left: b.id === 'vta', show: () => st.labels && st.mode === 'drive' })),
    { text: 'Nucleus accumbens', pos: QW(NAC.clone().add(V3(0.06, 0.08, 0.1))), color: '#F2C14E', show: () => st.labels && st.mode === 'drive' && !MOB },
    { text: 'Pituitary', pos: QW(PITQ.clone().add(V3(0.08, -0.06, 0.05))), color: '#C77DFF', show: () => st.labels && st.mode === 'drive' },
    ...SH_STI.map((p, i) => ({ text: p.name, pos: V3(0, 0, 0), color: p.color, show: () => st.labels && st.mode === 'sti', _i: i })),
    ...SH_CONTRA.map((c, i) => ({ text: c.name + ' · ' + c.typ + '%', pos: V3(60 - 3.2 + i * 0.8, -1.05 + Math.max(0.05, c.typ / 85 * 3.2), 0.1), color: c.color, show: () => st.labels && st.mode === 'protect' })),
  ];
  labels.forEach((l) => { if (l._i !== undefined) l.pos.copy(STM[l._i].home).add(V3(30, -0.55, 0.3)); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 400px');
    refs.setInfo = () => { const b = SH_BRAIN.find((x) => x.id === st.sel), s2 = SH_STI.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.mode === 'drive' && b ? b.text : st.mode === 'sti' && s2 ? s2.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'drive', label: 'Sexual desire' }, { id: 'sti', label: 'Infections (STIs)' }, { id: 'protect', label: 'Protection and consent' }], () => st.mode, (v) => setMode(v));
    refs.stSeg = seg(Object.entries(SH_STATES).map(([k, s]) => ({ id: k, label: s.name })), () => st.state, (v) => setState(v));
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), group('State', '', refs.stSeg), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['drive', 'sti', 'protect'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'drive' ? [['State', SH_STATES[st.state].name, '']] : st.mode === 'sti' ? [['New STI cases worldwide', '>1', 'million/day']] : [['Protects against STIs', 'condom', '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#C77DFF',
    kicker: 'Body · sexual health', title: 'Desire and sexual health',
    lede: 'Where sexual desire comes from, which brain systems and hormones control it, and how to make sexual contact safe: infections, contraception and consent.',
    notes: `
      <div><h2>Helen Fisher’s three systems</h2><ul><li><b>Lust</b> (sex hormones) — a general drive for intimacy.</li><li><b>Attraction/romantic love</b> (dopamine, norepinephrine) — focus on one person.</li><li><b>Attachment</b> (oxytocin, vasopressin) — a long-term bond and trust.</li></ul>
        <h3>When to see a doctor</h3><p>Discharge, sores, rash, itching, pain on urination, or unprotected contact with a new partner are reasons to get tested for STIs (this can be done anonymously). A persistent decrease or loss of desire that troubles the person is a reason to see an endocrinologist, gynecologist, urologist or sexologist.</p></div>
      <div><h2>Simplifications</h2><ul><li>Pathogens are shown schematically and at different scales (viruses are usually 10–50 times smaller than bacteria in diameter and thousands of times smaller in volume).</li><li>Bar heights are on a logarithmic scale; the figures are WHO and CDC data for typical use.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li>click: structure or pathogen</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeShealth };
