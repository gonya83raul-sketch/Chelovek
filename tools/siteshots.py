#!/usr/bin/env python3
"""Снимки всего сайта для рецензии: python3 tools/siteshots.py [--en] id1 id2 … → lt/site/<id>_d.jpg (1440×900), <id>_m.jpg (390×844), строка «id время ошибки» в stdout."""
import os, sys, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('LT_PORT', '8765')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]; lang = 'ru'
if args and args[0] == '--en': lang = 'en'; args = args[1:]
OUT = os.path.join(ROOT, 'lt', 'site'); os.makedirs(OUT, exist_ok=True)
suf = '' if lang == 'ru' else '_en'
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for sid in args:
        for tag, vw, vh, mob in (('d', 1440, 900, False), ('m', 390, 844, True)):
            ctx = b.new_context(viewport={'width': vw, 'height': vh}, is_mobile=mob, has_touch=mob, device_scale_factor=1)
            pg = ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)[:200]))
            pg.on('console', lambda m: errs.append('CON ' + m.text[:160]) if m.type in ('error', 'warning') and 'TUNNEL' not in m.text and 'fonts.g' not in m.text else None)
            t0 = time.time()
            try:
                pg.goto(f'http://127.0.0.1:{PORT}/index.html?lang={lang}#{sid}', wait_until='domcontentloaded')
                pg.wait_for_function('window.__ready === %r' % sid, timeout=150000); t = time.time() - t0
                time.sleep(1.5 if sid != 'skeleton' else 6); pg.evaluate('window.__adv && window.__adv(2)'); time.sleep(0.5)
                pg.screenshot(path=f'{OUT}/{sid}{suf}_{tag}.jpg', type='jpeg', quality=78, timeout=240000)
                print(sid, lang, tag, f'{t:.1f}s', 'OK' if not errs else ' | '.join(errs[:3]), flush=True)
            except Exception as e:
                print(sid, lang, tag, 'FAIL', str(e)[:150], ' | '.join(errs[:2]), flush=True)
            ctx.close()
    b.close()
