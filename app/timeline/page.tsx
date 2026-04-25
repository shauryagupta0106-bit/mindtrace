"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { TimelineView } from "@/components/features/timeline/TimelineView";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";

export default function TimelinePage() {
  const { timeline, isLoading } = useAnalytics();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-heading">Cognitive Timeline</h1>
        <p className="text-text-muted mt-2">A chronological map of your consciousness, visualizing the ebb and flow of thoughts and emotions.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>
      ) : (
        <div className="max-w-4xl mx-auto py-12">
          <TimelineView entries={timeline || []} />
        </div>
      )}
    </div>
  );
}
