import type { Locale } from "@/i18n/routing";

const intlLocale: Record<Locale, string> = { vi: "vi-VN", en: "en-US" };

/** Ngày trong nội dung được lưu dạng "YYYY-MM-DD" và hiển thị theo UTC để tránh lệch múi giờ. */
export function toDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(toDate(value));
}

export function formatShortDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(toDate(value));
}
