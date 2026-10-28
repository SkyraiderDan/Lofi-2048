import React, { useState } from 'react';
import {
  Minimize2,
  Maximize2,
  Radio,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Music,
} from 'lucide-react';
import { StreamOption } from '../types';

const STREAM_OPTIONS: StreamOption[] = [
  {
    id: 'synthwave',
    title: 'Synthwave Radio',
    genre: 'Beats to chill / game to',
    videoId: '5yx6BWlEVcY',
  },
  {
    id: 'classic-lofi',
    title: 'Lofi Hip Hop Radio',
    genre: 'Beats to relax / study to',
    videoId: 'jfKfPfyJRdk',
  },
  {
    id: 'peaceful-piano',
    title: 'Peaceful Piano Radio',
    genre: 'Relaxing ambient piano',
    videoId: '4xDzrJKXOOY',
  },
];

export const LofiPlayer: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<StreamOption>(STREAM_OPTIONS[0]);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showChannelList, setShowChannelList] = useState<boolean>(false);

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 max-w-[calc(100vw-1.5rem)] transition-all duration-300">
      <div className="rounded-2xl overflow-hidden bg-slate-950/95 border border-fuchsia-500/40 shadow-[0_0_30px_rgba(217,70,239,0.3)] backdrop-blur-xl transition-all">
        {/* Minimized Dock Bar */}
        {isMinimized ? (
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-950">
            {/* Animated Retro Audio Visualizer Bars */}
            <div className="flex items-end gap-0.5 h-4 w-5">
              <span className="w-1 bg-cyan-400 rounded-t h-2 animate-pulse" />
              <span
                className="w-1 bg-fuchsia-400 rounded-t h-4 animate-pulse"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1 bg-pink-400 rounded-t h-3 animate-pulse"
                style={{ animationDelay: '300ms' }}
              />
              <span
                className="w-1 bg-teal-400 rounded-t h-2.5 animate-pulse"
                style={{ animationDelay: '75ms' }}
              />
            </div>

            {/* Info */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[11px] font-bold text-white font-mono tracking-wide">
                  {selectedStream.title}
                </span>
              </div>
              <span className="text-[9px] text-fuchsia-300/80">Lofi Girl Stream Playing</span>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setIsMinimized(false)}
              className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-fuchsia-950/70 hover:bg-fuchsia-900 border border-fuchsia-500/40 text-fuchsia-300 hover:text-white transition-all active:scale-95 text-xs"
              title="Expand Video Stream"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium hidden sm:inline">Expand</span>
            </button>
          </div>
        ) : (
          /* Window Titlebar (Expanded) */
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-purple-950/90 via-slate-950/90 to-fuchsia-950/90 border-b border-fuchsia-500/30 w-[300px] sm:w-[360px]">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-fuchsia-500/20 text-fuchsia-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-white font-mono tracking-wider block">
                  LOFI GIRL STREAM
                </span>
                <span className="text-[9px] text-cyan-400 block -mt-0.5">
                  {selectedStream.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Channel Selector Toggle */}
              <button
                onClick={() => setShowChannelList(!showChannelList)}
                className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-colors"
                title="Change Station"
              >
                <Music className="w-2.5 h-2.5" />
                <span>Station</span>
                {showChannelList ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {/* Minimize Window Button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Minimize to Audio Bar"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Channel Selector Dropdown Drawer (when expanded and opened) */}
        {!isMinimized && showChannelList && (
          <div className="p-2 bg-slate-900/95 border-b border-fuchsia-500/20 space-y-1 text-xs w-[300px] sm:w-[360px]">
            <div className="text-[10px] text-fuchsia-300/70 uppercase tracking-wider font-mono px-1">
              Select Stream:
            </div>
            {STREAM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSelectedStream(opt);
                  setShowChannelList(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  selectedStream.id === opt.id
                    ? 'bg-fuchsia-900/50 text-white font-medium border border-fuchsia-500/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="truncate">
                  <span className="block font-medium">{opt.title}</span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {opt.genre}
                  </span>
                </div>
                {selectedStream.id === opt.id && (
                  <span className="text-[10px] text-cyan-300 font-mono">Active</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Video Container: Keep permanently in DOM so stream audio never pauses when minimized! */}
        <div
          className={`transition-all duration-300 ${
            isMinimized
              ? 'h-0 w-0 opacity-0 overflow-hidden pointer-events-none'
              : 'aspect-video w-[300px] sm:w-[360px] bg-black opacity-100'
          }`}
        >
          <iframe
            key={selectedStream.videoId}
            src={`https://www.youtube-nocookie.com/embed/${selectedStream.videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
            title="Lofi Girl Live Stream"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Bottom Stream Status Bar (Expanded only) */}
        {!isMinimized && (
          <div className="px-3 py-1.5 bg-slate-950/90 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 w-[300px] sm:w-[360px]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-slate-300">Live 24/7 stream</span>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${selectedStream.videoId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Open on YouTube</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
