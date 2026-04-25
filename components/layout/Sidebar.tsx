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
  Brain,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PlusCircle, label: "New Thought", href: "/new-thought" },
  { icon: MessageSquare, label: "Neural Bank", href: "/thoughts" },
  { icon: History, label: "Timeline", href: "/timeline" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-20 w-72 h-[calc(100vh-80px)] border-r border-white/5 bg-background/20 backdrop-blur-2xl p-6 hidden lg:block overflow-y-auto">
      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-6 px-4">Core Navigation</p>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative group",
                    isActive
                      ? "text-white"
                      : "text-text-muted hover:bg-white/5 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 relative z-10 transition-colors",
                    isActive ? "text-accent-purple" : "text-text-muted group-hover:text-white"
                  )} />
                  <span className="font-bold tracking-tight relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-6 px-4">Neural Performance</p>
          <div className="space-y-4">
            <MetricBar label="Cognitive Load" value={65} icon={Zap} color="purple" />
            <MetricBar label="Emotional Flux" value={42} icon={Activity} color="cyan" />
            <MetricBar label="Pattern Sync" value={88} icon={Brain} color="blue" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 right-6">
        <div className="glass-card p-6 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Zap className="w-4 h-4 text-accent-cyan" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-white">MindTrace Pro</span>
          </div>
          <p className="text-xs text-text-muted mb-4 leading-relaxed">Unlock advanced neural forecasting and unlimited traces.</p>
          <button className="w-full py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">Upgrade Now</button>
        </div>
      </div>
    </aside>
  );
}

function MetricBar({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    purple: "bg-accent-purple",
    cyan: "bg-accent-cyan",
    blue: "bg-accent-blue"
  };

  return (
    <div className="px-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 text-text-muted" />
          <span className="text-[10px] font-bold text-text-muted uppercase">{label}</span>
        </div>
        <span className="text-[10px] font-bold text-white">{value}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors[color])}
        />
      </div>
    </div>
  );
}
