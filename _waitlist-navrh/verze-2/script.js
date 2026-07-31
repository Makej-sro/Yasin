// ═══════════ NAVBAR SCROLL + SCROLLSPY ═══════════
const navbar    = document.getElementById('navbar');
const navActions = document.getElementById('nav-actions') || document.querySelector('.nav-actions');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
const spySections = ['how-it-works', 'features', 'employers', 'about', 'download']
  .map(id => document.getElementById(id)).filter(Boolean);
// Na podstránkách (např. /pro-zamestnavatele) je aktivní odkaz aktuální stránky
// nastaven natvrdo — scrollspy pak nesmí rozsvěcet sekční kotvy (#download apod.).
const hasStaticActive = !!document.querySelector('.nav-links a.nav-active:not([href^="#"])');

function updateNav() {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 50);

  if (navActions) {
    const hero = document.getElementById('hero');
    navActions.classList.toggle('nav-actions-visible', hero ? scrollY > hero.offsetHeight * 0.8 : true);
  }

  // Navbar nad světlou (bílou) sekcí → ztmavit text
  let overLight = false;
  document.querySelectorAll('.nav-light').forEach(sec => {
    const r = sec.getBoundingClientRect();
    if (r.top <= 70 && r.bottom >= 10) overLight = true;
  });
  navbar.classList.toggle('nav-over-light', overLight);

  if (hasStaticActive) return; // aktivní je jen odkaz aktuální stránky

  const mid = window.innerHeight * 0.35;
  let active = null;
  spySections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= mid) active = sec;
  });
  navLinks.forEach(a => {
    const matches = active && a.getAttribute('href') === '#' + active.id;
    a.classList.toggle('nav-active', matches);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ═══════════ NAVBAR DROPDOWNS ═══════════
function setupNavDropdowns() {
  const menus = {
    'pro-zamestnavatele.html': [
      ['Jak to funguje', '/pro-zamestnavatele.html#jak-to-funguje'],
      ['Dashboard',      '/pro-zamestnavatele.html#dashboard'],
      ['Ceník',          '/pro-zamestnavatele.html#pricing'],
      ['Časté dotazy',   '/podpora.html'],
    ],
    'hledam-si-praci.html': [
      ['Jak to funguje', '/hledam-si-praci.html#how-it-works'],
      ['Vyzkoušej appku','/hledam-si-praci.html#features'],
      ['Stáhnout',       '/hledam-si-praci.html#download'],
    ],
  };
  document.querySelectorAll('.nav-links > a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const key = Object.keys(menus).find(k => href.indexOf(k) !== -1);
    if (!key) return;
    const wrap = document.createElement('div');
    wrap.className = 'nav-dropdown';
    a.parentNode.insertBefore(wrap, a);
    wrap.appendChild(a);
    const menu = document.createElement('div');
    menu.className = 'nav-dropdown-menu';
    menus[key].forEach(([label, url]) => {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = label;
      menu.appendChild(link);
    });
    wrap.appendChild(menu);
  });
}
setupNavDropdowns();

// Po načtení (vč. obrázků) doskroluj přesně na kotvu z URL — opraví posun z lazy-load
window.addEventListener('load', function () {
  if (!location.hash) return;
  var el = null;
  try { el = document.querySelector(location.hash); } catch (e) { return; }
  if (!el) return;
  requestAnimationFrame(function () {
    var y = el.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo(0, y);
  });
});

// ═══════════ MOBILE MENU ═══════════
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('active'));
});

// ═══════════ SMOOTH SCROLL FOR NAV LINKS ═══════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const sel = anchor.getAttribute('href');
    if (!sel || sel === '#') return; // bare hash — nechat auth handlery pracovat
    try {
      const target = document.querySelector(sel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (_) { /* invalid selector — skip */ }
  });
});

// ═══════════ COUNTER ANIMATION ═══════════
function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      counter.textContent = target >= 1000 ? current.toLocaleString('cs-CZ') : current;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ═══════════ SCROLL REVEAL ═══════════
function setupReveal() {
  const revealElements = document.querySelectorAll(
    '.step-card, .feature-card, .testimonial-card, .download-card, .section-header, .cn-plan'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        observer.unobserve(el);
        // Once the entrance animation has played, drop 'reveal' so its
        // transition-delay (used for the staggered entrance) doesn't
        // linger and delay unrelated :hover transitions afterwards.
        setTimeout(() => el.classList.remove('reveal', 'visible'), 900);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

// ═══════════ HERO COUNTER TRIGGER ═══════════
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ═══════════ HERO LINE SCROLL UNDERLINE ═══════════
function setupHeroUnderline() {
  const heroLines = document.querySelectorAll('.hero-line');
  if (!heroLines.length) return;

  // Trigger underlines sequentially when hero heading enters the viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroLines.forEach((line, i) => {
          setTimeout(() => line.classList.add('hero-line--active'), i * 300);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const heroH1 = document.querySelector('#hero h1');
  if (heroH1) observer.observe(heroH1);
}

// ═══════════ INIT ═══════════
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  initAuth();
});

// ═══════════ AUTH / SUPABASE ═══════════
const SUPABASE_URL = 'https://cxegfwfbgcgpwerfbvra.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_N_BIwMCTD6ZOTrtBl3juyw_CGIQ_lvh';

function initAuth() {
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, storageKey: 'makej-auth' }
  });

  const overlay      = document.getElementById('modal-overlay');
  const loginModal   = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  let selectedRole = 'worker';

  // ─── Modal open/close ───
  function openModal(type, role) {
    overlay.classList.add('active');
    if (type === 'login') {
      loginModal.classList.add('active');
      registerModal.classList.remove('active');
      if (role) { applyLoginRole(role); showLoginStep(2); } else { showLoginStep(1); }
      // Restart peeker animation
      const p = document.getElementById('main-peeker');
      if (p) { p.style.animation = 'none'; requestAnimationFrame(() => { p.style.animation = 'peekerIn 0.45s cubic-bezier(.2,.8,.2,1) both'; }); }
    } else {
      registerModal.classList.add('active');
      loginModal.classList.remove('active');
      if (role) {
        applyRole(role);
        showRegStep(2);
      } else {
        showRegStep(1);
      }
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModals() {
    overlay.classList.remove('active');
    loginModal.classList.remove('active');
    registerModal.classList.remove('active');
    document.body.style.overflow = '';
    clearErrors();
  }

  function clearErrors() {
    ['login-error', 'register-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.style.display = 'none'; }
    });
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
  }

  // ─── Register steps ───
  function showRegStep(n) {
    document.getElementById('reg-step-1').style.display = n === 1 ? 'block' : 'none';
    document.getElementById('reg-step-2').style.display = n === 2 ? 'block' : 'none';
  }

  function applyRole(role) {
    selectedRole = role;
    document.getElementById('reg-role-subtitle').textContent =
      role === 'worker' ? 'Brigádník' : 'Zaměstnavatel';
    document.getElementById('reg-company-group').style.display =
      role === 'employer' ? 'block' : 'none';
  }

  // ─── Login steps (rozcestník brigádník / zaměstnavatel) ───
  let loginRole = 'worker';
  let skipAutoRedirect = false;

  function showLoginStep(n) {
    const s1 = document.getElementById('login-step-1');
    const s2 = document.getElementById('login-step-2');
    if (!s1 || !s2) return;
    s1.style.display = n === 1 ? 'block' : 'none';
    s2.style.display = n === 2 ? 'block' : 'none';
  }

  function applyLoginRole(role) {
    loginRole = role;
    const sub = document.getElementById('login-role-subtitle');
    if (sub) sub.textContent = role === 'worker' ? 'Brigádník' : 'Zaměstnavatel';
  }

  document.querySelectorAll('[data-login-role]').forEach(card => {
    card.addEventListener('click', () => {
      applyLoginRole(card.dataset.loginRole);
      showLoginStep(2);
    });
  });

  const loginBackBtn = document.getElementById('login-back');
  if (loginBackBtn) loginBackBtn.addEventListener('click', () => { clearErrors(); showLoginStep(1); });

  // ─── Nav update ───
  // Voláno z onAuthStateChange — jednoduše vymění obsah nav a přidá listenery na nové prvky
  function updateNavAuth(user) {
    const navActions    = document.querySelector('.nav-actions');
    const mobileActions = document.querySelector('.mobile-menu-actions');

    // ─── Update hero CTA section ───
    const heroCTAAuth     = document.getElementById('hero-cta-auth');
    const heroCTALoggedin = document.getElementById('hero-cta-loggedin');
    const heroDashBtn     = document.getElementById('hero-dashboard-btn');
    const heroWorkerBtn   = document.getElementById('hero-worker-btn');

    if (user) {
      navActions.classList.add('nav-actions-visible'); // always show when logged in
      const name = user.user_metadata?.name || user.email.split('@')[0];
      const role = user.user_metadata?.role;
      const dashBtn = role === 'employer'
        ? `<a href="/employer/" class="btn-primary" id="dashboard-btn">
             <iconify-icon icon="solar:chart-square-bold" width="16"></iconify-icon>
             Dashboard
           </a>`
        : `<a href="/worker/" class="btn-primary" id="worker-btn">
             <iconify-icon icon="solar:case-round-bold" width="16"></iconify-icon>
             Moje brigády
           </a>`;
      navActions.innerHTML = `
        ${dashBtn}
        <span class="nav-user-greeting">Ahoj, ${name}!</span>
        <button class="btn-ghost" id="logout-btn">Odhlásit se</button>
      `;
      mobileActions.innerHTML = `
        ${role === 'employer'
          ? `<a href="/employer/" class="btn-primary">Dashboard</a>`
          : `<a href="/worker/" class="btn-primary">Moje brigády</a>`}
        <span class="nav-user-greeting">Ahoj, ${name}!</span>
        <button class="btn-ghost" id="logout-btn-mobile">Odhlásit se</button>
      `;
      document.getElementById('logout-btn').addEventListener('click', () => sb.auth.signOut());
      document.getElementById('logout-btn-mobile').addEventListener('click', () => sb.auth.signOut());

      // Hero CTA: hide auth buttons, show the right dashboard/worker button
      if (heroCTAAuth)     heroCTAAuth.style.display     = 'none';
      if (heroCTALoggedin) heroCTALoggedin.style.display = 'flex';
      if (heroDashBtn)   heroDashBtn.style.display   = role === 'employer' ? 'inline-flex' : 'none';
      if (heroWorkerBtn) heroWorkerBtn.style.display = role !== 'employer' ? 'inline-flex' : 'none';
    } else {
      navActions.innerHTML = `
        <a href="javascript:void(0)" class="btn-ghost" id="nav-login-btn">Přihlásit se</a>
        <a href="javascript:void(0)" class="btn-primary" id="nav-register-btn">Vytvořit účet</a>
      `;
      mobileActions.innerHTML = `
        <a href="javascript:void(0)" class="btn-ghost" id="mobile-login-btn">Přihlásit se</a>
        <a href="javascript:void(0)" class="btn-primary" id="mobile-register-btn">Vytvořit účet</a>
      `;
      // Bind jen čerstvě vytvořené nav prvky (employer btn se binduje zvlášť, jen jednou)
      [
        ['nav-login-btn',      'login'],
        ['nav-register-btn',   'register'],
        ['mobile-login-btn',   'login'],
        ['mobile-register-btn','register'],
      ].forEach(([id, type]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', e => { e.preventDefault(); openModal(type); });
      });

      // Hero CTA: show auth buttons, hide dashboard/worker
      if (heroCTAAuth)     heroCTAAuth.style.display     = 'flex';
      if (heroCTALoggedin) heroCTALoggedin.style.display = 'none';
    }
  }

  // ─── Statická tlačítka (nejsou nikdy přepisována) — bindujeme jen jednou ───
  document.querySelectorAll('.employer-cta-register').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal('register', 'employer'); });
  });
  document.querySelectorAll('.worker-cta-register').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal('register', 'worker'); });
  });

  // Hero CTA buttons (Vytvořit účet zdarma / Přihlásit se)
  const heroRegisterBtn = document.getElementById('hero-register-btn');
  const heroLoginBtn    = document.getElementById('hero-login-btn');
  if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', e => { e.preventDefault(); openModal('register'); });
  if (heroLoginBtn)    heroLoginBtn.addEventListener('click',    e => { e.preventDefault(); openModal('login'); });

  // Hluboký odkaz na přihlášení: /?login=employer (nebo worker) otevře rovnou
  // přihlašovací modál s vybranou rolí. Sem míří i dashboard, když ho někdo
  // otevře nepřihlášený — jedno přihlášení s rozcestníkem pro obojí, žádná
  // druhá přihlašovačka navíc.
  const _loginParam = new URLSearchParams(location.search).get('login');
  if (_loginParam === 'employer' || _loginParam === 'worker') openModal('login', _loginParam);
  else if (_loginParam !== null) openModal('login');

  // Escape key zavře modál
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModals();
  });

  // ─── Modal UI events ───
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModals(); });
  document.getElementById('login-close').addEventListener('click', closeModals);
  document.getElementById('register-close').addEventListener('click', closeModals);
  document.getElementById('switch-to-register').addEventListener('click', e => { e.preventDefault(); openModal('register'); });
  document.getElementById('switch-to-login').addEventListener('click', e => { e.preventDefault(); openModal('login'); });
  document.getElementById('reg-back').addEventListener('click', () => showRegStep(1));

  // pozor: role-card je i v login rozcestníku → bereme jen ty registrační
  document.querySelectorAll('.role-card[data-role]').forEach(card => {
    card.addEventListener('click', () => {
      applyRole(card.dataset.role);
      showRegStep(2);
    });
  });

  // ─── Login form — stejná logika jako makej/src/app/(auth)/login/page.tsx ───
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    const btn = document.getElementById('login-submit');
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    btn.disabled = true;
    btn.textContent = 'Přihlašování...';

    // SIGNED_IN by jinak přesměroval dřív, než ověříme roli — redirect si řídíme sami
    skipAutoRedirect = true;

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
      skipAutoRedirect = false;
      showError('login-error',
        error.message === 'Invalid login credentials'
          ? 'Nesprávný email nebo heslo'
          : translateAuthError(error.message)
      );
      btn.disabled = false;
      btn.textContent = 'Přihlásit se';
      return;
    }

    // Účet má roli v profilu — musí sedět s tím, co si uživatel vybral v rozcestníku
    const { data: profile } = await sb
      .from('profiles').select('role').eq('id', data.user.id).single();

    if (profile && profile.role !== loginRole) {
      await sb.auth.signOut();
      skipAutoRedirect = false;
      showError('login-error', profile.role === 'employer'
        ? 'Tenhle účet je zaměstnavatelský. Vrať se zpět a přihlas se jako zaměstnavatel.'
        : 'Tenhle účet je brigádnický. Vrať se zpět a přihlas se jako brigádník.');
      btn.disabled = false;
      btn.textContent = 'Přihlásit se';
      return;
    }

    // Role sedí → teprve teď pryč. Redirect (a ne jen zavření modálu) je zároveň
    // signál pro správce hesel v prohlížeči, že přihlášení dopadlo dobře.
    const role = (profile && profile.role) || data.user.user_metadata?.role;
    window.location.href = role === 'employer' ? '/employer/' : '/worker/';
  });

  // ─── Zapomenuté heslo — pošle reset odkaz na email ───
  const forgotLink = document.getElementById('login-forgot');
  if (forgotLink) {
    forgotLink.addEventListener('click', async e => {
      e.preventDefault();
      clearErrors();
      const email = document.getElementById('login-email').value.trim();
      if (!email) {
        showError('login-error', 'Nejdřív napiš svůj email a pak klikni na „Zapomněl jsem heslo?".');
        document.getElementById('login-email').focus();
        return;
      }
      forgotLink.textContent = 'Odesílám…';
      forgotLink.style.pointerEvents = 'none';
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/obnova-hesla.html',
      });
      forgotLink.textContent = 'Zapomněl jsem heslo?';
      forgotLink.style.pointerEvents = '';
      if (error) {
        showError('login-error', translateAuthError(error.message));
      } else {
        closeModals();
        showToast('Poslali jsme ti odkaz na obnovu hesla na ' + email + '.');
      }
    });
  }

  // ─── Heslo je vidět jen po dobu držení tlačítka „Zobrazit" (login i registrace) ───
  function setupHoldToShow(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;
    const input  = () => document.getElementById(inputId);
    const reveal = e => { e.preventDefault(); const i = input(); if (i) i.type = 'text'; };
    const hide   = () => { const i = input(); if (i) i.type = 'password'; };
    toggle.addEventListener('pointerdown', reveal);
    toggle.addEventListener('pointerup', hide);
    toggle.addEventListener('pointerleave', hide);
    toggle.addEventListener('pointercancel', hide);
    // pojistka: kdyby uživatel pustil tlačítko mimo prvek
    window.addEventListener('pointerup', hide);
  }
  setupHoldToShow('login-pw-toggle', 'login-password');
  setupHoldToShow('reg-pw-toggle',   'reg-password');
  setupHoldToShow('reg-pw2-toggle',  'reg-password2');

  // ─── Register form — stejná logika jako makej/src/app/(auth)/register/page.tsx ───
  document.getElementById('register-form').addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    const btn      = document.getElementById('register-submit');
    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;
    const company  = document.getElementById('reg-company').value.trim();

    if (!name) {
      showError('register-error', 'Zadejte své jméno.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('register-error', 'Zadejte platný email.');
      return;
    }
    if (password.length < 6) {
      showError('register-error', 'Heslo musí mít alespoň 6 znaků.');
      return;
    }
    if (password !== password2) {
      showError('register-error', 'Hesla se neshodují. Zkontroluj je a zkus to znovu.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Registrace...';

    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: selectedRole,
          company_name: selectedRole === 'employer' ? company : null,
        }
      }
    });

    if (error) {
      showError('register-error', translateAuthError(error.message));
      btn.disabled = false;
      btn.textContent = 'Vytvořit účet';
    } else {
      closeModals();
      showToast('Registrace proběhla! Zkontroluj svůj email pro potvrzení.');
    }
  });

  // ═══════════ ČEKACÍ LIST (WAITLIST) — full-screen split ═══════════
  const wlOverlay   = document.getElementById('wl-overlay');
  const wlPanel     = document.getElementById('wl-panel');
  const wlCompanyGr = document.getElementById('wl-company-group');
  const wlPhoneGr   = document.getElementById('wl-phone-group');
  let   wlRole      = 'worker';
  let   wlDotBg     = null;   // canvasové tečkované pozadí (nastaví se níž)

  function openWaitlist() {
    if (!wlOverlay) return;
    document.body.style.overflow = 'hidden';
    wlOverlay.classList.add('active');
    wlOverlay.setAttribute('aria-hidden', 'false');
    if (wlDotBg) wlDotBg.start();
  }
  function closeWaitlist(dismissed) {
    if (!wlOverlay) return;
    wlOverlay.classList.remove('active');
    wlPanel.classList.remove('active');
    wlOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (wlDotBg) wlDotBg.stop();
    if (dismissed) { try { sessionStorage.setItem('wl-dismissed', '1'); } catch (e) {} }
  }
  function openWlForm(role) {
    wlRole = role;
    wlCompanyGr.style.display = role === 'employer' ? 'block' : 'none';
    wlPhoneGr.style.display   = role === 'employer' ? 'block' : 'none';
    document.getElementById('wl-form-title').textContent = 'Zapiš se na čekací list';
    document.getElementById('wl-form-sub').textContent =
      role === 'employer'
        ? 'Ozveme se vám na e-mail, jakmile 1. 10. spustíme.'
        : 'Ozveme se ti na e-mail, jakmile 1. 10. spustíme.';
    document.getElementById('wl-error').style.display = 'none';
    document.getElementById('wl-form-wrap').style.display = 'block';
    document.getElementById('wl-done').style.display = 'none';
    wlPanel.classList.add('active');
    setTimeout(() => { const n = document.getElementById('wl-name'); if (n) n.focus(); }, 60);
  }

  document.getElementById('wl-close').addEventListener('click', () => closeWaitlist(true));
  document.getElementById('wl-done-close').addEventListener('click', () => closeWaitlist(false));
  document.getElementById('wl-back').addEventListener('click', () => wlPanel.classList.remove('active'));
  wlPanel.addEventListener('click', e => { if (e.target === wlPanel) wlPanel.classList.remove('active'); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (wlPanel.classList.contains('active')) wlPanel.classList.remove('active');
    else if (wlOverlay.classList.contains('active')) closeWaitlist(true);
  });

  // CTA na každé straně → otevři formulář s danou rolí
  document.querySelectorAll('.wl-cta').forEach(btn => {
    btn.addEventListener('click', () => openWlForm(btn.dataset.wlRole));
  });

  // ═══ VERZE 2 (test) — mapa krajů ČR: sestaví SVG z window.KRAJE + hover na kraj ═══
  (function () {
    const svg = document.getElementById('v2-map-svg');
    if (!svg || !window.KRAJE || !window.KRAJE.paths) return;
    const NS = 'http://www.w3.org/2000/svg';
    const boxTop    = document.getElementById('v2-box-top');
    const boxBottom = document.getElementById('v2-box-bottom');

    // TODO verze 2: sem přijdou statistiky podle kraje (zatím boxy necháváme prázdné)
    function showStats(kraj) { /* naplnit boxTop / boxBottom podle kraje */ }
    function clearStats() { /* vyprázdnit boxy */ }

    Object.keys(window.KRAJE.paths).forEach(key => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', window.KRAJE.paths[key]);
      p.setAttribute('class', 'v2-kraj');
      p.setAttribute('data-kraj', key);
      p.setAttribute('aria-label', (window.KRAJE.names && window.KRAJE.names[key]) || key);
      p.addEventListener('mouseenter', () => showStats(key));
      p.addEventListener('mouseleave', clearStats);
      svg.appendChild(p);
    });
  })();

  // Tečkované pozadí (flow field) — PŘESNĚ podle staženého standalone exportu
  // z Claude designu (flow-field-background.html). Neviditelný proud ohýbá mřížku,
  // tečky modrají tam, kde běží nejrychleji; kurzor rozsvítí tečky ve svém kruhu.
  // Spouští se jen když je waitlist otevřený (šetří výkon), jinak 1:1.
  wlDotBg = (function () {
    var canvas = document.getElementById('wl-dotbg');
    if (!canvas || !wlOverlay) return null;
    var CONFIG = {
      dotColor:     '#FFFFFF',
      accentColor:  '#FFFFFF',
      spacing:      14,    // px mezi tečkami
      dotSize:      1.1,   // základní poloměr tečky v px
      cursorRadius: 40,    // px poloměr modrého kruhu u kurzoru
      showRing:     false, // jemný obrys kolem kruhu kurzoru
      speed:        1      // 1 = normál, 0.5 = poloviční rychlost
    };

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dots = [], mx = -9999, my = -9999, t0 = performance.now();
    var raf = null, running = false;

    // Kurzorové podsvícení: po zastavení plynule zajede do středu (0,5 s),
    // při dalším pohybu se hned zase objeví (grow instantní).
    var curR = 0;                 // aktuální (animovaný) poloměr modrého kruhu
    var idleTimer = null;         // odpočet do „klidu"
    var collapsing = false, collapseT0 = 0, collapseFrom = 0;
    var IDLE_MS = 800, COLLAPSE_MS = 500;

    function hexToRgb(h) {
      var v = parseInt(String(h).replace('#', ''), 16);
      return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    }
    var DOT = hexToRgb(CONFIG.dotColor), ACC = hexToRgb(CONFIG.accentColor);

    var LEV = 10, COLORS = [];
    for (var l = 0; l < LEV; l++) {
      // bílé tečky na modrém pozadí; flow mění jen jas/velikost (přes alfu a poloměr)
      var k = l / (LEV - 1);
      COLORS.push('rgb(' + Math.round(DOT[0] + (ACC[0] - DOT[0]) * k) + ',' +
                           Math.round(DOT[1] + (ACC[1] - DOT[1]) * k) + ',' +
                           Math.round(DOT[2] + (ACC[2] - DOT[2]) * k) + ')');
    }

    // druhá paleta jen pro podsvícení u kurzoru — neonově žlutá #FFD600
    var ACC_Y = hexToRgb('#B6FF00'), COLORS_Y = [];   // limetková neon u kurzoru
    for (var ly = 0; ly < LEV; ly++) {
      // stejně jako u modré na maximum → tečky u kurzoru rychle dosáhnou plné #B6FF00
      var ky = Math.min(1, (ly / (LEV - 1)) * 4);
      COLORS_Y.push('rgb(' + Math.round(DOT[0] + (ACC_Y[0] - DOT[0]) * ky) + ',' +
                             Math.round(DOT[1] + (ACC_Y[1] - DOT[1]) * ky) + ',' +
                             Math.round(DOT[2] + (ACC_Y[2] - DOT[2]) * ky) + ')');
    }

    // vykreslí sadu „kbelíků" teček danou paletou (větší úroveň = jasnější + větší)
    // aBoost > 1 = tečky víc kryjí (viditelnější), velikost i počet zůstávají stejné
    function drawBuckets(bk, cols, aBoost) {
      aBoost = aBoost || 1;
      for (var lv = 0; lv < LEV; lv++) {
        var b = bk[lv];
        if (!b.length) continue;
        var kk = lv / (LEV - 1);
        var r = CONFIG.dotSize * (1 + kk * 0.7);
        ctx.fillStyle = cols[lv];
        ctx.globalAlpha = Math.min(1, (0.55 + kk * 0.45) * aBoost);
        ctx.beginPath();
        for (var n = 0; n < b.length; n += 2) {
          ctx.moveTo(b[n] + r, b[n + 1]);
          ctx.arc(b[n], b[n + 1], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }

    function buildGrid() {
      var s = CONFIG.spacing;
      var cols = Math.ceil(W / s) + 1, rows = Math.ceil(H / s) + 1;
      var ox = (W - (cols - 1) * s) / 2, oy = (H - (rows - 1) * s) / 2;
      dots = [];
      for (var j = 0; j < rows; j++)
        for (var i = 0; i < cols; i++) dots.push(ox + i * s, oy + j * s);
    }

    function resize() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    function draw() {
      var t = ((performance.now() - t0) / 1000) * CONFIG.speed;
      ctx.clearRect(0, 0, W, H);

      // plynulé „zajetí" kurzorového kruhu do středu při klidu (od krajů do středu)
      if (collapsing) {
        var cp = (performance.now() - collapseT0) / COLLAPSE_MS;
        if (cp >= 1) { curR = 0; collapsing = false; }
        else { curR = collapseFrom * (1 - cp * cp * (3 - 2 * cp)); }
      }

      var buckets = [], yBuckets = [];
      for (var l = 0; l < LEV; l++) { buckets.push([]); yBuckets.push([]); }

      var hasCursor = (mx > -9000 && curR > 0.5);
      for (var i = 0; i < dots.length; i += 2) {
        var x = dots[i], y = dots[i + 1];

        // --- the flow field ---
        var ang = Math.sin(x * 0.0048 + t * 0.28) * 1.7 + Math.cos(y * 0.0056 - t * 0.22) * 1.7;
        var mag = 7 + 6 * Math.sin(x * 0.003 + y * 0.0038 + t * 0.55);
        var dx = Math.cos(ang) * mag;
        var dy = Math.sin(ang) * mag;
        var e = clamp(0.5 + 0.5 * Math.sin(ang * 1.6 + t * 0.4) - 0.12);
        e = e * e;
        var px = x + dx, py = y + dy;

        // flow field (modrá) — vždy
        buckets[Math.round(clamp(e) * (LEV - 1))].push(px, py);

        // kurzorové podsvícení (limetková) — navrch, jen v kruhu u kurzoru
        if (hasCursor) {
          var d = Math.hypot(x - mx, y - my);
          var yl = Math.round(clamp((curR - d) / 14) * (LEV - 1));
          if (yl >= 1) yBuckets[yl].push(px, py);
        }
      }

      drawBuckets(buckets, COLORS, 1.2);               // modré tečky, flow je vybělí k bílé
      if (hasCursor) drawBuckets(yBuckets, COLORS_Y, 1.8);  // limetkové tečky u kurzoru navrch — výrazné
      ctx.globalAlpha = 1;

      if (CONFIG.showRing && mx > -9000 && curR > 0.5) {
        ctx.strokeStyle = 'rgb(' + ACC.join(',') + ')';
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, curR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e) {
      mx = e.clientX; my = e.clientY;
      curR = CONFIG.cursorRadius;   // hned se objeví (grow instantní)
      collapsing = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        collapsing = true; collapseT0 = performance.now(); collapseFrom = curR;
      }, IDLE_MS);
    }
    function onLeave() {
      mx = -9999; my = -9999;
      clearTimeout(idleTimer);
      collapsing = false; curR = 0;
    }

    return {
      start: function () {
        if (running) return;
        running = true;
        t0 = performance.now();
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseleave', onLeave);
        raf = requestAnimationFrame(draw);
      },
      stop: function () {
        if (!running) return;
        running = false;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseleave', onLeave);
        clearTimeout(idleTimer);
        collapsing = false; curR = 0; mx = -9999; my = -9999;
      }
    };
  })();

  // Přepínač brigádník / zaměstnavatel (jedna karta, segmented switch)
  (function () {
    const toggle = document.querySelector('.wl-toggle');
    if (!toggle) return;
    const opts = toggle.querySelectorAll('.wl-toggle-opt');
    const panels = document.querySelectorAll('[data-wl-panel]');
    function setTab(tab) {
      opts.forEach(o => o.classList.toggle('is-active', o.dataset.wlTab === tab));
      panels.forEach(p => { p.classList.toggle('is-off', p.dataset.wlPanel !== tab); });
      toggle.classList.toggle('is-employer', tab === 'employer');
      if (window.wlSetSocialRole) window.wlSetSocialRole(tab);
    }
    opts.forEach(o => o.addEventListener('click', () => setTab(o.dataset.wlTab)));
  })();

  // Odpočet do spuštění (1. 10. 2026)
  (function () {
    const cdD = document.getElementById('wl-cd-d');
    if (!cdD) return;
    const target = new Date(2026, 9, 1, 0, 0, 0).getTime();
    const pad = n => String(n).padStart(2, '0');
    function tick() {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);     diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      cdD.textContent = d;
      document.getElementById('wl-cd-h').textContent = pad(h);
      document.getElementById('wl-cd-m').textContent = pad(m);
      document.getElementById('wl-cd-s').textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  })();

  // Sociální důkaz „za 24 h se přihlásilo XX brigádníků / zaměstnavatelů".
  // Mění se s přepínačem. Zatím věrohodný FEJK — deterministický podle dne
  // (nepřeskakuje při refreshi), přes den mírně roste.
  // TODO: napojit na reálný COUNT z tabulky waitlist podle role.
  (function () {
    const numEl  = document.getElementById('wl-social-num');
    const nounEl = document.getElementById('wl-social-noun');
    if (!numEl) return;
    let current = 'worker';
    function dailyCount(role) {
      const now = new Date();
      const dayKey = Math.floor(now.getTime() / 86400000);
      const seed = role === 'employer' ? 411.7 : 127.13;
      let x = Math.sin(dayKey * seed) * 43758.5453;
      x = x - Math.floor(x);                        // 0..1, stabilní pro daný den
      if (role === 'employer') {
        return 5 + Math.floor(x * 12) + Math.floor(now.getHours() / 8);  // ~5..18
      }
      return 28 + Math.floor(x * 34) + Math.floor(now.getHours() / 5);   // ~28..66
    }
    function render() {
      numEl.textContent = dailyCount(current);
      if (nounEl) nounEl.textContent = current === 'employer' ? 'zaměstnavatelů' : 'brigádníků';
    }
    window.wlSetSocialRole = function (r) { current = r; render(); };
    render();
    setInterval(render, 60000);
  })();

  // Odeslání na čekací list
  document.getElementById('wl-form').addEventListener('submit', async e => {
    e.preventDefault();
    document.getElementById('wl-error').style.display = 'none';
    const btn     = document.getElementById('wl-submit');
    const name    = document.getElementById('wl-name').value.trim();
    const email   = document.getElementById('wl-email').value.trim();
    const company = document.getElementById('wl-company').value.trim();
    const phone   = document.getElementById('wl-phone').value.trim();

    if (!name) { showError('wl-error', 'Zadej své jméno.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('wl-error', 'Zadej platný email.'); return; }
    if (wlRole === 'employer' && !company) { showError('wl-error', 'Zadej název firmy.'); return; }
    if (wlRole === 'employer' && !phone) { showError('wl-error', 'Zadej telefon, ať se ti můžeme ozvat.'); return; }

    btn.disabled = true;
    btn.textContent = 'Ukládám…';

    const { error } = await sb.from('waitlist').insert({
      role: wlRole,
      name,
      email,
      company_name: wlRole === 'employer' ? company : null,
      phone: wlRole === 'employer' ? phone : null,
    });

    if (error) {
      if (error.code === '23505') {
        // už na seznamu je → ber to jako úspěch
        try { localStorage.setItem('wl-joined', '1'); } catch (er) {}
        document.getElementById('wl-form-wrap').style.display = 'none';
        document.getElementById('wl-done').style.display = 'block';
        return;
      }
      showError('wl-error', 'Nepodařilo se uložit. Zkus to prosím za chvíli.');
      btn.disabled = false;
      btn.textContent = 'Chci být u toho';
      return;
    }

    try { localStorage.setItem('wl-joined', '1'); } catch (er) {}
    document.getElementById('wl-form-wrap').style.display = 'none';
    document.getElementById('wl-done').style.display = 'block';
  });

  // ⚠️⚠️ DOČASNÉ – JEN PRO VÝVOJ: popup vyskočí VŽDY po každém refreshi.
  //   PŘED SPUŠTĚNÍM PRO REÁLNÉ UŽIVATELE DÁT NA false (nebo smazat)!
  //   Reální uživatelé mají vidět popup jen jednou (viz větev níž).
  const WL_DEV_ALWAYS = true;

  // Auto-otevření po načtení — ne když už je zapsán/zavřel to, nebo je přihlášený
  const wlForce  = (() => { try { return new URLSearchParams(location.search).has('wl'); } catch (e) { return false; } })();
  const wlSeen   = (() => { try { return localStorage.getItem('wl-joined') || sessionStorage.getItem('wl-dismissed'); } catch (e) { return null; } })();
  const wlLogged = (() => { try { return !!localStorage.getItem('makej-auth'); } catch (e) { return false; } })();
  if (WL_DEV_ALWAYS || wlForce) {
    setTimeout(openWaitlist, 300);              // dev / ?wl v adrese = vždy ukázat
  } else if (!wlSeen && !wlLogged) {
    setTimeout(openWaitlist, 900);
  }

  // ─── Google OAuth — stejný provider jako v makej ───
  document.getElementById('login-google').addEventListener('click', async () => {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  });

  // ─── Auth state — Supabase v2 posílá INITIAL_SESSION při startu, getSession není potřeba ───
  sb.auth.onAuthStateChange((event, session) => {
    updateNavAuth(session?.user || null);

    // INITIAL_SESSION = obnova existující session při načtení stránky → nepřesměrovávat
    // SIGNED_IN = aktivní přihlášení (formulář / Google OAuth callback) → přesměrovat
    // skipAutoRedirect = login formulář si redirect řídí sám (až po kontrole role)
    if (event === 'SIGNED_IN' && session?.user && !skipAutoRedirect) {
      const role = session.user.user_metadata?.role;
      window.location.href = role === 'employer' ? '/employer/' : '/worker/';
    }
  });
}

function translateAuthError(msg) {
  if (msg.includes('Invalid login credentials'))   return 'Nesprávný email nebo heslo.';
  if (msg.includes('missing') && (msg.includes('email') || msg.includes('phone'))) return 'Zadejte email a heslo.';
  if (msg.includes('Email not confirmed'))          return 'Nejdřív potvrď svůj email.';
  if (msg.includes('User already registered'))      return 'Tento email je již zaregistrovaný.';
  if (msg.includes('already been registered'))      return 'Tento email je již zaregistrovaný.';
  if (msg.includes('Password should be at least'))  return 'Heslo musí mít alespoň 6 znaků.';
  if (msg.includes('rate limit'))                   return 'Příliš mnoho pokusů, zkus to za chvíli.';
  if (msg.includes('invalid') && msg.includes('email')) return 'Zadejte platný email.';
  if (msg.includes('Email address') && msg.includes('invalid')) return 'Zadejte platný email.';
  if (msg.includes('Signup is disabled'))           return 'Registrace je momentálně nedostupná.';
  if (msg.includes('over_email_send_rate_limit'))   return 'Příliš mnoho emailů, zkus to za chvíli.';
  return msg;
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'auth-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

// ═══════════ COOKIE CONSENT BANNER ═══════════
(function () {
  const COOKIE_KEY = 'makej-cookie-consent';
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  // Pokud uživatel už rozhodl, nezobrazuj banner
  if (localStorage.getItem(COOKIE_KEY)) return;

  // Zobraz banner s malým zpožděním (po načtení stránky)
  setTimeout(() => banner.classList.add('visible'), 800);

  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    banner.classList.remove('visible');
  });

  document.getElementById('cookie-reject').addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    banner.classList.remove('visible');
  });
})();

// ═══════════ PEEKER (cursor-tracking face in login modal) ═══════════
(function() {
  var peeker = document.getElementById('main-peeker');
  var eyeL   = document.getElementById('main-eyeL');
  var eyeR   = document.getElementById('main-eyeR');
  var pupilL = document.getElementById('main-pupilL');
  var pupilR = document.getElementById('main-pupilR');
  var browL  = document.getElementById('main-browL');
  var browR  = document.getElementById('main-browR');
  var lidL   = document.getElementById('main-lidL');
  var lidR   = document.getElementById('main-lidR');
  if (!peeker) return;

  var isPwd = false;
  var blinkTimer = null;
  var peekTimers = [];

  function movePupil(pupilEl, eyeEl, mx, my) {
    var rect = eyeEl.getBoundingClientRect();
    if (!rect.width) return;
    var cx = rect.left + rect.width  / 2;
    var cy = rect.top  + rect.height / 2;
    var dx = mx - cx, dy = my - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var r = 4.5;
    var s = Math.min(dist, r) / Math.max(dist, 0.001);
    pupilEl.style.transform = 'translate(' + (dx * s).toFixed(2) + 'px,' + (dy * s).toFixed(2) + 'px)';
  }

  document.addEventListener('mousemove', function(e) {
    if (!peeker || peeker.offsetParent === null) return;
    movePupil(pupilL, eyeL, e.clientX, e.clientY);
    movePupil(pupilR, eyeR, e.clientX, e.clientY);
  });

  function setLid(speed) {
    if (!lidL || !lidR) return;
    lidL.style.transition = 'height ' + speed + ' ease';
    lidR.style.transition = 'height ' + speed + ' ease';
  }

  function scheduleBlink() {
    blinkTimer = setTimeout(function() {
      if (isPwd) return;
      setLid('0.08s');
      lidL.style.height = '21px'; lidR.style.height = '21px';
      setTimeout(function() {
        lidL.style.height = '0'; lidR.style.height = '0';
        setTimeout(function() { setLid('0.28s'); scheduleBlink(); }, 120);
      }, 100);
    }, 5000);
  }

  function clearPeekTimers() { peekTimers.forEach(clearTimeout); peekTimers = []; }

  function schedulePeek() {
    peekTimers.push(setTimeout(function() {
      lidR.style.height = '11px';
      peekTimers.push(setTimeout(function() {
        lidR.style.height = '21px';
        peekTimers.push(setTimeout(schedulePeek, 5000));
      }, 1000));
    }, 3000));
  }

  function peekAtPassword() {
    isPwd = true;
    peeker.style.animation = 'none';
    clearTimeout(blinkTimer);
    clearPeekTimers();
    peeker.style.transform = 'translateX(-50%)';
    setLid('0.28s');
    lidL.style.height = '21px'; lidR.style.height = '21px';
    browL.style.transform = 'translateY(5px)';
    browR.style.transform = 'translateY(5px)';
    schedulePeek();
  }

  function stopPeeking() {
    isPwd = false;
    clearPeekTimers();
    peeker.style.animation = 'none';
    peeker.style.transform = 'translateX(-50%)';
    setLid('0.28s');
    lidL.style.height = '0'; lidR.style.height = '0';
    browL.style.transform = ''; browR.style.transform = '';
    scheduleBlink();
  }

  var pwdField = document.getElementById('login-password');
  if (pwdField) {
    pwdField.addEventListener('focus', peekAtPassword);
    pwdField.addEventListener('blur',  stopPeeking);
  }

  scheduleBlink();
})();

/* ── Showcase toggle: switch between the interactive phone and the feature grid ── */
(function () {
  var toggle = document.getElementById('showcase-toggle');
  var stage  = document.querySelector('.showcase-stage');
  if (!toggle || !stage) return;

  var btns  = toggle.querySelectorAll('.sct-btn');
  var views = stage.querySelectorAll('.showcase-view');

  function setView(view) {
    toggle.setAttribute('data-active', view);
    btns.forEach(function (b) {
      var on = b.getAttribute('data-view') === view;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    views.forEach(function (v) {
      v.classList.toggle('is-active', v.getAttribute('data-view') === view);
    });
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () { setView(b.getAttribute('data-view')); });
  });
})();


/* ═══════════ REFERENCE — kroužkový sešit s listováním ═══════════ */
(function () {
  // Placeholdery — nahradit skutečnými ohlasy a fotkami. Bez firem a „ověřeno".
  // photo: cesta k fotce uživatele (až budou reálné); zatím fallback = avatar s iniciálou.
  var reviews = [
    { text: 'Za tři dny jsem měl první brigádu. Večer jsem swipnul pár nabídek a ráno mi napsala kavárna.', name: 'Tomáš H.', role: 'Barista', date: '14. 6. 2025', photo: '' },
    { text: 'Konečně appka, kde ke každé nabídce nemusím psát životopis. Pár tapů a je to.', name: 'Klára M.', role: 'Servírka', date: '2. 7. 2025', photo: '' },
    { text: 'Bral jsem to jako přivýdělek při škole, teď tam chodím pravidelně. Firmy odpovídají fakt rychle.', name: 'Petr V.', role: 'Skladník', date: '21. 6. 2025', photo: '' },
    { text: 'Líbí se mi, že vidím hodinovku hned — žádné „mzda dle dohody".', name: 'Aneta L.', role: 'Výpomoc na eventech', date: '9. 7. 2025', photo: '' },
    { text: 'Jsem tu skoro od začátku a je vidět, že se to pořád zlepšuje. Super práce!', name: 'Pavel K.', role: 'Rozvoz', date: '18. 7. 2025', photo: '' },
  ];

  var stack = document.getElementById('ref-stack');
  if (!stack) return;

  function fill(cardEl, r) {
    cardEl.querySelector('.ref-name').textContent = r.name;
    cardEl.querySelector('.ref-meta').textContent = r.role + ' · ' + r.date;
    cardEl.querySelector('.ref-text').textContent = r.text;
  }

  // Postav viditelné karty balíčku (max 3)
  var VISIBLE = Math.min(3, reviews.length);
  var nodes = [];
  for (var k = 0; k < VISIBLE; k++) {
    var c = document.createElement('div');
    c.className = 'rs-card';
    c.dataset.slot = k;
    c.innerHTML = '<div class="ref-name"></div><div class="ref-meta"></div><p class="ref-text"></p>';
    fill(c, reviews[k]);
    nodes.push(c);
    stack.appendChild(c);
  }

  var nextRev = VISIBLE % reviews.length;
  var busy = false, timer;

  function nodeAtSlot(s) {
    for (var n = 0; n < nodes.length; n++) if (+nodes[n].dataset.slot === s) return nodes[n];
    return null;
  }

  function advance() {
    if (busy || reviews.length <= 1) return;
    busy = true;
    clearInterval(timer);

    var leaving = nodeAtSlot(0);
    // ostatní popojedou o slot dopředu
    for (var s = 1; s < VISIBLE; s++) {
      var nd = nodeAtSlot(s);
      if (nd) nd.dataset.slot = s - 1;
    }
    // 1. fáze — přední karta odjede nahoru a zmizí
    leaving.classList.add('leaving');

    setTimeout(function () {
      // 2. fáze — vymění obsah a sjede dozadu za ostatní (nafejduje se)
      fill(leaving, reviews[nextRev]);
      nextRev = (nextRev + 1) % reviews.length;
      leaving.dataset.slot = VISIBLE - 1;
      leaving.classList.remove('leaving');
      setTimeout(function () { busy = false; startTimer(); }, 720);
    }, 540);
  }

  function startTimer() { clearInterval(timer); timer = setInterval(advance, 6000); }

  // Klik na balíček = další reference
  stack.addEventListener('click', function () { if (!busy) { advance(); startTimer(); } });

  startTimer();
})();
