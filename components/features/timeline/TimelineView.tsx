"use client";

import { TimelineEntry } from "./TimelineEntry";

interface TimelineViewProps {
  entries: any[];
}

export function TimelineView({ entries }: TimelineViewProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-text-muted">No entries found in your timeline.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
      {entries.map((entry, index) => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          isLeft={index % 2 === 0}
        />
      ))}
    </div>
  );
}
