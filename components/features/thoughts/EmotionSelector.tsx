"use client";

import { cn } from "@/utils/cn";

const emotions = [
  { label: "Joy", value: "joy", color: "text-yellow-400" },
  { label: "Sadness", value: "sadness", color: "text-blue-400" },
  { label: "Anger", value: "anger", color: "text-red-400" },
  { label: "Anxiety", value: "anxiety", color: "text-purple-400" },
  { label: "Peace", value: "peace", color: "text-cyan-400" },
  { label: "Neutral", value: "neutral", color: "text-slate-400" },
];

interface EmotionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmotionSelector({ value, onChange }: EmotionSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {emotions.map((emotion) => (
        <button
          key={emotion.value}
          type="button"
          onClick={() => onChange(emotion.value)}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
            value === emotion.value
              ? "bg-accent-purple/10 border-accent-purple shadow-glow-purple"
              : "bg-white/5 border-white/5 hover:bg-white/10"
          )}
        >
          <span className={cn("text-xs font-bold", emotion.color)}>
            {emotion.label}
          </span>
        </button>
      ))}
    </div>
  );
}
