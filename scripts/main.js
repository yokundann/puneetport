(() => {
'use strict';
/* Fill these in. Empty values stay hidden. */
const CONFIG = { email: 'shekharpuneet648@gmail.com', linkedin: '', github: '' };

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
const root = document.documentElement, body = document.body, clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* Theme */
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
$('#theme').onclick = () => { const t = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = t; try { localStorage.setItem('theme', t); } catch (e) {} setTimeout(readC, 30); };

/* Contact links */
[['c-mail', CONFIG.email && 'mailto:' + CONFIG.email], ['c-in', CONFIG.linkedin], ['c-gh', CONFIG.github]].forEach(([id, h]) => { const a = document.getElementById(id); if (a && h) { a.href = h; a.hidden = false; } });
if (CONFIG.email) $('#c-mail-t').textContent = CONFIG.email; else $('#c-copy').hidden = true;

/* Split headings into masked words */
$$('.split').forEach(el => {
  let i = 0; el.style.setProperty('--d', (el.dataset.delay || 0) + 'ms');
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
const ld = $('#loader'), n = $('#ld-n'), bar = $('#ld-b'), txt = $('#ld-t');
const dur = reduce ? 1100 : 1500; let t0, loaded = document.readyState === 'complete';
addEventListener('load', () => loaded = true);
function finish() {
  ld.classList.add('done'); body.classList.remove('is-loading');
  setTimeout(() => { body.classList.add('ready'); $$('.hero .split').forEach(e => e.classList.add('in')); $$('.hero [data-count]').forEach(count); }, reduce ? 0 : 500);
  setTimeout(() => ld.remove(), 1400);
}
function tick(t) {
  t0 ??= t; const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 2.2);
  n.textContent = String(Math.round(e * 100)).padStart(3, '0'); bar.style.transform = `scaleX(${e})`;
  const k = Math.min(Math.floor(e * msgs.length), msgs.length - 1); txt.textContent = msgs[k]; if (k >= 2) ld.classList.add('fire');
  if (p < 1 || !loaded) requestAnimationFrame(tick); else setTimeout(finish, 350);
}
requestAnimationFrame(tick);

/* Count up */
function count(el) {
  const end = +el.dataset.count, dec = +(el.dataset.dec || 0), s = performance.now(), d = reduce ? 1 : 1800;
  (function f(t) { const p = clamp((t - s) / d, 0, 1); el.textContent = (end * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (p < 1) requestAnimationFrame(f); })(s);
}

/* Reveals */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const t = e.target; t.classList.add('in'); io.unobserve(t); $$('[data-count]', t).forEach(count); if (t.dataset.count) count(t);
}), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
$$('.split,.reveal,.sec-h,.proj,.feature .f-copy').forEach(el => { if (!el.closest('.hero')) io.observe(el); });
$$('.grid4 .cell,.fspec div,.tl-i').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 100 + 'ms'));

/* Static helpers */
const readC = () => {}; let vh = innerHeight;
$$('.band').forEach(b => b.innerHTML += b.innerHTML);

/* Mechanical progress rig */
const tt = $('#tt'), car = $('#car'), tItems = $$('.tl-i'), stgB = $$('#stg button'), needle = $('#g-needle'), gfill = $('#g-fill'), gpct = $('#g-pct'), rdS = $('#rd-s'), rdT = $('#rd-t');
const SV = 'http://www.w3.org/2000/svg', LBL = ['Competition', 'Club', 'Organising', 'Education'];
(() => { // gauge ticks + labels
  const gt = $('#g-ticks'), gl = $('#g-labels');
  for (let i = 0; i <= 24; i++) {
    const a = (150 + i * 10) * Math.PI / 180, mj = i % 6 === 0, r1 = 84, r2 = mj ? 92 : 88, l = document.createElementNS(SV, 'line');
    l.setAttribute('class', 'g-tick' + (mj ? ' mj' : '')); l.setAttribute('x1', 100 + r1 * Math.cos(a)); l.setAttribute('y1', 100 + r1 * Math.sin(a)); l.setAttribute('x2', 100 + r2 * Math.cos(a)); l.setAttribute('y2', 100 + r2 * Math.sin(a)); gt.append(l);
    if (mj) { const t = document.createElementNS(SV, 'text'); t.setAttribute('class', 'g-txt'); t.setAttribute('x', 100 + 62 * Math.cos(a)); t.setAttribute('y', 103 + 62 * Math.sin(a)); t.textContent = i * 100 / 24; gl.append(t); }
  }
})();
const gearPath = (N, rp, hub) => {
  const ro = rp + 2.6, rr = rp - 2.8, p = Math.PI * 2 / N; let d = '';
  for (let i = 0; i < N; i++) { const a = i * p; [[rr, a - .30 * p], [ro, a - .15 * p], [ro, a + .15 * p], [rr, a + .30 * p], [rr, a + .5 * p]].forEach(([r, g], j) => { d += (i === 0 && j === 0 ? 'M' : 'L') + (r * Math.cos(g)).toFixed(2) + ' ' + (r * Math.sin(g)).toFixed(2); }); }
  d += `ZM${-hub} 0a${hub} ${hub} 0 1 0 ${2 * hub} 0a${hub} ${hub} 0 1 0 ${-2 * hub} 0Z`;
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, x = Math.cos(a) * rp * .58, y = Math.sin(a) * rp * .58, hr = rp * .16; d += `M${(x - hr).toFixed(2)} ${y.toFixed(2)}a${hr} ${hr} 0 1 0 ${2 * hr} 0a${hr} ${hr} 0 1 0 ${-2 * hr} 0Z`; }
  return d;
};
const K = 2.2, GA = { N: 14, x: 56 }, GB = { N: 9, x: 56 + 23 * K }, GC = { N: 11, x: 56 + 23 * K + 20 * K };
[['ga', GA], ['gb', GB], ['gc', GC]].forEach(([id, g]) => { $('#' + id + ' path').setAttribute('d', gearPath(g.N, g.N * K, g.N * K * .22)); });
let gv = 0, gAcc = 0, na = -120, nv = 0, lastP = -1, lastS = -2;
$('#gears').addEventListener('click', () => gv += 16);
function rigFrame(y) {
  const tr = tt.getBoundingClientRect(), line = vh * .55, pr = clamp((line - tr.top) / tr.height, 0, 1);
  tlf.style.transform = `scaleY(${pr})`; car.style.transform = `translateY(${pr * tr.height}px)`;
  nutIn.style.transform = `rotate(${y * .5}deg)`;
  let st = -1; tItems.forEach((it, i) => { const nr = $('.node', it).getBoundingClientRect(), hit = nr.top + nr.height / 2 < line; it.classList.toggle('hit', hit); if (hit) st = i; });
  const pc = Math.round(pr * 100);
  if (pc !== lastP) { gpct.textContent = String(pc).padStart(3, '0'); lastP = pc; }
  if (st !== lastS) { rdS.textContent = String(st + 1).padStart(2, '0'); rdT.textContent = st < 0 ? 'Standby' : LBL[st]; stgB.forEach((b, i) => b.classList.toggle('on', i === st)); lastS = st; }
  const target = -120 + pr * 240; nv += (target - na) * .14; nv *= .76; na += reduce ? (target - na) : nv;
  needle.setAttribute('transform', `translate(100 100) rotate(${na.toFixed(2)})`); gfill.setAttribute('stroke-dasharray', `${clamp((na + 120) / 240, 0, 1) * 318.3} 999`);
  gAcc += gv; gv *= .94; const th = y * .3 + gAcc;
  $('#ga').setAttribute('transform', `translate(${GA.x} 40) rotate(${th.toFixed(2)})`);
  $('#gb').setAttribute('transform', `translate(${GB.x.toFixed(2)} 40) rotate(${(-th * GA.N / GB.N).toFixed(2)})`);
  $('#gc').setAttribute('transform', `translate(${GC.x.toFixed(2)} 40) rotate(${(th * GA.N / GC.N).toFixed(2)})`);
}
stgB.forEach(b => {
  const it = tItems[+b.dataset.i];
  b.addEventListener('click', () => it.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }));
  ['pointerenter', 'focus'].forEach(e => b.addEventListener(e, () => it.classList.add('peek'))); ['pointerleave', 'blur'].forEach(e => b.addEventListener(e, () => it.classList.remove('peek')));
});
let drag = null;
car.addEventListener('pointerdown', e => { drag = e.clientY; car.setPointerCapture(e.pointerId); car.classList.add('grab'); root.style.scrollBehavior = 'auto'; });
car.addEventListener('pointermove', e => { if (drag == null) return; scrollBy(0, (e.clientY - drag) * 1.6); drag = e.clientY; });
['pointerup', 'pointercancel'].forEach(e => car.addEventListener(e, () => { drag = null; car.classList.remove('grab'); root.style.scrollBehavior = ''; }));

/* Contact form */
(() => {
  const form = $('#comm'), F = { n: $('#f-name'), e: $('#f-email'), m: $('#f-msg') }, cnt = $('#f-cnt'), send = $('#f-send'), mid = $('#mid');
  const fld = el => el.closest('.fld'), setErr = (el, m) => { const f = fld(el); f.classList.toggle('bad', !!m); f.classList.toggle('good', !m && !!el.value.trim()); $('.err', f).textContent = m || ''; return !m; };
  const chk = {
    n: () => setErr(F.n, F.n.value.trim().length < 2 ? 'Please add your name' : ''),
    e: () => setErr(F.e, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(F.e.value.trim()) ? '' : 'That email does not look right'),
    m: () => setErr(F.m, F.m.value.trim().length < 10 ? 'A few more words please (10+ characters)' : '')
  };
  Object.keys(F).forEach(k => { F[k].addEventListener('blur', chk[k]); F[k].addEventListener('input', () => { if (fld(F[k]).classList.contains('bad') || fld(F[k]).classList.contains('good')) chk[k](); }); });
  F.m.addEventListener('input', () => { cnt.textContent = F.m.value.length + ' / 600'; F.m.style.height = 'auto'; F.m.style.height = Math.max(144, F.m.scrollHeight) + 'px'; });
  const compose = () => {
    const topics = $$('.pick input:checked', form).map(i => i.value), name = F.n.value.trim(), subject = `Portfolio enquiry${topics.length ? ': ' + topics.join(', ') : ''} (${name})`, bodyTxt = `${F.m.value.trim()}\n\n${name}\n${F.e.value.trim()}`;
    return { subject, bodyTxt, mailto: `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`, gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONFIG.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}` };
  };
  let cur = null;
  const flash = (btn, t) => { const sp = $('span', btn), o = sp.textContent; sp.textContent = t; setTimeout(() => sp.textContent = o, 1600); };
  const copy = async txt => { try { await navigator.clipboard.writeText(txt); return true; } catch (e) { return false; } };
  form.addEventListener('submit', e => {
    e.preventDefault(); const ok = [chk.n(), chk.e(), chk.m()].every(Boolean); if (!ok) { (form.querySelector('.bad input,.bad textarea') || F.n).focus(); return; }
    cur = compose(); $('#f-gmail').href = cur.gmail; send.classList.add('busy'); $('span', send).textContent = 'Igniting';
    setTimeout(() => { const a = document.createElement('a'); a.href = cur.mailto; document.body.append(a); a.click(); a.remove(); form.classList.add('done'); send.classList.remove('busy'); $('span', send).textContent = 'Transmit'; }, reduce ? 0 : 900);
  });
  $('#f-copy').onclick = async function () { flash(this, await copy(`To: ${CONFIG.email}\nSubject: ${cur.subject}\n\n${cur.bodyTxt}`) ? 'Copied' : 'Copy failed'); };
  $('#f-again').onclick = () => { form.reset(); cnt.textContent = '0 / 600'; F.m.style.height = ''; $$('.fld', form).forEach(f => f.classList.remove('good', 'bad')); form.classList.remove('done'); mid.textContent = String(+mid.textContent + 1).padStart(3, '0'); F.n.focus(); };
  $('#c-copy').onclick = async function () { flash(this, await copy(CONFIG.email) ? 'Copied' : CONFIG.email); };
  const clock = $('#clock'), fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }), tick = () => clock.textContent = fmt.format(new Date()); tick(); setInterval(tick, 20000);
})();

/* Gears: build teeth, pause when off screen */
$$('.gr').forEach(s => s.firstElementChild.setAttribute('d', gearPath(+s.dataset.n, 24, 5.5)));
const gio = new IntersectionObserver(es => es.forEach(e => e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'));
$$('.gr').forEach(g => gio.observe(g));

/* Tape navigation: a heading tape that slides with the page, drag or click to move */
const tape = $('#tape'), tapeT = $('#tape-t'), bugN = $('#bug-n'), bugT = $('#bug-t'), bugP = $('#bug-p'), np = $('#np');
const NAV = [['Top', '#top'], ['About', '#about'], ['Work', '#work'], ['Skills', '#skills'], ['Activities', '#activities'], ['Contact', '#contact']];
const stops = NAV.map(([t, h], i) => { const a = document.createElement('a'); a.href = h; a.textContent = t; tapeT.append(a); return { a, el: $(h), y: 0 }; });
const TS = .1; let curStop = -1, lastPct = -1;
function layoutTape() {
  vh = innerHeight;
  stops.forEach((o, i) => { const hd = $('.sec-h', o.el); o.y = i ? Math.max(0, Math.round((hd || o.el).getBoundingClientRect().top + scrollY - 110)) : 0; o.a.style.left = o.y * TS + 'px'; });
  tapeT.style.width = root.scrollHeight * TS + 'px';
}
const goTo = i => scrollTo({ top: stops[i].y, behavior: reduce ? 'instant' : 'smooth' });
let dx0 = null, sy0 = 0, moved = 0;
tape.addEventListener('pointerdown', e => { dx0 = e.clientX; sy0 = scrollY; moved = 0; });
tape.addEventListener('pointermove', e => { if (dx0 == null) return; const d = e.clientX - dx0; moved = Math.max(moved, Math.abs(d)); if (moved > 4) { if (!tape.hasPointerCapture(e.pointerId)) tape.setPointerCapture(e.pointerId); tape.classList.add('drag'); scrollTo({ top: sy0 - d / TS, behavior: 'instant' }); } });
['pointerup', 'pointercancel'].forEach(ev => tape.addEventListener(ev, () => { dx0 = null; tape.classList.remove('drag'); }));
document.addEventListener('click', e => {
  if (moved > 4 && e.target.closest('#tape')) { e.preventDefault(); moved = 0; return; }
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const i = NAV.findIndex(n => n[1] === a.getAttribute('href')); if (i < 0) return;
  e.preventDefault(); goTo(i); history.replaceState(null, '', a.getAttribute('href'));
});

/* One frame function, scheduled only when scrolling or when the rig is still settling */
const tl = $('#tl'), tlf = $('#tlf'), nutIn = $('.nut-in', car); let queued = false;
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
function frame() {
  queued = false; const y = scrollY, h = root.scrollHeight - vh, p = h > 0 ? y / h : 0;
  np.style.transform = `scaleX(${p})`; tapeT.style.transform = `translate3d(${-y * TS}px,0,0)`;
  const pc = Math.round(p * 100); if (pc !== lastPct) { bugP.textContent = pc + '%'; lastPct = pc; }
  let c = 0; stops.forEach((o, i) => { if (o.y <= y + vh * .35) c = i; });
  if (c !== curStop) { curStop = c; bugN.textContent = String(c).padStart(2, '0'); bugT.textContent = NAV[c][0]; stops.forEach((o, i) => { o.a.classList.toggle('on', i === c); i === c ? o.a.setAttribute('aria-current', 'location') : o.a.removeAttribute('aria-current'); }); }
  const r = tl.getBoundingClientRect();
  if ((r.bottom > -200 && r.top < vh + 200) || Math.abs(gv) > .05) { rigFrame(y); if (Math.abs(nv) > .01 || Math.abs(gv) > .05) queue(); }
}
addEventListener('scroll', queue, { passive: true });
addEventListener('resize', () => { layoutTape(); queue(); });
addEventListener('load', () => { layoutTape(); queue(); });
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { layoutTape(); queue(); });
new ResizeObserver(() => { layoutTape(); queue(); }).observe(body);
layoutTape(); frame();
$('#gears').addEventListener('click', queue);
})();
