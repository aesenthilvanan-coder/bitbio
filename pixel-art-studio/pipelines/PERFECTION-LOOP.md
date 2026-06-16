# BitBio Perfection Loop
**QA Division | Continuous Improvement Protocol**

The perfection loop is what separates a finished game from a great one. Run this loop on all assets with score < 8.5.

---

## When To Run

- After any new asset ships with score < 8.5
- Weekly "polish sprint" where score < 7.5 assets get improved
- When a benchmark comparison reveals BitBio falls short of reference games

---

## The Loop (Per Asset)

```
1. MEASURE  → Score asset against QUALITY-RUBRIC.json
2. DIAGNOSE → Identify lowest-scoring category
3. RESEARCH → Find 3 examples of this category done well in reference games
4. FIX      → Apply specific fix (10-30 minute rule: don't over-engineer)
5. SCORE    → Re-score. Did it improve?
6. REPEAT   → Until score ≥ 8.5 or diminishing returns
```

---

## Category-Specific Improvement Techniques

### Silhouette Readability (Rule #1)
**Diagnosis:** Sprite looks like a blob at 50% scale or in grayscale.
**Fix:**
1. Open the tile/sprite code
2. Temporarily set all non-outline pixels to a mid-gray (#888888)
3. Check: is the outline shape readable?
4. If not: the outline path itself is wrong — need more pronounced shape features
5. Add 1-2 "silhouette anchors": distinctive protruding shapes that identify the asset
**Reference:** Enzyme's ears + large round eyes = immediately identifiable even as a tiny blob

---

### Color Harmony (Rule #2)
**Diagnosis:** Shadows are flat-darker versions of base color. Palette feels muddy.
**Fix:**
1. For each shadow color: increase B channel by 15-25, decrease R+G by 10-15 (cool shift)
2. For each highlight color: increase R+G by 15-25, increase B slightly (warm shift)
3. Run `analyzePalette()` — check if hueShift report shows shifting
4. Replace flat-darkened colors with hue-shifted equivalents
**Before:** `#00ffcc` shadow → `#00cc99` (just darker)
**After:** `#00ffcc` shadow → `#0099cc` (darker + hue shifted to blue)

---

### Realm Consistency (Rule #12)
**Diagnosis:** `validateRealmAsset()` shows > 20% out-of-palette colors.
**Fix:**
1. Run the validator and get the list of out-of-palette colors
2. For each out-of-palette color: find the nearest in-palette color (the validator suggests this)
3. Replace systematically using find/replace in the draw function
4. Re-run validator — should be > 80% compliance
**Note:** A tolerance of 30 color distance is allowed. Colors very close to palette entries are fine.

---

### Readability At Game Scale (Rule #13)
**Diagnosis:** Asset looks great in the code/zoomed view but disappears or blurs at S=3.
**Fix:**
1. `npm run dev`, navigate to the relevant game scene
2. Take a screenshot at actual screen resolution
3. Open in image editor, zoom to 100% (no scaling)
4. Find the asset — what's wrong at actual size?
5. Common fixes:
   - If too small: increase the minimum feature size to 2gp (6px CSS at S=3)
   - If low contrast: darken the background or lighten the asset's lightest color
   - If unclear what it is: make the silhouette shape more extreme
   - If animation doesn't read: increase per-frame shape difference

---

### Animation Polish (Rule #16)
**Diagnosis:** Walk cycle looks mechanical or choppy.
**Fix:**
1. Run `scoreWalkCycle(frames)` and check `issues` array
2. If silhouette consistency < 80%: frames are too different — standardize base pose
3. If no meaningful motion detected: increase leg offset from 1px to 2px
4. Add head bob: frame 0/2 = head at normal Y, frame 1/3 = head 1px higher
5. For walk cycles, verify: left frame ≠ mirror of right frame (asymmetry = life)
**Undertale approach:** Even Toby Fox's simple 2-frame walk has slight body lean forward on step

---

### Style Consistency (Rule #22)
**Diagnosis:** Asset looks like it belongs to a different game.
**Fix:**
1. Open a screenshot with the asset in context (surrounded by existing assets)
2. Identify the most jarring difference (too bright? too detailed? wrong palette temperature?)
3. Apply the specific fix to match surrounding context
4. Common adjustments:
   - Brighter than surroundings: darken base by 20%
   - Too detailed: remove 30-40% of detail fills (surprisingly, less detail often reads better)
   - Wrong temperature: warm assets in cool zones → shift toward blue; cool in warm zones → shift toward orange

---

## Improvement Decision Tree

```
Score < 5.0:
  → Is the silhouette wrong? → Redesign from scratch
  → Is it unreadable? → Simplify: remove 50% of detail, keep only shape
  → Is palette wrong? → Run validateRealmAsset() and fix palette first
  
Score 5.0-7.0:
  → What's the lowest category? → Apply category-specific fix above
  → Did score improve by ≥ 1.0? → Ship if ≥ 7.0, else continue loop
  → Did score not improve? → Try different approach, or consult DESIGN-RULES.md
  
Score 7.0-8.5:
  → What's the highest-priority unfixed issue? → Fix specifically
  → Is improvement < 0.5? → Stop, document, move on (diminishing returns)
  
Score > 8.5:
  → Document what made it good in DESIGN-RULES.md under positive examples
  → Use as reference for next asset in same category
```

---

## Time Budget Per Asset

| Asset type | Time budget | If over budget |
|------------|-------------|----------------|
| Floor tile | 45 min | Ship at current score, create improvement ticket |
| Wall tile | 60 min | Same |
| Character sprite | 2 hours | Ship at 7.0+ |
| Boss sprite | 4 hours | Do not ship below 7.5 |
| Animation (per direction) | 30 min | 2-frame is acceptable ship, 4-frame is target |
| UI element | 30 min | — |

---

## Benchmark Comparisons

When in doubt, compare to benchmark scores:
- **Undertale (9.2):** Simple but every pixel intentional. Match or exceed silhouette clarity.
- **Pokemon B/W (8.9):** Clean, readable, consistent. Match palette discipline.
- **Celeste (8.5):** Minimal but precise. Match contrast standards.
- **Current BitBio (6.5):** Starting point. Each sprint should move this up by 0.3-0.5.

**Target:** Reach 8.0 overall by end of Sprint 3.
