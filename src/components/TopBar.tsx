import React from 'react';
import { HelpCircle, Sparkles, Music } from 'lucide-react';

interface TopBarProps {
  crtEnabled: boolean;
  isMuted: boolean;
  onOpenRules: () => void;
  onToggleCrt: () => void;
  onToggleMute: () => void;
  onNewGame: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  crtEnabled,
  isMuted,
  onOpenRules,
  onToggleCrt,
  onToggleMute,
  onNewGame,
}) => {
  return (
    <header className="relative z-10 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-fuchsia-500/20 bg-slate-950/60 backdrop-blur-md">
      {/* Zone 1: Single text wordmark in display face */}
      <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <span className="text-base sm:text-lg font-orbitron font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300">
          ２０４８
        </span>
        <span className="text-xs font-mono text-cyan-400 tracking-wider">
          VAPOR LOUNGE
        </span>
      </div>

      {/* Zone 2: 4 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300 font-mono">
        <button
          onClick={onOpenRules}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>How to Play</span>
        </button>
        <button
          onClick={onToggleCrt}
          className={`hover:text-pink-300 transition-colors whitespace-nowrap shrink-0 ${
            crtEnabled ? 'text-pink-400' : ''
          }`}
        >
          {crtEnabled ? 'CRT: ON' : 'CRT: OFF'}
        </button>
        <button
          onClick={onToggleMute}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 ${
            isMuted ? 'text-slate-500' : 'text-cyan-300'
          }`}
        >
          {isMuted ? 'Audio: Muted' : 'Audio: Active'}
        </button>
        <span className="text-fuchsia-400/80 whitespace-nowrap shrink-0 flex items-center gap-1">
          <Music className="w-3 h-3 text-pink-400" />
          <span>Lofi Girl Live</span>
        </span>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onNewGame}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 rounded-lg hover:from-pink-500 hover:to-purple-500 active:scale-95 transition-all shadow-[0_0_15px_rgba(219,39,119,0.35)] whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Restart</span>
        </button>
      </div>
    </header>
  );
};
