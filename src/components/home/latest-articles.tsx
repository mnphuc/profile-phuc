import { getTranslations } from "next-intl/server";
import { PostCard } from "@/components/blog/post-card";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { getLatestPosts } from "@/features/blog/blog.service";
import type { Locale } from "@/i18n/routing";

export async function LatestArticles({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.articles" });
  const posts = getLatestPosts(locale, 3);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="articles-title" className="border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="articles-title"
          index="04"
          label={t("label")}
          title={t("title")}
          description={t("description")}
          action={{ href: "/blog", label: t("cta") }}
        />
        <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
