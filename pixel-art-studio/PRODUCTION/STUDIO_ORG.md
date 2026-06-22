# BitBio Pixel Art Studio — Organization & Backlogs

## Org Chart

```
Executive Director (Product Vision)
├── Art Research Division
├── Sprite Division
├── Animation Division
├── Environment Division
├── Tooling Division
├── QA Division
└── Production Division
```

---

## Art Research Division

**Mission:** Reverse-engineer pixel art techniques from reference games. Convert observations into formal documented rules in KNOWLEDGE_BASE/. Alert other divisions when new techniques should be adopted.

**Current Sprint (S5):**
- [x] SPRITE_DESIGN.md — Silhouette theory, anatomy, dithering, game-by-game analysis
- [x] ANIMATION.md — 12 principles, frame timing tables, walk cycles, VFX
- [x] COLOR_THEORY.md — HSB, hue shifting, value ramps, game palettes, bioluminescence
- [x] ENVIRONMENT_DESIGN.md — Tile systems, layer separation, realm-specific specs
- [x] TECHNICAL_SPECS.md — Canvas API, SCALE system, coordinate transforms

**Next Sprint (S6) Backlog:**
- [ ] Analyze CrossCode specifically for multi-layer parallax technique documentation
- [ ] Deep-dive OMORI white space for "stillness as design" implementation guide
- [ ] Document Sea of Stars timeline for NPC portrait quality bar
- [ ] Analyze Golden Sun's elemental summon animations for VFX inspiration
- [ ] Write PIXEL_ART_TOOLS.md — comparison of common tools (Aseprite, LibreSprite, etc.) for future asset pipeline

**Permanent Responsibilities:**
- Update KNOWLEDGE_BASE files when any art decision is made that contradicts existing rules
- Create analysis files for any new reference game identified
- Run annual knowledge base review to check for outdated rules

---

## Sprite Division

**Mission:** Implement all character sprites as Canvas 2D draw functions in PixelWorldEngine.tsx. Each sprite must pass the TOOLS/sprite_validator.ts quality check with score ≥ 75 before being considered complete.

**Completed Sprites:**
| Sprite | Status | Validator Score | Notes |
|--------|--------|----------------|-------|
| Player (generic) | ✅ Done | ~82 est. | 4-directional walk, celebrate, hurt |
| Elliot | ✅ Done | ~85 est. | Lab coat, glasses, mismatched socks |
| Ben | ✅ Done | ~80 est. | Hoodie, sandwich prop |
| Alex | ✅ Done | ~80 est. | Turtleneck, coffee cup, steam |
| Henry | ✅ Done | ~88 est. | Holographic alpha, scanlines, orbiting particles |
| Enzyme | ✅ Done | ~83 est. | Cat, tail wag, blink, walk |

**In-Progress:**
| Sprite | Status | Priority |
|--------|--------|----------|
| Boss: LYSO (Realm 1) | 🔄 Partial | HIGH |
| Boss: VIRON (Realm 2) | 🔄 Partial | HIGH |
| Boss: OVERFIT (Realm 3) | 🔄 Partial | MEDIUM |
| Boss: AMYLOID TYRANT (Realm 4) | 🔄 Partial | MEDIUM |

**Backlog:**
- [ ] NPC dialogue portraits (Elliot, Ben, Alex, Henry) — larger scale versions (72×72 canvas px in dialogue box)
- [ ] Elliot emotion state variants: excited, embarrassed, worried, proud
- [ ] Ben emotion state variants: enthusiastic, mouth-full, focused
- [ ] Alex emotion state variants: impressed, dismissive, excited
- [ ] Henry emotion state variants: teaching, amused, concerned
- [ ] Enemy sprites for lesson exercises (conceptual: "wrong answer" entity)

**Quality Bar:**
All sprites must score ≥ 75 on sprite_validator.ts. Boss sprites must score ≥ 80. Portrait sprites evaluated separately against BITBIO_SPECS/CHARACTER_DESIGN.md.

---

## Animation Division

**Mission:** Ensure every animated element in the game meets pixel art animation standards. All walk cycles, idle loops, VFX, and boss attacks must pass animation_scorer.ts with score ≥ 75.

**Completed Animations:**
| Animation | Type | Score est. | Notes |
|-----------|------|-----------|-------|
| Player walk (4-dir) | walk | ~78 | 8-frame cycle per direction |
| Player idle (head bob) | idle | ~80 | 2px bob, 60f period |
| Player hurt | hurt | ~72 | 12-frame flicker |
| Player celebrate | celebrate | ~75 | Arms raise, star particles |
| Enzyme idle | idle | ~85 | Tail wag + blink |
| Enzyme walk | walk | ~82 | 10-frame cat gait |
| Henry idle | idle | ~88 | Alpha pulse + scanlines |
| Node pulse | vfx | ~80 | Sin wave + periodic ring |
| Dialogue box entrance | vfx | ~76 | Slide from bottom |

**Backlog (Priority Ordered):**
1. [ ] Boss attack animations — all 4 bosses need 3-phase attack sets
2. [ ] Boss death animations — dramatic, 30+ frame sequences
3. [ ] Player interact animation (lean toward node + glow)
4. [ ] XP burst VFX (number rises, fades)
5. [ ] Hit spark VFX (6-frame star burst)
6. [ ] Screen flash (3-frame white overlay for impact)
7. [ ] Boss hurt animation (stagger + color flash)
8. [ ] Enzyme pounce (player interaction trigger)
9. [ ] NPC "talking" lip animation (mouth open/close in dialogue)
10. [ ] WorldEntryAnimation polish — Enzyme drawing closer sequence

**Frame Timing Governance:**
All animations must use the global `frame` counter (increments 1× per RAF call) rather than local timers. This ensures consistent playback at 60fps.

---

## Environment Division

**Mission:** Maintain and improve the 4 world maps and tile rendering systems. Each realm must have all 5 Signature Environmental Elements from BITBIO_SPECS/REALM_DESIGN.md implemented.

**Current Status:**
| Realm | Map Complete | Tile Rendering | Sig Elements | Score |
|-------|-------------|---------------|--------------|-------|
| 1 Cytoplasm | ✅ | ⚠️ Basic | 2/5 | 40% |
| 2 Genome Forest | ✅ | ⚠️ Basic | 1/5 | 20% |
| 3 Neural Nebula | ✅ | ⚠️ Basic | 1/5 | 20% |
| 4 Protein Cathedral | ✅ | ⚠️ Basic | 2/5 | 40% |

**Priority Backlog (S6):**
1. [ ] Realm 1: Animated acid bubble pools (lysosome `~` tiles)
2. [ ] Realm 1: Microtubule highway cargo animation (`=` tiles)
3. [ ] Realm 1: Mitochondria elongated oval rendering (`T` tiles, bottom area)
4. [ ] Realm 2: DNA double helix tree rendering (dual-trunk + base-pair bars)
5. [ ] Realm 2: Animated RNA river (flowing data packets)
6. [ ] Realm 3: Star-field void animation (`~` tiles)
7. [ ] Realm 3: Platform edge metallic treatment
8. [ ] Realm 3: Synapse bridge pulse animation (`=` tiles)
9. [ ] Realm 4: Alpha-helix pillar rendering (`T` tiles)
10. [ ] Realm 4: Altar floor gold diamond inlay (`*` tiles)

**Technical Debt:**
- Wall tiles (`#`) render identically in all 4 realms — needs per-realm variant rendering
- `T` tiles render as squares — needs per-realm shape (organelle oval, DNA tree, alpha helix pillar, console)
- All `=` tiles use same rendering — needs per-realm variant (highway, bridge, aisle, transept)

---

## Tooling Division

**Mission:** Build and maintain tools that enforce quality standards without requiring manual review.

**Completed Tools:**
| Tool | File | Status |
|------|------|--------|
| Sprite Validator | TOOLS/sprite_validator.ts | ✅ Complete |
| Palette Analyzer | TOOLS/palette_analyzer.ts | ✅ Complete |
| Animation Scorer | TOOLS/animation_scorer.ts | ✅ Complete |
| Sprite Validator (v1) | tools/sprite-validator.ts | ✅ (older version, more detailed) |
| Palette Analyzer (v1) | tools/palette-analyzer.ts | ✅ (older version) |
| Animation Scorer (v1) | tools/animation-scorer.ts | ✅ (older version) |
| Sprite Generator | tools/sprite-generator.ts | ✅ |
| Tileset Generator | tools/tileset-generator.ts | ✅ |
| Dataset Pipeline | tools/dataset-pipeline.ts | ✅ |

**Backlog:**
- [ ] Integration test runner — automated test of all validators against BITBIO_SPRITES and BITBIO_ANIMATIONS
- [ ] CI script — run validators as pre-build check, fail build if any sprite < 75
- [ ] Color consistency checker — ensure sprite colors are sourced from defined palettes
- [ ] Map integrity checker — verify all ASCII maps are exactly 40×28, all tiles valid characters
- [ ] Realm accessibility checker — verify all walkable tiles are reachable from player start

---

## QA Division

### Sprint Review Checklist

Before marking any sprint complete, QA runs this checklist:

**Sprite QA:**
- [ ] All sprites scored via sprite_validator.ts — scores recorded in this document
- [ ] All palettes scored via palette_analyzer.ts — scores recorded
- [ ] Visual silhouette test: screenshot each sprite on white background, invert to black. Recognizable?
- [ ] Scale test: view each sprite at 1× (16px), 2× (32px), and 4× (64px). Readable at all sizes?
- [ ] Animation continuity: does first frame of looping animation match last frame smoothly?
- [ ] Inter-sprite distinctiveness: can you identify each NPC from silhouette alone? (Black-blob test)

**Environment QA:**
- [ ] Walk all 4 realms from player start to all 9 nodes. No stuck tiles?
- [ ] Boss gate reachable in Realm 1?
- [ ] NPC dialogue triggered in all 4 realms?
- [ ] Enzyme follows player throughout all accessible areas?
- [ ] Camera clamp correct — no map edges showing black border?

**System QA:**
- [ ] All 4 boss fights reachable and completable?
- [ ] Boss victory unlocks next realm?
- [ ] All 20 quests auto-detected when conditions met?
- [ ] Daily reward fires on first session of new calendar day?
- [ ] Shop purchases persist across page reload?
- [ ] Research tree nodes unlock and cost correct XP?
- [ ] Codex entries unlock when corresponding lesson nodes completed?

**Performance QA:**
- [ ] All pages achieve 60fps (no dropped frames) on mid-range device?
- [ ] PixelWorldEngine's requestAnimationFrame cleaned up on unmount?
- [ ] No memory leaks after navigating between 4 realms?

### Scoring Records (Updated Each Sprint)

| Sprite | S4 Score | S5 Score | S6 Score | Trend |
|--------|---------|---------|---------|-------|
| elliot | — | est.85 | TBD | — |
| ben | — | est.80 | TBD | — |
| alex | — | est.80 | TBD | — |
| henry | — | est.88 | TBD | — |
| enzyme | — | est.83 | TBD | — |
| player | — | est.82 | TBD | — |

---

## Production Division

### Current Sprint (S5) — Summary
**Sprint Goal:** Landing page Codédex-quality redesign + Pixel Art Studio R&D system

**Deliverables:**
- [x] pixel-art-studio/ directory structure
- [x] KNOWLEDGE_BASE/ — 5 files complete
- [x] BITBIO_SPECS/ — 2 files complete
- [x] TOOLS/ — 3 new validator tools
- [x] PRODUCTION/ — this file + PIPELINE.md
- [ ] app/page.tsx — Codédex-quality landing page (in progress by parent session)

### Milestone Tracker

| Milestone | Target | Status | Completion |
|-----------|--------|--------|-----------|
| M0 — Core game engine | S1 | ✅ | 100% |
| M1 — 4 walkable realms | S2 | ✅ | 100% |
| M2 — NPCs + Enzyme companion | S3 | ✅ | 100% |
| M3 — Boss fights + progression | S3 | ✅ | 100% |
| M4 — Shop, Quests, Codex, Research | S4 | ✅ | 100% |
| M5 — Landing page redesign | S5 | 🔄 | 70% |
| M6 — Pixel Art R&D System | S5 | 🔄 | 85% |
| M7 — Realm tile polish | S6 | ⬜ | 0% |
| M8 — All sprites score ≥ 80 | S6 | ⬜ | 0% |
| M9 — Full lesson content (50 exercises) | S7 | ⬜ | 0% |
| M10 — Polish + playtesting | S8 | ⬜ | 0% |

### Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Canvas perf < 60fps on low-end devices | MEDIUM | HIGH | Profile early; cache complex boss sprites to offscreen canvas |
| Lesson content volume (50 exercises is a lot) | HIGH | HIGH | Scope per realm to 12 exercises (4 realms × 12 = 48 minimum) |
| Sprite quality drift across sprints | LOW | MEDIUM | Automated validator scores in CI |
| Map edge cases (stuck tiles) | LOW | HIGH | Automated accessibility checker |
| Boss fight balance tuning | MEDIUM | MEDIUM | Playtest each boss with 3-5 users after S6 |

### Sprint Velocity
- S1: 3 weeks, 8 major deliverables
- S2: 2 weeks, 6 major deliverables  
- S3: 3 weeks, 10 major deliverables
- S4: 2 weeks, 8 major deliverables
- S5: 1 week (context), 9 major deliverables
- **Trend:** Accelerating. R&D system amortizes future work.
