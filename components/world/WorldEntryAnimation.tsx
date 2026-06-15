'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/lib/store';
import type { AvatarConfig } from '@/lib/types';

interface WorldEntryAnimationProps {
  realm: 1 | 2 | 3 | 4;
  onComplete: () => void;
}

const SCALE = 3;

// ─── Avatar (from behind, walking) ────────────────────────────────────────────
function drawAvatarBack(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  walkPhase: number,
  av: AvatarConfig,
) {
  const S = SCALE;
  // Back of head (8x8 game px):
  ctx.fillStyle = av.skinTone;
  ctx.fillRect(x + 2 * S, y, 8 * S, 8 * S);
  // Hair (back of head):
  ctx.fillStyle = av.hairColor;
  ctx.fillRect(x + 1 * S, y - 2 * S, 10 * S, 5 * S);
  ctx.fillRect(x, y + 2 * S, 2 * S, 4 * S);
  ctx.fillRect(x + 10 * S, y + 2 * S, 2 * S, 4 * S);
  // Neck:
  ctx.fillStyle = av.skinTone;
  ctx.fillRect(x + 4 * S, y + 7 * S, 4 * S, 2 * S);
  // Body/clothing:
  ctx.fillStyle = av.clothingColorPrimary;
  ctx.fillRect(x + 1 * S, y + 9 * S, 10 * S, 10 * S);
  // Backpack:
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(x + 3 * S, y + 9 * S, 6 * S, 8 * S);
  ctx.fillStyle = '#39ff14';
  ctx.fillRect(x + 5 * S, y + 11 * S, 2 * S, 2 * S);
  ctx.fillRect(x + 6 * S, y + 12 * S, 2 * S, 2 * S);
  // Legs (walking animation):
  ctx.fillStyle = '#1a1a2e';
  const legOff1 = Math.sin(walkPhase) * 4;
  const legOff2 = -Math.sin(walkPhase) * 4;
  ctx.fillRect(x + 2 * S, y + 19 * S + legOff1, 4 * S, 6 * S);
  ctx.fillRect(x + 6 * S, y + 19 * S + legOff2, 4 * S, 6 * S);
  // Feet:
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 1 * S, y + 24 * S + legOff1, 6 * S, 2 * S);
  ctx.fillRect(x + 5 * S, y + 24 * S + legOff2, 6 * S, 2 * S);
  // Arms:
  const armSwing1 = Math.sin(walkPhase + Math.PI) * 3;
  const armSwing2 = Math.sin(walkPhase) * 3;
  ctx.fillStyle = av.clothingColorPrimary;
  ctx.fillRect(x, y + 9 * S + armSwing1, 2 * S, 7 * S);
  ctx.fillRect(x + 10 * S, y + 9 * S + armSwing2, 2 * S, 7 * S);
  // Hands:
  ctx.fillStyle = av.skinTone;
  ctx.fillRect(x - 1 * S, y + 15 * S + armSwing1, 3 * S, 3 * S);
  ctx.fillRect(x + 10 * S, y + 15 * S + armSwing2, 3 * S, 3 * S);
}

// ─── Enzyme cat (white, side view) ────────────────────────────────────────────
function drawEnzyme(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  walkPhase: number,
  sitting: boolean,
) {
  const S = SCALE;
  if (sitting) {
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 1 * S, y + 3 * S, 6 * S, 5 * S);
    ctx.fillRect(x + 2 * S, y, 5 * S, 5 * S);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(x + 2 * S, y + 2 * S, 5 * S, 2 * S);
    // Ears:
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 1 * S, y - 2 * S, 2 * S, 3 * S);
    ctx.fillRect(x + 5 * S, y - 2 * S, 2 * S, 3 * S);
    ctx.fillStyle = '#ffb3c1';
    ctx.fillRect(x + 2 * S, y - 1 * S, 1 * S, 2 * S);
    ctx.fillRect(x + 5 * S, y - 1 * S, 1 * S, 2 * S);
    // Eyes:
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 2 * S, y + 1 * S, 2 * S, 2 * S);
    ctx.fillRect(x + 5 * S, y + 1 * S, 2 * S, 2 * S);
    // Nose:
    ctx.fillStyle = '#ffb3c1';
    ctx.fillRect(x + 3 * S, y + 3 * S, 2 * S, 1 * S);
    // Tail:
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 7 * S, y + 4 * S, 2 * S, 5 * S);
    ctx.fillRect(x + 6 * S, y + 8 * S, 3 * S, 2 * S);
  } else {
    const legOff = Math.sin(walkPhase) * 2;
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 1 * S, y + 2 * S, 6 * S, 4 * S);
    ctx.fillRect(x + 4 * S, y, 4 * S, 4 * S);
    // Ears:
    ctx.fillRect(x + 4 * S, y - 2 * S, 2 * S, 3 * S);
    ctx.fillRect(x + 7 * S, y - 2 * S, 2 * S, 3 * S);
    // Eyes:
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 5 * S, y + 1 * S, 2 * S, 1 * S);
    // Nose:
    ctx.fillStyle = '#ffb3c1';
    ctx.fillRect(x + 6 * S, y + 2 * S, 1 * S, 1 * S);
    // Legs:
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(x + 2 * S, y + 5 * S + legOff, 2 * S, 3 * S);
    ctx.fillRect(x + 4 * S, y + 5 * S - legOff, 2 * S, 3 * S);
    // Tail:
    ctx.fillRect(x, y + 2 * S, 2 * S, 5 * S);
    ctx.fillRect(x, y, 2 * S, 3 * S);
  }
}

// ─── Backgrounds ──────────────────────────────────────────────────────────────
function drawCytoplasmBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  ctx.fillStyle = '#030d1a';
  ctx.fillRect(0, 0, CW, CH);
  ctx.fillStyle = '#051528';
  ctx.fillRect(CW * 0.2, CH * 0.1, CW * 0.6, CH * 0.7);
  // Ground:
  ctx.fillStyle = '#0d2030';
  ctx.fillRect(0, CH * 0.75, CW, CH * 0.25);
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = '#071520';
    ctx.fillRect(i * (CW / 20), CH * 0.74, CW / 22, 8);
  }
  // Nucleus:
  const nX = CW * 0.7, nY = CH * 0.4, nR = 90;
  ['#1a3a6b', '#2255aa', '#3377dd', '#4499ff'].forEach((c, i) => {
    const r = nR - i * 10;
    ctx.fillStyle = c;
    for (let row = -r; row < r; row += 3) {
      const w = Math.sqrt(r * r - row * row) * 2;
      ctx.fillRect(nX - w / 2, nY + row, w, 3);
    }
  });
  ctx.fillStyle = '#9955ff';
  const pR = nR - 44;
  for (let row = -pR; row < pR; row += 3) {
    const w = Math.sqrt(pR * pR - row * row) * 2;
    ctx.fillRect(nX - w / 2, nY + row, w, 3);
  }
  // DNA Helix:
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 4 + t * 0.5;
    const helixY = CH * 0.2 + i * (CH * 0.5 / 20);
    const helixX = CW * 0.3;
    ctx.fillStyle = '#6633cc';
    ctx.fillRect(helixX + Math.cos(angle) * 30 - 4, helixY, 8, 8);
    ctx.fillStyle = '#3355ff';
    ctx.fillRect(helixX + Math.cos(angle + Math.PI) * 30 - 4, helixY, 8, 8);
    if (i % 3 === 0) {
      ctx.fillStyle = i % 6 === 0 ? '#33cc66' : '#3366ff';
      const x1 = helixX + Math.cos(angle) * 30;
      const x2 = helixX + Math.cos(angle + Math.PI) * 30;
      ctx.fillRect(Math.min(x1, x2), helixY + 3, Math.abs(x2 - x1), 2);
    }
  }
  // Floating bubbles:
  for (let b = 0; b < 15; b++) {
    const bx = (b * 137) % CW;
    const by = CH * 0.2 + ((b * 97) % 100) / 100 * CH * 0.5 + Math.sin(t * 0.5 + b) * 10;
    const bSize = 4 + b % 8;
    ctx.fillStyle = b % 3 === 0 ? '#00ffff' : b % 3 === 1 ? '#00ccaa' : '#88ccff';
    ctx.fillRect(bx, by, bSize, bSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 1, by + 1, 2, 2);
  }
  // Mitochondria:
  ([[CW * 0.15, CH * 0.35], [CW * 0.5, CH * 0.25], [CW * 0.8, CH * 0.55]] as [number, number][]).forEach(([mx, my], idx) => {
    const bob = Math.sin(t * 0.8 + idx * 1.5) * 8;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(mx - 30, my + bob - 10, 60, 20);
    ctx.fillStyle = '#cc6600';
    ctx.fillRect(mx - 25, my + bob - 7, 50, 14);
    ctx.fillStyle = '#ff9900';
    for (let c = 0; c < 3; c++) ctx.fillRect(mx - 15 + c * 12, my + bob - 5, 2, 10);
  });
  // Golgi:
  for (let g = 0; g < 5; g++) {
    ctx.fillStyle = g % 2 === 0 ? '#22aa66' : '#33cc88';
    ctx.fillRect(CW * 0.85 - g * 3, CH * 0.5 + g * 10, 80 - g * 8, 8);
  }
  // Enzyme molecules:
  for (let e = 0; e < 10; e++) {
    const ex = (e * 173) % CW;
    const ey = CH * 0.15 + ((e * 89) % 100) / 100 * CH * 0.6 + Math.sin(t + e) * 5;
    ctx.fillStyle = e % 2 === 0 ? '#ff44aa' : '#ff6644';
    ctx.fillRect(ex, ey, 6, 4);
  }
}

function drawGenomeForestBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  ctx.fillStyle = '#1a4020'; ctx.fillRect(0, 0, CW, CH * 0.3);
  ctx.fillStyle = '#2d6a30'; ctx.fillRect(0, CH * 0.3, CW, CH * 0.2);
  ctx.fillStyle = '#3d8a40'; ctx.fillRect(0, CH * 0.5, CW, CH * 0.25);
  ctx.fillStyle = '#1a3010'; ctx.fillRect(0, CH * 0.75, CW, CH * 0.25);
  // Background trees:
  for (let tr = 0; tr < 4; tr++) {
    const tx = tr * (CW / 4) + 30;
    ctx.fillStyle = '#4a3020';
    ctx.fillRect(tx, CH * 0.2, 12, CH * 0.55);
    ctx.fillStyle = '#2d7030';
    ctx.fillRect(tx - 30, CH * 0.15, 70, 50);
    ctx.fillStyle = '#3a8a3a';
    ctx.fillRect(tx - 20, CH * 0.1, 50, 30);
  }
  // DNA helix trees:
  for (let dna = 0; dna < 3; dna++) {
    const dx = CW * 0.15 + dna * (CW * 0.3);
    for (let i = 0; i < 25; i++) {
      const ang = (i / 25) * Math.PI * 6 + t * 0.3;
      const helixY = CH * 0.15 + i * (CH * 0.6 / 25);
      ctx.fillStyle = '#3355ff';
      ctx.fillRect(dx + Math.cos(ang) * 20 - 4, helixY, 8, 8);
      ctx.fillStyle = '#aa44ff';
      ctx.fillRect(dx + Math.cos(ang + Math.PI) * 20 - 4, helixY, 8, 8);
      if (i % 3 === 0) {
        const colors = ['#33cc44', '#cc3333', '#3366ff', '#ffcc00'];
        ctx.fillStyle = colors[i % 4];
        ctx.fillRect(dx + Math.cos(ang) * 20, helixY + 3, Math.abs(Math.cos(ang + Math.PI) * 40 - Math.cos(ang) * 40), 2);
      }
    }
  }
  // Cherry blossoms:
  for (let b = 0; b < 60; b++) {
    const bx = CW * 0.7 + (b * 37) % 100 - 50;
    const by = CH * 0.1 + (b * 53) % 80;
    ctx.fillStyle = b % 2 === 0 ? '#ffaabb' : '#ff88aa';
    ctx.fillRect(bx, by, 4, 4);
  }
  // Path:
  ctx.fillStyle = '#c8a87a';
  ctx.fillRect(CW * 0.3, CH * 0.75, 80, CH * 0.25);
  ctx.fillRect(CW * 0.35, CH * 0.55, 60, CH * 0.2);
  ctx.fillRect(CW * 0.4, CH * 0.4, 45, CH * 0.15);
  // Waterfall:
  for (let w = 0; w < 8; w++) {
    const wProgress = ((t * 30 + w * 10) % 100) / 100;
    ctx.fillStyle = w % 2 === 0 ? '#eeffff' : '#aaddff';
    ctx.fillRect(CW * 0.88 + w * 4, CH * 0.3 + wProgress * CH * 0.4, 4, 20);
  }
  // Bridge:
  ctx.fillStyle = '#8B6040';
  ctx.fillRect(CW * 0.45, CH * 0.68, 80, 8);
  for (let p = 0; p < 3; p++) {
    ctx.fillStyle = '#6b4a20';
    ctx.fillRect(CW * 0.45 + p * 35, CH * 0.62, 6, 12);
  }
  ctx.fillStyle = '#2266aa';
  ctx.fillRect(CW * 0.3, CH * 0.7, CW * 0.25, 12);
  ctx.fillStyle = '#33aacc';
  for (let s = 0; s < 5; s++) {
    ctx.fillRect(CW * 0.3 + (t * 20 + s * 40) % 200, CH * 0.71, 20, 4);
  }
}

function drawNeuralNebulaBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  ctx.fillStyle = '#030308'; ctx.fillRect(0, 0, CW, CH);
  // Stars:
  for (let s = 0; s < 200; s++) {
    const sx = (s * 137 + s * s * 7) % CW;
    const sy = (s * 97 + s * s * 3) % CH;
    const brightness = 0.3 + 0.7 * Math.sin(t * 2 + s * 0.3);
    ctx.fillStyle = s % 3 === 0 ? `rgba(170,170,255,${brightness})` : `rgba(255,255,255,${brightness * 0.5})`;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.fillStyle = '#1a0a3a';
  ctx.fillRect(CW * 0.3, CH * 0.1, CW * 0.5, CH * 0.6);
  // Neural network:
  const nodes: [number, number][] = [
    [0.5, 0.8], [0.4, 0.6], [0.6, 0.6], [0.3, 0.45], [0.5, 0.4], [0.7, 0.45],
    [0.25, 0.3], [0.4, 0.25], [0.6, 0.25], [0.75, 0.3], [0.35, 0.15], [0.65, 0.15], [0.5, 0.08],
  ];
  const connections: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 10], [7, 10], [7, 11], [8, 11], [9, 11], [10, 12], [11, 12]];
  connections.forEach(([a, b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    const alpha = 0.3 + 0.2 * Math.sin(t * 1.5 + a * 0.5);
    ctx.fillStyle = `rgba(85,34,204,${alpha})`;
    for (let i = 0; i <= 20; i++) {
      const px = ax * CW + (bx - ax) * CW * i / 20;
      const py = ay * CH + (by - ay) * CH * i / 20;
      ctx.fillRect(px, py, 2, 2);
    }
  });
  nodes.forEach(([nx, ny], i) => {
    const pulse = 0.7 + 0.3 * Math.sin(t * 2 + i * 0.7);
    ctx.fillStyle = i % 2 === 0 ? `rgba(0,255,255,${pulse})` : `rgba(170,68,255,${pulse})`;
    ctx.fillRect(nx * CW - 5, ny * CH - 5, 10, 10);
  });
  // Floating platforms:
  ([[0.2, 0.65], [0.5, 0.55], [0.8, 0.65], [0.35, 0.45], [0.7, 0.35]] as [number, number][]).forEach(([px, py], i) => {
    const bob = Math.sin(t * 0.5 + i) * 6;
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(px * CW - 40, py * CH + bob, 80, 18);
    ctx.fillStyle = '#2a2a4a';
    ctx.fillRect(px * CW - 38, py * CH + bob, 76, 10);
  });
  // Crystals:
  ([[0.05, 0.7], [0.95, 0.6], [0.1, 0.4], [0.9, 0.4]] as [number, number][]).forEach(([cx, cy], i) => {
    for (let c = 0; c < 5; c++) {
      const ch2 = 20 + c * 8;
      const glow = 0.5 + 0.5 * Math.sin(t + c);
      ctx.fillStyle = `rgba(102,0,204,${glow})`;
      ctx.fillRect(cx * CW - 20 + c * 10, cy * CH - ch2, 8, ch2);
    }
  });
  ctx.fillStyle = '#0d0830';
  ctx.fillRect(0, CH * 0.8, CW, CH * 0.2);
}

function drawProteinCathedralBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  ctx.fillStyle = '#141020'; ctx.fillRect(0, 0, CW, CH);
  // Floor tiles:
  for (let ty = 0; ty < 8; ty++) {
    for (let tx2 = 0; tx2 < 16; tx2++) {
      if ((tx2 + ty) % 2 === 0) {
        ctx.fillStyle = '#181528';
        ctx.fillRect(tx2 * (CW / 16), CH * 0.75 + ty * 20, CW / 16, 20);
      }
    }
  }
  // Light beam:
  ctx.fillStyle = 'rgba(200,168,255,0.05)';
  ctx.fillRect(CW * 0.35, 0, CW * 0.3, CH * 0.8);
  // Pillars:
  [0.08, 0.18, 0.28, 0.72, 0.82, 0.92].forEach((px) => {
    ctx.fillStyle = '#2a2030';
    ctx.fillRect(px * CW - 15, CH * 0.05, 30, CH * 0.75);
    ctx.fillStyle = '#3a3048';
    ctx.fillRect(px * CW - 12, CH * 0.05, 24, CH * 0.75);
    ctx.fillStyle = '#4a4060';
    ctx.fillRect(px * CW - 18, CH * 0.05, 36, 15);
    ctx.fillStyle = '#5a5075';
    ctx.fillRect(px * CW - 20, CH * 0.04, 40, 8);
  });
  // Stained glass:
  const winColors = ['#2266ff', '#4488ff', '#8833ff', '#aa55ff', '#ffaa00', '#33cc55', '#ff4444'];
  for (let wy = 0; wy < 8; wy++) {
    for (let wx2 = 0; wx2 < 12; wx2++) {
      ctx.fillStyle = winColors[(wx2 + wy) % winColors.length];
      ctx.fillRect(CW * 0.35 + wx2 * (CW * 0.3 / 12), wy * (CH * 0.5 / 8), CW * 0.3 / 12 - 1, CH * 0.5 / 8 - 1);
    }
  }
  ctx.fillStyle = '#4a3a30';
  ctx.fillRect(CW * 0.34, 0, 6, CH * 0.52);
  ctx.fillRect(CW * 0.66, 0, 6, CH * 0.52);
  // Floating protein:
  const proteinBob = Math.sin(t * 0.7) * 10;
  const pX = CW * 0.5, pY = CH * 0.45 + proteinBob;
  for (let h = 0; h < 8; h++) {
    const angle = h * 0.8 + t * 0.3;
    ctx.fillStyle = h % 2 === 0 ? '#2244aa' : '#88aaff';
    ctx.fillRect(pX + Math.cos(angle) * 25 - 5, pY + h * 8 - 30, 10, 8);
  }
  for (let b = 0; b < 3; b++) {
    ctx.fillStyle = '#4466ff';
    ctx.fillRect(pX - 30 + b * 25, pY, 20, 8);
    ctx.fillRect(pX - 24 + b * 25, pY - 5, 8, 5);
  }
  const glowPulse = 0.5 + 0.5 * Math.sin(t * 1.5);
  ctx.fillStyle = `rgba(0,200,255,${glowPulse * 0.3})`;
  ctx.fillRect(pX - 40, pY - 40, 80, 80);
  // Crystal corners:
  ([[0.02, 0.7], [0.98, 0.7]] as [number, number][]).forEach(([cx, cy]) => {
    for (let c = 0; c < 5; c++) {
      ctx.fillStyle = '#6600cc';
      ctx.fillRect(cx * CW - 5 + c * 8, cy * CH - c * 15, 8, c * 15 + 5);
    }
  });
  // Altar steps:
  for (let s = 0; s < 3; s++) {
    ctx.fillStyle = '#1a1828';
    ctx.fillRect(CW * 0.4 - s * 10, CH * 0.7 + s * 6, CW * 0.2 + s * 20, 6);
  }
}

// ─── Welcome sign ─────────────────────────────────────────────────────────────
function drawWelcomeSign(
  ctx: CanvasRenderingContext2D,
  realm: number,
  alpha: number,
  CH: number,
) {
  ctx.fillStyle = `rgba(139,115,85,${alpha})`;
  ctx.fillRect(80, CH * 0.5, 8, CH * 0.25);
  ctx.fillStyle = `rgba(10,26,10,${alpha})`;
  ctx.fillRect(50, CH * 0.35, 160, 90);
  const borderR = realm === 1 ? '0,255,170' : realm === 2 ? '82,183,136' : realm === 3 ? '168,85,247' : '0,255,255';
  ctx.fillStyle = `rgba(${borderR},${alpha})`;
  ctx.fillRect(50, CH * 0.35, 160, 3);
  ctx.fillRect(50, CH * 0.35 + 90, 160, 3);
  ctx.fillRect(50, CH * 0.35, 3, 90);
  ctx.fillRect(207, CH * 0.35, 3, 90);
}

// ─── Terminal ─────────────────────────────────────────────────────────────────
const terminalLines: Record<number, string[]> = {
  1: ['$ python learn.py', 'Loading world...', 'Welcome, explorer.', '$ _'],
  2: ['$ analyze_genome.sh', 'Loading data...', 'Building insights...', '$ _'],
  3: ['$ train_model.py', 'Initializing...', 'Entering Neural Nebula.', '$ _'],
  4: ['$ run_alphafold.py', 'Loading structures...', 'Welcome to Cathedral.', '$ _'],
};

function drawTerminal(
  ctx: CanvasRenderingContext2D,
  realm: number,
  visibleLines: number,
  CW: number,
  CH: number,
) {
  const lines = terminalLines[realm];
  const panelW = 240, panelH = 100;
  const px = CW - panelW - 20, py = CH - panelH - 20;
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(px, py, panelW, panelH);
  ctx.fillStyle = '#22ff44';
  ctx.fillRect(px, py, panelW, 2);
  ctx.fillRect(px, py + panelH - 2, panelW, 2);
  ctx.fillRect(px, py, 2, panelH);
  ctx.fillRect(px + panelW - 2, py, 2, panelH);
  // Text lines:
  ctx.font = '11px monospace';
  const count = Math.min(visibleLines, lines.length);
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = i === 0 ? '#ffffff' : '#22ff44';
    ctx.fillText(lines[i], px + 10, py + 18 + i * 20);
  }
}

// ─── Phase type ───────────────────────────────────────────────────────────────
type Phase = 'fade-in' | 'walk-in' | 'settle' | 'labels' | 'terminal' | 'done';

// ─── Component ────────────────────────────────────────────────────────────────
export default function WorldEntryAnimation({ realm, onComplete }: WorldEntryAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { avatar } = useGameStore();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stateRef = useRef({
    t: 0,
    phase: 'fade-in' as Phase,
    fadeAlpha: 1,
    avatarX: -60,
    avatarY: 0,
    walkPhase: 0,
    enzymeX: -100,
    enzymeSitting: false,
    labelAlpha: 0,
    signAlpha: 0,
    terminalLines: 0,
    canSkip: false,
    startTime: -1,
    rafId: 0,
  });

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    if (state.startTime < 0) state.startTime = timestamp;
    const t = (timestamp - state.startTime) / 1000; // seconds
    state.t = t;

    // Enable skip after 2s
    if (t >= 2 && !state.canSkip) state.canSkip = true;

    const CW = canvas.width;
    const CH = canvas.height;

    // Draw background for current realm
    const bgT = t * 1.2;
    if (realm === 1) drawCytoplasmBG(ctx, CW, CH, bgT);
    else if (realm === 2) drawGenomeForestBG(ctx, CW, CH, bgT);
    else if (realm === 3) drawNeuralNebulaBG(ctx, CW, CH, bgT);
    else drawProteinCathedralBG(ctx, CW, CH, bgT);

    const groundY = CH * 0.75 - 80;

    // Phase: walk-in (0.5 → 3.5s)
    if (t >= 0.5 && t < 3.5) {
      const prog = (t - 0.5) / 3.0;
      state.avatarX = -60 + prog * (CW * 0.3 + 60);
      state.enzymeX = -100 + prog * (CW * 0.26 + 100);
      state.walkPhase = t * 8;
      state.enzymeSitting = false;
    }
    // Phase: settle (3.5 → 4.5s)
    if (t >= 3.5 && t < 4.5) {
      state.enzymeSitting = true;
      state.walkPhase = 0;
    }
    // Phase: labels + sign (4.5 → 6.0s)
    if (t >= 4.5 && t < 6.0) {
      const prog = (t - 4.5) / 1.5;
      state.labelAlpha = Math.min(1, prog * 2);
      state.signAlpha = Math.min(1, prog);
    }
    // Phase: terminal (6.0 → 7.0s)
    if (t >= 6.0 && t < 7.0) {
      state.labelAlpha = 1;
      state.signAlpha = 1;
      state.terminalLines = Math.floor((t - 6.0) / 0.25) + 1;
    }
    // Done
    if (t >= 7.0) {
      if (state.phase !== 'done') {
        state.phase = 'done';
        onCompleteRef.current();
        return;
      }
      return;
    }

    // Draw avatar + enzyme if walk started
    if (t >= 0.5) {
      drawEnzyme(ctx, state.enzymeX, groundY + 40, state.walkPhase, state.enzymeSitting);
      drawAvatarBack(ctx, state.avatarX, groundY, state.walkPhase, avatar);
    }

    // Draw sign if visible
    if (state.signAlpha > 0) {
      drawWelcomeSign(ctx, realm, state.signAlpha, CH);
      // World name text
      const names = ['', 'THE CYTOPLASM', 'GENOME FOREST', 'NEURAL NEBULA', 'PROTEIN CATHEDRAL'];
      const nameColors = ['', '#00ffaa', '#52b788', '#a855f7', '#00ffff'];
      ctx.globalAlpha = state.signAlpha;
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = nameColors[realm];
      ctx.fillText(names[realm], 65, CH * 0.35 + 30);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#aaaaaa';
      ctx.fillText('WORLD ' + realm, 65, CH * 0.35 + 50);
      ctx.globalAlpha = 1;
    }

    // Draw topic labels
    if (state.labelAlpha > 0) {
      const topicsByRealm: Record<number, string[]> = {
        1: ['CELL BIOLOGY', 'ORGANELLES', 'METABOLISM'],
        2: ['DNA & RNA', 'GENETICS', 'EVOLUTION'],
        3: ['NEUROSCIENCE', 'AI & BRAIN', 'COGNITION'],
        4: ['PROTEINS', 'FOLDING', 'DRUG DESIGN'],
      };
      const topics = topicsByRealm[realm];
      ctx.globalAlpha = state.labelAlpha;
      ctx.font = '10px monospace';
      topics.forEach((topic, i) => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(CW * 0.5 - 10, CH * 0.2 + i * 35, 8, 8);
        ctx.fillStyle = '#cccccc';
        ctx.fillText(topic, CW * 0.5 + 5, CH * 0.2 + i * 35 + 8);
      });
      ctx.globalAlpha = 1;
    }

    // Draw terminal
    if (t >= 6.0) {
      drawTerminal(ctx, realm, state.terminalLines, CW, CH);
    }

    // Fade overlay
    const fadeAlpha = t < 0.5 ? 1 - t / 0.5 : 0;
    if (fadeAlpha > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    state.rafId = requestAnimationFrame(draw);
  }, [realm, avatar]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    stateRef.current.startTime = -1;
    stateRef.current.rafId = requestAnimationFrame(draw);

    const handleKey = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && stateRef.current.canSkip) {
        cancelAnimationFrame(stateRef.current.rafId);
        onCompleteRef.current();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(stateRef.current.rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
    };
  }, [draw]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', imageRendering: 'pixelated', width: '100%', height: '100%' }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          color: '#555',
          fontFamily: 'monospace',
          fontSize: 12,
          transition: 'opacity 0.3s',
          opacity: stateRef.current.canSkip ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        [ SPACE to skip ]
      </div>
    </div>
  );
}
