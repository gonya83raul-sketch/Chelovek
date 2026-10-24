#!/usr/bin/env python3
"""Слияние data/mols.json (или pdb.json) по ключам при конфликте git: python3 tools/jsonmerge.py data/mols.json
Для каждого ключа: если «их» версия отличается от базы — берём её, иначе нашу."""
import json, subprocess, sys
f = sys.argv[1]
def ver(n):
    try: return json.loads(subprocess.check_output(['git', 'show', f':{n}:{f}']))
    except Exception: return {}
base, ours, theirs = ver(1), ver(2), ver(3)
out = dict(ours)
for k, v in theirs.items():
    if base.get(k) != v: out[k] = v
for k in base:
    if k not in theirs and k in out and ours.get(k) == base.get(k): del out[k]
json.dump(out, open(f, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print(f, len(ours), len(theirs), '->', len(out))
