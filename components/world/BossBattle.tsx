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

// ─── Boss sprite drawing ──────────────────────────────────────────────────────

function drawLyso(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const x = cx + sx;
  const rows: [number, number][] = [
    [10,2],[20,2],[30,3],[36,3],[40,3],[42,3],[42,3],[42,3],[40,3],[36,3],[30,3],[20,2],[10,2],
  ];
  const base = hp > 50 ? '#aa44cc' : hp > 25 ? '#772299' : '#441166';
  rows.forEach(([w, h], i) => {
    ctx.fillStyle = base;
    ctx.fillRect(x - (w * SCALE) / 2, cy + (i - 6) * 3 * SCALE, w * SCALE, h * SCALE);
  });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + t * 0.5;
    const r = 22 * SCALE;
    const spx = x + Math.cos(angle) * r;
    const spy = cy + Math.sin(angle) * r * 0.6;
    ctx.fillStyle = '#cc66ee';
    ctx.fillRect(spx - 2, spy - 6, 4, 8);
  }
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(x - 12, cy - 6, 24, 18);
  ctx.fillStyle = '#000011';
  const ps = (3 + Math.sin(t * 1.5)) * SCALE / 2;
  ctx.fillRect(x - ps, cy - ps, ps * 2, ps * 2);
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(x - 3, cy - 9, 6, 3);
  for (let d = 0; d < 4; d++) {
    const dH = (6 + Math.sin(t * 2 + d * 1.3) * 3) * SCALE;
    ctx.fillStyle = '#33ff33';
    ctx.fillRect(x - 20 * SCALE + d * 14 * SCALE, cy + 7 * SCALE, 6, dH);
  }
  if (hp < 50) {
    ctx.fillStyle = '#1a0033';
    for (let c = 0; c < 3; c++) {
      const crackX = x - 10 * SCALE + c * 10 * SCALE;
      for (let j = 0; j < 5; j++) {
        ctx.fillRect(crackX + j * 2, cy - 8 * SCALE + j * 4, 2, 2);
      }
    }
  }
}

function drawViron(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const x = cx + sx;
  const phase2 = hp <= 66;
  const phase3 = hp <= 33;

  // Phase 3: body pulses between teal and near-black every 8 frames
  const frame = Math.floor(t * 60);
  const pulseDark = phase3 && (frame % 8 < 4);
  const bodyMain = pulseDark ? '#071a0d' : (phase3 ? '#1a4a2e' : (phase2 ? '#2d7a5a' : '#52b788'));
  const bodyAlt  = pulseDark ? '#030d06' : (phase3 ? '#0d2e1c' : (phase2 ? '#1a5c40' : '#3d9b6a'));

  // Hexagonal body: 7 rows of fillRect approximating a hex, ~80x56px
  const hexRows: [number, number][] = [
    [28, 8], [52, 8], [72, 8], [80, 8],
    [72, 8], [52, 8], [28, 8],
  ];
  const hexH = hexRows.length * 8; // 56px total height
  hexRows.forEach(([w, h], i) => {
    ctx.fillStyle = i % 2 === 0 ? bodyMain : bodyAlt;
    ctx.fillRect(x - w / 2, cy - hexH / 2 + i * h, w, h);
  });

  // Genetic material (RNA): waving alternating orange/dark-orange 2x2 dots inside body
  for (let j = 0; j < 14; j++) {
    const rx = x - 20 + j * 3;
    const ry = cy + Math.sin(t * 4 + j * 0.6) * 6;
    ctx.fillStyle = j % 2 === 0 ? '#ff8c00' : '#ff6600';
    ctx.fillRect(rx, ry - 1, 2, 2);
  }

  // Spike proteins: 8 spikes radiating outward
  const baseR  = 44;
  const spikeLen = phase2 ? 28 : 20; // phase 2 extends 4+ extra px
  const spikeColor = phase3 ? '#cc0000' : '#52b788';
  for (let i = 0; i < 8; i++) {
    const baseAngle = (i / 8) * Math.PI * 2;
    const animAngle = baseAngle + Math.sin(t * 0.4 + i * 0.3) * 0.06;
    for (let s = 0; s <= spikeLen; s += 2) {
      const r = baseR + s;
      ctx.fillStyle = spikeColor;
      ctx.fillRect(
        x + Math.cos(animAngle) * r - 1,
        cy + Math.sin(animAngle) * r - 1,
        2, 2,
      );
    }
  }

  // Phase 2: second ring of 8 shorter spikes at offset angles
  if (phase2) {
    const ring2Color = phase3 ? '#880000' : '#3d9b6a';
    for (let i = 0; i < 8; i++) {
      const baseAngle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const animAngle = baseAngle + Math.sin(t * 0.5 + i * 0.4) * 0.08;
      for (let s = 0; s <= 14; s += 2) {
        const r = 36 + s;
        ctx.fillStyle = ring2Color;
        ctx.fillRect(
          x + Math.cos(animAngle) * r - 1,
          cy + Math.sin(animAngle) * r - 1,
          2, 2,
        );
      }
    }
  }

  // Eyes: 6x6 rectangles; red >60% HP, yellow >25%, white (enraged) ≤25%
  const eyeColor = hp > 60 ? '#cc0000' : (hp > 25 ? '#cccc00' : '#ffffff');
  ctx.fillStyle = eyeColor;
  ctx.fillRect(x - 14, cy - 6, 6, 6);
  ctx.fillRect(x + 8,  cy - 6, 6, 6);
}

function drawOverfit(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const x = cx + sx;
  const phase2 = hp <= 66;
  const phase3 = hp <= 33;

  // Data-matrix body: 6 cols × 8 rows of 7×7 squares with 1px gap = 8px step
  const COLS = 6, ROWS = 8, SQ = 7, STEP = 8;
  const matW = COLS * STEP - 1; // 47px
  const matH = ROWS * STEP - 1; // 63px
  const startX = x - matW / 2;
  const startY = cy - matH / 2;

  const BRIGHT = '#a855f7';
  const MID    = '#7c3aed';
  const GRAY   = '#3a3050';
  const BLACK  = '#1a1040';
  const GLITCH = [BRIGHT, '#ff00ff', '#00ccff', GRAY, BLACK] as const;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const px  = startX + c * STEP;
      const py  = startY + r * STEP;

      let sqColor: string;
      if (!phase2) {
        // Phase 1: all lit bright purple — 100% training accuracy illusion
        sqColor = idx % 5 === 0 ? BRIGHT : MID;
      } else if (!phase3) {
        // Phase 2: generalization failure — half squares go dark/gray
        sqColor = (r + c) % 2 === 0 ? GRAY : MID;
      } else {
        // Phase 3: glitching — squares randomly flicker
        const gi = Math.floor(t * 14 + idx * 0.9) % GLITCH.length;
        sqColor = GLITCH[gi];
      }

      // Face overrides
      if (r === 2 && (c === 1 || c === 4)) sqColor = phase3 ? '#ff00ff' : BRIGHT; // eyes
      if (r === 6 && c >= 1 && c <= 4) {
        // Wide grin row
        sqColor = (phase3 && Math.floor(t * 10) % 2 === 0) ? '#ffffff' : BRIGHT;
      }

      ctx.fillStyle = sqColor;
      ctx.fillRect(px, py, SQ, SQ);
    }
  }

  // Arms: rectangle appendages, grow 50% longer at phase 3
  const armH = phase3 ? 36 : 24;
  ctx.fillStyle = MID;
  ctx.fillRect(startX - 10, cy - armH / 2, 8, armH);
  ctx.fillRect(startX + matW + 2, cy - armH / 2, 8, armH);
  if (phase3) {
    // Claw extensions
    ctx.fillStyle = BRIGHT;
    ctx.fillRect(startX - 14, cy + 10, 14, 4);
    ctx.fillRect(startX + matW + 2, cy + 10, 14, 4);
  }

  // Training loss curve (right side): zigzag descending → perfect training fit
  const crv = startX + matW + 14;
  const crvTop = startY + 4;
  const crvStep = matH / 8;
  ctx.fillStyle = '#39ff14';
  for (let s = 0; s < 8; s++) {
    const sy = crvTop + s * crvStep;
    const cx2 = crv + (s % 2) * 4;
    ctx.fillRect(cx2, sy, 3, Math.max(2, crvStep * 0.7));
  }

  // Validation loss curve (further right): shoots upward — catastrophic overfit
  const valX = crv + 12;
  ctx.fillStyle = '#ff4444';
  for (let s = 0; s < 8; s++) {
    const sy = crvTop + (7 - s) * crvStep * 0.4 + s * s * 0.9;
    const vx2 = valX + (s % 2) * 4;
    ctx.fillRect(vx2, sy, 3, Math.max(2, crvStep * 0.7));
  }
}

function drawAmyloid(ctx: CanvasRenderingContext2D, cx: number, cy: number, hp: number, t: number, sx: number) {
  const x = cx + sx;
  const phase2 = hp <= 66;
  const phase3 = hp <= 33;

  // Body: 9 stacked layers of misfolded protein, ~56×72px (cy-36 to cy+36)
  const layers: [number, number, string][] = [
    [56, 8, '#d4c5a9'], [52, 8, '#b8a899'], [56, 8, '#cabbaa'],
    [50, 8, '#a09080'], [56, 8, '#b8aa98'], [52, 8, '#989088'],
    [56, 8, '#c0b0a0'], [50, 8, '#888080'], [52, 8, '#b0a898'],
  ];
  layers.forEach(([w, h, c], i) => {
    ctx.fillStyle = c;
    ctx.fillRect(x - w / 2, cy - 36 + i * h, w, h);
    // Beta-sheet stripe at bottom of each layer
    ctx.fillStyle = '#6a6060';
    ctx.fillRect(x - w / 2 + 2, cy - 36 + i * h + h - 1, w - 4, 1);
  });

  // Phase 2: extra fibril side layers (body grows wider)
  if (phase2) {
    ctx.fillStyle = '#c0b0a0';
    ctx.fillRect(x - 40, cy - 20, 14, 56);
    ctx.fillRect(x + 26, cy - 20, 14, 56);
    ctx.fillStyle = '#8a8080';
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(x - 40, cy - 20 + i * 8 + 7, 14, 1);
      ctx.fillRect(x + 26, cy - 20 + i * 8 + 7, 14, 1);
    }
  }

  // Crown: 5 amyloid fibril spikes of varying height
  const fibrilPulse = phase3 && Math.floor(t * 15) % 4 < 2;
  const fibrilColor = fibrilPulse ? '#ffffff' : '#c0a0ff';
  const spikeData: [number, number][] = [[-20, 20], [-10, 28], [0, 32], [10, 24], [20, 18]];
  spikeData.forEach(([ox, h]) => {
    ctx.fillStyle = fibrilColor;
    ctx.fillRect(x + ox - 1, cy - 36 - h, 2, h);
    ctx.fillRect(x + ox - 3, cy - 36 - h, 6, 2);
  });

  // Eyes: 3×3 red squares, deeply set in dark sockets
  ctx.fillStyle = '#1a0a0a';
  ctx.fillRect(x - 18, cy - 20, 10, 10);
  ctx.fillRect(x + 8,  cy - 20, 10, 10);
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(x - 16, cy - 18, 6, 6);
  ctx.fillRect(x + 10, cy - 18, 6, 6);
  ctx.fillStyle = '#ff5555';
  ctx.fillRect(x - 15, cy - 17, 2, 2);
  ctx.fillRect(x + 11, cy - 17, 2, 2);

  // Tendrils: 4 fibril strands, extend 50% longer at phase 3
  const tendrilMult = phase3 ? 1.5 : 1.0;
  const tendrilXs: number[] = [-14, -5, 5, 14];
  tendrilXs.forEach((ox, i) => {
    const tLen = (18 + Math.sin(t * 2.5 + i * 1.4) * 6) * tendrilMult;
    ctx.fillStyle = '#b0a0c0';
    ctx.fillRect(x + ox - 1, cy + 36, 2, tLen);
    ctx.fillStyle = '#d0c0e0';
    ctx.fillRect(x + ox - 2, cy + 36 + tLen - 2, 4, 2);
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
