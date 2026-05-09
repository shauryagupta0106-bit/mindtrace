import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { useLocalAuthContext } from "@/lib/local-auth-context";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function LocalSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useLocalAuthContext();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    signIn(email, password);
    navigate("/dashboard");
  };

  const [isClerkLoading, setIsClerkLoading] = useState(false);
  
  const handleGoogleSignIn = async () => {
    // Try to use Clerk's OAuth flow by redirecting to Clerk's hosted sign-in if enabled
    const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (clerkKey && !clerkKey.includes("disabled")) {
      setIsClerkLoading(true);
      // We can use Clerk's vanilla JS or just redirect to the auth page
      // But since we have clerk enabled, if the user reached here, maybe it's because
      // they explicitly went to a route. Let's redirect to Clerk's oauth endpoint.
      // The easiest way is to let the Clerk UI handle it, so we redirect to /sign-in
      // which will render the Clerk UI.
      window.location.href = "/sign-in";
      return;
    }

    // Fallback to Firebase / local
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Update local auth state with the Firebase user
      signIn(user.email || "demo-google@example.com", "oauth-mock-key");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not sign in with Google. Ensure Firebase is configured.",
        variant: "destructive"
      });
      
      // Fallback for demo purposes if firebase isn't configured yet
      if (error.code === 'auth/invalid-api-key') {
        signIn("demo-google@example.com", "oauth-mock-key");
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-primary/12 blur-[110px]" />
      <div className="absolute -bottom-32 -right-20 w-[460px] h-[460px] rounded-full bg-accent/10 blur-[110px]" />

      <div className="w-full max-w-md glass-card p-7 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.55)] relative overflow-hidden">
        {/* Soft bottom edge glow matching the screenshot */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none" />
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/35 to-accent/20 border border-primary/35 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold">MindTrace</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">Sign in to Mind Trace</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Please sign in to continue</p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/35 bg-red-500/10 text-red-300 text-sm px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-foreground/85 hover:bg-white/[0.05] flex items-center justify-center gap-2 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="text-xs text-muted-foreground text-center">or</div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full h-10 rounded-xl bg-input border border-white/10 px-3 text-sm outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-10 rounded-xl bg-input border border-white/10 px-3 text-sm outline-none focus:border-primary/50"
            />
          </div>

          <button type="submit" className="w-full h-10 rounded-xl hero-btn text-white text-sm font-semibold flex items-center justify-center gap-1.5">
            Continue <span className="text-[10px]">▸</span>
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-primary hover:text-primary/80 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
