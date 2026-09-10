"use server";

import { revalidatePath } from "next/cache";

import { getForumCategory } from "@/lib/forum";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type NewsActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getImageUrl(formData: FormData) {
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!imageUrl) {
    return null;
  }

  try {
    const url = new URL(imageUrl);
    return url.protocol === "https:" ? imageUrl : null;
  } catch {
    return null;
  }
}

function getSchemaCacheMessage(errorMessage: string) {
  if (errorMessage.includes("schema cache")) {
    return "Database schema is not updated yet. Run supabase/migrations/004_news_media_formatting.sql in Supabase SQL Editor, then run: notify pgrst, 'reload schema';";
  }

  return null;
}

async function requireNewsManager() {
  if (!hasSupabaseEnv()) {
    return { ok: false as const, message: "Connect Supabase to manage news." };
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
    return { ok: false as const, message: "Only admins and moderators can manage news." };
  }

  return { ok: true as const, supabase, userId: userData.user.id };
}

export async function createNewsPost(
  _prevState: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  const manager = await requireNewsManager();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = getImageUrl(formData);
  const isFeatured = formData.get("isFeatured") === "on";

  if (!manager.ok) {
    return { status: "error", message: manager.message };
  }

  if (!title || !body) {
    return { status: "error", message: "Title and body are required." };
  }

  const category = await getForumCategory("ogloszenia");

  if (!category) {
    return { status: "error", message: "News category is missing." };
  }

  const { error } = await manager.supabase.from("forum_posts").insert({
    category_id: category.id,
    author_id: manager.userId,
    title,
    body,
    image_url: imageUrl,
    is_pinned: isFeatured,
  });

  if (error) {
    const schemaCacheMessage = getSchemaCacheMessage(error.message);
    if (schemaCacheMessage) {
      return { status: "error", message: schemaCacheMessage };
    }

    return { status: "error", message: `Could not create news: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/news");
  return { status: "success", message: "News post created." };
}

export async function updateNewsPost(
  _prevState: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  const manager = await requireNewsManager();
  const postId = String(formData.get("postId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = getImageUrl(formData);
  const isFeatured = formData.get("isFeatured") === "on";

  if (!manager.ok) {
    return { status: "error", message: manager.message };
  }

  if (!postId || !title || !body) {
    return { status: "error", message: "Post id, title, and body are required." };
  }

  const { error } = await manager.supabase
    .from("forum_posts")
    .update({
      title,
      body,
      image_url: imageUrl,
      is_pinned: isFeatured,
    })
    .eq("id", postId);

  if (error) {
    const schemaCacheMessage = getSchemaCacheMessage(error.message);
    if (schemaCacheMessage) {
      return { status: "error", message: schemaCacheMessage };
    }

    return { status: "error", message: `Could not update news: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath(`/news/${postId}`);
  revalidatePath("/admin/news");
  return { status: "success", message: "News post updated." };
}

export async function deleteNewsPost(formData: FormData) {
  const manager = await requireNewsManager();
  const postId = String(formData.get("postId") ?? "");

  if (!manager.ok || !postId) {
    return;
  }

  await manager.supabase.from("forum_posts").delete().eq("id", postId);
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath(`/news/${postId}`);
  revalidatePath("/admin/news");
}
