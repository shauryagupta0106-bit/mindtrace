export const EMOTIONS = [
  { id: 'joy',      label: 'Joy',      emoji: '✨', color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]' },
  { id: 'calm',     label: 'Calm',     emoji: '🌊', color: 'text-sky-400',     glow: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]' },
  { id: 'anxious',  label: 'Anxious',  emoji: '⚡', color: 'text-amber-400',   glow: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]' },
  { id: 'angry',    label: 'Angry',    emoji: '🔥', color: 'text-red-400',     glow: 'shadow-[0_0_15px_rgba(248,113,113,0.5)]' },
  { id: 'sad',      label: 'Sad',      emoji: '🌧️', color: 'text-blue-400',   glow: 'shadow-[0_0_15px_rgba(96,165,250,0.5)]' },
  { id: 'focused',  label: 'Focused',  emoji: '🎯', color: 'text-indigo-400',  glow: 'shadow-[0_0_15px_rgba(99,102,241,0.5)]' },
  { id: 'confused', label: 'Confused', emoji: '🌀', color: 'text-violet-400',  glow: 'shadow-[0_0_15px_rgba(167,139,250,0.5)]' },
  { id: 'excited',  label: 'Excited',  emoji: '🌟', color: 'text-orange-400',  glow: 'shadow-[0_0_15px_rgba(251,146,60,0.5)]' },
  { id: 'fearful',  label: 'Fearful',  emoji: '🌑', color: 'text-zinc-400',    glow: 'shadow-[0_0_15px_rgba(161,161,170,0.5)]' },
  { id: 'hopeful',  label: 'Hopeful',  emoji: '🌅', color: 'text-teal-400',    glow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]' },
];

export function getEmotionDetails(emotionId: string) {
  const normalized = emotionId?.toLowerCase() || 'focused';
  return EMOTIONS.find(e => e.id === normalized) || EMOTIONS[5];
}

export function getValenceColor(valence: string) {
  switch (valence.toLowerCase()) {
    case 'positive': return 'text-emerald-400 border-emerald-500/30';
    case 'negative': return 'text-rose-400 border-rose-500/30';
    default:         return 'text-sky-400 border-sky-500/30';
  }
}
