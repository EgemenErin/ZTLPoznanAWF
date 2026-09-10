import type { Metadata } from "next";
import { Mail, Sparkles } from "lucide-react";

import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { copy } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Newsletter | ZTL Poznań AWF",
  description:
    "Zapisz się do newslettera ZTL Poznań AWF i otrzymuj zaproszenia na wydarzenia, warsztaty i spotkania społeczności.",
};

export default async function NewsletterPage() {
  const locale = await getLocale();
  const t = copy[locale].newsletter;

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <section className="container grid min-h-[70vh] items-center gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge>{t.badge}</Badge>
            <h1 className="mt-7 font-serif text-6xl font-bold leading-none md:text-8xl">
              {t.title}
            </h1>
            <p className="mt-8 text-xl leading-9 text-ink/70">
              {t.lead}
            </p>
          </div>
          <div className="rounded-[2.75rem] border border-ink/10 bg-white/55 p-8 shadow-glass backdrop-blur md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-full bg-wine p-4 text-paper">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold">{t.formTitle}</h2>
                <p className="text-sm text-ink/55">{t.formHelp}</p>
              </div>
            </div>
            <NewsletterForm locale={locale} />
            <div className="mt-8 flex items-start gap-3 rounded-3xl bg-paper/70 p-5 text-sm leading-6 text-ink/65">
              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-brass" />
              {t.note}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
