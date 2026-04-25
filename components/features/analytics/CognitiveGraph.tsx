"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function CognitiveGraph() {
  // Placeholder for a neural/cognitive graph visualization
  return (
    <Card className="h-[400px] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 opacity-50" />
      <div className="relative z-10 text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-32 h-32 rounded-full border-2 border-accent-purple/30 flex items-center justify-center mb-4"
        >
          <div className="w-24 h-24 rounded-full border border-accent-cyan/40" />
        </motion.div>
        <p className="text-sm font-heading font-bold uppercase tracking-widest text-text-muted">
          Neural Connectivity Map
        </p>
        <p className="text-[10px] text-text-muted mt-2">Visualizing thought patterns and clusters...</p>
      </div>

      {/* Random dots to simulate nodes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: Math.random() * 2 }}
          className="absolute w-1 h-1 bg-accent-purple rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </Card>
  );
}
