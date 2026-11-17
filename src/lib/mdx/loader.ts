import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export type Collection = "blog" | "projects" | "lab";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ContentEntry<TMeta> = {
  slug: string;
  locale: Locale;
  meta: TMeta;
  body: string;
};

type BaseMeta = { published: boolean; date: string; locale: Locale; translationKey: string };

const cache = new Map<string, ContentEntry<unknown>[]>();

/**
 * Đọc toàn bộ file MDX của một collection theo ngôn ngữ, validate frontmatter bằng Zod.
 * Frontmatter sai sẽ làm build thất bại kèm tên file — tránh xuất bản nội dung lỗi.
 */
export function loadCollection<TSchema extends z.ZodType<BaseMeta>>(
  collection: Collection,
  locale: Locale,
  schema: TSchema,
  { includeUnpublished = false } = {},
): ContentEntry<z.infer<TSchema>>[] {
  const cacheKey = `${collection}:${locale}`;
  let entries = cache.get(cacheKey) as ContentEntry<z.infer<TSchema>>[] | undefined;

  if (!entries || process.env.NODE_ENV === "development") {
    const dir = path.join(CONTENT_ROOT, locale, collection);
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"))
      : [];

    entries = files.map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(dir, file);

      if (!SLUG_PATTERN.test(slug)) {
        throw new Error(`[content] Slug không hợp lệ "${slug}" (${filePath}). Dùng a-z, 0-9 và dấu "-".`);
      }

      const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
      const parsed = schema.safeParse(data);

      if (!parsed.success) {
        throw new Error(
          `[content] Frontmatter không hợp lệ trong ${filePath}:\n${parsed.error.issues
            .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
            .join("\n")}`,
        );
      }

      if (parsed.data.locale !== locale) {
        throw new Error(
          `[content] ${filePath} khai báo locale "${parsed.data.locale}" nhưng nằm trong thư mục "${locale}".`,
        );
      }

      return { slug, locale, meta: parsed.data, body: content };
    });

    entries.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
    cache.set(cacheKey, entries);
  }

  return includeUnpublished ? entries : entries.filter((entry) => entry.meta.published);
}

/** Map translationKey → slug theo từng ngôn ngữ, dùng cho language switcher và hreflang. */
export function findTranslations<TSchema extends z.ZodType<BaseMeta>>(
  collection: Collection,
  schema: TSchema,
  translationKey: string,
): Partial<Record<Locale, string>> {
  const result: Partial<Record<Locale, string>> = {};
  for (const locale of routing.locales) {
    const match = loadCollection(collection, locale, schema).find(
      (entry) => entry.meta.translationKey === translationKey,
    );
    if (match) result[locale] = match.slug;
  }
  return result;
}
