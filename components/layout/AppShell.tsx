"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      {session ? (
        <div className="pt-16">
          <Sidebar />
          <main className="md:ml-64 p-6 min-h-[calc(100vh-64px)]">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      ) : (
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      )}
    </div>
  );
}
