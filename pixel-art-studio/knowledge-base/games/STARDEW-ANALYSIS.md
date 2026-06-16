# Stardew Valley — Pixel Art Deep Analysis
**BitBio Pixel Art Studio | Game Research Division**
*Developed by ConcernedApe (Eric Barone), 2016*

---

## Overview

Stardew Valley is the most commercially successful indie pixel art game of the 2010s, and one of the most carefully designed NPC systems in any game of its scale. For BitBio, Stardew is the primary reference for: NPC personality through visual design, overworld tile construction, UI design in pixel art contexts, and day/night color system implementation. The fact that one person designed every sprite, tile, and NPC is remarkable — and the consistency is a testament to the power of a unified art vision.

---

## 1. Overworld Tile Dimensions

### Core Grid System

- **Tile size:** 16x16 pixels (the fundamental unit of the game world)
- **Rendered size:** 16x16 at standard zoom; game upscales by 3x-4x at 4K
- **Map unit:** 1 tile = 1 walkable square (collision, pathing, and art all use the same grid)

### Tile Categories and Sizes

| Category | Pixel Size | Notes |
|----------|-----------|-------|
| Floor/ground tile | 16x16 | Standard |
| Wall tile | 16x16 | Stacks vertically for 3D illusion |
| "Large object" (tree, rock) | 16x32, 32x48 | Multi-tile objects |
| Building (exterior) | 48x80 to 80x128 | Drawn as single asset, not tiled |
| NPC sprite | 16x32 | Tall relative to tile size |
| Player sprite | 16x32 | Matches NPC proportion |
| Item icon (inventory) | 16x16 | Matches tile grid |

### The 16x16 Philosophy

Everything in Stardew Valley is designed to be a multiple of 16. This creates a visual harmony that the player perceives subconsciously as "neatness" — the world feels organized because all elements share a common unit.

**BitBio application:** BitBio currently uses a 2x2 game pixel system at S=3 (each "pixel" is 6x6 canvas pixels). This is consistent and good. The lesson is to maintain this discipline — never use odd-pixel-count elements that break the grid.

---

## 2. Character Sprite Sheets and Animation Structure

### NPC Sprite Sheet Layout

Every NPC in Stardew Valley follows an identical sprite sheet format:

```
Row 0: Walk cycle SOUTH (facing player) — 4 frames
Row 1: Walk cycle WEST — 4 frames
Row 2: Walk cycle EAST — 4 frames
Row 3: Walk cycle NORTH (facing away) — 4 frames
Row 4: Idle SOUTH (2 frames)
Row 5: Idle WEST (2 frames)
Row 6: Idle EAST (2 frames)
Row 7: Idle NORTH (2 frames)
```

Additional rows for:
- Sitting animation (2 frames)
- "Event" poses specific to each NPC's story scenes

### Walk Cycle Analysis

Stardew NPCs use a 4-frame walk cycle (not 8). This is deliberately simplified:
- Frame 1: Left foot contact
- Frame 2: Midstride
- Frame 3: Right foot contact
- Frame 4: Midstride (mirror)

**Why 4 frames works:** At 16x32 sprite size with top-down movement, a full 8-frame cycle would have limb positions so close together they'd be indistinguishable. 4 frames with clear left/right alternation reads perfectly at this scale.

**Frame timing:** Each frame held for 6-8 engine frames at 60fps = ~100-133ms per frame. At a standard walk pace, the player moves 2 tiles in the time of one 4-frame cycle.

### Animation Frame Duration Rules

| Animation Type | Frames | Hold | Total |
|---------------|--------|------|-------|
| Walk | 4 | 7 frames (117ms) | 467ms |
| Run (fishing pole cast) | 4 | 4 frames (67ms) | 267ms |
| Idle stand | 2 | 30 frames (500ms) | 1 second sway |
| Farming action (hoe) | 4 | 5 frames (83ms) | 333ms |

### Sprite Sheet Discipline

Every NPC sprite sheet is exactly the same dimensions. This means:
- Swapping character skins is trivial (just change the texture)
- The game code only needs to know ONE coordinate system for all NPCs
- New NPCs can be added by an artist who only knows the grid system — no programmer needed

**BitBio application:** Define a canonical sprite sheet layout for all BitBio characters. Current characters are drawn procedurally in TypeScript (via `gr()` calls) — the equivalent is to define a canonical frame order for all animation states per character.

---

## 3. NPC Design Philosophy — Readable Silhouettes and Color Coding

### The "One Look" Rule

Every Stardew Valley NPC can be identified from their silhouette at game zoom level. This is achieved through:

1. **Unique hair silhouette:** Every NPC has a distinct hairstyle visible from all 4 directions
2. **Color signature:** Each NPC "owns" a primary color that appears in their most prominent feature
3. **Height variation:** Short, medium, tall NPC proportions — Harvey is tall and slim, Willy is stocky

### Color-as-Personality System

ConcernedApe uses color to encode personality before players read a single line of dialogue:

| NPC | Primary Color | Personality Encoded |
|-----|--------------|---------------------|
| Penny | Orange-red | Warm, family-oriented |
| Abigail | Purple | Mysterious, unconventional |
| Haley | Blonde/pink | Surface-level bright, conceals depth |
| Emily | Blue-purple | Creative, spiritual |
| Leah | Green-brown | Nature-connected, artistic |
| Maru | Brown/orange | Practical, grounded (mixed heritage) |
| Sebastian | Black/grey | Introverted, alternative |
| Harvey | Brown/green | Professional, anxious (earth tones) |
| Sam | Yellow/white | Energetic, optimistic |
| Alex | Cyan/sporty | Athletic, direct |
| Elliott | Teal/brown | Artistic, romantic, pretentious |
| Shane | Blue/grey | Depressed, guarded (desaturated) |

**Lesson:** Color choice precedes personality design. Pick the hue that fits the character's core emotion, then build the design around that.

### BitBio NPC Color Coding Application

Applying this to BitBio's NPCs:

| BitBio NPC | Assigned Color | Rationale |
|-----------|---------------|-----------|
| Elliot (teacher) | Teal (#008899) — tie accent | Scientific, precise, slightly eccentric |
| Ben (lab partner) | Navy (#1a2a5a) — hoodie | Reliable, grounded, trustworthy |
| Alex (coder) | Cyan (#00ccee) — hair streak | Tech-forward, efficient, bright ideas |
| Henry (hologram) | Blue-white (#aaccff) — body glow | Ethereal, past-tense, melancholy-warm |

### Silhouette Test — Stardew Method

At 16x32 with a 4-frame walk cycle, the silhouette test is strict:
- Cover the screen with a grey filter at 70% opacity over an NPC
- The character's shape should still immediately identify who they are
- If two characters look similar through the filter — redesign one

**BitBio application:** Run this test on Elliot, Ben, Alex, and Henry as their sprites are finalized. Henry's translucency already creates a distinct silhouette. Alex's asymmetric hair streak is the differentiator. Ben's stockier build is the differentiator. Elliot's height advantage is the differentiator.

---

## 4. Day/Night Color Palette Cycling System

### How Stardew Implements Time-of-Day

Stardew Valley doesn't use dynamic lighting — it uses palette overlays and carefully designed transitions:

**The Overlay Method:**
1. All sprites and tiles are drawn normally
2. A full-screen colored rectangle is drawn on top with reduced opacity
3. The overlay color and opacity change with the time of day

| Time | Overlay Color | Overlay Opacity | Effect |
|------|--------------|-----------------|--------|
| 6am (Dawn) | `#ffaa44` (orange) | 40% | Warm sunrise |
| 9am (Morning) | None | 0% | Full daylight — no tint |
| 12pm (Noon) | `#ffffee` (pale yellow) | 10% | Slight warmth |
| 3pm (Afternoon) | None | 0% | Clear light |
| 6pm (Evening) | `#ffaa22` (amber) | 25% | Sunset |
| 8pm (Dusk) | `#661155` (deep purple) | 40% | Dusk |
| 10pm (Night) | `#000033` (dark blue) | 60% | Night |
| 2am (Late night) | `#000011` (near black) | 75% | Deep night |

### Lantern and Interior Lighting

When the player enters a building at night, the overlay lifts and interior lighting is implied through:
- Warmer wall tile colors on the sprite sheet (pre-baked lighting in the texture)
- Candle/lamp objects that emit a small warm-colored glow overlay (4x4 to 8x8 radial gradient)
- Window tiles that "glow" at night by showing a lit version of the window sprite

### Seasonal Color Variation

Beyond day/night, Stardew changes the entire overworld palette by season:

| Season | Grass Color | Tree Color | Sky | Mood |
|--------|------------|------------|-----|------|
| Spring | `#77cc55` (bright green) | `#55aa33` / pink blossoms | `#aaddff` | Fresh, hopeful |
| Summer | `#44aa22` (deep green) | `#336611` (dark) | `#88ccff` | Warm, full |
| Fall | `#cc8833` (amber) | `#aa5522` / orange | `#99aacc` | Melancholy, rich |
| Winter | `#e8f0ff` (pale blue-white) | `#aabbcc` (bare) | `#ccddee` | Quiet, cold |

The entire world palette shifts seasonally — this is baked into the tile designs, which have season-specific variants.

**BitBio application:** BitBio's 4 realms are somewhat analogous to seasons — each has a distinct color language. The day/night system could map to the current "energy level" of the simulation (morning = energetic, evening = sleepy cell). The overlay system is very implementable in BitBio's ctx-based renderer.

---

## 5. Environmental Storytelling Through Tile Placement

### The "Lived-In" Principle

Stardew's environments feel inhabited because tile placement follows rules that miply history:

**Randomized imperfections:**
- Rock formations are never perfectly rectangular — they have jagged edges
- Trees are never perfectly spaced — organic random distribution within zones
- Paths have occasional 1-tile gaps or branches that lead nowhere

**Object scatter rules:**
- Tools and objects are placed where a real person would leave them (near workbenches, not in the middle of rooms)
- Clutter increases in "messy character" homes (Sebastian), decreases in "organized character" homes (Harvey)
- Personal items reflect backstory (Elliott has a typewriter and empty wine bottles)

### Reading a Room — NPC Home Design

Every NPC home is designed to tell the player something about that character before dialogue begins:

| NPC | Home Tile Clues |
|-----|-----------------|
| Abigail | Purple quartz on shelves, gaming setup, flute in corner |
| Harvey | Medical books, anatomical posters, coffee machine |
| Elliott | Typewriter, wine bottle, dramatic view of sea |
| Penny | Worn furniture, textbooks (she tutors), garden outside |
| Maru | Workbench, robot parts, tools — she builds things |

**BitBio application:** Each realm in BitBio should tell stories through tile placement. Example placements:
- Realm 1 (Cytoplasm): scattered organelle models, a whiteboard with enzyme kinetics equations, coffee cup beside a microscope
- Realm 2 (DNA): gene sequencing printouts (decorative tiles), molecular model structures, a double helix sculpture
- Realm 3 (Neural): EEG printouts, synaptic diagram posters, neuron-shaped sculptures as decoration tiles
- Realm 4 (Protein): crystallography equipment sprites, protein structure models, lab notebook open to a protein sequence

### The Secret Area Pattern

Stardew regularly hides small rewards or lore in visually unintuitive places — pressing against what appears to be a solid wall reveals a passage; a cluster of trees has a gap only visible from a specific angle.

**Visual cue for hidden areas:**
- 1px offset in an otherwise perfectly regular tile grid
- A single anomalous tile in a uniform area
- A suspiciously "perfect" arrangement of objects (too neat = suspicious)

---

## 6. UI Design in Pixel Art Context

### Stardew's UI Philosophy

Stardew's UI is designed to feel like a physical object:
- Inventory boxes look like wooden crates or leather pouches
- Text appears on "paper" with slightly warm-tinted backgrounds
- Menus have wood-grain or stone-texture borders (implied by pixel patterns)

### Dialogue Box Design

The Stardew dialogue box is arguably the most imitated dialogue box in indie games:
- Brown wood-grain border (8px thick)
- Cream/parchment inner fill (`#fffde8` approximately)
- Dark brown text (`#3a1500`) — never pure black, warm ink feel
- Portrait of the speaking character: 64x64 pixels, positioned left
- Text wraps at approximately 30 characters per line
- Small arrow sprite at bottom-right indicates "press to continue"

### Portrait System

NPC portraits are a separate, higher-resolution art:
- **Size:** 64x64 pixels (4x the tile NPC sprite)
- **Variants:** Each NPC has 2-6 portrait expressions (neutral, happy, sad, shocked, angry, heart/love)
- **Expressions:** Achieved by changing eye shape (the minimum needed) + optional mouth change
- **Framing:** Circular or oval crop at game scale gives NPC portraits a "cameo" feel

**This teaches a key lesson:** Portrait art can be at a different resolution than sprite art. The in-world character is 16x32; the portrait is 64x64. BitBio could implement higher-resolution character portraits for dialogue without needing to change the in-world sprites.

### Item Tooltip Design

When hovering an item:
- Small box appears with 2px dark border
- Item name in large (relative) font
- Item description in smaller font
- Stats in accent color (`#4488ff` for positive, `#cc4444` for negative)
- Background tinted to item rarity (white = common, blue = rare, purple = epic)

**The color-coding of rarity is a UI design lesson:** Use background color, not just text, to convey hierarchy. BitBio's item/card system could use similar rarity-based background tinting.

---

## 7. Key Lessons for BitBio NPC Design (Elliot/Ben/Alex/Henry)

### Lesson 1: Give Each NPC One "Unforgettable" Design Element

Every memorable Stardew NPC has exactly one design element that players describe when they mention the character:
- Abigail: Purple hair and black outfit
- Harvey: The mustache
- Penny: Orange-red hair + overalls

For BitBio:
- Elliot: Rectangular glasses + teal tie (science color)
- Ben: Oversized navy hoodie (always in the hoodie)
- Alex: Asymmetric cyan hair streak
- Henry: Translucent, slightly glowing body (impossible to miss)

### Lesson 2: Height Variation Prevents "Same Person in Different Clothes" Problem

Stardew staggers NPC heights subtly (Harvey is visually tall, Willy is broad, Emily has a big hair silhouette). BitBio should follow this:
- Henry: Tallest (floating adds apparent height)
- Elliot: Second tallest (lanky professor)
- Ben: Medium height, wider build
- Alex: Shortest, compact

### Lesson 3: Idle Animations Should Match Personality

- Penny (homemaker): Slow, calm idle with occasional look toward children
- Sam (musician): Head bob, slight dance energy
- Abigail (gamer): Checks her bag, taps foot

For BitBio:
- Elliot: Thoughtful chin-stroke idle — the idle communicates "he's always thinking"
- Ben: Casual weight shift — communicates easy confidence
- Alex: Typing gesture even when not at a computer — habitual
- Henry: Floating bob with holographic flicker — the idle communicates "I'm not quite real"

### Lesson 4: Portrait Expressions Are More Important Than Idle Animations

Players see NPC dialogue portraits thousands of times. The quality investment should be: portrait expressions > walk cycle > idle animation.

For BitBio: prioritize creating 3-4 portrait expression variants for each NPC (neutral, happy, surprised, concerned) before polishing their walk cycles.

### Lesson 5: Color-Code Realm Affinity

In Stardew, characters who belong to specific zones (forest, mines, beach) have color schemes that match their environment. BitBio NPCs who appear in specific realms should have color accents that match:
- Realm 1 colors (teal/green): Elliot's tie teal
- Realm 2 colors (purple/teal): Alex's cyan streak
- Realm 3 colors (electric blue/gold): Henry's glow could pulse with Realm 3 star colors when in that realm
- Realm 4 colors (crystalline blue/white): could shift Henry's glow to warmer tones

### Lesson 6: The "Sleep Schedule" Creates World Believability

Stardew NPCs follow daily schedules that make the world feel alive — you find Harvey in his clinic in the morning, the saloon at night. BitBio doesn't have real-time schedules, but in cutscenes and dialogue, NPCs should reference where they "should be" based on the in-game time/context. This creates character depth at zero extra art cost.

### Lesson 7: Inventory UI Should Teach Game Mechanics

Stardew's inventory design communicates game rules through its visual design:
- Item stacks show the count right on the icon
- Equipment slots have silhouette icons of what goes there
- Energy bar uses color (green → yellow → red) to communicate urgency

For BitBio's science card/item system: make each item's type (enzyme, molecule, concept) immediately readable from the icon without reading the text. Use silhouette + color.

---

*Analysis Version 1.0 | BitBio Game Research Division | 2026*
*Source game: Stardew Valley (2016) — ConcernedApe*
*Cross-reference: MASTER-KNOWLEDGE.json, DESIGN-RULES.md Rules 1,3,4,5,12, ANIMATION-ENCYCLOPEDIA.md Section 6*
