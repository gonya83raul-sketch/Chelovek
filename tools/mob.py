import sys, time
from playwright.sync_api import sync_playwright
import os as _os; PORT = _os.environ.get('LT_PORT', '8765')  # свой порт для параллельных копий репозитория
ids = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    ctx = b.new_context(viewport={'width': 393, 'height': 851}, device_scale_factor=2, is_mobile=True, has_touch=True, user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36')
    errs = []
    for sid in ids:
        pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        name = sid.split(':')[0]
        pg.goto(f'http://127.0.0.1:{PORT}/index.html#' + name, wait_until='domcontentloaded')
        pg.wait_for_function('window.__ready === %r' % name, timeout=90000); time.sleep(2.5)
        if ':' in sid:
            for k in sid.split(':')[1]: pg.keyboard.press(k); time.sleep(0.5)
        pg.screenshot(path=f'lt/m_{name}.png', timeout=120000)
        pg.screenshot(path=f'lt/mf_{name}.png', full_page=True, timeout=240000)
        pg.close()
    print(errs)
    b.close()
