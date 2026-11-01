"""Правки из отчёта рецензента: пары `было` → `стало`.
python3 tools/applypairs.py review/score-r8a.md [id ...] [--apply] [--skip N,M]
Без --apply только показывает пары и где «было» встречается. Применяет пару, если «было»
встречается ровно один раз ровно в одном файле (src_page.html, bio/*.js).
Пары из строк с «не внесено»/«не проверял» пропускаются."""
import re, sys, glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
rep = args.pop(0); apply = '--apply' in args
skip = set()
if '--skip' in args:
    skip = {int(x) for x in args[args.index('--skip') + 1].split(',')}
    del args[args.index('--skip'):args.index('--skip') + 2]
ids = [a for a in args if not a.startswith('--')]
text = open(rep, encoding='utf-8').read()
secs = re.split(r'^## +', text, flags=re.M)
files = [os.path.join(ROOT, 'src_page.html')] + sorted(glob.glob(os.path.join(ROOT, 'bio', '*.js')) + glob.glob(os.path.join(ROOT, 'body', '*.js')))
src = {f: open(f, encoding='utf-8').read() for f in files}
n = 0; changed = set(); ENADD = {}
for s in secs:
    m = re.match(r'([a-z0-9]+) +—', s)
    if not m or (ids and m.group(1) not in ids): continue
    pairs = []; pend = None; enk = None; mode = None; en = []
    for line in s.split('\n'):
        if re.search(r'не внесено|не проверял', line): pend = None; continue
        ticks = re.findall(r'`([^`]+)`', line)
        if '→' in line and not re.search(r'было:|стало:', line):
            pairs += re.findall(r'`([^`]+)`\s*→\s*(?:стало\s*)?`([^`]*)`', line)
        if re.search(r'было:', line) and ticks: pend = ticks[0]
        elif re.search(r'стало:', line) and pend is not None:
            if line.count('`') % 2: print('ВНИМАНИЕ: многострочное «стало», внести вручную:', pend[:80]); pend = None; continue
            pairs.append((pend, ticks[0] if ticks else '')); pend = None
        if re.search(r'ключ[^`]*«?стало', line) and re.search(r'значение', line) and ticks and pairs:
            en.append((pairs[-1][1], ticks[-1])); continue
        if re.search(r'ключ', line): mode = 'k'
        if re.search(r'значение', line): mode = 'v'
        if ticks and mode == 'k' and not re.search(r'было:|стало:', line): enk = ticks[-1]; mode = None
        elif ticks and mode == 'v' and enk: en.append((enk, ticks[-1])); enk = None; mode = None
    for k, v in en: ENADD[k] = v
    for a, b in pairs:
            n += 1
            hits = [(f, src[f].count(a)) for f in files if a in src[f]]
            tag = f'[{n}] {m.group(1)}: '
            if len(hits) != 1 or hits[0][1] != 1:
                print(tag + 'ПРОПУСК (вхождений: %s): %s' % ([(os.path.basename(f), c) for f, c in hits], a[:90])); continue
            f = hits[0][0]
            if n in skip: print(tag + 'пропущено вручную'); continue
            print(tag + '%s: %s  →  %s' % (os.path.basename(f), a[:80], b[:80]))
            if apply: src[f] = src[f].replace(a, b); changed.add(f)
for f in changed: open(f, 'w', encoding='utf-8').write(src[f])
import json
if ENADD:
    print('EN пар', len(ENADD))
    if apply:
        jp = os.path.join(ROOT, 'data/i18n/en/b40_r8.json')
        d = json.load(open(jp, encoding='utf-8')) if os.path.exists(jp) else {}
        d.update(ENADD); json.dump(d, open(jp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('пар', n, '; изменены файлы:', [os.path.basename(f) for f in changed])
