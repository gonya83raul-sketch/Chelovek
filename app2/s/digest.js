import { GLTFLoader, Sparks, THREE, V3, __set_rnd, bodyShell, button, dimOthers, displaceGeo, ell3, envTex, fetchModel, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, makeControls, mergeGeometries, mulberry, noise3, organMat, pathRunner, pickOn, rand, randUnit, rnd, seg, smooth, taperTube, toggle, tube } from '../core.js';


/* =========================================================
   ТЕЛО · ПИЩЕВАРИТЕЛЬНАЯ СИСТЕМА
   ========================================================= */
const DG_PARTS = [
  { id: 'mouth', name: 'Рот и слюнные железы', color: '#E8A0A0', text: '<b>Ротовая полость.</b> Зубы измельчают пищу, язык перемешивает её со слюной. Три пары слюнных желёз (околоушные, поднижнечелюстные, подъязычные) выделяют 1–1,5 л слюны в сутки. Фермент амилаза начинает расщеплять крахмал, слизь склеивает пищевой комок.' },
  { id: 'eso', name: 'Пищевод', color: '#E0B0A0', text: '<b>Пищевод</b> — мышечная трубка 25 см. Комок проходит его за 5–8 секунд благодаря <b>перистальтике</b> — волне сокращения стенки. Он работает даже вниз головой. Внизу сфинктер не пускает кислое содержимое желудка обратно (иначе — изжога).' },
  { id: 'stom', name: 'Желудок', color: '#E89880', text: '<b>Желудок</b> вмещает 1–1,5 л (растягивается до 3–4 л). Железы стенки выделяют 2–2,5 л желудочного сока в сутки: соляную кислоту (pH 1,5–2, убивает микробов) и пепсин, расщепляющий белки. Слизь защищает стенку от самопереваривания. Пища остаётся здесь 2–4 часа и превращается в полужидкий химус.' },
  { id: 'liver', name: 'Печень и желчный пузырь', color: '#B05A48', text: '<b>Печень</b> — самая большая железа, около 1,5 кг. Вырабатывает желчь (до 1 л в сутки), которая эмульгирует жиры, дробя их на мелкие капли. Желчь копится в <b>желчном пузыре</b> и поступает в двенадцатиперстную кишку. Ещё печень обезвреживает яды, запасает гликоген и производит белки крови.' },
  { id: 'panc', name: 'Поджелудочная железа', color: '#F2C88A', text: '<b>Поджелудочная железа</b> выделяет 1,5–2 л сока в сутки: трипсин (белки), липазу (жиры), амилазу (углеводы) и бикарбонат, нейтрализующий кислоту желудка. Её островки (1–2% ткани) — эндокринная часть: инсулин и глюкагон.' },
  { id: 'si', name: 'Тонкая кишка', color: '#F0B8A8', text: '<b>Тонкая кишка</b> длиной 4–6 м: двенадцатиперстная, тощая и подвздошная. Здесь заканчивается переваривание и происходит почти всё всасывание — через ворсинки и микроворсинки. Пища проходит её за 3–5 часов.' },
  { id: 'li', name: 'Толстая кишка', color: '#C8A090', text: '<b>Толстая кишка</b> (около 1,5 м): слепая кишка с аппендиксом, ободочная (восходящая, поперечная, нисходящая, сигмовидная) и прямая. Всасывает воду и соли, формирует каловые массы за 12–36 часов. Здесь живут триллионы бактерий микробиоты: они расщепляют клетчатку и синтезируют витамины K и группы B.' },
];
function makeDigest() {
  __set_rnd(mulberry(1414));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07060a); scene.environment = envTex;
  labLights(scene, 0xffb08a);
  const VIEW = { org: flyTarget(V3(0.0, 0.85, 0), V3(2.1, 2.0, 9.8)), path: flyTarget(V3(0.0, 1.1, 0), V3(-2.4, 2.2, 10.2)), villi: flyTarget(V3(30, -1.0, 0), V3(32.6, 1.3, 8.4)) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100); camera.position.copy(VIEW.org.pos);
  const controls = makeControls(camera, VIEW.org.target); controls.minDistance = 1.5; controls.maxDistance = 22;
  const body = new THREE.Group(); scene.add(body);
  bodyShell(body, { rim: 0.2 });
  const PART = Object.fromEntries(DG_PARTS.map((p) => [p.id, { ...p, mats: [] }])), pick = [];
  const add = (id, g, o = {}, parent = body) => { const m = organMat(PART[id].color, o.k ?? 0.42, o.mat || {}); PART[id].mats.push(m); const me = new THREE.Mesh(g, m); me.userData.pick = id; pick.push(me); parent.add(me); return me; };
  /* ---------- путь пищи: сегменты ---------- */
  const SEG = {
    mouth: [V3(0, 3.95, 0.42), V3(0, 3.93, 0.25), V3(0, 3.82, 0.02), V3(0, 3.6, -0.1)],
    eso: [V3(0, 3.6, -0.1), V3(0.0, 3.2, -0.22), V3(0.02, 2.5, -0.3), V3(0.08, 1.85, -0.22), V3(0.22, 1.62, -0.06)],
    stom: [V3(0.22, 1.62, -0.06), V3(0.42, 1.78, -0.02), V3(0.56, 1.55, 0.1), V3(0.48, 1.25, 0.22), V3(0.22, 1.1, 0.28), V3(-0.02, 1.18, 0.22)],
    duo: [V3(-0.02, 1.18, 0.22), V3(-0.26, 1.12, 0.06), V3(-0.3, 0.9, -0.04), V3(-0.08, 0.82, -0.02), V3(0.16, 0.9, 0.02)],
  };
  // тонкая кишка — меандр
  const siPts = [V3(0.16, 0.9, 0.02)]; const ROWS = 7;
  for (let r = 0; r < ROWS; r++) { const y = 0.82 - r * 0.095, dir = r % 2 ? 1 : -1; for (let j = 0; j <= 6; j++) { const u = j / 6, x = dir * (0.84 * u - 0.42); siPts.push(V3(x * 0.95, y + 0.03 * Math.sin(u * Math.PI * 3 + r), 0.14 + 0.12 * Math.sin(u * Math.PI * 2 + r * 1.3))); } }
  siPts.push(V3(-0.38, 0.2, 0.16), V3(-0.48, 0.22, 0.14));
  SEG.si = siPts;
  SEG.li = [V3(-0.48, 0.22, 0.14), V3(-0.6, 0.35, 0.08), V3(-0.63, 0.75, 0.05), V3(-0.6, 1.05, 0.1), V3(-0.4, 1.08, 0.3), V3(0.0, 0.98, 0.4), V3(0.4, 1.06, 0.3), V3(0.64, 1.18, 0.05), V3(0.66, 0.75, 0.0), V3(0.64, 0.3, 0.02), V3(0.5, 0.05, 0.12), V3(0.2, 0.0, 0.16), V3(0.02, -0.08, -0.05), V3(0.0, -0.45, -0.12)];
  const CUR = Object.fromEntries(Object.entries(SEG).map(([k, p]) => [k, new THREE.CatmullRomCurve3(p, false, 'catmullrom', 0.4)]));
  // стенки органов
  add('mouth', taperTube(CUR.mouth, (u) => 0.1 - 0.03 * u, 30, 14), { mat: { transparent: true, opacity: 0.8 } });
  add('eso', taperTube(CUR.eso, () => 0.045, 60, 12));
  const stomR = (u) => 0.06 + 0.2 * Math.sin(Math.min(1, u * 1.15) * Math.PI) * (u < 0.3 ? 0.85 + u : 1.15 - 0.3 * u) + (u > 0.85 ? -0.03 : 0);
  const stomG = displaceGeo(taperTube(CUR.stom, stomR, 90, 28), (v) => { v.addScaledVector(V3(0, 0, 0), 0); });
  add('stom', stomG, { k: 0.45 });
  add('si', taperTube(CUR.duo, () => 0.055, 40, 12));
  add('si', taperTube(CUR.si, () => 0.05, 600, 12), { k: 0.45 });
  const liG = displaceGeo(taperTube(CUR.li, (u) => 0.085 - 0.02 * u, 300, 16), (v, i) => {});
  // гаустры: перетяжки толстой кишки
  { const pos = liG.attributes.position, uv = liG.attributes.uv, c = new THREE.Vector3(), p = new THREE.Vector3(); for (let i = 0; i < pos.count; i++) { const u = uv.getX(i); if (u > 0.92) continue; CUR.li.getPointAt(u, c); p.fromBufferAttribute(pos, i).sub(c); const k = 1 - 0.18 * Math.max(0, Math.cos(u * 160)) ** 4; p.multiplyScalar(k).add(c); pos.setXYZ(i, p.x, p.y, p.z); } liG.computeVertexNormals(); }
  add('li', liG, { k: 0.42 });
  add('li', tube([V3(-0.5, 0.18, 0.15), V3(-0.47, 0.06, 0.18), V3(-0.42, -0.02, 0.2)], (u) => 0.02 * (1 - 0.3 * u), 12, 8));
  add('li', ell3(0.1, 0.1, 0.1, V3(-0.52, 0.18, 0.12)));
  // печень, желчный пузырь, поджелудочная, слюнные железы
  const livG = displaceGeo(new THREE.SphereGeometry(1, 64, 44), (v) => { let x = v.x, y = v.y, z = v.z; const k = 0.55 + 0.45 * smooth(0.9, -0.9, x); y *= k; z *= 0.7 + 0.3 * smooth(0.9, -0.6, x); if (y < 0) y *= 0.55; v.set(x * 0.78, y * 0.42, z * 0.55).multiplyScalar(1 + 0.02 * noise3(v.x * 4, v.y * 4, v.z * 4)); });
  livG.rotateZ(-0.12); livG.translate(-0.25, 1.52, 0.1); add('liver', livG, { k: 0.45, mat: { clearcoat: 0.7 } });
  const GB = V3(-0.28, 1.28, 0.42); add('liver', (() => { const g = ell3(0.06, 0.11, 0.06); g.rotateZ(0.5); g.translate(GB.x, GB.y, GB.z); return g; })(), { k: 0.55, mat: { color: new THREE.Color('#7FB060').multiplyScalar(0.5) } });
  const BILE = new THREE.CatmullRomCurve3([GB, V3(-0.24, 1.22, 0.3), V3(-0.22, 1.08, 0.12), V3(-0.26, 0.98, 0.0)]);
  add('liver', taperTube(BILE, () => 0.014, 20, 6), { k: 0.55, mat: { color: new THREE.Color('#7FB060').multiplyScalar(0.5) } });
  const PANC = new THREE.CatmullRomCurve3([V3(-0.22, 0.97, -0.06), V3(0.0, 1.0, -0.14), V3(0.3, 1.08, -0.2), V3(0.56, 1.18, -0.2)]);
  add('panc', taperTube(PANC, (u) => 0.085 - 0.045 * u, 50, 14), { k: 0.5 });
  [1, -1].forEach((s) => { add('mouth', ell3(0.08, 0.13, 0.06, V3(0.32 * s, 3.98, 0.02)), { k: 0.5 }); add('mouth', ell3(0.06, 0.04, 0.05, V3(0.18 * s, 3.76, 0.22)), { k: 0.5 }); });
  // диафрагма (контур)
  const dia = new THREE.Mesh(displaceGeo(new THREE.CircleGeometry(1, 48).rotateX(-Math.PI / 2), (v) => { const r = Math.hypot(v.x, v.z); v.y = 0.35 * (1 - r * r); v.x *= 0.88; v.z *= 0.5; }), new THREE.MeshPhysicalMaterial({ color: 0x8a4a4a, roughness: 0.5, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }));
  dia.position.y = 1.5; body.add(dia);
  /* ---------- путешествие пищи ---------- */
  const STAGES = [
    { key: 'mouth', c: CUR.mouth, d: 2.5, real: '10–30 с', col: 0xd8b070, text: '<b>Рот.</b> Пища измельчается и смачивается слюной. Амилаза слюны начинает расщеплять крахмал до мальтозы. Язык формирует комок и проталкивает его в глотку — глотание запускается рефлекторно.' },
    { key: 'eso', c: CUR.eso, d: 2.2, real: '5–8 с', col: 0xd8b070, text: '<b>Пищевод.</b> Перистальтическая волна (кольцо сокращения позади комка) проталкивает пищу вниз. Нижний сфинктер раскрывается и пропускает её в желудок.' },
    { key: 'stom', c: CUR.stom, d: 5, real: '2–4 ч', col: 0xe0c070, text: '<b>Желудок.</b> Стенки перемешивают пищу с соляной кислотой и пепсином: белки распадаются на пептиды, микробы гибнут. Получается кислый полужидкий химус, который порциями выходит через привратник.' },
    { key: 'duo', c: CUR.duo, d: 2.5, real: '~30 мин', col: 0xe8d070, text: '<b>Двенадцатиперстная кишка.</b> Сюда вливаются желчь (зелёная, дробит жиры) и сок поджелудочной железы (трипсин, липаза, амилаза, бикарбонат). Кислота нейтрализуется, переваривание идёт полным ходом.' },
    { key: 'si', c: CUR.si, d: 7, real: '3–5 ч', col: 0xe8d070, text: '<b>Тонкая кишка.</b> Ферменты стенки завершают расщепление: белки → аминокислоты, углеводы → глюкоза, жиры → жирные кислоты и глицерин. Через ворсинки они всасываются в кровь и лимфу (жёлтые искры уходят из кишки).' },
    { key: 'li', c: CUR.li, d: 6, real: '12–36 ч', col: 0x9a7048, text: '<b>Толстая кишка.</b> Непереваренные остатки (клетчатка) поступают в слепую кишку. Здесь всасывается вода (голубые искры), бактерии сбраживают волокна и делают витамины. Остатки уплотняются и выводятся через прямую кишку.' },
  ];
  const RUN = pathRunner(STAGES.map((s) => ({ c: s.c, d: s.d, s })));
  const bolus = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 14), new THREE.MeshPhysicalMaterial({ color: 0xd8b070, roughness: 0.5, emissive: 0x5a3a10, emissiveIntensity: 0.6 })); body.add(bolus); bolus.visible = false;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 24), new THREE.MeshPhysicalMaterial({ color: 0xff9a80, emissive: 0x6a2010, emissiveIntensity: 0.8, roughness: 0.4 })); body.add(ring); ring.visible = false;
  const fx = new Sparks(2400, 0.06); scene.add(fx.obj);
  /* ---------- реалистичная 3D-модель: Education Resource Fund (Sketchfab, CC BY 4.0) ---------- */
  const SCH = pick.slice(); SCH.push(dia);
  const DTX = Object.fromEntries(DG_PARTS.map((p) => [p.id, p.text]));
  const RG = [
    { id: 'd_mouth', name: 'Язык и глотка', color: '#E8A0A0', keys: ['Tongue', 'Pharynx'], text: DTX.mouth },
    { id: 'd_eso', name: 'Пищевод', color: '#E0B0A0', keys: ['Esophagus'], text: DTX.eso },
    { id: 'd_stom', name: 'Желудок', color: '#E89880', keys: ['Stomach2'], text: DTX.stom },
    { id: 'd_liver', name: 'Печень и желчные пути', color: '#B05A48', keys: ['liver', 'Biliary_tract'], text: DTX.liver },
    { id: 'd_panc', name: 'Поджелудочная железа', color: '#F2C88A', keys: ['Pancreas'], text: DTX.panc },
    { id: 'd_si', name: 'Тонкая кишка', color: '#F0B8A8', keys: ['Small_intestine'], text: DTX.si },
    { id: 'd_li', name: 'Толстая кишка', color: '#C8A090', keys: ['Large_intestine', 'Tinea_coli'], text: DTX.li + ' По её стенке тянутся три мышечные ленты (на модели отдельно) — из-за них кишка собирается в характерные вздутия-гаустры.' },
    { id: 'd_spl', name: 'Селезёнка', color: '#B0506A', keys: ['Spleen'], text: '<b>Селезёнка</b> лежит слева под диафрагмой, рядом с желудком. Это не орган пищеварения, а кроветворный и иммунный орган: она фильтрует кровь и разрушает старые эритроциты. Её кровь оттекает через воротную вену в печень.' },
    { id: 'd_air', name: 'Гортань и трахея', color: '#E8DCC8', keys: ['Larynx', 'Trachea', 'Epiglosttis', 'arytenoids', 'Corniculate', 'Cricoid', 'Thyroid_cartilage2', 'Thyrohyoid_membrane2', 'Thyrocricoid_ligament2', 'Median_cricothyroid_ligament'], text: '<b>Гортань и трахея</b> лежат впереди пищевода. В глотке дыхательный и пищевой пути перекрещиваются; при глотании <b>надгортанник</b> закрывает вход в гортань, а гортань поднимается — пища уходит в пищевод, а не в трахею. Хрящи гортани (щитовидный, перстневидный, черпаловидные) держат голосовые связки.' },
    { id: 'd_dia', name: 'Диафрагма', color: '#C86A6A', keys: ['Diaphragm'], text: '<b>Диафрагма</b> отделяет грудную полость от брюшной. Пищевод проходит через её отверстие; ножки диафрагмы помогают нижнему сфинктеру пищевода не пускать кислоту обратно. Если отверстие расширено, часть желудка может выпячиваться в грудь (грыжа пищеводного отверстия).' },
    { id: 'd_bone', name: 'Скелет', color: '#E8D8BB', keys: ['Sacrum4', 'Scapula1', 'Spine1', 'Sternum1', 'Pelvis1', 'Ribcage1'], text: '<b>Скелет туловища</b> — позвоночник, рёбра, грудина, лопатки, таз — для ориентира. Печень, желудок и селезёнка прикрыты нижними рёбрами, а большая часть кишечника лежит ниже, в чаше таза и над ней.' },
  ];
  RG.forEach((p) => { PART[p.id] = { ...p, mats: [], c: V3(0, 0, 0), n: 0 }; });
  const REAL = new THREE.Group(); body.add(REAL); REAL.visible = false;
  const realOn = () => st.mode === 'org' && st.realLoad === 2;
  function loadReal() {
    if (st.realLoad) return; st.realLoad = 1; refs.setInfo && refs.setInfo();
    fetchModel('digest').then((buf) => {
      new GLTFLoader().parse(buf, '', (gltf) => {
        const root = gltf.scene; root.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(root), size = box.getSize(V3(0, 0, 0)), c = box.getCenter(V3(0, 0, 0));
        const k = 4.6 / size.y; root.scale.setScalar(k); root.position.set(-c.x * k, -0.6 - box.min.y * k, -c.z * k - 0.02); REAL.add(root); root.updateMatrixWorld(true);
        root.traverse((o) => { if (!o.isMesh) return; const p = RG.find((q) => q.keys.some((kk) => o.name.startsWith(kk + '_'))); if (!p) return;
          o.userData.pick = p.id; pick.push(o); const m = o.material; m.envMapIntensity = 0.3; m.color.multiplyScalar(p.id === 'd_bone' ? 0.5 : 0.8); if (m.clearcoat !== undefined) m.clearcoat = Math.min(m.clearcoat, 0.5); m.side = THREE.DoubleSide; PART[p.id].mats.push(m);
          PART[p.id].c.add(new THREE.Box3().setFromObject(o).getCenter(V3(0, 0, 0))); PART[p.id].n++; });
        RG.forEach((p) => { if (PART[p.id].n) PART[p.id].lab.pos.copy(PART[p.id].c.divideScalar(PART[p.id].n)).add(RLAB[p.id] || V3(0, 0, 0)); });
        st.realLoad = 2; setMode(st.mode);
      }, (e) => { st.realErr = String(e); refs.setInfo && refs.setInfo(); });
    }).catch((e) => { st.realErr = e.message; refs.setInfo && refs.setInfo(); });
  }
  function boneGlass() { if (!realOn() || st.sel) return; [...PART.d_bone.mats, ...PART.d_dia.mats, ...PART.d_air.mats].forEach((m) => { m.transparent = true; m.opacity = PART.d_bone.mats.includes(m) ? 0.35 : 0.55; m.depthWrite = false; m.needsUpdate = true; }); }
  const RLAB = { d_mouth: V3(0.35, 0.05, 0.15), d_eso: V3(0.25, 0.2, 0.0), d_stom: V3(0.45, 0.05, 0.2), d_liver: V3(-0.55, 0.1, 0.2), d_panc: V3(0.35, -0.12, 0.1), d_si: V3(0.0, -0.1, 0.4), d_li: V3(0.75, 0.15, 0.1), d_spl: V3(0.35, 0.0, -0.1), d_air: V3(-0.3, 0.3, 0.1), d_dia: V3(0.75, 0.15, 0.2), d_bone: V3(-1.0, 0.5, 0.0) };
  /* ---------- ворсинки ---------- */
  const vil = new THREE.Group(); vil.position.set(30, 0, 0); scene.add(vil); vil.visible = false;
  const wall = new THREE.Mesh(displaceGeo(new THREE.BoxGeometry(4.4, 0.5, 2.4, 60, 2, 30), (v) => { if (v.y > 0) v.y += 0.12 * Math.sin(v.x * 2.2); }), organMat('#c89088', 0.4)); wall.position.y = -1.45; vil.add(wall);
  const muscle = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.3, 2.4), organMat('#a85a5a', 0.4)); muscle.position.y = -1.85; vil.add(muscle);
  const VIL = []; const vArr = [], capA = [], capV = [], lacArr = [];
  for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) {
    const x = -1.8 + i * 0.6 + rand(-0.08, 0.08), z = -0.85 + j * 0.56 + rand(-0.08, 0.08), y0 = -1.2 + 0.12 * Math.sin(x * 2.2), hgt = 1.15 + rnd() * 0.25;
    const g = displaceGeo(new THREE.CapsuleGeometry(0.17, hgt, 8, 20), (v) => { v.x += 0.012 * Math.sin(v.y * 30 + v.z * 20); }); g.translate(x, y0 + hgt / 2 + 0.1, z); vArr.push(g);
    const loopA = new THREE.CatmullRomCurve3([V3(x - 0.09, y0, z + 0.05), V3(x - 0.1, y0 + hgt * 0.6, z + 0.07), V3(x, y0 + hgt + 0.15, z + 0.06)]);
    const loopV = new THREE.CatmullRomCurve3([V3(x, y0 + hgt + 0.15, z + 0.06), V3(x + 0.1, y0 + hgt * 0.6, z + 0.07), V3(x + 0.09, y0, z + 0.05)]);
    capA.push(new THREE.TubeGeometry(loopA, 16, 0.018, 5)); capV.push(new THREE.TubeGeometry(loopV, 16, 0.018, 5));
    const lac = new THREE.CatmullRomCurve3([V3(x, y0 + hgt * 0.9, z - 0.02), V3(x, y0 + hgt * 0.4, z - 0.02), V3(x, y0 - 0.1, z - 0.02)]); lacArr.push(new THREE.TubeGeometry(lac, 12, 0.03, 6));
    VIL.push({ x, z, y0, hgt, loopV, lac, top: V3(x, y0 + hgt + 0.2, z) });
  }
  const vilMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf0b8a8).multiplyScalar(0.45), roughness: 0.4, clearcoat: 0.5, transparent: true, opacity: 0.45, depthWrite: false, sheen: 0.6, sheenColor: new THREE.Color(0xffd8d0), envMapIntensity: 0.35 });
  vil.add(new THREE.Mesh(mergeGeometries(vArr), vilMat), new THREE.Mesh(mergeGeometries(vArr), glassMat(0xffc8b8, { rim: 0.4, base: 0.01, pow: 2 })));
  vil.add(new THREE.Mesh(mergeGeometries(capA), new THREE.MeshPhysicalMaterial({ color: 0xc0404a, emissive: 0x501018, emissiveIntensity: 0.5 })));
  vil.add(new THREE.Mesh(mergeGeometries(capV), new THREE.MeshPhysicalMaterial({ color: 0x5068c0, emissive: 0x101840, emissiveIntensity: 0.5 })));
  vil.add(new THREE.Mesh(mergeGeometries(lacArr), new THREE.MeshPhysicalMaterial({ color: 0xf0e8c0, emissive: 0x403820, emissiveIntensity: 0.5, transparent: true, opacity: 0.85 })));
  // микроворсинки на одной клетке (врезка)
  const mvG = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const g = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 5); g.translate(1.95 + i * 0.035, 0.85, -0.9 + j * 0.035); mvG.push(g); }
  vil.add(new THREE.Mesh(mergeGeometries(mvG), organMat('#f0c8b8', 0.5)));
  const cell = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.3), organMat('#e8b0a8', 0.4, { transparent: true, opacity: 0.6 })); cell.position.set(2.07, 0.56, -0.78); vil.add(cell);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'org', sel: null, labels: true, rot: false, fly: null, runT: -1, stage: -1, msg: null };
  function select(id) { st.sel = id === 'all' ? null : id; refs.seg && refs.seg.sync(); dimOthers((realOn() ? RG : DG_PARTS).map((p) => PART[p.id]), st.sel); boneGlass(); st.msg = null; refs.setInfo && refs.setInfo(); }
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); st.msg = null; if (m === 'org') loadReal(); { const r = realOn(); REAL.visible = r; SCH.forEach((x) => { x.visible = !r; }); if (r) { st.sel = null; dimOthers(RG.map((p) => PART[p.id]), null); boneGlass(); } refs.rebuild && refs.rebuild(); } body.visible = m !== 'villi'; vil.visible = m === 'villi'; st.fly = VIEW[m]; if (m === 'path') { select('all'); if (st.runT < 0) start(); } refs.setInfo && refs.setInfo(); }
  function start() { st.runT = st.t; st.stage = -1; bolus.visible = ring.visible = true; if (st.mode !== 'path') setMode('path'); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode !== 'villi') select(id); });
  const C_SAL = new THREE.Color(0x9fe0ff), C_ACID = new THREE.Color(0xf4e06a), C_BILE = new THREE.Color(0x8fd06a), C_PAN = new THREE.Color(0xffc080), C_NUT = new THREE.Color(0xffd34a), C_W = new THREE.Color(0x6fc8ff), C_AA = new THREE.Color(0x7fe0a0), C_FAT = new THREE.Color(0xfff2d0);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6;
    flyStep(st, camera, controls, dt);
    if (st.runT >= 0 && st.mode === 'path') {
      const k = t - st.runT; if (k > RUN.total + 1) st.runT = t;
      const { p, s } = RUN.at(Math.min(k, RUN.total - 0.001)); const si = STAGES.indexOf(s.s);
      if (si !== st.stage) { st.stage = si; st.msg = s.s.text; refs.setInfo(); }
      bolus.position.copy(p); bolus.material.color.setHex(s.s.col);
      const u2 = Math.max(0, Math.min(1, (k - STAGES.slice(0, si).reduce((a, b) => a + b.d, 0)) / s.d));
      const back = s.c.getPointAt(Math.max(0, u2 - 0.06)); ring.position.copy(back); ring.lookAt(p); ring.scale.setScalar(1 + 0.25 * Math.sin(t * 12));
      if (s.s.key === 'mouth') fx.spawn(p.clone().add(randUnit().multiplyScalar(0.1)), randUnit().multiplyScalar(0.1), C_SAL, 0.5, 1, 1);
      if (s.s.key === 'stom') for (let j = 0; j < 2; j++) { const q = CUR.stom.getPointAt(rnd()); fx.spawn(q.add(randUnit().multiplyScalar(0.15)), randUnit().multiplyScalar(0.08), C_ACID, 0.6, 1, 1); }
      if (s.s.key === 'duo') { fx.spawn(BILE.getPointAt(rnd()), V3(0, 0, 0), C_BILE, 0.5, 0, 1.4); fx.spawn(PANC.getPointAt(rnd()), V3(0, 0, 0), C_PAN, 0.5, 0, 1.4); }
      if (s.s.key === 'si') for (let j = 0; j < 2; j++) fx.spawn(p.clone().add(randUnit().multiplyScalar(0.05)), randUnit().multiplyScalar(0.35), C_NUT, 0.8, 0.5, 1.2);
      if (s.s.key === 'li' && rnd() < 0.6) fx.spawn(p.clone(), randUnit().multiplyScalar(0.3), C_W, 0.8, 0.5, 1.1);
    }
    if (st.mode === 'villi') {
      VIL.forEach((v) => { if (rnd() < 0.08) { fx.spawn(v.top.clone().add(randUnit().multiplyScalar(0.05)), V3(0, -0.5, 0), rnd() < 0.5 ? C_NUT : C_AA, 0.9, 0.2, 1.2); } if (rnd() < 0.04) fx.spawn(v.top.clone().add(V3(0, -0.05, -0.03)), V3(0, -0.6, 0), C_FAT, 1.3, 0.1, 1.3); });
      for (let j = 0; j < 4; j++) { const v = VIL[Math.floor(rnd() * VIL.length)]; fx.spawn(v.loopV.getPointAt(rnd()), V3(0, -0.2, 0), rnd() < 0.5 ? C_NUT : C_AA, 0.5, 0, 1.2); fx.spawn(v.lac.getPointAt(rnd()), V3(0, -0.2, 0), C_FAT, 0.5, 0, 1.2); }
    }
    fx.update(dt);
  }
  const TXT = {
    org: '<b>Пищеварительная система</b> — трубка длиной 8–10 м от рта до анального отверстия и железы, которые выделяют в неё соки с ферментами: слюнные, печень, поджелудочная. Пища механически измельчается, химически расщепляется до простых молекул и всасывается в кровь. Нажмите на орган или запустите путь пищи.',
    path: '<b>Путь пищи.</b> Комок движется по трубке; кольцо позади — волна перистальтики. Время в сцене сжато, реальная длительность каждого этапа — справа.',
    villi: '<b>Ворсинки тонкой кишки.</b> Слизистая собрана в складки, складки покрыты ворсинками (≈1 мм), а каждая клетка ворсинки — тысячами микроворсинок (справа). Так площадь всасывания вырастает до ~30 м². Глюкоза и аминокислоты (жёлтые и зелёные) уходят в кровеносные капилляры и по воротной вене попадают в печень. Жиры (белые) собираются в лимфатический капилляр — млечный сосуд — и идут в лимфу.',
  };
  const labels = [
    { text: 'слюнные железы', pos: V3(0.42, 4.05, 0.1), color: '#E8A0A0', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'пищевод', pos: V3(0.12, 2.6, -0.25), color: '#E0B0A0', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'желудок', pos: V3(0.72, 1.55, 0.2), color: '#E89880', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'печень', pos: V3(-0.75, 1.62, 0.2), color: '#C8705A', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'желчный пузырь', pos: GB.clone().add(V3(-0.1, -0.08, 0.1)), color: '#9FD080', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'поджелудочная', pos: V3(0.4, 1.05, -0.1), color: '#F2C88A', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: '12-перстная кишка', pos: V3(-0.42, 0.95, 0.0), color: '#F0B8A8', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'тонкая кишка', pos: V3(0.1, 0.5, 0.35), color: '#F0B8A8', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'толстая кишка', pos: V3(0.75, 0.75, 0.1), color: '#C8A090', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'аппендикс', pos: V3(-0.5, -0.04, 0.25), color: '#C8A090', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'прямая кишка', pos: V3(0.1, -0.35, -0.1), color: '#C8A090', show: () => st.labels && st.mode !== 'villi' && !realOn() },
    { text: 'ворсинка', pos: V3(29.0, 0.3, 1.2), color: '#F0B8A8', show: () => st.labels && st.mode === 'villi' },
    { text: 'капилляры → печень', pos: V3(28.4, -1.0, 1.25), color: '#E0605A', show: () => st.labels && st.mode === 'villi' },
    { text: 'млечный сосуд → лимфа', pos: V3(30.6, -0.9, -1.2), color: '#F0E8C0', show: () => st.labels && st.mode === 'villi' },
    { text: 'микроворсинки', pos: V3(32.2, 1.0, -0.8), color: '#f0c8b8', show: () => st.labels && st.mode === 'villi' },
  ];
  RG.forEach((p) => { const l = { text: p.name.toLowerCase(), pos: V3(0, -9, 0), color: p.color, show: () => st.labels && realOn() && (!st.sel || st.sel === p.id) }; PART[p.id].lab = l; labels.unshift(l); });
  const refs = {};
  loadReal();
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'org' && st.realErr ? 'Не удалось загрузить 3D-модель: ' + st.realErr : st.mode === 'org' && st.realLoad === 1 ? 'Загружаю реалистичную 3D-модель…' : '') || (st.mode === 'org' && st.sel ? PART[st.sel].text : TXT[st.mode]); };
    refs.modeSeg = seg([{ id: 'org', label: 'Органы' }, { id: 'path', label: 'Путь пищи' }, { id: 'villi', label: 'Всасывание' }], () => st.mode, (v) => setMode(v));
    const segBox = h('div', { class: 'gctl' });
    refs.rebuild = () => { segBox.innerHTML = ''; refs.seg = seg([{ id: 'all', label: 'Все' }, ...(realOn() ? RG : DG_PARTS).map((p) => ({ id: p.id, label: p.name, color: p.color }))], () => st.sel || 'all', (v) => { if (st.mode !== 'org') setMode('org'); select(v); }); segBox.append(refs.seg); };
    refs.rebuild();
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), h('div', { class: 'grp', style: 'flex:1 1 520px' }, h('div', { class: 'glabel' }, 'Органы', h('kbd', {}, 'клик')), segBox),
      group('Опыт', 'F', button('Проглотить кусочек', start, true)), group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['org', 'path', 'villi'][n - 1]); return true; }
    if (k === 'f' || k === 'а') { start(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() { return st.mode === 'path' && st.stage >= 0 ? [['Этап', STAGES[st.stage].key === 'si' ? 'тонкая кишка' : DG_PARTS.find((p) => p.id === STAGES[st.stage].key)?.name || '12-перстная', ''], ['В жизни', STAGES[st.stage].real, '']] : st.mode === 'villi' ? [['Площадь всасывания', '≈30', 'м²']] : [['Длина тракта', '8–10', 'м'], ['Соков в сутки', '≈7', 'л']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#F2C88A',
    kicker: 'Тело · пищеварение', title: 'Пищеварительная система',
    lede: 'От бутерброда до глюкозы в крови — около суток пути по трубке длиной 8–10 метров, с кислотой, ферментами, желчью и триллионами бактерий.',
    notes: `
      <div><h2>Что расщепляется и где</h2><ul>
        <li><b>Углеводы:</b> амилаза слюны и поджелудочной → дисахариды → ферменты кишечника → глюкоза.</li>
        <li><b>Белки:</b> пепсин желудка → трипсин и химотрипсин → пептидазы кишки → аминокислоты.</li>
        <li><b>Жиры:</b> желчь эмульгирует → липаза → жирные кислоты и глицерин.</li></ul>
        <h3>Регуляция</h3><p>Слюноотделение и первая фаза желудочной секреции запускаются ещё до еды — на вид и запах (опыты И. П. Павлова, Нобелевская премия 1904 г.). Дальше работают гормоны кишки: гастрин, секретин, холецистокинин.</p></div>
      <div><h2>Источник модели</h2><p>Режим «Органы»: 3D-модель «Adult digestive system», автор <a href="https://sketchfab.com/3d-models/adult-digestive-system-bfe2c671298947f8bcf0f69c06e74ed8" target="_blank" rel="noopener">Education Resource Fund</a>, лицензия CC BY 4.0. Текстуры уменьшены для быстрой загрузки.</p><h2 style="margin-top:22px">Условности</h2><ul><li>В режиме «Путь пищи» органы схематичные, петли тонкой кишки уложены упрощённо.</li><li>Время прохождения в анимации сжато в тысячи раз.</li><li>Ворсинки увеличены примерно в 2000 раз.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li>клик: орган</li><li><code>F</code> проглотить</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  return self;
}
export { makeDigest };
