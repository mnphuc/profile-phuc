import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostRow } from "@/components/blog/post-card";
import { TopicNav } from "@/components/blog/topic-nav";
import { SetAlternatePaths } from "@/components/shared/alternate-paths";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHeader } from "@/components/shared/page-header";
import { getPostsByTopic, getTopics } from "@/features/blog/blog.service";
import { routing, type Locale } from "@/i18n/routing";
import { resolveSlugParams, type SlugParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getTopics(params.locale as Locale).map((topic) => ({ slug: topic.slug }));
}

function topicAlternates(slug: string) {
  return Object.fromEntries(
    routing.locales
      .filter((locale) => getTopics(locale).some((topic) => topic.slug === slug))
      .map((locale) => [locale, `/topics/${slug}`]),
  ) as Partial<Record<Locale, string>>;
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { locale, slug } = await resolveSlugParams(params);
  const topic = getTopics(locale).find((item) => item.slug === slug);
  if (!topic) return {};
  const t = await getTranslations({ locale, namespace: "metadata.topic" });
  return buildMetadata({
    locale,
    path: `/topics/${slug}`,
    title: t("title", { topic: topic.name }),
    description: t("description", { topic: topic.name }),
    alternates: topicAlternates(slug),
  });
}

export default async function TopicPage({ params }: SlugParams) {
  const { locale, slug } = await resolveSlugParams(params);
  setRequestLocale(locale);
  const topics = getTopics(locale);
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) notFound();

  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const posts = getPostsByTopic(locale, slug);
  const alternates = topicAlternates(slug);

  return (
    <>
      <SetAlternatePaths
        paths={Object.fromEntries(routing.locales.map((l) => [l, alternates[l] ?? "/blog"]))}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav("home"), path: "" },
          { name: tNav("blog"), path: "/blog" },
          { name: topic.name, path: `/topics/${slug}` },
        ])}
      />
      <PageHeader
        eyebrow={t("topics")}
        title={t("topicTitle", { topic: topic.name })}
        lead={t("topicLead", { count: posts.length })}
      >
        <TopicNav topics={topics} active={slug} />
      </PageHeader>
      <Container className="py-6 sm:py-10">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </Container>
    </>
  );
}
