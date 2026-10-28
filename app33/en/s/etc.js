import { Sparks, THREE, V3, __set_rnd, clamp, gauss, group, infoBox, makeControls, mulberry, pickOn, rand, randUnit, rnd, scopeShow, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, BIO_PDB, MOL, PDB, bioStage, blobGeo, molMesh, plotAxes, protMat, schemBilayer } from './kit.js';
Object.assign(BIO_PDB, {"fdx":{"title":"Ferredoxin 1BLU","r":19.8,"chains":[{"id":"A","k":"p","seq":"ALMITDECINCDVCEPECPNGAISQGDETYVIEPSLCTECVGHYETSQCVEVCPVDCIIKDPSHEETEDELRAKYERITG","num":1,"ss":"EEECCCCCCCCCCCCCCCCCCEEEEECCEEEEECCCCCCCCCCCCCHHHHHHCCCCCCEEECCCCCCCHHHHHHHHHHHH","ca":"5P9pAD8A2/8fAFYADAD4/4EAHgCw/4gAFwCZ/9AAQQBm//cAFAAr/+EANgAr/5sATADk/ooAgAD8/lcAXwDb/hwAdwAN/+f/MwAQ/8P/IQBY/8//ZQBz/7f/WwBs/2z/EwCG/3H/IwDO/4X/HwAAAE3/UAAxAG7/hAABAIn/bwAUAM//eQDP/+3/vQCy//3/2gB6/ycA6wCK/24AFQFq/6QA2gBM/8cAngBd/5kAjgB9/1YAhwDI/1wAYQD7/zUAhwA+ACcAUABxADYAaACmAAgAWwB1AM//GABZAOX/3P98AMf/r/9FAN//rf80AJX/hP9yAIb/kP+DAD3/n/89ACf/bP8OAEX/KP8TAGn/RP/t/6X/iP/e/8b/q/+p/6D/2P+S/9n/mf+J/wcAd/9h/9D/r/8s/83/xv8p/xYAt//j/i8As//3/nkAkf87/3cAyv9k/5YAzP+k/24Ao//a/44Anv8lAI8A2/9GAK0Awf9zAOQAAACfAOAA8f+tAJYAp/++AI8Anf/aAEkAXf/rACMASP/SAN7/Yv8WAcn/p/8RAej/rf/KAMv/mf/lAIf/zP8dAZD/AQDrAKX/7/+/AGj/+v/9AD7/PwANAVv/VgDEAFX/PwC7AAz/KQD7AOb+","o":"xg5QWCrrot8KTDIpLMy3QbQK2KrgTfg/JabrUc7gAMeuEES45B2l30vHBGHq9Cilqy3lXfndNSOzRUAjWgUrJhlZI/GkwAJNSkLyEKTbA6Hi4KPtWCbkxQVRKvOmBCBfzgSqqiHa3kG85s6t8URHpSDmpdf43OqlXx8BAQyd39GuDFguySdKOvSvzbMm55/+DKEd6aotya0JLaYBnwwUwbkh/h1gzypMUS8jo+DuXBXf/9JZ81LJ1lsFPkvp6sC2IV4LyqwHVwTPMeetOR6zXQjdUevJQOy2Sx3EWvbWR97CNwWtVgrNUt3SO/Ow3FwP","brk":[]}],"ligs":[{"el":"Fe Fe Fe Fe S S S S","xyz":"BgA2/0AALwBJ/yAANwA3/1QAKgAW/yoATgAu/y0AGwAV/1QADgAw/xUAHwBa/0cA","b":"AAABAAAAAgAAAAMAAAAFAAAABgAAAAcAAQACAAEAAwABAAQAAQAGAAEABwACAAMAAgAEAAIABQACAAcAAwAEAAMABQADAAYA","name":"SF4","chain":"A","seq":101},{"el":"Fe Fe Fe Fe S S S S","xyz":"DgD7/77/7P/k/+H/9v8VAOT/2/8DALj/zv8CAOP//P8hALj/8P/e/7X/EgD2/+v/","b":"AAABAAAAAgAAAAMAAAAFAAAABgAAAAcAAQACAAEAAwABAAQAAQAGAAEABwACAAMAAgAEAAIABQACAAcAAwAEAAMABQADAAYA","name":"SF4","chain":"A","seq":102}],"res":[]}});
Object.assign(BIO_MOL, {"atp":{"name":"ATP","el":"N C N C N C N C N C C O C C O P O O O P O O O P O O O C O C O H H H H H H H H H H H H H H H H","xyz":"m//TAeX/4P9dARgAwP8sAYwAAQC7AL8AXwB/AHwAhQCuAAEA4gCGAKX/2wDeADn/gAA2AVH/SQAbAc3/PQEXAK3/+ACc/53/FwFA/wMApgDs/joAKgAt/ygA1v/b/rX/rf9R/u7/NQC8/jD/Uf8q/4H///57//b/Q/8DAAwA/P4n/4UAZP6P/8H/Fv4LAAgAfv30//b/Of6bAL7/Mv4YAKoATgGV/3kAsQFN/70AgwEUADYADwIQACMAUv//ARwAtP/5AYr/5f+UACEBFwHaAOH+igEeAGD/aAH//uH/qACI/g8AtgDg/qcABgB2/gD/rP7x/oEA5P3IALT/NP68/8wA+wCt/7sApQHt/rAAZgFrAHAALQJjAPv/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQAGAAoACgALAAsADAAMAA0ADQAOAA4ADwAPABAADwARAA8AEgASABMAEwAUABMAFQATABYAFgAXABcAGAAXABkAFwAaAAwAGwAbABwAGwAdAAoAHQAdAB4AAAAfAAAAIAADACEABwAiAAoAIwAMACQADQAlAA0AJgARACcAFQAoABkAKQAaACoAGwArABwALAAdAC0AHgAuAA==","o":"1212111211211111121112111211111111111111111111111"},"thyroxine":{"name":"Thyroxine (T4)","el":"N C C C C C I C O C C C I C O C I C C I C C O O H H H H H H H H H H H","xyz":"Nv4KAAH/aP7n/4T/bv5pANf//f5sAAsAWf+4AM//4/+7AAEAcwAyAaL/BQBxAGwAigB0AJ0A6gArAFEAUQFsABgAtAEhAMr/VQKGAHD/qAGc/7v/CAJU/2//NwFW//n/IwGG/uL/3ACa/0EAoP8dAK4A1f+q/1YBIv8bAIAAEv6E/8//mf2X/9v/S/4Q/wkAQ/69/8D+ZP5cAN3+zv7A/3v/Wv6+AJf/J/5jACgAPv/0AHj/WwHYACQACgJn/xD/iQBl/28A1/7d/7IAg/7a/s7/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAcACAAIAAkACQAKAAoACwALAAwACwANAA0ADgANAA8ADwAQAA8AEQAJABEABwASABIAEwASABQAAwAUAAEAFQAVABYAFQAXAAAAGAAAABkAAQAaAAIAGwACABwABAAdAAoAHgAOAB8AEQAgABQAIQAXACIA","o":"111211211211211121112112111111111111"},"dnp":{"name":"2,4-Dinitrophenol","el":"O C C C C C C N O O N O O H H H H","xyz":"6gDQAAAAcwCBAAAAAwDNAAAAfv+RAAAAcv8LAAAA7f+5/wAAagDv/wAA3QCU/wAA0AAZ/wAAZAG4/wAA7/7M/wAA4P5T/wAAef4ZAAAA8gAPAbf/DgA5AQAAKP/TAAAA3v9N/wAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYAAQAGAAYABwAHAAgABwAJAAQACgAKAAsACgAMAAAADQACAA4AAwAPAAUAEAA=","o":"12121211211211111"},"aspirin":{"name":"Aspirin","el":"C C O O C C C C C C C O O H H H H H H H H","xyz":"tgCl/2L/4QC9//P/VwHO/w0AgADA/1oA+P/B/zAAwP9G/y8ANf8z/wcA7f6e/+L/K/8kAOP/q/84AAgA4v/GAAUAmv8lAeL/ZQDvACkAegD6/z//egBK/1z/DgGb/yP//f/x/k4ACP/Q/gcAhf6T/8T/6f51AMT/dgBPAScA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkABAAJAAkACgAKAAsACgAMAAAADQAAAA4AAAAPAAUAEAAGABEABwASAAgAEwAMABQA","o":"121121212112111111111"},"niacin":{"name":"Nicotinic acid (B3, PP)","el":"O C O C C C C N C H H H H H","xyz":"/f6R/wAATP8HAAAAFf90AAAA5P///wAAIwCI/wAAtgCG/wAA+gD6/wAAtgB0AAAANQB6AAAA+v5g/1QA6/8r/wAA7AAn/wAAZwH5/wAAAwDbAAAA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAADAAgAAAAJAAQACgAFAAsABgAMAAgADQA=","o":"12121212111111"},"succinate":{"name":"Succinate","el":"O C O C C C O O H H H H H H","xyz":"1v4EACkARf8AANv/O//5/2L/w/8DAC0APQD9/9P/uwAAACUAxQAHAJ4AKgH8/9f/jP4CAOn/w/9fAGgAwv+t/3EAPgBTAI//PQCh/5j/dAH+/xcA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAAACAADAAkAAwAKAAQACwAEAAwABwANAA==","o":"1211121111111"},"o2":{"name":"Oxygen","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"},"h2o":{"name":"Water","el":"O H H","xyz":"EwAKAB8ACwA/AM7/4v+3/xMA","b":"AAABAAAAAgA=","o":"11"}});


// @scene etc makeEtc | Дыхательная цепь и АТФ-синтаза | Энергия
/* =========================================================
   БИОХИМИЯ · ТКАНЕВОЕ ДЫХАНИЕ: комплексы I–IV, убихинон, цитохром c,
   протонный градиент, АТФ-синтаза-мотор, яды и разобщители
   ========================================================= */
const ETC_POIS = [
  { id: 'rot', name: 'Rotenone', at: 'I', color: '#FF8A5C', text: '<b>Rotenone</b> (a poison from the roots of tropical plants, used as an insecticide) and barbiturates block <b>complex I</b>. NADH is no longer oxidized, but the route from succinate through complex II still works — switch the substrate to succinate.' },
  { id: 'ant', name: 'Antimycin A', at: 'III', color: '#F2C14E', text: '<b>Antimycin A</b> (an antibiotic) blocks <b>complex III</b>: electrons get stuck at ubiquinone, and respiration stops for both substrates.' },
  { id: 'cn', name: 'Cyanide, CO', at: 'IV', color: '#FF5A5A', text: '<b>Cyanide, carbon monoxide, hydrogen sulfide and azide</b> bind to the heme iron of cytochrome oxidase (<b>complex IV</b>). Oxygen cannot accept electrons, the whole chain stalls, no ATP is made — death within minutes. Yet there is plenty of oxygen in the blood: the cells simply cannot use it.' },
  { id: 'olig', name: 'Oligomycin', at: 'ATP', color: '#C77DFF', text: '<b>Oligomycin</b> plugs the proton channel of <b>ATP synthase</b>. Protons pile up outside, the gradient reaches its maximum — and respiration comes to a halt by itself: the chain cannot pump protons against an excessively steep gradient. This is <b>respiratory control</b> — respiration proceeds only when ATP is being used.' },
  { id: 'dnp', name: '2,4-Dinitrophenol', at: 'leak', color: '#FFB070', text: '<b>Uncouplers</b> — 2,4-dinitrophenol, high doses of aspirin, thyroxine, and the protein <b>thermogenin</b> of brown fat — carry protons back across the membrane, bypassing ATP synthase. Respiration races, oxygen is consumed, but almost no ATP is made: the energy is released as <b>heat</b>. This is how newborns and hibernating animals keep warm; DNP was once sold “for weight loss” — people died of overheating.' },
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
    const A = plotAxes(ctx, w, h, { title: 'H⁺ gradient · respiration · ATP synthesis', xl: '20 s →', yl: '' });
    const t1 = st.t, t0 = t1 - 20; const X = (tt) => A.X((tt - t0) / 20);
    const line = (fn, c) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); st.hist.forEach((r, i) => { const y = A.Y(clamp(fn(r, i), 0, 1.1)); i ? ctx.lineTo(X(r[0]), y) : ctx.moveTo(X(r[0]), y); }); ctx.stroke(); };
    const rate = (j, sc) => (r, i) => { const q = st.hist[Math.max(0, i - 40)]; return (r[j] - q[j]) / Math.max(0.5, r[0] - q[0]) / sc; };
    line((r) => r[1], '#FF7A9A'); line(rate(2, 2.2), '#7FD6FF'); line(rate(3, 4.5), '#F2C14E');
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = '#FF7A9A'; ctx.fillText('H⁺ outside', A.X(0.02), A.Y(1.05)); ctx.fillStyle = '#7FD6FF'; ctx.fillText('O₂', A.X(0.38), A.Y(1.05)); ctx.fillStyle = '#F2C14E'; ctx.fillText('ATP', A.X(0.5), A.Y(1.05));
  }
  const PART = {
    I: '<b>Complex I (NADH dehydrogenase)</b> is a huge L-shaped complex (45 proteins in humans). It accepts 2 electrons from NADH onto FMN (vitamin B2), passes them along a chain of 8 iron–sulfur clusters (the real Fe₄S₄ clusters are shown) to ubiquinone, and in the process pumps <b>4 protons</b>.',
    II: '<b>Complex II (succinate dehydrogenase)</b> is an enzyme of the Krebs cycle. It oxidizes succinate and passes the electrons through FAD and Fe-S clusters to ubiquinone. It does <b>not pump</b> protons — which is why FADH₂ yields less ATP.',
    III: '<b>Complex III (cytochrome bc₁)</b> is a dimer. It accepts electrons from ubiquinol (QH₂) and passes them one at a time to cytochrome c; thanks to the Q cycle it releases <b>4 protons</b> outside per electron pair.',
    IV: '<b>Complex IV (cytochrome c oxidase, cyt. aa₃)</b> collects 4 electrons from cytochrome c and reduces a molecule of O₂ to two molecules of water, taking protons from the matrix and pumping another <b>2 protons</b> per electron pair. It contains hemes a and a₃ and copper ions. It is the target of cyanide and CO.',
    ATP: '<b>ATP synthase (F₀F₁)</b> is a true rotary motor. Protons enter through subunit a (light blue), bind to the ring of c subunits (purple) and, turning it, exit into the matrix. The ring spins the γ shaft inside the F₁ head (α₃β₃): each of the three β subunits (gold) in turn binds ADP and Pi, squeezes them into ATP and releases it. Up to 100 revolutions per second; ≈3 protons per ATP (+1 to bring phosphate in).',
  };
  const TXT = '<b>Tissue respiration.</b> Hydrogen removed from fuel as NADH and FADH₂ is passed along a chain of carriers embedded in the inner mitochondrial membrane, from a more “negative” redox potential to a more “positive” one — to oxygen. The energy of the electrons (light blue) is used to pump <b>protons</b> (pink) out of the matrix. The result is a “dam” — the proton gradient (P. Mitchell’s chemiosmotic theory, Nobel Prize 1978). Protons flow back through ATP synthase and spin its rotor — this is how ATP is made. Click a complex or turn on a poison.';
  const labels = [
    { text: 'intermembrane space', pos: P(-8.2, 2.3, -1), color: '#FF9AB0', show: () => st.labels },
    { text: 'matrix', pos: P(3.8, -3.6, -1), color: '#9FD8FF', show: () => st.labels },
    { text: 'I', pos: P(-6.0, 0.55, 0.8), color: '#FF8A5C', show: () => st.labels },
    { text: 'II', pos: P(-3.5, -2.0, 0.6), color: '#7FE0A0', show: () => st.labels },
    { text: 'III', pos: P(-0.9, 1.55, 0.5), color: '#F2C14E', show: () => st.labels },
    { text: 'IV', pos: P(2.1, 1.4, 0.6), color: '#FF6A6A', show: () => st.labels },
    { text: 'cyt. c', pos: P(0.4, 1.6, 0.4), color: '#FF5A7A', show: () => st.labels },
    { text: 'ubiquinone Q', pos: P(-3.5, 0.55, 1.4), color: '#F2C14E', show: () => st.labels },
    { text: 'NADH', pos: P(-8.1, -3.9, 0.6), color: '#FFD070', show: () => st.labels && st.sub === 'nadh' },
    { text: 'succinate', pos: P(-4.4, -2.2, 0.6), color: '#7FE0A0', show: () => st.labels && st.sub === 'succ' },
    { text: 'O₂ → H₂O', pos: P(2.8, -1.8, 0.6), color: '#9FD8FF', show: () => st.labels },
    { text: 'ATP synthase', pos: P(6.9, 0.9, 0.4), color: '#C79BFF', show: () => st.labels },
    { text: 'F₁: α₃β₃', pos: P(6.4, -2.8, 0.6), color: '#F2C14E', show: () => st.labels },
    { text: 'Fe-S', pos: P(-7.8, -1.6, 0.7), color: '#E0773A', show: () => st.labels },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const p = ETC_POIS.find((x) => x.id === st.msg); ib.info.innerHTML = p ? p.text : st.sel ? PART[st.sel] : TXT; };
    const subSeg = seg([{ id: 'nadh', label: 'NADH', color: '#FFD070' }, { id: 'succ', label: 'Succinate (FADH₂)', color: '#7FE0A0' }], () => st.sub, (v) => { st.sub = v; });
    const pb = ETC_POIS.map((p) => { const b = toggle(p.name, () => st.pois.has(p.id), (v) => { if (v) st.pois.add(p.id); else st.pois.delete(p.id); st.msg = v ? p.id : null; st.sel = null; refs.setInfo(); }); return b; });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    const gr = toggle('Graph', () => st.graph, (v) => { st.graph = v; });
    Object.assign(refs, { lab, pb, gr });
    el.append(group('Fuel', '', subSeg), group('Poisons and uncouplers', '1–5', ...pb), group('View', 'G · R · N', gr, refs.rot, lab), ib.el);
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
  function stats() { return [['H⁺ gradient', Math.round((st.pmf || 0) * 100), '%'], ['Respiration', (st.oRate || 0).toFixed(2), 'O/s'], ['ATP', (st.aRate || 0).toFixed(2), '/s'], ['P/O', st.oRate > 0.05 ? (st.aRate / st.oRate).toFixed(1) : '—', '']]; }
  const self = {
    mobZoom: 0.9, scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FFB070',
    kicker: 'Biochemistry · biological oxidation', title: 'Respiratory chain and ATP synthase',
    lede: 'The inner mitochondrial membrane: electrons race toward oxygen, protons are pumped out, and then they spin a molecular turbine that assembles ATP.',
    notes: `
      <div><h2>Oxidative phosphorylation</h2>
        <p>Carriers of the chain: <b>NAD-dependent dehydrogenases</b> (vitamin B3, niacin), <b>flavoproteins</b> with FMN and FAD (B2), <b>iron–sulfur proteins</b>, mobile <b>ubiquinone (CoQ)</b> — the hydrogen collector within the membrane, and <b>cytochromes</b> b, c₁, c, a, a₃ — heme proteins that carry electrons only. They are arranged in order of increasing redox potential: from NAD⁺/NADH (−0.32 V) to O₂/H₂O (+0.82 V).</p>
        <p><b>Coupling</b> of respiration to phosphorylation is provided by the proton gradient (ΔpH + membrane potential ≈ 0.2 V). <b>The P/O ratio</b> is the number of ATP formed per oxygen atom: 3 for NADH and 2 for FADH₂ in textbooks, ≈ 2.5 and 1.5 by current data.</p>
        <h3>Routes of oxygen consumption</h3><p>~90% of O₂ goes to the respiratory chain. The rest goes to monooxygenases (liver cytochrome P450), oxidases and, unfortunately, electron leakage that forms <b>reactive oxygen species</b> (superoxide, H₂O₂), which are neutralized by superoxide dismutase, catalase and glutathione peroxidase.</p></div>
      <div><h2>Simplifications</h2><ul><li>The complexes and ATP synthase are schematic models in correct proportions; the iron–sulfur clusters use real Fe₄S₄ coordinates (PDB 1BLU).</li><li>Protons and electrons are enlarged millions of times and their numbers are arbitrary; 10 protons per electron pair from NADH and 4 protons per ATP match current data.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>5</code> poisons</li><li>click a complex</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeEtc };
