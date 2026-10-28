import { Sparks, THREE, V3, __set_rnd, button, displaceGeo, envTex, flyStep, flyTarget, glassMat, group, infoBox, labLights, lerp, makeControls, mergeGeometries, mulberry, organMat, rand, randUnit, rnd, seg, taperTube, tissue, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 2 · СПИННОЙ МОЗГ: СРЕЗ, РЕФЛЕКСЫ, ПРОВОДЯЩИЕ ПУТИ, СЕГМЕНТЫ
   ========================================================= */
const SPN_TRACTS = [
  // [номер, название, цвет, восходящий?]
  [1, 'Fasciculus gracilis (Goll)', '#4FA3FF', 1], [2, 'Fasciculus cuneatus (Burdach)', '#6FC3FF', 1], [3, 'Posterior spinocerebellar', '#3FC1B0', 1],
  [4, 'Anterior spinocerebellar', '#5CD48A', 1], [5, 'Anterior spinothalamic', '#9FE07A', 1], [6, 'Lateral spinothalamic', '#7FD6C8', 1],
  [7, 'Lateral corticospinal (pyramidal)', '#FF6A5A', 0], [8, 'Anterior corticospinal (pyramidal)', '#FF8A6A', 0], [9, 'Vestibulospinal', '#F2A14E', 0],
  [10, 'Reticulospinal', '#E9785F', 0], [11, 'Rubrospinal', '#FF7FB0', 0], [12, 'Olivospinal', '#F4C542', 0], [13, 'Tectospinal', '#C77DFF', 0],
];
function spinalCanvas(mode) {
  const W = 1024, H = 768, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const X = (x) => W / 2 + x / 1.1 * (W / 2), Y = (y) => H / 2 - y / 0.825 * (H / 2), S = W / 2 / 1.1;
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  // белое вещество
  g.save(); g.beginPath(); g.ellipse(X(0), Y(0), 1.0 * S, 0.75 * S, 0, 0, Math.PI * 2); g.clip();
  g.fillStyle = mode === 'tracts' ? '#4a4450' : '#cfc6bc'; g.fillRect(0, 0, W, H);
  const blob = (x, y, rx, ry, col, rot = 0) => { g.fillStyle = col; g.beginPath(); g.ellipse(X(x), Y(y), rx * S, ry * S, rot, 0, Math.PI * 2); g.fill(); };
  if (mode === 'tracts') {
    const T = Object.fromEntries(SPN_TRACTS.map((t) => [t[0], t[2]]));
    [1, -1].forEach((s) => {
      blob(0.07 * s, 0.5, 0.07, 0.22, T[1]); blob(0.2 * s, 0.5, 0.08, 0.2, T[2], 0.3 * s);
      blob(0.86 * s, 0.22, 0.1, 0.2, T[3], -0.4 * s); blob(0.88 * s, -0.22, 0.09, 0.18, T[4], 0.4 * s);
      blob(0.62 * s, 0.06, 0.13, 0.16, T[7]); blob(0.78 * s, 0.0, 0.07, 0.1, T[11]);
      blob(0.62 * s, -0.3, 0.1, 0.1, T[6]); blob(0.45 * s, -0.56, 0.09, 0.08, T[5]);
      blob(0.1 * s, -0.55, 0.06, 0.15, T[8]); blob(0.27 * s, -0.66, 0.08, 0.07, T[13]);
      blob(0.62 * s, -0.55, 0.08, 0.08, T[9]); blob(0.4 * s, -0.4, 0.06, 0.06, T[10]); blob(0.8 * s, -0.42, 0.06, 0.07, T[12]);
    });
  }
  g.restore();
  // серое вещество — «бабочка»
  g.fillStyle = mode === 'tracts' ? '#2a2430' : '#7d6876';
  [1, -1].forEach((s) => {
    g.beginPath(); g.moveTo(X(0.12 * s), Y(0.12)); g.quadraticCurveTo(X(0.3 * s), Y(0.3), X(0.36 * s), Y(0.62)); g.lineTo(X(0.48 * s), Y(0.66)); g.quadraticCurveTo(X(0.42 * s), Y(0.3), X(0.32 * s), Y(0.05)); g.lineTo(X(0.12 * s), Y(-0.02)); g.fill();
    g.beginPath(); g.ellipse(X(0.42 * s), Y(-0.36), 0.24 * S, 0.21 * S, 0.25 * s, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(X(0.1 * s), Y(0.1)); g.lineTo(X(0.36 * s), Y(0.06)); g.lineTo(X(0.5 * s), Y(-0.02)); g.lineTo(X(0.5 * s), Y(-0.16)); g.lineTo(X(0.2 * s), Y(-0.2)); g.fill();
  });
  g.fillRect(X(-0.2), Y(0.1), 0.4 * S, 0.22 * S);
  g.fillStyle = '#16121a'; g.beginPath(); g.arc(X(0), Y(0.0), 0.028 * S, 0, Math.PI * 2); g.fill();
  if (mode !== 'tracts') {   // ядра и пластинки (рис. 2.5)
    g.globalAlpha = 0.85;
    [1, -1].forEach((s) => {
      blob(0.42 * s, 0.6, 0.05, 0.035, '#c9a0c8'); blob(0.38 * s, 0.46, 0.045, 0.06, '#d8b0b8'); blob(0.33 * s, 0.3, 0.06, 0.05, '#e6c0a8');
      blob(0.24 * s, 0.1, 0.05, 0.04, '#f0c890'); blob(0.48 * s, -0.06, 0.04, 0.05, '#ffb070'); blob(0.2 * s, -0.08, 0.06, 0.04, '#e8a0ff');
      blob(0.32 * s, -0.42, 0.06, 0.05, '#ff9a8a'); blob(0.52 * s, -0.4, 0.07, 0.05, '#ff9a8a'); blob(0.47 * s, -0.25, 0.05, 0.04, '#ffb0a0');
    });
    g.globalAlpha = 1;
  }
  // борозды
  g.strokeStyle = '#000'; g.lineWidth = 6; g.beginPath(); g.moveTo(X(0), Y(0.75)); g.lineTo(X(0), Y(0.28)); g.stroke();
  g.lineWidth = 12; g.beginPath(); g.moveTo(X(0), Y(-0.76)); g.lineTo(X(0), Y(-0.45)); g.stroke();
  if (mode === 'tracts') {
    g.font = '600 26px system-ui, sans-serif'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const num = [[1, 0.07, 0.5], [2, 0.2, 0.5], [3, 0.86, 0.22], [4, 0.88, -0.22], [7, 0.62, 0.06], [11, 0.78, 0.0], [6, 0.62, -0.3], [5, 0.45, -0.56], [8, 0.1, -0.55], [13, 0.27, -0.66], [9, 0.62, -0.55], [10, 0.4, -0.4], [12, 0.8, -0.42]];
    num.forEach(([n, x, y]) => g.fillText(String(n), X(x), Y(y)));
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function makeSpinal() {
  __set_rnd(mulberry(303));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x060509); scene.environment = envTex; scene.fog = new THREE.FogExp2(0x060509, 0.018);
  labLights(scene, 0xffb070);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 300); camera.position.set(4.6, 4.2, 11.5);
  const HOME = flyTarget(V3(2.2, -0.1, 0), V3(4.4, 5.0, 12.9));
  const controls = makeControls(camera, HOME.target); controls.minDistance = 2; controls.maxDistance = 60;
  const mat = (c, o = {}) => tissue(new THREE.Color(c).multiplyScalar(0.33), o);
  const L = 3.2;

  /* ---------- спинной мозг: белое вещество, серое, срез ---------- */
  const cord = new THREE.Group(); scene.add(cord);
  // белое вещество с передней срединной щелью (снизу) и задней срединной бороздой (сверху)
  const wmShape = (len) => displaceGeo(new THREE.CylinderGeometry(1, 1, len, 192, 1, true).rotateX(Math.PI / 2).scale(1, 0.75, 1), (v) => {
    const th = Math.atan2(v.y / 0.75, v.x), dv = th + Math.PI / 2, dd = th - Math.PI / 2;
    const k = 1 - 0.13 * Math.exp(-((dv / 0.05) ** 2)) - 0.05 * Math.exp(-((dd / 0.04) ** 2)); v.x *= k; v.y *= k;
  });
  const wmGeo = wmShape(L);
  const wmMat = mat(0xeee6dc, { transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide });
  cord.add(new THREE.Mesh(wmGeo, wmMat));
  cord.add(new THREE.Mesh(wmGeo, glassMat(0xf6eee4, { rim: 0.55, base: 0.01, pow: 2.2 })));
  // продолжение мозга к голове — бледный «хвост», по нему уходят восходящие и нисходящие волокна
  { const tg = wmShape(2.6); tg.translate(0, 0, -L / 2 - 1.3); cord.add(new THREE.Mesh(tg, mat(0xeee6dc, { transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }))); }
  const texA = spinalCanvas('anat'), texT = spinalCanvas('tracts');
  const capMat = new THREE.MeshStandardMaterial({ map: texA, color: 0x8c8c8c, roughness: 0.8, envMapIntensity: 0.3, transparent: true, alphaTest: 0.02 });
  capMat.onBeforeCompile = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\nif (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;'); };
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.65), capMat); cap.position.z = L / 2 + 0.002; cord.add(cap);
  const greyMat = mat(0x9b7f90, { roughness: 0.55 });
  const greyArr = [];
  const ext = (pts2, z0 = -L / 2 + 0.02, z1 = L / 2 - 0.01) => { const sh = new THREE.Shape(pts2.map(([x, y]) => new THREE.Vector2(x, y))); const g = new THREE.ExtrudeGeometry(sh, { depth: z1 - z0, bevelEnabled: false, curveSegments: 6 }); g.translate(0, 0, z0); greyArr.push(g); };
  [1, -1].forEach((s) => {
    ext([[0.12 * s, 0.12], [0.26 * s, 0.3], [0.36 * s, 0.62], [0.48 * s, 0.66], [0.42 * s, 0.3], [0.32 * s, 0.05], [0.12 * s, -0.02]]);
    const eg = new THREE.CylinderGeometry(1, 1, L - 0.03, 32); eg.rotateX(Math.PI / 2); eg.scale(0.24, 0.21, 1); eg.rotateZ(0.25 * s); eg.translate(0.42 * s, -0.36, 0); greyArr.push(eg);
    ext([[0.1 * s, 0.1], [0.36 * s, 0.06], [0.5 * s, -0.02], [0.5 * s, -0.16], [0.2 * s, -0.2]]);
  });
  { const b = new THREE.BoxGeometry(0.4, 0.22, L - 0.03); b.translate(0, 0.0, 0); greyArr.push(b); }
  // ExtrudeGeometry требует обход против часовой — для левой половины разворачиваем
  greyArr.forEach((g) => { if (!g.attributes.normal) g.computeVertexNormals(); });
  const greyMesh = new THREE.Mesh(mergeGeometries(greyArr.map((g) => g.index ? g.toNonIndexed() : g)), greyMat); greyMesh.material.side = THREE.DoubleSide; cord.add(greyMesh);
  // оболочки
  const pia = new THREE.Mesh(wmGeo.clone().scale(1.02, 1.02, 1), mat(0xe07890, { transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide })); cord.add(pia);
  const durGeo = new THREE.CylinderGeometry(1.55, 1.55, L, 64, 1, true); durGeo.rotateX(Math.PI / 2);
  const dura = new THREE.Group(); scene.add(dura);
  dura.add(new THREE.Mesh(durGeo, mat(0xe2ddd2, { transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide })), new THREE.Mesh(durGeo, glassMat(0xe8e2d8, { rim: 0.4, base: 0.005, pow: 2.5 })));
  const arGeo = durGeo.clone().scale(0.92, 0.92, 1);
  dura.add(new THREE.Mesh(arGeo, glassMat(0xaecbe6, { rim: 0.25, base: 0.004, pow: 2.5 })));

  /* ---------- корешки, ганглий, нерв, симпатический ствол ---------- */
  const rootMat = mat(0xe8dcc8, { roughness: 0.45 }), ganMat = mat(0xe8c8a0, { roughness: 0.5 }), nerveMat = mat(0xf0e4cc, { roughness: 0.45 }), sympMat = mat(0xd8b890, { roughness: 0.5 });
  const nerveArr = [], sympArr = [], ganArr = [];
  const tube = (arr, pts, r0, r1 = r0, seg = 40) => { const c = new THREE.CatmullRomCurve3(pts); arr.push(taperTube(c, (u) => r0 + (r1 - r0) * u, seg, 10)); return c; };
  const G = {};
  [1, -1].forEach((s) => {
    // корешки начинаются внутри мозга, сходятся в узлах-сферах, концы трубок спрятаны внутри ганглия и нерва
    for (let k = 0; k < 4; k++) { const z = -0.45 + k * 0.3; tube(nerveArr, [V3(0.5 * s, 0.5, z), V3(0.95 * s, 0.6, z * 0.6), V3(1.3 * s, 0.6, z * 0.15)], 0.045, 0.06, 16); tube(nerveArr, [V3(0.5 * s, -0.48, z), V3(0.95 * s, -0.56, z * 0.6), V3(1.35 * s, -0.55, z * 0.15)], 0.045, 0.06, 16); }
    tube(nerveArr, [V3(1.12 * s, 0.6, 0), V3(1.45 * s, 0.57, 0), V3(1.78 * s, 0.5, 0)], 0.13, 0.15, 12);
    [[1.3, 0.6, 0.135], [1.32, -0.55, 0.125], [2.57, 0.0, 0.2]].forEach(([x, y, r]) => { const j = new THREE.SphereGeometry(r, 20, 14); j.translate(x * s, y, 0); nerveArr.push(j); });
    const gg = new THREE.SphereGeometry(1, 32, 20); gg.scale(0.34, 0.24, 0.26); gg.translate(1.9 * s, 0.45, 0); ganArr.push(gg);
    tube(nerveArr, [V3(1.98 * s, 0.43, 0), V3(2.3 * s, 0.22, 0), V3(2.6 * s, 0.0, 0)], 0.14, 0.15, 12);
    tube(nerveArr, [V3(1.3 * s, -0.55, 0), V3(2.0 * s, -0.4, 0), V3(2.6 * s, -0.05, 0)], 0.12, 0.14, 14);
    tube(nerveArr, s > 0 ? [V3(2.55, 0, 0), V3(3.4, -0.25, 0), V3(4.6, -0.55, 0)] : [V3(-2.55, 0, 0), V3(-3.4, -0.25, 0), V3(-4.4, -0.6, 0)], 0.2, 0.18, 24);
    const SG = V3(2.75 * s, -1.75, 0); G[s] = { SG };
    const sg = new THREE.SphereGeometry(1, 24, 16); sg.scale(0.17, 0.2, 0.22); sg.translate(SG.x, SG.y, SG.z); ganArr.push(sg);
    tube(sympArr, [SG.clone().add(V3(0, 0.08, 1.6)), SG.clone().add(V3(0, 0.03, 0.8)), SG.clone()], 0.05, 0.07, 12);
    tube(sympArr, [SG.clone(), SG.clone().add(V3(0, 0.03, -0.8)), SG.clone().add(V3(0, 0.08, -1.6))], 0.07, 0.05, 12);
    tube(sympArr, [V3(2.5 * s, -0.12, -0.08), V3(2.62 * s, -0.8, -0.1), V3(2.72 * s, -1.6, -0.06)], 0.04, 0.04, 12);  // белая ветвь
    tube(sympArr, [V3(2.82 * s, -1.6, 0.1), V3(2.78 * s, -0.8, 0.16), V3(2.62 * s, -0.12, 0.12)], 0.035, 0.035, 12); // серая ветвь
  });
  // ветви к мышце и коже справа
  tube(nerveArr, [V3(4.5, -0.55, 0), V3(5.6, -1.0, 0.1), V3(6.4, -1.45, 0.2)], 0.12, 0.08, 20);
  tube(nerveArr, [V3(4.5, -0.5, 0), V3(5.5, 0.1, -0.1), V3(6.4, 0.62, -0.2)], 0.09, 0.05, 20);
  scene.add(new THREE.Mesh(mergeGeometries(nerveArr), nerveMat), new THREE.Mesh(mergeGeometries(ganArr), ganMat), new THREE.Mesh(mergeGeometries(sympArr), sympMat));

  /* ---------- позвонок (полупрозрачный) ---------- */
  const vert = new THREE.Group(); scene.add(vert); vert.visible = false;   // включается кнопкой «Позвонок»
  const boneMat = mat(0xe0d4ba, { transparent: true, opacity: 0.22, depthWrite: false, roughness: 0.85 });
  const boneGlass = glassMat(0xe8dcc0, { rim: 0.35, base: 0.005, pow: 2.4 });
  const vb = (g) => { vert.add(new THREE.Mesh(g, boneMat), new THREE.Mesh(g, boneGlass)); };
  { const body = new THREE.CylinderGeometry(1.7, 1.7, 1.1, 48); body.rotateX(Math.PI / 2); body.scale(1, 0.7, 1); body.translate(0, -2.75, 0); vb(body);
    const arch = new THREE.TorusGeometry(2.0, 0.32, 16, 48, Math.PI * 1.18); arch.rotateZ(-0.09 * Math.PI); arch.scale(1, 1.05, 1); arch.translate(0, -0.15, 0); vb(arch);
    // ножки и поперечные отростки — скруглённые, остистый — уплощённый конус
    [1, -1].forEach((s) => { const ped = new THREE.CapsuleGeometry(0.26, 0.8, 8, 20); ped.scale(1, 1, 1.4); ped.translate(1.55 * s, -1.6, 0); vb(ped); const tp = new THREE.CapsuleGeometry(0.2, 0.95, 8, 20); tp.rotateZ(Math.PI / 2 - 0.2 * s); tp.scale(1, 1, 1.3); tp.translate(2.7 * s, 0.75, -0.25); vb(tp); });
    const sp = new THREE.ConeGeometry(0.24, 1.7, 20); sp.scale(0.65, 1, 1); sp.rotateX(0.5); sp.translate(0, 2.65, -0.4); vb(sp); }

  /* ---------- мышца и кожа справа ---------- */
  const muscle = new THREE.Group(); muscle.position.set(7.2, -1.85, 0); scene.add(muscle);
  const musMat = mat(0xb03a30, { roughness: 0.55, sheen: 0.4 });
  const mg = new THREE.CapsuleGeometry(0.5, 2.6, 12, 24); mg.rotateX(Math.PI / 2); muscle.add(new THREE.Mesh(mg, musMat));
  const tendon = new THREE.CapsuleGeometry(0.16, 0.9, 6, 12); tendon.rotateX(Math.PI / 2); tendon.translate(0, 0, 2.1); muscle.add(new THREE.Mesh(tendon, mat(0xe8e0d0)));
  const spindle = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.5, 6, 12).rotateX(Math.PI / 2), mat(0xf0c060, { emissive: 0x3a2800 })); spindle.position.set(-0.42, 0.25, 0.2); muscle.add(spindle);
  const skin = new THREE.Group(); skin.position.set(7.0, 0.95, -0.2); scene.add(skin);
  skin.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.8).translate(0, 0.1, 0), mat(0xd8a08c)), new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 1.8).translate(0, -0.03, 0), mat(0xe8c8b0)));
  const hammer = new THREE.Group(); hammer.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 12), mat(0x888090)), new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.42, 20).rotateZ(Math.PI / 2).translate(0, 0.75, 0), mat(0xd04a3a)));
  hammer.position.set(7.2, -0.85, 2.2); hammer.visible = false; scene.add(hammer);
  const pin = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.9, 12).rotateX(Math.PI), mat(0xd8d8e0, { metalness: 0.9, roughness: 0.2 })); pin.position.set(7.0, 1.7, -0.2); pin.visible = false; scene.add(pin);

  /* ---------- нейроны рефлекторных дуг (правая сторона) ---------- */
  const NG = V3(1.9, 0.45, 0), I1 = V3(0.36, 0.42, 0.05), I2 = V3(0.22, -0.04, 0.1), MN = V3(0.45, -0.38, 0), MN2 = V3(0.55, -0.33, 0.9), PG = V3(0.5, -0.06, -0.1);
  const somaMat = (c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.5), roughness: 0.4, emissive: new THREE.Color(c), emissiveIntensity: 0.25 });
  const somas = {};
  [['sens', NG, '#7FD6C8', 0.1], ['i1', I1, '#E8A0FF', 0.06], ['i2', I2, '#E8A0FF', 0.06], ['mn', MN, '#FF8A6A', 0.1], ['mn2', MN2, '#FF8A6A', 0.08], ['pg', PG, '#F4C542', 0.06]].forEach(([id, p, c, r]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), somaMat(c)); m.position.copy(p); scene.add(m); somas[id] = m;
  });
  const fibArr = [];
  const C = (pts) => { const c = new THREE.CatmullRomCurve3(pts); fibArr.push(new THREE.TubeGeometry(c, 60, 0.018, 5)); return c; };
  const SP = muscle.position.clone().add(spindle.position), KR = skin.position.clone().add(V3(0.1, 0.05, 0.2)), EP = muscle.position.clone().add(V3(-0.5, 0.15, -0.4));
  const P = {
    spindle: C([SP, V3(6.3, -1.4, 0.18), V3(5.5, -0.95, 0.06), V3(4.4, -0.5, 0.02), V3(3.4, -0.2, 0.02), V3(2.5, 0.08, 0.02), NG]),
    skin: C([KR, V3(6.3, 0.6, -0.18), V3(5.4, 0.08, -0.06), V3(4.4, -0.45, -0.03), V3(3.4, -0.18, -0.03), V3(2.5, 0.1, -0.03), NG.clone().add(V3(0, 0, -0.01))]),
    central: C([NG, V3(1.55, 0.56, 0), V3(1.1, 0.62, 0), V3(0.62, 0.56, 0), V3(0.44, 0.6, 0.02)]),
    mono: C([V3(0.44, 0.6, 0.02), V3(0.36, 0.3, 0.02), V3(0.38, 0.0, 0.0), MN]),
    toI1: C([V3(0.44, 0.6, 0.02), V3(0.4, 0.5, 0.04), I1]),
    i1i2: C([I1, V3(0.3, 0.2, 0.08), I2]),
    i2mn: C([I2, V3(0.32, -0.2, 0.06), MN]),
    i2mn2: C([I2, V3(0.4, -0.16, 0.5), MN2]),
    motor: C([MN, V3(0.56, -0.48, 0), V3(1.0, -0.56, 0), V3(1.4, -0.55, 0), V3(2.0, -0.4, 0), V3(2.55, -0.03, 0), V3(3.4, -0.27, 0), V3(4.5, -0.6, 0.03), V3(5.6, -1.05, 0.1), EP]),
    motor2: C([MN2, V3(0.62, -0.46, 0.7), V3(1.2, -0.55, 0.3), V3(2.0, -0.42, 0.05), V3(2.55, -0.05, 0.02), V3(3.4, -0.29, 0.02), V3(4.5, -0.62, 0.05), V3(5.6, -1.07, 0.12), EP.clone().add(V3(0, -0.05, 0.6))]),
    ascend: C([I1, V3(0.1, 0.12, 0.05), V3(-0.25, 0.08, 0.0), V3(-0.62, -0.28, -0.3), V3(-0.66, -0.3, -1.4), V3(-0.66, -0.3, -3.6)]),
    inhib: C([V3(0.68, 0.02, -3.6), V3(0.66, 0.04, -1.4), V3(0.5, 0.0, -0.3), I2]),
    pre: C([PG, V3(0.56, -0.47, -0.05), V3(1.3, -0.55, -0.05), V3(2.0, -0.4, -0.06), V3(2.5, -0.12, -0.08), V3(2.62, -0.8, -0.1), G[1].SG.clone().add(V3(-0.05, 0.1, -0.06))]),
    post: C([G[1].SG.clone().add(V3(0.05, 0.1, 0.1)), V3(2.82, -1.6, 0.1), V3(2.78, -0.8, 0.16), V3(2.62, -0.12, 0.12), V3(3.4, -0.22, 0.1), V3(4.5, -0.48, 0.05), V3(5.5, 0.12, -0.06), KR.clone().add(V3(0.3, -0.05, 0.4))]),
  };
  const fibMesh = new THREE.Mesh(mergeGeometries(fibArr), new THREE.MeshPhysicalMaterial({ color: 0x8a7a70, roughness: 0.5, transparent: true, opacity: 0.55, depthWrite: false })); scene.add(fibMesh);

  /* ---------- импульсы ---------- */
  const fx = new Sparks(2400, 0.2); scene.add(fx.obj);
  const COL = { sens: new THREE.Color(0x7fd6c8), pain: new THREE.Color(0xff6a5a), mot: new THREE.Color(0xffb070), inter: new THREE.Color(0xe8a0ff), veg: new THREE.Color(0xf4c542), inh: new THREE.Color(0x6fb4ff) };
  const pulses = [];
  const st = { t: 0, mode: 'anat', labels: true, vert: false,   // позвонок по умолчанию скрыт: полупрозрачный, он закрывал срез
    inhibit: false, fly: null, ms: 0, msRun: false, syn: 0, msg: null, contract: 0, stretch: 0, prick: 0, tap: 0 };
  function pulse(curve, dur, col, onEnd, delay = 0) { pulses.push({ curve, dur, col, onEnd, t0: st.t + delay }); }
  const flash = (o) => { o.material.emissiveIntensity = 2.4; };
  function knee() {
    resetRun(); st.tap = st.t; hammer.visible = true; pin.visible = false; st.msg = TXT.knee; refs.setInfo();
    setTimeout(() => { st.stretch = st.t; pulse(P.spindle, 1.6, COL.sens, () => { flash(somas.sens); pulse(P.central, 0.6, COL.sens, () => pulse(P.mono, 0.45, COL.sens, () => { st.syn = 1; flash(somas.mn); pulse(P.motor, 1.8, COL.mot, () => { st.contract = st.t; st.msRun = false; }); })); }); }, 400);
  }
  function withdraw() {
    resetRun(); st.prick = st.t; pin.visible = true; hammer.visible = false; st.msg = st.inhibit ? TXT.inhib : TXT.withdraw; refs.setInfo();
    pulse(P.skin, 1.7, COL.pain, () => { flash(somas.sens); pulse(P.central, 0.6, COL.pain, () => pulse(P.toI1, 0.3, COL.pain, () => { st.syn = 1; flash(somas.i1); pulse(P.ascend, 2.2, COL.pain, null);
      pulse(P.i1i2, 0.4, COL.inter, () => { st.syn = 2; if (st.inhibit) { somas.i2.material.emissive.set(0x6fb4ff); flash(somas.i2); st.msRun = false; return; } flash(somas.i2); st.syn = 3;
        pulse(P.i2mn, 0.4, COL.inter, () => { flash(somas.mn); pulse(P.motor, 1.8, COL.mot, () => { st.contract = st.t; st.msRun = false; }); });
        pulse(P.i2mn2, 0.55, COL.inter, () => { flash(somas.mn2); pulse(P.motor2, 1.9, COL.mot, null); }); }); })); });
    if (st.inhibit) pulse(P.inhib, 1.9, COL.inh, () => { somas.i2.material.emissive.set(0x6fb4ff); }, 0.6);
  }
  function autonomic() {
    resetRun(); pin.visible = hammer.visible = false; st.msg = TXT.veg; refs.setInfo();
    flash(somas.pg); pulse(P.pre, 1.8, COL.veg, () => { st.syn = 1; G[1].glow = st.t; pulse(P.post, 2.6, COL.veg, () => { st.msRun = false; }); });
  }
  function resetRun() { pulses.length = 0; st.ms = 0; st.msRun = true; st.syn = 0; somas.i2.material.emissive.set(0xe8a0ff); if (st.mode !== 'anat') setMode('anat'); }

  /* ---------- весь спинной мозг: сегменты ---------- */
  const col = new THREE.Group(); col.position.set(-16, -7.5, 0); col.scale.setScalar(0.62); scene.add(col); col.visible = false;
  const REG = [{ n: 'C', k: 8, v: 7, h: 0.62, c: '#5E8FEF' }, { n: 'T', k: 12, v: 12, h: 0.78, c: '#5CC48A' }, { n: 'L', k: 5, v: 5, h: 0.95, c: '#F2C14E' }, { n: 'S', k: 5, v: 1, h: 3.0, c: '#E9785F' }, { n: 'Co', k: 1, v: 1, h: 0.8, c: '#C77DFF' }];
  const vBone = mat(0xe0d4ba, { transparent: true, opacity: 0.35, depthWrite: false, roughness: 0.85 });
  const vTops = []; let y = 24.5;
  REG.forEach((R) => { for (let i = 0; i < R.v; i++) { const hgt = R.h; const top = y; y -= hgt; vTops.push({ R, top, bot: y, i });
    const g = new THREE.CylinderGeometry(0.75 + (R.n === 'L' ? 0.25 : 0), 0.75 + (R.n === 'L' ? 0.25 : 0), hgt * 0.78, 24); g.translate(0, (top + y) / 2, -1.25); col.add(new THREE.Mesh(g, vBone));
    if (R.n !== 'S' && R.n !== 'Co') { const sp = new THREE.BoxGeometry(0.22, hgt * 0.5, 1.1); sp.rotateX(R.n === 'T' ? 0.7 : 0.25); sp.translate(0, (top + y) / 2 - (R.n === 'T' ? 0.25 : 0), 1.0); col.add(new THREE.Mesh(sp, vBone)); }
  } });
  // сегменты спинного мозга сжаты: шейные — в позвонках C1–C7, грудные — до T9, поясничные — T10–T11, крестцовые — T12–L1
  const vt = (n, i) => vTops.find((q) => q.R.n === n && q.i === i);
  const segSpan = { C: [vt('C', 0).top, vt('C', 6).bot], T: [vt('T', 0).top, vt('T', 8).bot], L: [vt('T', 9).top, vt('T', 10).bot], S: [vt('T', 11).top, vt('L', 0).bot - 0.35] };
  const cordCol = [];
  let segI = 0;
  ['C', 'T', 'L', 'S'].forEach((n) => {
    const R = REG.find((q) => q.n === n), [a, b] = segSpan[n], k = n === 'S' ? 6 : R.k;
    for (let i = 0; i < k; i++) {
      const t0 = a + (b - a) * i / k, t1 = a + (b - a) * (i + 1) / k;
      const thick = n === 'C' && i >= 3 ? 0.42 : n === 'T' && i === 0 ? 0.4 : n === 'L' || (n === 'S' && i < 3) ? 0.42 : n === 'S' ? 0.3 - i * 0.03 : 0.32;
      const g = new THREE.CylinderGeometry(thick, thick, (t0 - t1) * 0.96, 20); g.translate(0, (t0 + t1) / 2, 0);
      const c = i === 5 && n === 'S' ? '#C77DFF' : R.c;
      const m = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.55), roughness: 0.4, clearcoat: 0.5, emissive: new THREE.Color(c), emissiveIntensity: 0.12 })); col.add(m);
      cordCol.push({ m, n, i, y: (t0 + t1) / 2 });
      // нерв: выходит у своего межпозвоночного отверстия
      let exitY;
      if (n === 'C') exitY = i === 0 ? vt('C', 0).top + 0.1 : i === 7 ? vt('C', 6).bot : vt('C', i - 1).bot;
      else if (n === 'T') exitY = vt('T', i).bot; else if (n === 'L') exitY = vt('L', i).bot; else exitY = vt('S', 0).top - 0.4 - i * 0.5;
      [1, -1].forEach((s) => {
        const pts = [V3(thick * s, (t0 + t1) / 2, 0)];
        if (exitY < (t0 + t1) / 2 - 0.4) pts.push(V3(0.25 * s + 0.04 * s * i, (t0 + t1) / 2 - 0.5, 0.1), V3(0.35 * s + 0.03 * s * i, exitY + 0.4, 0.1));
        pts.push(V3(1.1 * s, exitY, -0.2), V3(2.0 * s, exitY - 0.35, -0.3));
        col.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.06, 6), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.7), roughness: 0.5, emissive: new THREE.Color(c), emissiveIntensity: 0.1 })));
      });
      segI++;
    }
  });
  { const ft = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(0, segSpan.S[1], 0), V3(0, vt('S', 0).top - 1, 0.05), V3(0, vt('Co', 0).bot + 0.2, 0.05)]), 20, 0.03, 6); col.add(new THREE.Mesh(ft, mat(0xe0d8d0))); }
  const COL_POS = col.position.clone().add(V3(0, 12.2 * 0.62, 0));

  /* ---------- периферический нерв в разрезе (Неттер, BP 12) ---------- */
  const NV = new THREE.Group(); NV.position.set(40, 0, 0); NV.visible = false; scene.add(NV);
  const NL = 5, NR = 1.0, nx = (g) => { g.rotateZ(-Math.PI / 2); return g; };
  { const epi = nx(new THREE.CylinderGeometry(NR, NR, NL, 64, 1, true)); NV.add(new THREE.Mesh(epi, new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf0e0c8).multiplyScalar(0.45), roughness: 0.6, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false })));
    const cap = nx(new THREE.CircleGeometry(NR, 64)); cap.rotateY(0); const capM = new THREE.Mesh(new THREE.CircleGeometry(NR, 64), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2e4c8).multiplyScalar(0.5), roughness: 0.7, emissive: 0x2a2010, emissiveIntensity: 0.3 })); capM.rotation.y = Math.PI / 2; capM.position.x = NL / 2 - 0.001; NV.add(capM);
    // жировые клетки эпиневрия
    const fat = []; for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, r = 0.72 + rnd() * 0.22; if ([0, 1, 2, 3, 4, 5].some((k) => Math.abs(((a - k * Math.PI / 3 + 9 * Math.PI) % (2 * Math.PI)) - Math.PI) > Math.PI - 0.35)) continue; const g = new THREE.SphereGeometry(0.07 + rnd() * 0.04, 10, 8); g.translate(NL / 2 - 0.02, Math.cos(a) * r, Math.sin(a) * r); fat.push(g); }
    if (fat.length) NV.add(new THREE.Mesh(mergeGeometries(fat), organMat('#F2D890', 0.5, { transparent: true, opacity: 0.8 }))); }
  const FASC = [[0, 0, 0.3], ...[0, 1, 2, 3, 4, 5].map((k) => [Math.cos(k * Math.PI / 3) * 0.6, Math.sin(k * Math.PI / 3) * 0.6, 0.25 + 0.04 * (k % 2)])];
  const perM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xb8d8f0).multiplyScalar(0.55), roughness: 0.4, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, emissive: 0x18304a, emissiveIntensity: 0.3 });
  const endM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xe8d8e8).multiplyScalar(0.4), roughness: 0.7, emissive: 0x201820, emissiveIntensity: 0.3 });
  const MY = [], AX = [];
  FASC.forEach(([y, z, r], fi) => { const len = NL - 0.3 - 0.25 * fi % 0.7, x0 = NL / 2 - len / 2 + 0.15 * (fi % 3);
    const per = nx(new THREE.CylinderGeometry(r, r, len, 40, 1, true)); per.translate(x0, y, z); NV.add(new THREE.Mesh(per, perM));
    const ec = new THREE.Mesh(new THREE.CircleGeometry(r - 0.01, 40), endM); ec.rotation.y = Math.PI / 2; ec.position.set(x0 + len / 2 - 0.02, y, z); NV.add(ec);
    const pts = []; for (let i = 0; i < 400 && pts.length < Math.round(55 * r * r / 0.09); i++) { const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (r - 0.05), q = [y + Math.cos(a) * rr, z + Math.sin(a) * rr]; if (pts.every((o) => Math.hypot(o[0] - q[0], o[1] - q[1]) > 0.075)) pts.push(q); }
    pts.forEach(([py, pz], i) => { const big = i % 3 !== 2, l2 = len - 0.04 + rand(0, 0.12); MY.push({ x: x0 + l2 / 2 - len / 2, y: py, z: pz, l: l2, r: big ? 0.032 : 0.02 }); AX.push({ x: x0 + l2 / 2 - len / 2 + 0.03, y: py, z: pz, l: l2, r: big ? 0.016 : 0.011 }); }); });
  { const myI = new THREE.InstancedMesh(nx(new THREE.CylinderGeometry(1, 1, 1, 10)), new THREE.MeshPhysicalMaterial({ color: 0xf4efe6, roughness: 0.3, clearcoat: 0.8 }), MY.length), axI = new THREE.InstancedMesh(nx(new THREE.CylinderGeometry(1, 1, 1, 8)), new THREE.MeshPhysicalMaterial({ color: 0xe8b84a, roughness: 0.4, emissive: 0x4a3000, emissiveIntensity: 0.4 }), AX.length), m4 = new THREE.Matrix4();
    MY.forEach((f, i) => { m4.makeScale(f.l, f.r, f.r).setPosition(f.x, f.y, f.z); myI.setMatrixAt(i, m4); }); AX.forEach((f, i) => { m4.makeScale(f.l, f.r, f.r).setPosition(f.x, f.y, f.z); axI.setMatrixAt(i, m4); }); NV.add(myI, axI); }
  // продольные сосуды нерва (vasa nervorum) в эпиневрии
  [[0.86, 0.3, '#E0505A'], [-0.84, -0.28, '#5C7CE8'], [0.1, -0.86, '#E0505A']].forEach(([y, z, c]) => { const g = nx(new THREE.CylinderGeometry(0.045, 0.045, NL + 0.1, 12)); g.translate(0.02, y, z); NV.add(new THREE.Mesh(g, organMat(c, 0.6))); });
  const NERVE_VIEW = flyTarget(V3(40.2, -1.35, 1.2), V3(47.6, 1.4, 5.6));

  /* ---------- режимы ---------- */
  function setMode(m) {
    st.mode = m; refs.modeSeg && refs.modeSeg.sync();
    capMat.map = m === 'tracts' ? texT : texA; capMat.needsUpdate = true;
    const seg2 = m === 'segments', nv = m === 'nerve';
    if (st.nvHidden) { st.nvHidden.forEach((o) => { o.visible = true; }); st.nvHidden = null; }
    if (nv) { st.nvHidden = scene.children.filter((o) => o !== NV && o.visible && !o.isLight && o !== fx.obj); st.nvHidden.forEach((o) => { o.visible = false; }); }
    NV.visible = nv; col.visible = seg2; cord.visible = dura.visible = !seg2 && !nv; vert.visible = m === 'anat' && st.vert;
    [muscle, skin, fibMesh, fx.obj, ...Object.values(somas)].forEach((o) => { o.visible = !seg2 && !nv && m !== 'tracts'; });
    if (nv) st.fly = NERVE_VIEW;
    else if (seg2) st.fly = flyTarget(COL_POS, COL_POS.clone().add(V3(13, 2.5, 25)));
    else if (m === 'tracts') st.fly = flyTarget(V3(0, 0, 1.6), V3(1.3, 1.1, 7.2));
    else st.fly = HOME;
    st.msg = null; refs.setInfo && refs.setInfo();
  }
  function update(dt) {
    st.t += dt; const t = st.t;
    flyStep(st, camera, controls, dt);
    if (st.msRun) st.ms += dt * 12;   // сцена замедлена ~ в 80 раз
    for (let i = pulses.length - 1; i >= 0; i--) {
      const q = pulses[i], k = (t - q.t0) / q.dur; if (k < 0) continue;
      if (k >= 1) { pulses.splice(i, 1); if (q.onEnd) q.onEnd(); continue; }
      const p = q.curve.getPointAt(k); for (let j = 0; j < 3; j++) fx.spawn(p.clone().add(randUnit().multiplyScalar(0.03)), randUnit().multiplyScalar(0.08), q.col, 0.5, 1, 2.2);
    }
    fx.update(dt);
    Object.values(somas).forEach((m) => { m.material.emissiveIntensity = lerp(m.material.emissiveIntensity, 0.25, 1 - Math.exp(-dt * 2)); });
    // молоточек, растяжение, сокращение, укол
    const tp = t - st.tap; hammer.rotation.x = hammer.visible ? (tp < 0.4 ? -0.9 * (1 - tp / 0.4) : tp < 0.6 ? 0.25 * Math.sin((tp - 0.4) / 0.2 * Math.PI) : 0) : 0;
    const sk = Math.exp(-Math.max(0, t - st.stretch) / 0.25) * (t > st.stretch ? 1 : 0), ck = t > st.contract ? Math.exp(-(t - st.contract) / 0.6) : 0;
    muscle.scale.set(1 + 0.12 * ck - 0.04 * sk, 1 + 0.12 * ck - 0.04 * sk, 1 + 0.06 * sk - 0.1 * ck); musMat.emissive.setRGB(0.4 * ck, 0.1 * ck, 0.05 * ck);
    spindle.material.emissiveIntensity = 1 + 4 * sk;
    const pk = t - st.prick; pin.position.y = 1.7 - (pk < 0.5 ? 0.6 * Math.sin(pk / 0.5 * Math.PI) : 0) + (pk > 0.5 && st.contract > st.prick ? Math.min(0.6, (t - st.contract) * 0.8) : 0);
    if (G[1].glow) { const g = Math.exp(-(t - G[1].glow) / 0.5); somas.pg.material.emissiveIntensity = Math.max(somas.pg.material.emissiveIntensity, g); }
  }
  const TXT = {
    anat: 'A cross-section of the spinal cord (dorsal side up). The gray matter looks like a <b>butterfly</b>: the thin posterior horns almost reach the surface, the thick anterior horns do not, and the lateral horns lie between them. Around it is the white matter with its tracts. Sensory fibers enter through the <b>posterior root</b>, which carries a swelling, the <b>spinal (dorsal root) ganglion</b>, with pseudounipolar neurons. The axons of motor neurons and autonomic neurons leave through the <b>anterior root</b>. Below lies the <b>sympathetic trunk</b> with its white and gray rami.',
    tracts: '<b>Tracts</b>, numbered on the section. Blue and green are ascending, sensory: 1 fasciculus gracilis (from the legs), 2 fasciculus cuneatus (from the arms), 3 and 4 spinocerebellar, 5 and 6 spinothalamic (pain, temperature). Red and orange are descending: 7 and 8 pyramidal (voluntary movement), 9–13 the ancient extrapyramidal system: the vestibulospinal, reticulospinal, rubrospinal, olivospinal and tectospinal tracts.',
    knee: 'The <b>knee-jerk reflex</b> is a monosynaptic arc. The hammer suddenly stretches the quadriceps, and the <b>muscle spindle</b> fires. The impulse runs along the sensory fiber, through the ganglion and the posterior root, straight to a <b>motor neuron</b> in the anterior horn: just one synapse. The motor neuron responds and the muscle contracts. This is the fastest reflex: it maintains posture when a load suddenly stretches a muscle.',
    withdraw: 'The <b>withdrawal reflex</b> is polysynaptic. Prick → pain ending → ganglion → interneuron of the posterior horn → interneuron of the intermediate zone → flexor motor neurons of the same and neighboring segments. The stronger the pain, the more muscles are recruited. At the same time the signal crosses to the other side and ascends to the thalamus (red tail going up): that is how we become aware of the pain only after we have already pulled the hand away.',
    inhib: '<b>The brain inhibits the reflex.</b> Axons from the brain (blue signal from above) reach the interneuron of the intermediate zone. If the brain manages to send an inhibitory signal in time, the hand is not pulled away: this is how we hold still while blood is taken from a finger. The knee-jerk reflex has no such interneuron, so it cannot be suppressed.',
    veg: 'An <b>autonomic arc</b> of two neurons. A <b>preganglionic</b> neuron of the lateral horn sends its axon through the anterior root and the <b>white ramus</b> to a sympathetic ganglion. There a <b>postganglionic</b> neuron sends its axon along the <b>gray ramus</b> back into the nerve, to blood vessels, sweat glands and the muscles of the hair follicles. Sympathetic neurons are found only in the thoracic and upper lumbar segments.',
    nerve: '<b>A peripheral nerve in cross-section.</b> A nerve is a cable of thousands of axons. Each fiber is wrapped in thin <b>endoneurium</b>; fibers are gathered into fascicles covered by <b>perineurium</b> — a dense cell layer that acts as a blood–nerve barrier. Everything is wrapped in <b>epineurium</b> of dense connective tissue with fat and its own vessels. The white sleeves are myelin from Schwann cells. After an injury the surgeon sutures the nerve through the epineurium or the perineurium of the fascicles; axons regrow about 1 mm a day.',
    segments: '<b>31 segments</b> are the 31 “floors” of the body: 8 cervical, 12 thoracic, 5 lumbar, 5 sacral and one coccygeal. Each gives off a pair of nerves. The spine grows faster than the cord, so in an adult the spinal cord ends at the second lumbar vertebra, and below it the roots run downward as the <b>cauda equina</b>. The enlargements in the cervical and lumbar regions control the arms and legs. A lumbar puncture is done below the end of the cord, in the lumbar cistern.',
  };
  const labels = [
    { text: 'posterior horn', pos: V3(0.42, 0.66, L / 2), color: '#c9a0c8', show: () => st.labels && st.mode === 'anat' },
    { text: 'anterior horn', pos: V3(0.5, -0.36, L / 2), color: '#ff9a8a', show: () => st.labels && st.mode === 'anat' },
    { text: 'lateral horn', pos: V3(0.55, -0.06, L / 2), color: '#ffb070', show: () => st.labels && st.mode === 'anat' },
    { text: 'white matter', pos: V3(-0.8, 0.35, L / 2), color: '#efe8dc', show: () => st.labels && st.mode === 'anat' },
    { text: 'central canal', pos: V3(0.02, 0.05, L / 2), color: '#9a92a6', show: () => st.labels && st.mode === 'tracts' },
    { text: 'posterior root', pos: V3(-1.05, 0.72, 0.2), color: '#efe2c8', show: () => st.labels && st.mode === 'anat' },
    { text: 'anterior root', pos: V3(-1.3, -0.75, -0.5), color: '#efe2c8', show: () => st.labels && st.mode === 'anat' },
    { text: 'spinal ganglion', pos: V3(-1.95, 1.05, 0.2), color: '#e8c8a0', show: () => st.labels && st.mode === 'anat' },
    { text: 'spinal nerve', pos: V3(-3.5, -0.05, 0), color: '#efe2c8', show: () => st.labels && st.mode === 'anat' },
    { text: 'sympathetic trunk', pos: V3(-2.75, -2.0, 0.9), color: '#d8b890', show: () => st.labels && st.mode === 'anat' },
    { text: 'white and gray rami', pos: V3(2.9, -0.9, 0.2), color: '#d8b890', show: () => st.labels && st.mode === 'anat' },
    { text: 'dura mater', pos: V3(-1.15, -1.2, 1.2), color: '#e2ddd2', show: () => st.labels && st.mode === 'anat' },
    { text: 'vertebra', pos: V3(0, -2.9, 0.8), color: '#e0d4ba', show: () => st.labels && st.mode === 'anat' && st.vert },
    { text: 'muscle spindle', pos: SP.clone().add(V3(0, 0.3, 0)), color: '#f0c060', show: () => st.labels && st.mode === 'anat' },
    { text: 'muscle', pos: muscle.position.clone().add(V3(0.4, -0.5, 0.6)), color: '#ff8a7a', show: () => st.labels && st.mode === 'anat' },
    { text: 'skin', pos: skin.position.clone().add(V3(0.6, 0.2, 0.6)), color: '#e8c0a8', show: () => st.labels && st.mode === 'anat' },
    { text: 'motor neuron', pos: MN.clone().add(V3(0.05, -0.12, 0.2)), color: '#ff8a6a', show: () => st.labels && st.mode === 'anat' && st.msRun },
    { text: 'interneurons', pos: I2.clone().add(V3(-0.1, 0.1, 0.2)), color: '#e8a0ff', show: () => st.labels && st.mode === 'anat' && st.msRun },
    { text: 'to the thalamus', pos: V3(-0.66, -0.3, -3.4), color: '#ff6a5a', show: () => st.labels && st.mode === 'anat' && st.msRun },
    { text: 'epineurium', pos: V3(40.6, 0.98, 0.25), color: '#F0E0C8', show: () => st.labels && st.mode === 'nerve' },
    { text: 'perineurium', pos: V3(42.5, 0.6 + 0.26, 0.05), color: '#B8D8F0', show: () => st.labels && st.mode === 'nerve' },
    { text: 'fascicle', pos: V3(42.55, -0.3, -0.52), color: '#E8D8E8', show: () => st.labels && st.mode === 'nerve' },
    { text: 'myelinated fiber', pos: V3(42.6, 0.05, 0.12), color: '#F4EFE6', show: () => st.labels && st.mode === 'nerve' },
    { text: 'nerve vessels', pos: V3(42.5, 0.86, 0.36), color: '#E0505A', show: () => st.labels && st.mode === 'nerve' },
    { text: 'epineurial fat', pos: V3(42.5, -0.8, 0.45), color: '#F2D890', show: () => st.labels && st.mode === 'nerve' },
    { text: 'cervical C1–C8', pos: V3(0, 0, 0), sg: 'C', color: '#5E8FEF', show: () => st.labels && st.mode === 'segments' },
    { text: 'thoracic T1–T12', pos: V3(0, 0, 0), sg: 'T', color: '#5CC48A', show: () => st.labels && st.mode === 'segments' },
    { text: 'lumbar L1–L5', pos: V3(0, 0, 0), sg: 'L', color: '#F2C14E', show: () => st.labels && st.mode === 'segments' },
    { text: 'sacral S1–S5', pos: V3(0, 0, 0), sg: 'S', color: '#E9785F', show: () => st.labels && st.mode === 'segments' },
    { text: 'cauda equina', pos: V3(0, 0, 0), sg: 'cauda', color: '#efe2c8', show: () => st.labels && st.mode === 'segments' },
  ];
  // подписи путей: справа от среза столбиком, сегментов — сбоку от колонны
  { const TRP = { 1: [0.07, 0.5], 2: [0.2, 0.5], 3: [0.86, 0.22], 4: [0.88, -0.22], 5: [0.45, -0.56], 6: [0.62, -0.3], 7: [0.62, 0.06], 8: [0.1, -0.55], 9: [0.62, -0.55], 10: [0.4, -0.4], 11: [0.78, 0.0], 12: [0.8, -0.42], 13: [0.27, -0.66] };
    labels.forEach((l) => { if (l.tr) { const [x, yy] = TRP[l.tr[0]]; l.pos.set(x, yy, L / 2 + 0.01); } });
    col.updateMatrixWorld(true);
    const midY = (n) => { const a = cordCol.filter((c) => c.n === n); return a.reduce((s, c) => s + c.y, 0) / a.length; };
    labels.forEach((l) => { if (l.sg) { const yy = l.sg === 'cauda' ? vt('L', 3).bot : midY(l.sg); l.pos.copy(col.localToWorld(V3(2.6, yy, 0))); } }); }
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 300px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || TXT[st.mode]; };
    refs.modeSeg = seg([{ id: 'anat', label: 'Section and roots' }, { id: 'tracts', label: 'Tracts' }, { id: 'segments', label: 'Segments' }, { id: 'nerve', label: 'Nerve cross-section' }], () => st.mode, (v) => setMode(v));
    const vb2 = toggle('Vertebra', () => st.vert, (v) => { st.vert = v; vert.visible = v && st.mode !== 'segments'; });
    const inh = toggle('Brain inhibits', () => st.inhibit, (v) => { st.inhibit = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { vb2, inh, lab });
    el.append(group('Mode', '1–4', refs.modeSeg), group('Reflexes', 'K · W · A', button('Knee-jerk', knee, true), button('Withdrawal', withdraw), inh, button('Autonomic', autonomic)), group('View', 'V · N', vb2, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === '1') { setMode('anat'); return true; } if (k === '2') { setMode('tracts'); return true; } if (k === '3') { setMode('segments'); return true; } if (k === '4') { setMode('nerve'); return true; }
    if (k === 'k' || k === 'л') { knee(); return true; } if (k === 'w' || k === 'ц') { withdraw(); return true; } if (k === 'a' || k === 'ф') { autonomic(); return true; }
    if (k === 'v' || k === 'м') { refs.vb2.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'nerve') return [['Axons in the sciatic nerve', '≈ 50 000', ''], ['Axon regrowth', '≈ 1', 'mm/day']];
    if (st.mode === 'segments') return [['Segments', 31, ''], ['Length', '42–45', 'cm'], ['Mass', '34–38', 'г']];
    return [['Arc time', Math.round(st.ms), 'ms'], ['Synapses', st.syn, ''], ['Neurons', '13.5', 'million']];
  }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#FFB070',
    kicker: 'Brain · spinal cord', title: 'Spinal cord',
    lede: 'A tube of nervous tissue in the vertebral canal: 31 segments, reflex arcs and the tracts that link the body with the brain.',
    notes: `
      <div><h2>How the spinal cord is built</h2>
        <p>It is 42–45 cm long and weighs 34–38 g, with a canal about 1 mm wide inside. It contains 13.5 million neurons, and only 3% of them are efferent (motor and autonomic neurons); the remaining 97% are interneurons. The posterior roots are the sensory inputs, the anterior roots the motor and autonomic outputs. The roots, ganglia and nerves belong to the peripheral nervous system.</p>
        <h3>Gray matter</h3>
        <p>Sensory signals are relayed in the posterior horns: the marginal zone, the spongy zone and the substantia gelatinosa (pain), the nucleus proprius, and Clarke’s thoracic nucleus (proprioception). The lateral horns hold the sympathetic centers of the thoracic and upper lumbar segments and the main “computing center”, the intermediomedial nucleus. The anterior horns hold the motor neurons: the lateral nuclei control distal muscles (the fingers), the medial nuclei the trunk. Bror Rexed divided the gray matter into 10 laminae.</p>
        <h3>White matter</h3>
        <p>The posterior columns carry skin and muscle sensation without a relay in the spinal cord: the first synapse is only in the medulla. The spinocerebellar tracts are even faster. Pain and temperature travel more slowly, along the spinothalamic tracts, which cross at their own segment. About 80% of the pyramidal tract crosses at the junction with the brain; the remaining 20% crosses at the level of its own segment.</p></div>
      <div><h2>What is accurate here</h2><ul>
        <li>The shape of the section: the posterior horns thinner and longer, the anterior horns thicker; the posterior sulcus and the deep anterior fissure.</li><li>The monosynaptic knee-jerk reflex and the polysynaptic withdrawal reflex with its ascending branch to the thalamus.</li><li>The two-neuron autonomic arc through the white and gray rami.</li><li>The compressed segments and the cauda equina below the second lumbar vertebra.</li></ul>
        <h2 style="margin-top:22px">Simplifications</h2><ul><li>Time is slowed down about 80-fold: a real knee-jerk reflex takes about 20–25 ms.</li><li>The vertebra is simplified; the muscle and skin are moved close to the spinal cord.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>K</code> knee-jerk reflex</li><li><code>W</code> withdrawal</li><li><code>A</code> autonomic</li><li><code>V</code> vertebra</li><li><code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeSpinal };
