
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(err => console.error("Playback failed:", err));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#ff00ff] p-6 shadow-[0_0_30px_rgba(255,0,255,0.2)] relative">
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ffff]" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#00ffff]" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-black border-2 border-[#ff00ff] flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#ff00ff]/20 animate-pulse" />
          <Music className="text-[#ff00ff] w-10 h-10 relative z-10" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-2xl font-bold text-[#00ffff] truncate uppercase tracking-tighter animate-glitch">{currentTrack.title}</h3>
          <p className="text-sm text-[#ff00ff] font-mono uppercase tracking-[0.2em]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-black border-2 border-[#00ffff]/30 mb-8 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-[#00ffff]"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
        />
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-black/50" />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={skipBackward}
            className="p-2 text-[#00ffff]/50 hover:text-[#00ffff] transition-colors"
          >
            <SkipBack size={28} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-[#ff00ff] flex items-center justify-center text-white hover:bg-[#00ffff] hover:text-black transition-all transform active:scale-90 border-b-4 border-r-4 border-white/20"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={skipForward}
            className="p-2 text-[#00ffff]/50 hover:text-[#00ffff] transition-colors"
          >
            <SkipForward size={28} />
          </button>
        </div>

        <div className="flex flex-col items-end gap-1 text-[#ff00ff]/60 font-mono">
          <Volume2 size={20} />
          <span className="text-xs tracking-widest">{currentTrack.duration}</span>
        </div>
      </div>

      {/* Visualizer Mockup */}
      <div className="mt-8 flex items-end justify-between h-12 gap-1 border-t border-[#00ffff]/10 pt-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [
                Math.random() * 100 + '%', 
                Math.random() * 100 + '%', 
                Math.random() * 100 + '%'
              ] : '10%' 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.3 + Math.random() * 0.3,
              ease: "linear"
            }}
            className="flex-1 bg-[#ff00ff]/40"
          />
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
