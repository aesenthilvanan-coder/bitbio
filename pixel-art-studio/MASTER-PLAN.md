# BITBIO PIXEL ART STUDIO — MASTER PLAN
**Production Division | Version 1.0 | June 2026**

---

## EXECUTIVE SUMMARY

BitBio is an educational RPG that teaches molecular biology through a pixel art world players
actually want to inhabit. The game exists — it runs, it has four realms, four bosses, four NPCs,
a player avatar, and a boss battle system. What it does not yet have is pixel art that hits the
visual bar required to make players feel they have entered somewhere worth caring about.

This studio is the production apparatus that closes that gap.

We are not building a game from scratch. We are raising the visual quality of an existing,
functioning game from "programmer art that ships" to "the most visually impressive educational
pixel art RPG ever made." Every asset produced here goes directly into `/components/` and
`/app/` as working TypeScript. There are no separate sprite sheets, no texture atlases — every
pixel is drawn procedurally using `ctx.fillRect()` in canvas rendering functions. That is the
constraint and the art form.

---

## VISION

**BitBio is the Undertale of biology education.**

When someone loads BitBio for the first time, within five seconds they should feel:
- They are inside something alive
- The dark backgrounds and neon accents signal danger and discovery simultaneously
- The pixel art has the same handcrafted intentionality as Undertale or Omori
- Every NPC looks like a character who has a life outside this conversation
- Every boss is a genuine visual threat

The benchmark is not "good for an educational game." The benchmark is: does this stand next to
Undertale's Ruins tileset? Does the Cytoplasm realm feel as alien and beautiful as Omori's
White Space feels quiet and strange? Does the boss LYSO have the same menace as Flowey?

That is the target. This studio exists to get there.

---

## THE 7 PHASES

### Phase 1: Knowledge
**Goal:** Understand what makes reference pixel art great and why the current art falls short.

- Deep analysis of Undertale, Omori, and Pokemon B/W art direction decisions
- Document the specific techniques they use (1-pixel edge lighting, limited palettes,
  silhouette-first design, strategic empty space)
- Honest audit of every current BitBio asset: what score would it receive against our
  quality rubric right now?
- Output: `knowledge-base/` populated with principles, game analysis, palette studies

**Current gap:** The existing code has the right *framework* (dark floors, accent glows, realm
palettes) but executes individual assets without the discipline of silhouette-first design. Boss
sprites read as "blobs with colors" not "characters with presence."

### Phase 2: Extraction
**Goal:** Pull every renderable asset out of the codebase and catalog what exists vs what is
missing.

- Map every `drawXxx()` function in `PixelWorldEngine.tsx` and `BossBattle.tsx`
- Identify which assets have 0 frames vs 2 frames vs 4 frames
- List every tile type across all 4 realms and score the current implementation
- Identify missing assets: kitchen scene, player idle frames 3-4, boss phase-2 sprites,
  death animations, VFX for each boss attack
- Output: `assets/` catalog with current-state scores per asset

### Phase 3: Organization
**Goal:** Sort all work into the three production divisions with clear ownership.

- Sprite Division: all character sprites (player, NPCs, bosses)
- Environment Division: all tiles, backgrounds, ambient animations
- Animation Division: all multi-frame sequences, VFX, UI transitions
- Each division maintains a BACKLOG.json with prioritized tasks
- Output: populated backlogs in `departments/*/BACKLOG.json`

### Phase 4: Tools
**Goal:** Build validation tooling that makes bad art fail automatically.

- `tools/style-checker.ts`: validates color count, pixel size, palette adherence
- `tools/silhouette-tester.ts`: renders asset against gray background to test readability
- `tools/score-asset.ts`: runs asset through QUALITY-RUBRIC.json and outputs score
- `tools/palette-extractor.ts`: extracts colors used by any `drawXxx()` function
- Output: working tools agents can use to self-validate before submitting

### Phase 5: Pipeline
**Goal:** Formalize how an asset goes from "idea" to "merged into the game."

- The 10-step ASSET-PIPELINE.md becomes the law
- Every task in every backlog references pipeline steps
- No asset ships without reaching step 8 (QA sign-off) or scoring >= 8.0
- Output: ASSET-PIPELINE.md with concrete gate criteria at each step

### Phase 6: Perfection Loop
**Goal:** Build the continuous improvement process.

- Assets that ship are not locked — they enter the perfection loop
- Any asset scoring < 8.5 gets an improvement ticket created automatically
- PERFECTION-LOOP.md documents the critique methodology
- Weekly "visual polish" sprints target the lowest-scored shipped assets
- Output: PERFECTION-LOOP.md + improvement ticket process

### Phase 7: Repository
**Goal:** Maintain a living archive of every asset's history.

- Git history is the source of truth for what changed and why
- Each commit touching a `drawXxx()` function includes a score delta comment
- `assets/` directory maintains canonical "approved" versions as documented specs
- New agents can read the repository to understand the art direction without reading
  the entire codebase
- Output: populated `assets/` with spec documents for every approved asset

---

## CURRENT STATE ASSESSMENT

This is the honest evaluation. Scores use our QUALITY-RUBRIC.json 0-10 scale.

### Player Character
**Score: 5.5 / 10**
- Silhouette: generic humanoid rectangle, indistinguishable from any RPG Maker character (2/10)
- Walk cycle: 2 frames (bob up/down). Industry minimum is 4. (4/10)
- Direction awareness: eyes appear in down/left/right but "back of head" is just a hair color
  shift — no rear sprite (3/10)
- Avatar customization (skin, clothes, hair) works correctly and is a genuine feature (8/10)
- Color count: appropriate, uses player-set colors (7/10)
- Action needed: redesign to 32x20 game-pixel body with stronger silhouette, 4 walk frames,
  dedicated back-of-head details

### NPCs (Elliot, Ben, Alex, Henry) in PixelWorldEngine
**Score: 6.5 / 10**
- Each NPC has genuine visual personality (lab coat + mismatched socks for Elliot is good)
- At SCALE=3, the 12x20 game-pixel sprites have reasonable detail
- Henry's holographic transparency effect is the best current asset in the game (8/10)
- Elliot and Ben walk cycles share the same 2-frame leg-shift mechanic — acceptable
- The "looking down" static direction means NPCs feel planted, not alive
- Action needed: add idle animations (2-frame), improve face detail at scale

### Boss Sprites
**Score: 4.5 / 10 (LYSO), 4.0 (VIRON), 5.0 (OVERFIT), 4.5 (AMYLOID TYRANT)**
- LYSO: rows of width data produce a roughly oval shape with spikes. The concept (rogue
  lysosome) is clear. The execution reads as a purple blob. The cristae detail is invisible.
  HP phase color changes (purple → dark purple → near-black) are good mechanics but wrong
  direction — damaged things should look MORE unstable not just darker.
- VIRON: overlapping rectangles produce an icosahedral virus shape in concept only. The
  visual output is indistinguishable boxes. The orbiting spike particles are the strongest
  element.
- OVERFIT: the neural network skull is the most conceptually interesting boss design. The
  execution has the right ingredients (skull + nodes + color-coded eyes) but needs 2x more
  pixel detail to read at the canvas scale used.
- AMYLOID TYRANT: gray stacked sheets convey "beta sheets" correctly but the boss looks
  like a filing cabinet. The fibril tendrils at the top are the saving grace.
- ALL bosses: no phase transitions in sprite art (boss should look damaged at <50% HP,
  not just change tint)

### Tiles — Cytoplasm Realm
**Score: 6.0 / 10**
- Floor: dark teal with checkerboard seam is understated and correct
- Wall: bright top edge + dark sides is exactly Undertale's wall technique — good
- Mitochondria 'T' tile: the bean shape is readable. ATP synthase dots and cristae are nice.
  The red color reads as "danger" not "biology" — should lean into the warm orange-brown of
  real mitochondria
- Lysosome acid pool '~': strong concept, purple pool with green bubbles and danger corners
- Path '=': microtubule highway with animated motor proteins is excellent
- Boss gate 'B': pulsing red arch is appropriately threatening
- Missing: no `~` animation frame variation, no environmental storytelling objects beyond 'T'

### Tiles — Genome Forest Realm
**Score: 5.5 / 10**
- DNA helix 'T' tile: the zigzag backbone with colored base pairs (AT/GC) is the best
  science-art in the entire codebase. Genuinely reads as a helix.
- Water '~': cobalt blue stream with lily pads is charming but tonally inconsistent with a
  "genome forest" — should be more gene-pool/primordial
- Path '=': cobblestone is generic fantasy RPG, not biology-flavored
- Missing: no canopy/forest ceiling tiles, no root structure tiles

### Tiles — Neural Nebula Realm
**Score: 6.5 / 10**
- Crystal neural spire 'T': pulsing glow node is excellent
- Void '~' with stars: appropriately alien
- Neural light bridge '=': glowing platform with animated pulse is the strongest path tile
- Missing: no synaptic gap tiles, no neurotransmitter particle tiles

### Tiles — Protein Cathedral Realm
**Score: 5.0 / 10**
- Gothic stone pillar 'T': functional but generic fantasy
- Crystal pool '~': amethyst pool works but looks identical to Neural Nebula water
- Cathedral aisle '=': the candlelight particle is a great touch, but the cross-hatch pattern
  needs more baroque detail
- Missing: no pew tiles, no stained-glass window tiles, no altar area

### Backgrounds (CytoplasmRealm.tsx)
**Score: 7.5 / 10**
- The animated organelle background is genuinely impressive and sets the biological tone
- Mitochondria with cristae, ribosomes, vacuoles — all correctly rendered
- The ER membrane wave lines are atmospheric
- Nucleus glow in the distance creates depth
- Issue: too smooth (radial gradients are anti-pixel-art). Should be more grid/blocky.
- Issue: opacity of organelles is too low — they fade into the background

### Kitchen Scene
**Score: 0 / 10 — Does Not Exist**
- Referenced in design documents but no `KitchenRealm.tsx` or kitchen tileset exists
- High priority: boss battles take place in realm-specific environments; the "kitchen" scene
  (appears to be a metaphor for cellular metabolism) needs a complete environment

---

## SPRINT 1 DELIVERABLES
**Session goal: Make the Cytoplasm realm and LYSO boss battle pass an 8.0 quality score**

### ENV-001: Cytoplasm tileset upgrade
- Upgrade wall tile 'W' with proper pixel-art brick pattern (top-lit, 2-pixel highlight)
- Upgrade mitochondria 'T': warm orange-brown, visible outer membrane double-layer,
  cristae as light lines, ATP synthase as 3 bright yellow dots, shadow beneath
- Upgrade lysosome acid pool: deeper purple, animated bubble rise, foam ring at edges
- Add proper floor variation: 4 tile variants that tile seamlessly without obvious repetition
- Deliverable: updated `drawTile()` function in `PixelWorldEngine.tsx`

### SPR-001: LYSO boss sprite redesign
- Increase overall pixel budget: use the full 720px canvas width more assertively
- Phase 1 (100-66% HP): bright purple lysosome, visible membrane ridges, 8 rotating spikes,
  single glowing red eye, foam/acid drip at base
- Phase 2 (66-33% HP): cracking membrane, green acid leaking through cracks, eye becomes
  split/fractured, spikes become jagged
- Phase 3 (<33% HP): mostly broken membrane revealing glowing core, 3 eyes, rage state
- Deliverable: updated `drawLyso()` function in `BossBattle.tsx`

### ANI-001: LYSO attack animations
- Hit reaction: boss lurches left/right 8px over 4 frames
- Boss attack: green acid projectile with splash VFX
- Victory burst: purple/green particle explosion, 60+ particles
- Deliverable: updated particle/projectile code in BossBattle game loop

### QA-001: Score all Cytoplasm realm assets
- Run every current Cytoplasm asset through QUALITY-RUBRIC.json
- Document scores in `departments/qa-division/cytoplasm-audit.json`
- Flag anything below 7.0 for iteration before sprint end
- Deliverable: audit document with before/after scores

---

## SPRINT 2-5 ROADMAP

### Sprint 2: Boss Visual Overhaul
- Redesign VIRON to read as an actual icosahedron virus (triangular face planes)
- Redesign OVERFIT with a larger skull, visible neural network as glowing circuitry on face
- Redesign AMYLOID TYRANT with fibril "tentacles" that droop and sway
- Add phase-2 and phase-3 art variants for all 4 bosses
- Upgrade boss arena backgrounds (per-realm arena tile patterns)

### Sprint 3: Player and NPC Polish
- Player: redesign to stronger silhouette, 4-frame walk cycle, 8-directional facing
- Elliot: upgrade in-world sprite to match SVG mascot more closely
- Ben: add sandwich-bite animation in idle
- Alex: add coffee-sip animation in idle
- Henry: improve holographic flicker to use alternating transparent rows (CRT effect)
- All NPCs: add "surprise" animation frame for when player approaches

### Sprint 4: Environment Division — Remaining Realms
- Genome Forest: new DNA canopy tiles, primordial gene-pool water, forest path rewired
- Neural Nebula: synaptic gap tiles, neurotransmitter burst tiles, dark matter void
- Protein Cathedral: pew tiles, stained-glass window, alpha-helix column tiles
- Kitchen Scene: complete new environment — metabolic kitchen aesthetic, dark Undertale style,
  enzyme "appliances", ATP as glowing currency on counters

### Sprint 5: UI and Animation Polish
- Boss HP bar: add segment markers, shake animation on hit, skull icon
- Player hearts: proper pixel-art heart shape (current is filled rectangle — needs curves)
  using `fillRect` to approximate heart silhouette
- Dialogue box: double-border styling matching Undertale's exactly, NPC portrait panel
- World map minimap: realm-specific color coding, boss icon indicator
- Intro sequence: improve IntroEngine with proper cutscene framing panels

---

## SUCCESS METRICS

| Metric | Baseline (now) | Sprint 1 Target | Sprint 5 Target |
|--------|---------------|-----------------|-----------------|
| Cytoplasm realm QA score | 6.0 | 8.0 | 9.0 |
| LYSO boss QA score | 4.5 | 8.0 | 9.0 |
| Player sprite QA score | 5.5 | 6.5 | 8.5 |
| All boss QA scores avg | 4.5 | 5.0 | 8.5 |
| Assets with 0 animation frames | 60% | 50% | 10% |
| Tiles with silhouette score < 7 | 8 tiles | 4 tiles | 0 tiles |
| Kitchen scene exists | No | No | Yes (8.0+) |
| Walk cycle frames (player) | 2 | 2 | 4 |
| "Visual benchmark" tests passing | 0/5 | 2/5 | 5/5 |

### Visual Benchmark Tests (pass/fail)
1. Cytoplasm realm screenshot shown to a stranger — they say "cell biology" without prompting
2. LYSO sprite shown in isolation — looks threatening, not like a purple oval
3. Player walks across the screen — feels like an Undertale-quality walk cycle
4. Genome Forest screenshot — player sees DNA double helix in 'T' tile immediately
5. Any NPC dialogue screenshot — art quality matches the writing quality

---

## RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `fillRect`-only constraint makes complex shapes impossible | Medium | High | The constraint IS the art form. Undertale uses the same approach. Pre-plan all shapes on pixel grid paper before coding. |
| Canvas SCALE=3 means 16px tiles are 48px rendered — hard to add detail | Medium | Medium | Work in game-pixel coordinates (16x16). At SCALE=3 that's 48x48 canvas pixels, plenty for readable detail. |
| Color count creep (too many colors per tile) | High | Medium | Style checker tool enforces max 6 colors per tile tile, 8 per sprite. Automated gate in pipeline. |
| Boss sprite changes break the HP-phase color logic | Low | High | Phase color logic is separate from sprite geometry. Only touch the `drawXxx()` geometry functions; HP-phase tinting remains. |
| Inconsistency between SVG mascots and canvas NPCs | Medium | Medium | SVG mascots are UI-only (MascotDisplay.tsx). Canvas NPCs are world-only (PixelWorldEngine.tsx). They do not need to match exactly — different rendering contexts. Document this as intentional. |
| Animation performance regression | Low | High | All new animations must be profiled at 60fps. No new per-frame object allocations. Use typed arrays for particle pools. |
| Kitchen scene scope creep | High | Medium | Kitchen scene is Sprint 4, not Sprint 1. Do not start until Sprints 1-3 are QA-signed. |
| Agent produces art that works visually but breaks TypeScript | Medium | High | Every delivery must pass `tsc --noEmit`. Pipeline step 5 includes TS type checking. |

---

## TECHNOLOGY STACK DECISIONS

### Rendering Engine
**Canvas 2D API, `ctx.fillRect()` only.** No SVG in game world (SVGs are mascot UI only).
No image sprites. No CSS animations in-game. This is a deliberate art direction choice: the
entire game is procedurally drawn pixel art. This is not a limitation — it is a feature.

Rationale: Undertale is built the same way. `fillRect` forces you to think in pixels, not
paths. Every shape decision is explicit. The code IS the art. This makes assets version-
controllable, searchable, and modifiable by any agent who can read TypeScript.

### Scale System
**SCALE = 3 constant in PixelWorldEngine.tsx.** Game pixels are 16x16. Canvas pixels are
48x48. Boss battle uses CW=720/CH=540 with SCALE=3, giving a 240x180 game-pixel canvas.
All art specs in this studio are written in GAME PIXELS, not canvas pixels.

### Coordinate System
All sprite drawing functions take `(cx, cy)` as the tile origin in canvas pixels. Internal
offsets use `gr()` or `gr2()` helper functions that multiply by SCALE automatically. This is
the correct pattern and must not be changed.

### Color System
- Each realm has exactly one accent color (teal, green, purple, orange)
- All tiles use the `shiftColor()` function for highlight/shadow variants
- No random colors. No gradients except in background/ambient layers.
- Maximum 6 colors per tile, 8 colors per character sprite
- Transparency (`rgba`) is allowed for atmosphere layers only, not for primary shapes

### Animation Budget
- Tiles: 4-frame animation cycle (animFrame 0-3), ticks every 500ms
- Characters: 2-frame walk cycle (walkFrame 0/1), ticks every 150ms
- Bosses: continuous `t` float (seconds elapsed), all animations derived from sin/cos
- Particles: pooled arrays, maximum 100 particles per boss battle
- Performance target: 60fps on a mid-tier laptop at 1080p

### TypeScript Conventions
- All drawing functions are standalone (no class state, no closures over component state)
- Functions receive all needed data as parameters
- No async drawing functions
- New drawing functions must be added alongside existing ones in the same file
- Function naming: `drawXxx(ctx, cx, cy, ...params)` always

---

*Last updated: June 2026 | Production Division Director*
