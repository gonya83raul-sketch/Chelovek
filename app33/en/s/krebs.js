import { Sparks, THREE, V3, __set_rnd, displaceGeo, flowTubeMat, glassMat, group, infoBox, makeControls, mulberry, pickOn, randUnit, rnd, seg, smooth, toggle } from '../core.js';
import { BIO_MOL, MOL, bioStage, blobGeo, flowArrow, molGlow, molMesh, protMat } from './kit.js';
Object.assign(BIO_MOL, {"cholesterol":{"name":"Cholesterol","el":"C C C C C C C C C C C C C C C C C C C C C C C C C O C C H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H","xyz":"Sf6hAEP/m/5aAK//Uv5eADMA7/3t/y8AIv6B/44ABv74/lQAb/3l/jwAUf7d/tL/HP+mALL/J/8fAQ4Arv8OAVoA/f+yAP7/kv9LAM7/zP8IAFL/UgDE/3L/tgAZAMD/eABtADIA4ADWAF8AaQGXAHgAiwEfAEkALQHI//T/dwGN/3v/+gFJ/6T/WAKr/+v/FwLo/2gAzwJl/xIA/QBU/0wAeP/m/zwAfP6bAOT+PP4KAV//5/1xADv/qv7y/4//HP6+ADoAlv5YAIcA5P3H/8r/jP0PAFEA7P2L/+0AjP6M/6IAJf6t/p4ATv2L/m8AOf07/2QAXP3c/tL/U/5x/sD/IP4N/37/uP4A/9r/LP/PAEv/Mv95AdD/2f4vAVYAmv/fALoA3f9vAWUAGADsAKT/3f9TAAT/h/+9/y3/gQCn/xL/OwBn/6f/3wBjAHj/ZQAuAIgA6QAiARAAvQAGAbsAsgHOALQANwFE/0r/jgHe/zX/LAIi/0z/4wH2/uj/cwL7/6b/VgI6AI0ADwKb/7UAxAJE/2wAOwFP/6YABgH3/hUAlQBk/2kAKv+h/x0A0f+p/1AAXP8YAJgA","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABQAHAAEACAAIAAkACQAKAAoACwALAAwACAAMAAwADQANAA4ADgAPAA8AEAALABAAEAARABEAEgASABMAEwAUAA8AFAAUABUAFQAWABYAFwAXABgAEwAYABcAGQAUABoADAAbAAAAHAAAAB0AAAAeAAEAHwACACAAAgAhAAMAIgADACMABAAkAAQAJQAFACYABgAnAAYAKAAGACkABwAqAAcAKwAHACwACAAtAAkALgAJAC8ACgAwAAoAMQALADIADQAzAA0ANAAOADUADgA2AA8ANwAQADgAEQA5ABEAOgASADsAFQA8ABUAPQAWAD4AFgA/ABcAQAAYAEEAGABCABkAQwAaAEQAGgBFABoARgAbAEcAGwBIABsASQA=","o":"11111111111111111111211111111111111111111111111111111111111111111111111111111"},"atp":{"name":"ATP","el":"N C N C N C N C N C C O C C O P O O O P O O O P O O O C O C O H H H H H H H H H H H H H H H H","xyz":"m//TAeX/4P9dARgAwP8sAYwAAQC7AL8AXwB/AHwAhQCuAAEA4gCGAKX/2wDeADn/gAA2AVH/SQAbAc3/PQEXAK3/+ACc/53/FwFA/wMApgDs/joAKgAt/ygA1v/b/rX/rf9R/u7/NQC8/jD/Uf8q/4H///57//b/Q/8DAAwA/P4n/4UAZP6P/8H/Fv4LAAgAfv30//b/Of6bAL7/Mv4YAKoATgGV/3kAsQFN/70AgwEUADYADwIQACMAUv//ARwAtP/5AYr/5f+UACEBFwHaAOH+igEeAGD/aAH//uH/qACI/g8AtgDg/qcABgB2/gD/rP7x/oEA5P3IALT/NP68/8wA+wCt/7sApQHt/rAAZgFrAHAALQJjAPv/","b":"AAABAAEAAgACAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkAAQAJAAUACQAGAAoACgALAAsADAAMAA0ADQAOAA4ADwAPABAADwARAA8AEgASABMAEwAUABMAFQATABYAFgAXABcAGAAXABkAFwAaAAwAGwAbABwAGwAdAAoAHQAdAB4AAAAfAAAAIAADACEABwAiAAoAIwAMACQADQAlAA0AJgARACcAFQAoABkAKQAaACoAGwArABwALAAdAC0AHgAuAA==","o":"1212111211211111121112111211111111111111111111111"},"biotin":{"name":"Biotin (B7, H)","el":"O C O C C C C C S C C N C O N C H H H H H H H H H H H H H H H H","xyz":"o/55AIMAfv4wAA8ALf5gAMH/uv6n//H/P/+U/zoAp//0/wEA2f+2/37/YAB1/5P/YQAS/y0A3wBu/4wAIAHK/yYAKAFSAFoA6ACsAP3/3gAjAQsAtgBgAI3/1QDT/6D/8/6vAHwAyv6c/4b/dP5Z/xIAM/+l/6UAYP8t/ywA+v/+/0cAfP9VAO3/kf9p/2D/2/8BAC//cwAv/0H/rwCm/9sAKAEo/7QAhgGn/xIAUwFrALAAhgCFAD7/HgG4/1L/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAAIAAkACQAKAAoACwALAAwADAANAAwADgAOAA8ABwAPAAoADwAAABAAAwARAAMAEgAEABMABAAUAAUAFQAFABYABgAXAAYAGAAHABkACQAaAAkAGwAKABwACwAdAA4AHgAPAB8A","o":"121111111111211111111111111111111"},"isocitrate":{"name":"Isocitrate","el":"O C O C C C O C O O C O O H H H H H H H H","xyz":"lP71/5L/+v4MAOj/5/5KAE8Aev/M/7r/8f/6/xAAbACk//X/kQCt/2v/4QDD/1IAUwHb/y0AwwC6/9QADgCMAPL/3v/QAJr/ZQDDAEoASP4lALn/bf9g/8P/if/l/1H/1f/0/3oAVAA6/wcA8gCd/2f/FgHS/wMBawAgASwA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAcACAAHAAkABAAKAAoACwAKAAwAAAANAAMADgADAA8ABAAQAAUAEQAGABIACQATAAwAFAA=","o":"12111112112111111111"},"citrate":{"name":"Citrate","el":"O C O C C O C C O O C O O H H H H H H H H","xyz":"lP4AAMD/EP8zAMf/Iv+rAML/eP/H/9T/BgD+/+r/LwBBAHP/ZQCI/wAA8wCy/x0AGQEcAE0ASwFQ/wIABgBYAGgA6P81ANkAKADXAEsAWf5OALf/W/+H/ygAdf+M/3f/HgChAIP/aABL/6X/RABJ/1MAogF3/xoAKAAEAaIA","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYABgAHAAcACAAHAAkABAAKAAoACwAKAAwAAAANAAMADgADAA8ABQAQAAYAEQAGABIACQATAAwAFAA=","o":"12111112112111111111"},"malate":{"name":"Malate","el":"O C O C C O C O O H H H H H H","xyz":"VwDFAB8AogBXADQAEgFiAGMAYgDX/wYAz//Q/ywAuf9V/3QAdP/U/7L/Ff+J/5//j/83AFv/kQAPATwAcwDQ/5r/mgCF/zUAsP8gAG8AW/8//2kASv8vABb/","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYABgAHAAYACAAAAAkAAwAKAAMACwAEAAwABQANAAgADgA=","o":"12111121111111"},"akg":{"name":"α-Ketoglutarate","el":"O C O C C C O C O O H H H H H H","xyz":"u/7n/4kAGP8QADAA+P5UAND/of/g/1QABwAPAO3/kwDi/xEArwCb/3AAAQEVALX/WgFgANf/9QDk/zn/Z/4MAGcAoP9z/1kAu/8IALcA7v/m/4r/BwB8AOb/QwEHAAn/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAcACAAHAAkAAAAKAAMACwADAAwABAANAAQADgAJAA8A","o":"121112121111111"},"oaa":{"name":"Oxaloacetate","el":"O C O C C O C O O H H H H","xyz":"CAEpAPf/hwAtABsAVACWAD4ARgCn/xYAsf+u/ykAdP9o/3gAZ/8OAMv/kP8qAFz/9v4+AP7/KAGFAP7/cABq/2YAWgB3/7b/0v56ALr/","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYABgAHAAYACAAAAAkAAwAKAAMACwAIAAwA","o":"121121211111"},"fumarate":{"name":"Fumarate","el":"O C O C C C O O H H H H","xyz":"Gf98/wAAP/8FAAAA5f5ZAAAAz/8zAAAALgDW/wAAvgAEAAAA4QB5AAAAJgGh/wAAJf9M/1MA5P+eAAAAGABr/wAABwFF/wgA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAAACAADAAkABAAKAAcACwA=","o":"12121211111"},"lactate":{"name":"Lactate","el":"C C O C O O H H H H H H","xyz":"kwBsAND/SwAHACkAgACG/xIAtv8IAAgAdP9tABcAd/+S/9f/nQDLAAUAWgB8AHT/9gBHALf/WQAiAJEAlwB8/7T/m/9v/4P/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAAACAABAAkAAgAKAAUACwA=","o":"11121111111"},"succoa":{"name":"Succinyl-CoA","el":"O C O C C C O S C H H H H H H H H","xyz":"P/90/0gAQ//h/+7/J//Q/3j/bP9sAB8A7/9iAG4AYAA5AA8AdwB7AKv/xQCn/zQAYAGw/9j/JP+J/6MAev+vAMr/Hv+UAGAA5f8XALwABgDDAJoAjwFO/9X/pAH3/wkATQHS/3L/","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAcACAAAAAkAAwAKAAMACwAEAAwABAANAAgADgAIAA8ACAAQAA==","o":"1211121111111111"},"niacin":{"name":"Nicotinic acid (B3, PP)","el":"O C O C C C C N C H H H H H","xyz":"/f6R/wAATP8HAAAAFf90AAAA5P///wAAIwCI/wAAtgCG/wAA+gD6/wAAtgB0AAAANQB6AAAA+v5g/1QA6/8r/wAA7AAn/wAAZwH5/wAAAwDbAAAA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABgAHAAcACAADAAgAAAAJAAQACgAFAAsABgAMAAgADQA=","o":"12121212111111"},"succinate":{"name":"Succinate","el":"O C O C C C O O H H H H H H","xyz":"1v4EACkARf8AANv/O//5/2L/w/8DAC0APQD9/9P/uwAAACUAxQAHAJ4AKgH8/9f/jP4CAOn/w/9fAGgAwv+t/3EAPgBTAI//PQCh/5j/dAH+/xcA","b":"AAABAAEAAgABAAMAAwAEAAQABQAFAAYABQAHAAAACAADAAkAAwAKAAQACwAEAAwABwANAA==","o":"1211121111111"},"pyruvate":{"name":"Pyruvate","el":"C C O C O O H H H H","xyz":"ngB1AAAASwD1/wAAgwCI/wAAsv/9/wAAcP+W/wAAcv97AAAAZgDFAM//tACSAGcA/ABkAMr/WP+eAKn/","b":"AAABAAEAAgABAAMAAwAEAAMABQAAAAYAAAAHAAAACAAFAAkA","o":"121211111"},"acetyl":{"name":"Acetyl-CoA","el":"C C O S C H H H H H H","xyz":"p/9y//P/vP8JAPz/X/9SABoAXwBQANn/3wDj/x0ARf9d/8f/9f9G/7X/q/9H/1cAQgENAAcA0wDb/4kA1wCA//D/","b":"AAABAAEAAgABAAMAAwAEAAAABQAAAAYAAAAHAAQACAAEAAkABAAKAA==","o":"1211111111"},"acetate":{"name":"Acetate","el":"C C O O H H H H","xyz":"c/8tAAAABAD6/wAAGgCC/wAAcABWAAAAT/8yAGcANf/p/8b/cP+RANP/qQBUALL/","b":"AAABAAEAAgABAAMAAAAEAAAABQAAAAYAAwAHAA==","o":"1211111"},"co2":{"name":"CO₂","el":"O C O","xyz":"hv8AAAAAAAAAAAAAegAAAAAA","b":"AAABAAEAAgA=","o":"22"},"h2o":{"name":"Water","el":"O H H","xyz":"EwAKAB8ACwA/AM7/4v+3/xMA","b":"AAABAAAAAgA=","o":"11"},"malonate":{"name":"Malonate","el":"O C O C C O O H H H H","xyz":"4ADH/8b/fgAKAAkAmgBOAGkA+f/6/8j/iP/7/ykAhv/M/5kAGP8yAPX/MQHb//n/7v9NAID/9P+b/5H/1v4qAD0A","b":"AAABAAEAAgABAAMAAwAEAAQABQAEAAYAAAAHAAMACAADAAkABgAKAA==","o":"1211211111"}});


// @scene krebs makeKrebs | Пируватдегидрогеназа и цикл Кребса | Энергия
/* =========================================================
   БИОХИМИЯ · ЦИКЛ ТРИКАРБОНОВЫХ КИСЛОТ: ПДГ-комплекс, 8 реакций,
   НАДН/ФАДН₂/ГТФ/CO₂, регуляция, малонат
   ========================================================= */
const KR = [
  { id: 'citrate', name: 'Citrate', c: 6, enz: 'Citrate synthase', out: [], text: '<b>1. Citrate synthase</b> joins acetyl-CoA (C2) to oxaloacetate (C4), giving six-carbon <b>citrate</b> and releasing HS-CoA. The energy comes from breaking the thioester bond. It is inhibited by ATP, NADH, succinyl-CoA and citrate itself.' },
  { id: 'isocitrate', name: 'Isocitrate', c: 6, enz: 'Aconitase', out: ['h2o'], text: '<b>2. Aconitase</b>, via cis-aconitate (removing and then re-adding water), moves the OH group: citrate → <b>isocitrate</b>. The enzyme contains an iron–sulfur cluster. It is blocked by fluorocitrate, which is formed from fluoroacetate (a rat poison).' },
  { id: 'akg', name: 'α-Ketoglutarate', c: 5, enz: 'Isocitrate dehydrogenase', out: ['nadh', 'co2'], text: '<b>3. Isocitrate dehydrogenase</b> oxidizes isocitrate and removes CO₂, giving five-carbon <b>α-ketoglutarate</b> and the first <b>NADH</b>. This is the main regulatory enzyme of the cycle: it is activated by ADP and Ca²⁺ and inhibited by ATP and NADH.' },
  { id: 'succoa', name: 'Succinyl-CoA', c: 4, enz: 'α-Ketoglutarate dehydrogenase', out: ['nadh', 'co2'], text: '<b>4. The α-ketoglutarate dehydrogenase complex</b> is built like pyruvate dehydrogenase (the same 5 coenzymes: TPP, lipoic acid, CoA, FAD, NAD⁺). The second oxidative decarboxylation yields CO₂, <b>NADH</b> and the high-energy compound <b>succinyl-CoA</b>. It is blocked by arsenite.' },
  { id: 'succinate', name: 'Succinate', c: 4, enz: 'Succinyl-CoA synthetase', out: ['gtp'], text: '<b>5. Succinyl-CoA synthetase (succinate thiokinase)</b>: the energy of the thioester bond is used to make <b>GTP</b> from GDP and phosphate — this is <b>substrate-level phosphorylation</b>. GTP passes its phosphate to ADP → ATP.' },
  { id: 'fumarate', name: 'Fumarate', c: 4, enz: 'Succinate dehydrogenase', out: ['fadh2'], text: '<b>6. Succinate dehydrogenase</b> removes two hydrogen atoms and passes them to <b>FAD</b> → FADH₂, giving <b>fumarate</b> with a double bond. It is the only enzyme of the cycle embedded in the inner membrane: it is <b>complex II</b> of the respiratory chain. Its competitive inhibitor is <b>malonate</b> (button below).' },
  { id: 'malate', name: 'Malate', c: 4, enz: 'Fumarase', out: ['h2o'], text: '<b>7. Fumarase</b> adds water across the double bond: fumarate → <b>L-malate</b>.' },
  { id: 'oaa', name: 'Oxaloacetate', c: 4, enz: 'Malate dehydrogenase', out: ['nadh'], text: '<b>8. Malate dehydrogenase</b> oxidizes malate to <b>oxaloacetate</b>, producing the third <b>NADH</b>. The circle is closed: oxaloacetate is ready to accept the next acetyl-CoA.' },
];
const KR_TOK = { nadh: ['NADH', '#FFD070'], fadh2: ['FADH₂', '#FFE45A'], gtp: ['GTP', '#7FE0A0'], co2: ['CO₂', '#C8C8D0'], h2o: ['H₂O', '#7FD6FF'] };
function makeKrebs() {
  __set_rnd(mulberry(1001));
  const scene = bioStage({ rim: 0x7fd6ff });
  const KX = matchMedia('(max-width:700px)').matches ? -1.2 : -4.3;   // компьютер: митохондрия правее длинного заголовка
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200); camera.position.set(KX, 0.5, KX < -2 ? 26.5 : 24);
  const controls = makeControls(camera, V3(KX, -2.2, 0)); controls.minDistance = 4; controls.maxDistance = 35;
  const fx = new Sparks(1800, 0.09); scene.add(fx.obj);
  // митохондрия на фоне: оболочка и кристы
  const mito = new THREE.Mesh(new THREE.CapsuleGeometry(4.2, 9.5, 12, 48), glassMat(0xffb070, { rim: 0.2, base: 0.002, pow: 2.4, keep: true })); mito.rotation.z = Math.PI / 2; mito.scale.set(0.95, 0.85, 0.4); mito.position.set(0.5, -0.2, -5.5); scene.add(mito);
  for (let k = 0; k < 7; k++) { const g = new THREE.Mesh(displaceGeo(new THREE.CylinderGeometry(0.5, 0.5, 3.2 - Math.abs(k - 3) * 0.4, 24, 8, true, 0, Math.PI), (v) => { v.x *= 0.35; v.z *= 1.1; v.x += 0.12 * Math.sin(v.y * 2.2 + k); }), new THREE.MeshPhysicalMaterial({ color: 0x8a5a40, roughness: 0.7, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide })); g.position.set(-6.7 + k * 2.2, -0.3 + (k % 2 ? 0.8 : -0.8), -5.5); scene.add(g); }
  const C = V3(1.0, 0.1, 0), R = 3.0;
  const ang = (k) => Math.PI / 2 - 0.42 - k * (Math.PI * 2 / 8);
  const pos = (k, r = R) => V3(C.x + Math.cos(ang(k)) * r, C.y + Math.sin(ang(k)) * r, 0);
  const NODES = KR.map((d, k) => { const m = molMesh(MOL(d.id), { scale: 0.19, hideH: true }); m.position.copy(pos(k)); scene.add(m); return { d, m, k }; });
  // дуги
  const arcs = KR.map((d, k) => { const a0 = ang(k) - 0.2, a1 = ang(k + 1) + 0.2; const pts = []; for (let i = 0; i <= 24; i++) { const a = a0 + (a1 - a0) * i / 24; pts.push(V3(C.x + Math.cos(a) * R, C.y + Math.sin(a) * R, 0)); } const c = new THREE.CatmullRomCurve3(pts); const f = flowTubeMat('#7FD6FF', 0.5, 1.2); scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.045, 6), f)); return { c, f }; });
  // ПДГ-комплекс
  const PDH = new THREE.Group(); PDH.position.set(-5.3, -0.7, 0); scene.add(PDH);
  PDH.add(new THREE.Mesh(blobGeo(1.25, 1.25, 1.25, 51, 0.06, 4), glassMat(0xf2c14e, { rim: 0.35, base: 0.008, keep: true })));
  for (let k = 0; k < 20; k++) { const d = randUnit(); const b = new THREE.Mesh(blobGeo(0.2, 0.2, 0.2, k, 0.12, 3), protMat(k % 3 === 0 ? '#FF8A5C' : k % 3 === 1 ? '#7FE0A0' : '#7FD6FF', 0.3)); b.position.copy(d.multiplyScalar(0.85)); PDH.add(b); }
  const pdhPick = new THREE.Mesh(new THREE.SphereGeometry(1.3, 12, 8), new THREE.MeshBasicMaterial({ visible: false })); pdhPick.userData.pick = 'pdh'; PDH.add(pdhPick);
  const pyr = molMesh(MOL('pyruvate'), { scale: 0.2, hideH: true }); scene.add(pyr);
  const acetyl = molMesh(MOL('acetyl'), { scale: 0.2, hideH: true }); scene.add(acetyl);
  const pdhA = flowArrow(scene, V3(-4.0, -0.4, 0), pos(0, R + 0.2).add(V3(-0.9, 0.5, 0)), '#F2C14E', { bend: -0.25, r: 0.03 });
  // жетоны продуктов
  const tokMat = {}; Object.entries(KR_TOK).forEach(([k, [, c]]) => { tokMat[k] = new THREE.MeshBasicMaterial({ color: new THREE.Color(c), transparent: true }); });
  const toks = []; const tokPos = { nadh: V3(), fadh2: V3(), gtp: V3() }; // подписи следуют за последним жетоном
  function token(kind, p0, dir) { const m = kind === 'co2' ? molMesh(MOL('co2'), { scale: 0.2 }) : kind === 'h2o' ? molMesh(MOL('h2o'), { scale: 0.22 }) : new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), tokMat[kind]); m.position.copy(p0); scene.add(m); toks.push({ m, kind, v: dir, age: 0 }); return m; }
  const ETC = V3(7.4, -1.0, 0);
  const etcBar = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 2.9, 8, 20), new THREE.MeshPhysicalMaterial({ color: 0x8a5a40, emissive: 0xffb070, emissiveIntensity: 0.15, roughness: 0.5, transparent: true, opacity: 0.75 })); etcBar.position.copy(ETC); scene.add(etcBar);
  const piles = []; for (let k = 0; k < 6; k++) { const m = molMesh(MOL('succinate'), { scale: 0.11, hideH: true }); m.visible = false; scene.add(m); piles.push(m); }
  const malon = molMesh(MOL('malonate'), { scale: 0.16, hideH: true, tint: '#FF6A6A' }); malon.visible = false; scene.add(malon);
  const pick = NODES.map((n) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), new THREE.MeshBasicMaterial({ visible: false })); s.position.copy(n.m.position); s.userData.pick = n.d.id; scene.add(s); return s; }).concat([pdhPick]);
  const st = { t: 0, ph: 0, speed: 1, reg: 'norm', malonate: false, labels: true, rot: false, sel: null, msg: null, nadh: 0, fadh2: 0, gtp: 0, co2: 0, turns: 0, step: -1 };
  pickOn(() => self, camera, () => pick, (id) => { st.sel = id; refs.setInfo(); refs.stepSeg && refs.stepSeg.sync(); });
  function update(dt) {
    st.t += dt; const t = st.t; controls.autoRotate = st.rot; controls.autoRotateSpeed = 0.4;
    const sp = st.reg === 'atp' ? 0.35 : st.reg === 'ca' ? 1.8 : 1;
    const blocked = st.malonate;
    // фаза: 0..8 (шаги), шаг 4→5 (сукцинат → фумарат) блокируется малонатом
    const prev = Math.floor(st.ph);
    if (!(blocked && st.ph >= 4.55 && st.ph < 5)) st.ph += dt * 0.55 * sp;
    if (st.ph >= 8) { st.ph -= 8; st.turns++; }
    const cur = Math.floor(st.ph), u = st.ph - cur;
    if (cur !== prev) {
      const k = cur; const d = KR[k]; const p = NODES[k].m.position.clone();
      d.out.forEach((kind, j) => {
        const outw = p.clone().sub(C).normalize();
        const dir = kind === 'co2' ? outw.clone().add(V3(0, 0.8, 0.3)).normalize().multiplyScalar(1.4) : kind === 'h2o' ? outw.clone().multiplyScalar(-0.6) : ETC.clone().sub(p).normalize().multiplyScalar(2.2);
        token(kind, p.clone().addScaledVector(outw, 0.6 + j * 0.3), dir); if (kind in st) st[kind]++;
      });
      if (k === 0) { /* новый ацетил-КоА вошёл */ }
    }
    st.step = cur;
    NODES.forEach((n, k) => { const on = k === cur; n.m.rotation.y += dt * (on ? 1.2 : 0.3); const s = on ? 1.35 : 1; n.m.scale.lerp(V3(s, s, s), 1 - Math.exp(-dt * 6)); molGlow(n.m, on ? 0.18 : 0); });
    arcs.forEach((a, k) => { a.f.uniforms.uTime.value = t; a.f.uniforms.uOn.value = k === cur ? 1 : 0.25; a.f.uniforms.uSpeed.value = 0.5 * sp; });
    pdhA.mat.uniforms.uTime.value = t;
    // пируват → ПДГ → ацетил-КоА (перед шагом 0)
    const pu = (st.ph + 1.5) % 8 / 1.5;
    if (pu < 1) { pyr.visible = true; acetyl.visible = false; pyr.position.copy(V3(-7.8, -2.6, 0).lerp(V3(-5.3, -0.7, 0), smooth(0, 1, pu))); }
    else if (pu < 2) { pyr.visible = false; acetyl.visible = true; acetyl.position.copy(pdhA.curve.getPoint(smooth(0, 1, pu - 1))); if (pu < 1.05 && rnd() < 0.5) { token('co2', V3(-5.3, 0.6, 0), V3(-0.2, 1.2, 0.3)); token('nadh', V3(-4.6, -1.6, 0), ETC.clone().sub(V3(-4.6, -1.6, 0)).normalize().multiplyScalar(3.2)); } }
    else { pyr.visible = acetyl.visible = false; }
    [pyr, acetyl].forEach((m) => { m.rotation.y += dt; });
    PDH.rotation.y += dt * 0.15;
    // жетоны
    for (let i = toks.length - 1; i >= 0; i--) { const q = toks[i]; q.age += dt; q.m.position.addScaledVector(q.v, dt); if (tokPos[q.kind]) tokPos[q.kind].copy(q.m.position).add(V3(0.18, 0.2, 0)); if (q.kind === 'co2' || q.kind === 'h2o') q.m.rotation.y += dt * 2; if (q.kind !== 'co2' && q.kind !== 'h2o' && q.m.position.distanceTo(ETC) < 0.5) { for (let k = 0; k < 10; k++) fx.spawn(q.m.position.clone(), randUnit().multiplyScalar(0.5), new THREE.Color(KR_TOK[q.kind][1]), 0.6, 2, 1.3); q.age = 99; } if (q.age > 3.2) { scene.remove(q.m); toks.splice(i, 1); } }
    // малонат: копится сукцинат
    malon.visible = blocked; if (blocked) { malon.position.copy(pos(4, R - 1.0)); malon.rotation.y += dt; }
    piles.forEach((m, k) => { m.visible = blocked; if (blocked) { const a = ang(4) + (k - 2.5) * 0.12; m.position.set(C.x + Math.cos(a) * (R + 0.9 + (k % 2) * 0.4), C.y + Math.sin(a) * (R + 0.9 + (k % 2) * 0.4), 0.2); m.rotation.y += dt * 0.5; } });
    etcBar.material.emissiveIntensity = 0.1 + 0.08 * Math.sin(t * 3);
    fx.update(dt);
  }
  function drawScope(ctx, w, h) {
    ctx.clearRect(0, 0, w, h); ctx.font = '500 10px JetBrains Mono, monospace'; ctx.fillStyle = '#EFEAE6'; ctx.fillText('yield per turn (per acetyl-CoA)', 8, 12);
    const rows = [['3 NADH', 9, 7.5, '#FFD070'], ['1 FADH₂', 2, 1.5, '#FFE45A'], ['1 GTP', 1, 1, '#7FE0A0']];
    let x0 = 8, y = 22; const W = w - 16;
    rows.forEach(([n, a, b, c]) => { ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(x0, y, W * a / 12, 18); ctx.globalAlpha = 1; ctx.fillStyle = '#120F0B'; ctx.font = '600 9px JetBrains Mono, monospace'; if (W * a / 12 > 40) ctx.fillText(n, x0 + 4, y + 12); x0 += W * a / 12; });
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.fillText('textbook values (P/O = 3 and 2): 9 + 2 + 1 = 12 ATP', 8, y + 32);
    x0 = 8; y += 42; rows.forEach(([, a, b, c]) => { ctx.fillStyle = c; ctx.globalAlpha = 0.55; ctx.fillRect(x0, y, W * b / 12, 12); ctx.globalAlpha = 1; x0 += W * b / 12; });
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText('current estimates (2.5 and 1.5): ≈ 10 ATP', 8, y + 24);
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillText(`since start: ${st.turns} turns · ${st.co2} CO₂`, 8, h - 6);
  }
  const TXT = '<b>The tricarboxylic acid cycle</b> (Krebs cycle, citric acid cycle) in the mitochondrial matrix is the “furnace” where the remnants of every kind of fuel are burned. Acetyl-CoA (C2) combines with oxaloacetate (C4) to form citrate (C6); each turn releases <b>2 CO₂</b> and produces <b>3 NADH, 1 FADH₂ and 1 GTP</b>, while oxaloacetate is regenerated. The reduced coenzymes (gold beads) fly off to the respiratory chain (right). On the left is the <b>pyruvate dehydrogenase complex</b>, which converts pyruvate into acetyl-CoA. Click a molecule or the complex.';
  const PDHT = '<b>The pyruvate dehydrogenase complex</b> is a giant assembly (bigger than a ribosome) of three enzymes: E1 (decarboxylase, coenzyme <b>TPP</b> — vitamin B1), E2 (transacetylase, <b>lipoic acid</b> and <b>CoA</b> — B5), E3 (dehydrogenase, <b>FAD</b> — B2 and <b>NAD⁺</b> — B3, niacin). Pyruvate + NAD⁺ + HS-CoA → acetyl-CoA + CO₂ + NADH. The reaction is irreversible: acetyl-CoA can no longer be turned back into glucose. It is inhibited by ATP, acetyl-CoA and NADH; in B1 deficiency (alcoholism), pyruvate and lactate accumulate in the blood.';
  const labels = [
    ...NODES.map((n) => ({ text: `${n.d.name} · C${n.d.c}`, pos: n.m.position.clone().add(pos(n.k, R + 1.0).sub(n.m.position).multiplyScalar(0.9)).add(V3(-0.4, 0, 0)), color: '#EFEAE6', show: () => st.labels })),
    ...KR.map((d, k) => ({ text: KR[(k + 1) % 8].enz, pos: V3(C.x + Math.cos(ang(k) - 0.39) * (R - 1.15), C.y + Math.sin(ang(k) - 0.39) * (R - 1.15), 0.3).add(V3(-0.55, 0, 0)), color: '#7FD6FF', show: () => st.labels && st.step === k })),
    { text: 'pyruvate dehydrogenase', pos: V3(-6.6, -2.2, 0), color: '#F2C14E', show: () => st.labels },
    { text: 'pyruvate', pos: V3(-8.2, -3.2, 0), color: '#FF8A5C', show: () => st.labels },
    { text: 'to the respiratory chain', pos: ETC.clone().add(V3(-0.9, 1.95, 0)), color: '#FFB070', show: () => st.labels },
    ...['nadh', 'fadh2', 'gtp'].map((kind) => ({ text: KR_TOK[kind][0], pos: tokPos[kind], color: KR_TOK[kind][1], show: () => st.labels && toks.some((q) => q.kind === kind && q.age < 3) })),
    { text: 'malonate blocks', pos: pos(4, R - 1.0).add(V3(0.3, -0.4, 0)), color: '#FF6A6A', show: () => st.labels && st.malonate },
  ];
  const refs = {};
  function ui(el) {
    const ib = infoBox('1 1 440px');
    refs.setInfo = () => { const d = KR.find((x) => x.id === st.sel); ib.info.innerHTML = st.msg || (st.sel === 'pdh' ? PDHT : d ? d.text : TXT); };
    refs.stepSeg = seg(KR.map((d, k) => ({ id: d.id, label: String(k + 1) })).concat([{ id: 'pdh', label: 'PDH' }]), () => st.sel, (v) => { st.sel = st.sel === v ? null : v; refs.stepSeg.sync(); refs.setInfo(); });
    const regSeg = seg([{ id: 'norm', label: 'Normal' }, { id: 'atp', label: 'Plenty of ATP and NADH', color: '#FF6A6A' }, { id: 'ca', label: 'Exercise: Ca²⁺, ADP', color: '#7FE0A0' }], () => st.reg, (v) => { st.reg = v; st.msg = v === 'atp' ? '<b>Enough energy.</b> ATP and NADH inhibit citrate synthase, isocitrate dehydrogenase and α-ketoglutarate dehydrogenase — the cycle slows down. The main regulator is the NADH/NAD⁺ ratio.' : v === 'ca' ? '<b>Muscle at work.</b> Ca²⁺ (the contraction signal) and ADP (the energy-use signal) activate isocitrate dehydrogenase and α-ketoglutarate dehydrogenase — the cycle speeds up severalfold.' : null; refs.setInfo(); });
    const mal = toggle('Malonate', () => st.malonate, (v) => { st.malonate = v; st.msg = v ? '<b>Malonate</b> — HOOC–CH₂–COOH — resembles succinate but is one carbon shorter. It occupies the active site of succinate dehydrogenase without being converted (competitive inhibition). The cycle stops and <b>succinate accumulates</b> — a classic textbook problem.' : null; refs.setInfo(); });
    refs.rot = toggle('Rotate', () => st.rot, (v) => { st.rot = v; });
    const lab = toggle('Labels', () => st.labels, (v) => { st.labels = v; });
    Object.assign(refs, { lab, mal });
    el.append(group('Reaction', 'click', refs.stepSeg), group('Regulation', 'M', regSeg, mal), group('View', 'R · N', refs.rot, lab), ib.el);
    refs.setInfo();
  }
  function onKey(e) {
    const k = e.key.toLowerCase();
    if (k === 'm' || k === 'ь') { refs.mal.click(); return true; }
    if (k === 'r' || k === 'к') { refs.rot.click(); return true; } if (k === 'n' || k === 'т') { refs.lab.click(); return true; }
    return false;
  }
  function stats() { return [['Reaction', st.step >= 0 ? `${(st.step + 1) % 8 + 1} of 8` : '', ''], ['NADH', st.nadh, ''], ['FADH₂', st.fadh2, ''], ['GTP', st.gtp, '']]; }
  const self = {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#7FD6FF',
    kicker: 'Biochemistry · common catabolic pathway', title: 'Pyruvate dehydrogenase and the Krebs cycle',
    lede: 'Eight reactions in the mitochondrial matrix break down “active acetate” into two CO₂ and strip off its hydrogen for the respiratory chain.',
    notes: `
      <div><h2>Net result of the cycle</h2>
        <p>Acetyl-CoA + 3 NAD⁺ + FAD + GDP + Pi + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + HS-CoA.</p>
        <p>Eight hydrogen atoms (4 pairs) go to the respiratory chain and end up as water, and their energy ends up in ATP. The cycle itself does not use oxygen, but without oxygen it stops: NAD⁺ and FAD are not regenerated.</p>
        <h3>The cycle as a crossroads</h3>
        <p>The cycle is <b>amphibolic</b>: its intermediates are drawn off for synthesis (citrate → fatty acids and cholesterol, α-ketoglutarate → glutamate, succinyl-CoA → heme, oxaloacetate → aspartate and glucose). Losses are replenished by <b>anaplerotic</b> reactions, chiefly pyruvate carboxylase (with biotin): pyruvate + CO₂ → oxaloacetate.</p></div>
      <div><h2>Energy</h2><p>Using textbook values (P/O = 3 for NADH and 2 for FADH₂), oxidation of 1 acetyl-CoA yields 12 ATP, and of glucose 38 ATP. Modern measurements give ≈ 2.5 and 1.5 ATP — that is, about 10 ATP per turn and 30–32 per glucose.</p>
        <h2 style="margin-top:18px">Simplifications and models</h2><ul><li>Molecules are built from their formulas; for succinyl-CoA and acetyl-CoA a short fragment (S-methyl) is shown instead of coenzyme A.</li><li>The PDH complex and the mitochondrion are schematic.</li></ul></div>
      <div class="keys"><h2>Keys</h2><ul><li><code>M</code> malonate</li><li>click a molecule — reaction</li><li><code>R</code> rotate · <code>N</code> labels</li></ul></div>`,
  };
  return self;
}
export { makeKrebs };
