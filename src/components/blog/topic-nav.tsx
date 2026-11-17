import { useTranslations } from "next-intl";
import type { Topic } from "@/features/blog/blog.types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export function TopicNav({ topics, active }: { topics: Topic[]; active?: string }) {
  const t = useTranslations("blog");
  if (topics.length === 0) return null;

  const itemClass = (isActive: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
      isActive
        ? "border-foreground bg-foreground text-background"
        : "border-border text-muted hover:border-foreground/30 hover:text-foreground",
    );

  return (
    <nav aria-label={t("topics")} className="mt-10">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/blog" aria-current={!active ? "page" : undefined} className={itemClass(!active)}>
            {t("allTopics")}
          </Link>
        </li>
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/topics/${topic.slug}`}
              aria-current={active === topic.slug ? "page" : undefined}
              className={itemClass(active === topic.slug)}
            >
              {topic.name}
              <span className="font-mono text-xs opacity-60">{topic.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
