import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Pin } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, getForumCategories, getForumThreads } from "@/lib/forum";
import { getCategoryDescription, getCategoryName, getPostBody, getPostTitle } from "@/lib/forum-copy";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Forum społeczności | ZTL Poznań AWF",
  description: "Kategorie, wątki i rozmowy społeczności ZTL Poznań AWF.",
};

export default async function ForumPage() {
  const locale = await getLocale();
  const t = copy[locale].forum;
  const [categories, threads, profile] = await Promise.all([
    getForumCategories(),
    getForumThreads(),
    getCurrentProfile(),
  ]);
  const canPublish = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge>{t.badge}</Badge>
            <h1 className="mt-7 font-serif text-6xl font-bold leading-none md:text-8xl">
              {t.title}
            </h1>
            <p className="mt-8 text-lg leading-8 text-ink/65">
              {t.lead}
            </p>
            {canPublish ? (
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/admin/posts">{t.adminPosts}</Link>
                </Button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/forum/${category.slug}`}
                className="rounded-[2rem] border border-ink/10 bg-white/55 p-6 shadow-glass backdrop-blur transition hover:-translate-y-1 hover:border-wine"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-brass" />
                  <h2 className="font-serif text-3xl font-bold">{getCategoryName(category, locale)}</h2>
                </div>
                <p className="mt-4 text-ink/65">{getCategoryDescription(category, locale)}</p>
              </Link>
            ))}
          </div>
        </div>

        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <Pin className="h-5 w-5 text-brass" />
            <h2 className="font-serif text-3xl font-bold">{t.latest}</h2>
          </div>
          <div className="grid gap-4">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${categories.find((category) => category.id === thread.category_id)?.slug ?? "ogloszenia"}/${thread.id}`}
                className="rounded-[1.5rem] border border-ink/10 bg-paper/70 p-5 transition hover:border-wine"
              >
                <p className="font-serif text-2xl font-bold">{getPostTitle(thread, locale)}</p>
                <p className="mt-2 line-clamp-2 text-sm text-ink/60">{getPostBody(thread, locale)}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
