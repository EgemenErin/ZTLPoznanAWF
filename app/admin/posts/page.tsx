import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { AdminPostForm } from "@/components/admin-post-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, getForumCategories } from "@/lib/forum";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Admin posts | ZTL Poznań AWF",
};

export default async function AdminPostsPage() {
  const locale = await getLocale();
  const [profile, categories] = await Promise.all([
    getCurrentProfile(),
    getForumCategories(),
  ]);
  const canPublish = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container grid gap-12 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <Badge>Admin</Badge>
          <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
            Featured forum posts
          </h1>
          <p className="mt-6 text-lg leading-8 text-ink/65">
            Publish official updates about upcoming events, rehearsals, recruitment, and
            community announcements. Posts marked as featured appear on the homepage and
            stay pinned in the forum.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-ink/55">
            <ShieldCheck className="h-5 w-5 text-brass" />
            Admin or moderator role required.
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/admin/events">Manage calendar events</Link>
          </Button>
          <Button asChild variant="outline" className="ml-3 mt-8">
            <Link href="/admin#news">Manage news</Link>
          </Button>
        </section>

        {canPublish ? (
          <AdminPostForm categories={categories} locale={locale} />
        ) : (
          <section className="rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur">
            <h2 className="font-serif text-3xl font-bold">Access required</h2>
            <p className="mt-4 leading-7 text-ink/65">
              Log in with an admin or moderator account to publish featured posts.
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
