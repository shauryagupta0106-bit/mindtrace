"use client";

import { useVoiceInput } from "@/hooks/useVoiceInput";
import { Button } from "@/components/ui/Button";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";

export function VoiceRecorderButton() {
  const { isRecording, startRecording, stopRecording } = useVoiceInput();

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "secondary" : "primary"}
          size="lg"
          className="rounded-full w-16 h-16 shadow-glow-purple"
        >
          {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
      </motion.div>
      <p className="text-sm text-text-muted">
        {isRecording ? "Listening... Speak naturally." : "Tap to start voice recording"}
      </p>
    </div>
  );
}
