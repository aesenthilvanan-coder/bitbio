# Environment Design — Pixel Art Knowledge Base

---

## 1. Auto-Tiling Systems

### The Problem Auto-Tiling Solves
Placing tiles manually means hand-choosing which tile variant to use at every boundary — an inner corner needs a different tile than an outer corner, which needs a different tile than a straight edge. Without auto-tiling, artists draw every variant by hand and mappers choose manually.

### Blob Tile System (Wang Blobs)
The blob system assigns each tile a bitmask based on which of its 8 neighbors (N, NE, E, SE, S, SW, W, NW) share its type. This generates 47 unique combinations (the full "blob" set).

For BitBio's 40×28 ASCII maps, auto-tiling isn't implemented (the ASCII map directly specifies each tile character). However, the RENDER layer (PixelWorldEngine.tsx) can implement blob-logic when drawing `#` (wall) tiles — checking neighbors to determine which wall variant to draw.

**Wall variants needed for each realm:**
- Straight horizontal wall (N and S are different from E/W pattern)
- Straight vertical wall
- Inner corner (concave, 270° interior)
- Outer corner (convex, 90° interior)
- T-junction (3-way)
- Cross junction (4-way)
- Standalone (surrounded by floor on all sides)

**BitBio current approach:** Each `#` draws the same wall tile. Enhancement: Read neighbors using `tileAt(x, y-1)`, `tileAt(x+1, y)`, etc., and select variant accordingly.

### Wang Tile System
Wang tiles use a system of colored edge-matching to create seamless patterns. Each tile has colored edges, and tiles are placed such that adjacent edges match. This produces non-repeating textures from a small set of tiles.

**Application:** The Cytoplasm floor (`#1a3a44`) using Wang tiles would appear to have irregular organic texture without obvious repetition.

---

## 2. Tile Size Considerations

### 8×8 Game Pixels
- **Pro:** Maximum information density, excellent for UI and small decorations
- **Con:** Too small for readable environmental detail
- **Best for:** UI elements, small items, floor texture detail sub-tiles
- **Reference:** NES games, early Zelda

### 16×16 Game Pixels (BitBio standard)
- **Pro:** Enough space for readable shapes + simple decoration. Fast to author.
- **Con:** Limited depth expression on a single tile
- **Best for:** All primary environment tiles in BitBio
- **Reference:** Stardew Valley (16px tiles), most SNES games

### 32×32 Game Pixels
- **Pro:** Can show significant detail and texture per tile
- **Con:** Maps feel smaller (fewer tiles visible on screen)
- **Best for:** Large environmental props, boss arena elements
- **Reference:** Pokémon HGSS world tiles (~32px effective with scaling)

### BitBio's Approach: 16px tiles at SCALE=3
Each game tile = 16×16 game pixels = 48×48 canvas pixels at SCALE=3. This gives each tile enough physical screen space to be readable without making the map feel cramped.

---

## 3. Foreground / Midground / Background Layer Separation

### The Three-Layer Model
**Background (BG):** Sky, distant elements, atmospheric elements. Player and all interactive elements render IN FRONT.

**Midground (MG):** The primary play surface — floors, walls, most tiles. The player and NPCs exist on this layer.

**Foreground (FG):** Elements that render IN FRONT of the player — overhanging trees, cave ceilings, door frames that overlap the character. Used sparingly; must not obstruct vision.

### BitBio's Layer Implementation
PixelWorldEngine renders in this order:
1. Background color fill (solid realm sky color)
2. Background decorative tiles (far-distance props, ceiling elements)
3. Floor tiles (`.`, `=`, `*`)
4. Wall and object tiles (`#`, `T`, `~`)
5. Node indicators (glowing lesson nodes)
6. Enzyme companion sprite
7. Player sprite
8. NPC sprites (rendered on top of player for overlay dialogue)
9. Foreground decorative overlay (if any — currently unused)
10. HUD / dialogue box

**Enhancement opportunity:** Add a `fg` property to ASCII maps for ceiling-overlay tiles. This would allow overhanging elements in the Genome Forest canopy and Protein Cathedral vaulted ceiling.

---

## 4. Environmental Storytelling Through Tile Placement

### The Principle
Environment alone, without explicit text, should communicate:
- What kind of place is this? (function)
- Who has been here? (inhabitants)
- What has happened here? (history)

### Stardew Valley Environmental Storytelling Examples
- The mines use **darker, more worn floor tiles** as you go deeper. The floor itself tells you "this is more dangerous."
- **Broken furniture and debris** in abandoned buildings communicate neglect without a sign saying "abandoned."
- Pierre's shop has **seasonal decorations** that change. The shopkeeper's personality is in the decor.

### BitBio Environmental Storytelling Requirements

**Realm 1 — Cytoplasm:**
The player is literally walking inside a living cell. The environment should communicate:
- Life is happening here (organelles doing their job — mitochondria should appear to pulse)
- There is both order (the Nucleus Lab has neat organized walls) and chaos (the Lysosome Acid Pools are dangerous, irregular)
- Elliot lives here — there should be evidence of his work: arranged nodes, a clear path between them, maybe debris from his experiments

**Implementation:** The Nucleus Lab room (`#.1.E.#` area) should have wall tiles rendered with slightly more refined wall graphics than the outer membrane walls. The acid pools should have irregular edges (not perfect rectangles) and an animated bubbling effect.

**Realm 2 — Genome Forest:**
A forest where DNA sequences are encoded in the tree patterns.
- Trees are not random — they follow a double-helix spiral arrangement when viewed from above
- The RNA River is a living information stream — it should feel like data flowing, not just water
- Ben's clearing is warm and welcoming (he eats here!) — slightly different floor tile, maybe lighter

**Implementation:** The DNA tree pattern in the map (alternating `T` with `.` gaps) should be explicitly designed to create visual helix patterns. Tree `T` tiles should alternate between two visual variants: one for each DNA strand.

**Realm 3 — Neural Nebula:**
A space station built inside a neural network.
- Platforms are NOT natural formations — they're constructed, manufactured
- The void between platforms is genuinely terrifying — unknown depth
- Alex's terminal station has screens and equipment visible
- Bridges look like axons — tubular, fibrous

**Implementation:** Platform edges should have a "manufactured metal" appearance (darker edge, lighter center). The terminal station floor (`A` area) should have a different floor tile than the platforms — grid-pattern floor suggesting hi-tech equipment layout.

**Realm 4 — Protein Cathedral:**
A place of reverence, not just a building.
- The nave arrangement (two wings, central aisle) is deliberate religious architecture
- Henry doesn't just stand in the middle — he IS the altar. The space radiates out from him.
- The altar floor (`*` tiles) should feel sacred — different, special
- Pillars are protein strands literally forming the architecture

**Implementation:** The `*` (altar) tiles should render with a cross-hatch or diamond inlay pattern, gold-toned instead of the standard stone floor. Henry's holographic particles should interact with the gold tones — his particles cast small golden reflections on the altar floor.

---

## 5. How Stardew Valley's Farm Tiles Work

**Tilled Soil System:**
Each farmland state has a different tile:
- Untilled: Grass tile
- Tilled (no crop): Dark soil, smooth  
- Tilled + watered: Dark soil, small water sheen pixels
- Crop Stage 1-5: Separate tiles per stage
- Mature: Final stage tile with item sprite on top

**Lesson:** State transitions are more impactful than visual complexity. A tile that changes appearance based on player action (completed vs uncompleted node, opened vs closed door) creates a sense of world responsiveness.

**BitBio application:** Completed lesson nodes should render differently from active nodes. The node tile should have a "depleted" or "absorbed" visual state — same position, different appearance. Dimmer, no pulse glow, small star instead of number.

---

## 6. CrossCode's Multilayer Parallax

CrossCode uses up to 7 distinct parallax layers for some environments:
1. Sky gradient
2. Far sky details (clouds)
3. Distant geography (mountains, horizon line)
4. Mid-distance large structures
5. Play surface (main level)
6. Immediate surroundings (foreground props)
7. Screen-overlay foreground (closest elements, subtle alpha)

Each layer scrolls at a speed proportional to its "distance." The far sky moves 0.1× camera speed; the immediate foreground moves 1.2× camera speed (appears to move faster than the camera).

**BitBio landing page implementation:**
The Codédex-style landing page needs exactly this system. Layer speeds:
- Stars: 0.02× (near-static)
- Far mountains: 0.1×
- Mid DNA trees: 0.3×
- Near hills: 0.7×
- Foreground silhouette: 1.0× (moves with camera)

---

## 7. Celeste's Cave/Mountain Tile Mood System

**Core insight:** Celeste's environments feel oppressive or open based on the proportion of wall tiles to floor tiles, not the visual complexity of the tiles themselves.

- **Linear corridors:** 80% wall tiles. Claustrophobic.
- **Open rooms:** 40% wall tiles. Breathable.
- **Vertical chambers:** Wall on sides (100%), floor only at bottom. Isolated.

**Color-driven mood:**
- Dark backgrounds + light tiles = underground/enclosed feel
- Light backgrounds + dark tiles = elevated/exposed feel

**BitBio application:**
- **Realm 1 Nucleus Lab rooms:** High wall-to-floor ratio inside rooms (enclosed, controlled)
- **Cytoplasm central area:** Low wall-to-floor ratio (open, expansive, you're inside a big cell)
- **Realm 3 void:** The `~` tiles function as "dark background." Platforms are islands of lightness. This creates the Celeste "elevated/dangerous" feeling.
- **Realm 4 Cathedral nave:** Tall and narrow — high wall ratio on sides, open center. Uses the "vertical chamber" logic to feel grand.

---

## 8. Realm-Specific Environment Design Specs

### Realm 1: The Cytoplasm

**Visual Theme:** Interior of a eukaryotic cell, night-vision teal aesthetic
**Base Palette:** Floor `#1a3a44`, Wall `#0f2530`, Accent `#00ffcc`

**Key Visual Rules:**
1. Walls should appear as cell membrane — thick, slightly irregular (use 2-pixel inner glow on wall edges)
2. The Lysosome Acid Pools (`~`) use acid green-yellow: `#44ff00` + bubbling animation
3. The Microtubule Highway (`=`) renders as parallel track lines, slightly raised (lighter center, darker edges)
4. Mitochondria clusters (`T` at bottom) render as elongated oval shapes, not standard pillars — they're organelles
5. The Boss Gate (`B`) at row 2 renders as a massive lysosomal membrane with red warning glow

**Sub-areas and their feel:**
- **Nucleus Lab (top-left room):** Organized, sterile, Elliot's workspace. Neat walls, node markers on floor.
- **Ribosome Chamber (top-right room):** Cluttered with small spherical decoration pixels on walls (ribosome particles).
- **Central Cytoplasm (rows 8-12):** Open, expansive, slightly eerie. Single visible path between pools.
- **Microtubule Highway (rows 13-14):** Bright and fast-looking. Two parallel track-lines in `=` tile render.
- **Mitochondria Gardens (rows 18-21):** Dense, irregular shapes. Warmer tint than rest of realm (mitochondria generate heat).

**Signature Elements (5 required):**
1. Pulsing outer membrane wall with inner glow
2. Animated acid bubble pools
3. Dual-track microtubule highway with light trails
4. Elongated oval mitochondria shapes
5. Red-glowing boss gate with membrane arch

### Realm 2: The Genome Forest

**Visual Theme:** Ancient forest where DNA encodes itself into tree structures
**Base Palette:** Floor `#162a0a`, Wall `#0d1e05`, Accent `#00ff44`

**Key Visual Rules:**
1. Trees (`T`) are DNA-inspired: two parallel trunks with connecting base-pair rungs between them
2. RNA River (`~`) is NOT still water — it's flowing data. Animated horizontal stripe motion.
3. The Wooden Bridge (`=` at rows 7-8) renders as actual planks with visible grain texture
4. The Canopy (dense `T` at rows 1-3) creates a nearly-black ceiling effect — very little light penetrates
5. Clearings contrast dramatically with the dark canopy — bright green floor tiles

**Sub-areas:**
- **North Canopy (rows 1-3):** Dense, dark, barely walkable gap-paths through trees
- **Clearings 1-3 (rows 4-8):** Bright dappled light, nodes visible, room to breathe
- **RNA River Crossing (rows 9-11):** Moving cyan-blue data stream, bridge planks visible
- **South Forest (rows 12-26):** More open, scattered trees, less oppressive than north canopy

**Signature Elements (5 required):**
1. Dual-trunk helix trees with base-pair rung connections
2. Animated RNA River (horizontal scroll data stream)
3. Wooden plank bridge over the river
4. Light-shaft effect in clearings (brighter floor tiles directly below canopy gaps)
5. Alternating dense/clear tree pattern suggesting DNA strand winding

### Realm 3: The Neural Nebula

**Visual Theme:** Space station platforms floating in synaptic void
**Base Palette:** Floor `#14083a`, Wall `#0e052a`, Accent `#aa44ff`, Void `#030008`

**Key Visual Rules:**
1. Void (`~`) is deep space purple-black — animated with slow-moving star points
2. Platforms render with metallic edge treatment: lighter top edge, darker bottom edge
3. Synapse bridges (`=`) look like axon tubes: circular cross-section implied by center-highlight + edge-shadow
4. Alex's terminal station has a different floor tile: grid pattern suggesting tech floor
5. Stars visible in void: small white 1-pixel points with occasional pulse

**Sub-areas:**
- **North Platforms (rows 1-4):** Small isolated research platforms. Only accessible via bridges.
- **Mid-level bridges (rows 5-9):** Narrow synapse bridges. Single pixel-wide at narrowest.
- **Central Hub (rows 10-13):** Larger platform, central node. Multiple bridges converging.
- **Terminal Station (rows 15-26):** Solid floor (no void), Alex's workspace, most nodes are here.

**Signature Elements (5 required):**
1. Animated star-field void with slow parallax
2. Metallic-edged floating platforms
3. Tubular synapse bridge rendering (highlight + shadow per bridge tile)
4. Grid-pattern tech floor at terminal station
5. Purple ambient glow particles drifting upward in void

### Realm 4: The Protein Cathedral

**Visual Theme:** Gothic cathedral where protein structures form the architecture
**Base Palette:** Floor `#1e1438`, Wall `#160f30`, Accent `#ffaa00`

**Key Visual Rules:**
1. Pillars (`T` in nave) should render as protein α-helix structures: spiral implied by alternating highlight pixels up the column
2. The Beta Sheet Transept bridge (`=` at rows 6-7) renders as woven sheet structure (alternating light/dark pixels in a fabric pattern)
3. Altar floor (`*`) is gold-inlaid: diamond grid pattern in `#ffaa00` against dark `#1e1438`
4. Henry renders as fully holographic: animated alpha + vertical scanlines through him
5. The inner sanctum (wall `#` rows 1-11 center) is SOLID — never accessible — creating mystery

**Sub-areas:**
- **West Nave (cols 1-10):** Nodes 1, 3 on west side. Classical pillar rows.
- **East Nave (cols 21-38):** Nodes 2, 4 on east side. Mirror of west.
- **Inner Sanctum (cols 11-19, rows 1-11):** WALLED OFF. The unseeable mystery.
- **Grand Evoformer Aisle (rows 12-13):** Wide corridor, full accessibility. The processional path.
- **Altar Area (rows 14-16):** Henry at row 14, `*` altar tiles at 15-16. Sacred space.
- **Nave Extension (rows 17-26):** Nodes 7-9, more open. Where initiates study.

**Signature Elements (5 required):**
1. α-helix pillar rendering (spiral highlight pattern up each column)
2. Woven beta-sheet bridge texture
3. Gold diamond-inlaid altar floor
4. Holographic Henry with scanline animation through his sprite
5. Forbidden inner sanctum (visually distinct solid wall suggesting sealed mystery)
