import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useThoughts() {
  const queryClient = useQueryClient();

  const thoughtsQuery = useQuery({
    queryKey: ["thoughts"],
    queryFn: async () => {
      const res = await fetch("/api/thoughts");
      if (!res.ok) throw new Error("Failed to fetch thoughts");
      return res.json();
    },
  });

  const createThoughtMutation = useMutation({
    mutationFn: async (newThought: any) => {
      const res = await fetch("/api/thoughts", {
        method: "POST",
        body: JSON.stringify(newThought),
      });
      if (!res.ok) throw new Error("Failed to create thought");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
    },
  });

  return {
    thoughts: thoughtsQuery.data || [],
    isLoading: thoughtsQuery.isLoading,
    error: thoughtsQuery.error,
    createThought: createThoughtMutation.mutateAsync,
    isCreating: createThoughtMutation.isPending,
  };
}
