"""Влезает ли «Что видно» в окно (компьютер, 6 строк): python3 tools/textfit.py id1 id2 … [--size 1440x900] [--en]
По каждой сцене перебирает кнопки группы «Режим» и печатает высоту текста .info против окна. Сервер lt/ на 8765 должен быть запущен."""
import sys, time
from playwright.sync_api import sync_playwright
args = sys.argv[1:]; vw, vh = 1440, 900
if '--size' in args: i = args.index('--size'); vw, vh = map(int, args[i + 1].split('x')); del args[i:i + 2]
EN = '--en' in args
if EN: args.remove('--en')
JS_MODES = """() => { const g = [...document.querySelectorAll('.console .grp')].find(g => /^(Режим|Mode)/.test(g.querySelector('.glabel')?.textContent || ''));
  return g ? [...g.querySelectorAll('button')].map(b => b.textContent.trim()) : []; }"""
JS_CLICK = """i => { const g = [...document.querySelectorAll('.console .grp')].find(g => /^(Режим|Mode)/.test(g.querySelector('.glabel')?.textContent || ''));
  g.querySelectorAll('button')[i].click(); }"""
JS_MEASURE = """() => [...document.querySelectorAll('.console .info')].filter(e => e.offsetParent && e.textContent.trim())
  .map(e => ({ sh: e.scrollHeight, ch: e.clientHeight, text: e.textContent.trim().slice(0, 60) }))"""
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': vw, 'height': vh})
    for sid in args:
        pg.goto(f'http://127.0.0.1:8765/index.en.html#{sid}' if EN else f'http://127.0.0.1:8765/index.html?lang=ru#{sid}')
        pg.wait_for_function('window.__ready === %r' % sid, timeout=120000); time.sleep(0.5)
        modes = pg.evaluate(JS_MODES) or ['(один режим)']
        for i, name in enumerate(modes):
            if i or len(modes) > 1 and i == 0:
                pg.evaluate(JS_CLICK, i); time.sleep(0.6)
            for m in pg.evaluate(JS_MEASURE):
                over = m['sh'] > m['ch'] + 2
                bad += over
                print(f"{sid:12} {name[:28]:28} {m['sh']:4}/{m['ch']:<4} {'ДЛИННО' if over else 'ok':6} {m['text']}", flush=True)
    b.close()
print('длинных:', bad)
