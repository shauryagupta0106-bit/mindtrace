"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Brain, Sparkles, AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface PredictionPanelProps {
  context: string;
  onPredictionGenerated: (prediction: string) => void;
}

export function PredictionPanel({ context, onPredictionGenerated }: PredictionPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prediction, setPrediction] = useState("");

  const generatePrediction = () => {
    if (!context) return;
    setIsGenerating(true);

    // Simulate AI prediction logic
    setTimeout(() => {
      const mockPredictions = [
        "Based on current emotional patterns, you may experience increased focus over the next 24 hours.",
        "Your cognitive state suggests a need for rest. Probability of fatigue in 4 hours: 75%.",
        "Recent themes correlate with a positive breakthrough in ongoing projects soon.",
        "Current stress markers indicate a potential decline in sleep quality tonight."
      ];
      const result = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
      setPrediction(result);
      onPredictionGenerated(result);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card className="border-accent-cyan/20 bg-accent-cyan/5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent-cyan" />
        <h4 className="font-bold font-heading text-accent-cyan uppercase tracking-wider text-sm">
          Cognitive Prediction Engine
        </h4>
      </div>

      {prediction ? (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-text-primary/90">
            {prediction}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPrediction("")}
            className="text-[10px] text-text-muted hover:text-accent-cyan"
          >
            Regenerate Prediction
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <p className="text-xs text-text-muted mb-4">
            Analyze your thought context to predict potential cognitive outcomes.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!context || isGenerating}
            onClick={generatePrediction}
            className="border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10"
          >
            {isGenerating ? <Spinner className="mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
            Generate Prediction
          </Button>
        </div>
      )}
    </Card>
  );
}
