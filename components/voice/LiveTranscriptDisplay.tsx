"use client";

import { useVoiceStore } from "@/store/voiceStore";
import { motion, AnimatePresence } from "framer-motion";

export function LiveTranscriptDisplay() {
  const { transcript, isRecording } = useVoiceStore();

  return (
    <AnimatePresence>
      {(isRecording || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="w-full p-4 glass-card min-h-[100px] flex items-center justify-center text-center italic text-text-primary/80"
        >
          {transcript || "Waiting for audio..."}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
