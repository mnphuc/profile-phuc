"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAlternatePaths } from "@/components/shared/alternate-paths";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

const DETAIL_ROUTE = /^\/(blog|projects|lab|topics)\/[^/]+$/;

/**
 * Trang chi tiết có slug riêng theo ngôn ngữ: dùng đường dẫn bản dịch do trang khai báo.
 * Khi chưa có thông tin (trước hydrate) hoặc chưa có bản dịch → về trang danh sách tương ứng,
 * tránh dẫn tới URL không tồn tại.
 */
function resolveTarget(pathname: string, target: Locale, alternates: ReturnType<typeof useAlternatePaths>) {
  const alternate = alternates?.[target];
  if (alternate) return alternate;
  const match = pathname.match(DETAIL_ROUTE);
  if (match) return match[1] === "topics" ? "/blog" : `/${match[1]}`;
  return pathname;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const alternates = useAlternatePaths();
  const t = useTranslations("language");

  return (
    <nav aria-label={t("label")} className={cn("flex items-center gap-1 font-mono text-xs", className)}>
      {routing.locales.map((target, index) => {
        const active = target === locale;
        return (
          <span key={target} className="flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden="true" className="text-border">
                /
              </span>
            ) : null}
            {active ? (
              <span aria-current="true" className="px-1 py-1 font-semibold text-foreground uppercase">
                {target}
              </span>
            ) : (
              <Link
                href={resolveTarget(pathname, target, alternates)}
                locale={target}
                hrefLang={target}
                lang={target}
                aria-label={t("switchTo", { language: t(target) })}
                className="px-1 py-1 text-muted uppercase transition-colors hover:text-foreground"
              >
                {target}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
