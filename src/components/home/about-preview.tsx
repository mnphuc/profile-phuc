import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { ArrowLink } from "@/components/shared/section-heading";
import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/routing";

export async function AboutPreview({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.about" });

  return (
    <section aria-labelledby="about-title" className="py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
            <span className="text-accent">01</span> — {t("label")}
          </p>
          <h2
            id="about-title"
            className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-foreground/80">
          {profile.about[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ArrowLink href="/about" className="pt-3 text-base">
            {t("cta")}
          </ArrowLink>
        </div>
      </Container>
    </section>
  );
}
