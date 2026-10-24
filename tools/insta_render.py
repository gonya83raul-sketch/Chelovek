import sys, os
from playwright.sync_api import sync_playwright
src = os.path.abspath(sys.argv[1]); out = sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width':1080,'height':1350})
    pg.goto('file://'+src); pg.wait_for_timeout(800)
    for i in range(1, 8):
        pg.locator(f'#s{i}').screenshot(path=f'{out}/slide{i}.png')
    b.close()
