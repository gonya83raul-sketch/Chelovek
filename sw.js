/* Человек вживую — офлайн-кэш. Версия меняется при каждой сборке. */
const V = 'chv-app11';
const SHELL = ['./', './index.html', './app11/core.js', './app11/en/core.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
const put = (req, res) => { if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(V).then((c) => c.put(req, cp)); } return res; };
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // страница: сначала сеть (чтобы приходили обновления), без сети — из кэша
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then((r) => put('./index.html', r)).catch(() => caches.match('./index.html'))); return; }
  const same = url.origin === self.location.origin;
  const immutable = (same && (url.pathname.includes('/app11/') || url.pathname.includes('/models/') || url.pathname.includes('/icons/'))) || url.hostname === 'cdn.jsdelivr.net';
  if (immutable) { e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => put(req, r)))); return; }
  if (same || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req).then((hit) => { const net = fetch(req).then((r) => put(req, r)).catch(() => hit); return hit || net; }));
  }
});
