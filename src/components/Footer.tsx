import React from 'react';

interface FooterProps {
  onOpenRules: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRules }) => {
  return (
    <footer className="relative z-10 py-2.5 px-4 text-center border-t border-white/5 bg-slate-950/70 text-[11px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto w-full gap-2">
      <div className="flex items-center gap-2">
        <span>２０４８ VAPORWAVE EDITION</span>
        <span aria-hidden="true">·</span>
        <span>Synth Audio Engine</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenRules}
          className="hover:text-cyan-300 underline underline-offset-2 transition-colors"
        >
          Game Instructions
        </button>
        <span aria-hidden="true">·</span>
        <span>Chill Lo-Fi Radio 24/7</span>
      </div>
    </footer>
  );
};
