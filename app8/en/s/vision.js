import { GLOW, GLTFLoader, LOOK, THREE, V3, __set_rnd, addLights, button, clamp, envTex, fetchModel, glassMat, group, h, lerp, makeControls, mulberry, rnd, seg, toggle } from '../core.js';


/* =========================================================
   ОРГАНЫ ЧУВСТВ · ЗРЕНИЕ (модель: Sergey Burov, CC BY 4.0)
   ========================================================= */
const VIS_FIELD_COL = { L: '#5ED1C4', R: '#8C93FF' };   // левое поле → правое полушарие, правое поле → левое
const VIS_LESIONS = [
  { id: 'none', label: 'None', text: 'All four fiber bundles are intact: each eye sees the whole field, and both halves of the field reach the cortex.' },
  { id: 'nerveR', label: 'Right nerve', block: { Line010_0: 0.15, Shape018_0: 0.15 }, pos: [-1.5, -0.55, 1.97], text: '<b>Right optic nerve damaged</b> (before the chiasm). The right eye goes completely blind, the left one sees the whole field. This happens with optic neuritis or nerve injury.' },
  { id: 'chiasm', label: 'Chiasm', block: { Shape017_0: 0.28, Shape018_0: 0.28 }, pos: [-0.02, -0.14, 0.94], text: '<b>Optic chiasm damaged.</b> Only the crossing fibers from the nasal halves of the retinas are cut, and they see the temporal halves of the field. Both outer halves are lost: <b>bitemporal hemianopia</b>, “blinkered vision”. The classic cause is a tumor of the pituitary, which lies right below the chiasm.' },
  { id: 'tractR', label: 'Right tract', block: { Line010_0: 0.44, Shape017_0: 0.44 }, pos: [-1.11, -0.06, -0.21], text: '<b>Right optic tract damaged</b> (after the chiasm). It carries the fibers from both eyes that serve the <b>left</b> half of the field. Both eyes lose the left half: <b>left homonymous hemianopia</b>. The same happens with a stroke in the right occipital lobe.' },
  { id: 'tractL', label: 'Left tract', block: { Line011_0: 0.44, Shape018_0: 0.44 }, pos: [1.05, -0.06, -0.21], text: '<b>Left optic tract damaged.</b> Both eyes lose the right half of the field: right homonymous hemianopia.' },
];
const VIS_EYES = [
  { id: 'norm', label: 'Normal', E: 0, Amax: 10, text: 'A healthy eye: the lens adjusts its own power, and the image of both distant and near objects falls exactly on the retina.' },
  { id: 'myo', label: 'Myopia', E: 3, Amax: 10, text: '<b>Nearsightedness (myopia):</b> the eye is too long or its optics too strong. Rays from a distant object converge <b>in front of</b> the retina: distant things look blurry, while near ones are sharp. Corrected with diverging lenses (minus).' },
  { id: 'hyp', label: 'Hyperopia', E: -3, Amax: 2, text: '<b>Farsightedness (hyperopia):</b> the eye is a bit too short, and the focus falls <b>behind</b> the retina. The lens is constantly straining, and for near objects it runs out of power. Corrected with converging lenses (plus).' },
  { id: 'presb', label: 'Age-related', E: 0, Amax: 0.6, text: '<b>Presbyopia:</b> with age the lens hardens and almost stops changing shape. Distance vision is normal, but close-up text blurs: the focus slips behind the retina. Hence reading glasses after age 40–45.' },
];

function makeVision() {
  __set_rnd(mulberry(51));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  addLights(scene, 0x7fb8ff);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 200); camera.position.set(10, 6, 11);
  const controls = makeControls(camera, V3(0, -0.4, -0.3)); controls.minDistance = 1.2; controls.maxDistance = 40;

  // модель нормирована: мир = (исходные координаты − центр) × K, перед — +z, верх — +y, правая сторона тела — −x
  const K = 48.586, C0 = V3(0.2129, 0.3555, 0.0345);
  const holder = new THREE.Group(); holder.scale.setScalar(K); holder.position.copy(C0).multiplyScalar(-K); scene.add(holder);
  const Z0 = 3.1, Z1 = -4.5;
  const FIB = { Line010_0: 'L', Shape017_0: 'L', Line011_0: 'R', Shape018_0: 'R' };
  const fibMats = {};
  function fiberMat(field) {
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(VIS_FIELD_COL[field]) }, uFront: { value: -1 }, uOn: { value: 1 }, uBlock: { value: 2 }, uZ0: { value: Z0 }, uZ1: { value: Z1 } },
      vertexShader: `varying float vZ; varying vec3 vN; varying vec3 vV;
        void main(){ vec4 w = modelMatrix*vec4(position,1.0); vZ = w.z; vec4 mv = viewMatrix*w; vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uColor; uniform float uFront,uOn,uBlock,uZ0,uZ1; varying float vZ; varying vec3 vN; varying vec3 vV;
        void main(){ float t = (uZ0 - vZ)/(uZ0 - uZ1); float alive = 1.0 - step(uBlock, t);
          float f = abs(dot(normalize(vN), normalize(vV))); float lit = 0.45 + 0.55*f;
          float wave = exp(-pow((t - uFront)/0.035, 2.0)) * alive * step(t, uBlock + 0.01);
          vec3 c = uColor*lit*(0.25 + 0.75*uOn)*mix(0.18, 1.0, alive) + vec3(1.0,0.9,0.7)*wave*uOn*1.8;
          gl_FragColor = vec4(c, 1.0); }`,
    });
  }
  const glassBrain = glassMat(0xf2c7d6, { rim: 0.55, base: 0.01, pow: 2.0 });
  const solidBrain = new THREE.MeshPhysicalMaterial({ color: 0xe0b8c6, roughness: 0.55, transparent: true, opacity: 0.06, depthWrite: false, envMapIntensity: 0.5 });
  const glassCb = glassMat(0xffc9b8, { rim: 0.7, base: 0.012, pow: 2.0 });
  const solidCb = new THREE.MeshPhysicalMaterial({ color: 0xffc9b8, roughness: 0.55, transparent: true, opacity: 0.1, depthWrite: false, envMapIntensity: 0.5 });   // мозжечок отличим от полушарий
  const glassStem = glassMat(0xb9a4ff, { rim: 0.4, base: 0.01, pow: 1.8 });
  const boneMat = new THREE.MeshPhysicalMaterial({ color: 0xd9c7a6, roughness: 0.62, clearcoat: 0.15, sheen: 0.3, sheenColor: new THREE.Color(0xfff0d8), envMapIntensity: 0.6, side: THREE.DoubleSide });
  const v1Mat = { L: null, R: null };
  ['L', 'R'].forEach((f) => { v1Mat[f] = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(VIS_FIELD_COL[f]).multiplyScalar(0.35), roughness: 0.5, clearcoat: 0.3, emissive: new THREE.Color(VIS_FIELD_COL[f]), emissiveIntensity: 0.08, transparent: true, opacity: 0.55, depthWrite: false }); });   // не закрывают концы лучистости
  const parts = {};
  const st = { mode: 'path', field: 'both', lesion: 'none', eye: 'norm', near: 0, labels: true, auto: true, t: 0, front: -1, next: 0.6, loaded: false, err: null, fly: 1, cortexT: { L: -9, R: -9 } };

  // свой хрусталик для правого (разрезанного) глаза: меняет толщину при аккомодации
  const LENS_C = V3(-1.75, -0.5, 4.0), CUT = new THREE.Plane(V3(1, 0, 0), 1.79);
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xcfe6ff, roughness: 0.08, transmission: 0, transparent: true, opacity: 0.55, clearcoat: 1, emissive: 0x2a4a6a, emissiveIntensity: 0.4, clippingPlanes: [CUT], side: THREE.DoubleSide });
  const lens = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), lensMat); lens.position.copy(LENS_C); lens.scale.set(0.19, 0.19, 0.1); lens.visible = false; scene.add(lens);

  const loader = new GLTFLoader();
  const onFail = (e) => { st.err = String(e && e.message || e); refs.setInfo && refs.setInfo(); };
  // модель лежит рядом со страницей в сжатом виде (models/)
  fetchModel('vision').then((buf) => { loader.parse(buf, '', onModel, onFail); })
    .catch(onFail);
  function onModel(g) {
    holder.add(g.scene);
    g.scene.traverse((o) => {
      if (!o.isMesh) return; parts[o.name] = o;
      const m = o.material; if (m && m.isMeshStandardMaterial) { m.envMapIntensity = 0.7; }
      if (FIB[o.name]) { const fm = fiberMat(FIB[o.name]); fibMats[o.name] = fm; o.material = fm; }
    });
    const set = (n, mat) => { if (parts[n]) parts[n].material = mat; };
    if (parts.Group2_0) { set('Group2_0', glassBrain); const s2 = parts.Group2_0.clone(); s2.material = solidBrain; parts.Group2_0.parent.add(s2); parts.Group2s = s2; }
    set('Group3_0', glassCb); set('Group5_0', glassStem); set('Group1_0', boneMat);
    if (parts.Group3_0) { const c2 = parts.Group3_0.clone(); c2.material = solidCb; parts.Group3_0.parent.add(c2); }
    if (parts.Group1_0) {   // подпись «глазница» — на ближайшую точку кости
      holder.updateMatrixWorld(true); const lb = labels.find((l) => l.text === 'orbit'), o = parts.Group1_0, pa = o.geometry.attributes.position, v = new THREE.Vector3(), best = new THREE.Vector3(); let bd = 1e9;
      for (let i = 0; i < pa.count; i += 3) { v.fromBufferAttribute(pa, i).applyMatrix4(o.matrixWorld); const d = v.distanceToSquared(lb.pos); if (d < bd) { bd = d; best.copy(v); } }
      if (bd < 1e8) lb.pos.copy(best);
    }
    set('Group8_0', v1Mat.L); set('Group9_0', v1Mat.R);
    ['all1_hrustalik003_0', 'all1_hrustalik004_0'].forEach((n) => { if (parts[n]) parts[n].visible = false; });
    lens.visible = true;
    st.loaded = true; applyLesion(); refs.setInfo && refs.setInfo();
  }

  /* ---------- повреждения ---------- */
  const lesionSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xff3a2a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  lesionSpr.scale.setScalar(1.1); lesionSpr.visible = false; scene.add(lesionSpr);
  const LES = Object.fromEntries(VIS_LESIONS.map((l) => [l.id, l]));
  function applyLesion() {
    const L = LES[st.lesion];
    Object.entries(fibMats).forEach(([n, m]) => { m.uniforms.uBlock.value = L.block && L.block[n] != null ? L.block[n] : 2; });
    lesionSpr.visible = !!L.pos && st.mode === 'path'; if (L.pos) lesionSpr.position.set(...L.pos);
  }
  // какая половина поля какого глаза каким пучком несётся
  const HALF = { eyeL: { L: 'Shape017_0', R: 'Line011_0' }, eyeR: { L: 'Line010_0', R: 'Shape018_0' } };
  const blind = (fib) => !!(LES[st.lesion].block && LES[st.lesion].block[fib] != null);

  /* ---------- оптика глаза ---------- */
  const EYE = Object.fromEntries(VIS_EYES.map((e) => [e.id, e]));
  const RETINA_Z = 3.2, CORNEA_Z = 4.32, RAY_X = -1.83, AXIS_Y = -0.5;
  const rayPos = new Float32Array(5 * 4 * 3), rayGeo = new THREE.BufferGeometry(); rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPos, 3));
  const rays = new THREE.LineSegments(rayGeo, new THREE.LineBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.95 })); rays.frustumCulled = false; scene.add(rays);
  const arrowGeo = new THREE.BufferGeometry(); arrowGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
  const arrow = new THREE.LineSegments(arrowGeo, new THREE.LineBasicMaterial({ color: 0xffffff })); arrow.frustumCulled = false; scene.add(arrow);
  const spot = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffd27a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); scene.add(spot);
  const optics = { dist: 6, A: 0, err: 0 };
  function updateOptics() {
    const e = EYE[st.eye], dist = lerp(6, 0.25, st.near), demand = 1 / dist;
    const A = clamp(demand - e.E, 0, e.Amax), err = e.E + A - demand;
    Object.assign(optics, { dist, A, err });
    lens.scale.set(0.19, 0.19, 0.1 * (1 + 0.045 * A));
    const zObj = CORNEA_Z + lerp(5.2, 1.6, st.near), hObj = 0.42, tip = V3(RAY_X, AXIS_Y + hObj, zObj);
    const zImg = RETINA_Z + clamp(err, -6, 6) * 0.07, img = V3(RAY_X, AXIS_Y - hObj * 0.42 * (0.9 / (zObj - CORNEA_Z + 0.9)), zImg);
    let k = 0; const ends = [];
    [-0.26, -0.13, 0, 0.13, 0.26].forEach((a) => {
      const p1 = V3(RAY_X, AXIS_Y + a, CORNEA_Z - 0.04 * (a * a) / 0.07), d = img.clone().sub(p1), tt = (RETINA_Z - p1.z) / d.z, end = p1.clone().addScaledVector(d, tt);
      rayPos.set([tip.x, tip.y, tip.z, p1.x, p1.y, p1.z, p1.x, p1.y, p1.z, end.x, end.y, end.z], k); k += 12; ends.push(end);
    });
    rayGeo.attributes.position.needsUpdate = true;
    arrowGeo.attributes.position.array.set([RAY_X, AXIS_Y, zObj, RAY_X, AXIS_Y + hObj, zObj, RAY_X, AXIS_Y + hObj, zObj, RAY_X - 0.0, AXIS_Y + hObj - 0.1, zObj + 0.08, RAY_X, AXIS_Y + hObj, zObj, RAY_X, AXIS_Y + hObj - 0.1, zObj - 0.08]);
    arrowGeo.attributes.position.needsUpdate = true;
    const spread = Math.abs(ends[0].y - ends[4].y);
    spot.position.set(RAY_X - 0.01, ends[2].y, RETINA_Z); spot.scale.setScalar(0.12 + spread * 1.2);
  }

  /* ---------- камера ---------- */
  const VIEWS = { path: { pos: V3(10, 6, 11), tgt: V3(0, -0.4, -0.3) }, eye: { pos: V3(-6.4, 0.2, 3.9), tgt: V3(-1.8, -0.5, 3.75) } };
  function setMode(m) {
    st.mode = m; st.fly = 1;
    const eyeMode = m === 'eye';
    ['Group1_0'].forEach((n) => { if (parts[n]) parts[n].visible = !eyeMode; });
    rays.visible = arrow.visible = spot.visible = eyeMode;
    glassBrain.uniforms.uGain.value = eyeMode ? 0.12 : 0.35 + 0.65 * LOOK.shell;
    applyLesion(); if (refs.rebuild) refs.rebuild();
  }

  function fire() { st.front = -0.05; }
  function update(dt) {
    st.t += dt;
    if (st.fly > 0) { const v = VIEWS[st.mode], k = 1 - Math.exp(-dt * 2.4); camera.position.lerp(v.pos, k); controls.target.lerp(v.tgt, k); if (camera.position.distanceTo(v.pos) < 0.04) st.fly = 0; }
    if (st.mode === 'path') {
      if (st.auto && st.t > st.next) { fire(); st.next = st.t + 3.2; }
      if (st.front < 1.3) st.front += dt * 0.5;
      Object.entries(fibMats).forEach(([n, m]) => {
        const f = FIB[n], on = st.field === 'both' || (st.field === 'left' && f === 'L') || (st.field === 'right' && f === 'R');
        m.uniforms.uFront.value = st.front; m.uniforms.uOn.value = on ? 1 : 0.12;
        if (on && !blind(n) && st.front > 0.97 && st.front < 1.0) st.cortexT[f] = st.t;
      });
      ['L', 'R'].forEach((f) => { v1Mat[f].emissiveIntensity = 0.08 + 2.2 * Math.exp(-(st.t - st.cortexT[f]) / 0.35); });
    } else {
      Object.values(fibMats).forEach((m) => { m.uniforms.uFront.value = -1; m.uniforms.uOn.value = 0.35; });
      updateOptics();
    }
  }

  /* ---------- мини-панель: поля зрения или «что видит глаз» ---------- */
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); ctx.font = '500 10px JetBrains Mono, monospace'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    if (st.mode === 'path') {
      const r = Math.min(hgt * 0.34, w * 0.16), cy = hgt * 0.46;
      [['eyeL', 'left eye', w * 0.28], ['eyeR', 'right eye', w * 0.72]].forEach(([eye, name, cx]) => {
        ['L', 'R'].forEach((half) => {
          const fib = HALF[eye][half], off = blind(fib), dim = st.field !== 'both' && ((st.field === 'left') !== (half === 'L'));
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, half === 'L' ? Math.PI / 2 : -Math.PI / 2, half === 'L' ? Math.PI * 1.5 : Math.PI / 2); ctx.closePath();
          ctx.fillStyle = off ? '#0b0a0d' : VIS_FIELD_COL[half]; ctx.globalAlpha = off ? 1 : dim ? 0.25 : 0.85; ctx.fill(); ctx.globalAlpha = 1;
        });
        ctx.strokeStyle = '#3A3540'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
        ctx.fillStyle = '#A49DA8'; ctx.fillText(name, cx, hgt - 9);
      });
      ctx.fillStyle = '#6F6875'; ctx.textAlign = 'left'; ctx.fillText('visual field', 8, 10);
    } else {
      const blur = Math.min(8, Math.abs(optics.err) * 2.4);
      ctx.save(); ctx.fillStyle = '#efeae6'; ctx.fillRect(8, 8, w - 16, hgt - 16);
      ctx.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none'; ctx.fillStyle = '#111';
      const near = st.near > 0.5;
      ctx.font = `700 ${near ? 18 : 30}px Golos Text, system-ui, sans-serif`; ctx.fillText(near ? 'E F P T O' : 'E F', w / 2, hgt * 0.4);
      ctx.font = `600 ${near ? 11 : 16}px Golos Text, system-ui, sans-serif`; ctx.fillText(near ? 'small print up close' : 'P T O', w / 2, hgt * 0.68);
      ctx.restore(); ctx.fillStyle = '#6F6875'; ctx.textAlign = 'left'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText('what the eye sees', 12, 16);
    }
  }

  /* ---------- подписи ---------- */
  const lp = (text, p, mode, color) => ({ text, pos: V3(...p), color, show: () => st.labels && (mode === 'any' || st.mode === mode) && (st.loaded || mode === 'any') });
  const labels = [
    lp('eye', [-1.7, 0.15, 4.3], 'path'), lp('optic nerve', [-1.55, -0.95, 1.97], 'path'), lp('optic chiasm', [0.05, -0.55, 0.94], 'path'),
    lp('optic tract', [-1.25, -0.45, -0.21], 'path'), lp('lateral geniculate body', [-1.45, 0.35, -0.85], 'path'), lp('optic radiation', [-1.95, 1.45, -1.67], 'path'),
    lp('right-hemisphere V1', [-1.4, 1.5, -4.3], 'path', VIS_FIELD_COL.L), lp('left-hemisphere V1', [1.4, 1.5, -4.3], 'path', VIS_FIELD_COL.R),
    lp('eye muscles', [1.66, 0.25, 3.0], 'path'), lp('cerebellum', [0.1, -2.6, -2.4], 'path'), lp('orbit', [2.9, -0.2, 4.6], 'path'),
    lp('cornea', [-1.85, 0.0, 4.36], 'eye'), lp('lens', [-1.85, -0.25, 4.02], 'eye'), lp('vitreous body', [-1.85, -0.15, 3.55], 'eye'),
    lp('retina', [-1.85, -0.95, 3.25], 'eye'), lp('optic nerve', [-1.85, -0.55, 2.75], 'eye'), lp('object', [RAY_X, AXIS_Y + 0.6, 7.0], 'eye'),
  ];
  const lesLabel = { text: 'lesion', pos: V3(0, 0, 0), color: '#ff6a5a', show: () => st.labels && st.mode === 'path' && st.lesion !== 'none' };
  labels.push(lesLabel);

  let refs = {}, consoleRoot = null;
  function ui(el) {
    consoleRoot = el; el.innerHTML = '';
    const info = h('div', { class: 'info' });
    refs.setInfo = () => {
      if (st.err) { info.innerHTML = `Could not load the 3D model (${st.err}). Please reload the page.`; return; }
      if (!st.loaded) { info.innerHTML = 'Loading the 3D model of the visual system (about 12 MB)…'; return; }
      info.innerHTML = st.mode === 'path' ? LES[st.lesion].text + (st.lesion === 'none' ? ' Choose a lesion and look at the visual field diagram on the right.' : '') : EYE[st.eye].text;
    };
    const modeSeg = seg([{ id: 'path', label: 'Signal pathway' }, { id: 'eye', label: 'Eye in section' }], () => st.mode, (v) => setMode(v));
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    const groups = [group('View', 'V · N', modeSeg, lab)];
    if (st.mode === 'path') {
      const fSeg = seg([{ id: 'both', label: 'Whole field' }, { id: 'left', label: 'Left', color: VIS_FIELD_COL.L }, { id: 'right', label: 'Right', color: VIS_FIELD_COL.R }], () => st.field, (v) => { st.field = v; });
      const lSeg = seg(VIS_LESIONS.map((l) => ({ id: l.id, label: l.label })), () => st.lesion, (v) => { st.lesion = v; applyLesion(); refs.setInfo(); });
      const auto = toggle('Auto', () => st.auto, (v) => { st.auto = v; });
      groups.push(group('Visual field', 'F', fSeg), group('Lesion', '1–5', lSeg), group('Signal', 'Space', button('Light', fire, true), auto));
      refs.lSeg = lSeg; refs.fSeg = fSeg;
    } else {
      const eSeg = seg(VIS_EYES.map((e) => ({ id: e.id, label: e.label })), () => st.eye, (v) => { st.eye = v; refs.setInfo(); });
      const inp = h('input', { type: 'range', id: 'vis-near', min: 0, max: 1, step: 0.01, value: st.near, 'aria-label': 'Distance to object' });
      const out = h('output', { for: 'vis-near' }, '');
      const fmt = () => { out.textContent = optics.dist >= 1 ? `${optics.dist.toFixed(1)} m` : `${Math.round(optics.dist * 100)} cm`; };
      inp.addEventListener('input', () => { st.near = +inp.value; updateOptics(); fmt(); });
      updateOptics(); fmt();
      groups.push(group('Eye', 'E', eSeg), group('Object', '← →', h('div', { class: 'rng' }, inp, out)));
      refs.eSeg = eSeg; refs.inp = inp; refs.fmt = fmt;
    }
    el.append(...groups, h('div', { class: 'grp', style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'What is happening'), info));
    refs.modeSeg = modeSeg; refs.lab = lab; refs.setInfo();
  }
  refs.rebuild = () => { if (consoleRoot) ui(consoleRoot); };
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === 'v' || k === 'м') { setMode(st.mode === 'path' ? 'eye' : 'path'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (st.mode === 'path') {
      if (e.code === 'Space') { fire(); return true; }
      const n = parseInt(e.key, 10); if (n >= 1 && n <= 5) { st.lesion = VIS_LESIONS[n - 1].id; applyLesion(); refs.lSeg.sync(); refs.setInfo(); return true; }
      if (k === 'f' || k === 'а') { const o = ['both', 'left', 'right']; st.field = o[(o.indexOf(st.field) + 1) % 3]; refs.fSeg.sync(); return true; }
    } else {
      if (k === 'e' || k === 'у') { const o = VIS_EYES.map((x) => x.id); st.eye = o[(o.indexOf(st.eye) + 1) % o.length]; refs.eSeg.sync(); refs.setInfo(); return true; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { st.near = clamp(st.near + (e.key === 'ArrowRight' ? 0.1 : -0.1), 0, 1); refs.inp.value = st.near; updateOptics(); refs.fmt(); return true; }
    }
    return false;
  }
  function stats() {
    if (st.mode === 'path') {
      const lost = ['eyeL', 'eyeR'].reduce((a, eye) => a + ['L', 'R'].filter((hf) => blind(HALF[eye][hf])).length, 0);
      return [['Fiber bundles', 4, ''], ['Visual field', lost ? `−${lost * 25}%` : 'intact', '']];
    }
    const e = optics.err, where = Math.abs(e) < 0.25 ? 'on the retina' : e > 0 ? 'in front of the retina' : 'behind the retina';
    return [['Lens', `+${(19 + optics.A).toFixed(1)}`, 'D'], ['Focus', where, '']];
  }
  const lesUpd = update;
  const self = {
    scene, camera, controls, ui, onKey, stats, labels, drawScope, accent: '#7FB8FF',
    update(dt) { lesUpd(dt); const L = LES[st.lesion]; if (L.pos) { const o = st.lesion === 'chiasm' ? [0.45, -0.35, 0.2] : [0.3, 0.45, 0]; lesLabel.pos.set(L.pos[0] + o[0], L.pos[1] + o[1], L.pos[2] + o[2]); } lesionSpr.material.opacity = 0.7 + 0.3 * Math.sin(st.t * 5); },
    kicker: 'Sense organs · vision', title: 'Vision',
    lede: 'The signal pathway from the retina to the occipital cortex, and the optics of the eye. Choose a lesion and see which part of the visual field disappears.',
    notes: `
      <div><h2>How vision works</h2>
        <p><b>Optics.</b> Light is refracted by the cornea (about 43 diopters) and the lens (about 19 at rest). The retina receives a reduced, inverted image. To look at something close, the ciliary muscle slackens the zonular fibers and the lens becomes more convex: this is <b>accommodation</b>.</p>
        <p><b>Retina.</b> About 120 million rods (twilight vision) and about 6 million cones (color and detail). Retinal neurons compress their signals, and roughly 1 million optic nerve fibers carry them to the brain.</p>
        <h3>The chiasm</h3>
        <p>In the chiasm, fibers from the nasal halves of the retinas cross to the opposite side, while fibers from the temporal halves continue straight on. That is why the right hemisphere receives the <b>left half of the visual field</b> from both eyes, and the left hemisphere receives the right half. The colors show it: turquoise fibers carry the left field, lilac fibers the right.</p>
        <h3>Further on</h3>
        <p>The optic tract ends in the <b>lateral geniculate body</b> of the thalamus. From there the <b>optic radiation</b> curves around the lateral ventricle and reaches the primary visual cortex (V1) of the occipital lobe, along the banks of the calcarine sulcus. Every point of the visual field has its own place in the cortex.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The course of the four fiber bundles and the visual field defects caused by damage to the optic nerve, chiasm and tract.</li>
        <li>The direction of the focusing error in myopia, hyperopia and presbyopia.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>Rays inside the eye are drawn schematically, without an exact calculation of refraction.</li><li>The position of the geniculate body is labeled approximately.</li><li>The signal wave is greatly slowed down.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>V</code> signal pathway / eye</li><li><code>space</code> light</li><li><code>1</code>–<code>5</code> lesion</li><li><code>F</code> visual field</li><li><code>E</code> eye type</li><li><code>←</code> <code>→</code> distance</li><li><code>N</code> labels</li></ul></div>`,
  };
  setMode('path');
  return self;
}
export { makeVision };
