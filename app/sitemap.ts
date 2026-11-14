import type { MetadataRoute } from "next";

import { getEvents } from "@/lib/events";
import { getForumThreads } from "@/lib/forum";
import { SITE_URL } from "@/lib/seo";

function safeDate(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/oferta`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/kontakt`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/forum`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
  ];

  const [events, threads] = await Promise.all([
    getEvents().catch(() => []),
    getForumThreads().catch(() => []),
  ]);

  const eventRoutes: MetadataRoute.Sitemap = events
    .filter((event) => event.slug && event.status !== "draft")
    .map((event) => ({
      url: `${SITE_URL}/oferta/${event.slug}`,
      lastModified: safeDate(event.starts_at) ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const newsRoutes: MetadataRoute.Sitemap = threads.map((thread) => ({
    url: `${SITE_URL}/news/${thread.id}`,
    lastModified: safeDate(thread.updated_at) ?? safeDate(thread.created_at) ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...eventRoutes, ...newsRoutes];
}
