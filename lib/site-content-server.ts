import { cache } from "react";
import { readFile, writeFile } from "fs/promises";
import path from "path";

import {
  defaultSiteContent,
  mergeSiteContent,
  type LocaleSiteContent,
  type SiteContentMap,
} from "@/lib/site-content";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export const SITE_SETTINGS_KEY = "site_content";
export const SITE_CONTENT_SENTINEL_TITLE = "__SITE_CONTENT__";
const LOCAL_CONTENT_FILE = path.join(process.cwd(), ".site-content.local.json");

export async function readLocalSiteContent(): Promise<SiteContentMap | null> {
  try {
    const raw = await readFile(LOCAL_CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return mergeSiteContent(parsed);
  } catch {
    return null;
  }
}

export async function writeLocalSiteContent(content: SiteContentMap): Promise<boolean> {
  try {
    await writeFile(LOCAL_CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export const getSiteContent = cache(async (): Promise<SiteContentMap> => {
  if (!hasSupabaseEnv()) {
    const local = await readLocalSiteContent();
    return local ?? defaultSiteContent;
  }

  try {
    const supabase = await createSupabaseServerClient();

    // 1. Try primary `site_settings` table (from migration 006)
    const { data: settingRow, error: settingError } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SITE_SETTINGS_KEY)
      .maybeSingle();

    if (!settingError && settingRow?.value) {
      return mergeSiteContent(
        settingRow.value as Partial<Record<"pl" | "en", Partial<LocaleSiteContent>>>,
      );
    }

    // 2. Fallback: check `forum_posts` sentinel row if migration 006 hasn't been run yet
    const { data: fallbackRow } = await supabase
      .from("forum_posts")
      .select("body")
      .eq("title", SITE_CONTENT_SENTINEL_TITLE)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fallbackRow?.body) {
      const parsed = JSON.parse(fallbackRow.body);
      return mergeSiteContent(parsed);
    }
  } catch {
    // Ignore and try local or default fallback
  }

  const local = await readLocalSiteContent();
  return local ?? defaultSiteContent;
});
