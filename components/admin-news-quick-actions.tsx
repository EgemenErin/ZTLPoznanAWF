"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { deleteNewsPost } from "@/app/admin/news/actions";
import { AdminNewsForm } from "@/components/admin-news-form";
import { Button } from "@/components/ui/button";
import type { ForumPost } from "@/lib/forum";
import type { Locale } from "@/lib/i18n";

export function NewsCreateButton({
  locale = "pl",
  compact = false,
}: {
  locale?: Locale;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isEn = locale === "en";

  return (
    <>
      <Button
        type="button"
        variant="brass"
        size={compact ? "sm" : "default"}
        onClick={() => setOpen(true)}
        className="gap-2"
        title={isEn ? "Add news post" : "Dodaj aktualność"}
      >
        <Plus className="h-4 w-4" />
        <span>{isEn ? "Add news" : "Dodaj aktualność"}</span>
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.25rem] border border-ink/15 bg-paper p-6 text-ink shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                  {isEn ? "News Manager" : "Aktualności"}
                </p>
                <h3 className="mt-1 font-serif text-3xl font-bold">
                  {isEn ? "Create news post" : "Dodaj nową aktualność"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/80 text-ink/70 transition hover:bg-wine hover:text-paper"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AdminNewsForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function NewsEditButton({
  post,
  locale = "pl",
  compact = false,
}: {
  post: ForumPost;
  locale?: Locale;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isEn = locale === "en";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 border-ink/20 bg-white/85 text-ink hover:bg-wine hover:text-paper"
        title={isEn ? "Edit news post" : "Edytuj aktualność"}
      >
        <Pencil className="h-3.5 w-3.5" />
        {!compact ? <span>{isEn ? "Edit" : "Edytuj"}</span> : null}
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.25rem] border border-ink/15 bg-paper p-6 text-ink shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                  {isEn ? "Edit News" : "Edycja aktualności"}
                </p>
                <h3 className="mt-1 font-serif text-3xl font-bold line-clamp-1">
                  {post.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <form
                  action={async (formData) => {
                    await deleteNewsPost(formData);
                    setOpen(false);
                  }}
                >
                  <input type="hidden" name="postId" value={post.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="border-wine/30 text-wine hover:bg-wine hover:text-paper"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {isEn ? "Delete" : "Usuń"}
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/80 text-ink/70 transition hover:bg-wine hover:text-paper"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <AdminNewsForm post={post} onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
