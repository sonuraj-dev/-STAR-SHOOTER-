function $(id) { return document.getElementById(id); }
function randF(a, b) { return Math.random() * (b - a) + a; }
function safeRemove(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

function flashEl(el, ms) {
  if (!el) return;
  el.style.opacity = '1';
  setTimeout(function () { el.style.opacity = '0'; }, ms || 150);
}
