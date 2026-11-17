import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { SocialLinks } from "@/components/shared/social-links";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function ConnectSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.connect" });

  return (
    <section aria-labelledby="connect-title" className="pt-8 pb-4">
      <Container>
        <div className="rounded-lg bg-foreground px-6 py-14 text-background sm:px-12 sm:py-20">
          <p className="font-mono text-xs tracking-[0.14em] text-background/60 uppercase">
            <span className="text-[#93b4f8]">06</span> — {t("label")}
          </p>
          <h2
            id="connect-title"
            className="mt-4 max-w-3xl text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-background/70">{t("description")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/contact" className={buttonVariants({ size: "lg" })}>
              {t("cta")}
              <ArrowRight aria-hidden="true" />
            </Link>
            <SocialLinks className="[&_a]:border-background/20 [&_a]:text-background/70 [&_a:hover]:border-background/50 [&_a:hover]:text-background" />
          </div>
        </div>
      </Container>
    </section>
  );
}
