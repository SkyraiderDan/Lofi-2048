export interface ParticleTierConfig {
  count: number;
  speedMin: number;
  speedMax: number;
  sizeMin: number;
  sizeMax: number;
  maxTrail: number;
  decayMin: number;
  decayMax: number;
  gravity: number;
  friction: number;
  sparkle: boolean;
  primaryColor: string;
  colors: string[];
}

export const PADDING = 6; // Inset matching p-1.5 (6px) of Tile.tsx
export const CORNER_RADIUS = 12; // Rounded corners matching rounded-xl

/**
 * Returns particle configuration for a given merged tile value.
 * Spark counts are logarithmically scaled and reduced based on 3% of total particles (160 * 0.03 = 4.8),
 * with a maximum ceiling of 155–160 firework sparks at 2048.
 */
export function getParticleConfig(val: number): ParticleTierConfig {
  switch (val) {
    case 8: // minor spark
      return {
        count: 7,
        speedMin: 3.0,
        speedMax: 5.5,
        sizeMin: 2.0,
        sizeMax: 3.0,
        maxTrail: 10,
        decayMin: 0.026,
        decayMax: 0.04,
        gravity: 0.02,
        friction: 0.965,
        sparkle: false,
        primaryColor: '#fb923c',
        colors: ['#fb923c', '#fdba74', '#fed7aa', '#ffffff'],
      };
    case 16: // small sparks
      return {
        count: 14,
        speedMin: 3.5,
        speedMax: 6.5,
        sizeMin: 2.2,
        sizeMax: 3.4,
        maxTrail: 12,
        decayMin: 0.024,
        decayMax: 0.038,
        gravity: 0.025,
        friction: 0.968,
        sparkle: true,
        primaryColor: '#fb7185',
        colors: ['#fb7185', '#fda4af', '#f43f5e', '#ffffff'],
      };
    case 32: // medium small sparks
      return {
        count: 23,
        speedMin: 4.0,
        speedMax: 7.5,
        sizeMin: 2.4,
        sizeMax: 3.6,
        maxTrail: 14,
        decayMin: 0.022,
        decayMax: 0.035,
        gravity: 0.03,
        friction: 0.97,
        sparkle: true,
        primaryColor: '#d946ef',
        colors: ['#d946ef', '#f0abfc', '#ec4899', '#ffffff'],
      };
    case 64: // medium sparks
      return {
        count: 36,
        speedMin: 4.5,
        speedMax: 8.5,
        sizeMin: 2.6,
        sizeMax: 4.0,
        maxTrail: 16,
        decayMin: 0.02,
        decayMax: 0.032,
        gravity: 0.035,
        friction: 0.972,
        sparkle: true,
        primaryColor: '#a855f7',
        colors: ['#a855f7', '#c084fc', '#22d3ee', '#ffffff'],
      };
    case 128: // medium large sparks
      return {
        count: 54,
        speedMin: 5.0,
        speedMax: 9.5,
        sizeMin: 2.8,
        sizeMax: 4.5,
        maxTrail: 18,
        decayMin: 0.018,
        decayMax: 0.03,
        gravity: 0.04,
        friction: 0.974,
        sparkle: true,
        primaryColor: '#06b6d4',
        colors: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#ffffff'],
      };
    case 256: // large sparks
      return {
        count: 78,
        speedMin: 5.5,
        speedMax: 10.5,
        sizeMin: 3.0,
        sizeMax: 5.0,
        maxTrail: 20,
        decayMin: 0.016,
        decayMax: 0.028,
        gravity: 0.045,
        friction: 0.976,
        sparkle: true,
        primaryColor: '#6366f1',
        colors: ['#6366f1', '#818cf8', '#38bdf8', '#c084fc', '#ffffff'],
      };
    case 512: // very large sparks
      return {
        count: 100,
        speedMin: 6.0,
        speedMax: 11.5,
        sizeMin: 3.2,
        sizeMax: 5.5,
        maxTrail: 22,
        decayMin: 0.015,
        decayMax: 0.026,
        gravity: 0.05,
        friction: 0.978,
        sparkle: true,
        primaryColor: '#f43f5e',
        colors: ['#f43f5e', '#fb7185', '#e879f9', '#38bdf8', '#ffffff'],
      };
    case 1024: // epic sparks
      return {
        count: 122,
        speedMin: 6.5,
        speedMax: 13.0,
        sizeMin: 3.5,
        sizeMax: 6.0,
        maxTrail: 24,
        decayMin: 0.014,
        decayMax: 0.024,
        gravity: 0.055,
        friction: 0.98,
        sparkle: true,
        primaryColor: '#eab308',
        colors: ['#eab308', '#facc15', '#f472b6', '#38bdf8', '#ffffff'],
      };
    default: // 2048+ -> reduced by 3% from 160 (155 firework sparks, max 160)
      return {
        count: 155,
        speedMin: 6.0,
        speedMax: 15.0,
        sizeMin: 4.0,
        sizeMax: 7.0,
        maxTrail: 26,
        decayMin: 0.011,
        decayMax: 0.02,
        gravity: 0.065,
        friction: 0.982,
        sparkle: true,
        primaryColor: '#facc15',
        colors: [
          '#facc15', // Gold
          '#ec4899', // Hot Pink
          '#06b6d4', // Cyan
          '#a855f7', // Violet
          '#10b981', // Neon Mint
          '#f97316', // Sunset Orange
          '#ffffff', // Brilliant White
        ],
      };
  }
}
