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
