// ═══════════════════════════════════════════════════════════════
// PRÉMIOVÁ FUNKCE: Pokročilá analytika + Plán směn
// ═══════════════════════════════════════════════════════════════
//
// Doporučený tarif:  Premium / Pro
// Zapojení:
//   1. Přidat <script type="text/babel" src="_premium/analytics.jsx"> do index.html
//   2. Viz README.md pro ostatní kroky
//
// Závislosti: T, Icon, ECard, SectionHeader, Sparkline, AreaChart, BarChart, Donut
//             (všechny dostupné z employer-shell.jsx a app.jsx)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// PRO GATE — zobrazí upgrade CTA pokud uživatel nemá Pro tarif
// ─────────────────────────────────────────────────────────────

function _isPro() {
  const plan = (EPROFILE.plan || '').toLowerCase();
  if (['pro', 'business', 'premium'].includes(plan)) return true;
  const until = EPROFILE.premium_until || EPROFILE.plan_expires_at;
  if (until && new Date(until) > new Date()) return true;
  return false;
}

function ProGate({ feature, children }) {
  if (_isPro()) return children;
  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {/* Rozmazaný náhled obsahu */}
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.55 }}>
        {children}
      </div>

      {/* Overlay s CTA */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(7,7,26,0.15) 0%, rgba(7,7,26,0.75) 40%, rgba(7,7,26,0.85) 100%)',
      }}>
        <div style={{
          textAlign: 'center', maxWidth: 460, padding: '36px 32px',
          background: 'rgba(16,16,48,0.92)',
          border: '1px solid rgba(255,209,102,0.2)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,209,102,0.08)',
          backdropFilter: 'blur(12px)',
        }}>
          {/* Ikona */}
          <div style={{
            width: 68, height: 68, borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(255,209,102,0.18), rgba(255,209,102,0.06))',
            border: '1px solid rgba(255,209,102,0.35)',
            display: 'grid', placeItems: 'center', margin: '0 auto 20px',
          }}>
            <Icon name="crown-star-bold" size={32} color="#FFD166" />
          </div>

          {/* Titulek */}
          <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', fontFamily: T.fontHead, marginBottom: 8, lineHeight: 1.25 }}>
            {feature || 'Tato sekce'} je dostupná v tarifu Pro
          </div>

          {/* Popis */}
          <div style={{ fontSize: 13, color: T.muted, fontFamily: T.fontUI, lineHeight: 1.7, marginBottom: 24 }}>
            Odemkněte <strong style={{ color: '#d0d0ff' }}>pokročilé reporty</strong>,{' '}
            demografii kandidátů, analýzu nákladů na nábor a retenci brigádníků.
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26, textAlign: 'left' }}>
            {[
              'Cohort analýza a konverzní funnel',
              'Demografické přehledy kandidátů',
              'Cost per hire vs. průměr trhu',
              'Retence brigádníků + AI insights',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.light, fontFamily: T.fontUI }}>
                <Icon name="check-circle-bold" size={14} color="#FFD166" />
                {f}
              </div>
            ))}
          </div>

          {/* CTA tlačítko */}
          <button style={{
            width: '100%', padding: '13px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #292978, #3a3a99)',
            border: '1px solid rgba(91,107,255,0.4)',
            color: '#fff', fontFamily: T.fontUI, fontSize: 15, fontWeight: 800,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 4px 24px rgba(41,41,120,0.55)',
            transition: 'opacity .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Icon name="crown-star-bold" size={16} color="#FFD166" />
            Upgradovat na Pro
          </button>

          <div style={{ marginTop: 12, fontSize: 12, color: T.mutedSoft, fontFamily: T.fontUI }}>
            Otázky? <a href="mailto:support@makej.eu" style={{ color: '#8AB4FF', textDecoration: 'none' }}>support@makej.eu</a>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ANALYTIKA — jedna sekce: mapa nahoře, statistiky pod ní
// ─────────────────────────────────────────────────────────────
function EAnalytics({ period = '30d' }) {
  return (
    <ProGate feature="Analytika">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
        <KrajeMap />
        <div style={{ padding: '0 28px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <AnalyticsOverview period={period} />
          <AnalyticsDemo />
        </div>
      </div>
    </ProGate>
  );
}

// ── Přehled ──────────────────────────────────────────────────
function AnalyticsOverview({ period = '30d' }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <ECard>
          <SectionHeader title="Cohort: konverze podle týdne nástupu" subtitle="% kandidátů, kteří po N týdnech stále chodí na směny" />
          <CohortTable />
        </ECard>
        <ECard>
          <SectionHeader title="Srovnání kanálů" subtitle="Kde se vám daří nejlépe" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {[
              { l: 'Swajp feed', views: 8420, hires: 28, color: '#0020F6' },
              { l: 'Search', views: 2140, hires: 9, color: '#5B6BFF' },
              { l: 'Doporučení', views: 1280, hires: 11, color: '#5BD68A' },
              { l: 'Boost (placený)', views: 1007, hires: 14, color: '#FFD166' },
            ].map((c, i) => {
              const conv = ((c.hires / c.views) * 100).toFixed(2);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: T.cardText, fontFamily: T.fontUI, fontSize: 12.5, fontWeight: 600 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                      {c.l}
                    </span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <span style={{ color: T.cardMutedSoft, fontFamily: T.fontMono, fontSize: 10.5 }}>{c.views.toLocaleString('cs-CZ').replace(/,/g,' ')} views</span>
                      <span style={{ color: '#1a9e4d', fontFamily: T.fontMono, fontSize: 11.5, fontWeight: 700 }}>{c.hires} najato</span>
                      <span style={{ color: T.cardText, fontFamily: T.fontMono, fontSize: 11.5, fontWeight: 700, minWidth: 44, textAlign: 'right' }}>{conv}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: T.cardSoft, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (parseFloat(conv) * 60) + '%', background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ECard>
      </div>

      <ECard>
        <SectionHeader title="AI insights z vašich dat" subtitle="Generováno automaticky · obnoveno před 4 hodinami" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { i: 'lightbulb-bold', c: '#FFD166', tag: 'Příležitost', t: 'Inzeráty s hodinovkou nad 180 Kč mají o 41 % vyšší swajp-right rate. Vaše konkurence platí v průměru 162 Kč.' },
            { i: 'shield-warning-bold', c: '#f43f5e', tag: 'Pozor', t: 'Inzerát „Brand ambassador" má CTR jen 13 %. Doporučujeme přepsat headline a přidat fotky týmu.' },
            { i: 'rocket-2-bold', c: '#5BD68A', tag: 'Trend', t: 'Pondělí 17–21h je vaše nejsilnější okno — 32 % všech matchů. Zvažte plánovaný boost na tento čas.' },
            { i: 'target-bold', c: '#5B6BFF', tag: 'Doporučení', t: 'Kandidáti, kteří mají v profilu „latte art", u vás vydrží průměrně 3.2× déle. Filtrujte primárně podle této dovednosti.' },
            { i: 'graph-down-bold', c: '#E0B0FF', tag: 'Anomálie', t: 'Time-to-hire klesl o 28 % po zapnutí Premium tarifu — odhad ROI je +14 200 Kč/měsíc.' },
            { i: 'medal-ribbon-star-bold', c: '#FFD166', tag: 'Výkon', t: 'Vaše firma je v top 8 % gastro segmentu v Brně podle hodnocení i rychlosti odpovědí.' },
          ].map((x, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 12, background: T.cardSoft, border: '1px solid ' + T.cardBorder, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: x.c + '22', border: '1px solid ' + x.c + '44', display: 'grid', placeItems: 'center' }}>
                  <Icon name={x.i} size={13} color={x.c}/>
                </div>
                <span style={{ color: x.c, fontSize: 10, fontWeight: 800, fontFamily: T.fontUI, letterSpacing: 0.7, textTransform: 'uppercase' }}>{x.tag}</span>
              </div>
              <div style={{ color: T.cardMuted, fontFamily: T.fontUI, fontSize: 12, lineHeight: 1.5 }}>{x.t}</div>
            </div>
          ))}
        </div>
      </ECard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <ECard>
          <ResponseTimeCard period={period} />
        </ECard>
        <ECard>
          <WageBenchmark />
        </ECard>
        <ECard>
          <FirstInterestCard period={period} />
        </ECard>
        <ECard>
          <RetentionCard />
        </ECard>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// DOBA ODEZVY FIRMY + DOBA DO PRVNÍHO ZÁJMU
// Zdroj: simulovaná data na úrovni (kandidát, inzerát) / (inzerát), zapouzdřená
// v getResponseRecords()/getFirstSwipeRecords(). Až bude platforma reálně
// ukládat swipe_at / firm_response_at / firm_decision (matches) a
// published_at / first_swipe_at (jobs), stačí přepsat tělo těchto dvou funkcí
// na živý dotaz do Supabase — zbytek (bucketing, statistiky, komponenty) se
// nemění, protože pracuje jen s tvarem { swipe_at, firm_response_at, firm_decision }
// resp. { published_at, first_swipe_at }.
// ─────────────────────────────────────────────────────────────

const PERIOD_DAYS = { '7d': 7, '30d': 30, '90d': 90, 'rok': 365 };

const RESPONSE_BUCKETS = [
  { key: 'lt5m',  label: '<5 min',     color: '#5BD68A' },
  { key: '5_30m', label: '5-30m',      color: '#5BD68A' },
  { key: '30_1h', label: '30-1h',      color: '#FFD166' },
  { key: '1_3h',  label: '1-3h',       color: '#FFD166' },
  { key: '3_12h', label: '3-12h',      color: '#f43f5e' },
  { key: 'gt12h', label: '>12h',       color: '#f43f5e' },
  { key: 'none',  label: 'Bez odezvy', color: '#9999cc' },
];

function _bucketForMinutes(minutes) {
  if (minutes < 5)   return 'lt5m';
  if (minutes < 30)  return '5_30m';
  if (minutes < 60)  return '30_1h';
  if (minutes < 180) return '1_3h';
  if (minutes < 720) return '3_12h';
  return 'gt12h';
}

function _fmtMinutes(min) {
  if (min == null) return '—';
  if (min < 60) return Math.round(min) + ' min';
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  return h + 'h' + (m ? ' ' + m + 'min' : '');
}

// Deterministický pseudonáhodný generátor (stejný vstup → stejný výstup, žádné blikání při re-renderu)
function _seededRnd(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// ── Zástupný zdroj: páry (kandidát, inzerát) se swipe_at / firm_response_at / firm_decision ──
function getResponseRecords(rangeDays) {
  const now = Date.now();
  const DAY = 86400000;
  const mult = rangeDays / 30;
  const rnd = _seededRnd(Math.round(rangeDays) + 42);

  const plan = [
    { min: 1,   max: 5,    count: 142, acceptRate: 0.34 },
    { min: 5,   max: 30,   count: 98,  acceptRate: 0.30 },
    { min: 30,  max: 60,   count: 64,  acceptRate: 0.22 },
    { min: 60,  max: 180,  count: 41,  acceptRate: 0.17 },
    { min: 180, max: 720,  count: 22,  acceptRate: 0.10 },
    { min: 720, max: 1440, count: 8,   acceptRate: 0.06 },
  ];

  const records = [];
  plan.forEach(p => {
    const count = Math.max(1, Math.round(p.count * mult));
    for (let i = 0; i < count; i++) {
      const minutes = p.min + rnd() * (p.max - p.min);
      const swipeAt = now - rnd() * rangeDays * DAY;
      records.push({
        swipe_at: new Date(swipeAt).toISOString(),
        firm_response_at: new Date(swipeAt + minutes * 60000).toISOString(),
        firm_decision: rnd() < p.acceptRate ? 'accepted' : 'rejected',
      });
    }
  });

  // "Bez odezvy" — swipnuto 7+ dní zpět, firma nikdy nezareagovala
  const noneCount = Math.max(0, Math.round(19 * mult));
  const noneSpan = Math.max(7, rangeDays);
  for (let i = 0; i < noneCount; i++) {
    const swipeAt = now - (7 + rnd() * (noneSpan - 7)) * DAY;
    records.push({ swipe_at: new Date(swipeAt).toISOString(), firm_response_at: null, firm_decision: null });
  }

  // Čerstvé swipy (< 7 dní) — firma zatím neodpověděla, do statistiky se ještě nepočítají
  const pendingCount = Math.max(0, Math.round(6 * mult));
  const pendingSpan = Math.min(6, rangeDays);
  for (let i = 0; i < pendingCount; i++) {
    const swipeAt = now - rnd() * pendingSpan * DAY;
    records.push({ swipe_at: new Date(swipeAt).toISOString(), firm_response_at: null, firm_decision: null });
  }

  return records;
}

// Bucketing + "míra výběru podle rychlosti" (chrání proti cherry-pickingu — nezodpovězení
// 7+ dní se počítají jako nejhorší kategorie, ne že by z výpočtu úplně vypadli)
function computeResponseStats(records, rangeDays) {
  const now = Date.now();
  const DAY = 86400000;
  const cutoff = now - rangeDays * DAY;

  const counted = records
    .filter(r => new Date(r.swipe_at).getTime() >= cutoff)
    .map(r => {
      const swipeMs = new Date(r.swipe_at).getTime();
      if (r.firm_response_at) {
        const minutes = (new Date(r.firm_response_at).getTime() - swipeMs) / 60000;
        return { bucket: _bucketForMinutes(minutes), minutes, decision: r.firm_decision };
      }
      const ageDays = (now - swipeMs) / DAY;
      if (ageDays >= 7) return { bucket: 'none', minutes: null, decision: null };
      return null; // stále čeká na odpověď firmy — do statistiky zatím nevstupuje
    })
    .filter(Boolean);

  const byBucket = {};
  RESPONSE_BUCKETS.forEach(b => byBucket[b.key] = { total: 0, accepted: 0 });
  counted.forEach(c => { byBucket[c.bucket].total++; if (c.decision === 'accepted') byBucket[c.bucket].accepted++; });

  const fastKeys = ['lt5m', '5_30m', '30_1h'];
  const slowKeys = ['3_12h', 'gt12h', 'none'];
  const sum = (keys, field) => keys.reduce((a, k) => a + byBucket[k][field], 0);
  const fastTotal = sum(fastKeys, 'total'), fastAcc = sum(fastKeys, 'accepted');
  const slowTotal = sum(slowKeys, 'total'), slowAcc = sum(slowKeys, 'accepted');
  const fastRate = fastTotal ? fastAcc / fastTotal : 0;
  const slowRate = slowTotal ? slowAcc / slowTotal : 0;
  const multiplier = slowTotal && slowRate > 0 ? fastRate / slowRate : null;

  const respondedMinutes = counted.filter(c => c.minutes != null).map(c => c.minutes);
  const avgMinutes = respondedMinutes.length ? respondedMinutes.reduce((a, m) => a + m, 0) / respondedMinutes.length : null;

  return {
    chartData: RESPONSE_BUCKETS.map(b => ({ l: b.label, v: byBucket[b.key].total, color: b.color })),
    multiplier,
    avgMinutes,
    total: counted.length,
  };
}

function ResponseTimeCard({ period = '30d' }) {
  const rangeDays = PERIOD_DAYS[period] || 30;
  const stats = computeResponseStats(getResponseRecords(rangeDays), rangeDays);
  const subtitle = stats.multiplier != null
    ? `Kandidáti s odpovědí do 1 h matchují ${stats.multiplier.toFixed(1)}× častěji`
    : 'Rychlost odpovědi vs. míra výběru kandidátů';

  return (
    <>
      <SectionHeader title="Doba odpovědi firmy" subtitle={subtitle} />
      <BarChart width={500} height={200} data={stats.chartData} />
      <div style={{ marginTop: 8, color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 11 }}>
        Váš průměr: <span style={{ color: T.cardText, fontFamily: T.fontMono, fontWeight: 700 }}>{_fmtMinutes(stats.avgMinutes)}</span>
        {' · '}{stats.total} vyhodnocených kandidátů
      </div>
      <div style={{ marginTop: 4, color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10 }}>
        „Bez odezvy" = firma na kandidáta nereagovala do 7 dní od jeho swipu.
      </div>
    </>
  );
}

// ── Zástupný zdroj: inzeráty se published_at / first_swipe_at ──
function getFirstSwipeRecords(rangeDays) {
  const now = Date.now();
  const DAY = 86400000;
  const mult = rangeDays / 30;
  const rnd = _seededRnd(Math.round(rangeDays) + 777);

  const plan = [
    { min: 1,   max: 5,    count: 2 },
    { min: 5,   max: 30,   count: 5 },
    { min: 30,  max: 60,   count: 7 },
    { min: 60,  max: 180,  count: 9 },
    { min: 180, max: 720,  count: 6 },
    { min: 720, max: 1440, count: 3 },
  ];

  const records = [];
  plan.forEach(p => {
    const count = Math.max(0, Math.round(p.count * mult));
    for (let i = 0; i < count; i++) {
      const minutes = p.min + rnd() * (p.max - p.min);
      const publishedAt = now - rnd() * rangeDays * DAY;
      records.push({
        published_at: new Date(publishedAt).toISOString(),
        first_swipe_at: new Date(publishedAt + minutes * 60000).toISOString(),
      });
    }
  });

  // Inzerát publikován 7+ dní zpět a dosud nikdo neswipnul
  const noneCount = Math.max(0, Math.round(2 * mult));
  const noneSpan = Math.max(7, rangeDays);
  for (let i = 0; i < noneCount; i++) {
    const publishedAt = now - (7 + rnd() * (noneSpan - 7)) * DAY;
    records.push({ published_at: new Date(publishedAt).toISOString(), first_swipe_at: null });
  }

  return records;
}

function computeFirstSwipeStats(records, rangeDays) {
  const now = Date.now();
  const DAY = 86400000;
  const cutoff = now - rangeDays * DAY;

  const counted = records
    .filter(r => new Date(r.published_at).getTime() >= cutoff)
    .map(r => {
      const pubMs = new Date(r.published_at).getTime();
      if (r.first_swipe_at) {
        const minutes = (new Date(r.first_swipe_at).getTime() - pubMs) / 60000;
        return { bucket: _bucketForMinutes(minutes), minutes };
      }
      const ageDays = (now - pubMs) / DAY;
      if (ageDays >= 7) return { bucket: 'none', minutes: null };
      return null; // inzerát je nový, na první swipe se ještě čeká
    })
    .filter(Boolean);

  const byBucket = {};
  RESPONSE_BUCKETS.forEach(b => byBucket[b.key] = 0);
  counted.forEach(c => byBucket[c.bucket]++);

  const minutesList = counted.filter(c => c.minutes != null).map(c => c.minutes);
  const avgMinutes = minutesList.length ? minutesList.reduce((a, m) => a + m, 0) / minutesList.length : null;
  const medianMinutes = minutesList.length ? [...minutesList].sort((a, b) => a - b)[Math.floor(minutesList.length / 2)] : null;

  return {
    chartData: RESPONSE_BUCKETS.map(b => ({ l: b.label, v: byBucket[b.key], color: '#5B6BFF' })),
    avgMinutes,
    medianMinutes,
    total: counted.length,
  };
}

function FirstInterestCard({ period = '30d' }) {
  const rangeDays = PERIOD_DAYS[period] || 30;
  const stats = computeFirstSwipeStats(getFirstSwipeRecords(rangeDays), rangeDays);
  const hasHistogram = stats.total >= 5;

  return (
    <>
      <SectionHeader title="Doba do prvního zájmu" subtitle="Jak rychle si lidé všimnou vašeho inzerátu" />
      <div style={{ padding: hasHistogram ? '14px 0 10px' : '20px 0 6px' }}>
        <div style={{ color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>Průměrně</div>
        <div style={{ color: T.cardText, fontFamily: T.fontMono, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>{_fmtMinutes(stats.avgMinutes)}</div>
      </div>
      {hasHistogram && <BarChart width={500} height={160} data={stats.chartData} />}
      <div style={{ marginTop: 8, color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 11 }}>
        Napříč {stats.total} inzeráty za dané období{stats.medianMinutes != null ? ` · medián ${_fmtMinutes(stats.medianMinutes)}` : ''}
      </div>
    </>
  );
}

function CohortTable() {
  const cohorts = [
    { week: '6.4. – 12.4.', size: 12, vals: [100, 92, 83, 75, 75, 67] },
    { week: '13.4. – 19.4.', size: 18, vals: [100, 89, 78, 72, 67] },
    { week: '20.4. – 26.4.', size: 14, vals: [100, 86, 79, 71] },
    { week: '27.4. – 3.5.', size: 22, vals: [100, 91, 82] },
    { week: '4.5. – 10.5.', size: 16, vals: [100, 88] },
    { week: 'Tento týden', size: 9, vals: [100] },
  ];
  return (
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 3, fontFamily: T.fontUI, fontSize: 11.5 }}>
      <thead>
        <tr style={{ color: T.cardMutedSoft, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          <th style={{ textAlign: 'left', padding: '4px 8px' }}>Týden nástupu</th>
          <th style={{ textAlign: 'right', padding: '4px 8px' }}>Vel.</th>
          {['T0','T+1','T+2','T+3','T+4','T+5'].map(h => <th key={h} style={{ padding: '4px 6px', textAlign: 'center' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {cohorts.map((c, i) => (
          <tr key={i}>
            <td style={{ color: T.cardLight, padding: '6px 8px', fontWeight: 600 }}>{c.week}</td>
            <td style={{ color: T.cardMuted, fontFamily: T.fontMono, padding: '6px 8px', textAlign: 'right' }}>{c.size}</td>
            {[0,1,2,3,4,5].map(j => {
              const v = c.vals[j];
              if (v == null) return <td key={j} style={{ padding: 0 }}><div style={{ height: 26, borderRadius: 5, background: T.cardSoft }}/></td>;
              const op = 0.2 + (v / 100) * 0.7;
              return (
                <td key={j} style={{ padding: 0 }}>
                  <div style={{ height: 26, borderRadius: 5, background: `rgba(0, 32, 246, ${op})`, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700 }}>{v}%</div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─────────────────────────────────────────────────────────────
// MZDOVÝ BENCHMARK — ručně udržovaná distribuce mezd napříč firmami na platformě.
// Žádný region/obor (to dřív vedlo k zavádějícímu srovnání) — obecný trh, zobrazený
// jako histogram (kolik firem platí v jakém pásmu), s vaším pásmem zvýrazněným.
//
// TODO: nahradit živým výpočtem — potřebuje agregaci hodinovek napříč VŠEMI
// aktivními inzeráty VŠECH zaměstnavatelů na platformě (ne jen vlastní firmy),
// tu zatím nemáme. Do té doby getWageDistribution()/getWagePercentiles() vrací
// ručně udržovaná referenční data — zbytek komponenty (bucketing, percentil,
// barvy) se pak nemusí měnit.
// ─────────────────────────────────────────────────────────────
const WAGE_DISTRIBUTION = [
  { bucket_kc_h: 120, count: 18 },
  { bucket_kc_h: 140, count: 42 },
  { bucket_kc_h: 160, count: 65 },
  { bucket_kc_h: 180, count: 48 },
  { bucket_kc_h: 200, count: 34 },
  { bucket_kc_h: 220, count: 16 },
  { bucket_kc_h: 240, count: 7 },
];
const WAGE_PERCENTILES = [
  { pct: 5,  wage_kc_h: 120 },
  { pct: 25, wage_kc_h: 145 },
  { pct: 50, wage_kc_h: 170 },
  { pct: 75, wage_kc_h: 195 },
  { pct: 95, wage_kc_h: 230 },
];
const WAGE_TOP10_KC_H = 220;
const WAGE_BENCHMARK_UPDATED = '2026-04-01';
const WAGE_BENCHMARK_EMAIL = 'data@makej.eu';

// Jediné místo, které zná zdroj dat. Později stačí přepsat tělo těchto funkcí
// (např. na fetch živých dat z platformy) — zbytek komponenty zůstane beze změny.
function getWageDistribution() {
  return WAGE_DISTRIBUTION;
}
function getWagePercentiles() {
  return WAGE_PERCENTILES;
}

// Lineární interpolace mezi nejbližšími body křivky — odhad, kolik % firem platí míň než `wage`.
function estimateWagePercentile(wage, points) {
  if (!points.length) return null;
  if (wage <= points[0].wage_kc_h) return points[0].pct;
  if (wage >= points[points.length - 1].wage_kc_h) return points[points.length - 1].pct;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    if (wage >= a.wage_kc_h && wage <= b.wage_kc_h) {
      const t = (wage - a.wage_kc_h) / (b.wage_kc_h - a.wage_kc_h);
      return Math.round(a.pct + t * (b.pct - a.pct));
    }
  }
  return 50;
}

// Do kterého pásma histogramu vaše mzda spadá (poslední pásmo je otevřené — "240+")
function _wageBucketIndex(wage, distribution) {
  for (let i = distribution.length - 1; i >= 0; i--) {
    if (wage >= distribution[i].bucket_kc_h) return i;
  }
  return 0;
}

function WageBenchmark() {
  const distribution = getWageDistribution();
  const points = getWagePercentiles();
  const median = points.find(p => p.pct === 50);

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  // Fallback pro jistotu, kdyby benchmark data chyběla (v běžném provozu nenastane)
  if (!distribution.length || !median) {
    return (
      <>
        <SectionHeader title="Průměrná hodinovka brigádníků" />
        <div style={{ padding: '18px 0 6px', color: T.cardMuted, fontFamily: T.fontUI, fontSize: 13, lineHeight: 1.55 }}>
          Zatím nemáme aktuální data. Napište nám na{' '}
          <a href={`mailto:${WAGE_BENCHMARK_EMAIL}`} style={{ color: '#0020F6', textDecoration: 'none', fontWeight: 700 }}>{WAGE_BENCHMARK_EMAIL}</a>.
        </div>
      </>
    );
  }

  // „Váš průměr" — průměr hodinovky napříč všemi aktivními inzeráty firmy (celé portfolio)
  const jobs = (typeof E_JOBS !== 'undefined' ? E_JOBS : []).filter(j => j.status === 'active' || j.status === 'urgent');
  const yourWage = jobs.length ? Math.round(jobs.reduce((a, j) => a + Number(j.pay || 0), 0) / jobs.length) : null;
  const percentile = yourWage != null ? estimateWagePercentile(yourWage, points) : null;
  const yourBucketIdx = yourWage != null ? _wageBucketIndex(yourWage, distribution) : -1;

  // Barevná logika podle percentilu: zelená nad polovinou trhu, žlutá kolem mediánu, červená pod
  let cmp = null;
  if (percentile != null) {
    if (percentile >= 60)      cmp = { color: '#1a9e4d', label: 'nad trhem' };
    else if (percentile >= 40) cmp = { color: '#c99400', label: 'na úrovni trhu' };
    else                       cmp = { color: '#f43f5e', label: 'pod trhem' };
  }

  const maxCount = Math.max(...distribution.map(d => d.count));
  const BAR_TRACK_H = 110;

  return (
    <>
      <SectionHeader title="Průměrná hodinovka brigádníků" subtitle={`Napříč trhem · aktualizováno ${fmtDate(WAGE_BENCHMARK_UPDATED)}`} />

      {percentile != null && (
        <div style={{ color: cmp.color, fontFamily: T.fontUI, fontSize: 15.5, fontWeight: 800, lineHeight: 1.3, marginTop: 4 }}>
          Platíte {percentile >= 50 ? 'více' : 'méně'} než {percentile}&nbsp;% firem na Makej!
        </div>
      )}

      {/* Histogram — kolik firem platí v jakém pásmu, vaše pásmo zvýrazněné */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: BAR_TRACK_H + 24, marginTop: 18 }}>
        {distribution.map((d, i) => {
          const isYou = i === yourBucketIdx;
          const h = maxCount ? Math.max(4, Math.round((d.count / maxCount) * BAR_TRACK_H)) : 4;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ height: 16, width: '100%', textAlign: 'center' }}>
                {isYou && <span style={{ color: cmp.color, fontFamily: T.fontUI, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Vy</span>}
              </div>
              <div style={{ width: '100%', height: h, borderRadius: '8px 8px 3px 3px', background: isYou ? cmp.color : 'rgba(91,107,255,0.45)', marginTop: 4 }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        {distribution.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', color: T.cardMutedSoft, fontFamily: T.fontMono, fontSize: 10 }}>
            {i === distribution.length - 1 ? `${d.bucket_kc_h}+` : d.bucket_kc_h}
          </div>
        ))}
      </div>

      {/* Souhrn — medián trhu / vy / top 10 % */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 20, paddingTop: 14, borderTop: '1px solid ' + T.cardBorder }}>
        <div>
          <div style={{ color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Medián trhu</div>
          <div style={{ color: T.cardText, fontFamily: T.fontMono, fontSize: 19, fontWeight: 800 }}>{median.wage_kc_h}<span style={{ fontSize: 12, fontWeight: 600, color: T.cardMuted }}> Kč</span></div>
        </div>
        {yourWage != null && (
          <div>
            <div style={{ color: cmp.color, fontFamily: T.fontUI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Vy</div>
            <div style={{ color: cmp.color, fontFamily: T.fontMono, fontSize: 19, fontWeight: 800 }}>{yourWage}<span style={{ fontSize: 12, fontWeight: 600 }}> Kč</span></div>
          </div>
        )}
        <div>
          <div style={{ color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Top 10 %</div>
          <div style={{ color: T.cardText, fontFamily: T.fontMono, fontSize: 19, fontWeight: 800 }}>{WAGE_TOP10_KC_H}+<span style={{ fontSize: 12, fontWeight: 600, color: T.cardMuted }}> Kč</span></div>
        </div>
      </div>

      {yourWage == null && (
        <div style={{ marginTop: 14, color: T.cardMuted, fontFamily: T.fontUI, fontSize: 12.5, lineHeight: 1.55 }}>
          Zatím nemáte žádný aktivní inzerát, se kterým bychom vás mohli srovnat s trhem.
        </div>
      )}

      <div style={{ marginTop: 12, color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10.5, lineHeight: 1.5 }}>
        Orientační odhad na základě interní distribuce mezd na platformě. Nemusí odpovídat aktuální situaci na trhu.
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// RETENCE KANDIDÁTŮ — kolik najatých kandidátů se k firmě vrací opakovaně
// (2+ záznamy se stavem "Najato" napříč různými inzeráty, ne v rámci jednoho inzerátu).
// Počítá se za celou historii firmy, ne za zvolené období — retence je dlouhodobá metrika.
//
// TODO: napojit na reálný "Najato" stav, jakmile bude definován spolehlivý mechanismus
// označování kandidátů jako najatých (otevřený bod z dřívějška). Do té doby vrací
// getRetentionRecords() mock data ve správné struktuře { id, name, hires } — zbytek
// komponenty (výpočet %, edge case, seznam nejvěrnějších) se pak nemusí měnit.
// ─────────────────────────────────────────────────────────────
function getRetentionRecords() {
  return [
    { id: 'r1',  name: 'Petr N.',    hires: 4 },
    { id: 'r2',  name: 'Klára V.',   hires: 3 },
    { id: 'r3',  name: 'Tomáš M.',   hires: 3 },
    { id: 'r4',  name: 'Eliška Š.',  hires: 2 },
    { id: 'r5',  name: 'Adam P.',    hires: 2 },
    { id: 'r6',  name: 'Markéta L.', hires: 1 },
    { id: 'r7',  name: 'Jakub V.',   hires: 1 },
    { id: 'r8',  name: 'Sára D.',    hires: 1 },
    { id: 'r9',  name: 'David K.',   hires: 1 },
    { id: 'r10', name: 'Nikola H.',  hires: 1 },
    { id: 'r11', name: 'Filip R.',   hires: 1 },
  ];
}

function computeRetentionStats(records) {
  const total = records.length;
  const returning = records.filter(r => r.hires >= 2).length;
  const pct = total > 0 ? Math.round((returning / total) * 100) : null;
  const top = [...records].sort((a, b) => b.hires - a.hires).filter(r => r.hires >= 2).slice(0, 5);

  // Rozpad podle počtu brigád — pro firmy s víc inzeráty/kandidáty vypovídá líp než jmenovky
  const tiers = [
    { key: '1', label: '1× najato',   test: h => h === 1 },
    { key: '2', label: '2× najato',   test: h => h === 2 },
    { key: '3+', label: '3+ × najato', test: h => h >= 3 },
  ];
  const breakdown = tiers.map(t => {
    const count = records.filter(r => t.test(r.hires)).length;
    return { ...t, count, pct: total ? Math.round((count / total) * 100) : 0 };
  });

  return { total, returning, pct, top, breakdown, hasEnoughData: total >= 5 };
}

// Tarif firmy rozhoduje, jestli dává smysl vypisovat konkrétní jména (malá firma, pár inzerátů)
// nebo procentuální rozpad (větší firma s víc inzeráty — jmenovky by u desítek kandidátů nic neřekly).
// Stejná normalizace starých názvů tarifů jako v EPricing (ECOMPANY.plan v datech zatím ukládá
// staré názvy — Standard, Business, Enterprise…).
function _planTier() {
  const planName = ((typeof ECOMPANY !== 'undefined' && ECOMPANY.plan) || '').toLowerCase();
  if (planName.includes('enterprise') || planName.includes('vlastní') || planName.includes('vlastni')) return 'vlastni';
  if (planName.includes('business') || planName.includes('premium') || planName.includes('maximální') || planName.includes('maximalni')) return 'maximalni';
  if (planName.includes('dynamick')) return 'dynamicky';
  if (planName.includes('standard') || planName.includes('výhodný') || planName.includes('vyhodny')) return 'vyhodny';
  return 'zakladni';
}

function RetentionCard() {
  const stats = computeRetentionStats(getRetentionRecords()); // TODO: napojit na reálný "Najato" stav
  const showNamed = ['zakladni', 'vyhodny'].includes(_planTier());

  return (
    <>
      <SectionHeader title="Retence kandidátů" subtitle="Kolik lidí se k vám vrací" />

      {!stats.hasEnoughData && (
        <div style={{ padding: '18px 0 6px', color: T.cardMuted, fontFamily: T.fontUI, fontSize: 13, lineHeight: 1.55 }}>
          Zatím nedostatek dat — potřebujeme alespoň 5 najatých kandidátů pro spolehlivou statistiku.
        </div>
      )}

      {stats.hasEnoughData && (
        <>
          <div style={{ padding: '18px 0 6px' }}>
            <div style={{ color: '#0020F6', fontFamily: T.fontMono, fontSize: 34, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
              {stats.pct}<span style={{ fontSize: 18, fontWeight: 700 }}>%</span>
            </div>
            <div style={{ marginTop: 8, color: T.cardMuted, fontFamily: T.fontUI, fontSize: 12.5 }}>
              {stats.returning} z {stats.total} najatých kandidátů u vás pracovalo opakovaně
            </div>
          </div>

          {showNamed && stats.top.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <div style={{ color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Nejvěrnější kandidáti
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stats.top.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 9, background: T.cardSoft, border: '1px solid ' + T.cardBorder }}>
                    <span style={{ color: T.cardText, fontFamily: T.fontUI, fontSize: 12.5, fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: '#0020F6', fontFamily: T.fontMono, fontSize: 12, fontWeight: 800 }}>{c.hires}× brigáda</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showNamed && (
            <div style={{ marginTop: 6 }}>
              <div style={{ color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Rozpad podle počtu brigád
              </div>
              {stats.breakdown.map(t => (
                <div key={t.key} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: T.fontUI, marginBottom: 4 }}>
                    <span style={{ color: T.cardLight }}>{t.label}</span>
                    <span style={{ color: T.cardText, fontFamily: T.fontMono, fontWeight: 700 }}>{t.count} · {t.pct} %</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: T.cardSoft }}>
                    <div style={{ height: '100%', width: t.pct + '%', borderRadius: 3, background: '#0020F6' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 12, color: T.cardMutedSoft, fontFamily: T.fontUI, fontSize: 10.5, lineHeight: 1.5 }}>
        Počítáno za celou historii firmy napříč všemi inzeráty, nezávisle na zvoleném období.
      </div>
    </>
  );
}

// ── Demografie ────────────────────────────────────────────────
function AnalyticsDemo() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <ECard style={{ display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title="Věk" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <BarChart width={300} height={200} data={[
              { l: '15-17', v: 22 }, { l: '18-21', v: 87 }, { l: '22-25', v: 68 }, { l: '26-30', v: 31 }, { l: '30+', v: 14 },
            ]} color="#0020F6" />
          </div>
        </ECard>
        <ECard style={{ display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title="Pohlaví" />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Donut size={130} thickness={20} data={[{ v: 58, color: '#5B6BFF' }, { v: 41, color: '#FFD166' }, { v: 1, color: '#E0B0FF' }]} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: T.fontUI, fontSize: 12 }}>
              {[
                { l: 'Žena', v: '58 %', n: 130, c: '#5B6BFF' },
                { l: 'Muž', v: '41 %', n: 92, c: '#FFD166' },
                { l: 'Jiné', v: '1 %', n: 2, c: '#E0B0FF' },
              ].map((x, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />
                    <span style={{ color: T.cardLight, flex: 1 }}>{x.l}</span>
                    <span style={{ color: T.cardText, fontFamily: T.fontMono, fontWeight: 700 }}>{x.v}</span>
                  </div>
                  <div style={{ color: T.cardMutedSoft, fontFamily: T.fontMono, fontSize: 10, marginLeft: 14 }}>{x.n} kandidátů</div>
                </div>
              ))}
            </div>
          </div>
        </ECard>
        <ECard style={{ display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title="Zaměstnanecký status" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {[
              { l: 'Středoškolák', v: 38, c: '#0020F6' },
              { l: 'Vysokoškolák', v: 42, c: '#5B6BFF' },
              { l: 'Pracující na vedlejšák', v: 14, c: '#FFD166' },
              { l: 'Bez práce', v: 6, c: '#E0B0FF' },
            ].map((x, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: T.fontUI, marginBottom: 4 }}>
                  <span style={{ color: T.cardLight }}>{x.l}</span>
                  <span style={{ color: T.cardText, fontFamily: T.fontMono, fontWeight: 700 }}>{x.v} %</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: T.cardSoft }}>
                  <div style={{ height: '100%', width: x.v + '%', borderRadius: 3, background: x.c }} />
                </div>
              </div>
            ))}
          </div>
        </ECard>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// PLÁN SMĚN — reálný kalendář z Supabase dat (E_JOBS)
// ─────────────────────────────────────────────────────────────

function ECalendar() {
  const dark    = window._makejIsDark;
  const cText   = dark ? '#ffffff'    : '#111111';
  const cMuted  = dark ? T.muted      : '#666666';
  const cSoft   = dark ? T.mutedSoft  : '#888888';
  const cLight  = dark ? T.light      : '#444444';
  const cBorder = dark ? T.border     : T.cardBorder;

  const now = new Date();
  const [viewYear,  setViewYear]  = useStateE(now.getFullYear());
  const [viewMonth, setViewMonth] = useStateE(now.getMonth()); // 0-indexed

  const MONTH_NAMES = ['Leden','Únor','Březen','Duben','Květen','Červen',
                       'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
  const DAY_NAMES   = ['Po','Út','St','Čt','Pá','So','Ne'];

  // Parse ISO "2025-05-14" nebo Czech "14.5.2025"
  function parseDate(s) {
    if (!s) return null;
    const iso = new Date(s);
    if (!isNaN(iso.getTime())) return iso;
    const p = s.split('.');
    if (p.length >= 2) {
      const d2 = new Date(p[2] ? parseInt(p[2]) : now.getFullYear(), parseInt(p[1]) - 1, parseInt(p[0]));
      if (!isNaN(d2.getTime())) return d2;
    }
    return null;
  }

  function jobColor(j) {
    if (j.status === 'filled')  return '#5BD68A';
    if (j.status === 'urgent')  return '#f43f5e';
    if (j.status === 'paused')  return '#9999cc';
    return j.accent || '#8AB4FF';
  }

  // Jobs pro aktuální zobrazený měsíc
  const monthJobs = E_JOBS.filter(j => {
    const d = parseDate(j.date);
    return d && d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  });

  // Seskupit podle dne
  const byDay = {};
  monthJobs.forEach(j => {
    const d = parseDate(j.date);
    if (!d) return;
    const day = d.getDate();
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(j);
  });

  // Pole dnů pro grid — včetně přetékajících dnů z předchozího/dalšího měsíce
  const daysInMonth     = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstWeekday    = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Po = 0
  const calDays = [];
  for (let i = 0; i < firstWeekday; i++) calDays.push({ d: daysInPrevMonth - firstWeekday + 1 + i, current: false });
  for (let d = 1; d <= daysInMonth; d++) calDays.push({ d, current: true });
  const totalCells = Math.ceil(calDays.length / 7) * 7;
  let nextMonthDay = 1;
  while (calDays.length < totalCells) calDays.push({ d: nextMonthDay++, current: false });

  // Statistiky
  const filled     = monthJobs.filter(j => j.status === 'filled').length;
  const open       = monthJobs.filter(j => j.status === 'active' || j.status === 'urgent').length;
  const totalHired = monthJobs.reduce((s, j) => s + (j.hired || 0), 0);

  const isCurrentMonth = now.getFullYear() === viewYear && now.getMonth() === viewMonth;
  const today = now.getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div style={{ padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* KPI čísla */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { l: 'Brigády ' + MONTH_NAMES[viewMonth], v: monthJobs.length || '—', sub: 'inzerátů s datem v tomto měsíci', c: '#FFD166' },
          { l: 'Otevřené',    v: open     || '—', sub: 'potřebují brigádníky',  c: '#f43f5e' },
          { l: 'Naplněno',   v: filled    || '—', sub: 'brigád s obsazenou rolí', c: '#5BD68A' },
          { l: 'Najato',     v: totalHired || '—', sub: 'přijatých brigádníků',  c: '#5B6BFF' },
        ].map((x, i) => (
          <ECard key={i} padding={16}>
            <div style={{ color: cMuted, fontSize: 11, fontWeight: 700, fontFamily: T.fontUI, letterSpacing: 0.4, textTransform: 'uppercase' }}>{x.l}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <div style={{ color: dark ? x.c : '#111111', fontFamily: T.fontMono, fontSize: 24, fontWeight: 700, letterSpacing: -0.6 }}>{x.v}</div>
            </div>
            <div style={{ color: cSoft, fontSize: 11, fontFamily: T.fontUI, marginTop: 2 }}>{x.sub}</div>
          </ECard>
        ))}
      </div>

      {/* Kalendář */}
      <ECard padding={0} style={{ overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid ' + cBorder }}>
          <button onClick={prevMonth} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(0,32,246,0.06)', border: '1px solid ' + cBorder, color: cLight, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="alt-arrow-left-line-duotone" size={14} color={cLight}/>
          </button>
          <div style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 800, color: cText, minWidth: 160 }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </div>
          <button onClick={nextMonth} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(0,32,246,0.06)', border: '1px solid ' + cBorder, color: cLight, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon name="alt-arrow-right-line-duotone" size={14} color={cLight}/>
          </button>
          <div style={{ flex: 1 }} />
          {/* Legenda */}
          <div style={{ display: 'flex', gap: 14, fontSize: 11, fontFamily: T.fontUI }}>
            {[['#5BD68A','Naplněno'],['#8AB4FF','Aktivní'],['#f43f5e','ASAP']].map(([c,l]) => (
              <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }}/>
                <span style={{ color: cLight }}>{l}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Názvy dní */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid ' + T.border }}>
          {DAY_NAMES.map((d, i) => (
            <div key={d} style={{ padding: '8px 12px', fontSize: 10.5, fontFamily: T.fontUI, fontWeight: 700, color: cSoft, letterSpacing: 0.6, textTransform: 'uppercase', textAlign: i >= 5 ? 'center' : 'left', background: i >= 5 ? 'rgba(0,0,0,0.08)' : 'transparent' }}>{d}</div>
          ))}
        </div>

        {/* Buňky */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {calDays.map((item, i) => {
            const { d, current } = item;
            const dayJobs   = current ? (byDay[d] || []) : [];
            const isWeekend = (i % 7) >= 5;
            const isToday   = isCurrentMonth && current && d === today;
            const dayNumColor = isToday ? '#fff' : current ? cLight : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.22)');
            return (
              <div key={i} style={{
                minHeight: 100, padding: 8,
                borderRight:  (i % 7 < 6) ? '1px solid ' + cBorder : 'none',
                borderBottom: '1px solid ' + cBorder,
                background:   isWeekend ? 'rgba(0,0,0,0.06)' : 'transparent',
              }}>
                <>
                  <div style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: 999, alignItems: 'center', justifyContent: 'center', background: isToday ? T.primary : 'transparent', color: dayNumColor, fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{d}</div>
                  {current && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {dayJobs.map((job, j) => {
                        const c = jobColor(job);
                        return (
                          <div key={j} style={{ padding: '3px 6px', borderRadius: 5, background: c + '22', borderLeft: '2px solid ' + c }}>
                            <div style={{ color: cText, fontWeight: 700, fontSize: 10.5, fontFamily: T.fontUI, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                            {(job.time_start || job.time_end) && (
                              <div style={{ color: cMuted, fontFamily: T.fontMono, fontSize: 9.5 }}>
                                {[job.time_start, job.time_end].filter(Boolean).join('–')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              </div>
            );
          })}
        </div>
      </ECard>

      {/* Seznam otevřených brigád */}
      {open > 0 && (() => {
        const openJobs = monthJobs
          .filter(j => j.status === 'active' || j.status === 'urgent')
          .sort((a, b) => (parseDate(a.date) || 0) - (parseDate(b.date) || 0));
        return (
          <ECard>
            <SectionHeader title="Otevřené brigády" subtitle="Potřebují obsadit brigádníky" />
            {openJobs.map((j, i) => {
              const d = parseDate(j.date);
              const c = jobColor(j);
              const dayName = d ? DAY_NAMES[(d.getDay() + 6) % 7] : '';
              return (
                <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < openJobs.length - 1 ? '1px solid ' + cBorder : 'none' }}>
                  <div style={{ textAlign: 'center', width: 44, flexShrink: 0 }}>
                    <div style={{ color: dark ? c : '#111111', fontFamily: T.fontMono, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{d ? d.getDate() : '—'}</div>
                    <div style={{ color: cMuted, fontSize: 10, fontFamily: T.fontUI }}>{dayName}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: cText, fontFamily: T.fontUI, fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</div>
                    {(j.time_start || j.time_end || j.location) && (
                      <div style={{ color: cMuted, fontFamily: T.fontMono, fontSize: 10.5, marginTop: 2 }}>
                        {[j.time_start && j.time_end ? j.time_start + '–' + j.time_end : j.time_start, j.location].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: (j.hired || 0) > 0 ? (dark ? '#FFD166' : '#111111') : '#f43f5e', fontFamily: T.fontMono, fontSize: 13, fontWeight: 700 }}>
                      {j.hired || 0} najato
                    </div>
                    {j.matches > 0 && (
                      <div style={{ color: cSoft, fontSize: 10, fontFamily: T.fontUI }}>{j.matches} zájemců</div>
                    )}
                  </div>
                </div>
              );
            })}
          </ECard>
        );
      })()}

      {/* Prázdný stav */}
      {monthJobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: cMuted, fontFamily: T.fontUI }}>
          <Icon name="calendar-bold" size={44} color={cSoft} />
          <div style={{ marginTop: 14, fontSize: 16, fontWeight: 700, color: cLight }}>
            Žádné brigády v {MONTH_NAMES[viewMonth]} {viewYear}
          </div>
          <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.6 }}>
            Přidejte inzeráty s datem v tomto měsíci a zobrazí se zde automaticky.
          </div>
        </div>
      )}

    </div>
  );
}

Object.assign(window, { EAnalytics, ECalendar });
