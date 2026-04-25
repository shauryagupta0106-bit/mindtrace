import { useQuery } from "@tanstack/react-query";

export function useAnalytics() {
  const analyticsQuery = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  const timelineQuery = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const res = await fetch("/api/timeline");
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json();
    },
  });

  return {
    analytics: analyticsQuery.data,
    timeline: timelineQuery.data,
    isLoading: analyticsQuery.isLoading || timelineQuery.isLoading,
  };
}
