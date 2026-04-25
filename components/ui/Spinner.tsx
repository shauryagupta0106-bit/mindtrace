import { cn } from "@/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full h-4 w-4 border-2 border-accent-purple border-t-transparent",
        className
      )}
    />
  );
}
