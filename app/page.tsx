"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Shield, Zap, BarChart3, ChevronRight, Sparkles, Activity } from "lucide-react";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-purple/30 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-cyan/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-cyan">Neural Evolution v1.0</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-tight mb-8 leading-[1.1]">
              Understand Your <span className="bg-gradient-primary bg-clip-text text-transparent">Mind.</span><br />
              Predict Your <span className="text-white underline decoration-accent-purple decoration-4 underline-offset-8">Outcomes.</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Experience the world's most advanced cognitive journaling platform.
              Analyze emotional resonance and unlock predictive neural insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/auth">
                <Button size="lg" className="px-10 py-6 h-auto text-xl">
                  Start Exploring
                  <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="px-10 py-6 h-auto text-xl border-white/10">
                  View Analysis
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="mt-24 relative flex justify-center"
          >
            <div className="relative w-full max-w-2xl aspect-video glass-card border-white/10 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <NeuralSVG />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-8 left-8 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-accent-purple" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Cognitive Load</p>
                  <p className="text-lg font-bold font-heading">Optimal Range</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-32 bg-secondary/30 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">Intelligent by Design.</h2>
            <p className="text-xl text-text-muted font-light">A suite of quantum-grade tools designed to decode your inner world.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item}>
              <FeatureCard
                icon={BrainCircuit}
                title="Voice-to-Neural"
                description="Speak your thoughts naturally. Our AI extracts context, emotion, and key themes with 99% accuracy."
                color="purple"
              />
            </motion.div>
            <motion.div variants={item}>
              <FeatureCard
                icon={Zap}
                title="Predictive Outcomes"
                description="Forecast your future cognitive states based on historical emotional patterns and behavioral data."
                color="cyan"
              />
            </motion.div>
            <motion.div variants={item}>
              <FeatureCard
                icon={BarChart3}
                title="Deep Analytics"
                description="Visualize your mind's evolution with interactive neural graphs and sentiment distribution charts."
                color="blue"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-32 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-heading text-center mb-24">The MindTrace Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

            {[
              { step: "01", title: "Trace", desc: "Log thoughts via voice or text with high-fidelity emotional tagging." },
              { step: "02", title: "Analyze", desc: "Our neural engine identifies patterns and correlations across your history." },
              { step: "03", title: "Predict", desc: "Gain foresight into your mental performance and emotional well-being." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="w-20 h-20 rounded-full bg-background border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative group">
                  <div className="absolute inset-0 bg-accent-purple/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-3xl font-bold font-heading text-white relative z-10">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-text-muted leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-32">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-16 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8">Ready to decode your destiny?</h2>
            <Link href="/auth">
              <Button size="lg" className="px-12 py-6 h-auto text-xl">
                Start My Neural Trace
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <footer className="w-full py-20 border-t border-white/5 text-center text-text-muted">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold font-heading tracking-tight text-white">MindTrace</span>
        </div>
        <div className="flex justify-center gap-8 mb-8 text-sm uppercase tracking-widest font-bold">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Neural API</Link>
        </div>
        <p className="text-xs">&copy; 2024 MindTrace Labs. Developed for high-performance minds.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  const colors: any = {
    purple: "text-accent-purple bg-accent-purple/10 border-accent-purple/20",
    cyan: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20",
    blue: "text-accent-blue bg-accent-blue/10 border-accent-blue/20",
  };

  return (
    <Card className="hover:border-white/20 transition-all duration-500 hover:-translate-y-2 group">
      <div className={`p-4 rounded-2xl w-fit mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${colors[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-text-muted leading-relaxed font-light">{description}</p>
    </Card>
  );
}

function NeuralSVG() {
  return (
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
      <motion.circle
        cx="200" cy="150" r="40"
        stroke="var(--accent-purple)"
        strokeWidth="1"
        animate={{ r: [40, 45, 40], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        cx="100" cy="100" r="20"
        stroke="var(--accent-cyan)"
        strokeWidth="1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.circle
        cx="300" cy="80" r="15"
        stroke="var(--accent-blue)"
        strokeWidth="1"
      />
      <motion.circle
        cx="280" cy="220" r="25"
        stroke="var(--accent-purple)"
        strokeWidth="1"
      />
      <motion.circle
        cx="120" cy="240" r="18"
        stroke="var(--accent-cyan)"
        strokeWidth="1"
      />

      <motion.path
        d="M100 100 L200 150 M300 80 L200 150 M280 220 L200 150 M120 240 L200 150"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
    </svg>
  );
}
