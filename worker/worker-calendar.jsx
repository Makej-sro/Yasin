// Makej Worker — Kalendář brigád (měsíční přehled z W_HISTORY)

function _wCalPad(n) { return String(n).padStart(2, '0'); }
function _wCalISO(y, m, d) { return y + '-' + _wCalPad(m + 1) + '-' + _wCalPad(d); }

function WCalendar({ tick }) {
  const today = new Date();
  const [ym, setYm]   = useStateW(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const [sel, setSel] = useStateW(null);   // vybraný den (null = celý měsíc)

  const PHASE = {
    upcoming:  { label: 'Potvrzeno',   color: '#0020F6', bg: 'rgba(0,32,246,0.1)' },
    discuss:   { label: 'Domlouváme',  color: '#F5A623', bg: 'rgba(245,166,35,0.16)' },
    completed: { label: 'Hotovo',      color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
  };

  // Brigády seskupené podle data
  const byDate = {};
  (Array.isArray(W_HISTORY) ? W_HISTORY : []).forEach(h => {
    if (!h.eventDate) return;
    (byDate[h.eventDate] = byDate[h.eventDate] || []).push(h);
  });

  const MONTHS = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
  const WD = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  const firstDow = (new Date(ym.y, ym.m, 1).getDay() + 6) % 7;  // Po = 0
  const daysInMonth = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayISO = _wCalISO(today.getFullYear(), today.getMonth(), today.getDate());

  function prevMonth() { setYm(s => s.m === 0 ? { y: s.y - 1, m: 11 } : { y: s.y, m: s.m - 1 }); }
  function nextMonth() { setYm(s => s.m === 11 ? { y: s.y + 1, m: 0 } : { y: s.y, m: s.m + 1 }); }

  // Seznam brigád: vybraný den, nebo celý zobrazený měsíc
  const monthEvents = (Array.isArray(W_HISTORY) ? W_HISTORY : [])
    .filter(h => {
      if (!h.eventDate) return false;
      const d = new Date(h.eventDate + 'T00:00:00');
      return d.getFullYear() === ym.y && d.getMonth() === ym.m;
    })
    .sort((a, b) => (a.eventDate < b.eventDate ? -1 : 1));
  const listEvents = sel ? (byDate[sel] || []) : monthEvents;
  const selDate = sel ? new Date(sel + 'T00:00:00') : null;
  const listLabel = selDate ? `${WD[(selDate.getDay() + 6) % 7]} ${selDate.getDate()}. ${selDate.getMonth() + 1}.` : MONTHS[ym.m];

  const cardShadow = '0 6px 16px rgba(20,22,40,0.06)';

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', padding: '28px 24px 40px' }}>

        <div style={{ color: T.ink, fontFamily: T.fontHead, fontSize: 32, fontWeight: 800, letterSpacing: -0.8, marginBottom: 20 }}>Kalendář</div>

        {/* Kalendářní karta */}
        <div style={{ background: '#fff', border: '1px solid ' + T.border, borderRadius: 22, boxShadow: cardShadow, padding: '20px 22px' }}>
          {/* Hlavička měsíce */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ color: T.ink, fontFamily: T.fontHead, fontSize: 19, fontWeight: 800 }}>{MONTHS[ym.m]} {ym.y}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={prevMonth} style={navBtnStyle}><Icon name="alt-arrow-left-bold" size={16} color={T.ink} /></button>
              <button onClick={nextMonth} style={navBtnStyle}><Icon name="alt-arrow-right-bold" size={16} color={T.ink} /></button>
            </div>
          </div>

          {/* Dny v týdnu */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {WD.map(w => (
              <div key={w} style={{ textAlign: 'center', color: T.mutedSoft, fontFamily: T.fontUI, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, padding: '4px 0' }}>{w}</div>
            ))}
          </div>

          {/* Mřížka dnů */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const iso = _wCalISO(ym.y, ym.m, d);
              const evs = byDate[iso] || [];
              const isToday = iso === todayISO;
              const isSel = iso === sel;
              return (
                <button key={i} onClick={() => setSel(iso)} style={{
                  aspectRatio: '1 / 1', border: 'none', cursor: 'pointer', borderRadius: 12,
                  background: isSel ? T.primary : (isToday ? 'rgba(0,32,246,0.08)' : 'transparent'),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  position: 'relative', transition: 'background .15s',
                }}>
                  <span style={{
                    fontFamily: T.fontHead, fontSize: 14.5, fontWeight: isToday || isSel ? 800 : 600,
                    color: isSel ? '#fff' : (isToday ? T.primary : T.ink),
                  }}>{d}</span>
                  {evs.length > 0 && (
                    <div style={{ display: 'flex', gap: 3, position: 'absolute', bottom: 7 }}>
                      {evs.slice(0, 3).map((e, k) => (
                        <span key={k} style={{ width: 5, height: 5, borderRadius: 999, background: isSel ? '#fff' : (PHASE[e.phase] || PHASE.upcoming).color }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seznam brigád (celý měsíc, nebo vybraný den) */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
            <div style={{ color: T.mutedSoft, fontFamily: T.fontUI, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              {listLabel}{listEvents.length > 0 ? ` · ${listEvents.length} ${_wPlural(listEvents.length, 'brigáda', 'brigády', 'brigád')}` : ''}
            </div>
            {sel && (
              <button onClick={() => setSel(null)} style={{ background: 'none', border: 'none', color: T.primary, fontFamily: T.fontHead, fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}>Celý měsíc</button>
            )}
          </div>

          {listEvents.length === 0 ? (
            <div style={{ padding: '20px', borderRadius: 16, background: '#fff', border: '1px solid ' + T.border, boxShadow: cardShadow, color: T.mutedSoft, fontFamily: T.fontUI, fontSize: 13.5, textAlign: 'center' }}>
              {sel ? 'V tento den nemáš žádnou brigádu.' : 'V tomto měsíci nemáš žádnou brigádu.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {listEvents.map(e => {
                const ph = PHASE[e.phase] || PHASE.upcoming;
                const d = new Date(e.eventDate + 'T00:00:00');
                return (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 18, background: '#fff', border: '1px solid ' + T.border, boxShadow: cardShadow }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: T.surfaceAlt, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center', lineHeight: 1 }}>
                        <div style={{ color: T.ink, fontFamily: T.fontHead, fontWeight: 800, fontSize: 16 }}>{d.getDate()}.</div>
                        <div style={{ color: T.mutedSoft, fontFamily: T.fontUI, fontSize: 9.5, fontWeight: 700 }}>{WD[(d.getDay() + 6) % 7]}</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: T.ink, fontFamily: T.fontHead, fontSize: 15.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.jobTitle}</div>
                      <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 13, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {[e.company, e.timeText, e.location].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <span style={{ flexShrink: 0, padding: '5px 11px', borderRadius: 999, background: ph.bg, color: ph.color, fontFamily: T.fontUI, fontSize: 12, fontWeight: 800 }}>{ph.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const navBtnStyle = {
  width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
  background: '#fff', border: '1px solid ' + T.border,
  display: 'grid', placeItems: 'center',
};
