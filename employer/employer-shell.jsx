// Makej Employer — shell, charts, primitives
// Reuses T, Icon, fmtKc from app.jsx; ECOMPANY etc from employer-data.jsx

const { useState: useStateE, useEffect: useEffectE, useRef: useRefE, useMemo: useMemoE } = React;

// ─────────────────────────────────────────────────────────────
// LOGO + COMPANY BADGE
// ─────────────────────────────────────────────────────────────
function ELogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div>
        <div style={{ fontFamily: T.fontHead, fontWeight: 800, fontSize: 22, color: '#0020F6', letterSpacing: -0.5, lineHeight: 1 }}>
          Makej
        </div>
        <div style={{ fontFamily: T.fontUI, fontSize: 9, color: '#6B7280', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3, fontWeight: 700 }}>
          pro firmy
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────
function ESidebar({ tab, onTab }) {
  // Reálné počty z živých globálů (0 → badge se skryje)
  const jobsBadge = (typeof E_JOBS !== 'undefined' ? E_JOBS.filter(j => j.status === 'active' || j.status === 'urgent').length : 0) || null;
  const candBadge = (typeof E_CANDIDATES !== 'undefined' ? (E_CANDIDATES.new || []).length : 0) || null;
  const chatBadge = (typeof E_THREADS !== 'undefined' ? E_THREADS.reduce((s, t) => s + (t.unread || 0), 0) : 0) || null;
  const reviewsBadge = (typeof E_REVIEWS !== 'undefined' ? E_REVIEWS.length : 0) || null;

  const sections = [
    {
      label: 'Přehled',
      items: [
        { k: 'dash',      label: 'Dashboard', icon: 'chart-square-bold',  iconLine: 'chart-square-linear' },
        { k: 'analytics', label: 'Analytika', icon: 'graph-up-bold',      iconLine: 'graph-up-linear',    badge: 'PRO' },
      ],
    },
    {
      label: 'Nábor',
      items: [
        { k: 'jobs', label: 'Inzeráty', icon: 'document-text-bold', iconLine: 'document-text-linear', badge: jobsBadge },
        { k: 'candidates', label: 'Kandidáti', icon: 'users-group-rounded-bold', iconLine: 'users-group-rounded-linear', badge: candBadge },
        { k: 'chat', label: 'Zprávy', icon: 'chat-round-line-bold', iconLine: 'chat-round-line-linear', badge: chatBadge },
        { k: 'calendar', label: 'Plán směn', icon: 'calendar-bold', iconLine: 'calendar-linear' },
      ],
    },
    {
      label: 'Firma',
      items: [
        { k: 'reviews', label: 'Recenze', badge: reviewsBadge },
        { k: 'settings', label: 'Nastavení', icon: 'settings-bold', iconLine: 'settings-linear' },
      ],
    },
  ];

  return (
    <aside style={{
      width: 256, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      padding: '20px 14px',
      borderRight: '1px solid #E5E7EB',
      background: '#ffffff',
      overflowY: 'auto',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ padding: '4px 8px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ELogo />
        <button
          title="Přepnout světlý/tmavý režim"
          onClick={() => window.toggleMakejTheme && window.toggleMakejTheme()}
          style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
            cursor: 'pointer',
            display: 'grid', placeItems: 'center',
            transition: 'background .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
        >
          <Icon name={window._makejIsDark ? 'sun-bold' : 'moon-stars-bold'} size={16} color="#6B7280" />
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        {sections.map((sec, i) => (
          <div key={i}>
            <div style={{
              padding: '0 12px 6px',
              fontSize: 10, color: '#9CA3AF', fontFamily: T.fontUI,
              fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
            }}>{sec.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sec.items.map(it => {
                const active = tab === it.k;
                return (
                  <button key={it.k} onClick={() => !it.disabled && onTab(it.k)} style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '9px 12px', borderRadius: 10,
                    background: active ? 'rgba(0,32,246,0.08)' : 'transparent',
                    border: 'none',
                    color: active ? '#0020F6' : it.disabled ? '#D1D5DB' : '#374151',
                    cursor: it.disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
                    fontFamily: T.fontUI, fontWeight: active ? 700 : 500, fontSize: 13.5,
                    transition: 'all .15s',
                    opacity: it.disabled ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!active && !it.disabled) e.currentTarget.style.background = '#F3F4F6'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                    {['dash', 'analytics', 'jobs', 'candidates', 'chat', 'calendar', 'reviews', 'settings'].includes(it.k)
                      ? (() => { const iconMap = { dash: 'dashboard-icon.png', analytics: 'analytics-icon.png', jobs: 'jobs-icon.png', candidates: 'candidates-icon.png', chat: 'messages-icon.png', calendar: 'calendar-icon.png', reviews: 'reviews-icon.png', settings: 'settings-icon.png' }; return <img src={iconMap[it.k]} style={{ width: 18, height: 18, flexShrink: 0, objectFit: 'contain', filter: active ? 'brightness(0) saturate(100%) invert(13%) sepia(100%) saturate(4000%) hue-rotate(228deg) brightness(103%)' : 'opacity(0.4)' }} />; })()
                      : <Icon name={active ? it.icon : it.iconLine} size={18} color={active ? '#0020F6' : it.disabled ? '#D1D5DB' : '#6B7280'} />
                    }
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.disabled && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: T.fontUI, color: '#D1D5DB', letterSpacing: 0.5, textTransform: 'uppercase' }}>Brzy</span>}
                    {it.badge != null ? (
                      typeof it.badge === 'string' ? (
                        <span style={{
                          padding: '2px 6px', borderRadius: 4,
                          background: 'rgba(251,191,36,0.2)', color: '#92400E',
                          fontSize: 9, fontWeight: 800, fontFamily: T.fontUI, letterSpacing: 0.5,
                        }}>{it.badge}</span>
                      ) : (
                        <span style={{
                          minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
                          background: '#0020F6', color: '#fff',
                          fontSize: 10, fontWeight: 800, fontFamily: T.fontUI,
                          display: 'grid', placeItems: 'center',
                        }}>{it.badge}</span>
                      )
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Plan card */}
      <div style={{
        margin: '12px 0',
        padding: 16, borderRadius: 14,
        background: 'rgba(0,32,246,0.05)',
        border: '1px solid rgba(0,32,246,0.15)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Icon name="crown-star-bold" size={16} color="#92400E" />
          <span style={{ color: '#92400E', fontSize: 10, fontWeight: 800, fontFamily: T.fontUI, letterSpacing: 1, textTransform: 'uppercase' }}>{ECOMPANY.plan || 'Starter'}</span>
        </div>
        {(() => {
          const expStr = EPROFILE.premium_until || EPROFILE.plan_expires_at || null;
          const now = new Date();
          if (!expStr) {
            return (
              <div style={{ color: '#6B7280', fontFamily: T.fontUI, fontSize: 12, marginBottom: 12 }}>
                {ECOMPANY.plan && ECOMPANY.plan.toLowerCase() !== 'starter' ? 'Aktivní předplatné' : 'Bezplatný tarif'}
              </div>
            );
          }
          const exp = new Date(expStr);
          const daysLeft = Math.ceil((exp - now) / 86400000);
          const isActive = daysLeft > 0;
          const pct = isActive ? Math.min(100, Math.round((daysLeft / 365) * 100)) : 0;
          const expLabel = exp.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
          return (
            <>
              <div style={{ color: '#111827', fontFamily: T.fontUI, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {isActive ? `Aktivní · do ${expLabel}` : `Vypršel · ${expLabel}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'rgba(0,32,246,0.12)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', borderRadius: 999, background: 'linear-gradient(90deg, #5B6BFF, #0020F6)' }} />
                </div>
                <span style={{ color: '#6B7280', fontFamily: T.fontMono, fontSize: 10, fontWeight: 600 }}>{isActive ? daysLeft + 'd' : '0d'}</span>
              </div>
            </>
          );
        })()}
        <button style={{
          width: '100%', padding: '8px 10px', borderRadius: 8,
          background: '#0020F6', border: 'none',
          color: '#fff', cursor: 'pointer',
          fontFamily: T.fontUI, fontSize: 11.5, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }} onClick={() => onTab('pricing')}>Spravovat tarif</button>
      </div>

      {/* Company footer */}
      <div style={{
        padding: '10px 8px', display: 'flex', alignItems: 'center', gap: 10,
        borderTop: '1px solid #E5E7EB', marginTop: 6,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: ECOMPANY.logoColor + '22',
          border: '1px solid ' + ECOMPANY.logoColor + '55',
          display: 'grid', placeItems: 'center',
          color: ECOMPANY.logoColor, fontFamily: T.fontHead, fontWeight: 800, fontSize: 13,
        }}>{ECOMPANY.logo}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#111827', fontFamily: T.fontUI, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ECOMPANY.name}</div>
          <div style={{ color: '#6B7280', fontSize: 10.5, fontFamily: T.fontUI }}>{ECOMPANY.city}</div>
        </div>
        <Icon name="alt-arrow-down-line-duotone" size={14} color="#9CA3AF" />
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────
function ETopbar({ title, subtitle, onNew, onSignOut, period = '30d', onPeriod }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 28px',
      borderBottom: '1px solid ' + T.border,
      background: T.navBg,
      backdropFilter: 'blur(16px)',
      boxShadow: '0 1px 0 ' + T.border,
      flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ margin: 0, fontFamily: T.fontHead, fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>{title}</h1>
          {subtitle ? <><span style={{ width: 4, height: 4, borderRadius: 999, background: T.mutedSoft }} /><span style={{ fontFamily: T.fontUI, fontSize: 13, color: T.muted, fontWeight: 500 }}>{subtitle}</span></> : null}
        </div>
      </div>

      {/* Period selector */}
      <div style={{
        display: 'flex', gap: 2, padding: 3, borderRadius: 10,
        background: 'rgba(255,255,255,0.04)', border: '1px solid ' + T.border,
      }}>
        {['7d', '30d', '90d', 'rok'].map((p) => (
          <button key={p} onClick={() => onPeriod && onPeriod(p)} style={{
            padding: '6px 12px', borderRadius: 7,
            background: p === period ? 'rgba(255,255,255,0.18)' : 'transparent',
            border: 'none',
            color: p === period ? T.text : T.muted,
            fontFamily: T.fontMono, fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
          }}>{p}</button>
        ))}
      </div>

      <button style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'rgba(255,255,255,0.04)', border: '1px solid ' + T.border,
        color: T.muted, cursor: 'pointer',
        display: 'grid', placeItems: 'center', position: 'relative',
      }}>
        <Icon name="bell-bold" size={18} color={T.light} />
        <span style={{
          position: 'absolute', top: 8, right: 8,
          width: 7, height: 7, borderRadius: 999, background: T.destructive,
          border: '2px solid #07071a',
        }} />
      </button>

      <button
        onClick={onSignOut}
        title="Odhlásit se"
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.22)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)'; }}
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
          color: '#f87171', cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          transition: 'background .15s, border-color .15s',
        }}>
        <Icon name="logout-2-bold" size={18} color="#f87171" />
      </button>

      <button onClick={onNew} style={{
        padding: '10px 16px', borderRadius: 10,
        background: 'rgba(255,255,255,0.95)',
        border: 'none', color: '#0020F6', cursor: 'pointer',
        fontFamily: T.fontUI, fontSize: 13, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', gap: 7,
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
      }}>
        <Icon name="add-circle-bold" size={16} color="#0020F6" />
        Nový inzerát
      </button>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// CHARTS — pure SVG, no deps
// ─────────────────────────────────────────────────────────────

// Sparkline — tiny line for KPI cards
function Sparkline({ data, color = T.primary, width = 100, height = 32 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${path} L${width},${height} L0,${height} Z`;
  const id = useMemoE(() => 'sg-' + Math.random().toString(36).slice(2, 8), []);
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.5" fill={color} />
    </svg>
  );
}

// Big area chart
function AreaChart({ series, width = 600, height = 220, labels = [] }) {
  const all = series.flatMap(s => s.data);
  const max = Math.max(...all) * 1.15;
  const min = 0;
  const range = max - min || 1;
  const padL = 36, padB = 24, padT = 8, padR = 8;
  const W = width - padL - padR, H = height - padT - padB;
  const stepX = W / (series[0].data.length - 1);

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => min + (range * i / ticks));

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`ac-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {/* grid */}
      {yTicks.map((v, i) => {
        const y = padT + H - ((v - min) / range) * H;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(0,32,246,0.06)" strokeWidth="1" />
            <text x={padL - 8} y={y + 3} textAnchor="end" fill="#111111" fontFamily={T.fontMono} fontSize="9.5" fontWeight="700">
              {Math.round(v).toLocaleString('cs-CZ')}
            </text>
          </g>
        );
      })}
      {/* x-axis labels */}
      {labels.map((l, i) => {
        if (i % Math.ceil(labels.length / 6) !== 0) return null;
        const x = padL + i * stepX;
        return <text key={i} x={x} y={height - 6} textAnchor="middle" fill="#111111" fontFamily={T.fontMono} fontSize="9.5" fontWeight="700">{l}</text>;
      })}
      {/* series */}
      {series.map((s, idx) => {
        const pts = s.data.map((v, i) => [padL + i * stepX, padT + H - ((v - min) / range) * H]);
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
        const area = `${path} L${padL + W},${padT + H} L${padL},${padT + H} Z`;
        return (
          <g key={idx}>
            <path d={area} fill={`url(#ac-${idx})`} />
            <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => i === pts.length - 1 ? (
              <g key={i}>
                <circle cx={p[0]} cy={p[1]} r="6" fill={s.color} opacity="0.18" />
                <circle cx={p[0]} cy={p[1]} r="3.2" fill={s.color} />
                <circle cx={p[0]} cy={p[1]} r="3.2" fill="none" stroke="#fff" strokeWidth="1.2" />
              </g>
            ) : null)}
          </g>
        );
      })}
    </svg>
  );
}

// Bars
function BarChart({ data, width = 360, height = 180, color = T.primary }) {
  const max = Math.max(...data.map(d => d.v)) * 1.1;
  const padL = 32, padB = 22, padT = 4, padR = 4;
  const W = width - padL - padR, H = height - padT - padB;
  const bw = (W / data.length) * 0.6;
  const gap = (W / data.length) * 0.4;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {[0, 0.5, 1].map((t, i) => {
        const y = padT + H - t * H;
        return <line key={i} x1={padL} y1={y} x2={width - padR} y2={y} stroke="rgba(0,32,246,0.06)" />;
      })}
      {data.map((d, i) => {
        const h = (d.v / max) * H;
        const x = padL + i * (bw + gap) + gap / 2;
        const y = padT + H - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={h} rx="3" fill={d.color || color} opacity="0.85" />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" fill="#111111" fontFamily={T.fontMono} fontSize="9.5" fontWeight="700">{d.v}</text>
            <text x={x + bw / 2} y={height - 6} textAnchor="middle" fill="#111111" fontFamily={T.fontUI} fontSize="9.5" fontWeight="600">{d.l}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Donut
function Donut({ data, size = 140, thickness = 18 }) {
  const total = data.reduce((a, b) => a + b.v, 0);
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,32,246,0.08)" strokeWidth={thickness} />
      {data.map((d, i) => {
        const dash = (d.v / total) * c;
        const off = -acc;
        acc += dash;
        return (
          <circle key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${c}`}
            strokeDashoffset={off}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// COMMON — Card + KPI + Section
// ─────────────────────────────────────────────────────────────
function ECard({ children, style, padding = 22, onClick }) {
  return (
    <div onClick={onClick} style={{
      borderRadius: 18,
      background: T.card,
      border: '1px solid ' + T.cardBorder,
      padding,
      backdropFilter: 'blur(8px)',
      color: T.cardText,
      ...style,
    }}>{children}</div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
      <div>
        <div style={{ fontFamily: T.fontHead, fontSize: 16, fontWeight: 800, color: '#111111', letterSpacing: -0.2 }}>{title}</div>
        {subtitle ? <div style={{ fontFamily: T.fontUI, fontSize: 12, color: '#555555', marginTop: 2 }}>{subtitle}</div> : null}
      </div>
      {action || null}
    </div>
  );
}

Object.assign(window, { ELogo, ESidebar, ETopbar, Sparkline, AreaChart, BarChart, Donut, ECard, SectionHeader });
