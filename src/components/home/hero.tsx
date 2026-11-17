import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { Portrait } from "@/components/shared/portrait";
import { buttonVariants } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return (
    <section aria-labelledby="hero-title" className="border-b border-border">
      <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20 lg:py-28">
        <div>
          <p className="font-mono text-xs leading-relaxed tracking-[0.14em] text-muted uppercase">
            {t("eyebrow")}
          </p>
          <h1
            id="hero-title"
            className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-foreground sm:text-2xl">
            {t("message")}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {t("description")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/projects" className={buttonVariants({ size: "lg" })}>
              {t("ctaProjects")}
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/blog" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              {t("ctaBlog")}
            </Link>
          </div>
          <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/50 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {profile.currentRole[locale]}
          </p>
        </div>
        <Portrait alt={profile.name[locale]} priority className="mx-auto max-w-sm lg:max-w-none" />
      </Container>
    </section>
  );
}
