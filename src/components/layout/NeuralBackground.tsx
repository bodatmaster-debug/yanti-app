
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
  const lines = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x1: Math.random() * 100 + "%",
    y1: Math.random() * 100 + "%",
    x2: Math.random() * 100 + "%",
    y2: Math.random() * 100 + "%",
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.4] dark:opacity-[0.2]">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
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
            strokeWidth="0.5"
            className="text-slate-200 dark:text-slate-800"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
              x1: [line.x1, (parseFloat(line.x1) + 5) + "%", line.x1],
              y2: [line.y2, (parseFloat(line.y2) - 5) + "%", line.y2],
            }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              delay: line.delay,
              ease: "linear",
            }}
          />
        ))}
      </svg>
      {/* Neural Nodes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"
          initial={{ 
            x: Math.random() * 100 + "vw", 
            y: Math.random() * 100 + "vh",
            opacity: 0 
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};
