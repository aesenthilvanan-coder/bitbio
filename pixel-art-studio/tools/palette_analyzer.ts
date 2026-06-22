/**
 * BitBio Palette Analyzer
 *
 * Takes an array of hex color strings and produces a detailed analysis
 * of the palette's quality, consistency, and pixel-art suitability.
 *
 * Usage:
 *   import { analyzePalette } from './palette_analyzer';
 *   const report = analyzePalette([
 *     '#f4c08a', '#c88040', '#2a1a0a', '#d8e0f0',
 *     '#a0aac0', '#00ccdd', '#f8f0c8', '#6a7888',
 *   ]);
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HSB {
  h: number;   // 0–360
  s: number;   // 0–100
  b: number;   // 0–100
}

export interface ColorEntry {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsb: HSB;
}

export interface PaletteIssue {
  type: 'pure-black' | 'pure-white' | 'too-similar' | 'missing-midtone' |
        'flat-shadow' | 'over-saturation' | 'under-saturation' | 'no-warm-cool-contrast';
  severity: 'error' | 'warning' | 'info';
  colors?: string[];   // Hex values involved
  description: string;
  fix: string;
}

export interface PaletteAnalysisReport {
  colors: ColorEntry[];
  colorCount: number;
  score: number;       // 0–100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  hueDistribution: {
    warm: number;    // colors in warm range (H 0–60, 300–360)
    cool: number;    // colors in cool range (H 180–270)
    neutral: number; // desaturated colors (S < 20%)
  };
  valueRamp: {
    hasFullRange: boolean;     // dark to light range >= 50B
    stepCount: number;         // distinct value levels
    evenlySpaced: boolean;     // steps are roughly even
  };
  saturationProfile: {
    min: number; max: number; average: number;
    hasHighSaturationAccent: boolean; // at least one S > 70%
  };
  issues: PaletteIssue[];
  suggestions: string[];
}

// ─── Conversion Utilities ─────────────────────────────────────────────────────

/**
 * Parses a 6-digit hex string (with or without #) to {r, g, b}.
 */
function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/**
 * Converts RGB (0–255 each) to HSB (H: 0–360, S/B: 0–100).
 */
function rgbToHSB(r: number, g: number, b: number): HSB {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const delta = max - min;

  let h = 0;
  if (delta > 0) {
    if (max === rN) h = 60 * (((gN - bN) / delta) % 6);
    else if (max === gN) h = 60 * ((bN - rN) / delta + 2);
    else h = 60 * ((rN - gN) / delta + 4);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const brightness = max * 100;

  return { h: Math.round(h), s: Math.round(s), b: Math.round(brightness) };
}

/**
 * Euclidean distance between two colors in RGB space.
 */
function colorDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number }
): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

// ─── Analyzer ─────────────────────────────────────────────────────────────────

/**
 * Analyzes a palette of hex color strings for pixel art quality.
 */
export function analyzePalette(hexColors: string[]): PaletteAnalysisReport {
  const colors: ColorEntry[] = hexColors.map(hex => {
    const rgb = hexToRGB(hex);
    return { hex, rgb, hsb: rgbToHSB(rgb.r, rgb.g, rgb.b) };
  });

  const issues: PaletteIssue[] = [];
  const suggestions: string[] = [];

  // ── Check 1: Pure black / pure white ────────────────────────────────────────
  const pureBlacks  = colors.filter(c => c.rgb.r < 5  && c.rgb.g < 5  && c.rgb.b < 5);
  const pureWhites  = colors.filter(c => c.rgb.r > 250 && c.rgb.g > 250 && c.rgb.b > 250);

  if (pureBlacks.length > 0) {
    issues.push({
      type: 'pure-black',
      severity: 'warning',
      colors: pureBlacks.map(c => c.hex),
      description: `Pure black (${pureBlacks.map(c => c.hex).join(', ')}) detected. Pure black outlines look harsh and flat.`,
      fix: 'Replace pure black with a very dark desaturated hue relevant to the character (e.g., #0d0d1a for blue-themed sprites, #1a0d00 for warm sprites).',
    });
  }

  if (pureWhites.length > 0) {
    issues.push({
      type: 'pure-white',
      severity: 'info',
      colors: pureWhites.map(c => c.hex),
      description: `Pure white (${pureWhites.map(c => c.hex).join(', ')}) detected. Pure white is acceptable for small specular highlights but not surface color.`,
      fix: 'Use pure white only for 1×1px specular highlights. Replace surface whites with off-white (#f0f0f0 or tinted).',
    });
  }

  // ── Check 2: Too-similar colors ─────────────────────────────────────────────
  const TOO_SIMILAR_THRESHOLD = 15; // RGB Euclidean distance
  const similarPairs: [string, string][] = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const dist = colorDistance(colors[i].rgb, colors[j].rgb);
      if (dist < TOO_SIMILAR_THRESHOLD) {
        similarPairs.push([colors[i].hex, colors[j].hex]);
      }
    }
  }

  if (similarPairs.length > 0) {
    issues.push({
      type: 'too-similar',
      severity: 'warning',
      colors: similarPairs.flat(),
      description: `${similarPairs.length} pair(s) of too-similar colors (RGB distance < ${TOO_SIMILAR_THRESHOLD}): ${similarPairs.map(p => `${p[0]}↔${p[1]}`).join(', ')}`,
      fix: 'Merge very similar colors to one, or increase the difference by expanding value step size. Every palette entry must justify its existence.',
    });
  }

  // ── Check 3: Value range ─────────────────────────────────────────────────────
  const brightnessValues = colors.map(c => c.hsb.b).sort((a, b) => a - b);
  const minB = brightnessValues[0];
  const maxB = brightnessValues[brightnessValues.length - 1];
  const hasFullRange = (maxB - minB) >= 50; // need at least 50% brightness spread

  // Count distinct value levels (within ±8% brightness considered same level)
  let stepCount = 1;
  for (let i = 1; i < brightnessValues.length; i++) {
    if (brightnessValues[i] - brightnessValues[i - 1] > 8) stepCount++;
  }

  // Check for even spacing
  let evenlySpaced = true;
  if (stepCount >= 3) {
    const expectedStep = (maxB - minB) / (stepCount - 1);
    for (let i = 1; i < brightnessValues.length - 1; i++) {
      if (Math.abs(brightnessValues[i] - brightnessValues[i-1] - expectedStep) > 15) {
        evenlySpaced = false;
        break;
      }
    }
  }

  if (!hasFullRange) {
    issues.push({
      type: 'missing-midtone',
      severity: 'error',
      description: `Value range too narrow: darkest=${minB}%, lightest=${maxB}% (spread: ${maxB - minB}%). Need at least 50% spread for depth.`,
      fix: 'Add a darker shadow color (B < 20%) or a brighter highlight (B > 80%). Both are better.',
    });
  }

  if (stepCount < 3 && hexColors.length >= 4) {
    issues.push({
      type: 'missing-midtone',
      severity: 'warning',
      description: `Only ${stepCount} distinct value level(s) in ${hexColors.length}-color palette. Minimum 3 levels (shadow/mid/highlight) for any surface.`,
      fix: 'Add intermediate value between darkest and lightest colors for proper 3D surface rendering.',
    });
  }

  // ── Check 4: Flat shadow detection ──────────────────────────────────────────
  // Flat shadow = darker colors have SAME hue as mid-tones (no hue shift)
  const sortedByBrightness = [...colors].sort((a, b) => a.hsb.b - b.hsb.b);
  if (sortedByBrightness.length >= 3) {
    const dark = sortedByBrightness[0].hsb;
    const mid  = sortedByBrightness[Math.floor(sortedByBrightness.length / 2)].hsb;
    const hueShift = Math.abs(dark.h - mid.h);
    const shadowIsFlatGray = dark.s < 15 && mid.s > 20;
    const noHueShift = hueShift < 10 && dark.s > 15; // saturation exists but hue didn't shift

    if (shadowIsFlatGray) {
      issues.push({
        type: 'flat-shadow',
        severity: 'warning',
        colors: [sortedByBrightness[0].hex],
        description: 'Shadow appears to be desaturated gray rather than hue-shifted dark.',
        fix: 'Add hue-character to shadows. Shift shadow hue 15–30° toward blue/purple. Even slightly blue-tinted dark is more interesting than gray-dark.',
      });
    } else if (noHueShift) {
      issues.push({
        type: 'flat-shadow',
        severity: 'info',
        description: `Shadow hue is within ${hueShift}° of mid-tone. Hue shift of 15–30° toward cool would add depth.`,
        fix: 'Shift shadow hue slightly cooler (toward blue/purple for warm characters, toward indigo for cool characters).',
      });
    }
  }

  // ── Check 5: Saturation analysis ────────────────────────────────────────────
  const saturations = colors.map(c => c.hsb.s);
  const minS = Math.min(...saturations);
  const maxS = Math.max(...saturations);
  const avgS = saturations.reduce((a, b) => a + b, 0) / saturations.length;
  const hasHighSatAccent = maxS >= 70;

  if (maxS > 95 && colors.filter(c => c.hsb.s > 90).length > 3) {
    issues.push({
      type: 'over-saturation',
      severity: 'warning',
      colors: colors.filter(c => c.hsb.s > 90).map(c => c.hex),
      description: `Multiple very high saturation colors (S > 90%). This creates visual noise.`,
      fix: 'Reserve S > 80% for 1–2 accent colors only. Lower other colors\' saturation by 15–25%.',
    });
  }

  if (avgS < 20 && hexColors.length > 4) {
    issues.push({
      type: 'under-saturation',
      severity: 'warning',
      description: `Average saturation ${avgS.toFixed(0)}% is very low. Palette may appear dull.`,
      fix: 'Add at least one color with S > 50% as an accent. Even a small amount of color breaks monotony.',
    });
  }

  // ── Check 6: Warm/cool contrast ─────────────────────────────────────────────
  const warmColors = colors.filter(c => c.hsb.s > 20 && (c.hsb.h <= 60 || c.hsb.h >= 300));
  const coolColors = colors.filter(c => c.hsb.s > 20 && c.hsb.h >= 170 && c.hsb.h <= 280);

  if (warmColors.length === 0 && coolColors.length > 0 && hexColors.length > 6) {
    issues.push({
      type: 'no-warm-cool-contrast',
      severity: 'info',
      description: 'No warm colors. All chromatic colors are cool.',
      fix: 'Add a warm highlight (even a slight yellow-warm to the brightest color) for natural lighting.',
    });
  } else if (coolColors.length === 0 && warmColors.length > 0 && hexColors.length > 6) {
    issues.push({
      type: 'no-warm-cool-contrast',
      severity: 'info',
      description: 'No cool colors. All chromatic colors are warm.',
      fix: 'Add cool shadows (blue or purple-shifted darks) for depth and contrast.',
    });
  }

  // ── Hue Distribution ─────────────────────────────────────────────────────────
  const hueDistribution = {
    warm:    colors.filter(c => c.hsb.s > 15 && (c.hsb.h <= 60 || c.hsb.h >= 300)).length,
    cool:    colors.filter(c => c.hsb.s > 15 && c.hsb.h > 150 && c.hsb.h < 300).length,
    neutral: colors.filter(c => c.hsb.s <= 15).length,
  };

  // ── Suggestions ──────────────────────────────────────────────────────────────
  if (!hasHighSatAccent) {
    suggestions.push('Add 1 high-saturation accent color (S > 70%) for visual punch and interest.');
  }
  if (stepCount < 4 && hexColors.length >= 6) {
    suggestions.push('Build a 5-step value ramp: deep shadow → shadow → mid → highlight → bright highlight.');
  }
  if (similarPairs.length > 2) {
    suggestions.push('Palette has redundant entries. Reduce to minimum needed — every color should have unique work to do.');
  }
  if (!evenlySpaced && stepCount >= 3) {
    suggestions.push('Value steps are unevenly spaced. A perceptually even value ramp creates more predictable shading.');
  }

  // ── Score Calculation ─────────────────────────────────────────────────────────
  let score = 100;

  // Deductions for errors
  const errorCount   = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  score -= errorCount * 20;
  score -= warningCount * 8;
  score -= issues.filter(i => i.severity === 'info').length * 3;

  // Bonus for best practices
  if (hasHighSatAccent) score += 5;
  if (evenlySpaced && stepCount >= 4) score += 5;
  if (warmColors.length > 0 && coolColors.length > 0) score += 5; // warm/cool contrast present

  score = Math.max(0, Math.min(100, score));

  const grade: PaletteAnalysisReport['grade'] =
    score >= 95 ? 'S' : score >= 85 ? 'A' : score >= 75 ? 'B' :
    score >= 65 ? 'C' : score >= 50 ? 'D' : 'F';

  return {
    colors,
    colorCount: colors.length,
    score,
    grade,
    passed: score >= 75,
    hueDistribution,
    valueRamp: { hasFullRange, stepCount, evenlySpaced },
    saturationProfile: { min: minS, max: maxS, average: avgS, hasHighSaturationAccent: hasHighSatAccent },
    issues,
    suggestions,
  };
}

// ─── BitBio Built-in Palettes ────────────────────────────────────────────────

/** Pre-defined BitBio character palettes for quick validation. */
export const BITBIO_PALETTES: Record<string, string[]> = {
  elliot: ['#f4c08a','#c88040','#2a1a0a','#5a3a18','#d8e0f0','#a0aac0','#00ccdd','#f8f0c8','#f0e870','#6a7888','#4a5868','#2a2a36','#cc2200','#ddcc00','#0044aa','#f0f8ff'],
  ben:    ['#c89060','#9a6030','#1a0a00','#2a6020','#1a4010','#44aa44','#6a7030','#4a5018','#3a1e0a','#c89040','#44aa00','#cc2222','#eecc22','#2a1a00'],
  alex:   ['#e8b888','#b87840','#0a0610','#0a0a14','#1a1a2a','#f0f0f0','#303040','#909090','#ffffff','#c0d0ff','#e8a000','#1a0800'],
  henry:  ['#d0f0ff','#b0d8f8','#90b8e8','#00aaff','#44ddff','#aaffff','#ffffff','#002244','#60c8f8','#40a0e0'],
  enzyme: ['#f0f0f0','#d8d8d8','#c0c0c0','#ff8899','#cc6677','#00ddcc','#ffaa00','#2a2a2a','#ffffff','#80d8d0'],
  realm1: ['#1a3a44','#0f2530','#0d2040','#1a0035','#00ffcc','#020609'],
  realm2: ['#162a0a','#0d1e05','#1c1008','#051a2a','#00ff44','#020602'],
  realm3: ['#14083a','#0e052a','#0a0528','#030008','#aa44ff','#030008'],
  realm4: ['#1e1438','#160f30','#0c0a1c','#100820','#ffaa00','#040210'],
};
