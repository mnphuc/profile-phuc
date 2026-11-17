import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostRow } from "@/components/blog/post-card";
import { TopicNav } from "@/components/blog/topic-nav";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { getPosts, getTopics } from "@/features/blog/blog.service";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.blog" });
  return buildMetadata({ locale, path: "/blog", title: t("title"), description: t("description") });
}

export default async function BlogPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const posts = getPosts(locale);

  return (
    <>
      <PageHeader eyebrow="Blog" title={t("title")} lead={t("lead")}>
        <TopicNav topics={getTopics(locale)} />
      </PageHeader>
      <Container className="py-6 sm:py-10">
        {posts.length ? (
          <div>
            {posts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-muted">{tCommon("empty")}</p>
        )}
      </Container>
    </>
  );
}
