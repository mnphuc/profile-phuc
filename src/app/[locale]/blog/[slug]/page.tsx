import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleLayout, MetaList } from "@/components/blog/article-layout";
import { PostCard } from "@/components/blog/post-card";
import { SetAlternatePaths } from "@/components/shared/alternate-paths";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { getPost, getPosts, getPostTranslations, getRelatedPosts } from "@/features/blog/blog.service";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { resolveSlugParams, type SlugParams } from "@/lib/i18n/params";
import { renderMdx } from "@/lib/mdx/render";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { formatDate } from "@/lib/utils/date";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getPosts(params.locale as Locale).map((post) => ({ slug: post.slug }));
}

function translationPaths(translationKey: string) {
  const slugs = getPostTranslations(translationKey);
  return Object.fromEntries(
    Object.entries(slugs).map(([locale, slug]) => [locale, `/blog/${slug}`]),
  ) as Partial<Record<Locale, string>>;
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { locale, slug } = await resolveSlugParams(params);
  const result = getPost(locale, slug);
  if (!result) return {};
  const { post } = result;

  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
    alternates: translationPaths(post.translationKey),
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt ?? post.date,
    tags: post.tags,
    image: post.cover,
  });
}

export default async function BlogPostPage({ params }: SlugParams) {
  const { locale, slug } = await resolveSlugParams(params);
  setRequestLocale(locale);
  const result = getPost(locale, slug);
  if (!result) notFound();

  const { post, body } = result;
  const [content, t, tNav, tLang] = await Promise.all([
    renderMdx(body),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "language" }),
  ]);
  const alternates = translationPaths(post.translationKey);
  const otherLocales = routing.locales.filter((l) => l !== locale && alternates[l]);
  const related = getRelatedPosts(post);

  return (
    <>
      <SetAlternatePaths
        paths={Object.fromEntries(routing.locales.map((l) => [l, alternates[l] ?? "/blog"]))}
      />
      <JsonLd
        data={[
          articleJsonLd({
            locale,
            path: `/blog/${slug}`,
            title: post.title,
            description: post.description,
            date: post.date,
            updatedAt: post.updatedAt,
            tags: post.tags,
            image: post.cover,
          }),
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "" },
            { name: tNav("blog"), path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <ArticleLayout
        back={{ href: "/blog", label: t("backTo", { page: tNav("blog") }) }}
        title={post.title}
        description={post.description}
        meta={
          <>
            <Link href={`/topics/${post.topicSlug}`} className="tracking-[0.1em] text-accent uppercase hover:underline">
              {post.category}
            </Link>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span aria-hidden="true">·</span>
            <span>{t("minRead", { minutes: post.readingTime })}</span>
          </>
        }
        aside={
          <MetaList
            items={[
              {
                label: t("category"),
                value: (
                  <Link href={`/topics/${post.topicSlug}`} className="hover:text-accent">
                    {post.category}
                  </Link>
                ),
              },
              ...(post.updatedAt && post.updatedAt !== post.date
                ? [{ label: t("updated"), value: formatDate(post.updatedAt, locale) }]
                : []),
              ...(post.tags.length
                ? [
                    {
                      label: t("tags"),
                      value: (
                        <ul className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <li key={tag}>
                              <Badge variant="outline">{tag}</Badge>
                            </li>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
              ...otherLocales.map((other) => ({
                label: tLang(other),
                value: (
                  <Link
                    href={alternates[other]!}
                    locale={other}
                    hrefLang={other}
                    lang={other}
                    className="text-accent hover:underline"
                  >
                    {t("availableIn", { language: tLang(other) })}
                  </Link>
                ),
              })),
            ]}
          />
        }
        footer={
          related.length ? (
            <section aria-labelledby="related" className="border-t border-border py-16 sm:py-20">
              <Container>
                <h2 id="related" className="text-2xl font-semibold tracking-tight">
                  {t("relatedArticles")}
                </h2>
                <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <PostCard post={item} />
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null
        }
      >
        {content}
      </ArticleLayout>
    </>
  );
}
