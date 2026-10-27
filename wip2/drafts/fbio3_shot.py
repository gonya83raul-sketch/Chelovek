#!/usr/bin/env python3
"""shot.py <id> <d|m|e|em> <modes e.g. 123> [js...] -> lt/s_<id>_<tag><mode>.png  (port 8787)"""
import os, sys, time
from playwright.sync_api import sync_playwright
PORT='8787'; ROOT='/home/user/wt-fbio3'
sid, tag, modes = sys.argv[1:4]; js = sys.argv[4:]
mob = tag in ('m','em'); lang = 'en' if tag.startswith('e') else 'ru'
vw,vh = (390,844) if mob else (1440,900)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    ctx = b.new_context(viewport={'width':vw,'height':vh}, is_mobile=mob, has_touch=mob, device_scale_factor=1)
    pg = ctx.new_page(); errs=[]
    pg.on('pageerror', lambda e: errs.append('PAGE '+str(e)[:300]))
    pg.on('console', lambda m: errs.append('CON '+m.text[:200]) if m.type in ('error',) and 'TUNNEL' not in m.text and 'fonts.g' not in m.text and '404' not in m.text else None)
    pg.goto(f'http://127.0.0.1:{PORT}/index.html?lang={lang}#{sid}', wait_until='domcontentloaded')
    pg.wait_for_function('window.__ready === %r' % sid, timeout=150000); time.sleep(1.5)
    pg.evaluate("window.__P=(x,y,z)=>{const c=__cur().camera;c.updateMatrixWorld();const v=new c.position.constructor(x,y,z).project(c);const r=document.querySelector('#stage').getBoundingClientRect();return [Math.round(r.left+(v.x+1)/2*r.width),Math.round(r.top+(1-v.y)/2*r.height)]}")
    for m in modes:
        if m != '0': pg.keyboard.press(m); time.sleep(1.2)
        for j in js:
            r = pg.evaluate(j)
            if r is not None: print(m, j[:40], r)
        pg.evaluate('window.__adv && window.__adv(3)'); time.sleep(0.3 if os.environ.get('NOSHOT') else 0.8)
        if not os.environ.get('NOSHOT'): pg.screenshot(path=f'{ROOT}/lt/s_{sid}_{tag}{m}.png', timeout=240000)
    print(errs)
    b.close()
