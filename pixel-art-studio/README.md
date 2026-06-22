# BitBio Pixel Art Studio
**The R&D backbone of BitBio's visual production**

---

## What This Is

A formal pixel art research and production studio, embedded directly in the BitBio repository. It contains:
- **Knowledge base:** Documented analysis of 20+ landmark pixel art games
- **Design principles:** 50 formal rules derived from that research
- **Production tools:** TypeScript validators, analyzers, and generators
- **Department structure:** Organized backlogs for 7 specialized divisions
- **Production pipeline:** SOPs for every asset from concept to ship

---

## Directory Structure

```
pixel-art-studio/
├── README.md                          ← You are here
├── MASTER-PLAN.md                     ← Studio vision and roadmap
├── STUDIO-CHARTER.md                  ← Art direction principles
│
├── knowledge-base/
│   ├── MASTER-KNOWLEDGE.json          ← Complete game analysis database (20+ games)
│   ├── games/
│   │   ├── UNDERTALE-ANALYSIS.md      ← Undertale deep-dive (zone palettes, tiles, sprites)
│   │   ├── OMORI-ANALYSIS.md          ← OMORI deep-dive (white space vs headspace)
│   │   └── POKEMON-BW-ANALYSIS.md     ← Pokemon B/W analysis (tile system, sprites)
│   ├── palettes/
│   │   └── GAME-PALETTES.json         ← Exact documented palettes from 10+ games
│   ├── principles/
│   │   └── DESIGN-RULES.md            ← 50 formal pixel art rules with BitBio scores
│   └── animations/
│
├── tools/
│   ├── index.ts                       ← Barrel export + CLI runner
│   ├── palette-analyzer.ts            ← Color ramp analysis, hue shift detection
│   ├── sprite-validator.ts            ← Sprite quality checks
│   ├── tileset-generator.ts           ← fillRect instruction generators per tile type
│   ├── animation-scorer.ts            ← Walk cycle, idle, timing analysis
│   ├── style-checker.ts               ← Cross-asset consistency enforcement
│   ├── sprite-generator.ts            ← Character, Enzyme, NPC, enemy sprite generators
│   └── BITBIO-PALETTE.json            ← Canonical BitBio color system
│
├── departments/
│   ├── art-research/
│   │   └── BACKLOG.md                 ← Research tasks and validation criteria
│   ├── sprite-division/
│   │   └── BACKLOG.json               ← Character sprite production tasks
│   ├── animation-division/
│   │   └── BACKLOG.json               ← All animation tasks (20 items)
│   ├── environment-division/
│   │   └── BACKLOG.json               ← Tileset and scene production (16 items)
│   ├── qa-division/
│   │   └── QUALITY-RUBRIC.json        ← 6-category scoring rubric
│   ├── tooling-division/
│   └── production-division/
│
├── pipelines/
│   ├── ASSET-PIPELINE.md              ← 9-stage asset production SOP
│   └── PERFECTION-LOOP.md             ← Continuous improvement protocol
│
└── assets/
    ├── sprites/
    ├── tilesets/
    └── ui/
```

---

## Structured Reference Directories (Sprint 5 Addition)

The following directories contain the formal, structured knowledge base and production system (added Sprint 5). These complement the existing `knowledge-base/`, `tools/`, and `departments/` directories above:

```
KNOWLEDGE_BASE/
├── SPRITE_DESIGN.md         ← Exhaustive sprite principles (silhouette, anatomy, dithering, game refs)
├── ANIMATION.md             ← 12 principles, frame timing tables, walk cycles, VFX patterns
├── COLOR_THEORY.md          ← HSB, hue shifting, 5-step ramps, game palette analysis
├── ENVIRONMENT_DESIGN.md    ← Tile systems, layer separation, all 4 realm specs
└── TECHNICAL_SPECS.md       ← Canvas API, SCALE system, tile coordinates, frame budgets

BITBIO_SPECS/
├── CHARACTER_DESIGN.md      ← Full design spec for all 6 characters (Elliot, Ben, Alex, Henry, Enzyme, Player)
└── REALM_DESIGN.md          ← Detailed 5-element spec for all 4 realm environments

TOOLS/
├── sprite_validator.ts      ← Validates SpriteDescriptor, returns 0-100 score
├── palette_analyzer.ts      ← Analyzes hex palette, detects issues, returns 0-100 score
└── animation_scorer.ts      ← Scores AnimationDescriptor against best practices, returns 0-100

PRODUCTION/
├── STUDIO_ORG.md            ← All 7 departments with backlogs, sprint status, milestone tracker
└── PIPELINE.md              ← 8-stage production workflow (Concept → Polish Loop)
```

**Minimum ship scores:** sprite_validator ≥ 75 · palette_analyzer ≥ 75 · animation_scorer ≥ 75

---

## Quick Start — Using the Tools

### Install and run from project root
```bash
cd /Users/TheAES/Desktop/bitbio

# Analyze a palette
npx ts-node pixel-art-studio/tools/index.ts analyze-palette "#00ffcc,#050d10,#0a1a22"

# Check an asset against realm style
npx ts-node pixel-art-studio/tools/index.ts validate-sprite 1 "#00ffcc,#050d10,#0a0a0a,#ffffff"

# Get palette suggestion for a mood
npx ts-node pixel-art-studio/tools/index.ts suggest-palette dark

# Walk cycle timing guidance
npx ts-node pixel-art-studio/tools/index.ts score-walk 4
```

### In TypeScript (game code)
```typescript
import { validateRealmAsset, getRealmAccentColor } from '@/pixel-art-studio/tools/style-checker';
import { analyzePalette, buildColorRamp } from '@/pixel-art-studio/tools/palette-analyzer';
import { generateCharacterSprite } from '@/pixel-art-studio/tools/sprite-generator';
import { scoreWalkCycle } from '@/pixel-art-studio/tools/animation-scorer';
```

---

## The 7 Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1. Knowledge Ingestion | ✅ Complete | 20+ games analyzed in MASTER-KNOWLEDGE.json |
| 2. Knowledge Extraction | ✅ Complete | 50 formal rules in DESIGN-RULES.md |
| 3. Studio Organization | ✅ Complete | 7 departments with backlogs |
| 4. Tool Creation | ✅ Complete | 6 TypeScript tools |
| 5. Game Production | 🔄 In Progress | Applying to PixelWorldEngine.tsx and IntroEngine.tsx |
| 6. Perfection Loop | 📋 Ready | PERFECTION-LOOP.md, QUALITY-RUBRIC.json |
| 7. Master Repository | 🔄 In Progress | This README |

---

## Quality Targets

| Metric | Current | Sprint 1 Target | Ultimate Target |
|--------|---------|-----------------|-----------------|
| Overall art score | 6.5/10 | 7.0/10 | 8.5/10 |
| Undertale benchmark | 9.2/10 | — | Match or exceed |
| Floor tile quality | 7/10 | 7.5/10 | 8.5/10 |
| Character sprites | 6/10 | 7/10 | 8.5/10 |
| Animation polish | 5.5/10 | 6.5/10 | 8/10 |

---

## How To Contribute A New Asset

1. Create concept (see ASSET-PIPELINE.md Stage 1)
2. Review DESIGN-RULES.md and MASTER-KNOWLEDGE.json for reference
3. Draft tile as `gr()` call sequence
4. Self-critique against 7-item checklist (ASSET-PIPELINE.md Stage 4)
5. Run `validate-sprite` CLI tool
6. Score against QUALITY-RUBRIC.json
7. Ship if ≥ 7.0, iterate if not
8. Add to relevant department BACKLOG.json as DONE

---

## Credits

Research based on: Undertale (Toby Fox), Deltarune (Toby Fox), OMORI (OMOCAT), Pokemon Black/White (Game Freak), Chrono Trigger (Square), EarthBound (Nintendo/Ape), Stardew Valley (ConcernedApe), Celeste (Maddy Thorson), Hyper Light Drifter (Heart Machine), Eastward (Pixpil), CrossCode (Radical Fish), Sea of Stars (Sabotage), Final Fantasy VI (Square), Golden Sun (Camelot), Fire Emblem GBA (Intelligent Systems), Castlevania AoS (Konami), Metroid Fusion (Nintendo).

Studio built for BitBio by Aaryan Senthilvanan, 2026.
