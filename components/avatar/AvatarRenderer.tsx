'use client';
import { useEffect, useRef, useCallback } from 'react';
import type { AvatarConfig } from '@/lib/types';

interface Props {
  config: AvatarConfig;
  size?: number;
  animate?: boolean;
  className?: string;
  expression?: 'idle' | 'happy' | 'surprised' | 'excited';
}

// Game pixel scale for this renderer (preview mode — 4x for large character select)
const S = 4;

// Helper: fill a game-pixel rect (x, y, w, h are in game pixels)
function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x * S, y * S, w * S, h * S);
}

// ─── Hair styles ────────────────────────────────────────────────────────────
// Avatar head: game pixels 2–17 wide (16px wide), y 2–16 (14px tall) centered on 100px canvas
// Head origin: hx=7, hy=4 (game pixels)
// Head width: 10gp, head height: 12gp

function drawHair(
  ctx: CanvasRenderingContext2D,
  style: number,
  color: string,
  hx: number,
  hy: number,
) {
  ctx.fillStyle = color;
  const s = style % 20;
  switch (s) {
    case 0: // Buzz Cut — very thin strip on top
      px(ctx, hx, hy - 1, 10, 1, color);
      break;
    case 1: // Short Neat
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx - 1, hy, 2, 2, color);
      px(ctx, hx + 9, hy, 2, 2, color);
      break;
    case 2: // Side Part
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx - 1, hy, 1, 3, color);
      px(ctx, hx + 10, hy, 1, 3, color);
      px(ctx, hx + 7, hy - 3, 3, 1, color); // swept right
      break;
    case 3: // Tousled — messy spiky top
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx + 1, hy - 4, 2, 2, color);
      px(ctx, hx + 4, hy - 3, 2, 2, color);
      px(ctx, hx + 7, hy - 4, 2, 2, color);
      px(ctx, hx - 1, hy, 2, 3, color);
      px(ctx, hx + 9, hy, 2, 3, color);
      break;
    case 4: // Long Straight
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx - 1, hy, 2, 10, color);
      px(ctx, hx + 9, hy, 2, 10, color);
      break;
    case 5: // Long Wavy
      px(ctx, hx, hy - 2, 10, 2, color);
      // Left side waves
      px(ctx, hx - 1, hy, 2, 3, color);
      px(ctx, hx, hy + 3, 2, 3, color);
      px(ctx, hx - 1, hy + 6, 2, 4, color);
      // Right side waves
      px(ctx, hx + 9, hy, 2, 3, color);
      px(ctx, hx + 8, hy + 3, 2, 3, color);
      px(ctx, hx + 9, hy + 6, 2, 4, color);
      break;
    case 6: // Curly Short
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx - 1, hy - 1, 2, 3, color);
      px(ctx, hx + 9, hy - 1, 2, 3, color);
      px(ctx, hx + 2, hy - 3, 2, 2, color);
      px(ctx, hx + 6, hy - 3, 2, 2, color);
      break;
    case 7: // Curly Long
      px(ctx, hx, hy - 2, 10, 3, color);
      px(ctx, hx - 2, hy, 3, 3, color);
      px(ctx, hx - 1, hy + 3, 2, 3, color);
      px(ctx, hx - 2, hy + 6, 3, 4, color);
      px(ctx, hx + 9, hy, 3, 3, color);
      px(ctx, hx + 9, hy + 3, 2, 3, color);
      px(ctx, hx + 9, hy + 6, 3, 4, color);
      break;
    case 8: // Afro Small
      px(ctx, hx - 1, hy - 2, 12, 3, color);
      px(ctx, hx - 2, hy, 2, 4, color);
      px(ctx, hx + 10, hy, 2, 4, color);
      px(ctx, hx + 1, hy - 4, 8, 2, color);
      break;
    case 9: // Afro Large
      px(ctx, hx - 2, hy - 3, 14, 4, color);
      px(ctx, hx - 3, hy, 3, 6, color);
      px(ctx, hx + 10, hy, 3, 6, color);
      px(ctx, hx, hy - 5, 10, 2, color);
      break;
    case 10: // Twin Tails
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx - 2, hy + 1, 3, 9, color);
      px(ctx, hx + 9, hy + 1, 3, 9, color);
      break;
    case 11: // High Ponytail
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx + 4, hy - 6, 2, 4, color);
      px(ctx, hx + 3, hy - 6, 4, 2, color);
      px(ctx, hx + 5, hy - 6, 2, 12, color);
      break;
    case 12: // Low Ponytail
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx + 8, hy + 8, 2, 8, color);
      px(ctx, hx - 1, hy, 2, 4, color);
      px(ctx, hx + 9, hy, 2, 4, color);
      break;
    case 13: // Space Buns
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx - 1, hy - 4, 4, 4, color); // left bun
      px(ctx, hx + 7, hy - 4, 4, 4, color); // right bun
      break;
    case 14: // Mohawk
      px(ctx, hx + 4, hy - 6, 2, 6, color);
      px(ctx, hx + 3, hy - 4, 4, 2, color);
      break;
    case 15: // Fauxhawk
      px(ctx, hx + 3, hy - 4, 4, 4, color);
      px(ctx, hx + 1, hy - 2, 8, 2, color);
      px(ctx, hx, hy - 1, 10, 1, color);
      break;
    case 16: // Top Bun
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx + 3, hy - 5, 4, 3, color);
      px(ctx, hx + 2, hy - 4, 6, 2, color);
      break;
    case 17: // Side Braid
      px(ctx, hx, hy - 2, 10, 2, color);
      px(ctx, hx - 1, hy, 2, 3, color);
      // braid segments alternating
      for (let i = 0; i < 5; i++) {
        px(ctx, hx - 2 + (i % 2), hy + 3 + i * 2, 3, 2, color);
      }
      break;
    case 18: // Cornrows — parallel rows
      px(ctx, hx, hy - 1, 10, 1, color);
      for (let row = 0; row < 5; row++) {
        px(ctx, hx + row * 2, hy, 1, 8, color);
      }
      break;
    case 19: // Dreadlocks
      px(ctx, hx, hy - 2, 10, 2, color);
      for (let lock = 0; lock < 5; lock++) {
        px(ctx, hx + lock * 2, hy, 1, 10, color);
        if (lock % 2 === 0) px(ctx, hx + lock * 2, hy + 10, 1, 3, color);
      }
      break;
    default:
      px(ctx, hx, hy - 2, 10, 2, color);
  }
}

// ─── Headwear ────────────────────────────────────────────────────────────────
function drawHeadwear(
  ctx: CanvasRenderingContext2D,
  style: number,
  color: string,
  hx: number,
  hy: number,
) {
  if (style === 0) return;
  switch (style % 20) {
    case 1: // Beanie
      px(ctx, hx - 1, hy - 3, 12, 4, color);
      px(ctx, hx, hy - 4, 10, 1, '#ffffff40');
      break;
    case 2: // Cap backwards
      px(ctx, hx, hy - 2, 10, 3, color);
      px(ctx, hx - 3, hy, 3, 1, color); // brim at back
      break;
    case 3: // Cap forwards
      px(ctx, hx, hy - 2, 10, 3, color);
      px(ctx, hx + 8, hy, 4, 1, color); // brim front
      break;
    case 4: // Beret
      px(ctx, hx - 1, hy - 3, 12, 3, color);
      px(ctx, hx + 6, hy - 5, 4, 3, color); // puff to side
      break;
    case 5: // Graduation Cap
      px(ctx, hx - 1, hy - 2, 12, 2, color);
      px(ctx, hx + 1, hy - 5, 8, 2, color); // flat top
      px(ctx, hx + 8, hy - 5, 1, 4, '#f59e0b'); // tassel
      break;
    case 6: // Hard Hat
      px(ctx, hx - 1, hy - 4, 12, 5, '#f59e0b');
      px(ctx, hx - 2, hy, 14, 1, '#d97706');
      break;
    case 7: // Crown
      px(ctx, hx, hy - 2, 10, 2, '#f59e0b');
      // spikes
      px(ctx, hx + 1, hy - 5, 2, 3, '#f59e0b');
      px(ctx, hx + 4, hy - 4, 2, 2, '#f59e0b');
      px(ctx, hx + 7, hy - 5, 2, 3, '#f59e0b');
      // gems
      px(ctx, hx + 1, hy - 4, 2, 1, '#dc2626');
      px(ctx, hx + 7, hy - 4, 2, 1, '#3b82f6');
      break;
    case 8: // Bucket Hat
      px(ctx, hx, hy - 2, 10, 3, color);
      px(ctx, hx - 2, hy + 1, 14, 1, color);
      break;
    case 9: // Bandana
      px(ctx, hx, hy - 1, 10, 2, color);
      px(ctx, hx + 3, hy - 3, 4, 2, color); // knot on top
      break;
    case 10: // Headband
      px(ctx, hx, hy - 1, 10, 1, color);
      break;
    case 11: // Top Hat
      px(ctx, hx + 1, hy - 7, 8, 6, color);
      px(ctx, hx - 1, hy - 1, 12, 2, color);
      px(ctx, hx + 2, hy - 7, 6, 1, '#ffffff20');
      break;
    case 12: // Witch Hat
      px(ctx, hx + 4, hy - 9, 2, 3, color);
      px(ctx, hx + 3, hy - 7, 4, 2, color);
      px(ctx, hx + 2, hy - 5, 6, 2, color);
      px(ctx, hx, hy - 3, 10, 2, color);
      px(ctx, hx - 1, hy - 1, 12, 1, color);
      break;
    case 13: // Party Hat
      px(ctx, hx + 3, hy - 7, 4, 2, '#ec4899');
      px(ctx, hx + 2, hy - 5, 6, 2, '#f59e0b');
      px(ctx, hx + 1, hy - 3, 8, 2, '#ec4899');
      px(ctx, hx + 5, hy - 8, 1, 1, '#ffffff'); // pom
      break;
    case 14: // Helmet
      px(ctx, hx - 1, hy - 4, 12, 5, color);
      px(ctx, hx + 2, hy, 6, 2, '#374151'); // visor
      break;
    case 15: // Headphones On Head
      px(ctx, hx - 2, hy - 1, 3, 4, '#374151');
      px(ctx, hx + 9, hy - 1, 3, 4, '#374151');
      px(ctx, hx, hy - 3, 10, 2, '#4b5563');
      break;
    case 16: // Shades On Head
      px(ctx, hx + 1, hy - 1, 3, 2, '#1a1a1a');
      px(ctx, hx + 6, hy - 1, 3, 2, '#1a1a1a');
      px(ctx, hx + 4, hy - 1, 2, 1, '#374151');
      break;
    case 17: // Lab Safety Goggles
      px(ctx, hx, hy - 1, 10, 2, '#9ca3af');
      px(ctx, hx + 2, hy - 1, 2, 2, '#bfdbfe50');
      px(ctx, hx + 6, hy - 1, 2, 2, '#bfdbfe50');
      break;
    case 18: // Flower Crown
      for (let i = 0; i < 5; i++) {
        px(ctx, hx + i * 2, hy - 2, 1, 1, i % 2 === 0 ? '#ec4899' : '#f59e0b');
      }
      px(ctx, hx, hy - 1, 10, 1, '#16a34a');
      break;
    case 19: // Halo
      px(ctx, hx + 1, hy - 4, 8, 1, '#f59e0b');
      px(ctx, hx, hy - 3, 10, 1, '#fbbf24');
      px(ctx, hx + 1, hy - 2, 8, 1, '#f59e0b');
      break;
    default:
      break;
  }
}

// ─── Skin Markings ───────────────────────────────────────────────────────────
function drawSkinMarkings(
  ctx: CanvasRenderingContext2D,
  style: number,
  hx: number,
  hy: number,
) {
  switch (style % 8) {
    case 0:
      break;
    case 1: // Freckles
      ctx.fillStyle = '#8b5e3c80';
      const frecklePos = [[hx+2,hy+5],[hx+7,hy+5],[hx+3,hy+6],[hx+6,hy+6],[hx+4,hy+5],[hx+5,hy+4]];
      for (const [fx, fy] of frecklePos) {
        ctx.fillRect(fx * S, fy * S, S, S);
      }
      break;
    case 2: // Rosy Cheeks
      ctx.fillStyle = '#f472b660';
      ctx.fillRect((hx+1)*S, (hy+5)*S, 2*S, 1*S);
      ctx.fillRect((hx+7)*S, (hy+5)*S, 2*S, 1*S);
      break;
    case 3: // Scar
      px(ctx, hx + 6, hy + 4, 1, 3, '#8B451380');
      break;
    case 4: // Face Paint Stripes
      px(ctx, hx + 2, hy + 3, 1, 4, '#3b82f6');
      px(ctx, hx + 4, hy + 2, 1, 5, '#ec4899');
      px(ctx, hx + 7, hy + 3, 1, 4, '#3b82f6');
      break;
    case 5: // Vitiligo
      ctx.fillStyle = '#fff5ee60';
      ctx.fillRect((hx+3)*S, (hy+3)*S, 3*S, 3*S);
      ctx.fillRect((hx+7)*S, (hy+6)*S, 2*S, 2*S);
      break;
    case 6: // Mole
      px(ctx, hx + 7, hy + 7, 1, 1, '#3d2b1f');
      break;
    case 7: // Star Tattoo (near eye)
      px(ctx, hx + 8, hy + 4, 1, 1, '#f59e0b');
      px(ctx, hx + 7, hy + 5, 3, 1, '#f59e0b');
      px(ctx, hx + 8, hy + 6, 1, 1, '#f59e0b');
      break;
    default:
      break;
  }
}

// ─── Eyes ────────────────────────────────────────────────────────────────────
function drawEyes(
  ctx: CanvasRenderingContext2D,
  eyeShape: number,
  eyeColor: string,
  expression: number,
  blink: boolean,
  hx: number,
  hy: number,
) {
  const lx = hx + 2; // left eye game-x
  const rx = hx + 7; // right eye game-x
  const ey = hy + 5; // eye game-y

  if (blink) {
    // closed eyes — horizontal bar
    px(ctx, lx, ey, 2, 1, '#1a1a1a');
    px(ctx, rx, ey, 2, 1, '#1a1a1a');
    return;
  }

  // Choose shape based on expression
  const isHappy = expression === 1 || expression === 2 || expression === 4;
  const isSleepy = expression === 7;
  const isSurprised = expression === 4;

  if (isHappy && !isSurprised) {
    // Curved happy eyes
    px(ctx, lx, ey, 2, 1, eyeColor);
    px(ctx, lx + 1, ey - 1, 1, 1, eyeColor);
    px(ctx, rx, ey, 2, 1, eyeColor);
    px(ctx, rx + 1, ey - 1, 1, 1, eyeColor);
    return;
  }
  if (isSleepy) {
    px(ctx, lx, ey, 2, 1, eyeColor);
    px(ctx, rx, ey, 2, 1, eyeColor);
    // half-lid
    px(ctx, lx, ey - 1, 2, 1, '#1a1a1a80');
    px(ctx, rx, ey - 1, 2, 1, '#1a1a1a80');
    return;
  }

  const s = eyeShape % 8;
  switch (s) {
    case 0: // Round
    case 2: // Wide
      px(ctx, lx, ey - 1, 2, 2, eyeColor);
      px(ctx, rx, ey - 1, 2, 2, eyeColor);
      break;
    case 1: // Almond
      px(ctx, lx, ey, 3, 1, eyeColor);
      px(ctx, lx + 1, ey - 1, 1, 1, eyeColor);
      px(ctx, rx, ey, 3, 1, eyeColor);
      px(ctx, rx + 1, ey - 1, 1, 1, eyeColor);
      break;
    case 3: // Sleepy shape
      px(ctx, lx, ey, 2, 1, eyeColor);
      px(ctx, rx, ey, 2, 1, eyeColor);
      break;
    case 4: // Determined
      px(ctx, lx, ey, 2, 2, eyeColor);
      px(ctx, rx, ey, 2, 2, eyeColor);
      // furrowed brow hint
      px(ctx, lx, ey - 2, 3, 1, '#1a1a1a');
      px(ctx, rx, ey - 2, 3, 1, '#1a1a1a');
      break;
    case 5: // Starry
      px(ctx, lx, ey - 1, 2, 2, eyeColor);
      px(ctx, rx, ey - 1, 2, 2, eyeColor);
      px(ctx, lx + 1, ey, 1, 1, '#ffffff');
      px(ctx, rx + 1, ey, 1, 1, '#ffffff');
      px(ctx, lx, ey - 1, 1, 1, '#ffffff60');
      px(ctx, rx, ey - 1, 1, 1, '#ffffff60');
      break;
    case 6: // Heavy-lid
      px(ctx, lx, ey, 3, 2, eyeColor);
      px(ctx, rx, ey, 3, 2, eyeColor);
      px(ctx, lx, ey, 3, 1, '#1a1a1a70');
      px(ctx, rx, ey, 3, 1, '#1a1a1a70');
      break;
    case 7: // Anime Large
      px(ctx, lx - 1, ey - 1, 3, 3, eyeColor);
      px(ctx, rx, ey - 1, 3, 3, eyeColor);
      px(ctx, lx, ey, 1, 1, '#ffffff');
      px(ctx, rx + 1, ey, 1, 1, '#ffffff');
      break;
    default:
      px(ctx, lx, ey, 2, 2, eyeColor);
      px(ctx, rx, ey, 2, 2, eyeColor);
  }
  // Pupils / shine
  if (s !== 5 && s !== 7) {
    px(ctx, lx + 1, ey, 1, 1, '#00000080');
    px(ctx, rx + 1, ey, 1, 1, '#00000080');
  }
}

// ─── Eyebrows ────────────────────────────────────────────────────────────────
function drawEyebrows(
  ctx: CanvasRenderingContext2D,
  style: number,
  hairColor: string,
  hx: number,
  hy: number,
) {
  const lx = hx + 2;
  const rx = hx + 7;
  const ey = hy + 3;
  const s = style % 7;
  switch (s) {
    case 0: // Thick
      px(ctx, lx - 1, ey, 3, 1, hairColor);
      px(ctx, rx, ey, 3, 1, hairColor);
      break;
    case 1: // Thin
      px(ctx, lx, ey, 2, 1, hairColor);
      px(ctx, rx, ey, 2, 1, hairColor);
      break;
    case 2: // Arched
      px(ctx, lx, ey + 1, 1, 1, hairColor);
      px(ctx, lx + 1, ey, 1, 1, hairColor);
      px(ctx, lx + 2, ey + 1, 1, 1, hairColor);
      px(ctx, rx, ey + 1, 1, 1, hairColor);
      px(ctx, rx + 1, ey, 1, 1, hairColor);
      px(ctx, rx + 2, ey + 1, 1, 1, hairColor);
      break;
    case 3: // Straight
      px(ctx, lx - 1, ey, 4, 1, hairColor);
      px(ctx, rx - 1, ey, 4, 1, hairColor);
      break;
    case 4: // Bushy
      px(ctx, lx - 1, ey, 3, 2, hairColor);
      px(ctx, rx, ey, 3, 2, hairColor);
      break;
    case 5: // Raised
      px(ctx, lx, ey - 1, 2, 1, hairColor);
      px(ctx, rx, ey - 1, 2, 1, hairColor);
      break;
    case 6: // Furrowed
      px(ctx, lx + 1, ey, 2, 1, hairColor);
      px(ctx, rx, ey, 2, 1, hairColor);
      px(ctx, lx + 2, ey + 1, 1, 1, hairColor);
      px(ctx, rx, ey + 1, 1, 1, hairColor);
      break;
  }
}

// ─── Nose ────────────────────────────────────────────────────────────────────
function drawNose(
  ctx: CanvasRenderingContext2D,
  style: number,
  skinTone: string,
  hx: number,
  hy: number,
) {
  const nx = hx + 4;
  const ny = hy + 7;
  const dark = skinTone + '80';
  switch (style % 5) {
    case 0: px(ctx, nx + 1, ny, 1, 1, dark); break;
    case 1:
      px(ctx, nx, ny, 3, 1, dark);
      px(ctx, nx + 1, ny - 1, 1, 1, dark);
      break;
    case 2:
      px(ctx, nx - 1, ny, 4, 1, dark);
      break;
    case 3:
      px(ctx, nx + 1, ny - 2, 1, 2, dark);
      px(ctx, nx, ny, 3, 1, dark);
      break;
    case 4: // Snub
      px(ctx, nx, ny, 2, 1, dark);
      px(ctx, nx + 1, ny - 1, 1, 1, dark);
      break;
  }
}

// ─── Mouth ───────────────────────────────────────────────────────────────────
function drawMouth(
  ctx: CanvasRenderingContext2D,
  style: number,
  expression: number,
  hx: number,
  hy: number,
) {
  const mx = hx + 3;
  const my = hy + 9;
  const dark = '#2a1505';

  // Expression overrides
  if (expression === 2) { // Big Grin
    px(ctx, mx, my, 5, 1, dark);
    px(ctx, mx, my + 1, 5, 1, '#fde8d0');
    px(ctx, mx, my, 1, 2, dark);
    px(ctx, mx + 4, my, 1, 2, dark);
    return;
  }
  if (expression === 4) { // Excited
    px(ctx, mx + 1, my, 3, 1, dark);
    px(ctx, mx, my + 1, 5, 1, dark);
    return;
  }
  if (expression === 3 || expression === 5) { // Serious / Determined
    px(ctx, mx, my, 4, 1, dark);
    return;
  }
  if (expression === 7) { // Sleepy
    px(ctx, mx + 1, my + 1, 2, 1, dark);
    return;
  }

  switch (style % 8) {
    case 0: // Smile
      px(ctx, mx, my, 4, 1, dark);
      px(ctx, mx, my + 1, 1, 1, dark);
      px(ctx, mx + 3, my + 1, 1, 1, dark);
      break;
    case 1: // Smirk
      px(ctx, mx + 1, my, 3, 1, dark);
      px(ctx, mx + 3, my + 1, 1, 1, dark);
      break;
    case 2: // Neutral
      px(ctx, mx, my, 4, 1, dark);
      break;
    case 3: // Gap-tooth
      px(ctx, mx, my, 4, 1, dark);
      px(ctx, mx, my + 1, 1, 1, dark);
      px(ctx, mx + 3, my + 1, 1, 1, dark);
      px(ctx, mx + 2, my, 1, 2, '#fde8d0'); // gap
      break;
    case 4: // Tiny
      px(ctx, mx + 1, my, 2, 1, dark);
      break;
    case 5: // Open Grin
      px(ctx, mx, my, 5, 1, dark);
      px(ctx, mx, my + 1, 5, 1, dark);
      px(ctx, mx + 1, my + 1, 3, 1, '#fde8d0');
      break;
    case 6: // Frown
      px(ctx, mx, my + 1, 4, 1, dark);
      px(ctx, mx, my, 1, 1, dark);
      px(ctx, mx + 3, my, 1, 1, dark);
      break;
    case 7: // Tongue Out
      px(ctx, mx, my, 4, 1, dark);
      px(ctx, mx + 1, my + 1, 2, 2, '#ec4899');
      break;
  }
}

// ─── Glasses ─────────────────────────────────────────────────────────────────
function drawGlasses(
  ctx: CanvasRenderingContext2D,
  style: number,
  hx: number,
  hy: number,
) {
  if (style === 0) return;
  const ey = hy + 5;
  const lx = hx + 1;
  const rx = hx + 6;
  switch (style % 8) {
    case 1: // Round Wire
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = S * 0.5;
      ctx.beginPath();
      ctx.roundRect(lx * S, (ey - 1) * S, 3 * S, 3 * S, S);
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(rx * S, (ey - 1) * S, 3 * S, 3 * S, S);
      ctx.stroke();
      ctx.strokeStyle = '#9ca3af';
      ctx.beginPath();
      ctx.moveTo((lx + 3) * S, ey * S);
      ctx.lineTo(rx * S, ey * S);
      ctx.stroke();
      break;
    case 2: // Chunky Black
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(lx * S, (ey - 1) * S, 3 * S, 3 * S);
      ctx.fillRect(rx * S, (ey - 1) * S, 3 * S, 3 * S);
      ctx.fillStyle = '#3b82f620';
      ctx.fillRect((lx + 1) * S, ey * S, S, S);
      ctx.fillRect((rx + 1) * S, ey * S, S, S);
      break;
    case 3: // Lab Goggles
      ctx.fillStyle = '#374151';
      ctx.fillRect((lx - 1) * S, (ey - 1) * S, 5 * S, 3 * S);
      ctx.fillRect((rx - 1) * S, (ey - 1) * S, 5 * S, 3 * S);
      ctx.fillStyle = '#bfdbfe30';
      ctx.fillRect(lx * S, ey * S, 3 * S, S);
      ctx.fillRect(rx * S, ey * S, 3 * S, S);
      break;
    case 4: // VR Visor
      px(ctx, hx, ey - 1, 10, 3, '#1a1a1a');
      px(ctx, hx + 1, ey, 8, 1, '#60a5fa30');
      break;
    case 5: // Cat-eye
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.moveTo(lx * S, ey * S);
      ctx.lineTo((lx + 3) * S, (ey - 2) * S);
      ctx.lineTo((lx + 3) * S, (ey + 2) * S);
      ctx.lineTo(lx * S, (ey + 2) * S);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(rx * S, ey * S);
      ctx.lineTo((rx + 3) * S, (ey - 2) * S);
      ctx.lineTo((rx + 3) * S, (ey + 2) * S);
      ctx.lineTo(rx * S, (ey + 2) * S);
      ctx.fill();
      break;
    case 6: // Half-rim
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = S * 0.5;
      ctx.beginPath();
      ctx.moveTo(lx * S, ey * S);
      ctx.lineTo((lx + 3) * S, ey * S);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rx * S, ey * S);
      ctx.lineTo((rx + 3) * S, ey * S);
      ctx.stroke();
      break;
    case 7: // Tinted Blue
      ctx.fillStyle = '#3b82f640';
      ctx.fillRect(lx * S, (ey - 1) * S, 3 * S, 3 * S);
      ctx.fillRect(rx * S, (ey - 1) * S, 3 * S, 3 * S);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = S * 0.4;
      ctx.strokeRect(lx * S, (ey - 1) * S, 3 * S, 3 * S);
      ctx.strokeRect(rx * S, (ey - 1) * S, 3 * S, 3 * S);
      break;
    default:
      break;
  }
}

// ─── Facial Hair ─────────────────────────────────────────────────────────────
function drawFacialHair(
  ctx: CanvasRenderingContext2D,
  style: number,
  color: string,
  hx: number,
  hy: number,
) {
  const my = hy + 9;
  switch (style % 7) {
    case 0: break;
    case 1: // Stubble
      ctx.fillStyle = color + '60';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect((hx + 2 + i) * S, (my + 1) * S, S * 0.5, S * 0.5);
      }
      break;
    case 2: // Full Beard
      px(ctx, hx + 1, my, 8, 3, color + 'cc');
      px(ctx, hx + 2, my + 3, 6, 1, color + 'aa');
      break;
    case 3: // Goatee
      px(ctx, hx + 3, my, 4, 3, color + 'cc');
      break;
    case 4: // Mustache
      px(ctx, hx + 2, my - 1, 2, 1, color);
      px(ctx, hx + 6, my - 1, 2, 1, color);
      break;
    case 5: // Chin Strap
      px(ctx, hx + 1, my, 1, 3, color + 'cc');
      px(ctx, hx + 8, my, 1, 3, color + 'cc');
      px(ctx, hx + 2, my + 3, 6, 1, color + 'cc');
      break;
    case 6: // Soul Patch
      px(ctx, hx + 4, my + 1, 2, 2, color);
      break;
  }
}

// ─── Clothing ────────────────────────────────────────────────────────────────
function drawClothing(
  ctx: CanvasRenderingContext2D,
  style: number,
  primary: string,
  secondary: string,
  cx: number, // body center x (game pixels, left edge)
  cy: number, // body top y
) {
  const s = style % 20;
  // Base torso
  px(ctx, cx, cy, 10, 10, primary);
  // Arms
  px(ctx, cx - 2, cy, 2, 8, primary);
  px(ctx, cx + 10, cy, 2, 8, primary);

  switch (s) {
    case 0: // Lab Coat — white with collar detail
    case 1: // Lab Coat + Tie
      px(ctx, cx, cy, 10, 10, '#f9fafb');
      px(ctx, cx - 2, cy, 2, 8, '#f9fafb');
      px(ctx, cx + 10, cy, 2, 8, '#f9fafb');
      // Lapels
      px(ctx, cx + 2, cy, 2, 5, '#e5e7eb');
      px(ctx, cx + 6, cy, 2, 5, '#e5e7eb');
      if (s === 1) {
        // Tie
        px(ctx, cx + 4, cy + 1, 2, 6, '#dc2626');
        px(ctx, cx + 4, cy + 7, 2, 2, '#991b1b');
      }
      break;
    case 2: // Hoodie
      // Kangaroo pocket
      px(ctx, cx + 2, cy + 5, 6, 4, secondary);
      // Hood strings
      px(ctx, cx + 3, cy + 1, 1, 3, secondary);
      px(ctx, cx + 6, cy + 1, 1, 3, secondary);
      break;
    case 3: // Crop Hoodie — shorter
      px(ctx, cx, cy, 10, 7, primary);
      px(ctx, cx - 2, cy, 2, 6, primary);
      px(ctx, cx + 10, cy, 2, 6, primary);
      px(ctx, cx + 2, cy + 4, 6, 2, secondary);
      break;
    case 4: // Streetwear Tee
      // Logo graphic
      px(ctx, cx + 3, cy + 3, 4, 3, secondary);
      break;
    case 5: // Graphic Tee — bold design
      px(ctx, cx + 2, cy + 2, 6, 5, secondary);
      px(ctx, cx + 4, cy + 1, 2, 7, primary);
      break;
    case 6: // Techwear Jacket
      px(ctx, cx, cy, 10, 10, primary);
      px(ctx, cx - 2, cy, 2, 8, primary);
      px(ctx, cx + 10, cy, 2, 8, primary);
      // Pockets and straps
      px(ctx, cx + 1, cy + 3, 3, 2, secondary);
      px(ctx, cx + 6, cy + 3, 3, 2, secondary);
      px(ctx, cx + 4, cy, 2, 8, secondary + '80');
      break;
    case 7: // Bomber Jacket
      px(ctx, cx, cy, 10, 10, primary);
      px(ctx, cx - 2, cy, 2, 8, primary);
      px(ctx, cx + 10, cy, 2, 8, primary);
      // Ribbed cuffs and hem
      px(ctx, cx, cy + 9, 10, 1, secondary);
      px(ctx, cx - 2, cy + 7, 2, 1, secondary);
      px(ctx, cx + 10, cy + 7, 2, 1, secondary);
      break;
    case 8: // Flannel — plaid pattern
      for (let row = 0; row < 10; row += 2) {
        px(ctx, cx, cy + row, 10, 1, secondary + '80');
      }
      for (let col = 0; col < 10; col += 3) {
        px(ctx, cx + col, cy, 1, 10, secondary + '80');
      }
      break;
    case 9: // Medical Scrubs
      px(ctx, cx, cy, 10, 10, '#0ea5e9');
      px(ctx, cx - 2, cy, 2, 8, '#0ea5e9');
      px(ctx, cx + 10, cy, 2, 8, '#0ea5e9');
      px(ctx, cx + 1, cy + 2, 3, 2, '#0284c7');
      break;
    case 10: // Dress + Sneakers
      px(ctx, cx - 1, cy, 12, 10, primary);
      px(ctx, cx - 2, cy + 4, 14, 6, secondary);
      break;
    case 11: // Sundress
      px(ctx, cx, cy, 10, 4, primary);
      px(ctx, cx - 2, cy + 4, 14, 6, primary);
      // Floral dot detail
      px(ctx, cx + 2, cy + 5, 1, 1, '#ec4899');
      px(ctx, cx + 5, cy + 7, 1, 1, '#f59e0b');
      px(ctx, cx + 8, cy + 5, 1, 1, '#ec4899');
      break;
    case 12: // Suit Jacket
      px(ctx, cx + 1, cy + 1, 8, 9, secondary); // shirt
      px(ctx, cx, cy, 4, 10, primary); // left lapel
      px(ctx, cx + 6, cy, 4, 10, primary); // right lapel
      px(ctx, cx - 2, cy, 2, 8, primary);
      px(ctx, cx + 10, cy, 2, 8, primary);
      break;
    case 13: // Blazer Casual
      px(ctx, cx + 2, cy, 6, 10, secondary); // inner
      px(ctx, cx, cy, 3, 10, primary);
      px(ctx, cx + 7, cy, 3, 10, primary);
      px(ctx, cx - 2, cy, 2, 8, primary);
      px(ctx, cx + 10, cy, 2, 8, primary);
      break;
    case 14: // Vintage Academic — sweater with collar
      px(ctx, cx + 3, cy, 4, 3, '#f9fafb'); // collar
      px(ctx, cx + 3, cy + 3, 4, 7, primary);
      // patches
      px(ctx, cx + 1, cy + 4, 2, 2, secondary);
      break;
    case 15: // Oversized Sweater
      px(ctx, cx - 1, cy, 12, 10, primary);
      px(ctx, cx - 3, cy, 3, 8, primary);
      px(ctx, cx + 10, cy, 3, 8, primary);
      // cuffs
      px(ctx, cx - 3, cy + 7, 3, 1, secondary);
      px(ctx, cx + 10, cy + 7, 3, 1, secondary);
      break;
    case 16: // Tank Top
      px(ctx, cx + 1, cy, 8, 10, primary);
      // no sleeves drawn
      break;
    case 17: // Turtleneck
      px(ctx, cx, cy, 10, 10, primary);
      px(ctx, cx - 2, cy, 2, 8, primary);
      px(ctx, cx + 10, cy, 2, 8, primary);
      px(ctx, cx + 2, cy - 2, 6, 3, primary); // neck
      break;
    case 18: // Varsity Jacket
      px(ctx, cx, cy, 10, 10, primary);
      px(ctx, cx - 2, cy, 2, 8, secondary);
      px(ctx, cx + 10, cy, 2, 8, secondary);
      px(ctx, cx, cy + 9, 10, 1, secondary);
      px(ctx, cx + 6, cy + 3, 3, 3, '#f59e0b'); // varsity letter
      break;
    case 19: // Lab Coat + Hoodie
      px(ctx, cx, cy, 10, 10, '#f9fafb');
      px(ctx, cx - 2, cy, 2, 8, '#f9fafb');
      px(ctx, cx + 10, cy, 2, 8, '#f9fafb');
      px(ctx, cx + 2, cy, 6, 10, secondary); // hoodie showing under
      px(ctx, cx, cy, 2, 10, '#f9fafb');
      px(ctx, cx + 8, cy, 2, 10, '#f9fafb');
      break;
  }
}

// ─── Shoes ───────────────────────────────────────────────────────────────────
function drawShoes(
  ctx: CanvasRenderingContext2D,
  style: number,
  color: string,
  cx: number,
  sy: number,
) {
  const lx = cx;
  const rx = cx + 5;
  const s = style % 15;
  switch (s) {
    case 0: // Sneakers
      px(ctx, lx, sy, 4, 2, color);
      px(ctx, rx, sy, 4, 2, color);
      px(ctx, lx, sy + 1, 5, 1, '#f9fafb'); // sole
      px(ctx, rx, sy + 1, 5, 1, '#f9fafb');
      break;
    case 1: // High Tops
      px(ctx, lx, sy - 1, 4, 3, color);
      px(ctx, rx, sy - 1, 4, 3, color);
      px(ctx, lx + 1, sy - 1, 2, 1, '#ffffff40');
      px(ctx, rx + 1, sy - 1, 2, 1, '#ffffff40');
      break;
    case 2: // Doc Martens
      px(ctx, lx, sy - 1, 4, 3, color);
      px(ctx, rx, sy - 1, 4, 3, color);
      px(ctx, lx, sy + 1, 5, 1, '#f59e0b');
      px(ctx, rx, sy + 1, 5, 1, '#f59e0b');
      break;
    case 3: // Loafers
      px(ctx, lx, sy, 5, 2, color);
      px(ctx, rx, sy, 5, 2, color);
      px(ctx, lx + 1, sy, 1, 1, '#ffffff30');
      px(ctx, rx + 1, sy, 1, 1, '#ffffff30');
      break;
    case 4: // Boots
      px(ctx, lx, sy - 2, 4, 4, color);
      px(ctx, rx, sy - 2, 4, 4, color);
      break;
    case 5: // Sandals
      px(ctx, lx, sy + 1, 4, 1, color);
      px(ctx, rx, sy + 1, 4, 1, color);
      px(ctx, lx + 1, sy, 1, 2, color);
      px(ctx, rx + 1, sy, 1, 2, color);
      break;
    case 6: // Slides
      px(ctx, lx, sy + 1, 5, 1, color);
      px(ctx, rx, sy + 1, 5, 1, color);
      px(ctx, lx + 1, sy, 3, 1, color);
      px(ctx, rx + 1, sy, 3, 1, color);
      break;
    case 7: // Platform Shoes
      px(ctx, lx, sy, 4, 1, color);
      px(ctx, rx, sy, 4, 1, color);
      px(ctx, lx, sy + 1, 5, 2, '#374151');
      px(ctx, rx, sy + 1, 5, 2, '#374151');
      break;
    case 8: // Heeled Boots
      px(ctx, lx, sy - 1, 4, 3, color);
      px(ctx, rx, sy - 1, 4, 3, color);
      px(ctx, lx + 3, sy + 1, 2, 2, '#1a1a1a');
      px(ctx, rx + 3, sy + 1, 2, 2, '#1a1a1a');
      break;
    case 9: // Cleats
      px(ctx, lx, sy, 4, 2, color);
      px(ctx, rx, sy, 4, 2, color);
      px(ctx, lx + 1, sy + 2, 1, 1, '#1a1a1a');
      px(ctx, lx + 3, sy + 2, 1, 1, '#1a1a1a');
      px(ctx, rx + 1, sy + 2, 1, 1, '#1a1a1a');
      px(ctx, rx + 3, sy + 2, 1, 1, '#1a1a1a');
      break;
    case 10: // Crocs
      px(ctx, lx - 1, sy, 6, 2, color);
      px(ctx, rx - 1, sy, 6, 2, color);
      // holes
      px(ctx, lx, sy, 1, 1, color + '80');
      px(ctx, lx + 2, sy, 1, 1, color + '80');
      px(ctx, rx, sy, 1, 1, color + '80');
      px(ctx, rx + 2, sy, 1, 1, color + '80');
      break;
    case 11: // Rain Boots
      px(ctx, lx, sy - 2, 4, 4, color);
      px(ctx, rx, sy - 2, 4, 4, color);
      px(ctx, lx + 1, sy - 2, 2, 1, '#ffffff20');
      px(ctx, rx + 1, sy - 2, 2, 1, '#ffffff20');
      break;
    case 12: // Ballet Flats
      px(ctx, lx, sy + 1, 5, 1, color);
      px(ctx, rx, sy + 1, 5, 1, color);
      px(ctx, lx + 2, sy, 1, 2, color);
      px(ctx, rx + 2, sy, 1, 2, color);
      break;
    case 13: // Oxford Shoes
      px(ctx, lx, sy, 4, 2, color);
      px(ctx, rx, sy, 4, 2, color);
      px(ctx, lx + 1, sy, 2, 1, '#ffffff20');
      px(ctx, rx + 1, sy, 2, 1, '#ffffff20');
      px(ctx, lx, sy + 1, 5, 1, '#1a1a1a');
      px(ctx, rx, sy + 1, 5, 1, '#1a1a1a');
      break;
    case 14: // Socks Only
      px(ctx, lx, sy, 4, 2, '#f9fafb');
      px(ctx, rx, sy, 4, 2, '#f9fafb');
      px(ctx, lx, sy, 4, 1, color);
      px(ctx, rx, sy, 4, 1, color);
      break;
    default:
      px(ctx, lx, sy, 4, 2, color);
      px(ctx, rx, sy, 4, 2, color);
  }
}

// ─── Backpack ────────────────────────────────────────────────────────────────
function drawBackpack(
  ctx: CanvasRenderingContext2D,
  style: number,
  color: string,
  cx: number,
  cy: number,
) {
  if (style === 0) return;
  // Backpack appears on left side of body (avatar's right)
  const bx = cx - 4;
  const by = cy;
  switch (style % 12) {
    case 1: // Lab Pack
      px(ctx, bx, by, 3, 7, color);
      px(ctx, bx, by + 1, 3, 1, '#39ff14');
      px(ctx, bx + 1, by + 3, 1, 2, '#39ff14');
      break;
    case 2: // Mini Backpack
      px(ctx, bx, by + 2, 3, 4, color);
      px(ctx, bx + 1, by + 2, 1, 4, '#ffffff20');
      break;
    case 3: // Drawstring
      px(ctx, bx, by + 1, 3, 6, color);
      px(ctx, bx + 1, by, 1, 2, '#ffffff80');
      px(ctx, bx + 2, by, 1, 2, '#ffffff80');
      break;
    case 4: // Rolltop
      px(ctx, bx, by, 3, 8, color);
      px(ctx, bx, by, 3, 2, secondary(color));
      break;
    case 5: // Military Pack
      px(ctx, bx - 1, by, 4, 8, color);
      px(ctx, bx, by + 2, 2, 2, '#374151');
      px(ctx, bx, by + 5, 2, 2, '#374151');
      break;
    case 6: // School Bag
      px(ctx, bx, by + 1, 3, 7, color);
      px(ctx, bx, by + 1, 3, 1, secondary(color));
      px(ctx, bx + 1, by + 3, 1, 2, '#ffffff40');
      break;
    case 7: // Messenger Bag
      px(ctx, bx - 1, by + 3, 4, 4, color);
      px(ctx, bx, by, 1, 8, '#4b5563');
      break;
    case 8: // Laptop Bag
      px(ctx, bx - 1, by + 2, 4, 5, color);
      px(ctx, bx, by + 3, 2, 3, secondary(color));
      break;
    case 9: // Fanny Pack
      px(ctx, cx + 2, cy + 5, 4, 2, color);
      px(ctx, cx + 3, cy + 5, 2, 1, secondary(color));
      break;
    case 10: // Tote Bag
      px(ctx, bx, by + 3, 3, 6, color);
      px(ctx, bx + 1, by, 1, 4, '#4b5563');
      px(ctx, bx + 2, by, 1, 4, '#4b5563');
      break;
    case 11: // Basket
      px(ctx, bx, by + 2, 3, 5, '#92400e');
      for (let r = 0; r < 5; r += 2) {
        px(ctx, bx, by + 2 + r, 3, 1, '#78350f');
      }
      break;
    default:
      px(ctx, bx, by, 3, 7, color);
  }
}

function secondary(color: string): string {
  // Slightly darken a hex color for secondary detail
  const n = parseInt(color.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - 30);
  const g = Math.max(0, ((n >> 8) & 0xff) - 30);
  const b = Math.max(0, (n & 0xff) - 30);
  return `rgb(${r},${g},${b})`;
}

// ─── Aura ────────────────────────────────────────────────────────────────────
function drawAura(
  ctx: CanvasRenderingContext2D,
  effect: number,
  t: number,
  canvasW: number,
  canvasH: number,
) {
  if (effect === 0) return;
  ctx.save();
  switch (effect % 10) {
    case 1: { // Sparkles
      const sparklePos = [
        [10, 8], [canvasW - 15, 10], [5, canvasH * 0.4], [canvasW - 10, canvasH * 0.5],
        [15, canvasH * 0.7], [canvasW - 20, canvasH * 0.75],
      ];
      sparklePos.forEach(([sx, sy], i) => {
        const alpha = Math.abs(Math.sin(t * 2 + i));
        ctx.fillStyle = `rgba(255,255,100,${alpha * 0.9})`;
        ctx.fillRect(sx - 2, sy - 2, 4, 4);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
        ctx.fillRect(sx - 1, sy - 4, 2, 8);
        ctx.fillRect(sx - 4, sy - 1, 8, 2);
      });
      break;
    }
    case 2: { // Fire
      const fireColors = ['#ff4500', '#ff6b00', '#ffa500', '#ffcc00'];
      for (let i = 0; i < 8; i++) {
        const xPos = 10 + i * (canvasW - 20) / 8;
        const yPos = canvasH - 10 - Math.abs(Math.sin(t * 3 + i)) * 20;
        const alpha = 0.4 + Math.abs(Math.sin(t * 2 + i)) * 0.5;
        ctx.fillStyle = fireColors[i % fireColors.length] + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.fillRect(xPos - 2, yPos, 4, 8);
      }
      break;
    }
    case 3: { // Rainbow
      const rainbowColors = ['#ff0000','#ff7700','#ffff00','#00ff00','#0000ff','#8b00ff'];
      rainbowColors.forEach((c, i) => {
        const alpha = 0.3 + Math.sin(t + i * 0.5) * 0.15;
        ctx.fillStyle = c + Math.round(Math.abs(alpha) * 255).toString(16).padStart(2, '0');
        ctx.fillRect(0, (canvasH / rainbowColors.length) * i, canvasW, canvasH / rainbowColors.length);
      });
      break;
    }
    case 4: { // Electric
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const alpha = Math.abs(Math.sin(t * 5 + i));
        if (alpha > 0.5) {
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvasW, 0);
          ctx.lineTo(Math.random() * canvasW, canvasH);
          ctx.stroke();
        }
      }
      break;
    }
    case 5: { // Galaxy
      const stars = 12;
      for (let i = 0; i < stars; i++) {
        const angle = (i / stars) * Math.PI * 2 + t * 0.5;
        const radius = Math.min(canvasW, canvasH) * 0.45;
        const sx = canvasW / 2 + Math.cos(angle) * radius;
        const sy = canvasH / 2 + Math.sin(angle) * radius;
        const alpha = 0.4 + Math.sin(t + i) * 0.3;
        ctx.fillStyle = `rgba(180,160,255,${Math.abs(alpha)})`;
        ctx.fillRect(sx - 2, sy - 2, 4, 4);
      }
      break;
    }
    case 6: { // Nature — leaf particles
      const leafColors = ['#16a34a', '#15803d', '#86efac', '#4ade80'];
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3;
        const r = 30 + Math.sin(t + i) * 10;
        const lx = canvasW / 2 + Math.cos(angle) * r;
        const ly = canvasH / 2 + Math.sin(angle) * r * 0.6;
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.fillRect(lx - 2, ly - 3, 4, 6);
      }
      break;
    }
    case 7: { // Ice
      for (let i = 0; i < 8; i++) {
        const xPos = 5 + i * (canvasW - 10) / 8;
        const yPos = 5 + Math.sin(t * 1.5 + i) * 10;
        const alpha = 0.3 + Math.cos(t + i) * 0.2;
        ctx.fillStyle = `rgba(148,210,255,${Math.abs(alpha)})`;
        ctx.fillRect(xPos - 2, yPos - 2, 4, 4);
        ctx.fillRect(xPos - 1, yPos - 4, 2, 8);
      }
      break;
    }
    case 8: { // Neon Glow — avatar outline glow
      ctx.shadowColor = '#39ff14';
      ctx.shadowBlur = 8 + Math.sin(t * 2) * 4;
      // Just a glow border
      ctx.strokeStyle = '#39ff1460';
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, canvasW - 8, canvasH - 8);
      ctx.shadowBlur = 0;
      break;
    }
    case 9: { // DNA Spiral
      const dnaColors = ['#3b82f6', '#ec4899'];
      for (let i = 0; i < 8; i++) {
        const yPos = (i / 8) * canvasH;
        const xOff = Math.sin(t * 2 + i * 0.8) * 15;
        ctx.fillStyle = dnaColors[i % 2];
        ctx.fillRect(canvasW / 2 + xOff - 2, yPos, 4, 4);
        ctx.fillRect(canvasW / 2 - xOff - 2, yPos, 4, 4);
        if (i % 2 === 0) {
          ctx.strokeStyle = '#9ca3af60';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(canvasW / 2 + xOff, yPos + 2);
          ctx.lineTo(canvasW / 2 - xOff, yPos + 2);
          ctx.stroke();
        }
      }
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AvatarRenderer({
  config,
  size = 300,
  animate = true,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const blinkRef = useRef<boolean>(false);
  const blinkTimerRef = useRef<number>(0);

  const draw = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = false;

      // Bob offset for animation
      const bob = animate ? Math.round(Math.sin(t * Math.PI) * 1) : 0; // 1 game px, 2s cycle

      // Blink timing
      if (animate) {
        blinkTimerRef.current += 1 / 60;
        if (blinkTimerRef.current >= 4) {
          blinkRef.current = true;
        }
        if (blinkTimerRef.current >= 4.1) {
          blinkRef.current = false;
          blinkTimerRef.current = 0;
        }
      }

      // Draw aura behind everything
      drawAura(ctx, config.auraEffect ?? 0, t, W, H);

      // Avatar positions (game pixels, 0-based from canvas)
      // Canvas is W=40 game pixels wide, H=52 game pixels tall
      // Character fills roughly 26×46 of that space
      const hx = Math.floor(W / S / 2) - 5; // head left edge in game pixels
      const hy = 3 + bob; // head top in game pixels

      const bodyX = hx; // body same x as head (10gp wide body, 10gp wide head)
      const bodyY = hy + 14; // body starts below head+neck
      const neckY = hy + 12;
      const legsY = bodyY + 10;
      const shoeY = legsY + 4;

      // Draw hair (behind head)
      drawHair(ctx, config.hairStyle, config.hairColor, hx, hy);

      // Head
      px(ctx, hx, hy, 10, 12, config.skinTone);

      // Skin markings on face
      drawSkinMarkings(ctx, config.skinMarkings ?? 0, hx, hy);

      // Eyes
      drawEyes(ctx, config.eyeShape, config.eyeColor, config.expression ?? 1, blinkRef.current, hx, hy);

      // Eyebrows
      drawEyebrows(ctx, config.eyebrow, config.hairColor, hx, hy);

      // Nose
      drawNose(ctx, config.nose, config.skinTone, hx, hy);

      // Mouth
      drawMouth(ctx, config.mouth, config.expression ?? 1, hx, hy);

      // Facial hair
      drawFacialHair(ctx, config.facialHair, config.hairColor, hx, hy);

      // Glasses
      drawGlasses(ctx, config.glasses, hx, hy);

      // Headwear (on top)
      drawHeadwear(ctx, config.headwear ?? 0, config.headwearColor ?? '#333333', hx, hy);

      // Earrings
      if (config.accessories?.earrings) {
        px(ctx, hx - 1, hy + 7, 1, 1, '#f59e0b');
        px(ctx, hx + 10, hy + 7, 1, 1, '#f59e0b');
      }

      // Neck
      px(ctx, hx + 3, neckY, 4, 2, config.skinTone);

      // Backpack (behind body)
      drawBackpack(
        ctx,
        config.backpackType ?? (config.accessories?.backpack ? 1 : 0),
        config.backpackColor ?? '#1a1a2e',
        bodyX,
        bodyY,
      );

      // Clothing/Body
      drawClothing(
        ctx,
        config.clothing,
        config.clothingColorPrimary,
        config.clothingColorSecondary,
        bodyX,
        bodyY,
      );

      // Hands
      px(ctx, bodyX - 2, bodyY + 7, 2, 2, config.skinTone);
      px(ctx, bodyX + 10, bodyY + 7, 2, 2, config.skinTone);

      // Legs
      px(ctx, bodyX + 1, legsY, 3, 4, '#1f2937');
      px(ctx, bodyX + 6, legsY, 3, 4, '#1f2937');

      // Shoes
      drawShoes(
        ctx,
        config.shoes ?? 1,
        config.shoesColor ?? '#333333',
        bodyX + 1,
        shoeY,
      );

      // Headphones accessory
      if (config.accessories?.headphones && (config.headwear ?? 0) === 0) {
        px(ctx, hx - 2, hy + 2, 2, 5, '#374151');
        px(ctx, hx + 10, hy + 2, 2, 5, '#374151');
        px(ctx, hx, hy - 1, 10, 2, '#4b5563');
      }

      // Badge accessory
      if (config.accessories?.badge) {
        px(ctx, bodyX + 3, bodyY + 2, 4, 3, '#3b82f6');
        px(ctx, bodyX + 4, bodyY, 2, 2, '#1f2937');
        px(ctx, bodyX + 4, bodyY + 2, 1, 2, '#ffffff');
      }

      // Excited sparkles
      if ((config.expression ?? 1) === 4 && animate) {
        const sparkAlpha = Math.abs(Math.sin(t * 4));
        ctx.fillStyle = `rgba(255,255,100,${sparkAlpha})`;
        ctx.fillRect((hx - 3) * S, (hy - 3) * S, S * 2, S * 2);
        ctx.fillRect((hx + 12) * S, (hy - 2) * S, S * 2, S * 2);
        ctx.fillStyle = `rgba(255,200,50,${sparkAlpha * 0.7})`;
        ctx.fillRect((hx + 1) * S, (hy - 5) * S, S, S);
        ctx.fillRect((hx + 8) * S, (hy - 5) * S, S, S);
      }

      // Orbital sparkle particles (always when animate=true)
      if (animate) {
        const orbColors = ['#00ffcc', '#ffffff', '#a855f7', '#00ffcc', '#f59e0b', '#ffffff'];
        const orbRadii = [28, 22, 32, 20, 26, 30];
        const orbSpeeds = [0.8, 1.2, 0.6, 1.5, 1.0, 0.9];
        const orbSizes = [2, 1, 2, 1, 2, 1];
        const cx = W / 2;
        const cy = H * 0.38;
        for (let i = 0; i < 6; i++) {
          const angle = t * orbSpeeds[i] + (i * Math.PI * 2) / 6;
          const ox = cx + Math.cos(angle) * orbRadii[i] * S * 0.5;
          const oy = cy + Math.sin(angle) * orbRadii[i] * S * 0.3;
          const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
          ctx.fillStyle = orbColors[i] + Math.round(alpha * 255).toString(16).padStart(2, '0');
          const sz = orbSizes[i] * S;
          ctx.fillRect(ox - sz / 2, oy - sz / 2, sz, sz);
        }
      }
    },
    [config, animate],
  );

  useEffect(() => {
    if (!animate) {
      draw(0);
      return;
    }
    const loop = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000; // seconds
      draw(elapsed);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animate, draw]);

  // Canvas: 40gp × 52gp at S=4 → 160×208px (character fits in ~28×46gp)
  const CW = 40 * S;
  const CH = 52 * S;

  return (
    <canvas
      ref={canvasRef}
      width={CW}
      height={CH}
      className={className}
      style={{
        imageRendering: 'pixelated',
        width: size,
        height: Math.round(size * (CH / CW)),
      }}
    />
  );
}
