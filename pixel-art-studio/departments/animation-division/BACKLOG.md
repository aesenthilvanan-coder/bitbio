# Animation Division Backlog
**BitBio Pixel Art Studio | Animation Division**

---

## SPRINT 1 (Current) — Core Character Animations

| Status | Task | Notes |
|--------|------|-------|
| [x] | Player walk cycle (2-frame implemented in PixelWorldEngine) | Basic implementation exists; upgrade to 8-frame target |
| [ ] | Player idle breathing (6-frame) | ±1px chest bob, blink overlay, coat-hem flutter |
| [ ] | Player celebrate pose | Arms raise overhead, 6-frame, see ANIMATION-ENCYCLOPEDIA.md §6 |
| [ ] | Player hurt flash | 4-frame white-flash then red tint; triggered on heart loss |
| [ ] | Enzyme idle (16-frame: tail sway + blink) | See ANIMATION-ENCYCLOPEDIA.md §3 for full spec |
| [ ] | Enzyme walk | 8-frame paw alternation, body bobs ±1px |
| [ ] | Enzyme fly pose | 6-frame wing-beat loop; only unlocked via story |
| [ ] | Enzyme "on head" pose | Static pose riding player's head; blink continues |
| [ ] | Enzyme excited (4-frame jump) | Full-body hop, tail straight up, 4 frames |

**Sprint 1 acceptance criteria:** All core player/Enzyme states playable in-engine at correct timing. Walk cycle upgraded from 2-frame to 8-frame. Player idle breathing implemented.

---

## SPRINT 2 — NPC Animations

| Status | Task | Notes |
|--------|------|-------|
| [ ] | Elliot idle: head bob + blink | 12-frame cycle, glasses glint at frames 3 & 9 |
| [ ] | Elliot walk | 8-frame, long stride, slight forward lean |
| [ ] | Elliot excited reaction | Full-body jump, arms wide, hair floofs |
| [ ] | Elliot sad reaction | Head droops, adjusts glasses (hand-to-face 3 frames) |
| [ ] | Elliot thinking | Chin-stroke animation, 4-frame loop |
| [ ] | Ben idle: weight shift | 8-frame, 1px lateral shift, blink at frames 5-7 |
| [ ] | Ben walk | 8-frame, heavier footfall than player, pronounced arm swing |
| [ ] | Ben excited: fist pump | Right arm raises and pumps, 4 frames |
| [ ] | Ben sad | Hands in hoodie, head down, 1px slouch |
| [ ] | Ben thinking | Scratch-head animation, 6-frame |
| [ ] | Alex idle: typing | 8-frame, double-blink, LED pulse every 12 frames |
| [ ] | Alex walk | 8-frame, brisk (80ms frame hold), minimal arm swing |
| [ ] | Alex excited | Rapid head nod, 3x at 60ms each |
| [ ] | Alex thinking | Stops typing, looks up, finger hover 8 frames |
| [ ] | Henry idle: float + flicker | 16-frame, ±2px sine float, random row-flicker |
| [ ] | Henry glide (walk) | 8-frame, body tilt forward, ghost trail (3 frames position history) |
| [ ] | Henry excited | Intensified glow, float higher, rapid flicker |
| [ ] | Henry phase-through | 16-frame: fade-out 6f, invisible 4f, fade-in 6f |

**Sprint 2 acceptance criteria:** All 4 NPCs have idle + walk + at minimum 1 emotional reaction implemented. Henry's translucency system works at globalAlpha=0.65.

---

## SPRINT 3 — Boss Animations

| Status | Task | Notes |
|--------|------|-------|
| [ ] | LYSO spinning phase 2 | Rotation speed increases with HP loss; needs per-phase variant |
| [ ] | LYSO attack anticipation | 4-frame wind-up minimum (boss-tier attack) |
| [ ] | VIRON spike rotation | Spikes orbit VIRON body; trig-based pixel offset |
| [ ] | VIRON spike launch attack | Individual spikes break orbit and fly at player |
| [ ] | OVERFIT glitch effect | Pixel displacement: random rows offset ±2-4px for 1-2 frames |
| [ ] | OVERFIT phase transition | Screen-wide glitch burst between phases |
| [ ] | AMYLOID TYRANT fibril pulse | Tentacle-like fibril arms pulse (extend 2px, retract) in sequence |
| [ ] | AMYLOID TYRANT aggregate | Final form: multiple AMYLOID units merge (requires composite sprite) |
| [ ] | Boss generic defeat explosion | 8-frame: freeze 2f → burst particles 4f → fade 2f; see CELESTE-ANALYSIS.md §5 |
| [ ] | Boss phase 1 → phase 2 transition | Visual indication of HP threshold crossed; color palette shift |

**Sprint 3 notes:**
- Boss animations need per-phase behavior tied to HP thresholds in the engine
- Boss defeat animation should reference the Celeste death animation pattern (freeze → burst → scatter)
- OVERFIT's "glitch" is unique and valuable — plan for 2-3 variants to avoid repetition

**Sprint 3 acceptance criteria:** All 4 bosses have idle (phase 1 and 2) + attack anticipation + defeat animation. Phase transitions are visually clear.

---

## SPRINT 4 — Environmental Animations

| Status | Task | Notes |
|--------|------|-------|
| [ ] | Realm 1: Mitochondria inner membrane shimmer | 8-frame, parallel line wave animation |
| [ ] | Realm 1: ER ripple (endoplasmic reticulum) | Water-ripple technique, sine wave offset |
| [ ] | Realm 1: Ribosome rotation | 4-frame, 2 ribosome subunits orbiting each other |
| [ ] | Realm 1: Enzyme reaction sparkle | XP-burst style 4-pixel scatter when enzyme active |
| [ ] | Realm 2: DNA helix breathing | Helix scale oscillates ±1px at each row, 12-frame cycle |
| [ ] | Realm 2: Data stream (flowing pixels) | Pixel rain column, top-to-bottom, staggered rows |
| [ ] | Realm 2: Waterfall (chromosomal stream) | 8-frame scrolling blue pixels, parallax |
| [ ] | Realm 2: Petal fall animation | 4-frame flutter, random horizontal drift |
| [ ] | Realm 3: Star twinkle | 4-frame: 1px → 3x3 cross → 5-point star → fade |
| [ ] | Realm 3: Synapse arc | 6-frame: electric arc jumps between 2 points via noise path |
| [ ] | Realm 3: Crystal shimmer (Realm 3 walls) | 8-frame rotating highlight, see ANIMATION-ENCYCLOPEDIA.md §5 |
| [ ] | Realm 4: Stained glass light beams | 16-frame slow sweep, semi-transparent color column |
| [ ] | Realm 4: Protein rotation display | 12-frame trig rotation of backbone trace |
| [ ] | Realm 4: Holographic scan line | 1px bright scan line sweeps downward, 8-frame loop |

**Sprint 4 notes:**
- ALL environmental animations must use time-delta for timing, NOT frame count
- Environmental animations must be frame-rate independent
- Performance budget: environmental animations must not exceed 15% of draw call budget per frame
- Water ripple implementation: see ANIMATION-ENCYCLOPEDIA.md §5

**Sprint 4 acceptance criteria:** Each realm has at minimum 3 distinct environmental animations. All use time-delta timing. Performance tested at 60fps on target hardware.

---

## SPRINT 5 — VFX and Polish

| Status | Task | Notes |
|--------|------|-------|
| [ ] | XP particle burst (gold) | 8 gold particles radiate from collection point, arc upward |
| [ ] | Boss defeat explosion | Per boss-defeat; large version of standard burst |
| [ ] | Correct answer celebration | Green flash + star burst at player position, 6 frames |
| [ ] | Wrong answer visual | Red shake: player sprite offset ±2px for 3 frames |
| [ ] | Heart loss effect | Player burst (small, 3-4 pixels) in white/teal; see CELESTE-ANALYSIS.md §5 |
| [ ] | Level complete fanfare | Screen flash + all current characters do celebration reactions simultaneously |
| [ ] | Realm transition wipe | 16-frame: current scene fades out (circle closing from edges) → new scene fades in |
| [ ] | Dialogue portrait appear | 4-frame slide-in from bottom of screen |
| [ ] | Enzyme fly-to-player | 8-frame arc path from offscreen to player-head position |
| [ ] | Science concept unlock | Burst + name-pop VFX when new science card is learned |

**Sprint 5 notes:**
- VFX animations use ctx.fillRect exclusively — no images, no gradients
- Max 4 colors per VFX flash effect (hard rule from DESIGN-RULES.md)
- VFX must complete in under 500ms total to maintain game feel
- Polish pass: after implementing, playtest all VFX and adjust timing for "game feel"

**Sprint 5 acceptance criteria:** All major game events (level complete, heart loss, correct/wrong answer, boss defeat) have satisfying VFX. All VFX use only ctx.fillRect. All VFX complete in ≤ 500ms.

---

## Known Issues

1. **Boss animations need per-phase behavior:** Boss idle/attack animations must change at HP thresholds (100% → 75% → 50% → 25%). The engine needs a phase variable passed to each boss draw function.

2. **Environmental animations need frame-rate independence:** Current frame-based animation in PixelWorldEngine.tsx ticks on game frame, which means animation speed is tied to frame rate. Refactor to use `delta` time parameter for all environmental animations.

3. **Walk cycle smoothness:** Current 2-frame player walk cycle causes visible "jitter." The 8-frame upgrade in Sprint 1 should resolve this, but will require updating the walk cycle timer logic.

4. **Henry's translucency is not yet in engine:** `ctx.globalAlpha` must be set before Henry draws and restored after. This is a 2-line change but must be verified not to affect other draw calls.

5. **Enzyme "on head" anchor point:** When Enzyme rides the player's head, the anchor calculation must account for the player's walk cycle vertical bob — otherwise Enzyme appears to float off the head during the walk.

---

## Design Principles for the Animation Division

1. **All animations use `ctx.fillRect` only.** No images, no canvas paths, no clip regions — pure rectangle fills at all times.

2. **Idle animations loop at 6-10 second intervals.** Shorter loops feel mechanical; longer loops make characters feel "dead" between loops.

3. **Walk cycles: 8 frames at 10fps = 800ms loop.** This is the studio standard. Variants are explicitly specified (see ANIMATION-ENCYCLOPEDIA.md §2).

4. **Never use more than 4 colors per animation flash effect.** Flash effects (impacts, celebrations, VFX) must be readable in 1-2 frames. More than 4 colors creates visual noise.

5. **Minimum 2 anticipation frames before any attack.** No exceptions. The anticipation communicates intent and makes attacks feel fair.

6. **Secondary actions (tail sway, hair follow-through) are mandatory for living characters.** Enzyme without tail sway, player without coat flutter — these feel like mannequins.

7. **All animations must pass animation-validator.ts before shipping.** Target score: ≥ 75. Do not ship animations scoring below 60.

---

*Backlog Version 1.0 | BitBio Animation Division | 2026*
*Cross-reference: ANIMATION-ENCYCLOPEDIA.md | tools/animation-validator.ts | DESIGN-RULES.md*
