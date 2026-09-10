import { moderatePost } from "@/app/forum/actions";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

export function ModerationControls({
  postId,
  categorySlug,
  isPinned,
  locale,
}: {
  postId: string;
  categorySlug: string;
  isPinned: boolean;
  locale: Locale;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-wine/15 bg-wine/5 p-3">
      <form action={moderatePost}>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="categorySlug" value={categorySlug} />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="moderationAction" value={isPinned ? "unpin" : "pin"} />
        <Button type="submit" size="sm" variant="outline">
          {isPinned ? locale === "en" ? "Unpin" : "Odepnij" : locale === "en" ? "Pin" : "Przypnij"}
        </Button>
      </form>
      <form action={moderatePost}>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="categorySlug" value={categorySlug} />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="moderationAction" value="hide" />
        <Button type="submit" size="sm" variant="outline">
          {locale === "en" ? "Hide" : "Ukryj"}
        </Button>
      </form>
    </div>
  );
}
