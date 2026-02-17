/* ─── Game Logic / UI Functions ─────────────────────────────── */

/* Player takes damage */
function playerHit(dmg) {
  if (!GS.running) return;

  GS.health = Math.max(0, GS.health - dmg);

  var bar = $('health-bar');
  if (bar) {
    bar.style.width = GS.health + '%';
    bar.style.background =
      GS.health < 30
        ? 'linear-gradient(90deg,#f00,#f44)'
        : GS.health < 60
        ? 'linear-gradient(90deg,#f60,#f90)'
        : 'linear-gradient(90deg,#f24,#f68)';
  }

  sndHit();
  flashEl($('hit-flash'), 250);

  if (GS.health <= 0) {
    doGameOver();
  }
}

/* When enemy destroyed */
function onKill(pts) {
  GS.score += pts;
  GS.killCount++;

  var sv = $('score-val');
  if (sv) sv.textContent = GS.score;

  if (GS.killCount >= GS.killsNeeded) {
    GS.killCount = 0;
    GS.wave++;

    var wv = $('wave-val');
    if (wv) wv.textContent = GS.wave;

    setTimeout(function () {
      waveAnnounce(GS.wave);
      spawnWave();
    }, 1400);
  }
}

/* Remove enemy */
function destroyEnemy(el) {
  GS.enemies = GS.enemies.filter(function (r) {
    return r.el !== el;
  });

  safeRemove(el);
}

/* Wave announce text */
function waveAnnounce(w) {
  var el = $('wave-announce');
  if (!el) return;

  el.textContent = w === 1 ? '⚡  ENGAGE!' : '— WAVE ' + w + ' —';
  el.style.display = 'block';
  el.style.opacity = '1';

  setTimeout(function () {
    el.style.opacity = '0';
    setTimeout(function () {
      el.style.display = 'none';
    }, 450);
  }, 1600);
}

/* Game Over */
function doGameOver() {
  if (!GS.running) return;

  GS.running = false;
  clearInterval(GS.tickId);

  if (document.exitPointerLock) {
    document.exitPointerLock();
  }

  [
    'hud',
    'crosshair',
    'health-wrap',
    'controls-legend',
    'wave-announce',
    'lock-prompt'
  ].forEach(function (id) {
    var e = $(id);
    if (e) e.style.display = 'none';
  });

  $('final-score').textContent = GS.score.toLocaleString();
  $('wave-reached').textContent = 'WAVE ' + GS.wave + ' REACHED';

  $('gameover-screen').style.display = 'flex';
}
