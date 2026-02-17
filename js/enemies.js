/* ─── Enemy spawning ──────────────────────────────────────────── */

function spawnWave() {
  if (!GS.running) return;

  var count = 4 + GS.wave * 2;
  GS.killsNeeded = count;
  GS.killCount = 0;

  var spd = 0.014 + GS.wave * 0.003;
  var gap = Math.max(350, 1200 - GS.wave * 60);

  for (var i = 0; i < count; i++) {
    (function (idx) {
      setTimeout(function () {
        if (!GS.running) return;
        var t = (GS.wave >= 3 && Math.random() < 0.28) ? 'bomber' : 'fighter';
        spawnEnemy(t, spd);
      }, idx * gap);
    })(i);
  }
}

/* Build spaceship from primitives */
function spawnEnemy(type, speed) {
  var cont = $('enemy-container');
  if (!cont) return;

  var root = document.createElement('a-entity');

  var x = randF(-10, 10),
      y = randF(-5, 5),
      z = GS.pz - randF(18, 38);

  root.setAttribute(
    'position',
    x.toFixed(2) + ' ' + y.toFixed(2) + ' ' + z.toFixed(2)
  );

  if (type === 'bomber') {

    var body = document.createElement('a-cylinder');
    body.setAttribute('radius', '1.4');
    body.setAttribute('height', '0.55');
    body.setAttribute('material', 'color:#cc2200;emissive:#660a00;emissiveIntensity:0.7');
    root.appendChild(body);

    var dome = document.createElement('a-sphere');
    dome.setAttribute('radius', '0.75');
    dome.setAttribute('material', 'color:#991a00;emissive:#440900;emissiveIntensity:0.6');
    dome.setAttribute('position', '0 0.35 0');
    root.appendChild(dome);

    var eng = document.createElement('a-torus');
    eng.setAttribute('radius', '1.0');
    eng.setAttribute('radius-tubular', '0.12');
    eng.setAttribute('material', 'color:#ff4400;emissive:#ff2200;emissiveIntensity:1.5;shader:flat');
    eng.setAttribute('position', '0 -0.22 0');
    eng.setAttribute('rotation', '90 0 0');
    root.appendChild(eng);

    var gl = document.createElement('a-sphere');
    gl.setAttribute('radius', '0.4');
    gl.setAttribute('material', 'color:#00ddff;emissive:#00aaff;emissiveIntensity:3;shader:flat');
    gl.setAttribute('position', '0 -0.4 0');
    root.appendChild(gl);

    [-1.3, 1.3].forEach(function (ox) {
      var pod = document.createElement('a-cylinder');
      pod.setAttribute('radius', '0.2');
      pod.setAttribute('height', '0.6');
      pod.setAttribute('material', 'color:#aa1100;emissive:#440500;emissiveIntensity:0.5');
      pod.setAttribute('rotation', '0 0 90');
      pod.setAttribute('position', ox + ' 0 0.1');
      root.appendChild(pod);
    });

  } else {

    var fus = document.createElement('a-box');
    fus.setAttribute('width', '0.55');
    fus.setAttribute('height', '0.35');
    fus.setAttribute('depth', '2.4');
    fus.setAttribute('material', 'color:#1144cc;emissive:#060d3a;emissiveIntensity:0.6');
    root.appendChild(fus);

    var nose = document.createElement('a-cone');
    nose.setAttribute('radius-bottom', '0.28');
    nose.setAttribute('radius-top', '0.02');
    nose.setAttribute('height', '1.1');
    nose.setAttribute('material', 'color:#0033bb;emissive:#010d33;emissiveIntensity:0.5');
    nose.setAttribute('position', '0 0 -1.75');
    nose.setAttribute('rotation', '-90 0 0');
    root.appendChild(nose);

    var wL = document.createElement('a-box');
    wL.setAttribute('width', '2.6');
    wL.setAttribute('height', '0.07');
    wL.setAttribute('depth', '1.0');
    wL.setAttribute('material', 'color:#0d2d88;emissive:#040f33;emissiveIntensity:0.4');
    wL.setAttribute('position', '0 0 0.4');
    root.appendChild(wL);

    var wsL = document.createElement('a-box');
    wsL.setAttribute('width', '1.8');
    wsL.setAttribute('height', '0.06');
    wsL.setAttribute('depth', '0.5');
    wsL.setAttribute('material', 'color:#1133aa;emissive:#050e3a;emissiveIntensity:0.4');
    wsL.setAttribute('position', '0 0.05 -0.4');
    wsL.setAttribute('rotation', '0 15 0');
    root.appendChild(wsL);

    [-0.6, 0.6].forEach(function (ox) {
      var nac = document.createElement('a-cylinder');
      nac.setAttribute('radius', '0.18');
      nac.setAttribute('height', '0.9');
      nac.setAttribute('material', 'color:#0a1d66;emissive:#030a22;emissiveIntensity:0.5');
      nac.setAttribute('rotation', '90 0 0');
      nac.setAttribute('position', ox + ' 0 0.85');
      root.appendChild(nac);

      var eg = document.createElement('a-sphere');
      eg.setAttribute('radius', '0.16');
      eg.setAttribute('material', 'color:#00ccff;emissive:#0099ff;emissiveIntensity:3.5;shader:flat');
      eg.setAttribute('position', ox + ' 0 1.35');
      root.appendChild(eg);
    });

    var ck = document.createElement('a-sphere');
    ck.setAttribute('radius', '0.18');
    ck.setAttribute('material', 'color:#66aaff;emissive:#2255cc;emissiveIntensity:1;shader:flat');
    ck.setAttribute('position', '0 0.22 -0.6');
    root.appendChild(ck);

    [-1.3, 1.3].forEach(function (ox) {
      var tip = document.createElement('a-sphere');
      tip.setAttribute('radius', '0.09');
      tip.setAttribute('material', 'color:#ff3300;emissive:#ff1100;emissiveIntensity:3;shader:flat');
      tip.setAttribute('position', ox + ' 0.04 0.4');
      root.appendChild(tip);
    });

  }

  var zz = GS.wave > 2 ? randF(0, 0.008 * (GS.wave - 2)) : 0;

  root.setAttribute(
    'enemy-ship',
    'speed:' + speed.toFixed(4) +
    ';zigzag:' + zz.toFixed(4) +
    ';phase:' + randF(0, 6.28).toFixed(2)
  );

  GS.enemies.push({
    el: root,
    radius: type === 'bomber' ? 2.2 : 1.6,
    points: (type === 'bomber' ? 150 : 100) * GS.wave
  });

  cont.appendChild(root);
}

/* ─── Enemy return fire ───────────────────────────────────────── */

function enemyFireTick() {
  if (!GS.running || GS.enemies.length === 0) return;
  if (Math.random() > 0.32 + GS.wave * 0.04) return;

  var rec = GS.enemies[Math.floor(Math.random() * GS.enemies.length)];
  if (!rec || !rec.el || !rec.el.parentNode) return;

  var cont = $('expl-container');
  if (!cont) return;

  var pos = rec.el.object3D.position;

  var dx = GS.px - pos.x,
      dy = GS.py - pos.y,
      dz = GS.pz - pos.z;

  var len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  var spd = (0.40 + GS.wave * 0.03) * 60;

  var bolt = document.createElement('a-sphere');
  bolt.setAttribute('radius', '0.16');
  bolt.setAttribute('material', 'color:#ff0055;emissive:#ff0055;emissiveIntensity:3;shader:flat');
  bolt.setAttribute(
    'position',
    pos.x.toFixed(2) + ' ' +
    pos.y.toFixed(2) + ' ' +
    pos.z.toFixed(2)
  );

  bolt.setAttribute(
    'enemy-bolt',
    'vx:' + (dx / len * spd).toFixed(4) +
    ';vy:' + (dy / len * spd).toFixed(4) +
    ';vz:' + (dz / len * spd).toFixed(4)
  );

  cont.appendChild(bolt);
}
