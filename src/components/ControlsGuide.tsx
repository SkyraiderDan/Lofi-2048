import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../types';

interface ControlsGuideProps {
  onMove: (dir: Direction) => void;
  disabled?: boolean;
}

export const ControlsGuide: React.FC<ControlsGuideProps> = ({ onMove, disabled }) => {
  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col items-center gap-3">
      {/* On-screen D-Pad for Mobile / Touch / Fast clicks */}
      <div className="grid grid-cols-3 gap-1.5 w-36 h-28 select-none">
        <div />
        <button
          onClick={() => onMove('UP')}
          disabled={disabled}
          className="flex items-center justify-center rounded-xl bg-slate-900/80 border border-fuchsia-500/30 text-fuchsia-300 hover:text-white hover:bg-fuchsia-950/60 active:scale-90 transition-all shadow-[0_0_10px_rgba(217,70,239,0.15)] disabled:opacity-40"
          title="Move Up (Arrow Up / W)"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div />

        <button
          onClick={() => onMove('LEFT')}
          disabled={disabled}
          className="flex items-center justify-center rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-950/60 active:scale-90 transition-all shadow-[0_0_10px_rgba(34,211,238,0.15)] disabled:opacity-40"
          title="Move Left (Arrow Left / A)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onMove('DOWN')}
          disabled={disabled}
          className="flex items-center justify-center rounded-xl bg-slate-900/80 border border-fuchsia-500/30 text-fuchsia-300 hover:text-white hover:bg-fuchsia-950/60 active:scale-90 transition-all shadow-[0_0_10px_rgba(217,70,239,0.15)] disabled:opacity-40"
          title="Move Down (Arrow Down / S)"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          onClick={() => onMove('RIGHT')}
          disabled={disabled}
          className="flex items-center justify-center rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-950/60 active:scale-90 transition-all shadow-[0_0_10px_rgba(34,211,238,0.15)] disabled:opacity-40"
          title="Move Right (Arrow Right / D)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <span>Controls:</span>
        <span className="text-fuchsia-300 font-semibold">Arrow Keys</span>
        <span>·</span>
        <span className="text-cyan-300 font-semibold">W A S D</span>
        <span>·</span>
        <span className="text-pink-300 font-semibold">Swipe</span>
      </div>
    </div>
  );
};
