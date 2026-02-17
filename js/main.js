window.addEventListener('DOMContentLoaded', function () {

 
  'use strict';

  /* ── Menu screen animated starfield ─────────────────────────── */
  var cvs = $('bg-canvas'),
      ctx2 = cvs.getContext('2d');

  var bW, bH, bArr = [];

  function resizeBg() {
    bW = cvs.width = innerWidth;
    bH = cvs.height = innerHeight;
    bArr = [];

    for (var i = 0; i < 220; i++) {
      bArr.push({
        x: Math.random() * bW,
        y: Math.random() * bH,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 0.38 + 0.08
      });
    }
  }

  resizeBg();
  window.addEventListener('resize', resizeBg);

  (function loopBg() {
    ctx2.clearRect(0, 0, bW, bH);

    bArr.forEach(function (s) {
      s.a += s.s * 0.013;
      var al = (Math.sin(s.a) + 1) / 2 * 0.78;

      ctx2.beginPath();
      ctx2.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx2.fillStyle = 'rgba(200,216,255,' + al + ')';
      ctx2.fill();
    });

    requestAnimationFrame(loopBg);
  })();

  /* ── Build parallax space stars ──────────────────────────────── */
  function buildStars() {
    var cont = $('stars-container');
    while (cont.firstChild) cont.removeChild(cont.firstChild);

    for (var i = 0; i < 500; i++) {
      var s = document.createElement('a-sphere');
      var big = Math.random() < 0.04;
      var r = big ? randF(0.08, 0.16) : randF(0.02, 0.06);
      var col = Math.random() < 0.1
        ? (Math.random() < 0.5 ? '#8899ff' : '#ffddaa')
        : '#ffffff';

      s.setAttribute('radius', r.toFixed(3));
      s.setAttribute('material',
        'color:' + col +
        ';emissive:' + col +
        ';emissiveIntensity:1;shader:flat'
      );

      s.setAttribute(
        'position',
        randF(-170, 170).toFixed(1) + ' ' +
        randF(-120, 120).toFixed(1) + ' ' +
        (-randF(8, 260)).toFixed(1)
      );

      s.setAttribute('bg-star', 'speed:' + randF(0.2, 1.1).toFixed(2));
      cont.appendChild(s);
    }
  }

  /* ── Shoot ───────────────────────────────────────────────────── */
  function shoot() {
    sndLaser();
    flashEl($('shoot-flash'), 60);

    var cont = $('expl-container');
    if (!cont) return;

    var cy = Math.cos(GS.yaw),
        sy = Math.sin(GS.yaw),
        cp = Math.cos(GS.pitch),
        sp = Math.sin(GS.pitch);

    var spd = 28;

    var vx = -sy * cp * spd;
    var vy =  sp * spd;
    var vz = -cy * cp * spd;

    var ox = GS.px - sy * 1.2;
    var oy = GS.py + sp * 1.2;
    var oz = GS.pz - cy * 1.2;

    var b = document.createElement('a-sphere');
    b.setAttribute('radius', '0.14');
    b.setAttribute('material',
      'color:#ff5500;emissive:#ff8800;emissiveIntensity:2.8;shader:flat'
    );
    b.setAttribute(
      'position',
      ox.toFixed(2) + ' ' +
      oy.toFixed(2) + ' ' +
      oz.toFixed(2)
    );
    b.setAttribute(
      'player-bullet',
      'vx:' + vx.toFixed(3) +
      ';vy:' + vy.toFixed(3) +
      ';vz:' + vz.toFixed(3)
    );

    cont.appendChild(b);

    var mf = document.createElement('a-torus');
    mf.setAttribute('radius', '0.22');
    mf.setAttribute('radius-tubular', '0.035');
    mf.setAttribute('material',
      'color:#ff9900;emissive:#ff7700;emissiveIntensity:2;shader:flat;transparent:true'
    );
    mf.setAttribute(
      'position',
      ox.toFixed(2) + ' ' +
      oy.toFixed(2) + ' ' +
      (oz - 0.2).toFixed(2)
    );
    mf.setAttribute(
      'animation',
      'property:scale;from:1 1 1;to:2.5 2.5 2.5;dur:110;easing:easeOutQuad'
    );
    mf.setAttribute(
      'animation__op',
      'property:material.opacity;from:1;to:0;dur:110'
    );

    cont.appendChild(mf);

    setTimeout(function () { safeRemove(mf); }, 130);
  }

  /* ── Pointer Lock ───────────────────────────────────────────── */
  function requestLock() {
    var scene = document.getElementById('main-scene');
    var target = (scene && scene.canvas) || document.body;
    if (target.requestPointerLock) target.requestPointerLock();
  }

  document.addEventListener('pointerlockchange', function () {
    GS.locked = (document.pointerLockElement != null);
    var lp = $('lock-prompt');
    if (lp) lp.style.display = (!GS.locked && GS.running) ? 'block' : 'none';
  });

  document.addEventListener('mousemove', function (e) {
    if (!GS.running) return;

    if (GS.locked) {
      GS.yaw -= e.movementX * GS.sens;
      GS.pitch -= e.movementY * GS.sens;
    } else {
      var cx = innerWidth / 2,
          cy = innerHeight / 2;

      GS.yaw = -(e.clientX - cx) / cx * 0.9;
      GS.pitch = -(e.clientY - cy) / cy * 0.65;
    }

    GS.pitch = Math.max(-1.1, Math.min(1.1, GS.pitch));
  });

  /* ── Start / Restart ─────────────────────────────────────────── */
  function startGame() {
    GS.running = false;
    GS.health = 100;
    GS.score = 0;
    GS.wave = 1;
    GS.killCount = 0;
    GS.killsNeeded = 6;
    GS.enemies = [];
    GS.keys = {};
    GS.px = 0;
    GS.py = 0;
    GS.pz = 0;
    GS.yaw = 0;
    GS.pitch = 0;

    clearInterval(GS.tickId);

    $('score-val').textContent = '0';
    $('wave-val').textContent = '1';

    var bar = $('health-bar');
    bar.style.width = '100%';
    bar.style.background = 'linear-gradient(90deg,#ff2244,#ff6688)';

    ['enemy-container', 'expl-container', 'stars-container']
      .forEach(function (id) {
        var el = $(id);
        if (el) while (el.firstChild) el.removeChild(el.firstChild);
      });

    var rig = $('cam-rig');
    if (rig && rig.object3D) {
      rig.object3D.position.set(0, 0, 0);
      rig.object3D.rotation.set(0, 0, 0);
    }

    $('start-screen').style.display = 'none';
    $('gameover-screen').style.display = 'none';
    $('hud').style.display = 'block';
    $('crosshair').style.display = 'block';
    $('health-wrap').style.display = 'block';
    $('controls-legend').style.display = 'block';

    buildStars();
    GS.running = true;

    requestLock();
    $('lock-prompt').style.display = 'block';

    GS.tickId = setInterval(function () {
      if (GS.running) enemyFireTick();
    }, 480);

    setTimeout(function () {
      waveAnnounce(1);
      spawnWave();
    }, 900);
  }

  /* ── Events ───────────────────────────────────────────────────── */
  $('play-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    startGame();
  });

  $('replay-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    startGame();
  });

  document.addEventListener('keydown', function (e) {
    GS.keys[e.key.toLowerCase()] = true;
    GS.keys[e.key] = true;

    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      .indexOf(e.key) > -1) {
      e.preventDefault();
    }
  });

  document.addEventListener('keyup', function (e) {
    GS.keys[e.key.toLowerCase()] = false;
    GS.keys[e.key] = false;
  });

  document.addEventListener('click', function (e) {
    if (!GS.running) return;

    if (e.target.tagName === 'BUTTON' ||
        (e.target.closest && e.target.closest('button'))) {
      return;
    }

    if (!GS.locked) requestLock();
    shoot();
  });

  document.addEventListener('triggerdown', function () {
    if (GS.running) shoot();
  });

  var rh = $('right-hand');
  if (rh) {
    rh.addEventListener('triggerdown', function () {
      if (GS.running) shoot();
    });
  }

})();






