import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, CalendarDays, Pin } from "lucide-react";
import { format } from "date-fns";
import { enUS, pl } from "date-fns/locale";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NewsletterForm } from "@/components/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/lib/events";
import { getFeaturedForumPosts } from "@/lib/forum";
import { getCategoryName, getPostExcerpt, getPostTitle } from "@/lib/forum-copy";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { localizedSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const locale = await getLocale();
  const t = copy[locale].home;
  const siteContent = localizedSiteContent[locale];
  const [featuredPosts, events] = await Promise.all([
    getFeaturedForumPosts(),
    getEvents(),
  ]);
  const dateLocale = locale === "en" ? enUS : pl;

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <section className="relative isolate overflow-hidden border-b border-ink/10">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/final414.jpg"
              alt="Zespół Tańca Ludowego Poznań AWF podczas występu"
              fill
              className="motion-hero-image object-cover"
              priority
            />
            <div className="absolute inset-0 bg-ink/55" />
          </div>
          <div className="container flex min-h-[calc(100vh-5rem)] items-end py-20">
            <div className="motion-hero-copy max-w-4xl text-paper">
              <Badge className="border-paper/25 bg-paper/10 text-paper backdrop-blur">
                {t.badge}
              </Badge>
              <h1 className="mt-8 font-serif text-6xl font-semibold leading-[0.92] md:text-8xl">
                {t.title}
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-8 text-paper/80">
                {t.lead}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="brass">
                  <Link href="/contact">
                    {t.offerCta} <ArrowRight className="motion-link-icon h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-paper/40 text-paper hover:bg-paper hover:text-ink">
                  <Link href="/news">{t.forumCta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="container grid gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr]" data-animate>
          <div>
            <Badge>{t.historyBadge}</Badge>
            <h2 className="editorial-rule mt-6 font-serif text-5xl font-semibold leading-tight">
              {t.historyTitle}
            </h2>
            <div className="mt-10 space-y-5 text-lg leading-8 text-ink/70">
              <p>
                {t.history1}
              </p>
              <p>
                {t.history2}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {siteContent.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="motion-card rounded-[2rem] border border-ink/10 bg-white/55 p-8 shadow-glass backdrop-blur"
                data-animate
                style={{ "--motion-delay": `${index * 80}ms` } as CSSProperties}
              >
                <p className="font-sans text-6xl font-light tracking-[-0.03em]">{stat.value}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-ink/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-vellum py-24" data-animate>
          <div className="container grid gap-8">
            {siteContent.sections.map((section, index) => (
              <article
                id={section.id}
                key={section.id}
                className="motion-card grid overflow-hidden rounded-[2.5rem] border border-ink/10 bg-paper shadow-glass lg:grid-cols-2"
                data-animate
                style={{ "--motion-delay": `${index * 110}ms` } as CSSProperties}
              >
                <div className={index % 2 ? "relative min-h-80 lg:order-2" : "relative min-h-80"}>
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="motion-image object-cover"
                  />
                </div>
                <div className={index % 2 ? "flex flex-col justify-center p-8 py-10 md:p-12 lg:order-1 lg:min-h-80" : "flex flex-col justify-center p-8 py-10 md:p-12 lg:min-h-80"}>
                  <h3 className="font-serif text-4xl font-semibold leading-tight">
                    {section.title}
                  </h3>
                  <p className="mt-6 text-lg leading-8 text-ink/70">{section.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {featuredPosts.length ? (
          <section className="container py-20" data-animate>
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge>{t.featuredBadge}</Badge>
                <h2 className="mt-5 font-serif text-5xl font-semibold leading-tight">
                  {t.featuredTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/65">
                  {t.featuredLead}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/news">{t.forumCta}</Link>
              </Button>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="motion-card overflow-hidden rounded-[2rem] border border-ink/10 bg-white/60 shadow-glass backdrop-blur"
                  data-animate
                  style={{ "--motion-delay": `${index * 90}ms` } as CSSProperties}
                >
                  {post.image_url ? (
                    <div className="relative min-h-52 border-b border-ink/10">
                      <Image
                        src={post.image_url}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="motion-image object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                      <Pin className="h-4 w-4" />
                      {getCategoryName(post.category, locale)}
                    </div>
                    <h3 className="font-serif text-3xl font-bold leading-tight">
                      {getPostTitle(post, locale)}
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/65">{getPostExcerpt(post, locale)}</p>
                    <Link
                      href={`/news/${post.id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-wine"
                    >
                      {t.readPost} <ArrowRight className="motion-link-icon h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="container py-24" data-animate>
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge>{t.eventsBadge}</Badge>
              <h2 className="mt-6 font-serif text-5xl font-semibold leading-tight">
                {t.eventsTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/65">
                {t.eventsLead}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/oferta">{t.viewAllEvents}</Link>
            </Button>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {events.slice(0, 3).map((event, index) => {
              const startsAt = new Date(event.starts_at);
              const title = locale === "en" ? event.title_en ?? event.title_pl : event.title_pl;
              const summary =
                locale === "en" ? event.summary_en ?? event.summary_pl : event.summary_pl;

              return (
                <article
                  key={event.id}
                  className="motion-card rounded-[2rem] border border-ink/10 bg-white/60 p-6 shadow-glass backdrop-blur"
                  data-animate
                  style={{ "--motion-delay": `${index * 90}ms` } as CSSProperties}
                >
                  <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                    <CalendarDays className="h-4 w-4" />
                    {format(startsAt, "dd LLL yyyy", { locale: dateLocale })}
                  </div>
                  <h3 className="font-serif text-3xl font-bold leading-tight">{title}</h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/65">{summary}</p>
                  <p className="mt-5 text-sm font-semibold text-ink/55">
                    {event.venue_city ?? event.venue_name}
                  </p>
                  <Link
                    href={`/oferta/${event.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-wine"
                  >
                    {locale === "en" ? "Event details" : "Szczegóły wydarzenia"}{" "}
                    <ArrowRight className="motion-link-icon h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="container py-24 text-center" data-animate>
          <Badge>{t.travelsBadge}</Badge>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-semibold">
            {t.travelsTitle}
          </h2>
          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-3">
            {siteContent.countries.map((country) => (
              <span
                key={country}
                className="motion-card rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-sm text-ink/70"
                data-animate
              >
                {country}
              </span>
            ))}
          </div>
        </section>

        <section className="container pb-24" data-animate>
          <div className="motion-card grid gap-10 rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Badge>{t.newsletterHomeBadge}</Badge>
              <h2 className="mt-6 font-serif text-5xl font-semibold leading-tight">
                {t.newsletterHomeTitle}
              </h2>
              <p className="mt-6 text-lg leading-8 text-ink/65">{t.newsletterHomeLead}</p>
            </div>
            <div className="self-center">
              <NewsletterForm locale={locale} />
            </div>
          </div>
        </section>

        <section className="container pb-24" data-animate>
          <div className="motion-card grid overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white/60 shadow-glass backdrop-blur lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <Badge>{t.locationBadge}</Badge>
              <h2 className="mt-6 font-serif text-5xl font-semibold leading-tight">
                {t.locationTitle}
              </h2>
              <p className="mt-6 text-lg leading-8 text-ink/65">{t.locationLead}</p>
              <address className="mt-6 not-italic leading-7 text-ink/75">
                <strong>AWF Poznań</strong>
                <br />
                {t.locationAddress}
              </address>
              <a
                href="https://www.openstreetmap.org/?mlat=52.397979&mlon=16.948951#map=16/52.397979/16.948951"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-fit rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition hover:bg-wine"
              >
                {t.openMap}
              </a>
            </div>
            <div className="min-h-[24rem] border-t border-ink/10 lg:border-l lg:border-t-0">
              <iframe
                title="AWF Poznań map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=16.941151%2C52.393329%2C16.956751%2C52.402629&layer=mapnik&marker=52.397979%2C16.948951"
                className="h-full min-h-[24rem] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
