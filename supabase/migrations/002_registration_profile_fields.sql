alter table public.profiles
add column if not exists interests text[],
add column if not exists marketing_consent boolean not null default false;

comment on column public.profiles.interests is 'Optional interests collected during registration.';
comment on column public.profiles.marketing_consent is 'Whether the user opted into marketing/newsletter communication during registration.';
