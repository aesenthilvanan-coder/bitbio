# Sprite Design — Pixel Art Knowledge Base

## Reference Games Studied
Undertale · Deltarune · OMORI · Pokémon B/W · Chrono Trigger · Earthbound · Mother 3 ·
Stardew Valley · Celeste · Hyper Light Drifter · Eastward · CrossCode · Sea of Stars ·
Terraria · Final Fantasy VI · Golden Sun · Fire Emblem GBA · Castlevania AoS · Metroid Fusion

---

## 1. Silhouette Theory

### The First Principle of Sprite Readability
A sprite must be immediately recognizable from its silhouette alone. Fill it 100% black and it should still communicate what it is. If you can't identify the character from a black blob, the design has failed at the foundational level.

**Why this matters:** At 32×32 pixels — which is BitBio's sprite box — you have almost no room for detail to carry the read. The silhouette carries 70% of the recognition load. Detail is the remaining 30%.

### Silhouette at Multiple Zoom Levels
- **1× (native pixel size):** Character should read as a distinct creature/person shape
- **2× (doubled):** Individual features become visible; anatomy must be plausible
- **4× (4x zoom):** Individual pixels visible; intentional dithering and outlines must look clean

**Test:** Squint your eyes at the sprite. If it collapses into an unreadable blob, the silhouette is too complex or too uniform.

### Distinctive Silhouette Strategies

**Head-body contrast:** Most RPG characters have an oversized head (40-50% of total sprite height) that sticks out clearly from the body silhouette. This is why Undertale's characters read at 16px height and Pokémon trainers read at 32px height.

**Protruding elements:** Hair spikes, horns, tails, large weapons, or unusual poses create "hooks" that jut out of the silhouette and make characters instantly distinguishable from each other. Geno (SMRPG) has the hat. Sans has the jacket. Terra (FF6) has the hair.

**Void space:** The negative space INSIDE a silhouette matters as much as the shape itself. A character with legs apart has readable negative space between them. A character with legs together collapses into a rectangle.

### BitBio Application
- **Elliot:** Large round head with hair poofs jutting upward and left. Lab coat creates wide shoulders that taper to lab coat hem.
- **Ben:** Blocky rectangular body (hoodie). Hand holding sandwich protrudes right. Distinctive silhouette from sandwich alone.
- **Alex:** Tall and narrow. Angular hair swept back. Coffee cup breaks the right silhouette.
- **Henry:** Orbs orbiting him permanently alter his silhouette into something inhuman. No other character has floating elements.
- **Enzyme:** Oversized round head (50% of total height), prominent upright tail. Cat reads immediately.

---

## 2. Visual Hierarchy in Tiny Sprites

At 32×32 pixels, you cannot show everything with equal emphasis. You must rank every element:

### Hierarchy Levels
1. **Primary read (silhouette + dominant color):** What is this? Human? Monster?
2. **Secondary read (largest single feature):** What's distinctive about this specific character?
3. **Tertiary read (smaller supporting detail):** What communicates personality/story?

### Color as Hierarchy Tool
The dominant color in a sprite should be the most thematically important one. Elliot's lab coat (white/light gray) covers the most pixels and immediately reads "scientist." His cyan glasses are secondary — small but high-contrast, personality marker.

**Rule:** No more than 1-2 colors should compete for "most area." The eye will look at the largest color mass first.

### Contrast as Hierarchy Tool
High contrast (dark against light, saturated against desaturated) pulls the eye first. Eyes on a sprite face should be the highest contrast element on the face — this is why cartoon eyes are always dark pupils against white/light sclera.

**Reference:** Undertale Frisk has a neutral face except for the eyes, which are closed but clearly defined dark arcs against skin tone. Even the closed eyes are the visual anchor point.

### Face Priority
Almost every RPG sprite prioritizes the face even when it's only 4-6 pixels tall. The face is where the player looks first because that's evolutionary instinct. Never sacrifice face readability for costume detail.

---

## 3. Anatomy Simplification Rules

### The 4-Head-Height Rule for Chibi Characters
In classic JRPG chibi proportion (Chrono Trigger, Final Fantasy 5/6, Earthbound), the character height is approximately 4× the head height. Head = massive, legs = short and stubby.

BitBio uses approximately 3-head proportion:
- Head: ~10-12 game pixels tall
- Torso: ~12-14 game pixels tall  
- Legs: ~8-10 game pixels tall
- Total: ~32-42 game pixels tall

### Limb Thickness
In a 32px wide sprite, an arm at its thinnest should be **2 pixels wide** minimum. 1-pixel limbs collapse at 1× view and look like antenna. The exception: very thin characters as a design choice (angular antagonist types).

**Undertale rule:** Every humanoid arm is 3-4 pixels wide at rest, tapering to 2 at the wrist. This creates readable anatomy without needing realistic elbow/joint detail.

### Hand Simplification
At 32×32, hands are typically 4-6 pixels total (a rough mitten shape). Finger detail is not possible at this scale without making hands grotesque. The object IN the hand (Ben's sandwich, Alex's coffee cup) does more character work than any hand detail could.

### Exaggeration Purposes
- **Big eyes:** Communicate emotion more clearly. Undertale NPCs have eyes that take up 30-40% of face width.
- **Stubby legs:** Emphasize head and torso, which carry the identity. Long legs eat sprite real estate.
- **Big feet:** Ground the character visually, prevent "floating" look.

---

## 4. Color Count Limits

### Historical Constraints and Their Legacy
These limits aren't arbitrary — they come from real hardware:
- **Game Boy:** 4 colors (including transparent) per sprite
- **NES:** 4 colors per 8×8 tile (3 + transparent)
- **SNES:** 16 colors per sprite
- **GBA:** 16 or 256 colors per sprite (selectable)

Modern pixel art artists often voluntarily limit themselves to these counts because the constraints force better design decisions.

### Practical Color Counts by Style
| Style | Colors | Example |
|-------|--------|---------|
| Ultra-minimal | 2-4 | Game Boy demoscene |
| Retro NES | 3-6 | Shovel Knight (voluntary NES limit) |
| SNES aesthetic | 8-16 | Chrono Trigger, FFVI |
| GBA aesthetic | 12-20 | Pokémon GBA, Fire Emblem GBA |
| Modern pixel art | 16-32 | Celeste, CrossCode, Eastward |
| "Pixel art" with no constraint | 32-64+ | Not true pixel art — too painterly |

**BitBio target:** 12-20 colors per character sprite. Enough for readable depth and personality without crossing into painterly territory.

### Shared Palettes
Many games (especially older ones) share a global palette with all sprites drawing from the same set of colors. This creates visual coherence — everything looks like it belongs in the same world.

BitBio enforces per-realm accent colors that tint NPC and environment rendering, creating a soft version of this — realm 1 sprites look "cytoplasm green," realm 3 sprites look "neural purple."

### Transparency
Always count transparency as a "color" in your budget. Most sprite tools treat `rgba(0,0,0,0)` as a special transparent index. In Canvas API rendering, we leave pixels undrawn for transparency.

---

## 5. Outline Techniques

### Hard Outline
A single pixel border of one color (usually darkest in palette, often not pure black) surrounds the entire sprite. All edges against transparent background have this border.

**Pros:** Maximum readability against any background. Character "pops" against environments.
**Cons:** Can look flat, cartoonish. Makes all sprites look equally prominent.

**Examples:** Most Pokémon sprites (GBA era), Shovel Knight, most NES/SNES games.

**BitBio use:** All characters use a dark (not pure black) hard outline for maximum readability against the diverse tile backgrounds.

### Selective Outline
Some edges have an outline, others don't. Typically: outer edge (against transparent) gets full outline, but inner seams between colors on the same "surface" don't get outlined — or get a lighter, same-hue darker version rather than a separate outline color.

**Pros:** Less "coloring book" look. More sophisticated.
**Cons:** Harder to implement, easier to get wrong.

**Examples:** Hyper Light Drifter, later Celeste sprites.

**When to use:** For BitBio bosses or cutscene portraits where extra sophistication is warranted.

### No Outline (Outlineless)
No explicit border pixel. Contrast is created by color relationship alone.

**Pros:** Very sophisticated, natural look.
**Cons:** Extremely difficult at small sizes. Characters can blur into backgrounds.

**Examples:** Some Eastward characters, some OMORI dreamworld sequences.

**BitBio use:** Not recommended for overworld sprites. Reserved for special dialogue portraits at larger scale.

### Outline Color Rules
- **Never pure black (`#000000`):** Pure black reads as harsh and flat. Use very dark desaturated hue-shifted dark (e.g., `#0d0d1a` for a character with blue tones) for "black" outlines. Undertale uses `#000000` for some characters as an aesthetic choice, but it works because the game's palette is already very desaturated.
- **Match hue to character:** A fire-type enemy's outline might be dark red-brown rather than neutral dark.
- **Lighter outlines for background elements:** NPC background elements can have slightly lighter outlines to push them further back visually.

---

## 6. Anti-Aliasing vs Pixel-Perfect Edges

### Pixel-Perfect
Every edge is a sharp, hard 1-pixel boundary. No sub-pixel blending. This is the "true pixel art" standard.

**How to enforce in Canvas API:** `ctx.imageSmoothingEnabled = false`. Never draw at non-integer coordinates (no `0.5` offsets). Scale by integer factors only (BitBio uses SCALE=3).

### Anti-Aliasing in Pixel Art
Manually placed intermediate-color pixels along a diagonal to reduce the "staircase" effect. This is NOT browser/software anti-aliasing — it's intentional pixel placement.

**When to use:** Gentle curves on character limbs, especially in larger portraits. The intermediate color should be approximately the average of the two colors it's bridging.

**Example:** A skin tone border against a dark outline: place 1-2 pixels of a 50% intermediate tone at the sharpest corners of the curve.

**BitBio rule:** Use manual anti-aliasing only in dialogue portraits (72×72 canvas px range), never in overworld sprites where the pixel size is too small for it to help.

---

## 7. Dithering Patterns

Dithering places alternating pixels of two colors to simulate a third, intermediate color using limited palette entries.

### Checkerboard Dithering
The most common pattern: alternating pixels of color A and B in a 50/50 ratio.

```
ABAB    ← this row alternates A and B
BABA    ← next row offset by 1
ABAB
```

Visually reads as a blend of A and B at normal viewing distance. At 3× zoom (BitBio's SCALE=3), checkerboard dithering at 1-game-pixel granularity becomes very visible — use sparingly, only for textures meant to look rough or granular.

### Bayer Dithering
An ordered dithering pattern using a 4×4 or 8×8 matrix. Creates a regular halftone-like texture. Less common in character sprites, more common in environments to simulate gradients with limited palette.

### Error Diffusion
Not commonly used in hand-drawn pixel art (it's a computational technique for converting photographs to pixel art). Not applicable to BitBio's Canvas API approach.

### When to Dither in BitBio
- **Mitochondria texture in Realm 1:** 2-color dither to suggest crystalline organelle surface
- **Void gradient in Realm 3:** 2-3 color dither at void/platform edge for visual softening
- **Boss sprites:** Shadow areas on bosses can use dither to show form without adding new colors

---

## 8. Game-by-Game Sprite Analysis

### Undertale (Toby Fox / Temmie Chang)
- **Sprite size:** 16-24px native, scaled 2×
- **Color count:** Extremely limited, 4-8 colors per character
- **Outline:** Hard black outline on enemies (especially Undyne, Mettaton). NPCs often outlineless or selective.
- **Key insight:** Emotional expression is carried entirely by eye shape. Eyes are the ONLY part of Undertale NPCs that animate during dialogue — a rotating spiral, a blinking line, a star shape. This is genius constraint.
- **Lesson for BitBio:** Henry's glitching alpha and scan lines are our version of this — a single system that communicates "this entity is different."

### OMORI (OMOCAT)
- **Sprite size:** 32px and smaller, extremely minimal
- **Color count:** Black, white, and 1-3 accent colors per character. Horror sequences add red.
- **Outline:** Black outline, selective (not on all surfaces)
- **Key insight:** Stillness is a design choice. OMORI characters have very limited animation — this creates a dreamlike, unsettling quality. The rare moments of movement (the knife animation, Basil's flower) are MORE impactful because of the stillness.
- **Lesson for BitBio:** Use stillness strategically in boss pre-attack frames. Hold for 8-12 frames before the attack lands.

### Pokémon Black/White (Game Freak)
- **Sprite size:** 80×80 pixels, complex
- **Color count:** 16-32 per sprite
- **Outline:** Hard outline, slightly warm dark (not pure black)
- **Key insight:** B/W introduced animated Pokémon sprites — but animation was specifically designed around the static starting pose. The animation was a secondary layer added to the existing sprite, never compromising the base readability.
- **Lesson for BitBio:** Design animations that enhance but never depend on — you should be able to show any single frame and have it communicate the character clearly.

### Chrono Trigger (Akira Toriyama / Square)
- **Sprite size:** 24px tall, chibi
- **Color count:** 16 per SNES hardware limit
- **Outline:** Hard outline, character-specific dark hues
- **Key insight:** Every NPC has a unique prop or hat that makes them silhouette-distinct. You never mistake a Guardia soldier for a Millennial Fair worker. This is achieved with only 16 colors.
- **Lesson for BitBio:** Distinctive props > detailed faces. Ben's sandwich > attempting detailed facial features.

### Earthbound / Mother 3 (Shigesato Itoi / APE/HAL Laboratory)
- **Sprite size:** 16-24px, varies
- **Color count:** 8-16
- **Outline:** Soft outline, some characters nearly outlineless
- **Key insight:** Earthbound uses warm, slightly desaturated colors even for "normal" modern-world settings. This creates the slightly-wrong, uncanny mood. Mother 3's pixel art is more traditionally Nintendo-cute but adds expressive deformation for emotion.
- **Lesson for BitBio:** Warm the floor colors slightly (hint of yellow/amber) even in cold realms, to make environments feel inhabited rather than sterile.

### Stardew Valley (ConcernedApe)
- **Sprite size:** 16×16 tiles, 16×32 characters
- **Color count:** 8-12 per character
- **Outline:** Mostly selective/no outline
- **Key insight:** Tile variety is achieved through prop placement, not tile variation. The same grass tile placed with different props (flowers, stones, twigs) creates a rich-feeling environment from minimal raw tiles.
- **Lesson for BitBio:** Use node, NPC, and decorator tiles to break up uniform floor tiles. A room of identical floor tiles with one flower prop reads richer than a room of 6 different floor tiles.

### Celeste (Matt Thorson / Noel Berry + Pedro Medeiros)
- **Sprite size:** 8×8 tiles (environments), Madeline ~20px tall
- **Color count:** 4 colors per biome (foreground, midground, background, sky)
- **Outline:** No outline on tiles, subtle outline on Madeline
- **Key insight:** Each Celeste chapter has exactly 4 colors + black for the whole scene. This extreme constraint forces extreme creativity. The Celestial Resort chapter's pink/gold palette is stunning precisely because only 4 colors create it.
- **Lesson for BitBio:** Our realm palettes should each have a definitive "feel" achievable with 5-6 colors for floors/walls. Additional NPC colors supplement but don't define the realm's mood.

### CrossCode (Radical Fish Games)
- **Sprite size:** 32×32 character, 16×16 tiles
- **Color count:** 24-32 per character (higher than typical)
- **Outline:** Selective outline, thicker at outer edges
- **Key insight:** CrossCode uses an unusually high color count but compensates with extremely consistent lighting direction (always top-left light source) and per-character palette discipline.
- **Lesson for BitBio:** If a sprite uses more colors, ensure they all come from a coherent value ramp with consistent lighting direction.

---

## 9. Rules for When to Break the Rules

### Break silhouette purity for readability in context
If a character's silhouette merges with a specific background that's important for them, prioritize the outline and contrast for that specific background, not the silhouette in isolation.

### Break color count limits for boss sprites
Bosses are special. LYSO (Realm 1 boss) can use 24 colors where a standard NPC uses 16. Bosses are the visual climax — invest extra palette budget.

### Break hard outlines for dreamlike or ethereal characters
Henry's holographic nature is better served by reduced/selective outline + alpha effects than by following the hard outline rule. The rule exists for readability; Henry's ethereality intentionally trades some readability for visual distinctiveness.

### Break pixel-perfect positioning for camera shake and impact
During boss attacks and hit reactions, sub-pixel canvas transform shaking is acceptable (and desired) as an impact effect, even though it temporarily creates non-pixel-perfect rendering.

### Break anatomy proportions for specific character purposes
A boss that's MEANT to look wrong (too many limbs, asymmetric) deliberately violates anatomy rules. Anatomical correctness is a tool for "normal" characters. Wrongness is a tool for horror or alien characters.
