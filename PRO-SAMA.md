# Předávka pro Sama

> Co u nás (Yasin) přibylo a co z toho potřebuje něco udělat na tvé straně.
> **Novější nahoře, u všeho je datum** — co už máš nasazené, je označené.
> Podrobnosti k webu jsou v `STAV.md`, změny databáze v `DATABASE.md`
> (repo mobilní appky). Tenhle soubor je jen seznam k předání.

---

## 2026-10-02 — dashboard: Urgentní označuje firma, nový vzhled Urgentní a Top, okna s nálepkami — čeká na nasazení

> **Commity:** web (`Makej-sro/Yasin`) `7e7b2db`, appka (`makej-aplikace-yasin`) `77365e0`.
> Profil firmy, Ověřit firmu, fotky z iPhonu a profil firmy v appce (večer): web `2b7a58a`, appka `5872143`.
> **Databáze:** `migration_overeni_firem.sql` Yasin teprve spouští (viz tabulka „Čeká v Supabase" dole).

> **Pro Samova Clauda:** `employer/` + appka (níž). **Databáze:** `supabase/migration_urgentni.sql`
> (sloupec `jobs.urgent_until` + tabulka `job_urgentni`) už spustil Yasin 2. 10., nic nespouštěj. Nejsnáz převzít `employer-pages3.jsx`,
> `employer-supabase.jsx`, `employer-pages.jsx`, `employer-demo.jsx`, `employer-dashboard.jsx`
> a `index.html` celé. Předlohy od Yasina (`inzerat-stitky`, `listing-slot.css`,
> `topovani-stickers.css`, `urgentni-stickers.css`) jsou převzaté 1:1, jen třídy mají předponu `e-`.

- **Verze v `employer/index.html`:** pages3 v230, shell v73, supabase v36, pages v78, demo v8, dashboard v48, firma v43, app v4
  (pages3 v228+, supabase v29+ a firma v15+ jsou až po commitu `7e7b2db`).
- **Urgentní teď označuje firma, počet podle tarifu** (dřív byl inzerát urgentní sám se směnou
  do 2 dnů — ten automat je pryč). V detailu inzerátu vedle Topovat fialové tlačítko
  **„Označit urgentní"** (`vyberUrg`; jen aktivní inzerát). Inzerát bez budoucího termínu
  (průběžný nábor, prošlé datum) je urgentní **72 hodin** (`E_URG_HODIN`, `_eUrgentDo`) a okno
  má pro něj jiné dva body. (Dočasné ukládání do localStorage, dokud DB neměla
  `jobs.urgent_until`, je po spuštění migrace 2. 10. zase pryč.)
  Otevře okno **„Opravdu chcete inzerát označit jako urgentní?"** — stejné jako u topování, jen
  fialové: tři body (pilulka Urgentní, odpočet u termínu, zmizí se začátkem směny), fialové
  nálepky Urgentní (`.e-um*`, 64 × 28 px, `@property --e-um-d` 0 → 134), „Obnoví se 1. 11."
  a tlačítko „Označit urgentní". Po uložení (`urgentniJobE` v `employer-supabase.jsx`) se první
  volná nálepka odlepí a okno se zavře. Uloží se **`jobs.urgent_until` = začátek směny** (datum +
  čas od, `_eZacatekSmeny`) a řádek do `job_urgentni`. Limit za měsíc: Dynamický 1, Maximální 2,
  Vlastní 3, Základní a Výhodný 0 (`EMPLOYER_URGENT_MESICNE` v `employer-pages.jsx`, podle řádku
  ceníku „Notifikace Urgent"). Už urgentní inzerát má místo tlačítka
  fialový odpočet „Zbývá 26 h", klik otevře stejné okno jen ke čtení („Inzerát je urgentní",
  „Zavřít"). Stav `status = 'urgent'` počítá `fetchEmployerData` z `urgent_until > now`
  (`urgentUntil` na inzerátu); v seznamu ho drží i stav `urgy` po označení v relaci. Ukázkový
  inzerát se označí naoko. Fialová tlačítka = třída `.e-fialka` (stavba jako `.e-zlato`).
  Topovat a Urgentní jsou v patičce detailu ve vlastní skupině vpravo; když se nevejdou,
  zalomí se spolu na další řádek.
- **Urgentní na kartě** (`_state === 'asap'`): na fotce vedle štítku úvazku
  fialová pilulka **Urgentní** s přelivem a přejíždějícím odleskem (`_JbUrgent`, `.e-urgent`,
  `.e-urgent__lesk`, keyframes `eLcSheen`). Pulzující kruh kolem pilulky z předlohy Yasin nechtěl,
  takže tam není. Řádek termínu
  je fialově podbarvený a vpravo má odpočet do začátku směny **„Zbývá 18 h"**
  (`.e-urgent-radek`, `.e-odpocet`, `_jbOdpocet`: pod hodinu minuty, pod 48 h hodiny, jinak dny).
  Na úzké kartě (pod 325 px, `@container` na kartě, `containerType: 'inline-size'`) zůstane
  u urgentního termínu jen začátek směny (`.e-cas-konec` se schová), jinak by se čas vedle
  odpočtu usekl.
- **Fialový rámeček urgentní karty zrušený** (`.e-jb-karta[data-stav="asap"]` pryč z
  `index.html`). Podle předlohy je karta ve všech stavech stejná, urgentní se pozná podle
  pilulky a řádku termínu.
- **Topovaný** (`boosted`): pilulka TOP vlevo nahoře na kartě nahrazená **zlatou nálepkou TOP
  přes pravý horní roh fotky** (Yasin: říkat „nálepka", ne pilulka ani šerpa; `_JbTopNalepka`,
  `.e-top-nalepka`, `.e-top-nalepka__lesk`; fotka má teď
  `overflow: hidden`). **Pilulka TOP se už nepoužívá nikde** — `_JbTop` smazaná, z celého
  inzerátu (`EJobDetailApp`) zmizela; nad nadpisem je místo ní pilulka Urgentní, když je
  inzerát urgentní. Třída `.e-zlato` zůstává (tlačítko Topovat, okno topování).
- **Uložit vpravo dole na fotce** (jako v appce, viz níž): na kartě dashboardu jen neklikací
  ukázka (bílé kolečko se záložkou), řádek firmy má teď `right: 58`, ať jméno nevleze pod něj.
- **Náhled v okně Nový / Upravit inzerát:** `_jbUrgentni(l)` bere `_state` / `status` /
  `urgentUntil` (náhled je dostává z upravovaného inzerátu), nový inzerát urgentní není.
  `_jbOdpocet` počítá do `urgentUntil`, když je, jinak do data a času od.
- **Nálepky v oknech topování a urgentního:** čárkovaná stopa pod ještě nalepenou nálepkou
  prosvítala po okraji, ukazuje se až při odlepení (`:not(.is-used):not(.is-peeling)::before`).
- Barvy stavu Urgentní srovnané s předlohou: `_JB_STATES.asap` je `#6634AE` / `#F2ECFB` /
  tečka `#7A41C8` (dřív `#6A1FD1` / `#F1E8FF` / `#8B3DFF`), stejně tečka u inzerátu v Kandidátech.
- `_JbIko` má nový prop `c` (barva ikonky), výchozí dál `#1B34F0`.
- **Okno „Opravdu chcete inzerát topovat?" s nálepkami** (Yasinova předloha
  `topovani-stickers.css`, převzato 1:1 s předponou `e-tm`): žlutý box „Zbývá vám X z Y
  topování" nahrazený řadou zlatých nálepek TOP — jedna = jedno topování v tarifu, použité jsou
  jen čárkovaná stopa (`.e-tm-slot.is-used`), počet se nevypisuje (je v `aria-label`). Pod
  boxem „Obnoví se 1. 11." (v testovacím režimu „při dalším přihlášení", `dalsiMesic`). Po
  úspěšném `topovatJobE` se první volná nálepka odlepí od pravého horního rohu (`.is-peeling`,
  1,15 s, stav `odlepuji` = index nálepky braný před uložením) a teprve pak se okno zavře.
  Odlepení stojí na `@property --e-tm-d` (Chrome, Safari 16.4+, Firefox 128+; ve starších
  prohlížečích nálepka jen zmizí). Třetí bod v okně: „Dostane zlatou nálepku TOP…" (dřív pilulku).
  Potvrzovací tlačítko je jen **„Topovat"** (dřív „Topovat na 72 h" / „Topuji…"). Ukázkový
  inzerát (`_demo`) se topuje naoko — odlepí se nálepka, karta dostane TOP, do `E_TOPOVANI` jde
  záznam s `_demo: true`, nic se neukládá do DB (dřív se okno jen zavřelo s hláškou).
- **Topovaný inzerát v detailu:** místo béžového štítku „TOP · ještě 1 d 17 h" je zlatý
  odpočet **„Zbývá 1 d 17 h"** ve stejném zlatém kovu s leskem jako tlačítko Topovat (`.e-zlato`,
  `_jbTopZbyva` vrací jen „1 d 17 h"). Odpočet je tlačítko: otevře **stejné okno topování**
  (`dotaz.bezi = true`) s nadpisem „Inzerát je topovaný", body a nálepkami, jen místo
  tlačítka Topovat je v něm neklikací zlatý odpočet a vlevo „Zavřít".
- **Okna „Topování došla" / „Topování není ve vašem tarifu" a stejná pro urgentní jsou pryč**
  (Yasin: „pusť mě normálně na tu stránku"). Vždy se otevře okno s nálepkami: když žádná
  nezbývá, jsou v boxu jen čárkované stopy a „Obnoví se …", tlačítko Topovat / Označit urgentní
  je vypnuté (`disabled`, `data-prazdne` → průhlednost .45). Tarif bez topování / urgentního má
  v boxu jen text „Tarif Výhodný urgentní nemá" (`.e-tm__box--prazdny`) a bez řádku obnovení.
- **Animace povýšení tarifu** (`ETarifPovyseni` v pages3, `.e-povyseni` v `index.html`): po
  zaplacení **vyššího** tarifu (`handlePay`, `vyssi`) místo okénka „Váš tarif je teď…"
  obrazovka pomalu zčerná (1,6 s), napíšou se jen obrysy „Tarif <nový>" (po znacích, 75 ms;
  pravé hrany znaků měřené přes `Range`, obrys se po nich odkrývá `clip-path`, ať sedí na kov),
  pak je zleva doprava zalije kov a barva tarifu (`TierMetalText` s `naSvetlem={false}`, maska
  s měkkou hranou přes `mask-position`, 1,4 s); obrys přitom mizí stejnou hranou obráceně
  (`maskaObrys`), takže se vybarvení a zmizení obrysu dějí naráz. Chvíli to zůstane, pak celý
  nápis jako jeden kus **proletí dopředu do obrazovky** (`scale(2.6)`, cestou slábne, 0,85 s; bez
  rozostření a bez `will-change`, aby ho Chrome vykreslil ostře ve výsledném zvětšení) a černé
  pozadí se rozplyne, až když nápis odletí. Kov z WebGL přitom běží dál živý až do zmizení.
  **Pozor:** metal-fx počítá masku písmen z `getBoundingClientRect`, který u zvětšeného prvku
  vrací zvětšené rozměry, zatímco písmo nechá — kov pak ujede vedle písmen (nápis se
  „rozpojil"). Po dobu průletu proto `_povBezZvetseni(el)` dočasně přepíše
  `Element/Range.prototype.getBoundingClientRect` tak, aby prvkům uvnitř letícího nápisu vracel
  rozměry bez zvětšení (kolem středu nápisu); při odpojení animace se vrátí původní funkce (celkem ≈ 7 s). Klik nebo Esc přeskočí rovnou na průlet. Obrys je
  dvojitá linka a přes ni stejný text černě — holý `text-stroke` ukazoval uvnitř písmen Interu
  překrývající se tahy.
- **Šedé „Tarif" před kovovým názvem má přejíždějící odlesk** (`_MkMetalTextGL` v
  `employer-shell.jsx`, třída `.mk-sheen`): odraz z metal-fx (`useMetalTextReflection`) se
  v dashboardu nikdy nevykreslil — knihovna prvek s odrazem do textu nevložila —, takže slovo
  stálo. Platí i pro okno platby v Tarifech; na tmavém (`naSvetlem={false}`) je odlesk silnější. Nižší tarif dál
  ukazuje původní okénko. Až se napojí Stripe, spustit stejnou animaci po potvrzení platby.
- **Volná místa v tarifu nový vzhled** (Yasinova předloha `listing-slot.css`): místo čárkovaného
  obdélníku „Nevyužito" je to obrys karty — šedá plocha místo fotky s velkým pořadovým číslem
  místa v tarifu (aktivní 3 z 5 → místa 4 a 5), šedé čáry místo textu a dole tlačítko
  **„+ Využít místo"**. Při najetí zmodrá čárkovaný okraj a tlačítko se vyplní. Klik dál otevře
  Nový inzerát (logika beze změny). `EJobRada`, třídy `.e-slot*` v `index.html` (staré
  `.e-jr-volno` pryč). Počítadlo u nadpisu Aktivní je teď **„4/5"** (aktivní / limit tarifu,
  dřív „4 z 5"); u neomezeného tarifu jen počet. `EJobRada` umí `pocet=''` = bez počítadla.

- **Profil firmy podle návrhu z Claude Design** (Yasin 2. 10., předloha „Profil firmy.dc.html" +
  README; `employer-firma.jsx` v22, CSS `.e-pf-*` v `index.html`). Drobečky a stav ukládání z návrhu
  Yasin nechtěl („zbytečný"), chybu uložení hlásí hláška dole. Karta hlavičky:
  úvodní fotka ve **facebookovém formátu 1640 × 624** (`_PF_COVER_W/_H`; firmy mají banner z FB a
  v 4 : 1 jim z něj chyběl kus). Ukládá se přesně 1640 × 624 (`vyrez(maxW, pomer)`, menší fotka se
  nezvětšuje), JPEG 92 % jen jednou: výřez úvodní fotky i loga jde do `uploadImageE(…, hotovyJpeg = true)`
  bez druhého zmenšení (dřív se komprimoval dvakrát a text v banneru se rozmazával; supabase v33). V dashboardu má rám strop výšky 320 px (`_PF_COVER_MAX_H`, jinak by byl ~490 px) a fotka se
  v něm jen ořízne pro náhled; při úpravě pozice strop není, firma vidí přesně ukládaný výřez. Bez fotky světlá plocha `#F2F8FC`, při najetí ztmavne `#E3EAF0` (jako od 30. 9.), tlačítko „Změnit / Přidat úvodní fotku", logo 108 px přes fotku („Změnit
  logo" při najetí), název + štítek **Neověřená** / Ověřená firma (jen v dashboardu), obor · adresa,
  zelená hvězda s hodnocením, **Upravit hlavičku** (název a obor přímo v řádku, Zrušit / Uložit).
  Záložky **Přehled · Fotky N · Brigády N · Hodnocení N** a vpravo se zámkem **Pro nové brigádníky**
  (`chat_rules`, na veřejném profilu není). Přehled: karty O firmě, Kontakt a údaje (2 sloupce:
  Adresa, Kraj, Telefon, E-mail, Web, Kariéra, IČO, Založeno; prázdné „+ Doplnit"), Otevírací doba
  (štítek **Teď otevřeno / Zavřeno** podle času v Praze, Po–Čt | Pá–Ne, dnešní den tučně; úprava =
  zaškrtnutí dne + dva časy, ukládá se jako text „7:30 – 18:00", prázdné = zavřeno), Sociální sítě
  (vyplněné jako pilulka s **ikonkou sítě** v její barvě a jménem účtu, prázdné čárkovaně se šedou ikonkou;
  ikonky Remix Icon přímo v kódu `_PF_SIT_IKONY`, stejné v appce `_WE_SIT_IKONY`, worker-main v65). Vpravo **Otevírací doba** (dny pod sebou, štítek stavu pod nadpisem; Yasin
  ji tam přesunul z levého sloupce) a pod ní **Dokončeno**
  (dřív „Síla profilu"; nikdy pod 20 %: 20 + 80 × splněné/7, kruh i číslo plynule od tmavě oranžové
  (20 %) do zelené (100 %), přechod po odstínu přes žlutozelenou, `barvaDokonceni`) (hotové body šedé a přeškrtnuté jako nákupní seznam, bez koleček) (kruh s %, 7 bodů: Logo a úvodní fotka, Popis, Otevírací doba, Kontakty, Ověřit firmu,
  Další fotky N / 8, Kariérní stránka; klik na nesplněný otevře jeho úpravu, Ověřit firmu otevře
  okno **Ověřit firmu**, viz bod níž). Každá karta má **Upravit** → úprava v kartě se Zrušit / Uložit, ukládá jen svoje
  sloupce jedním zápisem. Když je rozepsaná jiná karta a firma klikne na „Upravit" jinde nebo
  odejde ze záložky, rozepsané se **uloží samo** (`_pfZmeneno`, `_pfPatch`; dřív se tiše zahodilo a
  Yasinovi tak 2. 10. zmizel napsaný popis firmy). Fotky (záložka): bez počítadla, pojistka 50 kusů (`_PF_FOTEK_MAX`), jeden soubor nejvýš
  15 MB a jen obrázek (jinak hláška), nahrání, odebrání, **pořadí přetažením**, vše se ukládá hned.
  Síla profilu: „Další fotky" splněno od 4 fotek.
- **Ikonky v dashboardu nemizí:** `Icon` v `employer/app.jsx` (v4) má `noobserver` (jako appka) — líný
  IntersectionObserver iconify-icon Yasinovi schovával ikonky na tlačítkách, když z nich odjel myší.
  Fotoaparát a tužka na tlačítkách hlavičky Profilu firmy jsou navíc přímo v kódu (`PFIkona`, SVG 1:1 ze Solar).
- **Fotky z iPhonu (HEIC) jdou nahrát v každém prohlížeči** (supabase v34, firma v33, pages3 v230):
  `pripravFotkuE(file)` — když prohlížeč HEIC neotevře (Chrome, Edge, Firefox; Safari ano), stáhne
  převodník `heic-to@1.6.5` z jsDelivr (~3 MB, jen jednou, až když je potřeba) a převede fotku na
  JPEG. (`heic2any` fotky z dnešních iPhonů neuměl, „ERR_LIBHEIF format not supported"; supabase v35.) Platí pro
  fotky firmy, inzerátu (`uploadImageE`), logo i úvodní fotku; `accept` má navíc `.heic,.heif`,
  `jeObrazekE` pozná HEIC i bez MIME typu. Do úložiště jde vždy JPEG. Brigády: aktivní inzeráty jen ke čtení + „Spravovat inzeráty". Tlačítko „Zobrazit jako
  brigádník" z návrhu záměrně není (Yasin: náhled v mobilu firmám nedáváme). Plovoucí lišta
  „Uložit změny" pryč.
- **Profil firmy se ukládá jedním zápisem** a urgentní bez náhradního ukládání do prohlížeče —
  databáze už má všechny sloupce (`ulozCoverE`, `_E_URG_LOKAL`, `branding.cover_url` atd. pryč).
  Ukládání `branding` v Profilu i Nastavení zachová ostatní klíče (dřív `{ color }` přepsalo celé).

### Appka (repo makej-aplikace-yasin, stejný den) — `worker-swipe.jsx?v=126`, `app.jsx?v=37`

- **Profil firmy v appce předělaný podle mobilní části téhož návrhu** (`worker-main.jsx?v=60`,
  `WEmployerModal`, zIndex 8700 = nad horní lištou feedu s kalendářem a filtrem (8500), Yasin 2. 10.: „to co otevřu na mobilu jako tu firmu vůbec není to, jak jsem ti
  posílal"). Celá obrazovka: nahoře Zpět (`WZpet`), úvodní fotka **vždy celá** (dashboard ji ukládá
  4 : 1; bez fotky klidná plocha), logo 88 px přes ni, název 26/700 (+ modrá fajfka u ověřené),
  obor · adresa, zelená hvězda s průměrem a počtem hodnocení, **„Volné brigády (N)"** (aktivní
  inzeráty firmy z `jobs`, při 0 schované) a záložky **Přehled · Fotky · Brigády · Hodnocení**
  (při posunu drží nahoře). Přehled: O firmě (zkráceno na 160 znaků + „více"), Sociální sítě (hned za O firmě, Yasin 2. 10.), Kontakt a údaje
  (Adresa, Telefon `tel:`, E-mail `mailto:`, Web, IČO, Založeno), Otevírací doba (štítek Teď
  otevřeno / Zavřeno podle času v Praze, stejné dny za sebou sloučené „Úterý – Čtvrtek", dnešek
  tučně „· dnes"), Sociální sítě (jen vyplněné). Prázdné řádky i celé sekce se nezobrazují.
  Fotky = mřížka, ťuknutí = galerie `WGalerie` (černá přes celou obrazovku, listování tažením do
  stran se zacvaknutím, přiblížení dvěma prsty 1–4× i dvojitým ťuknutím, posun přiblížené fotky,
  ✕ vpravo nahoře, počítadlo „2 / 5" vlevo; worker-main v63); Brigády = seznam, ťuknutí otevře detail
  inzerátu (`WJobDetailModal`, jako nabídka v chatu); Hodnocení = seznam. Otevření z hodnocení
  (`reviewsOnly`) skočí rovnou na záložku Hodnocení. Z návrhu záměrně chybí „Sledovat", sdílení
  a „více" — zatím za nimi nic není.
  **Bez probliknutí:** data profilu (+ recenze, inzeráty) a obrázky nahoře se načítají dopředu a
  pamatují (`_weNacti`, `_weCache`, `window.wPrefetchEmployer`) — volá to horní karta feedu (`WJobCard`),
  detail inzerátu a otevřené vlákno chatu. Bez dat v paměti se do načtení ukáže jen prázdná stránka se
  Zpět (po 450 ms „Načítám…"), pak všechno naráz; rám úvodní fotky má hned správnou výšku (`coverPomer`).
  Dřív problikly údaje z karty a prázdné fotky. Verze: worker-main v60, worker-swipe v127, worker-messages v25.
- **Logo firmy na kartě, v detailu inzerátu a v seznamu uložených** (`worker-supabase.jsx?v=16`,
  `worker-swipe.jsx?v=128`): dřív tam byly jen iniciály. `get_feed_jobs` logo nevrací, tak ho
  `_wDoplnLoga` po každé stránce feedu dotáhne z `profiles` (`id, logo_url`, veřejně čitelné), zapamatuje
  a obrázek stáhne dopředu. Ostatní dotazy na inzeráty berou `logo_url` rovnou v `employer:profiles(…)`.
  `jobToCard` → `logoUrl`; bez loga dál iniciály. Databáze beze změny (do RPC se dá `logo_url` přidat později).
- **Karta (`WJobCard`) 1:1 s dashboardem:** `WTopBadge` smazaná, místo ní `WTopNalepka` (nálepka TOP
  vpravo nahoře) a `WUrgentBadge` (vlevo vedle úvazku). Urgentní = `_wUrgentni(job)`:
  `job.urgent_until` v budoucnu (z feedu, potřebuje migraci výš); odpočet `_wOdpocet(job)` do
  `urgent_until`, jinak do `date` + `time_start` / `time`. Řádek termínu je u urgentního fialový s odpočtem vpravo; na úzké
  kartě (pod 335 px, `@container`, karta má `containerType: 'inline-size'`) zůstane jen
  začátek směny (`.w-cas-konec`).
- **Uložit přesunuté z pravého horního rohu dolů vpravo** (v řádku s logem a firmou,
  `right: 14, bottom: 18`), protože nahoře je nálepka TOP. Chování i animace „Uloženo" beze změny,
  pilulka roste doleva přes jméno firmy. Řádek firmy má `right: 58`.
- **Celý inzerát (`WJobDetailModal`):** pilulka TOP pryč, místo ní Urgentní.
- **Keyframes** v `www/index.html`: přelivy a odlesky používají stávající `wGoldFlow` a
  `wSheenSweep`, nic nového (pulz kolem pilulky Urgentní není ani tady).
- **Ukázka:** festival (`j2` v `app.jsx`) má `date` vždycky zítra a `urgent_until` zítra ve
  12:00 (`_DEMO_ZITRA`), ať je v demu vidět urgentní + topovaný.

**Pozor při přenosu:** „Zakládající partner" se zatím ukazuje u topovaných (`job.boosted`), to je
špatně — patří firmám z předběžného přístupu a dodělá se při onboardingu. Teď beze změny.

- **Ověřit firmu** (2. 10. večer, `employer-firma.jsx` v43 `PFOvereni`, `employer-supabase.jsx` v36,
  CSS `.e-pf-pole.chyba`). Okno s poli **E-mail** (kontaktní, `profiles.contact_email`) a **IČO**
  (`profiles.ic`), předvyplněné z profilu. Bez obou žádost neodejde: „Zaslat požadavek" zastaví a pod
  políčkem řekne, co chybí (Vyplňte e-mail / Zkontrolujte e-mail / Vyplňte IČO / IČO má 8 číslic /
  Tohle IČO není platné, kontrolní číslice mod 11 v `icoPlatneE`). IČO se při psaní dohledá v **ARES**
  (`aresFirmaE`, volá se přímo z prohlížeče, ARES posílá CORS) a pod políčkem ukáže název a sídlo;
  nenalezené nebo zaniklé IČO žádost zastaví. E-mail a IČO se uloží do profilu a žádost do nové
  tabulky **`overeni_firem`** (`odesliOvereniE`). Pak bod v Dokončeno ukazuje „Čeká na schválení" a
  štítek v hlavičce „Čeká na ověření" (`overeniStavE`). **DB:** `supabase/migration_overeni_firem.sql`:
  tabulka + RLS (firma žádost jen podá a vidí), jedna čekající na firmu, max. 3 za den; trigger pošle
  e-mail přes `makej_posli_email` na **podpora@makej.eu** (název z profilu i z ARES, IČO, oba e-maily,
  odkazy do ARES a OR). Schválení ručně: Table Editor → `overeni_firem` → `stav` = `schvaleno` → trigger
  zapne `profiles.verified` (security definer, ochranný trigger ho pustí) a firmě pošle e-mail „Vaše
  firma je ověřená". `zamitnuto` jen uzavře žádost. SMS ověření telefonu zatím není (Twilio, až bude účet).

---

## 2026-10-01 — seznam opravených chyb na webu (co se dělo, kdy, v jakém commitu)

> **Pro Sama:** chyby, které jsme u nás opravili a které jsou nejspíš pořád na živém
> makej.eu. U každé: co přesně uživatel viděl, kdy se to dělo, ve kterém našem commitu
> (repo `Makej-sro/Yasin`) je oprava a co v kódu hledat.

> **Srovnáno s tvým webem 1. 10.:** web (bez dashboardu) u nás odpovídá tvému `bd689ff`
> (1. 10.) — ceny, sdílený ceník, OG obrázek, kotva Kontakt, kroky na /hledam-si-praci,
> tvoje /lide. Navíc oproti tobě máme **jen body 1–17 níž** — nic dalšího.
> Dashboard (`employer/`) jsme od tebe nebrali. Ceny v něm jsou ale srovnané s tvým webem
> (bod 17). Všechno z 1. 10. (body 7–17) je v jednom commitu `ae89b7f`.

**1. Nad velkým nadpisem byla před animací vidět řada čárek (kousky písmen)**
- **Co uživatel viděl:** nadpis na začátku stránky (např. „Staň se Makačem / ještě dnes")
  vyjíždí zespodu. Ještě než se rozjel, koukaly nad místem, kde se objeví, useknuté
  špičky písmen (háčky Ň, Č, ě, tečka nad j, vršky N, d, l) — vypadalo to jako řada
  čárek nebo kousky textu, které tam „už jsou" dřív než samotný text.
- **Kdy a kde:** při každém otevření nebo prokliknutí na stránku, v prodlevě před
  animací (zhruba první 0,1–1 s). Stránky `/hledam-si-praci`, `/lide`,
  `/pro-zamestnavatele` a nadpis v modrém pruhu na úvodní stránce. Je to i na živém webu.
- **Proč:** text vyjíždí zpod neviditelné masky (`overflow:hidden`). Start byl jen
  o 120 % výšky řádku níž, jenže okno masky je kvůli ocáskům (j, p, y) o .3em vyšší
  a tučné písmo vystrkuje špičky nad svůj box — 120 % nestačilo, 7–13 px písmen zůstalo vidět.
- **Oprava:** commit **`680edf7`** z **24. 9. 2026** „Web srovnán se Samem + úvodka
  s modrým pruhem, nová fotka na /lide". Start animace `translateY(120%)` → **`160%`**:
  `style.css` (`@keyframes heroLineUp`, `.vx-line-in`) a vložené styly `.eh-line-in`
  v `hledam-si-praci.html`, `lide.html`, `pro-zamestnavatele.html`.
  Hledat: `translateY(160%)`, `heroLineUp`. Podrobněji blok 2026-09-24 níž, bod 5.

**2. Přihlašovací okno se na menší obrazovce nedá posunout — spodek je useknutý**
- **Co uživatel viděl:** po kliknutí na „Přihlásit se" je okno vyšší než obrazovka.
  Spodní část (tlačítko „Přihlásit se", přihlášení přes Google, odkazy pod tím) je pod
  okrajem a okno ani stránka se posunout nedají — přihlásit se nejde.
- **Kdy a kde:** na všech stránkách webu, jakmile je okno prohlížeče nižší než zhruba
  720 px (menší notebook, zvětšená stránka, telefon na šířku). Ověřeno 1. 10. na tvé
  verzi: při výšce 540 px má okno 508 px a obsah 705 px, posunout nejde.
- **Proč:** nový vzhled okna (blok „PŘIHLÁŠENÍ A REGISTRACE — ve stylu appky" ve
  `style.css`) dává oknu `max-height` a `overflow-y: auto`. Jenže v HTML zůstalo na
  `#login-modal` vložené `style="overflow:visible;"` (bylo tam kvůli kukajícímu
  Makačovi nad oknem) a to posouvání přebíjí.
- **Oprava:** commit **`8cd5e6d`** z **27. 9. 2026** „Firemní dashboard: nový vzhled,
  Profil firmy, inzeráty, ceník v2" (část „web: přihlašovací okno ve stylu appky").
  Na všech 9 stránkách s oknem `<div class="modal" id="login-modal" style="overflow:visible;">`
  → `<div class="modal" id="login-modal">`. Hledat: `id="login-modal"`.

**3. Na blogu nad přihlašovacím oknem pořád kouká kreslený Makač**
- **Co uživatel viděl:** na blogu se po kliknutí na „Přihlásit se" nad modrým oknem
  objeví kreslená hlavička s očima (Makač), na ostatních stránkách už ne — působí to
  jako zbytek starého vzhledu.
- **Kdy a kde:** `/blog/` a oba články (`/blog/brigada-bez-smlouvy-zakon`,
  `/blog/proc-jsme-zalozili-makej`), vždy po otevření přihlášení. Ověřeno 1. 10.
- **Proč:** při přechodu na nový vzhled okna se Makač (`#main-peeker`) smazal ze
  stránek, ale na třech stránkách blogu zůstal.
- **Oprava:** stejný commit **`8cd5e6d`** z **27. 9. 2026**. Ze tří stránek blogu smazat
  celý blok `<!-- Makač peeker -->` / `<div id="main-peeker" …>` (styly i skript
  peekeru už jsou pryč). Hledat: `main-peeker`.

**4. Bílé tlačítko v modrém pruhu na /pro-zamestnavatele při najetí myší zmizí**
- **Co uživatel viděl:** dole na stránce pro zaměstnavatele je modrý pruh s bílým
  tlačítkem. Když na něj najede myší, tlačítko zmodrá do stejné barvy jako pruh —
  zůstane jen bílý text a tlačítko jako by zmizelo.
- **Kdy a kde:** `/pro-zamestnavatele`, modrý pruh na konci stránky, při najetí myší
  (na počítači). Na úvodní stránce už to máš opravené, tady ne.
- **Oprava:** commit **`680edf7`** z **24. 9. 2026** „Web srovnán se Samem + úvodka
  s modrým pruhem, nová fotka na /lide". `.vx-close .vx-btn:hover` → `background:
  #F4F6FF` (jen lehce zesvětlá), místo `#0020f6` + bílého textu. Hledat:
  `.vx-close .vx-btn:hover` v `pro-zamestnavatele.html`.

**5. Barevné skvrny v pozadí (aurora) se animují i mimo obraz — zbytečně to zatěžuje**
- **Co uživatel viděl:** nic přímo vidět není, ale skvrny v pozadí herů běží
  v nekonečné animaci i ve chvíli, kdy jsou dávno odscrollované, a mléčné sklo
  čekacího listu nad nimi se kvůli tomu přepočítává každý snímek. Na slabších
  telefonech a noteboocích to bere výkon (posouvání, baterie).
- **Kdy a kde:** na všech stránkách s aurorou, celou dobu, co je stránka otevřená.
- **Oprava:** commit **`680edf7`** z **24. 9. 2026**. Na konec `script.js` funkce
  `auroraJenVObraze()` (IntersectionObserver přidá `.aurora--stoji`, když skvrny nejsou
  vidět) + do `style.css` `.aurora--stoji i { animation-play-state: paused; }`.
  Hledat: `auroraJenVObraze`, `aurora--stoji`.

**6. (Úprava vzhledu, ne chyba) Stránka bez posuvníku vpravo**
- **Co je jinak:** u nás se vpravo nekreslí posuvník stránky (Yasin ho tam nechce).
  Stránka se dál posouvá kolečkem, trackpadem i klávesami; vnitřní posuvné části
  (nastavení cookies, FAQ na /podpora) mají posuvník dál.
- **Od kdy:** commit **`7dcec87`** z **10. 9. 2026** „Čekací list bez fyzická/právnická,
  oprava cache skriptu, skrytý posuvník". Ve `style.css` blok „BEZ POSUVNÍKU STRÁNKY"
  (`html { scrollbar-width: none }` + `html::-webkit-scrollbar { display: none }`).

**7. Na Windows notebooku telefon v heru /hledam-si-praci zajede za tlačítko „Vytvořit účet zdarma"**
- **Co uživatel viděl:** po úvodní animaci dosedne telefon vrškem pod tlačítko — tlačítko
  překrývá horní část telefonu (displej s nabídkou), vypadá to jako chyba v rozložení.
- **Kdy a kde:** `/hledam-si-praci` na nízkých oknech — typicky Windows notebook se
  zvětšením 125–150 % (okno 1280 × 590–720, 1366 × 768, 1536 × 730). Na 1280 × 720 byl
  vršek telefonu 52 px nad spodkem tlačítka, na 1280 × 590 dokonce 107 px. Na MacBooku
  (1440 × 900) to bylo v pořádku. Je to i na živém webu.
- **Oprava:** 1. 10. 2026, commit `ae89b7f`. Telefon se na nízkých oknech posadí
  níž: v `hledam-si-praci.html` stupně `.mkj-visual` (CSS `@media (min-height: …)` i
  tabulka `STUPNE` ve skriptu pod herem) — `--dy` pro výšky pod 650 / 650 / 710 / 770 /
  830 px = 436 / 416 / 392 / 370 / 370 px (dřív 258 / 275 / 295 / 320 / 345) a nový stupeň
  870 px se starou hodnotou 345, takže notebooky 900+ zůstaly beze změny. Mezera mezi
  tlačítkem a telefonem je teď všude 15–45 px. Hledat: `STUPNE`, `.mkj-visual`.

**8. Na nízkém okně na /lide lezou lidé z fotky hlavami do tlačítek**
- **Co uživatel viděl:** fotka pěti lidí v heru je tak velká, že jejich hlavy zasahují
  do tlačítek „Vytvořit účet" / „Jak to funguje".
- **Kdy a kde:** `/lide` na počítači s oknem nižším než ~650 px (Windows notebook se
  zvětšením 150 %, 1280 × 590 — překryv 29 px). Je to i na živém webu.
- **Oprava:** 1. 10. 2026, commit `ae89b7f`. V `lide.html` nové pravidlo
  `@media (min-width: 601px) and (max-height: 700px)` — `.vx-heroimg` má šířku z `.74`
  výšky okna místo `.88`. Hledat: `vx-heroimg`, „Nízké okno na počítači".

**9. (Úprava, ne chyba) Na velkém monitoru se celý web zvětší — vypadá jako na notebooku**
- **Co je jinak:** web je navržený na notebook (~1440 × 900). Na iMacu, Studio Displayi
  nebo 27" monitoru dřív zůstal malý uprostřed velké bílé plochy. Teď se celá stránka
  zvětší (CSS `zoom`) tak, aby „virtuální" okno mělo zhruba 1600 × 900: okno
  1920 × 1080 → ×1,15, 2240 × 1140 → ×1,25, 2560 × 1310 → ×1,45, 2880 × 1490 → ×1,6.
  Notebooky, Windows s oknem do 1920 × 950 a mobily se nemění. Ověřeno v Chrome i v jádře
  Safari (WebKit) na všech stránkách — nic nepřetéká, žádná chyba skriptu.
- **Od kdy:** 1. 10. 2026, commit `ae89b7f`.
- **⚠️ Pro Samova Clauda — pravidla, jinak se to rozbije:**
  - `style.css` nahoře blok „VELKÉ OBRAZOVKY": `--z` podle `@media (min-width) and
    (min-height)` uvnitř `@supports (zoom: 1)` a `html { zoom: var(--z); }`.
  - `zoom` zvětšuje i `vh` / `vw` (100vh by bylo 1,45× výšky okna). Proto **všechny**
    `vh` / `svh` / `dvh` / `vw` ve `style.css`, `consent.css`, `cenik.css` a ve stylech
    stránek jsou přepsané na `calc(Xvh / var(--z, 1))`. **Nové jednotky psát stejně** —
    holé `100vh` na velkém monitoru zvětší sekci o 45 %.
  - Skripty: `innerHeight`, `scrollY` a `getBoundingClientRect()` jsou v px okna, ale px
    zapsané do stylu se zoomem ještě zvětší → dělit zoomem. Ve `script.js` je na to
    `mkZoom()` (posun na kotvu, šířka typeru, `--uvod-presah`, kruh přechodu do dashboardu);
    `--hero-h` na `/hledam-si-praci`, `/lide`, `/pro-zamestnavatele`, `--wm-shift` na `/o-nas`
    a výška pro `STUPNE` počítají s `getComputedStyle(html).zoom`.
  - Verze: `style.css?v=160`, `script.js?v=70`, `consent.css?v=3`, `cenik.css?v=7`.

**10. Na mobilu se úvodka dole u modrého pruhu s telefonem sekala a skákala**
- **Co uživatel viděl:** při scrollu dolů se obraz skoro celou obrazovku nehýbal a pak
  modrý pruh s telefonem najednou vyletěl. Rozmazaná tlačítka v pozadí poskakovala,
  logo nad modrým pruhem zmizelo (modré na modré) a nad bílou patičkou naskočil modrý pás.
  Obrázek telefonu se občas dotáhl pozdě.
- **Kdy a kde:** `/` na telefonu, hlavně iPhone. Je to i na živém webu.
- **Proč:** (a) `#brzy` má `min-height: 185vh`, takže karta čekacího listu po vyjetí
  stála ~85 % obrazovky, (b) slovo v nadpisu se měnilo i rozmazané za kartou a telefon pokaždé
  znovu rozmazával celé hero, (c) `data-nav-blue` bylo na patičce, která je na úvodce bílá,
  a ne na modrém pruhu, (d) obrázek měl `loading="lazy"`.
- **Oprava:** 1. 10. 2026, commit `ae89b7f`. `style.css`: `@media (max-width: 700px)
  { #brzy { min-height: 100svh } }` (desktop dál stojí). `script.js` heroTyper: `stoji()` —
  slovo se nemění, dokud má `.uvod` `data-vzadu` nebo je karta prohlížeče na pozadí.
  `index.html`: `data-nav-blue` přesunuto z `#footer` na `.vx-close--foto`; u `hsp-mockup.webp`
  místo `loading="lazy"` je `fetchpriority="low"`. Hledat: `stoji()`, „Telefon: bez zastavení".

**11. Na úzkém telefonu nadpis „Práce na jeden swajp." přeskakoval na tři řádky**
- **Co uživatel viděl:** při každé výměně slova (swajp / klik / dotek) nadpis poskočil na tři
  řádky a tlačítka pod ním o ~30 px.
- **Kdy a kde:** `/` na telefonech užších než ~375 px. Na 375 px se slovo vešlo jen o 3 px,
  takže v Safari to klidně mohlo skákat i tam.
- **Oprava:** 1. 10. 2026. `style.css` v `@media (max-width: 680px)`: `.hero-h1` font-size
  `clamp(40px, min(16vw, (100vw − 96px) / 4.85), 96px)`. Druhý řádek zabírá ~4,7 em, takže
  se vejde vždycky. Od ~420 px šířky je to beze změny.

**12. Písmena odlétajícího slova v nadpisu se uřízla o neviditelný obdélník**
- **Co uživatel viděl:** při výměně slova písmena odlétají nahoru a rozmazávají se, ale
  narazila na rovnou hranu a byla useknutá.
- **Kdy a kde:** `/`, všechna zařízení. Je to i na živém webu.
- **Proč:** `.hero-h1 span` má animaci `mkMask` s `fill-mode: both`. Ta se vypínala jen na
  přímém potomkovi (`.mk-hotovo > span`), takže `clip-path: inset(0 0 -22% 0)` zůstal na
  `.hero-konec` a `.hero-slovo`. Hodnotu z animace samotné `clip-path: none` nepřebije.
- **Oprava:** 1. 10. 2026. `style.css`: `.hero-h1.mk-hotovo span { animation: none;
  clip-path: none; }`.

**13. (Úpravy vzhledu od Yasina, ne chyby)**
- **Hamburger:** tři modré čárky (#0020F6, 24 × 3 px) bez prosklené pilulky. Bílé jsou nad
  modrou a v otevřeném menu, otevřené se překlopí do křížku (prostřední zmizí). Box 44 × 44
  zůstal kvůli palci. Platí pro všechny stránky (`#navbar` i `.vx-burger`), takže 3. `<span>`
  je v HTML všech 12 tlačítek. Varianty s pozadím a rámečkem jsou ze `style.css` pryč.
- **Tlačítka v heru úvodky:** „Stáhnout si apku" je tmavé (#191919) s bílým textem,
  „Vytvořit profil" značkově modré, hover #0014A3. Dřív světle šedé + černé.
- **Jen telefon:** větší mezera mezi nadpisem a tlačítky — `.hero-cta { margin-top:
  clamp(56px, 9vh, 84px) }` v `@media (max-width: 680px)` za pravidlem pro nízké displeje.
- **Bez ligatur:** `html { font-variant-ligatures: no-common-ligatures; }`. Plus Jakarta Sans
  slévala „fi" / „fl" (profil) do jednoho znaku.
- **Rozbalovací menu na mobilu (panel pod hamburgerem):** bez čar mezi odkazy, spodek se
  místo rovné hrany rozplyne (`mask-image` s křivkou, spodní padding 68 px). „Přihlásit se"
  (bílé, modrý text) a „Vytvořit účet" (modré) jsou vedle sebe, písmo 16 px, bez stínu.
  Přihlášený: „Ahoj, jméno!" nad nimi přes celou šířku.
- **Chyba: menu se po „Přihlásit se" / „Vytvořit účet" nezavřelo.** Ty odkazy `updateNavAuth`
  přepisuje přes `innerHTML`, takže posluchač z načtení neměly. Teď je zavírání delegované
  na panel `#mobile-menu` ve fázi zachycení (zavře se dřív, než tlačítko otevře okno —
  jinak by `setMenu(false)` okno odemklo pro scroll).

**14. (Nová funkce) „Zůstat přihlášen", Zavřít v dashboardu, odhlášení jen tohoto zařízení**
- **Co je nového:** v přihlašovacím okně zaškrtávátko „Zůstat přihlášen" (výchozí zaškrtnuté).
  - Zaškrtnuté: přihlášení se pamatuje 30 dní od poslední návštěvy webu nebo dashboardu.
  - Odškrtnuté: jen do zavření karty nebo prohlížeče.
  - V dashboardu v menu karty firmy (vlevo dole) je místo šedého „Odhlásit se" řádek:
    **✕ Zavřít** (bílé, při najetí červené; zpět na web, přihlášení zůstane, v liště je
    „Dashboard") a **Odhlásit se** (pořád červené, bílá ikonka dveří `logout-2-linear`).
    Odhlášení je na dva kliky na stejném místě: první přepne tlačítko na „Odhlásit"
    (nad ním „Opravdu se chcete odhlásit?", místo ✕ je „Zrušit"), druhý odhlásí. Nabídka
    je přichycená spodkem, takže tlačítko zůstane pod kurzorem a jde to i rychlým
    dvojklikem. Stav `potvrdOdhlaseni` v `ESidebar`. Během potvrzení se celé okno rozmaže
    (portál s `backdrop-filter: blur(7px)`, zIndex 250) a nabídka jde portálem nad něj
    na stejné místo (zIndex 300). `<aside>` má vlastní zIndex 40, uvnitř by ji rozmazání
    překrylo. Klik do rozmazaného místa nabídku zavře.
    Po potvrzení (`handleSignOut` v `employer-main.jsx`, tedy každé odhlášení z dashboardu)
    obrazovka dvakrát krátce pohasne jako při výpadku proudu a shora se stáhne tma
    (`.e-tma*` v `employer/index.html`). Uprostřed se po znacích dopíše „Neplecha ukončena"
    s blikajícím kurzorem, stejně jako „Je hotovo." v appce (League Spartan 64 px, 50 ms na znak).
    Odhlášení běží souběžně, na webu je člověk za ~2,2 s (dopsaná věta zůstane ~0,7 s na přečtení), nejpozději za 3 s.
  - Na webu po přihlášení **„Odhlásit se" není** (Yasin: na webu je divné, odhlašuje se
    v dashboardu). V liště je místo modrého tlačítka jen modrý text „Dashboard" s ikonkou
    Statistiky z levého menu dashboardu: `employer/ikony/analytika.svg` (Iconly Light-Outline
    / Chart) jako CSS maska `.ik-statistiky`, takže bere barvu textu. Odkaz `.nav-do-dash`
    nad modrou zbělá. Pro brigádníka „Moje brigády" s `solar:case-round-linear` (přidaná do
    `iconify-icons.js`, `?v=3` na stránkách). V menu na mobilu je „Ahoj, jméno!" a modré
    tlačítko se stejnou ikonkou. Hero CTA na úvodce má stejné ikonky.
- **Jak to funguje:** nový sdílený soubor `pamet-prihlaseni.js` (načítá se hned za
  supabase-js na 9 stránkách webu, v `employer/index.html` i `worker/index.html`). Dává
  `window.mkAuthUloziste`, vlastní `storage` pro `createClient` (localStorage, nebo
  sessionStorage podle `makej-pamatovat`). Hlídá taky lhůtu: `makej-naposledy` starší než
  30 dní → klíče `makej-auth*` se smažou dřív, než je klient načte. Přihlášení heslem
  i přes Google volá před přihlášením `mkNastavPamatovani(zaškrtnuto)`. Kdo byl přihlášený
  před touhle změnou, zůstane přihlášený a lhůta se mu začne počítat od první návštěvy.
- **Chyba, kterou to odhalilo — je i na živém webu:** přihlášená firma, která otevřela web,
  byla hned přehozená zpátky do dashboardu. Supabase-js posílá `SIGNED_IN` i při obnově
  uloženého přihlášení (`_recoverAndRefresh`) a po návratu do karty, ne jen po přihlášení.
  Komentář v `onAuthStateChange` počítal jen s `INITIAL_SESSION`. Teď se přesměruje jen po
  přihlášení na té stránce: proměnná `prihlasujeSe` (formulář) a pro Google značka
  `makej-po-prihlaseni` v sessionStorage, protože Google přihlašuje přes přesměrování.
- **Odhlášení:** všude `signOut({ scope: 'local' })` (web, dashboard, /worker/). Výchozí
  `global` odhlásil firmu ze všech zařízení naráz, i z appky. Smazání účtu nechává `global`.
- **Bezpečnost:** heslo se neukládá, jen token Supabase (access 1 h, sám se obnovuje).
  Po odhlášení ho Supabase zneplatní. Bez Pro tarifu Supabase délku přihlášení neomezuje,
  proto si 30 dní hlídáme sami v prohlížeči.
- **Od kdy:** 1. 10. 2026, commit `ae89b7f`. Verze: `employer-shell.jsx?v=70`,
  `employer-main.jsx?v=59`, `employer-pages3.jsx?v=197`, `worker-main.jsx?v=11`,
  `worker-profile.jsx?v=13`, `pamet-prihlaseni.js?v=2`.
**15. (Dashboard, úprava) Záložka Inzeráty jen ve dvou řadách: Aktivní a Neaktivní**
- **Co je jinak:** dřív čtyři řady (Topované / Urgentní / Aktivní / Neaktivní), které při
  pár inzerátech vypadaly prázdně. Teď jsou všechny běžící inzeráty v řadě Aktivní do strany.
  Na začátek jde, co firma zvýraznila, a urgentní má přednost před topovaným:
  urgentní + topovaný → urgentní → topovaný → ostatní. Ve skupině jsou od nejnovějšího.
  Neaktivní (zašedlé) beze změny.
- **Volná místa:** na konci řady Aktivní je tolik prázdných karet „Nevyužito" (čárkovaný
  rámeček, při najetí zmodrá), kolik inzerátů ještě tarif dovolí zapnout
  (`EMPLOYER_MAX_ACTIVE`). Klik na ně otevře Nový inzerát. U nadpisu je místo počtu
  „3 z 5". Tarif Vlastní (bez limitu) prázdná místa nemá. Počítá se to, co je v řadě vidět,
  takže dokud běží `E_DEMO_INZERATY`, počítají se i ukázkové inzeráty.
- **Kde:** `employer-pages3.jsx` v `EJobs`: `rady` a `_poradi`. V `EJobRada` jsou nové props
  `volnych`, `onVolny` a `pocet`, styl `.e-jr-volno` je v `employer/index.html`.
  `employer-pages3.jsx?v=200`.

**16. (Dashboard, chyba) Limity tarifu: nový inzerát šel do aktivních i přes plný tarif**
- **Co se dělo:** `createJobE` ukládal každý nový inzerát se `status: 'active'` a limit
  `EMPLOYER_MAX_ACTIVE` hlídalo jen ruční zapnutí. Firma s Výhodným (2) tak mohla mít aktivních
  víc. K tomu se do řady Aktivní přidávaly všechny ukázkové inzeráty (`E_DEMO_INZERATY`), takže
  to vypadalo na 4 aktivní u Výhodného.
- **Oprava (1. 10.):**
  - `createJobE` při plném tarifu uloží inzerát jako `paused` (`_eTarifPlny()`).
    `handlePublish` pak ukáže „Uloženo jako neaktivní — Tarif X dovoluje N aktivní…".
  - V `EJobs` ukázkové aktivní inzeráty zabírají jen volná místa tarifu, vlastní mají přednost.
  - Okno při zapnutí inzerátu nad limit (`dotaz.druh === 'limit'` v `EJobs`) je předělané:
    „Limit překročen", věta a „Řešení" se dvěma body. U prvního je kovové tlačítko tarifu
    o stupeň výš (`TierMetalButton`, třeba „Chci Dynamický"). Přes `window.__empVybratTarif`
    přepne na Tarify a `EPricing` ten tarif hned vybere (otevře platbu). Druhá možnost radí
    vyměnit inzerát za jiný aktivní. Obě možnosti dělí „nebo", aby nevypadaly jako kroky.
    Dole je jen „Vrátit se". Z hlášek v Inzerátech zmizely pomlčky „—" (Yasin je nechce).
    `employer-pages3.jsx?v=205`.
- **Testovací režim topování:** `E_LIMITY_OD_PRIHLASENI = true` v `employer-supabase.jsx`.
  Limit topování se nepočítá za kalendářní měsíc, ale od posledního přihlášení: web při
  přihlášení zapíše `makej-prihlaseni-od` do localStorage a `_eZacatekMesice()` od něj počítá.
  Texty se přizpůsobí („obnoví se při dalším přihlášení"). **⚠️ PŘED SPUŠTĚNÍM dát `false`.**
- **Urgentní** je zatím automatické (směna do 2 dnů → `status 'urgent'`), firma ho nenastavuje,
  takže se nepočítá do tarifu. „Notifikace Urgent" z ceníku (Dynamický 1×, Maximální 2×,
  Vlastní 3×) není postavená.
- Verze: `employer-pages3.jsx?v=203`, `employer-supabase.jsx?v=26`, `employer-main.jsx?v=60`,
  `employer-dashboard.jsx?v=47`, `script.js?v=77`.

**17. (Dashboard) Tarify mají ceny a parametry podle tvého webu**
- Dřív byly v dashboardu staré ceny 499 / 2 000 / 4 999 a Vlastní od 9 999 Kč (20–5 000).
  Teď je všechno podle `pro-zamestnavatele.html` (#pricing):
  - Výhodný 990 (bez roční slevy),
  - Dynamický 3 990 měsíčně / 3 390 ročně, ušetříte 7 200,
  - Maximální 9 990 / 8 490, ušetříte 18 000.
- Kalkulačka Vlastní: `_KALK_ZAKLAD 18000`, pásma `[[50,810],[100,630]]`, kroky po 5 od 20 do
  100, zaokrouhlení na tisíce − 10 a „· sleva X %" proti 900 Kč za inzerát. Při 20 inzerátech
  17 990, při 100 inzerátech 73 990.
- Srovnání: Vlastní 20–100 inzerátů, Topování 5×/měs+, Urgent 3×+. Popis Vlastní „Desítky
  pozic…". V platbě se u Výhodného ročně neukazuje „ušetříte".
- ⚠️ Na webu ve FAQ pořád stojí „Placené plány začínají na 499 Kč/měsíc" (`pro-zamestnavatele.html`,
  FAQ „Kolik to stojí"). To je tvoje, neměnil jsem to.
- `employer-pages3.jsx?v=206`.

- Verze webu po bodech 10–14: `style.css?v=178`, `script.js?v=76`.

---

## 2026-09-30 — dashboard: pás čísel pryč, nový Dashboard jako přehled všeho — čeká na nasazení

> **Pro Samova Clauda:** jen `employer/`, žádná nová změna databáze — ale **spusť čekající `migration_profil_firmy.sql`** (níž). Nejsnáz převzít soubory
> `employer-dashboard.jsx`, `employer-shell.jsx`, `employer-pages3.jsx`,
> `employer-supabase.jsx`, `employer-main.jsx` a `index.html` celé.

### Výsledný stav — co si vzít

- **Verze v `employer/index.html`:** shell v65, dashboard v46, pages3 v196, supabase v25, main v55, demo v7, data v3, firma v14.
- **„+ Nový inzerát" nahoře v levém menu** (`ESidebar`, nový prop `onNew` z `employer-main.jsx`): modré tlačítko mezi logem a sekcí Přehled, stejná stavba jako položky menu (plus na místě ikon, střed 36 px), v úzkém pruhu jen modrý čtvereček s plusem, na mobilu zavře vysouvací menu a otevře okno. **Z hlaviček záložek zmizelo** (Dashboard, Zprávy; v Inzerátech vpravo nahoře zůstalo) — Yasin: jedno místo, které si lidi zapamatují, a víc místa nahoře. Zůstalo jen v prázdném stavu Dashboardu a v nabídce inzerátu kandidátovi. Plán směn má dál „+ Nová směna".
- **Profil firmy bez hlavičky** (`ECompanyProfile`): pryč nadpis „Profil firmy" i popisek „Takhle vás uvidí brigádníci v aplikaci" (a s nimi Zahodit/Uložit nahoře) — stránka začíná rovnou úvodní fotkou (tlačítko vpravo dole, viz níž). Bez fotky je místo přechodu v barvě firmy světlá plocha `#F2F8FC`, při najetí zešedne (`.e-pf-cover-prazdne` v `index.html`), text a ikonka tmavé. Uložení nabízí dál plovoucí lišta dole („Máte neuložené změny"). Zatím pryč i karty **„Profil vyplněný na X %"** a **„Účet a tarif"** v pravém sloupci (i s výpočtem vyplněnosti a načítáním přihlašovacího e-mailu) — tarif a odhlášení jsou v kartě firmy v levém menu, nedoplněný profil hlásí Dashboard.
- **Profil firmy: úprava fotek** (`employer-firma.jsx` v12). Společná logika posunu a přiblížení je hook **`_usePfPozice(img, ramRef)`** (tažení pointer events i prstem, kolečko k místu pod myší, posuvník 1–4×, fotka vždy vyplní rám, `vyrez(maxW)` → JPEG 0,9, malou fotku nezvětšuje, průhlednost na bílém).
  - **Logo:** po výběru souboru okno *Upravit logo* (`PFOrez`, čtvercový rám se zaoblenými rohy), výstup max 600 × 600.
  - **Úvodní fotka (dřív „fotka pozadí") jako na Facebooku:** vpravo dole tlačítko *Přidat úvodní fotku* / *Upravit úvodní fotku* → nabídka `PFCoverMenu` (portál, karta má overflow:hidden). Bez fotky jen *Nahrát fotku*; s fotkou *Vybrat úvodní fotku* (z Fotek firmy, okno `PFVyberFotky`, jen když nějaké jsou), *Nahrát fotku*, *Změnit pozici*, *Odebrat* (ikony Solar: gallery, upload-minimalistic, move, trash-bin-minimalistic). Vybraná fotka se upravuje **přímo v rámu na profilu**: nahoře vpravo jen posuvník přiblížení (bez vysvětlivek), vpravo dole *Zrušit* / *Uložit*. Rám má pevný poměr **4 : 1** (`aspectRatio`, min. 170 px — dřív výška 300 px) = stejný poměr, v jakém se výřez ukládá (max 2400 × 600), takže na profilu je přesně to, co si firma nastavila. *Změnit pozici* / *Vybrat* načítá z adresy s `crossOrigin='anonymous'` (`_pfNactiFotku`) — Storage musí posílat CORS (Supabase ho posílá).
  - **Fotky se ukládají hned** po *Uložit* v úpravě (`ulozFotku` → `updateEmployerProfile({ cover_url | logo_url })`), ne až tlačítkem *Uložit změny*. Když zápis selže (teď u `cover_url`, sloupec chybí), fotka zůstane ve formuláři a firma dostane hlášku.
  - Bez vysvětlivek (Yasin 30. 9.: „nedával bych všude ty vysvětlivky"): pryč podtitulky v okně loga a výběru fotky i popisek „Provozovna, tým… 2400 × 600 px" v prázdné úvodní fotce.
  - **Oprava klikání:** řádek s logem a názvem (`marginTop: -64`) ležel přes spodních 64 px úvodní fotky a bral kliknutí — tlačítka vpravo dole (Upravit/Přidat úvodní fotku, Zrušit, Uložit) nešla stisknout myší. Teď má řádek třídu `.e-pf-radek-loga` s `pointer-events: none` (klikat jde jen na jeho obsah — logo, název) a tlačítka v úvodní fotce `zIndex: 3`. Ověřeno skutečnými kliky myší (CDP `Input.dispatchMouseEvent`), ne jen `.click()`.
  - Fotky firmy (galerie) se nahrávají dál bez úprav. `.e-pf-vyber` (hover výběru) v `index.html`.
- **Záložka Inzeráty bez filtrů — řady pod sebou jako v Kandidátech** (`EJobs`, pages3): pryč přepínač Vše/Aktivní/Neaktivní, řazení i hledání (`EFiltrLista` tu už není, `_JB_SORTS` smazané). Místo mřížky řady karet do strany (nadpisy bez vysvětlivek): **Topované** (aktivní s `boosted`) → **Urgentní** (`_state === 'asap'`, bez topovaných) → **Aktivní** → dole **Neaktivní**; inzerát je jen v jedné řadě, v řadě od nejnovějšího, prázdné řady se neukazují. Řada = nová společná komponenta **`EJobRada`** (pages3, za `EJobKartaApp`): celý počet karet na šířku (min. 290 px), snap na kartu, bez šipek (posun do strany jako Kandidáti); `stavNad` přidá nad kartu štítek stavu. Dashboard ji používá pro „Vaše inzeráty" (dřívější `_EDbInzeraty` smazaná). „+ Nový inzerát" v hlavičce Inzerátů zůstal.
- **Stav inzerátu „Naplněno" zrušený** (Yasin: nepoznáme, kdy je brigáda opravdu obsazená, a firma ji za pár měsíců zapne znovu — inzerát je jen Aktivní / Neaktivní, vypne si ho sama). `employer-supabase.jsx`: mapování `status = job.status === 'active' ? 'active' : 'paused'` (starý `filled` v DB = Neaktivní, jde znovu zapnout přepínačem); `acceptCandidate(matchId)` už **nepřepíná** `jobs.status` na `filled` (dřív první přijatý kandidát shodil inzerát z appky — volá ho jen starý `CandidateDrawer`, ale kdyby se Přijmout zase napojilo). `employer-pages3.jsx`: pryč `_JB_STATES.filled`, filtr a skupina „Naplněné", pevný štítek místo přepínače v detailu; `_jbStatusMap` mapuje `filled` → `inactive`. `index.html`: pryč `.e-jb-karta[data-stav="filled"]`. Průběh náboru v detailu dál ukáže krok „Obsazeno", když přijatých ≥ počet míst — jen jako informace, stav se tím nemění. Ukázky (`employer-demo.jsx` v7, `employer-data.jsx` v3) `filled` → `paused`. **DB:** beze změny schématu; kdo má v DB `status = 'filled'`, v dashboardu ho uvidí jako Neaktivní (případně `update jobs set status = 'expired' where status = 'filled'`).
- **Pás čísel (`EMetriky`) zrušený úplně** — komponenta i export ze shellu, styly `.e-pruh-klik`, `.e-uchyt-v`, `.e-pruh`/`.e-pruh-ram` z `index.html`. Zmizel ze Zpráv, Recenzí, Plánu směn a Inzerátů (Yasin: „hrozně těžký se v tom vyznat"). Klíč `emp-cisla-skryte` v localStorage už nic nedělá.
  - Recenze: průměr a počet hodnocení jsou teď pod nadpisem karty *Rozložení hvězd*.
  - Plán směn: filtr neobsazených směn je pilulka **Neobsazené N** na konci řady filtrů u kalendáře (`openOnly`, `openCount`).
  - Inzeráty: limit tarifu dál hlídá okno při zapnutí inzerátu (`dotaz` druh `'limit'`).
- **Nový Dashboard** (`EDashboard`, `employer-dashboard.jsx`) — všechno ze skutečných dat, nic vymyšleného:
  - *Co je potřeba udělat* — u každé položky profilovka (u víc zájemců dvě přes sebe, `_EDbAvatar`), logo firmy nebo fotka inzerátu. Kdo čeká na odpověď ve Zprávách (poslední zpráva je od kandidáta; „Odepsat" otevře rovnou to vlákno přes `onOpenChat`), noví zájemci seskupení po inzerátech („Projít" → Kandidáti s filtrem na inzerát přes `window.__empCandJob`), žádný aktivní inzerát / víc aktivních než tarif, urgentní inzerát bez lidí, nedoplněný profil firmy (název, logo, popis > 30 znaků, obor, adresa — jen sloupce, které v DB už jsou). Řazené podle toho, kdo čeká nejdéle; nad 24 h oranžově „čeká 3 dny". Víc než 6 položek → „Ukázat všech N".
  - Vpravo vedle úkolů *Tarif* (aktivní inzeráty „2 z 2" s dílky, kolik jich ještě jde zapnout, topování tento měsíc) a *Nábor* (výběr období je tady, ne v hlavičce; zhlédnutí jen když `job_views` má datum).
  - *Vaše inzeráty* přes celou šířku — karty 1:1 z Inzerátů (`EJobKartaApp`) v řadě do strany (`_EDbInzeraty`: vejde se celý počet karet, min. 290 px, snap na kartu, šipky ‹ › jen když se nevejdou). Nad kartou stav (Urgentní · termín za 2 dny / Aktivní / Neaktivní / Naplněno z `_JB_STATES`). Klik na kartu otevře detail inzerátu (adresa `#inzeraty/<id>`). Yasin: tabulka byla „jenom text".
  - Dole *Poslední aktivita* a *Hodnocení*.
  - Styly `.e-db-rad`, `.e-db-ukol`, `.e-db-mriz`, `.e-db-telo` v `index.html`; řada karet používá `.e-kand-radek` (skrytý posuvník). Pod 1200 px jeden sloupec, na mobilu úkoly zúžené.
- **`employer-supabase.jsx`:** vlákno má nová pole `lastAt` (čas poslední zprávy, ISO) — Dashboard z něj počítá, jak dlouho kandidát čeká — a `photo` (`avatar_url` brigádníka). `employer-main.jsx` ho přepisuje při příchozí zprávě v reálném čase.
- **Oprava ve Zprávách** (`EMessages`): odeslané zprávy se zapisují i do globálního `E_THREADS` (efekt nad `threads`). Dřív po přepnutí záložky zmizely až do obnovení dat a Dashboard by dál hlásil „čeká na odpověď".
- **Animace přechodu záložek** (`index.html`, `eObsahIn`): pravidla přečíslovaná — tělo je teď 2. dítě rámu (dřív 3. pod pásem čísel).

### Databáze (Supabase) — co je potřeba u tebe

- **Spustit `supabase/migration_profil_firmy.sql`** (je z 26. 9., pořád čeká). Ověřeno 30. 9. přes REST (`select=<sloupec>&limit=0`, žádná data): v `profiles` **chybí `cover_url`, `career_url`, `contact_email`, `opening_hours`** (`founded` a `phone` už jsou). Bez nich se fotka pozadí profilu firmy neuloží — Yasin: „vždycky zmizne". Migrace je jen `add column if not exists`, klidně celá znovu.
- Dashboard teď ukládá tyhle sloupce **každý zvlášť** (`uloz` v `employer-firma.jsx`) — co v DB je, uloží se, a firma dostane hlášku, co přesně se neuložilo. A po uložení se záložka už **nepřemountuje** (`employer-main.jsx`: `emp-profil-ulozen` → `setUnreadNudge` místo `setTick`) — dřív to zahodilo hlášku i neuloženou fotku, takže nebylo vidět proč.

**Pozor při přenosu:** pokud u sebe `EMetriky` někde používáš mimo tyhle záložky, po převzetí shellu spadne — komponenta už neexistuje.

---

## 2026-09-29 — dashboard: topování, urgentní, roletky v okně inzerátu, nové Kandidáti — čeká na nasazení

> **Pro Samova Clauda:** celý den na `employer/` + filtr „Kdy" a pilulka TOP v appce
> (repo `makej-aplikace-yasin`). Nejsnáz převzít celou složku `employer/` (včetně nové
> `employer/demo-kandidati/`) a `supabase/migration_topovani.sql`. **Databáze:** spustit
> `migration_topovani.sql` (tabulka `job_topovani`) — bez ní vše funguje, jen se limit
> topování počítá odhadem. Jinak žádná změna schématu.

### Výsledný stav — co si vzít

- **Verze v `employer/index.html`:** shell v63, pages v77, demo v6, pages3 v188, supabase v22, main v52 (ostatní beze změny). Nové styly v `index.html`: `.e-zlato` + `.e-zlato__lesk` (zlatý kov, `@keyframes eGoldFlow / eGoldSheen`), `.e-jb-karta[data-stav=…]`, `.e-uchyt-v` (úchyt pásu čísel), `.e-kand-radek`, `.e-ram.e-ram-dolu`, `@keyframes njRolIn`.
- **Okno Nový / Upravit inzerát** (`ENewJobModal`, pages3): Smlouva, Výplata a Kraj jsou roletky (`_NjRoletka` — seznam se vykreslí do `body` přes portal, otevře se nahoru, když dole není místo, ovládá se i klávesnicí). Smlouva má novou volbu **„Dohodou"** (`_NJ_SMLOUVY`, `_njSmlouvaZ` převede i staré „dle domluvy") = firma smlouvu neuvádí; do `jobs.contract` se uloží text `Dohodou`, appka ukáže štítek „Dle domluvy". Výplata má „Neuvádět". Pravidelnost zůstala přepínač o dvou volbách. Žádné pole „Vlastní" s volným textem (rozbíjelo by filtry v appce).
- **Inzeráty — seznam** (`EJobs`): stav „ASAP" přejmenovaný na **„Urgentní"** a **fialový** (`_JB_STATES.asap` #6A1FD1 / #F1E8FF), červená zmizela (i v Nastavení → `SettingsProfile`). Pořadí: urgentní první, pak aktivní, neaktivní, naplněné; na záložce Vše nadpisy skupin s barevnými štítky (`_SKUP`), urgentní jsou součástí skupiny Aktivní (+ fialový čip „N urgentní · směna do 2 dnů"). Karty mají `data-stav`: urgentní fialový rámeček, neaktivní šedé, naplněné ztlumené.
- **Topování** (dřív „Boostnout"): pod kartou inzerátu zlaté tlačítko **Topovat** (`className="e-zlato"`) → okno „Opravdu chcete inzerát topovat?" (co to udělá, kolik topování zbývá tento měsíc, kdy přibudou nová) → `topovatJobE(jobId)` v `employer-supabase.jsx`: `jobs.top_until = now() + 72 h` (`E_TOP_HODIN`) + řádek do `job_topovani`. Limit podle tarifu `EMPLOYER_TOP_MESICNE` v `employer-pages.jsx` (Základní 0, Výhodný 1, Dynamický 3, Maximální 5, Vlastní 5); tarif je zatím napevno „Standard" → Výhodný. Topovaný inzerát má místo tlačítka „TOP · ještě 1 d 17 h" a na kartě i v náhledu detailu zlatou pilulku **TOP** (`_JbTop`) — 1:1 zlatý odznáček „Byl jsem u toho" z waitlistu, bez ikonky. Neaktivní inzerát topovat nejde (hláška). Limit zatím hlídá jen dashboard — až bude tarif firmy v DB, patří kontrola do RPC.
- **Filtry přesunou na začátek:** přepnutí záložky / výběru / řazení / hledání odroluje seznam nahoru (`_eSeznamNaZacatek` v shellu, volá se z `EFiltrPrepinac`, `EFiltrVyber`, `EFiltrRazeni`, `EFiltrHledat`).
- **Pás čísel jde sbalit** (`EMetriky`): úchyt `.e-uchyt-v` pod pásem (stejný princip jako úchyt levého menu), stav v `localStorage` `emp-cisla-skryte`.
- **Kandidáti — přestavěné** (`ECandidates`, pages3): bez hlavičky a čísel, jen seznam až ke spodnímu kraji (`e-ram e-ram-dolu`). Tři řádky mini profilů pod sebou — *Nejlépe hodnocení*, *Čekají na vaši odpověď*, *Už pro vás pracovali* — každý se posouvá do strany (`_EcRadek`). Karta `_EcKarta`: fotka (bez fotky modrý podklad s iniciálami), stav (Nová shoda / Najato…), odznak důvěry, jméno + věk, hodnocení · město, 3 řádky „o mně", na co reagoval, Napsat / Nabídnout směnu; klik = profil. Řádek jako Airbnb: do šířky se vejde celý počet karet (šířka se dopočítá, min. 190 px, počítá se z šířky při rozbaleném menu — sbalení menu počet nezmění), posun se vždy dorovná na začátek karty (`scroll-snap x mandatory`). Filtry jsou schované v ikonce trychtýře vlevo nahoře (`_EcFiltr`): klik rozbalí průsvitnou rozmazanou lištu zleva doprava (clip-path přes Web Animations), po výběru zajede zpátky do ikonky. Řazení a čísla nahoře zmizely.
- **Nová data kandidáta** (`toCandidate` v `employer-supabase.jsx`): `age` (z `birth_date`), `photo` (`avatar_url`), `bio`, `city`.
- **Ukázkoví kandidáti** (`eDemoKandidati()` v `employer-demo.jsx`, fotky `employer/demo-kandidati/p1–p13.jpg` = ukázkoví lidé z appky): 13 lidí k ukázkovým inzerátům, jen v Kandidátech, do čísel se nepočítají, zpráva/nabídka jim jen ukáže hlášku. Profil ukázkového kandidáta se otevře bez načítání (`EWorkerProfileModal` v main: bez `workerId` nic nenačítá). **PŘED RELEASEM:** `E_DEMO_INZERATY = false` vypne ukázkové inzeráty i kandidáty (nebo smazat `employer-demo.jsx`, jeho `<script>` a složku `demo-kandidati/`).

### Databáze (Supabase) — co je potřeba u tebe

- **Spustit** `supabase/migration_topovani.sql` — tabulka `job_topovani` (`job_id`, `employer_id default auth.uid()`, `started_at`, `ends_at`) + RLS: firma čte a zapisuje jen svoje, jen k vlastním inzerátům; mazat/upravovat nesmí. Zapsáno i v `DATABASE.md` (repo appky). Dokud není, dashboard počítá limit z `jobs.top_until` (každý inzerát pak nejvýš jednou za měsíc).
- `jobs.contract` může nově obsahovat `Dohodou` — bez změny schématu (sloupec je volný text).

### Appka (repo makej-aplikace-yasin, stejný den) — `worker-swipe.jsx?v=122`

- **Filtr „Kdy"** (`W_FILTERS` klíč `kdy`, `W_FILTER_EMPTY.kdy`): skupina *Den* (Ve všední dny / O víkendu) a *Denní doba* (Ranní do 11:00 / Odpolední 11–16 / Večerní a noční od 16:00). Logika `_wJobMatchesKdy` — z `jobs.date` a `time_start` (u ukázek z textu `when`/`time`) a ze štítků („Víkendy", „Ranní směna"…); uvnitř skupiny „nebo", mezi skupinami „a zároveň". Počty u voleb `_wKdyJen`. Volby mají šedou poznámku a nadpis skupiny (`genericBody`). „Dnes/Zítra" záměrně ne.
- **Topované první:** `_wComputeFeed` po filtrech řadí `job.boosted` (top_until v budoucnu) na začátek; RPC `get_feed_jobs` už řadí taky, tohle platí i pro stránky dotažené později.
- **Pilulka TOP** (`WTopBadge`) na kartě vedle štítku úvazku a v detailu nad názvem — stejná jako `_JbTop` v dashboardu (při změně upravit obě).
- Dlaždice Smlouva v detailu ukáže neznámý text z `job.contract`, jak je (hlavně „Dohodou"), místo „Brigáda".
- Oprava: tlačítko ve filtru psalo „Ukázat brigád" bez čísla → „Ukázat 12 brigád".

---

## 2026-09-28 — firemní dashboard: inzeráty podle appky, statistiky, kandidáti — čeká na nasazení

> **Pro Samova Clauda:** celý den na `employer/` (+ drobnosti v appce, ta je v repu
> `makej-aplikace-yasin`). Platí výsledný stav níž. Nejsnáz převzít celou složku
> `employer/` a nové soubory v `supabase/`. **Databáze:** tabulka „Čeká v Supabase" dole
> (worker_trust_stats, jobs.positions/hours_per_week, ověřit job_views.created_at).
> Edge Function `import-inzerat` je už nasazená (Yasin přes dashboard).

### Výsledný stav — co si vzít

- **Verze v `employer/index.html`:** shell v61, dashboard v40, pages3 v170, main v51, supabase v20, firma v5, `_premium/analytics` v40, **nový** `employer-demo.jsx` v4 (načítá se před pages3). Nové styly v `index.html`: pevné rozvržení (`.e-ram`, `.e-volne`), filtry (`.e-filtr*`), odezva tlačítek v okně inzerátu (`.nj-*`) a v detailu (`.e-det-tl`, `.e-det-boost`), odznáčky důvěry (`.wlvl*`, zkopírováno z appky).
- **Pevné rozvržení:** všechny záložky (kromě Profilu firmy) drží na obrazovce, posouvá se jen vnitřek seznamů (≥ 821 px). Bez „odskakování" při přetažení (overscroll jen na posuvných částech).
- **Filtry:** společné komponenty v shellu `EFiltrLista / EFiltrPrepinac / EFiltrRazeni / EFiltrHledat / EFiltrVyber`; řazení a hledání jako ikonky. Použité v Inzerátech, Kandidátech a Recenzích. Pás čísel (`EMetriky`) menší.
- **Inzeráty — seznam:** karty 1:1 jako swipovací karta v appce (`EJobKartaApp`): štítek úvazku se počítá ze smlouvy jako `makej-badge.jsx` (DPP/DPČ → Brigáda, HPP → Plný/Zkrácený/Částečný úvazek, IČO → Na IČO, nic → Dle domluvy), iniciály firmy (appka logo nezobrazuje), pod kartou zobrazení / zájemci / čeká. **Ukázkové inzeráty** (`employer-demo.jsx`, `E_DEMO_INZERATY = true`) — jen v seznamu, do čísel se nepočítají, nic se neukládá. **PŘED RELEASEM vypnout** (`false`) nebo smazat soubor i `<script>`.
- **Inzeráty — detail:** vlevo náhled karty, vpravo panel stejně vysoký: *Výkon* (čárový graf zhlédnutí po dnech od zveřejnění, max. 30 dní — z `job_views.created_at`; expirace + Prodloužit), *Průběh náboru* (Zveřejněno → Má zájem → Přijato „x z y míst" → Obsazeno), patička *Stav: Aktivní | Neaktivní* (přepínač, zelená/červená, pozastavení s potvrzením, zapnutí hlídá limit tarifu), Kandidáti (+ „X čeká"), Statistiky, Boostnout; Upravit vpravo nahoře. **Statistiky** přepnou panel na základní statistiky inzerátu (`EJobStatistiky`: věk, vzdělání, dny a hodiny zájmu) — starý `JobStatsDrawer` (vymyšlené pohlaví/věk) se už nevolá.
- **Okno Nový / Upravit inzerát** (`ENewJobModal`) přestavěné podle detailu inzerátu v appce — jen pole, která appka ukazuje nebo filtruje. 4 kroky: *Pozice a odměna* (název, smlouva + úvazek u HPP, pravidelnost, výplata, odměna, počet lidí, **fotky** — nahrání do bucketu `uploads`, pořadí přetažením, první = karta), *Kdy a kde* (datum, čas, místo, kraj), *Náplň práce* (popis, Co od tebe čekáme / Co oceníme / Co ti nabídneme), *Benefity a štítky* (benefity, Co potřebuješ, vlastnosti). Vlevo náhled **Karta | Celý inzerát** (`EJobDetailApp` = kopie `WJobDetailModal`). Úprava otevře totéž předvyplněné, uloží `updateJobE`. Pryč pole, která se nikam neukládala (obory, platnost, kontaktní osoba…).
- **Zápis inzerátu** (`createJobE` / `updateJobE` v `employer-supabase.jsx`): nově i `contract, recurrence, payout, duties, expectations, bonuses, offer, perks, photos, image_url` (sloupce z 2026-08-22) + `positions, hours_per_week` (zatím nejsou — `_jobsZapis` při chybě PGRST204 sloupec vynechá a uloží znovu). `job_type` se odvozuje ze smlouvy/pravidelnosti. **Oprava:** kraj se ukládá jako id (`jihomoravsky`), dřív se z okna ukládal název („Jihomoravský") a filtr krajů v appce ho nenašel — převod starých řádků je v `migration_jobs_pocet_a_hodiny.sql`.
- **Vložit z odkazu:** v okně Nový inzerát tlačítko „Vložit z odkazu" (odkaz nebo text) → Edge Function `import-inzerat` → vyplní formulář; firma volí „Do stylu Makej" (Claude přepíše, tykání) nebo „Doslovně". Viz níž „Nasazeno".
- **Kandidáti:** karty bez barev, odznak stupně důvěry jako v appce (Nový/Spolehlivý/Ověřený/Top — z `worker_trust_stats`, dokud funkce není, odznak se neukáže), klik na jméno/fotku = profil, filtr podle inzerátu, bez postranního panelu. **„Nabídnout směnu"** → výběr aktivního inzerátu → do chatu přijde karta inzerátu (`messages.type = 'job_offer'`, `metadata {job_id,title,pay,pay_unit,location,date}`, `sendJobOfferE`). Zprávy ji vykreslí jako kartu.
- **Statistiky** (dřív Analytika): základní pro všechny tarify (věk, vzdělání, kdy lidé reagují — skutečná data), plné sekce od Dynamického rozmazané s oknem „od tarifu Dynamický"; CSV export jen s plnými. **Pozor:** plné sekce (mapa, kanály, doba odpovědi…) jsou pořád vymyšlená data.
- **Profil brigádníka** (okno z Kandidátů/Zpráv): odznak důvěry + Hodnocení / Dokončené směny / Spolehlivost (pryč `profiles.level`/`jobs_done`, appka je nezapisuje).

### Appka (repo makej-aplikace-yasin, stejný den)

- `messages.type = 'job_offer'`: chat ukáže kartu nabídnutého inzerátu (`WJobOfferCard`), klik otevře detail, „Mám zájem" → `createMatchW`. `worker-messages.jsx?v=24`, `worker-supabase.jsx?v=15` (`fetchJobOfferW`, náhled vlákna „Nabídka brigády").
- `jobToCard`: „Přidáno …" i u inzerátů z DB (z `created_at`); detail inzerátu ukáže pod smlouvou „Výplata týdně" apod. ze sloupce `payout`. `worker-swipe.jsx?v=116`.
- Pokud má `messages.type` v DB CHECK s výčtem typů, přidat `'job_offer'` (zapsáno v DATABASE.md).

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
| 2026-10-02 | Tabulka `overeni_firem` + triggery (žádost o ověření firmy, e-mail na podpora@makej.eu, schválení zapne `verified`). **Spouští Yasin sám.** | `makej-web-sam/supabase/migration_overeni_firem.sql` |
| 2026-09-06 | `launch_list_pocet()` — počet zapsaných na čekacím listu. Dokud neexistuje, web řádek s počtem a postavičkami vůbec nezobrazí (nechceme vymyšlené číslo). | `makej-web-sam/supabase/migration_launch_pocet.sql` |

**Spuštěno 2026-10-02 (Yasin sám v SQL Editoru, ověřeno přes REST):** `migration_profil_firmy.sql`
(nové sloupce `profiles`), `migration_urgentni.sql`, `migration_topovani.sql` a `jobs.hours_per_week`.
Týž den i `migration_worker_trust.sql`, `job_views.created_at`, převod krajů v `jobs.kraj`, ochranný
trigger `profiles_chranene_sloupce` (firma si sama nezmění `verified`, `rating`, `plan`) a z appky
`migration_karta_fotky.sql` + `migration_lide_strankovani.sql`. Tabulka `blocks` s triggerem už byla. Podrobně v `DATABASE.md` (repo appky).
Dočasná náhradní řešení v dashboardu (urgentní v localStorage, údaje profilu v `branding`) jsou pryč.

**Nasazeno 2026-09-28 (Yasin přes dashboard, ověřeno):** Edge Function `import-inzerat` + secret `ANTHROPIC_API_KEY` (vlastní klíč, s limitem útraty). Firma v okně Nový inzerát klikne „Vložit z odkazu" (nebo vloží text) → funkce stáhne stránku, rozebere ji (JSON-LD JobPosting + nadpisy) a přes Claude (`claude-sonnet-5`) ho buď přepíše do stylu appky, nebo převezme doslovně a jen roztřídí do sekcí — firma si vybere v okénku („Jak chcete text převzít?", parametr `styl: 'makej' | 'doslovne'`). Kód `makej-web-sam/supabase/functions/import-inzerat/index.ts` (jeden soubor). Při změně kódu nasadit znovu (dashboard → Edge Functions → import-inzerat → Code, nebo `supabase functions deploy import-inzerat --project-ref cxegfwfbgcgpwerfbvra`).

## Čeká na tobě jinde

- **Allowlist typů souborů na bucketu `chat-prilohy`** (server, ne prohlížeč):
  `allowed_mime_types = image/jpeg,image/png,image/webp,image/heic,application/pdf`,
  `file_size_limit = 10485760`. **SVG nepovolovat** (nese JS → XSS). Dnes tam
  projde i `.php`/`.exe` — `accept="image/*"` je jen nápověda prohlížeči.
- **Před spuštěním appky:** zapnout Google provider v Authentication (tlačítka
  Google na webu i v appce teď končí chybou) a zapnout **Confirm email** (dnes
  je autoconfirm → jdou zakládat účty na cizí adresy). Obojí je vypnuté záměrně,
  ale ven to takhle nesmí.
