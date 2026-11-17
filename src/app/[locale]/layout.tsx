import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AlternatePathsProvider } from "@/components/shared/alternate-paths";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** Chỉ gửi xuống client những namespace mà Client Components cần. */
const CLIENT_NAMESPACES = ["nav", "language", "contact"] as const;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s – ${siteConfig.name}` },
    description: t("description"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    formatDetection: { email: false, address: false, telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [messages, t] = await Promise.all([getMessages(), getTranslations({ locale, namespace: "nav" })]);
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} className={`${inter.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-foreground px-4 py-2 text-sm text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <AlternatePathsProvider>
            <Header locale={locale} />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </AlternatePathsProvider>
        </NextIntlClientProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
