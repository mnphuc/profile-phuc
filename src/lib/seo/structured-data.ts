import { absoluteUrl, siteConfig } from "@/config/site";
import { getActiveSocialLinks } from "@/config/social";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/routing";
import { localizedUrl } from "./metadata";

const PERSON_ID = `${siteConfig.url}/#person`;

export function personJsonLd(locale: Locale) {
  const sameAs = getActiveSocialLinks()
    .filter((link) => !link.href.startsWith("mailto:"))
    .map((link) => link.href);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name[locale],
    alternateName: profile.name[locale === "vi" ? "en" : "vi"],
    url: siteConfig.url,
    jobTitle: siteConfig.author.role,
    description: profile.message[locale],
    knowsAbout: profile.interests.map((interest) => interest.title.en),
    ...(profile.portrait ? { image: absoluteUrl(profile.portrait) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: localizedUrl(locale, ""),
    inLanguage: locale,
    author: { "@id": PERSON_ID },
  };
}

type ArticleInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  tags?: string[];
  image?: string;
};

export function articleJsonLd({ locale, path, title, description, date, updatedAt, tags, image }: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    inLanguage: locale,
    datePublished: date,
    dateModified: updatedAt ?? date,
    url: localizedUrl(locale, path),
    mainEntityOfPage: localizedUrl(locale, path),
    author: { "@type": "Person", "@id": PERSON_ID, name: profile.name[locale], url: siteConfig.url },
    ...(tags?.length ? { keywords: tags.join(", ") } : {}),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}
