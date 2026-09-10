import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { enUS, pl } from "date-fns/locale";

import { getRememberedGuestName } from "@/app/forum/actions";
import { ReplyForm } from "@/components/forum-forms";
import { ForumReactions } from "@/components/forum-reactions";
import { NewsPostBody } from "@/components/news-post-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  getCurrentProfile,
  getForumCategories,
  getForumReactions,
  getForumThread,
} from "@/lib/forum";
import { getPostAuthorLabel, getPostBody, getPostTitle } from "@/lib/forum-copy";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

type NewsDetailProps = {
  params: Promise<{ post: string }>;
};

export async function generateMetadata({ params }: NewsDetailProps): Promise<Metadata> {
  const { post } = await params;
  const { thread } = await getForumThread(post);
  return { title: thread?.title ? `${thread.title} | News` : "News" };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { post } = await params;
  const locale = await getLocale();
  const isEn = locale === "en";
  const t = copy[locale].forum;
  const dateLocale = isEn ? enUS : pl;
  const cookieStore = await cookies();
  const reactorKey = cookieStore.get("ztl_reactor")?.value ?? null;

  const [{ thread, replies }, categories, profile, defaultGuestName] = await Promise.all([
    getForumThread(post),
    getForumCategories(),
    getCurrentProfile(),
    getRememberedGuestName(),
  ]);

  if (!thread) {
    notFound();
  }

  const categorySlug =
    categories.find((category) => category.id === thread.category_id)?.slug ?? "ogloszenia";
  const reactionMap = await getForumReactions(
    [thread.id, ...replies.map((reply) => reply.id)],
    reactorKey,
  );

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container max-w-4xl py-20">
        <Link href="/news" className="text-sm font-bold text-wine">
          ← {isEn ? "Back to news" : "Powrót do aktualności"}
        </Link>
        <article className="mt-10 rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur md:p-12">
          <Badge>{isEn ? "News" : "Aktualności"}</Badge>
          <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
            {getPostTitle(thread, locale)}
          </h1>
          <p className="mt-5 text-sm uppercase tracking-[0.16em] text-ink/45">
            {format(new Date(thread.created_at), "dd LLLL yyyy, HH:mm", { locale: dateLocale })}
          </p>
          {thread.image_url ? (
            <div className="relative mt-8 min-h-[24rem] overflow-hidden rounded-[2rem] border border-ink/10">
              <Image
                src={thread.image_url}
                alt=""
                fill
                sizes="(min-width: 768px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <NewsPostBody post={thread} locale={locale} className="mt-8" />
          <ForumReactions
            postId={thread.id}
            categorySlug={categorySlug}
            threadId={thread.id}
            reactions={reactionMap.get(thread.id)}
          />
        </article>

        <section className="mt-12 grid gap-5">
          <h2 className="font-serif text-4xl font-bold">{t.replies}</h2>
          {replies.length === 0 ? (
            <p className="text-ink/55">
              {isEn ? "No comments yet. Be the first to reply." : "Brak komentarzy. Napisz pierwszą odpowiedź."}
            </p>
          ) : null}
          {replies.map((reply) => (
            <article key={reply.id} className="rounded-[2rem] border border-ink/10 bg-paper/70 p-6">
              <p className="text-sm font-semibold text-ink/55">
                {getPostAuthorLabel(reply, locale)} ·{" "}
                {format(new Date(reply.created_at), "dd LLL yyyy, HH:mm", { locale: dateLocale })}
              </p>
              <p className="mt-4 whitespace-pre-wrap leading-8 text-ink/75">{getPostBody(reply, locale)}</p>
              <ForumReactions
                postId={reply.id}
                categorySlug={categorySlug}
                threadId={thread.id}
                reactions={reactionMap.get(reply.id)}
              />
            </article>
          ))}
        </section>

        <section className="mt-10 max-w-3xl">
          <ReplyForm
            categorySlug={categorySlug}
            categoryId={thread.category_id}
            parentId={thread.id}
            locale={locale}
            defaultGuestName={defaultGuestName}
            authenticatedName={profile?.display_name ?? ""}
          />
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
