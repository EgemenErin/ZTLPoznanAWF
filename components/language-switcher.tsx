"use client";

import { usePathname } from "next/navigation";

import { setLocale } from "@/app/language/actions";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <form action={setLocale} className="flex rounded-full border border-ink/10 bg-white/50 p-1">
      <input type="hidden" name="returnTo" value={pathname} />
      {(["pl", "en"] as const).map((item) => (
        <button
          key={item}
          type="submit"
          name="locale"
          value={item}
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] transition ${
            locale === item ? "bg-ink text-paper" : "text-ink/55 hover:text-ink"
          }`}
          aria-pressed={locale === item}
        >
          {item}
        </button>
      ))}
    </form>
  );
}
