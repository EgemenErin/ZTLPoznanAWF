"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { deleteNewsPost } from "@/app/admin/news/actions";
import { AdminNewsForm } from "@/components/admin-news-form";
import { Button } from "@/components/ui/button";
import type { ForumPost } from "@/lib/forum";
import type { Locale } from "@/lib/i18n";

function ModalPortal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/65 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.25rem] border border-ink/15 bg-paper p-6 text-ink shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

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

      <ModalPortal open={open} onClose={() => setOpen(false)}>
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
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white/80 text-ink/70 transition hover:bg-wine hover:text-paper"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <AdminNewsForm onSuccess={() => setOpen(false)} />
      </ModalPortal>
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

      <ModalPortal open={open} onClose={() => setOpen(false)}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              {isEn ? "Edit News" : "Edycja aktualności"}
            </p>
            <h3 className="mt-1 line-clamp-1 font-serif text-3xl font-bold">
              {post.title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
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
      </ModalPortal>
    </>
  );
}
