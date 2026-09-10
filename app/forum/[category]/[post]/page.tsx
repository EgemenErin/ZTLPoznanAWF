import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { enUS, pl } from "date-fns/locale";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { getRememberedGuestName } from "@/app/forum/actions";
import { ReplyForm } from "@/components/forum-forms";
import { ForumReactions } from "@/components/forum-reactions";
import { ModerationControls } from "@/components/moderation-controls";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile, getForumCategory, getForumReactions, getForumThread } from "@/lib/forum";
import { getCategoryName, getPostAuthorLabel, getPostBody, getPostTitle } from "@/lib/forum-copy";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

type ThreadPageProps = {
  params: Promise<{ category: string; post: string }>;
};

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const { post } = await params;
  const { thread } = await getForumThread(post);

  return {
    title: thread?.title ? `${thread.title} | Forum` : "Wątek forum",
  };
}

export default async function ForumThreadPage({ params }: ThreadPageProps) {
  const { category, post } = await params;
  const locale = await getLocale();
  const t = copy[locale].forum;
  const cookieStore = await cookies();
  const reactorKey = cookieStore.get("ztl_reactor")?.value ?? null;

  const [{ thread, replies }, forumCategory, profile, defaultGuestName] = await Promise.all([
    getForumThread(post),
    getForumCategory(category),
    getCurrentProfile(),
    getRememberedGuestName(),
  ]);

  if (!thread || !forumCategory) {
    notFound();
  }

  const reactionMap = await getForumReactions(
    [thread.id, ...replies.map((reply) => reply.id)],
    reactorKey,
  );
  const dateLocale = locale === "en" ? enUS : pl;
  const canModerate = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-16 md:py-24">
        <Link href={`/forum/${category}`} className="inline-flex items-center gap-2 text-sm font-semibold text-wine">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>
        <article className="mt-10 rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur md:p-12">
          <Badge>{getCategoryName(forumCategory, locale)}</Badge>
          <h1 className="mt-6 font-serif text-5xl font-bold leading-tight">{getPostTitle(thread, locale)}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink/55">
            <span>{getPostAuthorLabel(thread, locale)}</span>
            {thread.author?.role && thread.author.role !== "member" ? (
              <span className="inline-flex items-center gap-1 text-brass">
                <ShieldCheck className="h-4 w-4" /> {thread.author.role}
              </span>
            ) : null}
            <span>{format(new Date(thread.created_at), "dd LLLL yyyy, HH:mm", { locale: dateLocale })}</span>
          </div>
          <p className="mt-8 whitespace-pre-wrap text-lg leading-9 text-ink/75">{getPostBody(thread, locale)}</p>
          <ForumReactions
            postId={thread.id}
            categorySlug={category}
            threadId={thread.id}
            reactions={reactionMap.get(thread.id)}
          />
          {canModerate ? (
            <ModerationControls postId={thread.id} categorySlug={category} isPinned={thread.is_pinned} locale={locale} />
          ) : null}
        </article>

        <section className="mt-12 grid gap-5">
          <h2 className="font-serif text-4xl font-bold">{t.replies}</h2>
          {replies.map((reply) => (
            <article key={reply.id} className="rounded-[2rem] border border-ink/10 bg-paper/70 p-6">
              <p className="text-sm font-semibold text-ink/55">
                {getPostAuthorLabel(reply, locale)} ·{" "}
                {format(new Date(reply.created_at), "dd LLL yyyy, HH:mm", { locale: dateLocale })}
              </p>
              <p className="mt-4 whitespace-pre-wrap leading-8 text-ink/75">{getPostBody(reply, locale)}</p>
              <ForumReactions
                postId={reply.id}
                categorySlug={category}
                threadId={thread.id}
                reactions={reactionMap.get(reply.id)}
              />
            </article>
          ))}
        </section>

        <section className="mt-10 max-w-3xl">
          <ReplyForm
            categorySlug={category}
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
