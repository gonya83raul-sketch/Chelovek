import { THREE, V3, __set_rnd, button, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mulberry, noise3, pickOn, range, rnd, seg, taperTube, toggle } from '../core.js';


// @scene midear makeMidEar | Среднее ухо | @body Системы органов
/* =========================================================
   ТЕЛО · СРЕДНЕЕ УХО: правая барабанная полость, увеличенная в ≈ 5 раз (1 ед. = 1 мм) —
   шесть стенок, косточки, две мышцы, лицевой нерв и барабанная струна, слуховая труба и сосцевидная пещера;
   передача звука и акустический рефлекс; вид в отоскоп (норма и болезни); давление и слуховая труба.
   Сверено с атласом Неттера (табл. 105–108). Оси: x — к середине головы (медиально), y — вверх, z — вперёд.
   ========================================================= */
const ME_PART = [
  { id: 'oss', name: 'Косточки', col: '#F2E6C8', text: '<b>Слуховые косточки</b> — молоточек, наковальня и стремечко, самые маленькие кости тела (стремечко ≈ 3 мм). Рукоятка молоточка вплетена в перепонку, головка лежит в надбарабанном кармане и соединена суставом с наковальней. Длинный отросток наковальни сочленяется со стремечком, а основание стремечка закрывает овальное окно.' },
  { id: 'mus', name: 'Мышцы', col: '#E8505E', text: '<b>Две самые маленькие мышцы тела.</b> Мышца, напрягающая барабанную перепонку (нерв V₃), лежит над слуховой трубой; её сухожилие огибает улитковидный отросток и тянет рукоятку молоточка внутрь. Стременная мышца (нерв VII) спрятана в пирамидальном возвышении задней стенки и тянет шейку стремечка. Обе делают цепь жёстче при громком звуке.' },
  { id: 'nrv', name: 'Нервы', col: '#F4C542', text: '<b>Лицевой нерв (VII)</b> идёт в костном канале над овальным окном, затем спускается в задней стенке к шилососцевидному отверстию. От него отходят нерв стременной мышцы и <b>барабанная струна</b>: она пересекает полость между молоточком и наковальней и несёт вкус от передних двух третей языка. На мысе лежит барабанное сплетение (IX).' },
  { id: 'air', name: 'Труба и пещера', col: '#7FD6FF', text: '<b>Слуховая труба</b> (≈ 36 мм) идёт от передней стенки вперёд, внутрь и вниз к носоглотке. Задняя треть у неё костная, передние две трети — хрящевые и обычно сомкнуты. Сзади полость через вход в пещеру сообщается с <b>сосцевидной пещерой</b> и воздухоносными ячейками сосцевидного отростка. Поэтому средний отит может перейти в мастоидит.' },
];
const ME_WALL = [
  { id: 'lat', name: 'Латеральная', col: '#F0C8A8', text: '<b>Латеральная (перепончатая) стенка</b> — барабанная перепонка и над ней костная пластинка, отделяющая надбарабанный карман от слухового прохода. Перепонка ≈ 9 × 10 мм и толщиной ≈ 0,1 мм. Она наклонена и втянута воронкой к пупку — концу рукоятки молоточка.' },
  { id: 'med', name: 'Медиальная', col: '#E89A9A', text: '<b>Медиальная (лабиринтная) стенка</b> отделяет полость от внутреннего уха. Посредине — мыс: его выпячивает основной завиток улитки. Над мысом — овальное окно со стремечком, ниже и позади — круглое окно, затянутое вторичной перепонкой. Над овальным окном проходит канал лицевого нерва, ещё выше — выступ латерального полукружного канала.' },
  { id: 'roof', name: 'Верхняя', col: '#C9B8F0', text: '<b>Верхняя (покрышечная) стенка</b> — тонкая пластинка височной кости, крыша полости. Над ней средняя черепная ямка и височная доля мозга. Поэтому гнойный отит изредка осложняется менингитом или абсцессом мозга.' },
  { id: 'floor', name: 'Нижняя', col: '#8FB8F0', text: '<b>Нижняя (яремная) стенка</b> — узкое дно полости над луковицей внутренней яремной вены. Пластинка бывает очень тонкой, а иногда в ней есть щель.' },
  { id: 'ant', name: 'Передняя', col: '#F08A8A', text: '<b>Передняя (сонная) стенка</b> отделяет полость от канала внутренней сонной артерии. В её верхней части два отверстия: полуканал мышцы, напрягающей барабанную перепонку, и под ним вход в слуховую трубу.' },
  { id: 'post', name: 'Задняя', col: '#A8E0B0', text: '<b>Задняя (сосцевидная) стенка.</b> Вверху в ней вход в сосцевидную пещеру, ниже — пирамидальное возвышение, из которого выходит сухожилие стременной мышцы. В толще стенки спускается лицевой нерв, и из неё в полость входит барабанная струна.' },
];
const ME_OTO = [
  { id: 'norm', name: 'Норма', col: '#C9C4BC', ud: 0, bul: 0, cone: 1, op: 0.9, text: '<b>Нормальная перепонка</b> (правое ухо) — перламутрово-серая и полупрозрачная. Сквозь неё видна рукоятка молоточка: от короткого отростка вверху она идёт вниз и назад к пупку. От пупка вперёд и вниз падает световой конус — отражение лампы отоскопа (у правого уха на 5 часах, у левого на 7). Над коротким отростком — ненатянутая часть перепонки, ниже — натянутая.' },
  { id: 'aom', name: 'Острый отит', col: '#C84A3C', ud: -0.3, bul: -1.7, cone: 0, op: 0.98, text: '<b>Острый средний отит.</b> Гной в полости выпячивает перепонку наружу. Она красная и мутная, рукоятка молоточка и световой конус не видны. Боль, жар, снижение слуха; чаще у детей после простуды. Обычно проходит за несколько дней, при тяжёлом течении назначают антибиотики.' },
  { id: 'ome', name: 'Экссудат', col: '#C99A50', ud: 0.35, bul: 0.2, cone: 0.35, op: 0.88, text: '<b>Экссудативный отит.</b> За перепонкой жидкость без острого воспаления. Перепонка янтарная, сквозь неё видны уровень жидкости и пузырьки воздуха. Слух снижен, боли нет. Это частая причина тугоухости у детей; если жидкость держится месяцами, в перепонку ставят шунты.' },
  { id: 'retr', name: 'Втяжение', col: '#BDB6AE', ud: 1.25, bul: 0.55, cone: 0.25, op: 0.9, text: '<b>Втянутая перепонка.</b> Труба не открывается, воздух из полости постепенно всасывается слизистой, и давление в ней падает. Перепонка втягивается: рукоятка кажется короче и горизонтальнее, короткий отросток выступает, световой конус дробится или исчезает.' },
  { id: 'perf', name: 'Перфорация', col: '#C9C4BC', ud: 0, bul: 0, cone: 0, op: 0.9, text: '<b>Перфорация</b> — отверстие в натянутой части после отита или травмы (удар по уху, перепад давления, ватная палочка). Сквозь него видна розовая медиальная стенка. Маленькие отверстия обычно зарастают сами за несколько недель, большие закрывают операцией (мирингопластика).' },
];
function makeMidEar() {
  __set_rnd(mulberry(2311));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080b); scene.environment = envTex;
  labLights(scene, 0xffb08a);
  const keyL = new THREE.DirectionalLight(0xfff2e6, 0.7); keyL.position.set(-20, 18, 14); scene.add(keyL);
  const DK = !matchMedia('(max-width:700px)').matches;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const sm = (x) => { const t = cl(x); return t * t * (3 - 2 * t); };
  const mphys = (col, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).multiplyScalar(o.k ?? 0.9), roughness: o.r ?? 0.55, clearcoat: o.cc ?? 0.2, sheen: 0.2, sheenColor: new THREE.Color(0xffffff), emissive: new THREE.Color(o.emc ?? col), emissiveIntensity: o.em ?? 0.08, side: o.side ?? THREE.FrontSide, transparent: o.op !== undefined, opacity: o.op ?? 1, depthWrite: o.op === undefined, vertexColors: !!o.vc }); m.userData.em0 = o.em ?? 0.08; m.userData.op0 = o.op ?? 1; return m; };
  const setOp = (m, op) => { const t = op < 0.999; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = op; m.depthWrite = op >= 0.999; };
  const cr3 = (arr) => new THREE.CatmullRomCurve3(arr.map((a) => (a.isVector3 ? a.clone() : V3(a[0], a[1], a[2]))), false, 'centripetal');
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);
  const controls = makeControls(camera, V3(0, 0, 0)); controls.minDistance = 4; controls.maxDistance = 140;
  const vw = (C, dir, dist, sx, sy) => { const d = dir.clone().normalize(), f = d.clone().negate(), r = f.clone().cross(V3(0, 1, 0)).normalize(), u = r.clone().cross(f), S = r.multiplyScalar(-sx).addScaledVector(u, -sy); return flyTarget(C.clone().add(S), C.clone().addScaledVector(d, dist).add(S)); };
  const st = { mode: 'cav', view: 'lat', sel: null, wall: null, labels: true, rot: false, drum: true, fly: null, t: 0,
    loud: 0.45, oto: 'norm', quad: false, desc: 0, pMid: 0, open: 0, openT: 0, child: false, msg: null,
    ud: 0, bul: 0, cone: 1, ref: 0, tens: 0, phase: 0 };
  const pick = [];
  const ROOT = new THREE.Group(); scene.add(ROOT);

  // =================== барабанная перепонка ===================
  const nD = V3(-1, -0.35, 0.3).normalize();   // наружу (в слуховой проход), вниз и вперёд
  const uD = V3(0, 1, 0).addScaledVector(nD, -nD.y).normalize(), aD = uD.clone().cross(nD).normalize();   // aD — вперёд по перепонке
  const RA = 4.3, RB = 4.8, DEP = 2.0, UM = [0.15, -0.45], LP = [0.55, 3.75];
  const inEl = (a, b) => (a / RA) ** 2 + (b / RB) ** 2;
  const rimT = (c, s) => { const A = (c / RA) ** 2 + (s / RB) ** 2, B = 2 * (UM[0] * c / RA ** 2 + UM[1] * s / RB ** 2), C = inEl(UM[0], UM[1]) - 1; return (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A); };
  const dPos = (a, b, rho, out = V3()) => { const dep = DEP * (1 - rho) * (1 + 0.35 * rho) * (b > 3.6 ? 1 - sm((b - 3.6) / 0.8) * 0.6 : 1) + st.ud * (1 - rho) + st.bul * 4 * rho * (1 - rho); return out.set(0, 0, 0).addScaledVector(aD, a).addScaledVector(uD, b).addScaledVector(nD, -dep); };
  const abOf = (rho, phi) => { const c = Math.cos(phi), s = Math.sin(phi), t = rimT(c, s) * rho; return [UM[0] + c * t, UM[1] + s * t]; };
  const NR = 26, NS = 96, dGeo = new THREE.BufferGeometry(), dAB = [], dRho = [];
  for (let i = 0; i <= NR; i++) for (let j = 0; j < NS; j++) { const rho = i / NR, ab = abOf(rho, 2 * Math.PI * j / NS); dAB.push(ab); dRho.push(rho); }
  dGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dAB.length * 3), 3));
  dGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(dAB.length * 3), 3));
  const PERF = [1.75, -1.75, 1.35, 1.1];   // переднее-нижний квадрант
  const dIdx = (perf) => { const ix = []; for (let i = 0; i < NR; i++) for (let j = 0; j < NS; j++) { const a = i * NS + j, b = i * NS + (j + 1) % NS, c = a + NS, d = b + NS;
    if (perf) { const [pa, pb] = dAB[a], q = ((pa - PERF[0]) / PERF[2]) ** 2 + ((pb - PERF[1]) / PERF[3]) ** 2; if (q < 1) continue; } ix.push(a, c, b, b, c, d); } return ix; };
  const IDX0 = dIdx(false), IDX1 = dIdx(true); dGeo.setIndex(IDX0); let perfOn = false;
  const drumM = mphys('#FFFFFF', { r: 0.32, cc: 0.7, em: 0.05, emc: '#3a3430', side: THREE.DoubleSide, op: 0.82, vc: true });
  const DRUM = new THREE.Mesh(dGeo, drumM); DRUM.userData.pick = 'w:lat'; ROOT.add(DRUM); pick.push(DRUM); DRUM.renderOrder = 3;
  const cTens = new THREE.Color('#C9C4BC'), cFlac = new THREE.Color('#D6A49A'), cTmp = new THREE.Color(), cCond = new THREE.Color('#C9C4BC');
  // световой конус и квадранты
  const coneGeo = new THREE.BufferGeometry(), NC = 14; coneGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NC * 2 * 3), 3));
  coneGeo.setAttribute('color', new THREE.BufferAttribute(Float32Array.from({ length: NC * 2 * 3 }, (_, i) => { const k = Math.floor(i / 6); return Math.pow(1 - k / (NC - 1), 0.8) * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, k / 3 + 0.2))); }), 3));
  { const ix = []; for (let k = 0; k < NC - 1; k++) { const a = 2 * k; ix.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } coneGeo.setIndex(ix); }
  const coneM = new THREE.MeshBasicMaterial({ color: 0xfff8ea, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const CONE = new THREE.Mesh(coneGeo, coneM); CONE.renderOrder = 5; ROOT.add(CONE);
  const quadGeo = new THREE.BufferGeometry(); quadGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 24 * 3), 3));
  const QUAD = new THREE.LineSegments(quadGeo, new THREE.LineBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: 0.9, depthTest: false })); QUAD.renderOrder = 6; ROOT.add(QUAD);
  const fluidGeo = new THREE.BufferGeometry(); fluidGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(40 * 3), 3));
  const FLUID = new THREE.Line(fluidGeo, new THREE.LineBasicMaterial({ color: 0x5a3a10, transparent: true, opacity: 0.9 })); FLUID.renderOrder = 6; ROOT.add(FLUID);
  const BUB = new THREE.Group(); ROOT.add(BUB);
  const BUBP = [[-1.6, -2.4, 0.42], [-0.6, -2.9, 0.3], [0.9, -3.0, 0.36], [2.3, -2.2, 0.28], [-2.6, -1.6, 0.25], [1.6, -3.6, 0.22]];
  BUBP.forEach(() => BUB.add(new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 6, 20), new THREE.MeshBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: 0.8 }))));
  let lastD = '';
  function updateDrum(force) {
    const key = [st.ud.toFixed(3), st.bul.toFixed(3), cCond.getHexString(), st.mode, perfOn].join();
    if (!force && key === lastD) return; lastD = key;
    const P = dGeo.attributes.position.array, C = dGeo.attributes.color.array, v = V3();
    const fl = st.mode === 'oto' && st.oto === 'ome', red = st.mode === 'oto' && st.oto === 'aom';
    for (let k = 0; k < dAB.length; k++) {
      const [a, b] = dAB[k], rho = dRho[k]; dPos(a, b, rho, v); P[3 * k] = v.x; P[3 * k + 1] = v.y; P[3 * k + 2] = v.z;
      const flac = b > 3.55 && Math.abs(a) < 2.6, phi = Math.atan2(b - UM[1], a - UM[0]);
      cTmp.copy(flac && !red ? cFlac : cCond).multiplyScalar(0.94 + 0.06 * Math.sin(phi * 34) * rho);
      if (fl && v.y < -0.9) cTmp.multiplyScalar(0.78);
      if (red) cTmp.offsetHSL(0, 0, 0.08 * (1 - rho));
      if (rho > 0.93) cTmp.multiplyScalar(0.8);
      C[3 * k] = cTmp.r; C[3 * k + 1] = cTmp.g; C[3 * k + 2] = cTmp.b;
    }
    dGeo.attributes.position.needsUpdate = true; dGeo.attributes.color.needsUpdate = true; dGeo.computeVertexNormals(); dGeo.computeBoundingSphere();
    // конус: сектор от пупка вперёд-вниз (у правого уха — на 5 часах)
    const cp = coneGeo.attributes.position.array, ph0 = -0.62;
    for (let k = 0; k < NC; k++) { const r = 0.14 + 0.58 * k / (NC - 1), w = 0.05 + 0.16 * k / (NC - 1);
      [ph0 - w, ph0 + w].forEach((ph, s) => { const [a, b] = abOf(r, ph); dPos(a, b, r, v).addScaledVector(nD, 0.04); cp.set([v.x, v.y, v.z], (2 * k + s) * 3); }); }
    coneGeo.attributes.position.needsUpdate = true; coneGeo.computeBoundingSphere();
    // квадранты: линия вдоль рукоятки и перпендикуляр через пупок
    const qp = quadGeo.attributes.position.array, hd = Math.atan2(LP[1] - UM[1], LP[0] - UM[0]); let q = 0;
    [hd, hd + Math.PI, hd + Math.PI / 2, hd - Math.PI / 2].forEach((ph) => { for (let k = 0; k < 12; k++) { [k, k + 1].forEach((kk) => { const r = kk / 12; const [a, b] = abOf(r, ph); dPos(a, b, r, v).addScaledVector(nD, 0.06); qp.set([v.x, v.y, v.z], q); q += 3; }); } });
    quadGeo.attributes.position.needsUpdate = true; quadGeo.computeBoundingSphere();
    const fp = fluidGeo.attributes.position.array, bl = -1.15;
    for (let k = 0; k < 40; k++) { const a = -RA + 2 * RA * k / 39, lim = RB * Math.sqrt(Math.max(0, 1 - (a / RA) ** 2)); const b = Math.max(-lim * 0.97, Math.min(lim * 0.97, bl)); const rho = Math.min(0.99, Math.sqrt(inEl(a, b))); dPos(a, b, rho, v).addScaledVector(nD, 0.05); fp.set([v.x, v.y, v.z], 3 * k); }
    fluidGeo.attributes.position.needsUpdate = true; fluidGeo.computeBoundingSphere();
    BUB.children.forEach((m, i) => { const [a, b, r] = BUBP[i], rho = Math.min(0.95, Math.sqrt(inEl(a, b))); dPos(a, b, rho, m.position).addScaledVector(nD, 0.06); m.scale.setScalar(r); m.lookAt(m.position.clone().add(nD)); });
  }
  const ann = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 48 }, (_, j) => { const ph = 2 * Math.PI * j / 48; return V3().addScaledVector(aD, RA * 1.02 * Math.cos(ph)).addScaledVector(uD, RB * 1.02 * Math.sin(ph)); }), true), 96, 0.3, 8, true), mphys('#E6D8BE', { r: 0.7, em: 0.04 }));
  ann.userData.pick = 'w:lat'; pick.push(ann); ROOT.add(ann);

  // =================== стенки полости ===================
  const MX = (y, z) => 5.2 - 1.6 * Math.exp(-((y + 1.2) ** 2 / 10 + (z - 0.6) ** 2 / 14)) - 0.55 * Math.exp(-((y - 4.25) ** 2) / 0.45) * sm((z + 5.6) / 1) * sm((3 - z) / 1)
    - 0.7 * Math.exp(-((y - 6.4) ** 2 / 1.1 + (z + 3.2) ** 2 / 5)) + 0.7 * Math.exp(-((y - 2.5) ** 2 / 0.7 + (z + 1.6) ** 2 / 2.2)) + 0.9 * Math.exp(-((y + 2.7) ** 2 / 0.8 + (z + 3.9) ** 2 / 0.8));
  const XL = (y, z) => (-nD.y * y - nD.z * z) / nD.x;   // плоскость перепонки
  const Y0 = -6.4, Y1 = 9.0, Z0 = -6.2, Z1 = 6.5;
  function sheet(nu, nv, f, keep, col) {
    const pos = [], ix = [], ok = [];
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { const u = i / nu, v = j / nv, p = f(u, v); p.x += 0.12 * noise3(p.x * 0.9, p.y * 0.9, p.z * 0.9); pos.push(p.x, p.y, p.z); ok.push(!keep || keep(u, v, p)); }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1; if (ok[a] && ok[b] && ok[c] && ok[d]) ix.push(a, c, b, b, c, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(ix); g.computeVertexNormals(); return g;
  }
  const W = {}, wallM = {};
  ME_WALL.forEach((w) => { wallM[w.id] = mphys(w.id === 'med' ? '#D9A8A0' : '#E6D8BE', { r: 0.75, cc: 0.05, em: 0.04, emc: w.col, side: THREE.DoubleSide, op: 0.3 }); W[w.id] = new THREE.Group(); ROOT.add(W[w.id]); });
  const addW = (id, g) => { const m = new THREE.Mesh(g, wallM[id]); m.userData.pick = 'w:' + id; pick.push(m); W[id].add(m); m.renderOrder = 1; return m; };
  addW('med', sheet(40, 40, (u, v) => { const y = Y0 + (Y1 - Y0) * u, z = Z0 + (Z1 - Z0) * v; return V3(MX(y, z), y, z); }));
  addW('lat', sheet(36, 36, (u, v) => { const a = -6.6 + 13.2 * u, b = -7.4 + 18 * v; return V3().addScaledVector(aD, a).addScaledVector(uD, b); }, (u, v, p) => { const a = -6.6 + 13.2 * u, b = -7.4 + 18 * v; return inEl(a, b) > 1.02 && p.y < Y1 + 0.2 && p.y > Y0 - 0.2 && p.z > Z0 - 0.3 && p.z < Z1 + 0.3; }));
  addW('roof', sheet(20, 30, (u, v) => { const z = Z0 + (Z1 - Z0) * v, x0 = XL(Y1, z), x1 = MX(Y1, z), x = x0 + (x1 - x0) * u; return V3(x, Y1 + 0.35 * Math.sin(Math.PI * u), z); }));
  addW('floor', sheet(16, 30, (u, v) => { const z = Z0 + (Z1 - Z0) * v, x0 = XL(Y0, z), x1 = MX(Y0, z), x = x0 + (x1 - x0) * u; return V3(x, Y0 - 0.4 * Math.sin(Math.PI * u), z); }));
  const TUB0 = V3(2.6, -1.2, Z1);   // вход в слуховую трубу
  addW('ant', sheet(24, 36, (u, v) => { const y = Y0 + (Y1 - Y0) * v, x0 = XL(y, Z1), x1 = MX(y, Z1); return V3(x0 + (x1 - x0) * u, y, Z1); }, (u, v, p) => Math.hypot((p.x - TUB0.x) / 1.3, (p.y - TUB0.y) / 1.2) > 1 && Math.hypot((p.x - 4.2) / 0.75, (p.y - 1.9) / 0.7) > 1));
  addW('post', sheet(24, 36, (u, v) => { const y = Y0 + (Y1 - Y0) * v, x0 = XL(y, Z0), x1 = MX(y, Z0); return V3(x0 + (x1 - x0) * u, y, Z0); }, (u, v, p) => !(p.y > 5.6 && p.x < 2.6 && p.x > -2.6)));
  // окна, мыс, улитковидный отросток, пирамида
  const FP = V3(MX(2.5, -1.6) - 0.55, 2.5, -1.6), RW = V3(MX(-2.7, -3.9) - 0.2, -2.7, -3.9);
  const rwM = mphys('#7A4048', { r: 0.4, cc: 0.5, em: 0.1 });
  const rwin = new THREE.Mesh(new THREE.CircleGeometry(0.75, 24), rwM); rwin.position.copy(RW); rwin.lookAt(RW.clone().add(V3(-1, -0.2, -0.4))); W.med.add(rwin); rwin.userData.pick = 'w:med'; pick.push(rwin);
  const CF = V3(MX(3.4, 2.4) - 0.6, 3.4, 2.4);
  const cfM = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.18, 8, 16, Math.PI * 1.2), wallM.med); cfM.position.copy(CF); cfM.rotation.y = Math.PI / 2; W.med.add(cfM);
  const PYR = V3(3.4, 2.0, Z0 + 0.1);
  const pyrG = new THREE.ConeGeometry(0.55, 1.5, 14); pyrG.rotateX(Math.PI / 2); pyrG.translate(0, 0, 0.75); addW('post', pyrG).position.copy(PYR);

  // =================== косточки ===================
  const bonM = mphys('#F2E6C8', { r: 0.45, cc: 0.3, em: 0.06 }), CH = new THREE.Group(), STP = new THREE.Group();
  const A0 = V3(0.35, 5.55, 2.3), A1 = V3(1.05, 6.25, -3.9), AX = A1.clone().sub(A0).normalize();   // ось вращения цепи: передний отросток молоточка — короткий отросток наковальни
  CH.position.copy(A0); ROOT.add(CH); ROOT.add(STP);
  const rest = (p) => p.clone().sub(A0);
  const bone = (g, par = CH) => { const m = new THREE.Mesh(g, bonM); m.userData.pick = 'oss'; pick.push(m); par.add(m); return m; };
  const dRest = (a, b) => { const sv = [st.ud, st.bul]; st.ud = 0; st.bul = 0; const rho = Math.sqrt(((a - UM[0]) ** 2 + (b - UM[1]) ** 2)) / rimT((a - UM[0]) / (Math.hypot(a - UM[0], b - UM[1]) || 1), (b - UM[1]) / (Math.hypot(a - UM[0], b - UM[1]) || 1)); const p = dPos(a, b, Math.min(1, rho)); [st.ud, st.bul] = sv; return p; };
  const HP = Array.from({ length: 9 }, (_, k) => { const t = k / 8; return dRest(LP[0] + (UM[0] - LP[0]) * t, LP[1] + (UM[1] - LP[1]) * t); });
  const UMB = HP[8].clone(), LPP = HP[0].clone();
  const MH = V3(0.25, 6.05, 0.55), MN = V3(-0.35, 4.75, 0.5);
  bone(taperTube(cr3([MH, MN, ...HP].map(rest)), (u) => (u < 0.2 ? 0.55 - 0.9 * u : 0.36 - 0.18 * u), 60, 10));
  bone(ell3(1.05, 1.25, 1.0, rest(MH), 24));
  bone(ell3(0.42, 0.42, 0.42, rest(LPP).addScaledVector(nD, 0.15), 14));   // короткий (латеральный) отросток
  bone(taperTube(cr3([MN.clone().add(V3(0.1, 0.3, 0.4)), V3(0.3, 5.3, 1.6), A0].map(rest)), (u) => 0.22 - 0.14 * u, 12, 8));   // передний отросток
  const IB = V3(0.95, 5.95, -1.35), LEN = V3(2.1, 2.45, -1.6);
  bone(ell3(0.95, 1.25, 1.05, rest(IB), 24));
  bone(taperTube(cr3([IB, V3(1.0, 6.2, -2.8), A1].map(rest)), (u) => 0.6 - 0.45 * u, 16, 8));   // короткий отросток
  bone(taperTube(cr3([IB.clone().add(V3(0.05, -0.6, -0.1)), V3(1.15, 4.5, -1.75), V3(1.45, 3.0, -1.75), V3(1.7, 2.5, -1.65), LEN].map(rest)), (u) => 0.4 - 0.18 * u, 32, 8));   // длинный отросток
  bone(ell3(0.3, 0.3, 0.3, rest(LEN), 12));
  // стремечко: головка, ножки, основание в овальном окне
  const SH = LEN.clone().add(V3(0.35, 0.02, 0)), SD = FP.clone().sub(SH).normalize();
  STP.position.copy(SH);
  const stM = (p) => p.clone().sub(SH);
  bone(ell3(0.32, 0.3, 0.32, stM(SH), 12), STP);
  [-1, 1].forEach((s) => bone(taperTube(cr3([SH.clone().add(V3(0.3, 0, 0.12 * s)), SH.clone().lerp(FP, 0.55).add(V3(0, 0.15, 0.9 * s)), FP.clone().add(V3(-0.15, 0, 1.15 * s))].map(stM)), () => 0.11, 16, 6), STP));
  const fpG = new THREE.CylinderGeometry(1, 1, 0.22, 28); fpG.scale(0.62, 1, 1.45); fpG.rotateZ(Math.PI / 2); fpG.translate(FP.x - SH.x, FP.y - SH.y, FP.z - SH.z); bone(fpG, STP);
  const owR = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 6, 32), new THREE.MeshBasicMaterial({ color: 0x5a3030 })); owR.scale.set(1.55, 0.72, 1); owR.position.copy(FP).add(V3(0.08, 0, 0)); owR.rotation.y = Math.PI / 2; W.med.add(owR);
  // калибровка рычага: смещение пупка и чечевицеобразного отростка на единицу угла
  const qT = new THREE.Quaternion().setFromAxisAngle(AX, 1e-3);
  const kU = rest(UMB).applyQuaternion(qT).add(A0).sub(UMB).dot(nD.clone().negate()) / 1e-3;
  const kL = rest(LEN).applyQuaternion(qT).add(A0).sub(LEN).dot(SD) / 1e-3;

  // =================== мышцы ===================
  const musM = { tt: mphys('#E8505E', { r: 0.5, em: 0.1 }), sp: mphys('#E8505E', { r: 0.5, em: 0.1 }) }, tenM = mphys('#F2EAE0', { r: 0.4, em: 0.06 });
  const MUSL = [], mus = (g, m) => { const ms = new THREE.Mesh(g, m); ms.userData.pick = 'mus'; pick.push(ms); ROOT.add(ms); MUSL.push(ms); return ms; };
  const TT0 = V3(6.6, 1.2, 11.5), TTS = cr3([TT0, V3(5.9, 2.0, 8.0), V3(5.0, 2.7, 4.6), CF.clone().add(V3(0.1, 0, 0.7))]);
  const TTM = mus(taperTube(TTS, (u) => 0.25 + 0.55 * Math.sin(Math.PI * Math.min(1, u * 1.1)), 40, 10), musM.tt);
  const MNk = HP[1].clone().lerp(MN, 0.5);
  mus(new THREE.TubeGeometry(cr3([CF.clone().add(V3(0.05, 0, 0.3)), CF.clone().add(V3(-0.3, 0.1, -0.15)), CF.clone().lerp(MNk, 0.5).add(V3(0, 0.2, -0.2)), MNk]), 20, 0.14, 6), tenM);
  const SP0 = V3(3.9, -4.6, Z0 - 0.7), SPT = PYR.clone().add(V3(0, 0, 1.4)), SN = SH.clone().add(V3(0.12, 0.08, -0.3));
  const SPM = mus(taperTube(cr3([SP0, V3(3.7, -1.2, Z0 - 0.6), PYR.clone().add(V3(0.05, -0.4, -0.2))]), (u) => 0.2 + 0.5 * Math.sin(Math.PI * u), 30, 10), musM.sp);
  mus(new THREE.TubeGeometry(cr3([SPT, SPT.clone().lerp(SN, 0.5).add(V3(0, 0.12, 0)), SN]), 16, 0.1, 6), tenM);

  // =================== нервы ===================
  const nvM = mphys('#F4C542', { r: 0.45, em: 0.18 }), nvM2 = mphys('#F4C542', { r: 0.45, em: 0.18 }), ixM = mphys('#E8D070', { r: 0.5, em: 0.14 });
  const NM = [], nv = (pts, r, m = nvM) => { const ms = new THREE.Mesh(new THREE.TubeGeometry(cr3(pts), 80, r, 8), m); ms.userData.pick = 'nrv'; pick.push(ms); ROOT.add(ms); NM.push(ms); return ms; };
  const GG = V3(8.4, 5.6, 4.6), FCP = [GG, V3(6.2, 4.7, 2.8), V3(5.15, 4.3, 0.6), V3(5.0, 4.2, -2.4), V3(4.7, 3.9, -4.6), V3(4.2, 2.6, -6.6), V3(3.9, -1.5, -7.1), V3(3.6, -8, -7.2), V3(3.4, -14, -7.3)];
  nv(FCP, 0.42);
  const ggM = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 12), nvM); ggM.position.copy(GG); ggM.userData.pick = 'nrv'; pick.push(ggM); ROOT.add(ggM);
  nv([GG, V3(10.5, 6.2, 7.2), V3(13, 6.6, 10.5)], 0.2);   // большой каменистый нерв
  const fcanal = new THREE.Mesh(new THREE.TubeGeometry(cr3(FCP.slice(1)), 80, 0.68, 10), glassMat(0xf2e6c8, { rim: 0.35, base: 0.02, pow: 2 })); ROOT.add(fcanal);
  const CHT = [V3(3.6, -8.4, -7.2), V3(2.4, -3.6, -6.9), V3(-0.9, 2.6, -6.4), V3(-0.85, 3.55, -4.6), V3(0.45, 4.05, -1.75), V3(0.35, 4.2, 0.6), V3(-0.6, 4.05, 3.6), V3(-1.4, 3.8, 7.5)];
  nv(CHT, 0.14, nvM2);   // барабанная струна
  const PRS = (y, z) => V3(MX(y, z) - 0.18, y, z);
  nv([V3(4.8, -10.5, 0.4), V3(4.75, -6.6, 0.3), PRS(-3.6, 0.5), PRS(-1.2, 0.8), PRS(1.0, 1.4), PRS(3.0, 2.8).add(V3(0.1, 0, 0.2)), V3(5.6, 5.2, 4.0), V3(9, 7.2, 7.5)], 0.1, ixM);   // барабанный нерв (IX) → малый каменистый

  // =================== сосуды (ориентиры) ===================
  const vesM = (c) => mphys(c, { r: 0.45, em: 0.08 });
  const ICA = new THREE.Mesh(new THREE.TubeGeometry(cr3([V3(5.5, -14, 8.6), V3(5.6, -8, 8.8), V3(6.0, -2.5, 9.4), V3(8.0, 0.2, 12.5), V3(10.5, 0.8, 14.5)]), 60, 2.0, 14), vesM('#C8343C')); ROOT.add(ICA);
  const JUG = new THREE.Mesh(new THREE.SphereGeometry(3.6, 28, 18), vesM('#4A6FC8')); JUG.position.set(3.6, -9.9, -1.4); JUG.scale.set(0.9, 0.7, 1.0); ROOT.add(JUG);
  const JUG2 = new THREE.Mesh(new THREE.TubeGeometry(cr3([V3(3.6, -11, -1.4), V3(3.8, -14, 0.2), V3(4.0, -17, 1.0)]), 24, 2.6, 12), JUG.material); ROOT.add(JUG2);

  // =================== слуховая труба, пещера, ячейки ===================
  const airM = mphys('#7FD6FF', { r: 0.3, cc: 0.4, em: 0.18, side: THREE.DoubleSide, op: 0.55 }), airS = mphys('#7FD6FF', { r: 0.3, em: 0.12, op: 0.3, side: THREE.DoubleSide });
  const AIR = new THREE.Group(); ROOT.add(AIR);
  const tubePts = (child) => { const L = child ? 18 : 36, d = child ? V3(0.69, -0.18, 0.7).normalize() : V3(0.58, -0.57, 0.58).normalize(), d2 = d.clone().add(V3(0.08, -0.05, 0.1)).normalize();
    return Array.from({ length: 7 }, (_, k) => { const t = k / 6, p = TUB0.clone().addScaledVector(d, L * t * 0.5).addScaledVector(d2, L * t * 0.5); if (k === 0) p.z -= 0.3; return p; }); };
  let TUBC = cr3(tubePts(false)), tubeMesh = null, ostium = null, tvp = null, tvpM = mphys('#E8505E', { r: 0.5, em: 0.1 }), tubeOpenR = -1;
  const tubeR = (u, op) => (u < 0.33 ? 1.2 - 2.1 * u : u < 0.4 ? 0.5 : (0.5 + 1.9 * sm((u - 0.4) / 0.6)) * (0.32 + 0.68 * op));
  function buildTube(force) {
    const op = Math.round(st.open * 20) / 20; if (!force && op === tubeOpenR) return; tubeOpenR = op;
    if (tubeMesh) { AIR.remove(tubeMesh); tubeMesh.geometry.dispose(); }
    tubeMesh = new THREE.Mesh(taperTube(TUBC, (u) => tubeR(u, op), 90, 14), airM); tubeMesh.userData.pick = 'air'; AIR.add(tubeMesh); if (!pick.includes(tubeMesh)) pick.push(tubeMesh);
  }
  function buildTubeAll() {
    TUBC = cr3(tubePts(st.child)); buildTube(true);
    if (ostium) { AIR.remove(ostium); AIR.remove(tvp); }
    const e = TUBC.getPoint(1), t = TUBC.getTangent(1);
    ostium = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.75, 10, 32), mphys('#D88A90', { r: 0.6, em: 0.08 })); ostium.position.copy(e); ostium.lookAt(e.clone().add(t)); AIR.add(ostium);
    const m = TUBC.getPoint(0.62); tvp = new THREE.Mesh(taperTube(cr3([m.clone().add(V3(-2.6, 3.0, -1.2)), m.clone().add(V3(-3.6, -2, 1.2)), e.clone().add(V3(-4.8, -9, 4.5)), e.clone().add(V3(-4.2, -14, 6))]), (u) => 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, u * 1.05)), 40, 10), tvpM); AIR.add(tvp);
  }
  const ANT = V3(0.4, 7.4, -12.4);
  const antr = new THREE.Mesh(ell3(3.0, 2.6, 3.3, ANT, 24), airS); antr.userData.pick = 'air'; pick.push(antr); AIR.add(antr);
  const adit = new THREE.Mesh(taperTube(cr3([V3(0.6, 7.3, -5.4), V3(0.5, 7.4, -7.8), V3(0.45, 7.4, -9.6)]), () => 1.3, 16, 12), airS); adit.userData.pick = 'air'; pick.push(adit); AIR.add(adit);
  const cellM = mphys('#7FD6FF', { r: 0.3, em: 0.1, op: 0.16, side: THREE.DoubleSide }), cells = new THREE.Group(); AIR.add(cells);
  for (let k = 0; k < 34; k++) { const p = V3(-3.5 + 7 * rnd(), -8 + 13 * rnd(), -12 - 8 * rnd()); if (p.distanceTo(ANT) < 3.6) continue; const c = new THREE.Mesh(new THREE.SphereGeometry(0.45 + 0.6 * rnd(), 12, 8), cellM); c.position.copy(p); cells.add(c); }
  buildTubeAll();
  // пузырьки воздуха в трубе (при открытии)
  const NB = 18, BP = new THREE.InstancedMesh(new THREE.SphereGeometry(0.4, 10, 8), new THREE.MeshBasicMaterial({ color: 0xcff4ff, transparent: true, opacity: 0.9 }), NB); BP.frustumCulled = false; ROOT.add(BP);
  // наружный слуховой проход (для отоскопии)
  const canalM = mphys('#B07868', { r: 0.75, em: 0.03, side: THREE.DoubleSide });
  const canalG = new THREE.CylinderGeometry(1, 1, 1, 48, 12, true); { const p = canalG.attributes.position, v = V3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const ph = Math.atan2(v.z, v.x), t = v.y + 0.5; const q = V3().addScaledVector(aD, RA * 1.03 * Math.cos(ph)).addScaledVector(uD, RB * 1.03 * Math.sin(ph)).addScaledVector(nD, 13 * t); q.addScaledVector(V3().addScaledVector(aD, Math.cos(ph)).addScaledVector(uD, Math.sin(ph)), 0.8 * t * t - 0.3 * Math.sin(Math.PI * t) + 0.15 * noise3(q.x, q.y, q.z)); p.setXYZ(i, q.x, q.y, q.z); } canalG.computeVertexNormals(); }
  const CANAL = new THREE.Mesh(canalG, canalM); ROOT.add(CANAL);
  const otoL = new THREE.PointLight(0xfff4e0, 0, 60, 1.2); scene.add(otoL);

  // стрелки давления на перепонку (режим «Давление»)
  const ARR = new THREE.Group(); ROOT.add(ARR);
  const ARRP = [[0.2, 0.6], [-2.0, -1.8], [2.2, -1.6], [-1.6, 2.2], [1.9, 2.0]].map(([a, b]) => V3().addScaledVector(aD, a).addScaledVector(uD, b));
  const arrM = new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0.92, depthTest: false });
  const shG = new THREE.CylinderGeometry(0.32, 0.32, 1, 10); shG.translate(0, 0.5, 0); const hdG = new THREE.ConeGeometry(0.9, 1.8, 14); hdG.translate(0, 0.9, 0);
  ARRP.forEach(() => { const g = new THREE.Group(), sh = new THREE.Mesh(shG, arrM), hd = new THREE.Mesh(hdG, arrM); sh.renderOrder = hd.renderOrder = 8; g.add(sh, hd); g.userData = { sh, hd }; ARR.add(g); });
  const qA = new THREE.Quaternion();
  function updArrows() {
    const d = st.mode === 'prs' ? dP() : 0, L = Math.min(1, Math.abs(d) / 90); ARR.visible = L > 0.06;
    if (!ARR.visible) return; const dir = d > 0 ? nD.clone().negate() : nD.clone(), len = 2.5 + 6 * L; qA.setFromUnitVectors(V3(0, 1, 0), dir); arrM.color.set(d > 0 ? 0xffd36b : 0x9fe0ff);
    ARR.children.forEach((g, i) => { const tip = ARRP[i].clone().addScaledVector(nD, d > 0 ? 0.6 : -0.6), base = tip.clone().addScaledVector(dir, -(len + 1.8)); g.position.copy(base); g.quaternion.copy(qA); g.userData.sh.scale.set(1, len, 1); g.userData.hd.position.y = len; });
  }

  // =================== виды ===================
  const CC = V3(2.0, 1.6, 0);
  const VP = DK ? { lat: [CC, V3(-1, 0.32, 0.38), 76, 8.4, -0.2], ant: [CC, V3(-0.3, 0.22, 1), 72, 8, -0.2], med: [CC, V3(1, 0.3, -0.35), 76, 8.4, -0.2],
      snd: [V3(1.6, 3.4, 0), V3(-0.35, 0.2, 1), 44, 4.8, -1.2], oto: [V3(0, 0, 0), nD, 25, 2.8, -0.3], prs: [V3(6, -5, 8), V3(-0.75, 0.75, 0.35), 76, 11.5, 0.5] }
    : { lat: [CC, V3(-1, 0.32, 0.38), 52, 0, -1.6], ant: [CC, V3(-0.3, 0.22, 1), 50, 0, -1.6], med: [CC, V3(1, 0.3, -0.35), 52, 0, -1.6],
      snd: [V3(1.6, 3.4, 0), V3(-0.35, 0.2, 1), 34, 0, -0.8], oto: [V3(0, 0, 0), nD, 27, 0, -0.6], prs: [V3(6, -6, 9), V3(-0.75, 0.75, 0.35), 90, 0, -1] };
  const VIEW = {}; Object.entries(VP).forEach(([k, a]) => { VIEW[k] = vw(...a); });
  const HIDE = { lat: [], ant: ['ant'], med: ['med'], snd: ['ant', 'roof', 'floor', 'post', 'lat'], oto: [], prs: [] };
  const curView = () => (st.mode === 'cav' ? st.view : st.mode === 'snd' ? 'snd' : st.mode === 'oto' ? 'oto' : 'prs');
  function applyView() { st.fly = VIEW[curView()]; }
  camera.position.copy(VIEW.lat.pos); controls.target.copy(VIEW.lat.target);

  // =================== видимость и подсветка ===================
  const partOf = (id) => (id.startsWith('w:') ? 'wall' : id);
  function colorAll() {
    const v = curView(), cav = st.mode === 'cav', oto = st.mode === 'oto', prs = st.mode === 'prs';
    ME_WALL.forEach((w) => { const on = !HIDE[v].includes(w.id) && !oto && !(prs && w.id !== 'med' && w.id !== 'lat'); W[w.id].visible = on || (oto && w.id === 'med');
      const sel = cav && st.wall === w.id, dim = cav && (st.sel || (st.wall && !sel)); const m = wallM[w.id];
      setOp(m, oto ? 0.9 : sel ? 0.62 : dim ? 0.1 : w.id === 'med' ? 0.42 : prs ? 0.16 : w.id === 'lat' && v === 'lat' ? 0.08 : 0.2); m.emissiveIntensity = sel ? 0.42 : 0.04; });
    const pOn = (id) => !cav || ((!st.sel || st.sel === id) && !st.wall);
    bonM.emissiveIntensity = cav && st.sel === 'oss' ? 0.32 : 0.06; setOp(bonM, pOn('oss') ? 1 : 0.18);
    [musM.tt, musM.sp, tenM].forEach((m) => { setOp(m, pOn('mus') ? 1 : 0.15); m.emissiveIntensity = cav && st.sel === 'mus' ? 0.4 : m.userData.em0; });
    [nvM, nvM2, ixM].forEach((m) => { setOp(m, pOn('nrv') ? 1 : 0.15); m.emissiveIntensity = cav && st.sel === 'nrv' ? 0.45 : m.userData.em0; });
    setOp(airM, pOn('air') ? (prs ? 0.7 : 0.55) : 0.12); setOp(airS, pOn('air') ? 0.3 : 0.08); airM.emissiveIntensity = cav && st.sel === 'air' ? 0.4 : 0.18;
    AIR.visible = !oto && (cav || prs); ICA.visible = JUG.visible = JUG2.visible = cav || prs; fcanal.visible = !oto; [...NM, ...MUSL, ggM].forEach((m) => { m.visible = !oto; });
    [ostium, tvp].forEach((m) => { m.visible = prs || (cav && st.sel === 'air'); });
    cells.visible = cav && st.sel === 'air'; CANAL.visible = oto; otoL.intensity = oto ? 45 : 0;
    const showDrum = !(cav && !st.drum); DRUM.visible = ann.visible = showDrum;
    const o = ME_OTO.find((x) => x.id === st.oto);
    setOp(drumM, oto ? o.op : cav && st.wall === 'lat' ? 0.7 : cav && (st.sel || st.wall) ? 0.22 : st.mode === 'snd' ? 0.35 : 0.5);
    drumM.emissiveIntensity = cav && st.wall === 'lat' ? 0.3 : 0.05; drumM.emissive.set(cav && st.wall === 'lat' ? '#F0C8A8' : '#3a3430');
    cCond.set(oto ? o.col : '#C9C4BC'); const pf = oto && st.oto === 'perf'; if (pf !== perfOn) { perfOn = pf; dGeo.setIndex(pf ? IDX1 : IDX0); }
    CONE.visible = oto && o.cone > 0; coneM.opacity = 0.9 * o.cone; QUAD.visible = oto && st.quad; FLUID.visible = BUB.visible = oto && st.oto === 'ome';
    updateDrum(true);
  }

  // =================== анимация ===================
  const qC = new THREE.Quaternion(), qS = new THREE.Quaternion(), mtx = new THREE.Matrix4(), dum = new THREE.Object3D();
  const bubs = Array.from({ length: NB }, (_, i) => ({ u: i / NB, on: 0 }));
  const DPMAX = 150, dP = () => DPMAX * st.desc - st.pMid;
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot && !st.fly && st.mode !== 'oto'; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt);
    const k = 1 - Math.exp(-dt * 3);
    let ud = 0, bul = 0, ref = 0;
    if (st.mode === 'snd') { const L = 40 + 80 * st.loud; ref = sm((L - 82) / 12); st.phase += dt * 2 * Math.PI * 1.1; ud = 0.55 * (0.25 + 0.75 * st.loud) * (1 - 0.55 * ref) * Math.sin(st.phase); }
    if (st.mode === 'oto') { const o = ME_OTO.find((x) => x.id === st.oto); ud = o.ud; bul = o.bul; }
    if (st.mode === 'prs') {
      if (st.openT > 0) { st.openT -= dt; st.pMid += (DPMAX * st.desc - st.pMid) * (1 - Math.exp(-dt * 7)); }
      else if (dP() < -18) { st.openT = 0.4; }   // при подъёме лишний воздух выходит сам
      st.open += ((st.openT > 0 ? 1 : 0) - st.open) * (1 - Math.exp(-dt * 10)); buildTube();
      const d = dP(); ud = 0.026 * d; bul = 0.012 * d;
    } else if (st.open > 0.001) { st.open = 0; buildTube(); }
    st.ref += (ref - st.ref) * k;
    if (st.mode === 'snd') st.ud = ud; else st.ud += (ud - st.ud) * k;
    st.bul += (bul - st.bul) * k;
    const th = st.ud / kU; qC.setFromAxisAngle(AX, th); CH.quaternion.copy(qC);
    STP.position.copy(SH).addScaledVector(SD, th * kL); qS.setFromAxisAngle(V3(0, 1, 0), -0.14 * st.ref); STP.quaternion.copy(qS);
    const r = st.mode === 'snd' ? st.ref : st.sel === 'mus' && st.mode === 'cav' ? 0.5 + 0.5 * Math.sin(st.t * 3) : 0;
    musM.sp.emissiveIntensity = 0.1 + 0.6 * r; musM.tt.emissiveIntensity = 0.1 + 0.3 * r; SPM.scale.setScalar(1);
    if (st.mode === 'prs') tvpM.emissiveIntensity = 0.1 + 0.7 * st.open;
    updateDrum();
    // пузырьки
    let n = 0; bubs.forEach((b) => { if (st.mode === 'prs' && st.open > 0.3) { b.u += dt * 0.8 * (dP() > 0 ? -1 : 1) * 0 + dt * 0.9; if (b.u > 1) b.u -= 1; b.on = Math.min(1, b.on + dt * 3); } else b.on = Math.max(0, b.on - dt * 3);
      const s = b.on * (0.6 + 0.4 * Math.sin(b.u * 9)); const u = dP() < -1 ? b.u : 1 - b.u; dum.position.copy(TUBC.getPoint(cl(u, 0.02, 0.98))); dum.scale.setScalar(Math.max(1e-4, s)); dum.updateMatrix(); BP.setMatrixAt(n++, dum.matrix); });
    BP.instanceMatrix.needsUpdate = true;
    if (st.mode === 'oto') { otoL.position.copy(camera.position); }
    updArrows();
  }

  // =================== выбор ===================
  function setMode(m) { st.mode = m; st.msg = null; colorAll(); applyView(); refs.modeSeg && refs.modeSeg.sync(); refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setView(v) { st.view = v; colorAll(); applyView(); refs.vseg && refs.vseg.sync(); }
  function setPart(id) { st.sel = id === 'all' || st.sel === id ? null : id; st.wall = null; colorAll(); refs.pseg && refs.pseg.sync(); refs.wseg && refs.wseg.sync(); refs.setInfo && refs.setInfo(); }
  function setWall(id) { st.wall = id === 'all' || st.wall === id ? null : id; st.sel = null;
    if (st.wall && HIDE[st.view].includes(st.wall)) { st.view = st.wall === 'med' ? 'lat' : 'lat'; applyView(); refs.vseg && refs.vseg.sync(); }
    colorAll(); refs.pseg && refs.pseg.sync(); refs.wseg && refs.wseg.sync(); refs.setInfo && refs.setInfo(); }
  function setOto(id) { st.oto = id; colorAll(); refs.oseg && refs.oseg.sync(); refs.setInfo && refs.setInfo(); }
  function swallow(force) { if (dP() > 90 && !force) { st.msg = 'lock'; } else { st.openT = force ? 0.9 : 0.55; st.msg = force ? 'vals' : null; } refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, () => pick.filter((m) => m.visible !== false), (id) => {
    if (st.mode !== 'cav') return;
    if (id.startsWith('w:')) setWall(id.slice(2)); else setPart(id);
  });

  // =================== подписи ===================
  const lb = (text, pos, color, show, left) => ({ text, pos, color, left, show: () => st.labels && show() });
  const cav = () => st.mode === 'cav', snd = () => st.mode === 'snd', oto = () => st.mode === 'oto', prs = () => st.mode === 'prs';
  const pOn = (id, dk) => () => cav() && !st.wall && (st.sel === id || (!st.sel && (!dk || DK)));
  const wOn = (id) => () => cav() && st.wall === id;
  const at = (p) => () => { const v = p.clone(); return CH.localToWorld(v.sub(A0).add(A0).sub(A0)); };
  const wp = (p) => () => CH.localToWorld(rest(p));
  const labels = [
    lb('молоточек', wp(MH.clone().add(V3(-0.6, 0.9, 0.6))), '#F2E6C8', () => pOn('oss')() || snd()),
    lb('наковальня', wp(IB.clone().add(V3(0.3, 0.6, -0.9))), '#F2E6C8', () => pOn('oss')() || snd(), true),
    lb('стремечко', () => STP.localToWorld(FP.clone().lerp(SH, 0.5).sub(SH).add(V3(0, 0.9, 0))), '#F2E6C8', () => pOn('oss')() || snd()),
    lb('рукоятка молоточка', wp(HP[5].clone().addScaledVector(nD, 0.3)), '#F2E6C8', () => (cav() && st.sel === 'oss') || (oto() && st.oto === 'norm'), true),
    lb('пупок перепонки', () => UMB.clone().addScaledVector(nD, 0.3).add(V3(0, -0.2, 0)), '#F2E6C8', () => oto() && (st.oto === 'norm' || st.oto === 'retr')),
    lb('короткий отросток', wp(LPP.clone().addScaledVector(nD, 0.4)), '#F2E6C8', () => oto() && (st.oto === 'norm' || st.oto === 'retr')),
    lb('ненатянутая часть', () => dPos(-0.3, 4.15, 0.9).addScaledVector(nD, 0.2), '#E8B4A8', () => oto() && st.oto === 'norm', true),
    lb('натянутая часть', () => dPos(-2.6, -0.8, 0.55).addScaledVector(nD, 0.2), '#E8E2D8', () => oto() && st.oto === 'norm', true),
    lb('световой конус', () => { const [a, b] = abOf(0.72, -0.62); return dPos(a, b, 0.72).addScaledVector(nD, 0.2); }, '#FFF4D8', () => oto() && st.oto === 'norm'),
    lb('уровень жидкости', () => dPos(2.8, -1.15, 0.8).addScaledVector(nD, 0.2), '#E8C890', () => oto() && st.oto === 'ome'),
    lb('пузырьки воздуха', () => dPos(-1.6, -2.4, 0.6).addScaledVector(nD, 0.2), '#E8C890', () => oto() && st.oto === 'ome', true),
    lb('отверстие', () => dPos(PERF[0] + 0.5, PERF[1] - 0.9, 0.7).addScaledVector(nD, 0.2), '#E8A0A0', () => oto() && st.oto === 'perf'),
    lb('мыс (медиальная стенка)', () => V3(MX(-1.2, 1.0), -1.2, 1.0), '#E8A0A0', () => oto() && st.oto === 'perf', true),
    lb('передний квадрант', () => dPos(2.6, 0.4, 0.6).addScaledVector(nD, 0.2), '#9FE0FF', () => oto() && st.quad),
    lb('задний квадрант', () => dPos(-2.6, 0.4, 0.6).addScaledVector(nD, 0.2), '#9FE0FF', () => oto() && st.quad, true),
    lb('мышца, напрягающая перепонку', () => TTS.getPoint(0.45), '#F08A8A', () => (cav() && st.sel === 'mus' && !st.wall) || (snd() && DK)),
    lb('стременная мышца', () => SP0.clone().lerp(PYR, 0.45), '#F08A8A', () => (cav() && st.sel === 'mus' && !st.wall) || snd(), true),
    lb('лицевой нерв (VII)', () => FCP[6].clone(), '#F4C542', pOn('nrv')),
    lb('коленце', () => GG.clone(), '#F4C542', () => cav() && st.sel === 'nrv'),
    lb('барабанная струна', () => CHT[3].clone().add(V3(0, 0.2, 0)), '#F4C542', () => cav() && st.sel === 'nrv' && !st.wall, true),
    lb('барабанное сплетение (IX)', () => PRS(-2.4, 0.6), '#E8D070', () => cav() && st.sel === 'nrv'),
    lb('слуховая труба', () => TUBC.getPoint(cav() ? 0.18 : 0.52), '#9FE0FF', () => pOn('air', true)() || prs()),
    lb('сосцевидная пещера', () => ANT.clone().add(V3(0, 2.2, 0)), '#9FE0FF', () => pOn('air', true)() || (prs() && DK), true),
    lb('ячейки сосцевидного отростка', () => V3(0, -3, -16), '#9FE0FF', () => cav() && st.sel === 'air', true),
        lb('перешеек', () => TUBC.getPoint(0.36), '#9FE0FF', () => prs() && DK && !st.child, true),
    lb('хрящевая часть', () => TUBC.getPoint(0.66), '#9FE0FF', () => prs() && DK && !st.child, true),
    lb('глоточное отверстие', () => TUBC.getPoint(1), '#E8A0A8', () => prs() || (cav() && st.sel === 'air')),
    lb('мышца, напрягающая нёбную занавеску', () => (tvp ? TUBC.getPoint(0.85).add(V3(-4.4, -6, 3)) : V3()), '#F08A8A', () => prs(), true),
    lb('барабанная перепонка', () => dPos(-2.6, -2.0, 0.6).addScaledVector(nD, 0.5), '#E8E2D8', () => (cav() && !st.sel && !st.wall && st.drum && DK) || prs() || snd(), true),
    lb('внутренняя сонная артерия', () => V3(6.0, -6, 9.0), '#F08A8A', () => wOn('ant')() || (cav() && !st.sel && !st.wall && DK)),
    lb('луковица яремной вены', () => V3(3.6, -12.4, 1.6), '#9CB8FF', () => wOn('floor')() || (cav() && !st.sel && !st.wall && DK), true),
    lb('мыс', () => V3(MX(-1.2, 0.6), -1.2, 0.6), '#E8A0A0', wOn('med')),
    lb('овальное окно', () => FP.clone().add(V3(0, 1.2, 0)), '#E8A0A0', wOn('med')),
    lb('круглое окно', () => RW.clone().add(V3(-0.2, -0.8, 0)), '#E8A0A0', wOn('med'), true),
    lb('канал лицевого нерва', () => V3(5.0, 4.6, -3.6), '#F4C542', wOn('med')),
    lb('выступ латерального канала', () => V3(MX(6.4, -3.2), 6.4, -3.2), '#E8A0A0', wOn('med'), true),
    lb('вход в пещеру', () => V3(0.4, 7.2, Z0), '#A8E0B0', wOn('post'), true),
    lb('пирамидальное возвышение', () => PYR.clone().add(V3(0, -0.6, 1)), '#A8E0B0', wOn('post')),
    lb('вход в трубу', () => TUB0.clone(), '#F08A8A', wOn('ant'), true),
    lb('полуканал мышцы-напрягателя', () => V3(4.2, 1.9, Z1), '#F08A8A', wOn('ant')),
    lb('средняя черепная ямка', () => V3(1.2, Y1 + 1.4, 0), '#C9B8F0', wOn('roof')),
    lb('надбарабанный карман', () => V3(-1.2, 7.4, 2.0), '#F0C8A8', wOn('lat'), true),
    lb('барабанная перепонка', () => dPos(-2.6, -2.0, 0.6).addScaledVector(nD, 0.5), '#F0C8A8', wOn('lat')),
    lb('×1,3 рычаг', () => CH.localToWorld(rest(LEN).add(V3(0.2, 0, 0))), '#9FE0FF', () => snd() && DK, true),
    lb('площадь ×17', () => dPos(2.5, -2.6, 0.6).addScaledVector(nD, 0.4), '#9FE0FF', () => snd() && DK),
  ];
  labels.forEach((l) => { if (typeof l.pos === 'function') { const f = l.pos; Object.defineProperty(l, 'pos', { get: f }); } });

  // =================== панель ===================
  const INTRO = '<b>Барабанная полость</b> — щель объёмом ≈ 1 см³ между барабанной перепонкой и внутренним ухом, заполненная воздухом. По форме это узкий бубен высотой ≈ 15 мм и глубиной 2–6 мм (у пупка перепонки до мыса всего ≈ 2 мм). В ней цепь из трёх косточек, две мышцы и барабанная струна. Выберите часть или одну из шести стенок — у каждой свои соседи.';
  const INTRO_S = '<b>Зачем нужны косточки.</b> Из воздуха в жидкость внутреннего уха звук почти весь отразился бы. Перепонка (≈ 55 мм²) собирает давление на основание стремечка (≈ 3,2 мм²) — площадь в 17 раз меньше, а рычаг косточек добавляет ×1,3. Всего давление растёт ≈ в 22 раза (≈ 27 дБ). Прибавьте громкость: выше ≈ 85 дБ включается рефлекс.';
  const REFL = '<b>Акустический рефлекс.</b> На громкий звук стременные мышцы обеих сторон сокращаются за 25–150 мс: тянут стремечко назад и делают цепь жёстче, ослабляя низкие частоты на 10–20 дБ. Это защита от долгого шума, но выстрел быстрее рефлекса. При параличе лицевого нерва обычные звуки кажутся болезненно громкими (гиперакузия).';
  const INTRO_P = '<b>Давление по обе стороны перепонки.</b> Воздух в полости всасывается слизистой, и пополняет его только слуховая труба. Она сомкнута и раскрывается на доли секунды при глотании и зевании — её открывает мышца, напрягающая нёбную занавеску. При снижении самолёта перепонку вдавливает внутрь. Двигайте ползунок и нажмите «Сглотнуть».';
  const CHILD = '<b>У ребёнка</b> слуховая труба вдвое короче (≈ 18 мм), шире и почти горизонтальна, а её хрящ мягче. Слизь и микробы из носоглотки легко попадают в среднее ухо, поэтому отиты у детей так часты. К 7 годам труба вытягивается и наклоняется.';
  const LOCK = '<b>Труба «заперта».</b> При перепаде больше ≈ 90 мм рт. ст. стенки трубы прижаты, и глоток её уже не раскрывает. Помогает приём Вальсальвы — мягкий выдох с закрытым ртом и зажатым носом. Лучше глотать и зевать с самого начала снижения; при насморке приём опасен — слизь попадёт в ухо.';
  const VALS = '<b>Приём Вальсальвы.</b> Выдох с закрытым ртом и зажатым носом повышает давление в носоглотке, и воздух прорывается в трубу. Давление выровнялось — перепонка встала на место. Дуть надо мягко: резкий выдох может повредить перепонку и окна внутреннего уха.';
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px'); if (DK) ib.info.style.minHeight = '8.2em';
    refs.setInfo = () => {
      if (st.mode === 'cav') { const p = ME_PART.find((x) => x.id === st.sel), w = ME_WALL.find((x) => x.id === st.wall); ib.info.innerHTML = p ? p.text : w ? w.text : INTRO; return; }
      if (st.mode === 'snd') { ib.info.innerHTML = st.loud * 80 + 40 > 85 ? REFL : INTRO_S; return; }
      if (st.mode === 'oto') { ib.info.innerHTML = ME_OTO.find((o) => o.id === st.oto).text; return; }
      ib.info.innerHTML = st.msg === 'lock' ? LOCK : st.msg === 'vals' ? VALS : st.child ? CHILD : INTRO_P;
    };
    refs.modeSeg = seg([{ id: 'cav', label: 'Полость' }, { id: 'snd', label: 'Звук' }, { id: 'oto', label: 'Отоскоп' }, { id: 'prs', label: 'Давление' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 520px' }), view = h('div', { class: 'gctl' });
    refs.rebuild = () => {
      box.innerHTML = ''; view.innerHTML = ''; refs.pseg = refs.wseg = refs.vseg = refs.oseg = null;
      if (st.mode === 'cav') {
        refs.pseg = seg([{ id: 'all', label: 'Все' }, ...ME_PART.map((p) => ({ id: p.id, label: p.name, color: p.col }))], () => (st.wall ? '' : st.sel || 'all'), (v) => setPart(v));
        refs.wseg = seg(ME_WALL.map((w) => ({ id: w.id, label: w.name, color: w.col })), () => st.wall || '', (v) => setWall(v));
        refs.vseg = seg([{ id: 'lat', label: 'Снаружи' }, { id: 'ant', label: 'Спереди' }, { id: 'med', label: 'Изнутри' }], () => st.view, (v) => setView(v));
        box.append(h('div', { class: 'glabel' }, 'Часть', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.pseg), h('div', { class: 'glabel', style: 'margin-top:6px' }, 'Стенка'), h('div', { class: 'gctl' }, refs.wseg));
        view.append(refs.vseg, toggle('Перепонка', () => st.drum, (v) => { st.drum = v; colorAll(); }), refs.rot);
      } else if (st.mode === 'snd') {
        box.append(h('div', { class: 'glabel' }, 'Громкость'), h('div', { class: 'gctl' }, range('meLoud', 0, 1, 0.01, () => st.loud, (v) => { const was = st.loud * 80 + 40 > 85; st.loud = v; if (was !== v * 80 + 40 > 85) refs.setInfo(); }, (v) => Math.round(40 + 80 * v) + ' дБ')));
        view.append(refs.rot);
      } else if (st.mode === 'oto') {
        refs.oseg = seg(ME_OTO.map((o) => ({ id: o.id, label: o.name })), () => st.oto, (v) => setOto(v));
        box.append(h('div', { class: 'glabel' }, 'Перепонка'), h('div', { class: 'gctl' }, refs.oseg));
        view.append(toggle('Квадранты', () => st.quad, (v) => { st.quad = v; colorAll(); }));
      } else {
        box.append(h('div', { class: 'glabel' }, 'Высота самолёта'), h('div', { class: 'gctl' }, range('meDesc', 0, 1, 0.01, () => st.desc, (v) => { st.desc = v; }, (v) => `${Math.round(2400 * (1 - v))} м`),
          button('Сглотнуть', () => swallow(false), true), button('Вальсальва', () => swallow(true))));
        view.append(toggle('Ребёнок', () => st.child, (v) => { st.child = v; st.msg = null; buildTubeAll(); colorAll(); refs.setInfo(); }), refs.rot);
      }
      view.append(refs.lab);
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    refs.lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    el.append(group('Режим', '1–4', refs.modeSeg), box, h('div', { class: 'grp' }, h('div', { class: 'glabel' }, 'Вид', h('kbd', {}, 'V · N')), view), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { setMode(['cav', 'snd', 'oto', 'prs'][n - 1]); return true; }
    if (e.key === 'Escape') { if (st.mode === 'cav') setPart('all'); else if (st.mode === 'oto') setOto('norm'); return true; }
    if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if ((k === 'v' || k === 'м') && st.mode === 'cav') { const L = ['lat', 'ant', 'med']; setView(L[(L.indexOf(st.view) + 1) % 3]); return true; }
    if ((k === 'r' || k === 'к') && st.mode !== 'oto') { refs.rot.click(); return true; }
    if ((k === ' ' || k === 'g' || k === 'п') && st.mode === 'prs') { swallow(false); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'cav') return [['Объём полости', '≈ 1', 'см³'], ['Косточек', 3, '']];
    if (st.mode === 'snd') return [['Громкость', Math.round(40 + 80 * st.loud), 'дБ'], ['Рефлекс', st.ref > 0.3 ? 'есть' : 'нет', '']];
    if (st.mode === 'oto') return [['Перепонка', '9 × 10', 'мм'], ['Толщина', '0,1', 'мм']];
    return [['Перепад', Math.round(Math.abs(dP())), 'мм рт. ст.'], ['Труба', st.open > 0.4 ? 'открыта' : 'сомкнута', '']];
  }
  const self = {
    labelBg: true, mobZoom: 0.9, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null,
    get accent() { return st.mode === 'cav' ? (st.sel ? ME_PART.find((p) => p.id === st.sel).col : st.wall ? ME_WALL.find((w) => w.id === st.wall).col : '#F2E6C8') : st.mode === 'snd' ? '#9FE0FF' : st.mode === 'oto' ? '#E8B4A8' : '#7FD6FF'; },
    kicker: 'Тело · системы органов', title: 'Среднее ухо',
    lede: 'Три косточки размером с рисовое зерно не дают звуку отразиться от жидкости внутреннего уха, две крошечные мышцы гасят грохот, а слуховая труба выравнивает давление, когда мы глотаем.',
    notes: `
      <div><h2>Устройство</h2>
        <p>Среднее ухо — воздухоносная полость в височной кости между наружным слуховым проходом и внутренним ухом. В ней три отдела: надбарабанный карман с головкой молоточка и телом наковальни, средний отдел напротив перепонки и нижний карман над луковицей яремной вены. Полость выстлана слизистой и связана с носоглоткой слуховой трубой, а сзади — с воздухоносными ячейками сосцевидного отростка.</p>
        <p>Косточки соединены настоящими суставами и подвешены на связках. Молоточек и наковальня качаются как одно целое вокруг оси, проходящей через передний отросток молоточка и короткий отросток наковальни; стремечко при этом двигается в овальном окне как поршень.</p></div>
      <div><h2>Как это работает</h2>
        <p>Без среднего уха из воздуха в жидкость улитки прошла бы лишь ≈ 0,1 % звуковой энергии. Перепонка большой площади и рычаг косточек сводят давление на маленькое овальное окно и усиливают его ≈ в 22 раза. Круглое окно выгибается в обратную сторону и даёт жидкости улитки место для движения.</p>
        <p>Слуховая труба вентилирует полость и выравнивает давление. Нёбные мышцы раскрывают её при глотании и зевании, в покое она сомкнута — иначе человек слышал бы своё дыхание и голос слишком громко.</p></div>
      <div><h2>Медицина</h2><ul>
        <li><b>Средний отит</b> — самая частая причина визитов к врачу у маленьких детей. Острый отит обычно проходит сам или после антибиотиков; осложнения — перфорация, мастоидит, редко менингит.</li>
        <li><b>Экссудативный отит</b> — жидкость за перепонкой и снижение слуха без боли. Если он держится месяцами, ставят шунты для вентиляции, а иногда удаляют аденоиды, которые закрывают устья труб.</li>
        <li><b>Отосклероз</b> — разрастание кости вокруг основания стремечка, которое перестаёт двигаться. Слух снижается постепенно; помогает операция — стремечко заменяют протезом.</li>
        <li><b>Холестеатома</b> — «карман» кожи, врастающий в полость, обычно из ненатянутой части перепонки. Он медленно разрушает косточки и стенки, поэтому его удаляют хирургически.</li>
        <li><b>Паралич лицевого нерва (Белла)</b>: нерв отекает в узком канале. Кроме лица страдают вкус (барабанная струна) и стременная мышца — звуки кажутся слишком громкими.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Полость увеличена ≈ в 5 раз, стенки показаны полупрозрачными пластинами без толщины; слизистая, связки косточек, складки и сосуды полости не показаны. Колебания косточек преувеличены во много тысяч раз (на деле — доли микрометра) и замедлены. Пропорции полости схематичны (на деле она уже), числа давления приблизительны.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> режим · <code>Esc</code> сбросить выбор</li><li><code>V</code> вид · <code>R</code> вращение · <code>N</code> подписи · <code>G</code> сглотнуть</li></ul></div>`
  };
  colorAll(); updateDrum(true);
  return self;
}
export { makeMidEar };
