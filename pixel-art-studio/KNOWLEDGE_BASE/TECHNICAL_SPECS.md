# Technical Specifications — Canvas API & BitBio Rendering

---

## 1. Canvas 2D Rendering for Pixel Art

### Non-Negotiable Setup
Every Canvas context used for pixel art in BitBio MUST have smoothing disabled:

```javascript
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
// Also set these for cross-browser safety:
ctx.webkitImageSmoothingEnabled = false;  // Safari
ctx.mozImageSmoothingEnabled = false;     // Firefox (historical)
ctx.msImageSmoothingEnabled = false;      // IE (historical)
```

Without `imageSmoothingEnabled = false`, scaled pixel art appears blurry — the browser applies bilinear filtering instead of nearest-neighbor.

### CSS for the Canvas Element
```css
canvas {
  image-rendering: pixelated;         /* Chrome/Edge */
  image-rendering: crisp-edges;        /* Firefox */
  image-rendering: -webkit-optimize-contrast; /* Safari fallback */
}
```

All three properties should be present. `pixelated` is the modern standard but browser support varies.

### Integer Coordinate Rule
ALL `fillRect`, `strokeRect`, `beginPath`, `moveTo`, `lineTo`, `arc`, and transform calls MUST use integer values. Sub-pixel coordinates trigger anti-aliasing at the canvas rasterization level.

```javascript
// WRONG — causes blurry edge
ctx.fillRect(10.5, 20.3, 32, 42);

// CORRECT
ctx.fillRect(Math.round(10.5), Math.round(20.3), 32, 42);
```

Use `Math.floor()` for camera-offset coordinates (ensures the screen never jitters by ±1px):
```javascript
const screenX = Math.floor(tileX * TILE * SCALE - camera.x);
```

---

## 2. BitBio Scale Factor System

### Constants (defined at top of PixelWorldEngine.tsx)
```typescript
const SCALE = 3;   // 3 canvas pixels per 1 game pixel
const TILE  = 16;  // 16 game pixels per tile
const MAP_W = 40;  // tiles wide
const MAP_H = 28;  // tiles tall
```

### What "Game Pixel" Means
A "game pixel" is the unit of the game world. It corresponds to 1 pixel in the designer's mental model. On the actual canvas, each game pixel is rendered as a 3×3 block of canvas pixels (because SCALE=3).

```
1 game pixel  →  3 canvas pixels
1 tile (16gp) →  48 canvas pixels  
1 map width (40 tiles) → 1920 canvas pixels
1 map height (28 tiles) → 1344 canvas pixels
```

At 1920×1080 screen resolution with SCALE=3, the full map is 1920×1344 canvas units — roughly a 1.77:1 aspect ratio that fits in most standard monitor viewport widths.

### Drawing a Single Game Pixel
```javascript
// Draw one game pixel at game coordinates (gx, gy):
function gp(ctx: CanvasRenderingContext2D, gx: number, gy: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(gx * SCALE, gy * SCALE, SCALE, SCALE);
}
```

### Drawing a Sprite (offset from screen position)
All sprite draw functions take `(ctx, screenX, screenY, ...)` where screenX/screenY are the canvas-pixel coordinates of the sprite's top-left corner.

```javascript
// Draw a 2×2 game-pixel block at offset (ogx, ogy) from screen origin (sx, sy):
ctx.fillStyle = '#00ffcc';
ctx.fillRect(sx + ogx * SCALE, sy + ogy * SCALE, 2 * SCALE, 2 * SCALE);
```

### Camera System
The camera follows the player, keeping them centered. Camera is in game-pixel units:
```typescript
const camX = Math.floor(playerGX - (CANVAS_W / SCALE) / 2);
const camY = Math.floor(playerGY - (CANVAS_H / SCALE) / 2);
// Clamp to map bounds:
const clampedCamX = Math.max(0, Math.min(camX, MAP_W * TILE - CANVAS_W / SCALE));
const clampedCamY = Math.max(0, Math.min(camY, MAP_H * TILE - CANVAS_H / SCALE));
```

Screen position for any game-world element at (worldGX, worldGY):
```typescript
const screenX = (worldGX - clampedCamX) * SCALE;
const screenY = (worldGY - clampedCamY) * SCALE;
```

---

## 3. Sprite Bounding Box: 32×32 Game Pixels

All character sprites are designed within a 32×32 game-pixel bounding box.

In canvas pixels: 32 × SCALE = **96 × 96 canvas pixels** per character.

Note: BitBio character sprites are intentionally ~32gp wide × ~42gp tall. The extra height (42 vs 32) is acceptable because:
1. Characters are taller than they are wide (natural humanoid proportion)
2. The 32px width is the constraint that matters for tile-level readability
3. The extra height is in the vertical direction which doesn't overlap horizontally adjacent characters

### Sprite Draw Function Signature Convention
```typescript
function drawCharacterName(
  ctx: CanvasRenderingContext2D,
  sx: number,   // screen X (canvas pixels) of sprite top-left
  sy: number,   // screen Y (canvas pixels) of sprite top-left
  frame: number // global animation frame counter
): void
```

The `frame` parameter is the global tick counter (increments once per `requestAnimationFrame` call, wraps at 3600). All sprite animation derives from this single counter.

### Sprite Frame Derivation Examples
```typescript
// Walk cycle: 8 frames, advances every 6 global frames (10fps walk)
const walkFrame = Math.floor(frame / 6) % 8;

// Idle bob: 60-frame period, 2px amplitude
const idleBob = Math.sin(frame * Math.PI * 2 / 60) * 2;

// Blink: occurs every ~90 frames, lasts 4 frames
const isBlink = (frame % 90) < 4;

// Tail wag: continuous sine wave
const tailAngle = Math.sin(frame * 0.1) * 3; // ±3 game pixels
```

---

## 4. Animation Frame Budgets

### Why Budget Matters
Each additional animation frame = more unique "sprite states" to maintain. With canvas drawing functions (not sprite sheets), this means more code paths, not more image files. Still, complexity compounds.

### Frame Counts Per Sprite Type

| Sprite Type | Idle | Walk | Special | Total States |
|-------------|------|------|---------|-------------|
| Player | 2 (bob variation) | 8 (4-dir × 2) | 4 (celebrate, hurt, interact, run) | ~14 |
| NPC (Elliot, Ben, Alex, Henry) | 2 | 0 (stationary) | 3 (surprised, talking, gesture) | ~5 |
| Enzyme | 4 (idle, blink, head-tilt, yawn) | 4 | 3 (pounce, sit, celebrate) | ~11 |
| Boss (each) | 3 | 0 | 6 (anticipation, attack, phase 2, hurt, death, special) | ~9 |

### "Frame" in Canvas Drawing Context
A canvas animation "frame" is not a sprite-sheet frame — it's a drawing pass. Each requestAnimationFrame call triggers a full redraw. The `frame` counter drives all time-based animation.

For code efficiency, use the `frame` counter directly in sin/cos expressions rather than maintaining separate frame counters per sprite:
```typescript
// Efficient:
const headBob = Math.sin(frame * 0.08) * 1; // uses global frame

// Less efficient (extra state):
let elliotBobTimer = 0;
elliotBobTimer++;
const headBob = Math.sin(elliotBobTimer * 0.08);
```

---

## 5. Memory Considerations

### Canvas Memory Usage
A canvas element allocates memory proportional to its pixel dimensions:
- `width × height × 4 bytes` (RGBA)
- 1920 × 1080 canvas = **8.3 MB** of raw pixel data

BitBio's game canvas (viewport): ~1920×1080 at full screen = 8.3 MB
Landing page parallax canvas: same dimensions = 8.3 MB

This is acceptable. **DO NOT** create multiple full-screen canvases simultaneously — one for the game world and one for the HUD is the maximum practical setup.

### Off-Screen Canvas for Complex Elements
For complex sprites drawn every frame (e.g., boss with many path operations), consider rendering to an off-screen canvas once per animation state change, then blitting with `drawImage`:

```typescript
// Pre-render boss idle frame:
const offscreen = document.createElement('canvas');
offscreen.width = 32 * SCALE;
offscreen.height = 48 * SCALE;
const offCtx = offscreen.getContext('2d')!;
offCtx.imageSmoothingEnabled = false;
drawBossSprite(offCtx, 0, 0, idleFrame);

// Each render frame, just blit:
ctx.drawImage(offscreen, bossScreenX, bossScreenY);
```

Use this only for sprites with >20 fillRect calls per frame. Premature optimization for simple sprites.

### requestAnimationFrame Optimization
Always cancel the RAF handle before component unmount. BitBio's PixelWorldEngine stores the RAF ID in a ref and cancels in the useEffect cleanup:
```typescript
useEffect(() => {
  let rafId: number;
  const loop = () => {
    // draw...
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}, []);
```

---

## 6. Realm Palette Color Hex Values

From `lib/worlds/worldMaps.ts`:

### Realm 1 — The Cytoplasm
```
floor:   #1a3a44   (dark teal)
wall:    #0f2530   (dark teal-navy)
path:    #0d2040   (microtubule blue-black)
water:   #1a0035   (lysosome void purple)
accent:  #00ffcc   (bioluminescent cyan)
sky:     #020609   (deep void)
```

### Realm 2 — The Genome Forest
```
floor:   #162a0a   (forest deep green)
wall:    #0d1e05   (tree bark black-green)
path:    #1c1008   (dirt path brown)
water:   #051a2a   (RNA River deep blue)
accent:  #00ff44   (chlorophyll lime)
sky:     #020602   (forest night sky)
```

### Realm 3 — The Neural Nebula
```
floor:   #14083a   (deep space purple)
wall:    #0e052a   (darker purple)
path:    #0a0528   (synapse path)
water:   #030008   (void black-purple)
accent:  #aa44ff   (neural signal purple)
sky:     #030008   (deep void)
```

### Realm 4 — The Protein Cathedral
```
floor:   #1e1438   (dark violet stone)
wall:    #160f30   (darker violet)
path:    #0c0a1c   (aisle black)
water:   #100820   (inner sanctum void)
accent:  #ffaa00   (golden amber)
sky:     #040210   (cathedral night)
```

---

## 7. Tile Coordinate System

### ASCII Map to Game Coordinates
```
ASCII map row index r, column index c
→ game pixel X = c × TILE          = c × 16
→ game pixel Y = r × TILE          = r × 16
→ canvas pixel X = c × TILE × SCALE = c × 48
→ canvas pixel Y = r × TILE × SCALE = r × 48
```

### tileAt() Function
```typescript
function tileAt(map: string[], col: number, row: number): string {
  if (row < 0 || row >= MAP_H || col < 0 || col >= MAP_W) return '#'; // out-of-bounds = wall
  return map[row][col] ?? '#';
}
```

### World-to-Tile Coordinate
Player game pixel position to tile coordinates:
```typescript
const tileCol = Math.floor(playerGX / TILE);
const tileRow = Math.floor(playerGY / TILE);
const playerTileChar = tileAt(map, tileCol, tileRow);
```

### WALKABLE Set
```typescript
const WALKABLE = new Set([
  '.', '=', '*',              // floor variants
  '1','2','3','4','5','6','7','8','9', // lesson nodes
  'E', 'A', 'H',              // NPC positions (Elliot, Alex, Henry)
  'B',                         // Ben NPC (realm 2+) OR boss gate (realm 1 — walkable to trigger)
  '@',                         // player start (walkable)
]);
```

Note: `~` (water/void), `#` (wall), `T` (tree/pillar) are NOT walkable.

### Player Start Detection
```typescript
function findPlayerStart(map: string[]): { gx: number; gy: number } {
  for (let r = 0; r < MAP_H; r++) {
    for (let c = 0; c < MAP_W; c++) {
      if (map[r][c] === '@') {
        return { gx: c * TILE + TILE / 2, gy: r * TILE + TILE / 2 };
      }
    }
  }
  return { gx: MAP_W / 2 * TILE, gy: MAP_H / 2 * TILE }; // fallback to center
}
```
