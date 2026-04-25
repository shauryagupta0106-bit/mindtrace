import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export function Card({ children, className, animate = false, ...props }: CardProps) {
  const Component = animate ? motion.div : "div";

  return (
    <Component
      className={cn("glass-card p-6 shadow-2xl", className)}
      {...(animate ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 }
      } : {})}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
