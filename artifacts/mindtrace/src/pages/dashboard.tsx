import { useSafeUser } from "@/components/safe-clerk-provider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { BrainCircuit, TrendingUp, Flame, Plus, Clock, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { useGetDashboardSummary, useClearMemory } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmotionDetails } from "@/lib/emotion-utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.06 * i, duration: 0.45, ease: "easeOut" as const } });

export default function DashboardPage() {
  const user = useSafeUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: { queryKey: ['/api/analytics/dashboard'] }
  });

  const clearMemory = useClearMemory();
  
  const handleClearMemory = async () => {
    try {
      await clearMemory.mutateAsync();
      await queryClient.resetQueries();
      toast({ title: "Memory Cleared", description: "All thoughts have been permanently deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to clear memory.", variant: "destructive" });
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = user?.firstName || "Thinker";

  const stats = [
    {
      label: "Total Thoughts",
      value: summary?.totalThoughts ?? 0,
      icon: BrainCircuit,
      iconColor: "text-primary",
      orb: "bg-primary/15",
      suffix: "",
    },
    {
      label: "Current Streak",
      value: summary?.streak ?? 0,
      icon: Flame,
      iconColor: "text-orange-400",
      orb: "bg-orange-500/15",
      suffix: "days",
    },
    {
      label: "Avg Intensity",
      value: summary?.avgEmotionIntensity?.toFixed(1) ?? "0.0",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      orb: "bg-emerald-500/15",
      suffix: "/ 10",
    },
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div {...stagger(0)}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">{format(new Date(), "EEEE, MMMM d")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {greeting}, <span className="animated-gradient">{name}</span>.
          </h1>
          <p className="text-muted-foreground text-lg mt-1">Ready to trace your thoughts today?</p>
        </motion.div>
        <motion.div {...stagger(1)}>
          <Link to="/new-thought">
            <Button className="hero-btn border-0 text-white rounded-xl h-11 px-5 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading
          ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)
          : stats.map((s, i) => (
            <motion.div key={s.label} {...stagger(i + 2)} className="stat-card p-6">
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-60 blur-2xl" style={{ background: `var(--tw-gradient-from, transparent)` }} />
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-xl ${s.orb}`} />
              <div className="flex items-start justify-between mb-6">
                <span className="text-sm text-muted-foreground font-medium">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.orb} border border-white/5`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.iconColor}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{s.value}</span>
                {s.suffix && <span className="text-muted-foreground text-sm">{s.suffix}</span>}
              </div>
            </motion.div>
          ))
        }
      </div>

      {/* ── Cognitive Load Warning ── */}
      {summary?.cognitiveLoad && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent p-5 flex items-start gap-4"
        >
          <div className="p-2.5 bg-red-500/20 rounded-xl border border-red-500/25 shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-red-300 mb-0.5">Cognitive Load Warning</h3>
            <p className="text-red-300/70 text-sm">{summary.cognitiveLoad}</p>
          </div>
        </motion.div>
      )}

      {/* ── Recent Thoughts ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.h2 {...stagger(5)} className="text-xl font-bold">Recent Traces</motion.h2>
          <Link to="/thoughts" className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors group">
            View all
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)
            : summary?.recentThoughts && summary.recentThoughts.length > 0
              ? (summary.recentThoughts as any[]).map((thought, i) => {
                  const emotion = getEmotionDetails(thought.emotion);
                  return (
                    <motion.div key={thought.id} {...stagger(i + 6)}>
                      <Link to={`/thoughts/${thought.id}`} className="block h-full">
                        <div className="thought-card group cursor-pointer overflow-hidden bg-[hsl(228_20%_14%)] border-[hsl(226_18%_24%)] hover:border-[hsl(226_18%_28%)] transition-colors rounded-[16px] h-full flex flex-col">
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[17px] leading-none">{emotion.emoji}</span>
                                <div className="flex items-center gap-1">
                                  <span className={`text-xs font-semibold ${emotion.color}`}>{emotion.label}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0 flex flex-col items-end">
                                <p className="text-xs font-medium text-muted-foreground">
                                  {format(new Date(thought.createdAt), "MMM d")}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                  {format(new Date(thought.createdAt), "h:mm a")}
                                </p>
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-foreground mb-1">
                              {thought.title || "Untitled"}
                            </h3>
                            <p className="text-muted-foreground text-[14px] line-clamp-2 leading-relaxed mb-4 flex-1">
                              {thought.context}
                            </p>
                            
                            {(Array.isArray(thought.tags) ? thought.tags : []).length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {(Array.isArray(thought.tags) ? thought.tags : []).slice(0, 4).map((tag: any) => (
                                  <span
                                    key={tag}
                                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[hsl(228_20%_19%)] text-muted-foreground border border-[hsl(226_18%_24%)]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              : (
                <motion.div {...stagger(6)} className="col-span-full glass-card p-14 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                    <BrainCircuit className="relative w-14 h-14 text-primary/50 float-icon" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your sanctuary awaits</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
                    Start tracing your mind to see insights appear here. It only takes a minute.
                  </p>
                  <Link to="/new-thought">
                    <Button className="hero-btn border-0 text-white rounded-xl">Log First Thought</Button>
                  </Link>
                </motion.div>
              )
          }
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="pt-8 border-t border-white/5 flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm">
              Clear All Memory
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-red-500/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-400">Erase all thoughts?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This permanently deletes your entire journal history and all cognitive insights. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-foreground">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearMemory}
                disabled={clearMemory.isPending}
                className="bg-red-500 hover:bg-red-600 text-white border-0"
              >
                {clearMemory.isPending ? "Erasing…" : "Yes, erase everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
