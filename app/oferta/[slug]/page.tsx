import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { enUS, pl } from "date-fns/locale";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventBySlug } from "@/lib/events";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

type OfferDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: OfferDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Wydarzenie nie znalezione" };
  }

  return {
    title: `${event.title_pl} | Oferta ZTL Poznań AWF`,
    description: event.summary_pl ?? "Szczegóły wydarzenia ZTL Poznań AWF.",
  };
}

export default async function OfferDetailPage({ params }: OfferDetailProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = copy[locale].offer;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const startsAt = new Date(event.starts_at);
  const dateLocale = locale === "en" ? enUS : pl;
  const title = locale === "en" ? event.title_en ?? event.title_pl : event.title_pl;
  const description =
    locale === "en"
      ? event.description_en ?? event.summary_en ?? event.description_pl ?? event.summary_pl
      : event.description_pl ?? event.summary_pl;

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <section className="container py-16 md:py-24">
          <Button asChild variant="ghost" className="mb-10 px-0 tracking-normal">
            <Link href="/oferta">
              <ArrowLeft className="h-4 w-4" /> {t.back}
            </Link>
          </Button>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge>
                {locale === "en" ? event.category?.name_en ?? event.category?.name_pl ?? t.badge : event.category?.name_pl ?? t.badge}
              </Badge>
              <h1 className="mt-7 font-serif text-6xl font-bold leading-none md:text-8xl">
                {title}
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-ink/70">
                {description}
              </p>
            </div>
            <aside className="rounded-[2.5rem] border border-ink/10 bg-white/55 p-8 shadow-glass backdrop-blur">
              <div className="flex items-center gap-4 border-b border-ink/10 pb-6">
                <CalendarDays className="h-6 w-6 text-brass" />
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-ink/45">{t.date}</p>
                  <p className="font-serif text-3xl font-bold">
                    {format(startsAt, "dd LLLL yyyy", { locale: dateLocale })}
                  </p>
                  <p className="text-ink/65">{format(startsAt, "HH:mm, EEEE", { locale: dateLocale })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b border-ink/10 py-6">
                <MapPin className="h-6 w-6 text-brass" />
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-ink/45">{t.place}</p>
                  <p className="font-semibold">{event.venue_name}</p>
                  <p className="text-ink/65">{event.venue_city}</p>
                </div>
              </div>
              <Button asChild size="lg" variant="brass" className="mt-8 w-full">
                <Link href={event.ticket_url ?? "/newsletter"}>
                  <Ticket className="h-4 w-4" /> {event.price_label ?? t.signup}
                </Link>
              </Button>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
