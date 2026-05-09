import { Link, useLocation, useNavigate } from "react-router-dom";
import { SafeUserButton } from "@/components/safe-clerk-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BrainCircuit, PlusCircle,
  History, BarChart3, Settings, Menu, X, LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSafeAuth } from "@/components/safe-clerk-provider";

const NAV_ITEMS = [
  { to: "/dashboard",   icon: LayoutDashboard, label: "Dashboard" },
  { to: "/thoughts",    icon: BrainCircuit,    label: "Thoughts" },
  { to: "/new-thought", icon: PlusCircle,      label: "New Thought", primary: true },
  { to: "/timeline",    icon: History,         label: "Timeline" },
  { to: "/analytics",  icon: BarChart3,        label: "Analytics" },
  { to: "/settings",   icon: Settings,         label: "Settings" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useSafeAuth();

  const handleLogout = () => {
    signOut({ redirectUrl: '/' });
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">

      {/* ── Atmospheric background orbs (full canvas) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-[350px] h-[350px] rounded-full bg-accent/7 blur-[90px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[130px]" style={{background:"hsl(330 80% 68%)"}} />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/6 blur-[100px]" />
      </div>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/5 bg-sidebar/95 backdrop-blur-xl shrink-0 relative">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-2.5 group outline-none">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary/40 to-accent/25 border border-primary/35 flex items-center justify-center shrink-0 shadow-[0_0_14px_hsl(250_82%_70%/0.35)] group-hover:shadow-[0_0_22px_hsl(250_82%_70%/0.5)] transition-all duration-300">
              <BrainCircuit className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-foreground font-heading">
              MindTrace
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className="outline-none block">
                {item.primary ? (
                  <div className="mt-3 mb-1 relative group">
                    <div className="hero-btn flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm",
                      isActive
                        ? "bg-primary/15 text-primary font-semibold border border-primary/25 shadow-[inset_0_1px_0_hsl(250_82%_70%/0.15)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-0.5 h-6 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                    )}
                    <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
                    <span>{item.label}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[hsl(330_80%_66%/0.08)] to-transparent border border-[hsl(330_80%_66%/0.2)] hover:border-[hsl(330_80%_66%/0.4)] hover:from-[hsl(330_80%_66%/0.15)] text-[hsl(330_80%_75%)] hover:text-white transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[hsl(330_80%_66%/0.15)] group-hover:bg-[hsl(330_80%_66%/0.25)] transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold tracking-wide">Log Out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background/80 backdrop-blur-xl z-20">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/35 to-accent/20 border border-primary/30 flex items-center justify-center shadow-[0_0_10px_hsl(250_82%_70%/0.3)]">
              <BrainCircuit className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-bold text-sm font-heading">MindTrace</span>
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.14 }}
              className="md:hidden absolute top-14 left-0 right-0 glass-card rounded-none border-x-0 border-t-0 p-3 flex flex-col gap-1 z-30"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-primary/10 hover:text-primary",
                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"
                  )}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="max-w-5xl mx-auto pb-24 md:pb-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/5 bg-background/90 backdrop-blur-xl px-2 py-2 flex justify-around items-center z-20">
          {NAV_ITEMS.filter((i) => !i.primary).slice(0, 4).map((item) => (
            <Link key={item.to} to={item.to} className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-primary/10 hover:text-primary",
              location.pathname === item.to ? "bg-primary/15 text-primary" : "text-muted-foreground"
            )}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            to="/new-thought"
            className="absolute -top-5 left-1/2 -translate-x-1/2 p-3.5 rounded-full text-white hero-btn shadow-[0_0_20px_hsl(250_82%_70%/0.5)] hover:brightness-110 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
