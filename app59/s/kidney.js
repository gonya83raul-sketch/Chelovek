import { Sparks, THREE, V3, __set_rnd, bodyShell, button, dimOthers, displaceGeo, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mulberry, organMat, pathRunner, pickOn, rand, randUnit, rnd, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ПОЧКИ И МОЧЕВЫДЕЛЕНИЕ
   ========================================================= */
const KD_PARTS = [
  { id: 'kid', name: 'Почки', color: '#B85A50', text: '<b>Почки</b> — парные органы бобовидной формы (10–12 см, 150 г) у задней стенки живота на уровне XII грудного — II поясничного позвонков; правая чуть ниже из-за печени. Через них проходит ~1,2 л крови в минуту — четверть всего выброса сердца. Они очищают кровь, держат постоянными объём воды, соли и кислотность, выделяют гормоны (ренин, эритропоэтин).' },
  { id: 'adr', name: 'Надпочечники', color: '#F2C14E', text: '<b>Надпочечники</b> сидят «шапочками» на почках, но это эндокринные железы: кора выделяет кортизол и альдостерон (задерживает натрий и воду), мозговое вещество — адреналин и норадреналин.' },
  { id: 'ves', name: 'Сосуды', color: '#C86070', text: '<b>Почечные артерии</b> отходят прямо от аорты под высоким давлением — это нужно для фильтрации. <b>Почечные вены</b> несут очищенную кровь в нижнюю полую вену.' },
  { id: 'ure', name: 'Мочеточники', color: '#E8D8A0', text: '<b>Мочеточники</b> — трубки по 25–30 см. Моча идёт по ним не самотёком, а волнами перистальтики, порциями каждые 10–20 секунд.' },
  { id: 'blad', name: 'Мочевой пузырь', color: '#E8C890', text: '<b>Мочевой пузырь</b> — мышечный мешок. При заполнении 200–300 мл рецепторы растяжения посылают сигнал в спинной мозг и кору — появляется позыв; вмещает до 500–700 мл. Опорожнение — рефлекс, который с 2–3 лет человек учится контролировать (наружный сфинктер произвольный).' },
];
function kidneyCanvas() {
  const W = 512, H = 800, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const S = W / 1.6, X = (x) => W / 2 + x * S, Y = (y) => H / 2 - y * S;
  g.fillStyle = '#d8c890'; g.fillRect(0, 0, W, H);
  const bean = (k) => { g.beginPath(); for (let i = 0; i <= 200; i++) { const a = i / 200 * Math.PI * 2; let x = Math.cos(a) * 0.7 * k, y = Math.sin(a) * 1.1 * k; if (x < 0) x += 0.28 * k * Math.exp(-((y / (0.38 * k)) ** 2)); i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y)); } g.closePath(); };
  bean(1); g.fillStyle = '#e8dcd0'; g.fill();
  bean(0.97); g.fillStyle = '#8a3a34'; g.fill();          // кора
  // пирамиды мозгового вещества
  const PY = 8; const pyr = [];
  for (let i = 0; i < PY; i++) { const a = -Math.PI * 0.62 + i / (PY - 1) * Math.PI * 1.24; const ox = Math.cos(a) * 0.52, oy = Math.sin(a) * 0.86, tip = V3(-0.18 + Math.cos(a) * 0.12, Math.sin(a) * 0.42, 0); pyr.push({ a, ox, oy, tip });
    const px = -Math.sin(a), py = Math.cos(a), wd = 0.16;
    const grd = g.createLinearGradient(X(ox), Y(oy), X(tip.x), Y(tip.y)); grd.addColorStop(0, '#6a2a2a'); grd.addColorStop(1, '#a85048');
    g.fillStyle = grd; g.beginPath(); g.moveTo(X(ox + px * wd), Y(oy + py * wd * 1.2)); g.quadraticCurveTo(X(ox * 1.08), Y(oy * 1.08), X(ox - px * wd), Y(oy - py * wd * 1.2)); g.lineTo(X(tip.x), Y(tip.y)); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(40,10,10,.35)'; g.lineWidth = 1; for (let k = -4; k <= 4; k++) { g.beginPath(); g.moveTo(X(ox + px * wd * k / 5), Y(oy + py * wd * 1.2 * k / 5)); g.lineTo(X(tip.x), Y(tip.y)); g.stroke(); }
  }
  // почечный синус (жир), чашечки, лоханка
  g.fillStyle = '#d8c890'; g.beginPath(); g.ellipse(X(-0.42), Y(0), 0.22 * S, 0.5 * S, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#efe0c8'; g.strokeStyle = '#c8b090'; g.lineWidth = 2;
  pyr.forEach((p) => { g.beginPath(); g.ellipse(X(p.tip.x - Math.cos(p.a) * 0.04), Y(p.tip.y - Math.sin(p.a) * 0.04), 0.06 * S, 0.06 * S, 0, 0, Math.PI * 2); g.fill(); g.stroke(); g.lineWidth = 0.05 * S; g.strokeStyle = '#efe0c8'; g.beginPath(); g.moveTo(X(p.tip.x - Math.cos(p.a) * 0.06), Y(p.tip.y - Math.sin(p.a) * 0.06)); g.lineTo(X(-0.45), Y(p.tip.y * 0.4)); g.stroke(); g.lineWidth = 2; g.strokeStyle = '#c8b090'; });
  g.fillStyle = '#efe0c8'; g.beginPath(); g.moveTo(X(-0.35), Y(0.42)); g.quadraticCurveTo(X(-0.62), Y(0.15), X(-0.85), Y(-0.05)); g.lineTo(X(-0.85), Y(-0.15)); g.quadraticCurveTo(X(-0.62), Y(-0.2), X(-0.35), Y(-0.42)); g.closePath(); g.fill();
  // артерии и вены
  const vline = (col, w, pts) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y)))); g.stroke(); };
  pyr.forEach((p, i) => { if (i === PY - 1) return; const q = pyr[i + 1], ma = (p.a + q.a) / 2; const bx = Math.cos(ma) * 0.48, by = Math.sin(ma) * 0.8; vline('#d04848', 3, [[-0.7, 0.05], [-0.3, Math.sin(ma) * 0.3], [bx, by]]); vline('#4a60c0', 3, [[-0.7, -0.05], [-0.32, Math.sin(ma) * 0.3 - 0.03], [bx - 0.02, by - 0.02]]);
    for (let k = 0; k < 4; k++) { const aa = p.a + (q.a - p.a) * (k / 3), r0 = 0.5, r1 = 0.62; vline('#d04848', 1.5, [[Math.cos(aa) * r0, Math.sin(aa) * r0 * 1.6], [Math.cos(aa) * r1, Math.sin(aa) * r1 * 1.6]]); } });
  const img = g.getImageData(0, 0, W, H), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 12; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return { t, S, W, H };
}
function makeKidney() {
  __set_rnd(mulberry(1515));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0xffc080);
  const MOBK = matchMedia('(max-width:700px)').matches;
  const VIEW = { sys: MOBK ? flyTarget(V3(0.0, 0.72, 0), V3(1.15, 1.33, -5.5)) : flyTarget(V3(0.0, 0.55, 0), V3(1.15, 1.16, -5.5)), kid: flyTarget(V3(29.6, -0.55, 0), V3(30.5, 0.3, 6.9)), neph: flyTarget(V3(60.2, -1.0, 0), V3(63.0, 0.5, 12.6)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 120); camera.position.copy(VIEW.sys.pos);
  const controls = makeControls(camera, VIEW.sys.target); controls.minDistance = 1.5; controls.maxDistance = 22;
  const body = new THREE.Group(); scene.add(body);
  bodyShell(body, { rim: 0.36 });
  const PART = Object.fromEntries(KD_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}, parent = body) => { const m = organMat(o.color || PART[id].color, o.k ?? 0.42, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  const beanGeo = (s) => displaceGeo(new THREE.SphereGeometry(1, 48, 36), (v) => { let x = v.x * 0.55, y = v.y, z = v.z * 0.4; if (x * s < 0) x += s * 0.22 * Math.exp(-((y / 0.38) ** 2)) * smooth(0, -0.5, x * s); v.set(x, y, z); });
  const KID = [1, -1].map((s) => ({ s, c: V3(0.45 * s, s > 0 ? 1.02 : 0.94, -0.33) }));
  KID.forEach((K) => { const g = beanGeo(-K.s); g.scale(0.33, 0.3, 0.3); g.rotateZ(-0.15 * K.s); g.translate(K.c.x, K.c.y, K.c.z); add('kid', g, { k: 0.45, mat: { clearcoat: 0.7 } });
    const ad = ell3(0.11, 0.06, 0.06); ad.rotateZ(0.3 * K.s); ad.translate(K.c.x - 0.03 * K.s, K.c.y + 0.33, K.c.z); add('adr', ad, { k: 0.5 }); });  // сначала поворот, потом перенос на верхний полюс
  // аорта и полая вена
  // аорта и полая вена: сверху уходят под диафрагму (сужаются), внизу на уровне L4 делятся на общие подвздошные
  const AO = new THREE.CatmullRomCurve3([V3(0.06, 1.62, -0.36), V3(0.06, 1.0, -0.4), V3(0.06, 0.45, -0.36)]), VC = new THREE.CatmullRomCurve3([V3(-0.1, 1.62, -0.32), V3(-0.1, 1.0, -0.36), V3(-0.1, 0.42, -0.32)]);
  const topTaper = (r) => (u) => r * (0.8 + 0.2 * smooth(0, 0.06, u));   // верх срезан под диафрагмой, а не иглой
  add('ves', taperTube(AO, topTaper(0.05), 30, 12), { color: '#E0605A' }); add('ves', taperTube(VC, topTaper(0.06), 30, 12), { color: '#6C86E0' });
  // концы сосудов под диафрагмой — скруглённые, а не плоский срез
  add('ves', new THREE.SphereGeometry(0.04, 16, 10).translate(AO.getPoint(0).x, AO.getPoint(0).y, AO.getPoint(0).z), { color: '#E0605A' }); add('ves', new THREE.SphereGeometry(0.048, 16, 10).translate(VC.getPoint(0).x, VC.getPoint(0).y, VC.getPoint(0).z), { color: '#6C86E0' });
  [1, -1].forEach((s) => {
    add('ves', taperTube(new THREE.CatmullRomCurve3([V3(0.06, 0.47, -0.36), V3(0.06 + 0.12 * s, 0.3, -0.33), V3(0.3 * s, 0.02, -0.22), V3(0.36 * s, -0.12, -0.12)]), (u) => 0.036 - 0.01 * u, 24, 10), { color: '#E0605A' });
    add('ves', taperTube(new THREE.CatmullRomCurve3([V3(-0.1, 0.44, -0.32), V3(-0.1 + 0.12 * s, 0.26, -0.3), V3(0.27 * s, 0.0, -0.26), V3(0.33 * s, -0.14, -0.16)]), (u) => 0.042 - 0.012 * u, 24, 10), { color: '#6C86E0' });
  });
  const RA = KID.map((K) => new THREE.CatmullRomCurve3([V3(0.06, 1.0, -0.36), K.s < 0 ? V3(-0.12, K.c.y + 0.02, -0.46) : V3(0.25 * K.s, K.c.y + 0.02, -0.36), K.c.clone().add(V3(-0.17 * K.s, 0.02, 0))]));  // правая — позади полой вены
  const RV = KID.map((K) => new THREE.CatmullRomCurve3([K.c.clone().add(V3(-0.17 * K.s, -0.04, 0.02)), V3(0.22 * K.s, K.c.y - 0.05, -0.3), V3(-0.1, 0.96, -0.32)]));
  RA.forEach((c) => add('ves', taperTube(c, () => 0.022, 20, 8), { color: '#E0605A' })); RV.forEach((c) => add('ves', taperTube(c, () => 0.026, 20, 8), { color: '#6C86E0' }));
  // мочеточник почти отвесно по большой поясничной мышце, в малом тазу заходит в пузырь сзади-снизу
  const URE = KID.map((K) => new THREE.CatmullRomCurve3([K.c.clone().add(V3(-0.16 * K.s, -0.1, 0.0)), V3(0.2 * K.s, 0.55, -0.3), V3(0.17 * K.s, 0.18, -0.12), V3(0.1 * K.s, -0.02, 0.08)]));
  URE.forEach((c) => add('ure', taperTube(c, () => 0.025, 40, 8), { k: 0.5 }));
  const bladG = ell3(0.26, 0.2, 0.2); const blad = add('blad', bladG, { k: 0.45, mat: { transparent: true, opacity: 0.85 } }); blad.position.set(0, -0.03, 0.18);
  const urine = new THREE.Mesh(ell3(0.24, 0.18, 0.18), new THREE.MeshPhysicalMaterial({ color: 0xf2d860, emissive: 0x403000, emissiveIntensity: 0.4, transparent: true, opacity: 0.7, roughness: 0.2 })); urine.position.set(0, -0.03, 0.18); body.add(urine);
  add('blad', tube([V3(0, -0.15, 0.2), V3(0, -0.4, 0.22)], 0.014, 10, 6), { k: 0.5 });
  /* ---------- разрез почки ---------- */
  const kid = new THREE.Group(); kid.position.set(30, 0, 0); scene.add(kid); kid.visible = false;
  const KC = kidneyCanvas();
  const shape = new THREE.Shape(); for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; let x = Math.cos(a) * 0.7, y = Math.sin(a) * 1.1; if (x < 0) x += 0.28 * Math.exp(-((y / 0.38) ** 2)); i ? shape.lineTo(x, y) : shape.moveTo(x, y); }
  const kG = new THREE.ExtrudeGeometry(shape, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.28, bevelSize: 0.05, bevelSegments: 10, curveSegments: 60 });
  KC.t.repeat.set(KC.S / KC.W, KC.S / KC.H); KC.t.offset.set(0.5, 0.5);
  const capM = new THREE.MeshStandardMaterial({ map: KC.t, color: 0x9a9a9a, roughness: 0.75, emissiveMap: KC.t, emissive: 0xffffff, emissiveIntensity: 0.16, envMapIntensity: 0.25 });
  const sideM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xb85a50).multiplyScalar(0.42), roughness: 0.4, clearcoat: 0.7, sheen: 0.4, envMapIntensity: 0.35 });
  const kMesh = new THREE.Mesh(kG, [capM, sideM]); kMesh.position.z = -0.63; kid.add(kMesh);
  // мочеточник и сосуды из ворот
  kid.add(new THREE.Mesh(tube([V3(-0.3, -0.1, -0.4), V3(-0.8, -0.15, -0.3), V3(-1.05, -0.5, -0.25), V3(-1.0, -1.6, -0.3)], 0.06, 40, 10), organMat('#E8D8A0', 0.5)));   // начала — в почечной пазухе
  kid.add(new THREE.Mesh(tube([V3(-0.3, 0.1, -0.45), V3(-0.75, 0.12, -0.25), V3(-1.2, 0.25, -0.3), V3(-1.8, 0.3, -0.35)], 0.07, 30, 10), organMat('#E0605A', 0.5)));
  kid.add(new THREE.Mesh(tube([V3(-0.3, 0.0, -0.5), V3(-0.75, 0.0, -0.4), V3(-1.2, 0.05, -0.45), V3(-1.8, 0.0, -0.5)], 0.08, 30, 10), organMat('#6C86E0', 0.5)));
  /* ---------- нефрон ---------- */
  const neph = new THREE.Group(); neph.position.set(60, 0, 0); scene.add(neph); neph.visible = false;
  // фон: кора и мозговое вещество с градиентом осмолярности
  const bgC = document.createElement('canvas'); bgC.width = 16; bgC.height = 256; { const g = bgC.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#3a1c22'); gr.addColorStop(0.38, '#3a1c22'); gr.addColorStop(0.4, '#2a1420'); gr.addColorStop(1, '#5a2030'); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); }
  const bgT = new THREE.CanvasTexture(bgC); bgT.colorSpace = THREE.SRGBColorSpace;
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.6), new THREE.MeshBasicMaterial({ map: bgT, transparent: true, opacity: 0.55, depthWrite: false })); bg.position.set(0.2, -0.9, -0.9); neph.add(bg);
  const GLO = V3(-0.9, 1.1, 0);
  const tubC = {
    prox: new THREE.CatmullRomCurve3([GLO.clone().add(V3(0.3, -0.1, 0)), V3(-0.3, 1.25, 0.2), V3(0.0, 0.95, -0.25), V3(-0.35, 0.7, 0.25), V3(0.05, 0.55, -0.15), V3(-0.25, 0.32, 0.1), V3(-0.15, 0.0, 0.0)]),
    desc: new THREE.CatmullRomCurve3([V3(-0.15, 0.0, 0.0), V3(-0.15, -1.2, 0.0), V3(-0.12, -2.6, 0.0), V3(0.05, -3.05, 0.0)]),
    asc: new THREE.CatmullRomCurve3([V3(0.05, -3.05, 0.0), V3(0.25, -2.6, 0.0), V3(0.28, -1.2, 0.0), V3(0.25, 0.4, 0.0), V3(0.0, 0.85, 0.05)]),
    dist: new THREE.CatmullRomCurve3([V3(0.0, 0.85, 0.05), V3(-0.4, 1.0, 0.2), V3(0.3, 1.25, -0.15), V3(0.6, 1.0, 0.15), V3(0.95, 1.1, 0.0)]),
    coll: new THREE.CatmullRomCurve3([V3(0.95, 1.6, 0.0), V3(0.95, 1.1, 0.0), V3(1.0, -1.0, 0.0), V3(1.05, -3.3, 0.0)]),
  };
  const TUBCOL = { prox: '#F2C88A', desc: '#9FD0FF', asc: '#F4E06A', dist: '#C8E08A', coll: '#E8D8A0' };
  const TUBR = { prox: 0.075, desc: 0.04, asc: 0.06, dist: 0.065, coll: 0.09 };
  const tubM = {};
  Object.entries(tubC).forEach(([k, c]) => { const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(TUBCOL[k]).multiplyScalar(0.45), roughness: 0.35, clearcoat: 0.6, transparent: true, opacity: 0.6, depthWrite: false, emissive: new THREE.Color(TUBCOL[k]), emissiveIntensity: 0.08, sheen: 0.4 }); tubM[k] = m; neph.add(new THREE.Mesh(taperTube(c, () => TUBR[k], 160, 14), m)); });
  // капсула Боумена и клубочек
  const caps = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.82), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf2e0c8).multiplyScalar(0.45), roughness: 0.3, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide, clearcoat: 0.6 }));
  caps.position.copy(GLO); caps.rotation.z = -2.2; neph.add(caps); { const cg = new THREE.Mesh(caps.geometry, glassMat(0xffe0c8, { rim: 0.5, base: 0.01, pow: 2 })); cg.position.copy(GLO); cg.rotation.copy(caps.rotation); neph.add(cg); }
  const gloPts = []; for (let i = 0; i < 60; i++) { const a = i * 0.9, b = i * 0.37; gloPts.push(GLO.clone().add(V3(Math.sin(a) * Math.cos(b), Math.cos(a * 1.3), Math.sin(b) * Math.sin(a)).multiplyScalar(0.2))); }
  const GLOC = new THREE.CatmullRomCurve3([V3(-1.6, 1.5, 0.0), GLO.clone().add(V3(-0.25, 0.15, 0)), ...gloPts, GLO.clone().add(V3(-0.25, 0.25, 0.05)), V3(-1.6, 1.75, 0.05)]);
  neph.add(new THREE.Mesh(new THREE.TubeGeometry(GLOC, 500, 0.025, 6), new THREE.MeshPhysicalMaterial({ color: 0xc0404a, emissive: 0x501018, emissiveIntensity: 0.5, roughness: 0.4 })));
  // перитубулярные капилляры
  const PERI = new THREE.CatmullRomCurve3([V3(-1.6, 1.75, 0.05), V3(-0.8, 1.6, -0.3), V3(-0.1, 1.2, -0.4), V3(-0.4, 0.5, -0.4), V3(-0.05, -0.2, -0.3), V3(0.0, -2.8, -0.25), V3(0.15, -3.2, -0.2), V3(0.4, -2.8, -0.25), V3(0.45, -0.2, -0.3), V3(0.7, 0.9, -0.35), V3(1.4, 1.5, -0.3), V3(2.0, 1.6, -0.3)]);
  neph.add(new THREE.Mesh(new THREE.TubeGeometry(PERI, 300, 0.022, 6), new THREE.MeshPhysicalMaterial({ color: 0x9050a0, emissive: 0x301040, emissiveIntensity: 0.5, roughness: 0.4, transparent: true, opacity: 0.8 })));
  const fx = new Sparks(2600, 0.06); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'sys', sel: null, labels: true, rot: false, fly: null, adh: 0.5, fill: 0.25, msg: null, voidT: -9 };
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers(KD_PARTS.map((p) => PART[p.id]), st.sel); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; body.visible = m === 'sys'; kid.visible = m === 'kid'; neph.visible = m === 'neph'; st.fly = VIEW[m]; refs.setInfo && refs.setInfo(); }
  function thirst() { st.adh = 1; if (st.mode !== 'neph') setMode('neph'); st.msg = TXT.adh; refs.setInfo(); }
  function drink() { st.adh = 0.05; if (st.mode !== 'neph') setMode('neph'); st.msg = TXT.water; refs.setInfo(); }
  function voidB() { st.voidT = st.t; if (st.mode !== 'sys') setMode('sys'); st.msg = TXT.void; refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'sys') select(id); });
  const C_BL = new THREE.Color(0xe0605a), C_F = new THREE.Color(0xf4e0a0), C_GLU = new THREE.Color(0x7fe0a0), C_NA = new THREE.Color(0xffffff), C_W = new THREE.Color(0x6fc8ff), C_U = new THREE.Color(0xf2d860), C_VB = new THREE.Color(0x6c86e0);
  const prun = pathRunner(['prox', 'desc', 'asc', 'dist', 'coll'].map((k) => ({ c: tubC[k], d: k === 'prox' ? 2 : k === 'coll' ? 2.2 : 1.6, k })));
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    // наполнение пузыря
    const rate = 0.012 + (1 - st.adh) * 0.03;
    if (t - st.voidT < 2.5) st.fill = Math.max(0.05, st.fill - dt * 0.45); else st.fill = Math.min(1, st.fill + dt * rate);
    const bs = 0.65 + 0.7 * st.fill; blad.scale.set(bs, bs * 0.95, bs); urine.scale.set(bs * 0.92, bs * 0.9 * st.fill + 0.05, bs * 0.92); urine.position.y = -0.14 * bs + 0.14 * bs * st.fill * 0.9;
    if (st.mode === 'sys') {
      RA.forEach((c) => fx.spawn(c.getPointAt(rnd()), V3(0, 0, 0), C_BL, 0.35, 0, 1.2)); RV.forEach((c) => fx.spawn(c.getPointAt(rnd()), V3(0, 0, 0), C_VB, 0.35, 0, 1.2));
      fx.spawn(AO.getPointAt(rnd()), V3(0, -0.6, 0), C_BL, 0.4, 0, 1.2); fx.spawn(VC.getPointAt(rnd()), V3(0, 0.6, 0), C_VB, 0.4, 0, 1.2);
      URE.forEach((c) => { const u = (t * 0.35 + (c === URE[0] ? 0 : 0.5)) % 1; fx.spawn(c.getPointAt(u), V3(0, 0, 0), C_U, 0.4, 0, 1.6); });
      if (t - st.voidT < 2.5) fx.spawn(V3(0, -0.4, 0.22), V3(rand(-0.05, 0.05), -1.2, 0.1), C_U, 0.6, 0, 1.4);
    }
    if (st.mode === 'neph') {
      fx.spawn(GLOC.getPointAt(rnd()), V3(0, 0, 0), C_BL, 0.3, 0, 1.2);
      fx.spawn(PERI.getPointAt(rnd()), V3(0, 0, 0), C_BL, 0.4, 0, 1.0);
      for (let j = 0; j < 2; j++) { const { p, s } = prun.at(t * 0.7 + j * 2.7 + rnd() * 0.2); fx.spawn(p.add(randUnit().multiplyScalar(0.02)), V3(0, 0, 0), s.k === 'coll' ? C_U.clone().lerp(C_F, 1 - st.adh) : C_F, 0.4, 0, 1.4); }
      const out = (c, u, col, dir) => fx.spawn(c.getPointAt(u).add(randUnit().multiplyScalar(0.03)), dir, col, 0.9, 0.6, 1.3);
      if (rnd() < 0.5) out(tubC.prox, rnd(), rnd() < 0.5 ? C_GLU : C_NA, V3(0, 0, -0.35));
      if (rnd() < 0.35) out(tubC.desc, 0.2 + rnd() * 0.8, C_W, V3(-0.35, 0, -0.2));
      if (rnd() < 0.35) out(tubC.asc, rnd(), C_NA, V3(0.35, 0, -0.2));
      if (rnd() < st.adh * 0.6) out(tubC.coll, 0.3 + rnd() * 0.7, C_W, V3(-0.35, 0, -0.15));
      tubM.coll.color.copy(new THREE.Color(0xe8d8a0).lerp(new THREE.Color(0xf2c040), st.adh)).multiplyScalar(0.45);
    }
    fx.update(dt);
  }
  const TXT = {
    sys: '<b>Мочевыделительная система</b>: две почки, два мочеточника, мочевой пузырь и мочеиспускательный канал. Почки фильтруют кровь, а моча стекает в пузырь (вид сзади — почки лежат у спины). Нажмите на орган.',
    kid: '<b>Разрез почки.</b> Снаружи — капсула и <b>корковое вещество</b> (там лежат клубочки нефронов). Глубже — 8–18 <b>пирамид мозгового вещества</b> с петлями Генле и собирательными трубками; между пирамидами — почечные столбы. Вершины пирамид (сосочки) открываются в малые чашечки → большие чашечки → <b>лоханку</b> → мочеточник. Через ворота входят артерия и выходят вена.',
    neph: '<b>Нефрон</b> — рабочая единица почки, в каждой их около миллиона. 1) В <b>клубочке</b> под давлением из крови фильтруется плазма без белков и клеток — первичная моча, 150–180 л в сутки. 2) В <b>проксимальном канальце</b> обратно всасываются вся глюкоза, аминокислоты и ~65% воды и солей (зелёные и белые искры). 3) <b>Петля Генле</b> создаёт в мозговом веществе солевой градиент: нисходящая часть отдаёт воду, восходящая — соль. 4) В <b>дистальном канальце и собирательной трубке</b> идёт тонкая настройка под действием гормонов. Остаётся 1–1,5 л вторичной мочи.',
    adh: '<b>Жажда: выделяется АДГ (вазопрессин).</b> Гипоталамус чувствует, что кровь стала «гуще», и задняя доля гипофиза выпускает антидиуретический гормон. В стенке собирательной трубки открываются водные каналы-аквапорины, вода уходит в солёное мозговое вещество (голубые искры). Мочи мало, она концентрированная и тёмная.',
    water: '<b>Выпили много воды: АДГ почти нет.</b> Собирательная трубка становится непроницаемой для воды — она уходит с мочой. Мочи много, она разбавленная и светлая, а пузырь наполняется быстрее.',
    void: '<b>Мочеиспускание.</b> Растяжение стенки пузыря → сигнал по нервам в крестцовый отдел спинного мозга → сокращение мышцы пузыря и расслабление внутреннего сфинктера. Кора разрешает или запрещает расслабить наружный сфинктер.',
  };
  const labels = [
    { text: 'левая почка', pos: V3(0.72, 0.6, -0.35), color: '#D07060', show: () => st.labels && st.mode === 'sys' },
    { text: 'правая почка', pos: V3(-0.7, 0.62, -0.35), color: '#D07060', show: () => st.labels && st.mode === 'sys' },
    { text: 'надпочечник', pos: V3(0.5, 1.45, -0.35), left: true, color: '#F2C14E', show: () => st.labels && st.mode === 'sys' },
    { text: 'аорта', pos: V3(0.12, 1.5, -0.4), left: true, color: '#E0605A', show: () => st.labels && st.mode === 'sys' },
    { text: 'нижняя полая вена', pos: V3(-0.2, 1.5, -0.35), color: '#8CA0F0', show: () => st.labels && st.mode === 'sys' },
    { text: 'мочеточник', pos: V3(0.21, 0.5, -0.3), color: '#E8D8A0', show: () => st.labels && st.mode === 'sys' },
    { text: 'мочевой пузырь', pos: V3(0.25, 0.05, 0.2), color: '#F2D860', show: () => st.labels && st.mode === 'sys' },
    { text: 'корковое вещество', pos: V3(30.55, 0.75, 0.05), color: '#d07a6a', show: () => st.labels && st.mode === 'kid' },
    { text: 'пирамида', pos: V3(30.3, 0.0, 0.05), color: '#c86058', show: () => st.labels && st.mode === 'kid' },
    { text: 'чашечка', pos: V3(29.75, 0.42, 0.05), color: '#efe0c8', show: () => st.labels && st.mode === 'kid' },
    { text: 'лоханка', pos: V3(29.45, 0.0, 0.05), color: '#efe0c8', show: () => st.labels && st.mode === 'kid' },
    { text: 'почечная артерия', pos: V3(28.4, 0.35, -0.3), color: '#E0605A', show: () => st.labels && st.mode === 'kid' },
    { text: 'почечная вена', pos: V3(28.4, -0.1, -0.5), color: '#8CA0F0', show: () => st.labels && st.mode === 'kid' },
    { text: 'мочеточник', pos: V3(29.0, -1.3, -0.3), color: '#E8D8A0', show: () => st.labels && st.mode === 'kid' },
    { text: 'клубочек и капсула', pos: V3(58.9, 1.55, 0.2), color: '#ffb0a0', show: () => st.labels && st.mode === 'neph' },
    { text: 'проксимальный каналец', pos: V3(59.3, 0.55, 0.3), color: '#F2C88A', show: () => st.labels && st.mode === 'neph' },
    { text: 'петля Генле', pos: V3(60.3, -2.7, 0.1), color: '#9FD0FF', show: () => st.labels && st.mode === 'neph' },
    { text: 'дистальный каналец', pos: V3(60.75, 1.35, 0.2), color: '#C8E08A', show: () => st.labels && st.mode === 'neph' },
    { text: 'собирательная трубка', pos: V3(61.2, -1.0, 0.1), color: '#E8D8A0', show: () => st.labels && st.mode === 'neph' },
    { text: 'кора', pos: V3(57.5, 0.9, -0.85), color: '#c89090', show: () => st.labels && st.mode === 'neph' },
    { text: 'мозговое вещество', pos: V3(57.5, -1.0, -0.85), color: '#c89090', show: () => st.labels && st.mode === 'neph' },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'sys' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'sys', label: 'Система' }, { id: 'kid', label: 'Разрез почки' }, { id: 'neph', label: 'Нефрон' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...KD_PARTS.map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'sys') setMode('sys'); select(v); });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 420px' }, h('div', { class: 'glabel' }, 'Органы', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)),
      group('Опыт', 'T · W · V', button('Жажда (АДГ)', thirst, true), button('Выпить литр воды', drink), button('Опорожнить пузырь', voidB)), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['sys', 'kid', 'neph'][n - 1]); return true; }
    if (k === 't' || k === 'е') { thirst(); return true; } if (k === 'w' || k === 'ц') { drink(); return true; } if (k === 'v' || k === 'м') { voidB(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { const out = (0.5 + (1 - st.adh) * 2.5).toFixed(1); return [['Первичная моча', '≈180', 'л/сут'], ['Конечная', out, 'л/сут'], ['Пузырь', Math.round(st.fill * 500), 'мл']]; }
  const self = {
    labelBg: true, mobZoom: 0.5, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#F2D860',
    kicker: 'Тело · выделение', title: 'Почки и мочевыделение',
    lede: 'Каждые сутки почки пропускают через себя всю кровь около 300 раз, отфильтровывают 180 литров жидкости и возвращают обратно в кровь 99% её.',
    notes: `
      <div><h2>Что делают почки</h2><ul>
        <li>Выводят мочевину, мочевую кислоту, креатинин, лекарства и яды.</li><li>Держат постоянными объём крови, концентрацию солей и pH.</li>
        <li>Ренин регулирует кровяное давление; эритропоэтин запускает образование эритроцитов; в почках активируется витамин D.</li></ul>
        <h3>Гормоны</h3><p><b>АДГ</b> (вазопрессин) задерживает воду, <b>альдостерон</b> — натрий, <b>натрийуретический пептид</b> сердца — наоборот, выводит натрий и воду.</p></div>
      <div><h2>Условности</h2><ul><li>Нефрон увеличен примерно в 300 раз, петля Генле укорочена.</li><li>Срез почки — схема по учебному рисунку.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>T</code> жажда</li><li><code>W</code> вода</li><li><code>V</code> опорожнить</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeKidney };
