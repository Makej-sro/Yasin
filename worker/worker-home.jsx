// Makej Worker — Domů (rozcestník: pozdrav, odpočet do směny, dnešek)

function _wHomePad(n) { return String(n).padStart(2, '0'); }
function _wLocalISO(d) { return d.getFullYear() + '-' + _wHomePad(d.getMonth() + 1) + '-' + _wHomePad(d.getDate()); }

// eventDate ('YYYY-MM-DD') + time_start ('8:00') → Date
function _wShiftStart(eventDate, timeStart) {
  if (!eventDate) return null;
  const d = new Date(eventDate + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  if (timeStart) {
    const m = String(timeStart).match(/(\d{1,2})[:.](\d{2})/);
    if (m) d.setHours(+m[1], +m[2], 0, 0);
  }
  return d;
}

function _wUntil(ms) {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'za chvíli';
  if (mins < 60) return 'za ' + mins + ' min';
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h < 24) return 'za ' + h + ' h' + (m ? ' ' + m + ' min' : '');
  const days = Math.round(h / 24);
  return 'za ' + days + ' ' + _wPlural(days, 'den', 'dny', 'dní');
}

const W_HOME_PHASE = {
  upcoming:  { color: '#0020F6', label: 'Potvrzeno' },
  discuss:   { color: '#F5A623', label: 'Domlouváme' },
  completed: { color: '#16a34a', label: 'Hotovo' },
};

function WHome({ tick, onGoTab }) {
  const [now, setNow] = useStateW(() => Date.now());
  useEffectW(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const fullName = W_PROFILE.name || W_PROFILE.full_name || 'Brigádník';
  const firstName = fullName.split(/\s+/)[0];
  const initials = fullName.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';

  const todayISO = _wLocalISO(new Date());
  const shifts = (Array.isArray(W_HISTORY) ? W_HISTORY : [])
    .map(h => ({ h, start: _wShiftStart(h.eventDate, h.card && h.card.time_start) }))
    .filter(x => x.start);

  const todays = shifts
    .filter(x => x.h.eventDate === todayISO && x.h.phase !== 'completed')
    .sort((a, b) => a.start - b.start)
    .map(x => x.h);

  const future = shifts
    .filter(x => x.start.getTime() > now && x.h.phase !== 'completed')
    .sort((a, b) => a.start - b.start);
  const next = future[0] || null;

  const cardShadow = '0 6px 16px rgba(20,22,40,0.06)';
  const nTodays = todays.length;

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', padding: '28px 24px 40px' }}>

        {/* Pozdrav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: T.ink, fontFamily: T.fontHead, fontSize: 30, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1 }}>Ahoj, {firstName} 👋</div>
            <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 15, marginTop: 6 }}>
              {nTodays > 0 ? `Dnes máš ${nTodays} ${_wPlural(nTodays, 'brigádu', 'brigády', 'brigád')}.` : 'Dnes nemáš žádnou brigádu.'}
            </div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #0020F6, #5B6BFF)', display: 'grid', placeItems: 'center', color: '#fff', fontFamily: T.fontHead, fontWeight: 800, fontSize: 20, boxShadow: '0 10px 24px rgba(0,32,246,0.32)', flexShrink: 0 }}>{initials}</div>
        </div>

        {/* Odpočet do nejbližší směny */}
        {next ? (
          <div style={{ borderRadius: 22, padding: '22px 24px', marginBottom: 22, background: 'linear-gradient(135deg, #141414, #26264a)', color: '#fff', boxShadow: '0 16px 36px rgba(20,20,40,0.28)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', fontFamily: T.fontUI, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              <Icon name="clock-circle-bold" size={15} color="#8AB4FF" /> Nejbližší směna
            </div>
            <div style={{ fontFamily: T.fontHead, fontSize: 34, fontWeight: 800, letterSpacing: -0.8, marginTop: 10, lineHeight: 1 }}>
              {_wUntil(next.start.getTime() - now)}
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: next.color, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: T.fontHead, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{next.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.fontHead, fontSize: 15.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{next.jobTitle}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: T.fontUI, fontSize: 13, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {[next.company, next.dateText, next.timeText].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ borderRadius: 22, padding: '22px 24px', marginBottom: 22, background: '#fff', border: '1px solid ' + T.border, boxShadow: cardShadow, textAlign: 'center' }}>
            <div style={{ color: T.ink, fontFamily: T.fontHead, fontSize: 17, fontWeight: 800 }}>Žádná nadcházející směna</div>
            <div style={{ color: T.muted, fontFamily: T.fontUI, fontSize: 13.5, marginTop: 6, marginBottom: 16 }}>Najdi si další brigádu a naplň si kalendář.</div>
            <button onClick={() => onGoTab && onGoTab('swipe')} style={{ padding: '12px 22px', borderRadius: 12, background: T.primary, border: 'none', color: '#fff', fontFamily: T.fontHead, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Najít brigádu</button>
          </div>
        )}

        {/* Dnešní brigády */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ color: T.mutedSoft, fontFamily: T.fontUI, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Dnes</div>
          <button onClick={() => onGoTab && onGoTab('calendar')} style={{ background: 'none', border: 'none', color: T.primary, fontFamily: T.fontHead, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            Kalendář <Icon name="alt-arrow-right-bold" size={14} color={T.primary} />
          </button>
        </div>

        {todays.length === 0 ? (
          <div style={{ padding: '20px', borderRadius: 16, background: '#fff', border: '1px solid ' + T.border, boxShadow: cardShadow, color: T.mutedSoft, fontFamily: T.fontUI, fontSize: 13.5, textAlign: 'center' }}>
            Dnes tě žádná brigáda nečeká.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {todays.map(h => {
              const ph = W_HOME_PHASE[h.phase] || W_HOME_PHASE.upcoming;
              return (
                <div key={h.id} style={{ display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 18, background: '#fff', border: '1px solid ' + T.border, boxShadow: cardShadow, borderLeft: '4px solid ' + ph.color }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: T.ink, fontFamily: T.fontHead, fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.jobTitle}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted, fontFamily: T.fontUI, fontSize: 13.5, marginTop: 6 }}>
                      <Icon name="clock-circle-bold" size={14} color={T.mutedSoft} />{h.timeText || '—'}
                    </div>
                    {h.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.muted, fontFamily: T.fontUI, fontSize: 13.5, marginTop: 4 }}>
                        <Icon name="map-point-bold" size={14} color={T.mutedSoft} /><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.location}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ alignSelf: 'flex-start', flexShrink: 0, padding: '5px 11px', borderRadius: 999, background: ph.color + '22', color: ph.color, fontFamily: T.fontUI, fontSize: 12, fontWeight: 800 }}>{ph.label}</span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
