import React, { useEffect, useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, Monitor } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  moves: number;
  canUndo: boolean;
  isMuted: boolean;
  crtEnabled: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  onToggleMute: () => void;
  onToggleCrt: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  bestScore,
  moves,
  canUndo,
  isMuted,
  crtEnabled,
  onNewGame,
  onUndo,
  onToggleMute,
  onToggleCrt,
}) => {
  const [scoreDiff, setScoreDiff] = useState<number | null>(null);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    if (score > prevScore) {
      setScoreDiff(score - prevScore);
      const timer = setTimeout(() => {
        setScoreDiff(null);
      }, 700);
      setPrevScore(score);
      return () => clearTimeout(timer);
    }
    setPrevScore(score);
  }, [score, prevScore]);

  return (
    <div className="w-full max-w-[420px] mx-auto space-y-3">
      {/* Top HUD: Score & Best Score Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Current Score */}
        <div className="relative rounded-xl bg-slate-900/80 border border-fuchsia-500/30 p-2.5 backdrop-blur-sm shadow-[0_0_15px_rgba(217,70,239,0.15)] flex flex-col justify-between">
          <span className="text-[10px] tracking-wider uppercase text-fuchsia-400 font-mono-code font-bold">
            Score
          </span>
          <div className="relative">
            <span className="text-xl sm:text-2xl font-orbitron font-extrabold text-white tracking-wide tabular-nums">
              {score}
            </span>
            {scoreDiff !== null && (
              <span className="absolute -top-3 right-0 text-xs font-mono font-bold text-cyan-300 animate-bounce">
                +{scoreDiff}
              </span>
            )}
          </div>
        </div>

        {/* High Score */}
        <div className="rounded-xl bg-slate-900/80 border border-cyan-500/30 p-2.5 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.15)] flex flex-col justify-between">
          <span className="text-[10px] tracking-wider uppercase text-cyan-400 font-mono-code font-bold">
            Best
          </span>
          <span className="text-xl sm:text-2xl font-orbitron font-extrabold text-cyan-200 tracking-wide tabular-nums">
            {bestScore}
          </span>
        </div>

        {/* Moves Count */}
        <div className="rounded-xl bg-slate-900/80 border border-purple-500/30 p-2.5 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)] flex flex-col justify-between">
          <span className="text-[10px] tracking-wider uppercase text-purple-400 font-mono-code font-bold">
            Moves
          </span>
          <span className="text-xl sm:text-2xl font-orbitron font-extrabold text-purple-200 tracking-wide tabular-nums">
            {moves}
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {/* New Game Button */}
          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 active:scale-95 transition-all shadow-[0_0_12px_rgba(219,39,119,0.3)] whitespace-nowrap"
            title="Start New Game"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>New Game</span>
          </button>

          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
              canUndo
                ? 'border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-950/40 active:scale-95'
                : 'border-white/5 text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title="Undo Last Move"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* CRT effect toggle */}
          <button
            onClick={onToggleCrt}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              crtEnabled
                ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                : 'border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
            title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>

          {/* Audio Mute / Unmute */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              !isMuted
                ? 'border-pink-400 bg-pink-950/50 text-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.4)]'
                : 'border-white/10 text-slate-500 hover:text-slate-300'
            }`}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
