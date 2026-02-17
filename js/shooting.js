/* ─── Explosion FX ────────────────────────────────────────────── */

function doExplosion(x, y, z) {
  sndBoom();

  var cont = $('expl-container');
  if (!cont) return;

  for (var i = 0; i < 14; i++) {
    (function () {
      var sp = document.createElement('a-sphere');

      sp.setAttribute('radius', randF(0.07, 0.25).toFixed(2));

      var col = Math.random() < 0.5 ? '#ff6600' : '#ffdd00';

      sp.setAttribute(
        'material',
        'color:' + col +
        ';emissive:' + col +
        ';emissiveIntensity:2.8;shader:flat;transparent:true'
      );

      sp.setAttribute('position', x + ' ' + y + ' ' + z);

      var vx = randF(-2.5, 2.5),
          vy = randF(-2.5, 2.5),
          vz = randF(-2.5, 2.5);

      sp.setAttribute(
        'animation',
        'property:position;to:' +
        (x + vx) + ' ' +
        (y + vy) + ' ' +
        (z + vz) +
        ';dur:480;easing:easeOutQuad'
      );

      sp.setAttribute(
        'animation__op',
        'property:material.opacity;from:1;to:0;dur:480;easing:easeInQuad'
      );

      cont.appendChild(sp);

      setTimeout(function () {
        safeRemove(sp);
      }, 520);

    })();
  }

  var ring = document.createElement('a-torus');

  ring.setAttribute('radius', '0.7');
  ring.setAttribute('radius-tubular', '0.1');

  ring.setAttribute(
    'material',
    'color:#ff8800;emissive:#ff6600;emissiveIntensity:2.5;shader:flat;transparent:true'
  );

  ring.setAttribute('position', x + ' ' + y + ' ' + z);

  ring.setAttribute(
    'animation',
    'property:scale;from:0.1 0.1 0.1;to:6 6 6;dur:320;easing:easeOutQuad'
  );

  ring.setAttribute(
    'animation__op',
    'property:material.opacity;from:1;to:0;dur:320'
  );

  cont.appendChild(ring);

  setTimeout(function () {
    safeRemove(ring);
  }, 350);
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
  b.setAttribute(
    'material',
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

  mf.setAttribute(
    'material',
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

  setTimeout(function () {
    safeRemove(mf);
  }, 130);
}
