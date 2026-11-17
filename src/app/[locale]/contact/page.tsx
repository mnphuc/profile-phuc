import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/shared/contact-form";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHeader } from "@/components/shared/page-header";
import { SocialLinks } from "@/components/shared/social-links";
import { getActiveSocialLinks } from "@/config/social";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.contact" });
  return buildMetadata({ locale, path: "/contact", title: t("title"), description: t("description") });
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const [t, tHome, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getTranslations({ locale, namespace: "home.connect" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const hasSocial = getActiveSocialLinks().length > 0;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav("home"), path: "" },
          { name: t("title"), path: "/contact" },
        ])}
      />
      <PageHeader eyebrow={t("title")} title={tHome("title")} lead={t("lead")} />
      <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
        <div className="relative max-w-2xl">
          <ContactForm />
        </div>
        {hasSocial ? (
          <aside className="lg:border-l lg:border-border lg:pl-10">
            <h2 className="font-mono text-xs tracking-[0.14em] text-muted uppercase">{t("elsewhere")}</h2>
            <SocialLinks variant="list" className="mt-5" />
          </aside>
        ) : null}
      </Container>
    </>
  );
}
