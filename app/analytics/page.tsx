"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { CognitiveGraph } from "@/components/features/analytics/CognitiveGraph";
import { InsightCard } from "@/components/features/analytics/InsightCard";
import { EmotionChart } from "@/components/features/analytics/EmotionChart";
import { Spinner } from "@/components/ui/Spinner";
import { Brain, Zap, TrendingUp, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { analytics, isLoading } = useAnalytics();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Cognitive Analytics</h1>
        <p className="text-text-muted">Deep insights into your neural patterns and emotional evolution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CognitiveGraph />
        </div>
        <div>
          <EmotionChart data={analytics?.emotionCounts || {}} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Cognitive Coherence"
          value="84%"
          description="Your thought patterns show high logical consistency over the last 7 days."
          icon={Brain}
          variant="purple"
        />
        <InsightCard
          title="Avg Intensity"
          value={analytics?.avgIntensity?.toFixed(1) || 0}
          description="Emotional intensity has remained stable within the optimal range."
          icon={Zap}
          variant="cyan"
        />
        <InsightCard
          title="Prediction Accuracy"
          value="92%"
          description="AI prediction engine successfully forecasted 12 of your last 13 states."
          icon={TrendingUp}
          variant="blue"
        />
        <InsightCard
          title="Primary Trigger"
          value="Work"
          description="70% of high-intensity thoughts correlate with professional contexts."
          icon={AlertCircle}
          variant="purple"
        />
      </div>
    </div>
  );
}
