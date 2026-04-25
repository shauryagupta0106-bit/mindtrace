"use client";

import { useThoughts } from "@/hooks/useThoughts";
import { ThoughtCard } from "@/components/features/thoughts/ThoughtCard";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ThoughtsPage() {
  const { thoughts, isLoading } = useThoughts();
  const [search, setSearch] = useState("");

  const filteredThoughts = thoughts.filter((t: any) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.context.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Neural Bank</h1>
          <p className="text-text-muted">A collection of all your recorded neural traces.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search thoughts..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>
      ) : filteredThoughts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThoughts.map((thought: any) => (
            <ThoughtCard key={thought.id} thought={thought} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-text-muted">
          No thoughts found matching your search.
        </div>
      )}
    </div>
  );
}
