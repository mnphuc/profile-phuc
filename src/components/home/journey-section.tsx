import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Timeline } from "@/components/shared/timeline";
import { journey } from "@/data/journey";
import type { Locale } from "@/i18n/routing";

export async function JourneySection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.journey" });

  return (
    <section aria-labelledby="journey-title" className="border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="journey-title"
          index="05"
          label={t("label")}
          title={t("title")}
          action={{ href: "/journey", label: t("cta") }}
        />
        <div className="mt-12">
          <Timeline items={journey} locale={locale} />
        </div>
      </Container>
    </section>
  );
}
