export const siteConfig = {
  name: "Phúc",
  title: "Phúc – Building things that matter",
  tagline: "Building things that matter.",
  description:
    "Personal website of Phuc. Exploring technology, building software products and sharing knowledge.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://phuc.nhanhieuso.vn").replace(/\/$/, ""),

  author: {
    name: "Phúc",
    role: "Technology Leader & Product Builder",
  },

  locales: ["vi", "en"],
  defaultLocale: "vi",
} as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
