"use client";

import { useActionState } from "react";

import { createNewsPost, updateNewsPost, type NewsActionState } from "@/app/admin/news/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichNewsEditor } from "@/components/rich-news-editor";
import type { ForumPost } from "@/lib/forum";

const initialState: NewsActionState = {
  status: "idle",
  message: "",
};

export function AdminNewsForm({ post }: { post?: ForumPost }) {
  const isEditing = Boolean(post);
  const [state, action, pending] = useActionState(isEditing ? updateNewsPost : createNewsPost, initialState);

  return (
    <form action={action} className="grid gap-5 rounded-[2rem] border border-ink/10 bg-white/60 p-6 shadow-glass backdrop-blur">
      {post ? <input type="hidden" name="postId" value={post.id} /> : null}
      <Input name="title" placeholder="News title" defaultValue={post?.title ?? ""} required />
      <Input
        name="imageUrl"
        type="url"
        placeholder="Featured image URL, for example Supabase Storage image"
        defaultValue={post?.image_url ?? ""}
      />
      <RichNewsEditor name="body" defaultValue={post?.body ?? ""} required />
      <label className="flex items-center gap-3 text-sm leading-6 text-ink/65">
        <input name="isFeatured" type="checkbox" defaultChecked={post?.is_pinned ?? true} />
        Feature on homepage
      </label>
      <Button type="submit" variant="brass" disabled={pending}>
        {pending ? "Saving..." : isEditing ? "Update news" : "Create news"}
      </Button>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
