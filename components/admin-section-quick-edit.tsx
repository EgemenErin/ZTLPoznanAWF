"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";

import {
  AdminSiteContentEditor,
  type EditableSectionKey,
} from "@/components/admin-site-content-editor";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import type { SiteContentMap } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function AdminSectionQuickEdit({
  section,
  locale,
  content,
  label,
  variant = "light",
  className,
}: {
  section: EditableSectionKey;
  locale: Locale;
  content: SiteContentMap;
  label?: string;
  variant?: "light" | "dark" | "compact";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const isEn = locale === "en";
  const defaultLabel = isEn ? "Edit section" : "Edytuj sekcję";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn(
          "gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
          variant === "dark"
            ? "border-paper/35 bg-ink/50 text-paper backdrop-blur hover:bg-paper hover:text-ink"
            : variant === "compact"
              ? "h-8 border-ink/20 bg-white/80 px-2.5 py-1 text-ink hover:bg-wine hover:text-paper"
              : "border-ink/20 bg-white/85 text-ink shadow-sm hover:bg-wine hover:text-paper",
          className,
        )}
        title={label ?? defaultLabel}
      >
        <Pencil className="h-3.5 w-3.5" />
        <span>{label ?? defaultLabel}</span>
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2.25rem] border border-ink/15 bg-paper p-6 text-ink shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                  {isEn ? "Quick Editor" : "Szybka edycja"}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-bold">
                  {label ?? defaultLabel}
                </h2>
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

            <AdminSiteContentEditor
              initialContent={content}
              initialLocale={locale}
              focusedSection={section}
              onSaved={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
