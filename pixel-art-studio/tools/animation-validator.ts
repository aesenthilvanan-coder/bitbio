/**
 * BitBio Animation Validator
 * Validates pixel art animation specifications against BitBio standards.
 * Checks timing, structure, principle compliance, and character-specific rules.
 *
 * Usage (CLI):
 *   npx ts-node pixel-art-studio/tools/animation-validator.ts validate <json-file>
 *   npx ts-node pixel-art-studio/tools/animation-validator.ts template <character> <type>
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type CharacterName = 'player' | 'enzyme' | 'elliot' | 'ben' | 'alex' | 'henry' | 'boss';
export type AnimationType = 'idle' | 'walk' | 'run' | 'attack' | 'react' | 'special';

export interface AnimationSpec {
  name: string;
  frameCount: number;
  targetFPS: number;
  character: CharacterName;
  type: AnimationType;
  frames: AnimationFrame[];
}

export interface AnimationFrame {
  index: number;
  durationMs: number;
  description: string;
  keyChanges: string[];
  isKeyframe: boolean;
}

export interface ValidationResult {
  valid: boolean;
  score: number; // 0–100
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  frameIndex?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SCORE_DEDUCTIONS: Record<ValidationIssue['severity'], number> = {
  error: 15,
  warning: 5,
  info: 1,
};

/** Walk cycles must be an even number of frames to ensure proper left/right symmetry. */
const WALK_CYCLE_VALID_COUNTS = [2, 4, 6, 8, 10, 12, 16];

/** Maximum consecutive frames allowed without at least one keyframe. */
const MAX_NON_KEYFRAME_RUN = 6;

/** Minimum anticipation frames required before an attack frame. */
const MIN_ANTICIPATION_FRAMES = 2;

/** Characters that must have a blink in their idle animation. */
const BLINK_REQUIRED_CHARACTERS: CharacterName[] = [
  'player', 'elliot', 'ben', 'alex', 'henry',
];

/** Expected frame count ranges per animation type (inclusive [min, max]). */
const EXPECTED_FRAME_COUNTS: Record<AnimationType, [number, number]> = {
  idle: [6, 24],
  walk: [4, 16],
  run: [4, 8],
  attack: [4, 16],
  react: [2, 12],
  special: [2, 32],
};

/** Valid targetFPS values for BitBio animations. */
const VALID_FPS_VALUES = [6, 8, 10, 12, 15, 24, 30, 60];

// ─── Validation Rules ─────────────────────────────────────────────────────────

/**
 * Rule: frameCount must equal spec.frames.length.
 */
function checkFrameCountConsistency(spec: AnimationSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (spec.frames.length !== spec.frameCount) {
    issues.push({
      severity: 'error',
      rule: 'FRAME_COUNT_MISMATCH',
      message:
        `spec.frameCount is ${spec.frameCount} but spec.frames has ${spec.frames.length} entries. ` +
        `These must match.`,
    });
  }
  return issues;
}

/**
 * Rule: No frame may have a durationMs of 0 or less.
 */
function checkNonZeroDuration(spec: AnimationSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const frame of spec.frames) {
    if (frame.durationMs <= 0) {
      issues.push({
        severity: 'error',
        rule: 'ZERO_DURATION_FRAME',
        message: `Frame ${frame.index} has durationMs=${frame.durationMs}. All frames must have duration > 0ms.`,
        frameIndex: frame.index,
      });
    }
  }
  return issues;
}

/**
 * Rule: frame.index values must be sequential starting at 0.
 */
function checkFrameIndexSequence(spec: AnimationSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  spec.frames.forEach((frame, i) => {
    if (frame.index !== i) {
      issues.push({
        severity: 'error',
        rule: 'FRAME_INDEX_OUT_OF_ORDER',
        message: `Frame at array position ${i} has index=${frame.index}. Expected ${i}.`,
        frameIndex: i,
      });
    }
  });
  return issues;
}

/**
 * Rule: Walk cycles must have an even frame count (from WALK_CYCLE_VALID_COUNTS).
 */
function checkWalkCycleFrameCount(spec: AnimationSpec): ValidationIssue[] {
  if (spec.type !== 'walk') return [];
  if (!WALK_CYCLE_VALID_COUNTS.includes(spec.frameCount)) {
    return [
      {
        severity: 'error',
        rule: 'WALK_CYCLE_ODD_FRAME_COUNT',
        message:
          `Walk cycles must use an even frame count. "${spec.frameCount}" is not in the ` +
          `approved list: [${WALK_CYCLE_VALID_COUNTS.join(', ')}]. ` +
          `An odd frame count breaks left-right walk symmetry.`,
      },
    ];
  }
  return [];
}

/**
 * Rule: Attack animations must have at least MIN_ANTICIPATION_FRAMES keyframes
 * before any frame whose description includes "impact" or "hit" or "strike".
 */
function checkAttackAnticipation(spec: AnimationSpec): ValidationIssue[] {
  if (spec.type !== 'attack') return [];
  const issues: ValidationIssue[] = [];

  const impactIndex = spec.frames.findIndex((f) =>
    /impact|hit|strike/i.test(f.description),
  );

  if (impactIndex === -1) {
    issues.push({
      severity: 'warning',
      rule: 'ATTACK_NO_IMPACT_FRAME',
      message:
        `Attack animation "${spec.name}" has no frame with "impact", "hit", or "strike" in its description. ` +
        `At least one impact frame should be explicitly labeled.`,
    });
    return issues;
  }

  // Count anticipation frames: frames before the impact frame that are marked as keyframes
  const anticipationKeyframes = spec.frames
    .slice(0, impactIndex)
    .filter((f) => f.isKeyframe);

  if (anticipationKeyframes.length < MIN_ANTICIPATION_FRAMES) {
    issues.push({
      severity: 'error',
      rule: 'ATTACK_INSUFFICIENT_ANTICIPATION',
      message:
        `Attack animation "${spec.name}" has only ${anticipationKeyframes.length} anticipation keyframe(s) before ` +
        `the impact frame at index ${impactIndex}. Minimum is ${MIN_ANTICIPATION_FRAMES}. ` +
        `Without sufficient anticipation, attacks feel unreadable and unfair.`,
      frameIndex: impactIndex,
    });
  }

  return issues;
}

/**
 * Rule: Idle animations for blink-required characters must have at least one frame
 * whose description or keyChanges mentions "blink", "eye close", or "eyes close".
 */
function checkIdleHasBlink(spec: AnimationSpec): ValidationIssue[] {
  if (spec.type !== 'idle') return [];
  if (!BLINK_REQUIRED_CHARACTERS.includes(spec.character)) return [];

  const hasBlinkFrame = spec.frames.some(
    (f) =>
      /blink|eye.?clos/i.test(f.description) ||
      f.keyChanges.some((kc) => /blink|eye.?clos/i.test(kc)),
  );

  if (!hasBlinkFrame) {
    return [
      {
        severity: 'warning',
        rule: 'IDLE_MISSING_BLINK',
        message:
          `Idle animation for character "${spec.character}" has no blink frame. ` +
          `At least one frame should describe an eye blink. ` +
          `Blinks make characters feel alive and are critical for player empathy.`,
      },
    ];
  }
  return [];
}

/**
 * Rule: No more than MAX_NON_KEYFRAME_RUN consecutive frames without a keyframe.
 */
function checkKeyframeSpacing(spec: AnimationSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  let consecutiveNonKeyframes = 0;
  let runStartIndex = 0;

  for (const frame of spec.frames) {
    if (!frame.isKeyframe) {
      if (consecutiveNonKeyframes === 0) runStartIndex = frame.index;
      consecutiveNonKeyframes++;
      if (consecutiveNonKeyframes > MAX_NON_KEYFRAME_RUN) {
        issues.push({
          severity: 'warning',
          rule: 'KEYFRAME_SPACING_TOO_WIDE',
          message:
            `${consecutiveNonKeyframes} consecutive non-keyframes starting at frame ${runStartIndex}. ` +
            `Maximum allowed is ${MAX_NON_KEYFRAME_RUN}. Add a keyframe to clarify the mid-animation pose.`,
          frameIndex: runStartIndex,
        });
        // Report once per run (reset to avoid flooding)
        consecutiveNonKeyframes = 0;
      }
    } else {
      consecutiveNonKeyframes = 0;
    }
  }
  return issues;
}

/**
 * Rule: Frame count should be within the expected range for the animation type.
 */
function checkFrameCountRange(spec: AnimationSpec): ValidationIssue[] {
  const [min, max] = EXPECTED_FRAME_COUNTS[spec.type];
  if (spec.frameCount < min || spec.frameCount > max) {
    return [
      {
        severity: 'warning',
        rule: 'FRAME_COUNT_OUT_OF_RANGE',
        message:
          `"${spec.type}" animations typically use ${min}–${max} frames. ` +
          `This animation has ${spec.frameCount} frames. ` +
          `${spec.frameCount < min ? 'Too few frames may feel abrupt.' : 'Too many frames may waste budget or look sluggish.'}`,
      },
    ];
  }
  return [];
}

/**
 * Rule: targetFPS must be a recognized BitBio animation FPS value.
 */
function checkTargetFPS(spec: AnimationSpec): ValidationIssue[] {
  if (!VALID_FPS_VALUES.includes(spec.targetFPS)) {
    return [
      {
        severity: 'info',
        rule: 'UNUSUAL_TARGET_FPS',
        message:
          `targetFPS=${spec.targetFPS} is not a standard BitBio animation rate. ` +
          `Standard values: [${VALID_FPS_VALUES.join(', ')}]. ` +
          `Using non-standard rates can cause sync issues with the game loop.`,
      },
    ];
  }
  return [];
}

/**
 * Rule: Each frame description should be a non-empty string.
 */
function checkFrameDescriptions(spec: AnimationSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const frame of spec.frames) {
    if (!frame.description || frame.description.trim().length === 0) {
      issues.push({
        severity: 'info',
        rule: 'EMPTY_FRAME_DESCRIPTION',
        message: `Frame ${frame.index} has an empty description. Add a description of what's happening.`,
        frameIndex: frame.index,
      });
    }
    if (frame.keyChanges.length === 0 && frame.isKeyframe) {
      issues.push({
        severity: 'info',
        rule: 'KEYFRAME_NO_KEY_CHANGES',
        message:
          `Frame ${frame.index} is marked as a keyframe but has no keyChanges listed. ` +
          `Document which pixels or elements change at this key pose.`,
        frameIndex: frame.index,
      });
    }
  }
  return issues;
}

/**
 * Rule: Henry (holographic character) idle should mention "flicker" or "translucen" in at least one frame.
 */
function checkHenryHolographicEffect(spec: AnimationSpec): ValidationIssue[] {
  if (spec.character !== 'henry' || spec.type !== 'idle') return [];

  const hasFlicker = spec.frames.some(
    (f) =>
      /flicker|translucen|alpha|ghost|glow/i.test(f.description) ||
      f.keyChanges.some((kc) => /flicker|translucen|alpha|ghost|glow/i.test(kc)),
  );

  if (!hasFlicker) {
    return [
      {
        severity: 'warning',
        rule: 'HENRY_MISSING_FLICKER',
        message:
          `Henry's idle animation should include a holographic flicker frame. ` +
          `Henry's translucency and flicker are core to his visual identity. ` +
          `Add at least one frame describing the alpha/flicker effect.`,
      },
    ];
  }
  return [];
}

/**
 * Rule: Enzyme idle should mention "tail" animation in at least one frame.
 */
function checkEnzymeTailAnimation(spec: AnimationSpec): ValidationIssue[] {
  if (spec.character !== 'enzyme' || spec.type !== 'idle') return [];

  const hasTail = spec.frames.some(
    (f) =>
      /tail/i.test(f.description) ||
      f.keyChanges.some((kc) => /tail/i.test(kc)),
  );

  if (!hasTail) {
    return [
      {
        severity: 'warning',
        rule: 'ENZYME_MISSING_TAIL_SWAY',
        message:
          `Enzyme's idle animation should include tail sway frames. ` +
          `The tail sway is Enzyme's primary idle animation secondary action. ` +
          `Add frames describing the tail position changes.`,
      },
    ];
  }
  return [];
}

// ─── Score Calculation ────────────────────────────────────────────────────────

function calculateScore(issues: ValidationIssue[]): number {
  const deduction = issues.reduce(
    (total, issue) => total + SCORE_DEDUCTIONS[issue.severity],
    0,
  );
  return Math.max(0, 100 - deduction);
}

// ─── Suggestion Generation ────────────────────────────────────────────────────

function generateSuggestions(spec: AnimationSpec, issues: ValidationIssue[]): string[] {
  const suggestions: string[] = [];
  const ruleNames = new Set(issues.map((i) => i.rule));

  if (ruleNames.has('IDLE_MISSING_BLINK')) {
    suggestions.push(
      `Add a 2-frame blink sequence to the idle animation. ` +
        `Example: frame N = "eyes half-close", frame N+1 = "eyes closed", frame N+2 = "eyes open".`,
    );
  }

  if (ruleNames.has('ATTACK_INSUFFICIENT_ANTICIPATION')) {
    suggestions.push(
      `Add ${MIN_ANTICIPATION_FRAMES} anticipation keyframes before the impact frame. ` +
        `Anticipation frames should show the character winding up — body leaning opposite the attack direction.`,
    );
  }

  if (ruleNames.has('WALK_CYCLE_ODD_FRAME_COUNT')) {
    const nearest = WALK_CYCLE_VALID_COUNTS.find((n) => n >= spec.frameCount) ?? 8;
    suggestions.push(
      `Change frameCount to ${nearest} and add/remove ${Math.abs(nearest - spec.frameCount)} frame(s) ` +
        `to achieve symmetric left-right walk alternation.`,
    );
  }

  if (ruleNames.has('KEYFRAME_SPACING_TOO_WIDE')) {
    suggestions.push(
      `Add keyframes to mark important in-between poses. ` +
        `A keyframe every ${MAX_NON_KEYFRAME_RUN} frames ensures animators and reviewers can verify the motion arc.`,
    );
  }

  if (spec.type === 'walk' && spec.frameCount >= 8) {
    suggestions.push(
      `For an 8-frame walk cycle, use the pattern: Contact → Down → Passing → Up (×2 for each side). ` +
        `See ANIMATION-ENCYCLOPEDIA.md Section 2 for full frame-by-frame breakdown.`,
    );
  }

  if (spec.character === 'henry') {
    suggestions.push(
      `Remember to set ctx.globalAlpha = 0.65 before drawing Henry's pixels in the engine. ` +
        `Henry's translucency is part of his character, not an animation state.`,
    );
  }

  if (issues.length === 0) {
    suggestions.push(
      `Animation passes all checks. Next step: implement in PixelWorldEngine.tsx ` +
        `and run through the sprite pipeline (SPRITE-PIPELINE.md Stage 5 → Stage 6).`,
    );
  }

  return suggestions;
}

// ─── Main Validator ───────────────────────────────────────────────────────────

/**
 * Validates an AnimationSpec against all BitBio animation standards.
 * Returns a ValidationResult with a score (0–100), categorized issues, and suggestions.
 */
export function validateAnimation(spec: AnimationSpec): ValidationResult {
  const allIssues: ValidationIssue[] = [
    ...checkFrameCountConsistency(spec),
    ...checkNonZeroDuration(spec),
    ...checkFrameIndexSequence(spec),
    ...checkWalkCycleFrameCount(spec),
    ...checkAttackAnticipation(spec),
    ...checkIdleHasBlink(spec),
    ...checkKeyframeSpacing(spec),
    ...checkFrameCountRange(spec),
    ...checkTargetFPS(spec),
    ...checkFrameDescriptions(spec),
    ...checkHenryHolographicEffect(spec),
    ...checkEnzymeTailAnimation(spec),
  ];

  const score = calculateScore(allIssues);
  const suggestions = generateSuggestions(spec, allIssues);
  const hasErrors = allIssues.some((i) => i.severity === 'error');

  return {
    valid: !hasErrors,
    score,
    issues: allIssues,
    suggestions,
  };
}

// ─── Template Generator ───────────────────────────────────────────────────────

/**
 * Generates a starter AnimationSpec template for a given character and animation type.
 * The template is a valid scaffold — it will need frame descriptions filled in
 * before it passes full validation.
 */
export function generateAnimationTemplate(
  character: string,
  type: string,
): AnimationSpec {
  const validChar = character as CharacterName;
  const validType = type as AnimationType;

  const defaults: Record<AnimationType, { frameCount: number; fps: number }> = {
    idle: { frameCount: 8, fps: 10 },
    walk: { frameCount: 8, fps: 10 },
    run: { frameCount: 4, fps: 12 },
    attack: { frameCount: 8, fps: 15 },
    react: { frameCount: 4, fps: 10 },
    special: { frameCount: 8, fps: 10 },
  };

  const config = defaults[validType] ?? { frameCount: 8, fps: 10 };
  const frameDurationMs = Math.round(1000 / config.fps);

  const frames: AnimationFrame[] = Array.from({ length: config.frameCount }, (_, i) => {
    const isKeyframe =
      i === 0 ||
      i === config.frameCount - 1 ||
      i === Math.floor(config.frameCount / 2);

    // For attack animations, mark first 2 frames as anticipation and the mid-frame as impact
    let description = `Frame ${i}: [describe what ${validChar} is doing]`;
    const keyChanges: string[] = [];

    if (validType === 'attack') {
      if (i < MIN_ANTICIPATION_FRAMES) {
        description = `Frame ${i}: Anticipation — ${validChar} winds up for attack`;
        keyChanges.push('body leans back', 'arm raises');
      } else if (i === MIN_ANTICIPATION_FRAMES) {
        description = `Frame ${i}: Impact — strike makes contact`;
        keyChanges.push('arm extends to impact point', 'hit spark at contact');
      } else {
        description = `Frame ${i}: Recovery — ${validChar} returns to ready stance`;
        keyChanges.push('arm begins returning');
      }
    } else if (validType === 'walk') {
      const phases = ['Contact', 'Down', 'Passing', 'Up'];
      const sideLabel = i < config.frameCount / 2 ? 'R' : 'L';
      const phaseLabel = phases[i % 4];
      description = `Frame ${i}: ${phaseLabel} (${sideLabel} foot)`;
      keyChanges.push(`${sideLabel === 'R' ? 'right' : 'left'} foot position`);
    } else if (validType === 'idle') {
      if (i === 0) {
        description = `Frame 0: Neutral idle pose`;
        keyChanges.push('base pose established');
      } else if (i === Math.floor(config.frameCount * 0.6)) {
        description = `Frame ${i}: Blink — eyes close`;
        keyChanges.push('eye pixels close', 'eyelid descends');
      }
    }

    return {
      index: i,
      durationMs: frameDurationMs,
      description,
      keyChanges,
      isKeyframe,
    };
  });

  return {
    name: `${validChar}-${validType}`,
    frameCount: config.frameCount,
    targetFPS: config.fps,
    character: validChar,
    type: validType,
    frames,
  };
}

// ─── CLI Runner ───────────────────────────────────────────────────────────────

function printValidationResult(result: ValidationResult): void {
  const bar = (n: number): string => {
    const filled = Math.round(n / 5);
    return '[' + '█'.repeat(filled) + '░'.repeat(20 - filled) + ']';
  };

  console.log('\n══════════════════════════════════════════');
  console.log('  BitBio Animation Validator');
  console.log('══════════════════════════════════════════');
  console.log(`  Status : ${result.valid ? 'PASS' : 'FAIL'}`);
  console.log(`  Score  : ${result.score}/100  ${bar(result.score)}`);
  console.log('──────────────────────────────────────────');

  if (result.issues.length === 0) {
    console.log('  No issues found.');
  } else {
    const errors = result.issues.filter((i) => i.severity === 'error');
    const warnings = result.issues.filter((i) => i.severity === 'warning');
    const infos = result.issues.filter((i) => i.severity === 'info');

    for (const issue of errors) {
      console.log(`  [ERROR]   ${issue.rule}`);
      console.log(`            ${issue.message}`);
      if (issue.frameIndex !== undefined) {
        console.log(`            (at frame ${issue.frameIndex})`);
      }
    }
    for (const issue of warnings) {
      console.log(`  [WARN]    ${issue.rule}`);
      console.log(`            ${issue.message}`);
    }
    for (const issue of infos) {
      console.log(`  [INFO]    ${issue.rule}`);
      console.log(`            ${issue.message}`);
    }
  }

  console.log('──────────────────────────────────────────');
  console.log('  Suggestions:');
  for (const s of result.suggestions) {
    console.log(`  • ${s}`);
  }
  console.log('══════════════════════════════════════════\n');
}

if (require.main === module) {
  const [, , command, arg1, arg2] = process.argv;

  if (command === 'validate' && arg1) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const spec: AnimationSpec = require(arg1);
    const result = validateAnimation(spec);
    printValidationResult(result);
    process.exit(result.valid ? 0 : 1);
  } else if (command === 'template' && arg1 && arg2) {
    const template = generateAnimationTemplate(arg1, arg2);
    console.log(JSON.stringify(template, null, 2));
  } else {
    console.log('Usage:');
    console.log('  npx ts-node animation-validator.ts validate <path-to-spec.json>');
    console.log('  npx ts-node animation-validator.ts template <character> <type>');
    console.log('');
    console.log('Characters:', ['player', 'enzyme', 'elliot', 'ben', 'alex', 'henry', 'boss'].join(', '));
    console.log('Types:', ['idle', 'walk', 'run', 'attack', 'react', 'special'].join(', '));
    process.exit(1);
  }
}
