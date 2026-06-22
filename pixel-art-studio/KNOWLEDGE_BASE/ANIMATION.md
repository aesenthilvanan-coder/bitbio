# Animation Principles — Pixel Art Knowledge Base

---

## The 12 Principles Applied to Pixel Art

Disney's 12 principles of animation (from "The Illusion of Life") translate directly to pixel art with specific pixel-art adaptations.

### 1. Squash and Stretch
**Classical:** Objects compress under force and elongate under momentum.
**Pixel art adaptation:** True squash/stretch requires redrawing the sprite at a different aspect ratio each frame — very expensive. Most pixel artists simulate it by:
- Shifting pixel rows (compress top, expand bottom for landing squash)
- Adding 1-2 pixels in the direction of stretch
- Using color changes (brighter on compressed side) to imply 3D deformation

**BitBio use:** Player jump landing — during the landing frame, player sprite is 2px shorter than standing (push top pixels down 1, merge bottom 2 rows). No full redraw needed.

### 2. Anticipation
**Classical:** Action is preceded by movement in the opposite direction.
**Pixel art adaptation:** 1-3 frames of opposite-direction movement before the main action.

**BitBio frame timing for anticipation:**
- Fast attack (Enzyme pounce): 2 anticipation frames
- Medium attack (boss attack wind-up): 3-4 frames crouch/recoil
- Heavy attack (boss special): 6-8 frames, includes glow/particle buildup

**OMORI mastery:** OMORI uses anticipation almost exclusively as its animation vocabulary. Still poses → tiny anticipation movement → POW, attack lands. The extreme contrast makes impacts feel enormous.

### 3. Staging
**Classical:** Positioning characters for maximum clarity of action and emotion.
**Pixel art adaptation:** Which frame of animation do you hold the longest? That's your staging. The held frame should communicate the emotional peak.

At 60fps in BitBio, "staging" a frame means giving it 6-8 frame duration. Holding on the reaction frame after a hit, rather than immediately resuming idle, stages the impact.

### 4. Straight Ahead vs Pose to Pose
**Classical:** Straight ahead = animate frame by frame following action. Pose to pose = draw keyframes first, fill in-betweens.
**Pixel art:** Pose to pose is almost universal because in-betweening is done manually, not by computer.

**BitBio workflow:** Draw idle pose → draw peak-action pose → draw in-between. For walk cycles: draw two stride extremes (left foot forward, right foot forward) → draw passing pose → fill contact and down positions.

### 5. Follow-Through and Overlapping Action
**Classical:** Parts of a body continue moving after the main body stops.
**Pixel art adaptation:** Hair, tails, clothing edges should continue to animate 2-4 frames after the body stops.

**Enzyme implementation:** Enzyme's tail continues to arc 2 frames after Enzyme stops walking. The tail wag uses sin(time * 0.1) with 2-frame delay behind the body's stop/start.

### 6. Slow In / Slow Out (Easing)
**Classical:** Actions accelerate and decelerate naturally.
**Pixel art adaptation:** Spend more frames near the start and end of a motion (where movement is slow), fewer frames in the middle (where movement is fast).

**Frame distribution example for a 1-tile jump arc (8 frames):**
- Frame 1: rise 1px (slow start)
- Frame 2: rise 3px
- Frame 3: rise 5px (peak speed)
- Frame 4: rise 2px (near apex)
- Frame 5: fall 2px (start of descent)
- Frame 6: fall 5px
- Frame 7: fall 4px
- Frame 8: land (impact frame, squash)

### 7. Arcs
**Classical:** Natural motion follows curved paths, not straight lines.
**Pixel art:** Arms, legs, and projectiles should move on arc paths. Jumping should follow a parabola, not a V-shape.

### 8. Secondary Action
**Classical:** Supporting movements that reinforce the main action.
**Pixel art:** Elliot's head bob while walking. Alex's coffee cup wobbles when she reacts. Ben's sandwich hand rises slightly when he speaks.

These secondary actions are +2-4 frames of secondary element movement layered on top of the primary body animation. BitBio implements them by independently oscillating the secondary element's draw offset.

### 9. Timing
**Classical:** Number of frames per action determines its feeling (speed, weight, mood).
**Pixel art:** THIS IS THE MOST IMPORTANT PRINCIPLE FOR PIXEL ART. Frame count control is everything.

### 10. Exaggeration
**Classical:** Push key poses beyond realism for visual punch.
**Pixel art:** Since sprites are already abstracted, exaggeration means extreme posing at keyframes — lean further, stretch more, squash harder than seems physically plausible.

### 11. Solid Drawing
**Classical:** Characters maintain 3D form and weight.
**Pixel art:** Preserve consistent character proportions across all animation frames. The head stays the same size in all frames. The character reads as the same entity.

**Failure mode:** "Drift" — where a character's features subtly shift position between frames, making the animation feel wobbly or "melting." Prevent by anchoring the feet/bottom of sprite to a consistent Y position.

### 12. Appeal
**Classical:** Characters have a quality that draws viewer attention.
**Pixel art:** A sprite with personality has an asymmetry, a quirk, a distinctive feature at rest. Enzyme at idle tilts her head 1px to one side. Henry at idle has one eye slightly different from the other (circuit artifact). These tiny things make sprites feel alive.

---

## Frame Timing Reference Tables

### Player Character
| Animation | Total Frames | Duration (@ 60fps) | Notes |
|-----------|-------------|---------------------|-------|
| Idle | 60 frames loop | 1.0 sec | Subtle breathing bob |
| Walk (one step) | 8 frames | 0.13 sec | 4 step cycle = 32f |
| Run (one step) | 6 frames | 0.10 sec | 4 step cycle = 24f |
| Jump rise | 4 frames | 0.07 sec | |
| Jump fall | 4 frames | 0.07 sec | |
| Land (squash) | 3 frames | 0.05 sec | Hold 8f post-land |
| Hurt flash | 12 frames loop | 0.20 sec | Alternating visible/invisible |
| Celebrate | 30 frames | 0.50 sec | Arms up, bob, hold |
| Node interact | 6 frames | 0.10 sec | Lean toward node, glow |

### Enzyme (Cat Companion)
| Animation | Total Frames | Duration | Notes |
|-----------|-------------|----------|-------|
| Idle | 80 frames loop | 1.33 sec | Tail wag + occasional blink |
| Walk (one step) | 10 frames | 0.17 sec | Smooth cat gait |
| Head tilt | 15 frames | 0.25 sec | Triggered by player stopping |
| Blink | 4 frames | 0.07 sec | Occurs every 80-120 frames |
| Tail wag | Continuous sin wave | — | Amplitude: 2px, period: 40f |
| Pounce | 12 frames | 0.20 sec | 3 anticipation, 3 air, 3 land, 3 settle |

### NPCs (Elliot, Ben, Alex, Henry)
| Animation | Total Frames | Duration | Notes |
|-----------|-------------|----------|-------|
| Idle | 60 frames loop | 1.0 sec | Gentle head bob, 1px amplitude |
| Talking | 4 frames loop | 0.07 sec | Mouth open/close cycle |
| Surprised | 8 frames | 0.13 sec | Jump 2px, widen eyes |
| Celebrate | 24 frames | 0.40 sec | Arms up, bob |

### Boss Animations
| Animation | Total Frames | Duration | Notes |
|-----------|-------------|----------|-------|
| Idle phase | 90 frames loop | 1.5 sec | Threatening idle, minimal movement |
| Anticipation | 6-10 frames | 0.10-0.17 sec | Telegraph attack direction |
| Attack | 3-5 frames | 0.05-0.08 sec | Fast, impactful |
| Impact hold | 8 frames | 0.13 sec | POST-attack, hold pose |
| Hurt stagger | 12 frames | 0.20 sec | Color flash + offset |
| Death | 45-60 frames | 0.75-1.0 sec | Dramatic decomposition sequence |

### VFX
| Effect | Total Frames | Duration | Notes |
|--------|-------------|----------|-------|
| Hit spark | 6 frames | 0.10 sec | Star burst → fade |
| XP burst | 12 frames | 0.20 sec | Number rises, fades |
| Node glow | 30 frames loop | 0.50 sec | Pulsing brightness |
| Boss explosion | 30 frames | 0.50 sec | Expanding ring → particles |
| Dialogue appearance | 6 frames | 0.10 sec | Box slides in from bottom |
| Screen flash | 3 frames | 0.05 sec | Full white then fade |

---

## Walk Cycle Construction

### 4-Frame Walk Cycle (Minimal)
Used for: Small sprites where 8-frame budget isn't possible.

```
Frame 1: CONTACT (right foot forward, left foot back, arms neutral)
Frame 2: DOWN (weight on right foot, body lowest point)
Frame 3: PASSING (feet together, body highest point)  
Frame 4: HIGH (left foot forward, right foot back, arm swing peak)
→ mirror and repeat
```

In BitBio's 4-directional walk, each direction has its own 4-frame cycle:
- **Down-facing walk:** Front view, feet alternate, arms swing
- **Left-facing walk:** Side view, this is the standard animation reference
- **Right-facing walk:** Mirror of left (use `ctx.scale(-1, 1)` before drawing)
- **Up-facing walk:** Back view, similar to front but show back of head/coat

### 8-Frame Walk Cycle (Full)
Adds: contact-down (mid-fall to weight-bear), up (lift from down), passing (feet together), high (peak of next step). Each step uses 4 frames, so 8 total = left-step + right-step.

**BitBio player walk cycle (side view, 8 frames):**
- Frame 1: Right foot contact (heel touch ground)
- Frame 2: Down position (knee bent, foot flat)
- Frame 3: Passing (feet together, arms mid-swing)
- Frame 4: High position (left foot lifts, right pushes off)
- Frame 5: Left foot contact (mirror of 1)
- Frame 6: Down (mirror of 2)
- Frame 7: Passing (mirror of 3)
- Frame 8: High (mirror of 4)

---

## Smear Frames

A smear frame is a motion-blur approximation: the sprite is dramatically stretched or distorted for a single frame (1-3 frames max) to convey extreme speed.

### CrossCode Smear Technique
CrossCode uses very fast character dashes. The smear is achieved by:
1. Drawing the sprite normally
2. Adding 2-4 "ghost" copies behind it, at increasing opacity reduction
3. These ghosts are 25%, 50%, 75% transparent versions of the previous frame position

### Celeste Smear Technique
Madeline's hair in Celeste acts as a permanent speed indicator — it streams behind her during movement, creating an implicit smear effect without distorting the body sprite.

### BitBio Smear Application
- **Player dash ability:** Draw 2 ghost copies at 40% / 20% opacity, offset by 4px behind movement direction
- **Boss attacks:** During boss's fast attack frames, draw smear-blur trail on the attacking limb

---

## Impact Frames

The single most important frame in an attack animation. The impact frame is when the attack actually connects. Rules:

1. **Hold the impact frame for 4-6 frames** — never just 1 frame, or the hit feels fake
2. **Screen flash:** 1-2 frame full white or near-white flash at moment of impact
3. **Camera shake:** 3-5 frames of 2-4px offset shake (use `canvas.style.transform`)
4. **Hit spark VFX:** 6-frame star burst at point of contact
5. **Enemy pause:** The enemy stalls for 3-4 frames (hitlag) — no movement

**OMORI mastery:** OMORI's combat uses extremely long hitlag (6-10 frames of total freeze at impact). This is jarring the first time and deeply satisfying thereafter.

---

## VFX Animation Patterns

### Hit Sparks
```
Frame 1: 4 lines radiating from center, 3px each
Frame 2: 6 lines radiating, 4px each, brighter
Frame 3: 6 lines + small star shape at center
Frame 4: Lines fading, star remains
Frame 5: Small cross at center, lines gone
Frame 6: Cross fades to nothing
```

### Dust Cloud (Landing)
```
Frame 1: Small white puff at feet, 4px diameter
Frame 2: Expands to 8px, gray edges
Frame 3: Expands to 12px, fading
Frame 4: 14px, mostly transparent
Frame 5-6: Gone
```

### Magic Circle / Node Pulse
The node pulse used in BitBio's overworld:
```
Continuous: sin(time * 0.1) drives brightness between 80% and 100%
Every 90 frames: Emit 1-ring outward pulse over 12 frames (expanding, fading ring)
```

---

## Undertale Emotion Through Animation

Undertale communicates character emotion almost entirely through a sprite's EYES. The body pose changes very rarely. Instead:

- **Frisk normal:** Closed arc eyes
- **Frisk determined:** Same, but shine pixel added
- **Sans happy:** Two dot eyes (. .)
- **Sans concerned:** One eye raised (. °)  
- **Sans angry (rare):** Square eye (□ □) or empty sockets
- **Toriel normal:** Large maternal eyes
- **Toriel grief:** Eye line droops, no pupils
- **Undyne smiling:** Visible single fang, single star eye
- **Undyne angry:** Furrowed brow, single pupil eye, battle scar visible
- **Alphys:** Eyes always anxious (worried curve), glasses on or off changes vulnerability

**Rule derived:** In dialogue portraits, dedicate 3-4 pixels to eyebrow position and 2-3 pixels to eye shape. Varying ONLY these across 4-6 "emotion states" for each NPC covers 90% of needed emotional range.

**BitBio application:**
- Elliot's dialogue portrait eye states: Normal (round circles) → Excited (star shape) → Embarrassed (closed curves)
- Henry's eye states: Normal (round circles, slight glow) → Flicker (square pixels, scan line) → Teaching (one eye larger, emphasizing)

---

## OMORI Still-Frame Aesthetic

OMORI's "White Space" segments use almost no animation. Characters stand in black void, perfectly still. When they move, it's abrupt — teleportation rather than walking.

This creates:
1. **Dissociation:** The stillness mirrors the protagonist's emotional numbness
2. **Tension:** You wait for movement to happen. When it does, it's alarming.
3. **Efficiency:** Fewer sprites needed. More budget for expression variation.

**When to use this in BitBio:**
- Boss pre-battle cutscene: Boss appears perfectly still for 1 full second before ANY movement
- Game over screen: Player sprite frozen mid-hurt pose
- Any moment of narrative significance: Freeze all animation except the key emotional element
