"use client";

import { useActionState } from "react";

import { createAdminAnnouncement, type ForumActionState } from "@/app/forum/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCategoryName } from "@/lib/forum-copy";
import type { ForumCategory } from "@/lib/forum";
import { copy, type Locale } from "@/lib/i18n";

const initialState: ForumActionState = {
  status: "idle",
  message: "",
};

export function AdminPostForm({ categories, locale }: { categories: ForumCategory[]; locale: Locale }) {
  const t = copy[locale].forum;
  const [state, action, pending] = useActionState(createAdminAnnouncement, initialState);

  return (
    <form action={action} className="grid gap-5 rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur">
      <div className="grid gap-2">
        <label className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/50">
          {t.category}
        </label>
        <select
          name="categorySlug"
          defaultValue="ogloszenia"
          className="h-12 rounded-full border border-ink/15 bg-white/70 px-5 text-sm font-semibold text-ink outline-none focus:ring-2 focus:ring-brass"
        >
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {getCategoryName(category, locale)}
            </option>
          ))}
        </select>
      </div>
      <input type="hidden" name="locale" value={locale} />
      <Input name="title" placeholder={t.postTitle} required />
      <Textarea
        name="body"
        placeholder={t.postBody}
        required
      />
      <label className="flex items-center gap-3 text-sm leading-6 text-ink/65">
        <input name="isFeatured" type="checkbox" defaultChecked className="h-4 w-4 rounded border-ink/20" />
        {t.featureOnHomepage}
      </label>
      <Button type="submit" disabled={pending} variant="brass">
        {pending ? t.publishing : t.publishPost}
      </Button>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
