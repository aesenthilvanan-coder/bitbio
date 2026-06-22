# BitBio Character Design Specifications

All characters are drawn using Canvas 2D API (`fillRect` calls). No image files.
All sprite bounding boxes: 32 game pixels wide × 42 game pixels tall.
Canvas footprint at SCALE=3: 96 × 126 canvas pixels.

---

## Elliot — Lead Scientist, Realm 1

### Personality → Visual Language
Elliot is brilliant and nerdy, anxious and lovable. He's been living in the Cytoplasm so long he half-identifies as an organelle. Visual language must communicate: scientific rigor + nervous energy + warmth.

### Design Spec

**Head (rows 0-11 game px):**
- Shape: Round, slightly oversized (12×12 game pixels)
- Skin tone: `#f4c08a` (warm tan)
- Hair: Dark brown (`#2a1a0a`), curly. Two hair poofs jutting upward-left and upward-right from crown, each 3×3px. Additional curl detail on sides.
- Glasses: 2 rectangular lens shapes (3×2 game pixels each), cyan (`#00ccdd`), with connecting nosebridge (1×1 center). Slightly too large for his face — implies he's always been bookish.
- Eyes: Behind glasses, 2×2 pixel dark pupils, small white highlight 1×1 in upper-right of each eye
- Eyebrows: 1-pixel lines above glasses, usually slightly worried (slightly angled upward toward center)
- Mouth: Small, 2-pixel smile at rest. Can become 'O' shape (surprise) or thin line (concerned).

**Body (rows 12-34 game px):**
- Lab coat: White/light blue-gray (`#d8e0f0`), covers full torso width (16 pixels wide)
- Coat lapels: 2-pixel triangle of white on chest center, V-shape
- Chest pocket: 4×3 pixel rectangle on left breast, with 1-pixel blue pen visible above pocket top
- Shirt underneath: Pale yellow (`#f8f0c8`) visible at neck V and below coat hem
- Belt: 2-pixel dark line at waist (`#4a3020`), 3×2 buckle center

**Arms (rows 14-32 game px):**
- Width: 4 game pixels each
- Lab coat color (same as torso)
- Hands: 4×3 pixel mittten-shape, skin tone
- Right arm often at rest (hanging down)
- Left arm raised to chin in "thinking pose" for idle animation

**Legs and feet (rows 34-42 game px):**
- Pants: Gray-blue (`#6a7888`), 6 pixels wide each leg
- Notable feature: LEFT sock is RED (`#cc2200`), RIGHT sock is YELLOW (`#ddcc00`) — mismatched socks visible at ankle above shoes
- Shoes: Dark gray (`#2a2a36`), 5×3 pixel blocks

### Color Palette (max 16 colors)
```
#f4c08a  skin
#c88040  skin shadow
#2a1a0a  hair dark
#5a3a18  hair mid
#d8e0f0  lab coat
#a0aac0  lab coat shadow
#00ccdd  glasses
#f8f0c8  shirt
#f0e870  shirt highlight
#6a7888  pants
#4a5868  pants shadow
#2a2a36  shoes
#cc2200  left sock (red)
#ddcc00  right sock (yellow)
#0044aa  pen
#f0f8ff  coat highlight
```

### Emotion States (for dialogue portraits)
1. **Neutral:** Round eyes, slight upturn mouth, glasses centered
2. **Excited:** Star-shaped eyes (`*` style), open mouth smile, hair poofs flared out +1px each side
3. **Embarrassed:** Closed arc eyes (˘ shape), small mouth, visible blush pixels on cheeks (pink `#ffaaaa`)
4. **Worried:** Eyes wide (circles larger), mouth thin line, sweat drop pixel on temple
5. **Proud:** Eyes closed in satisfaction (^_^ form), wide smile

### Animation States
| State | Description | Key Visual Change |
|-------|-------------|-------------------|
| **Idle** | Head bobs 1px every 40 frames. Left arm sways at chin. | Subtle breathing motion |
| **Walk** | 8-frame walk cycle, front + side + back views. Lab coat hem slightly oscillates. | Coat hem +/-1px, legs alternate |
| **Talk** | Mouth opens and closes (2-frame loop). Head tilts 1px toward player. | Jaw toggle |
| **Surprised** | Body jumps 2px up. Eyes widen. Hair poofs expand +1px. | Quick vertical offset |
| **Celebrate** | Both arms raise. Head tilts back. Small star particles emit. | Arms up, joy particles |
| **React (hurt)** | Body flickers visible/invisible 6 times over 12 frames. Arm raises defensively. | Alpha flicker |

---

## Ben — Genomics Researcher, Realm 2

### Personality → Visual Language
Ben is relaxed, always eating, genuinely enthusiastic about genomics in a laid-back way. He never seems stressed even when sequencing 300GB files. Visual language: warmth, informality, constant food.

### Design Spec

**Head (rows 0-11 game px):**
- Shape: Slightly square-ish (11×12 game pixels)
- Skin tone: `#c89060` (warm medium brown)
- Hair: Dark brown (`#1a0a00`), flat-top cut — perfectly flat top (6×2 pixel block on crown), short sides
- Eyes: 2×2 dark pupils, relaxed (slightly squinting — always looks like he's smiling even when neutral)
- Eyebrows: Flat, slightly thick (2×1 pixels each)
- Mouth: Relaxed smile, slightly wider than Elliot's. Occasional crumb pixel near mouth corner.

**Body (rows 12-34 game px):**
- Hoodie: Forest green (`#2a6020`), full torso
- Kangaroo pocket: 10×4 pixel rectangle across front of hoodie, same green with 1px darker border
- Drawstrings: Two 1-pixel vertical lines from neck V down to belly, light green (`#44aa44`)
- No visible shirt underneath — hoodie occupies full torso

**Arms (rows 14-32 game px):**
- Hoodie color, slightly darker on undersides
- **Right arm:** Bent, holding sandwich at chest height
- **Sandwich prop:** 10×5 pixel block — bottom bread (`#c89040`), filling layers (green lettuce `#44aa00`, red tomato `#cc2222`, yellow cheese `#eecc22`), top bread (`#c89040`)
- **Left arm:** Hanging at side or gesturing

**Legs and feet (rows 34-42 game px):**
- Cargo pants: Olive green (`#6a7030`)
- Cargo pocket on right leg: 4×5 pixel rectangle with 1px border
- Shoes: Dark brown (`#3a1e0a`), slightly rounded toe

### Color Palette (max 14 colors)
```
#c89060  skin
#9a6030  skin shadow
#1a0a00  hair
#2a6020  hoodie
#1a4010  hoodie shadow
#44aa44  hoodie highlight / drawstrings
#6a7030  cargo pants
#4a5018  pants shadow
#3a1e0a  shoes
#c89040  bread (sandwich)
#44aa00  lettuce
#cc2222  tomato
#eecc22  cheese
#2a1a00  outline
```

### Emotion States
1. **Neutral:** Relaxed squint, slight smile, sandwich held casually
2. **Enthusiastic:** Eyes wide-open circles, mouth open in big grin, sandwich raised slightly
3. **Mouth full:** Cheeks puffed slightly (+1px each side), eyes closed, chewing motion (2-frame)
4. **Focused:** Eyes narrow to slits (thinking), one hand moves to chin, sandwich lowered
5. **Surprised:** Eyes round circles, sandwich almost dropped (lowered arm)

### Animation States
| State | Key Visual |
|-------|-----------|
| **Idle** | Sandwich hand bobs slowly. Occasional chewing (2-frame jaw). |
| **Walk** | Sandwich arm stays relatively stable. Sandwich bobs with walk rhythm. |
| **Talk** | Free hand gestures (raises/lowers). Occasionally takes a bite mid-sentence. |
| **Laugh** | Body shakes 1px left/right over 6 frames. Eyes closed. |

---

## Alex — ML/Neuro Researcher, Realm 3

### Personality → Visual Language
Alex runs on caffeine and pattern recognition. Sharp, focused, slightly intimidating. Coffee is a personality trait, not just a prop. Visual language: precision, intensity, cool aesthetic.

### Design Spec

**Head (rows 0-11 game px):**
- Shape: Slightly longer face (11×13 game pixels), angular jaw
- Skin tone: `#e8b888` (light warm)
- Hair: Very dark brown/near-black (`#0a0610`), sleek and angular. Swept back from forehead, no stray pixels. Two flat geometric shapes: swept-back crown piece, and a forward bang that angles over the left eye.
- Eyes: Sharp, intense. Pupils are angular (4×3 game pixels). Strong angular brows (2×1, angled down toward nose). High contrast.
- Eyebrows: Thick, sharp, angled inward. 3×1 pixel each.
- Mouth: Thin line at rest. Doesn't smile much.

**Body (rows 12-34 game px):**
- Turtleneck: Black (`#0a0a14`), high collar (rows 12-15 at neck)
- No visible lapels — clean, minimal silhouette
- Slight shoulder shrug — shoulders 1px higher than natural (carries tension)

**Arms (rows 14-32 game px):**
- Black (turtleneck)
- **Right hand:** Holds large coffee cup (8×10 game pixels)
- **Coffee cup:** Cylindrical, white (`#f0f0f0`) body, black band at mid-height, small handle (3×4 px) on right side, lid on top (dark gray)
- **Steam:** 2-3 animated wavy 1-pixel lines rising from lid (frame-dependent position)

**Legs (rows 34-42 game px):**
- Black slacks, slim cut (5 pixels each leg)
- Black shoes — everything below the turtleneck is black. Unified dark lower body.

### Color Palette (max 12 colors)
```
#e8b888  skin
#b87840  skin shadow
#0a0610  hair
#0a0a14  turtleneck/pants
#1a1a2a  dark highlight
#f0f0f0  coffee cup body
#303040  coffee cup band
#909090  coffee cup handle / lid
#ffffff  steam pixels
#c0d0ff  eye specular highlights (small)
#e8a000  coffee inside cup (visible at top)
#1a0800  outline
```

### Emotion States
1. **Neutral:** Eyes half-lidded, coffee cup raised, one eyebrow slightly raised
2. **Focused:** Eyes narrow, coffee cup lowered, both hands visible (analysis pose)
3. **Impressed:** Eyes wide, eyebrows raised symmetrically, coffee almost spilled
4. **Dismissive:** Eyes look sideways, one eyebrow raised, small 'hmm' mouth shape
5. **Excited (rare):** Full open eyes, slight upturn of usually thin mouth, coffee raised in toast

### Animation States
| State | Key Visual |
|-------|-----------|
| **Idle** | Coffee cup raised/lowered (breathing motion). Steam wisps rise. |
| **Sip** | Cup tilts toward mouth. Head tilts back slightly. 6 frames. |
| **Talk** | Free hand gestures. Occasional sharp pointing gesture. Coffee stays in other hand always. |
| **Think** | Coffee to mouth, paused. Eyes look off to side. Head tilts slightly. |

---

## Henry — Holographic AI Mentor, Realm 4

### Personality → Visual Language
Henry is an AI (or AI-adjacent entity) who manifests as a hologram. Warm, wise, slightly glitchy. He makes jokes about not having a body while clearly having strong feelings about things. Visual language: technology, impermanence, kindness despite glitching.

### Design Spec

**Base Form (all elements affected by holographic treatment):**
- All colors are rendered at varying alpha (0.6-0.9 range, animated)
- All solid surfaces have occasional vertical scan-line artifacts (1-pixel wide white lines, every 4th frame on a random column)

**Head (rows 0-11 game px):**
- Shape: Perfectly symmetrical (10×11 game pixels) — unnaturally perfect
- Color: White/light teal (`#d0f0ff`) — holographic blue-white
- Hair: No hair. Smooth dome. Circuit trace lines visible on scalp area (thin `#00aaff` lines in right-angle patterns — 2-3 trace paths)
- Eyes: White circles (`#ffffff`), no visible pupils at rest. When expressing emotion, pupils appear as small teal squares.
- Mouth: White line, subtly upturned — looks like it's always almost smiling
- Circuit trace on face: One L-shaped trace line through left cheek

**Body (rows 12-34 game px):**
- Holographic business-casual: Jacket, but clearly holographic (everything is the same pale teal base)
- **Jacket:** `#b0d8f8`, lapels visible
- **Circuit traces on chest:** 4-5 hexagonal cell outlines on chest area, rendered in `#00aaff`
- **4 small orbs:** Orbit around Henry at different angles, always in motion. Each orb: 3×3 game px, teal (`#44ddff`), with inner bright pixel `#aaffff`. Orbit paths derived from sin/cos of frame counter, different phase per orb.

**Legs (rows 34-42 game px):**
- Holographic slacks, same teal family
- Feet slightly transparent (alpha lower at extremities)
- No shoes — feet end in a gradient fade

### Color Palette (max 10 colors — holographic mono-teal)
```
#d0f0ff  base holographic light
#b0d8f8  jacket / mid
#90b8e8  shadow
#00aaff  circuit traces
#44ddff  orbs
#aaffff  orb bright inner
#ffffff  eyes / highlights / scan artifacts
#002244  deep shadow (very dark teal)
#60c8f8  face mid-tone
#40a0e0  outline (instead of dark neutral — keep in teal family)
```

### Holographic Effect Implementation
```typescript
function drawHenry(ctx: CanvasRenderingContext2D, sx: number, sy: number, frame: number) {
  // Base alpha pulses: 0.7 to 0.95
  ctx.globalAlpha = 0.7 + Math.sin(frame * 0.05) * 0.125;
  
  // Draw main body at pulsing alpha...
  // [all sprite draw calls here]
  
  // Scanline glitch: every 4 frames, draw random vertical white line
  if (frame % 4 === 0) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    const glitchCol = Math.floor(Math.random() * 10) * SCALE;
    ctx.fillRect(sx + glitchCol, sy, SCALE, 42 * SCALE);
  }
  
  ctx.globalAlpha = 1.0; // always reset
  
  // Orbiting particles
  const orbs = [0, 1, 2, 3].map(i => ({
    x: Math.cos(frame * 0.03 + i * Math.PI / 2) * 18 * SCALE,
    y: Math.sin(frame * 0.03 + i * Math.PI / 2) * 12 * SCALE,
  }));
  orbs.forEach(orb => {
    ctx.fillStyle = '#44ddff';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(sx + 16 * SCALE + orb.x, sy + 20 * SCALE + orb.y, 3 * SCALE, 3 * SCALE);
    ctx.fillStyle = '#aaffff';
    ctx.globalAlpha = 1.0;
    ctx.fillRect(sx + 16 * SCALE + orb.x + SCALE, sy + 20 * SCALE + orb.y + SCALE, SCALE, SCALE);
    ctx.globalAlpha = 1.0;
  });
}
```

### Emotion States
1. **Neutral:** Orbs orbit calmly. Eyes white. Steady alpha pulse.
2. **Teaching:** One arm raised (pointing upward). Eyes gain square pupils. Orbs orbit faster.
3. **Amused:** Mouth-line curves upward further. Glitch rate increases temporarily.
4. **Concerned:** Alpha drops lower (0.5-0.7). Orbs slow. Eyes show small sad pupils.
5. **Corrupted (boss sequences):** Full scanline artifacts. Colors shift toward red. Rapid glitch.

---

## Enzyme — Cat Companion

### Personality → Visual Language
Enzyme is the player's cat companion. She follows the player everywhere. She's curious, affectionate, and inexplicably knows a lot about cell biology. Her name IS a pun (she catalyzes the player's learning). Visual language: pure cat, but also slightly supernatural.

### Design Spec

**Head (rows 0-9 game px from cat-relative origin):**
- Shape: Very round (10×9 game pixels), oversized relative to body
- Color: White (`#f0f0f0`) with subtle shading (`#d0d0d0`) at edges
- **Ears:** Two triangular ears, 3px tall, 3px base. Outer: white. Inner: pink (`#ff8899`), 2×1 inner ear triangle.
- **Eyes:** Almond-shaped, 4×2 pixels. Outer: dark outline. Inner: large iris (cyan `#00ddcc` OR at night: amber `#ffaa00`). 1×1 bright white specular highlight in upper corner.
- **Nose:** 1×1 pink pixel (`#ff8899`) at nose position.
- **Mouth:** 2px V-shape below nose, very subtle (1px darker than surrounding fur).
- **Whiskers:** 2-pixel lines extending left and right from nose area (3 per side). Not part of the sprite bounding box (extend beyond 32px width).

**Body (rows 9-16 game px from cat-relative):**
- Compact oval shape. White with `#d8d8d8` chest.
- Paws visible at bottom: two front paws, 4×2 px each, pink toe-beans (`#ffaaaa`) on bottom row.
- Total body: 12×8 game pixels.

**Tail:**
- Extends from body right side (or left for right-facing)
- 6 game pixels long, curves upward
- Animated: tail position = `sin(frame * 0.1) * 3` from base angle
- Tail tip: small curled circle of pixels

**Total cat sprite dimensions:** ~16×20 game pixels (half the size of full NPCs)

### Color Palette (max 10 colors)
```
#f0f0f0  white fur main
#d8d8d8  fur shadow
#c0c0c0  deep fur shadow (only at body underside)
#ff8899  inner ear, nose, toe-beans
#cc6677  inner ear shadow
#00ddcc  iris (day mode)
#ffaa00  iris (night mode / special)
#2a2a2a  outline (very dark, not pure black)
#ffffff  eye specular highlight
#80d8d0  iris specular
```

### Animation States
| State | Duration | Description |
|-------|----------|-------------|
| **Idle** | Continuous | Tail wags (sin wave). Every 80 frames: 4-frame blink. |
| **Walk** | 10f/step | Alternating leg pairs move. Tail curves more during motion. |
| **Head tilt** | 15f | Head tilts 15° when player stops. Inquisitive. |
| **Yawn** | 20f | Mouth opens wide (4px). Eyes squeeze closed. |
| **Pounce** | 12f | Crouch → launch → land. Used for catching items. |
| **Sit** | Static | Tail wraps around paws. Used at long stops. |
| **Celebrate** | 24f | Jumps in place, tail vertical, eyes wide with stars. |

### Enzyme's Position Logic (Lag System)
Enzyme follows the player with a position history queue of 20 frames. At each render, Enzyme renders at the position the player was 20 frames ago:

```typescript
const ENZYME_LAG = 20;
const playerPosHistory: Array<{x: number; y: number}> = [];

function pushPosHistory(px: number, py: number) {
  playerPosHistory.push({ x: px, y: py });
  if (playerPosHistory.length > ENZYME_LAG + 4) playerPosHistory.shift();
}

function getEnzymePos(currentPX: number, currentPY: number) {
  if (playerPosHistory.length < ENZYME_LAG)
    return { x: currentPX - 1.5 * TILE, y: currentPY + 0.5 * TILE };
  const h = playerPosHistory[playerPosHistory.length - ENZYME_LAG];
  return { x: h.x - 0.5 * TILE, y: h.y + 0.5 * TILE }; // offset: slightly left and below
}
```

---

## Player Character (Fully Customizable)

### Design Philosophy
The player sprite is a clean, neutral RPG character that must accommodate all possible avatar configurations: skin tone, hair style, clothing color, accessories. It must read clearly at 32px wide.

### Customizable Components
1. **Skin tone:** 5 options, stored as `avatar.skinTone`
2. **Hair style:** 4 styles (short, medium, long, pigtails), stored as `avatar.hairStyle`
3. **Hair color:** 6 colors, stored as `avatar.hairColor`
4. **Top color:** 8 color options, stored as `avatar.topColor`
5. **Bottom color:** 6 color options, stored as `avatar.bottomColor`
6. **Accessory:** glasses, hat, scarf, none — stored as `avatar.accessories`

### Sprite Structure (same 32×42 bounding box as NPCs)
The player sprite rendering function reads `avatar` config and varies only color values — the base geometry stays the same:

```typescript
function drawPlayer(ctx, sx, sy, direction, walkFrame, avatar) {
  const { skinTone, hairColor, hairStyle, topColor, bottomColor } = avatar;
  // Same fillRect calls as any NPC
  // Colors sourced from avatar instead of hardcoded
}
```

### 4-Direction Sprites
- **Face down (south):** Full frontal. Face visible. Default.
- **Face up (north):** Back view. Hair visible from behind. No face.
- **Face left (west):** True side view. One arm visible, side profile face.
- **Face right (east):** Mirror of left view (use `ctx.scale(-1, 1)` transform + adjust origin).
