"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  History,
  BarChart3,
  Settings,
  PlusCircle,
  Brain
} from "lucide-react";
import { cn } from "@/utils/cn";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PlusCircle, label: "New Thought", href: "/new-thought" },
  { icon: MessageSquare, label: "Thoughts", href: "/thoughts" },
  { icon: History, label: "Timeline", href: "/timeline" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] border-r border-white/8 bg-secondary p-4 hidden md:block">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
              pathname === item.href
                ? "bg-accent-purple/10 text-accent-purple"
                : "text-text-muted hover:bg-white/5 hover:text-text-primary"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              pathname === item.href ? "text-accent-purple" : "text-text-muted group-hover:text-text-primary"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-8 left-4 right-4">
        <div className="glass-card p-4 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">Neural State</span>
          </div>
          <p className="text-xs text-text-muted">Analyzing cognitive patterns in real-time.</p>
        </div>
      </div>
    </aside>
  );
}
