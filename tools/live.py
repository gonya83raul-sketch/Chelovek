# Проверка опубликованного сайта: python3 tools/live.py <папка_для_снимков> [страница ...]
# по умолчанию — три страницы: русская, английская и режим роликов (?rec); печатает версию appN и ошибки консоли
import sys, time
from playwright.sync_api import sync_playwright
B = 'https://gonya83raul-sketch.github.io/Chelovek/'
out = sys.argv[1] if len(sys.argv) > 1 else '.'
pages = sys.argv[2:] or ['cell.html', 'heart.en.html', 'brain.html?rec']
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for i, url in enumerate(pages):
        pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:200])); pg.on('console', lambda m: errs.append('C ' + m.text[:200]) if m.type == 'error' else None)
        pg.goto(B + url + ('&' if '?' in url else '?') + 'nocache=' + str(time.time()), wait_until='load'); time.sleep(12)
        app = pg.evaluate("[...document.scripts].map(s=>s.src+s.textContent).join(' ').match(/app\\d+/)?.[0]")
        pg.screenshot(path=f'{out}/live_{i}.png'); print(url, app, 'rec' if pg.query_selector('#recside') else '', errs); pg.close()
    b.close()
