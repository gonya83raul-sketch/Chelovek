/* Кто мы? — офлайн-кэш (tools/build.py подставляет версию, хеш моделей и список оболочки).
   Оболочка версии — кэш chv-<версия>, меняется с каждой публикацией. 3D-модели и декодер Draco — отдельный долгоживущий кэш
   chv-models-<хеш моделей>: при обновлении сайта он остаётся, новое имя появляется, только когда меняются сами модели.
   Новая версия не включается сама: страница показывает «Доступно обновление» и по нажатию присылает 'skipWaiting'. */
const V = 'chv-app40', M = 'chv-models-2a94c6e898', META = 'chv-meta';
const SHELL = ["./", "./index.html", "./index.en.html", "./app40/core.js", "./app40/en/core.js", "./app40/offline.json", "./manifest.webmanifest", "./manifest.en.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./app40/vendor/three.module.min.js", "./app40/vendor/jsm/controls/OrbitControls.js", "./app40/vendor/jsm/environments/RoomEnvironment.js", "./app40/vendor/jsm/loaders/DRACOLoader.js", "./app40/vendor/jsm/loaders/GLTFLoader.js", "./app40/vendor/jsm/objects/MarchingCubes.js", "./app40/vendor/jsm/postprocessing/EffectComposer.js", "./app40/vendor/jsm/postprocessing/MaskPass.js", "./app40/vendor/jsm/postprocessing/OutputPass.js", "./app40/vendor/jsm/postprocessing/Pass.js", "./app40/vendor/jsm/postprocessing/RenderPass.js", "./app40/vendor/jsm/postprocessing/ShaderPass.js", "./app40/vendor/jsm/postprocessing/UnrealBloomPass.js", "./app40/vendor/jsm/shaders/CopyShader.js", "./app40/vendor/jsm/shaders/LuminosityHighPassShader.js", "./app40/vendor/jsm/shaders/OutputShader.js", "./app40/vendor/jsm/utils/BufferGeometryUtils.js"];
const SCOPE = self.registration.scope, FLAG = new URL('offline-flag', SCOPE).href;
const isModel = (u) => u.pathname.includes('/models/');
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.addAll(SHELL);
    // атлас был сохранён для офлайна — новая версия докачивает всё сама (список сборки), иначе после обновления офлайн пропал бы
    try {
      if (!(await (await caches.open(META)).match(FLAG))) return;
      const p = await (await fetch('./app40/offline.json')).json(), cm = await caches.open(M);
      let bad = 0;
      for (const [path] of p.files) {
        const u = new URL(path, SCOPE).href, cc = path.startsWith('models/') ? cm : c;
        if (await cc.match(u)) continue;
        try { const r = await fetch(u, { cache: 'no-cache' }); if (r.ok) await cc.put(u, r); else bad++; } catch (er) { bad++; }
      }
      if (!bad) await (await caches.open(META)).put(FLAG, new Response(V));
    } catch (er) { /* докачается при следующем «Сохранить для офлайна» */ }
  })());
});
self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V && k !== M && k !== META).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
const put = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(), u = new URL(typeof req === 'string' ? req : req.url, self.location.href); caches.open(isModel(u) ? M : V).then((c) => c.put(req, cp)); }
  return res;
};
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url), p = url.pathname;
  // страница: сначала сеть (чтобы приходили обновления), без сети — из кэша
  // у каждой темы своя страница (krebs.html): кэшируется под своим адресом; без сети и без копии — главная своего языка
  // (английская для *.en.html и ?lang=en; главная откроет тему по адресу и не перенаправляет — без петли перезагрузок)
  if (req.mode === 'navigate') {
    const root = /\/(index\.html)?$/.test(p) && !url.searchParams.has('lang'), key = root ? './index.html' : url.origin + p;
    const home = /\.en\.html$/.test(p) || url.searchParams.get('lang') === 'en' ? './index.en.html' : './index.html';
    const cached = () => caches.match(key).then((hit) => hit || caches.match(home)).then((hit) => hit || caches.match('./index.html'));
    // медленная сеть: через 4 с отдаём сохранённую копию (если есть), свежая всё равно ляжет в кэш
    const net = fetch(req).then((r) => put(key, r));
    e.respondWith(Promise.race([net, new Promise((res) => setTimeout(res, 4000)).then(() => caches.match(key).then((hit) => hit || net))]).catch(cached)); return;
  }
  const same = url.origin === self.location.origin;
  const immutable = (same && (p.includes('/app40/') || isModel(url) || p.includes('/icons/'))) || url.hostname === 'cdn.jsdelivr.net';
  if (immutable) { e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => put(req, r)))); return; }
  if (same || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req).then((hit) => { const net = fetch(req).then((r) => put(req, r)).catch(() => hit); return hit || net; }));
  }
});
