import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-scale-in">
      <div className="w-full max-w-sm rounded-2xl bg-slate-950 border border-fuchsia-500/40 p-5 shadow-[0_0_35px_rgba(217,70,239,0.3)] space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h3 className="font-orbitron font-bold text-white text-base">
              HOW TO PLAY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Instructions"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
          <p>
            <strong className="text-cyan-300">1. Slide Tiles:</strong> Use your{' '}
            <span className="text-white font-semibold">Arrow keys</span>,{' '}
            <span className="text-white font-semibold">W/A/S/D</span>, or{' '}
            <span className="text-white font-semibold">swipe on screen</span> to
            slide all tiles in one direction.
          </p>
          <p>
            <strong className="text-fuchsia-300">2. Merge Tiles & Sparks:</strong>{' '}
            When two tiles collide, they combine with escalating neon spark
            bursts contained within the tile—scaling logarithmically from 7 embers
            at 8 up to 155 fireworks at 2048!
          </p>
          <p>
            <strong className="text-pink-300">3. Chill & Listen:</strong> Enjoy
            the live Lofi Girl radio stream docked in the corner. You can
            minimize it to an audio pill whenever you need more space.
          </p>
          <p>
            <strong className="text-yellow-300">4. Undo Support:</strong> Made an
            accidental slip? Use the Undo button or press Ctrl+Z to roll back your
            last move.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-[0_0_15px_rgba(219,39,119,0.3)]"
        >
          Ready to Play
        </button>
      </div>
    </div>
  );
};
