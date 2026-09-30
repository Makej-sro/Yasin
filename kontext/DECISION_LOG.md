# DECISION_LOG — proč jsme věci udělali

*Novější nahoře. Rozhodnutí nejsou svatá, ale zpochybnit je má smysl jen s novým
argumentem — jinak se točíme dokola.*

---

**30. 9. 2026 — Firemní dashboard: všechno důležité na jedné záložce, ostatní bez čísel.**
Pás s čísly nahoře zmizel ze všech záložek. Dashboard je teď přehled: „Co je potřeba
udělat" (kdo čeká na odpověď, noví zájemci, inzeráty, nedoplněný profil — každá
položka jedním klikem vede tam, kde se vyřídí), karty inzerátů tak, jak je vidí
brigádník, tarif (kolik inzerátů ještě jde zapnout) a výsledky náboru.
*Proč:* stejná čísla na každé záložce mátla — nebylo jasné, kde co hledat. Firma má
mít jedno místo, kde uvidí, co ji čeká.

**30. 9. 2026 — Inzerát nemá stav „Naplněno", jen aktivní a neaktivní.**
*Proč:* nepoznáme spolehlivě, kdy je brigáda opravdu obsazená, a firma stejný inzerát
za pár měsíců zapne znovu. Kdo nechce, aby ho brigádníci viděli, přepne ho na neaktivní.

**30. 9. 2026 — „Nový inzerát" je nahoře v levém menu.**
Tlačítko je trvale na jednom místě (a navíc v záložce Inzeráty), z hlaviček ostatních
záložek zmizelo. *Proč:* lidé si jedno místo zapamatují a nahoře je víc prostoru.

**30. 9. 2026 — Inzeráty v řadách do strany, bez filtrů.**
Topované → Urgentní → Aktivní → Neaktivní, každá řada se posouvá do strany jako
Kandidáti. *Proč:* firma má pár inzerátů, filtry a řazení byly zbytečné.

**30. 9. 2026 — Úvodní fotka profilu firmy se upravuje jako na Facebooku.**
Po nahrání se fotka posouvá a přibližuje přímo na profilu, Zrušit / Uložit. Fotky
(úvodní i logo) se ukládají hned, ne až tlačítkem „Uložit změny".
*Proč:* firma si má fotku sama vycentrovat; výřez se uloží přesně tak, jak ho nastavila.

**30. 9. 2026 — V rozhraní žádné vysvětlivky.**
Žádné nápovědy typu „přetažením posunete", podtitulky ani šedé poznámky u nadpisů.
*Proč:* zahlcuje to obrazovku; ovládání má být jasné samo.

**29. 9. 2026 — Topování = 72 hodin mezi prvními kartami, počet podle tarifu.**
Firma u inzerátu klikne „Topovat" a inzerát je tři dny první v tom, co si brigádník
vyfiltruje, se zlatou pilulkou TOP. Kolikrát za měsíc smí, určuje tarif (Základní 0,
Výhodný 1, Dynamický 3, Maximální 5). Před potvrzením se appka zeptá a ukáže, kolik
topování zbývá.
*Proč:* na portálech topování znamená vyšší pozici ve výpisu — u nás je výpis
balíček karet, takže „výš" znamená dřív. Tři dny stačí, aby to viděli lidé, kteří
appku otevírají obden, a limit drží topování vzácné, jinak by nic neznamenalo.

**29. 9. 2026 — Urgentní inzeráty jsou fialové, ne červené.**
*Proč:* červená působí jako chyba nebo problém. Urgentní inzerát je naopak příležitost
(směna do dvou dnů), tak má výraznou, ale ne poplašnou barvu.

**29. 9. 2026 — Firma nepíše vlastní smlouvu, jen vybírá z roletky (s volbou „Dohodou").**
*Proč:* volný text by rozbil filtry v appce — brigádník filtruje podle přesných
hodnot. Kdo smlouvu uvádět nechce, zvolí „Dohodou" a na kartě je „Dle domluvy".

**29. 9. 2026 — Filtr „Kdy" v appce je den (všední / víkend) a denní doba, bez „Dnes".**
*Proč:* brigádu si nikdo nehledá na dnešek, spíš podle toho, kdy má volno. Příliš
jemné filtry by zabily překvapení ze swipování, proto jen pár hrubých voleb.

**11. 9. 2026 — Sekce „Proč" jsou pruh ilustrací, ne seznam textů.**
Šest důvodů pro brigádníky a čtyři pro firmy má každý svou 3D ilustraci,
pod ní nadpis a jednu větu. Žádné kartičky ani rámečky.
*Proč:* šest holých textových boxů vedle sebe vypadalo jako šablona. Vzor je
bolt.eu. *Pravidlo k tomu:* ilustrace musí být na průhledném pozadí a vsazené
do stejného plátna se stejnou plochou objektu, jinak jedna v řadě vyčnívá.

**10. 9. 2026 — Na stránce Hledám si práci jsou skutečné fotky.**
Tři kroky ilustrují reálné fotografie, u prvního je člověk v tričku Makej
s appkou v ruce.
*Proč:* vygenerované obrázky vypadaly obecně a nesly rukopis AI. Fotka z Brna
působí věrohodněji. *Pozor:* kupovat místo toho fotobanku by bylo horší —
připojili bychom tvář skutečného člověka k vymyšlenému jménu a tvrzení, což
většina licencí zakazuje. Proto buď vlastní lidé se souhlasem, nebo kreslené.

**10. 9. 2026 — V čekacím listu se neptáme na roli.**
Jen kolonka na e-mail. Kdo chce, může si založit i účet, ale bez určení, jestli
je brigádník nebo firma. Roli si vybere až v onboardingu, kde ho to teprve navede
na IČO a firemní údaje.
*Proč:* ptát se na právní formu dřív, než je co používat, jen prodlužuje formulář.
Krátce tam přepínač fyzická/právnická byl, ale zavrhli jsme ho.

**6. 9. 2026 — Cookies jsou opravdové opt-in, ne jen lišta.**
Do souhlasu se nenačte ani skript Google Analytics. Seznam cookies na webu se
generuje z kódu, takže nemůže tvrdit něco jiného, než web dělá.
*Proč:* předtím lišta psala „používáme jen nezbytné cookies" a přitom měření
běželo od prvního načtení. To je přesně to, na co chodí kontrola.

**6. 9. 2026 — Jednotné pozadí místo pruhů.**
Bílá plocha se světelnou aurorou, jedno šedé plátno pro všechny sekce, ploché
modré bloky. Pryč přechody z modré do bílé, které byly na každé stránce jinak.
*Proč:* působilo to roztříštěně a staře.

**6. 9. 2026 — Žádné fotorealistické AI tváře u počtu uživatelů.**
Ilustrované postavičky ano, vygenerované fotky lidí ne.
*Proč:* vedle věty „tolik lidí už je s námi" by to vydávalo vymyšlené lidi za
skutečně zapsané.

**Srpen 2026 — Žádná vymyšlená čísla.**
Nikde neuvádíme počty uživatelů, dokud to není skutečné číslo ze serveru.
Zrušili jsme i smyšlený odpočet „zbývá posledních X míst".
*Proč:* první, kdo si to ověří, ztratí důvěru ve zbytek. Radši nic než slib,
který neumíme krýt.

**Srpen 2026 — Sekce Lidé je tržiště, ne swipe.**
Lidé se procházejí a filtrují jako nabídky, ne odklikávají palcem.
*Proč:* u lidí je swipe nepříjemný a hledá se cíleně, ne náhodně.

**Srpen 2026 — U sekce Lidé rozhoduje dojezd toho, kdo službu nabízí.**
Ne posuvník toho, kdo hledá.
*Proč:* nabízející ví, kam je ochoten dojet; hledající to za něj odhadovat nemá.

**Srpen 2026 — Vzdálenost místo výběru krajů.**
Brigádník zvolí město a kolik kilometrů je ochoten dojíždět.
*Proč:* kraj je administrativní hranice, která s dojížděním nesouvisí.

**Srpen 2026 — Druhá záložka je Kalendář, ne seznam brigád.**
*Proč:* u brigád je nejdůležitější otázka „kdy mám kam jít", ne seznam.

**3. 9. 2026 — Nahlašování obsahu.**
Každý inzerát, profil, konverzace i hodnocení jde nahlásit.
*Proč:* Apple to vyžaduje u všeho, kam uživatelé píšou (pravidlo 1.2). Bez toho
appku do obchodu nepustí.

**Červenec 2026 — Přihlášení je zamčené přístupovým klíčem.**
Registrace je volná, dovnitř se ale bez klíče nedostane nikdo.
*Proč:* rozhraní ještě nejsou hotová, ale účty chceme sbírat už teď.
*Pozor:* před spuštěním se klíč musí vypnout na třech místech.
