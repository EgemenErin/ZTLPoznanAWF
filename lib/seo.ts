import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://www.ztlpoznanawf.pl";

function resolveSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isNonCanonicalHost = !raw || /localhost|127\.0\.0\.1|\.vercel\.app/i.test(raw);

  // Never leak a localhost or *.vercel.app URL into production canonicals, sitemaps or OG tags.
  // The public site lives on the custom domain, so that is always the canonical host.
  const url =
    process.env.NODE_ENV === "production" && isNonCanonicalHost
      ? DEFAULT_SITE_URL
      : raw || DEFAULT_SITE_URL;

  return url.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "ZTL Poznań AWF";
export const SITE_LEGAL_NAME =
  "Zespół Tańca Ludowego „Poznań” Akademii Wychowania Fizycznego w Poznaniu";
export const SITE_TITLE = "Zespół Tańca Ludowego Poznań AWF — polski zespół folklorystyczny";
export const SITE_DESCRIPTION =
  "ZTL Poznań AWF to zespół tańca ludowego i folklorystyczny z Poznania, działający od 1982 roku. Polskie tańce narodowe i regionalne, koncerty, warsztaty, występy w kraju i za granicą oraz Światowy Przegląd Folkloru „Integracje”.";

export const SITE_KEYWORDS = [
  "zespół tańca ludowego Poznań",
  "zespół folklorystyczny Poznań",
  "najlepszy zespół ludowy w Polsce",
  "polski zespół folklorystyczny",
  "zespół ludowy Poznań",
  "tańce narodowe",
  "polonez mazur oberek kujawiak krakowiak",
  "występy folklorystyczne",
  "koncerty folklorystyczne Poznań",
  "ZTL Poznań AWF",
  "AWF Poznań zespół tańca",
  "Integracje Światowy Przegląd Folkloru",
  "kapela ludowa",
  "stroje ludowe",
];

export const AWF_ZTL_URL =
  "https://awf.poznan.pl/uczelnia/administracja/prorektor-ds-wspolpracy-i-rozwoju/zespol-tanca-ludowego-awf-poznan/";
export const CIOFF_URL = "https://www.cioff.pl/";

export const SOCIAL_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Zespół Tańca Ludowego Poznań AWF — polski folklor na scenie",
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

/**
 * Builds consistent metadata (canonical, Open Graph, Twitter) for a page.
 * `title` is used as-is for social cards and run through the layout title template for <title>.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const images = image
    ? [{ url: absoluteUrl(image), alt: imageAlt ?? title }]
    : [
        {
          url: absoluteUrl(SOCIAL_IMAGE.url),
          width: SOCIAL_IMAGE.width,
          height: SOCIAL_IMAGE.height,
          alt: SOCIAL_IMAGE.alt,
        },
      ];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: "pl_PL",
      title,
      description,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((item) => item.url),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Collapses whitespace, strips simple markdown and truncates text for meta descriptions. */
export function toMetaDescription(text: string | null | undefined, fallback: string, max = 158) {
  const clean = (text ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) {
    return fallback;
  }

  if (clean.length <= max) {
    return clean;
  }

  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                    */
/* ------------------------------------------------------------------ */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["DanceGroup", "PerformingGroup", "Organization"],
    "@id": ORGANIZATION_ID,
    name: SITE_LEGAL_NAME,
    alternateName: [
      "ZTL Poznań AWF",
      "ZTL Poznań",
      "Zespół Tańca Ludowego Poznań",
      "Folk Dance Ensemble Poznań AWF",
    ],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo/ztllogo.png"),
      width: 827,
      height: 827,
    },
    image: absoluteUrl(SOCIAL_IMAGE.url),
    foundingDate: "1982",
    foundingLocation: { "@type": "Place", name: "Poznań, Polska" },
    email: "ztlpoznan@awf.poznan.pl",
    telephone: "+48618751423",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Św. Rocha 9",
      postalCode: "61-142",
      addressLocality: "Poznań",
      addressRegion: "Wielkopolskie",
      addressCountry: "PL",
    },
    areaServed: [
      { "@type": "City", name: "Poznań" },
      { "@type": "Country", name: "Polska" },
    ],
    knowsAbout: [
      "polski folklor",
      "tańce narodowe",
      "polonez",
      "mazur",
      "oberek",
      "kujawiak",
      "krakowiak",
      "tańce regionalne",
      "muzyka ludowa",
      "stroje ludowe",
    ],
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Akademia Wychowania Fizycznego im. Eugeniusza Piaseckiego w Poznaniu",
      url: "https://awf.poznan.pl/",
    },
    memberOf: { "@type": "Organization", name: "CIOFF", url: CIOFF_URL },
    employee: {
      "@type": "Person",
      name: "Dariusz Majchrowicz",
      jobTitle: "Kierownik ZTL, Dyrektor Artystyczny i Choreograf",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "ztlpoznan@awf.poznan.pl",
        telephone: "+48618751423",
        availableLanguage: ["pl", "en"],
        areaServed: "PL",
      },
      {
        "@type": "ContactPoint",
        contactType: "bookings",
        email: "kontakt@ztlpoznanawf.pl",
        availableLanguage: ["pl", "en"],
      },
    ],
    sameAs: [AWF_ZTL_URL, CIOFF_URL],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: SITE_LEGAL_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "pl-PL",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "pl-PL",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

type EventLdInput = {
  slug: string;
  name: string;
  description?: string | null;
  startsAt: string;
  endsAt?: string | null;
  venueName?: string | null;
  venueCity?: string | null;
  venueAddress?: string | null;
  imageUrl?: string | null;
  ticketUrl?: string | null;
  priceLabel?: string | null;
  cancelled?: boolean;
};

export function eventLd(input: EventLdInput) {
  const hasTicket = Boolean(input.ticketUrl && /^https?:\/\//i.test(input.ticketUrl));
  const placeName = input.venueName || input.venueCity || "Polska";

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${absoluteUrl(`/oferta/${input.slug}`)}#event`,
    name: input.name,
    description: input.description ?? undefined,
    url: absoluteUrl(`/oferta/${input.slug}`),
    startDate: input.startsAt,
    endDate: input.endsAt ?? undefined,
    eventStatus: input.cancelled
      ? "https://schema.org/EventCancelled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: placeName,
      address: {
        "@type": "PostalAddress",
        streetAddress: input.venueAddress ?? undefined,
        addressLocality: input.venueCity ?? undefined,
      },
    },
    image: input.imageUrl ? [absoluteUrl(input.imageUrl)] : [absoluteUrl(SOCIAL_IMAGE.url)],
    organizer: { "@id": ORGANIZATION_ID },
    performer: { "@id": ORGANIZATION_ID },
    ...(hasTicket
      ? {
          offers: {
            "@type": "Offer",
            url: input.ticketUrl,
            availability: "https://schema.org/InStock",
            ...(input.priceLabel ? { description: input.priceLabel } : {}),
          },
        }
      : {}),
  };
}

type ArticleLdInput = {
  id: string;
  headline: string;
  description?: string | null;
  datePublished: string;
  dateModified?: string | null;
  imageUrl?: string | null;
  path: string;
};

export function articleLd(input: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${absoluteUrl(input.path)}#article`,
    mainEntityOfPage: absoluteUrl(input.path),
    headline: input.headline.slice(0, 110),
    description: input.description ?? undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: "pl-PL",
    image: [input.imageUrl ? absoluteUrl(input.imageUrl) : absoluteUrl(SOCIAL_IMAGE.url)],
    author: { "@id": ORGANIZATION_ID },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_LEGAL_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo/ztllogo.png") },
    },
  };
}

export function contactPageLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: absoluteUrl("/kontakt"),
    name: "Kontakt — ZTL Poznań AWF",
    inLanguage: "pl-PL",
    mainEntity: { "@id": ORGANIZATION_ID },
  };
}
