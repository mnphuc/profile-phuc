import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFeaturedProjects } from "@/features/projects/projects.service";
import type { Locale } from "@/i18n/routing";

export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.projects" });
  const projects = getFeaturedProjects(locale, 4);
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="projects-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="projects-title"
          index="03"
          label={t("label")}
          title={t("title")}
          description={t("description")}
          action={{ href: "/projects", label: t("cta") }}
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
