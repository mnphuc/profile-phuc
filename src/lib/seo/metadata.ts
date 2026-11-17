import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";

const ogLocale: Record<Locale, string> = { vi: "vi_VN", en: "en_US" };

type BuildMetadataInput = {
  locale: Locale;
  /** Đường dẫn không gồm tiền tố ngôn ngữ, ví dụ "/blog". Trang chủ: "". */
  path: string;
  title?: string;
  /** true: dùng nguyên `title`, không ghép template "… – Phúc" (dùng cho trang chủ). */
  absoluteTitle?: boolean;
  description: string;
  /**
   * Đường dẫn tương ứng ở từng ngôn ngữ (không gồm tiền tố). Mặc định: cùng `path` cho mọi ngôn ngữ.
   * Với nội dung chỉ có ở một ngôn ngữ, chỉ truyền ngôn ngữ đó để không khai báo hreflang sai.
   */
  alternates?: Partial<Record<Locale, string>>;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  image?: string;
};

export function localizedUrl(locale: Locale, path: string) {
  return absoluteUrl(`/${locale}${path === "/" ? "" : path}`);
}

export function buildMetadata({
  locale,
  path,
  title,
  absoluteTitle = false,
  description,
  alternates,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  image,
}: BuildMetadataInput): Metadata {
  const paths =
    alternates ?? Object.fromEntries(routing.locales.map((l) => [l, path]));
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const p = paths[l];
    if (p !== undefined) languages[l] = localizedUrl(l, p);
  }
  const defaultPath = paths[routing.defaultLocale];
  if (defaultPath !== undefined) languages["x-default"] = localizedUrl(routing.defaultLocale, defaultPath);

  const url = localizedUrl(locale, path);
  const socialTitle = !title ? siteConfig.title : absoluteTitle ? title : `${title} – ${siteConfig.name}`;
  // Trang con khai báo openGraph riêng nên không kế thừa opengraph-image của [locale] → gắn ảnh mặc định.
  const images = [
    image
      ? { url: image }
      : { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: siteConfig.title },
  ];

  return {
    title: title && absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type,
      url,
      title: socialTitle,
      description,
      siteName: siteConfig.name,
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale && paths[l] !== undefined).map((l) => ogLocale[l]),
      ...(type === "article" ? { publishedTime, modifiedTime, tags, authors: [siteConfig.author.name] } : {}),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}
