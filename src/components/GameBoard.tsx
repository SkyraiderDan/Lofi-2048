import React, { useRef } from 'react';
import { TileData, Direction, MergeEvent } from '../types';
import { Tile } from './Tile';
import { ParticleCanvas } from './ParticleCanvas';

interface GameBoardProps {
  tiles: TileData[];
  onMove: (direction: Direction) => void;
  isGameOver: boolean;
  mergeEvents: MergeEvent[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  tiles,
  onMove,
  isGameOver,
  mergeEvents,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isGameOver) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isGameOver) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Minimum swipe threshold
    if (Math.max(absDx, absDy) < 25) return;

    if (absDx > absDy) {
      onMove(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      onMove(dy > 0 ? 'DOWN' : 'UP');
    }
  };

  // Generate 16 static background slots (4x4)
  const emptyCells = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    row: Math.floor(i / 4),
    col: i % 4,
  }));

  return (
    <div
      className="relative w-full max-w-[420px] aspect-square mx-auto p-2 sm:p-3 rounded-2xl bg-slate-950/80 border border-fuchsia-500/30 backdrop-blur-md shadow-[0_0_35px_rgba(217,70,239,0.25)] select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative neon corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-fuchsia-400 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-fuchsia-400 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-lg pointer-events-none" />

      {/* Grid container with relative positioning */}
      <div className="relative w-full h-full">
        {/* Static empty cell backdrops */}
        <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-2 sm:gap-3 p-0.5">
          {emptyCells.map((cell) => (
            <div
              key={cell.id}
              className="rounded-xl bg-purple-950/30 border border-cyan-500/15 flex items-center justify-center transition-colors shadow-inner"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/20" />
            </div>
          ))}
        </div>

        {/* Dynamic tiles overlaying exact grid coordinates */}
        <div className="absolute inset-0 pointer-events-none">
          {tiles.map((tile) => (
            <Tile key={tile.id} tile={tile} />
          ))}
        </div>

        {/* Dynamic Particle Canvas for spark and firework effects */}
        <ParticleCanvas mergeEvents={mergeEvents} />
      </div>
    </div>
  );
};
