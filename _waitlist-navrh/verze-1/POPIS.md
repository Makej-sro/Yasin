# Waitlist — VERZE 1 (aktuální, minimalistická)

Snapshot celého webu (`index.html`, `style.css`, `script.js`) ve stavu waitlistu
verze 1. Náhled: `nahled.png`.

## Jak verze 1 vypadá
- **Pozadí:** plná modrá `#0020F6` + bílé tečky (canvas).
- **Kurzor = repel:** tečky u kurzoru se plynule odsunou pryč a stejně plynule se
  vrátí (smoothstep + ease), `heat` je jemně zvýrazní. Modul `repel` v `script.js`,
  ladí se přes `CFG` (radius 50, maxOffset 14, ease 0.16). Pod tím jemný ambient flow.
- **Jeden panel = „frosted glass":** tmavší modrý tint `rgba(1,10,66,.44)` +
  `backdrop-filter: blur(16px)` → rozmaže tečky za textem = čitelné a zároveň glossy;
  světlý okraj + horní highlight + stín (`.wl-card`).
- **Vše v jednom panelu** (minimalisticky): titulek → odpočet (čistá čísla, bez boxů)
  → podnadpis → **switch brigádník/firma** → 4 výhody (čisté řádky s hairline linkami,
  **žádné fajfky v kroužcích**) → CTA → social důkaz dole.
- **Odznak** „Byl jsem u toho": jemný **bílý obrys** (žádná fialová).
- **Chat bublina** (`#makac-widget` z `chat-widget.js`) je nad waitlistem **schovaná**
  (`.wl-fs.active ~ #makac-widget { display:none }`), na zbytku webu zůstává.

## Jak obnovit verzi 1
`cp _waitlist-navrh/verze-1/{index.html,style.css,script.js} .`
(přepíše aktuální stav.)

## Verze 2 (jiný směr)
Mapa krajů ČR + boxy — záloha v `_waitlist-navrh/verze-2/`, data `kraje-data.js`.
