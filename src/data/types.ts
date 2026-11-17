import type { Locale } from "@/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;
