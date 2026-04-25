"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface TimelineEntryProps {
  entry: {
    id: string;
    title: string;
    createdAt: string;
    emotion: string;
    intensity: number;
  };
  isLeft: boolean;
}

export function TimelineEntry({ entry, isLeft }: TimelineEntryProps) {
  return (
    <div className={cn(
      "relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group",
      "is-active"
    )}>
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
        <div className="w-2 h-2 rounded-full bg-accent-purple shadow-glow-purple" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4 hover:border-white/20 transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <time className="text-xs font-medium text-accent-cyan">{formatDate(entry.createdAt)}</time>
          <Badge variant="default" className="text-[10px]">{entry.intensity}/10</Badge>
        </div>
        <Link href={`/thoughts/${entry.id}`}>
          <h3 className="font-bold font-heading mb-1 group-hover:text-accent-purple transition-colors line-clamp-1">{entry.title}</h3>
        </Link>
        <p className="text-xs text-text-muted capitalize">{entry.emotion}</p>
      </motion.div>
    </div>
  );
}
