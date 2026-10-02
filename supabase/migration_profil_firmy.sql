-- Profil firmy — nové údaje (2026-09-26, Yasin + Claude)
-- Dashboard má od 26. 9. samostatnou záložku „Profil firmy" (employer-firma.jsx).
-- Tyhle sloupce ukládá navíc k těm, které v profiles už jsou (company_name,
-- industry, bio, ic, address, website, kraj, logo_url, photos, socials…).
-- Všechno additivní, nic stávajícího se nemění. Fotky jdou do bucketu
-- `uploads`, do DB jen veřejná URL.
alter table public.profiles add column if not exists cover_url     text;   -- velká fotka pozadí profilu
alter table public.profiles add column if not exists founded       text;   -- rok založení (appka ho už čte)
alter table public.profiles add column if not exists career_url    text;   -- odkaz na kariérní stránku
alter table public.profiles add column if not exists phone         text;   -- telefon pro uchazeče
alter table public.profiles add column if not exists contact_email text;   -- e-mail pro uchazeče (≠ přihlašovací)
alter table public.profiles add column if not exists opening_hours jsonb;  -- { po: "8:00–16:30", …, ne: "" }

-- Údaje uložené dočasně v branding (dashboard od 2. 10., dokud tu nebyly sloupce
-- výš) přesunout do jejich sloupců a z branding je smazat. branding je jsonb.
-- Klidně spustit znovu, hodnotu ve sloupci nepřepíše.
update public.profiles set
  cover_url     = coalesce(cover_url,     nullif(branding->>'cover_url', '')),
  career_url    = coalesce(career_url,    nullif(branding->>'career_url', '')),
  contact_email = coalesce(contact_email, nullif(branding->>'contact_email', '')),
  opening_hours = coalesce(opening_hours, branding->'opening_hours'),
  branding      = branding - 'cover_url' - 'career_url' - 'contact_email' - 'opening_hours'
where branding ?| array['cover_url', 'career_url', 'contact_email', 'opening_hours'];
