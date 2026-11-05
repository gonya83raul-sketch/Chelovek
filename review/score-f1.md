# Итоговая проверка f1 (05.11, после app78) — cell, planes, referred, skeleton, joints, neuron, synapse, brain

| сцена | оценка |
|---|---|
| cell | 4,5 → 5,0 с правками (режим «Ядро»: на компьютере нижняя треть ядра под пультом, на телефоне обрезано) |
| planes | 4,5 → 5,0 с правкой (телефон «Верхний ↔ нижний»: подпись «верхний» скрыта, голова под заголовком) |
| referred, skeleton («Рентген» — кости видны), joints, neuron, synapse, brain | 5,0 |

Пары (внесены, проверены снимками после правки):
- было: `V3(0, st.sel === 'lyso' && matchMedia('(max-width:700px)').matches ? -0.12 * ORG[st.sel].dist : 0, 0)`
- стало: `V3(0, st.sel === 'lyso' && matchMedia('(max-width:700px)').matches ? -0.12 * ORG[st.sel].dist : (st.sel === 'nucleus' && !matchMedia('(max-width:700px)').matches ? -0.15 * ORG[st.sel].dist : 0), 0)`
- было: `ORG.nucleus.dist = 9;`
- стало: `ORG.nucleus.dist = matchMedia('(max-width:700px)').matches ? 11.3 : 9;`
- было: `if (mqm.matches && st.dir === 'deep') v = [V3(0, 10.9, 0.8), V3(26, 10.6, 8.6)];`
- стало: `if (mqm.matches && st.dir === 'deep') v = [V3(0, 10.9, 0.8), V3(26, 10.6, 8.6)]; if (mqm.matches && st.dir === 'sup') v = [V3(0, 9.6, 0), V3(5, 8.4, 46)];`

Низкие (без пар): planes «Области живота» — пульт в три ряда; referred — подписи без подложек в «Карте зон», плотный кластер в «Механизме»; neuron — при выключенном миелине лид говорит «бежит по миелину»; cell «Ядро» — точки и микротрубочки на строках лида; skeleton — чёрный эллипс-пол; joints — эпифиз у верха сцены; synapse — постсинаптическая клетка под пультом.
(Отчёт рецензента записан автором со слов рецензента — сам агент файл не создал.)
