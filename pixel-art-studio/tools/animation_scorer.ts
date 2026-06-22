/**
 * BitBio Animation Scorer
 *
 * Evaluates an animation descriptor against pixel art animation best practices.
 * Returns a score 0–100 with detailed per-criterion feedback.
 *
 * Usage:
 *   import { scoreAnimation } from './animation_scorer';
 *   const result = scoreAnimation({
 *     name: 'enzyme-walk',
 *     type: 'walk',
 *     frameCount: 10,
 *     fps: 10,
 *     looping: true,
 *     hasAnticipation: false,
 *     hasSmear: false,
 *     hasImpactFrame: false,
 *     hasFollowThrough: true,
 *     hasSecondaryMotion: true,
 *     holdOnKeyPoses: true,
 *   });
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnimationType =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'attack'
  | 'hurt'
  | 'death'
  | 'celebrate'
  | 'interact'
  | 'special'
  | 'vfx';

export interface AnimationDescriptor {
  /** Unique name for this animation (e.g., 'elliot-idle', 'boss-lyso-attack') */
  name: string;
  /** Animation category */
  type: AnimationType;
  /** Total number of unique frames in this animation */
  frameCount: number;
  /** Target playback rate in frames per second */
  fps: number;
  /** Does the animation seamlessly loop? */
  looping: boolean;
  /** For attack/jump animations: is there a wind-up frame before the main action? */
  hasAnticipation?: boolean;
  /** For fast motion: is there a stretched/blurred intermediate frame? */
  hasSmear?: boolean;
  /** For attack/hit animations: is there a held impact frame (4+ frame pause)? */
  hasImpactFrame?: boolean;
  /** For walk/attack: does secondary element (hair, prop, clothing) continue after main body? */
  hasFollowThrough?: boolean;
  /** For walk/idle: does a secondary element (coin, tail, hair) move independently? */
  hasSecondaryMotion?: boolean;
  /** For attack/react: are key poses held for 3+ frames before transitioning? */
  holdOnKeyPoses?: boolean;
  /** Optional: Does position ease in/out (slow start and end)? */
  hasEasing?: boolean;
  /** Optional: Does the sprite leave its natural arc path? (should be false) */
  violatesArcs?: boolean;
  /** Optional: Is the sprite anatomy consistent across all frames? (should be true) */
  anatomyConsistent?: boolean;
}

export interface ScoredCriterion {
  id: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  applicable: boolean;
  feedback: string;
}

export interface AnimationScoreReport {
  animationName: string;
  animationType: AnimationType;
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  duration: number;         // seconds
  criteria: ScoredCriterion[];
  criticalIssues: string[];
  improvements: string[];
}

// ─── Requirement Maps ─────────────────────────────────────────────────────────

/** Minimum and maximum frame counts per animation type. */
const FRAME_REQUIREMENTS: Record<AnimationType, { min: number; max: number; ideal: [number, number] }> = {
  idle:      { min: 2,  max: 120, ideal: [2, 8]     },
  walk:      { min: 4,  max: 16,  ideal: [6, 10]    },
  run:       { min: 4,  max: 12,  ideal: [4, 8]     },
  jump:      { min: 3,  max: 12,  ideal: [4, 8]     },
  attack:    { min: 4,  max: 16,  ideal: [5, 10]    },
  hurt:      { min: 3,  max: 16,  ideal: [4, 8]     },
  death:     { min: 8,  max: 48,  ideal: [12, 30]   },
  celebrate: { min: 6,  max: 48,  ideal: [12, 24]   },
  interact:  { min: 3,  max: 12,  ideal: [4, 8]     },
  special:   { min: 8,  max: 60,  ideal: [12, 40]   },
  vfx:       { min: 4,  max: 20,  ideal: [5, 12]    },
};

/** Ideal FPS per animation type. */
const FPS_REQUIREMENTS: Record<AnimationType, { min: number; max: number; ideal: number }> = {
  idle:      { min: 4, max: 16, ideal: 8  },
  walk:      { min: 6, max: 16, ideal: 10 },
  run:       { min: 8, max: 20, ideal: 12 },
  jump:      { min: 8, max: 24, ideal: 12 },
  attack:    { min: 10, max: 30, ideal: 15 },
  hurt:      { min: 10, max: 24, ideal: 12 },
  death:     { min: 8, max: 20, ideal: 12 },
  celebrate: { min: 6, max: 16, ideal: 10 },
  interact:  { min: 8, max: 16, ideal: 10 },
  special:   { min: 10, max: 24, ideal: 12 },
  vfx:       { min: 12, max: 30, ideal: 18 },
};

/** Whether looping is required/expected per type. */
const LOOP_EXPECTED: Record<AnimationType, boolean> = {
  idle: true, walk: true, run: true, jump: false, attack: false,
  hurt: false, death: false, celebrate: false, interact: false,
  special: false, vfx: false,
};

/** Whether anticipation is important per type. */
const ANTICIPATION_IMPORTANT: Record<AnimationType, boolean> = {
  attack: true, jump: true, special: true, hurt: false,
  idle: false, walk: false, run: false, death: false,
  celebrate: false, interact: false, vfx: false,
};

/** Whether impact frame is important per type. */
const IMPACT_IMPORTANT: Record<AnimationType, boolean> = {
  attack: true, special: true, hurt: true, death: true,
  idle: false, walk: false, run: false, jump: false,
  celebrate: false, interact: false, vfx: true,
};

// ─── Scorer ───────────────────────────────────────────────────────────────────

/**
 * Scores a single animation against pixel art best practices.
 */
export function scoreAnimation(anim: AnimationDescriptor): AnimationScoreReport {
  const type = anim.type;
  const criteria: ScoredCriterion[] = [];
  const criticalIssues: string[] = [];
  const improvements: string[] = [];

  // ── Criterion 1: Frame Count (weight 18) ────────────────────────────────────
  {
    const req = FRAME_REQUIREMENTS[type];
    const inRange = anim.frameCount >= req.min && anim.frameCount <= req.max;
    const isIdeal = anim.frameCount >= req.ideal[0] && anim.frameCount <= req.ideal[1];
    const score = !inRange ? 0 : isIdeal ? 18 : 11;

    criteria.push({
      id: 'frame-count',
      name: 'Frame Count',
      weight: 18,
      score,
      maxScore: 18,
      applicable: true,
      feedback: !inRange
        ? `${anim.frameCount} frames is outside valid range [${req.min}–${req.max}] for ${type} animations.`
        : isIdeal
          ? `${anim.frameCount} frames — in ideal range [${req.ideal[0]}–${req.ideal[1]}].`
          : `${anim.frameCount} frames — valid but outside ideal range [${req.ideal[0]}–${req.ideal[1]}].`,
    });

    if (!inRange) criticalIssues.push(`Frame count ${anim.frameCount} invalid for ${type} (need ${req.min}–${req.max}).`);
  }

  // ── Criterion 2: FPS (weight 15) ────────────────────────────────────────────
  {
    const req = FPS_REQUIREMENTS[type];
    const inRange = anim.fps >= req.min && anim.fps <= req.max;
    const atIdeal = Math.abs(anim.fps - req.ideal) <= 3;
    const score = !inRange ? 0 : atIdeal ? 15 : 9;
    const duration = anim.frameCount / anim.fps;

    criteria.push({
      id: 'fps',
      name: 'Playback Speed (FPS)',
      weight: 15,
      score,
      maxScore: 15,
      applicable: true,
      feedback: !inRange
        ? `${anim.fps} fps is outside [${req.min}–${req.max}] for ${type}. Animation will feel wrong.`
        : atIdeal
          ? `${anim.fps} fps — near ideal ${req.ideal} fps for ${type}. Duration: ${duration.toFixed(2)}s.`
          : `${anim.fps} fps — valid but ${anim.fps < req.ideal ? 'slow' : 'fast'}. Ideal is ${req.ideal} fps.`,
    });

    if (!inRange) criticalIssues.push(`FPS ${anim.fps} invalid for ${type} (need ${req.min}–${req.max}).`);
  }

  // ── Criterion 3: Loop Compliance (weight 12) ─────────────────────────────────
  {
    const shouldLoop = LOOP_EXPECTED[type];
    const loopCorrect = anim.looping === shouldLoop;
    const score = loopCorrect ? 12 : 4; // partial credit — looping non-loop isn't catastrophic

    criteria.push({
      id: 'looping',
      name: 'Loop Compliance',
      weight: 12,
      score,
      maxScore: 12,
      applicable: true,
      feedback: loopCorrect
        ? `Looping=${anim.looping} is ${shouldLoop ? 'expected' : 'correct'} for ${type} animations.`
        : `${type} animations ${shouldLoop ? 'should' : 'should NOT'} loop. Current: looping=${anim.looping}.`,
    });

    if (!loopCorrect && shouldLoop) {
      improvements.push(`Make this ${type} animation loop seamlessly — first frame should match last frame's position/pose.`);
    }
  }

  // ── Criterion 4: Anticipation (weight 12) ────────────────────────────────────
  {
    const isImportant = ANTICIPATION_IMPORTANT[type];
    const applicable = isImportant;
    const has = anim.hasAnticipation ?? false;
    const score = !applicable ? 12 : has ? 12 : 3;

    criteria.push({
      id: 'anticipation',
      name: 'Anticipation Frame',
      weight: 12,
      score,
      maxScore: 12,
      applicable,
      feedback: !applicable
        ? `Anticipation not required for ${type} animations (skipped).`
        : has
          ? 'Anticipation frame present — action is telegraphed for player readability.'
          : `Missing anticipation frame for ${type}. Players need 2–4 frames of wind-up to perceive incoming action.`,
    });

    if (applicable && !has) {
      improvements.push(`Add ${type === 'jump' ? '2' : '3-4'} frame anticipation: move opposite direction before main action.`);
    }
  }

  // ── Criterion 5: Impact Frame (weight 12) ────────────────────────────────────
  {
    const isImportant = IMPACT_IMPORTANT[type];
    const applicable = isImportant;
    const has = anim.hasImpactFrame ?? false;
    const score = !applicable ? 12 : has ? 12 : 2;

    criteria.push({
      id: 'impact-frame',
      name: 'Impact Frame Hold',
      weight: 12,
      score,
      maxScore: 12,
      applicable,
      feedback: !applicable
        ? `Impact frame not required for ${type} (skipped).`
        : has
          ? 'Impact frame present — attack/hit will feel satisfying and weighty.'
          : `Missing impact frame. ${type} animations need 4–6 frame hold at moment of impact (hitlag).`,
    });

    if (applicable && !has) {
      criticalIssues.push(`${type} animation missing impact frame. Add 4–6 frame pose hold at peak impact.`);
    }
  }

  // ── Criterion 6: Follow-Through (weight 10) ──────────────────────────────────
  {
    const applicable = ['walk', 'run', 'attack', 'celebrate', 'jump'].includes(type);
    const has = anim.hasFollowThrough ?? false;
    const score = !applicable ? 10 : has ? 10 : 4;

    criteria.push({
      id: 'follow-through',
      name: 'Follow-Through / Overlapping',
      weight: 10,
      score,
      maxScore: 10,
      applicable,
      feedback: !applicable
        ? 'Follow-through not applicable for this animation type.'
        : has
          ? 'Follow-through present — secondary elements continue after main body stops.'
          : `Missing follow-through. After main action ends, secondary elements (${type === 'walk' ? 'coat hem, hair' : 'weapon swing, tail'}) should overshoot by 2–3 frames.`,
    });

    if (applicable && !has) {
      improvements.push('Add follow-through: draw secondary elements (clothing, hair, props) 2–3 frames past where the body stops.');
    }
  }

  // ── Criterion 7: Secondary Motion (weight 8) ─────────────────────────────────
  {
    const applicable = ['idle', 'walk', 'run', 'celebrate', 'interact'].includes(type);
    const has = anim.hasSecondaryMotion ?? false;
    const score = !applicable ? 8 : has ? 8 : 2;

    criteria.push({
      id: 'secondary-motion',
      name: 'Secondary Motion',
      weight: 8,
      score,
      maxScore: 8,
      applicable,
      feedback: !applicable
        ? 'Secondary motion less critical for this animation type.'
        : has
          ? 'Secondary motion present — sprite has personality detail.'
          : 'Missing secondary motion. Layer a secondary moving element (tail wag, prop bob, hair sway) onto the main animation.',
    });

    if (applicable && !has) {
      improvements.push('Add a secondary motion element (prop, hair, clothing) that moves on a different timing than the body.');
    }
  }

  // ── Criterion 8: Key Pose Holds (weight 7) ───────────────────────────────────
  {
    const applicable = ['attack', 'celebrate', 'special', 'hurt', 'death'].includes(type);
    const has = anim.holdOnKeyPoses ?? false;
    const score = !applicable ? 7 : has ? 7 : 0;

    criteria.push({
      id: 'key-pose-holds',
      name: 'Key Pose Holds',
      weight: 7,
      score,
      maxScore: 7,
      applicable,
      feedback: !applicable
        ? 'Key pose holds not critical for this type.'
        : has
          ? 'Key poses held for 3+ frames — animation communicates intent clearly.'
          : 'No pose holds detected. Key poses (peak attack, peak celebrate) should hold 3–6 frames for staging.',
    });

    if (applicable && !has) {
      improvements.push('Hold key poses (peak action frames) for 3–6 frames before transitioning out. This is called "staging."');
    }
  }

  // ── Criterion 9: Easing (weight 6) ──────────────────────────────────────────
  {
    const applicable = ['walk', 'jump', 'attack', 'celebrate'].includes(type);
    const has = anim.hasEasing !== undefined ? anim.hasEasing : null;
    const score = has === null ? 4 : has ? 6 : 2; // partial credit if unknown

    criteria.push({
      id: 'easing',
      name: 'Ease In / Ease Out',
      weight: 6,
      score,
      maxScore: 6,
      applicable: applicable,
      feedback: has === null
        ? 'Easing not specified. Ensure more frames at start/end of motion (slow in, slow out).'
        : has
          ? 'Easing applied — motion feels natural and weighted.'
          : 'No easing detected. Motion will feel robotic — add more frames near start/end positions.',
    });
  }

  // ── Tally Score ──────────────────────────────────────────────────────────────
  const totalApplicableWeight = criteria.filter(c => c.applicable).reduce((s, c) => s + c.weight, 0);
  const totalEarnedScore = criteria.reduce((s, c) => s + c.score, 0);
  // Scale to 100 based on applicable weight
  const totalScore = Math.min(100, Math.round((totalEarnedScore / totalApplicableWeight) * 100));

  const grade: AnimationScoreReport['grade'] =
    totalScore >= 95 ? 'S' : totalScore >= 85 ? 'A' : totalScore >= 75 ? 'B' :
    totalScore >= 65 ? 'C' : totalScore >= 50 ? 'D' : 'F';

  const duration = anim.frameCount / anim.fps;

  return {
    animationName: anim.name,
    animationType: type,
    totalScore,
    grade,
    passed: totalScore >= 75,
    duration,
    criteria,
    criticalIssues,
    improvements,
  };
}

// ─── Batch Scorer ─────────────────────────────────────────────────────────────

/**
 * Scores multiple animations and prints a comparison table.
 */
export function scoreAll(animations: AnimationDescriptor[]): string {
  const reports = animations.map(scoreAnimation);
  const rows = reports.map(r =>
    `  ${r.grade} ${r.totalScore.toString().padStart(3)}  ${r.animationName} (${r.animationType}, ${r.duration.toFixed(2)}s)${r.passed ? '' : '  ← NEEDS WORK'}`
  ).join('\n');
  const avg = reports.reduce((s, r) => s + r.totalScore, 0) / reports.length;

  return [
    '\nBitBio Animation Score Report',
    '==============================',
    rows,
    '------------------------------',
    `Average Score: ${avg.toFixed(1)} / 100`,
    `All pass (≥75): ${reports.every(r => r.passed) ? 'YES ✓' : 'NO ✗'}`,
  ].join('\n');
}

// ─── BitBio Known Animations Baseline ────────────────────────────────────────

export const BITBIO_ANIMATIONS: AnimationDescriptor[] = [
  { name: 'player-walk', type: 'walk', frameCount: 8, fps: 10, looping: true, hasFollowThrough: true, hasSecondaryMotion: false, hasEasing: false },
  { name: 'player-celebrate', type: 'celebrate', frameCount: 24, fps: 10, looping: false, holdOnKeyPoses: true, hasFollowThrough: true },
  { name: 'player-hurt', type: 'hurt', frameCount: 12, fps: 12, looping: false, hasImpactFrame: true },
  { name: 'enzyme-idle', type: 'idle', frameCount: 4, fps: 8, looping: true, hasSecondaryMotion: true },
  { name: 'enzyme-walk', type: 'walk', frameCount: 10, fps: 10, looping: true, hasFollowThrough: true, hasSecondaryMotion: true },
  { name: 'elliot-idle', type: 'idle', frameCount: 2, fps: 6, looping: true, hasSecondaryMotion: true },
  { name: 'henry-idle', type: 'idle', frameCount: 4, fps: 8, looping: true, hasSecondaryMotion: true },
  { name: 'boss-lyso-attack', type: 'attack', frameCount: 8, fps: 15, looping: false, hasAnticipation: true, hasImpactFrame: true, holdOnKeyPoses: true },
  { name: 'boss-lyso-death', type: 'death', frameCount: 30, fps: 12, looping: false, holdOnKeyPoses: true, hasFollowThrough: true },
  { name: 'node-pulse', type: 'vfx', frameCount: 8, fps: 12, looping: true },
  { name: 'hit-spark', type: 'vfx', frameCount: 6, fps: 18, looping: false, hasImpactFrame: true },
];
