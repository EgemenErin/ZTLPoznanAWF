import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserCheck,
} from "lucide-react";

import { AdminSectionQuickEdit } from "@/components/admin-section-quick-edit";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/forum";
import { getLocale } from "@/lib/i18n-server";
import { getSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Kontakt | ZTL Poznań AWF",
  description:
    "Dane kontaktowe Zespołu Tańca Ludowego „Poznań” Akademii Wychowania Fizycznego w Poznaniu — adres biura, telefony, e-maile oraz kadra zespołu.",
};

export default async function KontaktPage() {
  const locale = await getLocale();
  const isEn = locale === "en";
  const [profile, siteContent] = await Promise.all([
    getCurrentProfile(),
    getSiteContent(),
  ]);
  const canManage = profile?.role === "admin" || profile?.role === "moderator";
  const k = siteContent[locale].kontakt;

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-16 md:py-24">
        {/* Hero / Intro */}
        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Badge>{k.badge}</Badge>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-none md:text-7xl">
              {k.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink/70 md:text-xl">{k.lead}</p>
          </div>

          {canManage ? (
            <div className="flex flex-wrap items-center gap-3">
              <AdminSectionQuickEdit
                section="kontakt"
                locale={locale}
                content={siteContent}
                label={isEn ? "Edit Kontakt info" : "Edytuj dane kontaktowe"}
              />
            </div>
          ) : null}
        </section>

        {/* Top 3 Info Cards */}
        <section className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Card 1: ZTL Office & Rehearsal Venue */}
          <article className="motion-card flex flex-col justify-between rounded-[2rem] border border-ink/10 bg-white/65 p-7 shadow-glass backdrop-blur">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                {isEn ? "Ensemble Office & Rehearsals" : "Biuro i sala prób"}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold">{k.officeTitle}</h2>
              <p className="mt-4 font-semibold text-ink">{k.officeBuilding}</p>
              <p className="mt-1 text-ink/70">{k.officeAddress}</p>
            </div>
            <a
              href="https://www.openstreetmap.org/search?query=ul.+%C5%9Aw.+Rocha+9%2C+61-142+Pozna%C5%84"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-wine"
            >
              <MapPin className="h-4 w-4" />
              {isEn ? "View on map" : "Zobacz na mapie"}
            </a>
          </article>

          {/* Card 2: Direct Phone & Emails */}
          <article className="motion-card flex flex-col justify-between rounded-[2rem] border border-ink/10 bg-white/65 p-7 shadow-glass backdrop-blur">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brass/15 text-brass">
                <Phone className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                {isEn ? "Direct Contact" : "Kontakt bezpośredni"}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold">
                {isEn ? "Phone & E-mail" : "Telefon i e-mail"}
              </h2>
              <div className="mt-5 grid gap-3 text-sm">
                <a
                  href={`tel:${k.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center gap-2.5 font-semibold text-ink transition hover:text-wine"
                >
                  <Phone className="h-4 w-4 text-brass" />
                  <span>{k.phone}</span>
                </a>
                <a
                  href={`mailto:${k.primaryEmail}`}
                  className="inline-flex items-center gap-2.5 font-semibold text-ink transition hover:text-wine"
                >
                  <Mail className="h-4 w-4 text-brass" />
                  <span>{k.primaryEmail}</span>
                </a>
                {k.secondaryEmail && k.secondaryEmail !== k.primaryEmail ? (
                  <a
                    href={`mailto:${k.secondaryEmail}`}
                    className="inline-flex items-center gap-2.5 text-ink/75 transition hover:text-wine"
                  >
                    <Mail className="h-4 w-4 text-brass" />
                    <span>{k.secondaryEmail}</span>
                  </a>
                ) : null}
              </div>
            </div>
            <div className="mt-6">
              <Button asChild variant="brass" size="sm">
                <a href={`mailto:${k.primaryEmail}`}>
                  <Mail className="h-4 w-4" />
                  {isEn ? "Write an e-mail" : "Napisz wiadomość"}
                </a>
              </Button>
            </div>
          </article>

          {/* Card 3: Main University Address */}
          <article className="motion-card flex flex-col justify-between rounded-[2rem] border border-ink/10 bg-white/65 p-7 shadow-glass backdrop-blur">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/10 text-ink">
                <GraduationCap className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                {isEn ? "University" : "Uczelnia"}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold">{k.campusTitle}</h2>
              <p className="mt-4 font-semibold text-ink">{k.campusName}</p>
              <p className="mt-1 text-ink/70">{k.campusAddress}</p>
            </div>
            <a
              href="https://awf.poznan.pl/uczelnia/administracja/prorektor-ds-wspolpracy-i-rozwoju/zespol-tanca-ludowego-awf-poznan/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-wine"
            >
              {isEn ? "AWF Poznań ZTL page" : "Strona ZTL na AWF Poznań"}{" "}
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        </section>

        {/* Organizational Note Banner */}
        {k.rehearsalNote ? (
          <section className="mt-8 rounded-[2rem] border border-ink/10 bg-vellum/80 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-brass" />
              <p className="text-base leading-7 text-ink/80">{k.rehearsalNote}</p>
            </div>
          </section>
        ) : null}

        {/* Staff / Team Contacts Section */}
        <section className="mt-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge>{k.teamBadge}</Badge>
              <h2 className="mt-5 font-serif text-4xl font-bold md:text-5xl">
                {k.teamTitle}
              </h2>
            </div>
            {canManage ? (
              <AdminSectionQuickEdit
                section="kontakt"
                locale={locale}
                content={siteContent}
                label={
                  isEn
                    ? "+ Add / Edit Team Contacts"
                    : "+ Dodaj / Edytuj osoby kontaktowe"
                }
              />
            ) : null}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {k.teamMembers.map((member) => (
              <article
                key={member.id}
                className="motion-card flex flex-col justify-between rounded-[2rem] border border-ink/10 bg-white/70 p-7 shadow-glass backdrop-blur"
              >
                <div>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-wine">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold leading-snug">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-brass">
                    {member.role}
                  </p>
                  <div className="mt-5 grid gap-2.5 border-t border-ink/10 pt-4 text-sm text-ink/75">
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 font-medium text-ink transition hover:text-wine"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-brass" />
                        <span className="truncate">{member.email}</span>
                      </a>
                    ) : null}
                    {member.phone ? (
                      <a
                        href={`tel:${member.phone.replace(/[^+\d]/g, "")}`}
                        className="inline-flex items-center gap-2 text-ink/75 transition hover:text-wine"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-brass" />
                        <span>{member.phone}</span>
                      </a>
                    ) : null}
                    {member.location ? (
                      <p className="mt-1 flex items-start gap-2 text-xs leading-5 text-ink/60">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/45" />
                        <span>{member.location}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <section className="mt-20">
          <div className="grid overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white/60 shadow-glass backdrop-blur lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <Badge>{isEn ? "Location" : "Lokalizacja"}</Badge>
              <h2 className="mt-5 font-serif text-4xl font-bold leading-tight">
                {isEn ? "Find us in Poznań" : "Jak do nas trafić"}
              </h2>
              <p className="mt-4 text-base leading-7 text-ink/70">
                {isEn
                  ? "Our office and rehearsal rooms are located at the AWF Student Dormitory Building on Św. Rocha 9, close to the main AWF Poznań campus."
                  : "Biuro oraz sala prób zespołu mieszczą się w Budynku Domu Studenckiego AWF przy ul. Św. Rocha 9, w pobliżu głównego kampusu AWF Poznań."}
              </p>
              <div className="mt-6 grid gap-3 text-sm text-ink/80">
                <div>
                  <strong className="text-ink">{k.officeTitle}:</strong> {k.officeBuilding},{" "}
                  {k.officeAddress}
                </div>
                <div>
                  <strong className="text-ink">{k.campusTitle}:</strong> {k.campusAddress}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="brass">
                  <a
                    href="https://www.openstreetmap.org/?mlat=52.397979&mlon=16.948951#map=16/52.397979/16.948951"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {isEn ? "Open in maps" : "Otwórz w mapach"}
                  </a>
                </Button>
              </div>
            </div>
            <div className="min-h-[24rem] border-t border-ink/10 lg:border-l lg:border-t-0">
              <iframe
                title="ZTL Poznań AWF location map"
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
