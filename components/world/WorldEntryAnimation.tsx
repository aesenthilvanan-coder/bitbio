'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/lib/store';
import type { AvatarConfig } from '@/lib/types';

interface Props { realm: 1 | 2 | 3 | 4; onComplete: () => void; }

// Character scale: 5px per game pixel → sprites ~200px tall on 1080p
const CS = 5;

// ─── Color helpers ────────────────────────────────────────────────────────────
function hex2rgb(hex: string) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function lighten(hex: string, amt: number) {
  const [r,g,b] = hex2rgb(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex: string, amt: number) {
  const [r,g,b] = hex2rgb(hex);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}

// ─── Player sprite (all positions in CSS px) ──────────────────────────────────
type PlayerPose = 'walk'|'run'|'jump'|'stand'|'lying'|'enzymehead';

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,   // center-x, feet-y
  phase: number,
  av: AvatarConfig,
  pose: PlayerPose = 'walk',
) {
  const C = CS;
  const skin = av.skinTone ?? '#c68642';
  const hair = av.hairColor ?? '#1a1a1a';
  const coat = av.clothingColorPrimary ?? '#e8e8ff';
  const coatD = darken(coat, 40);
  const pants = '#1a1a2e';
  const shoe = '#333333';

  if (pose === 'lying') {
    // Horizontal - feet to left, head to right
    const lx = cx - 45, ly = cy - 18;
    ctx.fillStyle = pants; ctx.fillRect(lx, ly + 8, 50, 9);
    ctx.fillStyle = shoe;  ctx.fillRect(lx - 10, ly + 8, 14, 8);
    ctx.fillStyle = coatD; ctx.fillRect(lx + 40, ly + 2, 30, 13);
    ctx.fillStyle = coat;  ctx.fillRect(lx + 44, ly, 28, 10);
    // backpack
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(lx + 42, ly - 7, 18, 12);
    ctx.fillStyle = '#39ff14'; ctx.fillRect(lx + 46, ly - 4, 6, 6);
    // head
    ctx.fillStyle = hair;  ctx.fillRect(lx + 70, ly - 8, 22, 8);
    ctx.fillStyle = skin;  ctx.fillRect(lx + 68, ly - 2, 20, 16);
    ctx.fillStyle = lighten(skin, 20); ctx.fillRect(lx + 68, ly - 2, 20, 4);
    // dazed stars
    const si = phase * 3;
    for (let i = 0; i < 3; i++) {
      const a = si + i * 2.09;
      ctx.fillStyle = '#ffff55';
      ctx.fillRect(cx + Math.cos(a)*22 - 3, cy - 50 + Math.sin(a)*8, 6, 6);
    }
    return;
  }

  const h = C * 26; // full height in px
  const top = cy - h;
  const leanX = pose === 'run' ? -C * 1 : 0;
  const speedF = pose === 'run' ? 2.8 : 1.0;
  const legSwing = (pose === 'jump') ? 0 : Math.sin(phase * speedF) * (pose === 'run' ? C*2.2 : C*1.4);
  const armSwing = (pose === 'jump') ? -C*2 : Math.sin(phase * speedF + Math.PI) * (pose === 'run' ? C*2 : C*1.2);

  // Hair
  ctx.fillStyle = hair;
  ctx.fillRect(cx + leanX - C*5, top - C*2, C*12, C*5);
  ctx.fillStyle = lighten(hair, 25);
  ctx.fillRect(cx + leanX - C*3, top - C*2, C*6, C*2);

  // Head
  ctx.fillStyle = skin;
  ctx.fillRect(cx + leanX - C*4, top, C*10, C*9);
  ctx.fillStyle = lighten(skin, 18);
  ctx.fillRect(cx + leanX - C*3, top, C*7, C*3);
  ctx.fillStyle = darken(skin, 15);
  ctx.fillRect(cx + leanX - C*3, top + C*7, C*7, C*2);

  // Neck
  ctx.fillStyle = skin;
  ctx.fillRect(cx + leanX - C*2, top + C*9, C*5, C*2);

  // Backpack (behind body)
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(cx + leanX - C*1, top + C*8, C*7, C*10);
  ctx.fillStyle = '#0f0f1e';
  ctx.fillRect(cx + leanX + C*1, top + C*10, C*4, C*7);
  ctx.fillStyle = '#39ff14';
  ctx.fillRect(cx + leanX + C*2, top + C*11, C*2, C*2);
  ctx.fillRect(cx + leanX + C*3, top + C*12, C*2, C*2);

  // Body (lab coat)
  ctx.fillStyle = coatD;
  ctx.fillRect(cx + leanX - C*5, top + C*11, C*12, C*8);
  ctx.fillStyle = coat;
  ctx.fillRect(cx + leanX - C*4, top + C*11, C*10, C*7);
  ctx.fillStyle = lighten(coat, 15);
  ctx.fillRect(cx + leanX - C*3, top + C*11, C*7, C*2);

  // Arms
  ctx.fillStyle = coatD;
  ctx.fillRect(cx + leanX - C*8, top + C*11 + armSwing, C*3, C*8);
  ctx.fillRect(cx + leanX + C*5, top + C*11 - armSwing, C*3, C*8);
  // Hands
  ctx.fillStyle = skin;
  ctx.fillRect(cx + leanX - C*8, top + C*18 + armSwing, C*3, C*3);
  ctx.fillRect(cx + leanX + C*5, top + C*18 - armSwing, C*3, C*3);

  // Pants + legs
  ctx.fillStyle = pants;
  ctx.fillRect(cx + leanX - C*4, top + C*19, C*4, C*2);
  ctx.fillRect(cx + leanX + C*1, top + C*19, C*4, C*2);

  if (pose === 'jump') {
    ctx.fillRect(cx - C*4, top + C*18, C*4, C*5);
    ctx.fillRect(cx + C*1, top + C*18, C*4, C*5);
    ctx.fillStyle = shoe;
    ctx.fillRect(cx - C*5, top + C*22, C*6, C*2);
    ctx.fillRect(cx + C*1, top + C*22, C*6, C*2);
  } else {
    ctx.fillRect(cx + leanX - C*4, top + C*21 + legSwing, C*4, C*5);
    ctx.fillRect(cx + leanX + C*1, top + C*21 - legSwing, C*4, C*5);
    ctx.fillStyle = shoe;
    ctx.fillRect(cx + leanX - C*5, top + C*25 + legSwing, C*6, C*2);
    ctx.fillRect(cx + leanX + C*1, top + C*25 - legSwing, C*6, C*2);
  }
}

// ─── Enzyme sprite ────────────────────────────────────────────────────────────
type EnzymePose = 'walk'|'sit'|'fly'|'onhead'|'excited'|'surprised';

function drawEnzyme(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  phase: number,
  pose: EnzymePose = 'walk',
  facing: 'right'|'left' = 'right',
) {
  const C = CS;
  const body = '#f8f8f8';
  const shad = '#d4d4e8';
  const nose = '#ffb3c1';
  const eye = '#111111';
  const hi = '#ffffff';
  const outl = '#0a0a0a';
  const ear = '#ffccdd';

  if (pose === 'fly') {
    // Stretched horizontal body flying
    const dir = facing === 'right' ? 1 : -1;
    ctx.fillStyle = outl; ctx.fillRect(cx - C*7*dir, cy - C*2, C*14, C*5);
    ctx.fillStyle = body;  ctx.fillRect(cx - C*6*dir, cy - C*2 + 1, C*12, C*4);
    ctx.fillStyle = shad;  ctx.fillRect(cx - C*6*dir, cy + C*1, C*12, C*1);
    // Head at front
    const hx = cx + C*6*dir;
    ctx.fillStyle = outl; ctx.fillRect(hx - C*2, cy - C*4, C*6, C*6);
    ctx.fillStyle = body;  ctx.fillRect(hx - C*1, cy - C*3, C*4, C*4);
    // Eyes (wide scared/excited)
    ctx.fillStyle = eye; ctx.fillRect(hx, cy - C*2, C*2, C*2);
    ctx.fillStyle = hi;  ctx.fillRect(hx, cy - C*2, C*1, C*1);
    // Ears
    ctx.fillStyle = outl; ctx.fillRect(hx - C*1, cy - C*6, C*2, C*3);
    ctx.fillRect(hx + C*2, cy - C*6, C*2, C*3);
    ctx.fillStyle = ear;  ctx.fillRect(hx - C*1, cy - C*5, C*1, C*2);
    ctx.fillRect(hx + C*2, cy - C*5, C*1, C*2);
    // Tail trailing behind
    const tx = cx - C*5*dir;
    ctx.fillStyle = body; ctx.fillRect(tx, cy - C*1, C*2, C*4);
    ctx.fillRect(tx - C*1*dir, cy + C*2, C*3, C*2);
    // Speed lines
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(cx - C*(8+i*3)*dir, cy - C*1 + i*C, C*2, 2);
    }
    return;
  }

  if (pose === 'onhead') {
    // Sitting compact on top of player's head
    ctx.fillStyle = outl; ctx.fillRect(cx - C*4, cy - C*9, C*8, C*7);
    ctx.fillStyle = body;  ctx.fillRect(cx - C*3, cy - C*8, C*6, C*6);
    ctx.fillStyle = shad;  ctx.fillRect(cx - C*3, cy - C*3, C*6, C*1);
    // Ears
    ctx.fillStyle = outl; ctx.fillRect(cx - C*3, cy - C*12, C*2, C*4);
    ctx.fillRect(cx + C*1, cy - C*12, C*2, C*4);
    ctx.fillStyle = ear; ctx.fillRect(cx - C*2, cy - C*11, C*1, C*2);
    ctx.fillRect(cx + C*1, cy - C*11, C*1, C*2);
    // Eyes (smug/content)
    ctx.fillStyle = eye; ctx.fillRect(cx - C*2, cy - C*7, C*2, C*1);
    ctx.fillRect(cx + C*1, cy - C*7, C*2, C*1);
    ctx.fillStyle = hi; ctx.fillRect(cx - C*2, cy - C*7, C*1, C*1);
    // Nose
    ctx.fillStyle = nose; ctx.fillRect(cx - C*1, cy - C*5, C*2, C*1);
    // Tail curled over back
    ctx.fillStyle = body; ctx.fillRect(cx + C*3, cy - C*7, C*2, C*5);
    ctx.fillRect(cx + C*2, cy - C*3, C*3, C*2);
    // Paws gripping head
    ctx.fillStyle = body; ctx.fillRect(cx - C*4, cy - C*4, C*2, C*3);
    ctx.fillRect(cx + C*2, cy - C*4, C*2, C*3);
    return;
  }

  if (pose === 'sit') {
    const bob = Math.sin(phase * 0.8) * 2;
    ctx.fillStyle = outl; ctx.fillRect(cx - C*4, cy - C*8 + bob, C*9, C*9);
    ctx.fillStyle = body;  ctx.fillRect(cx - C*3, cy - C*7 + bob, C*7, C*7);
    ctx.fillStyle = shad;  ctx.fillRect(cx - C*3, cy - C*2 + bob, C*7, C*2);
    ctx.fillStyle = lighten('#f8f8f8', 20); ctx.fillRect(cx - C*2, cy - C*7 + bob, C*4, C*2);
    // Ears
    ctx.fillStyle = outl; ctx.fillRect(cx - C*3, cy - C*11 + bob, C*2, C*4);
    ctx.fillRect(cx + C*2, cy - C*11 + bob, C*2, C*4);
    ctx.fillStyle = ear; ctx.fillRect(cx - C*2, cy - C*10 + bob, C*1, C*2);
    ctx.fillRect(cx + C*2, cy - C*10 + bob, C*1, C*2);
    // Eyes (big expressive)
    const blink = (Math.floor(phase * 0.4) % 12 === 0);
    if (pose === 'sit' && !blink) {
      ctx.fillStyle = '#2244cc'; ctx.fillRect(cx - C*2, cy - C*6 + bob, C*3, C*3);
      ctx.fillRect(cx + C*1, cy - C*6 + bob, C*3, C*3);
      ctx.fillStyle = eye; ctx.fillRect(cx - C*2, cy - C*5 + bob, C*3, C*2);
      ctx.fillRect(cx + C*1, cy - C*5 + bob, C*3, C*2);
      ctx.fillStyle = hi; ctx.fillRect(cx - C*2, cy - C*6 + bob, C*1, C*1);
      ctx.fillRect(cx + C*1, cy - C*6 + bob, C*1, C*1);
    } else {
      ctx.fillStyle = eye; ctx.fillRect(cx - C*2, cy - C*5 + bob, C*3, C*1);
      ctx.fillRect(cx + C*1, cy - C*5 + bob, C*3, C*1);
    }
    ctx.fillStyle = nose; ctx.fillRect(cx - C*1, cy - C*4 + bob, C*2, C*1);
    // Paws
    ctx.fillStyle = body; ctx.fillRect(cx - C*4, cy - C*1, C*3, C*3);
    ctx.fillRect(cx + C*2, cy - C*1, C*3, C*3);
    // Tail
    ctx.fillStyle = body; ctx.fillRect(cx + C*4, cy - C*5 + bob, C*2, C*7);
    ctx.fillRect(cx + C*3, cy + C*1 + bob, C*3, C*2);
    return;
  }

  // 'walk', 'excited', 'surprised'
  const bob = Math.sin(phase * 2) * 2;
  const legOff = Math.sin(phase * 4) * (C * 0.8);
  const dir = facing === 'right' ? 1 : -1;

  // Body
  ctx.fillStyle = outl; ctx.fillRect(cx - C*3, cy - C*7 + bob, C*8, C*5);
  ctx.fillStyle = body;  ctx.fillRect(cx - C*2, cy - C*6 + bob, C*6, C*4);
  ctx.fillStyle = shad;  ctx.fillRect(cx - C*2, cy - C*3 + bob, C*6, C*1);
  // Head
  ctx.fillStyle = outl; ctx.fillRect(cx + C*2*dir, cy - C*11 + bob, C*6, C*6);
  ctx.fillStyle = body;  ctx.fillRect(cx + C*3*dir, cy - C*10 + bob, C*4, C*4);
  ctx.fillStyle = hi;    ctx.fillRect(cx + C*3*dir, cy - C*10 + bob, C*3, C*1);
  // Ears
  ctx.fillStyle = outl; ctx.fillRect(cx + C*3*dir, cy - C*14 + bob, C*2, C*4);
  ctx.fillRect(cx + C*6*dir, cy - C*14 + bob, C*2, C*4);
  ctx.fillStyle = ear; ctx.fillRect(cx + C*3*dir, cy - C*13 + bob, C*1, C*2);
  ctx.fillRect(cx + C*6*dir, cy - C*13 + bob, C*1, C*2);
  // Eyes
  const ey = pose === 'excited' ? cy - C*9 + bob : cy - C*8 + bob;
  const eyeH = pose === 'surprised' ? C*2 : C*1;
  ctx.fillStyle = eye; ctx.fillRect(cx + C*3*dir, ey, C*2, eyeH);
  ctx.fillRect(cx + C*6*dir, ey, C*2, eyeH);
  ctx.fillStyle = hi; ctx.fillRect(cx + C*3*dir, ey, C*1, C*1);
  // Nose
  ctx.fillStyle = nose; ctx.fillRect(cx + C*4*dir, cy - C*7 + bob, C*2, C*1);
  // Legs
  ctx.fillStyle = body;
  ctx.fillRect(cx - C*1, cy - C*2 + bob + legOff, C*2, C*3);
  ctx.fillRect(cx + C*1, cy - C*2 + bob - legOff, C*2, C*3);
  // Tail
  ctx.fillStyle = body;
  ctx.fillRect(cx - C*3*dir, cy - C*6 + bob, C*2, C*6);
  ctx.fillRect(cx - C*4*dir, cy - C*2 + bob, C*3, C*2);
}

// ─── Dialogue box (Undertale-style bottom panel) ──────────────────────────────
function drawDialogue(
  ctx: CanvasRenderingContext2D,
  text: string,
  charProgress: number,   // 0–text.length, drives typewriter
  speaker: 'enzyme'|'player',
  CW: number, CH: number,
  accentColor: string,
  subtitle?: string,      // teal English translation for Enzyme meows
) {
  const panH = subtitle ? 160 : 140;
  const panY = CH - panH - 10;

  // Panel bg
  ctx.fillStyle = '#000000';
  ctx.fillRect(10, panY, CW - 20, panH);
  // Border
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, panY, CW - 20, 3);
  ctx.fillRect(10, CH - 13, CW - 20, 3);
  ctx.fillRect(10, panY, 3, panH);
  ctx.fillRect(CW - 13, panY, 3, panH);

  // Portrait area
  const portX = 24, portY = panY + 12, portW = 90, portH = 90;
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(portX, portY, portW, portH);
  ctx.fillStyle = accentColor;
  ctx.fillRect(portX, portY, portW, 2);
  ctx.fillRect(portX, portY + portH - 2, portW, 2);
  ctx.fillRect(portX, portY, 2, portH);
  ctx.fillRect(portX + portW - 2, portY, 2, portH);

  // Speaker name
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 13px "Courier New", monospace';
  const name = speaker === 'enzyme' ? 'ENZYME' : 'YOU';
  ctx.fillText(name, portX + 2, panY - 4);

  // Enzyme portrait (draw mini version in portrait box)
  if (speaker === 'enzyme') {
    // Mini cat face
    const px = portX + portW/2, py = portY + 45;
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(px - 20, py - 22, 40, 35);
    ctx.fillRect(px - 14, py - 32, 28, 14);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(px - 18, py - 28, 8, 10); // left ear outline
    ctx.fillRect(px + 10, py - 28, 8, 10);
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(px - 16, py - 26, 6, 8);
    ctx.fillRect(px + 10, py - 26, 6, 8);
    ctx.fillStyle = '#ffccdd';
    ctx.fillRect(px - 14, py - 24, 4, 6);
    ctx.fillRect(px + 10, py - 24, 4, 6);
    // Big eyes
    ctx.fillStyle = '#2244cc'; ctx.fillRect(px - 12, py - 16, 10, 10);
    ctx.fillRect(px + 2, py - 16, 10, 10);
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(px - 10, py - 14, 6, 6);
    ctx.fillRect(px + 4, py - 14, 6, 6);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(px - 10, py - 14, 3, 3);
    ctx.fillRect(px + 4, py - 14, 3, 3);
    ctx.fillStyle = '#ffb3c1'; ctx.fillRect(px - 2, py - 5, 6, 3);
    // Whiskers
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(px - 22, py - 10, 10, 1);
    ctx.fillRect(px + 12, py - 10, 10, 1);
  } else {
    // Mini player head
    const px = portX + portW/2, py = portY + 45;
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px - 18, py - 30, 36, 12);
    ctx.fillStyle = '#c68642'; ctx.fillRect(px - 16, py - 20, 32, 28);
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(px - 10, py - 12, 6, 6);
    ctx.fillRect(px + 4, py - 12, 6, 6);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(px - 9, py - 12, 3, 3);
    ctx.fillRect(px + 5, py - 12, 3, 3);
  }

  // Dialogue text (typewriter)
  const visible = text.slice(0, Math.floor(charProgress));
  const words = visible.split(' ');
  const maxW = CW - 20 - portW - 40;
  const textX = portX + portW + 20;
  let lineY = panY + 30;
  let line = '';

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px "Courier New", monospace';

  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, textX, lineY);
      lineY += 22;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, textX, lineY);

  // Subtitle (teal English translation for Enzyme meows)
  if (subtitle) {
    const subX = portX + portW + 20;
    const subY = panY + panH - 28;
    ctx.fillStyle = '#55ddcc';
    ctx.font = 'italic 11px "Courier New", monospace';
    // Typewriter the subtitle based on how far main text has progressed
    const subProg = Math.max(0, charProgress - text.length * 0.6);
    const subVisible = subtitle.slice(0, Math.floor(subProg * 3));
    ctx.fillText(subVisible, subX, subY);
    if (subProg > 0) {
      ctx.fillStyle = 'rgba(85,221,204,0.15)';
      ctx.fillRect(subX - 4, subY - 14, CW - subX - 20, 16);
    }
  }

  // Blinking prompt if done
  if (charProgress >= text.length && Math.floor(Date.now() / 500) % 2 === 0) {
    ctx.fillStyle = accentColor;
    ctx.fillText('▼', CW - 40, CH - 20);
  }
}

// ─── Welcome sign ─────────────────────────────────────────────────────────────
const REALM_NAMES  = ['', 'THE CYTOPLASM', 'GENOME FOREST', 'NEURAL NEBULA', 'PROTEIN CATHEDRAL'];
const REALM_TOPICS: Record<number, string[]> = {
  1: ['- LEARN','- BUILD','- DISCOVER','- EVOLVE'],
  2: ['○ - LEARN','○ - ANALYZE','○ - DISCOVER','○ - CONNECT'],
  3: ['○ - LEARN','○ - TRAIN','○ - EVALUATE','○ - INNOVATE'],
  4: ['○ - EXPLORE','○ - MODEL','○ - DESIGN','○ - DISCOVER','○ - CURE'],
};
const REALM_COLORS = ['','#00ffaa','#52b788','#a855f7','#c0a0ff'];

function drawWelcomeSign(ctx: CanvasRenderingContext2D, realm: number, alpha: number, CH: number) {
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;
  const x = 40, y = CH * 0.3, w = 200, h = 160;
  const col = REALM_COLORS[realm];

  // Post
  ctx.fillStyle = '#5a4020';
  ctx.fillRect(x + 16, y + h, 6, CH * 0.3);

  // Board
  ctx.fillStyle = '#0a1a0a';
  ctx.fillRect(x, y, w, h);
  // Border
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, 3);
  ctx.fillRect(x, y + h - 3, w, 3);
  ctx.fillRect(x, y, 3, h);
  ctx.fillRect(x + w - 3, y, 3, h);

  // Text
  ctx.fillStyle = col;
  ctx.font = '9px "Courier New", monospace';
  ctx.fillText('WELCOME TO', x + 14, y + 22);
  ctx.font = 'bold 14px "Courier New", monospace';
  const name = REALM_NAMES[realm];
  if (name.includes(' ') && name !== 'THE CYTOPLASM') {
    const parts = name.split(' ');
    ctx.fillText(parts[0], x + 14, y + 44);
    ctx.fillText(parts[1], x + 14, y + 62);
    let ty = 82;
    for (const topic of REALM_TOPICS[realm] ?? []) {
      ctx.fillStyle = '#aaffaa';
      ctx.font = '9px "Courier New", monospace';
      ctx.fillText(topic, x + 14, y + ty);
      ty += 14;
    }
  } else {
    ctx.fillText(name, x + 14, y + 44);
    let ty = 66;
    for (const topic of REALM_TOPICS[realm] ?? []) {
      ctx.fillStyle = '#aaffaa';
      ctx.font = '9px "Courier New", monospace';
      ctx.fillText(topic, x + 14, y + ty);
      ty += 14;
    }
  }
  // Arrow
  ctx.fillStyle = col;
  ctx.font = 'bold 24px monospace';
  ctx.fillText('→', x + 14, y + h - 10);

  ctx.globalAlpha = 1;
}

// ─── Terminal panel ───────────────────────────────────────────────────────────
const TERMINALS: Record<number, string[]> = {
  1: ['$ python learn.py', 'Loading organelles...', 'Mapping pathways...', 'Welcome to Cytoplasm.', '$ _'],
  2: ['$ analyze_genome.sh', 'Loading data...', 'Building insights...', 'Welcome to Genome Forest.', '$ _'],
  3: ['$ train_model.py', 'Loading neural modules...', 'Initializing weights...', 'Entering Neural Nebula.', '$ _'],
  4: ['$ run_alphafold.py', 'Loading structures...', 'Scoring conformations...', 'Welcome to Protein Cathedral.', '$ _'],
};

function drawTerminal(ctx: CanvasRenderingContext2D, realm: number, lines: number, CW: number, CH: number) {
  const pw = 280, ph = 120;
  const px = CW - pw - 16, py = CH - ph - 16;
  ctx.fillStyle = '#080808'; ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = '#22ff44';
  ctx.fillRect(px, py, pw, 2); ctx.fillRect(px, py + ph - 2, pw, 2);
  ctx.fillRect(px, py, 2, ph); ctx.fillRect(px + pw - 2, py, 2, ph);
  ctx.font = '11px "Courier New", monospace';
  const tlines = TERMINALS[realm];
  for (let i = 0; i < Math.min(lines, tlines.length); i++) {
    ctx.fillStyle = i === 0 ? '#ffffff' : '#22ff44';
    ctx.fillText(tlines[i], px + 10, py + 18 + i * 20);
  }
}

// ─── Info panels (the floating topic labels from the reference images) ─────────
function drawInfoPanel(
  ctx: CanvasRenderingContext2D,
  title: string, subtitle: string,
  x: number, y: number, alpha: number, col: string,
) {
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha;
  const w = 130, h = 50;
  ctx.fillStyle = '#060810'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, 2); ctx.fillRect(x, y + h - 2, w, 2);
  ctx.fillRect(x, y, 2, h); ctx.fillRect(x + w - 2, y, 2, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px "Courier New", monospace';
  ctx.fillText(title, x + 8, y + 18);
  if (subtitle) {
    ctx.fillStyle = col;
    ctx.font = '8px "Courier New", monospace';
    ctx.fillText(subtitle, x + 8, y + 34);
  }
  ctx.globalAlpha = 1;
}

// ─── BACKGROUNDS ─────────────────────────────────────────────────────────────
// Each background closely matches the reference AI images

function drawCytoplasmBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  // 1. Base fill: bioluminescent cave interior
  ctx.fillStyle = '#020a08';
  ctx.fillRect(0, 0, CW, CH);

  // 6 diagonal light rays from upper-center fanning outward
  for (let ray = 0; ray < 6; ray++) {
    const spreadAngle = (ray - 2.5) * 0.22;
    ctx.fillStyle = 'rgba(0,180,80,0.04)';
    for (let seg = 0; seg < 38; seg++) {
      const d = seg * 18;
      const rx = CW * 0.5 + Math.sin(spreadAngle) * d;
      const rw = 10 + seg * 4;
      ctx.fillRect(rx - rw / 2, seg * 18, rw, 20);
    }
  }

  // 2. LEFT CAVE WALL — organic dark purple-black, irregular edge
  const wallSegs = [
    { w: CW * 0.18, h: CH },     { w: CW * 0.16, h: CH * 0.90 },
    { w: CW * 0.20, h: CH * 0.85 }, { w: CW * 0.14, h: CH * 0.95 },
    { w: CW * 0.17, h: CH * 0.88 }, { w: CW * 0.19, h: CH },
    { w: CW * 0.13, h: CH * 0.92 }, { w: CW * 0.15, h: CH * 0.97 },
    { w: CW * 0.11, h: CH * 0.82 }, { w: CW * 0.12, h: CH * 0.78 },
  ];
  wallSegs.forEach(({ w, h }, i) => {
    ctx.fillStyle = i % 2 === 0 ? '#0a0514' : '#0d0618';
    ctx.fillRect(0, CH - h, w, h);
  });

  // 3. DNA HELIX — large, center-left at x=CW*0.28, y=CH*0.05 to CH*0.75
  const dnaX = CW * 0.28;
  const dnaTop = CH * 0.05, dnaBot = CH * 0.75;
  const dnaSteps = Math.floor((dnaBot - dnaTop) / 6);
  for (let i = 0; i < dnaSteps; i++) {
    const ang = (i / dnaSteps) * Math.PI * 8 + t * 0.5;
    const hy = dnaTop + i * 6;
    const rad = 24;
    const ax = dnaX + Math.cos(ang) * rad;
    const bx = dnaX + Math.cos(ang + Math.PI) * rad;
    // Strand A: #3344ff
    ctx.fillStyle = '#3344ff';
    ctx.fillRect(ax - 6, hy, 12, 6);
    // Strand B: #9933ff
    ctx.fillStyle = '#9933ff';
    ctx.fillRect(bx - 6, hy, 12, 6);
    // Base pairs every 5 steps
    if (i % 5 === 0) {
      const pIdx = Math.floor(i / 5) % 3;
      const pCol = pIdx === 0 ? '#33ff88' : pIdx === 1 ? '#66aaff' : '#ff66cc';
      ctx.fillStyle = pCol;
      const x1 = ax + (ax < bx ? 6 : -6);
      const x2 = bx + (bx < ax ? 6 : -6);
      ctx.fillRect(Math.min(x1, x2), hy + 2, Math.max(2, Math.abs(x2 - x1)), 2);
    }
  }

  // 4. NUCLEUS — dominant, right side, center x=CW*0.72, y=CH*0.35
  const nX = CW * 0.72, nY = CH * 0.35;

  // Outer glow behind everything
  ctx.fillStyle = 'rgba(80,100,200,0.06)';
  ctx.fillRect(nX - 180, nY - 180, 360, 360);

  // 5 outer ring layers (elliptical, stacked rects)
  const ringRadii = [165, 148, 130, 110, 88];
  const ringColors = ['#445566', '#4a4a77', '#504488', '#5a3a99', '#6644aa'];
  ringRadii.forEach((r, ri) => {
    ctx.fillStyle = ringColors[ri];
    for (let row = -r; row <= r; row += 3) {
      const w = Math.sqrt(Math.max(0, r * r - row * row)) * 2 * 1.3;
      ctx.fillRect(nX - w / 2, nY + row, w, 3);
    }
  });

  // Inner sphere radius 72 — #44006a with #8833bb highlight upper-left
  for (let row = -72; row <= 72; row += 3) {
    const w = Math.sqrt(Math.max(0, 72 * 72 - row * row)) * 2;
    ctx.fillStyle = row < 0 ? '#8833bb' : '#44006a';
    ctx.fillRect(nX - w / 2, nY + row, w, 3);
  }

  // 8 nuclear pores — teal 6x6 rectangles around sphere edge
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const px = nX + Math.cos(angle) * 82;
    const py = nY + Math.sin(angle) * 62;
    ctx.fillStyle = '#00bbaa';
    ctx.fillRect(px - 3, py - 3, 6, 6);
  }

  // 5. MITOCHONDRIA
  // Mito1: x=CW*0.86, y=CH*0.13
  const m1x = CW * 0.86, m1y = CH * 0.13 + Math.sin(t * 0.6) * 6;
  ctx.fillStyle = '#5a2800'; ctx.fillRect(m1x - 27, m1y - 13, 54, 26);
  ctx.fillStyle = '#cc5500'; ctx.fillRect(m1x - 23, m1y - 9, 46, 18);
  ctx.fillStyle = '#ff8800'; ctx.fillRect(m1x - 21, m1y - 9, 42, 5);
  ctx.fillStyle = '#3a1500';
  for (let c = 0; c < 5; c++) ctx.fillRect(m1x - 18 + c * 9, m1y - 5, 3, 10);
  drawInfoPanel(ctx, 'MITOCHONDRION', 'ATP synthesis', m1x - 65, m1y - 70, 0.85, '#00ffaa');

  // Mito2: x=CW*0.46, y=CH*0.47, larger (64x30px)
  const m2x = CW * 0.46, m2y = CH * 0.47 + Math.sin(t * 0.7 + 1) * 5;
  ctx.fillStyle = '#5a2800'; ctx.fillRect(m2x - 32, m2y - 15, 64, 30);
  ctx.fillStyle = '#cc5500'; ctx.fillRect(m2x - 28, m2y - 11, 56, 22);
  ctx.fillStyle = '#ff8800'; ctx.fillRect(m2x - 26, m2y - 11, 52, 5);
  ctx.fillStyle = '#3a1500';
  for (let c = 0; c < 5; c++) ctx.fillRect(m2x - 20 + c * 10, m2y - 7, 3, 14);

  // 6. GOLGI APPARATUS — x=CW*0.80, y=CH*0.56, 7 stacked green ribbons
  const gx = CW * 0.80, gy = CH * 0.56;
  drawInfoPanel(ctx, 'GOLGI', 'vesicle transport', gx - 65, gy - 60, 0.85, '#00ffaa');
  for (let g = 0; g < 7; g++) {
    const rW = 80 - g * 8;
    ctx.fillStyle = g % 2 === 0 ? '#1a6030' : '#22884a';
    ctx.fillRect(gx - rW / 2, gy + g * 12, rW, 8);
  }
  // 5 small blue vesicles at edges
  ctx.fillStyle = '#2244ff';
  for (let v = 0; v < 5; v++) {
    const vx = v < 2 ? gx - 46 + v * 10 : gx + 36 + (v - 2) * 10;
    ctx.fillRect(vx, gy + v * 9 + 8, 8, 8);
  }

  // 7. RIBOSOME — x=CW*0.42, y=CH*0.32, 8 small 10x10 green/teal blobs
  const ribX = CW * 0.42, ribY = CH * 0.32;
  drawInfoPanel(ctx, 'RIBOSOME', 'protein factory', ribX - 10, ribY - 65, 0.85, '#00ffaa');
  for (let r = 0; r < 8; r++) {
    const rx = ribX + (r % 3) * 14 - 14;
    const ry = ribY + Math.floor(r / 3) * 14 - 14;
    ctx.fillStyle = '#22aa44';
    ctx.fillRect(rx, ry, 10, 10);
    ctx.fillStyle = '#44cc66';
    ctx.fillRect(rx + 2, ry + 2, 5, 5);
  }

  // 8. PROTEIN — x=CW*0.88, y=CH*0.10, 10 blue 8x8 blobs in chain
  const prX = CW * 0.88, prY = CH * 0.10;
  drawInfoPanel(ctx, 'PROTEIN', 'folded chain', prX - 140, prY + 10, 0.85, '#00ffaa');
  for (let p = 0; p < 10; p++) {
    const px2 = prX - 30 + (p % 5) * 12;
    const py2 = prY + Math.floor(p / 5) * 12;
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(px2, py2, 8, 8);
    ctx.fillStyle = '#88bbff';
    ctx.fillRect(px2 + 1, py2 + 1, 4, 4);
    if (p > 0 && p % 5 !== 0) {
      ctx.fillStyle = '#2266cc';
      ctx.fillRect(px2 - 4, py2 + 3, 4, 2);
    }
  }

  // 9. RNA STRAND — x=CW*0.52 to x=CW*0.68, y=CH*0.17, wavy sine pattern
  const rnaX0 = CW * 0.52, rnaX1 = CW * 0.68, rnaBaseY = CH * 0.17;
  drawInfoPanel(ctx, 'RNA', 'messenger', rnaX0, rnaBaseY - 60, 0.85, '#00ffaa');
  const rnaCount = 18;
  for (let i = 0; i < rnaCount; i++) {
    const rx = rnaX0 + i * ((rnaX1 - rnaX0) / rnaCount);
    const ry = rnaBaseY + Math.sin(i * 0.8) * 12;
    ctx.fillStyle = '#ff88aa';
    ctx.fillRect(rx, ry, 6, 4);
  }

  // 10. ENZYME BLOBS — scattered 5 pink/magenta 14x10px blobs
  const ePositions: [number, number][] = [
    [CW * 0.22, CH * 0.40], [CW * 0.35, CH * 0.60],
    [CW * 0.55, CH * 0.70], [CW * 0.15, CH * 0.55], [CW * 0.40, CH * 0.58],
  ];
  ePositions.forEach(([ex, ey], ei) => {
    ctx.fillStyle = '#cc4488';
    ctx.fillRect(ex - 7, ey - 5, 14, 10);
    ctx.fillStyle = '#ee66aa';
    ctx.fillRect(ex - 5, ey - 3, 10, 6);
    if (ei === 4) drawInfoPanel(ctx, 'ENZYME', 'catalyst', ex + 14, ey - 25, 0.85, '#00ffaa');
  });

  // 11. LYSOSOME — x=CW*0.72, y=CH*0.70, concentric rects for sphere
  const lysX = CW * 0.72, lysY = CH * 0.70 + Math.sin(t * 0.5) * 4;
  drawInfoPanel(ctx, 'LYSOSOME', 'digest & recycle', lysX + 34, lysY - 25, 0.85, '#00ffaa');
  const lysData: [number, string][] = [[28,'#6633aa'],[22,'#7744bb'],[16,'#8855cc'],[10,'#aa77dd']];
  lysData.forEach(([lr, col]) => {
    ctx.fillStyle = col;
    for (let row = -lr; row <= lr; row += 3) {
      const w = Math.sqrt(Math.max(0, lr * lr - row * row)) * 2;
      ctx.fillRect(lysX - w / 2, lysY + row, w, 3);
    }
  });

  // 12. FLOATING VESICLES (35 total) — 3-layer concentric rects
  for (let i = 0; i < 35; i++) {
    const vx = (i * 137.5 + Math.sin(t * 0.3 + i) * 20) % CW;
    const vy = (i * 91.3 + Math.cos(t * 0.2 + i * 0.7) * 15) % (CH * 0.8);
    const vSz = 8 + (i % 4) * 3;
    const vCol = i % 3 === 0 ? '#00ccaa' : i % 3 === 1 ? '#4488ff' : '#8844cc';
    ctx.fillStyle = vCol;
    ctx.fillRect(vx, vy, vSz, vSz);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(vx + 2, vy + 2, vSz - 4, vSz - 4);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(vx + Math.floor(vSz / 2) - 1, vy + Math.floor(vSz / 2) - 1, 3, 3);
  }

  // 13. SMALL MOLECULES (20 dots) — 3x3 to 5x5 colorful
  const mCols = ['#ff88aa', '#00ccaa', '#44ff88', '#ffaa44'];
  for (let i = 0; i < 20; i++) {
    const mx = (i * 173.1 + Math.sin(t * 0.4 + i * 1.3) * 18) % CW;
    const my = (i * 113.7 + Math.cos(t * 0.3 + i * 0.9) * 12) % (CH * 0.75);
    const mSz = 3 + (i % 3);
    ctx.fillStyle = mCols[i % 4];
    ctx.fillRect(mx, my, mSz, mSz);
  }

  // 14. GROUND — dark organic, bottom 20% of frame
  ctx.fillStyle = '#040c08';
  ctx.fillRect(0, CH * 0.80, CW, CH * 0.20);
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#040c08' : '#060e0a';
    ctx.fillRect(i * (CW / 30), CH * 0.80, CW / 30, CH * 0.20);
    // Green-black moss at ground edge
    ctx.fillStyle = '#0a3014';
    ctx.fillRect(i * (CW / 30) + 2, CH * 0.80, 4, 4);
  }
}

function drawGenomeForestBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  // 1. Base + sky gradient layers
  ctx.fillStyle = '#06100a';
  ctx.fillRect(0, 0, CW, CH);
  for (let i = 0; i < 6; i++) {
    const a = (1 - i / 6) * 0.4;
    ctx.fillStyle = `rgba(5,18,8,${a})`;
    ctx.fillRect(0, i * (CH * 0.25 / 6), CW, CH * 0.25 / 6 + 2);
  }
  // Atmospheric depth
  ctx.fillStyle = 'rgba(10,40,15,0.4)';
  ctx.fillRect(0, CH * 0.05, CW, CH * 0.55);

  // 3. CHERRY BLOSSOM TREE — far left, x=CW*0.05
  const cbx = CW * 0.05;
  // Dark brown trunk 18px wide, CH*0.85 to CH*0.1
  ctx.fillStyle = '#3a1a0a';
  ctx.fillRect(cbx - 9, CH * 0.10, 18, CH * 0.75);
  // Two main branches
  ctx.fillRect(cbx - 60, CH * 0.18, 60, 7);  // left branch
  ctx.fillRect(cbx, CH * 0.14, 80, 5);         // right branch
  // Dense blossom cloud (150+ small 2x2 to 4x4 rects)
  for (let b = 0; b < 160; b++) {
    const bx2 = cbx - 60 + (b * 37) % 140;
    const by2 = CH * 0.01 + (b * 53) % (CH * 0.22);
    const bSz = 2 + b % 3;
    const bob = Math.sin(t * 0.5 + b * 0.3) * 3;
    ctx.fillStyle = b % 3 === 0 ? '#ff88cc' : b % 3 === 1 ? '#ffaadd' : '#ff66aa';
    ctx.fillRect(bx2, by2 + bob, bSz * 2, bSz * 2);
  }

  // 2. FIVE DNA HELIX TREES at x: CW*0.08, 0.24, 0.45, 0.65, 0.84
  const treeXs = [CW*0.08, CW*0.24, CW*0.45, CW*0.65, CW*0.84];
  treeXs.forEach((dx, didx) => {
    const isOuter = didx === 0 || didx === 4;
    const treeH = isOuter ? CH * 0.80 : CH;
    const treeTop = CH - treeH;
    const hRad = 22 + didx * 3;

    // Tree trunk/base: dark brown #3a1a0a, 20px wide, from bottom of helix to CH*0.8
    ctx.fillStyle = '#3a1a0a';
    ctx.fillRect(dx - 10, CH * 0.80, 20, CH * 0.20);

    // VINES: 3-4 dark green thin (4px wide) rects hanging down
    ctx.fillStyle = '#1a3008';
    for (let v = 0; v < 4; v++) {
      const vineStart = treeTop + (v * treeH * 0.22);
      ctx.fillRect(dx - 7 + v * 5, vineStart, 4, treeH * 0.28);
    }

    // DNA helix strands (14px wide each)
    const dSteps = Math.floor(treeH / 8);
    for (let i = 0; i < dSteps; i++) {
      const ang = (i / dSteps) * Math.PI * 10 + t * (0.2 + didx * 0.05);
      const hy = treeTop + i * 8;
      const lx = dx + Math.cos(ang) * hRad;
      const rx = dx + Math.cos(ang + Math.PI) * hRad;

      // Strand A: alternate #2244ff, #44aaff, #6644ff
      const aIdx = i % 3;
      ctx.fillStyle = aIdx === 0 ? '#2244ff' : aIdx === 1 ? '#44aaff' : '#6644ff';
      ctx.fillRect(lx - 7, hy, 14, 8);

      // Strand B: alternate #22aa66, #44ff88, #8844cc
      const bIdx = i % 3;
      ctx.fillStyle = bIdx === 0 ? '#22aa66' : bIdx === 1 ? '#44ff88' : '#8844cc';
      ctx.fillRect(rx - 7, hy, 14, 8);

      // Base pairs every 6 steps
      if (i % 6 === 0) {
        const bpCols = ['#ff66cc','#44ffcc','#aaff44','#ff8844'];
        ctx.fillStyle = bpCols[i % 4];
        const bpX1 = Math.min(lx, rx) + 7;
        const bpW = Math.max(2, Math.abs(rx - lx) - 14);
        ctx.fillRect(bpX1, hy + 3, bpW, 2);
      }
    }
    // Glowing top
    const glowA = 0.4 + 0.3 * Math.sin(t * 1.5 + didx);
    ctx.fillStyle = `rgba(0,255,150,${glowA})`;
    ctx.fillRect(dx - 8, treeTop - 4, 16, 8);
  });

  // 4. Stone PATH — trapezoid, bottom CW*0.4 wide at y=CH*0.80, narrows to CW*0.1 at y=CH*0.45
  const pathSteps = 22;
  for (let s = 0; s < pathSteps; s++) {
    const prog = s / pathSteps;
    const pathY = CH * 0.45 + prog * (CH * 0.80 - CH * 0.45);
    const pathW = CW * 0.10 + prog * (CW * 0.40 - CW * 0.10);
    const sliceH = (CH * 0.80 - CH * 0.45) / pathSteps + 1;
    ctx.fillStyle = s % 2 === 0 ? '#c8a87a' : '#b89060';
    ctx.fillRect(CW * 0.5 - pathW / 2, pathY, pathW, sliceH);
  }

  // 5. STREAM — x CW*0.38 to CW*0.62, y CH*0.58 to CH*0.66, animated blue-teal
  ctx.fillStyle = '#0a2030';
  ctx.fillRect(CW * 0.38, CH * 0.58, CW * 0.24, CH * 0.08);
  ctx.fillStyle = '#0d3048';
  ctx.fillRect(CW * 0.40, CH * 0.59, CW * 0.20, CH * 0.06);
  for (let rip = 0; rip < 8; rip++) {
    const ripOff = ((t * 30 + rip * 22) % 90) / 90;
    ctx.fillStyle = 'rgba(30,120,180,0.4)';
    ctx.fillRect(CW * 0.40 + ripOff * CW * 0.20, CH * 0.60 + rip * 4, 26, 3);
  }

  // 6. WOODEN BRIDGE over stream — brown planks, vertical posts
  ctx.fillStyle = '#7a5028';
  ctx.fillRect(CW * 0.36, CH * 0.58, CW * 0.12, 8);
  ctx.fillStyle = '#5a3a18';
  ctx.fillRect(CW * 0.36, CH * 0.57, CW * 0.12, 5);
  ctx.fillStyle = '#6a4520';
  for (let pl = 0; pl < 7; pl++) {
    ctx.fillRect(CW * 0.36 + pl * (CW * 0.12 / 7), CH * 0.57, 2, 8);
  }
  // Vertical posts
  ctx.fillStyle = '#4a2a10';
  ctx.fillRect(CW * 0.36, CH * 0.54, 6, CH * 0.12);
  ctx.fillRect(CW * 0.48 - 6, CH * 0.54, 6, CH * 0.12);

  // 7. WATERFALL — right side, animated column at x=CW*0.87
  ctx.fillStyle = '#0a1820';
  ctx.fillRect(CW * 0.87, CH * 0.22, 18, CH * 0.55);
  for (let w2 = 0; w2 < 6; w2++) {
    const wProg = ((t * 40 + w2 * 15) % 100) / 100;
    ctx.fillStyle = w2 % 2 === 0 ? 'rgba(150,220,255,0.6)' : 'rgba(100,180,220,0.4)';
    ctx.fillRect(CW * 0.87 + w2 * 3, CH * 0.22 + wProg * CH * 0.50, 4, 22);
  }
  ctx.fillStyle = 'rgba(50,150,200,0.25)';
  ctx.fillRect(CW * 0.83, CH * 0.75, 44, 18);

  // 8. NINE INFO PANELS
  const panels = [
    { x: CW*0.11, y: CH*0.06, title: 'BLAST',          sub: 'seq alignment',  col: '#00ff88' },
    { x: CW*0.30, y: CH*0.04, title: 'RNA-seq',         sub: 'transcriptomics', col: '#00ffcc' },
    { x: CW*0.54, y: CH*0.05, title: 'CRISPR',          sub: 'gene editing',   col: '#44ff88' },
    { x: CW*0.72, y: CH*0.10, title: 'scRNA-seq',       sub: 'single cell',    col: '#88ffcc' },
    { x: CW*0.22, y: CH*0.30, title: 'PANDAS',          sub: 'data frames',    col: '#00cc88' },
    { x: CW*0.46, y: CH*0.34, title: 'VISUALIZATION',   sub: 'plots & graphs', col: '#44ff44' },
    { x: CW*0.65, y: CH*0.20, title: 'PROTEOMICS',      sub: 'mass spec',      col: '#00ffaa' },
    { x: CW*0.78, y: CH*0.36, title: 'NETWORK BIOLOGY', sub: 'graph models',   col: '#66ff88' },
    { x: CW*0.36, y: CH*0.46, title: 'MICROBIOME',      sub: 'metagenomics',   col: '#88ff44' },
  ];
  panels.forEach(({ x, y, title, sub, col }) => {
    const bob = Math.sin(t * 0.6 + x) * 5;
    drawInfoPanel(ctx, title, sub, x, y + bob, 0.9, col);
  });

  // 9. GROUND — mossy forest floor, bottom 22% of frame
  ctx.fillStyle = '#0a180c';
  ctx.fillRect(0, CH * 0.78, CW, CH * 0.22);
  ctx.fillStyle = '#0e2010';
  ctx.fillRect(0, CH * 0.77, CW, 6);
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = i % 3 === 0 ? '#0a180c' : i % 3 === 1 ? '#0c1c0e' : '#0e2010';
    ctx.fillRect(i * (CW / 24), CH * 0.78, CW / 24, CH * 0.22);
    ctx.fillStyle = '#123018';
    ctx.fillRect(i * (CW / 24) + 2, CH * 0.78, 4, 4);
  }
}

function drawNeuralNebulaBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  // Pure void — the deepest purple-black
  ctx.fillStyle = '#020208'; ctx.fillRect(0, 0, CW, CH);

  // Dense star field with twinkling
  for (let s = 0; s < 300; s++) {
    const sx = (s * 137.5 + s*s*0.01) % CW;
    const sy = (s * 89.3 + s*s*0.007) % (CH * 0.85);
    const twinkle = 0.2 + 0.8 * Math.abs(Math.sin(t * (0.5 + s * 0.01) + s));
    const col = s % 4 === 0 ? `rgba(180,140,255,${twinkle})` : s % 4 === 1 ? `rgba(100,160,255,${twinkle*0.6})` : `rgba(255,255,255,${twinkle*0.4})`;
    ctx.fillStyle = col;
    ctx.fillRect(sx, sy, s % 7 === 0 ? 3 : 2, s % 7 === 0 ? 3 : 2);
  }

  // Constellation lines (neural network pattern in the sky)
  const nodes: [number,number][] = [
    [0.5,0.75],[0.42,0.58],[0.58,0.58],[0.32,0.44],[0.5,0.38],[0.68,0.44],
    [0.26,0.30],[0.42,0.24],[0.58,0.24],[0.74,0.30],[0.36,0.14],[0.64,0.14],[0.5,0.06],
  ];
  const conns: [number,number][] = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[3,7],[4,7],[4,8],[5,8],[5,9],[6,10],[7,10],[7,11],[8,11],[9,11],[10,12],[11,12]];

  // Draw connection lines
  conns.forEach(([a,b]) => {
    const [ax,ay] = nodes[a], [bx,by] = nodes[b];
    const pulse = 0.15 + 0.1 * Math.sin(t * 1.2 + a * 0.8);
    ctx.fillStyle = `rgba(80,40,180,${pulse})`;
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      ctx.fillRect(ax*CW + (bx-ax)*CW*i/steps, ay*CH + (by-ay)*CH*i/steps, 2, 2);
    }
  });
  // Signal pulses along connections (animated)
  conns.forEach(([a,b], ci) => {
    const [ax,ay] = nodes[a], [bx,by] = nodes[b];
    const prog = ((t * 0.8 + ci * 0.3) % 1);
    const px2 = ax*CW + (bx-ax)*CW*prog, py2 = ay*CH + (by-ay)*CH*prog;
    ctx.fillStyle = 'rgba(0,200,255,0.6)';
    ctx.fillRect(px2 - 3, py2 - 3, 6, 6);
  });
  // Draw nodes
  nodes.forEach(([nx,ny],i) => {
    const pulse2 = 0.7 + 0.3 * Math.sin(t * 2.5 + i * 0.9);
    ctx.fillStyle = i < 3 ? `rgba(0,255,255,${pulse2})` : i < 6 ? `rgba(150,80,255,${pulse2})` : `rgba(100,180,255,${pulse2})`;
    ctx.fillRect(nx*CW - 6, ny*CH - 6, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(nx*CW - 2, ny*CH - 2, 4, 4);
  });

  // LEFT CONSTELLATION CLUSTERS — 3 small star networks at x < CW*0.30
  const leftClusters: [number, number][] = [[CW*0.06, CH*0.22],[CW*0.16, CH*0.38],[CW*0.26, CH*0.14]];
  leftClusters.forEach(([clx, cly], cli) => {
    // 5-6 cluster nodes with connecting lines
    const clNodeCount = 5 + (cli % 2);
    const clNodes: [number, number][] = [];
    for (let n = 0; n < clNodeCount; n++) {
      const nx2 = clx + (n * 83.1) % 60 - 30;
      const ny2 = cly + (n * 57.3) % 50 - 25;
      clNodes.push([nx2, ny2]);
    }
    // Draw connection lines (faint pink)
    for (let n = 0; n < clNodeCount - 1; n++) {
      const [x1, y1] = clNodes[n], [x2, y2] = clNodes[n + 1];
      ctx.fillStyle = 'rgba(255,44,150,0.2)';
      const lineSteps = 12;
      for (let ls = 0; ls <= lineSteps; ls++) {
        ctx.fillRect(x1 + (x2-x1)*ls/lineSteps, y1 + (y2-y1)*ls/lineSteps, 2, 2);
      }
    }
    // Draw nodes: pink/magenta #ff44cc
    clNodes.forEach(([nx2, ny2], ni) => {
      const pulse4 = 0.6 + 0.4 * Math.sin(t * 2 + ni + cli * 1.2);
      ctx.fillStyle = `rgba(255,68,204,${pulse4})`;
      ctx.fillRect(nx2 - 3, ny2 - 3, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(nx2 - 1, ny2 - 1, 2, 2);
    });
  });

  // The great neural BRAIN TREE (right side) — the signature element from image 25
  const btx = CW * 0.72, bty = CH * 0.5;
  const brainR = 160;
  // Outer spiral glow
  for (let r = brainR; r > 20; r -= 10) {
    const a2 = 0.03 + 0.02 * Math.sin(t + r * 0.02);
    ctx.fillStyle = `rgba(60,30,180,${a2})`;
    for (let row = -r; row < r; row += 4) {
      const w = Math.sqrt(Math.max(0, r*r - row*row)) * 2;
      ctx.fillRect(btx - w/2, bty + row, w, 4);
    }
  }
  // Brain tree nodes (concentric rings)
  const ringCounts = [1, 6, 12, 8, 4];
  let ringR = 20;
  ringCounts.forEach((count, ri) => {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + t * (ri % 2 === 0 ? 0.15 : -0.1);
      const nx2 = btx + Math.cos(angle) * ringR;
      const ny2 = bty + Math.sin(angle) * ringR;
      const pulse3 = 0.7 + 0.3 * Math.sin(t * 3 + i + ri * 1.5);
      ctx.fillStyle = `rgba(0,220,255,${pulse3})`;
      ctx.fillRect(nx2 - 5, ny2 - 5, 10, 10);
      // Connect to center
      if (ri < 3) {
        ctx.fillStyle = 'rgba(60,150,255,0.15)';
        const steps2 = 15;
        for (let s = 0; s <= steps2; s++) {
          ctx.fillRect(btx + (nx2-btx)*s/steps2, bty + (ny2-bty)*s/steps2, 2, 2);
        }
      }
    }
    ringR += 30;
  });
  // Spiral galaxy center
  ctx.fillStyle = 'rgba(200,255,255,0.6)'; ctx.fillRect(btx - 4, bty - 4, 8, 8);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(btx - 2, bty - 2, 4, 4);

  // Floating crystal platforms — enhanced with small equipment on top
  const platforms: [number,number,number][] = [[0.18,0.65,100],[0.42,0.55,90],[0.78,0.62,80],[0.30,0.45,70]];
  platforms.forEach(([px2,py2,pw],i) => {
    const bob = Math.sin(t * 0.4 + i * 1.3) * 8;
    ctx.fillStyle = '#12102a'; ctx.fillRect(px2*CW - pw/2, py2*CH + bob, pw, 20);
    ctx.fillStyle = '#1e1a40'; ctx.fillRect(px2*CW - pw/2, py2*CH + bob, pw, 12);
    ctx.fillStyle = '#2a2460'; ctx.fillRect(px2*CW - pw/2, py2*CH + bob, pw, 4);
    // Shadow below
    ctx.fillStyle = 'rgba(0,0,20,0.4)'; ctx.fillRect(px2*CW - pw/2 + 10, py2*CH + bob + 22, pw - 20, 6);
    // Small equipment on platform top — 2 tiny monitor shapes (6x5 px, #44aaff)
    if (i === 0) { // Platform 1 at x=CW*0.20, y=CH*0.55
      ctx.fillStyle = '#44aaff';
      ctx.fillRect(px2*CW - pw/2 + 10, py2*CH + bob - 5, 6, 5);
      ctx.fillRect(px2*CW - pw/2 + 20, py2*CH + bob - 5, 6, 5);
      ctx.fillStyle = '#002244';
      ctx.fillRect(px2*CW - pw/2 + 11, py2*CH + bob - 4, 4, 3);
      ctx.fillRect(px2*CW - pw/2 + 21, py2*CH + bob - 4, 4, 3);
    }
    // Add a small equipment piece to other platforms too
    if (i === 1) {
      ctx.fillStyle = '#44aaff';
      ctx.fillRect(px2*CW - pw/2 + 8, py2*CH + bob - 5, 6, 5);
      ctx.fillRect(px2*CW - pw/2 + 18, py2*CH + bob - 5, 6, 5);
    }
  });

  // Purple amethyst crystals (bottom corners and sides)
  const crystalPos: [number,number][] = [[0.04,0.72],[0.12,0.78],[0.88,0.70],[0.94,0.76],[0.22,0.82]];
  crystalPos.forEach(([cx2,cy2],i) => {
    for (let c = 0; c < 6; c++) {
      const ch2 = 25 + c * 12;
      const cw2 = 8 + c * 2;
      const glow = 0.4 + 0.4 * Math.sin(t * 0.8 + c + i * 0.7);
      ctx.fillStyle = `rgba(100,0,200,${glow})`;
      ctx.fillRect(cx2*CW - 25 + c * 11, cy2*CH - ch2, cw2, ch2);
      ctx.fillStyle = `rgba(180,80,255,${glow * 0.4})`;
      ctx.fillRect(cx2*CW - 23 + c * 11, cy2*CH - ch2, Math.floor(cw2/3), Math.floor(ch2/3));
    }
  });

  // Info panels (ML topics from reference image — all 12 kept)
  const nPanels = [
    { x: CW*0.06, y: CH*0.08, title: 'NEURAL NETWORKS',  sub: 'deep learning',   col: '#4488ff' },
    { x: CW*0.22, y: CH*0.18, title: 'CLASSICAL ML',     sub: 'SVM, forests',    col: '#88aaff' },
    { x: CW*0.40, y: CH*0.04, title: 'TRANSFORMERS',     sub: 'attention',       col: '#aa44ff' },
    { x: CW*0.58, y: CH*0.10, title: 'MODEL EVAL',       sub: 'metrics & CV',    col: '#6688ff' },
    { x: CW*0.82, y: CH*0.06, title: 'PYTORCH',          sub: 'tensor ops',      col: '#ff6644' },
    { x: CW*0.80, y: CH*0.26, title: 'XAI / SHAP',       sub: 'explainability',  col: '#aa88ff' },
    { x: CW*0.72, y: CH*0.44, title: 'CAUSAL INF.',      sub: 'A causes B',      col: '#88ddff' },
    { x: CW*0.22, y: CH*0.56, title: 'RL DRUG DESIGN',   sub: 'reward optim.',   col: '#4488ff' },
    { x: CW*0.42, y: CH*0.48, title: 'FOUNDATION MDLS',  sub: 'large scale',     col: '#aa66ff' },
    { x: CW*0.60, y: CH*0.55, title: 'BAYESIAN UQ',      sub: 'uncertainty',     col: '#66aaff' },
    { x: CW*0.02, y: CH*0.42, title: 'MULTI-MODAL',      sub: 'text + vision',   col: '#88aaff' },
    { x: CW*0.80, y: CH*0.60, title: 'FEDERATED LEARN',  sub: 'distributed',     col: '#6688ff' },
  ];
  nPanels.forEach(({ x, y, title, sub, col }) => {
    const bob = Math.sin(t * 0.5 + x * 0.01) * 4;
    drawInfoPanel(ctx, title, sub, x, y + bob, 0.85, col);
  });

  // Ground (void floor)
  ctx.fillStyle = '#080620'; ctx.fillRect(0, CH*0.85, CW, CH*0.15);
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#0a0820' : '#06040e';
    ctx.fillRect(i * (CW/24), CH*0.85, CW/24, CH*0.15);
  }
}

function drawProteinCathedralBG(ctx: CanvasRenderingContext2D, CW: number, CH: number, t: number) {
  // Gothic cathedral — dark purple stone
  ctx.fillStyle = '#0e0c1e'; ctx.fillRect(0, 0, CW, CH);

  // High ceiling vaults
  ctx.fillStyle = '#120e22'; ctx.fillRect(0, 0, CW, CH * 0.08);
  // Ribbed vaulting
  for (let v = 0; v < 8; v++) {
    const vx = (CW / 8) * v + CW/16;
    ctx.fillStyle = '#1e1838';
    ctx.fillRect(vx - 2, 0, 4, CH * 0.3);
    ctx.fillRect(vx - 8, CH * 0.28, 16, 4);
  }

  // STAINED GLASS (center window — the defining cathedral element)
  const winX = CW * 0.32, winY = 0, winW = CW * 0.36, winH = CH * 0.58;
  // Ambient light beam from window
  ctx.fillStyle = 'rgba(180,140,255,0.03)';
  ctx.fillRect(winX, 0, winW, CH * 0.85);

  // Window frame arch (gothic pointed)
  ctx.fillStyle = '#2a2040';
  ctx.fillRect(winX - 8, winY, winW + 16, winH + 8);
  ctx.fillRect(winX - 4, winY, winW + 8, winH + 4);

  // Glass panels (geometric colored tiles)
  const glassColors = ['#1a44cc','#2255ee','#6622aa','#8833bb','#cc8800','#ee9900','#1a8844','#22aa55','#cc2222'];
  const cols2 = 14, rows2 = 12;
  for (let gy = 0; gy < rows2; gy++) {
    for (let gx = 0; gx < cols2; gx++) {
      const glow = 0.4 + 0.2 * Math.sin(t * 0.5 + gx + gy);
      const gcol = glassColors[(gx * 3 + gy * 5) % glassColors.length];
      const r = parseInt(gcol.slice(1,3),16), g2 = parseInt(gcol.slice(3,5),16), b = parseInt(gcol.slice(5,7),16);
      ctx.fillStyle = `rgba(${r},${g2},${b},${glow})`;
      ctx.fillRect(winX + 4 + gx * (winW-8)/cols2, winY + 4 + gy * winH*0.9/rows2, (winW-8)/cols2 - 1, winH*0.9/rows2 - 1);
    }
  }
  // Lead lines (dividers)
  ctx.fillStyle = '#180e28';
  for (let gx = 0; gx <= cols2; gx++) ctx.fillRect(winX + 3 + gx * (winW-8)/cols2, winY, 2, winH);
  for (let gy = 0; gy <= rows2; gy++) ctx.fillRect(winX, winY + 3 + gy * winH*0.9/rows2, winW, 2);
  // DNA helix in center of window
  for (let i = 0; i < 20; i++) {
    const ang = (i/20) * Math.PI * 4 + t * 0.2;
    const hy = winH * 0.05 + i * (winH * 0.85 / 20);
    const dhx = winX + winW/2;
    ctx.fillStyle = 'rgba(255,220,100,0.9)';
    ctx.fillRect(dhx + Math.cos(ang)*18 - 4, hy, 8, 7);
    ctx.fillStyle = 'rgba(200,160,255,0.9)';
    ctx.fillRect(dhx + Math.cos(ang+Math.PI)*18 - 4, hy, 8, 7);
    if (i % 3 === 0) {
      const x1 = dhx + Math.cos(ang)*18, x2 = dhx + Math.cos(ang+Math.PI)*18;
      ctx.fillStyle = 'rgba(255,255,150,0.7)';
      ctx.fillRect(Math.min(x1,x2), hy+2, Math.abs(x2-x1), 2);
    }
  }

  // SIDE STAINED GLASS WINDOWS — 3 on left wall, 3 on right wall
  const sideGlass = ['#1a44cc','#6622aa','#cc8800','#1a8844','#cc2222','#8833bb'];
  // Left wall windows at x≈CW*0.05, 0.12, 0.19
  [CW*0.05, CW*0.12, CW*0.19].forEach((wx, wi) => {
    ctx.fillStyle = '#1a1430';
    ctx.fillRect(wx - 2, 0, 44, CH * 0.35 + 4);
    for (let pRow = 0; pRow < 4; pRow++) {
      for (let pCol = 0; pCol < 6; pCol++) {
        const gPulse = 0.3 + 0.2 * Math.sin(t * 0.4 + pCol + pRow + wi);
        const gc = sideGlass[(pCol + pRow * 2 + wi) % sideGlass.length];
        const gr = parseInt(gc.slice(1,3),16), gg = parseInt(gc.slice(3,5),16), gb = parseInt(gc.slice(5,7),16);
        ctx.fillStyle = `rgba(${gr},${gg},${gb},${gPulse})`;
        ctx.fillRect(wx + pCol * 6, pRow * (CH * 0.35 / 4) + 4, 5, CH * 0.35 / 4 - 2);
      }
    }
    ctx.fillStyle = '#180e28';
    for (let pCol = 0; pCol <= 6; pCol++) ctx.fillRect(wx + pCol * 6 - 1, 0, 2, CH * 0.35);
    for (let pRow = 0; pRow <= 4; pRow++) ctx.fillRect(wx - 1, pRow * (CH * 0.35 / 4), 42, 2);
  });
  // Right wall windows at x≈CW*0.81, 0.88, 0.95
  [CW*0.81, CW*0.88, CW*0.95].forEach((wx, wi) => {
    ctx.fillStyle = '#1a1430';
    ctx.fillRect(wx - 2, 0, 44, CH * 0.35 + 4);
    for (let pRow = 0; pRow < 4; pRow++) {
      for (let pCol = 0; pCol < 6; pCol++) {
        const gPulse = 0.3 + 0.2 * Math.sin(t * 0.4 + pCol + pRow + wi + 3);
        const gc = sideGlass[(pCol * 2 + pRow + wi + 2) % sideGlass.length];
        const gr = parseInt(gc.slice(1,3),16), gg = parseInt(gc.slice(3,5),16), gb = parseInt(gc.slice(5,7),16);
        ctx.fillStyle = `rgba(${gr},${gg},${gb},${gPulse})`;
        ctx.fillRect(wx + pCol * 6, pRow * (CH * 0.35 / 4) + 4, 5, CH * 0.35 / 4 - 2);
      }
    }
    ctx.fillStyle = '#180e28';
    for (let pCol = 0; pCol <= 6; pCol++) ctx.fillRect(wx + pCol * 6 - 1, 0, 2, CH * 0.35);
    for (let pRow = 0; pRow <= 4; pRow++) ctx.fillRect(wx - 1, pRow * (CH * 0.35 / 4), 42, 2);
  });

  // Stone pillars (6 pairs matching the image)
  const pillarXs = [0.07, 0.18, 0.82, 0.93];
  pillarXs.forEach((px2) => {
    const pw = 28;
    ctx.fillStyle = '#1a1430'; ctx.fillRect(px2*CW - pw/2 - 4, 0, pw + 8, CH * 0.82);
    ctx.fillStyle = '#201a38'; ctx.fillRect(px2*CW - pw/2, 0, pw, CH * 0.82);
    ctx.fillStyle = '#2a2248'; ctx.fillRect(px2*CW - pw/2 + 4, 0, pw - 8, CH * 0.82);
    // Stone courses (horizontal lines)
    for (let sc = 0; sc < 15; sc++) {
      ctx.fillStyle = '#180e28';
      ctx.fillRect(px2*CW - pw/2 - 4, sc * (CH*0.82/15), pw + 8, 2);
    }
    // Capital (decorative top)
    ctx.fillStyle = '#30284a'; ctx.fillRect(px2*CW - pw/2 - 12, 0, pw + 24, 20);
    ctx.fillStyle = '#3a3060'; ctx.fillRect(px2*CW - pw/2 - 14, 0, pw + 28, 8);
    // Gold accent line
    ctx.fillStyle = 'rgba(255,170,0,0.3)'; ctx.fillRect(px2*CW - pw/2 + 4, 0, 4, CH * 0.82);
    // Base
    ctx.fillStyle = '#20183a'; ctx.fillRect(px2*CW - pw/2 - 8, CH*0.78, pw + 16, 16);
  });

  // DNA HELIX MOTIF on LEFT WALL: x=CW*0.02 to CW*0.06, glowing pink #cc44aa and purple #9922cc
  const wallDnaX = CW * 0.04;
  const wallDnaTop = CH * 0.04, wallDnaBot = CH * 0.72;
  const wallDnaSteps = Math.floor((wallDnaBot - wallDnaTop) / 7);
  for (let i = 0; i < wallDnaSteps; i++) {
    const ang = (i / wallDnaSteps) * Math.PI * 7 + t * 0.3;
    const hy = wallDnaTop + i * 7;
    const rad = 10;
    const ax = wallDnaX + Math.cos(ang) * rad;
    const bx = wallDnaX + Math.cos(ang + Math.PI) * rad;
    ctx.fillStyle = '#cc44aa';
    ctx.fillRect(ax - 3, hy, 6, 5);
    ctx.fillStyle = '#9922cc';
    ctx.fillRect(bx - 3, hy, 6, 5);
    if (i % 4 === 0) {
      ctx.fillStyle = 'rgba(200,80,200,0.5)';
      ctx.fillRect(Math.min(ax, bx) + 3, hy + 2, Math.max(1, Math.abs(bx - ax) - 6), 1);
    }
  }

  // Side gargoyle/statue silhouettes (from the image — stone guardians)
  ([[0.27,0.52],[0.73,0.52]] as [number,number][]).forEach(([sx,sy]) => {
    ctx.fillStyle = '#18142a';
    ctx.fillRect(sx*CW - 12, sy*CH, 24, 35);
    ctx.fillRect(sx*CW - 8, sy*CH - 12, 16, 14);
    ctx.fillStyle = '#1e1830';
    ctx.fillRect(sx*CW - 10, sy*CH - 2, 20, 30);
  });

  // CENTRAL PROTEIN (floating glowing structure — key reference image element)
  const protX = CW * 0.5, protY = CH * 0.44;
  const protBob = Math.sin(t * 0.6) * 12;
  // Glow halo
  ctx.fillStyle = `rgba(80,20,200,${0.06 + 0.04*Math.sin(t)})`;
  ctx.fillRect(protX - 80, protY + protBob - 80, 160, 160);
  ctx.fillStyle = `rgba(120,40,255,${0.08 + 0.05*Math.sin(t*1.3)})`;
  ctx.fillRect(protX - 50, protY + protBob - 50, 100, 100);
  // Protein structure (alpha helix + beta sheet representation)
  for (let h = 0; h < 10; h++) {
    const ang = h * 0.65 + t * 0.25;
    const pr = 30 - h * 2;
    ctx.fillStyle = h % 2 === 0 ? '#2233bb' : '#4466ff';
    ctx.fillRect(protX + Math.cos(ang)*pr - 8, protY + protBob + h*8 - 40, 16, 10);
    ctx.fillStyle = h % 2 === 0 ? '#88aaff' : '#aabbff';
    ctx.fillRect(protX + Math.cos(ang)*pr - 4, protY + protBob + h*8 - 38, 8, 4);
  }
  // Beta sheets
  for (let b = 0; b < 4; b++) {
    ctx.fillStyle = '#3355bb';
    ctx.fillRect(protX - 30 + b*16, protY + protBob - 10, 12, 20);
    ctx.fillStyle = '#88aaee'; ctx.fillRect(protX - 29 + b*16, protY + protBob - 9, 4, 6);
    // Arrow tip
    ctx.fillStyle = '#4466cc'; ctx.fillRect(protX - 32 + b*16, protY + protBob + 8, 16, 5);
  }

  // Enhanced altar steps — circular 4-tier using stacked rects (each tier 30px wider than next)
  for (let s = 0; s < 4; s++) {
    const tierW = CW * 0.20 + s * 30;
    const tierX = CW * 0.5 - tierW / 2;
    const tierY = CH * 0.68 + s * 7;
    ctx.fillStyle = '#14102a';
    ctx.fillRect(tierX, tierY, tierW, 7);
    ctx.fillStyle = '#1c1638';
    ctx.fillRect(tierX, tierY, tierW, 3);
    // Circular approximation: draw concentric rects narrowing toward edge
    for (let cr = 0; cr < 3; cr++) {
      const crW = tierW - cr * 8;
      const crX = CW * 0.5 - crW / 2;
      ctx.fillStyle = cr === 0 ? '#1e1a3c' : cr === 1 ? '#16122e' : '#12102a';
      ctx.fillRect(crX, tierY + cr * 1, crW, 2);
    }
  }

  // Electric light column below protein
  const lightA = 0.3 + 0.2 * Math.sin(t * 2);
  ctx.fillStyle = `rgba(100,50,255,${lightA})`;
  ctx.fillRect(CW*0.49, protY + protBob + 40, 14, CH*0.68 - (protY + protBob + 40));

  // Purple amethyst crystals (corners + sides)
  const catCrystals: [number,number][] = [[0.02,0.65],[0.25,0.78],[0.75,0.76],[0.97,0.68]];
  catCrystals.forEach(([cx2,cy2],i) => {
    for (let c = 0; c < 5; c++) {
      const ch2 = 30 + c * 15;
      const glow = 0.5 + 0.4 * Math.sin(t * 0.7 + c * 0.8 + i);
      ctx.fillStyle = `rgba(120,0,220,${glow})`;
      ctx.fillRect(cx2*CW - 20 + c * 10, cy2*CH - ch2, 8, ch2);
      ctx.fillStyle = `rgba(200,100,255,${glow * 0.3})`;
      ctx.fillRect(cx2*CW - 18 + c * 10, cy2*CH - ch2, 3, Math.floor(ch2/4));
    }
  });

  // Info panels
  const cPanels = [
    { x: CW*0.06, y: CH*0.12, title: 'ALPHAFOLD',     sub: 'structure pred.', col: '#4488ff' },
    { x: CW*0.28, y: CH*0.06, title: 'STRUCT. BIO',   sub: 'X-ray, cryo-EM',  col: '#88aaff' },
    { x: CW*0.62, y: CH*0.04, title: 'GNNs',          sub: 'graph networks',  col: '#aa66ff' },
    { x: CW*0.80, y: CH*0.10, title: 'GEN. MODELS',   sub: 'diffusion',       col: '#cc88ff' },
    { x: CW*0.06, y: CH*0.38, title: 'DRUG PIPELINES',sub: 'ADMET & dock',    col: '#88ccff' },
    { x: CW*0.28, y: CH*0.50, title: 'METABOLIC FBA', sub: 'flux balance',    col: '#66aaff' },
    { x: CW*0.66, y: CH*0.38, title: 'VIRTUAL SCREEN',sub: 'docking',         col: '#aa88ff' },
    { x: CW*0.66, y: CH*0.52, title: 'SPATIAL TRANS.',sub: 'cell mapping',    col: '#88aaff' },
  ];
  cPanels.forEach(({ x, y, title, sub, col }) => {
    const bob = Math.sin(t * 0.45 + x * 0.01) * 5;
    drawInfoPanel(ctx, title, sub, x, y + bob, 0.88, col);
  });

  // CHECKERED FLOOR — more prominent, tiles 36px at front narrowing to 18px at middle
  const floorY = CH * 0.78;
  // Back section (smaller tiles, 18px, perspective vanishing point)
  for (let ty = 0; ty < 5; ty++) {
    for (let tx2 = 0; tx2 < 28; tx2++) {
      ctx.fillStyle = (tx2 + ty) % 2 === 0 ? '#18162a' : '#22203a';
      ctx.fillRect(tx2*(CW/28), floorY + ty*18, CW/28, 18);
      // Grid lines
      ctx.fillStyle = '#0e0c18';
      ctx.fillRect(tx2*(CW/28), floorY + ty*18, 1, 18);
      ctx.fillRect(tx2*(CW/28), floorY + ty*18, CW/28, 1);
    }
  }
  // Front section (larger tiles, 36px)
  const frontFloorY = floorY + 5 * 18;
  for (let ty = 0; ty < 5; ty++) {
    for (let tx2 = 0; tx2 < 14; tx2++) {
      ctx.fillStyle = (tx2 + ty) % 2 === 0 ? '#18162a' : '#22203a';
      ctx.fillRect(tx2*(CW/14), frontFloorY + ty*36, CW/14, 36);
      // Grid lines
      ctx.fillStyle = '#0e0c18';
      ctx.fillRect(tx2*(CW/14), frontFloorY + ty*36, 2, 36);
      ctx.fillRect(tx2*(CW/14), frontFloorY + ty*36, CW/14, 2);
      // Sheen on lighter tiles
      if ((tx2 + ty) % 2 === 0) {
        ctx.fillStyle = 'rgba(200,180,255,0.04)';
        ctx.fillRect(tx2*(CW/14)+2, frontFloorY + ty*36+2, CW/14-4, 10);
      }
    }
  }
}

// ─── State types ──────────────────────────────────────────────────────────────
interface AnimState {
  startTime: number;
  phase: string;
  playerX: number; playerY: number;
  playerPose: PlayerPose;
  playerPhase: number;
  enzymeX: number; enzymeY: number;
  enzymePose: EnzymePose;
  enzymeFacing: 'left'|'right';
  enzymePhase: number;
  dialogueText: string;
  dialogueChar: number;
  dialogueSpeaker: 'enzyme'|'player';
  dialogueVisible: boolean;
  dialogueSub: string;
  signAlpha: number;
  terminalLines: number;
  fadeAlpha: number;
  impactFlash: number;
  canSkip: boolean;
  done: boolean;
  rafId: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WorldEntryAnimation({ realm, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { avatar } = useGameStore();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const state = useRef<AnimState>({
    startTime: -1, phase: 'init',
    playerX: -80, playerY: 0,
    playerPose: 'walk', playerPhase: 0,
    enzymeX: -80, enzymeY: 0,
    enzymePose: 'walk', enzymeFacing: 'right',
    enzymePhase: 0,
    dialogueText: '', dialogueChar: 0, dialogueSpeaker: 'enzyme', dialogueVisible: false, dialogueSub: '',
    signAlpha: 0, terminalLines: 0, fadeAlpha: 1,
    impactFlash: 0, canSkip: false, done: false, rafId: 0,
  });

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = state.current;
    if (s.startTime < 0) s.startTime = ts;
    const t = (ts - s.startTime) / 1000;

    if (!s.canSkip && t > 2) s.canSkip = true;

    const CW = canvas.width, CH = canvas.height;
    const groundY = CH * 0.76;
    const accentColor = realm === 1 ? '#00ffaa' : realm === 2 ? '#52b788' : realm === 3 ? '#a855f7' : '#c0a0ff';

    // ── Draw background ───────────────────────────────────────────────────────
    if      (realm === 1) drawCytoplasmBG(ctx, CW, CH, t);
    else if (realm === 2) drawGenomeForestBG(ctx, CW, CH, t);
    else if (realm === 3) drawNeuralNebulaBG(ctx, CW, CH, t);
    else                  drawProteinCathedralBG(ctx, CW, CH, t);

    // ── Per-realm animation timelines ─────────────────────────────────────────

    if (realm === 1) {
      // Cytoplasm: Player JUST got thrown through the portal by Enzyme.
      // They already know each other from the void — Enzyme is smug, player is NOT pleased.
      // Timeline: Player tumbles in → stumbles upright → Enzyme bounces in behind → smug sit
      //           → two-line dialogue exchange → welcome sign + terminal

      if (t < 0.5) s.fadeAlpha = Math.max(0, 1 - t / 0.5);
      else s.fadeAlpha = 0;

      // Player TUMBLES in from the left — momentum of being thrown (0.5–1.8s)
      if (t >= 0.5 && t < 1.8) {
        const prog = (t - 0.5) / 1.3;
        const bounce = Math.abs(Math.sin(prog * Math.PI * 2.5)) * (1 - prog) * 40;
        s.playerX = -40 + prog * (CW * 0.38 + 40);
        s.playerY = -bounce;
        s.playerPhase = t * 12; // fast stumble phase
        s.playerPose = 'walk';
      }
      // Player plants feet, clearly annoyed (1.8s+)
      if (t >= 1.8) {
        s.playerX = CW * 0.38;
        s.playerY = 0;
        s.playerPose = 'stand';
        s.playerPhase = 0;
      }

      // Enzyme hops through portal behind player, bouncy and proud (1.4–2.5s)
      if (t >= 1.4 && t < 2.5) {
        const prog = (t - 1.4) / 1.1;
        const hop = Math.abs(Math.sin(prog * Math.PI * 3)) * (1 - prog) * 30;
        s.enzymeX = -30 + prog * (CW * 0.52 + 30);
        s.enzymeY = -hop;
        s.enzymePhase = t * 10;
        s.enzymePose = 'excited';
        s.enzymeFacing = 'right';
      }
      // Enzyme settles in a proud sit next to player (2.5s+)
      if (t >= 2.5) {
        s.enzymeX = CW * 0.52;
        s.enzymeY = 0;
        s.enzymePose = 'sit';
        s.enzymePhase = t;
        s.enzymeFacing = 'right'; // facing player's direction, smug
      }

      // Enzyme speaks — smug meow (2.8–4.6s)
      if (t >= 2.8 && t < 4.6) {
        s.dialogueVisible = true;
        s.dialogueSpeaker = 'enzyme';
        s.dialogueText = 'Meow!';
        s.dialogueSub = "*(See?! That was a GREAT entrance. You're welcome.)*";
        s.dialogueChar = Math.min(s.dialogueText.length, (t - 2.8) * 22);
      }
      // Player responds (4.6–6.5s)
      if (t >= 4.6 && t < 6.5) {
        s.dialogueSpeaker = 'player';
        s.dialogueText = '...you threw me through a portal.';
        s.dialogueSub = '';
        s.dialogueChar = Math.min(s.dialogueText.length, (t - 4.6) * 18);
      }
      // Enzyme final (6.5–8.2s)
      if (t >= 6.5 && t < 8.2) {
        s.dialogueSpeaker = 'enzyme';
        s.dialogueText = 'Meow.';
        s.dialogueSub = '*(I told you the portal was fine.)*';
        s.dialogueChar = Math.min(s.dialogueText.length, (t - 6.5) * 20);
      }
      if (t >= 8.2) { s.dialogueVisible = false; }

      // Sign + terminal
      if (t >= 7.0) s.signAlpha = Math.min(1, (t - 7.0) / 1.2);
      if (t >= 8.0) s.terminalLines = Math.floor((t - 8.0) / 0.3) + 1;
      if (t >= 10.5 && !s.done) { s.done = true; onCompleteRef.current(); return; }
    }

    else if (realm === 2) {
      // Genome Forest: both walk together, look at each other, then RUN and JUMP in
      if (t < 0.8) s.fadeAlpha = Math.max(0, 1 - t / 0.8);
      else s.fadeAlpha = 0;

      // Both walk in from left (0.8–2.2s)
      if (t >= 0.8 && t < 2.2) {
        const prog = (t - 0.8) / 1.4;
        s.playerX = -60 + prog * (CW * 0.25 + 60);
        s.enzymeX = s.playerX + 55;
        s.playerPhase = t * 7; s.enzymePhase = t * 8;
        s.playerPose = 'walk'; s.enzymePose = 'walk';
        s.enzymeFacing = 'right';
      }
      // Both slow and stop — looking up at the DNA trees in awe (2.2–3.4s)
      if (t >= 2.2 && t < 3.4) {
        s.playerX = CW * 0.25; s.enzymeX = CW * 0.37;
        s.playerPose = 'stand'; s.enzymePhase = t;
        // Enzyme looks UP with excited pose
        s.enzymePose = 'excited'; s.enzymeFacing = 'right';
      }
      // Enzyme meow — awe at DNA trees (2.6–4.3s)
      if (t >= 2.6 && t < 4.3) {
        s.dialogueVisible = true; s.dialogueSpeaker = 'enzyme';
        s.dialogueText = 'Meow meow!';
        s.dialogueSub = "*(Trees made of DNA. I've wanted to see this.)*";
        s.dialogueChar = Math.min(s.dialogueText.length, (t - 2.6) * 20);
      }
      // Both RUN right — can't contain excitement (4.2–5.5s)
      if (t >= 4.2 && t < 5.5) {
        s.dialogueVisible = false;
        const prog = (t - 4.2) / 1.3;
        s.playerX = CW * 0.25 + prog * CW * 0.45;
        s.enzymeX = CW * 0.37 + prog * CW * 0.45;
        s.playerPhase = t * 14; s.enzymePhase = t * 16;
        s.playerPose = 'run'; s.enzymePose = 'excited';
      }
      // JUMP together over first DNA branch (5.5–6.3s)
      if (t >= 5.5 && t < 6.3) {
        const prog = Math.sin(((t - 5.5) / 0.8) * Math.PI);
        s.playerX = CW * 0.68 + (t - 5.5) * CW * 0.1;
        s.enzymeX = s.playerX + 60;
        s.playerY = -prog * 80;
        s.enzymeY = -prog * 100;
        s.playerPose = 'jump'; s.enzymePose = 'fly';
        s.enzymeFacing = 'right';
      }
      // Disappear into world (6.3s+)
      if (t >= 6.3) {
        s.playerX = CW + 100; s.enzymeX = CW + 200;
        s.playerY = 0; s.enzymeY = 0;
      }

      if (t >= 6.0) s.signAlpha = Math.min(1, (t - 6.0) / 1.2);
      if (t >= 7.0) s.terminalLines = Math.floor((t - 7.0) / 0.3) + 1;
      if (t >= 9.0 && !s.done) { s.done = true; onCompleteRef.current(); return; }
    }

    else if (realm === 3) {
      // Neural Nebula: player walks carefully, Enzyme FLIES IN and TACKLES them
      if (t < 0.8) s.fadeAlpha = Math.max(0, 1 - t / 0.8);
      else s.fadeAlpha = 0;

      // Player walks in alone carefully (0.8–2.5s)
      if (t >= 0.8 && t < 2.5) {
        const prog = (t - 0.8) / 1.7;
        s.playerX = -60 + prog * (CW * 0.45 + 60);
        s.playerPhase = t * 6; s.playerPose = 'walk';
      }
      if (t >= 2.5 && t < 3.0) {
        s.playerX = CW * 0.45; s.playerPose = 'stand'; s.playerPhase = 0;
      }

      // Enzyme FLIES in from upper-left at high speed (3.0–3.8s)
      if (t >= 3.0 && t < 3.8) {
        const prog = (t - 3.0) / 0.8;
        s.enzymeX = -80 + prog * (CW * 0.45 + 90);
        s.enzymeY = -(1 - prog) * CH * 0.3; // descends from upper area
        s.enzymePose = 'fly'; s.enzymeFacing = 'right'; s.enzymePhase = t * 20;
      }
      // IMPACT (3.8–4.2s)
      if (t >= 3.8 && t < 4.2) {
        s.impactFlash = Math.max(0, 1 - (t - 3.8) / 0.4);
        s.enzymeX = CW * 0.45; s.enzymeY = 0;
        s.playerPose = 'lying'; s.playerPhase = t;
        s.enzymePose = 'sit'; s.enzymePhase = t;
        // Enzyme sits on player (right after impact position)
        s.enzymeX = s.playerX + 20;
      }
      // Enzyme sits on fallen player (4.2s+)
      if (t >= 4.2) {
        s.playerX = CW * 0.45; s.playerPose = 'lying'; s.playerPhase = t;
        s.enzymeX = s.playerX + 15; s.enzymeY = 0;
        s.enzymePose = 'sit'; s.enzymePhase = t;
      }
      // Dialogue (4.5–7.5s) — 2 lines
      if (t >= 4.5 && t < 6.2) {
        s.dialogueVisible = true; s.dialogueSpeaker = 'enzyme';
        s.dialogueText = 'Meow!';
        s.dialogueSub = '*(Sorry. I got excited. You\'re fine.)*';
        s.dialogueChar = Math.min(s.dialogueText.length, (t - 4.5) * 18);
      }
      if (t >= 6.2 && t < 8.0) {
        s.dialogueSpeaker = 'player';
        s.dialogueText = '...you had ONE job.';
        s.dialogueSub = '';
        s.dialogueChar = Math.min(s.dialogueText.length, (t - 6.2) * 18);
      }

      if (t >= 6.5) s.signAlpha = Math.min(1, (t - 6.5) / 1.2);
      if (t >= 7.5) s.terminalLines = Math.floor((t - 7.5) / 0.3) + 1;
      if (t >= 9.5 && !s.done) { s.done = true; onCompleteRef.current(); return; }
    }

    else {
      // Protein Cathedral: player walks in, Enzyme descends and hops on head
      if (t < 0.8) s.fadeAlpha = Math.max(0, 1 - t / 0.8);
      else s.fadeAlpha = 0;

      // Player walks in solemnly (0.8–2.8s)
      if (t >= 0.8 && t < 2.8) {
        const prog = (t - 0.8) / 2.0;
        s.playerX = -60 + prog * (CW * 0.35 + 60);
        s.playerPhase = t * 5; s.playerPose = 'walk';
      }
      if (t >= 2.8) { s.playerX = CW * 0.35; s.playerPose = 'stand'; s.playerPhase = 0; }

      // Enzyme descends from above (3.2–4.2s)
      if (t >= 3.2 && t < 4.2) {
        const prog = (t - 3.2) / 1.0;
        s.enzymeX = s.playerX + 5;
        s.enzymeY = -(1 - prog) * CH * 0.5;
        s.enzymePose = 'walk'; s.enzymeFacing = 'right'; s.enzymePhase = t;
      }
      // Enzyme hops onto head (4.2s+)
      if (t >= 4.2) {
        s.enzymePose = 'onhead';
        s.enzymeX = s.playerX + 5;
        s.enzymeY = 0;
        s.enzymePhase = t;
      }

      // Dialogue (4.6–7.5s) — canon: meow with subtitle "This is the last one. I know."
      if (t >= 4.6) {
        s.dialogueVisible = true; s.dialogueSpeaker = 'enzyme';
        s.dialogueText = 'Mrow.';
        s.dialogueSub = '*(This is the last one. I know.)*';
        s.dialogueChar = Math.min(s.dialogueText.length, (t - 4.6) * 16);
      }

      // Both walk forward together (5.8–7.5s) — player walking, enzyme on head
      if (t >= 5.8 && t < 7.5) {
        const prog = (t - 5.8) / 1.7;
        s.playerX = CW * 0.35 + prog * CW * 0.3;
        s.playerPhase = t * 6; s.playerPose = 'enzymehead';
        s.enzymeX = s.playerX + 5;
      }

      if (t >= 6.0) s.signAlpha = Math.min(1, (t - 6.0) / 1.2);
      if (t >= 7.0) s.terminalLines = Math.floor((t - 7.0) / 0.3) + 1;
      if (t >= 9.0 && !s.done) { s.done = true; onCompleteRef.current(); return; }
    }

    // ── Draw characters ───────────────────────────────────────────────────────

    const py = groundY + s.playerY;

    // Impact flash (realm 3)
    if (s.impactFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${s.impactFlash * 0.6})`;
      ctx.fillRect(0, 0, CW, CH);
      // Impact star burst
      const ix = s.playerX, iy = groundY;
      ctx.fillStyle = `rgba(255,255,100,${s.impactFlash})`;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r = 30 + 40 * s.impactFlash;
        ctx.fillRect(ix + Math.cos(a)*r - 5, iy + Math.sin(a)*r/2 - 5, 10, 10);
      }
    }

    // Player
    if (s.playerX > -120 && s.playerX < CW + 120) {
      drawPlayer(ctx, s.playerX, py, s.playerPhase, avatar, s.playerPose);
    }

    // Enzyme
    const ez = groundY + s.enzymeY;
    if (s.enzymePose === 'onhead') {
      // Enzyme drawn above player's head
      drawEnzyme(ctx, s.enzymeX, py - CS * 26, s.enzymePhase, 'onhead', s.enzymeFacing);
      drawPlayer(ctx, s.playerX, py, s.playerPhase, avatar, 'walk');
    } else if (s.enzymeX > -120 && s.enzymeX < CW + 120) {
      drawEnzyme(ctx, s.enzymeX, ez, s.enzymePhase, s.enzymePose, s.enzymeFacing);
    }

    // ── UI elements ───────────────────────────────────────────────────────────

    // Dialogue
    if (s.dialogueVisible) {
      drawDialogue(ctx, s.dialogueText, s.dialogueChar, s.dialogueSpeaker, CW, CH, accentColor,
        s.dialogueSpeaker === 'enzyme' && s.dialogueSub ? s.dialogueSub : undefined);
    }

    // Welcome sign
    drawWelcomeSign(ctx, realm, s.signAlpha, CH);

    // Terminal
    if (s.terminalLines > 0) {
      drawTerminal(ctx, realm, s.terminalLines, CW, CH);
    }

    // Fade overlay
    if (s.fadeAlpha > 0) {
      ctx.fillStyle = `rgba(0,0,0,${s.fadeAlpha})`;
      ctx.fillRect(0, 0, CW, CH);
    }

    s.rafId = requestAnimationFrame(draw);
  }, [realm, avatar]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    state.current.startTime = -1;
    state.current.rafId = requestAnimationFrame(draw);

    const skip = (e: KeyboardEvent | MouseEvent) => {
      if (!state.current.canSkip) return;
      cancelAnimationFrame(state.current.rafId);
      onCompleteRef.current();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    return () => {
      cancelAnimationFrame(state.current.rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click', skip);
    };
  }, [draw]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#000' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
      />
      <div style={{
        position: 'absolute', bottom: 16, right: 20,
        color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontSize: 11,
        pointerEvents: 'none',
      }}>
        [ CLICK or SPACE to skip ]
      </div>
    </div>
  );
}
