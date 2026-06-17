/**
 * BitBio Pixel Art Studio — Perfection Loop
 * Phase 6: Continuous critique, scoring, and iteration system
 *
 * Every shipped asset enters the perfection loop. Any asset scoring < 8.5
 * automatically receives an improvement record. Weekly visual polish sprints
 * target the lowest-scored shipped assets until the game's average exceeds 8.5.
 *
 * Benchmark standard: Undertale (9.2/10) and OMORI (9.1/10) as measured by
 * our QUALITY-RUBRIC.json weighted formula.
 */

import type { AssetType } from './PRODUCTION-PIPELINE';

// ─── Types ──────────────────────────────────────────────────────────────────────

export type Verdict = 'reject' | 'needs-work' | 'acceptable' | 'good' | 'excellent';

export interface CritiqueDimension {
  name: string;
  score: number;          // 0-10
  weight: number;         // 0-1; all weights in a set must sum to 1.0
  feedback: string;
  examples: string[];     // references to benchmark games
}

export interface AssetCritique {
  assetId: string;
  assetType: AssetType;
  currentScore: number;   // 0-100 (weighted sum * 10)
  iteration: number;
  benchmarkGame: string;
  dimensions: CritiqueDimension[];
  overallVerdict: Verdict;
  nextActions: string[];
}

// ─── Dimension Weight Sets ─────────────────────────────────────────────────────

/**
 * Canonical weights for character sprite critiques.
 * Six dimensions summing to 1.0, matching QUALITY-RUBRIC.json intent.
 */
const SPRITE_WEIGHTS: Record<string, number> = {
  silhouetteClarity:     0.20,
  colorCount:            0.15,
  anatomyAccuracy:       0.15,
  animationReadiness:    0.15,
  styleConsistency:      0.20,
  emotionalExpression:   0.15,
};

/**
 * Weights for background / environment critiques.
 */
const BACKGROUND_WEIGHTS: Record<string, number> = {
  atmosphericDepth:      0.25,
  paletteAdherence:      0.20,
  realmIdentity:         0.20,
  readabilityAtGameScale:0.20,
  animationPolish:       0.15,
};

/**
 * Weights for multi-frame animation critiques.
 */
const ANIMATION_WEIGHTS: Record<string, number> = {
  frameConsistency:      0.25,
  motionWeight:          0.20,
  timingAccuracy:        0.20,
  silhouettePerFrame:    0.20,
  characterPersonality:  0.15,
};

// ─── Score ↔ Verdict Mapping ───────────────────────────────────────────────────

/**
 * Convert a 0-100 score to a categorical verdict.
 *
 * < 50  → reject      (do not ship; return to design)
 * 50-69 → needs-work  (ship to unblock, create improvement ticket)
 * 70-79 → acceptable  (ships; targeted improvement later)
 * 80-84 → good        (ships; no ticket required)
 * ≥ 85  → excellent   (sets the quality bar; reference in DESIGN-RULES.md)
 */
export function scoreToVerdict(score: number): Verdict {
  if (score < 50) return 'reject';
  if (score < 70) return 'needs-work';
  if (score < 80) return 'acceptable';
  if (score < 85) return 'good';
  return 'excellent';
}

// ─── Weighted Score Calculation ────────────────────────────────────────────────

function calculateWeightedScore(dimensions: CritiqueDimension[]): number {
  const total = dimensions.reduce((sum, d) => sum + d.score * d.weight * 10, 0);
  return Math.round(total * 10) / 10; // round to 1 decimal place
}

// ─── Critique Constructors ─────────────────────────────────────────────────────

/**
 * Critique a character sprite against Undertale/OMORI standards.
 *
 * @param description - Plain-English description of the sprite (e.g. "Purple oval lysosome with 8 spikes")
 * @param realm       - Which realm this sprite belongs to (1-4)
 */
export function critiqueSprite(description: string, realm: number): AssetCritique {
  const lc = description.toLowerCase();

  // Heuristic scoring based on description keywords (agents can override with actual scores)
  const hasStrongSilhouette     = /iconic|distinct|recogniz|clear|strong/.test(lc);
  const hasLimitedPalette       = /limited|restrained|few colors|5 color|6 color|7 color/.test(lc);
  const hasCorrectAnatomy       = /proportion|correct|scale|accurate|well.formed/.test(lc);
  const hasPosedKeyframes       = /posed|key.?frame|action.?ready|dynamic/.test(lc);
  const matchesBitBioStyle      = /dark|neon|teal|purple|omori|undertale|bitbio/.test(lc);
  const hasEmotionalRead        = /personality|expression|menacing|sad|angry|friendly/.test(lc);

  const dimensions: CritiqueDimension[] = [
    {
      name: 'Silhouette Clarity',
      score: hasStrongSilhouette ? 8 : 5,
      weight: SPRITE_WEIGHTS.silhouetteClarity,
      feedback: hasStrongSilhouette
        ? 'Silhouette is distinctive and readable at reduced scale.'
        : 'Silhouette blends with environment at small scale. Apply 5px Gaussian blur and check readability.',
      examples: [
        'Undertale: Frisk\'s pigtails and striped shirt create instant iconicity',
        'OMORI: Omori\'s black hair and white shirt silhouette is minimal but unforgettable',
        'Celeste: Madeline\'s hair-streak is the key silhouette differentiator',
      ],
    },
    {
      name: 'Color Count',
      score: hasLimitedPalette ? 8 : 5,
      weight: SPRITE_WEIGHTS.colorCount,
      feedback: hasLimitedPalette
        ? 'Color count is within the 6-8 color budget for sprites.'
        : 'Color count may exceed budget. Count unique hex values in drawXxx() function. Target: ≤ 8.',
      examples: [
        'Undertale: Sans uses 5 colors (white, dark gray, light gray, black eye, blue eye)',
        'OMORI: Omori uses 4 colors (white, black, dark gray, mouth red)',
        'Pokemon B/W: Trainer sprites average 7-8 colors',
      ],
    },
    {
      name: 'Anatomy Accuracy',
      score: hasCorrectAnatomy ? 8 : 5,
      weight: SPRITE_WEIGHTS.anatomyAccuracy,
      feedback: hasCorrectAnatomy
        ? 'Proportions match BitBio style guide (10x20 game pixels for characters).'
        : `Verify proportions for realm ${realm} character standards. Head should be 4-6px tall, body 12-16px.`,
      examples: [
        'BitBio standard: 10px wide × 20px tall for NPCs (verified in PixelWorldEngine.tsx)',
        'Undertale: Frisk is 10×20 game pixels — identical ratio to BitBio NPCs',
        'Boss sprites: scale to fill 240×180 game-pixel canvas',
      ],
    },
    {
      name: 'Animation Readiness',
      score: hasPosedKeyframes ? 8 : 5,
      weight: SPRITE_WEIGHTS.animationReadiness,
      feedback: hasPosedKeyframes
        ? 'Neutral pose works well as an animation key frame.'
        : 'Neutral/rest pose is not dynamic enough to anchor an animation cycle. Introduce weight shift.',
      examples: [
        'Undertale Papyrus: neutral arms-out pose immediately implies personality AND is an animation keyframe',
        'Stardew Valley characters: idle pose with slight weight distribution reads as "ready to move"',
        'Pokemon sprites: clear separation between body mass and limbs makes animation trivial',
      ],
    },
    {
      name: 'Style Consistency',
      score: matchesBitBioStyle ? 8 : 4,
      weight: SPRITE_WEIGHTS.styleConsistency,
      feedback: matchesBitBioStyle
        ? 'Visual style matches BitBio dark-background / neon-accent aesthetic.'
        : 'Asset does not feel like it belongs in BitBio. Check: dark base colors, limited neon accent, no gradients.',
      examples: [
        `Realm ${realm} accent: ${['#00ffcc', '#00ff88', '#cc44ff', '#ffaa22'][realm - 1] ?? '#00ffcc'}`,
        'OMORI\'s White Space: pure white and black, zero gradients — "extreme restraint is style"',
        'Undertale: every pixel serves a role — no decorative color without function',
      ],
    },
    {
      name: 'Emotional Expression',
      score: hasEmotionalRead ? 8 : 4,
      weight: SPRITE_WEIGHTS.emotionalExpression,
      feedback: hasEmotionalRead
        ? 'Character emotional state is readable from the sprite alone.'
        : 'Emotional state is ambiguous. Add a clear visual signal: eye shape, posture lean, or color shift.',
      examples: [
        'Undertale Flowey: petal arrangement and eye shape communicate innocence → menace arc',
        'OMORI: Aubrey\'s body language (arms crossed, forward lean) reads as defensive hostility',
        'BitBio LYSO: acid drips and cracking membrane communicate "damaged and dangerous"',
      ],
    },
  ];

  const score = calculateWeightedScore(dimensions);
  const verdict = scoreToVerdict(score);

  return {
    assetId: `sprite-r${realm}-${description.replace(/\s+/g, '-').slice(0, 20).toLowerCase()}`,
    assetType: 'sprite',
    currentScore: score,
    iteration: 1,
    benchmarkGame: realm <= 2 ? 'Undertale' : 'OMORI',
    dimensions,
    overallVerdict: verdict,
    nextActions: getImprovementActions({ assetId: '', assetType: 'sprite', currentScore: score, iteration: 1, benchmarkGame: '', dimensions, overallVerdict: verdict, nextActions: [] }),
  };
}

/**
 * Critique a multi-frame animation.
 *
 * @param frames      - Number of frames in the animation
 * @param timing      - Array of milliseconds per frame
 * @param description - Plain-English description of the animation
 */
export function critiqueAnimation(frames: number, timing: number[], description: string): AssetCritique {
  const lc = description.toLowerCase();

  const hasGoodFrameCount   = frames >= 4;
  const hasVariedTiming     = timing.length > 1 && new Set(timing).size > 1;
  const hasWeight           = /ease|overshoot|settle|squash|anticipat/.test(lc);
  const hasClearSilhouette  = /clear|readable|distinct|visible/.test(lc);
  const hasPersonality      = /personality|character|expressive|unique/.test(lc);

  const avgTiming = timing.length > 0 ? timing.reduce((a, b) => a + b, 0) / timing.length : 150;
  const timingScore = avgTiming >= 80 && avgTiming <= 200 ? 8 : avgTiming < 80 ? 5 : 6;

  const dimensions: CritiqueDimension[] = [
    {
      name: 'Frame Consistency',
      score: hasGoodFrameCount ? 8 : 4,
      weight: ANIMATION_WEIGHTS.frameConsistency,
      feedback: hasGoodFrameCount
        ? `${frames}-frame animation cycle is industry-appropriate.`
        : `${frames} frames is below minimum. Industry standard: 4 frames for walk/run, 2 frames for idle.`,
      examples: [
        'Pokemon B/W: 4-frame walk cycles at 150ms each',
        'Undertale: 2-frame idle (minimal but characterful)',
        'Stardew Valley: 4-8 frame animations at 100-150ms',
      ],
    },
    {
      name: 'Motion Weight',
      score: hasWeight ? 8 : 5,
      weight: ANIMATION_WEIGHTS.motionWeight,
      feedback: hasWeight
        ? 'Animation demonstrates secondary motion or follow-through.'
        : 'Animation feels mechanical — add 1px overshoot or ease-in/ease-out to key positions.',
      examples: [
        'Undertale walk: slight head-bob creates weight without complex rigging',
        'OMORI idle: breathing cycle is 1px vertical movement — imperceptible but felt',
        'Stardew Valley: hair and accessories trail behind movement direction',
      ],
    },
    {
      name: 'Timing Accuracy',
      score: timingScore,
      weight: ANIMATION_WEIGHTS.timingAccuracy,
      feedback: `Average frame duration: ${Math.round(avgTiming)}ms. ${timingScore >= 7 ? 'Timing is appropriate.' : avgTiming < 80 ? 'Too fast — animation unreadable at game speed.' : 'Too slow — movement feels sluggish.'}`,
      examples: [
        'Walk cycle: 150ms/frame (Pokemon B/W standard)',
        'Idle: 300-500ms/frame (slow enough to read)',
        'Hit reaction: 50-80ms/frame (snappy, urgent)',
      ],
    },
    {
      name: 'Silhouette Per Frame',
      score: hasClearSilhouette ? 8 : 5,
      weight: ANIMATION_WEIGHTS.silhouettePerFrame,
      feedback: hasClearSilhouette
        ? 'Character silhouette remains readable across all frames.'
        : 'Some frames lose silhouette clarity. Each frame must pass the blur test independently.',
      examples: [
        'Rule: blur each frame individually — if character is unidentifiable, rethink pose',
        'Undertale Toriel: every walk frame maintains the apron-and-horns silhouette',
      ],
    },
    {
      name: 'Character Personality',
      score: hasPersonality ? 8 : 4,
      weight: ANIMATION_WEIGHTS.characterPersonality,
      feedback: hasPersonality
        ? 'Animation expresses character personality beyond pure locomotion.'
        : 'Animation conveys movement but not character. Add ONE personality element per character.',
      examples: [
        'Elliot: glasses-push on idle frames communicates "nervous academic"',
        'Ben: sandwich sway communicates "always eating, always cheerful"',
        'Henry: opacity flicker communicates "not fully here, not fully gone"',
      ],
    },
  ];

  const score = calculateWeightedScore(dimensions);
  const verdict = scoreToVerdict(score);
  const assetId = `anim-${description.replace(/\s+/g, '-').slice(0, 20).toLowerCase()}`;

  return {
    assetId,
    assetType: 'animation',
    currentScore: score,
    iteration: 1,
    benchmarkGame: 'Pokemon Black/White',
    dimensions,
    overallVerdict: verdict,
    nextActions: getImprovementActions({ assetId, assetType: 'animation', currentScore: score, iteration: 1, benchmarkGame: 'Pokemon Black/White', dimensions, overallVerdict: verdict, nextActions: [] }),
  };
}

/**
 * Critique a background or environmental asset.
 *
 * @param description - Plain-English description of the background
 * @param realm       - Which realm this background belongs to (1-4)
 */
export function critiqueBackground(description: string, realm: number): AssetCritique {
  const lc = description.toLowerCase();

  const hasDepth         = /layer|parallax|depth|distance|foreground|background/.test(lc);
  const hasRealmPalette  = /teal|green|purple|amber|realm|accent/.test(lc);
  const hasIdentity      = /cytoplasm|genome|neural|protein|organelle|helix|synaps|gothic/.test(lc);
  const isReadable       = /visible|clear|readable/.test(lc);
  const isAnimated       = /animat|pulse|bob|flicker|wave|move/.test(lc);

  const dimensions: CritiqueDimension[] = [
    {
      name: 'Atmospheric Depth',
      score: hasDepth ? 8 : 4,
      weight: BACKGROUND_WEIGHTS.atmosphericDepth,
      feedback: hasDepth
        ? 'Layered parallax creates convincing depth.'
        : 'Background feels flat. Add 2-3 depth layers: far (10% opacity), mid (30%), near (60%).',
      examples: [
        'OMORI White Space: pure white gives infinite depth through emptiness — the ultimate negative space',
        'Undertale Ruins: darkness as depth — only what the player can "see" is lit',
        'Celeste: mountain peaks at 10% opacity, midground at 40%, ground at 100%',
      ],
    },
    {
      name: 'Palette Adherence',
      score: hasRealmPalette ? 9 : 5,
      weight: BACKGROUND_WEIGHTS.paletteAdherence,
      feedback: hasRealmPalette
        ? 'Background uses correct realm palette from BITBIO-PALETTE.json.'
        : `Verify all colors match Realm ${realm} palette. Run validateRealmAsset() before shipping.`,
      examples: [
        'Realm 1 (Cytoplasm): base #050d10, accent #00ffcc',
        'Realm 2 (Genome Forest): base #050f04, accent #00ff88',
        'Realm 3 (Neural Nebula): base #030008, accent #cc44ff',
        'Realm 4 (Protein Cathedral): base #0a080f, accent #ffaa22',
      ],
    },
    {
      name: 'Realm Identity',
      score: hasIdentity ? 9 : 4,
      weight: BACKGROUND_WEIGHTS.realmIdentity,
      feedback: hasIdentity
        ? 'Background immediately communicates which realm the player is in.'
        : 'Background is too generic. Add ONE unmistakable realm-specific element (helix, organelle, spire, pillar).',
      examples: [
        'Realm 1 test: stranger sees screenshot, says "inside a cell" without prompting',
        'Realm 2 test: DNA double helix visible in T-tile within 3 seconds of looking',
        'Realm 3 test: void + neural spires = "inside a brain or outer space"',
        'Realm 4 test: gothic pillars + amber candlelight = "cathedral of proteins"',
      ],
    },
    {
      name: 'Readability at Game Scale',
      score: isReadable ? 8 : 5,
      weight: BACKGROUND_WEIGHTS.readabilityAtGameScale,
      feedback: isReadable
        ? 'Background elements are visible at SCALE=3 (48px per game tile).'
        : 'Background elements may be lost at game scale. Check screenshot at actual CSS pixel resolution.',
      examples: [
        'At SCALE=3: 1 game pixel = 3 CSS pixels. Minimum visible detail: 2 game pixels.',
        'Organelles (Realm 1 bg): must be ≥ 4x4 game pixels to read at 1080p',
      ],
    },
    {
      name: 'Animation Polish',
      score: isAnimated ? 8 : 3,
      weight: BACKGROUND_WEIGHTS.animationPolish,
      feedback: isAnimated
        ? 'Background has at least one animated element to prevent static feel.'
        : 'Background is fully static. Add ONE ambient animation: drifting particles, pulsing glow, or parallax shift.',
      examples: [
        'Realm 1 current: animated organelles (mitochondria, ribosomes) — score 7.5/10',
        'OMORI: even the "static" White Space has a subtle vignette pulse on boss encounters',
        'Undertale: waterfall region has animated water particles and falling leaves',
      ],
    },
  ];

  const score = calculateWeightedScore(dimensions);
  const verdict = scoreToVerdict(score);
  const assetId = `bg-r${realm}-${description.replace(/\s+/g, '-').slice(0, 20).toLowerCase()}`;

  return {
    assetId,
    assetType: 'background',
    currentScore: score,
    iteration: 1,
    benchmarkGame: realm === 3 ? 'Hyper Light Drifter' : 'Undertale',
    dimensions,
    overallVerdict: verdict,
    nextActions: getImprovementActions({ assetId, assetType: 'background', currentScore: score, iteration: 1, benchmarkGame: 'Undertale', dimensions, overallVerdict: verdict, nextActions: [] }),
  };
}

// ─── Improvement Actions ───────────────────────────────────────────────────────

/**
 * Given a critique, return specific, actionable next steps.
 * Each action is a concrete thing a developer can implement in the same session.
 */
export function getImprovementActions(critique: AssetCritique): string[] {
  const actions: string[] = [];
  const lowDimensions = critique.dimensions.filter((d) => d.score < 7);

  for (const dim of lowDimensions) {
    switch (dim.name) {
      case 'Silhouette Clarity':
        actions.push(
          'Apply 5px Gaussian blur mentally — is the character shape still identifiable? If not, widen the shape or increase contrast at edges.',
          'Add 1px highlight edge at top-left (top-lit convention): shiftColor(baseColor, +40) for topmost row.',
        );
        break;

      case 'Color Count':
        actions.push(
          `Count unique hex strings in the draw function. If > 8, eliminate the least-used color by merging it with the nearest neighbor.`,
          'Shadows: use shiftColor(base, -30) instead of a new hex. Highlights: use shiftColor(base, +40).',
        );
        break;

      case 'Anatomy Accuracy':
        actions.push(
          'Map sprite on pixel grid paper (or comment grid) before coding. Head: 4-6px tall. Body: 10-14px tall. Width: 8-12px.',
          'At SCALE=3, each game pixel is 3×3 canvas pixels. Verify proportions in browser screenshot.',
        );
        break;

      case 'Animation Readiness':
        actions.push(
          'Introduce a 1px weight shift to the neutral pose — one foot 1px lower, opposite hip 1px higher.',
          'Ensure both arms are visible in the neutral frame — symmetry is the enemy of animation.',
        );
        break;

      case 'Style Consistency':
        actions.push(
          'Dark background check: no color should be lighter than #aaaaaa unless it is an accent glow.',
          'Run validateRealmAsset() — any colors flagged as out-of-realm must be replaced with palette equivalents.',
        );
        break;

      case 'Emotional Expression':
        actions.push(
          'Pick ONE emotional signal and commit to it: eye shape (dots = neutral, slash = angry, circle = scared), posture lean (forward = aggressive, back = afraid), or color shift (warm = happy, cool = sad).',
          'Reference: LYSO phase 3 has 3 red eyes for rage — one detail, maximum menace.',
        );
        break;

      case 'Frame Consistency':
        actions.push(
          'Add frames until reaching minimum: walk cycles need 4, idle needs 2, attack needs 2-3.',
          'Technique: walk frames 0+2 are "neutral", frames 1+3 are "stride" (opposite feet).',
        );
        break;

      case 'Motion Weight':
        actions.push(
          'Add 1px overshoot at end of motion (move 3px over 2 frames, return 1px on frame 3).',
          'Secondary motion: any held object (sandwich, coffee) trails the character movement by 1 frame.',
        );
        break;

      case 'Timing Accuracy':
        actions.push(
          'Walk cycle: 150ms/frame. Idle: 300ms/frame. Hit reaction: 60ms/frame.',
          'Adjust in animFrame timer or the t-based sin formula: slower = divide t by larger number.',
        );
        break;

      case 'Silhouette Per Frame':
        actions.push(
          'Each walk frame must pass the silhouette test independently.',
          'Stride frames: ensure limb separation is ≥ 2 game pixels so they do not merge into a blob.',
        );
        break;

      case 'Character Personality':
        actions.push(
          'Add ONE personality detail unique to this character. It need only be 2-3px of change.',
          'Examples: Elliot arm-raise, Ben sandwich-sway, Alex coffee-tilt, Henry flicker.',
        );
        break;

      case 'Atmospheric Depth':
        actions.push(
          'Add 3 opacity layers: far objects at 15% opacity, mid at 40%, near at 85%.',
          'In canvas: ctx.globalAlpha = 0.15 for the farthest layer. Reset after each layer.',
        );
        break;

      case 'Palette Adherence':
        actions.push(
          'Run validateRealmAsset() on all colors used in the draw function.',
          'Every color must appear in BITBIO-PALETTE.json for its realm or be a shiftColor() derivative.',
        );
        break;

      case 'Realm Identity':
        actions.push(
          'Add ONE iconic realm element that no other realm has: Realm 1=organelles, 2=helix, 3=spires, 4=gothic pillars.',
          'This element should be visible within the first 3 seconds of the player entering.',
        );
        break;

      case 'Readability at Game Scale':
        actions.push(
          'Take a screenshot at actual game resolution (SCALE=3). Zoom to 100%. Can you read the asset?',
          'Minimum visible size at SCALE=3: 2×2 game pixels. Any detail smaller than this will not render.',
        );
        break;

      case 'Animation Polish':
        actions.push(
          'Add ONE ambient animation: a 1px pulse, a particle drift, or a brightness cycle.',
          'Cheapest effective animation: alternating 2 brightness values every 500ms using animFrame % 2.',
        );
        break;

      default:
        actions.push(`Improve ${dim.name}: current score ${dim.score}/10. Target: 8+.`);
    }
  }

  if (critique.currentScore >= 85) {
    actions.push('Asset meets excellence threshold (85+). Add to DESIGN-RULES.md as a positive example.');
    actions.push('Document the techniques used — this asset sets the new standard for its category.');
  } else if (critique.currentScore >= 70) {
    actions.push(`Current score ${critique.currentScore}/100 is shippable. Create improvement ticket for Sprint ${Math.ceil((85 - critique.currentScore) / 5) + 1} targeting 85+.`);
  } else {
    actions.push(`Score ${critique.currentScore}/100 is below ship threshold. Do not merge. Fix ${lowDimensions.length} dimension(s) first.`);
  }

  return [...new Set(actions)]; // deduplicate
}

// ─── Pre-built Critiques: BitBio Current Assets ───────────────────────────────
// Realistic scores based on MASTER-PLAN.md current state assessment (June 2026)

/** Critique: LYSO boss sprite (current state, pre-Sprint-1 redesign) */
export const CRITIQUE_LYSO_CURRENT: AssetCritique = {
  assetId: 'boss-r1-lyso-v1',
  assetType: 'boss',
  currentScore: 45,
  iteration: 1,
  benchmarkGame: 'Undertale',
  dimensions: [
    {
      name: 'Silhouette Clarity',
      score: 4,
      weight: 0.20,
      feedback: 'Reads as a purple oval. At blur + grayscale it is indistinguishable from any circular blob. Needs outer membrane ridges and more aggressive spike geometry.',
      examples: ['Undertale Omega Flowey: spike silhouette readable at 5% scale', 'OMORI Space Boyfriend: angular form is immediately threatening'],
    },
    {
      name: 'Color Count',
      score: 7,
      weight: 0.15,
      feedback: 'Uses 8-10 colors — within budget. HP-phase tints add colors but they are well-chosen.',
      examples: ['Undertale boss color budgets: 8-12 per boss is standard for this art style'],
    },
    {
      name: 'Anatomy Accuracy',
      score: 5,
      weight: 0.15,
      feedback: 'Oval shape is biologically correct for a lysosome, but lacks the double membrane detail that makes it read as a cellular organelle vs. any blob.',
      examples: ['Real lysosome: spherical, ~1 micron diameter, single bilayer membrane — the double membrane detail is what sells the biology'],
    },
    {
      name: 'Animation Readiness',
      score: 5,
      weight: 0.15,
      feedback: 'Static pose is workable as a key frame but the spike positions do not suggest motion. Spikes should radiate dynamically.',
      examples: ['LYSO-target: 8 rotating spiked appendages in circular orbit — the motion IS the danger'],
    },
    {
      name: 'Style Consistency',
      score: 6,
      weight: 0.20,
      feedback: 'Purple palette matches Realm 1 extension (lysosome environment). Dark background contrast is appropriate. Main issue: too smooth/blobby for pixel art.',
      examples: ['BitBio Realm 1 palette: teal as accent, dark backgrounds — LYSO should be the one purple exception'],
    },
    {
      name: 'Emotional Expression',
      score: 4,
      weight: 0.15,
      feedback: 'Single red eye communicates danger, but the rest of the form reads as neutral. Phase transitions do not change sprite geometry — only tint.',
      examples: ['Target: Phase 3 LYSO should look DESTROYED — membrane mostly gone, 3 cracked eyes, acid everywhere'],
    },
  ],
  overallVerdict: 'needs-work',
  nextActions: [
    'Increase total canvas footprint: push outer membrane to use 60% of canvas width.',
    'Add membrane ridges: alternating bright/dark rows on the sphere exterior (top-lit).',
    'Phase geometry: Phase 2 must show dark diagonal crack rects. Phase 3 must show missing membrane sections.',
    'Acid pool at base: 3-pixel-wide spread of green pixels beneath the body.',
    'Target score post-Sprint-1: 80+. Current: 45.',
  ],
};

/** Critique: Player sprite (current state, pre-Sprint-3 redesign) */
export const CRITIQUE_PLAYER_CURRENT: AssetCritique = {
  assetId: 'sprite-global-player-v2',
  assetType: 'sprite',
  currentScore: 55,
  iteration: 2,
  benchmarkGame: 'Undertale',
  dimensions: [
    {
      name: 'Silhouette Clarity',
      score: 3,
      weight: 0.20,
      feedback: 'Generic humanoid rectangle. At blur: indistinguishable from any RPG Maker character. No distinctive hair silhouette.',
      examples: ['Undertale Frisk: pigtails create an instantly distinctive top-silhouette', 'Celeste Madeline: hair streak and backpack differentiate at 25% scale'],
    },
    {
      name: 'Color Count',
      score: 8,
      weight: 0.15,
      feedback: 'Dynamic color system (skinColor, clothColor, hairColor from avatar store) is elegant and stays within budget.',
      examples: ['This is actually better than most RPG player characters — the dynamic palette system is a genuine feature'],
    },
    {
      name: 'Anatomy Accuracy',
      score: 6,
      weight: 0.15,
      feedback: 'Proportions are acceptable for the style. Head-to-body ratio could be pushed further toward anime/Undertale exaggeration (larger head, smaller limbs).',
      examples: ['Undertale: head is 30% of total sprite height', 'Pokemon player: head is 40% of total sprite height'],
    },
    {
      name: 'Animation Readiness',
      score: 4,
      weight: 0.15,
      feedback: 'Current 2-frame walk (head-bob only) is the minimum possible. Neutral pose does not have clear limb separation for animation.',
      examples: ['Walk cycle needs: left-foot-forward, neutral, right-foot-forward, neutral — 4 distinct frames'],
    },
    {
      name: 'Style Consistency',
      score: 7,
      weight: 0.20,
      feedback: 'Dark palette, small scale, pixel-art conventions are all correct. Style is consistent with the world.',
      examples: ['Player reads correctly against all 4 realm backgrounds — the dark base palette is strong'],
    },
    {
      name: 'Emotional Expression',
      score: 4,
      weight: 0.15,
      feedback: 'No expressivity in current sprite. Player reads as "generic protagonist" with no distinguishing mood.',
      examples: ['Even Frisk\'s neutral expression (no visible mouth) communicates a personality — a blank mystery'],
    },
  ],
  overallVerdict: 'needs-work',
  nextActions: [
    'Redesign walk cycle to 4 frames: frame 0 neutral, frame 1 left-foot-forward + right-arm-forward, frame 2 neutral, frame 3 right-foot-forward + left-arm-forward.',
    'Add distinctive hair silhouette — not just a flat bar, but a cap shape with volume.',
    'Back-of-head sprite: "up" direction should show actual back-of-head design, not just hair color.',
    'Target score post-Sprint-3: 75+. Current: 55.',
  ],
};

/** Critique: Cytoplasm realm background (current state) */
export const CRITIQUE_CYTOPLASM_BG_CURRENT: AssetCritique = {
  assetId: 'bg-r1-cytoplasm-v1',
  assetType: 'background',
  currentScore: 75,
  iteration: 1,
  benchmarkGame: 'Undertale',
  dimensions: [
    {
      name: 'Atmospheric Depth',
      score: 7,
      weight: 0.25,
      feedback: 'Layered organelles at different scales create depth. Nucleus glow in distance is strong. Issue: radial gradients break pixel-art aesthetic.',
      examples: ['Target: replace all ctx.createRadialGradient() calls with fillRect-based approximations'],
    },
    {
      name: 'Palette Adherence',
      score: 8,
      weight: 0.20,
      feedback: 'Teal (#00ffcc) accent and dark (#050d10) base are consistent throughout. Organelle colors are biologically inspired and within the Realm 1 family.',
      examples: ['Mitochondria warm orange is the exception — but it is biologically accurate and approved'],
    },
    {
      name: 'Realm Identity',
      score: 9,
      weight: 0.20,
      feedback: 'Background immediately reads as "inside a cell." Mitochondria, ribosomes, ER membrane, and nucleus glow are all present and recognizable.',
      examples: ['This background passes Visual Benchmark Test #1 (stranger says "cell biology")'],
    },
    {
      name: 'Readability at Game Scale',
      score: 7,
      weight: 0.20,
      feedback: 'Organelle opacity is too low — they fade into the background and compete poorly with gameplay elements. Increase opacity from 0.15 to 0.30.',
      examples: ['Screenshot at actual game scale: organelles are visible but weak'],
    },
    {
      name: 'Animation Polish',
      score: 8,
      weight: 0.15,
      feedback: 'Animated organelles drifting subtly is the right approach. ER membrane wave lines are excellent. This is the most technically impressive background in the game.',
      examples: ['The ER membrane wave is the best ambient animation in all 4 realms'],
    },
  ],
  overallVerdict: 'good',
  nextActions: [
    'Replace radial gradients with fillRect approximations (concentric rect rings for glow effects).',
    'Increase organelle opacity from 0.15 → 0.30 so they are more visible against gameplay.',
    'Current score 75/100 is good. Target: 85+ after gradient removal.',
  ],
};

/** Critique: Genome Forest DNA helix tile (current state) */
export const CRITIQUE_DNA_HELIX_TILE: AssetCritique = {
  assetId: 'tile-r2-dna-helix-v1',
  assetType: 'tileset',
  currentScore: 82,
  iteration: 1,
  benchmarkGame: 'Undertale',
  dimensions: [
    {
      name: 'Silhouette Clarity',
      score: 9,
      weight: 0.20,
      feedback: 'DNA double helix is readable at 50% scale. The zigzag backbone with colored base pairs is the most scientifically accurate tile in the game.',
      examples: ['This tile passes Visual Benchmark Test #4 (player sees DNA helix immediately)'],
    },
    {
      name: 'Color Count',
      score: 8,
      weight: 0.15,
      feedback: 'AT/GC color pairs (red/blue, green/yellow) use 6 colors total with backbone and gap. Within budget.',
      examples: ['4 base-pair colors + 2 backbone colors = 6 total — efficient and biologically meaningful'],
    },
    {
      name: 'Anatomy Accuracy',
      score: 9,
      weight: 0.15,
      feedback: 'Zigzag backbone correctly approximates the helical path. Base pair crossing at center is biologically accurate (base pairs bridge the two strands).',
      examples: ['Real DNA: base pairs (AT, GC) connect the two sugar-phosphate backbones — tile does this correctly'],
    },
    {
      name: 'Animation Readiness',
      score: 6,
      weight: 0.15,
      feedback: 'Currently static. Should animate to suggest helix rotation — lX/rX offset by animFrame.',
      examples: ['Target: EANIM-002 adds rotation illusion via array offset'],
    },
    {
      name: 'Style Consistency',
      score: 8,
      weight: 0.20,
      feedback: 'Dark background, colored accent base pairs — consistent with Realm 2 palette and BitBio aesthetic.',
      examples: ['Green (#00ff88) backbone accent correctly uses the Realm 2 accent color'],
    },
    {
      name: 'Emotional Expression',
      score: 7,
      weight: 0.15,
      feedback: 'The helix communicates wonder and biological precision. The color-coding of base pairs adds an educational layer without being pedantic.',
      examples: ['This tile is the best science-art integration in the entire game'],
    },
  ],
  overallVerdict: 'good',
  nextActions: [
    'Add EANIM-002 rotation animation to take this from good (82) to excellent (90+).',
    'Document as a positive example in DESIGN-RULES.md — color-coded base pairs are the model for all future science-art tiles.',
  ],
};

/** Critique: OVERFIT boss sprite (current state) */
export const CRITIQUE_OVERFIT_CURRENT: AssetCritique = {
  assetId: 'boss-r3-overfit-v1',
  assetType: 'boss',
  currentScore: 50,
  iteration: 1,
  benchmarkGame: 'OMORI',
  dimensions: [
    {
      name: 'Silhouette Clarity',
      score: 5,
      weight: 0.20,
      feedback: 'Skull shape is identifiable but too small. At game scale, the neural network detail is invisible. The skull should dominate the canvas.',
      examples: ['Target: skull uses top 60% of the 240×180 game-pixel canvas'],
    },
    {
      name: 'Color Count',
      score: 8,
      weight: 0.15,
      feedback: 'Purple and cyan dual-eye system is a brilliant color metaphor. Within the 10-color budget.',
      examples: ['Purple = overfitted (obsessive), Cyan = validation (failing) — strongest color storytelling in the game'],
    },
    {
      name: 'Anatomy Accuracy',
      score: 6,
      weight: 0.15,
      feedback: 'Skull proportions are recognizable but the jaw is too narrow. A 32px-wide jaw at SCALE=3 would read much stronger.',
      examples: ['Human skull jaw width ≈ 80% of cranium width — current OVERFIT jaw is ≈ 60%'],
    },
    {
      name: 'Animation Readiness',
      score: 6,
      weight: 0.15,
      feedback: 'Mouth binary code flashing and node pulsing are correct approaches. Need more nodes (8 from current 4) to read as a neural network.',
      examples: ['Target: 8 neural connection nodes in a visible network topology on the skull exterior'],
    },
    {
      name: 'Style Consistency',
      score: 7,
      weight: 0.20,
      feedback: 'Dark skull with neon circuit lines matches the Neural Nebula realm. The indigo/purple palette is appropriate.',
      examples: ['Neural Nebula accent (#cc44ff) correctly used for neural nodes'],
    },
    {
      name: 'Emotional Expression',
      score: 4,
      weight: 0.15,
      feedback: 'The dual eye concept (overfitted vs. validation) is the best conceptual boss design. But execution does not yet sell the "obsession" emotion.',
      examples: ['Target: Phase 3 — purple eye engorged to 8x6px, cyan eye gone. The OBSESSION made visible.'],
    },
  ],
  overallVerdict: 'needs-work',
  nextActions: [
    'Scale up skull to use 60% of canvas width.',
    'Increase node count from 4 to 8, draw thin 1px connecting lines between them.',
    'Phase 3: purple eye should be HUGE (8x6 game pixels), filling the entire left socket.',
    'Render "ERROR" as pixel text in the cyan socket at Phase 3.',
    'Target score post-BSS-002: 80+. Current: 50.',
  ],
};
