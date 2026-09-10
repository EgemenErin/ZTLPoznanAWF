# ZTL Poznań AWF Event Platform

Next.js App Router site for ZTL Poznań AWF with a premium event calendar, newsletter capture, and Supabase-backed community forum.

## Stack

- Next.js App Router
- Tailwind CSS with Shadcn-style primitives
- Supabase Postgres/Auth/Storage-ready architecture
- Resend contact sync for newsletter subscriptions

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

Apply `supabase/migrations/001_event_platform.sql` to create `profiles`, `events`, `newsletter_subs`, `forum_categories`, and `forum_posts`.

The migration also enables RLS, seeds starter event/forum categories, and creates a profile bootstrap trigger for `auth.users`.

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The app includes fallback demo events and forum content when Supabase variables are not configured.
