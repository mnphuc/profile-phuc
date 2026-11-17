import "server-only";

import type { Locale } from "@/i18n/routing";
import { findTranslations, loadCollection, type ContentEntry } from "@/lib/mdx/loader";
import { projectFrontmatterSchema } from "./projects.schema";
import type { Project, ProjectFrontmatter } from "./projects.types";

function toProject(entry: ContentEntry<ProjectFrontmatter>): Project {
  return { ...entry.meta, slug: entry.slug, locale: entry.locale };
}

export function getProjects(locale: Locale): Project[] {
  return loadCollection("projects", locale, projectFrontmatterSchema)
    .map(toProject)
    .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
}

export function getFeaturedProjects(locale: Locale, limit = 4) {
  return getProjects(locale)
    .filter((project) => project.featured)
    .slice(0, limit);
}

export function getProject(locale: Locale, slug: string) {
  const entry = loadCollection("projects", locale, projectFrontmatterSchema).find(
    (item) => item.slug === slug,
  );
  return entry ? { project: toProject(entry), body: entry.body } : null;
}

export function getProjectTranslations(translationKey: string) {
  return findTranslations("projects", projectFrontmatterSchema, translationKey);
}
