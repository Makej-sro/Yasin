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
      ['Proč Makej',     '/hledam-si-praci.html#features'],
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

  // ── PŘÍSTUPOVÝ KLÍČ ────────────────────────────────────────────────────────
  // Web je před spuštěním: registrace běží pro všechny, ale PŘIHLÁSIT se (a jít
  // do dashboardu) může jen ten, kdo v přihlašovacím formuláři zadá platný klíč.
  // Klíč rozdává Yasin oficiálním testovacím / vývojářským účtům.
  //   ⇒ ZMĚNIT KLÍČ = uprav ACCESS_KEY.  ⇒ NAOSTRO = dej ACCESS_KEY na '' (pustí všechny).
  const ACCESS_KEY = '8939';
  const ACCESS_LOCKED_MSG =
    'Spouštíme 1. 10. — zrovna na tom makáme. 💪 Jakmile bude hotovo, dáme ti vědět e-mailem.';
  function accessKeyOk() {
    if (!ACCESS_KEY) return true;
    const el = document.getElementById('login-key');
    return !!el && el.value.trim() === ACCESS_KEY;
  }
  // true = registrace byla otevřena z waitlistu → „Zpět" vede zpět na waitlist,
  // ne na rozcestník s výběrem role. Resetuje se při každém otevření modálu.
  let regFromWaitlist = false;

  // ─── Modal open/close ───
  function openModal(type, role) {
    regFromWaitlist = false;
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
  document.getElementById('reg-back').addEventListener('click', () => {
    if (regFromWaitlist) { closeModals(); openWaitlist(); }   // přišel z waitlistu → zpět na waitlist
    else showRegStep(1);                                      // jinak zpět na rozcestník
  });

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

    // Přístupový klíč — bez platného klíče se nikdo nepřihlásí (web makáme na tom).
    if (!accessKeyOk()) {
      showError('login-error', ACCESS_LOCKED_MSG);
      return;
    }

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
        // Potvrzovací e-mail vrátí člověka tam, odkud se registroval
        // (localhost při testu, makej.eu na živu). V Supabase → Authentication →
        // URL Configuration musí být tahle adresa v „Redirect URLs" (allowlist).
        emailRedirectTo: window.location.origin,
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

  // CTA na každé straně → zavři čekací list a otevři NORMÁLNÍ registraci
  // s danou rolí (brigádník / zaměstnavatel). Žádná separátní waitlist tabulka —
  // rovnou se zakládá reálný účet přes sb.auth.signUp (viz register-form výš).
  function wlGoRegister(role) {
    // Klikl na CTA → bereme to jako „viděl waitlist", ať ho popup příště neotravuje.
    try { localStorage.setItem('wl-joined', '1'); } catch (e) {}
    closeWaitlist(false);                      // zavři čekací list (bez „dismissed")
    openModal('register', role || 'worker');   // otevři registraci rovnou na kroku 2 s rolí
    regFromWaitlist = true;                     // „Zpět" pak vede na waitlist, ne na rozcestník
  }
  document.querySelectorAll('.wl-cta, .wl-cta-flip').forEach(btn => {
    btn.addEventListener('click', () => wlGoRegister(btn.dataset.wlRole));
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wlGoRegister(btn.dataset.wlRole); }
    });
  });

  // Tečkované pozadí (flow field) — PŘESNĚ podle staženého standalone exportu
  // z Claude designu (flow-field-background.html). Neviditelný proud ohýbá mřížku,
  // tečky modrají tam, kde běží nejrychleji; kurzor rozsvítí tečky ve svém kruhu.
  // Spouští se jen když je waitlist otevřený (šetří výkon), jinak 1:1.
  // Repel efekt kurzoru (dodaný kód) — tečky u kurzoru se plynule odsunou pryč a vrátí.
  var repel = (function () {
    var CFG = { radius: 50, maxOffset: 14, ease: 0.16 };
    var ox = new Float32Array(0), oy = new Float32Array(0);
    var mx = -9999, my = -9999, out = { dx: 0, dy: 0, heat: 0 };

    function resize(count) { ox = new Float32Array(count); oy = new Float32Array(count); }

    function attach() {
      window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
      window.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });
    }

    // idx = index tečky, x/y = její domácí pozice
    function sample(idx, x, y) {
      var R = CFG.radius * 1.35, tx = 0, ty = 0, push = 0;
      if (mx > -9000) {
        var ddx = x - mx, ddy = y - my;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < R) {
          var f = 1 - d / R;
          f = f * f * (3 - 2 * f);            // smoothstep — plynulé, neodskočí
          push = f;
          var inv = d > 1 ? 1 / d : 1;
          tx = ddx * inv * f * CFG.maxOffset;
          ty = ddy * inv * f * CFG.maxOffset;
        }
      }
      ox[idx] += (tx - ox[idx]) * CFG.ease;   // odjede
      oy[idx] += (ty - oy[idx]) * CFG.ease;   // a stejně plynule zpět
      var off = Math.sqrt(ox[idx] * ox[idx] + oy[idx] * oy[idx]);
      out.dx = ox[idx]; out.dy = oy[idx];
      out.heat = Math.max(push, Math.min(1, off / CFG.maxOffset));
      return out;
    }

    return { config: CFG, resize: resize, attach: attach, sample: sample };
  })();

  wlDotBg = (function () {
    var canvas = document.getElementById('wl-dotbg');
    if (!canvas || !wlOverlay) return null;
    var CONFIG = {
      dotColor:    '#FFFFFF',
      accentColor: '#FFFFFF',
      spacing:     14,   // px mezi tečkami
      dotSize:     1.1,  // základní poloměr tečky v px
      speed:       1     // ambient flow: 1 = normál
    };

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dots = [], t0 = performance.now();
    var raf = null, running = false;

    function hexToRgb(h) {
      var v = parseInt(String(h).replace('#', ''), 16);
      return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    }
    var DOT = hexToRgb(CONFIG.dotColor), ACC = hexToRgb(CONFIG.accentColor);

    var LEV = 10, COLORS = [];
    for (var l = 0; l < LEV; l++) {
      var k = l / (LEV - 1);
      COLORS.push('rgb(' + Math.round(DOT[0] + (ACC[0] - DOT[0]) * k) + ',' +
                           Math.round(DOT[1] + (ACC[1] - DOT[1]) * k) + ',' +
                           Math.round(DOT[2] + (ACC[2] - DOT[2]) * k) + ')');
    }

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
      repel.resize(dots.length / 2);   // jeden offset na tečku
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

      var buckets = [];
      for (var l = 0; l < LEV; l++) buckets.push([]);

      for (var i = 0; i < dots.length; i += 2) {
        var x = dots[i], y = dots[i + 1];

        // jemný ambient flow field (šum pozadí)
        var ang = Math.sin(x * 0.0048 + t * 0.28) * 1.7 + Math.cos(y * 0.0056 - t * 0.22) * 1.7;
        var mag = 7 + 6 * Math.sin(x * 0.003 + y * 0.0038 + t * 0.55);
        var e = clamp(0.5 + 0.5 * Math.sin(ang * 1.6 + t * 0.4) - 0.12);
        e = e * e;

        // repel u kurzoru — tečka uhne a heat ji zvýrazní
        var rp = repel.sample(i >> 1, x, y);

        var px = x + Math.cos(ang) * mag + rp.dx;
        var py = y + Math.sin(ang) * mag + rp.dy;

        buckets[Math.round(clamp(Math.max(e, rp.heat)) * (LEV - 1))].push(px, py);
      }

      drawBuckets(buckets, COLORS, 1.2);
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    repel.attach();   // myš sleduje repel modul (jednou)

    return {
      start: function () {
        if (running) return;
        running = true;
        t0 = performance.now();
        resize();
        window.addEventListener('resize', resize);
        raf = requestAnimationFrame(draw);
      },
      stop: function () {
        if (!running) return;
        running = false;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        window.removeEventListener('resize', resize);
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

  // Odpočet do spuštění (1. 10. 2026) — modrý pás s ubývajícími linkami
  (function () {
    const cdD = document.getElementById('wl-cd-d');
    if (!cdD) return;
    const TARGET = new Date('2026-10-01T09:00:00+02:00').getTime();
    const TOTAL_DAYS = 61;   // délka odpočtu ve dnech (jak plná je první linka)
    const pad = n => String(n).padStart(2, '0');
    const num = { h: document.getElementById('wl-cd-h'), m: document.getElementById('wl-cd-m'), s: document.getElementById('wl-cd-s') };
    const bar = { d: document.getElementById('wl-cd-bar-d'), h: document.getElementById('wl-cd-bar-h'), m: document.getElementById('wl-cd-bar-m'), s: document.getElementById('wl-cd-bar-s') };
    function tick() {
      const t = Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
      const d = Math.floor(t / 86400);
      const h = Math.floor(t / 3600) % 24;
      const m = Math.floor(t / 60) % 60;
      const s = t % 60;
      cdD.textContent = d;
      num.h.textContent = pad(h);
      num.m.textContent = pad(m);
      num.s.textContent = pad(s);
      // linky: žádná transition — plynulost dělá častý přepočet (250 ms)
      if (bar.d) bar.d.style.width = (100 * d) / Math.max(1, TOTAL_DAYS) + '%';
      if (bar.h) bar.h.style.width = (100 * h) / 24 + '%';
      if (bar.m) bar.m.style.width = (100 * m) / 60 + '%';
      if (bar.s) bar.s.style.width = (100 * s) / 60 + '%';
    }
    tick();
    setInterval(tick, 250);
  })();

  // Sociální důkaz „Už se přihlásilo XX brigádníků / zaměstnavatelů".
  // POCTIVĚ: reálný počet účtů z DB podle role (žádný fejk). Řádka se ukáže,
  // až je registrací aspoň WL_SOCIAL_PRAH — do té doby se nechlubíme (schová se).
  (function () {
    const WL_SOCIAL_PRAH = 20;   // od kolika registrací řádku ukázat
    const wrapEl = document.querySelector('.wl-social');
    const numEl  = document.getElementById('wl-social-num');
    const nounEl = document.getElementById('wl-social-noun');
    if (!numEl || !wrapEl) return;

    const cache = {};            // role → počet (dotaz jen jednou za návštěvu)
    let current = 'worker';

    async function pocet(role) {
      if (cache[role] != null) return cache[role];
      try {
        const { count, error } = await sb
          .from('profiles').select('id', { count: 'exact', head: true }).eq('role', role);
        cache[role] = error ? 0 : (count || 0);
      } catch (e) { cache[role] = 0; }
      return cache[role];
    }

    async function render() {
      const role = current;
      const n = await pocet(role);
      if (role !== current) return;          // mezitím přepnul roli
      if (n >= WL_SOCIAL_PRAH) {
        numEl.textContent = n;
        if (nounEl) nounEl.textContent = role === 'employer' ? 'zaměstnavatelů' : 'brigádníků';
        wrapEl.style.display = '';
      } else {
        wrapEl.style.display = 'none';        // málo → radši nic než chabé číslo
      }
    }

    window.wlSetSocialRole = function (r) { current = r; render(); };
    wrapEl.style.display = 'none';            // schovej, než dojede dotaz (žádné bliknutí)
    render();
  })();

  // POZN.: Starý „čekací list" formulář (jméno + e-mail → tabulka `waitlist`) je
  // zrušený. CTA „Chci být u toho" teď vede rovnou na normální registraci
  // (viz wlGoRegister výš) → zakládá se reálný účet, žádná separátní waitlist
  // tabulka. Pojistka: kdyby se ten formulář v markupu přece jen odeslal,
  // přesměruj na registraci místo zápisu do DB.
  const _wlFormEl = document.getElementById('wl-form');
  if (_wlFormEl) {
    _wlFormEl.addEventListener('submit', e => {
      e.preventDefault();
      wlGoRegister(wlRole);
    });
  }

  // PRODUKCE: popup vyskočí reálným uživatelům jen jednou (viz větev níž).
  //   Na testování se dá vynutit vždy přes ?wl v adrese (…/index.html?wl).
  //   Na vývoj se dá dočasně přepnout na true (popup po každém refreshi).
  const WL_DEV_ALWAYS = false;

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
    // Přístupový klíč platí i pro Google login — ať není zadní vrátka.
    if (!accessKeyOk()) {
      showError('login-error', ACCESS_LOCKED_MSG);
      return;
    }
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


/* ═══════════ REFERENCE — kroužkový sešit s listováním (z Yasin/recenze) ═══════════ */
(function () {
  var reviews = [
    { text: 'Těším se, až to vyjde!', name: 'Šimon V.', role: '', date: '29. 7. 2026', photo: '' },
    { text: 'Moc se těším, až si na Makej najdu brigádu.', name: 'David V.', role: '', date: '27. 7. 2026', photo: '' },
    { text: 'Vypadá to suprově!', name: 'Samuel P.', role: '', date: '24. 7. 2026', photo: '' },
    { text: 'Posílám nezaměstnaným kamarádům.', name: 'Jan W.', role: '', date: '21. 7. 2026', photo: '' },
    { text: 'Budu konečně makat ve stylu!', name: 'Yasin B.', role: '', date: '18. 7. 2026', photo: '' },
  ];

  var stack = document.getElementById('ref-stack');
  if (!stack) return;

  function fill(cardEl, r) {
    cardEl.querySelector('.ref-name').textContent = r.name;
    cardEl.querySelector('.ref-meta').textContent = r.role ? r.role + ' · ' + r.date : r.date;
    cardEl.querySelector('.ref-text').textContent = r.text;
  }

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
  var busy = false, timer, paused = false;

  function nodeAtSlot(s) {
    for (var n = 0; n < nodes.length; n++) if (+nodes[n].dataset.slot === s) return nodes[n];
    return null;
  }

  function advance() {
    if (busy || reviews.length <= 1) return;
    busy = true;
    clearInterval(timer);

    var leaving = nodeAtSlot(0);
    for (var s = 1; s < VISIBLE; s++) {
      var nd = nodeAtSlot(s);
      if (nd) nd.dataset.slot = s - 1;
    }
    leaving.classList.add('leaving');

    setTimeout(function () {
      fill(leaving, reviews[nextRev]);
      nextRev = (nextRev + 1) % reviews.length;
      leaving.dataset.slot = VISIBLE - 1;
      leaving.classList.remove('leaving');
      setTimeout(function () { busy = false; startTimer(); }, 720);
    }, 540);
  }

  function startTimer() { clearInterval(timer); if (!paused) timer = setInterval(advance, 3500); }

  // Najetí myší (bez kliku) pozastaví listování, odjetí ho zase spustí.
  stack.addEventListener('mouseenter', function () { paused = true; clearInterval(timer); });
  stack.addEventListener('mouseleave', function () { paused = false; startTimer(); });
  // Klik = posun na další + pokračuj dál (i když na kartě zůstane kurzor).
  stack.addEventListener('click', function () { if (!busy) { paused = false; advance(); } });

  startTimer();
})();
