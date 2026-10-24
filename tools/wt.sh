#!/bin/sh
# Отдельная рабочая копия для параллельной работы агента: sh tools/wt.sh <имя>
# Создаёт /home/user/wt-<имя> на ветке wt-<имя> от текущего HEAD, копирует модели, three.js и собирает.
set -e
N=$1; ROOT=$(cd "$(dirname "$0")/.." && pwd); D=/home/user/wt-$N
[ -d "$D" ] || git -C "$ROOT" worktree add -q -b wt-$N "$D" HEAD
mkdir -p "$D/out" "$D/lt"
[ -d "$D/out/models" ] || cp -r "$ROOT/out/models" "$D/out/models"
[ -d "$D/node_modules" ] || ln -s "$ROOT/node_modules" "$D/node_modules"
[ -d "$D/lt/three" ] || cp -r "$ROOT/lt/three" "$D/lt/three"
(cd "$D" && python3 tools/build.py | tail -1)
echo "$D"
