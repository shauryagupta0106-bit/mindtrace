"use client";

import { Card } from "@/components/ui/Card";

export function EmotionChart({ data }: { data: Record<string, number> }) {
  const maxCount = Math.max(...Object.values(data), 1);
  const emotions = Object.entries(data);

  return (
    <Card className="h-full">
      <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-text-muted mb-6">
        Emotional Distribution
      </h4>
      <div className="space-y-4">
        {emotions.length > 0 ? (
          emotions.map(([emotion, count]) => (
            <div key={emotion} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="capitalize">{emotion}</span>
                <span className="text-text-muted">{count}</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-purple transition-all duration-1000"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-text-muted text-sm py-8">No data available yet.</p>
        )}
      </div>
    </Card>
  );
}
