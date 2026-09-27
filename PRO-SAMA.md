# Předávka pro Sama

> Co u nás (Yasin) přibylo a co z toho potřebuje něco udělat na tvé straně.
> **Novější nahoře, u všeho je datum** — co už máš nasazené, je označené.
> Podrobnosti k webu jsou v `STAV.md`, změny databáze v `DATABASE.md`
> (repo mobilní appky). Tenhle soubor je jen seznam k předání.

---

## 2026-09-25 až 27 — firemní dashboard (+ přihlášení na webu) — čeká na nasazení

> **Pro Samova Clauda:** tři dny práce hlavně na firemním dashboardu (`employer/`),
> k tomu přihlašovací okno a `?login=` na webu. Hodně bodů se během dní **přepsalo**
> (např. modré hlavičky → bílé, vyjíždějící menu → trvale otevřené s úchytem, ceník
> několikrát) — **platí výsledný stav** níž, chronologický seznam pod ním je pro
> dohledání detailů (hledej podle jmen funkcí/tříd, čísla řádků se u tebe liší).
> Naše `employer/` je jiná linie než tvoje živé `makej.eu/employer` — nejsnáz převzít
> celou složku `employer/` + `vendor/metal-fx/` + `vendor/thinking-orbs/`.

### Výsledný stav — co si vzít

- **Web:** `style.css?v=144`, `script.js?v=67`, `nahravani.css?v=7` na všech 10 stránkách. Přihlašovací okno ve stylu appky (blok „PŘIHLÁŠENÍ A REGISTRACE — ve stylu appky" na konci `style.css`, `#main-peeker` smazaný), `/?login=employer` otevře přihlášení (bod 20).
- **Dashboard – verze:** shell v52, dashboard v39, main v47, pages3 v94, supabase v10, firma v4 (nový soubor `employer-firma.jsx`), plans v4, analytics v31, orb.js v4; nové složky `employer/ikony/` (Iconly SVG) a `vendor/metal-fx/` (MIT + Apache NOTICE, **upravená** konstanta `qa` 66→16 ms, bod 90).
- **Vzhled:** bílé pozadí všude, hlavička záložky jen název + akce (`ETabHlava`, `EBtnHl`, `EBtnSek`, `EMetriky` v shellu), levé menu trvale otevřené s úchytem `.e-uchyt` (Skrýt/Vysunout), ikony Iconly, karta firmy dole s nabídkou (i v úzkém pruhu), kovový odznáček tarifu.
- **Funkce:** Profil firmy (samostatná záložka, fotky → Storage `uploads`), Inzeráty = kompaktní seznam + detail, zapnutí/pozastavení inzerátu **ukládá do DB** (`setJobActiveE`), skutečná zhlédnutí z `job_views`, Kandidáti filtrovaní podle inzerátu (`job_id`), šipka Zpět v prohlížeči mezi záložkami (`#inzeraty`, `#inzeraty/<id>` …), výběr období s kalendářem Od/Do.
- **Tarify:** návrh Cenik-v2 (4 karty + tmavý pruh Vlastní s kalkulačkou), kovové názvy a tlačítka (`TierMetalText`, `TierMetalButton`), srovnání funkcí v okně, okno volby tarifu se shrnutím a souhlasem s /terms + /privacy. **Bez „bez DPH"** (Makej není plátce DPH) — na webu `pro-zamestnavatele.html` je „bez DPH" pořád, sjednoť, pokud souhlasíš.
- **POZOR – platba není napojená:** „Pokračovat k platbě" (`handlePay` v `EPricing`) tarif jen přepne v prohlížeči. Stripe chybí (price ID, pk_test) — viz ODLOŽENO ve Stripe poznámkách.

### Databáze (Supabase) — co je potřeba u tebe

- **Spustit** `supabase/migration_profil_firmy.sql` (nové sloupce `profiles`: `cover_url, founded, career_url, phone, contact_email, opening_hours`). Bez nich Profil firmy uloží jen základní údaje a ohlásí, že zbytek nešel. Zapsáno i v `DATABASE.md` (repo appky).
- **Ověřit RLS na `job_views`:** firma musí smět číst řádky svých inzerátů (`select job_id … in (jobIds)`), jinak dashboard ukáže 0 zhlédnutí a v konzoli `job_views: …`.
- **Pozastavený inzerát** se ukládá jako `jobs.status = 'expired'` (CHECK zná jen active/filled/expired). Rozmyslet vlastní stav `paused`; noční `expire_past_jobs` znovu zapnutý inzerát po datu konání zase vypne.

### Chronologicky (detaily k dohledání)

19. **Dashboard: nečitelný prázdný stav a „Načítám data…"** — `employer-main.jsx` `EEmptyState` a `ELoadingSpinner` používaly `T.text / T.muted / T.mutedSoft / T.light` = BÍLÉ tokeny pro text na modré (`THEME_LIGHT` v `employer/app.jsx`), přitom stojí na světlé ploše obsahu → přepnuto na `T.cardText / cardMuted / cardMutedSoft / cardLight` (v tmavém režimu se přepnou správně). Ověřeno: barva nápisu rgb(10,10,26). `employer-main.jsx?v=36`
    - Pozn.: „rozbité ikony Recenze/Nastavení" z 24. 9. byl PLANÝ POPLACH — soubory jsou v pořádku, v testu lokální server shodil spojení (ERR_CONNECTION_RESET). 4× znovu načteno, 8/8 ikon OK
20. **Úvodka otevře přihlášení, když přijde `?login=…`** — dashboard posílá nepřihlášené na `/?login=employer`, ale nikdo parametr nečetl. `script.js` (za navázáním `heroLoginBtn`): `URLSearchParams` → `openModal('login')` + `history.replaceState` smaže parametr (obnovení okno znovu neotevře). Ověřeno: `/employer/` nepřihlášený → `/` s otevřeným oknem. `script.js?v=67`

21. **Větší orb na modré obrazovce dashboardu (64 → 104 px).** `employer/index.html`: `spustOrb(..., { size: 64, zobrazit: 104 })`, `orb.js?v=4`. Balíček thinking-orbs zná jen presety 20/32/64 (jiné `size` spadne v `resolvePreset` na „reading 'count'"), proto nový parametr `zobrazit` v `vendor/thinking-orbs/orb.js` a `orb-worker.js` (v=3): kreslí se podle presetu 64 a plátno se zvětší měřítkem (`meritko = dpr * zobrazit / size`) — vektor, zůstane ostrý.

22. **Texty na modré obrazovce jako v appce.** Nadpis „Nahráváme vaše údaje" větší (`.nahr-text` 1.75rem, League Spartan 700). Pod ním nové `#gate-pod` „Zabere to jen chvilku. Nezavírejte prosím okno." a po 10 s od kliknutí `#gate-dlouho` „Ještě to chvíli potrvá…" — 1:1 z appky (`www/index.html` `.load__t2`: Inter 14px/500, bílá .58, max 26ch). Třída `.nahr-pod` v `nahravani.css?v=7`. Při přesměrování nepřihlášeného a při chybě po 25 s se řádky schovají.

23. **Přihlašovací okno ve stylu appky.** Místo bílé karty s kukajícím Makačem a gradientovým logem je okno sytě modré jako přihlášení v appce (`#au-vitej`): bílý wordmark v League Spartan, průsvitná pole s bílým obrysem (radius 15, placeholder #C7D0FF), bílá pilulka „Přihlásit se", Google podle jeho pravidel (bílé, obrys #747775). Nový blok na konci `style.css` („PŘIHLÁŠENÍ A REGISTRACE — ve stylu appky"), `style.css?v=144` na 10 stránkách. Makač (`#main-peeker`) smazán z HTML všech stránek s oknem, `style="overflow:visible"` z `#login-modal` taky; JS peekeru v script.js se bez něj sám vypne (`if (!peeker) return`). Styl pokrývá i registraci a rozcestník rolí (inline barvy souhlasů přebité `!important`).

24. **Dashboard: schované tlačítko světlý/tmavý režim** (měsíc vedle loga v levém menu). `employer/employer-shell.jsx?v=28` — tlačítko nahrazené komentářem; tmavý režim se bude řešit později, přepínací logika `window.toggleMakejTheme` v `app.jsx` zůstala.

25. **Dashboard: logo „Makej" v League Spartan** (ostatní písmo zůstává Inter — Yasin: profesionálnější pro firmy). `ELogo` v `employer-shell.jsx?v=29` má třídu `e-logo` (900, 28 px, jako `.nav-logo` na webu); v `employer/index.html` výjimka `#root .e-logo { font-family: 'League Spartan' !important }` — jinak by ho přebilo plošné `#root * { Inter !important }`.

26. **Dashboard: po refreshi už žádné „Načítám data…" s kroužkem.** Příčina: modrá s orbem odcházela, jakmile se v `#root` cokoli vykreslilo — a to byla i mezinačítačka `ELoadingSpinner`. Když DB odpovídala přes 5 s (refresh), modrá zmizela a pod ní se točil kroužek. Teď `employer-main.jsx?v=37` po načtení dat (`loaded`) nastaví `window.__empDataNactena` a pošle událost `emp-data-nactena`; `hideGate()` v `employer/index.html` čeká na ni (MutationObserver pryč), min. 5 s zůstává, pojistka po 25 s taky. `ELoadingSpinner` vrací jen prázdnou plochu. Ověřeno se simulovanou 9s odpovědí DB: modrá drží do načtení, kroužek se neukáže.

27. **Dashboard: Tarify podle nového webového ceníku.** `employer-pages3.jsx?v=41` — `PLANS` (4 hlavní body každé karty = přesně web), Dynamický už má funkce (dřív „doplníme společně"), `FEATURE_ROWS` přestavěné z webu vč. „Zobrazit více" (uživatelé na profilu, Urgent 1×/2×/3×, oslovování 1/3/10/20/20+…; vypadly Full-time inzerce, HR integrace, SLA, account manager). Doplněná čtvrtletní sleva 5 %, poznámky jako na webu, poptávka na `podpora@makej.eu`, štítek „ušetři 15 %". `employer-plans.jsx?v=4`: `PLAN_LIMITS` podle nových limitů + nový tarif `dynamicky`, české názvy (zatím se nikde nevolá). Buňky, které web u vyššího tarifu výslovně neuvádí, jsou dopočítané kumulativně (vyšší tarif = vše z nižšího).

28. **Dashboard: záložky přestaly při přepínání poskakovat (sjednocení, krok 1).** Změřeno na všech 9 záložkách: rám začínal na 19 nebo 21 px, šířka 1138/1142 px (posuvník se objevoval a mizel), modrá hlavička 67/79/83 px, Inzeráty/Nastavení/Analytika měly max. šířku 1180 px a ostatní ne, Tarify vlastní lištu (ETopbar) bez rámu. Teď: kořen každé záložky má třídu `e-ram`, modrá hlavička `e-hlav`; v `employer/index.html` pravidla (jen ≥ 821 px, mobil beze změny) — okraj 20 px, max. šířka 1480 px, hlavička min. 84 px, `main { scrollbar-gutter: stable }`. Tarify (`EPricing`) zabalené do stejného rámu s modrou hlavičkou „Tarify", v `employer-main.jsx` pro ně už není ETopbar; při přepnutí záložky se `main` odroluje nahoru (`mainRef`). Po změně mají všechny záložky rám na stejném místě: x 277, y 21, šířka 1134, hlavička 84 px. Verze: dashboard v=27, pages3 v=42, main v=38, _premium/analytics v=28.

29. **Dashboard: v modré hlavičce už jen název záložky.** Pryč svislá čárka a podtitul za ní („30 dní · 1 aktivních inzerátů · …", „Správa a výkon vašich brigád…", „Firemní profil, notifikace a soukromí"…) na všech 8 záložkách, které ho měly — Yasin: „je to o ničem". Smazané dva `<span>` (čárka + text) v hlavičkách: `employer-dashboard.jsx?v=28`, `employer-pages3.jsx?v=43` (Zprávy, Tarify, Plán směn, Kandidáti, Inzeráty, Nastavení), `_premium/analytics.jsx?v=29`.

30. **Dashboard: jednotný přechod mezi záložkami.** Dřív se záložka jen tvrdě přepnula (data jsou načtená předem, nic se nedonačítá). Teď v `employer/index.html` `@keyframes eObsahIn` (+10 px zdola, průhlednost, .34 s) na strukturu `.e-ram > rám > [hlavička e-hlav, pás čísel, tělo]`: modrá hlavička i modrý pás stojí, najíždí obsah pásu, pak levý a pravý sloupec těla (zpoždění .02 / .07 / .13 / .18 s); celé do ~0,5 s, stejně na všech záložkách. Fill `backwards` (po doběhnutí žádný transform → nerozbije `position:fixed` oken uvnitř záložky); `prefers-reduced-motion` vypíná. Vlastní animace jednotlivých záložek (vyskakující karty tarifů, plnění pruhů u Inzerátů) zatím zůstaly.

31. **Dashboard: kovový odznáček tarifu v levém menu (čisté CSS).** Návrh Yasin („makej-tier-effects.css", varianta metal badge) — převzatá jen CSS verze `.mk-rim` / `.mk-rim-fill` s barvami přes `data-tier` (zakladni/vyhodny/dynamicky/maximalni/vlastni), BEZ knihovny metal-fx (WebGL, 140 kB, neveřejné API). CSS v `employer/index.html` (pro bílé menu přidaný jemný tmavý obrys a stín), komponenta `TierMetalBadge` v `employer-shell.jsx?v=30` nahrazuje v menu starý `TierBadge` a řádek „Tarif:"; klik na odznáček otevře Tarify. `_planToTier` vrací pro bezplatný tarif „Základní" místo „Zdarma". Starý `TierBadge` + jeho CSS zůstaly (jinde se nepoužívá — lze smazat).
   Doladěno podle ukázky „tekutého kovu": pilulka 26 px, písmo 14 px/700, světlý okraj bez tmavého pruhu dole (--mk-m1…m4 světlé odstíny), výplň se šikmými proužky světla a světlým jádrem vlevo, Výhodný výplň #3C41F2.
   **Pak na přání Yasina přepnuto na originální „tekutý kov" z metal-fx** (MIT © Jakub Antalik, shader Apache-2.0 Paper Design — LICENSE + NOTICE ve `vendor/metal-fx/`). `vendor/metal-fx/metal-fx.js` = dist/index.es.js 2.0.11 beze změny, jen první 2 importy (react, react/jsx-runtime) nahrazené globálním `window.React` (dashboard nemá build). Načítá `<script type="module">` hned za React UMD v `employer/index.html` → `window.MetalFxLib` + událost `metalfx-ready`. `TierMetalBadge` (`employer-shell.jsx?v=31`) kreslí `MkAutoBadge` (klon MetalBadge z návrhu, šířka podle textu); bez WebGL2 / před načtením CSS verze `.mk-rim`. Barva kovu i záře = CSS filtry `[data-tier] [data-cell="badge"] canvas` a `.metal-fx-glow-svg`. POZOR při aktualizaci metal-fx: `mask`/`glowMode` jsou neveřejné props.

32. **Dashboard: vyjíždějící levé menu s připínáčkem (jen počítač).** `ESidebar` v `employer-shell.jsx?v=32`: zavřené = pruh 72 px (logo „M", ikony, čísla v rohu ikon, linky místo nadpisů sekcí, dole iniciála firmy); najetím myší (nebo fokusem z klávesnice) se po 0,14 s rozbalí na 256 px a obsah se plynule odsune stejně jako při připnutí (Yasin: vysunutí přes obsah se nelíbilo), po odjetí se za 0,26 s zasune; text naskočí se zpožděním 0,08 s, při zavírání zmizí hned. Připínáček vedle loga nechá menu otevřené natrvalo (obsah vedle jako dřív), volba v `localStorage['emp-menu-pripnute']`; napoprvé připnuté. Mechanika: v řádku je obal, jehož šířka (72/256 px, animace .22 s) jde s menu. Mobil (`mobile`) beze změny — vysouvací panel přes hamburger.

33. **Dashboard: karta firmy dole v menu místo tarifu + tlačítka + patičky.** `employer-shell.jsx?v=34`: jedna klikací karta — logo (`EPROFILE.logo_url`, jinak iniciály na #0020F6), název firmy, pod ním kovový odznáček tarifu. Klik otevře menu nad kartou: Profil firmy (→ Nastavení), Tarif a platby (→ Tarify), Odhlásit se (šedě). Zavírá klik mimo / Esc / zasunutí menu. Pryč velké tlačítko „Spravovat tarif", řádek „Česká republika" a červená ikona odhlášení. Bez `company_name` v profilu stojí šedé „Doplňte název firmy" (dřív se ukazovalo jméno člověka). V `employer/index.html`: `#root button:focus:not(:focus-visible) { outline: none }` — pryč černý rámeček po kliknutí myší (připínáček), modrý obrys jen při ovládání klávesnicí.

34. **Dashboard: Firemní profil — fotka pozadí + logo s nahráváním (Nastavení).** `employer-pages3.jsx?v=44`, `ESettings`: nahoře nová karta „hlavička profilu" jako na firmy.cz — velká fotka pozadí (230 px, tlačítka Změnit/Odebrat) a přes ni čtvercové logo 112 px (klik = nahrát/změnit) + název a obor · adresa. Logo = `logo_url` (to se ukáže u inzerátů), fotka pozadí = NOVÝ `cover_url`. Nahrává se soubor (dřív jen vložení URL přes `window.prompt`): `uploadImageE` → bucket `uploads` (pozadí zmenšené na 2000 px, logo 600 px, fotky 1400 px). „Fotky firmy" (galerie, max. 8) taky přes soubor, každá s ✕. Pryč pole „Profilová fotka" (`avatar_url` se dál ukládá beze změny, v UI není). Náhled vpravo ukazuje pozadí i logo. Kontrola vyplnění: „fotku provozovny" nahradila „fotka pozadí".
   **DB (Sam):** `supabase/migration_cover_firmy.sql` — `alter table profiles add column if not exists cover_url text;` (zapsáno i v DATABASE.md appky). Dokud chybí, uložení zkusí znovu bez `cover_url` a firma dostane hlášku „Fotka pozadí se začne ukládat po úpravě databáze".
   **Zbývá v appce:** karty inzerátů teď u firmy ukazují jen iniciály (feed si `logo_url` vůbec nenačítá) a profil firmy (`WEmployerModal`) má nahoře modrý gradient — napojit `logo_url` a `cover_url`.

35. **Dashboard: Profil firmy jako samostatná záložka, Nastavení jen nastavení** (přepisuje bod 34). Nový soubor `employer/employer-firma.jsx?v=2` → `ECompanyProfile`, tab `'company'` v `employer-main.jsx?v=39`; otevírá se z karty firmy v levém menu („Profil firmy", karta je pak zvýrazněná) a tlačítkem „Profil firmy" v hlavičce Nastavení. Stránka vypadá jako profil: nahoře fotka pozadí 300 px (firma si na ni může dát i grafiku s názvem) + logo 132 px + název, obor · kraj · adresa, štítek ověření, průměr hodnocení. Vlevo O firmě (název, obor, popis do 1000 znaků), Fotky firmy (upload, max. 8), Pro nové brigádníky (`chat_rules`). Vpravo vyplněnost profilu, Údaje o firmě (IČO, založeno, kraj, adresa, web, kariéra, telefon, e-mail) upravované na místě jako řádky firmy.cz (`.e-pf-inp` v index.html, prázdné = „+ Doplnit"), Sociální sítě (+ YouTube), Otevírací doba (po–ne), Účet a tarif (kovový odznáček, inzeráty x/limit, přihlašovací e-mail, ověření, odhlásit). Uložení lištou „Máte neuložené změny" dole. Upload `uploadImageE` (pozadí 2400 px, logo 600, fotky 1400).
   Nastavení (`employer-pages3.jsx?v=45`): pryč sekce Firemní profil, modrý pás vyplněnosti, tmavá karta tarifu a Odhlásit z levého sloupce; začíná na Notifikacích.
   **DB (Sam):** `supabase/migration_profil_firmy.sql` (nahrazuje migration_cover_firmy.sql) — `profiles.cover_url, founded, career_url, phone, contact_email text, opening_hours jsonb`; ukládají se druhým `update` zvlášť, bez nich projde základ + hláška. Zapsáno v DATABASE.md appky.
   **Appka:** zatím neukazuje logo na kartách inzerátů ani fotku pozadí / kontakty / otevírací dobu v profilu firmy — napojit.
   **Přeskládáno (Yasin: „musím to týden scrollovat, abych potvrdil"):** `employer-firma.jsx?v=3` — levý sloupec O firmě → Fotky firmy → Otevírací doba (dva sloupce dnů místo 7 řádků) → Pro nové brigádníky; pravý vyplněnost → Účet a tarif (hned nahoře) → Údaje o firmě → Sociální sítě. Sloupce jsou teď zhruba stejně dlouhé. Uložení: při změně se v modré hlavičce objeví „Zahodit / Uložit změny" a zároveň plovoucí lišta pevně dole v okně (`position: fixed`), takže je vidět vždycky, ne až na konci stránky.

36. **Dashboard zjednodušený (náš vzhled, „jednoduchost jako Stripe").** `employer-dashboard.jsx?v=30` — `EDashboard` přepsaný: modrá hlavička a modrý pás zůstaly (jako všude), pás má jen 4 skutečná čísla (zájemci a najato za období z `E_JOBS[].candidates.matched_at`, aktivní inzeráty z limitu tarifu, hodnocení) bez grafíků a štítků. Pod ním JEDNA bílá plocha místo 7 karet: vlevo „Čeká na vás" (kandidáti od nejdéle čekajícího, „čeká X dny", Odpovědět; řádek s nepřečtenými zprávami) a „Inzeráty" (pozice, stav, zájemci, najato), vpravo za linkou „Poslední aktivita" a „Hodnocení". Pryč: vymyšlená zhlédnutí/swipe right (BASE_V/BASE_S), kanban Pipeline, ukázkový Plán směn. `employer-main.jsx?v=42`: firma bez inzerátů už nedostává `EEmptyState` („stáhněte aplikaci"), ale stejný Dashboard s prázdnými stavy. `employer-supabase.jsx?v=8`: `toCandidate` nese `createdAt`.

37. **Levé menu, zasunutý pruh: logo firmy na středu, pryč „rozmazaný stín".** `employer-shell.jsx?v=36`: neviditelný text karty firmy dřív pořád zabíral místo (jen `opacity: 0`), logo ujelo doleva a světle modrý podklad aktivní karty za ním vypadal jako rozbitý stín. V pruhu je teď text i šipka `display: none`, tlačítko bez podkladu a logo přesně na středu (ověřeno: střed loga = střed pruhu, 36 px); když je otevřený Profil firmy, logo má modrý rámeček.

38. **Levé menu: při vysouvání se nic neposouvá, jen odkrývá.** `employer-shell.jsx?v=37`: logo je v obou stavech stejná stavba „M" + „akej" (to se jen prolne) + „PRO FIRMY"; připínáček je pořád na místě, jen průhledný a neklikatelný v pruhu; u položek jsou dvě čísla na pevných místech (vpravo a malé v rohu ikony), která se prolnou; karta firmy má logo 3 px od okraje (= střed 72px pruhu) i v rozbaleném menu a text i kovový odznáček se jen odkryjí. Ověřeno měřením: pozice loga, všech 8 ikon i loga firmy jsou zavřené a otevřené na pixel stejné.
   Oprava: „akej" (vnořený `<span>`) spadlo pod plošné `#root * { Inter !important }` a bylo v jiném písmu než „M". V `employer/index.html` pravidlo rozšířené na `#root .e-logo, #root .e-logo * { League Spartan }` — ověřeno, obě části se kreslí League Spartan.

39. **Dashboard: jedno čistě bílé pozadí všude, pryč dvě svislé čáry u menu.** Dřív: stránka `#F1F3FB`, kořen appky `T.bg` (modrá s tečkami), rám záložky s vlastním odstínem a obrysem `#DDE1F0`, menu s čárou vpravo — vedle sebe dvě čáry a tři různé „bílé". Teď: `employer-main.jsx?v=43` kořen i `main` `#fff`; `employer-shell.jsx?v=38` menu bez `borderRight`; `employer/index.html` `.e-ram > div { background: #fff; border-color: transparent }` (rám splyne se stránkou, zůstane modrá hlavička a karty obsahu). Ověřeno na 7 záložkách, na hraně menu/obsah jen bílé pixely.

40. **Tarify v dashboardu = Samův ceník 1:1** (`employer-pages3.jsx` v48) — převzato z živého `pro-zamestnavatele` (#pricing, třídy .yp-*): Nejoblíbenější je Dynamický, roční ceny 424 / 1 700 / 4 249 s „ušetříš X Kč/rok", Maximální má 3 body, Vlastní = kalkulačka 20–5 000 inzerátů (stejný sazebník PASMA, množstevní sleva, mailto s počtem). Srovnávací tabulka má přesně řádky z webu. Pryč: karty slev (čtvrtletní/roční/upgrade), „Poznámky a pravidla", žárovka „Porovnání přímo pro tebe". Aktuální tarif firmy má modrý rámeček + štítek „Váš tarif". Pozor: lokální `cenik.html` je starší než živý web — zdrojem je `pro-zamestnavatele.html` na makej.eu.
41. **Hlavičky záložek bez modré** — nové společné komponenty v `employer-shell.jsx` (v40): `ETabHlava` (jen název + akce vpravo), `EBtnHl` / `EBtnSek`, `ESegment`, `EMetriky` (bílý pás čísel v rámečku; číslo, které někam vede, je celé klikací a má „Kam →"). Použito na všech 10 záložkách. Období má popisek „Období: 30 dní". Pryč vymyšlená / zavádějící čísla v pásech: Zprávy „Průměrná odezva 4 h", Recenze „reakční doba 1,4 dne", Inzeráty „zhlédnutí" a „CTR" (DB je neměří, vždy 0), Kandidáti „Odpracované směny u vaší firmy" (sčítalo směny u všech firem). Analytika: zámek se řídí `can('analytics')` (dřív hledal neexistující tarif „Pro", takže by ji neviděla ani firma s Dynamickým), zamčená obrazovka světlá s tlačítkem na Tarify, štítek v menu „od Dynamického".

42. **Inzeráty = kompaktní seznam, klik otevře plnou kartu** (`employer-pages3.jsx` v50, CSS `.e-jb-*` v `employer/index.html`). Řádek: tečka stavu, název, sazba · místo · zveřejněno, Stav, Zájemci, Čeká na vás (oranžově, když > 0), Najato, Běží do (oranžově posledních 7 dní), šipka. Ve „Vše" jsou skupiny Běží / Vypnuté / Naplněné. Klik → dosavadní velká karta (`karta(l)`) + „← Všechny inzeráty". „Čeká" se bere z `job.pending` podle id inzerátu (dřív podle názvu, takže dva inzeráty „test funkčnosti" se sčítaly dohromady). Z řazení vypadlo „Nejvíc zhlédnutí" (DB zhlédnutí neměří); „Nejnovější" řadí podle `created_at`.
43. **Inzeráty → „Aktivní inzeráty"**: odkaz na Tarify jen při plném limitu („Navýšit limit →"); jinak podtext „můžete zapnout ještě N" (u Vlastního „bez limitu").
44. **Karta inzerátu zjednodušená + skutečná zhlédnutí.** `employer-supabase.jsx` v9: `views` už není natvrdo 0 — počítá se z `job_views` (appka zapisuje 1× na brigádníka a inzerát, když mu karta vyjede ve feedu, `logJobViewW`), dotaz `select('job_id').in('job_id', jobIds)`. **Pro Sama: ověřit RLS na `job_views`** — firma musí smět číst řádky svých inzerátů; když nesmí, dashboard ukáže 0 a v konzoli `job_views: …`. `employer-pages3.jsx` v53: pryč „Denně" (průměr zhlédnutí/den, nesrozumitelné) a oranžový pruh „X kandidátů čeká"; místo něj malý štítek „N čeká" na tlačítku Kandidáti, rámeček karty už neoranžoví. „Prodloužit" je vedle čísla expirace (tlačítko pořád nic nedělá).
45. **Karta inzerátu: pryč duplicity a výplňový text** (`employer-pages3.jsx` v54): z hlavičky karty „zbývá X d" a „Aktivní do …" (totéž je v Expiraci), pod fází náboru věta typu „Kandidáti jsou ve hře…". Opraveno skloňování „1 zájemců" → 1 zájemce / 2–4 zájemci / 5+ zájemců.
46. Karta inzerátu: pryč „Fáze 3 ze 4" (je to vidět z pruhů).
47. Karta inzerátu: pryč zelená sazba vpravo v hlavičce (sazba je pod názvem).
48. **Zapnutí / pozastavení inzerátu přes štítek stavu + ukládání do DB.** V kartě inzerátu je štítek „AKTIVNÍ ▾ / NEAKTIVNÍ ▾" klikací → nabídka Aktivní / Neaktivní s vysvětlivkou. Pozastavení se zeptá („Inzerát zmizí z aplikace…, lidé se zájmem i zprávy zůstanou…"), zapnutí při plném limitu tarifu ukáže okno s „Navýšit limit". Tlačítko Vypnout/Zapnout z patičky pryč. Nová `setJobActiveE(jobId, zapnout)` v `employer-supabase.jsx` (v10) — DB `jobs.status` zná jen `active | filled | expired` (CHECK ve schema.sql) a feed appky bere jen `active`, takže pozastavený = `expired`. **Pro Sama:** (1) zda nechceme vlastní stav `paused` (rozšířit CHECK) — dnes se pozastavený nerozliší od prošlého; (2) noční úloha `expire_past_jobs` přepne znovu zapnutý inzerát po datu konání zpátky na `expired`. Detail inzerátu se pamatuje ve `window.__empJobDetail`, aby ho realtime refresh (tick) nezavřel; při změně záložky se maže (`employer-main.jsx` v44).
49. Štítek stavu bez šipky ▾ (vypadala jako tečka), nabídka jen „Aktivní / Neaktivní" bez popisků. Potvrzovací okno přes `ReactDOM.createPortal` do `<body>` s rozmazaným pozadím (backdrop-filter blur 6px) — dřív v rámu záložky, pozadí nepřekrylo celou stránku.
50. **Kandidáti z karty inzerátu = jen lidé na ten inzerát.** Tlačítko „Kandidáti (N)" v kartě nastaví `window.__empCandJob = job.id` a přepne na Kandidáty; ti se filtrují podle `job_id` (dřív panel „Podle inzerátu" podle názvu — stejné názvy se slévaly; u shodných názvů se teď připíše datum). Nahoře modrý pruh „Kandidáti na inzerát X · Zobrazit všechny kandidáty", pás čísel i rozdělení podle fáze počítají jen daný inzerát. Filtr přežije realtime refresh, maže se při odchodu ze záložky (`employer-main.jsx` v45). Počet na tlačítku = čekající + najatí (dřív všechny matche včetně odmítnutých, nesouhlasilo se seznamem).
51. **Ikony levého menu z mobilní appky** (Iconly Light-Outline, jako spodní lišta appky). Nová složka `employer/ikony/`: `inzeraty.svg` (Document = Práce), `kandidati.svg` (People = Lidé), `zpravy.svg` (Chat), `plan-smen.svg` (Calendar = `WIcoCalendar`), `profil.svg` (zatím nepoužitá). Kreslí se maskou (`_IKONY_APP` v `employer-shell.jsx` v41), aktivní `#0020F6`, jinak `#6B7280`. Dashboard, Analytika, Recenze, Nastavení zatím staré PNG — v appce obdoba není, čeká se na stejnou sadu z Iconly.
52. Dashboard v menu = Iconly Light-Outline / Home (`ikony/dashboard.svg`), shell v42.
53. Analytika v menu = Iconly Light-Outline / Chart (`ikony/analytika.svg`), shell v43.
54. Recenze v menu = Iconly Light-Outline / Star (`ikony/recenze.svg`), shell v44.
55. Nastavení v menu = Iconly Light-Outline / Setting (`ikony/nastaveni.svg`), shell v45 — celé levé menu je teď v jednom stylu (Iconly Light-Outline).
56. Oprava podbarvení vybrané položky v úzkém menu: na nižší obrazovce se v pruhu objevil posuvník (~10 px), položky se zúžily a ikona ujela z modrého čtverce. `aside.e-menu` má skrytý posuvník (`scrollbar-width:none` + `::-webkit-scrollbar`), rolovat jde dál. Ověřeno při výšce okna 640 px s viditelnými posuvníky: šířka posuvníku 0, ikona přesně uprostřed čtverce i pruhu (střed 36 px). Shell v46.
57. Seznam inzerátů: sloupce Zájemci / Čeká na vás / Najato — nadpis i číslo na střed (`.e-jb-cis`, tabulkové číslice), čísla obyčejně bez oranžového kolečka. Ověřeno: středy nadpisů a čísel v každém sloupci na pixel stejné. pages3 v64.
58. Seznam inzerátů: i sloupec Stav (nadpis + štítek) na střed. Ověřeno: střed nadpisu i všech štítků na stejném pixelu. pages3 v65.
59. **Šipka Zpět v prohlížeči přepíná záložky bez načítání.** Záložka je v adrese (`#inzeraty`, `#kandidati`, `#zpravy`, `#plan-smen`, `#recenze`, `#nastaveni`, `#profil-firmy`, `#tarify`, `#analytika`; Dashboard bez #), detail inzerátu `#inzeraty/<id>`. `employer-main.jsx` v46: `_TAB_HASH`, pushState při změně záložky, `popstate` → setTab; hash s `=` (návrat z přihlášení Supabase) se nechává být. `employer-pages3.jsx` v66: detail inzerátu pushState/popstate, „← Všechny inzeráty" = history.back(). Refresh nechá člověka na stejné záložce i detailu. Ověřeno: menu → detail → Kandidáti → Zpět ×3 → Vpřed, stránka se ani jednou nenačetla znovu.
60. Úzké menu: pryč krátké šedé linky místo nadpisů skupin (Přehled / Nábor / Firma), odděluje jen mezera. Shell v47.
61. Pás čísel (`EMetriky`): pryč modré odkazy „Kandidáti →" apod. Klikací políčko se pozná jen tím, že při najetí zešedne (`#F3F4F8`) a má kurzor ruky; kam vede, řekne bublina (title). Platí na všech záložkách. Shell v48.
62. Pás čísel: klikací políčko při najetí zmodrá (`#0020F6`), číslo bílé, popisek a podtext bílé na 78 % (jen CSS v `employer/index.html`).
63. Pás čísel: hover bez transition (barva pozadí a textu se prolínaly zvlášť → probliknutí), přepne se naráz.
64. **Levé menu natrvalo otevřené + úchyt jako Stripe.** Pryč rozbalování najetím myší i připínáček (Yasin: „bude se to sekat / někomu to bude vadit"). Vedle menu uprostřed výšky je svislá čárka (`.e-uchyt`, dvě 4×12 px čárky); při najetí se natočí do šipky ‹ a o 2 px „zatlačí", kliknutím se menu sbalí do pruhu 72 px (ikony), tam šipka › zase rozbalí. Obsah se plynule odsune. Volba v localStorage `emp-menu-pripnute` (stejný klíč jako dřív). Úchyt sedí přesně uprostřed mezery menu/obsah. Shell v49.
65. Úchyt menu (čárka i šipka) v modré Makej `#0020F6`.
66. Úchyt menu: v klidu šedá čárka `#C9CEDD`, při najetí modrá šipka `#0020F6` + tmavá bublina vpravo „Skrýt" / „Vysunout" (`.e-uchyt-tip`, jako Stripe), místo systémového title. Shell v50.
67. Bublina úchytu „Skrýt/Vysunout" modrá `#0020F6` s bílým textem.
68. **Výběr období „Vlastní" = klasický kalendář.** Místo tří vodorovných koleček (den/měsíc/rok) pro Od a Do je jeden měsíční kalendář (`ECalRange` v `employer-dashboard.jsx` v32): šipky ‹ › + roletky měsíc a rok, 1. klik začátek, 2. klik konec (dřívější se prohodí), rozsah podbarvený, náhled při najetí, budoucí dny nejdou, pod kalendářem „3. 9. 2026 – 12. 9. 2026" + Použít. `_eIso` teď místní datum (dřív `toISOString` → kolem půlnoci o den vedle). Ikona v tlačítku Období = náš Iconly kalendář (`ikony/plan-smen.svg`). Pryč `EWheel`, `EDateWheel`.
69. Roletka Období: položky při najetí ztmavnou (`.e-obd-vol:hover` #F1F3F8, vybraná o stupeň sytější #E2E7FF), tlačítko Období má hover jako ostatní bílá tlačítka. Dashboard v33.
70. **Období „Vlastní" = Od / Do.** Po kliknutí na Vlastní seznam (7/30/90 dní, Rok) zmizí a zůstanou jen dva řádky Od a Do s datem (+ „‹ Vlastní období" zpět na seznam). Klik na Od/Do rozbalí pod ním kalendář na jeden den (`ECalDen`: šipky, roletky měsíc/rok, rozsah podbarvený, Do nejde před Od, budoucí dny nejdou). Vybraný den se hned projeví v datech (bez Použít), roletka zůstane otevřená. `employer-main.jsx` v47: `EDashboard`/`EAnalytics` už nemají období v `key` (dřív se po změně záložka znovu připojila a roletka zavřela). Dashboard v34.
71. Období: pryč malé trojúhelníky ▾/▴ v tlačítku i u řádků Od/Do a šipka › u Vlastní. Dashboard v35.
72. Období: tlačítko i roletka mají pevnou šířku 236 px (`_E_OBD_SIRKA`) — při přepnutí 7 dní / 30 dní / Rok / vlastní datum se mění jen text, ikona stojí (ověřeno: x ikony stejné ve všech stavech, text se neořízne). Položky roletky nižší (34 px) a text na střed. Dashboard v36.
73. Období: tlačítko zúžené na 154 px pro 7/30/90 dní a Rok (dřív 236), pro vlastní datum 208 px; roletka stejně široká jako tlačítko (Od/Do 220). Dashboard v37.
74. Období „Vlastní": pryč horní řádek „‹ Vlastní období", zůstávají jen Od a Do (zpět na 7/30/90 dní = roletku zavřít a otevřít). Roletka Od/Do široká jako tlačítko (208), s kalendářem 258 (dřív 300) — menší dny 29 px, menší roletky měsíc/rok; nic nepřetéká. Dashboard v38.
75. Období „Vlastní": roletka Od/Do stejně široká jako tlačítko Období (154, u vlastního data 208), kompaktnější řádky; dole modré tlačítko **Potvrdit** — vybrané dny se do dat propíšou až jím (dřív hned po výběru). Dashboard v39.
76. **Karta firmy v úzkém menu je klikací.** Klik na logo v pruhu menu nerozbalí — nabídka vyskočí vedle loga přes obsah (portál do `<body>`, fixed): nahoře název firmy + tarif (pruh je neukazuje), pod tím Profil firmy / Tarif a platby / Odhlásit se. Zavře se výběrem položky, klikem mimo nebo Esc. Položky sdílí rozbalené i sbalené menu (`kartaPolozky`). Shell v51.
77. Seznam inzerátů roluje uvnitř svého rámečku (`.e-jb-scroll`, výška = zbytek okna pod filtry, min 300 px), hlavička sloupců přilepená nahoře. Stránka se nenatahuje — ověřeno s 200 inzeráty: seznam 544 px vysoký roluje, stránka nescrolluje, filtry a čísla zůstávají vidět. pages3 v67.
78. **Tarify na jednu obrazovku bez rolování.** Menší nadpis (26 px) a podtitulek, přepínač Měsíčně/Ročně s „chci šetřit" v jednom řádku, nižší karty (383 px, dřív 449; ceny 36 px), menší okraje. Volba tarifu (Zrušit / Zaplatit kartou) i „Tarif byl změněn" se otevírají v okně nad stránkou (portál, rozmazané pozadí), „Zobrazit srovnání funkcí" taky v okně s vlastním rolováním a přilepenou hlavičkou tabulky (✕ zavře). Ověřeno při výšce okna 900 / 780 / 720 px: stránka nescrolluje, spodek obsahu 657 px. pages3 v68.
79. Tarify v dashboardu: „za měsíc bez DPH" → „za měsíc" (Makej není plátce DPH, cena je konečná). **Pro Sama:** na webu (`pro-zamestnavatele.html`) je pořád „bez DPH" — sjednotit, pokud souhlasí.
80. **Tarify v2 podle Yasinova návrhu `Cenik-v2`.** 4 bílé karty (pro koho · název · popis · cena · tlačítko · „Obsahuje:" / „Vše z X, a navíc:" + fajfky/pomlčky), Dynamický zvýrazněný modrým rámem + štítek „Nejoblíbenější" nad kartou, „Váš tarif" štítek z dat firmy + tlačítko Aktuální tarif. Přepínač Měsíčně/Ročně jako segment s „−15 %", výchozí Ročně; řádek úspory „Ušetříte X Kč ročně" (zeleně) / „Ročně ušetříte X Kč" (šedě). Pod kartami tmavý pruh Vlastní: posuvník počtu inzerátů (kroky jako web 20–5 000) + cena ze sazebníku, mailto s počtem. Patička „Zobrazit srovnání funkcí · Tarif můžete kdykoli změnit." Zůstává: dopočítávání cen (`CenikCislo`), okno volby tarifu a okno srovnání. Písmo Inter a modrá `#0020F6` (návrh měl Figtree / `#1631E6`), bez DPH. Kompaktní — vejde se bez rolování od výšky okna ~770 px. Pryč stará `CenikKalkulacka` + pomocníci. pages3 v71.
81. Tarify: pryč hlavička záložky „Tarify"; „Vyber si svůj plán" + podtitul na střed (28 px), přepínač Měsíčně/Ročně pod nimi na střed. Pořád se vejde bez rolování od ~780 px výšky okna. pages3 v72.
82. Tarify: v přepínači „Ročně" → „Ušetřit s ročním" (+ −15 %). pages3 v73.
83. **Efekty tarifů – nová verze (Yasin 27. 9., makej-tier-effects.css + MakejTierEffects.tsx).** `employer/index.html`: CSS nahrazené novou verzí (přelévavý text `.mk-grad`, barvy kovu pro plátna text/odznáček/tlačítko, CSS náhrady `.mk-sheen`, `.mk-rim` 22 px, `.mk-rim--btn`, nové barvy okraje). `employer-shell.jsx` v52: `_MK_TIER` z nového TIERS (hex/label/sheen), odznáček s `disableGlow` (bez vnější záře), nové `TierMetalText` (název tarifu jako tekutý kov; na bílém hlavní barva tarifu, na tmavém světlý odstín), `TierGradientText`, `TierMetalButton` (kovové tlačítko, volitelně přes celou šířku). Ceník (pages3 v74): názvy tarifů = `TierMetalText`, tlačítka „Začít zdarma / Vybrat …" = `TierMetalButton` v barvě tarifu; Vlastní na tmavém pruhu světlým odstínem. Ověřeno s WebGL2: kov se kreslí (plátna), tlačítka 219×38, klik otevře okno volby tarifu, stránka dál bez rolování.
84. Ceník: kovová tlačítka „Začít zdarma / Vybrat …" jako v návrhu — pilulka podle textu, na střed karty (dřív roztažená přes celou šířku → kov se natáhl a vypadal jako pozadí za tlačítkem). pages3 v75.
85. Ceník: přepínač fakturace jako na Yasinově ukázce — text „Ušetřete s ročním" + vypínač (zapnuto = roční, modrá `#0020F6`, bílý puntík), klik na text přepíná taky. Pryč segment Měsíčně / Ročně a štítek −15 %. pages3 v76.
86. Ceník: řádek úspory jen při roční platbě („Ušetříte X Kč ročně"); při měsíční prázdný (místo drží, karta neposkočí). pages3 v77.
87. Ceník: pryč podtitul „Bez závazků. Zrušení kdykoliv.". pages3 v78.
88. Ceník: přepínač vrácen na segment „Měsíčně | Ušetřit s ročním −15 %" (vypínač z bodu 85 se nelíbil). pages3 v79.
89. **Srovnání funkcí podle návrhu Cenik-v2.** Okno 1200 px: nadpis + „Ceny při ročním / měsíčním placení" podle přepínače, ✕ 40×40 (zavře i klik vedle a Esc). Přilepené záhlaví 5 sloupců: štítek (Váš tarif z dat / Nejoblíbenější), název, cena podle přepínače (Vlastní „od 9 999 Kč / měs"), tlačítko (Začít zdarma / Aktuální tarif / Vybrat modré u Dynamického / Vybrat / Poptávka = mailto s počtem z posuvníku). Sloupec Dynamický podbarvený `#F5F7FF`, sekce bez šedého pruhu, řádky s hover, fajfka/pomlčka jako v kartách. Řádky tabulky = naše FEATURE_ROWS ze Samova webu (návrh měl sekci Data a reporting jen odhadem). „Vybrat" zavře srovnání a otevře okno volby tarifu. pages3 v80.
90. **Plynulá animace kovu (metal-fx).** Knihovna schválně překreslovala kov jen každých 66 ms (~15 snímků/s, konstanta `qa` v hlavní smyčce) → lesk na názvech tarifů, tlačítkách i odznáčku vypadal sekaně. Ve vendorované kopii `vendor/metal-fx/metal-fx.js` změněno na 16 ms (~60 snímků/s), s komentářem „Makej úprava"; import v `employer/index.html` ?v=2. Ověřeno: plátno tlačítka se mění každý snímek (121 změn za 2 s). Pozor při aktualizaci metal-fx — úpravu zopakovat.
91. Ceník: „Aktuální tarif" (karta i srovnání) ve stylu štítku „Váš tarif" — světle modrá pilulka `#EEF1FF`, rámeček `#D6DCFF`, modrý text; v kartě stejně vysoká (38 px) a na střed jako kovová tlačítka. pages3 v81.
92. Srovnání funkcí: názvy tarifů v záhlaví sloupců jako kovový text v barvě tarifu (`TierMetalText`, 16 px), stejně jako v kartách. pages3 v82.
93. Srovnání funkcí: pryč podbarvení sloupce Dynamický. pages3 v83.
94. Srovnání funkcí: vlevo nahoře v přilepeném záhlaví přepínač Měsíčně / Ročně −15 % (menší verze stejného přepínače jako na stránce, sdílí stav) — ceny ve sloupcích i podtitul „Ceny při … placení" se přepnou hned. pages3 v84.
95. Ceník: štítek „Váš tarif" nad kartou na střed (jako „Nejoblíbenější"); je-li tarif firmy zároveň nejoblíbenější, ukáže se jen „Váš tarif". pages3 v85.
96. Ceník: karty mají v klidu všechny šedý rámeček (Dynamický už ne trvale modrý). Při najetí se rámeček plynule přebarví na barvu tarifu (stejná jako kovový název: šedá / modrá / zelená / oranžová), zesílí se vnitřní linkou (nic neposkočí), jemná záře ve stejné barvě a karta se zvedne o 2 px. pages3 v86.
97. **Okno volby tarifu – návrh (27. 9.).** Místo holého „Dynamický — 1 700 Kč / měsíc + Zrušit / Zaplatit kartou": nahoře „Přechod na vyšší/nižší tarif", kovový název tarifu (26 px), „pro koho · místo tarifu X", ✕. Šedý box s přepínačem Měsíčně/Ročně −15 %, cena (dopočítává se), „Zaplatíte 20 400 Kč jednou za rok · ušetříte 3 600 Kč" / „Platí se každý měsíc". „Co získáte:" (fajfky) nebo u nižšího „O co přijdete:" (pomlčky). Řádek kdy změna platí (vyšší hned, nižší od dalšího období). Tlačítka Zrušit / Pokračovat k platbě (modré), pod nimi „Platba kartou · bez závazků · nejsme plátci DPH". Po potvrzení zelená fajfka + „Váš tarif je teď [kovový název]". Platba pořád NENÍ napojená (Stripe) — `handlePay` tarif jen přepne v prohlížeči. pages3 v87.
98. Okno volby tarifu: nahoře místo „Přechod na vyšší tarif" + názvu varianta „metal text" z makej-tier-effects — šedé „Tarif" (chytá odlesk kovu) + kovový název tarifu, 26 px. pages3 v88.
99. Okno volby tarifu: pryč řádek „Aktivně hledám · místo tarifu Výhodný". pages3 v89.
100. Okno volby tarifu: pryč „Zrušit", dole jen „Pokračovat k platbě" přes celou šířku (zavírá ✕ nahoře, klik vedle). pages3 v90.
101. Okno volby tarifu: dole místo „Platba kartou · bez závazků…" právní dovětek s odkazy (nová karta): „Pokračováním k platbě souhlasíte s obchodními podmínkami (/terms) a berete na vědomí zásady ochrany osobních údajů (/privacy). Předplatné se automaticky obnovuje každý měsíc/rok, zrušit ho můžete kdykoli." U přechodu na Základní jen souhlas s podmínkami. Obchodní podmínky čl. 6–7 už pokrývají platby přes bránu, automatické obnovení, zrušení a odstoupení (spotřebitel 14 dní / firma s IČO ne). pages3 v91.
102. Okno volby tarifu: právní dovětek jednotný pro všechny tarify i měsíčně/ročně: „Pokračováním souhlasíte s obchodními podmínkami a berete na vědomí zásady ochrany osobních údajů. Placené tarify se automaticky obnovují a zrušit je můžete kdykoli." pages3 v92.
103. Okno volby tarifu: z dovětku pryč věta o automatickém obnovení (je v obchodních podmínkách, čl. 7 Předplatné). pages3 v93.
104. Okno volby tarifu: u vyššího tarifu pryč „Změna platí hned po zaplacení."; u nižšího zůstává „Změna platí od dalšího fakturačního období…". pages3 v94.

---

## 2026-09-24 — čeká na nasazení

> **Pro Samova Clauda:** náš web se od 11. 9. rozešel s tvým. V tomhle pushi je
> **srovnaný s tvým stavem k 23. 9.** (tvé texty, ceník, o nás, blog, patička) a navrch
> jsou naše nové změny. Níž je rozdělené na **co si vzít od nás** a **co jsme vzali od
> tebe** (to zpátky nepřenášej). U každé položky jsou jména funkcí a tříd — hledej podle
> nich, čísla řádků se u tebe liší. Web: `style.css?v=143`, `script.js?v=66`.

### Web — vezmi si od nás

**1. Úvodka: modrý pruh s telefonem místo celoobrazovkové scény `.uk`.**
`index.html`: sekce `<section class="uk" id="ukazka">` („Brigáda na pár swajpů.")
je pryč, na jejím místě `<section class="vx-close vx-close--foto">` (text vlevo,
`hsp-mockup.webp` vpravo, tlačítko `.worker-cta-register`). Je to ten pruh, co máš
na `/hledam-si-praci` — **tam ho smaž a přesuň na úvodku.** Styly pruhu jsou schválně
v inline `<style>` úvodky, ne ve `style.css`: `/lide` má vlastní `.vx-close` a globální
`.vx-close .vx-btn` by se mu přimíchalo. Ze `style.css` smazán celý blok „UKÁZKA
APPKY — celoobrazovková modrá scéna" (`.uk`, `.uk-head`, `.uk-btn`, `.uk-foto`).
Text pruhu je zatím tvůj („Staň se Makačem ještě dnes") — s Yasinem ho přepisujeme.

**2. Bílé tlačítko v modrém pruhu na najetí zmodralo a zmizelo.**
`.vx-close .vx-btn:hover` (úvodka, `/pro-zamestnavatele`): místo `background:#0020f6;
color:#fff` je `background:#F4F6FF`, text zůstává modrý. Na `/lide` totéž přes nové
`.vx-close .vx-btn-dark:hover` — v pruhu je bílé `.vx-btn-dark` a sdílený hover ho barvil.

**3. `/hledam-si-praci`: pryč kroky s fotkami a opakující se odstavec.**
Celá sekce `#how-it-works` (3 karty `.bolt-row` s `krok-1..3.jpg` + `.bolt-cta
a.cta-morph`) smazaná i se styly (`.bolt-*`, `#how-it-works …`, `.hsp-gal-word`,
`ctaMorphPop`), `<link rel="preload">` na `krok-*.jpg` a inline skriptem „CTA morph".
V `.vx-intro` zůstal jen nadpis „Práce i přivýdělek za pár swajpů", odstavec „Konec
zdlouhavého proklikávání…" pryč. **`script.js` → `setupNavDropdowns()`:** z menu
`hledam-si-praci` vyndaná položka `Jak to funguje → #how-it-works` (vedla by do prázdna).
Podnadpis hera `.eh-sub`: „Brigády, part-time i stálá práce na jednom místě.<br>Najdi si
práci, která ti sedí." + třída `.eh-sub--vyvazene { text-wrap: balance }` a `&nbsp;`
v „jednom&nbsp;místě" / „ti&nbsp;sedí" — na telefonu jinak zbylo „místě." samo na řádku.

**4. `/lide`: nová fotka hera — pět lidí.** `lide-hero-tym.webp` (1536×1010, 192 kB,
průhledné pozadí). Je **na šířku** (stará byla na výšku), takže `.vx-heroimg` má novou
šířku počítanou na stejnou výšku postav: `min(842px, 92vw, calc(var(--hero-h)*.88))`,
v `@media (max-width: 900px)` `min(842px, 96vw, …)`. Na telefonu je **samostatný**
`@media (max-width: 600px) { .vx-heroimg { max-width:none; width: min(150vw, …*.74) } }` —
krajní dva přesahují a `.vx-frame` je ořízne. ⚠️ Ten blok nevkládej doprostřed bloku
900px, rozbiješ tím tablety. Na `/lide` je u nás i novější sekce „Dvě cesty" s telefony
(náš commit `580d73f`) — tu jsi taky ještě nepřevzal.

**5. Čárky pod nadpisem hera (je to i na živém webu).** `style.css` `@keyframes
heroLineUp`: start `translateY(120%)` → **`160%`**, stejně výchozí `transform` u
`.vx-line-in` a `.eh-line-in` (`/lide`, `/hledam-si-praci`, `/pro-zamestnavatele`).
`.vx-line`/`.eh-line` má `padding-bottom:.3em` na ocásky j/p, okno bylo vyšší než posun
a tučné písmo vystrkuje špičky (N, d, l, tečky) nad svůj box — během prodlevy před
animací koukaly zpod masky jako řada čárek. Ověřeno zmrazením animace: 7–13 px zbytků → 0.

**6. Aurora se hýbe, jen když je vidět.** `script.js` na konci `auroraJenVObraze()`
(IntersectionObserver, přidává `.aurora--stoji`, sbírá znovu po `load`) + ve `style.css`
`.aurora--stoji i { animation-play-state: paused; }`. Skvrny měly nekonečnou animaci
i mimo obraz a mléčné sklo čekacího listu (`backdrop-filter`) nad nimi se přepočítávalo
každý snímek.

**7. „Vytvořit účet" na podstránkách.** `goToEmailSignup()` hledá `#brzy` **nebo**
`#download.cl-sekce` — tvoje verze znala jen `#brzy`, takže z podstránek posílala
člověka na úvodku, i když měl čekací list přímo pod sebou.

**8. Přihlášení firmy → modrá obrazovka „Nahráváme vaše údaje" → dashboard.**
Dřív po přihlášení firmy 2–4,5 s prázdná tmavá plocha: dashboard se v prohlížeči
překládá (12 JSX, 784 kB) a `#auth-gate` se schoval hned po ověření session.
Nově: web — modrá se rozlije `clip-path: circle()` od tlačítka „Přihlásit se",
**jen modrá**, bez orbu a textu (`script.js` → `prechodDoDashboardu(cil)`, volá se
místo přímého přesměrování u role employer i při kliku na `a[href="/employer/"]`,
po 0,85 s `location.href`). Dashboard začíná na stejné modré, naskočí orb
(thinking-orbs, stav `connecting`, 64 px) a „Nahráváme vaše údaje" (League Spartan
700, bez teček). Modrá odejde, až je dashboard vykreslený, **nejdřív 5 s od kliknutí**
(`sessionStorage['makej-nahr-od']`), a dashboard se jemně přiblíží (`#root.nahr-dovnitr`).
- **Nové soubory:** `nahravani.css` (vzhled sdílený webem i dashboardem, z-index
  2147483600 — nad cookie lištou), `vendor/thinking-orbs/` = balíček thinking-orbs
  0.3.2, **licence MIT (© Jakub Antalik) — `LICENSE` musí zůstat vedle kódu**, jen
  engine (`engine.es.js` + `index-B8WsUNf5.js`, bez závislostí) a naše `orb.js`
  (`spustOrb(canvas, {state, size})`) + `orb-worker.js`. React komponenta
  `<ThinkingOrb>` nejde — web ani zámek dashboardu React nemají.
- **Proč worker a dvě plátna:** překlad dashboardu blokuje hlavní vlákno a orb by
  zamrzl (změřeno při 2,5 s blokaci: hlavní vlákno 1 snímek / mezera 2 502 ms,
  worker 150 snímků / max 18 ms). `orb.js` nakreslí první snímek hned na hlavním
  vlákně, worker (OffscreenCanvas) startuje na druhém plátně a po prvním snímku
  převezme (`{hotovo:true}`) — start workeru trvá 100–300 ms a orb by mezitím chyběl.
  Bílé tečky: `paintFrame(ctx, frame, false, {r:255,g:255,b:255})` — originální
  `dark:true` ztmavuje vzdálené tečky k černé a na modré vypadají šedě.
- ⚠️ **`employer/index.html` — hlavní příčina „zasekne se a stránka jakoby problikne":**
  v `<head>` bylo 5 blokujících skriptů z CDN (iconify, supabase-js, React, ReactDOM,
  Babel 3 MB) + blokující Google Fonts, takže se nic nesmělo vykreslit, dokud se
  nestáhly. Skripty jsou teď v `<body>` **až za `#auth-gate`** (pořadí zachované,
  před skriptem přihlášení, který potřebuje `supabase`), Google Fonts `preload` +
  `media="print" onload`, `modulepreload` na orb, orb `<script type="module" async
  blocking="render">`, font League Spartan z `/fonts/` s `preload` a
  `font-display: block`. První vykreslení 760 → 120 ms. `hideGate()` čeká přes
  MutationObserver na obsah `#root`; pojistka 25 s → „Načítání trvá déle, než by
  mělo." + „Zkusit znovu". Staré `.gate-card/.gate-logo/.gate-spin` smazané.
- Ověřeno celou cestou (falešná session firmy, dotazy do DB vypnuté): 0,9 s dashboard
  s orbem → 2,8 s dashboard hotový pod modrou → 5,1 s modrá odchází, 0 chyb JS.
  Web: `script.js?v=66`, `nahravani.css?v=6`, `orb.js?v=3`, `orb-worker.js?v=2`.
- Známé chyby dashboardu (zatím neopraveno, pokračujeme): na prázdném dashboardu bílý
  nápis „Zatím žádné inzeráty" na světlém pozadí; rozbité ikony „Recenze" a
  „Nastavení" v menu; úvodka nečte `/?login=employer` (přihlašovací okno se samo neotevře).

### Web — vzali jsme od tebe (zpátky nepřenášej)
- Textové úpravy z tvých `132c9b0`, `4d8d68d`, `90ea872`, `9e00e7d`, `df5e0fc`,
  `97daae0` (podpora@makej.eu, „makač"/„práce", bez „bez životopisu", Makačky pryč,
  odstoupení od smlouvy, tarify v `#pricing`) — jen kde u nás stál přesně stejný text.
- Celé soubory: `cenik.html`, `o-nas.html`, `blog/*.html`, `sitemap.xml`;
  `pruvodce.html` smazaná jako u tebe.
- Patička na všech stránkách: „Kontakt" → `/o-nas#kontakt`, řádek s IČO.
- Čekací list místo karty s obchody na podstránkách (`.cl-sekce`) + tvůj jezdící pruh
  důvodů na `/hledam-si-praci` (`.proc-pas`, `pruhyJedou()` 1:1, zastaví se pod myší).
- Kontrola: skript porovnal všechen viditelný text, `alt`, `title`, `meta` a `mailto`
  na 12 stránkách s tvým webem — shoda, rozdíly jen záměrné (body výš).

### Na rozhodnutí / k opravě u tebe
- **Stripe:** na webu je Výhodný za **499 Kč** (správně), ve Stripu je produkt „Výhodný"
  za **2 000 Kč** — to je cena Dynamického.
- **Modály registrace:** na `/podpora` a `/pro-zamestnavatele` máš „Makač / Hledám
  makače", jinde „Brigádník / Hledám brigádníky". Převzal jsem 1:1, sjednoť u sebe.
- Na `/pro-zamestnavatele` máš jezdící pruh důvodů, u nás je tam pořád mřížka.
- Tvoje novější fotky `krok-1..3.jpg` jsme nebrali — sekce kroků je u nás pryč (bod 3).

### Appka (`makej-aplikace`, `www/`) — vezmi si od nás
Verze: `app.jsx?v=35`, `worker-profile.jsx?v=54`, `worker-main.jsx?v=50`.

**A. Věkový limit 15 let.** `app.jsx`: `W_MIN_VEK = 15`, `wVekZDatumu()`, `wVekStaci()`,
roletka `WVekStop` („Omlouváme se, ještě si musíš počkat" + za kolik let se vrátit).
Chytá se na dvou místech: po „Potvrdit" ve výběru data (`worker-profile.jsx`) a u „Mám
zájem" (`worker-main.jsx`, `onChybiVek`: bez data → `WVekRoletka`, pod 15 → `WVekStop`;
`_wZnameVek()` smazán). Proč 15: § 35 obč. zák. — 15 let **a** ukončená povinná
docházka. Flexinovela od 6/2025 pouští 14+ jen o prázdninách se souhlasem rodiče, to
appka neohlídá. Ukončenou docházku neřešíme (15letý v 9. třídě projde).

**B. Datum narození je zákonná brána, ne průvodce.** Návod (`WNavod`) k datu má jen
„Doplň datum narození / Vyber datum a klepni na Potvrdit." a „Zatím ne" (props
`preskocitText`, `bezOtazky`) — žádné tečky ani „Přeskočit".

**C. Klepnutí vedle nic nezavírá, dokud běží návod.** `WNavod` drží počítadlo
`window.__wNavodBezi`; `WDatumPicker` a `WVyberPicker` ho čtou v posluchači klepnutí
mimo. `WDatumPicker` má nové props `zamceno` (řádek výběr jen otevírá — `prepni()`)
a `onPotvrdit(datum)`; `zmen()` vrací datum. Dřív výběr zavřelo i klepnutí vedle
a s ním skončil celý návod.

**D. Dobrovolný průvodce profilem** (zatím jeden krok: telefon). `worker-profile.jsx`:
`tourBezi`, `tourKrok`, `spustTour()` (naváže po potvrzení data), `najedNa()`. `WNavod`
umí `krok` / `kroku` (tečky, jen když je kroků víc) a `akce` (tlačítko „Hotovo",
svítí až při 9+ číslicích — SMS ověření zatím neexistuje). „Přeskočit" se ptá podruhé
v bublině („Opravdu chceš průvodce přeskočit?", stav `ptamSe`).

**E. Klávesnice nepřekryje pole s telefonem.** `app.jsx`: `wDoZorneho()`,
`wDrzVZornem()` — pole se srovná na střed `visualViewport` (plocha nad klávesnicí)
a přepočítá se, jak klávesnice vyjíždí. `WNavod` překlápí bublinu podle viditelné
plochy (`vidu`, `mistoNad` / `mistoPod`).

**F.** Pod „Osobní údaje" v profilu pryč věta „Firmy vidí jméno a první písmeno příjmení…".

## 2026-09-13 — čeká na nasazení

**Hero na `/lide`: skutečná fotka místo 3D kresby.**
`lide-hero-v2.png` (1,1 MB) smazán, nahradila ho `lide-hero-foto.webp` (259 kB)
— trojice brigádníků, jeden v tričku Makej. Animace vyjetí zdola i všechno
ostatní zůstalo, měnil se jen obrázek a jeho velikost. Fotka přišla už
odpozaděná z Photoroomu; ruční odmazávání bílé dávalo horší hrany, tak se
**fotky do hera posílají rovnou s průhledným pozadím**.

**Kroky náboru na `/pro-zamestnavatele` jsou skutečné fotky.**
Všechny čtyři (`emp-krok-1..4.jpg`) vyměněné za fotky od Yasina — dashboard na
notebooku, brigádníci s appkou, domluva na kampusu. Oříznuté na **stejný poměr
jako dřív (1100×513)**, aby se mřížka nepohnula; výřez vedený přes obličeje, ne
přes střed fotky. Popisky `alt` přepsané, staré mluvily o něčem jiném.
Ilustrace u „Chat místo emailů" vyměněna za plavčíka (`emp-chat.webp`).
Čísla `?v=` u obrázků zvýšena na 3 — **bez toho by vracející se návštěvník
viděl staré**.

## 2026-09-11 — čeká na nasazení

**Sekce „Proč" jsou nově pruh ilustrací (vzor bolt.eu), ne textové boxy.**
Na `/hledam-si-praci` („Proč si zvolíš Makej", šest důvodů) je vodorovný pruh
s přichytáváním — poslední položka je u kraje schválně useknutá, aby bylo
poznat, že se dá jet dál. Na `/pro-zamestnavatele` („Proč Makej", čtyři důvody)
je mřížka bez posouvání, protože se vejdou na jednu řadu. Obojí sdílí `.proc-pruh`
ve `style.css`, liší se jen třídou `--mrizka`. Texty zůstaly beze změny.

⚠️ **Když se vymění ilustrace, musí projít stejným srovnáním.** Všechny jsou
oříznuté na skutečný objekt a vsazené do stejného plátna 760×620 tak, aby
zabíraly zhruba stejnou **plochu** (ne šířku). Bez toho bude nová v řadě
viditelně menší nebo větší — čtyři původní si nesly širokou průhlednou zář
a kvůli ní vypadaly o polovinu menší. Postup je v komentáři u `.proc-bod img`.

**Vyhlazené předěly mezi sekcemi.** Skok z bílé na plátno `#F5F6FA` je jen deset
jednotek, ale přes celou šířku se rýsoval jako linka. Horní hrana se teď
rozplyne u `#features` (/hledam-si-praci), `.vx-gallery` (/lide), `#makaci`
(hlavní strana) a u `#download` tam, kde bílá opravdu předchází — **třídu
`pl-z-bile` nedávej na / ani /lide**, tam nad ní stojí taky plátno a vznikl by
světlý pruh uprostřed plochy. Aurora v heru se navíc dole vytrácí.

`style.css?v=133`.

## 2026-09-10 — čeká na nasazení

**1. Oprava rozbitého čekacího listu (naléhavé).**
Změnil jsi obsah `script.js`, ale v HTML nechal `script.js?v=51`. Vracející se
návštěvník má proto v prohlížeči **starý skript k nové stránce**. Ten sahá na
`wl-ico-box`, který jsi z HTML odstranil → `TypeError: Cannot set properties of
null` v `cekaciList()` → přeruší se navěšení obsluhy formuláře → e-mail se
neuloží a stránka se jen přenačte. Ověřeno v prohlížeči, není to teorie.
→ **Opraveno u nás: `script.js?v=52` na všech stránkách.** Stačí vzít a nasadit.

**2. Čekací list — převzali jsme tvoji verzi, nic ti nepřepisujeme.**
`index.html` a `script.js` jsme vzali z produkce jako základ. Tvůj rozcestník
rolí i odebraný přepínač fyzická/právnická zůstávají přesně jak jsi je udělal.
Dohoda platí: v předregistraci se role neřeší, vybírá se až v onboardingu appky.

**4. Kroky na /hledam-si-praci jsou nově karty (vzor bolt.eu).**
Text je nahoře jako normální HTML, fotka dosedá na spodní hranu karty.
Pozadí karty **není plná barva, ale vodorovný přechod odečtený z horní hrany
její fotky** — proti jedné barvě se na napojení rýsoval světlý předěl, protože
studiové pozadí není přes celou šířku stejné. **Když se fotky vymění, musí se
přegenerovat i ty přechody** (postup je popsaný v komentáři v CSS).
Velké slovo BRIGÁDA v pozadí je v téhle sekci vypnuté — mezi plnými kartami
z něj koukaly jen útržky.

**5. Skutečné fotky místo vygenerovaných na /hledam-si-praci.**
Tři kroky (Swajpni / Matchni / Pracuj) mají nově fotky od Yasina —
`krok-1.jpg`, `krok-2.jpg`, `krok-3.jpg`. **Staré `krok-1.png`, `krok-2.png`
a `krok-3.png` smaž**, už na ně nic neodkazuje. Zároveň ubylo 1,6 MB: PNG měly
dohromady 1 895 kB, nové JPEG mají 259 kB.
Opravil jsem i `lide.html`, kde `<link rel="preload">` mířil na `/krok-1.png`
a `/krok-2.png` — soubory, které ta stránka vůbec nepoužívá. Stahovala tak přes
1 MB pro nic a po smazání by to navíc byly dva požadavky do prázdna.

**3. Skrytý posuvník stránky.** `style.css` + právní stránky, které ho nenačítají
(`privacy`, `terms`, `zasady-cookies`). Stránka se posouvá dál, jen se lišta
nekreslí. `style.css?v=126`.

---

## 2026-09-06 — ✅ už jsi nasadil, jen pro pořádek

- **Cookies naostro.** `consent.js` + `consent.css` v hlavičce každé stránky,
  Google Consent Mode v2 default denied, **GA se načítá až po souhlasu**. Nová
  stránka `/zasady-cookies` (tabulka se generuje z inventáře v `consent.js`).
  ⚠️ **Přidáváš nástroj třetí strany (pixel, chat, mapa, video)?** Musíš ho
  zapsat do `INVENTAR` v `consent.js`, zvýšit `VERZE` a načítat ho až po
  souhlasu. Jinak se veřejná tabulka rozejde se skutečností.
- **Sjednocené pozadí webu** (aurora, jedno plátno `--pl-canvas`, přilepené hero).
- **Evidence souhlasů** — tabulka `consent_log` + RPC `log_consent` **spuštěná**
  (Yasin, 6. 9.) včetně soli. Netřeba nic dělat.

---

## Čeká v Supabase (nespuštěné)

| Od kdy | Co | Kde je SQL |
|---|---|---|
| 2026-09-26 | Nové sloupce `profiles` pro Profil firmy (fotka pozadí, založeno, kariéra, telefon, kontaktní e-mail, otevírací doba). | `makej-web-sam/supabase/migration_profil_firmy.sql` |
| 2026-09-06 | `launch_list_pocet()` — počet zapsaných na čekacím listu. Dokud neexistuje, web řádek s počtem a postavičkami vůbec nezobrazí (nechceme vymyšlené číslo). | `makej-web-sam/supabase/migration_launch_pocet.sql` |
| 2026-09-05 | Tabulka `blocks` + trigger — blokování uživatelů v appce. UI hotové, DB chybí. | `makej-aplikace/supabase/migration_blocks.sql` |

## Čeká na tobě jinde

- **Allowlist typů souborů na bucketu `chat-prilohy`** (server, ne prohlížeč):
  `allowed_mime_types = image/jpeg,image/png,image/webp,image/heic,application/pdf`,
  `file_size_limit = 10485760`. **SVG nepovolovat** (nese JS → XSS). Dnes tam
  projde i `.php`/`.exe` — `accept="image/*"` je jen nápověda prohlížeči.
- **Před spuštěním appky:** zapnout Google provider v Authentication (tlačítka
  Google na webu i v appce teď končí chybou) a zapnout **Confirm email** (dnes
  je autoconfirm → jdou zakládat účty na cizí adresy). Obojí je vypnuté záměrně,
  ale ven to takhle nesmí.
