-- Site content settings editable from the admin panel and inline editors

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Site settings are publicly readable" on public.site_settings;
create policy "Site settings are publicly readable"
on public.site_settings for select
using (true);

drop policy if exists "Admins and moderators can manage site settings" on public.site_settings;
create policy "Admins and moderators can manage site settings"
on public.site_settings for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'moderator')
  )
)
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'moderator')
  )
);

notify pgrst, 'reload schema';
