export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface TileData {
  id: string;
  value: number;
  row: number;
  col: number;
  mergedFrom?: TileData[];
  isNew?: boolean;
  isMerged?: boolean;
}

export type Grid = (TileData | null)[][];

export interface GameSnapshot {
  tiles: TileData[];
  score: number;
  moves: number;
}

export interface MergeEvent {
  id: string;
  row: number;
  col: number;
  value: number;
}

export interface StreamOption {
  id: string;
  title: string;
  genre: string;
  videoId: string;
}
