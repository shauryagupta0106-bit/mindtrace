"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/utils/formatDate";
import { MessageSquare, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";

interface ThoughtCardProps {
  thought: {
    id: string;
    title: string;
    context: string;
    emotion: string;
    intensity: number;
    tags: string[];
    createdAt: string;
    prediction?: string;
  };
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  return (
    <Link href={`/thoughts/${thought.id}`}>
      <Card className="hover:border-accent-purple/50 transition-all group h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="purple" className="capitalize">
            {thought.emotion}
          </Badge>
          <span className="text-xs text-text-muted">{formatDate(thought.createdAt)}</span>
        </div>
        <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-accent-purple transition-colors">
          {thought.title}
        </h3>
        <p className="text-sm text-text-muted line-clamp-3 mb-4 flex-grow">
          {thought.context}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {thought.tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1 text-[10px] text-text-muted">
              <Tag className="w-3 h-3" />
              {tag}
            </div>
          ))}
        </div>
        {thought.prediction && (
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-accent-cyan font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>AI Prediction Active</span>
          </div>
        )}
      </Card>
    </Link>
  );
}
