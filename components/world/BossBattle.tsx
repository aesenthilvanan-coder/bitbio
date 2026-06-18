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
    '...I smell an outsider.',
    'Who dares enter the Golgi district?!',
    'I AM LYSO — the ROGUE LYSOSOME!',
    'I have digested seven mitochondria this week.',
    'You will make eight.',
    '★ BATTLE START ★',
  ],
  2: [
    'Zzt... INFECTION SEQUENCE INITIATED.',
    'Your genome belongs to me now.',
    'I am VIRON. I have written myself into every cell here.',
    "Let's see if you can debug your way out.",
    '★ BATTLE START ★',
  ],
  3: [
    'TRAINING COMPLETE. ACCURACY: 100%.',
    'VALIDATION LOSS: ERROR ERROR ERROR—',
    'I AM OVERFIT. I HAVE MEMORIZED EVERYTHING.',
    'I predict with 100% confidence you will FAIL.',
    '(Just like my validation set. I choose to ignore that.)',
    '★ BATTLE START ★',
  ],
  4: [
    '*low grinding sound*',
    'You have come far.',
    'But the cathedral belongs to me now.',
    'Every protein shall misfold. Every fibril shall grow.',
    'I am the AMYLOID TYRANT.',
    '★ BATTLE START ★',
  ],
};

const BOSS_NAMES: Record<1 | 2 | 3 | 4, string> = {
  1: 'LYSO', 2: 'VIRON', 3: 'OVERFIT', 4: 'AMYLOID TYRANT',
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
  const main = p === 1 ? '#aa44cc' : p === 2 ? '#772299' : '#441166';
  const hi   = p === 1 ? '#cc77ee' : p === 2 ? '#9933bb' : '#663399';
  const drk  = p === 1 ? '#660088' : p === 2 ? '#440066' : '#220044';

  // Blob body — layered for roundness
  b(9, 0, 14, 2, main);
  b(6, 2, 20, 3, main);
  b(4, 5, 24, 3, hi);      // upper highlight band
  b(3, 8, 26, 14, main);   // main mass
  b(3, 8, 4, 6, hi);       // left highlight
  b(4, 22, 24, 3, drk);
  b(6, 25, 20, 2, drk);
  b(9, 27, 14, 2, drk);    // bottom

  // Eyes — dark socket + red iris + pupil + gleam
  b(5, 10, 6, 6, '#220000');
  b(21, 10, 6, 6, '#220000');
  b(6, 11, 4, 4, '#cc0000');
  b(22, 11, 4, 4, '#cc0000');
  b(7, 12, 2, 2, '#ff3333');
  b(23, 12, 2, 2, '#ff3333');
  b(7, 12, 1, 1, '#ffffff');
  b(23, 12, 1, 1, '#ffffff');

  // Mouth
  b(8, 18, 16, 4, '#1a0000');
  b(9, 18, 14, 1, '#440000');
  // Jagged teeth
  b(9, 18, 2, 3, '#e0d0aa'); b(12, 18, 2, 3, '#e0d0aa');
  b(15, 18, 2, 3, '#e0d0aa'); b(18, 18, 2, 3, '#e0d0aa');
  b(21, 18, 2, 3, '#e0d0aa');

  // Nose bumps
  b(13, 15, 2, 1, drk); b(17, 15, 2, 1, drk);

  // Enzyme drips (animated)
  const dr = Math.floor(t * 3) % 3;
  b(5, 27, 2, 3 + dr, hi);
  b(12, 28, 2, 2 + dr, hi);
  b(18, 28, 2, 2 + dr, hi);
  b(25, 27, 2, 3 + dr, hi);

  // Phase cracks
  if (p >= 2) {
    b(11, 5, 1, 9, '#1a0033'); b(21, 8, 1, 7, '#1a0033');
  }
  if (p === 3) {
    b(2, 10, 2, 10, '#330011'); b(28, 10, 2, 10, '#330011');
    b(15, 1, 2, 4, '#440022');
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
  const main = pulseDark ? '#0d2e1c' : (p === 1 ? '#52b788' : p === 2 ? '#2d7a5a' : '#1a4a35');
  const alt  = pulseDark ? '#071a0d' : (p === 1 ? '#3d9b6a' : p === 2 ? '#1a5c40' : '#0d3020');
  const spikeC = p === 3 ? '#cc0000' : '#52b788';

  // Hexagonal body (approximated with tapered rows)
  b(10, 1, 12, 2, main);
  b(6, 3, 20, 3, main);
  b(3, 6, 26, 3, alt);     // dark hexagonal band
  b(3, 9, 26, 10, main);   // core
  b(3, 9, 4, 10, alt);     // left shadow
  b(3, 19, 26, 3, alt);
  b(6, 22, 20, 3, main);
  b(10, 25, 12, 2, main);

  // RNA strands inside (animated wave)
  for (let j = 0; j < 7; j++) {
    const rx = 7 + j * 3;
    const ry = 11 + Math.round(Math.sin(t * 3 + j * 0.9) * 2);
    b(rx, ry, 1, 3, j % 2 === 0 ? '#ff8c00' : '#ff6600');
  }

  // Spike proteins (8 directional)
  const spikes: [number, number, number, number][] = [
    [14, 0, 4, 1],   // top
    [24, 2, 3, 2],   // top-right
    [27, 11, 4, 2],  // right
    [26, 22, 3, 2],  // bottom-right
    [14, 28, 4, 2],  // bottom
    [4, 22, 3, 2],   // bottom-left
    [1, 11, 3, 2],   // left
    [4, 2, 3, 2],    // top-left
  ];
  spikes.forEach(([dx, dy, w, h]) => b(dx, dy, w, h, spikeC));
  // Phase 2: extended spikes
  if (p >= 2) {
    spikes.forEach(([dx, dy, w, h]) => {
      const ext = 2;
      b(dx - ext, dy - ext, w + ext, h + ext, spikeC + '88');
    });
  }

  // Eyes
  const eyeC = p === 1 ? '#cc0000' : p === 2 ? '#cccc00' : '#ffffff';
  b(8, 12, 5, 5, '#0a1a0a'); b(19, 12, 5, 5, '#0a1a0a');
  b(9, 13, 3, 3, eyeC);      b(20, 13, 3, 3, eyeC);
  b(9, 13, 1, 1, '#ffffff');  b(20, 13, 1, 1, '#ffffff');
}

function drawOverfit(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const ox = cx + sx - 16 * SCALE;
  const oy = cy - 16 * SCALE;
  const b = (dx: number, dy: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox + dx * SCALE, oy + dy * SCALE, w * SCALE, h * SCALE);
  };

  const p = hp > 66 ? 1 : hp > 33 ? 2 : 3;
  const BRIGHT = '#a855f7';
  const MID    = '#7c3aed';
  const GRAY   = '#3a3050';
  const BLACK  = '#1a1040';
  const GLITCH: string[] = [BRIGHT, '#ff00ff', '#00ccff', GRAY, BLACK];

  // 5×5 cell data-matrix body (each cell=5gp, 1gp gap = step=6)
  const COLS = 5, ROWS = 5, CELL = 5, STEP = 6;
  const bx = 1, by = 1;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const dx = bx + col * STEP;
      const dy = by + row * STEP;
      const idx = row * COLS + col;

      let c: string;
      if (p === 1) {
        c = idx % 4 === 0 ? BRIGHT : MID;
      } else if (p === 2) {
        c = (row + col) % 2 === 0 ? GRAY : MID;
      } else {
        c = GLITCH[Math.floor(t * 12 + idx * 1.1) % GLITCH.length];
      }

      // Face feature overrides
      if (row === 1 && (col === 1 || col === 3)) c = p === 3 ? '#ff00ff' : BRIGHT; // eyes
      if (row === 3 && col >= 1 && col <= 3)
        c = p === 3 && Math.floor(t * 8) % 2 === 0 ? '#ffffff' : BRIGHT;           // grin

      b(dx, dy, CELL, CELL, c);
    }
  }

  // Data arm bars (extend from sides)
  const armW = p === 3 ? 8 : 5;
  b(bx - armW, by + 12, armW, CELL, MID);             // left arm
  b(bx + COLS * STEP, by + 12, armW, CELL, MID);      // right arm
  if (p === 3) {
    b(bx - armW - 3, by + 14, 3, 3, BRIGHT);           // left claw
    b(bx + COLS * STEP + armW, by + 14, 3, 3, BRIGHT); // right claw
  }

  // Floating data particles above head (phase 3)
  if (p === 3) {
    for (let i = 0; i < 5; i++) {
      const px2 = bx + i * 6 + Math.round(Math.sin(t * 3 + i) * 2);
      b(px2, Math.round(Math.sin(t * 2 + i * 0.7) * 2), 2, 2, GLITCH[i % GLITCH.length]);
    }
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
  const extraW = p >= 2 ? 3 : 0; // body grows wider in phase 2+

  // Stacked fibril layers (6 layers of ~4gp each)
  const layers: [string, string][] = [
    ['#d4c5a9', '#a09080'],
    ['#c4b59a', '#908070'],
    ['#b4a590', '#808060'],
    ['#a49580', '#706050'],
    ['#948578', '#605848'],
    ['#887868', '#504038'],
  ];
  layers.forEach(([main, stripe], i) => {
    const lw = 20 + extraW * 2;
    const lx = 6 - extraW;
    const ly = 10 + i * 4;
    b(lx, ly, lw, 3, main);
    b(lx + 1, ly + 3, lw - 2, 1, stripe); // beta-sheet stripe
  });

  // Phase 2: wide side fibril columns
  if (p >= 2) {
    b(2, 14, 3, 18, '#b0a090');
    b(27, 14, 3, 18, '#b0a090');
    for (let i = 0; i < 5; i++) {
      b(2, 14 + i * 4 + 3, 3, 1, '#808070');
      b(27, 14 + i * 4 + 3, 3, 1, '#808070');
    }
  }

  // Crown — fibril spikes of varying heights
  const fibPulse = p === 3 && Math.floor(t * 10) % 3 < 2;
  const fibC = fibPulse ? '#ffffff' : '#c0a0ff';
  const spikes: [number, number][] = [[7,6],[10,4],[15,2],[20,4],[23,6]];
  spikes.forEach(([spx, sph]) => {
    b(spx, 10 - sph, 2, sph, fibC);
    b(spx - 1, 10 - sph, 4, 1, fibC); // spike tip cap
  });

  // Eyes — dark socket, red iris, gleam
  b(6, 14, 5, 5, '#1a0808');
  b(21, 14, 5, 5, '#1a0808');
  b(7, 15, 3, 3, '#cc0000');
  b(22, 15, 3, 3, '#cc0000');
  b(7, 15, 1, 1, '#ff5555');
  b(22, 15, 1, 1, '#ff5555');

  // Tendrils (4 animated bottom strands)
  const tendrilXs = [8, 13, 18, 23];
  tendrilXs.forEach((tx, i) => {
    const tl = 3 + Math.round(Math.sin(t * 2.5 + i * 1.4) * 2) + (p === 3 ? 2 : 0);
    b(tx, 34, 2, tl, '#b0a0c0');
    b(tx - 1, 34 + tl - 1, 4, 1, '#d0c0e0');
  });
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
