import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { AdminSectionQuickEdit } from "@/components/admin-section-quick-edit";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/forum";
import { getLocale } from "@/lib/i18n-server";
import { getSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Kontakt dla firm | ZTL Poznań AWF",
};

export default async function ContactPage() {
  const locale = await getLocale();
  const isEn = locale === "en";
  const [profile, siteContent] = await Promise.all([
    getCurrentProfile(),
    getSiteContent(),
  ]);
  const canManage = profile?.role === "admin" || profile?.role === "moderator";
  const bc = siteContent[locale].businessContact;
  const subject = isEn
    ? "Business inquiry for ZTL Poznań AWF"
    : "Zapytanie biznesowe dla ZTL Poznań AWF";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge>{bc.badge}</Badge>
            {canManage ? (
              <AdminSectionQuickEdit
                section="businessContact"
                locale={locale}
                content={siteContent}
                label={isEn ? "Edit page" : "Edytuj stronę"}
              />
            ) : null}
          </div>
          <h1 className="mt-7 font-serif text-6xl font-bold leading-none md:text-8xl">
            {bc.title}
          </h1>
          <p className="mt-8 text-xl leading-9 text-ink/70">{bc.lead}</p>
          <div className="mt-8">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 text-sm font-bold text-wine"
            >
              {isEn
                ? "Looking for general contact & staff directory? Go to Contact"
                : "Szukasz ogólnego kontaktu i danych kadry? Przejdź do strony Kontakt"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <section className="rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur md:p-12">
          <h2 className="font-serif text-4xl font-bold">{bc.inquiryTitle}</h2>
          <p className="mt-4 leading-7 text-ink/65">{bc.inquiryLead}</p>
          <div className="mt-8 grid gap-4">
            <Button asChild size="lg" variant="brass">
              <a href={`mailto:${bc.email}?subject=${encodeURIComponent(subject)}`}>
                <Mail className="h-4 w-4" /> {bc.email}
              </a>
            </Button>
            <div className="rounded-3xl bg-paper/70 p-5 text-sm leading-7 text-ink/65">
              <Phone className="mb-3 h-5 w-5 text-brass" />
              {bc.phoneNote}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
