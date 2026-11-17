import { cn } from "@/lib/utils/cn";
import { Container } from "./container";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, lead, children, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b border-border", className)}>
      <Container className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        {eyebrow ? (
          <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{lead}</p>
        ) : null}
        {children}
      </Container>
    </header>
  );
}
