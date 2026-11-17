import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { getLabEntries } from "@/features/lab/lab.service";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.lab" });
  return buildMetadata({ locale, path: "/lab", title: t("title"), description: t("description") });
}

export default async function LabPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const [t, tCommon, tStatus] = await Promise.all([
    getTranslations({ locale, namespace: "lab" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "status" }),
  ]);
  const entries = getLabEntries(locale);

  return (
    <>
      <PageHeader eyebrow="Lab" title={t("title")} lead={t("lead")} />
      <Container className="py-16 sm:py-20">
        {entries.length ? (
          <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            {entries.map((entry) => (
              <li key={entry.slug} className="group relative flex flex-col bg-background p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3 font-mono text-xs text-muted">
                  <time dateTime={entry.date}>{formatDate(entry.date, locale)}</time>
                  <Badge variant={entry.status === "active" ? "accent" : "default"} className="font-sans">
                    {tStatus(entry.status)}
                  </Badge>
                </div>
                <h2 className="mt-6 text-xl font-semibold tracking-tight text-balance group-hover:text-accent">
                  <Link href={`/lab/${entry.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {entry.title}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{entry.description}</p>
                {entry.tags.length ? (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <li key={tag}>
                        <Badge variant="outline">{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}
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
