import { Sparks, THREE, V3, __set_rnd, flyStep, flyTarget, glassMat, group, h, infoBox, makeControls, mulberry, organMat, rand, rnd, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, bioStage, blobGeo, protMat } from './kit.js';
Object.assign(BIO_MOL, {"o2":{"name":"Кислород","el":"O O","xyz":"JQDP/wEA2/8xAP//","b":"AAABAA==","o":"2"},"gla":{"name":"γ-Карбоксиглутамат","el":"N C C C C O O C O O C O O H H H H H H H H H","xyz":"jQAt//X/kACr/63/BgDg/47/wP/9/xMASP+g/x0AP/9R/3oA3/6i/7z/nv+QABcAyf/WAHIATf/OALP/5gASAPf/2gCJAN7/QwHo/1kAQgDz/tL/fgA+/1gAwwCX/0z/zf+W/1b/DAA8AFP/AgDn/2cAt/75/6v/av8lAZX/XAEqAJsA","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAwAHAAcACAAHAAkAAQAKAAoACwAKAAwAAAANAAAADgABAA8AAgAQAAIAEQADABIABgATAAkAFAAMABUA","o":"111121121121111111111"}});


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
  const VIEW = { mut: [V3(-1.6, 1.0, 0), V3(-1.2, 2.2, 18)], sickle: [V3(38.4, -0.4, 0), V3(38.8, 1.6, 13)], ptm: [V3(78.8, -0.9, 0), V3(79.2, 1.0, 14.5)] };
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 300); camera.position.copy(VIEW.mut[1]);
  const controls = makeControls(camera, VIEW.mut[0]); controls.minDistance = 3; controls.maxDistance = 40;
  const fx = new Sparks(1800, 0.07); scene.add(fx.obj);
  const C = new THREE.Color();

  /* ---------- генетический код ---------- */
  const B = 'TCAG', AA = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const AA3 = { F: 'Фен', L: 'Лей', S: 'Сер', Y: 'Тир', C: 'Цис', W: 'Три', P: 'Про', H: 'Гис', Q: 'Глн', R: 'Арг', I: 'Иле', M: 'Мет', T: 'Тре', N: 'Асн', K: 'Лиз', V: 'Вал', A: 'Ала', D: 'Асп', E: 'Глу', G: 'Гли', '*': 'стоп' };
  const AACOL = { E: '#FF6A6A', D: '#FF6A6A', K: '#5B8CFF', R: '#5B8CFF', H: '#7FB4FF', V: '#F2C14E', L: '#F2C14E', I: '#F2C14E', M: '#F2C14E', A: '#E6E08A', F: '#E6A040', '*': '#FF3A3A' };
  const tr3 = (c) => AA[B.indexOf(c[0]) * 16 + B.indexOf(c[1]) * 4 + B.indexOf(c[2])];
  const WT = 'ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCCGTTACT';   // начало гена β-глобина: Мет-Вал-Гис-Лей-Тре-Про-Глу-Глу-Лиз-Сер-Ала-Вал-Тре
  const MUTS = {
    wt: { seq: WT, at: -1, name: 'Норма' },
    silent: { seq: WT.slice(0, 11) + 'C' + WT.slice(12), at: 11, name: 'Молчащая' },
    missense: { seq: WT.slice(0, 19) + 'T' + WT.slice(20), at: 19, name: 'Миссенс (HbS)' },
    nonsense: { seq: WT.slice(0, 21) + 'T' + WT.slice(22), at: 21, name: 'Нонсенс' },
    frame: { seq: WT.slice(0, 22) + WT.slice(23) + 'G', at: 22, name: 'Сдвиг рамки' },
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
    phos: { name: 'Фосфорилирование', col: '#FF9A30', at: [8, 15, 22] },
    glyco: { name: 'Гликозилирование', col: '#7FD6FF', at: [5, 12, 19, 26] },
    cleave: { name: 'Проинсулин → инсулин', col: '#F2C14E', at: [10, 20] },
    hydroxy: { name: 'Коллаген: OH-пролин', col: '#E6E08A', at: [3, 6, 9, 12, 15, 18, 21, 24, 27] },
    gla: { name: 'γ-Карбоксилирование', col: '#C77DFF', at: [2, 4, 6, 8, 10] },
    ubq: { name: 'Убиквитин → протеасома', col: '#7FE0A0', at: [14] },
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
    wt: '<b>Начало гена β-глобина.</b> Верхние ряды — две цепи ДНК, ниже — мРНК (вместо T — U), под ней белок: каждый кодон из трёх нуклеотидов рибосома читает как одну аминокислоту по <b>генетическому коду</b>. Здесь закодировано: Мет-Вал-Гис-Лей-Тре-Про-Глу-Глу-Лиз-Сер-Ала-Вал-Тре… Выберите тип мутации — белок пересчитается по настоящему генетическому коду.',
    silent: '<b>Молчащая мутация</b>: CTG → CTC, но оба кодона означают лейцин — код вырожден (у большинства аминокислот несколько кодонов, третья буква часто не важна). Белок не меняется.',
    missense: '<b>Миссенс-мутация</b>: GAG → GTG в 6-м кодоне (после метионина, который потом отрезается): глутамат заменён валином. Это <b>гемоглобин S</b> — причина серповидноклеточной анемии. Одна буква из 3 миллиардов — и гидрофильный остаток на поверхности белка становится гидрофобным «липким» пятном (режим «Серповидные клетки»).',
    nonsense: '<b>Нонсенс-мутация</b>: GAG → TAG — кодон глутамата стал <b>стоп-кодоном</b>. Рибосома обрывает белок, и короткий обрывок разрушается (часто ещё на уровне мРНК). Так устроены многие β⁰-талассемии: β-глобина нет совсем.',
    frame: '<b>Сдвиг рамки считывания</b>: выпал один нуклеотид, и все следующие кодоны читаются со сдвигом — дальше идёт совсем другой белок, пока случайно не встретится стоп-кодон. Вставки и выпадения, кратные трём, рамку не сдвигают.',
  };
  const STXT = {
    ss: '<b>Серповидноклеточная анемия</b> (HbSS — обе копии гена мутантные). Пока кислорода много, эритроциты нормальные. Когда гемоглобин S отдаёт кислород, «липкий» валин одной молекулы прилипает к соседней — гемоглобин полимеризуется в длинные жёсткие волокна, и клетка превращается в <b>серп</b>. Серповидные клетки застревают в капиллярах (боли, инфаркты органов) и быстро разрушаются (анемия).',
    as: '<b>Носитель</b> (HbAS): половина гемоглобина нормальная, и серпы образуются только при сильной гипоксии (высокогорье, тяжёлые нагрузки). Носительство защищает от тяжёлой <b>малярии</b> — поэтому мутация так часта в Африке, Индии, Средиземноморье.',
    aa: '<b>Норма</b> (HbAA): эритроциты сохраняют форму двояковогнутого диска при любом насыщении кислородом.',
  };
  const PTXT = {
    phos: '<b>Фосфорилирование</b>: протеинкиназа (оранжевая) переносит фосфат с АТФ на OH-группу серина, треонина или тирозина. Заряд и форма белка меняются — это главный «выключатель» в клетке: так включаются и выключаются ферменты (гликогенфосфорилаза, гликогенсинтаза), рецепторы, каналы. Фосфатазы снимают фосфат обратно.',
    glyco: '<b>Гликозилирование</b> в ЭПС и аппарате Гольджи: к аспарагину (N-) или серину/треонину (O-) пришиваются цепочки сахаров. Так метятся мембранные и секретируемые белки: антигены групп крови AB0, муцины слизи, гормоны (ТТГ, ЛГ). Неферментативное присоединение глюкозы — гликирование: по HbA1c судят о сахаре крови за 3 месяца.',
    cleave: '<b>Частичный протеолиз</b>: проинсулин (одна цепь) в секреторных гранулах β-клеток разрезается — <b>C-пептид</b> (серый) уходит, а цепи A и B остаются связаны дисульфидными мостиками: это и есть инсулин. По C-пептиду в крови судят о собственной выработке инсулина. Так же активируются пищеварительные ферменты (трипсиноген → трипсин), факторы свёртывания, многие гормоны.',
    hydroxy: '<b>Гидроксилирование пролина и лизина</b> в коллагене: пролилгидроксилазе нужен <b>витамин C</b>. Гидроксипролин держит тройную спираль коллагена. Без витамина C коллаген непрочный — <b>цинга</b>: кровоточат дёсны, выпадают зубы, плохо заживают раны.',
    gla: '<b>γ-Карбоксилирование</b> глутамата в факторах свёртывания II, VII, IX, X (и в остеокальцине): второй карбоксил превращает глутамат в Gla, который связывает Ca²⁺ — без этого факторы не садятся на мембраны тромбоцитов. Ферменту нужен <b>витамин K</b>; варфарин блокирует его восстановление — так он и разжижает кровь.',
    ubq: '<b>Убиквитин</b> (зелёные шарики) — метка «на уничтожение»: ферменты пришивают к лизину белка цепочку из нескольких убиквитинов, и <b>протеасома</b> (фиолетовая бочка) разрезает его на короткие пептиды. Так клетка убирает повреждённые и ненужные белки, регулирует клеточный цикл. Ингибитор протеасомы бортезомиб лечит миеломную болезнь.',
  };
  const labels = [
    { text: 'ДНК (кодирующая цепь сверху)', pos: V3(X0 - 0.2, 2.65, 0.2), color: '#C8C8D0', show: () => st.labels && st.mode === 'mut' },
    { text: 'мРНК 5′ → 3′', pos: V3(X0 - 0.2, 1.2, 0.3), color: '#FF6FA8', show: () => st.labels && st.mode === 'mut' },
    { text: 'белок', pos: V3(X0 - 0.2, -0.85, 0.3), color: '#B8C4D8', show: () => st.labels && st.mode === 'mut' },
    { text: 'рибосома', pos: () => ribo.position.clone().add(V3(0.5, 1.6, 0.2)), color: '#8FB4E6', show: () => st.labels && st.mode === 'mut' && ribo.visible },
    ...Array.from({ length: NC }, (_, i) => [...new Set(Object.values(MUTS).map((m) => tr3(m.seq.slice(i * 3, i * 3 + 3))))].filter((a) => a !== '*').map((a) => ({ text: AA3[a], pos: V3(BX(i * 3 + 1) - 0.12, i % 2 ? -0.95 : -0.72, 0.35), color: AACOL[a] || '#E8E0D0', show: () => st.labels && st.mode === 'mut' && beads[i].visible && st.prot[i] === a }))).flat(),
    { text: 'стоп-кодон', pos: () => V3(BX(Math.max(0, st.prot.indexOf('*')) * 3 + 1) - 0.2, 0.45, 0.4), color: '#FF3A3A', show: () => st.labels && st.mode === 'mut' && st.prot && st.prot.indexOf('*') >= 0 && Math.floor(st.rx) >= st.prot.indexOf('*') },
    { text: '✕ выпал A', pos: V3(BX(22) - 0.2, 2.75, 0.35), color: '#FF3A3A', show: () => st.labels && st.mode === 'mut' && st.mut === 'frame' },
    { text: 'серповидные клетки', pos: V3(40 - 0.4, 1.35, 0.3), color: '#9A3050', show: () => st.labels && st.mode === 'sickle' && st.sickled > 0 },
    { text: 'капилляр', pos: V3(40 + 3.2, -1.35, -0.6), color: '#D86A7A', show: () => st.labels && st.mode === 'sickle' },
    { text: 'фермент', pos: () => kin.position.clone().add(V3(80.4, 0.4, 0.1)), color: '#F2A040', show: () => st.labels && st.mode === 'ptm' && kin.visible },
    { text: 'протеасома', pos: V3(80 + 3.6, 0.75, 0.3), color: '#9F7BFF', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'ubq' },
    { text: 'цепь B', pos: V3(80 - 3.2, -0.6, 0.3), color: '#7FD6FF', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'cleave' },
    { text: 'C-пептид', pos: V3(80 - 0.6, -1.4, 0.6), color: '#C8C8D0', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'cleave' },
    { text: 'цепь A', pos: V3(80 - 2.6, 1.15, 0.3), color: '#FF8AB0', show: () => st.labels && st.mode === 'ptm' && st.ptm === 'cleave' },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'mut' ? MTXT[st.mut] : st.mode === 'sickle' ? (st.o2 && st.hbs !== 'aa' ? STXT[st.hbs] + ' Уберите кислород.' : STXT[st.hbs]) : PTXT[st.ptm]); };
    refs.modeSeg = seg([{ id: 'mut', label: 'Точечные мутации' }, { id: 'sickle', label: 'Серповидные клетки' }, { id: 'ptm', label: 'Модификация белков' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = '';
      if (st.mode === 'mut') box.append(h('div', { class: 'glabel' }, 'Мутация'), h('div', { class: 'gctl' }, seg(Object.entries(MUTS).map(([id, m]) => ({ id, label: m.name })), () => st.mut, (v) => { st.mut = v; applyMut(); refs.setInfo(); })));
      else if (st.mode === 'sickle') box.append(h('div', { class: 'glabel' }, 'Генотип'), h('div', { class: 'gctl' }, seg([{ id: 'aa', label: 'HbAA (норма)' }, { id: 'as', label: 'HbAS (носитель)' }, { id: 'ss', label: 'HbSS (болезнь)' }], () => st.hbs, (v) => { st.hbs = v; refs.setInfo(); }), toggle('Кислород', () => st.o2, (v) => { st.o2 = v; refs.setInfo(); })));
      else box.append(h('div', { class: 'glabel' }, 'Модификация'), h('div', { class: 'gctl' }, seg(Object.entries(PTM).map(([id, p]) => ({ id, label: p.name, color: p.col })), () => st.ptm, (v) => { st.ptm = v; st.pt = 0; refs.setInfo(); })));
    };
    refs.rot = toggle('Вращение', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Подписи', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Режим', '1–3', refs.modeSeg), box, group('Вид', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['mut', 'sickle', 'ptm'][n - 1]); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'sickle') return [['Серповидных', st.sickled, 'из ' + RBC.length], ['Кислород', st.o2 ? 'есть' : 'мало', '']];
    if (st.mode === 'ptm') return [['Меток', st.ptm === 'cleave' || st.ptm === 'ubq' ? '—' : st.done || 0, '']];
    const ch = st.prot ? st.prot.filter((a, i) => a && a !== '*' && a !== st.wtProt[i]).length : 0, len = st.prot ? (st.prot.indexOf('*') >= 0 ? st.prot.indexOf('*') : NC) : NC;
    return [['Изменено аминокислот', ch, ''], ['Длина белка', len, 'из ' + NC]];
  }
  const upd0 = update;
  const self = {
    mobZoom: 1.0, scene, camera, controls, update: (dt) => { upd0(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#FF8AB0',
    kicker: 'Биохимия · молекулярная генетика', title: 'Мутации и модификация белков',
    lede: 'Одна буква в ДНК может ничего не изменить — или превратить эритроцит в серп. А после сборки белок ещё дорабатывают: метят, режут и отправляют на уничтожение.',
    notes: `
      <div><h2>Мутации</h2>
        <p><b>Генные (точечные)</b> мутации: замены оснований — транзиции и трансверсии; по последствиям — молчащие, миссенс, нонсенс; вставки и выпадения — со сдвигом рамки или без. Транзиции — пурин ↔ пурин или пиримидин ↔ пиримидин, трансверсии — пурин ↔ пиримидин (HbS — трансверсия A → T). Бывают также мутации регуляторных участков и сплайсинга (многие β⁺-талассемии). <b>Хромосомные</b> — делеции, дупликации, инверсии, транслокации; <b>геномные</b> — изменение числа хромосом (трисомия 21).</p>
        <h3>Причины и защита</h3><p>Ошибки репликации, спонтанное дезаминирование и депуринизация, УФ (тиминовые димеры), ионизирующее излучение, химические мутагены. Репарация: прямая, эксцизионная (оснований и нуклеотидов — при её дефекте пигментная ксеродерма), исправление неспаренных оснований (дефект — синдром Линча). См. тему «ДНК».</p>
        <h3>Посттрансляционные модификации</h3><ul><li>Отщепление метионина и сигнального пептида, частичный протеолиз.</li><li>Фосфорилирование, ацетилирование (гистоны), метилирование.</li><li>Гликозилирование, присоединение липидов (якоря в мембране).</li><li>Гидроксилирование (витамин C), γ-карбоксилирование (витамин K), образование дисульфидных связей.</li><li>Убиквитинирование — распад в протеасоме.</li></ul></div>
      <div><h2>Условности</h2><ul><li>Последовательность — настоящее начало кодирующей части гена β-глобина человека; аминокислоты считаются по стандартному генетическому коду. Нонсенс и сдвиг рамки поставлены в это место для наглядности.</li><li>Эритроциты, цепь белка, ферменты и протеасома — схемы, не в масштабе.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul><li><code>1</code>–<code>3</code> режим</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  applyMut(); setMode('mut'); st.fly = null;
  return self;
}
export { makeMutations };
