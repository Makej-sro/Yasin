# ROADMAP — kam jdeme

*Aktuální k 10. 9. 2026. Bez veřejného data spuštění — na webu říkáme „brzy".*

## 1. Teď: dostat appku do App Store

**Blokuje to mimo kód:** založená firma a placený vývojářský účet u Apple.
Bez toho se nedá vydat nic, ani otestovat přihlášení přes Apple.

**Co musí být hotové v kódu, než to půjde ven:**
- Vypnout přístupový klíč u přihlášení (na třech místech).
- Vypnout demo profil s ukázkovými brigádami a výdělky.
- Smazat vývojářské automatické načítání změn.
- V Supabase zapnout přihlášení přes Google a ověřování e-mailu.
- Na úložišti příloh povolit jen obrázky a PDF, s limitem velikosti na serveru.
- Filtr sprostých slov přesunout do databáze, dnes jde obejít.
- Doplnit vyřizování nahlášeného obsahu — Apple chce reakci do 24 hodin.

## 2. Nespuštěné změny databáze

| Co | K čemu |
|---|---|
| `blocks` | Blokování uživatelů. Rozhraní hotové, databáze chybí. |
| `launch_list_pocet` | Skutečný počet zapsaných na čekacím listu. Dokud není, web to číslo vůbec neukazuje. |
| `shifts` | Opakované směny a jejich potvrzování v chatu. Navrženo, nepostaveno. |
| `last_seen` | Zelená tečka „online". Dnes jen naoko v demu. |

## 3. Rozdělané funkce

- **Návrh směny v chatu** — firma pošle kartičku s termínem, brigádník potvrdí.
- **Onboarding profilu** — dovést nového člověka k vyplněnému profilu.
- **Editor ceny v sekci Lidé** — částka plus jednotka (hodina, úkol, kus, den).
- **Ukazatel spolehlivosti** na kartě člověka.
- **Galerie fotek u inzerátu** — appka to umí zobrazit, dashboard neumí nahrát.

## 4. Po spuštění

- Sjednotit repozitáře do jedné struktury, aby se appka, web a dashboard
  nasazovaly společně.
- Android.
- Biometrické přihlášení (Face ID).

## 5. Byznys, nejmíň vyřešené

- **Prázdný start.** Bez inzerátů nepřijdou brigádníci, bez brigádníků firmy.
  Potřebujeme plán, čím tenhle kruh rozseknout.
- Získat prvních pár firem v Brně a okolí.
- Obsah na sítě, aby čekací list rostl ještě před spuštěním.
