import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ShieldCheck } from "lucide-react";

import { AdminNewsManager } from "@/components/admin-news-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, getForumThreads } from "@/lib/forum";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Admin | ZTL Poznań AWF",
};

export default async function AdminPage() {
  const locale = await getLocale();
  const [profile, posts] = await Promise.all([getCurrentProfile(), getForumThreads()]);
  const canManage = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-16 md:py-24">
        <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <Badge>Admin</Badge>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
              Management panel
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/65">
              Manage public news from this page. Calendar editing stays in its own detailed
              CRUD view because event forms are larger.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-ink/55">
              <ShieldCheck className="h-5 w-5 text-brass" />
              Admin or moderator role required.
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-ink/10 bg-white/60 p-6 shadow-glass backdrop-blur sm:grid-cols-2">
            <Button asChild variant="brass">
              <Link href="#news">Manage news</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/events">
                <CalendarDays className="h-4 w-4" /> Manage events
              </Link>
            </Button>
          </div>
        </section>

        {canManage ? (
          <AdminNewsManager posts={posts} />
        ) : (
          <section className="mt-16 rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur">
            <h2 className="font-serif text-3xl font-bold">Access required</h2>
            <p className="mt-4 leading-7 text-ink/65">Log in with an admin or moderator account.</p>
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
