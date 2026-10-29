import { Sparks, THREE, V3, __set_rnd, clamp, gauss, group, infoBox, makeControls, mulberry, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, MOL, PDB, bioStage, blobGeo, molMesh, plotAxes, protMat, schemBilayer } from './kit.js';
Object.assign(BIO_PDB, {"fdx":{"title":"Ферредоксин 1BLU","r":19.8,"chains":[{"id":"A","k":"p","seq":"ALMITDECINCDVCEPECPNGAISQGDETYVIEPSLCTECVGHYETSQCVEVCPVDCIIKDPSHEETEDELRAKYERITG","num":1,"ss":"EEECCCCCCCCCCCCCCCCCCEEEEECCEEEEECCCCCCCCCCCCCHHHHHHCCCCCCEEECCCCCCCHHHHHHHHHHHH","ca":"5P9pAD8A2/8fAFYADAD4/4EAHgCw/4gAFwCZ/9AAQQBm//cAFAAr/+EANgAr/5sATADk/ooAgAD8/lcAXwDb/hwAdwAN/+f/MwAQ/8P/IQBY/8//ZQBz/7f/WwBs/2z/EwCG/3H/IwDO/4X/HwAAAE3/UAAxAG7/hAABAIn/bwAUAM//eQDP/+3/vQCy//3/2gB6/ycA6wCK/24AFQFq/6QA2gBM/8cAngBd/5kAjgB9/1YAhwDI/1wAYQD7/zUAhwA+ACcAUABxADYAaACmAAgAWwB1AM//GABZAOX/3P98AMf/r/9FAN//rf80AJX/hP9yAIb/kP+DAD3/n/89ACf/bP8OAEX/KP8TAGn/RP/t/6X/iP/e/8b/q/+p/6D/2P+S/9n/mf+J/wcAd/9h/9D/r/8s/83/xv8p/xYAt//j/i8As//3/nkAkf87/3cAyv9k/5YAzP+k/24Ao//a/44Anv8lAI8A2/9GAK0Awf9zAOQAAACfAOAA8f+tAJYAp/++AI8Anf/aAEkAXf/rACMASP/SAN7/Yv8WAcn/p/8RAej/rf/KAMv/mf/lAIf/zP8dAZD/AQDrAKX/7/+/AGj/+v/9AD7/PwANAVv/VgDEAFX/PwC7AAz/KQD7AOb+","o":"xg5QWCrrot8KTDIpLMy3QbQK2KrgTfg/JabrUc7gAMeuEES45B2l30vHBGHq9Cilqy3lXfndNSOzRUAjWgUrJhlZI/GkwAJNSkLyEKTbA6Hi4KPtWCbkxQVRKvOmBCBfzgSqqiHa3kG85s6t8URHpSDmpdf43OqlXx8BAQyd39GuDFguySdKOvSvzbMm55/+DKEd6aotya0JLaYBnwwUwbkh/h1gzypMUS8jo+DuXBXf/9JZ81LJ1lsFPkvp6sC2IV4LyqwHVwTPMeetOR6zXQjdUevJQOy2Sx3EWvbWR97CNwWtVgrNUt3SO/Ow3FwP","brk":[]}],"ligs":[{"el":"Fe Fe Fe Fe S S S S","xyz":"BgA2/0AALwBJ/yAANwA3/1QAKgAW/yoATgAu/y0AGwAV/1QADgAw/xUAHwBa/0cA","b":"AAABAAAAAgAAAAMAAAAFAAAABgAAAAcAAQACAAEAAwABAAQAAQAGAAEABwACAAMAAgAEAAIABQACAAcAAwAEAAMABQADAAYA","name":"SF4","chain":"A","seq":101},{"el":"Fe Fe Fe Fe S S S S","xyz":"DgD7/77/7P/k/+H/9v8VAOT/2/8DALj/zv8CAOP//P8hALj/8P/e/7X/EgD2/+v/","b":"AAABAAAAAgAAAAMAAAAFAAAABgAAAAcAAQACAAEAAwABAAQAAQAGAAEABwACAAMAAgAEAAIABQACAAcAAwAEAAMABQADAAYA","name":"SF4","chain":"A","seq":102}],"res":[]}});
Object.assign(BIO_MOL, {"atp":{"name":"АТФ","el":"N C N C N C N C N C C O C C O P O O O P O O O P O O O C O C O H H H H H H H H H H H H H H H H","xyz":"m//TAeX/4P9dARgAwP8sAYwAAQC7AL8AXwB/AHwAhQCuAAEA4gCGAKX/2wDeADn/gAA2AVH/SQAbAc3/PQEXAK3/+ACc/53/FwFA/wMApgDs/joAKgAt/ygA1v/b/rX/rf9R/u7/NQC8/jD/Uf8q/4H///57//b/Q/8DAAwA/P4n/4UAZP6P/8H/Fv4LAAgAfv30//b/Of6bAL7/Mv4YAKoATgGV/3kAsQFN/70AgwEUADYADwIQACMAUv//ARwAtP/5AYr/5f+UACEBFwHaAOH+igEeAGD/aAH//uH/qACI/g8AtgDg/qcABgB2/gD/rP7x/oEA5P3IALT/NP68/8wA+wCt/7sApQHt/rAAZgFrAHAALQJjAPv/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQAGAAoACgALAAsADAAMAA0ADQAOAA4ADwAPABAADwARAA8AEgASABMAEwAUABMAFQATABYAFgAXABcAGAAXABkAFwAaAAwAGwAbABwAGwAdAAoAHQAdAB4AAAAfAAAAIAADACEABwAiAAoAIwAMACQADQAlAA0AJgARACcAFQAoABkAKQAaACoAGwArABwALAAdAC0AHgAuAA==","o":"1212111211211111121112111211111111111111111111111"},"dnp":{"name":"2,4-Динитрофенол","el":"O C C C C C C N O O N O O H H H H","xyz":"6gDQAAAAcwCBAAAAAwDNAAAAfv+RAAAAcv8LAAAA7f+5/wAAagDv/wAA3QCU/wAA0AAZ/wAAZAG4/wAA7/7M/wAA4P5T/wAAef4ZAAAA8gAPAbf/DgA5AQAAKP/TAAAA3v9N/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAYABwAHAAgABwAJAAQACgAKAAsACgAMAAAADQACAA4AAwAPAAUAEAA=","o":"12121211211211111"},"o2":{"name":"Кислород","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"},"h2o":{"name":"Вода","el":"O H H","xyz":"EwAKAB8ACwA/AM7/4v+3/xMA","b":"AAABAAAAAgA=","o":"11"}});


// @scene etc makeEtc | Дыхательная цепь и АТФ-синтаза | Энергия
/* =========================================================
   БИОХИМИЯ · ТКАНЕВОЕ ДЫХАНИЕ: комплексы I–IV, убихинон, цитохром c,
   протонный градиент, АТФ-синтаза-мотор, яды и разобщители
   ========================================================= */
const ETC_POIS = [
  { id: 'rot', name: 'Ротенон', at: 'I', color: '#FF8A5C', text: '<b>Ротенон</b> (яд из корней тропических растений, инсектицид) и барбитураты блокируют <b>комплекс I</b>. НАДН больше не окисляется, но путь от сукцината через комплекс II работает — переключите субстрат на сукцинат.' },
  { id: 'ant', name: 'Антимицин A', at: 'III', color: '#F2C14E', text: '<b>Антимицин A</b> (антибиотик) блокирует <b>комплекс III</b>: электроны застревают на убихиноне, дыхание останавливается для обоих субстратов.' },
  { id: 'cn', name: 'Цианид, CO', at: 'IV', color: '#FF5A5A', text: '<b>Цианид, угарный газ, сероводород, азид</b> связываются с железом гема цитохромоксидазы (<b>комплекс IV</b>). Кислород не принимает электроны, вся цепь стоит, АТФ не образуется — смерть за минуты. Кислорода в крови при этом достаточно: клетки просто не могут им воспользоваться.' },
  { id: 'olig', name: 'Олигомицин', at: 'ATP', color: '#C77DFF', text: '<b>Олигомицин</b> закупоривает протонный канал <b>АТФ-синтазы</b>. Протоны копятся снаружи, градиент становится предельным — и дыхание само замирает: цепь не может качать протоны против слишком высокого градиента. Это <b>дыхательный контроль</b> — дыхание идёт только тогда, когда тратится АТФ.' },
  { id: 'dnp', name: '2,4-Динитрофенол', at: 'leak', color: '#FFB070', text: '<b>Разобщители</b> — 2,4-динитрофенол, высокие дозы аспирина, тироксин, белок <b>термогенин</b> бурого жира — переносят протоны обратно через мембрану в обход АТФ-синтазы. Дыхание идёт с бешеной скоростью, кислород тратится, а АТФ почти не образуется: энергия уходит в <b>тепло</b>. Так греются новорождённые и зимоспящие; ДНФ когда-то продавали «для похудения» — люди умирали от перегрева.' },
];
function makeEtc() {
  __set_rnd(mulberry(1101));
  const scene = bioStage({ bg: 0x08060a, rim: 0xffb070 });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.set(-1.6, 5.0, 25);
  const controls = makeControls(camera, V3(-2.0, -1.0, 0)); controls.minDistance = 4; controls.maxDistance = 40;
  const fx = new Sparks(2600, 0.08); scene.add(fx.obj);
  const MEMY = 0, TH = 0.95;
  const mem = schemBilayer({ w: 17, d: 5.0, thick: TH, step: 0.27, head: '#C8A070', tail: '#8A6A4A', seed: 4 }); mem.position.z = -2.65; scene.add(mem); // «срез»: передний край бислоя чуть позади комплексов — видны трансмембранные части
  // подписи сторон
  const P = (x, y, z = 0) => V3(x, y, z);
  // комплексы
  const C1 = P(-6.2, 0), C2 = P(-3.5, -0.85), C3 = P(-0.9, 0), C4 = P(2.1, 0), AS = P(5.7, 0);
  const cx = [];
  const addBlob = (pos, r, color, seed, pick) => { const m = new THREE.Mesh(blobGeo(r[0], r[1], r[2], seed, 0.1, 4), protMat(color, 0.32)); m.position.copy(pos); m.userData.pick = pick; scene.add(m); cx.push(m); return m; };
  addBlob(P(-6.0, 0.05), [1.7, 0.6, 0.62], '#FF8A5C', 1, 'I');
  addBlob(P(-7.1, -1.55), [0.62, 1.35, 0.6], '#FF8A5C', 2, 'I');
  addBlob(C2, [0.62, 0.9, 0.58], '#7FE0A0', 3, 'II');
  addBlob(P(-1.3, 0.05), [0.62, 1.25, 0.62], '#F2C14E', 4, 'III'); addBlob(P(-0.5, 0.05), [0.62, 1.25, 0.62], '#F2C14E', 5, 'III');
  addBlob(C4, [0.78, 1.15, 0.7], '#FF6A6A', 6, 'IV');
  // Fe-S кластеры (реальные координаты 4Fe-4S из ферредоксина 1BLU) по «руке» комплекса I
  const sf4 = PDB('fdx').ligm[0]; const fesPts = []; for (let k = 0; k < 6; k++) { const p = P(-7.15 + 0.06 * k, -2.55 + k * 0.42, 0.45); fesPts.push(p); const m = molMesh(sf4, { scale: 0.075 }); m.position.copy(p); scene.add(m); }
  // цитохром c и убихинон
  const cytc = new THREE.Mesh(blobGeo(0.3, 0.3, 0.3, 7, 0.12, 4), protMat('#FF5A7A', 0.4)); scene.add(cytc);
  const Q = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0xc8a020, emissive: 0xffd040, emissiveIntensity: 0.3, roughness: 0.3 })); scene.add(m); return { m, busy: false, p: P(-4, 0, 0.5) }; });
  // АТФ-синтаза
  const rotor = new THREE.Group(); rotor.position.copy(AS); scene.add(rotor);
  // ротор F₀: кольцо c₈ (у человека и быка 8 субъединиц) + ось γ и ε
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; const c = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, TH * 1.15, 14), protMat(k % 2 ? '#9F7BFF' : '#B79BFF', 0.42)); c.position.set(Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5); rotor.add(c); }
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.6, 12), protMat('#C79BD8', 0.42)); stalk.position.set(0, -1.75, 0); rotor.add(stalk);
  // ε — эксцентрическая «лапка» на роторе (видно вращение) и изгиб γ внутри головки
  const eps = new THREE.Mesh(blobGeo(0.22, 0.16, 0.2, 33, 0.08, 4), protMat('#E0A0FF', 0.45)); eps.position.set(0.22, -0.72, 0); rotor.add(eps);
  const gKnob = new THREE.Mesh(blobGeo(0.13, 0.32, 0.1, 34, 0.06, 4), protMat('#C79BD8', 0.5)); gKnob.position.set(0.12, -2.55, 0); rotor.add(gKnob);
  const aSub = new THREE.Mesh(blobGeo(0.4, 0.62, 0.42, 9, 0.1, 4), protMat('#7FD6FF', 0.32)); aSub.position.copy(AS).add(P(0.95, 0)); aSub.userData.pick = 'ATP'; scene.add(aSub); cx.push(aSub);
  // периферический стебель b (статор): от субъединицы a вдоль головки к δ на её дальнем конце
  const pstalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.3, 8), protMat('#7FD6FF', 0.35)); pstalk.position.copy(AS).add(P(0.95, -1.75)); scene.add(pstalk);
  const pbridge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8), protMat('#7FD6FF', 0.35)); pbridge.rotation.z = Math.PI / 2; pbridge.position.set(AS.x + 0.55, -3.4, 0); scene.add(pbridge);
  const F1 = new THREE.Group(); F1.position.copy(AS).add(P(0, -2.75)); scene.add(F1);
  const betas = [];
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const isB = k % 2 === 1; const m = new THREE.Mesh(blobGeo(0.36, 0.55, 0.36, 20 + k, 0.08, 4), protMat(isB ? '#F2C14E' : '#7FE0A0', 0.36)); m.position.set(Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5); m.userData.pick = 'ATP'; F1.add(m); cx.push(m); if (isB) { m.userData.ang = a; betas.push(m); } }
  const delta = new THREE.Mesh(blobGeo(0.32, 0.22, 0.32, 31, 0.08, 4), protMat('#7FD6FF', 0.35)); delta.position.set(0, -0.72, 0); F1.add(delta);
  const atps = []; for (let k = 0; k < 8; k++) { const m = molMesh(MOL('atp'), { scale: 0.08, hideH: true }); m.visible = false; scene.add(m); atps.push({ m, age: 9, v: V3(0, 0, 0) }); }
  const waters = []; for (let k = 0; k < 6; k++) { const m = molMesh(MOL('h2o'), { scale: 0.16 }); m.visible = false; scene.add(m); waters.push({ m, age: 9 }); }
  const o2s = []; for (let k = 0; k < 4; k++) { const m = molMesh(MOL('o2'), { scale: 0.16 }); m.visible = false; scene.add(m); o2s.push({ m, age: 9 }); }
  const nadhTok = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd070 })); scene.add(nadhTok);
  // протоны
  const NH = 260; const HP = []; for (let i = 0; i < NH; i++) HP.push({ s: 'off', p: V3(0, 0, 0), v: V3(0, 0, 0), t: 0, a: V3(0, 0, 0), b: V3(0, 0, 0), ang: 0 });
  const HM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff7a9a }), NH); HM.frustumCulled = false; scene.add(HM);
  const EL = []; // электроны
  const ELM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: 0x9fd8ff }), 40); ELM.frustumCulled = false; scene.add(ELM);
  const dm = new THREE.Object3D();
  const st = { t: 0, graph: false, sub: 'nadh', pois: new Set(), labels: true, rot: false, sel: null, msg: null, spawnT: 0, hist: [], o2: 0, atp: 0, hIn: 0, atpCnt: 0, oCnt: 0, heat: 0, ims: 0 };
  const has = (p) => st.pois.has(p);
  function hFree() { return HP.find((h) => h.s === 'off'); }
  function pump(x, n) { for (let k = 0; k < n; k++) { const h = hFree(); if (!h) return; h.s = 'pump'; h.t = 0; h.a.set(x + rand(-0.35, 0.35), -1.0, rand(-0.4, 0.6)); h.b.set(h.a.x + rand(-0.2, 0.2), 1.0, h.a.z); h.p.copy(h.a); h.dur = 0.7 + k * 0.08; } }
  function spawnPair() {
    const route = st.sub === 'nadh' ? ['nadh', 'I', 'Q', 'III', 'c', 'IV'] : ['succ', 'II', 'Q', 'III', 'c', 'IV'];
    EL.push({ route, i: 0, t: 0, p: st.sub === 'nadh' ? P(-7.15, -3.4) : P(-3.5, -2.0), wait: false });
  }
  const segOf = (e) => {
    const r = e.route[e.i];
    if (r === 'nadh') return { a: P(-7.15, -3.4), b: fesPts[0], d: 0.6 };
    if (r === 'succ') return { a: P(-3.5, -2.0), b: P(-3.5, -0.6), d: 0.7 };
    if (r === 'I') return { a: fesPts[0], b: fesPts[5], d: 1.0, path: fesPts };
    if (r === 'II') return { a: P(-3.5, -0.6), b: P(-3.2, 0, 0.5), d: 0.5 };
    if (r === 'Q') return { a: e.route[1] === 'I' ? P(-5.2, 0, 0.6) : P(-3.2, 0, 0.6), b: P(-1.6, 0, 0.6), d: 1.1 };
    if (r === 'III') return { a: P(-1.6, 0, 0.6), b: P(-0.8, 0.95, 0.4), d: 0.6 };
    if (r === 'c') return { a: P(-0.8, 1.05, 0.5), b: P(1.8, 1.05, 0.5), d: 0.9 };
    return { a: P(1.8, 0.9, 0.5), b: P(2.1, -1.0, 0.5), d: 0.6 };
  };
  const blockAt = { I: 'rot', III: 'ant', c: 'ant', IV: 'cn' };
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.3;
    const ims = HP.filter((h) => h.s === 'ims').length; st.ims = ims; const pmf = clamp(ims / 140, 0, 1.2);
    // дыхательный контроль: высокий градиент тормозит поток электронов
    const ctrl = 1 - 0.95 * smooth(0.6, 1.0, pmf);
    st.spawnT -= dt * ctrl;
    const waiting = EL.filter((e) => e.wait).length;
    if (st.spawnT <= 0 && waiting < 3 && EL.length < 14) { spawnPair(); st.spawnT = 1.1; }
    // электроны
    for (let i = EL.length - 1; i >= 0; i--) {
      const e = EL[i]; const r = e.route[e.i];
      const bl = blockAt[r] && has(blockAt[r]) && !(r === 'I' && false);
      if (bl && e.t >= 0.95) { e.wait = true; if (rnd() < 0.05) fx.spawn(e.p.clone(), randUnit().multiplyScalar(0.2), new THREE.Color(0xff6a6a), 0.5, 1, 1.2); }
      else { e.wait = false; e.t += dt / segOf(e).d * ctrl ** 0.3; }
      const sg = segOf(e); const u = clamp(e.t, 0, bl ? 0.95 : 1);
      if (sg.path) { const f = u * (sg.path.length - 1), k = Math.min(sg.path.length - 2, Math.floor(f)); e.p.copy(sg.path[k]).lerp(sg.path[k + 1], f - k); } else e.p.copy(sg.a).lerp(sg.b, smooth(0, 1, u));
      if (r === 'Q') { const q = Q[i % 3]; q.m.position.copy(e.p); q.busy = true; }
      if (r === 'c') { cytc.position.copy(e.p).add(P(0, 0.05, -0.1)); }
      if (e.t >= 1) {
        if (r === 'I') pump(-6.0 + rand(-0.8, 0.8), 4);
        if (r === 'III') pump(-0.9, 4);
        if (r === 'IV') { pump(2.1, 2); st.oCnt += 1; const w = waters.find((x) => x.age > 3); if (w) { w.age = 0; w.m.visible = true; w.m.position.set(2.1 + rand(-0.3, 0.3), -1.3, 0.4); } const o = o2s.find((x) => x.age > 2); if (o) { o.age = 0; o.m.visible = true; } }
        e.i++; e.t = 0;
        if (e.i >= e.route.length) { EL.splice(i, 1); continue; }
      }
    }
    Q.forEach((q, k) => { if (!EL.some((e, i) => e.route[e.i] === 'Q' && i % 3 === k)) { q.m.position.lerp(P(-4.2 + k * 1.3 + Math.sin(t * 0.7 + k) * 0.6, 0, 0.55 + 0.25 * Math.cos(t + k)), 1 - Math.exp(-dt * 2)); } });
    if (!EL.some((e) => e.route[e.i] === 'c')) cytc.position.lerp(P(0.4 + Math.sin(t * 0.8) * 1.3, 1.0, 0.45), 1 - Math.exp(-dt * 2));
    // НАДН-жетон
    nadhTok.visible = st.sub === 'nadh' && !has('rot'); nadhTok.position.set(-7.15, -3.6 + 0.15 * Math.sin(t * 3), 0.62);
    // протоны
    const synOpen = !has('olig');
    let synRate = synOpen ? clamp(ims / 50, 0, 1) * 7 : 0;
    let leakRate = has('dnp') ? ims * 0.35 : ims * 0.004;
    st.synAcc = (st.synAcc || 0) + synRate * dt; st.leakAcc = (st.leakAcc || 0) + leakRate * dt;
    while (st.synAcc >= 1) { st.synAcc -= 1; const h = HP.find((x) => x.s === 'ims'); if (!h) break; h.s = 'syn'; h.t = 0; h.a.copy(h.p); h.b.set(AS.x + 0.75, 0.55, 0.2); }
    while (st.leakAcc >= 1) { st.leakAcc -= 1; const h = HP.find((x) => x.s === 'ims'); if (!h) break; h.s = 'leak'; h.t = 0; h.a.copy(h.p); h.b.set(h.p.x, -1.2, h.p.z); }
    let k = 0;
    HP.forEach((h) => {
      if (h.s === 'off') return;
      if (h.s === 'pump') { h.t += dt / h.dur; h.p.copy(h.a).lerp(h.b, smooth(0, 1, h.t)); if (h.t >= 1) { h.s = 'ims'; h.v.set(rand(-0.4, 0.4), rand(0, 0.3), rand(-0.3, 0.3)); } }
      else if (h.s === 'ims') { h.v.x += gauss() * 1.2 * dt; h.v.y += gauss() * 1.2 * dt; h.v.z += gauss() * 1.2 * dt; h.v.multiplyScalar(Math.exp(-0.8 * dt)); h.p.addScaledVector(h.v, dt); if (h.p.y < 0.62) { h.p.y = 0.62; h.v.y = Math.abs(h.v.y); } if (h.p.y > 2.4) { h.p.y = 2.4; h.v.y = -Math.abs(h.v.y); } if (Math.abs(h.p.x) > 8.2) h.v.x = -Math.sign(h.p.x) * Math.abs(h.v.x); if (h.p.z > 0.8) h.v.z = -Math.abs(h.v.z); if (h.p.z < -5) h.v.z = Math.abs(h.v.z); }
      else if (h.s === 'syn') { h.t += dt * 1.6; if (h.t < 1) h.p.copy(h.a).lerp(h.b, smooth(0, 1, h.t)); else { const u = h.t - 1; const ang = st.rang + 0.5; h.p.set(AS.x + Math.cos(ang) * 0.55, 0.5 - u * 1.4, Math.sin(ang) * 0.55); if (u > 1) { h.s = 'off'; st.hIn++; if (st.hIn % 4 === 0) { st.atpCnt++; const a = atps.find((x) => x.age > 2.5); if (a) { const bb = betas.reduce((x, y) => (Math.cos(st.rang + y.userData.ang) > Math.cos(st.rang + x.userData.ang) ? y : x)); /* АТФ отпускает «открытая» β */ a.age = 0; a.m.visible = true; a.m.position.copy(bb.getWorldPosition(V3(0, 0, 0))); a.v.set(rand(-0.6, 0.6), -0.7, rand(-0.3, 0.6)); for (let q = 0; q < 8; q++) fx.spawn(a.m.position.clone(), randUnit().multiplyScalar(0.5), new THREE.Color(0xffd070), 0.8, 1, 1.3); } } } } }
      else if (h.s === 'leak') { h.t += dt * 1.2; h.p.copy(h.a).lerp(h.b, h.t); if (h.t >= 1) { h.s = 'off'; st.heat += 1; for (let q = 0; q < 3; q++) fx.spawn(h.p.clone(), randUnit().multiplyScalar(0.4), new THREE.Color(0xff8a3a), 0.7, 1, 1.4); } }
      if (h.s === 'off') return;
      dm.position.copy(h.p); dm.scale.setScalar(1); dm.updateMatrix(); HM.setMatrixAt(k++, dm.matrix);
    });
    HM.count = k; HM.instanceMatrix.needsUpdate = true;
    k = 0; EL.forEach((e) => { dm.position.copy(e.p); dm.scale.setScalar(e.wait ? 1.3 + 0.3 * Math.sin(t * 10) : 1); dm.updateMatrix(); ELM.setMatrixAt(k++, dm.matrix); if (rnd() < 0.4) fx.spawn(e.p.clone(), V3(0, 0, 0), new THREE.Color(0x9fd8ff), 0.35, 0, 1.0); }); ELM.count = k; ELM.instanceMatrix.needsUpdate = true;
    // ротор крутится от потока протонов
    const flow = synOpen ? synRate : 0; st.rspd = (st.rspd || 0) + (flow * 0.9 - (st.rspd || 0)) * Math.min(1, dt * 2); st.rang = (st.rang || 0) + st.rspd * dt; rotor.rotation.y = st.rang;
    // «дыхание» β: открытое → рыхлое → плотное (L/T/O) по фазе поворота γ
    betas.forEach((b, i) => { const c = Math.cos(st.rang + b.userData.ang); b.scale.set(1 + 0.12 * c, 1 - 0.1 * c, 1 + 0.12 * c); b.material.emissiveIntensity = 0.02 + 0.2 * Math.max(0, -c); });
    F1.rotation.y = 0;
    atps.forEach((a) => { if (a.age < 2.5) { a.age += dt; a.m.position.addScaledVector(a.v, dt); a.m.rotation.y += dt * 2; } else a.m.visible = false; });
    waters.forEach((w) => { if (w.age < 3) { w.age += dt; w.m.position.y -= dt * 0.4; w.m.rotation.y += dt; } else w.m.visible = false; });
    o2s.forEach((o) => { if (o.age < 2) { o.age += dt; o.m.position.set(2.6, -2.6 + o.age * 0.7, 0.5); } else o.m.visible = false; });
    // история для графика
    st.hist.push([t, pmf, st.oCnt, st.atpCnt]); while (st.hist.length && st.hist[0][0] < t - 20) st.hist.shift();
    const h0 = st.hist[0]; const span = Math.max(1, t - h0[0]); st.oRate = (st.oCnt - h0[2]) / span; st.aRate = (st.atpCnt - h0[3]) / span; st.pmf = pmf;
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    scopeShow(st.graph); if (!st.graph) return;
    const A = plotAxes(ctx, w, h, { title: 'градиент H⁺ · дыхание · синтез АТФ', xl: '20 с →', yl: '' });
    const t1 = st.t, t0 = t1 - 20; const X = (tt) => A.X((tt - t0) / 20);
    const line = (fn, c) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const y = A.Y(clamp(fn(r, i), 0, 1.1)); i ? ctx.lineTo(X(r[0]), y) : ctx.moveTo(X(r[0]), y); }); ctx.stroke(); };
    const rate = (j, sc) => (r, i) => { const q = st.hist[Math.max(0, i - 40)]; return (r[j] - q[j]) / Math.max(0.5, r[0] - q[0]) / sc; };
    line((r) => r[1], '#FF7A9A'); line(rate(2, 2.2), '#7FD6FF'); line(rate(3, 4.5), '#F2C14E');
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = '#FF7A9A'; ctx.fillText('H⁺ снаружи', A.X(0.02), A.Y(1.05)); ctx.fillStyle = '#7FD6FF'; ctx.fillText('O₂', A.X(0.38), A.Y(1.05)); ctx.fillStyle = '#F2C14E'; ctx.fillText('АТФ', A.X(0.5), A.Y(1.05));
  }
  const PART = {
    I: '<b>Комплекс I (НАДН-дегидрогеназа)</b> — огромный L-образный комплекс (45 белков у человека). Принимает 2 электрона от НАДН на ФМН (витамин B2), проводит их по цепочке из 8 железо-серных кластеров (показаны реальные кластеры Fe₄S₄) к убихинону и при этом перекачивает <b>4 протона</b>.',
    II: '<b>Комплекс II (сукцинатдегидрогеназа)</b> — фермент цикла Кребса. Окисляет сукцинат, электроны через ФАД и Fe-S-кластеры отдаёт убихинону. Протоны <b>не качает</b> — поэтому от ФАДН₂ получается меньше АТФ.',
    III: '<b>Комплекс III (цитохром bc₁)</b> — димер. Принимает электроны от убихинола (QH₂) и передаёт по одному на цитохром c; благодаря Q-циклу выбрасывает наружу <b>4 протона</b> на пару электронов.',
    IV: '<b>Комплекс IV (цитохром c-оксидаза, цит. aa₃)</b> собирает 4 электрона от цитохрома c и восстанавливает молекулу O₂ до двух молекул воды, забирая протоны из матрикса и перекачивая ещё <b>2 протона</b> на пару электронов. Содержит гемы a, a₃ и ионы меди. Мишень цианида и CO.',
    ATP: '<b>АТФ-синтаза (F₀F₁)</b> — настоящий роторный мотор. Протоны входят через субъединицу a (голубая), садятся на кольцо из c-субъединиц (фиолетовое) и, поворачивая его, выходят в матрикс. Кольцо крутит ось γ внутри головки F₁ (α₃β₃): каждая из трёх β-субъединиц (золотые) по очереди связывает АДФ и Фн, сжимает их в АТФ и отпускает. До 100 оборотов в секунду; ≈3 протона на АТФ (+1 на перенос фосфата внутрь).',
  };
  const TXT = '<b>Тканевое дыхание.</b> Водород, снятый с топлива в виде НАДН и ФАДН₂, передаётся по цепи переносчиков, встроенных во внутреннюю мембрану митохондрии, от более «отрицательного» окислительно-восстановительного потенциала к более «положительному» — к кислороду. Энергия электронов (голубые) тратится на перекачку <b>протонов</b> (розовые) из матрикса наружу. Получается «плотина» — протонный градиент (хемиосмотическая теория П. Митчелла, Нобелевская премия 1978). Протоны возвращаются через АТФ-синтазу и крутят её ротор — так синтезируется АТФ. Нажмите на комплекс или включите яд.';
  const labels = [
    { text: 'межмембранное пространство', pos: P(-8.2, 2.3, -1), color: '#FF9AB0', show: () => st.labels },
    { text: 'матрикс', pos: P(3.8, -3.6, -1), color: '#9FD8FF', show: () => st.labels },
    { text: 'I', pos: P(-6.0, 0.55, 0.8), color: '#FF8A5C', show: () => st.labels },
    { text: 'II', pos: P(-3.5, -2.0, 0.6), color: '#7FE0A0', show: () => st.labels },
    { text: 'III', pos: P(-0.9, 1.55, 0.5), color: '#F2C14E', show: () => st.labels },
    { text: 'IV', pos: P(2.1, 1.4, 0.6), color: '#FF6A6A', show: () => st.labels },
    { text: 'цит. c', pos: P(0.4, 1.6, 0.4), color: '#FF5A7A', show: () => st.labels },
    { text: 'убихинон Q', pos: P(-3.5, 0.55, 1.4), color: '#F2C14E', show: () => st.labels },
    { text: 'НАДН', pos: P(-8.1, -3.9, 0.6), color: '#FFD070', show: () => st.labels && st.sub === 'nadh' },
    { text: 'сукцинат', pos: P(-4.4, -2.2, 0.6), color: '#7FE0A0', show: () => st.labels && st.sub === 'succ' },
    { text: 'O₂ → H₂O', pos: P(2.8, -1.8, 0.6), color: '#9FD8FF', show: () => st.labels },
    { text: 'АТФ-синтаза', pos: P(6.9, 0.9, 0.4), color: '#C79BFF', show: () => st.labels },
    { text: 'F₁: α₃β₃', pos: P(6.4, -2.8, 0.6), color: '#F2C14E', show: () => st.labels },
    { text: 'Fe-S', pos: P(-7.8, -1.6, 0.7), color: '#E0773A', show: () => st.labels },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const p = ETC_POIS.find((x) => x.id === st.msg); ib.info.innerHTML = p ? p.text : st.sel ? PART[st.sel] : TXT; };
    const subSeg = seg([{ id: 'nadh', label: 'НАДН', color: '#FFD070' }, { id: 'succ', label: 'Сукцинат (ФАДН₂)', color: '#7FE0A0' }], () => st.sub, (v) => { st.sub = v; });
    const pb = ETC_POIS.map((p) => { const b = toggle(p.name, () => st.pois.has(p.id), (v) => { if (v) st.pois.add(p.id); else st.pois.delete(p.id); st.msg = v ? p.id : null; st.sel = null; refs.setInfo(); }); return b; });
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    const gr = toggle('График', () => st.graph, (v) => { st.graph = v; });
    Object.assign(refs, { lab, pb, gr });
    el.append(group('Топливо', '', subSeg), group('Яды и разобщители', '1–5', ...pb), group('Вид', 'G · R · N', gr, refs.rot, lab), ib.el);
    refs.setInfo();
  }
  pickOn(() => self, camera, () => cx, (id) => { st.sel = id; st.msg = null; refs.setInfo(); });
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 5) { refs.pb[n - 1].click(); return true; }
    if (k === 'g' || k === 'п') { refs.gr.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Градиент H⁺', Math.round((st.pmf || 0) * 100), '%'], ['Дыхание', (st.oRate || 0).toFixed(2), 'O/с'], ['АТФ', (st.aRate || 0).toFixed(2), '/с'], ['P/O', st.oRate > 0.05 ? (st.aRate / st.oRate).toFixed(1) : '—', '']]; }
  const self = {
    mobZoom: 0.9, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FFB070',
    kicker: 'Биохимия · биологическое окисление', title: 'Дыхательная цепь и АТФ-синтаза',
    lede: 'Внутренняя мембрана митохондрии: электроны бегут к кислороду, протоны выкачиваются наружу, а потом крутят молекулярную турбину, собирающую АТФ.',
    notes: `
      <div><h2>Окислительное фосфорилирование</h2>
        <p>Переносчики цепи: <b>НАД-зависимые дегидрогеназы</b> (витамин PP), <b>флавопротеины</b> с ФМН и ФАД (B2), <b>железо-серные белки</b>, подвижный <b>убихинон (KoQ)</b> — коллектор водорода в толще мембраны, <b>цитохромы</b> b, c₁, c, a, a₃ — гемопротеины, переносящие только электроны. Они выстроены по возрастанию окислительно-восстановительного потенциала: от НАД⁺/НАДН (−0,32 В) к O₂/H₂O (+0,82 В).</p>
        <p><b>Сопряжение</b> дыхания с фосфорилированием обеспечивает протонный градиент (ΔpH + мембранный потенциал ≈ 0,2 В). <b>Коэффициент P/O</b> — сколько АТФ образуется на атом кислорода: по учебнику 3 для НАДН и 2 для ФАДН₂, по современным данным ≈ 2,5 и 1,5.</p>
        <h3>Пути потребления кислорода</h3><p>~90% O₂ идёт в дыхательную цепь. Остальное — монооксигеназы (цитохром P450 печени), оксидазы и, к сожалению, утечка электронов с образованием <b>активных форм кислорода</b> (супероксид, H₂O₂), которые обезвреживают супероксиддисмутаза, каталаза и глутатионпероксидаза.</p></div>
      <div><h2>Условности</h2><ul><li>Комплексы и АТФ-синтаза — схематичные модели в правильных пропорциях; железо-серные кластеры — реальные координаты Fe₄S₄ (PDB 1BLU).</li><li>Протоны и электроны увеличены в миллионы раз, их число условно; 10 протонов на пару электронов от НАДН и 4 протона на АТФ соответствуют современным данным.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>5</code> яды</li><li>клик по комплексу</li><li><code>R</code> вращение · <code>N</code> подписи</li></ul></div>`,
  };
  return self;
}
export { makeEtc };
