import { useState } from "react";
import { useSafeAuth, useSafeUser } from "@/components/safe-clerk-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Trash2, LogOut, User, Shield, Palette } from "lucide-react";
import {
  useClearMemory,
  getListThoughtsQueryKey,
  getGetDashboardSummaryQueryKey,
  getGetAnalyticsQueryKey,
  getGetTimelineQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
});

export default function SettingsPage() {
  const user = useSafeUser();
  const auth = useSafeAuth();
  const signOut = async () => {
    await Promise.resolve(auth?.signOut?.());
    window.location.href = "/";
  };
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDark, setIsDark] = useState(
    () => !document.documentElement.classList.contains("dark")
  );

  const clearMemory = useClearMemory();

  const handleClearMemory = async () => {
    try {
      await clearMemory.mutateAsync();
      await queryClient.resetQueries();
      toast({ title: "Memory Cleared", description: "All thoughts have been permanently deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to clear memory.", variant: "destructive" });
    }
  };

  const handleThemeToggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", !next);
    localStorage.setItem("mindtrace-theme", next ? "dark" : "light");
  };

  return (
    <div className="space-y-5 pb-10 max-w-xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and preferences</p>
      </motion.div>

      {/* ── Profile ── */}
      <motion.div {...stagger(1)} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">Profile</h3>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user?.primaryEmailAddress?.emailAddress || 'you@example.com'}
                className="w-16 h-16 rounded-2xl ring-2 ring-primary/25 ring-offset-2 ring-offset-background"
                data-testid="img-avatar"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/25 flex items-center justify-center"
                data-testid="img-avatar-placeholder"
              >
                <span className="text-2xl font-bold text-primary">{user?.firstName?.[0] || "?"}</span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
          </div>
          <div>
            <p className="font-semibold text-base" data-testid="text-name">
              {user?.fullName || user?.firstName || "Anonymous"}
            </p>
            <p className="text-muted-foreground text-sm mt-0.5" data-testid="text-email">
              {user?.primaryEmailAddress?.emailAddress || "No email"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Member since</p>
            <p className="text-sm font-medium" data-testid="text-joined">
              {user?.createdAt
                ? new Date(user.createdAt as string | number).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : "—"}
            </p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Last sign in</p>
            <p className="text-sm font-medium" data-testid="text-last-signin">
              {user?.lastSignInAt ? new Date(user.lastSignInAt as string | number).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Appearance ── */}
      <motion.div {...stagger(2)} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h3 className="font-semibold text-sm">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{isDark ? "Dark Mode" : "Light Mode"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isDark ? "Deep, rich, futuristic" : "Soft, airy, elegant"}
            </p>
          </div>
          <button
            onClick={handleThemeToggle}
            data-testid="switch-theme"
            className={`relative w-20 h-10 rounded-2xl border transition-all duration-300 flex items-center px-1 gap-1 overflow-hidden ${
              isDark
                ? "bg-primary/20 border-primary/30"
                : "bg-amber-500/20 border-amber-500/30"
            }`}
          >
            <motion.div
              animate={{ x: isDark ? 0 : 40 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDark ? "bg-primary shadow-[0_0_10px_hsl(250_82%_70%/0.5)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              }`}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="moon" initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Moon className="w-4 h-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -30, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Sun className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* ── Account ── */}
      <motion.div {...stagger(3)} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-accent" />
          </div>
          <h3 className="font-semibold text-sm">Account</h3>
        </div>
        <Button
          variant="outline"
          onClick={() => signOut()}
          className="w-full border-card-border text-muted-foreground hover:text-foreground hover:border-white/20 rounded-xl h-10 text-sm transition-all"
          data-testid="button-sign-out"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </motion.div>

      {/* ── Danger Zone ── */}
      <motion.div {...stagger(4)} className="glass-card p-5 border-red-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </div>
          <h3 className="font-semibold text-sm text-red-400">Danger Zone</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          These actions are permanent and cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl h-10 text-sm transition-all"
              data-testid="button-clear-all"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Thoughts
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-red-500/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-400">Clear All Thoughts?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will permanently delete every thought you've logged in MindTrace. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-card-border">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearMemory}
                disabled={clearMemory.isPending}
                className="bg-red-500 hover:bg-red-600 text-white border-0"
              >
                {clearMemory.isPending ? "Clearing…" : "Clear Everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}
