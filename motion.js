/* ═══════════════════════════════════════════════════════════════
   MOTION — scroll animace (párové k motion.css)
   ───────────────────────────────────────────────────────────────
   Načítá se PO script.js, aby se nepral se stávajícím setupReveal().

   POZOR: každá stránka už nějaký reveal systém MÁ (.reveal, .js-reveal-*,
   nebo .visible na blogu). Tenhle soubor je nenahrazuje — jejich charakter
   sjednocuje motion.css. Zde se jen doplňuje, co nikde nebylo:

     1) obrázky se „usazují" místo aby naskočily
     2) jemný parallax na velkých obrázcích (hloubka, ne efekt)
     3) automatické prokládání skupin .js-reveal-up (dosud naráz)

   Zásady:
     • bez JS zůstane všechno viditelné (nic se neschovává v CSS)
     • prvky viditelné hned po načtení se NESCHOVÁVAJÍ → žádné bliknutí
     • jeden rAF cyklus, běží jen když je co počítat
     • prefers-reduced-motion → skript se vůbec nespustí
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Pojistky ────────────────────────────────────────────────
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Místa, kam se sahat nesmí:
     .cmp-lay   — before/after posuvník, dvě vrstvy musí sedět na pixel
     .ph-screen — obsah displeje v mockupu telefonu (nesmí se hýbat v rámečku)
     .mkj-stage — hero s MacBookem má vlastní choreografii
     nav/footer — loga a ikonky */
  var SKIP = '.cmp-lay, .ph-screen, .mkj-stage, nav, footer, [data-mkj-skip]';

  var MIN_IMG = 100;          // menší = ikona, neanimovat
  var PARALLAX_MIN_H = 170;   // menší obrázky by z driftu nic nezískaly
  var PARALLAX_MIN_VW = 900;  // na mobilu parallax vypnutý (výkon + malý přínos)

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  function eligible(el) {
    return !el.closest(SKIP);
  }

  // ═══════════ 1. OBRÁZKY — usazení ═══════════
  var imgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var img = e.target;
      imgObserver.unobserve(img);
      img.setAttribute('data-mkj-img', 'in');
      // Po dojetí uklidit will-change a uvolnit transform pro parallax.
      setTimeout(function () {
        img.setAttribute('data-mkj-img', 'done');
        armWhenLoaded(img);
      }, 1250);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

  var seen = new WeakSet();

  /* Rozhoduje se podle ŠÍŘKY, ne výšky. Většina obrázků na webu je
     loading="lazy" bez width/height atributů — dokud se nenačtou,
     mají výšku 0 a kontrola na výšku by je všechny zahodila. Šířku
     ale určuje CSS kontejneru, takže je známá hned. */
  function considerImage(img) {
    if (seen.has(img)) return;
    if (!eligible(img)) return;

    var r = img.getBoundingClientRect();
    if (!r.width) return;                    // ještě nemá layout, zkusí se znovu
    seen.add(img);
    if (r.width < MIN_IMG) return;           // ikona

    if (inViewport(img)) {
      // Nad ohybem — neschovávat (bliklo by to), rovnou jen parallax.
      armWhenLoaded(img);
      return;
    }

    img.setAttribute('data-mkj-img', 'pending');
    imgObserver.observe(img);
  }

  /* Parallax potřebuje znát výšku → počkat, až je obrázek načtený. */
  function armWhenLoaded(img) {
    if (img.complete && img.getBoundingClientRect().height) { armParallax(img); return; }
    img.addEventListener('load', function () { armParallax(img); }, { once: true });
  }

  function initImages() {
    Array.prototype.slice.call(document.querySelectorAll('img')).forEach(considerImage);
  }

  // ═══════════ 2. PARALLAX ═══════════
  var pxItems = [];       // { el, amp, mode }
  var pxActive = [];      // aktuálně v záběru
  var pxTicking = false;

  function armParallax(img) {
    if (window.innerWidth < PARALLAX_MIN_VW) return;
    if (!eligible(img)) return;

    var r = img.getBoundingClientRect();
    if (r.height < PARALLAX_MIN_H) return;

    // Uvnitř orámovaného kontejneru se smí posouvat víc — okraje
    // zakryje overflow:hidden. Volně stojící obrázek jen decentně.
    var parent = img.parentElement;
    var clipped = parent && /hidden|clip/.test(getComputedStyle(parent).overflow);
    var mode = clipped ? 'frame' : 'free';

    img.setAttribute('data-mkj-parallax', mode);
    var item = { el: img, amp: clipped ? 14 : 8 };
    pxItems.push(item);
    pxObserver.observe(img);
  }

  var pxObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var item = pxItems.find(function (i) { return i.el === e.target; });
      if (!item) return;
      var idx = pxActive.indexOf(item);
      if (e.isIntersecting && idx === -1) pxActive.push(item);
      if (!e.isIntersecting && idx !== -1) pxActive.splice(idx, 1);
    });
    if (pxActive.length) requestTick();
  }, { rootMargin: '15% 0px 15% 0px' });

  function updateParallax() {
    pxTicking = false;
    var vh = window.innerHeight;
    var mid = vh / 2;
    pxActive.forEach(function (item) {
      var r = item.el.getBoundingClientRect();
      var center = r.top + r.height / 2;
      // -1 (prvek dole) … 0 (uprostřed) … 1 (nahoře)
      var p = (mid - center) / (mid + r.height / 2);
      p = Math.max(-1, Math.min(1, p));
      item.el.style.setProperty('--mkj-shift', (p * item.amp).toFixed(2) + 'px');
    });
  }

  function requestTick() {
    if (pxTicking) return;
    pxTicking = true;
    requestAnimationFrame(updateParallax);
  }

  // ═══════════ 3. PROKLÁDÁNÍ .js-reveal-up ═══════════
  /* Na vx stránkách (Lidé, Hledám si práci, Pro zaměstnavatele)
     naskakují skupiny prvků naráz. Kde autor nenastavil vlastní
     delay, doplníme kaskádu — stejný princip, jaký má script.js
     u .reveal. Ruční delays (.vx-gal-card.c1 apod.) neruším. */
  function initStagger() {
    var groups = new Map();
    document.querySelectorAll('.js-reveal-up').forEach(function (el) {
      var p = el.parentElement;
      if (!p) return;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });

    groups.forEach(function (items) {
      if (items.length < 2) return;
      items.forEach(function (el, i) {
        // Nepřepisovat, co si stránka nastavila sama.
        if (el.style.transitionDelay) return;
        var inline = getComputedStyle(el).transitionDelay;
        if (inline && inline !== '0s' && inline !== '0s, 0s') return;
        el.style.transitionDelay = (Math.min(i, 5) * 0.07).toFixed(2) + 's';
      });
    });
  }

  // ═══════════ START ═══════════
  function init() {
    initImages();
    initStagger();
    // Druhý průchod po načtení všeho — dobere obrázky, které při
    // DOMContentLoaded ještě neměly layout (webfonty, lazy obrázky).
    window.addEventListener('load', initImages);
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
