import type { ForumCategory, ForumPost } from "@/lib/forum";
import type { Locale } from "@/lib/i18n";

const categoryCopy = {
  ogloszenia: {
    en: {
      name: "Announcements",
      description: "Organizational updates and information for the community.",
    },
  },
  wydarzenia: {
    en: {
      name: "Events",
      description: "Conversations about concerts, workshops, and performances.",
    },
  },
  "stroje-i-tradycje": {
    en: {
      name: "Costumes and traditions",
      description: "Questions about regions, costumes, songs, and repertoire.",
    },
  },
} as const;

export function getCategoryName(category: ForumCategory | null | undefined, locale: Locale) {
  if (!category) {
    return locale === "en" ? "Forum" : "Forum";
  }

  return locale === "en"
    ? categoryCopy[category.slug as keyof typeof categoryCopy]?.en.name ?? category.name
    : category.name;
}

export function getCategoryDescription(category: ForumCategory, locale: Locale) {
  return locale === "en"
    ? categoryCopy[category.slug as keyof typeof categoryCopy]?.en.description ?? category.description
    : category.description;
}

export function getPostTitle(post: ForumPost, locale: Locale) {
  return locale === "en" ? post.title_en ?? post.title : post.title;
}

export function getPostBody(post: ForumPost, locale: Locale) {
  return locale === "en" ? post.body_en ?? post.body : post.body;
}

/** Plain-text snippet for cards/lists — strips markdown images so only `image_url` is used as preview media. */
export function getPostExcerpt(post: ForumPost, locale: Locale) {
  return getPostBody(post, locale)
    .split(/\r?\n/)
    .filter((line) => !/^!\[[^\]]*\]\(https:\/\/[^)]+\)$/.test(line.trim()))
    .join("\n")
    .replace(/!\[[^\]]*\]\(https:\/\/[^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/^-\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPostAuthorLabel(post: ForumPost, locale: Locale) {
  const fallback = locale === "en" ? "Guest" : "Gość";
  return post.guest_name?.trim() || post.author?.display_name || fallback;
}
