"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { BrainCircuit, Bell, User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-primary rounded-xl shadow-glow-purple group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold font-heading tracking-tighter text-white">MindTrace</span>
        </Link>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Neural Sync Active</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-white">
                  <Bell className="w-5 h-5" />
                </Button>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white line-clamp-1">{session.user?.name}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-tighter">Pro Explorer</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-white/10 p-0 h-10 w-10">
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || ""} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-text-muted" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Link href="/auth">
              <Button className="px-8">Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
