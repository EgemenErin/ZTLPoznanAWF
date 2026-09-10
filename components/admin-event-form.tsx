"use client";

import { useActionState } from "react";

import { createEvent, updateEvent, type EventActionState } from "@/app/admin/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EventCategory, EventOffer } from "@/lib/events";

const initialState: EventActionState = {
  status: "idle",
  message: "",
};

function toDateTimeLocal(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function AdminEventForm({
  categories,
  event,
}: {
  categories: EventCategory[];
  event?: EventOffer;
}) {
  const isEditing = Boolean(event);
  const [state, action, pending] = useActionState(isEditing ? updateEvent : createEvent, initialState);

  return (
    <form action={action} className="grid gap-5 rounded-[2.5rem] border border-ink/10 bg-white/60 p-6 shadow-glass backdrop-blur md:p-8">
      {event ? <input type="hidden" name="event_id" value={event.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title_pl" placeholder="Tytuł PL" defaultValue={event?.title_pl ?? ""} required />
        <Input name="title_en" placeholder="Title EN" defaultValue={event?.title_en ?? ""} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="slug" placeholder="slug-wydarzenia" defaultValue={event?.slug ?? ""} required />
        <select
          name="category_id"
          defaultValue={event?.category_id ?? event?.category?.id ?? categories[0]?.id ?? ""}
          className="h-12 rounded-full border border-ink/15 bg-white/70 px-5 text-sm text-ink shadow-sm outline-none focus:ring-2 focus:ring-brass"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name_pl}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          name="starts_at"
          type="datetime-local"
          defaultValue={toDateTimeLocal(event?.starts_at)}
          required
        />
        <Input name="ends_at" type="datetime-local" defaultValue={toDateTimeLocal(event?.ends_at)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="venue_name" placeholder="Miejsce" defaultValue={event?.venue_name ?? ""} />
        <Input name="venue_city" placeholder="Miasto" defaultValue={event?.venue_city ?? ""} />
      </div>
      <Input name="venue_address" placeholder="Adres" defaultValue={event?.venue_address ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="ticket_url" placeholder="Link do biletów" defaultValue={event?.ticket_url ?? ""} />
        <Input name="price_label" placeholder="Etykieta CTA, np. kup bilet" defaultValue={event?.price_label ?? ""} />
      </div>
      <Input name="image_url" placeholder="URL obrazka" defaultValue={event?.image_url ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea name="summary_pl" placeholder="Krótki opis PL" defaultValue={event?.summary_pl ?? ""} />
        <Textarea name="summary_en" placeholder="Short summary EN" defaultValue={event?.summary_en ?? ""} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea name="description_pl" placeholder="Pełny opis PL" defaultValue={event?.description_pl ?? ""} />
        <Textarea name="description_en" placeholder="Full description EN" defaultValue={event?.description_en ?? ""} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <select
          name="status"
          defaultValue={event?.status ?? "draft"}
          className="h-12 rounded-full border border-ink/15 bg-white/70 px-5 text-sm text-ink shadow-sm outline-none focus:ring-2 focus:ring-brass"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
          <option value="archived">Archived</option>
        </select>
        <Input name="timezone" placeholder="Europe/Warsaw" defaultValue={event?.timezone ?? "Europe/Warsaw"} />
        <label className="flex items-center gap-3 rounded-full border border-ink/15 bg-white/70 px-5 text-sm text-ink/70">
          <input name="is_featured" type="checkbox" defaultChecked={event?.is_featured ?? false} />
          Featured
        </label>
      </div>
      <Button type="submit" disabled={pending} variant="brass">
        {pending ? "Saving..." : isEditing ? "Update event" : "Create event"}
      </Button>
      {state.message ? (
        <p className={state.status === "error" ? "text-sm text-wine" : "text-sm text-ink/65"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
