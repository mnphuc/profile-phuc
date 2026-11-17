import type { z } from "zod";
import type { Locale } from "@/i18n/routing";
import type { blogFrontmatterSchema } from "./blog.schema";

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;

export type BlogPost = BlogFrontmatter & {
  slug: string;
  locale: Locale;
  topicSlug: string;
  readingTime: number;
};

export type Topic = { slug: string; name: string; count: number };
