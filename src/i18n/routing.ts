import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
  // "/" luôn chuyển đến "/vi" theo đề án, không tự đoán theo Accept-Language.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
