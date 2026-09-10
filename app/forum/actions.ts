"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { FORUM_REACTION_EMOJIS, getForumCategory } from "@/lib/forum";
import { createSupabaseAdminClient, hasSupabaseServiceEnv } from "@/lib/supabase/admin";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type ForumActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const GUEST_NAME_COOKIE = "ztl_guest_name";
const REACTOR_COOKIE = "ztl_reactor";

function isEnglish(formData: FormData) {
  return formData.get("locale") === "en";
}

function normalizeGuestName(raw: string) {
  return raw.trim().replace(/\s+/g, " ").slice(0, 40);
}

async function rememberGuestName(name: string) {
  const jar = await cookies();
  jar.set(GUEST_NAME_COOKIE, name, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getRememberedGuestName() {
  const jar = await cookies();
  return jar.get(GUEST_NAME_COOKIE)?.value ?? "";
}

async function getOrCreateReactorKey() {
  const jar = await cookies();
  const existing = jar.get(REACTOR_COOKIE)?.value;
  if (existing && existing.length >= 8) {
    return existing;
  }

  const key = randomUUID().replace(/-/g, "").slice(0, 32);
  jar.set(REACTOR_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return key;
}

export async function createThread(
  _prevState: ForumActionState,
  formData: FormData,
): Promise<ForumActionState> {
  const en = isEnglish(formData);
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const guestName = normalizeGuestName(String(formData.get("guestName") ?? ""));
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title || !body) {
    return { status: "error", message: en ? "Fill in the thread title and body." : "Uzupełnij tytuł i treść wątku." };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "success",
      message: en ? "The form is ready. Connect Supabase to save threads." : "Formularz działa. Podłącz Supabase, aby zapisywać wątki.",
    };
  }

  const [category, supabase] = await Promise.all([
    getForumCategory(categorySlug),
    createSupabaseServerClient(),
  ]);

  if (!category) {
    return { status: "error", message: en ? "Category was not found." : "Nie znaleziono kategorii." };
  }

  const { data: userData } = await supabase.auth.getUser();
  const authorId = userData.user?.id ?? null;

  if (!authorId && guestName.length < 2) {
    return {
      status: "error",
      message: en ? "Enter a username (at least 2 characters)." : "Podaj nazwę użytkownika (min. 2 znaki).",
    };
  }

  const { error } = await supabase.from("forum_posts").insert(
    authorId
      ? {
          category_id: category.id,
          author_id: authorId,
          title,
          body,
        }
      : {
          category_id: category.id,
          author_id: null,
          guest_name: guestName,
          title,
          body,
        },
  );

  if (error) {
    console.error("createThread error:", error);
    return { status: "error", message: en ? "Could not create the thread." : "Nie udało się dodać wątku." };
  }

  if (!authorId) {
    await rememberGuestName(guestName);
  }

  revalidatePath(`/forum/${categorySlug}`);
  return { status: "success", message: en ? "Thread was published." : "Wątek został opublikowany." };
}

export async function createAdminAnnouncement(
  _prevState: ForumActionState,
  formData: FormData,
): Promise<ForumActionState> {
  const en = isEnglish(formData);
  const categorySlug = String(formData.get("categorySlug") ?? "ogloszenia");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const isFeatured = formData.get("isFeatured") === "on";

  if (!title || !body) {
    return { status: "error", message: en ? "Fill in the post title and body." : "Uzupełnij tytuł i treść posta." };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "success",
      message: en ? "The panel is ready. Connect Supabase to publish admin posts." : "Panel jest gotowy. Podłącz Supabase, aby publikować posty administracyjne.",
    };
  }

  const [category, supabase] = await Promise.all([
    getForumCategory(categorySlug),
    createSupabaseServerClient(),
  ]);
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { status: "error", message: en ? "Log in as an administrator." : "Zaloguj się jako administrator." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return { status: "error", message: en ? "Only admins and moderators can publish featured posts." : "Tylko administratorzy i moderatorzy mogą publikować wyróżnione posty." };
  }

  if (!category) {
    return { status: "error", message: en ? "Category was not found." : "Nie znaleziono kategorii." };
  }

  const { error } = await supabase.from("forum_posts").insert({
    category_id: category.id,
    author_id: userData.user.id,
    title,
    body,
    is_pinned: isFeatured,
  });

  if (error) {
    return { status: "error", message: en ? "Could not publish the post." : "Nie udało się opublikować posta." };
  }

  revalidatePath("/");
  revalidatePath("/forum");
  revalidatePath(`/forum/${categorySlug}`);

  return {
    status: "success",
    message: isFeatured
      ? en ? "Post was published and will appear on the homepage." : "Post został opublikowany i pojawi się na stronie głównej."
      : en ? "Post was published on the forum." : "Post został opublikowany na forum.",
  };
}

export async function createReply(
  _prevState: ForumActionState,
  formData: FormData,
): Promise<ForumActionState> {
  const en = isEnglish(formData);
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const parentId = String(formData.get("parentId") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const guestName = normalizeGuestName(String(formData.get("guestName") ?? ""));
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { status: "error", message: en ? "Write a reply." : "Wpisz treść odpowiedzi." };
  }

  if (!hasSupabaseEnv()) {
    return {
      status: "success",
      message: en ? "The form is ready. Connect Supabase to save replies." : "Formularz działa. Podłącz Supabase, aby zapisywać odpowiedzi.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const authorId = userData.user?.id ?? null;

  if (!authorId && guestName.length < 2) {
    return {
      status: "error",
      message: en ? "Enter a username (at least 2 characters)." : "Podaj nazwę użytkownika (min. 2 znaki).",
    };
  }

  const { error } = await supabase.from("forum_posts").insert(
    authorId
      ? {
          category_id: categoryId,
          author_id: authorId,
          parent_id: parentId,
          body,
        }
      : {
          category_id: categoryId,
          author_id: null,
          guest_name: guestName,
          parent_id: parentId,
          body,
        },
  );

  if (error) {
    console.error("createReply error:", error);
    return { status: "error", message: en ? "Could not add the reply." : "Nie udało się dodać odpowiedzi." };
  }

  if (!authorId) {
    await rememberGuestName(guestName);
  }

  revalidatePath(`/forum/${categorySlug}/${parentId}`);
  revalidatePath(`/news/${parentId}`);
  return { status: "success", message: en ? "Reply was published." : "Odpowiedź została opublikowana." };
}

export async function toggleReaction(formData: FormData) {
  const postId = String(formData.get("postId") ?? "");
  const emoji = String(formData.get("emoji") ?? "");
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const threadId = String(formData.get("threadId") ?? postId);

  if (!hasSupabaseEnv() || !postId || !(FORUM_REACTION_EMOJIS as readonly string[]).includes(emoji)) {
    return;
  }

  if (!hasSupabaseServiceEnv()) {
    return;
  }

  const reactorKey = await getOrCreateReactorKey();
  const admin = createSupabaseAdminClient();

  const { data: existing } = await admin
    .from("forum_reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("emoji", emoji)
    .eq("reactor_key", reactorKey)
    .maybeSingle();

  if (existing?.id) {
    await admin.from("forum_reactions").delete().eq("id", existing.id);
  } else {
    await admin.from("forum_reactions").insert({
      post_id: postId,
      emoji,
      reactor_key: reactorKey,
    });
  }

  revalidatePath(`/forum/${categorySlug}/${threadId}`);
  revalidatePath(`/news/${threadId}`);
}

export async function moderatePost(formData: FormData) {
  const postId = String(formData.get("postId") ?? "");
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const action = String(formData.get("moderationAction") ?? "");

  if (!hasSupabaseEnv() || !postId) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    return;
  }

  if (action === "hide") {
    await supabase.from("forum_posts").update({ status: "hidden" }).eq("id", postId);
  }

  if (action === "pin") {
    await supabase.from("forum_posts").update({ is_pinned: true }).eq("id", postId);
  }

  if (action === "unpin") {
    await supabase.from("forum_posts").update({ is_pinned: false }).eq("id", postId);
  }

  revalidatePath(`/forum/${categorySlug}`);
  revalidatePath(`/forum/${categorySlug}/${postId}`);
}
