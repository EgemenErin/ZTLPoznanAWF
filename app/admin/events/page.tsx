import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ShieldCheck, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { deleteEvent } from "@/app/admin/events/actions";
import { AdminEventForm } from "@/components/admin-event-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminEvents, getEventCategories } from "@/lib/events";
import { getCurrentProfile } from "@/lib/forum";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Event admin | ZTL Poznań AWF",
};

export default async function AdminEventsPage() {
  const locale = await getLocale();
  const [profile, categories, events] = await Promise.all([
    getCurrentProfile(),
    getEventCategories(),
    getAdminEvents(),
  ]);
  const canManage = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <section>
            <Badge>Admin</Badge>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
              Event calendar CRUD
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink/65">
              Create, edit, publish, cancel, archive, and delete calendar events directly
              from the website. Published events appear on the public offer calendar.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-ink/55">
              <ShieldCheck className="h-5 w-5 text-brass" />
              Admin or moderator role required.
            </div>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/oferta">View public calendar</Link>
            </Button>
          </section>

          {canManage ? (
            <section>
              <h2 className="mb-5 font-serif text-3xl font-bold">Create new event</h2>
              <AdminEventForm categories={categories} />
            </section>
          ) : (
            <section className="rounded-[2.5rem] border border-ink/10 bg-white/60 p-8 shadow-glass backdrop-blur">
              <h2 className="font-serif text-3xl font-bold">Access required</h2>
              <p className="mt-4 leading-7 text-ink/65">
                Log in with an admin or moderator account to manage calendar events.
              </p>
              <Button asChild className="mt-6">
                <Link href="/auth/login">Log in</Link>
              </Button>
            </section>
          )}
        </div>

        {canManage ? (
          <section className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-brass" />
              <h2 className="font-serif text-4xl font-bold">Existing events</h2>
            </div>
            <div className="grid gap-6">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="grid gap-6 rounded-[2rem] border border-ink/10 bg-paper/75 p-5 md:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{event.status ?? "draft"}</Badge>
                        {event.category ? <Badge>{event.category.name_pl}</Badge> : null}
                      </div>
                      <h3 className="mt-4 font-serif text-3xl font-bold">{event.title_pl}</h3>
                      <p className="mt-2 text-sm text-ink/55">
                        {format(new Date(event.starts_at), "yyyy-MM-dd HH:mm")} · {event.venue_city ?? "No city"}
                      </p>
                    </div>
                    <form action={deleteEvent}>
                      <input type="hidden" name="event_id" value={event.id} />
                      <input type="hidden" name="slug" value={event.slug} />
                      <Button type="submit" variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </form>
                  </div>
                  <details className="rounded-[1.5rem] border border-ink/10 bg-white/50 p-4">
                    <summary className="cursor-pointer font-semibold text-wine">
                      Edit event
                    </summary>
                    <div className="mt-5">
                      <AdminEventForm categories={categories} event={event} />
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
