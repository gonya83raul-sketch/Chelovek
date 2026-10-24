import { Sparks, THREE, V3, __set_rnd, displaceGeo, envTex, flyStep, flyTarget, glassMat, glowNucleus, group, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, organMat, rand, randUnit, rnd, seg, smooth, taperTube, toggle } from '../core.js';


/* =========================================================
   ОРГАНЫ ЧУВСТВ · ОБОНЯНИЕ И ВКУС
   ========================================================= */
const OD_TYPES = ['#FF6A5A', '#F2C14E', '#7FE0A0', '#4FA3FF', '#C77DFF', '#FF8AB0', '#7FD6C8', '#E8E0C0'];
const ODORS = [
  { id: 'rose', name: 'Rose', rec: [0, 5, 4], text: '<b>Rose.</b> The scent is a mixture of dozens of molecules (phenylethyl alcohol, geraniol, citronellol…). Each one excites several types of receptors, and the brain recognizes the smell by the <b>pattern</b> of active glomeruli.' },
  { id: 'coffee', name: 'Coffee', rec: [1, 2, 6, 3], text: '<b>Coffee</b> contains more than 800 volatile compounds. The pattern is broader and more complex: this is how the brain tells “coffee” apart from its individual components.' },
  { id: 'orange', name: 'Orange', rec: [1, 7, 2], text: '<b>Orange</b> is mostly limonene. A different set of receptors means a different pattern of glomeruli in the bulb.' },
  { id: 'smoke', name: 'Smoke', rec: [3, 4, 0, 6], text: '<b>Smoke.</b> The smell of burning is processed quickly and triggers alarm: the olfactory pathway goes straight to the amygdala and the paleocortex, bypassing the thalamus.' },
];
const TASTES = [
  { id: 'sweet', name: 'Sweet', color: '#FF8AB0', text: '<b>Sweet</b> — sugars and some proteins and sweeteners. The T1R2+T1R3 receptor on type II cells. The signal: “energy here”.' },
  { id: 'umami', name: 'Umami', color: '#F2C14E', text: '<b>Umami</b> is the taste of glutamate (broth, cheese, tomatoes, soy sauce); receptor T1R1+T1R3. The signal: “protein here”. It was described by the Japanese chemist Kikunae Ikeda in 1908.' },
  { id: 'bitter', name: 'Bitter', color: '#7FE0A0', text: '<b>Bitter</b> — about 25 different T2R receptors. The highest sensitivity of all tastes: many poisons are bitter. The signal: “careful”.' },
  { id: 'sour', name: 'Sour', color: '#7FD6FF', text: '<b>Sour</b> — hydrogen ions (acids), type III cells. A signal of unripe or spoiled food.' },
  { id: 'salty', name: 'Salty', color: '#E8E0C0', text: '<b>Salty</b> — sodium ions pass through ENaC sodium channels. Needed for water and salt balance.' },
];
function makeChemo() {
  __set_rnd(mulberry(2222));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0x7fe0a0);
  const VIEW = { smell: flyTarget(V3(-0.2, -0.45, 0), V3(-0.4, 0.7, 6.4)), tongue: flyTarget(V3(30, -0.9, 0.2), V3(30.0, 3.0, 4.4)), bud: flyTarget(V3(60, -0.75, 0), V3(61.8, 0.6, 5.8)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 120); camera.position.copy(VIEW.smell.pos);
  const controls = makeControls(camera, VIEW.smell.target); controls.minDistance = 1; controls.maxDistance = 16;
  /* ---------- обоняние ---------- */
  const sm = new THREE.Group(); scene.add(sm);
  const cav = displaceGeo(new THREE.SphereGeometry(1, 48, 32), (v) => { v.set(v.x * 1.7, v.y * 0.7, v.z * 0.5); if (v.x < -1.2) v.y -= 0.25 * smooth(-1.2, -1.7, v.x); }); cav.translate(-0.4, -0.25, 0);
  sm.add(new THREE.Mesh(cav, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8a0a0).multiplyScalar(0.3), roughness: 0.4, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide })), new THREE.Mesh(cav, glassMat(0xffb8b0, { rim: 0.18, base: 0.006, pow: 2.2 })));
  [[-0.3, -0.05], [-0.4, -0.35], [-0.5, -0.65]].forEach(([y, dx]) => { const c = new THREE.CatmullRomCurve3([V3(-1.2 + dx, y, -0.1), V3(-0.4, y + 0.03, -0.12), V3(0.5, y - 0.02, -0.1)]); sm.add(new THREE.Mesh(taperTube(c, (u) => 0.06 * Math.sin(u * Math.PI) + 0.02, 30, 10), organMat('#E8A0A0', 0.42))); });
  const plate = new THREE.Mesh(displaceGeo(new THREE.BoxGeometry(1.5, 0.05, 0.6, 30, 1, 12), (v) => {}), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8d8bb).multiplyScalar(0.4), roughness: 0.6, transparent: true, opacity: 0.5 })); plate.position.set(0.15, 0.5, 0); sm.add(plate);
  const bulbG = displaceGeo(new THREE.SphereGeometry(1, 40, 28), (v) => { v.set(v.x * 0.75, v.y * 0.22, v.z * 0.25); }); bulbG.translate(0.2, 0.85, 0);
  sm.add(new THREE.Mesh(bulbG, organMat('#F2D8C0', 0.4, { transparent: true, opacity: 0.45, depthWrite: false })));
  const TRACT = new THREE.CatmullRomCurve3([V3(0.9, 0.88, 0), V3(1.5, 0.95, 0), V3(2.2, 1.1, 0), V3(2.8, 1.35, 0)]);
  sm.add(new THREE.Mesh(taperTube(TRACT, () => 0.07, 30, 10), organMat('#F2D8C0', 0.4)));
  // клубочки
  const GLOM = OD_TYPES.map((c, i) => { const p = V3(-0.35 + i * 0.15, 0.82 + (i % 2 ? 0.04 : -0.04), (i % 3 - 1) * 0.08); const n = glowNucleus(sm, p, c, 0.035, 6); n.spr.material.opacity = 0.25; return { p, n, act: 0 }; });
  // рецепторные нейроны
  const REC = []; const recMatArr = OD_TYPES.map((c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.5), emissive: new THREE.Color(c), emissiveIntensity: 0.1, roughness: 0.4 }));
  for (let i = 0; i < 40; i++) {
    const ty = i % 8, x = -0.4 + rnd() * 1.1, z = rand(-0.2, 0.2), y = 0.3;
    const soma = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), recMatArr[ty]); soma.position.set(x, y, z); soma.scale.y = 1.6; sm.add(soma);
    const ax = new THREE.CatmullRomCurve3([V3(x, y + 0.03, z), V3(x, 0.5, z * 0.8), V3((x + GLOM[ty].p.x) / 2, 0.68, (z + GLOM[ty].p.z) / 2), GLOM[ty].p]);
    sm.add(new THREE.Mesh(new THREE.TubeGeometry(ax, 16, 0.005, 4), recMatArr[ty]));
    for (let k = 0; k < 4; k++) sm.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(V3(x, y - 0.03, z), V3(x + rand(-0.05, 0.05), y - 0.1, z + rand(-0.05, 0.05))), 2, 0.003, 3), recMatArr[ty]));
    REC.push({ ty, p: V3(x, y, z), ax });
  }
  /* ---------- язык ---------- */
  const tg = new THREE.Group(); tg.position.set(30, 0, 0); scene.add(tg); tg.visible = false;
  const tongueG = displaceGeo(new THREE.SphereGeometry(1, 96, 64), (v) => { let x = v.x * 0.9, y = v.y * 0.28, z = v.z * 1.5; if (z > 0.6) { const k = 1 - 0.45 * (z - 0.6) / 0.9; x *= k; } if (y > 0) y += 0.02 * noise3(v.x * 30, v.y * 30, v.z * 30) - 0.06 * Math.exp(-((x / 0.06) ** 2)); v.set(x, y, z); });
  const tongue = new THREE.Mesh(tongueG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xd87880).multiplyScalar(0.36), roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.5, sheen: 0.25, sheenColor: new THREE.Color(0xffb0b8), envMapIntensity: 0.35 })); tg.add(tongue);
  const papG = []; for (let i = 0; i < 160; i++) { const z = rand(-0.6, 1.35), x = rand(-0.8, 0.8) * (z > 0.6 ? 1 - 0.45 * (z - 0.6) / 0.9 : 1); if (x * x / 0.64 + z * z / 2.25 > 0.85) continue; const g = new THREE.SphereGeometry(0.022, 8, 6); g.translate(x, 0.27 * Math.sqrt(Math.max(0, 1 - x * x / 0.81 - z * z / 2.25)) + 0.01, z); papG.push(g); }
  tg.add(new THREE.Mesh(mergeGeometries(papG), organMat('#FF9AA8', 0.5)));
  const cvG = []; for (let i = 0; i < 9; i++) { const a = (i - 4) / 4, x = a * 0.5, z = -0.55 + Math.abs(a) * 0.3; const g = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16); g.translate(x, 0.24, z); cvG.push(g); }
  tg.add(new THREE.Mesh(mergeGeometries(cvG), organMat('#FFB0B8', 0.55)));
  [1, -1].forEach((s) => { for (let k = 0; k < 5; k++) { const g = new THREE.BoxGeometry(0.02, 0.06, 0.12); g.translate(0.8 * s, 0.12, -0.3 + k * 0.08); tg.add(new THREE.Mesh(g, organMat('#FFB0B8', 0.5))); } });
  /* ---------- вкусовая почка ---------- */
  const bud = new THREE.Group(); bud.position.set(60, 0, 0); scene.add(bud); bud.visible = false;
  const epi = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 1.6), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8a0a8).multiplyScalar(0.35), roughness: 0.5, transparent: true, opacity: 0.12, depthWrite: false })); epi.position.y = -0.2; bud.add(epi);
  const budShell = displaceGeo(new THREE.SphereGeometry(1, 40, 30), (v) => { v.set(v.x * 0.42, v.y * 0.62, v.z * 0.42); }); budShell.translate(0, -0.2, 0);
  bud.add(new THREE.Mesh(budShell, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2d8c0).multiplyScalar(0.4), transparent: true, opacity: 0.2, depthWrite: false, roughness: 0.3 })), new THREE.Mesh(budShell, glassMat(0xffe0d0, { rim: 0.4, base: 0.01, pow: 2 })));
  const PORE = V3(0, 0.45, 0);
  const TC = []; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + rnd() * 0.2, r = 0.2 + rnd() * 0.1, ty = TASTES[i % 5]; const bot = V3(Math.cos(a) * r, -0.7, Math.sin(a) * r), top = V3(Math.cos(a) * 0.05, 0.35, Math.sin(a) * 0.05);
    const c = new THREE.CatmullRomCurve3([bot, V3(Math.cos(a) * (r + 0.1), -0.2, Math.sin(a) * (r + 0.1)), top]); const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(ty.color).multiplyScalar(0.45), emissive: new THREE.Color(ty.color), emissiveIntensity: 0.1, roughness: 0.4, transparent: true, opacity: 0.85 });
    bud.add(new THREE.Mesh(taperTube(c, (u) => 0.035 * Math.sin(Math.min(1, u * 1.1) * Math.PI) + 0.008, 20, 8), m));
    const nerve = new THREE.CatmullRomCurve3([bot, bot.clone().add(V3(0, -0.25, 0)), V3(bot.x * 0.3, -1.2, bot.z * 0.3)]); bud.add(new THREE.Mesh(new THREE.TubeGeometry(nerve, 10, 0.008, 4), new THREE.MeshPhysicalMaterial({ color: 0xf4c542, emissive: 0x403000, emissiveIntensity: 0.4 })));
    TC.push({ ty: ty.id, m, nerve, top }); }
  const fx = new Sparks(2400, 0.05); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'smell', labels: true, rot: false, fly: null, odor: null, odT: -99, taste: null, taT: -99, msg: null };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; sm.visible = m === 'smell'; tg.visible = m === 'tongue'; bud.visible = m === 'bud'; st.fly = VIEW[m]; refs.setInfo && refs.setInfo(); }
  function smell(id) { st.odor = ODORS.find((o) => o.id === id); st.odT = st.t; if (st.mode !== 'smell') setMode('smell'); st.msg = st.odor.text; refs.oSeg && refs.oSeg.sync(); refs.setInfo(); }
  function taste(id) { st.taste = TASTES.find((x) => x.id === id); st.taT = st.t; if (st.mode !== 'bud') setMode('bud'); st.msg = st.taste.text; refs.tSeg && refs.tSeg.sync(); refs.setInfo(); }
  const NOSTRIL = V3(-2.1, -0.65, 0);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    const ko = t - st.odT, od = st.odor;
    if (st.mode === 'smell') {
      if (od && ko > 0 && ko < 6) for (let j = 0; j < 3; j++) { const c = new THREE.Color(OD_TYPES[od.rec[Math.floor(rnd() * od.rec.length)]]); fx.spawn(NOSTRIL.clone().add(randUnit().multiplyScalar(0.08)), V3(1.1 + rnd() * 0.4, 0.45 + rnd() * 0.3, rand(-0.1, 0.1)), c, 1.4, 0.3, 1.0); }
      GLOM.forEach((g, i) => { const on = od && od.rec.includes(i) && ko > 1 && ko < 8; g.act += ((on ? 1 : 0) - g.act) * Math.min(1, dt * 3); g.n.spr.material.opacity = 0.2 + 0.8 * g.act; g.n.spr.scale.setScalar(0.035 * (6 + 6 * g.act)); });
      recMatArr.forEach((m, i) => { m.emissiveIntensity = 0.1 + 0.9 * GLOM[i].act; });
      REC.forEach((r) => { if (GLOM[r.ty].act > 0.3 && rnd() < 0.15) { fx.spawn(r.ax.getPointAt(rnd()), V3(0, 0, 0), new THREE.Color(OD_TYPES[r.ty]), 0.3, 0, 1.2); } });
      if (od && ko > 1.5 && ko < 8 && rnd() < 0.6) fx.spawn(TRACT.getPointAt(rnd()), V3(0.3, 0, 0), new THREE.Color(0xf4c542), 0.5, 0, 1.2);
    }
    const kt = t - st.taT, ta = st.taste;
    if (st.mode === 'bud') {
      if (ta && kt > 0 && kt < 5) for (let j = 0; j < 2; j++) fx.spawn(PORE.clone().add(bud.position).add(V3(rand(-0.5, 0.5), 0.8 + rnd() * 0.4, rand(-0.3, 0.3))), V3(0, -0.6, 0), new THREE.Color(ta.color), 1.4, 0.4, 1.2);
      TC.forEach((c) => { const on = ta && c.ty === ta.id && kt > 1 && kt < 6; c.m.emissiveIntensity += ((on ? 1.1 : 0.1) - c.m.emissiveIntensity) * Math.min(1, dt * 4); if (on && rnd() < 0.2) fx.spawn(c.nerve.getPointAt(rnd()).add(bud.position), V3(0, -0.4, 0), new THREE.Color(0xf4c542), 0.4, 0, 1.2); });
    }
    fx.update(dt);
  }
  const TXT = {
    smell: '<b>Smell.</b> In the roof of the nasal cavity lies the olfactory epithelium (~5 cm²) with ~10 million receptor neurons. Each neuron carries one receptor type out of ~400; all neurons of the same type send their axons through the ethmoid bone to the same <b>glomerulus</b> of the olfactory bulb. An odor is coded by the pattern of active glomeruli. Olfactory neurons live 1–2 months and are constantly replaced. Choose a smell.',
    tongue: '<b>The tongue</b> is covered with papillae: fungiform (all over the surface), circumvallate (large, in a V near the root) and foliate (along the sides). The taste papillae contain 2,000–8,000 taste buds. The “tongue map” with a sweet zone at the tip and a bitter zone at the root is a myth: all five tastes are sensed by the whole surface.',
    bud: '<b>A taste bud</b> is a “barrel” of 50–100 cells with a pore at the top. Cells of different types respond to different tastes and pass the signal to fibers of the facial, glossopharyngeal and vagus nerves → brainstem → thalamus → gustatory cortex of the insula. The cells live 10–14 days. Choose a taste.',
  };
  const labels = [
    { text: 'nostril', pos: V3(-2.2, -0.85, 0.1), color: '#E8A0A0', show: () => st.labels && st.mode === 'smell' },
    { text: 'nasal conchae', pos: V3(-1.3, -0.45, 0.25), color: '#E8A0A0', show: () => st.labels && st.mode === 'smell' },
    { text: 'olfactory epithelium', pos: V3(-0.6, 0.2, 0.25), color: '#7FE0A0', show: () => st.labels && st.mode === 'smell' },
    { text: 'ethmoid bone', pos: V3(1.0, 0.5, 0.3), color: '#e8d8bb', show: () => st.labels && st.mode === 'smell' },
    { text: 'olfactory bulb · glomeruli', pos: V3(-0.6, 1.05, 0.2), color: '#F2D8C0', show: () => st.labels && st.mode === 'smell' },
    { text: 'olfactory tract → cortex and amygdala', pos: V3(2.0, 1.25, 0.05), color: '#F4C542', show: () => st.labels && st.mode === 'smell' },
    { text: 'tip', pos: V3(30, 0.3, 1.5), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'circumvallate papillae', pos: V3(30.6, 0.35, -0.45), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'foliate', pos: V3(30.95, 0.2, -0.1), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'fungiform', pos: V3(29.5, 0.35, 0.6), color: '#ffb0b8', show: () => st.labels && st.mode === 'tongue' },
    { text: 'taste pore', pos: V3(60.15, 0.55, 0.05), color: '#ffe0d0', show: () => st.labels && st.mode === 'bud' },
    { text: 'receptor cells', pos: V3(60.5, -0.1, 0.3), color: '#ffb0b8', show: () => st.labels && st.mode === 'bud' },
    { text: 'nerve fibers', pos: V3(60.3, -1.15, 0.1), color: '#F4C542', show: () => st.labels && st.mode === 'bud' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 360px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'smell', label: 'Smell' }, { id: 'tongue', label: 'Tongue' }, { id: 'bud', label: 'Taste bud' }], () => st.mode, (v) => setMode(v));
    refs.oSeg = seg(ODORS.map((o) => ({ id: o.id, label: o.name })), () => st.odor && st.odor.id, (v) => smell(v));
    refs.tSeg = seg(TASTES.map((x) => ({ id: x.id, label: x.name, color: x.color })), () => st.taste && st.taste.id, (v) => taste(v));
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), group('Smell it', '', refs.oSeg), group('Taste it', '', refs.tSeg), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['smell', 'tongue', 'bud'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return st.mode === 'smell' ? [['Receptor types', '≈400', ''], ['Active glomeruli', GLOM.filter((g) => g.act > 0.5).length, '']] : [['Taste buds', '2–8', 'thousand'], ['Basic tastes', 5, '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#7FE0A0',
    kicker: 'Senses · chemical', title: 'Smell and taste',
    lede: 'Two chemical senses: the nose tells thousands of smells apart by the pattern of hundreds of receptors, and the tongue senses five basic tastes. Together they give what we call the flavor of food.',
    notes: `
      <div><h2>The flavor of food is mostly smell</h2><p>When we chew, volatile substances rise from the oropharynx into the nose (retronasal smell). That is why food seems tasteless when you have a cold: the tongue still senses sweet and salty, but the “aroma” disappears.</p>
        <h3>What makes smell special</h3><p>It is the only sense whose signals reach the cortex without passing through the thalamus — directly to the paleocortex, the amygdala and the entorhinal cortex. That is why smells are so strongly linked to emotions and memories. For discovering the olfactory receptors, Richard Axel and Linda Buck received the 2004 Nobel Prize.</p></div>
      <div><h2>Simplifications</h2><ul><li>8 receptor types are shown instead of ~400.</li><li>The taste bud and the epithelium are greatly enlarged.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  return self;
}
export { makeChemo };
