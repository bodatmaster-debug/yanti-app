"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const NeuralBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random lines for the neural effect
  const lines = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x1: Math.random() * 100 + "%",
    y1: Math.random() * 100 + "%",
    x2: Math.random() * 100 + "%",
    y2: Math.random() * 100 + "%",
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.8] dark:opacity-[0.4]">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-slate-200 dark:text-slate-800"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0.5, 1, 0],
              opacity: [0, 0.6, 0.2, 0.6, 0],
              x1: [line.x1, (parseFloat(line.x1) + 1) + "%", line.x1],
              y2: [line.y2, (parseFloat(line.y2) - 1) + "%", line.y2],
            }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              delay: line.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      {/* Neural Nodes with Glow */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-2 h-2 bg-slate-200 dark:bg-slate-800 rounded-full shadow-[0_0_12px_rgba(148,163,184,0.6)] dark:shadow-[0_0_12px_rgba(30,41,59,0.8)]"
          initial={{ 
            x: Math.random() * 100 + "vw", 
            y: Math.random() * 100 + "vh",
            opacity: 0 
          }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.5, 0.5],
            y: [null, (Math.random() * -30) + "px"]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};