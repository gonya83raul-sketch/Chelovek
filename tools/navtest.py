import time
from playwright.sync_api import sync_playwright
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1300, 'height': 900})
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)[:300]))
    pg.on('console', lambda m: errs.append('CONSOLE ' + m.text[:200]) if m.type in ('error',) else None)
    net = []
    pg.on('response', lambda r: net.append((r.url.split('8765/')[-1], r.status)))
    pg.goto('http://127.0.0.1:8765/index.html#skeleton', wait_until='domcontentloaded')
    pg.wait_for_function("window.__ready === 'skeleton'", timeout=90000)
    t0 = time.time()
    pg.wait_for_function("!/Загруж/.test(document.querySelector('.console').innerText)", timeout=90000)
    print('skeleton model', round(time.time() - t0, 1), 's')
    pg.screenshot(path='lt/nav_skeleton.png')
    for sid in ['vision', 'digest', 'repro', 'hemoglobin', 'cell', 'liver', 'skeleton']:
        pg.evaluate(f"window.__show('{sid}')")
        pg.wait_for_function(f"window.__ready === '{sid}'", timeout=90000); time.sleep(1)
        for k in '12': pg.keyboard.press(k); pg.evaluate('window.__adv(0.5)')
        time.sleep(3)
        txt = pg.evaluate("document.querySelector('.console').innerText")
        bad = [w for w in ('Не удалось', 'Загружаю') if w in txt]
        print(sid, 'built', pg.evaluate('window.__built()'), 'mem', pg.evaluate('window.__mem()'), 'glass', pg.evaluate('window.__glass()'), bad)
        pg.screenshot(path=f'lt/nav_{sid}.png')
    print([n for n in net if not n[0].startswith('three/')])
    b.close()
print('\n'.join(e for e in errs if 'fonts' not in e and 'net::' not in e))
