"use client";

import { useActionState, useEffect } from "react";

import { createNewsPost, updateNewsPost, type NewsActionState } from "@/app/admin/news/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichNewsEditor } from "@/components/rich-news-editor";
import type { ForumPost } from "@/lib/forum";

const initialState: NewsActionState = {
  status: "idle",
  message: "",
};

export function AdminNewsForm({
  post,
  onSuccess,
}: {
  post?: ForumPost;
  onSuccess?: () => void;
}) {
  const isEditing = Boolean(post);
  const [state, action, pending] = useActionState(
    isEditing ? updateNewsPost : createNewsPost,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success" && onSuccess) {
      const timer = setTimeout(() => {
        onSuccess();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [state.status, onSuccess]);

  return (
    <form
      action={action}
      className="grid gap-5 rounded-[2rem] border border-ink/10 bg-white/80 p-6 shadow-glass backdrop-blur"
    >
      {post ? <input type="hidden" name="postId" value={post.id} /> : null}
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
          Title / Tytuł
        </label>
        <Input
          name="title"
          placeholder="News title / Tytuł aktualności"
          defaultValue={post?.title ?? ""}
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
          Featured Image URL (optional)
        </label>
        <Input
          name="imageUrl"
          type="url"
          placeholder="https://... (e.g. Supabase Storage image URL)"
          defaultValue={post?.image_url ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
          Content / Treść
        </label>
        <RichNewsEditor name="body" defaultValue={post?.body ?? ""} required />
      </div>
      <label className="flex items-center gap-3 text-sm font-medium leading-6 text-ink/75">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={post?.is_pinned ?? true}
          className="h-4 w-4 accent-wine"
        />
        Feature on homepage (Wyróżnij na stronie głównej)
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="brass" disabled={pending}>
          {pending ? "Saving..." : isEditing ? "Save changes" : "Publish news"}
        </Button>
      </div>
      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "text-sm font-medium text-wine"
              : "text-sm font-medium text-emerald-700"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
