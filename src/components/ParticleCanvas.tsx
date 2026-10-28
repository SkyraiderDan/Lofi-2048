import React, { useRef, useEffect } from 'react';
import { MergeEvent } from '../types';
import {
  getParticleConfig,
  PADDING,
  CORNER_RADIUS,
} from '../constants/particleConfig';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  sparkle: boolean;
  maxTrail: number;
  trail: { x: number; y: number }[];
  isStar?: boolean;
  cellRow: number;
  cellCol: number;
}

interface CellFlash {
  row: number;
  col: number;
  color: string;
  alpha: number;
  decay: number;
}

interface ParticleCanvasProps {
  mergeEvents: MergeEvent[];
}

function clipCellRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }
  ctx.closePath();
}

function getCellGeometry(
  row: number,
  col: number,
  logicalW: number,
  logicalH: number
) {
  const cellW = logicalW / 4;
  const cellH = logicalH / 4;
  const x0 = col * cellW + PADDING;
  const y0 = row * cellH + PADDING;
  const w = cellW - PADDING * 2;
  const h = cellH - PADDING * 2;
  return {
    x0,
    y0,
    w,
    h,
    minX: x0 + 4,
    maxX: x0 + w - 4,
    minY: y0 + 4,
    maxY: y0 + h - 4,
    centerX: x0 + w / 2,
    centerY: y0 + h / 2,
    radius: CORNER_RADIUS,
  };
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ mergeEvents }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const flashesRef = useRef<CellFlash[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastProcessedIdRef = useRef<string>('');

  // Spawn particles inside specific merged cells
  const spawnMergeSparks = (merges: MergeEvent[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const logicalW = rect.width;
    const logicalH = rect.height;
    if (logicalW === 0 || logicalH === 0) return;

    const newParticles: Particle[] = [];
    const newFlashes: CellFlash[] = [];

    merges.forEach((ev) => {
      if (ev.value < 8) return;

      const config = getParticleConfig(ev.value);
      const geom = getCellGeometry(ev.row, ev.col, logicalW, logicalH);

      // Add volumetric flash inside the cell
      newFlashes.push({
        row: ev.row,
        col: ev.col,
        color: config.primaryColor,
        alpha: 0.65,
        decay: 0.035,
      });

      const isFirework = ev.value >= 2048;

      for (let i = 0; i < config.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed =
          config.speedMin +
          Math.random() * (config.speedMax - config.speedMin);

        const originOffset = Math.random() * geom.w * 0.15;
        const originX = geom.centerX + Math.cos(angle) * originOffset;
        const originY = geom.centerY + Math.sin(angle) * originOffset;

        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - (isFirework ? Math.random() * 2 : 0);

        const color =
          config.colors[Math.floor(Math.random() * config.colors.length)];
        const size =
          config.sizeMin +
          Math.random() * (config.sizeMax - config.sizeMin);
        const decay =
          config.decayMin +
          Math.random() * (config.decayMax - config.decayMin);

        newParticles.push({
          x: originX,
          y: originY,
          vx,
          vy,
          size,
          color,
          alpha: 1,
          decay,
          gravity: config.gravity,
          friction: config.friction,
          sparkle: config.sparkle,
          maxTrail: config.maxTrail,
          trail: [{ x: originX, y: originY }],
          isStar: isFirework && Math.random() > 0.65,
          cellRow: ev.row,
          cellCol: ev.col,
        });
      }
    });

    if (newParticles.length > 0 || newFlashes.length > 0) {
      particlesRef.current = [...particlesRef.current, ...newParticles];
      flashesRef.current = [...flashesRef.current, ...newFlashes];
      startAnimationLoop();
    }
  };

  const startAnimationLoop = () => {
    if (animFrameRef.current !== null) return;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = null;
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameRef.current = null;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const logicalW = rect.width;
      const logicalH = rect.height;

      // Clear full canvas in logical units
      ctx.clearRect(0, 0, logicalW, logicalH);

      // 1. Process cell ambient volumetric flashes
      const activeFlashes = flashesRef.current;
      const survivingFlashes: CellFlash[] = [];

      for (let f = 0; f < activeFlashes.length; f++) {
        const flash = activeFlashes[f];
        flash.alpha -= flash.decay;
        if (flash.alpha > 0.02) {
          survivingFlashes.push(flash);
          const geom = getCellGeometry(flash.row, flash.col, logicalW, logicalH);

          ctx.save();
          clipCellRoundRect(ctx, geom.x0, geom.y0, geom.w, geom.h, geom.radius);
          ctx.clip();

          const grad = ctx.createRadialGradient(
            geom.centerX,
            geom.centerY,
            0,
            geom.centerX,
            geom.centerY,
            geom.w * 0.7
          );
          grad.addColorStop(0, flash.color);
          grad.addColorStop(1, 'transparent');

          ctx.globalAlpha = flash.alpha * 0.45;
          ctx.fillStyle = grad;
          ctx.fillRect(geom.x0, geom.y0, geom.w, geom.h);
          ctx.restore();
        }
      }
      flashesRef.current = survivingFlashes;

      // 2. Process and render sparks, grouped by cell
      const particles = particlesRef.current;
      const survivingParticles: Particle[] = [];
      const cellMap = new Map<string, Particle[]>();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const geom = getCellGeometry(p.cellRow, p.cellCol, logicalW, logicalH);

        // Update positions with friction & gravity
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Ricochet/bounce physics inside cell boundaries
        if (p.x < geom.minX) {
          p.x = geom.minX;
          p.vx = -p.vx * 0.88;
        } else if (p.x > geom.maxX) {
          p.x = geom.maxX;
          p.vx = -p.vx * 0.88;
        }

        if (p.y < geom.minY) {
          p.y = geom.minY;
          p.vy = -p.vy * 0.88;
        } else if (p.y > geom.maxY) {
          p.y = geom.maxY;
          p.vy = -p.vy * 0.88;
        }

        // Keep extended history for longer spark trails
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) {
          p.trail.shift();
        }

        if (p.alpha > 0.02) {
          survivingParticles.push(p);
          const key = `${p.cellRow},${p.cellCol}`;
          if (!cellMap.has(key)) {
            cellMap.set(key, []);
          }
          cellMap.get(key)!.push(p);
        }
      }

      particlesRef.current = survivingParticles;

      // Render particles inside each cell using rounded clipping
      cellMap.forEach((cellParticles, key) => {
        const [rStr, cStr] = key.split(',');
        const row = parseInt(rStr, 10);
        const col = parseInt(cStr, 10);
        const geom = getCellGeometry(row, col, logicalW, logicalH);

        ctx.save();
        clipCellRoundRect(ctx, geom.x0, geom.y0, geom.w, geom.h, geom.radius);
        ctx.clip();

        for (let i = 0; i < cellParticles.length; i++) {
          const p = cellParticles[i];
          const currentAlpha =
            p.sparkle && Math.random() > 0.35 ? p.alpha * 0.7 : p.alpha;

          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));

          // Draw long luminous spark trail with tapering width
          if (p.trail.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let t = 1; t < p.trail.length; t++) {
              ctx.lineTo(p.trail[t].x, p.trail[t].y);
            }
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * 0.85;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.size * 2.5;
            ctx.stroke();
          }

          // Draw head spark glow
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size * 3;
          ctx.fillStyle = p.color;

          if (p.isStar) {
            const r = p.size * 1.3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - r * 1.6);
            ctx.lineTo(p.x + r * 0.4, p.y - r * 0.4);
            ctx.lineTo(p.x + r * 1.6, p.y);
            ctx.lineTo(p.x + r * 0.4, p.y + r * 0.4);
            ctx.lineTo(p.x, p.y + r * 1.6);
            ctx.lineTo(p.x - r * 0.4, p.y + r * 0.4);
            ctx.lineTo(p.x - r * 1.6, p.y);
            ctx.lineTo(p.x - r * 0.4, p.y - r * 0.4);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        ctx.restore();
      });

      if (survivingParticles.length > 0 || survivingFlashes.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        animFrameRef.current = null;
        ctx.clearRect(0, 0, logicalW, logicalH);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  };

  // Sync canvas resolution with DPR and parent geometry
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for merge events and trigger spark bursts
  useEffect(() => {
    if (mergeEvents.length === 0) return;

    const eventIds = mergeEvents.map((m) => `${m.id}-${m.value}`).join(',');
    if (eventIds && eventIds !== lastProcessedIdRef.current) {
      lastProcessedIdRef.current = eventIds;
      spawnMergeSparks(mergeEvents);
    }
  }, [mergeEvents]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
};
