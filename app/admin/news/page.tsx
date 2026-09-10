import type { Metadata } from "next";
import Link from "next/link";

import { AdminNewsManager } from "@/components/admin-news-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, getForumThreads } from "@/lib/forum";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "News admin | ZTL Poznań AWF",
};

export default async function AdminNewsPage() {
  const locale = await getLocale();
  const [profile, posts] = await Promise.all([getCurrentProfile(), getForumThreads()]);
  const canManage = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <Badge>Admin</Badge>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
              News CRUD
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink/65">
              Create, update, feature, and delete public news posts visible in the News section and homepage highlights.
            </p>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/news">View public news</Link>
            </Button>
          </section>
          {!canManage ? (
            <section className="rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur">
              <h2 className="font-serif text-3xl font-bold">Access required</h2>
              <p className="mt-4 leading-7 text-ink/65">Log in with an admin or moderator account.</p>
              <Button asChild className="mt-6">
                <Link href="/auth/login">Log in</Link>
              </Button>
            </section>
          ) : null}
        </div>

        {canManage ? (
          <AdminNewsManager posts={posts} />
        ) : null}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
