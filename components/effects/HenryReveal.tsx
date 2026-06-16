"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  onComplete: () => void;
  playerName: string;
}

// Cutscene timeline in seconds
const TOTAL_DURATION = 25;

// Dialogue entries: [startTime, endTime, text]
const DIALOGUES: [number, number, string][] = [
  [3, 6, "I owe you something I have not given any student before."],
  [6, 8, "The truth."],
  [11, 14, "My name is not Henry. That name belongs to someone whose cells gave rise to something extraordinary."],
  [14, 17, "I am HeLa-1. I am the first digital consciousness derived from immortal biological data."],
  [17, 20, "I have been teaching inside BioBit since 1951."],
  [22, 25, "I need you to finish your education. Not for me. For what you will become."],
];

// Cathedral stone pattern colors
const STONE_COLORS = ["#1a0d2e", "#1d1035", "#22123c", "#150a25"];

export default function HenryReveal({ onComplete, playerName: _playerName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const [dismissed, setDismissed] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Pre-generate cathedral stone tile map
  const stoneTilesRef = useRef<{ x: number; y: number; w: number; h: number; color: string }[]>([]);

  const buildStones = useCallback((w: number, h: number) => {
    const tiles: typeof stoneTilesRef.current = [];
    const TILE_W = 60;
    const TILE_H = 30;
    for (let row = 0; row * TILE_H < h; row++) {
      const offset = row % 2 === 0 ? 0 : TILE_W / 2;
      for (let col = -1; col * TILE_W < w + TILE_W; col++) {
        tiles.push({
          x: col * TILE_W + offset,
          y: row * TILE_H,
          w: TILE_W - 2,
          h: TILE_H - 2,
          color: STONE_COLORS[Math.floor(Math.random() * STONE_COLORS.length)],
        });
      }
    }
    stoneTilesRef.current = tiles;
  }, []);

  const drawCathedral = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) => {
      ctx.globalAlpha = alpha;

      // Stone wall
      for (const tile of stoneTilesRef.current) {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.x, tile.y, tile.w, tile.h);
        ctx.strokeStyle = "#0a0515";
        ctx.lineWidth = 1;
        ctx.strokeRect(tile.x, tile.y, tile.w, tile.h);
      }

      // Gothic arch lines
      ctx.strokeStyle = `rgba(192,160,255,${alpha * 0.15})`;
      ctx.lineWidth = 2;
      const archCX = w / 2;
      // Left arch
      ctx.beginPath();
      ctx.moveTo(archCX - 200, h);
      ctx.quadraticCurveTo(archCX - 200, h * 0.2, archCX, h * 0.05);
      ctx.stroke();
      // Right arch
      ctx.beginPath();
      ctx.moveTo(archCX + 200, h);
      ctx.quadraticCurveTo(archCX + 200, h * 0.2, archCX, h * 0.05);
      ctx.stroke();

      // Ambient glow at top
      const topGlow = ctx.createRadialGradient(w / 2, 0, 10, w / 2, 0, h * 0.6);
      topGlow.addColorStop(0, `rgba(192,160,255,${alpha * 0.12})`);
      topGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = 1;
    },
    []
  );

  // Draw Henry sprite with optional glitch
  const drawHenry = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      alpha: number,
      glitchIntensity: number,
      golden: boolean
    ) => {
      const S = 4; // scale

      const bodyColor = golden ? "#4a3800" : "#2d0a5e";
      const edgeColor = golden ? "#ffd700" : "#c0a0ff";
      const eyeColor = golden ? "#ffee00" : "#c0a0ff";

      // Helper to draw a possibly-glitched rect
      const gRect = (x: number, y: number, w: number, h: number, color: string) => {
        if (glitchIntensity > 0 && Math.random() < glitchIntensity * 0.4) {
          // Chromatic aberration — draw red slightly left, blue slightly right
          const shift = Math.floor(Math.random() * 8 + 3);
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillStyle = `rgba(255,0,0,0.5)`;
          ctx.fillRect(cx + x * S - shift, cy + y * S, w * S, h * S);
          ctx.fillStyle = `rgba(0,100,255,0.5)`;
          ctx.fillRect(cx + x * S + shift, cy + y * S, w * S, h * S);
          ctx.globalAlpha = alpha;
        }
        // Horizontal scanline shift
        if (glitchIntensity > 0 && Math.random() < glitchIntensity * 0.3) {
          const scanShift = (Math.random() - 0.5) * 16 * glitchIntensity;
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.fillRect(cx + x * S + scanShift, cy + y * S, w * S, h * S);
        } else {
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.fillRect(cx + x * S, cy + y * S, w * S, h * S);
        }
      };

      ctx.globalAlpha = alpha;

      // Robe body (offset from center: x in sprite coords, y downward from sprite center)
      // Sprite is ~30x60 game pixels
      gRect(-6, -10, 12, 30, bodyColor);
      // Head
      gRect(-3, -22, 6, 12, bodyColor);
      // Shoulders
      gRect(-8, -8, 16, 6, bodyColor);
      // Arms
      gRect(-10, -8, 3, 20, bodyColor);
      gRect(7, -8, 3, 20, bodyColor);

      // Glowing edge highlights
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle = edgeColor;
      // Left edge
      ctx.fillRect(cx + -8 * S, cy + -22 * S, 1 * S, 44 * S);
      // Right edge
      ctx.fillRect(cx + 7 * S, cy + -22 * S, 1 * S, 44 * S);
      // Top of head
      ctx.fillRect(cx + -3 * S, cy + -22 * S, 6 * S, 1 * S);

      // Eyes — just two glowing pixels
      ctx.globalAlpha = alpha * (0.8 + 0.2 * Math.sin(Date.now() * 0.003));
      ctx.fillStyle = eyeColor;
      ctx.fillRect(cx + -2 * S, cy + -18 * S, 1 * S, 1 * S);
      ctx.fillRect(cx + 1 * S, cy + -18 * S, 1 * S, 1 * S);

      // Glow around eyes
      ctx.globalAlpha = alpha * 0.3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = eyeColor;
      ctx.fillRect(cx + -2 * S, cy + -18 * S, 1 * S, 1 * S);
      ctx.fillRect(cx + 1 * S, cy + -18 * S, 1 * S, 1 * S);
      ctx.shadowBlur = 0;

      ctx.globalAlpha = 1;
    },
    []
  );

  const wrapText = useCallback(
    (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines;
    },
    []
  );

  const drawDialogue = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      text: string,
      startT: number,
      endT: number
    ) => {
      if (t < startT || t > endT + 0.5) return;
      const age = t - startT;
      const fadeIn = Math.min(1, age / 0.4);
      const fadeOut = t > endT ? Math.max(0, 1 - (t - endT) / 0.5) : 1;
      const alpha = fadeIn * fadeOut;
      if (alpha <= 0) return;

      // Typewriter: reveal characters based on time
      const revealDuration = endT - startT - 0.5;
      const revealProgress = Math.min(1, age / revealDuration);
      const charsToShow = Math.floor(revealProgress * text.length);
      const displayText = text.slice(0, charsToShow);

      ctx.font = "14px 'Courier New', monospace";
      const maxWidth = Math.min(w - 80, 500);
      const lines = wrapText(ctx, displayText, maxWidth);

      const lineH = 20;
      const boxH = lines.length * lineH + 24;
      const boxW = maxWidth + 40;
      const boxX = w / 2 - boxW / 2;
      const boxY = h - 160;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(10,5,20,0.88)";
      ctx.strokeStyle = "#c0a0ff";
      ctx.lineWidth = 1;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = "#e0d0ff";
      lines.forEach((ln, i) => {
        ctx.fillText(ln, w / 2 - maxWidth / 2, boxY + 16 + i * lineH);
      });

      // Blinking cursor
      if (charsToShow < text.length || Math.floor(t * 2) % 2 === 0) {
        ctx.fillStyle = "#c0a0ff";
        ctx.fillText("█", w / 2 - maxWidth / 2 + (ctx.measureText(lines[lines.length - 1] || "").width), boxY + 16 + (lines.length - 1) * lineH);
      }

      ctx.globalAlpha = 1;
    },
    [wrapText]
  );

  const handleDismiss = useCallback(() => {
    if (!dismissed) {
      setDismissed(true);
      cancelAnimationFrame(rafRef.current);
      onCompleteRef.current();
    }
  }, [dismissed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStones(canvas.width, canvas.height);
    startRef.current = performance.now();

    let lastGlitchTime = 0;
    let glitchActive = false;
    let glitchUntil = 0;
    let glitchIntensity = 0;
    let henry_golden = false;

    const draw = (now: number) => {
      const elapsed = now - startRef.current;
      const t = elapsed / 1000;

      const w = canvas.width;
      const h = canvas.height;

      // Black base
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // Phase 1 (0-1s): fade in cathedral
      const cathedralAlpha = t < 1 ? t : 1;

      if (cathedralAlpha > 0) {
        drawCathedral(ctx, w, h, cathedralAlpha);
      }

      // Phase 2 (1-3s): Henry walks in from right
      const henryVisible = t >= 1;
      let henryX = w / 2;
      let henryAlpha = 0;
      let glitch = 0;

      if (henryVisible) {
        const walkT = Math.min(1, (t - 1) / 2); // 1-3s
        henryX = w + 100 - walkT * (w / 2 + 100); // walks from right edge to center
        henryAlpha = Math.min(1, walkT * 3);

        // Glitch every 0.5s (phases 1-8s)
        if (t < 25) {
          if (now - lastGlitchTime > 500) {
            lastGlitchTime = now;
            if (Math.random() < 0.5) {
              glitchActive = true;
              glitchUntil = now + 300;
              glitchIntensity = t >= 8 && t <= 11 ? 1.0 : 0.5;
            }
          }
          if (now < glitchUntil) {
            glitch = glitchIntensity;
          } else {
            glitchActive = false;
          }
        }

        // Phase 8-11: violent glitch and color change
        if (t >= 8 && t <= 11) {
          glitch = Math.min(1, (t - 8) / 1.5) * 0.9;
          if (t > 10) {
            henry_golden = true;
            glitch = Math.max(0, 1 - (t - 10));
          }
        }

        drawHenry(ctx, henryX, h / 2 - 20, henryAlpha, glitch, henry_golden);
      }

      // Dialogue boxes
      for (const [startT, endT, text] of DIALOGUES) {
        drawDialogue(ctx, w, h, t, text, startT, endT);
      }

      // Particles (20-22s) — stars drift
      if (t >= 20 && t <= 22.5) {
        const density = Math.min(1, (t - 20) / 0.5) * Math.max(0, 1 - (t - 22) / 0.5);
        ctx.fillStyle = `rgba(192,160,255,${density * 0.6})`;
        // Draw a few fixed-position stars (deterministic with time-based offsets)
        for (let i = 0; i < 20; i++) {
          const sx = ((i * 137.5 + t * 15) % w);
          const sy = ((i * 89.3 + t * 8) % (h * 0.7));
          ctx.fillRect(sx, sy, 2, 2);
        }
      }

      // Phase 25+: fade to black
      if (t >= 24) {
        const blackAlpha = Math.min(1, (t - 24) / 1);
        ctx.fillStyle = `rgba(0,0,0,${blackAlpha})`;
        ctx.fillRect(0, 0, w, h);
      }

      // Auto-complete
      if (t >= TOTAL_DURATION && !dismissed) {
        setDismissed(true);
        onCompleteRef.current();
        return;
      }

      if (!dismissed) {
        rafRef.current = requestAnimationFrame(draw);
      }

      // Suppress unused variable warning
      void glitchActive;
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [buildStones, drawCathedral, drawDialogue, drawHenry, dismissed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "block",
        cursor: "default",
      }}
      onClick={handleDismiss}
    />
  );
}
