import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { getProjects } from "@/features/projects/projects.service";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.projects" });
  return buildMetadata({ locale, path: "/projects", title: t("title"), description: t("description") });
}

export default async function ProjectsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const projects = getProjects(locale);

  return (
    <>
      <PageHeader eyebrow="Projects" title={t("title")} lead={t("lead")} />
      <Container className="py-16 sm:py-20">
        {projects.length ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{tCommon("empty")}</p>
        )}
      </Container>
    </>
  );
}
