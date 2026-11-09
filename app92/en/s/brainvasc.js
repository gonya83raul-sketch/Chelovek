import { BKP, THREE, V3, __set_rnd, bkCs, bkLs, brainKit, button, envTex, flowTubeMat, flyStep, flyTarget, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, pickOn, rnd, seg, smooth, taperTube, tissue, toggle } from '../core.js';


// @scene brainvasc makeBrainVasc | Кровоснабжение мозга | @brain Устройство
/* =========================================================
   МОЗГ · КРОВОСНАБЖЕНИЕ: 1) артериальный (виллизиев) круг на основании мозга — сонные и позвоночно-основная системы,
   соединительные артерии, мозжечковые ветви; 2) бассейны передней, средней и задней мозговых артерий на коре
   (снаружи — левое полушарие, изнутри — правое); 3) инсульт: тромб, ядро инфаркта и полутень, восстановление кровотока,
   обходной путь через круг при закупорке сонной.
   Сверено с атласом Неттера (PDF стр. 202–209: артерии мозга, круг, бассейны). Модель мозга — общая brainKit:
   x — вперёд, y — вверх, z > 0 — правое полушарие; 1 ед. ≈ 5 см.
   ========================================================= */
const BV_ART = [
  { id: 'ica', name: 'Internal carotid', col: '#E05555', text: '<b>The internal carotid arteries</b> carry about 80% of the brain\'s blood. Each enters the skull through the carotid canal, bends (the siphon) in the cavernous sinus, gives off the ophthalmic artery, and next to the optic chiasm divides into the anterior and middle cerebral arteries. A plaque where the internal carotid branches off the common carotid in the neck is a frequent cause of stroke.' },
  { id: 'aca', name: 'Anterior cerebral', col: '#5E9FEF', text: '<b>The anterior cerebral arteries</b> run forward above the optic nerves, are joined by the anterior communicating artery, and rise into the longitudinal fissure between the hemispheres. There they curve around the corpus callosum and supply the inner surface of the frontal and parietal lobes — including the cortex that controls the leg.' },
  { id: 'mca', name: 'Middle cerebral', col: '#F08A3C', text: '<b>The middle cerebral arteries</b> are the largest branches of the carotids. Each runs sideways deep into the lateral sulcus and fans out over the outer surface of the hemisphere. From its first segment, thin lenticulostriate arteries rise to the basal nuclei and internal capsule (not shown in the model); their blockage causes small (lacunar) infarcts.' },
  { id: 'acom', name: 'Anterior communicating', col: '#6FE0C0', text: '<b>The anterior communicating artery</b> is a bridge a few millimeters long between the anterior cerebral arteries. If one carotid is narrowed, blood flows across it from the other. It is the most common site of aneurysms: about a third of all brain artery aneurysms are found here.' },
  { id: 'pcom', name: 'Posterior communicating', col: '#6FE0C0', text: '<b>The posterior communicating arteries</b> link the carotids with the posterior cerebral arteries and close the circle at the back. Normally little blood flows through them, but when one system is blocked they become a detour. An aneurysm where the posterior communicating artery begins can press on the nearby oculomotor nerve — the eyelid droops and the pupil dilates.' },
  { id: 'va', name: 'Vertebral', col: '#B070E8', text: '<b>The vertebral arteries</b> branch off the subclavian arteries, rise through the cervical vertebrae, and enter the skull through the foramen magnum. Along the medulla they give off the posterior inferior cerebellar arteries, and at the lower border of the pons they join to form the basilar artery. The vertebrobasilar system brings about 20% of the brain\'s blood supply.' },
  { id: 'ba', name: 'Basilar', col: '#9C7CF0', text: '<b>The basilar artery</b> lies in a groove on the front surface of the pons. Small branches feed the pons, larger ones the cerebellum, and at the upper border of the pons it divides into the two posterior cerebral arteries. Basilar thrombosis is a severe brainstem stroke: coma or locked-in syndrome — the person is conscious and moves the eyes, but the body is paralyzed.' },
  { id: 'pca', name: 'Posterior cerebral', col: '#E8C440', text: '<b>The posterior cerebral arteries</b> are the terminal branches of the basilar artery. They wind around the cerebral peduncles and supply the thalamus, the lower surface of the temporal lobe, and the occipital lobe with the visual cortex. Their blockage knocks out the opposite half of the visual field in both eyes (hemianopia).' },
  { id: 'cbl', name: 'Cerebellar', col: '#E07AB8', text: '<b>The cerebellar arteries</b> come in three pairs: the superior arise from the top of the basilar artery, the anterior inferior from its beginning, and the posterior inferior from the vertebrals. A posterior inferior cerebellar stroke also hits the lateral medulla: dizziness, trouble swallowing, and numbness of the face on one side and of the body on the other (lateral medullary, or Wallenberg, syndrome).' },
];
const BV_TER = [
  { id: 'aca', name: 'Anterior', col: '#5E9FEF', text: '<b>The anterior cerebral artery</b> supplies the inner surface of the frontal and parietal lobes and a strip about 2 cm wide along the upper edge of the hemisphere. This is where the motor and sensory cortex for the leg lies. Its blockage causes weakness and numbness of the opposite leg, sometimes apathy and loss of bladder control.' },
  { id: 'mca', name: 'Middle', col: '#F08A3C', text: '<b>The middle cerebral artery</b> supplies most of the outer surface of the hemisphere: the motor and sensory cortex for the face and arm, and in the left hemisphere (dominant for language in most people) also Broca\'s and Wernicke\'s language areas. Its blockage is the most common major stroke: the face droops, the arm weakens, speech is impaired.' },
  { id: 'pca', name: 'Posterior', col: '#E8C440', text: '<b>The posterior cerebral artery</b> supplies the occipital lobe with the visual cortex, the lower surface of the temporal lobe, and the thalamus. Its blockage knocks out the opposite half of the visual field in both eyes. With a left-sided lesion there may be pure alexia: the person can write but cannot read what they have written.' },
];
const BV_OCC = [
  { id: 'mca', name: 'Middle cerebral', text: '<b>A clot in the left middle cerebral artery.</b> At the center of the territory flow stops, and neurons die within minutes — this is the infarct core (dark). Around it is the penumbra (orange): a little blood seeps in from neighboring arteries; the cells fall silent but stay alive. Dissolving the clot (thrombolysis) or removing it with a catheter (thrombectomy) can save the penumbra.' },
  { id: 'ica_ok', name: 'Carotid, closed circle', text: '<b>Blockage of the left internal carotid with a complete circle.</b> Blood reaches the left anterior and middle cerebral arteries by detours: from the right through the anterior communicating artery and from behind through the posterior communicating artery (blood flows through it in the reverse direction). If the carotid narrows slowly, its closure may go unnoticed.' },
  { id: 'ica_bad', name: 'Carotid, open circle', text: '<b>The same blockage, but the communicating arteries are underdeveloped</b> — as happens in many people. There is no detour, and the infarct covers the territories of the left anterior and middle cerebral arteries — almost the whole hemisphere.' },
  { id: 'ba', name: 'Basilar', text: '<b>A clot in the basilar artery.</b> The pons, most of the cerebellum, the thalamus, and both occipital lobes are left without blood. It is a rare but extremely dangerous stroke: without treatment, most patients die.' },
];
function makeBrainVasc() {
  __set_rnd(mulberry(2512));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070a); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const keyL = new THREE.DirectionalLight(0xfff2e6, 0.6); keyL.position.set(2, -9, -3); keyL.intensity = 0.9; scene.add(keyL);   // снизу: основание мозга
  const DK = !matchMedia('(max-width:700px)').matches;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200);
  const controls = makeControls(camera, V3(0, 0, 0)); controls.minDistance = 3; controls.maxDistance = 18;
  const vw = (C, dir, dist, sx, sy) => { const d = dir.clone().normalize(), f = d.clone().negate(), r = f.clone().cross(V3(0, 1, 0)).normalize(), u = r.clone().cross(f), S = r.multiplyScalar(-sx).addScaledVector(u, -sy); return flyTarget(C.clone().add(S), C.clone().addScaledVector(d, dist).add(S)); };
  const st = { mode: 'art', sel: null, ter: null, side: 'lat', occ: 'mca', tm: 0, rep: false, repA: 0, labels: true, rot: false, flow: true, fly: null, t: 0 };
  const pick = [];

  // =================== мозг ===================
  const BK = brainKit();
  const VGRAY = new THREE.Color('#7A747A'), BASEC = new THREE.Color('#D8BCB8'), GRAYC = new THREE.Color('#5A5458'), COREC = new THREE.Color('#6A1626'), PENC = new THREE.Color('#F0A040');
  const TCOL = BV_TER.map((t) => new THREE.Color(t.col));
  const brainM = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5, sheen: 0.25, sheenColor: new THREE.Color(0xffd8e0), envMapIntensity: 0.35 });
  const HM = BK.hemi.map((g0, k) => { const g = g0.clone(); g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3)); const m = new THREE.Mesh(g, brainM); m.userData.pick = 'h:' + k; scene.add(m); pick.push(m); return m; });
  const hm = (s) => HM[s > 0 ? 0 : 1];
  const stemM = tissue(new THREE.Color('#C49AA4').multiplyScalar(0.85), { roughness: 0.5 }), cereM = tissue(new THREE.Color('#C8A0A0').multiplyScalar(0.85), { roughness: 0.55 });
  stemM.clippingPlanes = [new THREE.Plane(V3(0, 1, 0), 1.78)]; stemM.side = THREE.DoubleSide;   // продолговатый мозг срезан, как на препарате
  const STEM = new THREE.Mesh(BK.stem, stemM), CERE = new THREE.Mesh(BK.cere, cereM); scene.add(STEM, CERE);
  const SH = HM.map((m) => { const s = m.geometry.attributes.sulc, a = new Float32Array(s.count); for (let i = 0; i < s.count; i++) a[i] = 0.7 + 0.3 * smooth(-0.1, 0.03, s.getX(i)); return a; });

  // =================== проекция точек на поверхность ===================
  const RC = new THREE.Raycaster();
  const cast = (mesh, o, d) => { RC.set(o, d.clone().normalize()); const hh = RC.intersectObject(mesh, false)[0]; return hh || null; };
  const off = (hh, d, k) => hh.point.clone().addScaledVector(d.clone().normalize(), -k);
  const pI = (x, z, k = 0.04) => { const d = V3(0, 1, 0), hh = cast(hm(z >= 0 ? 1 : -1), V3(x, -4, z), d); return hh ? off(hh, d, k) : V3(x, -0.6 - k, z); };
  const pL = (x, y, s, k = 0.012) => { const d = V3(0, 0, -s), hh = cast(hm(s), V3(x, y, 4 * s), d); return hh ? off(hh, d, k) : null; };
  const pM = (x, y, s, k = 0.012) => { const d = V3(0, 0, s), hh = cast(hm(s), V3(x, y, 0), d); return hh ? off(hh, d, k) : null; };
  const pT = (x, z, k = 0.012) => { const d = V3(0, -1, 0), hh = cast(hm(z >= 0 ? 1 : -1), V3(x, 4, z), d); return hh ? off(hh, d, k) : null; };
  const stemC = (y) => { let best = null, bd = 9; for (let i = 0; i <= 200; i++) { const p = BK.stemCurve.getPointAt(i / 200); if (Math.abs(p.y - y) < bd) { bd = Math.abs(p.y - y); best = p; } } return best; };
  const pS = (y, ang, s = 1, k = 0.04) => { const c = stemC(y), a = ang * Math.PI / 180, d = V3(-Math.cos(a), 0, -s * Math.sin(a)), o = V3(c.x + 3 * Math.cos(a), y, 3 * s * Math.sin(a)), hh = cast(STEM, o, d); return hh ? off(hh, d, k) : V3(c.x + 0.3 * Math.cos(a), y, 0.3 * s * Math.sin(a)); };
  const pC = (x, z, from, k = 0.03) => { const d = from === 'up' ? V3(0, 1, 0) : from === 'down' ? V3(0, -1, 0) : V3(-1, 0, 0); const o = from === 'up' ? V3(x, -4, z) : from === 'down' ? V3(x, 1, z) : V3(3, x, z); const hh = cast(CERE, o, d); return hh ? off(hh, d, k) : null; };

  // =================== сосуды ===================
  const VES = [];   // { art, s, kind, curve, r, rev }
  const cr3 = (pts) => new THREE.CatmullRomCurve3(pts.filter(Boolean), false, 'centripetal');
  const ves = (art, s, kind, pts, r) => { const c = cr3(pts); VES.push({ art, s, kind, curve: c, r }); return c; };
  const T = {}, A = {}, J = {}, CH = {};
  const chiY = pI(0.47, 0.05, 0.09).y;
  const BT = pS(-0.66, 0), VJ = pS(-1.36, 0);
  [1, -1].forEach((s) => {
    T[s] = pI(0.4, 0.2 * s, 0.05); A[s] = pI(0.6, 0.035 * s, 0.035); J[s] = pS(-0.62, 72, s, 0.05);
    CH.ica = CH.ica || {}; CH.ica[s] = ves('ica', s, 'base', [V3(0.27, -1.5, 0.2 * s), V3(0.32, -1.18, 0.21 * s), V3(0.48, -1.04, 0.2 * s), V3(0.52, -0.92, 0.2 * s), T[s]], 0.048);
    ves('ica', s, 'base', [V3(0.5, -0.97, 0.2 * s), V3(0.76, -0.93, 0.27 * s), V3(1.05, -0.88, 0.36 * s)], 0.016);   // глазная
    CH.aca = CH.aca || {}; CH.aca[s] = ves('aca', s, 'base', [T[s], pI(0.5, 0.12 * s, 0.035), A[s]], 0.028);
    // A2: в продольной щели вокруг мозолистого тела (перикаллёзная) и по поясной борозде (каллёзно-краевая), ветви через верхний край
    ves('aca', s, 'med', [A[s], pM(0.72, -0.32, s), pM(1.0, -0.06, s), pM(0.94, 0.3, s), pM(0.62, 0.45, s), pM(0.0, 0.52, s), pM(-0.6, 0.42, s), pM(-0.86, 0.24, s)], 0.022);
    ves('aca', s, 'med', [pM(1.0, -0.02, s), pM(1.16, 0.18, s), pM(1.02, 0.5, s), pM(0.55, 0.74, s), pM(0.0, 0.84, s), pM(-0.55, 0.74, s)], 0.017);
    [[1.0, 0.5], [0.55, 0.74], [0.0, 0.84], [-0.55, 0.74]].forEach(([x, y]) => ves('aca', s, 'med', [pM(x, y, s), pT(x + 0.03, 0.14 * s), pT(x + 0.06, 0.3 * s)], 0.011));
    // M1 вбок к боковой борозде, ствол в борозде, веер корковых ветвей
    const m1 = ves('mca', s, 'base', [T[s], pI(0.45, 0.38 * s, 0.04), pI(0.52, 0.6 * s, 0.04), pL(0.6, -0.32, s, 0.02)], 0.036); CH.mca = CH.mca || {}; CH.mca[s] = m1;
    const sy = (x) => pL(x, bkLs(x), s, 0.02);
    ves('mca', s, 'lat', [pL(0.6, -0.32, s, 0.02), sy(0.45), sy(0.2), sy(-0.05), sy(-0.32)], 0.026);
    const BR = [[0.45, 0, [0.75, 0.08], [0.98, 0.3]], [0.32, 0, [0.5, 0.38], [0.62, 0.42 * s]], [0.15, 0, [0.24, 0.45], [0.28, 0.42 * s]], [-0.05, 0, [-0.1, 0.48], [-0.18, 0.42 * s]],
      [-0.28, 0, [-0.5, 0.42], [-0.72, 0.42 * s]], [-0.32, 0, [-0.75, 0.15], [-1.08, 0.3]], [-0.2, -0.12, [-0.55, -0.28], [-0.98, -0.25]], [0.18, -0.12, [0.0, -0.42], [-0.32, -0.55]], [0.48, -0.12, [0.52, -0.45], [0.38, -0.66]]];
    BR.forEach(([x0, dy, m, e]) => { const top = Math.abs(e[1]) > 0.4 && Math.abs(Math.abs(e[1]) - 0.42) < 1e-6; ves('mca', s, 'lat', [pL(x0, bkLs(x0) + dy, s, 0.016), pL(m[0], m[1], s, 0.014), top ? pT(e[0], e[1], 0.014) : pL(e[0], e[1], s, 0.014)], 0.013); });
    // задняя соединительная: от конца сонной к задней мозговой
    CH.pcom = CH.pcom || {}; CH.pcom[s] = ves('pcom', s, 'base', [T[s], pI(0.28, 0.23 * s, 0.05), J[s]], 0.014);
    // задняя мозговая: вокруг ножки мозга, по нижней поверхности к шпорной борозде
    ves('pca', s, 'base', [BT, pS(-0.64, 40, s, 0.05), J[s]], 0.03);
    ves('pca', s, 'base', [J[s], pS(-0.6, 115, s, 0.05), pS(-0.57, 150, s, 0.06), pI(-0.62, 0.3 * s, 0.03), pI(-0.95, 0.24 * s, 0.03)], 0.026);
    ves('pca', s, 'med', [pI(-0.95, 0.24 * s, 0.03), pM(-1.22, -0.16, s), pM(-1.48, -0.05, s), pM(-1.68, 0.02, s)], 0.018);   // шпорная
    ves('pca', s, 'med', [pM(-1.12, -0.2, s), pM(-1.12, 0.22, s), pM(-0.98, 0.6, s)], 0.014);   // теменно-затылочная
    ves('pca', s, 'base', [pI(-0.62, 0.3 * s, 0.03), pI(-0.3, 0.6 * s, 0.025), pI(0.15, 0.72 * s, 0.025)], 0.013);   // височные
    // позвоночные, мозжечковые
    ves('va', s, 'base', [pS(-1.95, 70, s), pS(-1.8, 55, s), pS(-1.65, 30, s), VJ], 0.04);
    ves('cbl', s, 'base', [pS(-0.72, 8, s), pS(-0.74, 60, s), pS(-0.76, 110, s, 0.05), pC(-0.85, 0.42 * s, 'down'), pC(-1.15, 0.62 * s, 'down')], 0.016);   // верхняя
    ves('cbl', s, 'base', [pS(-1.22, 6, s), pS(-1.22, 60, s), pS(-1.2, 100, s, 0.05), pC(-1.15, 0.62 * s, 'front')], 0.014);   // передняя нижняя
    ves('cbl', s, 'pica', [pS(-1.8, 45, s), pS(-1.9, 110, s, 0.05), pS(-1.75, 160, s, 0.05), pC(-1.25, 0.25 * s, 'up'), pC(-1.5, 0.42 * s, 'up')], 0.015);   // задняя нижняя
  });
  CH.acom = ves('acom', 0, 'base', [A[1], A[1].clone().lerp(A[-1], 0.5).add(V3(0.012, -0.004, 0)), A[-1]], 0.016);
  CH.ba = ves('ba', 0, 'base', [VJ, pS(-1.15, 0), pS(-0.95, 0), pS(-0.8, 0), BT], 0.042);

  const LMK = [];
  // ориентиры: перекрёст, зрительные нервы и тракты, гипофиз
  const optM = tissue(new THREE.Color('#E8E0D0').multiplyScalar(0.55), { transparent: true, opacity: 0.55, depthWrite: false }), pitM = tissue(new THREE.Color('#E8B090').multiplyScalar(0.5));
  { const a = []; const C0 = V3(0.47, chiY, 0);
    [1, -1].forEach((s) => { a.push(taperTube(cr3([C0.clone().add(V3(0.02, 0, 0.03 * s)), V3(0.72, chiY - 0.04, 0.16 * s), V3(1.1, chiY - 0.12, 0.33 * s)]), () => 0.03, 20, 8));
      a.push(taperTube(cr3([C0.clone().add(V3(-0.02, 0, 0.03 * s)), pI(0.3, 0.2 * s, 0.025), pI(0.12, 0.34 * s, 0.025)]), () => 0.026, 20, 8)); });
    const x = new THREE.BoxGeometry(0.1, 0.035, 0.14); x.translate(C0.x, C0.y, C0.z); a.push(x.toNonIndexed());
    const ML = mergeGeometries(a.map((g) => (g.index ? g.toNonIndexed() : g)));
    LMK.push(new THREE.Mesh(ML, optM)); scene.add(LMK[0]);
    LMK.push(new THREE.Mesh(taperTube(cr3([V3(0.4, chiY - 0.02, 0), V3(0.39, chiY - 0.1, 0), V3(0.38, chiY - 0.18, 0)]), () => 0.022, 10, 8), pitM)); scene.add(LMK[1]);   // воронка гипофиза (срезана)
    }

  // мозолистое тело на внутренней поверхности правого полушария (вид «изнутри»)
  const CCM = new THREE.Mesh(taperTube(cr3(BKP.cc.map((p) => V3(p.x, p.y, -0.01))), (u) => 0.055 + 0.05 * smooth(0.75, 1, u) + 0.035 * (1 - smooth(0, 0.18, u)), 48, 12).scale(1, 1, 0.35), tissue(new THREE.Color('#EDE4D8').multiplyScalar(0.6)));
  CCM.visible = false; scene.add(CCM);
  // группы сосудов: одна сетка на артерию, сторону и вид; поверх — светящийся поток
  const GR = {};
  VES.forEach((v) => { const key = `${v.art}|${v.s}|${v.kind}`; (GR[key] ||= { art: v.art, s: v.s, kind: v.kind, list: [] }).list.push(v); });
  const artCol = Object.fromEntries(BV_ART.map((a) => [a.id, new THREE.Color(a.col)]));
  const VG = Object.values(GR).map((g) => {
    const geo = mergeGeometries(g.list.map((v) => taperTube(v.curve, (u) => 1.2 * v.r * (1 - 0.25 * u), Math.max(16, Math.round(v.curve.getLength() * 40)), 10)));
    const fgeo = mergeGeometries(g.list.map((v) => taperTube(v.curve, (u) => v.r * 1.5 * (1 - 0.25 * u), Math.max(16, Math.round(v.curve.getLength() * 40)), 8)));
    const m = tissue(artCol[g.art].clone().multiplyScalar(0.75), { roughness: 0.35, emissive: artCol[g.art].clone(), emissiveIntensity: 0.25 });
    const mesh = new THREE.Mesh(geo, m); mesh.userData.pick = 'a:' + g.art; scene.add(mesh); pick.push(mesh);
    const fm = flowTubeMat(artCol[g.art].clone().lerp(new THREE.Color('#ffffff'), 0.25), 0.5, 2.0); const flow = new THREE.Mesh(fgeo, fm); flow.renderOrder = 3; scene.add(flow);
    return { ...g, mesh, m, flow, fm, c0: m.color.clone(), e0: artCol[g.art].clone() };
  });
  // тромб
  const clotM = tissue(new THREE.Color('#B01830'), { roughness: 0.6, emissive: new THREE.Color('#E0203C'), emissiveIntensity: 0.8 });
  const CLOT = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), clotM); CLOT.visible = false; scene.add(CLOT);
  const clotAt = { mca: () => [CH.mca[-1].getPointAt(0.45), 0.085], ica_ok: () => [CH.ica[-1].getPointAt(0.3), 0.09], ica_bad: () => [CH.ica[-1].getPointAt(0.3), 0.09], ba: () => [CH.ba.getPointAt(0.45), 0.085] };

  // =================== бассейны ===================
  const bkPo = (y) => -1.08 - 0.08 * y;
  const terr = (p, n, s) => {
    const u = p.z * s - 0.55, x = p.x, y = p.y;
    if (u < -0.44 || n.z * s < -0.35) return x < -0.72 - 0.55 * y || (y < -0.22 && x < 0.3) ? 2 : 0;   // внутренняя поверхность: сзади от теменно-затылочной борозды и внизу — задняя
    if (n.y < -0.55) { if (x > 0.55) return u < -0.15 ? 0 : 1; return x < 0.42 ? 2 : 1; }   // нижняя поверхность
    if (x < bkPo(y) - 0.12) return 2;   // затылочный полюс
    if (y > 0.15 && u < -0.12) return 0;   // полоса по верхнему краю
    if (y < bkLs(x) - 0.42 && x < 0.2) return 2;   // нижняя височная извилина
    return 1;
  };
  const TER = HM.map((m, k) => { const g = m.geometry, P = g.attributes.position, N = g.attributes.normal, a = new Uint8Array(P.count), p = V3(0, 0, 0), n = V3(0, 0, 0);
    for (let i = 0; i < P.count; i++) { p.fromBufferAttribute(P, i); n.fromBufferAttribute(N, i); a[i] = terr(p, n, k ? -1 : 1); } return a; });
  // центры бассейнов — для роста ядра инфаркта; расстояние нормировано на самый дальний участок бассейна
  const DN = HM.map((m, k) => { const s = k ? -1 : 1, C = [pM(0.4, 0.55, s) || V3(0.4, 0.55, 0), pL(0.12, 0.02, s) || V3(0.1, 0, s), pM(-1.35, -0.05, s) || V3(-1.3, 0, 0)], P = m.geometry.attributes.position, p = V3(0, 0, 0);
    const d = new Float32Array(P.count), mx = [0, 0, 0];
    for (let i = 0; i < P.count; i++) { p.fromBufferAttribute(P, i); const t = TER[k][i]; d[i] = p.distanceTo(C[t]); mx[t] = Math.max(mx[t], d[i]); }
    for (let i = 0; i < P.count; i++) d[i] /= mx[TER[k][i]] || 1; return d; });
  const CAND = (() => { const g = HM[1].geometry, P = g.attributes.position, N = g.attributes.normal, out = [];
    for (let i = 0; i < P.count; i += 7) if (TER[1][i] === 1 && N.getZ(i) < -0.55 && P.getY(i) > -0.3) out.push([DN[1][i], V3(P.getX(i), P.getY(i), P.getZ(i)).addScaledVector(V3(N.getX(i), N.getY(i), N.getZ(i)), 0.01)]);
    return out; })();
  const candAt = (dv, yw) => { let b = null, bs = 9; CAND.forEach(([dd, p]) => { const sc = Math.abs(dd - dv) + 0.15 * Math.abs(p.y - yw); if (sc < bs) { bs = sc; b = p; } }); return b || V3(0, 0, -1); };
  const LP = { core: V3(0, 0, -1), pen: V3(0, 0, -1) };
  const placeOcc = () => { const f = coreF(); LP.core.copy(candAt(Math.max(0.04, f * 0.35), 0.1)); LP.pen.copy(candAt(Math.min(0.97, f + 0.12), 0.55)); };
  const coreF = () => Math.min(1, 0.12 + 0.88 * (1 - Math.exp(-st.tm / 180)));
  const occTer = () => ({ mca: [[1, 1]], ica_ok: [], ica_bad: [[1, 0], [1, 1]], ba: [[0, 2], [1, 2]] }[st.occ]);   // [полушарие, бассейн]
  const tmp = new THREE.Color();
  function colorBrain() {
    const occ = st.mode === 'occ' ? occTer() : [], f = coreF(), pen = st.rep ? 1 - st.repA : 1;
    HM.forEach((m, k) => { const col = m.geometry.attributes.color, a = col.array, Tk = TER[k], D = DN[k], S = SH[k];
      for (let i = 0; i < Tk.length; i++) {
        const t = Tk[i]; tmp.copy(BASEC);
        if (st.mode === 'ter') { if (!st.ter || BV_TER[t].id === st.ter) tmp.lerp(TCOL[t], 0.88); else tmp.lerp(GRAYC, 0.55); }
        else if (st.mode === 'occ' && occ.some(([kk, tt]) => kk === k && tt === t)) { if (D[i] < f) tmp.copy(COREC); else tmp.lerp(PENC, 0.78 * pen); }
        a[i * 3] = tmp.r * S[i]; a[i * 3 + 1] = tmp.g * S[i]; a[i * 3 + 2] = tmp.b * S[i];
      }
      col.needsUpdate = true; });
    const bf = st.mode === 'occ' && st.occ === 'ba' ? f : 0;
    stemM.color.set('#C49AA4').multiplyScalar(0.85).lerp(COREC, bf); cereM.color.set('#C8A0A0').multiplyScalar(0.85).lerp(st.rep ? COREC : PENC, st.mode === 'occ' && st.occ === 'ba' ? (st.rep ? bf * 0.8 : 0.7) : 0);
  }

  // =================== подсветка сосудов и потоки ===================
  const TERART = { aca: ['aca'], mca: ['mca'], pca: ['pca'] };
  function vesState(g) {
    // возвращает [видна, яркая, поток (0/1/−1)]
    if (st.mode === 'art') { const on = !st.sel || st.sel === g.art || (st.sel === 'cbl' && g.art === 'cbl'); return [true, on, st.flow && on ? (g.art === 'acom' || g.art === 'pcom' ? 0 : 1) : 0]; }
    if (st.mode === 'ter') {
      const med = st.side === 'med'; if (med && (g.s < 0 || g.s === 0)) return [false, false, 0];
      if (med && g.kind !== 'med') return [false, false, 0];
      const on = st.ter ? TERART[st.ter].includes(g.art) : ['aca', 'mca', 'pca'].includes(g.art); return [true, on, 0];
    }
    // инсульт
    const L = g.s < 0, o = st.occ, rep = st.rep;
    let fl = 1;
    if (g.art === 'acom' || g.art === 'pcom') fl = o === 'ica_ok' && (g.art === 'acom' || L) ? (g.art === 'pcom' ? -1 : 1) : 0;
    if (!rep) {
      if (o === 'mca' && L && g.art === 'mca') fl = 0;
      if ((o === 'ica_ok' || o === 'ica_bad') && L && g.art === 'ica') fl = 0;
      if (o === 'ica_bad' && L && (g.art === 'aca' || g.art === 'mca')) fl = 0;
      if (o === 'ba' && (g.art === 'pca' || g.art === 'ba' || (g.art === 'cbl' && g.kind === 'base'))) fl = 0;   // задние нижние мозжечковые — от позвоночных, кровоток в них есть
    }
    return [true, true, fl];
  }
  function colorVes() {
    VG.forEach((g) => { const [vis, on, fl] = vesState(g); g.mesh.visible = vis; g.flow.visible = vis && fl !== 0; g.fm.uniforms.uSpeed.value = 0.5 * (fl || 1);
      g.m.color.copy(g.c0); g.m.emissive.copy(g.e0); { const top = st.mode === 'art' && st.sel === g.art && g.kind !== 'lat' && g.kind !== 'med'; if (g.m.depthTest === top) { g.m.depthTest = !top; g.m.needsUpdate = true; } g.mesh.renderOrder = top ? 4 : 0; } if (!on) { g.m.color.lerp(VGRAY, 0.55); g.m.emissiveIntensity = 0.06; } else g.m.emissiveIntensity = st.mode === 'art' && st.sel === g.art ? 0.55 : 0.25;
      if (st.mode === 'occ' && fl === 0 && !(g.art === 'acom' || g.art === 'pcom')) { g.m.color.lerp(GRAYC, 0.55); g.m.emissiveIntensity = 0.05; } });
    const c = st.mode === 'occ' && !st.rep ? clotAt[st.occ]() : null; CLOT.visible = !!c; if (c) { CLOT.position.copy(c[0]); CLOT.scale.setScalar(c[1]); }
    const med = st.mode === 'ter' && st.side === 'med'; HM[1].visible = !med; STEM.visible = CERE.visible = !med; CCM.visible = med; LMK.forEach((m) => { m.visible = !med; });
  }

  // =================== виды ===================
  const VP = DK ? { art: [V3(-0.25, -0.75, 0), V3(0, -1, -0.12), 7.2, 1.25, -0.15], lat: [V3(-0.1, 0.05, 0), V3(0.02, 0.42, -1), 9.2, 1.1, 0.2], med: [V3(-0.02, 0.05, 0.1), V3(0.02, 0.06, -1), 8.0, 1.1, 0.12], occ: [V3(-0.05, -0.35, 0), V3(0.35, -0.5, -1), 9.6, 1.1, -0.06], occb: [V3(-0.35, -0.75, 0), V3(0, -1, -0.12), 7.4, 1.25, -0.15] }
    : { art: [V3(-0.2, -0.75, 0), V3(0.12, -1, 0), 6.4, 0, 0], lat: [V3(-0.1, 0.05, 0), V3(0.02, 0.42, -1), 7.6, 0, 0.1], med: [V3(-0.1, 0.05, 0.1), V3(0.02, 0.06, -1), 7.3, 0, 0.1], occ: [V3(-0.05, -0.35, 0), V3(0.35, -0.5, -1), 8.0, 0, 0.1], occb: [V3(-0.3, -0.75, 0), V3(0.12, -1, 0), 6.8, 0, 0] };
  const VIEW = {}; Object.entries(VP).forEach(([k, a]) => { VIEW[k] = vw(...a); });
  const curView = () => (st.mode === 'art' ? 'art' : st.mode === 'ter' ? st.side : st.occ === 'ba' ? 'occb' : 'occ');
  function applyView() { st.fly = VIEW[curView()]; }
  camera.position.copy(VIEW.art.pos); controls.target.copy(VIEW.art.target);

  // =================== анимация ===================
  let lastF = -1;
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    VG.forEach((g) => { g.fm.uniforms.uTime.value = st.t; }); if (CLOT.visible) clotM.emissiveIntensity = 0.6 + 0.4 * Math.sin(st.t * 4);
    if (st.mode === 'occ') {
      const grow = st.occ !== 'ica_ok' && !st.rep;
      if (grow && st.tm < 360) st.tm = Math.min(360, st.tm + dt * 20);
      if (st.rep && st.repA < 1) st.repA = Math.min(1, st.repA + dt / 1.5);
      const q = Math.round(coreF() * 60) / 60 + (st.rep ? 10 + Math.round(st.repA * 20) : 0);
      if (q !== lastF) { lastF = q; colorBrain(); if (!st.rep) placeOcc(); }
    }
  }

  // =================== выбор ===================
  function refresh() { colorBrain(); colorVes(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; st.sel = null; st.ter = null; if (m === 'occ') { st.tm = 0; st.rep = false; st.repA = 0; } lastF = -1; refresh(); applyView(); refs.modeSeg && refs.modeSeg.sync(); }
  function setSel(id) { st.sel = id === 'all' || st.sel === id ? null : id; colorVes(); refs.aseg && refs.aseg.sync(); refs.setInfo(); }
  function setTer(id) { st.ter = id === 'all' || st.ter === id ? null : id; if (st.ter) { const side = st.ter === 'mca' ? 'lat' : 'med'; if (side !== st.side) { st.side = side; applyView(); refs.vseg && refs.vseg.sync(); } } colorBrain(); colorVes(); refs.tseg && refs.tseg.sync(); refs.setInfo(); }
  function setSide(v) { st.side = v; colorVes(); applyView(); refs.vseg && refs.vseg.sync(); }
  function setOcc(id) { const vb = (st.occ === 'ba') !== (id === 'ba'); st.occ = id; if (vb) applyView(); st.tm = 0; st.rep = false; st.repA = 0; lastF = -1; colorBrain(); colorVes(); refs.oseg && refs.oseg.sync(); refs.setInfo(); }
  function reperfuse() { if (st.occ === 'ica_ok' || st.rep) return; st.rep = true; st.repA = 0; colorVes(); refs.setInfo(); }
  pickOn(() => self, camera, () => pick.filter((m) => m.visible !== false), (id, hit) => {
    if (id.startsWith('a:') && st.mode === 'art') setSel(id.slice(2));
    else if (id.startsWith('h:') && st.mode === 'ter' && hit.face) setTer(BV_TER[TER[+id.slice(2)][hit.face.a]].id);
    else if (id.startsWith('a:') && st.mode === 'ter' && ['aca', 'mca', 'pca'].includes(id.slice(2))) setTer(id.slice(2));
  });

  // =================== подписи ===================
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const at = (c, u) => () => c.getPointAt(u);
  const artOn = (id, dk) => () => st.mode === 'art' && (st.sel === id || (!st.sel && (!dk || DK)));
  const terL = () => st.mode === 'ter' && st.side === 'lat', terM = () => st.mode === 'ter' && st.side === 'med';
  const occ = () => st.mode === 'occ';
  const P = (f) => { let c = null; return () => (c ||= f() || V3(0, 0, 0)); };
  const labels = [
    lb('internal carotid', () => CH.ica[-1].getPointAt(0.55), '#F08A8A', artOn('ica')),
    lb('anterior cerebral', () => CH.aca[1].getPointAt(0.6), '#8FC0FF', () => st.mode === 'art' && st.sel === 'aca', true),
    lb('middle cerebral', () => CH.mca[1].getPointAt(0.55), '#FFB070', artOn('mca'), true),
    lb('anterior communicating', () => CH.acom.getPointAt(0.5), '#8FF0D0', artOn('acom', true), true),
    lb('posterior communicating', () => CH.pcom[-1].getPointAt(0.5), '#8FF0D0', () => st.mode === 'art' && st.sel === 'pcom'),
    lb('posterior cerebral', () => J[-1].clone().add(V3(-0.25, 0.02, -0.12)), '#F2D870', artOn('pca')),
    lb('basilar', () => CH.ba.getPointAt(0.55), '#B8A0FF', artOn('ba')),
    lb('vertebral', () => VG.find((g) => g.art === 'va' && g.s === -1).list[0].curve.getPointAt(0.45), '#D0A0FF', () => st.mode === 'art' && st.sel === 'va'),
    lb('superior cerebellar', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'base').list[0].curve.getPointAt(0.8), '#F0A0D0', () => st.mode === 'art' && st.sel === 'cbl', true),
    lb('anterior inferior cerebellar', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'base').list[1].curve.getPointAt(0.85), '#F0A0D0', () => st.mode === 'art' && st.sel === 'cbl', true),
    lb('posterior inferior cerebellar', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'pica').list[0].curve.getPointAt(0.8), '#F0A0D0', () => st.mode === 'art' && st.sel === 'cbl', true),
    lb('cerebellar', () => VG.find((g) => g.art === 'cbl' && g.s === 1 && g.kind === 'pica').list[0].curve.getPointAt(0.8), '#F0A0D0', () => st.mode === 'art' && !st.sel && DK, true),
    lb('ophthalmic', () => VG.find((g) => g.art === 'ica' && g.s === -1).list[1].curve.getPointAt(0.8), '#F08A8A', () => st.mode === 'art' && st.sel === 'ica'),
    lb('optic chiasm', () => V3(0.5, chiY - 0.04, -0.04), '#E8E0D0', () => st.mode === 'art' && ['aca', 'acom'].includes(st.sel)),
    lb('pons', () => pS(-0.9, 35, -1, -0.02), '#E0C8D0', () => st.mode === 'art' && st.sel === 'ba'),
    lb('siphon', () => CH.ica[1].getPointAt(0.45), '#F08A8A', () => st.mode === 'art' && st.sel === 'ica', true),
    // бассейны, снаружи (левое полушарие)
    lb('middle cerebral', P(() => pL(0.0, 0.28, -1)), '#FFC090', () => terL() && !st.ter),
    lb('anterior cerebral', P(() => pT(0.15, -0.2)), '#A8D0FF', () => terL() && !st.ter),
    lb('posterior cerebral', P(() => pL(-1.42, -0.22, -1)), '#F8E090', () => terL() && !st.ter, true),
    lb('face and arm', P(() => pL(bkCs(0.35) + 0.08, 0.35, -1)), '#FFD8B8', () => terL() && st.ter === 'mca'),
    lb('Broca\'s area', P(() => pL(0.78, -0.06, -1)), '#FFD8B8', () => terL() && st.ter === 'mca', true),
    lb('Wernicke\'s area', P(() => pL(-0.55, bkLs(-0.55) - 0.12, -1)), '#FFD8B8', () => terL() && st.ter === 'mca'),
    lb('leg', P(() => pT(bkCs(1.0) + 0.04, -0.12)), '#C8E0FF', () => terL() && st.ter === 'aca'),
    lb('visual cortex', P(() => pL(-1.5, 0.0, -1)), '#F8E8B0', () => terL() && st.ter === 'pca', true),
    // бассейны, изнутри (правое полушарие)
    lb('anterior cerebral', P(() => pM(0.45, 0.62, 1, -0.02)), '#A8D0FF', () => terM() && !st.ter),
    lb('posterior cerebral', P(() => pM(-1.3, 0.1, 1, -0.02)), '#F8E090', () => terM() && !st.ter, true),
    lb('leg', P(() => pM(bkCs(0.85) + 0.02, 0.85, 1, -0.02)), '#C8E0FF', () => terM() && st.ter === 'aca'),
    lb('visual cortex', P(() => pM(-1.45, -0.05, 1, -0.02)), '#F8E8B0', () => terM() && st.ter === 'pca', true),
    lb('corpus callosum', () => BKP.cc[2].clone().add(V3(0, 0, -0.05)), '#EDE4D8', () => terM() && !st.ter),
    // инсульт
    lb('clot', () => CLOT.position.clone(), '#FF8080', () => occ() && CLOT.visible),
    lb('infarct core', () => LP.core, '#FFB0B8', () => occ() && (st.occ === 'mca' || st.occ === 'ica_bad')),
    lb('penumbra', () => LP.pen, '#F8C080', () => occ() && (st.occ === 'mca' || st.occ === 'ica_bad') && !st.rep),
    lb('saved penumbra', () => LP.pen, '#F8E0C0', () => occ() && (st.occ === 'mca' || st.occ === 'ica_bad') && st.rep),
    lb('anterior communicating', () => CH.acom.getPointAt(0.5), '#8FF0D0', () => occ() && st.occ === 'ica_ok', true),
    lb('posterior communicating', () => CH.pcom[-1].getPointAt(0.5), '#8FF0D0', () => occ() && st.occ === 'ica_ok'),
    lb('pons', () => pS(-1.0, 0, 1, -0.02).add(V3(0, 0, 0.12)), '#E08090', () => occ() && st.occ === 'ba', true),
    lb('cerebellum', P(() => pC(-1.35, -0.55, 'up')), '#F8C080', () => occ() && st.occ === 'ba'),
    lb('posterior cerebral territories', P(() => pI(-0.6, -0.9, -0.01)), '#E08090', () => occ() && st.occ === 'ba'),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO1 = '<b>The arterial circle (circle of Willis)</b> is a ring of arteries on the base of the brain. The internal carotids feed it from the front, and the basilar artery, formed by the joined vertebrals, from behind. The communicating arteries close the ring, so blood can flow from one system to the other. Fewer than half of people have a complete circle. View from below, forehead on the left. Choose an artery.';
  const INTRO2 = '<b>Territories</b> are the areas of the brain supplied by each cerebral artery; their borders vary slightly from person to person. Blood supply is poorest where territories meet: when blood pressure drops sharply, infarcts arise exactly there. The lateral view shows the left hemisphere, the medial view the right one. Choose an artery or click the cortex.';
  const REPT = '<b>Blood flow restored.</b> The penumbra is saved: these neurons will work again. The dead tissue of the core will not recover — a scar will form in its place, and neighboring areas of the cortex will gradually take over some of the lost functions.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'art') { const a = BV_ART.find((x) => x.id === st.sel); ib.info.innerHTML = a ? a.text : INTRO1; return; }
      if (st.mode === 'ter') { const t = BV_TER.find((x) => x.id === st.ter); ib.info.innerHTML = t ? t.text : INTRO2; return; }
      const o = BV_OCC.find((x) => x.id === st.occ);
      ib.info.innerHTML = st.rep ? REPT : o.text; if (refs.repBtn) refs.repBtn.disabled = st.occ === 'ica_ok' || st.rep;
    };
    refs.modeSeg = seg([{ id: 'art', label: 'Arteries' }, { id: 'ter', label: 'Territories' }, { id: 'occ', label: 'Stroke' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.aseg = refs.tseg = refs.vseg = refs.oseg = null;
      if (st.mode === 'art') {
        refs.aseg = seg([{ id: 'all', label: 'All' }, ...BV_ART.map((a) => ({ id: a.id, label: a.name, color: a.col }))], () => st.sel || 'all', (v) => setSel(v));
        box.append(h('div', { class: 'glabel' }, 'Artery', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.aseg));
        view.append(toggle('Blood flow', () => st.flow, (v) => { st.flow = v; colorVes(); }));
      } else if (st.mode === 'ter') {
        refs.tseg = seg([{ id: 'all', label: 'All' }, ...BV_TER.map((t) => ({ id: t.id, label: t.name, color: t.col }))], () => st.ter || 'all', (v) => setTer(v));
        refs.vseg = seg([{ id: 'lat', label: 'Lateral view' }, { id: 'med', label: 'Medial view' }], () => st.side, (v) => setSide(v));
        box.append(h('div', { class: 'glabel' }, 'Cerebral artery', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.tseg), h('div', { class: 'glabel' }, 'Surface'), h('div', { class: 'gctl' }, refs.vseg));
      } else {
        refs.oseg = seg(BV_OCC.map((o) => ({ id: o.id, label: o.name })), () => st.occ, (v) => setOcc(v));
        box.append(h('div', { class: 'glabel' }, 'Blockage'), h('div', { class: 'gctl' }, refs.oseg, (refs.repBtn = button('Restore blood flow', reperfuse, true)), button('Restart', () => setOcc(st.occ))));
      }
      view.append(refs.rot, refs.lab);
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Mode', '1–3', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'View', h('kbd', {}, 'R · N')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['art', 'ter', 'occ'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'art') setSel('all'); else if (st.mode === 'ter') setTer('all'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'art') return [['Brain receives', '≈ 15', '% of cardiac output'], ['Of that, via carotids', '≈ 80', '%']];
    if (st.mode === 'ter') return [['Brain mass', '≈ 2', '% of body'], ['Uses', '≈ 20', '% of oxygen']];
    if (st.occ === 'ica_ok') return [['Brain infarct', 'none', '']];
    const m = Math.round(st.tm), hh = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0');
    return [[st.rep ? 'Flow restored after' : 'Since onset', `${hh}:${mm}`, 'h:min'], ['Neurons lost', `≈ ${Math.round(1.9 * m)}`, 'million']];
  }
  const self = {
    labelBg: true, mobZoom: 0.8, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'art' ? (st.sel ? BV_ART.find((a) => a.id === st.sel).col : '#E05555') : st.mode === 'ter' ? (st.ter ? BV_TER.find((t) => t.id === st.ter).col : '#F08A3C') : '#E05555'; },
    kicker: 'Brain · structure', title: 'Blood Supply of the Brain',
    lede: 'The brain is 2% of body mass but takes a fifth of the oxygen and has almost no reserves. It is fed by four arteries linked into a ring at its base, and each area of the cortex depends on its own branch — which is why a stroke reveals so precisely where a vessel has closed.',
    notes: `
      <div><h2>Structure</h2>
        <p>Four arteries supply the brain: the two internal carotids (the anterior system) and the two vertebrals, which join to form the basilar artery (the posterior system). On the base of the brain their branches are linked into the arterial circle (circle of Willis). Three pairs of cerebral arteries leave the circle — anterior, middle, and posterior — and the vertebral and basilar arteries also give off the cerebellar arteries and branches to the brainstem.</p>
        <p>The large arteries run over the surface of the brain in the subarachnoid space, and thin branches dive into the tissue. The deep parts — the basal nuclei, thalamus, and internal capsule — are fed by thin straight branches from the circle and from the first segments of the cerebral arteries.</p></div>
      <div><h2>How it works</h2>
        <p>The brain receives about 15% of the blood pumped by the heart — about 50 mL per 100 g of tissue per minute. It has almost no reserves of glucose or oxygen: without blood flow, consciousness is lost in 10–15 seconds, and within a few minutes neurons begin to die.</p>
        <p>Brain vessels keep blood flow steady when blood pressure changes (autoregulation) and widen where neurons are working harder — this is the basis of functional MRI.</p></div>
      <div><h2>Medicine</h2><ul>
        <li><b>Ischemic stroke</b> (about 85% of strokes) is the blockage of an artery by a clot or embolus, often from the heart in atrial fibrillation or from a plaque in the carotid artery. Warning signs follow the FAST test — Face, Arm, Speech, Time: a drooping face, a weak arm, slurred speech; call emergency services right away.</li>
        <li><b>Time is brain:</b> when a large artery is blocked, about 1.9 million neurons die every minute. Thrombolysis helps within the first 4.5 hours, and thrombectomy usually within 6 hours — in some patients even later.</li>
        <li><b>A transient ischemic attack</b> causes stroke signs that pass on their own within minutes. It is a warning: the risk of a real stroke in the next few days is high.</li>
        <li><b>Hemorrhagic stroke</b> is the rupture of a vessel: bleeding into the brain (more often with high blood pressure) or rupture of an aneurysm of the circle arteries with subarachnoid hemorrhage.</li></ul></div>
      <div><h2>Simplifications</h2><ul><li>The brain model is simplified; the arteries are drawn thicker, and their course and branching are schematic. Deep branches, veins, and meninges are not shown. The borders of the territories are approximate. Infarct growth is sped up: 20 minutes per second; the number of dead neurons is an average estimate for a blocked large artery of the anterior circulation; for the basilar artery it is different. With a basilar clot the whole cerebellum is shaded, although its lower part is fed by the posterior inferior cerebellar arteries from the vertebrals.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode · <code>Esc</code> clear selection</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`
  };
  colorBrain(); colorVes();
  return self;
}
export { makeBrainVasc };
