# The Complete Pixel Art Animation Encyclopedia
**BitBio Pixel Art Studio | Animation Division Reference**

---

## 1. The 12 Principles Applied to Pixel Art

The Disney 12 principles were formalized for hand-drawn animation working at 24fps on paper. Pixel art operates under entirely different constraints: grids are rigid, resolutions are tiny, and frames are expensive. Every principle must be reinterpreted for the medium.

---

### Principle 1: Squash & Stretch

**What it means in pixel art:** Because sprites are on a rigid pixel grid, true squash and stretch (changing volume while deforming shape) must be faked via alternate sprite frames. A jumping character doesn't actually stretch — you draw a taller, narrower frame for the apex and a wider, shorter frame for the landing impact.

**How it differs from traditional:** Traditional animation can smoothly interpolate. Pixel art jumps discretely between frames. You get 1-3 frames to sell the effect — make each count.

**Frame timing (60fps equivalent):**
- Pre-jump squash: 2 frames (33ms)
- Apex stretch: 3 frames (50ms)
- Landing squash: 2 frames (33ms), then snap back to idle over 3 frames

**Examples:**
- *Undertale* — Sans's attack windup frames show exaggerated body compression before the bone attack
- *Celeste* — Madeline squashes 1px on landing, stretches 1px at dash peak
- *Pokemon B/W* — Trainer sprite squash on entering battle (3-frame entrance squash)
- *Deltarune* — Susie attack squash is exaggerated beyond Kris's to communicate power difference

---

### Principle 2: Anticipation

**What it means in pixel art:** The setup frames BEFORE the main action. In pixel art these are often just 1-2 frames, but they are mandatory — without anticipation, attacks feel "teleport" instant and unreadable.

**How it differs from traditional:** Traditional anticipation can be subtle (slight body shift). Pixel anticipation must be obvious because the canvas is tiny. Exaggerate the wind-up at pixel scale.

**Frame timing (60fps equivalent):**
- Minimum anticipation: 2 frames (33ms) — absolute floor for any attack
- Standard anticipation: 4 frames (67ms) — normal NPC/enemy attacks
- Big attack anticipation: 8 frames (133ms) — boss attacks, charge moves

**Examples:**
- *Undertale* — Every monster attack has a telegraph frame before the bullet appears
- *Celeste* — Crystal Heart grab has 6-frame anticipation (arm reaching)
- *Deltarune* — Jevil's attack anticipation is exaggerated to the point of comedy (intentional)
- *Pokemon B/W* — Move animations always telegraph with a trainer/Pokemon lean-in

---

### Principle 3: Staging

**What it means in pixel art:** The character and environment must always communicate exactly one thing at a time. In pixel art, staging is primarily achieved through position (center screen = important), contrast (bright against dark), and size (larger = more important).

**How it differs from traditional:** You cannot stage via camera angle in the same way. Instead, use color contrast and position on the 2D plane. Undertale stages combat in the bullet box — the player MUST look there.

**Frame timing:** Staging is compositional, not temporal. Key consideration: important actions should always start from the center-most sprite frame.

**Examples:**
- *Undertale* — Battle UI forces attention: white box bottom, enemy above, FIGHT/ACT/ITEM/MERCY centered. Nothing competes.
- *Celeste* — Strawberries are always in high-contrast positions; the path is always visually obvious.
- *Pokemon B/W* — Wild Pokemon centers the screen on appearance; trainers enter from sides to signal difference.
- *Deltarune* — Dark world vs light world staging is entirely via color contrast.

---

### Principle 4: Straight-Ahead vs Pose-to-Pose

**What it means in pixel art:** Straight-ahead = drawing frames in sequence (good for fluid motion, fire, water). Pose-to-pose = drawing key poses first then filling in-betweens (good for character action with clear beats).

**How it differs from traditional:** Pixel art has no "tweening" — every frame must be hand-crafted. Pose-to-pose is almost always better for characters because you minimize frame count and maximize clarity at each keyframe.

**Frame timing:** In pose-to-pose pixel animation, 4-8 frames per action is the sweet spot. More than 12 frames for a single action is usually wasted.

**Examples:**
- *Undertale* — Character animations are strict pose-to-pose (very low frame counts, high readability)
- *Celeste* — Madeline's dash is straight-ahead for the blur trail, pose-to-pose for the body itself
- *Pokemon B/W* — Battle sprites use straight-ahead for idle sway animations (smooth loop), pose-to-pose for move animations
- *Deltarune* — Mix: environment (straight-ahead waterfalls), characters (pose-to-pose attacks)

---

### Principle 5: Follow-Through and Overlapping Action

**What it means in pixel art:** Parts of a character that should feel "loose" — hair, ears, tails, clothing edges — should continue moving briefly after the main body stops.

**How it differs from traditional:** At tiny sprite sizes, follow-through must be simplified to 1-2 pixel offsets on extremities. Enzyme's tail is the clearest BitBio application.

**Frame timing:**
- Hair follow-through after stop: 2-3 frames delayed vs body
- Tail follow-through: 3-4 frames delayed
- Ear twitch after a jump: 2 frames

**Examples:**
- *Undertale* — Flowey's petals have 2-frame follow-through after he retracts
- *Celeste* — Madeline's hair (colored by stamina state) trails behind on dashes with 1-frame delay
- *Deltarune* — Ralsei's hat tilts 1px behind head movement direction
- *Pokemon B/W* — Trainer sprites: scarf/coat edges lag by 1 frame after movement stops

---

### Principle 6: Slow-In and Slow-Out (Easing)

**What it means in pixel art:** Actions accelerate out of stillness (slow-out) and decelerate into stillness (slow-in). In pixel art, this is approximated by frame duration: more identical or near-identical frames at start and end of motion, fewer in the middle.

**How it differs from traditional:** Pixel art implements easing through hold-frame duration control. A 6-frame animation might be: 2 frames starting pose → 1 frame mid → 2 frames ending pose = slow-out / slow-in pattern.

**Frame timing for BitBio (targeting 10fps game animation):**
- Slow-out: first 2 frames have 150ms duration each
- Mid-action: 1-2 frames at 80ms
- Slow-in: last 2 frames at 150ms each

**Examples:**
- *Undertale* — Papyrus's spaghetti presentation animation slows dramatically at the reveal frame
- *Celeste* — Dash animation: fast middle, brief pause at start/end
- *Deltarune* — Chapter 2 Spamton walks with extreme slow-in/slow-out (comedic effect)
- *Pokemon B/W* — Entry animations ease into the idle loop

---

### Principle 7: Arcs

**What it means in pixel art:** Natural movement follows curved paths, not straight lines. In pixel art, this means a jumping character should follow a pixel-approximated parabola, not a straight diagonal.

**How it differs from traditional:** On a pixel grid, arcs must be approximated. The common approach: offset by (1,2), (2,3), (3,3), (3,2), (2,1) pixel steps rather than identical steps per frame.

**Frame timing:** Arc frames should have shorter hold times at the peak of the arc where speed is lowest — but this is counter-intuitive. In pixel art games, the peak is usually 2-3 frames, approach/descent 1 frame each.

**Examples:**
- *Undertale* — Bullet patterns follow arcs; player Soul moves in smooth grid approximations
- *Celeste* — Madeline's jump arc is pixel-perfect parabola, teaching players the physics intuitively
- *Pokemon B/W* — Move projectiles follow arc trajectories across the battle screen
- *Deltarune* — Lancer's projectiles in Chapter 1 follow intentionally imperfect arcs

---

### Principle 8: Secondary Action

**What it means in pixel art:** While the main action happens, a secondary motion supports the mood. In pixel art: eye blinks during idle, tail sway while walking, ear flick during a reaction.

**How it differs from traditional:** Pixel art secondary actions must be carefully chosen — adding too many secondary actions to a small sprite creates visual noise. Maximum 1-2 secondary actions per character state.

**Frame timing:**
- Blink (secondary to idle): every 180-240 frames at 10fps = every 18-24 seconds
- Tail sway (secondary to walk): offset by 2 frames from walk cycle phase
- Ear twitch (secondary to idle): random, every 8-16 frames

**Examples:**
- *Undertale* — Toriel's robe sways (secondary) while her face expression changes (primary)
- *Celeste* — Madeline's hair color changes (secondary) while she dashes (primary) — carries story meaning
- *Deltarune* — Ralsei's glasses glint (secondary) as he speaks (primary, implied)
- *Pokemon B/W* — Pokemon idle sways; secondary: occasional unique behavior (Snivy's tail coil)

---

### Principle 9: Timing

**What it means in pixel art:** How many frames an action takes, and how long each frame holds, creates the entire perceived character of the motion. Fewer frames = snappier, more energetic. More frames = heavier, weightier.

**How it differs from traditional:** Pixel art game animations run at game-engine frame rates (often 10fps to 30fps effective animation rate, even in a 60fps engine). Each "animation frame" is typically held for 2-6 engine frames.

**Frame timing guidelines for BitBio (game runs at 60fps):**
- Fast action (attack impact): hold 2 engine frames (33ms)
- Normal action (walk cycle): hold 6 engine frames (100ms per frame)
- Slow action (idle breathing): hold 12 engine frames (200ms per frame)
- Dialogue idle: hold 18 engine frames (300ms per frame)

**Examples:**
- *Undertale* — Sans's attacks are fast (2-frame holds), his walk is slow (deliberately comedic 8-frame holds)
- *Celeste* — Crystal clear timing: dash is 6 frames total, landing is 3, idle is 12 per breath cycle
- *Pokemon B/W* — Move animations: 2-frame hold on impact flash, 8-frame hold on effect loop
- *Deltarune* — Bosses have longer timing = feel heavier; small enemies faster = feel erratic

---

### Principle 10: Exaggeration

**What it means in pixel art:** Push poses beyond realistic range to communicate feeling. At 16x16, subtle is invisible — exaggeration is necessary for readability.

**How it differs from traditional:** Traditional animation can use subtle expressions. Pixel art faces often have 2-4 pixels for the entire face. A raised eyebrow = literally 1 pixel up. So you must exaggerate the whole pose, not just the face.

**Frame timing:** Exaggerated reaction frames should be held for 4-6 frames (67-100ms) to ensure the player notices them before the animation continues.

**Examples:**
- *Undertale* — Characters jump (entire body up 2 pixels) to express surprise — face alone can't do it
- *Celeste* — Madeline's death animation explodes her into multiple pieces — maximum exaggeration
- *Pokemon B/W* — Faint animation: Pokemon falls backward off screen, exaggerated tumble
- *Deltarune* — Ralsei's "hiding" (head completely buried in hat) is impossible anatomically, perfectly expressive

---

### Principle 11: Solid Drawing (Volume Awareness)

**What it means in pixel art:** Even in 2D pixel art, characters should feel like they have 3D volume. This is achieved through consistent shading, proportions that read as 3D when turned, and highlights placed as if from a consistent light source.

**How it differs from traditional:** There is no z-depth in pixel art. Volume is entirely implied through: (a) shading placement, (b) body part overlap (arm in front of body), (c) consistent perspective per character.

**Frame timing:** Volume consistency is per-sprite, not per-frame. The issue arises when walk cycles lose volume consistency — arm swinging in front vs behind body must be correctly layered.

**Examples:**
- *Undertale* — Minimal but consistent: faces always have one light spot, bodies read as a single volume
- *Celeste* — Madeline's walk cycle maintains arm-behind vs arm-in-front layering throughout all 4 frames
- *Pokemon B/W* — Pokemon sprites convey 3D volume through careful shading despite being 2D
- *Deltarune* — Susie's size reads as volumetrically larger than Kris even in side-view

---

### Principle 12: Appeal

**What it means in pixel art:** Designs should be immediately likeable and readable. In pixel art, appeal comes from: clear silhouettes, limited but striking color choices, expressive eyes (even if just 2 pixels), and a memorable design element.

**How it differs from traditional:** Appeal at 16x16 pixels is about design economy — every pixel must contribute. The most appealing pixel art characters have one "signature" element that makes them instantly recognizable.

**Frame timing:** Appeal is a design principle, not timing-based. However: appealing idle animations feel comfortable to watch. Target 6-10 second loops for idle animations.

**Examples:**
- *Undertale* — Every character has exactly one unforgettable design element: Sans has no pupils, Toriel has white fur + horns, Flowey has a "face" on a stem
- *Celeste* — Madeline's color-changing hair is both appealing and mechanically meaningful
- *Pokemon B/W* — Gen 5 Pokemon have the highest "silhouette appeal" in the franchise (Zoroark, Hydreigon)
- *Deltarune* — Berdly's wing silhouette is instantly recognizable; appeal intentionally undercut for comedic effect

---

## 2. Walk Cycle Fundamentals

### 8-Frame Walk Cycle Breakdown

A standard 8-frame walk cycle uses the classic contact-down-passing-up pattern, doubled for left-right symmetry:

```
Frame 1: CONTACT (Right foot strikes)
  - Right leg extended forward, left leg behind
  - Body at neutral height
  - Arms at opposing swing (left arm forward)

Frame 2: DOWN (Weight shifts to right foot)
  - Right foot flat, left foot lifting
  - Body at lowest point (drop 1px)
  - Arms begin reversing

Frame 3: PASSING (Left foot passes right)
  - Left foot passes right foot at center
  - Body rising, at neutral height
  - Arms at neutral swing

Frame 4: UP (Left foot rising)
  - Body at highest point (rise 1px)
  - Left foot about to extend forward
  - Arms at max swing

Frame 5: CONTACT (Left foot strikes) — mirror of Frame 1
Frame 6: DOWN (mirror of Frame 2)
Frame 7: PASSING (mirror of Frame 3)
Frame 8: UP (mirror of Frame 4)
```

**Target timing:** Each frame held for 6 engine frames at 60fps = 100ms per animation frame = 800ms total loop. At 10fps animation rate, this is 8 distinct frames.

### Pixel-Specific Walk Cycle Considerations

**Leg placement on pixel grid:**
- Character legs should only be at integer pixel offsets
- Left/right foot should each use their own pixel column (no overlap at any frame)
- Foot should touch the "ground line" pixel in contact/down frames
- Avoid "sliding feet" — if the body moves forward but feet don't counter-animate, it looks like gliding

**Avoiding "swimming" artifacts:**
- "Swimming" = pixels that seem to float disconnected from the rest of the body
- Prevention: ensure each limb pixel is directly adjacent to the body or another limb pixel in every frame
- Test: flip through frames rapidly — any pixel that seems to "teleport" is swimming
- Fix: add a bridging pixel in the problematic frame, or reroute the limb path

**Walk cycle variants:**

| Variant | Frames | Frame Hold | Total Duration | Feel |
|---------|--------|------------|----------------|------|
| Sneak/Slow | 16 | 8 frames (133ms) | 2133ms | Cautious, heavy |
| Standard Walk | 8 | 6 frames (100ms) | 800ms | Normal pace |
| Jog | 6 | 4 frames (67ms) | 400ms | Light urgency |
| Run | 4 | 3 frames (50ms) | 200ms | Fast |
| Sprint | 4 | 2 frames (33ms) | 133ms | Frantic |

### BitBio Player Walk Cycle — Frame-by-Frame Description

Player is an 8x16 game pixel character (24x48 at S=3 scale). Lab coat: white. Hair: medium brown. Skin: warm peach. Eyes: dark.

```
Frame 1 (CONTACT, right foot forward):
  Head: centered at (3,0)-(5,2)
  Body: torso (2,3)-(6,8), lab coat extends to (1,4)-(7,8)
  Right leg: (4,9)-(5,14) extended, foot at (4,14)-(5,15)
  Left leg: (3,9)-(4,14) trailing behind
  Right arm: (1,4)-(2,7) swung back
  Left arm: (6,4)-(7,7) swung forward

Frame 2 (DOWN, weight on right):
  Head: shifted down 1px — (3,1)-(5,3)
  Body: (2,4)-(6,9), coat (1,5)-(7,9) — body sinks 1px
  Right leg: (4,9)-(5,15) flat foot
  Left leg: (3,10)-(4,13) lifting
  Arms: midway returning

Frame 3 (PASSING):
  Head: back to (3,0)-(5,2)
  Body: neutral (2,3)-(6,8)
  Legs: passing through center, both near (3-5, 10-14)
  Arms: at neutral swing, both at sides

Frame 4 (UP, left foot rising):
  Head: raised 1px — (3,-1)-(5,1) [clamped to 0 in engine]
  Body: (2,2)-(6,7) — body rises 1px
  Right leg: (4,10)-(5,14) pushing off
  Left leg: (3,9)-(4,13) rising, about to extend
  Arms: max back/forward swing (opposite of Frame 1)

Frames 5-8: Mirror of Frames 1-4 with legs swapped
```

---

## 3. Idle Animations

### Breathing Idle (6-12 frames)

The breathing idle is the most important animation in any RPG — players spend more time watching it than any other state.

**Mechanics:**
- Chest/body bobs ±1px vertically
- Head follows body with 1-frame delay (secondary action)
- Arms may rotate ±1px at the shoulder

**Standard 8-frame breathing cycle at 10fps:**
```
Frames 1-2: Neutral pose (hold 2)
Frame 3: Body up 1px (inhale start)
Frame 4: Body up 1px, head up 1px (inhale peak)
Frame 5: Body neutral (exhale start)
Frame 6: Body down 1px (exhale)
Frame 7: Body neutral (recovering)
Frame 8: Back to neutral (hold before repeat)
```

Total loop: 8 frames × ~150ms average = 1200ms = 1.2 second breath cycle.

**For a slower, calmer character:** Use 12 frames, increase hold per frame to 200ms = 2.4 second breath.

**For an anxious/excited character:** Use 6 frames, hold 100ms = 600ms = faster breathing.

### Eye Blink Timing

Blinks are the most human-readable animation. They trigger involuntary empathy.

**Standard blink pattern:**
- Frequency: Every 3-4 seconds (180-240 frames at 60fps; 30-40 animation frames at 10fps)
- Blink sequence (5 frames total):
  ```
  Frame -2: Eyes fully open (normal idle)
  Frame -1: Eyes at half-close (lids drop halfway)
  Frame 0:  Eyes closed (lids fully down, 1-2px line)
  Frame +1: Eyes at half-open (lids lift halfway)
  Frame +2: Eyes fully open (return to normal)
  ```
- Each blink frame: 33ms hold (2 engine frames at 60fps)
- Total blink duration: ~165ms

**Double blink (for personality):** Blink twice quickly — used for NPCs with nervous or energetic personality (Alex: typing NPC who blinks rapidly).

**Eyelid-less blink (for non-human characters):** Shrink the eye pixels vertically (2px eye → 1px → nothing → 1px → 2px). Used for Enzyme cat.

### Weight Shift Idle (16-24 frames)

For standing NPCs who wait in place — shifting weight prevents "statue" feel.

**16-frame weight shift cycle:**
```
Frames 1-4:   Standing neutral, weight centered
Frames 5-8:   Shift weight right (body moves 1px right, left shoulder drops 1px)
Frames 9-12:  Hold shifted-right pose
Frames 13-16: Return to center
```
Subtle — the shift is only 1px but reads as natural standing behavior.

### Hair and Cloth Physics Secondary Animation

**Hair physics rule:** Hair lags behind head movement by 1-2 frames.
- After head turn: hair follows 2 frames later, then 1 frame correction
- After jump landing: hair bounces down 1px, up 1px, settles

**Cloth/coat physics rule:** Bottom edges of coats, scarves, and capes follow body movement with 2-frame delay.
- Player lab coat bottom edge: 2-frame lag behind body position changes
- During walk: coat hem alternates between neutral and 1px wider (flap effect)

### Enzyme Cat Idle Animation Specification

Enzyme is a small gray-white cat who serves as the player's companion. Approximately 12x10 game pixels.

**Full idle animation: 16 frames**

```
Tail sway component (runs continuously):
  Frames 1-4:   Tail curves right (+1px offset at tip)
  Frames 5-8:   Tail at neutral
  Frames 9-12:  Tail curves left (-1px offset at tip)
  Frames 13-16: Tail returns to neutral

Blink component (overlaid at frames 7-9):
  Frame 7: Eyes half-close
  Frame 8: Eyes closed
  Frame 9: Eyes open

Ear twitch (random, every 20-40 frames in engine):
  Frame 0: Both ears up (normal)
  Frame 1: Right ear down 1px
  Frame 2: Right ear up (return)
```

Total idle loop: 16 frames × 100ms = 1.6 seconds before repeat, with ear twitches randomly interspersed.

---

## 4. Attack Animations

### Anticipation Frames (Minimum 2)

Every attack animation must begin with at least 2 anticipation frames. This is Rule #1 of BitBio attack design — no exceptions.

**Why:** Without anticipation, attacks feel "cheap" and unreactable. Players perceive the attack as instant even if the hitbox has a 100ms delay. The visual anticipation communicates danger and gives the feeling of fair play.

**Anticipation frame design:**
- Body leans opposite to attack direction (wind-up)
- Eyes should narrow or change expression in these frames
- Color: keep normal palette — no special effects yet
- Duration: 2 frames minimum = 33ms minimum; 4-8 frames for charged attacks

### Impact Frame Design

The impact frame is the single most important frame in any attack animation. It should:

1. **Be held for exactly 1-2 frames** — too short = invisible, too long = feels laggy
2. **Maximize exaggeration** — extend the attacking limb beyond anatomically normal range
3. **Flash effect** — a 1-frame white flash at the point of impact is the BitBio standard
4. **Pixel burst** — 4-8 small pixels scatter from impact point in cardinal directions

**Impact pixel burst pattern:**
```
Impact point at (cx, cy):
  North: (cx, cy-2) — 1px
  South: (cx, cy+2) — 1px
  East:  (cx+2, cy) — 1px
  West:  (cx-2, cy) — 1px
  NE:    (cx+1, cy-1) — 1px
  SW:    (cx-1, cy+1) — 1px
```
All pixels: bright accent color (white or realm accent). Hold for 1 frame only.

### Recovery Frames

After the impact, the attacker must return to idle/neutral state. Recovery frames should:
- Take 3-6 frames (50-100ms)
- Show a clear "return to ready" pose
- Be slower than the attack motion (the attack is fast; recovery is measured)
- Not be interruptible by another attack until complete (gameplay rule)

### Hit Spark / VFX Design for Pixel Art

Hit sparks are the particle burst that appear when an attack connects.

**BitBio standard hit spark:**
```
Frame 1 (Impact): 
  Center flash: 3x3 white pixels at impact point
  
Frame 2 (Burst):
  Center: 1px white core
  Cardinal: 3px lines in realm accent color
  Diagonal: 2px lines in secondary accent
  
Frame 3 (Fade):
  Center: gone
  Cardinal: 2px remnants
  Diagonal: 1px remnants
  
Frame 4: Gone
```

**Color rules for hit sparks:**
- Physical attack: Yellow-orange spark (`#ffcc00`)
- Science/enzyme attack: Teal spark (`#00ffcc`)
- Boss attack hits player: Red spark (`#ff4444`)
- Correct answer: Gold spark + XP burst (`#ffd700`)

---

## 5. Environmental Animation

### Water Ripples (Wave Offset Animation)

Water tiles use a scrolling sine-wave offset technique to simulate ripple motion.

**Implementation logic:**
```
For each pixel row y in water tile:
  xOffset = Math.sin((time * speed) + (y * frequency)) * amplitude
  Draw water pixel at (x + xOffset, y)
```

**BitBio parameters:**
- Realm 1 (Cytoplasm): amplitude=1px, frequency=0.5, speed=1.5 — slow, organic ripple
- Realm 2 (DNA): amplitude=2px, frequency=1.0, speed=2.0 — more active
- Realm 3 (Neural): not applicable
- Realm 4 (Protein): amplitude=1px, frequency=0.3, speed=0.8 — slow, dignified

**Frame approach for non-shader environments:**
Pre-compute 8 frames of the wave cycle:
- Each frame offsets the row pixels by the next step in the sine sequence
- At 10fps, 8 frames creates a 800ms loop
- Seamlessly tileable in both X and Y

### Foliage Sway (Offset Per Row)

Foliage (grass, seaweed, kelp-like structures in cytoplasm realm) sways by offsetting each row by a staggered sine value.

**Sway pattern for a 16-row tall plant:**
```
Row 0 (base): no offset — anchored to ground
Row 4: offset 1px right at sway peak
Row 8: offset 2px right at sway peak (tip moves most)
Row 12: offset 2px right (tip)
Row 16: offset 3px right (very tip)
```

In BitBio: DNA helix grass-like structures in Realm 2 use 6-frame sway cycle.

### Fire Animation (Bottom-Up, Palette Cycling)

Fire builds from base to tip, using a rising-particle model with palette cycling.

**Fire animation approach:**
```
Frame 1: Dark base glow (#cc3300), small 3px base
Frame 2: Base expands, mid-orange appears (#ff6600)
Frame 3: Yellow-orange (#ffaa00) reaches mid-height
Frame 4: Yellow tip (#ffff00) at peak, base dims
Frame 5: Tip fragments into 3 particles
Frame 6: Particles fade, base resets
```

**Palette cycling rule:** Move through colors in sequence: red → orange → yellow → white (at core), cycling faster than the frame animation gives a "shimmer" effect achievable with ctx.fillRect.

### Crystal Shimmer (Rotating Highlight Pixel)

Crystal/gem tiles in Realm 3 (Neural Star Cluster) use a rotating highlight pixel to simulate 3D shine.

**8-frame highlight rotation for a 4x4 crystal:**
```
Frame 1: Highlight at top-left (1,1)
Frame 2: Highlight at top-center (2,1)
Frame 3: Highlight at top-right (3,1)
Frame 4: Highlight at right (3,2)
Frame 5: Highlight at bottom-right (3,3)
Frame 6: Highlight at bottom (2,3)
Frame 7: Highlight at left (1,2)
Frame 8: Return to top-left
```
Highlight color: pure white (#ffffff) or near-white (#f0f0f0). All other crystal pixels at normal palette. 8-frame loop at 8fps = 1000ms rotation.

### DNA Helix Rotation (Trig-Based Pixel Offset)

The DNA helix in Realm 2 background should appear to rotate in 3D space.

**Simplified pixel rotation for a helix column:**
```
For each base pair at height y:
  angle = (y * helixSpacing) + (time * rotationSpeed)
  strandA_x = centerX + Math.round(Math.cos(angle) * radius)
  strandB_x = centerX + Math.round(Math.cos(angle + Math.PI) * radius)
  Draw strandA at (strandA_x, y) with color_A
  Draw strandB at (strandB_x, y) with color_B
```

**BitBio DNA helix parameters:**
- Radius: 4 game pixels
- helix spacing: 0.4 radians per row
- rotationSpeed: 0.03 radians per frame at 60fps
- Color A: `#00ffcc` (teal, Realm 2 primary)
- Color B: `#cc88ff` (purple, Realm 2 accent)
- Background: `#050d10` (near-black)

---

## 6. BitBio-Specific Animation Specifications

### Character: Enzyme (Companion Cat)

**Sprite size:** 12x10 game pixels (36x30 at S=3)
**Anchor point:** Bottom-center (6, 10)
**Color palette:** White (#e8e8e8), Light gray (#b0b0b0), Dark gray (#555555), Pink (#ffaaaa, nose/inner ear), Eye dark (#1a1a1a), Pupil green (#00cc88)

**Idle Cycle — 16 frames**
- Tail sway (4 frames left, 4 neutral, 4 right, 4 neutral)
- Blink overlay at frame 8-10
- Ear twitch: random trigger, 2-frame animation

**Walk Cycle — 8 frames**
- Paw alternation: front-right/back-left, then front-left/back-right
- Body bobs ±1px at contact frames
- Tail trails behind body by 2 frames
- At walk speed, body moves +2px forward per cycle

**Emotional Reactions:**
- Excited: 4-frame full-body hop (up 3px, neutral, up 2px, neutral), tail goes straight up
- Sad: Head droops 1px, ears flatten to 45-degree angle (2px offset), tail curls down, hold 16 frames
- Angry: Tail puffs (2px wider), arched back (body center up 1px, head and tail ends down), hold 8 frames
- Thinking: Head tilts 1px right, one ear perked, tail wraps around body to the left

**Special — "On Head" pose (riding player's head):**
- Enzyme 4px above player head position
- Legs tucked under body (shorter sprite)
- Tail drapes down left side of player head
- Blink pattern continues during this pose

**Special — "Flying" pose:**
- Same as idle but wings extended (if Enzyme gains wings in story)
- Wings: 4px each side, alternating up/mid/down = 3 frames per wing beat
- 6-frame wing beat loop

---

### Character: Player

**Sprite size:** 8x16 game pixels (24x48 at S=3)
**Anchor point:** Bottom-center (4, 16)
**Color palette:** Lab coat white (#f0f0f0), Coat shadow (#c8c8c8), Skin (#f0c8a0), Skin shadow (#d4a070), Hair (#7a5230), Hair highlight (#9a7250), Eye (#2a2a4a), Outline (#0a0a0a)

**Idle Cycle — 8 frames**
- Breathing bob: ±1px vertical
- Blink at frame 5-7 of each 12-second period (separate timer from idle loop)
- Lab coat hem: alternates between flat and 1px wider at bottom (coat shifting slightly)

**Walk Cycle — 8 frames**
- Standard 8-frame cycle as described in Section 2
- Lab coat open at front during walk (2px gap in coat at torso)
- Hair bobs ±1px at contact frames (up on contact, down on passing)

**Celebrate Pose — 6 frames**
- Frame 1-2: Arms raise to sides (+3px height arms)
- Frame 3-4: Arms fully raised overhead, body stretches 1px taller
- Frame 5-6: Arms drop to sides, body returns — hold 12 frames before loop

**Hurt Flash — 4 frames**
- Frame 1: Normal sprite
- Frame 2: White flash (entire sprite = white rectangles)
- Frame 3: Normal sprite
- Frame 4: Slight red tint (overlay #ff000040), hold 6 frames

---

### Character: Elliot (Science Teacher NPC)

**Sprite size:** 10x18 game pixels (30x54 at S=3)
**Anchor point:** Bottom-center (5, 18)
**Description:** Tall, lanky professor with rectangular glasses, wavy gray-white hair, rumpled tweed jacket (brown), tie (teal — nod to Realm 1).

**Idle Cycle — 12 frames**
- Head bob ±1px (thinking nod)
- Blink at frames 8-10
- Glasses glint: 1-frame white pixel on lens at frame 3 and frame 9

**Walk Cycle — 8 frames**
- Long stride (exaggerated leg extension due to lanky proportions)
- Hair: 1px follow-through behind head movement
- Slightly hunched walking posture (forward lean 1px)

**Emotional Reactions:**
- Excited: jumps 2px, arms extend wide, hair floofs up 1px for 4 frames
- Sad: head droops, shoulders cave inward, adjusts glasses (hand moves to face for 3 frames)
- Angry: rare — glasses slide down nose (1px), brow furrows (shadow pixel over eyes), shakes head (1px oscillation)
- Thinking: chin-stroke animation (hand moves to chin, 4-frame cycle), head tilts 2 degrees

---

### Character: Ben (Lab Partner NPC)

**Sprite size:** 9x15 game pixels (27x45 at S=3)
**Anchor point:** Bottom-center (4, 15)
**Description:** Stockier build, casual hoodie (navy), messy dark hair, friendly expression. More grounded body language than Elliot.

**Idle Cycle — 8 frames**
- Subtle weight shift (body 1px left frames 1-4, 1px right frames 5-8)
- Blink at frames 5-7
- Hoodie pocket: hands occasionally emerge then return (20% chance per loop cycle)

**Walk Cycle — 8 frames**
- Heavier footfall than player — body drops 1px more at contact frame
- Arm swing more pronounced (hoodie sleeves exaggerate the motion)
- Head: minimal bob (Ben is steady-paced)

**Emotional Reactions:**
- Excited: fist pump (right arm raises and pumps, 4 frames), big smile (eyes curve up)
- Sad: hands in hoodie pocket, head down, 1px shorter posture (slight slouch)
- Angry: arms cross (both forearms across torso), frown, looks away (head turns 1px right)
- Thinking: scratches head (right hand raised to head, rotating 1px per frame, 6-frame cycle)

---

### Character: Alex (Robotics/Coding NPC)

**Sprite size:** 8x14 game pixels (24x42 at S=3)
**Anchor point:** Bottom-center (4, 14)
**Description:** Compact, efficient-seeming. Short hair with one asymmetric highlight streak (cyan). Glasses, dark jacket with LED-like accent stripe.

**Idle Cycle — 8 frames**
- Typing animation: arms slightly forward, fingers implied by 2px movement
- Eye blink: double-blink (characteristic of someone focused on a screen)
- LED stripe: pulses brightness (normal → bright → normal) every 12 frames

**Walk Cycle — 8 frames**
- Brisk, efficient walk — slightly faster pace than standard (frames held 80ms vs 100ms)
- Minimal arm swing (hands always somewhat forward, laptop-carrying posture)
- Hair streak: 1px follow-through on turns

**Emotional Reactions:**
- Excited: rapid head nod (3 nods at 60ms each), types faster (finger animation speeds up)
- Sad: stops typing, stares at screen, LED dims
- Angry: types aggressively (arm animation intensifies), head shakes once
- Thinking: pauses typing, looks up (head raises 1px), finger hovers for 8 frames

---

### Character: Henry (Holographic/Ghost NPC)

**Sprite size:** 10x16 game pixels (30x48 at S=3)
**Anchor point:** Bottom-center (5, 16)
**Description:** Translucent/ghostly scientist from a previous experiment. Blue-tinted with 50% opacity (achieved in engine via semi-transparent fill). Floats 2px off ground.

**Idle Cycle — 16 frames**
- Float animation: body moves ±2px vertically over 16 frames (slow sine wave)
- Holographic flicker: every 20-40 frames, a random row of pixels disappears for 1 frame
- Translucency: all Henry pixel draws use ctx.globalAlpha = 0.65
- Edge glow: 1px border pixels rendered at lower alpha than body

**Walk Cycle — 8 frames (really a glide cycle)**
- Legs barely move — Henry's forward motion is implied by upper body lean
- Body tilts 2px forward in direction of travel
- Trailing effect: 2px ghost trail behind Henry (3 frames of position history at 30% alpha)
- Foot/leg area: fades out at bottom (lowest 3px rows at decreasing alpha)

**Emotional Reactions:**
- Excited: glow intensifies (all pixels +20% brightness), floats 2px higher, flickers rapidly (happy static)
- Sad: dims (all pixels -20% brightness), sinks to ground level, flicker slows
- Angry: red tint (color shifts toward #ff8888), intense flicker, edges sharp (less translucent)
- Thinking: holographic data display appears beside Henry's head — small 4x4 grid of dots that rearrange

**Special — Phase ability:**
- Fade-out: alpha 0.65 → 0.3 → 0.0 over 6 frames
- Phase-through: invisible for 4 frames (obstacle passed through)
- Fade-in: 0.0 → 0.3 → 0.65 over 6 frames
- Total phase: 16 frames = 267ms

---

*Encyclopedia Version 1.0 | BitBio Animation Division | 2026*
*Cross-reference: DESIGN-RULES.md (especially Rules 1, 8, 12, 15, 20) | tools/animation-validator.ts*
