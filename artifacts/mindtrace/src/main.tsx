import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { SafeClerkProvider } from "@/components/safe-clerk-provider";
import { initializeMockApi } from "@workspace/api-client-react";

// Initialize the mock API to intercept all /api/ requests with local storage
initializeMockApi();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const root = document.getElementById("root");

if (!root) {
  document.body.innerHTML = "<h1>ROOT NOT FOUND</h1>";
  throw new Error("Root element missing");
}

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <SafeClerkProvider>
      <App />
    </SafeClerkProvider>
  </QueryClientProvider>
);
