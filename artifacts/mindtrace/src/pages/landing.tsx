import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit, Sparkles, Activity, Shield, ArrowRight,
  BookOpen, BarChart3, Mic, TrendingUp, Lock, Zap, Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Cognitive Journaling",
    description: "Capture thoughts with your voice or keyboard. A frictionless space designed to help you reflect without distraction.",
    iconColor: "text-primary",
    iconBg: "from-primary/20 to-primary/5",
    border: "border-primary/25",
    glow: "hover:shadow-[0_0_40px_hsl(250_82%_70%/0.18)]",
    tag: "Core Feature",
  },
  {
    icon: Activity,
    title: "Emotion Tracking",
    description: "Label how you feel, rate its intensity, and watch your emotional patterns emerge beautifully over time.",
    iconColor: "text-teal-400",
    iconBg: "from-teal-400/20 to-teal-400/5",
    border: "border-teal-400/25",
    glow: "hover:shadow-[0_0_40px_rgba(51,194,168,0.18)]",
    tag: "10 Emotions",
  },
  {
    icon: BarChart3,
    title: "Personal Analytics",
    description: "Understand which emotions dominate your days and exactly when your cognitive load peaks.",
    iconColor: "text-sky-400",
    iconBg: "from-sky-400/20 to-sky-400/5",
    border: "border-sky-400/25",
    glow: "hover:shadow-[0_0_40px_rgba(56,189,248,0.18)]",
    tag: "Visual Insights",
  },
];

const STEPS = [
  { num: "01", icon: Mic, title: "Log a thought", desc: "Type or speak it aloud. Takes less than 60 seconds.", color: "text-primary", bg: "bg-primary/15", border: "border-primary/30", glow: "shadow-[0_0_28px_hsl(250_82%_70%/0.25)]" },
  { num: "02", icon: Activity, title: "Tag your emotion", desc: "Pick from ten emotions and rate its intensity 1–10.", color: "text-teal-400", bg: "bg-teal-400/15", border: "border-teal-400/30", glow: "shadow-[0_0_28px_rgba(51,194,168,0.25)]" },
  { num: "03", icon: TrendingUp, title: "See the pattern", desc: "Your timeline and analytics reveal insights over time.", color: "text-sky-400", bg: "bg-sky-400/15", border: "border-sky-400/30", glow: "shadow-[0_0_28px_rgba(56,189,248,0.25)]" },
];

const STATS = [
  { value: "10", label: "Emotion types", icon: Activity },
  { value: "60s", label: "To log a thought", icon: Zap },
  { value: "100%", label: "Private & yours", icon: Lock },
  { value: "3", label: "Steps to insight", icon: Star },
];

const TRUST_BADGES = [
  { icon: Lock,    label: "End-to-end privacy" },
  { icon: Zap,     label: "Instant access" },
  { icon: Shield,  label: "Zero tracking" },
  { icon: CheckCircle2, label: "No credit card" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const heroFade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" as const, delay },
});

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [countsReady, setCountsReady] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setCountsReady(true), 350);
    return () => window.clearTimeout(id);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${((i * 41) % 100) + 1}%`,
        delay: `${(i % 6) * 0.8}s`,
        duration: `${10 + (i % 5) * 3}s`,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">

      {/* ── Deep atmospheric orbs ── */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
        <div className="absolute -top-72 -left-72 w-[900px] h-[900px] rounded-full bg-primary/14 blur-[160px]" />
        <div className="absolute top-1/3 -right-80 w-[700px] h-[700px] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/8 blur-[150px]" />
        <div className="absolute top-2/3 left-2/3 w-[400px] h-[400px] rounded-full bg-sky-500/6 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[140px]" style={{background:"hsl(330 80% 68%)"}} />
      </div>

      {/* ── Dot grid ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, hsl(220 18% 92%) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        aria-hidden
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute w-[2px] h-[2px] rounded-full bg-white/20 animate-[particle-float_linear_infinite]"
            style={{
              left: particle.left,
              bottom: "-5%",
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-background/70 backdrop-blur-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            : "border-white/[0.06] bg-background/40 backdrop-blur-lg"
        }`}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary/40 to-accent/25 border border-primary/35 flex items-center justify-center shadow-[0_0_18px_hsl(250_82%_70%/0.4)]">
              <BrainCircuit className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight font-heading">MindTrace</span>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/sign-in">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-white/5 text-sm h-9 px-4">
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm" className="hero-btn get-started-pulse text-white text-sm font-semibold px-5 h-9 rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">

        {/* ════════════════════════════
            HERO
        ════════════════════════════ */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 max-w-5xl mx-auto w-full">
          <div className="w-full flex flex-col items-center">

            <motion.div {...heroFade(0.05)} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/12 border border-primary/25 text-primary text-xs font-bold tracking-[0.18em] uppercase shadow-[0_0_30px_hsl(250_82%_70%/0.2)] backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Private cognitive journaling
              </span>
            </motion.div>

            <motion.h1
              {...heroFade(0.12)}
              className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.02] mb-7 font-heading"
            >
              Understand
              <br />
              <span style={{
                background: 'linear-gradient(135deg, hsl(250 82% 72%) 0%, hsl(172 60% 55%) 60%, hsl(200 78% 65%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: "0 0 24px rgba(124,58,237,0.35)",
              }}>
                your mind.
              </span>
            </motion.h1>

            <motion.p {...heroFade(0.2)} className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed mb-5">
              A calm, intentional space to log your thoughts, track emotional patterns, and build a clearer picture of how you think.
            </motion.p>

            <motion.p {...heroFade(0.26)} className="text-sm text-primary/70 mb-10 font-medium">
              No credit card · No ads · 100% private
            </motion.p>

            <motion.div {...heroFade(0.32)} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
              <Link to="/sign-up">
                <Button size="lg" className="group h-13 px-9 text-base font-bold hero-btn text-white rounded-2xl flex items-center gap-2.5 shadow-[0_8px_30px_hsl(250_82%_70%/0.45)]">
                  Start Your Journal
                  <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-9 text-base font-medium rounded-2xl border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 text-foreground transition-all"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* ── Stats strip ── */}
            <motion.div {...heroFade(0.4)} className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass-card p-5 text-center group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                >
                  <div className="text-3xl font-bold font-heading mb-1" style={{
                    background: 'linear-gradient(135deg, hsl(250 82% 72%), hsl(172 60% 55%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {countsReady
                      ? s.value
                      : s.value.includes("%")
                        ? "0%"
                        : s.value.includes("s")
                          ? "0s"
                          : "0"}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Gradient separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-12" />

        {/* ════════════════════════════
            FEATURES
        ════════════════════════════ */}
        <section className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp(0)} className="text-center mb-20">
              <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-4 px-3 py-1 rounded-full bg-primary/8 border border-primary/15">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight">
                Built for clarity,
                <br />
                <span className="text-muted-foreground font-normal">not clutter</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
                Every feature deepens self-understanding. Nothing more.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  {...fadeUp(0.08 * i)}
                  className={`feature-card group p-8 cursor-default ${f.glow} transition-all duration-300`}
                >
                  <div className="mb-2">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-gradient-to-r ${f.iconBg} border ${f.border} ${f.iconColor}`}>
                      {f.tag}
                    </span>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl border bg-gradient-to-br ${f.iconBg} ${f.border} flex items-center justify-center mt-5 mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${f.iconColor}`}>
                    <f.icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-bold text-base mb-2.5 font-heading">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-primary opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <span className="font-semibold">Learn more</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mx-12" />

        {/* ════════════════════════════
            HOW IT WORKS
        ════════════════════════════ */}
        <section className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp(0)} className="text-center mb-20">
              <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-accent mb-4 px-3 py-1 rounded-full bg-accent/8 border border-accent/15">
                How it works
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                Three steps to
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, hsl(250 82% 72%), hsl(172 60% 55%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  self-awareness
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-[3.25rem] left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-px bg-gradient-to-r from-primary/40 via-accent/60 to-primary/40" />

              {STEPS.map((s, i) => (
                <motion.div key={s.num} {...fadeUp(0.12 * i)} className="flex flex-col items-center text-center group">
                  <div className="relative mb-7">
                    <div className={`absolute inset-0 rounded-full blur-2xl ${s.bg} opacity-60 scale-110`} />
                    <div className={`relative w-[6.5rem] h-[6.5rem] rounded-full border ${s.border} ${s.bg} flex items-center justify-center ${s.glow} z-10 transition-transform duration-300 group-hover:scale-105`}>
                      <s.icon className={`w-8 h-8 ${s.color}`} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-card border border-card-border flex items-center justify-center">
                      <span className="text-[9px] font-mono font-bold text-muted-foreground">{s.num}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2.5 font-heading">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mx-12" />

        {/* ════════════════════════════
            PRIVACY CTA
        ════════════════════════════ */}
        <section className="py-28 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-3xl border border-primary/20 shadow-[0_0_0_1px_hsl(250_82%_70%/0.06),0_32px_80px_rgba(0,0,0,0.5)] p-14 text-center">
              {/* Background fill */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/80 to-accent/8 pointer-events-none" />
              {/* Inner orbs */}
              <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-accent/12 blur-[70px] pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/35 to-accent/20 border border-primary/35 flex items-center justify-center mx-auto mb-8 shadow-[0_0_32px_hsl(250_82%_70%/0.4)]">
                  <Shield className="w-7 h-7 text-primary" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-5 font-heading">Your thoughts stay yours</h2>
                <p className="text-muted-foreground mb-10 leading-relaxed max-w-md mx-auto text-base">
                  Everything is private, secured behind your account. No ads. No data selling. Just you and your thoughts.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10">
                  {TRUST_BADGES.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="w-3.5 h-3.5 text-accent" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <Link to="/sign-up">
                  <Button size="lg" className="h-13 px-10 text-base font-bold hero-btn text-white rounded-2xl shadow-[0_8px_30px_hsl(250_82%_70%/0.4)]">
                    Start for Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.06] py-8 px-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground text-xs">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-foreground/60 font-heading">MindTrace</span>
              <span className="text-muted-foreground/50">·</span>
              <span>Your private cognitive journal</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy first</span>
              <span className="text-muted-foreground/30">·</span>
              <span>Zero tracking</span>
              <span className="text-muted-foreground/30">·</span>
              <span>Always free</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
