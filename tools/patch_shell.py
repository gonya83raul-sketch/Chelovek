p = 'src_page.html'; s = open(p, encoding='utf8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:80]); s = s.replace(a, b)
rep(".fallback{", ".loading{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:6;padding:12px 18px;border-radius:12px;background:rgba(12,11,15,.86);border:1px solid var(--line-2);color:var(--fg);font:500 13px/1.4 var(--f-mono);max-width:min(440px,calc(100% - 32px));text-align:center}\n.loading[hidden]{display:none}\n.fallback{")
old_show = """function show(id) {
  if (!built[id]) built[id] = BUILDERS[id]();
  if (cur) cur.controls.enabled = false;"""
new_show = """/* каждая вкладка — отдельный файл: грузится при первом открытии, старые сцены выгружаются */
const chunkP = {};
function loadBuilder(id) { const [file, fn] = BUILDERS[id]; return (chunkP[file] ||= import('./s/' + file + '.js')).then((m) => m[fn]); }
let building = null;
{ const ael = canvas.addEventListener.bind(canvas); canvas.addEventListener = (t, f, o) => { if (building) building.push([t, f, o]); ael(t, f, o); }; }
const loadEl = h('div', { class: 'loading', role: 'status', 'aria-live': 'polite' }); loadEl.hidden = true; stageEl.append(loadEl);
const KEEP = 2, recent = [];
let showSeq = 0;
function disposeScene(sc) {
  const mats = new Set(), geos = new Set(), texs = new Set();
  sc.scene.traverse((o) => { if (o.geometry) geos.add(o.geometry); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => mats.add(x)); });
  mats.forEach((m) => { Object.values(m).forEach((v) => { if (v && v.isTexture) texs.add(v); }); if (m.uniforms) Object.values(m.uniforms).forEach((u) => { if (u && u.value && u.value.isTexture) texs.add(u.value); }); });
  texs.delete(GLOW); texs.delete(envTex);
  geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); texs.forEach((t) => t.dispose());
  for (let i = GLASS.length - 1; i >= 0; i--) if (mats.has(GLASS[i])) GLASS.splice(i, 1);
  (sc.__listen || []).forEach(([t, f, o]) => canvas.removeEventListener(t, f, o));
  if (sc.controls.dispose) sc.controls.dispose();
}
function evict() {
  while (recent.length > KEEP) { const old = recent.shift(); const sc = built[old]; if (!sc || sc === cur) continue; delete built[old]; try { disposeScene(sc); } catch (e) { /* выгрузка не критична */ } }
}
function show(id) {
  const seq = ++showSeq;
  if (built[id]) { activate(id); return; }
  renderNav(id);
  const item = (secOf(id) || { scenes: [] }).scenes.find(([s]) => s === id);
  loadEl.textContent = 'Загружаю «' + (item ? item[1] : id) + '»…'; loadEl.hidden = false;
  loadBuilder(id).then((mk) => {
    if (seq !== showSeq) return;
    const L = []; building = L; let sc;
    try { sc = mk(); } finally { building = null; }
    sc.__listen = L; built[id] = sc; loadEl.hidden = true; activate(id);
  }).catch((e) => { if (seq !== showSeq) return; loadEl.textContent = 'Не удалось загрузить раздел: ' + (e && e.message || e) + '. Обновите страницу.'; console.error(e); });
}
function activate(id) {
  loadEl.hidden = true;
  const i = recent.indexOf(id); if (i >= 0) recent.splice(i, 1); recent.push(id);
  if (cur) cur.controls.enabled = false;"""
rep(old_show, new_show)
rep("""  try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
  layout();
}""", """  try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
  layout();
  evict();
  window.__ready = id;
}""")
open(p, 'w', encoding='utf8').write(s); print('ok')
