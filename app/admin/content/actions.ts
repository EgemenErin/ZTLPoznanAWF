"use server";

import { revalidatePath } from "next/cache";

import { getForumCategories } from "@/lib/forum";
import type { Locale } from "@/lib/i18n";
import {
  defaultSiteContent,
  mergeSiteContent,
  type LocaleSiteContent,
  type SiteContentMap,
} from "@/lib/site-content";
import {
  getSiteContent,
  SITE_CONTENT_SENTINEL_TITLE,
  SITE_SETTINGS_KEY,
  writeLocalSiteContent,
} from "@/lib/site-content-server";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type ContentActionResult = {
  status: "idle" | "success" | "error";
  message: string;
  content?: SiteContentMap;
};

async function requireContentManager() {
  if (!hasSupabaseEnv()) {
    return {
      ok: true as const,
      localOnly: true as const,
      supabase: null,
      userId: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return {
      ok: false as const,
      message: "Log in with an admin or moderator account to edit site content.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return {
      ok: false as const,
      message: "Only admins and moderators can edit site content.",
    };
  }

  return {
    ok: true as const,
    localOnly: false as const,
    supabase,
    userId: userData.user.id,
  };
}

function revalidateAllSitePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/kontakt");
  revalidatePath("/contact");
  revalidatePath("/news");
  revalidatePath("/admin");
}

async function persistSiteContent(merged: SiteContentMap): Promise<ContentActionResult> {
  const manager = await requireContentManager();

  if (!manager.ok) {
    return { status: "error", message: manager.message };
  }

  if (manager.localOnly || !manager.supabase) {
    const saved = await writeLocalSiteContent(merged);
    if (!saved) {
      return { status: "error", message: "Could not write local site content." };
    }
    revalidateAllSitePaths();
    return {
      status: "success",
      message: "Changes saved locally.",
      content: merged,
    };
  }

  // 1. Try saving to `site_settings` table (migration 006)
  const { error: settingsError } = await manager.supabase.from("site_settings").upsert(
    {
      key: SITE_SETTINGS_KEY,
      value: merged,
      updated_by: manager.userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (!settingsError) {
    revalidateAllSitePaths();
    return {
      status: "success",
      message: "Site content updated.",
      content: merged,
    };
  }

  // 2. Fallback to `forum_posts` sentinel row if `site_settings` table does not exist yet
  const categories = await getForumCategories();
  const categoryId = categories[0]?.id;

  if (categoryId) {
    const { data: existingRow } = await manager.supabase
      .from("forum_posts")
      .select("id")
      .eq("title", SITE_CONTENT_SENTINEL_TITLE)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const bodyJson = JSON.stringify(merged);

    if (existingRow?.id) {
      const { error: updateErr } = await manager.supabase
        .from("forum_posts")
        .update({
          body: bodyJson,
          is_pinned: false,
          status: "published",
        })
        .eq("id", existingRow.id);

      if (!updateErr) {
        revalidateAllSitePaths();
        return {
          status: "success",
          message: "Site content updated.",
          content: merged,
        };
      }
    } else {
      const { error: insertErr } = await manager.supabase.from("forum_posts").insert({
        category_id: categoryId,
        author_id: manager.userId,
        title: SITE_CONTENT_SENTINEL_TITLE,
        body: bodyJson,
        is_pinned: false,
        status: "published",
      });

      if (!insertErr) {
        revalidateAllSitePaths();
        return {
          status: "success",
          message: "Site content updated.",
          content: merged,
        };
      }
    }
  }

  // 3. Final dev fallback
  const savedLocal = await writeLocalSiteContent(merged);
  if (savedLocal) {
    revalidateAllSitePaths();
    return {
      status: "success",
      message: "Site content saved.",
      content: merged,
    };
  }

  return {
    status: "error",
    message: `Could not save site content: ${settingsError.message}`,
  };
}

export async function updateLocaleSiteSection(
  locale: Locale,
  partialLocaleContent: Partial<LocaleSiteContent>,
): Promise<ContentActionResult> {
  const current = await getSiteContent();
  const nextLocaleContent: LocaleSiteContent = {
    ...current[locale],
    ...partialLocaleContent,
    header: { ...current[locale].header, ...(partialLocaleContent.header ?? {}) },
    hero: { ...current[locale].hero, ...(partialLocaleContent.hero ?? {}) },
    about: { ...current[locale].about, ...(partialLocaleContent.about ?? {}) },
    stats: partialLocaleContent.stats ?? current[locale].stats,
    sections: partialLocaleContent.sections ?? current[locale].sections,
    featuredNews: {
      ...current[locale].featuredNews,
      ...(partialLocaleContent.featuredNews ?? {}),
    },
    eventsSection: {
      ...current[locale].eventsSection,
      ...(partialLocaleContent.eventsSection ?? {}),
    },
    travels: { ...current[locale].travels, ...(partialLocaleContent.travels ?? {}) },
    countries: partialLocaleContent.countries ?? current[locale].countries,
    newsletterHome: {
      ...current[locale].newsletterHome,
      ...(partialLocaleContent.newsletterHome ?? {}),
    },
    location: { ...current[locale].location, ...(partialLocaleContent.location ?? {}) },
    footer: { ...current[locale].footer, ...(partialLocaleContent.footer ?? {}) },
    kontakt: {
      ...current[locale].kontakt,
      ...(partialLocaleContent.kontakt ?? {}),
      teamMembers:
        partialLocaleContent.kontakt?.teamMembers ?? current[locale].kontakt.teamMembers,
    },
    businessContact: {
      ...current[locale].businessContact,
      ...(partialLocaleContent.businessContact ?? {}),
    },
  };

  const merged = mergeSiteContent({
    ...current,
    [locale]: nextLocaleContent,
  });

  return persistSiteContent(merged);
}

export async function saveFullSiteContent(content: SiteContentMap): Promise<ContentActionResult> {
  const merged = mergeSiteContent(content);
  return persistSiteContent(merged);
}

export async function resetLocaleSiteContent(locale: Locale): Promise<ContentActionResult> {
  const current = await getSiteContent();
  const merged = mergeSiteContent({
    ...current,
    [locale]: defaultSiteContent[locale],
  });
  return persistSiteContent(merged);
}
