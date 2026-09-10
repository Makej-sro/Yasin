# PROJECT_CONTEXT — technický stav

*Aktuální k 10. 9. 2026.*

## Z čeho se Makej skládá

| Část | Co to je | Kde běží |
|---|---|---|
| Mobilní appka | Rozhraní brigádníka, obal Capacitor pro iOS | Zatím jen lokálně, chystá se do App Store |
| Webová verze appky | Totéž v prohlížeči | makej.eu/worker |
| Firemní dashboard | Správa inzerátů, kandidátů, chat | makej.eu/employer |
| Marketingový web | Hlavní stránka, blog, právní texty, ceník | makej.eu |

Všechno sdílí **jednu databázi a jedno přihlášení**, takže se změny propisují
mezi appkou a dashboardem přes realtime.

## Technologie

- **Web:** čisté HTML, CSS a JavaScript. Žádný framework, žádný build.
- **Dashboard a appka:** React, ale překládaný **až v prohlížeči** (Babel
  Standalone). Taky bez build kroku. Důsledek: soubory se načítají přímo, takže
  po každé změně se musí zvednout číslo verze v adrese (`?v=N`), jinak návštěvník
  dostane starou verzi z cache. **Tohle je nejčastější zdroj záhadných chyb.**
- **Backend:** Supabase — databáze PostgreSQL, přihlašování, úložiště souborů,
  realtime. Žádný vlastní server.
- **Hosting webu:** Netlify.

## Databáze, hrubý přehled

Hlavní tabulky: `profiles` (lidé i firmy), `jobs` (inzeráty), `matches` (shody),
`messages` (chat včetně příloh a hlasovek), `notifications`, `reviews`,
`reports` (nahlášený obsah), `cities`, `launch_emails` (čekací list),
`consent_log` (evidence souhlasů s cookies).

Data chrání **Row Level Security** — pravidla přímo v databázi, která říkají,
kdo na co smí. Veřejný klíč, který je vidět ve zdrojáku webu, je veřejný záměrně;
bez RLS by ale znamenal díru. Ověřeno, že zvenku nejde přečíst cizí profil,
zprávu ani e-mail z čekacího listu.

## Kdo co nasazuje

Dva vývojáři, dva repozitáře. **Push do repozitáře není nasazení** — druhá strana
si to musí vzít a nasadit ze svého. Proto vedeme předávací dokument `PRO-SAMA.md`
a databázové změny v `DATABASE.md`.

## Co je dnes dočasné a před spuštěním musí pryč

- Přihlášení je zamčené **přístupovým klíčem**, dokud nejsou rozhraní hotová.
- V appce běží **demo profil** s ukázkovými brigádami a výdělky, aby šla ukázat.
- V kódu je vývojářské automatické načítání změn.
- Přihlášení přes Google je v Supabase vypnuté a ověřování e-mailu taky —
  obojí schválně, ale ven to takhle nesmí.

## Známé slabiny

- Filtr sprostých slov běží jen v prohlížeči, jde obejít. Patří do databáze.
- Přílohy v chatu nemají na serveru seznam povolených typů souborů, jen v UI.
- Nahlášený obsah nemá rozhraní pro vyřizování, mění se ručně v databázi.
