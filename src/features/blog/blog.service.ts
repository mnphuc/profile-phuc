import "server-only";

import type { Locale } from "@/i18n/routing";
import { findTranslations, loadCollection, type ContentEntry } from "@/lib/mdx/loader";
import { readingTime } from "@/lib/utils/reading-time";
import { slugify } from "@/lib/utils/slugify";
import { blogFrontmatterSchema } from "./blog.schema";
import type { BlogFrontmatter, BlogPost, Topic } from "./blog.types";

function toPost(entry: ContentEntry<BlogFrontmatter>): BlogPost {
  return {
    ...entry.meta,
    slug: entry.slug,
    locale: entry.locale,
    topicSlug: slugify(entry.meta.category),
    readingTime: readingTime(entry.body),
  };
}

export function getPosts(locale: Locale): BlogPost[] {
  return loadCollection("blog", locale, blogFrontmatterSchema).map(toPost);
}

export function getLatestPosts(locale: Locale, limit = 3) {
  return getPosts(locale).slice(0, limit);
}

export function getPost(locale: Locale, slug: string) {
  const entry = loadCollection("blog", locale, blogFrontmatterSchema).find(
    (item) => item.slug === slug,
  );
  return entry ? { post: toPost(entry), body: entry.body } : null;
}

export function getPostTranslations(translationKey: string) {
  return findTranslations("blog", blogFrontmatterSchema, translationKey);
}

export function getTopics(locale: Locale): Topic[] {
  const topics = new Map<string, Topic>();
  for (const post of getPosts(locale)) {
    const topic = topics.get(post.topicSlug);
    if (topic) topic.count += 1;
    else topics.set(post.topicSlug, { slug: post.topicSlug, name: post.category, count: 1 });
  }
  return [...topics.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getPostsByTopic(locale: Locale, topicSlug: string) {
  return getPosts(locale).filter((post) => post.topicSlug === topicSlug);
}

/** Bài liên quan: ưu tiên cùng chuyên mục, sau đó theo số tag trùng nhau. */
export function getRelatedPosts(current: BlogPost, limit = 3) {
  return getPosts(current.locale)
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score:
        (post.topicSlug === current.topicSlug ? 3 : 0) +
        post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map(({ post }) => post);
}
