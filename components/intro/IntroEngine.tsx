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
  upstairsSubPhase: 'hall' | 'momsroom' | 'yourroom';
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
  const boxH = 36;
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

  // Speaker name
  if (speaker) {
    ctx.fillStyle = '#ffdd44';
    ctx.fillRect((boxX + 2) * S, (boxY + 2) * S, (speaker.length * 7 + 4) * S, 10 * S);
    drawPixelText(ctx, speaker, boxX + 4, boxY + 3, '#111111', 1);
  }

  // Text (typewriter)
  const displayed = text.slice(0, Math.floor(progress));
  const lines = wrapText(displayed, 55);
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    drawPixelText(ctx, lines[i], boxX + 4, boxY + 16 + i * 8, '#ffffff', 1);
  }

  // Subtitle (for enzyme meow translations)
  if (subtitle) {
    drawPixelText(ctx, subtitle.slice(0, Math.floor(progress)), boxX + 4, boxY + 24, '#aaffcc', 1);
  }

  // Advance prompt
  if (blink && progress >= text.length) {
    drawPixelText(ctx, '> SPACE', boxX + boxW - 20, boxY + boxH - 8, '#888888', 1);
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

  // Hair (behind head)
  gr(ctx, gx + 1, gy, 8, 3, hair);

  // Head
  gr(ctx, gx + 2, gy + 1, 6, 6, skin);

  // Eyes
  const eyeOffset = dir === 'right' ? 4 : 1;
  gr(ctx, gx + 2 + eyeOffset, gy + 3, 1, 1, eye);
  gr(ctx, gx + 2 + eyeOffset + 2, gy + 3, 1, 1, eye);

  // Mouth
  gr(ctx, gx + 3, gy + 6, 3, 1, '#cc6655');

  // Hair style on top
  if (avatar.hairStyle === 0) {
    gr(ctx, gx + 1, gy, 8, 2, hair);
  } else if (avatar.hairStyle === 1) {
    gr(ctx, gx + 1, gy - 1, 8, 3, hair);
    gr(ctx, gx + 0, gy, 2, 4, hair);
  } else if (avatar.hairStyle === 2) {
    gr(ctx, gx + 2, gy - 2, 6, 2, hair);
    gr(ctx, gx + 1, gy, 8, 2, hair);
  } else {
    gr(ctx, gx + 1, gy, 8, 2, hair);
    gr(ctx, gx + 8, gy + 1, 2, 5, hair);
  }

  // Body
  gr(ctx, gx + 1, gy + 7, 8, 7, cloth);

  if (!sitting) {
    // Legs
    const legOffset = (walkFrame % 2 === 0) ? 0 : 1;
    gr(ctx, gx + 2, gy + 14, 3, 5, '#334455');
    gr(ctx, gx + 5, gy + 14 + legOffset, 3, 5, '#334455');
    // Feet
    gr(ctx, gx + 1, gy + 19, 4, 2, '#553322');
    gr(ctx, gx + 5, gy + 19 + (1 - legOffset), 4, 2, '#553322');
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

  // Tiny horrified player at bottom
  const px = Math.floor(GW / 2) - 6;
  const py = Math.floor(GH * 0.78);
  drawPlayer(ctx, px, py, avatar, 'right', 0);

  // HORROR text
  const horrText = 'O---OK...';
  drawPixelText(ctx, horrText, Math.floor(GW / 2) - pixelTextWidth(horrText) / 2, py + 25, '#ffffff', 1);
}

function drawEnzyme(
  ctx: CanvasRenderingContext2D,
  gx: number, gy: number,
  walkFrame: number,
  mood: 'happy' | 'annoyed' | 'sitting' = 'happy'
) {
  // Body
  gr(ctx, gx + 1, gy + 3, 6, 5, '#f5f5f5');

  // Head
  gr(ctx, gx + 1, gy, 6, 5, '#f5f5f5');

  // Ears
  gr(ctx, gx + 1, gy - 2, 2, 2, '#f5f5f5');
  gr(ctx, gx + 5, gy - 2, 2, 2, '#f5f5f5');
  gr(ctx, gx + 2, gy - 1, 1, 1, '#ffb3c1');
  gr(ctx, gx + 5, gy - 1, 1, 1, '#ffb3c1');

  // Eyes
  if (mood === 'annoyed') {
    // Angry slant
    gr(ctx, gx + 2, gy + 2, 2, 1, '#222');
    gr(ctx, gx + 5, gy + 2, 2, 1, '#222');
    gr(ctx, gx + 2, gy + 1, 1, 1, '#222');
    gr(ctx, gx + 6, gy + 1, 1, 1, '#222');
  } else {
    gr(ctx, gx + 2, gy + 2, 1, 1, '#111');
    gr(ctx, gx + 5, gy + 2, 1, 1, '#111');
  }

  // Nose
  gr(ctx, gx + 3, gy + 3, 1, 1, '#ffb3c1');

  // Tail
  gr(ctx, gx + 7, gy + 4, 2, 1, '#e0e0e0');
  gr(ctx, gx + 8, gy + 5, 1, 2, '#e0e0e0');
  gr(ctx, gx + 7, gy + 7, 2, 1, '#f5f5f5');

  // Legs (walking animation)
  if (mood !== 'sitting') {
    const legA = walkFrame % 2 === 0 ? 1 : 0;
    gr(ctx, gx + 2, gy + 8, 2, legA + 1, '#e0e0e0');
    gr(ctx, gx + 5, gy + 8, 2, (1 - legA) + 1, '#e0e0e0');
  } else {
    gr(ctx, gx + 2, gy + 8, 2, 1, '#e0e0e0');
    gr(ctx, gx + 5, gy + 8, 2, 1, '#e0e0e0');
  }
}

// ─── Scene Drawers ────────────────────────────────────────────────────────────

function drawKitchen(ctx: CanvasRenderingContext2D, GW: number, GH: number, cameraX: number, t: number) {
  const ox = -Math.floor(cameraX);

  // Wall
  ctx.fillStyle = '#f5e6c8';
  ctx.fillRect(0, 0, GW * S, GH * S);

  // Floor tiles
  const floorY = Math.floor(GH * 0.62);
  for (let tx = 0; tx < GW + 8; tx += 8) {
    for (let ty = floorY; ty < GH; ty += 8) {
      const alt = ((Math.floor(tx / 8) + Math.floor(ty / 8)) % 2 === 0);
      gr(ctx, tx + ox, ty, 8, 8, alt ? '#d4b896' : '#c8a87a');
    }
  }

  // Window
  const winX = 40 + ox;
  const winY = 12;
  gr(ctx, winX, winY, 24, 20, '#8B7355');
  gr(ctx, winX + 2, winY + 2, 20, 16, '#b3d9f2');
  // Sun
  gr(ctx, winX + 8, winY + 3, 6, 6, '#ffdd44');
  // Curtains
  gr(ctx, winX, winY, 4, 20, '#fffde0');
  gr(ctx, winX + 20, winY, 4, 20, '#fffde0');

  // Counter
  const ctrX = GW - 60 + ox;
  gr(ctx, ctrX, 34, 60, 6, '#8B7355');
  gr(ctx, ctrX, 34, 60, 3, '#d4b896');
  // Cabinets
  for (let c = 0; c < 3; c++) {
    gr(ctx, ctrX + c * 18 + 2, 40, 16, 20, '#a08060');
    gr(ctx, ctrX + c * 18 + 8, 49, 2, 4, '#7a6040');
  }

  // Refrigerator
  const fridgeX = GW - 20 + ox;
  gr(ctx, fridgeX, 10, 18, 52, '#e8e8e8');
  gr(ctx, fridgeX + 2, 12, 14, 2, '#999');
  gr(ctx, fridgeX + 15, 25, 2, 8, '#999');

  // Stove
  gr(ctx, ctrX - 20, 34, 18, 6, '#555');
  gr(ctx, ctrX - 18, 30, 14, 4, '#333');

  // Pot
  gr(ctx, ctrX - 14, 27, 8, 3, '#444');
  gr(ctx, ctrX - 12, 25, 4, 2, '#444');

  // Dining table
  const tableX = Math.floor(GW * 0.3) + ox;
  const tableY = Math.floor(GH * 0.52);
  const tableW = 60;
  const tableH = 10;
  gr(ctx, tableX, tableY, tableW, tableH, '#8B7355');
  gr(ctx, tableX, tableY, tableW, 2, '#a09070');

  // Table legs
  gr(ctx, tableX + 2, tableY + tableH, 4, 14, '#6a5040');
  gr(ctx, tableX + tableW - 6, tableY + tableH, 4, 14, '#6a5040');

  // Chairs
  for (let c = 0; c < 2; c++) {
    const chX = tableX + c * (tableW - 12);
    gr(ctx, chX + 2, tableY - 14, 10, 10, '#8B7355');
    gr(ctx, chX + 2, tableY - 20, 10, 6, '#6a5040');
    gr(ctx, chX + 3, tableY + tableH + 4, 3, 8, '#6a5040');
    gr(ctx, chX + 8, tableY + tableH + 4, 3, 8, '#6a5040');
  }

  // Overhead light
  const lightX = Math.floor(GW / 2) + ox;
  gr(ctx, lightX - 6, 0, 12, 6, '#ccc');
  const glow = (Math.sin(t * 2) + 1) / 2;
  ctx.fillStyle = `rgba(255,220,100,${0.3 + glow * 0.1})`;
  ctx.fillRect((lightX - 20) * S, 6 * S, 40 * S, 30 * S);
  gr(ctx, lightX - 6, 6, 12, 6, '#ffdd88');

  // Stairs indicator on right
  const stairX = GW - 8 + ox;
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(stairX * S, floorY * S, 12 * S, (GH - floorY) * S);
  for (let s = 0; s < 6; s++) {
    ctx.fillStyle = '#8B6535';
    ctx.fillRect((stairX + s) * S, (floorY + s * 4) * S, (12 - s) * S, 4 * S);
  }
  drawPixelText(ctx, 'STAIRS', stairX - 2, floorY - 10, '#ffffff', 1);
}

function drawUpstairs(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number) {
  // Floor
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(0, Math.floor(GH * 0.65) * S, GW * S, GH * S);

  // Wall
  ctx.fillStyle = '#d4c5a9';
  ctx.fillRect(0, 0, GW * S, Math.floor(GH * 0.65) * S);

  // Stripe wallpaper
  for (let wx = 0; wx < GW; wx += 8) {
    ctx.fillStyle = 'rgba(180,160,130,0.3)';
    ctx.fillRect(wx * S, 0, 2, Math.floor(GH * 0.65) * S);
  }

  // Doorways
  const doors = [
    { x: 10, label: "MOM'S ROOM", color: '#8B7355' },
    { x: Math.floor(GW / 2) - 14, label: 'YOUR ROOM', color: '#5a7a9a' },
    { x: GW - 44, label: 'BATHROOM', color: '#8B7355' },
  ];

  const floorY = Math.floor(GH * 0.65);
  for (const door of doors) {
    // Frame
    gr(ctx, door.x, floorY - 40, 28, 42, door.color);
    // Door opening
    gr(ctx, door.x + 2, floorY - 38, 24, 38, '#111');
    // Label
    drawPixelText(ctx, door.label, door.x, floorY - 50, '#ffffff', 1);
  }

  // Lock on bathroom
  const bathX = GW - 44;
  gr(ctx, bathX + 10, floorY - 25, 6, 5, '#ffd700');
  gr(ctx, bathX + 11, floorY - 28, 4, 3, '#ffd700');
  gr(ctx, bathX + 12, floorY - 27, 2, 2, '#333');

  // Photo frames on wall
  const photos = [Math.floor(GW * 0.2), Math.floor(GW * 0.5), Math.floor(GW * 0.75)];
  for (const px of photos) {
    gr(ctx, px, 10, 16, 14, '#8B7355');
    gr(ctx, px + 1, 11, 14, 12, '#ccc');
    // Silhouettes
    gr(ctx, px + 3, 14, 3, 8, '#555');
    gr(ctx, px + 8, 13, 3, 9, '#555');
    gr(ctx, px + 3, 13, 3, 2, '#666');
    gr(ctx, px + 8, 12, 3, 2, '#666');
  }

  // Overhead light
  gr(ctx, Math.floor(GW / 2) - 4, 0, 8, 4, '#ccc');
  const glow = (Math.sin(t * 1.5) + 1) / 2;
  ctx.fillStyle = `rgba(255,220,150,${0.15 + glow * 0.05})`;
  ctx.fillRect(0, 4 * S, GW * S, 30 * S);
}

function drawBedroom(ctx: CanvasRenderingContext2D, GW: number, GH: number, t: number) {
  const floorY = Math.floor(GH * 0.62);

  // Floor
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(0, floorY * S, GW * S, GH * S);

  // Wall
  ctx.fillStyle = '#c8d4e8';
  ctx.fillRect(0, 0, GW * S, floorY * S);

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

function drawMomsRoom(ctx: CanvasRenderingContext2D, GW: number, GH: number) {
  const floorY = Math.floor(GH * 0.62);

  ctx.fillStyle = '#c8b8a0';
  ctx.fillRect(0, 0, GW * S, floorY * S);
  ctx.fillStyle = '#7a5530';
  ctx.fillRect(0, floorY * S, GW * S, GH * S);

  // Bed
  const bedX = Math.floor(GW * 0.3);
  gr(ctx, bedX, floorY - 26, 38, 28, '#8B7355');
  gr(ctx, bedX + 2, floorY - 24, 34, 22, '#c41e3a');
  gr(ctx, bedX + 4, floorY - 24, 14, 5, '#f0f0f0');

  // Bookshelf
  const sx = GW - 34;
  gr(ctx, sx, floorY - 44, 28, 46, '#5a3e1a');
  for (let i = 0; i < 3; i++) {
    gr(ctx, sx + 2, floorY - 44 + i * 14 + 12, 24, 2, '#4a2e0a');
    drawPixelText(ctx, 'F', sx + 4 + i * 6, floorY - 44 + i * 14 + 1, '#ff4444', 1);
    drawPixelText(ctx, 'F', sx + 12 + i * 2, floorY - 44 + i * 14 + 2, '#ff6644', 1);
  }

  // Letters floating
  for (let i = 0; i < 2; i++) {
    const lx = 20 + i * 40;
    gr(ctx, lx, floorY - 34, 28, 18, '#fffde0');
    gr(ctx, lx + 2, floorY - 32, 24, 14, '#fffff0');
    drawPixelText(ctx, i === 0 ? 'GRADE: F' : 'REJECTION', lx + 2, floorY - 30, '#cc0000', 1);
  }

  // Exit door
  gr(ctx, 4, floorY - 40, 22, 42, '#8B7355');
  gr(ctx, 6, floorY - 38, 18, 38, '#111');
  drawPixelText(ctx, 'EXIT', 6, floorY - 48, '#ffffff', 1);
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
    // Email content
    gr(ctx, sx, sy, sw, sh, '#050510');
    drawPixelText(ctx, 'FROM: DR.HENRY LACKS', sx + 2, sy + 2, '#8888ff', 1);
    drawPixelText(ctx, 'SUBJ: YOU HAVE POTENTIAL.', sx + 2, sy + 8, '#aaaaff', 1);
    gr(ctx, sx + 1, sy + 13, sw - 2, 1, '#334');
    drawPixelText(ctx, "I'VE BEEN WATCHING YOU.", sx + 2, sy + 15, '#cccccc', 1);
    drawPixelText(ctx, 'I KNOW WHAT YOU CAN DO.', sx + 2, sy + 22, '#cccccc', 1);
    const linkColor = Math.sin(t * 5) > 0 ? '#00ff44' : '#00cc33';
    drawPixelText(ctx, '>> ENTER BIOBIT <<', sx + 4, sy + 30, linkColor, 1);
  }
}

function drawSuckAnimation(
  ctx: CanvasRenderingContext2D,
  GW: number, GH: number,
  progress: number,
  t: number,
  avatar: AvatarConfig,
  distort: number
) {
  // Background: room fading to white
  const bgAlpha = Math.min(1, progress * 2);
  ctx.fillStyle = `rgba(255,255,255,${bgAlpha})`;
  ctx.fillRect(0, 0, GW * S, GH * S);

  // Monitor position
  const monX = Math.floor(GW * 0.75) + 14;
  const monY = Math.floor(GH * 0.38) - 20;

  // Spiral rings
  const rings = 8;
  for (let r = 0; r < rings; r++) {
    const ringProgress = (t * 1.5 + r / rings) % 1;
    const maxR = Math.floor(Math.min(GW, GH) * 0.5 * (1 - progress * 0.5));
    const ringR = Math.floor(maxR * ringProgress);
    const alpha = (1 - ringProgress) * (1 - progress);
    if (alpha > 0 && ringR > 0) {
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      for (let a = 0; a < 32; a++) {
        const angle = (a / 32) * Math.PI * 2 + t * 2;
        const px2 = monX + Math.floor(Math.cos(angle) * ringR);
        const py2 = monY + Math.floor(Math.sin(angle) * ringR);
        ctx.fillRect(px2 * S, py2 * S, 2 * S, 2 * S);
      }
    }
  }

  // Player sliding toward monitor
  const slideX = Math.floor(GW * 0.4) + Math.floor((monX - Math.floor(GW * 0.4)) * Math.pow(progress, 2));
  const slideY = Math.floor(GH * 0.55) + Math.floor((monY - Math.floor(GH * 0.55)) * Math.pow(progress, 2));
  const playerScale = Math.max(0.1, 1 - progress * 0.7);

  ctx.save();
  ctx.translate(slideX * S, slideY * S);
  ctx.scale(playerScale, playerScale);
  ctx.translate(-6 * S, -9 * S);
  drawPlayer(ctx, 0, 0, avatar, 'right', Math.floor(t * 8));
  ctx.restore();

  // Data particles
  const particleColors = ['#0044ff', '#00ccff', '#00ff88', '#aa00ff'];
  for (let p = 0; p < 20; p++) {
    const pa = (p / 20 + t * 0.5) % 1;
    const angle = pa * Math.PI * 2 * 3 + t;
    const dist = Math.floor(60 * (1 - progress) * pa);
    const px2 = monX + Math.floor(Math.cos(angle) * dist);
    const py2 = monY + Math.floor(Math.sin(angle) * dist);
    gr(ctx, px2, py2, 1, 1, particleColors[p % particleColors.length]);
  }

  // WHOOOOSH text
  if (progress > 0.5) {
    const wAlpha = (progress - 0.5) * 2;
    ctx.fillStyle = `rgba(255,255,255,${wAlpha})`;
    const whText = 'WHOOOOSH';
    for (let ci = 0; ci < whText.length; ci++) {
      const cAngle = (ci / whText.length) * Math.PI * 2 + t * 3;
      const cr = Math.floor(30 * wAlpha);
      const cpx = monX + Math.floor(Math.cos(cAngle) * cr);
      const cpy = monY + Math.floor(Math.sin(cAngle) * cr);
      drawPixelText(ctx, whText[ci], cpx, cpy, `rgba(255,255,255,${wAlpha})`, 1);
    }
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
  // Black background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, GW * S, GH * S);

  // Floating particles
  for (let p = 0; p < 30; p++) {
    const px = Math.floor((Math.sin(p * 1.7 + t * 0.3) * 0.4 + 0.5) * GW);
    const py = Math.floor((Math.cos(p * 2.3 + t * 0.2) * 0.4 + 0.5) * GH);
    const alpha = (Math.sin(p + t * 0.5) + 1) / 2;
    ctx.fillStyle = `rgba(100,200,255,${alpha * 0.3})`;
    ctx.fillRect(px * S, py * S, 2, 2);
  }

  // Player in center
  const playerX = Math.floor(GW * 0.4);
  const playerY = Math.floor(GH * 0.55);
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
  { speaker: "MOM'S VOICE", text: "YOU'RE A FAILURE!!!!!" },
  { speaker: "MOM'S VOICE", text: "YOU DIDN'T EVEN QUALIFY FOR THE INTERNATIONAL SCIENCE FAIR..." },
  { speaker: "MOM'S VOICE", text: "...BECAUSE YOU DON'T KNOW HOW TO CODE!!!" },
] as const;

const KITCHEN_LINES: { speaker: string; text: string; isDevil?: boolean; isDevilScreen?: boolean }[] = [
  { speaker: 'MOM', text: "DON'T YOU KNOW AI IS THE FUTURE?!" },
  { speaker: 'YOU', text: "U-uh... I was... gonna study... eventually...?" },
  { speaker: 'MOM', text: "EVENTUALLY?! THE FUTURE IS NOW! You HAVE to learn to code!" },
  { speaker: 'YOU', text: "Okay but like... I'm kinda... mid." },
  { speaker: 'MOM', text: '*turns slowly to face camera*', isDevil: true },
  { speaker: 'YOU', text: "o---ok... i suppose i'll go try to learn...", isDevilScreen: true },
  { speaker: '', text: '' },
];

const BLOCKED_EXIT_LINE = { speaker: 'MOM', text: "WHERE DO YOU THINK YOU'RE GOING?! UPSTAIRS! NOW!" };
const UPSTAIRS_MOMS_ROOM_LINES = [
  { speaker: 'MOM', text: "Your grade: F. As expected." },
  { speaker: 'MOM', text: "College rejection #47 arrived today. Progress!" },
];
const BEDROOM_LINES = [{ speaker: 'YOU', text: "Maybe I should grab my coding textbooks..." }];
const CLOSET_LINES = [
  { speaker: 'YOU', text: "There's the coding book in bioinformatics!" },
  { speaker: 'YOU', text: "Man, frick this." },
];
const COMPUTER_LINES = [
  { speaker: 'YOU', text: "I guess I'll find something online. nothing is any good though..." },
  { speaker: 'YOU', text: "Hm... Dr. Henry Lacks? The name sounds... familiar somehow..." },
  { speaker: 'YOU', text: "Whatever. I'll click it." },
  { speaker: 'YOU', text: "Press E to click the link..." },
];
const VOID_DIALOGUES = [
  { speaker: 'ENZYME', text: 'Meow!', sub: '*My name is Enzyme! Welcome to BioBit!*' },
  { speaker: 'ENZYME', text: 'Meow meow meow.', sub: "*You've been transported to a digital learning dimension.*" },
  { speaker: 'ENZYME', text: 'Meow? Meow!', sub: '*Basically your computer is now also a universe. Normal stuff.*' },
  { speaker: 'ENZYME', text: "Meoooow.", sub: '*Anyway! You need to learn bioinformatics and ML.*' },
  { speaker: 'ENZYME', text: 'Meow meow.', sub: "*I'll be your guide. I'm a cat with a PhD. Again, normal stuff.*" },
  { speaker: 'ENZYME', text: 'Meow!', sub: "*Come on then! Into the Cytoplasm!*" },
];

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

        if (line.isDevil) {
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
      // Enzyme grabs and yeets
      s.choiceSelected = 1;
      // Animate, then complete anyway
      setTimeout(() => {
        fadeToBlack(1.5, () => {
          s.phase = 'complete';
          onCompleteRef.current();
        });
      }, 3000);
    }
  }, [fadeToBlack]);

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

        // Check exits
        const kitchenStairX = GW - 14;
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

        // Door zones
        const yourRoomX = Math.floor(GW / 2) - 14;
        const momsRoomX = 10;

        if (s.playerX < momsRoomX + 30 && s.playerDir === 'left') {
          s.upstairsSubPhase = 'momsroom';
          startDialogue(UPSTAIRS_MOMS_ROOM_LINES[0].text);
        }

        if (s.playerX > yourRoomX - 5 && s.playerX < yourRoomX + 30 && s.playerDir === 'right') {
          s.upstairsSubPhase = 'yourroom';
          s.freeRoam = false;
          startDialogue(BEDROOM_LINES[0].text);
        }
      }

      if (s.phase === 'upstairs' && s.upstairsSubPhase === 'momsroom') {
        // Let player read letters, exit on E
        if (s.keys['KeyE'] && !s.dialogueText) {
          s.upstairsSubPhase = 'hall';
          s.playerX = Math.floor(GW * 0.15);
        }
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
          // Enzyme cat
          drawEnzyme(ctx, Math.floor(s.playerX) + 14, Math.floor(s.playerY) + 8, s.walkFrame, 'sitting');
          // Player at table
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
          drawMomsRoom(ctx, GW, GH);
          drawPlayer(ctx, Math.floor(s.playerX), floorY, avatar, 'right', 0);
          drawPixelText(ctx, 'E EXIT', Math.floor(GW / 2) - 10, GH - 8, '#888888', 1);
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
