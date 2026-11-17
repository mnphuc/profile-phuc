import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { PageHeader } from "@/components/shared/page-header";
import { Portrait } from "@/components/shared/portrait";
import { buttonVariants } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return buildMetadata({ locale, path: "/about", title: t("title"), description: t("description"), type: "profile" });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <JsonLd
        data={[
          personJsonLd(locale),
          breadcrumbJsonLd(locale, [
            { name: tNav("home"), path: "" },
            { name: t("title"), path: "/about" },
          ]),
        ]}
      />
      <PageHeader eyebrow={profile.roles.join(" · ")} title={t("lead")} />

      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20">
        <div>
          <Portrait alt={profile.name[locale]} className="max-w-sm lg:sticky lg:top-24" />
        </div>
        <div>
          <div className="max-w-[68ch] space-y-5 text-lg leading-relaxed text-foreground/80">
            {profile.about[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="mt-12 max-w-[68ch] border-l-2 border-foreground pl-6 text-xl leading-relaxed font-medium text-balance">
            {profile.message[locale]}
          </blockquote>

          <section aria-labelledby="interests" className="mt-16">
            <h2 id="interests" className="text-2xl font-semibold tracking-tight">
              {t("interestsTitle")}
            </h2>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {profile.interests.map((interest) => (
                <li key={interest.title.en} className="bg-background p-6">
                  <h3 className="font-semibold">{interest.title[locale]}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{interest.description[locale]}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="principles" className="mt-16">
            <h2 id="principles" className="text-2xl font-semibold tracking-tight">
              {t("principlesTitle")}
            </h2>
            <ol className="mt-6 border-t border-border">
              {profile.principles.map((principle, index) => (
                <li key={principle.en} className="flex gap-6 border-b border-border py-4 text-lg">
                  <span className="pt-1 font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <span>{principle[locale]}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-14 flex flex-wrap gap-3">
            <Link href="/journey" className={buttonVariants()}>
              {t("journeyCta")}
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: "secondary" })}>
              {t("contactCta")}
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
