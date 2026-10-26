// @scene skull makeSkull | Череп | @body Опора и движение
/* =========================================================
   ТЕЛО · ЧЕРЕП: кости (настоящий скан черепа, раскрашенный по костям, как у Неттера, Pl. 11–18),
   отверстия основания черепа и что через них проходит (Pl. 19–20), череп новорождённого и роднички (Pl. 21)
   ========================================================= */
const SK_BONES = [
  { id: 'front', name: 'Лобная', col: '#6FA8E8', text: '<b>Лобная кость</b> — лоб и верхние края глазниц; её глазничные части образуют крышу глазниц. Внутри над переносицей — лобная пазуха. У новорождённого кость из двух половин, шов между ними (метопический) зарастает к 1–2 годам.' },
  { id: 'par', name: 'Теменные', col: '#7CC86A', text: '<b>Теменные кости</b> — парные, образуют свод черепа. Между собой соединены сагиттальным швом, с лобной — венечным, с затылочной — ламбдовидным, с височной — чешуйчатым.' },
  { id: 'occ', name: 'Затылочная', col: '#9A7FE0', text: '<b>Затылочная кость</b> — задняя часть свода и основания. В ней <b>большое затылочное отверстие</b>, через которое продолговатый мозг переходит в спинной; по бокам от него мыщелки сочленяются с первым шейным позвонком (атлантом) — так голова кивает.' },
  { id: 'temp', name: 'Височные', col: '#F08AB0', text: '<b>Височные кости</b> — по бокам черепа. В их пирамидах спрятаны среднее и внутреннее ухо, снаружи — наружный слуховой проход, сзади — сосцевидный отросток, спереди — скуловой отросток и ямка височно-нижнечелюстного сустава.' },
  { id: 'sph', name: 'Клиновидная', col: '#F2C84E', text: '<b>Клиновидная кость</b> похожа на бабочку и лежит в центре основания черепа, соединяясь со всеми костями мозгового отдела. В её теле — турецкое седло с гипофизом и клиновидная пазуха; снаружи на висках видны большие крылья.' },
  { id: 'eth', name: 'Решётчатая', col: '#F2A060', text: '<b>Решётчатая кость</b> — между глазницами. Её дырчатая пластинка пропускает обонятельные нити из носа к мозгу, а лабиринт заполнен воздушными ячейками — решётчатыми пазухами.' },
  { id: 'nas', name: 'Носовые', col: '#FF9A50', text: '<b>Носовые кости</b> — две маленькие пластинки, образующие спинку носа. Это самые частые переломы костей лица.' },
  { id: 'zyg', name: 'Скуловые', col: '#58C8C0', text: '<b>Скуловые кости</b> формируют скулы и наружный край глазниц; вместе со скуловым отростком височной кости образуют скуловую дугу, к которой крепится жевательная мышца.' },
  { id: 'max', name: 'Верхняя челюсть', col: '#4EB890', text: '<b>Верхняя челюсть</b> — парная кость: дно глазницы, стенки носа, часть нёба и альвеолярный отросток с верхними зубами. Внутри — самая большая пазуха, гайморова (верхнечелюстная).' },
  { id: 'mand', name: 'Нижняя челюсть', col: '#D8C0A0', text: '<b>Нижняя челюсть</b> — единственная подвижная кость черепа. Её мыщелковые отростки образуют с височными костями два височно-нижнечелюстных сустава, которые работают синхронно: при широком открывании рта головка выезжает вперёд на суставной бугорок.' },
];
function makeSkull() {
  rnd = mulberry(1414);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07070b); scene.environment = envTex;
  labLights(scene, 0x9fb4ff);
  const SC = V3(0.12, 16.2, 0.12);
  const VIEW = { front: flyTarget(SC.clone().add(V3(-0.6, -0.7, 0)), SC.clone().add(V3(-0.4, 0.2, 6.6))), side: flyTarget(SC.clone().add(V3(0, -0.7, -0.6)), SC.clone().add(V3(6.6, 0.2, -0.3))), top: flyTarget(SC.clone().add(V3(0, 0, 0)), SC.clone().add(V3(0.01, 7, 0.3))), bottom: flyTarget(SC.clone(), SC.clone().add(V3(0.01, -7, 0.4))) };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200);
  const controls = makeControls(camera, SC); controls.minDistance = 1.5; controls.maxDistance = 20;
  const G = new THREE.Group(); scene.add(G);
  const st = { t: 0, mode: 'bones', sel: null, labels: true, rot: false, fly: null, msg: null, loaded: false, err: null };
  const BN = Object.fromEntries(SK_BONES.map((b) => [b.id, { ...b, mats: [], meshes: [] }])), pick = [];
  // классификация вершины по кости (система черепа: X — от срединной плоскости, z — вперёд)
  function cls(x, y, z) {
    const X = x - 0.12, aX = Math.abs(X);
    if (y < 15.86 && z > -0.22 && z < 0.26 && aX < 0.34) return null;   // шейные позвонки
    if (y < 15.0) return null;
    // нижняя челюсть: тело ниже окклюзии и ветви
    if ((y < 15.7 && z > 0.22) || (aX > 0.24 && aX < 0.57 && z > 0.02 && z < 0.66 && y < 15.99 && y > 15.12 && !(z > 0.5 && y > 15.75))) return 'mand';
    // лицо
    if (z > 0.78 && aX < 0.09 && y > 16.13 && y < 16.46) return 'nas';
    if (aX > 0.55 && y > 15.9 && y < 16.12 && z > 0.05 && z < 0.55) return z > 0.32 ? 'zyg' : 'temp';   // скуловая дуга
    if (aX > 0.33 && z > 0.42 && y > 15.9 && y < 16.32) return 'zyg';
    if (z > 0.42 && y < 16.2 && aX <= 0.42) return y > 16.1 && aX < 0.14 && z < 0.8 ? 'eth' : 'max';
    if (z > 0.5 && y > 16.1 && y < 16.45 && aX < 0.14) return 'eth';
    // свод и основание
    if (y > 16.15 && z > 0.28 + 0.18 * (y - 16.4)) return 'front';
    if (z < -0.4 + 0.2 * (16.85 - y) * 0.9 && (y < 16.95 || z < -0.45) && z < -0.18) return 'occ';
    if (y < 15.98 && z < -0.05) return 'occ';
    if (aX > 0.36 && z > 0.18 && z < 0.5 && y > 15.9 && y < 16.32) return 'sph';
    if (aX > 0.4 && y < 16.36 - 0.5 * Math.max(0, z - 0.05) ** 2 * 4 && z > -0.42 && z <= 0.36) return 'temp';
    if (y < 16.22 && aX < 0.42 && z > -0.05 && z < 0.55) return 'sph';
    if (y < 16.2 && aX >= 0.36) return 'temp';
    return 'par';
  }
  const boneMat = (col) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(col).lerp(new THREE.Color(0xf0e6d4), 0.35), roughness: 0.6, clearcoat: 0.2, sheen: 0.3, sheenColor: new THREE.Color(0xfff0d8), envMapIntensity: 0.6, side: THREE.DoubleSide });
  const holder = new THREE.Group();
  loadSkeletonStatic(holder, new THREE.MeshBasicMaterial()).then((out) => {
    const head = out.find((m) => { m.geometry.computeBoundingBox(); return m.geometry.boundingBox.max.y > 17; });
    const g = head.geometry, P = g.attributes.position, LB = g.attributes.aLabel, IX = g.index.array;
    const vc = new Array(P.count); for (let i = 0; i < P.count; i++) vc[i] = LB.getX(i) < 0.5 ? cls(P.getX(i), P.getY(i), P.getZ(i)) : null;
    const tris = {}; for (let t = 0; t < IX.length; t += 3) { const a = vc[IX[t]], b = vc[IX[t + 1]], c = vc[IX[t + 2]]; const k = a && (a === b || a === c) ? a : b && b === c ? b : a || b || c; if (!k) continue; (tris[k] = tris[k] || []).push(IX[t], IX[t + 1], IX[t + 2]); }
    Object.entries(tris).forEach(([k, arr]) => {
      const map = new Map(), pos = []; const idx = arr.map((v) => { if (!map.has(v)) { map.set(v, pos.length / 3); pos.push(P.getX(v), P.getY(v), P.getZ(v)); } return map.get(v); });
      const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); gg.setIndex(idx); gg.computeVertexNormals();
      const B = BN[k], m = new THREE.Mesh(gg, boneMat(B.col)); m.userData.pick = k; pick.push(m); B.mats.push(m.material); B.meshes.push(m); G.add(m);
    });
    st.loaded = true; refs.setInfo && refs.setInfo();
  }).catch((e) => { st.err = e.message; refs.setInfo && refs.setInfo(); });
  function select(id) { st.sel = id === 'all' ? null : id; SK_BONES.forEach((b) => BN[b.id].mats.forEach((m) => { const on = !st.sel || st.sel === b.id; m.transparent = !on; m.opacity = on ? 1 : 0.15; m.depthWrite = on; m.emissive = new THREE.Color(b.col); m.emissiveIntensity = st.sel === b.id ? 0.25 : 0; m.needsUpdate = true; })); refs.seg && refs.seg.sync(); refs.setInfo && refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => select(st.sel === id ? 'all' : id));
  function update(dt) { st.t += dt; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.6; flyStep(st, camera, controls, dt); }
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.err ? 'Не удалось загрузить модель: ' + st.err : !st.loaded ? 'Загружаю модель черепа…' : st.sel ? BN[st.sel].text : '<b>Череп</b> — 22 кости (без слуховых косточек): 8 образуют мозговой отдел, 14 — лицевой. Все, кроме нижней челюсти, соединены неподвижными швами. Нажмите на кость.'; };
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...SK_BONES.map((b) => ({ id: b.id, label: b.name, color: b.col }))], () => st.sel || 'all', (v) => select(v));
    const vs = seg([{ id: 'front', label: 'Спереди' }, { id: 'side', label: 'Сбоку' }, { id: 'top', label: 'Сверху' }, { id: 'bottom', label: 'Снизу' }], () => st.view, (v) => { st.view = v; st.fly = VIEW[v]; });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    el.append(h('div', { class: 'grp', style: 'flex:1 1 560px' }, h('div', { class: 'glabel' }, 'Кости', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg)), group('Вид', 'R', vs, refs.rot), ib.el);
    refs.setInfo();
  }
  function onKey(e) { const k = e.key.toLowerCase(); if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (e.key === 'Escape') { select('all'); return true; } return false; }
  st.view = 'front'; camera.position.copy(VIEW.front.pos); controls.target.copy(VIEW.front.target); controls.update();
  const self = {
    scene, camera, controls, update, ui, onKey, stats: () => [['Костей', 22, '']], labels: [], drawScope: null, accent: '#6FA8E8',
    kicker: 'Тело · голова', title: 'Череп', lede: 'Двадцать две кости, сросшиеся швами в прочную коробку для мозга и каркас лица.', notes: '',
  };
  return self;
}
