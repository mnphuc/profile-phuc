import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Cover } from "@/components/shared/cover";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/features/projects/projects.types";
import { Link } from "@/i18n/navigation";

export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations();

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:border-foreground/25 sm:p-5">
      <Cover src={project.cover} alt="" label={project.title} />
      <div className="mt-5 flex items-center justify-between gap-3">
        <Badge variant={project.status === "active" ? "accent" : "default"}>
          {t(`status.${project.status}`)}
        </Badge>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
        />
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 leading-relaxed text-muted">{project.description}</p>
      <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex gap-3">
          <dt className="w-20 shrink-0 font-mono text-xs tracking-[0.08em] text-muted uppercase">
            {t("common.role")}
          </dt>
          <dd>{project.role}</dd>
        </div>
        {project.stack.length ? (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-mono text-xs tracking-[0.08em] text-muted uppercase">
              {t("common.stack")}
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 5).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
