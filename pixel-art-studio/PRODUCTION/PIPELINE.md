# BitBio Production Pipeline — 8-Stage Asset Workflow

Every visual asset produced for BitBio passes through this pipeline. No asset is considered production-ready until it completes Stage 7 (Integration) with a passing QA score. Stage 8 is ongoing.

---

## Pipeline Overview

```
Stage 1: CONCEPT         ← Lore brief + visual brief
Stage 2: SILHOUETTE      ← Design blocked in black
Stage 3: COLOR BLOCK-IN  ← Palette assigned, no detail
Stage 4: DETAIL PASS     ← Final design with all pixel detail
Stage 5: ANIMATION       ← Motion systems added
Stage 6: QA VALIDATION   ← Automated tools + manual review
Stage 7: INTEGRATION     ← Merged into codebase
Stage 8: POLISH LOOP     ← Ongoing improvement
```

---

## Stage 1 — CONCEPT

**Owner:** Art Research Division + Production Division
**Duration:** 1–4 hours per asset

### Inputs
- Lore brief (who/what is this entity, what role does it play in the game?)
- Reference game examples (from KNOWLEDGE_BASE/SPRITE_DESIGN.md)
- Target realm and its palette (from BITBIO_SPECS/REALM_DESIGN.md)
- Technical constraints (size, color count, animation budget)

### Process
1. Write a 2-3 paragraph lore brief answering: What IS this? What does it DO? What does it FEEL like?
2. Extract 3–5 key visual traits that must be readable from silhouette alone
3. Define the color count limit and palette family
4. Define the animation states required
5. Write the visual brief in this format:

```
VISUAL BRIEF: [Asset Name]
==========================
TYPE: npc / boss / player / companion / vfx / tile
SIZE: __ gp wide × __ gp tall
COLOR LIMIT: __ colors
ANIMATION STATES: idle, walk, [...]
SILHOUETTE HOOKS: [2-3 distinctive elements visible as black blob]
PALETTE FAMILY: [warm/cool/teal/gold/etc]
EMOTIONAL TONE: [nervous/confident/threatening/ethereal/etc]
KEY REFERENCE GAME: [which game's style to draw from for this asset]
REALM CONTEXT: [which realm does this appear in]
```

### Outputs
- Completed visual brief document
- Identified reference images from KNOWLEDGE_BASE/
- Acceptance criteria for Stage 6

### Acceptance Criteria
- Visual brief completed and reviewed
- At least 2 distinguishing silhouette elements identified
- Animation state list matches game engine capabilities

---

## Stage 2 — SILHOUETTE

**Owner:** Sprite Division
**Duration:** 30 min – 2 hours per asset

### Inputs
- Visual brief from Stage 1
- KNOWLEDGE_BASE/SPRITE_DESIGN.md (silhouette theory section)

### Process
1. Draw the sprite entirely in flat black — no colors, no detail
2. Check against the silhouette rule: fill solid black, can you identify who/what this is?
3. Variant: Draw 3 different silhouette options (different poses, different silhouette shapes)
4. Select the most readable option
5. For Canvas API (BitBio's method): implement this as a fillStyle='#000000' version of the drawCharacterName function, testing readability

### Canvas Test Pattern
```typescript
// Stage 2 test: draw sprite as solid silhouette
function testSilhouette(ctx: CanvasRenderingContext2D, sx: number, sy: number) {
  // Override all fillStyle calls to black
  const originalFill = ctx.fillStyle;
  ctx.fillStyle = '#000000';
  // Draw the sprite...
  ctx.fillStyle = originalFill;
}
```

### Outputs
- Silhouette design locked (canvas function skeleton with geometry but no color logic)
- Peer review: 3 team members can identify the sprite from silhouette alone → PASS

### Acceptance Criteria
- Readable as solid black at 1× game pixel size (32px wide on screen)
- At least 2 protruding or distinctive shape elements visible
- No confusion with other sprites in the game's roster

---

## Stage 3 — COLOR BLOCK-IN

**Owner:** Sprite Division + Art Research Division
**Duration:** 1–3 hours per asset

### Inputs
- Locked silhouette from Stage 2
- COLOR_THEORY.md (value ramp construction, hue shifting)
- Realm palette from BITBIO_SPECS/REALM_DESIGN.md (for environmental assets)
- palette_analyzer.ts (for validation)

### Process
1. Assign a primary color to each distinct surface area of the sprite
2. Build the value ramp for each primary color (5-step minimum):
   - Deep shadow → shadow → mid-tone → highlight → bright highlight
3. Apply hue shifting to shadow ramp (shift cool by 15–25°)
4. No fine detail yet — just solid color regions
5. Run palette_analyzer.ts on the assembled palette
6. Iterate until palette score ≥ 75

### Color Block-In Template
```
Surface: [face/coat/hair/etc]
Mid-tone: #______
Shadow:   #______ (HSB: shift H -20°, S +10%, B -25%)
Highlight:#______ (HSB: shift H +10°, S -10%, B +20%)
Deep Shad:#______ (HSB: shift H -40°, S +15%, B -50%)
Bright Hi:#______ (only at specular, 1-2 pixels max)
```

### Outputs
- Full palette defined (hex list, named per surface)
- palette_analyzer.ts report — must score ≥ 75
- Color block-in implemented in sprite draw function (solid regions, no pixel-level detail)

### Acceptance Criteria
- palette_analyzer.ts score ≥ 75
- Hue-shifted shadows confirmed (not flat gray darkening)
- Color count within limit from visual brief
- Warm/cool contrast present in palette

---

## Stage 4 — DETAIL PASS

**Owner:** Sprite Division
**Duration:** 2–8 hours per asset

### Inputs
- Color block-in from Stage 3
- SPRITE_DESIGN.md (outline techniques, anti-aliasing, dithering)
- CHARACTER_DESIGN.md (character-specific design specs)
- REALM_DESIGN.md (for environment tiles)

### Process
1. Add outline: 1-pixel dark (not pure black) border around all outer edges
2. Add interior detail: shadow and highlight pixels at surface boundaries
3. Add character-specific features (glasses for Elliot, coffee cup for Alex, etc.)
4. Add any dithering on surfaces that need texture (mitochondria interior, boss carapace)
5. Add secondary elements (props, clothing detail, hair texture)
6. Perform the scale check: view at 1×, 2×, 4× — readable at all three?
7. Perform the color check: no pure #000000 outlines, no two adjacent colors < 15 RGB distance

### Detail Priority Order
1. Face and eyes (highest priority — all emotional reading lives here)
2. Primary identifying feature (Elliot's glasses, Ben's sandwich, Alex's coffee, Henry's circuits)
3. Body silhouette refinement (clothing detail, anatomy)
4. Secondary features (hair texture, prop detail, accessories)
5. Shadow and highlight pixels

### Acceptance Criteria
- Outline present and consistent (1px, non-pure-black)
- Character features visible and readable at 1× zoom
- Face has at least 3 identifiable emotion states designed in
- No pure `#000000` colors (or documented exception for stylistic choice)
- Scale test passed (readable at 1×, 2×, 4×)

---

## Stage 5 — ANIMATION

**Owner:** Animation Division
**Duration:** 2–12 hours per asset (varies by complexity)

### Inputs
- Finalized static sprite from Stage 4
- ANIMATION.md (12 principles, frame timing tables, walk cycles)
- animation_scorer.ts (for validation)
- Global `frame` counter convention (BitBio uses single tick counter)

### Process
1. Implement idle animation first (lowest risk, always needed)
2. Add walk cycle if required by animation state list
3. Add special animations (attack, celebrate, hurt) in priority order
4. Add VFX and secondary motion
5. Run animation_scorer.ts on each completed animation
6. Each animation must score ≥ 75 before proceeding

### Implementation Pattern
```typescript
// Standard BitBio animation function:
function drawCharacterName(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  direction: 'n' | 's' | 'e' | 'w',
  walkFrame: number,    // 0–7 for 8-frame walk cycle
  frame: number         // global tick counter
): void {
  // Derive all animation values from frame counter:
  const idleBob   = Math.sin(frame * 0.08) * 1;
  const isBlink   = (frame % 90) < 4;
  const tailAngle = Math.sin(frame * 0.1) * 3;
  // ...draw calls...
}
```

### Walk Cycle Implementation (8-frame standard)
```
Frame 0: Right foot contact
Frame 1: Right foot down (weight bearing)
Frame 2: Passing (feet together)
Frame 3: Left foot high
Frame 4: Left foot contact
Frame 5: Left foot down
Frame 6: Passing
Frame 7: Right foot high
```

### Acceptance Criteria
- All required animation states implemented
- Each animation scored ≥ 75 via animation_scorer.ts
- Idle animation loops seamlessly
- Walk cycle: feet don't slide on ground (consistent step timing)
- No anatomy drift across frames

---

## Stage 6 — QA VALIDATION

**Owner:** QA Division
**Duration:** 1–2 hours per asset

### Inputs
- Fully animated sprite from Stage 5
- All validator tools (sprite_validator.ts, palette_analyzer.ts, animation_scorer.ts)
- QA Checklist from PRODUCTION/STUDIO_ORG.md

### Process
1. Run sprite_validator.ts — must score ≥ 75
2. Run palette_analyzer.ts — must score ≥ 75
3. Run animation_scorer.ts on each animation — must all score ≥ 75
4. Manual checklist review:
   - Black-blob silhouette test
   - Scale test (1×, 2×, 4×)
   - Emotion state variety check
   - In-game context test (does sprite read against its realm background?)
5. Peer review: at least 1 other person confirms sprite meets quality bar

### Failure Handling
- Any tool score < 75: BLOCK — must return to appropriate stage
- Silhouette test fail: Return to Stage 2/4
- Color score < 75: Return to Stage 3
- Animation score < 75: Return to Stage 5

### Outputs
- QA report documenting all 3 tool scores
- Manual checklist completion record
- PASS or FAIL decision with specific blockers noted

### Acceptance Criteria
- sprite_validator.ts: ≥ 75
- palette_analyzer.ts: ≥ 75
- animation_scorer.ts (each animation): ≥ 75
- All manual checklist items passed
- Peer review sign-off

---

## Stage 7 — INTEGRATION

**Owner:** Production Division + relevant division
**Duration:** 30 min – 2 hours per asset

### Inputs
- QA-approved sprite from Stage 6
- Current codebase (PixelWorldEngine.tsx, worldMaps.ts, etc.)
- Integration spec (where does this asset appear in the game?)

### Process
1. Add sprite draw function to correct file (PixelWorldEngine.tsx for characters)
2. Wire into render loop at correct z-order
3. Wire into world map (update ASCII map with correct tile character if new NPC)
4. Test in all 4 realms and relevant contexts
5. Build (`npm run build`) — must succeed with 0 TypeScript errors
6. Visual smoke test in browser — check rendering at actual screen scale

### Integration Checklist
- [ ] Draw function added with correct signature
- [ ] Wired into render loop at correct z-order
- [ ] World map updated if applicable
- [ ] TypeScript build: 0 errors
- [ ] Browser visual check: no artifacts, correct scale
- [ ] Performance: no dropped frames after integration

### Outputs
- Code committed to codebase
- Build log confirming 0 errors
- Screenshot documenting final in-game appearance

---

## Stage 8 — POLISH LOOP (Continuous)

**Owner:** All Divisions (everyone contributes)
**Duration:** Ongoing — no end date

### The Perfection Loop
Every shipped asset has a "polish score" that's tracked across sprints. The goal is continuous improvement:

```
Review ← Is there room for improvement?
   ↓
Score ← Run validators, get current baseline
   ↓
Compare ← Against benchmark reference game sprites
   ↓
Identify ← What specific 3 things could improve?
   ↓
Improve ← Implement the top improvement
   ↓
Validate ← Run validators again, score ≥ previous?
   ↓
Repeat ← Until improvement is negligible (< 2 points per cycle)
```

### Polish Priority Queue (ranked)
1. **Boss sprites** — most player-facing, highest dramatic impact
2. **Realm tile variants** — environmental richness, many pixels on screen simultaneously
3. **Henry's holographic effects** — technically complex, high wow-factor
4. **Enzyme animations** — player sees Enzyme constantly, small improvements compound
5. **Player sprite** — fully customizable, must look good in all configurations
6. **NPC dialogue portraits** — player stares at these during learning

### Stop Conditions
Polish is "done enough" when:
- Three consecutive polish cycles improve the tool score by < 2 points
- A sprint review confirms no player feedback identifying the asset as weak
- The asset matches or exceeds the equivalent element in the nearest reference game

### Never-Ship Conditions
An asset NEVER ships if:
- Any validator score < 60 (hard floor — 75 to ship, 60 to even be in build)
- Black-blob silhouette test fails (not identifiable)
- Build fails due to TypeScript errors in the sprite function
- Visible pixel artifacts at standard SCALE=3 rendering
