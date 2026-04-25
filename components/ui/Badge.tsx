import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "cyan" | "blue" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white",
    purple: "bg-accent-purple/20 text-accent-purple border border-accent-purple/30",
    cyan: "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30",
    blue: "bg-accent-blue/20 text-accent-blue border border-accent-blue/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
