import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https:\/\/[^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded-md bg-ink/10 px-1.5 py-0.5 text-[0.9em]">
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const [, label, href] = token.match(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/) ?? [];
      nodes.push(
        <a key={key} href={href} className="font-semibold text-wine underline underline-offset-4">
          {label}
        </a>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function RichNewsContent({ body, className }: { body: string; className?: string }) {
  const lines = body.split(/\r?\n/);

  return (
    <div className={cn("space-y-5", className)}>
      {lines.map((line, index) => {
        const key = `${index}-${line}`;
        const trimmed = line.trim();
        const image = trimmed.match(/^!\[([^\]]*)\]\((https:\/\/[^)]+)\)$/);

        if (!trimmed) {
          return <div key={key} className="h-2" />;
        }

        if (image && isHttpsUrl(image[2])) {
          return (
            <figure key={key} className="overflow-hidden rounded-[1.5rem] border border-ink/10">
              <div className="relative min-h-72">
                <Image src={image[2]} alt={image[1]} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
              </div>
            </figure>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={key} className="pt-3 font-serif text-3xl font-bold leading-tight text-ink">
              {renderInline(trimmed.slice(3))}
            </h2>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={key} className="border-l-4 border-brass pl-5 font-serif text-2xl italic leading-9 text-ink/70">
              {renderInline(trimmed.slice(2))}
            </blockquote>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <p key={key} className="pl-4 before:mr-3 before:text-brass before:content-['•']">
              {renderInline(trimmed.slice(2))}
            </p>
          );
        }

        return <p key={key}>{renderInline(line)}</p>;
      })}
    </div>
  );
}
