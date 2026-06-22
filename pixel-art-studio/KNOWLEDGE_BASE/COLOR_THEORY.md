# Color Theory — Pixel Art Knowledge Base

---

## 1. HSB vs RGB for Palette Building

### Why Not RGB for Palette Design
RGB (Red, Green, Blue) channel values don't correspond to how humans perceive color relationships. Darkening a color in RGB means subtracting equal amounts from all three channels — this produces gray, muddy shadows with no hue character.

**Example of RGB failure:**
- Skin highlight: `#f0b080`
- RGB darkened: `#b08040` — brownish, muddy, no depth

### HSB (Hue, Saturation, Brightness) — The Right Tool
HSB maps directly to human color perception:
- **Hue (H):** The "name" of the color (red=0°, yellow=60°, green=120°, cyan=180°, blue=240°, magenta=300°)
- **Saturation (S):** Color richness (0% = gray, 100% = pure color)
- **Brightness (B):** Lightness (0% = black, 100% = fully bright)

**To darken a pixel art color properly:**
- Decrease B by 15-25%
- Shift H by 10-20° toward cool (blue-purple) for shadows
- Increase S by 5-10% for mid-tones (shadows are more saturated than highlights in nature)

---

## 2. Hue Shifting Technique

### The Fundamental Insight
Natural light doesn't simply dim as surfaces go darker — it also changes HUE. Highlights shift toward warm (yellow/orange for sunlight, cyan for skylight), shadows shift toward cool (blue, purple).

### Warm Light Hue Shift (Standard Daytime)
```
Highlight:  Hue +20° warmer, Sat -10%, Bright +20%
Mid-tone:   Base color (no shift)
Shadow:     Hue -20° cooler (toward blue/purple), Sat +10%, Bright -25%
Deep shadow: Hue -40° cooler, Sat +15%, Bright -50%
```

### Cool Light Hue Shift (Night / Space / Neural Nebula)
```
Highlight:  Hue toward cyan (+/-120° from base), Sat -5%, Bright +15%
Mid-tone:   Base color (slightly desaturated from normal)
Shadow:     Hue toward deep blue/indigo, Sat +5%, Bright -30%
Deep shadow: Near black with strong blue/purple tint
```

### Bioluminescence (BitBio-specific)
Biology glows! Bioluminescence is typically blue-green or cyan-green. When an element in BitBio glows (nodes, boss attacks, Enzyme's eyes), apply:
```
Core glow:        Pure saturated cyan (#00ffcc) or lime (#00ff44)
Inner glow ring:  Same hue, 60% brightness
Outer glow ring:  Same hue, 30% brightness, Sat -20%
Ambient spill:    Add 10-15% of glow color to nearby surface mid-tones
```

---

## 3. Value Ramp Construction (5-7 Steps)

A value ramp is the complete set of colors for one "material" from darkest shadow to brightest highlight.

### 5-Step Ramp (Standard for BitBio NPCs)
```
Step 1 (Deep Shadow): Darkest value, most saturated, most hue-shifted cool
Step 2 (Shadow):      35% brightness, hue shifted -15°
Step 3 (Mid-tone):    Base color — what you think of as "the color"
Step 4 (Highlight):   65% brightness, hue shifted +10° warm
Step 5 (Bright High): Brightest, near-white with hue tint, use sparingly
```

### Example: Elliot's Lab Coat (White with Blue Undertone)
```
Step 1 Deep Shadow:  #1a2030 (near-navy, for deepest coat folds)
Step 2 Shadow:       #4a5a7a (blue-gray)
Step 3 Mid-tone:     #c0ccdc (cool light gray — "white" coat in shadow)
Step 4 Highlight:    #e8eef8 (near white, blue tint)
Step 5 Bright High:  #ffffff (pure white, only at brightest specular point)
```

### Example: Realm 1 Floor (Cytoplasm Teal)
```
Step 1 Deep Shadow:  #061520
Step 2 Shadow:       #0d2535
Step 3 Mid-tone:     #1a3a44 (from worldMaps.ts palette)
Step 4 Highlight:    #2a5060
Step 5 Bright High:  #00ffcc (accent glow only)
```

### When to Use 7-Step Ramps
7-step ramps are for:
- Boss sprites (higher detail, more surface variation)
- Large environment elements (floors, walls at close range)
- Dialogue portrait close-ups

Standard overworld sprites at 32×32 game pixels don't have enough surface area to visually distinguish 7 steps — 4-5 is optimal.

---

## 4. Contrast Management in Small Sprites

### The Michelangelo Rule for Pixels
Every pixel must justify its contrast relationship with every adjacent pixel. Two adjacent pixels of nearly identical color are a wasted pixel. Either make them the same (merge), or make them distinct enough to carry visual information (edge, surface boundary, texture).

### Contrast Thresholds
- **Same surface:** Use at most 2-3 adjacent colors from the same ramp
- **Different surfaces:** At least one full value step of separation at the boundary
- **Outline:** Always the darkest non-background color in the sprite
- **Highlight specular:** At least 40% brightness higher than surrounding mid-tone

### Light Direction Consistency
All characters and environments in BitBio should follow a consistent light source: **top-left origin**. This means:
- Top surfaces: highlighted
- Left surfaces: highlighted
- Bottom surfaces: shadowed
- Right surfaces: shadowed

This rule applies even when the in-game environment doesn't show an explicit light source. It's a convention that creates visual coherence.

**Exception: Realm 3 (Neural Nebula).** The void environment has no natural light source. Use flat/ambient lighting with subtle point-light glow from each synapse node — top-right dominant, since the main hub platform is at the upper-right of most areas.

---

## 5. Atmospheric Perspective

### Classical Atmospheric Perspective (Outdoor Scenes)
Distant objects:
1. **Shift toward sky color:** Objects in the distance pick up the blue/gray of the atmosphere
2. **Desaturate:** Colors become less vivid with distance
3. **Lighten:** Value converges toward a light mid-gray at the horizon

### Pixel Art Atmospheric Perspective
BitBio uses parallax layers in the landing page scene. The rules:
- **Layer 1 (far mountains):** Desaturate 60%, shift 40% toward sky hue
- **Layer 2 (mid trees):** Desaturate 30%, shift 20% toward sky hue
- **Layer 3 (near hills):** Full saturation, slight desaturation only
- **Layer 4 (foreground):** Full saturation + slightly darkened (under foreground shadow)

**Implementation in Canvas:** Each layer uses colors pulled from the appropriate distance band of the realm's palette. Do not just add alpha — recolor the elements with the shifted palette.

---

## 6. Palette Constraint Techniques

### Limited Palette
Define a fixed set of colors for the entire game or realm. Every sprite must choose from this set.

**BitBio Approach (Realm-tinted Palettes):**
Each realm has a "palette bias" — a set of environmental colors. NPC and player sprite colors can use any values, but their outlines and shadow colors should subtly pick up the realm's environmental hue.

| Realm | Floor | Wall | Accent | Sky |
|-------|-------|------|--------|-----|
| 1 Cytoplasm | #1a3a44 | #0f2530 | #00ffcc | #020609 |
| 2 Genome Forest | #162a0a | #0d1e05 | #00ff44 | #020602 |
| 3 Neural Nebula | #14083a | #0e052a | #aa44ff | #030008 |
| 4 Protein Cathedral | #1e1438 | #160f30 | #ffaa00 | #040210 |

### Palette Swapping
The same sprite base with different color sets = different characters/enemies. Key for boss variants (Phase 1, Phase 2 same sprite, different palette).

**BitBio LYSO boss palette swaps:**
- Phase 1: Green acid theme (#00aa44 dominant)
- Phase 2: Orange damage mode (#ff6600 dominant)
- Phase 3: Red rage mode (#ff0000 dominant, rapid HSB cycling)

### Indexed Color Systems
Traditional game sprites use indexed color — a table of 16 or 256 colors, with each pixel storing an index. Canvas API draws direct RGBA, so BitBio doesn't use true indexed color. However, maintaining a logical index (predefined named color constants per character) achieves the same workflow benefits.

---

## 7. How Reference Games Use Color

### Undertale — "Monochrome Plus Accent"
- Core palette: Near-black background, white/near-white characters
- Rule: Only ONE high-saturation color per character (Muffet = purple, Mettaton = pink/red, Undyne = cyan-blue)
- Effect: Characters pop extremely well against the desaturated backgrounds because they own their color
- **Lesson:** In a world of desaturated colors, one saturated element dominates. Use this for emphasis.

### OMORI — "Trauma Palette"
- Dream White Space: Pure white (#ffffff), pure black (#000000), occasional blue-gray
- Dream World (colorful): Pastel, limited palette — the cheerfulness is unsettling when you know the truth
- Horror Sequences: White, black, and ONE red (#cc0000 equivalent). Red = blood = Basil = truth.
- **Lesson:** Color restriction as narrative tool. Red in OMORI carries all its emotional weight because NO OTHER RED EXISTS in the game until the horror sequences.

### Pokémon Black/White — "Saturated Primary Joy"
- High saturation (S: 70-90%) for all Pokémon
- Primary and secondary colors dominate — bold, readable against any background
- Trainer sprites use slightly less saturation (they're supporting characters) to not compete with Pokémon
- **Lesson:** Saturation hierarchy. Lead characters (Pokémon) > supporting characters (Trainers). Apply to BitBio: realms' boss sprites > NPC sprites > floor/wall tiles.

### Chrono Trigger — "16-Color Masterclass"
- Every character uses 16 colors exactly, with warm yellow-orange highlights (Toriyama's manga style)
- Shadows are blue-purple even on warm characters (hue shift applied with only 16 colors)
- Multiple light sources communicated through clever value placement, not additional colors
- **Lesson:** You can suggest two light sources with just 16 colors if one surface reads from each source. No new colors needed.

### Earthbound — "Warm Uncanny"
- Pastel-bright colors for "normal" things — grass is too green, skin is too pink
- Slightly off-normal saturation choices create the "something is wrong here" feeling
- Enemy sprites are aggressively abstract: taxi cabs become enemies, household items attack
- **Lesson:** Slightly wrong color (oversaturation of expected colors) creates unease without horror. Good for establishing that a world is strange before the weirdness is explicit.

### Stardew Valley — "Farm-to-Table Palette"
- Warm, earthy browns and greens for most environment tiles
- Seasonal palette swaps: same tile geometry, different color sets for Spring/Summer/Fall/Winter
- Character colors are deliberately not too bright — they don't compete with crops and items
- **Lesson:** Environment palette and character palette should be designed to complement, not compete. Bright item pickup (gold/yellow) stands out because everything else is earth-tone.

### Celeste — "4-Color Chapter Mastery"
- Each chapter uses exactly 4 colors for all environment elements (+ black outline)
- Chapter 1 (Forsaken City): Gray, dark blue-gray, medium gray, white
- Chapter 2 (Old Site): Pink, lavender, dark purple, cream
- Chapter 6 (Reflection): Deep teal, slate, cream, gold highlight
- **Lesson:** The 4-color per-chapter rule forces each chapter to have absolute visual identity. You know EXACTLY where you are in the game from the color palette alone.

---

## 8. Bioluminescence Effects for BitBio

Bioluminescence is the core visual language of BitBio — living things glow. Every interactive element (nodes, NPCs when speaking, Enzyme's eyes) should have a glow component.

### Glow Implementation in Canvas 2D

```javascript
// In BitBio's PixelWorldEngine drawTile / drawNode:
function drawGlow(ctx, cx, cy, radius, color, intensity) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, color + Math.round(intensity * 255).toString(16).padStart(2,'0'));
  grad.addColorStop(0.4, color + Math.round(intensity * 0.6 * 255).toString(16).padStart(2,'0'));
  grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
}
```

### Realm-Specific Glow Colors
| Realm | Node Glow | NPC Glow | Boss Attack Glow |
|-------|-----------|----------|-----------------|
| 1 Cytoplasm | #00ffcc (cyan-teal) | #44ffaa | #ff4400 (acid) |
| 2 Genome Forest | #00ff44 (lime) | #66ff88 | #ff00ff (gene error) |
| 3 Neural Nebula | #aa44ff (purple) | #cc88ff | #ffffff (overload) |
| 4 Protein Cathedral | #ffaa00 (amber) | #ffcc44 | #ff6666 (misfolding) |

### Pulsing Glow Animation
Use a sin wave over time for natural organic pulsing:
```javascript
const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7; // oscillates 0.4 to 1.0
const glowRadius = BASE_RADIUS * pulse;
const glowAlpha = 0.6 * pulse;
```

### Glow Stacking Rule
Never add more than 2 overlapping glow regions at any point on screen — the additive blending creates overblown white rather than color. Test all glow interactions.
