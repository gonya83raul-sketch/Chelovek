#!/usr/bin/env python3
"""Сборка «Человек вживую»: базовая страница + сцены биохимии из bio/*.js.
Каждый файл сцены начинается со строки
  // @scene <id> <makeFn> | <Название> | <Подзаголовок группы или ->
Выход: out/page.html (тело для артефакта), out/index.html (офлайн), lt/index.html (локальный тест).
"""
import glob, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, 'src_page.html'), encoding='utf8').read()
MARK = '/* ---------- app shell ---------- */'
files = sorted(glob.glob(os.path.join(ROOT, 'bio', '*.js')))
code, scenes = [], []
for f in files:
    t = open(f, encoding='utf8').read()
    for m in re.finditer(r'^// @scene (\w+) (\w+) \| ([^|]+?) \| (.+)$', t, re.M):
        scenes.append((m.group(1), m.group(2), m.group(3).strip(), m.group(4).strip()))
    code.append(t.rstrip() + '\n')
page = src.replace(MARK, '\n'.join(code) + '\n' + MARK, 1)
# BUILDERS
b0 = 'shealth: makeShealth };'
assert page.count(b0) == 1
page = page.replace(b0, 'shealth: makeShealth' + ''.join(f', {i}: {fn}' for i, fn, _, _ in scenes) + ' };')
# SECTIONS: вкладка «Биохимия» после «Клетка»
c0 = "  { id: 'cell', name: 'Клетка', scenes: [['cell', 'Живая клетка']] },\n"
assert page.count(c0) == 1
items, last = [], None
for i, fn, name, grp in scenes:
    if grp != '-' and grp != last:
        items.append(f"['#', '{grp}']"); last = grp
    items.append(f"['{i}', '{name}']")
if scenes:
    page = page.replace(c0, c0 + "  { id: 'bio', name: 'Биохимия', scenes: [" + ', '.join(items) + '] },\n')
import json, shutil
APP = 'app4'   # меняется при каждой публикации со старой структурой кэша
OUT = os.path.join(ROOT, 'out'); os.makedirs(OUT, exist_ok=True)
i0 = page.index('<script type="module">') ; i1 = page.index('</script>', i0)
mod = page[i0 + len('<script type="module">'):i1]
open(os.path.join(OUT, '_merged.mjs'), 'w', encoding='utf8').write(mod)
open(os.path.join(OUT, '_bio.json'), 'w').write(json.dumps([sc[0] for sc in scenes]))
r = subprocess.run(['node', '--check', os.path.join(OUT, '_merged.mjs')], capture_output=True, text=True)
if r.returncode: print(r.stderr[:3000]); sys.exit(1)
shutil.rmtree(os.path.join(OUT, APP), ignore_errors=True)
r = subprocess.run(['node', os.path.join(ROOT, 'tools', 'split.mjs'), os.path.join(OUT, '_merged.mjs'), os.path.join(OUT, APP), os.path.join(OUT, '_bio.json')], capture_output=True, text=True)
print(r.stdout[-4000:]);
if r.returncode: print(r.stderr[:3000]); sys.exit(1)
for f in glob.glob(os.path.join(OUT, APP, '**', '*.js'), recursive=True):
    r = subprocess.run(['node', '--check', f], capture_output=True, text=True)
    if r.returncode: print(f, r.stderr[:2000]); sys.exit(1)
page = page[:i0] + f'<script type="module" src="{APP}/core.js"></script>' + page[i1 + len('</script>'):]
open(os.path.join(OUT, 'page.html'), 'w', encoding='utf8').write(page)
head = '<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head>\n<body>\n'
full = head + page + '</body>\n</html>\n'
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8').write(full)
# сайт-приложение (PWA) для своего хостинга: manifest, иконки, офлайн-кэш
PWA_HEAD = '<meta name="theme-color" content="#08070A">\n<meta name="mobile-web-app-capable" content="yes">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">\n<link rel="apple-touch-icon" href="icons/apple-180.png">\n'
site_html = full.replace('</head>', PWA_HEAD + '</head>', 1)
SITE = os.path.join(OUT, 'site'); shutil.rmtree(SITE, ignore_errors=True); os.makedirs(SITE)
open(os.path.join(SITE, 'index.html'), 'w', encoding='utf8').write(site_html)
shutil.copytree(os.path.join(OUT, APP), os.path.join(SITE, APP)); shutil.copytree(os.path.join(OUT, 'models'), os.path.join(SITE, 'models'))
shutil.copytree(os.path.join(ROOT, 'pwa', 'icons'), os.path.join(SITE, 'icons'))
shutil.copy(os.path.join(ROOT, 'pwa', 'manifest.webmanifest'), SITE)
open(os.path.join(SITE, 'sw.js'), 'w', encoding='utf8').write(open(os.path.join(ROOT, 'pwa', 'sw.tpl.js'), encoding='utf8').read().replace('__APP__', APP))
open(os.path.join(SITE, '.nojekyll'), 'w').write('')
# локальный тест (с PWA)
LT = os.path.join(ROOT, 'lt')
full = site_html
for f in ('sw.js', 'manifest.webmanifest'): shutil.copy(os.path.join(SITE, f), LT)
shutil.rmtree(os.path.join(LT, 'icons'), ignore_errors=True); shutil.copytree(os.path.join(SITE, 'icons'), os.path.join(LT, 'icons'))
lt = full.replace('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js', './three/build/three.module.js').replace('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/', './three/examples/jsm/')
open(os.path.join(LT, 'index.html'), 'w', encoding='utf8').write(lt)
shutil.rmtree(os.path.join(LT, APP), ignore_errors=True); shutil.copytree(os.path.join(OUT, APP), os.path.join(LT, APP))
core = open(os.path.join(LT, APP, 'core.js'), encoding='utf8').read()
hook = "show(BUILDERS[start] ? start : 'skeleton');"
assert core.count(hook) == 1
core = core.replace(hook, hook + " window.__adv = (s) => { for (let i = 0; i < s * 20; i++) cur.update(0.05); }; window.__show = show; window.__built = () => Object.keys(built); window.__glass = () => GLASS.length; window.__cur = () => cur; window.__mem = () => renderer.info.memory;")
open(os.path.join(LT, APP, 'core.js'), 'w', encoding='utf8').write(core)
os.makedirs(os.path.join(LT, 'models'), exist_ok=True)
for f in glob.glob(os.path.join(OUT, 'models', '*.txt')): shutil.copy(f, os.path.join(LT, 'models'))
print('OK page', len(page.encode('utf8')), 'bytes;', len(scenes), 'bio scenes')
