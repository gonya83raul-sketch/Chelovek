/* =========================================================
   БИОХИМИЯ · ОБЩИЙ НАБОР
   молекулы (шаростержневые, полусферы), белки (лента по реальным атомам PDB),
   поверхности, мембраны, схемы путей, графики
   ========================================================= */
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
const smoothIco = (r, det) => { const g = new THREE.IcosahedronGeometry(r, det); g.deleteAttribute('normal'); g.deleteAttribute('uv'); return mergeVertices(g); };
const bin64 = (s) => { const b = atob(s); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; };
const dI16 = (s, q) => { const a = new Int16Array(bin64(s)); const f = new Float32Array(a.length); for (let i = 0; i < a.length; i++) f[i] = a[i] / q; return f; };
const dI8 = (s) => { const a = new Int8Array(bin64(s)); const f = new Float32Array(a.length); for (let i = 0; i < a.length; i++) f[i] = a[i] / 100; return f; };
const dU16 = (s) => new Uint16Array(bin64(s));
const CPK = { H: '#C9C9D2', C: '#9A9AA6', N: '#4F74FF', O: '#F04848', P: '#FF9A30', S: '#F2CC3A', Fe: '#E0773A', Co: '#F08AC0', Mg: '#8CE04A', I: '#A35BD6', Cl: '#3FD45A', F: '#9BE07A', Br: '#B0503A', Cu: '#D9905A', Zn: '#8C93C8', Ca: '#C8C8C8', Na: '#9F7BFF', K: '#8F40D4', Se: '#E0A040' };
const RBALL = { H: 0.2, C: 0.32, N: 0.31, O: 0.3, P: 0.42, S: 0.42, Fe: 0.52, Co: 0.52, Mg: 0.5, I: 0.5, Cl: 0.4, F: 0.28, Br: 0.45, Cu: 0.5, Zn: 0.5, Ca: 0.55 };
const RVDW = { H: 1.1, C: 1.7, N: 1.55, O: 1.52, P: 1.8, S: 1.8, Fe: 1.4, Co: 1.4, Mg: 1.5, I: 1.98, Cl: 1.75, F: 1.47, Br: 1.85 };
const MOLC = {};
function MOL(id) {
  if (MOLC[id]) return MOLC[id];
  const d = BIO_MOL[id]; if (!d) throw new Error('нет молекулы ' + id);
  const el = d.el.split(' '), xyz = dI16(d.xyz, 100), b = dU16(d.b), o = d.o.split('').map(Number);
  return (MOLC[id] = { id, name: d.name, el, xyz, b, o, n: el.length });
}
/* молекула из атомов лиганда/остатка PDB (координаты в Å, порядок связей = 1) */
function molFromSet(s, name) { const el = s.el.split(' '); const b = dU16(s.b); return { id: name, name, el, xyz: dI16(s.xyz, 20), b, o: new Array(b.length / 2).fill(1), n: el.length }; }
const MATC = {};
function atomMat(el, o = {}) {
  const key = el + JSON.stringify(o);
  if (!MATC[key]) { const c = new THREE.Color(CPK[el] || '#C080C0'); MATC[key] = new THREE.MeshPhysicalMaterial({ color: c.clone().multiplyScalar(0.78), roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.28, envMapIntensity: 0.55, emissive: c, emissiveIntensity: 0.0, ...o }); }
  return MATC[key];
}
const SPH = new THREE.SphereGeometry(1, 20, 14), SPH_LO = new THREE.SphereGeometry(1, 8, 6), CYL = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
/* шаростержневая модель / полусферы. opt: scale, style ('ball'|'space'|'stick'), hideH, tint (цвет поверх), at (Vector3), bondR */
function molMesh(m, opt = {}) {
  const { scale = 0.1, style = 'ball', hideH = false, tint = null, bondR = 0.13, idx = null } = opt;
  const g = new THREE.Group(); const keep = (i) => (!hideH || m.el[i] !== 'H') && (!idx || idx.has(i));
  const P = (i) => V3(m.xyz[i * 3] * scale, m.xyz[i * 3 + 1] * scale, m.xyz[i * 3 + 2] * scale);
  const byEl = {};
  for (let i = 0; i < m.n; i++) if (keep(i)) (byEl[m.el[i]] = byEl[m.el[i]] || []).push(i);
  const dm = new THREE.Object3D(); const mats = [];
  for (const [el, list] of Object.entries(byEl)) {
    const mat = tint ? atomMat(el, { color: new THREE.Color(tint).lerp(new THREE.Color(CPK[el] || '#fff'), el === 'C' ? 0.15 : 0.55) }) : atomMat(el);
    const im = new THREE.InstancedMesh(SPH, mat, list.length); mats.push(mat);
    const r = (style === 'space' ? (RVDW[el] || 1.6) : style === 'stick' ? bondR * 1.05 : (RBALL[el] || 0.4)) * scale;
    list.forEach((i, k) => { dm.position.copy(P(i)); dm.scale.setScalar(r); dm.updateMatrix(); im.setMatrixAt(k, dm.matrix); });
    im.userData.atoms = list; g.add(im);
  }
  if (style !== 'space') {
    const segs = [];
    for (let k = 0; k < m.b.length; k += 2) {
      const a = m.b[k], b = m.b[k + 1]; if (!keep(a) || !keep(b)) continue;
      const pa = P(a), pb = P(b), ord = m.o[k / 2] || 1;
      let off = V3(0, 0, 0);
      if (ord > 1) { // смещение для двойной связи в плоскости соседей
        const nb = []; for (let q = 0; q < m.b.length; q += 2) { if (m.b[q] === a && m.b[q + 1] !== b) nb.push(m.b[q + 1]); else if (m.b[q + 1] === a && m.b[q] !== b) nb.push(m.b[q]); }
        const ax = pb.clone().sub(pa).normalize(); let ref = nb.length ? P(nb[0]).sub(pa) : V3(0, 0, 1);
        off = ref.sub(ax.clone().multiplyScalar(ref.dot(ax))); if (off.lengthSq() < 1e-6) off = V3(0, 1, 0).cross(ax); off.normalize().multiplyScalar(0.11 * scale);
      }
      const mid = pa.clone().lerp(pb, 0.5);
      const add = (o, rr) => { segs.push([pa.clone().add(o), mid.clone().add(o), m.el[a], rr]); segs.push([mid.clone().add(o), pb.clone().add(o), m.el[b], rr]); };
      if (ord === 1) add(off, bondR); else if (ord === 2) { add(off.clone().multiplyScalar(-0.6), bondR * 0.62); add(off.clone().multiplyScalar(0.9), bondR * 0.5); } else { add(V3(0, 0, 0), bondR * 0.5); add(off, bondR * 0.42); add(off.clone().negate(), bondR * 0.42); }
    }
    const byE = {}; segs.forEach((s) => (byE[s[2]] = byE[s[2]] || []).push(s));
    for (const [el, list] of Object.entries(byE)) {
      const mat = tint ? atomMat(el, { color: new THREE.Color(tint).lerp(new THREE.Color(CPK[el] || '#fff'), el === 'C' ? 0.15 : 0.55) }) : atomMat(el);
      const im = new THREE.InstancedMesh(CYL, mat, list.length);
      list.forEach(([p0, p1, , rr], k) => { const d = p1.clone().sub(p0); dm.position.copy(p0).addScaledVector(d, 0.5); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); dm.scale.set(rr * scale, d.length(), rr * scale); dm.updateMatrix(); im.setMatrixAt(k, dm.matrix); });
      g.add(im);
    }
  }
  let rad = 0; for (let i = 0; i < m.n; i++) rad = Math.max(rad, Math.hypot(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2]) * scale);
  g.userData = { mol: m, radius: rad, mats, P };
  return g;
}
/* прозрачность/подсветка группы молекулы */
function molFade(g, op) { g.traverse((o) => { if (o.material) { const m = o.material; if (!o.userData.own) { o.material = m.clone(); o.userData.own = true; } o.material.transparent = op < 1; o.material.opacity = op; o.material.depthWrite = op > 0.6; } }); }
function molGlow(g, k) { g.traverse((o) => { if (o.material && o.material.emissiveIntensity !== undefined) { if (!o.userData.own) { o.material = o.material.clone(); o.userData.own = true; } o.material.emissiveIntensity = k; } }); }

/* ---------- структуры PDB ---------- */
const PDBC = {};
function PDB(id) {
  if (PDBC[id]) return PDBC[id];
  const d = BIO_PDB[id];
  const chains = d.chains.map((c) => c.k === 'p' ? { ...c, ca: dI16(c.ca, 20), od: dI8(c.o) } : { ...c, p: dI16(c.p, 20), bdv: dI16(c.bd, 20), fullm: c.full ? molFromSet(c.full, c.id) : null });
  return (PDBC[id] = { ...d, chains, ligm: d.ligs.map((l) => ({ ...molFromSet(l, l.name), chain: l.chain, seq: l.seq })), resm: (d.res || []).map((l) => ({ ...molFromSet(l, l.name), chain: l.chain })) });
}
const CHAINCOL = ['#7FD6FF', '#FF8AB0', '#F2C14E', '#7FE0A0', '#C77DFF', '#FF9A5C', '#9FB4FF', '#E6E08A'];
const SSCOL = { H: '#FF6FA8', E: '#F2C14E', C: '#B8C4D8' };
/* лента белка: цепь → Mesh. opt: scale, color (строка | fn(i,n,ss)), w, sub */
function cartoon(ch, opt = {}) {
  const { scale = 0.1, color = '#7FD6FF', sub = 6, hw = 1.55, sw = 1.75, th = 0.36, cr = 0.32, mat = null, from = 0, to = null, k = 0.5 } = opt;
  const n0 = ch.seq.length, A = from, Bn = to ?? n0;
  const segs = []; let s0 = A;
  const brk = new Set(ch.brk || []);
  for (let i = A + 1; i < Bn; i++) if (brk.has(i)) { segs.push([s0, i]); s0 = i; }
  segs.push([s0, Bn]);
  const pos = [], col = [], idx = []; const cc = new THREE.Color();
  for (const [a, b] of segs) {
    const n = b - a; if (n < 2) continue;
    const P = [], G = [], S = [];
    for (let i = a; i < b; i++) {
      P.push(V3(ch.ca[i * 3], ch.ca[i * 3 + 1], ch.ca[i * 3 + 2])); G.push(V3(ch.od[i * 3], ch.od[i * 3 + 1], ch.od[i * 3 + 2])); S.push(ch.ss[i]);
    }
    // сглаживание тяжей
    const Ps = P.map((p, i) => (S[i] === 'E' && i > 0 && i < n - 1) ? p.clone().multiplyScalar(0.5).addScaledVector(P[i - 1], 0.25).addScaledVector(P[i + 1], 0.25) : p.clone());
    for (let i = 1; i < n; i++) if (G[i].dot(G[i - 1]) < 0) G[i].negate();
    const curve = new THREE.CatmullRomCurve3(Ps, false, 'catmullrom', 0.5);
    const M = (n - 1) * sub + 1, K = 14;
    const base = pos.length / 3;
    let prevN = null;
    for (let j = 0; j < M; j++) {
      const u = j / (M - 1), f = u * (n - 1), i = Math.min(n - 1, Math.round(f)), i0 = Math.floor(f), i1 = Math.min(n - 1, i0 + 1), t = f - i0;
      const p = curve.getPoint(u).multiplyScalar(scale), T = curve.getTangent(u);
      let N = G[i0].clone().lerp(G[i1], t); N.sub(T.clone().multiplyScalar(N.dot(T))); if (N.lengthSq() < 1e-6) N = prevN ? prevN.clone() : V3(0, 1, 0).cross(T); N.normalize();
      if (prevN && N.dot(prevN) < 0) N.negate(); prevN = N;
      const Bv = T.clone().cross(N).normalize();
      // форма сечения по вторичной структуре (плавные переходы)
      const shape = (k) => { const s = S[Math.max(0, Math.min(n - 1, k))]; return s === 'H' ? [hw, th, 2] : s === 'E' ? [sw, th, 5] : [cr * 2, cr * 2, 2]; };
      const sa = shape(i0), sb = shape(i1);
      let w = sa[0] + (sb[0] - sa[0]) * smooth(0.25, 0.75, t), hh = sa[1] + (sb[1] - sa[1]) * smooth(0.25, 0.75, t), pe = sa[2] + (sb[2] - sa[2]) * t;
      // наконечник стрелки в конце тяжа
      if (S[i0] === 'E' && (i0 + 1 >= n || S[i0 + 1] !== 'E')) { w = sw * 1.55 * (1 - t) + 0.001; }
      if (S[i0] === 'E' && i0 + 1 < n && S[i0 + 1] === 'E' && (i0 + 2 >= n || S[i0 + 2] !== 'E')) { w = sw + (sw * 0.55) * smooth(0.6, 1, t); }
      const ci = typeof color === 'function' ? color(a + i, n0, S[i]) : color;
      cc.set(ci).multiplyScalar(k);
      for (let k = 0; k < K; k++) {
        const th2 = (k / K) * Math.PI * 2, c = Math.cos(th2), s = Math.sin(th2);
        const ex = 2 / pe, x = Math.sign(c) * Math.pow(Math.abs(c), ex) * w / 2, y = Math.sign(s) * Math.pow(Math.abs(s), ex) * hh / 2;
        const v = p.clone().addScaledVector(N, x * scale).addScaledVector(Bv, y * scale);
        pos.push(v.x, v.y, v.z); col.push(cc.r, cc.g, cc.b);
      }
      if (j > 0) for (let k = 0; k < K; k++) { const a1 = base + (j - 1) * K + k, b1 = base + (j - 1) * K + (k + 1) % K, c1 = base + j * K + k, d1 = base + j * K + (k + 1) % K; idx.push(a1, c1, b1, b1, c1, d1); }
    }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat || new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.32, envMapIntensity: 0.45, side: THREE.DoubleSide }));
  return m;
}
/* весь белок (все цепи) */
function proteinMesh(id, opt = {}) {
  const S = PDB(id); const g = new THREE.Group(); const { scale = 0.1, colorBy = 'chain', chains = null, palette = CHAINCOL } = opt;
  S.chains.forEach((c, ci) => {
    if (chains && !chains.includes(c.id)) return;
    if (c.k === 'p') {
      const col = colorBy === 'ss' ? (i, n, s) => SSCOL[s] : colorBy === 'rainbow' ? (i, n) => new THREE.Color().setHSL(0.66 * (1 - i / n), 0.75, 0.6).getStyle() : typeof colorBy === 'function' ? colorBy(c, ci) : palette[ci % palette.length];
      const m = cartoon(c, { scale, color: col, ...opt.cart }); m.userData.chain = c.id; g.add(m);
    } else g.add(nucTrace(c, { scale, color: opt.nucColor || '#F2E6C8' }));
  });
  return g;
}
/* нуклеиновая кислота: трубка по фосфатам + «ступеньки» оснований */
const BASECOL = { A: '#FF6A6A', T: '#F2C14E', U: '#F2C14E', G: '#5CC48A', C: '#5B8CFF' };
function nucTrace(c, { scale = 0.1, color = '#F2E6C8', r = 0.9, steps = true } = {}) {
  const g = new THREE.Group(); const n = c.seq.length; const pts = [];
  for (let i = 0; i < n; i++) pts.push(V3(c.p[i * 3], c.p[i * 3 + 1], c.p[i * 3 + 2]).multiplyScalar(scale));
  if (n >= 2) g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 6, r * scale, 8, false), organMat(color, 0.55, { emissiveIntensity: 0.05 })));
  if (steps) {
    const dm = new THREE.Object3D(); const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 8), new THREE.MeshPhysicalMaterial({ roughness: 0.4, clearcoat: 0.5 }), n);
    for (let i = 0; i < n; i++) { const d = V3(c.bdv[i * 3], c.bdv[i * 3 + 1], c.bdv[i * 3 + 2]); const L = d.length() * scale; dm.position.copy(pts[i]).addScaledVector(d.normalize(), L / 2); dm.quaternion.setFromUnitVectors(V3(0, 1, 0), d); dm.scale.set(0.55 * scale, L, 0.55 * scale); dm.updateMatrix(); im.setMatrixAt(i, dm.matrix); im.setColorAt(i, new THREE.Color(BASECOL[c.seq[i]] || '#ccc').multiplyScalar(0.7)); }
    g.add(im);
  }
  return g;
}
/* гладкая «молекулярная поверхность» по точкам (метасферы) */
function surfaceMesh(points, { radius = 0.45, res = 64, mat = null, iso = 80, strength = 1 } = {}) {
  const bb = new THREE.Box3(); points.forEach((p) => bb.expandByPoint(p)); bb.expandByScalar(radius * 2.5);
  const size = bb.getSize(V3(0, 0, 0)), L = Math.max(size.x, size.y, size.z), c = bb.getCenter(V3(0, 0, 0));
  const mc = new MarchingCubes(res, mat || new THREE.MeshStandardMaterial(), false, false, 200000);
  mc.isolation = iso; mc.reset();
  const s = 92 * (radius / L) ** 2 * strength;
  points.forEach((p) => { const q = p.clone().sub(c).divideScalar(L).addScalar(0.5); mc.addBall(q.x, q.y, q.z, s, 12); });
  mc.update();
  const cnt = mc.count; const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(mc.positionArray.slice(0, cnt * 3), 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(mc.normalArray.slice(0, cnt * 3), 3));
  geo.scale(L / 2, L / 2, L / 2); geo.translate(c.x, c.y, c.z);
  mc.geometry.dispose();
  return new THREE.Mesh(geo, mat || new THREE.MeshPhysicalMaterial({ color: 0xbfd8ff, roughness: 0.3, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
}
function caPoints(id, scale = 0.1, chains = null) { const S = PDB(id); const out = []; S.chains.forEach((c) => { if (chains && !chains.includes(c.id)) return; const a = c.k === 'p' ? c.ca : c.p; for (let i = 0; i < a.length; i += 3) out.push(V3(a[i], a[i + 1], a[i + 2]).multiplyScalar(scale)); }); return out; }
/* «белок-капля» для комплексов без атомной модели */
function blobGeo(rx, ry, rz, seed = 1, rough = 0.12, det = 5) {
  const o = seed * 3.7;
  return displaceGeo(smoothIco(1, det), (v) => { const n = v.clone().normalize(); const k = 1 + rough * noise3(n.x * 2.2 + o, n.y * 2.2, n.z * 2.2) + rough * 0.5 * noise3(n.x * 6 + o, n.y * 6, n.z * 6) + rough * 0.25 * noise3(n.x * 13, n.y * 13 + o, n.z * 13); v.set(n.x * rx * k, n.y * ry * k, n.z * rz * k); });
}
const protMat = (color, k = 0.4, o = {}) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(k), roughness: 0.48, clearcoat: 0.35, clearcoatRoughness: 0.45, sheen: 0.25, sheenColor: new THREE.Color(color).multiplyScalar(0.6), envMapIntensity: 0.35, emissive: new THREE.Color(color), emissiveIntensity: 0.02, ...o });

/* ---------- мембраны ---------- */
/* реальный бислой POPC (молекулярная динамика), повторённый плиткой nx×nz */
/* skip(x, y, z) — вырез под вставки (белок, холестерин): липид убирается целиком, если хоть один его атом попал в вырез */
function realBilayer({ scale = 0.1, nx = 1, nz = 1, hideH = true, tint = null, tail = '#C9B98A', style = 'space', skip = null } = {}) {
  const d = BIO_PDB.popc; const el = d.el.split(' '), xyz = dI16(d.xyz, 20), L = el.length, N = d.n;
  const box = new THREE.Box3(); for (let i = 0; i < xyz.length; i += 3) box.expandByPoint(V3(xyz[i], xyz[i + 1], xyz[i + 2]));
  const size = box.getSize(V3(0, 0, 0));
  const g = new THREE.Group(); const dm = new THREE.Object3D();
  const byEl = {}; const names = d.names.split(' ');
  const headIdx = new Set(names.map((nm, i) => (/^(N|C1[1-5]|P|O1[1-4]|C1|C2|C3|O2[12]|O3[12]|C21|C31)$/.test(nm) ? i : -1)).filter((i) => i >= 0));
  for (let tx = 0; tx < nx; tx++) for (let tz = 0; tz < nz; tz++) for (let l = 0; l < N; l++) {
    const A = []; let cut = false;
    for (let i = 0; i < L; i++) { const k = (l * L + i) * 3; const a = [xyz[k] + (tx - (nx - 1) / 2) * (size.x - 2), xyz[k + 2], xyz[k + 1] + (tz - (nz - 1) / 2) * (size.y - 2), el[i], i]; if (skip && skip(a[0] * scale, a[1] * scale, a[2] * scale)) { cut = true; break; } A.push(a); }
    if (cut) continue;
    A.forEach((a) => { const key = headIdx.has(a[4]) ? a[3] : 'T'; (byEl[key] = byEl[key] || []).push(a); });
  }
  for (const [key, list] of Object.entries(byEl)) {
    const mat = key === 'T' ? new THREE.MeshPhysicalMaterial({ color: new THREE.Color(tail).multiplyScalar(0.5), roughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color(tail), envMapIntensity: 0.4 }) : atomMat(key);
    const im = new THREE.InstancedMesh(SPH_LO, mat, list.length);
    list.forEach(([x, y, z, e], k) => { dm.position.set(x * scale, y * scale, z * scale); dm.scale.setScalar((style === 'space' ? (RVDW[e] || 1.6) * 0.8 : 0.5) * scale); dm.updateMatrix(); im.setMatrixAt(k, dm.matrix); });
    g.add(im);
  }
  g.userData = { size: V3(size.x, size.z, size.y).multiplyScalar(scale), thick: size.z * scale };
  return g;
}
/* схематичный бислой (головки + хвосты) — быстрый, любых размеров; y — нормаль, центр в 0 */
function schemBilayer({ w = 10, d = 6, thick = 0.9, step = 0.16, head = '#E8C07A', tail = '#B8A27A', curve = null, seed = 3 } = {}) {
  const g = new THREE.Group(); rnd = mulberry(seed);
  const pts = []; for (let x = -w / 2; x <= w / 2; x += step) for (let z = -d / 2; z <= d / 2; z += step) pts.push([x + rand(-0.03, 0.03), z + rand(-0.03, 0.03)]);
  const hm = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 9, 6), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(head).multiplyScalar(0.32), roughness: 0.45, clearcoat: 0.4, envMapIntensity: 0.35 }), pts.length * 2);
  const tm = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5, 1, true), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(tail).multiplyScalar(0.25), roughness: 0.7, envMapIntensity: 0.2 }), pts.length * 4);
  const dm = new THREE.Object3D(); let hi = 0, ti = 0;
  pts.forEach(([x, z]) => [1, -1].forEach((s) => {
    const y0 = curve ? curve(x, z) : 0;
    dm.position.set(x, y0 + s * thick / 2, z); dm.scale.setScalar(step * 0.52); dm.rotation.set(0, 0, 0); dm.updateMatrix(); hm.setMatrixAt(hi++, dm.matrix);
    [-1, 1].forEach((q) => { const L = thick * 0.42; dm.position.set(x + q * step * 0.14, y0 + s * (thick / 2 - step * 0.3 - L / 2), z); dm.scale.set(step * 0.07, L, step * 0.07); dm.rotation.set(rand(-0.15, 0.15), 0, rand(-0.15, 0.15)); dm.updateMatrix(); tm.setMatrixAt(ti++, dm.matrix); });
  }));
  g.add(hm, tm); return g;
}

/* ---------- схемы ---------- */
/* стрелка-поток между точками (дуга) */
function flowArrow(parent, a, b, color, { bend = 0.25, r = 0.025, speed = 0.5, up = V3(0, 0, 1), head = true } = {}) {
  const mid = a.clone().lerp(b, 0.5); const d = b.clone().sub(a); const nrm = d.clone().cross(up).normalize().multiplyScalar(d.length() * bend);
  const c = new THREE.QuadraticBezierCurve3(a.clone(), mid.add(nrm), b.clone());
  const f = flowTubeMat(color, speed, 1.6);
  const tubeM = new THREE.Mesh(new THREE.TubeGeometry(c, 40, r, 6), f); parent.add(tubeM);
  let cone = null;
  if (head) { cone = new THREE.Mesh(new THREE.ConeGeometry(r * 3, r * 7, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.2), transparent: true })); cone.position.copy(c.getPoint(0.97)); cone.quaternion.setFromUnitVectors(V3(0, 1, 0), c.getTangent(0.97)); parent.add(cone); }
  return { curve: c, mat: f, mesh: tubeM, cone };
}
/* подпись-плашка «узел пути» с молекулой: возвращает группу и функцию подсветки */
function pathNode(parent, id, pos, { scale = 0.06, hideH = true, spin = true } = {}) {
  const g = molMesh(MOL(id), { scale, hideH }); g.position.copy(pos); parent.add(g); g.userData.spin = spin; return g;
}
/* график в «осциллографе»: оси и подписи */
function plotAxes(ctx, w, h, { x0 = 34, y0 = 16, xl = '', yl = '', title = '' } = {}) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, h - 16); ctx.lineTo(w - 8, h - 16); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '500 9px JetBrains Mono, monospace';
  if (xl) ctx.fillText(xl, w - 8 - ctx.measureText(xl).width, h - 4);
  if (yl) { ctx.save(); ctx.translate(10, h - 18); ctx.rotate(-Math.PI / 2); ctx.fillText(yl, 0, 0); ctx.restore(); }
  if (title) { ctx.fillStyle = '#EFEAE6'; ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillText(title, x0 + 4, 11); }
  return { X: (u) => x0 + u * (w - 8 - x0), Y: (v) => h - 16 - v * (h - 16 - y0) };
}
function plotLine(ctx, A, fn, color, { lw = 2, n = 80, dash = null } = {}) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath();
  for (let i = 0; i <= n; i++) { const u = i / n, v = fn(u); i ? ctx.lineTo(A.X(u), A.Y(v)) : ctx.moveTo(A.X(u), A.Y(v)); }
  ctx.stroke(); ctx.setLineDash([]);
}
/* стандартная сцена биохимии */
function bioStage({ bg = 0x07070b, rim = 0x7fd6ff, fog = 0 } = {}) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(bg); scene.environment = envTex; if (fog) scene.fog = new THREE.FogExp2(bg, fog);
  labLights(scene, rim); return scene;
}
const ATOMLEG = (els) => els.map((e) => `<span style="color:${CPK[e]}">●</span> ${({ C: 'углерод', H: 'водород', O: 'кислород', N: 'азот', P: 'фосфор', S: 'сера', Fe: 'железо', Co: 'кобальт', I: 'йод', Mg: 'магний', Cl: 'хлор', F: 'фтор' })[e] || e}`).join(' · ');
/* главная ось облака точек (степенной метод) */
function pcaAxis(pts) {
  const c = pts.reduce((a, p) => a.add(p), V3(0, 0, 0)).multiplyScalar(1 / pts.length);
  let v = V3(0.3, 1, 0.2).normalize();
  for (let it = 0; it < 30; it++) { const nv = V3(0, 0, 0); pts.forEach((p) => { const d = p.clone().sub(c); nv.addScaledVector(d, d.dot(v)); }); v = nv.normalize(); }
  return { c, v };
}
/* масштаб, при котором молекула вписывается в радиус R */
function molFit(m, R) { let r = 0; for (let i = 0; i < m.n; i++) r = Math.max(r, Math.hypot(m.xyz[i * 3], m.xyz[i * 3 + 1], m.xyz[i * 3 + 2])); return R / Math.max(r, 1); }
/* одна молекула фосфатидилхолина (POPC) из реального бислоя */
function lipidMol(k = 0) { const d = BIO_PDB.popc; const el = d.el.split(' '); const L = el.length; const all = dI16(d.xyz, 20); const xyz = all.slice(k * L * 3, (k + 1) * L * 3); const c = V3(0, 0, 0); for (let i = 0; i < L; i++) c.add(V3(xyz[i * 3], xyz[i * 3 + 1], xyz[i * 3 + 2])); c.multiplyScalar(1 / L); for (let i = 0; i < L; i++) { xyz[i * 3] -= c.x; xyz[i * 3 + 1] -= c.y; xyz[i * 3 + 2] -= c.z; } const b = dU16(d.b); return { id: 'popc', name: 'Фосфатидилхолин', el, xyz, b, o: new Array(b.length / 2).fill(1), n: L }; }
