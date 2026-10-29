import { SKEL_META, Sparks, THREE, V3, __set_rnd, button, ell3, envTex, flyStep, flyTarget, glassMat, group, h, infoBox, labLights, lerp, makeControls, mulberry, organMat, pathRunner, pickOn, randUnit, rnd, seg, toggle } from '../core.js';
import { blobGeo, skelShell } from './kit.js';


// @scene referred makeReferred | Отражённая боль | @body Как устроено тело
/* =========================================================
   ТЕЛО · ОТРАЖЁННАЯ БОЛЬ: зоны Захарьина — Геда (Неттер, BP 13), механизм конвергенции
   в заднем роге спинного мозга и четыре клинических случая
   ========================================================= */
const RF_ORG = [
  { id: 'heart', name: 'Heart', col: '#FF5A5A', seg: 'C8–T4', z: ['chest', 'larm', 'lneck', 'ljaw'], view: 'front',
    text: '<b>Heart.</b> Angina and heart-attack pain is felt behind the breastbone and on the left, spreading to the <b>left arm</b> along its inner side, to the neck and the lower jaw. Sensory fibers from the heart enter the spinal cord at T1–T4. The same segments receive nerves from the skin of the chest and the inner side of the arm and forearm (T1–T2, and C8 at the little finger). Radiation to the neck and jaw is linked to the vagus nerve and the cervical segments.' },
  { id: 'eso', name: 'Esophagus', col: '#FFB0D0', seg: 'T4–T6', z: ['retro'], view: 'front',
    text: '<b>Esophagus.</b> Heartburn and esophageal spasm are felt <b>behind the breastbone</b> — easy to confuse with heart pain. Segments T4–T6.' },
  { id: 'stomach', name: 'Stomach', col: '#FFA040', seg: 'T6–T9', z: ['epi', 'sback'], view: 'front',
    text: '<b>Stomach and duodenum.</b> Ulcer and gastritis pain is in the <b>epigastric region</b>, “in the pit of the stomach”, in the midline, although the stomach lies to the left. At the back the pain may be felt left of the spine, below the shoulder blade. Segments T6–T9.' },
  { id: 'liver', name: 'Liver', col: '#C07848', seg: 'T6–T9 · C3–C5', z: ['ruq', 'rsh', 'lvback'], view: 'front',
    text: '<b>Liver.</b> Liver tissue itself hardly feels pain; the stretched capsule hurts: a dull ache in the <b>right upper quadrant</b>. If the diaphragm under the liver is irritated, pain goes to the <b>right shoulder</b>: the diaphragm is supplied by the phrenic nerve from cervical segments C3–C5, and the supraclavicular nerves from the same segments (C3–C4) supply the skin over the shoulder.' },
  { id: 'gall', name: 'Gallbladder', col: '#7FD050', seg: 'T6–T9 · C3–C5', z: ['ruq', 'rscap', 'rsh'], view: 'rback', lz: 'rscap',
    text: '<b>Gallbladder.</b> Biliary colic is felt in the <b>right upper quadrant</b> and epigastrium, radiating <b>under the right shoulder blade</b> and to the right shoulder (via the phrenic nerve).' },
  { id: 'pancreas', name: 'Pancreas', col: '#F2D060', seg: 'T6–T10', z: ['epi', 'backmid'], view: 'lback', lz: 'backmid',
    text: '<b>Pancreas.</b> The gland lies against the back wall of the abdomen, so pancreatitis pain is in the epigastrium and <b>bands around</b> to the back. Segments T6–T10.' },
  { id: 'spleen', name: 'Spleen', col: '#C060A0', seg: 'T6–T8 · C3–C5', z: ['luq', 'lsh'], view: 'front',
    text: '<b>Spleen.</b> Pain in the <b>left upper quadrant</b>; blood under the diaphragm from a ruptured spleen irritates the diaphragm and causes pain in the <b>left shoulder</b> (Kehr\'s sign).' },
  { id: 'small', name: 'Small intestine', col: '#FF8A70', seg: 'T9–T11', z: ['periumb'], view: 'front',
    text: '<b>Small intestine.</b> Cramping, poorly localized pain <b>around the navel</b>: the gut develops in the midline, and its fibers reach segments T9–T11 on both sides.' },
  { id: 'appendix', name: 'Appendix', col: '#FF6A4A', seg: 'T10 · peritoneum T12–L1', z: ['periumb', 'mcb'], view: 'front',
    text: '<b>Appendix.</b> Pain starts <b>around the navel</b> (visceral, segment T10). When the inflammation reaches the parietal peritoneum, which has somatic innervation, the pain moves to the <b>right iliac region</b> and becomes sharp and precise.' },
  { id: 'colon', name: 'Large intestine', col: '#D0A080', seg: 'T10–L1', z: ['hypog', 'rliliac', 'liliac'], view: 'front',
    text: '<b>Large intestine.</b> The cecum and ascending colon “hurt” near the navel and lower right, the sigmoid colon <b>above the pubis and in the left iliac region</b>. Segments T10–L1.' },
  { id: 'kidney', name: 'Kidney and ureter', col: '#B488FF', seg: 'T10–L2', z: ['lloin', 'lflank', 'lgroin', 'lthigh'], view: 'lback', lz: 'lloin',
    text: '<b>Kidney and ureter.</b> The kidney hurts in the <b>lower back</b> and flank. A stone moving down the ureter drags the pain downwards — to the <b>groin</b>, inner thigh and genitals (segments T11–L2).' },
  { id: 'bladder', name: 'Urinary bladder', col: '#F2E070', seg: 'T11–L2 · S2–S4', z: ['suprap'], view: 'front',
    text: '<b>Bladder.</b> Pain and urgency <b>above the pubis</b> (T11–L2); from the bladder neck — into the perineum (S2–S4).' },
];
const RF_CASES = {
  mi: { name: 'Heart attack', o: 'heart', st: [
    { z: ['chest'], time: '0–5 min', view: 'front', t: '<b>Myocardial infarction, first minutes.</b> Crushing, burning pain behind the breastbone, “like an elephant sitting on the chest”. The patient cannot point to it with one finger and presses a fist to the chest (Levine\'s sign). This is typical visceral pain: dull and diffuse.' },
    { z: ['chest', 'larm', 'lneck', 'ljaw'], time: '5–30 min', view: 'front', t: '<b>The pain spreads.</b> It goes down the inner side of the left arm to the little finger, into the neck and lower jaw, sometimes to the epigastrium. In women, the elderly and people with diabetes the pain may be mild or only “in the stomach” — which is why such heart attacks are missed. Crushing chest pain lasting more than 5 minutes that does not ease at rest is a reason to call emergency services at once.' },
  ] },
  app: { name: 'Appendicitis', o: 'appendix', st: [
    { z: ['periumb'], time: '0–12 h', view: 'front', t: '<b>Appendicitis, onset.</b> Dull pain around the navel or in the epigastrium, nausea. The swollen, inflamed appendix irritates visceral fibers that enter segment T10, and the brain refers the pain to the midline of the abdomen.' },
    { z: ['mcb'], time: '12–24 h', view: 'front', t: '<b>The pain moves</b> to the right iliac region, to McBurney\'s point (one third of the way from the anterior superior iliac spine to the navel). The inflammation has reached the parietal peritoneum, whose nerves are somatic like those of the skin, so the pain becomes precise. This migration of pain is a classic sign of appendicitis (Kocher\'s sign).' },
  ] },
  bil: { name: 'Biliary colic', o: 'gall', st: [
    { z: ['ruq'], time: '0–1 h', view: 'front', t: '<b>Biliary colic.</b> An hour or two after a fatty meal a stone blocks the gallbladder duct: severe pain in the right upper quadrant and epigastrium, nausea.' },
    { z: ['ruq', 'rscap', 'rsh'], time: '1–6 h', view: 'rback', t: '<b>The pain radiates</b> under the right shoulder blade and to the right shoulder. The shoulder blade — through the shared thoracic segments T6–T9, the shoulder — through the phrenic nerve (C3–C5): the irritated diaphragm “complains” on the skin of the neck and shoulder. Pain lasting more than 6 hours with fever suggests inflammation of the gallbladder (cholecystitis).' },
  ] },
  ren: { name: 'Renal colic', o: 'kidney', st: [
    { z: ['lloin', 'lflank'], time: 'onset', view: 'lback', t: '<b>Renal colic.</b> A stone is stuck in the renal pelvis or upper ureter: waves of very severe pain in the lower back and flank. The patient writhes and cannot find a comfortable position — unlike peritonitis, where people lie still.' },
    { z: ['lflank', 'lgroin', 'lthigh'], time: 'hours later', view: 'lfront', t: '<b>The stone moves down</b> the ureter and the pain follows it — to the groin, the inner thigh and the genitals. The ureter\'s segments run from T11 to L2, and each part “refers” to its own patch of skin.' },
  ] },
};
function makeReferred() {
  __set_rnd(mulberry(1313));
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x08060a); scene.environment = envTex;
  labLights(scene, 0xff9a8a);
  // ракурс: центр C виден в правой верхней части холста (слева — заголовок, снизу — панель)
  const VW = (C, dir, d, fx = 0.14, fy = 0.05) => { const dn = dir.clone().normalize(), r = V3(0, 1, 0).cross(dn).normalize(), sh = r.multiplyScalar(-fx * d).add(V3(0, -fy * d, 0)); return flyTarget(C.clone().add(sh), C.clone().add(sh).addScaledVector(dn, d)); };
  const BC = V3(0.1, 12.0, 0.2), MC = V3(36.9, 0.3, 0);
  const VIEW = { front: VW(BC, V3(0.1, 0.08, 1), 26), back: VW(BC, V3(-0.1, 0.08, -1), 26), rback: VW(BC, V3(-0.75, 0.08, -0.66), 26), lback: VW(BC, V3(0.75, 0.08, -0.66), 26), lfront: VW(BC.clone().add(V3(0, -0.6, 0)), V3(0.55, 0.05, 0.85), 26), mech: VW(MC, V3(0.02, 0.04, 1), 31, 0.14, 0.1) };
  const VIEWM = { front: VW(BC, V3(0.1, 0.05, 1), 13.5, 0, -0.03), back: VW(BC, V3(-0.1, 0.05, -1), 13.5, 0, -0.03), rback: VW(BC, V3(-0.75, 0.05, -0.66), 13.5, 0, -0.03), lback: VW(BC, V3(0.75, 0.05, -0.66), 13.5, 0, -0.03), lfront: VW(BC, V3(0.55, 0.05, 0.85), 13.5, 0, -0.03),
    mech: VW(MC, V3(0, 0.03, 1), 17.5, -0.06, 0) }, mqm = window.matchMedia('(max-width:700px)'), VV = (m) => (mqm.matches && VIEWM[m]) || VIEW[m];
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
    map: '<b>Referred pain.</b> A diseased organ often “hurts” not where it lies but on a patch of skin — a <b>Head zone</b> (Zakharyin–Head zone). Click an organ or choose it in the list to see its zone. Zones help doctors: pain in the left arm may mean a heart attack, pain in the shoulder — blood under the diaphragm.',
    mech: '<b>Why pain “moves”.</b> Sensory fibers from the heart (red impulse) run with the sympathetic nerves through the sympathetic trunk without stopping in its ganglia and reach the spinal nerve through the white ramus communicans. The cell body of this neuron lies in the <b>dorsal root ganglion</b>, and it synapses in the dorsal horn of the same segment that receives fibers from the skin (blue impulse). Both converge on <b>one dorsal horn neuron</b>; its axon crosses to the other side and ascends in the spinothalamic tract to the thalamus. Signals from the skin arrive throughout life, from the heart rarely, so the brain habitually attributes the pain to the skin.',
    mis: '<b>The brain\'s mistake.</b> The signal from the heart reached the thalamus along the same path that normally brings pain from the skin of the chest and left arm. The cortex “draws” the pain there — the dashed arrow shows where the brain projects it.',
    cases: '<b>Four classic cases.</b> Choose a case: the pain changes place as the disease develops. Stages change by themselves, or press “Next”.',
  };
  const refs = {};
  const labels = [
    // подписи органов: в обзоре — у самих органов (справа или слева по стороне тела), при выборе — у выбранного
    ...RF_ORG.map((o) => { const OV = { spleen: V3(0.95, 11.5, -0.1) }, op = OV[o.id] ? OV[o.id].clone() : ORG[o.id].meshes[0].position.lengthSq() > 0 ? ORG[o.id].meshes[0].position.clone() : ({ eso: V3(0.03, 13.9, 0.0), colon: V3(0.95, 9.7, 0.5), appendix: V3(-0.6, 9.36, 0.68), small: V3(0.05, 10.0, 0.75), kidney: V3(0.6, 11.2, -0.32) }[o.id] || V3(0, 10, 0));
      const side = { heart: 1, eso: -1, stomach: 1, liver: -1, gall: -1, pancreas: 1, spleen: 1, small: 1, appendix: -1, colon: 1, kidney: 1, bladder: -1 }[o.id];
      return { text: o.name.toLowerCase(), pos: op.clone().add(V3(side * 0.05 + (side > 0 && !mqm.matches ? 0.55 : 0), 0, 0.35)), color: o.col, show: () => st.labels && st.mode === 'map' && (st.sel ? st.sel === o.id : st.side !== 'back') }; }),
    ...Object.entries(ZONES).map(([zid, arr]) => ({ text: 'pain is felt here', pos: arr[0].p.clone().add(V3(0.1, 0.05, Math.sign(arr[0].p.z - 0.18) * 0.12)), color: '#FFD0A0', show: () => st.labels && ((st.mode === 'map' && st.sel && (ORG[st.sel].lz || ORG[st.sel].z[0]) === zid) || (st.mode === 'cases' && RF_CASES[st.cs].st[st.stage].z[RF_CASES[st.cs].st[st.stage].z.length - 1] === zid)) })),
    { text: 'spinal cord, cross-section', pos: Q(0.0, -1.55, 0.3), color: '#F2E6C8', show: () => st.labels && st.mode === 'mech' },
    { text: 'dorsal horn neuron', pos: NRN.clone().add(V3(-0.2, 0.45, 0.3)), color: '#FFD27A', show: () => st.labels && st.mode === 'mech' },
    { text: 'white ramus', pos: Q(-3.75, -0.3, 0.3), color: '#F4C542', show: () => st.labels && st.mode === 'mech' },
    { text: 'spinothalamic tract', pos: Q(1.2, -0.75, 0.6), color: '#FF8A5A', show: () => st.labels && st.mode === 'mech' },
    { text: 'dorsal root ganglion', pos: DRG.clone().add(V3(0, 0.3, 0.2)), color: '#F4C542', show: () => st.labels && st.mode === 'mech' },
    { text: 'sympathetic trunk', pos: Q(-2.7, -2.3, 0.3), color: '#E8B060', show: () => st.labels && st.mode === 'mech' },
    { text: 'heart', pos: HEARTP.clone().add(V3(0.5, -0.5, 0.4)), color: '#FF6A5A', show: () => st.labels && st.mode === 'mech' },
    { text: 'skin of chest and left arm', pos: SKINP.clone().add(V3(-0.6, 1.15, 0.2)), color: '#7FD6FF', show: () => st.labels && st.mode === 'mech' },
    { text: 'to thalamus and cortex', pos: BRAIN.clone().add(V3(0.95, 0.4, 0.2)), color: '#FFB070', show: () => st.labels && st.mode === 'mech' },
    { text: 'anterior horn', pos: Q(0.35, -0.95, 0.3), color: '#C8B0D8', show: () => st.labels && st.mode === 'mech' },
  ];
  function ui(el) {
    const ib = infoBox('1 1 340px');
    refs.setInfo = () => { ib.info.innerHTML = st.msg || (st.mode === 'map' ? (st.sel ? ORG[st.sel].text : TXT.map) : st.mode === 'cases' ? RF_CASES[st.cs].st[st.stage].t : TXT.mech); };
    refs.modeSeg = seg([{ id: 'map', label: 'Zone map' }, { id: 'mech', label: 'Mechanism' }, { id: 'cases', label: 'Cases' }], () => st.mode, (v) => setMode(v));
    refs.seg = seg([{ id: 'all', label: 'All' }, ...RF_ORG.map((o) => ({ id: o.id, label: o.name, color: o.col }))], () => (st.mode === 'map' ? st.sel || 'all' : null), (v) => select(v));
    const sideSeg = seg([{ id: 'auto', label: 'Auto' }, { id: 'front', label: 'Front' }, { id: 'back', label: 'Back' }], () => st.side || 'auto', (v) => { st.side = v === 'auto' ? null : v; if (st.mode === 'mech') setMode('map', true); st.fly = VV(st.side || (st.mode === 'cases' ? RF_CASES[st.cs].st[st.stage].view : st.sel ? ORG[st.sel].view : 'front')); });
    refs.csSeg = seg(Object.entries(RF_CASES).map(([k, c]) => ({ id: k, label: c.name })), () => (st.mode === 'cases' ? st.cs : null), (v) => setCase(v));
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    refs.lab = lab;
    refs.impSeg = seg([{ id: 'visc', label: 'From heart', color: '#FF6A5A' }, { id: 'soma', label: 'From skin', color: '#7FD6FF' }], () => (st.mode === 'mech' && st.sig ? st.sig.kind : null), (v) => fire(v));
    refs.gOrg = h('div', { class: 'grp', style: 'flex:1 1 560px' }, h('div', { class: 'glabel' }, 'Organ', h('kbd', {}, 'click')), h('div', { class: 'gctl' }, refs.seg));
    refs.gCase = group('Case', 'C · space', refs.csSeg, button('Next', () => { if (st.mode !== 'cases') setMode('cases'); else nextStage(); }));
    refs.gImp = group('Impulse', 'V · S', refs.impSeg);
    el.append(group('Mode', '1–3', refs.modeSeg), refs.gOrg, refs.gCase, refs.gImp, group('View', 'R · N', sideSeg, refs.rot, lab), ib.el);
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
    const VN = { front: 'front', back: 'back', rback: 'back right', lback: 'back left', lfront: 'front left' };
    if (st.mode === 'cases') { const c = RF_CASES[st.cs], v = st.side || c.st[st.stage].view; return [['Stage', (st.stage + 1) + ' of ' + c.st.length, ''], ['Time', c.st[st.stage].time, '']]; }
    if (st.mode === 'mech') return [['Segment', 'T1–T4', ''], ['Neurons in chain', 3, '']];
    return st.sel ? [['Segments', ORG[st.sel].seg, ''], ['View', VN[st.side || ORG[st.sel].view], '']] : [['Organs', RF_ORG.length, ''], ['Zones', Object.keys(ZONES).length, '']];
  }
  setMode('map'); camera.position.copy(st.fly.pos); controls.target.copy(st.fly.target); controls.update(); st.fly = null;
  const self = {
    mobZoom: 0.7, scene, camera, controls, update, ui, onKey, stats, labels, drawScope: null, accent: '#FF8A6A',
    kicker: 'Body · nervous system', title: 'Referred pain',
    lede: 'Why a heart attack hurts in the left arm and appendicitis first around the navel: organs “complain” on the skin of their spinal cord segments.',
    notes: `
      <div><h2>Zakharyin–Head zones</h2>
        <p>In 1889 the physician G. A. Zakharyin in Moscow and in 1893 the neurologist Henry Head in London independently described how, in diseases of internal organs, certain patches of skin become tender and hypersensitive. These patches match <b>dermatomes</b> — strips of skin supplied by one spinal cord segment.</p>
        <h3>Visceral and somatic pain</h3>
        <p>Internal organs hardly feel cutting or burning but hurt when stretched, in spasm, inflamed or short of oxygen. Visceral pain is dull and poorly localized, often with nausea and sweating. The parietal peritoneum and pleura are innervated like the skin — their pain is sharp and precise.</p></div>
      <div><h2>Simplifications</h2><ul><li>Zones follow Netter's atlas (BP 13); they vary considerably between people.</li><li>The zones of the heart, esophagus, appendix and bladder and the back zone of the pancreas were added from clinical guides: Netter's plate does not show them.</li><li>Renal colic is shown on the left; it can occur on either side.</li><li>The spinal cord section is schematic and pathways are shortened.</li></ul>
        <p><b>This is not a self-diagnosis guide.</b> Severe pain in the chest, abdomen or lower back is a reason to see a doctor.</p></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>3</code> mode</li><li>click: organ</li><li><code>C</code> next case</li><li><code>space</code> next</li><li><code>V</code> · <code>S</code> impulse</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeReferred };
