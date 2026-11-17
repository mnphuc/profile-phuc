import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-lg text-muted">{t("description")}</p>
      <Link href="/" className={buttonVariants({ className: "mt-10" })}>
        {t("cta")}
      </Link>
    </Container>
  );
}
