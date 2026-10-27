// Сжатие геометрии GLB по KHR_draco_mesh_compression кодировщиком Draco из three.js (без внешних пакетов).
// node tools/glbdraco.mjs in.glb out.glb [posBits=14]
// Имена узлов, мешей и материалов не меняются (на них завязаны клики и подсветка в сценах).
// Квантованные нормали/UV (KHR_mesh_quantization) переводятся во float: Draco сам квантует их, а GLTFLoader
// раскладывает декодированные данные по типу аксессора.
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, 'lt/three/examples/jsm/libs/draco/gltf/');
globalThis.require = createRequire(import.meta.url); globalThis.__dirname = DIR;   // модули Emscripten в Node ждут CommonJS
const load = (f, name) => vm.runInThisContext(fs.readFileSync(DIR + f, 'utf8') + ';' + name);
const [src, dst, pb] = process.argv.slice(2);
const POS_BITS = +(pb || 14);

// модуль Emscripten сам «thenable» — отдаём его без then, иначе промис будет разворачивать его бесконечно
const init = (f, name) => new Promise((res) => { let m = null; m = load(f, name)({ onModuleLoaded: () => setTimeout(() => { delete m.then; res(m); }) }); });
const E = await init('draco_encoder.js', 'DracoEncoderModule');
const D = await init('draco_decoder.js', 'DracoDecoderModule');

const glb = fs.readFileSync(src);
const jl = glb.readUInt32LE(12);
const J = JSON.parse(glb.subarray(20, 20 + jl).toString('utf8'));
const bo = 20 + jl;
const BIN = glb.subarray(bo + 8, bo + 8 + glb.readUInt32LE(bo));
const CT = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
const NC = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
const NORM = { 5120: (v) => Math.max(v / 127, -1), 5121: (v) => v / 255, 5122: (v) => Math.max(v / 32767, -1), 5123: (v) => v / 65535 };

function readAcc(ai) {   // → { arr: Float32Array | исходный тип, n, count }
  const a = J.accessors[ai], bv = J.bufferViews[a.bufferView], T = CT[a.componentType], n = NC[a.type];
  const off = (bv.byteOffset || 0) + (a.byteOffset || 0), stride = bv.byteStride || T.BYTES_PER_ELEMENT * n;
  const dv = new DataView(BIN.buffer, BIN.byteOffset);
  const out = new T(a.count * n);
  const get = { 5120: 'getInt8', 5121: 'getUint8', 5122: 'getInt16', 5123: 'getUint16', 5125: 'getUint32', 5126: 'getFloat32' }[a.componentType];
  for (let i = 0; i < a.count; i++) for (let k = 0; k < n; k++) out[i * n + k] = dv[get](off + i * stride + k * T.BYTES_PER_ELEMENT, true);
  return { arr: out, n, count: a.count, a };
}
const toFloat = ({ arr, a }) => { if (a.componentType === 5126) return arr; const f = new Float32Array(arr.length); const nf = a.normalized ? NORM[a.componentType] : (v) => v; for (let i = 0; i < arr.length; i++) f[i] = nf(arr[i]); return f; };

// кто чем пользуется: аксессоры с bufferView, которые останутся (не сжатые примитивы, анимации, скины и т. п.)
const keepAcc = new Set();
const prims = [];
J.meshes.forEach((m) => m.primitives.forEach((p) => {
  const ok = (p.mode === undefined || p.mode === 4) && p.indices !== undefined && !p.targets && !(p.extensions && p.extensions.KHR_draco_mesh_compression) && Object.values(p.attributes).every((ai) => !J.accessors[ai].sparse);
  if (ok) prims.push(p); else { Object.values(p.attributes).forEach((ai) => keepAcc.add(ai)); if (p.indices !== undefined) keepAcc.add(p.indices); (p.targets || []).forEach((t) => Object.values(t).forEach((ai) => keepAcc.add(ai))); }
}));
(J.skins || []).forEach((s) => { if (s.inverseBindMatrices !== undefined) keepAcc.add(s.inverseBindMatrices); });
(J.animations || []).forEach((an) => an.samplers.forEach((s) => { keepAcc.add(s.input); keepAcc.add(s.output); }));

const newViews = [];   // [{data: Uint8Array, def}]
const viewUse = new Set();
const accUsedByDraco = new Set();
const TYPE = { POSITION: 'POSITION', NORMAL: 'NORMAL', TEXCOORD_0: 'TEX_COORD', TEXCOORD_1: 'TEX_COORD' };
const QB = { POSITION: POS_BITS, NORMAL: 10, TEX_COORD: 12, GENERIC: 12 };
let before = 0, after = 0;
const done = new Map();   // одинаковые примитивы (те же аксессоры) кодируем один раз
for (const p of prims) {
  const key = JSON.stringify([p.indices, p.attributes]);
  if (done.has(key)) { p.extensions = { ...(p.extensions || {}), KHR_draco_mesh_compression: done.get(key) }; continue; }
  const idx = readAcc(p.indices).arr, names = Object.keys(p.attributes);
  const nv = J.accessors[p.attributes.POSITION].count;
  const builder = new E.MeshBuilder(), mesh = new E.Mesh(), enc = new E.Encoder();
  builder.AddFacesToMesh(mesh, idx.length / 3, Uint32Array.from(idx));
  const ids = {};
  for (const nm of names) {
    const r = readAcc(p.attributes[nm]); before += r.arr.byteLength;
    const t = TYPE[nm] || 'GENERIC';
    ids[nm] = builder.AddFloatAttributeToMesh(mesh, E[t], nv, r.n, toFloat(r));
  }
  before += idx.byteLength;
  enc.SetSpeedOptions(3, 3);
  enc.SetEncodingMethod(E.MESH_EDGEBREAKER_ENCODING);
  for (const t of ['POSITION', 'NORMAL', 'TEX_COORD', 'GENERIC']) enc.SetAttributeQuantization(E[t], QB[t]);
  const out = new E.DracoInt8Array();
  const len = enc.EncodeMeshToDracoBuffer(mesh, out);
  if (!len) throw new Error('Draco: не удалось сжать примитив');
  const data = new Uint8Array(len); for (let i = 0; i < len; i++) data[i] = out.GetValue(i);
  E.destroy(out); E.destroy(enc); E.destroy(mesh); E.destroy(builder);
  after += len;
  // проверка декодированием: число точек и границы POSITION (после квантования)
  const buf = new D.DecoderBuffer(); buf.Init(new Int8Array(data.buffer), len);
  const dec = new D.Decoder(), dm = new D.Mesh(), st = dec.DecodeBufferToMesh(buf, dm);
  if (!st.ok()) throw new Error('Draco: проверка не прошла ' + st.error_msg());
  const np = dm.num_points(), nf = dm.num_faces();
  const pa = dec.GetAttributeByUniqueId(dm, ids.POSITION), fa = new D.DracoFloat32Array();
  dec.GetAttributeFloatForAllPoints(dm, pa, fa);
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < np; i++) for (let k = 0; k < 3; k++) { const v = fa.GetValue(i * 3 + k); if (v < mn[k]) mn[k] = v; if (v > mx[k]) mx[k] = v; }
  D.destroy(fa); D.destroy(dm); D.destroy(dec); D.destroy(buf);
  // аксессоры: без bufferView, с числом точек после декодирования; квантованные → float
  for (const nm of names) {
    const ai = p.attributes[nm], a = J.accessors[ai]; accUsedByDraco.add(ai);
    a.count = np; a.componentType = 5126; delete a.normalized; delete a.byteOffset;
    if (nm === 'POSITION') { a.min = mn; a.max = mx; } else { delete a.min; delete a.max; }
  }
  const ia = J.accessors[p.indices]; accUsedByDraco.add(p.indices);
  ia.count = nf * 3; ia.componentType = np > 65535 ? 5125 : 5123; delete ia.byteOffset; delete ia.min; delete ia.max;
  const ext = { bufferView: -1 - newViews.length, attributes: ids };
  newViews.push({ data, def: { buffer: 0, byteLength: len } });
  p.extensions = { ...(p.extensions || {}), KHR_draco_mesh_compression: ext };
  done.set(key, ext);
}
// аксессоры, сжатые Draco и больше нигде не нужные, теряют bufferView
for (const ai of accUsedByDraco) if (!keepAcc.has(ai)) delete J.accessors[ai].bufferView;
J.accessors.forEach((a) => { if (a.bufferView !== undefined) viewUse.add(a.bufferView); if (a.sparse) { viewUse.add(a.sparse.indices.bufferView); viewUse.add(a.sparse.values.bufferView); } });
(J.images || []).forEach((im) => { if (im.bufferView !== undefined) viewUse.add(im.bufferView); });
// новый BIN: живые старые bufferView + данные Draco
const parts = [], remap = new Map(), views = [];
let off = 0;
const push = (bytes, def) => { const pad = (4 - (off % 4)) % 4; if (pad) { parts.push(new Uint8Array(pad)); off += pad; } views.push({ ...def, byteOffset: off, byteLength: bytes.length }); parts.push(bytes); off += bytes.length; return views.length - 1; };
J.bufferViews.forEach((bv, i) => { if (!viewUse.has(i)) return; const b = BIN.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength); const d = { ...bv }; delete d.byteOffset; remap.set(i, push(Uint8Array.from(b), d)); });
const dracoIdx = newViews.map((v) => push(v.data, v.def));
J.bufferViews = views;
J.accessors.forEach((a) => { if (a.bufferView !== undefined) a.bufferView = remap.get(a.bufferView); if (a.sparse) { a.sparse.indices.bufferView = remap.get(a.sparse.indices.bufferView); a.sparse.values.bufferView = remap.get(a.sparse.values.bufferView); } });
(J.images || []).forEach((im) => { if (im.bufferView !== undefined) im.bufferView = remap.get(im.bufferView); });
J.meshes.forEach((m) => m.primitives.forEach((p) => { const e = p.extensions && p.extensions.KHR_draco_mesh_compression; if (e && e.bufferView < 0) e.bufferView = dracoIdx[-1 - e.bufferView]; }));
J.buffers = [{ byteLength: off }];
for (const k of ['extensionsUsed', 'extensionsRequired']) { J[k] = J[k] || []; if (!J[k].includes('KHR_draco_mesh_compression')) J[k].push('KHR_draco_mesh_compression'); }
// сборка GLB
const js = Buffer.from(JSON.stringify(J), 'utf8'), jpad = Buffer.alloc((4 - (js.length % 4)) % 4, 0x20);
const binb = Buffer.concat(parts.map((x) => Buffer.from(x.buffer, x.byteOffset, x.byteLength))), bpad = Buffer.alloc((4 - (binb.length % 4)) % 4);
const total = 12 + 8 + js.length + jpad.length + 8 + binb.length + bpad.length;
const h = Buffer.alloc(12); h.write('glTF', 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(total, 8);
const c1 = Buffer.alloc(8); c1.writeUInt32LE(js.length + jpad.length, 0); c1.write('JSON', 4);
const c2 = Buffer.alloc(8); c2.writeUInt32LE(binb.length + bpad.length, 0); c2.write('BIN\0', 4);
fs.writeFileSync(dst, Buffer.concat([h, c1, js, jpad, c2, binb, bpad]));
console.log(path.basename(src), 'примитивов', prims.length, 'геометрия', (before / 1048576).toFixed(2), '→', (after / 1048576).toFixed(2), 'МБ; файл', (glb.length / 1048576).toFixed(2), '→', (total / 1048576).toFixed(2), 'МБ');
