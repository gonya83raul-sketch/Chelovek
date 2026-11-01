"""Как textfit.py, но после каждого режима нажимает кнопки остальных групп пульта (кроме «Вид») и меряет «Что видно»:
python3 tools/textfit_parts.py id1 id2 … [--en]. Печатает только тексты длиннее окна. Сервер lt/ на 8765 должен быть запущен."""
import sys, time
from playwright.sync_api import sync_playwright
args = sys.argv[1:]; EN = '--en' in args
if EN: args.remove('--en')
JS = """async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const groups = () => [...document.querySelectorAll('.console .grp')].filter(g => g.offsetParent);
  const lab = g => (g.querySelector('.glabel')?.textContent || '').trim();
  const isMode = g => /^(Режим|Mode)/.test(lab(g));
  const measure = () => [...document.querySelectorAll('.console .info')].filter(e => e.offsetParent && e.textContent.trim() && e.scrollHeight > e.clientHeight + 2)
    .map(e => ({ sh: e.scrollHeight, ch: e.clientHeight, text: e.textContent.trim().slice(0, 70) }));
  const mg = groups().find(isMode); const nm = mg ? mg.querySelectorAll('button').length : 1;
  const out = []; const seen = new Set();
  for (let m = 0; m < nm; m++) {
    const mg2 = groups().find(isMode);
    if (mg2) { mg2.querySelectorAll('button')[m].click(); await sleep(500); }
    const mname = mg2 ? mg2.querySelectorAll('button')[m].textContent.trim() : '';
    // пульт может перерисовать группы после клика — группы и кнопки каждый раз ищем заново по подписи группы и номеру кнопки
    const labs = groups().filter(g => !isMode(g) && !/^(Вид|View)/.test(lab(g))).map(lab);
    for (const L of labs) {
      for (let i = 0; ; i++) {
        const g = groups().find(g => lab(g) === L); if (!g) break;
        const b = g.querySelectorAll('button')[i]; if (!b) break;
        if (!b.offsetParent) continue;
        const name = b.textContent.trim();
        b.click(); await sleep(250);
        for (const r of measure()) { if (seen.has(r.text)) continue; seen.add(r.text); out.push({ mode: mname, grp: L, btn: name, ...r }); }
      }
    }
  }
  return out; }"""
bad = 0
with sync_playwright() as p:
    br = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = br.new_page(viewport={'width': 1440, 'height': 900})
    pg.on('dialog', lambda d: d.dismiss())
    for sid in args:
        pg.goto(f'http://127.0.0.1:8765/index.en.html#{sid}' if EN else f'http://127.0.0.1:8765/index.html?lang=ru#{sid}')
        pg.wait_for_function('window.__ready === %r' % sid, timeout=120000); time.sleep(0.5)
        try: res = pg.evaluate(JS)
        except Exception as e: print(sid, 'ОШИБКА', str(e)[:120], flush=True); continue
        for r in res:
            bad += 1
            print(f"{sid:12} {r['mode'][:22]:22} {r['grp'][:12]:12} {r['btn'][:22]:22} {r['sh']}/{r['ch']} {r['text']}", flush=True)
    br.close()
print('длинных:', bad)
