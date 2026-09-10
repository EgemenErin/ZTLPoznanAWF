alter table public.forum_posts
add column if not exists image_url text,
add column if not exists body_font text not null default 'sans',
add column if not exists body_weight text not null default 'regular',
add column if not exists body_size text not null default 'normal',
add column if not exists body_align text not null default 'left';

alter table public.forum_posts
drop constraint if exists forum_posts_body_font_check,
add constraint forum_posts_body_font_check
check (body_font in ('sans', 'serif'));

alter table public.forum_posts
drop constraint if exists forum_posts_body_weight_check,
add constraint forum_posts_body_weight_check
check (body_weight in ('light', 'regular', 'medium', 'bold'));

alter table public.forum_posts
drop constraint if exists forum_posts_body_size_check,
add constraint forum_posts_body_size_check
check (body_size in ('compact', 'normal', 'large'));

alter table public.forum_posts
drop constraint if exists forum_posts_body_align_check,
add constraint forum_posts_body_align_check
check (body_align in ('left', 'center'));

notify pgrst, 'reload schema';
