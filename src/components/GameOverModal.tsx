import React from 'react';
import { Trophy, Skull, RotateCcw, ArrowRight } from 'lucide-react';

interface GameOverModalProps {
  isWon: boolean;
  isOver: boolean;
  score: number;
  bestScore: number;
  highestTile: number;
  onRestart: () => void;
  onKeepPlaying: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isWon,
  isOver,
  score,
  bestScore,
  highestTile,
  onRestart,
  onKeepPlaying,
}) => {
  if (!isWon && !isOver) return null;

  return (
    <div className="absolute inset-0 z-30 rounded-2xl bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-scale-in">
      <div className="w-full max-w-xs text-center space-y-4">
        {/* Status Icon */}
        <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center border shadow-lg">
          {isWon ? (
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(236,72,153,0.8)] animate-bounce">
              <Trophy className="w-7 h-7" />
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-900 to-slate-900 border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <Skull className="w-7 h-7" />
            </div>
          )}
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-2xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300">
            {isWon ? 'YOU WON ２０４８' : 'GAME OVER'}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {isWon
              ? 'You reached the legendary 2048 vaporwave tile!'
              : 'No more moves possible on the grid.'}
          </p>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono">
              Final Score
            </span>
            <span className="text-base font-orbitron font-bold text-white tabular-nums">
              {score}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-mono">
              Highest Tile
            </span>
            <span className="text-base font-orbitron font-bold text-cyan-300 tabular-nums">
              {highestTile}
            </span>
          </div>
        </div>

        {score > bestScore && (
          <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 rounded-lg py-1 px-2">
            ★ New Personal Best! ★
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {isWon && (
            <button
              onClick={onKeepPlaying}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5"
            >
              <span>Keep Going</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 active:scale-95 transition-all shadow-[0_0_15px_rgba(219,39,119,0.4)] flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
