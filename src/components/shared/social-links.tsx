import { getActiveSocialLinks } from "@/config/social";
import { cn } from "@/lib/utils/cn";
import { socialIcons } from "./social-icons";

type SocialLinksProps = { variant?: "icons" | "list"; className?: string };

/** Chỉ hiển thị những liên kết đã được cấu hình trong src/config/social.ts. */
export function SocialLinks({ variant = "icons", className }: SocialLinksProps) {
  const links = getActiveSocialLinks();
  if (links.length === 0) return null;

  return (
    <ul className={cn(variant === "icons" ? "flex flex-wrap gap-2" : "flex flex-col gap-3", className)}>
      {links.map(({ key, label, href }) => {
        const Icon = socialIcons[key];
        const external = !href.startsWith("mailto:");
        return (
          <li key={key}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer me" } : {})}
              aria-label={variant === "icons" ? label : undefined}
              className={cn(
                "inline-flex items-center gap-3 text-muted transition-colors hover:text-foreground",
                variant === "icons" &&
                  "size-10 justify-center rounded-full border border-border hover:border-foreground/30",
              )}
            >
              <Icon className="size-[18px]" />
              {variant === "list" ? <span className="text-sm font-medium">{label}</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
