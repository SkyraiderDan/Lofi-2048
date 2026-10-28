import { useState, useEffect, useCallback } from 'react';
import {
  initializeBoard,
  moveBoard,
  isGameOver,
  hasReached2048,
  createRandomTile,
  getEmptyPositions,
} from '../utils/gameLogic';
import { soundEffects } from '../utils/audio';
import { Direction, TileData, GameSnapshot, MergeEvent } from '../types';

interface Use2048GameOptions {
  isInputPaused?: boolean;
}

export function use2048Game(options: Use2048GameOptions = {}) {
  const { isInputPaused = false } = options;

  const [tiles, setTiles] = useState<TileData[]>(() => initializeBoard());
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem('vaporwave_2048_best');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [moves, setMoves] = useState<number>(0);
  const [history, setHistory] = useState<GameSnapshot[]>([]);
  const [mergeEvents, setMergeEvents] = useState<MergeEvent[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [hasDismissedWon, setHasDismissedWon] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);

  // Highest tile tracking
  const highestTile = tiles.reduce((max, t) => Math.max(max, t.value), 2);

  // Sync personal best score to localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('vaporwave_2048_best', score.toString());
    }
  }, [score, bestScore]);

  // Start a fresh game session
  const handleNewGame = useCallback(() => {
    const fresh = initializeBoard();
    setTiles(fresh);
    setScore(0);
    setMoves(0);
    setHistory([]);
    setMergeEvents([]);
    setIsWon(false);
    setHasDismissedWon(false);
    setIsOver(false);
    soundEffects.playSlide();
  }, []);

  // Undo previous move
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastSnapshot = history[history.length - 1];
    setTiles(lastSnapshot.tiles);
    setScore(lastSnapshot.score);
    setMoves(lastSnapshot.moves);
    setMergeEvents([]);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setIsOver(false);
    soundEffects.playSlide();
  }, [history]);

  // Continue playing past 2048
  const keepPlaying = useCallback(() => {
    setIsWon(false);
    setHasDismissedWon(true);
  }, []);

  // Process directional board move
  const handleMove = useCallback(
    (direction: Direction) => {
      if (isOver) return;

      const result = moveBoard(tiles, direction);

      if (result.hasMoved) {
        // Save history for undo (keep up to 5 steps)
        setHistory((prev) => [
          ...prev.slice(-5),
          { tiles: [...tiles], score, moves },
        ]);

        // Trigger particle sparks for merges
        if (result.merges.length > 0) {
          setMergeEvents(result.merges);
        } else {
          setMergeEvents([]);
        }

        // Web Audio synth chime feedback
        if (result.highestMergedValue > 0) {
          soundEffects.playMerge(result.highestMergedValue);
        } else {
          soundEffects.playSlide();
        }

        const newScore = score + result.scoreGained;
        const newMoves = moves + 1;

        // Spawn a random new tile (90% 2, 10% 4)
        const empties = getEmptyPositions(result.tiles);
        const spawnedTile = createRandomTile(empties);
        const finalTiles = spawnedTile
          ? [...result.tiles, spawnedTile]
          : result.tiles;

        setTiles(finalTiles);
        setScore(newScore);
        setMoves(newMoves);

        // Check 2048 victory condition
        if (!isWon && !hasDismissedWon && hasReached2048(finalTiles)) {
          setIsWon(true);
          soundEffects.playVictory();
        }

        // Check Game Over condition
        if (isGameOver(finalTiles)) {
          setIsOver(true);
          soundEffects.playGameOver();
        }
      }
    },
    [tiles, isOver, score, moves, isWon, hasDismissedWon]
  );

  // Keyboard navigation event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputPaused) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('RIGHT');
          break;
        case 'z':
        case 'Z':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            handleUndo();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleUndo, isInputPaused]);

  return {
    tiles,
    score,
    bestScore,
    moves,
    history,
    mergeEvents,
    highestTile,
    isWon,
    isOver,
    canUndo: history.length > 0,
    handleMove,
    handleNewGame,
    handleUndo,
    keepPlaying,
  };
}
