#!/usr/bin/env python3
"""Локальный тест сцены: python3 tools/lt.py <sceneId> wait:N shot:name key:k click:x,y "<js>" ...
Печатает ошибки страницы и консоли, результаты js (EVAL i ...). Последний снимок: lt/<sceneId>.png"""
import os, subprocess, sys, time, urllib.request
from playwright.sync_api import sync_playwright
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
try:
    urllib.request.urlopen('http://127.0.0.1:8765/index.html', timeout=3)
except Exception:
    subprocess.Popen(['python3', '-m', 'http.server', '8765'], cwd=root + '/lt', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    time.sleep(1.5)
sid, steps = sys.argv[1], sys.argv[2:]
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1440, 'height': 1000})
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)[:400]))
    pg.on('console', lambda m: errs.append('CONSOLE ' + m.type + ' ' + m.text[:300]) if m.type in ('error', 'warning') else None)
    pg.goto('http://127.0.0.1:8765/index.html#' + sid, wait_until='domcontentloaded')
    try: pg.wait_for_function('window.__ready === %r' % sid, timeout=90000)
    except Exception as e: errs.append('NOTREADY ' + str(e)[:100])
    time.sleep(1.5)
    n = 0
    for s in steps:
        if s.startswith('wait:'): time.sleep(float(s[5:]))
        elif s.startswith('shot:'): pg.screenshot(path=f'{root}/lt/{s[5:]}.png', timeout=180000)
        elif s.startswith('key:'): pg.keyboard.press(s[4:]); time.sleep(0.3)
        elif s.startswith('click:'):
            x, y = map(float, s[6:].split(',')); pg.mouse.click(x, y); time.sleep(0.3)
        else:
            n += 1
            try: print('EVAL', n, str(pg.evaluate(s))[:600])
            except Exception as e: print('EVAL', n, 'ERR', str(e)[:300])
    pg.screenshot(path=f'{root}/lt/{sid}.png', timeout=180000)
    b.close()
for e in errs:
    if 'fonts.g' in e or 'ERR_TUNNEL' in e or 'net::' in e or '404' in e: continue
    print(e)
