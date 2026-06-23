'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/lib/store';
import type { AvatarConfig } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type IntroPhase =
  | 'darkness'
  | 'kitchen'
  | 'upstairs'
  | 'bedroom'
  | 'closet'
  | 'computer'
  | 'sucked-in'
  | 'void'
  | 'choice'
  | 'complete';

interface IntroState {
  phase: IntroPhase;
  dialogueIdx: number;
  dialogueText: string;
  dialogueProgress: number;
  dialogueTyping: boolean;
  dialogueTimer: number;
  playerX: number;
  playerY: number;
  playerDir: 'left' | 'right' | 'up' | 'down';
  walkFrame: number;
  walkTimer: number;
  momFrame: number;
  momShake: number;
  cameraX: number;
  zoomLevel: number;
  zoomDir: number;
  suckProgress: number;
  suckDone: boolean;
  enzymeX: number;
  enzymeDir: 'left' | 'right';
  enzymeWalking: boolean;
  enzymeWalkFrame: number;
  shakeX: number;
  shakeY: number;
  shakeTimer: number;
  tunnelGlow: number;
  fadeAlpha: number;
  fading: boolean;
  fadeTarget: number;
  fadeCallback: (() => void) | null;
  _fadeDuration: number;
  _fadeTime: number;
  t: number;
  keys: Record<string, boolean>;
  phaseTimer: number;
  closetZoomStage: number;
  devilEyeMode: boolean;
  suckFurnitureDistort: number;
  choiceSelected: number;
  freeRoam: boolean;
  kitchenExitBlocked: boolean;
  kitchenBlockTimer: number;
  nearDesk: boolean;
  nearBookshelf: boolean;
  nearCloset: boolean;
  nearComputer: boolean;
  inMomsRoom: boolean;
  interactDialogue: boolean;
  upstairsSubPhase: 'hall' | 'momsroom' | 'bathroom' | 'yourroom';
  momsRoomItemIdx: number;
  bathroomInteractIdx: number;
  textbookFalling: boolean;
  textbookFallY: number;
  computerPhase: number;
  computerEmailOpen: boolean;
  computerLinkClicked: boolean;
  void_enzymeDialogueIdx: number;
  void_dialogueTimer: number;
  autoAdvanceTimer: number;
}

// ─── Scale ────────────────────────────────────────────────────────────────────

const S = 3; // 1 game px = 3 canvas px

function gr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x * S, y * S, w * S, h * S);
}

// ─── Pixel Font ───────────────────────────────────────────────────────────────

const FONT: Record<string, number[][]> = {
  A: [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
  B: [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,1],[1,1,1,0]],
  C: [[0,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[0,1,1,1]],
  D: [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0]],
  E: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1]],
  F: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
  G: [[0,1,1,1],[1,0,0,0],[1,0,1,1],[1,0,0,1],[0,1,1,0]],
  H: [[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
  I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  J: [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
  K: [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1]],
  L: [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  N: [[1,0,0,1],[1,1,0,1],[1,0,1,1],[1,0,0,1],[1,0,0,1]],
  O: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
  P: [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
  Q: [[0,1,1,0],[1,0,0,1],[1,0,1,1],[1,0,0,1],[0,1,1,1]],
  R: [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1]],
  S: [[0,1,1,1],[1,0,0,0],[0,1,1,0],[0,0,0,1],[1,1,1,0]],
  T: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  U: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
  V: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[0,0,1,0]],
  W: [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
  X: [[1,0,0,1],[0,1,1,0],[0,0,0,0],[0,1,1,0],[1,0,0,1]],
  Y: [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
  Z: [[1,1,1,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,1]],
  '0': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
  '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  '2': [[1,1,1,0],[0,0,0,1],[0,1,1,0],[1,0,0,0],[1,1,1,1]],
  '3': [[1,1,1,0],[0,0,0,1],[0,1,1,0],[0,0,0,1],[1,1,1,0]],
  '4': [[1,0,0,1],[1,0,0,1],[1,1,1,1],[0,0,0,1],[0,0,0,1]],
  '5': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[0,0,0,1],[1,1,1,0]],
  '6': [[0,1,1,0],[1,0,0,0],[1,1,1,0],[1,0,0,1],[0,1,1,0]],
  '7': [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[0,1,0,0]],
  '8': [[0,1,1,0],[1,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0]],
  '9': [[0,1,1,0],[1,0,0,1],[0,1,1,1],[0,0,0,1],[0,1,1,0]],
  '!': [[1],[1],[1],[0],[1]],
  '?': [[1,1,0],[0,0,1],[0,1,0],[0,0,0],[0,1,0]],
  '.': [[0],[0],[0],[0],[1]],
  ',': [[0],[0],[0],[0,1],[1,0]],
  '-': [[0,0,0],[1,1,1],[0,0,0]],
  "'": [[1],[1],[0],[0],[0]],
  '/': [[0,0,1],[0,0,1],[0,1,0],[1,0,0],[1,0,0]],
  ':': [[0],[1],[0],[1],[0]],
  '*': [[1,0,1],[0,1,0],[1,0,1]],
  '>': [[1,0],[0,1],[0,0],[0,1],[1,0]],
  '<': [[0,1],[1,0],[0,0],[1,0],[0,1]],
  ' ': [[0,0,0]],
  '+': [[0,1,0],[1,1,1],[0,1,0]],
};

function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  gx: number, gy: number,
  color: string,
  scale: number = 1
) {
  let cx = gx;
  for (const char of text.toUpperCase()) {
    const glyph = FONT[char] ?? FONT[' '];
    const rows = glyph;
    const cols = rows[0].length;
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < cols; c++) {
        if (rows[r][c]) {
          ctx.fillStyle = color;
          ctx.fillRect((cx + c * scale) * S, (gy + r * scale) * S, scale * S, scale * S);
        }
      }
    }
    cx += (cols + 1) * scale;
  }
}

function pixelTextWidth(text: string, scale: number = 1): number {
  let w = 0;
  for (const char of text.toUpperCase()) {
    const glyph = FONT[char] ?? FONT[' '];
    w += (glyph[0].length + 1) * scale;
  }
  return w;
}

// ─── Dialogue Box ─────────────────────────────────────────────────────────────

function drawDialogue(
  ctx: CanvasRenderingContext2D,
  speaker: string,
  text: string,
  progress: number,
  cw: number, ch: number,
  blink: boolean,
  subtitle?: string
) {
  const GW = Math.floor(cw / S);
  const GH = Math.floor(ch / S);
  const boxH = subtitle ? 46 : 36;
  const boxY = GH - boxH - 4;
  const boxX = 4;
  const boxW = GW - 8;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect((boxX - 1) * S, (boxY - 1) * S, (boxW + 2) * S, (boxH + 2) * S);

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(boxX * S, boxY * S, boxW * S, boxH * S);

  // Border
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(boxX * S, boxY * S, boxW * S, 2);
  ctx.fillRect(boxX * S, (boxY + boxH - 1) * S, boxW * S, 2);
  ctx.fillRect(boxX * S, boxY * S, 2, boxH * S);
  ctx.fillRect((boxX + boxW - 1) * S, boxY * S, 2, boxH * S);

  // Speaker name tag (color-coded by speaker)
  if (speaker) {
    const speakerColors: Record<string, [string, string]> = {
      'MOM':      ['#cc2244', '#ffffff'],
      'ENZYME':   ['#00bbaa', '#000000'],
      'NARRATOR': ['#444466', '#ffffff'],
      'ELLIOT':   ['#00ccdd', '#000000'],
      'BEN':      ['#44aa44', '#000000'],
      'ALEX':     ['#aa44ff', '#ffffff'],
      'HENRY':    ['#9966ff', '#ffffff'],
    };
    const [bgCol, textCol] = speakerColors[speaker.toUpperCase()] ?? ['#ffdd44', '#111111'];
    ctx.fillStyle = bgCol;
    ctx.fillRect((boxX + 2) * S, (boxY + 2) * S, (speaker.length * 7 + 6) * S, 10 * S);
    drawPixelText(ctx, speaker, boxX + 4, boxY + 3, textCol, 1);
  }

  // Text (typewriter)
  const displayed = text.slice(0, Math.floor(progress));
  const isItalic = displayed.startsWith('(');
  const textColor = isItalic ? '#cccccc' : '#ffffff';
  const lines = wrapText(displayed, 54);
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    drawPixelText(ctx, lines[i], boxX + 4, boxY + 16 + i * 8, textColor, 1);
  }

  // Subtitle / English translation (shown at bottom of box, teal-italic tone)
  if (subtitle) {
    const subDisplayed = subtitle.slice(0, Math.floor(progress));
    const subLines = wrapText(subDisplayed, 54);
    drawPixelText(ctx, subLines[0] ?? '', boxX + 4, boxY + boxH - 14, '#55ddcc', 1);
    if (subLines[1]) drawPixelText(ctx, subLines[1], boxX + 4, boxY + boxH - 7, '#55ddcc', 1);
  }

  // Advance prompt
  if (blink && progress >= text.length) {
    drawPixelText(ctx, '> SPACE', boxX + boxW - 20, boxY + boxH - 8, '#555577', 1);
  }
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── Sprite Drawers ───────────────────────────────────────────────────────────

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  gx: number, gy: number,
  avatar: AvatarConfig,
  dir: 'left' | 'right',
  walkFrame: number,
  sitting = false
) {
  const skin = avatar.skinTone;
  const hair = avatar.hairColor;
  const cloth = avatar.clothingColorPrimary;
  const eye = avatar.eyeColor;
  const skinShadow = shiftGr(skin, -30);
  const clothShadow = shiftGr(cloth, -28);
  const legCol = '#2a3a50';
  const legShadow = '#1a2a40';

  // Hair behind head (wider)
  gr(ctx, gx,     gy,     18, 4, hair);

  // Head outline
  gr(ctx, gx + 1, gy + 1, 16, 13, skinShadow);
  // Head fill
  gr(ctx, gx + 2, gy + 2, 14, 11, skin);

  // Hair style on top of head
  if (avatar.hairStyle === 0) {
    gr(ctx, gx + 1, gy,     16, 4, hair);
  } else if (avatar.hairStyle === 1) {
    gr(ctx, gx,     gy - 1, 18, 5, hair);
    gr(ctx, gx - 1, gy + 1, 3, 6, hair);
  } else if (avatar.hairStyle === 2) {
    gr(ctx, gx + 2, gy - 3, 14, 5, hair);
    gr(ctx, gx + 1, gy + 1, 16, 3, hair);
  } else {
    gr(ctx, gx + 1, gy,     16, 4, hair);
    gr(ctx, gx + 14, gy + 1, 3, 8, hair);
  }

  // Eyes (direction-aware, 2×2 px each)
  const blinkEye = (walkFrame % 90) < 6;
  const eyeH = blinkEye ? 1 : 2;
  if (dir === 'right') {
    gr(ctx, gx + 7,  gy + 5, 2, eyeH, eye);
    gr(ctx, gx + 12, gy + 5, 2, eyeH, eye);
    if (!blinkEye) {
      gr(ctx, gx + 7, gy + 5, 1, 1, '#ffffff');
      gr(ctx, gx + 12, gy + 5, 1, 1, '#ffffff');
    }
    gr(ctx, gx + 10, gy + 8, 3, 1, skinShadow); // nose
    gr(ctx, gx + 7,  gy + 10, 5, 1, '#aa4433'); // mouth
  } else {
    gr(ctx, gx + 4,  gy + 5, 2, eyeH, eye);
    gr(ctx, gx + 9,  gy + 5, 2, eyeH, eye);
    if (!blinkEye) {
      gr(ctx, gx + 4, gy + 5, 1, 1, '#ffffff');
      gr(ctx, gx + 9, gy + 5, 1, 1, '#ffffff');
    }
    gr(ctx, gx + 6, gy + 8, 3, 1, skinShadow);
    gr(ctx, gx + 5, gy + 10, 5, 1, '#aa4433');
  }

  // Neck
  gr(ctx, gx + 7, gy + 13, 4, 3, skin);

  // Shoulders
  gr(ctx, gx + 2, gy + 16, 14, 3, cloth);

  // Body / torso
  gr(ctx, gx + 3, gy + 19, 12, 10, cloth);
  gr(ctx, gx + 3, gy + 19, 12, 2, shiftGr(cloth, 15)); // highlight
  gr(ctx, gx + 3, gy + 27, 12, 2, clothShadow); // bottom shadow

  // Arms
  if (dir === 'right') {
    gr(ctx, gx,      gy + 16, 4, 12, cloth);
    gr(ctx, gx + 14, gy + 16, 4, 12, clothShadow);
    gr(ctx, gx - 1,  gy + 27, 5, 3, skin);
    gr(ctx, gx + 14, gy + 27, 5, 3, skin);
  } else {
    gr(ctx, gx,      gy + 16, 4, 12, clothShadow);
    gr(ctx, gx + 14, gy + 16, 4, 12, cloth);
    gr(ctx, gx - 1,  gy + 27, 5, 3, skin);
    gr(ctx, gx + 14, gy + 27, 5, 3, skin);
  }

  // Hips
  gr(ctx, gx + 3, gy + 29, 12, 3, legShadow);

  if (!sitting) {
    const legOff = (walkFrame % 2 === 0) ? 0 : 2;
    // Left leg
    gr(ctx, gx + 3, gy + 32 - legOff, 5, 9, legCol);
    gr(ctx, gx + 3, gy + 32 - legOff, 5, 2, shiftGr(legCol, 12));
    // Right leg
    gr(ctx, gx + 10, gy + 32 + legOff, 5, 9, legCol);
    gr(ctx, gx + 10, gy + 32 + legOff, 5, 2, shiftGr(legCol, 12));
    // Left foot
    gr(ctx, gx + 2,  gy + 41 - legOff, 6, 3, '#44302a');
    gr(ctx, gx + 2,  gy + 41 - legOff, 6, 1, '#5a4038');
    // Right foot
    gr(ctx, gx + 9,  gy + 41 + legOff, 6, 3, '#44302a');
    gr(ctx, gx + 9,  gy + 41 + legOff, 6, 1, '#5a4038');
  } else {
    gr(ctx, gx + 3, gy + 32, 5, 4, legCol);
    gr(ctx, gx + 10, gy + 32, 5, 4, legCol);
    gr(ctx, gx + 1,  gy + 36, 16, 3, legCol); // seated legs go forward
    gr(ctx, gx + 1,  gy + 39, 7, 3, '#44302a');
    gr(ctx, gx + 10, gy + 39, 7, 3, '#44302a');
  }
}

function shiftGr(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ─── Top-down player sprite (OMORI-style bird's eye view) ────────────────────

function drawPlayerTopDown(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  avatar: AvatarConfig,
  facing: 'left' | 'right' | 'up' | 'down',
  walkFrame: number,
) {
  const skin = avatar.skinTone || '#c68642';
  const hair = avatar.hairColor || '#2a1a0a';
  const cloth = avatar.clothingColorPrimary || '#1f2937';

  // Shadow beneath
  ctx.globalAlpha = 0.25;
  gr(ctx, px + 1, py + 9, 8, 2, '#000000');
  ctx.globalAlpha = 1;

  // Body (top-down view: oval torso)
  gr(ctx, px + 1, py + 4, 8, 6, cloth);
  gr(ctx, px + 2, py + 3, 6, 7, cloth);

  // Head: circle from above
  gr(ctx, px + 2, py, 6, 6, skin);
  gr(ctx, px + 1, py + 1, 8, 4, skin);

  // Hair on top of head (varies by facing)
  if (facing === 'up') {
    gr(ctx, px + 1, py, 8, 3, hair);
  } else if (facing === 'down') {
    gr(ctx, px + 2, py, 6, 2, hair);
    gr(ctx, px + 1, py + 1, 2, 2, hair);
    gr(ctx, px + 7, py + 1, 2, 2, hair);
  } else {
    gr(ctx, px + 2, py, 6, 2, hair);
    const sideHair = facing === 'left' ? px + 1 : px + 6;
    gr(ctx, sideHair, py, 3, 4, hair);
  }

  // Feet (animated, sticking out from body)
  const legOff = (walkFrame % 2 === 0) ? 0 : 1;
  if (facing === 'down' || facing === 'up') {
    gr(ctx, px + 1, py + 10 - legOff, 3, 2, skin);
    gr(ctx, px + 6, py + 10 + legOff, 3, 2, skin);
  } else {
    const baseY = py + 9;
    gr(ctx, px + 3, baseY - legOff, 4, 2, skin);
    gr(ctx, px + 3, baseY + legOff + 2, 4, 2, skin);
  }
}

// ─── Top-down Mom sprite ──────────────────────────────────────────────────────

function drawMomTopDown(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  skinTone: string,
  state: 'idle' | 'angry' | 'talking',
  frame: number,
) {
  // Dress (red, viewed from above - oval shape)
  gr(ctx, px + 1, py + 3, 10, 8, '#c41e3a');
  gr(ctx, px + 2, py + 2, 8, 10, '#c41e3a');
  // Head
  gr(ctx, px + 2, py - 1, 8, 6, skinTone);
  gr(ctx, px + 1, py, 10, 4, skinTone);
  // Hair bun (top view — brown circle)
  gr(ctx, px + 3, py - 3, 6, 4, '#3d1a00');
  gr(ctx, px + 4, py - 4, 4, 2, '#3d1a00');
  // Angry indicators
  if (state === 'angry' || state === 'talking') {
    const steamOff = (frame % 4 < 2) ? 0 : 1;
    gr(ctx, px + 2, py - 5 - steamOff, 1, 3, '#cccccc');
    gr(ctx, px + 6, py - 6 + steamOff, 1, 3, '#cccccc');
    gr(ctx, px + 10, py - 4 - steamOff, 1, 3, '#cccccc');
  }
}

function drawMom(
  ctx: CanvasRenderingContext2D,
  gx: number, gy: number,
  skinTone: string,
  state: 'idle' | 'angry' | 'talking',
  frame: number
) {
  const shakeOff = state === 'talking' ? ((frame % 2 === 0) ? -1 : 1) : 0;
  const x = gx + shakeOff;

  // Hair bun
  gr(ctx, x + 2, gy, 10, 4, '#3d1a00');
  gr(ctx, x + 4, gy - 2, 6, 3, '#3d1a00');

  // Face
  gr(ctx, x + 1, gy + 4, 12, 9, skinTone);

  // Angry brows
  if (state === 'angry' || state === 'talking') {
    gr(ctx, x + 2, gy + 5, 3, 1, '#220000');
    gr(ctx, x + 3, gy + 4, 2, 1, '#220000');
    gr(ctx, x + 9, gy + 5, 3, 1, '#220000');
    gr(ctx, x + 9, gy + 4, 2, 1, '#220000');
    // Red cheeks
    gr(ctx, x + 2, gy + 9, 2, 2, '#ff6688');
    gr(ctx, x + 10, gy + 9, 2, 2, '#ff6688');
  }

  // Eyes
  gr(ctx, x + 3, gy + 7, 2, 2, '#222');
  gr(ctx, x + 9, gy + 7, 2, 2, '#222');

  // Mouth angry
  gr(ctx, x + 4, gy + 11, 6, 1, '#aa2233');
  gr(ctx, x + 3, gy + 12, 1, 1, '#aa2233');
  gr(ctx, x + 10, gy + 12, 1, 1, '#aa2233');

  // Steam lines above head (when angry)
  if (state === 'angry') {
    const sOff = (frame % 4 < 2) ? 0 : 1;
    gr(ctx, x + 3, gy - 4 - sOff, 1, 3, '#cccccc');
    gr(ctx, x + 7, gy - 5 + sOff, 1, 4, '#cccccc');
    gr(ctx, x + 11, gy - 3 - sOff, 1, 3, '#cccccc');
  }

  // Body dress
  gr(ctx, x + 0, gy + 13, 14, 14, '#c41e3a');
  // Arms
  gr(ctx, x - 1, gy + 14, 3, 8, '#c41e3a');
  gr(ctx, x + 12, gy + 14, 3, 8, '#c41e3a');

  // Pointing finger (right arm extended)
  if (state === 'talking' || state === 'angry') {
    gr(ctx, x + 14, gy + 14, 5, 1, skinTone);
    gr(ctx, x + 18, gy + 13, 1, 3, skinTone);
  }

  // Legs
  gr(ctx, x + 2, gy + 27, 4, 5, '#c41e3a');
  gr(ctx, x + 8, gy + 27, 4, 5, '#c41e3a');
  // Shoes
  gr(ctx, x + 1, gy + 32, 5, 2, '#330011');
  gr(ctx, x + 7, gy + 32, 5, 2, '#330011');
}

// Helper: fill ellipse via horizontal scanlines
function fillEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rw: number, rh: number, color: string) {
  ctx.fillStyle = color;
  for (let dy = -rh; dy <= rh; dy++) {
    const p = 1 - (dy / rh) * (dy / rh);
    if (p <= 0) continue;
    const hw = Math.max(1, Math.floor(rw * Math.sqrt(p)));
    ctx.fillRect((cx - hw) * S, (cy + dy) * S, hw * 2 * S, S);
  }
}

function drawDevilEyes(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  t: number,
  _playerGX: number, _playerGY: number,
  avatar: AvatarConfig
) {
  const GW = Math.floor(cw / S);
  const GH = Math.floor(ch / S);
  const cx = Math.floor(GW / 2);
  const pulse = (Math.sin(t * 1.8) + 1) / 2;

  // ── Background ────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#0a0005';
  ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = `rgba(120,0,30,${0.05 + pulse * 0.08})`;
  ctx.fillRect(0, 0, cw, ch);

  const headCY = Math.floor(GH * 0.42);

  // ── HORNS ─────────────────────────────────────────────────────────────────────
  for (let h = 0; h < 24; h++) {
    const hw = Math.max(1, 6 - Math.floor(h / 4));
    gr(ctx, cx - 30 - Math.floor(h * 0.5), headCY - 20 - h, hw, 1, h < 12 ? '#2a0010' : '#180008');
    gr(ctx, cx + 25 + Math.floor(h * 0.5), headCY - 20 - h, hw, 1, h < 12 ? '#2a0010' : '#180008');
  }

  // ── HEAD (skull oval) ─────────────────────────────────────────────────────────
  fillEllipse(ctx, cx, headCY, Math.floor(GW * 0.22), Math.floor(GH * 0.22), '#1a0010');
  fillEllipse(ctx, cx - 8, headCY - 6, Math.floor(GW * 0.12), Math.floor(GH * 0.10), '#220018');
  fillEllipse(ctx, cx, headCY + Math.floor(GH * 0.12), Math.floor(GW * 0.18), Math.floor(GH * 0.08), '#140008');

  // ── HAIR TENDRILS ─────────────────────────────────────────────────────────────
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - 0.3 + t * 0.15;
    const len = 28 + Math.floor(Math.sin(t * 1.2 + i * 0.9) * 6);
    for (let d = 0; d < len; d++) {
      const nx = cx + Math.floor(Math.cos(angle) * (Math.floor(GW * 0.2) + d));
      const ny = headCY + Math.floor(Math.sin(angle) * (Math.floor(GH * 0.18) + d));
      if (nx >= 0 && nx < GW && ny >= 0 && ny < GH) {
        const fade = 1 - d / len;
        const r = Math.floor(50 * fade);
        gr(ctx, nx, ny, 1, 1, `rgb(${r},0,${Math.floor(r * 0.4)})`);
      }
    }
  }

  // ── EYES (oval — NOT rectangles) ─────────────────────────────────────────────
  const eyeOffX = Math.floor(GW * 0.12);
  const eyeCY   = Math.floor(GH * 0.36);
  const eyeRW   = Math.floor(GW * 0.085);
  const eyeRH   = Math.floor(GH * 0.075);
  const glowPulse = (Math.sin(t * 3) + 1) / 2;

  for (let side = 0; side < 2; side++) {
    const ecx = cx + (side === 0 ? -eyeOffX : eyeOffX);

    ctx.globalAlpha = 0.18 + glowPulse * 0.25;
    fillEllipse(ctx, ecx, eyeCY, eyeRW + 5, eyeRH + 4, '#ff2244');
    ctx.globalAlpha = 1;

    fillEllipse(ctx, ecx, eyeCY, eyeRW, eyeRH, '#ffcccc');

    // Upper eyelid shadow
    for (let dy = -eyeRH; dy < -Math.floor(eyeRH * 0.3); dy++) {
      const p = 1 - (dy / eyeRH) * (dy / eyeRH);
      if (p <= 0) continue;
      const hw = Math.max(1, Math.floor(eyeRW * Math.sqrt(p)));
      ctx.fillStyle = 'rgba(20,0,8,0.78)';
      ctx.fillRect((ecx - hw) * S, (eyeCY + dy) * S, hw * 2 * S, S);
    }
    // Lower eyelid shadow
    for (let dy = Math.floor(eyeRH * 0.65); dy <= eyeRH; dy++) {
      const p = 1 - (dy / eyeRH) * (dy / eyeRH);
      if (p <= 0) continue;
      const hw = Math.max(1, Math.floor(eyeRW * Math.sqrt(p)));
      ctx.fillStyle = 'rgba(20,0,8,0.55)';
      ctx.fillRect((ecx - hw) * S, (eyeCY + dy) * S, hw * 2 * S, S);
    }

    fillEllipse(ctx, ecx, eyeCY, Math.floor(eyeRW * 0.68), Math.floor(eyeRH * 0.72), '#cc0000');
    fillEllipse(ctx, ecx, eyeCY, Math.floor(eyeRW * 0.50), Math.floor(eyeRH * 0.54), '#ee1122');

    const slitH = Math.floor(eyeRH * 1.3);
    gr(ctx, ecx - 1, eyeCY - slitH, 3, slitH * 2, '#000000');
    gr(ctx, ecx + Math.floor(eyeRW * 0.28), eyeCY - Math.floor(eyeRH * 0.38), 2, 2, '#ff6688');
    gr(ctx, ecx + Math.floor(eyeRW * 0.28), eyeCY - Math.floor(eyeRH * 0.38), 1, 1, '#ffffff');
  }

  // ── FLAMES above eyes ────────────────────────────────────────────────────────
  for (let side = 0; side < 2; side++) {
    const ecx = cx + (side === 0 ? -eyeOffX : eyeOffX);
    for (let f = 0; f < 7; f++) {
      const fx = ecx - eyeRW + Math.floor(f * eyeRW * 2 / 6);
      const fh = 4 + Math.floor(Math.sin(t * 5 + f * 0.9) * 3);
      for (let frow = 0; frow < fh; frow++) {
        const frac = frow / fh;
        const fcol = frac < 0.3 ? '#ffcc00' : frac < 0.6 ? '#ff8800' : '#ff4400';
        gr(ctx, fx, eyeCY - eyeRH - fh + frow, 2, 1, fcol);
      }
    }
  }

  // ── NOSE ──────────────────────────────────────────────────────────────────────
  gr(ctx, cx - 5, headCY + 2, 3, 3, '#0a0004');
  gr(ctx, cx + 3, headCY + 2, 3, 3, '#0a0004');

  // ── MOUTH (wide jagged grin) ──────────────────────────────────────────────────
  const mouthY = Math.floor(GH * 0.56);
  const mouthL = Math.floor(GW * 0.18);
  const mouthR = Math.floor(GW * 0.82);
  const mouthW = mouthR - mouthL;
  gr(ctx, mouthL, mouthY - 2, mouthW, 2, '#660000');
  gr(ctx, mouthL, mouthY + 6, mouthW, 2, '#440000');
  gr(ctx, mouthL, mouthY, mouthW, 6, '#0a0002');
  const toothCount = 14;
  const toothW = Math.floor(mouthW / toothCount);
  for (let tooth = 0; tooth < toothCount; tooth++) {
    const tx = mouthL + tooth * toothW;
    const isUp = tooth % 2 === 0;
    gr(ctx, tx + 1, mouthY - 1, toothW - 1, isUp ? 4 : 2, isUp ? '#f0f0f0' : '#cc0000');
    gr(ctx, tx + 1, mouthY + 3, toothW - 1, isUp ? 2 : 4, isUp ? '#cc0000' : '#f0f0f0');
  }
  for (let d = 0; d < 4; d++) {
    const dx = mouthL + Math.floor(mouthW * (0.15 + d * 0.22));
    const dl = 2 + Math.floor(Math.sin(t * 1.5 + d) * 1);
    gr(ctx, dx, mouthY + 8, 2, dl, '#cc0000');
  }

  // ── CAPTION ───────────────────────────────────────────────────────────────────
  const caption = 'THE MOM-DEMON OF INCOMPLETE SCIENCE PROJECTS';
  const capY = Math.floor(GH * 0.82);
  ctx.globalAlpha = 0.35 + pulse * 0.2;
  gr(ctx, Math.floor(GW / 2) - 90, capY - 3, 180, 10, '#440011');
  ctx.globalAlpha = 1;
  drawPixelText(ctx, caption, Math.floor(GW / 2) - Math.floor(caption.length * 3.5), capY, '#cc3344', 1);

  // ── TINY HORRIFIED PLAYER ────────────────────────────────────────────────────
  const ppx = Math.floor(GW / 2) - 6;
  const ppy = Math.floor(GH * 0.88);
  drawPlayer(ctx, ppx, ppy, avatar, 'right', 0);
  if (Math.floor(t * 3) % 2 === 0) {
    gr(ctx, ppx + 4, ppy - 10, 2, 6, '#ffdd00');
    gr(ctx, ppx + 4, ppy - 2, 2, 2, '#ffdd00');
  }
}

function drawEnzyme(
  ctx: CanvasRenderingContext2D,
  gx: number, gy: number,
  walkFrame: number,
  mood: 'happy' | 'annoyed' | 'sitting' = 'happy'
) {
  const W = '#f4f4f4';  // white body
  const WS = '#d8d8d8'; // body shadow
  const EYE = '#00bbaa'; // signature teal eyes
  const PINK = '#ffb3c6';
  const blink = (walkFrame % 80) < 5;
  const tailWag = Math.round(Math.sin(walkFrame * 0.15) * 2);

  // TAIL (behind body, draw first)
  gr(ctx, gx + 14, gy + 8 + tailWag, 3, 2, W);
  gr(ctx, gx + 16, gy + 6 + tailWag, 2, 3, W);
  gr(ctx, gx + 17, gy + 4 + tailWag, 2, 3, WS);

  // BODY (12×7)
  gr(ctx, gx + 1, gy + 7, 13, 8, W);
  gr(ctx, gx + 2, gy + 6, 11, 2, W); // shoulder rise
  // Body shading
  gr(ctx, gx + 1, gy + 13, 13, 2, WS);
  gr(ctx, gx + 12, gy + 7, 2, 8, WS);

  // HEAD (11×9)
  gr(ctx, gx + 2, gy - 1, 10, 9, W);
  gr(ctx, gx + 1, gy,     12, 7, W);
  // Head outline shadow
  gr(ctx, gx + 1, gy + 7, 12, 1, WS);

  // EARS
  gr(ctx, gx + 2, gy - 4, 3, 4, W);
  gr(ctx, gx + 9, gy - 4, 3, 4, W);
  gr(ctx, gx + 2, gy - 4, 2, 3, PINK); // inner left ear
  gr(ctx, gx + 9, gy - 4, 2, 3, PINK); // inner right ear

  // EYES — teal with white highlight
  if (mood === 'annoyed') {
    gr(ctx, gx + 4, gy + 2, 3, 1, EYE);
    gr(ctx, gx + 3, gy + 1, 1, 1, EYE);
    gr(ctx, gx + 9, gy + 2, 3, 1, EYE);
    gr(ctx, gx + 11, gy + 1, 1, 1, EYE);
  } else if (!blink) {
    gr(ctx, gx + 4, gy + 2, 3, 2, EYE);
    gr(ctx, gx + 9, gy + 2, 3, 2, EYE);
    gr(ctx, gx + 4, gy + 2, 1, 1, '#ffffff'); // eye shine left
    gr(ctx, gx + 9, gy + 2, 1, 1, '#ffffff'); // eye shine right
    gr(ctx, gx + 5, gy + 3, 1, 1, '#007a70'); // pupil depth left
    gr(ctx, gx + 10, gy + 3, 1, 1, '#007a70');
  } else {
    gr(ctx, gx + 4, gy + 3, 3, 1, EYE); // closed blink line
    gr(ctx, gx + 9, gy + 3, 3, 1, EYE);
  }

  // NOSE
  gr(ctx, gx + 6, gy + 5, 2, 1, PINK);

  // MOUTH
  gr(ctx, gx + 5, gy + 6, 4, 1, '#cc8899');
  if (mood === 'happy') {
    gr(ctx, gx + 4, gy + 6, 1, 1, '#cc8899');
    gr(ctx, gx + 9, gy + 6, 1, 1, '#cc8899');
  }

  // WHISKERS (left)
  gr(ctx, gx - 2, gy + 3, 4, 1, '#aaaaaa');
  gr(ctx, gx - 2, gy + 5, 4, 1, '#aaaaaa');
  // WHISKERS (right)
  gr(ctx, gx + 12, gy + 3, 4, 1, '#aaaaaa');
  gr(ctx, gx + 12, gy + 5, 4, 1, '#aaaaaa');

  // LEGS (4 stubs with animation)
  const legA = (walkFrame % 2 === 0) ? 0 : 1;
  if (mood === 'sitting') {
    gr(ctx, gx + 2,  gy + 15, 4, 3, W);
    gr(ctx, gx + 8,  gy + 15, 4, 3, W);
    gr(ctx, gx + 2,  gy + 17, 4, 1, PINK);
    gr(ctx, gx + 8,  gy + 17, 4, 1, PINK);
  } else {
    gr(ctx, gx + 2, gy + 15 - legA, 3, 4, W);
    gr(ctx, gx + 7, gy + 15 + legA, 3, 4, W);
    gr(ctx, gx + 9, gy + 15 - legA, 3, 4, WS);
    gr(ctx, gx + 3, gy + 15 + legA, 3, 4, WS);
    gr(ctx, gx + 2,  gy + 18 - legA, 3, 1, PINK);
    gr(ctx, gx + 7,  gy + 18 + legA, 3, 1, PINK);
    gr(ctx, gx + 9,  gy + 18 - legA, 3, 1, PINK);
    gr(ctx, gx + 3,  gy + 18 + legA, 3, 1, PINK);
  }
}

// ─── Scene Drawers ────────────────────────────────────────────────────────────

function drawKitchen(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number) {
  // ── TOP-DOWN OMORI-STYLE KITCHEN ──────────────────────────────────────────
  // Full floor: dark warm wood planks (horizontal lines)
  ctx.fillStyle = '#2a1a0a';
  ctx.fillRect(0, 0, GW * S, GH * S);
  for (let fy = 0; fy < GH; fy += 6) {
    ctx.fillStyle = fy % 12 === 0 ? '#3a2810' : '#2a1a0a';
    ctx.fillRect(0, fy * S, GW * S, 6 * S);
    // Plank divider lines (vertical seams)
    for (let fx = 0; fx < GW; fx += 28) {
      gr(ctx, fx + (Math.floor(fy / 6) % 2) * 14, fy, 1, 6, '#1a0e04');
    }
  }

  // Warm ambient light overlay (subtle)
  const glow = (Math.sin(t * 0.8) + 1) / 2;
  ctx.fillStyle = `rgba(255,200,80,${0.04 + glow * 0.015})`;
  ctx.fillRect(0, 0, GW * S, GH * S);

  // ── Walls (top, left, right) ──
  gr(ctx, 0, 0, GW, 8, '#1a1008'); // top wall
  gr(ctx, 0, 0, 6, GH, '#1a1008'); // left wall
  gr(ctx, GW - 6, 0, 6, GH, '#1a1008'); // right wall
  // Wall highlight edges
  gr(ctx, 0, 8, GW, 1, '#2a1e10');
  gr(ctx, 6, 0, 1, GH, '#2a1e10');
  gr(ctx, GW - 7, 0, 1, GH, '#2a1e10');

  // ── Counter along TOP wall (full width) ──
  const ctrY = 8;
  gr(ctx, 6, ctrY, GW - 12, 12, '#4a3018'); // counter body
  gr(ctx, 6, ctrY, GW - 12, 2, '#6a4828'); // surface highlight
  gr(ctx, 6, ctrY + 12, GW - 12, 1, '#2a1808'); // bottom shadow

  // Stove (left-of-center on counter)
  const stoveX = Math.floor(GW * 0.25);
  gr(ctx, stoveX, ctrY + 1, 18, 10, '#252525'); // stove top
  gr(ctx, stoveX + 1, ctrY + 2, 16, 8, '#1e1e1e');
  // Burners (4 circles from above)
  const heatPulse = (Math.sin(t * 3) + 1) / 2;
  const burnerHot = `#${Math.floor(80 + heatPulse * 100).toString(16).padStart(2,'0')}2000`;
  for (const [bx, by] of [[stoveX+3,ctrY+3],[stoveX+9,ctrY+3],[stoveX+3,ctrY+7],[stoveX+9,ctrY+7]]) {
    gr(ctx, bx, by, 4, 3, burnerHot);
    gr(ctx, bx+1, by+1, 2, 1, '#ff4400');
  }

  // Refrigerator (top-right corner, viewed from above = rectangle)
  const fridgeX = GW - 22;
  gr(ctx, fridgeX, ctrY + 1, 14, 10, '#303030'); // fridge top
  gr(ctx, fridgeX + 1, ctrY + 2, 12, 3, '#3e3e3e'); // freezer compartment
  gr(ctx, fridgeX + 1, ctrY + 6, 12, 4, '#2a2a2a'); // fridge compartment
  gr(ctx, fridgeX + 13, ctrY + 4, 2, 4, '#444'); // handle

  // ── Dining table (center-left, top-down view) ──
  const tableX = Math.floor(GW * 0.28);
  const tableY = Math.floor(GH * 0.38);
  const tableW = 28, tableH = 18;
  gr(ctx, tableX, tableY, tableW, tableH, '#5a3a18'); // table surface
  gr(ctx, tableX + 1, tableY + 1, tableW - 2, 2, '#6a4a24'); // highlight
  gr(ctx, tableX, tableY + tableH - 1, tableW, 1, '#3a2008'); // bottom shadow

  // 4 Chairs around table (viewed from above: small rectangles)
  // Top chairs
  gr(ctx, tableX + 4, tableY - 8, 8, 6, '#4a2e10');
  gr(ctx, tableX + 4, tableY - 9, 8, 1, '#6a3e18');
  gr(ctx, tableX + tableW - 12, tableY - 8, 8, 6, '#4a2e10');
  gr(ctx, tableX + tableW - 12, tableY - 9, 8, 1, '#6a3e18');
  // Bottom chairs
  gr(ctx, tableX + 4, tableY + tableH + 2, 8, 6, '#4a2e10');
  gr(ctx, tableX + 4, tableY + tableH + 7, 8, 1, '#3a1e08');
  gr(ctx, tableX + tableW - 12, tableY + tableH + 2, 8, 6, '#4a2e10');
  gr(ctx, tableX + tableW - 12, tableY + tableH + 7, 8, 1, '#3a1e08');

  // Bowl on table
  gr(ctx, tableX + 10, tableY + 6, 8, 6, '#8B4513');
  gr(ctx, tableX + 11, tableY + 7, 6, 4, '#a05020');
  gr(ctx, tableX + 13, tableY + 8, 2, 2, '#cc7733'); // food

  // ── Window: LEFT wall (top-down = view into wall recess) ──
  const winY = Math.floor(GH * 0.55);
  gr(ctx, 0, winY, 6, 18, '#1a1008'); // wall
  gr(ctx, 1, winY + 1, 4, 16, '#091520'); // night glass
  gr(ctx, 1, winY + 7, 4, 2, '#3a2410'); // divider
  for (const [sx,sy] of [[2,2],[3,5],[2,11]]) gr(ctx, sx, winY+sy, 1, 1, '#aaccff');

  // ── Stairs indicator: bottom-right ──
  const stairX = GW - 20;
  const stairY = GH - 16;
  for (let ss = 0; ss < 4; ss++) {
    gr(ctx, stairX + ss*2, stairY + ss*2, 16 - ss*2, 3, `#${(0x28+ss*8).toString(16).padStart(2,'0')}${(0x18+ss*4).toString(16).padStart(2,'0')}08`);
    gr(ctx, stairX + ss*2, stairY + ss*2, 16-ss*2, 1, `#${(0x38+ss*6).toString(16).padStart(2,'0')}2010`);
  }
  drawPixelText(ctx, '> STAIRS', stairX - 2, stairY - 8, '#887766', 1);

  // ── Overhead light (center cast from above) ──
  ctx.fillStyle = `rgba(255,210,100,${0.07 + glow * 0.025})`;
  ctx.fillRect(Math.floor(GW*0.3) * S, Math.floor(GH*0.3) * S, Math.floor(GW*0.4) * S, Math.floor(GH*0.5) * S);
}

function drawUpstairs(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number) {
  // ── TOP-DOWN HALLWAY (bird's eye view) ────────────────────────────────────────
  // Full floor: dark purple carpet
  ctx.fillStyle = '#1a1228';
  ctx.fillRect(0, 0, GW * S, GH * S);
  // Carpet texture: small dot pattern
  for (let fy = 0; fy < GH; fy += 4) {
    for (let fx = 0; fx < GW; fx += 6) {
      ctx.fillStyle = (fy + fx) % 8 === 0 ? 'rgba(80,50,120,0.18)' : 'rgba(50,30,80,0.10)';
      ctx.fillRect(fx * S, fy * S, 3 * S, 2 * S);
    }
  }

  // Walls: top wall thick (the room's north wall)
  gr(ctx, 0, 0, GW, 10, '#0f0a18'); // north wall
  gr(ctx, 0, 0, 6, GH, '#0f0a18'); // west wall
  gr(ctx, GW - 6, 0, 6, GH, '#0f0a18'); // east wall
  gr(ctx, 0, 10, GW, 1, '#2a1a3a'); // wall-floor edge

  // Downstairs indicator (south edge)
  for (let ss = 0; ss < 3; ss++) {
    gr(ctx, Math.floor(GW/2) - 12 + ss*2, GH - 6 - ss*2, 20 - ss*4, 4, `rgba(30,20,50,${0.9 - ss*0.2})`);
  }
  drawPixelText(ctx, '< DOWNSTAIRS', Math.floor(GW/2) - 22, GH - 12, '#554466', 1);

  // ── Three doors in north wall ─────────────────────────────────────────────────
  const glowPulse = (Math.sin(t * 2) + 1) / 2;
  const doorSpacing = Math.floor(GW / 4);
  const doors = [
    { cx: doorSpacing,         label: "MOM'S ROOM", glow: '#ff3366', glowRgb: [255,51,102] },
    { cx: doorSpacing * 2,     label: 'YOUR ROOM',  glow: '#4488ff', glowRgb: [68,136,255] },
    { cx: doorSpacing * 3,     label: 'BATHROOM',   glow: '#44ddaa', glowRgb: [68,221,170] },
  ];
  for (const door of doors) {
    const dw = 22, dhVisible = 10;
    const dx = door.cx - Math.floor(dw / 2);
    // Door opening in north wall (darker than wall)
    gr(ctx, dx, 0, dw, dhVisible, '#0a0610');
    gr(ctx, dx + 1, 1, dw - 2, dhVisible - 2, '#060408');
    // Door frame highlight
    gr(ctx, dx - 1, 0, 1, dhVisible, '#1e1430');
    gr(ctx, dx + dw, 0, 1, dhVisible, '#1e1430');
    // Color glow spilling from door onto floor
    const [r, g, b] = door.glowRgb;
    ctx.fillStyle = `rgba(${r},${g},${b},${0.08 + glowPulse * 0.10})`;
    ctx.fillRect(dx * S, 10 * S, dw * S, 14 * S);
    // Handle
    gr(ctx, dx + dw - 6, dhVisible - 4, 2, 3, '#2a1a40');
    // Label
    drawPixelText(ctx, door.label, dx - 2, dhVisible + 4, '#554466', 1);
  }

  // Hallway runner rug (center strip)
  gr(ctx, Math.floor(GW*0.12), 18, Math.floor(GW*0.76), Math.floor(GH*0.55), '#241a34');
  gr(ctx, Math.floor(GW*0.13), 19, Math.floor(GW*0.74), Math.floor(GH*0.53), '#2a1e3c');
  // Rug border pattern
  for (let rx = Math.floor(GW*0.13); rx < Math.floor(GW*0.87); rx += 6) {
    gr(ctx, rx, 19, 3, 2, '#3a2a50');
    gr(ctx, rx, 18 + Math.floor(GH*0.53) - 2, 3, 2, '#3a2a50');
  }

  // Wall sconces (left and right walls, top area)
  for (const scx of [8, GW - 14]) {
    const scGlow = 0.06 + glowPulse * 0.06;
    gr(ctx, scx, 14, 6, 8, '#2a2040');
    gr(ctx, scx + 1, 15, 4, 4, '#ffeecc');
    ctx.fillStyle = `rgba(255,220,140,${scGlow})`;
    ctx.fillRect((scx - 4) * S, 10 * S, 14 * S, 20 * S);
  }
}

function drawBedroom(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number) {
  // ── TOP-DOWN BEDROOM (bird's eye view) ──────────────────────────────────────
  // Floor: dark hardwood planks (horizontal lines)
  ctx.fillStyle = '#1a1208';
  ctx.fillRect(0, 0, GW * S, GH * S);
  for (let fy = 0; fy < GH; fy += 7) {
    ctx.fillStyle = fy % 14 === 0 ? '#221808' : '#1a1208';
    ctx.fillRect(0, fy * S, GW * S, 7 * S);
    for (let fx = 0; fx < GW; fx += 28) gr(ctx, fx + (Math.floor(fy/7)%2)*14, fy, 1, 7, '#100a04');
  }

  // Subtle blue wallpaper at top wall strip
  const glow = (Math.sin(t * 1.5) + 1) / 2;
  // Walls
  gr(ctx, 0, 0, GW, 8, '#121928');
  gr(ctx, 0, 0, 6, GH, '#121928');
  gr(ctx, GW - 6, 0, 6, GH, '#121928');
  gr(ctx, 0, 8, GW, 1, '#1e2a3c');
  gr(ctx, 6, 0, 1, GH, '#1e2a3c');
  gr(ctx, GW - 7, 0, 1, GH, '#1e2a3c');

  // ── BED: top-left, against north wall ──
  const bedX = 8, bedY = 10;
  gr(ctx, bedX, bedY, 44, 26, '#3b5a8f');       // bed frame
  gr(ctx, bedX + 2, bedY + 8, 40, 16, '#6b8fcf'); // sheets (viewed from above)
  gr(ctx, bedX, bedY, 44, 7, '#2a3f6a');         // headboard (north/top side)
  gr(ctx, bedX + 3, bedY + 1, 16, 5, '#f0f4ff'); // pillow 1
  gr(ctx, bedX + 22, bedY + 1, 16, 5, '#e8ecf8'); // pillow 2
  // Bed shadow
  gr(ctx, bedX, bedY + 26, 44, 2, '#110e06');

  // ── BOOKSHELF: along west wall (top-down = thin, taller) ──
  const shelfX = 6, shelfY = 46;
  gr(ctx, shelfX, shelfY, 14, 40, '#3a2810');
  gr(ctx, shelfX + 1, shelfY + 1, 12, 38, '#4a3418');
  // Shelf levels + books viewed from above
  for (let sl = 0; sl < 3; sl++) {
    gr(ctx, shelfX, shelfY + sl * 13 + 12, 14, 1, '#2a1e0c');
    const bkColors = ['#c41e3a','#1a6b3a','#2244aa','#aa6600','#6a1aaa','#cc8800'];
    let bpos = shelfX + 1;
    while (bpos < shelfX + 13) {
      const bw = 2 + Math.floor(Math.abs(Math.sin(bpos * 5.7 + sl)) * 2);
      gr(ctx, bpos, shelfY + sl * 13 + 1, bw, 10, bkColors[(bpos + sl * 3) % bkColors.length]);
      bpos += bw + 1;
    }
  }

  // ── DESK + COMPUTER: top-right corner ──
  const deskX = GW - 44, deskY = 10;
  gr(ctx, deskX, deskY, 38, 18, '#6b4a1a'); // desk surface
  gr(ctx, deskX + 1, deskY + 1, 36, 1, '#8b6a2a'); // desk highlight
  // Monitor (viewed from above: wide rectangle at back of desk)
  gr(ctx, deskX + 4, deskY + 1, 26, 10, '#1a1a2e'); // monitor back
  gr(ctx, deskX + 5, deskY + 2, 24, 8, '#0a0a1e');   // screen
  // Email glow on screen (always on)
  const emailGlow = 0.3 + 0.2 * Math.sin(t * 2);
  ctx.fillStyle = `rgba(0,255,200,${emailGlow})`;
  ctx.fillRect((deskX + 7) * S, (deskY + 3) * S, 20 * S, 6 * S);
  gr(ctx, deskX + 9, deskY + 4, 4, 1, '#00ffcc'); gr(ctx, deskX + 14, deskY + 4, 6, 1, '#00ddaa');
  gr(ctx, deskX + 9, deskY + 6, 10, 1, '#00bb88');
  // Monitor stand
  gr(ctx, deskX + 15, deskY + 11, 6, 4, '#333');
  // Keyboard at front of desk
  gr(ctx, deskX + 4, deskY + 14, 22, 3, '#2a2a2a');
  gr(ctx, deskX + 5, deskY + 14, 20, 1, '#3a3a3a');
  // Desk lamp
  gr(ctx, deskX + 33, deskY + 2, 3, 12, '#555');
  gr(ctx, deskX + 28, deskY + 1, 9, 2, '#555');
  ctx.fillStyle = `rgba(255,230,140,${0.12 + glow * 0.06})`;
  ctx.fillRect((deskX + 26) * S, deskY * S, 12 * S, 14 * S);

  // ── CLOSET: right wall center ──
  const closetX = GW - 8, closetY = Math.floor(GH * 0.38);
  gr(ctx, closetX - 2, closetY, 8, 30, '#a07050'); // door in wall
  gr(ctx, closetX - 1, closetY + 1, 6, 28, '#b08060');
  gr(ctx, closetX, closetY + 14, 1, 4, '#7a5030'); // handle
  // "slightly open" shadow line
  gr(ctx, closetX - 3, closetY, 1, 30, '#111');

  // ── POSTER on north wall (above the bed, visible as rectangle in wall) ──
  const postX = bedX + 46, postY = 1;
  gr(ctx, postX, postY, 28, 6, '#111133');
  gr(ctx, postX + 1, postY + 1, 26, 4, '#0a0a22');
  drawPixelText(ctx, 'CODE OR DIE', postX + 2, postY + 2, '#39ff14', 1);

  // ── Floor lamp: bottom-left ──
  gr(ctx, 12, GH - 20, 4, 14, '#666');
  fillEllipse(ctx, 14, GH - 22, 6, 2, '#ffeeaa');
  ctx.fillStyle = `rgba(255,220,120,${0.07 + glow * 0.04})`;
  ctx.fillRect(0, (GH - 35) * S, 30 * S, 30 * S);

  // ── Overhead ambient ──
  ctx.fillStyle = `rgba(255,230,160,${0.05 + glow * 0.02})`;
  ctx.fillRect(0, 0, GW * S, GH * S);
}

function drawMomsRoom(ctx: CanvasRenderingContext2D, GW: number, GH: number, itemIdx: number) {
  // ── TOP-DOWN MOM'S ROOM (bird's eye view) ─────────────────────────────────────
  // Floor: warm dark hardwood
  for (let fy = 0; fy < GH; fy += 7) {
    ctx.fillStyle = fy % 14 === 0 ? '#221204' : '#1a0e02';
    ctx.fillRect(0, fy * S, GW * S, 7 * S);
    for (let fx = 0; fx < GW; fx += 24) gr(ctx, fx + (Math.floor(fy/7)%2)*12, fy, 1, 7, '#0e0800');
  }
  // Subtle warm wallpaper stripes
  for (let wy = 0; wy < 8; wy += 2) {
    ctx.fillStyle = 'rgba(120,60,20,0.06)';
    ctx.fillRect(0, wy * S, GW * S, S);
  }

  // Walls
  gr(ctx, 0, 0, GW, 8, '#1a0c06');
  gr(ctx, 0, 0, 6, GH, '#1a0c06');
  gr(ctx, GW - 6, 0, 6, GH, '#1a0c06');
  gr(ctx, 0, 8, GW, 1, '#2e1a0a');
  gr(ctx, 6, 0, 1, GH, '#2e1a0a');
  gr(ctx, GW - 7, 0, 1, GH, '#2e1a0a');

  // ── BED: against north wall, center-left ──
  const bedX = Math.floor(GW * 0.2), bedY = 10;
  gr(ctx, bedX, bedY, 44, 26, '#8B7355');           // bed frame
  gr(ctx, bedX + 2, bedY + 8, 40, 16, '#8b1a2a');  // deep red sheets
  gr(ctx, bedX, bedY, 44, 7, '#6a502e');            // headboard
  gr(ctx, bedX + 3, bedY + 1, 16, 5, '#f8f8f8');   // pillow 1
  gr(ctx, bedX + 22, bedY + 1, 16, 5, '#f0f0ee');  // pillow 2
  // Bed shadow
  gr(ctx, bedX, bedY + 26, 44, 2, '#0e0800');

  // ── DESK + DIARY (item 0): top-right corner ──
  const deskX = GW - 48, deskY = 10;
  gr(ctx, deskX, deskY, 36, 18, '#7b5a2a');
  gr(ctx, deskX + 1, deskY + 1, 34, 1, '#9b7a4a');
  // Diary on desk (top-down: rectangle book with text visible)
  gr(ctx, deskX + 6, deskY + 3, 18, 12, '#3a1800');
  gr(ctx, deskX + 7, deskY + 4, 16, 10, '#4a2000');
  drawPixelText(ctx, 'DIARY', deskX + 9, deskY + 5, '#cc8844', 1);
  drawPixelText(ctx, 'vol.47', deskX + 9, deskY + 10, '#aa6633', 1);
  if (itemIdx === 0) {
    ctx.fillStyle = 'rgba(255,200,80,0.14)';
    ctx.fillRect((deskX + 4) * S, (deskY + 1) * S, 22 * S, 16 * S);
  }

  // ── TROPHY CABINET: left wall (top-down view = thin strip) ──
  const trophyX = 6, trophyY = 44;
  gr(ctx, trophyX, trophyY, 18, 40, '#5a3e1a');
  gr(ctx, trophyX + 1, trophyY + 1, 16, 38, '#4a2e0a');
  drawPixelText(ctx, "JEFF'S", trophyX + 1, trophyY + 3, '#ffcc44', 1);
  // Top-down trophy shelves
  for (let sh = 0; sh < 3; sh++) {
    gr(ctx, trophyX, trophyY + sh * 12 + 11, 18, 1, '#3a2008');
    gr(ctx, trophyX + 4 + sh * 4, trophyY + sh * 12 + 2, 4, 8, '#ffaa00');
    gr(ctx, trophyX + 2 + sh * 4, trophyY + sh * 12 + 6, 8, 2, '#ffcc44');
  }
  // "Potential (pending)" slot
  gr(ctx, trophyX + 1, trophyY + 30, 16, 7, '#0a0804');
  drawPixelText(ctx, '?????', trophyX + 3, trophyY + 32, '#aaaa44', 1);
  if (itemIdx === 1) {
    ctx.fillStyle = 'rgba(255,200,80,0.14)';
    ctx.fillRect(trophyX * S, trophyY * S, 20 * S, 42 * S);
  }

  // ── PHOTO ON NORTH WALL (item 2) ──
  const photoX = Math.floor(GW * 0.5);
  gr(ctx, photoX, 1, 24, 6, '#2a2018');
  gr(ctx, photoX + 1, 2, 22, 4, '#1a140c');
  gr(ctx, photoX + 3, 2, 5, 4, '#3a2a1a');
  gr(ctx, photoX + 11, 3, 3, 3, '#2a1e12');
  gr(ctx, photoX + 5, 3, 1, 1, '#aa8866');
  gr(ctx, photoX + 7, 3, 1, 1, '#aa8866');
  if (itemIdx === 2) {
    ctx.fillStyle = 'rgba(255,200,80,0.14)';
    ctx.fillRect((photoX - 1) * S, 0, 26 * S, 8 * S);
  }

  // ── Candle on nightstand ──
  gr(ctx, bedX + 46, bedY + 2, 6, 10, '#e8d8c0');
  gr(ctx, bedX + 48, bedY + 1, 2, 3, '#ffee88');
  gr(ctx, bedX + 46, bedY + 12, 6, 6, '#3a2a1a');

  // Item labels
  drawPixelText(ctx, `[${itemIdx + 1}/${MOMS_ROOM_ITEMS.length}] ${MOMS_ROOM_ITEMS[itemIdx]?.label ?? ''}`, 4, GH - 18, '#886644', 1);
}

function drawBathroom(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number, interactIdx: number) {
  // ── TOP-DOWN BATHROOM (bird's eye view) ───────────────────────────────────────
  // Floor: white tile grid
  ctx.fillStyle = '#c8d4cc';
  ctx.fillRect(0, 0, GW * S, GH * S);
  for (let ty = 0; ty < GH; ty += 10) {
    for (let tx = 0; tx < GW; tx += 10) {
      ctx.fillStyle = (Math.floor(ty/10) + Math.floor(tx/10)) % 2 === 0 ? '#c8d4cc' : '#d4e0d8';
      ctx.fillRect(tx * S, ty * S, 10 * S, 10 * S);
      // Grout lines
      ctx.fillStyle = '#a0b0a8';
      ctx.fillRect(tx * S, ty * S, GW > 0 ? 1 : 0, S);
      ctx.fillRect(tx * S, ty * S, S, GH > 0 ? 1 : 0);
    }
  }

  const mg = (Math.sin(t * 1.5) + 1) * 0.02;
  // Walls
  gr(ctx, 0, 0, GW, 8, '#1a2a22');
  gr(ctx, 0, 0, 6, GH, '#1a2a22');
  gr(ctx, GW - 6, 0, 6, GH, '#1a2a22');
  gr(ctx, 0, 8, GW, 1, '#2a3e34');
  gr(ctx, 6, 0, 1, GH, '#2a3e34');
  gr(ctx, GW - 7, 0, 1, GH, '#2a3e34');

  // ── TOILET: against north wall, right side (from above) ──
  const toiX = GW - 30, toiY = 9;
  gr(ctx, toiX, toiY, 22, 10, '#b0c0b8');          // tank (back)
  gr(ctx, toiX + 2, toiY + 1, 18, 8, '#c8d8d0');   // tank highlight
  fillEllipse(ctx, toiX + 11, toiY + 18, 10, 7, '#b0c0b8');  // bowl
  fillEllipse(ctx, toiX + 11, toiY + 18, 8, 6, '#d0e0d8');   // bowl inner
  fillEllipse(ctx, toiX + 11, toiY + 18, 4, 3, '#8090a8');   // bowl water
  // Toilet handle on tank
  gr(ctx, toiX + 2, toiY + 3, 3, 2, '#889898');

  // ── SINK: against north wall, center (from above) ──
  const sinkX = Math.floor(GW * 0.35), sinkY = 9;
  gr(ctx, sinkX, sinkY, 24, 14, '#a8b8b0');         // sink outer
  fillEllipse(ctx, sinkX + 12, sinkY + 8, 10, 5, '#c0d0c8');  // basin rim
  fillEllipse(ctx, sinkX + 12, sinkY + 8, 8, 4, '#ccddd4');   // basin
  fillEllipse(ctx, sinkX + 12, sinkY + 8, 2, 1, '#6a8080');   // drain
  // Faucet
  gr(ctx, sinkX + 9, sinkY + 2, 6, 2, '#889090');
  gr(ctx, sinkX + 11, sinkY + 1, 2, 2, '#9aacaa');

  // ── MIRROR on north wall (visible as a shiny strip) (item 0) ──
  const mirrorX = Math.floor(GW * 0.15), mirrorY = 1;
  gr(ctx, mirrorX, mirrorY, 26, 6, '#1a2a22');
  gr(ctx, mirrorX + 1, mirrorY + 1, 24, 4, '#d0e8e0');
  ctx.globalAlpha = 0.13 + mg;
  gr(ctx, mirrorX + 1, mirrorY + 2, 24, 2, '#ffffff');
  ctx.globalAlpha = 1;
  ctx.fillStyle = `rgba(200,255,220,${0.05 + mg})`;
  ctx.fillRect((mirrorX - 2) * S, 0, 30 * S, 14 * S);
  if (interactIdx === 0) {
    ctx.fillStyle = 'rgba(200,255,220,0.12)';
    ctx.fillRect((mirrorX - 2) * S, 0, 30 * S, 16 * S);
  }

  // ── MEDICINE CABINET: right wall (item 1) ──
  const cabX = GW - 8, cabY = 24;
  gr(ctx, cabX - 4, cabY, 10, 28, '#1e2c1a');
  gr(ctx, cabX - 3, cabY + 1, 8, 26, '#2a3c26');
  drawPixelText(ctx, 'MED', cabX - 3, cabY + 3, '#446644', 1);
  // Pill bottles (from above: circles in cabinet)
  for (let i = 0; i < 3; i++) {
    gr(ctx, cabX - 3 + i, cabY + 8 + i * 5, 4, 4, i === 0 ? '#446688' : i === 1 ? '#884444' : '#664422');
  }
  // Mysterious book at bottom
  gr(ctx, cabX - 3, cabY + 20, 8, 6, '#3a2a10');
  drawPixelText(ctx, '"??"', cabX - 2, cabY + 22, '#886644', 1);
  if (interactIdx === 1) {
    ctx.fillStyle = 'rgba(255,200,80,0.12)';
    ctx.fillRect((cabX - 5) * S, cabY * S, 12 * S, 30 * S);
  }

  // ── Bathtub: left wall area (from above) ──
  const tubX = 6, tubY = 38;
  gr(ctx, tubX, tubY, 18, 32, '#a8b8b0');
  gr(ctx, tubX + 1, tubY + 1, 16, 30, '#b8c8c0');
  fillEllipse(ctx, tubX + 9, tubY + 16, 7, 13, '#9ab0b8');  // water
  fillEllipse(ctx, tubX + 9, tubY + 16, 5, 11, '#aac4cc');
  gr(ctx, tubX + 7, tubY + 2, 4, 2, '#889898'); // faucet

  drawPixelText(ctx, `[${interactIdx + 1}/${BATHROOM_LINES.length}] ${BATHROOM_LINES[interactIdx]?.label ?? ''}`, 4, GH - 18, '#446644', 1);
}

function drawCloset(
  ctx: CanvasRenderingContext2D,
  GW: number, GH: number,
  zoomLevel: number,
  stage: number,
  t: number
) {
  // Dark closet
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, GW * S, GH * S);

  // Clothes hanging
  for (let i = 0; i < 5; i++) {
    gr(ctx, 10 + i * 16, 8, 1, 20, '#555');
    gr(ctx, 7 + i * 16, 8, 8, 2, '#333');
    gr(ctx, 6 + i * 16, 10, 10, 18, i % 2 === 0 ? '#334466' : '#663344');
  }

  // Boxes stacked
  for (let b = 0; b < 3; b++) {
    gr(ctx, GW - 30, GH - 20 - b * 12, 20, 12, '#6b4226');
    gr(ctx, GW - 28, GH - 18 - b * 12, 16, 2, '#8B5a30');
  }

  // THE BOOK
  if (stage >= 1) {
    const bookScale = Math.min(zoomLevel, 3);
    const bookW = Math.floor(GW * 0.4 * bookScale);
    const bookH = Math.floor(GH * 0.6 * bookScale);
    const bookX = Math.floor(GW / 2) - Math.floor(bookW / 2);
    const bookY = Math.floor(GH * 0.1);

    // Book body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(bookX * S, bookY * S, bookW * S, bookH * S);
    // Spine highlight
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(bookX * S, bookY * S, 4 * S, bookH * S);
    // Pages
    ctx.fillStyle = '#fffff0';
    ctx.fillRect((bookX + bookW - 6) * S, (bookY + 2) * S, 6 * S, (bookH - 4) * S);
    // Bookmark
    ctx.fillStyle = '#c41e3a';
    ctx.fillRect((bookX + bookW - 10) * S, bookY * S, 4 * S, 14 * S);

    // Title text on book
    if (zoomLevel > 0.5) {
      const txS = Math.max(1, Math.floor(bookScale));
      const tx = bookX + 6;
      const ty = bookY + 8;
      drawPixelText(ctx, 'INTRO TO', tx, ty, '#ffe0b0', txS);
      drawPixelText(ctx, 'BIOINFORMATICS', tx, ty + 10 * txS, '#ffe0b0', txS);
    }

    if (stage >= 2 && zoomLevel < 1.5) {
      const subTx = Math.floor(GW / 2) - 40;
      const subTy = Math.floor(bookY + bookH + 4);
      if (subTy < GH - 10) {
        drawPixelText(ctx, 'VOLUME 1 OF 12', subTx, subTy, '#ffaaaa', 1);
      }
    }

    if (stage >= 3) {
      drawPixelText(ctx, '4500 PAGES', Math.floor(GW / 2) - 30, Math.floor(GH * 0.88), '#ff8888', 1);
    }

    // ── Cosmic zoom stage: planet orbiting + heat death ──
    if (zoomLevel > 1.5) {
      const cosmicAlpha = Math.min(1, (zoomLevel - 1.5) / 1.0);
      // Starfield background
      ctx.globalAlpha = cosmicAlpha * 0.6;
      for (let s2 = 0; s2 < 60; s2++) {
        const sx = (s2 * 137) % GW;
        const sy = (s2 * 73) % GH;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx * S, sy * S, 1, 1);
      }
      ctx.globalAlpha = cosmicAlpha;

      // Orbiting planet
      const orbAngle = t * 0.8;
      const orbRX = Math.floor(bookW * 0.55);
      const orbRY = Math.floor(bookH * 0.35);
      const planetX = Math.floor(GW / 2) + Math.floor(Math.cos(orbAngle) * orbRX);
      const planetY = Math.floor(GH / 2) + Math.floor(Math.sin(orbAngle) * orbRY);
      // Planet body
      gr(ctx, planetX - 4, planetY - 4, 8, 8, '#3355aa');
      gr(ctx, planetX - 3, planetY - 3, 6, 6, '#4466cc');
      gr(ctx, planetX - 2, planetY - 4, 4, 2, '#7799ee'); // highlight
      // Planet ring
      const ringW = 14;
      ctx.globalAlpha = cosmicAlpha * 0.5;
      ctx.fillStyle = '#8899aa';
      ctx.fillRect((planetX - ringW / 2) * S, (planetY - 1) * S, ringW * S, 1 * S);
      ctx.globalAlpha = cosmicAlpha;

      // Heat death text (at extreme zoom)
      if (zoomLevel > 2.3) {
        const heatAlpha = Math.min(1, (zoomLevel - 2.3) / 0.5);
        ctx.globalAlpha = heatAlpha * cosmicAlpha;
        const heatY = Math.floor(GH * 0.05);
        drawPixelText(ctx, 'HEAT DEATH OF THE UNIVERSE', Math.floor(GW / 2) - 55, heatY, '#334', 1);
        drawPixelText(ctx, '(estimated 10^100 years from now)', Math.floor(GW / 2) - 65, heatY + 8, '#223', 1);
        ctx.globalAlpha = cosmicAlpha;
      }
    }
    ctx.globalAlpha = 1;
  }
}

function drawDNATunnel(
  ctx: CanvasRenderingContext2D,
  tx: number, ty: number,
  tw: number, th: number,
  t: number,
  glowLevel: number
) {
  // Outer glow ring
  ctx.fillStyle = `rgba(0,255,80,${0.15 * glowLevel})`;
  ctx.fillRect((tx - 8) * S, (ty - 4) * S, (tw + 16) * S, (th + 8) * S);

  ctx.fillStyle = `rgba(0,200,60,${0.25 * glowLevel})`;
  ctx.fillRect((tx - 4) * S, (ty - 2) * S, (tw + 8) * S, (th + 4) * S);

  // Black inside
  ctx.fillStyle = '#000';
  ctx.fillRect(tx * S, ty * S, tw * S, th * S);

  // DNA double helix inside tunnel
  const steps = 20;
  for (let s = 0; s < steps; s++) {
    const prog = s / steps;
    const angle = prog * Math.PI * 4 + t * 2;
    const cx = tx + Math.floor(tw / 2);
    const cy = ty + Math.floor(th / 2);
    const rx = Math.floor(tw * 0.35 * Math.cos(angle));
    const ry = Math.floor(th * 0.4 * Math.sin(angle * 0.5));

    gr(ctx, cx + rx - 1, cy + ry - 1, 2, 2, '#4444ff');
    gr(ctx, cx - rx - 1, cy - ry - 1, 2, 2, '#aa00ff');

    // Rungs
    if (s % 3 === 0) {
      const minX = Math.min(cx + rx, cx - rx);
      const maxX = Math.max(cx + rx, cx - rx);
      for (let rx2 = minX; rx2 <= maxX; rx2++) {
        gr(ctx, rx2, cy + ry, 1, 1, '#00ff88');
      }
    }
  }

  // Green border
  ctx.fillStyle = `rgba(0,255,80,${0.8 * glowLevel})`;
  ctx.fillRect(tx * S, ty * S, tw * S, 2);
  ctx.fillRect(tx * S, (ty + th - 1) * S, tw * S, 2);
  ctx.fillRect(tx * S, ty * S, 2, th * S);
  ctx.fillRect((tx + tw - 1) * S, ty * S, 2, th * S);
}

function drawComputerScreen(
  ctx: CanvasRenderingContext2D,
  sx: number, sy: number,
  sw: number, sh: number,
  phase: number, t: number
) {
  // Screen background
  gr(ctx, sx, sy, sw, sh, '#0a0a1a');

  if (phase === 0) {
    // Boot up flicker
    const flicker = Math.sin(t * 20) > 0;
    if (flicker) {
      gr(ctx, sx + 1, sy + 1, sw - 2, sh - 2, '#001a00');
      drawPixelText(ctx, 'LOADING...', sx + 3, sy + sh / 2 - 3, '#00ff44', 1);
    }
  } else if (phase >= 1) {
    // Email client
    gr(ctx, sx + 1, sy + 1, sw - 2, 5, '#1a1a44');
    drawPixelText(ctx, 'INBOX', sx + 3, sy + 2, '#8888ff', 1);

    const emails = [
      { from: 'SPAM', subj: 'YOU WON MILLION', read: true, glow: false },
      { from: 'WORK', subj: 'SUBMIT TIMESHEET', read: true, glow: false },
      { from: 'DR.HENRY LACKS', subj: 'YOU HAVE POTENTIAL.', read: false, glow: true },
    ];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const ey = sy + 8 + i * 9;
      const bg = i === 2 && phase >= 2
        ? `rgba(0,255,80,${0.2 + Math.sin(t * 3) * 0.1})`
        : (email.read ? 'rgba(0,0,0,0)' : 'rgba(0,0,60,0.5)');
      if (bg !== 'rgba(0,0,0,0)') {
        ctx.fillStyle = bg;
        ctx.fillRect((sx + 1) * S, ey * S, (sw - 2) * S, 8 * S);
      }
      const color = email.glow && phase >= 2
        ? (Math.sin(t * 4) > 0 ? '#00ff88' : '#88ffaa')
        : (email.read ? '#555566' : '#aaaadd');
      drawPixelText(ctx, email.from + ': ' + email.subj, sx + 3, ey + 1, color, 1);
      if (email.read) {
        // Strikethrough
        ctx.fillStyle = '#334';
        ctx.fillRect((sx + 3) * S, (ey + 3) * S, (sw - 6) * S, 1);
      }
    }
  }

  if (phase >= 3) {
    // Email open — exact content from Game Design Bible
    gr(ctx, sx, sy, sw, sh, '#050510');
    // Header bar
    gr(ctx, sx + 1, sy + 1, sw - 2, 4, '#0a0a22');
    drawPixelText(ctx, 'FROM: dr.h.lacks@biobit.edu', sx + 2, sy + 2, '#6666bb', 1);
    drawPixelText(ctx, 'SUBJ: [no subject]', sx + 2, sy + 7, '#555588', 1);
    gr(ctx, sx + 1, sy + 12, sw - 2, 1, '#1a1a33');
    drawPixelText(ctx, 'I heard you need help.', sx + 2, sy + 14, '#cccccc', 1);
    drawPixelText(ctx, 'Everyone does.', sx + 2, sy + 20, '#cccccc', 1);
    drawPixelText(ctx, 'Click the link.', sx + 2, sy + 26, '#cccccc', 1);
    drawPixelText(ctx, '-H', sx + 2, sy + 32, '#888888', 1);
    // The link — pulsing blue
    const linkColor2 = `rgba(80,120,255,${0.7 + Math.sin(t * 4) * 0.3})`;
    ctx.fillStyle = linkColor2;
    ctx.fillRect((sx + 2) * S, (sy + 38) * S, 14 * S, 6 * S);
    drawPixelText(ctx, 'START', sx + 4, sy + 39, '#ffffff', 1);
  }
}

function drawSuckAnimation(
  ctx: CanvasRenderingContext2D,
  GW: number, GH: number,
  progress: number,
  t: number,
  avatar: AvatarConfig,
  _distort: number
) {
  // Monitor (suction point)
  const monX = Math.floor(GW * 0.75) + 14;
  const monY = Math.floor(GH * 0.38) - 20;

  // ── Phase 0 (0–0.35): Desk grab + finger slip ──────────────────────────────
  // Player tries to hold on to desk edge while being pulled
  if (progress < 0.35) {
    const gripPhase = progress / 0.35;
    // Player at desk edge, arm extended (finger on desk)
    const playerX = Math.floor(GW * 0.4) + Math.floor(gripPhase * 20);
    const playerY = Math.floor(GH * 0.55);
    drawPlayer(ctx, playerX, playerY, avatar, 'right', Math.floor(t * 4));
    // Desk edge — player gripping it
    gr(ctx, playerX + 10, playerY + 8, 16, 3, '#5a3e1a'); // desk edge
    gr(ctx, playerX + 11, playerY + 7, 4, 2, '#f4c08a'); // finger on edge
    // Slip marks at end of phase 0
    if (gripPhase > 0.8) {
      const slipA = (gripPhase - 0.8) / 0.2;
      gr(ctx, playerX + 11, playerY + 6, Math.floor(slipA * 8), 1, '#e0a060'); // slip trail
    }
    // Suction vortex starting at monitor
    const vortexA = gripPhase * 0.3;
    ctx.globalAlpha = vortexA;
    gr(ctx, monX - 4, monY - 4, 8, 8, '#00ffcc');
    ctx.globalAlpha = 1;
  }

  // ── Phase 1 (0.35–0.65): RGB channel split + floating furniture ────────────
  if (progress >= 0.35 && progress < 0.85) {
    const midPhase = (progress - 0.35) / 0.5;
    const splitAmt = Math.floor(midPhase * 8);

    // RGB channel split effect — draw player 3 times offset in R/G/B
    const playerX = Math.floor(GW * 0.4) + Math.floor(midPhase * (monX - Math.floor(GW * 0.4)) * 0.6);
    const playerY = Math.floor(GH * 0.55) - Math.floor(midPhase * 20);

    // Red channel (left offset)
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.7;
    ctx.save();
    ctx.translate(-splitAmt * S, 0);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(playerX * S, playerY * S, 12 * S, 18 * S);
    ctx.restore();
    // Green channel (center)
    ctx.save();
    ctx.fillStyle = '#00ff00';
    ctx.fillRect((playerX + 1) * S, playerY * S, 10 * S, 18 * S);
    ctx.restore();
    // Blue channel (right offset)
    ctx.save();
    ctx.translate(splitAmt * S, 0);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect((playerX + 2) * S, playerY * S, 10 * S, 18 * S);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // Draw the actual player on top (slightly transparent)
    ctx.globalAlpha = 0.85;
    drawPlayer(ctx, playerX, playerY, avatar, 'right', Math.floor(t * 10));
    ctx.globalAlpha = 1;

    // Floating books — pulled toward monitor
    const bookPositions = [
      { startX: 5, startY: 40, seed: 0 },
      { startX: 8, startY: 35, seed: 3 },
      { startX: 3, startY: 45, seed: 7 },
    ];
    for (const bk of bookPositions) {
      const bProgress = Math.min(1, midPhase * 1.4);
      const bx = Math.floor(bk.startX + (monX - bk.startX) * Math.pow(bProgress, 1.5));
      const by = Math.floor(bk.startY + (monY - bk.startY) * Math.pow(bProgress, 1.5));
      const bScale = Math.max(0.1, 1 - bProgress * 0.8);
      ctx.save();
      ctx.translate((bx + 6) * S, (by + 4) * S);
      ctx.rotate(bk.seed + midPhase * Math.PI * 1.5);
      ctx.scale(bScale, bScale);
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(-4 * S, -5 * S, 8 * S, 10 * S);
      ctx.fillStyle = '#fffff0';
      ctx.fillRect(2 * S, -4 * S, 2 * S, 8 * S);
      ctx.restore();
    }

    // Chair floating (heavy — lags behind)
    const chairProgress = Math.min(1, midPhase * 0.9);
    const chairX = Math.floor(GW * 0.42 + (monX - GW * 0.42) * Math.pow(chairProgress, 2));
    const chairY = Math.floor(GH * 0.7 + (monY - GH * 0.7) * Math.pow(chairProgress, 2));
    const chairScale = Math.max(0.1, 1 - chairProgress * 0.85);
    ctx.save();
    ctx.translate((chairX + 8) * S, (chairY + 8) * S);
    ctx.rotate(midPhase * Math.PI * 2);
    ctx.scale(chairScale, chairScale);
    ctx.fillStyle = '#5a3e1a';
    ctx.fillRect(-8 * S, -4 * S, 16 * S, 8 * S); // seat
    ctx.fillRect(-8 * S, -10 * S, 3 * S, 6 * S); // back
    ctx.fillRect(5 * S, -10 * S, 3 * S, 6 * S);
    ctx.restore();

    // Suction vortex rings
    for (let r = 0; r < 6; r++) {
      const rp = (midPhase * 2 + r / 6) % 1;
      const ringR = Math.floor(Math.min(GW, GH) * 0.4 * (1 - rp));
      const alpha = (1 - rp) * 0.5 * midPhase;
      if (alpha > 0.01 && ringR > 1) {
        ctx.globalAlpha = alpha;
        for (let a2 = 0; a2 < 16; a2++) {
          const angle = (a2 / 16) * Math.PI * 2 + midPhase * 4;
          const px2 = monX + Math.floor(Math.cos(angle) * ringR);
          const py2 = monY + Math.floor(Math.sin(angle) * ringR);
          ctx.fillStyle = '#00ffcc';
          ctx.fillRect(px2 * S, py2 * S, 2 * S, 2 * S);
        }
        ctx.globalAlpha = 1;
      }
    }
  }

  // ── Phase 2 (0.65–0.85): Player sucked in — shrinking fast ─────────────────
  if (progress >= 0.65 && progress < 0.85) {
    const endPhase = (progress - 0.65) / 0.2;
    const slideX = Math.floor(GW * 0.4) + Math.floor((monX - Math.floor(GW * 0.4)) * Math.pow(endPhase, 1.5));
    const slideY = Math.floor(GH * 0.55) + Math.floor((monY - Math.floor(GH * 0.55)) * Math.pow(endPhase, 1.5));
    const pScale = Math.max(0.05, 1 - endPhase * 0.95);
    ctx.save();
    ctx.translate(slideX * S, slideY * S);
    ctx.scale(pScale, pScale);
    ctx.translate(-6 * S, -9 * S);
    drawPlayer(ctx, 0, 0, avatar, 'right', Math.floor(t * 14));
    ctx.restore();
  }

  // ── Phase 3 (0.85–1.0): White CRACK flash ──────────────────────────────────
  if (progress >= 0.85) {
    const crackPhase = (progress - 0.85) / 0.15;
    // Flash
    ctx.fillStyle = `rgba(255,255,255,${Math.pow(crackPhase, 0.5)})`;
    ctx.fillRect(0, 0, GW * S, GH * S);
    // "CRACK" pixel text radiating outward
    if (crackPhase < 0.6) {
      const cAlpha = 1 - crackPhase / 0.6;
      const cScale = 1 + Math.floor(crackPhase * 8);
      ctx.save();
      ctx.translate(monX * S, monY * S);
      ctx.scale(cScale, cScale);
      drawPixelText(ctx, 'CRACK', -15, -4, `rgba(0,255,204,${cAlpha})`, 1);
      ctx.restore();
    }
    // Crack lines radiating from monitor
    ctx.globalAlpha = 1 - crackPhase;
    const crackColors = ['#00ffcc', '#44aaff', '#ff88ff'];
    for (let cl = 0; cl < 8; cl++) {
      const angle = (cl / 8) * Math.PI * 2 + 0.2;
      const len = Math.floor(crackPhase * 50 + 5);
      const ex = monX + Math.floor(Math.cos(angle) * len);
      const ey = monY + Math.floor(Math.sin(angle) * len);
      for (let step = 0; step < len; step++) {
        const fx = monX + Math.floor(Math.cos(angle) * step);
        const fy = monY + Math.floor(Math.sin(angle) * step);
        ctx.fillStyle = crackColors[cl % crackColors.length];
        ctx.fillRect(fx * S, fy * S, S, S);
      }
      void ex; void ey;
    }
    ctx.globalAlpha = 1;
  }
}

function drawVoid(
  ctx: CanvasRenderingContext2D,
  GW: number, GH: number,
  t: number,
  avatar: AvatarConfig,
  enzymeX: number,
  enzymeWalkFrame: number,
  enzymeWalking: boolean,
  showTunnel: boolean,
  tunnelGlow: number
) {
  // ── Deep void background ──
  ctx.fillStyle = '#030308';
  ctx.fillRect(0, 0, GW * S, GH * S);

  // Radial depth gradient from center
  const cx2 = GW * S / 2, cy2 = GH * S / 2;
  const vg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.max(GW, GH) * S * 0.7);
  vg.addColorStop(0, 'rgba(20,10,60,0.5)');
  vg.addColorStop(0.5, 'rgba(5,3,20,0.3)');
  vg.addColorStop(1, 'transparent');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, GW * S, GH * S);

  // Starfield — tiny pinprick stars
  for (let p = 0; p < 120; p++) {
    const px = Math.floor(((p * 137 + 17) % GW));
    const py = Math.floor(((p * 59 + 11) % GH));
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.4 + p * 0.7));
    ctx.fillStyle = `rgba(180,200,255,${(twinkle * 0.5).toFixed(2)})`;
    ctx.fillRect(px * S, py * S, p % 7 === 0 ? 2 : 1, p % 7 === 0 ? 2 : 1);
  }

  // Floating DNA base letters drifting upward
  const dnaChars = ['A','T','G','C'];
  for (let d = 0; d < 18; d++) {
    const dx = Math.floor((d * 113 + 5) % GW);
    const dy = Math.floor(((d * 47 + t * 6) % GH));
    const alpha = 0.08 + 0.06 * Math.sin(t * 0.6 + d);
    ctx.globalAlpha = alpha;
    drawPixelText(ctx, dnaChars[d % 4], dx, dy, '#4488ff', 1);
  }
  ctx.globalAlpha = 1;

  // Slow concentric void rings
  for (let r = 1; r <= 4; r++) {
    const rr = (r / 4) * Math.min(GW, GH) * 0.45 + Math.sin(t * 0.2 + r) * 4;
    const ringAlpha = 0.04 + 0.03 * Math.sin(t * 0.3 + r * 0.8);
    ctx.strokeStyle = `rgba(100,80,200,${ringAlpha.toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx2, cy2, rr * S, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Ground line (player stands on a faint suggestion of a floor)
  const playerY = Math.floor(GH * 0.55);
  ctx.strokeStyle = 'rgba(80,60,160,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, (playerY + 45) * S); ctx.lineTo(GW * S, (playerY + 45) * S); ctx.stroke();

  // Player in center
  const playerX = Math.floor(GW * 0.4);
  drawPlayer(ctx, playerX, playerY, avatar, 'right', 0);

  // Enzyme
  drawEnzyme(ctx, enzymeX, playerY + 4, enzymeWalkFrame, enzymeWalking ? 'happy' : 'sitting');

  // DNA Tunnel (void phase right side)
  if (showTunnel) {
    const tunX = GW - 50;
    const tunY = Math.floor(GH * 0.3);
    drawDNATunnel(ctx, tunX, tunY, 40, 50, t, tunnelGlow);
  }
}

// ─── Choice Screen ────────────────────────────────────────────────────────────

function drawChoice(
  ctx: CanvasRenderingContext2D,
  GW: number, GH: number,
  selected: number,
  t: number,
  avatar: AvatarConfig,
  enzymeX: number,
  enzymeWalkFrame: number,
  tunnelGlow: number
) {
  // Void background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, GW * S, GH * S);

  // Player
  const playerX = Math.floor(GW * 0.35);
  const playerY = Math.floor(GH * 0.5);
  drawPlayer(ctx, playerX, playerY, avatar, 'right', 0);

  // Enzyme (possibly annoyed)
  drawEnzyme(ctx, enzymeX, playerY + 4, enzymeWalkFrame, selected === 1 ? 'annoyed' : 'happy');

  // Tunnel on right
  const tunX = GW - 50;
  const tunY = Math.floor(GH * 0.3);
  drawDNATunnel(ctx, tunX, tunY, 40, 50, t, tunnelGlow);

  // Buttons
  const btnY = Math.floor(GH * 0.75);
  const yesX = Math.floor(GW * 0.25) - 18;
  const noX = Math.floor(GW * 0.6) - 12;

  // YES button
  const yesGlow = selected === 0 ? (Math.sin(t * 4) + 1) / 2 : 0;
  ctx.fillStyle = `rgba(0,200,60,${0.3 + yesGlow * 0.3})`;
  ctx.fillRect((yesX - 2) * S, (btnY - 2) * S, 44 * S, 18 * S);
  gr(ctx, yesX, btnY, 40, 14, selected === 0 ? '#00cc44' : '#115522');
  drawPixelText(ctx, "YES - LET'S GO", yesX + 3, btnY + 4, '#ffffff', 1);

  // NO button
  gr(ctx, noX, btnY, 30, 14, selected === 1 ? '#555' : '#333');
  drawPixelText(ctx, 'NO', noX + 7, btnY + 4, selected === 1 ? '#fff' : '#888', 1);

  // Arrow pointing to selected
  const arrowX = selected === 0 ? yesX - 6 : noX - 6;
  drawPixelText(ctx, '>', arrowX, btnY + 4, '#ffdd44', 1);
}

// ─── Dialogue Data (outside component to avoid re-render issues) ──────────────

const DARKNESS_LINES = [
  { speaker: "MOM'S VOICE", text: "You know what your problem is?" },
  { speaker: "MOM'S VOICE", text: "You don't try." },
  { speaker: "MOM'S VOICE", text: "Your cousin Jeffrey got into a science fair. JEFFERY." },
  { speaker: "MOM'S VOICE", text: "You know what Jeffrey had that you don't?" },
  { speaker: "MOM'S VOICE", text: "COMMITMENT." },
  { speaker: "MOM'S VOICE", text: "Also, he could code." },
  { speaker: "MOM'S VOICE", text: "Also his science project worked." },
  { speaker: "MOM'S VOICE", text: "Also he didn't eat my good cereal." },
] as const;

const KITCHEN_LINES: { speaker: string; text: string; isDevil?: boolean; isDevilScreen?: boolean; shakeHigh?: boolean }[] = [
  { speaker: 'MOM', text: "YOU ARE GOING TO THAT SCIENCE FAIR IF I HAVE TO BUILD THE PROJECT MYSELF.", shakeHigh: true },
  { speaker: 'MOM', text: "NOW GO UPSTAIRS. CODE. LEARN. BECOME SOMEONE." },
  { speaker: 'MOM', text: "Also put your dish in the sink." },
  { speaker: 'MOM', text: '*turns slowly to face camera*', isDevil: true },
  { speaker: 'YOU', text: "...okay.", isDevilScreen: true },
  { speaker: '', text: '' },
];

const BLOCKED_EXIT_LINE = { speaker: 'MOM', text: "WHERE DO YOU THINK YOU'RE GOING." };

const MOMS_ROOM_ITEMS = [
  { label: "Mom's Diary Vol. 47: Today's Grievances", text: "Long list of parental concerns. #47 is 'child can't code'. #48 is 'too much gaming'. #49 is 'ate leftover pasta without asking'." },
  { label: "JEFFERY'S ACHIEVEMENTS (trophy cabinet)", text: "Full shelf. Your name space is empty except for a sticky note: 'Potential (pending)'" },
  { label: "Photo on the wall", text: "This was before I knew about the cereal situation." },
];

const BATHROOM_LINES = [
  { label: 'Mirror', text: "You look at yourself. You look fine. This doesn't help." },
  { label: 'Medicine cabinet', text: "Cold medicine, heartburn pills, and a book titled 'How to Parent a Disappointment'." },
];
const BEDROOM_LINES = [{ speaker: 'YOU', text: "Maybe I should grab my coding textbooks..." }];
const CLOSET_LINES = [
  { speaker: 'YOU', text: "There's the coding book in bioinformatics!" },
  { speaker: 'YOU', text: "Man, frick this." },
];
const COMPUTER_LINES = [
  { speaker: 'YOU', text: "Let's see what's online..." },
  { speaker: 'YOU', text: "An email? From... dr.h.lacks@biobit.edu? The name sounds... familiar somehow..." },
  { speaker: 'YOU', text: "This is obviously a phishing email. I'm not falling for—" },
  { speaker: 'YOU', text: "...okay." }, // link clicked itself
];
const VOID_DIALOGUES = [
  { speaker: 'NARRATOR', text: 'This is the Void.', sub: 'It is not nothing. Nothing is too simple for what this is.' },
  { speaker: 'NARRATOR', text: 'This is the space between understanding.', sub: 'You have been here a while. You did not notice.' },
  { speaker: 'ENZYME', text: 'MROW!!', sub: "*(Oh FINALLY. I've been sitting here for three days.)*" },
  { speaker: 'ENZYME', text: 'Mrew mrew mrew.', sub: '*(Three days is forever when you\'re a cat. Just so you know.)*' },
  { speaker: 'ENZYME', text: '...Mrr.', sub: '*(He stretches, tail curling.)*' },
  { speaker: 'ENZYME', text: 'Meow.', sub: "*(I'm Enzyme. I'll be accompanying you. Non-negotiable. I've already decided.)*" },
  { speaker: 'ENZYME', text: 'Meow meow?', sub: "*(Don't you want to ask why a cat is in the Void?)*" },
  { speaker: 'ENZYME', text: 'Mrrr. Meow.', sub: "*(Smart. It's a long answer and I don't fully know anyway.)*" },
  { speaker: 'ENZYME', text: 'Meow meow meow.', sub: '*(This is BioBit. You\'re about to learn an enormous amount of biology.)*' },
  { speaker: 'ENZYME', text: 'Meow. Meow meow. Meow meow meow meow.', sub: '*(Four realms. Four mentors. One cat who will be very judgmental.)*' },
  { speaker: 'ENZYME', text: '!!', sub: '*(He looks at a portal that has opened behind you.)*' },
  { speaker: 'ENZYME', text: 'Meow. Meow!', sub: "*(There's a portal. Go through it.)*" },
];

const ENZYME_YEET_DIALOGUE = 'Meow meow meow... These brainrotted kids don\'t wanna learn code...';

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function IntroEngine({ onComplete }: Props) {
  const avatar = useGameStore((s) => s.avatar);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<IntroState>({
    phase: 'darkness',
    dialogueIdx: 0,
    dialogueText: '',
    dialogueProgress: 0,
    dialogueTyping: false,
    dialogueTimer: 0,
    playerX: 0,
    playerY: 0,
    playerDir: 'right',
    walkFrame: 0,
    walkTimer: 0,
    momFrame: 0,
    momShake: 0,
    cameraX: 0,
    zoomLevel: 1,
    zoomDir: 1,
    suckProgress: 0,
    suckDone: false,
    enzymeX: 0,
    enzymeDir: 'left',
    enzymeWalking: false,
    enzymeWalkFrame: 0,
    shakeX: 0,
    shakeY: 0,
    shakeTimer: 0,
    tunnelGlow: 0,
    fadeAlpha: 1,
    fading: false,
    fadeTarget: 0,
    fadeCallback: null,
    _fadeDuration: 1,
    _fadeTime: 0,
    t: 0,
    keys: {},
    phaseTimer: 0,
    closetZoomStage: 0,
    devilEyeMode: false,
    suckFurnitureDistort: 0,
    choiceSelected: 0,
    freeRoam: false,
    kitchenExitBlocked: false,
    kitchenBlockTimer: 0,
    nearDesk: false,
    nearBookshelf: false,
    nearCloset: false,
    nearComputer: false,
    inMomsRoom: false,
    interactDialogue: false,
    upstairsSubPhase: 'hall',
    momsRoomItemIdx: 0,
    bathroomInteractIdx: 0,
    textbookFalling: false,
    textbookFallY: 0,
    computerPhase: 0,
    computerEmailOpen: false,
    computerLinkClicked: false,
    void_enzymeDialogueIdx: 0,
    void_dialogueTimer: 0,
    autoAdvanceTimer: 0,
  });
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const startDialogue = useCallback((text: string) => {
    const s = stateRef.current;
    s.dialogueText = text;
    s.dialogueProgress = 0;
    s.dialogueTyping = true;
    s.dialogueTimer = 0;
  }, []);

  const fadeToBlack = useCallback((duration: number, callback: () => void) => {
    const s = stateRef.current;
    s.fading = true;
    s.fadeAlpha = 0;
    s.fadeTarget = 1;
    s.fadeCallback = callback;
    s._fadeDuration = duration;
    s._fadeTime = 0;
  }, []);

  const fadeIn = useCallback((duration: number) => {
    const s = stateRef.current;
    s.fading = true;
    s.fadeAlpha = 1;
    s.fadeTarget = 0;
    s._fadeDuration = duration;
    s._fadeTime = 0;
    s.fadeCallback = null;
  }, []);

  const initPhase = useCallback((phase: IntroPhase) => {
    const s = stateRef.current;
    s.phase = phase;
    s.phaseTimer = 0;
    s.dialogueIdx = 0;
    s.dialogueText = '';
    s.dialogueProgress = 0;
    s.dialogueTyping = false;
    s.freeRoam = false;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const GW = Math.floor(canvas.width / S);
    const GH = Math.floor(canvas.height / S);

    if (phase === 'darkness') {
      s.fadeAlpha = 0;
      startDialogue(DARKNESS_LINES[0].text);
      s.dialogueTyping = true;
    } else if (phase === 'kitchen') {
      s.playerX = Math.floor(GW * 0.5);
      s.playerY = Math.floor(GH * 0.65); // start near bottom of kitchen floor
      s.playerDir = 'up';
      s.cameraX = 0;
      s.devilEyeMode = false;
      fadeIn(1.5);
      startDialogue(KITCHEN_LINES[0].text);
    } else if (phase === 'upstairs') {
      s.playerX = Math.floor(GW * 0.45);
      s.playerY = Math.floor(GH * 0.55); // start in middle of hallway corridor
      s.playerDir = 'up';
      s.upstairsSubPhase = 'hall';
      fadeIn(1.0);
    } else if (phase === 'bedroom') {
      // Start at the desk (top-right corner of room) — player is at the laptop
      s.playerX = Math.floor(GW * 0.82) - 14;
      s.playerY = Math.floor(GH * 0.18) + 14; // just below the desk
      s.playerDir = 'down';
      fadeIn(1.0);
      startDialogue(BEDROOM_LINES[0].text);
    } else if (phase === 'closet') {
      s.zoomLevel = 0;
      s.closetZoomStage = 0;
      s.playerX = Math.floor(GW * 0.45);
      s.playerY = Math.floor(GH * 0.5);
      fadeIn(0.5);
    } else if (phase === 'computer') {
      s.computerPhase = 0;
      s.computerEmailOpen = false;
      s.computerLinkClicked = false;
      s.freeRoam = false;
      startDialogue(COMPUTER_LINES[0].text);
    } else if (phase === 'sucked-in') {
      s.suckProgress = 0;
      s.suckDone = false;
      s.suckFurnitureDistort = 0;
      s.fadeAlpha = 0;
    } else if (phase === 'void') {
      s.enzymeX = GW + 10;
      s.enzymeWalking = true;
      s.enzymeDir = 'left';
      s.void_enzymeDialogueIdx = -1;
      s.void_dialogueTimer = 0;
      s.tunnelGlow = 0;
      fadeIn(1.0);
    } else if (phase === 'choice') {
      s.choiceSelected = 0;
      s.enzymeX = Math.floor(GW * 0.5);
      s.enzymeWalking = false;
    }
  }, [startDialogue, fadeIn]);

  const advanceDialogue = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const GW = Math.floor(canvas.width / S);
    const GH = Math.floor(canvas.height / S);

    if (s.dialogueTyping && s.dialogueProgress < s.dialogueText.length) {
      // Skip typewriter
      s.dialogueProgress = s.dialogueText.length;
      return;
    }

    if (s.phase === 'darkness') {
      const nextIdx = s.dialogueIdx + 1;
      if (nextIdx < DARKNESS_LINES.length) {
        s.dialogueIdx = nextIdx;
        if (nextIdx === 1) {
          s.shakeTimer = 0.5;
        }
        startDialogue(DARKNESS_LINES[nextIdx].text);
      } else {
        // Darkness done → kitchen
        s.dialogueText = '';
        fadeToBlack(0.5, () => initPhase('kitchen'));
      }
      return;
    }

    if (s.phase === 'kitchen') {
      const nextIdx = s.dialogueIdx + 1;
      if (nextIdx < KITCHEN_LINES.length) {
        s.dialogueIdx = nextIdx;
        const line = KITCHEN_LINES[nextIdx];

        if (line.shakeHigh) {
          s.shakeTimer = 1.2;
          startDialogue(line.text);
        } else if (line.isDevil) {
          s.devilEyeMode = false;
          startDialogue(line.text);
        } else if (line.isDevilScreen) {
          s.devilEyeMode = true;
          startDialogue(line.text);
        } else if (line.text === '') {
          // Free roam
          s.freeRoam = true;
          s.dialogueText = '';
          s.devilEyeMode = false;
        } else {
          startDialogue(line.text);
        }
      }
      return;
    }

    if (s.phase === 'upstairs') {
      if (s.upstairsSubPhase === 'momsroom') {
        const nextIdx = s.momsRoomItemIdx + 1;
        if (nextIdx < MOMS_ROOM_ITEMS.length) {
          s.momsRoomItemIdx = nextIdx;
          startDialogue(MOMS_ROOM_ITEMS[nextIdx].text);
        } else {
          // Done reading, back to hall
          s.upstairsSubPhase = 'hall';
          s.freeRoam = true;
          s.playerX = 40;
          s.dialogueText = '';
        }
        return;
      }
      if (s.upstairsSubPhase === 'bathroom') {
        const nextIdx = s.bathroomInteractIdx + 1;
        if (nextIdx < BATHROOM_LINES.length) {
          s.bathroomInteractIdx = nextIdx;
          startDialogue(BATHROOM_LINES[nextIdx].text);
        } else {
          // Done, back to hall
          s.upstairsSubPhase = 'hall';
          s.freeRoam = true;
          s.playerX = Math.floor(GW * 0.8);
          s.dialogueText = '';
        }
        return;
      }
      if (s.upstairsSubPhase === 'yourroom') {
        initPhase('bedroom');
      }
      return;
    }

    if (s.phase === 'bedroom') {
      s.freeRoam = true;
      s.dialogueText = '';
      return;
    }

    if (s.phase === 'closet') {
      if (s.closetZoomStage === 0) {
        s.closetZoomStage = 1;
        startDialogue(CLOSET_LINES[0].text);
      } else {
        // Start zoom
        s.closetZoomStage = 2;
        s.zoomDir = 1;
      }
      return;
    }

    if (s.phase === 'computer') {
      const nextIdx = s.dialogueIdx + 1;
      if (nextIdx < COMPUTER_LINES.length) {
        s.dialogueIdx = nextIdx;
        if (nextIdx === 1) s.computerPhase = 1;
        if (nextIdx === 2) s.computerPhase = 2;
        if (nextIdx === 3) s.computerPhase = 3;
        startDialogue(COMPUTER_LINES[nextIdx].text);
      } else {
        // Clicked
        s.computerPhase = 3;
        s.computerLinkClicked = true;
        s.autoAdvanceTimer = 2;
      }
      return;
    }

    if (s.phase === 'void') {
      const nextIdx = s.void_enzymeDialogueIdx + 1;
      if (nextIdx < VOID_DIALOGUES.length) {
        s.void_enzymeDialogueIdx = nextIdx;
        startDialogue(VOID_DIALOGUES[nextIdx].text);
        if (nextIdx === VOID_DIALOGUES.length - 1) {
          s.tunnelGlow = 0.5;
        }
      } else {
        initPhase('choice');
      }
      return;
    }
  }, [startDialogue, fadeToBlack, initPhase]);

  const handleChoice = useCallback((yes: boolean) => {
    const s = stateRef.current;
    if (yes) {
      s.enzymeWalking = true;
      s.enzymeDir = 'right';
      s.freeRoam = false;
      setTimeout(() => {
        fadeToBlack(1.0, () => {
          s.phase = 'complete';
          onCompleteRef.current();
        });
      }, 1500);
    } else {
      // Enzyme picks you up and throws you in
      s.choiceSelected = 1;
      s.enzymeWalking = true;
      s.enzymeDir = 'left';
      // Show yeet dialogue, then fade
      setTimeout(() => {
        startDialogue(ENZYME_YEET_DIALOGUE);
      }, 600);
      setTimeout(() => {
        fadeToBlack(1.5, () => {
          s.phase = 'complete';
          onCompleteRef.current();
        });
      }, 4000);
    }
  }, [fadeToBlack, startDialogue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const s = stateRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      s.keys[e.code] = true;

      const advance = e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ';

      if (s.phase === 'choice') {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') s.choiceSelected = 0;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') s.choiceSelected = 1;
        if (advance) handleChoice(s.choiceSelected === 0);
        return;
      }

      if (s.phase === 'bedroom' && s.freeRoam) {
        if (e.code === 'KeyE') {
          if (s.nearCloset) {
            s.freeRoam = false;
            fadeToBlack(0.5, () => initPhase('closet'));
          } else if (s.nearComputer) {
            s.freeRoam = false;
            initPhase('computer');
          } else if (s.nearBookshelf) {
            startDialogue("These books are all about underwater basket weaving. Useless.");
          }
        }
      }

      if (s.phase === 'upstairs' && s.freeRoam) {
        if (e.code === 'KeyE') {
          // handled via proximity
        }
      }

      if (advance && s.dialogueText) {
        advanceDialogue();
        return;
      }

      if (s.phase === 'computer' && s.computerPhase === 3 && e.code === 'KeyE') {
        s.computerLinkClicked = true;
        s.autoAdvanceTimer = 0.5;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      s.keys[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Init first phase
    initPhase('darkness');

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;
      s.t += dt;
      s.phaseTimer += dt;

      const ctx = canvas.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(loop); return; }

      const GW = Math.floor(canvas.width / S);
      const GH = Math.floor(canvas.height / S);
      const floorY = Math.floor(GH * 0.62) - 22;

      // ── Update fade ──
      if (s.fading) {
        s._fadeTime = (s._fadeTime ?? 0) + dt;
        const dur = s._fadeDuration ?? 1;
        const progress = Math.min(s._fadeTime / dur, 1);
        if (s.fadeTarget === 1) {
          s.fadeAlpha = progress;
        } else {
          s.fadeAlpha = 1 - progress;
        }
        if (progress >= 1) {
          s.fadeAlpha = s.fadeTarget;
          s.fading = false;
          if (s.fadeCallback) {
            const cb = s.fadeCallback;
            s.fadeCallback = null;
            cb();
          }
        }
      }

      // ── Update shake ──
      if (s.shakeTimer > 0) {
        s.shakeTimer -= dt;
        s.shakeX = (Math.random() * 16 - 8) | 0;
        s.shakeY = (Math.random() * 16 - 8) | 0;
      } else {
        s.shakeX = 0;
        s.shakeY = 0;
      }

      // ── Update typewriter ──
      if (s.dialogueTyping && s.dialogueText) {
        s.dialogueTimer += dt;
        const charsPerSec = 25;
        s.dialogueProgress = Math.min(s.dialogueText.length, s.dialogueTimer * charsPerSec);
        if (s.dialogueProgress >= s.dialogueText.length) {
          s.dialogueTyping = false;
        }
      }

      // ── Update walk frame ──
      s.walkTimer += dt;
      if (s.walkTimer > 0.12) {
        s.walkTimer = 0;
        s.walkFrame = (s.walkFrame + 1) % 4;
        if (s.enzymeWalking) s.enzymeWalkFrame = (s.enzymeWalkFrame + 1) % 4;
      }

      // ── Mom frame ──
      s.momFrame = Math.floor(s.t * 8) % 4;

      // ── Tunnel glow pulse ──
      s.tunnelGlow = Math.min(1, s.tunnelGlow + dt * 0.5);

      // ── Auto advance ──
      if (s.autoAdvanceTimer > 0) {
        s.autoAdvanceTimer -= dt;
        if (s.autoAdvanceTimer <= 0) {
          s.autoAdvanceTimer = 0;
          if (s.phase === 'computer' && s.computerLinkClicked) {
            fadeToBlack(0.5, () => initPhase('sucked-in'));
          }
        }
      }

      // ── Phase-specific updates ──

      if (s.phase === 'darkness') {
        if (s.phaseTimer > 2 && !s.dialogueText) {
          startDialogue(DARKNESS_LINES[0].text);
        }
      }

      if (s.phase === 'kitchen' && s.freeRoam) {
        // 4-directional movement
        const speed = 1.5;
        let moved = false;
        if ((s.keys['ArrowLeft'] || s.keys['KeyA']) && s.playerX > 8) {
          s.playerX -= speed; s.playerDir = 'left'; moved = true;
        }
        if ((s.keys['ArrowRight'] || s.keys['KeyD']) && s.playerX < GW - 18) {
          s.playerX += speed; s.playerDir = 'right'; moved = true;
        }
        if ((s.keys['ArrowUp'] || s.keys['KeyW']) && s.playerY > 14) {
          s.playerY -= speed; s.playerDir = 'up'; moved = true;
        }
        if ((s.keys['ArrowDown'] || s.keys['KeyS']) && s.playerY < GH - 16) {
          s.playerY += speed; s.playerDir = 'down'; moved = true;
        }
        if (moved) s.walkTimer = (s.walkTimer + dt * 8) % 4;

        // Stair trigger: bottom-right corner of kitchen (top-down: south-east)
        const kitchenStairX = GW - 24;
        const kitchenStairY = GH - 18;
        if (s.playerX > kitchenStairX && s.playerY > kitchenStairY) {
          s.freeRoam = false;
          fadeToBlack(0.8, () => initPhase('upstairs'));
        }

        // Left exit (blocked — front door, top-left)
        if (s.playerX < 10 && !s.kitchenExitBlocked) {
          s.kitchenExitBlocked = true;
          s.playerX = 12;
          s.shakeTimer = 0.5;
          startDialogue(BLOCKED_EXIT_LINE.text);
          s.kitchenBlockTimer = 2;
        }
        if (s.kitchenBlockTimer > 0) {
          s.kitchenBlockTimer -= dt;
          if (s.kitchenBlockTimer <= 0) s.kitchenExitBlocked = false;
        }
      }

      if (s.phase === 'upstairs' && s.upstairsSubPhase === 'hall') {
        if (!s.freeRoam) s.freeRoam = true;
        const speed = 1.5;
        // 4-directional movement within hallway corridor
        if ((s.keys['ArrowLeft'] || s.keys['KeyA']) && s.playerX > 8) {
          s.playerX -= speed; s.playerDir = 'left';
        }
        if ((s.keys['ArrowRight'] || s.keys['KeyD']) && s.playerX < GW - 18) {
          s.playerX += speed; s.playerDir = 'right';
        }
        // Up/down movement clamped to hallway depth (y 12..GH-12)
        if ((s.keys['ArrowUp'] || s.keys['KeyW']) && s.playerY > 14) {
          s.playerY -= speed; s.playerDir = 'up';
        }
        if ((s.keys['ArrowDown'] || s.keys['KeyS']) && s.playerY < GH - 14) {
          s.playerY += speed; s.playerDir = 'down';
        }

        // Door zones in north wall — player enters by walking up (y < 18) near door
        const doorSpacing = Math.floor(GW / 4);
        const momsRoomCX   = doorSpacing;
        const yourRoomCX   = doorSpacing * 2;
        const bathroomCX   = doorSpacing * 3;
        const nearDoor = (cx: number) => Math.abs(s.playerX - cx) < 16;

        // E key to enter — or walking up into a door
        const enteringDoor = s.playerY < 18 || s.keys['KeyE'];
        if (enteringDoor) {
          if (nearDoor(momsRoomCX)) {
            s.upstairsSubPhase = 'momsroom';
            s.momsRoomItemIdx = 0;
            s.freeRoam = false;
            startDialogue(MOMS_ROOM_ITEMS[0].text);
          } else if (nearDoor(bathroomCX)) {
            s.upstairsSubPhase = 'bathroom';
            s.bathroomInteractIdx = 0;
            s.freeRoam = false;
            startDialogue(BATHROOM_LINES[0].text);
          } else if (nearDoor(yourRoomCX)) {
            s.upstairsSubPhase = 'yourroom';
            s.freeRoam = false;
            startDialogue(BEDROOM_LINES[0].text);
          }
        }
      }

      if (s.phase === 'upstairs' && s.upstairsSubPhase === 'momsroom') {
        // Handled by advanceDialogue
      }
      if (s.phase === 'upstairs' && s.upstairsSubPhase === 'bathroom') {
        // Handled by advanceDialogue
      }

      if (s.phase === 'bedroom' && s.freeRoam) {
        const speed = 1.5;
        // Full 4-directional movement — walls are at y<12 and y>GH-12, x<8, x>GW-8
        if ((s.keys['ArrowLeft'] || s.keys['KeyA']) && s.playerX > 8) {
          s.playerX -= speed; s.playerDir = 'left';
        }
        if ((s.keys['ArrowRight'] || s.keys['KeyD']) && s.playerX < GW - 18) {
          s.playerX += speed; s.playerDir = 'right';
        }
        if ((s.keys['ArrowUp'] || s.keys['KeyW']) && s.playerY > 12) {
          s.playerY -= speed; s.playerDir = 'up';
        }
        if ((s.keys['ArrowDown'] || s.keys['KeyS']) && s.playerY < GH - 14) {
          s.playerY += speed; s.playerDir = 'down';
        }

        // Proximity checks (top-down positions)
        const deskX = Math.floor(GW * 0.82) - 14;
        const deskY = Math.floor(GH * 0.18);
        const shelfX = 8, shelfY = 46;
        const closetX2 = GW - 14, closetY2 = Math.floor(GH * 0.38);

        s.nearDesk = Math.abs(s.playerX - deskX) < 22 && Math.abs(s.playerY - deskY) < 20;
        s.nearBookshelf = Math.abs(s.playerX - shelfX) < 22 && Math.abs(s.playerY - shelfY) < 24;
        s.nearCloset = Math.abs(s.playerX - closetX2) < 22 && Math.abs(s.playerY - closetY2) < 24;
        s.nearComputer = Math.abs(s.playerX - deskX) < 16 && Math.abs(s.playerY - deskY) < 16;
      }

      if (s.phase === 'closet') {
        s.phaseTimer += 0; // already incremented

        if (s.closetZoomStage === 0 && s.phaseTimer > 1) {
          s.closetZoomStage = 1;
          startDialogue(CLOSET_LINES[0].text);
        }

        if (s.closetZoomStage >= 2) {
          s.zoomLevel = Math.min(s.zoomLevel + dt * 0.8, 3);
          if (s.zoomLevel > 1 && s.closetZoomStage < 3) s.closetZoomStage = 3;
          if (s.zoomLevel > 2 && s.closetZoomStage < 4) {
            s.closetZoomStage = 4;
          }
          if (s.zoomLevel >= 3 && !s.dialogueText) {
            startDialogue(CLOSET_LINES[1].text);
            s.closetZoomStage = 5;
          }
        }

        if (s.closetZoomStage === 5 && !s.dialogueTyping && s.dialogueProgress >= s.dialogueText.length && s.phaseTimer > 4) {
          // Zoom back
          s.closetZoomStage = 6;
          s.zoomLevel = 3;
          s.zoomDir = -1;
        }

        if (s.closetZoomStage === 6) {
          s.zoomLevel = Math.max(s.zoomLevel - dt * 4, 0);
          if (s.zoomLevel <= 0) {
            fadeToBlack(0.5, () => initPhase('bedroom'));
          }
        }
      }

      if (s.phase === 'computer') {
        if (s.phaseTimer > 0.5 && s.computerPhase === 0 && !s.dialogueTyping && s.phaseTimer < 1) {
          // Already started in initPhase
        }
      }

      if (s.phase === 'sucked-in') {
        s.suckProgress = Math.min(s.suckProgress + dt * 0.35, 1);
        if (s.suckProgress >= 1 && !s.suckDone) {
          s.suckDone = true;
          fadeToBlack(0.3, () => initPhase('void'));
        }
      }

      if (s.phase === 'void') {
        // Enzyme walks in
        const playerX = Math.floor(GW * 0.4);
        if (s.enzymeWalking && s.enzymeDir === 'left') {
          s.enzymeX -= dt * 30;
          if (s.enzymeX <= playerX + 16) {
            s.enzymeWalking = false;
            s.enzymeX = playerX + 16;
            s.void_enzymeDialogueIdx = 0;
            startDialogue(VOID_DIALOGUES[0].text);
          }
        }

        if (s.void_enzymeDialogueIdx === VOID_DIALOGUES.length - 1 && !s.enzymeWalking) {
          // Enzyme walks toward tunnel
          if (s.enzymeX < GW - 45) {
            s.enzymeWalking = true;
            s.enzymeDir = 'right';
          }
        }

        if (s.enzymeDir === 'right' && s.enzymeWalking) {
          s.enzymeX += dt * 25;
          if (s.enzymeX > GW - 46) {
            s.enzymeWalking = false;
          }
        }
      }

      if (s.phase === 'choice') {
        if (s.choiceSelected === 1) {
          // Enzyme walks toward player
          const playerX = Math.floor(GW * 0.35);
          if (s.enzymeX > playerX + 10) {
            s.enzymeX -= dt * 40;
            s.enzymeWalking = true;
            s.enzymeDir = 'left';
          }
        }
      }

      // ── Draw ──
      ctx.save();
      ctx.translate(s.shakeX, s.shakeY);

      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Phase rendering ──
      if (s.phase === 'darkness') {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (s.phase === 'kitchen') {
        if (!s.devilEyeMode) {
          drawKitchen(ctx, GW, GH, s.t);
          // Mom at dining table (top-down: drawn from above)
          const tableX = Math.floor(GW * 0.28);
          const tableY = Math.floor(GH * 0.38);
          const momState = s.dialogueIdx === 0 || s.dialogueIdx === 2 ? 'angry' : s.dialogueIdx === 1 || s.dialogueIdx === 3 ? 'idle' : 'angry';
          drawMomTopDown(ctx, tableX - 12, tableY - 8, avatar.skinTone, momState as 'idle' | 'angry' | 'talking', s.momFrame);
          // Player (top-down sprite)
          drawPlayerTopDown(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, s.playerDir, s.walkFrame);

          if (s.freeRoam) {
            drawPixelText(ctx, 'WASD MOVE  E INTERACT', Math.floor(GW / 2) - 38, GH - 8, '#888888', 1);
          }
        } else {
          drawDevilEyes(ctx, canvas.width, canvas.height, s.t, s.playerX, s.playerY, avatar);
        }
      }

      if (s.phase === 'upstairs') {
        if (s.upstairsSubPhase === 'hall' || s.upstairsSubPhase === 'yourroom') {
          drawUpstairs(ctx, GW, GH, s.t);
          drawPlayerTopDown(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, s.playerDir, s.walkFrame);
          if (s.freeRoam) {
            drawPixelText(ctx, 'WASD MOVE  W/UP ENTER ROOM', Math.floor(GW / 2) - 46, GH - 8, '#888888', 1);
          }
        } else if (s.upstairsSubPhase === 'momsroom') {
          drawMomsRoom(ctx, GW, GH, s.momsRoomItemIdx);
          drawPlayerTopDown(ctx, Math.floor(GW * 0.5), Math.floor(GH * 0.55), avatar, 'up', 0);
          drawPixelText(ctx, 'SPACE to continue', Math.floor(GW / 2) - 30, GH - 8, '#666688', 1);
        } else if (s.upstairsSubPhase === 'bathroom') {
          drawBathroom(ctx, GW, GH, s.t, s.bathroomInteractIdx);
          drawPlayerTopDown(ctx, Math.floor(GW * 0.5), Math.floor(GH * 0.55), avatar, 'up', 0);
          drawPixelText(ctx, 'SPACE to continue', Math.floor(GW / 2) - 30, GH - 8, '#666688', 1);
        }
      }

      if (s.phase === 'bedroom') {
        drawBedroom(ctx, GW, GH, s.t);
        drawPlayerTopDown(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, s.playerDir, s.walkFrame);
        if (s.freeRoam) {
          drawPixelText(ctx, 'WASD MOVE  E INTERACT', Math.floor(GW / 2) - 38, GH - 8, '#888888', 1);
          if (s.nearCloset) drawPixelText(ctx, '[E] OPEN CLOSET', GW - 32, Math.floor(GH * 0.38) + 32, '#ffdd44', 1);
          if (s.nearComputer) drawPixelText(ctx, '[E] USE COMPUTER', Math.floor(GW * 0.82) - 28, Math.floor(GH * 0.18) + 22, '#ffdd44', 1);
          if (s.nearBookshelf) drawPixelText(ctx, '[E] READ', 8, 46 - 8, '#ffdd44', 1);
        }
      }

      if (s.phase === 'closet') {
        drawCloset(ctx, GW, GH, s.zoomLevel, s.closetZoomStage, s.t);
        if (s.closetZoomStage < 2) {
          drawPlayerTopDown(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, 'up', s.walkFrame);
        }
        // Exclamation mark
        if (s.closetZoomStage === 1) {
          gr(ctx, Math.floor(s.playerX) + 4, Math.floor(s.playerY) - 8, 3, 6, '#ffdd00');
        }
      }

      if (s.phase === 'computer') {
        drawBedroom(ctx, GW, GH, s.t);
        // Player at desk (top-down)
        const deskX = Math.floor(GW * 0.82) - 22;
        const deskY2 = Math.floor(GH * 0.18) + 14;
        drawPlayerTopDown(ctx, deskX, deskY2, avatar, 'up', s.walkFrame);

        // Computer screen content (inside monitor top-down)
        const screenX = Math.floor(GW * 0.82) - 36;
        const screenY = Math.floor(GH * 0.18) + 2;
        drawComputerScreen(ctx, screenX, screenY, 20, 8, s.computerPhase, s.t);

        if (s.computerPhase === 3 && !s.computerLinkClicked) {
          drawPixelText(ctx, 'E CLICK LINK', screenX - 2, screenY + 20, '#ffdd44', 1);
        }
      }

      if (s.phase === 'sucked-in') {
        drawBedroom(ctx, GW, GH, s.t);
        drawSuckAnimation(ctx, GW, GH, s.suckProgress, s.t, avatar, s.suckFurnitureDistort);
      }

      if (s.phase === 'void') {
        drawVoid(
          ctx, GW, GH, s.t, avatar,
          Math.floor(s.enzymeX), s.enzymeWalkFrame, s.enzymeWalking,
          s.void_enzymeDialogueIdx >= VOID_DIALOGUES.length - 1,
          s.tunnelGlow
        );
      }

      if (s.phase === 'choice') {
        drawChoice(
          ctx, GW, GH,
          s.choiceSelected, s.t, avatar,
          Math.floor(s.enzymeX), s.enzymeWalkFrame,
          s.tunnelGlow
        );
      }

      // ── Dialogue box ──
      if (s.dialogueText && s.phase !== 'complete') {
        const lineData = (() => {
          if (s.phase === 'darkness') return DARKNESS_LINES[s.dialogueIdx];
          if (s.phase === 'kitchen') return KITCHEN_LINES[s.dialogueIdx];
          if (s.phase === 'void') return VOID_DIALOGUES[s.void_enzymeDialogueIdx] ?? { speaker: '', text: '', sub: '' };
          return { speaker: '', text: s.dialogueText };
        })();

        const sub = (lineData as { sub?: string }).sub;
        const blink = Math.floor(s.t * 2) % 2 === 0;
        drawDialogue(ctx, lineData?.speaker ?? '', s.dialogueText, s.dialogueProgress, canvas.width, canvas.height, blink, sub);
      }

      // ── Fade overlay ──
      if (s.fadeAlpha > 0) {
        ctx.fillStyle = `rgba(0,0,0,${s.fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [avatar, initPhase, startDialogue, fadeToBlack, fadeIn, advanceDialogue, handleChoice]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'block', imageRendering: 'pixelated', cursor: 'none', zIndex: 100 }}
    />
  );
}
