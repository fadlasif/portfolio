/**
 * main.js — Portfolio JavaScript v2.0
 * ─────────────────────────────────────────────────────────
 *  1.  DOM helpers
 *  2.  Page transition overlay
 *  3.  Theme toggle
 *  4.  Navbar — scroll + active + hamburger
 *  5.  Hero canvas particle system
 *  6.  Typing animation
 *  7.  Scroll reveal (IntersectionObserver)
 *  8.  Word-by-word text fade
 *  9.  Animated counters (stat numbers)
 * 10.  Skill bar animation
 * 11.  Render: Projects
 * 12.  Render: Skills
 * 13.  Render: Timeline
 * 14.  Render: Certificates
 * 15.  Render: Social links
 * 16.  Contact form + Formspree
 * 17.  Init
 * ─────────────────────────────────────────────────────────
 * ⚠️  Requires: data.js loaded before this file
 * ⚠️  Formspree: set FORMSPREE_ID below before deploying
 */

'use strict';

/* ══════════════════════════════════════
   FORMSPREE CONFIG
   Replace with your own ID from formspree.io
══════════════════════════════════════ */
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';  // e.g. 'xpwzgkqb'


/* ══════════════════════════════════════
   1. DOM HELPERS
══════════════════════════════════════ */
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


/* ══════════════════════════════════════
   2. PAGE TRANSITION OVERLAY
   Injects a full-screen accent panel that
   wipes away as the page loads.
══════════════════════════════════════ */
function initPageTransition() {
  const overlay = el('div', 'page-transition');
  document.body.prepend(overlay);
  // Remove from DOM after animation finishes
  overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
}


/* ══════════════════════════════════════
   3. THEME TOGGLE
══════════════════════════════════════ */
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


/* ══════════════════════════════════════
   4. NAVBAR
══════════════════════════════════════ */
function initNavbar() {
  const navbar      = $('#navbar');
  const ham         = $('#hamburger');
  const drawer      = $('#mobileDrawer');
  const navLinks    = $$('.nav-link');
  const mobileLinks = $$('.mobile-link');

  /* Scrolled shadow */
  const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active section highlight */
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.35 });
  $$('section[id]').forEach(s => sectionObs.observe(s));

  /* Hamburger */
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


/* ══════════════════════════════════════
   5. HERO CANVAS — PARTICLE SYSTEM
══════════════════════════════════════ */
function initCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 60;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 10;
      this.r     = Math.random() * 1.6 + 0.3;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = -(Math.random() * 0.45 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.08;
      this.life  = Math.random() * 220 + 100;
      this.age   = 0;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.age++;
      if (this.age > this.life || this.y < -10) this.reset();
    }
    draw() {
      const fade = Math.sin((this.age / this.life) * Math.PI);
      ctx.globalAlpha = this.alpha * fade;
      ctx.fillStyle   = '#3B82F6';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  loop();
}


/* ══════════════════════════════════════
   6. TYPING ANIMATION
══════════════════════════════════════ */
function initTyping() {
  const textEl = $('#typedText');
  if (!textEl) return;

  const titles = PORTFOLIO_DATA.typedTitles;
  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const cur = titles[ti];
    if (!deleting) {
      textEl.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; setTimeout(tick, 2000); return; }
    } else {
      textEl.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
    }
    setTimeout(tick, deleting ? 50 : 85);
  }
  tick();
}


/* ══════════════════════════════════════
   7. SCROLL REVEAL
   Watches .reveal, .stagger, .fade-in,
   .fade-in-stagger, and .word-reveal elements.
══════════════════════════════════════ */
function initScrollReveal() {
  /* Main reveal observer */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  /* Legacy fade-in observer */
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 55);
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  /* Word reveal observer */
  const wordObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        wordObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  function attachAll() {
    $$('.reveal, .stagger').forEach(e => revealObs.observe(e));
    $$('.fade-in, .fade-in-stagger').forEach(e => fadeObs.observe(e));
    $$('.word-reveal').forEach(e => wordObs.observe(e));
  }

  // Expose so render functions can call after injecting new DOM
  window._attachReveal = attachAll;
  attachAll();
}


/* ══════════════════════════════════════
   8. WORD-BY-WORD TEXT FADE
   Wraps each word in a .word span inside
   any element with class .animate-words
══════════════════════════════════════ */
function initWordReveal() {
  $$('.animate-words').forEach(el => {
    const text  = el.textContent;
    const words = text.trim().split(/\s+/);
    el.classList.add('word-reveal');
    el.innerHTML = words
      .map(w => `<span class="word">${esc(w)}&nbsp;</span>`)
      .join('');
  });
}


/* ══════════════════════════════════════
   9. ANIMATED COUNTERS
   Elements with data-count="N" count up
   from 0 to N when they enter the viewport.
══════════════════════════════════════ */
function initCounters() {
  const counterEls = $$('[data-count]');
  if (!counterEls.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800; // ms
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // easeOutExpo
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


/* ══════════════════════════════════════
   10. SKILL BAR ANIMATION
══════════════════════════════════════ */
function initSkillBars() {
  const panel = $('#skillBars');
  if (!panel) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.bar-item', panel).forEach((item, i) => {
          const fill  = item.querySelector('.bar-fill');
          const width = item.dataset.width || '0';
          setTimeout(() => { if (fill) fill.style.width = `${width}%`; }, i * 120);
        });
        obs.unobserve(panel);
      }
    });
  }, { threshold: 0.25 });
  obs.observe(panel);
}


/* ══════════════════════════════════════
   11. RENDER: PROJECTS
══════════════════════════════════════ */
function renderProjects() {
  const grid = $('#projectsGrid');
  if (!grid) return;

  grid.classList.add('stagger');

  PORTFOLIO_DATA.projects.forEach((p, i) => {
    const demoBtn = p.demo
      ? `<a href="${esc(p.demo)}" class="project-link link-demo" target="_blank" rel="noopener">Live Demo ↗</a>`
      : '';
    const ghBtn = p.github
      ? `<a href="${esc(p.github)}" class="project-link" target="_blank" rel="noopener">GitHub</a>`
      : '';
    const tags = p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('');

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


/* ══════════════════════════════════════
   12. RENDER: SKILLS
══════════════════════════════════════ */
function renderSkills() {
  const grid = $('#skillsGrid');
  if (!grid) return;

  grid.classList.add('stagger');

  PORTFOLIO_DATA.skillGroups.forEach(group => {
    const chips = group.chips.map(c => `<span class="chip">${esc(c)}</span>`).join('');
    grid.appendChild(el('div', 'skill-card', `
      <p class="skill-card-label">${esc(group.label)}</p>
      <div class="skill-chips">${chips}</div>
    `));
  });

  window._attachReveal?.();
}


/* ══════════════════════════════════════
   13. RENDER: TIMELINE
══════════════════════════════════════ */
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


/* ══════════════════════════════════════
   14. RENDER: CERTIFICATES
══════════════════════════════════════ */
function renderCerts() {
  const list = $('#certsList');
  if (!list) return;

  list.classList.add('stagger');

  PORTFOLIO_DATA.certificates.forEach(cert => {
    const card = el('div', 'cert-card', `
      <span class="cert-icon" aria-hidden="true">${cert.icon}</span>
      <div>
        <p class="cert-name">${esc(cert.name)}</p>
        <p class="cert-org">${esc(cert.org)}</p>
      </div>
    `);
    if (cert.link && cert.link !== '#') {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => window.open(cert.link, '_blank', 'noopener'));
    }
    list.appendChild(card);
  });

  window._attachReveal?.();
}


/* ══════════════════════════════════════
   15. RENDER: SOCIAL LINKS
══════════════════════════════════════ */
function renderSocials() {
  const container = $('#socialLinks');
  if (!container) return;

  PORTFOLIO_DATA.socials.forEach(s => {
    const a = el('a', 'social-link', `
      <span class="social-icon" aria-hidden="true">${s.icon}</span>
      <span>${esc(s.label)}</span>
    `);
    a.href   = s.href;
    a.target = s.href.startsWith('http') ? '_blank' : '_self';
    if (s.href.startsWith('http')) a.rel = 'noopener noreferrer';
    container.appendChild(a);
  });
}


/* ══════════════════════════════════════
   16. CONTACT FORM + FORMSPREE
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

  /* ── Validators ── */
  function validateName() {
    const v = nameEl.value.trim();
    if (!v) { showErr(nameEl, nameErr, 'Name is required.'); return false; }
    clearErr(nameEl, nameErr); return true;
  }
  function validateEmail() {
    const v  = emailEl.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v)        { showErr(emailEl, emailErr, 'Email is required.'); return false; }
    if (!re.test(v)) { showErr(emailEl, emailErr, 'Enter a valid email address.'); return false; }
    clearErr(emailEl, emailErr); return true;
  }
  function validateMsg() {
    const v = msgEl.value.trim();
    if (!v)          { showErr(msgEl, msgErr, 'Message is required.'); return false; }
    if (v.length < 10) { showErr(msgEl, msgErr, 'At least 10 characters please.'); return false; }
    clearErr(msgEl, msgErr); return true;
  }

  function showErr(input, errEl, msg) {
    input.classList.add('invalid');
    if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
  }
  function clearErr(input, errEl) {
    input.classList.remove('invalid');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
  }

  /* ── Live validation on blur ── */
  nameEl?.addEventListener('blur', validateName);
  emailEl?.addEventListener('blur', validateEmail);
  msgEl?.addEventListener('blur', validateMsg);

  /* ── Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ok = [validateName(), validateEmail(), validateMsg()].every(Boolean);
    if (!ok) return;

    submitBtn?.classList.add('loading');
    feedback.textContent = '';
    feedback.className   = 'form-feedback';

    try {
      await sendToFormspree({
        name:    nameEl.value.trim(),
        email:   emailEl.value.trim(),
        message: msgEl.value.trim(),
      });
      feedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
      feedback.className   = 'form-feedback success';
      form.reset();
    } catch (err) {
      feedback.textContent = '✕ Something went wrong. Please email me directly.';
      feedback.className   = 'form-feedback error';
    } finally {
      submitBtn?.classList.remove('loading');
    }
  });
}

/**
 * sendToFormspree — sends form data to Formspree endpoint.
 *
 * HOW TO SET UP (free, takes 3 minutes):
 *  1. Go to https://formspree.io and sign up
 *  2. Click "New Form" → give it a name → copy your Form ID
 *  3. Set FORMSPREE_ID at the top of this file to that ID
 *     e.g.  const FORMSPREE_ID = 'xpwzgkqb';
 *  4. Submit the form once → verify your email → done!
 *     All messages will arrive at fadlasif123@gmail.com
 */
async function sendToFormspree(data) {
  // Demo mode — remove this block once you set FORMSPREE_ID
  if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
    console.info('[Contact form] Demo mode — data:', data);
    await new Promise(r => setTimeout(r, 1000)); // fake delay
    return;
  }

  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body:    JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.error || 'Formspree error');
  }
}


/* ══════════════════════════════════════
   17. INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  if (typeof PORTFOLIO_DATA === 'undefined') {
    console.error('[Portfolio] PORTFOLIO_DATA not found — ensure data.js loads before main.js.');
    return;
  }

  /* Page transition overlay */
  initPageTransition();

  /* Render dynamic content first */
  renderProjects();
  renderSkills();
  renderTimeline();
  renderCerts();
  renderSocials();

  /* Word reveal — must run after render */
  initWordReveal();

  /* UI & animation systems */
  initTheme();
  initNavbar();
  initCanvas();
  initTyping();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initContactForm();

  console.info('[Portfolio] Fadl Asif E — v2.0 loaded ✓');
});