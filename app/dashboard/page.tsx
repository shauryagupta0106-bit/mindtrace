"use client";

import { useSession } from "next-auth/react";
import { useThoughts } from "@/hooks/useThoughts";
import { ThoughtCard } from "@/components/features/thoughts/ThoughtCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlusCircle, Brain, TrendingUp, History } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">
            Good morning, {session?.user?.name?.split(" ")[0] || "explorer"}.
          </h1>
          <p className="text-text-muted">Your neural state is stable. 4 new patterns detected.</p>
        </div>
        <Link href="/new-thought">
          <Button className="gap-2">
            <PlusCircle className="w-5 h-5" />
            Log New Thought
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Thoughts" value={thoughts.length} icon={History} />
        <StatsCard title="Avg Intensity" value={thoughts.length ? (thoughts.reduce((acc: any, t: any) => acc + t.intensity, 0) / thoughts.length).toFixed(1) : 0} icon={Brain} />
        <StatsCard title="Active Streak" value="5 days" icon={TrendingUp} />
        <StatsCard title="Neural State" value="Coherent" icon={Brain} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Thoughts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading">Recent Thoughts</h2>
            <Link href="/thoughts" className="text-sm text-accent-purple hover:underline">View all</Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>
          ) : recentThoughts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentThoughts.map((thought: any) => (
                <ThoughtCard key={thought.id} thought={thought} />
              ))}
            </div>
          ) : (
            <Card className="py-20 text-center">
              <p className="text-text-muted mb-4">No thoughts logged yet. Start your journey today.</p>
              <Link href="/new-thought">
                <Button variant="outline">Create Your First Thought</Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Memory Bank */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading">Memory Bank</h2>
          <Card className="bg-gradient-to-br from-white/5 to-white/[0.02]">
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Your memory bank contains all encrypted neural traces. Wiping it will permanently delete all your data.
            </p>
            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={() => setIsWipeModalOpen(true)}
            >
              Clear Memory
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        title="Confirm Memory Wipe"
      >
        <p className="text-text-muted mb-6">
          Are you absolutely sure? This action is irreversible and will delete all your logged thoughts and patterns.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setIsWipeModalOpen(false)}>Cancel</Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleWipeMemory}>Yes, Wipe Everything</Button>
        </div>
      </Modal>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon }: any) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="p-2 bg-white/5 rounded-lg">
        <Icon className="w-5 h-5 text-accent-purple" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold">{title}</p>
        <p className="text-xl font-bold font-heading">{value}</p>
      </div>
    </Card>
  );
}
