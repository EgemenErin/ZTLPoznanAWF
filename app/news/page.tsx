import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { enUS, pl } from "date-fns/locale";

import { NewsPostBody } from "@/components/news-post-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, getForumThreads } from "@/lib/forum";
import { getPostTitle } from "@/lib/forum-copy";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Aktualności | ZTL Poznań AWF",
};

export default async function NewsPage() {
  const locale = await getLocale();
  const isEn = locale === "en";
  const dateLocale = isEn ? enUS : pl;
  const [posts, profile] = await Promise.all([getForumThreads(), getCurrentProfile()]);
  const canManage = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-20 md:py-28">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>{isEn ? "News" : "Aktualności"}</Badge>
            <h1 className="mt-7 font-serif text-6xl font-bold leading-none md:text-8xl">
              {isEn ? "Latest news" : "Najnowsze informacje"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/65">
              {isEn
                ? "Official updates from the ensemble: events, announcements, recruitment, and community news."
                : "Oficjalne informacje zespołu: wydarzenia, ogłoszenia, nabory i aktualności społeczności."}
            </p>
          </div>
          {canManage ? (
            <Button asChild variant="outline">
              <Link href="/admin/news">{isEn ? "Manage news" : "Zarządzaj aktualnościami"}</Link>
            </Button>
          ) : null}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/60 shadow-glass backdrop-blur">
              {post.image_url ? (
                <div className="relative min-h-56 border-b border-ink/10">
                  <Image
                    src={post.image_url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                {format(new Date(post.created_at), "dd LLL yyyy", { locale: dateLocale })}
              </p>
              <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">
                {getPostTitle(post, locale)}
              </h2>
              <NewsPostBody post={post} locale={locale} className="mt-4 line-clamp-4 text-sm leading-6 text-ink/65" />
              <Link href={`/news/${post.id}`} className="mt-6 inline-flex text-sm font-bold text-wine">
                {isEn ? "Read more" : "Czytaj dalej"} →
              </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
