import { GLOW, Sparks, THREE, V3, __set_rnd, accentSet, addLights, canvas, clamp, cur, displaceGeo, envTex, glassMat, group, h, makeControls, mulberry, noise3, rand, randUnit, rnd, seg, smooth, toggle } from '../core.js';


/* =========================================================
   SCENE 0 · ЖИВАЯ КЛЕТКА
   ========================================================= */
const ORGANELLES = [
  { id: 'membrane', name: 'Мембрана', color: '#9CC8FF', size: 'толщина 7–10 нм', text: '<b>Плазматическая мембрана</b> — двойной слой липидов со встроенными белками: каналами, насосами, рецепторами. Пропускает внутрь не всё подряд. На ней нейрон держит заряд −70 мВ.' },
  { id: 'nucleus', name: 'Ядро', color: '#B48CFF', size: '≈ 6 мкм', text: '<b>Ядро</b> хранит ДНК. Окружено двойной оболочкой с порами. Внутри — хроматин: нити ДНК, намотанные на белки.' },
  { id: 'nucleolus', name: 'Ядрышко', color: '#D36FB6', size: '1–2 мкм', text: '<b>Ядрышко</b> — плотный участок ядра, где собирают субъединицы рибосом.' },
  { id: 'pores', name: 'Ядерные поры', color: '#E7D4FF', size: '≈ 120 нм', text: '<b>Ядерные поры</b> — ворота в оболочке ядра. Через них наружу выходят мРНК (светлые искры), внутрь заходят белки.' },
  { id: 'rer', name: 'Шероховатая ЭПС', color: '#5FB0D6', size: 'мешки ≈ 50 нм', text: '<b>Шероховатая ЭПС</b> — стопки мембранных мешков, усыпанные рибосомами. Здесь делают белки для мембраны и на экспорт: рецепторы, каналы, ферменты синтеза медиаторов.' },
  { id: 'ser', name: 'Гладкая ЭПС', color: '#7FD8C4', size: 'трубочки ≈ 50 нм', text: '<b>Гладкая ЭПС</b> — сеть трубочек без рибосом. Синтезирует липиды и хранит запас Ca²⁺.' },
  { id: 'golgi', name: 'Аппарат Гольджи', color: '#E6A84E', size: 'стопка 1–3 мкм', text: '<b>Аппарат Гольджи</b> принимает белки из ЭПС (с выпуклой стороны), дорабатывает, сортирует и отправляет в пузырьках к мембране и лизосомам.' },
  { id: 'mito', name: 'Митохондрии', color: '#E0703F', size: '0.5–2 мкм', text: '<b>Митохондрии</b> вырабатывают АТФ (жёлтые искры). Внутренняя мембрана сложена в кристы, чтобы уместить больше ферментов дыхания. У них своя ДНК.' },
  { id: 'lyso', name: 'Лизосомы', color: '#9B6BE0', size: '0.1–1 мкм', text: '<b>Лизосомы</b> — пузырьки с пищеварительными ферментами. Переваривают отслужившие части клетки и то, что захвачено с поверхности.' },
  { id: 'perox', name: 'Пероксисомы', color: '#8FD16A', size: '0.1–1 мкм', text: '<b>Пероксисомы</b> окисляют жирные кислоты и обезвреживают перекись водорода ферментом каталазой (кристаллическое ядро внутри).' },
  { id: 'centro', name: 'Центросома', color: '#B8F0D0', size: 'центриоль ≈ 0.2 × 0.5 мкм', text: '<b>Центросома</b> — пара центриолей под прямым углом, каждая из 9 троек микротрубочек. Отсюда растут микротрубочки цитоскелета.' },
  { id: 'cyto', name: 'Цитоскелет', color: '#9BE8C6', size: 'микротрубочка 25 нм', text: '<b>Микротрубочки</b> — рельсы клетки. Моторные белки кинезин и динеин везут по ним грузы: в нейроне так пузырьки едут по аксону к синапсу.' },
  { id: 'ribo', name: 'Рибосомы', color: '#E06A6A', size: '≈ 25 нм', text: '<b>Рибосомы</b> читают мРНК и собирают белок. Свободные делают белки для самой цитоплазмы.' },
  { id: 'ves', name: 'Пузырьки', color: '#FFD08A', size: '50–100 нм', text: '<b>Транспортные пузырьки</b> везут груз: ЭПС → Гольджи → мембрана. У мембраны пузырёк сливается с ней и выплёскивает содержимое (экзоцитоз). Так нейрон выпускает медиатор.' },
];

function makeCell() {
  __set_rnd(mulberry(31));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06070a); scene.environment = envTex; scene.fog = new THREE.FogExp2(0x06070a, 0.016);
  addLights(scene, 0x7aa8ff);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 200); camera.position.set(11, 6.5, 13.5);
  const controls = makeControls(camera, V3(0, 0, 0)); controls.minDistance = 1.5; controls.maxDistance = 40; controls.autoRotate = true; controls.autoRotateSpeed = 0.3;

  const CELL_R = 6, YS = 0.82, NUC = V3(0.3, 0, 0.2), NUC_R = 2.0;
  const G = V3(-2.9, 2.2, -1.2), C = NUC.clone().add(V3(0.1, 2.75, 0));
  const cut = [new THREE.Plane(V3(-1, 0, 0), 0), new THREE.Plane(V3(0, 0, -1), 0)];
  const ORG = Object.fromEntries(ORGANELLES.map((o) => [o.id, { ...o, mats: [], anchor: V3(0, 0, 0), dist: 7 }]));
  const pickables = [];
  const tag = (mesh, id, mat = true) => { mesh.userData.org = id; pickables.push(mesh); if (mat && mesh.material && mesh.material.emissive) ORG[id].mats.push(mesh.material); return mesh; };
  const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color(0xffffff), envMapIntensity: 0.7, emissive: 0x000000, ...o });
  const inCell = (p, m = 0) => p.x * p.x + (p.y / YS) ** 2 + p.z * p.z < (CELL_R - m) ** 2;
  const sample = (test) => { for (let i = 0; i < 4000; i++) { const p = V3(rand(-5.6, 5.6), rand(-4.7, 4.7), rand(-5.6, 5.6)); if (test(p)) return p; } return V3(0, -3.5, 3); };
  const fib = (n) => { const out = []; const g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y); out.push(V3(Math.cos(g * i) * r, y, Math.sin(g * i) * r)); } return out; };
  const dummy = new THREE.Object3D(), Y = V3(0, 1, 0), Z = V3(0, 0, 1);

  /* membrane */
  const memGeo = displaceGeo(new THREE.SphereGeometry(CELL_R, 160, 120), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.045 * noise3(n.x * 1.4, n.y * 1.4, n.z * 1.4) + 0.012 * noise3(n.x * 6, n.y * 6, n.z * 6)); v.y *= YS; });
  const memSolid = phys(0xbcd6f2, { transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide });
  scene.add(tag(new THREE.Mesh(memGeo, memSolid), 'membrane'));
  scene.add(new THREE.Mesh(memGeo, glassMat(0x9cc8ff, { rim: 0.85, base: 0.015, pow: 2.3 })));
  const memIn = new THREE.Mesh(memGeo, glassMat(0x9cc8ff, { rim: 0.35, base: 0.0, pow: 2.6 })); memIn.scale.setScalar(0.985); scene.add(memIn);
  { const pos = memGeo.attributes.position, nor = memGeo.attributes.normal, N = 450;
    const prot = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 10, 8), phys(0xffffff, { roughness: 0.5 }), N);
    for (let i = 0; i < N; i++) { const k = Math.floor(rnd() * pos.count); const p = V3(pos.getX(k), pos.getY(k), pos.getZ(k)), n = V3(nor.getX(k), nor.getY(k), nor.getZ(k));
      dummy.position.copy(p); dummy.quaternion.setFromUnitVectors(Y, n); dummy.scale.set(1, rand(1.0, 1.6), 1); dummy.updateMatrix(); prot.setMatrixAt(i, dummy.matrix); prot.setColorAt(i, new THREE.Color(rnd() < 0.18 ? 0xffc77a : 0xd9e7ff)); }
    scene.add(tag(prot, 'membrane')); }
  ORG.membrane.anchor = V3(-3.1, 3.55, 3.0); ORG.membrane.dist = 17;

  /* nucleus */
  const nucGeo = displaceGeo(new THREE.SphereGeometry(NUC_R, 128, 96), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.03 * noise3(n.x * 2, n.y * 2, n.z * 2)); v.add(NUC); });
  const nucMat = phys(0x7d4fb8, { transparent: true, opacity: 0.34, depthWrite: false, side: THREE.DoubleSide });
  scene.add(tag(new THREE.Mesh(nucGeo, nucMat), 'nucleus'));
  scene.add(new THREE.Mesh(nucGeo, glassMat(0xc79bff, { rim: 0.8, base: 0.02, pow: 2.2 })));
  const nucIn = new THREE.Mesh(nucGeo, glassMat(0xc79bff, { rim: 0.3, base: 0, pow: 2.4 })); nucIn.position.copy(NUC).multiplyScalar(0.05); nucIn.scale.setScalar(0.95); scene.add(nucIn);
  const poreDirs = fib(240), porePts = [];
  { const pm = new THREE.InstancedMesh(new THREE.TorusGeometry(0.075, 0.026, 6, 16), phys(0xe7d4ff, { emissive: 0x2a1840 }), poreDirs.length);
    poreDirs.forEach((d, i) => { const p = NUC.clone().addScaledVector(d, NUC_R * 1.01); porePts.push({ p, d }); dummy.position.copy(p); dummy.quaternion.setFromUnitVectors(Z, d); dummy.scale.setScalar(1); dummy.updateMatrix(); pm.setMatrixAt(i, dummy.matrix); });
    scene.add(tag(pm, 'pores')); }
  ORG.nucleus.anchor = NUC.clone().add(V3(-1.2, 1.25, 1.05)); ORG.nucleus.dist = 9;
  ORG.pores.anchor = NUC.clone().addScaledVector(V3(1, 1.2, -0.4).normalize(), NUC_R); ORG.pores.dist = 4.5;
  const chromMat = phys(0xd27ac0, { roughness: 0.5, emissive: 0x2a0b25 });
  for (let c = 0; c < 30; c++) {
    let p = randUnit().multiplyScalar(rand(0.3, 1.5)); const d = randUnit(); const pts = [p.clone().add(NUC)];
    for (let k = 0; k < 11; k++) { d.add(randUnit().multiplyScalar(0.7)).normalize(); p = p.clone().addScaledVector(d, 0.32); if (p.length() > 1.72) { p.multiplyScalar(1.6 / p.length()); d.negate(); } pts.push(p.clone().add(NUC)); }
    scene.add(tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.038, 6), chromMat), 'nucleus', c === 0));
  }
  const NO = NUC.clone().add(V3(0.35, 0.3, -0.25));
  scene.add(tag(new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(0.58, 48, 32), (v) => { const n = v.clone().normalize(); v.multiplyScalar(1 + 0.12 * noise3(n.x * 4, n.y * 4, n.z * 4)); v.add(NO); }), phys(0x6e2c64, { roughness: 0.75, clearcoat: 0.2, emissive: 0x1a0616 })), 'nucleolus'));
  ORG.nucleolus.anchor = NO.clone(); ORG.nucleolus.dist = 4;

  /* rough ER */
  // стопки отдельных цистерн в разных секторах; первая цистерна каждой стопки — продолжение наружной ядерной мембраны (r = 1.04·R ядра)
  const rerMat = phys(0x5fb0d6, { transparent: true, opacity: 0.5, side: THREE.DoubleSide, roughness: 0.32 });
  const rerVerts = [], rerAnch = [];
  [[0.35, 0.75, 4], [1.35, 1.45, 3], [2.4, 0.85, 4], [3.35, 1.55, 3], [0.9, 2.0, 3], [3.9, 0.95, 3]].forEach(([ph0, th0, nL], si) => {
    for (let k = 0; k < nL; k++) {
      const r = NUC_R * 1.04 + k * 0.2, phL = 0.95 + 0.08 * k + 0.1 * (si % 2), thL = 0.72;
      const g = displaceGeo(new THREE.SphereGeometry(r, 40, 20, ph0 - 0.04 * k, phL, th0, thL), (v) => {
        const n = v.clone().normalize(), ph = Math.atan2(n.z, n.x), th = Math.acos(clamp(n.y, -1, 1));
        v.multiplyScalar(1 + 0.03 * Math.sin(ph * 9 + k * 1.3) * Math.sin(th * 7 + k) + 0.012 * noise3(n.x * 4 + k, n.y * 4, n.z * 4)); v.add(NUC);
      });
      const pos = g.attributes.position; for (let i = 0; i < pos.count; i += 3) rerVerts.push(V3(pos.getX(i), pos.getY(i), pos.getZ(i)));
      if (k === nL - 1) { const sp = (rr) => V3(-rr * Math.cos(ph0 + phL / 2) * Math.sin(th0 + thL / 2), rr * Math.cos(th0 + thL / 2), rr * Math.sin(ph0 + phL / 2) * Math.sin(th0 + thL / 2)).add(NUC); rerAnch.push(sp(r + 0.1)); }
      scene.add(tag(new THREE.Mesh(g, rerMat), 'rer', si === 0 && k === 0));
    }
  });
  { const N = 1800, rm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.034, 8, 6), phys(0xe06a6a, { roughness: 0.6, emissive: 0x200404 }), N);
    for (let i = 0; i < N; i++) { const p = rerVerts[Math.floor(rnd() * rerVerts.length)]; const out = p.clone().sub(NUC).normalize(); dummy.position.copy(p).addScaledVector(out, rnd() < 0.5 ? 0.04 : -0.04); dummy.quaternion.identity(); dummy.scale.setScalar(1); dummy.updateMatrix(); rm.setMatrixAt(i, dummy.matrix); }
    scene.add(tag(rm, 'rer', false)); }
  const sph = (r, ph, th) => V3(-r * Math.cos(ph) * Math.sin(th), r * Math.cos(th), r * Math.sin(ph) * Math.sin(th)).add(NUC);
  ORG.rer.anchor = rerAnch[0].clone(); ORG.rer.dist = 6;

  /* smooth ER */
  const serMat = phys(0x7fd8c4, { transparent: true, opacity: 0.85, roughness: 0.3 });
  const S0 = V3(0.8, -3.4, -1.9);
  for (let c = 0; c < 16; c++) {
    let p = S0.clone().add(randUnit().multiplyScalar(rand(0, 1.1))); const d = randUnit(); const pts = [p.clone()];
    for (let k = 0; k < 10; k++) { d.add(randUnit().multiplyScalar(0.6)).normalize(); const q = p.clone().addScaledVector(d, 0.32); if (!inCell(q, 0.8) || q.distanceTo(NUC) < 2.5) { d.negate(); continue; } p = q; pts.push(p.clone()); }
    if (pts.length > 3) scene.add(tag(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 50, 0.07, 8), serMat), 'ser', c === 0));
  }
  ORG.ser.anchor = S0.clone(); ORG.ser.dist = 5.5;

  /* Golgi */
  const nG = NUC.clone().sub(G).normalize();
  const golgi = new THREE.Group(); golgi.position.copy(G); golgi.quaternion.setFromUnitVectors(Y, nG.clone().negate()); scene.add(golgi);
  const golMat = phys(0xe6a84e, { roughness: 0.3, clearcoat: 0.9, emissive: 0x1a0d00 });
  for (let i = 0; i < 6; i++) {
    const w = 1.25 - Math.abs(i - 2.5) * 0.12, off = (i - 2.5) * 0.2;
    const g = displaceGeo(new THREE.SphereGeometry(1, 56, 22), (v) => { v.set(v.x * w, v.y * 0.065 + off, v.z * w * 0.55); v.y += 0.3 * (v.x * v.x + v.z * v.z); });
    golgi.add(tag(new THREE.Mesh(g, golMat), 'golgi', i === 0));
    for (let k = 0; k < 7; k++) { const a = rand(0, 6.283); const b = new THREE.Mesh(new THREE.SphereGeometry(rand(0.06, 0.1), 12, 8), golMat); const x = Math.cos(a) * w * 1.05, z = Math.sin(a) * w * 0.58; b.position.set(x, off + 0.3 * (x * x + z * z) + rand(-0.05, 0.05), z); golgi.add(tag(b, 'golgi', false)); }
  }
  const cisFace = G.clone().addScaledVector(nG, 0.85), transFace = G.clone().addScaledVector(nG, -0.95);
  ORG.golgi.anchor = G.clone(); ORG.golgi.dist = 5;

  /* centrosome & microtubules */
  const cg = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 6), phys(0xb8f0d0, { emissive: 0x0c2a1c }), 54);
  let ci = 0;
  [[new THREE.Euler(0, 0, 0)], [new THREE.Euler(Math.PI / 2, 0, 0.4)]].forEach(([e], c) => {
    const q = new THREE.Quaternion().setFromEuler(e); const base = C.clone().add(V3(c * 0.28, 0, 0));
    for (let k = 0; k < 9; k++) for (let j = 0; j < 3; j++) {
      const a = k / 9 * 6.283 + j * 0.12, r = 0.1 + j * 0.022;
      dummy.position.set(Math.cos(a) * r, 0, Math.sin(a) * r).applyQuaternion(q).add(base); dummy.quaternion.copy(q); dummy.scale.setScalar(1); dummy.updateMatrix(); cg.setMatrixAt(ci++, dummy.matrix);
    }
  });
  scene.add(tag(cg, 'centro'));
  const pcm = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0x7fe0b0, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 })); pcm.position.copy(C); pcm.scale.setScalar(1.1); scene.add(pcm);
  ORG.centro.anchor = C.clone(); ORG.centro.dist = 2.6;
  const mtMat = phys(0x9be8c6, { transparent: true, opacity: 0.5, emissive: 0x0e3a2a, roughness: 0.3 });
  const mtCurves = [];
  const segDist = (p, a, b) => { const ab = b.clone().sub(a), t = clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1); return a.clone().addScaledVector(ab, t).distanceTo(p); };
  fib(140).forEach((d) => {
    const end = V3(d.x * 5.55, d.y * 5.55 * YS, d.z * 5.55);
    if (segDist(NUC, C, end) < 2.35 || mtCurves.length > 48 || rnd() < 0.35) return;
    const mid = C.clone().lerp(end, 0.5).add(randUnit().multiplyScalar(0.35));
    const curve = new THREE.CatmullRomCurve3([C.clone(), mid, end]); mtCurves.push(curve);
    scene.add(tag(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.022, 5), mtMat), 'cyto', mtCurves.length === 1));
  });
  ORG.cyto.anchor = mtCurves[0] ? mtCurves[0].getPointAt(0.6) : C.clone(); ORG.cyto.dist = 5;

  /* mitochondria */
  const mitos = [], spots = [];
  const free = (p, d) => spots.every((s) => s.distanceTo(p) > d);
  const outMat = phys(0xd9663a, { transparent: true, opacity: 0.5, depthWrite: false, roughness: 0.3, clearcoat: 1 });
  const matMat = phys(0x7a2a18, { transparent: true, opacity: 0.85, roughness: 0.6 });
  const crMat = phys(0xffb07a, { roughness: 0.45, emissive: 0x2a0e00 });
  for (let i = 0; i < 12; i++) {
    const p = sample((q) => inCell(q, 1.0) && q.distanceTo(NUC) > 3.75 && q.distanceTo(G) > 2.0 && q.distanceTo(C) > 1.2 && free(q, 1.5)); spots.push(p);
    const g = new THREE.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(Y, randUnit());
    const len = rand(0.8, 1.4);
    g.add(tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.36, len, 10, 24), outMat), 'mito', i === 0));
    g.add(tag(new THREE.Mesh(new THREE.CapsuleGeometry(0.29, len - 0.05, 8, 20), matMat), 'mito', false));
    const nC = Math.round(len / 0.16);
    for (let k = 0; k < nC; k++) { const c = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), crMat); c.scale.set(0.27, 0.025, 0.25); c.position.y = -len / 2 + (k + 0.5) * len / nC; c.rotation.z = k % 2 ? 0.28 : -0.28; c.rotation.y = rand(0, 3); g.add(tag(c, 'mito', false)); }
    scene.add(g); mitos.push({ g, base: p.clone(), ph: rand(0, 6.28), q0: g.quaternion.clone() });
  }
  ORG.mito.anchor = mitos[0].base.clone(); ORG.mito.dist = 3.6;

  /* lysosomes & peroxisomes */
  const lysMat = phys(0x9b6be0, { roughness: 0.35, emissive: 0x1c0b33 }), lysos = [];
  for (let i = 0; i < 9; i++) { const p = sample((q) => inCell(q, 0.9) && q.distanceTo(NUC) > 3.55 && q.distanceTo(G) > 1.6 && free(q, 0.9)); spots.push(p);
    const m = new THREE.Mesh(displaceGeo(new THREE.SphereGeometry(rand(0.2, 0.32), 32, 24), (v) => v.multiplyScalar(1 + 0.08 * noise3(v.x * 8 + i, v.y * 8, v.z * 8))), lysMat); m.position.copy(p); scene.add(tag(m, 'lyso', i === 0)); lysos.push({ m, base: p.clone(), ph: rand(0, 6) }); }
  ORG.lyso.anchor = lysos[0].base.clone(); ORG.lyso.dist = 2.6;
  const perMat = phys(0x8fd16a, { transparent: true, opacity: 0.5, depthWrite: false }), perCore = phys(0x3f7a2a, { roughness: 0.2, emissive: 0x0c1f06 }), peros = [];
  for (let i = 0; i < 6; i++) { const p = sample((q) => inCell(q, 0.9) && q.distanceTo(NUC) > 3.55 && q.distanceTo(G) > 1.6 && free(q, 0.9)); spots.push(p);
    const g = new THREE.Group(); g.position.copy(p); g.add(tag(new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 16), perMat), 'perox', i === 0)); const core = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), perCore); core.rotation.set(rand(0, 3), rand(0, 3), 0); g.add(tag(core, 'perox', false)); scene.add(g); peros.push(g); }
  ORG.perox.anchor = peros[0].position.clone(); ORG.perox.dist = 2.2;

  /* free ribosomes */
  { const N = 700, fm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.032, 8, 6), phys(0xe06a6a, { roughness: 0.6, emissive: 0x200404 }), N); let first = null;
    for (let i = 0; i < N; i++) { const p = sample((q) => inCell(q, 0.3) && q.distanceTo(NUC) > 2.15); if (!first && q2(p)) first = p.clone(); dummy.position.copy(p); dummy.quaternion.identity(); dummy.scale.setScalar(1); dummy.updateMatrix(); fm.setMatrixAt(i, dummy.matrix); }
    scene.add(tag(fm, 'ribo')); ORG.ribo.anchor = first || V3(2, -2, 3); ORG.ribo.dist = 2.4;
    function q2(p) { return p.distanceTo(NUC) > 3.6 && p.y < -1; } }

  /* cytosol */
  const DN = 2200, dust = new Float32Array(DN * 3);
  for (let i = 0; i < DN; i++) { const p = sample((q) => inCell(q, 0.2)); dust.set([p.x, p.y, p.z], i * 3); }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.05, map: GLOW, color: 0x6d86b8, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })));

  /* vesicle traffic */
  const VN = 200;
  const vesMat = phys(0xffffff, { roughness: 0.18, clearcoat: 1, emissive: 0xffffff, emissiveIntensity: 0.12 });
  const vesMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 16, 12), vesMat, VN); vesMesh.frustumCulled = false; scene.add(tag(vesMesh, 'ves', false)); ORG.ves.mats.push(vesMat);
  for (let i = 0; i < VN; i++) { dummy.position.set(0, 0, 0); dummy.scale.setScalar(0); dummy.updateMatrix(); vesMesh.setMatrixAt(i, dummy.matrix); vesMesh.setColorAt(i, new THREE.Color(0xffffff)); }
  const slots = [...Array(VN).keys()], trav = [];
  function go(a, b, dur, color, size, onEnd, bulge = 0.8, curve = null) {
    const s = slots.pop(); if (s === undefined) return;
    let c = null;
    if (!curve) { c = a.clone().add(b).multiplyScalar(0.5); const away = c.clone().sub(NUC); if (away.lengthSq() < 1e-4) away.set(0, 1, 0); c.addScaledVector(away.normalize(), bulge); }
    trav.push({ s, a, b, c, t: 0, dur, size, onEnd, curve }); vesMesh.setColorAt(s, new THREE.Color(color)); vesMesh.instanceColor.needsUpdate = true;
  }
  const memPoint = (dir) => { const d = dir.clone().normalize(); return V3(d.x * 5.75, d.y * 5.75 * YS, d.z * 5.75); };
  ORG.ves.anchor = transFace.clone(); ORG.ves.dist = 4;

  const sparks = new Sparks(1800, 0.1); scene.add(sparks.obj);
  const C_ATP = new THREE.Color(0xffe27a), C_RNA = new THREE.Color(0xf3e4ff), C_EXO = new THREE.Color(0xffd08a);

  // clip everything
  scene.traverse((o) => { const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []; ms.forEach((m) => { m.clippingPlanes = cut; m.clipIntersection = true; }); });

  const st = { t: 0, cut: true, labels: true, rot: true, sel: null, focusT: 0, timers: { er: 0, ex: 0.3, en: 0.8, mt: 0, rna: 0 } };
  /* подписи по виду: якорь, срезанный разрезом или закрытый ядром, скрывается; из нескольких экземпляров
     (митохондрии, лизосомы, пероксисомы, цистерны ЭПС, микротрубочки) берётся видимый ближайший к камере — и держится, пока виден */
  const LBL = {}, LVIS = {}, LCUR = {};
  ORGANELLES.forEach((o) => { LBL[o.id] = ORG[o.id].anchor.clone(); LVIS[o.id] = true; });
  const CAND = { mito: () => mitos.map((m) => m.g.position), lyso: () => lysos.map((l) => l.m.position), perox: () => peros.map((g) => g.position), rer: () => rerAnch, cyto: () => mtCurves.slice(0, 12).map((c) => c.getPointAt(0.6)) };
  const camDir = new THREE.Vector3(), rgt = new THREE.Vector3(), tmpQ = new THREE.Vector3();
  const clipped = (p) => st.cut && cut.every((pl) => pl.distanceToPoint(p) < 0);
  const hidden = (p, inNuc) => { if (clipped(p)) return true; if (inNuc) return false;
    const cam = camera.position, d = tmpQ.copy(p).sub(cam), L2 = d.lengthSq(), tt = clamp(NUC.clone().sub(cam).dot(d) / L2, 0, 1), q = cam.clone().addScaledVector(d, tt);
    return tt < 0.999 && q.distanceTo(NUC) < NUC_R * 0.92 && p.distanceTo(NUC) > NUC_R && !clipped(q); };
  function placeLabels() {
    camera.getWorldDirection(camDir); rgt.crossVectors(camDir, Y).normalize();
    // мембрана — на краю силуэта (вверху слева), ядро — на краю ядра
    LBL.membrane.copy(memPoint(rgt.clone().multiplyScalar(-0.62).addScaledVector(Y, 0.78)));
    LBL.nucleus.copy(NUC).addScaledVector(rgt.clone().multiplyScalar(-0.55).addScaledVector(Y, 0.83).normalize(), NUC_R * 1.02);
    ORGANELLES.forEach((o) => {
      const id = o.id; if (id === 'membrane' || id === 'nucleus') { LVIS[id] = true; return; }
      const inNuc = id === 'nucleolus' || id === 'pores';
      if (CAND[id]) {
        const list = CAND[id](); let i = LCUR[id];
        if (i === undefined || hidden(list[i], false)) { let bd = 1e9; i = -1; list.forEach((p, j) => { if (hidden(p, false)) return; const d = p.distanceTo(camera.position); if (d < bd) { bd = d; i = j; } }); }
        LCUR[id] = i >= 0 ? i : undefined; LVIS[id] = i >= 0; if (i >= 0) LBL[id].copy(list[i]);
      } else LVIS[id] = !hidden(LBL[id], inNuc);
    });
  }
  const C_SEL = new THREE.Color();
  ORGANELLES.forEach((o) => ORG[o.id].mats.forEach((m) => { if (!m.userData.e0) m.userData.e0 = { c: m.emissive.clone(), i: m.emissiveIntensity }; }));

  function select(id) {
    if (st.sel) ORG[st.sel].mats.forEach((m) => { m.emissive.copy(m.userData.e0.c); m.emissiveIntensity = m.userData.e0.i; });
    st.sel = id === 'all' ? null : id; st.focusT = 1.8;
    st.focus = st.sel ? { target: (LBL[st.sel] && LVIS[st.sel] ? LBL[st.sel] : ORG[st.sel].anchor).clone(), dist: ORG[st.sel].dist } : { target: V3(0, 0, 0), dist: 19 };
    accentSet(st.sel ? ORG[st.sel].color : '#9CC8FF');
    refs.setInfo && refs.setInfo(); refs.seg && refs.seg.sync();
  }

  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot;
    // cutaway faces the camera
    const dx = camera.position.x - controls.target.x, dz = camera.position.z - controls.target.z, a = Math.atan2(dz, dx);
    cut[0].normal.set(-Math.cos(a + Math.PI / 4), 0, -Math.sin(a + Math.PI / 4)); cut[1].normal.set(-Math.cos(a - Math.PI / 4), 0, -Math.sin(a - Math.PI / 4));
    cut.forEach((p) => (p.constant = st.cut ? 0 : 1000));
    // focus
    if (st.focusT > 0 && st.focus) {
      st.focusT -= dt; const k = 1 - Math.exp(-dt * 3);
      controls.target.lerp(st.focus.target, k);
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.lerp(controls.target.clone().addScaledVector(dir, st.focus.dist), k);
    }
    placeLabels();
    // selection glow
    if (st.sel) { C_SEL.set(ORG[st.sel].color); const pulse = 0.35 + 0.25 * Math.sin(t * 4); ORG[st.sel].mats.forEach((m) => { m.emissive.copy(C_SEL); m.emissiveIntensity = pulse; }); }
    // organelle motion
    mitos.forEach((m, i) => { m.g.position.set(m.base.x + 0.12 * Math.sin(t * 0.4 + m.ph), m.base.y + 0.1 * Math.sin(t * 0.33 + m.ph * 2), m.base.z + 0.12 * Math.cos(t * 0.37 + m.ph)); m.g.rotateY(dt * 0.15); if (rnd() < dt * 3) sparks.spawn(m.g.position.clone().add(randUnit().multiplyScalar(0.45)), randUnit().multiplyScalar(0.35), C_ATP, 1.0, 0.8, 1.3); });
    lysos.forEach((l) => l.m.position.set(l.base.x + 0.15 * Math.sin(t * 0.5 + l.ph), l.base.y + 0.12 * Math.cos(t * 0.45 + l.ph), l.base.z + 0.15 * Math.sin(t * 0.38 + l.ph * 1.7)));
    memIn.scale.setScalar(0.985 + 0.004 * Math.sin(t * 0.8));
    // cytosol flow
    for (let i = 0; i < DN; i++) { const k = i * 3, x = dust[k], y = dust[k + 1], z = dust[k + 2];
      let nx = x + Math.sin(y * 0.7 + t * 0.3) * 0.08 * dt, ny = y + Math.sin(z * 0.6 + t * 0.25) * 0.06 * dt, nz = z + Math.sin(x * 0.5 + t * 0.35) * 0.08 * dt;
      if (nx * nx + (ny / YS) ** 2 + nz * nz > (CELL_R - 0.15) ** 2) { nx *= 0.9; ny *= 0.9; nz *= 0.9; } dust[k] = nx; dust[k + 1] = ny; dust[k + 2] = nz; }
    dustGeo.attributes.position.needsUpdate = true;
    // traffic
    const T = st.timers;
    if ((T.er -= dt) < 0) { T.er = 0.45; const dir = G.clone().sub(NUC).normalize().add(randUnit().multiplyScalar(0.45)).normalize(); go(NUC.clone().addScaledVector(dir, 2.85), cisFace.clone().add(randUnit().multiplyScalar(0.25)), 2.6, 0x7fd0ee, 0.8, null, 0.3); }
    if ((T.ex -= dt) < 0) { T.ex = 0.6; const dir = G.clone().normalize().add(randUnit().multiplyScalar(0.9)); const end = memPoint(dir);
      go(transFace.clone().add(randUnit().multiplyScalar(0.3)), end, 4, 0xffd08a, 1, (p) => { for (let k = 0; k < 14; k++) sparks.spawn(p, randUnit().multiplyScalar(0.9), C_EXO, 0.6, 2, 1.4); }, 0.6); }
    if ((T.en -= dt) < 0) { T.en = 1.5; const l = lysos[Math.floor(rnd() * lysos.length)]; const start = memPoint(l.base.clone().add(randUnit().multiplyScalar(2)));
      go(start, l.m.position.clone(), 4.5, 0xb894ff, 0.9, null, 0.3); }
    if ((T.mt -= dt) < 0 && mtCurves.length) { T.mt = 0.16; const c = mtCurves[Math.floor(rnd() * mtCurves.length)]; const out = rnd() < 0.65; go(null, null, rand(3, 5), out ? 0xd9fff0 : 0xffb0d0, 0.55, null, 0, { c, out }); }
    if ((T.rna -= dt) < 0) { T.rna = 0.04; const pr = porePts[Math.floor(rnd() * porePts.length)]; sparks.spawn(pr.p.clone(), pr.d.clone().multiplyScalar(rand(0.5, 0.9)), C_RNA, 1.2, 0.6, 1.2); }
    for (let i = trav.length - 1; i >= 0; i--) {
      const v = trav[i]; v.t += dt; const k = clamp(v.t / v.dur, 0, 1), e = smooth(0, 1, k);
      let p;
      if (v.curve) p = v.curve.c.getPointAt(v.curve.out ? e : 1 - e);
      else { const u = 1 - e; p = v.a.clone().multiplyScalar(u * u).addScaledVector(v.c, 2 * u * e).addScaledVector(v.b, e * e); }
      const sc = v.size * Math.min(1, k / 0.08) * Math.min(1, (1 - k) / 0.06 + (v.onEnd ? 0.4 : 0));
      dummy.position.copy(p); dummy.quaternion.identity(); dummy.scale.setScalar(Math.max(sc, 0)); dummy.updateMatrix(); vesMesh.setMatrixAt(v.s, dummy.matrix);
      if (v.t >= v.dur) { if (v.onEnd) v.onEnd(p); dummy.scale.setScalar(0); dummy.updateMatrix(); vesMesh.setMatrixAt(v.s, dummy.matrix); slots.push(v.s); trav.splice(i, 1); }
    }
    vesMesh.instanceMatrix.needsUpdate = true;
    sparks.update(dt);
  }

  /* picking */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (cur !== self || !down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(pickables, false).filter((hh) => !(st.cut && cut.every((p) => p.distanceToPoint(hh.point) < 0)));
    const hit = hits.find((hh) => hh.object.userData.org !== 'membrane') || hits[0];
    if (hit) select(hit.object.userData.org);
  });

  const labels = ORGANELLES.map((o) => ({ text: o.name, pos: LBL[o.id], color: o.color, show: () => st.labels && (st.sel === o.id || (LVIS[o.id] && (!st.sel || ['membrane', 'nucleus'].includes(o.id)))) }));
  const refs = {};
  function ui(el) {
    const info = h('div', { class: 'info' });
    refs.setInfo = () => { info.innerHTML = st.sel ? ORG[st.sel].text : 'Нажмите на любой органоид или выберите его в списке. Разрез всегда повёрнут к вам: вращайте клетку, чтобы заглянуть с другой стороны.'; };
    refs.seg = seg([{ id: 'all', label: 'Обзор' }, ...ORGANELLES.map((o) => ({ id: o.id, label: o.name, color: o.color }))], () => st.sel || 'all', (v) => select(v));
    const cutB = toggle('Разрез', () => st.cut, (v) => { st.cut = v; });
    const rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    refs.cutB = cutB; refs.rot = rot; refs.lab = lab;
    el.append(
      h('div', { class: 'grp', style: 'flex:1 1 560px' }, h('div', { class: 'glabel' }, 'Органоиды', h('kbd', {}, 'клик по клетке')), h('div', { class: 'gctl' }, refs.seg)),
      group('Вид', 'C · R · N', cutB, rot, lab),
      h('div', { class: 'grp', style: 'flex:1 1 300px' }, h('div', { class: 'glabel' }, 'Что это'), info),
    );
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === 'c' || k === 'с') { refs.cutB.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.sel ? [['Размер', ORG[st.sel].size, '']] : [['Клетка', '≈ 20', 'мкм'], ['Органоидов', ORGANELLES.length, '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, get accent() { return st.sel ? ORG[st.sel].color : '#9CC8FF'; },
    kicker: 'Клетка · строение', title: 'Живая клетка',
    lede: 'Ядро, ЭПС, Гольджи, митохондрии и цитоскелет в разрезе. Пузырьки везут белки к мембране, по микротрубочкам едут грузы, митохондрии выдают АТФ.',
    notes: `
      <div><h2>Как устроена клетка</h2>
        <p>Нейрон — такая же клетка, как остальные, только с очень длинными отростками. Всё, о чём говорится в курсе, начинается здесь: белки-рецепторы и каналы делаются на <b>шероховатой ЭПС</b>, дорабатываются в <b>аппарате Гольджи</b> и в пузырьках едут к мембране.</p>
        <h3>Что движется</h3>
        <p><b>Голубые пузырьки</b> несут белки из ЭПС в Гольджи. <b>Золотые</b> идут от Гольджи к мембране и сливаются с ней — это экзоцитоз, тот же механизм, которым синапс выпускает медиатор. <b>Сиреневые</b> отшнуровываются от мембраны и плывут к лизосомам. По <b>микротрубочкам</b> моторные белки везут грузы в обе стороны. Из <b>ядерных пор</b> выходят мРНК, у <b>митохондрий</b> вспыхивает АТФ.</p>
        <h3>Энергия</h3>
        <p>Мозг — около 2% массы тела, но потребляет примерно 20% энергии. Большую часть АТФ съедает Na⁺/K⁺-насос, поэтому в нейронах так много митохондрий.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Набор органоидов и их взаимное расположение: ЭПС продолжает оболочку ядра, Гольджи лежит у центросомы.</li>
        <li>Двойная оболочка ядра с порами, кристы митохондрий, 9 троек микротрубочек в центриолях.</li>
        <li>Маршруты пузырьков.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Размеры не в масштабе: рибосома в тысячу раз меньше клетки, здесь её видно.</li><li>Органоидов и рибосом в настоящей клетке в сотни раз больше.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li>клик по органоиду: выбрать</li><li><code>C</code> разрез</li><li><code>R</code> вращение</li><li><code>N</code> подписи</li><li><code>Esc</code> обзор</li></ul></div>`,
  };
  return self;
}
export { makeCell };
