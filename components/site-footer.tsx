import Image from "next/image";
import Link from "next/link";

import { getCurrentProfile } from "@/lib/forum";
import { copy, type Locale } from "@/lib/i18n";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = copy[locale].footer;
  const profile = await getCurrentProfile();
  const canSeeAdmin = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <footer id="contact" className="border-t border-ink/10 bg-ink py-16 text-paper">
      <div className="container grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image src="/logo/ztllogo.png" alt="" width={80} height={80} className="mb-5 h-20 w-20 rounded-full" />
          <h2 className="font-serif text-3xl">Zespół Tańca Ludowego “Poznań” AWF</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-paper/70">
            {t.description}
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-paper/60">
            {t.contact}
          </h3>
          <p>AWF Poznań</p>
          <p>ul. Królowej Jadwigi 27/39</p>
          <p>61-871 Poznań</p>
          <p className="mt-5 text-paper/70">{t.director}</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-paper/60">
            {t.platform}
          </h3>
          <div className="grid gap-3 text-paper/80">
            <Link href="/oferta" className="hover:text-white">{t.events}</Link>
            <Link href="/newsletter" className="hover:text-white">{t.newsletter}</Link>
            <Link href="/forum" className="hover:text-white">{t.forum}</Link>
            {canSeeAdmin ? (
              <Link href="/admin" className="hover:text-white">
                Admin
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <div className="container mt-12 flex flex-col gap-6 border-t border-paper/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-paper/45">
          © {new Date().getFullYear()} ZTL Poznań AWF. {t.copyright}
        </p>
        <a
          href="https://www.cioff.pl/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit opacity-90 transition hover:opacity-100"
          aria-label="CIOFF"
        >
          <Image
            src="/logo/cioff_logo.png"
            alt="CIOFF"
            width={140}
            height={80}
            unoptimized
            className="h-14 w-auto bg-transparent"
          />
        </a>
      </div>
    </footer>
  );
}
