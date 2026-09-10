import { FORUM_REACTION_EMOJIS, type ForumReactionSummary } from "@/lib/forum";
import { toggleReaction } from "@/app/forum/actions";

type ForumReactionsProps = {
  postId: string;
  categorySlug: string;
  threadId: string;
  reactions?: ForumReactionSummary[];
};

export function ForumReactions({
  postId,
  categorySlug,
  threadId,
  reactions = [],
}: ForumReactionsProps) {
  const counts = new Map(reactions.map((item) => [item.emoji, item]));

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {FORUM_REACTION_EMOJIS.map((emoji) => {
        const summary = counts.get(emoji);
        const count = summary?.count ?? 0;
        const reacted = summary?.reacted ?? false;

        return (
          <form key={emoji} action={toggleReaction}>
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="emoji" value={emoji} />
            <input type="hidden" name="categorySlug" value={categorySlug} />
            <input type="hidden" name="threadId" value={threadId} />
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm transition ${
                reacted
                  ? "border-wine/40 bg-wine/10 text-ink"
                  : "border-ink/10 bg-white/50 text-ink/70 hover:border-ink/25"
              }`}
              aria-label={`React with ${emoji}`}
              aria-pressed={reacted}
            >
              <span aria-hidden>{emoji}</span>
              {count > 0 ? <span className="text-xs font-semibold tabular-nums">{count}</span> : null}
            </button>
          </form>
        );
      })}
    </div>
  );
}
