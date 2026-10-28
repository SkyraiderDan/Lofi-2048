import React from 'react';
import { TileData } from '../types';

interface TileProps {
  tile: TileData;
}

export const Tile: React.FC<TileProps> = ({ tile }) => {
  const { value, row, col, isNew, isMerged } = tile;

  const getTileStyle = (val: number): string => {
    switch (val) {
      case 2:
        return 'bg-gradient-to-br from-slate-900/95 via-purple-950/80 to-slate-950 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]';
      case 4:
        return 'bg-gradient-to-br from-slate-900/95 via-indigo-950/80 to-slate-950 text-teal-300 border border-teal-400/40 shadow-[0_0_12px_rgba(45,212,191,0.25)]';
      case 8:
        return 'bg-gradient-to-br from-purple-950 via-orange-950/70 to-slate-900 text-orange-300 border border-orange-400/50 shadow-[0_0_14px_rgba(251,146,60,0.35)]';
      case 16:
        return 'bg-gradient-to-br from-purple-950 via-pink-950/70 to-slate-900 text-rose-300 border border-rose-400/50 shadow-[0_0_16px_rgba(251,113,133,0.35)]';
      case 32:
        return 'bg-gradient-to-br from-pink-950 via-fuchsia-900/80 to-purple-950 text-fuchsia-200 border border-fuchsia-400/60 shadow-[0_0_18px_rgba(217,70,239,0.45)]';
      case 64:
        return 'bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-950 text-purple-200 border border-purple-400/70 shadow-[0_0_20px_rgba(168,85,247,0.5)]';
      case 128:
        return 'bg-gradient-to-br from-cyan-950 via-blue-900/90 to-indigo-950 text-cyan-200 border border-cyan-300/80 shadow-[0_0_22px_rgba(6,182,212,0.55)]';
      case 256:
        return 'bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-white border border-indigo-300/80 shadow-[0_0_24px_rgba(99,102,241,0.6)]';
      case 512:
        return 'bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 text-white border border-rose-300/90 shadow-[0_0_28px_rgba(244,63,94,0.65)]';
      case 1024:
        return 'bg-gradient-to-br from-amber-800 via-pink-800 to-purple-900 text-amber-100 border border-yellow-300/90 shadow-[0_0_30px_rgba(234,179,8,0.7)]';
      case 2048:
        return 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white border-2 border-white shadow-[0_0_35px_rgba(236,72,153,0.85)]';
      default:
        return 'bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 text-slate-950 font-black border-2 border-yellow-200 shadow-[0_0_40px_rgba(255,255,255,0.9)]';
    }
  };

  const getFontSize = (val: number): string => {
    if (val < 100) return 'text-2xl sm:text-3xl font-extrabold';
    if (val < 1000) return 'text-xl sm:text-2xl font-extrabold';
    if (val < 10000) return 'text-lg sm:text-xl font-bold';
    return 'text-sm sm:text-base font-bold';
  };

  // Convert row, col to percentage positions
  // 4 rows & 4 cols with gaps
  const leftPos = `${col * 25}%`;
  const topPos = `${row * 25}%`;

  return (
    <div
      className="absolute w-1/4 h-1/4 p-1.5 transition-all duration-150 ease-out"
      style={{
        left: leftPos,
        top: topPos,
      }}
    >
      <div
        className={`w-full h-full rounded-xl flex flex-col items-center justify-center select-none backdrop-blur-sm relative overflow-hidden transition-transform ${
          isNew ? 'animate-scale-in' : ''
        } ${isMerged ? 'animate-pop' : ''} ${getTileStyle(value)}`}
      >
        {/* Subtle retro scanline gloss */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Number value */}
        <span
          className={`font-orbitron tracking-wider tabular-nums ${getFontSize(
            value
          )}`}
        >
          {value}
        </span>

        {/* Subtle aesthetic Japanese sub-text for milestone tiles */}
        {value >= 128 && (
          <span className="text-[9px] tracking-widest uppercase opacity-75 font-mono">
            {value === 2048 ? '★ 夢 ★' : value >= 512 ? '未来' : '東京'}
          </span>
        )}
      </div>
    </div>
  );
};
