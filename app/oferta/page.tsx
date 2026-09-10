import type { Metadata } from "next";

import { EventCalendar } from "@/components/event-calendar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getEventCategories, getEvents } from "@/lib/events";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Oferta i kalendarium wydarzeń | ZTL Poznań AWF",
  description:
    "Premium kalendarz koncertów, warsztatów, oprowadzań i wydarzeń ZTL Poznań AWF.",
};

export default async function OfferPage() {
  const locale = await getLocale();
  const t = copy[locale].offer;
  const [events, categories] = await Promise.all([getEvents(), getEventCategories()]);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <section className="container py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge>{t.badge}</Badge>
            <h1 className="mt-7 font-serif text-6xl font-bold leading-none md:text-8xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-ink/65">
              {t.lead}
            </p>
          </div>
          <div className="mt-16">
            <EventCalendar events={events} categories={categories} locale={locale} />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
