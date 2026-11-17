import type { JourneyItem } from "@/data/journey";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

export function Timeline({ items, locale, detailed = false }: { items: JourneyItem[]; locale: Locale; detailed?: boolean }) {
  return (
    <ol className="border-t border-border">
      {items.map((item) => (
        <li
          key={`${item.organization}-${item.period.en}`}
          className="grid gap-2 border-b border-border py-7 md:grid-cols-[200px_1fr] md:gap-10"
        >
          <p className="flex items-center gap-2 font-mono text-sm text-muted">
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", item.current ? "bg-accent" : "bg-border")}
            />
            {item.period[locale]}
          </p>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {item.title[locale]}
              <span className="font-normal text-muted"> · {item.organization}</span>
            </h3>
            <p className={cn("mt-2 max-w-2xl leading-relaxed text-muted", detailed && "text-[1.0625rem]")}>
              {item.description[locale]}
            </p>
            {detailed && item.highlights?.[locale]?.length ? (
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[0.95rem] text-foreground/80 marker:text-muted">
                {item.highlights[locale].map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
