import { cache } from "react";

import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type ForumCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type ForumProfile = {
  id: string;
  display_name: string;
  username: string | null;
  role: "member" | "moderator" | "admin";
};

export type ForumPost = {
  id: string;
  category_id: string;
  author_id: string | null;
  guest_name?: string | null;
  parent_id: string | null;
  title: string | null;
  title_en?: string | null;
  body: string;
  body_en?: string | null;
  image_url?: string | null;
  body_font?: "sans" | "serif" | null;
  body_weight?: "light" | "regular" | "medium" | "bold" | null;
  body_size?: "compact" | "normal" | "large" | null;
  body_align?: "left" | "center" | null;
  status: "published" | "hidden" | "deleted";
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: ForumProfile | null;
  category?: ForumCategory | null;
};

export type ForumReactionSummary = {
  emoji: string;
  count: number;
  reacted: boolean;
};

export type AdminNotification = {
  id: string;
  body: string;
  created_at: string;
  authorLabel: string;
  threadId: string;
  threadTitle: string;
  href: string;
  unread: boolean;
};

export const FORUM_REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "😮", "👏"] as const;

const fallbackAuthor: ForumProfile = {
  id: "community",
  display_name: "ZTL Community",
  username: "community",
  role: "moderator",
};

export const fallbackForumCategories: ForumCategory[] = [
  {
    id: "ogloszenia",
    slug: "ogloszenia",
    name: "Ogłoszenia",
    description: "Aktualności organizacyjne i informacje dla społeczności.",
    sort_order: 10,
  },
  {
    id: "wydarzenia",
    slug: "wydarzenia",
    name: "Wydarzenia",
    description: "Rozmowy o koncertach, warsztatach i występach.",
    sort_order: 20,
  },
  {
    id: "stroje-i-tradycje",
    slug: "stroje-i-tradycje",
    name: "Stroje i tradycje",
    description: "Pytania o regiony, stroje, pieśni i repertuar.",
    sort_order: 30,
  },
];

export const fallbackForumPosts: ForumPost[] = [
  {
    id: "powitanie",
    category_id: "ogloszenia",
    author_id: fallbackAuthor.id,
    parent_id: null,
    title: "Witamy na forum ZTL Poznań AWF",
    title_en: "Welcome to the ZTL Poznań AWF forum",
    body: "To miejsce na pytania, zapowiedzi wydarzeń, rozmowy o repertuarze i dzielenie się wspomnieniami ze sceny.",
    body_en: "This is a place for questions, event announcements, repertoire conversations, and sharing memories from the stage.",
    status: "published",
    is_pinned: true,
    created_at: "2026-04-27T10:00:00+02:00",
    updated_at: "2026-04-27T10:00:00+02:00",
    author: fallbackAuthor,
    category: fallbackForumCategories[0],
  },
  {
    id: "warsztaty-pytania",
    category_id: "wydarzenia",
    author_id: fallbackAuthor.id,
    parent_id: null,
    title: "Jak przygotować się do warsztatów tanecznych?",
    title_en: "How should I prepare for dance workshops?",
    body: "Najważniejsze są wygodne buty, punktualność i gotowość do pracy z rytmem. Szczegóły publikujemy przy każdym wydarzeniu.",
    body_en: "Comfortable shoes, punctuality, and readiness to work with rhythm matter most. Details are published with each event.",
    status: "published",
    is_pinned: false,
    created_at: "2026-04-27T11:00:00+02:00",
    updated_at: "2026-04-27T11:00:00+02:00",
    author: fallbackAuthor,
    category: fallbackForumCategories[1],
  },
  {
    id: "warsztaty-pytania-reply",
    category_id: "wydarzenia",
    author_id: fallbackAuthor.id,
    parent_id: "warsztaty-pytania",
    title: null,
    body: "Dla początkujących wystarczy strój sportowy i obuwie na zmianę. Nie trzeba mieć wcześniejszego doświadczenia.",
    body_en: "For beginners, sportswear and a change of shoes are enough. No previous experience is required.",
    status: "published",
    is_pinned: false,
    created_at: "2026-04-27T12:00:00+02:00",
    updated_at: "2026-04-27T12:00:00+02:00",
    author: fallbackAuthor,
    category: fallbackForumCategories[1],
  },
];

export const getForumCategories = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackForumCategories;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("forum_categories")
    .select("id, slug, name, description, sort_order")
    .order("sort_order");

  if (error || !data?.length) {
    return fallbackForumCategories;
  }

  return data as ForumCategory[];
});

export async function getForumCategory(slug: string) {
  const categories = await getForumCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export const getForumThreads = cache(async (categorySlug?: string) => {
  const categories = await getForumCategories();
  const category = categorySlug
    ? categories.find((item) => item.slug === categorySlug)
    : null;

  if (!hasSupabaseEnv()) {
    return fallbackForumPosts.filter(
      (post) => !post.parent_id && (!category || post.category_id === category.id),
    );
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("forum_posts")
    .select("*, author:profiles(id, display_name, username, role)")
    .is("parent_id", null)
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category_id", category.id);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data as ForumPost[];
});

export const getFeaturedForumPosts = cache(async () => {
  if (!hasSupabaseEnv()) {
    return fallbackForumPosts
      .filter((post) => !post.parent_id && post.status === "published" && post.is_pinned)
      .slice(0, 3);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("forum_posts")
    .select(
      "*, author:profiles(id, display_name, username, role), category:forum_categories(id, slug, name, description, sort_order)",
    )
    .is("parent_id", null)
    .eq("status", "published")
    .eq("is_pinned", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data) {
    return [];
  }

  return data as ForumPost[];
});

export async function getForumThread(postId: string) {
  if (!hasSupabaseEnv()) {
    const thread = fallbackForumPosts.find((post) => post.id === postId) ?? null;
    const replies = fallbackForumPosts.filter((post) => post.parent_id === postId);
    return { thread, replies };
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: thread }, { data: replies }] = await Promise.all([
    supabase
      .from("forum_posts")
      .select("*, author:profiles(id, display_name, username, role)")
      .eq("id", postId)
      .single(),
    supabase
      .from("forum_posts")
      .select("*, author:profiles(id, display_name, username, role)")
      .eq("parent_id", postId)
      .eq("status", "published")
      .order("created_at", { ascending: true }),
  ]);

  return {
    thread: (thread as ForumPost | null) ?? null,
    replies: (replies as ForumPost[] | null) ?? [],
  };
}

export async function getCurrentProfile() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, username, role")
    .eq("id", userData.user.id)
    .single();

  return data as ForumProfile | null;
}

export function getPostAuthorName(post: ForumPost, fallback = "Użytkownik") {
  return post.guest_name?.trim() || post.author?.display_name || fallback;
}

export async function getAdminCommentNotifications(seenAt?: string | null) {
  const empty: AdminNotification[] = [];

  if (!hasSupabaseEnv()) {
    return empty;
  }

  const supabase = await createSupabaseServerClient();
  const { data: replies, error } = await supabase
    .from("forum_posts")
    .select("id, body, guest_name, created_at, parent_id, author:profiles(display_name)")
    .not("parent_id", "is", null)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !replies?.length) {
    return empty;
  }

  const parentIds = [...new Set(replies.map((row) => row.parent_id).filter(Boolean))] as string[];
  const { data: parents } = await supabase
    .from("forum_posts")
    .select("id, title, title_en")
    .in("id", parentIds);

  const parentMap = new Map((parents ?? []).map((parent) => [parent.id as string, parent]));
  const seenTime = seenAt ? Date.parse(seenAt) : 0;

  return replies.map((row) => {
    const author = Array.isArray(row.author) ? row.author[0] : row.author;
    const threadId = row.parent_id as string;
    const parent = parentMap.get(threadId);
    const threadTitle =
      (parent?.title as string | null | undefined) ||
      (parent?.title_en as string | null | undefined) ||
      "News";

    return {
      id: row.id as string,
      body: row.body as string,
      created_at: row.created_at as string,
      authorLabel:
        (row.guest_name as string | null)?.trim() ||
        (author?.display_name as string | undefined) ||
        "Guest",
      threadId,
      threadTitle,
      href: `/news/${threadId}`,
      unread: !seenTime || Date.parse(row.created_at as string) > seenTime,
    } satisfies AdminNotification;
  });
}

export async function getForumReactions(postIds: string[], reactorKey?: string | null) {
  const empty = new Map<string, ForumReactionSummary[]>();

  if (!postIds.length || !hasSupabaseEnv()) {
    return empty;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("forum_reactions")
    .select("post_id, emoji, reactor_key")
    .in("post_id", postIds);

  if (error || !data) {
    return empty;
  }

  const byPost = new Map<string, Map<string, { count: number; reacted: boolean }>>();

  for (const row of data) {
    const postMap = byPost.get(row.post_id) ?? new Map();
    const current = postMap.get(row.emoji) ?? { count: 0, reacted: false };
    current.count += 1;
    if (reactorKey && row.reactor_key === reactorKey) {
      current.reacted = true;
    }
    postMap.set(row.emoji, current);
    byPost.set(row.post_id, postMap);
  }

  for (const [postId, emojiMap] of byPost) {
    empty.set(
      postId,
      Array.from(emojiMap.entries()).map(([emoji, value]) => ({
        emoji,
        count: value.count,
        reacted: value.reacted,
      })),
    );
  }

  return empty;
}
