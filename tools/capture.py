"""Кадры сцен без интерфейса: from capture import Cap; c = Cap(w, h, dsf); c.scene(id, keys, adv); c.shot(path)"""
import time, math
from playwright.sync_api import sync_playwright
CLEAN = """
.top,.subtabs,.console,.notes,.foot,#scope,.hud,.loading{display:none!important}
.wrap{padding:0!important;max-width:none!important}
.stage{height:100vh!important;border-radius:0!important;border:0!important;margin:0!important}
html,body{background:#000!important;overflow:hidden}
"""
class Cap:
    def __init__(self, w, h, dsf=2, labels=True):
        self.p = sync_playwright().start()
        self.b = self.p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        self.pg = self.b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=dsf)
        self.labels = labels
    def scene(self, sid, keys=(), adv=2, js=None):
        pg = self.pg
        pg.goto('http://127.0.0.1:8765/index.html#' + sid, wait_until='domcontentloaded')
        pg.wait_for_function('window.__ready === %r' % sid, timeout=120000)
        pg.add_style_tag(content=CLEAN + ('' if self.labels else '.labels{display:none!important}'))
        time.sleep(1.0)
        pg.evaluate('window.dispatchEvent(new Event("resize"))')
        for k in keys:
            pg.keyboard.press(k); pg.evaluate('window.__adv(0.5)')
        if js: pg.evaluate(js)
        pg.evaluate('window.__adv(%f)' % adv)
        time.sleep(0.5)
    def cam(self, pos, target):
        self.pg.evaluate('([p,t]) => { const c = window.__cur(); c.camera.position.set(...p); c.controls.target.set(...t); c.controls.update(); }', [list(pos), list(target)])
    def js(self, s): return self.pg.evaluate(s)
    def adv(self, s): self.pg.evaluate('window.__adv(%f)' % s)
    def shot(self, path, q=None):
        if q: self.pg.screenshot(path=path, type='jpeg', quality=q, timeout=180000)
        else: self.pg.screenshot(path=path, timeout=180000)
    def close(self): self.b.close(); self.p.stop()
