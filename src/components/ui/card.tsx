import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-background transition-colors", className)}
      {...props}
    />
  );
}
