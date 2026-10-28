"""Картинки превью 1200×630 для соцсетей: python3 tools/ogshots.py [id ...] [--all]
Кадр сцены (без интерфейса и подписей) + название темы → ogcache/<id>.jpg и <id>.en.jpg, главные — home(.en).jpg.
Перерисовывает только темы, у которых изменился хеш (файл сцены + тексты + версия шаблона) — ogcache/manifest.json.
Нужны: собранный out/site (python3 tools/build.py) и сервер lt/ на 8765."""
import sys, os, re, json, time, hashlib, html as H, io
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from PIL import Image
TPL = 'og1'   # версия шаблона: поменять — перерисуются все
SITE = os.path.join(ROOT, 'out', 'site'); CACHE = os.path.join(ROOT, 'ogcache'); os.makedirs(CACHE, exist_ok=True)
APP = next(d for d in os.listdir(SITE) if re.fullmatch(r'app\d+', d))
MF = os.path.join(CACHE, 'manifest.json'); MAN = json.load(open(MF)) if os.path.exists(MF) else {}
ids = open(os.path.join(ROOT, 'tools', 'ids.txt')).read().split()
args = [a for a in sys.argv[1:] if not a.startswith('--')]; force = '--all' in sys.argv
todo = args or ids + ['home']
def texts(i, lang):
    f = 'index' + ('.en' if lang == 'en' else '') + '.html' if i == 'home' else i + ('.en' if lang == 'en' else '') + '.html'
    d = open(os.path.join(SITE, f), encoding='utf8').read()
    if i == 'home':
        return ('3D-атлас человека', 'Кто мы? От молекулы до мысли') if lang == 'ru' else ('3D human atlas', 'Who are we? From molecule to mind')
    k = H.unescape(re.search(r'<div class="kicker" id="kicker">(.*?)</div>', d).group(1)); t = H.unescape(re.search(r'<h1 id="title">(.*?)</h1>', d).group(1))
    return k, t
def key(i):
    sid = 'skeleton' if i == 'home' else i
    h = hashlib.sha1(TPL.encode())
    sf = os.path.join(SITE, APP, 's', sid + '.js')
    if os.path.exists(sf): h.update(re.sub(rb'app\d+', b'app', open(sf, 'rb').read()))
    for lang in ('ru', 'en'): h.update(repr(texts(i, lang)).encode())
    return h.hexdigest()[:12]
HIDE = '''header,.subtabs,.console,.notes,.foot,.hud,#scope,#labels,.alltopics,.upd,.toast,.langnote,.skip,nav{display:none!important}
html,body{margin:0;overflow:hidden;background:#08070A}.stage{position:fixed!important;left:220px!important;top:0!important;width:980px!important;height:630px!important;margin:0!important;border:0!important;border-radius:0!important;z-index:5}'''
CARD = '''<div id="ogc" style="position:fixed;inset:0;z-index:10;pointer-events:none;font-family:'Golos Text',system-ui,sans-serif">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,7,10,.92) 0%,rgba(8,7,10,.75) 38%,rgba(8,7,10,0) 62%)"></div>
<div style="position:absolute;left:64px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center">
<div id="ogk" style="color:#FFB070;font-size:20px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:18px"></div>
<div id="ogt" style="overflow-wrap:normal;color:#F3EEE8;font-family:Literata,Georgia,serif;font-weight:600;line-height:1.08"></div></div>
<div id="ogb" style="position:absolute;left:64px;bottom:40px;color:#B9B2AE;font-size:22px"></div></div>'''
def fill(pg, k, t, lang):
    pg.evaluate('''([k, t, b]) => { if (!document.getElementById('ogc')) document.body.insertAdjacentHTML('beforeend', %s);
      document.getElementById('ogk').textContent = k; const e = document.getElementById('ogt'); e.textContent = t;
      document.getElementById('ogb').textContent = b; let s = 64; e.style.fontSize = s + 'px';
      while (s > 32 && (e.scrollHeight > 3 * s * 1.1 || e.scrollWidth > e.clientWidth)) { s -= 2; e.style.fontSize = s + 'px'; } }''' % json.dumps(CARD),
      [k, t, 'Кто мы? · 3D-атлас человека · gonya83raul-sketch.github.io/Chelovek' if lang == 'ru' else 'Who are we? · 3D human atlas · gonya83raul-sketch.github.io/Chelovek'])
def save(png, name):
    im = Image.open(io.BytesIO(png)).convert('RGB'); assert im.size == (1200, 630), im.size
    q = 85
    while True:
        b = io.BytesIO(); im.save(b, 'JPEG', quality=q, optimize=True, progressive=True)
        if b.tell() < 300_000 or q <= 60: break
        q -= 5
    open(os.path.join(CACHE, name), 'wb').write(b.getvalue()); return b.tell()
done = 0
with sync_playwright() as p:
    br = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for i in todo:
        kk = key(i)
        if not force and MAN.get(i) == kk and all(os.path.exists(os.path.join(CACHE, i + s + '.jpg')) for s in ('', '.en')): continue
        sid = 'skeleton' if i == 'home' else i; t0 = time.time()
        pg = br.new_page(viewport={'width': 1200, 'height': 630})
        try:
            pg.goto(f'http://127.0.0.1:8765/index.html?lang=ru#{sid}')
            pg.wait_for_function('window.__ready === %r' % sid, timeout=180000)
            pg.add_style_tag(content=HIDE); pg.evaluate('window.dispatchEvent(new Event("resize"))')
            pg.evaluate('window.__adv && window.__adv(2)'); time.sleep(4 if i in ('skeleton', 'home', 'digest', 'vision') else 1.5)
            pg.evaluate('document.fonts.ready')
            sz = []
            for lang in ('ru', 'en'):
                fill(pg, *texts(i, lang), lang); time.sleep(0.3)
                sz.append(save(pg.screenshot(timeout=180000), i + ('.en' if lang == 'en' else '') + '.jpg'))
            MAN[i] = kk; done += 1
            json.dump(MAN, open(MF, 'w'), indent=0, sort_keys=True)
            print(i, 'ok', '%.0f с' % (time.time() - t0), [s // 1024 for s in sz], 'КБ', flush=True)
        except Exception as e:
            print(i, 'ОШИБКА', str(e)[:200], flush=True)
        pg.close()
    br.close()
print('перерисовано:', done, 'из', len(todo))
