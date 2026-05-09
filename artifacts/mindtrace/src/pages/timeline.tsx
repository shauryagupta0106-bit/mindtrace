import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { AlertTriangle, Filter, Clock, Brain, X } from "lucide-react";
import { useGetTimeline, getGetTimelineQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { getEmotionDetails, EMOTIONS } from "@/lib/emotion-utils";

export default function TimelinePage() {
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = {
    ...(emotionFilter !== "all" ? { emotion: emotionFilter } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  };

  const { data: entries, isLoading } = useGetTimeline(
    Object.keys(params).length > 0 ? params : undefined,
    { query: { queryKey: getGetTimelineQueryKey(Object.keys(params).length > 0 ? params : undefined) } }
  );

  const timelineEntries = (Array.isArray(entries) ? entries : [])
    .filter((entry: any) => emotionFilter === "all" || entry.emotion === emotionFilter)
    .filter((entry: any) => {
      if (!startDate && !endDate) return true;
      const entryDate = new Date(entry.createdAt).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate + "T23:59:59").getTime() : Infinity;
      return entryDate >= start && entryDate <= end;
    });
  const hasCognitiveWarning = timelineEntries.some((e: any) => e?.cognitiveWarning);

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground mt-1 text-sm">Your thoughts in chronological order</p>
      </motion.div>

      {/* ── Cognitive Warning ── */}
      <AnimatePresence>
        {hasCognitiveWarning && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent p-4 flex items-start gap-3"
            data-testid="alert-cognitive-warning"
          >
            <div className="p-2 bg-amber-500/15 rounded-lg border border-amber-500/25 shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-amber-300 text-sm">Cognitive Fatigue Warning</p>
              <p className="text-xs text-amber-200/60 mt-0.5 leading-relaxed">
                You've logged 5 or more negative emotions in the last 24 hours. Consider taking a break or speaking to someone you trust.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="glass-card p-4 space-y-3"
      >
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">From</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 bg-card border-card-border focus:border-primary/50 rounded-xl text-sm"
              data-testid="input-start-date"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1.5 block font-medium">To</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 bg-card border-card-border focus:border-primary/50 rounded-xl text-sm"
              data-testid="input-end-date"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 self-end pb-1"
            >
              <X className="w-3 h-3" /> Clear dates
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <button
            data-testid="filter-emotion-all"
            onClick={() => setEmotionFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              emotionFilter === "all"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            All
          </button>
          {EMOTIONS.map((e) => (
            <button
              key={e.id}
              data-testid={`filter-emotion-${e.id}`}
              onClick={() => setEmotionFilter(e.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                emotionFilter === e.id
                  ? "bg-primary/15 text-primary border border-primary/35"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              <span className="text-[11px]">{e.emoji}</span>
              <span className="hidden sm:inline">{e.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Timeline ── */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : timelineEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-14 text-center flex flex-col items-center"
        >
          <Clock className="w-12 h-12 text-primary/40 mx-auto mb-4 float-icon" />
          <h3 className="font-semibold mb-1">Nothing to show</h3>
          <p className="text-muted-foreground text-sm">No thoughts match your current filters.</p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-primary/60 via-accent/30 to-transparent" />

          <div className="space-y-3">
            {timelineEntries.map((entry: any, i: number) => {
              const emotion = getEmotionDetails(entry.emotion);
              const isPos = entry.emotionValence === "positive";

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="flex gap-4 items-start"
                  data-testid={`timeline-entry-${entry.id}`}
                >
                  {/* Node */}
                  <div className="relative z-10 shrink-0 mt-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border text-xl leading-none font-medium transition-all ${
                        entry.cognitiveWarning
                          ? "border-amber-500/50 bg-amber-500/10"
                          : isPos
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-rose-500/40 bg-rose-500/10"
                      }`}
                    >
                      {emotion.emoji}
                    </div>
                  </div>

                  {/* Card */}
                  <Link to={`/thoughts/${entry.id}`} className="flex-1 min-w-0">
                    <div
                      className={`timeline-item p-4 cursor-pointer group ${
                        entry.cognitiveWarning
                          ? "border-amber-500/30"
                          : isPos
                            ? "border-emerald-500/15"
                            : "border-rose-500/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold ${emotion.color}`}>{emotion.label}</span>
                            <span className="text-xs text-muted-foreground">· {entry.intensity}/10</span>
                            {entry.cognitiveWarning && (
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                            )}
                          </div>
                          <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                            {entry.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {entry.context}
                          </p>
                          {(Array.isArray(entry.tags) ? entry.tags : []).length > 0 && (
                            <div className="flex gap-1 mt-1.5 flex-wrap">
                              {(Array.isArray(entry.tags) ? entry.tags : []).slice(0, 3).map((tag: any) => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-medium text-muted-foreground">
                            {format(new Date(entry.createdAt), "MMM d")}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground/60 justify-end mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {format(new Date(entry.createdAt), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
