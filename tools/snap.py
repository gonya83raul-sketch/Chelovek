"""Снимки сцены: python3 tools/snap.py <id> [size:WxH] [lang:en] шаги... — key:2 · adv:3 (промотать 3 с) · sleep:2 · js:<код> · shot:имя → lt/имя.png. Сервер lt/ на 8765 должен быть запущен."""
import sys, time, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
sid = sys.argv[1]; lang = 'ru'; steps = sys.argv[2:]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    vw, vh = 1440, 900
    if steps and steps[0].startswith('size:'): vw, vh = map(int, steps.pop(0)[5:].split('x'))
    if steps and steps[0].startswith('lang:'): lang = steps.pop(0)[5:]
    pg = b.new_page(viewport={'width': vw, 'height': vh})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:300])); pg.on('console', lambda m: errs.append('C ' + m.text[:200]) if m.type == 'error' else None)
    pg.goto(f'http://127.0.0.1:8765/index.html?lang={lang}#{sid}')
    pg.wait_for_function('window.__ready === %r' % sid, timeout=120000); time.sleep(0.5)
    for s in steps:
        k, _, v = s.partition(':')
        if k == 'key': pg.keyboard.press(v)
        elif k == 'adv': pg.evaluate(f'window.__adv({v})')
        elif k == 'js': pg.evaluate(v)
        elif k == 'sleep': time.sleep(float(v))
        elif k == 'shot': pg.screenshot(path=os.path.join(ROOT, 'lt', v + '.png')); print('shot', v)
    print('ERR', [e for e in errs if 'TUNNEL' not in e])
    b.close()
