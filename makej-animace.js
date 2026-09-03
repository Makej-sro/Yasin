/* ═══════════════════════════════════════════════════════════
   MAKEJ — scroll animace pro stránku „O nás"
   Drop-in, bez závislostí. Patří k makej-animace.css.
   Vlož do <head>:
     <link rel="stylesheet" href="makej-animace.css">
     <script src="makej-animace.js"></script>
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;

  root.classList.add('mk-on');

  /* Co se odhaluje a jak. stagger = zpoždění mezi sourozenci (ms). */
  var PLAN = [
    { sel: '.on-hero > p',              kind: 'up',    delay: 320 },
    { sel: '.on-hero-cta > *',          kind: 'up',    delay: 440, stagger: 80 },

    { sel: '.on-h2, .on-future h2, .on-team-h', kind: 'head' },
    { sel: '.on-sub, .on-team-sub',     kind: 'up' },

    { sel: '.on-band',                  kind: 'panel' },
    { sel: '.on-pain',                  kind: 'up',    stagger: 65 },
    { sel: '.on-band-note',             kind: 'up',    delay: 120 },

    { sel: '.on-two > .on-card:first-child', kind: 'left' },
    { sel: '.on-two > .on-card:last-child',  kind: 'right' },
    { sel: '.on-check li',              kind: 'up',    stagger: 45 },

    { sel: '.on-feat__cell',            kind: 'up',    stagger: 60 },

    { sel: '.on-sol__col--light',       kind: 'left' },
    { sel: '.on-sol__col--blue',        kind: 'right' },
    { sel: '.on-list li',               kind: 'up',    stagger: 35 },

    { sel: '.on-banner',                kind: 'panel' },
    { sel: '.on-story p',               kind: 'up',    delay: 100 },

    { sel: '.on-future',                kind: 'panel' },
    { sel: '.on-future-item',           kind: 'up',    stagger: 70 },
    { sel: '.on-future-note',           kind: 'up' },
    { sel: '.on-person',                kind: 'pop',   stagger: 90 },

    { sel: '.blog-head',                kind: 'up' },
    { sel: '.blog-card',                kind: 'up',    stagger: 90 },

    { sel: '.dl-stage',                 kind: 'panel' },
    { sel: '.on-final h2, .on-final p, .on-final-cta > *', kind: 'up', stagger: 70 }
  ];

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {

    /* ── Pozadí ────────────────────────────────────────────── */
    var bg = document.createElement('div');
    bg.className = 'mk-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML =
      '<div class="mk-bg__par mk-bg__par--a"><div class="mk-bg__glow mk-bg__glow--a"></div></div>' +
      '<div class="mk-bg__par mk-bg__par--b"><div class="mk-bg__glow mk-bg__glow--b"></div></div>' +
      '<div class="mk-bg__grid"></div>';
    document.body.appendChild(bg);

    /* ── Odhalování při scrollu ────────────────────────────── */
    /* Přehraje se jednou. Co je jednou odhalené, zůstává. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('mk-in');
        io.unobserve(el);
        setTimeout(function () { el.classList.add('mk-done'); }, 1600);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    function register(el, kind, delay) {
      if (!el || el.hasAttribute('data-mk')) return;
      el.setAttribute('data-mk', kind);
      if (delay) el.style.transitionDelay = delay + 'ms';
      io.observe(el);
    }

    PLAN.forEach(function (rule) {
      var els = document.querySelectorAll(rule.sel);
      var base = rule.delay || 0;
      var groups = new Map();
      els.forEach(function (el) {
        var d = base;
        if (rule.stagger) {
          var p = el.parentNode;
          var i = groups.get(p) || 0;
          d = base + Math.min(i * rule.stagger, 420);
          groups.set(p, i + 1);
        }
        register(el, rule.kind, d);
      });
    });

    /* ── Hero: nadpis vyjede po řádcích ────────────────────── */
    var h1 = document.querySelector('.on-hero h1');
    if (h1 && !reduced) {
      var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
      var words = h1.textContent.trim().split(/\s+/);
      h1.innerHTML = words.map(function (w) { return '<span class="mk-w">' + esc(w) + '</span>'; }).join(' ');

      var lines = [], cur = [], top = null;
      h1.querySelectorAll('.mk-w').forEach(function (s) {
        var t = Math.round(s.getBoundingClientRect().top);
        if (top === null || Math.abs(t - top) > 3) { if (cur.length) lines.push(cur); cur = []; top = t; }
        cur.push(s.textContent);
      });
      if (cur.length) lines.push(cur);

      h1.innerHTML = lines.map(function (l) {
        return '<span class="mk-line"><span class="mk-line-in">' + esc(l.join(' ')) + '</span></span>';
      }).join('');

      h1.querySelectorAll('.mk-line-in').forEach(function (el, i) {
        el.style.transitionDelay = (60 + i * 110) + 'ms';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { el.classList.add('mk-in'); });
        });
      });
    }

    /* ── Osm kroků: jedna kaskáda, spuštěná jedním pozorovatelem ── */
    var steps = document.querySelector('.on-steps');
    if (steps) {
      steps.querySelectorAll('.on-step').forEach(function (el, i) {
        el.style.setProperty('--i', i);
      });
      var sio = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          steps.classList.add('mk-run');
          sio.unobserve(steps);
        });
      }, { threshold: 0.08 });
      sio.observe(steps);
    }

    /* ── Modrý banner: jednorázový přelet světla ───────────── */
    var banner = document.querySelector('.on-banner');
    if (banner && !reduced) {
      var bio = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          setTimeout(function () { banner.classList.add('mk-sheen'); }, 300);
          bio.unobserve(banner);
        });
      }, { threshold: 0.35 });
      bio.observe(banner);
    }

    /* ── Jeden scroll handler pro vše průběžné ─────────────── */
    var grid = bg.querySelector('.mk-bg__grid');
    var glowA = bg.querySelector('.mk-bg__par--a');
    var glowB = bg.querySelector('.mk-bg__par--b');
    var ticking = false;

    function frame() {
      ticking = false;
      var y = window.pageYOffset || root.scrollTop;

      if (!reduced) {
        if (grid)  grid.style.transform  = 'translate3d(0,' + (y * -0.035).toFixed(1) + 'px,0)';
        if (glowA) glowA.style.transform = 'translate3d(0,' + (y * 0.05).toFixed(1) + 'px,0)';
        if (glowB) glowB.style.transform = 'translate3d(0,' + (y * -0.045).toFixed(1) + 'px,0)';
      }

    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    frame();
  });
})();
