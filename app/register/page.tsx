import type { Metadata } from "next";

import { RegisterForm } from "@/components/register-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Rejestracja | ZTL Poznań AWF",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const locale = await getLocale();
  const title = locale === "en" ? "Create an account" : "Utwórz konto";
  const lead =
    locale === "en"
      ? "Join the ZTL Poznań AWF community."
      : "Dołącz do społeczności ZTL Poznań AWF.";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container grid min-h-[65vh] place-items-center py-20">
        <section className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-white/55 p-8 shadow-glass backdrop-blur md:p-10">
          <h1 className="font-serif text-4xl font-bold">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">{lead}</p>
          <div className="mt-8">
            <RegisterForm locale={locale} />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
