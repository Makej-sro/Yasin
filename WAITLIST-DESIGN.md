# Waitlist (čekací list) — design & specifikace

Předregistrační okno před spuštěním appky **Makej!** dne **1. 10. 2026**.
Full-screen překryv, který vyskočí po otevření marketingového webu a nechá lidi
zapsat se na čekací list (brigádník nebo zaměstnavatel).

- **Kód:** `index.html` (markup), `style.css` (styly), `script.js` (logika)
- **Kořenový prvek:** `.wl-fs` (`#wl-overlay`)
- **Data:** Supabase tabulka `public.waitlist`

---

## 1. Barvy

| Token / hodnota | Použití |
|---|---|
| `--primary` **#0020f6** | brandová modrá — karta, přepínač, odpočet, tlačítka |
| `#ffffff` | text na modré kartě, plochy tlačítek, placka „30 % sleva" |
| `#252525` | tmavý text na bílém pozadí (social proof) |
| `#22c55e` | zelená „live" tečka u social proof |
| Fialová: pozadí `#ece7ff`, text `#7c3aed`, okraj `rgba(124,58,237,.28)` | unikátní odznak „Byl jsem u toho" |

**Pravidlo:** hlavní plocha jen **modrá + bílá**. Fialová je vyhrazená **výhradně**
pro odznak „Byl jsem u toho", zelená jen pro „live" tečku. Žádné další barvy.

---

## 2. Struktura (shora dolů)

```
.wl-fs (overlay, bílé pozadí, ✕ vpravo nahoře)
└── .wl-fs-inner (vycentrované, na desktopu bez scrollu)
    ├── .wl-fs-head
    │   ├── h2  „Buď u toho od začátku"
    │   ├── .wl-countdown  — odpočet DD : HH : MM : SS do 1. 10. 2026
    │   └── p  „Přihlas se a my ti dáme vědět hned po spuštění."
    └── .wl-switch-wrap  (max 520 px, sloupec, gap 1rem)
        ├── .wl-toggle          — segmented switch (viz §3)
        ├── .wl-social          — social proof (viz §4)
        └── .wl-cards           — jedna karta, dva panely přes sebe (viz §5)
```

Po kliknutí na CTA se přes vše položí **formulářový panel** `.wl-panel` (viz §7).

---

## 3. Přepínač (segmented switch)

Jako přepínač měsíční/roční u ceníku.

- Dvě volby: **„Chci brigádu"** (`worker`) · **„Hledám brigádníky"** (`employer`)
- Aktivní = modrá pilulka `.wl-toggle-pill`, která **plynule sjede** vlevo/vpravo
  (`transform: translateX`, ~0,18 s).
- Kliknutí přepne: aktivní volbu, panel karty a text social proof.

---

## 4. Social proof (mezi switchem a kartou)

> 🟢 Za posledních 24 h se přihlásilo **53** brigádníků

- Zelená pulzující „live" tečka (`.wl-social-dot`).
- Text **#252525**, číslo **tučně #252525**.
- **Mění se s rolí:** `brigádníků` (worker) / `zaměstnavatelů` (employer),
  a jiné (věrohodné) číslo.
- ⚠️ Číslo je zatím **fejk** — deterministické podle dne (nepřeskakuje při
  refreshi), přes den mírně roste. Worker ~28–66, employer ~5–18.
- 🔜 **TODO:** napojit na reálný `COUNT(*)` z tabulky `waitlist` za posledních 24 h
  (viz §9).

---

## 5. Karta — jedna, přepínaná

Jedna modrá karta; oba panely (`[data-wl-panel="worker"]`, `="employer"`) leží
**přes sebe** ve stejné buňce gridu → karta **drží velikost**, přepnutím se mění
jen obsah. Přechod je rychlý a plynulý (fade + drobný posun, ~0,13 s), odcházející
panel zmizí hned (žádné prolínání dvou textů).

### Panel „worker" — Sháníš brigádu?
- Lead: *Zaregistruj se a buď v první stovce uživatelů.*
- Odrážky (bílé tečky, tučně):
  1. **Unikátní odznak na profilu** [ fialová placka **Byl jsem u toho** ]
  2. Přednostní přístup — jsi uvnitř dřív než ostatní
  3. Náskok na nejlepší brigády hned při startu
  4. O spuštění víš mezi prvními
- CTA: **Chci být u toho** (bílé tlačítko, modrý text)

### Panel „employer" — Sháníš brigádníky?
- Lead: *Zaregistruj se a buď mezi prvními 50 firmami.*
- Odrážky:
  1. [ bílá placka **30 % sleva** ] na předplatné na první rok
  2. Odznak „Zakládající partner" = víc důvěry u brigádníků
  3. Přednostní zobrazení inzerátů při startu
  4. Onboarding a pomoc s prvními inzeráty zdarma
- CTA: **Chci být u toho**

---

## 6. Odznak „Byl jsem u toho"

Unikátní **fialová placka** (`.wl-badge-chip--purple`) — světle fialový vnitřek
`#ece7ff`, fialový text `#7c3aed`, jemný fialový okraj, menší velikost.
Je **inline v první odrážce**, kousek odsazená doprava od popisu.

---

## 7. Formulářový panel (`.wl-panel`)

Otevře se po CTA s předvybranou rolí. Pole:

- **Jméno** (vždy)
- **Email** (vždy)
- **Název firmy nebo živnosti** (jen employer)
- **Telefon** (jen employer, povinný — firmám e-mail padá do spamu, oslovují se osobně)

Odeslání → zápis do Supabase:
```js
sb.from('waitlist').insert({ role, name, email, company_name, phone })
```

### Obrazovka „Jsi na seznamu! 🎉"
Po úspěšném odeslání. Obsahuje **odkaz na Instagram** `@makej.eu`
(`.wl-ig--done`) s jemnou nástupní animací — dřív byl na hlavní obrazovce,
teď se ukáže **až po registraci**.

---

## 8. Chování / stavy

- **Odpočet** tiká po sekundách do `new Date(2026, 9, 1)`.
- **Auto-otevření:**
  - `WL_DEV_ALWAYS = true` → vyskočí **vždy po refreshi** (jen pro vývoj).
  - `?wl` v URL → vynutí popup (cache neřeší).
  - jinak: jen jednou (localStorage `wl-joined` / sessionStorage `wl-dismissed`),
    přeskakuje přihlášené.
- **Zavření:** ✕ vpravo nahoře, klik na pozadí panelu, klávesa Esc.
- **Bez scrollu** na desktopu; na nízkých obrazovkách (`max-height: 700px`)
  se scroll povolí.

---

## 9. Zbývá dodělat (TODO)

1. **`WL_DEV_ALWAYS = false`** ve `script.js` **před ostrým spuštěním**
   (jinak by ho reální lidé viděli pořád dokola).
2. **Reálný social-proof počet** — spočítat přihlášky za 24 h z tabulky `waitlist`.
   Kvůli RLS (tabulka má jen INSERT policy) k tomu chce buď SELECT-count policy,
   nebo Postgres RPC funkci volatelnou pro `anon`. Věc pro Sama.
3. **Uvítací e-mail** po zápisu — přes ověřenou doménu `makej.eu`
   (SPF/DKIM/DMARC), aby nepadal do spamu. Věc pro Sama/DNS.

---

## 10. Databáze

Tabulka `public.waitlist` (vytvořena, ověřen anon INSERT → 201):

```sql
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('worker','employer')),
  name text not null,
  email text not null,
  company_name text,
  phone text,
  created_at timestamptz not null default now(),
  unique (email, role)
);
alter table public.waitlist enable row level security;
create policy "anyone can join waitlist"
  on public.waitlist for insert to anon, authenticated with check (true);
```
