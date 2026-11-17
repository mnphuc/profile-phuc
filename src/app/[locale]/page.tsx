import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutPreview } from "@/components/home/about-preview";
import { ConnectSection } from "@/components/home/connect-section";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { JourneySection } from "@/components/home/journey-section";
import { LatestArticles } from "@/components/home/latest-articles";
import { NowSection } from "@/components/home/now-section";
import { JsonLd } from "@/components/shared/json-ld";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { personJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  return buildMetadata({
    locale,
    path: "",
    title: t("title"),
    absoluteTitle: true,
    description: t("description"),
    type: "profile",
  });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={[personJsonLd(locale), websiteJsonLd(locale)]} />
      <Hero locale={locale} />
      <AboutPreview locale={locale} />
      <NowSection locale={locale} />
      <FeaturedProjects locale={locale} />
      <LatestArticles locale={locale} />
      <JourneySection locale={locale} />
      <ConnectSection locale={locale} />
    </>
  );
}
