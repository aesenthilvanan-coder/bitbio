# BitBio Asset Production Pipeline
**Tooling Division | Standard Operating Procedure for All Art Assets**

---

## Pipeline Overview

Every new pixel art asset goes through this pipeline before being committed to the game. No exceptions.

```
Concept → Design Brief → Reference → Draft → Self-Critique → Auto-Validate → QA Score → Decision → Integrate → Regression Test
```

---

## Stage 1: Concept

**Who:** Any division
**Output:** Slack/GitHub issue with concept description
**Format:**
```
Asset: [name]
Type: sprite | tile | UI | animation
Realm: 1-4 | global
Purpose: [what gameplay role does it serve?]
Reference games: [Undertale, OMORI, etc.]
Priority: P0 | P1 | P2 | P3
```

**Rules:**
- Every asset needs a gameplay justification. "Looks cool" is not a justification.
- Reference games must be listed — every asset starts with research, not imagination.

---

## Stage 2: Design Brief

**Who:** Art Research Division reviews concept
**Output:** Design brief added to concept issue
**Must answer:**
1. What palette does this use? (cite BITBIO-PALETTE.json exact hex values)
2. What size? (game pixels, must fit standard sizes: 8x8, 16x16, 16x24, etc.)
3. What is the silhouette shape? (describe in words)
4. What reference game asset is closest to this? (find a real example to learn from)
5. What's the animation plan? (static | 2-frame | 4-frame | more, with frame rate)

---

## Stage 3: Draft (fillRect Code)

**Who:** Sprite Division | Environment Division | Animation Division
**Output:** TypeScript `TileData[]` array or `gr()` call sequence
**Rules:**
- Use ONLY `gr(ctx, cx, cy, gx, gy, gw, gh, color)` for world assets
- Use ONLY colors from the realm's palette in BITBIO-PALETTE.json
- Code should be readable — each block should have a comment identifying what it draws
- Use `animFrame % N` for animation — never `Date.now()` directly in draw functions

**Template:**
```typescript
function drawMyAsset(ctx, cx, cy, animFrame, t) {
  const W = 16; // tile size in game pixels
  const fl = '#050d10'; // realm 1 floor
  const acc = '#00ffcc'; // realm 1 accent
  
  // Base
  gr(ctx, cx, cy, 0, 0, W, W, fl);
  
  // [describe what this block draws]
  gr(ctx, cx, cy, 3, 3, 10, 10, acc);
  
  // Highlight (top-left, top light source)
  gr(ctx, cx, cy, 0, 0, W, 1, shiftColor(fl, 55));
}
```

---

## Stage 4: Self-Critique

**Who:** The developer who wrote the draft
**Checklist (complete before moving to Stage 5):**

- [ ] Silhouette: Can I identify this sprite with eyes half-closed at arm's length?
- [ ] Color count: Is it ≤ 8 colors? (count unique hexes in code)
- [ ] Hue shift: Do shadows shift toward blue-purple? Do highlights shift warm?
- [ ] Contrast: Does this asset read against the realm floor color?
- [ ] Light source: Is top-left light source consistent? (top edge and left edge brighter)
- [ ] Animation: If animated, does each frame pass the silhouette test?
- [ ] Palette: Are ALL colors from the realm palette? Check against BITBIO-PALETTE.json.

If any item fails: fix it before proceeding.

---

## Stage 5: Automated Validation

Run the BitBio toolset:

```bash
# Palette compliance
npx ts-node pixel-art-studio/tools/index.ts validate-sprite <realm> "#hex1,#hex2,..."

# For animated assets
# Construct Sprite objects and run:
# import { scoreWalkCycle } from './pixel-art-studio/tools/animation-scorer'
# const report = scoreWalkCycle(frames)
# console.log(report.overall, report.issues)
```

**Pass threshold for automated tools:**
- `validateRealmAsset()`: paletteCompliance > 80%
- `scoreWalkCycle()`: overall > 65
- `checkConsistency()`: score > 70

If any tool fails: fix issues and re-run. Do not proceed with failing validation.

---

## Stage 6: QA Scoring

**Who:** QA Division
**Tool:** QUALITY-RUBRIC.json
**Process:**
1. Open rubric: `pixel-art-studio/departments/qa-division/QUALITY-RUBRIC.json`
2. Score each of the 6 categories (silhouette, color harmony, realm consistency, game-scale readability, animation, style consistency)
3. Apply formula: sum(category_score * weight)
4. Check blocking minimums (silhouette ≥ 5.0, readability ≥ 5.0)
5. Apply decision tree

**Record score in commit message:** `[QA: 7.8/10]`

---

## Stage 7: Decision

| Score | Action |
|-------|--------|
| < 5.0 | **REJECT** — Return to Stage 3. Document what failed and why. |
| 5.0 – 7.0 | **REVISE** — Create backlog issue before shipping. Can ship to unblock. |
| 7.0 – 8.5 | **SHIP** — Meets standard. Commit with score in message. |
| > 8.5 | **FEATURE** — This sets the bar. Add to DESIGN-RULES.md as positive example. |
| Blocking minimum fail | **CRITICAL BLOCK** — Cannot ship regardless of overall score. |

---

## Stage 8: Integration

**Who:** Production Division
**Process:**
1. Add `gr()` calls to the appropriate function in `PixelWorldEngine.tsx` or `IntroEngine.tsx`
2. Run `npx tsc --noEmit` — no TypeScript errors allowed
3. Run dev server: `npm run dev`
4. Visually inspect in browser at game scale (not zoomed in on canvas)
5. Check: does the asset look correct in context with surrounding tiles?

---

## Stage 9: Regression Test

After any asset integration, verify these 5 things still work:
1. Player can walk through walkable tiles, not through walls
2. Lesson nodes are visible and triggerable
3. NPC dialogue still works
4. Intro cutscene plays correctly
5. Character creator preview renders correctly

If any regression: revert the commit and debug before re-integrating.

---

## Emergency Fast-Track

For P0 issues blocking gameplay (softlock, black screen, crash):
- Skip Stages 2-5
- Still do Stage 4 self-critique
- Get QA score after shipping
- Create follow-up issue for any score < 7.0

---

## Asset Versioning

Name convention: `[TYPE]-[REALM]-[NAME]-v[N]`
Examples:
- `tile-r1-floor-v2`
- `sprite-global-player-v3`
- `anim-r2-dna-walk-v1`

Store version history in git commits, not separate files.
