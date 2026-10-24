p = 'src_page.html'; s = open(p, encoding='utf8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:80]); s = s.replace(a, b)
rep('<div class="brand">Человек <span>вживую</span></div>', '<div class="brand">Человек <span>вживую</span></div>\n    <button class="cfg" id="cfg" type="button" aria-expanded="false" aria-controls="knobs">Яркость</button>')
rep("@media (prefers-reduced-motion:reduce)", """.cfg,.subsel{display:none}
@media (max-width:700px){
  .wrap{padding-inline:10px;padding-block:6px 28px}
  .top{gap:8px 10px;padding-block:2px 8px}
  .brand{font-size:17px}
  .cfg{display:inline-flex;align-items:center;font:500 12px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--mute);background:transparent;border:1px solid var(--line-2);border-radius:999px;padding:5px 12px;min-height:32px;margin-left:auto;cursor:pointer}
  .cfg[aria-expanded="true"]{color:var(--fg);border-color:var(--accent)}
  .knobs{display:none;order:3;width:100%;margin:0;padding:4px 2px}
  .top.open .knobs{display:flex}
  .knob .rng input{width:140px}
  .tabs{order:4;width:100%;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
  .tabs::-webkit-scrollbar{display:none}
  .tab{flex:none;padding:6px 14px;min-height:38px;font-size:14px}
  .subtabs{padding:0 0 10px;margin:0}
  .subtabs .sub,.subtabs .subhead{display:none}
  .subsel{display:block;width:100%;font:500 15px var(--f-body);color:var(--fg);background:#141118;border:1px solid var(--line-2);border-radius:12px;padding:10px 12px;min-height:44px;appearance:auto}
  .subsel:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  .stage{height:60svh;min-height:360px;max-height:640px;border-radius:14px}
  .hud{left:12px;right:12px;top:10px;gap:8px}
  .kicker{font-size:10px}
  .ttl h1{font-size:22px;margin:3px 0 0}
  .stats{gap:12px}
  .stat i{font-size:9px}
  .stat b{font-size:17px}
  .stat b small{font-size:11px}
  .lbl{font-size:9px;letter-spacing:.04em}
  #scope{width:170px;height:72px;right:10px}
  .console.out{position:static;margin-top:10px;background:var(--panel-solid);backdrop-filter:none;-webkit-backdrop-filter:none;padding:12px;gap:12px 16px}
  .console.out .grp{flex:1 1 100%}
  .info{max-width:none;font-size:14px}
  .rng input{width:120px}
  .notes{padding-block:24px 4px}
}
@media (pointer:coarse){ .glabel kbd,.keys{display:none} .seg button{min-height:36px;padding:7px 11px} .btn{min-height:40px} }
@media (prefers-reduced-motion:reduce)""")
rep("renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));", "renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, matchMedia('(pointer:coarse)').matches ? 1.5 : 2));")
rep("""  Object.values(built).forEach((s) => { s.camera.aspect = w / hgt; s.camera.updateProjectionMatrix(); });""",
"""  // на узком (портретном) экране расширяем угол обзора, чтобы сцена помещалась по ширине
  const asp = w / Math.max(1, hgt), A0 = 1.25;
  Object.values(built).forEach((s) => { const c = s.camera; if (c.userData.fov0 === undefined) c.userData.fov0 = c.fov; c.fov = asp < A0 ? 2 * Math.atan(Math.tan(c.userData.fov0 * Math.PI / 360) * A0 / asp) * 180 / Math.PI : c.userData.fov0; c.aspect = asp; c.updateProjectionMatrix(); });""")
rep("function placeScope() { scopeEl.style.bottom = (consoleEl.offsetHeight + 28) + 'px'; }",
"""function placeScope() { scopeEl.style.bottom = (consoleEl.parentNode === stageEl ? consoleEl.offsetHeight + 28 : 12) + 'px'; }
/* телефон: панель управления уходит под сцену, яркость — за кнопкой */
const mqMob = matchMedia('(max-width:700px)');
function placeConsole() {
  if (mqMob.matches) { if (consoleEl.parentNode === stageEl) { stageEl.after(consoleEl); consoleEl.classList.add('out'); } }
  else if (consoleEl.parentNode !== stageEl) { stageEl.append(consoleEl); consoleEl.classList.remove('out'); }
  placeScope();
}
mqMob.addEventListener('change', placeConsole); placeConsole();
{ const cfg = $('#cfg'), top = $('.top'); cfg.addEventListener('click', () => { const o = top.classList.toggle('open'); cfg.setAttribute('aria-expanded', String(o)); }); }""")
rep("""  s.scenes.forEach(([sid, name]) => subNav.append(sid === '#' ? h('span', { class: 'subhead' }, name) : h('button', { class: 'sub', role: 'tab', type: 'button', 'aria-selected': String(sid === id), onclick: () => show(sid) }, name)));
}""", """  s.scenes.forEach(([sid, name]) => subNav.append(sid === '#' ? h('span', { class: 'subhead' }, name) : h('button', { class: 'sub', role: 'tab', type: 'button', 'aria-selected': String(sid === id), onclick: () => show(sid) }, name)));
  // на телефоне вместо длинного ряда — выпадающий список с группами
  const sel = h('select', { class: 'subsel', 'aria-label': 'Тема раздела «' + s.name + '»', onchange: (e) => show(e.target.value) }); let og = sel;
  s.scenes.forEach(([sid, name]) => { if (sid === '#') { og = h('optgroup', { label: name }); sel.append(og); } else { const o = h('option', { value: sid }, name); if (sid === id) o.selected = true; og.append(o); } });
  subNav.append(sel);
}""")
open(p, 'w', encoding='utf8').write(s); print('ok')
