import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { Search } from "lucide-react";

import { AdminNotifications } from "@/components/admin-notifications";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { ADMIN_NOTIFS_SEEN_COOKIE } from "@/lib/admin-notifications";
import { getAdminCommentNotifications, getCurrentProfile } from "@/lib/forum";
import { copy, type Locale } from "@/lib/i18n";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy[locale].nav;
  const profile = await getCurrentProfile();
  const canSeeAdmin = profile?.role === "admin" || profile?.role === "moderator";
  const navItems = [
    { href: "/#about", label: t.about },
    { href: "/contact", label: t.contactBusiness },
    { href: "/news", label: t.news },
    ...(canSeeAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/#contact", label: t.contact },
  ];

  const jar = await cookies();
  const notifications = canSeeAdmin
    ? await getAdminCommentNotifications(jar.get(ADMIN_NOTIFS_SEEN_COOKIE)?.value)
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-xl animate-in">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="ZTL Poznań AWF">
          <Image src="/logo/ztllogo.png" alt="" width={56} height={56} className="h-14 w-14" priority />
          <div className="hidden leading-tight sm:block">
            <p className="font-serif text-xl font-semibold">ZTL Poznań AWF</p>
            <p className="text-xs uppercase tracking-[0.24em] text-ink/55">Folk Dance Ensemble</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-[0.14em] text-ink/70 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-motion-link transition hover:text-wine">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {canSeeAdmin ? <AdminNotifications locale={locale} notifications={notifications} /> : null}
          <LanguageSwitcher locale={locale} />
          <Button variant="ghost" size="sm" aria-label={t.search}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
