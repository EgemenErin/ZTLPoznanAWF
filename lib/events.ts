import { cache } from "react";

import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type EventCategory = {
  id: string;
  slug: string;
  name_pl: string;
  name_en?: string | null;
  color?: string | null;
};

export type EventOffer = {
  id: string;
  category_id?: string | null;
  slug: string;
  title_pl: string;
  title_en?: string | null;
  summary_pl?: string | null;
  summary_en?: string | null;
  description_pl?: string | null;
  description_en?: string | null;
  starts_at: string;
  ends_at?: string | null;
  timezone?: string | null;
  venue_name?: string | null;
  venue_city?: string | null;
  venue_address?: string | null;
  image_url?: string | null;
  ticket_url?: string | null;
  price_label?: string | null;
  is_featured: boolean;
  status?: "draft" | "published" | "cancelled" | "archived";
  category?: EventCategory | null;
};

export const fallbackCategories: EventCategory[] = [
  { id: "koncerty", slug: "koncerty", name_pl: "Koncerty", name_en: "Concerts", color: "#5c1f25" },
  { id: "warsztaty", slug: "warsztaty", name_pl: "Warsztaty", name_en: "Workshops", color: "#a1743b" },
  { id: "oprowadzanie", slug: "oprowadzanie", name_pl: "Oprowadzanie", name_en: "Tours", color: "#2f4f3f" },
  { id: "wyjazdy", slug: "wyjazdy", name_pl: "Wyjazdy", name_en: "Travel", color: "#1f3a5c" },
];

export const fallbackEvents: EventOffer[] = [
  {
    id: "toronto-mazowsze",
    slug: "toronto-mazowsze-back-in-canada",
    title_pl: "Toronto | The Magnificent MAZOWSZE - Back in Canada",
    title_en: "Toronto | The Magnificent MAZOWSZE - Back in Canada",
    summary_pl: "Koncert wyjazdowy z repertuarem narodowym i regionalnym.",
    summary_en: "A touring concert with national and regional repertoire.",
    description_pl:
      "Wieczór z monumentalną energią polskiej sceny ludowej: tańce narodowe, pieśni regionalne i opowieść o kulturze, która podróżuje razem z zespołem.",
    description_en:
      "An evening with the monumental energy of the Polish folk stage: national dances, regional songs, and a story of culture that travels with the ensemble.",
    starts_at: "2026-04-29T20:00:00+02:00",
    venue_name: "Wydarzenie wyjazdowe",
    venue_city: "Toronto",
    ticket_url: "#",
    price_label: "kup bilet",
    is_featured: true,
    category: fallbackCategories[3],
  },
  {
    id: "chicago-mazowsze",
    slug: "chicago-mazowsze-back-in-the-usa",
    title_pl: "Chicago | The Magnificent MAZOWSZE - Back in the USA",
    title_en: "Chicago | The Magnificent MAZOWSZE - Back in the USA",
    summary_pl: "Koncert piątkowy dla polonijnej publiczności.",
    summary_en: "A Friday concert for the Polish diaspora audience.",
    description_pl:
      "Program łączy precyzję sceny koncertowej z żywiołowością tańca. To oferta dla widzów, którzy chcą zobaczyć folklor w najbardziej reprezentacyjnej odsłonie.",
    description_en:
      "The program combines concert-stage precision with the vitality of dance. It is an offer for audiences who want to see folklore in its most representative form.",
    starts_at: "2026-05-01T20:00:00+02:00",
    venue_name: "Wydarzenie wyjazdowe",
    venue_city: "Chicago",
    ticket_url: "#",
    price_label: "kup bilet",
    is_featured: true,
    category: fallbackCategories[3],
  },
  {
    id: "polskie-tance",
    slug: "polskie-tance-narodowe-oprowadzanie-rodzinne",
    title_pl: "Polskie Tańce Narodowe - oprowadzanie rodzinne",
    title_en: "Polish National Dances - family guided tour",
    summary_pl: "Rodzinne spotkanie z historią polskich tańców narodowych.",
    summary_en: "A family encounter with the history of Polish national dances.",
    description_pl:
      "Oprowadzanie po świecie poloneza, mazura, oberka, kujawiaka i krakowiaka. Dla rodzin, szkół i wszystkich, którzy chcą zrozumieć, co kryje się za scenicznym gestem.",
    description_en:
      "A guided introduction to polonaise, mazur, oberek, kujawiak, and krakowiak. For families, schools, and everyone curious about the meaning behind the stage gesture.",
    starts_at: "2026-05-01T15:00:00+02:00",
    venue_name: "Centrum Folkloru Polskiego",
    venue_city: "Karolin",
    ticket_url: "#",
    price_label: "szczegóły",
    is_featured: false,
    category: fallbackCategories[2],
  },
  {
    id: "warsztaty-wielkopolskie",
    slug: "warsztaty-tance-wielkopolskie",
    title_pl: "Warsztaty: tańce wielkopolskie",
    title_en: "Workshop: dances of Wielkopolska",
    summary_pl: "Praktyczne zajęcia dla początkujących i średnio zaawansowanych.",
    summary_en: "Practical classes for beginners and intermediate participants.",
    description_pl:
      "Spotkanie warsztatowe prowadzone przez tancerzy i instruktorów zespołu. Uczestnicy poznają podstawy kroku, rytmu i kontekstu regionalnego.",
    description_en:
      "A workshop led by ensemble dancers and instructors. Participants learn the basics of steps, rhythm, and regional context.",
    starts_at: "2026-05-12T18:30:00+02:00",
    venue_name: "Sala prób AWF Poznań",
    venue_city: "Poznań",
    ticket_url: "#",
    price_label: "zapisz się",
    is_featured: false,
    category: fallbackCategories[1],
  },
];

export const getEventCategories = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackCategories;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_categories")
    .select("id, slug, name_pl, name_en, color")
    .order("name_pl");

  if (error) {
    return fallbackCategories;
  }

  return data as EventCategory[];
});

export const getEvents = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackEvents;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, category:event_categories(id, slug, name_pl, name_en, color)")
    .eq("status", "published")
    .order("starts_at", { ascending: true });

  if (error) {
    return fallbackEvents;
  }

  return data as EventOffer[];
});

export const getAdminEvents = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackEvents;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, category:event_categories(id, slug, name_pl, name_en, color)")
    .order("starts_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as EventOffer[];
});

export async function getEventBySlug(slug: string) {
  const events = await getEvents();
  return events.find((event) => event.slug === slug) ?? null;
}
