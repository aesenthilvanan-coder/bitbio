# BitBio Realm Environment Design Specifications

Four fully explorable 40×28 tile maps, each with distinct biome identity, lore, and atmosphere.

---

## Realm 1 — The Cytoplasm

### Lore Brief
You are walking INSIDE a eukaryotic cell. The cell is enormous — a universe unto itself. The outer membrane forms the boundary walls. Organelles loom like buildings. Elliot has made his home here in the Nucleus Lab because, frankly, where else would a cell biologist want to live?

This realm teaches: Cell structure, organelle function, membrane transport, ATP synthesis.

### Tone
Bioluminescent, slightly clinical, warm despite the biological weirdness. The blue-teal palette suggests deep underwater or inside something living. The acid pools are threatening but contained.

### ASCII Map Reference (from lib/worlds/worldMaps.ts)
```
Row 0:  ########################################  (outer membrane — impenetrable)
Row 2:  #.#######....B....#######..............#  (two organelle rooms + boss gate)
Rows 4-7: Two rooms: Nucleus Lab (left, Elliot @ row 4), Ribosome Chamber (right)
Row 8:  Central cytoplasm (open, node 4)
Rows 9-12: Lysosome acid pools (~) flanking central path
Row 13-14: Microtubule Highway (=) spanning full width
Rows 15-26: Lower cytoplasm — mitochondria clusters (T), nodes 7-9
```

### Tile Palette
| Tile | Canvas Color | Rendering Notes |
|------|-------------|-----------------|
| `.` floor | `#1a3a44` | Subtle 2-color texture, slightly irregular |
| `#` wall | `#0f2530` + `#1a3a50` inner glow | Double-pixel inner glow on inside face |
| `T` mitochondria | `#204030` + `#00ffcc` accent | Elongated oval, not rectangular pillar |
| `~` acid | `#1a0035` animated | Bubbling animation, color shifts `#44ff00` periodic |
| `=` highway | `#0d2040` + twin tracks | Two parallel `#00ffcc` lines at 4px and 12px within tile |
| `B` boss gate | `#cc0000` glow | Red archway shape, animated red pulse glow |
| `1`-`9` nodes | `#00ffcc` pulsing | Glowing hexagonal or circular shape |

### 5 Signature Environmental Elements (ALL REQUIRED)

**1. Pulsing Outer Membrane Wall**
The `#` walls at rows 0, 27, col 0, and col 39 are the OUTER CELL MEMBRANE. They render with:
- Base wall color `#0f2530`
- An animated inner glow that pulses: `#00ffcc` at alpha 0.3, radius 8px, sin wave period 120 frames
- The inner face of these outer walls should show "membrane protein" decorations — small hexagonal shapes at every 8th tile position

**2. Animated Acid Bubble Pools**
The `~` (lysosome) tiles at rows 9-12:
- Base void color: `#1a0035`
- Every 30 frames: spawn a bubble (circle, 2-4px diameter) at random position within pool
- Bubble rises over 20 frames (y decreases by 0.2gp per frame) then pops (burst star frame + disappear)
- Pool edges have irregular pixel scatter in the darker wall color to avoid clean rectangular look
- Pool surface should have occasional color flash: every 45 frames, one frame of brighter `#44ff00` on random pixels

**3. Dual-Track Microtubule Highway**
The `=` tiles at rows 13-14 render as a transportation highway:
- Dark base: `#0d2040`
- Two parallel track lines: `#00ffcc` at y offset 4px and y offset 12px within the 16px tile
- Track lines have animated "cargo" pixels moving along them: 2×2 pixel bright dots that scroll from left to right at different speeds
- Left-edge and right-edge of each `=` tile get a 1px bright cross-mark (track junction indicators)

**4. Elongated Mitochondria Organelle Shapes**
The `T` tiles in rows 18-21 (and rows 4-7 for decorative clusters) render as:
- NOT square pillars — elongated oval shapes (12×8px game pixels, horizontal orientation)
- Inner membrane folds visible: 2 darker lines inside the oval at y+2 and y+5
- Warm amber tint vs the cool cytoplasm: `#2a4020` outer, `#3a6030` inner, `#00ffcc` accent glow at tips
- Slight pulse animation (scale 0.02 per frame via sin wave) to suggest they're producing ATP

**5. Red Pulsing Boss Gate**
The `B` tile at row 2, column 13 (the position between the two organelle rooms):
- Renders as a full 16px-wide archway spanning the tile
- Two pillar sides, an arch top (quarter-circle pixels)
- Color: `#cc0000` (crimson) with animated glow: `#ff0000` at alpha 0-0.8 cycling every 60 frames
- "DANGER" implied by glow without needing text
- Skull or lysosome icon (optional) centered in arch: 6×6px

---

## Realm 2 — The Genome Forest

### Lore Brief
A vast forest where the trees are literally made of DNA double helices. The base pair sequences encode the history of life. Ben found this place while doing fieldwork and never left — he just started bringing sandwiches. The RNA River carries active transcription data downstream.

This realm teaches: DNA structure, gene sequencing, CRISPR, population genetics.

### Tone
Lush, green, mysterious. The forest is ancient but also actively working — this is a functional genome, not a museum. The canopy above is impenetrable dark; the clearings are warmly lit. There's always the gentle sound (imagine it) of the RNA River flowing.

### ASCII Map Reference
```
Rows 1-3: Dense canopy (T tiles dominate) with small clearing-gaps for nodes 1-2
Rows 4-8: Opening clearings with nodes 3-4, approach to RNA River, wooden bridge planks
Rows 9-11: RNA River (~ tiles) — the transition boundary
Row 12+: South forest, Ben NPC, nodes 5-9, scattered trees
```

### Tile Palette
| Tile | Color(s) | Notes |
|------|---------|-------|
| `.` floor | `#162a0a` base + `#1e3a0e` lighter spots | Irregular forest floor |
| `#` wall | `#0d1e05` | Dense tree bark, very dark |
| `T` DNA tree | `#1a4010` trunk + `#00ff44` canopy | Double helix trunk design |
| `~` RNA river | `#051a2a` + `#0044aa` animated | Flowing data stream |
| `=` bridge | `#8a5a20` planks + `#5a3a10` dark gaps | Wooden plank rendering |
| Clearings | `#223a0e` (lighter floor variant) | Distinct from deep forest floor |

### 5 Signature Environmental Elements

**1. DNA Double Helix Trees**
The `T` tiles render as dual-trunk trees with base-pair connections:
- Left trunk: 3×16px vertical column of dark green `#1a4010`
- Right trunk: Same, offset 8px right
- Cross-connections (base pairs): Every 4px of height, a 2×1px horizontal bar between trunks in alternating colors:
  - A-T pair: `#ff6644` (adenine-thymine, warm orange)
  - G-C pair: `#44aaff` (guanine-cytosine, cool blue)
- Pattern of A-T / G-C alternation follows: ATGCATGC per 8px height (biological approximation)
- Canopy at top: Irregular blob shape 14×6px in `#00ff44` with darker `#00aa22` interior

**2. Animated RNA River**
The `~` tiles at rows 9-11:
- Horizontal flowing data stream, NOT water
- Base color: `#051a2a`
- Animated "data packets": 3×2px rectangles moving left to right at 0.5 game pixels per frame
- Data packets alternate colors representing nucleotides: A=`#ff6644`, U=`#ffaa00`, G=`#44aaff`, C=`#44ff88`
- Multiple rows of packets at different y offsets, different speeds (0.3, 0.5, 0.7 gp/frame)
- River banks: Irregular pixel scatter in darker forest floor color at river edges

**3. Wooden Plank Bridge**
The `=` tiles at rows 7-8 (overlapping the bridge columns):
- Horizontal planks: 16×3px blocks in warm brown `#8a5a20`
- Dark gap between planks: 16×1px in `#3a1a00`
- Plank texture: Small lighter `#aa7a40` dots scattered on each plank (wood grain suggestion)
- Edge supports: 2×3px darker `#5a3a10` block at left and right ends of each plank
- Bridge overall width (columns 12-15 and columns 24-27 in the map) creates two bridge sections

**4. Dappled Light in Clearings**
Floor tiles in clearings (rows 4-8, gaps between `T` tiles) have a "light patch" effect:
- Every 3rd floor tile in a clearing has a slightly brighter floor color (`#2a4a14` vs `#162a0a`)
- Irregular shaped — not uniform grid — to suggest light filtering through canopy gaps
- Very subtle sine-wave pulse on these bright patches (period 90 frames, amplitude 20% brightness)

**5. Dense Canopy Ceiling Effect**
Rows 1-3's dense `T` tiles create a visual ceiling effect:
- Standard tree tiles here render without canopy blob (just trunks, no visible top)
- Instead, a full-width dark overlay is drawn at top of screen (semi-transparent `#0d1e05` at 60% alpha) when camera shows rows 1-3
- This creates the "inside the canopy" lighting oppression

---

## Realm 3 — The Neural Nebula

### Lore Brief
A neural network built at cosmic scale. The platforms are nodes. The bridges are axons. The void is... what happens when a network isn't connected. Alex built this space station in the void between neurons to do her research because "you can think more clearly when there's nothing." She brought 4 espresso machines.

This realm teaches: Statistics, classical ML, neural networks, transformers, foundation models.

### Tone
Cold, vast, beautiful, slightly terrifying. Purple-black void punctuated by warm platform lights. Every connection has purpose. Every void has consequence.

### ASCII Map Reference
```
Rows 1-4: Two small north platforms (nodes 1-2)
Rows 5-9: Synapse bridges connecting to mid platforms (nodes 3-4)
Rows 10-13: Central hub platform (node 5) with four bridge approaches
Row 14: Brief void (impassable), transition to terminal
Rows 15+: Terminal station floor, Alex NPC, nodes 6-9
```

### Tile Palette
| Tile | Color(s) | Notes |
|------|---------|-------|
| `.` platform | `#14083a` base + `#1e1050` highlight | Edge treatment |
| `#` solid wall | `#0e052a` | Outer boundary |
| `T` terminal pillar | `#2a1060` + `#aa44ff` top glow | Equipment/console shapes |
| `~` void | `#030008` + star points | Animated starfield |
| `=` synapse bridge | `#1a0840` + highlight | Tubular bridge rendering |
| `*` (if used) | `#aa44ff` + glow | Data core markers |

### 5 Signature Environmental Elements

**1. Animated Star-Field Void**
The `~` tiles render as deep space:
- Base: Near-black `#030008`
- 30-40 static star points (1×1 px white) distributed randomly in the void area
- Each star has a different twinkle period (random 40-120 frames): alpha oscillates 0.3 to 1.0
- Slow parallax: stars shift 0.05px per camera movement unit (extremely slow drift)
- Occasional streak: Every 200 frames, one star "streaks" (draws 3-4px horizontal trail) then returns to point

**2. Metallic-Edged Floating Platforms**
Platform floor tiles (`.` in the platform islands) have edge treatment:
- Check if the tile below is `~` (void) → draw lighter bottom edge pixel: `#4a2880`
- Check if tile above is `~` → draw darker top edge: `#0a0420`  
- Left/right void adjacency → same treatment on sides
- Platform corners (where two void sides meet) get a 1×1 slightly brighter corner pixel
- Effect: platforms look like they have a physical edge and exist in 3D space

**3. Tubular Synapse Bridge Rendering**
The `=` tiles in this realm:
- NOT planks — TUBES. Circular cross-section implied:
- Base: `#1a0840`
- Center horizontal stripe: `#3a1a80` (lighter, simulating top of tube lit from above)
- Left and right edges: `#0a0420` (darker, simulating tube underside shadow)
- The bridge "tube" is visually 8px wide with 4px of implied depth above/below
- Occasional animated "signal pulse": A 2×2px bright `#aa44ff` dot travels along the bridge over 30 frames, then disappears (action potential metaphor)

**4. Grid-Pattern Tech Floor at Terminal Station**
The terminal station floor (rows 15-26, the solid floor area where Alex works):
- Instead of plain floor tile, draws a grid pattern
- Grid lines: 1px dark lines every 8px (so two grid lines per 16px tile)
- Grid color: `#1a0840` for lines, `#14083a` for cells
- At grid intersections: 2×2px slightly brighter squares `#2a1060`
- Suggests high-tech floor panel layout

**5. Purple Ambient Drift Particles in Void**
Neural "signal" particles floating in the void between platforms:
- 15-20 particles, each a 2×2 game-pixel square of `#aa44ff` at 40% alpha
- Each particle has individual slow drift: random velocity (-0.1 to +0.1 gp/frame in each axis)
- Particles bounce when they would leave the void bounds (stay within `~` tiles)
- Glow trail: Each particle leaves 3 trailing positions at decreasing alpha (30%, 20%, 10%)

---

## Realm 4 — The Protein Cathedral

### Lore Brief
A Gothic cathedral that was never built by human hands — it grew. The pillars are alpha-helix protein strands that spiraled upward over millennia. The transepts are beta sheets that formed laterally. Henry arrived when the cathedral was half-built and completed it holographically. He serves as both architect and altar.

This realm teaches: Protein structure, AlphaFold, drug discovery, systems biology, multi-omics.

### Tone
Reverent, grand, golden. Unlike the other realms, this one feels OLD. Ancient. The biology here is sophisticated, evolved, refined over billions of years. Henry is the newest thing here — and he knows it.

### ASCII Map Reference
```
Rows 1-11: Twin nave wings (left cols 1-10, right cols 21-39) with pillar rows (T)
            Inner sanctum (cols 11-19) permanently walled off
Rows 6-7: Beta Sheet Transept bridges (=) crossing both naves
Rows 12-13: Grand Evoformer Aisle (=) — processional path spanning full width
Row 14: Henry NPC + altar
Rows 15-16: Altar special floor (* tiles)
Rows 17-26: Extended nave, nodes 7-9
```

### Tile Palette
| Tile | Color(s) | Notes |
|------|---------|-------|
| `.` stone floor | `#1e1438` + `#241848` | Dark violet stone |
| `#` cathedral wall | `#160f30` | Very dark, massive-feeling |
| `T` alpha-helix pillar | `#2a2050` + `#ffaa00` top glow | Spiral highlight pattern |
| `=` transept/aisle | `#0c0a1c` + `#ffaa00` tracks | Gold accent lines |
| `*` altar floor | `#1e1438` + `#ffaa00` diamond inlay | Sacred floor pattern |
| `#` inner sanctum | `#100826` | Darker than normal wall — forbidden |

### 5 Signature Environmental Elements

**1. Alpha-Helix Pillar Rendering**
The `T` tiles in nave columns:
- Vertical pillar: 6px wide, 16px tall column of `#2a2050`
- Spiral highlight: Alternating left/right 1px bright pixels (`#4a40a0`) winding up the column
  - At y=2: left side pixel at x=1
  - At y=4: right side pixel at x=4
  - At y=6: left side at x=1
  - (Pattern repeats — this suggests spiral protein helical structure)
- Top: 6×4px capital (pillar cap) in slightly lighter `#3a3060`, gold accent top line `#ffaa00`
- Bottom: 6×2px base in same color
- Subtle glow at top: `#ffaa00` at 20% alpha, radius 12px

**2. Woven Beta-Sheet Transept Bridge**
The `=` tiles at rows 6-7:
- NOT planks, NOT tubes — WOVEN FABRIC (protein sheet)
- Alternating light/dark pixel pattern (every other pixel): `#2a2050` / `#1a1040`
- This checkerboard-ish pattern simulates the beta-sheet hydrogen bond network
- Diagonal emphasis: every 4px, a slightly brighter diagonal line `#3a3070`
- Gold edge lines: `#ffaa00` along top and bottom edge of the bridge tile

**3. Gold Diamond-Inlaid Altar Floor**
The `*` tiles at rows 15-16:
- Base: Dark `#1e1438`
- Diamond grid: Lines of `#ffaa00` pixels forming diamond (rotated square) pattern every 8px
- At each diamond center: 2×2px solid `#ffaa00` square (gold inlay)
- Between diamonds: 1×1px `#aa7700` dot (tarnished gold, aged appearance)
- Animated: Very slow alpha pulse on gold elements (period 180 frames, amplitude 0.1) — subtle candle-flicker

**4. Holographic Henry Altar Interaction**
Henry at row 14 has special altar-specific rendering additions:
- Golden reflection on altar floor tiles: The `*` tiles within 3 tile-radius of Henry gain subtle `#ffaa00` tint at 10% alpha — his holographic light spills onto the gold floor
- Henry's orbiting particles at cathedral altar scale are slightly larger (4×4 game px instead of 3×3)
- Occasionally (every 120 frames), Henry's particles pause in formation — they form a protein secondary structure shape for 2 seconds before resuming orbit

**5. Forbidden Inner Sanctum Visual Treatment**
The `#` tiles in columns 11-19, rows 1-11 (the sealed inner sanctum):
- Render darker than normal walls: `#100826` (near black)
- Top edge of sanctum boundary shows faint gold carvings: thin `#ffaa00` pixel lines at row 1 (cols 11-19) with decorative notch pattern
- LEFT and RIGHT faces of sanctum walls (cols 11 and 19) have thin `#3a2060` border line — suggesting depth
- No glow, no accessibility, no visual feedback suggesting entry — it is simply sealed
- If player walks against it: NOTHING. No door sound, no reaction. The sanctum does not acknowledge you.
