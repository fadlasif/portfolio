/**
 * main.js — Portfolio JavaScript v2.0
 * Fixed: Contact form now sends to MongoDB backend
 */

'use strict';

const BACKEND_URL = 'http://localhost:5000';

const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

function el(tag, cls = '', html = '') {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function esc(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

function initPageTransition() {
  const overlay = el('div', 'page-transition');
  document.body.prepend(overlay);
  overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
}

function initTheme() {
  const btn  = $('#themeToggle');
  const icon = btn?.querySelector('.theme-icon');
  const html = document.documentElement;
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    html.dataset.theme = saved;
    if (icon) icon.textContent = saved === 'light' ? '🌙' : '☀️';
  }
  btn?.addEventListener('click', () => {
    const isDark = html.dataset.theme === 'dark';
    const next   = isDark ? 'light' : 'dark';
    html.dataset.theme = next;
    if (icon) icon.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('portfolio-theme', next);
  });
}

function initNavbar() {
  const navbar      = $('#navbar');
  const ham         = $('#hamburger');
  const drawer      = $('#mobileDrawer');
  const navLinks    = $$('.nav-link');
  const mobileLinks = $$('.mobile-link');

  const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.35 });
  $$('section[id]').forEach(s => sectionObs.observe(s));

  let open = false;
  const toggleDrawer = (state) => {
    open = state;
    drawer?.classList.toggle('open', state);
    ham?.classList.toggle('open', state);
    ham?.setAttribute('aria-expanded', String(state));
    drawer?.setAttribute('aria-hidden', String(!state));
    document.body.style.overflow = state ? 'hidden' : '';
  };
  ham?.addEventListener('click', () => toggleDrawer(!open));
  mobileLinks.forEach(l => l.addEventListener('click', () => toggleDrawer(false)));
  document.addEventListener('click', e => {
    if (open && !navbar?.contains(e.target) && !drawer?.contains(e.target)) toggleDrawer(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggleDrawer(false); });
}

function initCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 60;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W; this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.6 + 0.3; this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.45 + 0.1); this.alpha = Math.random() * 0.5 + 0.08;
      this.life = Math.random() * 220 + 100; this.age = 0;
    }
    update() { this.x += this.vx; this.y += this.vy; this.age++; if (this.age > this.life || this.y < -10) this.reset(); }
    draw() { const f = Math.sin((this.age / this.life) * Math.PI); ctx.globalAlpha = this.alpha * f; ctx.fillStyle = '#3B82F6'; ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); }
  }

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; particles = Array.from({ length: COUNT }, () => new Particle()); }
  function loop() { ctx.clearRect(0, 0, W, H); ctx.globalAlpha = 1; particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); }
  new ResizeObserver(resize).observe(canvas);
  resize(); loop();
}

function initTyping() {
  const textEl = $('#typedText');
  if (!textEl) return;
  const titles = PORTFOLIO_DATA.typedTitles;
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const cur = titles[ti];
    if (!deleting) { textEl.textContent = cur.slice(0, ++ci); if (ci === cur.length) { deleting = true; setTimeout(tick, 2000); return; } }
    else { textEl.textContent = cur.slice(0, --ci); if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; } }
    setTimeout(tick, deleting ? 50 : 85);
  }
  tick();
}

function initScrollReveal() {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObs.unobserve(entry.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => { if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), i * 55); fadeObs.unobserve(entry.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const wordObs = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); wordObs.unobserve(entry.target); } });
  }, { threshold: 0.5 });

  function attachAll() {
    $$('.reveal, .stagger').forEach(e => revealObs.observe(e));
    $$('.fade-in, .fade-in-stagger').forEach(e => fadeObs.observe(e));
    $$('.word-reveal').forEach(e => wordObs.observe(e));
  }
  window._attachReveal = attachAll;
  attachAll();
}

function initWordReveal() {
  $$('.animate-words').forEach(el => {
    const text = el.textContent;
    const words = text.trim().split(/\s+/);
    el.classList.add('word-reveal');
    el.innerHTML = words.map(w => `<span class="word">${esc(w)}&nbsp;</span>`).join('');
  });
}

function initCounters() {
  const counterEls = $$('[data-count]');
  if (!counterEls.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counterEls.forEach(e => obs.observe(e));
}

function initSkillBars() {
  const panel = $('#skillBars');
  if (!panel) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.bar-item', panel).forEach((item, i) => {
          const fill = item.querySelector('.bar-fill');
          const width = item.dataset.width || '0';
          setTimeout(() => { if (fill) fill.style.width = `${width}%`; }, i * 120);
        });
        obs.unobserve(panel);
      }
    });
  }, { threshold: 0.25 });
  obs.observe(panel);
}

function renderProjects() {
  const grid = $('#projectsGrid');
  if (!grid) return;
  grid.classList.add('stagger');
  PORTFOLIO_DATA.projects.forEach((p, i) => {
    const demoBtn = p.demo ? `<a href="${esc(p.demo)}" class="project-link link-demo" target="_blank" rel="noopener">Live Demo ↗</a>` : '';
    const ghBtn   = p.github ? `<a href="${esc(p.github)}" class="project-link" target="_blank" rel="noopener">GitHub</a>` : '';
    const tags    = p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('');
    const card = el('article', 'project-card', `
      <div class="project-thumb" aria-hidden="true">
        <span>${p.emoji}</span>
        <span class="project-num">0${i + 1}</span>
      </div>
      <div class="project-body">
        <h3 class="project-name">${esc(p.name)}</h3>
        <p class="project-desc">${esc(p.desc)}</p>
        <div class="project-tags">${tags}</div>
        ${(demoBtn || ghBtn) ? `<div class="project-links">${demoBtn}${ghBtn}</div>` : ''}
      </div>
    `);
    card.setAttribute('role', 'listitem');
    grid.appendChild(card);
  });
  window._attachReveal?.();
}

function renderSkills() {
  const grid = $('#skillsGrid');
  if (!grid) return;
  grid.classList.add('stagger');
  PORTFOLIO_DATA.skillGroups.forEach(group => {
    const chips = group.chips.map(c => `<span class="chip">${esc(c)}</span>`).join('');
    grid.appendChild(el('div', 'skill-card', `<p class="skill-card-label">${esc(group.label)}</p><div class="skill-chips">${chips}</div>`));
  });
  window._attachReveal?.();
}

function renderTimeline() {
  const container = $('#timeline');
  if (!container) return;
  PORTFOLIO_DATA.timeline.forEach(item => {
    const points = item.points.map(p => `<li class="tl-point">${esc(p)}</li>`).join('');
    const node = el('div', 'timeline-item reveal reveal-left', `
      <p class="tl-date">${esc(item.date)}</p>
      <h3 class="tl-title">${esc(item.title)}</h3>
      <p class="tl-org">${esc(item.org)}</p>
      <ul class="tl-points">${points}</ul>
    `);
    node.setAttribute('role', 'listitem');
    container.appendChild(node);
  });
  window._attachReveal?.();
}

function renderCerts() {
  const list = $('#certsList');
  if (!list) return;
  list.classList.add('stagger');
  PORTFOLIO_DATA.certificates.forEach(cert => {
    const card = el('div', 'cert-card', `
      <span class="cert-icon" aria-hidden="true">${cert.icon}</span>
      <div><p class="cert-name">${esc(cert.name)}</p><p class="cert-org">${esc(cert.org)}</p></div>
    `);
    if (cert.link && cert.link !== '#') {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => window.open(cert.link, '_blank', 'noopener'));
    }
    list.appendChild(card);
  });
  window._attachReveal?.();
}

function renderSocials() {
  const container = $('#socialLinks');
  if (!container) return;
  PORTFOLIO_DATA.socials.forEach(s => {
    const a = el('a', 'social-link', `<span class="social-icon" aria-hidden="true">${s.icon}</span><span>${esc(s.label)}</span>`);
    a.href = s.href;
    a.target = s.href.startsWith('http') ? '_blank' : '_self';
    if (s.href.startsWith('http')) a.rel = 'noopener noreferrer';
    container.appendChild(a);
  });
}

/* ══════════════════════════════════════
   CONTACT FORM — sends to MongoDB backend
══════════════════════════════════════ */
function initContactForm() {
  const form      = $('#contactForm');
  if (!form) return;
  const nameEl    = $('#name');
  const emailEl   = $('#email');
  const msgEl     = $('#message');
  const feedback  = $('#formFeedback');
  const submitBtn = form.querySelector('.submit-btn');
  const nameErr   = $('#nameError');
  const emailErr  = $('#emailError');
  const msgErr    = $('#messageError');

  function showErr(input, errEl, msg) { input.classList.add('invalid'); if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); } }
  function clearErr(input, errEl)     { input.classList.remove('invalid'); if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); } }

  function validateName()  { const v = nameEl.value.trim(); if (!v) { showErr(nameEl, nameErr, 'Name is required.'); return false; } clearErr(nameEl, nameErr); return true; }
  function validateEmail() { const v = emailEl.value.trim(); if (!v) { showErr(emailEl, emailErr, 'Email is required.'); return false; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { showErr(emailEl, emailErr, 'Enter a valid email.'); return false; } clearErr(emailEl, emailErr); return true; }
  function validateMsg()   { const v = msgEl.value.trim(); if (!v) { showErr(msgEl, msgErr, 'Message is required.'); return false; } if (v.length < 10) { showErr(msgEl, msgErr, 'At least 10 characters.'); return false; } clearErr(msgEl, msgErr); return true; }

  nameEl?.addEventListener('blur', validateName);
  emailEl?.addEventListener('blur', validateEmail);
  msgEl?.addEventListener('blur', validateMsg);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (![validateName(), validateEmail(), validateMsg()].every(Boolean)) return;

    submitBtn?.classList.add('loading');
    feedback.textContent = '';
    feedback.className   = 'form-feedback';

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    nameEl.value.trim(),
          email:   emailEl.value.trim(),
          message: msgEl.value.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Server error');

      feedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
      feedback.className   = 'form-feedback success';
      form.reset();

    } catch (err) {
      feedback.textContent = '✕ Something went wrong. Please email me directly.';
      feedback.className   = 'form-feedback error';
      console.error('[Contact]', err.message);
    } finally {
      submitBtn?.classList.remove('loading');
    }
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PORTFOLIO_DATA === 'undefined') {
    console.error('[Portfolio] PORTFOLIO_DATA not found.');
    return;
  }
  initPageTransition();
  renderProjects();
  renderSkills();
  renderTimeline();
  renderCerts();
  renderSocials();
  initWordReveal();
  initTheme();
  initNavbar();
  initCanvas();
  initTyping();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initContactForm();
  console.info('[Portfolio] Fadl Asif E — loaded ✓');
});