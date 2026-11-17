import { cn } from "@/lib/utils/cn";

const fieldClass =
  "w-full rounded-md border border-border bg-background px-4 text-base text-foreground placeholder:text-muted/70 transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/15 aria-invalid:border-danger disabled:opacity-60";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClass, "min-h-40 py-3 leading-relaxed", className)} {...props} />;
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-foreground", className)} {...props} />;
}
