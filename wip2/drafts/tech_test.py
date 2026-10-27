"""Проверки оболочки: офлайн EN, без WebGL, ловушка «Назад», потеря контекста, reduced motion. PORT=8777."""
import sys, time, json
from playwright.sync_api import sync_playwright
PORT = 8777; B = f'http://127.0.0.1:{PORT}/'
ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
which = set(sys.argv[1:]) or {'offline', 'nogl', 'back', 'ctx', 'rm', 'save', 'phone', 'links'}
OUT = '/tmp/claude-0/-home-user-Chelovek/a50f7549-7fe2-55c8-a578-f6676da32d64/scratchpad/'

def errs_of(pg):
    E = []
    pg.on('pageerror', lambda e: E.append('PAGEERROR ' + str(e)[:300]))
    pg.on('console', lambda m: E.append('CONSOLE ' + m.type + ' ' + m.text[:200]) if m.type in ('error', 'warning') and 'fonts.g' not in m.text and 'ERR_TUNNEL' not in m.text and 'net::' not in m.text else None)
    return E

with sync_playwright() as p:
    b = p.chromium.launch(args=ARGS)
    if 'offline' in which:
        ctx = b.new_context(viewport={'width': 1200, 'height': 800})
        pg = ctx.new_page(); E = errs_of(pg)
        navs = []
        pg.on('framenavigated', lambda f: navs.append(f.url) if f == pg.main_frame else None)
        pg.goto(B + 'heart.en.html'); pg.wait_for_function('window.__ready === "heart"', timeout=90000)
        pg.evaluate('navigator.serviceWorker.ready'); time.sleep(2)
        pg.reload(); pg.wait_for_function('window.__ready === "heart"', timeout=90000)   # теперь страница под SW
        ctl = pg.evaluate('!!navigator.serviceWorker.controller'); print('SW controls:', ctl)
        print('caches:', pg.evaluate('caches.keys()'))
        ctx.set_offline(True)
        for u in ('heart.en.html', 'lungs.en.html', 'index.en.html', 'index.html?lang=en', 'krebs.html'):
            navs.clear(); E.clear()
            try:
                pg.goto(B + u, timeout=20000); time.sleep(4)
                print('OFFLINE', u, '→', pg.url, 'navs', len(navs), 'lang', pg.evaluate('document.documentElement.lang'), 'ready', pg.evaluate('window.__ready'), 'title', pg.evaluate('document.title')[:50], E[:2])
            except Exception as e: print('OFFLINE', u, 'ERR', str(e)[:200])
        # localStorage lang=en и переход на русскую тему офлайн — без петли
        pg.evaluate("localStorage.setItem('lang','en')"); navs.clear()
        pg.goto(B + 'index.html', timeout=20000); time.sleep(4); print('OFFLINE index.html with lang=en →', pg.url, 'navs', len(navs), 'lang', pg.evaluate('document.documentElement.lang'))
        ctx.set_offline(False); ctx.close()
    if 'nogl' in which:
        for lang, u in (('ru', 'index.html'), ('en', 'krebs.en.html')):
            ctx = b.new_context(viewport={'width': 1200, 'height': 800})
            ctx.add_init_script("HTMLCanvasElement.prototype.getContext = (function (o) { return function (t, ...a) { return /webgl/i.test(t) ? null : o.call(this, t, ...a); }; })(HTMLCanvasElement.prototype.getContext);")
            pg = ctx.new_page(); E = errs_of(pg)
            pg.goto(B + u); time.sleep(3)
            r = pg.evaluate("({ready: window.__ready, tabs: document.querySelectorAll('#sections .tab').length, subs: document.querySelectorAll('#subtabs .sub').length, fb: (document.querySelector('.fallback')||{}).innerText, title: document.querySelector('#title').textContent, notes: document.querySelector('#notes').innerText.length})")
            print('NOGL', u, json.dumps(r, ensure_ascii=False)[:400], E[:3])
            pg.screenshot(path=OUT + f'nogl_{lang}.png')
            pg.click('#lang'); time.sleep(2); print('  lang click →', pg.url)
            pg.go_back(); time.sleep(2)
            # клик по теме в оглавлении → страница темы
            pg.locator('#subtabs .sub').nth(1).click(); time.sleep(2); print('  topic click →', pg.url, pg.evaluate('document.querySelector("#title").textContent'))
            pg.click('#srch'); time.sleep(0.5); print('  search open:', pg.evaluate('document.querySelector("#finder").open'))
            ctx.close()
    if 'back' in which:
        ctx = b.new_context(viewport={'width': 1200, 'height': 800}); pg = ctx.new_page(); E = errs_of(pg)
        pg.goto(B + 'index.html'); pg.wait_for_function('window.__ready', timeout=90000)
        pg.click('#lang'); pg.wait_for_url('**/index.en.html*'); pg.wait_for_function('window.__ready', timeout=90000); print('BACK: after EN', pg.url)
        pg.go_back(); time.sleep(3); print('BACK: after back', pg.url, pg.evaluate('document.documentElement.lang'))
        pg.go_forward(); time.sleep(3); print('BACK: forward', pg.url, pg.evaluate('document.documentElement.lang'))
        pg.click('#lang'); time.sleep(3); print('BACK: RU from EN', pg.url, pg.evaluate('document.documentElement.lang'))
        pg.go_back(); time.sleep(3); print('BACK: back to EN', pg.url, pg.evaluate('document.documentElement.lang'), E[:3])
        ctx.close()
    if 'ctx' in which:
        pg = b.new_page(viewport={'width': 1200, 'height': 800}); E = errs_of(pg)
        pg.goto(B + 'index.html#heart'); pg.wait_for_function('window.__ready === "heart"', timeout=90000); time.sleep(1)
        pg.evaluate("window.__ext = window.__renderer().getContext().getExtension('WEBGL_lose_context'); window.__ext.loseContext()"); time.sleep(1)
        print('CTX lost overlay:', pg.evaluate("[...document.querySelectorAll('.fallback')].some(e => !e.hidden)"))
        pg.evaluate("window.__ext.restoreContext()"); time.sleep(2)
        print('CTX restored overlay:', pg.evaluate("[...document.querySelectorAll('.fallback')].some(e => !e.hidden)"), E[:4])
        pg.screenshot(path=OUT + 'ctx.png'); pg.close()
    if 'rm' in which:
        ctx = b.new_context(viewport={'width': 1200, 'height': 800}, reduced_motion='reduce'); pg = ctx.new_page(); E = errs_of(pg)
        pg.goto(B + 'index.html#heart'); pg.wait_for_function('window.__ready === "heart"', timeout=90000); time.sleep(1)
        print('RM paused', pg.evaluate("document.querySelector('#anim').getAttribute('aria-pressed')"), 'autoRotate', pg.evaluate('window.__cur().controls.autoRotate'))
        p0 = pg.evaluate('window.__cur().camera.position.toArray()'); time.sleep(1.5); p1 = pg.evaluate('window.__cur().camera.position.toArray()'); print('RM camera still:', p0 == p1)
        pg.click('#anim'); time.sleep(0.3); print('RM after click paused', pg.evaluate("document.querySelector('#anim').getAttribute('aria-pressed')"), E[:3])
        ctx.close()
    if 'save' in which:
        ctx = b.new_context(viewport={'width': 1200, 'height': 800}); pg = ctx.new_page(); E = errs_of(pg)
        pg.goto(B + 'index.html'); pg.wait_for_function('window.__ready', timeout=90000); pg.evaluate('navigator.serviceWorker.ready'); time.sleep(2)
        btn = pg.locator('#knobs button'); print('SAVE label:', btn.text_content())
        t0 = time.time(); btn.click()
        for k in range(240):
            t = btn.text_content();
            if not t.startswith('Сохраняю'): break
            time.sleep(0.5)
        print('SAVE result:', btn.text_content(), f'{time.time()-t0:.0f}s')
        print('caches:', pg.evaluate('Promise.all([caches.keys(), ...[]]).then(async ([ks]) => Promise.all(ks.map(async k => [k, (await (await caches.open(k)).keys()).length])))'))
        pg.reload(); pg.wait_for_function('window.__ready', timeout=90000); time.sleep(1)
        ctx.set_offline(True)
        for u in ('lungs.en.html', 'krebs.html', 'vision.en.html'):
            i = u.split('.')[0]
            pg.goto(B + u, timeout=20000)
            try: pg.wait_for_function(f'window.__ready === "{i}"', timeout=60000); ok = 'OK'
            except Exception: ok = 'NOTREADY ' + pg.evaluate("(document.querySelector('.loading:not([hidden])')||{}).textContent")
            print('SAVE offline', u, ok, E[-2:])
        ctx.set_offline(False); ctx.close()
    if 'phone' in which:
        for lang, u in (('ru', 'index.html#heart'), ('en', 'heart.en.html')):
            pg = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2); E = errs_of(pg)
            pg.goto(B + u); pg.wait_for_function('window.__ready === "heart"', timeout=90000); time.sleep(1.5)
            pg.screenshot(path=OUT + f'phone_{lang}.png'); print('PHONE', lang, pg.evaluate("getComputedStyle(document.querySelector('.lbl')).fontSize"), E[:3]); pg.close()
    if 'links' in which:
        pg = b.new_page(viewport={'width': 1440, 'height': 900}); E = errs_of(pg)
        pg.goto(B + 'heart.html'); pg.wait_for_function('window.__ready === "heart"', timeout=90000)
        print('LINKS cur', pg.evaluate("[...document.querySelectorAll('#subtabs [aria-current]')].map(a => a.getAttribute('href') + ':' + a.getAttribute('aria-current'))"), pg.evaluate("[...document.querySelectorAll('#sections a')].map(a => a.getAttribute('href') + (a.getAttribute('aria-current') ? '*' : ''))"))
        n0 = pg.evaluate('performance.getEntriesByType("navigation").length')
        pg.locator('#subtabs .sub[data-id="lungs"]').click(); pg.wait_for_function('window.__ready === "lungs"', timeout=90000)
        print('LINKS after click', pg.url, 'same doc:', pg.evaluate('!!window.__cur'), pg.evaluate("document.querySelector('#subtabs [aria-current]').dataset.id"))
        pg.go_back(); pg.wait_for_function('window.__ready === "heart"', timeout=90000); print('LINKS back', pg.url)
        pg.locator('#sections a[data-sec="brain"]').click(); time.sleep(3); print('LINKS section', pg.url, pg.evaluate('window.__ready'), E[:3])
        pg.screenshot(path=OUT + 'desk.png'); pg.close()
    b.close()
