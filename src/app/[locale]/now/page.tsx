import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHeader } from "@/components/shared/page-header";
import { now } from "@/data/now";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { formatDate } from "@/lib/utils/date";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.now" });
  return buildMetadata({ locale, path: "/now", title: t("title"), description: t("description") });
}

export default async function NowPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const [t, tCommon, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "now" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav("home"), path: "" },
          { name: t("title"), path: "/now" },
        ])}
      />
      <PageHeader eyebrow={tCommon("lastUpdated", { date: formatDate(now.updatedAt, locale) })} title={t("title")} lead={t("lead")} />
      <Container className="py-16 sm:py-20">
        <ol className="border-t border-border">
          {now.items.map((item, index) => (
            <li key={item.title.en} className="grid gap-3 border-b border-border py-8 md:grid-cols-[120px_1fr]">
              <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{item.title[locale]}</h2>
                <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted">{item.description[locale]}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted">
          <time dateTime={now.updatedAt}>{tCommon("lastUpdated", { date: formatDate(now.updatedAt, locale) })}</time>
          {" · "}
          <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
            {t("inspired")}
          </a>
        </p>
      </Container>
    </>
  );
}
