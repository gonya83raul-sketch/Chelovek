p = 'src_page.html'; s = open(p, encoding='utf8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:80]); s = s.replace(a, b)
ADDR = 'TU5THz3NcJ2DKGvhtYVDCV1PCrDn7x41Ap'
rep('<button class="pill inst" id="inst" type="button" hidden>Установить</button>',
    '<button class="pill inst" id="inst" type="button" hidden>Установить</button>\n    <button class="pill heart" id="donate" type="button" aria-haspopup="dialog"><span aria-hidden="true">♥</span><span class="dtxt">Поддержать</span></button>')
rep('  <section class="notes" id="notes"></section>', f'''  <section class="notes" id="notes"></section>
  <dialog class="donate" id="donatebox" aria-labelledby="donateTitle">
    <form method="dialog" class="dclose"><button class="pill ghost" type="submit" aria-label="Закрыть">✕</button></form>
    <h2 id="donateTitle">Поддержать проект</h2>
    <p>«Человек вживую» бесплатный и без рекламы. Новые темы, 3D-модели и приложение делаются на энтузиазме — если атлас вам полезен, вы можете помочь его развитию.</p>
    <div class="dnet">USDT · сеть TRON (TRC-20)</div>
    <div class="daddr"><code id="daddr">{ADDR}</code><button class="btn primary" type="button" id="dcopy">Копировать</button></div>
    <p class="dwarn">Отправляйте только <b>USDT в сети TRON (TRC-20)</b>. Перевод другой монеты или в другой сети потеряется.</p>
  </dialog>''')
rep(".pill:disabled{opacity:.7;cursor:default}\n.inst{margin-left:auto}", """.pill:disabled{opacity:.7;cursor:default}\n.inst{margin-left:auto}
.heart{display:inline-flex;align-items:center;gap:6px;color:var(--fg);background:transparent;border-color:#5A3A48}
.heart span:first-child{color:#FF7A9A}
.heart:hover{border-color:#FF7A9A}
.inst[hidden] + .heart{margin-left:auto}
dialog.donate{max-width:min(520px,calc(100% - 32px));background:var(--panel-solid);color:var(--fg);border:1px solid var(--line-2);border-radius:18px;padding:22px 22px 18px}
dialog.donate::backdrop{background:rgba(5,4,7,.72)}
dialog.donate h2{font:700 22px var(--f-display);margin:0 0 8px}
dialog.donate p{color:#D2CBD0;margin:0 0 12px}
.dclose{position:absolute;right:14px;top:14px;margin:0}
.dnet{font:500 11px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-bottom:6px}
.daddr{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
.daddr code{font:500 13px var(--f-mono);background:#1C1922;border:1px solid var(--line-2);border-radius:10px;padding:9px 11px;word-break:break-all;flex:1 1 260px;user-select:all}
.dwarn{font-size:13px}""")
rep("  .inst{margin-left:auto}\n  .inst:not([hidden]) + .cfg{margin-left:0}", "  .inst{margin-left:auto}\n  .heart{margin-left:auto}\n  .inst:not([hidden]) + .heart{margin-left:0}\n  .heart .dtxt{display:none}")
rep("{ const cfg = $('#cfg'), top = $('.top');", """{ const dlg = $('#donatebox'), btn = $('#donate'), cp = $('#dcopy');
  btn.addEventListener('click', () => { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  cp.addEventListener('click', () => { const a = $('#daddr').textContent.trim(); const ok = () => { cp.textContent = 'Скопировано ✓'; setTimeout(() => { cp.textContent = 'Копировать'; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(a).then(ok, () => { getSelection().selectAllChildren($('#daddr')); cp.textContent = 'Выделено — скопируйте'; });
    else { getSelection().selectAllChildren($('#daddr')); cp.textContent = 'Выделено — скопируйте'; } });
}
{ const cfg = $('#cfg'), top = $('.top');""")
open(p, 'w', encoding='utf8').write(s); print('ok')
