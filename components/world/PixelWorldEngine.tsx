'use client';
import { useEffect, useRef, useCallback } from 'react';
import { WORLD_MAPS, type WorldMap } from '@/lib/worlds/worldMaps';
import { useGameStore } from '@/lib/store';
import { getRealmNodes } from '@/lib/curriculum';
import type { Realm } from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────
const SCALE = 3;           // game pixels → canvas pixels
const TILE = 16;           // tile size in game pixels
// CW, CH, VP_W, VP_H are computed dynamically from canvasSizeRef each frame

const MAP_W = 40;
const MAP_H = 28;

const MOVE_MS = 180;       // ms per tile move
const ANIM_MS = 500;       // ms per animation frame tick
const WALK_MS = 150;       // ms per walk-frame flip
const CAM_LERP = 0.12;     // camera smoothing

const WALKABLE = new Set(['.','=','*','1','2','3','4','5','6','7','8','9','E','B','A','H','@']);

// ─── Types ────────────────────────────────────────────────────────────────────
type Dir = 'up' | 'down' | 'left' | 'right';
type CutPhase = 'fadein' | 'npc-walk' | 'dialogue' | 'done';

interface GameState {
  // frame counter (increments every RAF tick)
  frame: number;
  // player
  px: number; py: number;         // tile position (integer)
  pfx: number; pfy: number;       // kept for compat reference; actual progress via moveProgress
  moveProgress: number;           // 0-1, computed directly from (now - lastMoveTime) / MOVE_MS
  prevPx: number; prevPy: number; // previous tile (for lerp origin)
  dir: Dir;
  moving: boolean;
  // camera (in tiles, fractional)
  camX: number; camY: number;
  // timing
  lastMoveTime: number;
  lastAnimTime: number;
  lastWalkTime: number;
  // animation
  animFrame: number;    // 0-3, ticks every ANIM_MS
  walkFrame: number;    // 0 or 1
  // keys held
  keys: Set<string>;
  // interaction
  onNode: string | null;       // tile char currently standing on ('1'-'9' or null)
  nearNpc: string | null;      // 'E'|'B'|'A'|'H' or null
  // dialogue
  dialogueActive: boolean;
  dialogueLine: number;
  dialogueChar: number;        // typewriter progress
  dialogueLastChar: number;    // timestamp of last char tick
  // cutscene
  cutPhase: CutPhase;
  cutProgress: number;         // 0-1
  cutNpcX: number;             // fractional screen-tile x of NPC during cutscene
  cutStartTime: number;
  cutDialogueLine: number;
  cutDialogueChar: number;
  cutDialogueLastChar: number;
  // node prompt
  nodePromptVisible: boolean;
  // helper button overlay
  helperVisible: boolean;
}

interface Props {
  realm: 1 | 2 | 3 | 4;
  onEnterNode: (nodeId: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function tileAt(map: string[], tx: number, ty: number): string {
  if (ty < 0 || ty >= map.length) return '#';
  const row = map[ty];
  if (tx < 0 || tx >= row.length) return '#';
  return row[tx];
}

function isWalkable(map: string[], tx: number, ty: number): boolean {
  return WALKABLE.has(tileAt(map, tx, ty));
}

function findChar(map: string[], ch: string): { x: number; y: number } | null {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf(ch);
    if (x !== -1) return { x, y };
  }
  return null;
}

// ─── Pixel-art drawing helpers ────────────────────────────────────────────────

/** Draw a rect specified in game-pixel coords relative to tile top-left. */
function gr(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,     // canvas px of tile origin
  gx: number, gy: number,     // game-pixel offset within tile
  gw: number, gh: number,     // game-pixel size
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(cx + gx * SCALE, cy + gy * SCALE, gw * SCALE, gh * SCALE);
}

// ─── Tile rendering (Undertale / Omori aesthetic: dark backgrounds, clean bold shapes) ────
function drawTile(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  tile: string,
  animFrame: number,
  palette: WorldMap['palette'],
  realm: number,
  isCompleted: boolean,
  t: number,
  tx: number,
  ty: number,
  frame: number
) {
  const W = TILE; // 16 game pixels per tile

  // Per-realm base colors — visible atmospheric floors (NOT near-black)
  // Realm 1: bioluminescent teal cell interior
  // Realm 2: dark forest earth
  // Realm 3: deep space station deck
  // Realm 4: gothic stone cathedral
  const FLOORS = ['#1a3a44', '#162a0a', '#14083a', '#1e1438'];
  const WALLS  = ['#0f2530', '#0d1e05', '#0e052a', '#160f30'];
  const ACCENTS  = ['#00ffcc', '#00ff44', '#aa44ff', '#ffaa00'];
  const fl  = FLOORS[realm - 1]  ?? palette.floor;
  const wl  = WALLS[realm - 1]   ?? palette.wall;
  const acc = ACCENTS[realm - 1] ?? palette.accent;

  switch (tile) {

    // ── FLOOR ─────────────────────────────────────────────────────────────
    case '.':
    case '@': {
      // Base floor fill — visible atmospheric color
      gr(ctx, cx, cy, 0, 0, W, W, fl);
      // Checkerboard — every other tile 14 brightness higher (clearly visible seam)
      if ((tx + ty) % 2 === 0) gr(ctx, cx, cy, 0, 0, W, W, shiftColor(fl, 14));
      // Tile grout lines — 1px darker stripe every 4 tiles both axes
      if (tx % 4 === 0) gr(ctx, cx, cy, 0, 0, 1, W, shiftColor(fl, -12));
      if (ty % 4 === 0) gr(ctx, cx, cy, 0, 0, W, 1, shiftColor(fl, -12));
      // Realm-specific floor texture
      if (realm === 1) {
        // Cytoplasm: bioluminescent organic cell floor
        // Membrane ripple lines
        if (ty % 2 === 0) gr(ctx, cx, cy, 0, 7, W, 1, shiftColor(fl, 8));
        // Protein drift dots
        if ((tx * 5 + ty * 3) % 7 === 0) {
          const proteinOn = frame % 45 < 22;
          if (proteinOn) {
            gr(ctx, cx, cy, 5, 5, 2, 2, '#1a6644');
            gr(ctx, cx, cy, 11, 10, 2, 2, '#155533');
          }
        }
        // ATP particle flowing across tile
        if ((tx + ty * 2) % 5 === 0) {
          const atpCycle = frame % 60;
          if (atpCycle < 30) {
            const atpX = Math.floor(atpCycle / 2);
            const atpY = W - 2 - Math.floor(atpCycle / 3);
            if (atpX >= 0 && atpX <= W - 2 && atpY >= 0) {
              gr(ctx, cx, cy, atpX, atpY, 2, 2, '#00cc88');
            }
          }
        }
      } else if (realm === 2) {
        // Forest floor: root lines and moss patches
        if ((tx + ty) % 3 === 0) gr(ctx, cx, cy, 2, 8, 12, 1, shiftColor(fl, -8));
        if ((tx * 3 + ty) % 5 === 0) {
          gr(ctx, cx, cy, 4, 4, 3, 3, shiftColor(fl, 10));
          gr(ctx, cx, cy, 10, 10, 2, 2, shiftColor(fl, 8));
        }
      } else if (realm === 3) {
        // Space station: metallic floor grid
        if (ty % 2 === 0) gr(ctx, cx, cy, 0, W-1, W, 1, shiftColor(fl, -10));
        if ((tx + ty) % 4 === 0) {
          gr(ctx, cx, cy, 7, 7, 2, 2, shiftColor(fl, 18));
        }
      } else {
        // Cathedral: stone blocks with mortar
        const mortarX = tx % 2 === 0 ? 0 : 8;
        gr(ctx, cx, cy, mortarX, 0, 8, W, shiftColor(fl, 8));
        gr(ctx, cx, cy, 0, ty % 2 === 0 ? 0 : 8, W, 8, shiftColor(fl, 4));
        // Mortar joint lines
        gr(ctx, cx, cy, 0, 7, W, 2, shiftColor(fl, -10));
        gr(ctx, cx, cy, 7, 0, 2, W, shiftColor(fl, -10));
      }
      break;
    }

    // ── WALL ──────────────────────────────────────────────────────────────
    case '#': {
      gr(ctx, cx, cy, 0, 0, W, W, wl);
      // Top face — lighter edge simulating thickness viewed top-down
      gr(ctx, cx, cy, 0, 0, W, 3, shiftColor(wl, 40));
      gr(ctx, cx, cy, 0, 0, W, 1, shiftColor(wl, 65));
      // Left edge highlight
      gr(ctx, cx, cy, 0, 0, 2, W, shiftColor(wl, 30));
      // Bottom / right shadow
      gr(ctx, cx, cy, W-1, 0, 1, W, shiftColor(wl, -20));
      gr(ctx, cx, cy, 0, W-1, W, 1, shiftColor(wl, -20));
      // Realm-specific wall texture
      if (realm === 1) {
        // Cell wall: double-membrane pattern
        if (ty % 3 === 0) gr(ctx, cx, cy, 0, 6, W, 2, shiftColor(wl, 15));
        if (ty % 3 === 0) gr(ctx, cx, cy, 0, 10, W, 1, shiftColor(wl, 8));
      } else if (realm === 2) {
        // Forest wall: bark texture
        if ((tx + ty) % 4 === 0) gr(ctx, cx, cy, 4, 0, 2, W, shiftColor(wl, 12));
        if ((tx * 3 + ty) % 6 === 0) gr(ctx, cx, cy, 10, 2, 1, W-4, shiftColor(wl, 8));
      } else if (realm === 3) {
        // Space wall: panel seams
        gr(ctx, cx, cy, 0, W/2, W, 1, shiftColor(wl, 20));
        if (tx % 2 === 0) gr(ctx, cx, cy, W/2, 0, 1, W, shiftColor(wl, 15));
      } else {
        // Cathedral: stone blocks
        gr(ctx, cx, cy, 0, W/2, W, 2, shiftColor(wl, 18));
        if (tx % 3 === 0) gr(ctx, cx, cy, W-2, 0, 2, W, shiftColor(wl, -10));
      }
      // Glowing accent crack (realm-colored)
      if ((tx * 3 + ty * 7) % 9 === 0) {
        gr(ctx, cx, cy, 6, 3, 1, 10, acc + '55');
        gr(ctx, cx, cy, 6, 7, 1, 3, acc);
      }
      break;
    }

    // ── ORGANELLE / STRUCTURE ─────────────────────────────────────────────
    case 'T': {
      gr(ctx, cx, cy, 0, 0, W, W, fl);

      if (realm === 1) {
        // MITOCHONDRION — classic bean shape
        // Shadow beneath
        gr(ctx, cx, cy, 3, 13, 10, 2, '#000000');
        // Outer membrane — dark red oval (rows of decreasing width)
        const bean: [number, number, string][] = [
          [4, 4, '#550800'], [2, 6, '#771000'], [1, 8, '#992200'],
          [1, 8, '#aa2800'], [2, 6, '#881800'], [4, 3, '#551000'],
        ];
        bean.forEach(([ox, w, c], i) => {
          gr(ctx, cx, cy, ox, 4 + i * 2, w, 2, '#1a0000'); // outline
          gr(ctx, cx, cy, ox + 1, 4 + i * 2, w - 2, 2, c);
        });
        // Inner matrix (dark core)
        gr(ctx, cx, cy, 3, 6, 10, 6, '#110000');
        // Cristae — slide position every 60 frames (membrane breathing)
        const cristaOff = Math.floor(frame / 60) % 2;
        gr(ctx, cx, cy, 4, 7 + cristaOff, 8, 1, '#cc3300');
        gr(ctx, cx, cy, 4, 9 - cristaOff, 8, 1, '#cc3300');
        // ATP synthase dots (glowing yellow)
        gr(ctx, cx, cy, 3, 6, 2, 2, '#ffcc00');
        gr(ctx, cx, cy, 7, 6, 2, 2, '#ffcc00');
        gr(ctx, cx, cy, 11, 6, 2, 2, '#ffcc00');
        // Highlight
        gr(ctx, cx, cy, 4, 4, 3, 2, '#ff6633');
      }

      else if (realm === 2) {
        // DNA DOUBLE HELIX — two strands + colored base pairs
        // Left backbone strand (zigzag):
        const lX = [3, 2, 2, 3, 5, 7, 9, 11, 12, 12, 11, 9, 7, 5, 3, 3];
        // Right backbone strand (mirror):
        const rX = [12, 13, 13, 12, 10, 8, 6, 4, 3, 3, 4, 6, 8, 10, 12, 12];
        for (let row = 0; row < 16; row++) {
          gr(ctx, cx, cy, lX[row], row, 2, 1, '#1166bb'); // left — blue backbone
          gr(ctx, cx, cy, rX[row], row, 2, 1, '#11aa66'); // right — teal backbone
        }
        // Base pairs at every 4 rows (rungs):
        const bpColors: [string, string][] = [
          ['#ff4422', '#4488ff'], // A-T  row 0
          ['#44cc44', '#ffcc00'], // G-C  row 4
          ['#ff4422', '#4488ff'], // A-T  row 8
          ['#44cc44', '#ffcc00'], // G-C  row 12
        ];
        // Base pairs breathe: shift ±1 every 20 frames (strand breathing)
        const bpBreath = Math.floor(frame / 20) % 2;
        bpColors.forEach(([c1, c2], i) => {
          const row = i * 4 + 2 + (i % 2 === 0 ? bpBreath : -bpBreath);
          const clampedRow = Math.max(0, Math.min(15, row));
          const lx = lX[clampedRow] + 2, rx = rX[clampedRow];
          const mid = Math.floor((lx + rx) / 2);
          if (mid > lx && rx > mid) {
            gr(ctx, cx, cy, lx, clampedRow, mid - lx, 1, c1);
            gr(ctx, cx, cy, mid, clampedRow, rx - mid, 1, c2);
          }
        });
        // Glow at top
        gr(ctx, cx, cy, 5, 0, 6, 1, '#88ffee');
      }

      else if (realm === 3) {
        // CRYSTAL NEURAL SPIRE — purple crystal with glowing node top
        const pulse = animFrame % 2;
        // Shadow
        gr(ctx, cx, cy, 4, 14, 8, 2, '#000000');
        // Crystal body (tapered):
        gr(ctx, cx, cy, 7, 1, 2, 13, '#551188'); // dark core
        gr(ctx, cx, cy, 6, 3, 4, 10, '#772299'); // mid
        gr(ctx, cx, cy, 5, 5, 6, 8,  '#8833aa'); // widest
        // Left highlight edge
        gr(ctx, cx, cy, 5, 5, 1, 8, '#bb66ee');
        // Point tip
        gr(ctx, cx, cy, 7, 0, 2, 2, '#cc88ff');
        gr(ctx, cx, cy, 8, 0, 1, 1, '#ffffff');
        // Glowing node at top (pulsing)
        const glowColor = pulse === 0 ? '#ff88ff' : '#cc44cc';
        gr(ctx, cx, cy, 6, 0, 4, 3, glowColor);
        gr(ctx, cx, cy, 7, 0, 2, 1, '#ffffff');
        // Connection lines (neural)
        gr(ctx, cx, cy, 0, 6, 5, 1, '#3311aa');
        gr(ctx, cx, cy, 11, 4, 5, 1, '#3311aa');
      }

      else {
        // REALM 4 — GOTHIC STONE PILLAR with stained glass light beam
        // Shadow
        gr(ctx, cx, cy, 3, 14, 10, 2, '#000000');
        // Main pillar body
        gr(ctx, cx, cy, 4, 0, 8, 16, '#1a1530');
        // Left highlight
        gr(ctx, cx, cy, 4, 0, 2, 16, '#2a2048');
        // Right shadow
        gr(ctx, cx, cy, 10, 0, 2, 16, '#0f0c1a');
        // Capital (decorative top):
        gr(ctx, cx, cy, 2, 0, 12, 3, '#25204a');
        gr(ctx, cx, cy, 2, 0, 12, 1, acc);
        // Base
        gr(ctx, cx, cy, 2, 13, 12, 3, '#25204a');
        gr(ctx, cx, cy, 2, 15, 12, 1, acc);
        // Stone seams
        gr(ctx, cx, cy, 4, 6, 8, 1, '#0f0c1a');
        gr(ctx, cx, cy, 4, 10, 8, 1, '#0f0c1a');
        // Stained glass light beam: sweeps across every 60 frames
        const beamX = Math.floor((frame % 120) / 7) % 10;
        if (beamX >= 0 && beamX <= 8) {
          ctx.globalAlpha = 0.35;
          gr(ctx, cx, cy, 4 + beamX, 0, 2, 16, '#ffee88');
          ctx.globalAlpha = 1;
        }
      }
      break;
    }

    // ── WATER / VOID / ACID ───────────────────────────────────────────────
    case '~': {
      if (realm === 1) {
        // LYSOSOME ACID POOL / ER MEMBRANE — deep purple, green bubble, wavy ripple
        gr(ctx, cx, cy, 0, 0, W, W, '#150020');
        // ER Membrane wavy lines with sin(frame) ripple
        const ripple1 = Math.floor(Math.sin(frame * 0.05 + tx * 0.4) * 2);
        const ripple2 = Math.floor(Math.sin(frame * 0.05 + ty * 0.5 + 1.5) * 2);
        const s1 = Math.max(1, Math.min(W-2, 4 + ripple1));
        const s2 = Math.max(1, Math.min(W-2, 11 + ripple2));
        gr(ctx, cx, cy, 0, s1, W, 1, '#2a0040');
        gr(ctx, cx, cy, 0, s2, W, 1, '#4400aa');
        // Animated swirl
        const s3 = Math.max(0, Math.min(W-2, Math.floor(4 + Math.sin(t + tx * 0.4) * 3)));
        gr(ctx, cx, cy, 0, s3, W, 1, '#330055');
        // Bubble
        const bY = Math.max(2, Math.min(W-5, Math.floor(8 + Math.sin(t * 1.8 + tx) * 5)));
        gr(ctx, cx, cy, 6, bY, 4, 4, '#005500');
        gr(ctx, cx, cy, 7, bY, 2, 2, '#00aa00');
        // Danger corners
        gr(ctx, cx, cy, 0, 0, 2, 2, '#cc0000');
        gr(ctx, cx, cy, W-2, 0, 2, 2, '#cc0000');
      } else if (realm === 2) {
        // FOREST STREAM / WATERFALL — cobalt blue, animated falling pixels
        gr(ctx, cx, cy, 0, 0, W, W, '#0a182a');
        gr(ctx, cx, cy, 3, 0, 10, W, '#071015'); // depth centre
        const rOff = Math.floor(t * 2.5) % 8;
        gr(ctx, cx, cy, 1, rOff % W, W-2, 1, '#1a3a5a');
        gr(ctx, cx, cy, 3, (rOff + 5) % W, W-6, 1, '#1a4868');
        // Waterfall: falling pixel columns (offset by frame)
        for (let col = 1; col < W - 1; col += 3) {
          const fallY = (frame * 1 + col * 3) % W;
          gr(ctx, cx, cy, col, fallY, 1, 2, '#4499cc');
        }
        // Sparkle
        if (animFrame % 2 === 0) gr(ctx, cx, cy, 6, 4, 4, 1, '#66aacc');
        // Lily pad (every 5th water tile)
        if ((tx * 2 + ty) % 5 === 0) {
          gr(ctx, cx, cy, 5, 6, 6, 5, '#1a4018');
          gr(ctx, cx, cy, 7, 7, 2, 2, '#ee4466');
        }
      } else if (realm === 3) {
        // VOID — pure dark with twinkling stars
        gr(ctx, cx, cy, 0, 0, W, W, '#030008');
        const stars: [number, number][] = [[2,3],[7,1],[12,5],[4,10],[14,8],[9,14],[1,13],[11,2],[5,7]];
        stars.forEach(([sx, sy]) => {
          // Each star twinkles at a different offset based on position
          const starOffset = (sx * 7 + sy * 13 + tx * 3 + ty * 5) % 45;
          const bright = (frame + starOffset) % 45 < 22;
          gr(ctx, cx, cy, sx, sy, 1, 1, bright ? '#ffffff' : '#aaaaff');
        });
        if (animFrame === 0) gr(ctx, cx, cy, 7, 1, 2, 2, '#aa88ff'); // bright star
      } else {
        // REALM 4 — amethyst crystal pool
        gr(ctx, cx, cy, 0, 0, W, W, '#08060f');
        gr(ctx, cx, cy, 2, 0, 12, W, '#0e0a1c'); // lit centre
        const wv = Math.floor(t * 2) % 8;
        gr(ctx, cx, cy, 2, wv % W, 12, 1, '#2a1a44');
        // Crystal reflection dots
        gr(ctx, cx, cy, 5, 3, 2, 2, '#4422aa');
        gr(ctx, cx, cy, 9, 9, 2, 2, '#4422aa');
      }
      break;
    }

    // ── PATH ──────────────────────────────────────────────────────────────
    case '=': {
      if (realm === 1) {
        // MICROTUBULE HIGHWAY — 3 parallel orange tubes
        gr(ctx, cx, cy, 0, 0, W, W, '#060d18');
        gr(ctx, cx, cy, 0, 1, W, 4, '#993300');
        gr(ctx, cx, cy, 0, 6, W, 4, '#bb4400');
        gr(ctx, cx, cy, 0, 11, W, 4, '#993300');
        gr(ctx, cx, cy, 0, 1, W, 1, '#ff7722'); // top glow
        gr(ctx, cx, cy, 0, 6, W, 1, '#ff8833');
        gr(ctx, cx, cy, 0, 11, W, 1, '#ff7722');
        // Motor protein (animated)
        const mX = Math.floor(((t * 35 + ty * 16) % (TILE * SCALE)) / SCALE);
        if (mX >= 0 && mX <= W - 3) { gr(ctx, cx, cy, mX, 7, 3, 3, '#ff9900'); gr(ctx, cx, cy, mX+1, 7, 1, 1, '#ffcc00'); }
      } else if (realm === 2) {
        // COBBLESTONE PATH with scrolling data stream
        gr(ctx, cx, cy, 0, 0, W, W, '#1c1008');
        // Two stone blocks per tile
        gr(ctx, cx, cy, 0, 0, 7, 7, '#2e1e0c');
        gr(ctx, cx, cy, 8, 0, 7, 7, '#28180a');
        gr(ctx, cx, cy, 0, 8, 7, 7, '#28180a');
        gr(ctx, cx, cy, 8, 8, 7, 7, '#2e1e0c');
        // Highlights (top-left of each stone)
        gr(ctx, cx, cy, 0, 0, 7, 1, '#3e2e1c');
        gr(ctx, cx, cy, 8, 0, 7, 1, '#382814');
        gr(ctx, cx, cy, 0, 8, 7, 1, '#382814');
        gr(ctx, cx, cy, 8, 8, 7, 1, '#3e2e1c');
        // Data stream: scrolling binary pattern (alternates every 15 frames)
        if ((tx + ty) % 3 === 0) {
          const bits = [1,0,1,1,0,1,0,0,1,1,0,1,1,0,0,1];
          for (let bi = 0; bi < 4; bi++) {
            const bitIdx = (Math.floor(frame / 15) + bi + tx + ty) % bits.length;
            const bColor = bits[bitIdx] ? '#00aa33' : '#004411';
            gr(ctx, cx, cy, bi * 4, 13, 1, 2, bColor);
          }
        }
      } else if (realm === 3) {
        // NEURAL LIGHT BRIDGE — glowing platform with synapse arc
        gr(ctx, cx, cy, 0, 0, W, W, '#030008');
        gr(ctx, cx, cy, 0, 4, W, 8, '#0f0520');
        gr(ctx, cx, cy, 0, 4, W, 1, '#7722ee'); // top glow edge
        gr(ctx, cx, cy, 0, 12, W, 1, '#3311aa'); // bottom
        // Animated pulse
        const pX = Math.floor(t * 5 * W) % (W * 2);
        if (pX < W) gr(ctx, cx, cy, pX, 6, 3, 4, '#9933ff');
        // Synapse arc: pulsing diagonal electrical arc every 20 frames
        if (frame % 20 < 10) {
          const arcPhase = frame % 20;
          for (let ai = 0; ai < 6; ai++) {
            const ax = (ai * 3 + arcPhase) % W;
            const ay = 5 + (ai % 3);
            gr(ctx, cx, cy, ax, ay, 1, 1, '#ffffff');
          }
        }
        // Crystal shimmer: bright pixel at random corner every 30 frames
        if (frame % 30 === ((tx * 7 + ty * 11) % 30)) {
          gr(ctx, cx, cy, (tx * 5) % 14, (ty * 7) % 6 + 4, 1, 1, '#eeccff');
        }
      } else {
        // CATHEDRAL AISLE
        gr(ctx, cx, cy, 0, 0, W, W, '#0c0a1c');
        gr(ctx, cx, cy, 0, 0, W, 1, '#2a1a55');
        gr(ctx, cx, cy, 0, W-1, W, 1, '#2a1a55');
        gr(ctx, cx, cy, 4, 4, 8, 8, '#110d24');
        gr(ctx, cx, cy, 7, 4, 2, 8, '#1a1535');
        gr(ctx, cx, cy, 4, 7, 8, 2, '#1a1535');
        gr(ctx, cx, cy, 7, 7, 2, 2, '#2a1a55');
        // Candlelight particle
        const cY = Math.max(1, Math.min(W-2, Math.floor(5 + Math.sin(t * 0.8 + tx) * 4)));
        gr(ctx, cx, cy, 8, cY, 1, 1, '#cc8800');
      }
      break;
    }

    // ── DECORATIVE FLOOR ──────────────────────────────────────────────────
    case '*': {
      gr(ctx, cx, cy, 0, 0, W, W, fl);
      const aOn = animFrame % 2 === 0;
      gr(ctx, cx, cy, 6, 0, 4, W, aOn ? shiftColor(fl, 15) : fl);
      gr(ctx, cx, cy, 0, 6, W, 4, aOn ? shiftColor(fl, 15) : fl);
      gr(ctx, cx, cy, 6, 6, 4, 4, aOn ? acc : shiftColor(acc, -40));
      // Realm 4 holographic altar: scan line sweeping down
      if (realm === 4) {
        const scanY = (frame * 2) % W;
        gr(ctx, cx, cy, 0, scanY, W, 1, '#ffcc8844');
      }
      break;
    }

    // ── BOSS GATE ─────────────────────────────────────────────────────────
    case 'B': {
      const S = SCALE;
      const TS = W * S;
      ctx.fillStyle = '#100000'; ctx.fillRect(cx, cy, TS, TS);
      ctx.fillStyle = '#2a0000'; ctx.fillRect(cx + 6*S, cy, (W-12)*S, TS); // archway
      ctx.fillStyle = '#880000'; ctx.fillRect(cx + 3*S, cy, (W-6)*S, 2*S); // lintel
      // Pulsing red glow
      const bP = 0.3 + 0.3 * Math.sin(t * 1.8);
      ctx.fillStyle = `rgba(180,0,0,${bP})`; ctx.fillRect(cx + 6*S, cy, (W-12)*S, TS);
      // Warning exclamation
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(cx + 7*S, cy + 4*S, 2*S, 6*S);
      ctx.fillRect(cx + 7*S, cy + 12*S, 2*S, 2*S);
      break;
    }

    // ── LESSON NODES ──────────────────────────────────────────────────────
    default:
      if (tile >= '1' && tile <= '9') {
        gr(ctx, cx, cy, 0, 0, W, W, fl);

        const on = animFrame % 2 === 0;
        if (realm === 1) {
          // Teal diamond portal
          gr(ctx, cx, cy, 6, 0, 4, 2, on ? '#00ffcc' : '#00aa88');
          gr(ctx, cx, cy, 4, 2, 8, 2, on ? '#00ffcc' : '#00aa88');
          gr(ctx, cx, cy, 2, 4, 12, 4, on ? '#00ffcc' : '#00aa88');
          gr(ctx, cx, cy, 4, 8, 8, 2, on ? '#00ffcc' : '#00aa88');
          gr(ctx, cx, cy, 6, 10, 4, 2, on ? '#00ffcc' : '#00aa88');
          // Inner dark
          gr(ctx, cx, cy, 4, 2, 8, 8, '#001a15');
          gr(ctx, cx, cy, 5, 3, 6, 6, on ? '#001a15' : '#002a20');
          // Sparkle
          if (on) { gr(ctx, cx, cy, 5, 4, 2, 2, '#88ffee'); gr(ctx, cx, cy, 9, 8, 2, 2, '#44ccaa'); }
        } else if (realm === 2) {
          // Green terminal
          gr(ctx, cx, cy, 1, 1, 14, 10, '#0a1a05');
          gr(ctx, cx, cy, 1, 1, 14, 1, '#00cc33');
          gr(ctx, cx, cy, 1, 1, 1, 10, '#00cc33');
          gr(ctx, cx, cy, 3, 4, on ? 8 : 6, 1, '#00ff44');
          gr(ctx, cx, cy, 3, 6, on ? 6 : 9, 1, '#00cc33');
          gr(ctx, cx, cy, 3, 8, 4, 1, '#00ff44');
          gr(ctx, cx, cy, 5, 12, 6, 2, '#0a1a05'); // stand
          gr(ctx, cx, cy, 4, 11, 8, 2, '#00cc33');
        } else if (realm === 3) {
          // Purple neural node with pulsing ring
          gr(ctx, cx, cy, 5, 5, 6, 6, '#220033');
          gr(ctx, cx, cy, 4, 6, 8, 4, on ? '#aa44ff' : '#7722cc');
          gr(ctx, cx, cy, 6, 4, 4, 8, on ? '#aa44ff' : '#7722cc');
          gr(ctx, cx, cy, 6, 6, 4, 4, on ? '#ffffff' : '#cc88ff');
          // Connectors
          gr(ctx, cx, cy, 0, 7, 4, 2, '#440088');
          gr(ctx, cx, cy, 12, 7, 4, 2, '#440088');
          gr(ctx, cx, cy, 7, 0, 2, 4, '#440088');
          gr(ctx, cx, cy, 7, 12, 2, 4, '#440088');
          // Pulsing ring: outer ring expands every 15 frames then resets
          const ringPhase = Math.floor(frame / 15) % 4;
          const ringR = 3 + ringPhase;
          const ringX = 8 - ringR, ringY = 8 - ringR;
          if (ringX >= 0 && ringY >= 0 && ringX + ringR * 2 <= W) {
            ctx.globalAlpha = 0.4 - ringPhase * 0.08;
            gr(ctx, cx, cy, ringX, ringY, ringR * 2, 1, '#cc88ff');
            gr(ctx, cx, cy, ringX, ringY + ringR * 2 - 1, ringR * 2, 1, '#cc88ff');
            gr(ctx, cx, cy, ringX, ringY, 1, ringR * 2, '#cc88ff');
            gr(ctx, cx, cy, ringX + ringR * 2 - 1, ringY, 1, ringR * 2, '#cc88ff');
            ctx.globalAlpha = 1;
          }
        } else {
          // Gold altar gem
          gr(ctx, cx, cy, 4, 8, 8, 6, '#1a1535');
          gr(ctx, cx, cy, 4, 8, 8, 1, '#4433aa');
          gr(ctx, cx, cy, 5, 4, 6, 6, on ? '#ffaa00' : '#cc7700');
          gr(ctx, cx, cy, 6, 3, 4, 2, on ? '#ffdd44' : '#ffaa00');
          gr(ctx, cx, cy, 7, 2, 2, 2, '#ffffff');
          gr(ctx, cx, cy, 6, 4, 2, 2, '#ffee88');
        }

        if (isCompleted) {
          // Checkmark overlay
          gr(ctx, cx, cy, 4, 10, 4, 2, '#00ff88');
          gr(ctx, cx, cy, 7, 8, 2, 5, '#00ff88');
        }
        break;
      }
      gr(ctx, cx, cy, 0, 0, W, W, fl);
      break;
  }
}

// ─── NPC Sprites ─────────────────────────────────────────────────────────────

function drawElliot(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, globalFrame: number) {
  // Elliot: Cell Biology Guide — 32×32 sprite, lab coat, curly dark hair, cyan glasses, mismatched socks
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const legShift = globalFrame % 2 === 1 ? 1 : 0;
  const headBob  = (globalFrame % 90) < 45 ? 0 : -1;
  const eyeH     = (globalFrame % 120) < 6 ? 1 : 2; // blink

  // HEAD (skin — draw first so hair can overlay top rows)
  gr2(ctx, ox, oy, 10, 0 + headBob, 12, 12, '#c68642');

  // HAIR — curly dark brown: base covers top of head, poofs extend beyond
  gr2(ctx, ox, oy, 10,  0 + headBob, 12,  4, '#2a1a0a'); // hair base top
  gr2(ctx, ox, oy,  8, -2 + headBob,  4,  2, '#2a1a0a'); // upper-left poof
  gr2(ctx, ox, oy, 20, -2 + headBob,  4,  2, '#2a1a0a'); // upper-right poof
  gr2(ctx, ox, oy,  6,  2 + headBob,  4,  2, '#2a1a0a'); // left-mid poof
  gr2(ctx, ox, oy, 22,  2 + headBob,  4,  2, '#2a1a0a'); // right-mid poof

  // GLASSES (cyan lenses + gray bridge)
  gr2(ctx, ox, oy, 11, 5 + headBob, 4, 2, '#00cccc'); // left lens
  gr2(ctx, ox, oy, 17, 5 + headBob, 4, 2, '#00cccc'); // right lens
  gr2(ctx, ox, oy, 15, 5 + headBob, 2, 1, '#888888'); // bridge

  // EYES (inside lens area, one row above glasses)
  gr2(ctx, ox, oy, 12, 4 + headBob, 2, eyeH, '#1a1a1a');
  gr2(ctx, ox, oy, 18, 4 + headBob, 2, eyeH, '#1a1a1a');

  // NOSE & MOUTH
  gr2(ctx, ox, oy, 15, 7 + headBob, 2, 1, '#b07050');
  gr2(ctx, ox, oy, 14, 9 + headBob, 4, 1, '#8b4513');

  // NECK (under-coat shirt visible in bright blue)
  gr2(ctx, ox, oy, 14, 12, 4, 3, '#4488cc');

  // SHOULDERS (lab coat)
  gr2(ctx, ox, oy, 6, 15, 20, 3, '#e8e8f0');

  // TORSO (lab coat)
  gr2(ctx, ox, oy,  8, 17, 16, 10, '#e8e8f0');
  // Lapels — 2×5 gray each side of center
  gr2(ctx, ox, oy, 12, 17,  2,  5, '#aaaaaa');
  gr2(ctx, ox, oy, 18, 17,  2,  5, '#aaaaaa');
  // Buttons down center
  gr2(ctx, ox, oy, 15, 19, 2, 1, '#666666');
  gr2(ctx, ox, oy, 15, 22, 2, 1, '#666666');
  gr2(ctx, ox, oy, 15, 25, 2, 1, '#666666');
  // Chest pocket with pen
  gr2(ctx, ox, oy, 10, 20, 4, 4, '#d8d8e4');
  gr2(ctx, ox, oy, 11, 20, 1, 3, '#4466aa');

  // ARMS (coat sleeves)
  gr2(ctx, ox, oy,  4, 15, 4, 13, '#e8e8f0');
  gr2(ctx, ox, oy, 24, 15, 4, 13, '#e8e8f0');

  // HANDS
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#c68642');
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#c68642');

  // HIPS
  gr2(ctx, ox, oy, 9, 27, 14, 3, '#2233aa');

  // LEGS — mismatched socks (left=red, right=yellow)
  gr2(ctx, ox, oy,  9, 30 - legShift, 6, 5, '#2233aa'); // left leg upper
  gr2(ctx, ox, oy,  9, 35 - legShift, 6, 3, '#ff4444'); // left sock
  gr2(ctx, ox, oy, 17, 30 + legShift, 6, 5, '#2233aa'); // right leg upper
  gr2(ctx, ox, oy, 17, 35 + legShift, 6, 3, '#ffee44'); // right sock

  // SHOES
  gr2(ctx, ox, oy,  8, 38 - legShift, 7, 3, '#222222');
  gr2(ctx, ox, oy, 16, 38 + legShift, 7, 3, '#222222');
}

function drawBen(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, frame: number) {
  // Ben: Bioinformatics Guide — 32×32 sprite, dark green hoodie, cargo pants, sandwich
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const legShift    = frame === 1 ? 1 : 0;
  const sandwichBob = frame === 1 ? 1 : 0;

  // HEAD
  gr2(ctx, ox, oy, 10, 0, 12, 12, '#d4956a');

  // HAIR (short flat-top, light brown, 14 wide)
  gr2(ctx, ox, oy, 9, 0, 14, 3, '#8b5e3c');

  // EYEBROWS
  gr2(ctx, ox, oy, 11, 4, 3, 1, '#6b3e1c');
  gr2(ctx, ox, oy, 18, 4, 3, 1, '#6b3e1c');

  // EYES (warm brown, 3×2)
  gr2(ctx, ox, oy, 11, 5, 3, 2, '#3a2a1a');
  gr2(ctx, ox, oy, 18, 5, 3, 2, '#3a2a1a');

  // NOSE
  gr2(ctx, ox, oy, 15, 7, 2, 2, '#c07050');

  // MOUTH (big smile, 6×2)
  gr2(ctx, ox, oy, 13, 9, 6, 2, '#a06040');

  // NECK
  gr2(ctx, ox, oy, 14, 12, 4, 3, '#d4956a');

  // SHOULDERS (hoodie)
  gr2(ctx, ox, oy, 6, 15, 20, 3, '#2d5a27');

  // TORSO (hoodie)
  gr2(ctx, ox, oy, 8, 17, 16, 10, '#2d5a27');
  // Kangaroo pocket
  gr2(ctx, ox, oy, 11, 20, 10, 5, '#1a3a17');
  // Drawstrings
  gr2(ctx, ox, oy, 14, 16, 1, 3, '#eeeeee');
  gr2(ctx, ox, oy, 17, 16, 1, 3, '#eeeeee');

  // ARMS (hoodie sleeves)
  gr2(ctx, ox, oy,  4, 15, 4, 13, '#2d5a27');
  gr2(ctx, ox, oy, 24, 15, 4, 13, '#2d5a27');

  // HANDS
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#d4956a');
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#d4956a');

  // SANDWICH — right hand, 3 layers of 5×2, bobs on frame 1
  const sandY = 24 + sandwichBob;
  gr2(ctx, ox, oy, 26, sandY,     5, 2, '#f5d78a'); // top bread
  gr2(ctx, ox, oy, 26, sandY + 2, 5, 2, '#4aaa44'); // lettuce
  gr2(ctx, ox, oy, 26, sandY + 4, 5, 2, '#f5d78a'); // bottom bread

  // HIPS (cargo pants) + BELT on top
  gr2(ctx, ox, oy, 9, 27, 14, 3, '#7a5c3a');
  gr2(ctx, ox, oy, 9, 27, 14, 2, '#4a2c0e');

  // LEGS
  gr2(ctx, ox, oy,  9, 30 - legShift, 6, 8, '#7a5c3a');
  gr2(ctx, ox, oy, 17, 30 + legShift, 6, 8, '#7a5c3a');
  // Cargo pocket on left leg
  gr2(ctx, ox, oy, 9, 31 - legShift, 3, 4, '#5a3c1e');

  // FEET (white sneakers + gray sole)
  gr2(ctx, ox, oy,  8, 38 - legShift, 7, 2, '#dddddd');
  gr2(ctx, ox, oy,  8, 40 - legShift, 7, 1, '#999999');
  gr2(ctx, ox, oy, 16, 38 + legShift, 7, 2, '#dddddd');
  gr2(ctx, ox, oy, 16, 40 + legShift, 7, 1, '#999999');
}

function drawAlex(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, frame: number) {
  // Alex: ML/AI Guide — 32×32 sprite, black turtleneck, slim gray pants, coffee cup
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const legShift = frame === 1 ? 1 : 0;
  const eyeH     = frame % 2 === 0 ? 1 : 2; // squint effect on even frames

  // HEAD
  gr2(ctx, ox, oy, 10, 0, 12, 12, '#d4a07a');

  // HAIR (sleek black, flat smooth, 14×4, high hairline at dy=-1)
  gr2(ctx, ox, oy, 9, -1, 14, 4, '#1a1a1a');

  // EYEBROWS (angular)
  gr2(ctx, ox, oy, 12, 3, 3, 1, '#1a1a1a');
  gr2(ctx, ox, oy, 17, 3, 3, 1, '#1a1a1a');

  // EYES (sharp, positioned close together)
  gr2(ctx, ox, oy, 13, 5, 2, eyeH, '#2a2a4a');
  gr2(ctx, ox, oy, 17, 5, 2, eyeH, '#2a2a4a');

  // NOSE
  gr2(ctx, ox, oy, 15, 7, 2, 1, '#c08060');

  // MOUTH (subtle, slightly pursed)
  gr2(ctx, ox, oy, 15, 9, 3, 1, '#8a6050');

  // TURTLENECK COLLAR (rises over chin, dy=10 inside head)
  gr2(ctx, ox, oy, 11, 10, 10, 4, '#111111');

  // NECK
  gr2(ctx, ox, oy, 14, 12, 4, 3, '#111111');

  // SHOULDERS
  gr2(ctx, ox, oy, 6, 15, 20, 3, '#1a1a1a');
  gr2(ctx, ox, oy, 8, 15,  3,  1, '#333333'); // shoulder highlight

  // TORSO (turtleneck)
  gr2(ctx, ox, oy, 8, 17, 16, 10, '#1a1a1a');

  // ARMS (left arm stays still — coffee; right arm barely swings)
  gr2(ctx, ox, oy,  4, 15, 4, 13, '#111111');
  gr2(ctx, ox, oy, 24, 15, 4, 13, '#111111');

  // HANDS
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#d4a07a');
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#d4a07a');

  // COFFEE CUP — left hand, dx=1, dy=24
  gr2(ctx, ox, oy,  1, 24, 5, 8, '#e8d5b0'); // paper cup body
  gr2(ctx, ox, oy,  1, 25, 5, 1, '#c4a882'); // coffee ring
  gr2(ctx, ox, oy,  1, 24, 5, 1, '#2a1a0a'); // dark coffee at top
  gr2(ctx, ox, oy,  6, 26, 2, 3, '#bbbb99'); // handle

  // HIPS
  gr2(ctx, ox, oy, 9, 27, 14, 3, '#606070');

  // LEGS (slim, 5 wide each)
  gr2(ctx, ox, oy, 10, 30 - legShift, 5, 8, '#606070');
  gr2(ctx, ox, oy, 17, 30 + legShift, 5, 8, '#606070');

  // FEET (white low-tops)
  gr2(ctx, ox, oy,  9, 38 - legShift, 7, 3, '#f0f0f0');
  gr2(ctx, ox, oy, 16, 38 + legShift, 7, 3, '#f0f0f0');
}

function drawHenry(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, frame: number) {
  // Henry: Holographic Final Mentor — 32×32 sprite, translucent teal, flickering
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const flicker = frame % 3 === 0 ? 0.4 : frame % 3 === 1 ? 0.65 : 0.55;

  // OUTER GLOW (very faint wider silhouette)
  ctx.globalAlpha = flicker * 0.2;
  gr2(ctx, ox, oy, 7, -3, 18, 46, '#00ffffff');

  // MAIN HOLOGRAPHIC BODY
  ctx.globalAlpha = flicker;

  // HEAD
  gr2(ctx, ox, oy, 10, 0, 12, 12, '#00ffcc');

  // HAIR (distinguished silver/white, short and neat)
  gr2(ctx, ox, oy, 10, 0, 12, 3, '#e0e0ff');

  // Circuit trace on forehead
  gr2(ctx, ox, oy, 10, 3, 12, 1, '#00ffffff');

  // EYES (bright white, 3×3)
  gr2(ctx, ox, oy, 11, 5, 3, 3, '#ffffff');
  gr2(ctx, ox, oy, 18, 5, 3, 3, '#ffffff');

  // SMILE (white teeth)
  gr2(ctx, ox, oy, 12, 9, 8, 1, '#ffffff');

  // NECK
  gr2(ctx, ox, oy, 14, 12, 4, 3, '#00cccc');

  // SHOULDERS (lab coat silhouette, teal)
  gr2(ctx, ox, oy, 6, 15, 20, 3, '#00cccc');

  // TORSO
  gr2(ctx, ox, oy, 8, 17, 16, 10, '#00cccc');

  // Hexagonal grid texture on torso (4×4 grid of 1×1 dots)
  for (let hgx = 0; hgx < 4; hgx++) {
    for (let hgy = 0; hgy < 4; hgy++) {
      gr2(ctx, ox, oy, 9 + hgx * 3, 18 + hgy * 2, 1, 1, '#00ffffff');
    }
  }

  // CIRCUIT TRACES (8 total — thin 1×3 and 3×1 lines)
  gr2(ctx, ox, oy,  9, 19, 3, 1, '#00ffffff');
  gr2(ctx, ox, oy, 15, 21, 1, 3, '#00ffffff');
  gr2(ctx, ox, oy, 18, 22, 3, 1, '#00ffffff');
  gr2(ctx, ox, oy, 10, 24, 1, 3, '#00ffffff');
  gr2(ctx, ox, oy, 13, 18, 3, 1, '#00ffffff');
  gr2(ctx, ox, oy, 20, 19, 1, 3, '#00ffffff');
  gr2(ctx, ox, oy,  9, 25, 3, 1, '#00ffffff');
  gr2(ctx, ox, oy, 17, 24, 1, 3, '#00ffffff');

  // ARMS
  gr2(ctx, ox, oy,  4, 15, 4, 13, '#00aaaa');
  gr2(ctx, ox, oy, 24, 15, 4, 13, '#00aaaa');

  // HANDS
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#00cccc');
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#00cccc');

  // HIPS
  gr2(ctx, ox, oy, 9, 27, 14, 3, '#00cccc');

  // LEGS
  gr2(ctx, ox, oy,  9, 30, 6, 8, '#00cccc');
  gr2(ctx, ox, oy, 17, 30, 6, 8, '#00cccc');

  // FEET
  gr2(ctx, ox, oy,  8, 38, 7, 3, '#00aaaa');
  gr2(ctx, ox, oy, 16, 38, 7, 3, '#00aaaa');

  // SCANLINE GLITCH at frame%4===0
  if (frame % 4 === 0) {
    ctx.globalAlpha = flicker * 0.8;
    gr2(ctx, ox, oy, 12, 0, 1, 41, '#ffffff');
    gr2(ctx, ox, oy, 19, 0, 1, 41, '#ffffff');
  }

  // ORBITING PARTICLES (4 teal orbs, positions based on sin/cos of frame*0.1)
  ctx.globalAlpha = flicker * 0.7;
  const t = frame * 0.1;
  const orbs = [
    { dx: Math.round(16 + 10 * Math.cos(t)),                   dy: Math.round(20 + 8 * Math.sin(t)) },
    { dx: Math.round(16 + 10 * Math.cos(t + Math.PI)),         dy: Math.round(20 + 8 * Math.sin(t + Math.PI)) },
    { dx: Math.round(16 + 10 * Math.cos(t + Math.PI / 2)),     dy: Math.round(20 + 8 * Math.sin(t + Math.PI / 2)) },
    { dx: Math.round(16 + 10 * Math.cos(t + 3 * Math.PI / 2)), dy: Math.round(20 + 8 * Math.sin(t + 3 * Math.PI / 2)) },
  ];
  for (const orb of orbs) {
    gr2(ctx, ox, oy, orb.dx, orb.dy, 2, 2, '#00ffcc');
  }

  ctx.globalAlpha = 1;
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  dir: Dir,
  frame: number,
  skinColor: string,
  clothColor: string,
  hairColor: string,
  pose: string = 'walk',
  globalFrame: number = 0
) {
  const ox = cx - 8 * SCALE;

  // Pose-based Y offset and body color
  let poseYOff = 0;
  let effectiveClothColor = clothColor;

  if (pose === 'idle') {
    poseYOff = (globalFrame % 60) < 30 ? 0 : -1;
  } else if (pose === 'celebrate') {
    poseYOff = globalFrame % 2 === 0 ? -2 : 0;
  } else if (pose === 'hurt') {
    effectiveClothColor = globalFrame % 2 === 1 ? '#ff4444' : clothColor;
  }

  const oy = cy - 16 * SCALE + poseYOff * SCALE;

  let legShift = 0;
  if (pose === 'walk') {
    legShift = frame === 1 ? 1 : 0;
  } else if (pose === 'run') {
    legShift = frame === 1 ? 2 : -1;
  }

  const legColor = shiftColor(effectiveClothColor, -30);

  // HEAD (skin + 1-px dark outline via slightly larger dark block behind)
  gr2(ctx, ox, oy,  9, -1, 14, 14, shiftColor(skinColor, -50)); // outline block
  gr2(ctx, ox, oy, 10,  0, 12, 12, skinColor);                  // fill

  // HAIR & FACE (direction-aware)
  if (dir === 'up') {
    // Back of head — hair covers top 8 rows, no face visible
    gr2(ctx, ox, oy, 10, 0, 12, 8, hairColor);
  } else if (dir === 'down') {
    // Hair on top (14×4 above head)
    gr2(ctx, ox, oy, 9, -1, 14, 4, hairColor);
    // Two eyes
    gr2(ctx, ox, oy, 12, 4, 2, 2, '#1a1a1a');
    gr2(ctx, ox, oy, 18, 4, 2, 2, '#1a1a1a');
    // Nose
    gr2(ctx, ox, oy, 15, 7, 2, 1, shiftColor(skinColor, -20));
    // Mouth
    gr2(ctx, ox, oy, 13, 9, 4, 1, shiftColor(skinColor, -40));
  } else if (dir === 'left') {
    // Profile facing left — hair on right side (back of head), left eye visible
    gr2(ctx, ox, oy, 15, 0, 7, 8, hairColor);
    gr2(ctx, ox, oy, 10, 4, 2, 2, '#1a1a1a'); // left eye at dx=10
    gr2(ctx, ox, oy, 10, 7, 2, 1, shiftColor(skinColor, -20)); // nose
    gr2(ctx, ox, oy, 10, 9, 3, 1, shiftColor(skinColor, -40)); // mouth
  } else {
    // Profile facing right — hair on left side, right eye visible
    gr2(ctx, ox, oy, 10, 0, 7, 8, hairColor);
    gr2(ctx, ox, oy, 18, 4, 2, 2, '#1a1a1a'); // right eye at dx=18
    gr2(ctx, ox, oy, 18, 7, 2, 1, shiftColor(skinColor, -20)); // nose
    gr2(ctx, ox, oy, 17, 9, 3, 1, shiftColor(skinColor, -40)); // mouth
  }

  // NECK
  gr2(ctx, ox, oy, 14, 12, 4, 3, skinColor);

  // SHOULDERS
  gr2(ctx, ox, oy, 6, 15, 20, 3, effectiveClothColor);

  // TORSO
  gr2(ctx, ox, oy, 8, 17, 16, 10, effectiveClothColor);

  // ARMS & HANDS (pose-aware)
  if (pose === 'celebrate') {
    gr2(ctx, ox, oy,  0,  8, 4, 10, effectiveClothColor); // left arm raised
    gr2(ctx, ox, oy, 28,  8, 4, 10, effectiveClothColor); // right arm raised
    gr2(ctx, ox, oy,  0,  5, 5,  3, skinColor);            // left hand up
    gr2(ctx, ox, oy, 27,  5, 5,  3, skinColor);            // right hand up
  } else if (pose === 'run') {
    const runSwing = (globalFrame % 16) < 8 ? -2 : 2;
    gr2(ctx, ox, oy,  4, 15 + runSwing, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy, 24, 15 - runSwing, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy,  3, 28 + runSwing, 5,  3, skinColor);
    gr2(ctx, ox, oy, 24, 28 - runSwing, 5,  3, skinColor);
  } else {
    gr2(ctx, ox, oy,  4, 15, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy, 24, 15, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy,  3, 28, 5,  3, skinColor);
    gr2(ctx, ox, oy, 24, 28, 5,  3, skinColor);
  }

  // HIPS
  gr2(ctx, ox, oy, 9, 27, 14, 3, legColor);

  // LEGS
  if (pose === 'celebrate') {
    gr2(ctx, ox, oy,  9, 30, 6, 8, legColor);
    gr2(ctx, ox, oy, 17, 30, 6, 8, legColor);
  } else {
    gr2(ctx, ox, oy,  9, 30 - legShift, 6, 8, legColor);
    gr2(ctx, ox, oy, 17, 30 + legShift, 6, 8, legColor);
  }

  // FEET/SHOES
  const fShift = pose === 'celebrate' ? 0 : legShift;
  gr2(ctx, ox, oy,  8, 38 - fShift, 7, 3, '#333333');
  gr2(ctx, ox, oy, 16, 38 + fShift, 7, 3, '#333333');
}

/** Convenience: draw game-pixel rect from local offset inside sprite origin. */
function gr2(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  gx: number, gy: number,
  gw: number, gh: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(ox + gx * SCALE, oy + gy * SCALE, gw * SCALE, gh * SCALE);
}

// ─── Colour utility ───────────────────────────────────────────────────────────
function shiftColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return `#${clamp(r + amount).toString(16).padStart(2, '0')}${clamp(g + amount).toString(16).padStart(2, '0')}${clamp(b + amount).toString(16).padStart(2, '0')}`;
}

// ─── Particle System ─────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}
const particles: Particle[] = [];

function spawnParticles(x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    if (particles.length >= 50) particles.shift();
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 30 + Math.floor(Math.random() * 30),
      maxLife: 60,
      color,
      size: 1 + Math.floor(Math.random() * 2),
    });
  }
}

function drawParticles(ctx: CanvasRenderingContext2D) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life--;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size * SCALE, p.size * SCALE);
  }
  ctx.globalAlpha = 1;
}

// ─── Cherry Blossom Petals (Realm 2) ─────────────────────────────────────────
interface Petal {
  wx: number; wy: number;   // world-space canvas X/Y
  timer: number;            // increments each frame
}
const blossomPetals: Petal[] = [];

// ─── Mini-map ─────────────────────────────────────────────────────────────────
function drawMinimap(
  ctx: CanvasRenderingContext2D,
  map: string[],
  px: number, py: number,
  palette: WorldMap['palette'],
  completedNodeTiles: Set<string>,
  CW: number
) {
  const MM_W = 80, MM_H = 56;
  const mmX = CW - MM_W - 8, mmY = 8;
  const tW = MM_W / MAP_W, tH = MM_H / MAP_H;

  // Background
  ctx.fillStyle = '#000000cc';
  ctx.fillRect(mmX - 2, mmY - 2, MM_W + 4, MM_H + 4);

  for (let ty = 0; ty < MAP_H; ty++) {
    for (let tx = 0; tx < MAP_W; tx++) {
      const t = tileAt(map, tx, ty);
      let col: string | null = null;
      if (t === '#') col = palette.wall;
      else if (t === '~') col = '#0a0a2a';
      else if (t === 'T') col = '#2a4a2a';
      else if (t === '=') col = palette.path;
      else if (t >= '1' && t <= '9') col = completedNodeTiles.has(t) ? '#00ff88' : palette.accent;
      else col = palette.floor;

      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(mmX + tx * tW, mmY + ty * tH, Math.max(1, tW), Math.max(1, tH));
      }
    }
  }

  // Player dot (blinking)
  const blink = Math.floor(Date.now() / 400) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(mmX + px * tW - 1, mmY + py * tH - 1, 3, 3);
  }

  // Border
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 1;
  ctx.strokeRect(mmX - 1, mmY - 1, MM_W + 2, MM_H + 2);
}

// ─── Dialogue box (Undertale-style) ──────────────────────────────────────────
function drawDialogueBox(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  lineIndex: number,
  charProgress: number,
  npcName: string,
  accentColor: string,
  CW: number,
  CH: number
) {
  const PORTRAIT = 80;   // portrait box size
  const PAD = 12;
  const bx = 8, by = CH - 124, bw = CW - 16, bh = 112;
  const textX = bx + PORTRAIT + PAD * 2;
  const textW = bw - PORTRAIT - PAD * 3;

  // ── Outer box: dark background, sharp corners (Undertale style)
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(bx, by, bw, bh);

  // Outer border — 3px solid accent color
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(bx, by, bw, bh);

  // Inner border inset — darker shade
  ctx.lineWidth = 1;
  ctx.strokeStyle = shiftColor(accentColor, -70);
  ctx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);

  // ── Portrait box on the left
  ctx.fillStyle = '#000000';
  ctx.fillRect(bx + PAD, by + PAD, PORTRAIT, PORTRAIT - 8);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + PAD, by + PAD, PORTRAIT, PORTRAIT - 8);
  // Pixel face placeholder inside portrait
  ctx.fillStyle = accentColor + '33';
  ctx.fillRect(bx + PAD + 4, by + PAD + 4, PORTRAIT - 8, PORTRAIT - 16);
  // Draw a simple pixel-face silhouette
  ctx.fillStyle = accentColor + '88';
  const fx = bx + PAD + PORTRAIT / 2 - 10, fy = by + PAD + 8;
  ctx.fillRect(fx, fy, 20, 20);      // head
  ctx.fillRect(fx + 4, fy + 4, 3, 3); // left eye
  ctx.fillRect(fx + 13, fy + 4, 3, 3); // right eye
  ctx.fillRect(fx + 5, fy + 13, 10, 2); // mouth

  // ── Name label above portrait, Undertale-style colored tag
  ctx.fillStyle = accentColor;
  const nameLabel = npcName.toUpperCase();
  ctx.font = "bold 9px 'Press Start 2P', monospace";
  const nameMeasure = ctx.measureText(nameLabel);
  const nameBgW = nameMeasure.width + 16;
  ctx.fillRect(bx + PAD, by - 18, nameBgW, 20);
  ctx.fillStyle = '#000000';
  ctx.fillText(nameLabel, bx + PAD + 8, by - 4);

  // ── Dialogue text (typewriter) — Press Start 2P, white, 10px
  const text = lines[lineIndex] ?? '';
  const shown = text.slice(0, charProgress);
  ctx.fillStyle = '#ffffff';
  ctx.font = "10px 'Press Start 2P', monospace";

  // Word-wrap to fit textW (roughly 52 chars at 10px)
  const maxCharsPerLine = Math.floor(textW / 6.5);
  const words = shown.split(' ');
  let currentLine = '';
  let lineY = by + 28;
  for (const word of words) {
    const test = currentLine ? currentLine + ' ' + word : word;
    if (test.length > maxCharsPerLine) {
      ctx.fillText(currentLine, textX, lineY);
      currentLine = word;
      lineY += 18;
      if (lineY > by + bh - 16) break; // don't overflow box
    } else {
      currentLine = test;
    }
  }
  if (currentLine && lineY <= by + bh - 16) {
    ctx.fillText(currentLine, textX, lineY);
  }

  // ── "Press E" advance prompt — blinking cyan triangle
  if (charProgress >= text.length) {
    const blink = Math.floor(Date.now() / 500) % 2 === 0;
    if (blink) {
      ctx.fillStyle = accentColor;
      ctx.font = "9px 'Press Start 2P', monospace";
      ctx.fillText('▼', bx + bw - 22, by + bh - 10);
    }
  }
}

// ─── Node prompt overlay ──────────────────────────────────────────────────────
function drawNodePrompt(
  ctx: CanvasRenderingContext2D,
  tileCanvasX: number, tileCanvasY: number,
  accentColor: string,
  CW: number
) {
  const text = '  PRESS ENTER  ';
  const tw = text.length * 7 + 8;
  const tx = Math.max(4, Math.min(CW - tw - 4, tileCanvasX - tw / 2 + TILE * SCALE / 2));
  const ty = tileCanvasY - 28;

  ctx.fillStyle = '#000000cc';
  ctx.fillRect(tx, ty, tw, 18);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(tx, ty, tw, 18);
  ctx.fillStyle = accentColor;
  ctx.font = '10px monospace';
  ctx.fillText(text.trim(), tx + 4, ty + 13);
}

// ─── Cutscene ─────────────────────────────────────────────────────────────────
function drawCutscene(
  ctx: CanvasRenderingContext2D,
  phase: CutPhase,
  progress: number,
  world: WorldMap,
  charProgress: number,
  lineIndex: number,
  palette: WorldMap['palette'],
  realm: number,
  CW: number,
  CH: number
) {
  if (phase === 'done') return;

  if (phase === 'fadein') {
    // Black fade-in: alpha goes 1→0
    const alpha = 1 - progress;
    ctx.fillStyle = `rgba(0,0,0,${Math.max(0, alpha)})`;
    ctx.fillRect(0, 0, CW, CH);
    return;
  }

  if (phase === 'npc-walk') {
    // NPC slides from right edge toward centre
    const npcCanvasX = CW - (CW - CW * 0.4) * progress; // slide from right
    const npcCanvasY = CH * 0.35;
    const af = Math.floor(Date.now() / 300) % 2;

    // Darken world for cutscene focus
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, CW, CH);

    drawNpcSprite(ctx, npcCanvasX, npcCanvasY, world.npcGreeting.npc, 'left', af, palette);
    return;
  }

  if (phase === 'dialogue') {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, CW, CH);

    // Draw NPC sprite on left side
    drawNpcSprite(ctx, CW * 0.12, CH * 0.32, world.npcGreeting.npc, 'right', 0, palette);

    // Dialogue box
    const { npc, lines } = world.npcGreeting;
    const NPC_NAMES: Record<string, string> = { elliot: 'ELLIOT', ben: 'BEN', alex: 'ALEX', henry: 'HENRY' };
    drawDialogueBox(ctx, lines, lineIndex, charProgress, NPC_NAMES[npc] ?? npc, palette.accent, CW, CH);
    return;
  }
}

function drawNpcSprite(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  npc: string, dir: Dir, frame: number,
  palette: WorldMap['palette']
) {
  // Draw NPC at raw canvas position (not tile-based offset)
  const savedAlpha = ctx.globalAlpha;
  // Temporarily compute tile canvas coords for NPC drawing fns
  // The NPC functions use tile-origin coords + internal offsets
  // We'll shift so that tile origin = (x, y)
  const fakeCx = x;
  const fakeCy = y;
  switch (npc) {
    case 'elliot': drawElliot(ctx, fakeCx, fakeCy, dir, frame); break;
    case 'ben':    drawBen(ctx, fakeCx, fakeCy, dir, frame); break;
    case 'alex':   drawAlex(ctx, fakeCx, fakeCy, dir, frame); break;
    case 'henry':  drawHenry(ctx, fakeCx, fakeCy, dir, frame); break;
  }
  ctx.globalAlpha = savedAlpha;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PixelWorldEngine({ realm, onEnterNode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasSizeRef = useRef({ w: 800, h: 600 });
  const stateRef = useRef<GameState | null>(null);
  const onEnterRef = useRef(onEnterNode);
  onEnterRef.current = onEnterNode;

  const { progress, avatar, setCurrentNode } = useGameStore();

  // Get world data
  const world = WORLD_MAPS.find((w) => w.id === realm)!;
  const map = world.map;
  const realmNodes = getRealmNodes(realm);

  // Completed node tile chars
  const completedNodeTiles = new Set<string>();
  realmNodes.forEach((node, idx) => {
    if (progress.completedNodes[node.id]?.completed && idx < 9) {
      completedNodeTiles.add(String(idx + 1));
    }
  });

  const initState = useCallback((): GameState => {
    const startPos = findChar(map, '@') ?? { x: 20, y: 25 };
    const vpW = Math.ceil(canvasSizeRef.current.w / (TILE * SCALE)) + 2;
    const vpH = Math.ceil(canvasSizeRef.current.h / (TILE * SCALE)) + 2;
    const cam = {
      camX: Math.max(0, startPos.x - vpW / 2),
      camY: Math.max(0, startPos.y - vpH / 2),
    };
    return {
      frame: 0,
      px: startPos.x, py: startPos.y,
      pfx: 0, pfy: 0,
      moveProgress: 0,
      prevPx: startPos.x, prevPy: startPos.y,
      dir: 'down',
      moving: false,
      camX: cam.camX, camY: cam.camY,
      lastMoveTime: 0,
      lastAnimTime: 0,
      lastWalkTime: 0,
      animFrame: 0,
      walkFrame: 0,
      keys: new Set(),
      onNode: null,
      nearNpc: null,
      dialogueActive: false,
      dialogueLine: 0,
      dialogueChar: 0,
      dialogueLastChar: 0,
      cutPhase: 'fadein',
      cutProgress: 0,
      cutNpcX: canvasSizeRef.current.w,
      cutStartTime: performance.now(),
      cutDialogueLine: 0,
      cutDialogueChar: 0,
      cutDialogueLastChar: 0,
      nodePromptVisible: false,
      helperVisible: false,
    };
  }, [map]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight - 56;
      canvasSizeRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    ctx.imageSmoothingEnabled = false;

    stateRef.current = initState();
    const gs = stateRef.current;

    // ── Key handlers ──────────────────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      gs.keys.add(e.key);

      // Dismiss cutscene on any key
      if (gs.cutPhase !== 'done') {
        if (gs.cutPhase === 'fadein') {
          gs.cutPhase = 'npc-walk';
          gs.cutProgress = 0;
          gs.cutStartTime = performance.now();
        } else if (gs.cutPhase === 'npc-walk' && gs.cutProgress > 0.3) {
          gs.cutPhase = 'dialogue';
          gs.cutProgress = 0;
          gs.cutStartTime = performance.now();
          gs.cutDialogueChar = 0;
          gs.cutDialogueLastChar = performance.now();
        } else if (gs.cutPhase === 'dialogue') {
          const lines = world.npcGreeting.lines;
          if (gs.cutDialogueChar < (lines[gs.cutDialogueLine]?.length ?? 0)) {
            // Fast-forward typewriter
            gs.cutDialogueChar = lines[gs.cutDialogueLine]?.length ?? 0;
          } else if (gs.cutDialogueLine < lines.length - 1) {
            gs.cutDialogueLine++;
            gs.cutDialogueChar = 0;
            gs.cutDialogueLastChar = performance.now();
          } else {
            gs.cutPhase = 'done';
          }
        }
        e.preventDefault();
        return;
      }

      // NPC dialogue advance
      if (gs.dialogueActive && (e.key === 'e' || e.key === 'E' || e.key === 'Enter')) {
        const lines = world.npcGreeting.lines;
        if (gs.dialogueChar < (lines[gs.dialogueLine]?.length ?? 0)) {
          gs.dialogueChar = lines[gs.dialogueLine]?.length ?? 0;
        } else if (gs.dialogueLine < lines.length - 1) {
          gs.dialogueLine++;
          gs.dialogueChar = 0;
          gs.dialogueLastChar = performance.now();
        } else {
          gs.dialogueActive = false;
          gs.dialogueLine = 0;
          gs.dialogueChar = 0;
        }
        e.preventDefault();
        return;
      }

      // Boss castle entry (realm 1)
      if ((e.key === 'Enter' || e.key === 'e' || e.key === 'E') && !gs.dialogueActive && realm === 1 && tileAt(map, gs.px, gs.py) === 'B') {
        onEnterRef.current('BOSS');
        e.preventDefault();
        return;
      }

      // Enter node
      if ((e.key === 'Enter' || e.key === 'e' || e.key === 'E') && gs.onNode && !gs.dialogueActive) {
        const nodeIdx = parseInt(gs.onNode, 10) - 1;
        const node = realmNodes[nodeIdx];
        if (node) {
          setCurrentNode(node.id);
          onEnterRef.current(node.id);
        }
        e.preventDefault();
        return;
      }

      // Interact with NPC
      if ((e.key === 'e' || e.key === 'E') && gs.nearNpc && !gs.dialogueActive && !gs.onNode) {
        gs.dialogueActive = true;
        gs.dialogueLine = 0;
        gs.dialogueChar = 0;
        gs.dialogueLastChar = performance.now();
        e.preventDefault();
        return;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      gs.keys.delete(e.key);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // ── Game loop ─────────────────────────────────────────────────────────
    let rafId = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      gs.frame++;

      const CW = canvasSizeRef.current.w;
      const CH = canvasSizeRef.current.h;
      const VP_W = Math.ceil(CW / (TILE * SCALE)) + 2;
      const VP_H = Math.ceil(CH / (TILE * SCALE)) + 2;

      // ── Timers ──────────────────────────────────────────────────────────
      if (now - gs.lastAnimTime >= ANIM_MS) {
        gs.animFrame = (gs.animFrame + 1) % 4;
        gs.lastAnimTime = now;
      }

      // ── Cutscene update ─────────────────────────────────────────────────
      if (gs.cutPhase !== 'done') {
        const elapsed = now - gs.cutStartTime;
        if (gs.cutPhase === 'fadein') {
          gs.cutProgress = Math.min(1, elapsed / 1000);
          if (gs.cutProgress >= 1) {
            gs.cutPhase = 'npc-walk';
            gs.cutProgress = 0;
            gs.cutStartTime = now;
          }
        } else if (gs.cutPhase === 'npc-walk') {
          gs.cutProgress = Math.min(1, elapsed / 2000);
          if (gs.cutProgress >= 1) {
            gs.cutPhase = 'dialogue';
            gs.cutProgress = 0;
            gs.cutStartTime = now;
            gs.cutDialogueChar = 0;
            gs.cutDialogueLastChar = now;
          }
        } else if (gs.cutPhase === 'dialogue') {
          // Typewriter
          if (now - gs.cutDialogueLastChar >= 40) {
            const line = world.npcGreeting.lines[gs.cutDialogueLine] ?? '';
            if (gs.cutDialogueChar < line.length) {
              gs.cutDialogueChar++;
              gs.cutDialogueLastChar = now;
            }
          }
        }
      }

      // ── NPC dialogue typewriter ──────────────────────────────────────────
      if (gs.dialogueActive && now - gs.dialogueLastChar >= 40) {
        const line = world.npcGreeting.lines[gs.dialogueLine] ?? '';
        if (gs.dialogueChar < line.length) {
          gs.dialogueChar++;
          gs.dialogueLastChar = now;
        }
      }

      // ── Player movement (only when cutscene done) ────────────────────────
      if (gs.cutPhase === 'done' && !gs.dialogueActive) {
        // Walk frame
        if (gs.moving && now - gs.lastWalkTime >= WALK_MS) {
          gs.walkFrame = gs.walkFrame === 0 ? 1 : 0;
          gs.lastWalkTime = now;
        }

        // Movement interpolation — compute progress directly (not accumulated)
        if (gs.moving) {
          gs.moveProgress = Math.min(1, (now - gs.lastMoveTime) / MOVE_MS);
          gs.pfx = gs.moveProgress;
          gs.pfy = gs.moveProgress;
          if (gs.moveProgress >= 1) {
            gs.moving = false;
            gs.moveProgress = 0;
            gs.pfx = 0;
            gs.pfy = 0;
          }
        }

        // Start new move
        if (!gs.moving && now - gs.lastMoveTime >= MOVE_MS) {
          let dx = 0, dy = 0;
          if (gs.keys.has('ArrowUp')    || gs.keys.has('w') || gs.keys.has('W')) { dy = -1; gs.dir = 'up'; }
          if (gs.keys.has('ArrowDown')  || gs.keys.has('s') || gs.keys.has('S')) { dy =  1; gs.dir = 'down'; }
          if (gs.keys.has('ArrowLeft')  || gs.keys.has('a') || gs.keys.has('A')) { dx = -1; gs.dir = 'left'; }
          if (gs.keys.has('ArrowRight') || gs.keys.has('d') || gs.keys.has('D')) { dx =  1; gs.dir = 'right'; }

          if (dx !== 0 || dy !== 0) {
            const nx = gs.px + dx, ny = gs.py + dy;
            if (isWalkable(map, nx, ny)) {
              gs.prevPx = gs.px; gs.prevPy = gs.py;
              gs.px = nx; gs.py = ny;
              gs.pfx = 0; gs.pfy = 0;
              gs.moveProgress = 0;
              gs.moving = true;
              gs.lastMoveTime = now;
            }
          }
        }

        // Detect node / NPC
        const cur = tileAt(map, gs.px, gs.py);
        gs.onNode = (cur >= '1' && cur <= '9') ? cur : null;
        const onBoss = cur === 'B' && realm === 1;
        gs.nodePromptVisible = gs.onNode !== null || onBoss;

        // Check adjacent tiles for NPCs (in realm 1, 'B' is boss castle not NPC)
        gs.nearNpc = null;
        const npcChars = realm === 1 ? ['E', 'A', 'H'] : ['E', 'B', 'A', 'H'];
        const neighbors = [[0,-1],[0,1],[-1,0],[1,0]];
        for (const [ddx, ddy] of neighbors) {
          const adjTile = tileAt(map, gs.px + ddx, gs.py + ddy);
          if (npcChars.includes(adjTile)) { gs.nearNpc = adjTile; break; }
        }
      }

      // ── Camera smooth follow ─────────────────────────────────────────────
      if (gs.cutPhase === 'done') {
        // Interpolated player position
        const interpX = gs.prevPx + (gs.px - gs.prevPx) * (gs.moving ? gs.pfx : 1);
        const interpY = gs.prevPy + (gs.py - gs.prevPy) * (gs.moving ? gs.pfy : 1);

        const targetCamX = interpX - VP_W / 2 + 0.5;
        const targetCamY = interpY - VP_H / 2 + 0.5;
        const maxCamX = MAP_W - VP_W;
        const maxCamY = MAP_H - VP_H;
        gs.camX += (Math.max(0, Math.min(maxCamX, targetCamX)) - gs.camX) * CAM_LERP;
        gs.camY += (Math.max(0, Math.min(maxCamY, targetCamY)) - gs.camY) * CAM_LERP;
      }

      // ── Render ──────────────────────────────────────────────────────────
      render(ctx, gs, world, map, now, realm, completedNodeTiles, realmNodes, avatar, progress, CW, CH, VP_W, VP_H);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', updateSize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      autoFocus
      onClick={(e) => e.currentTarget.focus()}
      style={{
        position: 'fixed',
        top: 56,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
        outline: 'none',
        background: world.palette.sky,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ imageRendering: 'pixelated', display: 'block', width: '100%', height: '100%' } as React.CSSProperties}
      />
    </div>
  );
}

// ─── Render function ──────────────────────────────────────────────────────────
function render(
  ctx: CanvasRenderingContext2D,
  gs: GameState,
  world: WorldMap,
  map: string[],
  now: number,
  realm: number,
  completedNodeTiles: Set<string>,
  realmNodes: ReturnType<typeof getRealmNodes>,
  avatar: { skinTone: string; clothingColorPrimary: string; hairColor: string },
  progress: { completedNodes: Record<string, { completed: boolean }> },
  CW: number,
  CH: number,
  VP_W: number,
  VP_H: number
) {
  const { palette } = world;
  const t = now / 1000;
  const frame = Math.floor(t * 60);

  // Clear
  ctx.fillStyle = palette.sky;
  ctx.fillRect(0, 0, CW, CH);

  // Tile render
  const camTileX = Math.floor(gs.camX);
  const camTileY = Math.floor(gs.camY);
  const camOffX = (gs.camX - camTileX) * TILE * SCALE;
  const camOffY = (gs.camY - camTileY) * TILE * SCALE;

  // Interpolated player position for reference
  const interpPX = gs.prevPx + (gs.px - gs.prevPx) * (gs.moving ? Math.min(1, gs.pfx) : 1);
  const interpPY = gs.prevPy + (gs.py - gs.prevPy) * (gs.moving ? Math.min(1, gs.pfy) : 1);

  for (let row = -1; row <= VP_H + 1; row++) {
    for (let col = -1; col <= VP_W + 1; col++) {
      const tx = camTileX + col;
      const ty = camTileY + row;
      if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;

      const tile = tileAt(map, tx, ty);
      const cx = Math.round(col * TILE * SCALE - camOffX);
      const cy = Math.round(row * TILE * SCALE - camOffY);

      // In realm 1, 'B' is boss castle (not NPC); in other realms 'B' is Ben NPC
      const isNpcTile = tile === 'E' || (tile === 'B' && realm !== 1) || tile === 'A' || tile === 'H';

      if (isNpcTile) {
        // Draw floor beneath NPC
        drawTile(ctx, cx, cy, '.', gs.animFrame, palette, realm, false, t, tx, ty, frame);
      } else {
        const isComplete = completedNodeTiles.has(tile);
        drawTile(ctx, cx, cy, tile, gs.animFrame, palette, realm, isComplete, t, tx, ty, frame);
      }

      // Draw NPC sprite
      if (isNpcTile) {
        const af = gs.animFrame % 2;
        switch (tile) {
          case 'E': drawElliot(ctx, cx, cy, 'down', af); break;
          case 'B': drawBen(ctx, cx, cy, 'down', af); break;
          case 'A': drawAlex(ctx, cx, cy, 'down', af); break;
          case 'H': drawHenry(ctx, cx, cy, 'down', af); break;
        }
      }

      // "Press E to interact" hint near NPCs
      if (isNpcTile && gs.cutPhase === 'done') {
        const nearPlayer = Math.abs(tx - gs.px) <= 1 && Math.abs(ty - gs.py) <= 1;
        if (nearPlayer && !gs.dialogueActive) {
          ctx.fillStyle = palette.accent;
          ctx.font = '9px monospace';
          ctx.fillText('▲ E', cx + TILE * SCALE / 2 - 8, cy - 4);
        }
      }
    }
  }

  // Draw player (interpolated position)
  {
    const playerScreenX = Math.round((interpPX - gs.camX) * TILE * SCALE);
    const playerScreenY = Math.round((interpPY - gs.camY) * TILE * SCALE);
    const wf = gs.moving ? gs.walkFrame : 0;
    drawPlayer(
      ctx,
      playerScreenX, playerScreenY,
      gs.dir, wf,
      avatar.skinTone,
      avatar.clothingColorPrimary,
      avatar.hairColor ?? '#1a1a1a'
    );
  }

  // Node prompt overlay
  if (gs.nodePromptVisible && gs.cutPhase === 'done') {
    const playerScreenX = Math.round((interpPX - gs.camX) * TILE * SCALE);
    const playerScreenY = Math.round((interpPY - gs.camY) * TILE * SCALE);
    drawNodePrompt(ctx, playerScreenX, playerScreenY, palette.accent, CW);
  }

  // Mini-map (top-right)
  drawMinimap(ctx, map, gs.px, gs.py, palette, completedNodeTiles, CW);

  // Node counter (top-left)
  const totalNodes = Math.min(realmNodes.length, 9);
  const doneCount = [...completedNodeTiles].length;
  ctx.fillStyle = '#000000aa';
  ctx.fillRect(4, 4, 110, 18);
  ctx.fillStyle = palette.accent;
  ctx.font = '10px monospace';
  ctx.fillText(`NODES: ${doneCount} / ${totalNodes}`, 8, 17);

  // Controls hint (bottom-left, during gameplay)
  if (gs.cutPhase === 'done' && !gs.dialogueActive) {
    ctx.fillStyle = '#00000099';
    ctx.fillRect(4, CH - 20, 180, 16);
    ctx.fillStyle = '#888888';
    ctx.font = '9px monospace';
    ctx.fillText('WASD/ARROWS: move  E: interact', 8, CH - 8);
  }

  // NPC dialogue overlay
  if (gs.dialogueActive) {
    const NPC_NAMES: Record<string, string> = { E: 'ELLIOT', B: 'BEN', A: 'ALEX', H: 'HENRY' };
    const npcName = gs.nearNpc ? (NPC_NAMES[gs.nearNpc] ?? 'NPC') : 'NPC';
    drawDialogueBox(ctx, world.npcGreeting.lines, gs.dialogueLine, gs.dialogueChar, npcName, palette.accent, CW, CH);
  }

  // Cutscene overlay
  if (gs.cutPhase !== 'done') {
    drawCutscene(
      ctx, gs.cutPhase, gs.cutProgress, world,
      gs.cutDialogueChar, gs.cutDialogueLine,
      palette, realm, CW, CH
    );
  }
}
