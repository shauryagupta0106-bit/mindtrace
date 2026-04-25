import { create } from "zustand";

interface VoiceState {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),
  transcript: "",
  setTranscript: (transcript) => set({ transcript }),
}));
