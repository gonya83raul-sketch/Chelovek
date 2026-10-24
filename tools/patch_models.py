import sys
p = 'src_page.html'; s = open(p, encoding='utf8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:80]); s = s.replace(a, b)
DEC = "const bin = atob(b64.trim()); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); const buf = u8.buffer;"
# мышцы
rep("fetch('muscles-v3.txt').then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).then((b64) => {\n      " + DEC,
    "fetchModel('muscles').then((buf) => {\n     ")
# скелет
rep("fetch('skeleton-v5.txt').then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).then((b64) => {\n    " + DEC,
    "fetchModel('skeleton').then((buf) => {\n   ")
# глаз
rep("""  // модель лежит рядом с страницей двумя текстовыми частями base64 (артефакты не раздают .glb)
  Promise.all(['vision-model-1.txt', 'vision-model-2.txt'].map((u) => fetch(u).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })))
    .then((txt) => { const bin = atob(txt.join('').replace(/\\s/g, '')); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); loader.parse(u8.buffer, '', onModel, onFail); })""",
"""  // модель лежит рядом со страницей в сжатом виде (models/)
  fetchModel('vision').then((buf) => { loader.parse(buf, '', onModel, onFail); })""")
# пищеварение
rep("""Promise.all(['dig-model-1.txt', 'dig-model-2.txt'].map((u) => fetch(u).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }))).then((parts) => {
      const bin = atob(parts.map((x) => x.trim()).join('')); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      new GLTFLoader().parse(u8.buffer,""", """fetchModel('digest').then((buf) => {
      new GLTFLoader().parse(buf,""")
# размножение
rep("""fetch('repro-model.txt').then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).then((b64) => {
      const bin = atob(b64.trim()); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      new GLTFLoader().parse(u8.buffer,""", """fetchModel('repro').then((buf) => {
      new GLTFLoader().parse(buf,""")
# загрузчик моделей
rep("/* ---------- helpers ---------- */\n", """/* ---------- helpers ---------- */
/* 3D-модели лежат в models/ сжатыми gzip; распаковка встроенным DecompressionStream */
const MODEL_EXT = 'bin';
function fetchModel(name) {
  return fetch('models/' + name + '.' + MODEL_EXT).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return MODEL_EXT === 'txt' ? r.text().then((t) => { const b = atob(t.trim()); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return new Blob([u]); }) : r.blob(); })
    .then((blob) => { if (typeof DecompressionStream === 'undefined') throw new Error('браузер слишком старый для распаковки модели'); return new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(); });
}
""")
open(p, 'w', encoding='utf8').write(s); print('ok')
