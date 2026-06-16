# BitBio Pixel Art Design Rules
**Art Research Division | 50 Formal Rules with BitBio Application**

---

## TIER 1: FOUNDATIONAL (Breaking these = broken art)

### Rule 1: Silhouette Supremacy
**Description:** The outline shape of any sprite or tile must communicate its identity at full blur. If you can't identify the element with the sprite blurred to 50% opacity at half size, the silhouette fails.
**Why it exists:** Players process shape before color before detail. In gameplay, shape IS the message.
**When to break:** Never for playable characters. Optionally for decorative background elements.
**BitBio application:** Player, Enzyme, Elliot, Ben, Alex, Henry — each must have a unique, unambiguous silhouette. Test: cover just the color and check shapes only.
**Current BitBio score:** 6/10 (player silhouette is generic, NPCs are distinctive)

---

### Rule 2: Hue-Shifted Color Ramps
**Description:** When creating shadows or highlights, shift the hue toward cool (blue-purple) for shadows and warm (yellow-orange) for highlights. Never just darken or lighten a base color.
**Why it exists:** Flat darkening produces "muddy" palettes. Hue-shifted ramps feel luminous and alive.
**When to break:** Intentionally desaturated horror zones (OMORI's white space uses grayscale deliberately).
**BitBio application:** Every realm floor tile must use hue-shifted ramps. Shadow floor tile = shift toward the realm's complementary color. Example: Cytoplasm (teal) shadows shift toward purple-blue.
**Current BitBio score:** 5/10 (some tiles use flat darkening)

---

### Rule 3: Dark Background Contract
**Description:** All playable environments use near-black backgrounds (#000000 to #1a1a1a range) so characters always read clearly against floors.
**Why it exists:** Characters are lighter than floors. If floor is too light, characters disappear. Undertale's floor is #000000 → characters at #c0c0c0 have perfect contrast.
**When to break:** Outdoor daytime environments (Stardew Valley), but still ensure characters contrast with the terrain.
**BitBio application:** All 4 realms already use near-black floors. Maintain this — never let realm "theme" push floors above #2a2a2a.
**Current BitBio score:** 9/10 (already implemented)

---

### Rule 4: Maximum 8 Colors Per Sprite
**Description:** Individual character sprites use at most 8 distinct colors (not counting transparency).
**Why it exists:** More colors = harder to maintain consistency, harder to recolor for variants, and often indicates overworked detail that won't read at game scale.
**When to break:** Modern lush-detail games like Eastward use 12-16. Only break if you have dedicated art resources.
**BitBio application:** Player sprite: skin (2 shades) + hair (2 shades) + outfit (2 shades) + eyes + outline = 8 colors. Perfect.
**Current BitBio score:** 8/10

---

### Rule 5: Outline Consistency
**Description:** If sprites use outlines, ALL sprites use the same outline weight (1px or 2px, not mixed). Outline color should be the darkest shade in the character's palette, not pure black unless everything is outlined in black.
**Why it exists:** Mixed outline weights make a game look unfinished. OMORI uses 2px everywhere — it's a visual contract.
**When to break:** Background elements vs. foreground objects can have different outline treatment (no outline bg, outlined fg).
**BitBio application:** NPCs use 1px darkest-shade outlines. Undertale style. Never apply 2px outlines at S=3 (too thick at 6px CSS).
**Current BitBio score:** 7/10

---

## TIER 2: QUALITY (Breaking these = mediocre art)

### Rule 6: The Tile Seamlessness Test
**Description:** Place 9 copies of any tile in a 3×3 grid. Seams must disappear or appear intentional (like grout lines).
**Why it exists:** Tile maps repeat tiles constantly. Visible seams break every room.
**BitBio application:** Run every new floor and wall tile through this test. Add 1px edge variation to prevent hard seams.
**Current BitBio score:** 7/10

---

### Rule 7: Every Other Tile Must Vary
**Description:** In any floor tileset, create at least 2 variants. Use (tx + ty) % 2 === 0 to alternate automatically.
**Why it exists:** Identical tile repetition is instantly noticeable and feels cheap. Checkerboard variation is free visual richness.
**BitBio application:** Already implemented via `(tx + ty) % 2 === 0` check. Extend variance interval — use % 4, % 6 for more sporadic variation.
**Current BitBio score:** 8/10

---

### Rule 8: Character-Environment Value Separation
**Description:** Characters must have at minimum 4.5:1 contrast ratio against the floor tiles they walk on. Test in grayscale.
**Why it exists:** Poor contrast = unplayable game for colorblind players and in bad lighting.
**BitBio application:** Realm floors average ~15 lightness. Player/NPC sprites should average ~60+ lightness on their brightest surface.
**Current BitBio score:** 7/10

---

### Rule 9: Animation Frames Must Pass Silhouette Test Individually
**Description:** Every frame of an animation must be individually readable as the same character doing the same action.
**Why it exists:** Bad animation frames create "broken" moments where the character looks like a different sprite.
**BitBio application:** Walk cycle: both leg-forward frames must show same character, same costume, just different leg position.
**Current BitBio score:** 6/10 (2-frame walk is functional but not polished)

---

### Rule 10: Light Source Consistency
**Description:** Choose one light source direction per zone and apply it consistently to ALL tiles and sprites in that zone.
**Why it exists:** Mixed light directions make a scene look physically impossible.
**BitBio application:** All realms use top-left light source. Wall tiles have bright top edge + bright left edge + dark right/bottom. Maintained consistently.
**Current BitBio score:** 7/10

---

### Rule 11: The 16-Tile Interest Rule
**Description:** No more than 16 tiles (256 game pixels) should pass between visual interest points: decorative tiles, NPCs, objects, or interactive elements.
**Why it exists:** Long blank corridors of identical floor tiles feel empty and boring, even in dark/atmospheric games.
**BitBio application:** World maps should place organelle tiles, lesson nodes, or NPC positions within every 16-tile radius.
**Current BitBio score:** 6/10 (some large open floor areas)

---

### Rule 12: Zone Identity Color Contract
**Description:** Each zone must have ONE hero color that appears nowhere in other zones. This is the zone's identity color.
**Why it exists:** Players build color memory for zones. Crossing zones should feel distinctly different.
**BitBio application:** Cytoplasm=teal (#00ffcc), Genome=electric green (#00ff44), Neural=electric purple (#aa44ff), Cathedral=amber gold (#ffaa00). These must ONLY appear in their respective zones.
**Current BitBio score:** 9/10 (already enforced)

---

### Rule 13: Readability At 25% Scale
**Description:** Sprites must remain readable characters (not abstract blobs) when scaled to 25% of their drawn size.
**Why it exists:** Players may see sprites far away, in small windows, or on low-resolution streams.
**BitBio application:** At S=3 and 10gp wide, player sprite is 30px CSS. At 25% = 7.5px. Very small. This is why we target 16gp wide sprites.
**Current BitBio score:** 5/10 (sprites are quite small relative to screen)

---

### Rule 14: Palette Harmony Per Scene
**Description:** Any single scene should use no more than 4 hue families. Beyond 4 hue families feels chaotic.
**Why it exists:** Visual coherence. Too many hues compete for attention and exhaust the eye.
**BitBio application:** Each realm: dark bg (neutral) + floor neutrals + zone accent + one complementary accent. 4 hue families max.
**Current BitBio score:** 8/10

---

### Rule 15: Boss/Important Enemy = Larger Than Regular Enemies
**Description:** Enemy importance hierarchy must be legible from sprite size. Boss = 2-4x larger than common enemy.
**Why it exists:** Players need to instantly assess threat level. Size is the clearest signal.
**BitBio application:** Realm bosses should fill at least 30% of screen width. Common enemies = 8-12gp. Bosses = 32-48gp.
**Current BitBio score:** Not applicable yet (no boss sprites)

---

## TIER 3: POLISH (Breaking these = good-not-great art)

### Rule 16: Anti-Aliasing Is Optional But Consistent
**Description:** Either use anti-aliasing everywhere or nowhere. Never mix anti-aliased and hard-pixel edges.
**Why it exists:** Mixed approaches look like mistakes, not style choices.
**BitBio application:** No anti-aliasing in game world (canvas fillRect only). Landing page may use CSS anti-aliased text.
**Current BitBio score:** 9/10

---

### Rule 17: Walk Cycle Asymmetry
**Description:** Left-foot-forward and right-foot-forward frames should look different, not mirrored.
**Why it exists:** A perfectly mirrored walk cycle looks mechanical. Tiny asymmetries feel biological.
**BitBio application:** In `drawPlayer`, left leg goes slightly farther forward than right, and head tilts fractionally.
**Current BitBio score:** 6/10

---

### Rule 18: Sub-Pixel Animation for Floating Elements
**Description:** Floating/hovering elements should bob with fractional pixel precision (using Math.sin with scale), creating smooth not choppy movement.
**Why it exists:** 1px-at-a-time bobbing looks choppy. sin-wave animation with fine steps looks smooth.
**BitBio application:** Enzyme floating animation, lesson nodes, boss warning effects.
**Current BitBio score:** 6/10

---

### Rule 19: Dithering as Gradient Replacement
**Description:** Gradients in pixel art are replaced by checkerboard dithering between two adjacent colors.
**Why it exists:** Pure gradients violate pixel art aesthetic. Dithering achieves the same optical effect with grid-aligned pixels.
**BitBio application:** Shadow transitions on large surfaces should use 2x1 or 1x2 dithering patterns, not gradual color changes.
**Current BitBio score:** 4/10 (not implemented)

---

### Rule 20: Decorative Tiles Never Occlude Gameplay
**Description:** Any tile that exists purely for decoration must be visually clearly non-interactive (either clearly part of wall, clearly background, or clearly foreground).
**Why it exists:** Players try to interact with decorative elements. Clear visual language prevents frustration.
**BitBio application:** Organelle tiles (T) need visual differentiation from walkable floor tiles beyond just position.
**Current BitBio score:** 7/10

---

### Rule 21: Background Elements Desaturate With Distance
**Description:** Elements farther "back" in the Z-stack should be more desaturated (atmospheric perspective).
**Why it exists:** Mimics natural depth cues. Creates a sense of space even in 2D.
**BitBio application:** Background decorative layer (behind tiles): reduce saturation by 40%. Midground (tiles): full saturation. Foreground NPCs: full saturation + optional highlight.
**Current BitBio score:** 3/10 (not yet implemented)

---

### Rule 22: Consistent Pixel Grid Alignment
**Description:** Every drawn rectangle should align to the scale grid. No half-pixel offsets.
**Why it exists:** Sub-pixel drawing at integer scale looks "off" — visual noise the eye detects without knowing why.
**BitBio application:** All `gr()` calls use integer game pixel coordinates. ✓ Already enforced by the helper function.
**Current BitBio score:** 10/10

---

### Rule 23: UI Elements Use Different Visual Language Than World
**Description:** Dialogue boxes, menus, and HUD elements must be visually distinct from world tiles — different border style, color palette, or font.
**Why it exists:** Players need to instantly know: am I seeing game world or UI?
**BitBio application:** Dialogue: black bg + white border + white text. World: near-black bg + dark tiles. Clear separation.
**Current BitBio score:** 8/10

---

### Rule 24: Color Ramp Step Count
**Description:** Each major surface needs exactly 3 values: base, shadow (20% darker + hue-shifted), highlight (20% lighter + hue-shifted toward warm).
**Why it exists:** 2 values = flat. 4+ values = overworked at small scale. 3 is optimal.
**BitBio application:** Cytoplasm wall: #0a1a22 (shadow) → #0e2230 (base) → #1a3040 (highlight).
**Current BitBio score:** 6/10

---

### Rule 25: Footprint-To-Sprite Alignment
**Description:** The visual bottom of a sprite must align exactly with the tile the character is standing on.
**Why it exists:** Floating characters look wrong. Feet sunk into floor also looks wrong.
**BitBio application:** `drawPlayer` oy offset = `-2 * SCALE` to nudge sprite up so feet land on tile surface.
**Current BitBio score:** 7/10

---

## TIER 4: EXCELLENCE (Getting these right = studio-quality art)

### Rule 26: Personality Pixels
**Description:** Every named character sprite should have 1-2 pixels that exist purely to communicate personality, not anatomy.
**Why it exists:** Undertale's Sans has a permanent grin. Papyrus has wide eye-sockets. These personality pixels make characters iconic.
**BitBio application:** Elliot: mismatched sock pixels even when walking. Ben: sandwich always visible. Alex: coffee cup. Henry: flickering scanline pixels. Enzyme: permanent large eyes.
**Current BitBio score:** 8/10 (NPC sprites already have personality pixels)

---

### Rule 27: Implicit Storytelling In Environment
**Description:** Environment tiles should tell a story about the realm without text. The tiles themselves should communicate what happened here.
**Why it exists:** Show don't tell. The best pixel art environments feel inhabited and storied.
**BitBio application:** Cytoplasm: damaged membranes with cracked protein channels = some kind of cellular event. Genome Forest: overgrown paths = untamed biology. Neural Nebula: void = consciousness expanding into nothing.
**Current BitBio score:** 5/10

---

### Rule 28: Visual Hierarchy In Busy Scenes
**Description:** In any frame, the player character should be the highest-contrast element. Interactive objects second. Decorative elements third.
**Why it exists:** Player needs to know where they are and what they can do instantly.
**BitBio application:** Ensure lesson nodes (interactive) have higher brightness/contrast than floor tiles but lower than player sprite.
**Current BitBio score:** 6/10

---

### Rule 29: Animated Elements Should Have Distinct Phase Offsets
**Description:** If multiple tiles animate (~, T with glow, etc.), their animation frames should be offset so not everything blinks at once.
**Why it exists:** Synchronized blinking across an entire screen is seizure-inducing and amateur-looking.
**BitBio application:** Use `(tx * 7 + ty * 3) % animMax` to create staggered animation phases.
**Current BitBio score:** 7/10 (partially implemented)

---

### Rule 30: Scale-Appropriate Detail Density
**Description:** At your target display scale, each game pixel should be at least 2x2 CSS pixels. Detail smaller than this is invisible and wasted.
**Why it exists:** If you're drawing at S=3 (3px per game pixel), the smallest meaningful detail is 1x1 game pixels = 3x3 CSS pixels.
**BitBio application:** At S=3, minimum visible detail is 1gp. Typical tiles have 4-8gp features, which is appropriate.
**Current BitBio score:** 8/10

---

### Rules 31-50: Advanced Techniques

**Rule 31 — Chromatic Aberration On Attacks:** High-energy attacks briefly show 1px red/blue offset = power sensation.
**Rule 32 — Knockback Animation:** Enemy hit = 2px backward shift for 1 frame = impact weight.
**Rule 33 — Damage Flash:** Character hit = swap palette to near-white for 3 frames = clear hit confirmation.
**Rule 34 — Shadow Blobs:** All sprites have a 4x2gp dark ellipse beneath feet = groundedness, prevents floating.
**Rule 35 — NPC Idle Animations:** All NPCs have 4+ frame idle loop = world feels alive.
**Rule 36 — Environmental Audio Cues In Tiles:** Special tiles (lesson nodes, bosses) have particle effects = invites interaction.
**Rule 37 — Consistent North Light:** Parallel wall tiles have same top-edge highlight = light from "camera" above.
**Rule 38 — Corner Detail On Walls:** Wall tile corners get 1px chamfer or extra shadow = stone/metal feel.
**Rule 39 — Tile Edge Darkening:** Every tile's bottom and right edges are 1 shade darker = depth without 3D.
**Rule 40 — Character Outline Follows Terrain:** When character walks behind short objects, lower half outline disappears = depth.
**Rule 41 — Color Temperature By Vertical Position:** Sky/top areas warmer, ground/shadow areas cooler.
**Rule 42 — Micro-Texture On Large Surfaces:** Big flat surfaces get 1-2px noise per 8x8 grid = material texture.
**Rule 43 — Interactive Objects Must Slightly Glow:** All interactable objects have 1px accent-color border frame pulse.
**Rule 44 — Boss Enters From Off-Screen:** Boss sprite scrolls in rather than appearing = cinematic scale.
**Rule 45 — Death Animation = 8 Frames:** Sprite breaks apart into colored chunks over 8 frames = satisfying defeat.
**Rule 46 — Jump Arc In Walk Direction:** Walking = slight forward lean on frame 2 = momentum.
**Rule 47 — Blink Animation For Living Things:** Any "living" character blinks every 4-8 seconds = alive.
**Rule 48 — Palette Shift For Time Of Day:** Even without lighting engine, shift all colors 10° cooler at "night".
**Rule 49 — Zone Transition Visual:** Screen wipe or fade uses zone's accent color = transition identity.
**Rule 50 — UI Text Shadows:** All HUD/dialogue text has 1px black shadow offset = readability on any background.

---

## BitBio Scoring Summary

| Category | Current Score | Target |
|----------|--------------|--------|
| Silhouettes | 6/10 | 8.5/10 |
| Color ramps | 5/10 | 8.5/10 |
| Tile quality | 7/10 | 8.0/10 |
| Animation | 6/10 | 7.5/10 |
| Zone identity | 9/10 | 9.5/10 |
| Character design | 7/10 | 8.5/10 |
| Environment storytelling | 5/10 | 8.0/10 |
| **Overall** | **6.4/10** | **8.4/10** |

**Priority fixes:** Rules 2 (hue shifting), 13 (sprite size), 19 (dithering), 27 (environmental storytelling), 28 (visual hierarchy)
