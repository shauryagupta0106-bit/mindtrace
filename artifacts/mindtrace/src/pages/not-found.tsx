import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-primary/10 blur-[110px]" />
      <div className="absolute -bottom-32 -right-20 w-[460px] h-[460px] rounded-full bg-accent/10 blur-[110px]" />

      <div className="glass-card w-full max-w-lg p-8 sm:p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <BrainCircuit className="w-4 h-4 text-primary" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">MindTrace</p>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">404 Page Not Found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This route does not exist yet. Let&apos;s get you back to your journal.
        </p>

        <Link to="/">
          <Button className="hero-btn text-white rounded-xl h-10 px-5">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
