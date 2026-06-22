'use client';
// ─── Enemy Encounter System ───────────────────────────────────────────────────
// All 19 regular enemies (Henry Lacks = BossBattle.tsx, realm 4 final).
// Every sprite drawn via Canvas 2D fillRect — no image files.

import { useEffect, useRef, useState, useCallback } from 'react';

const SCALE = 3;

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnemyId =
  | 'corrupted-atp'     | 'rogue-mrna'      | 'lysosome-scout'
  | 'unfolded-protein'  | 'nuclease-specter'
  | 'corrupted-read'    | 'duplicate-chromosome' | 'misannotated-gene'
  | 'tandem-repeat'
  | 'overfitted-minion' | 'vanishing-gradient'   | 'nan-entity'
  | 'attention-hydra'   | 'learning-rate-demon'
  | 'amyloid-soldier'   | 'disulfide-bandit'     | 'phantom-crystal'
  | 'prediction-ghost'  | 'amyloid-tyrant';

export interface EnemyDef {
  id: EnemyId;
  name: string;
  realm: 1 | 2 | 3 | 4;
  hp: number;
  damage: number;
  battleCry: string;
  weakness: string;
  enzymeComment: string;
  spawnsInGroups?: boolean;
  groupSize?: number;
  hpGrowsOnMiss?: boolean;
  draw: (ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, hp: number) => void;
}

// ─── Sprite helper: game-px rect relative to enemy origin ─────────────────────

function b(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  dx: number, dy: number,
  w: number, h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(ox + dx * SCALE, oy + dy * SCALE, w * SCALE, h * SCALE);
}

// ─── Enemy Sprites ────────────────────────────────────────────────────────────

function drawCorruptedATP(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Spinning ring going backwards — orange-red corruption
  const spin = t * 0.15;
  // Outer ring
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - spin;
    const rx = 12 + Math.cos(a) * 10;
    const ry = 12 + Math.sin(a) * 8;
    const col = i % 2 === 0 ? '#ff4400' : '#cc2200';
    b(ctx, ox, oy, Math.floor(rx), Math.floor(ry), 2, 2, col);
  }
  // Central hub
  b(ctx, ox, oy, 8, 7, 8, 8, '#331100');
  b(ctx, ox, oy, 9, 8, 6, 6, '#662200');
  b(ctx, ox, oy, 10, 9, 4, 4, '#ff4400');
  b(ctx, ox, oy, 11, 10, 2, 2, '#ffaa44');
  // Spokes radiating wrong direction
  const wrongDir = -spin * 2;
  for (let s2 = 0; s2 < 6; s2++) {
    const a = (s2 / 6) * Math.PI * 2 + wrongDir;
    const sx = 11 + Math.cos(a) * 5;
    const sy = 11 + Math.sin(a) * 5;
    b(ctx, ox, oy, Math.floor(sx), Math.floor(sy), 1, 1, '#ff8833');
  }
  // Corruption sparks
  const sp = Math.floor(t * 8) % 4;
  const sparkPos = [[4, 2], [19, 4], [2, 18], [20, 16]];
  if (sp < sparkPos.length) {
    b(ctx, ox, oy, sparkPos[sp][0], sparkPos[sp][1], 2, 2, '#ffcc00');
    b(ctx, ox, oy, sparkPos[sp][0] + 1, sparkPos[sp][1], 1, 1, '#ffffff');
  }
}

function drawRogueMRNA(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Wavy strand with wrong codons glowing red
  const baseColors: Record<string, string> = {
    A: '#ff6644', U: '#ffaa00', G: '#44aaff', C: '#44ff88',
  };
  const WRONG = ['A', 'U', 'A', 'U', 'G', 'A', 'G', 'C', 'U', 'A', 'G', 'U'];
  const CORRECT = ['A', 'U', 'G', 'C', 'A', 'U', 'G', 'C', 'A', 'U', 'G', 'C'];
  for (let i = 0; i < 12; i++) {
    const wave = Math.sin(i * 0.8 + t * 0.2) * 4;
    const baseX = 1 + i * 2;
    const baseY = 12 + Math.floor(wave);
    const isWrong = WRONG[i] !== CORRECT[i];
    const col = isWrong ? '#ff2244' : baseColors[WRONG[i]];
    b(ctx, ox, oy, baseX, baseY, 2, 3, col);
    if (isWrong && Math.floor(t * 4) % 2 === 0) {
      b(ctx, ox, oy, baseX - 1, baseY - 1, 4, 5, '#ff224433');
      ctx.globalAlpha = 0.3;
      b(ctx, ox, oy, baseX - 1, baseY - 1, 4, 5, '#ff2244');
      ctx.globalAlpha = 1;
    }
    // Backbone
    if (i < 11) b(ctx, ox, oy, baseX + 1, baseY + 1, 2, 1, '#886644');
  }
  // Splicing error marker
  const errX = 11, errY = 8;
  b(ctx, ox, oy, errX, errY, 6, 4, '#440000');
  b(ctx, ox, oy, errX + 1, errY + 1, 4, 2, '#ff0022');
  b(ctx, ox, oy, errX + 2, errY, 2, 1, '#ffffff');
}

function drawLysosomeScout(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, hp: number
) {
  // Round purple blob with 6 tiny eyes and acid drips
  const phase = hp > 66 ? 1 : hp > 33 ? 2 : 3;
  const main = phase === 1 ? '#aa44cc' : phase === 2 ? '#772299' : '#441166';
  const hi   = phase === 1 ? '#cc77ee' : phase === 2 ? '#9933bb' : '#663399';
  const drk  = phase === 1 ? '#660088' : phase === 2 ? '#440066' : '#220044';
  // Body blob
  b(ctx, ox, oy, 7, 0, 10, 2, main);
  b(ctx, ox, oy, 4, 2, 16, 3, main);
  b(ctx, ox, oy, 2, 5, 20, 14, main);
  b(ctx, ox, oy, 2, 5, 4, 8, hi);
  b(ctx, ox, oy, 4, 19, 16, 3, drk);
  b(ctx, ox, oy, 7, 22, 10, 2, drk);
  // 6 eyes in two rows
  const eyePositions = [[4, 8], [10, 8], [16, 8], [6, 13], [12, 13], [18, 13]];
  for (const [ex, ey] of eyePositions) {
    b(ctx, ox, oy, ex, ey, 3, 3, '#000000');
    b(ctx, ox, oy, ex + 1, ey + 1, 1, 1, '#ff2244');
    b(ctx, ox, oy, ex + 1, ey + 1, 1, 1, '#ff2244');
    if (Math.floor(t * 3) % 3 !== 2) b(ctx, ox, oy, ex, ey, 1, 1, '#ffffff');
  }
  // Acid drips
  const drip = Math.floor(t * 3) % 4;
  b(ctx, ox, oy, 5, 22 + drip, 2, drip + 1, '#66ff00');
  b(ctx, ox, oy, 12, 23 + (drip + 1) % 4, 2, (drip + 1) % 4 + 1, '#44ff00');
  b(ctx, ox, oy, 18, 21 + drip % 3, 2, drip % 3 + 1, '#55ff22');
}

function drawUnfoldedProtein(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Sad amorphous blob — gray, floppy, dangling chain pixels
  const wobble = Math.sin(t * 0.08) * 2;
  // Main blob (asymmetric, tired)
  b(ctx, ox, oy, 6, 2, 12, 3, '#aaaaaa');
  b(ctx, ox, oy, 4, 5, 16, 4, '#bbbbbb');
  b(ctx, ox, oy, 3, 9, 18, 8, '#aaaaaa');
  b(ctx, ox, oy, 5, 17, 14, 4, '#999999');
  b(ctx, ox, oy, 7, 21, 10, 2, '#888888');
  // Highlight
  b(ctx, ox, oy, 5, 4, 6, 3, '#cccccc');
  // Dangling chain pixels — wobbling loose ends
  const chainY = Math.floor(wobble);
  b(ctx, ox, oy, 2, 10 + chainY, 1, 6, '#888888');
  b(ctx, ox, oy, 1, 15 + chainY, 3, 1, '#777777');
  b(ctx, ox, oy, 21, 8 - chainY, 1, 5, '#888888');
  b(ctx, ox, oy, 20, 12 - chainY, 3, 1, '#777777');
  b(ctx, ox, oy, 9, 23, 1, 3 + Math.floor(chainY), '#888888');
  // Sad droopy eyes
  b(ctx, ox, oy, 8, 9, 3, 2, '#000000');
  b(ctx, ox, oy, 13, 9, 3, 2, '#000000');
  b(ctx, ox, oy, 9, 10, 1, 1, '#4488ff');
  b(ctx, ox, oy, 14, 10, 1, 1, '#4488ff');
  // Downturned mouth
  b(ctx, ox, oy, 9, 14, 6, 1, '#666666');
  b(ctx, ox, oy, 8, 15, 2, 1, '#666666');
  b(ctx, ox, oy, 14, 15, 2, 1, '#666666');
}

function drawNucleaseSpecter(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Ghostly translucent figure holding tiny scissors — cuts everything
  const ghostAlpha = 0.55 + 0.3 * Math.sin(t * 0.12);
  ctx.globalAlpha = ghostAlpha;
  // Ghost body
  b(ctx, ox, oy, 8, 0, 8, 4, '#aaccdd');
  b(ctx, ox, oy, 6, 4, 12, 8, '#99bbcc');
  b(ctx, ox, oy, 5, 12, 14, 6, '#88aabb');
  // Wispy bottom (jagged)
  b(ctx, ox, oy, 5, 18, 3, 3, '#88aabb');
  b(ctx, ox, oy, 9, 19, 3, 2, '#88aabb');
  b(ctx, ox, oy, 13, 18, 3, 3, '#88aabb');
  b(ctx, ox, oy, 17, 19, 2, 2, '#88aabb');
  // Eyes (hollow)
  b(ctx, ox, oy, 9, 5, 2, 2, '#334455');
  b(ctx, ox, oy, 13, 5, 2, 2, '#334455');
  b(ctx, ox, oy, 9, 5, 1, 1, '#001122');
  b(ctx, ox, oy, 13, 5, 1, 1, '#001122');
  // Scissors being held
  b(ctx, ox, oy, 16, 8, 5, 1, '#cccccc');
  b(ctx, ox, oy, 17, 7, 3, 1, '#bbbbbb');
  b(ctx, ox, oy, 17, 9, 3, 1, '#bbbbbb');
  b(ctx, ox, oy, 15, 8, 2, 1, '#999999');
  // Snip animation
  const snip = Math.floor(t * 4) % 8;
  if (snip < 2) {
    b(ctx, ox, oy, 20, 7, 4, 1, '#eeeeee');
    b(ctx, ox, oy, 20, 9, 4, 1, '#eeeeee');
  } else if (snip < 4) {
    b(ctx, ox, oy, 20, 7, 2, 2, '#eeeeee');
    b(ctx, ox, oy, 22, 7, 2, 1, '#eeeeee');
  }
  ctx.globalAlpha = 1;
}

function drawCorruptedRead(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Pixelated sequence display — Q15 quality score glowing orange-red
  // Screen body
  b(ctx, ox, oy, 2, 2, 20, 14, '#001122');
  b(ctx, ox, oy, 3, 3, 18, 12, '#002233');
  // Sequence lines
  const bases = ['A', 'G', 'T', 'C', 'A', 'T', 'G', 'C', 'A'];
  const bCol: Record<string, string> = { A: '#ff6644', G: '#44aaff', T: '#44ff88', C: '#ffaa00' };
  for (let i = 0; i < 9; i++) {
    const badQuality = i % 3 === 1;
    const col = badQuality ? '#ff2244' : bCol[bases[i]];
    b(ctx, ox, oy, 4 + i * 2, 5, 1, 3, col);
    b(ctx, ox, oy, 4 + i * 2, 8, 1, 2, badQuality ? '#cc0011' : '#334455');
    if (badQuality && Math.floor(t * 6) % 2 === 0) {
      ctx.globalAlpha = 0.4;
      b(ctx, ox, oy, 3 + i * 2, 4, 3, 6, '#ff2244');
      ctx.globalAlpha = 1;
    }
  }
  // Q15 quality score badge (orange, bad)
  b(ctx, ox, oy, 3, 12, 7, 3, '#cc4400');
  b(ctx, ox, oy, 4, 12, 5, 3, '#ff8800');
  // "Q15" implied by colored bars
  b(ctx, ox, oy, 4, 13, 1, 1, '#ffffff'); b(ctx, ox, oy, 6, 13, 2, 1, '#ffffff');
  // Error overlay
  if (Math.floor(t * 3) % 6 < 2) {
    ctx.globalAlpha = 0.15;
    b(ctx, ox, oy, 2, 2, 20, 14, '#ff0000');
    ctx.globalAlpha = 1;
  }
  // Antenna
  b(ctx, ox, oy, 11, 0, 2, 3, '#003355');
  b(ctx, ox, oy, 10, 0, 4, 1, '#004466');
  // Stand
  b(ctx, ox, oy, 8, 16, 8, 2, '#002244');
  b(ctx, ox, oy, 4, 18, 16, 2, '#002244');
}

function drawDuplicateChromosome(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // TWO identical X-chromosome sprites side by side, arguing
  const drawChromosome = (baseX: number) => {
    // X shape
    b(ctx, ox, oy, baseX, 2, 4, 20, '#dd4488');
    b(ctx, ox, oy, baseX + 6, 2, 4, 20, '#dd4488');
    b(ctx, ox, oy, baseX - 1, 9, 12, 6, '#dd4488');
    b(ctx, ox, oy, baseX, 9, 10, 6, '#ee66aa');
    // Centromere
    b(ctx, ox, oy, baseX + 1, 10, 8, 4, '#cc2266');
    b(ctx, ox, oy, baseX + 2, 11, 6, 2, '#ff88bb');
    // Arms highlight
    b(ctx, ox, oy, baseX, 2, 2, 7, '#ee66aa');
    b(ctx, ox, oy, baseX + 6, 2, 2, 7, '#ee66aa');
  };
  drawChromosome(3);   // left
  drawChromosome(15);  // right (identical!)
  // Argument arrows pointing at each other
  const frame = Math.floor(t * 4) % 4;
  const arrowX = 10 + (frame < 2 ? 1 : -1);
  b(ctx, ox, oy, arrowX, 12, 3, 2, '#ffffff');
  b(ctx, ox, oy, arrowX, 11, 1, 4, '#ffffff');
  b(ctx, ox, oy, arrowX + 3, 11, 1, 4, '#ffffff');
}

function drawMisannotatedGene(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Faded sprite with a wrong sticker: "HYPOTHETICAL PROTEIN"
  const fade = 0.5 + 0.15 * Math.sin(t * 0.05);
  ctx.globalAlpha = fade;
  // Gene body (wavy, faded)
  b(ctx, ox, oy, 4, 8, 16, 8, '#334433');
  b(ctx, ox, oy, 2, 10, 20, 4, '#445544');
  b(ctx, ox, oy, 4, 9, 16, 1, '#556655');
  // Arrow indicating gene direction
  b(ctx, ox, oy, 18, 10, 4, 4, '#334433');
  b(ctx, ox, oy, 19, 9, 2, 6, '#445544');
  b(ctx, ox, oy, 20, 8, 1, 8, '#556655');
  ctx.globalAlpha = 1;
  // STICKER on top (1998 annotation — wrong font)
  b(ctx, ox, oy, 3, 0, 18, 7, '#fffde0');
  b(ctx, ox, oy, 4, 1, 16, 5, '#fff8c0');
  b(ctx, ox, oy, 3, 0, 18, 1, '#cccc88');
  b(ctx, ox, oy, 3, 6, 18, 1, '#cccc88');
  // "HYPO." text implied by colored bars
  for (let i = 0; i < 5; i++) {
    b(ctx, ox, oy, 4 + i * 3, 2, 2, 3, '#888800');
  }
  b(ctx, ox, oy, 4, 4, 16, 1, '#aaaa44');
  // Tape mark
  b(ctx, ox, oy, 2, 2, 2, 3, '#ddddaa');
  b(ctx, ox, oy, 20, 1, 2, 4, '#ddddaa');
}

function drawTandemRepeat(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, hp: number
) {
  // Centipede-like, segmented — segments = wrong answers given
  // HP decreases as player succeeds; high HP means more segments visible
  const segs = Math.max(3, Math.floor(hp / 12));
  const segW = Math.min(4, Math.floor(24 / segs));
  for (let i = 0; i < segs; i++) {
    const segX = i * (segW + 1);
    const bobY = Math.floor(Math.sin(t * 0.15 + i * 0.6) * 2);
    const col = i % 2 === 0 ? '#4444ff' : '#6666dd';
    b(ctx, ox, oy, segX, 8 + bobY, segW, 6, col);
    b(ctx, ox, oy, segX, 8 + bobY, segW, 1, '#8888ff');
    // Legs
    b(ctx, ox, oy, segX + 1, 14 + bobY, 1, 3, '#3333cc');
    b(ctx, ox, oy, segX + 2, 14 + bobY, 1, 3, '#3333cc');
    if (i === segs - 1) {
      // Head
      b(ctx, ox, oy, segX + segW, 6 + bobY, 4, 8, '#2222ee');
      b(ctx, ox, oy, segX + segW + 1, 8 + bobY, 2, 2, '#ffffff');
      b(ctx, ox, oy, segX + segW + 1, 10 + bobY, 2, 1, '#ff4444');
    }
  }
  // "CAG" repeating above
  const repOff = Math.floor(t * 4) % 3;
  const repCols = ['#ff6644', '#44aaff', '#44ff88'];
  for (let r = 0; r < 4; r++) {
    b(ctx, ox, oy, r * 4 + repOff, 2, 3, 3, repCols[r % 3]);
  }
}

function drawOverfittedMinion(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Glowing neural net sprite — "100%" displayed over it
  // Background glow
  const glow = 0.4 + 0.3 * Math.sin(t * 0.1);
  ctx.globalAlpha = glow * 0.3;
  b(ctx, ox, oy, 0, 0, 24, 24, '#6644ff');
  ctx.globalAlpha = 1;
  // Neural net nodes
  const nodes = [[4, 4], [4, 12], [4, 20], [12, 8], [12, 16], [20, 12]];
  for (const [nx, ny] of nodes) {
    b(ctx, ox, oy, nx - 1, ny - 1, 4, 4, '#4422dd');
    b(ctx, ox, oy, nx, ny, 2, 2, '#aa88ff');
    b(ctx, ox, oy, nx, ny, 1, 1, '#ffffff');
  }
  // Connections (all lit up = overfitting)
  const connCols = ['#aa44ff', '#8833dd', '#cc66ff'];
  const connections = [[4, 4, 12, 8], [4, 4, 12, 16], [4, 12, 12, 8], [4, 12, 12, 16], [4, 20, 12, 16], [12, 8, 20, 12], [12, 16, 20, 12]];
  for (let ci = 0; ci < connections.length; ci++) {
    const [x1, y1, x2, y2] = connections[ci];
    // Simple diagonal line approximation
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let s = 0; s < steps; s++) {
      const fx = x1 + Math.round((x2 - x1) * s / steps);
      const fy = y1 + Math.round((y2 - y1) * s / steps);
      b(ctx, ox, oy, fx, fy, 1, 1, connCols[ci % connCols.length]);
    }
  }
  // "100%" badge
  b(ctx, ox, oy, 6, 8, 12, 8, '#003300');
  b(ctx, ox, oy, 7, 9, 10, 6, '#00aa44');
  b(ctx, ox, oy, 7, 9, 10, 1, '#00ff66');
  // Bars representing "100%"
  b(ctx, ox, oy, 8, 11, 8, 2, '#00ff44');
  b(ctx, ox, oy, 8, 11, 8, 1, '#aaffcc');
}

function drawVanishingGradient(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Nearly invisible — extremely faint sprite, barely there
  const visibility = 0.08 + 0.06 * Math.sin(t * 0.07);
  ctx.globalAlpha = visibility;
  // Ghost-like figure
  b(ctx, ox, oy, 8, 2, 8, 6, '#aaaaff');
  b(ctx, ox, oy, 6, 8, 12, 8, '#9999ee');
  b(ctx, ox, oy, 7, 16, 10, 5, '#8888dd');
  b(ctx, ox, oy, 6, 21, 3, 3, '#8888dd');
  b(ctx, ox, oy, 10, 22, 3, 2, '#8888dd');
  b(ctx, ox, oy, 15, 21, 3, 3, '#8888dd');
  // Eyes
  b(ctx, ox, oy, 9, 5, 2, 2, '#ffffff');
  b(ctx, ox, oy, 13, 5, 2, 2, '#ffffff');
  ctx.globalAlpha = 1;
  // "...help." barely visible as a tiny text bar
  ctx.globalAlpha = 0.12;
  b(ctx, ox, oy, 4, 25, 16, 2, '#ffffff');
  ctx.globalAlpha = 1;
}

function drawNaNEntity(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Shimmering undefined — NaN rendered as visual static
  const f = Math.floor(t * 12);
  // Static noise pattern (deterministic, but varies fast)
  for (let row = 0; row < 24; row += 2) {
    for (let col = 0; col < 24; col += 2) {
      const hash = (row * 17 + col * 7 + f * 3) % 8;
      const brightness = hash < 2 ? 0 : hash < 5 ? 80 : 160;
      ctx.fillStyle = `rgb(${brightness},${brightness},${brightness + 40})`;
      ctx.fillRect(ox + col * SCALE, oy + row * SCALE, 2 * SCALE, 2 * SCALE);
    }
  }
  // "NaN" silhouette outline only
  ctx.globalAlpha = 0.9;
  b(ctx, ox, oy, 4, 8, 2, 8, '#00ffff');
  b(ctx, ox, oy, 4, 8, 6, 2, '#00ffff');
  b(ctx, ox, oy, 8, 12, 2, 4, '#00ffff');
  b(ctx, ox, oy, 10, 8, 2, 8, '#00ffff');
  b(ctx, ox, oy, 14, 8, 2, 8, '#00ffff');
  b(ctx, ox, oy, 14, 8, 4, 2, '#00ffff');
  b(ctx, ox, oy, 14, 12, 4, 2, '#00ffff');
  b(ctx, ox, oy, 14, 14, 4, 2, '#00ffff');
  b(ctx, ox, oy, 18, 8, 2, 8, '#00ffff');
  ctx.globalAlpha = 1;
  // Glitch flicker on top
  if (f % 7 < 2) {
    ctx.globalAlpha = 0.4;
    b(ctx, ox, oy, 0, f % 24, 24, 1, '#ffffff');
    ctx.globalAlpha = 1;
  }
}

function drawAttentionHydra(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, hp: number
) {
  // Multi-headed serpent — heads = visual indicator (hp-based)
  const visibleHeads = Math.min(8, Math.max(2, Math.floor((100 - hp) / 8) + 2));
  // Body
  b(ctx, ox, oy, 8, 16, 8, 8, '#331166');
  b(ctx, ox, oy, 7, 14, 10, 4, '#442288');
  b(ctx, ox, oy, 8, 14, 8, 1, '#6644aa');
  // Heads spread outward
  for (let h = 0; h < Math.min(visibleHeads, 8); h++) {
    const angle = (h / Math.min(visibleHeads, 8)) * Math.PI * 1.4 - 0.2;
    const neckLen = 6 + h % 3;
    const nx = 12 + Math.round(Math.cos(angle) * neckLen);
    const ny = 12 - Math.round(Math.sin(angle) * neckLen);
    // Neck
    for (let n = 1; n < neckLen; n++) {
      const np = n / neckLen;
      const nnx = Math.round(12 + Math.cos(angle) * (n));
      const nny = Math.round(12 - Math.sin(angle) * (n));
      b(ctx, ox, oy, nnx - 1, nny - 1, 2, 2, '#4422aa');
    }
    // Head
    const wobble = Math.floor(Math.sin(t * 0.1 + h * 0.7) * 1);
    b(ctx, ox, oy, nx - 2, ny - 2 + wobble, 5, 4, '#5533cc');
    b(ctx, ox, oy, nx - 1, ny - 1 + wobble, 3, 2, '#8866ee');
    b(ctx, ox, oy, nx - 1, ny + wobble, 1, 1, '#ff2244');
    b(ctx, ox, oy, nx + 2, ny + wobble, 1, 1, '#ff2244');
  }
}

function drawLearningRateDemon(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Jittery — alternates between giant and tiny size
  const cycle = Math.sin(t * 0.2);
  const isHuge = cycle > 0.3;
  const isTiny = cycle < -0.3;
  if (isHuge) {
    // HUGE mode — oversized, chaotic
    b(ctx, ox, oy, 2, 0, 20, 24, '#ff4400');
    b(ctx, ox, oy, 4, 2, 16, 20, '#ff6622');
    b(ctx, ox, oy, 4, 2, 16, 3, '#ff9944');
    b(ctx, ox, oy, 8, 8, 8, 8, '#331100');
    b(ctx, ox, oy, 9, 9, 3, 3, '#ff0000');
    b(ctx, ox, oy, 13, 9, 3, 3, '#ff0000');
    b(ctx, ox, oy, 10, 14, 5, 2, '#ff0000');
    // Chaos sparks
    b(ctx, ox, oy, 0, 4, 3, 3, '#ffcc00');
    b(ctx, ox, oy, 21, 6, 3, 3, '#ffcc00');
  } else if (isTiny) {
    // TINY mode — barely visible, vanishing
    const off = 8;
    b(ctx, ox, oy, off + 2, off + 2, 8, 8, '#334466');
    b(ctx, ox, oy, off + 3, off + 3, 6, 6, '#4455aa');
    b(ctx, ox, oy, off + 4, off + 4, 2, 2, '#ffffff');
    b(ctx, ox, oy, off + 6, off + 4, 2, 2, '#ffffff');
    b(ctx, ox, oy, off + 4, off + 7, 4, 1, '#8888cc');
  } else {
    // Mid mode — oscillating
    const mid = Math.floor(Math.abs(cycle) * 6);
    b(ctx, ox, oy, 6, 4, 12, 16 + mid, '#ee5522');
    b(ctx, ox, oy, 7, 6, 10, 12 + mid, '#ff7744');
    b(ctx, ox, oy, 9, 9, 3, 3, '#111100');
    b(ctx, ox, oy, 13, 9, 3, 3, '#111100');
    b(ctx, ox, oy, 9, 14, 7, 2, '#111100');
  }
}

function drawAmyloidSoldier(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Rigid crystalline needle — silver-white, fibril structure
  // Main fibril body (vertical needle)
  b(ctx, ox, oy, 9, 0, 6, 24, '#c8c8d8');
  b(ctx, ox, oy, 10, 0, 4, 24, '#e8e8f0');
  b(ctx, ox, oy, 10, 0, 2, 24, '#f4f4ff');
  // Beta-sheet cross rungs
  for (let r = 2; r < 22; r += 4) {
    b(ctx, ox, oy, 6, r, 12, 1, '#b0b0c4');
    b(ctx, ox, oy, 6, r, 1, 1, '#d8d8ee');
    b(ctx, ox, oy, 17, r, 1, 1, '#d8d8ee');
  }
  // Face (menacing but minimal)
  b(ctx, ox, oy, 10, 6, 4, 1, '#442244');
  b(ctx, ox, oy, 10, 8, 4, 1, '#442244');
  // Tip — sharpened point
  b(ctx, ox, oy, 10, 22, 4, 2, '#c0c0d0');
  b(ctx, ox, oy, 11, 23, 2, 2, '#e0e0ec');
  b(ctx, ox, oy, 11, 24, 2, 1, '#f0f0fc');
  // Pulse crystal shimmer
  if (Math.floor(t * 5) % 3 === 0) {
    ctx.globalAlpha = 0.3;
    b(ctx, ox, oy, 8, 4, 8, 16, '#ffffff');
    ctx.globalAlpha = 1;
  }
}

function drawDisulfideBandit(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Thief silhouette with a chain weapon
  // Body
  b(ctx, ox, oy, 8, 4, 8, 6, '#1a1a1a');
  b(ctx, ox, oy, 6, 10, 12, 8, '#222222');
  b(ctx, ox, oy, 7, 18, 4, 6, '#1a1a1a');
  b(ctx, ox, oy, 13, 18, 4, 6, '#1a1a1a');
  // Mask / hood
  b(ctx, ox, oy, 7, 2, 10, 5, '#111111');
  b(ctx, ox, oy, 8, 0, 8, 3, '#0a0a0a');
  // Eyes (glowing evil)
  b(ctx, ox, oy, 9, 3, 2, 2, '#ff4400');
  b(ctx, ox, oy, 13, 3, 2, 2, '#ff4400');
  b(ctx, ox, oy, 9, 3, 1, 1, '#ffaa44');
  b(ctx, ox, oy, 13, 3, 1, 1, '#ffaa44');
  // Disulfide chain weapon (S-S bond chain swinging)
  const swingAngle = Math.sin(t * 0.18) * 6;
  const chainX = Math.round(18 + swingAngle);
  b(ctx, ox, oy, 18, 10, 2, 2, '#ffaa00');
  b(ctx, ox, oy, chainX - 1, 12, 4, 2, '#cc8800');
  b(ctx, ox, oy, chainX, 14, 3, 2, '#aa6600');
  b(ctx, ox, oy, chainX - 1, 16, 4, 2, '#cc8800');
  // S-S symbol on chain
  b(ctx, ox, oy, chainX, 17, 2, 1, '#ffdd44');
  b(ctx, ox, oy, chainX, 19, 2, 1, '#ffdd44');
}

function drawPhantomCrystal(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // Translucent crystal — small, spawns in groups
  const alpha = 0.45 + 0.25 * Math.sin(t * 0.12);
  ctx.globalAlpha = alpha;
  // Crystal hexagonal shape
  b(ctx, ox, oy, 7, 0, 6, 2, '#d0c0ff');
  b(ctx, ox, oy, 4, 2, 12, 4, '#c0a8ff');
  b(ctx, ox, oy, 3, 6, 14, 8, '#b090ee');
  b(ctx, ox, oy, 4, 14, 12, 4, '#c0a8ff');
  b(ctx, ox, oy, 7, 18, 6, 2, '#d0c0ff');
  // Facet highlights
  b(ctx, ox, oy, 7, 1, 2, 4, '#ffffff');
  b(ctx, ox, oy, 4, 3, 2, 4, '#e8dcff');
  // Inner void
  b(ctx, ox, oy, 7, 7, 6, 6, '#1a0030');
  b(ctx, ox, oy, 8, 8, 4, 4, '#2a0050');
  // Noise static (the crystallographic noise effect)
  if (Math.floor(t * 8) % 2 === 0) {
    b(ctx, ox, oy, 6 + Math.floor(t * 3) % 6, 6, 2, 1, '#ffffff');
    b(ctx, ox, oy, 9 + Math.floor(t * 5) % 4, 12, 1, 2, '#ccbbff');
  }
  ctx.globalAlpha = 1;
}

function drawPredictionGhost(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, _hp: number
) {
  // "I COULD be structured. I CHOOSE not to be."
  // Amorphous ghost that refuses to solidify
  const collapse = Math.sin(t * 0.06) * 0.5 + 0.5; // 0=collapsed, 1=spread
  const ghostAlpha = 0.3 + 0.3 * collapse;
  ctx.globalAlpha = ghostAlpha;
  // Body collapses and expands
  const spread = Math.round(collapse * 4);
  b(ctx, ox, oy, 8 - spread, 4, 8 + spread * 2, 16 - spread, '#aa88ff');
  b(ctx, ox, oy, 8 - spread + 1, 5, 6 + spread * 2, 12 - spread, '#cc99ff');
  // Wispy extensions
  b(ctx, ox, oy, 4, 8 + spread, 4, 6, '#8866dd');
  b(ctx, ox, oy, 16, 8, 4, 6 + spread, '#8866dd');
  b(ctx, ox, oy, 8, 18, 8, 4 + spread, '#7755cc');
  // Eyes — deliberately correct-looking but barely visible
  ctx.globalAlpha = ghostAlpha * 0.4;
  b(ctx, ox, oy, 9, 8, 2, 2, '#ffffff');
  b(ctx, ox, oy, 13, 8, 2, 2, '#ffffff');
  ctx.globalAlpha = 1;
  // Correct-answer hint (the whole point of this enemy)
  ctx.globalAlpha = 0.08;
  b(ctx, ox, oy, 4, 22, 16, 4, '#44ffcc');
  ctx.globalAlpha = 1;
}

function drawAmyloidTyrant(
  ctx: CanvasRenderingContext2D, ox: number, oy: number, t: number, hp: number
) {
  // MASSIVE crystalline titan — takes up larger area (48×48 game px)
  // Use larger coordinates
  const phase = hp > 50 ? 1 : hp > 25 ? 2 : 3;
  const coreCol = phase === 1 ? '#e8e8f8' : phase === 2 ? '#c0c0d8' : '#aa88cc';
  const darkCol = phase === 1 ? '#6060a0' : phase === 2 ? '#404080' : '#2a1060';
  const glowCol = phase === 1 ? '#aaaaff' : phase === 2 ? '#8888ff' : '#ff44ff';

  // Main crystalline body (large)
  b(ctx, ox, oy, 12, 2, 24, 6, darkCol);
  b(ctx, ox, oy, 8, 8, 32, 8, coreCol);
  b(ctx, ox, oy, 4, 16, 40, 18, coreCol);
  b(ctx, ox, oy, 8, 34, 32, 8, darkCol);
  b(ctx, ox, oy, 12, 42, 24, 4, darkCol);
  // Center highlight
  b(ctx, ox, oy, 10, 10, 28, 4, '#f0f0ff');
  // Eyes — large, rectangular
  b(ctx, ox, oy, 14, 20, 6, 4, '#000011');
  b(ctx, ox, oy, 28, 20, 6, 4, '#000011');
  b(ctx, ox, oy, 15, 21, 4, 2, '#8800ff');
  b(ctx, ox, oy, 29, 21, 4, 2, '#8800ff');
  b(ctx, ox, oy, 16, 21, 2, 2, glowCol);
  b(ctx, ox, oy, 30, 21, 2, 2, glowCol);
  // Mouth — wide, teeth of crystal
  b(ctx, ox, oy, 12, 28, 24, 4, '#000011');
  for (let i = 0; i < 6; i++) {
    b(ctx, ox, oy, 13 + i * 4, 28, 3, 4, '#e8e8f8');
    if (i < 5) b(ctx, ox, oy, 15 + i * 4, 30, 2, 2, darkCol);
  }
  // Fibril extensions from sides
  const pulse = Math.floor(t * 4) % 3;
  b(ctx, ox, oy, 0, 16 + pulse, 4, 2, coreCol);
  b(ctx, ox, oy, 44, 18 - pulse, 4, 2, coreCol);
  b(ctx, ox, oy, 2, 26, 4, 2, coreCol);
  b(ctx, ox, oy, 42, 24, 4, 2, coreCol);
  // Phase 3 cascade glow
  if (phase === 3) {
    ctx.globalAlpha = 0.2 + 0.15 * Math.sin(t * 0.3);
    b(ctx, ox, oy, 0, 0, 48, 48, '#ff44ff');
    ctx.globalAlpha = 1;
  }
}

// ─── Enemy Definitions ────────────────────────────────────────────────────────

export const ENEMIES: EnemyDef[] = [
  // ─── Realm 1: The Cytoplasm ──────────────────────────────────────────────────
  {
    id: 'corrupted-atp',
    name: 'Corrupted ATP Synthase',
    realm: 1,
    hp: 40,
    damage: 12,
    battleCry: 'SPIN. SPIN. SPIN.',
    weakness: 'Restore chemiosmosis direction.',
    enzymeComment: "It's going the wrong way. That's it. That's the whole problem.",
    draw: drawCorruptedATP,
  },
  {
    id: 'rogue-mrna',
    name: 'Rogue mRNA Strand',
    realm: 1,
    hp: 30,
    damage: 8,
    battleCry: 'AUGCAG... wait... CAGAUG... UGACAG...',
    weakness: 'Apply splicing correction.',
    enzymeComment: "It's just saying random things. I relate.",
    draw: drawRogueMRNA,
  },
  {
    id: 'lysosome-scout',
    name: 'Lysosome Scout',
    realm: 1,
    hp: 50,
    damage: 15,
    battleCry: 'DIGEST EVERYTHING. IT IS WHAT WE DO.',
    weakness: 'Drop pH to 4.5.',
    enzymeComment: "It wants to eat you. I also sometimes want to eat you. But this is different.",
    draw: drawLysosomeScout,
  },
  {
    id: 'unfolded-protein',
    name: 'Unfolded Protein Blob',
    realm: 1,
    hp: 25,
    damage: 6,
    battleCry: 'I... am... trying.',
    weakness: 'Deploy chaperone.',
    enzymeComment: "We're not going to fight this one very hard. Look at it.",
    draw: drawUnfoldedProtein,
  },
  {
    id: 'nuclease-specter',
    name: 'Nuclease Specter',
    realm: 1,
    hp: 35,
    damage: 20,
    battleCry: '...snip.',
    weakness: 'Inhibit nuclease activity.',
    enzymeComment: "It cut the question text. THE QUESTION TEXT. How.",
    draw: drawNucleaseSpecter,
  },

  // ─── Realm 2: The Genome Forest ──────────────────────────────────────────────
  {
    id: 'corrupted-read',
    name: 'Corrupted Read',
    realm: 2,
    hp: 30,
    damage: 10,
    battleCry: 'ERROR: QUALITY TOO LOW. PROCEEDING ANYWAY.',
    weakness: 'Apply Q20 quality filter.',
    enzymeComment: "This read is garbage. Literally. Bioinformatics garbage.",
    draw: drawCorruptedRead,
  },
  {
    id: 'duplicate-chromosome',
    name: 'Duplicate Chromosome',
    realm: 2,
    hp: 60,
    damage: 8,
    battleCry: 'I was here first! / No, I was!',
    weakness: 'Normalize read depth.',
    enzymeComment: "I can't tell which one is lying and that is BY DESIGN.",
    draw: drawDuplicateChromosome,
  },
  {
    id: 'misannotated-gene',
    name: 'Misannotated Gene',
    realm: 2,
    hp: 20,
    damage: 5,
    battleCry: 'I AM HYPOTHETICAL. I HAVE ALWAYS BEEN HYPOTHETICAL. I WAS ANNOTATED IN 1998.',
    weakness: 'Re-annotate with updated reference.',
    enzymeComment: "This gene has an existential crisis. It was annotated wrong in 1998 and nobody fixed it. Nobody.",
    draw: drawMisannotatedGene,
  },
  {
    id: 'tandem-repeat',
    name: 'Tandem Repeat Monster',
    realm: 2,
    hp: 40,
    damage: 10,
    battleCry: 'CAGCAGCAGCAGCAG—',
    weakness: 'Break repeat unit.',
    enzymeComment: "PLEASE do not get this one wrong. Please.",
    hpGrowsOnMiss: true,
    draw: drawTandemRepeat,
  },

  // ─── Realm 3: The Neural Nebula ──────────────────────────────────────────────
  {
    id: 'overfitted-minion',
    name: 'Overfitted Minion',
    realm: 3,
    hp: 45,
    damage: 12,
    battleCry: 'THE ANSWER IS 7.',
    weakness: 'Ask an out-of-distribution question.',
    enzymeComment: "Its training accuracy is perfect. Ask it something new.",
    draw: drawOverfittedMinion,
  },
  {
    id: 'vanishing-gradient',
    name: 'Vanishing Gradient',
    realm: 3,
    hp: 20,
    damage: 4,
    battleCry: '...help.',
    weakness: 'Apply ReLU + batch normalization.',
    enzymeComment: "...I don't think it's okay.",
    draw: drawVanishingGradient,
  },
  {
    id: 'nan-entity',
    name: 'NaN Entity',
    realm: 3,
    hp: 5,
    damage: 999,  // sets score to NaN — handled specially
    battleCry: 'NaN.',
    weakness: 'Use Gradient Clip weapon.',
    enzymeComment: "Alex has a PERSONAL HISTORY with this one. Do not ask.",
    draw: drawNaNEntity,
  },
  {
    id: 'attention-hydra',
    name: 'Attention Head Hydra',
    realm: 3,
    hp: 240,    // 30 per head × 8 heads
    damage: 10,
    battleCry: 'MORE HEADS. MORE CONTEXT. MORE HEADS.',
    weakness: 'Prune attention heads.',
    enzymeComment: "Started with 8 heads. We are NOT going to let it get to 47.",
    draw: drawAttentionHydra,
  },
  {
    id: 'learning-rate-demon',
    name: 'Learning Rate Demon',
    realm: 3,
    hp: 55,
    damage: 20,  // oscillates 0-40 in practice
    battleCry: 'TOO FAST — wait — TOO SLOW — NO FASTER —',
    weakness: 'Set learning rate schedule.',
    enzymeComment: "This one genuinely cannot make up its mind.",
    draw: drawLearningRateDemon,
  },

  // ─── Realm 4: The Protein Cathedral ─────────────────────────────────────────
  {
    id: 'amyloid-soldier',
    name: 'Amyloid Fibril Soldier',
    realm: 4,
    hp: 40,
    damage: 14,
    battleCry: 'Join us.',
    weakness: 'Disrupt beta-sheet stacking.',
    enzymeComment: "Do not get this wrong. It calls its friends.",
    draw: drawAmyloidSoldier,
  },
  {
    id: 'disulfide-bandit',
    name: 'Disulfide Bond Bandit',
    realm: 4,
    hp: 35,
    damage: 10,
    battleCry: 'BONDED.',
    weakness: 'Reduce disulfide bond.',
    enzymeComment: "It tied the answers together. That's honestly impressive. Still wrong.",
    draw: drawDisulfideBandit,
  },
  {
    id: 'phantom-crystal',
    name: 'Phantom Crystal',
    realm: 4,
    hp: 10,
    damage: 8,
    battleCry: 'crackle... [static]...',
    weakness: 'Clear crystallographic noise.',
    enzymeComment: "These are small. There are many. Both things matter.",
    spawnsInGroups: true,
    groupSize: 4,
    draw: drawPhantomCrystal,
  },
  {
    id: 'prediction-ghost',
    name: 'Prediction Ghost',
    realm: 4,
    hp: 30,
    damage: 15,
    battleCry: 'I COULD be structured. I CHOOSE not to be.',
    weakness: 'Force structure determination.',
    enzymeComment: "The correct answer is RIGHT THERE. It's just... shy.",
    draw: drawPredictionGhost,
  },
  {
    id: 'amyloid-tyrant',
    name: 'Amyloid Tyrant',
    realm: 4,
    hp: 200,
    damage: 35,
    battleCry: 'Every protein shall misfold.',
    weakness: 'Total aggregation disruption across 3 phases.',
    enzymeComment: "This is the pre-boss. I say 'pre' to make you feel better.",
    draw: drawAmyloidTyrant,
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getEnemy(id: EnemyId): EnemyDef | undefined {
  return ENEMIES.find((e) => e.id === id);
}

export function getRealmEnemies(realm: 1 | 2 | 3 | 4): EnemyDef[] {
  return ENEMIES.filter((e) => e.realm === realm);
}

// ─── EnemyEncounterCanvas Component ──────────────────────────────────────────

interface EnemyEncounterProps {
  enemyId: EnemyId;
  onVictory: () => void;
  onFlee: () => void;
}

function drawHPBar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  width: number, height: number,
  current: number, max: number,
  color: string,
  label: string,
) {
  const pct = Math.max(0, current / max);
  ctx.fillStyle = '#111111';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = pct > 0.5 ? color : pct > 0.25 ? '#ffaa00' : '#ff2244';
  ctx.fillRect(x + 1, y + 1, Math.floor((width - 2) * pct), height - 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${height - 2}px monospace`;
  ctx.fillText(`${label} ${current}/${max}`, x + 4, y + height - 2);
}

export default function EnemyEncounterCanvas({
  enemyId,
  onVictory,
  onFlee,
}: EnemyEncounterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const rafRef    = useRef<number>(0);

  const enemy = ENEMIES.find((e) => e.id === enemyId);
  const [enemyHP, setEnemyHP] = useState(enemy?.hp ?? 100);
  const [playerHP, setPlayerHP] = useState(5);
  const [phase, setPhase] = useState<'encounter' | 'victory' | 'fled'>('encounter');

  const maxEnemyHP = enemy?.hp ?? 100;

  const handleAttack = useCallback(() => {
    if (!enemy || phase !== 'encounter') return;
    const dmg = Math.floor(Math.random() * 15) + 10;
    setEnemyHP((prev) => {
      const next = Math.max(0, prev - dmg);
      if (next === 0) setPhase('victory');
      return next;
    });
  }, [enemy, phase]);

  const handleFlee = useCallback(() => {
    if (phase !== 'encounter') return;
    setPhase('fled');
    onFlee();
  }, [phase, onFlee]);

  useEffect(() => {
    if (phase === 'victory') {
      const t = setTimeout(() => onVictory(), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, onVictory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enemy) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;

    function render() {
      frameRef.current++;
      const t = frameRef.current;
      if (!ctx) return;

      // Background
      const bgColor = enemy!.realm === 1 ? '#0a0414' : enemy!.realm === 2 ? '#040f06'
        : enemy!.realm === 3 ? '#07040f' : '#060810';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // Realm accent vignette
      const accentColors = ['#00ffcc', '#52b788', '#aa44ff', '#ffaa00'];
      const accent = accentColors[enemy!.realm - 1];
      ctx.strokeStyle = accent + '44';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, W - 8, H - 8);

      // Enemy sprite (right side, centered vertically)
      const isLarge = enemyId === 'amyloid-tyrant';
      const spriteW = isLarge ? 48 : 24;
      const spriteH = isLarge ? 48 : 24;
      const ex = Math.floor(W * 0.65) - (spriteW * SCALE) / 2;
      const ey = Math.floor(H * 0.35) - (spriteH * SCALE) / 2;
      const hpPct = enemyHP / maxEnemyHP;

      // Damage flicker on low HP
      if (hpPct < 0.33 && t % 8 < 2) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(ex - 4, ey - 4, spriteW * SCALE + 8, spriteH * SCALE + 8);
        ctx.globalAlpha = 1;
      }

      enemy!.draw(ctx, ex, ey, t, hpPct * 100);

      // Enemy name + HP bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(enemy!.name, Math.floor(W * 0.45), 30);
      drawHPBar(ctx, Math.floor(W * 0.45), 36, Math.floor(W * 0.5), 18, enemyHP, maxEnemyHP, '#ee4444', 'HP');

      // Battle cry (scrolling at bottom of enemy area)
      const cryText = enemy!.battleCry;
      ctx.font = '11px monospace';
      ctx.fillStyle = accent + 'cc';
      const cryX = ((t * 1.5) % (cryText.length * 8 + W * 0.4));
      ctx.fillText(cryText, Math.floor(W * 0.45 + W * 0.5 - cryX), 62);

      // Player HP bar (left side)
      drawHPBar(ctx, 20, H - 80, 200, 20, playerHP, 5, '#44cc44', '♥');

      // Enzyme comment (speech bubble, lower left)
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(12, H - 130, Math.floor(W * 0.4), 44);
      ctx.strokeStyle = '#00bbaa';
      ctx.lineWidth = 2;
      ctx.strokeRect(12, H - 130, Math.floor(W * 0.4), 44);
      ctx.fillStyle = '#00bbaa';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('ENZYME:', 18, H - 116);
      ctx.fillStyle = '#ccffee';
      ctx.font = '9px monospace';
      // Word wrap the comment
      const words = enemy!.enzymeComment.split(' ');
      let line = '', lineY = H - 105;
      for (const word of words) {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > W * 0.38 && line !== '') {
          ctx.fillText(line, 18, lineY);
          line = word + ' ';
          lineY += 12;
        } else {
          line = testLine;
        }
      }
      if (line) ctx.fillText(line, 18, lineY);

      // Weakness hint (bottom right)
      ctx.fillStyle = '#777799';
      ctx.font = '9px monospace';
      ctx.fillText(`Weakness: ${enemy!.weakness}`, Math.floor(W * 0.45), H - 30);

      // Victory overlay
      if (phase === 'victory') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = accent;
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY', W / 2, H / 2 - 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText(enemy!.enzymeComment, W / 2, H / 2 + 20);
        ctx.textAlign = 'left';
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enemy, enemyHP, playerHP, maxEnemyHP, phase, enemyId]);

  if (!enemy) return null;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={720}
        height={480}
        style={{ imageRendering: 'pixelated', display: 'block' }}
      />
      {phase === 'encounter' && (
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          display: 'flex', gap: 8,
        }}>
          <button
            onClick={handleAttack}
            style={{
              padding: '8px 20px', background: '#cc2244', color: '#fff',
              border: '2px solid #ff4466', fontFamily: 'monospace', fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ⚔ FIGHT
          </button>
          <button
            onClick={handleFlee}
            style={{
              padding: '8px 20px', background: '#224466', color: '#aaccff',
              border: '2px solid #4488aa', fontFamily: 'monospace', fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ↩ FLEE
          </button>
        </div>
      )}
    </div>
  );
}
