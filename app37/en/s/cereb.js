import { GLOW, Sparks, THREE, V3, __set_rnd, branchTree, button, clamp, displaceGeo, envTex, flowTubeMat, flyStep, flyTarget, glowNucleus, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 4 · МОЗЖЕЧОК: ДОЛИ, ЯДРА, НОЖКИ, НЕЙРОСЕТЬ КОРЫ
   ========================================================= */
const CB_ZONES = [
  { id: 'arch', name: 'Archicerebellum', color: '#5CC48A', text: '<b>Archicerebellum</b> — the flocculus and nodulus together with the fastigial nuclei. It tunes innate balance reflexes (taking vestibular information into account) and eye movements.' },
  { id: 'paleo', name: 'Paleocerebellum', color: '#4F8FEF', text: '<b>Paleocerebellum</b> — the cortex of the vermis and the medial part of the hemispheres together with the interposed (globose and emboliform) nuclei. It automates locomotion — moving through space. It receives muscle and skin sensation via the spinocerebellar tracts and controls the extrapyramidal system.' },
  { id: 'neo', name: 'Neocerebellum', color: '#F08A4B', text: '<b>Neocerebellum</b> — the lateral parts of the hemispheres and the dentate nuclei. Programs that arose in the motor and premotor cortex (areas 4, 6, 8) are gradually “rewritten” here: fine finger movements, speech, facial expressions. Corrections travel back to area 4 through the ventral lateral nucleus of the thalamus.' },
];
const CB_NUC = [
  { id: 'fast', name: 'Fastigial nucleus', z: 0.11, color: '#5CC48A', text: '<b>Fastigial nucleus</b> — the most medial; it works with the archicerebellum: balance and eye movements. Its efferents run through the inferior peduncles to the vestibular nuclei and the reticular formation.' },
  { id: 'glob', name: 'Globose nucleus', z: 0.26, color: '#4F8FEF', text: '<b>Globose nuclei</b> (5) together with the emboliform nucleus form the interposed nucleus — in chimpanzees it is still a single one. They work with the paleocerebellum: locomotion.' },
  { id: 'emb', name: 'Emboliform nucleus', z: 0.39, color: '#7FB2FF', text: '<b>Emboliform nucleus</b> (6) — part of the interposed nucleus. Through the superior peduncles it influences the red nucleus of the midbrain.' },
  { id: 'dent', name: 'Dentate nucleus', z: 0.66, color: '#F08A4B', text: '<b>Dentate nucleus</b> (7) — the largest, a folded “pouch” with its hilum open medially. It works with the neocerebellum; its output goes to the thalamus and cortex.' },
];
const CB_PED = [
  { id: 'sup', name: 'Superior peduncles', color: '#FF6A5A', text: '<b>Superior peduncles</b> — to the midbrain. Input: the anterior spinocerebellar tract. Output: from the cerebellar nuclei to the red nucleus (the main route to the extrapyramidal system) and to the thalamus, and on to the motor cortex.' },
  { id: 'mid', name: 'Middle peduncles', color: '#4FA3FF', text: '<b>Middle peduncles</b> — the thickest, from the pons. The cortico-ponto-cerebellar pathway: the cerebral hemispheres send “copies” of motor programs here.' },
  { id: 'inf', name: 'Inferior peduncles', color: '#5CC48A', text: '<b>Inferior peduncles</b> — to the medulla oblongata. Input: from the inferior olives (movement correction), from the spinal cord, from the gracile and cuneate nuclei, the vestibular nuclei and the reticular formation. Output: from the fastigial nuclei to the vestibular nuclei.' },
];
function cbCapCanvas(rx, rz) {
  const W = 1024, Hh = 512, c = document.createElement('canvas'); c.width = W; c.height = Hh; const g = c.getContext('2d');
  const S = W / 2 / (rz * 1.08), X = (z) => W / 2 + z * S, Y = (x) => Hh / 2 - x * S;
  g.fillStyle = '#000'; g.fillRect(0, 0, W, Hh);
  const path = (k) => { g.beginPath(); for (let i = 0; i <= 400; i++) { const a = i / 400 * Math.PI * 2, r = k * (1 + 0.018 * Math.sin(a * 70)); let x = Math.sin(a) * rx * r; const z = Math.cos(a) * rz * r; if (x > 0.1) x -= 0.35 * smooth(0.1, 0.9, x / rx) * Math.exp(-((z / rz / 0.35) ** 2)); i ? g.lineTo(X(z), Y(x)) : g.moveTo(X(z), Y(x)); } g.closePath(); };
  path(1); g.fillStyle = '#806670'; g.fill();
  g.save(); path(0.97); g.clip();
  g.strokeStyle = '#e8e0d4'; g.lineCap = 'round';
  const br = (z, x, a, len, w, d) => { const z2 = z + Math.cos(a) * len, x2 = x + Math.sin(a) * len * (rx / rz) * 1.6; g.lineWidth = w * S; g.beginPath(); g.moveTo(X(z), Y(x)); g.lineTo(X(z2), Y(x2)); g.stroke(); if (d > 0) [-0.5, 0.5].forEach((da) => br(z2, x2, a + da + (rnd() - 0.5) * 0.3, len * 0.62, w * 0.6, d - 1)); };
  for (let k = 0; k < 22; k++) { const a = k / 22 * Math.PI * 2; if (Math.sin(a) > 0.6 && Math.abs(Math.cos(a)) < 0.4) continue; br(Math.cos(a) * rz * 0.3, Math.sin(a) * rx * 0.25, a, rz * (0.16 + 0.22 * Math.abs(Math.cos(a))), 0.04, 3); }
  g.fillStyle = '#e8e0d4'; g.beginPath(); g.ellipse(X(0), Y(-0.02), rz * 0.3 * S, rx * 0.3 * S, 0, 0, Math.PI * 2); g.fill();
  g.restore();
  // IV желудочек спереди
  g.fillStyle = '#000'; g.beginPath(); g.ellipse(X(0), Y(rx * 0.55), 0.14 * S, 0.1 * S, 0, 0, Math.PI * 2); g.fill();
  const img = g.getImageData(0, 0, W, Hh), d = img.data;
  for (let i = 0; i < d.length; i += 4) { if (d[i] + d[i + 1] + d[i + 2] < 8) continue; const n = (Math.random() - 0.5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function makeCereb() {
  __set_rnd(mulberry(1010));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex;
  labLights(scene, 0x7fd6c8);
  const VIEW = {
    anat: flyTarget(V3(0.3, -0.1, 0), V3(3.55, 1.15, 6.5)),   // спереди-сбоку: видны ножки, олива, клочок
    nuc: flyTarget(V3(-0.6, -0.3, 0), V3(-2.0, 4.9, 0.3)),
    micro: flyTarget(V3(0, -0.75, 0), V3(6.3, 3.0, 7.6)),
  };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.anat.pos);
  const controls = makeControls(camera, VIEW.anat.target); controls.minDistance = 1.5; controls.maxDistance = 16;
  const anat = new THREE.Group(); scene.add(anat);
  /* ---------- мозжечок: червь, полушария, листки ---------- */
  const RX = 0.72, RY = 0.62, RZ = 1.6, CUT = -0.04;
  const zoneOf = (x, y, z) => { const az = Math.abs(z); if (x > 0.25 && y < -0.15 && (az < 0.28 || az > 1.0)) return 0; if (az < 0.55) return 1; return 2; };
  const cbG = displaceGeo(new THREE.SphereGeometry(1, 260, 180), (v) => {
    const a = Math.atan2(v.y, v.x), az = Math.abs(v.z), pole = smooth(0.93, 0.6, az);   // у латеральных полюсов листки гаснут
    let r = 1 + 0.02 * pole * Math.sin(a * (34 + 4 * noise3(v.z * 2, 0, 0)) + 0.6 * v.z + 0.8 * noise3(v.x * 2, v.y * 2, v.z * 2)) + 0.014 * noise3(v.x * 6, v.y * 6, v.z * 6);
    r -= 0.07 * pole * Math.exp(-(((a - 1.1) / 0.05) ** 2));                    // первичная щель
    r -= 0.05 * pole * Math.exp(-(((a + 2.3) / 0.05) ** 2));                    // горизонтальная щель
    let x = v.x * RX * r, y = v.y * RY * r, z = v.z * RZ * r;
    if (az < 0.5) { y -= 0.06 * Math.exp(-(((az - 0.24) / 0.05) ** 2)) * smooth(0, 0.6, Math.abs(v.y) + 0.3); } // околочервная борозда
    if (x > 0.1) { x -= 0.35 * smooth(0.1, 0.9, v.x) * Math.exp(-((v.z / 0.35) ** 2)); }                        // вырезка спереди (IV желудочек)
    if (y < 0) y -= 0.1 * Math.exp(-(((az - 0.35) / 0.25) ** 2)) * smooth(0, -0.9, v.y);                       // нижняя поверхность: миндалины
    v.set(x, y, z);
  });
  { const TIS = new THREE.Color(0xc9a2a8), pos = cbG.attributes.position, col = new Float32Array(pos.count * 3), v = new THREE.Vector3(), c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); c.set(CB_ZONES[zoneOf(v.x, v.y, v.z)].color).lerp(TIS, 0.45); col.set([c.r, c.g, c.b], i * 3); }
    cbG.setAttribute('color', new THREE.BufferAttribute(col, 3)); cbG.userData.zoneCol = col.slice(); }
  const CUTP = new THREE.Plane(V3(0, -1, 0), CUT);
  const cbMat = new THREE.MeshPhysicalMaterial({ color: 0x777777, vertexColors: true, roughness: 0.55, clearcoat: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0xffd0e0), envMapIntensity: 0.35, transparent: true, side: THREE.DoubleSide });
  const cb = new THREE.Mesh(cbG, cbMat); cb.userData.pick = 'cb'; anat.add(cb);
  // клочки
  const flocc = [1, -1].map((s) => { const g = displaceGeo(new THREE.SphereGeometry(0.16, 40, 30), (v) => { v.multiplyScalar(1 + 0.08 * Math.sin(v.y * 90)); v.y *= 0.7; }); g.translate(0.42, -0.42, 1.0 * s); const m = new THREE.Mesh(g, tissue(new THREE.Color(CB_ZONES[0].color).multiplyScalar(0.5))); m.userData.pick = 'arch'; anat.add(m); return m; });
  // ствол
  const stemC = new THREE.CatmullRomCurve3([V3(0.95, 1.5, 0), V3(1.0, 0.6, 0), V3(1.05, 0.0, 0), V3(0.95, -0.9, 0), V3(0.85, -1.8, 0)]);
  const stem = new THREE.Mesh(taperTube(stemC, (u) => 0.3 + 0.17 * Math.exp(-(((u - 0.38) / 0.12) ** 2)) - 0.08 * u, 80, 24), tissue(new THREE.Color(0xd8b2b8).multiplyScalar(0.3), { transparent: true, opacity: 0.6, depthWrite: false }));
  anat.add(stem);
  const olive = [1, -1].map((s) => { const g = new THREE.SphereGeometry(1, 20, 14); g.scale(0.07, 0.17, 0.06); g.translate(1.22, -0.75, 0.17 * s); const m = new THREE.Mesh(g, tissue(new THREE.Color(0xf2c14e).multiplyScalar(0.5))); anat.add(m); return m; });
  // ножки
  const PED = { sup: [], mid: [], inf: [] }, pedMats = [], pedFlow = [];
  [1, -1].forEach((s) => {
    const curves = {
      sup: new THREE.CatmullRomCurve3([V3(0.3, 0.05, 0.42 * s), V3(0.55, 0.42, 0.34 * s), V3(0.85, 0.95, 0.2 * s), V3(0.95, 1.35, 0.1 * s)]),
      mid: new THREE.CatmullRomCurve3([V3(0.35, -0.05, 0.85 * s), V3(0.7, 0.05, 0.75 * s), V3(1.05, 0.15, 0.45 * s), V3(1.35, 0.15, 0.12 * s)]),
      inf: new THREE.CatmullRomCurve3([V3(0.3, -0.2, 0.5 * s), V3(0.6, -0.45, 0.38 * s), V3(0.95, -0.85, 0.2 * s), V3(1.15, -0.8, 0.17 * s)]),
    };
    Object.entries(curves).forEach(([k, c]) => {
      const r = k === 'mid' ? 0.13 : 0.08; const mesh = new THREE.Mesh(taperTube(c, () => r, 50, 14), tissue(new THREE.Color(0xe8dccc).multiplyScalar(0.45), { transparent: true, opacity: 0.7 })); mesh.userData.pick = k; anat.add(mesh);
      const f = flowTubeMat(CB_PED.find((p) => p.id === k).color, 0.5, 1.6); f.uniforms.uOn.value = 0.6; pedMats.push(f);
      const fc = k === 'sup' ? c : new THREE.CatmullRomCurve3(c.getPoints(12).reverse());
      const fm = new THREE.Mesh(new THREE.TubeGeometry(fc, 50, r * 0.45, 8), f); anat.add(fm); pedFlow.push(fm); PED[k].push({ mesh, f, c: fc });
    });
  });
  // ядра мозжечка
  const NUC = {};
  CB_NUC.forEach((n) => {
    NUC[n.id] = [1, -1].map((s) => {
      let g;
      if (n.id === 'dent') g = displaceGeo(new THREE.SphereGeometry(1, 64, 44), (v) => { const k = 1 + 0.12 * Math.sin(v.x * 14) * Math.sin(v.y * 12) + 0.06 * Math.sin(Math.atan2(v.y, v.x) * 16); v.set(v.x * 0.24 * k, v.y * 0.12 * k, v.z * 0.13 * k); if (v.z * s < -0.06) v.z *= 0.4; });
      else g = new THREE.SphereGeometry(1, 24, 16).scale(n.id === 'emb' ? 0.12 : 0.07, 0.06, n.id === 'emb' ? 0.04 : 0.05);
      g.translate(n.id === 'dent' ? 0.05 : 0.18, -0.08, n.z * s);
      const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(n.color).multiplyScalar(0.4), emissive: new THREE.Color(n.color), emissiveIntensity: 0.12, roughness: 0.4, clearcoat: 0.6 });
      const mesh = new THREE.Mesh(g, m); mesh.userData.pick = n.id; mesh.renderOrder = 3; anat.add(mesh); return mesh;
    });
  });
  // срез (рис. 4.8)
  const capMat = new THREE.MeshStandardMaterial({ map: cbCapCanvas(RX * 0.98, RZ), color: 0x8c8c8c, roughness: 0.8, transparent: true, side: THREE.DoubleSide, envMapIntensity: 0.3, depthWrite: true });
  capMat.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\nif (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.03) discard;'); };
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(RZ * 2.16, RZ * 1.08), capMat); cap.rotation.x = -Math.PI / 2; cap.rotation.z = -Math.PI / 2; cap.position.y = CUT - 0.002; cap.visible = false; anat.add(cap);
  // ориентация: плоскость XY холста → (z, x) мира; поворот подобран так, что «верх» холста = +x (вперёд)

  /* ---------- кора мозжечка: нейросеть (рис. 4.9) ---------- */
  const mic = new THREE.Group(); scene.add(mic); mic.visible = false;
  const BX = 2.1, BZ = 1.25, Y_MOL = [0.2, 1.4], Y_PUR = 0.1, Y_GR = [-0.9, 0.0], Y_WM = [-1.4, -0.9];
  [[Y_MOL, 0x3a2c3c, 'mol'], [[0.0, 0.2], 0x4a3040, 'pur'], [Y_GR, 0x2b3550, 'gr'], [Y_WM, 0x8a8478, 'wm']].forEach(([yy, c]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(BX * 2, yy[1] - yy[0] - 0.005, BZ * 2), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.7, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide })); b.position.y = (yy[0] + yy[1]) / 2; mic.add(b);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), new THREE.LineBasicMaterial({ color: 0x7a6a86, transparent: true, opacity: 0.3 })); e.position.copy(b.position); mic.add(e);
  });
  const PX = [-1.3, 0, 1.3], PZ = [-0.75, 0, 0.75];
  const purk = [], pfSyn = [];
  const purMat = (k) => tissue(new THREE.Color(0xff8a5c).multiplyScalar(0.5), { emissive: 0x4a1a08, emissiveIntensity: 0.6 });
  function planar(arr, tips, p, ang, len, r, d) {
    const e = p.clone().add(V3(Math.cos(ang) * len, Math.sin(ang) * len, 0)), m = p.clone().lerp(e, 0.5).add(V3(rand(-0.03, 0.03), rand(-0.02, 0.02), 0));
    if (e.y > Y_MOL[1] - 0.04) e.y = Y_MOL[1] - 0.04 - rnd() * 0.04;
    arr.push(taperTube(new THREE.CatmullRomCurve3([p, m, e]), (u) => r * (1 - 0.3 * u), 6, 4));
    if (d > 0) { planar(arr, tips, e, ang + rand(0.25, 0.55), len * 0.74, r * 0.7, d - 1); planar(arr, tips, e, ang - rand(0.25, 0.55), len * 0.74, r * 0.7, d - 1); } else tips.push(e);
  }
  PX.forEach((x, xi) => PZ.forEach((z, zi) => {
    const arr = [], tips = [], so = V3(x, Y_PUR, z);
    const base = so.clone().add(V3(0, 0.08, 0));
    planar(arr, tips, base, Math.PI / 2, 0.3, 0.028, 5);
    arr.forEach((g) => { const pos = g.attributes.position; for (let i = 0; i < pos.count; i++) pos.setZ(i, z + (pos.getZ(i) - z) * 0.35); g.computeVertexNormals(); });
    const soma = new THREE.SphereGeometry(0.085, 18, 14); soma.scale(1, 1.15, 1); soma.translate(so.x, so.y, so.z); arr.push(soma);
    arr.push(taperTube(new THREE.CatmullRomCurve3([so.clone().add(V3(0, -0.08, 0)), V3(x, Y_GR[0], z), V3(x * 0.7, Y_WM[0] - 0.3, z * 0.5), V3(x * 0.5, -2.05, z * 0.2)]), () => 0.012, 40, 5));
    const mat = purMat(); const mesh = new THREE.Mesh(mergeGeometries(arr), mat); mic.add(mesh);
    purk.push({ x, z, xi, zi, mesh, mat, so, ax: new THREE.CatmullRomCurve3([so.clone().add(V3(0, -0.08, 0)), V3(x, Y_GR[0], z), V3(x * 0.7, Y_WM[0] - 0.3, z * 0.5), V3(x * 0.5, -2.05, z * 0.2)]), tips, inh: 0, exc: 0 });
  }));
  // клетки-зёрна и параллельные волокна
  const grArr = [], pfArr = [], PF = [];
  for (let i = 0; i < 260; i++) { const g = new THREE.SphereGeometry(0.025, 8, 6); g.translate(rand(-BX + 0.05, BX - 0.05), rand(Y_GR[0] + 0.05, Y_GR[1] - 0.05), rand(-BZ + 0.05, BZ - 0.05)); grArr.push(g); }
  for (let i = 0; i < 80; i++) {
    const x = rand(-BX + 0.1, BX - 0.1), y = rand(Y_MOL[0] + 0.08, Y_MOL[1] - 0.08), zg = rand(-BZ + 0.2, BZ - 0.2), yg = rand(Y_GR[0] + 0.1, Y_GR[1] - 0.1);
    const g0 = new THREE.SphereGeometry(0.03, 8, 6); g0.translate(x, yg, zg); grArr.push(g0);
    const up = new THREE.LineCurve3(V3(x, yg, zg), V3(x, y, zg)); pfArr.push(new THREE.TubeGeometry(up, 6, 0.006, 4));
    const along = new THREE.LineCurve3(V3(x, y, -BZ), V3(x, y, BZ)); pfArr.push(new THREE.TubeGeometry(along, 16, 0.006, 4));
    PF.push({ x, y, zg, yg });
  }
  const grMat = tissue(new THREE.Color(0x6fb4ff).multiplyScalar(0.5), { emissive: 0x0c2448, emissiveIntensity: 0.6 });
  mic.add(new THREE.Mesh(mergeGeometries(grArr), grMat));
  const pfMat = new THREE.MeshBasicMaterial({ color: 0x5e7fa8, transparent: true, opacity: 0.5 }); mic.add(new THREE.Mesh(mergeGeometries(pfArr), pfMat));
  // синапсы параллельных волокон на дендритах Пуркинье (центральный ряд)
  { const pts = [], cols = []; PF.forEach((f) => PX.forEach((x) => { if (Math.abs(f.x - x) < 0.42) PZ.forEach((z) => { pts.push(f.x, f.y, z); cols.push(1, 0.85, 0.4); pfSyn.push({ f, x, z }); }); }));
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    var synPts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.05, map: GLOW, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); mic.add(synPts); }
  pfSyn.forEach((s) => { s.w = 1; });
  // моховидные волокна с розетками
  const MOSSY = [-1.2, -0.1, 0.25, 1.1].map((x, i) => { const z = [-0.5, 0.35, -0.2, 0.6][i]; const c = new THREE.CatmullRomCurve3([V3(x - 0.3, -2.3, z), V3(x - 0.1, Y_WM[0], z), V3(x, Y_GR[0] + 0.2, z), V3(x + 0.1, -0.35, z + 0.1)]); return { x, z, c }; });
  const mfArr = []; MOSSY.forEach((m) => { mfArr.push(taperTube(m.c, () => 0.022, 40, 6)); [0.75, 0.88, 1].forEach((u) => { const g = displaceGeo(new THREE.SphereGeometry(0.06, 12, 10), (v) => v.multiplyScalar(1 + 0.25 * Math.sin(v.x * 80))); const p = m.c.getPointAt(u); g.translate(p.x, p.y, p.z); mfArr.push(g); }); });
  const mfMat = tissue(new THREE.Color(0x5cc48a).multiplyScalar(0.5), { emissive: 0x0c3a1c, emissiveIntensity: 0.6 }); mic.add(new THREE.Mesh(mergeGeometries(mfArr), mfMat));
  // лазящее волокно из оливы — оплетает центральную клетку Пуркинье
  const cpk = purk.find((p) => p.xi === 1 && p.zi === 1);
  const cfPts = [V3(0.6, -2.3, 0.15), V3(0.3, Y_WM[0], 0.08), V3(0.12, Y_GR[0] + 0.1, 0.04), V3(0.06, Y_PUR - 0.05, 0.03)];
  for (let k = 0; k < 9; k++) { const t2 = k / 8, a = t2 * 14; cfPts.push(V3(Math.sin(a) * 0.06 + (rnd() - 0.5) * 0.2 * t2, Y_PUR + 0.15 + t2 * 0.85, Math.cos(a) * 0.03)); }
  const CF = new THREE.CatmullRomCurve3(cfPts);
  const cfMat = tissue(new THREE.Color(0xc77dff).multiplyScalar(0.55), { emissive: 0x2a0c48, emissiveIntensity: 0.7 }); mic.add(new THREE.Mesh(taperTube(CF, () => 0.016, 120, 6), cfMat));
  // корзинчатые и звездчатые клетки (тормозные)
  const inArr = [], BASK = [], STEL = [];
  [[-0.65, 0.35, 0.3], [0.65, 0.35, -0.3], [-0.65, 0.4, -0.55], [0.65, 0.38, 0.55]].forEach(([x, y, z]) => {
    const g = new THREE.SphereGeometry(0.045, 12, 10); g.translate(x, y, z); inArr.push(g);
    const tgt = x < 0 ? -1.3 : 1.3; const c = new THREE.CatmullRomCurve3([V3(x, y, z), V3((x + tgt) / 2, y - 0.08, z), V3(tgt, Y_PUR + 0.1, z), V3(tgt, Y_PUR, PZ.reduce((a, b) => (Math.abs(b - z) < Math.abs(a - z) ? b : a)))]); inArr.push(taperTube(c, () => 0.008, 30, 4));
    const bk = new THREE.TorusGeometry(0.11, 0.008, 6, 24); bk.rotateX(Math.PI / 2); const pz = PZ.reduce((a, b) => (Math.abs(b - z) < Math.abs(a - z) ? b : a)); bk.translate(tgt, Y_PUR, pz); inArr.push(bk);
    for (let j = 0; j < 4; j++) branchTree(inArr, V3(x, y, z), V3(rand(-1, 1), rand(0.2, 1), rand(-0.3, 0.3)), 0.25, 0.008, 1, { segs: 6, rad: 3 });
    BASK.push({ c, x });
  });
  [[-0.6, 1.1, 0.1], [0.6, 1.15, -0.1], [-0.7, 0.85, -0.7], [0.7, 0.9, 0.7], [-0.6, 1.25, 0.6], [0.65, 1.2, -0.65]].forEach(([x, y, z]) => {
    const g = new THREE.SphereGeometry(0.035, 10, 8); g.translate(x, y, z); inArr.push(g);
    for (let j = 0; j < 5; j++) branchTree(inArr, V3(x, y, z), randUnit(), 0.18, 0.007, 1, { segs: 5, rad: 3 });
    const tgt = x < 0 ? -1.3 : 1.3; const c = new THREE.CatmullRomCurve3([V3(x, y, z), V3((x + tgt) / 2, y + 0.03, z), V3(tgt, y - 0.05, z)]); inArr.push(taperTube(c, () => 0.007, 20, 3));
    STEL.push({ c, x });
  });
  const inMat = tissue(new THREE.Color(0x4f8fef).multiplyScalar(0.55), { emissive: 0x0c2448, emissiveIntensity: 0.7 }); mic.add(new THREE.Mesh(mergeGeometries(inArr), inMat));
  // нейроны ядра мозжечка под корой
  const DN = PX.map((x) => { const p = V3(x * 0.5, -2.15, 0); const n = glowNucleus(mic, p, '#F08A4B', 0.07, 7); return { p, n, x, act: 0 }; });
  { const g = new THREE.SphereGeometry(1, 30, 20); g.scale(1.25, 0.22, 0.5); g.translate(0, -2.15, 0); mic.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: 0x9a6a40, roughness: 0.6, transparent: true, opacity: 0.18, depthWrite: false }))); }
  const DNOUT = DN.map((d) => new THREE.CatmullRomCurve3([d.p, d.p.clone().add(V3(0.4, -0.3, 0.1)), d.p.clone().add(V3(1.2, -0.45, 0.2))]));
  const fx = new Sparks(2400, 0.06); scene.add(fx.obj);

  const st = { t: 0, mode: 'anat', sel: null, labels: true, rot: false, fly: null, msg: null, mT: -99, cT: -99, learn: null, err: [], vis: 'zones' };
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; st.sel = null;
    anat.visible = m !== 'micro'; mic.visible = m === 'micro'; cap.visible = m === 'nuc';
    Object.values(PED).flat().forEach((p) => { p.mesh.visible = m !== 'nuc'; }); pedFlow.forEach((x) => { x.visible = m !== 'nuc'; }); stem.visible = m !== 'nuc'; olive.forEach((o) => { o.visible = m !== 'nuc'; });
    [cbMat, ...flocc.map((f) => f.material)].forEach((mm) => { mm.clippingPlanes = m === 'nuc' ? [CUTP] : []; mm.needsUpdate = true; });
    // на срезе ядра — плоские контуры в плоскости среза, а не фигурки над ней
    Object.values(NUC).flat().forEach((n) => { n.scale.y = m === 'nuc' ? 0.05 : 1; n.position.y = m === 'nuc' ? CUT + 0.01 : 0; });
    cbMat.opacity = m === 'nuc' ? 1 : 1; st.fly = VIEW[m]; applySel(); refs.setInfo && refs.setInfo();
    if (refs.gN) { refs.gN.style.display = m === 'nuc' ? '' : 'none'; refs.gM.style.display = m === 'micro' ? '' : 'none'; }   /* лишние ряды пульта прячутся — сцене больше места */
  }
  function applySel() {
    const zi = CB_ZONES.findIndex((z) => z.id === st.sel), col = cbG.attributes.color.array, src = cbG.userData.zoneCol, pos = cbG.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { let k = 1; if (zi >= 0) { v.fromBufferAttribute(pos, i); k = zoneOf(v.x, v.y, v.z) === zi ? 1.2 : 0.3; } col[i * 3] = src[i * 3] * k; col[i * 3 + 1] = src[i * 3 + 1] * k; col[i * 3 + 2] = src[i * 3 + 2] * k; }
    cbG.attributes.color.needsUpdate = true;
    const nucSel = CB_NUC.some((n) => n.id === st.sel), pedSel = CB_PED.some((p) => p.id === st.sel);
    cbMat.opacity = nucSel && st.mode === 'anat' ? 0.25 : 1; cbMat.depthWrite = !(nucSel && st.mode === 'anat');
    CB_NUC.forEach((n) => NUC[n.id].forEach((m) => { m.material.emissiveIntensity = st.sel === n.id ? 0.7 : 0.12; }));
    Object.entries(PED).forEach(([k, arr]) => arr.forEach((p) => { p.f.uniforms.uOn.value = !pedSel || st.sel === k ? 0.7 : 0.08; p.mesh.material.opacity = !pedSel || st.sel === k ? 0.7 : 0.15; }));
  }
  function select(id) { st.sel = id === 'all' || id === 'cb' ? null : id; st.msg = null; if (CB_NUC.some((n) => n.id === id) && st.mode === 'anat') setMode('nuc'); st.sel = id === 'all' || id === 'cb' ? null : id; applySel(); refs.setInfo(); }
  function mossy() { if (st.mode !== 'micro') setMode('micro'); st.mT = st.t; st.msg = TXT.mossy; refs.setInfo(); }
  function climb() { if (st.mode !== 'micro') setMode('micro'); st.cT = st.t; st.msg = TXT.climb; refs.setInfo(); }
  function learn() { if (st.mode !== 'micro') setMode('micro'); st.learn = { t0: st.t, n: -1 }; st.err = []; pfSyn.forEach((s) => { s.w = 1; }); st.msg = TXT.learn; refs.setInfo(); }
  pickOn(() => self, camera, () => [cb, ...flocc, ...Object.values(PED).flat().map((p) => p.mesh), ...Object.values(NUC).flat()], (id, hit) => {
    if (st.mode === 'micro') return;
    if (id === 'cb') { const p = hit.point.clone(); anat.worldToLocal(p); select(CB_ZONES[zoneOf(p.x, p.y, p.z)].id); } else select(id);
  });
  const C = { ex: new THREE.Color(0x7fe0a0), pf: new THREE.Color(0x8fc0ff), pk: new THREE.Color(0xffb070), inh: new THREE.Color(0x4f8fef), cf: new THREE.Color(0xd59cff), out: new THREE.Color(0xff8a4b) };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    pedMats.forEach((f) => { f.uniforms.uTime.value = t; });
    if (st.mode !== 'micro') { fx.update(dt); return; }
    // обучение: серия проб «контекст (моховидные) + ошибка (лазящее)»
    if (st.learn) { const k = t - st.learn.t0, n = Math.floor(k / 1.6); if (n !== st.learn.n && n < 8) { st.learn.n = n; st.mT = t; st.cT = t + 0.55; const e = Math.pow(0.68, n); st.err.push(e); } if (n >= 8 && st.learn) { st.learn = null; st.msg = TXT.learned; refs.setInfo(); } }
    const km = t - st.mT, kc = t - st.cT;
    // моховидные → зёрна → параллельные волокна (пучок над x ≈ 0)
    const beam = PF.filter((f) => Math.abs(f.x) < 0.55);
    if (km > 0 && km < 0.5) MOSSY.forEach((m) => { if (Math.abs(m.x) < 0.5) fx.spawn(m.c.getPointAt(km / 0.5), V3(0, 0, 0), C.ex, 0.4, 0, 1.6); });
    if (km > 0.5 && km < 0.8) beam.forEach((f) => { const u = (km - 0.5) / 0.3; fx.spawn(V3(f.x, f.yg + (f.y - f.yg) * u, f.zg), V3(0, 0, 0), C.pf, 0.3, 0, 1.2); });
    if (km > 0.8 && km < 1.4) beam.forEach((f) => { const u = (km - 0.8) / 0.6; [1, -1].forEach((s) => { const z = f.zg + s * u * 2 * BZ; if (Math.abs(z) < BZ) fx.spawn(V3(f.x, f.y, z), V3(0, 0, 0), C.pf, 0.25, 0, 1); }); });
    if (km > 1.0 && km < 1.6) [...BASK, ...STEL].forEach((b) => { const u = (km - 1.0) / 0.6; fx.spawn(b.c.getPointAt(u), V3(0, 0, 0), C.inh, 0.35, 0, 1.5); });
    const avgW = pfSyn.length ? pfSyn.filter((s) => Math.abs(s.x) < 0.1).reduce((a, s) => a + s.w, 0) / Math.max(1, pfSyn.filter((s) => Math.abs(s.x) < 0.1).length) : 1;
    purk.forEach((p) => {
      const onBeam = Math.abs(p.x) < 0.1;
      let exc = 0.25; if (km > 0.9 && km < 1.9) exc = onBeam ? 0.15 + 0.6 * avgW : 0.05;
      if (kc > 0 && kc < 0.5 && p === cpk) exc = 3.2;
      p.exc += (exc - p.exc) * Math.min(1, dt * 8); p.mat.emissiveIntensity = 0.3 + p.exc * 0.9;
      // тоническое торможение ядра: голубые искры по аксону
      if (rnd() < p.exc * dt * 18) fx.spawn(p.ax.getPointAt(rnd()), V3(0, -0.2, 0), C.inh, 0.5, 1, 0.8);
    });
    DN.forEach((d, i) => {
      const pk = purk.filter((p) => Math.abs(p.x - PX[i]) < 0.1).reduce((a, p) => a + p.exc, 0) / 3;
      const act = clamp(1.0 - pk * 1.6, 0, 1.4); d.act += (act - d.act) * Math.min(1, dt * 6);
      d.n.spr.material.opacity = 0.15 + d.act * 0.7; d.n.spr.scale.setScalar(0.07 * (6 + d.act * 6));
      if (rnd() < d.act * dt * 14) fx.spawn(DNOUT[i].getPointAt(rnd() * 0.3), V3(0.8, -0.2, 0), C.out, 0.7, 0.5, 1.4);
    });
    // лазящее волокно: комплексный спайк + сигнал ошибки → ослабление синапсов параллельных волокон
    if (kc > 0 && kc < 0.5) { for (let j = 0; j < 6; j++) fx.spawn(CF.getPointAt(Math.min(1, kc / 0.5) * rnd()), randUnit().multiplyScalar(0.05), C.cf, 0.5, 2, 1.6); cfMat.emissiveIntensity = 2.2; } else cfMat.emissiveIntensity = 0.7;
    if (kc > 0.3 && st.ltd !== st.cT && km > 0 && km < 1.6 && (st.ltd = st.cT)) pfSyn.forEach((s) => { if (Math.abs(s.x) < 0.1 && Math.abs(s.f.x) < 0.55) s.w = Math.max(0.2, s.w * 0.82); });
    { const c = synPts.geometry.attributes.color; pfSyn.forEach((s, i) => { const act = km > 0.9 && km < 1.6 && Math.abs(s.f.x) < 0.55 ? 1.6 : 0.35; c.setXYZ(i, act * s.w, act * s.w * 0.8, act * s.w * 0.35); }); c.needsUpdate = true; }
    mfMat.emissiveIntensity = km > 0 && km < 0.6 ? 1.8 : 0.6; grMat.emissiveIntensity = km > 0.45 && km < 0.85 ? 1.6 : 0.6; inMat.emissiveIntensity = km > 1.0 && km < 1.7 ? 1.8 : 0.7;
    fx.update(dt);
  }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt); const sv = st.mode === 'micro' && st.err.length > 0; scopeShow(sv); if (!sv) return;
    const bw = (w - 30) / 8; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#d59cff'; ctx.fillText('movement error by trial', 10, 13);
    st.err.forEach((e, i) => { const bh = e * (hgt - 34); ctx.fillStyle = `rgba(213,156,255,${0.4 + 0.6 * e})`; ctx.fillRect(14 + i * bw, hgt - 12 - bh, bw * 0.7, bh); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillText(String(i + 1), 14 + i * bw + bw * 0.2, hgt - 1); });
  }
  const TXT = {
    anat: '<b>Cerebellum</b> — the “little brain” beneath the tentorium cerebelli: 9–10 cm across, weighing 120–160 g, 10% of the brain’s volume but more than half of all its neurons. The vermis is in the middle, with two hemispheres at the sides; folia increase the cortical area. Colors show the functional parts: <b>archicerebellum</b> (flocculus and nodulus), <b>paleocerebellum</b> (vermis and medial zones), <b>neocerebellum</b> (lateral hemispheres). In the first year of life the cerebellum grows faster than other parts of the brain (40 g at 3 months, 80 g at 9 months).',
    nuc: '<b>Horizontal section</b>. As in the cerebral hemispheres: cortex on the outside (three layers of gray matter), white matter beneath it — the “arbor vitae” (tree of life) — and nuclei deep inside. From the inside out: <b>fastigial nucleus</b>, <b>globose</b>, <b>emboliform</b> and the folded <b>dentate</b>. Click a nucleus.',
    micro: '<b>Cerebellar cortex: three layers.</b> At the bottom is the <b>granular</b> layer — the densest layer in the brain, made of granule cells. In the middle is the <b>ganglionic</b> layer — the cell bodies of Purkinje cells. At the top is the <b>molecular</b> layer: the flat dendritic fans of Purkinje cells stand in a single plane, and parallel fibers (granule cell axons with T-shaped branching) pierce them crosswise — an orthogonal lattice. Purkinje cells are inhibitory: they constantly restrain the cerebellar nuclei (light-blue sparks heading down).',
    mossy: '<b>Mossy fibers</b> (green) carry signals from the pons, spinal cord and vestibular nuclei to granule cells → granule cells excite a bundle of parallel fibers → the Purkinje cells under the bundle are excited and inhibit their nucleus more strongly. At the same time stellate and basket (GABA) cells inhibit neighboring Purkinje cells — a hole opens in the “inhibitory curtain”, and the nucleus beneath it (orange) launches a movement.',
    climb: '<b>Climbing fiber</b> (purple) comes from the inferior olive and wraps around a single Purkinje cell, which fires a powerful complex spike. This is the signal “the movement was inaccurate”. Parallel-fiber synapses that were active at the same time weaken — motor memory forms on the Purkinje dendrites.',
    learn: '<b>Learning a skill.</b> Each trial combines the context of the movement (mossy fibers) and an error signal (climbing fiber). The yellow synapses of the bundle fade, the Purkinje cells under the bundle inhibit the nucleus less — and it issues a more accurate command. On the right, the error falls from trial to trial.',
    learned: '<b>Skill acquired.</b> The cerebellum has memorized how to perform this movement quickly and accurately. The basal ganglia assemble such individual movements into a long program — the whole dance — while the cerebellum is responsible for each step.',
  };
  const labels = [
    { text: 'vermis', pos: V3(-0.55, 0.55, 0.0), color: '#86B6FF', show: () => st.labels && st.mode === 'anat' && !st.sel },
    { text: 'hemisphere', pos: V3(-0.45, 0.4, 1.1), color: '#F4A070', show: () => st.labels && st.mode === 'anat' && !st.sel },
    { text: 'flocculus', pos: V3(0.5, -0.5, 1.25), color: '#7FE0A0', show: () => st.labels && st.mode === 'anat' && !st.sel },
    { text: 'brainstem', pos: V3(1.1, -1.4, 0.3), color: '#d8b2b8', show: () => st.labels && st.mode === 'anat' && !st.sel },
    { text: 'olive', pos: V3(1.3, -0.75, 0.25), color: '#F2C14E', show: () => st.labels && st.mode === 'anat' && !st.sel },
    ...CB_PED.map((p) => ({ text: p.name.toLowerCase(), pos: { sup: V3(0.8, 0.95, 0.3), mid: V3(0.75, 0.15, 0.9), inf: V3(0.8, -0.7, 0.45) }[p.id], color: p.color, show: () => st.labels && st.mode === 'anat' && (!st.sel || st.sel === p.id) })),
    ...CB_NUC.map((n) => ({ text: n.name, pos: V3((n.id === 'dent' ? 0.05 : 0.18) + ({ glob: -0.14, emb: 0.14 }[n.id] || 0), 0.05, n.z + (n.id === 'dent' ? 0.12 : 0)), color: n.color, show: () => st.labels && st.mode === 'nuc' })),
    { text: 'cortex', pos: V3(-0.55, CUT, 1.35), color: '#c8b0c0', show: () => st.labels && st.mode === 'nuc' },
    { text: 'white matter', pos: V3(-0.3, CUT, -0.95), color: '#e4dccf', show: () => st.labels && st.mode === 'nuc' },
    { text: 'molecular layer', pos: V3(-BX - 0.05, 0.8, BZ), color: '#d8c8e8', show: () => st.labels && st.mode === 'micro' },
    { text: 'Purkinje cell layer', pos: V3(-BX - 0.05, Y_PUR, BZ), color: '#FFB070', show: () => st.labels && st.mode === 'micro' },
    { text: 'granular layer', pos: V3(-BX - 0.05, -0.45, BZ), color: '#86B6FF', show: () => st.labels && st.mode === 'micro' },
    { text: 'white matter', pos: V3(-BX - 0.05, -1.15, BZ), color: '#c8c0b0', show: () => st.labels && st.mode === 'micro' },
    { text: 'Purkinje cell', pos: V3(0.25, 1.0, 0.05), color: '#FFB070', show: () => st.labels && st.mode === 'micro' },
    { text: 'parallel fibers', pos: V3(1.6, 1.25, BZ), color: '#8fc0ff', show: () => st.labels && st.mode === 'micro' },
    { text: 'mossy fiber', pos: V3(-1.4, -1.9, -0.5), color: '#7FE0A0', show: () => st.labels && st.mode === 'micro' },
    { text: 'climbing fiber (from the olive)', pos: V3(0.65, -2.2, 0.15), color: '#d59cff', show: () => st.labels && st.mode === 'micro' },
    { text: 'basket cell', pos: V3(-0.65, 0.3, 0.3), color: '#86B6FF', show: () => st.labels && st.mode === 'micro' },
    { text: 'stellate cell', pos: V3(-0.6, 1.1, 0.1), color: '#86B6FF', show: () => st.labels && st.mode === 'micro' },
    { text: 'cerebellar nucleus', pos: V3(-0.9, -2.25, 0.2), color: '#F08A4B', show: () => st.labels && st.mode === 'micro' },
    { text: 'to the thalamus and red nucleus', pos: V3(1.2, -2.6, 0.2), color: '#FF8A4B', show: () => st.labels && st.mode === 'micro' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    const all = [...CB_ZONES, ...CB_NUC, ...CB_PED];
    refs.setInfo = () => { const s = all.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (s && st.mode !== 'micro' ? s.text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'anat', label: 'Structure' }, { id: 'nuc', label: 'Nuclei in section' }, { id: 'micro', label: 'Cortical circuit' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'All' }, ...CB_ZONES.map((z) => ({ id: z.id, label: z.name, color: z.color })), ...CB_PED.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode === 'micro') setMode('anat'); select(v); });
    refs.nseg = seg(CB_NUC.map((n) => ({ id: n.id, label: n.name, color: n.color })), () => st.sel, (v) => { if (st.mode !== 'nuc') setMode('nuc'); select(v); });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 460px' }, h('div', { class: 'glabel' }, 'Parts and peduncles', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.seg)), refs.gN = group('Nuclei', '', refs.nseg),
      refs.gM = group('Circuit', 'M · C · L', button('Mossy input', mossy, true), button('Climbing fiber', climb), button('Learn a skill', learn)), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.gN.style.display = st.mode === 'nuc' ? '' : 'none'; refs.gM.style.display = st.mode === 'micro' ? '' : 'none';
    refs.setInfo();
  }
  const _sel = select; select = (id) => { _sel(id); refs.seg && refs.seg.sync(); refs.nseg && refs.nseg.sync(); };
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['anat', 'nuc', 'micro'][n - 1]); return true; }
    if (k === 'm' || k === 'ь') { mossy(); return true; } if (k === 'c' || k === 'с') { climb(); return true; } if (k === 'l' || k === 'д') { learn(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'micro' ? [['Error', st.err.length ? Math.round(st.err[st.err.length - 1] * 100) : 100, '%'], ['Cortical layers', 3, '']] : [['Mass', '120–160', 'г'], ['Of all brain neurons', '>50', '%']]; }
  const self = {
    mobZoom: 0.62, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#7FD6C8',
    kicker: 'Brain · cerebellum', title: 'Cerebellum and motor skills',
    lede: 'More than half of the brain’s neurons are in the cerebellum. Motor memory is written onto the dendrites of Purkinje cells: how to make each movement quickly and accurately.',
    notes: `
      <div><h2>Lobes and lobules</h2>
        <p>The deepest fissures divide the cerebellum into the anterior, posterior and flocculonodular lobes. Lobules of the vermis: lingula, central lobule, culmen, declive, folium, tuber, pyramis, uvula, nodulus. Lobules of the hemispheres: ala of the central lobule, quadrangular, semilunar and biventral lobules, tonsil, flocculus.</p>
        <h3>Inputs</h3>
        <p>Vestibular information from the nuclei of cranial nerve VIII, the spinocerebellar tracts and the pontine nuclei, which relay signals from the frontal cortex.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The vermis, hemispheres, flocculus, three pairs of peduncles.</li><li>Four nuclei and their order from the midline outward.</li><li>The orthogonal lattice: Purkinje fans and parallel fibers, mossy and climbing inputs, basket and stellate cells.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>The shape of the cerebellum is simplified, with fewer folia than in reality.</li><li>The circuit shows 9 Purkinje cells instead of millions.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li>click: part, peduncle, nucleus</li><li><code>M</code> mossy input</li><li><code>C</code> climbing fiber</li><li><code>L</code> skill</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeCereb };
