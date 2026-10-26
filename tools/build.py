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
files = sorted(glob.glob(os.path.join(ROOT, 'bio', '*.js'))) + sorted(glob.glob(os.path.join(ROOT, 'body', '*.js')))
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
bio_sc = [sc for sc in scenes if not sc[3].startswith('@body')]
body_sc = [sc for sc in scenes if sc[3].startswith('@body')]
items, last = [], None
for i, fn, name, grp in bio_sc:
    if grp != '-' and grp != last:
        items.append(f"['#', '{grp}']"); last = grp
    items.append(f"['{i}', '{name}']")
if bio_sc:
    page = page.replace(c0, c0 + "  { id: 'bio', name: 'Биохимия', scenes: [" + ', '.join(items) + '] },\n')
# сцены раздела «Тело» из файлов: группа «@body Название группы» (в начало — «@body^Название»)
if body_sc:
    bm = re.search(r"  \{ id: 'body', name: 'Тело', scenes: \[(.*?)\] \},\n", page)
    lst = re.findall(r"\['([^']*)', '([^']*)'\]", bm.group(1))
    for i, fn, name, grp in body_sc:
        g = grp[5:].strip(); front = g.startswith('^'); g = g.lstrip('^').strip()
        hi = next((k for k, (a1, b1) in enumerate(lst) if a1 == '#' and b1 == g), None)
        if hi is None:
            if front: lst[0:0] = [('#', g), (i, name)]
            else: lst += [('#', g), (i, name)]
        else:
            k = hi + 1
            while k < len(lst) and lst[k][0] != '#': k += 1
            lst.insert(k, (i, name))
    page = page[:bm.start(1)] + ', '.join(f"['{a1}', '{b1}']" for a1, b1 in lst) + page[bm.end(1):]
import json, shutil
APP = 'app12'   # меняется при каждой публикации со старой структурой кэша
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
# английская сборка: русские строки → словарь data/i18n/en.json (собирается из data/i18n/en/*.json)
EN = {}
for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'i18n', 'en', '*.json'))): EN.update(json.load(open(f, encoding='utf8')))
if EN:
    json.dump(EN, open(os.path.join(OUT, '_en.json'), 'w', encoding='utf8'), ensure_ascii=False)
    r = subprocess.run(['node', os.path.join(ROOT, 'tools', 'i18n.mjs'), 'apply', os.path.join(OUT, '_merged.mjs'), os.path.join(OUT, '_en.json'), os.path.join(OUT, '_merged_en.mjs')], capture_output=True, text=True)
    if r.returncode: print(r.stderr[:3000]); sys.exit(1)
    nmiss = len(json.load(open(os.path.join(OUT, '_merged_en.mjs.missing.json'), encoding='utf8')))
    men = open(os.path.join(OUT, '_merged_en.mjs'), encoding='utf8').read()
    assert men.count("const LANG = 'ru';") == 1
    open(os.path.join(OUT, '_merged_en.mjs'), 'w', encoding='utf8').write(men.replace("const LANG = 'ru';", "const LANG = 'en';"))
    r = subprocess.run(['node', os.path.join(ROOT, 'tools', 'split.mjs'), os.path.join(OUT, '_merged_en.mjs'), os.path.join(OUT, APP, 'en'), os.path.join(OUT, '_bio.json')], capture_output=True, text=True)
    if r.returncode: print(r.stderr[:3000]); sys.exit(1)
    print('EN: строк без перевода', nmiss, '(out/_merged_en.mjs.missing.json)')
for f in glob.glob(os.path.join(OUT, APP, '**', '*.js'), recursive=True):
    r = subprocess.run(['node', '--check', f], capture_output=True, text=True)
    if r.returncode: print(f, r.stderr[:2000]); sys.exit(1)
page_ru = page[:i0] + f'<script type="module" src="{APP}/core.js"></script>' + page[i1 + len('</script>'):]
open(os.path.join(OUT, 'page.html'), 'w', encoding='utf8').write(page_ru)
# сайт: язык из ?lang=, памяти или языка браузера
LOADER = ('<script type="module">\nlet L = new URLSearchParams(location.search).get(\'lang\');\n'
  'try { if (L) localStorage.setItem(\'lang\', L); else L = localStorage.getItem(\'lang\'); } catch (e) { /* без памяти */ }\n'
  'if (L !== \'en\' && L !== \'ru\') L = (navigator.languages || [navigator.language || \'\']).some((l) => /^(ru|uk|be|kk)/i.test(l)) ? \'ru\' : \'en\';\n'
  f'document.documentElement.lang = L;\nimport(L === \'en\' ? \'./{APP}/en/core.js\' : \'./{APP}/core.js\');\n</script>')
page = page[:i0] + (LOADER if EN else f'<script type="module" src="{APP}/core.js"></script>') + page[i1 + len('</script>'):]
head = '<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head>\n<body>\n'
full = head + page + '</body>\n</html>\n'
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8').write(full)
# SEO: заголовок и описание в <head>, canonical, языковые версии, schema.org; статический список тем (виден поисковикам без JS)
BASE = 'https://gonya83raul-sketch.github.io/Chelovek/'
DESC = 'Бесплатный интерактивный 3D-атлас человека: анатомия, клетка, мозг и биохимия — от молекулы до мысли. Вращайте модели, запускайте процессы, изучайте болезни и лекарства.'
merged = open(os.path.join(OUT, '_merged.mjs'), encoding='utf8').read()
sb = merged[merged.index('const SECTIONS = ['):]; sb = sb[:sb.index('].map(')]
SEC_ORDER = {'bio': 0, 'cell': 1, 'body': 2, 'brain': 3}
secs = []
for m in re.finditer(r"\{ id: '(\w+)', name: '([^']+)', scenes: \[(.*?)\] \}", sb, re.S):
    items = re.findall(r"\['(#|\w+)', '([^']+)'\]", m.group(3))
    secs.append((m.group(1), m.group(2), items))
secs.sort(key=lambda s: SEC_ORDER.get(s[0], 9))
ntop = sum(1 for s in secs for i, _ in s[2] if i != '#')
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;')
blocks = []
for sid, name, items in secs:
    li = []; 
    for i, n in items:
        li.append(f'<li class="sg">{esc(n)}</li>' if i == '#' else f'<li><a href="#{i}">{esc(n)}</a></li>')
    blocks.append(f'<div><h3>{esc(name)}</h3><ul>{"".join(li)}</ul></div>')
TOPICS = f'<details class="alltopics"><summary>Все темы атласа ({ntop})</summary><div class="atgrid">{"".join(blocks)}</div></details>'
JSONLD = json.dumps({'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Кто мы? — от молекулы до мысли', 'alternateName': 'Who are we? From molecule to mind', 'url': BASE, 'description': DESC, 'applicationCategory': 'EducationalApplication', 'operatingSystem': 'Web', 'inLanguage': ['ru', 'en'], 'isAccessibleForFree': True, 'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'RUB'}, 'sameAs': ['https://t.me/KTOMY_ATLAS', 'https://boosty.to/chelovek3d']}, ensure_ascii=False)
SEO_HEAD = (f'<title>Кто мы? — от молекулы до мысли · 3D-атлас человека</title>\n<meta name="description" content="{DESC}">\n<link rel="canonical" href="{BASE}">\n'
  f'<link rel="alternate" hreflang="ru" href="{BASE}?lang=ru">\n<link rel="alternate" hreflang="en" href="{BASE}?lang=en">\n<link rel="alternate" hreflang="x-default" href="{BASE}">\n'
  f'<meta property="og:type" content="website">\n<meta property="og:title" content="Кто мы? — от молекулы до мысли">\n<meta property="og:description" content="{DESC}">\n<meta property="og:url" content="{BASE}">\n<meta property="og:image" content="{BASE}icons/icon-512.png">\n<meta property="og:locale" content="ru_RU">\n'
  f'<script type="application/ld+json">{JSONLD}</script>\n')
# сайт-приложение (PWA) для своего хостинга: manifest, иконки, офлайн-кэш
PWA_HEAD = '<meta name="theme-color" content="#08070A">\n<meta name="mobile-web-app-capable" content="yes">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">\n<link rel="apple-touch-icon" href="icons/apple-180.png">\n'
site_html = full.replace('</head>', SEO_HEAD + PWA_HEAD + '</head>', 1).replace('<title>Кто мы? — от молекулы до мысли</title>\n', '', 1).replace('<!--TOPICS-->', TOPICS, 1)
full = full.replace('<!--TOPICS-->', TOPICS, 1)
SITE = os.path.join(OUT, 'site'); shutil.rmtree(SITE, ignore_errors=True); os.makedirs(SITE)
open(os.path.join(SITE, 'index.html'), 'w', encoding='utf8').write(site_html)
shutil.copytree(os.path.join(OUT, APP), os.path.join(SITE, APP)); shutil.copytree(os.path.join(OUT, 'models'), os.path.join(SITE, 'models'))
shutil.copytree(os.path.join(ROOT, 'pwa', 'icons'), os.path.join(SITE, 'icons'))
shutil.copy(os.path.join(ROOT, 'pwa', 'manifest.webmanifest'), SITE)
sw = open(os.path.join(ROOT, 'pwa', 'sw.tpl.js'), encoding='utf8').read()
if not EN: sw = sw.replace("'./__APP__/en/core.js', ", '')
open(os.path.join(SITE, 'sw.js'), 'w', encoding='utf8').write(sw.replace('__APP__', APP))
open(os.path.join(SITE, '.nojekyll'), 'w').write('')
shutil.copytree(os.path.join(ROOT, 'pwa', 'img'), os.path.join(SITE, 'img'))
open(os.path.join(SITE, 'robots.txt'), 'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n')
open(os.path.join(SITE, 'sitemap.xml'), 'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>{BASE}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n<url><loc>{BASE}?lang=en</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n</urlset>\n')
llms = ['# Кто мы? — от молекулы до мысли (Who are we? From molecule to mind)', '', '> ' + DESC, '', f'Сайт: {BASE} (английская версия: {BASE}?lang=en). Каждая тема открывается по адресу вида {BASE}#id. Обратная связь: https://t.me/KTOMY_ATLAS, gonya83raul@gmail.com.', '']
for sid, name, items in secs:
    llms.append(f'## {name}'); llms += [f'- [{n}]({BASE}#{i})' for i, n in items if i != '#']; llms.append('')
open(os.path.join(SITE, 'llms.txt'), 'w', encoding='utf8').write('\n'.join(llms))
# локальный тест (с PWA)
LT = os.path.join(ROOT, 'lt')
full = site_html
for f in ('sw.js', 'manifest.webmanifest'): shutil.copy(os.path.join(SITE, f), LT)
shutil.rmtree(os.path.join(LT, 'icons'), ignore_errors=True); shutil.copytree(os.path.join(SITE, 'icons'), os.path.join(LT, 'icons'))
shutil.rmtree(os.path.join(LT, 'img'), ignore_errors=True); shutil.copytree(os.path.join(SITE, 'img'), os.path.join(LT, 'img'))
lt = full.replace("? 'ru' : 'en';", "? 'ru' : 'ru'; // тесты: по умолчанию русский").replace('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js', './three/build/three.module.js').replace('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/', './three/examples/jsm/')
open(os.path.join(LT, 'index.html'), 'w', encoding='utf8').write(lt)
shutil.rmtree(os.path.join(LT, APP), ignore_errors=True); shutil.copytree(os.path.join(OUT, APP), os.path.join(LT, APP))
for cf in [os.path.join(LT, APP, 'core.js')] + ([os.path.join(LT, APP, 'en', 'core.js')] if EN else []):
    core = open(cf, encoding='utf8').read()
    hook = "show(BUILDERS[start] ? start : 'skeleton');"
    assert core.count(hook) == 1
    core = core.replace(hook, hook + " window.__adv = (s) => { for (let i = 0; i < s * 20; i++) cur.update(0.05); }; window.__show = show; window.__built = () => Object.keys(built); window.__glass = () => GLASS.length; window.__cur = () => cur; window.__mem = () => renderer.info.memory;")
    open(cf, 'w', encoding='utf8').write(core)
os.makedirs(os.path.join(LT, 'models'), exist_ok=True)
for f in glob.glob(os.path.join(OUT, 'models', '*.txt')): shutil.copy(f, os.path.join(LT, 'models'))
print('OK page', len(page.encode('utf8')), 'bytes;', len(scenes), 'bio scenes')
