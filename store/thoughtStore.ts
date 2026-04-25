import { create } from "zustand";

interface ThoughtState {
  thoughts: any[];
  setThoughts: (thoughts: any[]) => void;
}

export const useThoughtStore = create<ThoughtState>((set) => ({
  thoughts: [],
  setThoughts: (thoughts) => set({ thoughts }),
}));
