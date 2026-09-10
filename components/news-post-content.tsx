import { cn } from "@/lib/utils";
import { RichNewsContent } from "@/components/rich-news-content";
import type { ForumPost } from "@/lib/forum";
import type { Locale } from "@/lib/i18n";
import { getPostBody } from "@/lib/forum-copy";

export function getNewsBodyClassName(_post: ForumPost, className?: string) {
  return cn(
    "font-sans text-lg font-normal leading-9 text-left text-ink/75",
    className,
  );
}

export function NewsPostBody({
  post,
  locale,
  className,
}: {
  post: ForumPost;
  locale: Locale;
  className?: string;
}) {
  return <RichNewsContent body={getPostBody(post, locale)} className={getNewsBodyClassName(post, className)} />;
}
