// Makej Employer — Dashboard page
// Reuses ECard, Sparkline, AreaChart, SectionHeader, E_KPIS, E_ACTIVITY, E_JOBS

function EDashboard({ period = '30d' }) {
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

  return (
    <div style={{ padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {kpis.map(k => (
          <ECard key={k.id} padding={18}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,32,246,0.08)', display: 'grid', placeItems: 'center', border: '1px solid rgba(0,32,246,0.15)' }}>
                  <Icon name={k.icon} size={14} color={T.cardLight} />
                </div>
                <span style={{ color: T.cardMuted, fontSize: 11.5, fontFamily: T.fontUI, fontWeight: 600, letterSpacing: 0.3 }}>{k.label}</span>
              </div>
              <span style={{
                padding: '3px 7px', borderRadius: 6,
                background: k.delta >= 0 ? 'rgba(91,214,138,0.2)' : 'rgba(244,63,94,0.2)',
                color: k.delta >= 0 ? '#5BD68A' : '#f43f5e',
                fontFamily: T.fontMono, fontSize: 10.5, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: 3,
              }}>
                <Icon name={k.delta >= 0 ? 'arrow-up-bold' : 'arrow-down-bold'} size={10} color={k.delta >= 0 ? '#5BD68A' : '#f43f5e'} />
                {Math.abs(k.delta).toFixed(1)}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontFamily: T.fontMono, fontSize: 28, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>
                  {k.id === 'jobs' && k.max != null ? (
                    <>
                      <span style={{ color: T.primary }}>{k.value}</span>
                      <span style={{ color: '#111111' }}> / {k.max}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: T.cardText }}>{typeof k.value === 'number' && k.value >= 1000 ? k.value.toLocaleString('cs-CZ').replace(/,/g, ' ') : k.value}</span>
                      <span style={{ fontSize: 14, color: T.cardMuted, fontWeight: 600, marginLeft: 2 }}>{k.unit}</span>
                    </>
                  )}
                </div>
                <div style={{ color: T.cardMuted, fontSize: 10.5, fontFamily: T.fontUI, marginTop: 4 }}>vs. minulých 30 dní</div>
              </div>
              <Sparkline data={k.spark} color={k.delta >= 0 ? '#5BD68A' : '#f43f5e'} width={84} height={32} />
            </div>
          </ECard>
        ))}
      </div>

      {/* Trend + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        <ECard>
          <SectionHeader
            title="Aktivita kandidátů"
            subtitle={`Zhlédnutí, swajp-right a matche za ${{ '7d': 'posledních 7 dní', '30d': 'posledních 30 dní', '90d': 'posledních 90 dní', 'rok': 'posledních 12 měsíců' }[period]}`}
            action={
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {[
                  { c: '#5B6BFF', l: 'Zhlédnutí' },
                  { c: '#FFD166', l: 'Swajp right' },
                  { c: '#5BD68A', l: 'Matche' },
                ].map(x => (
                  <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: x.c }} />
                    <span style={{ fontSize: 11, color: T.cardMuted, fontFamily: T.fontUI, fontWeight: 600 }}>{x.l}</span>
                  </div>
                ))}
              </div>
            }
          />
          <AreaChart
            width={620} height={240}
            labels={chartConfig.labels}
            series={[
              { color: '#5B6BFF', data: chartConfig.v },
              { color: '#FFD166', data: chartConfig.s },
              { color: '#5BD68A', data: chartConfig.m },
            ]}
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
