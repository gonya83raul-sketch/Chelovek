import { GLOW, Sparks, THREE, V3, __set_rnd, addLights, button, clamp, displaceGeo, ell3, envTex, glassMat, group, h, lerp, makeControls, mergeVertices, mulberry, noise3, rand, randUnit, rnd, seg, smooth, taperTube, toggle } from '../core.js';


/* =========================================================
   SCENE 1 · НЕЙРОН
   ========================================================= */
function makeNeuron() {
  __set_rnd(mulberry(11));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07060a); scene.fog = new THREE.FogExp2(0x07060a, 0.03); scene.environment = envTex;
  addLights(scene);
  const NDX = matchMedia('(max-width:700px)').matches ? 0 : 2.0;   // компьютер: нейрон правее — дендриты не под описанием
  const NDY = NDX ? 0.9 : 0;   // компьютер: нейрон ниже — верхний дендрит не задевает описание
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300); camera.position.set(7.5 - NDX, 6.5 + NDY, 32.5);
  const controls = makeControls(camera, V3(7.5 - NDX, NDY, 0)); controls.minDistance = 4; controls.maxDistance = 50;

  const memMat = new THREE.MeshPhysicalMaterial({ color: 0xcdb0c4, roughness: 0.46, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.35, sheen: 1, sheenColor: new THREE.Color(0x8f6dff), sheenRoughness: 0.5, emissive: 0x12081a, envMapIntensity: 0.6 });
  const somaMat = memMat.clone(); somaMat.emissive = new THREE.Color(0xff8a3c); somaMat.emissiveIntensity = 0;

  // сома: индексированная сфера (mergeVertices) — гладкие нормали без граней
  const somaG = new THREE.IcosahedronGeometry(1.15, 40); somaG.deleteAttribute('normal'); somaG.deleteAttribute('uv');
  const soma = new THREE.Mesh(displaceGeo(mergeVertices(somaG), (v) => {
    const n = v.clone().normalize(); let s = 1 + 0.15 * noise3(n.x * 1.6, n.y * 1.6, n.z * 1.6) + 0.04 * noise3(n.x * 5, n.y * 5, n.z * 5);
    if (n.x > 0) s += 0.45 * Math.pow(n.x, 6); if (n.y > 0.4) s += 0.35 * Math.pow(n.y, 5);
    v.copy(n.multiplyScalar(1.15 * s));
  }), somaMat);
  scene.add(soma);
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), glassMat(0xa98bff, { rim: 0.5, base: 0.02 })); nucleus.position.set(-0.1, 0.05, 0.1); scene.add(nucleus);

  const primaries = [];
  function branch(start, dir, len, r, depth, primary) {
    const pts = [start.clone()]; let p = start.clone(); const d = dir.clone();
    for (let k = 1; k <= 4; k++) { d.add(randUnit().multiplyScalar(0.32)).normalize(); if (d.dot(dir) < 0.5) d.lerp(dir, 0.5).normalize(); p = p.clone().addScaledVector(d, len / 4); pts.push(p); }
    const curve = new THREE.CatmullRomCurve3(pts);
    scene.add(new THREE.Mesh(taperTube(curve, primary ? (u) => r * (1 - 0.45 * u) + 0.06 * Math.max(0, 1 - u / 0.15) : (u) => r * (1 - 0.45 * u), 28, 10), memMat));
    const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.55, 12, 8), memMat); cap.position.copy(p); scene.add(cap);
    if (primary) primaries.push(curve);
    if (depth > 0) for (let j = 0; j < 2; j++) branch(p, d.clone().add(randUnit().multiplyScalar(0.85)).normalize(), len * 0.72, r * 0.55, depth - 1, false);
  }
  const dirs = [];
  while (dirs.length < 7) { const d = randUnit(); if (d.x < 0.15 && dirs.every((o) => o.angleTo(d) > 0.7)) dirs.push(d); }
  dirs.forEach((d) => branch(d.clone().multiplyScalar(0.6), d, rand(3.1, 3.9), 0.22, 2, true)); // начало внутри сомы: торец трубки не выходит наружу

  const axon = new THREE.CatmullRomCurve3([V3(0.9, 0, 0), V3(2.6, 0.15, 0.1), V3(5.5, -0.3, -0.25), V3(8.6, 0.25, 0.2), V3(11.8, -0.2, -0.2), V3(15, 0.18, 0.08), V3(17.6, 0, 0)]);
  scene.add(new THREE.Mesh(taperTube(axon, (u) => (u < 0.05 ? 0.46 - 0.3 * (u / 0.05) : 0.16), 220, 14), memMat));

  const myelinMat = new THREE.MeshPhysicalMaterial({ color: 0xf1e7d6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.18, sheen: 0.6, sheenColor: new THREE.Color(0xffffff), transparent: true, opacity: 0.94, envMapIntensity: 0.9 });
  const nodeU = []; for (let u = 0.09; u <= 0.97; u += 0.11) nodeU.push(u);
  const nodes = nodeU.map((u) => axon.getPointAt(u));
  const myelin = new THREE.Group(); scene.add(myelin);
  const schwM = new THREE.MeshPhysicalMaterial({ color: 0x8a6ad0, roughness: 0.4, emissive: 0x2a1a50, emissiveIntensity: 0.5 }), SCHW = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i], b = nodes[i + 1], dir = b.clone().sub(a), dist = dir.length(); dir.normalize();
    const inner = Math.max(0.05, dist - 0.24 - 0.52);
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, inner, 10, 24), myelinMat);
    m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir); myelin.add(m);
    // каждый сегмент миелина — одна шванновская клетка; её ядро прижато к наружной поверхности
    const nrm = V3(0, 0.35, 1).addScaledVector(dir, -V3(0, 0.35, 1).dot(dir)).normalize(), sc = new THREE.Mesh(ell3(0.07, 0.22, 0.05, null, 16), schwM);
    sc.quaternion.setFromUnitVectors(V3(0, 1, 0), dir); sc.position.copy(m.position).addScaledVector(nrm, 0.25); sc.lookAt(sc.position.clone().add(nrm)); sc.rotateZ(0); { const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), dir); sc.quaternion.copy(q); const lz = V3(0, 0, 1).applyQuaternion(q); sc.quaternion.premultiply(new THREE.Quaternion().setFromUnitVectors(lz, nrm)); }
    myelin.add(sc); SCHW.push(sc.position.clone());
  }
  const ringMats = nodes.map(() => new THREE.MeshBasicMaterial({ color: 0x3a2a30 }));
  nodes.forEach((p, i) => {
    const t = axon.getTangentAt(nodeU[i]);
    // перехват: короткий поясок на голом аксоне (здесь сидят Na⁺-каналы), вспыхивает при импульсе
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.12, 24, 1, true), ringMats[i]);
    ring.position.copy(p); ring.quaternion.setFromUnitVectors(V3(0, 1, 0), t); scene.add(ring);
  });

  const end = axon.getPointAt(1), bMats = [];
  [V3(19.6, 1.3, 0.8), V3(19.9, -0.4, 1.3), V3(19.5, -1.4, -0.6), V3(19.8, 0.7, -1.3)].forEach((tip) => {
    const mid = end.clone().lerp(tip, 0.5).add(randUnit().multiplyScalar(0.3));
    const c = new THREE.CatmullRomCurve3([end.clone(), mid, tip]);
    scene.add(new THREE.Mesh(taperTube(c, (u) => 0.13 - 0.05 * u, 24, 8), memMat));
    const bm = memMat.clone(); bm.emissive = new THREE.Color(0xffb070); bm.emissiveIntensity = 0; bMats.push(bm);
    const bouton = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), bm); bouton.position.copy(tip); scene.add(bouton);
  });

  // electrode
  const probeI = 2, probeP = nodes[probeI];
  const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.05, 4, 10), new THREE.MeshPhysicalMaterial({ color: 0xbfd6ff, roughness: 0.1, transmission: 0.0, metalness: 0.6 }));
  needle.position.copy(probeP).add(V3(0, 2.16, -0.2)); needle.rotation.x = -0.1; scene.add(needle); // кончик на поверхности перехвата

  // drug cloud
  const lidoU = [0.5, 0.63];
  const lidoCloud = new Sparks(260, 0.22); scene.add(lidoCloud.obj);
  const lidoPts = []; for (let i = 0; i < 260; i++) { const u = rand(lidoU[0], lidoU[1]); lidoPts.push(axon.getPointAt(u).add(randUnit().multiplyScalar(rand(0.3, 1.1)))); }

  const sparks = new Sparks(2400, 0.16); scene.add(sparks.obj);
  const pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: 0xffb070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  pulse.scale.setScalar(2.2); pulse.visible = false; scene.add(pulse);
  const pulseLight = new THREE.PointLight(0xff9a50, 0, 6, 1.5); scene.add(pulseLight);

  const NA = new THREE.Color(0xff9f5a), K = new THREE.Color(0x6f9bff), INP = new THREE.Color(0xffe3a8);
  const st = { auto: true, myelin: true, lido: false, speed: 1, fires: [], nextAuto: 0.6, t: 0, ringFlash: nodes.map(() => -9), boutonFlash: -9, somaFlash: -9, delivered: 0, sent: 0, pend: [], trace: [] };

  function fire() { st.fires.push({ t0: st.t, last: -1, lastU: 0.09, dead: false, done: false, inputs: primaries.slice().sort(() => rnd() - 0.5).slice(0, 3) }); st.sent++; }
  const HILL = 0.42, STEP = 0.11, VEL = 0.2;

  function ionBurst(p, n, inward) {
    for (let k = 0; k < n; k++) {
      const d = randUnit(); const outer = p.clone().addScaledVector(d, 0.85);
      if (inward) sparks.spawn(outer, d.clone().multiplyScalar(-0.75 / 0.22), NA, 0.24, 0, 1.8);
      else st.pend.push({ t: st.t + 0.1 + rand(0, 0.06), f: () => sparks.spawn(p.clone().addScaledVector(d, 0.12), d.clone().multiplyScalar(0.75 / 0.3), K, 0.32, 0, 1.6) });
    }
  }
  function apShape(dt) {
    if (dt < -0.06) return -70;
    if (dt < 0) return -70 + 20 * Math.pow((dt + 0.06) / 0.06, 2);
    if (dt < 0.035) return -50 + 80 * Math.sin((Math.PI / 2) * dt / 0.035);
    if (dt < 0.13) return 30 - 110 * smooth(0, 1, (dt - 0.035) / 0.095);
    return -70 - 10 * Math.exp(-(dt - 0.13) / 0.12);
  }
  function probeV() {
    let v = -70;
    for (const f of st.fires) {
      const tp = f.t0 + HILL + (st.myelin ? probeI * STEP : (nodeU[probeI] - 0.09) / VEL);
      const d = st.t - tp; if (d > -0.07 && d < 0.8) v = Math.max(v, apShape(d)) + (v > -70 ? 0 : 0);
    }
    return v;
  }

  function update(dtReal) {
    const dt = dtReal * st.speed; st.t += dt;
    if (st.auto && st.t > st.nextAuto) { fire(); st.nextAuto = st.t + 1.9; }
    st.pend = st.pend.filter((e) => { if (st.t >= e.t) { e.f(); return false; } return true; });
    let pulseOn = false;
    for (const f of st.fires) {
      const tau = st.t - f.t0;
      if (tau < 0.36) {
        f.inputs.forEach((c, j) => {
          const u = 1 - clamp((tau - j * 0.04) / 0.3, 0, 1);
          if (u < 1 && u > 0) { const p = c.getPointAt(u); sparks.spawn(p, randUnit().multiplyScalar(0.05), INP, 0.25, 0, 1.4); }
        });
      }
      if (tau >= 0.36 && tau < 0.42) st.somaFlash = st.t;
      const a = tau - HILL; if (a < 0 || f.done) continue;
      let u;
      if (st.myelin) {
        const i = Math.floor(a / STEP), fr = a / STEP - i;
        if (i >= nodes.length - 1) { u = 1; } else u = lerp(nodeU[i], nodeU[i + 1], smooth(0.55, 1, fr));
        if (i !== f.last && i < nodes.length) {
          if (st.lido && nodeU[i] >= lidoU[0]) { f.dead = true; f.done = true; continue; }
          f.last = i; st.ringFlash[i] = st.t; ionBurst(nodes[i], 16, true); ionBurst(nodes[i], 14, false);
        }
      } else {
        u = 0.09 + a * VEL;
        if (st.lido && u >= lidoU[0]) { f.dead = true; f.done = true; continue; }
        if (u - f.lastU > 0.02 && u < 1) {
          f.lastU = u; const p = axon.getPointAt(u); ionBurst(p, 5, true); ionBurst(p, 4, false);
          const ni = nodeU.findIndex((x) => Math.abs(x - u) < 0.02); if (ni >= 0) st.ringFlash[ni] = st.t;
        }
      }
      if (u >= 1) { f.done = true; st.boutonFlash = st.t; st.delivered++; continue; }
      pulseOn = true; const p = axon.getPointAt(Math.min(u, 1));
      pulse.position.copy(p); pulseLight.position.copy(p);
      if (!st.myelin || Math.random() < 0.5) sparks.spawn(p, randUnit().multiplyScalar(0.15), NA, 0.35, 2, 0.9);
    }
    st.fires = st.fires.filter((f) => st.t - f.t0 < 6);
    pulse.visible = pulseOn; pulseLight.intensity = pulseOn ? 9 : 0;
    nodes.forEach((p, i) => { const k = Math.exp(-(st.t - st.ringFlash[i]) / 0.18); ringMats[i].color.setRGB(0.23 + 1.8 * k, 0.16 + 1.0 * k, 0.19 + 0.35 * k); });
    somaMat.emissiveIntensity = 1.6 * Math.exp(-(st.t - st.somaFlash) / 0.2);
    bMats.forEach((m) => { m.emissiveIntensity = 2.2 * Math.exp(-(st.t - st.boutonFlash) / 0.3); });
    myelin.visible = st.myelin;
    // drug cloud
    if (st.lido) { for (let i = 0; i < 3; i++) { const p = lidoPts[Math.floor(rand(0, lidoPts.length))]; lidoCloud.spawn(p, randUnit().multiplyScalar(0.08), new THREE.Color(0xbfc6d6), 1.6, 0, 0.55); } }
    lidoCloud.update(dtReal); sparks.update(dt);
    const v = probeV(); st.v = v; st.trace.push([st.t, v]); while (st.trace.length && st.trace[0][0] < st.t - 2.6) st.trace.shift();
  }

  function drawScope(ctx, w, hgt) {
    ctx.clearRect(0, 0, w, hgt);
    const y = (v) => 10 + (40 - v) / 130 * (hgt - 22), x = (t) => 8 + (1 - (st.t - t) / 2.6) * (w - 16);
    ctx.lineWidth = 1; ctx.strokeStyle = '#2A2630';
    [30, 0, -70].forEach((v) => { ctx.beginPath(); ctx.moveTo(8, y(v)); ctx.lineTo(w - 8, y(v)); ctx.stroke(); });
    ctx.setLineDash([4, 4]); ctx.strokeStyle = '#8f7a3a'; ctx.beginPath(); ctx.moveTo(8, y(-50)); ctx.lineTo(w - 8, y(-50)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#FFB070'; ctx.lineWidth = 2; ctx.beginPath();
    st.trace.forEach(([t, v], i) => (i ? ctx.lineTo(x(t), y(v)) : ctx.moveTo(x(t), y(v)))); ctx.stroke();
    ctx.fillStyle = '#A49DA8'; ctx.font = '500 10px JetBrains Mono, monospace';
    ctx.fillText('+30', 10, y(30) - 3); ctx.fillText('−70 мВ', 10, y(-70) - 3); ctx.fillStyle = '#c9a74a'; ctx.fillText('порог', w - 46, y(-50) - 3);
  }

  const labels = [
    { text: 'тело нейрона', pos: V3(-0.6, 1.5, 0.6) },
    { text: 'дендриты', pos: V3(-3.4, 2.4, 0) },
    { text: 'аксонный холмик', pos: V3(1.4, -0.75, 0.3) },
    { text: 'миелин', pos: axon.getPointAt(0.37).add(V3(0, 0.6, 0.2)), show: () => st.myelin },
    { text: 'перехват Ранвье', pos: nodes[5].clone().add(V3(0, -0.55, 0)) },
    { text: 'шванновская клетка', pos: SCHW[2].clone().add(V3(0, 0.12, 0.1)), show: () => st.myelin },
    { text: 'начальный сегмент', pos: axon.getPointAt(0.05).add(V3(-0.3, 0.45, 0.15)) },
    { text: 'электрод', pos: probeP.clone().add(V3(0.25, 3.6, 0.3)) },
    { text: 'лидокаин', pos: axon.getPointAt(0.565).add(V3(0, 1.3, 0)), show: () => st.lido },
    { text: 'окончания аксона', pos: V3(19.8, 1.9, 0.6) },
  ];

  let uiRefs = {};
  function ui(el) {
    const auto = toggle('Авто', () => st.auto, (v) => { st.auto = v; st.nextAuto = st.t + 0.3; });
    const mye = toggle('Миелин', () => st.myelin, (v) => { st.myelin = v; st.fires = []; });
    const lido = toggle('Лидокаин', () => st.lido, (v) => { st.lido = v; });
    const sp = seg([{ id: 0.25, label: '¼×' }, { id: 0.5, label: '½×' }, { id: 1, label: '1×' }], () => st.speed, (v) => { st.speed = v; });
    uiRefs = { auto, mye, lido, sp };
    el.append(
      group('Импульс', 'пробел · A', button('Запустить', fire, true), auto),
      group('Аксон', 'M · L', mye, lido),
      group('Скорость', ', .', sp),
      h('div', { class: 'grp', style: 'flex:1 1 260px' }, h('div', { class: 'glabel' }, 'Что видно'),
        h('div', { class: 'info', html: 'Сигналы с дендритов (жёлтые) сходятся к телу. У холмика рождается импульс: в перехватах входит <b style="color:#ff9f5a">Na⁺</b>, следом выходит <b style="color:#7aa7ff">K⁺</b>.' })),
    );
  }
  function onKey(e) {
    if (e.code === 'Space') { fire(); return true; }
    const k = e.key.toLowerCase();
    if (k === 'a' || k === 'ф') { uiRefs.auto.click(); return true; }
    if (k === 'm' || k === 'ь') { uiRefs.mye.click(); return true; }
    if (k === 'l' || k === 'д') { uiRefs.lido.click(); return true; }
    if (e.code === 'Comma' || e.code === 'Period') { const s = [0.25, 0.5, 1]; let i = s.indexOf(st.speed); i = clamp(i + (e.code === 'Period' ? 1 : -1), 0, 2); st.speed = s[i]; uiRefs.sp.sync(); return true; }
    return false;
  }
  function stats() {
    return [
      ['Электрод', Math.round(st.v ?? -70), 'мВ'],
      ['Проведение', st.myelin ? 'скачками' : 'сплошное', ''],
      ['Дошло', `${st.delivered}/${st.sent}`, ''],
    ];
  }
  return {
    scene, camera, controls, update, ui, onKey, stats, labels, drawScope, accent: '#FFB070',
    kicker: 'Мозг · нервный импульс', title: 'Нейрон и импульс',
    lede: 'Дендриты собирают сигналы, у аксонного холмика рождается потенциал действия, и импульс скачками бежит по миелину к окончаниям.',
    notes: `
      <div><h2>Как это работает</h2>
        <p>В покое внутри нейрона около <b>−70 мВ</b>. Этот заряд держат Na⁺/K⁺-насос и калиевые каналы утечки.</p>
        <p>Сигналы с дендритов суммируются на теле клетки. Если у <b>аксонного холмика</b> заряд дошёл до порога (около −55…−50 мВ), открываются быстрые Na⁺-каналы и запускается <b>потенциал действия</b>: натрий входит, заряд взлетает до +30 мВ, затем выходит калий и возвращает минус.</p>
        <h3>Зачем миелин</h3>
        <p>Миелин — изоляция из глиальных клеток. Каналы собраны в <b>перехватах Ранвье</b>, и импульс перепрыгивает от перехвата к перехвату. Выключите миелин: импульс поползёт сплошной волной в несколько раз медленнее.</p>
        <h3>Местная анестезия</h3>
        <p><b>Лидокаин</b> и новокаин закупоривают Na⁺-каналы. В обработанном участке импульс гаснет, и сигнал боли не доходит до мозга.</p></div>
      <div><h2>Что здесь настоящее</h2><ul>
        <li>Форма потенциала на электроде: −70 → +30 → −80 мВ, порог около −55…−50 мВ.</li>
        <li>Порядок событий: суммирование, холмик, вход Na⁺, выход K⁺.</li>
        <li>Скачкообразное проведение и блок натриевых каналов.</li></ul>
        <h2 style="margin-top:22px">Условности</h2><ul>
        <li>Время замедлено примерно в тысячу раз.</li>
        <li>Ионы нарисованы огромными, аксон сильно укорочен.</li></ul></div>
      <div class="keys"><h2>Клавиши</h2><ul>
        <li><code>пробел</code> импульс</li><li><code>A</code> авто</li><li><code>M</code> миелин</li><li><code>L</code> лидокаин</li><li><code>,</code> <code>.</code> скорость</li><li>мышь: вращать, колесо: приблизить</li></ul></div>`,
  };
}
export { makeNeuron };
