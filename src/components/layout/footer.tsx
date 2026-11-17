import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { SocialLinks } from "@/components/shared/social-links";
import { footerNav } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";

export async function Footer({ locale }: { locale: Locale }) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Phúc<span className="text-accent">.</span>
          </Link>
          <p className="mt-2 text-sm text-muted">{t("tagline")}</p>
          <SocialLinks className="mt-6" />
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {footerNav.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-foreground">
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitcher />
        </div>
      </Container>
      <Container className="border-t border-border py-6">
        <p className="text-xs text-muted">{t("copyright", { year })}</p>
      </Container>
    </footer>
  );
}
