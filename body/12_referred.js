// @scene referred makeReferred | Отражённая боль | @body Как устроено тело
/* =========================================================
   ТЕЛО · ОТРАЖЁННАЯ БОЛЬ: зоны Захарьина — Геда (Неттер, BP 13), механизм конвергенции
   в заднем роге спинного мозга и четыре клинических случая
   ========================================================= */
const RF_ORG = [
  { id: 'heart', name: 'Сердце', col: '#FF5A5A', seg: 'C8–T4', z: ['chest', 'larm', 'lneck', 'ljaw'], view: 'front',
    text: '<b>Сердце.</b> Боль при стенокардии и инфаркте ощущается за грудиной и слева, отдаёт в <b>левую руку</b> по внутренней поверхности, в шею и нижнюю челюсть. Чувствительные волокна сердца входят в спинной мозг в сегментах T1–T4. В те же сегменты приходят нервы от кожи груди и внутренней стороны плеча и предплечья (T1–T2, а у мизинца — C8). Отдача в шею и челюсть связана с блуждающим нервом и шейными сегментами.' },
  { id: 'eso', name: 'Пищевод', col: '#FFB0D0', seg: 'T4–T6', z: ['retro'], view: 'front',
    text: '<b>Пищевод.</b> Изжога и спазм пищевода ощущаются <b>за грудиной</b> — их легко спутать с болью в сердце. Сегменты T4–T6.' },
  { id: 'stomach', name: 'Желудок', col: '#FFA040', seg: 'T6–T9', z: ['epi', 'sback'], view: 'front',
    text: '<b>Желудок и двенадцатиперстная кишка.</b> Боль при язве и гастрите — в <b>надчревной области</b>, «под ложечкой», посередине, хотя желудок лежит левее. Сзади боль бывает слева от позвоночника, под лопаткой. Сегменты T6–T9.' },
  { id: 'liver', name: 'Печень', col: '#C07848', seg: 'T6–T9 · C3–C5', z: ['ruq', 'rsh', 'lvback'], view: 'front',
    text: '<b>Печень.</b> Сама ткань печени почти не чувствует боли, болит растянутая капсула: тупая боль в <b>правом подреберье</b>. Если раздражена диафрагма под печенью, боль уходит в <b>правое надплечье</b>: диафрагму иннервирует диафрагмальный нерв из шейных сегментов C3–C5, а из тех же сегментов (C3–C4) надключичные нервы иннервируют кожу надплечья.' },
  { id: 'gall', name: 'Желчный пузырь', col: '#7FD050', seg: 'T6–T9 · C3–C5', z: ['ruq', 'rscap', 'rsh'], view: 'rback', lz: 'rscap',
    text: '<b>Желчный пузырь.</b> Желчная колика — в <b>правом подреберье</b> и надчревье, с отдачей <b>под правую лопатку</b> и в правое надплечье (через диафрагмальный нерв).' },
  { id: 'pancreas', name: 'Поджелудочная', col: '#F2D060', seg: 'T6–T10', z: ['epi', 'backmid'], view: 'lback', lz: 'backmid',
    text: '<b>Поджелудочная железа.</b> Железа лежит у задней стенки живота, поэтому боль при панкреатите — в надчревье и <b>опоясывает</b>, уходя в спину. Сегменты T6–T10.' },
  { id: 'spleen', name: 'Селезёнка', col: '#C060A0', seg: 'T6–T8 · C3–C5', z: ['luq', 'lsh'], view: 'front',
    text: '<b>Селезёнка.</b> Боль в <b>левом подреберье</b>; кровь под диафрагмой при разрыве селезёнки раздражает диафрагму и даёт боль в <b>левом надплечье</b> (симптом Кера).' },
  { id: 'small', name: 'Тонкая кишка', col: '#FF8A70', seg: 'T9–T11', z: ['periumb'], view: 'front',
    text: '<b>Тонкая кишка.</b> Схваткообразная боль <b>вокруг пупка</b>, плохо локализованная: кишка развивается по средней линии, и её волокна приходят в сегменты T9–T11 с обеих сторон.' },
  { id: 'appendix', name: 'Аппендикс', col: '#FF6A4A', seg: 'T10 · брюшина T12–L1', z: ['periumb', 'mcb'], view: 'front',
    text: '<b>Аппендикс.</b> Сначала боль <b>вокруг пупка</b> (висцеральная, сегмент T10). Когда воспаление доходит до пристеночной брюшины, у которой соматическая иннервация, боль перемещается в <b>правую подвздошную область</b> и становится точной и острой.' },
  { id: 'colon', name: 'Толстая кишка', col: '#D0A080', seg: 'T10–L1', z: ['hypog', 'rliliac', 'liliac'], view: 'front',
    text: '<b>Толстая кишка.</b> Слепая и восходящая ободочная кишка «болят» около пупка и справа внизу, сигмовидная — <b>над лобком и в левой подвздошной области</b>. Сегменты T10–L1.' },
  { id: 'kidney', name: 'Почка и мочеточник', col: '#B488FF', seg: 'T10–L2', z: ['lloin', 'lflank', 'lgroin', 'lthigh'], view: 'lback', lz: 'lloin',
    text: '<b>Почка и мочеточник.</b> Почка болит в <b>пояснице</b> и боку. Камень, спускаясь по мочеточнику, ведёт боль вниз — в <b>пах</b>, внутреннюю поверхность бедра и половые органы (сегменты T11–L2).' },
  { id: 'bladder', name: 'Мочевой пузырь', col: '#F2E070', seg: 'T11–L2 · S2–S4', z: ['suprap'], view: 'front',
    text: '<b>Мочевой пузырь.</b> Боль и позывы <b>над лобком</b> (T11–L2), от шейки пузыря — в промежность (S2–S4).' },
];
const RF_CASES = {
  mi: { name: 'Инфаркт', o: 'heart', st: [
    { z: ['chest'], time: '0–5 мин', view: 'front', t: '<b>Инфаркт миокарда, первые минуты.</b> Давящая, жгучая боль за грудиной, «как будто сел слон». Человек не может показать её одним пальцем — прижимает к груди кулак (симптом Левайна). Это типичная висцеральная боль: тупая и разлитая.' },
    { z: ['chest', 'larm', 'lneck', 'ljaw'], time: '5–30 мин', view: 'front', t: '<b>Боль отдаёт.</b> Она уходит в левую руку по внутренней стороне до мизинца, в шею и нижнюю челюсть, иногда в надчревье. У женщин, пожилых и при диабете боль бывает слабой или только «в желудке» — поэтому такие инфаркты пропускают. Давящая боль за грудиной дольше 5 минут, которая не проходит в покое, — повод сразу вызвать скорую (103).' },
  ] },
  app: { name: 'Аппендицит', o: 'appendix', st: [
    { z: ['periumb'], time: '0–12 ч', view: 'front', t: '<b>Аппендицит, начало.</b> Тупая боль вокруг пупка или в надчревье, тошнота. Растянутый воспалённый отросток раздражает висцеральные волокна, которые приходят в сегмент T10, — мозг относит боль к средней линии живота.' },
    { z: ['mcb'], time: '12–24 ч', view: 'front', t: '<b>Боль перемещается</b> в правую подвздошную область, к точке Мак-Бёрни (на границе средней и наружной трети линии от пупка к выступу подвздошной кости). Воспаление дошло до пристеночной брюшины, а её нервы — соматические, как у кожи, и боль становится точной. Такое «переползание» боли — классический признак аппендицита (симптом Кохера).' },
  ] },
  bil: { name: 'Желчная колика', o: 'gall', st: [
    { z: ['ruq'], time: '0–1 ч', view: 'front', t: '<b>Желчная колика.</b> Через час-два после жирной еды камень закупоривает проток пузыря: сильная боль в правом подреберье и надчревье, тошнота.' },
    { z: ['ruq', 'rscap', 'rsh'], time: '1–6 ч', view: 'rback', t: '<b>Боль отдаёт</b> под правую лопатку и в правое надплечье. Лопатка — по общим грудным сегментам T6–T9, плечо — через диафрагмальный нерв (C3–C5): раздражённая диафрагма «жалуется» на коже шеи и плеча. Боль дольше 6 часов с лихорадкой говорит уже о воспалении пузыря (холецистите).' },
  ] },
  ren: { name: 'Почечная колика', o: 'kidney', st: [
    { z: ['lloin', 'lflank'], time: 'начало', view: 'lback', t: '<b>Почечная колика.</b> Камень застрял в лоханке или начале мочеточника: волнообразная, очень сильная боль в пояснице и боку. Человек мечется и не может найти удобное положение — в отличие от боли при воспалении брюшины, когда лежат неподвижно.' },
    { z: ['lflank', 'lgroin', 'lthigh'], time: 'через часы', view: 'lfront', t: '<b>Камень спускается</b> по мочеточнику, и боль ползёт за ним вниз — в пах, на внутреннюю поверхность бедра и в половые органы. Сегменты мочеточника идут от T11 до L2, и каждый участок «отражается» на свой участок кожи.' },
  ] },
};
function makeReferred() {
  rnd = mulberry(1313);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x08060a); scene.environment = envTex;
  labLights(scene, 0xff9a8a);
  // ракурс: центр C виден в правой верхней части холста (слева — заголовок, снизу — панель)
  const VW = (C, dir, d, fx = 0.14, fy = 0.05) => { const dn = dir.clone().normalize(), r = V3(0, 1, 0).cross(dn).normalize(), sh = r.multiplyScalar(-fx * d).add(V3(0, -fy * d, 0)); return flyTarget(C.clone().add(sh), C.clone().add(sh).addScaledVector(dn, d)); };
  const BC = V3(0.1, 12.0, 0.2), MC = V3(36.9, 0.3, 0);
  const VIEW = { front: VW(BC, V3(0.1, 0.08, 1), 26), back: VW(BC, V3(-0.1, 0.08, -1), 26), rback: VW(BC, V3(-0.75, 0.08, -0.66), 26), lback: VW(BC, V3(0.75, 0.08, -0.66), 26), lfront: VW(BC.clone().add(V3(0, -0.6, 0)), V3(0.55, 0.05, 0.85), 26), mech: VW(MC, V3(0.02, 0.04, 1), 31, 0.14, 0.1) };
  const VIEWM = { front: VW(BC, V3(0.1, 0.05, 1), 13.5, 0, -0.03), back: VW(BC, V3(-0.1, 0.05, -1), 13.5, 0, -0.03), rback: VW(BC, V3(-0.75, 0.05, -0.66), 13.5, 0, -0.03), lback: VW(BC, V3(0.75, 0.05, -0.66), 13.5, 0, -0.03), lfront: VW(BC, V3(0.55, 0.05, 0.85), 13.5, 0, -0.03),
    mech: VW(MC, V3(0, 0.03, 1), 21, 0, -0.03) }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
  const FT = VIEW.front.target;
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300);
  const controls = makeControls(camera, FT); controls.minDistance = 4; controls.maxDistance = 60;
  const G = new THREE.Group(); scene.add(G);
  const shell = skelShell(G, glassMat('#BFD8FF', { rim: 0.5, base: 0.03, keep: true }));
  /* ---------- органы ---------- */
  const ORG = Object.fromEntries(RF_ORG.map((o) => [o.id, { ...o, mats: [], meshes: [] }])), pick = [];
  const org = (id, geo, p, o = {}) => { const O = ORG[id] || { mats: [], meshes: [], col: o.col }; const m = new THREE.Mesh(geo, organMat(o.col || O.col, 0.5, { emissiveIntensity: 0.06, transparent: true, opacity: 1 })); m.position.copy(p || V3(0, 0, 0)); if (o.rz) m.rotation.z = o.rz; G.add(m); if (ORG[id]) { O.mats.push(m.material); O.meshes.push(m); m.userData.pick = id; pick.push(m); } return m; };
  const tubeC = (pts, r, seg = 40) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 10);
  org('heart', blobGeo(0.4, 0.46, 0.36, 7, 0.1), V3(0.28, 12.65, 0.62), { rz: 0.5 });
  org('eso', tubeC([V3(0.03, 14.6, 0.02), V3(0.03, 13.6, -0.08), V3(0.06, 12.6, -0.02), V3(0.2, 11.95, 0.25), V3(0.36, 11.62, 0.5)], 0.06), null);
  org('liver', blobGeo(0.95, 0.62, 0.6, 9, 0.08), V3(-0.42, 11.7, 0.45), { rz: 0.18 });
  org('gall', ell3(0.1, 0.17, 0.1), V3(-0.55, 11.15, 0.95));
  org('stomach', blobGeo(0.5, 0.42, 0.32, 11, 0.12), V3(0.52, 11.4, 0.62), { rz: 0.5 });
  org('spleen', ell3(0.22, 0.38, 0.18), V3(1.05, 11.65, -0.15));
  org('pancreas', ell3(0.62, 0.11, 0.13), V3(0.15, 11.25, 0.22), { rz: 0.15 });
  [V3(-0.55, 11.05, -0.32), V3(0.6, 11.2, -0.32)].forEach((p) => org('kidney', ell3(0.2, 0.36, 0.17), p));
  [1, -1].forEach((s) => org('kidney', tubeC([V3(s * 0.52, 10.85, -0.22), V3(s * 0.42, 10.0, -0.05), V3(s * 0.3, 9.45, 0.12), V3(s * 0.12, 9.22, 0.28)], 0.025, 30), null));
  const ct = (pts) => tubeC(pts, 0.15);
  org('colon', ct([V3(-0.72, 9.75, 0.5), V3(-0.8, 10.45, 0.48), V3(-0.72, 10.95, 0.55), V3(0, 10.85, 0.78), V3(0.78, 11.0, 0.6), V3(0.88, 10.3, 0.42), V3(0.8, 9.7, 0.5), V3(0.45, 9.3, 0.55), V3(0.1, 9.15, 0.2)]), null);
  org('colon', ell3(0.2, 0.2, 0.18), V3(-0.72, 9.68, 0.52));
  org('appendix', tubeC([V3(-0.7, 9.52, 0.6), V3(-0.6, 9.36, 0.68), V3(-0.5, 9.3, 0.62)], 0.05, 16), null);
  { const pts = []; for (let i = 0; i < 140; i++) { const a = i * 0.55; pts.push(V3(Math.cos(a) * (0.15 + 0.4 * ((i * 37) % 11) / 11), 10.25 - i * 0.0065 + 0.08 * Math.sin(a * 0.7), 0.6 + Math.sin(a) * 0.22)); } org('small', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 500, 0.07, 6), null); }
  org('bladder', ell3(0.26, 0.22, 0.24), V3(0.03, 9.2, 0.3));
  const diaph = (() => { const g = new THREE.SphereGeometry(1, 36, 12, 0, Math.PI * 2, 0, 1.15); g.scale(1.15, 0.5, 0.78); const m = new THREE.Mesh(g, organMat('#FF9A5C', 0.4, { transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide })); m.position.set(0.05, 12.05, 0.2); G.add(m); return m; })();
  /* ---------- зоны на коже: эллипсоиды пересекают оболочку тела, шейдер красит кожу внутри них ---------- */
  const PROF = [[0.0, 8.55], [0.75, 8.62], [1.18, 9.05], [1.22, 9.55], [1.08, 10.4], [1.02, 11.0], [1.12, 11.8], [1.26, 12.6], [1.38, 13.4], [1.5, 13.95], [1.32, 14.35], [0.8, 14.6]];
  const rAt = (y) => { for (let i = 1; i < PROF.length; i++) if (y <= PROF[i][1]) { const [r0, y0] = PROF[i - 1], [r1, y1] = PROF[i]; return lerp(r0, r1, (y - y0) / (y1 - y0)); } return 0.8; };
  const surf = (x, y, s) => { const r = rAt(y), dx = x - 0.05; return 0.18 + s * 0.62 * Math.sqrt(Math.max(0.01, r * r - dx * dx)); };
  const B = (x, y, s, rx, ry, rz = 0.4) => ({ p: V3(x, y, surf(x, y, s)), r: V3(rx, ry, rz) });
  const J = Object.fromEntries(Object.entries(SKEL_META.joints).map(([k, v]) => [k, V3(...v)]));
  const armPt = (u) => { const a = u < 0.5 ? J.shL.clone().lerp(J.elL, u * 2) : J.elL.clone().lerp(J.wrL, (u - 0.5) * 2); return a.add(V3(-0.3, -0.05, 0.1)); };
  const ZONES = {
    chest: [B(0.32, 12.85, 1, 0.62, 0.78)], larm: [...[0.2, 0.42, 0.62, 0.84].map((u) => ({ p: armPt(u), r: V3(0.2, 0.7, 0.22) })), { p: J.hdL.clone().add(V3(-0.15, -0.35, 0)), r: V3(0.14, 0.3, 0.14) }],
    lneck: [{ p: V3(0.32, 14.75, 0.32), r: V3(0.3, 0.32, 0.3) }], ljaw: [{ p: V3(0.42, 15.35, 0.78), r: V3(0.32, 0.25, 0.35) }],
    retro: [B(0.05, 12.95, 1, 0.3, 0.85)], epi: [B(0.1, 11.75, 1, 0.42, 0.42)],
    ruq: [B(-0.62, 11.4, 1, 0.45, 0.42)], rscap: [B(-0.75, 12.3, -1, 0.42, 0.5)], rsh: [{ p: V3(-1.25, 14.25, 0.2), r: V3(0.42, 0.32, 0.5) }],
    luq: [B(0.75, 11.4, 1, 0.4, 0.4)], lsh: [{ p: V3(1.3, 14.25, 0.15), r: V3(0.42, 0.32, 0.5) }], backmid: [B(0.05, 11.25, -1, 0.75, 0.32)],
    periumb: [B(0.05, 10.6, 1, 0.42, 0.42)], mcb: [B(-0.7, 9.75, 1, 0.34, 0.34)], hypog: [B(0.08, 9.55, 1, 0.5, 0.3)], liliac: [B(0.66, 9.72, 1, 0.34, 0.34)], rliliac: [B(-0.62, 9.85, 1, 0.36, 0.34)], sback: [B(0.35, 12.3, -1, 0.28, 0.42)], lvback: [B(-0.7, 11.6, -1, 0.38, 0.22)],
    lloin: [B(0.72, 10.75, -1, 0.42, 0.55)], lflank: [{ p: V3(1.12, 10.55, 0.1), r: V3(0.35, 0.55, 0.45) }], lgroin: [B(0.55, 9.12, 1, 0.34, 0.26)], lthigh: [{ p: V3(0.42, 8.55, 0.34), r: V3(0.26, 0.5, 0.3) }],
    suprap: [B(0.05, 9.12, 1, 0.4, 0.28)],
  };
  const BL = []; Object.entries(ZONES).forEach(([zid, arr]) => arr.forEach((b) => BL.push({ ...b, zid, w: 0, tw: 0, col: new THREE.Color('#ffffff') })));
  const MAXB = 32;
  const zU = { uP: { value: Array.from({ length: MAXB }, (_, i) => (BL[i] ? BL[i].p : V3(0, -99, 0))) }, uR: { value: Array.from({ length: MAXB }, (_, i) => (BL[i] ? BL[i].r : V3(0.01, 0.01, 0.01))) },
    uK: { value: Array.from({ length: MAXB }, () => new THREE.Color()) }, uW: { value: new Array(MAXB).fill(0) }, uT: { value: 0 } };
  const zoneMat = new THREE.ShaderMaterial({ uniforms: zU, transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform vec3 uP[${MAXB}]; uniform vec3 uR[${MAXB}]; uniform vec3 uK[${MAXB}]; uniform float uW[${MAXB}]; uniform float uT; varying vec3 vP;
      void main(){ float a = 0.0; vec3 c = vec3(0.0);
        float rim = 0.0;
        for (int i = 0; i < ${MAXB}; i++) { float d = length((vP - uP[i]) / uR[i]); float k = (1.0 - smoothstep(0.8, 1.0, d)) * uW[i]; if (k > a) { a = k; c = uK[i]; rim = smoothstep(0.72, 0.86, d) * uW[i]; } }
        if (a < 0.01) discard; float hatch = 0.55 + 0.45 * step(0.5, fract((vP.x + vP.y) * 7.0));
        vec3 col = mix(c * (1.05 + 0.25 * sin(uT * 3.0)) * hatch, vec3(1.0), rim * 0.7);
        gl_FragColor = vec4(col, a * 0.85); }` });
  shell.forEach((m) => { const z = new THREE.Mesh(m.geometry, zoneMat); z.renderOrder = 3; G.add(z); });
  /* ---------- механизм: срез спинного мозга ---------- */
  const MG = new THREE.Group(); scene.add(MG);
  const Q = (x, y, z = 0) => V3(39.4 + x, y, z);
  const mmesh = (geo, col, o = {}) => { const m = new THREE.Mesh(geo, organMat(col, o.k ?? 0.5, { emissiveIntensity: 0.12, ...(o.mat || {}) })); MG.add(m); return m; };
  { const wm = new THREE.CylinderGeometry(1, 1, 0.5, 64); wm.rotateX(Math.PI / 2); wm.scale(1.5, 1.15, 1); wm.translate(...Q(0, 0).toArray()); mmesh(wm, '#F2E6C8', { k: 0.4, mat: { transparent: true, opacity: 0.55, depthWrite: false } }); }
  const grayM = organMat('#A890B8', 0.5, { emissiveIntensity: 0.15 });
  [[0, 0, 0.55, 0.16, 0], [-0.45, 0.48, 0.17, 0.55, -0.45], [0.45, 0.48, 0.17, 0.55, 0.45], [-0.48, -0.42, 0.34, 0.42, 0.2], [0.48, -0.42, 0.34, 0.42, -0.2]].forEach(([x, y, rx, ry, rz]) => { const g = ell3(rx, ry, 0.27, null, 24); g.rotateZ(rz); g.translate(...Q(x, y).toArray()); const m = new THREE.Mesh(g, grayM); MG.add(m); });
  const NRN = Q(-0.55, 0.62, 0.3), DRG = Q(-2.5, 1.25, 0.1), SNV = Q(-3.3, 0.4, 0.1), GANG = Q(-2.85, -1.3, 0.15), HEARTP = Q(-6.0, -2.0, 0.2), SKINP = Q(-7.2, 2.6, 0.2), BRAIN = Q(1.3, 3.7, 0.2);
  const nervM = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xf4c542).multiplyScalar(0.55), emissive: 0x403000, emissiveIntensity: 0.25, roughness: 0.4 });
  const C3 = (pts) => new THREE.CatmullRomCurve3(pts);
  const nerve = (c, r = 0.05, mat = nervM) => { MG.add(new THREE.Mesh(new THREE.TubeGeometry(c, 60, r, 8), mat)); return c; };
  // корешки и спинномозговой нерв
  nerve(C3([Q(-0.75, 0.95, 0.2), Q(-1.5, 1.2, 0.15), DRG]), 0.07); nerve(C3([DRG, Q(-2.95, 0.9, 0.1), SNV]), 0.08);
  nerve(C3([Q(-0.85, -0.55, 0.2), Q(-1.8, -0.5, 0.1), Q(-2.8, 0.05, 0.1), SNV]), 0.07, organMat('#E8E0D0', 0.5));
  nerve(C3([SNV, Q(-5.0, 1.0, 0.1), Q(-6.6, 2.1, 0.15), SKINP]), 0.08);
  mmesh(ell3(0.32, 0.22, 0.22, DRG), '#F4C542', { k: 0.55 });
  // симпатический ствол: цепочка узлов, соединительные ветви
  mmesh(new THREE.TubeGeometry(C3([Q(-2.85, 0.2, 0.15), GANG, Q(-2.85, -2.6, 0.15)]), 30, 0.035, 6), '#E8B060', { k: 0.5 });
  [0.2, -1.3, -2.6].forEach((y) => mmesh(ell3(0.16, 0.24, 0.16, Q(-2.85, y, 0.15)), '#E8B060', { k: 0.55 }));
  const RAMUS = nerve(C3([Q(-2.85, 0.2, 0.15), Q(-3.1, 0.32, 0.12), SNV]), 0.04);   // белая соединительная ветвь
  const heartM = mmesh(blobGeo(0.55, 0.62, 0.5, 7, 0.1), '#C84A50', { k: 0.5 }); heartM.position.copy(HEARTP); heartM.rotation.z = 0.5;
  const skin = mmesh(new THREE.BoxGeometry(1.5, 0.9, 0.25), '#E8C0A8', { k: 0.5 }); skin.position.copy(SKINP).add(V3(-0.6, 0.3, 0)); skin.rotation.z = 0.25;
  const brainM = mmesh(blobGeo(0.75, 0.55, 0.6, 3, 0.08), '#E8A8B8', { k: 0.5 }); brainM.position.copy(BRAIN).add(V3(0.2, 0.35, 0));
  const nrnM = mmesh(new THREE.SphereGeometry(0.13, 20, 14), '#FFD27A', { k: 0.8 }); nrnM.position.copy(NRN);
  // пути импульса
  const VISC = [nerve(C3([HEARTP.clone().add(V3(0.4, 0.4, 0)), Q(-4.2, -1.7, 0.15), GANG]), 0.03), C3([GANG, Q(-2.85, -0.6, 0.15), Q(-2.85, 0.2, 0.15)]), RAMUS, C3([SNV, Q(-2.95, 0.9, 0.1), DRG]), C3([DRG, Q(-1.5, 1.2, 0.15), Q(-0.75, 0.95, 0.2), NRN])];
  const SOMA = [C3([SKINP, Q(-6.6, 2.1, 0.15), Q(-5.0, 1.0, 0.1), SNV]), VISC[3], VISC[4]];
  const ASC = nerve(C3([NRN, Q(-0.2, 0.15, 0.3), Q(0.05, -0.15, 0.3), Q(0.95, -0.55, 0.3), Q(1.15, -0.6, 0.8), Q(1.6, 0.8, 0.6), Q(1.5, 2.4, 0.3), BRAIN]), 0.045, organMat('#FF8A5A', 0.6, { emissiveIntensity: 0.2 }));
  const MIS = new THREE.QuadraticBezierCurve3(BRAIN.clone(), Q(-3.0, 5.2, 0.4), SKINP.clone().add(V3(0, 0.45, 0)));
  const misLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(MIS.getPoints(60)), new THREE.LineDashedMaterial({ color: 0xff8a5a, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0 })); misLine.computeLineDistances(); MG.add(misLine);
  const runOf = (cs) => pathRunner(cs.map((c) => ({ c, d: c.getLength() / 4.2 })));
  const fx = new Sparks(2000, 0.06); scene.add(fx.obj);
  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'map', sel: null, side: null, labels: true, rot: false, fly: null, msg: null, cs: 'mi', stage: 0, stT: 0, auto: true, sig: null, sigT: 0, glow: 0, skinGlow: 0, nGlow: 0, bGlow: 0 };
  const zoneSet = () => {
    if (st.mode === 'cases') { const c = RF_CASES[st.cs], s = c.st[st.stage], col = new THREE.Color(ORG[c.o].col); return Object.fromEntries(s.z.map((z) => [z, col])); }
    if (st.mode !== 'map') return {};
    const list = st.sel ? [ORG[st.sel]] : RF_ORG.map((o) => ORG[o.id]); const out = {};
    list.forEach((o) => o.z.forEach((z) => { if (!out[z]) out[z] = new THREE.Color(o.col); })); return out;
  };
  function applyZones() { const zs = zoneSet(); BL.forEach((b) => { b.tw = zs[b.zid] ? (st.sel ? 1 : 0.5) : 0;   /* в обзоре штриховка зон слабее — органы видны */ if (zs[b.zid]) b.col.copy(zs[b.zid]); }); }
  function orgFocus(id) { RF_ORG.forEach((o) => ORG[o.id].mats.forEach((m) => { const on = !id || id === o.id; m.opacity = !on ? 0.18 : id === o.id ? 0.5 : 1; m.depthWrite = on; m.emissiveIntensity = id === o.id ? 0.45 : 0.06; m.needsUpdate = true; })); }
  function select(id) { st.sel = id === 'all' ? null : id; const was = st.mode; if (st.mode !== 'map') { setMode('map', true); } st.msg = null; orgFocus(st.sel); applyZones(); if (!st.side || was !== 'map') st.fly = VV(st.side || (st.sel ? ORG[st.sel].view : 'front')); refs.seg && refs.seg.sync(); refs.setInfo && refs.setInfo(); }
  function setMode(m, keepSel, sig) { st.mode = m; st.msg = null; G.visible = m !== 'mech'; MG.visible = m === 'mech';
    if (m === 'cases') { st.stage = 0; st.stT = 0; orgFocus(RF_CASES[st.cs].o); st.fly = VV(st.side || RF_CASES[st.cs].st[0].view); }
    else if (m === 'map') { if (!keepSel) { orgFocus(st.sel); st.fly = VV(st.side || (st.sel ? ORG[st.sel].view : 'front')); } }
    else { st.fly = VV('mech'); fire(sig || 'visc'); }
    if (refs.gOrg) { refs.gOrg.style.display = m === 'map' ? '' : 'none'; refs.gCase.style.display = m === 'cases' ? '' : 'none'; refs.gImp.style.display = m === 'mech' ? '' : 'none'; }
    applyZones(); refs.modeSeg && refs.modeSeg.sync(); refs.seg && refs.seg.sync(); refs.csSeg && refs.csSeg.sync(); refs.impSeg && refs.impSeg.sync(); refs.setInfo && refs.setInfo(); }
  function setCase(c) { st.cs = c; if (st.mode !== 'cases') setMode('cases'); else { st.stage = 0; st.stT = 0; orgFocus(RF_CASES[c].o); st.fly = VV(st.side || RF_CASES[c].st[0].view); applyZones(); refs.setInfo(); } refs.csSeg && refs.csSeg.sync(); }
  function nextStage() { const c = RF_CASES[st.cs]; st.stage = (st.stage + 1) % c.st.length; st.stT = 0; st.fly = VV(st.side || c.st[st.stage].view); applyZones(); refs.setInfo(); }
  function fire(kind) { if (st.mode !== 'mech') { setMode('mech', false, kind); return; } st.sig = { kind, t0: st.t, run: runOf(kind === 'visc' ? VISC : SOMA), up: pathRunner([{ c: ASC, d: 1.1 }]) }; st.msg = null; refs.impSeg && refs.impSeg.sync(); refs.setInfo(); }
  pickOn(() => self, camera, pick, (id) => { if (st.mode === 'map') select(st.sel === id ? 'all' : id); });
  const C_V = new THREE.Color(0xff6a5a), C_S = new THREE.Color(0x7fd6ff), C_A = new THREE.Color(0xffb070);
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot && !st.fly; controls.autoRotateSpeed = 0.5;
    flyStep(st, camera, controls, dt);
    zU.uT.value = t;
    BL.forEach((b, i) => { if (i >= MAXB) return; b.w += (b.tw - b.w) * Math.min(1, dt * 3); zU.uW.value[i] = b.w; zU.uK.value[i].copy(b.col); });
    if (st.mode === 'cases' && st.auto) { st.stT += dt; if (st.stT > 14 && st.stage < RF_CASES[st.cs].st.length - 1) nextStage(); }
    if (st.mode === 'mech' && st.sig && st.sig.run) {
      const k = t - st.sig.t0, run = st.sig.run, T1 = run.total, col = st.sig.kind === 'visc' ? C_V : C_S;
      if (k < T1) { const p = run.at(k).p; for (let j = 0; j < 3; j++) fx.spawn(p.clone().add(randUnit().multiplyScalar(0.04)), V3(0, 0, 0), col, 0.5, 0, 1.4); }
      else if (k < T1 + 1.1) { st.nGlow = 1; const p = st.sig.up.at(k - T1).p; for (let j = 0; j < 3; j++) fx.spawn(p.clone(), V3(0, 0, 0), C_A, 0.5, 0, 1.4); }
      else if (k < T1 + 4.5) { st.bGlow = 1; st.skinGlow = Math.min(1, (k - T1 - 1.1) / 0.6); if (st.sig.kind === 'visc' && k - T1 < 1.3 && !st.msg) { st.msg = TXT.mis; refs.setInfo(); } }
      else if (k > T1 + 6) { fire(st.sig.kind === 'visc' ? 'soma' : 'visc'); }
      misLine.material.opacity = k > T1 + 1.1 && k < T1 + 4.5 ? 0.9 : Math.max(0, misLine.material.opacity - dt * 2);
    }
    st.nGlow = Math.max(0, st.nGlow - dt * 1.5); st.bGlow = Math.max(0, st.bGlow - dt * 1.2); st.skinGlow = Math.max(0, st.skinGlow - dt * 0.6);
    nrnM.material.emissiveIntensity = 0.3 + 2.5 * st.nGlow; brainM.material.emissiveIntensity = 0.12 + 1.2 * st.bGlow; skin.material.emissive.setHex(0xff3020); skin.material.emissiveIntensity = 0.05 + 1.4 * st.skinGlow;
    fx.update(dt);
  }
  const TXT = {
    map: '<b>Отражённая боль.</b> Больной орган часто «болит» не там, где лежит, а на участке кожи — <b>зоне Захарьина — Геда</b>. Нажмите на орган или выберите его в списке, чтобы увидеть его зону. Зоны помогают врачу: боль в левой руке может означать инфаркт, а боль в плече — кровь под диафрагмой.',
    mech: '<b>Почему боль «переезжает».</b> Чувствительные волокна от сердца (красный импульс) идут вместе с симпатическими нервами через симпатический ствол, не прерываясь в его узлах, и по белой соединительной ветви попадают в спинномозговой нерв. Тело этого нейрона лежит в <b>спинномозговом узле</b>, а синапс он образует в заднем роге того же сегмента, куда приходят волокна от кожи (голубой импульс). Оба сходятся на <b>одном нейроне заднего рога</b>; его аксон переходит на другую сторону и поднимается по спиноталамическому пути в таламус. Сигналы от кожи приходят всю жизнь, от сердца — редко, и мозг по привычке относит боль к коже.',
    mis: '<b>Ошибка мозга.</b> Сигнал от сердца пришёл в таламус по тому же пути, что обычно приносит боль от кожи груди и левой руки. Кора «рисует» боль там — пунктирная стрелка показывает, куда мозг её проецирует.',
    cases: '<b>Четыре классических случая.</b> Выберите случай: боль меняет место по мере развития болезни. Этапы сменяются сами, или нажмите «Дальше».',
  };
  const refs = {};
  const labels = [
    // подписи органов: в обзоре — у самих органов (справа или слева по стороне тела), при выборе — у выбранного
    ...RF_ORG.map((o) => { const OV = { spleen: V3(0.95, 11.5, -0.1) }, op = OV[o.id] ? OV[o.id].clone() : ORG[o.id].meshes[0].position.lengthSq() > 0 ? ORG[o.id].meshes[0].position.clone() : ({ eso: V3(0.03, 13.9, 0.0), colon: V3(0.95, 9.7, 0.5), appendix: V3(-0.6, 9.36, 0.68), small: V3(0.05, 10.0, 0.75), kidney: V3(0.6, 11.2, -0.32) }[o.id] || V3(0, 10, 0));
      const side = { heart: 1, eso: -1, stomach: 1, liver: -1, gall: -1, pancreas: 1, spleen: 1, small: 1, appendix: -1, colon: 1, kidney: 1, bladder: -1 }[o.id];
      return { text: o.name.toLowerCase(), pos: op.clone().add(V3(side * 0.05 + (side > 0 && !mqm.matches ? 0.55 : 0), 0, 0.35)), color: o.col, show: () => st.labels && st.mode === 'map' && (st.sel ? st.sel === o.id : st.side !== 'back') }; }),
    ...Object.entries(ZONES).map(([zid, arr]) => ({ text: 'боль ощущается здесь', pos: arr[0].p.clone().add(V3(0.1, 0.05, Math.sign(arr[0].p.z - 0.18) * 0.12)), color: '#FFD0A0', show: () => st.labels && ((st.mode === 'map' && st.sel && (ORG[st.sel].lz || ORG[st.sel].z[0]) === zid) || (st.mode === 'cases' && RF_CASES[st.cs].st[st.stage].z[RF_CASES[st.cs].st[st.stage].z.length - 1] === zid)) })),
    { text: 'спинной мозг, срез', pos: Q(0.0, -1.55, 0.3), color: '#F2E6C8', show: () => st.labels && st.mode === 'mech' },
    { text: 'нейрон заднего рога', pos: NRN.clone().add(V3(-0.2, 0.45, 0.3)), color: '#FFD27A', show: () => st.labels && st.mode === 'mech' },
    { text: 'белая ветвь', pos: Q(-3.75, -0.3, 0.3), color: '#F4C542', show: () => st.labels && st.mode === 'mech' },
    { text: 'спиноталамический путь', pos: Q(1.2, -0.75, 0.6), color: '#FF8A5A', show: () => st.labels && st.mode === 'mech' },
    { text: 'спинномозговой узел', pos: DRG.clone().add(V3(0, 0.3, 0.2)), color: '#F4C542', show: () => st.labels && st.mode === 'mech' },
    { text: 'симпатический ствол', pos: Q(-2.7, -2.3, 0.3), color: '#E8B060', show: () => st.labels && st.mode === 'mech' },
    { text: 'сердце', pos: HEARTP.clone().add(V3(0.5, -0.5, 0.4)), color: '#FF6A5A', show: () => st.labels && st.mode === 'mech' },
    { text: 'кожа груди и левой руки', pos: SKINP.clone().add(V3(-0.6, 1.15, 0.2)), color: '#7FD6FF', show: () => st.labels && st.mode === 'mech' },
    { text: 'в таламус и кору', pos: BRAIN.clone().add(V3(0.95, 0.4, 0.2)), color: '#FFB070', show: () => st.labels && st.mode === 'mech' },
    { text: 'передний рог', pos: Q(0.35, -0.95, 0.3), color: '#C8B0D8', show: () => st.labels && st.mode === 'mech' },
  ];
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'map' ? (st.sel ? ORG[st.sel].text : TXT.map) : st.mode === 'cases' ? RF_CASES[st.cs].st[st.stage].t : TXT.mech); };
    refs.modeSeg = seg([{ id: 'map', label: 'Карта зон' }, { id: 'mech', label: 'Механизм' }, { id: 'cases', label: 'Случаи' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'Все' }, ...RF_ORG.map((o) => ({ id: o.id, label: o.name, color: o.col }))], () => (st.mode === 'map' ? st.sel || 'all' : null), (v) => select(v));
    const sideSeg = seg([{ id: 'auto', label: 'Авто' }, { id: 'front', label: 'Спереди' }, { id: 'back', label: 'Сзади' }], () => st.side || 'auto', (v) => { st.side = v === 'auto' ? null : v; if (st.mode === 'mech') setMode('map', true); st.fly = VV(st.side || (st.mode === 'cases' ? RF_CASES[st.cs].st[st.stage].view : st.sel ? ORG[st.sel].view : 'front')); });
    refs.csSeg = seg(Object.entries(RF_CASES).map(([k, c]) => ({ id: k, label: c.name })), () => (st.mode === 'cases' ? st.cs : null), (v) => setCase(v));
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    refs.lab = lab;
    refs.impSeg = seg([{ id: 'visc', label: 'От сердца', color: '#FF6A5A' }, { id: 'soma', label: 'От кожи', color: '#7FD6FF' }], () => (st.mode === 'mech' && st.sig ? st.sig.kind : null), (v) => fire(v));
    refs.gOrg = h('div', { class: 'grp', style: 'flex:1 1 560px' }, h('div', { class: 'glabel' }, 'Орган', h('kbd', {}, 'клик')), h('div', { class: 'gctl' }, refs.seg));
    refs.gCase = group('Случай', 'C · пробел', refs.csSeg, button('Дальше', () => { if (st.mode !== 'cases') setMode('cases'); else nextStage(); }));
    refs.gImp = group('Импульс', 'V · S', refs.impSeg);
    el.append(group('Режим', '1–3', refs.modeSeg), refs.gOrg, refs.gCase, refs.gImp, group('Вид', 'R · N', sideSeg, refs.rot, lab), ib.el);
    refs.gOrg.style.display = st.mode === 'map' ? '' : 'none'; refs.gCase.style.display = st.mode === 'cases' ? '' : 'none'; refs.gImp.style.display = st.mode === 'mech' ? '' : 'none';
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['map', 'mech', 'cases'][n - 1]); return true; }
    if (k === 'c' || k === 'с') { const ks = Object.keys(RF_CASES); setCase(ks[(ks.indexOf(st.cs) + 1) % ks.length]); return true; }
    if (e.key === ' ') { if (st.mode === 'cases') nextStage(); else if (st.mode === 'mech') fire(st.sig && st.sig.kind === 'visc' ? 'soma' : 'visc'); return true; }
    if (k === 'v' || k === 'м') { fire('visc'); return true; } if (k === 's' || k === 'ы') { fire('soma'); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    if (e.key === 'Escape') { select('all'); return true; }
    return false;
  }
  function stats() {
    const VN = { front: 'спереди', back: 'сзади', rback: 'сзади справа', lback: 'сзади слева', lfront: 'спереди слева' };
    if (st.mode === 'cases') { const c = RF_CASES[st.cs], v = st.side || c.st[st.stage].view; return [['Этап', (st.stage + 1) + ' из ' + c.st.length, ''], ['Время', c.st[st.stage].time, '']]; }
    if (st.mode === 'mech') return [['Сегмент', 'T1–T4', ''], ['Нейронов на пути', 3, '']];
    return st.sel ? [['Сегменты', ORG[st.sel].seg, ''], ['Вид', VN[st.side || ORG[st.sel].view], '']] : [['Органов', RF_ORG.length, ''], ['Зон', Object.keys(ZONES).length, '']];
  }
  setMode('map'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  const self = {
    mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#FF8A6A',
    kicker: 'Тело · нервная система', title: 'Отражённая боль',
    lede: 'Почему при инфаркте болит левая рука, а при аппендиците сначала живот вокруг пупка: органы «жалуются» на коже своих сегментов спинного мозга.',
    notes: `
      <div><h2>Зоны Захарьина — Геда</h2>
        <p>В 1889 году терапевт Г. А. Захарьин в Москве и в 1893 году невролог Генри Гед в Лондоне независимо описали, что при болезнях внутренних органов кожа на определённых участках становится болезненной и сверхчувствительной. Эти участки совпадают с <b>дерматомами</b> — полосами кожи, которые иннервирует один сегмент спинного мозга.</p>
        <h3>Висцеральная и соматическая боль</h3>
        <p>Внутренние органы почти не чувствуют разреза или ожога, зато болят при растяжении, спазме, воспалении и нехватке кислорода. Висцеральная боль тупая, плохо локализуется, часто с тошнотой и потливостью. Пристеночная брюшина и плевра иннервируются как кожа — их боль острая и точная.</p></div>
      <div><h2>Условности</h2><ul><li>Зоны показаны по атласу Неттера (BP 13), у разных людей они заметно различаются.</li><li>Зоны сердца, пищевода, аппендикса, мочевого пузыря и задняя зона поджелудочной добавлены по клиническим руководствам: на таблице Неттера их нет.</li><li>Почечная колика показана слева, бывает с любой стороны.</li><li>Срез спинного мозга схематичен, пути укорочены.</li></ul>
        <p><b>Это не руководство к самодиагностике.</b> Сильная боль в груди, животе или пояснице — повод обратиться к врачу.</p></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li>клик: орган</li><li><code>C</code> следующий случай</li><li><code>пробел</code> дальше</li><li><code>V</code> · <code>S</code> импульс</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
