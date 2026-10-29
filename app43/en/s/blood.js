import { Sparks, THREE, V3, __set_rnd, button, displaceGeo, ell3, envTex, flyStep, flyTarget, glassMat, group, infoBox, labLights, lerp, makeControls, mergeGeometries, mulberry, noise3, organMat, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · КРОВЬ
   ========================================================= */
const BL_CELLS = [
  { id: 'rbc', name: 'Red blood cells', color: '#E0505A', text: '<b>Red blood cells</b> (erythrocytes) are biconcave discs 7–8 µm across, without a nucleus and packed with hemoglobin. They carry oxygen from the lungs to the tissues and some of the CO₂ back. There are 4–5 million in 1 µL of blood; they live ~120 days and are destroyed in the spleen and liver; every second the bone marrow releases ~2 million new ones. Their flexible shape lets them squeeze through capillaries narrower than themselves.' },
  { id: 'wbc', name: 'White blood cells', color: '#E8E8F8', text: '<b>White blood cells</b> are nucleated cells, 4–9 thousand per µL. <b>Neutrophils</b> (up to 70%, segmented nucleus) are the first to reach an infection and eat bacteria. <b>Lymphocytes</b> (large round nucleus) are the B and T cells of immune memory. <b>Monocytes</b> (bean-shaped nucleus) enter tissues and become macrophages. <b>Eosinophils</b> (1–4%, two-lobed nucleus and orange granules) fight parasites and take part in allergy, <b>basophils</b> (under 1%, dark purple granules hide the nucleus) release histamine. A white cell is 1.5–2.5 times larger than a red cell. White cells can leave a vessel through its wall.' },
  { id: 'plt', name: 'Platelets', color: '#F2C88A', text: '<b>Platelets</b> (thrombocytes) are anucleate plates 2–3 µm across, fragments of giant bone marrow cells. There are 150–400 thousand in 1 µL; they live 7–10 days. When a vessel is damaged, they stick to the wound, become activated (put out projections) and clump together into a plug.' },
  { id: 'plasma', name: 'Plasma', color: '#F2E08A', text: '<b>Plasma</b> is 55% of blood volume: 92% water, 7% proteins (albumins — 60% of the proteins — keep water in the vessels; globulins — 35%, including antibodies; fibrinogen — 4%, needed for clotting), plus glucose, salts, hormones and waste products. An adult has about 5 L of blood — 7–8% of body mass.' },
];
const BL_GROUPS = { O: { a: [], ab: ['A', 'B'] }, A: { a: ['A'], ab: ['B'] }, B: { a: ['B'], ab: ['A'] }, AB: { a: ['A', 'B'], ab: [] } };
function makeBlood() {
  const MOBB = matchMedia('(max-width:700px)').matches;
  __set_rnd(mulberry(2020));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0507); scene.environment = envTex;
  labLights(scene, 0xff7a7a);
  const VIEW = { flow: MOBB ? flyTarget(V3(0, 0.7, 0), V3(3.0, 3.4, 14.4)) : flyTarget(V3(-2.6, -0.4, 0), V3(0.4, 2.3, 15.2)), clot: flyTarget(V3(0.3, -0.4, 0), V3(1.4, 3.2, 7.4)), groups: flyTarget(V3(30, -0.9, 0), V3(30.6, 0.8, 7.2)), tube: flyTarget(V3(60.55, -0.55, 0), V3(61.7, 0.9, 12.4)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.flow.pos);
  const controls = makeControls(camera, VIEW.flow.target); controls.minDistance = 1.5; controls.maxDistance = 18;
  const pick = [];
  /* ---------- сосуд ---------- */
  const R = 1.25, L = 9;
  const ves = new THREE.Group(); scene.add(ves);
  const wallG = new THREE.CylinderGeometry(R, R, L, 64, 1, true, Math.PI * 0.15, Math.PI * 1.7); wallG.rotateZ(Math.PI / 2);
  const wallG2 = new THREE.CylinderGeometry(R + 0.18, R + 0.18, L, 64, 1, true, Math.PI * 0.15, Math.PI * 1.7); wallG2.rotateZ(Math.PI / 2);
  const endo = new THREE.Mesh(wallG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8a0a8).multiplyScalar(0.4), roughness: 0.35, clearcoat: 0.7, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, sheen: 0.3, sheenColor: new THREE.Color(0xffc0c8) }));
  const musc = new THREE.Mesh(wallG2, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xb05050).multiplyScalar(0.4), roughness: 0.5, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }));
  ves.add(endo, musc);
  // стенка артерии: интима (эндотелий + волнистая внутренняя эластическая мембрана), медия (гладкие мышцы), адвентиция (коллаген, vasa vasorum, нерв)
  const TH0 = Math.PI * 0.15, TH1 = Math.PI * 1.7;
  const ielG = displaceGeo(new THREE.CylinderGeometry(R + 0.03, R + 0.03, L, 400, 1, true, TH0, TH1), (v) => { const a = Math.atan2(v.x, v.z), k = 1 + 0.012 * Math.sin(a * 60); v.x *= k; v.z *= k; }); ielG.rotateZ(Math.PI / 2);
  ves.add(new THREE.Mesh(ielG, new THREE.MeshPhysicalMaterial({ color: 0xf2e6a0, emissive: 0x4a4010, emissiveIntensity: 0.3, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })));
  const advG = new THREE.CylinderGeometry(R + 0.38, R + 0.38, L, 64, 1, true, TH0, TH1); advG.rotateZ(Math.PI / 2);
  ves.add(new THREE.Mesh(advG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe0d0b0).multiplyScalar(0.3), roughness: 0.7, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false })));
  { const eel = new THREE.CylinderGeometry(R + 0.22, R + 0.22, L, 64, 1, true, TH0, TH1); eel.rotateZ(Math.PI / 2); ves.add(new THREE.Mesh(eel, new THREE.MeshPhysicalMaterial({ color: 0xf2e6a0, emissive: 0x4a4010, emissiveIntensity: 0.3, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false }))); }   // наружная эластическая мембрана
  { const NS = 260, smc = new THREE.InstancedMesh(ell3(0.16, 0.025, 0.03, null, 10), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xc06060).multiplyScalar(0.5), roughness: 0.5, transparent: true, opacity: 0.3, depthWrite: false }), NS), mq = new THREE.Matrix4();
    for (let i = 0; i < NS; i++) { const a = TH0 + 0.05 + rnd() * (TH1 - 0.1), rr = R + 0.07 + rnd() * 0.1, x = rand(-L / 2, L / 2), p = V3(x, Math.sin(a) * rr, Math.cos(a) * rr), tg = V3(0, Math.cos(a), -Math.sin(a)).add(V3(rand(-0.15, 0.15), 0, 0)).normalize();
      mq.compose(p, new THREE.Quaternion().setFromUnitVectors(V3(1, 0, 0), tg), V3(1, 1, 1)); smc.setMatrixAt(i, mq); }
    ves.add(smc); }
  const VV = []; for (let i = 0; i < 3; i++) { const a = Math.PI * (0.55 + i * 0.45), rr = R + 0.29, pts = []; for (let j = 0; j <= 8; j++) { const aa = a + 0.08 * Math.sin(j * 1.3 + i); pts.push(V3(-L / 2 + j * L / 8, Math.sin(aa) * rr, Math.cos(aa) * rr)); } VV.push(tube(pts, 0.025, 60, 6)); }
  ves.add(new THREE.Mesh(mergeGeometries(VV), organMat('#E0505A', 0.6)));
  { const VN = []; for (let i = 0; i < 2; i++) { const a = Math.PI * (0.75 + i * 0.6), rr = R + 0.3, pts = []; for (let j = 0; j <= 8; j++) { const aa = a + 0.07 * Math.sin(j * 1.1 + i * 2); pts.push(V3(-L / 2 + j * L / 8, Math.sin(aa) * rr, Math.cos(aa) * rr)); } VN.push(tube(pts, 0.022, 60, 6)); } ves.add(new THREE.Mesh(mergeGeometries(VN), organMat('#5C7CE8', 0.6))); }   // венулы стенки
  { const a = Math.PI * 1.25, rr = R + 0.3, pts = []; for (let j = 0; j <= 8; j++) pts.push(V3(-L / 2 + j * L / 8, Math.sin(a + 0.05 * Math.sin(j)) * rr, Math.cos(a + 0.05 * Math.sin(j)) * rr)); ves.add(new THREE.Mesh(tube(pts, 0.035, 60, 8), organMat('#F2D060', 0.6))); }
  // кромки разреза
  [Math.PI * 0.15, Math.PI * 1.85].forEach((a) => [[0, 0.04, '#e8a0a8', 1], [0.04, 0.22, '#b05050', 1], [0.22, 0.38, '#a89870', 0.45]].forEach(([r0, r1, c, o]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(L, r1 - r0, 0.02), organMat(c, 0.4, o < 1 ? { transparent: true, opacity: o, depthWrite: false } : {})); const rc = R + (r0 + r1) / 2; m.position.set(0, Math.sin(a) * rc, Math.cos(a) * rc); m.rotation.x = Math.PI / 2 - a; ves.add(m); }));
  // эритроциты
  // двояковогнутый диск (профиль Эванса — Фунга): тонкий центр, толстый скруглённый валик;
  // профиль идёт снизу вверх — иначе у LatheGeometry грани вывернуты наизнанку
  const rbcH = (q) => 0.42 * 0.55 * Math.sqrt(Math.max(0, 1 - q * q)) * (0.207 + 2.003 * q * q - 1.123 * q ** 4);
  const rbcProf = []; for (let i = 0; i <= 24; i++) { const q = Math.sin(i / 24 * Math.PI / 2); rbcProf.push(new THREE.Vector2(q * 0.42, -rbcH(q))); }
  for (let i = 23; i >= 0; i--) { const p = rbcProf[i]; rbcProf.push(new THREE.Vector2(p.x, -p.y)); }
  const rbcG = new THREE.LatheGeometry(rbcProf, 32); rbcG.computeVertexNormals();
  const rbcMat = new THREE.MeshPhysicalMaterial({ color: 0xb02a32, roughness: 0.55, sheen: 0.45, sheenColor: new THREE.Color(0xff9090), emissive: 0x4a0a10, emissiveIntensity: 0.4, envMapIntensity: 0.35 });   /* без лака: впадина в центре не чернеет */
  const NR = 110, rbcI = new THREE.InstancedMesh(rbcG, rbcMat, NR); rbcI.userData.pick = 'rbc'; pick.push(rbcI); ves.add(rbcI);
  const RBC = Array.from({ length: NR }, () => { const r = Math.sqrt(rnd()) * (R - 0.5), a = rnd() * Math.PI * 2; return { x: rand(-L / 2, L / 2), y: Math.cos(a) * r, z: Math.sin(a) * r, q: new THREE.Quaternion().setFromAxisAngle(randUnit(), rnd() * 6), w: randUnit(), sp: rnd() * 2, stuck: 0, out: 0 }; });  // диск r 0.42 не выходит за стенку
  // тромбоциты
  const pltG = displaceGeo(new THREE.SphereGeometry(0.11, 16, 12), (v) => { v.y *= 0.35; });
  const pltSpiky = displaceGeo(new THREE.IcosahedronGeometry(0.12, 2), (v) => { const n = v.clone().normalize(); v.addScaledVector(n, 0.12 * Math.max(0, Math.sin(n.x * 11) * Math.sin(n.y * 9) * Math.sin(n.z * 7)) ** 0.5); }).toNonIndexed();
  const pltMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2c88a).multiplyScalar(0.6), roughness: 0.4, emissive: 0x3a2a08, emissiveIntensity: 0.4 });
  const NP = 50, pltI = new THREE.InstancedMesh(pltG, pltMat, NP), pltAct = new THREE.InstancedMesh(pltSpiky, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xffd890).multiplyScalar(0.7), roughness: 0.4, emissive: 0x6a4a10, emissiveIntensity: 0.8 }), NP);
  pltI.userData.pick = 'plt'; pick.push(pltI); ves.add(pltI, pltAct); pltAct.count = 0;
  const PLT = Array.from({ length: NP }, () => { const r = Math.sqrt(rnd()) * (R - 0.3), a = rnd() * Math.PI * 2; return { x: rand(-L / 2, L / 2), y: Math.cos(a) * r, z: Math.sin(a) * r, q: new THREE.Quaternion().setFromAxisAngle(randUnit(), rnd() * 6), act: 0, tgt: null }; });
  // лейкоциты
  const WBC = [];
  const wbcMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8e8f8).multiplyScalar(0.5), roughness: 0.3, transparent: true, opacity: 0.45, depthWrite: false, clearcoat: 0.6, sheen: 0.4 });
  const nucMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x8a5ad8).multiplyScalar(0.6), roughness: 0.4, emissive: 0x2a1050, emissiveIntensity: 0.6 });
  const WR = { lym: 0.5, neu: 0.62, eos: 0.65, mon: 0.8, bas: 0.58 };   // радиус относительно эритроцита (0.42): лимфоцит 7–10 мкм, нейтрофил 12–15, моноцит до 20
  const mkWBC = (kind, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); const cell = new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(WR[kind], 32, 24), (v) => v.multiplyScalar(1 + 0.05 * noise3(v.x * 9, v.y * 9, v.z * 9))), wbcMat); cell.userData.pick = 'wbc'; pick.push(cell); g.add(cell);
    if (kind === 'neu') [V3(-0.2, 0.07, 0), V3(0.0, -0.13, 0.1), V3(0.2, 0.08, -0.06), V3(0.07, 0.21, 0.13)].forEach((p) => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), nucMat); n.position.copy(p); g.add(n); });
    if (kind === 'lym') { const n = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), nucMat); g.add(n); }
    if (kind === 'mon') { const n = new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(0.42, 20, 16), (v) => { if (v.x > 0) v.x *= 0.4; v.y *= 1.3; }), nucMat); g.add(n); }
    const gran = (n, col, r0, r1, sz) => { const gm = new THREE.MeshBasicMaterial({ color: col }); for (let i = 0; i < n; i++) { const gr = new THREE.Mesh(new THREE.SphereGeometry(sz, 6, 4), gm); gr.position.copy(randUnit().multiplyScalar(r0 + rnd() * (r1 - r0))); g.add(gr); } };
    if (kind === 'eos') { [-1, 1].forEach((s) => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 10), nucMat); n.position.x = 0.17 * s; g.add(n); }); gran(45, 0xff7a4a, 0.3, 0.58, 0.035); }
    if (kind === 'bas') { [-1, 1].forEach((s) => { const n = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), nucMat); n.position.set(0.12 * s, 0.05 * s, 0); g.add(n); }); gran(70, 0x4a2a8a, 0.05, 0.52, 0.05); }
    ves.add(g); WBC.push({ g, kind, x, y, z, ph: rnd() * 6 }); };
  mkWBC('neu', -2.6, -0.5, 0.15); mkWBC('lym', 0.4, -0.55, 0.3); mkWBC('mon', 2.6, -0.25, 0.2); mkWBC('eos', -0.9, 0.0, 0.3); mkWBC('bas', 1.4, 0.05, 0.35);
  /* ---------- пробирка после центрифуги ---------- */
  const tubeG = new THREE.Group(); tubeG.position.set(60, 0, 0); scene.add(tubeG); tubeG.visible = false;
  { const prof = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + i / 12 * Math.PI / 2; prof.push(new THREE.Vector2(Math.cos(a) * 0.4, Math.sin(a) * 0.4)); } prof.push(new THREE.Vector2(0.4, 3.0), new THREE.Vector2(0.43, 3.05));
    const tg = new THREE.LatheGeometry(prof, 48); tubeG.add(new THREE.Mesh(tg, glassMat(0xd8e8ff, { rim: 0.5, base: 0.02 })), new THREE.Mesh(tg, new THREE.MeshPhysicalMaterial({ color: 0xdde8ff, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.05, depthWrite: false, side: THREE.BackSide })));
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.02, 8, 48), new THREE.MeshPhysicalMaterial({ color: 0xdde8ff, roughness: 0.1, transparent: true, opacity: 0.5 })); lip.rotation.x = Math.PI / 2; lip.position.y = 3.04; tubeG.add(lip); }
  const TH = 2.4, TR = 0.36, HR = 0.45 * (TH + TR) - TR;   // жидкость до y=2.4; эритроциты — 45% объёма
  const rbcLayM = new THREE.MeshPhysicalMaterial({ color: 0x8a1420, roughness: 0.3, clearcoat: 0.8, emissive: 0x300408, emissiveIntensity: 0.3 });
  const botM = new THREE.Mesh(new THREE.SphereGeometry(TR, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), rbcLayM); tubeG.add(botM);
  const unitCyl = () => { const g = new THREE.CylinderGeometry(TR, TR, 1, 40); g.translate(0, 0.5, 0); return g; };
  const rbcCol = new THREE.Mesh(unitCyl(), rbcLayM), buffy = new THREE.Mesh(unitCyl(), new THREE.MeshPhysicalMaterial({ color: 0xf4f0e8, roughness: 0.5, emissive: 0x404040, emissiveIntensity: 0.4, transparent: true }));
  const plasmaM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2d870).multiplyScalar(0.8), roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.7, emissive: 0x3a3008, emissiveIntensity: 0.4, depthWrite: false }), plasma = new THREE.Mesh(unitCyl(), plasmaM);
  tubeG.add(rbcCol, buffy, plasma);
  function setTube(k) { const e = smooth(0, 1, k), hr = lerp(TH, HR, e), bh = 0.05 * smooth(0.6, 1, k); rbcCol.scale.y = hr; buffy.position.y = hr; buffy.scale.y = Math.max(0.001, bh); buffy.material.opacity = smooth(0.6, 1, k);
    plasma.position.y = hr + bh; plasma.scale.y = Math.max(0.001, TH - hr - bh); rbcLayM.color.setHex(0x8a1420).lerp(new THREE.Color(0x5a0810), e); }
  setTube(0);
  /* ---------- рана и фибрин ---------- */
  const WOUND = V3(0.3, R, 0.0);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: 0x1a0306 })); hole.position.copy(WOUND).add(V3(0, 0.2, 0)); hole.rotation.x = -Math.PI / 2; hole.scale.set(1.6, 1, 0.01); hole.visible = false; ves.add(hole);
  // нити фибрина прижаты к ране
  const fibG = []; for (let i = 0; i < 70; i++) { const a = V3(WOUND.x + rand(-0.8, 0.8), R + rand(-0.25, 0.1), rand(-0.45, 0.45)), b = a.clone().add(randUnit().multiply(V3(1, 0.3, 1)).normalize().multiplyScalar(rand(0.25, 0.4))); fibG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, a.clone().lerp(b, 0.5).add(randUnit().multiplyScalar(0.1)), b]), 8, 0.008, 4)); }
  const fibMat = new THREE.MeshBasicMaterial({ color: 0xf8f0d8, transparent: true, opacity: 0 }); const fib = new THREE.Mesh(mergeGeometries(fibG), fibMat); ves.add(fib);
  /* ---------- группы крови ---------- */
  const grp = new THREE.Group(); grp.position.set(30, 0, 0); scene.add(grp); grp.visible = false;
  const drop = displaceGeo(new THREE.SphereGeometry(1.9, 48, 36), (v) => { v.y *= 0.62; });
  grp.add(new THREE.Mesh(drop, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2e08a).multiplyScalar(0.35), roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.18, depthWrite: false })), new THREE.Mesh(drop, glassMat(0xffe8a0, { rim: 0.25, base: 0.008, pow: 2 })));
  const NG = 46, gI = new THREE.InstancedMesh(rbcG, rbcMat, NG); grp.add(gI);
  const GC = Array.from({ length: NG }, () => ({ p: V3(rand(-1.4, 1.4), rand(-0.6, 0.6), rand(-1.2, 1.2)), q: new THREE.Quaternion().setFromAxisAngle(randUnit(), rnd() * 6), w: randUnit(), cl: Math.floor(rnd() * 5) }));
  const CL = Array.from({ length: 5 }, () => V3(rand(-1.0, 1.0), rand(-0.3, 0.3), rand(-0.8, 0.8)));
  const antI = new THREE.InstancedMesh(mergeGeometries([new THREE.CylinderGeometry(0.007, 0.007, 0.04, 5).translate(0, -0.015, 0), new THREE.SphereGeometry(0.022, 8, 6).translate(0, 0.012, 0)]), new THREE.MeshBasicMaterial({ color: 0xffffff }), NG * 6); grp.add(antI);  // антиген: «бусина на ножке»
  const abG = (() => { const a = []; [[0, -0.07, 0, 0.07], [0.027, 0.029, -0.75, 0.04], [-0.027, 0.029, 0.75, 0.04]].forEach(([x, y, r, l]) => { const g = new THREE.CylinderGeometry(0.009, 0.009, l * 2, 5); g.rotateZ(r); g.translate(x, y, 0); a.push(g); }); [1, -1].forEach((s) => a.push(new THREE.SphereGeometry(0.013, 6, 4).translate(0.055 * s, 0.059, 0))); return mergeGeometries(a); })();  // антитело — Y
  const abI = new THREE.InstancedMesh(abG, new THREE.MeshBasicMaterial({ color: 0x8a8a8a }), 80); grp.add(abI);
  const AB = Array.from({ length: 80 }, () => ({ p: V3(rand(-1.6, 1.6), rand(-0.8, 0.8), rand(-1.3, 1.3)), r: randUnit(), a: rnd() * 6 }));
  const fx = new Sparks(2400, 0.06); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'flow', sel: null, labels: true, rot: false, fly: null, msg: null, cutT: -99, spinT: -99, spin: 0, donor: 'A', recip: 'B', mixT: -99, agg: 0 };
  const compatible = () => BL_GROUPS[st.donor].a.every((ag) => !BL_GROUPS[st.recip].ab.includes(ag));
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); rbcMat.emissiveIntensity = st.sel === 'rbc' ? 0.8 : 0.12; pltMat.emissiveIntensity = st.sel === 'plt' ? 1.4 : 0.4; nucMat.emissiveIntensity = st.sel === 'wbc' ? 1.4 : 0.6; st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; ves.visible = m === 'flow' || m === 'clot'; grp.visible = m === 'groups'; tubeG.visible = m === 'tube'; st.fly = VIEW[m]; if (m === 'groups') mix(); if (m === 'tube') spin(); refs.setInfo && refs.setInfo(); }
  function cut() { if (st.mode !== 'clot') setMode('clot'); st.cutT = st.t; PLT.forEach((p) => { p.act = 0; p.tgt = null; }); RBC.forEach((r) => { r.stuck = 0; }); st.stage = -1; }
  function spin() { if (st.mode !== 'tube') { setMode('tube'); return; } st.spinT = st.t + (st.fly ? 1.2 : 0); st.spin = 0; }
  function mix() { st.mixT = st.t; st.agg = 0; refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'flow') select(id); });
  const CLOT_STAGES = [
    [0, '<b>1. Vascular spasm.</b> The damaged wall contracts reflexively — bleeding decreases. Blood flows out of the wound.'],
    [1.5, '<b>2. Platelet plug.</b> Platelets stick to the exposed collagen of the wall and become activated — they put out projections and release substances that attract more platelets — and clump into a loose plug.'],
    [4.5, '<b>3. Coagulation.</b> A cascade of clotting factors (calcium and vitamin K are required) converts prothrombin into thrombin, and thrombin converts soluble fibrinogen into fibrin threads. The fibrin mesh entangles the plug and red blood cells — a clot forms. The whole process takes a few minutes (in a test tube, by the Lee–White method, 5–10 min).'],
    [8, '<b>4. Retraction and healing.</b> The clot contracts, pulling the edges of the wound together. Then the cells of the wall repair it, and the fibrin is dissolved (fibrinolysis). In hemophilia one of the factors is missing — the blood barely clots.'],
  ];
  const m4 = new THREE.Matrix4(), C_P = new THREE.Color(0xf2e08a), C_R = new THREE.Color(0xc02030);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    const k = t - st.cutT, wounded = st.mode === 'clot' && k > 0;
    hole.visible = wounded; const flowK = wounded ? 0.35 : 1;
    if (wounded) { const si = CLOT_STAGES.filter((s) => k >= s[0]).length - 1; if (si !== st.stage) { st.stage = si; st.msg = CLOT_STAGES[si][1]; refs.setInfo(); } }
    fibMat.opacity = wounded ? smooth(4.5, 8, k) * 0.9 : 0;
    // эритроциты: параболический профиль
    RBC.forEach((c, i) => {
      if (c.stuck) { m4.compose(V3(c.sx, c.sy, c.sz), c.q, V3(1, 1, 1)); rbcI.setMatrixAt(i, m4); return; }
      const rr = Math.hypot(c.y, c.z) / R; c.x += dt * 1.6 * flowK * (1 - rr * rr); if (c.x > L / 2) c.x -= L;
      c.q.multiply(new THREE.Quaternion().setFromAxisAngle(c.w, dt * 0.8));
      if (wounded && k > 4.5 && k < 9 && Math.abs(c.x - WOUND.x) < 0.7 && c.y > R - 0.6 && rnd() < dt * 2) { c.stuck = 1; c.sx = c.x; c.sy = R - rnd() * 0.25; c.sz = c.z; }
      m4.compose(V3(c.x, c.y, c.z), c.q, V3(1, 1, 1)); rbcI.setMatrixAt(i, m4);
    });
    rbcI.instanceMatrix.needsUpdate = true;
    // тромбоциты
    let na = 0;
    PLT.forEach((p, i) => {
      if (wounded && k > 1.2 && !p.tgt && rnd() < dt * 0.9) p.tgt = WOUND.clone().add(V3(rand(-0.6, 0.6), rand(-0.25, 0.05), rand(-0.35, 0.35)));
      if (p.tgt) { const v = V3(p.x, p.y, p.z).lerp(p.tgt, Math.min(1, dt * 1.5)); p.x = v.x; p.y = v.y; p.z = v.z; p.act = Math.min(1, p.act + dt); }
      else { const rr = Math.hypot(p.y, p.z) / R; p.x += dt * 1.4 * flowK * (1 - rr * rr); if (p.x > L / 2) p.x -= L; p.q.multiply(new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), dt)); }
      m4.compose(V3(p.x, p.y, p.z), p.q, V3(1, 1, 1).multiplyScalar(p.act > 0.5 ? 0.001 : 1)); pltI.setMatrixAt(i, m4);
      if (p.act > 0.5) { m4.compose(V3(p.x, p.y, p.z), p.q, V3(1, 1, 1)); pltAct.setMatrixAt(na++, m4); }
    });
    pltI.instanceMatrix.needsUpdate = true; pltAct.count = na; pltAct.instanceMatrix.needsUpdate = true;
    if (!wounded) PLT.forEach((p) => { p.tgt = null; p.act = 0; });
    // лейкоциты катятся у стенки
    WBC.forEach((w) => { w.x += dt * 0.25 * flowK; if (w.x > L / 2) w.x -= L; w.g.position.set(w.x, w.y, w.z); w.g.rotation.z -= dt * 0.5; if (w.lab) w.lab.pos.set(w.x + 0.1, w.y + 0.15, w.z + WR[w.kind] + 0.12); });
    // пробирка: 4 с центрифуги, потом слои
    if (st.mode === 'tube') { const ks = (t - st.spinT) / 4; st.spin = Math.min(1, Math.max(0, ks)); setTube(st.spin); tubeG.rotation.y += dt * (st.spin < 1 ? 6 * (1 - st.spin) : 0.3); }
    if (wounded && k < 6) for (let j = 0; j < 4; j++) fx.spawn(WOUND.clone().add(V3(rand(-0.4, 0.4), 0.15, rand(-0.25, 0.25))), V3(rand(-0.3, 0.3), 0.8 + rnd() * 0.6, rand(-0.3, 0.3)).multiplyScalar(1 - smooth(1.5, 6, k)), C_R, 1.0, 0.8, 1.4);
    if (st.mode === 'flow' && rnd() < 0.6) fx.spawn(V3(-L / 2, rand(-R * 0.8, R * 0.8), rand(-R * 0.8, R * 0.8)), V3(1.5, 0, 0), C_P, 4, 0, 0.5);
    // группы крови
    if (st.mode === 'groups') {
      const bad = !compatible(), km = t - st.mixT; st.agg += ((bad && km > 1 ? 1 : 0) - st.agg) * Math.min(1, dt * 0.8);
      const tint = st.donor === 'A' ? 0xb02030 : st.donor === 'B' ? 0xa02848 : st.donor === 'AB' ? 0xa03040 : 0xb82828;
      let ai = 0; const ag = BL_GROUPS[st.donor].a, AGC = { A: new THREE.Color(0xffd34a), B: new THREE.Color(0x4fd0ff) };
      GC.forEach((c, i) => { c.q.multiply(new THREE.Quaternion().setFromAxisAngle(c.w, dt * 0.5 * (1 - st.agg))); const home = c.p, tgt = CL[c.cl].clone().add(c.w.clone().multiplyScalar(0.28)); const p = home.clone().lerp(tgt, st.agg).add(V3(Math.sin(t + i) * 0.03, Math.cos(t * 0.8 + i) * 0.03, 0)); m4.compose(p, c.q, V3(1, 1, 1)); gI.setMatrixAt(i, m4);
        ag.forEach((g2, gi) => { for (let j = 0; j < 3; j++) { const n = V3(Math.cos(j * 2.1 + gi), 0, Math.sin(j * 2.1 + gi)).applyQuaternion(c.q); m4.compose(p.clone().addScaledVector(n, 0.42), new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), n), V3(1, 1, 1)); antI.setMatrixAt(ai, m4); antI.setColorAt(ai, AGC[g2]); ai++; } }); });
      gI.instanceMatrix.needsUpdate = true; antI.count = ai; antI.instanceMatrix.needsUpdate = true; if (antI.instanceColor) antI.instanceColor.needsUpdate = true;
      const abs = BL_GROUPS[st.recip].ab; let bi = 0;
      AB.forEach((a, i) => { if (!abs.length) return; const g2 = abs[i % abs.length]; a.a += dt; a.p.add(V3(Math.sin(t * 0.7 + i) * dt * 0.1, Math.cos(t * 0.5 + i * 1.3) * dt * 0.08, 0)); m4.compose(a.p, new THREE.Quaternion().setFromAxisAngle(a.r, a.a), V3(1.3, 1.3, 1.3)); abI.setMatrixAt(bi, m4); abI.setColorAt(bi, AGC[g2]); bi++; });
      abI.count = bi; abI.instanceMatrix.needsUpdate = true; if (abI.instanceColor) abI.instanceColor.needsUpdate = true;
      rbcMat.color.setHex(tint).multiplyScalar(0.7);
    }
    fx.update(dt);
  }
  // состав плазмы (Неттер, BP 15): вода/белки/прочее и доли белков
  const PL_BARS = [['Plasma', [['water', 92, '#7FB8E8'], ['proteins', 7, '#F2D060'], ['other', 1, '#B0B0B0']]], ['Plasma proteins', [['albumins', 60, '#F2D060'], ['globulins', 35, '#E0A040'], ['fibrinogen', 4, '#F8F0D8']]]];
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); const on = st.mode === 'tube' || (st.mode === 'flow' && st.sel === 'plasma'); scopeShow(on); if (!on) return;
    const small = w < 330, fs = small ? 9 : 10; let y = 4;
    PL_BARS.forEach(([title, parts]) => { ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '600 ' + (fs + 1) + 'px Inter, sans-serif'; ctx.fillText(title, 10, y + 10);
      let x = 10; const bw = w - 20, by = y + 15, bh = small ? 7 : 9;
      parts.forEach(([, p, c]) => { const ww = bw * p / 100; ctx.fillStyle = c; ctx.fillRect(x, by, Math.max(1.5, ww - 1), bh); x += ww; });
      ctx.font = '500 ' + fs + 'px JetBrains Mono, monospace'; let lx = 10, ly = by + bh + 11;
      parts.forEach(([n, p, c]) => { const s2 = n + ' ' + p + '%', tw = ctx.measureText(s2).width + 10; if (lx + tw > w - 6) { lx = 10; ly += fs + 3; } ctx.fillStyle = c; ctx.fillRect(lx, ly - 7, 7, 7); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText(s2, lx + 10, ly); lx += tw + (small ? 8 : 12); });
      y = ly + 6; });
  }
  const TXT = {
    tube: '<b>Blood in a test tube.</b> Spin a tube of blood in a centrifuge and the cells settle: heavy red cells at the bottom (about 45% of the volume — the <b>hematocrit</b>), above them a thin whitish film of white cells and platelets (under 1%), and clear yellow <b>plasma</b> on top (about 55%). A low hematocrit points to anemia, a high one to thickened blood (dehydration, life at high altitude).',
    flow: '<b>Blood</b> is a liquid tissue: plasma (55%) and formed elements (45%). In an artery, cells flow faster in the center and slower near the wall. The arterial wall has three layers: the intima (endothelium and elastic membrane), the media (smooth muscle) and the outer adventitia with its own vessels and nerve. Red cells carry gases, white cells defend, platelets stop bleeding. All of them are born in red bone marrow from stem cells. Click a cell.',
    clot: '<b>Blood clotting.</b> Click “Cut” to damage the vessel wall, and watch how the body stops the bleeding.',
    groups: '<b>ABO blood groups.</b> Red blood cells may carry antigen A (yellow spikes) and antigen B (blue). The plasma contains antibodies against the antigens the person lacks (Y-shaped). If the recipient’s antibodies meet their antigens on the donor’s red cells, the cells clump together — <b>agglutination</b>, which is life-threatening. Choose a donor and a recipient.',
  };
  const grpTxt = () => { const ok = compatible(); return `<b>Donor ${st.donor} → recipient ${st.recip}: ${ok ? 'compatible' : 'incompatible!'}</b> ${ok ? 'The recipient’s plasma has no antibodies against the donor’s antigens — the red blood cells float freely.' : 'The recipient’s antibodies (' + BL_GROUPS[st.recip].ab.join(' и ') + ') bind the donor’s antigens — the red blood cells clump together.'} Group O (I) is the “universal donor” of red blood cells, and AB (IV) is the “universal recipient”. In practice, only blood of the same group is transfused, and the Rh factor is also taken into account.`; };
  const labels = [
    { text: 'red blood cell', pos: V3(-1.6, 0.4, 0.9), color: '#E0505A', show: () => st.labels && st.mode === 'flow' },
    ...[['neu', 'neutrophil · 50–70%', '#E8E8F8'], ['lym', 'lymphocyte · 20–30%', '#E8E8F8'], ['mon', 'monocyte · 2–8%', '#E8E8F8'], ['eos', 'eosinophil · 1–4%', '#FFB08A'], ['bas', 'basophil · <1%', '#B8A0F0']].map(([k, tx, c]) => { const w = WBC.find((q) => q.kind === k); w.lab = { text: tx, pos: V3(0, 0, 0), color: c, show: () => st.labels && st.mode === 'flow' && !(MOBB && (k === 'eos' || k === 'bas')) }; return w.lab; }),
    { text: 'intima', pos: V3(-3.6, Math.sin(Math.PI * 1.85) * R, Math.cos(Math.PI * 1.85) * R + 0.05), color: '#F2C0C8', show: () => st.labels && st.mode === 'flow' },
    { text: 'media: smooth muscle', pos: V3(-3.6, Math.sin(Math.PI * 1.85) * (R + 0.13), Math.cos(Math.PI * 1.85) * (R + 0.13) + 0.05), color: '#E08080', show: () => st.labels && st.mode === 'flow' },
    { text: 'adventitia', pos: V3(-3.6, Math.sin(Math.PI * 1.85) * (R + 0.3), Math.cos(Math.PI * 1.85) * (R + 0.3) + 0.05), color: '#E0D0A8', show: () => st.labels && st.mode === 'flow' },
    { text: 'vasa vasorum', pos: V3(2.6, Math.sin(Math.PI * 0.55) * (R + 0.35), Math.cos(Math.PI * 0.55) * (R + 0.35)), color: '#E0505A', show: () => st.labels && st.mode === 'flow' && !MOBB },
    { text: 'wall nerve', pos: V3(-1.6, Math.sin(Math.PI * 1.25) * (R + 0.32), Math.cos(Math.PI * 1.25) * (R + 0.32)), color: '#F2D060', show: () => st.labels && st.mode === 'flow' && !MOBB },
    { text: 'vessel wall', pos: V3(3.6, R + 0.2, -0.5), color: '#E8A0A8', show: () => st.labels && st.mode === 'clot' },
    { text: 'plasma ≈ 55%', pos: V3(60.45, 1.9, 0.2), color: '#F2E08A', show: () => st.labels && st.mode === 'tube' && st.spin > 0.95 },
    { text: 'white cells and platelets < 1%', pos: V3(60.45, HR + 0.03, 0.2), color: '#F4F0E8', show: () => st.labels && st.mode === 'tube' && st.spin > 0.95 },
    { text: 'red cells ≈ 45% (hematocrit)', pos: V3(60.45, 0.35, 0.2), color: '#E0505A', show: () => st.labels && st.mode === 'tube' && st.spin > 0.95 },
    { text: 'wound', pos: WOUND.clone().add(V3(0.7, 0.3, 0.3)), color: '#ff6a5a', show: () => st.labels && st.mode === 'clot' && st.t > st.cutT },
    { text: 'fibrin threads', pos: WOUND.clone().add(V3(-0.9, 0.2, 0.4)), color: '#f8f0d8', show: () => st.labels && st.mode === 'clot' && st.t - st.cutT > 5 },
    { text: 'recipient plasma', pos: V3(31.6, 0.9, 0.5), color: '#F2E08A', show: () => st.labels && st.mode === 'groups' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'groups' ? grpTxt() : st.mode === 'flow' && st.sel ? BL_CELLS.find((c) => c.id === st.sel).text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'flow', label: 'Blood cells' }, { id: 'clot', label: 'Clotting' }, { id: 'groups', label: 'Blood groups' }, { id: 'tube', label: 'Test tube' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'All' }, ...BL_CELLS.map((c) => ({ id: c.id, label: c.name, color: c.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'flow') setMode('flow'); select(v); });
    const G4 = ['O', 'A', 'B', 'AB'].map((g) => ({ id: g, label: g === 'O' ? '0 (I)' : g === 'A' ? 'A (II)' : g === 'B' ? 'B (III)' : 'AB (IV)' }));
    refs.dSeg = seg(G4, () => st.donor, (v) => { st.donor = v; if (st.mode !== 'groups') setMode('groups'); else mix(); });
    refs.rSeg = seg(G4, () => st.recip, (v) => { st.recip = v; if (st.mode !== 'groups') setMode('groups'); else mix(); });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–4', refs.modeSeg), group('Composition', 'click', refs.seg), group('Experiment', 'C · S', button('Cut', cut, true), button('Centrifuge', spin)), group('Donor', '', refs.dSeg), group('Recipient', '', refs.rSeg), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['flow', 'clot', 'groups', 'tube'][n - 1]); return true; }
    if (k === 'c' || k === 'с') { cut(); return true; }
    if (k === 's' || k === 'ы') { spin(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'tube' ? [['Hematocrit', '40–45', '%'], ['Plasma', '≈ 55', '%'], ['Plasma protein', '65–80', 'g/L']] : st.mode === 'groups' ? [['Compatibility', compatible() ? 'yes' : 'no', '']] : [['Red blood cells', '4–5', 'million/µL'], ['White blood cells', '4–9', 'thousand/µL'], ['Platelets', '150–400', 'thousand/µL']]; }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#E0505A',
    kicker: 'Body · blood', title: 'Blood',
    lede: 'Five liters of liquid tissue: 25 trillion red blood cells, an army of white blood cells, and platelets that seal any small wound within minutes.',
    notes: `
      <div><h2>Functions of blood</h2><ul>
        <li>Transport: oxygen and CO₂, nutrients, hormones, metabolic products.</li><li>Defense: white blood cells, antibodies, clotting.</li><li>Regulation: temperature, pH, water and salt balance.</li></ul>
        <h3>History</h3><p>Blood groups were discovered by Karl Landsteiner in 1900 (Nobel Prize, 1930), and the Rh factor by him and Wiener in 1940. Only after that did transfusion become safe.</p></div>
      <div><h2>Simplifications</h2><ul><li>Cells are magnified about 50,000 times, and their density is reduced.</li><li>Clotting in the scene takes seconds; in real life it takes minutes.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li>click: cells</li><li><code>C</code> cut</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeBlood };
