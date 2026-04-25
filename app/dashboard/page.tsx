"use client";

import { useSession } from "next-auth/react";
import { useThoughts } from "@/hooks/useThoughts";
import { ThoughtCard } from "@/components/features/thoughts/ThoughtCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlusCircle, Brain, TrendingUp, History, Sparkles, Activity, Shield } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { thoughts, isLoading } = useThoughts();
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);

  const handleWipeMemory = async () => {
    await fetch("/api/memory", { method: "DELETE" });
    window.location.reload();
  };

  const recentThoughts = thoughts.slice(0, 5);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent-purple mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Neural Update available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            Greetings, {session?.user?.name?.split(" ")[0] || "Explorer"}.
          </h1>
          <p className="text-lg text-text-muted font-light mt-2">Your cognitive coherence is at 84%. Stability verified.</p>
        </div>
        <Link href="/new-thought">
          <Button size="lg" className="h-14 px-8 rounded-2xl shadow-glow-purple">
            <PlusCircle className="w-5 h-5 mr-3" />
            Trace New Thought
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Neural Traces"
          value={thoughts.length}
          icon={History}
          color="purple"
          description="+12% from last cycle"
        />
        <StatsCard
          title="Cognitive Intensity"
          value={thoughts.length ? (thoughts.reduce((acc: any, t: any) => acc + t.intensity, 0) / thoughts.length).toFixed(1) : 0}
          icon={Brain}
          color="cyan"
          description="Optimal stability range"
        />
        <StatsCard
          title="Active Streak"
          value="5 days"
          icon={TrendingUp}
          color="blue"
          description="Consistent pattern detected"
        />
        <StatsCard
          title="Neural Resilience"
          value="High"
          icon={Shield}
          color="purple"
          description="Recovery speed: 92%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Thoughts */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-white" />
              <h2 className="text-2xl font-bold font-heading">Recent Traces</h2>
            </div>
            <Link href="/thoughts" className="text-sm font-bold uppercase tracking-widest text-accent-purple hover:text-accent-purple/80 transition-colors">Neural Bank &rarr;</Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-32 bg-white/5 rounded-3xl border border-white/5">
              <Spinner className="w-10 h-10" />
            </div>
          ) : recentThoughts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentThoughts.map((thought: any, i: number) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ThoughtCard thought={thought} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="py-24 text-center border-dashed">
              <div className="max-w-xs mx-auto space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl w-fit mx-auto">
                  <Brain className="w-10 h-10 text-text-muted" />
                </div>
                <p className="text-text-muted font-light">Your neural bank is empty. Begin your first cognitive trace to unlock insights.</p>
                <Link href="/new-thought">
                  <Button variant="outline" className="w-full h-12">Initialize First Trace</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Memory Bank Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading">Neural Pulse</h2>
            <Card className="bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 border-accent-purple/20 p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Integrity Map</span>
                  <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-glow-cyan" />
                </div>
                <div className="h-40 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t-lg opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Your cognitive patterns show a 14% increase in emotional resilience over the last 72 hours.
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading">System</h2>
            <Card className="border-red-500/20 bg-red-500/[0.02] p-8">
              <p className="text-sm text-text-muted mb-8 leading-relaxed font-light">
                Securely wipe all encrypted neural traces. This protocol is irreversible.
              </p>
              <Button
                variant="outline"
                className="w-full h-12 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-2xl group"
                onClick={() => setIsWipeModalOpen(true)}
              >
                <Shield className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Initiate Memory Wipe
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        title="Confirm Memory Wipe"
      >
        <div className="p-4 text-center space-y-6">
          <div className="p-4 bg-red-500/10 rounded-full w-fit mx-auto text-red-500">
            <Shield className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold font-heading">Final Confirmation</h4>
            <p className="text-text-muted font-light">
              This will permanently delete all your cognitive data and history. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" className="flex-1 h-14" onClick={() => setIsWipeModalOpen(false)}>Cancel Protocol</Button>
            <Button className="flex-1 h-14 bg-red-600 hover:bg-red-700" onClick={handleWipeMemory}>Wipe Everything</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, description }: any) {
  const colors: any = {
    purple: "text-accent-purple border-accent-purple/20 bg-accent-purple/5",
    cyan: "text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5",
    blue: "text-accent-blue border-accent-blue/20 bg-accent-blue/5",
  };

  return (
    <Card className={cn("flex flex-col gap-6 p-8 transition-all hover:-translate-y-1 hover:shadow-glow-purple", colors[color])}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">{title}</p>
        <div className="p-2 bg-white/5 rounded-xl">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-4xl font-bold font-heading text-white">{value}</p>
        <p className="text-[10px] text-text-muted font-bold uppercase mt-2 tracking-widest">{description}</p>
      </div>
    </Card>
  );
}
