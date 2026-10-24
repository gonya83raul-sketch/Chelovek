import sys, re
import os; t = open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'book.txt'), encoding='utf8').read()
a, b = sys.argv[1], sys.argv[2]
off = t.index('Обезвреживающая функция печени'); i = t.index(a, off); j = t.index(b, i + 1)
s = t[i:j]
s = re.sub(r'[ \t]+', ' ', s); s = re.sub(r'\n\s*\n+', '\n', s)
lim = int(sys.argv[3]) if len(sys.argv) > 3 else 12000
print(s[:lim])
