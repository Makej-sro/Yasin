// Makej Employer — Dashboard page
// Reuses ECard, Sparkline, AreaChart, SectionHeader, E_KPIS, E_ACTIVITY, E_JOBS

function CandidateFunnel({ views, swipes, onTab }) {
  const steps = [
    { label: 'Zhlédnutí',   value: views,  color: '#5B6BFF', bg: 'rgba(91,107,255,0.10)', border: 'rgba(91,107,255,0.25)' },
    { label: 'Swipe right', value: swipes, color: '#FFD166', bg: 'rgba(255,209,102,0.10)', border: 'rgba(255,209,102,0.25)' },
  ];
  const minWidths = [70, 45];
  const maxVal = Math.max(views, 1);
  const fmtN = n => n >= 1000 ? n.toLocaleString('cs-CZ').replace(/,/g, ' ') : String(n);
  const conv = views > 0 ? ((swipes / views) * 100).toFixed(1) : null;
  const getW = (val, idx) => Math.max(minWidths[idx], Math.round((val / maxVal) * 96)) + '%';

  // TODO: napojit historická data pro trend — skryto dokud nejsou k dispozici
  const trendPct = null;

  // TODO: napojit reálná data z jednotlivých inzerátů
  const activeJobs = (E_JOBS || []).filter(j => j.status !== 'filled' && j.status !== 'paused');
  const jobInsight = activeJobs.length >= 2 ? (() => {
    const sorted = [...activeJobs].sort((a, b) => b.ctr - a.ctr);
    return { best: sorted[0], worst: sorted[sorted.length - 1] };
  })() : null;

  const truncate = (s, n) => s.length > n ? s.slice(0, n) + '…' : s;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 20px 16px' }}>
      {steps.map((step, i) => (
        <div key={step.label} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {i > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0 7px', gap: 3 }}>
              <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '9px solid #D1D5DB' }} />
              {conv !== null ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: 11.5, fontWeight: 700, color: T.cardLight }}>{conv}% konverze</span>
                  {trendPct !== null ? (
                    <span style={{ fontFamily: T.fontUI, fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2, color: trendPct > 0 ? '#059669' : trendPct < 0 ? '#DC2626' : '#9CA3AF' }}>
                      {trendPct > 0 ? '↑' : trendPct < 0 ? '↓' : '–'}{trendPct > 0 ? '+' : ''}{trendPct}% oproti minulému období
                    </span>
                  ) : null}
                </div>
              ) : (
                <span style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.cardMuted }}>{'—'}</span>
              )}
            </div>
          )}
          <div style={{
            width: getW(step.value, i), padding: '14px 16px', borderRadius: 12,
            background: step.bg, border: '1px solid ' + step.border,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            animation: 'empPop 0.3s ease-out both', animationDelay: (i * 0.13) + 's', transition: 'width 0.5s ease',
          }}>
            <div style={{ fontFamily: T.fontMono, fontSize: 26, fontWeight: 700, color: step.color, letterSpacing: -1, lineHeight: 1 }}>
              {step.value > 0 ? fmtN(step.value) : '—'}
            </div>
            <div style={{ fontFamily: T.fontUI, fontSize: 11, fontWeight: 600, color: T.cardMuted, letterSpacing: 0.3 }}>
              {step.label}
            </div>
          </div>
        </div>
      ))}
      {views === 0 && (
        <div style={{ marginTop: 10, color: T.cardMuted, fontSize: 10.5, fontFamily: T.fontUI, textAlign: 'center' }}>
          Zatím nedostatek dat
        </div>
      )}
      {jobInsight && (
        <div style={{ marginTop: 14, width: '100%', textAlign: 'center', fontFamily: T.fontUI, fontSize: 11, color: T.cardMuted, lineHeight: 1.7 }}>
          <span>Nejlepší inzerát: </span>
          <button onClick={() => onTab && onTab('jobs')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#0020F6', fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textDecoration: 'underline' }}>
            {truncate(jobInsight.best.title, 22)}
          </button>
          <span> ({jobInsight.best.ctr}%) • Nejslabší: </span>
          <button onClick={() => onTab && onTab('jobs')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: T.cardLight, fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textDecoration: 'underline' }}>
            {truncate(jobInsight.worst.title, 22)}
          </button>
          <span> ({jobInsight.worst.ctr}%)</span>
        </div>
      )}
    </div>
  );
}

function EDashboard({ period = '30d', onTab }) {
  const [activityTick, setActivityTick] = useStateE(0);
  const [spinning, setSpinning] = useStateE(false);

  async function refreshActivity() {
    if (spinning) return;
    setSpinning(true);
    try {
      const minDelay = new Promise(r => setTimeout(r, 4000));
      const { data: { session } } = await sb.auth.getSession();
      await Promise.all([
        session?.user ? fetchEmployerData(session.user.id) : Promise.resolve(),
        minDelay,
      ]);
    } catch(e) {}
    setSpinning(false);
    setActivityTick(t => t + 1);
  }

  const PERIOD_MULT = { '7d': 0.23, '30d': 1, '90d': 2.85, 'rok': 10.5 };
  const mult = PERIOD_MULT[period] || 1;

  const BASE_V = [320,380,420,510,480,560,620,590,670,720,760,820,880,940,1010,1080,1140,1200,1280,1340,1410,1480,1540,1620,1700,1780,1860,1940,2030,2120];
  const BASE_S = [80,95,110,130,125,145,160,155,170,185,195,210,225,240,260,275,290,310,330,350,365,385,410,430,455,475,495,520,545,568];
  const BASE_M = [8,10,12,15,13,17,19,18,21,23,25,27,29,32,35,37,40,42,45,48,50,53,56,59,62,65,68,72,75,78];

  const chartConfig = period === '7d'
    ? { labels: ['Po','Út','St','Čt','Pá','So','Ne'], v: BASE_V.slice(-7), s: BASE_S.slice(-7), m: BASE_M.slice(-7) }
    : period === '90d'
    ? { labels: ['Bře','Dub','Kvě','2.Kvě','Čer','2.Čer','Čec'], v: BASE_V.map((x,i) => Math.round(x*(1+i*0.02))), s: BASE_S.map((x,i) => Math.round(x*(1+i*0.02))), m: BASE_M.map((x,i) => Math.round(x*(1+i*0.02))) }
    : period === 'rok'
    ? { labels: ['Led','Úno','Bře','Dub','Kvě','Čer','Čec','Srp','Zář','Říj','Lis','Pro'], v: [420,520,680,830,1010,1200,1380,1560,1820,2100,2400,2800], s: [105,130,170,207,252,300,345,390,455,525,600,700], m: [10,13,17,21,25,30,34,39,45,52,60,70] }
    : { labels: ['1.5','5.5','10.5','15.5','20.5','25.5','30.5'], v: BASE_V, s: BASE_S, m: BASE_M };

  const kpis = E_KPIS.map(k => ({
    ...k,
    value: typeof k.value === 'number' ? Math.round(k.value * mult) : k.value,
    spark: k.spark.map(v => Math.round(v * mult)),
  }));

  // Vyžaduje pozornost — akční upozornění
  const alerts = [];

  const waitingCount = (E_CANDIDATES.new || []).length; // TODO: napojit na reálné matche se statusem 'pending'
  if (waitingCount > 0) alerts.push({
    key: 'waiting', icon: 'bell-bold',
    label: `${waitingCount} ${waitingCount === 1 ? 'kandidát čeká' : waitingCount < 5 ? 'kandidáti čekají' : 'kandidátů čeká'} na odpověď`,
    color: '#0020F6', bg: 'rgba(0,32,246,0.07)', border: 'rgba(0,32,246,0.20)', tab: 'candidates',
  });

  const expiringJobs = (E_JOBS || []).filter(j => j.daysLeft > 0 && j.daysLeft <= 3 && j.status !== 'filled');
  if (expiringJobs.length > 0) {
    const isVeryUrgent = expiringJobs.some(j => j.daysLeft <= 1);
    const ej = expiringJobs[0];
    const shortTitle = ej.title.length > 24 ? ej.title.slice(0, 24) + '…' : ej.title;
    const lbl = expiringJobs.length === 1
      ? `„${shortTitle}“ expiruje za ${ej.daysLeft} ${ej.daysLeft === 1 ? 'den' : 'dny'}`
      : `${expiringJobs.length} inzeráty brzy expirují`;
    alerts.push({
      key: 'expiring', icon: 'danger-bold', label: lbl,
      color: isVeryUrgent ? '#DC2626' : '#D97706',
      bg: isVeryUrgent ? 'rgba(220,38,38,0.07)' : 'rgba(217,119,6,0.07)',
      border: isVeryUrgent ? 'rgba(220,38,38,0.22)' : 'rgba(217,119,6,0.22)',
      tab: 'jobs',
    });
  }

  const unreadMsgs = (typeof E_THREADS !== 'undefined' ? E_THREADS.reduce((s, t) => s + (t.unread || 0), 0) : 0);
  if (unreadMsgs > 0) alerts.push({
    key: 'msgs', icon: 'chat-round-line-bold',
    label: `${unreadMsgs} nepřečtené zprávy`,
    color: '#059669', bg: 'rgba(5,150,105,0.07)', border: 'rgba(5,150,105,0.22)',
    tab: 'chat',
  });

  return (
    <div style={{ padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>

      {/* Vyžaduje pozornost */}
      {alerts.length > 0 && (
        <div style={{
          background: '#fff', border: '1px solid ' + T.cardBorder, borderRadius: 14,
          padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <img src="caution.png" style={{ width: 16, height: 16, objectFit: 'contain' }} />
            <span style={{ color: T.cardMuted, fontFamily: T.fontUI, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>Vyžaduje pozornost</span>
          </div>
          <div style={{ width: 1, height: 18, background: T.cardBorder, flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
            {alerts.map(a => (
              <button
                key={a.key}
                onClick={() => onTab && onTab(a.tab)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '7px 13px', borderRadius: 99,
                  background: a.bg, border: '1px solid ' + a.border,
                  cursor: 'pointer', transition: 'box-shadow .15s',
                  fontFamily: T.fontUI, fontSize: 12, fontWeight: 600, color: a.color,
                  lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px ' + a.border}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <Icon name={a.icon} size={13} color={a.color} />
                {a.label}
                <span style={{ fontSize: 11, opacity: 0.55 }}>{'→'}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {kpis.map(k => (
          <ECard
            key={k.id} padding={24}
            style={k.id === 'rating' ? { position: 'relative', cursor: onTab ? 'pointer' : 'default' } : undefined}
            onClick={k.id === 'rating' ? () => onTab && onTab('reviews') : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,32,246,0.08)', display: 'grid', placeItems: 'center', border: '1px solid rgba(0,32,246,0.15)' }}>
                  <Icon name={k.icon} size={17} color={T.cardLight} />
                </div>
                <span style={{ color: T.cardMuted, fontSize: 13, fontFamily: T.fontUI, fontWeight: 600, letterSpacing: 0.2 }}>{k.label}</span>
              </div>
              {k.id !== 'rating' && (
                <span style={{
                  padding: '4px 9px', borderRadius: 7,
                  background: k.delta >= 0 ? 'rgba(91,214,138,0.2)' : 'rgba(244,63,94,0.2)',
                  color: k.delta >= 0 ? '#5BD68A' : '#f43f5e',
                  fontFamily: T.fontMono, fontSize: 12, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                }}>
                  <Icon name={k.delta >= 0 ? 'arrow-up-bold' : 'arrow-down-bold'} size={11} color={k.delta >= 0 ? '#5BD68A' : '#f43f5e'} />
                  {Math.abs(k.delta).toFixed(1)}%
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 36, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1 }}>
                  {k.id === 'jobs' && k.max != null ? (
                    <>
                      <span style={{ color: T.primary }}>{k.value}</span>
                      <span style={{ color: '#111111' }}> / {k.max}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: T.cardText }}>{typeof k.value === 'number' && k.value >= 1000 ? k.value.toLocaleString('cs-CZ').replace(/,/g, ' ') : k.value}</span>
                      <span style={{ fontSize: 17, color: k.id === 'rating' ? '#D97706' : T.cardMuted, fontWeight: 600, marginLeft: 3 }}>{k.unit}</span>
                    </>
                  )}
                </div>
                <div style={{ color: T.cardMuted, fontSize: 12, fontFamily: T.fontUI, marginTop: 6 }}>
                  {k.id === 'rating' && k.count != null ? `${k.count} hodnocení` : 'vs. minulých 30 dní'}
                </div>
              </div>
              {k.id !== 'rating' && (
                <Sparkline data={k.spark} color={k.delta >= 0 ? '#5BD68A' : '#f43f5e'} width={96} height={38} />
              )}
            </div>
            {k.id === 'rating' && k.lastReview && (
              <div style={{
                position: 'absolute', top: '50%', right: 24, transform: 'translateY(-50%)',
                width: '52%', paddingLeft: 16, borderLeft: '1px solid ' + T.border,
              }}>
                <div style={{ color: T.cardText, fontSize: 14, fontFamily: T.fontUI, fontWeight: 700, marginBottom: 5 }}>{k.lastReview.reviewer}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <StarRow n={k.lastReview.rating} />
                  <span style={{ color: T.cardMuted, fontSize: 12, fontFamily: T.fontUI, fontWeight: 500 }}>{k.lastReview.when}</span>
                </div>
                <div style={{ color: T.cardText, fontSize: 14, fontFamily: T.fontUI, lineHeight: 1.5 }}>
                  {k.lastReview.text}
                </div>
              </div>
            )}
          </ECard>
        ))}
      </div>

      {/* Trend + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        <ECard>
          <SectionHeader
            title="Aktivita kandidátů"
            subtitle={`Konverze kandidátů za posledních ${{ '7d': '7 dní', '30d': '30 dní', '90d': '90 dní', 'rok': '12 měsíců' }[period]}`}
          />
          <CandidateFunnel
            views={chartConfig.v.reduce((a, b) => a + b, 0)}
            swipes={chartConfig.s.reduce((a, b) => a + b, 0)}
            onTab={onTab}
          />
        </ECard>

        <ECard style={{ position: 'relative' }}>
          <button onClick={refreshActivity} style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 8, background: 'rgba(0,32,246,0.06)', border: '1px solid ' + T.cardBorder, display: 'grid', placeItems: 'center', cursor: spinning ? 'default' : 'pointer' }}>
            {spinning ? (
              <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: 'empSpin 2s linear infinite', display: 'block' }}>
                <circle cx="10" cy="10" r="7.5" fill="none" stroke="rgba(0,32,246,0.12)" strokeWidth="2.5" />
                <circle cx="10" cy="10" r="7.5" fill="none" stroke={T.cardText} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="12 35" transform="rotate(-90 10 10)" />
              </svg>
            ) : (
              <span style={{ filter: `drop-shadow(0.4px 0 0 ${T.cardText}) drop-shadow(-0.4px 0 0 ${T.cardText}) drop-shadow(0 0.4px 0 ${T.cardText}) drop-shadow(0 -0.4px 0 ${T.cardText})`, display: 'flex' }}>
                <Icon name="restart-bold" size={19} color={T.cardText} />
              </span>
            )}
          </button>
          <SectionHeader title="Aktivita v reálném čase" subtitle="Posledních 24 hodin" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', overscrollBehavior: 'contain', paddingRight: 4 }}>
            {E_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < E_ACTIVITY.length - 1 ? '1px solid ' + T.cardBorder : 'none' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: a.color + '33', border: '1px solid ' + a.color + '55',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <Icon name={a.icon} size={14} color={a.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#111111', fontSize: 12, fontFamily: T.fontUI, lineHeight: 1.4 }}>
                    <span style={{ color: T.cardText, fontWeight: 700 }}>{a.who}</span>{' '}{a.what}
                  </div>
                  <div style={{ color: '#555555', fontSize: 10.5, fontFamily: T.fontMono, marginTop: 2 }}>{a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </ECard>
      </div>

      {/* Job performance table */}
      <ECard>
        <SectionHeader
          title="Výkon inzerátů"
          subtitle="Klíčové metriky podle inzerátu"
          action={
            <button style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(0,32,246,0.06)', border: '1px solid ' + T.cardBorder, color: T.cardLight, fontFamily: T.fontUI, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="export-bold" size={12} color={T.cardLight}/>Export CSV
            </button>
          }
        />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.fontUI, fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.cardMuted, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid ' + T.cardBorder }}>Inzerát</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid ' + T.cardBorder }}>Zhlédnutí</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid ' + T.cardBorder }}>CTR</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid ' + T.cardBorder }}>Matche</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid ' + T.cardBorder }}>Najato</th>
            </tr>
          </thead>
          <tbody>
            {E_JOBS.slice(0, 5).map(j => (
              <tr key={j.id}>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid ' + T.cardBorder }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 26, borderRadius: 3, background: j.accent }} />
                    <div>
                      <div style={{ color: T.cardText, fontWeight: 600, fontSize: 12 }}>{j.title}</div>
                      <div style={{ color: T.cardMuted, fontSize: 10, fontFamily: T.fontMono, marginTop: 1 }}>{j.plan}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid ' + T.cardBorder, textAlign: 'right', fontFamily: T.fontMono, color: T.cardText, fontWeight: 700 }}>{j.views.toLocaleString('cs-CZ').replace(/,/g, ' ')}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid ' + T.cardBorder, textAlign: 'right', fontFamily: T.fontMono, color: T.cardLight }}>{j.ctr}%</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid ' + T.cardBorder, textAlign: 'right', fontFamily: T.fontMono, color: T.cardLight }}>{j.matches}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid ' + T.cardBorder, textAlign: 'right' }}>
                  <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(91,214,138,0.2)', color: '#5BD68A', fontFamily: T.fontMono, fontSize: 11, fontWeight: 700 }}>{j.hired}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ECard>

    </div>
  );
}

Object.assign(window, { EDashboard });
