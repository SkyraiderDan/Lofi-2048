import React, { useState } from 'react';
import { use2048Game } from './hooks/use2048Game';
import { soundEffects } from './utils/audio';
import { VaporwaveBackground } from './components/VaporwaveBackground';
import { TopBar } from './components/TopBar';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { ControlsGuide } from './components/ControlsGuide';
import { GameOverModal } from './components/GameOverModal';
import { LofiPlayer } from './components/LofiPlayer';
import { RulesModal } from './components/RulesModal';
import { Footer } from './components/Footer';

export default function App() {
  const [crtEnabled, setCrtEnabled] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEffects.getMuted());
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Core 2048 game state and actions
  const {
    tiles,
    score,
    bestScore,
    moves,
    mergeEvents,
    highestTile,
    isWon,
    isOver,
    canUndo,
    handleMove,
    handleNewGame,
    handleUndo,
    keepPlaying,
  } = use2048Game({ isInputPaused: showRulesModal });

  const toggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  const toggleCrt = () => {
    setCrtEnabled((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#090514] text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white overflow-hidden">
      {/* Background Graphic Asset & CRT Scanlines */}
      <VaporwaveBackground crtEnabled={crtEnabled} />

      {/* Top Bar: Wordmark, Navigation, Audio/CRT toggles, Restart */}
      <TopBar
        crtEnabled={crtEnabled}
        isMuted={isMuted}
        onOpenRules={() => setShowRulesModal(true)}
        onToggleCrt={toggleCrt}
        onToggleMute={toggleMute}
        onNewGame={handleNewGame}
      />

      {/* Main Game Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* Subtitle kicker metadata */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <div className="flex items-center gap-1.5 text-fuchsia-300">
              <span>Classic 4×4</span>
              <span aria-hidden="true">·</span>
              <span>Slide & Merge</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span>Goal: 2048</span>
              <span aria-hidden="true">·</span>
              <span>Cell Sparks</span>
            </div>
          </div>

          {/* Score Board & Actions */}
          <ScoreBoard
            score={score}
            bestScore={bestScore}
            moves={moves}
            canUndo={canUndo}
            isMuted={isMuted}
            crtEnabled={crtEnabled}
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onToggleMute={toggleMute}
            onToggleCrt={toggleCrt}
          />

          {/* 2048 Arena & Particle Sparks */}
          <div className="relative">
            <GameBoard
              tiles={tiles}
              onMove={handleMove}
              isGameOver={isOver}
              mergeEvents={mergeEvents}
            />

            {/* Victory / Defeat Overlay */}
            <GameOverModal
              isWon={isWon}
              isOver={isOver}
              score={score}
              bestScore={bestScore}
              highestTile={highestTile}
              onRestart={handleNewGame}
              onKeepPlaying={keepPlaying}
            />
          </div>

          {/* On-screen D-Pad & Keyboard Hints */}
          <ControlsGuide onMove={handleMove} disabled={isOver} />
        </div>
      </main>

      {/* Minimizable Lofi Girl Live Stream Player */}
      <LofiPlayer />

      {/* Footer */}
      <Footer onOpenRules={() => setShowRulesModal(true)} />

      {/* Instructions Modal */}
      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}
