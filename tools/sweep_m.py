#!/usr/bin/env python3
"""Прогон всех сцен: python3 tools/sweep.py id1 id2 ... — ошибки страницы и консоли по каждой сцене."""
import os, sys, time, urllib.request, subprocess
from playwright.sync_api import sync_playwright
import os as _os; PORT = _os.environ.get('LT_PORT', '8765')  # свой порт для параллельных копий репозитория
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
try: urllib.request.urlopen(f'http://127.0.0.1:{PORT}/index.html', timeout=3)
except Exception:
    subprocess.Popen(['python3', '-m', 'http.server', PORT], cwd=root + '/lt', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1.5)
ids = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for sid in ids:
        errs = []
        pg = b.new_page(viewport={'width': 393, 'height': 851}, is_mobile=True, has_touch=True)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)[:300]))
        pg.on('console', lambda m: errs.append('CONSOLE ' + m.text[:200]) if m.type in ('error', 'warning') else None)
        t0 = time.time()
        pg.goto(f'http://127.0.0.1:{PORT}/index.html#' + sid, wait_until='domcontentloaded')
        try: pg.wait_for_function('window.__ready === %r' % sid, timeout=90000)
        except Exception as e: errs.append('NOTREADY ' + str(e)[:100])
        time.sleep(0.5)
        try:
            pg.evaluate('window.__adv(1)')
            for k in '12345':
                pg.keyboard.press(k); pg.evaluate('window.__adv(1.5)')
            pg.keyboard.press('1'); pg.evaluate('window.__adv(0.5)')
            nbtn = pg.evaluate("document.querySelectorAll('.console button').length")
        except Exception as e:
            errs.append('EVAL ' + str(e)[:200]); nbtn = -1
        errs = [e for e in errs if not any(x in e for x in ('fonts.g', 'ERR_TUNNEL', 'net::', '404'))]
        print(sid, f'{time.time()-t0:.0f}s', 'OK' if not errs else '', *errs[:4], flush=True)
        pg.close()
    b.close()
