# Celeste — Pixel Art Deep Analysis
**BitBio Pixel Art Studio | Game Research Division**
*Developed by Maddy Thorson & Noel Berry (Extremely OK Games), 2018*

---

## Overview

Celeste is considered one of the most technically refined pixel art platformers of the modern era. Its art — designed by Pedro Medeiros — demonstrates that "small resolution" does not mean "low quality." Every pixel is intentional. For BitBio, Celeste is the benchmark for what emotionally resonant, mechanically integrated pixel art looks like.

---

## 1. Sprite Dimensions and Resolution

### Madeline (Player Character)

- **Canvas sprite sheet resolution:** 16x16 pixels per frame
- **Effective rendered size at 1x:** 16x16 pixels
- **Game renders at:** 320x180 internal resolution, scaled up to display size (pixel-perfect scaling)
- **Visual pixel count for body:** Approximately 60-70 solid pixels (the rest is transparent)
- **Head-to-body ratio:** Head is roughly 6x6 pixels, body 10x10 — 37.5% head ratio
- **Hair pixel count:** 8-12 pixels per frame, varies by state (this is intentional — hair is a dynamic system)

### Supporting Characters (Theo, etc.)

- **Same 16x16 frame grid** as Madeline — this enforces visual consistency
- **Badeline (Dark reflection):** Identical Madeline sprite with recolored palette — demonstrates efficient palette-swap variant design

### Enemy/Hazard Objects

- **Spikes:** 8x8 within a 16x16 tile — fine detail in a small area
- **Jellyfish:** 16x16 sprite, animated with 6 frames
- **Puffer fish:** 16x32 when expanded — the only character that breaks standard sprite height

---

## 2. Color Palette and Hue-Shifting Strategy

### Madeline's Core Palette (Idle, Normal Hair = Red)

| Role | Hex | Notes |
|------|-----|-------|
| Skin base | `#f5c5a3` | Warm peach |
| Skin shadow | `#c99060` | Hue shifted orange-brown (not just darkened) |
| Hair red | `#cc3333` | Saturated red |
| Hair highlight | `#e05555` | Lighter, slightly more orange |
| Shirt blue | `#3355aa` | Cool blue |
| Shirt shadow | `#223377` | Hue shifts toward indigo (cooler) |
| Skin outline | `#5a2800` | Dark brown, NOT black |
| Clothing outline | `#0a0a2a` | Near-black with blue tint |
| Eye | `#2a1a3a` | Deep purple-black |

**Total palette:** 9 colors for Madeline (well within the 8-12 range that reads well at this size).

### Hair Color System (Mechanically Meaningful Palette)

Celeste's most famous pixel art innovation: Madeline's hair color communicates stamina state directly.

| Hair Color | Meaning | Hex (approx) |
|------------|---------|--------------|
| Red | Normal (1 dash available) | `#cc3333` |
| Blue | No dashes (0 remaining) | `#4488cc` |
| Pink/Magenta | 2 dashes (crystal heart) | `#dd44aa` |
| Golden | Farewell chapter variant | `#ddaa00` |

**BitBio lesson:** Color as UI. Status information encoded in the sprite itself, reducing the need for separate HUD elements. Consider: Enzyme's eye color changes with the player's science knowledge level.

### Environmental Palette — Zone-by-Zone Hue Shift Strategy

Celeste uses dramatic palette shifts between chapters that maintain internal consistency:

| Chapter | Primary | Shadow | Accent | Mood |
|---------|---------|--------|--------|------|
| 1: Forsaken City | Blue-grey (#8899aa) | Dark purple (#445566) | Red (#cc3333) | Cold arrival |
| 2: Old Site | Warm grey (#aaaaaa) | Dark teal (#224455) | Amber (#ddaa44) | Abandoned warmth |
| 3: Celestial Resort | Teal (#44aaaa) | Deep green (#225544) | Pink (#ee8899) | Faded luxury |
| 4: Golden Ridge | Gold (#ddcc66) | Deep orange (#885522) | White (#f0f0f0) | Dawn achievement |
| 5: Mirror Temple | Dark purple (#552277) | Black (#0a0a0a) | Red (#dd2222) | Dread |
| 6: Reflection | Silver (#ccddee) | Medium blue (#667788) | Pink-white (#eeccdd) | Clarity |
| 7: Summit | White (#f0f0f0) | Light blue (#aabbcc) | Gold (#ddcc44) | Triumph |

**Key observation:** Each chapter shifts the ENTIRE color temperature, not just one color. This prevents "palette fatigue" and creates instant scene recognition.

---

## 3. Animation Frame Counts — Key Animations

### Madeline Walk Cycle
- **Frame count:** 8 frames
- **Frame duration:** 80-100ms per frame (game-speed dependent)
- **Total cycle:** ~700ms
- **Notable:** The walk cycle uses only 6 "distinct" frames — frames 5-8 are mirrored versions of 1-4

### Madeline Run (Fast Walk)
- **Frame count:** 6 frames
- **Frame duration:** 60ms per frame
- **Notable:** Arms swing wider, body leans forward 1px, hair follows 1 frame behind

### Madeline Dash
- **Frame count:** 6 frames total
  - Anticipation: 1 frame
  - Launch: 1 frame (body stretched in dash direction)
  - Mid-dash: 2 frames (blur/afterimage frames)
  - Landing: 2 frames (deceleration)
- **Total duration:** ~150ms
- **Hair:** During dash, hair trails in opposite direction of travel, color changes during dash if using a crystal heart

### Madeline Climb
- **Frame count:** 4 frames (2 up, 2 pull)
- **Distinctive element:** One hand always higher than the other, alternating
- **Head:** Tilts toward the wall being climbed

### Madeline Idle
- **Frame count:** Approximately 10 frames
- **Includes:** Breathing bob (±1px), blink (2 frames), occasional hair flutter (2 frames)
- **Period:** ~2 second loop with random blink timing

### Death Animation
- **Frame count:** 6-8 frames
- **What makes it iconic:**
  1. **Frame 1:** Madeline's sprite suddenly freezes (1 frame hold)
  2. **Frames 2-3:** Body explodes into 8-12 small pixel fragments, all in Madeline's hair color
  3. **Frames 4-6:** Fragments scatter outward along preset vectors (radial burst)
  4. **Frames 7-8:** Fragments fade (alpha decreasing) while continuing to travel
  5. **Sound + visual lock:** Screen briefly freezes for 2 frames before the burst — this "micro-pause" is what makes death feel impactful rather than cheap
- **No blood, no pain expression** — just pure geometric dissolution. It's both painless and beautiful.
- **BitBio application:** Boss defeat animation should use a similar "freeze → burst → scatter" pattern. Enemy defeat can use a smaller 4-particle version.

---

## 4. Environmental Tile Design Philosophy

### Tile Size and Grid
- **Tile size:** 8x8 pixels (fundamental unit)
- **Rooms:** Built from 8x8 tile grids
- **Note:** Despite 8x8 tiles, Celeste's detail level within each tile is extremely high — every 8x8 tile has 3-4 distinct values (light, mid, dark, accent)

### The "3 Layer" Environmental System
Every Celeste environment uses exactly 3 visual layers:

1. **Background (BG):** Distant paralax backgrounds — lowest detail, most muted palette
2. **Middleground (tiles):** The actual collision geometry — medium detail, chapter palette
3. **Foreground decoration:** Overlaid decorative tiles with no collision — highest detail, accent colors

**BitBio application:** All 4 realms should use this 3-layer system. Currently BitBio renders BG and tiles but lacks a separate foreground decoration layer. Adding one would significantly improve depth perception.

### Tile Variation Rule
Celeste uses approximately 3-5 variants of each tile type:
- Standard tile
- Corner tile (convex and concave)
- Edge tile (N, S, E, W facing)
- "Dressing" variants with decoration (cracks, moss, etc.)

This prevents the "repeating wallpaper" effect. BitBio currently has 1-2 variants per tile type — expanding to 3-4 is the next quality jump.

### Spike Tile Design
Spikes demonstrate Celeste's design philosophy perfectly:
- Shape reads instantly at 8x8 (sharp triangle)
- Red/orange color against dark tile background — maximum contrast
- No ambiguity: spikes look exactly as dangerous as they are
- They don't animate (static = reliable = trustworthy as a hazard)

---

## 5. The Death Animation — Expanded Analysis

*(See Section 3 for frame counts. This section analyzes the emotional and design function.)*

The death animation works because of three simultaneous decisions:

**1. The Color Echo:** Fragments are the same color as Madeline's current hair state. When your hair is blue (no dashes), you die in blue. When you've powered up to pink (2 dashes), you die in pink. The fragments are a visual echo of your current power state. This is storytelling through particle color.

**2. The Mercy Frame:** A single 33ms freeze frame before the burst gives the player's brain just enough time to register "I died" before the animation proceeds. Without this, deaths feel imperceptible. With it, each death registers as a discrete event.

**3. The Respawn Contrast:** After the death burst, the screen instantly cuts to the respawn point and Madeline reappears mid-air with full normal coloring. The contrast between the death burst (fragments) and respawn (intact sprite) is jarring in a satisfying way — you died, but you're immediately whole again.

**For BitBio boss battles:** When the player loses a heart, a smaller version of this pattern — player sprite freezes 1 frame, brief fragment burst (3-4 pixels in white/teal), instant recovery — would convey "that hurt" without being punishing visually.

---

## 6. Parallax Background System

### How It Works

Celeste uses between 3-5 parallax layers per chapter:

| Layer | Parallax Speed | Content | Detail Level |
|-------|---------------|---------|--------------|
| Layer 1 (farthest) | 5% of camera speed | Stars, solid color, fog | 1-2 colors |
| Layer 2 | 15% | Mountain silhouettes, clouds | 2-3 colors |
| Layer 3 | 30% | Distant architecture/landscape | 3-4 colors |
| Layer 4 | 60% | Near background elements | 4-5 colors |
| Layer 5 (closest) | 90% | Foreground decorations | 5-6 colors |

The player/tiles move at 100% (no parallax).

### Color Depth Rules in Parallax
Farther layers use more muted, less saturated versions of the chapter palette. This simulates atmospheric depth — distant objects lose saturation in real atmospheric perspective.

**Implementation rule:** For each parallax step away from camera, reduce saturation by 20% and move the hue 5-10 degrees toward the background color.

**BitBio application:** The star-twinkle and synapse arc backgrounds in Realm 3 would benefit from 2-3 parallax layers. Currently realms have a flat BG. Even a single parallax layer at 20% speed would add significant depth.

---

## 7. Accessibility in Visual Design (Assist Mode)

Celeste's Assist Mode doesn't just change difficulty numbers — it changes the visual design:

### Visual Accessibility Features

**Infinite dashes visual indicator:**
- When assist mode gives infinite dashes, Madeline's hair is a gold color not normally achievable
- Players immediately understand "this is a modified state" from the hair color alone

**Invincibility visual:**
- Player sprite pulses with a white aura (1px glow around sprite, 8-frame pulse)
- This doesn't obscure the sprite — it's additive glow, not a box around it
- Makes the player feel "protected" visually, not just mechanically

**Slow motion:**
- Celeste's entire visual animation system slows proportionally
- Because animations are driven by game frames (not wall clock time), assist mode slowdown naturally scales all animations
- The art direction decision: slow motion makes animations look MORE fluid, not less — this was embraced rather than hidden

### Text and UI Accessibility
- All tutorial text appears in high-contrast white boxes
- Dialogue uses large (by pixel art standards) font with 2px letter spacing
- Critical information (dash count) is always visible in Madeline's hair — no HUD required for core mechanic tracking

---

## 8. Key Lessons for BitBio

### Lesson 1: The Mechanic-Art Bond
Celeste's most powerful design insight is that visual design and game mechanics should be one system. Madeline's hair color IS the stamina meter. For BitBio: can science concepts be embedded in the visual design itself? Example: Enzyme's color could shift to indicate how many science points the player has collected this session.

### Lesson 2: Death Should Feel Satisfying
The death animation is beautiful. Players who die 1000+ times in Celeste don't dread dying — they've seen the death animation become almost meditative. Make BitBio's heart-loss animation feel satisfying and clear, not punishing or ugly.

### Lesson 3: 8-Color Discipline
Celeste proves that limiting Madeline to ~9 colors creates a more readable, more iconic sprite than using 20. Every color earns its place. Apply this to BitBio's NPCs — if a color isn't communicating something specific, remove it.

### Lesson 4: Tile Variation Eliminates "Wallpaper"
Three to five tile variants of each surface type, combined with placement logic that prevents obvious repetition, is what separates Celeste's environments from generic RPG Maker maps. BitBio should expand from 1-2 variants to 3-4 variants for all primary tiles.

### Lesson 5: The 3-Layer Environment
BG / Tiles / Foreground decoration is a simple, powerful system. Adding a foreground decoration layer to BitBio's renderer would allow "detail objects" (scattered lab equipment, petri dishes, DNA fragments) that don't affect collision but greatly improve environmental storytelling.

### Lesson 6: Sound Sync Enhances Animation
Celeste's audio design is calibrated to sync with animation frames. The "dash whoosh" begins 1 frame before the visual dash starts (predictive audio). For BitBio's science battle sounds, play audio cues slightly before visual effects for maximum responsiveness feel.

### Lesson 7: Parallax Depth is Almost Free
A single additional parallax layer (at 20-30% camera scroll speed) costs very little rendering time but significantly increases perceived world depth. BitBio's realms should add one background-decoration layer at 25% parallax.

---

*Analysis Version 1.0 | BitBio Game Research Division | 2026*
*Source game: Celeste (2018) — Extremely OK Games*
*Cross-reference: MASTER-KNOWLEDGE.json, ANIMATION-ENCYCLOPEDIA.md, DESIGN-RULES.md Rules 1,2,8,12*
