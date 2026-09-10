"use client";

import { useActionState } from "react";

import { createReply, createThread, type ForumActionState } from "@/app/forum/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { copy, type Locale } from "@/lib/i18n";

const initialState: ForumActionState = {
  status: "idle",
  message: "",
};

export function ThreadForm({
  categorySlug,
  locale,
  defaultGuestName = "",
  authenticatedName = "",
}: {
  categorySlug: string;
  locale: Locale;
  defaultGuestName?: string;
  authenticatedName?: string;
}) {
  const t = copy[locale].forum;
  const [state, action, pending] = useActionState(createThread, initialState);

  return (
    <form action={action} className="grid gap-4 rounded-[2rem] border border-ink/10 bg-white/55 p-6 shadow-glass backdrop-blur">
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <input type="hidden" name="locale" value={locale} />
      {authenticatedName ? (
        <input type="hidden" name="guestName" value={authenticatedName} />
      ) : (
        <Input
          name="guestName"
          placeholder={t.username}
          defaultValue={defaultGuestName}
          minLength={2}
          maxLength={40}
          required
          autoComplete="nickname"
        />
      )}
      <Input name="title" placeholder={t.threadTitle} required />
      <Textarea name="body" placeholder={t.threadBody} required />
      <Button type="submit" disabled={pending}>
        {pending ? t.publishing : t.publishThread}
      </Button>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function ReplyForm({
  categorySlug,
  categoryId,
  parentId,
  locale,
  defaultGuestName = "",
  authenticatedName = "",
}: {
  categorySlug: string;
  categoryId: string;
  parentId: string;
  locale: Locale;
  defaultGuestName?: string;
  authenticatedName?: string;
}) {
  const t = copy[locale].forum;
  const [state, action, pending] = useActionState(createReply, initialState);

  return (
    <form action={action} className="grid gap-4 rounded-[2rem] border border-ink/10 bg-white/55 p-6 shadow-glass backdrop-blur">
      <input type="hidden" name="categorySlug" value={categorySlug} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="parentId" value={parentId} />
      <input type="hidden" name="locale" value={locale} />
      {authenticatedName ? (
        <input type="hidden" name="guestName" value={authenticatedName} />
      ) : (
        <Input
          name="guestName"
          placeholder={t.username}
          defaultValue={defaultGuestName}
          minLength={2}
          maxLength={40}
          required
          autoComplete="nickname"
        />
      )}
      <Textarea name="body" placeholder={t.replyBody} required />
      <Button type="submit" disabled={pending}>
        {pending ? t.publishing : t.publishReply}
      </Button>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
