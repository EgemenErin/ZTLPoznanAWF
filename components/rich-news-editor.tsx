"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Code2,
  Eye,
  EyeOff,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  Quote,
} from "lucide-react";

import { RichNewsContent } from "@/components/rich-news-content";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const toolbarItems = [
  { label: "Heading", icon: Heading2, before: "## ", after: "" },
  { label: "Bold", icon: Bold, before: "**", after: "**" },
  { label: "Italic", icon: Italic, before: "*", after: "*" },
  { label: "Link", icon: Link, before: "[", after: "](https://example.com)" },
  { label: "Quote", icon: Quote, before: "> ", after: "" },
  { label: "Code", icon: Code2, before: "`", after: "`" },
  { label: "List", icon: List, before: "- ", after: "" },
  { label: "Image", icon: ImageIcon, before: "![Image description](", after: ")" },
] as const;

export function RichNewsEditor({
  name,
  defaultValue = "",
  required,
}: {
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertMarkup(before: string, after: string) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const nextValue = `${value.slice(0, start)}${before}${selectedText}${after}${value.slice(end)}`;
    const nextCursor = start + before.length + selectedText.length;

    setValue(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-ink/15 bg-white/70 shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 bg-paper/75 px-3 py-2">
        {toolbarItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => insertMarkup(item.before, item.after)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition hover:bg-white hover:text-wine"
            aria-label={item.label}
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowPreview((current) => !current)}
          className="ml-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/55 transition hover:bg-white hover:text-wine"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? "Hide preview" : "Show preview"}
        </button>
      </div>
      <Textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required={required}
        placeholder="Write news content. Use the toolbar for headings, bold text, links, quotes, lists, code, and inline images."
        className={cn(
          "min-h-72 rounded-none border-0 bg-white/40 shadow-none focus-visible:ring-0",
          showPreview ? "border-b border-ink/10" : "",
        )}
      />
      {showPreview ? (
        <div className="bg-vellum/50 p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
            Live preview
          </div>
          <RichNewsContent
            body={value || "Perhaps you have the preview hidden. Click “show preview” to see how your post will be rendered."}
            className="rounded-[1.25rem] border border-ink/10 bg-white/65 p-5 text-lg leading-8 text-ink/75"
          />
        </div>
      ) : null}
    </div>
  );
}
