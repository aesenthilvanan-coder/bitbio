# Art Research Division — Sprint Backlog
**BitBio Pixel Art Studio | Art Research Division**
*Sprint 1 | Updated: 2026-06-15*

---

## Division Mission
The Art Research Division's mandate is to maintain, expand, and operationalize BitBio's pixel art knowledge base. We translate inspiration from reference games into actionable specifications for the Sprite, Environment, Animation, and QA divisions.

**Director:** Art Research AI Agent
**Intake source:** MASTER-KNOWLEDGE.json, game analyses, pixel art community resources
**Output consumers:** sprite-division, environment-division, animation-division, qa-division

---

## SPRINT 1 PRIORITY TASKS

### P0 — Critical / Blockers

---

**[ART-001] Establish BitBio Master Palette v1.0**
*Priority: P0 | Estimate: 3 days | Assignee: TBD*

The game currently has no defined color palette. This blocks all sprite and environment work.

**Deliverable:** `/pixel-art-studio/knowledge-base/palettes/BITBIO-MASTER-PALETTE.json`

Tasks:
- [ ] Define base palette of 32 colors covering: skin tones (3 variants), hair colors (6), UI neutrals (5), biological environment hues (10), effect colors (4), UI accent colors (4)
- [ ] Create 4 zone sub-palettes derived from master: Cardiovascular, Neural, Digestive, Immune System
- [ ] Define palette ramp for each base color (shadow → midtone → highlight → specular)
- [ ] Validate palette using VALIDATION-CRITERIA.json contrast checks
- [ ] Export palette as .hex reference file for Aseprite/Libresprite

**Reference:** `knowledge-base/palettes/GAME-PALETTES.json` — Undertale core, Pokemon B/W palettes

---

**[ART-002] Player Character Sprite Spec Document**
*Priority: P0 | Estimate: 2 days | Assignee: TBD*

No formal spec exists for the BitBio player character sprite. Without this, the Sprite Division cannot produce canon character art.

**Deliverable:** `/pixel-art-studio/departments/sprite-division/PLAYER-CHARACTER-SPEC.md`

Tasks:
- [ ] Decide canonical sprite dimensions (recommend 16x32 or 24x40)
- [ ] Document silhouette requirements (must be readable in pure black at 1x scale)
- [ ] Define 4-direction walk cycle frame count (recommend 4 frames per direction)
- [ ] Specify idle animation (recommend 2-4 frame breathing bob)
- [ ] Define color list: max 12 colors for player, including 3-tone shading on all major elements
- [ ] Establish head-body-legs proportion ratio (recommend 1:1.5:1)
- [ ] Create pose reference sheet (standing, walking L/R/U/D, hurt, attack)

**Reference:** `knowledge-base/games/UNDERTALE-ANALYSIS.md` (Frisk section), `knowledge-base/games/POKEMON-BW-ANALYSIS.md` (B/W sprite style section)

---

**[ART-003] Zone 1 Environment Tile Spec (Cardiovascular Zone)**
*Priority: P0 | Estimate: 4 days | Assignee: TBD*

The first playable zone needs tile specifications before environment artists can begin.

**Deliverable:** `/pixel-art-studio/departments/environment-division/ZONE-01-CARDIOVASCULAR-SPEC.md`

Tasks:
- [ ] Define floor tile base design (blood vessel floor texture, red-organic theme)
- [ ] Define wall tile system (arterial walls, endothelium texture)
- [ ] Specify interactive object tiles: RBC (red blood cell) NPC sprite, white blood cell, platelet
- [ ] Define path-vs-hazard contrast ratio (must hit ≥3:1 from Pokemon B/W lesson)
- [ ] Create tile variation rules (how much variation between tiles, max 20% deviation from base)
- [ ] Specify ambient particle system: floating RBCs in background
- [ ] Define depth layers: 3 mandatory (void background / wall structure / floor)

**Reference:** `knowledge-base/games/POKEMON-BW-ANALYSIS.md` (tile system), `knowledge-base/palettes/GAME-PALETTES.json` (Undertale Hotland for industrial-organic feel)

---

### P1 — High Priority / Sprint 1 Core

---

**[ART-004] Enemy Visual Design Framework**
*Priority: P1 | Estimate: 3 days | Assignee: TBD*

BitBio needs a taxonomy of enemy types with visual design rules per type.

**Deliverable:** `/pixel-art-studio/departments/sprite-division/ENEMY-DESIGN-FRAMEWORK.md`

Tasks:
- [ ] Define 4 enemy archetypes: Pathogen (virus/bacteria), Mutant (cancer cell), Environmental (toxin), Boss
- [ ] Write visual rule set per archetype (color language, silhouette shape, size)
- [ ] Define color-danger scale: benign NPC = green-tinted; hostile = red-tinted; neutral = gray
- [ ] Specify minimum silhouette differentiation between enemy types (no two enemies same silhouette)
- [ ] Define boss vs. minion visual hierarchy rules (boss = 3x+ area of minion)
- [ ] Create "biology to pixel art" translation guide for cell types

**Reference:** `knowledge-base/games/UNDERTALE-ANALYSIS.md` (enemy design patterns section)

---

**[ART-005] UI/HUD System Specification**
*Priority: P1 | Estimate: 2 days | Assignee: TBD*

No consistent UI system has been established. Health bars, menus, and dialogue boxes need specs.

**Deliverable:** `/pixel-art-studio/departments/sprite-division/UI-HUD-SPEC.md`

Tasks:
- [ ] Specify health bar design (pixel art health bar, not CSS bar — recommend 80px wide, 8px tall, 3 colors)
- [ ] Define dialogue box specs (dimensions, colors, font, letter-by-letter or full text)
- [ ] Specify battle menu layout (adapt Undertale's 4-option grid OR Pokemon's list)
- [ ] Define color state system: HP bar = green → yellow → red as health decreases
- [ ] Specify achievement/notification popup design
- [ ] Define minimap style (if applicable) — recommend removing minimap and using zone ambient cues instead

**Reference:** `knowledge-base/games/UNDERTALE-ANALYSIS.md` (dialogue box section)

---

**[ART-006] Animation Standards Document**
*Priority: P1 | Estimate: 2 days | Assignee: TBD*

The Animation Division lacks formal standards. Frame rates, impact frames, and timing guidelines are undefined.

**Deliverable:** `/pixel-art-studio/departments/animation-division/ANIMATION-STANDARDS.md`

Tasks:
- [ ] Define global animation frame rate (recommend 12fps for movement, 24fps for impact)
- [ ] Specify walk cycle: 4-frame, timing per frame (recommend 100ms per frame)
- [ ] Specify idle cycle: 2-4 frame breathing bob (recommend 300ms per frame)
- [ ] Define impact frame requirements: all attacks must have 1 "squash" impact frame
- [ ] Specify hit reaction animation: 2-frame white flash + 1-frame recoil
- [ ] Define death animation: 4-frame + fade OR disintegration effect
- [ ] Specify attack wind-up/release structure: anticipation → attack → recovery

**Reference:** `MASTER-KNOWLEDGE.json` (animation section)

---

**[ART-007] Undertale Combat System Visual Reference Analysis**
*Priority: P1 | Estimate: 1 day | Assignee: TBD*

Expand the Undertale analysis with specific combat visual data (bullet patterns, SOUL movement, attack box specs).

**Deliverable:** Addition to `knowledge-base/games/UNDERTALE-ANALYSIS.md` (or separate `UNDERTALE-COMBAT-ANALYSIS.md`)

Tasks:
- [ ] Document the bullet/attack zone box (pixel dimensions of the fight arena)
- [ ] Catalog 10 attack pattern types (bullet types, colors, patterns)
- [ ] Analyze how attack difficulty is communicated visually (color, speed, density)
- [ ] Document SOUL movement feel (acceleration, deceleration)
- [ ] Translate these into BitBio combat design recommendations

---

### P2 — Medium Priority / Sprint 1 Stretch

---

**[ART-008] Celeste and Hyper Light Drifter Environment Analysis**
*Priority: P2 | Estimate: 2 days | Assignee: TBD*

Add deep-dive analyses for the remaining two high-value reference games.

**Deliverable:** `knowledge-base/games/CELESTE-ANALYSIS.md` + `knowledge-base/games/HLD-ANALYSIS.md`

Tasks:
- [ ] Document Celeste's zone-per-chapter palette system in full
- [ ] Analyze Madeline vs. Badeline visual differentiation technique
- [ ] Document Hyper Light Drifter's silhouette-against-bloom technique
- [ ] Document HLD's use of post-processing (glow, scanlines) on pixel art
- [ ] Extract "atmospheric post-effects on pixel art" techniques list for BitBio

---

**[ART-009] Stardew Valley Seasonal Palette System Deep Dive**
*Priority: P2 | Estimate: 1 day | Assignee: TBD*

Extract Stardew's seasonal color shift system for potential application to BitBio's "biological state" variation.

**Deliverable:** Addition to `knowledge-base/palettes/GAME-PALETTES.json` + new `knowledge-base/principles/SEASONAL-PALETTE-SYSTEMS.md`

Tasks:
- [ ] Document how Stardew switches the same tile art between 4 seasonal palettes
- [ ] Map this to BitBio's concept: same cell could look healthy (spring-like) or diseased (autumn-like)
- [ ] Create a "biological state palette" concept document

---

**[ART-010] Pixel Art Font System Research**
*Priority: P2 | Estimate: 1 day | Assignee: TBD*

BitBio needs a pixel art font system. Currently using system fonts which look inconsistent.

**Deliverable:** `/pixel-art-studio/knowledge-base/principles/PIXEL-FONTS-REFERENCE.md`

Tasks:
- [ ] Catalog 5 pixel art fonts usable in web context (or as sprite fonts)
- [ ] Analyze Undertale's font (7px tall, monospace, readable at all scales)
- [ ] Analyze Pokemon's font (8px tall, proportional spacing)
- [ ] Recommend font for BitBio dialogue (readability at small size) vs. headers
- [ ] Document sprite font vs. bitmap font tradeoffs

---

**[ART-011] Final Fantasy VI and Golden Sun Sprite Analysis**
*Priority: P2 | Estimate: 2 days | Assignee: TBD*

SNES-era JRPGs with complex overworld + battle sprite systems relevant to BitBio's RPG structure.

**Deliverable:** `knowledge-base/games/FF6-ANALYSIS.md` + `knowledge-base/games/GOLDEN-SUN-ANALYSIS.md`

Tasks:
- [ ] Document FF6's 16x24 battle sprite system
- [ ] Analyze the "Kefka effect" — how color/palette alone signals villain energy
- [ ] Document Golden Sun's "Djinn" system visual design (elemental visual language)
- [ ] Extract "elemental visual differentiation" rules for BitBio's biological type system

---

### P3 — Low Priority / Backlog

---

**[ART-012] EarthBound Psychedelic Transition Effect Research**
*Priority: P3 | Estimate: 1 day*
Research EarthBound's battle background palette-cycling technique. Evaluate feasibility for BitBio's "diseased zone" ambient effects.

**[ART-013] Castlevania Aria of Sorrow Boss Design Analysis**
*Priority: P3 | Estimate: 1 day*
Deep analysis of AoS boss design — specifically how they create "large and threatening" feel on GBA hardware. Relevant to BitBio's organ-boss design.

**[ART-014] Fire Emblem GBA Portrait System Analysis**
*Priority: P3 | Estimate: 1 day*
FE GBA's character portrait system (the large face portraits in dialogue) is the gold standard for expressive pixel art portraits at ~60x80px. Research for BitBio's character portrait system.

**[ART-015] Sea of Stars and Eastward Environment Analysis**
*Priority: P3 | Estimate: 2 days*
Both modern (2022-2023) games pushing the pixel art aesthetic envelope. Sea of Stars' time-of-day lighting system and Eastward's post-apocalyptic color grading are relevant to BitBio's environmental design aspirations.

**[ART-016] CrossCode Tileset Construction Research**
*Priority: P3 | Estimate: 1 day*
CrossCode uses an advanced tile stacking system that creates convincing 3D environments from 2D tiles. If BitBio wants height variation in environments, CrossCode is the reference.

**[ART-017] Pixel Art Tool Configuration Guide**
*Priority: P3 | Estimate: 0.5 days*
Document the recommended tool setup for BitBio's artists: Aseprite settings, palette file setup, export settings, scale factors for web delivery.

---

## BACKLOG METRICS

| Priority | Count | Total Estimate |
|----------|-------|----------------|
| P0 (Critical) | 3 | 9 days |
| P1 (High) | 4 | 8 days |
| P2 (Medium) | 4 | 6 days |
| P3 (Low) | 6 | 6.5 days |
| **Total** | **17** | **29.5 days** |

---

## DEFINITION OF DONE

A research task is DONE when:
1. The deliverable file exists at the specified path
2. The content contains actionable specifications (not just descriptions)
3. At least one "BitBio Application" section is included
4. The document has been cross-referenced from MASTER-KNOWLEDGE.json
5. Any new color hex values have been added to GAME-PALETTES.json

A design spec task is DONE when:
1. Exact dimensions are specified (not "roughly" or "approximately")
2. Exact hex colors are specified
3. The spec passes all applicable checks in VALIDATION-CRITERIA.json
4. The Sprite or Environment Division acknowledges receipt

---

## SPRINT 1 SUCCESS CRITERIA

Sprint 1 is successful if:
- [ART-001] Master Palette v1.0 is finalized — ALL subsequent art must use this palette
- [ART-002] Player character spec exists and can be handed to a pixel artist immediately
- [ART-003] Zone 1 tile spec exists and environment work can begin
- [ART-004] Enemy framework exists and enemy design can begin
- Validation criteria from VALIDATION-CRITERIA.json is being applied to all new art
