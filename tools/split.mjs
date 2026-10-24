// Делит единый модуль страницы на core.js + s/<вкладка>.js (+ s/kit.js для биохимии).
// node tools/split.mjs <merged.mjs> <outDir> <bioIds.json>
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(fs.existsSync('/opt/node-tools/node_modules/acorn') ? '/opt/node-tools/node_modules/' : path.resolve('node_modules') + '/');
const acorn = require('acorn');
const walk = require('acorn-walk');
const escope = require('eslint-scope');

const [, , inFile, outDir, bioFile] = process.argv;
const code = fs.readFileSync(inFile, 'utf8');
const BIO = new Set(JSON.parse(fs.readFileSync(bioFile, 'utf8')));
const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module', ranges: true });
const sm = escope.analyze(ast, { ecmaVersion: 2022, sourceType: 'module' });
const modScope = sm.globalScope.childScopes.find((s) => s.type === 'module');
const body = ast.body, N = body.length;
const stmtAt = (pos) => { let lo = 0, hi = N - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (body[m].end <= pos) lo = m + 1; else if (body[m].start > pos) hi = m - 1; else return m; } return -1; };

// BUILDERS
const bIdx = body.findIndex((s) => s.type === 'VariableDeclaration' && s.declarations[0].id.name === 'BUILDERS');
const BUILD = body[bIdx].declarations[0].init.properties.map((p) => [p.key.name, p.value.name]);
const seedOf = {}; BUILD.forEach(([id, fn]) => { seedOf[fn] = seedOf[fn] || id; });

// переменные модуля → оператор-определение; использование
const defStmt = new Map(); // name -> stmt idx
const vars = new Map();
for (const v of modScope.variables) {
  const d = v.defs[0]; if (!d) continue;
  const si = stmtAt(d.node.start ?? d.name.start); defStmt.set(v.name, si); vars.set(v.name, v);
}
const uses = Array.from({ length: N }, () => new Set());   // stmt -> set(var names used)
const users = Array.from({ length: N }, () => new Set());  // def stmt -> set(stmt idx)
const writes = []; // {name, stmt, ident}
for (const [name, v] of vars) {
  const ds = defStmt.get(name);
  for (const r of v.references) {
    const j = stmtAt(r.identifier.start); if (j < 0 || j === ds) continue;
    if (j === bIdx) continue;
    uses[j].add(name); users[ds].add(j);
    if (r.isWrite() && !(r.init)) writes.push({ name, stmt: j, ident: r.identifier });
  }
}
// владельцы
const owner = new Array(N).fill(null);
const isDecl = (s) => s.type === 'VariableDeclaration' || s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration' || s.type === 'ImportDeclaration';
// union-find вкладок
const par = {}; const find = (x) => (par[x] === undefined || par[x] === x ? (par[x] = x) : (par[x] = find(par[x]))); const uni = (a, b) => { a = find(a); b = find(b); if (a !== b) par[b] = a; };
body.forEach((s, i) => {
  if (i === bIdx) { owner[i] = 'core'; return; }
  if (!isDecl(s)) { owner[i] = 'core'; return; }
  if (s.type === 'FunctionDeclaration' && seedOf[s.id.name]) owner[i] = 'S:' + seedOf[s.id.name];
});
// вкладки, ссылающиеся на чужую стартовую функцию, объединяем
let changed = true;
const ownerKey = (o) => (o && o.startsWith('S:') ? 'S:' + find(o.slice(2)) : o);
for (let it = 0; it < 50 && changed; it++) {
  changed = false;
  for (let i = 0; i < N; i++) {
    if (owner[i] && owner[i].startsWith('S:') && body[i].type === 'FunctionDeclaration' && seedOf[body[i].id.name]) {
      for (const j of users[i]) { const o = ownerKey(owner[j]); if (o && o.startsWith('S:') && o !== ownerKey(owner[i])) { uni(owner[i].slice(2), o.slice(2)); changed = true; } }
    }
  }
}
const isBioChunk = (o) => o.startsWith('S:') && BIO.has(o.slice(2));
changed = true;
for (let it = 0; it < 500 && changed; it++) {
  changed = false;
  for (let i = 0; i < N; i++) {
    if (owner[i] && !(owner[i].startsWith('S:') && body[i].type === 'FunctionDeclaration' && seedOf[body[i].id.name])) { if (owner[i] !== null && it > 0) continue; }
    if (owner[i]) continue;
    const us = [...users[i]].map((j) => ownerKey(owner[j])).filter((u) => u !== 'drop');
    if (us.includes('core')) { owner[i] = 'core'; changed = true; continue; }
    if (us.some((u) => u === null)) continue;
    const set = new Set(us);
    if (set.size === 0) { owner[i] = body[i].type === 'FunctionDeclaration' ? 'drop' : 'core'; if (owner[i] === 'drop') console.log('без использования, пропущено:', body[i].id.name); changed = true; continue; }
    if (set.size === 1) { owner[i] = [...set][0]; changed = true; continue; }
    if ([...set].every((u) => u === 'kit' || isBioChunk(u))) { owner[i] = 'kit'; changed = true; continue; }
    owner[i] = 'core'; changed = true;
  }
}
// циклы → core (повторяем, пока есть пустые)
for (let guard = 0; guard < 50 && owner.some((o) => o === null); guard++) {
  const i = owner.findIndex((o) => o === null); owner[i] = 'core';
  changed = true;
  for (let it = 0; it < 500 && changed; it++) {
    changed = false;
    for (let k = 0; k < N; k++) {
      if (owner[k]) continue;
      const us = [...users[k]].map((j) => ownerKey(owner[j])).filter((u) => u !== 'drop');
      if (us.includes('core')) { owner[k] = 'core'; changed = true; continue; }
      if (us.some((u) => u === null)) continue;
      const set = new Set(us);
      owner[k] = set.size === 1 ? [...set][0] : [...set].every((u) => u === 'kit' || isBioChunk(u)) ? 'kit' : 'core'; changed = true;
    }
  }
}
for (let i = 0; i < N; i++) owner[i] = ownerKey(owner[i]);
if (process.env.WHY) for (const nm of process.env.WHY.split(',')) { const i = defStmt.get(nm); console.log('WHY', nm, owner[i], [...users[i]].map((j) => owner[j] + ':' + code.slice(body[j].start, body[j].start + 40).replace(/\s+/g, ' '))); }
// проверка: в core не должно быть ссылок на вкладки/kit
const modName = (o) => (o === 'core' ? 'core' : o === 'kit' ? 'kit' : o === 'drop' ? 'drop' : o.slice(2));
for (let i = 0; i < N; i++) for (const name of uses[i]) {
  const o = owner[defStmt.get(name)], me = owner[i];
  if (o === me || me === 'drop') continue;
  if (o === 'drop') { console.error('используется пропущенное', name); process.exit(1); }
  if (me === 'core' && o !== 'core') { console.error('core использует', name, 'из', o, 'в операторе', i, code.slice(body[i].start, body[i].start + 80)); process.exit(1); }
  if (me === 'kit' && o !== 'core' && o !== 'kit') { console.error('kit использует', name, 'из', o); process.exit(1); }
  if (me.startsWith('S:') && o.startsWith('S:')) { console.error('вкладка', me, 'использует', name, 'из', o); process.exit(1); }
}

// данные биохимии: делим по вкладкам
const DATA = {};
for (const nm of ['BIO_PDB', 'BIO_MOL']) {
  if (!defStmt.has(nm)) continue;
  const si = defStmt.get(nm); const init = body[si].declarations[0].init;
  DATA[nm] = { si, obj: JSON.parse(code.slice(init.start, init.end)), init };
}
const words = (idxs) => { const w = new Set(); idxs.forEach((i) => walk.full(body[i], (n) => { if (n.type === 'Literal' && typeof n.value === 'string') { w.add(n.value); n.value.split(/[^\w]+/).forEach((x) => w.add(x)); } if (n.type === 'TemplateElement') n.value.cooked.split(/[^\w]+/).forEach((x) => w.add(x)); if (n.type === 'MemberExpression' && !n.computed) w.add(n.property.name); if (n.type === 'Property' && !n.computed && n.key.type === 'Identifier') w.add(n.key.name); })); return w; };

// сборка модулей
const mods = {};
for (let i = 0; i < N; i++) { const m = modName(owner[i]); (mods[m] ||= []).push(i); }
delete mods.drop;
const setters = {}; // module -> set(names)
const edits = {};   // stmt -> [[start,end,text]]
for (const w of writes) {
  const ds = defStmt.get(w.name); const om = modName(owner[ds]), wm = modName(owner[w.stmt]);
  if (om === wm) continue;
  let node = null;
  walk.full(body[w.stmt], (n) => { if ((n.type === 'AssignmentExpression' && n.left === w.ident) || (n.type === 'UpdateExpression' && n.argument === w.ident)) node = n; });
  if (!node || node.type === 'UpdateExpression') { console.error('не могу переписать запись в', w.name); process.exit(1); }
  const rhs = code.slice(node.right.start, node.right.end);
  const txt = node.operator === '=' ? `__set_${w.name}(${rhs})` : `__set_${w.name}(${w.name} ${node.operator.slice(0, -1)} (${rhs}))`;
  (edits[w.stmt] ||= []).push([node.start, node.end, txt]);
  (setters[om] ||= new Set()).add(w.name);
  uses[w.stmt].add('__set_' + w.name);
}
const textOf = (i) => {
  const s0 = i === 0 ? 0 : body[i - 1].end; let t = code.slice(s0, body[i].end); const ed = (edits[i] || []).sort((a, b) => b[0] - a[0]);
  for (const [a, b, x] of ed) t = t.slice(0, a - s0) + x + t.slice(b - s0);
  return t;
};
const exportsOf = {}; const importsOf = {};
for (const [m, idxs] of Object.entries(mods)) {
  const imp = {};
  idxs.forEach((i) => uses[i].forEach((name) => {
    let src;
    if (name.startsWith('__set_')) { const v = name.slice(6); src = modName(owner[defStmt.get(v)]); }
    else src = modName(owner[defStmt.get(name)]);
    if (src === m) return;
    (imp[src] ||= new Set()).add(name); (exportsOf[src] ||= new Set()).add(name);
  }));
  importsOf[m] = imp;
}
fs.mkdirSync(path.join(outDir, 's'), { recursive: true });
const sizes = [];
const kitWords = mods.kit ? words(mods.kit) : new Set();
const usedKeys = {}; const preOf = {};
for (const [m, idxs] of Object.entries(mods)) {
  if (m === 'core' || m === 'kit' || !importsOf[m].kit) continue;
  const w = words(idxs); let pre = '';
  for (const [nm, D] of Object.entries(DATA)) {
    const defm = modName(owner[D.si]);
    const keys = Object.keys(D.obj).filter((k) => w.has(k) && !(defm === 'kit' && kitWords.has(k)));
    if (!keys.length) continue;
    (importsOf[m][defm] ||= new Set()).add(nm); (exportsOf[defm] ||= new Set()).add(nm);
    const sub = {}; keys.forEach((k) => { sub[k] = D.obj[k]; (usedKeys[nm] ||= new Set()).add(k); });
    pre += `Object.assign(${nm}, ${JSON.stringify(sub)});\n`;
  }
  preOf[m] = pre;
}
for (const [m, idxs] of Object.entries(mods)) {
  const isCore = m === 'core', isKit = m === 'kit';
  const rel = (src) => (src === 'core' ? (isKit ? '../core.js' : '../core.js') : src === 'kit' ? './kit.js' : null);
  let out = '';
  for (const [src, names] of Object.entries(importsOf[m])) out += `import { ${[...names].sort().join(', ')} } from '${rel(src)}';\n`;
  const pre = preOf[m] || '';
  let txt = idxs.map((i) => {
    for (const [nm, D] of Object.entries(DATA)) if (i === D.si) {
      const keys = Object.keys(D.obj).filter((k) => kitWords.has(k)); const sub = {}; keys.forEach((k) => { sub[k] = D.obj[k]; (usedKeys[nm] ||= new Set()).add(k); });
      const s0 = i === 0 ? 0 : body[i - 1].end; const t = textOf(i);
      return t.slice(0, D.init.start - s0) + JSON.stringify(sub) + t.slice(D.init.end - s0);
    }
    return textOf(i);
  }).join('');
  if (isCore) txt = txt.replace(code.slice(body[bIdx].start, body[bIdx].end), 'const BUILDERS = {' + BUILD.map(([id, fn]) => ` ${id}: ['${modName(owner[defStmt.get(fn)])}', '${fn}']`).join(',') + ' };');
  m === 'core' ? (mods.__coreText = txt) : null;
  const ex = new Set([...(exportsOf[m] || [])].filter((x) => !x.startsWith('__set_')));
  const setLines = [...(setters[m] || [])].map((v) => `function __set_${v}(x) { return (${v} = x); }\n`).join('');
  [...(setters[m] || [])].forEach((v) => ex.add('__set_' + v));
  if (m.startsWith && !isCore && !isKit) idxs.forEach((i) => { const s = body[i]; if (s.type === 'FunctionDeclaration' && seedOf[s.id.name]) ex.add(s.id.name); });
  const file = isCore ? path.join(outDir, 'core.js') : path.join(outDir, 's', m + '.js');
  const final = out + pre + txt + '\n' + setLines + (ex.size ? `export { ${[...ex].sort().join(', ')} };\n` : '');
  fs.writeFileSync(file, final);
  sizes.push([m, Buffer.byteLength(final)]);
}
for (const [nm, D] of Object.entries(DATA)) { const miss = Object.keys(D.obj).filter((k) => !usedKeys[nm]?.has(k)); if (miss.length) console.log('не использованы', nm, miss.join(' ')); }
sizes.sort((a, b) => b[1] - a[1]);
console.log(sizes.map(([m, s]) => m + ':' + Math.round(s / 1024)).join(' '));
// диагностика: крупнейшие операторы core
const big = mods.core.map((i) => [i, body[i].end - body[i].start]).sort((a, b) => b[1] - a[1]).slice(0, 25);
console.log('CORE TOP:', big.map(([i, n]) => Math.round(n / 1024) + 'k ' + code.slice(body[i].start, body[i].start + 50).replace(/\s+/g, ' ')).join('\n  '));
