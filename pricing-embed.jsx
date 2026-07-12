// ═══════════════════════════════════════════════════════════════
// Dashboardový ceník na webu — přesně stejný komponent jako v dashboardu
// (employer/employer-pages3.jsx → EPricing). Vykresluje se do #makej-pricing-root
// na pro-zamestnavatele.html. CTA vedou na registraci (na webu není platba).
// ═══════════════════════════════════════════════════════════════

const { useState: useStateE, useEffect: useEffectE, useRef: useRefE } = React;

const T = {
  fontHead: '"Inter", -apple-system, system-ui, sans-serif',
  fontUI:   '"Inter", -apple-system, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", monospace',
};

const Icon = ({ name, size = 20, color = 'currentColor' }) => (
  <iconify-icon icon={`solar:${name}`} width={size} height={size} style={{ color, display: 'inline-flex', verticalAlign: 'middle' }}></iconify-icon>
);

function openRegister() {
  if (typeof window !== 'undefined' && typeof window.openModal === 'function') window.openModal('register');
}

const PLANS = [
  {
    id: 'zakladni', name: 'Základní', price: 0, free: true, period: 'navždy zdarma',
    color: '#8AB4FF', icon: 'hand-shake-bold',
    highlights: [
      { ok: true,  text: '1 aktivní inzerát' },
      { ok: true,  text: 'Oslovování brigádníků 1×/měs' },
      { ok: false, text: 'Topování inzerátu' },
      { ok: false, text: 'Ověřená firma' },
    ],
    cta: 'Začít zdarma', contact: false,
  },
  {
    id: 'vyhodny', name: 'Výhodný', price: 499, annualPrice: 424, period: 'za měsíc bez DPH',
    color: '#5B6BFF', icon: 'bolt-bold', badge: 'Nejoblíbenější', popular: true,
    highlights: [
      { ok: true, text: '2 aktivní inzeráty' },
      { ok: true, text: 'Topování inzerátu 1×/měs' },
      { ok: true, text: 'Ověřená firma + branding' },
      { ok: true, text: 'Oslovování brigádníků 10×/měs' },
    ],
    cta: 'Vybrat Výhodný', contact: false,
  },
  {
    id: 'dynamicky', name: 'Dynamický', price: 2000, period: 'za měsíc bez DPH',
    color: '#5BD68A', icon: 'bolt-bold',
    highlights: [
      { tbd: true, text: 'Funkce doplníme společně' },
    ],
    cta: 'Vybrat Dynamický', contact: false,
  },
  {
    id: 'maximalni', name: 'Maximální', price: 4999, annualPrice: 4249, period: 'za měsíc bez DPH',
    color: '#FFD166', icon: 'crown-star-bold',
    highlights: [
      { ok: true, text: '10 aktivních inzerátů' },
      { ok: true, text: 'Topování inzerátu 5×/měs' },
      { ok: true, text: 'SMS Urgent + prémiový badge' },
      { ok: true, text: 'Pokročilá analytika' },
    ],
    cta: 'Vybrat Maximální', contact: false,
  },
  {
    id: 'vlastni', name: 'Vlastní', price: 9999, pricePrefix: 'od ', period: 'kalkulace na míru',
    color: '#E0B0FF', icon: 'buildings-2-bold',
    highlights: [
      { ok: true, text: 'Vše z Maximální' },
      { ok: true, text: 'Custom integrace (HR)' },
      { ok: true, text: 'Dedikovaný account manager' },
    ],
    cta: 'Nezávazná poptávka', contact: true,
  },
];

const FEATURE_ROWS = [
  { section: 'Inzeráty' },
  { label: 'Aktivní inzeráty',             cells: { zakladni: '1',     vyhodny: '2',    dynamicky: 'tbd', maximalni: '10',   vlastni: '10' } },
  { label: 'Full-time inzerce',            cells: { zakladni: '1',     vyhodny: '1',    dynamicky: 'tbd', maximalni: '1',    vlastni: '1' } },
  { label: 'Topování inzerátu',            cells: { zakladni: false,   vyhodny: '1×/měs', dynamicky: 'tbd', maximalni: '5×/měs', vlastni: '5×/měs' } },
  { label: 'Plánování inzerátu předem',    cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Šablony inzerátů',             cells: { zakladni: false,   vyhodny: true,   dynamicky: 'tbd', maximalni: true,   vlastni: true } },

  { section: 'Nábor a viditelnost' },
  { label: 'Oslovování brigádníků',        cells: { zakladni: '1×/měs', vyhodny: '10×/měs', dynamicky: 'tbd', maximalni: '100×/měs', vlastni: '100×/měs' } },
  { label: 'Ověřená firma + branding',     cells: { zakladni: false,   vyhodny: true,   dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Video na profilu',             cells: { zakladni: false,   vyhodny: true,   dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Prémiový badge',               cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'SMS Urgent',                   cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Zmínka na FB + IG Makej',      cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: true,   vlastni: true } },

  { section: 'Data a reporting' },
  { label: 'Základní statistiky',          cells: { zakladni: true,    vyhodny: true,   dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Plné statistiky + CSV export', cells: { zakladni: false,   vyhodny: true,   dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Pokročilá analytika',          cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Custom integrace (HR systémy)', cells: { zakladni: false,  vyhodny: false,  dynamicky: 'tbd', maximalni: false,  vlastni: true } },
  { label: 'Vlastní reporting na míru',    cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: false,  vlastni: true } },
  { label: 'Co-marketing s Makej',         cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: false,  vlastni: true } },

  { section: 'Tým a podpora' },
  { label: 'Možnost konzultace',           cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Role uživatelů',               cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: true,   vlastni: true } },
  { label: 'Neomezení uživatelé v týmu',   cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: false,  vlastni: true } },
  { label: 'Onboarding a školení týmu',    cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: false,  vlastni: true } },
  { label: 'SLA 99,99 % + prioritní podpora', cells: { zakladni: false, vyhodny: false, dynamicky: 'tbd', maximalni: false,  vlastni: true } },
  { label: 'Dedikovaný account manager',   cells: { zakladni: false,   vyhodny: false,  dynamicky: 'tbd', maximalni: false,  vlastni: true } },
];

function FeatureCell({ value }) {
  if (value === 'tbd') {
    return <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 6, background: '#F3F4F6', color: '#9CA3AF', fontFamily: T.fontUI, fontSize: 10.5, fontWeight: 700 }}>brzy</span>;
  }
  if (value === true)  return <Icon name="check-circle-bold" size={17} color="#00f60a" />;
  if (value === false) return <span style={{ color: '#D1D5DB', fontSize: 15, fontWeight: 700 }}>–</span>;
  return <span style={{ color: '#111827', fontFamily: T.fontMono, fontSize: 12, fontWeight: 700 }}>{value}</span>;
}

function animatePrice(el, from, to) {
  if (!el) return;
  var start = performance.now(), dur = 480;
  function step(now) {
    var t = Math.min((now - start) / dur, 1);
    var eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * eased).toLocaleString('cs-CZ');
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function MakejPricing() {
  const [selected, setSelected] = useStateE(null);
  const [hovered, setHovered]   = useStateE(null);
  const [annual, setAnnual]     = useStateE(false);
  const [showCompare, setShowCompare] = useStateE(false);
  const priceRefs               = useRefE({});

  useEffectE(() => {
    PLANS.forEach(plan => {
      if (!plan.annualPrice) return;
      const el = priceRefs.current[plan.id];
      const from = annual ? plan.price : plan.annualPrice;
      const to   = annual ? plan.annualPrice : plan.price;
      animatePrice(el, from, to);
    });
  }, [annual]);

  function handleSelect(planId) {
    setSelected(planId);
  }

  return (
    <div style={{ padding: '28px 12px 20px', background: '#fff' }}>
      <style>{`
        @keyframes empPop { 0% { transform: scale(0.92) translateY(12px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes tariffPulse {
          0%, 100% { border-color: #E5E7EB; box-shadow: 0 0 0 0 rgba(0,32,246,0); }
          50% { border-color: rgba(0,32,246,0.5); box-shadow: 0 0 0 4px rgba(0,32,246,0.10); }
        }
        .tariff-compare-btn { animation: tariffPulse 2.4s ease-in-out infinite; }
        .tariff-compare-btn:hover { animation: none; border-color: rgba(0,32,246,0.45) !important; }
        #makej-pricing-root iconify-icon { line-height: 0; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <div style={{ fontFamily: T.fontHead, fontSize: 33, fontWeight: 900, color: '#111827', marginBottom: 10 }}>Vyber si svůj plán</div>
        <div style={{ color: '#6B7280', fontFamily: T.fontUI, fontSize: 17, marginBottom: 26 }}>Bez závazků. Zrušení kdykoliv.</div>
        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 99, padding: '8px 20px' }}>
            <span style={{ color: annual ? '#9CA3AF' : '#111827', fontFamily: T.fontUI, fontSize: 16, fontWeight: 700, transition: 'color .2s' }}>Měsíčně</span>
            <div
              onClick={() => setAnnual(a => !a)}
              style={{ width: 48, height: 26, borderRadius: 999, background: annual ? '#00f60a' : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}
            >
              <div style={{ position: 'absolute', top: 3, left: annual ? 25 : 3, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
            </div>
            <span style={{ color: annual ? '#111827' : '#9CA3AF', fontFamily: T.fontUI, fontSize: 16, fontWeight: 700, transition: 'color .2s' }}>Ročně</span>
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
            <span style={{ background: 'rgba(0,246,10,0.12)', border: '1px solid rgba(0,246,10,0.3)', color: '#00f60a', fontFamily: T.fontUI, fontSize: 15, fontWeight: 800, borderRadius: 12, padding: '8px 20px', opacity: annual ? 1 : 0, transform: annual ? 'scale(1)' : 'scale(0.9)', transition: 'opacity .2s, transform .2s' }}>chci šetřit</span>
          </div>
        </div>
      </div>

      {/* Karty tarifů */}
      <div id="makej-plans" style={{ maxWidth: 1180, margin: '0 auto 24px', paddingBottom: 6, scrollMarginTop: 100 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 14, alignItems: 'stretch', padding: '20px 4px 8px' }}>
          {PLANS.map((plan, i) => {
            const isPop    = !!plan.popular;
            const isSel    = selected === plan.id;
            const isHov    = hovered === plan.id;
            const lift     = isSel || isHov;
            return (
              <div key={plan.id}
                onClick={() => !plan.contact && handleSelect(plan.id)}
                onMouseEnter={() => setHovered(plan.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'relative', display: 'flex', flexDirection: 'column', textAlign: 'center',
                  borderRadius: 20,
                  border: isSel ? '2px solid #0020F6' : ('1.5px solid ' + (lift ? plan.color + 'aa' : plan.color + '40')),
                  background: isSel
                    ? 'linear-gradient(165deg, rgba(0,32,246,0.10), rgba(91,107,255,0.035))'
                    : plan.color + '12',
                  boxShadow: isSel
                    ? '0 20px 48px rgba(0,32,246,0.20)'
                    : (lift ? '0 16px 36px ' + plan.color + '3a' : '0 1px 2px rgba(0,0,0,0.04)'),
                  padding: '26px 20px 22px', marginTop: 8,
                  cursor: plan.contact ? 'default' : 'pointer',
                  transform: lift ? 'translateY(-6px)' : 'none',
                  transition: 'transform .25s cubic-bezier(.34,1.3,.5,1), box-shadow .25s, border-color .2s',
                  animation: 'empPop .4s ease both', animationDelay: (i * 0.07) + 's',
                }}>
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'linear-gradient(135deg, #0020F6, #5B6BFF)', color: '#fff',
                    fontFamily: T.fontUI, fontSize: 10.5, fontWeight: 800, padding: '6px 12px',
                    borderRadius: '0 20px 0 14px', whiteSpace: 'nowrap',
                  }}><Icon name="star-bold" size={12} color="#fff" />{plan.badge}</div>
                )}
                <div style={{ fontFamily: T.fontUI, fontSize: 11, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1.4, marginTop: plan.badge ? 22 : 8, marginBottom: 12 }}>{plan.name}</div>

                <div style={{ minHeight: 44, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                  {plan.free ? (
                    <span style={{ fontFamily: T.fontHead, fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1 }}>Zdarma</span>
                  ) : plan.priceLabel ? (
                    <span style={{ fontFamily: T.fontHead, fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{plan.priceLabel}</span>
                  ) : (
                    <>
                      {plan.pricePrefix && <span style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 600, fontFamily: T.fontUI }}>{plan.pricePrefix}</span>}
                      <span ref={el => { if (el) priceRefs.current[plan.id] = el; }}
                        style={{ fontFamily: T.fontHead, fontSize: 38, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                        {(annual && plan.annualPrice ? plan.annualPrice : plan.price).toLocaleString('cs-CZ')}
                      </span>
                      <span style={{ color: '#6B7280', fontSize: 15, fontWeight: 600, fontFamily: T.fontUI }}>Kč</span>
                    </>
                  )}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 11.5, fontFamily: T.fontUI, marginTop: 4 }}>
                  {plan.period}
                </div>
                <div style={{ minHeight: 24, marginTop: 6, marginBottom: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {plan.annualPrice ? (
                    <span style={{ opacity: annual ? 1 : 0, transition: 'opacity .2s', background: 'rgba(0,246,10,0.12)', border: '1px solid rgba(0,246,10,0.3)', color: '#00f60a', fontFamily: T.fontUI, fontSize: 10.5, fontWeight: 800, borderRadius: 8, padding: '3px 9px' }}>
                      ušetříš {((plan.price - plan.annualPrice) * 12).toLocaleString('cs-CZ')} Kč/rok
                    </span>
                  ) : null}
                </div>

                {plan.highlights && plan.highlights.length > 0 && (
                  <>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', margin: '4px 0 14px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16, textAlign: 'left' }}>
                      {plan.highlights.map((h, hi) => (
                        <div key={hi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          {h.tbd ? (
                            <Icon name="clock-circle-bold" size={15} color="#9CA3AF" />
                          ) : (
                            <Icon name={h.ok ? 'check-circle-bold' : 'close-circle-bold'} size={15} color={h.ok ? '#00f60a' : '#D1D5DB'} />
                          )}
                          <span style={{ color: h.tbd ? '#9CA3AF' : (h.ok ? '#374151' : '#9CA3AF'), fontSize: 12, fontWeight: 600, fontFamily: T.fontUI, lineHeight: 1.3 }}>{h.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                  {plan.contact ? (
                    <a href="mailto:hello@makej.eu" onClick={e => e.stopPropagation()} style={{
                      display: 'block', width: '100%', padding: '11px 0', borderRadius: 12, textAlign: 'center',
                      background: '#fff', border: '1px solid ' + plan.color + '77',
                      color: '#374151', fontFamily: T.fontUI, fontSize: 13, fontWeight: 800,
                      textDecoration: 'none', boxSizing: 'border-box',
                    }}>{plan.cta}</a>
                  ) : (
                    <button onClick={e => { e.stopPropagation(); handleSelect(plan.id); }}
                      style={{
                        width: '100%', padding: '11px 0', borderRadius: 12,
                        background: (isSel || isPop) ? 'linear-gradient(135deg, #0020F6, #3a3a99)' : '#fff',
                        border: (isSel || isPop) ? 'none' : '1.5px solid ' + plan.color,
                        color: (isSel || isPop) ? '#fff' : '#111827',
                        fontFamily: T.fontUI, fontSize: 13, fontWeight: 800, cursor: 'pointer',
                      }}>
                      {plan.cta}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proklik na detailní srovnání */}
      <div style={{ maxWidth: 1180, margin: '0 auto 30px', textAlign: 'center' }}>
        <button onClick={() => setShowCompare(s => !s)}
          className={showCompare ? '' : 'tariff-compare-btn'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 18,
            padding: '13px 18px', borderRadius: 14,
            background: showCompare ? 'rgba(0,32,246,0.06)' : '#F9FAFB',
            border: '1px solid ' + (showCompare ? 'rgba(0,32,246,0.28)' : '#E5E7EB'),
            color: showCompare ? '#0020F6' : '#374151',
            fontFamily: T.fontUI, fontSize: 14.5, fontWeight: 700, cursor: 'pointer',
            transition: 'all .15s',
          }}>
          <img src="/employer/bulb.png" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0, display: 'block' }} />
          Porovnání tarifů přímo pro tebe
          <span style={{ display: 'inline-flex', transition: 'transform .25s', transform: showCompare ? 'rotate(180deg)' : 'none' }}>
            <Icon name="alt-arrow-down-bold" size={15} color={showCompare ? '#0020F6' : '#6B7280'} />
          </span>
        </button>

        {showCompare && (
          <div style={{ marginTop: 18, overflowX: 'auto', textAlign: 'left', animation: 'empPop .3s ease both' }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 18, overflow: 'hidden', minWidth: 900 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(5, minmax(0, 1fr))' }}>

                <div style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }} />
                {PLANS.map(plan => (
                  <div key={plan.id} style={{
                    textAlign: 'center', padding: '14px 10px',
                    borderBottom: '2px solid #E5E7EB', borderLeft: '1px solid #E5E7EB',
                    borderTop: '4px solid ' + plan.color,
                    background: plan.popular ? 'rgba(0,32,246,0.05)' : '#F9FAFB',
                  }}>
                    <div style={{ fontFamily: T.fontUI, fontSize: 11, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.8 }}>{plan.name}</div>
                    <div style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, color: '#6B7280', marginTop: 3 }}>
                      {plan.free ? 'Zdarma' : plan.priceLabel ? plan.priceLabel : (plan.pricePrefix || '') + (annual && plan.annualPrice ? plan.annualPrice : plan.price).toLocaleString('cs-CZ') + ' Kč'}
                    </div>
                  </div>
                ))}

                {FEATURE_ROWS.map((row, ri) => {
                  if (row.section) {
                    return (
                      <div key={'s' + ri} style={{
                        gridColumn: '1 / -1', padding: '9px 16px',
                        background: '#F9FAFB', borderBottom: '1px solid #E5E7EB',
                        color: '#374151', fontFamily: T.fontUI, fontSize: 11, fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: 0.6,
                      }}>{row.section}</div>
                    );
                  }
                  return (
                    <React.Fragment key={ri}>
                      <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', color: '#374151', fontFamily: T.fontUI, fontSize: 12.5, fontWeight: 600, borderBottom: '1px solid #F3F4F6' }}>
                        {row.label}
                      </div>
                      {PLANS.map(plan => (
                        <div key={plan.id} style={{
                          padding: '11px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: plan.popular ? 'rgba(0,32,246,0.03)' : 'transparent',
                          borderLeft: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6',
                        }}>
                          <FeatureCell value={row.cells[plan.id]} />
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Výběr tarifu → registrace */}
      {selected && !PLANS.find(x => x.id === selected)?.contact && (
        <div style={{
          maxWidth: 900, margin: '0 auto 26px',
          background: '#F9FAFB', border: '1px solid #E5E7EB',
          borderRadius: 16, padding: '20px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
        }}>
          {(() => {
            const p = PLANS.find(x => x.id === selected);
            return (
              <>
                <div>
                  <div style={{ color: '#111827', fontFamily: T.fontHead, fontSize: 16, fontWeight: 800 }}>
                    {p.free ? p.name + ' — zdarma' : p.name + ' — ' + (annual && p.annualPrice ? p.annualPrice : p.price).toLocaleString('cs-CZ') + ' Kč / měsíc'}
                  </div>
                  <div style={{ color: '#6B7280', fontFamily: T.fontUI, fontSize: 12, marginTop: 3 }}>
                    Vytvoř si účet zaměstnavatele a tarif nastavíš v dashboardu. Bez závazků.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setSelected(null)} style={{
                    padding: '10px 18px', borderRadius: 9,
                    background: '#fff', border: '1px solid #E5E7EB',
                    color: '#6B7280', fontFamily: T.fontUI, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>Zrušit</button>
                  <button onClick={openRegister} style={{
                    padding: '10px 22px', borderRadius: 9,
                    background: 'linear-gradient(135deg, #0020F6, #3a3a99)',
                    border: 'none', color: '#fff',
                    fontFamily: T.fontUI, fontSize: 13, fontWeight: 800, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    <Icon name="user-plus-bold" size={14} color="#fff" /> Vytvořit účet zdarma
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Slevy */}
      <div style={{ maxWidth: 980, margin: '8px auto 26px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {[
          { pct: '15%', title: 'Roční platba',       text: 'Zaplať rok předem a ušetři 15 %. Nejlepší hodnota pro stabilní nábor.' },
          { icon: '/employer/flash.png', title: 'Upgrade kdykoliv', text: 'Upgrade tarifu platí okamžitě. Downgrade k dalšímu fakturačnímu období.' },
        ].map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 14, padding: '16px 18px' }}>
            {d.pct
              ? <div style={{ fontFamily: T.fontHead, fontSize: 26, fontWeight: 900, color: '#00f60a', flexShrink: 0, lineHeight: 1 }}>{d.pct}</div>
              : <img src={d.icon} style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }} />}
            <div>
              <div style={{ color: '#111827', fontFamily: T.fontUI, fontSize: 13.5, fontWeight: 800, marginBottom: 3 }}>{d.title}</div>
              <div style={{ color: '#6B7280', fontFamily: T.fontUI, fontSize: 12, lineHeight: 1.5 }}>{d.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Poznámky a pravidla */}
      <div style={{ maxWidth: 860, margin: '0 auto', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ color: '#111827', fontFamily: T.fontHead, fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Poznámky a pravidla</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Aktivní inzeráty = počet zveřejněných (viditelných brigádníkům) zároveň. Po vyřešení inzerátu firma uvolní slot pro další.',
            'Drafty a neaktivní inzeráty si lze vytvořit libovolně — limit tarifu se vztahuje jen na zveřejněné.',
            'Každý inzerát má cyklus 30 dní. 5 dní před koncem chodí upozornění. Potvrzením relevance běží další cyklus bez omezení.',
            'Tarif Dynamický se nastavuje individuálně podle potřeb firmy — konkrétní funkce a limity doplníme společně.',
            'Tarif Vlastní se kalkuluje na míru. Sleva 5 % do 25 000 Kč/měs, sleva 10 % nad 25 001 Kč/měs.',
            'Všechny ceny jsou bez DPH. Makačky (virtuální měna brigádníků) se firemních tarifů netýkají.',
          ].map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <span style={{ color: '#5B6BFF', flexShrink: 0, lineHeight: 1.55 }}>•</span>
              <span style={{ color: '#6B7280', fontFamily: T.fontUI, fontSize: 12, lineHeight: 1.55 }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

(function mountMakejPricing() {
  const el = document.getElementById('makej-pricing-root');
  if (el && window.ReactDOM && window.React) {
    ReactDOM.createRoot(el).render(<MakejPricing />);
    // Když někdo přijde přes footer odkaz #pricing, po vykreslení plynule doskroluj na sekci
    if (window.location.hash === '#pricing') {
      setTimeout(function () {
        const sec = document.getElementById('pricing');
        if (sec) {
          // Doskroluj na začátek sekce (nadpis hned pod navbarem), ať je celý ceník v záběru
          const nav = document.querySelector('nav');
          const navH = nav ? nav.offsetHeight : 80;
          const y = sec.getBoundingClientRect().top + window.scrollY - navH - 8;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 140);
    }
  }
})();
