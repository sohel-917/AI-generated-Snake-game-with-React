/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ffff] font-sans selection:bg-[#ff00ff]/30 relative">
      {/* CRT Effects */}
      <div className="noise-bg" />
      <div className="scanline" />
      <div className="crt-overlay" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen gap-12">
        <header className="text-center mb-8 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-[#ff00ff] font-mono tracking-[0.5em] uppercase opacity-50"
          >
            System.Initialize(NEON_BEATS_v1.0.4)
          </motion.div>
          
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase animate-glitch"
          >
            <span className="text-[#ff00ff]">NEON</span>
            <span className="text-[#00ffff]">BEATS</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center justify-center gap-4 text-[#00ffff]/60 font-mono text-xs uppercase tracking-[0.4em]"
          >
            <span className="animate-pulse">[SNAKE_MODULE]</span>
            <span className="w-1 h-1 bg-[#ff00ff] rounded-full" />
            <span className="animate-pulse">[AUDIO_STREAM]</span>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full max-w-7xl">
          {/* Left Sidebar - Cryptic Status */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            <div className="p-6 bg-black border-2 border-[#00ffff]/20 rounded-none relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff]/20 group-hover:bg-[#00ffff] transition-colors" />
              <h4 className="text-xl font-bold text-[#ff00ff] uppercase tracking-widest mb-6 animate-glitch">TERMINAL_CMD</h4>
              <ul className="text-sm space-y-4 font-mono">
                <li className="flex justify-between border-b border-[#00ffff]/10 pb-2">
                  <span className="text-[#00ffff]/50">INPUT:</span> 
                  <span className="text-[#00ffff]">DIR_KEYS</span>
                </li>
                <li className="flex justify-between border-b border-[#00ffff]/10 pb-2">
                  <span className="text-[#00ffff]/50">INTERRUPT:</span> 
                  <span className="text-[#00ffff]">SPACE_BAR</span>
                </li>
                <li className="flex justify-between border-b border-[#00ffff]/10 pb-2">
                  <span className="text-[#00ffff]/50">SYNC:</span> 
                  <span className="text-[#00ffff]">ACTIVE</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6 bg-black border-2 border-[#ff00ff]/20 rounded-none">
              <h4 className="text-xl font-bold text-[#00ffff] uppercase tracking-widest mb-4 animate-glitch">LOG_STREAM</h4>
              <div className="space-y-2 font-mono text-[10px]">
                <p className="text-green-500">{">"} CONNECTION_STABLE</p>
                <p className="text-yellow-500 animate-pulse">{">"} BUFFERING_NEURAL_DATA...</p>
                <p className="text-[#ff00ff]">{">"} ENTROPY_LEVEL: 0.42</p>
                <p className="text-cyan-500">{">"} GRID_SYNC_COMPLETE</p>
              </div>
            </div>
          </motion.div>

          {/* Center - Snake Game */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-6 flex justify-center relative"
          >
            <div className="absolute -inset-4 border border-[#00ffff]/10 pointer-events-none" />
            <div className="absolute -inset-8 border border-[#ff00ff]/5 pointer-events-none" />
            <SnakeGame />
          </motion.div>

          {/* Right Sidebar - Music Player */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3 flex flex-col gap-8"
          >
            <MusicPlayer />
            
            <div className="p-6 bg-[#ff00ff]/5 border-2 border-[#ff00ff]/20 rounded-none relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#ff00ff]" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#ff00ff]" />
              <p className="text-xs text-[#ff00ff] font-mono leading-relaxed uppercase tracking-tighter">
                WARNING: PROLONGED EXPOSURE TO THE GRID MAY RESULT IN TEMPORAL DISPLACEMENT. CONSUME DATA FRAGMENTS TO MAINTAIN COHERENCE.
              </p>
            </div>
          </motion.div>
        </div>

        <footer className="mt-12 text-[#00ffff]/30 text-[10px] font-mono uppercase tracking-[1em] animate-pulse">
          [END_OF_TRANSMISSION]
        </footer>
      </main>
    </div>
  );
}
