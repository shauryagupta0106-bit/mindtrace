import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface InsightCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  variant?: "purple" | "cyan" | "blue";
}

export function InsightCard({ title, value, description, icon: Icon, variant = "purple" }: InsightCardProps) {
  const variants = {
    purple: "text-accent-purple",
    cyan: "text-accent-cyan",
    blue: "text-accent-blue",
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold font-heading uppercase tracking-wider text-text-muted">{title}</span>
        <Icon className={cn("w-5 h-5", variants[variant])} />
      </div>
      <div>
        <span className="text-3xl font-bold font-heading">{value}</span>
      </div>
      <p className="text-xs text-text-muted leading-relaxed">
        {description}
      </p>
    </Card>
  );
}
