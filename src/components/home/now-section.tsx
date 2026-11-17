import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { now } from "@/data/now";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/utils/date";

export async function NowSection({ locale }: { locale: Locale }) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "home.now" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  return (
    <section aria-labelledby="now-title" className="border-t border-border bg-secondary py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="now-title"
          index="02"
          label={t("label")}
          title={t("title")}
          action={{ href: "/now", label: t("cta") }}
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {now.items.map((item, index) => (
            <li key={item.title.en} className="flex flex-col bg-background p-6">
              <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{item.title[locale]}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{item.description[locale]}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 font-mono text-xs text-muted">
          {tCommon("lastUpdated", { date: formatDate(now.updatedAt, locale) })}
        </p>
      </Container>
    </section>
  );
}
