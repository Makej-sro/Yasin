# Waitlist — VERZE 1 (záloha)

Snapshot celého webu (`index.html`, `style.css`, `script.js`) ve stavu waitlistu
verze 1. Náhled: `nahled.png`.

## Jak verze 1 vypadá
- **Pozadí:** plná modrá `#0020F6`.
- **Tečky:** bílé, canvasový **flow field** (z Claude designu) — jemná bílá vlna
  přes modrou, mění se jas/velikost teček.
- **Kurzor:** limetkové `#B6FF00` podsvícení teček v kruhu u kurzoru; po zastavení
  plynule zajede do středu (0,5 s), při pohybu se hned objeví.
- **Hlavička:** bílý text (titulek + podnadpis), bez rámečku.
- **Odpočet / přepínač / (nic dalšího):** světlé boxy, vystupují z modré.
- **Karta** (Sháníš brigádu? / brigádníky?): modrá se světlým rámečkem + stínem,
  bílý text, přepínač worker/employer (plynulý přechod).
- **Social důkaz** („Za posledních 24 h se přihlásilo XX…"): **dole uvnitř karty**
  pod CTA, menší, bílý text + zelený live puntík, oddělený linkou.
- CTA: bílé tlačítko „Chci být u toho".

## Jak obnovit verzi 1
Zkopírovat tyhle tři soubory zpět do kořene webu:
`cp _waitlist-navrh/verze-1/{index.html,style.css,script.js} .`
(pozor: přepíše aktuální stav — tzn. verzi 2).

## Verze 2
Bude úplně jiná — zadání dodá Yasin.
