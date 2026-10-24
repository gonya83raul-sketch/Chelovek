import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, branchTree, dimOthers, displaceGeo, ell3, envTex, flowTubeMat, flyStep, flyTarget, glassMat, glowNucleus, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, organMat, pickOn, rand, randUnit, range, rnd, scopeShow, seg, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · СЕРДЦЕ И КРОВООБРАЩЕНИЕ
   ========================================================= */
const HT_PARTS = [
  { id: 'ra', name: 'Правое предсердие', color: '#5B7CE0', text: '<b>Правое предсердие</b> принимает венозную кровь от всего тела по верхней и нижней полым венам. В его стенке — синусовый узел, водитель ритма сердца.' },
  { id: 'rv', name: 'Правый желудочек', color: '#4A68D0', text: '<b>Правый желудочек</b> через лёгочный ствол гонит бедную кислородом кровь в лёгкие — малый круг. Давление здесь невысокое (около 25 мм рт. ст.), поэтому стенка тонкая, 3–5 мм.' },
  { id: 'la', name: 'Левое предсердие', color: '#E0605A', text: '<b>Левое предсердие</b> принимает насыщенную кислородом кровь из лёгких по четырём лёгочным венам.' },
  { id: 'lv', name: 'Левый желудочек', color: '#D04848', text: '<b>Левый желудочек</b> выбрасывает кровь в аорту — большой круг. Давление до 120 мм рт. ст., стенка самая толстая, 10–15 мм.' },
  { id: 'valve', name: 'Клапаны', color: '#F2E6C8', text: '<b>Клапаны</b> пропускают кровь только в одну сторону. Между предсердиями и желудочками — трёхстворчатый (справа) и двустворчатый, митральный (слева); их створки удерживают сухожильные нити. На выходе — полулунные клапаны лёгочного ствола и аорты. Захлопывание клапанов — это тоны сердца, «лаб-даб».' },
  { id: 'ves', name: 'Крупные сосуды', color: '#C8A0A8', text: '<b>Крупные сосуды.</b> Аорта (из левого желудочка) — самая большая артерия, около 2,5 см в диаметре. Лёгочный ствол делится на правую и левую лёгочные артерии. В правое предсердие впадают верхняя и нижняя полые вены, в левое — четыре лёгочные вены.' },
  { id: 'cor', name: 'Венечные артерии', color: '#FF6A4A', text: '<b>Венечные (коронарные) артерии</b> отходят от самого начала аорты и питают сердечную мышцу. Их закупорка тромбом — инфаркт миокарда: участок мышцы без кислорода погибает.' },
];
function makeHeart() {
  __set_rnd(mulberry(1212));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0xff7a6a);
  const VIEW = { heart: flyTarget(V3(0.05, -0.85, 0), V3(2.0, -0.2, 8.9)), cond: flyTarget(V3(0.05, -0.85, 0), V3(-1.6, -0.2, 8.8)), circ: flyTarget(V3(0.1, 0.9, 0), V3(3.6, 3.4, 13.5)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.heart.pos);
  const controls = makeControls(camera, VIEW.heart.target); controls.minDistance = 2; controls.maxDistance = 25;
  const hg = new THREE.Group(); scene.add(hg);
  const PART = Object.fromEntries(HT_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}, parent = hg) => { const m = organMat(PART[id].color, o.k ?? 0.42, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  /* ---------- камеры (объёмы крови) ---------- */
  const CH = {
    ra: { c: V3(-0.55, 0.32, 0.08), r: V3(0.36, 0.38, 0.34) }, la: { c: V3(0.32, 0.48, -0.42), r: V3(0.4, 0.28, 0.28) },
    rv: { c: V3(-0.08, -0.38, 0.32), r: V3(0.44, 0.55, 0.24) }, lv: { c: V3(0.38, -0.36, -0.06), r: V3(0.36, 0.64, 0.36) },
  };
  const chMesh = {};
  Object.entries(CH).forEach(([id, ch]) => {
    const g = displaceGeo(new THREE.SphereGeometry(1, 40, 30), (v) => { if (id === 'lv' || id === 'rv') { const k = v.y < 0 ? 1 - 0.55 * (-v.y) ** 1.6 : 1; v.x *= k; v.z *= k; } v.multiplyScalar(1 + 0.03 * noise3(v.x * 4, v.y * 4, v.z * 4)); });
    g.scale(ch.r.x, ch.r.y, ch.r.z); if (id === 'lv' || id === 'rv') g.rotateZ(0.42);
    const m = add(id, g, { k: 0.5, mat: { emissiveIntensity: 0.12, transparent: true, opacity: 0.95 } }); m.position.copy(ch.c); chMesh[id] = m;
  });
  /* ---------- миокард: внешняя оболочка ---------- */
  const myoG = displaceGeo(new THREE.SphereGeometry(1, 96, 72), (v) => {
    let x = v.x * 0.98, y = v.y * 1.18, z = v.z * 0.82;
    if (y < 0) { const k = 1 - 0.62 * Math.pow(-y / 1.18, 1.5); x *= k; z *= k; }
    x += 0.0; const n = 0.025 * noise3(v.x * 3, v.y * 3, v.z * 3); const L = Math.hypot(x, y, z); const s = 1 + n / L; v.set(x * s, y * s, z * s);
  });
  myoG.rotateZ(0.42); myoG.translate(0.06, -0.2, -0.02);
  const myoMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xb8444a).multiplyScalar(0.55), roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color(0xff9aa0), envMapIntensity: 0.4, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide });
  const myo = new THREE.Mesh(myoG, myoMat); hg.add(myo);
  const myoGlass = new THREE.Mesh(myoG, glassMat(0xff9a9a, { rim: 0.35, base: 0.01, pow: 2.2 })); hg.add(myoGlass);
  // жир в бороздах и межжелудочковая перегородка
  const septum = add('lv', (() => { const g = new THREE.CylinderGeometry(0.42, 0.06, 1.15, 24, 1); g.scale(1, 1, 0.18); g.rotateY(-0.9); g.rotateZ(0.42); g.translate(0.18, -0.42, 0.14); return g; })(), { k: 0.35, mat: { color: new THREE.Color(0x9a3a40).multiplyScalar(0.5) } });
  /* ---------- сосуды ---------- */
  const vesC = {
    svc: [V3(-0.56, 1.5, -0.05), V3(-0.56, 1.0, -0.02), V3(-0.55, 0.62, 0.02)],
    ivc: [V3(-0.5, -0.02, -0.12), V3(-0.52, -0.5, -0.22), V3(-0.52, -1.35, -0.25)],
    aorta: [V3(0.1, 0.12, 0.02), V3(0.02, 0.62, 0.08), V3(0.0, 1.05, 0.02), V3(0.18, 1.3, -0.25), V3(0.36, 1.15, -0.6), V3(0.38, 0.5, -0.72), V3(0.36, -1.35, -0.7)],
    pt: [V3(0.0, 0.3, 0.46), V3(0.05, 0.62, 0.42), V3(0.08, 0.85, 0.22)],
    lpa: [V3(0.08, 0.85, 0.22), V3(0.45, 0.95, 0.0), V3(1.05, 0.88, -0.25)],
    rpa: [V3(0.08, 0.85, 0.22), V3(-0.2, 0.86, -0.1), V3(-1.05, 0.8, -0.35)],
  };
  const VR = { svc: 0.13, ivc: 0.15, aorta: 0.16, pt: 0.15, lpa: 0.1, rpa: 0.1 };
  const VCOL = { svc: '#5B7CE0', ivc: '#5B7CE0', aorta: '#E0605A', pt: '#6C86E0', lpa: '#6C86E0', rpa: '#6C86E0' };
  const VES = {};
  Object.entries(vesC).forEach(([k, pts]) => { const c = new THREE.CatmullRomCurve3(pts); VES[k] = c; const m = add('ves', taperTube(c, (u) => VR[k] * (k === 'aorta' ? 1 - 0.25 * u : 1), 80, 16), { k: 0.5, mat: { color: new THREE.Color(VCOL[k]).multiplyScalar(0.45) } }); });
  // ветви дуги аорты
  [[V3(0.0, 1.25, -0.05), V3(-0.1, 1.75, 0.0)], [V3(0.12, 1.32, -0.18), V3(0.18, 1.8, -0.15)], [V3(0.25, 1.28, -0.35), V3(0.5, 1.7, -0.4)]].forEach((pts) => add('ves', tube(pts, 0.055, 16, 10), { k: 0.5, mat: { color: new THREE.Color('#E0605A').multiplyScalar(0.45) } }));
  // лёгочные вены
  const PV = [[V3(1.05, 0.62, -0.45), V3(0.6, 0.55, -0.48)], [V3(1.05, 0.32, -0.5), V3(0.6, 0.4, -0.5)], [V3(-0.75, 0.62, -0.55), V3(-0.2, 0.55, -0.5), V3(0.05, 0.5, -0.45)], [V3(-0.75, 0.3, -0.6), V3(-0.2, 0.35, -0.52), V3(0.05, 0.4, -0.45)]].map((pts) => { const c = new THREE.CatmullRomCurve3(pts); add('ves', taperTube(c, () => 0.075, 20, 10), { k: 0.5, mat: { color: new THREE.Color('#E0605A').multiplyScalar(0.42) } }); return c; });
  // венечные артерии
  const corPaths = [
    [V3(0.14, 0.2, 0.15), V3(0.3, 0.12, 0.42), V3(0.38, -0.3, 0.55), V3(0.5, -0.8, 0.42), V3(0.58, -1.1, 0.22)],
    [V3(0.14, 0.2, 0.1), V3(0.55, 0.1, 0.1), V3(0.78, -0.05, -0.25), V3(0.7, -0.15, -0.55)],
    [V3(0.0, 0.18, 0.18), V3(-0.4, 0.05, 0.45), V3(-0.72, -0.15, 0.25), V3(-0.62, -0.4, -0.2)],
  ];
  corPaths.forEach((pts) => { const c = new THREE.CatmullRomCurve3(pts); add('cor', taperTube(c, (u) => 0.03 * (1 - 0.5 * u), 40, 8), { k: 0.6, mat: { emissiveIntensity: 0.15 } }); for (let j = 0; j < 5; j++) { const p = c.getPointAt(0.25 + j * 0.15); const g = []; branchTree(g, p, randUnit().add(V3(0, -0.6, 0)), 0.25, 0.012, 1, { segs: 6, rad: 4 }); g.forEach((gg) => add('cor', gg, { k: 0.6 })); } });
  /* ---------- клапаны ---------- */
  const VALVES = [
    { id: 'tri', name: 'трёхстворчатый', p: V3(-0.33, -0.02, 0.2), n: V3(0.45, -0.85, 0.2), r: 0.2, n2: 3, kind: 'av' },
    { id: 'mit', name: 'митральный', p: V3(0.33, 0.1, -0.22), n: V3(0.15, -0.95, 0.25), r: 0.19, n2: 2, kind: 'av' },
    { id: 'pul', name: 'лёгочный', p: V3(0.0, 0.3, 0.46), n: V3(0.05, 1, -0.1), r: 0.14, n2: 3, kind: 'sl' },
    { id: 'aor', name: 'аортальный', p: V3(0.1, 0.12, 0.02), n: V3(-0.1, 1, 0.1), r: 0.15, n2: 3, kind: 'sl' },
  ];
  VALVES.forEach((v) => {
    const grp = new THREE.Group(); grp.position.copy(v.p); grp.quaternion.setFromUnitVectors(V3(0, 1, 0), v.n.clone().normalize()); hg.add(grp);
    add('valve', new THREE.TorusGeometry(v.r, 0.018, 8, 40).rotateX(Math.PI / 2), { k: 0.6 }, grp);
    v.leaf = [];
    for (let i = 0; i < v.n2; i++) {
      const a0 = (i / v.n2) * Math.PI * 2, piv = new THREE.Group(); piv.rotation.y = a0; grp.add(piv);
      const g = new THREE.CircleGeometry(v.r, 16, -Math.PI / v.n2, (Math.PI * 2) / v.n2); g.rotateX(-Math.PI / 2);
      const hinge = new THREE.Group(); hinge.position.x = v.r; piv.add(hinge);
      const m = add('valve', g, { k: 0.7, mat: { side: THREE.DoubleSide, transparent: true, opacity: 0.85 } }, hinge); m.position.x = -v.r; m.rotation.y = 0;
      v.leaf.push(hinge);
      if (v.kind === 'av') { const ch = []; for (let j = 0; j < 3; j++) { const a = -0.4 + j * 0.4, p0 = V3(Math.cos(a) * v.r * 0.4 - v.r * 0.55, 0, Math.sin(a) * v.r * 0.4); ch.push(new THREE.LineCurve3(p0, p0.clone().add(V3(0.05, 0.38, 0)))); } ch.forEach((c) => { const m2 = add('valve', new THREE.TubeGeometry(c, 4, 0.004, 4), { k: 0.8 }, hinge); }); }
    }
  });
  /* ---------- проводящая система ---------- */
  const cond = new THREE.Group(); hg.add(cond); cond.visible = false;
  const SA = V3(-0.5, 0.68, 0.18), AV = V3(-0.12, 0.02, 0.05), HIS = V3(0.0, -0.12, 0.1);
  const saG = glowNucleus(cond, SA, '#FFD34A', 0.05, 7), avG = glowNucleus(cond, AV, '#FFB04A', 0.045, 7);
  const condMat = new THREE.MeshBasicMaterial({ color: 0xffd080, transparent: true, opacity: 0.85 });
  const condPaths = { inter: [new THREE.CatmullRomCurve3([SA, V3(-0.4, 0.4, 0.25), V3(-0.25, 0.15, 0.15), AV]), new THREE.CatmullRomCurve3([SA, V3(-0.1, 0.6, 0.0), V3(0.3, 0.55, -0.3)])],
    his: new THREE.CatmullRomCurve3([AV, HIS]), rb: new THREE.CatmullRomCurve3([HIS, V3(0.05, -0.45, 0.22), V3(0.25, -0.85, 0.28), V3(0.45, -1.05, 0.25)]), lb: new THREE.CatmullRomCurve3([HIS, V3(0.22, -0.4, 0.05), V3(0.42, -0.8, 0.12), V3(0.55, -1.05, 0.18)]) };
  [...condPaths.inter, condPaths.his, condPaths.rb, condPaths.lb].forEach((c) => cond.add(new THREE.Mesh(new THREE.TubeGeometry(c, 30, 0.018, 6), condMat)));
  const purk = []; [condPaths.rb, condPaths.lb].forEach((c, i) => { for (let j = 0; j < 7; j++) { const arr = []; branchTree(arr, c.getPointAt(0.55 + j * 0.065), V3(i ? 1 : -1, 0.5 + rnd() * 0.5, rand(-0.8, 0.8)), 0.32, 0.01, 2, { spread: 0.7, segs: 6, rad: 4 }); purk.push(...arr); } });
  const purkMat = new THREE.MeshBasicMaterial({ color: 0xffb060, transparent: true, opacity: 0.55 }); cond.add(new THREE.Mesh(mergeGeometries(purk), purkMat));
  const wave = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new THREE.MeshBasicMaterial({ color: 0xffd34a, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); wave.position.copy(SA); cond.add(wave);

  /* ---------- кровоток внутри сердца ---------- */
  const fx = new Sparks(2600, 0.07); scene.add(fx.obj);
  const P = (c) => new THREE.CatmullRomCurve3(c);
  const FLOW = [
    { col: 0x5b7ce0, segs: [{ c: P([...vesC.svc.slice(0, 2), CH.ra.c]), g: 'fill' }, { c: P([CH.ra.c, V3(-0.33, -0.02, 0.2), CH.rv.c]), g: 'fill' }, { c: P([CH.rv.c, V3(0.0, 0.3, 0.46), ...vesC.pt.slice(1), ...vesC.lpa.slice(1)]), g: 'eject' }] },
    { col: 0x5b7ce0, segs: [{ c: P([vesC.ivc[2], vesC.ivc[1], CH.ra.c]), g: 'fill' }, { c: P([CH.ra.c, V3(-0.33, -0.02, 0.2), CH.rv.c]), g: 'fill' }, { c: P([CH.rv.c, V3(0.0, 0.3, 0.46), ...vesC.pt.slice(1), ...vesC.rpa.slice(1)]), g: 'eject' }] },
    ...PV.map((pv) => ({ col: 0xe0605a, segs: [{ c: P([pv.getPointAt(0), pv.getPointAt(1), CH.la.c]), g: 'fill' }, { c: P([CH.la.c, V3(0.33, 0.1, -0.22), CH.lv.c]), g: 'fill' }, { c: P([CH.lv.c, ...vesC.aorta]), g: 'eject' }] })),
  ];
  const parts2 = []; FLOW.forEach((f, fi) => { for (let k = 0; k < 14; k++) parts2.push({ f, si: Math.floor(rnd() * 3), u: rnd() }); });

  /* ---------- круги кровообращения в теле ---------- */
  const body = new THREE.Group(); scene.add(body); body.visible = false;
  bodyShell(body, { rim: 0.22 });
  const ghost = (g, c) => { const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.35), roughness: 0.6, transparent: true, opacity: 0.35, depthWrite: false, emissive: new THREE.Color(c), emissiveIntensity: 0.05 })); body.add(m); return m; };
  ghost(ell3(0.42, 0.62, 0.38, V3(0.55, 2.3, -0.05)), '#e8a0a8'); ghost(ell3(0.45, 0.65, 0.4, V3(-0.55, 2.3, -0.05)), '#e8a0a8');
  ghost(ell3(0.36, 0.3, 0.4, V3(0, 4.25, 0)), '#e0b8c8'); ghost(ell3(0.55, 0.28, 0.35, V3(-0.38, 1.4, 0.12)), '#9a4a3a');
  ghost(ell3(0.6, 0.4, 0.35, V3(0, 0.75, 0.15)), '#e0b0a0'); ghost(ell3(0.12, 0.2, 0.1, V3(0.48, 1.05, -0.32)), '#a05048'); ghost(ell3(0.12, 0.2, 0.1, V3(-0.48, 1.0, -0.32)), '#a05048');
  const H0 = BODY.heart, LV0 = H0.clone().add(V3(0.08, -0.05, -0.02)), RA0 = H0.clone().add(V3(-0.12, 0.05, 0.05)), RV0 = H0.clone().add(V3(-0.03, -0.06, 0.1)), LA0 = H0.clone().add(V3(0.06, 0.1, -0.1));
  const ARCH = [LV0, V3(0.1, 2.55, 0.05), V3(0.15, 2.62, -0.15)];
  const DESC = (y) => V3(0.08, y, -0.3);
  const SVC = [V3(-0.12, 2.6, 0.02), RA0], IVC = (y) => V3(-0.1, y, -0.22);
  const CIRC = [
    { name: 'мозг', big: true, pts: [...ARCH, V3(0.14, 3.3, 0.05), V3(0.05, 4.15, 0.05)], back: [V3(-0.05, 4.15, 0.05), V3(-0.16, 3.3, 0.02), ...SVC] },
    { name: 'рука', big: true, pts: [...ARCH, V3(0.55, 2.78, -0.02), V3(1.25, 2.3, -0.05), V3(1.44, 1.25, 0.02)], back: [V3(1.4, 1.25, 0.0), V3(1.3, 2.2, -0.1), V3(0.55, 2.72, -0.08), ...SVC] },
    { name: 'рука', big: true, pts: [...ARCH, V3(-0.4, 2.75, -0.02), V3(-1.25, 2.3, -0.05), V3(-1.44, 1.25, 0.02)], back: [V3(-1.4, 1.25, 0.0), V3(-1.3, 2.2, -0.1), V3(-0.5, 2.72, -0.06), ...SVC] },
    { name: 'кишечник и печень', big: true, pts: [...ARCH, DESC(1.9), DESC(1.2), V3(0.1, 0.8, 0.25)], back: [V3(-0.1, 0.85, 0.25), V3(-0.38, 1.35, 0.15), IVC(1.6), RA0] },
    { name: 'почка', big: true, pts: [...ARCH, DESC(1.9), DESC(1.1), V3(0.47, 1.02, -0.32)], back: [V3(0.45, 0.97, -0.3), IVC(1.0), IVC(1.6), RA0] },
    { name: 'нога', big: true, pts: [...ARCH, DESC(1.9), DESC(0.4), V3(0.3, -0.15, -0.1), V3(0.48, -2.0, 0.05)], back: [V3(0.44, -2.0, 0.0), V3(0.4, -0.5, -0.05), IVC(0.3), IVC(1.6), RA0] },
    { name: 'нога', big: true, pts: [...ARCH, DESC(1.9), DESC(0.4), V3(-0.3, -0.15, -0.1), V3(-0.48, -2.0, 0.05)], back: [V3(-0.44, -2.0, 0.0), V3(-0.4, -0.5, -0.05), IVC(0.3), IVC(1.6), RA0] },
    { name: 'лёгкое', big: false, pts: [RV0, V3(0.1, 2.35, 0.2), V3(0.3, 2.42, 0.0), V3(0.62, 2.3, -0.05)], back: [V3(0.6, 2.2, -0.1), V3(0.35, 2.18, -0.15), LA0] },
    { name: 'лёгкое', big: false, pts: [RV0, V3(0.1, 2.35, 0.2), V3(-0.2, 2.42, 0.0), V3(-0.62, 2.3, -0.05)], back: [V3(-0.6, 2.2, -0.1), V3(-0.2, 2.18, -0.15), LA0] },
  ].map((c) => { const a = new THREE.CatmullRomCurve3(c.pts), b = new THREE.CatmullRomCurve3([c.pts[c.pts.length - 1], ...c.back]); const la = a.getLength(), lb = b.getLength(); const ca = c.big ? '#E0605A' : '#6C86E0', cb = c.big ? '#6C86E0' : '#E0605A';
    const fa = flowTubeMat(ca, 0.3, la * 1.2), fb = flowTubeMat(cb, 0.3, lb * 1.2); fa.uniforms.uOn.value = 0.55; fb.uniforms.uOn.value = 0.55;
    body.add(new THREE.Mesh(new THREE.TubeGeometry(a, 80, 0.03, 6), fa), new THREE.Mesh(new THREE.TubeGeometry(b, 80, 0.03, 6), fb));
    const cap = glowNucleus(body, c.pts[c.pts.length - 1], c.big ? '#F2C14E' : '#7FD6FF', 0.04, 7);
    return { ...c, a, b, la, lb, fa, fb, cap };
  });
  const miniHeart = new THREE.Mesh(myoG, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xb8444a).multiplyScalar(0.6), roughness: 0.4, clearcoat: 0.6, emissive: 0x501010, emissiveIntensity: 0.4 }));
  miniHeart.scale.setScalar(0.2); miniHeart.position.copy(H0); body.add(miniHeart);
  const bodyFx = []; CIRC.forEach((c, i) => { for (let k = 0; k < 10; k++) bodyFx.push({ c, u: rnd() }); });

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'heart', sel: null, labels: true, rot: false, fly: null, hr: 72, inside: true, block: false, circ: 'all', pa: 0, pv: 0, ecg: [], msg: null, beat: 0 };
  const phaseInfo = (ph) => (ph < 0.08 ? 'диастола (наполнение)' : ph < 0.2 ? 'систола предсердий' : ph < 0.5 ? 'систола желудочков' : 'диастола (наполнение)');
  const gau = (x, m, s) => Math.exp(-(((x - m) / s) ** 2));
  function ecgAt(pa, pv) { return 0.15 * gau(pa, 0.07, 0.025) - 0.12 * gau(pv, 0.165, 0.008) + 1.0 * gau(pv, 0.18, 0.01) - 0.22 * gau(pv, 0.197, 0.01) + 0.3 * gau(pv, 0.42, 0.045); }
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(HT_PARTS.map((p) => PART[p.id]), st.sel); myoMat.opacity = st.sel ? 0.08 : (st.inside ? 0.32 : 0.95); myoMat.depthWrite = !st.sel && !st.inside; st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null;
    hg.visible = m !== 'circ'; body.visible = m === 'circ'; cond.visible = m === 'cond'; st.fly = VIEW[m];
    PART.cor.mats.forEach((mm) => { mm.opacity = m === 'cond' ? 0.15 : 1; mm.transparent = true; });
    refs.setInfo && refs.setInfo();
  }
  function setCirc(v) { st.circ = v; refs.circSeg && refs.circSeg.sync(); if (st.mode !== 'circ') setMode('circ'); CIRC.forEach((c) => { const on = v === 'all' || (v === 'big') === c.big; c.fa.uniforms.uOn.value = c.fb.uniforms.uOn.value = on ? 0.6 : 0.06; c.cap.spr.material.opacity = on ? 0.9 : 0.1; }); refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode !== 'circ') select(id); });
  const C_B = new THREE.Color(0x6c86e0), C_R = new THREE.Color(0xe0605a);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    const T = 60 / st.hr, Tv = st.block ? 60 / 38 : T;
    st.pa = (st.pa + dt / T) % 1; st.pv = st.block ? (st.pv + dt / Tv) % 1 : st.pa;
    const pa = st.pa, pv = st.pv;
    if (st.lastPv > pv) st.beat++; st.lastPv = pv;
    // сокращение
    const aC = pa > 0.08 && pa < 0.2 ? Math.sin((pa - 0.08) / 0.12 * Math.PI) : 0, vC = pv > 0.2 && pv < 0.5 ? Math.sin((pv - 0.2) / 0.3 * Math.PI) : 0;
    chMesh.ra.scale.setScalar(1 - 0.2 * aC); chMesh.la.scale.setScalar(1 - 0.2 * aC);
    chMesh.rv.scale.setScalar(1 - 0.24 * vC); chMesh.lv.scale.setScalar(1 - 0.26 * vC);
    myo.scale.set(1 - 0.04 * vC, 1 - 0.05 * vC, 1 - 0.04 * vC); myoGlass.scale.copy(myo.scale);
    miniHeart.scale.setScalar(0.2 * (1 - 0.08 * vC));
    // клапаны
    const avOpen = pv < 0.2 || pv > 0.52 ? 1 : 0, slOpen = pv > 0.24 && pv < 0.49 ? 1 : 0;
    VALVES.forEach((v) => { const target = (v.kind === 'av' ? avOpen : slOpen) * 1.15; v.open = (v.open || 0) + (target - (v.open || 0)) * Math.min(1, dt * 18); v.leaf.forEach((h2) => { h2.rotation.z = -v.open; }); });
    // кровоток
    if (st.mode !== 'circ') parts2.forEach((p) => {
      const sg = p.f.segs[p.si]; let sp = sg.g === 'eject' ? (vC > 0.05 ? 2.6 : 0.02) : (vC > 0.05 ? (p.si === 0 ? 0.25 : 0) : 0.75);
      if (sg.g === 'eject' && p.u < 0.05 && !slOpen) sp = 0;
      p.u += dt * sp; if (p.u >= 1) { p.u = 0; p.si = (p.si + 1) % 3; if (p.si === 0) p.u = rnd() * 0.2; }
      if (rnd() < 0.5) fx.spawn(p.f.segs[p.si].c.getPointAt(Math.min(1, p.u)).add(randUnit().multiplyScalar(0.03)), V3(0, 0, 0), new THREE.Color(p.f.col), 0.25, 0, 1.4);
    });
    // проводящая система
    if (st.mode === 'cond') {
      saG.spr.material.opacity = 0.3 + 0.7 * gau(pa, 0.02, 0.03); avG.spr.material.opacity = 0.3 + 0.7 * (pa > 0.08 && pa < 0.16 ? 1 : 0);
      const wv = pa < 0.1 ? pa / 0.1 : 0; wave.scale.setScalar(0.05 + wv * 0.9); wave.material.opacity = pa < 0.1 ? 0.18 * (1 - wv) : 0;
      condMat.color.setHSL(0.11, 1, 0.5 + 0.35 * gau(pv, 0.17, 0.02)); purkMat.opacity = 0.35 + 0.6 * gau(pv, 0.19, 0.015);
      const sp = (c, u) => fx.spawn(c.getPointAt(Math.min(1, Math.max(0, u))), V3(0, 0, 0), new THREE.Color(0xffd34a), 0.3, 0, 2);
      if (pa < 0.08) condPaths.inter.forEach((c) => sp(c, pa / 0.08));
      if (pv > 0.15 && pv < 0.17) sp(condPaths.his, (pv - 0.15) / 0.02);
      if (pv > 0.17 && pv < 0.2) { sp(condPaths.rb, (pv - 0.17) / 0.03); sp(condPaths.lb, (pv - 0.17) / 0.03); }
    }
    // круги
    if (st.mode === 'circ') bodyFx.forEach((b) => { const on = st.circ === 'all' || (st.circ === 'big') === b.c.big; if (!on) return; const L = b.c.la + b.c.lb; b.u += dt * 0.9 / L; if (b.u > 1) b.u -= 1; const x = b.u * L; const p = x < b.c.la ? b.c.a.getPointAt(x / b.c.la) : b.c.b.getPointAt((x - b.c.la) / b.c.lb); const art = x < b.c.la; fx.spawn(p, V3(0, 0, 0), (art === b.c.big) ? C_R : C_B, 0.3, 0, 1.6); });
    CIRC.forEach((c) => { c.fa.uniforms.uTime.value = t; c.fb.uniforms.uTime.value = t; });
    // ЭКГ
    st.ecg.push([t, ecgAt(pa, pv), (st.lastS1 !== st.beat && pv > 0.2 && pv < 0.23) ? 1 : (pv > 0.49 && pv < 0.52 ? 2 : 0)]);
    if (pv > 0.2 && pv < 0.23) st.lastS1 = st.beat;
    while (st.ecg.length && t - st.ecg[0][0] > 4) st.ecg.shift();
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); scopeShow(st.mode !== 'circ'); if (st.mode === 'circ') return;
    const x = (tt) => 8 + (1 - (st.t - tt) / 4) * (w - 16), y0 = hgt * 0.62, sc = hgt * 0.42;
    ctx.lineWidth = 2; ctx.strokeStyle = '#7FE0A0'; ctx.beginPath(); st.ecg.forEach(([tt, v], i) => { const yy = y0 - v * sc; i ? ctx.lineTo(x(tt), yy) : ctx.moveTo(x(tt), yy); }); ctx.stroke();
    ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#7FE0A0'; ctx.fillText('ЭКГ · ' + st.hr + ' уд/мин', 10, 13);
    let last = -9; st.ecg.forEach(([tt, , s]) => { if (s && tt - last > 0.08) { last = tt; ctx.fillStyle = s === 1 ? '#F2E6C8' : '#c8b8a0'; ctx.fillText(s === 1 ? 'лаб' : 'даб', x(tt) - 8, hgt - 6); } });
  }
  const TXT = {
    heart: '<b>Сердце</b> — мышечный насос размером с кулак (около 300 г). Четыре камеры: два предсердия сверху и два желудочка снизу. Правая половина (синяя) качает бедную кислородом кровь в лёгкие, левая (красная) — насыщенную кислородом кровь ко всему телу. Цикл при 75 ударах в минуту длится 0,8 с: систола предсердий 0,1 с, систола желудочков 0,3 с, общая пауза (диастола) 0,4 с. Нажмите на часть сердца.',
    cond: '<b>Проводящая система.</b> Сердце сокращается само, без команд мозга (автоматия). Импульс рождается в <b>синусовом узле</b> (60–80 раз в минуту) → волной бежит по предсердиям (зубец P на ЭКГ) → задерживается в <b>атриовентрикулярном узле</b> на 0,1 с, чтобы предсердия успели дотолкнуть кровь → по <b>пучку Гиса</b>, его ножкам и <b>волокнам Пуркинье</b> мгновенно охватывает желудочки (комплекс QRS). Зубец T — восстановление желудочков. Нервы и гормоны лишь ускоряют или замедляют ритм.',
    circ: '<b>Два круга кровообращения</b> (открыл Уильям Гарвей, 1628). <b>Большой круг:</b> левый желудочек → аорта → артерии → капилляры органов (кровь отдаёт кислород и становится венозной) → вены → полые вены → правое предсердие. <b>Малый круг:</b> правый желудочек → лёгочные артерии → капилляры лёгких (кровь забирает кислород) → лёгочные вены → левое предсердие. Полный оборот крови занимает около 20–25 секунд.',
    block: '<b>Полная атриовентрикулярная блокада.</b> Импульс из синусового узла не проходит в желудочки. Предсердия бьются в своём ритме (зубцы P), а желудочки запускает запасной водитель ритма — всего 35–40 раз в минуту, и комплексы QRS уже не связаны с P. Человеку не хватает кровотока; лечат имплантацией электрокардиостимулятора.',
  };
  const labels = [
    ...[['ra', V3(-0.95, 0.45, 0.2)], ['rv', V3(-0.35, -0.75, 0.55)], ['la', V3(0.8, 0.62, -0.4)], ['lv', V3(0.85, -0.55, 0.2)]].map(([id, p]) => ({ text: PART[id].name, pos: p, color: PART[id].color, show: () => st.labels && st.mode !== 'circ' && (!st.sel || st.sel === id) })),
    { text: 'аорта', pos: V3(0.25, 1.38, -0.2), color: '#E0605A', show: () => st.labels && st.mode === 'heart' },
    { text: 'лёгочный ствол', pos: V3(0.15, 0.75, 0.5), color: '#8CA0F0', show: () => st.labels && st.mode === 'heart' },
    { text: 'верхняя полая вена', pos: V3(-0.7, 1.35, 0.0), color: '#8CA0F0', show: () => st.labels && st.mode === 'heart' },
    { text: 'нижняя полая вена', pos: V3(-0.7, -1.1, -0.2), color: '#8CA0F0', show: () => st.labels && st.mode === 'heart' },
    { text: 'лёгочные вены', pos: V3(1.1, 0.5, -0.45), color: '#E0605A', show: () => st.labels && st.mode === 'heart' },
    ...VALVES.map((v) => ({ text: v.name + ' клапан', pos: v.p.clone().add(V3(0.05, 0.03, 0.12)), color: '#F2E6C8', show: () => st.labels && st.mode === 'heart' && (st.sel === 'valve') })),
    { text: 'синусовый узел', pos: SA.clone().add(V3(-0.1, 0.1, 0.05)), color: '#FFD34A', show: () => st.labels && st.mode === 'cond' },
    { text: 'АВ-узел', pos: AV.clone().add(V3(-0.15, -0.05, 0.1)), color: '#FFB04A', show: () => st.labels && st.mode === 'cond' },
    { text: 'пучок Гиса', pos: HIS.clone().add(V3(0.1, 0.0, 0.1)), color: '#FFD080', show: () => st.labels && st.mode === 'cond' },
    { text: 'волокна Пуркинье', pos: V3(0.75, -0.8, 0.3), color: '#FFB060', show: () => st.labels && st.mode === 'cond' },
    { text: 'мозг', pos: V3(0.2, 4.3, 0.1), color: '#F2C14E', show: () => st.labels && st.mode === 'circ' },
    { text: 'лёгкие · малый круг', pos: V3(0.85, 2.6, 0.0), color: '#7FD6FF', show: () => st.labels && st.mode === 'circ' },
    { text: 'печень', pos: V3(-0.75, 1.4, 0.2), color: '#c88a70', show: () => st.labels && st.mode === 'circ' },
    { text: 'кишечник', pos: V3(0.3, 0.6, 0.4), color: '#e0b0a0', show: () => st.labels && st.mode === 'circ' },
    { text: 'почка', pos: V3(0.7, 1.0, -0.3), color: '#c87070', show: () => st.labels && st.mode === 'circ' },
    { text: 'сердце', pos: H0.clone().add(V3(0.3, 0.05, 0.2)), color: '#FF8A7A', show: () => st.labels && st.mode === 'circ' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'cond' && st.block ? TXT.block : st.mode !== 'circ' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'heart', label: 'Строение и цикл' }, { id: 'cond', label: 'Проводящая система' }, { id: 'circ', label: 'Круги кровообращения' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...HT_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode === 'circ') setMode('heart'); select(v); });
    refs.circSeg = seg([{ id: 'all', label: 'Оба круга' }, { id: 'big', label: 'Большой', color: '#E0605A' }, { id: 'small', label: 'Малый', color: '#6C86E0' }], () => st.circ, (v) => setCirc(v));
    const hr = range('hr', 40, 180, 1, () => st.hr, (v) => { st.hr = v; }, (v) => v + ' уд/мин');
    const inside = toggle('Камеры внутри', () => st.inside, (v) => { st.inside = v; select(st.sel || 'all'); });
    const blk = toggle('АВ-блокада', () => st.block, (v) => { st.block = v; if (v && st.mode !== 'cond') setMode('cond'); refs.setInfo(); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { inside, blk, lab, hr });
    el.append(group('Режим', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 520px' }, h('div', { class: 'glabel' }, 'Части', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)),
      group('Пульс', '', hr, blk), group('Круги', '', refs.circSeg), group('Вид', 'I · R · N', inside, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['heart', 'cond', 'circ'][n - 1]); return true; }
    if (k === 'i' || k === 'ш') { refs.inside.click(); return true; } if (k === 'b' || k === 'и') { refs.blk.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { const mok = (st.hr * 70 / 1000).toFixed(1); return st.mode === 'circ' ? [['Оборот крови', '20–25', 'с'], ['Объём крови', '≈5', 'л']] : [['ЧСС', st.block ? 38 : st.hr, 'уд/мин'], ['Фаза', phaseInfo(st.pv), ''], ['Минутный объём', mok, 'л/мин']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#E0605A',
    kicker: 'Тело · кровообращение', title: 'Сердце и кровообращение',
    lede: 'Четыре камеры, четыре клапана и собственный водитель ритма. За жизнь сердце сокращается около 3 миллиардов раз и перекачивает 5 литров крови каждую минуту.',
    notes: `
      <div><h2>Как работает насос</h2>
        <p>В диастолу кровь из вен свободно стекает через открытые предсердно-желудочковые клапаны в желудочки. Систола предсердий дотолкивает последние 20–30%. В систолу желудочков давление растёт, створки захлопываются (I тон, «лаб»), открываются полулунные клапаны — кровь уходит в аорту и лёгочный ствол. Когда желудочки расслабляются, полулунные клапаны закрываются (II тон, «даб»).</p>
        <h3>Ударный и минутный объём</h3><p>За одно сокращение каждый желудочек выбрасывает около 70 мл. При 70 ударах в минуту это ~5 л/мин, при нагрузке — до 25–30 л/мин.</p></div>
      <div><h2>Регуляция</h2><ul>
        <li>Симпатические нервы и адреналин учащают и усиливают сокращения.</li><li>Блуждающий нерв (парасимпатический) замедляет ритм.</li><li>Чем сильнее растянут желудочек притекающей кровью, тем сильнее он сокращается (закон Франка — Старлинга).</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Форма сердца упрощена, камеры показаны как объёмы крови.</li><li>Схема кругов показывает главные пути, а не все сосуды.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li>клик: часть сердца</li><li><code>I</code> камеры внутри</li><li><code>B</code> блокада</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  return self;
}
export { makeHeart };
