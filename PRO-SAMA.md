# Předávka pro Sama

> Co u nás (Yasin) přibylo a co z toho potřebuje něco udělat na tvé straně.
> **Novější nahoře, u všeho je datum** — co už máš nasazené, je označené.
> Podrobnosti k webu jsou v `STAV.md`, změny databáze v `DATABASE.md`
> (repo mobilní appky). Tenhle soubor je jen seznam k předání.

---

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
