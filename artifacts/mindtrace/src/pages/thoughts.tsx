import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Brain, Clock, X } from "lucide-react";
import { useListThoughts, getListThoughtsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmotionDetails, EMOTIONS } from "@/lib/emotion-utils";
import { format } from "date-fns";

export default function ThoughtsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: thoughts, isLoading } = useListThoughts(undefined, {
    query: { queryKey: getListThoughtsQueryKey() },
  });

  const filtered = (thoughts || []).filter((t: any) => {
    const tags = Array.isArray(t?.tags) ? t.tags : [];
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      String(t?.title ?? "").toLowerCase().includes(q) ||
      String(t?.context ?? "").toLowerCase().includes(q) ||
      tags.some((tag: any) => String(tag).toLowerCase().includes(q));
    const matchesEmotion = activeFilter === "All" || String(t?.emotion ?? "").toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesEmotion;
  });

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thoughts</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLoading ? "Loading…" : `${thoughts?.length ?? 0} total entries`}
          </p>
        </div>
        <Link to="/new-thought">
          <Button
            data-testid="button-new-thought"
            className="hero-btn border-0 text-white h-10 px-4 rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Thought
          </Button>
        </Link>
      </motion.div>

      {/* ── Search & Filter bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="glass-card p-4 space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-search"
            placeholder="Search thoughts, tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 h-10 bg-card border-card-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <button
            data-testid="filter-emotion-all"
            onClick={() => setActiveFilter("All")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeFilter === "All"
                ? "bg-primary text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            All
          </button>
          {EMOTIONS.map((e) => (
            <button
              key={e.id}
              data-testid={`filter-emotion-${e.id}`}
              onClick={() => setActiveFilter(e.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                activeFilter === e.id
                  ? "bg-primary/15 text-primary border border-primary/35"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              <span>{e.emoji}</span>
              {e.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── List ── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-14 text-center flex flex-col items-center"
        >
          <Brain className="w-12 h-12 text-primary/40 mx-auto mb-4 float-icon" />
          <h3 className="font-semibold mb-1">
            {search || activeFilter !== "All" ? "No matches found" : "No thoughts yet"}
          </h3>
          <p className="text-muted-foreground text-sm mb-5">
            {search || activeFilter !== "All"
              ? "Try adjusting your search or filters."
              : "Start journaling to see your thoughts here."}
          </p>
          {!search && activeFilter === "All" && (
            <Link to="/new-thought">
              <Button className="hero-btn border-0 text-white rounded-xl h-10 px-4">
                <Plus className="w-4 h-4 mr-1.5" />
                Log first thought
              </Button>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((thought: any, i: number) => {
            const emotion = getEmotionDetails(thought.emotion);
            return (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                data-testid={`card-thought-${thought.id}`}
              >
                <Link to={`/thoughts/${thought.id}`}>
                  <div className="thought-card group cursor-pointer overflow-hidden bg-[hsl(228_20%_14%)] border-[hsl(226_18%_24%)] hover:border-[hsl(226_18%_28%)] transition-colors rounded-[16px]">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[17px] leading-none">{emotion.emoji}</span>
                          <div className="flex items-center gap-1">
                            <span className={`text-xs font-semibold ${emotion.color}`}>{emotion.label}</span>
                            <span className="text-[13px] text-muted-foreground font-medium">- {thought.intensity}/10</span>
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
                        {thought.title}
                      </h3>
                      <p className="text-muted-foreground text-[14px] line-clamp-2 leading-relaxed mb-4">
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
          })}
        </div>
      )}
    </div>
  );
}
