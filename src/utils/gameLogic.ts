import { Direction, TileData, MergeEvent } from '../types';

let nextId = 1;

export function getUniqueId(): string {
  return `tile-${Date.now()}-${nextId++}`;
}

export function createRandomTile(emptyPositions: { row: number; col: number }[]): TileData | null {
  if (emptyPositions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * emptyPositions.length);
  const pos = emptyPositions[randomIndex];
  const value = Math.random() < 0.9 ? 2 : 4;

  return {
    id: getUniqueId(),
    value,
    row: pos.row,
    col: pos.col,
    isNew: true,
  };
}

export function getEmptyPositions(tiles: TileData[]): { row: number; col: number }[] {
  const occupied = new Set<string>();
  tiles.forEach((t) => occupied.add(`${t.row},${t.col}`));

  const empties: { row: number; col: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!occupied.has(`${r},${c}`)) {
        empties.push({ row: r, col: c });
      }
    }
  }
  return empties;
}

export function initializeBoard(): TileData[] {
  const empties: { row: number; col: number }[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      empties.push({ row: r, col: c });
    }
  }

  const first = createRandomTile(empties);
  if (!first) return [];

  const remaining = empties.filter((p) => p.row !== first.row || p.col !== first.col);
  const second = createRandomTile(remaining);

  return second ? [first, second] : [first];
}

interface MoveResult {
  tiles: TileData[];
  scoreGained: number;
  hasMoved: boolean;
  highestMergedValue: number;
  merges: MergeEvent[];
}

export function moveBoard(currentTiles: TileData[], direction: Direction): MoveResult {
  // Build 4x4 matrix of current tile references
  const grid: (TileData | null)[][] = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => null)
  );

  currentTiles.forEach((tile) => {
    // Clear transient flags for next turn
    grid[tile.row][tile.col] = {
      ...tile,
      isNew: false,
      isMerged: false,
    };
  });

  let scoreGained = 0;
  let hasMoved = false;
  let highestMergedValue = 0;
  const merges: MergeEvent[] = [];

  const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
  const isForward = direction === 'RIGHT' || direction === 'DOWN';

  for (let i = 0; i < 4; i++) {
    // Collect line of tiles
    const line: (TileData | null)[] = [];
    for (let j = 0; j < 4; j++) {
      const row = isHorizontal ? i : j;
      const col = isHorizontal ? j : i;
      line.push(grid[row][col]);
    }

    // Filter out nulls
    const compactTiles = line.filter((t): t is TileData => t !== null);
    if (isForward) {
      compactTiles.reverse();
    }

    const mergedLine: TileData[] = [];
    let skipNext = false;

    for (let k = 0; k < compactTiles.length; k++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const current = compactTiles[k];
      const next = compactTiles[k + 1];

      if (next && current.value === next.value) {
        // Merge
        const mergedVal = current.value * 2;
        scoreGained += mergedVal;
        if (mergedVal > highestMergedValue) {
          highestMergedValue = mergedVal;
        }

        mergedLine.push({
          id: getUniqueId(),
          value: mergedVal,
          row: 0, // updated below
          col: 0,
          isMerged: true,
        });
        skipNext = true;
      } else {
        mergedLine.push({ ...current });
      }
    }

    // Assign new coordinates in line
    for (let pos = 0; pos < 4; pos++) {
      const targetIndex = isForward ? 3 - pos : pos;
      const targetRow = isHorizontal ? i : targetIndex;
      const targetCol = isHorizontal ? targetIndex : i;

      const newTile = pos < mergedLine.length ? mergedLine[pos] : null;
      const oldTile = isHorizontal ? grid[i][targetIndex] : grid[targetIndex][i];

      if (newTile) {
        newTile.row = targetRow;
        newTile.col = targetCol;

        if (newTile.isMerged) {
          merges.push({
            id: newTile.id,
            row: targetRow,
            col: targetCol,
            value: newTile.value,
          });
        }

        // Check if moved
        if (
          !oldTile ||
          oldTile.id !== newTile.id ||
          oldTile.row !== targetRow ||
          oldTile.col !== targetCol ||
          oldTile.value !== newTile.value
        ) {
          hasMoved = true;
        }
      } else if (oldTile) {
        hasMoved = true;
      }

      if (isHorizontal) {
        grid[i][targetIndex] = newTile;
      } else {
        grid[targetIndex][i] = newTile;
      }
    }
  }

  // Flatten grid to active tiles
  const resultingTiles: TileData[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = grid[r][c];
      if (tile) {
        resultingTiles.push(tile);
      }
    }
  }

  return {
    tiles: resultingTiles,
    scoreGained,
    hasMoved,
    highestMergedValue,
    merges,
  };
}

export function isGameOver(tiles: TileData[]): boolean {
  if (tiles.length < 16) return false;

  // Grid is full, verify if any merges are possible
  const grid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  tiles.forEach((t) => {
    grid[t.row][t.col] = t.value;
  });

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = grid[r][c];
      // Check right neighbor
      if (c < 3 && grid[r][c + 1] === val) return false;
      // Check bottom neighbor
      if (r < 3 && grid[r + 1][c] === val) return false;
    }
  }

  return true;
}

export function hasReached2048(tiles: TileData[]): boolean {
  return tiles.some((t) => t.value >= 2048);
}
