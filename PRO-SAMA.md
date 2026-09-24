# Předávka pro Sama

> Co u nás (Yasin) přibylo a co z toho potřebuje něco udělat na tvé straně.
> **Novější nahoře, u všeho je datum** — co už máš nasazené, je označené.
> Podrobnosti k webu jsou v `STAV.md`, změny databáze v `DATABASE.md`
> (repo mobilní appky). Tenhle soubor je jen seznam k předání.

---

## 2026-09-24 — čeká na nasazení

> **Pro Samova Clauda:** náš web se od 11. 9. rozešel s tvým. V tomhle pushi je
> **srovnaný s tvým stavem k 23. 9.** (tvé texty, ceník, o nás, blog, patička) a navrch
> jsou naše nové změny. Níž je rozdělené na **co si vzít od nás** a **co jsme vzali od
> tebe** (to zpátky nepřenášej). U každé položky jsou jména funkcí a tříd — hledej podle
> nich, čísla řádků se u tebe liší. Web: `style.css?v=143`, `script.js?v=59`.

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
