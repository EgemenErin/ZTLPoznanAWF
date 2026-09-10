import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Kontakt dla firm | ZTL Poznań AWF",
};

export default async function ContactPage() {
  const locale = await getLocale();
  const isEn = locale === "en";
  const email = "kontakt@ztlpoznanawf.pl";
  const subject = isEn
    ? "Business inquiry for ZTL Poznań AWF"
    : "Zapytanie biznesowe dla ZTL Poznań AWF";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <Badge>{isEn ? "Business contact" : "Kontakt dla firm"}</Badge>
          <h1 className="mt-7 font-serif text-6xl font-bold leading-none md:text-8xl">
            {isEn ? "Invite us to your event" : "Zaproś nas na wydarzenie"}
          </h1>
          <p className="mt-8 text-xl leading-9 text-ink/70">
            {isEn
              ? "Write to us about concerts, workshops, cultural events, corporate performances, and cooperation opportunities."
              : "Napisz do nas w sprawie koncertów, warsztatów, wydarzeń kulturalnych, występów firmowych i współpracy."}
          </p>
        </section>
        <section className="rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur md:p-12">
          <h2 className="font-serif text-4xl font-bold">
            {isEn ? "Send an inquiry" : "Wyślij zapytanie"}
          </h2>
          <p className="mt-4 leading-7 text-ink/65">
            {isEn
              ? "Include the date, location, type of event, expected duration, and contact phone number."
              : "Dodaj datę, miejsce, rodzaj wydarzenia, przewidywany czas występu oraz telefon kontaktowy."}
          </p>
          <div className="mt-8 grid gap-4">
            <Button asChild size="lg" variant="brass">
              <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}>
                <Mail className="h-4 w-4" /> {email}
              </a>
            </Button>
            <div className="rounded-3xl bg-paper/70 p-5 text-sm leading-7 text-ink/65">
              <Phone className="mb-3 h-5 w-5 text-brass" />
              {isEn
                ? "For best response, send an email with all business details."
                : "Najszybszą odpowiedź uzyskasz, wysyłając e-mail z pełnymi szczegółami zapytania."}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
