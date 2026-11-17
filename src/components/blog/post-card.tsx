import { useTranslations } from "next-intl";
import { Cover } from "@/components/shared/cover";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/features/blog/blog.types";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils/date";

export function PostCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  const t = useTranslations("common");

  return (
    <article className="group relative flex flex-col">
      <Cover src={post.cover} alt="" label={post.category} priority={priority} />
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
        <span className="tracking-[0.1em] text-accent uppercase">{post.category}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.date}>{formatDate(post.date, post.locale)}</time>
        <span aria-hidden="true">·</span>
        <span>{t("minRead", { minutes: post.readingTime })}</span>
      </div>
      <h3 className="mt-2 text-xl leading-snug font-semibold tracking-tight text-balance">
        <Link
          href={`/blog/${post.slug}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-muted">{post.description}</p>
      {post.tags.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <li key={tag}>
              <Badge variant="outline">{tag}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/** Dạng danh sách gọn cho trang Blog/Topic — ưu tiên đọc nhanh tiêu đề. */
export function PostRow({ post }: { post: BlogPost }) {
  const t = useTranslations("common");

  return (
    <article className="group relative grid gap-2 border-b border-border py-7 md:grid-cols-[180px_1fr] md:gap-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted md:flex-col md:items-start md:gap-1.5">
        <time dateTime={post.date}>{formatDate(post.date, post.locale)}</time>
        <span className="tracking-[0.1em] text-accent uppercase">{post.category}</span>
      </div>
      <div>
        <h3 className="text-xl leading-snug font-semibold tracking-tight text-balance sm:text-2xl">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted">{post.description}</p>
        <p className="mt-3 font-mono text-xs text-muted">{t("minRead", { minutes: post.readingTime })}</p>
      </div>
    </article>
  );
}
