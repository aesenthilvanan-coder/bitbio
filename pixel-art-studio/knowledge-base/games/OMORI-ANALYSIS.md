# OMORI Visual System — Deep Analysis
**Art Research Division | BitBio Pixel Art Studio**
*Compiled for direct application to BitBio's art pipeline*

---

## Overview

OMORI (OMOCAT, 2020) is one of the most visually sophisticated indie RPGs ever created. Despite using RPG Maker MV (a tool associated with simple graphics), OMOCAT's character and environment design creates distinct psychological worlds that communicate emotional states through visual language alone. This document dissects exactly how the same engine produces radically different visual atmospheres between the White Space, Headspace, and Real World.

---

## White Space vs. Headspace Color Theory

### The Core Principle: Color as Emotional State

OMORI's visual system is built on a single thesis: **the absence and presence of color communicates psychological health**. The game never tells you something is wrong — it shows you through color.

| Dimension | White Space | Headspace | Real World |
|-----------|-------------|-----------|------------|
| Background | Pure white `#FFFFFF` | Sky blue `#87CEEB` | Photorealistic photo-textured |
| Character outlines | Black `#000000` | Thick black `#000000` | Same |
| Character fill | Black/white/gray only | Full color (saturated) | Full color (photorealistic) |
| Saturation | 0% (grayscale) | 70-85% | Varies by scene |
| Light source | Undefined/uniform | Upper-left, warm | Mixed |
| Emotional read | Emptiness, control, safety | Constructed joy | Reality, mess, pain |

**The genius of this system:**
The same character model (OMORI/Sunny) is drawn in grayscale in White Space and in full color in Headspace. Players learn within minutes that MORE COLOR = MORE REAL/MORE EMOTIONAL. When color bleeds INTO White Space (RED SPACE intrusions), it reads as psychic violence because of this trained expectation.

### White Space Technical Specs
- Background: `#FFFFFF` — 100% white, no variation, no texture
- Floor: `#F8F8F8` — barely visible 2% gray differentiation from walls (floor exists but is barely acknowledged)
- OMORI sprite: `#000000` outline, `#FFFFFF` fill, `#888888` shirt, `#C0C0C0` shorts
- The lightbulb: `#FFFF00` — the ONLY warm color in White Space's default state. It is devastating in its isolation.
- Meow Meow (cat): `#000000` outline, `#FFFFFF` fill — like OMORI, defined only by outline

**What the minimalism achieves:**
White Space feels "safe" to OMORI because it has no variables. When everything is defined and there is nothing unexpected, there is nothing to fear. The all-white environment communicates control. The all-white environment communicates OMORI's psychological need to feel safe inside his own head.

### Headspace Technical Specs
- Color count per area: 12-20 distinct colors across environment
- Character outlines: `#000000` at 2px weight minimum (drawn style, thicker than typical pixel art)
- Sky: `#87CEEB` (classic "happy book" blue — immediately childlike)
- Grass: `#6CBE45` (bright, saturated green — deliberately "too green")
- The saturation level: approximately 65-75% saturation on all colors (not fully saturated, slightly pastel to suggest "storybook paint")

**The "deliberately perfect" quality:**
Headspace is drawn to look like what a child would imagine a perfect world looks like. The trees are perfectly round puffs of green. The sky is the exact blue children draw. The flowers are oversized and perfectly symmetrical. This manufactured perfection is the horror — it's too controlled, too deliberate. Like White Space but with color.

---

## Character Sprite Breakdown

### OMORI
**Dimensions:** Approximately 16x24 pixels overworld (small for the emotional weight he carries)
**Colors:** 4 — Black outline, white fill, gray shirt, black shorts
**Defining feature:** His blank, heavy-lidded expression. Two pixels for each eye, horizontal lines rather than circles, creating a permanently tired/blank look.

**Construction:**
- Body: white rectangular base
- Head: slightly wider rectangle than body (big-head-small-body proportion)
- Hair: black fill on top of head, no individual strands — just a black mass
- Expression: two short horizontal black dashes for eyes, a tiny curve or straight line for mouth
- Shirt: medium gray `#888888` — the only visual break on his white body

**What makes him readable at tiny scale:**
OMORI's silhouette is a simple white rectangle with a dark top (hair). Even at 8x8 pixels, the dark hair vs. white body reads as a child character. His expression is 4 pixels (2 per eye) but it communicates everything.

---

### AUBREY
**Dimensions:** Approximately 14x22 pixels overworld
**Defining features:** Oversized pink bow on head, baseball bat (later), yellow hair
**Colors:** 8-10 (bow pink, hair yellow, skin peach, shirt purple, shorts, outline, bow shadow, hair shadow)

**Color list:**
- Hair: `#FFD700` (golden yellow — bright, energetic)
- Hair shadow: `#C8A000` (2-tone ramp)
- Bow: `#FF69B4` (hot pink — her most distinctive element)
- Bow shadow: `#CC4488`
- Skin: `#F5C5A0` (warm peach)
- Shirt: `#7040A0` (purple)
- Outline: `#000000`

**Why Aubrey is instantly memorable:**
The bow. A single large bow sprite at the top of a character is unique enough that no other character wears one — she is "the character with the giant pink bow" and that reads from across the room on a small screen. This is OMORI's version of Undertale's "character with distinctive hat" design logic: give each character ONE immediately iconic visual element.

**Aubrey's character arc reflected in design:**
In Real World, Aubrey's design becomes harder — the bow is more punk, colors are sharper, her sprite posture is more aggressive. The same underlying structure, different color choices, communicates her changed emotional state.

---

### KEL
**Dimensions:** Approximately 14x24 (tallest of the friend group)
**Defining features:** Orange hair, yellow-orange colorway, energetic posture
**Colors:** 7-8

**Color list:**
- Hair: `#FF6600` (vivid orange — warm, friendly, energetic)
- Hair shadow: `#CC4400`
- Skin: `#F0B090` (slightly warmer/deeper than OMORI)
- Shirt: `#FF9900` (orange-yellow — his whole vibe is warm colors)
- Shorts: `#4444CC` (blue contrast against all his orange — the one cool color)
- Outline: `#000000`

**Color design lesson from Kel:**
Kel is a warm-color character (orange-yellow family) with a single blue element (shorts). This warm/cool contrast on a single character creates visual interest while maintaining his "warm personality" read. The blue shorts also read as typical kids' shorts — grounding him.

---

### HERO
**Dimensions:** Approximately 14x26 (tallest character, adult-proportion read)
**Defining features:** Neat dark hair, white shirt with vest, most "adult" looking of the group
**Colors:** 8-10

**Color list:**
- Hair: `#2C1810` (dark brown, almost black — mature, grounded)
- Hair shadow: `#1A0C08`
- Skin: `#F0C0A0` (light warm)
- Shirt: `#FFFFFF` (white — clean, dependable, older-sibling energy)
- Vest: `#CC8840` (golden brown — the one warm accent)
- Outline: `#000000`

**Hero's visual language:**
Hero is the only character in the friend group who wears white as their dominant color (excluding OMORI who is all-white but in White Space context). In Headspace, his white reads as "the responsible one, the caretaker." His near-black hair in a neat style reads as organized/older. He's designed to read as "adult-compared-to-others" despite being a child.

---

## How Thick Outlines Create the "Drawn" Feel

Standard pixel art uses 1px outlines. OMORI uses 2px outlines on all character sprites (and sometimes 3px on larger elements). This single decision transforms the aesthetic from "video game pixel art" to "someone drew this in a notebook."

**The technical execution:**
- All character silhouettes have a 2px-wide outer stroke in `#000000`
- Inner detail lines (clothing folds, facial features) are 1px
- This creates a hierarchy: outer form is HEAVY, inner details are LIGHT
- At any scale, you see the outer form first, details second

**Why this specific approach works for OMORI's story:**
OMORI is about things a person DREW — the world of OMORI's mind is a drawn world. The thick outlines reinforce at every moment that you are inside someone's sketchbook. The drawings are real to the character; the outlines prove they are drawings.

**Technical note for BitBio:**
If BitBio wants to evoke a "this world is constructed/artificial" feel in certain environments (simulations, mental spaces, teaching modules), shifting from 1px to 2px outlines is the cheapest possible way to communicate that shift.

---

## Room Design Principles

### How Simple Rooms Feel Atmospheric

OMORI rooms look simple when you screenshot them: flat colored backgrounds, some sprites arranged in them, basic floor patterns. But they feel complete. Why?

**Rule 1: Strong Silhouette Objects**
Every room has one large, visually dominant silhouette object. In White Space: the lightbulb on its cord. In Headspace Forest: the massive tree canopy. In a character's bedroom: the bed, always bigger than feels "necessary." These anchor the eye.

**Rule 2: Consistent Internal Light Logic**
Every object in a room casts its shadow in the same direction. OMORI is strict about this. If one object has shadow on its right side, ALL objects have shadow on their right side. This consistency creates the feeling that a room was "designed" rather than assembled.

**Rule 3: Empty Space is Intentional**
OMORI rooms have large empty areas. This is not laziness — it's deliberate atmosphere. Large empty areas convey emotional states: White Space is empty because OMORI has stripped his world down. A real-world bedroom is partially empty because someone left and took their things. Empty space in OMORI always means something.

**Rule 4: Exactly 3 Depth Layers**
Almost all OMORI rooms have exactly 3 depth layers:
1. Background (sky, wall, or void fill)
2. Midground (buildings, landscape, large objects)
3. Foreground (interactive objects, characters)

Occasionally a 4th layer is added (close foreground element that characters pass behind) but this is special-case. 3 layers = enough depth to feel 3D, simple enough to execute consistently.

---

## The Trauma/Horror Visual Language

### How Color Shifts Signal Danger

OMORI's horror system works by violating its own established color rules:

**State 1: Normal Headspace** — full color, clean, stable
**State 2: Approaching Danger** — colors desaturate slightly, a purple-gray tint appears at screen edges
**State 3: Something Wrong** — specific colors shift toward red/dark, shadows deepen
**State 4: BLACK SPACE** — `#000000` fills the screen, only specific elements visible, often in stark red or white

**The BLACK SPACE technique:**
When OMORI enters BLACK SPACE (deep trauma), the screen fills with `#000000`. Against this black:
- Text appears in `#FFFFFF` (most visible, maximum contrast)
- Horror imagery appears in `#FF0000` or `#CC0000` (blood/danger reads)
- OMORI himself appears as a white silhouette
- The horror entity appears as a black shape with red eyes against the black background (almost invisible except for those red eyes)

**Why this works:**
By the time BLACK SPACE appears, the player has been trained to associate black backgrounds with absence/nothing. Headspace has a sky. White Space has white. BLACK SPACE has nothing — which is worse than even White Space's emptiness, because at least White Space had white.

---

## Real World vs. Dream World Contrast Techniques

| Element | Dream (Headspace) | Real (Sunny's House etc.) |
|---------|-------------------|--------------------------|
| Art style | Pixel art, flat colors, thick outlines | Photo-real backgrounds, pixel characters |
| Color saturation | 65-75% | Variable, often lower |
| Character expressions | Simple dot/dash expressions | More detailed, visible emotion |
| Environmental detail | Minimal, stylized | Photo-textured backgrounds |
| Background art | Hand-drawn pixel scenes | Actual photos with pixel filter |
| Music tone | Warm, childlike, slightly unsettling | Piano-heavy, emotionally complex |

**The photo-background technique:**
OMORI uses actual photograph-based backgrounds in the Real World — slightly filtered/posterized photos of houses, rooms, streets. This creates immediate visual jarring when alternating with Headspace. The Real World looks like "real" to our eyes because it IS real (a photo). Headspace looks "fake" because it's drawn. The game makes you feel the difference.

**BitBio application:**
BitBio can apply this contrast between its "game world" (RPG zones inside the body) and any "interface world" (menus, screens, tutorials) by switching art registers. The body interior could be lush stylized pixel art; UI/tutorial spaces could use a flatter, more diagrammatic aesthetic.

---

## What BitBio Should Copy Directly

1. **The color-as-emotional-state system** — BitBio should establish rules: a dangerous environment gets specific hue shifts (red tint, lower saturation). A healthy cell environment = full color, high saturation. A diseased environment = partial desaturation, shifted toward bile-yellow or necrotic gray. Train the player to read health through color.

2. **Thick 2px outlines for "unreal" or constructed spaces** — If BitBio has tutorial/teaching sequences or mental interface spaces, use 2px outlines to signal "this is an instructional layer, not the 'real' game world."

3. **The "one iconic element" per character rule** — Each BitBio character (player, NPCs, allies) should have one single immediately readable visual identifier: a distinctive hat, color, accessory, or silhouette feature. Kel's orange = Kel. Aubrey's bow = Aubrey. Apply this.

4. **Strong anchor silhouette objects in rooms** — Every game environment in BitBio should have one dominant, large silhouette object that anchors the space. A cell zone: giant nucleus in the center. A cardiovascular zone: massive pulsing heart silhouette.

5. **3-layer depth composition** — Background / Midground / Foreground. BitBio environments should be built in these three passes, not added to incrementally.

6. **Empty space as emotional content** — Don't fill every area. Post-battle, an area that had enemies should feel emptier. After a boss defeat, the room should have visual absence. Emptiness communicates aftermath.

7. **The BLACK SPACE total-black treatment for critical moments** — For BitBio's most dramatic story moments, full-screen black with minimal elements in high contrast (white text, red accent) is more powerful than complex art.

---

## What BitBio Should Adapt

1. **The photo-background Real World** — This is OMORI-specific to its alternating realities structure. BitBio doesn't need this unless it has a "real vs. simulation" duality. Instead, use PALETTE CONTRAST between environments (warm bright labs vs. dark diseased zones) to achieve the same "world-shift" feel.

2. **The pure-white White Space aesthetic** — White Space works for OMORI's specific psychological narrative. BitBio should instead consider its equivalent "safe space" (perhaps a health-HUD space or menu) in a clean, single-color-dominant style that contracts with its chaotic game environments.

3. **Child-proportion characters** — OMORI's characters are drawn in a slightly chibi/child proportion that fits its emotional themes. BitBio can use more adult-neutral proportions while keeping the thick-outline drawn quality if desired.
