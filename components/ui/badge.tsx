import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ink/15 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink/70 backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
