"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { mainNav } from "@/config/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { LanguageSwitcher } from "./language-switcher";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const panelId = useId();

  // Đóng menu mobile khi chuyển trang.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <nav aria-label={t("mainNavigation")} className="hidden items-center gap-8 md:flex">
        <ul className="flex items-center gap-1">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm transition-colors",
                    active ? "font-medium text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
        <LanguageSwitcher />
      </nav>

      {/* Mobile */}
      <div className="flex items-center gap-3 md:hidden">
        <LanguageSwitcher />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground"
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-background md:hidden"
      >
        <nav aria-label={t("mainNavigation")} className="px-4 pt-6 pb-10">
          <ul className="flex flex-col">
            <li>
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className="flex border-b border-border py-4 text-2xl font-semibold tracking-tight"
              >
                {t("home")}
              </Link>
            </li>
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex border-b border-border py-4 text-2xl font-semibold tracking-tight",
                      active ? "text-accent" : "text-foreground",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
