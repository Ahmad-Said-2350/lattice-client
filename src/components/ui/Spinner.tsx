import { cn } from "@/lib/cn";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-2 text-sm text-muted", className)}
      role="status"
      aria-live="polite"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
      <span>{label}</span>
    </div>
  );
}
