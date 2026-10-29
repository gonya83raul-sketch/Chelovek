import { THREE, V3, __set_rnd, accentSet, brainKit, brainShell, envTex, flowTubeMat, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, pickOn, rand, rnd, seg, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 2 · 12 ПАР ЧЕРЕПНЫХ НЕРВОВ (рис. 2.8)
   ========================================================= */
const CN_TYPES = {
  sens: { name: 'Sensory', color: '#4FA3FF' },
  mot: { name: 'Motor', color: '#FF6A5A' },
  motp: { name: 'Motor + parasympathetic', color: '#FFA040' },
  mix: { name: 'Mixed', color: '#C77DFF' },
};
const CN = [
  { n: 'I', name: 'Olfactory', type: 'sens', target: 'nose', text: '<b>I — olfactory nerve.</b> About 20 fiber bundles (the olfactory filaments) rise from the nasal cavity through the ethmoid bone into the olfactory bulb. It enters the telencephalon directly: the only route into the cortex that bypasses the thalamus.' },
  { n: 'II', name: 'Optic', type: 'sens', target: 'eye', text: '<b>II — the optic nerve</b> runs from the retina to the diencephalon and forms a crossing, the chiasm. By origin it is, like the olfactory nerve, a CNS tract rather than a true nerve.' },
  { n: 'III', name: 'Oculomotor', type: 'motp', target: 'eye muscles, pupil', text: '<b>III — the oculomotor nerve</b> emerges from the underside of the midbrain. It controls four of the six eye muscles. Its parasympathetic fibers constrict the pupil and change the shape of the lens, bringing the image into focus.' },
  { n: 'IV', name: 'Trochlear', type: 'mot', target: 'superior oblique muscle', text: '<b>IV — the trochlear nerve</b> is the only one that leaves the dorsal side of the brainstem (from below the inferior colliculi) and wraps around it from the side. It controls a single eye muscle.' },
  { n: 'V', name: 'Trigeminal', type: 'mix', target: 'facial skin, muscles of mastication', text: '<b>V — the trigeminal nerve</b> is the largest. Its three branches, ophthalmic, maxillary and mandibular, converge on a large ganglion near the pons, the counterpart of a spinal ganglion. It collects pain, skin and muscle sensation from the head and controls the muscles of mastication.' },
  { n: 'VI', name: 'Abducens', type: 'mot', target: 'lateral rectus muscle', text: '<b>VI — the abducens nerve</b> emerges at the border of the pons and the medulla. It turns the eye outward: horizontal movement.' },
  { n: 'VII', name: 'Facial', type: 'mix', target: 'facial expression muscles, salivary and lacrimal glands', text: '<b>VII — the facial nerve</b> controls facial expression and the lacrimal and salivary glands, and carries taste from the front of the tongue. In fish it is linked to the lateral line, from which the inner ear arose in evolution.' },
  { n: 'VIII', name: 'Vestibulocochlear', type: 'sens', target: 'inner ear', text: '<b>VIII — the vestibulocochlear nerve</b> emerges together with the facial nerve. In humans it is purely sensory: hearing from the cochlea and balance from the vestibule.' },
  { n: 'IX', name: 'Glossopharyngeal', type: 'mix', target: 'tongue, pharynx, parotid gland', text: '<b>IX — the glossopharyngeal nerve</b>: taste from the back of the tongue, the pharyngeal muscles and swallowing, the parotid salivary gland (parasympathetic).' },
  { n: 'X', name: 'Vagus', type: 'mix', target: 'heart, lungs, GI tract', text: '<b>X — the vagus nerve</b> is the body’s main parasympathetic nerve. It supplies the organs of the chest and abdomen, receives information from them, and controls the upper esophagus and the vocal cords.' },
  { n: 'XI', name: 'Accessory', type: 'mot', target: 'trapezius and sternocleidomastoid muscles', text: '<b>XI — the accessory nerve</b> becomes a separate nerve in amniotes (reptiles, birds, mammals). It is purely motor; some of its roots come from the spinal cord. It works with the muscles of the shoulder girdle and neck: it turns the head.' },
  { n: 'XII', name: 'Hypoglossal', type: 'mot', target: 'tongue muscles', text: '<b>XII — the hypoglossal nerve</b> emerges from the medulla between the pyramid and the olive. It arose in reptiles from the fusion of branches of spinal nerves. It controls the muscles of the tongue.' },
];

function makeCranial() {
  __set_rnd(mulberry(404));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0xc77dff);
  const HOME = flyTarget(V3(0.25, -1.05, 0), V3(7.17, -5.52, 2.18));   /* мозг ниже — верх не у кромки карточки */
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(HOME.pos);
  const controls = makeControls(camera, HOME.target); controls.minDistance = 1.2; controls.maxDistance = 14;
  const shell = brainShell(scene, { opacity: 0.24, rim: 0.3, stem: false, color: 0xb89aa6 });
  const mat = (c, o = {}) => tissue(new THREE.Color(c).multiplyScalar(0.4), o);

  /* ---------- нижняя поверхность ствола ---------- */
  const stemMat = mat(0xd8b8c4, { roughness: 0.5 });
  const sArr = [];
  sArr.push(brainKit().stem.clone());
  [1, -1].forEach((s) => { // ножки мозга
    const c = new THREE.CatmullRomCurve3([V3(0.2, -0.38, 0.18 * s), V3(0.08, -0.6, 0.12 * s), V3(-0.06, -0.8, 0.08 * s)]); sArr.push(taperTube(c, () => 0.085, 24, 14));
    const mm = new THREE.SphereGeometry(0.035, 14, 10); mm.translate(0.2, -0.5, 0.045 * s); sArr.push(mm);   // сосцевидные тела
  });
  // мост с поперечной исчерченностью и средние мозжечковые ножки, уходящие в мозжечок
  { [1, -1].forEach((s) => sArr.push(taperTube(new THREE.CatmullRomCurve3([V3(-0.05, -0.95, 0.24 * s), V3(-0.35, -0.95, 0.45 * s), V3(-0.72, -0.92, 0.56 * s)]), (u) => 0.13 - 0.03 * u, 24, 16))); }
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
  const eye = (s) => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 28, 20), mat(0xf4f0ea, { roughness: 0.2, clearcoat: 1, emissive: 0x403a36, emissiveIntensity: 0.6 }))); const ir = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), new THREE.MeshPhysicalMaterial({ color: 0x3a6a8a, roughness: 0.3 })); ir.position.x = 0.171; ir.rotation.y = Math.PI / 2; g.add(ir); const pu = new THREE.Mesh(new THREE.CircleGeometry(0.035, 20), new THREE.MeshBasicMaterial({ color: 0x050505 })); pu.position.x = 0.172; pu.rotation.y = Math.PI / 2; g.add(pu); g.position.set(1.6, -0.38, 0.5 * s); scene.add(g); return g; };
  T.eye = [eye(1), eye(-1)];
  const icon = (geo, c, p) => { const m = new THREE.Mesh(geo, mat(c, { roughness: 0.35 })); m.position.copy(p); scene.add(m); return m; };
  T.nose = icon(new THREE.ConeGeometry(0.1, 0.28, 16).rotateZ(-Math.PI / 2 - 0.4), 0xd8a08c, V3(1.55, -1.0, 0));
  T.tongue = icon(new THREE.SphereGeometry(1, 32, 20).scale(0.3, 0.09, 0.17), 0xe07a88, V3(1.25, -1.65, 0));
  T.ear = [1, -1].map((s) => { const g = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.022, 8, 24, Math.PI * 3.2), mat(0xe8c890)); g.position.set(-0.15, -1.1, 0.78 * s); g.rotation.y = Math.PI / 2; scene.add(g); return g; });
  T.heart = icon(new THREE.SphereGeometry(0.12, 24, 18).scale(1, 1.1, 0.9), 0xd04a50, V3(0.25, -3.22, 0.1));
  // кишка — петли трубки; трапециевидная мышца — веретено вдоль плеча
  T.gut = icon(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(-0.22, 0.1, 0), V3(-0.12, 0.16, 0.05), V3(-0.02, 0.06, 0), V3(0.08, -0.04, -0.05), V3(0.18, 0.04, 0), V3(0.2, 0.14, 0.05), V3(0.1, 0.18, 0), V3(0.0, -0.08, 0), V3(-0.1, -0.16, 0.05), V3(-0.2, -0.1, 0), V3(-0.12, 0.0, -0.05), V3(0.06, -0.16, 0), V3(0.2, -0.14, 0.04)]), 120, 0.035, 10), 0xd08a70, V3(0.15, -3.75, -0.1));
  T.trap = [1, -1].map((s) => { const m = icon(new THREE.CapsuleGeometry(0.07, 0.5, 6, 14), 0xd05a50, V3(-0.65, -2.45, 0.95 * s)); m.quaternion.setFromUnitVectors(V3(0, 1, 0), V3(0, -0.45, s).normalize()); return m; });

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
    IX: (s) => [[P(-0.3, -1.3, 0.17 * s), P(-0.15, -1.45, 0.35 * s), P(0.4, -1.62, 0.25 * s), P(1.0, -1.6, 0.1 * s)]],   // к задней трети языка
    X: (s) => [[P(-0.33, -1.38, 0.17 * s), P(-0.25, -1.6, 0.35 * s), P(-0.05, -2.2, 0.3 * s), P(0.15, -2.8, 0.2 * s), P(0.25, -3.12, 0.12 * s)]],
    XI: (s) => [[P(-0.47, -1.95, 0.12 * s), P(-0.4, -1.55, 0.2 * s), P(-0.35, -1.48, 0.3 * s), P(-0.45, -2.0, 0.65 * s), P(-0.62, -2.35, 0.9 * s)]],
    XII: (s) => [[P(-0.22, -1.36, 0.08 * s), P(0.1, -1.5, 0.15 * s), P(0.6, -1.62, 0.1 * s), P(1.3, -1.66, 0.05 * s)]],   // в мышцы языка
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
      if (bi === 0) nv['p' + s] = c.getPointAt(nv.n === 'VIII' ? 0.5 : nv.type === 'sens' ? 0.05 : 0.45);
    }));
    if (nv.n === 'V') [1, -1].forEach((s) => { const gg = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12).scale(0.08, 0.05, 0.06), m); gg.position.set(0.12, -0.95, 0.42 * s); gg.userData.pick = idx; grp.add(gg); meshes.push(gg); });
    if (nv.n === 'I') [1, -1].forEach((s) => { for (let k = 0; k < 6; k++) { const a = P(1.22 + rand(-0.06, 0.06), -0.66, (0.1 + rand(-0.03, 0.03)) * s), b = P(1.32 + rand(-0.05, 0.05), -0.9, (0.07 + rand(-0.03, 0.03)) * s); grp.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, b]), 4, 0.005, 4), m)); } });
    nerves.push({ ...nv, m, flows, grp, meshes, col });
  });

  const st = { t: 0, sel: null, type: 'all', labels: true, rot: false, fly: null };
  const CN_ICONS = { I: ['nose'], II: ['eye'], III: ['eye'], IV: ['eye'], V: ['eye', 'tongue'], VI: ['eye'], VII: ['tongue'], VIII: ['ear'], IX: ['tongue'], X: ['heart', 'gut'], XI: ['trap'], XII: ['tongue'] };
  function apply() {
    nerves.forEach((nv, i) => {
      const on = (st.sel === null || st.sel === i) && (st.type === 'all' || nv.type === st.type);
      if (nv.m.transparent === on) nv.m.needsUpdate = true; nv.m.opacity = on ? 1 : 0.1; nv.m.transparent = !on; nv.m.depthWrite = on; nv.m.emissiveIntensity = st.sel === i ? 0.9 : on ? 0.3 : 0.05;
      nv.flows.forEach((f) => { f.uniforms.uOn.value = st.sel === i ? 1.2 : on && st.type !== 'all' ? 0.6 : 0; });
    });
    const want = new Set(st.sel === null ? ['eye', 'nose'] : CN_ICONS[nerves[st.sel].n] || []);
    Object.entries(T).forEach(([k, o]) => [].concat(o).forEach((m) => { m.visible = want.has(k); }));
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
    ...nerves.map((nv, i) => ({ text: nv.n, pos: nv.p1.clone().add(V3(0, -0.04, i % 2 ? 0.14 : 0.0)), color: CN_TYPES[nv.type].color, show: () => st.labels && (st.sel === null || st.sel === i) && (st.type === 'all' || st.type === nv.type) })),
    { text: 'pons', pos: V3(0.16, -1.0, 0.0), show: () => st.labels && st.sel === null },
    { text: 'medulla oblongata', pos: V3(-0.2, -1.55, 0.05), show: () => st.labels && st.sel === null },
    { text: 'olives and pyramids', pos: V3(-0.13, -1.33, 0.14), show: () => st.labels && st.sel === null },
    { text: 'chiasm', pos: CHI.clone().add(V3(0.02, -0.05, 0)), color: '#e8e0d0', show: () => st.labels && st.sel === null },
    { text: 'pituitary gland', pos: V3(0.42, -0.86, 0), color: '#e8b090', show: () => st.labels && st.sel === null },
    { text: 'olfactory bulb', pos: V3(1.32, -0.58, -0.22), color: '#e8d8c0', show: () => st.labels && st.sel === null },
    ...nerves.map((nv, i) => ({ text: nv.target, pos: (ROUTES[nv.n](1)[0][nv.type === 'sens' ? 0 : ROUTES[nv.n](1)[0].length - 1]).clone().add(V3(0.05, -0.07, 0.05)), color: '#D2CBD0', show: () => st.labels && st.sel === i })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 300px');
    refs.setInfo = () => { ib.info.innerHTML = st.sel !== null ? nerves[st.sel].text : st.type !== 'all' ? `<b>${CN_TYPES[st.type].name}:</b> ` + nerves.filter((n) => n.type === st.type).map((n) => n.n + ' ' + n.name.toLowerCase()).join(', ') + '. The bright waves show the direction of the signal: toward the brain in sensory nerves, away from the brain in motor nerves.' : 'The underside of the brain. The spinal cord has 31 pairs of identical nerves, while the brain has 12 pairs of unique ones, each with its own name and functions. Click a nerve or choose its number.'; };
    refs.seg = seg([{ id: 'all', label: 'All' }, ...nerves.map((nv, i) => ({ id: i, label: nv.n, color: CN_TYPES[nv.type].color }))], () => (st.sel === null ? 'all' : st.sel), (v) => select(v));
    refs.tseg = seg([{ id: 'all', label: 'All types' }, ...Object.entries(CN_TYPES).map(([k, v]) => ({ id: k, label: v.name, color: v.color }))], () => st.type, (v) => { st.type = v; st.sel = null; apply(); refs.seg.sync(); refs.setInfo(); });
    const rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { rot, lab });
    el.append(h('div', { class: 'grp', style: 'flex:1 1 520px' }, h('div', { class: 'glabel' }, 'Nerve', h('kbd', {}, 'click a nerve · ← →')), h('div', { class: 'gctl' }, refs.seg), h('div', { class: 'gctl' }, refs.tseg)), group('View', 'R · N', rot, lab), ib.el);
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
  function stats() { if (st.sel !== null) { const nv = nerves[st.sel]; return [['Pair', nv.n, ''], ['Type', CN_TYPES[nv.type].name.split(' ')[0], '']]; } return [['Pairs', 12, ''], ['Sensory', 3, ''], ['Mixed', 4, '']]; }
  apply();
  const self = {
    labelBg: true, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return st.sel !== null ? CN_TYPES[nerves[st.sel].type].color : '#C77DFF'; },
    kicker: 'Brain · cranial nerves', title: 'Cranial nerves',
    lede: 'Twelve pairs of nerves of the brain. Each is unique: some only sense, others only control muscles, still others do both.',
    notes: `
      <div><h2>How to remember them</h2>
        <p><b>Sensory</b>: I, II, VIII: smell, vision, the inner ear (hearing and balance). <b>Motor</b>: IV, VI, XI, XII. <b>Motor with parasympathetic fibers</b>: III (constricts the pupil). <b>Mixed</b>: V, VII, IX, X: in their set of functions they are closest to spinal nerves; parasympathetic fibers also run in VII, IX and X.</p>
        <h3>Where they emerge</h3>
        <p>I enters the telencephalon, II the diencephalon. III and IV emerge from the midbrain (IV is the only one on the dorsal side). V is associated with the pons. VI, VII and VIII emerge at the border of the pons and the medulla, IX–XII from the medulla.</p>
        <h3>Evolution</h3>
        <p>The set did not appear all at once: fish and amphibians have no separate XI and XII nerves (their fibers run within the vagus and spinal nerves), and the full set of 12 pairs is found in amniotes: reptiles, birds and mammals. The medulla and pons retain the plan of the spinal cord: sensory nuclei lie laterally, motor nuclei medially, and parasympathetic nuclei between them.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>Where the nerves emerge on the underside of the brain.</li><li>Classification by function and the direction of the signal.</li><li>The ganglion and three branches of the trigeminal nerve.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>The targets (eye, ear, tongue, heart) are moved close to the brain and drawn as icons.</li><li>The course of the nerves inside the skull is simplified.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li>click a nerve: select</li><li><code>←</code> <code>→</code> next nerve</li><li><code>Esc</code> all</li><li><code>R</code> rotate</li><li><code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeCranial };
