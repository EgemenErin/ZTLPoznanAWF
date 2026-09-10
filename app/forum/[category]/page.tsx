import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { enUS, pl } from "date-fns/locale";
import { Pin } from "lucide-react";

import { getRememberedGuestName } from "@/app/forum/actions";
import { ThreadForm } from "@/components/forum-forms";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile, getForumCategory, getForumThreads } from "@/lib/forum";
import { getCategoryDescription, getCategoryName, getPostAuthorLabel, getPostBody, getPostTitle } from "@/lib/forum-copy";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const forumCategory = await getForumCategory(category);

  return {
    title: forumCategory ? `${forumCategory.name} | Forum` : "Forum",
  };
}

export default async function ForumCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const locale = await getLocale();
  const t = copy[locale].forum;
  const [forumCategory, threads, defaultGuestName, profile] = await Promise.all([
    getForumCategory(category),
    getForumThreads(category),
    getRememberedGuestName(),
    getCurrentProfile(),
  ]);

  if (!forumCategory) {
    notFound();
  }
  const dateLocale = locale === "en" ? enUS : pl;
  const authenticatedName = profile?.display_name ?? "";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-16 md:py-24">
        <Badge>Forum</Badge>
        <h1 className="mt-6 font-serif text-6xl font-bold">{getCategoryName(forumCategory, locale)}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/65">{getCategoryDescription(forumCategory, locale)}</p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="grid gap-4">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${category}/${thread.id}`}
                className="rounded-[2rem] border border-ink/10 bg-white/55 p-6 transition hover:border-wine"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {thread.is_pinned ? <Pin className="h-4 w-4 text-brass" /> : null}
                  <h2 className="font-serif text-3xl font-bold">{getPostTitle(thread, locale)}</h2>
                </div>
                <p className="mt-3 line-clamp-2 text-ink/65">{getPostBody(thread, locale)}</p>
                <p className="mt-5 text-xs uppercase tracking-[0.16em] text-ink/45">
                  {getPostAuthorLabel(thread, locale)} ·{" "}
                  {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true, locale: dateLocale })}
                </p>
              </Link>
            ))}
          </div>
          <aside>
            <ThreadForm
              categorySlug={category}
              locale={locale}
              defaultGuestName={defaultGuestName}
              authenticatedName={authenticatedName}
            />
          </aside>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
