"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/formatDate";
import { ChevronLeft, Trash2, Edit2, Share2 } from "lucide-react";
import Link from "next/link";

export default function ThoughtDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: thought, isLoading } = useQuery({
    queryKey: ["thought", id],
    queryFn: async () => {
      const res = await fetch(`/api/thoughts/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    }
  });

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this thought?")) {
      await fetch(`/api/thoughts/${id}`, { method: "DELETE" });
      router.push("/dashboard");
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>;
  if (!thought) return <div>Thought not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/thoughts">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Neural Bank
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10 gap-2" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Badge variant="purple" className="capitalize">{thought.emotion}</Badge>
            <span className="text-sm text-text-muted">{formatDate(thought.createdAt)}</span>
          </div>
          <h1 className="text-4xl font-bold font-heading tracking-tight">{thought.title}</h1>
        </div>

        <Card className="p-8 text-lg leading-relaxed whitespace-pre-wrap text-text-primary/90">
          {thought.context}
        </Card>

        {thought.prediction && (
          <Card className="border-accent-cyan/20 bg-accent-cyan/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-accent-cyan/20 rounded-md">
                <Edit2 className="w-4 h-4 text-accent-cyan" />
              </div>
              <span className="text-sm font-bold font-heading uppercase text-accent-cyan tracking-wider">AI Insight Prediction</span>
            </div>
            <p className="text-text-primary/80 italic">{thought.prediction}</p>
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          {thought.tags.map((tag: string) => (
            <Badge key={tag} variant="default">#{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
