-- ════════════════════════════════════════════════════════════════════════════
-- Žádost o ověření firmy (2026-10-02, Yasin + Claude)
-- ════════════════════════════════════════════════════════════════════════════
-- Co to je: v Profilu firmy (karta Dokončeno → „Ověřit firmu") firma vyplní
-- kontaktní e-mail a IČO. Dashboard IČO dohledá v ARES (název, sídlo, jestli
-- firma nezanikla) a zapíše žádost sem. Každá nová žádost pošle e-mail na
-- podpora@makej.eu s údaji a odkazy do ARES a obchodního rejstříku.
--
-- Schválení dělá Yasin ručně: Table Editor → overeni_firem → u žádosti změnit
-- stav na „schvaleno". Trigger pak zapne profiles.verified a firmě pošle
-- e-mail „Vaše firma je ověřená". „zamitnuto" jen uzavře žádost (firma může
-- poslat novou), důvod se firmě píše ručně.
--
-- Firma sama žádost jen podá a vidí. Změnit stav ani si zapnout odznak nemůže:
-- na tabulku nemá pravidlo pro update a profiles.verified hlídá trigger
-- profiles_chranene_sloupce (migration_profil_chranene_sloupce.sql). Trigger
-- tady běží jako security definer, proto ho ochrana pustí.
--
-- Potřebuje makej_posli_email, makej_email_html a html_escape
-- (migration_posilani_emailu.sql, migration_email_sablona.sql). Když e-mail
-- selže, žádost se stejně uloží (výjimka se jen zapíše do logu).
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.overeni_firem (
  id          uuid primary key default gen_random_uuid(),
  firma_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  ico         text not null check (ico ~ '^[0-9]{8}$'),
  email       text not null check (length(email) between 3 and 200 and position('@' in email) > 1),
  nazev_ares  text check (length(nazev_ares) <= 300),   -- jak ho dashboard našel v ARES (jen pro kontrolu)
  adresa_ares text check (length(adresa_ares) <= 400),
  stav        text not null default 'ceka' check (stav in ('ceka', 'schvaleno', 'zamitnuto')),
  created_at  timestamptz not null default now(),
  vyrizeno_at timestamptz
);

-- Jedna čekající žádost na firmu
create unique index if not exists overeni_firem_jedna_cekajici
  on public.overeni_firem (firma_id) where stav = 'ceka';

alter table public.overeni_firem enable row level security;

drop policy if exists "overeni_firem_select_own" on public.overeni_firem;
create policy "overeni_firem_select_own" on public.overeni_firem
  for select using (firma_id = auth.uid());

drop policy if exists "overeni_firem_insert_own" on public.overeni_firem;
create policy "overeni_firem_insert_own" on public.overeni_firem
  for insert with check (firma_id = auth.uid() and stav = 'ceka' and vyrizeno_at is null);

-- Upravovat ani mazat žádosti firma nemůže (stav mění jen Yasin)

-- ── Nová žádost: pojistka proti zahlcení + e-mail Yasinovi ──
create or replace function public.overeni_firem_nova()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $fn$
declare
  v_firma text;
  v_login text;
  v_nazev text;
begin
  -- Víc než 3 žádosti za den od jedné firmy už jsou zahlcování schránky
  if (select count(*) from public.overeni_firem
       where firma_id = new.firma_id and created_at > now() - interval '1 day') >= 3 then
    raise exception 'Příliš mnoho žádostí o ověření, zkuste to zítra.' using errcode = 'P0001';
  end if;

  select company_name into v_firma from public.profiles where id = new.firma_id;
  select email into v_login from auth.users where id = new.firma_id;
  v_nazev := coalesce(nullif(btrim(new.nazev_ares), ''), nullif(btrim(v_firma), ''), 'Bez názvu');

  begin
    perform public.makej_posli_email(
      'podpora@makej.eu',
      'Žádost o ověření: ' || regexp_replace(v_nazev, '[\r\n]+', ' ', 'g') || ' (IČO ' || new.ico || ')',
      public.makej_email_html('Žádost o ověření firmy', public.html_escape(v_nazev),
        '<tr><td style="padding:30px 40px 0;">'
        || '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.6;color:#0a0d2e;">'
        || '<tr><td style="padding:6px 0;color:#6b7394;width:150px;">Název v profilu</td><td style="padding:6px 0;font-weight:700;">' || public.html_escape(coalesce(v_firma, '')) || '</td></tr>'
        || '<tr><td style="padding:6px 0;color:#6b7394;">Název v ARES</td><td style="padding:6px 0;font-weight:700;">' || public.html_escape(coalesce(new.nazev_ares, 'nedohledáno')) || '</td></tr>'
        || '<tr><td style="padding:6px 0;color:#6b7394;">Sídlo v ARES</td><td style="padding:6px 0;">' || public.html_escape(coalesce(new.adresa_ares, '')) || '</td></tr>'
        || '<tr><td style="padding:6px 0;color:#6b7394;">IČO</td><td style="padding:6px 0;font-weight:700;">' || new.ico || '</td></tr>'
        || '<tr><td style="padding:6px 0;color:#6b7394;">Kontaktní e-mail</td><td style="padding:6px 0;">' || public.html_escape(new.email) || '</td></tr>'
        || '<tr><td style="padding:6px 0;color:#6b7394;">Přihlašovací e-mail</td><td style="padding:6px 0;">' || public.html_escape(coalesce(v_login, '')) || '</td></tr>'
        || '<tr><td style="padding:6px 0;color:#6b7394;">ID žádosti</td><td style="padding:6px 0;font-family:monospace;font-size:12px;">' || new.id || '</td></tr>'
        || '</table>'
        || '<p style="margin:22px 0 0;font-size:14px;line-height:1.7;">'
        || '<a href="https://ares.gov.cz/ekonomicke-subjekty?ico=' || new.ico || '" style="color:#0020f6;font-weight:700;">Otevřít v ARES</a> &nbsp;·&nbsp; '
        || '<a href="https://or.justice.cz/ias/ui/rejstrik-$firma?ico=' || new.ico || '" style="color:#0020f6;font-weight:700;">Obchodní rejstřík</a></p>'
        || '<p style="margin:18px 0 30px;font-size:13.5px;line-height:1.7;color:#4b5578;">'
        || 'Schválení: Supabase → Table Editor → <strong>overeni_firem</strong> → u této žádosti změň <strong>stav</strong> na <strong>schvaleno</strong>. '
        || 'Firmě se zapne odznak Ověřená firma a přijde jí e-mail. Zamítnutí: stav <strong>zamitnuto</strong> a firmě napiš důvod sám.</p>'
        || '</td></tr>'),
      false
    );
  exception when others then
    raise warning 'overeni_firem_nova: e-mail o žádosti % se neodeslal — %', new.id, sqlerrm;
  end;
  return new;
end;
$fn$;

drop trigger if exists overeni_firem_nova on public.overeni_firem;
create trigger overeni_firem_nova
  before insert on public.overeni_firem
  for each row execute function public.overeni_firem_nova();

-- ── Vyřízení: stav „schvaleno" zapne odznak, přepnutí pryč ho zase vypne ──
create or replace function public.overeni_firem_vyrizeni()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $fn$
declare
  v_login text;
begin
  if new.stav is not distinct from old.stav then
    return new;
  end if;
  new.vyrizeno_at := case when new.stav = 'ceka' then null else now() end;

  if new.stav = 'schvaleno' then
    update public.profiles set verified = true where id = new.firma_id;
    select email into v_login from auth.users where id = new.firma_id;
    if v_login is not null then
      begin
        perform public.makej_posli_email(
          v_login,
          'Vaše firma je ověřená',
          public.makej_email_html('Vaše firma je ověřená', 'Na profilu firmy teď brigádníci uvidí odznak Ověřená firma.',
            '<tr><td style="padding:30px 40px 30px;text-align:center;">'
            || '<table cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" style="border-radius:999px;background-color:#0020f6;">'
            || '<a href="https://makej.eu/employer/" style="display:inline-block;padding:15px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">Otevřít dashboard</a>'
            || '</td></tr></table></td></tr>'),
          false
        );
      exception when others then
        raise warning 'overeni_firem_vyrizeni: e-mail firmě % se neodeslal — %', new.firma_id, sqlerrm;
      end;
    end if;
  elsif old.stav = 'schvaleno' then
    update public.profiles set verified = false where id = new.firma_id;
  end if;
  return new;
end;
$fn$;

drop trigger if exists overeni_firem_vyrizeni on public.overeni_firem;
create trigger overeni_firem_vyrizeni
  before update on public.overeni_firem
  for each row execute function public.overeni_firem_vyrizeni();

-- Kontrola po spuštění (mají vrátit 3 řádky: tabulka a dva triggery):
select 'tabulka' as co, to_regclass('public.overeni_firem')::text as nazev
union all
select 'trigger', tgname from pg_trigger
 where tgrelid = 'public.overeni_firem'::regclass and tgname in ('overeni_firem_nova', 'overeni_firem_vyrizeni');
