'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { BOSS_QUESTIONS } from '@/lib/bossQuestions';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BossBattleProps {
  realm: 1 | 2 | 3 | 4;
  onVictory: () => void;
  onDefeat: () => void;
}

const SCALE = 3;
const CW = 720;
const CH = 540;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  life: number; // 0→1
}

interface BossState {
  phase: 'intro' | 'question' | 'correct' | 'wrong' | 'victory' | 'defeat';
  bossHP: number;
  playerHP: number;
  questionIdx: number;
  introLineIdx: number;
  shakeX: number;
  shakeTimer: number;
  flashTimer: number;
  flashType: 'hit' | 'damage' | null;
  particles: Particle[];
  t: number;
  projectileX: number;
  projectileY: number;
  projectileActive: boolean;
  optionSelected: number | null;
  resultTimer: number;   // timestamp when result phase ends
  victoryTimer: number;  // timestamp when victory started
  defeatTimer: number;
  lastFrameTime: number;
  bossPhase: 1 | 2 | 3;   // HP phase: 1=full, 2=<66%, 3=<33%
  phaseTaunt: string | null;
  phaseTauntTimer: number; // timestamp when taunt expires
}

// ─── Dialogue data ────────────────────────────────────────────────────────────

const BOSS_INTROS: Record<1 | 2 | 3 | 4, string[]> = {
  1: [
    'I AM LYSO.',
    'I am 50 enzymes in one body.',
    'I dissolve what the cell cannot use.',
    'Old organelles. Damaged proteins. Pathogens.',
    '(Its many eyes open — each one a different hydrolase.)',
    'You have been categorized.',
    'pH 4.5. That is my domain. That is where you stand.',
    '★ BATTLE START ★',
  ],
  2: [
    'Do you know what a retrovirus does?',
    'It reads your RNA and writes itself into your DNA.',
    'Permanently.',
    'I am VIRON.',
    'I have already written myself into 47% of this forest.',
    '(It smiles. Retroviruses don\'t have mouths, but it smiles.)',
    '8% of human DNA is ancient viral code. We\'ve always been here.',
    '★ BATTLE START ★',
  ],
  3: [
    'PROBABILITY OF INTRUDER: 0.00%.',
    '(It stares at you. You are clearly there.)',
    'RECALIBRATING.',
    'PROBABILITY OF INTRUDER: 0.00%.',
    'YOU ARE NOT IN MY TRAINING DATA.',
    'I AM OVERFIT. I HAVE MEMORIZED EVERYTHING.',
    'My loss is 0. My training accuracy is 100%. I am perfect.',
    '★ BATTLE START ★',
  ],
  4: [
    '...',
    '(The Cathedral shudders.)',
    'I was here before Henry. Before the altar.',
    'I was a student. Like you.',
    'I folded wrong. Just once.',
    'But the fold was so clean. So stable.',
    'Other proteins noticed.',
    'I am still showing them.',
    '★ BATTLE START ★',
  ],
};

const BOSS_NAMES: Record<1 | 2 | 3 | 4, string> = {
  1: 'LYSO', 2: 'VIRON', 3: 'OVERFIT', 4: 'AMYLOID',
};

const BOSS_BG: Record<1 | 2 | 3 | 4, string> = {
  1: '#0a0414', 2: '#040f06', 3: '#07040f', 4: '#060810',
};

// Phase taunts: index 0 = phase 2 taunt, index 1 = phase 3 taunt
const BOSS_PHASE_TAUNTS: Record<1 | 2 | 3 | 4, [string, string]> = {
  1: [
    'My hunger... INTENSIFIES!',
    'You cannot escape DIGESTION!',
  ],
  2: [
    'MUTATION DETECTED. ADAPTING.',
    'REPLICATION ACCELERATING. YOU CANNOT STOP THIS.',
  ],
  3: [
    '...wait. My training accuracy was 100%. Why am I losing?',
    'THE DISTRIBUTION HAS SHIFTED. I DON\'T KNOW WHAT TO DO.',
  ],
  4: [
    'Join... us... Every protein will misfold eventually.',
    'AGGREGATION... CASCADE... INEVITABLE.',
  ],
};

// ─── Boss sprite drawing — 32×32 game pixel system ───────────────────────────
// All bosses use game-pixel coordinates (0-31 in x, 0-31 in y).
// ox/oy = top-left corner of the 32×32 bounding box.
// b(dx,dy,w,h,c) fills a rect at game-pixel offset from ox,oy.

function drawLyso(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const ox = cx + sx - 16 * SCALE;
  const oy = cy - 16 * SCALE;
  const b = (dx: number, dy: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox + dx * SCALE, oy + dy * SCALE, w * SCALE, h * SCALE);
  };

  const p = hp > 66 ? 1 : hp > 33 ? 2 : 3;

  // Per spec: Phase 1 = green acid, Phase 2 = orange damage, Phase 3 = red rage
  // 5-step value ramps per COLOR_THEORY.md
  const main  = p === 1 ? '#2a7a44' : p === 2 ? '#cc5500' : '#cc1100';
  const hi    = p === 1 ? '#44cc66' : p === 2 ? '#ff8833' : '#ff3322';
  const hiTop = p === 1 ? '#66ee88' : p === 2 ? '#ffaa55' : '#ff6644';
  const drk   = p === 1 ? '#1a4a28' : p === 2 ? '#882200' : '#880000';
  const outln = p === 1 ? '#0a2214' : p === 2 ? '#441100' : '#440000';

  // Phase 3 rage pulse
  const ragePulse = p === 3 && Math.floor(t * 6) % 4 < 2;
  const mainFinal = ragePulse ? '#ff0000' : main;

  // ── Outer silhouette outline (1px darker border, all exposed edges) ──
  b(9, -1, 14, 1, outln); // top outline
  b(3, 7, 1, 16, outln);  // left outline
  b(28, 7, 1, 16, outln); // right outline
  b(9, 28, 14, 1, outln); // bottom outline
  b(5, 1, 2, 1, outln); b(7, 0, 2, 1, outln); b(21, 0, 2, 1, outln); b(23, 1, 2, 1, outln);
  b(4, 5, 1, 3, outln); b(27, 5, 1, 3, outln);

  // Blob body — layered for roundness (top-left light source)
  b(9, 0, 14, 2, mainFinal);
  b(6, 2, 20, 3, mainFinal);
  b(4, 5, 24, 3, hiTop);    // top highlight band (lit from above-left)
  b(3, 8, 26, 14, mainFinal);
  b(3, 8, 5, 8, hi);        // left highlight (lit from left)
  b(3, 8, 2, 8, hiTop);     // left bright edge
  b(4, 22, 24, 3, drk);
  b(6, 25, 20, 2, drk);
  b(9, 27, 14, 1, drk);

  // Primary eyes (2 — always present)
  b(5, 10, 6, 6, '#220600');
  b(21, 10, 6, 6, '#220600');
  b(6, 11, 4, 4, '#cc2200');
  b(22, 11, 4, 4, '#cc2200');
  b(7, 12, 2, 2, '#ff4444');
  b(23, 12, 2, 2, '#ff4444');
  b(7, 12, 1, 1, '#ffffff');
  b(23, 12, 1, 1, '#ffffff');

  // Phase 2+: eyes MULTIPLY (4 extra smaller eyes per canon)
  if (p >= 2) {
    // Upper left and upper right tiny eyes
    b(12, 5, 3, 3, '#1a0400');
    b(17, 5, 3, 3, '#1a0400');
    b(12, 6, 2, 2, '#ff2200');
    b(17, 6, 2, 2, '#ff2200');
    b(12, 6, 1, 1, '#ffaaaa');
    b(17, 6, 1, 1, '#ffaaaa');
    // Lower pair
    b(9, 20, 3, 3, '#1a0400');
    b(20, 20, 3, 3, '#1a0400');
    b(9, 21, 2, 2, '#ff2200');
    b(20, 21, 2, 2, '#ff2200');
  }

  // Mouth — wider/more jagged in higher phases
  const mouthW = p === 1 ? 16 : p === 2 ? 18 : 20;
  const mouthX = Math.floor(16 - mouthW / 2);
  b(mouthX, 18, mouthW, 4, '#0a0200');
  b(mouthX + 1, 18, mouthW - 2, 1, outln);
  // Jagged teeth (more teeth in phase 2+)
  const toothCount = p === 1 ? 5 : p === 2 ? 6 : 7;
  for (let tc = 0; tc < toothCount; tc++) {
    b(mouthX + 1 + tc * Math.floor((mouthW - 2) / toothCount), 18, 2, 3, '#d8c898');
  }

  // Acid drips — glow bright green-yellow per bioluminescence spec
  const dr = Math.floor(t * 3) % 3;
  const acidCol = p === 1 ? '#44ff00' : p === 2 ? '#ffcc00' : '#ff4400';
  const acidGlow = p === 1 ? '#00ff6622' : p === 2 ? '#ff660022' : '#ff000022';
  b(5, 27, 2, 3 + dr, acidCol);
  b(12, 28, 2, 2 + dr, acidCol);
  b(18, 28, 2, 2 + dr, acidCol);
  b(25, 27, 2, 3 + dr, acidCol);
  // Glow halo on drips
  ctx.globalAlpha = 0.35;
  b(4, 26, 4, 5 + dr, acidGlow);
  b(11, 27, 4, 4 + dr, acidGlow);
  ctx.globalAlpha = 1;

  // Phase 3: Body DISSOLVING — chunks falling off, holes in silhouette
  if (p === 3) {
    const dissolveFrame = Math.floor(t * 4) % 4;
    // Holes in body (dissolving patches)
    b(5, 12, 2, 3, drk);
    b(24, 15, 2, 3, drk);
    b(14, 22, 3, 2, drk);
    // Falling chunks
    b(3, 28 + dissolveFrame, 3, 2, mainFinal);
    b(26, 29 + (dissolveFrame + 1) % 4, 2, 2, mainFinal);
    b(14, 30 + dissolveFrame % 2, 2, 1, drk);
    // Rage glow halo
    ctx.globalAlpha = 0.2;
    b(-2, -2, 36, 36, '#ff000000'); // cleared by globalAlpha
    ctx.globalAlpha = ragePulse ? 0.35 : 0.15;
    b(-1, -1, 34, 34, '#ff0000');
    ctx.globalAlpha = 1;
  }
}

function drawViron(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const ox = cx + sx - 16 * SCALE;
  const oy = cy - 16 * SCALE;
  const b = (dx: number, dy: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox + dx * SCALE, oy + dy * SCALE, w * SCALE, h * SCALE);
  };

  const p = hp > 66 ? 1 : hp > 33 ? 2 : 3;
  const pulseDark = p === 3 && Math.floor(t * 8) % 4 < 2;

  // 5-step value ramp: Forest green icosahedron (Genome Forest realm)
  const mainC  = pulseDark ? '#0a2215' : (p === 1 ? '#52b788' : p === 2 ? '#2d7a5a' : '#1a4a35');
  const hiC    = p === 1 ? '#70d0a0' : p === 2 ? '#44aa77' : '#226644';
  const altC   = pulseDark ? '#071a0d' : (p === 1 ? '#3d9b6a' : p === 2 ? '#1a5c40' : '#0d3020');
  const outln  = p === 1 ? '#0a2215' : p === 2 ? '#071808' : '#030e04';
  const spikeC = p === 1 ? '#66ddaa' : p === 2 ? '#ff8800' : '#cc2200';
  const spikeTip = p === 1 ? '#aaffd4' : p === 2 ? '#ffcc44' : '#ff4422';

  // ── Outer silhouette outline ──
  b(10, 0, 12, 1, outln);
  b(6, 2, 2, 1, outln); b(24, 2, 2, 1, outln);
  b(3, 5, 1, 16, outln); b(28, 5, 1, 16, outln);
  b(6, 25, 2, 1, outln); b(24, 25, 2, 1, outln);
  b(10, 27, 12, 1, outln);

  // Hexagonal body — icosahedral shape with 6 visible facets
  b(10, 1, 12, 2, mainC);
  b(6, 3, 20, 3, mainC);
  b(4, 6, 24, 3, hiC);       // top facet highlight (lit from top-left)
  b(4, 9, 4, 10, hiC);       // left facet highlight
  b(4, 9, 24, 10, mainC);    // core facets
  b(20, 9, 8, 8, altC);      // right shadow facet
  b(4, 19, 24, 3, altC);     // lower band
  b(6, 22, 20, 3, mainC);
  b(10, 25, 12, 2, mainC);

  // Hexagonal segment lines (icosahedral face edges)
  b(16, 3, 1, 22, altC);     // vertical center seam
  b(4, 13, 24, 1, altC);     // horizontal center seam

  // RNA strands inside (animated wave — more prominent in phase 3)
  const rnaAlpha = p === 3 ? 1.0 : 0.85;
  ctx.globalAlpha = rnaAlpha;
  for (let j = 0; j < 8; j++) {
    const rx = 6 + j * 3;
    const ry = 10 + Math.round(Math.sin(t * 3 + j * 0.9) * 3);
    const rnaC = j % 2 === 0 ? '#ff9900' : '#ff5500';
    b(rx, ry, 1, 4, rnaC);
    if (p === 3) b(rx, ry + 4, 1, 2, '#ff2200'); // RNA strands GLOW in phase 3
  }
  ctx.globalAlpha = 1;

  // Phase 3: glowing exposed RNA core (body becomes translucent-like)
  if (p === 3) {
    ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t * 4);
    b(6, 8, 20, 12, '#ff6600');
    ctx.globalAlpha = 1;
  }

  // Spike proteins (8 directional) — each is a pointed 2-segment spike
  type SpikeData = [number, number, number, number, number, number, number, number];
  const spikes: SpikeData[] = [
    [14, -1, 4, 2,  14, -3, 2, 1],  // top: base + tip
    [25, 2,  3, 2,  27, 1,  2, 1],  // top-right
    [28, 11, 3, 2,  31, 11, 2, 2],  // right
    [26, 22, 3, 2,  28, 23, 2, 1],  // bottom-right
    [14, 27, 4, 2,  14, 29, 2, 1],  // bottom
    [3,  22, 3, 2,  1,  23, 2, 1],  // bottom-left
    [1,  11, 3, 2,  -2, 11, 2, 2],  // left
    [4,  2,  3, 2,  3,  1,  2, 1],  // top-left
  ];
  spikes.forEach(([dx, dy, w, h, tx, ty, tw, th]) => {
    b(dx, dy, w, h, spikeC);
    b(tx, ty, tw, th, spikeTip); // pointed tip is lighter
  });

  // Phase 2: spikes extended — looks like proteins bursting outward
  if (p >= 2) {
    const extC = p === 2 ? '#ffaa4488' : '#ff220088';
    void extC; // extended spike glow rendered below
    spikes.forEach(([dx, dy, w, h]) => {
      ctx.globalAlpha = 0.4;
      b(dx - 1, dy - 1, w + 2, h + 2, p === 2 ? '#ffaa44' : '#ff4422');
      ctx.globalAlpha = 1;
    });
  }

  // Eyes — change color: red→yellow→white (phases 1→2→3)
  const eyeC   = p === 1 ? '#cc2200' : p === 2 ? '#ccaa00' : '#ffffff';
  const eyeHi  = p === 1 ? '#ff4422' : p === 2 ? '#ffee44' : '#aaffee';
  b(8,  12, 5, 5, outln); b(19, 12, 5, 5, outln);
  b(9,  13, 3, 3, eyeC);  b(20, 13, 3, 3, eyeC);
  b(9,  13, 1, 1, eyeHi); b(20, 13, 1, 1, eyeHi);
}

function drawOverfit(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const ox = cx + sx - 16 * SCALE;
  const oy = cy - 16 * SCALE;
  const b = (dx: number, dy: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox + dx * SCALE, oy + dy * SCALE, w * SCALE, h * SCALE);
  };

  const p = hp > 66 ? 1 : hp > 33 ? 2 : 3;

  // 5-step value ramp: Neural purple (Realm 3 accent: #aa44ff)
  const BRIGHT  = '#cc77ff';
  const MID     = '#8833cc';
  const MID2    = '#6622aa';
  const SHADOW  = '#3a1060';
  const DEEP    = '#1a0830';
  const GLITCH: string[] = [BRIGHT, '#ff00ff', '#00ccff', SHADOW, DEEP];
  const OUTLN   = '#0e0520';

  // 5×5 cell data-matrix body (each cell=5gp, 1gp gap = step=6)
  const COLS = 5, ROWS = 5, CELL = 5, STEP = 6;
  const bx = 1, by = 1;

  // Phase 3: cells collapse/fragment downward
  const gravityOffset = (idx: number): number => {
    if (p < 3) return 0;
    const fallSpeed = Math.sin(t * 2 + idx * 0.4) * 3;
    return Math.max(0, Math.floor(fallSpeed));
  };

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      const fallY = gravityOffset(idx);

      // Phase 3: some cells go missing (collapse)
      if (p === 3 && Math.floor(t * 3 + idx * 0.7) % 5 === 0) continue;

      const dx = bx + col * STEP;
      const dy = by + row * STEP + fallY;

      let c: string;
      if (p === 1) {
        // Phase 1: neural net — lit cells show "100% accurate" pride
        c = idx % 4 === 0 ? BRIGHT : (idx % 3 === 0 ? MID : MID2);
      } else if (p === 2) {
        // Phase 2: degrading — cells start losing signal
        c = (row + col) % 2 === 0 ? SHADOW : MID;
      } else {
        // Phase 3: pure chaos collapse
        c = GLITCH[Math.floor(t * 14 + idx * 1.3) % GLITCH.length];
      }

      // Face feature overrides — eyes and grin
      if (row === 1 && (col === 1 || col === 3)) {
        c = p === 3 ? '#ff00ff' : BRIGHT;
      }
      if (row === 3 && col >= 1 && col <= 3) {
        c = p === 3 && Math.floor(t * 8) % 2 === 0 ? '#ffffff' : BRIGHT;
      }

      b(dx, dy, CELL, CELL, c);

      // Phase 1: top-left lighting — top/left edge of each cell is brighter
      if (p === 1) {
        b(dx, dy, CELL, 1, BRIGHT);       // top edge lit
        b(dx, dy, 1, CELL, BRIGHT);       // left edge lit
        b(dx + CELL - 1, dy + 1, 1, CELL - 1, SHADOW); // right edge shadow
        b(dx + 1, dy + CELL - 1, CELL - 2, 1, SHADOW); // bottom edge shadow
      }
    }
  }

  // Outer silhouette outline
  b(0, 0, COLS * STEP + 2, 1, OUTLN);
  b(0, 0, 1, ROWS * STEP + 2, OUTLN);
  b(COLS * STEP + 1, 0, 1, ROWS * STEP + 2, OUTLN);
  b(0, ROWS * STEP + 1, COLS * STEP + 2, 1, OUTLN);

  // "100%" badge above body (phase 1 — the arrogance)
  if (p === 1) {
    b(5, -5, 22, 4, DEEP);
    b(6, -4, 20, 2, MID2);
    // Bars implying "100% ACC"
    for (let bi = 0; bi < 5; bi++) {
      b(7 + bi * 4, -4, 3, 2, BRIGHT);
    }
  }

  // Data arm bars (extend from sides)
  const armW = p === 3 ? 8 : (p === 2 ? 6 : 5);
  b(bx - armW, by + 12, armW, CELL, p === 3 ? SHADOW : MID);
  b(bx + COLS * STEP, by + 12, armW, CELL, p === 3 ? SHADOW : MID);
  // Phase 2+: claws
  if (p >= 2) {
    b(bx - armW - 3, by + 11, 3, 3, BRIGHT);
    b(bx + COLS * STEP + armW, by + 11, 3, 3, BRIGHT);
    b(bx - armW - 3, by + 15, 3, 2, MID);
    b(bx + COLS * STEP + armW, by + 15, 3, 2, MID);
  }

  // Phase 3: floating data fragments — cells breaking off and drifting upward
  if (p === 3) {
    for (let i = 0; i < 6; i++) {
      const fragX = bx + Math.round(Math.sin(t * 1.5 + i) * 12) + 10;
      const fragY = -4 - Math.floor((t * 3 + i * 2) % 8);
      b(fragX, fragY, 3, 3, GLITCH[i % GLITCH.length]);
    }
    // Phase 3 collapse glow
    ctx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 5);
    b(-2, -2, COLS * STEP + 6, ROWS * STEP + 6, '#ff00ff');
    ctx.globalAlpha = 1;
  }
}

function drawAmyloid(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const ox = cx + sx - 16 * SCALE;
  const oy = cy - 16 * SCALE;
  const b = (dx: number, dy: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox + dx * SCALE, oy + dy * SCALE, w * SCALE, h * SCALE);
  };

  const p = hp > 66 ? 1 : hp > 33 ? 2 : 3;
  const extraW = p >= 2 ? 4 : 0; // body grows wider in phase 2+

  // 5-step value ramp: Crystalline silver→amber (Protein Cathedral realm: #ffaa00)
  // Phase 1: silver-white fibril, Phase 2: amber-tinged, Phase 3: purple-magenta rage
  const layerColors: [string, string, string][] = p === 1
    ? [['#ddd8cc', '#a8a090', '#8a8070'], ['#cec8ba', '#988870', '#786858'],
       ['#beb8a8', '#888060', '#685848'], ['#aeaa98', '#787050', '#585040'],
       ['#9ea090', '#686848', '#484838'], ['#929088', '#585840', '#383830']]
    : p === 2
    ? [['#d4b878', '#a08040', '#786020'], ['#c4a860', '#907030', '#605018'],
       ['#b49850', '#806018', '#504010'], ['#a48840', '#705010', '#403808'],
       ['#948070', '#604820', '#382808'], ['#887868', '#503820', '#281806']]
    : [['#ccaaee', '#9944cc', '#660088'], ['#bb99dd', '#8833bb', '#550077'],
       ['#aa88cc', '#7722aa', '#440066'], ['#9977bb', '#661199', '#330055'],
       ['#886699', '#551188', '#220044'], ['#775588', '#440077', '#110033']];

  // Stacked fibril layers — 6 rows of crystalline beta-sheet
  layerColors.forEach(([main, stripe, dark], i) => {
    const lw = 20 + extraW * 2;
    const lx = 6 - extraW;
    const ly = 10 + i * 4;
    b(lx, ly, lw, 3, main);
    b(lx + 1, ly, 1, 3, main === '#ddd8cc' ? '#ffffff' : main); // left highlight
    b(lx + 1, ly + 2, lw - 2, 1, stripe);   // beta-sheet cross-strand
    b(lx, ly + 3, lw, 1, dark);             // bottom shadow seam
  });

  // Outer silhouette outline (1px darker border)
  const outln = p === 1 ? '#3a3028' : p === 2 ? '#2a1808' : '#1a0030';
  b(6 - extraW - 1, 9, 1, 25, outln);
  b(26 + extraW, 9, 1, 25, outln);
  b(6 - extraW, 9, 22 + extraW * 2, 1, outln);
  b(6 - extraW, 34, 22 + extraW * 2, 1, outln);

  // Phase 2+: wide side fibril columns with striping (cascade effect)
  if (p >= 2) {
    const colC = p === 2 ? '#c0a860' : '#aa66cc';
    const colS = p === 2 ? '#906030' : '#7733aa';
    b(2, 12, 4, 20, colC);
    b(26, 12, 4, 20, colC);
    for (let i = 0; i < 5; i++) {
      b(2, 13 + i * 4, 4, 1, colS);
      b(26, 13 + i * 4, 4, 1, colS);
    }
    // Phase 2 fragment clusters floating off sides
    const fragFrame = Math.floor(t * 3) % 4;
    b(0, 16 + fragFrame, 2, 2, colC);
    b(30, 14 + (fragFrame + 2) % 4, 2, 2, colC);
    b(-1, 22 + fragFrame % 2, 2, 2, colS);
    b(31, 20 + fragFrame % 3, 2, 2, colS);
  }

  // Crown — fibril spikes of varying heights (silhouette hook — reads instantly)
  const fibPulse = p === 3 && Math.floor(t * 10) % 3 < 2;
  const fibC    = p === 1 ? '#eeeeee' : p === 2 ? '#ffdd88' : (fibPulse ? '#ffffff' : '#ee44ff');
  const fibTip  = p === 1 ? '#ffffff' : p === 2 ? '#ffffaa' : '#ff88ff';
  const spikeHeights: [number, number][] = [[7, 7], [10, 5], [15, 3], [20, 5], [23, 7]];
  spikeHeights.forEach(([spx, sph]) => {
    b(spx, 10 - sph, 2, sph, fibC);
    b(spx - 1, 10 - sph, 4, 1, fibTip); // pointed tip
    b(spx, 10 - sph, 1, 2, fibTip);     // left edge highlight
  });

  // Eyes — dark socket, red iris, gleam (always menacing)
  b(6, 14, 5, 5, '#1a0408');
  b(21, 14, 5, 5, '#1a0408');
  const eyeC = p === 3 ? '#dd00ff' : '#cc1100';
  const eyeHi = p === 3 ? '#ff88ff' : '#ff4444';
  b(7, 15, 3, 3, eyeC);
  b(22, 15, 3, 3, eyeC);
  b(7, 15, 1, 1, eyeHi);
  b(22, 15, 1, 1, eyeHi);
  // Phase 3: eyes glow with full magenta
  if (p === 3) {
    ctx.globalAlpha = 0.35 + 0.2 * Math.sin(t * 6);
    b(5, 13, 7, 7, '#ff00ff');
    b(20, 13, 7, 7, '#ff00ff');
    ctx.globalAlpha = 1;
  }

  // Tendrils (5 animated bottom strands — more dramatic in phase 3)
  const tendrilXs = [7, 11, 15, 19, 23];
  tendrilXs.forEach((tx, i) => {
    const tl = 3 + Math.round(Math.sin(t * 2.5 + i * 1.4) * 2) + (p === 3 ? 3 : (p === 2 ? 1 : 0));
    const tendC = p === 1 ? '#c0b0d0' : p === 2 ? '#c0a060' : '#cc44ee';
    const tendTip = p === 1 ? '#e0d0f0' : p === 2 ? '#e0cc80' : '#ff88ff';
    b(tx, 34, 2, tl, tendC);
    b(tx - 1, 34 + tl - 1, 4, 1, tendTip);
  });

  // Phase 3: FULL PURPLE-MAGENTA GLOW OVERLAY per canon
  if (p === 3) {
    const glowPulse = 0.25 + 0.2 * Math.sin(t * 3);
    ctx.globalAlpha = glowPulse;
    b(-3, -3, 38, 45, '#cc00ff');
    ctx.globalAlpha = glowPulse * 0.5;
    b(-6, -6, 44, 52, '#ff00ff');
    ctx.globalAlpha = 1;
    // Floating crystalline fragments around boss
    for (let f = 0; f < 6; f++) {
      const fx = Math.round(Math.sin(t * 1.2 + f * 1.05) * 18) + 14;
      const fy = Math.round(Math.cos(t * 0.9 + f * 0.8) * 14) + 14;
      b(fx, fy, 2, 2, fibTip);
    }
  }
}

function drawBoss(ctx: CanvasRenderingContext2D, realm: 1|2|3|4, cx: number, cy: number, bs: BossState) {
  switch (realm) {
    case 1: drawLyso(ctx, cx, cy, bs.bossHP, bs.t, bs.shakeX); break;
    case 2: drawViron(ctx, cx, cy, bs.bossHP, bs.t, bs.shakeX); break;
    case 3: drawOverfit(ctx, cx, cy, bs.bossHP, bs.t, bs.shakeX); break;
    case 4: drawAmyloid(ctx, cx, cy, bs.bossHP, bs.t, bs.shakeX); break;
  }
}

// ─── HUD helpers ─────────────────────────────────────────────────────────────

function drawHearts(ctx: CanvasRenderingContext2D, hp: number, maxHp: number, y: number) {
  for (let i = 0; i < maxHp; i++) {
    ctx.fillStyle = i < hp ? '#ff2244' : '#441122';
    ctx.fillRect(20 + i * 28, y, 20, 18);
    ctx.fillStyle = i < hp ? '#ff4466' : '#221122';
    ctx.fillRect(22 + i * 28, y - 4, 6, 6);
    ctx.fillRect(30 + i * 28, y - 4, 6, 6);
  }
}

function drawBossHPBar(ctx: CanvasRenderingContext2D, hp: number, x: number, y: number, barW: number) {
  ctx.fillStyle = '#1a0000';
  ctx.fillRect(x, y, barW, 18);
  const fillW = Math.max(0, (hp / 100) * (barW - 4));
  ctx.fillStyle = hp > 50 ? '#cc0000' : hp > 25 ? '#ff4400' : '#ff2200';
  ctx.fillRect(x + 2, y + 2, fillW, 14);
  ctx.fillStyle = '#660000';
  ctx.fillRect(x, y, barW, 2);
  ctx.fillRect(x, y + 16, barW, 2);
  ctx.fillRect(x, y, 2, 18);
  ctx.fillRect(x + barW - 2, y, 2, 18);
}

// ─── Canvas render ────────────────────────────────────────────────────────────

function renderFrame(ctx: CanvasRenderingContext2D, realm: 1|2|3|4, bs: BossState, now: number) {
  const bossCX = CW / 2;
  const bossCY = CH * 0.40;
  const hudH = Math.floor(CH * 0.15);
  const hpBarY = hudH + 2;
  const hpBarH = 26;

  // Background
  ctx.fillStyle = BOSS_BG[realm];
  ctx.fillRect(0, 0, CW, CH);

  // Arena floor hints
  ctx.fillStyle = '#ffffff08';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(0, CH * 0.15 + i * 36, CW, 2);
  }

  // Boss sprite (draw before HUD so HUD overlaps)
  if (bs.phase !== 'defeat') {
    drawBoss(ctx, realm, bossCX, bossCY, bs);
  }

  // Particles
  ctx.globalAlpha = 1;
  bs.particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
    ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
  });
  ctx.globalAlpha = 1;

  // Projectile
  if (bs.projectileActive) {
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(bs.projectileX - 5, bs.projectileY - 5, 10, 10);
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(bs.projectileX - 3, bs.projectileY - 3, 6, 6);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(bs.projectileX - 1, bs.projectileY - 1, 2, 2);
  }

  // Flash overlay
  if (bs.flashTimer > 0 && bs.flashType) {
    const alpha = bs.flashTimer * 0.35;
    ctx.fillStyle = bs.flashType === 'hit'
      ? `rgba(57,255,20,${alpha})`
      : `rgba(255,0,0,${alpha})`;
    ctx.fillRect(0, hudH, CW, CH * 0.65 - hudH);
  }

  // HUD bar
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, CW, hudH);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, hudH, CW, 2);

  // Player hearts
  drawHearts(ctx, bs.playerHP, 3, hudH / 2 - 12);

  // Boss HP bar
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, hpBarY, CW, hpBarH + 4);
  drawBossHPBar(ctx, bs.bossHP, 100, hpBarY + 4, CW - 200);

  // Boss name label (right of HP bar)
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(CW - 96, hpBarY + 2, 88, 22);
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(CW - 94, hpBarY + 4, 84, 18);

  // Round counter
  const roundStr = `${Math.min(bs.questionIdx + 1, 12)}/12`;
  ctx.fillStyle = '#ff8800';
  const rx = CW / 2 - 20;
  ctx.fillRect(rx, 6, 50, 18);
  ctx.fillStyle = '#000';
  ctx.fillRect(rx + 2, 8, 46, 14);

  // Victory dim
  if (bs.phase === 'victory') {
    const elapsed = now - bs.victoryTimer;
    ctx.fillStyle = '#000';
    ctx.globalAlpha = Math.min(0.7, elapsed / 2000);
    ctx.fillRect(0, 0, CW, CH);
    ctx.globalAlpha = 1;
  }

  // Defeat dim
  if (bs.phase === 'defeat') {
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.75;
    ctx.fillRect(0, 0, CW, CH);
    ctx.globalAlpha = 1;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface UiState {
  phase: BossState['phase'];
  questionIdx: number;
  optionSelected: number | null;
  resultType: 'correct' | 'wrong' | null;
  introLineIdx: number;
  phaseTaunt: string | null;
}

export default function BossBattle({ realm, onVictory, onDefeat }: BossBattleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bsRef = useRef<BossState | null>(null);
  const onVictoryRef = useRef(onVictory);
  const onDefeatRef = useRef(onDefeat);
  onVictoryRef.current = onVictory;
  onDefeatRef.current = onDefeat;

  const lastSyncedPhase = useRef<BossState['phase']>('intro');
  const lastSyncedQ = useRef(0);
  const lastSyncedTaunt = useRef<string | null>(null);

  const [ui, setUi] = useState<UiState>({
    phase: 'intro',
    questionIdx: 0,
    optionSelected: null,
    resultType: null,
    introLineIdx: 0,
    phaseTaunt: null,
  });

  const questions = BOSS_QUESTIONS[realm];

  const makeInitState = useCallback((): BossState => ({
    phase: 'intro',
    bossHP: 100,
    playerHP: 3,
    questionIdx: 0,
    introLineIdx: 0,
    shakeX: 0,
    shakeTimer: 0,
    flashTimer: 0,
    flashType: null,
    particles: [],
    t: 0,
    projectileX: CW / 2,
    projectileY: CH * 0.4,
    projectileActive: false,
    optionSelected: null,
    resultTimer: 0,
    victoryTimer: 0,
    defeatTimer: 0,
    lastFrameTime: 0,
    bossPhase: 1,
    phaseTaunt: null,
    phaseTauntTimer: 0,
  }), []);

  // ── Keyboard handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const bs = bsRef.current;
      if (!bs) return;

      if (bs.phase === 'intro') {
        if (e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
          const lines = BOSS_INTROS[realm];
          if (bs.introLineIdx < lines.length - 1) {
            bs.introLineIdx++;
            setUi(prev => ({ ...prev, introLineIdx: bs.introLineIdx }));
          } else {
            bs.phase = 'question';
            setUi(prev => ({ ...prev, phase: 'question', introLineIdx: bs.introLineIdx }));
          }
          e.preventDefault();
        }
        return;
      }

      if (bs.phase === 'question') {
        const keyMap: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (keyMap[e.key] !== undefined) {
          handleAnswerInternal(bs, keyMap[e.key]);
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm]);

  // ── Handle answer ─────────────────────────────────────────────────────────────
  const handleAnswerInternal = useCallback((bs: BossState, selectedIdx: number) => {
    if (bs.phase !== 'question') return;

    const qIdx = bs.questionIdx % questions.length;
    const q = questions[qIdx];
    const correct = selectedIdx === q.correctIndex;

    bs.optionSelected = selectedIdx;

    if (correct) {
      const dmg = 8 + Math.floor(Math.random() * 3);
      bs.bossHP = Math.max(0, bs.bossHP - dmg);

      // Phase transition detection
      if (bs.bossHP > 0) {
        const prevPhase = bs.bossPhase;
        const newPhase: 1 | 2 | 3 = bs.bossHP <= 33 ? 3 : (bs.bossHP <= 66 ? 2 : 1);
        if (newPhase > prevPhase) {
          bs.bossPhase = newPhase;
          bs.phaseTaunt = BOSS_PHASE_TAUNTS[realm][newPhase - 2];
          bs.phaseTauntTimer = performance.now() + 3000;
          bs.flashTimer = Math.max(bs.flashTimer, 1.5);
        }
      }

      bs.phase = bs.bossHP <= 0 ? 'victory' : 'correct';
      bs.flashType = 'hit';
      bs.flashTimer = 1;
      bs.shakeX = 8;
      bs.shakeTimer = 0.5;
      if (bs.bossHP <= 0) {
        bs.victoryTimer = performance.now();
        bs.phase = 'victory';
        // Burst particles
        for (let i = 0; i < 50; i++) {
          bs.particles.push({
            x: CW / 2 + (Math.random() - 0.5) * 120,
            y: CH * 0.4 + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10 - 3,
            color: ['#39ff14','#00ff88','#ffff00','#ff8800','#00ffff','#ff44ff'][Math.floor(Math.random() * 6)],
            life: 1,
          });
        }
      } else {
        // Hit particles
        for (let i = 0; i < 16; i++) {
          bs.particles.push({
            x: CW / 2, y: CH * 0.4,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            color: ['#39ff14','#aaff00','#ffff33'][Math.floor(Math.random() * 3)],
            life: 1,
          });
        }
      }
    } else {
      bs.playerHP = Math.max(0, bs.playerHP - 1);
      bs.phase = bs.playerHP <= 0 ? 'defeat' : 'wrong';
      bs.flashType = 'damage';
      bs.flashTimer = 1;
      bs.projectileActive = true;
      bs.projectileX = CW / 2;
      bs.projectileY = CH * 0.4;
      if (bs.playerHP <= 0) {
        bs.defeatTimer = performance.now();
      }
    }

    bs.resultTimer = performance.now() + 2200;

    setUi(prev => ({
      ...prev,
      phase: bs.phase,
      optionSelected: selectedIdx,
      resultType: correct ? 'correct' : 'wrong',
      phaseTaunt: bs.phaseTaunt,
    }));
  }, [questions, realm]);

  const handleAnswer = useCallback((idx: number) => {
    const bs = bsRef.current;
    if (bs) handleAnswerInternal(bs, idx);
  }, [handleAnswerInternal]);

  const handleTryAgain = useCallback(() => {
    const fresh = makeInitState();
    // Skip intro — go straight to questions
    fresh.phase = 'question';
    bsRef.current = fresh;
    lastSyncedPhase.current = 'question';
    lastSyncedQ.current = 0;
    setUi({ phase: 'question', questionIdx: 0, optionSelected: null, resultType: null, introLineIdx: 0, phaseTaunt: null });
  }, [makeInitState]);

  // ── Game loop ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    if (!bsRef.current) {
      bsRef.current = makeInitState();
    }

    let rafId = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const bs = bsRef.current!;

      const dt = Math.min(0.05, (now - (bs.lastFrameTime || now)) / 1000);
      bs.lastFrameTime = now;
      bs.t += dt;

      // Update particles
      bs.particles = bs.particles
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - dt * 1.2 }))
        .filter(p => p.life > 0);

      // Update shake
      if (bs.shakeTimer > 0) {
        bs.shakeTimer -= dt;
        bs.shakeX = bs.shakeTimer > 0 ? Math.sin(bs.t * 40) * 8 : 0;
      } else {
        bs.shakeX = 0;
      }

      // Update flash
      if (bs.flashTimer > 0) {
        bs.flashTimer = Math.max(0, bs.flashTimer - dt * 3);
      }

      // Expire phase taunt
      if (bs.phaseTaunt && now >= bs.phaseTauntTimer) {
        bs.phaseTaunt = null;
      }
      if (bs.phaseTaunt !== lastSyncedTaunt.current) {
        lastSyncedTaunt.current = bs.phaseTaunt;
        setUi(prev => ({ ...prev, phaseTaunt: bs.phaseTaunt }));
      }

      // Update projectile (moves toward bottom-center = player)
      if (bs.projectileActive) {
        bs.projectileX += (CW / 2 - bs.projectileX) * dt * 4;
        bs.projectileY += (CH * 0.8 - bs.projectileY) * dt * 4;
        if (Math.abs(bs.projectileY - CH * 0.8) < 20) {
          bs.projectileActive = false;
        }
      }

      // Phase transitions from result timer
      if ((bs.phase === 'correct' || bs.phase === 'wrong') && now >= bs.resultTimer) {
        if (bs.bossHP <= 0) {
          bs.phase = 'victory';
          bs.victoryTimer = now;
          if (lastSyncedPhase.current !== 'victory') {
            lastSyncedPhase.current = 'victory';
            setUi(prev => ({ ...prev, phase: 'victory' }));
          }
        } else if (bs.playerHP <= 0) {
          bs.phase = 'defeat';
          if (lastSyncedPhase.current !== 'defeat') {
            lastSyncedPhase.current = 'defeat';
            setUi(prev => ({ ...prev, phase: 'defeat' }));
          }
        } else {
          bs.questionIdx++;
          bs.phase = 'question';
          bs.optionSelected = null;
          bs.flashType = null;
          bs.projectileActive = false;
          bs.projectileY = CH * 0.4;
          if (lastSyncedQ.current !== bs.questionIdx || lastSyncedPhase.current !== 'question') {
            lastSyncedQ.current = bs.questionIdx;
            lastSyncedPhase.current = 'question';
            setUi(prev => ({
              ...prev,
              phase: 'question',
              questionIdx: bs.questionIdx,
              optionSelected: null,
              resultType: null,
            }));
          }
        }
      }

      // Victory auto-proceed
      if (bs.phase === 'victory' && now - bs.victoryTimer >= 3500) {
        cancelAnimationFrame(rafId);
        onVictoryRef.current();
        return;
      }

      renderFrame(ctx, realm, bs, now);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm]);

  // ── Derived display values ────────────────────────────────────────────────────
  const currentQ = questions[ui.questionIdx % questions.length];
  const introLines = BOSS_INTROS[realm];
  const currentIntroLine = introLines[ui.introLineIdx] ?? '';

  const getOptBg = (i: number) => {
    if (ui.optionSelected === i) {
      if (ui.resultType === 'correct') return '#0a2000';
      if (ui.resultType === 'wrong') return '#1a0000';
      return '#1a1a1a';
    }
    return '#0d0d0d';
  };

  const getOptBorder = (i: number) => {
    if (ui.optionSelected === i) {
      if (ui.resultType === 'correct') return '#39ff14';
      if (ui.resultType === 'wrong') return '#ff2244';
      return '#666';
    }
    if (currentQ && i === currentQ.correctIndex && ui.resultType === 'wrong') return '#39ff14';
    return '#333';
  };

  const showQuestion = ui.phase === 'question' || ui.phase === 'correct' || ui.phase === 'wrong';
  const isAnswered = ui.phase === 'correct' || ui.phase === 'wrong';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Canvas */}
      <div style={{ position: 'relative', width: CW, height: CH, flexShrink: 0 }}>
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{ display: 'block', imageRendering: 'pixelated' }}
        />

        {/* Boss name overlay (HUD center) */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Space Mono, monospace',
          fontSize: 11,
          color: '#ff4444',
          background: '#0d0d0d',
          padding: '3px 10px',
          letterSpacing: 2,
          pointerEvents: 'none',
          zIndex: 5,
          border: '1px solid #cc0000',
        }}>
          {BOSS_NAMES[realm]}
        </div>

        {/* Round counter */}
        <div style={{
          position: 'absolute',
          top: 8,
          right: 12,
          fontFamily: 'Space Mono, monospace',
          fontSize: 11,
          color: '#ff8800',
          background: '#0d0d0d',
          padding: '3px 8px',
          pointerEvents: 'none',
          zIndex: 5,
          border: '1px solid #663300',
        }}>
          {Math.min(ui.questionIdx + 1, 12)}/12
        </div>

        {/* HP label */}
        <div style={{
          position: 'absolute',
          top: Math.floor(CH * 0.15) + 6,
          right: 12,
          fontFamily: 'Space Mono, monospace',
          fontSize: 9,
          color: '#ff4444',
          pointerEvents: 'none',
          zIndex: 5,
          letterSpacing: 1,
        }}>
          BOSS HP
        </div>

        {/* ── INTRO OVERLAY ── */}
        {ui.phase === 'intro' && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '38%',
            background: '#080808',
            borderTop: '2px solid #cc0000',
            padding: '16px 20px 12px',
            zIndex: 20,
          }}>
            {/* Boss name tag */}
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 10,
              color: '#000',
              background: '#cc0000',
              display: 'inline-block',
              padding: '2px 10px',
              marginBottom: 10,
              letterSpacing: 2,
            }}>
              {BOSS_NAMES[realm]}
            </div>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 13,
              color: '#e5e7eb',
              lineHeight: 1.6,
              margin: 0,
              minHeight: 44,
            }}>
              {currentIntroLine}
            </p>
            <div style={{
              position: 'absolute',
              bottom: 14,
              right: 20,
              fontFamily: 'Space Mono, monospace',
              fontSize: 10,
              color: '#cc0000',
              animation: 'blink 0.8s infinite',
            }}>
              ▶ PRESS ENTER
            </div>
            <div style={{
              position: 'absolute',
              bottom: 14,
              left: 20,
              fontFamily: 'Space Mono, monospace',
              fontSize: 10,
              color: '#555',
            }}>
              {ui.introLineIdx + 1}/{introLines.length}
            </div>
          </div>
        )}

        {/* ── QUESTION OVERLAY ── */}
        {showQuestion && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '38%',
            background: '#080808',
            borderTop: '2px solid #333',
            padding: '10px 16px 8px',
            zIndex: 20,
          }}>
            {/* Flash result banner */}
            {isAnswered && (
              <div style={{
                position: 'absolute',
                top: -32,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'Space Mono, monospace',
                fontSize: 13,
                color: ui.resultType === 'correct' ? '#39ff14' : '#ff2244',
                background: '#000',
                border: `2px solid ${ui.resultType === 'correct' ? '#39ff14' : '#ff2244'}`,
                padding: '4px 16px',
                letterSpacing: 3,
                whiteSpace: 'nowrap',
              }}>
                {ui.resultType === 'correct' ? '★ CRITICAL HIT! ★' : '✗ DAMAGE TAKEN!'}
              </div>
            )}

            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 12,
              color: '#e5e7eb',
              margin: '0 0 10px',
              lineHeight: 1.4,
              minHeight: 32,
            }}>
              {currentQ?.question}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {currentQ?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={isAnswered}
                  style={{
                    background: getOptBg(i),
                    border: `2px solid ${getOptBorder(i)}`,
                    color: '#e5e7eb',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 11,
                    padding: '8px 8px',
                    textAlign: 'left',
                    cursor: isAnswered ? 'default' : 'pointer',
                    borderRadius: 0,
                    transition: 'border-color 0.1s',
                  }}
                >
                  <span style={{ color: getOptBorder(i), marginRight: 6 }}>
                    [{['A','B','C','D'][i]}]
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {isAnswered && currentQ?.explanation && (
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 10,
                color: '#888',
                margin: '6px 0 0',
                lineHeight: 1.4,
              }}>
                {currentQ.explanation}
              </p>
            )}

            <div style={{
              position: 'absolute',
              bottom: 6,
              right: 12,
              fontFamily: 'Space Mono, monospace',
              fontSize: 9,
              color: '#444',
            }}>
              [1][2][3][4] to answer
            </div>
          </div>
        )}

        {/* ── PHASE TAUNT BANNER ── */}
        {ui.phaseTaunt && (
          <div style={{
            position: 'absolute',
            top: '26%',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 28,
          }}>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 12,
              color: '#ff4444',
              background: '#0a0000ee',
              border: '2px solid #cc0000',
              padding: '8px 20px',
              letterSpacing: 2,
              textAlign: 'center',
              maxWidth: CW - 40,
            }}>
              <span style={{ color: '#ff8888', marginRight: 8 }}>{BOSS_NAMES[realm]}:</span>
              {ui.phaseTaunt}
            </div>
          </div>
        )}

        {/* ── VICTORY OVERLAY ── */}
        {ui.phase === 'victory' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 30,
          }}>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 28,
              color: '#39ff14',
              textShadow: '0 0 20px #39ff14, 0 0 40px #39ff14',
              letterSpacing: 6,
              marginBottom: 16,
            }}>
              ★ VICTORY! ★
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 12,
              color: '#888',
            }}>
              {BOSS_NAMES[realm]} has been defeated.
            </div>
          </div>
        )}

        {/* ── DEFEAT OVERLAY ── */}
        {ui.phase === 'defeat' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            gap: 16,
          }}>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 20,
              color: '#ff2244',
              letterSpacing: 4,
              textAlign: 'center',
            }}>
              YOU WERE BROKEN DOWN...
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 11,
              color: '#666',
              marginBottom: 16,
            }}>
              {BOSS_NAMES[realm]} remains undefeated.
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button
                onClick={handleTryAgain}
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 13,
                  color: '#39ff14',
                  background: '#0a2000',
                  border: '2px solid #39ff14',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  letterSpacing: 2,
                }}
              >
                [TRY AGAIN]
              </button>
              <button
                onClick={() => onDefeatRef.current()}
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 13,
                  color: '#ff2244',
                  background: '#1a0000',
                  border: '2px solid #ff2244',
                  padding: '10px 24px',
                  cursor: 'pointer',
                  letterSpacing: 2,
                }}
              >
                [RETREAT]
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
