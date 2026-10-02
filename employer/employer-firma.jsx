// ═══════════ PROFIL FIRMY — samostatná záložka (26. 9., Yasin + Claude) ═══════════
// Dřív byl profil firmy schovaný v Nastavení mezi notifikacemi a GDPR. Teď vlastní
// záložka (otevírá se z karty firmy dole v levém menu → „Profil firmy").
// Od 2. 10. podle návrhu z Claude Design (viz ECompanyProfile níž): hlavička se
// záložkami, karty s „Upravit" a ukládáním po částech, vpravo Dokončení profilu.
// Údaje jsou sloupce `profiles` (včetně těch z supabase/migration_profil_firmy.sql,
// spuštěno 2. 10.); každá upravovaná část se ukládá jedním zápisem.

const _PF_DNY = [['po', 'Pondělí'], ['ut', 'Úterý'], ['st', 'Středa'], ['ct', 'Čtvrtek'], ['pa', 'Pátek'], ['so', 'Sobota'], ['ne', 'Neděle']];
const _PF_OBORY = ['Gastro', 'Kavárna', 'Maloobchod', 'Sklad / logistika', 'Eventy / catering', 'Hotelnictví', 'Výroba', 'Úklid', 'Stavebnictví', 'Doprava', 'Administrativa', 'Jiné'];
const _PF_KRAJE = [
  ['praha', 'Praha'], ['stredocesky', 'Středočeský'], ['jihocesky', 'Jihočeský'], ['plzensky', 'Plzeňský'],
  ['karlovarsky', 'Karlovarský'], ['ustecky', 'Ústecký'], ['liberecky', 'Liberecký'], ['kralovehradecky', 'Královéhradecký'],
  ['pardubicky', 'Pardubický'], ['vysocina', 'Vysočina'], ['jihomoravsky', 'Jihomoravský'], ['olomoucky', 'Olomoucký'],
  ['zlinsky', 'Zlínský'], ['moravskoslezsky', 'Moravskoslezský'],
];
const _PF_SITE = [
  ['facebook', 'Facebook', 'facebook.com/firma', '#1877F2'],
  ['instagram', 'Instagram', 'instagram.com/firma', '#D62976'],
  ['linkedin', 'LinkedIn', 'linkedin.com/company/firma', '#0A66C2'],
  ['tiktok', 'TikTok', 'tiktok.com/@firma', '#0B1220'],
  ['youtube', 'YouTube', 'youtube.com/@firma', '#E62117'],
];

function _pfZProfilu(P, C) {
  const s = (P.socials && typeof P.socials === 'object') ? P.socials : {};
  const h = (P.opening_hours && typeof P.opening_hours === 'object') ? P.opening_hours : {};
  return {
    name: P.company_name || '',
    industry: P.industry || '',
    bio: P.bio || '',
    rules: P.chat_rules || '',
    ico: P.ic || '',
    founded: P.founded ? String(P.founded) : '',
    kraj: P.kraj || '',
    address: P.address || '',
    web: P.website || '',
    career: P.career_url || '',
    phone: P.phone || '',
    email: P.contact_email || '',
    logo_url: P.logo_url || '',
    cover_url: P.cover_url || '',
    photos: Array.isArray(P.photos) ? P.photos.filter(Boolean) : [],
    brand: (P.branding && P.branding.color) || C.logoColor || '#1B34F0',
    socials: { facebook: s.facebook || '', instagram: s.instagram || '', linkedin: s.linkedin || '', tiktok: s.tiktok || '', youtube: s.youtube || '' },
    hours: Object.fromEntries(_PF_DNY.map(([k]) => [k, h[k] || ''])),
  };
}

// ── Profil firmy podle návrhu z Claude Design (Yasin 2. 10., „Profil firmy.dc.html") ──
// Hlavička (úvodní fotka, logo, název, štítek ověření, obor a místo, hodnocení, Upravit
// hlavičku) se záložkami Přehled / Fotky / Brigády / Hodnocení / Pro nové brigádníky
// (soukromá, brigádník ji nevidí). V Přehledu karty O firmě, Kontakt a údaje, Otevírací
// doba, Sociální sítě (stejné pořadí jako veřejný profil) a vpravo Dokončení profilu. Každá
// karta má „Upravit" → úprava přímo v kartě se Zrušit / Uložit; stav ukládání je vpravo
// nahoře. Tlačítko „Zobrazit jako brigádník" z návrhu záměrně není (Yasin: náhled v mobilu
// firmám dávat nebudeme).
const _PF_MODRA = '#1A3CFF';
// Úvodní fotka: ukládá se ve facebookovém formátu 1640 × 624 — firmy mají banner z Facebooku
// a v 4 : 1 jim z něj chyběl kus (Yasin 2. 10.: QR kód v banneru useknutý, „nedá se to udělat
// na full?"). Appka (WEmployerModal) ho ukazuje celý přes šířku telefonu. V dashboardu by byl
// přes celou šířku obrovský (~490 px), proto má rám strop _PF_COVER_MAX_H a fotka se v něm
// jen ořízne pro náhled; při úpravě pozice strop není, aby firma viděla přesně uložený výřez.
const _PF_COVER_W = 1640, _PF_COVER_H = 624, _PF_COVER_MAX_H = 320;
// Fotky firmy: bez počítadla, jen pojistka 50 kusů (Yasin 2. 10.: „8 je blbost"). Jeden soubor
// nejvýš 15 MB — větší by prohlížeč při zmenšování zbytečně zatížil. Každá fotka se v prohlížeči
// přepíše do JPEG (max 1400 px), takže do úložiště nikdy nejde původní soubor; bucket `uploads`
// navíc sám pustí jen obrázky do 5 MB (supabase/migration_storage_uploads.sql).
const _PF_FOTEK_MAX = 50, _PF_SOUBOR_MAX_MB = 15;
// Které údaje formuláře patří ke které upravované části (zbytek se při uložení nemění)
const _PF_SEKCE = {
  hlavicka: ['name', 'industry'], popis: ['bio'], doba: ['hours'], site: ['socials'], pravidla: ['rules'],
  kontakt: ['address', 'kraj', 'phone', 'email', 'web', 'career', 'ico', 'founded'],
};
// Otevírací doba se ukládá jako text dne („7:30 – 18:00", prázdné = zavřeno), appka ho ukazuje tak, jak je
function _pfRozsah(txt) {
  const m = /(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/.exec(txt || '');
  return m ? { od: m[1].padStart(2, '0') + ':' + m[2], do: m[3].padStart(2, '0') + ':' + m[4] } : null;
}
const _pfCas = hhmm => { const m = /^(\d{1,2}):(\d{2})/.exec(hhmm || ''); return m ? (+m[1]) + ':' + m[2] : ''; };
const _pfMinuty = hhmm => { const [h, m] = hhmm.split(':'); return +h * 60 + +m; };
const _pfDnyZ = hours => Object.fromEntries(_PF_DNY.map(([k]) => {
  const t = String(hours[k] || '').trim(), r = _pfRozsah(t);
  return [k, { otevreno: !!t, od: r ? r.od : (t ? '' : '08:00'), do: r ? r.do : (t ? '' : '16:00'), text: r ? '' : t }];
}));
const _pfDnyNa = dny => Object.fromEntries(_PF_DNY.map(([k]) => {
  const d = dny[k];
  return [k, !d.otevreno ? '' : (d.od && d.do ? _pfCas(d.od) + ' – ' + _pfCas(d.do) : d.text)];
}));
// Den a čas v Praze (firma i brigádníci jsou v Česku, ať je prohlížeč kdekoli)
function _pfTed() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
  return { den: ['ne', 'po', 'ut', 'st', 'ct', 'pa', 'so'][d.getDay()], min: d.getHours() * 60 + d.getMinutes() };
}
// 'otevreno' | 'zavreno' | null (doba nevyplněná nebo dnešek nejde přečíst)
function _pfOtevreno(hours) {
  if (!_PF_DNY.some(([k]) => String(hours[k] || '').trim())) return null;
  const { den, min } = _pfTed();
  const t = String(hours[den] || '').trim();
  if (!t) return 'zavreno';
  const r = _pfRozsah(t); if (!r) return null;
  const od = _pfMinuty(r.od), doo = _pfMinuty(r.do);
  const ano = doo > od ? (min >= od && min < doo) : (min >= od || min < doo);   // i přes půlnoc
  return ano ? 'otevreno' : 'zavreno';
}
// Z odkazu na síť jen jméno účtu („instagram.com/makejsnama" → „@makejsnama")
function _pfUcet(k, v) {
  let s = String(v || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');
  s = s.replace(/^(facebook\.com|fb\.com|instagram\.com|linkedin\.com\/(company|in)|tiktok\.com|youtube\.com)\//i, '');
  if (k === 'instagram' && s && !s.startsWith('@') && !s.includes('/')) s = '@' + s;
  return s;
}
const _pfVeci = n => n === 1 ? 'věc' : (n >= 2 && n <= 4 ? 'věci' : 'věcí');
function _pfDatum(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  return m ? (+m[3]) + '. ' + (+m[2]) + '.' : (iso || '');
}

// Hvězda hodnocení 1:1 jako u recenzí v appce (WStar, zlatá T.super) — ne zelená z návrhu (Yasin 2. 10.)
const _PF_HVEZDA = 'M6.94691609,21.5 C6.53391609,21.5 6.12391609,21.37 5.77291609,21.114 C5.16691609,20.67 4.86991609,19.937 4.99891609,19.199 L5.69491609,15.189 C5.72091609,15.04 5.66991609,14.889 5.55991609,14.783 L2.60391609,11.943 C2.05991609,11.422 1.86491609,10.652 2.09491609,9.937 C2.32691609,9.214 2.94091609,8.697 3.69791609,8.589 L7.78591609,8 C7.94391609,7.978 8.07991609,7.881 8.14791609,7.743 L9.97491609,4.091 C10.3119161,3.418 10.9919161,3 11.7499161,3 L11.7499161,3 C12.5079161,3 13.1879161,3.418 13.5249161,4.091 L15.3529161,7.742 C15.4219161,7.881 15.5569161,7.978 15.7139161,8 L19.8019161,8.589 C20.5589161,8.697 21.1729161,9.214 21.4049161,9.937 C21.6349161,10.652 21.4389161,11.422 20.8949161,11.943 L17.9389161,14.783 C17.8289161,14.889 17.7789161,15.04 17.8049161,15.188 L18.5019161,19.199 C18.6299161,19.938 18.3329161,20.671 17.7259161,21.114 C17.1109161,21.565 16.3099161,21.626 15.6309161,21.272 L11.9779161,19.379 C11.8349161,19.305 11.6639161,19.305 11.5209161,19.379 L7.86791609,21.273 C7.57591609,21.425 7.26091609,21.5 6.94691609,21.5 Z';
function PFHvezda({ size = 16, color = '#F5B301' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', flex: 'none' }}>
      <path d={_PF_HVEZDA} fill={color} />
    </svg>
  );
}
// Zápis jedné upravované části do profiles (jen její sloupce)
function _pfPatch(sekce, f) {
  return {
    hlavicka: { company_name: f.name.trim(), industry: f.industry },
    popis: { bio: f.bio },
    kontakt: { address: f.address.trim(), kraj: f.kraj || null, phone: f.phone.trim(), contact_email: f.email.trim(),
      website: f.web.trim(), career_url: f.career.trim(), ic: f.ico.trim(), founded: f.founded.trim() || null },
    doba: { opening_hours: f.hours },
    site: { socials: f.socials },
    pravidla: { chat_rules: f.rules },
  }[sekce];
}
// Rozepsaná část (otevírací doba převedená na text dnů) a jestli se liší od uloženého
const _pfHotovyKoncept = (sekce, kc) => sekce === 'doba' ? { ...kc, hours: _pfDnyNa(kc.dny) } : kc;
const _pfZmeneno = (sekce, kc, form) => !!(sekce && kc) &&
  _PF_SEKCE[sekce].some(x => JSON.stringify(_pfHotovyKoncept(sekce, kc)[x] ?? '') !== JSON.stringify(form[x] ?? ''));

// Ikonky na dvou tlačítkách hlavičky přímo v kódu (Solar camera-linear, pen-2-linear, 1:1 jako
// přes iconify). Yasinovi přes iconify-icon mizely, když z tlačítka odjel myší (2. 10.).
const _PF_IKONY = {
  fotak: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><circle cx="12" cy="13" r="3"/><path d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z"/><path d="M19 10H18"/></g>',
  tuzka: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M4 22H20"/><path d="M13.8881 3.66293L14.6296 2.92142C15.8581 1.69286 17.85 1.69286 19.0786 2.92142C20.3071 4.14999 20.3071 6.14188 19.0786 7.37044L18.3371 8.11195M13.8881 3.66293C13.8881 3.66293 13.9807 5.23862 15.3711 6.62894C16.7614 8.01926 18.3371 8.11195 18.3371 8.11195M13.8881 3.66293L7.07106 10.4799C6.60933 10.9416 6.37846 11.1725 6.17992 11.4271C5.94571 11.7273 5.74491 12.0522 5.58107 12.396C5.44219 12.6874 5.33894 12.9972 5.13245 13.6167L4.25745 16.2417M4.25745 16.2417L4.04356 16.8833C3.94194 17.1882 4.02128 17.5243 4.2485 17.7515C4.47573 17.9787 4.81182 18.0581 5.11667 17.9564L5.75834 17.7426L8.38334 16.8675C9.00282 16.6611 9.31256 16.5578 9.60398 16.4189C9.94775 16.2551 10.2727 16.0543 10.5729 15.8201C10.8275 15.6215 11.0584 15.3907 11.5201 14.9289L18.3371 8.11195M5.75834 17.7426L4.25745 16.2417"/></g>',
};
// Ikonky sociálních sítí — barevná loga od Yasina (2. 10.), employer/site/<síť>.png (96 px).
// Nevyplněná síť má logo šedé (.e-pf-sit-prazdna img). Stejná loga má appka (www/site/).
function PFSitIkona({ sit, size = 16 }) {
  return <img src={'site/' + sit + '.png'} alt="" width={size} height={size} style={{ display: 'block', flex: 'none', width: size, height: size, objectFit: 'contain' }} />;
}
function PFIkona({ nazev, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block', flex: 'none' }} dangerouslySetInnerHTML={{ __html: _PF_IKONY[nazev] }} />;
}
function PFKarta({ nadpis, vedle, vpravo, onUpravit, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: 18, padding: '22px 26px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#0B1220' }}>{nadpis}</span>{vedle}
        </span>
        {vpravo}
        {onUpravit && <button className="e-pf-odkaz" onClick={onUpravit}>Upravit</button>}
      </div>
      {children}
    </div>
  );
}
function PFTlacitka({ onZrus, onUloz, ukladam }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
      <button className="e-pf-btn2" onClick={onZrus} disabled={ukladam}>Zrušit</button>
      <button className="e-pf-btn" onClick={onUloz} disabled={ukladam}>{ukladam ? 'Ukládám…' : 'Uložit'}</button>
    </div>
  );
}
// Víceřádkové políčko, které roste s textem
function PFText({ value, onChange, placeholder, max, autoFocus }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.height = 'auto'; el.style.height = (el.scrollHeight + 2) + 'px';
  }, [value]);
  return <textarea ref={ref} className="e-pf-pole" rows={3} value={value} placeholder={placeholder} autoFocus={autoFocus}
    onChange={e => onChange(max ? e.target.value.slice(0, max) : e.target.value)} style={{ resize: 'none', overflow: 'hidden', lineHeight: 1.6 }} />;
}

// ── Posun a přiblížení fotky v rámu (30. 9.) ──
// Společné pro logo (okno PFOrez) i úvodní fotku (upravuje se přímo na profilu,
// jako na Facebooku). Fotka se posouvá tažením (myš i prst), přibližuje kolečkem
// k místu pod myší nebo posuvníkem (1–4×) a vždy vyplní celý rám — prázdný okraj
// nevznikne. vyrez() vykreslí to, co je v rámu vidět, do JPEG.
const _PF_ZOOM_MAX = 4;
function _usePfPozice(img, ramRef) {
  const [ram, setRam] = React.useState({ w: 0, h: 0 });
  const [st, setSt] = React.useState(null);            // { z, u, v } — přiblížení a bod fotky uprostřed rámu
  const [tahne, setTahne] = React.useState(false);
  const tah = React.useRef(null);
  React.useEffect(() => { setSt(img ? { z: 1, u: img.naturalWidth / 2, v: img.naturalHeight / 2 } : null); }, [img]);
  React.useLayoutEffect(() => {
    const el = ramRef.current; if (!el) return;
    const zmer = () => setRam({ w: el.clientWidth, h: el.clientHeight });
    zmer();
    if (!window.ResizeObserver) return;
    const ro = new ResizeObserver(zmer); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const iw = img ? img.naturalWidth : 1, ih = img ? img.naturalHeight : 1;
  const s0 = ram.w && ram.h ? Math.max(ram.w / iw, ram.h / ih) : 1;   // při z = 1 fotka přesně vyplní rám
  const omez = (z, u, v) => {
    const s = s0 * z, pw = ram.w / (2 * s), ph = ram.h / (2 * s);
    return { z, u: Math.min(Math.max(u, pw), iw - pw), v: Math.min(Math.max(v, ph), ih - ph) };
  };
  const cur = img && st && ram.w ? omez(st.z, st.u, st.v) : null;
  const s = cur ? s0 * cur.z : 1;
  // Přiblížit tak, aby bod pod myší (px, py v rámu) zůstal na místě; bez myši střed
  const zoomNa = (z2, px, py) => setSt(p => {
    if (!p) return p;
    const c = omez(p.z, p.u, p.v);
    const z = Math.min(Math.max(z2, 1), _PF_ZOOM_MAX);
    const ox = (px == null ? ram.w / 2 : px) - ram.w / 2, oy = (py == null ? ram.h / 2 : py) - ram.h / 2;
    return omez(z, c.u + ox / (s0 * c.z) - ox / (s0 * z), c.v + oy / (s0 * c.z) - oy / (s0 * z));
  });
  // Kolečko: nativní posluchač (React ho má pasivní) — stránka se přitom nesmí posouvat
  const kolecko = React.useRef(null);
  kolecko.current = e => {
    if (!cur) return;
    e.preventDefault();
    const r = ramRef.current.getBoundingClientRect();
    zoomNa(cur.z * Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
  };
  React.useEffect(() => {
    const el = ramRef.current; if (!el) return;
    const h = e => kolecko.current(e);
    el.addEventListener('wheel', h, { passive: false });
    return () => el.removeEventListener('wheel', h);
  }, []);
  const ovladani = {
    onPointerDown: e => { if (!cur) return; e.currentTarget.setPointerCapture(e.pointerId); tah.current = { x: e.clientX, y: e.clientY }; setTahne(true); },
    onPointerMove: e => {
      const t = tah.current; if (!t) return;
      const dx = e.clientX - t.x, dy = e.clientY - t.y;
      tah.current = { x: e.clientX, y: e.clientY };
      setSt(p => { const c = omez(p.z, p.u, p.v); return omez(c.z, c.u - dx / (s0 * c.z), c.v - dy / (s0 * c.z)); });
    },
    onPointerUp: () => { tah.current = null; setTahne(false); },
    onPointerCancel: () => { tah.current = null; setTahne(false); },
  };
  const obrazekStyl = cur ? { position: 'absolute', left: ram.w / 2 - cur.u * s, top: ram.h / 2 - cur.v * s, width: iw * s, height: ih * s, maxWidth: 'none', pointerEvents: 'none', display: 'block' } : null;
  // Výřez → JPEG. Malou fotku nezvětšuje (výstup nejvýš tak velký jako výřez);
  // průhlednost (logo) dostane bílý podklad — JPEG ji neumí.
  // pomer (šířka / výška) = přesný tvar výstupu; bez něj podle rámu na obrazovce
  const vyrez = (maxW, pomer) => new Promise((ok, chyba) => {
    if (!cur) return chyba(new Error('neni'));
    const sw = ram.w / s, sh = ram.h / s, sx = cur.u - sw / 2, sy = cur.v - sh / 2;
    let W = Math.max(1, Math.min(maxW, Math.round(sw)));
    if (maxW - W <= 2) W = maxW;   // zaokrouhlení rámu na obrazovce nesmí ubrat pixel z cílové velikosti
    const H = Math.max(1, Math.round(pomer ? W / pomer : W * ram.h / ram.w));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    try { c.toBlob(b => b ? ok(b) : chyba(new Error('toBlob')), 'image/jpeg', 0.92); } catch (e) { chyba(e); }
  });
  return { cur, zoomNa, ovladani, obrazekStyl, vyrez, tahne };
}

// Načíst fotku pro úpravu — ze souboru, nebo z adresy (úvodní fotka, fotky firmy).
// Z adresy s crossOrigin, jinak by plátno nešlo uložit (Supabase Storage CORS povoluje).
function _pfNactiFotku(zdroj) {
  return new Promise((ok, chyba) => {
    const soubor = typeof zdroj !== 'string';
    const url = soubor ? URL.createObjectURL(zdroj) : zdroj;
    const i = new Image();
    if (!soubor) i.crossOrigin = 'anonymous';
    i.onload = () => ok({ img: i, url });
    i.onerror = () => { if (soubor) URL.revokeObjectURL(url); chyba(new Error('load')); };
    i.src = url;
  });
}

// ── Úprava loga před nahráním (30. 9.) — okno se čtvercovým rámem ──
// Rám má tvar, v jakém se logo ukazuje (čtverec se zaoblenými rohy). Úvodní
// fotka se neupravuje v okně, ale přímo na profilu (viz ECompanyProfile).
function PFOrez({ file, onZrus, onUloz, onJina }) {
  const ramRef = React.useRef(null);
  const [foto, setFoto] = React.useState(null);        // { img, url }
  const [ukladam, setUkladam] = React.useState(false);
  const poz = _usePfPozice(foto && foto.img, ramRef);
  React.useEffect(() => {
    let zruseno = false, url = null;
    _pfNactiFotku(file).then(f => { url = f.url; if (!zruseno) setFoto(f); }).catch(() => onZrus(true));
    return () => { zruseno = true; if (url) URL.revokeObjectURL(url); };
  }, [file]);
  React.useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onZrus(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);
  const uloz = () => {
    if (!poz.cur || ukladam) return;
    setUkladam(true);
    poz.vyrez(600).then(onUloz).catch(() => setUkladam(false));
  };

  return ReactDOM.createPortal(
    <div onClick={() => !ukladam && onZrus()} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(11,18,51,.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'eDotazIn .18s ease-out' }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Upravit logo"
        style={{ width: 440, maxWidth: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 30px 80px -20px rgba(11,18,51,.45)', padding: '24px 26px 22px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#0B1233', letterSpacing: '-.02em' }}>Upravit logo</div>

        <div ref={ramRef} {...poz.ovladani}
          style={{ position: 'relative', margin: '18px auto 0', width: 'min(300px, 100%)', aspectRatio: '1', borderRadius: '23%',
            overflow: 'hidden', background: '#F1F3FB', boxShadow: 'inset 0 0 0 1px #E6E9F5', cursor: poz.cur ? (poz.tahne ? 'grabbing' : 'grab') : 'default', touchAction: 'none', userSelect: 'none' }}>
          {poz.cur && <img src={foto.url} alt="" draggable={false} style={poz.obrazekStyl} />}
          {!poz.cur && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 13.5, color: '#7A82A6' }}>Načítám fotku…</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#3A4266', flex: 'none' }}>Přiblížení</span>
          <input type="range" min="1" max={_PF_ZOOM_MAX} step="0.01" value={poz.cur ? poz.cur.z : 1} disabled={!poz.cur}
            onChange={e => poz.zoomNa(parseFloat(e.target.value))} aria-label="Přiblížení"
            style={{ flex: 1, accentColor: '#1B34F0', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <span onClick={() => !ukladam && onJina()} style={{ fontSize: 13.5, fontWeight: 700, color: '#1B34F0', cursor: 'pointer' }}>Vybrat jinou fotku</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <EBtnSek onClick={() => onZrus()} disabled={ukladam}>Zrušit</EBtnSek>
            <EBtnHl onClick={uloz} disabled={!poz.cur || ukladam}>{ukladam ? 'Ukládám…' : 'Uložit'}</EBtnHl>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Nabídka u úvodní fotky (jako Facebook): bez fotky jen Nahrát fotku; s fotkou
// i Vybrat z fotek firmy, Změnit pozici a Odebrat. V portálu — karta hlavičky
// má overflow:hidden a nabídku by ořízla.
function PFCoverMenu({ poz, polozky, onZavri }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const venku = e => { if (ref.current && !ref.current.contains(e.target)) onZavri(); };
    const esc = e => { if (e.key === 'Escape') onZavri(); };
    document.addEventListener('mousedown', venku, true);
    document.addEventListener('keydown', esc);
    window.addEventListener('scroll', onZavri, true);
    window.addEventListener('resize', onZavri);
    return () => { document.removeEventListener('mousedown', venku, true); document.removeEventListener('keydown', esc); window.removeEventListener('scroll', onZavri, true); window.removeEventListener('resize', onZavri); };
  }, []);
  return ReactDOM.createPortal(
    <div ref={ref} role="menu" style={{ position: 'fixed', top: poz.top, right: poz.right, zIndex: 300, minWidth: 240, background: '#fff', border: '1px solid #E6E9F5', borderRadius: 12, padding: 6, boxShadow: '0 18px 40px -14px rgba(20,22,40,.3)', animation: 'eKartaIn .16s cubic-bezier(.2,.8,.2,1) both' }}>
      {polozky.map((x, i) => x === '-' ? <div key={i} style={{ height: 1, background: '#F0F2FA', margin: '4px 6px' }} /> : (
        <button key={x.l} role="menuitem" onClick={() => { onZavri(); x.go(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: '#1F2433', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <Icon name={x.ic} size={19} color="#3A4266" />{x.l}
        </button>
      ))}
    </div>,
    document.body
  );
}

// Výběr úvodní fotky z Fotek firmy
function PFVyberFotky({ fotky, onVyber, onZrus }) {
  React.useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onZrus(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);
  return ReactDOM.createPortal(
    <div onClick={onZrus} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(11,18,51,.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'eDotazIn .18s ease-out' }}>
      <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Vybrat úvodní fotku"
        style={{ width: 620, maxWidth: '100%', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', background: '#fff', borderRadius: 18, boxShadow: '0 30px 80px -20px rgba(11,18,51,.45)', padding: '24px 26px 22px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#0B1233', letterSpacing: '-.02em' }}>Vybrat úvodní fotku</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginTop: 18 }}>
          {fotky.map(u => (
            <button key={u} type="button" onClick={() => onVyber(u)} className="e-pf-vyber"
              style={{ padding: 0, border: 'none', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', aspectRatio: '4 / 3', background: '#F1F3FB' }}>
              <img src={u} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}><EBtnSek onClick={onZrus}>Zrušit</EBtnSek></div>
      </div>
    </div>,
    document.body
  );
}

// ── Ověřit firmu (Yasin 2. 10.): kontaktní e-mail + IČO, bez nich žádost neodejde ──
// IČO se při psaní dohledá v ARES (název a sídlo pod políčkem, ať firma vidí, že se netrefila
// vedle). Žádost jde do overeni_firem a e-mailem na podpora@makej.eu, odznak zapíná Yasin ručně.
const _pfEmailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function PFOvereni({ email0, ico0, onUdaje, onOdeslano, onZrus }) {
  const [email, setEmail] = React.useState(email0 || '');
  const [ico, setIco] = React.useState(ico0 || '');
  const [chyby, setChyby] = React.useState({});           // { email, ico, obecna }
  const [ares, setAres] = React.useState({ stav: 'nic' }); // nic | hledam | ok | neni | zanikla | nedostupny
  const [odesilam, setOdesilam] = React.useState(false);
  const hledani = React.useRef(null);                     // { ico, slib } — poslední dotaz do ARES
  const icoCisla = ico.replace(/\s+/g, '');

  const hledej = cislo => {
    if (hledani.current && hledani.current.ico === cislo) return hledani.current.slib;
    const slib = aresFirmaE(cislo)
      .then(f => !f ? { stav: 'neni' } : f.zanikla ? { stav: 'zanikla' } : { stav: 'ok', nazev: f.nazev, adresa: f.adresa })
      .catch(() => ({ stav: 'nedostupny' }));
    hledani.current = { ico: cislo, slib };
    return slib;
  };
  React.useEffect(() => {
    if (!/^\d{8}$/.test(icoCisla) || !icoPlatneE(icoCisla)) { setAres({ stav: 'nic' }); return; }
    let platne = true;
    setAres({ stav: 'hledam' });
    const t = setTimeout(() => hledej(icoCisla).then(v => { if (platne) setAres(v); }), 250);
    return () => { platne = false; clearTimeout(t); };
  }, [icoCisla]);
  React.useEffect(() => {
    const esc = e => { if (e.key === 'Escape' && !odesilam) onZrus(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [odesilam]);

  async function odesli() {
    if (odesilam) return;
    const em = email.trim(), ch = {};
    if (!em) ch.email = 'Vyplňte e-mail.';
    else if (!_pfEmailOk(em)) ch.email = 'Zkontrolujte e-mail.';
    if (!icoCisla) ch.ico = 'Vyplňte IČO.';
    else if (!/^\d{8}$/.test(icoCisla)) ch.ico = 'IČO má 8 číslic.';
    else if (!icoPlatneE(icoCisla)) ch.ico = 'Tohle IČO není platné.';
    setChyby(ch);
    if (ch.email || ch.ico) return;
    setOdesilam(true);
    const a = await hledej(icoCisla);
    setAres(a);
    if (a.stav === 'neni' || a.stav === 'zanikla') { setChyby({ ico: a.stav === 'neni' ? 'Firmu s tímto IČO jsme v rejstříku nenašli.' : 'Firma s tímto IČO podle rejstříku zanikla.' }); setOdesilam(false); return; }
    if (!(await onUdaje(em, icoCisla))) { setChyby({ obecna: 'Uložení se nezdařilo, zkuste to znovu.' }); setOdesilam(false); return; }
    const v = await odesliOvereniE({ ico: icoCisla, email: em, nazev: a.nazev, adresa: a.adresa });
    if (v === 'ok' || v === 'uz-ceka') { onOdeslano(); return; }
    setChyby({ obecna: v === 'limit' ? 'Dnes už jste žádost poslali třikrát, zkuste to zítra.' : 'Odeslání se nezdařilo, zkuste to znovu.' });
    setOdesilam(false);
  }

  const popisek = { display: 'block', fontSize: 13, fontWeight: 700, color: '#3A4266', marginBottom: 6 };
  const chybaTxt = t => t && <div style={{ fontSize: 13, fontWeight: 600, color: '#E11D48', marginTop: 6 }}>{t}</div>;
  return ReactDOM.createPortal(
    <div onClick={() => !odesilam && onZrus()} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(11,18,51,.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'eDotazIn .18s ease-out' }}>
      <form onClick={e => e.stopPropagation()} onSubmit={e => e.preventDefault()} noValidate role="dialog"
        onKeyDown={e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); odesli(); } }} aria-modal="true" aria-label="Ověřit firmu"
        style={{ width: 440, maxWidth: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 30px 80px -20px rgba(11,18,51,.45)', padding: '24px 26px 22px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#0B1233', letterSpacing: '-.02em' }}>Ověřit firmu</div>
        <label style={{ display: 'block', marginTop: 20 }}>
          <span style={popisek}>E-mail</span>
          <input className={'e-pf-pole' + (chyby.email ? ' chyba' : '')} type="email" inputMode="email" autoComplete="email" value={email} autoFocus={!email0}
            onChange={e => { setEmail(e.target.value); if (chyby.email) setChyby(c => ({ ...c, email: null })); }} />
          {chybaTxt(chyby.email)}
        </label>
        <label style={{ display: 'block', marginTop: 16 }}>
          <span style={popisek}>IČO</span>
          <input className={'e-pf-pole' + (chyby.ico ? ' chyba' : '')} inputMode="numeric" maxLength={10} value={ico} autoFocus={!!email0 && !ico0}
            onChange={e => { setIco(e.target.value.replace(/[^\d\s]/g, '')); if (chyby.ico) setChyby(c => ({ ...c, ico: null })); }} />
          {chybaTxt(chyby.ico)}
          {!chyby.ico && ares.stav === 'hledam' && <div style={{ fontSize: 13, color: '#7A82A6', marginTop: 6 }}>Hledám v rejstříku…</div>}
          {!chyby.ico && ares.stav === 'ok' && (
            <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 10, background: '#F7F8FA', fontSize: 13.5, lineHeight: 1.45 }}>
              <div style={{ fontWeight: 700, color: '#0B1220' }}>{ares.nazev}</div>
              {ares.adresa && <div style={{ color: '#5B6478' }}>{ares.adresa}</div>}
            </div>
          )}
        </label>
        {chybaTxt(chyby.obecna)}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <EBtnSek onClick={() => onZrus()} disabled={odesilam}>Zrušit</EBtnSek>
          <EBtnHl onClick={odesli} disabled={odesilam}>{odesilam ? 'Odesílám…' : 'Zaslat požadavek'}</EBtnHl>
        </div>
      </form>
    </div>,
    document.body
  );
}

function ECompanyProfile({ onTab } = {}) {
  const P = (typeof EPROFILE !== 'undefined' ? EPROFILE : {});
  const C = (typeof ECOMPANY !== 'undefined' ? ECOMPANY : {});
  const [form, setForm] = React.useState(() => _pfZProfilu(P, C));   // co je uložené v databázi
  const [uprava, setUprava] = React.useState(null);       // 'hlavicka' | 'popis' | 'kontakt' | 'doba' | 'site' | 'pravidla'
  const [koncept, setKoncept] = React.useState(null);     // rozepsané hodnoty upravované části
  const [stav, setStav] = React.useState('ok');           // 'ok' | 'ukladam' | 'chyba' — vpravo nahoře
  const [zalozka, setZalozka] = React.useState('prehled');
  const [hlaska, setHlaska] = React.useState(null);       // { text, chyba }
  const [nahravam, setNahravam] = React.useState(null);   // 'cover' | 'logo' | 'photos'
  const [orez, setOrez] = React.useState(null);           // { file } — okno úpravy loga před nahráním
  // Úvodní fotka se upravuje přímo na profilu (jako Facebook): { img, url, novy }
  const [coverUprava, setCoverUprava] = React.useState(null);
  const [coverMenu, setCoverMenu] = React.useState(null); // { top, right } — nabídka u tlačítka
  const [vyberFotky, setVyberFotky] = React.useState(false);
  const [tazena, setTazena] = React.useState(null);       // pořadí fotky, kterou firma táhne
  const [overeni, setOvereni] = React.useState(null);     // stav poslední žádosti o ověření: 'ceka' | 'schvaleno' | 'zamitnuto' | null
  const [oknoOvereni, setOknoOvereni] = React.useState(false);
  const soubory = React.useRef({});
  const coverRef = React.useRef(null);
  const poz = _usePfPozice(coverUprava && coverUprava.img, coverRef);

  const ukaz = (text, chyba) => { setHlaska({ text, chyba }); setTimeout(() => setHlaska(null), chyba ? 9000 : 3200); };
  const k = koncept || form;
  const setK = (pole, v) => setKoncept(f => ({ ...f, [pole]: v }));
  const setKSit = (sit, v) => setKoncept(f => ({ ...f, socials: { ...f.socials, [sit]: v } }));
  const setKDen = (den, zmena) => setKoncept(f => ({ ...f, dny: { ...f.dny, [den]: { ...f.dny[den], ...zmena } } }));

  // ── Úprava části profilu: Upravit → koncept → Uložit (jeden zápis) / Zrušit ──
  // Když je rozepsaná jiná karta, nejdřív se uloží. Dřív se při „Upravit" u jiné karty tiše
  // zahodila (2. 10. tak Yasinovi zmizel napsaný popis firmy, uložil jen Kontakt).
  async function zacni(sekce) {
    if (uprava && uprava !== sekce && _pfZmeneno(uprava, koncept, form) && !(await ulozSekci())) return;
    if (sekce !== 'hlavicka') setZalozka(sekce === 'pravidla' ? 'pravidla' : 'prehled');
    setKoncept({ ...form, socials: { ...form.socials }, hours: { ...form.hours }, dny: _pfDnyZ(form.hours) });
    setUprava(sekce);
  }
  const zrus = () => { setUprava(null); setKoncept(null); };
  // Ověřit firmu: rozepsaná karta se nejdřív uloží (okno zapisuje e-mail a IČO do Kontaktu)
  async function otevriOvereni() {
    if (uprava) { if (_pfZmeneno(uprava, koncept, form) && !(await ulozSekci())) return; zrus(); }
    setOknoOvereni(true);
  }
  React.useEffect(() => {
    let platne = true;
    if (typeof overeniStavE === 'function') overeniStavE().then(v => { if (platne) setOvereni(v); });
    return () => { platne = false; };
  }, []);
  async function ulozUdajeOvereni(email, ico) {
    if (email === form.email.trim() && ico === form.ico.trim()) return true;
    if (!(await zapis({ contact_email: email, ic: ico }))) return false;
    setForm(f => ({ ...f, email, ico }));
    return true;
  }
  async function zapis(patch) {
    setStav('ukladam');
    const ok = typeof updateEmployerProfile === 'function' ? await updateEmployerProfile(patch) : false;
    setStav(ok ? 'ok' : 'chyba');
    if (!ok) ukaz('Uložení se nezdařilo, zkuste to znovu.', true);
    return ok;
  }
  async function ulozSekci() {
    if (!koncept || !uprava || stav === 'ukladam') return false;
    const f = _pfHotovyKoncept(uprava, koncept);
    if (uprava === 'hlavicka' && !f.name.trim()) { ukaz('Název firmy nesmí být prázdný.', true); return false; }
    if (!(await zapis(_pfPatch(uprava, f)))) return false;
    const sekce = uprava;
    setForm(prev => { const n = { ...prev }; _PF_SEKCE[sekce].forEach(x => { n[x] = f[x]; }); return n; });
    zrus();
    if (sekce === 'hlavicka') {
      C.name = f.name.trim(); C.logo = C.name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
      window.dispatchEvent(new Event('emp-profil-ulozen'));   // levé menu (název)
    }
    return true;
  }
  // Odchod ze záložky s rozepsanou kartou: uložit potichu, ať se napsaný text neztratí
  const posledni = React.useRef({});
  posledni.current = { uprava, koncept, form };
  React.useEffect(() => () => {
    const { uprava: u, koncept: kc, form: fo } = posledni.current;
    if (!_pfZmeneno(u, kc, fo) || typeof updateEmployerProfile !== 'function') return;
    const f = _pfHotovyKoncept(u, kc);
    if (u === 'hlavicka' && !f.name.trim()) return;
    updateEmployerProfile(_pfPatch(u, f));
  }, []);

  // ── Fotky: výběr souboru → zmenšení → bucket `uploads` → hned do profilu ──
  const vyber = kind => { const el = soubory.current[kind]; if (el) { el.value = ''; el.click(); } };
  async function ulozFotky(fotky) {
    setForm(f => ({ ...f, photos: fotky }));
    await zapis({ photos: fotky });
  }
  async function nahraj(kind, fileList) {
    const vse = Array.from(fileList || []);
    const obrazky = vse.filter(f => (typeof jeObrazekE === 'function' ? jeObrazekE(f) : /^image\//.test(f.type)));
    const files = obrazky.filter(f => f.size <= _PF_SOUBOR_MAX_MB * 1024 * 1024);
    if (vse.length > obrazky.length) ukaz('Nahrát jde jen fotka (JPG, PNG, WEBP, HEIC).', true);
    else if (obrazky.length > files.length) ukaz((obrazky.length === 1 ? 'Fotka je' : 'Některá fotka je') + ' moc velká. Jedna fotka může mít nejvýš ' + _PF_SOUBOR_MAX_MB + ' MB.', true);
    if (!files.length || typeof uploadImageE !== 'function' || typeof sb === 'undefined') return;
    // Logo: nejdřív okno úpravy; úvodní fotka: hned na profil do úpravy pozice.
    // Fotku z iPhonu (HEIC) nejdřív převést, jinak by ji Chrome v úpravě neotevřel.
    if (kind === 'logo' || kind === 'cover') {
      let f = files[0];
      try { if (typeof pripravFotkuE === 'function') f = await pripravFotkuE(f); }
      catch (e) { ukaz('Tuhle fotku se nepodařilo otevřít. Zkuste JPG nebo PNG.', true); return; }
      if (kind === 'logo') setOrez({ file: f }); else upravCover(f);
      return;
    }
    setNahravam(kind);
    const { data: { session } } = await sb.auth.getSession();
    const uid = session && session.user && session.user.id;
    const volno = Math.max(0, _PF_FOTEK_MAX - form.photos.length);
    if (files.length > volno) ukaz('Fotek firmy může být nejvýš ' + _PF_FOTEK_MAX + '.', true);
    const urls = [];
    for (const f of files.slice(0, volno)) { const u = await uploadImageE(uid, 'firma-foto', f, 1400); if (u) urls.push(u); }
    if (urls.length) await ulozFotky([...form.photos, ...urls]);
    if (urls.length < Math.min(files.length, volno)) ukaz('Některou fotku se nepodařilo nahrát, zkuste to znovu.', true);
    setNahravam(null);
  }
  const odeberFotku = i => ulozFotky(form.photos.filter((_, j) => j !== i));
  const presunFotku = (z, na) => {
    if (z == null || z === na) return;
    const a = [...form.photos]; const [x] = a.splice(z, 1); a.splice(na, 0, x);
    ulozFotky(a);
  };
  // Výřez (logo z okna, úvodní fotka z profilu) → bucket `uploads` → hned do profilu
  async function nahrajVyrez(kind, blob) {
    setOrez(null);
    setNahravam(kind);
    const { data: { session } } = await sb.auth.getSession();
    const uid = session && session.user && session.user.id;
    const u = await uploadImageE(uid, kind === 'cover' ? 'firma-pozadi' : 'firma-logo', blob, kind === 'cover' ? _PF_COVER_W : 600, true);
    if (u) await ulozFotku(kind === 'cover' ? 'cover_url' : 'logo_url', u);
    else ukaz('Fotku se nepodařilo nahrát, zkuste to znovu.', true);
    setNahravam(null);
    return !!u;
  }
  async function ulozFotku(pole, url) {
    const puvodni = form[pole];
    setForm(f => ({ ...f, [pole]: url }));
    if (await zapis({ [pole]: url })) { window.dispatchEvent(new Event('emp-profil-ulozen')); return; }   // levé menu ukazuje logo
    setForm(f => ({ ...f, [pole]: puvodni }));
  }

  // ── Úvodní fotka: úprava pozice přímo na profilu ──
  // zdroj = soubor (nová fotka) nebo adresa (stávající úvodní / fotka firmy)
  async function upravCover(zdroj) {
    try {
      const f = await _pfNactiFotku(zdroj);
      setCoverUprava({ ...f, soubor: typeof zdroj !== 'string' });
    } catch (e) { ukaz('Tuhle fotku se nepodařilo otevřít. Zkuste JPG nebo PNG, případně ji nahrajte znovu.', true); }
  }
  const zrusCover = () => { if (coverUprava && coverUprava.soubor) URL.revokeObjectURL(coverUprava.url); setCoverUprava(null); };
  async function ulozCover() {
    if (!poz.cur || nahravam) return;
    let blob;
    try { blob = await poz.vyrez(_PF_COVER_W, _PF_COVER_W / _PF_COVER_H); }
    catch (e) { ukaz('Tuhle fotku teď nejde upravit. Nahrajte ji prosím znovu.', true); return; }
    const ok = await nahrajVyrez('cover', blob);
    if (ok) zrusCover();
  }
  const otevriCoverMenu = e => {
    const r = e.currentTarget.getBoundingClientRect();
    setCoverMenu({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
  };
  const coverPolozky = form.cover_url ? [
    ...(form.photos.length ? [{ l: 'Vybrat úvodní fotku', ic: 'gallery-linear', go: () => setVyberFotky(true) }] : []),
    { l: 'Nahrát fotku', ic: 'upload-minimalistic-linear', go: () => vyber('cover') },
    { l: 'Změnit pozici', ic: 'move-linear', go: () => upravCover(form.cover_url) },
    '-',
    { l: 'Odebrat', ic: 'trash-bin-minimalistic-linear', go: () => ulozFotku('cover_url', '') },
  ] : [
    ...(form.photos.length ? [{ l: 'Vybrat z fotek firmy', ic: 'gallery-linear', go: () => setVyberFotky(true) }] : []),
    { l: 'Nahrát fotku', ic: 'upload-minimalistic-linear', go: () => vyber('cover') },
  ];
  const souborInput = kind => (
    <input type="file" accept="image/*,.heic,.heif" multiple={kind === 'photos'} hidden
      ref={el => { if (el) soubory.current[kind] = el; }} onChange={e => nahraj(kind, e.target.files)} />
  );

  // ── Odvozené údaje ──
  const inicialy = (form.name.trim() || C.name || '?').split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
  const krajTxt = (_PF_KRAJE.find(x => x[0] === form.kraj) || [])[1] || '';
  const verified = !!P.verified;
  const recenze = (typeof E_REVIEWS !== 'undefined' ? E_REVIEWS : []);
  const prumer = recenze.length ? (recenze.reduce((a, r) => a + (r.rating || 0), 0) / recenze.length) : 0;
  const brigady = (typeof E_JOBS !== 'undefined' ? E_JOBS : []).filter(j => j.status === 'active' || j.status === 'urgent');
  const otevreno = _pfOtevreno(form.hours);
  const dnes = _pfTed().den;
  const dobaVyplnena = _PF_DNY.some(([d]) => String(form.hours[d] || '').trim());
  const ukladam = stav === 'ukladam';

  // Dokončení profilu (dřív „Síla profilu", Yasin 2. 10.: „zní hrozně"): klik na nesplněný bod otevře jeho úpravu
  const body = [
    { l: 'Logo a úvodní fotka', ok: !!(form.logo_url && form.cover_url), go: () => vyber(form.logo_url ? 'cover' : 'logo') },
    { l: 'Popis firmy', ok: !!form.bio.trim(), go: () => zacni('popis') },
    { l: 'Otevírací doba', ok: dobaVyplnena, go: () => zacni('doba') },
    { l: 'Kontakty', ok: !!(form.phone.trim() || form.email.trim()), go: () => zacni('kontakt') },
    { l: 'Ověřit firmu', ok: verified, ceka: overeni === 'ceka', go: otevriOvereni },
    { l: 'Další fotky', ok: form.photos.length >= 4, go: () => setZalozka('fotky') },
    { l: 'Kariérní stránka', ok: !!form.career.trim(), go: () => zacni('kontakt') },
  ];
  const hotovo = body.filter(b => b.ok).length;
  // Nikdy pod 20 % — prázdný profil začíná na 20 a každý bod přidá díl ze zbylých 80 (motivace dokončit)
  const procent = Math.round(20 + 80 * hotovo / body.length);
  // Barva podle postupu: od tmavě oranžové (20 %) plynule do zelené (100 %). Přechod jde po odstínu
  // přes žlutozelenou (ne přímo v RGB, to by uprostřed bylo hnědé) a uprostřed je tmavší, ať je číslo čitelné
  const barvaDokonceni = (() => {
    const t = Math.min(1, Math.max(0, (procent - 20) / 80));
    const h = 17 + (146 - 17) * t, s = 87 - 7 * t, l = 45 - 10 * t - 9 * Math.sin(Math.PI * t);
    return 'hsl(' + h.toFixed(1) + ',' + s.toFixed(1) + '%,' + l.toFixed(1) + '%)';
  })();
  const zbyva = body.length - hotovo;

  const sedy = '#5B6478';
  const radek = { display: 'grid', gridTemplateColumns: '100px minmax(0,1fr)', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: '1px solid #F0F1F4', minHeight: 22 };
  const doplnit = sekce => <button className="e-pf-doplnit" onClick={() => zacni(sekce)}>+ Doplnit</button>;
  const zalozky = [
    ['prehled', 'Přehled'], ['fotky', 'Fotky', form.photos.length], ['brigady', 'Brigády', brigady.length], ['hodnoceni', 'Hodnocení', recenze.length],
  ];

  // Údaje v kartě Kontakt a údaje (pořadí jako v návrhu: po řádcích, dva sloupce)
  const udaje = [
    ['Adresa', 'address'], ['Kraj', 'kraj'], ['Telefon', 'phone'], ['E-mail', 'email'],
    ['Web', 'web'], ['Kariéra', 'career'], ['IČO', 'ico'], ['Založeno', 'founded'],
  ];
  const hodnotaUdaje = pole => pole === 'kraj' ? krajTxt : String(form[pole] || '').trim();
  const poleUdaje = pole => pole === 'kraj'
    ? <select className="e-pf-pole" value={k.kraj} onChange={e => setK('kraj', e.target.value)}>
        <option value="">Vyberte kraj</option>
        {_PF_KRAJE.map(([id, n]) => <option key={id} value={id}>{n}</option>)}
      </select>
    : <input className="e-pf-pole" value={k[pole]} onChange={e => setK(pole, e.target.value)}
        inputMode={pole === 'phone' ? 'tel' : pole === 'email' ? 'email' : (pole === 'ico' || pole === 'founded') ? 'numeric' : undefined} />;

  return (
    <div className="e-ram e-volne" style={{ padding: 20 }}>
      <div style={{ background: '#F7F7F9', border: '1px solid #E7E9EF', borderRadius: 22, padding: '20px 24px 48px', color: '#0B1220' }}>
        {/* Drobečky „Moje firma / Profil firmy" a stav ukládání z návrhu pryč (Yasin 2. 10.: „to je tam zbytečný");
            chybu uložení hlásí hláška dole. */}
        {/* ── Karta hlavičky ── */}
        <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: 18, overflow: 'hidden' }}>
          {souborInput('cover')}{souborInput('logo')}{souborInput('photos')}
          {orez && <PFOrez key={orez.file.name + orez.file.size + orez.file.lastModified} file={orez.file}
            onZrus={chyba => { setOrez(null); if (chyba === true) ukaz('Tuhle fotku se nepodařilo otevřít. Zkuste JPG nebo PNG.', true); }}
            onJina={() => vyber('logo')} onUloz={blob => nahrajVyrez('logo', blob)} />}
          {coverMenu && <PFCoverMenu poz={coverMenu} polozky={coverPolozky} onZavri={() => setCoverMenu(null)} />}
          {oknoOvereni && <PFOvereni email0={form.email.trim()} ico0={form.ico.trim()} onUdaje={ulozUdajeOvereni} onZrus={() => setOknoOvereni(false)}
            onOdeslano={() => { setOknoOvereni(false); setOvereni('ceka'); ukaz('Požadavek odeslán'); }} />}
          {vyberFotky && <PFVyberFotky fotky={form.photos} onZrus={() => setVyberFotky(false)} onVyber={u => { setVyberFotky(false); upravCover(u); }} />}
          {/* Úvodní fotka v poměru 1640 : 624 (_PF_COVER_W / _H), mimo úpravu se stropem výšky
              _PF_COVER_MAX_H (náhled, appka ji ukazuje celou). Pozice se upravuje přímo tady
              (tažení, kolečko, posuvník) v přesném poměru. Bez fotky světlá plocha, při najetí
              ztmavne; klik kamkoli = nahrát. */}
          <div ref={coverRef} className={form.cover_url || coverUprava ? undefined : 'e-pf-cover-prazdne'} {...(coverUprava ? poz.ovladani : {})}
            onClick={!form.cover_url && !coverUprava ? (e => { if (e.target === e.currentTarget) vyber('cover'); }) : undefined}
            style={{ position: 'relative', width: '100%', aspectRatio: _PF_COVER_W + ' / ' + _PF_COVER_H, maxHeight: coverUprava ? 'none' : _PF_COVER_MAX_H, overflow: 'hidden',
              background: form.cover_url ? ('#E9E2D9 center/cover no-repeat url("' + form.cover_url + '")') : undefined,
              ...(coverUprava ? { background: '#0B1233', cursor: poz.tahne ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' } : {}) }}>
            {coverUprava && poz.cur && <img src={coverUprava.url} alt="" draggable={false} style={poz.obrazekStyl} />}
            {coverUprava ? (
              <>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, padding: '14px 18px 26px', background: 'linear-gradient(180deg, rgba(11,18,51,.45), rgba(11,18,51,0))', color: '#fff', pointerEvents: 'none' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }} onPointerDown={e => e.stopPropagation()}>
                    <span style={{ fontSize: 12.5, fontWeight: 700 }}>Přiblížení</span>
                    <input type="range" min="1" max={_PF_ZOOM_MAX} step="0.01" value={poz.cur ? poz.cur.z : 1} disabled={!poz.cur}
                      onChange={e => poz.zoomNa(parseFloat(e.target.value))} aria-label="Přiblížení" style={{ width: 150, accentColor: '#fff', cursor: 'pointer' }} />
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 3, display: 'flex', gap: 8 }} onPointerDown={e => e.stopPropagation()}>
                  <button className="e-pf-btn2" onClick={zrusCover} disabled={nahravam === 'cover'} style={{ height: 36 }}>Zrušit</button>
                  <button className="e-pf-btn" onClick={ulozCover} disabled={!poz.cur || nahravam === 'cover'} style={{ height: 36 }}>{nahravam === 'cover' ? 'Ukládám…' : 'Uložit'}</button>
                </div>
              </>
            ) : (
              <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 3 }}>
                <button className="e-pf-na-fotce" onClick={e => coverMenu ? setCoverMenu(null) : otevriCoverMenu(e)} aria-haspopup="menu" aria-expanded={!!coverMenu}>
                  <PFIkona nazev="fotak" />{form.cover_url ? 'Změnit úvodní fotku' : 'Přidat úvodní fotku'}
                </button>
              </div>
            )}
            {nahravam === 'cover' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,18,51,.45)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 15, fontWeight: 800 }}>Ukládám úvodní fotku…</div>}
          </div>

          {/* Řádek identity: logo přesahuje do fotky, název, štítek, obor a místo, hodnocení */}
          <div style={{ display: 'flex', gap: 24, padding: '0 28px 22px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="e-pf-logo" onClick={() => vyber('logo')} title={form.logo_url ? 'Změnit logo' : 'Nahrát logo'}
              style={{ position: 'relative', width: 108, height: 108, borderRadius: 26, border: '4px solid #fff', marginTop: -54, flex: 'none', overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(11,18,32,.12)', background: form.logo_url ? '#fff' : form.brand, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 38, fontWeight: 800 }}>
              {form.logo_url ? <img src={form.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} /> : inicialy}
              <span className="e-pf-logo-zmenit" style={{ opacity: nahravam === 'logo' ? 1 : undefined }}>{nahravam === 'logo' ? 'Nahrávám…' : (form.logo_url ? 'Změnit logo' : 'Nahrát logo')}</span>
            </div>
            {uprava === 'hlavicka' ? (
              <div style={{ flex: 1, minWidth: 280, display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', paddingTop: 16 }}>
                <label style={{ flex: '2 1 260px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, color: sedy }}>Název firmy</span>
                  <input className="e-pf-pole" autoFocus value={k.name} onChange={e => setK('name', e.target.value)} style={{ fontSize: 17, fontWeight: 700 }} />
                </label>
                <label style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, color: sedy }}>Obor</span>
                  <select className="e-pf-pole" value={k.industry} onChange={e => setK('industry', e.target.value)}>
                    <option value="">Vyberte obor</option>
                    {_PF_OBORY.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="e-pf-btn2" onClick={zrus} disabled={ukladam} style={{ height: 42 }}>Zrušit</button>
                  <button className="e-pf-btn" onClick={ulozSekci} disabled={ukladam} style={{ height: 42 }}>{ukladam ? 'Ukládám…' : 'Uložit'}</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.15 }}>{form.name.trim() || 'Název vaší firmy'}</span>
                    {verified
                      ? <span style={{ padding: '4px 10px', borderRadius: 999, background: '#E7F7EE', color: '#0E7A3E', fontSize: 12, fontWeight: 600 }}>Ověřená firma</span>
                      : <span style={{ padding: '4px 10px', borderRadius: 999, background: '#F0F1F4', color: '#3A4256', fontSize: 12, fontWeight: 600 }}>{overeni === 'ceka' ? 'Čeká na ověření' : 'Neověřená'}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, fontSize: 15, color: sedy, flexWrap: 'wrap' }}>
                    {(form.industry || form.address.trim() || krajTxt) && <span>{[form.industry, form.address.trim() || krajTxt].filter(Boolean).join(' · ')}</span>}
                    {prumer > 0 && <>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0B1220', fontWeight: 600 }}>
                        <PFHvezda size={18} />{prumer.toFixed(1).replace('.', ',')}
                      </span>
                      <span>{recenze.length} hodnocení</span>
                    </>}
                  </div>
                </div>
                <button className="e-pf-btn" onClick={() => zacni('hlavicka')} style={{ height: 42, padding: '0 16px', marginBottom: 2 }}>
                  <PFIkona nazev="tuzka" />Upravit hlavičku
                </button>
              </>
            )}
          </div>

          {/* Záložky; Pro nové brigádníky je soukromá (zámek), na veřejném profilu není */}
          <div style={{ display: 'flex', gap: 28, padding: '0 28px', borderTop: '1px solid #EEF0F3', overflowX: 'auto' }}>
            {zalozky.map(([id, l, n]) => (
              <button key={id} className="e-pf-tab" data-on={zalozka === id ? '' : undefined} onClick={() => setZalozka(id)}>
                {l}{n != null && <span style={{ fontWeight: 500 }}>{' ' + n}</span>}
              </button>
            ))}
            <span style={{ flex: 1 }} />
            <button className="e-pf-tab" data-on={zalozka === 'pravidla' ? '' : undefined} onClick={() => setZalozka('pravidla')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="lock-keyhole-minimalistic-linear" size={17} color="currentColor" />Pro nové brigádníky
            </button>
          </div>
        </div>

        {/* ── Obsah záložky ── */}
        {zalozka === 'prehled' && (
          <div className="e-pf-telo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              <PFKarta nadpis="O firmě" onUpravit={uprava !== 'popis' ? () => zacni('popis') : null}
                vpravo={uprava === 'popis' ? <span style={{ fontSize: 12.5, fontWeight: 600, color: k.bio.length > 950 ? '#B96F06' : sedy }}>{k.bio.length} / 1000</span> : null}>
                {uprava === 'popis' ? (
                  <>
                    <PFText value={k.bio} onChange={v => setK('bio', v)} max={1000} autoFocus
                      placeholder="Kdo jste, co děláte, pro koho. Jaké to u vás je a proč by k vám měl člověk chtít na brigádu." />
                    <PFTlacitka onZrus={zrus} onUloz={ulozSekci} ukladam={ukladam} />
                  </>
                ) : form.bio.trim()
                  ? <div style={{ fontSize: 16, lineHeight: 1.6, color: '#3A4256', whiteSpace: 'pre-wrap', textWrap: 'pretty' }}>{form.bio}</div>
                  : doplnit('popis')}
              </PFKarta>

              {/* Sociální sítě hned za O firmě, ať nejsou schované dole (Yasin 2. 10.) */}
              <PFKarta nadpis="Sociální sítě" onUpravit={uprava !== 'site' ? () => zacni('site') : null}>
                {uprava === 'site' ? (
                  <>
                    {_PF_SITE.map(([s, l, ph, barva], i) => (
                      <div key={s} style={{ ...radek, gridTemplateColumns: '120px minmax(0,1fr)', borderBottom: i === _PF_SITE.length - 1 ? 'none' : radek.borderBottom }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: sedy }}><PFSitIkona sit={s} size={18} />{l}</span>
                        <input className="e-pf-pole" value={k.socials[s]} placeholder={ph} onChange={e => setKSit(s, e.target.value)} />
                      </div>
                    ))}
                    <PFTlacitka onZrus={zrus} onUloz={ulozSekci} ukladam={ukladam} />
                  </>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {[..._PF_SITE.filter(x => form.socials[x[0]]), ..._PF_SITE.filter(x => !form.socials[x[0]])].map(([s, l, , barva]) => form.socials[s]
                      ? <a key={s} className="e-pf-sit" href={/^https?:\/\//i.test(form.socials[s]) ? form.socials[s] : 'https://' + form.socials[s]} target="_blank" rel="noopener noreferrer">
                          <PFSitIkona sit={s} size={17} />{l}<span style={{ color: sedy, fontWeight: 500 }}>{_pfUcet(s, form.socials[s])}</span>
                        </a>
                      : <button key={s} className="e-pf-sit-prazdna" onClick={() => zacni('site')}><PFSitIkona sit={s} size={17} />{l}</button>)}
                  </div>
                )}
              </PFKarta>

              <PFKarta nadpis="Kontakt a údaje" onUpravit={uprava !== 'kontakt' ? () => zacni('kontakt') : null}>
                <div className="e-pf-dvojice">
                  {udaje.map(([l, pole], i) => (
                    <div key={pole} style={{ ...radek, borderBottom: i >= udaje.length - 2 ? 'none' : radek.borderBottom }}>
                      <span style={{ color: sedy, fontSize: 15 }}>{l}</span>
                      {uprava === 'kontakt' ? poleUdaje(pole)
                        : hodnotaUdaje(pole) ? <span style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hodnotaUdaje(pole)}</span>
                        : doplnit('kontakt')}
                    </div>
                  ))}
                </div>
                {uprava === 'kontakt' && <PFTlacitka onZrus={zrus} onUloz={ulozSekci} ukladam={ukladam} />}
              </PFKarta>

            </div>

            {/* Pravý sloupec: otevírací doba a pod ní síla profilu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              {/* Otevírací doba vpravo, dny pod sebou (Yasin 2. 10.: „hezky všechny dny pod sebou");
                  štítek Teď otevřeno / Zavřeno je pod nadpisem, vedle by se do úzké karty nevešel */}
              <PFKarta nadpis="Otevírací doba" onUpravit={uprava !== 'doba' ? () => zacni('doba') : null}>
                {uprava !== 'doba' && otevreno && (
                  <div style={{ display: 'flex', marginBottom: 6 }}>
                    {otevreno === 'otevreno'
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: '#E7F7EE', color: '#0E7A3E', fontSize: 13, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#12A150' }} />Teď otevřeno</span>
                      : <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: '#F0F1F4', color: sedy, fontSize: 13, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A3AAB8' }} />Zavřeno</span>}
                  </div>
                )}
                {uprava === 'doba' ? (
                  <>
                    <div>
                      {_PF_DNY.map(([d, l], i) => {
                        const x = k.dny[d];
                        return (
                          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i === 6 ? 'none' : '1px solid #F0F1F4', fontSize: 15 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, width: 94, flex: 'none', cursor: 'pointer' }}>
                              <input type="checkbox" className="e-pf-check" checked={x.otevreno} onChange={e => setKDen(d, { otevreno: e.target.checked })} />
                              <span style={{ color: x.otevreno ? '#0B1220' : sedy }}>{l}</span>
                            </label>
                            {x.otevreno ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                                <input type="time" className="e-pf-pole" value={x.od} onChange={e => setKDen(d, { od: e.target.value })} style={{ width: 76 }} />
                                <span style={{ color: sedy }}>–</span>
                                <input type="time" className="e-pf-pole" value={x.do} onChange={e => setKDen(d, { do: e.target.value })} style={{ width: 76 }} />
                              </span>
                            ) : <span style={{ color: sedy }}>Zavřeno</span>}
                          </div>
                        );
                      })}
                    </div>
                    <PFTlacitka onZrus={zrus} onUloz={ulozSekci} ukladam={ukladam} />
                  </>
                ) : !dobaVyplnena ? doplnit('doba') : (
                  <div>
                    {_PF_DNY.map(([d, l], i) => {
                      const t = String(form.hours[d] || '').trim();
                      return (
                        <div key={d} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: i === 6 ? 'none' : '1px solid #F0F1F4', fontSize: 15, color: t ? '#0B1220' : sedy }}>
                          <span>{l}</span>
                          <span style={{ fontWeight: t && d === dnes ? 600 : 400 }}>{t || 'Zavřeno'}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </PFKarta>

            {/* Dokončení profilu */}
            <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: 18, padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'conic-gradient(' + barvaDokonceni + ' 0 ' + procent + '%, #E7E9EF ' + procent + '% 100%)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', fontSize: procent >= 100 ? 16 : 18, fontWeight: 700, color: barvaDokonceni }}>{procent} %</div>
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>Dokončeno</div>
                  <div style={{ fontSize: 14, color: sedy, marginTop: 2, lineHeight: 1.4 }}>
                    {zbyva ? 'Doplňte ' + zbyva + ' ' + _pfVeci(zbyva) + ' a profil bude kompletní.' : 'Profil je kompletní.'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18, fontSize: 15 }}>
                {body.map(b => b.ok ? (
                  // Hotové jako v nákupním seznamu: zešedne a škrtne se, bez koleček (Yasin 2. 10.)
                  <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid #F0F1F4', color: '#A3AAB8' }}>
                    <span style={{ textDecoration: 'line-through', textDecorationColor: '#A3AAB8' }}>{b.l}</span>
                  </div>
                ) : b.ceka ? (
                  <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid #F0F1F4', fontWeight: 600 }}>
                    <span style={{ flex: 1 }}>{b.l}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: sedy }}>Čeká na schválení</span>
                  </div>
                ) : (
                  <button key={b.l} className="e-pf-bod" onClick={b.go}>
                    <span style={{ flex: 1, textAlign: 'left' }}>{b.l}{b.pocet && <span style={{ color: sedy, fontWeight: 500 }}>{' ' + b.pocet}</span>}</span>
                    <Icon name="arrow-right-linear" size={18} color={_PF_MODRA} />
                  </button>
                ))}
              </div>
            </div>
            </div>
          </div>
        )}

        {zalozka === 'fotky' && (
          <div style={{ marginTop: 24 }}>
            <PFKarta nadpis="Fotky">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: 6 }}>
                {form.photos.map((url, i) => (
                  <span key={url + i} className="e-pf-foto" draggable onDragStart={() => setTazena(i)} onDragEnd={() => setTazena(null)}
                    onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); presunFotku(tazena, i); setTazena(null); }}
                    style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 12, overflow: 'hidden', background: '#F0F1F4', cursor: 'grab', opacity: tazena === i ? .45 : 1 }}>
                    <img src={url} alt="" loading="lazy" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                    <button className="e-pf-foto-x" onClick={() => odeberFotku(i)} title="Odebrat fotku"
                      style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 999, border: 'none', background: 'rgba(11,18,32,.6)', color: '#fff', fontSize: 13, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>✕</button>
                  </span>
                ))}
                {form.photos.length < _PF_FOTEK_MAX && (
                  <button onClick={() => nahravam ? null : vyber('photos')} className="e-pf-pridat" style={{ aspectRatio: '4 / 3', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', font: 'inherit' }}>
                    <Icon name="gallery-add-linear" size={24} color={_PF_MODRA} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: _PF_MODRA }}>{nahravam === 'photos' ? 'Nahrávám…' : 'Přidat fotky'}</span>
                  </button>
                )}
              </div>
            </PFKarta>
          </div>
        )}

        {zalozka === 'brigady' && (
          <div style={{ marginTop: 24 }}>
            <PFKarta nadpis="Brigády" vpravo={onTab ? <button className="e-pf-odkaz" onClick={() => onTab('jobs')}>Spravovat inzeráty</button> : null}>
              {brigady.length === 0
                ? <div style={{ fontSize: 15, color: sedy }}>Žádné aktivní inzeráty.</div>
                : brigady.map((j, i) => (
                  <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: i ? '1px solid #F0F1F4' : 'none' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</div>
                      <div style={{ fontSize: 14, color: sedy, marginTop: 2 }}>{[_pfDatum(j.date), j.timeText, j.location].filter(Boolean).join(' · ')}</div>
                    </div>
                    {j.pay ? <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>{j.pay} {j.payUnit}</span> : null}
                  </div>
                ))}
            </PFKarta>
          </div>
        )}

        {zalozka === 'hodnoceni' && (
          <div style={{ marginTop: 24 }}>
            <PFKarta nadpis="Hodnocení" vedle={prumer > 0 ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 15, fontWeight: 600 }}><PFHvezda size={18} />{prumer.toFixed(1).replace('.', ',')}</span> : null}>
              {recenze.length === 0
                ? <div style={{ fontSize: 15, color: sedy }}>Zatím žádná hodnocení.</div>
                : recenze.map((r, i) => (
                  <div key={r.id} style={{ padding: '14px 0', borderTop: i ? '1px solid #F0F1F4' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 10, background: r.color || '#6F80FF', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flex: 'none' }}>{r.avatar}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600 }}>{r.author}</span>
                      <span style={{ display: 'flex', gap: 1, flex: 'none' }}>
                        {[1, 2, 3, 4, 5].map(n => <PFHvezda key={n} size={15} color={n <= r.rating ? '#F5B301' : 'rgba(18,18,26,.14)'} />)}
                      </span>
                      {r.when && <span style={{ fontSize: 13, color: sedy, marginLeft: 6 }}>{r.when}</span>}
                    </div>
                    {r.text && <div style={{ fontSize: 15, lineHeight: 1.55, color: '#3A4256', marginTop: 8 }}>{r.text}</div>}
                  </div>
                ))}
            </PFKarta>
          </div>
        )}

        {zalozka === 'pravidla' && (
          <div style={{ marginTop: 24 }}>
            <PFKarta nadpis="Pro nové brigádníky" onUpravit={uprava !== 'pravidla' ? () => zacni('pravidla') : null}>
              {uprava === 'pravidla' ? (
                <>
                  <PFText value={k.rules} onChange={v => setK('rules', v)} autoFocus
                    placeholder="Co mají vědět před první směnou. Pošlete jim to ve Zprávách jedním klikem." />
                  <PFTlacitka onZrus={zrus} onUloz={ulozSekci} ukladam={ukladam} />
                </>
              ) : form.rules.trim()
                ? <div style={{ fontSize: 16, lineHeight: 1.6, color: '#3A4256', whiteSpace: 'pre-wrap' }}>{form.rules}</div>
                : doplnit('pravidla')}
            </PFKarta>
          </div>
        )}
      </div>

      {hlaska && (
        <div style={{ position: 'fixed', left: '50%', bottom: 26, transform: 'translateX(-50%)', zIndex: 80, maxWidth: 520, textAlign: 'center', background: hlaska.chyba ? '#8A4B00' : '#0B1233', color: '#fff', fontSize: 13, fontWeight: 700, padding: '12px 18px', borderRadius: 11, boxShadow: '0 14px 34px -10px rgba(11,18,51,.5)' }}>{hlaska.text}</div>
      )}
    </div>
  );
}

Object.assign(window, { ECompanyProfile });
