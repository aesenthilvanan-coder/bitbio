/**
 * BitBio Sprite Generator
 * Generates pixel art sprite data as TileInstruction arrays (fillRect call sequences).
 * All sprites follow Undertale/OMORI/Pokemon B/W design principles.
 * Output is rendered via renderTile() from tileset-generator.ts.
 */

import type { TileInstruction, TileData } from './tileset-generator';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CharacterConfig {
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  outfitSecondary?: string;
  eyeColor?: string;
  hairStyle?: 'short' | 'medium' | 'long' | 'ponytail' | 'curly';
  gender?: 'default';
}

export interface SpriteFrames {
  idle: TileData[];       // 2 frames
  walkDown: TileData[];   // 4 frames
  walkUp: TileData[];     // 4 frames
  walkLeft: TileData[];   // 4 frames
  walkRight: TileData[];  // 4 frames
  width: number;          // game pixels
  height: number;         // game pixels
}

// ─── Low-Level Builder ────────────────────────────────────────────────────────

function px(x: number, y: number, w: number, h: number, color: string): TileInstruction {
  return { x, y, w, h, color };
}

// Derive shadow (darker, hue-shifted cool) from base color
function shadowOf(hex: string, amount = 40): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.max(0, r - amount - 10);
  const ng = Math.max(0, g - amount);
  const nb = Math.min(255, b - amount + 15); // cool shift
  return `#${[nr,ng,nb].map(v => v.toString(16).padStart(2,'0')).join('')}`;
}

// Derive highlight (lighter, hue-shifted warm) from base color
function highlightOf(hex: string, amount = 40): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.min(255, r + amount + 10); // warm shift
  const ng = Math.min(255, g + amount + 5);
  const nb = Math.min(255, b + amount);
  return `#${[nr,ng,nb].map(v => v.toString(16).padStart(2,'0')).join('')}`;
}

// ─── Player Character Sprite ──────────────────────────────────────────────────
// 10×20 game pixels. S=3 → 30×60 CSS pixels. Clear silhouette: round head, body, legs.

export function generateCharacterSprite(config: CharacterConfig): SpriteFrames {
  const {
    skinColor, hairColor, outfitColor,
    outfitSecondary = shadowOf(outfitColor, 30),
    eyeColor = '#1a1a1a',
    hairStyle = 'medium',
  } = config;

  const skinShadow = shadowOf(skinColor, 30);
  const skinHigh = highlightOf(skinColor, 20);
  const hairShadow = shadowOf(hairColor, 25);
  const outfitHigh = highlightOf(outfitColor, 25);
  const OUTLINE = '#0a0a0a';

  // ── Base: facing down (front view), neutral pose ───────────────────────────

  function buildBase(legOffset: [number, number] = [0, 0], headBob = 0): TileData {
    const [leftLeg, rightLeg] = legOffset;
    const d: TileData = [];

    // --- Outline rectangle (full character area, then filled over) ---
    // This gives correct Undertale-style outline without pixel-by-pixel work

    // Hair (top, extends 1px left and right of head)
    d.push(px(1, 0 + headBob, 8, 1, OUTLINE));           // top of hair
    d.push(px(0, 1 + headBob, 10, 1, hairShadow));        // hair side left
    d.push(px(1, 1 + headBob, 8, 3, hairColor));          // hair main
    d.push(px(2, 1 + headBob, 6, 2, highlightOf(hairColor, 15))); // hair highlight

    // Head outline
    d.push(px(1, 4 + headBob, 8, 7, OUTLINE));
    d.push(px(2, 4 + headBob, 6, 6, skinColor));          // skin main
    d.push(px(2, 4 + headBob, 6, 2, skinHigh));           // forehead highlight
    d.push(px(2, 9 + headBob, 6, 1, skinShadow));         // chin shadow

    // Eyes (2×2 per eye, dark)
    d.push(px(2, 6 + headBob, 2, 2, eyeColor));
    d.push(px(6, 6 + headBob, 2, 2, eyeColor));
    // Eye whites
    d.push(px(2, 6 + headBob, 1, 1, '#ffffff'));
    d.push(px(6, 6 + headBob, 1, 1, '#ffffff'));
    // Mouth (1px smile)
    d.push(px(3, 8 + headBob, 4, 1, skinShadow));
    d.push(px(4, 8 + headBob, 2, 1, OUTLINE));

    // Neck
    d.push(px(4, 10, 2, 1, skinColor));

    // Body outline
    d.push(px(1, 11, 8, 6, OUTLINE));
    d.push(px(2, 11, 6, 5, outfitColor));
    d.push(px(2, 11, 6, 1, outfitHigh));                  // shoulder highlight
    d.push(px(2, 15, 6, 1, outfitSecondary));              // bottom edge darker

    // Arms (skin)
    d.push(px(0, 11, 1, 5, outfitColor));  // left arm sleeve
    d.push(px(9, 11, 1, 5, outfitColor));  // right arm sleeve
    d.push(px(0, 15, 1, 2, skinColor));    // left hand
    d.push(px(9, 15, 1, 2, skinColor));    // right hand

    // Legs outline
    d.push(px(1, 17, 3, 3, OUTLINE));
    d.push(px(6, 17, 3, 3, OUTLINE));
    // Left leg
    d.push(px(2, 17 + leftLeg, 2, 2, outfitSecondary));
    d.push(px(2, 19 + leftLeg, 2, 1, OUTLINE));           // shoe
    // Right leg
    d.push(px(7, 17 + rightLeg, 2, 2, outfitSecondary));
    d.push(px(7, 19 + rightLeg, 2, 1, OUTLINE));          // shoe

    return d;
  }

  function buildBack(legOffset: [number, number] = [0, 0], headBob = 0): TileData {
    const [leftLeg, rightLeg] = legOffset;
    const d: TileData = [];

    // Hair (back view — more hair visible)
    d.push(px(1, 0 + headBob, 8, 5, hairColor));
    d.push(px(0, 1 + headBob, 10, 3, hairShadow));        // hair sides hang down
    d.push(px(1, 0 + headBob, 8, 2, highlightOf(hairColor, 20)));

    // Head (back)
    d.push(px(1, 4 + headBob, 8, 6, skinShadow));         // back of head, no face
    d.push(px(2, 4 + headBob, 6, 2, skinColor));
    d.push(px(3, 4 + headBob, 4, 1, skinHigh));           // crown highlight

    // Neck
    d.push(px(4, 10, 2, 1, skinShadow));

    // Body (back)
    d.push(px(1, 11, 8, 6, OUTLINE));
    d.push(px(2, 11, 6, 5, outfitSecondary));
    d.push(px(2, 11, 6, 1, outfitColor));
    d.push(px(0, 11, 1, 5, outfitSecondary));
    d.push(px(9, 11, 1, 5, outfitSecondary));

    // Legs
    d.push(px(2, 17 + leftLeg, 2, 2, outfitSecondary));
    d.push(px(7, 17 + rightLeg, 2, 2, outfitSecondary));
    d.push(px(2, 19 + leftLeg, 2, 1, OUTLINE));
    d.push(px(7, 19 + rightLeg, 2, 1, OUTLINE));

    return d;
  }

  function buildSide(dir: 'left' | 'right', legOffset: [number, number] = [0, 0], headBob = 0): TileData {
    const [leftLeg, rightLeg] = legOffset;
    const d: TileData = [];

    // Hair side view
    const hairX = dir === 'left' ? 0 : 2;
    d.push(px(1, 0 + headBob, 7, 1, OUTLINE));
    d.push(px(hairX, 1 + headBob, 8, 4, hairColor));
    d.push(px(hairX + 1, 1 + headBob, 5, 2, highlightOf(hairColor, 15)));

    // Head side view
    d.push(px(1, 4 + headBob, 7, 6, OUTLINE));
    d.push(px(2, 4 + headBob, 5, 5, skinColor));
    d.push(px(2, 4 + headBob, 5, 1, skinHigh));

    // Single eye (facing side)
    const eyeX = dir === 'left' ? 2 : 5;
    d.push(px(eyeX, 6 + headBob, 2, 2, eyeColor));
    d.push(px(eyeX, 6 + headBob, 1, 1, '#ffffff'));
    // Nose suggestion
    const noseX = dir === 'left' ? 2 : 6;
    d.push(px(noseX, 8 + headBob, 1, 1, skinShadow));

    // Neck
    d.push(px(4, 10, 2, 1, skinColor));

    // Body side
    d.push(px(1, 11, 7, 6, OUTLINE));
    d.push(px(2, 11, 5, 5, outfitColor));
    d.push(px(2, 11, 5, 1, outfitHigh));

    // Arms: front arm and back arm
    const frontArmX = dir === 'left' ? 1 : 6;
    const backArmX = dir === 'left' ? 7 : 0;
    d.push(px(frontArmX, 11, 2, 6, outfitColor));
    d.push(px(frontArmX, 16, 2, 1, skinColor));           // hand
    d.push(px(backArmX, 11, 2, 5, outfitSecondary));
    d.push(px(backArmX, 15, 2, 1, skinShadow));

    // Legs side
    d.push(px(3, 17 + leftLeg, 3, 3, outfitSecondary));
    d.push(px(3, 19 + leftLeg, 3, 1, OUTLINE));
    if (Math.abs(leftLeg - rightLeg) > 0) {
      d.push(px(5, 17 + rightLeg, 2, 3, shadowOf(outfitSecondary, 15)));
      d.push(px(5, 19 + rightLeg, 2, 1, OUTLINE));
    }

    return d;
  }

  // Generate all frame variations
  const walkOffsets: Array<[number, number]> = [[0,0],[-1,1],[0,0],[1,-1]];

  return {
    idle: [
      buildBase([0,0], 0),
      buildBase([0,0], 0), // slight variation: blink could go here
    ],
    walkDown: walkOffsets.map((off, i) => buildBase(off, i % 2 === 1 ? 0 : 0)),
    walkUp: walkOffsets.map((off, i) => buildBack(off, 0)),
    walkLeft: walkOffsets.map((off, i) => buildSide('left', off, 0)),
    walkRight: walkOffsets.map((off, i) => buildSide('right', off, 0)),
    width: 10,
    height: 20,
  };
}

// ─── Enzyme (Mentor Cat) Sprite ───────────────────────────────────────────────
// 8×12 game pixels. Floating cat with labcoat and giant expressive eyes.

export function generateEnzymeSprite(mood: 'happy' | 'annoyed' | 'excited'): SpriteFrames {
  const OUTLINE = '#0a0a0a';
  const body = '#f5f5f5';
  const bodyShad = '#d0d0e0';
  const bodyHigh = '#ffffff';
  const labCoat = '#e8e8ff';
  const coatShad = '#b8b8dd';
  const pawColor = '#f0f0f0';

  function buildEnzyme(floatOffset = 0, blinkOpen = true): TileData {
    const d: TileData = [];
    const fo = floatOffset;

    // Body (rounded rectangle — cat body)
    d.push(px(1, 2 + fo, 6, 7, OUTLINE));
    d.push(px(2, 2 + fo, 4, 6, body));
    d.push(px(2, 2 + fo, 4, 1, bodyHigh));
    d.push(px(2, 7 + fo, 4, 1, bodyShad));

    // Lab coat collar
    d.push(px(2, 5 + fo, 4, 3, labCoat));
    d.push(px(3, 5 + fo, 2, 3, body));                    // coat opening
    d.push(px(2, 8 + fo, 4, 1, coatShad));

    // Ears (cat ears, triangular via staircase)
    d.push(px(1, 0 + fo, 1, 2, OUTLINE));                 // left ear
    d.push(px(2, 0 + fo, 1, 1, body));
    d.push(px(6, 0 + fo, 1, 2, OUTLINE));                 // right ear
    d.push(px(5, 0 + fo, 1, 1, body));

    // Eyes (giant, expressive — Enzyme's defining feature)
    if (mood === 'happy' || mood === 'excited') {
      // Large happy crescent eyes
      d.push(px(1, 3 + fo, 3, 3, '#1a1a2a'));             // left eye bg
      d.push(px(4, 3 + fo, 3, 3, '#1a1a2a'));             // right eye bg
      d.push(px(1, 3 + fo, 3, 1, blinkOpen ? '#5588ff' : '#1a1a2a'));  // iris
      d.push(px(4, 3 + fo, 3, 1, blinkOpen ? '#5588ff' : '#1a1a2a'));
      d.push(px(1, 3 + fo, 1, 1, '#ffffff'));              // gleam
      d.push(px(4, 3 + fo, 1, 1, '#ffffff'));
      if (mood === 'excited') {
        d.push(px(0, 3 + fo, 1, 1, '#ff88ff'));           // sparkle
        d.push(px(7, 3 + fo, 1, 1, '#ff88ff'));
      }
    } else {
      // Annoyed: narrow squinting eyes
      d.push(px(1, 4 + fo, 3, 1, '#1a1a2a'));
      d.push(px(4, 4 + fo, 3, 1, '#1a1a2a'));
      d.push(px(1, 4 + fo, 1, 1, '#3355cc'));
      d.push(px(4, 4 + fo, 1, 1, '#3355cc'));
    }

    // Tiny cat nose (triangle via fillRect stack)
    d.push(px(3, 6 + fo, 2, 1, '#ffaacc'));

    // Whiskers (1px lines)
    d.push(px(0, 6 + fo, 1, 1, bodyShad));
    d.push(px(7, 6 + fo, 1, 1, bodyShad));

    // Paws (floating below body)
    d.push(px(1, 9 + fo, 2, 2, OUTLINE));
    d.push(px(2, 9 + fo, 1, 1, pawColor));
    d.push(px(5, 9 + fo, 2, 2, OUTLINE));
    d.push(px(5, 9 + fo, 1, 1, pawColor));

    // Tail (to the right of body, animated)
    d.push(px(7, 6 + fo, 1, 4, OUTLINE));
    d.push(px(7, 6 + fo, 1, 3, body));

    return d;
  }

  return {
    idle: [buildEnzyme(0, true), buildEnzyme(1, false)],  // float up+down + blink
    walkDown: [buildEnzyme(0), buildEnzyme(1), buildEnzyme(0), buildEnzyme(1)],
    walkUp: [buildEnzyme(0), buildEnzyme(1), buildEnzyme(0), buildEnzyme(1)],
    walkLeft: [buildEnzyme(0), buildEnzyme(1), buildEnzyme(0), buildEnzyme(1)],
    walkRight: [buildEnzyme(0), buildEnzyme(1), buildEnzyme(0), buildEnzyme(1)],
    width: 8,
    height: 12,
  };
}

// ─── Generic NPC Sprites ──────────────────────────────────────────────────────

export function generateNPCSprite(npcType: 'elliot' | 'ben' | 'alex' | 'henry'): SpriteFrames {
  const configs: Record<string, CharacterConfig> = {
    elliot: { skinColor: '#c68642', hairColor: '#2a1a0a', outfitColor: '#e0e0e0', outfitSecondary: '#aaaaaa', eyeColor: '#00cccc' },
    ben: { skinColor: '#d4956a', hairColor: '#8b5e3c', outfitColor: '#2d5a27', outfitSecondary: '#1a3a17', eyeColor: '#3a2a1a' },
    alex: { skinColor: '#d4a07a', hairColor: '#1a1a1a', outfitColor: '#1a1a1a', outfitSecondary: '#111111', eyeColor: '#2a2a4a' },
    henry: { skinColor: '#00ffff', hairColor: '#00cccc', outfitColor: '#00cccc', outfitSecondary: '#009999', eyeColor: '#ffffff' },
  };
  return generateCharacterSprite(configs[npcType] ?? configs.elliot);
}

// ─── Enemy Sprites (Per Realm) ────────────────────────────────────────────────

export function generateEnemySprite(type: string, realm: 1 | 2 | 3 | 4): SpriteFrames {
  // Enemy designs follow color-temperature rule: warm accent on dark bg
  const realmColors = {
    1: { accent: '#00ffcc', secondary: '#00aaff', base: '#0a1a22' },
    2: { accent: '#00ff44', secondary: '#44cc00', base: '#0a1a05' },
    3: { accent: '#aa44ff', secondary: '#ff44aa', base: '#100820' },
    4: { accent: '#ffaa00', secondary: '#ff6600', base: '#18121f' },
  }[realm];

  const OUTLINE = '#0a0a0a';

  function buildEnemy(frame: 0 | 1): TileData {
    const d: TileData = [];
    const pulse = frame === 1;

    // Core body: dark mass with realm-accent highlights
    d.push(px(2, 2, 8, 10, OUTLINE));
    d.push(px(3, 3, 6, 8, realmColors.base));
    d.push(px(3, 3, 6, 2, pulse ? realmColors.accent : realmColors.secondary));

    // Eyes (threat indicator: red-shifted always)
    d.push(px(4, 5, 2, 2, pulse ? '#ff4444' : '#cc2222'));
    d.push(px(7, 5, 2, 2, pulse ? '#ff4444' : '#cc2222'));
    d.push(px(4, 5, 1, 1, '#ffaaaa'));
    d.push(px(7, 5, 1, 1, '#ffaaaa'));

    // Realm-specific appendages
    if (realm === 1) {
      // Cytoplasm enemy: membrane spikes
      d.push(px(1, 2, 1, 3, realmColors.accent));
      d.push(px(10, 3, 1, 3, realmColors.accent));
      d.push(px(5, 1, 2, 2, realmColors.accent));
    } else if (realm === 2) {
      // Genome enemy: DNA strand arms
      d.push(px(0, 4, 3, 1, realmColors.secondary));
      d.push(px(9, 4, 3, 1, realmColors.secondary));
      d.push(px(0, 6, 3, 1, realmColors.accent));
      d.push(px(9, 6, 3, 1, realmColors.accent));
    } else if (realm === 3) {
      // Neural enemy: electric tendrils
      d.push(px(1, 1, 1, 1, pulse ? realmColors.accent : '#000000'));
      d.push(px(3, 0, 1, 2, pulse ? realmColors.secondary : '#000000'));
      d.push(px(8, 0, 1, 2, pulse ? realmColors.accent : '#000000'));
      d.push(px(10, 1, 1, 1, pulse ? realmColors.secondary : '#000000'));
    } else {
      // Cathedral enemy: gothic crown
      d.push(px(3, 0, 1, 3, realmColors.accent));
      d.push(px(6, 0, 2, 3, realmColors.accent));
      d.push(px(9, 0, 1, 3, realmColors.accent));
    }

    // Shadow beneath
    d.push(px(3, 12, 6, 1, '#050505'));

    return d;
  }

  const f0 = buildEnemy(0), f1 = buildEnemy(1);
  return { idle: [f0, f1], walkDown: [f0, f1, f0, f1], walkUp: [f0, f1, f0, f1], walkLeft: [f0, f1, f0, f1], walkRight: [f0, f1, f0, f1], width: 12, height: 14 };
}
