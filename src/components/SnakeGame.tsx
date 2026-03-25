
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, speed]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black border-4 border-[#00ffff] rounded-none shadow-[0_0_30px_rgba(0,255,255,0.3)] relative">
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#ff00ff]" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ff00ff]" />
      
      <div className="flex justify-between w-full mb-6 px-2">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.3em] text-[#00ffff]/60 font-mono">DATA_FRAGS</span>
          <span className="text-4xl font-bold text-[#00ffff] font-mono leading-none">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-[0.3em] text-[#ff00ff]/60 font-mono">MAX_SYNC</span>
          <span className="text-4xl font-bold text-[#ff00ff] font-mono leading-none">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative bg-[#050505] border-2 border-[#00ffff]/30 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#00ffff]/10" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1,
            }}
            className={`w-full h-full ${
              i === 0 
                ? 'bg-[#00ffff] shadow-[0_0_15px_#00ffff]' 
                : 'bg-[#00ffff]/60'
            }`}
          />
        ))}

        {/* Food */}
        <div
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
          className="bg-[#ff00ff] shadow-[0_0_20px_#ff00ff] animate-pulse"
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-5xl font-black text-[#ff00ff] mb-4 tracking-tighter uppercase animate-glitch">CRITICAL_FAILURE</h2>
                  <p className="text-[#00ffff] mb-8 font-mono text-xl">SYNC_LOSS: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-10 py-4 bg-[#00ffff] text-black font-bold text-xl uppercase tracking-widest hover:bg-[#ff00ff] hover:text-white transition-all transform active:scale-95 border-b-4 border-r-4 border-white/20"
                  >
                    RE_INITIALIZE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-5xl font-black text-[#00ffff] mb-8 tracking-tighter uppercase animate-glitch">HALT_STATE</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-4 bg-[#ff00ff] text-white font-bold text-xl uppercase tracking-widest hover:bg-[#00ffff] hover:text-black transition-all transform active:scale-95 border-b-4 border-r-4 border-white/20"
                  >
                    RESUME_SYNC
                  </button>
                  <p className="mt-6 text-[#00ffff]/40 text-sm font-mono uppercase tracking-widest">CMD: [SPACE] TO TOGGLE</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-8 text-xs font-mono text-[#00ffff]/40 uppercase tracking-[0.2em]">
        <span>[ARROWS]: NAVIGATE</span>
        <span>[SPACE]: INTERRUPT</span>
      </div>
    </div>
  );
};

export default SnakeGame;
