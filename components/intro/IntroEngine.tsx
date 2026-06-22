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
  playerDir: 'left' | 'right';
  walkFrame: number;
  walkTimer: number;
  momFrame: number;
  momShake: number;
  cameraX: number;
  zoomLevel: number;
  zoomDir: number;
  suckProgress: number;
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

function drawDevilEyes(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  t: number,
  playerGX: number, playerGY: number,
  avatar: AvatarConfig
) {
  const GW = Math.floor(cw / S);
  const GH = Math.floor(ch / S);

  // Background swirl
  ctx.fillStyle = '#0a0005';
  ctx.fillRect(0, 0, cw, ch);

  // Dark energy tendrils
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + t * 0.3;
    const len = 40 + Math.sin(t * 2 + i) * 10;
    for (let d = 0; d < len; d++) {
      const nx = Math.floor(GW / 2 + Math.cos(angle) * d);
      const ny = Math.floor(GH / 2 + Math.sin(angle) * d);
      if (nx >= 0 && nx < GW && ny >= 0 && ny < GH) {
        const fade = 1 - d / len;
        const r = Math.floor(80 * fade);
        gr(ctx, nx, ny, 1, 1, `rgb(${r},0,${Math.floor(r * 0.3)})`);
      }
    }
  }

  // Left eye
  const eyeLX = Math.floor(GW * 0.28);
  const eyeRX = Math.floor(GW * 0.58);
  const eyeY = Math.floor(GH * 0.3);
  const eyeW = Math.floor(GW * 0.2);
  const eyeH = Math.floor(GH * 0.35);

  for (let eye = 0; eye < 2; eye++) {
    const ex = eye === 0 ? eyeLX : eyeRX;

    // White of eye
    ctx.fillStyle = '#ffeeee';
    ctx.fillRect(ex * S, eyeY * S, eyeW * S, eyeH * S);

    // Iris (red)
    const irisX = ex + Math.floor(eyeW * 0.15);
    const irisY = eyeY + Math.floor(eyeH * 0.1);
    const irisW = Math.floor(eyeW * 0.7);
    const irisH = Math.floor(eyeH * 0.8);
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(irisX * S, irisY * S, irisW * S, irisH * S);

    // Slit pupil
    const pupX = ex + Math.floor(eyeW * 0.45);
    const pupY = eyeY + Math.floor(eyeH * 0.05);
    ctx.fillStyle = '#000000';
    ctx.fillRect(pupX * S, pupY * S, 4 * S, eyeH * S);

    // Eye glow
    const glowPulse = (Math.sin(t * 3) + 1) / 2;
    ctx.fillStyle = `rgba(200,0,0,${0.1 + glowPulse * 0.15})`;
    ctx.fillRect((ex - 3) * S, (eyeY - 3) * S, (eyeW + 6) * S, (eyeH + 6) * S);

    // Flames above eye
    for (let f = 0; f < 5; f++) {
      const fx = ex + f * Math.floor(eyeW / 5);
      const fh = 4 + Math.floor(Math.sin(t * 4 + f) * 3);
      for (let frow = 0; frow < fh; frow++) {
        const fcolor = frow < fh / 2 ? '#ff4400' : '#ff8800';
        gr(ctx, fx, eyeY - fh + frow, 2, 1, fcolor);
      }
    }
  }

  // Caption: "The Mom-Demon of Incomplete Science Projects"
  const caption = 'The Mom-Demon of Incomplete Science Projects';
  const capY = Math.floor(GH * 0.68);
  gr(ctx, 2, capY - 2, GW - 4, 10, '#0a0005');
  drawPixelText(ctx, caption, Math.floor(GW / 2) - Math.floor(caption.length * 3.5), capY, '#cc3344', 1);

  // Tiny horrified player at bottom center
  const px = Math.floor(GW / 2) - 6;
  const py = Math.floor(GH * 0.78);
  drawPlayer(ctx, px, py, avatar, 'right', 0);

  // Player look: camera → mom → camera (text toggle)
  const lookPhase = Math.floor(t * 0.8) % 3;
  const lookText = lookPhase === 0 ? '(looks at camera)' : lookPhase === 1 ? '(looks at mom-demon)' : '(looks at camera again)';
  drawPixelText(ctx, lookText, Math.floor(GW / 2) - Math.floor(lookText.length * 3.5), py + 26, '#888888', 1);
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

function drawKitchen(ctx: CanvasRenderingContext2D, GW: number, GH: number, cameraX: number, t: number) {
  const ox = -Math.floor(cameraX);
  const floorY = Math.floor(GH * 0.62);

  // ── Undertale-dark background ──
  // Wall (dark warm tone — visible but moody)
  ctx.fillStyle = '#2a1e12';
  ctx.fillRect(0, 0, GW * S, floorY * S);
  // Wall texture: subtle vertical stripe variation
  for (let wx = 0; wx < GW; wx += 8) {
    ctx.fillStyle = wx % 16 === 0 ? 'rgba(0,0,0,0.06)' : 'rgba(255,200,100,0.02)';
    ctx.fillRect(wx * S, 0, 8 * S, floorY * S);
  }

  // Baseboard strip
  gr(ctx, 0 + ox, floorY - 5, GW + 16, 5, '#3a2814');
  gr(ctx, 0 + ox, floorY - 6, GW + 16, 1, '#4e3820');

  // Dark wood floor planks
  for (let fy = floorY; fy < GH; fy += 6) {
    ctx.fillStyle = fy % 12 === 0 ? '#281a08' : '#221408';
    ctx.fillRect(0, fy * S, GW * S, 6 * S);
    // Plank lines
    for (let fx = 0; fx < GW; fx += 24) {
      ctx.fillStyle = '#160d04';
      ctx.fillRect((fx + ox) * S, fy * S, S, 6 * S);
    }
    // Grain highlight
    ctx.fillStyle = 'rgba(255,180,60,0.025)';
    ctx.fillRect(0, fy * S, GW * S, 2);
  }

  // Wainscoting (dark wood paneling strip at bottom of wall)
  gr(ctx, 0 + ox, floorY - 18, GW + 16, 13, '#362410');
  gr(ctx, 0 + ox, floorY - 19, GW + 16, 1, '#4a3018');
  for (let px = 0; px < GW; px += 20) {
    gr(ctx, px + ox + 1, floorY - 17, 18, 11, '#301e0c');
    gr(ctx, px + ox + 2, floorY - 16, 16, 1, '#443018');
  }

  // Window (night — dark outside with stars)
  const winX = 40 + ox;
  const winY = 8;
  gr(ctx, winX - 2, winY - 2, 28, 24, '#4a3018'); // frame
  gr(ctx, winX, winY, 24, 20, '#091520');          // glass - night sky
  gr(ctx, winX + 11, winY, 2, 20, '#3a2410');      // divider
  // Stars
  [[3,3],[8,6],[17,4],[21,8],[6,12],[19,14]].forEach(([sx,sy]) => {
    gr(ctx, winX + sx, winY + sy, 1, 1, '#aaccff');
  });
  // Curtains
  gr(ctx, winX - 2, winY - 2, 5, 22, '#2a0a0a');
  gr(ctx, winX + 21, winY - 2, 5, 22, '#2a0a0a');
  // Warm glow from inside light hitting window top
  const wg = (Math.sin(t * 0.8) + 1) / 2;
  ctx.fillStyle = `rgba(255,180,80,${0.04 + wg * 0.02})`;
  ctx.fillRect(winX * S, winY * S, 24 * S, 20 * S);

  // Counter (dark wood, right side)
  const ctrX = GW - 70 + ox;
  gr(ctx, ctrX, 30, 70, 5, '#4a3018');    // counter surface
  gr(ctx, ctrX, 30, 70, 2, '#6a4824');    // highlight top
  gr(ctx, ctrX, 35, 70, 28, '#362410');   // cabinet body
  // Cabinet doors
  for (let c = 0; c < 3; c++) {
    gr(ctx, ctrX + c * 22 + 2, 37, 18, 24, '#3a2010');
    gr(ctx, ctrX + c * 22 + 3, 38, 16, 22, '#301a0c');
    gr(ctx, ctrX + c * 22 + 10, 48, 2, 4, '#5a3a1c'); // handle
    gr(ctx, ctrX + c * 22 + 3, 38, 16, 1, '#4a2e14'); // inner top highlight
  }

  // Refrigerator (dark steel — not white)
  const fridgeX = GW - 18 + ox;
  gr(ctx, fridgeX, 5, 16, 57, '#303030');
  gr(ctx, fridgeX + 1, 6, 14, 1, '#3e3e3e');  // highlight
  gr(ctx, fridgeX + 14, 20, 1, 10, '#222'); // handle
  gr(ctx, fridgeX + 4, 32, 8, 1, '#1a1a1a'); // divider line
  gr(ctx, fridgeX + 1, 33, 14, 1, '#181818');

  // Stove
  gr(ctx, ctrX - 22, 30, 20, 5, '#252525');
  gr(ctx, ctrX - 20, 24, 16, 6, '#1e1e1e');
  // Burner glow
  const heatPulse = (Math.sin(t * 3) + 1) / 2;
  gr(ctx, ctrX - 16, 27, 5, 2, `#${Math.floor(80 + heatPulse * 80).toString(16).padStart(2,'0')}2000` as string);
  gr(ctx, ctrX - 10, 28, 4, 2, '#301000');
  // Pot
  gr(ctx, ctrX - 14, 21, 8, 4, '#1a1a1a');
  gr(ctx, ctrX - 12, 18, 4, 3, '#222');
  gr(ctx, ctrX - 14, 21, 8, 1, '#282828');
  // Steam
  if (Math.floor(t * 4) % 2 === 0) {
    gr(ctx, ctrX - 12, 14, 1, 4, '#333');
    gr(ctx, ctrX - 10, 12, 1, 5, '#2a2a2a');
    gr(ctx, ctrX - 8, 15, 1, 3, '#333');
  }

  // Dining table (dark wood)
  const tableX = Math.floor(GW * 0.3) + ox;
  const tableY = Math.floor(GH * 0.52);
  const tableW = 60;
  gr(ctx, tableX, tableY, tableW, 8, '#5a3418'); // tabletop
  gr(ctx, tableX, tableY, tableW, 2, '#7a4a24'); // highlight
  gr(ctx, tableX, tableY + 8, tableW, 1, '#3a200e'); // shadow
  // Legs
  gr(ctx, tableX + 2, tableY + 8, 4, 12, '#3a2010');
  gr(ctx, tableX + tableW - 6, tableY + 8, 4, 12, '#3a2010');

  // Chairs
  for (let c = 0; c < 2; c++) {
    const chX = tableX + c * (tableW - 14);
    gr(ctx, chX + 2, tableY - 12, 10, 8, '#4a2c14');   // seat
    gr(ctx, chX + 2, tableY - 12, 10, 1, '#6a3c1e');   // seat highlight
    gr(ctx, chX + 2, tableY - 18, 10, 6, '#3a2010');   // back
    gr(ctx, chX + 2, tableY - 19, 10, 1, '#4e2e16');   // back highlight
    gr(ctx, chX + 3, tableY - 4, 3, 8, '#2e1a0c');     // legs
    gr(ctx, chX + 9, tableY - 4, 3, 8, '#2e1a0c');
  }

  // Wall shelf on left
  const shelfX = 8 + ox;
  gr(ctx, shelfX, 18, 30, 2, '#1e1408');
  gr(ctx, shelfX, 18, 30, 1, '#2a1c0c');
  gr(ctx, shelfX, 20, 2, 14, '#1a1006');
  gr(ctx, shelfX + 28, 20, 2, 14, '#1a1006');
  // Kitchen items on shelf
  gr(ctx, shelfX + 4, 12, 5, 8, '#1a0a0a'); // dark jar
  gr(ctx, shelfX + 5, 11, 3, 1, '#220e0e');
  gr(ctx, shelfX + 12, 13, 4, 7, '#0a1a0a'); // green jar
  gr(ctx, shelfX + 12, 12, 4, 1, '#0e220e');
  gr(ctx, shelfX + 20, 14, 6, 6, '#1a1510'); // container

  // Overhead light fixture
  const lightX = Math.floor(GW / 2) + ox;
  gr(ctx, lightX - 5, 0, 10, 4, '#1a1a18');
  gr(ctx, lightX - 3, 4, 6, 4, '#282824');
  const glow = (Math.sin(t * 0.8) + 1) / 2;
  // Warm cone of light downward
  ctx.fillStyle = `rgba(255,200,80,${0.08 + glow * 0.03})`;
  ctx.fillRect((lightX - 30) * S, 8 * S, 60 * S, 40 * S);
  ctx.fillStyle = `rgba(255,200,80,${0.04 + glow * 0.02})`;
  ctx.fillRect((lightX - 50) * S, 8 * S, 100 * S, 30 * S);
  gr(ctx, lightX - 3, 4, 6, 2, '#504840'); // glowing bulb

  // Stairs indicator on right (leading off-screen)
  const stairX = GW - 10 + ox;
  for (let ss = 0; ss < 8; ss++) {
    gr(ctx, stairX + ss, floorY + ss * 3, 12 - ss, 3, `#${(0x14 + ss * 2).toString(16)}${(0x0e + ss).toString(16)}04`);
    gr(ctx, stairX + ss, floorY + ss * 3, 12 - ss, 1, `#${(0x1e + ss * 2).toString(16)}${(0x14 + ss).toString(16)}08`);
  }
  drawPixelText(ctx, '> STAIRS', stairX - 4, floorY - 12, '#887766', 1);
}

function drawUpstairs(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number) {
  const floorY = Math.floor(GH * 0.65);

  // ── Undertale-dark hallway ──
  // Near-black purple wall
  ctx.fillStyle = '#080610';
  ctx.fillRect(0, 0, GW * S, floorY * S);

  // Dark floor
  for (let fy = floorY; fy < GH; fy += 8) {
    ctx.fillStyle = fy % 16 === 0 ? '#0d0a02' : '#0a0800';
    ctx.fillRect(0, fy * S, GW * S, 8 * S);
    // Floor grain lines
    for (let fx = 0; fx < GW; fx += 20) {
      gr(ctx, fx, fy, 1, 8, '#070500');
    }
  }

  // Baseboard
  gr(ctx, 0, floorY - 3, GW, 3, '#100c14');
  gr(ctx, 0, floorY - 4, GW, 1, '#181220');

  // Ceiling line
  gr(ctx, 0, 0, GW, 4, '#040308');
  gr(ctx, 0, 4, GW, 2, '#080612');

  // ── Three doors ──
  const doors = [
    { x: 14, label: "MOM'S ROOM", frameColor: '#1a0a10', glow: '#ff3366', open: false },
    { x: Math.floor(GW / 2) - 16, label: 'YOUR ROOM', frameColor: '#0a1020', glow: '#4488ff', open: false },
    { x: GW - 46, label: 'BATHROOM', frameColor: '#141010', glow: '#333333', open: false },
  ];

  const glowPulse = (Math.sin(t * 2) + 1) / 2;

  for (const door of doors) {
    const dh = 44;
    const dw = 26;
    // Frame outer (dark wood)
    gr(ctx, door.x - 2, floorY - dh - 2, dw + 4, dh + 2, door.frameColor);
    gr(ctx, door.x - 1, floorY - dh - 1, dw + 2, 1, '#201828'); // frame top highlight
    // Door panel (near-black)
    gr(ctx, door.x, floorY - dh, dw, dh, '#050408');
    gr(ctx, door.x + 1, floorY - dh, dw - 2, 1, '#0a0810'); // panel highlight
    // Center divider
    gr(ctx, door.x + Math.floor(dw / 2) - 1, floorY - dh + 2, 2, dh - 2, '#030206');
    // Handle
    gr(ctx, door.x + Math.floor(dw * 0.7), floorY - Math.floor(dh * 0.5), 3, 5, '#2a2030');
    gr(ctx, door.x + Math.floor(dw * 0.7), floorY - Math.floor(dh * 0.5), 3, 1, '#3a3040');
    // Color glow seeping under door
    ctx.fillStyle = `rgba(${parseInt(door.glow.slice(1,3),16)},${parseInt(door.glow.slice(3,5),16)},${parseInt(door.glow.slice(5,7),16)},${0.06 + glowPulse * 0.08})`;
    ctx.fillRect((door.x) * S, (floorY - 3) * S, dw * S, 3 * S);
    // Label above door
    drawPixelText(ctx, door.label, door.x - 2, floorY - dh - 12, '#554466', 1);
  }

  // Lock on bathroom (padlock)
  const bathX = GW - 46;
  gr(ctx, bathX + 8, floorY - 26, 8, 6, '#332200');
  gr(ctx, bathX + 9, floorY - 29, 6, 3, '#221a00');
  gr(ctx, bathX + 11, floorY - 28, 2, 2, '#080600');
  gr(ctx, bathX + 9, floorY - 26, 2, 3, '#221a00');  // shackle left
  gr(ctx, bathX + 15, floorY - 26, 2, 3, '#221a00'); // shackle right

  // Wall art / photo frames
  const photos = [Math.floor(GW * 0.22), Math.floor(GW * 0.5), Math.floor(GW * 0.77)];
  for (const pfx of photos) {
    gr(ctx, pfx - 1, 7, 18, 16, '#12101a');  // frame
    gr(ctx, pfx, 8, 16, 14, '#0a0814');       // inner
    // Abstract shapes in frame (like family photo silhouettes)
    gr(ctx, pfx + 3, 11, 3, 8, '#1a1628');
    gr(ctx, pfx + 8, 10, 3, 9, '#1e1a2c');
    gr(ctx, pfx + 3, 10, 3, 2, '#201c30');
    gr(ctx, pfx + 8, 9, 3, 2, '#241e34');
  }

  // Overhead lamp
  const lx = Math.floor(GW / 2);
  gr(ctx, lx - 4, 0, 8, 5, '#14121e');
  gr(ctx, lx - 2, 5, 4, 4, '#1c1828');
  const glowA = 0.06 + glowPulse * 0.03;
  ctx.fillStyle = `rgba(180,160,255,${glowA})`;
  ctx.fillRect((lx - 40) * S, 9 * S, 80 * S, 30 * S);
  gr(ctx, lx - 2, 5, 4, 2, '#302850'); // bulb tint
}

function drawBedroom(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number) {
  const floorY = Math.floor(GH * 0.62);

  // ── Dark bedroom (Undertale-style) ──
  // Wall: dark blue-grey but visible
  ctx.fillStyle = '#121928';
  ctx.fillRect(0, 0, GW * S, floorY * S);
  // Subtle wallpaper texture
  for (let wy = 0; wy < floorY; wy += 10) {
    ctx.fillStyle = 'rgba(100,140,255,0.025)';
    ctx.fillRect(0, wy * S, GW * S, 5 * S);
  }

  // Floor: dark wood
  for (let fy = floorY; fy < GH; fy += 7) {
    ctx.fillStyle = fy % 14 === 0 ? '#0e0b02' : '#0b0800';
    ctx.fillRect(0, fy * S, GW * S, 7 * S);
    for (let fx = 0; fx < GW; fx += 22) gr(ctx, fx, fy, 1, 7, '#080600');
  }
  gr(ctx, 0, floorY - 3, GW, 3, '#0e0c18');
  gr(ctx, 0, floorY - 4, GW, 1, '#141220');

  // Bookshelf (left wall)
  const shelfX = 4;
  const shelfY = Math.floor(GH * 0.2);
  gr(ctx, shelfX, shelfY, 2, 44, '#5a3e1a');
  gr(ctx, shelfX + 26, shelfY, 2, 44, '#5a3e1a');
  for (let shelf = 0; shelf < 3; shelf++) {
    gr(ctx, shelfX, shelfY + shelf * 14 + 13, 28, 2, '#5a3e1a');
    const bookColors = ['#c41e3a', '#1a6b3a', '#2244aa', '#aa6600', '#6a1aaa'];
    let bx = shelfX + 2;
    while (bx < shelfX + 24) {
      const bw = 3 + Math.floor(Math.abs(Math.sin(bx * 7.3)) * 3);
      gr(ctx, bx, shelfY + shelf * 14 + 1, bw, 12, bookColors[(bx + shelf) % bookColors.length]);
      bx += bw + 1;
    }
  }

  // Bed (right side)
  const bedX = Math.floor(GW * 0.55);
  const bedY = floorY - 24;
  gr(ctx, bedX, bedY, 40, 26, '#3b5a8f');
  gr(ctx, bedX + 2, bedY + 4, 36, 20, '#6b8fcf');
  gr(ctx, bedX, bedY, 40, 8, '#2a3f6a');
  // Pillow
  gr(ctx, bedX + 4, bedY + 2, 14, 5, '#f0f0f0');

  // Computer desk (far right)
  const deskX = Math.floor(GW * 0.75);
  const deskY = floorY - 18;
  gr(ctx, deskX, deskY, 28, 4, '#8B6914');
  gr(ctx, deskX + 2, deskY - 22, 24, 22, '#1a1a2e');
  gr(ctx, deskX + 4, deskY - 20, 20, 18, '#0a0a1a');
  // Monitor stand
  gr(ctx, deskX + 11, deskY - 1, 6, 3, '#333');
  // Keyboard
  gr(ctx, deskX + 2, deskY + 2, 20, 3, '#333');
  // Desk lamp
  gr(ctx, deskX + 24, deskY - 14, 2, 14, '#555');
  gr(ctx, deskX + 20, deskY - 14, 8, 2, '#555');
  gr(ctx, deskX + 22, deskY - 15, 4, 4, '#ffeeaa');

  // Closet door (center back)
  const closetX = Math.floor(GW * 0.38);
  const closetY = floorY - 50;
  gr(ctx, closetX, closetY, 30, 52, '#a07050');
  gr(ctx, closetX + 2, closetY + 2, 26, 48, '#b08060');
  gr(ctx, closetX + 14, closetY + 2, 2, 48, '#9a7050');
  gr(ctx, closetX + 10, closetY + 22, 3, 5, '#7a5030');
  gr(ctx, closetX + 17, closetY + 22, 3, 5, '#7a5030');
  // "slightly open" shadow
  gr(ctx, closetX + 28, closetY + 2, 2, 48, '#222');

  // Poster (wall, above bed)
  gr(ctx, bedX + 4, 8, 34, 22, '#111133');
  gr(ctx, bedX + 5, 9, 32, 20, '#0a0a22');
  drawPixelText(ctx, 'CODE', bedX + 8, 12, '#39ff14', 1);
  drawPixelText(ctx, 'OR', bedX + 14, 19, '#ff4444', 1);
  drawPixelText(ctx, 'DIE', bedX + 12, 25, '#ffffff', 1);

  // Overhead light
  gr(ctx, Math.floor(GW / 2) - 4, 0, 8, 3, '#ccc');
  const glow = (Math.sin(t * 1.5) + 1) / 2;
  ctx.fillStyle = `rgba(255,230,160,${0.1 + glow * 0.05})`;
  ctx.fillRect(0, 3 * S, GW * S, 20 * S);
}

function drawMomsRoom(ctx: CanvasRenderingContext2D, GW: number, GH: number, itemIdx: number) {
  const floorY = Math.floor(GH * 0.62);

  // ── Mom's room: dark warm walls ──
  ctx.fillStyle = '#100a06';
  ctx.fillRect(0, 0, GW * S, floorY * S);
  // Subtle wallpaper — tiny diamond pattern
  for (let wy = 4; wy < floorY; wy += 10) {
    for (let wx = 0; wx < GW; wx += 10) {
      ctx.fillStyle = 'rgba(120,60,20,0.04)';
      ctx.fillRect(wx * S, wy * S, 5 * S, 5 * S);
    }
  }
  // Dark floor
  for (let fy = floorY; fy < GH; fy += 7) {
    ctx.fillStyle = fy % 14 === 0 ? '#120e04' : '#0e0b02';
    ctx.fillRect(0, fy * S, GW * S, 7 * S);
  }
  gr(ctx, 0, floorY - 3, GW, 3, '#1a1006');
  gr(ctx, 0, floorY - 4, GW, 1, '#221408');

  // Bed
  const bedX = Math.floor(GW * 0.3);
  gr(ctx, bedX, floorY - 26, 38, 28, '#8B7355');
  gr(ctx, bedX + 2, floorY - 24, 34, 22, '#8b1a2a');
  gr(ctx, bedX + 4, floorY - 24, 14, 5, '#f0f0f0');
  // Pillow
  gr(ctx, bedX + 4, floorY - 24, 14, 5, '#f8f8f8');

  // ── Diary on desk (item 0) ──
  const deskX = Math.floor(GW * 0.6);
  gr(ctx, deskX, floorY - 16, 34, 4, '#6b4a1a');
  gr(ctx, deskX + 2, floorY - 28, 26, 12, '#3a1800');
  gr(ctx, deskX + 4, floorY - 26, 22, 10, '#4a2000');
  drawPixelText(ctx, 'DIARY', deskX + 5, floorY - 24, '#cc8844', 1);
  drawPixelText(ctx, 'VOL.47', deskX + 4, floorY - 18, '#aa6633', 1);
  // highlight if currently reading
  if (itemIdx === 0) {
    ctx.fillStyle = 'rgba(255,200,80,0.12)';
    ctx.fillRect((deskX - 2) * S, (floorY - 30) * S, 30 * S, 18 * S);
  }

  // ── Trophy cabinet (JEFFERY'S ACHIEVEMENTS) (item 1) ──
  const trophyX = 8;
  gr(ctx, trophyX, floorY - 50, 28, 52, '#5a3e1a');
  gr(ctx, trophyX + 1, floorY - 49, 26, 50, '#4a2e0a');
  // Label
  drawPixelText(ctx, "JEFF'S", trophyX + 2, floorY - 48, '#ffcc44', 1);
  drawPixelText(ctx, 'TROPHIES', trophyX + 1, floorY - 42, '#ffcc44', 1);
  // Trophies on shelves
  for (let sh = 0; sh < 3; sh++) {
    gr(ctx, trophyX + 2, floorY - 50 + sh * 16 + 14, 24, 1, '#3a2008');
    // Trophy shape
    const tx2 = trophyX + 4 + sh * 6;
    gr(ctx, tx2, floorY - 50 + sh * 16 + 4, 4, 6, '#ffaa00');
    gr(ctx, tx2 - 2, floorY - 50 + sh * 16 + 7, 8, 2, '#ffcc44');
    gr(ctx, tx2 + 1, floorY - 50 + sh * 16 + 9, 2, 4, '#cc8800');
    gr(ctx, tx2 - 1, floorY - 50 + sh * 16 + 12, 6, 1, '#cc8800');
  }
  // Player's name area — empty with sticky note
  gr(ctx, trophyX + 2, floorY - 18, 24, 14, '#0a0804');
  drawPixelText(ctx, 'Potential', trophyX + 3, floorY - 15, '#aaaa44', 1);
  drawPixelText(ctx, '(pending)', trophyX + 3, floorY - 9, '#888833', 1);
  if (itemIdx === 1) {
    ctx.fillStyle = 'rgba(255,200,80,0.12)';
    ctx.fillRect(trophyX * S, (floorY - 52) * S, 30 * S, 54 * S);
  }

  // ── Photo on wall (item 2) ──
  const photoX = Math.floor(GW * 0.5);
  gr(ctx, photoX, 8, 24, 18, '#2a2018');
  gr(ctx, photoX + 2, 9, 20, 16, '#1a140c');
  // Mom and baby silhouettes
  gr(ctx, photoX + 4, 12, 5, 10, '#3a2a1a');
  gr(ctx, photoX + 4, 10, 5, 3, '#3a2a1a');
  gr(ctx, photoX + 11, 14, 3, 6, '#2a1e12');
  gr(ctx, photoX + 11, 13, 3, 2, '#2a1e12');
  // "Looking proud" expression — tiny white smile dots
  gr(ctx, photoX + 5, 11, 1, 1, '#aa8866');
  gr(ctx, photoX + 7, 11, 1, 1, '#aa8866');
  if (itemIdx === 2) {
    ctx.fillStyle = 'rgba(255,200,80,0.12)';
    ctx.fillRect((photoX - 1) * S, 7 * S, 26 * S, 20 * S);
  }

  // Item labels
  drawPixelText(ctx, `[${itemIdx + 1}/${MOMS_ROOM_ITEMS.length}] ${MOMS_ROOM_ITEMS[itemIdx]?.label ?? ''}`, 4, GH - 18, '#886644', 1);
}

function drawBathroom(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number, interactIdx: number) {
  const floorY = Math.floor(GH * 0.62);

  // Tiled bathroom walls — pale greenish
  ctx.fillStyle = '#0c1210';
  ctx.fillRect(0, 0, GW * S, floorY * S);
  // Tile grid
  for (let ty = 0; ty < floorY; ty += 12) {
    for (let tx = 0; tx < GW; tx += 10) {
      ctx.strokeStyle = 'rgba(100,160,120,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(tx * S, ty * S, 10 * S, 12 * S);
    }
  }
  // Floor tiles
  for (let fy = floorY; fy < GH; fy += 8) {
    ctx.fillStyle = fy % 16 === 0 ? '#0e1208' : '#0b0f06';
    ctx.fillRect(0, fy * S, GW * S, 8 * S);
  }
  gr(ctx, 0, floorY - 3, GW, 3, '#0d150d');

  // ── Mirror above sink ──
  const mirrorX = Math.floor(GW * 0.3);
  const mirrorY = 10;
  gr(ctx, mirrorX, mirrorY, 28, 22, '#1a2a22');
  gr(ctx, mirrorX + 1, mirrorY + 1, 26, 20, '#d0e0d8'); // reflective surface
  // Reflection — player silhouette (very faint)
  ctx.globalAlpha = 0.15;
  gr(ctx, mirrorX + 8, mirrorY + 6, 12, 14, '#888888');
  ctx.globalAlpha = 1;
  // Mirror frame glow
  const mg = (Math.sin(t * 1.5) + 1) * 0.02;
  ctx.fillStyle = `rgba(200,255,220,${0.05 + mg})`;
  ctx.fillRect((mirrorX - 2) * S, (mirrorY - 2) * S, 32 * S, 26 * S);
  if (interactIdx === 0) {
    ctx.fillStyle = 'rgba(200,255,220,0.1)';
    ctx.fillRect((mirrorX - 2) * S, (mirrorY - 2) * S, 32 * S, 26 * S);
  }

  // Sink
  gr(ctx, mirrorX + 4, floorY - 20, 20, 20, '#1a2820');
  gr(ctx, mirrorX + 6, floorY - 18, 16, 14, '#0a1410');
  // Faucet
  gr(ctx, mirrorX + 13, floorY - 22, 4, 4, '#334433');
  gr(ctx, mirrorX + 14, floorY - 24, 2, 3, '#445544');

  // Medicine cabinet (right wall)
  const cabX = Math.floor(GW * 0.65);
  gr(ctx, cabX, 8, 26, 28, '#162014');
  gr(ctx, cabX + 1, 9, 24, 26, '#1e2c1a');
  drawPixelText(ctx, 'CABINET', cabX + 2, 10, '#446644', 1);
  // Little pill bottles inside
  for (let i = 0; i < 3; i++) {
    gr(ctx, cabX + 3 + i * 7, 15, 5, 10, i === 0 ? '#446688' : i === 1 ? '#884444' : '#664422');
    gr(ctx, cabX + 4 + i * 7, 14, 3, 2, '#888888');
  }
  // Highlight the mysterious book on bottom shelf
  gr(ctx, cabX + 2, 25, 22, 9, '#110e08');
  drawPixelText(ctx, '"HOW TO', cabX + 3, 26, '#886644', 1);
  drawPixelText(ctx, 'PARENT"', cabX + 3, 31, '#886644', 1);
  if (interactIdx === 1) {
    ctx.fillStyle = 'rgba(255,200,80,0.12)';
    ctx.fillRect(cabX * S, 8 * S, 26 * S, 28 * S);
  }

  // Toilet (right side)
  const toiX = GW - 28;
  gr(ctx, toiX, floorY - 22, 22, 24, '#1a2218');
  gr(ctx, toiX + 2, floorY - 24, 18, 4, '#222e20');
  gr(ctx, toiX + 4, floorY - 20, 14, 18, '#0e1810');

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
      s.playerX = Math.floor(GW * 0.45);
      s.playerY = Math.floor(GH * 0.55);
      s.playerDir = 'left';
      s.cameraX = 0;
      s.devilEyeMode = false;
      fadeIn(1.5);
      startDialogue(KITCHEN_LINES[0].text);
    } else if (phase === 'upstairs') {
      s.playerX = Math.floor(GW * 0.45);
      s.playerY = Math.floor(GH * 0.6) - 22;
      s.playerDir = 'right';
      s.upstairsSubPhase = 'hall';
      fadeIn(1.0);
    } else if (phase === 'bedroom') {
      s.playerX = Math.floor(GW * 0.15);
      s.playerY = Math.floor(GH * 0.62) - 22;
      s.playerDir = 'right';
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
        // Player movement
        const speed = 1.5;
        let moved = false;
        if ((s.keys['ArrowLeft'] || s.keys['KeyA']) && s.playerX > 10) {
          s.playerX -= speed;
          s.playerDir = 'left';
          moved = true;
        }
        if ((s.keys['ArrowRight'] || s.keys['KeyD']) && s.playerX < GW - 20) {
          s.playerX += speed;
          s.playerDir = 'right';
          moved = true;
        }
        if (moved) {
          s.walkTimer += 0; // handled above
        }

        // Check exits — stair trigger must be within movement bound (GW-20)
        const kitchenStairX = GW - 26;
        if (s.playerX > kitchenStairX) {
          // Stairs exit
          s.freeRoam = false;
          fadeToBlack(0.8, () => initPhase('upstairs'));
        }

        // Left exit check (blocked)
        if (s.playerX < 12 && !s.kitchenExitBlocked) {
          s.kitchenExitBlocked = true;
          s.playerX = 14;
          s.shakeTimer = 0.5;
          startDialogue(BLOCKED_EXIT_LINE.text);
          s.kitchenBlockTimer = 2;
        }

        if (s.kitchenBlockTimer > 0) {
          s.kitchenBlockTimer -= dt;
          if (s.kitchenBlockTimer <= 0) {
            s.kitchenExitBlocked = false;
          }
        }

        // Devil eye → advance automatically
        if (s.devilEyeMode && s.dialogueProgress >= s.dialogueText.length && s.phaseTimer > 0.3) {
          // Managed by user pressing space
        }
      }

      if (s.phase === 'upstairs' && s.upstairsSubPhase === 'hall') {
        if (!s.freeRoam) {
          s.freeRoam = true;
        }
        const speed = 1.5;
        if ((s.keys['ArrowLeft'] || s.keys['KeyA']) && s.playerX > 10) {
          s.playerX -= speed;
          s.playerDir = 'left';
        }
        if ((s.keys['ArrowRight'] || s.keys['KeyD']) && s.playerX < GW - 20) {
          s.playerX += speed;
          s.playerDir = 'right';
        }

        // Door zones — Mom's Room (far left), Your Room (center), Bathroom (far right)
        const momsRoomX = 14;
        const yourRoomX = Math.floor(GW / 2) - 16;
        const bathroomX = GW - 46;

        // E to enter rooms when near a door
        if (s.keys['KeyE']) {
          if (s.playerX < momsRoomX + 38) {
            s.upstairsSubPhase = 'momsroom';
            s.momsRoomItemIdx = 0;
            s.freeRoam = false;
            startDialogue(MOMS_ROOM_ITEMS[0].text);
          } else if (s.playerX > bathroomX - 20 && s.playerX < bathroomX + 30) {
            s.upstairsSubPhase = 'bathroom';
            s.bathroomInteractIdx = 0;
            s.freeRoam = false;
            startDialogue(BATHROOM_LINES[0].text);
          } else if (s.playerX > yourRoomX - 5 && s.playerX < yourRoomX + 40) {
            s.upstairsSubPhase = 'yourroom';
            s.freeRoam = false;
            startDialogue(BEDROOM_LINES[0].text);
          }
        }

        // Auto-enter your room if walked all the way right
        if (s.playerX > yourRoomX + 18 && !s.keys['ArrowLeft'] && !s.keys['KeyA']) {
          const nearYour = s.playerX > yourRoomX - 5 && s.playerX < yourRoomX + 40;
          if (nearYour && s.playerDir === 'right') {
            s.upstairsSubPhase = 'yourroom';
            s.freeRoam = false;
            startDialogue(BEDROOM_LINES[0].text);
          }
        }
      }

      if (s.phase === 'upstairs' && s.upstairsSubPhase === 'momsroom') {
        // Cycle through mom's room items on E/Space
      }

      if (s.phase === 'upstairs' && s.upstairsSubPhase === 'bathroom') {
        // Handled by advanceDialogue
      }

      if (s.phase === 'bedroom' && s.freeRoam) {
        const speed = 1.5;
        if ((s.keys['ArrowLeft'] || s.keys['KeyA']) && s.playerX > 10) {
          s.playerX -= speed;
          s.playerDir = 'left';
        }
        if ((s.keys['ArrowRight'] || s.keys['KeyD']) && s.playerX < GW - 20) {
          s.playerX += speed;
          s.playerDir = 'right';
        }

        // Proximity checks
        const deskX = Math.floor(GW * 0.75);
        const shelfX = 4;
        const closetX2 = Math.floor(GW * 0.38);

        s.nearDesk = Math.abs(s.playerX - deskX) < 18;
        s.nearBookshelf = Math.abs(s.playerX - shelfX) < 20;
        s.nearCloset = Math.abs(s.playerX - closetX2) < 20;
        s.nearComputer = Math.abs(s.playerX - deskX) < 14;
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
        if (s.suckProgress >= 1) {
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
          drawKitchen(ctx, GW, GH, s.cameraX, s.t);
          // Mom at table left
          const tableX = Math.floor(GW * 0.3);
          const tableY = Math.floor(GH * 0.52);
          const momState = s.dialogueIdx === 0 || s.dialogueIdx === 2 ? 'angry' : s.dialogueIdx === 1 || s.dialogueIdx === 3 ? 'idle' : 'angry';
          drawMom(ctx, tableX - 18, tableY - 34, avatar.skinTone, momState as 'idle' | 'angry' | 'talking', s.momFrame);
          // Player at table (Enzyme is NOT here — she first appears in the Void)
          drawPlayer(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, s.playerDir, s.walkFrame, s.freeRoam ? false : true);

          if (s.freeRoam) {
            drawPixelText(ctx, '< > MOVE', Math.floor(GW / 2) - 18, GH - 12, '#888888', 1);
            drawPixelText(ctx, 'E INTERACT', Math.floor(GW / 2) - 18, GH - 6, '#888888', 1);
          }
        } else {
          drawDevilEyes(ctx, canvas.width, canvas.height, s.t, s.playerX, s.playerY, avatar);
        }
      }

      if (s.phase === 'upstairs') {
        if (s.upstairsSubPhase === 'hall' || s.upstairsSubPhase === 'yourroom') {
          drawUpstairs(ctx, GW, GH, s.t);
          drawPlayer(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, s.playerDir, s.walkFrame);
          if (s.freeRoam) {
            drawPixelText(ctx, '< > MOVE  E ENTER ROOM', Math.floor(GW / 2) - 40, GH - 8, '#888888', 1);
          }
        } else if (s.upstairsSubPhase === 'momsroom') {
          drawMomsRoom(ctx, GW, GH, s.momsRoomItemIdx);
          drawPlayer(ctx, Math.floor(GW * 0.5), floorY, avatar, 'left', 0);
          drawPixelText(ctx, 'SPACE to continue', Math.floor(GW / 2) - 30, GH - 8, '#666688', 1);
        } else if (s.upstairsSubPhase === 'bathroom') {
          drawBathroom(ctx, GW, GH, s.t, s.bathroomInteractIdx);
          drawPlayer(ctx, Math.floor(GW * 0.5), floorY, avatar, 'right', 0);
          drawPixelText(ctx, 'SPACE to continue', Math.floor(GW / 2) - 30, GH - 8, '#666688', 1);
        }
      }

      if (s.phase === 'bedroom') {
        drawBedroom(ctx, GW, GH, s.t);
        drawPlayer(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, s.playerDir, s.walkFrame);
        if (s.freeRoam) {
          drawPixelText(ctx, '< > MOVE  E INTERACT', Math.floor(GW / 2) - 36, GH - 8, '#888888', 1);
          if (s.nearCloset) drawPixelText(ctx, 'E OPEN CLOSET', Math.floor(GW * 0.38) - 4, Math.floor(GH * 0.62) - 58, '#ffdd44', 1);
          if (s.nearComputer) drawPixelText(ctx, 'E USE COMPUTER', Math.floor(GW * 0.75) - 4, Math.floor(GH * 0.38) - 8, '#ffdd44', 1);
          if (s.nearBookshelf) drawPixelText(ctx, 'E READ', 6, Math.floor(GH * 0.2) - 8, '#ffdd44', 1);
        }
      }

      if (s.phase === 'closet') {
        drawCloset(ctx, GW, GH, s.zoomLevel, s.closetZoomStage, s.t);
        if (s.closetZoomStage < 2) {
          drawPlayer(ctx, Math.floor(s.playerX), Math.floor(s.playerY), avatar, 'right', s.walkFrame);
        }
        // Exclamation mark
        if (s.closetZoomStage === 1) {
          gr(ctx, Math.floor(s.playerX) + 4, Math.floor(s.playerY) - 8, 3, 6, '#ffdd00');
        }
      }

      if (s.phase === 'computer') {
        drawBedroom(ctx, GW, GH, s.t);
        // Player walking to desk
        const deskX = Math.floor(GW * 0.75) - 14;
        drawPlayer(ctx, deskX, Math.floor(GH * 0.62) - 22, avatar, 'right', s.walkFrame);

        // Computer screen content
        const screenX = Math.floor(GW * 0.75) + 4;
        const screenY = Math.floor(GH * 0.38) - 20;
        drawComputerScreen(ctx, screenX, screenY, 20, 18, s.computerPhase, s.t);

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
