import { BODY, Sparks, THREE, V3, __set_rnd, bodyShell, ell3, flowTubeMat, group, infoBox, makeControls, mulberry, organMat, pickOn, range, rnd, seg, toggle, tube } from '../core.js';
import { BIO_MOL, bioStage, blobGeo, plotAxes, plotLine } from './kit.js';
Object.assign(BIO_MOL, {"cortisol":{"name":"Cortisol","el":"C C C C C O C C C C C C C O C C C C C C C O C O C O H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"AP/D/0n/A//f/+D/vf5u/ywAJv5n/xUA5P3w/yUAbf34/0EAOP5tABAAuv5mAPH/Bf/qAN7/l//lAAgA3v9jAN3/kv/q/xcA3/9p/ycA2f8J/7//dgB4/0wAugDn/wAAwQDL/2r/agBqABgAxQDYAOT/VQGiAPv/RgESADAASwEZAL4AswG1////qAE7/xEAMQLk/7b/gAI1AA0AZv+6/yT/z/4WABb/yv5n/zb/5/4N/xAAzv59/5cA+v0h/1wAE/5C/7D/Cv7QABwA0v43ARgA//4GAXT/zf85Adz/nv/sAHUA4P9eAHH/gP8LAIIAs/82/4EAqf+6/t7/pgAY/zYAeQCI/7gA+QBv/1n/8wAdADX/XQC//0H/YAB2AIUAtgDnAHn/uAA0ARsAhgHfAEUAiQGlAJz/JwFuANsAbAKM/5r/FwIbAFz/RgJgAE4A","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYABgAHAAEABwAHAAgACAAJAAkACgAKAAsAAQALAAsADAAMAA0ADAAOAA4ADwAPABAADwARAAoAEQARABIAEgATABMAFAAPABQAFAAVABQAFgAWABcAFgAYABgAGQAAABoAAAAbAAAAHAACAB0AAgAeAAMAHwADACAABgAhAAgAIgAIACMACQAkAAkAJQAKACYACwAnAAwAKAANACkADgAqAA4AKwAQACwAEAAtABAALgARAC8AEgAwABIAMQATADIAEwAzABUANAAYADUAGAA2ABkANwA=","o":"11112121111111111111111111211111111111111111111111111111111"},"tag":{"name":"Triacylglycerol","el":"C C C C C C C C C C C C C C C C O O C C C O C O C C C C C C C C C C C C C C C O C O C C C C C C C C C C C C C C C C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"nP5b/XX/qP7k/TT/rv5S/p3/IP5m/tT/FP4c/lgAYv5p/sIAA/69/hUBsP0g/8MADP6N/44AHv7z/wABxf1rAN0ACv65AG4Afv4GAa8AWP6ZAakAb/7LARoAA//rAQYAKv9dAhwAX/+IAdr/hP+HAVL/GQBpAVH/YgDwAUb/zgDmAZ7/xQAHAicAYgA8AlcAPAHoAYIAIwF0AeEA+gD5AJAAYgDqAKMATACcACQBYQAIAAMB4v++/yUBkP+Y/6wAX/8TAGAApP8NANj/Xf+k/4H/4P7j/0b/C/8/ANP+8f7z/1H+Wf+G/zz+OgASAen+vADYAOb+GAEZAbX+1wBOAB//IQH//7P+6ABz/6/+MQEf/xj/2AAW/5T/bACu/nj/pgAi/pH/sgAL/icAJwEG/mYArAEX/hwAGAJC/oAA/wHT/qgAPAIt/zwA0gI6/1MA9gKM/84AuwIYAMMANgIbAA8BzP5c/df/zP4Q/Tf/M/5B/YH/BP/n/fj+U/71/fL+8P40/u//0f6v/nH/2f09/oz/Dv7Q/t//O/63/VEAq/0X/nYAr/6l/pMAlP4g/gQBvv16/ksBPP71/mABZf1O/wQBff3t/nIAbf5m/3AA2/29/zkA/f3H/14Bhv4SAAcBZP1IALsAuv2qADUBMv54ACEAxP0BAUIAh/7mABcB2v7xAHoA7/2mAcQAl/7TAe0AM/4lAgkAUP5+AdP/Tv83AR7/bv/mASP/NQA8AbH/hgD9Ad/+HwBCAl//kwHRAUMAVAFCArwA0wCNAScBfgFdARkBEAEIAScALAGhALUAOAC2AE8ANQBNAa0A6f+xAEoBlwC7AG4BeAD9/5kAtADh/z4B//9g/1kBpP/0/20By/9a/2kAOP9d/8sAe/9uAJUA8/4OAFQADADx/+X/nf9uAKj/ov+D/zP/Qv9O/8D/q/4dAJH/nv6V/x//0P6aANb+dP9WANz+jf7G/1T+9f46AP39vf+w/0r+Sf82/4X+UP9d/9f9FQFVAHj/eAAeADf/jAH//8f+DwEtAFD+fQBy/8P++gBG/0z+kAFO/zP/RQG8/vD+qgB2/6j/EgH3/ur/FwC+/rr/SwC1/hD/XwDY/Wj/AwEW/lz/VgD+/WIAKQH1/dMAogFi/s7/yAG4/e//eQI3/lIAEQIC/tkALALn/gkBlAHm/q0ALAL+/tr/DAKO/zsA/wLX/lsA/gJr//v/YwOV/9QA0wJc/yoBAANgAO8AqgIxAFoA6wFMANIAQwJSAGwBFgK2/yUB","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAA0ADgAOAA8ADwAQAA8AEQARABIAEgATABMAFAAUABUAFQAWABYAFwAWABgAGAAZABkAGgAaABsAGwAcABwAHQAdAB4AHgAfAB8AIAAgACEAIQAiACIAIwAjACQAJAAlACUAJgATACcAJwAoACgAKQAoACoAKgArACsALAAsAC0ALQAuAC4ALwAvADAAMAAxADEAMgAyADMAMwA0ADQANQA1ADYANgA3ADcAOAA4ADkAOQA6AAAAOwAAADwAAAA9AAEAPgABAD8AAgBAAAIAQQADAEIAAwBDAAQARAAEAEUABQBGAAUARwAGAEgABgBJAAcASgAHAEsACABMAAgATQAJAE4ACQBPAAoAUAAKAFEACwBSAAsAUwAMAFQADABVAA0AVgANAFcADgBYAA4AWQASAFoAEgBbABMAXAAUAF0AFABeABgAXwAYAGAAGQBhABkAYgAaAGMAGgBkABsAZQAbAGYAHABnABwAaAAdAGkAHQBqAB4AawAeAGwAHwBtAB8AbgAgAG8AIABwACEAcQAhAHIAIgBzACIAdAAjAHUAIwB2ACQAdwAkAHgAJQB5ACUAegAmAHsAJgB8ACYAfQAqAH4AKgB/ACsAgAArAIEALACCACwAgwAtAIQALQCFAC4AhgAuAIcALwCIAC8AiQAwAIoAMACLADEAjAAyAI0AMwCOADMAjwA0AJAANACRADUAkgA1AJMANgCUADYAlQA3AJYANwCXADgAmAA4AJkAOQCaADkAmwA6AJwAOgCdADoAngA=","o":"11111111111111121111112111111111111111112111111112111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},"glu":{"name":"Glutamate","el":"N C C C C O O C O O H H H H H H H H H","xyz":"1gCAAMP/iABIADEAAgCQADwAqv90AMP/Tf///+P/Vf+X/6P/7f4KAEsAegCy/x8AWABr/30AlAB2/6D/7QDhANf/LAFLALj/wQBaAI4Az/9vAJcAFAD8AEQAbv/NAK3/5v9cAGz/Af/Y/5wAdgCo/1P/","b":"AAABAAEAAgACAAMAAwAEAAQABQAEAAYAAQAHAAcACAAHAAkAAAAKAAAACwABAAwAAgANAAIADgADAA8AAwAQAAYAEQAJABIA","o":"111121121111111111"},"lactate":{"name":"Lactate","el":"C C O C O O H H H H H H","xyz":"kwBsAND/SwAHACkAgACG/xIAtv8IAAgAdP9tABcAd/+S/9f/nQDLAAUAWgB8AHT/9gBHALf/WQAiAJEAlwB8/7T/m/9v/4P/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAAACAABAAkAAgAKAAUACwA=","o":"11121111111"},"glycerol":{"name":"Glycerol","el":"O C C O C O H H H H H H H H","xyz":"Y/+l/zMAg//w/8D/AABGANH/AACPAEoAfQDw/8D/nQCl/zMAk/9R/zIALv8yAKf/kv+s/2v/AACQAH7/HQDqADkAbgCs/2v/0gAyAKf/uwDg/3oA","b":"AAABAAEAAgACAAMAAgAEAAQABQAAAAYAAQAHAAEACAACAAkAAwAKAAQACwAEAAwABQANAA==","o":"1111111111111"},"gly":{"name":"Glycine","el":"N C C O O H H H H H","xyz":"vQDw/wsAUABOAPL/yv8FAP7/Y/9FAAkAxv93//v/DQEiAC8A1gDC/7X/WwB4AI7/VACfADwA8/9K/0QA","b":"AAABAAEAAgACAAMAAgAEAAAABQAAAAYAAQAHAAEACAAEAAkA","o":"112111111"},"urea":{"name":"Urea","el":"N C N O H H H H","xyz":"gv9DAAAAAAD6/wAAfgBDAAAAAACA/wAAgv+oAAAAKv8RAAAAfgCoAAAA1gARAAAA","b":"AAABAAEAAgABAAMAAAAEAAAABQACAAYAAgAHAA==","o":"1121111"}});


// @scene fedfast makeFedfast | Обмен веществ: сытость и голод | Гормоны
/* =========================================================
   БИОХИМИЯ · ИНТЕГРАЦИЯ ОБМЕНА: потоки глюкозы, жирных кислот, кетоновых тел, аминокислот,
   лактата и глицерина между органами — от еды до 40 дней голода; инсулин/глюкагон
   ========================================================= */
const FF_ST = [
  { t: 0, name: 'After a meal', text: '<b>Absorptive state</b> (0–4 h after a meal). Glucose and amino acids travel from the gut into the portal vein, fats in chylomicrons. <b>Insulin</b> is high: the liver stores glycogen and converts excess glucose into fat (VLDL → adipose tissue), muscles take up glucose (GLUT4) and build glycogen and protein, and adipose tissue stores TAG. The brain runs on glucose.' },
  { t: 1, name: 'Fasting, 12 h', text: '<b>Postabsorptive state.</b> Insulin falls and <b>glucagon</b> rises. The liver breaks down glycogen and releases glucose — above all for the brain and red blood cells. Adipose tissue begins lipolysis: fatty acids fuel muscle and the heart. Gluconeogenesis from lactate (Cori cycle), alanine and glycerol gains momentum.' },
  { t: 2, name: 'Starvation, 3 days', text: '<b>Early starvation.</b> Liver glycogen is exhausted (within ~24 h). Glucose comes from <b>gluconeogenesis</b>, mainly from amino acids of muscle protein (cortisol) and glycerol. Fatty acids are the main fuel of almost all tissues; the liver turns their excess into <b>ketone bodies</b>, whose level rises rapidly.' },
  { t: 3, name: 'Starvation, 3–6 weeks', text: '<b>Prolonged starvation.</b> The brain adapts and covers up to 2/3 of its needs with <b>ketone bodies</b> — glucose use, and with it protein breakdown, drops sharply: the body <b>spares protein</b>. The kidneys also make glucose. Fat lasts 1–2 months (in a person of normal weight); death comes when vital proteins start to be broken down.' },
];
function makeFedfast() {
  __set_rnd(mulberry(2301));
  const scene = bioStage({ rim: 0xf2c14e });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.set(0.5, 1.4, 17.5);
  const controls = makeControls(camera, V3(0.2, -0.6, 0)); controls.minDistance = 4; controls.maxDistance = 35;
  const fx = new Sparks(1400, 0.08); scene.add(fx.obj);
  bodyShell(scene, { rim: 0.18 });
  const O = {};
  const om = (id, geo, col, k = 0.45) => { const m = new THREE.Mesh(geo, organMat(col, k)); m.userData.pick = id; scene.add(m); O[id] = m; return m; };
  om('brain', ell3(0.3, 0.25, 0.35, BODY.head), '#E0A0B8');
  om('liver', blobGeo(0.75, 0.42, 0.45, 5, 0.08, 4), '#B0523A', 0.5).position.set(-0.35, 1.55, 0.15);
  om('gut', tube(Array.from({ length: 14 }, (_, i) => V3(Math.sin(i * 1.3) * 0.45, 0.95 - i * 0.05, 0.2 + Math.cos(i * 1.3) * 0.15)), 0.09, 120, 8), '#E8A0A0');
  om('fat', ell3(0.55, 0.3, 0.25, V3(0.95, 0.35, 0.3)), '#F2D08A', 0.38);
  om('mus', tube([V3(-0.47, -0.3, 0.05), V3(-0.5, -1.2, 0.08), V3(-0.48, -2.0, 0.06)], 0.24), '#C0504A', 0.4);
  om('kid', ell3(0.14, 0.24, 0.12, V3(0.55, 1.15, -0.25)), '#A04A3A', 0.45);
  om('heart', ell3(0.22, 0.27, 0.2, BODY.heart), '#C84A50', 0.45);
  const P = { brain: BODY.head.clone().add(V3(0, -0.2, 0.2)), liver: V3(-0.35, 1.55, 0.45), gut: V3(0, 0.75, 0.4), fat: V3(0.95, 0.35, 0.5), mus: V3(-0.5, -0.9, 0.3), kid: V3(0.55, 1.15, 0.1), heart: BODY.heart.clone().add(V3(0, 0, 0.2)) };
  const C = { glu: '#F2C14E', fa: '#FFB070', ket: '#FF8AB0', aa: '#7FE0A0', lac: '#FF6A6A', gly: '#C8C8D0', tag: '#E8C060' };
  // поток: [откуда, куда, вещество, вес(s)] — s от 0 (еда) до 3 (длительный голод)
  const W = (pts) => (s) => { const i = Math.min(2, Math.floor(s)), f = s - i; return pts[i] + (pts[i + 1] - pts[i]) * f; };
  const FL = [
    ['gut', 'liver', 'glu', W([1, 0, 0, 0])], ['gut', 'liver', 'aa', W([0.8, 0, 0, 0])], ['gut', 'fat', 'tag', W([0.8, 0, 0, 0])],
    ['liver', 'brain', 'glu', W([0.7, 0.8, 0.55, 0.3])], ['liver', 'mus', 'glu', W([0.6, 0.25, 0.1, 0.05])], ['liver', 'fat', 'tag', W([0.6, 0.1, 0, 0])],
    ['fat', 'mus', 'fa', W([0, 0.5, 0.9, 0.9])], ['fat', 'liver', 'fa', W([0, 0.4, 0.9, 0.9])], ['fat', 'liver', 'gly', W([0, 0.3, 0.6, 0.6])], ['fat', 'heart', 'fa', W([0.1, 0.5, 0.8, 0.8])],
    ['liver', 'brain', 'ket', W([0, 0.05, 0.6, 1])], ['liver', 'mus', 'ket', W([0, 0.05, 0.6, 0.4])], ['liver', 'heart', 'ket', W([0, 0.05, 0.5, 0.5])],
    ['mus', 'liver', 'aa', W([0, 0.3, 0.9, 0.35])], ['mus', 'liver', 'lac', W([0.2, 0.35, 0.3, 0.2])], ['kid', 'brain', 'glu', W([0, 0, 0.1, 0.35])],
  ];
  const FM = FL.map(([a, b, k, w], i) => { const pa = P[a], pb = P[b]; const mid = pa.clone().lerp(pb, 0.5).add(V3((i % 3 - 1) * 0.35, 0.15 * (i % 2 ? 1 : -1), 0.35 + (i % 4) * 0.08)); const c = new THREE.QuadraticBezierCurve3(pa, mid, pb); const f = flowTubeMat(C[k], 0.4, 2.0); scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.022, 6), f)); return { c, f, k, w }; });
  const PRT = []; for (let i = 0; i < 160; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.visible = false; scene.add(m); PRT.push({ m, f: 0, u: 0 }); }
  const st = { t: 0, s: 0, play: true, labels: true, rot: false, sel: null, msg: null, hist: [] };
  pickOn(() => self, camera, () => Object.values(O), (id) => { st.sel = id; refs.setInfo(); });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4;
    if (st.play) { st.s += dt * 0.08; if (st.s > 3.6) st.s = 0; refs.sl && (refs.sl.querySelector('input').value = Math.min(3, st.s), refs.sl.querySelector('output').textContent = stateName(Math.min(3, st.s))); }
    const s = Math.min(3, st.s);
    FM.forEach((F) => { F.f.uniforms.uTime.value = t; F.f.uniforms.uOn.value = Math.max(0.03, F.w(s)); });
    PRT.forEach((p) => { if (!p.m.visible || p.u >= 1) { const i = Math.floor(rnd() * FM.length); const F = FM[i]; if (rnd() < F.w(s) * 0.6) { p.f = i; p.u = 0; p.m.visible = true; p.m.material.color.set(C[F.k]); } else { p.m.visible = false; return; } } p.u += dt * 0.35; p.m.position.copy(FM[p.f].c.getPoint(Math.min(1, p.u))); });
    const ins = [1, 0.25, 0.1, 0.08], glg = [0.15, 0.6, 0.9, 0.8]; const W2 = (a) => { const i = Math.min(2, Math.floor(s)), f = s - i; return a[i] + (a[i + 1] - a[i]) * f; };
    st.ins = W2(ins); st.glg = W2(glg); st.glu = W2([7.5, 4.8, 3.8, 3.6]); st.ket = W2([0.05, 0.2, 3.0, 7.0]); st.ffa = W2([0.1, 0.6, 1.2, 1.4]);
    O.liver.material.emissiveIntensity = 0.04 + 0.2 * st.ins; O.fat.material.emissiveIntensity = 0.04 + 0.25 * (1 - st.ins); O.brain.material.emissiveIntensity = 0.06 + 0.06 * Math.sin(t * 3);
    fx.update(dt);
  }
  const stateName = (s) => (s < 0.5 ? 'after a meal' : s < 1.5 ? 'fasting 12 h' : s < 2.5 ? 'starvation 3 days' : 'starvation 3–6 wk');
  function drawScope(ctx, w, h) {
    const A = plotAxes(ctx, w, h, { title: 'blood: glucose · ketones · insulin', xl: 'meal → 6 weeks', yl: '' });
    const curve = (arr, sc) => (u) => { const s = u * 3; const i = Math.min(2, Math.floor(s)), f = s - i; return (arr[i] + (arr[i + 1] - arr[i]) * f) / sc; };
    plotLine(ctx, A, curve([7.5, 4.8, 3.8, 3.6], 8), '#F2C14E'); plotLine(ctx, A, curve([0.05, 0.2, 3.0, 7.0], 8), '#FF8AB0'); plotLine(ctx, A, curve([1, 0.25, 0.1, 0.08], 1.1), '#7FD6FF', { lw: 1.4, dash: [4, 3] });
    const x = A.X(Math.min(3, st.s) / 3); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.moveTo(x, A.Y(0)); ctx.lineTo(x, A.Y(1)); ctx.stroke();
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillStyle = '#F2C14E'; ctx.fillText('glucose', A.X(0.02), A.Y(0.98)); ctx.fillStyle = '#FF8AB0'; ctx.fillText('ketones', A.X(0.75), A.Y(0.95)); ctx.fillStyle = '#7FD6FF'; ctx.fillText('insulin', A.X(0.12), A.Y(0.75));
  }
  const ORG = { brain: '<b>The brain</b> uses ~20% of resting energy, about 120 g of glucose a day, and cannot use fatty acids (they do not cross the blood–brain barrier). In starvation it switches to ketone bodies.', liver: '<b>The liver</b> is the distribution center: it stores and releases glucose (glycogen, gluconeogenesis), makes VLDL and ketone bodies, and converts amino acids into urea. In starvation it runs on fatty acids itself.', gut: '<b>The intestine</b> absorbs the products of digestion; its own cells feed mainly on glutamine.', fat: '<b>Adipose tissue</b> is the main energy store (TAG). Insulin makes it store; glucagon and epinephrine make it release fatty acids and glycerol. It is also an endocrine organ (leptin, adiponectin).', mus: '<b>Muscles</b> make up 40% of body mass. After a meal they store glycogen and build protein; at rest and in starvation they run on fatty acids and ketones; in prolonged starvation their protein is a reserve of amino acids for gluconeogenesis.', kid: '<b>The kidneys</b>, in prolonged starvation, synthesize up to half of the glucose and excrete ammonia, compensating for the acidity of ketone bodies.', heart: '<b>The heart</b> prefers fatty acids (up to 70% of its energy) and readily uses lactate and ketone bodies.' };
  const labels = [
    { text: 'brain', pos: V3(0.4, 4.5, 0), color: '#E0A0B8', show: () => st.labels }, { text: 'liver', pos: V3(-1.3, 1.6, 0.3), color: '#E07A5A', show: () => st.labels }, { text: 'intestine', pos: V3(0.3, 0.55, 0.6), color: '#E8A0A0', show: () => st.labels },
    { text: 'adipose tissue', pos: V3(1.5, 0.3, 0.3), color: '#F2D08A', show: () => st.labels }, { text: 'muscles', pos: V3(-1.3, -1.2, 0.2), color: '#C0504A', show: () => st.labels }, { text: 'kidneys', pos: V3(0.8, 1.2, 0.2), color: '#C07060', show: () => st.labels }, { text: 'heart', pos: V3(0.55, 2.1, 0.3), color: '#C84A50', show: () => st.labels },
    ...[['glucose', 'glu'], ['fatty acids', 'fa'], ['ketone bodies', 'ket'], ['amino acids', 'aa'], ['lactate', 'lac'], ['fats (TAG)', 'tag'], ['glycerol', 'gly']].map(([n, k], i) => ({ text: n, pos: V3(3.0, 3.6 - i * 0.42, 0), color: C[k], show: () => st.labels })),
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 460px');
    refs.setInfo = () => { const s = Math.min(3, st.s); const k = Math.min(3, Math.round(s)); ib.info.innerHTML = st.sel ? ORG[st.sel] : FF_ST[k].text; };
    refs.sl = range('ffS', 0, 3, 0.01, () => Math.min(3, st.s), (v) => { st.s = v; st.play = false; refs.pl.sync(); st.sel = null; refs.setInfo(); }, stateName);
    refs.pl = toggle('Time passes', () => st.play, (v) => { st.play = v; });
    const steps = seg(FF_ST.map((x, i) => ({ id: i, label: x.name })), () => Math.min(3, Math.round(Math.min(3, st.s))), (v) => { st.s = v; st.play = false; refs.pl.sync(); st.sel = null; refs.setInfo(); });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab, steps });
    el.append(group('State', 'click an organ', steps, refs.sl, refs.pl), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  let lastK = -1;
  const _upd = update; function update2(dt) { _upd(dt); const k = Math.min(3, Math.round(Math.min(3, st.s))); if (k !== lastK) { lastK = k; refs.setInfo && !st.sel && refs.setInfo(); refs.steps && refs.steps.sync(); } }
  function onKey(e) {
    const k = e.key.toLowerCase(), n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) { st.s = n - 1; st.play = false; refs.pl.sync(); st.sel = null; refs.setInfo(); refs.steps.sync(); return true; }
    if (k === ' ') { refs.pl.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Glucose', (st.glu || 5).toFixed(1), 'mmol/L'], ['Ketones', (st.ket || 0).toFixed(1), 'mmol/L'], ['Insulin/glucagon', st.ins > st.glg ? 'insulin' : 'glucagon', '']]; }
  const self = {
    scene, camera, controls, update: update2, ui, onKey, stats, labels, drawScope, accent: '#F2C14E',
    kicker: 'Biochemistry · metabolic integration', title: 'Metabolism: fed and fasting',
    lede: 'Organs share fuel like a well-coordinated team: after a meal they store it, when fasting they share it, and in starvation they adapt so that the brain is never left without food.',
    notes: `
      <div><h2>Regulation</h2>
        <p>The key pair is <b>insulin</b> (the anabolic hormone of the fed state) and <b>glucagon</b> (the catabolic hormone of fasting); their ratio sets the direction of metabolism in the liver. They are assisted by <b>epinephrine</b> (a fast signal of stress and exertion), <b>cortisol</b> (gluconeogenesis from protein during prolonged fasting and stress), <b>growth hormone</b> and thyroid hormones.</p>
        <h3>Numbers</h3><ul><li>Adult stores: glycogen ~400–500 g (≈2000 kcal), fat ~10–15 kg (≈100,000 kcal), muscle protein ~6 kg (only partly usable).</li><li>Fasting blood sugar is 3.3–5.5 mmol/L and stays around 3.5 even on day 40 of starvation.</li></ul>
        <h3>Diabetes mellitus</h3><p>It resembles “starvation amid plenty”: without enough insulin, cells do not get glucose, the liver keeps producing it, and lipolysis and ketogenesis switch on as in starvation — yet blood sugar is high.</p></div>
      <div><h2>Simplifications</h2><ul><li>Flow thickness is a qualitative estimate, not an exact value.</li><li>Time is compressed: the slider spans from a meal to 6 weeks of starvation.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>1</code>–<code>4</code> state</li><li><code>space</code> pause</li><li>click an organ</li><li><code>R</code> · <code>N</code></li></ul></div>`,
  };
  return self;
}
export { makeFedfast };
