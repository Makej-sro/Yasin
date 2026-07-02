// admin-pages.jsx — všechny stránky admin panelu

// ── Přehled ──────────────────────────────────────────────────────────────────

function AOverview({ tick }) {
  const kpis = [
    { l: 'Firem',      v: A_STATS.totalCompanies, sub: `+${A_STATS.newCompaniesMonth} tento měsíc`, c: AT.amber,   icon: 'buildings-bold' },
    { l: 'Brigádníků', v: A_STATS.totalWorkers,   sub: `+${A_STATS.newWorkersMonth} tento měsíc`,  c: AT.blue,    icon: 'users-group-rounded-bold' },
    { l: 'Inzerátů',   v: A_STATS.totalJobs,      sub: 'celkem na platformě',                       c: AT.success, icon: 'document-text-bold' },
    { l: 'Matchů',     v: A_STATS.totalMatches,   sub: `${A_STATS.totalHired} najato`,              c: AT.purple,  icon: 'heart-bold' },
  ];

  const recentCompanies = A_COMPANIES.slice(0, 6);
  const recentWorkers   = A_WORKERS.slice(0, 6);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontFamily: AT.fontHead, fontSize: 22, fontWeight: 800, color: '#fff' }}>Přehled platformy</div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {kpis.map((k, i) => (
          <ACard key={i} padding={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ color: AT.muted, fontSize: 10.5, fontWeight: 700, fontFamily: AT.fontUI, letterSpacing: 0.5, textTransform: 'uppercase' }}>{k.l}</div>
              <AIcon name={k.icon} size={16} color={k.c} />
            </div>
            <div style={{ color: k.c, fontFamily: AT.fontMono, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{k.v}</div>
            <div style={{ color: AT.soft, fontSize: 11, fontFamily: AT.fontUI, marginTop: 6 }}>{k.sub}</div>
          </ACard>
        ))}
      </div>

      {/* Recent registrations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <ACard>
          <div style={{ fontFamily: AT.fontUI, fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Poslední firmy</div>
          {recentCompanies.length === 0
            ? <div style={{ color: AT.soft, fontSize: 12, fontFamily: AT.fontUI }}>Zatím žádné firmy</div>
            : recentCompanies.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < recentCompanies.length - 1 ? '1px solid ' + AT.border : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: AT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {(c.company_name || c.name || '?').slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: AT.fontUI, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.company_name || c.name || '—'}</div>
                  <div style={{ color: AT.soft, fontSize: 11, fontFamily: AT.fontUI }}>{c.email || '—'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <div style={{ color: AT.amber, fontFamily: AT.fontMono, fontSize: 11, fontWeight: 700 }}>{c._jobCount} inz.</div>
                  <div style={{ color: AT.soft, fontSize: 10.5, fontFamily: AT.fontUI }}>{fmtDate(c.created_at)}</div>
                </div>
              </div>
            ))
          }
        </ACard>

        <ACard>
          <div style={{ fontFamily: AT.fontUI, fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Poslední brigádníci</div>
          {recentWorkers.length === 0
            ? <div style={{ color: AT.soft, fontSize: 12, fontFamily: AT.fontUI }}>Zatím žádní brigádníci</div>
            : recentWorkers.map((w, i) => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < recentWorkers.length - 1 ? '1px solid ' + AT.border : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: '#5B6BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {(w.name || '?').split(' ').map(p => p[0] || '').join('').slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: AT.fontUI, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name || '—'}</div>
                  <div style={{ color: AT.soft, fontSize: 11, fontFamily: AT.fontUI }}>{w.email || '—'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <div style={{ color: AT.blue, fontFamily: AT.fontMono, fontSize: 11, fontWeight: 700 }}>{w.jobs_done || 0} brigád</div>
                  <div style={{ color: AT.soft, fontSize: 10.5, fontFamily: AT.fontUI }}>{fmtDate(w.created_at)}</div>
                </div>
              </div>
            ))
          }
        </ACard>
      </div>
    </div>
  );
}

// ── Firmy ─────────────────────────────────────────────────────────────────────

function ACompanies({ onSelect, tick }) {
  const [search, setSearch] = useStateA('');

  const filtered = A_COMPANIES.filter(c =>
    (c.company_name || c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontFamily: AT.fontHead, fontSize: 22, fontWeight: 800, color: '#fff', flex: 1 }}>Firmy <span style={{ color: AT.soft, fontWeight: 500, fontSize: 16 }}>({filtered.length})</span></div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Hledat název nebo email…"
          style={{ background: AT.card, border: '1px solid ' + AT.border, borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 13, fontFamily: AT.fontUI, width: 280, outline: 'none' }}
        />
      </div>

      <ACard padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 70px 70px 70px 110px', padding: '10px 18px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid ' + AT.border }}>
          {['Firma', 'Email', 'Inzeráty', 'Matche', 'Najato', 'Registrace'].map(h => (
            <div key={h} style={{ color: AT.soft, fontSize: 10, fontWeight: 700, fontFamily: AT.fontUI, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: AT.soft, fontFamily: AT.fontUI, fontSize: 13 }}>Žádné firmy nenalezeny</div>
        )}

        {filtered.map((c, i) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            style={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 70px 70px 70px 110px', padding: '12px 18px', borderBottom: i < filtered.length - 1 ? '1px solid ' + AT.border : 'none', cursor: 'pointer', alignItems: 'center', transition: 'background 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = AT.cardHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: AT.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {(c.company_name || c.name || '?').slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: AT.fontUI }}>{c.company_name || c.name || '—'}</div>
                <div style={{ color: AT.soft, fontSize: 10.5, fontFamily: AT.fontUI }}>{fmtRelTime(c._lastActivity)}</div>
              </div>
            </div>
            <div style={{ color: AT.muted, fontSize: 12, fontFamily: AT.fontUI, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email || '—'}</div>
            <div style={{ color: AT.amber,   fontFamily: AT.fontMono, fontSize: 14, fontWeight: 700 }}>{c._jobCount}</div>
            <div style={{ color: AT.blue,    fontFamily: AT.fontMono, fontSize: 14, fontWeight: 700 }}>{c._matchCount}</div>
            <div style={{ color: AT.success, fontFamily: AT.fontMono, fontSize: 14, fontWeight: 700 }}>{c._hiredCount}</div>
            <div style={{ color: AT.soft, fontSize: 11.5, fontFamily: AT.fontUI }}>{fmtDate(c.created_at)}</div>
          </div>
        ))}
      </ACard>
    </div>
  );
}

// ── Detail firmy ──────────────────────────────────────────────────────────────

function ACompanyDetail({ company: c, onBack, onRefresh }) {
  if (!c) return null;
  const jobs = c._jobs || [];

  const statusColor = s => s === 'active' ? AT.success : s === 'urgent' ? AT.danger : s === 'filled' ? AT.blue : AT.muted;

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ABtn variant="ghost" onClick={onBack} small>← Zpět na firmy</ABtn>
        <div style={{ fontFamily: AT.fontHead, fontSize: 20, fontWeight: 800, color: '#fff', flex: 1 }}>{c.company_name || c.name}</div>
        <ABadge label="employer" color={AT.blue} />
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { l: 'Inzeráty',    v: c._jobCount,   c: AT.amber },
          { l: 'Matche',      v: c._matchCount, c: AT.blue },
          { l: 'Najato',      v: c._hiredCount, c: AT.success },
          { l: 'Poslední aktivita', v: fmtRelTime(c._lastActivity), c: AT.muted },
        ].map((x, i) => (
          <ACard key={i} padding={14}>
            <div style={{ color: AT.soft, fontSize: 10, fontWeight: 700, fontFamily: AT.fontUI, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{x.l}</div>
            <div style={{ color: x.c, fontFamily: AT.fontMono, fontSize: 20, fontWeight: 700 }}>{x.v}</div>
          </ACard>
        ))}
      </div>

      {/* Profil firmy */}
      <ACard>
        <div style={{ fontFamily: AT.fontUI, fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Údaje účtu</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
          {[
            ['ID',            c.id],
            ['Email',         c.email],
            ['Název firmy',   c.company_name],
            ['Kontakt',       c.name],
            ['Lokalita',      c.location],
            ['Telefon',       c.phone],
            ['Web',           c.website],
            ['Registrace',    fmtDate(c.created_at)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: AT.soft, fontSize: 11.5, fontFamily: AT.fontUI, minWidth: 110, flexShrink: 0 }}>{k}</span>
              <span style={{ color: AT.muted, fontSize: 11.5, fontFamily: AT.fontUI, wordBreak: 'break-all' }}>{v || '—'}</span>
            </div>
          ))}
        </div>
      </ACard>

      {/* Inzeráty firmy */}
      <ACard padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid ' + AT.border, fontFamily: AT.fontUI, fontSize: 13, fontWeight: 700, color: '#fff' }}>
          Inzeráty ({jobs.length})
        </div>
        {jobs.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: AT.soft, fontFamily: AT.fontUI, fontSize: 13 }}>Žádné inzeráty</div>
        )}
        {jobs.map((j, i) => (
          <div key={j.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 18px', borderBottom: i < jobs.length - 1 ? '1px solid ' + AT.border : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: AT.fontUI }}>{j.title}</div>
              <div style={{ color: AT.soft, fontSize: 11, fontFamily: AT.fontUI, marginTop: 3 }}>
                {[j.location, j.date, j.pay ? j.pay + ' ' + (j.pay_unit || 'Kč/h') : null].filter(Boolean).join(' · ')}
              </div>
              {j.description && (
                <div style={{ color: AT.muted, fontSize: 11.5, fontFamily: AT.fontUI, marginTop: 5, lineHeight: 1.5 }}>{j.description}</div>
              )}
              {Array.isArray(j.tags) && j.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                  {j.tags.map(t => <ABadge key={t} label={t} color={AT.blue} />)}
                </div>
              )}
              <div style={{ color: AT.soft, fontSize: 10.5, fontFamily: AT.fontUI, marginTop: 4 }}>ID: {j.id}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <ABadge label={j.status || '?'} color={statusColor(j.status)} />
              <ABtn variant="danger" small onClick={async () => {
                if (confirm(`Pausnout "${j.title}"?`)) {
                  await adminPauseJob(j.id);
                  await fetchAllData();
                  if (onRefresh) onRefresh();
                }
              }}>Pausnout</ABtn>
              <ABtn variant="ghost" small onClick={async () => {
                if (confirm(`Smazat "${j.title}"? Tato akce je nevratná.`)) {
                  await adminDeleteJob(j.id);
                  await fetchAllData();
                  if (onRefresh) onRefresh();
                }
              }}>Smazat</ABtn>
            </div>
          </div>
        ))}
      </ACard>
    </div>
  );
}

// ── Inzeráty ──────────────────────────────────────────────────────────────────

function AJobs({ tick }) {
  const [search, setSearch] = useStateA('');
  const [filter, setFilter] = useStateA('all');
  const [localTick, setLocalTick] = useStateA(0);

  const statusColor = s => s === 'active' ? AT.success : s === 'urgent' ? AT.danger : s === 'filled' ? AT.blue : AT.muted;

  const filtered = A_JOBS.filter(j => {
    const q  = search.toLowerCase();
    const ok = (j.title || '').toLowerCase().includes(q) ||
               (j._companyName || '').toLowerCase().includes(q) ||
               (j.location || '').toLowerCase().includes(q) ||
               (j.description || '').toLowerCase().includes(q);
    return ok && (filter === 'all' || j.status === filter);
  });

  const filters = ['all','active','urgent','filled','paused'];

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: AT.fontHead, fontSize: 22, fontWeight: 800, color: '#fff', flex: 1 }}>
          Inzeráty <span style={{ color: AT.soft, fontWeight: 500, fontSize: 16 }}>({filtered.length})</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: 8,
              border: '1px solid ' + (filter === f ? AT.amber : AT.border),
              background: filter === f ? AT.amber + '1a' : 'transparent',
              color: filter === f ? AT.amber : AT.soft,
              fontFamily: AT.fontUI, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
            }}>
              {f === 'all' ? 'Vše' : f}
            </button>
          ))}
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Hledat…"
          style={{ background: AT.card, border: '1px solid ' + AT.border, borderRadius: 10, padding: '7px 12px', color: '#fff', fontSize: 12.5, fontFamily: AT.fontUI, width: 220, outline: 'none' }}
        />
      </div>

      <ACard padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1.2fr 100px 80px 130px', padding: '10px 18px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid ' + AT.border }}>
          {['Název inzerátu', 'Firma', 'Lokalita / Datum', 'Mzda', 'Status', 'Akce'].map(h => (
            <div key={h} style={{ color: AT.soft, fontSize: 10, fontWeight: 700, fontFamily: AT.fontUI, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: AT.soft, fontFamily: AT.fontUI, fontSize: 13 }}>Žádné inzeráty</div>
        )}

        {filtered.slice(0, 150).map((j, i) => (
          <div key={j.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1.2fr 100px 80px 130px', padding: '11px 18px', borderBottom: i < Math.min(filtered.length, 150) - 1 ? '1px solid ' + AT.border : 'none', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, fontFamily: AT.fontUI }}>{j.title}</div>
              {j.description && (
                <div style={{ color: AT.soft, fontSize: 11, fontFamily: AT.fontUI, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{j.description}</div>
              )}
              {Array.isArray(j.tags) && j.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                  {j.tags.slice(0,4).map(t => <ABadge key={t} label={t} color={AT.blue} />)}
                </div>
              )}
            </div>
            <div style={{ color: AT.muted, fontSize: 12, fontFamily: AT.fontUI, paddingTop: 2 }}>{j._companyName}</div>
            <div style={{ color: AT.soft, fontSize: 11.5, fontFamily: AT.fontUI, paddingTop: 2 }}>
              {j.location && <div>{j.location}</div>}
              {j.date     && <div>{j.date}</div>}
            </div>
            <div style={{ color: AT.amber, fontFamily: AT.fontMono, fontSize: 13, fontWeight: 700, paddingTop: 2 }}>
              {j.pay ? j.pay + ' ' + (j.pay_unit || 'Kč/h') : '—'}
            </div>
            <div style={{ paddingTop: 2 }}><ABadge label={j.status || '?'} color={statusColor(j.status)} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {j.status !== 'paused' && (
                <ABtn variant="danger" small onClick={async () => {
                  if (confirm(`Pausnout "${j.title}"?`)) {
                    await adminPauseJob(j.id);
                    await fetchAllData();
                    setLocalTick(t => t + 1);
                  }
                }}>Pausnout</ABtn>
              )}
              <ABtn variant="ghost" small onClick={async () => {
                if (confirm(`Smazat "${j.title}"? Nevratná akce.`)) {
                  await adminDeleteJob(j.id);
                  await fetchAllData();
                  setLocalTick(t => t + 1);
                }
              }}>Smazat</ABtn>
            </div>
          </div>
        ))}
      </ACard>
      {filtered.length > 150 && (
        <div style={{ color: AT.soft, fontSize: 12, textAlign: 'center', fontFamily: AT.fontUI }}>Zobrazeno 150 z {filtered.length} — upřesni hledání</div>
      )}
    </div>
  );
}

// ── Brigádníci ────────────────────────────────────────────────────────────────

function AWorkers({ tick }) {
  const [search, setSearch] = useStateA('');
  const [sort, setSort]     = useStateA('new');

  let filtered = A_WORKERS.filter(w =>
    (w.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (w.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (sort === 'new')      filtered = [...filtered].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  if (sort === 'active')   filtered = [...filtered].sort((a,b) => (b.jobs_done||0) - (a.jobs_done||0));
  if (sort === 'rating')   filtered = [...filtered].sort((a,b) => (b.rating||0) - (a.rating||0));

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontFamily: AT.fontHead, fontSize: 22, fontWeight: 800, color: '#fff', flex: 1 }}>
          Brigádníci <span style={{ color: AT.soft, fontWeight: 500, fontSize: 16 }}>({filtered.length})</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['new','Nejnovější'],['active','Nejaktivnější'],['rating','Hodnocení']].map(([k,l]) => (
            <button key={k} onClick={() => setSort(k)} style={{
              padding: '5px 12px', borderRadius: 8,
              border: '1px solid ' + (sort === k ? AT.amber : AT.border),
              background: sort === k ? AT.amber + '1a' : 'transparent',
              color: sort === k ? AT.amber : AT.soft,
              fontFamily: AT.fontUI, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
            }}>{l}</button>
          ))}
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Hledat jméno nebo email…"
          style={{ background: AT.card, border: '1px solid ' + AT.border, borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 13, fontFamily: AT.fontUI, width: 260, outline: 'none' }}
        />
      </div>

      <ACard padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 80px 60px 110px', padding: '10px 18px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid ' + AT.border }}>
          {['Jméno', 'Email', 'Brigád', 'Hodnocení', 'Level', 'Registrace'].map(h => (
            <div key={h} style={{ color: AT.soft, fontSize: 10, fontWeight: 700, fontFamily: AT.fontUI, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: AT.soft, fontFamily: AT.fontUI, fontSize: 13 }}>Žádní brigádníci</div>
        )}

        {filtered.slice(0, 150).map((w, i) => (
          <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 80px 80px 60px 110px', padding: '10px 18px', borderBottom: i < Math.min(filtered.length, 150) - 1 ? '1px solid ' + AT.border : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: '#5B6BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {(w.name || '?').split(' ').map(p => p[0] || '').join('').slice(0,2).toUpperCase()}
              </div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: AT.fontUI }}>{w.name || '—'}</div>
            </div>
            <div style={{ color: AT.muted, fontSize: 12, fontFamily: AT.fontUI, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.email || '—'}</div>
            <div style={{ color: AT.amber,   fontFamily: AT.fontMono, fontSize: 13, fontWeight: 700 }}>{w.jobs_done || 0}</div>
            <div style={{ color: AT.success, fontFamily: AT.fontMono, fontSize: 13, fontWeight: 700 }}>{w.rating ? Number(w.rating).toFixed(1) + '★' : '—'}</div>
            <div style={{ color: AT.blue,    fontFamily: AT.fontMono, fontSize: 13, fontWeight: 700 }}>{w.level || 1}</div>
            <div style={{ color: AT.soft,    fontSize: 11.5, fontFamily: AT.fontUI }}>{fmtDate(w.created_at)}</div>
          </div>
        ))}
      </ACard>
      {filtered.length > 150 && (
        <div style={{ color: AT.soft, fontSize: 12, textAlign: 'center', fontFamily: AT.fontUI }}>Zobrazeno 150 z {filtered.length} — upřesni hledání</div>
      )}
    </div>
  );
}

Object.assign(window, { AOverview, ACompanies, ACompanyDetail, AJobs, AWorkers });
