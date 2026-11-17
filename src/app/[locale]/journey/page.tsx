import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHeader } from "@/components/shared/page-header";
import { ArrowLink } from "@/components/shared/section-heading";
import { Timeline } from "@/components/shared/timeline";
import { journey } from "@/data/journey";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.journey" });
  return buildMetadata({ locale, path: "/journey", title: t("title"), description: t("description") });
}

export default async function JourneyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "journey" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav("home"), path: "" },
          { name: t("title"), path: "/journey" },
        ])}
      />
      <PageHeader eyebrow={tNav("journey")} title={t("title")} lead={t("lead")} />
      <Container className="py-16 sm:py-20">
        <Timeline items={journey} locale={locale} detailed />
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">{t("note")}</p>
        <div className="mt-12 flex flex-wrap gap-8">
          <ArrowLink href="/projects">{tNav("projects")}</ArrowLink>
          <ArrowLink href="/now">{tNav("now")}</ArrowLink>
        </div>
      </Container>
    </>
  );
}
