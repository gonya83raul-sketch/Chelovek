# usage: sh.py [d|m|e] id[:keys][@name] ...   -> /home/user/wt-fbrain2/lt/z_<name>_<mode>.png
import sys, time
from playwright.sync_api import sync_playwright
PORT='8784'; OUT='/home/user/wt-fbrain2/lt/'
modes = sys.argv[1]; ids = sys.argv[2:]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    for md in modes:
        if md=='m':
            ctx = b.new_context(viewport={'width':390,'height':844}, device_scale_factor=1, is_mobile=True, has_touch=True)
        else:
            ctx = b.new_context(viewport={'width':1440,'height':900})
        for spec in ids:
            name = spec.split('@')[1] if '@' in spec else spec.split(':')[0]
            spec = spec.split('@')[0]
            sid = spec.split(':')[0]; keys = spec.split(':')[1] if ':' in spec else ''
            pg = ctx.new_page(); errs=[]
            pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
            url = f'http://127.0.0.1:{PORT}/index.html' + ('?lang=en' if md=='e' else '') + '#' + sid
            pg.goto(url, wait_until='domcontentloaded')
            try: pg.wait_for_function('window.__ready === %r' % sid, timeout=90000)
            except Exception as e: errs.append('NOTREADY')
            time.sleep(2)
            for k in keys: pg.keyboard.press(k); time.sleep(0.4)
            if keys: pg.evaluate('window.__adv && window.__adv(4)'); time.sleep(1.5)
            else: time.sleep(1)
            pg.screenshot(path=f'{OUT}z_{name}_{md}.png', timeout=180000)
            if errs: print(name, md, errs)
            pg.close()
        ctx.close()
    b.close()
print('ok')
