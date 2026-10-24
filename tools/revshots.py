#!/usr/bin/env python3
"""Снимки сцен для рецензии 3D-моделей: python3 tools/revshots.py [--out dir] id1 id2 ...
Для каждой сцены: все режимы (клавиши 1..N из подсказки «1–N»), плюс вид сбоку и крупный план в режиме 1.
Панель управления и текст скрыты, подписи оставлены. Кадры — lt/rev/<id>_*.jpg."""
import os, sys, time, re, urllib.request, subprocess
from playwright.sync_api import sync_playwright
import os as _os; PORT = _os.environ.get('LT_PORT', '8765')  # свой порт для параллельных копий репозитория
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
out = os.path.join(root, 'lt', 'rev')
if args and args[0] == '--out': out = args[1]; args = args[2:]
os.makedirs(out, exist_ok=True)
try: urllib.request.urlopen(f'http://127.0.0.1:{PORT}/index.html', timeout=3)
except Exception:
    subprocess.Popen(['python3', '-m', 'http.server', PORT], cwd=root + '/lt', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True); time.sleep(1.5)
HIDE = '.console,.notes,.foot,.hud,#scope{visibility:hidden!important}'
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for sid in args:
      try:
        errs = []
        pg = b.new_page(viewport={'width': 1400, 'height': 900})
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        pg.goto(f'http://127.0.0.1:{PORT}/index.html#' + sid, wait_until='domcontentloaded')
        try: pg.wait_for_function('window.__ready === %r' % sid, timeout=120000)
        except Exception: print(sid, 'NOTREADY', flush=True); pg.close(); continue
        time.sleep(1.0)
        kb = pg.evaluate("[...document.querySelectorAll('.glabel kbd')].map(k => k.textContent).join(' ')")
        m = re.search(r'1\s*[–-]\s*(\d)', kb)
        n = int(m.group(1)) if m else 1
        pg.add_style_tag(content=HIDE)
        bb = pg.locator('#stage').bounding_box(); clip = {'x': bb['x'], 'y': bb['y'], 'width': bb['width'], 'height': bb['height']}
        def shot(name):
            pg.evaluate('window.__adv && window.__adv(2)'); time.sleep(0.6)
            pg.screenshot(path=f'{out}/{sid}_{name}.jpg', type='jpeg', quality=82, clip=clip, timeout=240000)
        for k in range(1, min(n, 5) + 1):
            if n > 1: pg.keyboard.press(str(k)); time.sleep(0.4)
            shot(f'm{k}')
        if n > 1: pg.keyboard.press('1'); time.sleep(0.4)
        box = bb; cx, cy = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
        pg.mouse.move(cx, cy); pg.mouse.down(); pg.mouse.move(cx + 260, cy + 40, steps=12); pg.mouse.up()
        shot('side')
        pg.mouse.move(cx, cy)
        for _ in range(6): pg.mouse.wheel(0, -240); time.sleep(0.1)
        shot('close')
        print(sid, n, 'modes', 'ERR ' + ' | '.join(errs[:2]) if errs else 'OK', flush=True)
        pg.close()
      except Exception as e:
        print(sid, 'FAIL', str(e)[:200], flush=True)
        try: pg.close()
        except Exception: pass
    b.close()
