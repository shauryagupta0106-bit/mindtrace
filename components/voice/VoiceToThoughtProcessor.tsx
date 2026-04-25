"use client";

import { useVoiceStore } from "@/store/voiceStore";
import { Button } from "@/components/ui/Button";
import { Brain } from "lucide-react";

interface VoiceToThoughtProcessorProps {
  onProcess: (text: string) => void;
}

export function VoiceToThoughtProcessor({ onProcess }: VoiceToThoughtProcessorProps) {
  const { transcript, isRecording, setTranscript } = useVoiceStore();

  const handleProcess = () => {
    onProcess(transcript);
    setTranscript("");
  };

  return (
    <div className="flex justify-center mt-6">
      <Button
        onClick={handleProcess}
        disabled={isRecording || !transcript}
        className="gap-2"
      >
        <Brain className="w-4 h-4" />
        Process with AI
      </Button>
    </div>
  );
}
