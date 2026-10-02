-- ════════════════════════════════════════════════════════════════════════════
-- Ověření, hodnocení a tarif si nikdo nezmění sám (2026-10-02, Yasin + Claude)
-- ════════════════════════════════════════════════════════════════════════════
-- Proč: pravidlo „Users can update own profile" pouští přihlášenému uživateli
-- celý jeho řádek v profiles. Firma (i brigádník) si tak přes API mohla dát
-- verified = true, rating = 5 nebo plan = 'maximalni'. Ověřeno 2. 10.: na
-- profiles nebyl žádný trigger, který by to hlídal.
--
-- Jak: trigger před zápisem. Když zapisuje přímo appka nebo web (role
-- authenticated / anon), tyhle tři sloupce zůstanou, jak byly; zbytek profilu
-- se uloží normálně. Měnit je dál jde z SQL Editoru, ze service role (Stripe
-- webhook bude zapisovat plan) a z funkcí security definer (běží pod vlastníkem).
-- ════════════════════════════════════════════════════════════════════════════

create or replace function public.profiles_chranene_sloupce()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') then
    if tg_op = 'INSERT' then
      new.verified := false;
      new.rating   := 0;
      new.plan     := null;
    else
      new.verified := old.verified;
      new.rating   := old.rating;
      new.plan     := old.plan;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_chranene_sloupce on public.profiles;
create trigger profiles_chranene_sloupce
  before insert or update on public.profiles
  for each row execute function public.profiles_chranene_sloupce();

-- Kontrola po spuštění (má vrátit 1 řádek):
select tgname from pg_trigger where tgrelid = 'public.profiles'::regclass and tgname = 'profiles_chranene_sloupce';
