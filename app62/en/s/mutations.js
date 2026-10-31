import { Sparks, THREE, V3, __set_rnd, flyStep, flyTarget, glassMat, group, h, infoBox, makeControls, mulberry, organMat, rand, rnd, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, bioStage, blobGeo, protMat } from './kit.js';
Object.assign(BIO_MOL, {"tag":{"name":"Triacylglycerol","el":"C C C C C C C C C C C C C C C C O O C C C O C O C C C C C C C C C C C C C C C O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Ov+e/EIBFP90/LUANf/e/EsAy//2/DsA5/9Z/cn/fAB2/bv/lwDd/U7/LQH8/UP/TgFl/tj+GgHx/vv+SwFa/5f+FwHk/73+SQFRAF7+EwHaAIn+RgFMATL+CwHSAVr+7gAqAgr+AAHdAeH+zQBbAhH/wQBRAqr/hQDRAuX/+v/YAsP/uP8/A/7/6/+WA0MAJP81A+P/1v4PA2EA7P59AogAn/5ZAgcBuf7KATgBff5fAd0AnP7SABEBZv5nALEAhf7a/+MAVv5x/34Acv7j/rAARf52/k4Al/51/sz/bP4B/nH/vP4B/vD+RQE5At7/SQH3AVUA5wDgAZsA1wHOAXQA4AFdAdsApAHaAKkAugFpAA4BbAHr/+cAiQF4/0cBNwH6/ikBpQAK/0sBOwD9/vsAOgDb/mgA6f8+/xQAJwDK/xEA1v8oALb/FwCyAK3/0P8OAUr/TP9FAYD/Dv+pASD/pv+n/E4BF/9T/IoBDP/+/FwBqP5h/LIARv8W/JwAA/88/WUAC/+9/Ov/9f8e/ZgA/v+Y/CYAsf+3/dz/wP8x/Wv/sgAZ/aT/pACa/RsAXwA4/mT/cwC4/e3+YwGg/Sv/UwEf/qT/JgFF/nf+uwFp/s7+rADx/vv+OwEM/2D/uQFb/5b+KgFA/zL+qQDj/7v+NQH8/yP/KgE7APf9twFTAF/+LwHrAPL+pgDYAIb+KwE5Acr9swFUATn+awBuAuP+FAGpAvX+gAD7AcD/kADQAlIAugApA77/A/+YA7//EP/uApH/8/5RA7QAa/4fA04AzP48AjYAV/9qApkAvP6eAlcBM/5nAvcAjv6/AZ0BJf+6AUIBpf5pAXgAEf5tAdcACf/GABsBcP7FAHQBkf51AE4A+f1zAKcAVP7K/0QB8f7P//MAif6C/x8A6v18/2wAPf7T/g8B3f7X/sYAT/4V/n8A2/2D/jcAAf9r/uT/iv7T/pb/e/6i/aX/Av4K/ln/J//3/QP/nv6t/bH+rP5d/rf+CAKuARgACwInApoArQF8ATgBSgJOAfQA0QG+AEkAOAHmAJcAJQJSABUBmQGKAHIBAQECAOcAhgHN/4EAdwGY/68B9AFe/0EBRgHd/sAAXgGn/mYBkgAi/7QB2P8L/ycBnwDS/j8ACwB4/l4A4/8X/67/g/9E/zoAjgDE/+3/KQD1/3YAcP8wAN3/z//8/1L/fwCmAI3/GwDgABEAEgBiATT/v//aAOz+Bf/0AJL/Xv93AeD/UP/+AQ//+f56Ab/+r/7OAUj/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgATACcAJwAoACgAKQAoACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6AAAAOwAAADwAAAA9AAEAPgABAD8AAgBAAAIAQQADAEIAAwBDAAQARAAEAEUABQBGAAUARwAGAEgABgBJAAcASgAHAEsACABMAAgATQAJAE4ACQBPAAoAUAAKAFEACwBSAAsAUwAMAFQADABVAA0AVgANAFcADgBYAA4AWQASAFoAEgBbABMAXAAUAF0AFABeABgAXwAYAGAAGQBhABkAYgAaAGMAGgBkABsAZQAbAGYAHABnABwAaAAdAGkAHQBqAB4AawAeAGwAHwBtAB8AbgAgAG8AIABwACEAcQAhAHIAIgBzACIAdAAjAHUAIwB2ACQAdwAkAHgAJQB5ACUAegAmAHsAJgB8ACYAfQAqAH4AKgB/ACsAgAArAIEALACCACwAgwAtAIQALQCFAC4AhgAuAIcALwCIAC8AiQAwAIoAMACLADEAjAAyAI0AMwCOADMAjwA0AJAANACRADUAkgA1AJMANgCUADYAlQA3AJYANwCXADgAmAA4AJkAOQCaADkAmwA6AJwAOgCdADoAngA=","o":"11111111111111121111112111111111111111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"warfarin":{"name":"Warfarin","el":"C C O C C C C C C C C C C O C C C C C C O C O H H H H H H H H H H H H H H H H","xyz":"zAC+AB3/dgDqAJP/CQAdAXr/oQDaACQAgwBQAFwA6wDn/zcA1QBp/2IANQH+/kMAowEZ//3/vAGi/8//ZQEEAOv/8P8qAEYAv//r/9n/DgDC/2r/L//L/87/+v6N/2T/af5w/1//Gf6U/8T/Uv7Z/zgA1v7y/zwAC/8xAKcAj/9OALEArv+HABgBLgHuACP/2QBSAB7/nADcAL/+CwHyADAAaQAkAWAAlQBaAMoAewBT/5sAIgGY/mYA6gHJ/ub/FgK5/5X/fAFoAMb/QwBy/3j/M/9s/w7/QP4+/wj/rv1//8D/Ev73/4sA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAUACgAEAAsACwAMAAwADQAMAA4ADgAPAA8AEAAQABEAEQASABIAEwAOABMAEwAUABQAFQALABUAFQAWAAAAFwAAABgAAAAZAAMAGgADABsABAAcAAYAHQAHAB4ACAAfAAkAIAAKACEADQAiAA8AIwAQACQAEQAlABIAJgA=","o":"12111212121121121212111121111111111111111"},"thymine":{"name":"Thymine","el":"C C C N C O N C O H H H H H H","xyz":"9v6x/wAAjf/N/wAA5P9o/wAAbgCB/wAAoAAEAAAAGAEYAAAARwBwAAAAvf9YAAAAbv+1AAAA5f5N/9j/0P62/2YAw/76/8L/wP8B/wAArwAz/wAAagDPAAAA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgAAAAJAAAACgAAAAsAAgAMAAMADQAGAA4A","o":"121121112111111"},"o2":{"name":"Oxygen","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"},"gla":{"name":"γ-Carboxyglutamate","el":"N C C C C O O C O O C O O H H H H H H H H H","xyz":"jQAt//X/kACr/63/BgDg/47/wP/9/xMASP+g/x0AP/9R/3oA3/6i/7z/nv+QABcAyf/WAHIATf/OALP/5gASAPf/2gCJAN7/QwHo/1kAQgDz/tL/fgA+/1gAwwCX/0z/zf+W/1b/DAA8AFP/AgDn/2cAt/75/6v/av8lAZX/XAEqAJsA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAwAHAAcACAAHAAkAAQAKAAoACwAKAAwAAAANAAAADgABAA8AAgAQAAIAEQADABIABgATAAkAFAAMABUA","o":"111121121121111111111"}});


// @scene mutations makeMutations | Мутации и модификация белков | Нуклеотиды и гены
/* =========================================================
   БИОХИМИЯ · МУТАЦИИ: точечные мутации в начале гена β-глобина (молчащая, миссенс — серповидноклеточная,
   нонсенс, сдвиг рамки) с настоящей трансляцией по генетическому коду; серповидные эритроциты при нехватке O₂;
   посттрансляционная модификация: фосфорилирование, гликозилирование, протеолиз проинсулина,
   гидроксилирование коллагена, γ-карбоксилирование, убиквитин и протеасома
   ========================================================= */
function makeMutations() {
  __set_rnd(mulberry(7401));
  const scene = bioStage({ rim: 0xff8ab0 });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: кадр уходит из-под заголовка и описания (телефон — прежний ракурс)
  const VIEW = { mut: DK ? [V3(-3.2, 0.1, 0), V3(-2.8, 1.4, 19.5)] : [V3(-0.56, 1.0, 0), V3(-0.16, 2.2, 12.1)], sickle: DK ? [V3(37.2, -0.4, 0), V3(37.6, 1.6, 15.5)] : [V3(39.4, 0.4, 0), V3(39.8, 2.4, 11.2)], ptm: DK ? [V3(77.8, -0.9, 0), V3(78.2, 1.0, 14.5)] : [V3(79.0, -0.3, 0), V3(79.4, 1.6, 11.2)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.mut[1]);
  const controls = makeControls(camera, VIEW.mut[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();

  /* ---------- генетический код ---------- */
  const B = 'TCAG', AA = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const AA3 = { F: 'Phe', L: 'Leu', S: 'Ser', Y: 'Tyr', C: 'Cys', W: 'Trp', P: 'Pro', H: 'His', Q: 'Gln', R: 'Arg', I: 'Ile', M: 'Met', T: 'Thr', N: 'Asn', K: 'Lys', V: 'Val', A: 'Ala', D: 'Asp', E: 'Glu', G: 'Gly', '*': 'stop' };
  const AACOL = { E: '#FF6A6A', D: '#FF6A6A', K: '#5B8CFF', R: '#5B8CFF', H: '#7FB4FF', V: '#F2C14E', L: '#F2C14E', I: '#F2C14E', M: '#F2C14E', A: '#E6E08A', F: '#E6A040', '*': '#FF3A3A' };
  const tr3 = (c) => AA[B.indexOf(c[0]) * 16 + B.indexOf(c[1]) * 4 + B.indexOf(c[2])];
  const WT = 'ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACT';   // начало гена β-глобина: Мет-Вал-Гис-Лей-Тре-Про-Глу-Глу-Лиз-Сер-Ала-Вал-Тре
  const MUTS = {
    wt: { seq: WT, at: -1, name: 'Normal' },
    silent: { seq: WT.slice(0, 11) + 'C' + WT.slice(12), at: 11, name: 'Silent' },
    missense: { seq: WT.slice(0, 19) + 'T' + WT.slice(20), at: 19, name: 'Missense (HbS)' },
    nonsense: { seq: WT.slice(0, 21) + 'T' + WT.slice(22), at: 21, name: 'Nonsense' },
    frame: { seq: WT.slice(0, 22) + WT.slice(23) + 'G', at: 22, name: 'Frameshift' },
  };
  const BCOL = { A: '#FF6A6A', T: '#F2C14E', U: '#F2C14E', G: '#5CC48A', C: '#5B8CFF' };
  const LMAT = {}; const letterMat = (b) => { if (LMAT[b]) return LMAT[b]; const cv = document.createElement('canvas'); cv.width = cv.height = 64; const x = cv.getContext('2d'); x.fillStyle = new THREE.Color(BCOL[b]).multiplyScalar(0.75).getStyle(); x.fillRect(0, 0, 64, 64); x.fillStyle = '#111'; x.font = 'bold 46px Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(b, 32, 35); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; return (LMAT[b] = new THREE.MeshBasicMaterial({ map: tx })); };
  const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };

  /* ---------- 1. ген → мРНК → белок ---------- */
  const G1 = new THREE.Group(); scene.add(G1);
  const N = WT.length, DXB = 0.24, GAP = 0.07, X0 = -((N - 1) * DXB + (N / 3 - 1) * GAP) / 2; const BX = (i) => X0 + i * DXB + Math.floor(i / 3) * GAP;
  const bx = new THREE.BoxGeometry(0.22, 0.34, 0.22);
  const mk = (y, z) => Array.from({ length: N }, (_, i) => { const m = new THREE.Mesh(bx, letterMat('A')); m.position.set(BX(i), y, z); G1.add(m); return m; });
  const DNA1 = mk(2.25, 0), DNA2 = mk(1.85, 0), RNA = mk(0.85, 0.15);
  [2.25, 1.85].forEach((y) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, N * DXB, 8), organMat('#C8C8D0', 0.5)); b.rotation.z = Math.PI / 2; b.position.set(0, y + (y > 2 ? 0.19 : -0.19), 0); G1.add(b); });
  const rb = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, N * DXB, 8), organMat('#FF6FA8', 0.6)); rb.rotation.z = Math.PI / 2; rb.position.set(0, 0.66, 0.15); G1.add(rb);
  const NC = Math.floor(N / 3);
  const beads = Array.from({ length: NC }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 12), organMat('#ccc', 0.6, { emissiveIntensity: 0.12 })); m.position.set(BX(i * 3 + 1), -0.35, 0.1); G1.add(m); return m; });
  const pep = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 8), organMat('#E8E0D0', 0.5)); pep.rotation.z = Math.PI / 2; G1.add(pep);
  const ribo = new THREE.Group(); G1.add(ribo);
  const rS = new THREE.Mesh(blobGeo(0.55, 0.28, 0.4, 3, 0.1), glassMat('#E8C772', { rim: 0.9, base: 0.08, keep: true })); rS.position.y = 0.6; ribo.add(rS);
  const rL = new THREE.Mesh(blobGeo(0.62, 0.4, 0.45, 5, 0.1), glassMat('#8FB4E6', { rim: 0.9, base: 0.07, keep: true })); rL.position.y = 1.15; ribo.add(rL);
  const mark = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 40), new THREE.MeshBasicMaterial({ color: '#FFFFFF' })); mark.scale.set(1, 4.4, 1); G1.add(mark);

  /* ---------- 2. серповидные эритроциты ---------- */
  const G2 = new THREE.Group(); G2.position.set(40, 0, 0); scene.add(G2);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 9, 40, 1, true, Math.PI / 2, Math.PI), organMat('#D86A7A', 0.4, { side: THREE.DoubleSide })); cap.rotation.z = Math.PI / 2; G2.add(cap);
  // эритроцит: двояковогнутый диск, который может «сесть» в серп (морфинг вершин)
  const rbcGeo = (() => { const g = new THREE.SphereGeometry(0.42, 32, 20); const p = g.attributes.position; const disc = new Float32Array(p.count * 3), sick = new Float32Array(p.count * 3); for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const r = Math.hypot(x, z) / 0.42; const th = 0.42 * (0.18 + 0.32 * r * r) * (y >= 0 ? 1 : -1) * Math.min(1, Math.abs(y) / 0.42 * 3); disc.set([x, th * 0.55, z], i * 3); const a = Math.atan2(z, x), R = 0.62, ang = x / 0.42 * 1.4; sick.set([Math.sin(ang) * R, th * 0.55, (Math.cos(ang) * R - R * 0.8) + z * 0.35], i * 3); } g.setAttribute('position', new THREE.Float32BufferAttribute(disc, 3)); g.morphAttributes.position = [new THREE.Float32BufferAttribute(sick, 3)]; g.computeVertexNormals(); return g; })();
  const RBC = Array.from({ length: 16 }, (_, i) => { const m = new THREE.Mesh(rbcGeo, organMat('#C83A40', 0.55, { emissiveIntensity: 0.08 })); m.morphTargetInfluences = [0]; G2.add(m); return { m, x: -4.5 + i * 0.6 + rnd() * 0.3, y: rand(-0.6, 0.6), z: rand(-0.6, 0.2), v: 0.3 + rnd() * 0.15, rot: rnd() * 6, s: 0, het: rnd() < 0.5 }; });
  const fib = new THREE.Group(); G2.add(fib);

  /* ---------- 3. модификации белка ---------- */
  const G3 = new THREE.Group(); G3.position.set(80, 0, 0); scene.add(G3);
  const NB = 30;
  const chainPts = Array.from({ length: NB }, (_, i) => V3(-3.6 + i * 0.25, 0.25 * Math.sin(i * 0.7), 0.25 * Math.cos(i * 0.5)));
  const cb = chainPts.map((p, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), organMat('#B8C4D8', 0.6, { emissiveIntensity: 0.08 })); m.position.copy(p); G3.add(m); return m; });
  const chainTube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(chainPts), 120, 0.04, 6), organMat('#C8C8D0', 0.5)); G3.add(chainTube);
  const kin = new THREE.Mesh(blobGeo(0.5, 0.4, 0.4, 41, 0.14), protMat('#F2A040', 0.5)); G3.add(kin);
  const groups = Array.from({ length: 10 }, () => { const g = new THREE.Group(); G3.add(g); g.visible = false; return g; });
  const ub = Array.from({ length: 5 }, () => { const m = new THREE.Mesh(blobGeo(0.17, 0.15, 0.15, 51, 0.1), protMat('#7FE0A0', 0.6)); m.visible = false; G3.add(m); return m; });
  const SS = [[3, 23], [7, 27]].map(([a, b]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 8), new THREE.MeshPhysicalMaterial({ color: 0xf2cc3a, emissive: 0xf2cc3a, emissiveIntensity: 0.4 })); m.visible = false; G3.add(m); return { m, a, b }; });   // дисульфидные мостики A–B
  const prot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.3, 24, 1, true), organMat('#9F7BFF', 0.5, { side: THREE.DoubleSide, emissiveIntensity: 0.08 })); prot.rotation.z = Math.PI / 2; prot.position.set(3.9, 0, 0); prot.visible = false; G3.add(prot);

  /* ---------- состояние ---------- */
  const st = { t: 0, mode: 'mut', labels: true, rot: false, fly: null, msg: null, mut: 'missense', rx: 0, hbs: 'ss', o2: true, ptm: 'phos', pt: 0, sickled: 0 };
  function setMode(m) { st.mode = m; refs.modeSeg && refs.modeSeg.sync(); [G1, G2, G3].forEach((g, k) => { g.visible = ['mut', 'sickle', 'ptm'][k] === m; }); st.fly = flyTarget(VIEW[m][0], VIEW[m][1]); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function applyMut() {
    const M = MUTS[st.mut], s = M.seq;
    for (let i = 0; i < N; i++) { const b = s[i], c = COMP[b]; DNA1[i].material = letterMat(b); DNA2[i].material = letterMat(c); RNA[i].material = letterMat(b === 'T' ? 'U' : b); const hit = i === M.at && st.mut !== 'frame'; [DNA1[i], DNA2[i], RNA[i]].forEach((m) => { m.scale.setScalar(hit ? 1.3 : 1); }); }
    st.prot = []; let stop = false;
    for (let k = 0; k < NC; k++) { const a = stop ? null : tr3(s.slice(k * 3, k * 3 + 3)); if (a === '*') stop = true; st.prot.push(stop && a !== '*' ? null : a); }
    const wt = []; for (let k = 0; k < NC; k++) wt.push(tr3(WT.slice(k * 3, k * 3 + 3)));
    st.wtProt = wt; st.rx = 0;
    if (M.at >= 0) mark.position.set(BX(M.at), 1.55, 0.25); mark.visible = M.at >= 0; st.hold = 0;
  }
  function mutUpdate(dt, t) {
    if (st.rx >= NC + 0.5) { st.hold += dt; if (st.hold > 5) { st.rx = 0; st.hold = 0; } } else st.rx = Math.min(NC + 0.5, st.rx + dt * 1.1);   // рибосома идёт по мРНК, готовый белок держится 5 с
    const k = Math.floor(st.rx);
    ribo.position.set(BX(Math.min(k, NC - 1) * 3 + 1), -0.15, 0.15);
    const stopAt = st.prot.indexOf('*'); const endK = stopAt >= 0 ? stopAt : NC;
    ribo.visible = k <= endK;
    beads.forEach((b, i) => { const a = st.prot[i]; const show = i < Math.min(k, endK) && a && a !== '*'; b.visible = show; if (show) { const diff = a !== st.wtProt[i]; b.material.color.set(AACOL[a] || '#B8C4D8').multiplyScalar(0.6); b.material.emissive.set(AACOL[a] || '#B8C4D8'); b.material.emissiveIntensity = diff ? 0.25 + 0.12 * Math.sin(t * 5) : 0.06; b.scale.setScalar(diff ? 1.3 : 1); } });
    const nb = Math.min(k, endK); pep.visible = nb > 1; if (nb > 1) { pep.scale.y = BX((nb - 1) * 3 + 1) - BX(1); pep.position.set((BX((nb - 1) * 3 + 1) + BX(1)) / 2, -0.35, 0.1); }
    const ms = 1 + 0.06 * Math.sin(t * 4); mark.scale.set(ms, 4.4 * ms, 1);
    if (stopAt >= 0 && k === stopAt && rnd() < 0.3) fx.spawn(ribo.position.clone(), V3(0, 0.5, 0.3), C.set('#FF3A3A'), 0.5, 0.6, 1);
  }
  function sickleUpdate(dt, t) {
    const lowO2 = !st.o2; let ns = 0;
    RBC.forEach((r, i) => {
      r.x += dt * r.v * (lowO2 && st.hbs === 'ss' ? 0.35 : 1); if (r.x > 4.5) r.x -= 9;
      const canSickle = st.hbs === 'ss' || (st.hbs === 'as' && r.het && lowO2 && rnd() < 0.002);
      const want = lowO2 && st.hbs !== 'aa' ? (st.hbs === 'ss' ? 1 : (r.het ? 0.7 : 0)) : 0;
      r.s += (want - r.s) * Math.min(1, dt * (want > r.s ? 0.6 : 1.5));
      if (r.s > 0.5) ns++;
      r.m.morphTargetInfluences[0] = r.s; r.m.position.set(r.x, r.y + 0.1 * Math.sin(t + i), r.z); r.m.rotation.set(0.3 + 0.2 * Math.sin(t * 0.5 + i), r.rot + t * 0.2 * (1 - r.s), 0.2);
      r.m.material.color.set(r.s > 0.5 ? '#9A3050' : '#C83A40').multiplyScalar(0.55);
    });
    st.sickled = ns;
  }
  const PTM = {
    phos: { name: 'Phosphorylation', col: '#FF9A30', at: [8, 15, 22] },
    glyco: { name: 'Glycosylation', col: '#7FD6FF', at: [5, 12, 19, 26] },
    cleave: { name: 'Proinsulin → insulin', col: '#F2C14E', at: [10, 20] },
    hydroxy: { name: 'Collagen: hydroxyproline', col: '#E6E08A', at: [3, 6, 9, 12, 15, 18, 21, 24, 27] },
    gla: { name: 'γ-Carboxylation', col: '#C77DFF', at: [2, 4, 6, 8, 10] },
    ubq: { name: 'Ubiquitin → proteasome', col: '#7FE0A0', at: [14] },
  };
  function ptmUpdate(dt, t) {
    const P = PTM[st.ptm]; st.pt += dt * 0.35; const ph = st.pt % 4; const done = Math.min(P.at.length, Math.floor(ph / 2.4 * (P.at.length + 0.5)));
    // фермент идёт вдоль цепи и оставляет метки
    const ka = P.at[Math.min(done, P.at.length - 1)];
    kin.position.copy(chainPts[ka]).add(V3(st.ptm === 'ubq' ? -0.7 : 0, 0.55, 0.15)); kin.visible = ph < 2.6 && st.ptm !== 'cleave';
    kin.material.color.set(P.col).multiplyScalar(0.5);
    groups.forEach((g, i) => { const show = i < done && i < P.at.length && st.ptm !== 'cleave' && st.ptm !== 'ubq'; g.visible = show; if (!show) return; if (!g.userData.k || g.userData.k !== st.ptm) { g.clear(); g.userData.k = st.ptm; const n = st.ptm === 'glyco' ? 4 : 1; for (let j = 0; j < n; j++) { const m = new THREE.Mesh(st.ptm === 'glyco' ? new THREE.IcosahedronGeometry(0.09, 0) : new THREE.SphereGeometry(st.ptm === 'phos' ? 0.11 : 0.08, 12, 8), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(P.col).multiplyScalar(0.6), emissive: P.col, emissiveIntensity: 0.35 })); m.position.set(j % 2 ? 0.1 : -0.05, 0.22 + j * 0.15, 0); g.add(m); } } g.position.copy(chainPts[P.at[i]]); });
    // протеолиз проинсулина: C-пептид уплывает, цепи A и B остаются связаны S–S
    const cut = st.ptm === 'cleave' && ph > 1.2;
    cb.forEach((m, i) => { let col = '#B8C4D8'; const p = chainPts[i].clone(); if (st.ptm === 'cleave') { col = i < 10 ? '#7FD6FF' : i < 20 ? '#C8C8D0' : '#FF8AB0'; if (cut && i >= 10 && i < 20) p.add(V3(0, -0.9 * smooth(1.2, 2.4, ph), 0.5 * smooth(1.2, 2.4, ph))); if (cut && i >= 20) p.add(V3(-5.0 * smooth(1.2, 2.4, ph), 0.62 * smooth(1.2, 2.4, ph), 0)); } if (st.ptm === 'hydroxy' && P.at.includes(i)) col = i < done * 3 + 1 ? '#E6E08A' : '#B8C4D8'; if (st.ptm === 'ubq' && ph > 2.2) p.lerp(V3(3.9, 0, 0), smooth(2.2, 3.4, ph) * (1 - i / NB * 0.4)); m.position.copy(p); m.material.color.set(col).multiplyScalar(0.6); m.visible = !(st.ptm === 'ubq' && ph > 3.3); });
    chainTube.visible = st.ptm !== 'cleave' && !(st.ptm === 'ubq' && ph > 2.2);
    SS.forEach((s) => { const on = st.ptm === 'cleave' && ph > 2.3; s.m.visible = on; if (on) { const A = cb[s.a].position, Bp = cb[s.b].position; s.m.position.copy(A).lerp(Bp, 0.5); s.m.scale.y = A.distanceTo(Bp); s.m.quaternion.setFromUnitVectors(V3(0, 1, 0), Bp.clone().sub(A).normalize()); } });
    ub.forEach((m, i) => { const on = st.ptm === 'ubq' && ph > 0.4 + i * 0.3 && ph < 3.4; m.visible = on; if (on) { const base = ph > 2.2 ? chainPts[14].clone().lerp(V3(3.9, 0, 0), smooth(2.2, 3.4, ph)) : chainPts[14].clone(); m.position.copy(base).add(V3(0.05 * i, 0.3 + i * 0.27, 0.1)); } });
    prot.visible = st.ptm === 'ubq'; if (prot.visible && ph > 3.2 && ph < 3.3) fx.spawn(V3(83.9, 0, 0), V3(0.6, 0.2, 0), C.set('#B8C4D8'), 0.8, 0.7, 1.2);
    st.done = done;
  }
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'mut') mutUpdate(dt, t);
    if (st.mode === 'sickle') sickleUpdate(dt, t);
    if (st.mode === 'ptm') ptmUpdate(dt, t);
    fx.update(dt);
  }
  const MTXT = {
    wt: '<b>The start of the β-globin gene.</b> The top rows are the two DNA strands, below them is the mRNA (U instead of T), and under it the protein: the ribosome reads each three-nucleotide codon as one amino acid according to the <b>genetic code</b>. The sequence here encodes Met-Val-His-Leu-Thr-Pro-Glu-Glu-Lys-Ser-Ala-Val-Thr… Choose a mutation type and the protein will be recalculated using the real genetic code.',
    silent: '<b>Silent mutation</b>: CTG → CTC, but both codons mean leucine — the code is degenerate (most amino acids have several codons, and the third letter often doesn’t matter). The protein is unchanged.',
    missense: '<b>Missense mutation</b>: GAG → GTG in codon 6 (counting after the methionine, which is later cleaved off): glutamate is replaced by valine. This is <b>hemoglobin S</b>, the cause of sickle cell anemia. One letter out of 3 billion — and a hydrophilic residue on the protein surface becomes a hydrophobic “sticky” patch (see the “Sickle cells” mode).',
    nonsense: '<b>Nonsense mutation</b>: GAG → TAG — the glutamate codon has become a <b>stop codon</b>. The ribosome terminates the protein early, and the short fragment is degraded (often already at the mRNA level). This is how many β⁰-thalassemias arise: there is no β-globin at all.',
    frame: '<b>Reading frame shift</b>: a single nucleotide is deleted, and all the following codons are read out of frame — an entirely different protein follows until a stop codon happens to turn up. Insertions and deletions that are multiples of three do not shift the frame.',
  };
  const STXT = {
    ss: '<b>Sickle cell anemia</b> (HbSS — both copies of the gene are mutant). While oxygen is plentiful, the red blood cells are normal. When hemoglobin S gives up its oxygen, the “sticky” valine of one molecule binds to a neighboring one — hemoglobin polymerizes into long, rigid fibers, and the cell turns into a <b>sickle</b>. Sickle cells get stuck in capillaries (pain, organ infarctions) and are rapidly destroyed (anemia).',
    as: '<b>Carrier</b> (HbAS): half of the hemoglobin is normal, and sickling occurs only under severe hypoxia (high altitude, strenuous exertion). Carrier status (sickle cell trait) protects against severe <b>malaria</b> — which is why the mutation is so common in Africa, India and the Mediterranean.',
    aa: '<b>Normal</b> (HbAA): red blood cells keep their biconcave disk shape at any level of oxygen saturation.',
  };
  const PTXT = {
    phos: '<b>Phosphorylation</b>: a protein kinase (orange) transfers a phosphate from ATP to the OH group of serine, threonine or tyrosine. The protein’s charge and shape change — this is the cell’s main “switch”: it turns enzymes (glycogen phosphorylase, glycogen synthase), receptors and channels on and off. Phosphatases remove the phosphate again.',
    glyco: '<b>Glycosylation</b> in the ER and Golgi apparatus: sugar chains are attached to asparagine (N-linked) or serine/threonine (O-linked). This is how membrane and secreted proteins are tagged: ABO blood group antigens, mucins of mucus, hormones (TSH, LH). Non-enzymatic attachment of glucose is glycation: HbA1c reflects blood sugar over the past 3 months.',
    cleave: '<b>Partial proteolysis</b>: proinsulin (a single chain) is cleaved in the secretory granules of β-cells — the <b>C-peptide</b> (gray) is removed, while chains A and B remain linked by disulfide bridges: this is insulin. Blood C-peptide levels show how much insulin the body is producing itself. Digestive enzymes (trypsinogen → trypsin), clotting factors and many hormones are activated in the same way.',
    hydroxy: '<b>Hydroxylation of proline and lysine</b> in collagen: prolyl hydroxylase requires <b>vitamin C</b>. Hydroxyproline stabilizes the collagen triple helix. Without vitamin C, collagen is weak — <b>scurvy</b>: bleeding gums, loss of teeth, poor wound healing.',
    gla: '<b>γ-Carboxylation</b> of glutamate in clotting factors II, VII, IX and X (and in osteocalcin): a second carboxyl group converts glutamate into Gla, which binds Ca²⁺ — without it the factors cannot attach to platelet membranes. The enzyme requires <b>vitamin K</b>; warfarin blocks its regeneration — and that is how it thins the blood.',
    ubq: '<b>Ubiquitin</b> (green beads) is a “destroy me” tag: enzymes attach a chain of several ubiquitins to a lysine of the protein, and the <b>proteasome</b> (purple barrel) cuts it into short peptides. This is how the cell removes damaged and unneeded proteins and regulates the cell cycle. The proteasome inhibitor bortezomib is used to treat multiple myeloma.',
  };
  const labels = [
    { text: 'DNA (coding strand on top)', pos: V3(X0 + 1.2, 2.85, 0.2), color: '#C8C8D0', show: () => st.labels && st.mode === 'mut' },
    { text: 'mRNA 5′ → 3′', pos: V3(X0 - 0.2, 1.2, 0.3), color: '#FF6FA8', show: () => st.labels && st.mode === 'mut' },
    { text: 'protein', pos: V3(X0 - 0.2, -0.85, 0.3), color: '#B8C4D8', show: () => st.labels && st.mode === 'mut' },
    { text: 'ribosome', pos: () => ribo.position.clone().add(V3(0.5, 1.6, 0.2)), color: '#8FB4E6', show: () => st.labels && st.mode === 'mut' && ribo.visible && DK },
    ...Array.from({ length: NC }, (_, i) => [...new Set(Object.values(MUTS).map((m) => tr3(m.seq.slice(i * 3, i * 3 + 3))))].filter((a) => a !== '*').map((a) => ({ text: AA3[a], pos: V3(BX(i * 3 + 1) - 0.12, i % 2 ? -0.95 : -0.72, 0.35), color: AACOL[a] || '#E8E0D0', show: () => st.labels && st.mode === 'mut' && beads[i].visible && st.prot[i] === a }))).flat(),
    { text: 'stop codon', pos: () => V3(BX(Math.max(0, st.prot.indexOf('*')) * 3 + 1) - 0.2, 0.45, 0.4), color: '#FF3A3A', show: () => st.labels && st.mode === 'mut' && st.prot && st.prot.indexOf('*') >= 0 && Math.floor(st.rx) >= st.prot.indexOf('*') },
    { text: '✕ A deleted', pos: V3(BX(22) - 0.2, 2.75, 0.35), color: '#FF3A3A', show: () => st.labels && st.mode === 'mut' && st.mut === 'frame' },
    { text: 'sickle cells', pos: V3(40 - 0.4, 1.35, 0.3), color: '#9A3050', show: () => st.labels && st.mode === 'sickle' && st.sickled > 0 },
    { text: 'capillary', pos: V3(40 + 3.2, -1.35, -0.6), color: '#D86A7A', show: () => st.labels && st.mode === 'sickle' },
    { text: 'enzyme', pos: () => kin.position.clone().add(V3(80.4, 0.4, 0.1)), color: '#F2A040', show: () => st.labels && st.mode === 'ptm' && kin.visible },
    { text: 'proteasome', pos: V3(80 + 3.6, 0.75, 0.3), color: '#9F7BFF', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'ubq' },
    { text: 'chain B', pos: V3(80 - 3.2, -0.6, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'cleave' },
    { text: 'C-peptide', pos: V3(80 - 0.6, -1.4, 0.6), color: '#C8C8D0', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'cleave' },
    { text: 'chain A', pos: V3(80 - 2.6, 1.15, 0.3), color: '#FF8AB0', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'cleave' },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'mut' ? MTXT[st.mut] : st.mode === 'sickle' ? (st.o2 && st.hbs !== 'aa' ? STXT[st.hbs] + ' Remove the oxygen.' : STXT[st.hbs]) : PTXT[st.ptm]); };
    refs.modeSeg = seg([{ id: 'mut', label: 'Point mutations' }, { id: 'sickle', label: 'Sickle cells' }, { id: 'ptm', label: 'Protein modification' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'mut') box.append(h('div', { class: 'glabel' }, 'Mutation'), h('div', { class: 'gctl' }, seg(Object.entries(MUTS).map(([id, m]) => ({ id, label: m.name })), () => st.mut, (v) => { st.mut = v; applyMut(); refs.setInfo(); })));
      else if (st.mode === 'sickle') box.append(h('div', { class: 'glabel' }, 'Genotype'), h('div', { class: 'gctl' }, seg([{ id: 'aa', label: 'HbAA (normal)' }, { id: 'as', label: 'HbAS (carrier)' }, { id: 'ss', label: 'HbSS (disease)' }], () => st.hbs, (v) => { st.hbs = v; refs.setInfo(); }), toggle('Oxygen', () => st.o2, (v) => { st.o2 = v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Modification'), h('div', { class: 'gctl' }, seg(Object.entries(PTM).map(([id, p]) => ({ id, label: p.name, color: p.col })), () => st.ptm, (v) => { st.ptm = v; st.pt = 0; refs.setInfo(); })));
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['mut', 'sickle', 'ptm'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'sickle') return [['Sickled', st.sickled, 'of ' + RBC.length], ['Oxygen', st.o2 ? 'yes' : 'low', '']];
    if (st.mode === 'ptm') return [['Tags', st.ptm === 'cleave' || st.ptm === 'ubq' ? '—' : st.done || 0, '']];
    const ch = st.prot ? st.prot.filter((a, i) => a && a !== '*' && a !== st.wtProt[i]).length : 0, len = st.prot ? (st.prot.indexOf('*') >= 0 ? st.prot.indexOf('*') : NC) : NC;
    return [['Amino acids changed', ch, ''], ['Protein length', len, 'of ' + NC]];
  }
  const upd0 = update;
  const self = {
    mobZoom: 1.0, scene, camera, controls, update: (dt) => { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#FF8AB0',
    kicker: 'Biochemistry · molecular genetics', title: 'Mutations and protein modification',
    lede: 'A single letter in DNA may change nothing — or turn a red blood cell into a sickle. And once a protein is assembled, it is still being finished: tagged, cut and sent for destruction.',
    notes: `
      <div><h2>Mutations</h2>
        <p><b>Gene (point)</b> mutations: base substitutions — transitions and transversions; by their consequences — silent, missense, nonsense; insertions and deletions — with or without a frameshift. Transitions are purine ↔ purine or pyrimidine ↔ pyrimidine, transversions are purine ↔ pyrimidine (HbS is an A → T transversion). There are also mutations in regulatory regions and splice sites (many β⁺-thalassemias). <b>Chromosomal</b> mutations — deletions, duplications, inversions, translocations; <b>genomic</b> mutations — a change in chromosome number (trisomy 21).</p>
        <h3>Causes and defenses</h3><p>Replication errors, spontaneous deamination and depurination, UV light (thymine dimers), ionizing radiation, chemical mutagens. Repair: direct reversal, excision repair (base and nucleotide excision — a defect causes xeroderma pigmentosum), mismatch repair (defect — Lynch syndrome). See the “DNA: structure, replication, repair” topic.</p>
        <h3>Post-translational modifications</h3><ul><li>Removal of methionine and the signal peptide, partial proteolysis.</li><li>Phosphorylation, acetylation (histones), methylation.</li><li>Glycosylation, lipid attachment (membrane anchors).</li><li>Hydroxylation (vitamin C), γ-carboxylation (vitamin K), disulfide bond formation.</li><li>Ubiquitination — degradation in the proteasome.</li></ul></div>
      <div><h2>Simplifications</h2><ul><li>The sequence is the real start of the coding region of the human β-globin gene; amino acids are assigned using the standard genetic code. The nonsense and frameshift mutations are placed here for illustration.</li><li>Red blood cells, the protein chain, enzymes and the proteasome are schematic, not to scale.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  applyMut(); setMode('mut'); st.fly = null;
  return self;
}
export { makeMutations };
