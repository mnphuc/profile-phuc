import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleLayout, MetaList } from "@/components/blog/article-layout";
import { SetAlternatePaths } from "@/components/shared/alternate-paths";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { getLabEntries, getLabEntry, getLabTranslations } from "@/features/lab/lab.service";
import { routing, type Locale } from "@/i18n/routing";
import { resolveSlugParams, type SlugParams } from "@/lib/i18n/params";
import { renderMdx } from "@/lib/mdx/render";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { formatDate } from "@/lib/utils/date";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getLabEntries(params.locale as Locale).map((entry) => ({ slug: entry.slug }));
}

function translationPaths(translationKey: string) {
  const slugs = getLabTranslations(translationKey);
  return Object.fromEntries(
    Object.entries(slugs).map(([locale, slug]) => [locale, `/lab/${slug}`]),
  ) as Partial<Record<Locale, string>>;
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { locale, slug } = await resolveSlugParams(params);
  const result = getLabEntry(locale, slug);
  if (!result) return {};
  const { entry } = result;
  return buildMetadata({
    locale,
    path: `/lab/${slug}`,
    title: entry.title,
    description: entry.description,
    alternates: translationPaths(entry.translationKey),
    type: "article",
    publishedTime: entry.date,
    modifiedTime: entry.updatedAt ?? entry.date,
    tags: entry.tags,
  });
}

export default async function LabEntryPage({ params }: SlugParams) {
  const { locale, slug } = await resolveSlugParams(params);
  setRequestLocale(locale);
  const result = getLabEntry(locale, slug);
  if (!result) notFound();

  const { entry, body } = result;
  const [content, tCommon, tStatus, tNav] = await Promise.all([
    renderMdx(body),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "status" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const alternates = translationPaths(entry.translationKey);

  return (
    <>
      <SetAlternatePaths
        paths={Object.fromEntries(routing.locales.map((l) => [l, alternates[l] ?? "/lab"]))}
      />
      <JsonLd
        data={[
          articleJsonLd({
            locale,
            path: `/lab/${slug}`,
            title: entry.title,
            description: entry.description,
            date: entry.date,
            updatedAt: entry.updatedAt,
            tags: entry.tags,
          }),
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "" },
            { name: tNav("lab"), path: "/lab" },
            { name: entry.title, path: `/lab/${slug}` },
          ]),
        ]}
      />
      <ArticleLayout
        back={{ href: "/lab", label: tCommon("backTo", { page: tNav("lab") }) }}
        title={entry.title}
        description={entry.description}
        meta={
          <>
            <span className="tracking-[0.1em] text-accent uppercase">Lab</span>
            <span aria-hidden="true">·</span>
            <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
            <span aria-hidden="true">·</span>
            <span>{tCommon("minRead", { minutes: entry.readingTime })}</span>
          </>
        }
        aside={
          <MetaList
            items={[
              { label: tCommon("status"), value: tStatus(entry.status) },
              ...(entry.tags.length
                ? [
                    {
                      label: tCommon("tags"),
                      value: (
                        <ul className="flex flex-wrap gap-1.5">
                          {entry.tags.map((tag) => (
                            <li key={tag}>
                              <Badge variant="outline">{tag}</Badge>
                            </li>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        }
      >
        {content}
      </ArticleLayout>
    </>
  );
}
