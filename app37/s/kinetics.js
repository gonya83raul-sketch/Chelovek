import { Sparks, THREE, V3, __set_rnd, clamp, gauss, glassMat, group, infoBox, makeControls, mulberry, rand, randUnit, range, rnd, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, PDB, bioStage, cartoon, plotAxes, plotLine } from './kit.js';
Object.assign(BIO_PDB, {"lyz":{"title":"Лизоцим 1AKI","r":26.2,"chains":[{"id":"A","k":"p","seq":"KVFGRCELAAAMKRHGLDNYRGYSLGNWVCAAKFESNFNTQATNRNTDGSTDYGILQINSRWWCNDGRTPGSRNLCNIPCSALLSSDITASVNCAKKIVSDGNGMNAWVAWRNRCKGTDVQAWIRGCRL","num":1,"ss":"CCCCHHHHHHHHHHCCCCCHHHCCHHHHHHHHHHHHCCCCCCEEECCCCCEEECCCCCCCCCCCCCCCCCCCCCCCCCCHHHHHCCCCHHHHHHHHHHHHHCCHHHHCHHHHHHCCCCCHHHHCCCCCC","ca":"pgCx/xj/fgB0/y7/mABe/3L/mwAV/4f/dwAH/8n/uAD5/u//3gAx/87/pwBj/+P/pQBH/yoA8ABU/zEA6QCb/xUAsACr/0UA2ACP/4AAFAG7/28A5QD4/2sAywDs/7IAhQDU/6IAigCW/88AWgCk/wkBUgDu//UAFwALABsBCgDE/zMBBgCi/+8AMwBn/+EAWQBi/58AJwAv/4MA8P9k/4UAGQCR/1cAKwBa/yUA4v9D/yQAy/+K/xYA/f+S/93/5f9Q/8D/m/9i/7v/p/+s/6z/2P+o/3L/7P9f/2r/MwB2/3//NwCn/0T/WwDp/0//OgAGABD/8f/3/x//wf8yABf/df8yAB7/Rv9rAAz/Cv95ADn/xf6ZAC//2v7WAFn/E//qACn/Sf/MAFf/e/+XAET/mv9iAHH/5f9cAGf/GQAkAG7/JQDo/5j/9/8AAND/xf8jAKP/y/9mAMf/k/+WALX/m//aAJP/Yv/9ALj/gv/7AP3/yv/kAPf/9P/4ALv/7v8uAYb/4v8bAT3/yP9gASn/h/9GAQv/YP80AUn/K/9kAWL/L/9vAa3/df9TAbX/lf9YAfr/3P88Ae7/4/8mATcAIgD9ACcAQAA6AQQAVgATAcb/SAAQAXz/HwDSAGz/UwDBADb/hQCzAG7/VwB6AIT/ZABWAEH/rwBLAE7/0AAHAE7/6gAcAJP/sgAWAMf/zgBLAPb/ngCDAOP/YgBUAOj/eAA5ACwAgwCAAEYAPgCVADEAHwBUAEwAPABiAJEAGAClAJAA1v+GAHoA1v9QAK8A5v+CAOUAp/+qANEAdP+FAP0AVf9MANUAk/8fANYAlf/z/5cAS//+/4oAZP8yAFkAc//4/ykAMf/a/xEAU/+a//j/c/+S/zwAMP+Y/18ADf9p/y4AQ/80/yUAef85/1sAW/9N/50AS/8S/8oAcf/f/qAAs/+8/qsA3v/1/o4AHADP/qQAEACj/mcAKgDe/j4AcADa/lwAeACO/mcArgBx/joA1QCy/jgAGwG//lEADgH9/noA","o":"vy0+Tcfin+r5H1A0AElEIC1TOEE0CVQ1ATVVJS1RJU4z+UpDBDZUMkE4x1ILzzBJn/kXQS093iVWtNrMnAL/y7AcSzXYtRnC8yel3PajuxC58C6p7w2e2O+mvxu58hqh+PycvQ+3zC64MQqqNdu0YffrrzIg8V4e2TOzIDpL67y5Fj5M06f4HVTS4EbAE1kpUh7QyMfEJDxHAN6iCgFjo9wDzKwOvhZIowclHBSiHjNQHV/1AGISJj1GVBQynf3xXeXnBPKd41DLrOHTODRB76Id+txd+WMMNDdBSzwaNA9UX+L+Yw0BnfMDP7ojBZ0PIqncQ78l4aQZF9Crx89C+qct11ntsg494BJdxDBArRM0w/lP4B1avyhBrvQ41/hbwiFHsh82yNlJ9jNVwUwQz9dM1q7Z/km7/+Ghufm66iyp+rpHzMA46KAN+6gw2sBDy60SFJ4IKr4/vtHF1qwjJDxHJdGwPSG4XvHhRNHHNx2yY/sJ2hKlR+W/7/diDUW54fhf","brk":[]}],"ligs":[],"res":[{"el":"N C C O C C C O O","xyz":"qf+Q/7f/p/+s/6z/sf+v/5D/pP+6/37/sv/C/77/pP/I/9j/if/V/9f/hP/f/8H/e//Y/+v/","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABgAHAAYACAA=","name":"GLU35","chain":"A"},{"el":"N C C O C C O O","xyz":"iv9xAF7/mv9iAHH/tf9aAGT/tf9RAEz/i/9JAHn/cP9QAIT/bP9iAJT/Xv8/AID/","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAA==","name":"ASP52","chain":"A"},{"el":"N C C O C C C C N C C C C C","xyz":"d//0AOP/gv/7AP3/of/9AP7/qv8MARAAef/oABMAW//jABIATv/NAAkARv/2ABkAM//RAAkALv/qABIAR/8PASQAFf/2ABYALv8cASgAFv8QASEA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkABwAKAAgACQAJAAsACgAMAAsADQAMAA0A","name":"TRP62","chain":"A"},{"el":"N C C O C C C C N C C C C C","xyz":"r//qAPH/yv/kAPf/4v/uAOf/9//zAPT/zf/GAP//uf+8ABIAo/+sAAwAtv/CAC0Alf+nACIAn/+1ADcAxv/RAD8AmP+2AFIAvv/TAFkAqP/GAGMA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkABwAKAAgACQAJAAsACgAMAAsADQAMAA0A","name":"TRP63","chain":"A"},{"el":"N C C O C C O O","xyz":"vv+YANMAp/+qANEAjv+jAOIAf/+3AOYAoP+xALQAmP/OALEAqf/gALYAgf/SAKcA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAA==","name":"ASP101","chain":"A"},{"el":"N C C O C C C C N C C C C C","xyz":"b/8JAEEAc//4/ykAWv/m/ycAWf/U/zgAjf/o/ysApP/6/yUAq/8EAAwAtP8JADgAwP8WAA8Axv8ZACoAtf8IAFQA2v8nADcAx/8YAGEA2v8nAFIA","b":"AAABAAEAAgABAAQAAgADAAQABQAFAAYABQAHAAYACAAHAAkABwAKAAgACQAJAAsACgAMAAsADQAMAA0A","name":"TRP108","chain":"A"}]}});
Object.assign(BIO_MOL, {"arg":{"name":"Аргинин","el":"N C C C C N C N N C O O H H H H H H H H H H H H H H","xyz":"R/8eAFf/Mf8iAOf/K/+Z/yYAlv84//n/HQBc/zgAbQCg/9P/4ADy//j/LQE0AI7/AwECAHIAmf99ACkAof+IAKIA8//HANf/OP96AC//pf8AAEP/zv5TAPb/Lf+h/5MAyP5t/w0An/8z/43/e//T/hwADgCd/44AUAAB/1gAVQCX/3H/EgEoAC3/fQFtAKb/0wDY/78AGAAXAQAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAYACAABAAkACQAKAAkACwAAAAwAAAANAAEADgACAA8AAgAQAAMAEQADABIABAATAAQAFAAFABUABwAWAAcAFwAIABgACwAZAA==","o":"1111111212111111111111111"},"pep":{"name":"Фосфоенолпируват","el":"O C O C C O P O O O H H H H H","xyz":"1P4PAMn/UP8sAAcAbf+fACIAs/+7/ygAlv88/wsALwDb/2YAowAIAPn/HwGx/w0AagD0/1//ywCnABEAi/5LAN3/3//u/iQAOP8h/9v/NABCAE3/fgDPAD0A","b":"AAABAAEAAgABAAMAAwAEAAMABQAFAAYABgAHAAYACAAGAAkAAAAKAAQACwAEAAwACAANAAkADgA=","o":"12121121111111"}});


// @scene kinetics makeKinetics | Скорость реакции и ингибиторы | Ферменты
/* =========================================================
   БИОХИМИЯ · КИНЕТИКА: живая модель — ферменты и субстрат в растворе,
   насыщение (Михаэлис — Ментен), температура, pH, три типа ингибиторов
   ========================================================= */
const KN_ENZ = [
  { id: 'pep', name: 'Пепсин', opt: 1.8, text: 'пепсин желудка (оптимум pH 1,5–2)' },
  { id: 'amy', name: 'Амилаза', opt: 6.9, text: 'амилаза слюны (оптимум pH ≈ 6,8–7)' },
  { id: 'try', name: 'Трипсин', opt: 8.0, text: 'трипсин кишечника (оптимум pH ≈ 7,8–8,2)' },
  { id: 'arg', name: 'Аргиназа', opt: 10.0, text: 'аргиназа печени (оптимум pH ≈ 10)' },
];
const KN_INH = {
  none: { name: 'Нет', color: '#9FA8B8', text: '' },
  comp: { name: 'Конкурентный', color: '#FF5A5A', text: '<b>Конкурентный ингибитор</b> (красные шарики) похож на субстрат и занимает активный центр. Чем больше субстрата, тем реже ингибитор успевает сесть: при высоком [S] скорость всё равно достигает <b>Vmax</b>, но <b>Km растёт</b>. Так работают аллопуринол (против подагры), статины, метотрексат, прозерин.' },
  nonc: { name: 'Неконкурентный', color: '#C77DFF', text: '<b>Неконкурентный ингибитор</b> (фиолетовые) не похож на субстрат и садится в другое место фермента, меняя его форму. Избыток субстрата не помогает: <b>Vmax падает</b>, а Km не меняется. Так действуют ионы тяжёлых металлов на SH-группы ферментов; сюда же относится аллостерическое торможение конечным продуктом.' },
  irr: { name: 'Необратимый', color: '#FF8A2A', text: '<b>Необратимый ингибитор</b> (оранжевые) пришивается к ферменту ковалентной связью — фермент выбывает навсегда (тёмные модели). Работа восстанавливается только с синтезом новых молекул фермента. Примеры: цианид (цитохромоксидаза), зарин и фосфорорганические яды (холинэстераза), аспирин (циклооксигеназа), пенициллин (транспептидаза бактерий).' },
};
function makeKinetics() {
  __set_rnd(mulberry(611));
  const scene = bioStage({ rim: 0xf2c14e });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.set(DK ? -1.6 : 0.3, 3.6, DK ? 24 : 18.5);
  const controls = makeControls(camera, V3(DK ? -3.1 : -1.2, -1.4, 0)); controls.minDistance = 4; controls.maxDistance = 30;
  const BX = 5.2, BY = 2.0, BZ = 2.8, NE = 14, NP = 520, SC = 0.034;
  // контейнер-«кювета»
  const box = new THREE.Mesh(new THREE.BoxGeometry(BX * 2 + 0.6, BY * 2 + 0.6, BZ * 2 + 0.6), glassMat(0x9fd0ff, { rim: 0.25, base: 0.006, pow: 3 })); scene.add(box);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: 0x3a4a60, transparent: true, opacity: 0.6 })); scene.add(edges);
  // ферменты — копии реального лизоцима
  const L = PDB('lyz');
  const eGeo = cartoon(L.chains[0], { scale: SC, color: (i, n, s) => s === 'H' ? '#E46FA8' : s === 'E' ? '#C8B8E8' : '#9FB4D8', k: 0.75 }).geometry; // β-тяжи сиреневые — не путать с жёлтым субстратом
  const eMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.5, envMapIntensity: 0.45, side: THREE.DoubleSide });
  const ENZ = new THREE.InstancedMesh(eGeo, eMat, NE); scene.add(ENZ);
  const cent = (r) => { const v = V3(0, 0, 0); for (let i = 0; i < r.n; i++) v.add(V3(r.xyz[i * 3], r.xyz[i * 3 + 1], r.xyz[i * 3 + 2])); return v.multiplyScalar(SC / r.n); };
  const siteL = cent(L.resm[0]).add(cent(L.resm[1])).multiplyScalar(0.5); siteL.addScaledVector(siteL.clone().normalize(), 0.25);
  const alloL = siteL.clone().negate();
  const E = [];
  for (let i = 0; i < NE; i++) {
    const gx = i % 5, gz = Math.floor(i / 5);
    // копии не должны проходить друг сквозь друга: расстояние между центрами ≥ 1,75 (диаметр белка ≈ 1,5)
    let p = null, best = -1;
    for (let tr = 0; tr < 30; tr++) {
      const c = V3(-BX + 1.1 + gx * (2 * BX - 2.2) / 4 + rand(-0.4, 0.4), rand(-BY + 0.9, BY - 0.9), -BZ + 1.0 + gz * (2 * BZ - 2) / 2 + rand(-0.3, 0.3));
      const dmin = E.reduce((m, o) => Math.min(m, o.p.distanceTo(c)), 99); if (dmin > best) { best = dmin; p = c; } if (dmin >= 1.75) break;
    }
    E.push({ p, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(0, 6), rand(0, 6), rand(0, 6))), w: randUnit(), state: 'free', tm: 0, dead: false, nc: 0, den: rand(0, 1) });
  }
  const siteMark = new THREE.InstancedMesh(new THREE.TorusGeometry(0.09, 0.02, 6, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }), NE); scene.add(siteMark);
  // аллостерические центры — видны, когда выбран неконкурентный ингибитор
  const alloMark = new THREE.InstancedMesh(new THREE.TorusGeometry(0.09, 0.02, 6, 16), new THREE.MeshBasicMaterial({ color: 0xc77dff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }), NE); scene.add(alloMark);
  // частицы: S — субстрат, P — продукт, C/N/X — ингибиторы
  const PT = { S: '#F2C14E', P: '#5CE07A', C: '#FF5A5A', N: '#C77DFF', X: '#FF8A2A' };
  const PM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.075, 2), new THREE.MeshPhysicalMaterial({ roughness: 0.3, clearcoat: 0.8, envMapIntensity: 0.6 }), NP); PM.frustumCulled = false; scene.add(PM);
  const P = []; for (let i = 0; i < NP; i++) P.push({ on: false, t: 'S', p: V3(0, 0, 0), v: V3(0, 0, 0), age: 0, bound: -1 });
  const fx = new Sparks(900, 0.07); scene.add(fx.obj);
  const dm = new THREE.Object3D(), col = new THREE.Color();
  const st = { t: 0, S: 0.35, T: 37, pH: 7, enz: 'amy', inh: 'none', I: 0.4, lb: false, labels: true, rot: false, made: [], v: 0, busy: 0, msg: null, hist: [] };
  const enzObj = () => KN_ENZ.find((e) => e.id === st.enz);
  // теория
  const KM = 0.22;
  const fT = (T) => Math.pow(2, (T - 37) / 10) * (1 - smooth(41, 58, T));
  const fpH = (pH) => Math.exp(-(((pH - enzObj().opt) / 1.6) ** 2));
  const Ieff = () => (st.inh === 'none' ? 0 : st.I);
  const theory = (S, inh = st.inh) => {
    const vmax = fT(st.T) * fpH(st.pH) * (inh === 'nonc' ? 1 / (1 + Ieff() * 2.2) : inh === 'irr' ? Math.max(0, 1 - Ieff() * 0.9) : 1);
    const km = KM * (inh === 'comp' ? 1 + Ieff() * 3 : 1);
    return vmax * S / (km + S);
  };
  function count(t) { return P.filter((x) => x.on && x.t === t).length; }
  function spawn(t, at) { const x = P.find((y) => !y.on); if (!x) return null; x.on = true; x.t = t; x.age = 0; x.bound = -1; x.p.copy(at || V3(rand(-BX, BX), rand(-BY, BY), rand(-BZ, BZ))); x.v.copy(randUnit().multiplyScalar(0.3)); return x; }
  function resetInh() { P.forEach((x) => { if (x.on && 'CNX'.includes(x.t)) { x.on = false; if (x.bound >= 0) { const e = E[x.bound]; if (e) { e.state = 'free'; } } } }); E.forEach((e) => { e.dead = false; e.nc = 0; if (e.state === 'inh') e.state = 'free'; }); }
  const siteW = (e, out, loc = siteL) => out.copy(loc).applyQuaternion(e.q).add(e.p);
  const tmpA = V3(0, 0, 0), tmpB = V3(0, 0, 0);
  for (let i = 0; i < 160; i++) spawn('S');
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4;
    const temp = 0.55 * Math.sqrt((st.T + 273) / 310);
    // поддержание концентраций
    const wantS = Math.round(st.S * 320), haveS = count('S') + E.filter((e) => e.state === 'busy').length;
    if (haveS < wantS) for (let k = 0; k < Math.min(6, wantS - haveS); k++) spawn('S'); else if (haveS > wantS + 3) { const x = P.find((y) => y.on && y.t === 'S' && y.bound < 0); if (x) x.on = false; }
    const it = { comp: 'C', nonc: 'N', irr: 'X' }[st.inh];
    if (it) { const want = Math.round(st.I * 110), have = count(it); if (have < want) spawn(it); else if (have > want + 2) { const x = P.find((y) => y.on && y.t === it && y.bound < 0); if (x) x.on = false; } }
    const kact = fT(st.T) * fpH(st.pH);
    // ферменты
    E.forEach((e, i) => {
      const denat = e.den < smooth(42, 60, st.T);
      e.q.multiply(new THREE.Quaternion().setFromAxisAngle(e.w, dt * (denat ? 1.5 : 0.25)));
      if (denat && e.state === 'busy') { e.state = 'free'; spawn('S', siteW(e, tmpA)); }
      e.denat = denat;
      if (e.state === 'busy') {
        e.tm -= dt * Math.max(0.02, kact) * (e.nc > 0 ? 0 : 1);
        if (e.tm <= 0) { e.state = 'free'; const x = spawn('P', siteW(e, tmpA)); if (x) x.v.copy(siteL.clone().applyQuaternion(e.q).normalize().multiplyScalar(1.2)); st.made.push(t); for (let k = 0; k < 8; k++) fx.spawn(siteW(e, tmpA).clone(), randUnit().multiplyScalar(0.4), new THREE.Color(0x5ce07a), 0.5, 2, 1.2); }
      }
      if (e.state === 'inh') { e.tm -= dt; if (e.tm <= 0 && !e.dead) { e.state = 'free'; const x = spawn('C', siteW(e, tmpA)); if (x) x.v.copy(randUnit().multiplyScalar(0.8)); } }
      if (e.nc > 0) { e.nc -= dt; if (e.nc <= 0) { const x = spawn('N', siteW(e, tmpA, alloL)); if (x) x.v.copy(randUnit().multiplyScalar(0.8)); } }
      dm.position.copy(e.p); dm.quaternion.copy(e.q); if (denat) { const w = 0.06 * Math.sin(t * 9 + i); dm.scale.set(1.25 + w, 0.7 - w, 1.1); } else dm.scale.setScalar(1); dm.updateMatrix(); ENZ.setMatrixAt(i, dm.matrix); // денатурация: глобула расплющивается
      ENZ.setColorAt(i, col.set(e.dead ? '#8a5a48' : denat ? '#6a6a70' : e.nc > 0 ? '#b8a0ff' : '#ffffff'));
      siteW(e, tmpA); dm.position.copy(tmpA); dm.quaternion.identity(); dm.scale.setScalar(e.state === 'busy' ? 1.4 + 0.3 * Math.sin(t * 12) : e.state === 'inh' ? 1.0 : e.state === 'free' && !denat ? 0.7 : 0.001); dm.updateMatrix(); siteMark.setMatrixAt(i, dm.matrix);
      siteW(e, tmpA, alloL); dm.position.copy(tmpA); dm.scale.setScalar(st.inh === 'nonc' && !denat && !e.dead ? (e.nc > 0 ? 1.3 : 0.8) : 0.001); dm.updateMatrix(); alloMark.setMatrixAt(i, dm.matrix);
      siteMark.setColorAt(i, col.set(e.state === 'busy' ? '#FFD070' : e.dead ? '#FF8A2A' : e.state === 'inh' ? '#FF5A5A' : '#FFFFFF'));
    });
    ENZ.instanceMatrix.needsUpdate = true; ENZ.instanceColor.needsUpdate = true; siteMark.instanceMatrix.needsUpdate = true; siteMark.instanceColor.needsUpdate = true; alloMark.instanceMatrix.needsUpdate = true;
    // частицы: броуновское движение и захват
    let k = 0;
    P.forEach((x) => {
      if (!x.on) return;
      x.age += dt;
      x.v.x += gauss() * temp * 2.2 * dt; x.v.y += gauss() * temp * 2.2 * dt; x.v.z += gauss() * temp * 2.2 * dt; x.v.multiplyScalar(Math.exp(-1.2 * dt));
      x.p.addScaledVector(x.v, dt);
      if (Math.abs(x.p.x) > BX) { x.p.x = Math.sign(x.p.x) * BX; x.v.x *= -1; } if (Math.abs(x.p.y) > BY) { x.p.y = Math.sign(x.p.y) * BY; x.v.y *= -1; } if (Math.abs(x.p.z) > BZ) { x.p.z = Math.sign(x.p.z) * BZ; x.v.z *= -1; }
      if (x.t === 'P' && x.age > 3.5) { x.t = 'S'; x.age = 0; x.p.set(rand(-BX, BX), Math.sign(rand(-1, 1)) * BY, rand(-BZ, BZ)); }
      if (x.t === 'S' || x.t === 'C' || x.t === 'X' || x.t === 'N') {
        for (let i = 0; i < NE; i++) {
          const e = E[i]; if (e.denat) continue;
          if (x.t === 'N') { if (e.nc > 0 || e.dead) continue; siteW(e, tmpB, alloL); if (tmpB.distanceToSquared(x.p) < 0.3) { e.nc = 4.5; x.on = false; break; } continue; }
          if (e.state !== 'free' || e.dead) continue;
          siteW(e, tmpB); if (tmpB.distanceToSquared(x.p) < 0.3) {
            if (x.t === 'S') { e.state = 'busy'; e.tm = 1.6; x.on = false; }
            else if (x.t === 'C') { e.state = 'inh'; e.tm = 2.4; x.on = false; }
            else { e.state = 'inh'; e.dead = true; e.tm = 1e9; x.on = false; for (let q = 0; q < 14; q++) fx.spawn(tmpB.clone(), randUnit().multiplyScalar(0.5), new THREE.Color(0xff8a2a), 0.7, 2, 1.3); }
            break;
          }
        }
      }
      if (!x.on) return;
      dm.position.copy(x.p); dm.quaternion.identity(); dm.scale.setScalar(x.t === 'P' ? 0.85 : 1); dm.updateMatrix(); PM.setMatrixAt(k, dm.matrix); PM.setColorAt(k, col.set(PT[x.t]).multiplyScalar(0.8)); k++;
    });
    PM.count = k; PM.instanceMatrix.needsUpdate = true; if (PM.instanceColor) PM.instanceColor.needsUpdate = true;
    while (st.made.length && st.made[0] < t - 6) st.made.shift();
    const vmaxSim = NE / 1.6;
    st.v = st.made.length / 6; st.vn = st.v / vmaxSim; st.busy = E.filter((e) => e.state === 'busy').length / NE;
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    if (!st.lb) {
      const A = plotAxes(ctx, w, h, { title: 'скорость v от концентрации [S]', xl: '[S] →', yl: 'v' });
      ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(1)); ctx.lineTo(A.X(1), A.Y(1)); ctx.stroke(); ctx.setLineDash([]);
      plotLine(ctx, A, (u) => theory(u, 'none') / Math.max(0.05, fT(st.T) * fpH(st.pH)) * 0.9, 'rgba(255,255,255,.3)', { lw: 1.2 });
      plotLine(ctx, A, (u) => theory(u) * 0.9, KN_INH[st.inh].color === '#9FA8B8' ? '#7FD6FF' : KN_INH[st.inh].color, { lw: 2 });
      ctx.fillStyle = '#FFD070'; ctx.beginPath(); ctx.arc(A.X(st.S), A.Y(clamp(theory(st.S) * 0.9, 0, 1.05)), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText('Vmax', A.X(0.02), A.Y(1) - 3);
      const km = KM * (st.inh === 'comp' ? 1 + Ieff() * 3 : 1); if (km < 1) { ctx.strokeStyle = 'rgba(242,193,78,.5)'; ctx.beginPath(); ctx.moveTo(A.X(km), A.Y(0)); ctx.lineTo(A.X(km), A.Y(theory(km) * 0.9)); ctx.stroke(); ctx.fillStyle = '#F2C14E'; ctx.fillText('Km', A.X(km) + 3, A.Y(0) - 4); }
    } else {
      const A = plotAxes(ctx, w, h, { title: 'Лайнуивер — Берк: 1/v от 1/[S]', xl: '1/[S] →', yl: '1/v' });
      const line = (inh, c) => plotLine(ctx, A, (u) => { const S = 1 / (0.2 + u * 9.8); return clamp((1 / Math.max(0.02, theory(S, inh))) / 5, 0, 1.2); }, c, { lw: inh === st.inh ? 2 : 1.2 });
      line('none', 'rgba(255,255,255,.35)'); if (st.inh !== 'none') line(st.inh, KN_INH[st.inh].color);
    }
  }
  const labels = [
    { text: 'фермент (модель — лизоцим, PDB 1AKI)', pos: E[4].p.clone().add(V3(-0.6, 1.0, 0)), color: '#E46FA8', show: () => st.labels },
    { text: 'субстрат', pos: V3(-0.2, BY + 0.5, -BZ), color: PT.S, show: () => st.labels },
    { text: 'продукт', pos: V3(1.6, BY + 0.5, -BZ), color: PT.P, show: () => st.labels },
    ...['comp', 'nonc', 'irr'].map((k) => ({ text: 'ингибитор', pos: V3(3.3, BY + 0.5, -BZ), color: KN_INH[k].color, show: () => st.labels && st.inh === k })),
  ];
  const refs = {};
  function cond() {
    if (st.T > 47) return '<b>Денатурация.</b> Выше ~45 °C белок-фермент теряет форму (серые модели дрожат и разворачиваются), активный центр разрушается — реакция почти останавливается. Поэтому опасна температура тела выше 41–42 °C.';
    if (st.T < 20) return '<b>Холод.</b> Молекулы движутся медленнее и реже сталкиваются: скорость падает примерно вдвое на каждые 10 °C. Но фермент не разрушен — при нагреве он оживёт (на этом основана заморозка продуктов и органов).';
    if (fpH(st.pH) < 0.3) return `<b>Неподходящий pH.</b> Для фермента «${enzObj().name}» оптимум — ${enzObj().text.split('(')[1].replace(')', '')}. При чужом pH меняется заряд групп активного центра, субстрат связывается плохо.`;
    return null;
  }
  function ui(el) {
    const ib = infoBox('1 1 400px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || cond() || KN_INH[st.inh].text || '<b>Скорость реакции</b> растёт с концентрацией субстрата [S], пока свободны ферменты. Когда все активные центры заняты (жёлтые огоньки), наступает <b>насыщение</b> — скорость достигает <b>Vmax</b>. <b>Km</b> (константа Михаэлиса) — концентрация, при которой скорость равна половине максимальной: чем меньше Km, тем сильнее фермент «любит» субстрат. Это уравнение Михаэлиса — Ментен: v = Vmax·[S] / (Km + [S]).'; };
    const s1 = range('kS', 0.02, 1, 0.01, () => st.S, (v) => { st.S = v; }, (v) => `${Math.round(v * 100)}%`);
    const s2 = range('kT', 0, 70, 1, () => st.T, (v) => { st.T = v; refs.setInfo(); }, (v) => `${v} °C`);
    const s3 = range('kpH', 1, 12, 0.1, () => st.pH, (v) => { st.pH = v; refs.setInfo(); }, (v) => `pH ${v.toFixed(1)}`);
    refs.enzSeg = seg(KN_ENZ.map((e) => ({ id: e.id, label: e.name })), () => st.enz, (v) => { st.enz = v; st.pH = enzObj().opt; s3.querySelector('input').value = st.pH; s3.querySelector('output').textContent = `pH ${st.pH.toFixed(1)}`; refs.setInfo(); });
    refs.inhSeg = seg(Object.entries(KN_INH).map(([k, v]) => ({ id: k, label: v.name, color: v.color })), () => st.inh, (v) => { resetInh(); st.inh = v; refs.setInfo(); });
    const s4 = range('kI', 0, 1, 0.01, () => st.I, (v) => { st.I = v; }, (v) => `${Math.round(v * 100)}%`);
    const lb = toggle('Лайнуивер — Берк', () => st.lb, (v) => { st.lb = v; });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab, lb });
    el.append(group('Субстрат [S]', '', s1), group('Температура', '', s2), group('Фермент и pH', '', refs.enzSeg, s3), group('Ингибитор', '1–4', refs.inhSeg, s4), group('Вид', 'L · R · N', lb, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { refs.inhSeg.querySelectorAll('button')[n - 1].click(); return true; }
    if (k === 'l' || k === 'д') { refs.lb.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Скорость', st.v.toFixed(1), 'реакций/с'], ['Заняты', Math.round(st.busy * 100), '% ферментов'], ['Активность', Math.round(fT(st.T) * fpH(st.pH) * 100), '%']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Биохимия · кинетика', title: 'Скорость реакции и ингибиторы',
    lede: 'Живая модель раствора: 14 молекул фермента ловят субстрат. Меняйте концентрацию, температуру, pH и добавляйте ингибиторы — график Михаэлиса — Ментен меняется вместе с моделью.',
    notes: `
      <div><h2>От чего зависит скорость</h2>
        <p><b>Концентрация субстрата.</b> При малом [S] скорость растёт почти линейно, при большом — выходит на плато <b>Vmax</b>: все ферменты заняты (насыщение). <b>Km</b> равна [S], при которой v = ½ Vmax; она обратна сродству фермента к субстрату.</p>
        <p><b>Температура.</b> До оптимума (~37–40 °C) скорость растёт примерно в 2 раза на каждые 10 °C, выше 45–50 °C белок денатурирует (термолабильность).</p>
        <p><b>pH.</b> У каждого фермента свой оптимум: пепсин работает в кислом желудке (pH 1,5–2), трипсин — в слабощелочном кишечнике (~8). При пониженной кислотности желудочного сока пепсин плохо переваривает белки.</p>
        <p><b>Концентрация фермента</b> — скорость ей прямо пропорциональна. Единица активности: 1 МЕ = 1 мкмоль субстрата за 1 мин; 1 катал = 1 моль за 1 с.</p>
        <h3>Ингибиторы</h3>
        <p><b>Обратимые</b> связываются слабыми связями: <b>конкурентные</b> (аналоги субстрата, ↑Km) и <b>неконкурентные</b> (садятся в другое место, ↓Vmax). <b>Необратимые</b> образуют ковалентную связь — часто это яды. В координатах <b>Лайнуивера — Берка</b> (1/v от 1/[S]) кривая становится прямой: конкурентный ингибитор меняет её наклон, но не точку на оси 1/v, неконкурентный — поднимает эту точку.</p></div>
      <div><h2>Условности</h2><ul><li>Модель качественная: время замедлено в миллионы раз, вода не показана.</li><li>Все 14 ферментов — копии одной структуры (лизоцим, PDB 1AKI); кнопки «фермент и pH» меняют только оптимум pH.</li><li>Продукты через несколько секунд снова становятся субстратом — так концентрация держится постоянной.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>4</code> ингибитор</li><li><code>L</code> график Лайнуивера — Берка</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeKinetics };
