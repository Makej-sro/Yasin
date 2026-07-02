// admin-shell.jsx — design tokens, shared UI components

const useStateA = React.useState;

const AT = {
  bg:          '#07071a',
  sidebar:     '#0a0a22',
  card:        'rgba(255,255,255,0.04)',
  cardHover:   'rgba(255,255,255,0.07)',
  border:      'rgba(208,208,255,0.10)',
  text:        '#ffffff',
  muted:       '#a0a0cc',
  soft:        '#6060aa',
  primary:     '#292978',
  amber:       '#FFD166',
  danger:      '#f43f5e',
  success:     '#5BD68A',
  blue:        '#8AB4FF',
  purple:      '#E0B0FF',
  fontHead:    '"Plus Jakarta Sans", sans-serif',
  fontUI:      '"Inter", sans-serif',
  fontMono:    '"JetBrains Mono", monospace',
};

function AIcon({ name, size = 18, color = 'currentColor', style: s = {} }) {
  return React.createElement('iconify-icon', {
    icon: 'solar:' + name,
    width: size, height: size,
    style: { color, display: 'inline-flex', flexShrink: 0, ...s },
  });
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: '2-digit' });
}

function fmtRelTime(iso) {
  if (!iso) return '—';
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60)     return 'právě teď';
  if (s < 3600)   return `před ${Math.floor(s/60)} min`;
  if (s < 86400)  return `před ${Math.floor(s/3600)} h`;
  if (s < 172800) return 'včera';
  return fmtDate(iso);
}

function ACard({ children, padding = 20, style: s = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: AT.card, borderRadius: 14,
      border: '1px solid ' + AT.border,
      padding, ...s,
      cursor: onClick ? 'pointer' : undefined,
    }}>
      {children}
    </div>
  );
}

function ABadge({ label, color = AT.amber }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px', borderRadius: 99,
      background: color + '22',
      color, fontSize: 10.5, fontWeight: 700,
      fontFamily: AT.fontUI, letterSpacing: 0.3,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

function ABtn({ children, onClick, variant = 'primary', small }) {
  const styles = {
    primary: { bg: AT.amber, color: '#1a1000', border: 'none' },
    danger:  { bg: '#f43f5e18', color: '#f43f5e', border: '1px solid #f43f5e44' },
    ghost:   { bg: 'rgba(255,255,255,0.06)', color: AT.muted, border: '1px solid ' + AT.border },
  };
  const c = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} style={{
      padding: small ? '4px 10px' : '7px 16px',
      borderRadius: 8, border: c.border,
      background: c.bg, color: c.color,
      fontFamily: AT.fontUI, fontSize: small ? 11 : 13, fontWeight: 700,
      cursor: 'pointer', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

function ANavItem({ icon, label, active, onClick, badge }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 14px', borderRadius: 10,
      background: active ? 'rgba(255,209,102,0.10)' : 'transparent',
      color: active ? AT.amber : AT.muted,
      cursor: 'pointer', marginBottom: 2,
      fontFamily: AT.fontUI, fontSize: 13.5, fontWeight: active ? 700 : 500,
    }}>
      <AIcon name={icon} size={17} color={active ? AT.amber : AT.soft} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && badge > 0 && (
        <span style={{ background: 'rgba(255,209,102,0.15)', color: AT.amber, borderRadius: 99, padding: '1px 7px', fontSize: 10.5, fontWeight: 800 }}>{badge}</span>
      )}
    </div>
  );
}

function AdminSidebar({ page, setPage, stats }) {
  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: AT.sidebar,
      borderRight: '1px solid ' + AT.border,
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px',
    }}>
      <div style={{ padding: '4px 6px 20px', borderBottom: '1px solid ' + AT.border, marginBottom: 16 }}>
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 20, fontWeight: 900, color: '#fff' }}>makej.</div>
        <div style={{ color: AT.amber, fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>Admin panel</div>
      </div>

      <ANavItem icon="home-bold"                   label="Přehled"     active={page === 'overview'}  onClick={() => setPage('overview')} />
      <ANavItem icon="buildings-bold"              label="Firmy"       active={page === 'companies' || page === 'company-detail'} onClick={() => setPage('companies')} badge={stats?.totalCompanies} />
      <ANavItem icon="document-text-bold"          label="Inzeráty"    active={page === 'jobs'}      onClick={() => setPage('jobs')}      badge={stats?.totalJobs} />
      <ANavItem icon="users-group-rounded-bold"    label="Brigádníci"  active={page === 'workers'}   onClick={() => setPage('workers')}   badge={stats?.totalWorkers} />

      <div style={{ flex: 1 }} />

      <div
        onClick={async () => { await sb.auth.signOut(); location.reload(); }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', color: AT.soft, cursor: 'pointer', fontSize: 12, fontFamily: AT.fontUI, borderRadius: 8 }}
      >
        <AIcon name="logout-3-bold" size={14} color={AT.soft} />
        Odhlásit se
      </div>
    </div>
  );
}

Object.assign(window, { useStateA, AT, AIcon, ACard, ABadge, ABtn, ANavItem, AdminSidebar, fmtDate, fmtRelTime });
