import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

export type LocaleParams = { params: Promise<{ locale: string }> };
export type SlugParams = { params: Promise<{ locale: string; slug: string }> };

/** Lấy và kiểm tra locale từ params; locale không hỗ trợ → 404. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

export async function resolveSlugParams(params: Promise<{ locale: string; slug: string }>) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { locale: locale as Locale, slug };
}
