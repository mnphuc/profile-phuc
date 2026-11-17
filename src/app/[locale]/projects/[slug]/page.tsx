import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleLayout, MetaList } from "@/components/blog/article-layout";
import { SetAlternatePaths } from "@/components/shared/alternate-paths";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { getProject, getProjects, getProjectTranslations } from "@/features/projects/projects.service";
import { routing, type Locale } from "@/i18n/routing";
import { resolveSlugParams, type SlugParams } from "@/lib/i18n/params";
import { renderMdx } from "@/lib/mdx/render";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getProjects(params.locale as Locale).map((project) => ({ slug: project.slug }));
}

function translationPaths(translationKey: string) {
  const slugs = getProjectTranslations(translationKey);
  return Object.fromEntries(
    Object.entries(slugs).map(([locale, slug]) => [locale, `/projects/${slug}`]),
  ) as Partial<Record<Locale, string>>;
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { locale, slug } = await resolveSlugParams(params);
  const result = getProject(locale, slug);
  if (!result) return {};
  const { project } = result;
  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.title,
    description: project.description,
    alternates: translationPaths(project.translationKey),
    image: project.cover,
  });
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-accent hover:underline"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
  );
}

export default async function ProjectPage({ params }: SlugParams) {
  const { locale, slug } = await resolveSlugParams(params);
  setRequestLocale(locale);
  const result = getProject(locale, slug);
  if (!result) notFound();

  const { project, body } = result;
  const [content, t, tCommon, tStatus, tNav] = await Promise.all([
    renderMdx(body),
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "status" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const alternates = translationPaths(project.translationKey);
  const { website, repository } = project.links;

  return (
    <>
      <SetAlternatePaths
        paths={Object.fromEntries(routing.locales.map((l) => [l, alternates[l] ?? "/projects"]))}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav("home"), path: "" },
          { name: tNav("projects"), path: "/projects" },
          { name: project.title, path: `/projects/${slug}` },
        ])}
      />
      <ArticleLayout
        back={{ href: "/projects", label: tCommon("backTo", { page: tNav("projects") }) }}
        title={project.title}
        description={project.description}
        meta={
          <Badge variant={project.status === "active" ? "accent" : "default"} className="font-sans">
            {tStatus(project.status)}
          </Badge>
        }
        aside={
          <MetaList
            items={[
              { label: tCommon("role"), value: project.role },
              ...(project.stack.length
                ? [
                    {
                      label: tCommon("stack"),
                      value: (
                        <ul className="flex flex-wrap gap-1.5">
                          {project.stack.map((item) => (
                            <li key={item}>
                              <Badge variant="outline">{item}</Badge>
                            </li>
                          ))}
                        </ul>
                      ),
                    },
                  ]
                : []),
              { label: tCommon("status"), value: tStatus(project.status) },
              ...(website || repository
                ? [
                    {
                      label: t("links"),
                      value: (
                        <div className="flex flex-col gap-1.5">
                          {website ? <ExternalLink href={website}>{t("website")}</ExternalLink> : null}
                          {repository ? <ExternalLink href={repository}>{t("repository")}</ExternalLink> : null}
                        </div>
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
