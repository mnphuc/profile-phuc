import Image from "next/image";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils/cn";

type PortraitProps = { alt: string; className?: string; priority?: boolean };

/** Ảnh chân dung; khi chưa có ảnh (profile.portrait = null) hiển thị monogram tối giản. */
export function Portrait({ alt, className, priority = false }: PortraitProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border bg-secondary",
        className,
      )}
    >
      {profile.portrait ? (
        <Image
          src={profile.portrait}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8"
        >
          <div
            aria-hidden="true"
            className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-muted uppercase"
          >
            <span>phuc.nhanhieuso.vn</span>
            <span>● ● ●</span>
          </div>
          <span
            aria-hidden="true"
            className="text-[clamp(7rem,22vw,12rem)] leading-none font-semibold tracking-tighter"
          >
            P<span className="text-accent">.</span>
          </span>
          <div aria-hidden="true" className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 rounded-full", i % 7 === 0 ? "bg-accent" : "bg-border")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
