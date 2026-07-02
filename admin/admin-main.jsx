// admin-main.jsx — root komponenta admin panelu

// Demo mode — přeskočí auth gate když není vyplněný service_role klíč
if (typeof ADMIN_SERVICE_ROLE_KEY !== 'undefined' && ADMIN_SERVICE_ROLE_KEY === 'REPLACE_WITH_YOUR_SERVICE_ROLE_KEY') {
  const gate = document.getElementById('auth-gate');
  if (gate) gate.classList.add('hidden');
}

function AdminApp() {
  const [page, setPage]                   = useStateA('overview');
  const [loaded, setLoaded]               = useStateA(false);
  const [loadError, setLoadError]         = useStateA(null);
  const [tick, setTick]                   = useStateA(0);
  const [selectedCompany, setSelectedCompany] = useStateA(null);

  React.useEffect(() => {
    fetchAllData()
      .then(() => { setLoaded(true); setTick(1); })
      .catch(err => {
        console.error('[admin] fetchAllData error:', err);
        setLoadError('Chyba při načítání. Zkontroluj ADMIN_SERVICE_ROLE_KEY v admin-supabase.jsx.');
        setLoaded(true);
      });
  }, []);

  function navigate(p) {
    setPage(p);
    if (p !== 'company-detail') setSelectedCompany(null);
  }

  function handleSelectCompany(c) {
    setSelectedCompany(c);
    setPage('company-detail');
  }

  function handleRefresh() {
    fetchAllData().then(() => setTick(t => t + 1));
  }

  if (!loaded) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: AT.bg }}>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="17" stroke="rgba(255,209,102,0.15)" strokeWidth="3" fill="none" />
          <circle cx="22" cy="22" r="17" stroke={AT.amber} strokeWidth="3" fill="none"
            strokeDasharray="26 80" strokeLinecap="round"
            transform="rotate(-90 22 22)"
            style={{ animation: 'adminSpin 1s linear infinite' }} />
        </svg>
        <div style={{ color: AT.muted, fontFamily: AT.fontUI, fontSize: 13 }}>Načítání dat platformy…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, background: AT.bg, padding: 32 }}>
        <AIcon name="danger-bold" size={40} color={AT.danger} />
        <div style={{ color: '#fff', fontFamily: AT.fontUI, fontSize: 16, fontWeight: 700 }}>Chyba načítání</div>
        <div style={{ color: AT.muted, fontFamily: AT.fontUI, fontSize: 13, textAlign: 'center', maxWidth: 500 }}>{loadError}</div>
        <ABtn onClick={() => location.reload()}>Zkusit znovu</ABtn>
      </div>
    );
  }

  const stats = {
    totalCompanies: A_STATS.totalCompanies,
    totalWorkers:   A_STATS.totalWorkers,
    totalJobs:      A_STATS.totalJobs,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: AT.bg, overflow: 'hidden' }}>
      <AdminSidebar page={page} setPage={navigate} stats={stats} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {page === 'overview'       && <AOverview tick={tick} />}
        {page === 'companies'      && <ACompanies onSelect={handleSelectCompany} tick={tick} />}
        {page === 'company-detail' && <ACompanyDetail company={selectedCompany} onBack={() => navigate('companies')} onRefresh={handleRefresh} />}
        {page === 'jobs'           && <AJobs tick={tick} />}
        {page === 'workers'        && <AWorkers tick={tick} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(AdminApp));
