"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type EventActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const eventStatuses = new Set(["draft", "published", "cancelled", "archived"]);

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireEventManager() {
  if (!hasSupabaseEnv()) {
    return { ok: false as const, message: "Connect Supabase to manage events." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { ok: false as const, message: "Log in as an admin or moderator." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { ok: false as const, message: "Only admins and moderators can manage events." };
  }

  return { ok: true as const, supabase, userId: userData.user.id };
}

function eventPayload(formData: FormData, userId?: string) {
  const titlePl = String(formData.get("title_pl") ?? "").trim();
  const slugValue = nullable(formData.get("slug")) ?? slugify(titlePl);
  const status = String(formData.get("status") ?? "draft");

  return {
    category_id: nullable(formData.get("category_id")),
    title_pl: titlePl,
    title_en: nullable(formData.get("title_en")),
    slug: slugValue,
    summary_pl: nullable(formData.get("summary_pl")),
    summary_en: nullable(formData.get("summary_en")),
    description_pl: nullable(formData.get("description_pl")),
    description_en: nullable(formData.get("description_en")),
    starts_at: String(formData.get("starts_at") ?? ""),
    ends_at: nullable(formData.get("ends_at")),
    timezone: nullable(formData.get("timezone")) ?? "Europe/Warsaw",
    venue_name: nullable(formData.get("venue_name")),
    venue_city: nullable(formData.get("venue_city")),
    venue_address: nullable(formData.get("venue_address")),
    image_url: nullable(formData.get("image_url")),
    ticket_url: nullable(formData.get("ticket_url")),
    price_label: nullable(formData.get("price_label")),
    is_featured: formData.get("is_featured") === "on",
    status: eventStatuses.has(status) ? status : "draft",
    ...(userId ? { created_by: userId } : {}),
  };
}

export async function createEvent(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const manager = await requireEventManager();

  if (!manager.ok) {
    return { status: "error", message: manager.message };
  }

  const payload = eventPayload(formData, manager.userId);

  if (!payload.title_pl || !payload.slug || !payload.starts_at) {
    return { status: "error", message: "Title, slug, and start date are required." };
  }

  const { error } = await manager.supabase.from("events").insert(payload);

  if (error) {
    return { status: "error", message: `Could not create event: ${error.message}` };
  }

  revalidatePath("/admin/events");
  revalidatePath("/oferta");
  revalidatePath(`/oferta/${payload.slug}`);
  return { status: "success", message: "Event created." };
}

export async function updateEvent(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const manager = await requireEventManager();
  const eventId = String(formData.get("event_id") ?? "");

  if (!manager.ok) {
    return { status: "error", message: manager.message };
  }

  if (!eventId) {
    return { status: "error", message: "Missing event id." };
  }

  const payload = eventPayload(formData);

  if (!payload.title_pl || !payload.slug || !payload.starts_at) {
    return { status: "error", message: "Title, slug, and start date are required." };
  }

  const { error } = await manager.supabase.from("events").update(payload).eq("id", eventId);

  if (error) {
    return { status: "error", message: `Could not update event: ${error.message}` };
  }

  revalidatePath("/admin/events");
  revalidatePath("/oferta");
  revalidatePath(`/oferta/${payload.slug}`);
  return { status: "success", message: "Event updated." };
}

export async function deleteEvent(formData: FormData) {
  const manager = await requireEventManager();
  const eventId = String(formData.get("event_id") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (!manager.ok || !eventId) {
    return;
  }

  await manager.supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/admin/events");
  revalidatePath("/oferta");
  if (slug) {
    revalidatePath(`/oferta/${slug}`);
  }
}
