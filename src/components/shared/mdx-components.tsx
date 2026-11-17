import Image from "next/image";
import NextLink from "next/link";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils/cn";

function MdxLink({ href = "", children, ...props }: React.ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    );
  }
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function MdxImage({ src, alt = "", ...props }: React.ComponentProps<"img">) {
  // Ảnh Markdown thông thường không có kích thước → dùng <img> với lazy loading.
  // Dùng <Figure> khi cần tối ưu bằng next/image.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={typeof src === "string" ? src : undefined} alt={alt} loading="lazy" decoding="async" {...props} />;
}

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

/** Ảnh tối ưu bằng next/image trong MDX: <Figure src="/images/blog/x.jpg" alt="..." width={1200} height={630} /> */
function Figure({ src, alt, width, height, caption }: FigureProps) {
  return (
    <figure>
      <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 768px) 680px, 100vw" />
      {caption ? <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

function Callout({ children, type = "note" }: { children: React.ReactNode; type?: "note" | "warning" }) {
  return (
    <aside
      className={cn(
        "rounded-md border px-5 py-4 text-[0.95rem] [&>*+*]:mt-2",
        type === "warning" ? "border-amber-200 bg-amber-50" : "border-border bg-secondary",
      )}
    >
      {children}
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  img: MdxImage,
  Figure,
  Callout,
};
