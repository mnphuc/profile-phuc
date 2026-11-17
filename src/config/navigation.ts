export type NavKey = "about" | "blog" | "projects" | "lab" | "now" | "contact";

export const mainNav: { key: NavKey; href: `/${string}` }[] = [
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "projects", href: "/projects" },
  { key: "lab", href: "/lab" },
  { key: "now", href: "/now" },
  { key: "contact", href: "/contact" },
];

export const footerNav: { key: NavKey; href: `/${string}` }[] = [
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "projects", href: "/projects" },
  { key: "contact", href: "/contact" },
];
