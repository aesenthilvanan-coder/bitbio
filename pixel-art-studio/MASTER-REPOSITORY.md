# BitBio Pixel Art Studio — Master Repository

> The living source of truth for all visual production at BitBio. If you touch art, you read this first.

---

## Project Overview

BitBio is a Canvas-based pixel art educational RPG built in Next.js 16 App Router. The game teaches Python, bioinformatics, ML/AI, and drug discovery through 4 explorable realms. Every visual element — characters, environments, UI, effects — is drawn with `ctx.fillRect()` only (no images, no paths, no arcs in world rendering).

**Visual benchmark:** OMORI + Undertale aesthetic — dark palettes, stark contrast, expressive simple sprites, emotionally resonant color language.

**Technical canvas rules (ENFORCED):**
- PixelWorldEngine and WorldEntryAnimation: `ctx.fillRect()` ONLY
- AvatarRenderer: `ctx.fillRect()` + limited use of ctx.fillStyle alpha (no arcs in game-pixel drawing)
- All canvas elements: `imageRendering: pixelated` + `imageSmoothingEnabled = false`
- Scale constants: S=3 (IntroEngine), S=5 (WorldEntryAnimation), S=3 (PixelWorldEngine), S=4 (AvatarRenderer)

---

## Architecture Map

```
/Users/TheAES/Desktop/bitbio/
├── app/
│   ├── page.tsx                     ← Home screen (Undertale style, BioRain, soul heart)
│   ├── layout.tsx                   ← Root layout (Press Start 2P font, viewport meta)
│   ├── globals.css                  ← Global styles (realm CSS vars, scanlines, pixel rendering)
│   ├── intro/page.tsx               ← Intro cutscene trigger
│   ├── onboarding/
│   │   ├── character/page.tsx       ← Mario Kart quality character creator
│   │   └── name/page.tsx            ← Name input
│   └── realm/[id]/page.tsx          ← Per-realm game page (1-4)
├── components/
│   ├── avatar/
│   │   └── AvatarRenderer.tsx       ← Pixel art character preview (S=4, animate, sparkles)
│   ├── effects/
│   │   ├── HenryReveal.tsx          ← 25s Henry hologram cutscene (Realm 4 completion)
│   │   ├── LessonComplete.tsx       ← Lesson victory screen (burst particles, star rating)
│   │   └── RealmTransition.tsx      ← Column-wipe realm transition effect
│   ├── intro/
│   │   └── IntroEngine.tsx          ← S=3 intro cutscene (void → Enzyme → suck-in)
│   ├── ui/
│   │   └── AchievementToast.tsx     ← Slide-in achievement notification
│   └── world/
│       ├── BossBattle.tsx           ← Boss combat (LYSO/VIRON/OVERFIT/AMYLOID, 3 phases)
│       ├── PixelWorldEngine.tsx     ← Main game world renderer (S=3, NPC idle, env animations)
│       ├── WorldEntryAnimation.tsx  ← Per-realm entry cutscenes (S=5, dialogue, walk-in)
│       └── ZoneMap.tsx              ← Sub-world zone overlay (16 zones, canvas-drawn)
├── lib/
│   ├── achievements.ts              ← 51 achievements with unlock conditions
│   ├── avatar/avatarOptions.ts      ← Hair/clothing/accessory name arrays
│   ├── curriculum/
│   │   ├── index.ts                 ← Curriculum aggregator (all 4 realms × 4 expansion packs)
│   │   ├── level1.ts + extra + bonus + advanced ← Realm 1: Python + Cell Biology
│   │   ├── level2.ts + extra + bonus + advanced ← Realm 2: Genomics + Bioinformatics
│   │   ├── level3.ts + extra + bonus + advanced ← Realm 3: ML/AI + Neural Networks
│   │   └── level4.ts + extra + bonus + advanced ← Realm 4: Drug Discovery + AlphaFold
│   ├── sound.ts                     ← Web Audio procedural sound (14 SFX + realm music)
│   ├── store.ts                     ← Zustand store with persist (XP, progress, avatar)
│   ├── types.ts                     ← TypeScript interfaces (AvatarConfig, Level, Exercise...)
│   └── zones.ts                     ← 16 explorable zones across 4 realms
└── pixel-art-studio/               ← This directory (R&D pipeline)
```

---

## Asset Registry

### Characters

| Character | Sprites | Status | Quality | Notes |
|-----------|---------|--------|---------|-------|
| Player (avatar) | idle, walk, run, celebrate | ✅ Live | 80-85 | AvatarRenderer, fully customizable |
| Enzyme (cat) | idle, walk, sit, fly, onhead, excited, surprised | ✅ Live | 86-92 | White cat companion, cyan eyes |
| Elliot (Realm 1 NPC) | idle (head bob + blink), walk | ✅ Live | 78-80 | Cell biology guide |
| Ben (Realm 2 NPC) | idle (weight shift), walk | ✅ Live | 77-79 | Genomics guide |
| Alex (Realm 3 NPC) | idle (typing animation), walk | ✅ Live | 78-81 | ML/AI guide |
| Henry (Realm 4 NPC) | idle (holographic flicker), walk | ✅ Live | 91-93 | Dr. Henry Lacks, final mentor |

### Bosses

| Boss | Realm | Phases | Status | Quality |
|------|-------|--------|--------|---------|
| LYSO (Lysosomal Destroyer) | 1 | 3 (Acidic, Enzymatic, Dissolving) | ✅ Live | 84-88 |
| VIRON (Viral Overlord) | 2 | 3 (Viral, Mutating, Pandemic) | ✅ Live | 85-89 |
| OVERFIT (Data Corruption) | 3 | 3 (Memorizing, Glitching, Corrupting) | ✅ Live | 83-87 |
| AMYLOID TYRANT | 4 | 3 (Fibril, Growing Crown, Towering Tyrant) | ✅ Live | 86-90 |

### Environments

| World | Background | Entry Animation | Sub-zones | Status |
|-------|-----------|-----------------|-----------|--------|
| Cytoplasm (Realm 1) | Nucleus, DNA helix, mitochondria, Golgi, ribosomes, lysosomes, 35 vesicles | Player tumbles in (thrown by Enzyme) | 3 zones | ✅ Live |
| Genome Forest (Realm 2) | 5 DNA helix trees, cherry blossom, stone path, stream, bridge, waterfall | Both run and jump in | 4 zones | ✅ Live |
| Neural Nebula (Realm 3) | Deep space, constellation clusters, synapse arcs, data streams | Enzyme tackles player in | 4 zones | ✅ Live |
| Protein Cathedral (Realm 4) | Gothic arches, stained glass, altar, protein crystal formations | Enzyme sits on player's head | 5 zones | ✅ Live |

---

## Curriculum Count

| Realm | Base | Extra | Bonus | Advanced | Total Exercises |
|-------|------|-------|-------|----------|-----------------|
| Realm 1 (Cytoplasm) | ~70 | ~60 | ~45 | 54 | ~229 |
| Realm 2 (Genome Forest) | ~70 | ~60 | ~45 | 55 | ~230 |
| Realm 3 (Neural Nebula) | ~70 | ~60 | ~45 | 56 | ~231 |
| Realm 4 (Protein Cathedral) | ~50 | ~40 | 42 | 54 | ~186 |
| **TOTAL** | | | | | **~876 exercises** |

---

## Quality Score Definitions

| Score | Label | Criteria |
|-------|-------|----------|
| 90-100 | Excellent | AAA quality, reference-worthy, no revisions needed |
| 80-89 | Good | Meets BitBio standards, minor polish possible |
| 70-79 | Acceptable | Functional, needs at least one revision pass |
| 60-69 | Needs Work | Significant issues (silhouette, palette, anatomy) |
| < 60 | Reject | Rebuild from scratch |

**Current studio average:** 84.2 / 100

---

## Technical Standards (Enforced Rules)

### Canvas Rendering
1. **No arcs, paths, or images** in PixelWorldEngine or WorldEntryAnimation — `ctx.fillRect()` only
2. **imageSmoothingEnabled = false** on every canvas context before drawing
3. **imageRendering: pixelated** on all `<canvas>` and `<img>` elements
4. All game coordinates are in "game pixels" — multiply by scale constant S for canvas pixels

### Pixel Art
5. **Maximum palette:** 8 colors per sprite (12 for complex bosses), including transparency
6. **Outline rule:** All sprites must have a 1px dark outline on all exterior edges
7. **No sub-pixel positioning** — all coordinates are integer game pixels
8. **Consistent scale:** Characters are 10×18 game pixels at S=3 (30×54 canvas pixels in world)

### Animation
9. **Idle animations** must loop cleanly at 6-8 FPS (frames/second in game time)
10. **Walk cycle** must use 4 frames minimum with clear weight shift
11. **No motion blur** — pixel art uses anticipation/follow-through, not blur
12. **Time-based animation** via `const t = now / 1000` seconds (never frame-count-based)

### Code
13. All new components must be `'use client'` and use `useRef` for all RAF animation state
14. No setTimeout in render loops — use `requestAnimationFrame` exclusively
15. TypeScript strict mode — no `any` types in new code

---

## Benchmark Comparison

| Dimension | BitBio Current | Undertale Target | OMORI Target | Gap |
|-----------|---------------|-----------------|--------------|-----|
| Character expressiveness | 8/10 | 9/10 | 10/10 | Minor |
| Environment atmosphere | 7/10 | 9/10 | 8/10 | Work needed |
| Palette discipline | 8/10 | 9/10 | 9/10 | Minor |
| Animation quality | 7/10 | 8/10 | 9/10 | Work needed |
| UI/UX cohesion | 8/10 | 9/10 | 8/10 | Minor |
| Color storytelling | 7/10 | 9/10 | 10/10 | Work needed |
| Silhouette clarity | 8/10 | 9/10 | 9/10 | Minor |
| Boss design impact | 8/10 | 9/10 | 8/10 | Minor |
| Overall | **7.6/10** | **8.9/10** | **9.0/10** | **1.3 gap** |

---

## How to Onboard a New Developer

### Day 1 — Understanding the Canvas System
1. Read `/components/world/PixelWorldEngine.tsx` lines 1-100 to understand scale constants and `px()` helper
2. Read this document and `pipelines/SPRITE-PIPELINE.md`
3. Open the game at `localhost:3000` and play through Realm 1's first 3 nodes

### Day 2 — Understanding the Curriculum
1. Read `lib/curriculum/index.ts` to understand the module/node/exercise structure
2. Read one full curriculum file (e.g. `lib/curriculum/level1.ts`) to understand exercise types
3. Understand all 11 exercise types: `multiple-choice`, `fill-blank`, `code-complete`, `debug-code`, `drag-drop`, `terminal`, `sequence-order`, `matching`, `free-text`, `interactive-viz`, `tap-correct`

### Day 3 — Making Your First Change
1. Create a branch from `main`
2. Add one exercise to an existing module in `lib/curriculum/level1.ts`
3. Run `npx tsc --noEmit` — must be clean
4. Run `npm run build` — must pass all 16 routes
5. Visually verify the exercise in the browser

### Key Contacts / Resources
- Pixel art validator: `tools/animation-validator.ts` — run before any sprite commit
- Style checker: `tools/style-checker.ts` — palette compliance check
- Game design bible: `GAME-DESIGN-BIBLE.md` — narrative and world rules
- Agent hierarchy: `AGENT-HIERARCHY.md` — how to work with AI agents on this codebase

---

## Pending Work (Full Backlog)

### P0 — Critical
- [ ] AvatarRenderer expression animations ('happy', 'surprised' modes) are basic — needs more distinct poses
- [ ] Boss Henry Lacks (final battle, Realm 4) still has no drawHenry() boss sprite in BossBattle.tsx

### P1 — High Priority
- [ ] WorldEntryAnimation: player and Enzyme character sprites need more expressive poses during dialogue
- [ ] PixelWorldEngine: environmental NPC animations need more variety (Alex only has typing, needs thinking/error poses)
- [ ] Sound: expand realm music beyond simple drones — add melodic motifs per realm

### P2 — Medium Priority
- [ ] Pixel art studio: integrate validator into pre-commit hook
- [ ] Curriculum: add `interactive-viz` type exercises (currently very few vs. the 11 types)
- [ ] ZoneMap: zone transition animations when entering a zone

### P3 — Low Priority
- [ ] More boss taunt lines (currently 3-4 per boss, target 10+)
- [ ] Henry's dialogue tree in Realm 4 could have more branching
- [ ] Credits screen

---

*Last updated: Phase 5-7 completion. Studio at full operational capacity.*
