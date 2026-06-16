# BITBIO PIXEL ART STUDIO CHARTER
**The operating law. Read before touching any asset.**

---

## ART DIRECTION PRINCIPLES FOR BITBIO

### 1. Dark is not depressing. Dark is immersive.
BitBio takes place inside a living body, in alien machines, in gothic cathedrals of protein.
These are not cheerful places. They are wondrous, dangerous, and strange. Every environment
must feel like somewhere you are not supposed to be — which makes the player want to stay.

Dark backgrounds (near-black, #050505 to #1a1a1a) are mandatory for all playfield tiles.
The darkness is what makes the accent colors pop. A neon teal glow on a black background
reads as "bioluminescent biology." That same teal on white reads as "hospital corridor."

### 2. One accent per realm. Not two. Not "sort of one with hints of another."

| Realm | Accent | Hex |
|-------|--------|-----|
| Cytoplasm (1) | Teal/cyan | #00ffcc |
| Genome Forest (2) | Acid green | #00ff44 |
| Neural Nebula (3) | Electric purple | #aa44ff |
| Protein Cathedral (4) | Amber gold | #ffaa00 |

These are the PRIMARY accent colors. Secondary colors (red for danger, white for highlights)
are allowed but must not compete with the accent. If a tile has more than one glowing color,
the accent must be the brightest.

### 3. Science first. Aesthetic second. But science IS aesthetic.
Every asset must be biologically accurate enough that a biology teacher would nod, not wince.
The mitochondria bean shape is real. The DNA base pair colors are the standard AT/GC coding.
The lysosome is purple because lysosomes are pH ~5 and traditionally shown in acidic purple.
This is not decoration — this is the education. When the art is right, the learning happens
automatically.

Do not invent shapes for convenience. If a "mitochondria" looks like a blob with dots, it
teaches nothing. Make it look like a mitochondria.

### 4. Silhouette is the most important thing. Not texture, not color, not detail.
At SCALE=3 on a dark background, a player's eyes spend ~50ms on each tile. The silhouette
is all they register. If the silhouette of a boss is "large oval," the boss has failed. If
the silhouette of a mitochondria tile is "bean with pinched middle," it has succeeded.

Every asset must pass the silhouette test before any detail work is done:
- Render the asset as a solid gray shape on a white background
- If you cannot tell what it is in under 2 seconds, the silhouette is wrong
- Fix the silhouette before adding any colors or detail

### 5. Every character needs ONE immediately readable personality signal.
- Elliot: mismatched socks (red left, yellow right). Visible from across the room.
- Ben: sandwich permanently in hand. Always eating. Always happy.
- Alex: coffee cup. Precise posture. Never spills.
- Henry: semi-transparent. Geometric patterns visible through body.
- LYSO boss: single red eye in center of membrane body. Eye tracks. Menacing.
- VIRON boss: rotating spike tendrils in three orbital paths. Perpetual motion.
- OVERFIT boss: the GLITCHING FACE — twitching numbers in the eye sockets, mouth that
  opens and closes revealing ERROR text.
- AMYLOID TYRANT: the crown of fibril tendrils that constantly grows/shrinks. Everything
  accumulates. Nothing lets go.

If you cannot name the character's personality signal, the design is not done.

---

## THE BITBIO VISUAL BIBLE

### Rules every artist/agent MUST follow

#### RULE 1: The fillRect Contract
Every piece of art is drawn with `ctx.fillRect()` calls only. No paths, no arcs, no beziers
for primary shapes. Arcs are allowed only for circular objects where a pixel approximation
would require 50+ rects. When in doubt, use rects.

The `gr()` and `gr2()` helper functions are the correct way to draw. Use them.
```typescript
gr(ctx, cx, cy, gx, gy, gw, gh, color) // tile-based
gr2(ctx, ox, oy, gx, gy, gw, gh, color) // sprite-based (origin + offset)
```

#### RULE 2: The Palette Constraint
- Tiles: maximum 6 colors (excluding transparent)
- Character sprites: maximum 8 colors (excluding transparent)
- Boss sprites: maximum 10 colors (because bosses are the climax, they earn more)
- UI elements: maximum 4 colors
- Backgrounds/ambient layers: no constraint (they're procedural/gradient)

The `shiftColor(hex, amount)` function is how you create highlights and shadows from a base
color. Amount +20 = highlight. Amount -20 = shadow. Do not invent new colors when a shifted
version of an existing color will do.

#### RULE 3: The Top-Light Rule
All lit objects in BitBio receive light from the top-left. This means:
- Top edge of walls: 2px of brightened color
- Left edge of objects: 1px of brightened color
- Bottom/right edges: 1px of darkened color (shadow)
- This applies to EVERY object with mass: walls, bosses, characters, organelles

The only exception is glow effects (bioluminescent, holographic, magical) which emit their
own light in all directions.

#### RULE 4: Tile Seams
Floor tiles must NOT tile perfectly seamlessly — a small amount of variation prevents the
"wallpaper" effect. The current implementation uses `(tx + ty) % 2 === 0` for checkerboard
variation. Do not remove this. Additional variation is welcome.

Wall tiles must look structural. They should not look like flat panels. The top edge highlight
creates the illusion of brick/material thickness.

#### RULE 5: Animation Discipline
- Tiles animate on the 4-frame global `animFrame` clock (0-3, ticks every 500ms)
- Character walk cycles use the 2-frame `walkFrame` clock (0/1, ticks every 150ms)
- Boss animations use the continuous `t` float (seconds), with `Math.sin(t * speed)` for
  oscillation
- Never read `Date.now()` or `performance.now()` inside a drawing function — the time
  values are passed in as parameters
- Animations must be deterministic given the same `t` or `animFrame` value

#### RULE 6: The Science Constraint
Every tile, boss, and NPC must have a biology or biochemistry basis. The art research team
must validate that:
- The shape is recognizable to someone who has taken a biology class
- The color choices are either scientifically conventional or clearly justified
- The biology is accurate at the level of a high school AP Biology or introductory
  university course

"Close enough" is not acceptable. If the shape is wrong, the player learns the wrong thing.

#### RULE 7: Realm Identity
Each realm must be instantly identifiable from a 100x100 pixel thumbnail. The combination of:
- Floor color
- Accent glow color
- Signature structure tile ('T' tile)
- Characteristic water/void tile ('~' tile)

...must be distinctive. If Realm 1 and Realm 4 floors look the same, both have failed.

#### RULE 8: Boss HP Phase Art
Every boss must have THREE visually distinct states corresponding to HP phases:
- HP 100-67%: "Confident phase" — full detail, threatening posture
- HP 66-33%: "Damaged phase" — cracks/glitches/degradation visible in the sprite itself,
  not just a color tint
- HP 32-0%: "Desperate phase" — structural breakdown, erratic animation, rage visual cues

A color tint change is NOT a phase transition. The geometry or animation pattern must change.

#### RULE 9: Character Face Rules
All character faces must have:
- Two distinct eyes (1x1 to 3x2 game pixels each)
- A mouth (minimum 1x1, can be implied)
- At least one expressive eyebrow or eye shape element
- Eyes must be visually distinct from the background on a 1px silhouette read

At SCALE=3, a 2x2 game-pixel eye is 6x6 canvas pixels — entirely readable. There is no
excuse for invisible facial features.

#### RULE 10: The Understatement Principle
More is not better. Undertale's Ruins tileset has maybe 4 elements per tile. Omori's White
Space has almost nothing and is the most effective environment in either game. The temptation
to add detail must be resisted until the core shape is right.

When you think a tile is "not enough," ask: can the player immediately understand what it is?
If yes, stop. If no, add one element that improves silhouette readability, then stop.

---

## STYLE CONSISTENCY ENFORCEMENT RULES

### Before submitting any art change:

**Checklist — must answer YES to all:**

1. Does this asset use the correct realm accent color?
2. Is the color count within the limit (6/8/10)?
3. Does the silhouette read correctly against a mid-gray background?
4. Are all animations driven by the `t`, `animFrame`, or `walkFrame` parameters passed in?
5. Does the TypeScript compile without errors (`tsc --noEmit`)?
6. Does the asset score >= 8.0 on QUALITY-RUBRIC.json?
7. Have you run the style-checker tool and addressed all warnings?
8. Is the biology/biochemistry accurate or clearly justified?
9. Does the asset look clearly different from corresponding assets in other realms?
10. Is the top-light convention applied consistently?

### After submitting:

- Score must be recorded in the asset's QA audit document
- Git commit message must include the asset ID and score delta
  Example: `[SPR-001] Redesign LYSO boss sprite. Score: 4.5 → 8.2`
- If score < 8.0, create an improvement ticket immediately — do not defer

---

## DECISION FRAMEWORK

### When uncertain about art direction:

**Step 1: Ask "What would Undertale do?"**
Toby Fox's approach: establish the strongest possible dark tone, then use a single accent to
create emotional contrast. When in doubt, make it darker and more minimal.

**Step 2: Ask "What does the biology demand?"**
If the organism or structure has a well-known appearance, honor that first. If it's abstract
(Neural Nebula is a neural network, not a physical place), establish a consistent visual
metaphor and stick to it.

**Step 3: Ask "Does the silhouette communicate?"**
Render the shape in solid gray. If someone walking past a screen can name it in 3 seconds,
it passes. If not, the core design must change.

**Step 4: Consult QUALITY-RUBRIC.json**
Score it. If any individual criterion scores below 6/10, that criterion is blocking. Fix it
before moving on to other criteria.

**Step 5: Compare to `referencesGames` in the backlog task**
Every backlog task lists the reference games and specific assets to study. Those references
are the benchmark. The work should not look like a copy — but it should be in the same
quality tier.

---

## QUALITY BAR: WHAT "GOOD" LOOKS LIKE vs WHAT SHIPS

### What ships (minimum bar): SCORE 7.0 / 10

An asset at 7.0:
- Has a correct silhouette (reads immediately)
- Uses correct colors for its realm
- Passes TypeScript compilation
- Has at least one animation frame if animated
- The biology is accurate
- A player would not stop playing because of this asset

### What we target: SCORE 8.5 / 10

An asset at 8.5:
- Has a distinctive, memorable silhouette
- Has correct lighting direction (top-left)
- Has 2+ animation frames if it moves at all
- Has a visual personality signal beyond just "the science"
- A player might stop and look at this asset for a moment because it's interesting
- A biology teacher would use a screenshot of this as a teaching aid

### What is great: SCORE 9.5 / 10

An asset at 9.5:
- Is quoted by players in feedback ("I loved the DNA tile")
- Communicates biology, realm identity, and emotional tone simultaneously
- The animation is the difference between "game" and "world"
- Other artists want to study how it was done
- This is the target for boss sprites, player character, and the first thing players see
  in each realm

### What does NOT ship regardless of score:

- Art that depicts biologically inaccurate science in a misleading way
- Art that is visually indistinguishable from another realm's equivalent
- Art that drops frame rate below 60fps
- Art that introduces TypeScript errors
- Art that uses colors outside the established realm palette without explicit approval
- Any boss sprite that has only one HP-phase visual state

---

*This charter is a living document. Amendments require Production Division Director approval
and must be communicated to all division agents before the next sprint begins.*

*BitBio Pixel Art Studio | Production Division*
