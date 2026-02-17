/* ══════════════════════════════════════════════════════════════
   A-FRAME COMPONENTS
══════════════════════════════════════════════════════════════ */

/* player-rig: handles WASD movement + mouse-aim for the camera rig */
AFRAME.registerComponent('player-rig', {
  tick: function (time, dt) {
    if (!GS.running) return;
    var s = (dt || 16) * 0.001;
    var speed = 4.5;

    var mx = 0, my = 0, mz = 0;
    if (GS.keys['a'] || GS.keys['ArrowLeft']) mx = -1;
    if (GS.keys['d'] || GS.keys['ArrowRight']) mx = 1;
    if (GS.keys['w'] || GS.keys['ArrowUp']) mz = -0.4;
    if (GS.keys['s'] || GS.keys['ArrowDown']) my = -1;
    if (GS.keys[' ']) my = 1;
    if (GS.keys['Shift']) my = -1;

    var cy = Math.cos(GS.yaw), sy = Math.sin(GS.yaw);
    var wx = mx * cy - mz * sy;
    var wz = mx * sy + mz * cy;

    GS.px += wx * speed * s;
    GS.py += my * speed * s;
    GS.pz += wz * speed * s;

    GS.px = Math.max(-14, Math.min(14, GS.px));
    GS.py = Math.max(-8, Math.min(8, GS.py));
    GS.pz = Math.max(-4, Math.min(4, GS.pz));

    var rig = this.el;
    rig.object3D.position.set(GS.px, GS.py, GS.pz);

    rig.object3D.rotation.order = 'YXZ';
    rig.object3D.rotation.y = GS.yaw;
    rig.object3D.rotation.x = GS.pitch;
  }
});

/* bg-star: parallax starfield */
AFRAME.registerComponent('bg-star', {
  schema: { speed: { default: 0.5 } },
  tick: function () {
    if (!GS.running) return;
    var p = this.el.object3D.position;
    var thrust = GS.keys['w'] || GS.keys['ArrowUp'];
    p.z += this.data.speed * (thrust ? 1.8 : 0.3);
    if (p.z > GS.pz + 6) {
      p.z = GS.pz - 260;
      p.x = (Math.random() - 0.5) * 180;
      p.y = (Math.random() - 0.5) * 130;
    }
  }
});

/* enemy-ship: flies toward the player's current position */
AFRAME.registerComponent('enemy-ship', {
  schema: { speed: { default: 0.02 }, zigzag: { default: 0 }, phase: { default: 0 } },
  init: function () { this._t = 0; },
  tick: function (time, dt) {
    if (!GS.running) return;
    this._t += (dt || 16) * 0.001;
    var p = this.el.object3D.position;

    var dx = GS.px - p.x, dy = GS.py - p.y, dz = GS.pz - p.z;
    var len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

    p.z += this.data.speed;
    p.x += (dx / len) * this.data.speed * 0.35;
    p.y += (dy / len) * this.data.speed * 0.35;

    if (this.data.zigzag > 0)
      p.x += Math.sin(this._t * 2.4 + this.data.phase) * this.data.zigzag;

    this.el.object3D.lookAt(
      2 * p.x - GS.px,
      2 * p.y - GS.py,
      2 * p.z - GS.pz
    );

    if (p.z > GS.pz + 2.5) {
      playerHit(20);
      destroyEnemy(this.el);
    }
  }
});

/* player-bullet */
AFRAME.registerComponent('player-bullet', {
  schema: { vx: { default: 0 }, vy: { default: 0 }, vz: { default: -1 } },
  tick: function (time, dt) {
    if (!GS.running) { safeRemove(this.el); return; }
    var s = (dt || 16) * 0.001;
    var p = this.el.object3D.position;

    var ox = p.x, oy = p.y, oz = p.z;

    p.x += this.data.vx * s;
    p.y += this.data.vy * s;
    p.z += this.data.vz * s;

    if (p.z < GS.pz - 350) { safeRemove(this.el); return; }

    for (var i = GS.enemies.length - 1; i >= 0; i--) {
      var rec = GS.enemies[i];
      if (!rec.el || !rec.el.parentNode) { GS.enemies.splice(i, 1); continue; }
      var ep = rec.el.object3D.position;
      var r = rec.radius;

      var tx = p.x - ox, ty = p.y - oy, tz = p.z - oz;
      var ex = ep.x - ox, ey = ep.y - oy, ez = ep.z - oz;
      var tlen2 = tx * tx + ty * ty + tz * tz;
      var t2 = tlen2 > 0.0001 ? Math.min(1, Math.max(0, (ex * tx + ey * ty + ez * tz) / tlen2)) : 0;
      var cx2 = ox + tx * t2 - ep.x;
      var cy2 = oy + ty * t2 - ep.y;
      var cz2 = oz + tz * t2 - ep.z;
      var d2 = cx2 * cx2 + cy2 * cy2 + cz2 * cz2;

      if (d2 < r * r) {
        doExplosion(ep.x, ep.y, ep.z);
        onKill(rec.points);
        destroyEnemy(rec.el);
        safeRemove(this.el);
        return;
      }
    }
  }
});

/* enemy-bolt */
AFRAME.registerComponent('enemy-bolt', {
  schema: { vx: { default: 0 }, vy: { default: 0 }, vz: { default: 0 } },
  tick: function (time, dt) {
    if (!GS.running) { safeRemove(this.el); return; }
    var s = (dt || 16) * 0.001;
    var p = this.el.object3D.position;

    p.x += this.data.vx * s;
    p.y += this.data.vy * s;
    p.z += this.data.vz * s;

    var dx = p.x - GS.px, dy = p.y - GS.py, dz = p.z - GS.pz;
    if (dx * dx + dy * dy + dz * dz < 1.8 * 1.8) {
      playerHit(8 + GS.wave * 2);
      safeRemove(this.el);
      return;
    }

    if (p.z > GS.pz + 8 || p.z < GS.pz - 300)
      safeRemove(this.el);
  }
});
