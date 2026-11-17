import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type CoverProps = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Ảnh cover; khi chưa có ảnh hiển thị khối typographic theo phong cách editorial. */
export function Cover({ src, alt, label, className, priority, sizes }: CoverProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-secondary",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between p-5">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</span>
          <div className="flex items-end justify-between">
            <span className="text-5xl leading-none font-semibold tracking-tighter text-foreground/90">
              {label.charAt(0).toUpperCase()}
              <span className="text-accent">.</span>
            </span>
            <span className="grid grid-cols-4 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className={cn("size-1.5 rounded-full", i === 5 ? "bg-accent" : "bg-border")} />
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
