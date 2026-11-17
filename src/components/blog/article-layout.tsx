import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Link } from "@/i18n/navigation";

type ArticleLayoutProps = {
  back: { href: string; label: string };
  meta: React.ReactNode;
  title: string;
  description: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/** Bố cục chung cho Blog / Project / Lab detail: cột đọc ~68ch, thông tin phụ bên cạnh trên desktop. */
export function ArticleLayout({ back, meta, title, description, aside, children, footer }: ArticleLayoutProps) {
  return (
    <article>
      <header className="border-b border-border">
        <Container className="pt-10 pb-12 sm:pt-14 sm:pb-16">
          <Link
            href={back.href}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {back.label}
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            {meta}
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{description}</p>
        </Container>
      </header>

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
        <div className="prose min-w-0">{children}</div>
        {aside ? <aside>{aside}</aside> : null}
      </Container>

      {footer}
    </article>
  );
}

export function MetaList({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="grid gap-5 rounded-lg border border-border p-5 text-sm sm:grid-cols-2 lg:sticky lg:top-24 lg:grid-cols-1">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="font-mono text-xs tracking-[0.1em] text-muted uppercase">{item.label}</dt>
          <dd className="mt-1.5">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
