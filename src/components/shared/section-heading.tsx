import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  index?: string;
  label: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  className?: string;
  id?: string;
};

export function SectionHeading({
  index,
  label,
  title,
  description,
  action,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
          {index ? <span className="text-accent">{index}</span> : null}
          {index ? <span aria-hidden="true"> — </span> : null}
          {label}
        </p>
        <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <ArrowLink href={action.href}>{action.label}</ArrowLink> : null}
    </div>
  );
}

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent",
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
