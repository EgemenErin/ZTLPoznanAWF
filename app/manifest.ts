import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zespół Tańca Ludowego Poznań AWF",
    short_name: "ZTL Poznań AWF",
    description:
      "Polski zespół tańca ludowego i folklorystyczny z Poznania, działający od 1982 roku.",
    lang: "pl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f1e8",
    theme_color: "#5c1f25",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
