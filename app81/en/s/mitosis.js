import { Sparks, THREE, V3, __set_rnd, flyStep, flyTarget, glassMat, group, h, infoBox, makeControls, mulberry, rnd, seg, toggle } from '../core.js';
import { BIO_MOL, bioStage } from './kit.js';
Object.assign(BIO_MOL, {"pro":{"name":"Proline","el":"O C O C C C C N H H H H H H H H H","xyz":"+P4CAC8Aef8BAPP/g//9/3n/9v8DAEoATAB9ACUAygBGAOL/ugCu/+H/RgCM/zIA9f4gAIsA2v8IALMAZgC0AH8AFQC9AOD/IgFiABwA0QBsAH3/rACL/3v/FAGA/wwADgBH/wEA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAMABwAAAAgAAwAJAAQACgAEAAsABQAMAAUADQAGAA4ABgAPAAcAEAA=","o":"12111111111111111"}});


// @scene mitosis makeMitosis | Деление клетки | @cell
/* =========================================================
   КЛЕТКА · ДЕЛЕНИЕ: клеточный цикл (G1 → S → G2 → M), митоз по фазам и мейоз с кроссинговером.
   Условно 2 пары хромосом (у человека 23): материнские — розовые, отцовские — голубые; у каждой хромосомы
   после S-фазы две сестринские хроматиды. Позиции всех хроматид задаются по стадии и плавно догоняются.
   ========================================================= */
function makeMitosis() {
  __set_rnd(mulberry(7501));
  const scene = bioStage({ rim: 0xff9ab0 });
  const DK = !matchMedia('(max-width:700px)').matches;   // компьютер: клетка правее заголовка и описания
  const VIEW = DK ? flyTarget(V3(-2.0, -0.2, 0), V3(-2.0, 0.85, 13.4)) : flyTarget(V3(0, -0.5, 0), V3(0, 0.3, 14.5));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.copy(VIEW.pos);
  const controls = makeControls(camera, VIEW.target); controls.minDistance = 4; controls.maxDistance = 30;
  const fx = new Sparks(400, 0.06); scene.add(fx.obj);
  const C_M = '#FF7A8A', C_P = '#7FB4FF';   // материнские / отцовские
  /* ---------- хроматиды: 4 хромосомы (A мат., A отц., B мат., B отц.) × 2 сестры ---------- */
  const chMat = (col) => new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.45, clearcoat: 0.5, emissive: col, emissiveIntensity: 0.12, transparent: true, opacity: 1 });
  const CHR = [{ L: 1.0, col: C_M }, { L: 1.0, col: C_P }, { L: 0.62, col: C_M }, { L: 0.62, col: C_P }];
  const CH = [];
  CHR.forEach((c, k) => [0, 1].forEach((s) => {
    const g = new THREE.Group(), a = c.L * 0.38, b = c.L * 0.62, r = 0.1;
    const up = new THREE.Mesh(new THREE.CapsuleGeometry(r, a, 6, 12), chMat(c.col)); up.position.y = a / 2 + 0.03; g.add(up);
    const dn = new THREE.Mesh(new THREE.CapsuleGeometry(r, b, 6, 12), chMat(c.col)); dn.position.y = -b / 2 - 0.03; g.add(dn);
    scene.add(g); CH.push({ k, s, g, up, dn, col: c.col, pos: V3(0, 0, 0), cond: 0, vis: 1 });
  }));
  /* ---------- мембраны (до 4 клеток), ядра, центросомы, веретено ---------- */
  const memb = [0, 1, 2, 3].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), glassMat(0x9cc8ff, { rim: 0.75, base: 0.02, pow: 2.2, keep: true })); scene.add(m); return { m, c: V3(0, 0, 0), r: 2.5 }; });
  const nucl = [0, 1, 2, 3].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), glassMat(0xc79bff, { rim: 0.6, base: 0.03, pow: 2.2, keep: true })); scene.add(m); return { m, c: V3(0, 0, 0), r: 1.3, op: 1 }; });
  const cMat = new THREE.MeshPhysicalMaterial({ color: 0x9be8c6, emissive: 0x2a6a50, emissiveIntensity: 0.8, roughness: 0.3 });
  const poles = [0, 1, 2, 3].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), cMat); scene.add(m); return { m, p: V3(0, 1.9, 0) }; });
  const spPos = new Float32Array(8 * 6 + 2 * 6), spGeo = new THREE.BufferGeometry(); spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
  const spMat = new THREE.LineBasicMaterial({ color: 0x9be8c6, transparent: true, opacity: 0 }); const spindle = new THREE.LineSegments(spGeo, spMat); scene.add(spindle);
  /* ---------- кольцо клеточного цикла ---------- */
  const CYC = [{ id: 'G1', f0: 0, f1: 0.46, col: '#7FE0A0', h: 'cell growth' }, { id: 'S', f0: 0.46, f1: 0.79, col: '#7FB4FF', h: 'DNA replication' }, { id: 'G2', f0: 0.79, f1: 0.96, col: '#F2C14E', h: 'preparation' }, { id: 'M', f0: 0.96, f1: 1, col: '#FF6A6A', h: 'division' }];
  const RING = 2.95, ringG = new THREE.Group(); scene.add(ringG);
  const ang = (f) => Math.PI / 2 - 2 * Math.PI * f, onRing = (f, rr = RING) => V3(Math.cos(ang(f)) * rr, Math.sin(ang(f)) * rr, 0);
  CYC.forEach((p) => { const t = new THREE.Mesh(new THREE.TorusGeometry(RING, 0.07, 8, 96, 2 * Math.PI * (p.f1 - p.f0) - 0.03), new THREE.MeshPhysicalMaterial({ color: p.col, emissive: p.col, emissiveIntensity: 0.35, roughness: 0.4 })); t.rotation.z = ang(p.f1) + 0.015; ringG.add(t); });
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 })); ringG.add(marker);
  /* ---------- стадии ---------- */
  const MIT = [{ id: 'inter', name: 'Interphase' }, { id: 'pro', name: 'Prophase' }, { id: 'prometa', name: 'Prometaphase' }, { id: 'meta', name: 'Metaphase' }, { id: 'ana', name: 'Anaphase' }, { id: 'telo', name: 'Telophase' }];
  const MEI = [{ id: 'inter', name: 'Interphase' }, { id: 'pro1', name: 'Prophase I' }, { id: 'meta1', name: 'Metaphase I' }, { id: 'ana1', name: 'Anaphase I' }, { id: 'telo1', name: 'Telophase I' }, { id: 'meta2', name: 'Metaphase II' }, { id: 'ana2', name: 'Anaphase and telophase II' }];
  const BASE = [V3(-0.5, 0.35, 0.1), V3(0.45, 0.45, -0.1), V3(-0.25, -0.45, 0.2), V3(0.4, -0.4, 0)];
  const st = { t: 0, mode: 'cycle', stage: 0, auto: true, stT: 0, cf: 0.1, labels: true, rot: false, fly: null, msg: null };
  const STAGES = () => (st.mode === 'meiosis' ? MEI : MIT);
  /* цели для текущей стадии: позиции хроматид, конденсация, клетки, ядра, полюса, к какому полюсу тянется хроматида */
  function plan() {
    const P = { ch: CH.map(() => ({ p: V3(0, 0, 0), cond: 0, vis: 1, pole: -1 })), memb: [[0, 2.5, 1], [0, 2.5, 0], [0, 2.5, 0], [0, 2.5, 0]], nuc: [[0, 1.3, 1], [0, 0.8, 0], [0, 0.8, 0], [0, 0.8, 0]], poles: [], spindle: 0, cross: false };
    const set = (i, x, y, cond, pole = -1) => { const c = P.ch[i]; c.p.set(x, y, 0.05 * (c.k % 2 ? -1 : 1)); c.cond = cond; c.pole = pole; };
    const inter = (cond = 0) => CH.forEach((c, i) => set(i, BASE[c.k].x + (c.s ? 0.115 : -0.115), BASE[c.k].y, cond));
    if (st.mode === 'cycle') {
      const f = st.cf; inter(f > 0.96 ? (f - 0.96) / 0.04 : 0);
      CH.forEach((c, i) => { P.ch[i].vis = c.s ? Math.min(1, Math.max(0, (f - 0.46) / 0.33)) : 1; if (c.s && f < 0.46) P.ch[i].p.x -= 0.115; });
      P.memb[0][1] = 2.05 + 0.45 * Math.min(1, f / 0.46); P.nuc[0][1] = 1.15 + 0.15 * Math.min(1, f / 0.46);
      P.poles = [[0, 1.75, 0], [0.18, 1.75, 0]]; return P;
    }
    const s = STAGES()[st.stage].id;
    if (st.mode === 'mitosis') {
      const metaY = (k) => 0.9 - k * 0.6;
      if (s === 'inter') { inter(0); P.poles = [[-0.12, 1.85, 0], [0.12, 1.85, 0]]; }
      if (s === 'pro') { CH.forEach((c, i) => set(i, BASE[c.k].x * 0.9 + (c.s ? 0.115 : -0.115), BASE[c.k].y * 0.9, 1)); P.nuc[0][2] = 0.55; P.poles = [[-1.4, 1.25, 0], [1.4, 1.25, 0]]; }
      if (s === 'prometa') { CH.forEach((c, i) => set(i, BASE[c.k].x * 0.4 + (c.s ? 0.115 : -0.115), (BASE[c.k].y + metaY(c.k)) / 2, 1, c.s)); P.nuc[0][2] = 0; P.poles = [[-2.2, 0, 0], [2.2, 0, 0]]; P.spindle = 0.8; }
      if (s === 'meta') { CH.forEach((c, i) => set(i, c.s ? 0.115 : -0.115, metaY(c.k), 1, c.s)); P.nuc[0][2] = 0; P.poles = [[-2.2, 0, 0], [2.2, 0, 0]]; P.spindle = 1; }
      if (s === 'ana') { CH.forEach((c, i) => set(i, c.s ? 1.5 : -1.5, metaY(c.k) * 0.7, 1, c.s)); P.nuc[0][2] = 0; P.poles = [[-2.2, 0, 0], [2.2, 0, 0]]; P.spindle = 1; P.memb[0] = [-0.25, 2.5, 1]; P.memb[1] = [0.25, 2.5, 1]; }
      if (s === 'telo') { CH.forEach((c, i) => set(i, (c.s ? 1.9 : -1.9) + (c.k - 1.5) * 0.22, 0, 0.75)); P.memb[0] = [-1.55, 1.75, 1]; P.memb[1] = [1.55, 1.75, 1]; P.nuc[0] = [-1.9, 0.75, 1]; P.nuc[1] = [1.9, 0.75, 1]; P.poles = [[-2.35, 0.6, 0], [2.35, 0.6, 0]]; P.spindle = 0.25; }
      return P;
    }
    // мейоз: A — хромосомы 0 (мат.) и 1 (отц.), B — 2 (мат.) и 3 (отц.); в метафазе I пара B ориентирована наоборот — независимое расхождение
    const side = [-1, 1, 1, -1];
    const off = (c) => (c.s ? 0.115 : -0.115) * (c.k >= 2 ? -1 : 1);   /* пара B развёрнута: внутренние (с кроссинговером) сёстры остаются внутри */
    if (s === 'inter') { inter(0); P.poles = [[-0.12, 1.85, 0], [0.12, 1.85, 0]]; }
    if (s === 'pro1') { CH.forEach((c, i) => set(i, (c.k % 2 ? 0.2 : -0.2) + (c.s ? 0.115 : -0.115), c.k < 2 ? 0.4 : -0.5, 1)); P.cross = true; P.nuc[0][2] = 0.5; P.poles = [[-1.4, 1.25, 0], [1.4, 1.25, 0]]; }
    if (s === 'meta1') { CH.forEach((c, i) => set(i, side[c.k] * 0.25 + off(c), c.k < 2 ? 0.5 : -0.5, 1, side[c.k] < 0 ? 0 : 1)); P.cross = true; P.nuc[0][2] = 0; P.poles = [[-2.2, 0, 0], [2.2, 0, 0]]; P.spindle = 1; }
    if (s === 'ana1') { CH.forEach((c, i) => set(i, side[c.k] * 1.6 + off(c), c.k < 2 ? 0.4 : -0.4, 1, side[c.k] < 0 ? 0 : 1)); P.cross = true; P.nuc[0][2] = 0; P.poles = [[-2.2, 0, 0], [2.2, 0, 0]]; P.spindle = 1; P.memb[0] = [-0.25, 2.5, 1]; P.memb[1] = [0.25, 2.5, 1]; }
    if (s === 'telo1') { CH.forEach((c, i) => set(i, side[c.k] * 1.8 + off(c), c.k < 2 ? 0.4 : -0.4, 0.8)); P.cross = true; P.memb[0] = [-1.8, 1.55, 1]; P.memb[1] = [1.8, 1.55, 1]; P.nuc[0][2] = 0; P.poles = [[-2.6, 0.9, 0], [2.6, 0.9, 0]]; }
    if (s === 'meta2' || s === 'ana2') {
      const a2 = s === 'ana2';
      CH.forEach((c, i) => { const cx = side[c.k] * 1.8; set(i, a2 ? cx + (c.s ? 0.75 : -0.75) + (c.k >= 2 ? 0.2 : -0.2) : cx + (c.s ? 0.115 : -0.115), a2 ? 0 : (c.k < 2 ? 0.4 : -0.4), a2 ? 0.55 : 1, (side[c.k] < 0 ? 0 : 2) + c.s); });
      P.cross = true; P.nuc[0][2] = 0; P.poles = [[-2.75, 0, 0], [-0.85, 0, 0], [0.85, 0, 0], [2.75, 0, 0]]; P.spindle = a2 ? 0.3 : 1;
      P.memb = a2 ? [[-2.55, 0.8, 1], [-1.05, 0.8, 1], [1.05, 0.8, 1], [2.55, 0.8, 1]] : [[-1.8, 1.55, 1], [1.8, 1.55, 1], [-1.8, 1.55, 0], [1.8, 1.55, 0]];
      if (a2) P.nuc = [[-2.55, 0.45, 1], [-1.05, 0.45, 1], [1.05, 0.45, 1], [2.55, 0.45, 1]];
    }
    return P;
  }
  /* кроссинговер: внутренние сестры гомологов обмениваются нижними плечами (цветом) */
  function cross(on) { [[1, 2], [5, 6]].forEach(([a, b]) => { CH[a].dn.material.color.set(on ? CH[b].col : CH[a].col); CH[a].dn.material.emissive.set(on ? CH[b].col : CH[a].col); CH[b].dn.material.color.set(on ? CH[a].col : CH[b].col); CH[b].dn.material.emissive.set(on ? CH[a].col : CH[b].col); }); }
  let crossed = false;
  function setMode(m) { st.mode = m; st.stage = 0; st.stT = 0; st.auto = true; refs.modeSeg && refs.modeSeg.sync(); ringG.visible = m === 'cycle'; st.fly = m === 'cycle' ? VIEW : flyTarget(VIEW.target.clone().add(V3(0, DK ? -0.1 : 0.3, 0)), VIEW.pos.clone().setZ(DK ? 13.7 : 11).add(V3(0, DK ? -0.1 : 0.3, 0))); st.msg = null; refs.rebuild && refs.rebuild(); refs.setInfo && refs.setInfo(); }
  function setStage(i, user) { st.stage = i; st.stT = 0; if (user) st.auto = false; refs.stSeg && refs.stSeg.sync(); refs.setInfo && refs.setInfo(); if (refs.autoT) refs.autoT.sync && refs.autoT.sync(); }
  const LR = (a, b, k) => a + (b - a) * k;
  function update(dt) {
    st.t += dt; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4; flyStep(st, camera, controls, dt);
    if (st.mode === 'cycle') { if (st.auto) st.cf = (st.cf + dt / 14) % 1; marker.position.copy(onRing(st.cf)); }
    else if (st.auto) { st.stT += dt; if (st.stT > 3.2) setStage((st.stage + 1) % STAGES().length); }
    const P = plan(), k = 1 - Math.exp(-dt * 3);
    if (P.cross !== crossed) { crossed = P.cross; cross(crossed); if (crossed) fx.spawn(CH[1].pos.clone().add(V3(0.1, -0.3, 0.2)), V3(0, 0, 0), new THREE.Color('#FFE08A'), 0.8, 0.4, 1.2); }
    CH.forEach((c, i) => { const q = P.ch[i]; c.pos.lerp(q.p, k); c.cond = LR(c.cond, q.cond, k); c.vis = LR(c.vis, q.vis, k);
      const sxz = (0.4 + 0.6 * c.cond) * c.vis, sy = (0.45 + 1.0 * (1 - c.cond)) * Math.max(0.001, c.vis);   /* спирализованная хромосома короткая, хроматин — длинная тонкая нить */
      c.g.position.copy(c.pos); c.g.scale.set(Math.max(0.001, sxz), sy, Math.max(0.001, sxz)); c.g.visible = c.vis > 0.02;
      [c.up, c.dn].forEach((m) => { m.material.opacity = 0.5 + 0.5 * c.cond; }); c.pole = q.pole; });
    memb.forEach((o, i) => { const [x, r, v] = P.memb[i]; o.c.x = LR(o.c.x, x, k); o.r = LR(o.r, r, k); o.v = LR(o.v ?? 1, v, k); o.m.position.set(o.c.x, 0, 0); o.m.scale.setScalar(o.r); o.m.visible = o.v > 0.05; });
    nucl.forEach((o, i) => { const [x, r, v] = P.nuc[i]; o.c.x = LR(o.c.x, x, k); o.r = LR(o.r, r, k); o.op = LR(o.op, v, k); o.m.position.set(o.c.x, 0, 0); o.m.scale.setScalar(o.r); o.m.visible = o.op > 0.04; o.m.material.uniforms.uGain.value = o.op; });
    poles.forEach((o, i) => { const q = P.poles[i]; if (q) { o.p.lerp(V3(...q), k); o.m.visible = true; } else o.m.visible = false; o.m.position.copy(o.p); });
    spMat.opacity = LR(spMat.opacity, P.spindle * 0.75, k); spindle.visible = spMat.opacity > 0.02;
    let n = 0; const put = (a, b) => { spPos.set([a.x, a.y, a.z, b.x, b.y, b.z], n * 6); n++; };
    CH.forEach((c) => { if (c.pole >= 0 && P.poles[c.pole]) put(poles[c.pole].p, c.pos); });
    if (P.poles.length >= 2 && P.spindle) put(poles[0].p, poles[1].p.clone().lerp(poles[0].p, 0.45)), put(poles[1].p, poles[0].p.clone().lerp(poles[1].p, 0.45));
    for (let i = n * 6; i < spPos.length; i++) spPos[i] = 0; spGeo.attributes.position.needsUpdate = true;
    fx.update(dt);
  }
  /* ---------- тексты ---------- */
  const TXT = {
    cycle: '<b>The cell cycle</b> is a cell’s life from one division to the next (≈ 24 h in dividing human cells). <b>G1</b> — growth and work; <b>S</b> — DNA replication: each chromosome gets a sister copy; <b>G2</b> — checks and preparation; <b>M</b> — mitosis. Checkpoints (p53 and others) halt the cycle if DNA is damaged; cells that stop dividing rest in <b>G0</b>.',
    inter: '<b>Interphase.</b> DNA is already copied: each chromosome has two <b>sister chromatids</b>, but it is still unwound in the nucleus (chromatin). The centrosome has doubled too — the future spindle poles.',
    pro: '<b>Prophase.</b> Chromosomes coil up and become visible as X shapes. Centrosomes move apart and the microtubules of the <b>mitotic spindle</b> grow between them; the nuclear envelope starts to break down.',
    prometa: '<b>Prometaphase.</b> The nuclear envelope is gone. Microtubules from opposite poles grab the <b>kinetochores</b> — protein “hooks” on the centromere of each sister.',
    meta: '<b>Metaphase.</b> Chromosomes line up on the <b>metaphase plate</b> in the middle. The cell waits until every sister is attached to its pole — otherwise division will not start (spindle checkpoint).',
    ana: '<b>Anaphase.</b> The protein holding sisters together (cohesin) is cut, and the spindle pulls them to the poles. Each chromatid is now a chromosome of its own. The cell elongates.',
    telo: '<b>Telophase and cytokinesis.</b> Two new nuclei form at the poles, chromosomes unwind, and a furrow splits the cytoplasm. Mitosis ends with <b>two identical cells</b>, each with the full set (46 chromosomes in humans).',
    pro1: '<b>Prophase I.</b> The key difference in meiosis: <b>homologous chromosomes</b> — from mother (pink) and from father (blue) — pair up. Their chromatids swap segments — <b>crossing over</b> — creating new combinations of genes.',
    meta1: '<b>Metaphase I.</b> <b>Pairs of homologs</b>, not single chromosomes, stand on the plate. Which homolog goes left and which goes right is random: pair B faces the other way from pair A (<b>independent assortment</b>).',
    ana1: '<b>Anaphase I.</b> <b>Homologs</b> separate while sisters stay together. The chromosome number is halved — that is why meiosis is called reduction division.',
    telo1: '<b>Telophase I.</b> Two cells, each with half the set (23 chromosomes in humans), but every chromosome still has two chromatids, now mixed by crossing over.',
    meta2: '<b>Metaphase II.</b> The second division is like mitosis: in both cells chromosomes line up on their own plates, and the spindle attaches to the sisters from both sides.',
    ana2: '<b>Anaphase and telophase II.</b> Sisters separate, giving <b>four cells</b> with a single set (n = 23), all genetically different. This is how sperm and eggs form; fertilization restores 46.',
  };
  const labels = [
    { text: 'nucleus', pos: () => nucl[0].c.clone().add(V3(0.9, 1.05, 0)), color: '#C79BFF', show: () => st.labels && nucl[0].op > 0.4 },
    { text: 'cell membrane', pos: () => memb[0].c.clone().add(V3(-0.9, -1.3, 0)), color: '#9CC8FF', left: true, show: () => st.labels && st.mode === 'cycle' },
    { text: 'centrosome', pos: () => poles[0].p.clone().add(V3(-0.1, 0.25, 0)), color: '#9BE8C6', left: true, show: () => st.labels && st.mode !== 'cycle' && st.stage > 0 && !(st.mode === 'meiosis' && st.stage >= 5) },
    { text: 'mitotic spindle', pos: () => poles[1].p.clone().lerp(V3(0, 0, 0), 0.4).add(V3(1.1, -1.6, 0)), color: '#9BE8C6', show: () => st.labels && spMat.opacity > 0.4 && st.mode !== 'cycle' },
    { text: 'metaphase plate', pos: V3(0, 1.45, 0), color: '#F2C14E', show: () => st.labels && ((st.mode === 'mitosis' && st.stage === 3) || (st.mode === 'meiosis' && st.stage === 2)) },
    { text: 'sister chromatids', pos: () => CH[0].pos.clone().add(V3(0.1, 0.8, 0)), color: '#FF9AA8', show: () => st.labels && st.mode === 'mitosis' && st.stage >= 1 && st.stage <= 3 },
    { text: 'homologs: from mother and father', pos: () => CH[1].pos.clone().lerp(CH[2].pos, 0.5).add(V3(0, 0.75, 0)), color: '#E8E0F0', show: () => st.labels && st.mode === 'meiosis' && (st.stage === 1 || st.stage === 2) },
    { text: 'crossing over', pos: () => CH[1].pos.clone().lerp(CH[2].pos, 0.5).add(V3(0.3, -0.45, 0.2)), color: '#FFE08A', show: () => st.labels && st.mode === 'meiosis' && st.stage === 1 },
    { text: 'two identical cells', pos: V3(0, -2.15, 0), color: '#E8E0F0', show: () => st.labels && st.mode === 'mitosis' && st.stage === 5 },
    { text: 'four different cells (n)', pos: V3(0, -1.35, 0), color: '#E8E0F0', show: () => st.labels && st.mode === 'meiosis' && st.stage === 6 },
    ...CYC.map((p) => ({ text: p.id + ' · ' + p.h, pos: onRing((p.f0 + p.f1) / 2, RING + 0.35), color: p.col, left: (p.f0 + p.f1) / 2 > 0.5, show: () => st.labels && st.mode === 'cycle' })),
    { text: 'G0 — rest', pos: onRing(0.36, RING + 0.6), color: '#8A90A8', show: () => st.labels && st.mode === 'cycle' },
  ];
  const dyn = labels.filter((l) => typeof l.pos === 'function'); dyn.forEach((l) => { l.fn = l.pos; l.pos = V3(0, 0, 0); });
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 420px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'cycle' ? TXT.cycle : TXT[STAGES()[st.stage].id]); };
    refs.modeSeg = seg([{ id: 'cycle', label: 'Cell cycle' }, { id: 'mitosis', label: 'Mitosis' }, { id: 'meiosis', label: 'Meiosis' }], () => st.mode, (v) => setMode(v));
    const box = h('div', { class: 'grp', style: 'flex:1 1 440px' });
    refs.rebuild = () => {
      box.innerHTML = ''; refs.stSeg = null;
      if (st.mode === 'cycle') box.append(h('div', { class: 'glabel' }, 'Phase'), h('div', { class: 'gctl' }, seg(CYC.map((p) => ({ id: p.id, label: p.id, color: p.col })), () => CYC.find((p) => st.cf >= p.f0 && st.cf < p.f1).id, (v) => { const p = CYC.find((q) => q.id === v); st.cf = (p.f0 + p.f1) / 2; st.auto = false; }), toggle('Time passes', () => st.auto, (v) => { st.auto = v; })));
      else { refs.stSeg = seg(STAGES().map((p, i) => ({ id: String(i), label: p.name })), () => String(st.stage), (v) => setStage(+v, true)); box.append(h('div', { class: 'glabel' }, 'Phase', h('kbd', {}, '← →')), h('div', { class: 'gctl' }, refs.stSeg, toggle('Auto', () => st.auto, (v) => { st.auto = v; st.stT = 0; }))); }
    };
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab });
    el.append(group('Mode', '1–3', refs.modeSeg), box, group('View', 'R · N', refs.rot, lab), ib.el);
    refs.rebuild(); refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 3) { setMode(['cycle', 'mitosis', 'meiosis'][n - 1]); return true; }
    if (st.mode !== 'cycle' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { const L = STAGES().length; setStage((st.stage + (e.key === 'ArrowRight' ? 1 : L - 1)) % L, true); refs.rebuild(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() {
    if (st.mode === 'cycle') { const p = CYC.find((q) => st.cf >= q.f0 && st.cf < q.f1); return [['Phase', p.id, ''], ['Time', Math.floor(st.cf * 24), 'h of 24'], ['DNA', st.cf < 0.46 ? '2c' : st.cf < 0.79 ? '2c → 4c' : '4c', '']]; }
    const s = st.stage, mei = st.mode === 'meiosis';
    return [['Phase', STAGES()[s].name, ''], ['Chromosomes per cell', mei ? (s >= 4 ? 23 : 46) : (s === 4 ? 92 : 46), ''], ['Cells', mei ? (s === 6 ? 4 : s >= 4 ? 2 : 1) : (s === 5 ? 2 : 1), '']];
  }
  const self = {
    mobZoom: 0.8, scene, camera, controls, update: (dt) => { update(dt); dyn.forEach((l) => { l.pos.copy(l.fn()); }); }, ui, onKey, stats, labels, drawScope: null, accent: '#FF9AB0',
    kicker: 'Cell · division', title: 'Cell division: mitosis and meiosis',
    lede: 'Every cell in the body is a copy of a single fertilized egg. How a cell doubles its DNA and splits in two — and how sex cells get exactly half the chromosomes.',
    notes: `
      <div><h2>The cell cycle</h2>
        <p>Interphase takes ≈ 95 % of the cycle: G1 (growth, protein synthesis), S (DNA replication — see “DNA”), G2 (preparing to divide). Mitosis (M) lasts about an hour. Cells that no longer divide (neurons, cardiomyocytes) leave the cycle and rest in G0.</p>
        <p>The cycle is driven by cyclins and cyclin-dependent kinases and halted by checkpoints: in G1 (DNA damage, the p53 protein), in G2 and in metaphase (are all chromosomes attached to the spindle?).</p>
        <h3>Mitosis and meiosis</h3><ul><li><b>Mitosis</b>: one cell → two genetically identical cells, set 2n = 46. Growth, renewal of skin and blood, healing.</li><li><b>Meiosis</b>: two divisions in a row → four cells with a set n = 23, all different thanks to crossing over and independent assortment. Spermatogenesis and oogenesis.</li></ul>
        <h3>Medicine</h3><p>A tumor is cells that escaped cycle control (mutations in p53, RB and others). Many anticancer drugs target division: vincristine and taxanes disrupt the spindle, others damage DNA in S phase. Nondisjunction in meiosis causes trisomies: an extra chromosome 21 is Down syndrome.</p></div>
      <div><h2>Conventions</h2><ul><li>2 chromosome pairs are shown instead of 23 in humans; length and thickness are schematic, interphase chromatin is shown as simplified unwound rods.</li><li>Color: pink — chromosomes from the mother, blue — from the father; in crossing over, non-sister chromatids of the homologs swap the lower arm (in reality, only segments).</li><li>The spindle is drawn as straight lines from the poles to the centromeres; phase durations are sped up.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode · <code>←</code> <code>→</code> phase</li><li><code>R</code> rotation · <code>N</code> labels</li></ul></div>`,
  };
  setMode('cycle'); st.fly = null;
  return self;
}
export { makeMitosis };
