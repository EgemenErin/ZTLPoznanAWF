-- Guest forum authors (typed username, no auth) + emoji reactions

alter table public.forum_posts
  alter column author_id drop not null;

alter table public.forum_posts
  add column if not exists guest_name text;

alter table public.forum_posts
  drop constraint if exists forum_posts_author_or_guest;

alter table public.forum_posts
  add constraint forum_posts_author_or_guest check (
    (author_id is not null and (guest_name is null or length(trim(guest_name)) = 0))
    or (
      author_id is null
      and guest_name is not null
      and char_length(trim(guest_name)) between 2 and 40
    )
  );

drop policy if exists "Authenticated users can create forum posts" on public.forum_posts;
drop policy if exists "Users and guests can create forum posts" on public.forum_posts;

create policy "Users and guests can create forum posts"
on public.forum_posts for insert
with check (
  (auth.uid() is not null and auth.uid() = author_id and guest_name is null)
  or (
    author_id is null
    and guest_name is not null
    and char_length(trim(guest_name)) between 2 and 40
  )
);

create table if not exists public.forum_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  emoji text not null check (emoji in ('👍', '❤️', '😂', '🎉', '😮', '👏')),
  reactor_key text not null,
  created_at timestamptz not null default now(),
  unique (post_id, emoji, reactor_key)
);

create index if not exists forum_reactions_post_idx
  on public.forum_reactions (post_id);

alter table public.forum_reactions enable row level security;

drop policy if exists "Forum reactions are publicly readable" on public.forum_reactions;
create policy "Forum reactions are publicly readable"
on public.forum_reactions for select
using (true);

-- Writes go through server actions (service role). Block direct client inserts/deletes.
drop policy if exists "Anyone can add forum reactions" on public.forum_reactions;
drop policy if exists "Anyone can remove their forum reactions" on public.forum_reactions;
