import type { MetadataRoute } from "next";
import { getPosts, getPostTranslations, getTopics } from "@/features/blog/blog.service";
import { getLabEntries, getLabTranslations } from "@/features/lab/lab.service";
import { getProjects, getProjectTranslations } from "@/features/projects/projects.service";
import { routing, type Locale } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo/metadata";

type Entry = MetadataRoute.Sitemap[number];

const STATIC_PATHS = ["", "/about", "/journey", "/now", "/blog", "/projects", "/lab", "/contact"];

function languages(paths: Partial<Record<Locale, string>>) {
  return Object.fromEntries(
    Object.entries(paths).map(([locale, path]) => [locale, localizedUrl(locale as Locale, path!)]),
  );
}

function withPrefix(slugs: Partial<Record<Locale, string>>, prefix: string) {
  return Object.fromEntries(
    Object.entries(slugs).map(([locale, slug]) => [locale, `${prefix}/${slug}`]),
  ) as Partial<Record<Locale, string>>;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [];

  for (const path of STATIC_PATHS) {
    const alternates = Object.fromEntries(routing.locales.map((l) => [l, path]));
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(locale, path),
        changeFrequency: path === "" || path === "/now" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: { languages: languages(alternates) },
      });
    }
  }

  for (const locale of routing.locales) {
    for (const post of getPosts(locale)) {
      entries.push({
        url: localizedUrl(locale, `/blog/${post.slug}`),
        lastModified: post.updatedAt ?? post.date,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: languages(withPrefix(getPostTranslations(post.translationKey), "/blog")) },
      });
    }

    for (const topic of getTopics(locale)) {
      entries.push({
        url: localizedUrl(locale, `/topics/${topic.slug}`),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    for (const project of getProjects(locale)) {
      entries.push({
        url: localizedUrl(locale, `/projects/${project.slug}`),
        lastModified: project.updatedAt ?? project.date,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: languages(withPrefix(getProjectTranslations(project.translationKey), "/projects")),
        },
      });
    }

    for (const entry of getLabEntries(locale)) {
      entries.push({
        url: localizedUrl(locale, `/lab/${entry.slug}`),
        lastModified: entry.updatedAt ?? entry.date,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languages(withPrefix(getLabTranslations(entry.translationKey), "/lab")) },
      });
    }
  }

  return entries;
}
