/**
 * BitBio Animation Scorer
 * Evaluates animation quality against pixel art principles from Undertale, OMORI, Pokemon B/W.
 */

import { hexToHSL, hexToRGB } from './palette-analyzer';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Sprite {
  width: number;
  height: number;
  pixels: string[][];   // hex colors, '' = transparent
  name?: string;
}

export interface AnimationScore {
  overall: number;       // 0–100
  silhouetteConsistency: number;
  colorConsistency: number;
  motionReadability: number;
  timing: TimingScore;
  issues: AnimationIssue[];
  recommendations: string[];
}

export interface TimingScore {
  score: number;
  frameCount: number;
  recommendedMs: number;
  assessment: string;
}

export interface AnimationIssue {
  severity: 'critical' | 'warning' | 'suggestion';
  frame?: number;
  rule: string;
  description: string;
}

export interface BounceReport {
  hasBounce: boolean;
  bounceFrames: number[];
  squashDetected: boolean;
  stretchDetected: boolean;
  score: number;
  notes: string[];
}

export interface SmearSuggestion {
  betweenFrames: [number, number];
  direction: 'horizontal' | 'vertical' | 'diagonal';
  intensity: 'light' | 'medium' | 'heavy';
  reason: string;
}

export interface TimingReport {
  isValid: boolean;
  issues: string[];
  suggestedTimings: number[];
  overallFeel: 'too-fast' | 'snappy' | 'natural' | 'slow' | 'too-slow';
}

// ─── Core Helpers ─────────────────────────────────────────────────────────────

function getOpaquePixels(sprite: Sprite): Array<{ x: number; y: number; color: string }> {
  const result: Array<{ x: number; y: number; color: string }> = [];
  for (let y = 0; y < sprite.height; y++) {
    for (let x = 0; x < sprite.width; x++) {
      const c = sprite.pixels[y]?.[x] ?? '';
      if (c && c !== 'transparent') result.push({ x, y, color: c });
    }
  }
  return result;
}

function getBoundingBox(sprite: Sprite): { x: number; y: number; w: number; h: number } {
  const pixels = getOpaquePixels(sprite);
  if (pixels.length === 0) return { x: 0, y: 0, w: 0, h: 0 };
  const xs = pixels.map(p => p.x);
  const ys = pixels.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function getSilhouetteMask(sprite: Sprite): boolean[][] {
  return sprite.pixels.map(row =>
    row.map(c => !!(c && c !== 'transparent'))
  );
}

function silhouetteSimilarity(a: Sprite, b: Sprite): number {
  if (a.width !== b.width || a.height !== b.height) {
    return 0.3; // different sizes = low consistency
  }
  let matching = 0, total = 0;
  for (let y = 0; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      const aFilled = !!(a.pixels[y]?.[x]);
      const bFilled = !!(b.pixels[y]?.[x]);
      total++;
      if (aFilled === bFilled) matching++;
    }
  }
  return matching / total;
}

function getUniqueColors(sprite: Sprite): Set<string> {
  const colors = new Set<string>();
  for (const row of sprite.pixels) {
    for (const c of row) {
      if (c && c !== 'transparent') colors.add(c.toLowerCase());
    }
  }
  return colors;
}

function colorSetSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  const union = new Set([...a, ...b]);
  const intersection = [...a].filter(c => b.has(c));
  return intersection.length / union.size;
}

// ─── Walk Cycle Scorer ────────────────────────────────────────────────────────

export function scoreWalkCycle(frames: Sprite[]): AnimationScore {
  const issues: AnimationIssue[] = [];
  const recommendations: string[] = [];

  if (frames.length < 2) {
    return {
      overall: 0,
      silhouetteConsistency: 0,
      colorConsistency: 0,
      motionReadability: 0,
      timing: { score: 0, frameCount: frames.length, recommendedMs: 150, assessment: 'Needs at least 2 frames' },
      issues: [{ severity: 'critical', rule: 'minimum-frames', description: 'Walk cycle needs at least 2 frames' }],
      recommendations: ['Add more frames: minimum 2, ideal 4'],
    };
  }

  // 1. Silhouette consistency across frames
  let silhouetteSum = 0;
  for (let i = 0; i < frames.length - 1; i++) {
    silhouetteSum += silhouetteSimilarity(frames[i], frames[i + 1]);
  }
  const silhouetteConsistency = (silhouetteSum / (frames.length - 1)) * 100;

  if (silhouetteConsistency < 70) {
    issues.push({ severity: 'critical', rule: 'silhouette-consistency', description: `Frames look too different (${silhouetteConsistency.toFixed(0)}% similar). Character identity lost between frames.` });
    recommendations.push('Ensure each frame shows the same character. Reduce variation in body position.');
  } else if (silhouetteConsistency < 85) {
    issues.push({ severity: 'warning', rule: 'silhouette-consistency', description: 'Frame-to-frame silhouette variation is higher than ideal.' });
  }

  // 2. Color consistency
  const colorSets = frames.map(f => getUniqueColors(f));
  let colorSum = 0;
  for (let i = 0; i < colorSets.length - 1; i++) {
    colorSum += colorSetSimilarity(colorSets[i], colorSets[i + 1]);
  }
  const colorConsistency = (colorSum / (colorSets.length - 1)) * 100;

  if (colorConsistency < 80) {
    issues.push({ severity: 'critical', rule: 'color-consistency', description: 'Different frames use different color palettes. Palette must be identical across all animation frames.' });
    recommendations.push('Use the exact same color palette in every frame. Remap any deviating frames.');
  }

  // 3. Frame count quality
  const idealFrames = { 2: 75, 4: 100, 6: 90, 8: 85 };
  const frameScore = frames.length in idealFrames ? idealFrames[frames.length as keyof typeof idealFrames] : (frames.length > 8 ? 60 : 50);
  if (frames.length === 2) recommendations.push('2-frame walk works (Undertale/Pokemon style). 4 frames adds more polish.');
  if (frames.length > 6) recommendations.push('6+ frame walk cycles can feel over-animated at game scale. Consider reducing to 4.');

  // 4. Motion readability — check bounding box shift between frames
  const boxes = frames.map(f => getBoundingBox(f));
  let motionScore = 80;
  const hasMeaningfulMotion = boxes.some((b, i) => {
    if (i === 0) return false;
    return Math.abs(b.h - boxes[i-1].h) > 1 || Math.abs(b.w - boxes[i-1].w) > 1;
  });
  if (!hasMeaningfulMotion) {
    issues.push({ severity: 'warning', rule: 'motion-readability', description: 'Bounding box is identical in all frames — animation may not be visible.' });
    motionScore = 50;
    recommendations.push('Ensure legs/arms create visible shape differences between frames. Even 1-2px change reads as animation.');
  }

  const timing = scoreWalkTiming(frames.length);
  const overall = Math.round((silhouetteConsistency * 0.35 + colorConsistency * 0.25 + motionScore * 0.25 + timing.score * 0.15));

  return { overall, silhouetteConsistency, colorConsistency, motionReadability: motionScore, timing, issues, recommendations };
}

function scoreWalkTiming(frameCount: number): TimingScore {
  const timingsMs: Record<number, { ms: number; assessment: string; score: number }> = {
    2: { ms: 200, assessment: 'Minimal but functional (Undertale style)', score: 75 },
    4: { ms: 150, assessment: 'Standard game walk (Pokemon B/W style)', score: 100 },
    6: { ms: 100, assessment: 'Smooth walk, good for dynamic feel', score: 90 },
    8: { ms: 80,  assessment: 'Very smooth, near Stardew Valley quality', score: 85 },
  };
  const t = timingsMs[frameCount] ?? { ms: 120, assessment: 'Unusual frame count', score: 60 };
  return { score: t.score, frameCount, recommendedMs: t.ms, assessment: t.assessment };
}

// ─── Idle Animation Scorer ────────────────────────────────────────────────────

export function scoreIdleAnimation(frames: Sprite[]): AnimationScore {
  const issues: AnimationIssue[] = [];
  const recommendations: string[] = [];

  if (frames.length < 2) {
    issues.push({ severity: 'critical', rule: 'idle-frames', description: 'Idle animation needs at least 2 frames for breathing/blinking.' });
    return { overall: 20, silhouetteConsistency: 20, colorConsistency: 100, motionReadability: 0, timing: { score: 0, frameCount: 1, recommendedMs: 500, assessment: 'Static — no idle animation' }, issues, recommendations: ['Add 2-frame idle: neutral + slight breathe-in. 1-2px vertical shift on torso.'] };
  }

  const silhouetteSum = frames.slice(0, -1).reduce((acc, f, i) => acc + silhouetteSimilarity(f, frames[i + 1]), 0);
  const silhouetteConsistency = (silhouetteSum / (frames.length - 1)) * 100;

  // Idle should be VERY similar across frames (subtle movement only)
  if (silhouetteConsistency < 90) {
    issues.push({ severity: 'warning', rule: 'idle-subtlety', description: 'Idle animation has too much variation. Idle = subtle breathing, not dramatic pose changes.' });
    recommendations.push('Reduce idle motion to 1-2px. The variation between frames should be barely noticeable.');
  }

  const colorSets = frames.map(f => getUniqueColors(f));
  const colorConsistency = (colorSets.slice(0, -1).reduce((acc, s, i) => acc + colorSetSimilarity(s, colorSets[i+1]), 0) / (colorSets.length - 1)) * 100;

  // Check loop: last frame should be similar to first frame
  const loopSimilarity = silhouetteSimilarity(frames[frames.length - 1], frames[0]);
  let motionScore = 80;
  if (loopSimilarity < 0.85) {
    issues.push({ severity: 'warning', rule: 'idle-loop', description: 'Last frame and first frame differ significantly — idle loop will "snap" rather than smoothly repeat.' });
    motionScore = 50;
    recommendations.push('Ensure last frame returns character to exact same pose as first frame for seamless loop.');
  }

  const timing: TimingScore = {
    score: frames.length >= 4 ? 100 : 70,
    frameCount: frames.length,
    recommendedMs: 400,
    assessment: frames.length >= 4 ? 'Good idle loop length' : 'Short loop — consider adding blink frame at frame 4-6',
  };

  if (frames.length >= 4) recommendations.push('Good frame count. Add a blink (eyes-closed for 1 frame) at frame 4-6 to make character feel alive.');

  return {
    overall: Math.round(silhouetteConsistency * 0.4 + colorConsistency * 0.2 + motionScore * 0.25 + timing.score * 0.15),
    silhouetteConsistency, colorConsistency, motionReadability: motionScore, timing, issues, recommendations,
  };
}

// ─── Frame Timing Validator ───────────────────────────────────────────────────

export function checkFrameTiming(frames: Sprite[], timingsMs: number[]): TimingReport {
  const issues: string[] = [];

  if (timingsMs.length !== frames.length) {
    issues.push(`Timing array length (${timingsMs.length}) doesn't match frame count (${frames.length})`);
  }

  const avgMs = timingsMs.reduce((a, b) => a + b, 0) / timingsMs.length;
  const fps = 1000 / avgMs;

  let overallFeel: TimingReport['overallFeel'];
  if (fps > 18) overallFeel = 'too-fast';
  else if (fps > 10) overallFeel = 'snappy';
  else if (fps > 6) overallFeel = 'natural';
  else if (fps > 3) overallFeel = 'slow';
  else overallFeel = 'too-slow';

  // Check for wildly varying timings
  const maxMs = Math.max(...timingsMs), minMs = Math.min(...timingsMs);
  if (maxMs / minMs > 4) {
    issues.push(`Large timing variance (${minMs}ms to ${maxMs}ms). Consider smear frames or anticipation instead of extreme timing differences.`);
  }

  // Suggest standard timings
  const suggestedTimings = frames.map((_, i) => {
    if (i === 0) return 150;               // first contact frame
    if (i === frames.length - 1) return 200; // held pose
    return 100;
  });

  return { isValid: issues.length === 0, issues, suggestedTimings, overallFeel };
}

// ─── Smear Frame Suggester ────────────────────────────────────────────────────

export function suggestSmearFrames(frames: Sprite[]): SmearSuggestion[] {
  const suggestions: SmearSuggestion[] = [];

  for (let i = 0; i < frames.length - 1; i++) {
    const a = getBoundingBox(frames[i]);
    const b = getBoundingBox(frames[i + 1]);

    const dx = Math.abs(b.x - a.x);
    const dy = Math.abs(b.y - a.y);
    const dSize = Math.abs((b.w + b.h) - (a.w + a.h));

    if (dx > 4 || dy > 4) {
      const direction = dx > dy * 1.5 ? 'horizontal' : dy > dx * 1.5 ? 'vertical' : 'diagonal';
      const intensity = (dx + dy) > 12 ? 'heavy' : (dx + dy) > 6 ? 'medium' : 'light';
      suggestions.push({
        betweenFrames: [i, i + 1],
        direction,
        intensity,
        reason: `Position shift of ${dx}px horizontal, ${dy}px vertical between frames ${i} and ${i+1}. A smear frame here would add weight to the motion.`,
      });
    }

    if (dSize > 6) {
      suggestions.push({
        betweenFrames: [i, i + 1],
        direction: 'horizontal',
        intensity: 'medium',
        reason: `Bounding box size change of ${dSize}px suggests impact or squash moment. A stretch/squash smear frame adds juice.`,
      });
    }
  }

  return suggestions;
}

// ─── Bounce and Squash Validator ──────────────────────────────────────────────

export function validateBounceAndSquash(frames: Sprite[]): BounceReport {
  const notes: string[] = [];
  const heights = frames.map(f => getBoundingBox(f).h);
  const maxH = Math.max(...heights);
  const minH = Math.min(...heights);

  const squashDetected = minH < maxH * 0.85;
  const stretchDetected = maxH > minH * 1.15;

  const bounceFrames: number[] = [];
  for (let i = 1; i < heights.length - 1; i++) {
    if (heights[i] < heights[i-1] && heights[i] < heights[i+1]) {
      bounceFrames.push(i);
    }
  }

  const hasBounce = bounceFrames.length > 0;
  let score = 70;

  if (squashDetected && stretchDetected) {
    score = 95;
    notes.push('Excellent squash and stretch detected — animation will feel dynamic and alive.');
  } else if (squashDetected || stretchDetected) {
    score = 80;
    notes.push('Partial squash/stretch. Consider adding the complementary motion for full juice.');
  } else {
    notes.push('No squash/stretch detected. For impactful actions, add squash (compress height) on landing and stretch (extend) on launch.');
  }

  if (!hasBounce && frames.length >= 4) {
    notes.push('No bounce frames detected. Walk cycles benefit from a subtle vertical bounce — shift sprite up 1-2px on mid-stride frames.');
  }

  return { hasBounce, bounceFrames, squashDetected, stretchDetected, score, notes };
}
