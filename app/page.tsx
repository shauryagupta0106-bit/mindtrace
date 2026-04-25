"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Shield, Zap, BarChart3, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent-purple/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent-cyan/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Understand Your Mind. <br />
              <span className="text-accent-purple">Predict Your Outcomes.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              MindTrace is a premium cognitive journaling SaaS that uses AI to track emotional patterns and predict cognitive states.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth">
                <Button size="lg" className="h-14 px-8 text-lg font-bold">
                  Start Exploring
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold">
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Abstract Neural Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-20 relative h-[400px] flex items-center justify-center"
          >
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse" />
              <BrainCircuit className="w-full h-full text-white/10" strokeWidth={0.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full shadow-glow-purple animate-ping" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">Intelligent by Design.</h2>
            <p className="text-text-muted">A suite of tools designed to decode your inner world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BrainCircuit}
              title="Voice-to-Neural"
              description="Speak your thoughts naturally. Our AI extracts context, emotion, and key themes in real-time."
            />
            <FeatureCard
              icon={Zap}
              title="Cognitive Prediction"
              description="Forecast your future cognitive states based on historical emotional patterns and data."
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Visualize your mind's evolution with interactive graphs and sentiment distribution charts."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Trace", desc: "Log thoughts via voice or text with high-fidelity emotional tagging." },
              { step: "02", title: "Analyze", desc: "Our neural engine identifies patterns and correlations across your history." },
              { step: "03", title: "Predict", desc: "Gain foresight into your mental performance and emotional well-being." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="text-4xl font-bold font-heading text-accent-purple/20 mb-4">{item.step}</span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full py-12 border-t border-white/5 text-center text-text-muted text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BrainCircuit className="w-5 h-5 text-accent-purple" />
          <span className="font-bold font-heading tracking-tight text-white">MindTrace</span>
        </div>
        <p>&copy; 2024 MindTrace. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <Card className="hover:border-white/20 transition-colors">
      <div className="p-3 bg-white/5 rounded-xl w-fit mb-6">
        <Icon className="w-6 h-6 text-accent-purple" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </Card>
  );
}
