p = 'src_page.html'; s = open(p, encoding='utf8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:80]); s = s.replace(a, b)
rep('<button class="cfg" id="cfg" type="button" aria-expanded="false" aria-controls="knobs">Яркость</button>',
    '<button class="pill inst" id="inst" type="button" hidden>Установить</button>\n    <button class="cfg" id="cfg" type="button" aria-expanded="false" aria-controls="knobs">Настройки</button>')
rep(".cfg,.subsel{display:none}", """.cfg,.subsel{display:none}
.pill{font:500 12px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:#120F0B;background:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:5px 12px;min-height:32px;cursor:pointer}
.pill[hidden]{display:none}
.pill.ghost{color:var(--mute);background:transparent;border-color:var(--line-2)}
.pill:disabled{opacity:.7;cursor:default}
.inst{margin-left:auto}""")
rep("  .cfg{display:inline-flex;", "  .inst{margin-left:auto}\n  .inst:not([hidden]) + .cfg{margin-left:0}\n  .cfg{display:inline-flex;")
rep("const asp = w / Math.max(1, hgt), A0 = 1.25;", "const asp = w / Math.max(1, hgt), A0 = 1.5;")
rep("""applyLook();
const start = (location.hash || '').slice(1);""", """applyLook();
/* приложение для телефона (PWA): работает только на собственном сайте, где подключён manifest */
{
  const inst = $('#inst'); let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; inst.hidden = false; });
  inst.addEventListener('click', () => { if (!deferred) return; deferred.prompt(); deferred.userChoice.finally(() => { deferred = null; inst.hidden = true; }); });
  window.addEventListener('appinstalled', () => { inst.hidden = true; });
  if ('serviceWorker' in navigator && document.querySelector('link[rel="manifest"]')) {
    navigator.serviceWorker.register('sw.js').then(() => {
      const btn = h('button', { class: 'pill ghost', type: 'button', title: 'Скачать все темы и 3D-модели, чтобы атлас работал без интернета' }, 'Сохранить для офлайна');
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) { /* не критично */ }
        const files = [...new Set(Object.values(BUILDERS).map(([f]) => f))], models = ['skeleton', 'muscles', 'vision', 'digest', 'repro'];
        const N = files.length + models.length; let n = 0, bad = 0;
        const step = () => { btn.textContent = 'Сохраняю… ' + Math.round((++n / N) * 100) + '%'; };
        for (const f of files) { try { await (chunkP[f] ||= import('./s/' + f + '.js')); } catch (e) { bad++; } step(); }
        for (const m of models) { try { const r = await fetch('models/' + m + '.' + MODEL_EXT); if (!r.ok) throw 0; await r.blob(); } catch (e) { bad++; } step(); }
        btn.textContent = bad ? 'Сохранено не всё — повторите' : 'Сохранено ✓'; btn.disabled = !bad;
      });
      $('#knobs').append(btn);
    }).catch(() => { /* без офлайна */ });
  }
}
const start = (location.hash || '').slice(1);""")
open(p, 'w', encoding='utf8').write(s); print('ok')
