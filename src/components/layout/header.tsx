import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Navigation } from "./navigation";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    // Không dùng backdrop-filter: nó tạo containing block mới và làm lệch panel menu mobile (position: fixed).
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={t("home")}
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Phúc<span className="text-accent">.</span>
        </Link>
        <Navigation />
      </Container>
    </header>
  );
}
