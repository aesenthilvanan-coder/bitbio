# BitBio Sprite Creation Pipeline
**BitBio Pixel Art Studio | Production Division**

The canonical 6-stage process for creating a new character sprite for BitBio, from concept to ship. Every character sprite — player, NPC, enemy, boss — passes through all 6 stages before being marked DONE in the relevant department backlog.

---

## Stage 1: Character Design Brief

Complete this template before any pixels are drawn. The brief prevents wasted work and ensures the design has purpose before it has form.

```
Character: [name]
Role: [player / NPC / enemy / boss]
Realm: [1-4 or "all" for cross-realm characters]
Color palette: [primary, secondary, accent, dark, light — 5 colors minimum, 8 maximum]
Personality traits: [3 adjectives — these directly drive design decisions]
Visual metaphor: [what does their design communicate at a glance?]
Key silhouette element: [what makes them recognizable at 16x16 solid black?]
Realm affinity color: [which realm accent color appears in their design as a nod?]
Design reference: [1-2 pixel art characters from MASTER-KNOWLEDGE.json this is inspired by]
```

**Example — Henry:**
```
Character: Henry
Role: NPC (holographic ghost scientist)
Realm: All (appears in all 4)
Color palette: Primary #aaccff (ghost blue), Secondary #ffffff (glow), Accent #6688cc (deep blue), Dark #1a2244, Light #ddeeff
Personality traits: Melancholy, wise, faintly warm
Visual metaphor: Information that outlasted the person carrying it
Key silhouette element: Semi-translucent body with visible light bleed at edges
Realm affinity color: Shifts with current realm (teal in Realm 1, purple in Realm 2, gold in Realm 3, crystalline in Realm 4)
Design reference: OMORI ghost aesthetic + Celeste's crystal heart translucency
```

**Checklist:**
- [ ] Brief completed and reviewed by studio lead
- [ ] Palette confirmed against BITBIO-PALETTE.json constraints
- [ ] No duplicate silhouette elements with existing characters
- [ ] Realm affinity color assigned

---

## Stage 2: Silhouette Test

**Goal:** The character must be instantly recognizable as a solid black shape at 16x16.

### Process

1. Define the character's maximum bounding box (in game pixels):
   - Standard NPC: 8-10 wide × 14-18 tall
   - Player: 8 wide × 16 tall
   - Boss: 16-32 wide × 16-32 tall (varies)
   - Enzyme: 12 wide × 10 tall

2. Fill the bounding box as solid black

3. Identify the ONE element that makes this silhouette unique:
   - Enzyme: triangular cat ears at the top
   - Player: rectangular coat bottom (flared below waist)
   - Elliot: tall frame + rectangle glasses protrusion
   - Ben: rounded hoodie bulk (wider shoulder-to-hip ratio)
   - Alex: asymmetric hair bump (higher on the right)
   - Henry: body is visibly lighter than surroundings (inverse silhouette — use grey, not black, for the test)

4. Show the silhouette to someone unfamiliar with the character. Can they identify a distinctive feature?

### Silhouette Failure Conditions

The silhouette FAILS if:
- Two existing characters look similar as black shapes from any of the 4 directions
- The character looks like a default "humanoid rectangle" with no memorable features
- The key differentiating element disappears at 50% scale

**If the silhouette fails:** Return to Stage 1 brief and change the `Key silhouette element`. Do not proceed to Stage 3 with a failed silhouette.

---

## Stage 3: Color Palette (Maximum 8 Colors Per Character)

Using BITBIO-PALETTE.json as the color library, select up to 8 colors for the character. Each color must have a declared purpose.

### Standard 8-Slot Palette Template

```
Slot 1: Primary body color     — the dominant color visible at a glance
Slot 2: Shadow variant         — hue-shifted cool/dark of Slot 1 (see Rule 2, DESIGN-RULES.md)
Slot 3: Highlight              — hue-shifted warm/light of Slot 1
Slot 4: Hair / hat color       — the character's second most visible feature
Slot 5: Clothing color         — primary clothing/coat/jacket
Slot 6: Eye / accent color     — smallest feature, most emotionally significant
Slot 7: Outline color          — always darkest shade in palette, NOT pure black (#0a0a0a preferred)
Slot 8: Secondary accent       — optional; use only if design requires a 2nd distinct accent
```

### Palette Rules

1. **Hue-shift shadows:** Shadow pixels must shift hue toward the complementary color of Slot 1, not simply darken it. A teal character's shadows shift toward purple-blue.

2. **No color isolation:** Every color must appear in at least 4 adjacent pixels. Isolated single-pixel color spots are "pixel noise" and will not survive scaling.

3. **Realm palette check:** Character colors must not clash with the realm they primarily appear in. Run this test: place the color palette next to the target realm's floor/wall palette. Do any colors "vibrate" (high-contrast complementary colors at small sizes)?

4. **Outline color selection:** The outline color is the darkest color in the character's palette, shifted toward the character's dominant hue (not pure #000000). Example: Henry's outline is #1a2244 (dark navy), not black.

### Palette Validation

Before proceeding:
- [ ] Palette has ≤ 8 colors
- [ ] Each color has a declared slot purpose
- [ ] Shadow slots are hue-shifted (not flat-darkened)
- [ ] Palette passes contrast check against target realm palette
- [ ] Outline is not pure #000000

---

## Stage 4: Implementation in PixelWorldEngine.tsx

The character is drawn entirely using the `gr()` helper function. No images, no paths, no CSS — pure `ctx.fillRect` calls.

### The `gr()` Helper

```typescript
// gr: draw a game-space rectangle
// ctx: canvas 2D context
// cx, cy: canvas pixel offset (top-left of character's bounding box)
// gx, gy: game-pixel position within the character's local grid
// gw, gh: width and height in game pixels
// color: hex string
function gr(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  gx: number, gy: number,
  gw: number, gh: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(cx + gx * S, cy + gy * S, gw * S, gh * S);
}
// S = scale factor (currently 3; each game pixel = 3x3 canvas pixels)
```

### Coordinate System

All characters use a **local game-pixel grid** starting at (0,0) at the top-left of their bounding box:
- Head at approximately (0,0) to (w, 4)
- Body from (0, 4) to (w, 10)
- Legs from (0, 10) to (w, 16)
- Arms as overlapping elements at sides

### Implementation Order

Follow this order to build a character in PixelWorldEngine.tsx:

1. **Background layer** (back arm, back leg): draw elements that go behind the main body first
2. **Body** (torso, head): the primary volume
3. **Clothing details** (coat, hoodie): overlaid on the body
4. **Foreground layer** (front arm, front leg): elements that overlap the body
5. **Face** (eyes, expression features): always last, ensures face reads over all other elements
6. **Accessories** (glasses, hair, hats): last layer

### Example — Player head (partial):

```typescript
// Head
gr(ctx, cx, cy, 2, 0, 4, 4, SKIN);        // face area
gr(ctx, cx, cy, 2, 0, 4, 2, HAIR);        // hair top
gr(ctx, cx, cy, 1, 1, 1, 3, OUTLINE);     // left outline
gr(ctx, cx, cy, 6, 1, 1, 3, OUTLINE);     // right outline
gr(ctx, cx, cy, 3, 3, 1, 1, EYE);         // left eye
gr(ctx, cx, cy, 5, 3, 1, 1, EYE);         // right eye
```

### Stage 4 Checklist

- [ ] Character draws at position (0,0) in local grid correctly
- [ ] Layering order is correct (back → body → front → face)
- [ ] Uses only `gr()` calls — no direct `ctx.fillRect` (for consistency)
- [ ] All colors reference named palette constants (no hardcoded hex strings in draw code)
- [ ] TypeScript type is correct — no `any` types in the draw function
- [ ] Function signature: `drawCharacterName(ctx: CanvasRenderingContext2D, cx: number, cy: number, frame?: number): void`

---

## Stage 5: Animation Specification

Every character needs documented animation specs before animation is implemented. The spec is the source of truth.

### Creating the Animation Spec

1. Use `generateAnimationTemplate(character, type)` from `tools/animation-validator.ts` to get a starter template
2. Fill in every frame's `description` and `keyChanges` fields
3. Mark keyframes (`isKeyframe: true`) at major pose points
4. Adjust `durationMs` per frame based on the desired timing (see ANIMATION-ENCYCLOPEDIA.md §1 for easing)

### Frame Description Standards

Frame descriptions must be specific enough for another animator to implement them without asking questions:

**Too vague:** `"Frame 3: Player doing something"`
**Correct:** `"Frame 3 (Passing, right foot): Right foot passes under body center. Left arm at neutral position (beside torso). Body at neutral height (no bob). Right arm mid-swing toward back."`

### Running Validation

```bash
# Generate a template
npx ts-node pixel-art-studio/tools/animation-validator.ts template player idle

# Validate a completed spec
npx ts-node pixel-art-studio/tools/animation-validator.ts validate path/to/spec.json
```

**Minimum acceptable score:** 75/100

If the score is below 75, review the `issues` output and fix all `error`-severity issues before proceeding to Stage 6.

### Stage 5 Checklist

- [ ] AnimationSpec JSON created for each required animation type
- [ ] All frame descriptions are specific and actionable
- [ ] At least 1 keyframe per 6 frames
- [ ] Idle animation includes blink frame (for human/humanoid characters)
- [ ] Attack animations have ≥ 2 anticipation keyframes
- [ ] Walk cycle has even frame count
- [ ] All specs pass animation-validator.ts with score ≥ 75

---

## Stage 6: Integration Checklist

The final stage before a character is marked DONE. All items must be checked before the character ships.

### Rendering

- [ ] Character draws correctly when facing South (toward player perspective)
- [ ] Character draws correctly when facing North (away from player)
- [ ] Character draws correctly when facing East (right)
- [ ] Character draws correctly when facing West (left) — check for mirror artifacts
- [ ] At S=3 scale: no half-pixel rendering artifacts (all game pixels appear as clean 3x3 blocks)
- [ ] Character anchor point is consistent (bottom-center at `(cx + (width/2)*S, cy + height*S)`)

### Animation

- [ ] Idle animation implemented and loops correctly
- [ ] Walk cycle implemented (all 4 directions)
- [ ] Emotional reactions: at least 1 reaction implemented and trigger-tested
- [ ] No animation frame has 0ms duration
- [ ] Walk cycle timing matches studio standard (800ms for 8-frame at 10fps)

### Style

- [ ] Colors match the character's declared palette (no deviation from defined slots)
- [ ] Colors do not clash with the character's primary realm palette
- [ ] Outline weight is 1px game pixel consistently
- [ ] No pure `#000000` used as outline (use character's darkest palette color)

### Code Quality

- [ ] TypeScript compiles with no errors (`tsc --noEmit`)
- [ ] No `any` types in the character's draw function
- [ ] Function is exported and added to the barrel file (`tools/index.ts`) if it's a tool
- [ ] Character draw function is added to the NPC/character registry in PixelWorldEngine.tsx

### QA

- [ ] Passes `sprite-validator.ts` checks (score ≥ 7.0/10)
- [ ] Passes `animation-validator.ts` checks for all animations (score ≥ 75/100)
- [ ] Manual playtest: character looks correct in all rooms it appears in
- [ ] Manual playtest: no flickering, jitter, or layer-order bugs during walk cycle

### Documentation

- [ ] Character's animation spec files committed to `knowledge-base/animations/`
- [ ] Animation division BACKLOG.md updated (task moved to done or checked)
- [ ] Character palette added to GAME-PALETTES.json (under `bitbio.characters`)
- [ ] ANIMATION-ENCYCLOPEDIA.md §6 updated with any spec changes made during implementation

---

## Quick Reference — Common Mistakes

| Mistake | Fix |
|---------|-----|
| Character "swims" during walk | Check that every limb pixel is adjacent to body in every frame |
| Outline looks too thick | At S=3, a 2-game-pixel outline = 6 canvas pixels — use 1px only |
| Colors look muddy | Check that shadows are hue-shifted, not flat-darkened (DESIGN-RULES.md Rule 2) |
| Animation feels jerky | Increase frame hold duration; consider adding in-between frames |
| Animation feels sluggish | Reduce frame hold duration; consider reducing frame count |
| Character disappears on realm floor | Floor is too bright; character outline too similar to floor color |
| Walk cycle "moonwalks" | Frame order is wrong — ensure contact/down/passing/up sequence |
| TypeScript error in draw function | Verify all `gr()` calls have 7 arguments in correct order |
| Henry looks opaque | Forgot to set `ctx.globalAlpha = 0.65` before Henry draw calls |
| Enzyme detaches from player head during walk | Player walk vertical bob not factored into Enzyme anchor calculation |

---

*Pipeline Version 1.0 | BitBio Production Division | 2026*
*Cross-reference: ANIMATION-ENCYCLOPEDIA.md | tools/animation-validator.ts | tools/sprite-validator.ts | DESIGN-RULES.md*
