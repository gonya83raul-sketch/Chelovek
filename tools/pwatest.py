import time, subprocess
srv = subprocess.Popen(['python3', '-m', 'http.server', '8766'], cwd='lt', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    ctx = b.new_context(viewport={'width': 393, 'height': 851}, is_mobile=True, has_touch=True)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto('http://127.0.0.1:8766/index.html#skeleton', wait_until='domcontentloaded')
    pg.wait_for_function("window.__ready === 'skeleton'", timeout=90000)
    pg.wait_for_function("navigator.serviceWorker.controller || document.querySelector('#knobs .pill')", timeout=60000)
    pg.evaluate("document.querySelector('#cfg').click()"); time.sleep(0.5)
    btn = pg.locator('#knobs .pill'); print('button:', btn.inner_text())
    pg.screenshot(path='lt/pwa_top.png', clip={'x': 0, 'y': 0, 'width': 393, 'height': 260})
    pg.evaluate("document.querySelector('#knobs .pill').click()"); t0 = time.time()
    pg.wait_for_function("/Сохранено/.test(document.querySelector('#knobs .pill').textContent)", timeout=600000)
    print('saved:', pg.locator('#knobs .pill').inner_text(), round(time.time() - t0), 's')
    print('caches:', pg.evaluate("caches.keys().then(async ks => { let n = 0; for (const k of ks) n += (await (await caches.open(k)).keys()).length; return [ks, n]; })"))
    srv.kill(); time.sleep(1)
    t = time.time(); print('fetch core', pg.evaluate("fetch('app1/core.js').then(r => r.status + ' ' + r.headers.get('content-type')).catch(e => 'ERR ' + e)"), round(time.time()-t,1))
    t = time.time(); print('fetch idx', pg.evaluate("fetch('index.html').then(r => r.status).catch(e => 'ERR ' + e)"), round(time.time()-t,1))
    t = time.time(); print('reload'); 
    try:
        pg.reload(wait_until='commit', timeout=40000); print('reloaded', round(time.time()-t,1))
    except Exception as e: print('reload fail', str(e)[:100])
    pg2 = ctx.new_page(); pg2.on('pageerror', lambda e: errs.append('OFF ' + str(e)[:200]))
    pg2.goto('http://127.0.0.1:8766/index.html#liver', wait_until='domcontentloaded')
    pg2.wait_for_function("window.__ready === 'liver'", timeout=90000); time.sleep(2)
    pg2.evaluate("window.__show('digest')"); pg2.wait_for_function("window.__ready === 'digest'", timeout=90000); pg2.wait_for_function("!/Загружаю/.test(document.querySelector('.console').innerText)", timeout=180000)
    print('offline digest text:', pg2.evaluate("document.querySelector('.console').innerText.slice(-160)").replace('\n', ' '))
    pg2.screenshot(path='lt/pwa_offline.png', timeout=120000)
    print(errs)
    b.close()

