import { GLOW, THREE, V3, __set_rnd, accentSet, addLights, brainKit, brainShell, envTex, glassMat, group, h, makeControls, mulberry, rnd, seg, toggle } from '../core.js';


/* =========================================================
   SCENE 3 · МОЗГ
   ========================================================= */
const SYSTEMS = [
  { id: 'da', name: 'Dopamine', color: '#F4C542', src: 'substantia nigra and ventral tegmental area', share: '~0.5 million', text: '<b>Dopamine.</b> The nigrostriatal pathway controls movement (its loss causes Parkinson’s disease). The mesolimbic pathway serves pleasure and motivation, the mesocortical pathway attention. A short pathway to the pituitary keeps prolactin in check.' },
  { id: 'na', name: 'Norepinephrine', color: '#F08A3C', src: 'locus coeruleus', share: '~30,000–50,000', text: '<b>Norepinephrine.</b> From the locus coeruleus in the brainstem to the entire cortex, the cerebellum and the spinal cord. Wakefulness, attention, the stress response.' },
  { id: 'ht', name: 'Serotonin', color: '#C77DFF', src: 'raphe nuclei', share: '~0.3 million', text: '<b>Serotonin.</b> The raphe nuclei send projections up to the cortex and thalamus and down to the spinal cord. Mood, sleep, appetite, pain control.' },
  { id: 'ach', name: 'Acetylcholine', color: '#3FC1B0', src: 'basal nucleus', share: 'hundreds of thousands', text: '<b>Acetylcholine.</b> The basal nucleus of the forebrain supplies the cortex and hippocampus: attention and memory. In Alzheimer’s disease these cells die.' },
  { id: 'his', name: 'Histamine', color: '#FF7FB0', src: 'posterior hypothalamus', share: '~60,000', text: '<b>Histamine.</b> From the posterior hypothalamus to the entire cortex. It keeps us awake; first-generation antihistamines make people drowsy.' },
];

function makeBrain() {
  __set_rnd(mulberry(5));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  addLights(scene, 0xff7aa8);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 100); camera.position.set(4.6, 1.5, 5.4);
  const controls = makeControls(camera, V3(0, -0.35, 0)); controls.minDistance = 2.2; controls.maxDistance = 14; controls.autoRotate = true; controls.autoRotateSpeed = 0.6;

  // оболочка — общая модель brainKit (борозды, мозжечок с листками и ножками, ствол с мостом)
  brainShell(scene, { opacity: 0.1, rim: 0.62 });
  const hemiGeos = brainKit().hemi;
  const innerMat = glassMat(0xb9a4ff, { rim: 0.35, base: 0.01, pow: 1.8 });
  const innerFill = new THREE.MeshPhysicalMaterial({ color: 0xb9a4ff, roughness: 0.5, transparent: true, opacity: 0.15, depthWrite: false });   // таламус и гипофиз видны, но не закрывают ядра
  [[V3(0.0, -0.05, 0.2), V3(0.32, 0.2, 0.2)], [V3(0.0, -0.05, -0.2), V3(0.32, 0.2, 0.2)]].forEach(([p, s]) => { [innerFill, innerMat].forEach((mt) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), mt); m.position.copy(p); m.scale.copy(s); scene.add(m); }); });
  const cc = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(0.95, -0.05, 0), V3(0.7, 0.32, 0), V3(0, 0.42, 0), V3(-0.65, 0.3, 0), V3(-0.8, 0.12, 0)]), 64, 0.06, 10), innerMat); scene.add(cc);
  [innerFill, innerMat].forEach((mt) => { const pit = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), mt); pit.position.set(0.38, -0.78, 0); scene.add(pit); });

  // cortex target points
  const cortexPts = [];
  hemiGeos.forEach((g, gi) => { const pos = g.attributes.position; for (let i = 0; i < pos.count; i += 37) { const p = V3(pos.getX(i), pos.getY(i), pos.getZ(i)); const side = gi ? -1 : 1; if (p.y > -0.15 && p.z * side > 0.5) cortexPts.push(p.multiplyScalar(0.94)); } });
  const pick = (n, filter = () => true) => { const a = cortexPts.filter(filter); const out = []; for (let i = 0; i < n; i++) out.push(a[Math.floor(rnd() * a.length)]); return out; };

  const flowMat = (color) => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uOn: { value: 1 }, uPhase: { value: rnd() * 10 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime,uOn,uPhase; varying vec2 vUv;
      void main(){ float s = fract(vUv.x*1.6 - uTime*0.45 + uPhase); float p = smoothstep(0.0,0.06,s)*(1.0-smoothstep(0.06,0.32,s)); float a = (0.16 + 1.1*p)*uOn*smoothstep(0.0,0.04,vUv.x); gl_FragColor = vec4(uColor*(0.7+2.2*p), a); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const groups = {}, nucleiLabels = [];
  // MFB: восходящие пути ствола к передней коре идут сперва вперёд в медиальном пучке переднего мозга (гипоталамус, перегородка), затем веером
  const MFB = { da: 1, na: 1, ht: 1, his: 1 };
  function path(sys, a, b, lift = 0.25, r = 0.011) {
    const via = MFB[sys.id] && b.y > -0.2 && b.x > -0.3 && a.x < 0.3 ? V3(0.5, -0.25, 0.1 * Math.sign(b.z || 1)) : null;
    const a2 = via || a, mid = a2.clone().lerp(b, 0.5); mid.y += lift; mid.x += (b.x - a2.x) * 0.08;
    const c = new THREE.CatmullRomCurve3(via ? [a, a.clone().lerp(via, 0.5).add(V3(0, 0.05, 0)), via, mid, b] : [a, a.clone().lerp(mid, 0.5).add(V3(0, lift * 0.3, 0)), mid, b]);
    const m = new THREE.Mesh(new THREE.TubeGeometry(c, 60, r, 6), flowMat(sys.color)); groups[sys.id].add(m);
  }
  function nucleus(sys, p, name, size = 0.05, lp = null) {
    const g = groups[sys.id];
    const core = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(sys.color).multiplyScalar(2) })); core.position.copy(p); g.add(core);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: sys.color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); spr.scale.setScalar(size * 6); spr.position.copy(p); g.add(spr);
    if (name) nucleiLabels.push({ text: name, pos: lp || p.clone().add(V3(0, 0.1, 0.12)), sys: sys.id });   // lp — своё место подписи: ядра лежат тесно
  }
  SYSTEMS.forEach((s) => { groups[s.id] = new THREE.Group(); scene.add(groups[s.id]); });
  const S = Object.fromEntries(SYSTEMS.map((s) => [s.id, s]));
  // DA
  const SN = [V3(-0.05, -0.55, 0.22), V3(-0.05, -0.55, -0.22)], VTA = [V3(0.0, -0.56, 0.07), V3(0.0, -0.56, -0.07)];
  SN.forEach((p, i) => { nucleus(S.da, p, i ? null : 'substantia nigra', 0.05, V3(-0.05, -0.64, 0.36)); const sgn = i ? -1 : 1; path(S.da, p, V3(0.38, 0.08, 0.38 * sgn), 0.2, 0.016); path(S.da, p, V3(0.6, 0.0, 0.32 * sgn), 0.25, 0.012); });
  VTA.forEach((p, i) => { nucleus(S.da, p, i ? null : 'ventral tegmental area', 0.05, V3(0.06, -0.46, 0.16)); const sgn = i ? -1 : 1; path(S.da, p, V3(0.6, -0.3, 0.18 * sgn), 0.1, 0.016); path(S.da, p, V3(1.38, 0.25, 0.32 * sgn), 0.35); path(S.da, p, V3(1.3, -0.05, 0.42 * sgn), 0.3); });
  nucleus(S.da, V3(0.25, -0.5, 0), null, 0.035); path(S.da, V3(0.25, -0.5, 0), V3(0.38, -0.76, 0), 0.0, 0.014);
  // NA
  const LC = [V3(-0.42, -0.98, 0.09), V3(-0.42, -0.98, -0.09)];
  LC.forEach((p, i) => { nucleus(S.na, p, i ? null : 'locus coeruleus', 0.05, V3(-0.6, -1.1, 0.2)); });
  pick(16).forEach((t, j) => path(S.na, LC[t.z > 0 ? 0 : 1], t, 0.5));
  path(S.na, LC[0], V3(-1.25, -0.8, 0.5), 0.1); path(S.na, LC[1], V3(-1.25, -0.8, -0.5), 0.1); path(S.na, LC[0], V3(-0.48, -2.25, 0.03), -0.05); path(S.na, LC[0], V3(-0.25, -0.32, 0.6), 0.2);
  // 5-HT
  const RA = [V3(-0.25, -0.78, 0), V3(-0.33, -1.05, 0), V3(-0.4, -1.32, 0)];
  RA.forEach((p, i) => nucleus(S.ht, p, i === 1 ? 'raphe nuclei' : null, 0.04, V3(-0.12, -0.86, 0.12)));
  pick(14).forEach((t, j) => path(S.ht, RA[j % 2], t, 0.42));
  path(S.ht, RA[0], V3(0.05, -0.05, 0.2), 0.1); path(S.ht, RA[0], V3(0.05, -0.05, -0.2), 0.1); path(S.ht, RA[2], V3(-0.47, -2.25, -0.03), -0.05);
  // ACh
  const MY = [V3(0.45, -0.38, 0.26), V3(0.45, -0.38, -0.26)];
  MY.forEach((p, i) => nucleus(S.ach, p, i ? null : 'basal nucleus', 0.05, V3(0.52, -0.12, 0.38)));
  pick(14, (p) => p.x > -0.9).forEach((t) => path(S.ach, MY[t.z > 0 ? 0 : 1], t, 0.3));
  path(S.ach, MY[0], V3(-0.25, -0.32, 0.58), 0.05); path(S.ach, MY[1], V3(-0.25, -0.32, -0.58), 0.05);
  // His
  const TM = [V3(0.12, -0.5, 0.09), V3(0.12, -0.5, -0.09)];
  TM.forEach((p, i) => nucleus(S.his, p, i ? null : 'posterior hypothalamus', 0.04, V3(0.28, -0.3, 0.12)));
  pick(12).forEach((t) => path(S.his, TM[t.z > 0 ? 0 : 1], t, 0.35, 0.009));

  const st = { sys: 'all', rot: true, labels: true, t: 0 };
  function apply() {
    SYSTEMS.forEach((s) => {
      const on = st.sys === 'all' || st.sys === s.id;
      groups[s.id].children.forEach((m) => { if (m.material.uniforms) m.material.uniforms.uOn.value = on ? (st.sys === 'all' ? 0.4 : 1.2) : 0.05; else m.visible = on; });
    });
    accentSet(st.sys === 'all' ? '#EFEAE6' : S[st.sys].color);
  }
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot;
    SYSTEMS.forEach((s) => groups[s.id].children.forEach((m) => { if (m.material.uniforms) m.material.uniforms.uTime.value = st.t; }));
  }
  const anat = [
    { text: 'frontal cortex', pos: V3(1.55, 0.35, 0.75) }, { text: 'occipital cortex', pos: V3(-1.65, 0.35, 0.7) },
    { text: 'cerebellum', pos: V3(-1.5, -1.2, 0.95) }, { text: 'brainstem', pos: V3(-0.25, -1.45, 0.3) }, { text: 'spinal cord', pos: V3(-0.5, -2.25, 0.2) },
    { text: 'thalamus', pos: V3(0.05, 0.12, 0.3) }, { text: 'pituitary gland', pos: V3(0.48, -0.86, 0.05) },
  ];
  const labels = [...anat.map((l) => ({ ...l, show: () => st.labels })), ...nucleiLabels.map((l) => ({ text: l.text, pos: l.pos, color: S[l.sys].color, show: () => st.labels && (st.sys === 'all' || st.sys === l.sys) }))];
  let refs = {};
  function ui(el) {
    const info = h('div', { class: 'info' });
    const setInfo = () => { info.innerHTML = st.sys === 'all' ? 'Five systems, each with its own small nucleus deep in the brain. Select one to see its pathways on their own.' : S[st.sys].text; };
    const sysSeg = seg([{ id: 'all', label: 'All' }, ...SYSTEMS.map((s) => ({ id: s.id, label: s.name, color: s.color }))], () => st.sys, (v) => { st.sys = v; apply(); setInfo(); });
    const rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    refs = { sysSeg, rot, lab, setInfo };
    el.append(group('System', '0–5', sysSeg), group('View', 'R · N', rot, lab), h('div', { class: 'grp', style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'What you see'), info));
    setInfo();
  }
  function onKey(e) {
    const n = parseInt(e.key, 10);
    if (n >= 0 && n <= 5) { st.sys = n === 0 ? 'all' : SYSTEMS[n - 1].id; apply(); refs.sysSeg.sync(); refs.setInfo(); return true; }
    const k = e.key.toLowerCase();
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { if (st.sys === 'all') return [['Systems', 5, ''], ['Neurotransmitters', 5, '']]; const s = S[st.sys]; return [['Neurons', s.share, '']]; }
  apply();
  return {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return st.sys === 'all' ? '#EFEAE6' : S[st.sys].color; },
    kicker: 'Neurotransmitters · where they are in the brain', title: 'Neurotransmitter systems',
    lede: 'Small nuclei in the brainstem and at the base of the brain send projections across a vast territory. That is why a single substance changes the state of the whole brain at once.',
    notes: `
      <div><h2>How it is organized</h2>
        <p>Glutamate and GABA are found almost everywhere and carry the signal itself. The five systems in this model work differently: tens to hundreds of thousands of cells in a few nuclei (a tiny fraction of the brain’s ~86 billion neurons) control the mood, attention, sleep and movement of the whole brain.</p>
        <h3>Dopamine pathways</h3>
        <p><b>Nigrostriatal</b>: from the substantia nigra to the striatum, movement. <b>Mesolimbic</b>: from the tegmentum to the nucleus accumbens, pleasure and motivation. <b>Mesocortical</b>: to the frontal cortex, attention and planning. <b>Tuberoinfundibular</b>: to the pituitary, keeps prolactin in check.</p>
        <h3>Why it matters</h3>
        <p>Antidepressants, antipsychotics, stimulants and sleeping pills act on these systems. That is why their effects are so broad: they change the activity of the entire cortex at once.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The location of the source nuclei: brainstem, midbrain, hypothalamus, base of the forebrain.</li><li>Where the projections of each system go.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>The brain is a simplified model with gyri, not a scan.</li><li>Real projections number in the millions; here there are about ten per system.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>0</code>–<code>5</code> system</li><li><code>R</code> rotate</li><li><code>N</code> labels</li><li>mouse: rotate, wheel: zoom</li></ul></div>`,
  };
}
export { makeBrain };
