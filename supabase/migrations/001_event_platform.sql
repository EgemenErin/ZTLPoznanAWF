create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.event_status as enum ('draft', 'published', 'cancelled', 'archived');
create type public.newsletter_status as enum ('pending', 'subscribed', 'unsubscribed', 'bounced');
create type public.forum_post_status as enum ('published', 'hidden', 'deleted');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_pl text not null,
  name_en text,
  color text,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.event_categories(id) on delete set null,
  title_pl text not null,
  title_en text,
  slug text not null unique,
  summary_pl text,
  summary_en text,
  description_pl text,
  description_en text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'Europe/Warsaw',
  venue_name text,
  venue_city text,
  venue_address text,
  image_url text,
  ticket_url text,
  price_label text,
  is_featured boolean not null default false,
  status public.event_status not null default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.newsletter_subs (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  first_name text,
  locale text not null default 'pl',
  status public.newsletter_status not null default 'pending',
  source text not null default 'website',
  consent_marketing boolean not null default false,
  consented_at timestamptz,
  resend_contact_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories(id) on delete restrict,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.forum_posts(id) on delete cascade,
  title text,
  body text not null,
  image_url text,
  body_font text not null default 'sans' check (body_font in ('sans', 'serif')),
  body_weight text not null default 'regular' check (body_weight in ('light', 'regular', 'medium', 'bold')),
  body_size text not null default 'normal' check (body_size in ('compact', 'normal', 'large')),
  body_align text not null default 'left' check (body_align in ('left', 'center')),
  status public.forum_post_status not null default 'published',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint thread_title_required check (parent_id is not null or title is not null)
);

create index events_start_category_idx on public.events (starts_at, category_id) where status = 'published';
create index forum_posts_category_created_idx on public.forum_posts (category_id, created_at desc);
create index forum_posts_parent_idx on public.forum_posts (parent_id, created_at asc);

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_events_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger set_newsletter_subs_updated_at before update on public.newsletter_subs for each row execute function public.set_updated_at();
create trigger set_forum_posts_updated_at before update on public.forum_posts for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  safe_username text;
begin
  safe_username :=
    lower(regexp_replace(coalesce(split_part(new.email, '@', 1), 'member'), '[^a-zA-Z0-9_]+', '_', 'g'))
    || '_'
    || left(replace(new.id::text, '-', ''), 8);

  insert into public.profiles (id, display_name, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Member'),
    safe_username,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.event_categories enable row level security;
alter table public.events enable row level security;
alter table public.newsletter_subs enable row level security;
alter table public.forum_categories enable row level security;
alter table public.forum_posts enable row level security;

create policy "Profiles are publicly readable"
on public.profiles for select
using (true);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Event categories are publicly readable"
on public.event_categories for select
using (true);

create policy "Published events are publicly readable"
on public.events for select
using (status = 'published');

create policy "Admins can manage events"
on public.events for all
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')));

create policy "Newsletter submissions are server-only"
on public.newsletter_subs for insert
with check (false);

create policy "Forum categories are publicly readable"
on public.forum_categories for select
using (true);

create policy "Published forum posts are publicly readable"
on public.forum_posts for select
using (status = 'published');

create policy "Authenticated users can create forum posts"
on public.forum_posts for insert
with check (auth.uid() = author_id);

create policy "Authors can edit their own forum posts"
on public.forum_posts for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Moderators can manage forum posts"
on public.forum_posts for all
using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')))
with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator')));

insert into public.event_categories (slug, name_pl, name_en, color) values
  ('koncerty', 'Koncerty', 'Concerts', '#5c1f25'),
  ('warsztaty', 'Warsztaty', 'Workshops', '#a1743b'),
  ('oprowadzanie', 'Oprowadzanie', 'Guided Tours', '#2f4f3f'),
  ('wyjazdy', 'Wyjazdy', 'Travel', '#1f3a5c'),
  ('rekrutacja', 'Rekrutacja', 'Recruitment', '#6f3f1f')
on conflict (slug) do nothing;

insert into public.forum_categories (slug, name, description, sort_order) values
  ('ogloszenia', 'Ogłoszenia', 'Aktualności organizacyjne i informacje dla społeczności.', 10),
  ('wydarzenia', 'Wydarzenia', 'Rozmowy o koncertach, warsztatach i występach.', 20),
  ('stroje-i-tradycje', 'Stroje i tradycje', 'Pytania o regiony, stroje, pieśni i repertuar.', 30)
on conflict (slug) do nothing;
