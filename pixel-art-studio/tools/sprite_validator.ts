/**
 * BitBio Sprite Validator
 *
 * Validates a sprite descriptor against BitBio's pixel art quality rules.
 * Takes a simple descriptor object (no pixel data required) and returns
 * a validation report with per-rule pass/fail and an overall score.
 *
 * Usage:
 *   import { validateSprite } from './sprite_validator';
 *   const report = validateSprite({
 *     name: 'elliot',
 *     width: 32, height: 42,
 *     colorCount: 16,
 *     frameCount: 14,
 *     hasOutline: true,
 *     hasIdleAnimation: true,
 *     hasWalkAnimation: true,
 *     animationFPS: 10,
 *   });
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpriteDescriptor {
  /** Unique identifier for this sprite (e.g. 'elliot', 'boss-lyso', 'player') */
  name: string;
  /** Bounding box width in game pixels */
  width: number;
  /** Bounding box height in game pixels */
  height: number;
  /** Total distinct colors in palette (transparency not counted) */
  colorCount: number;
  /** Total distinct animation frames (sum across all animation states) */
  frameCount: number;
  /** True if the sprite has a 1-pixel outline at all outer edges */
  hasOutline: boolean;
  /** True if sprite has an idle animation (even a 2-frame bob) */
  hasIdleAnimation: boolean;
  /** True if sprite has a walk/movement animation */
  hasWalkAnimation: boolean;
  /** True if sprite has at least one reaction/emotion state */
  hasEmotionState: boolean;
  /** Frames per second for walk animation (target: 8-12) */
  animationFPS: number;
  /** Optional: Does this sprite use hue-shifted shadows (best practice)? */
  hasHueShiftedShadows?: boolean;
  /** Optional: Does this sprite have secondary animation (hair, props, etc)? */
  hasSecondaryAnimation?: boolean;
  /** Optional: Does this sprite have a distinctive silhouette element? */
  hasDistinctiveSilhouette?: boolean;
  /** Optional: Type of sprite — drives some rule thresholds */
  type?: 'player' | 'npc' | 'boss' | 'companion' | 'enemy';
}

export interface ValidationRule {
  id: string;
  name: string;
  weight: number;       // Contribution to score (weights sum to 100)
  passed: boolean;
  score: number;        // 0 to weight (partial credit allowed)
  feedback: string;     // Explanation of result
}

export interface ValidationReport {
  spriteName: string;
  totalScore: number;   // 0–100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;      // true if score >= 75 (BitBio minimum)
  rules: ValidationRule[];
  criticalFailures: string[];   // Rules that must be fixed (weight >= 15, failed)
  warnings: string[];           // Non-critical issues
  suggestions: string[];        // Optional improvements
}

// ─── Rule Definitions ─────────────────────────────────────────────────────────

/**
 * Maximum allowed color counts by sprite type.
 * Boss sprites get more budget; companions get slightly more for personality.
 */
const COLOR_LIMITS: Record<string, number> = {
  player:    20,
  npc:       16,
  boss:      28,
  companion: 14,
  enemy:     16,
};

/**
 * Minimum required color counts (too few = no depth).
 */
const COLOR_MINIMUMS: Record<string, number> = {
  player:    10,
  npc:       8,
  boss:      12,
  companion: 6,
  enemy:     8,
};

/**
 * Maximum allowed dimensions in game pixels.
 * Sprites must fit in their bounding box.
 */
const DIMENSION_LIMITS = {
  maxWidth: 48,    // Bosses can be wider
  standardWidth: 32,
  maxHeight: 64,
  standardHeight: 48,
};

// ─── Validator ────────────────────────────────────────────────────────────────

/**
 * Validates a sprite descriptor against all BitBio quality rules.
 */
export function validateSprite(descriptor: SpriteDescriptor): ValidationReport {
  const type = descriptor.type ?? 'npc';
  const rules: ValidationRule[] = [];

  // ── Rule 1: Dimensions (weight 10) ──────────────────────────────────────────
  {
    const maxW = type === 'boss' ? DIMENSION_LIMITS.maxWidth : DIMENSION_LIMITS.standardWidth;
    const maxH = type === 'boss' ? DIMENSION_LIMITS.maxHeight : DIMENSION_LIMITS.standardHeight;
    const widthOk  = descriptor.width  <= maxW && descriptor.width  >= 8;
    const heightOk = descriptor.height <= maxH && descriptor.height >= 8;
    const widthMultiple  = descriptor.width  % 8 === 0 || descriptor.width  % 8 === 2; // 32, 34, etc OK
    const heightMultiple = descriptor.height % 8 === 0 || descriptor.height % 8 === 2;
    const passed = widthOk && heightOk;
    const score  = passed ? (widthMultiple && heightMultiple ? 10 : 7) : 0;

    rules.push({
      id: 'dimensions',
      name: 'Sprite Dimensions',
      weight: 10,
      passed,
      score,
      feedback: passed
        ? `${descriptor.width}×${descriptor.height}gp — within ${maxW}×${maxH} limit${widthMultiple && heightMultiple ? '' : ' (not multiple of 8, -3 pts)'}`
        : `${descriptor.width}×${descriptor.height}gp exceeds ${maxW}×${maxH} limit for ${type} sprites`,
    });
  }

  // ── Rule 2: Color Count (weight 15) ─────────────────────────────────────────
  {
    const maxColors = COLOR_LIMITS[type] ?? 16;
    const minColors = COLOR_MINIMUMS[type] ?? 8;
    const tooMany = descriptor.colorCount > maxColors;
    const tooFew  = descriptor.colorCount < minColors;
    const passed  = !tooMany && !tooFew;
    let score = 0;
    if (passed) score = 15;
    else if (tooMany && descriptor.colorCount <= maxColors + 4) score = 8; // slightly over
    else if (tooFew  && descriptor.colorCount >= minColors - 2)  score = 8; // slightly under

    rules.push({
      id: 'color-count',
      name: 'Color Palette Size',
      weight: 15,
      passed,
      score,
      feedback: tooMany
        ? `${descriptor.colorCount} colors exceeds ${maxColors} maximum for ${type} sprites. Merge similar shades.`
        : tooFew
          ? `${descriptor.colorCount} colors below ${minColors} minimum. Sprite will lack depth.`
          : `${descriptor.colorCount} colors — within ${minColors}–${maxColors} range for ${type}.`,
    });
  }

  // ── Rule 3: Outline (weight 10) ─────────────────────────────────────────────
  {
    const needsOutline = type !== 'companion'; // companions can break this
    const passed = descriptor.hasOutline || !needsOutline;
    rules.push({
      id: 'outline',
      name: 'Outline Presence',
      weight: 10,
      passed,
      score: passed ? 10 : 0,
      feedback: passed
        ? descriptor.hasOutline ? 'Hard outline present — good for overworld readability.' : 'No outline (acceptable for companion type).'
        : 'Missing outline. Overworld sprites need outline for readability against tile backgrounds.',
    });
  }

  // ── Rule 4: Idle Animation (weight 10) ──────────────────────────────────────
  {
    const passed = descriptor.hasIdleAnimation;
    rules.push({
      id: 'idle-animation',
      name: 'Idle Animation',
      weight: 10,
      passed,
      score: passed ? 10 : 0,
      feedback: passed
        ? 'Idle animation present — sprite feels alive at rest.'
        : 'No idle animation. Even a 2-frame head bob makes sprites feel alive.',
    });
  }

  // ── Rule 5: Walk Animation (weight 10) ──────────────────────────────────────
  {
    const needsWalk = type !== 'boss' && type !== 'enemy';
    const passed    = descriptor.hasWalkAnimation || !needsWalk;
    rules.push({
      id: 'walk-animation',
      name: 'Walk/Movement Animation',
      weight: 10,
      passed,
      score: passed ? 10 : 5, // partial credit for bosses with no walk
      feedback: passed
        ? descriptor.hasWalkAnimation ? 'Walk animation present.' : 'Walk animation not required for this sprite type.'
        : 'Walk animation missing. Player-facing sprites must have walk cycle.',
    });
  }

  // ── Rule 6: Animation FPS (weight 10) ───────────────────────────────────────
  {
    const fps = descriptor.animationFPS;
    const passed = fps >= 6 && fps <= 16;
    const ideal  = fps >= 8 && fps <= 12;
    rules.push({
      id: 'animation-fps',
      name: 'Animation Frame Rate',
      weight: 10,
      passed,
      score: !descriptor.hasWalkAnimation ? 10 : ideal ? 10 : passed ? 7 : 0,
      feedback: !descriptor.hasWalkAnimation
        ? 'No walk animation; FPS check skipped.'
        : ideal
          ? `${fps} fps — ideal range (8–12fps) for walk animations.`
          : passed
            ? `${fps} fps — acceptable but outside ideal 8–12fps range.`
            : `${fps} fps — out of range. < 6fps looks choppy; > 16fps is imperceptible and wastes frames.`,
    });
  }

  // ── Rule 7: Emotion State (weight 10) ───────────────────────────────────────
  {
    const passed = descriptor.hasEmotionState || type === 'enemy';
    rules.push({
      id: 'emotion-state',
      name: 'Emotion/Reaction State',
      weight: 10,
      passed,
      score: passed ? 10 : 2,
      feedback: passed
        ? 'Emotion state(s) defined — sprite can communicate character feeling.'
        : 'No emotion states. All NPC and player sprites need at least 3 emotion variants.',
    });
  }

  // ── Rule 8: Hue-Shifted Shadows (weight 8) ──────────────────────────────────
  {
    const passed = descriptor.hasHueShiftedShadows !== false; // default true if not specified
    rules.push({
      id: 'hue-shift',
      name: 'Hue-Shifted Shadows',
      weight: 8,
      passed: !!passed,
      score: descriptor.hasHueShiftedShadows === true ? 8 : descriptor.hasHueShiftedShadows === undefined ? 6 : 0,
      feedback: descriptor.hasHueShiftedShadows === true
        ? 'Hue-shifted shadows confirmed — palette has natural depth.'
        : descriptor.hasHueShiftedShadows === undefined
          ? 'Hue shift not confirmed. Verify shadow colors shift warm/cool instead of just darkening.'
          : 'Flat (non-hue-shifted) shadows detected. Shadows should shift toward cool/blue tones.',
    });
  }

  // ── Rule 9: Secondary Animation (weight 7) ──────────────────────────────────
  {
    const hasSecondary = descriptor.hasSecondaryAnimation ?? false;
    rules.push({
      id: 'secondary-animation',
      name: 'Secondary Animation Detail',
      weight: 7,
      passed: hasSecondary,
      score: hasSecondary ? 7 : 0,
      feedback: hasSecondary
        ? 'Secondary animation present (hair, prop, clothing) — adds life and personality.'
        : 'No secondary animation. Consider adding prop movement (Ben\'s sandwich bob) or hair sway.',
    });
  }

  // ── Rule 10: Distinctive Silhouette (weight 10) ─────────────────────────────
  {
    const hasSil = descriptor.hasDistinctiveSilhouette ?? true; // assume true if not specified
    rules.push({
      id: 'silhouette',
      name: 'Distinctive Silhouette',
      weight: 10,
      passed: !!hasSil,
      score: descriptor.hasDistinctiveSilhouette === true ? 10 : descriptor.hasDistinctiveSilhouette === undefined ? 6 : 0,
      feedback: descriptor.hasDistinctiveSilhouette === true
        ? 'Distinctive silhouette element confirmed — character recognizable as black blob.'
        : descriptor.hasDistinctiveSilhouette === undefined
          ? 'Silhouette not evaluated. Test: fill sprite solid black — is it recognizable?'
          : 'Silhouette is not distinctive. Add a protruding element (hat, prop, unusual hair shape).',
    });
  }

  // ─── Tally Score ─────────────────────────────────────────────────────────────
  const totalScore = rules.reduce((sum, r) => sum + r.score, 0);

  // Clamp to [0, 100] (weight sum is exactly 100 above)
  const clampedScore = Math.max(0, Math.min(100, totalScore));

  const grade: ValidationReport['grade'] =
    clampedScore >= 95 ? 'S' :
    clampedScore >= 85 ? 'A' :
    clampedScore >= 75 ? 'B' :
    clampedScore >= 65 ? 'C' :
    clampedScore >= 50 ? 'D' : 'F';

  const criticalFailures = rules
    .filter(r => !r.passed && r.weight >= 10)
    .map(r => `[${r.id}] ${r.feedback}`);

  const warnings = rules
    .filter(r => !r.passed && r.weight < 10)
    .map(r => `[${r.id}] ${r.feedback}`);

  const suggestions: string[] = [];
  if (!descriptor.hasHueShiftedShadows)
    suggestions.push('Apply hue-shifting to shadow ramp (shift toward blue-purple for cool shadows).');
  if (!descriptor.hasSecondaryAnimation)
    suggestions.push('Add secondary animation to a prop or clothing element for more personality.');
  if (descriptor.colorCount < 10 && type !== 'companion')
    suggestions.push('Consider adding 1-2 more ramp steps for better surface definition.');
  if (descriptor.frameCount < 5)
    suggestions.push('Animate more states — even a 2-frame reaction goes a long way.');

  return {
    spriteName: descriptor.name,
    totalScore: clampedScore,
    grade,
    passed: clampedScore >= 75,
    rules,
    criticalFailures,
    warnings,
    suggestions,
  };
}

// ─── Batch Validator ──────────────────────────────────────────────────────────

/**
 * Validates multiple sprites and returns a summary table.
 */
export function validateAll(sprites: SpriteDescriptor[]): {
  results: ValidationReport[];
  averageScore: number;
  allPassed: boolean;
  summary: string;
} {
  const results = sprites.map(validateSprite);
  const averageScore = results.reduce((s, r) => s + r.totalScore, 0) / results.length;
  const allPassed = results.every(r => r.passed);

  const rows = results.map(r =>
    `  ${r.grade} ${r.totalScore.toString().padStart(3)}  ${r.spriteName}${r.passed ? '' : '  ← NEEDS WORK'}`
  ).join('\n');

  const summary = [
    `\nBitBio Sprite Validation Report`,
    `================================`,
    rows,
    `--------------------------------`,
    `Average Score: ${averageScore.toFixed(1)} / 100`,
    `Status: ${allPassed ? '✓ ALL PASS' : '✗ FAILURES DETECTED'}`,
    `Minimum to ship: 75 / 100 per sprite`,
  ].join('\n');

  return { results, averageScore, allPassed, summary };
}

// ─── BitBio Known Sprites (Baseline) ─────────────────────────────────────────

/** Current BitBio sprite roster for quick validation run. */
export const BITBIO_SPRITES: SpriteDescriptor[] = [
  {
    name: 'elliot',
    width: 32, height: 42, colorCount: 16, frameCount: 14,
    hasOutline: true, hasIdleAnimation: true, hasWalkAnimation: false,
    hasEmotionState: true, animationFPS: 10,
    hasHueShiftedShadows: true, hasSecondaryAnimation: true,
    hasDistinctiveSilhouette: true, type: 'npc',
  },
  {
    name: 'ben',
    width: 32, height: 42, colorCount: 14, frameCount: 10,
    hasOutline: true, hasIdleAnimation: true, hasWalkAnimation: false,
    hasEmotionState: true, animationFPS: 10,
    hasHueShiftedShadows: true, hasSecondaryAnimation: true,
    hasDistinctiveSilhouette: true, type: 'npc',
  },
  {
    name: 'alex',
    width: 32, height: 42, colorCount: 12, frameCount: 10,
    hasOutline: true, hasIdleAnimation: true, hasWalkAnimation: false,
    hasEmotionState: true, animationFPS: 10,
    hasHueShiftedShadows: true, hasSecondaryAnimation: true,
    hasDistinctiveSilhouette: true, type: 'npc',
  },
  {
    name: 'henry',
    width: 32, height: 42, colorCount: 10, frameCount: 12,
    hasOutline: false, hasIdleAnimation: true, hasWalkAnimation: false,
    hasEmotionState: true, animationFPS: 10,
    hasHueShiftedShadows: false, hasSecondaryAnimation: true,
    hasDistinctiveSilhouette: true, type: 'npc',
  },
  {
    name: 'enzyme',
    width: 16, height: 20, colorCount: 10, frameCount: 11,
    hasOutline: true, hasIdleAnimation: true, hasWalkAnimation: true,
    hasEmotionState: true, animationFPS: 10,
    hasHueShiftedShadows: true, hasSecondaryAnimation: true,
    hasDistinctiveSilhouette: true, type: 'companion',
  },
  {
    name: 'player',
    width: 32, height: 42, colorCount: 18, frameCount: 14,
    hasOutline: true, hasIdleAnimation: true, hasWalkAnimation: true,
    hasEmotionState: true, animationFPS: 10,
    hasHueShiftedShadows: true, hasSecondaryAnimation: true,
    hasDistinctiveSilhouette: true, type: 'player',
  },
];
