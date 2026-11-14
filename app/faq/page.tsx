import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n-server";
import { breadcrumbLd, buildPageMetadata, faqLd } from "@/lib/seo";
import { seoContent } from "@/lib/seo-content";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ: najczęstsze pytania o zespół folklorystyczny",
  description:
    "Odpowiedzi na najczęstsze pytania o Zespół Tańca Ludowego Poznań AWF: kim jesteśmy, jakie tańce wykonujemy, gdzie ćwiczymy, jak dołączyć i jak zaprosić zespół na występ.",
  path: "/faq",
});

export default async function FaqPage() {
  const locale = await getLocale();
  const content = seoContent[locale];

  return (
    <>
      {/* Structured data is always Polish: that is the indexed language of the site. */}
      <JsonLd
        data={[
          faqLd(seoContent.pl.faqs),
          breadcrumbLd([
            { name: "Strona główna", path: "/" },
            { name: "Najczęściej zadawane pytania", path: "/faq" },
          ]),
        ]}
      />
      <SiteHeader locale={locale} />
      <main>
        <section className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge>{content.pageBadge}</Badge>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-none md:text-7xl">
              {content.pageTitle}
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink/70 md:text-xl">{content.pageLead}</p>
          </div>
        </section>

        <section
          id="o-zespole"
          className="border-y border-ink/10 bg-white/40 py-20"
          data-animate
        >
          <div className="container max-w-4xl">
            <Badge>{content.badge}</Badge>
            <h2 className="editorial-rule mt-6 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              {content.heading}
            </h2>
            <p className="mt-8 text-lg leading-8 text-ink/80">{content.answer}</p>
            <h3 className="mt-10 font-serif text-2xl font-semibold">{content.highlightsTitle}</h3>
            <ul className="mt-4 grid gap-3 text-ink/70">
              {content.highlights.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span
                    aria-hidden="true"
                    className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brass"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pytania" className="container py-20" data-animate>
          <h2 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
            {content.faqTitle}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {content.faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[2rem] border border-ink/10 bg-white/60 p-7 shadow-glass backdrop-blur"
              >
                <h3 className="font-serif text-2xl font-bold leading-snug">{faq.question}</h3>
                <p className="mt-4 leading-7 text-ink/70">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container pb-24" data-animate>
          <div className="flex flex-col gap-6 rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="font-serif text-4xl font-semibold leading-tight">
                {content.contactTitle}
              </h2>
              <p className="mt-3 text-lg text-ink/65">{content.contactLead}</p>
            </div>
            <Button asChild size="lg" variant="brass">
              <Link href="/kontakt">
                {content.contactCta} <ArrowRight className="motion-link-icon h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
