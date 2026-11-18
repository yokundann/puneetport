(() => {
'use strict';
/* Fill these in. Empty values stay hidden. */
const CONFIG = { email: '', linkedin: '', github: '' };

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement, body = document.body;

/* Theme */
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
$('#theme').onclick = () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = t;
  try { localStorage.setItem('theme', t); } catch (e) {}
};

/* Contact links */
[['c-mail', CONFIG.email && 'mailto:' + CONFIG.email], ['c-in', CONFIG.linkedin], ['c-gh', CONFIG.github]].forEach(([id, href]) => {
  const a = document.getElementById(id); if (href) { a.href = href; a.hidden = false; }
});

/* Split headings into masked words */
$$('.split').forEach(el => {
  let i = 0;
  el.style.setProperty('--d', (el.dataset.delay || 0) + 'ms');
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(p => {
        if (!p.trim()) { f.append(p); return; }
        const w = document.createElement('span'), s = document.createElement('span');
        w.className = 'w'; s.className = 'wi'; s.style.setProperty('--i', i++); s.textContent = p; w.append(s); f.append(w);
      });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
  });
  walk(el);
});

/* Loader */
const msgs = ['Pressurising tanks', 'Chilling feed lines', 'Ignition sequence', 'Chamber pressure nominal', 'Liftoff'];
const ld = $('#loader'), n = $('#ld-n'), bar = $('#ld-b'), txt = $('#ld-t'), dot = $('#ld-dot');
const dur = reduce ? 300 : 2800; let t0, loaded = document.readyState === 'complete';
addEventListener('load', () => loaded = true);
function finish() {
  ld.classList.add('done'); body.classList.remove('is-loading');
  setTimeout(() => { body.classList.add('ready'); $$('.hero .split,.hero .reveal').forEach(e => e.classList.add('in')); countUp(); }, reduce ? 0 : 500);
  setTimeout(() => ld.remove(), 1400);
}
function tick(t) {
  t0 ??= t; const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 2.2), v = Math.round(e * 100);
  n.textContent = String(v).padStart(3, '0'); bar.style.transform = `scaleX(${e})`;
  const k = Math.min(Math.floor(e * msgs.length), msgs.length - 1); txt.textContent = msgs[k];
  dot.className = 'dot ' + (k > 2 ? 'ok' : 'warn'); if (k >= 2) ld.classList.add('fire');
  if (p < 1 || !loaded) requestAnimationFrame(tick); else setTimeout(finish, 350);
}
requestAnimationFrame(tick);

/* Count up */
function countUp() {
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count, s = performance.now(), d = reduce ? 1 : 1800;
    (function f(t) { const p = Math.min((t - s) / d, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US'); if (p < 1) requestAnimationFrame(f); })(s);
  });
}

/* Scroll reveals */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
$$('.split,.reveal').forEach(el => { if (!el.closest('.hero')) { if (el.classList.contains('card')) el.style.setProperty('--d', (el.parentNode.children.length && [...el.parentNode.children].indexOf(el) * 90) + 'ms'); io.observe(el); } });

/* Scroll: progress, nav hide, active link */
const prog = $('#progress'), nav = $('#nav'), links = $$('#menu a'); let ly = 0;
const secs = links.map(a => $(a.getAttribute('href')));
addEventListener('scroll', () => {
  const y = scrollY, h = root.scrollHeight - innerHeight;
  prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  nav.classList.toggle('hide', y > ly && y > 400 && !$('#menu.open')); ly = y;
  let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
  links.forEach((a, i) => a.classList.toggle('on', i === cur));
}, { passive: true });

/* Mobile menu */
const burger = $('#burger'), menu = $('#menu');
burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
links.forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

/* Pointer effects */
const fine = matchMedia('(pointer:fine)').matches;
let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my; const glow = $('#glow');
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
$$('.spot').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect(); el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px');
}));
if (fine && !reduce) {
  $$('[data-mag]').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
  const plate = $('#plate');
  addEventListener('pointermove', e => {
    if (!body.classList.contains('ready')) return;
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    plate.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
  }, { passive: true });
} else glow.style.display = 'none';

/* Airflow streamlines: lines deflect around the pointer */
const cv = $('#flow'), cx = cv.getContext('2d'); let W, H, D = Math.min(devicePixelRatio || 1, 2), run = !reduce;
function size() { W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; cx.setTransform(D, 0, 0, D, 0, 0); }
size(); addEventListener('resize', size);
document.addEventListener('visibilitychange', () => { run = !document.hidden && !reduce; if (run) loop(performance.now()); });
function draw(t) {
  cx.clearRect(0, 0, W, H); cx.lineWidth = 1;
  const cs = getComputedStyle(root).getPropertyValue('--ink').trim(), N = W < 700 ? 16 : 28;
  cx.strokeStyle = cs;
  for (let i = 0; i < N; i++) {
    const by = (i + .5) / N * H; cx.beginPath();
    for (let x = 0; x <= W; x += 24) {
      let y = by + Math.sin(x * .004 + t * .0004 + i * .5) * 16;
      const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
      if (fine) y += (dy / (Math.sqrt(d2) + 1)) * 5200 / (Math.sqrt(d2) + 60);
      x ? cx.lineTo(x, y) : cx.moveTo(x, y);
    }
    cx.globalAlpha = .12 + (i % 4 === 0) * .12; cx.stroke();
  }
}
function loop(t) {
  gx += (mx - gx) * .08; gy += (my - gy) * .08; glow.style.transform = `translate(${gx}px,${gy}px)`;
  draw(t); if (run) requestAnimationFrame(loop);
}
reduce ? draw(0) : requestAnimationFrame(loop);
})();
