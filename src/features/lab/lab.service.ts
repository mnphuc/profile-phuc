import "server-only";

import type { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { findTranslations, loadCollection, type ContentEntry } from "@/lib/mdx/loader";
import { readingTime } from "@/lib/utils/reading-time";
import { labFrontmatterSchema } from "./lab.schema";

type LabFrontmatter = z.infer<typeof labFrontmatterSchema>;

export type LabEntry = LabFrontmatter & {
  slug: string;
  locale: Locale;
  readingTime: number;
};

function toLabEntry(entry: ContentEntry<LabFrontmatter>): LabEntry {
  return {
    ...entry.meta,
    slug: entry.slug,
    locale: entry.locale,
    readingTime: readingTime(entry.body),
  };
}

export function getLabEntries(locale: Locale): LabEntry[] {
  return loadCollection("lab", locale, labFrontmatterSchema).map(toLabEntry);
}

export function getLabEntry(locale: Locale, slug: string) {
  const entry = loadCollection("lab", locale, labFrontmatterSchema).find(
    (item) => item.slug === slug,
  );
  return entry ? { entry: toLabEntry(entry), body: entry.body } : null;
}

export function getLabTranslations(translationKey: string) {
  return findTranslations("lab", labFrontmatterSchema, translationKey);
}
