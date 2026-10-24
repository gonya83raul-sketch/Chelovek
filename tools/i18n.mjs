// Перевод модуля страницы по словарю: все строки с кириллицей (литералы, части шаблонов, регулярные выражения).
// node tools/i18n.mjs extract <merged.mjs> <out.json>          — список строк: [{t, u}] (u — имя верхнего объявления: сцена/функция)
// node tools/i18n.mjs apply <merged.mjs> <dict.json> <out.mjs> — замена по словарю {рус: англ} (+ уточнения «unit::рус»); без перевода — остаётся как есть, список в stderr
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(fs.existsSync('/opt/node-tools/node_modules/acorn') ? '/opt/node-tools/node_modules/' : path.resolve('node_modules') + '/');
const acorn = require('acorn');
const walk = require('acorn-walk');

const [, , mode, inFile, a3, a4] = process.argv;
const code = fs.readFileSync(inFile, 'utf8');
const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
const CYR = /[А-Яа-яЁё]/;
const NO_TR = new Set(['Русский']); // название языка на кнопке переключателя
const isKey = (t) => t.trim().length <= 1 || NO_TR.has(t); // буквы русской раскладки в обработчиках клавиш — не переводятся
const unitOf = (pos) => {
  const s = ast.body.find((b) => b.start <= pos && pos < b.end);
  if (!s) return '?';
  if (s.type === 'FunctionDeclaration') return s.id.name;
  if (s.type === 'VariableDeclaration') return s.declarations[0].id.name || '?';
  return 'core';
};
// куски: {start, end, text, kind}
const pieces = [];
walk.full(ast, (n) => {
  if (n.type === 'Literal' && typeof n.value === 'string' && CYR.test(n.value) && !isKey(n.value)) pieces.push({ start: n.start, end: n.end, text: n.value, kind: 'str', q: code[n.start] });
  else if (n.type === 'Literal' && n.regex && CYR.test(n.regex.pattern)) pieces.push({ start: n.start, end: n.end, text: n.regex.pattern, kind: 're', flags: n.regex.flags });
  else if (n.type === 'TemplateElement' && CYR.test(n.value.cooked ?? n.value.raw)) pieces.push({ start: n.start, end: n.end, text: n.value.cooked ?? n.value.raw, kind: 'tpl' });
  // числа с десятичной запятой без букв ('~1,5', '< 0,42') — в переводе точка
  else if (mode === 'apply' && n.type === 'Literal' && typeof n.value === 'string' && !/[A-Za-zА-Яа-яЁё]/.test(n.value) && /\d,\d/.test(n.value)) pieces.push({ start: n.start, end: n.end, text: n.value, kind: 'str', q: code[n.start], num: true });
  // кусочки с одними «ёлочками» (закрывающая кавычка после вставки) — в переводе английские кавычки
  else if (mode === 'apply' && n.type === 'Literal' && typeof n.value === 'string' && /[«»]/.test(n.value)) pieces.push({ start: n.start, end: n.end, text: n.value, kind: 'str', q: code[n.start], quotes: true });
  else if (mode === 'apply' && n.type === 'TemplateElement' && /[«»]/.test(n.value.cooked ?? n.value.raw)) pieces.push({ start: n.start, end: n.end, text: n.value.cooked ?? n.value.raw, kind: 'tpl', quotes: true });
});
pieces.sort((x, y) => x.start - y.start);

if (mode === 'extract') {
  const seen = new Map();
  for (const p of pieces) { if (!seen.has(p.text)) seen.set(p.text, { t: p.text, u: unitOf(p.start) }); }
  fs.writeFileSync(a3, JSON.stringify([...seen.values()], null, 1));
  console.log('строк:', pieces.length, 'уникальных:', seen.size, 'символов:', [...seen.keys()].reduce((s, t) => s + t.length, 0));
} else if (mode === 'apply') {
  const dict = JSON.parse(fs.readFileSync(a3, 'utf8'));
  const miss = new Set();
  let out = '', last = 0;
  for (const p of pieces) {
    // уточнение по месту: ключ «<имя функции/переменной>::<строка>» важнее общего (одно русское слово — разные переводы)
    const tr = p.num ? p.text.replace(/(\d),(\d)/g, '$1.$2') : p.quotes ? p.text.replace(/«/g, '“').replace(/»/g, '”') : (dict[unitOf(p.start) + '::' + p.text] ?? dict[p.text]);
    if (tr == null || tr === '') { miss.add(p.text); continue; }
    let rep;
    if (p.kind === 'str') rep = p.q === "'" ? "'" + tr.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'" : JSON.stringify(tr);
    else if (p.kind === 'tpl') rep = tr.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    else rep = '/' + tr.replace(/\//g, '\\/') + '/' + p.flags;
    out += code.slice(last, p.start) + rep; last = p.end;
  }
  out += code.slice(last);
  fs.writeFileSync(a4, out);
  if (miss.size) process.stderr.write('без перевода: ' + miss.size + '\n');
  fs.writeFileSync(a4 + '.missing.json', JSON.stringify([...miss], null, 1));
}
