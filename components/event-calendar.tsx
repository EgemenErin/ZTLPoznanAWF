"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { enUS, pl } from "date-fns/locale";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EventCategory, EventOffer } from "@/lib/events";
import { copy, type Locale } from "@/lib/i18n";

type EventCalendarProps = {
  events: EventOffer[];
  categories: EventCategory[];
  locale: Locale;
};

export function EventCalendar({ events, categories, locale }: EventCalendarProps) {
  const t = copy[locale].offer;
  const dateLocale = locale === "en" ? enUS : pl;
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState("all");

  const months = useMemo(() => {
    const unique = new Map<string, string>();
    events.forEach((event) => {
      const date = new Date(event.starts_at);
      unique.set(format(date, "yyyy-MM"), format(date, "LLLL yyyy", { locale: dateLocale }));
    });
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }));
  }, [dateLocale, events]);

  const visibleEvents = useMemo(
    () =>
      events.filter((event) => {
        const categoryMatch = category === "all" || event.category?.slug === category;
        const monthMatch = month === "all" || format(new Date(event.starts_at), "yyyy-MM") === month;
        return categoryMatch && monthMatch;
      }),
    [category, events, month],
  );

  return (
    <div className="grid gap-10">
      <div className="rounded-[2rem] border border-ink/10 bg-white/45 p-4 shadow-glass backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge>{t.filters}</Badge>
            <p className="mt-3 text-sm text-ink/60">
              {t.filterHelp}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === "all" ? "bg-ink text-paper" : "bg-white/50 text-ink/70"}`}
            >
              {t.all}
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                onClick={() => setCategory(item.slug)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${category === item.slug ? "bg-ink text-paper" : "bg-white/50 text-ink/70"}`}
              >
                {item.name_pl}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-sm text-ink/60">
            <CalendarDays className="h-4 w-4" />
            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="bg-transparent font-semibold text-ink outline-none"
            >
              <option value="all">{t.allMonths}</option>
              {months.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {visibleEvents.map((event) => {
          const date = new Date(event.starts_at);
          return (
            <article
              key={event.id}
              className="group min-h-[28rem] border-l border-ink/20 px-7 py-5 transition hover:border-wine"
            >
              <div className="mb-8 flex items-start gap-3">
                <span className="font-serif text-6xl font-bold leading-none tracking-[-0.08em] md:text-7xl">
                  {format(date, "dd")}
                </span>
                <span className="pt-3 text-xs font-bold lowercase tracking-[0.08em] text-ink/70">
                  {format(date, "LLLL", { locale: pl })}
                </span>
              </div>
              <Badge>
                {locale === "en" ? event.category?.name_en ?? event.category?.name_pl ?? t.event : event.category?.name_pl ?? t.event}
              </Badge>
              <h2 className="mt-5 font-serif text-3xl font-bold leading-tight md:text-4xl">
                <Link href={`/oferta/${event.slug}`} className="hover:text-wine">
                  {locale === "en" ? event.title_en ?? event.title_pl : event.title_pl}
                </Link>
              </h2>
              <p className="mt-8 text-sm leading-6 text-ink/65">
                {locale === "en" ? event.summary_en ?? event.summary_pl : event.summary_pl}
              </p>
              <div className="mt-8 space-y-2 text-xs text-ink/60">
                <p>{format(date, "HH:mm EEEE", { locale: dateLocale })}</p>
                <p className="font-bold text-ink">{event.venue_name ?? event.venue_city}</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="mt-8 px-0 tracking-normal">
                <Link href={`/oferta/${event.slug}`}>
                  {event.price_label ?? t.details} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
