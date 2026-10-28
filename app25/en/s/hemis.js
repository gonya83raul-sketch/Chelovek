import { Sparks, THREE, V3, __set_rnd, brainKit, brainShell, button, envTex, flowTubeMat, flyStep, flyTarget, glowNucleus, group, h, infoBox, labLights, makeControls, mulberry, pickOn, randUnit, rnd, seg, taperTube, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 4 · ПОЛУШАРИЯ: БАЗАЛЬНЫЕ ГАНГЛИИ И ПРОВОДЯЩИЕ ПУТИ
   ========================================================= */
const BG_PARTS = [
  { id: 'caud', name: 'Caudate nucleus', color: '#5E8FEF', text: 'The <b>caudate nucleus</b> is C-shaped and lies above and lateral to the thalamus. Its head bulges into the anterior horn of the lateral ventricle, its body lies in the ventricle’s wall, and its tail runs into the temporal lobe toward the amygdala. The brain has to curve its structures into arcs, following the rounded shape of the skull.' },
  { id: 'put', name: 'Putamen', color: '#E9785F', text: 'The <b>putamen</b> and the caudate nucleus form a single structure, the <b>striatum</b> (corpus striatum): sections show alternating stripes of gray and white matter. Its main job is movement and motor skills.' },
  { id: 'gp', name: 'Globus pallidus', color: '#F2C14E', text: 'The <b>globus pallidus</b> (external and internal segments) is an inhibitory “filter”: it constantly holds back the thalamus and keeps unwanted motor programs from starting. Putamen + globus pallidus = lentiform nucleus.' },
  { id: 'cla', name: 'Claustrum', color: '#B8E06A', text: 'The <b>claustrum</b> is a thin layer of gray matter between the putamen and the insular cortex.' },
  { id: 'amy', name: 'Amygdala', color: '#FF6A9A', text: 'The <b>amygdaloid complex</b> lies deep in the temporal lobe. It is the part of the basal ganglia linked to emotion: fear, anxiety, the “fight or flight” choice.' },
  { id: 'acc', name: 'Nucleus accumbens', color: '#FFB070', text: 'The <b>nucleus accumbens</b> (ventral striatum) is the center of the reward system. Together with the amygdala, the ventral tegmental area and the hypothalamus, it belongs to the limbic system of needs, motivation and emotion.' },
  { id: 'thal', name: 'Thalamus', color: '#B9A4FF', text: 'The <b>thalamus</b> is not a basal ganglion, but it is their main partner: the basal ganglia influence the cortex through its ventral anterior nucleus.' },
];
function bgSectionCanvas() {
  const W = 1024, H = 900, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const S = W / 2 / 1.45, X = (z) => W / 2 + z * S, Y = (y) => H * 0.45 - y * S;
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const ell = (z, y, rz, ry, col, rot = 0, a = 1) => { g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.ellipse(X(z), Y(y), rz * S, ry * S, rot, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; };
  const GREY = '#7d636c', WHITE = '#e6ddd2';
  // контур полушария с извилинами: r(a) с бороздами
  const outline = (s, k, cb) => { g.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * Math.PI * 2; let r = k * (1 + 0.035 * Math.sin(a * 11 + s) + 0.02 * Math.sin(a * 23)); const z = 0.64 * s + Math.cos(a) * 0.69 * r, y = 0.1 + Math.sin(a) * 0.98 * r; if (s * z < 0.012) cb ? 0 : 0; const zz = s * Math.max(0.012, s * z); i ? g.lineTo(X(zz), Y(y)) : g.moveTo(X(zz), Y(y)); } g.closePath(); };
  [1, -1].forEach((s) => {
    outline(s, 1); g.fillStyle = GREY; g.fill();
    g.save(); outline(s, 1); g.clip();
    // белое вещество с языками в извилины
    outline(s, 0.86); g.fillStyle = WHITE; g.fill();
    g.strokeStyle = WHITE; g.lineCap = 'round';
    for (let k = 0; k < 26; k++) { const a = k / 26 * Math.PI * 2 + 0.1; const z0 = 0.64 * s + Math.cos(a) * 0.55, y0 = 0.1 + Math.sin(a) * 0.8, z1 = 0.64 * s + Math.cos(a) * 0.66, y1 = 0.1 + Math.sin(a) * 0.93; g.lineWidth = 0.035 * S; g.beginPath(); g.moveTo(X(z0), Y(y0)); g.lineTo(X(z1), Y(y1)); g.stroke(); }
    // боковая борозда с корой по краям и островок в глубине
    g.strokeStyle = GREY; g.lineWidth = 0.13 * S; g.beginPath(); g.moveTo(X(1.4 * s), Y(-0.17)); g.quadraticCurveTo(X(1.02 * s), Y(-0.12), X(0.76 * s), Y(-0.1)); g.stroke();
    g.lineWidth = 0.11 * S; g.beginPath(); g.moveTo(X(0.74 * s), Y(0.14)); g.lineTo(X(0.74 * s), Y(-0.32)); g.stroke();
    g.strokeStyle = '#1a1016'; g.lineWidth = 0.022 * S; g.beginPath(); g.moveTo(X(1.42 * s), Y(-0.17)); g.quadraticCurveTo(X(1.02 * s), Y(-0.12), X(0.8 * s), Y(-0.1)); g.moveTo(X(0.8 * s), Y(0.12)); g.lineTo(X(0.8 * s), Y(-0.3)); g.stroke();
    // поясная борозда, медиальная кора
    g.strokeStyle = GREY; g.lineWidth = 0.1 * S; g.beginPath(); g.moveTo(X(0.03 * s), Y(0.95)); g.lineTo(X(0.03 * s), Y(-0.05)); g.stroke();
    g.restore();
    // ядра
    ell(0.6 * s, -0.08, 0.016, 0.21, '#9fc25a');                                // ограда
    ell(0.48 * s, -0.06, 0.085, 0.21, '#c46a55', 0.12 * s);                     // скорлупа
    ell(0.37 * s, -0.1, 0.048, 0.14, '#d6ae48', 0.2 * s); ell(0.32 * s, -0.12, 0.026, 0.09, '#b8923c', 0.2 * s);
    ell(0.2 * s, 0.2, 0.09, 0.12, '#5274c4');                                   // хвостатое
    ell(0.12 * s, 0.26, 0.055, 0.1, '#1d4f80', 0.3 * s);                        // желудочек
    ell(0.13 * s, -0.08, 0.12, 0.12, '#8f7ac8');                                // таламус
    ell(0.07 * s, -0.33, 0.08, 0.08, '#c99a88');                                // гипоталамус
    ell(0.5 * s, -0.42, 0.07, 0.06, '#d0587e');                                 // миндалина
    ell(0.3 * s, -0.44, 0.04, 0.025, '#f0e8dc');                                // зрительный тракт
    ell(0.1 * s, 0.55, 0.055, 0.12, '#b77aa0');                                 // поясная извилина
  });
  // мозолистое тело, III желудочек, передняя комиссура
  g.strokeStyle = '#f2ece2'; g.lineWidth = 0.06 * S; g.lineCap = 'round'; g.beginPath(); g.moveTo(X(-0.45), Y(0.3)); g.quadraticCurveTo(X(0), Y(0.44), X(0.45), Y(0.3)); g.stroke();
  g.fillStyle = '#1d4f80'; g.fillRect(X(-0.015), Y(0.05), 0.03 * S, 0.36 * S);
  g.fillStyle = '#f2ece2'; g.fillRect(X(-0.18), Y(-0.2), 0.36 * S, 0.03 * S);
  // зернистость ткани
  const img = g.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { if (d[i] + d[i + 1] + d[i + 2] < 8) continue; const n = (Math.random() - 0.5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function makeHemis() {
  __set_rnd(mulberry(707));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0x5e8fef);
  const TRV = flyTarget(V3(0.0, -0.3, 0), V3(3.0, 1.9, 4.9));
  const HOME = flyTarget(V3(-0.1, -0.25, 0), V3(2.85, 1.85, 4.85));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 1.2; controls.maxDistance = 12;
  const shell = brainShell(scene, { opacity: 0.04, rim: 0.26 });
  const PART = Object.fromEntries(BG_PARTS.map((p) => [p.id, { ...p, mats: [], anchor: V3(0, 0, 0) }]));
  const pick = [];
  const solid = (id, g, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(PART[id].color).multiplyScalar(0.34), roughness: 0.5, clearcoat: 0.25, envMapIntensity: 0.3, emissive: new THREE.Color(PART[id].color), emissiveIntensity: 0.06, transparent: true, opacity: 0.92, ...o }); PART[id].mats.push(m); const mesh = new THREE.Mesh(g, m); mesh.userData.pick = id; pick.push(mesh); scene.add(mesh); return mesh; };
  const bg = new THREE.Group(); scene.add(bg);
  [1, -1].forEach((s) => {
    const caud = new THREE.CatmullRomCurve3([V3(0.6, 0.02, 0.2 * s), V3(0.4, 0.24, 0.23 * s), V3(0.05, 0.3, 0.26 * s), V3(-0.35, 0.22, 0.31 * s), V3(-0.6, 0.0, 0.4 * s), V3(-0.48, -0.25, 0.48 * s), V3(-0.15, -0.36, 0.5 * s), V3(0.08, -0.38, 0.5 * s)]);
    // головка хвостатого ядра — самая толстая часть, выступает в передний рог и спускается к прилежащему ядру
    solid('caud', taperTube(caud, (u) => (u < 0.15 ? 0.19 - 0.3 * u : 0.145 * Math.pow(1 - u, 1.3) + 0.018), 120, 16));
    // латерально от таламуса: (задняя ножка внутренней капсулы) → бледный шар → скорлупа → наружная капсула → ограда
    const put = new THREE.SphereGeometry(1, 40, 28); put.scale(0.32, 0.2, 0.085); put.rotateZ(0.12); put.translate(0.2, -0.04, 0.45 * s); solid('put', put);
    const gpe = new THREE.SphereGeometry(1, 32, 24); gpe.scale(0.2, 0.14, 0.05); gpe.translate(0.12, -0.08, 0.36 * s); solid('gp', gpe);
    const gpi = new THREE.SphereGeometry(1, 28, 20); gpi.scale(0.13, 0.1, 0.035); gpi.translate(0.1, -0.1, 0.31 * s); solid('gp', gpi, { color: new THREE.Color('#d8b440').multiplyScalar(0.45) });
    const cla = new THREE.SphereGeometry(1, 28, 20); cla.scale(0.22, 0.28, 0.012); cla.translate(0.2, -0.04, 0.575 * s); solid('cla', cla, { opacity: 0.35, depthWrite: false });
    const amy = new THREE.SphereGeometry(0.085, 24, 18); amy.translate(0.16, -0.39, 0.5 * s); solid('amy', amy);
    const acc = new THREE.SphereGeometry(0.06, 20, 14); acc.translate(0.46, -0.12, 0.16 * s); solid('acc', acc);
    const th = new THREE.SphereGeometry(1, 32, 24); th.scale(0.3, 0.19, 0.13); th.translate(-0.2, -0.04, 0.14 * s); solid('thal', th, { opacity: 0.6 });   // кзади и медиальнее чечевицеобразного ядра
  });
  PART.caud.anchor = V3(0.5, 0.32, 0.28); PART.put.anchor = V3(0.42, 0.0, 0.5); PART.gp.anchor = V3(0.1, -0.2, 0.37); PART.cla.anchor = V3(0.2, 0.3, 0.58);
  PART.amy.anchor = V3(0.18, -0.44, 0.58); PART.acc.anchor = V3(0.55, -0.22, 0.12); PART.thal.anchor = V3(-0.25, 0.1, 0.16);
  // чёрная субстанция и субталамическое ядро — участники двигательной петли
  const SN = [V3(-0.05, -0.47, 0.13), V3(-0.05, -0.47, -0.13)], STN = [V3(0.0, -0.33, 0.17), V3(0.0, -0.33, -0.17)];
  const snG = SN.map((p) => glowNucleus(scene, p, '#F4C542', 0.035, 8)), stnG = STN.map((p) => glowNucleus(scene, p, '#7FD6C8', 0.03, 8));
  // форма: чёрная субстанция — вытянутый полумесяц в ножке мозга, субталамическое ядро — «линза»
  [[SN, '#F4C542', [0.12, 0.025, 0.05], 0.6], [STN, '#7FD6C8', [0.07, 0.025, 0.04], 0.4]].forEach(([P, c, sc, ry]) => P.forEach((p) => {
    const g = new THREE.SphereGeometry(1, 24, 16); g.scale(...sc); g.rotateY(ry * Math.sign(p.z)); g.translate(p.x, p.y, p.z);
    scene.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.4), emissive: c, emissiveIntensity: 0.35, roughness: 0.5, transparent: true, opacity: 0.8 })));
  }));

  /* ---------- проводящие пути ---------- */
  const tracts = new THREE.Group(); scene.add(tracts); tracts.visible = false;
  const TF = [];
  const fib = (pts, color, r = 0.008, sp = 0.35) => { const f = flowTubeMat(color, sp, 1.4); f.uniforms.uOn.value = 0.38; TF.push({ f, color }); tracts.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, r, 5), f)); };
  const surf = (x, y, s) => { const d = V3(x, y, 0.9 * s).sub(V3(0, -0.1, 0)).normalize(); let r = 0; const pos = brainKit().hemi[s > 0 ? 0 : 1].attributes.position, v = new THREE.Vector3(); let best = -1; for (let i = 0; i < pos.count; i += 2) { v.fromBufferAttribute(pos, i).add(V3(0, 0.1, 0)); const l = v.length(), c = v.dot(d) / l; if (c > best) { best = c; r = l; } } return d.multiplyScalar(r * 0.9).add(V3(0, -0.1, 0)); };
  [1, -1].forEach((s) => {
    // проекционные: лучистый венец → внутренняя капсула → ножка мозга
    for (let k = 0; k < 14; k++) { const x = -0.9 + k * 0.14, top = surf(x, 0.75 - Math.abs(x) * 0.25, s); fib([top, V3(x * 0.4, 0.25, 0.4 * s), V3(0.0, -0.1, 0.25 * s), V3(-0.02, -0.4, 0.15 * s), V3(-0.15, -0.75, 0.08 * s)], '#FF6A5A', 0.007); }
    // ассоциативные: верхний и нижний продольные пучки, крючковидный, дугообразные U-волокна
    fib([surf(1.1, 0.2, s), V3(0.6, 0.48, 0.62 * s), V3(-0.2, 0.52, 0.66 * s), V3(-0.9, 0.35, 0.6 * s), surf(-1.4, 0.15, s)], '#5CC48A', 0.014);
    fib([surf(0.75, -0.45, s), V3(0.2, -0.38, 0.75 * s), V3(-0.6, -0.25, 0.7 * s), surf(-1.35, -0.1, s)], '#5CC48A', 0.012);
    fib([surf(0.95, -0.15, s), V3(0.6, -0.2, 0.55 * s), V3(0.45, -0.32, 0.62 * s), surf(0.65, -0.5, s)], '#5CC48A', 0.01);
    for (let k = 0; k < 8; k++) { const x = -1.1 + k * 0.3, a = surf(x, 0.55, s), b = surf(x + 0.18, 0.5, s), m = a.clone().lerp(b, 0.5).multiplyScalar(0.9); fib([a, m, b], '#7FE0A0', 0.006); }
  });
  // комиссуральные: мозолистое тело, передняя комиссура
  for (let k = 0; k < 16; k++) { const x = -0.75 + k * 0.1, y = 0.36 - Math.pow(x / 0.85, 2) * 0.2; fib([surf(x, 0.8, 1), V3(x, y + 0.1, 0.45), V3(x, y, 0), V3(x, y + 0.1, -0.45), surf(x, 0.8, -1)], '#4FA3FF', 0.008); }
  fib([surf(0.6, -0.4, 1), V3(0.42, -0.14, 0.3), V3(0.42, -0.12, 0), V3(0.42, -0.14, -0.3), surf(0.6, -0.4, -1)], '#9FD0FF', 0.012);

  /* ---------- фронтальный срез (рис. 4.1) ---------- */
  const secTex = bgSectionCanvas();
  const secMat = new THREE.MeshStandardMaterial({ map: secTex, color: 0x6a6a6a, emissiveMap: secTex, emissive: 0xffffff, emissiveIntensity: 0.13, roughness: 0.75, transparent: true, side: THREE.DoubleSide, envMapIntensity: 0.2 });
  secMat.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\nif (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.03) discard;'); };
  const sec = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.9 * 900 / 1024), secMat); sec.rotation.y = Math.PI / 2; scene.add(sec); sec.visible = false;
  // строка холста H*0.45 должна совпасть с y = 0
  sec.position.set(0.151, -0.05 * 2.9 * 900 / 1024, 0);
  const cutPlane = new THREE.Plane(V3(-1, 0, 0), 0.15);

  /* ---------- двигательная петля ---------- */
  const fx = new Sparks(900, 0.07); scene.add(fx.obj);
  const M1 = surf(0.2, 0.85, 1);
  const LOOP = [
    new THREE.CatmullRomCurve3([M1, V3(0.25, 0.4, 0.45), V3(0.28, 0.05, 0.45)]),           // кора → стриатум
    new THREE.CatmullRomCurve3([V3(0.25, -0.02, 0.45), V3(0.15, -0.08, 0.36), V3(0.1, -0.1, 0.31)]), // стриатум → внутр. бледный шар (торможение)
    new THREE.CatmullRomCurve3([V3(0.1, -0.1, 0.31), V3(-0.02, -0.1, 0.26), V3(-0.12, -0.04, 0.17)]),  // бледный шар → таламус (через капсулу)
    new THREE.CatmullRomCurve3([V3(-0.12, -0.04, 0.17), V3(0.05, 0.4, 0.35), M1]),             // таламус → кора
  ];
  const DA = new THREE.CatmullRomCurve3([SN[0], V3(0.05, -0.3, 0.3), V3(0.2, -0.05, 0.45)]);
  const st = { t: 0, mode: 'bg', sel: null, labels: true, rot: true, fly: null, loopT: -9, park: false, msg: null };
  function select(id) {
    st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync();
    BG_PARTS.forEach((p) => PART[p.id].mats.forEach((m) => { m.opacity = !st.sel || st.sel === p.id ? (p.id === 'thal' ? 0.6 : p.id === 'cla' && !st.sel ? 0.35 : 0.92) : 0.12; m.emissiveIntensity = st.sel === p.id ? 0.45 : 0.06; m.depthWrite = st.sel ? st.sel === p.id : p.id !== 'cla'; }));
    st.msg = null; refs.setInfo && refs.setInfo();
  }
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null;
    tracts.visible = m === 'tracts'; sec.visible = m === 'section';
    const clipOn = m === 'section';
    [...BG_PARTS.flatMap((p) => PART[p.id].mats), shell.solid, shell.glass, ...shell.meshes.map((x) => x.material)].forEach((mm) => { mm.clippingPlanes = clipOn ? [cutPlane] : []; mm.needsUpdate = true; });
    BG_PARTS.forEach((p) => PART[p.id].mats.forEach((mm) => { mm.opacity = m === 'tracts' ? 0.18 : (p.id === 'thal' ? 0.6 : 0.92); }));
    if (m === 'section') { st.rot = false; refs.rot && refs.rot.sync(); st.fly = flyTarget(V3(0.15, -0.45, 0), V3(7.0, -0.3, 0.0)); } else st.fly = m === 'tracts' ? TRV : HOME;
    refs.setInfo && refs.setInfo();
  }
  function loop() { if (st.mode !== 'bg') setMode('bg'); st.loopT = st.t; st.msg = st.park ? TXT.park : TXT.loop; refs.setInfo(); }
  const C_EX = new THREE.Color(0xffb070), C_IN = new THREE.Color(0x6fb4ff), C_DA = new THREE.Color(0xf4c542);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    TF.forEach(({ f }) => { f.uniforms.uTime.value = t; });
    const k = t - st.loopT;
    if (k > 0 && k < 6) {
      const seg2 = Math.floor(k / 1.1), u = (k % 1.1) / 1.1;
      if (seg2 < 4) { const c = LOOP[seg2]; for (let j = 0; j < 3; j++) fx.spawn(c.getPointAt(u).add(randUnit().multiplyScalar(0.01)), V3(0, 0, 0), seg2 === 1 || seg2 === 2 ? C_IN : C_EX, 0.5, 0, st.park && seg2 > 0 ? 0.6 : 2); }
      if (!st.park && k < 2.5) fx.spawn(DA.getPointAt((k / 2.5) % 1), V3(0, 0, 0), C_DA, 0.6, 0, 2);
      const thOn = seg2 === 3 && !st.park; PART.thal.mats.forEach((m) => { m.emissiveIntensity = thOn ? 0.8 : 0.06; });
      PART.gp.mats.forEach((m) => { m.emissiveIntensity = seg2 === 1 ? 0.05 : 0.4; });
    }
    snG.forEach((g) => { g.spr.material.opacity = st.park ? 0.1 : 0.8; });
    fx.update(dt);
  }
  const TXT = {
    bg: 'The <b>basal ganglia</b> are clusters of gray matter deep in the hemispheres. About 80% of their neurons (caudate nucleus, putamen, globus pallidus), together with the cerebellum, premotor cortex, subthalamus and substantia nigra, control movement: motor learning, skills, assembling movements into a program. About 20% (nucleus accumbens and amygdala) work in the limbic system. Click a nucleus or run the motor loop.',
    tracts: '<b>The white matter of the hemispheres.</b> <b>Projection</b> fibers (red) connect the cortex with lower parts of the nervous system: all of them pass through the internal capsule. <b>Commissural</b> fibers (blue) connect the hemispheres: the corpus callosum (the “new” commissure), the anterior commissure (the “ancient” one, about 3 million fibers, olfactory areas) and the hippocampal commissure. <b>Association</b> fibers (green) connect cortical areas within a hemisphere: the superior longitudinal fasciculus links the frontal cortex with the parietal, temporal and occipital cortex, and the inferior one links the temporal with the occipital cortex.',
    section: '<b>Coronal section</b>. On the outside is the cortex with its sulci and gyri, beneath it the white matter. At the top is the corpus callosum, with the lateral ventricles below it. Medially lie the caudate nucleus and the thalamus; laterally, beyond the internal capsule, the putamen and globus pallidus; farther out, the thin claustrum and the insular cortex deep in the lateral sulcus. At the bottom are the amygdala in the temporal lobe and the hypothalamus beside the third ventricle.',
    loop: '<b>The motor loop.</b> The cortex proposes a movement → signal to the striatum (orange) → the striatum inhibits the internal globus pallidus (blue) → the globus pallidus stops inhibiting the thalamus → the thalamus “lets” the program back through to the motor cortex. Dopamine from the substantia nigra (yellow) makes this launch easier. This is how the right movement is selected from many possible ones.',
    park: '<b>The loop in Parkinson’s disease.</b> There is no dopamine: the striatum barely inhibits the globus pallidus, which keeps pressing on the thalamus, and the program hardly reaches the cortex. Movements are hard to start, and stiffness and tremor appear.',
  };
  const labels = [
    ...BG_PARTS.map((p) => ({ text: p.name, pos: PART[p.id].anchor, color: p.color, show: () => st.labels && st.mode === 'bg' && (!st.sel || st.sel === p.id) })),
    { text: 'substantia nigra', pos: SN[0].clone().add(V3(0, -0.04, 0.06)), color: '#F4C542', show: () => st.labels && st.mode === 'bg' && !st.sel },
    { text: 'projection', pos: V3(-0.3, 0.55, 0.62), color: '#FF6A5A', show: () => st.labels && st.mode === 'tracts' },
    { text: 'corpus callosum', pos: V3(0.0, 0.48, 0.05), color: '#4FA3FF', show: () => st.labels && st.mode === 'tracts' },
    { text: 'anterior commissure', pos: V3(0.45, -0.1, 0.02), color: '#9FD0FF', show: () => st.labels && st.mode === 'tracts' },
    { text: 'superior longitudinal fasciculus', pos: V3(-0.2, 0.6, 0.7), color: '#5CC48A', show: () => st.labels && st.mode === 'tracts' },
    { text: 'inferior longitudinal fasciculus', pos: V3(-0.5, -0.3, 0.78), color: '#5CC48A', show: () => st.labels && st.mode === 'tracts' },
    { text: 'internal capsule', pos: V3(0.1, -0.1, 0.3), color: '#FF8A7A', show: () => st.labels && st.mode === 'tracts' },
    ...[['caudate nucleus', 0.2, 0.2, '#5E8FEF'], ['putamen', 0.48, -0.04, '#E9785F'], ['globus pallidus', 0.36, -0.12, '#F2C14E'], ['claustrum', 0.6, 0.14, '#B8E06A'], ['insula', 0.72, -0.34, '#c8b0c0'], ['lateral sulcus', 1.1, -0.2, '#c8b0c0'], ['thalamus', 0.13, -0.1, '#B9A4FF'], ['amygdala', 0.48, -0.4, '#FF6A9A'], ['corpus callosum', 0.0, 0.44, '#efe8dc'], ['lateral ventricle', 0.12, 0.3, '#8fd4ff'], ['hypothalamus', 0.07, -0.32, '#f0b8a0'], ['cingulate cortex', 0.1, 0.6, '#E58FC4']].map(([t2, z, y, c]) => ({ text: t2, pos: V3(0.16, y, z), color: c, show: () => st.labels && st.mode === 'section' })),
  ];
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'bg') select(id); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 320px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'bg' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'bg', label: 'Basal ganglia' }, { id: 'tracts', label: 'Tracts' }, { id: 'section', label: 'Coronal section' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'All' }, ...BG_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'bg') setMode('bg'); select(v); });
    const pk = toggle('Parkinson’s', () => st.park, (v) => { st.park = v; });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { pk, lab });
    el.append(group('Mode', '1 · 2 · 3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 480px' }, h('div', { class: 'glabel' }, 'Nuclei', h('kbd', {}, 'click a nucleus')), h('div', { class: 'gctl' }, refs.seg)),
      group('Experiment', 'L · P', button('Motor loop', loop, true), pk), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === '1') { setMode('bg'); return true; } if (k === '2') { setMode('tracts'); return true; } if (k === '3') { setMode('section'); return true; }
    if (k === 'l' || k === 'д') { loop(); return true; } if (k === 'p' || k === 'з') { refs.pk.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'tracts' ? [['Anterior commissure', '≈3', 'million fibers']] : [['Motor part', '≈80', '%'], ['Limbic', '≈20', '%']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#5E8FEF',
    kicker: 'Brain · telencephalon', title: 'Hemispheres and basal ganglia',
    lede: 'Beneath the cortex lie the white matter and the nuclei of the basal ganglia. They assemble individual movements into programs and, together with the limbic system, decide what we need.',
    notes: `
      <div><h2>The telencephalon</h2>
        <p>The largest part of the brain, it covers all the others, and the longitudinal fissure divides it into two hemispheres. On the outside is the cortex with its sulci and gyri, beneath it the white matter, and deep inside the basal ganglia: the caudate nucleus, putamen, globus pallidus, claustrum and amygdala.</p>
        <h3>What the parts are called</h3>
        <p>Putamen + globus pallidus = <b>lentiform nucleus</b>. Caudate + lentiform = <b>corpus striatum</b> (the classical anatomical term). In the modern sense the <b>striatum</b> is the caudate + putamen (dorsal striatum) and the nucleus accumbens (ventral striatum); the globus pallidus is not part of it but a separate stage of the basal ganglia.</p>
        <h3>Basal ganglia and cerebellum</h3>
        <p>The cerebellum remembers how to perform a particular movement quickly and precisely (a single step in a dance). The basal ganglia assemble movements into a long program (the whole dance with its transitions between figures). In both cases synaptic plasticity is at work.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The C-shaped caudate nucleus along the lateral ventricle, with its tail near the amygdala.</li><li>The order of layers on the section: internal capsule, globus pallidus, putamen, claustrum, insula.</li><li>The three types of white matter fibers.</li><li>The scheme of the motor loop “cortex — striatum — globus pallidus — thalamus — cortex”.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>The brain is a simplified model, and the nuclei are shown as smooth bodies.</li><li>In reality there are millions of fibers; here there are dozens.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li>click a nucleus: select</li><li><code>L</code> motor loop</li><li><code>P</code> Parkinson’s</li><li><code>R</code> rotate</li><li><code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeHemis };
