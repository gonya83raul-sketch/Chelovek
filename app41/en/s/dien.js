import { Sparks, THREE, V3, __set_rnd, button, clamp, displaceGeo, envTex, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, labLights, lerp, makeControls, mergeGeometries, mulberry, rand, randUnit, rnd, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 3 · ПРОМЕЖУТОЧНЫЙ МОЗГ: ТАЛАМУС, ГИПОТАЛАМУС, ГИПОФИЗ, ЭПИФИЗ
   ========================================================= */
const THAL_CH = [
  { id: 'vision', name: 'Vision', color: '#5CC48A', nuc: 'lateral geniculate body', cortex: 'visual cortex (area 17)' },
  { id: 'hearing', name: 'Hearing', color: '#3FC1B0', nuc: 'medial geniculate body', cortex: 'auditory cortex (areas 41, 42)' },
  { id: 'touch', name: 'Touch and pain', color: '#5E8FEF', nuc: 'ventrobasal complex', cortex: 'postcentral gyrus (areas 1–3)' },
  { id: 'motor', name: 'Movement', color: '#FF8A5A', nuc: 'ventrolateral nuclei', cortex: 'motor and premotor cortex' },
  { id: 'limbic', name: 'Memory and emotion', color: '#E58FC4', nuc: 'anterior nuclei', cortex: 'cingulate gyrus' },
];
const HYPO_DEMOS = [
  { id: 'thirst', name: 'Thirst', color: '#6FC3FF' },
  { id: 'stress', name: 'Stress', color: '#FFB070' },
  { id: 'night', name: 'Night', color: '#B48CFF' },
  { id: 'baby', name: 'Nursing', color: '#FF8FB8' },
];
function makeDien() {
  __set_rnd(mulberry(606));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0xb9a4ff);
  const VIEW = { thal: flyTarget(V3(-0.6, -0.55, 0), V3(7.3, 4.05, 11.4)), hypo: flyTarget(V3(0.35, -2.15, 0), V3(4.6, -0.9, 6.2)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(VIEW.thal.pos);
  const controls = makeControls(camera, VIEW.thal.target); controls.minDistance = 2; controls.maxDistance = 25;
  const mat = (c, o = {}) => tissue(new THREE.Color(c).multiplyScalar(0.4), o);

  /* ---------- таламусы ---------- */
  const thal = new THREE.Group(); scene.add(thal);
  const thalGeo = (s) => displaceGeo(new THREE.SphereGeometry(1, 64, 44), (v) => {
    const back = smooth(0, -1, v.x); v.set(v.x * 1.05, v.y * (0.62 + 0.12 * back), v.z * (0.52 + 0.12 * back)); v.x += 0.06 * Math.exp(-(((v.y - 0.3) / 0.25) ** 2)) * smooth(0.6, 1, v.x / 1.05); v.z += 0.7 * s;   // между таламусами — только III желудочек и межталамическое сращение
  });
  [1, -1].forEach((s) => { const g = thalGeo(s); thal.add(new THREE.Mesh(g, mat(0xd8c8ff, { transparent: true, opacity: 0.42, depthWrite: false, emissive: 0x2a1e50 })), new THREE.Mesh(g, glassMat(0xc9b6ff, { rim: 0.6, base: 0.012, pow: 2 }))); });
  { const ad = new THREE.CylinderGeometry(0.14, 0.14, 0.62, 20); ad.rotateX(Math.PI / 2); ad.translate(0.1, 0.02, 0); thal.add(new THREE.Mesh(ad, mat(0xe8e0f0))); }
  // ретикулярное ядро — «скорлупа» снаружи
  const retShell = [1, -1].map((s) => { const g = thalGeo(s); g.scale(1.06, 1.08, 1.0); g.translate(0, 0, 0.1 * s); const m = new THREE.Mesh(g, glassMat(0x8fb4ff, { rim: 0.2, base: 0.003, pow: 1.6 })); thal.add(m); return m; });
  // ядра
  const TN = {
    limbic: [V3(0.82, 0.28, 0.63), V3(0.82, 0.28, -0.63)], motor: [V3(0.3, -0.05, 0.93), V3(0.3, -0.05, -0.93)], touch: [V3(-0.3, -0.12, 0.88), V3(-0.3, -0.12, -0.88)],
    vision: [V3(-0.78, -0.42, 0.96), V3(-0.78, -0.42, -0.96)], hearing: [V3(-0.62, -0.5, 0.66), V3(-0.62, -0.5, -0.66)],
  };
  const nucG = {};
  THAL_CH.forEach((c) => { nucG[c.id] = TN[c.id].map((p) => glowNucleus(thal, p, c.color, 0.08, 5)); });
  const assoc = [V3(0.1, 0.15, 0.43), V3(0.1, 0.15, -0.43), V3(-0.98, 0.05, 0.7), V3(-0.98, 0.05, -0.7)].map((p, i) => glowNucleus(thal, p, i < 2 ? '#C77DFF' : '#B8E06A', 0.1, 6));
  // III желудочек
  const csfM = new THREE.MeshPhysicalMaterial({ color: 0x2f7fc0, transparent: true, opacity: 0.25, emissive: 0x06204a, emissiveIntensity: 0.3, depthWrite: false, side: THREE.DoubleSide });
  { const sh = new THREE.Shape(); sh.moveTo(0.95, 0.35); sh.bezierCurveTo(0.3, 0.55, -0.6, 0.5, -0.9, 0.25); sh.bezierCurveTo(-0.85, -0.3, -0.5, -0.9, -0.2, -1.2); sh.bezierCurveTo(0.2, -1.45, 0.55, -1.55, 0.45, -1.7); sh.bezierCurveTo(0.8, -1.4, 1.0, -0.6, 0.95, 0.35);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: false, curveSegments: 24 }); g.translate(0, 0, -0.04); scene.add(new THREE.Mesh(g, csfM)); }
  // кора — купол сверху
  const dome = new THREE.Group(); scene.add(dome);
  const DR = V3(3.1 * 1.25, 3.1 * 0.8, 3.1 * 1.05), DC = V3(-0.1, 0, 0);   // полуоси и центр купола
  const domeG = new THREE.SphereGeometry(1, 72, 40, 0, Math.PI * 2, 0, Math.PI * 0.6); domeG.scale(DR.x, DR.y, DR.z); domeG.translate(DC.x, DC.y, DC.z);
  dome.add(new THREE.Mesh(domeG, new THREE.MeshPhysicalMaterial({ color: 0xe0b8c6, roughness: 0.55, transparent: true, opacity: 0.03, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.4 })), new THREE.Mesh(domeG, glassMat(0xf2c7d6, { rim: 0.45, base: 0.02, pow: 2.2 })));
  // точка на куполе в направлении p (k < 1 — чуть внутри)
  const onDome = (p, k = 0.985) => { const d = p.clone().sub(DC); return d.multiplyScalar(k / Math.hypot(d.x / DR.x, d.y / DR.y, d.z / DR.z)).add(DC); };
  // проекционные поля коры (z>0 — одна сторона; вторая — зеркально): слух — височная доля (извилины Гешля), зрение — затылочный полюс у шпорной борозды (медиально)
  const CX = { vision: onDome(V3(-3.3, 0.55, 0.35), 0.96), hearing: onDome(V3(-0.3, 0.45, 2.9)), touch: onDome(V3(-0.6, 2.42, 1.0)), motor: onDome(V3(0.6, 2.4, 1.0)), limbic: V3(0.6, 2.1, 0.3) };
  // поля коры — подкрашенные участки самого купола (без «леденцов» в воздухе): проекции заканчиваются на коре
  { const g = domeG.clone(), P = g.attributes.position, col = new Float32Array(P.count * 3), v = new THREE.Vector3();
    const F = Object.entries(CX).flatMap(([id, p]) => { const c = new THREE.Color(THAL_CH.find((q) => q.id === id).color); return [1, -1].map((s) => ({ p: V3(p.x, p.y, p.z * s), c, r: id === 'vision' ? 0.42 : id === 'limbic' ? 0.5 : 0.55 })); });
    for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); let r = 0, gg = 0, b = 0;
      F.forEach((f) => { const k = Math.exp(-((v.distanceTo(f.p) / f.r) ** 4)); r += f.c.r * k; gg += f.c.g * k; b += f.c.b * k; });
      col.set([r, gg, b], i * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    dome.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }))); }

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
    scn: { p: [V3(0.82, -1.28, 0.06), V3(0.82, -1.28, -0.06)], c: '#B48CFF', name: 'suprachiasmatic nuclei' },
    son: { p: [V3(0.62, -1.3, 0.24), V3(0.62, -1.3, -0.24)], c: '#6FC3FF', name: 'supraoptic nuclei' },
    pvn: { p: [V3(0.45, -0.85, 0.1), V3(0.45, -0.85, -0.1)], c: '#FFB070', name: 'paraventricular nuclei' },
    vmh: { p: [V3(0.1, -1.1, 0.18), V3(0.1, -1.1, -0.18)], c: '#F4C542', name: 'ventromedial nuclei (satiety)' },
    lat: { p: [V3(0.2, -0.95, 0.38), V3(0.2, -0.95, -0.38)], c: '#E9785F', name: 'lateral hypothalamus (hunger)' },
    mam: { p: [V3(-0.4, -1.38, 0.1), V3(-0.4, -1.38, -0.1)], c: '#E58FC4', name: 'mammillary bodies' },
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
  function alertMove() { if (st.mode !== 'thal') setMode('thal'); st.alertT = st.t; st.msg = '<b>Involuntary attention.</b> Something moved at the edge of the visual field. The corpora quadrigemina report this to the thalamus, and it opens a “green corridor” for the visual stream into the cortex: attention switches by itself, even if we were busy with something else.'; refs.setInfo(); }
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
    thirst: '<b>Thirst.</b> Neurons of the <b>supraoptic</b> nuclei sense that the blood has become too concentrated. Their axons run down the stalk straight into the <b>posterior pituitary</b> and release <b>vasopressin</b> into the blood. The kidneys start to reclaim water, and the person looks for something to drink.',
    stress: '<b>Stress.</b> The paraventricular nuclei release corticotropin-releasing hormone (CRH) into the <b>portal vessels</b>. These carry it to the <b>anterior lobe</b> of the pituitary, which releases ACTH into the blood. ACTH reaches the adrenal glands, and they secrete cortisol. The “fight or flight” decision is made by the amygdala and carried out by the posterior zones of the hypothalamus.',
    night: '<b>The biological clock.</b> The <b>suprachiasmatic nuclei</b> lie right above the optic chiasm and learn the overall light level from the retina. When it gets dark, they signal the <b>pineal gland</b>, which releases <b>melatonin</b>, a hormone that calms many of the body’s systems. This is how the daily rhythm is maintained.',
    baby: '<b>Oxytocin.</b> The paraventricular nuclei synthesize oxytocin and send it along their axons to the posterior pituitary. It triggers uterine contractions during childbirth and milk ejection, and takes part in attachment and caregiving; the centers of parental behavior lie in the anterior zones of the hypothalamus.',
  };
  const TXT = {
    thal: 'The <b>thalamus</b> is an information filter at the entrance to the cortex. Through it pass vision (lateral geniculate body), hearing (medial geniculate body), skin and muscle sensation (ventrobasal complex), motor programs from the cerebellum and basal ganglia, and signals of memory and emotion. Smell is the only exception. Choose what to pay attention to: the thalamus will open a “green corridor” for one stream and dampen the others. The inhibitory “shell” is the reticular nucleus.',
    hypo: 'The <b>hypothalamus</b> is the lower part of the diencephalon, with more than 30 pairs of nuclei. It holds the centers of hunger and thirst, sexual and parental behavior, fear and aggression, sleep and the biological clock. Together with the <b>pituitary gland</b> it controls all the endocrine glands: the posterior lobe releases hormones made in hypothalamic neurons, and the anterior lobe obeys the hypothalamus’s releasing and inhibiting hormones (liberins and statins). Try the experiments.',
  };
  const labels = [
    ...THAL_CH.map((c) => ({ text: c.nuc, left: c.id === 'vision' || c.id === 'hearing', pos: TN[c.id][0].clone().add({ vision: V3(-0.1, -0.22, 0.25), hearing: V3(-0.2, 0.06, 0.3) }[c.id] || V3(0.05, 0.16, 0.2)), color: c.color, show: () => st.labels && st.mode === 'thal' && (st.att === 'none' || st.att === c.id) })),
    ...THAL_CH.map((c) => ({ text: c.cortex, pos: CX[c.id].clone().add(V3(0, 0.25, 0)), color: c.color, show: () => st.labels && st.mode === 'thal' && st.att === c.id })),
    { text: 'pulvinar', pos: V3(-1.15, 0.25, 0.7), color: '#B8E06A', show: () => st.labels && st.mode === 'thal' && st.att === 'none' },
    { text: 'medial nuclei', pos: V3(0.1, 0.35, 0.3), color: '#C77DFF', show: () => st.labels && st.mode === 'thal' && st.att === 'none' },
    { text: 'reticular nucleus', pos: V3(0.3, 0.6, 1.15), color: '#8fb4ff', show: () => st.labels && st.mode === 'thal' && st.att !== 'none' },
    { text: 'third ventricle', pos: V3(0.3, -0.9, 0.05), color: '#8fd4ff', show: () => st.labels },
    { text: 'cortex', pos: V3(-1.5, 2.3, -1.6), color: '#f2c7d6', show: () => st.labels && st.mode === 'thal' },
    { text: 'pineal gland', pos: pineal.position.clone().add(V3(-0.1, 0.2, 0)), color: '#d8c090', show: () => st.labels },
    ...Object.entries(HN).map(([id, n]) => ({ text: n.name, pos: n.p[0].clone().add(V3(0.04, 0.08, 0.12)), color: n.c, show: () => st.labels && st.mode === 'hypo' })),
    { text: 'anterior pituitary', pos: ANT.clone().add(V3(0.2, -0.1, 0.25)), color: '#ffa070', show: () => st.labels && st.mode === 'hypo' },
    { text: 'posterior lobe', pos: POST.clone().add(V3(-0.2, -0.15, 0.2)), color: '#c0a0f0', show: () => st.labels && st.mode === 'hypo' },
    { text: 'portal vessels', pos: V3(0.55, -1.8, 0.1), color: '#ff7080', show: () => st.labels && st.mode === 'hypo' },
    { text: 'optic chiasm', pos: V3(1.1, -1.55, 0.1), color: '#e8e0d0', show: () => st.labels && st.mode === 'hypo' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 320px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'thal', label: 'Thalamus' }, { id: 'hypo', label: 'Hypothalamus and pituitary' }], () => st.mode, (v) => setMode(v));
    refs.attSeg = seg([{ id: 'none', label: 'Everything' }, ...THAL_CH.map((c) => ({ id: c.id, label: c.name, color: c.color }))], () => st.att, (v) => attend(v));
    const rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { rot, lab });
    el.append(group('Region', '1 · 2', refs.modeSeg),
      h('div', { class: 'grp', style: 'flex:1 1 420px' }, h('div', { class: 'glabel' }, 'Thalamic attention'), h('div', { class: 'gctl' }, refs.attSeg, button('Movement to the side', alertMove))),
      group('Hypothalamus', 'T · S · M · O', ...HYPO_DEMOS.map((d, i) => button(d.name, () => demo(d.id), i === 0))),
      group('View', 'R · N', rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === '1') { setMode('thal'); return true; } if (k === '2') { setMode('hypo'); return true; }
    if (k === 't' || k === 'е') { demo('thirst'); return true; } if (k === 's' || k === 'ы') { demo('stress'); return true; } if (k === 'm' || k === 'ь') { demo('night'); return true; } if (k === 'o' || k === 'щ') { demo('baby'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'thal' ? [['Thalamic nuclei', '≈40', ''], ['Length', '≈4', 'cm']] : [['Nuclei', '>30', 'pairs'], ['Pituitary', '≈0.5', 'g']]; }
  setMode('thal');
  const self = {
    labelBg: true, mobZoom: 0.64, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#B9A4FF',
    kicker: 'Brain · diencephalon', title: 'Thalamus and hypothalamus',
    lede: 'The thalamus decides which information reaches the cortex. The hypothalamus monitors the body’s needs and controls hormones through the pituitary gland.',
    notes: `
      <div><h2>The diencephalon</h2>
        <p>It develops from the forebrain vesicle: the lower wall gives rise to the <b>hypothalamus</b> (the most ancient part), the side walls to the <b>thalamus</b>, the upper wall to the epithalamus with the <b>pineal gland</b>, and the back wall to the metathalamus (the geniculate bodies). All these structures grew from the alar (dorsal) plate of the neural tube, so they contain no motor neurons, only relay neurons and interneurons.</p>
        <h3>Thalamus</h3>
        <p>Neuroanatomists distinguish about 40 nuclei, neurosurgeons up to 80. <b>Specific</b> nuclei pass sensory and motor signals to the cortex with a precise map of the body, the retina or the cochlea. <b>Nonspecific</b> nuclei set the overall tone of the cortex and work in the sleep–wake system. <b>Association</b> nuclei (the pulvinar, the dorsal nuclei) are connected with the frontal and parietal cortex and help recognize complex images. In chronic pain, neurosurgeons make precise lesions in certain thalamic networks.</p>
        <h3>Hypothalamus</h3>
        <p>The anterior nuclei produce parasympathetic effects (slowing of the heart, constriction of the pupil), the posterior nuclei sympathetic ones (dilation of the pupil, a rise in blood pressure). The medial zones handle the motivation to eat and drink, the anterior zones sexual and parental behavior, the posterior zones fear and aggression. The suprachiasmatic nuclei are the biological clock.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The location of the main thalamic nuclei and their links to cortical areas.</li><li>The reticular nucleus as the inhibitory shell of the thalamus.</li><li>The posterior pituitary receives axons from the supraoptic and paraventricular nuclei; the anterior pituitary receives releasing hormones through the portal vessels.</li><li>The pathway “suprachiasmatic nuclei → pineal gland → melatonin”.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>The cortex is shown as a dome; the thalamus and hypothalamus are enlarged.</li><li>Hormones are drawn as glowing particles, and time is compressed.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code> thalamus, <code>2</code> hypothalamus</li><li><code>T</code> thirst, <code>S</code> stress, <code>M</code> night, <code>O</code> oxytocin</li><li><code>R</code> rotate</li><li><code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeDien };
