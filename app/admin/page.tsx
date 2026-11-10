import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  LayoutTemplate,
  LogOut,
  Newspaper,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

import { signOut } from "@/app/auth/actions";
import { AdminNewsManager } from "@/components/admin-news-manager";
import { AdminSiteContentEditor } from "@/components/admin-site-content-editor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, getForumThreads } from "@/lib/forum";
import { getLocale } from "@/lib/i18n-server";
import { getSiteContent } from "@/lib/site-content-server";
import { hasSupabaseEnv } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | ZTL Poznań AWF",
};

export default async function AdminPage() {
  const locale = await getLocale();
  const isEn = locale === "en";
  const [profile, posts, siteContent] = await Promise.all([
    getCurrentProfile(),
    getForumThreads(),
    getSiteContent(),
  ]);
  const canManage =
    profile?.role === "admin" || profile?.role === "moderator" || !hasSupabaseEnv();

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-16 md:py-24">
        <section className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <Badge>Admin</Badge>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
              Management panel
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/65">
              Edit header text, main screen hero, history, stats, repertoire cards, travels,
              footer, and Kontakt page information, or create and edit public news and calendar
              events.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-ink/55">
              <ShieldCheck className="h-5 w-5 text-brass" />
              Admin or moderator role required. You can also use inline Edit and + buttons
              directly on the main screen, News, and Kontakt pages.
            </div>
          </div>

          <div className="grid gap-3 rounded-[2rem] border border-ink/10 bg-white/60 p-6 shadow-glass backdrop-blur sm:grid-cols-2">
            <Button asChild variant="brass">
              <Link href="#content-editor">
                <LayoutTemplate className="h-4 w-4" /> Edit site & header info
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#news">
                <Newspaper className="h-4 w-4" /> Manage news (+ / Edit)
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/events">
                <CalendarDays className="h-4 w-4" /> Manage events
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/kontakt">
                <PhoneCall className="h-4 w-4" /> View Kontakt page
              </Link>
            </Button>
            {profile ? (
              <form action={signOut} className="sm:col-span-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full border-wine/30 text-wine hover:bg-wine hover:text-paper"
                >
                  <LogOut className="h-4 w-4" />
                  {isEn
                    ? "Exit account (Log out & view site normally)"
                    : "Wyloguj się (zobacz stronę jako zwykły użytkownik)"}
                </Button>
              </form>
            ) : null}
          </div>
        </section>

        {canManage ? (
          <>
            <section className="mt-16">
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <LayoutTemplate className="h-5 w-5 text-brass" />
                  <Badge>Site Content & Main Screen</Badge>
                </div>
                <h2 className="font-serif text-4xl font-bold">
                  Edit Header, Main Screen & Kontakt Info
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                  Choose a section tab below (Header, Hero, About & Stats, Repertoire Sections,
                  Travels, Location & Footer, Kontakt Page, or Business Contact), switch between
                  Polish (PL) and English (EN), and save your changes.
                </p>
              </div>
              <AdminSiteContentEditor
                initialContent={siteContent}
                initialLocale={locale}
              />
            </section>

            <AdminNewsManager posts={posts} />
          </>
        ) : (
          <section className="mt-16 rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur">
            <h2 className="font-serif text-3xl font-bold">Access required</h2>
            <p className="mt-4 leading-7 text-ink/65">
              Log in with an admin or moderator account to edit site content and manage news.
            </p>
            <Button asChild className="mt-6">
              <Link href="/auth/login">Log in</Link>
            </Button>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
