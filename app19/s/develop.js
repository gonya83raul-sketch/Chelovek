import { LOOK, Sparks, THREE, V3, __set_rnd, addLights, bloom, clamp, displaceGeo, envTex, group, h, lerp, makeControls, mulberry, noise3, rand, rnd, seg, smooth, toggle } from '../core.js';


/* =========================================================
   ЛЕКЦИЯ 1 · РАЗВИТИЕ МОЗГА (ОНТОГЕНЕЗ)
   ========================================================= */
const DEV_STAGES = [
  { short: 'Пластинка', name: 'Нервная пластинка', when: '3 нед', wk: 2.7,
    text: 'На спинной стороне зародыша часть клеток эктодермы становится <b>нервной пластинкой</b>. Из неё получится вся центральная нервная система: и головной, и спинной мозг.' },
  { short: 'Желобок', name: 'Нервный желобок', when: '≈20 дней', wk: 3,
    text: 'Края пластинки поднимаются в <b>нервные валики</b>, между ними остаётся <b>желобок</b>. Около 20-го дня края смыкаются в середине зародыша, и шов расходится вперёд и назад, как молния. Клетки с краёв образуют <b>нервный гребень</b> (оранжевые искры): они уйдут из трубки и дадут ганглии, мягкую и паутинную оболочки, пигментные клетки и мозговое вещество надпочечников.' },
  { short: 'Трубка', name: 'Нервная трубка', when: 'конец 4 нед', wk: 4,
    text: 'К концу 4-й недели трубка замкнута целиком, вместе с передним и задним нейропорами. Внутри остаётся канал. Гены уже решили, кем станут клетки: верхняя <b>крыловидная пластинка</b> даст сенсорные и вставочные нейроны, нижняя <b>базальная</b> даст двигательные и вегетативные. Переключите цвет на «Пластинки».' },
  { short: '3 пузыря', name: 'Три мозговых пузыря', when: '4–5 нед', wk: 4.6,
    text: 'Передний конец трубки раздувается в три пузыря: <b>передний</b> (prosencephalon), <b>средний</b> (mesencephalon) и <b>задний</b> (rhombencephalon). Остальная трубка станет спинным мозгом. Из стенки переднего мозга выпячиваются глазные пузыри: сетчатка на самом деле часть промежуточного мозга.' },
  { short: '5 пузырей', name: 'Пять мозговых пузырей', when: '5–6 нед', wk: 6,
    text: 'Передний пузырь даёт <b>конечный</b> мозг (будущие полушария) и <b>промежуточный</b> (таламус и гипоталамус). Средний почти не меняется. Задний делится на собственно <b>задний</b> (мост и мозжечок) и <b>продолговатый</b>. Трубка сгибается: сначала среднемозговой изгиб, потом шейный, последним мостовой.' },
  { short: 'Полушария', name: 'Полушария растут', when: 'до 20 нед', wk: 20,
    text: 'Нейроны рождаются в первые 16 недель: сначала нижние слои коры, шестой и пятый, потом верхние. Клетки ползут к своим местам вдоль отростков радиальной глии, путь им указывают нетрины, эфрины и семафорины. К 20-й неделе миграция закончена, выделяются доли, начинаются борозды. Полушария растут быстрее всех и накрывают промежуточный, средний и задний мозг.' },
  { short: 'Рождение', name: 'Мозг новорождённого', when: 'рождение', wk: 40,
    text: 'К 9 месяцам видна привычная архитектура: борозды, извилины, мозжечок. Мозг весит около <b>350 г</b>. Новых нейронов больше не будет: дальше растут дендритные деревья, синапсы и число глиальных клеток.' },
  { short: 'Взрослый', name: 'Мозг взрослого', when: 'взрослый', wk: 46,
    text: 'Взрослый мозг весит <b>1300–1400 г</b> при том же числе нейронов. Прибавка идёт за счёт ветвления дендритов, новых синапсов, глии и миелина, а миелинизация длится около 20 лет. Особенно важны первые 2–3 года: от того, насколько ребёнку интересно и сколько с ним общаются, зависит, сколько связей сформируется.' },
];
const DEV_COL = {
  plate: '#E3B5C6', pros: '#FFB070', mes3: '#C77DFF', rhomb: '#4FB0D8',
  tele: '#FF8F7A', di: '#F4C542', mes: '#C77DFF', met: '#3FC1B0', myel: '#6F9BFF', spinal: '#B9AFC0',
  alar: '#FFB070', basal: '#6F9BFF', roof: '#8A8290',
};

function makeDevelop() {
  __set_rnd(mulberry(41));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  addLights(scene, 0xff8fb0);
  // пока пользователь не вращал камеру: на ранних стадиях смотрим на пластинку сверху, к трубке опускаемся
  const CAM_HI = V3(4, 14, 14), CAM_LO = V3(7, 9, 22);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200); camera.position.copy(CAM_HI);
  const controls = makeControls(camera, V3(0, -1.5, 0)); controls.minDistance = 4; controls.maxDistance = 40;
  controls.addEventListener('start', () => { st.userCam = true; });
  const C = Object.fromEntries(Object.entries(DEV_COL).map(([k, v]) => [k, new THREE.Color(v)]));
  const cut = new THREE.Plane(V3(0, 0, -1), 0.0);

  const root = new THREE.Group(); scene.add(root);
  // стенка трубки толстая (нейроэпителий): наружная поверхность, внутренняя (к каналу) и торцы по краям пластинки
  const NU = 200, NV = 72, LT = 12, NS = NU * NV;
  const pos = new Float32Array(NS * 2 * 3), col = new Float32Array(NS * 2 * 3), idx = [];
  for (let i = 0; i < NU - 1; i++) for (let j = 0; j < NV - 1; j++) { const a = i * NV + j, b = a + 1, c = a + NV, d = c + 1; idx.push(a, c, b, b, c, d, NS + a, NS + b, NS + c, NS + b, NS + d, NS + c); }
  for (let i = 0; i < NU - 1; i++) for (const j of [0, NV - 1]) { const a = i * NV + j, c = a + NV; idx.push(a, NS + a, c, c, NS + a, NS + c); }
  const geo = new THREE.BufferGeometry(); geo.setIndex(idx);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const tubeMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.35, sheen: 0.8, sheenColor: new THREE.Color(0xffd0e0), sheenRoughness: 0.5, side: THREE.DoubleSide, envMapIntensity: 0.6 });
  const tube = new THREE.Mesh(geo, tubeMat); tube.frustumCulled = false; root.add(tube);
  // срез стенки в плоскости разреза (дно и замкнутая крыша), виден только в режиме «Разрез»
  const capPos = new Float32Array(NU * 4 * 3), capCol = new Float32Array(NU * 4 * 3), capIdx = [];
  for (let i = 0; i < NU - 1; i++) for (const q of [0, 2]) { const a = i * 4 + q, b = a + 1, c = a + 4, d = c + 1; capIdx.push(a, c, b, b, c, d); }
  const capGeo = new THREE.BufferGeometry(); capGeo.setIndex(capIdx); capGeo.setAttribute('position', new THREE.BufferAttribute(capPos, 3)); capGeo.setAttribute('color', new THREE.BufferAttribute(capCol, 3));
  const capMesh = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, side: THREE.DoubleSide })); capMesh.frustumCulled = false; capMesh.visible = false; root.add(capMesh);
  // зародыш вокруг: поверхностная эктодерма, хорда, сомиты
  const NE = 12, ePos = new Float32Array(NU * NE * 2 * 3), eIdx = [];
  for (let sd = 0; sd < 2; sd++) for (let i = 0; i < NU - 1; i++) for (let m = 0; m < NE - 1; m++) { const a = (sd * NU + i) * NE + m, b = a + 1, c = a + NE, d = c + 1; eIdx.push(a, c, b, b, c, d); }
  const ecGeo = new THREE.BufferGeometry(); ecGeo.setIndex(eIdx); ecGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  const ecMat = new THREE.MeshPhysicalMaterial({ color: 0x9fb8e0, roughness: 0.5, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 0.5 });
  const ecto = new THREE.Mesh(ecGeo, ecMat); ecto.frustumCulled = false; root.add(ecto);
  const NCR = 12, ncPos = new Float32Array(NU * NCR * 3), ncIdx = [];
  for (let i = 0; i < NU - 1; i++) for (let j = 0; j < NCR; j++) { const a = i * NCR + j, b = i * NCR + (j + 1) % NCR, c = a + NCR, d = b + NCR; ncIdx.push(a, c, b, b, c, d); }
  const ncGeo = new THREE.BufferGeometry(); ncGeo.setIndex(ncIdx); ncGeo.setAttribute('position', new THREE.BufferAttribute(ncPos, 3));
  const ncMat = new THREE.MeshPhysicalMaterial({ color: 0x8fc9b8, roughness: 0.4, clearcoat: 0.5, envMapIntensity: 0.6 });
  const noto = new THREE.Mesh(ncGeo, ncMat); noto.frustumCulled = false; root.add(noto);
  const NSOM = 13, somMat = new THREE.MeshPhysicalMaterial({ color: 0xc9866a, roughness: 0.5, clearcoat: 0.3, envMapIntensity: 0.6 });
  const somGeo = displaceGeo(new THREE.SphereGeometry(1, 20, 14), (v) => { v.set(Math.sign(v.x) * Math.abs(v.x) ** 0.55, Math.sign(v.y) * Math.abs(v.y) ** 0.55, Math.sign(v.z) * Math.abs(v.z) ** 0.55); });
  const somites = new THREE.InstancedMesh(somGeo, somMat, NSOM * 2); somites.frustumCulled = false; root.add(somites);

  // полушарие: гладкое и с извилинами (morph target)
  function hemiGeo() {
    const g = new THREE.SphereGeometry(1, 150, 110), p = g.attributes.position;
    const smoothP = new Float32Array(p.count * 3), foldP = new Float32Array(p.count * 3), v = V3(0, 0, 0);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      let x = v.x * 1.55, y = v.y * (v.y > 0 ? 1.05 : 0.8), z = v.z * 0.72 + 0.72;
      if (z < 0.06) z = 0.06 - (0.06 - z) * 0.12;
      if (y < -0.15 && x < 0.9 && x > -0.6) y -= 0.25 * smooth(-0.15, -0.7, y) * smooth(0.3, 0.9, z);
      if (x < -1) y -= 0.1 * smooth(-1, -1.55, x);
      smoothP.set([x, y, z], i * 3);
      const n = noise3(x * 2.4, y * 2.4, z * 2.4), n2 = noise3(x * 5.2 + 3, y * 5.2, z * 5.2);
      const r1 = 1 - Math.abs(n), r2 = 1 - Math.abs(n2), d = 0.085 * r1 * r1 + 0.022 * r2 - 0.05;
      const dir = V3(x, y + 0.1, z - 0.4).normalize();
      foldP.set([x + dir.x * d, y + dir.y * d, z + dir.z * d], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(smoothP, 3)); g.computeVertexNormals();
    const f = new THREE.BufferGeometry(); f.setIndex(g.index); f.setAttribute('position', new THREE.BufferAttribute(foldP, 3)); f.computeVertexNormals();
    g.morphAttributes.position = [f.attributes.position]; g.morphAttributes.normal = [f.attributes.normal];
    return g;
  }
  const hemiMat = new THREE.MeshPhysicalMaterial({ color: C.tele, roughness: 0.52, clearcoat: 0.4, clearcoatRoughness: 0.4, sheen: 0.8, sheenColor: new THREE.Color(0xffd0e0), sheenRoughness: 0.5, side: THREE.DoubleSide, envMapIntensity: 0.6 });
  const hg = hemiGeo();
  const hemis = [1, -1].map((s) => { const m = new THREE.Mesh(hg, hemiMat); m.userData.side = s; m.morphTargetInfluences = [0]; root.add(m); return m; });
  const cbGeo = (() => {
    const g = new THREE.SphereGeometry(1, 110, 80), p = g.attributes.position, fp = new Float32Array(p.count * 3), v = V3(0, 0, 0);
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const f = 1 + 0.05 * Math.sin(v.y * 40 + v.x * 5) + 0.03 * noise3(v.x * 3, v.y * 3, v.z * 3); fp.set([v.x * f, v.y * f, v.z * f], i * 3); }
    const f = new THREE.BufferGeometry(); f.setIndex(g.index); f.setAttribute('position', new THREE.BufferAttribute(fp, 3)); f.computeVertexNormals();
    g.morphAttributes.position = [f.attributes.position]; g.morphAttributes.normal = [f.attributes.normal]; return g;
  })();
  const cbMat = hemiMat.clone(); cbMat.color = C.met.clone().multiplyScalar(0.42);
  const cereb = new THREE.Mesh(cbGeo, cbMat); cereb.morphTargetInfluences = [0]; root.add(cereb);
  const eyeMat = hemiMat.clone(); eyeMat.color = C.di.clone().multiplyScalar(0.42);
  const eyes = [1, -1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), eyeMat); root.add(m); return m; });
  const NGAN = 22, ganMat = new THREE.MeshPhysicalMaterial({ color: 0x9a7a50, roughness: 0.5, emissive: 0x4a2a08, emissiveIntensity: 1 });
  const gang = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), ganMat, NGAN); gang.frustumCulled = false; root.add(gang);
  const crest = new Sparks(1600, 0.22); root.add(crest.obj);
  tubeMat.color.setScalar(0.38); [hemiMat, cbMat, eyeMat, ganMat].forEach((m) => { m.sheen = 0.3; m.clearcoat = 0.25; }); tubeMat.sheen = 0.3; tubeMat.clearcoat = 0.25; ganMat.emissiveIntensity = 0.3;
  const dim = (c) => c.clone().multiplyScalar(0.42);
  [tubeMat, hemiMat, cbMat, eyeMat, ganMat, ecMat, ncMat, somMat].forEach((m) => { m.clippingPlanes = []; });

  const st = { s: 0, play: true, mode: 'regions', cut: false, labels: true, t: 0, center: V3(0, 0, 0), first: true, th: 0, goal: V3(0, 0, 0) };
  const G = (u, c, w) => Math.exp(-(((u - c) / w) ** 2));
  const P = Array.from({ length: NU }, () => V3(0, 0, 0)), TN = Array.from({ length: NU }, () => V3(0, 0, 0)), NN = Array.from({ length: NU }, () => V3(0, 0, 0));
  const Rr = new Float32Array(NU), Kk = new Float32Array(NU);
  const B = V3(0, 0, 1), uc = (u) => Math.min(NU - 1, Math.max(0, Math.round(u * (NU - 1))));
  const cr = new THREE.Color(), c3 = new THREE.Color(), c5 = new THREE.Color();
  function regionCol(u, out) {
    // три пузыря
    if (u < 0.15) c3.copy(C.pros); else if (u < 0.25) c3.copy(C.mes3); else if (u < 0.43) c3.copy(C.rhomb); else c3.copy(C.spinal);
    if (u < 0.07) c5.copy(C.tele); else if (u < 0.15) c5.copy(C.di); else if (u < 0.25) c5.copy(C.mes); else if (u < 0.335) c5.copy(C.met); else if (u < 0.43) c5.copy(C.myel); else c5.copy(C.spinal);
    const s = st.s; out.copy(C.plate).lerp(c3, smooth(2.2, 3, s)).lerp(c5, smooth(3.2, 4, s)); return out;
  }
  const cA = new THREE.Color();
  function build() {
    const s = st.s;
    const aM = smooth(3.4, 4.4, s), aC = smooth(3.7, 4.7, s), aP = smooth(4.1, 5, s);
    const a3 = smooth(2, 3, s), a5 = smooth(3, 4, s), spin = 1 - 0.25 * smooth(4, 6, s), wSp = 1 - 0.55 * smooth(4, 6, s);
    const sig = (u, c, w = 0.03) => 1 / (1 + Math.exp(-(u - c) / w));
    let x = 0, y = 0;
    for (let i = 0; i < NU; i++) {
      const u = i / (NU - 1);
      const ph = Math.PI - aM * 1.55 * (1 - sig(u, 0.2)) + aP * (0.45 * sig(u, 0.26) - 0.6 * sig(u, 0.34)) + aC * 1.3 * sig(u, 0.45);
      P[i].set(x, y, 0); TN[i].set(Math.cos(ph), Math.sin(ph), 0); NN[i].set(Math.sin(ph), -Math.cos(ph), 0);
      const dl = LT / (NU - 1) * (u < 0.43 ? 1 : wSp); x += Math.cos(ph) * dl; y += Math.sin(ph) * dl;
      // радиус
      const R0 = 0.42 + 0.38 * (1 - smooth(0, 0.5, u));
      const g3 = 0.75 * G(u, 0.08, 0.065) + 0.45 * G(u, 0.2, 0.045) + 0.55 * G(u, 0.33, 0.065);
      const g5 = 0.35 * G(u, 0.035, 0.035) + 0.5 * G(u, 0.11, 0.035) + 0.45 * G(u, 0.2, 0.045) + 0.55 * G(u, 0.29, 0.035) + 0.45 * G(u, 0.38, 0.04);
      let R = R0 * (1 + a3 * lerp(g3, g5, a5)) * (u > 0.45 ? spin : 1);
      const d0 = u * LT, d1 = (1 - u) * LT * (u < 0.43 ? 1 : wSp);
      if (d0 < R) R *= Math.sqrt(Math.max(0, 1 - (1 - d0 / R) ** 2));
      if (d1 < R) R *= Math.sqrt(Math.max(0, 1 - (1 - d1 / R) ** 2));
      Rr[i] = Math.max(R, 0.0005);
      let k;
      if (s <= 1) k = 0.04 + 0.52 * smooth(0, 1, s);
      else if (s < 2) { const q = s - 1; k = 0.56 + 0.44 * smooth(0, 0.18, q * 0.72 - Math.abs(u - 0.5)); }
      else k = 1;
      Kk[i] = k;
    }
    // вершины
    for (let i = 0; i < NU; i++) {
      const u = i / (NU - 1), R = Rr[i], k = Kk[i], L = 2 * Math.PI * R, kap = k / R;
      const hw = R * (0.5 - 0.2 * a3 * (1 - smooth(0.4, 0.48, u))); // толщина стенки; у пузырей стенка тоньше, желудочки шире
      regionCol(u, cr);
      for (let j = 0; j < NV; j++) {
        const v = j / (NV - 1), fa = (v - 0.5) * L;
        let lat, dor, cf = 1, sf = 0;
        if (kap * L < 1e-3) { lat = fa; dor = 0.5 * kap * fa * fa; sf = kap * fa; } else { const f = kap * fa; lat = Math.sin(f) / kap; dor = (1 - Math.cos(f)) / kap; cf = Math.cos(f); sf = Math.sin(f); }
        dor -= R * k;
        const o = (i * NV + j) * 3, o2 = o + NS * 3, di = dor + hw * cf;
        pos[o] = P[i].x + NN[i].x * dor; pos[o + 1] = P[i].y + NN[i].y * dor; pos[o + 2] = lat;
        pos[o2] = P[i].x + NN[i].x * di; pos[o2 + 1] = P[i].y + NN[i].y * di; pos[o2 + 2] = lat - hw * sf;
        if (st.mode === 'plates') {
          const w = Math.abs(v - 0.5) * 2;
          cA.copy(C.basal).lerp(C.alar, smooth(0.42, 0.58, w));
          if (w > 0.94 || w < 0.06) cA.lerp(C.roof, 0.7);
          cA.lerp(C.plate, 1 - smooth(1.2, 2, s));
        } else cA.copy(cr);
        if (s < 2 && (v < 0.04 || v > 0.96)) cA.lerp(new THREE.Color(0xffd08a), 0.6 * smooth(0.3, 1, s));
        col[o] = cA.r; col[o + 1] = cA.g; col[o + 2] = cA.b;
        col[o2] = cA.r * 0.78; col[o2 + 1] = cA.g * 0.78; col[o2 + 2] = cA.b * 0.78;
      }
      // срез: дно (средняя линия) и крыша, когда края сомкнулись
      const fl = -R * k, cl = k > 0.999, c4 = i * 12;
      capPos.set([P[i].x + NN[i].x * fl, P[i].y + NN[i].y * fl, -0.003, P[i].x + NN[i].x * (fl + hw), P[i].y + NN[i].y * (fl + hw), -0.003], c4);
      const rT = cl ? R : fl + hw, rB = cl ? R - hw : fl + hw;
      capPos.set([P[i].x + NN[i].x * rT, P[i].y + NN[i].y * rT, -0.003, P[i].x + NN[i].x * rB, P[i].y + NN[i].y * rB, -0.003], c4 + 6);
      cA.copy(st.mode === 'plates' ? C.roof : cr).multiplyScalar(0.62); for (let q = 0; q < 4; q++) capCol.set([cA.r, cA.g, cA.b], c4 + q * 3);
    }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
    capGeo.attributes.position.needsUpdate = true; capGeo.attributes.color.needsUpdate = true; capGeo.computeVertexNormals();
    // эктодерма: на пластинке продолжается вбок от краёв, после смыкания отшнуровывается и ложится над трубкой
    const eA = 1 - smooth(2.5, 3.1, s); ecto.visible = eA > 0.01; ecMat.opacity = 0.35 * eA;
    if (ecto.visible) for (let i = 0; i < NU; i++) {
      const R = Rr[i], k = Kk[i], half = Math.PI * R, kap = k / R, c = smooth(0.9, 1, k), W = 4.2;
      let latE, dorE; if (kap * half < 5e-4) { latE = half; dorE = 0.5 * kap * half * half; } else { latE = Math.sin(kap * half) / kap; dorE = (1 - Math.cos(kap * half)) / kap; } dorE -= R * k;
      for (let sd = 0; sd < 2; sd++) for (let m = 0; m < NE; m++) {
        const t = m / (NE - 1), la = latE + t * (W - latE), da = dorE + (0.15 - dorE) * smooth(0, 0.35, t);
        const ld = t * W, dd = (R + 0.15) * (1 - smooth(0.05, 0.6, t)) + 0.15 * smooth(0.05, 0.6, t);
        const lt = lerp(la, ld, c), dr = lerp(da, dd, c), o = ((sd * NU + i) * NE + m) * 3;
        ePos[o] = P[i].x + NN[i].x * dr; ePos[o + 1] = P[i].y + NN[i].y * dr; ePos[o + 2] = (sd ? 1 : -1) * lt;
      }
    }
    if (ecto.visible) { ecGeo.attributes.position.needsUpdate = true; ecGeo.computeVertexNormals(); }
    // хорда под дном пластинки/трубки
    const nA = 1 - smooth(2.8, 3.5, s); noto.visible = nA > 0.01;
    if (noto.visible) {
      for (let i = 0; i < NU; i++) {
        const u = i / (NU - 1), rn = 0.13 * nA * smooth(0.1, 0.17, u) * smooth(1, 0.975, u) + 1e-4, dc = -Rr[i] * Kk[i] - 0.3;
        const cx = P[i].x + NN[i].x * dc, cy = P[i].y + NN[i].y * dc;
        for (let j = 0; j < NCR; j++) { const a = j / NCR * Math.PI * 2, o = (i * NCR + j) * 3; ncPos[o] = cx + NN[i].x * rn * Math.cos(a); ncPos[o + 1] = cy + NN[i].y * rn * Math.cos(a); ncPos[o + 2] = rn * Math.sin(a); }
      }
      ncGeo.attributes.position.needsUpdate = true; ncGeo.computeVertexNormals();
    }
    // сомиты: пары по бокам, появляются спереди назад
    const sA = smooth(0.7, 1.2, s) * (1 - smooth(2.5, 3.1, s)), nShow = 4 + 9 * smooth(0.9, 2.2, s), Mb = new THREE.Matrix4(), mZ = V3(0, 0, -1);
    somites.visible = sA > 0.01;
    if (somites.visible) {
      for (let n = 0; n < NSOM; n++) {
        const i = uc(0.47 + n * 0.037), sc = sA * clamp(nShow - n, 0, 1) + 1e-4, dd = -Rr[i] * Kk[i] - 0.25;
        for (let sd = 0; sd < 2; sd++) {
          Mb.makeBasis(TN[i], NN[i], mZ).scale(V3(0.2 * sc, 0.24 * sc, 0.26 * sc)).setPosition(P[i].x + NN[i].x * dd, P[i].y + NN[i].y * dd, (sd ? 1 : -1) * (Rr[i] + 0.55));
          somites.setMatrixAt(n * 2 + sd, Mb);
        }
      }
      somites.instanceMatrix.needsUpdate = true;
    }

    // полушария
    const L = s < 3.3 ? 0 : s < 4 ? lerp(0.12, 0.45, smooth(3.3, 4, s)) : s < 6 ? lerp(0.45, 2.45, smooth(4, 6, s)) : lerp(2.45, 2.7, smooth(6, 7, s));
    const th = 1.2 * smooth(4.4, 5.6, s), upL = V3(Math.sin(th), Math.cos(th), 0), fwL = V3(Math.cos(th), -Math.sin(th), 0);
    const back = smooth(4, 6, s);
    const A0 = P[uc(0.04)].clone(), A1 = P[uc(0.13)].clone().addScaledVector(fwL, 0.3 * L).addScaledVector(upL, 0.55 * L);
    const hc = A0.lerp(A1, back);
    hemis.forEach((m) => { m.visible = L > 0.01; m.position.copy(hc); m.position.z = m.userData.side * Rr[uc(0.04)] * 0.55 * (1 - back); m.rotation.z = -th; m.scale.set(L, L, L * m.userData.side); m.morphTargetInfluences[0] = smooth(5.3, 6.1, s) * (1 + 0.15 * smooth(6, 7, s)); });
    hemiMat.color.copy(dim(st.mode === 'plates' ? C.alar : C.tele));
    // мозжечок
    const im = uc(0.29), cbS = smooth(4.4, 6, s) * 0.95 + smooth(6, 7, s) * 0.25;
    cereb.visible = cbS > 0.01; cereb.scale.set(0.72 * cbS, 0.5 * cbS, 1.05 * cbS);
    cereb.position.copy(P[im]).addScaledVector(NN[im], Rr[im] * 0.7 + 0.3 * cbS).addScaledVector(fwL, -0.25 * cbS); cereb.rotation.z = -th;
    cereb.morphTargetInfluences[0] = smooth(5.2, 6, s);
    cbMat.color.copy(dim(st.mode === 'plates' ? C.alar : C.met));
    // глазные пузыри
    const ie = uc(0.1), eS = smooth(2.7, 3.3, s) * (1 - smooth(4.2, 5, s)) * 0.42;
    eyes.forEach((m, k) => { m.visible = eS > 0.01; m.scale.setScalar(eS); m.position.copy(P[ie]).addScaledVector(B, (k ? -1 : 1) * (Rr[ie] + eS * 0.6)).addScaledVector(NN[ie], -Rr[ie] * 0.3); });
    // ганглии
    const gS = smooth(2.2, 3, s) * 0.2 * (1 - 0.5 * smooth(4.5, 6, s)), M = new THREE.Matrix4();
    for (let n = 0; n < NGAN; n++) {
      const iu = uc(0.47 + 0.045 * (n >> 1)), sd = n & 1 ? -1 : 1;
      M.makeScale(gS, gS * 1.2, gS).setPosition(P[iu].x - NN[iu].x * Rr[iu] * 0.15, P[iu].y - NN[iu].y * Rr[iu] * 0.15, sd * (Rr[iu] + 0.4));
      gang.setMatrixAt(n, M);
    }
    gang.instanceMatrix.needsUpdate = true; gang.visible = gS > 0.005;
    // центр кадра
    const ctr = P[uc(0.5)].clone().lerp(P[uc(0.18)], smooth(2, 4, s)).lerp(hc.clone().addScaledVector(upL, -0.3 * L), back);
    st.goal.copy(ctr); if (st.first) { st.center.copy(ctr); st.first = false; }
    root.scale.setScalar((1 + 0.15 * (1 - smooth(1.6, 2.6, s))) * (1 + 0.08 * smooth(6, 7, s)));
    st.th = th; placeRoot();
  }

  const ZA = V3(0, 0, 1);
  function placeRoot() { root.rotation.z = st.th; root.position.copy(st.center).applyAxisAngle(ZA, st.th).multiplyScalar(-root.scale.x); }
  let lastS = -1, lastMode = '';
  const CR = new THREE.Color(0xffa860);
  function update(dt) {
    st.t += dt; bloom.strength = 0.5 * LOOK.bloom;
    if (st.play) {
      const near = Math.abs(st.s - Math.round(st.s));
      st.s = Math.min(7, st.s + dt * 0.2 * (0.3 + 0.7 * smooth(0, 0.18, near)));
      if (st.s >= 7) st.play = false;
      refs.sync && refs.sync();
    }
    if (st.s !== lastS || st.mode !== lastMode) { build(); lastS = st.s; lastMode = st.mode; }
    if (!st.userCam) camera.position.lerpVectors(CAM_HI, CAM_LO, smooth(1, 2, st.s));
    st.center.lerp(st.goal, 1 - Math.exp(-dt * 3)); placeRoot();
    // нервный гребень
    if (st.s > 1.05 && st.s < 2.7) {
      for (let n = 0; n < 6; n++) {
        const i = Math.floor(rand(0.03, 0.97) * (NU - 1)); if (Kk[i] < 0.7) continue;
        const j = rnd() < 0.5 ? 0 : NV - 1, o = (i * NV + j) * 3, p = V3(pos[o], pos[o + 1], pos[o + 2]);
        const sd = Math.sign(p.z) || 1, vel = V3(0, 0, sd * rand(0.4, 0.9)).addScaledVector(NN[i], -rand(0.2, 0.6));
        crest.spawn(p, vel, CR, rand(1.2, 2.2), 0.6, 1.3);
      }
    }
    crest.update(dt);
    const cl = st.cut ? [cut] : [];
    capMesh.visible = st.cut;
    [tubeMat, hemiMat, cbMat, eyeMat, ganMat, ecMat, ncMat, somMat].forEach((m) => { if (m.clippingPlanes.length !== cl.length) { m.clippingPlanes = cl; m.needsUpdate = true; } });
    updLabels();
  }

  /* ---------- подписи ---------- */
  const L_ = (text, color, u, off, range) => ({ text, color, u, off, range, pos: V3(0, 0, 0), show: () => st.labels && st.s >= range[0] && st.s < range[1] });
  const labels = [
    L_('нервная пластинка', DEV_COL.plate, 0.62, 'top', [0, 0.9]),
    L_('нервные валики', '#FFD08A', 0.3, 'edge', [0.5, 1.7]),
    L_('нервный желобок', DEV_COL.plate, 0.75, 'top', [0.9, 1.7]),
    L_('нервный гребень', '#FFA860', 0.5, 'side', [1.2, 2.7]),
    L_('нервная трубка', DEV_COL.plate, 0.62, 'top', [1.7, 2.6]),
    L_('передний мозг', DEV_COL.pros, 0.08, 'top', [2.6, 3.6]),
    L_('средний мозг', DEV_COL.mes, 0.2, 'top', [2.6, 5.4]),
    L_('задний мозг', DEV_COL.rhomb, 0.33, 'top', [2.6, 3.6]),
    L_('спинной мозг', DEV_COL.spinal, 0.7, 'top', [2.2, 8]),
    L_('глазной пузырь → сетчатка', DEV_COL.di, 0.1, 'eye', [2.9, 4.5]),
    L_('конечный мозг', DEV_COL.tele, 0.03, 'front', [3.6, 4.9]),
    L_('промежуточный мозг', DEV_COL.di, 0.11, 'top', [3.6, 4.9]),
    L_('мост и мозжечок', DEV_COL.met, 0.29, 'top', [3.6, 4.7]),
    L_('продолговатый мозг', DEV_COL.myel, 0.38, 'bottom', [3.6, 8]),
    L_('среднемозговой изгиб', '#EFEAE6', 0.2, 'bottom', [4.1, 4.95]),
    L_('шейный изгиб', '#EFEAE6', 0.45, 'bottom', [4.1, 4.95]),
    L_('мостовой изгиб', '#EFEAE6', 0.33, 'bottomfar', [4.3, 4.95]),
    L_('большие полушария', DEV_COL.tele, -1, 'hemi', [4.9, 8]),
    L_('мозжечок', DEV_COL.met, -2, 'cb', [4.9, 8]),
    L_('спинномозговые ганглии', '#FFD08A', 0.56, 'gang', [2.4, 4.2]),
    L_('эктодерма', '#9FB8E0', 0.86, 'ecto', [0, 2.5]),
    L_('хорда', '#8FC9B8', 0.93, 'noto', [0, 2.8]),
    L_('сомиты', '#C9866A', 0.7, 'somite', [1.1, 2.5]),
  ];
  function updLabels() {
    labels.forEach((l) => {
      if (l.u === -1) { l.pos.copy(hemis[0].position).add(V3(0.2 * hemis[0].scale.x, 0.9 * hemis[0].scale.x, 1.1 * hemis[0].scale.x)); }
      else if (l.u === -2) { l.pos.copy(cereb.position).add(V3(-0.4 * cereb.scale.x, 0, cereb.scale.z * 0.9)); }
      else {
        const i = uc(l.u), R = Rr[i], k = Kk[i];
        l.pos.copy(P[i]);
        if (l.off === 'top') l.pos.addScaledVector(NN[i], k > 0.9 ? R + 0.15 : 0.2).z = k > 0.9 ? 0.2 : 0.3 * R;
        else if (l.off === 'edge') { const half = Math.PI * R, kap = k / R; l.pos.addScaledVector(NN[i], (1 - Math.cos(kap * half)) / Math.max(kap, 1e-4) - R * k + 0.15); l.pos.z = Math.sin(kap * half) / Math.max(kap, 1e-4); }
        else if (l.off === 'side') { l.pos.addScaledVector(NN[i], R * 0.6); l.pos.z = R + 0.5; }
        else if (l.off === 'ecto') { l.pos.addScaledVector(NN[i], 0.2); l.pos.z = 3.3; }
        else if (l.off === 'noto') { l.pos.addScaledVector(NN[i], -R * k - 0.3); l.pos.z = 0.2; }
        else if (l.off === 'somite') { l.pos.addScaledVector(NN[i], -R * k - 0.25); l.pos.z = R + 0.85; }
        else if (l.off === 'eye') { l.pos.z = R + 0.6; l.pos.addScaledVector(NN[i], -R * 0.3); }
        else if (l.off === 'front') { l.pos.addScaledVector(TN[i], -R * 0.9); l.pos.z = 0.4; }
        else if (l.off === 'bottom') { l.pos.addScaledVector(NN[i], -R - 0.25); l.pos.z = 0.3; }
        else if (l.off === 'bottomfar') { l.pos.addScaledVector(NN[i], -R - 0.9); l.pos.z = 0.3; }
        else if (l.off === 'gang') { l.pos.z = R + 0.75; }
      }
      l.pos.applyAxisAngle(ZA, st.th).multiplyScalar(root.scale.x).add(root.position);
    });
  }

  /* ---------- шкала времени ---------- */
  const ROWS = [
    { t: 'нейрогенез', a: 4, b: 16, c: '#FFB070' }, { t: 'миграция', a: 6, b: 20, c: '#F4C542' }, { t: 'глиогенез', a: 16, b: 46, c: '#7FD6C8' },
    { t: 'миелин', a: 22, b: 46, c: '#F1E7D6' }, { t: 'дендриты, синапсы', a: 16, b: 46, c: '#C77DFF' },
  ];
  function curWeek() { const s = st.s, i = Math.min(6, Math.floor(s)), f = s - i; return lerp(DEV_STAGES[i].wk, DEV_STAGES[i + 1].wk, f); }
  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt);
    const x0 = 92, x1 = w - 10, X = (wk) => x0 + (Math.min(wk, 46) / 46) * (x1 - x0), rh = (hgt - 26) / ROWS.length;
    ctx.font = '500 10px JetBrains Mono, monospace'; ctx.textBaseline = 'middle';
    ROWS.forEach((r, i) => {
      const y = 8 + rh * i + rh / 2;
      ctx.fillStyle = '#A49DA8'; ctx.textAlign = 'right'; ctx.fillText(r.t, x0 - 6, y);
      ctx.fillStyle = r.c; ctx.globalAlpha = 0.85; ctx.fillRect(X(r.a), y - rh * 0.28, X(r.b) - X(r.a), rh * 0.56); ctx.globalAlpha = 1;
      if (r.b >= 46) { ctx.fillStyle = r.c; ctx.fillText('…', X(46) - 2, y); }
    });
    ctx.strokeStyle = '#3A3540'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(40), 6); ctx.lineTo(X(40), hgt - 16); ctx.stroke();
    ctx.fillStyle = '#6F6875'; ctx.textAlign = 'center';
    [[0, '0'], [16, '16'], [20, '20'], [40, 'род.']].forEach(([wk, t]) => ctx.fillText(t, X(wk), hgt - 8));
    ctx.textAlign = 'left'; ctx.fillText('нед', 6, hgt - 8);
    const cx = X(curWeek()); ctx.strokeStyle = '#FF8F7A'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, 4); ctx.lineTo(cx, hgt - 16); ctx.stroke();
  }

  let refs = {};
  function ui(el) {
    const info = h('div', { class: 'info' });
    const near = () => Math.min(7, Math.round(st.s));
    const sSeg = seg(DEV_STAGES.map((d, i) => ({ id: i, label: d.short })), near, (v) => { st.s = v; st.play = false; refs.sync(); });
    const inp = h('input', { type: 'range', min: 0, max: 7, step: 0.01, value: st.s, 'aria-label': 'Срок развития' });
    const out = h('output', {}, '');
    inp.addEventListener('input', () => { st.s = +inp.value; st.play = false; refs.sync(); });
    const play = toggle('Развитие', () => st.play, (v) => { if (v && st.s >= 6.99) st.s = 0; st.play = v; });
    const mSeg = seg([{ id: 'regions', label: 'Отделы', color: DEV_COL.tele }, { id: 'plates', label: 'Пластинки', color: DEV_COL.basal }], () => st.mode, (v) => { st.mode = v; refs.sync(); });
    const cutB = toggle('Разрез', () => st.cut, (v) => { st.cut = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    let lastI = -1, lastM = '';
    refs.sync = () => {
      inp.value = st.s; out.textContent = DEV_STAGES[near()].when; sSeg.sync(); play.sync();
      if (near() !== lastI || st.mode !== lastM) {
        lastI = near(); lastM = st.mode; const d = DEV_STAGES[lastI];
        info.innerHTML = `<b>${d.name}.</b> ` + d.text +
          (st.mode === 'plates' ? '<br><br><b style="color:#FFB070">Крыловидная</b> (сверху) даёт сенсорные и вставочные нейроны, <b style="color:#6F9BFF">базальная</b> (снизу) даёт двигательные и вегетативные. Весь передний мозг вырастает из крыловидной, поэтому в полушариях нет ни двигательных, ни вегетативных нейронов.' : '');
      }
    };
    refs.sSeg = sSeg; refs.play = play; refs.cutB = cutB; refs.lab = lab; refs.mSeg = mSeg;
    el.append(group('Стадия', '← →', sSeg), group('Срок', 'пробел', h('div', { class: 'rng' }, inp, out), play),
      group('Вид', 'C · X · N', mSeg, cutB, lab),
      h('div', { class: 'grp', style: 'flex:1 1 320px' }, h('div', { class: 'glabel' }, 'Что видно'), info));
    refs.sync();
  }
  function onKey(e) {
    if (e.code === 'Space') { refs.play.click(); return true; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { st.play = false; st.s = clamp(Math.round(st.s) + (e.key === 'ArrowRight' ? 1 : -1), 0, 7); refs.sync(); return true; }
    const k = e.key.toLowerCase();
    if (k === 'c' || k === 'с') { st.mode = st.mode === 'regions' ? 'plates' : 'regions'; refs.mSeg.sync(); refs.sync(); return true; }
    if (k === 'x' || k === 'ч') { refs.cutB.click(); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    const s = st.s, d = DEV_STAGES[Math.min(7, Math.round(s))];
    const out = [['Срок', d.when, '']];
    out.push(['Нейроны', s < 2.5 ? 'делятся' : s < 5 ? 'мигрируют' : 'на местах', '']);
    if (s >= 5.8) out.push(['Масса', s < 6.5 ? 350 : '1300–1400', 'г']);
    return out;
  }
  build();
  return {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FF8F7A',
    kicker: 'Мозг · онтогенез ЦНС', title: 'Развитие мозга',
    lede: 'От плоской нервной пластинки к трубке, пузырям и полушариям. Перетащите срок или запустите развитие целиком.',
    notes: `
      <div><h2>Как развивается мозг</h2>
        <p>Эмбриогенез — часть <b>онтогенеза</b>, пути организма от зачатия до смерти. За ним стоит каскад включения и выключения генов: они управляют делением клеток, их перемещением, местом и тем, каким нейроном клетка станет и какой медиатор будет выделять.</p>
        <h3>Нейруляция</h3>
        <p>Эктодерма на спинной стороне даёт нервную пластинку, та сворачивается в желобок и замыкается в трубку. Стенка трубки — нейроэпителий вокруг канала. Клетки у канала делятся на <b>спонгиобласты</b> и <b>нейробласты</b>. Спонгиобласты тянут радиальные отростки к наружной стороне, по ним мигрируют нейроны. Позже спонгиобласты дают глию: эпендиму, астроциты и олигодендроциты. Сначала идёт нейрогенез, потом глиогенез.</p>
        <h3>Пузыри</h3>
        <p>3 пузыря → 5: передний → конечный (полушария и подкорковые ядра) + промежуточный (таламус, гипоталамус); средний → четверохолмие и ножки мозга; задний → собственно задний (мост, мозжечок) + продолговатый.</p>
        <h3>После рождения</h3>
        <p>Масса растёт с 350 до 1300–1400 г, а число нейронов нет. Растут дендриты, синапсы, глия и миелин. Самые важные годы — первые 2–3: от среды и общения зависит, сколько связей образуется.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Порядок стадий и сроки: смыкание с 20-го дня, трубка к концу 4 недели, 5 пузырей к 5–6 неделе, нейрогенез до 16 недель, миграция до 20.</li>
        <li>Смыкание от середины к концам, нервный гребень по краям.</li><li>Крыловидная и базальная пластинки, порядок изгибов.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul><li>Все стадии показаны в одном размере, хотя мозг вырастает в сотни раз.</li><li>Форма пузырей и изгибов упрощена.</li><li>Шкала справа показывает процессы, линия — текущий срок.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>пробел</code> развитие</li><li><code>←</code> <code>→</code> стадия</li><li><code>C</code> отделы / пластинки</li><li><code>X</code> разрез</li><li><code>N</code> подписи</li></ul></div>`,
  };
}
export { makeDevelop };
