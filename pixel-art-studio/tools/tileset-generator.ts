/**
 * BitBio Tileset Generator
 * Generates pixel art tile data as fillRect instruction sequences.
 * All tiles are 16x16 game pixels. Coordinates are in game pixels (pre-scale).
 * Use renderTile() to draw to a canvas with scale applied.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TileInstruction {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}
export type TileData = TileInstruction[];

// ─── Internal Pixel Canvas ────────────────────────────────────────────────────

function makeGrid(w: number, h: number, fill = ''): string[][] {
  return Array.from({ length: h }, () => new Array(w).fill(fill));
}

function setRect(grid: string[][], x: number, y: number, w: number, h: number, color: string): void {
  for (let row = Math.max(0, y); row < Math.min(y + h, grid.length); row++) {
    for (let col = Math.max(0, x); col < Math.min(x + w, (grid[0]?.length ?? 0)); col++) {
      grid[row][col] = color;
    }
  }
}

function setPixel(grid: string[][], x: number, y: number, color: string): void {
  if (y >= 0 && y < grid.length && x >= 0 && x < (grid[0]?.length ?? 0)) {
    grid[y][x] = color;
  }
}

/** Convert pixel grid to run-length encoded TileData (horizontal runs per row) */
function gridToTileData(grid: string[][]): TileData {
  const result: TileData = [];
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    if (!row) continue;
    let x = 0;
    while (x < row.length) {
      const color = row[x];
      if (!color) { x++; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === color) w++;
      result.push({ x, y, w, h: 1, color });
      x += w;
    }
  }
  return result;
}

// ─── Floor Tiles ─────────────────────────────────────────────────────────────

export function generateFloorTile(
  style: 'dark-wood' | 'stone' | 'grass' | 'metal',
  variant: number = 0
): TileData {
  const g = makeGrid(16, 16);
  const v = variant % 4;

  if (style === 'dark-wood') {
    // Dark warm wood planks, horizontal grain
    const base = '#0d0804', plankDiv = '#060301', grain = '#110a05', highlight = '#140d07', knot = '#080402';
    setRect(g, 0, 0, 16, 16, base);
    // Horizontal plank divisions
    setRect(g, 0, 5, 16, 1, plankDiv);
    setRect(g, 0, 11, 16, 1, plankDiv);
    // Top edge highlight per plank
    setRect(g, 0, 0, 16, 1, highlight);
    setRect(g, 0, 6, 16, 1, highlight);
    setRect(g, 0, 12, 16, 1, highlight);
    // Grain lines (thin vertical streaks)
    const grainX = [2, 6, 9, 13];
    for (const gx of grainX) {
      setRect(g, gx, 1, 1, 4, grain);
      setRect(g, gx + 1, 7, 1, 4, grain);
    }
    // Variant-specific knot
    if (v === 1) { setRect(g, 3, 2, 2, 2, knot); setRect(g, 4, 3, 1, 1, '#040100'); }
    if (v === 2) { setRect(g, 10, 8, 2, 2, knot); }
    if (v === 3) { setRect(g, 7, 1, 2, 3, knot); setRect(g, 8, 2, 1, 1, '#040100'); }

  } else if (style === 'stone') {
    // Dark grey stone tiles with mortar lines
    const base = '#0e0e10', mortar = '#080808', stone = '#131316', highlight = '#1a1a1e', crack = '#0a0a0c';
    setRect(g, 0, 0, 16, 16, base);
    // Mortar grid
    setRect(g, 0, 7, 16, 1, mortar);  // horizontal mortar
    setRect(g, 7, 0, 1, 16, mortar);  // vertical mortar
    // Stone faces
    setRect(g, 1, 1, 5, 5, stone); setRect(g, 1, 1, 5, 1, highlight);
    setRect(g, 9, 1, 6, 5, stone); setRect(g, 9, 1, 6, 1, highlight);
    setRect(g, 1, 9, 5, 6, stone); setRect(g, 1, 9, 5, 1, highlight);
    setRect(g, 9, 9, 6, 6, stone); setRect(g, 9, 9, 6, 1, highlight);
    // Cracks variant
    if (v === 1) { setPixel(g, 3, 3, crack); setPixel(g, 4, 4, crack); setPixel(g, 4, 5, crack); }
    if (v === 2) { setPixel(g, 11, 10, crack); setPixel(g, 12, 11, crack); }
    if (v === 3) { setPixel(g, 2, 10, crack); setPixel(g, 3, 11, crack); setPixel(g, 3, 12, crack); }

  } else if (style === 'grass') {
    // Dark grass — BitBio genome realm style
    const base = '#061008', dark = '#040c06', mid = '#081406', blade = '#0c1c0a', tip = '#102410';
    setRect(g, 0, 0, 16, 16, base);
    // Ground texture rows
    setRect(g, 0, 12, 16, 4, dark);
    setRect(g, 0, 10, 16, 2, mid);
    // Grass blades pattern
    const bladePositions = v === 0 ? [0, 3, 6, 10, 13] : v === 1 ? [1, 4, 8, 11, 15] : v === 2 ? [2, 5, 9, 12, 15] : [0, 4, 7, 11, 14];
    for (const bx of bladePositions) {
      setRect(g, bx, 7, 2, 5, blade);
      setRect(g, bx, 6, 2, 1, tip);
    }
    // Small detail: rocks/patches
    if (v === 2) { setRect(g, 8, 11, 2, 1, '#080e06'); }

  } else {
    // Metal floor — neural/cyberpunk style
    const base = '#0d1014', plate = '#101418', seam = '#080a0c', rivet = '#1a1e22', shine = '#161c20';
    setRect(g, 0, 0, 16, 16, base);
    // Plate pattern (2 plates)
    setRect(g, 1, 1, 6, 6, plate); setRect(g, 1, 1, 6, 1, shine);
    setRect(g, 9, 1, 6, 6, plate); setRect(g, 9, 1, 6, 1, shine);
    setRect(g, 1, 9, 6, 6, plate); setRect(g, 1, 9, 6, 1, shine);
    setRect(g, 9, 9, 6, 6, plate); setRect(g, 9, 9, 6, 1, shine);
    // Seam lines
    setRect(g, 0, 7, 16, 2, seam);
    setRect(g, 7, 0, 2, 16, seam);
    // Rivets at corners
    setPixel(g, 0, 0, rivet); setPixel(g, 15, 0, rivet);
    setPixel(g, 0, 15, rivet); setPixel(g, 15, 15, rivet);
    // Shine stripe variant
    if (v % 2 === 1) { setRect(g, 2, 2, 1, 4, shine); setRect(g, 10, 2, 1, 4, shine); }
  }

  return gridToTileData(g);
}

// ─── Wall Tiles ───────────────────────────────────────────────────────────────

export function generateWallTile(
  style: 'brick' | 'panel' | 'dark-stone' | 'plank',
  variant: number = 0
): TileData {
  const g = makeGrid(16, 16);
  const v = variant % 4;

  if (style === 'brick') {
    const mortar = '#110a08', brickA = '#1e1008', brickB = '#1a0e07', shadow = '#0e0805', topEdge = '#240e09';
    setRect(g, 0, 0, 16, 16, mortar);
    // Brick row 1 (y 0-3): offset 0
    setRect(g, 0, 0, 7, 3, brickA); setRect(g, 8, 0, 7, 3, brickB);
    setRect(g, 0, 0, 7, 1, topEdge); setRect(g, 8, 0, 7, 1, topEdge);
    setRect(g, 0, 2, 7, 1, shadow); setRect(g, 8, 2, 7, 1, shadow);
    // Brick row 2 (y 4-7): offset by half brick width
    setRect(g, 0, 4, 3, 3, brickB); setRect(g, 4, 4, 7, 3, brickA); setRect(g, 12, 4, 4, 3, brickB);
    setRect(g, 0, 4, 3, 1, topEdge); setRect(g, 4, 4, 7, 1, topEdge); setRect(g, 12, 4, 4, 1, topEdge);
    setRect(g, 0, 6, 3, 1, shadow); setRect(g, 4, 6, 7, 1, shadow); setRect(g, 12, 6, 4, 1, shadow);
    // Brick row 3 (y 8-11): same as row 1
    setRect(g, 0, 8, 7, 3, brickA); setRect(g, 8, 8, 7, 3, brickB);
    setRect(g, 0, 8, 7, 1, topEdge); setRect(g, 8, 8, 7, 1, topEdge);
    setRect(g, 0, 10, 7, 1, shadow); setRect(g, 8, 10, 7, 1, shadow);
    // Brick row 4 (y 12-15): offset
    setRect(g, 0, 12, 3, 3, brickB); setRect(g, 4, 12, 7, 3, brickA); setRect(g, 12, 12, 4, 3, brickB);
    setRect(g, 0, 12, 3, 1, topEdge); setRect(g, 4, 12, 7, 1, topEdge); setRect(g, 12, 12, 4, 1, topEdge);
    // Moss/damage variant
    if (v === 2) { setRect(g, 2, 5, 2, 1, '#0a1408'); setRect(g, 9, 1, 1, 2, '#0a1408'); }

  } else if (style === 'panel') {
    // Sci-fi metal panel wall (cytoplasm/neural realm)
    const base = '#0a1018', panel = '#0e1620', seam = '#060c10', accent = '#00334a', glow = '#004466';
    setRect(g, 0, 0, 16, 16, base);
    // Main panel
    setRect(g, 1, 1, 14, 12, panel);
    setRect(g, 1, 1, 14, 1, accent); // top edge accent
    setRect(g, 1, 12, 14, 1, seam);  // bottom seam
    // Vertical structural lines
    setRect(g, 5, 1, 1, 11, seam);
    setRect(g, 10, 1, 1, 11, seam);
    // Glow dot (accent)
    setRect(g, 7, 13, 2, 2, glow);
    // Variant: indicator lights
    if (v === 1) { setPixel(g, 2, 7, '#00ffcc'); setPixel(g, 2, 9, '#00ffcc'); }
    if (v === 2) { setRect(g, 12, 3, 2, 6, accent); }
    if (v === 3) { setPixel(g, 7, 6, '#00aaff'); setRect(g, 6, 7, 4, 1, accent); }

  } else if (style === 'dark-stone') {
    // Ancient dark stone wall (cathedral/genome realm)
    const base = '#0a0808', stone1 = '#110e0c', stone2 = '#0e0b09', moss = '#061008', edge = '#151210';
    setRect(g, 0, 0, 16, 16, base);
    // Large stone blocks
    setRect(g, 0, 0, 15, 7, stone1); setRect(g, 0, 0, 15, 1, edge);
    setRect(g, 0, 8, 15, 7, stone2); setRect(g, 0, 8, 15, 1, edge);
    // Vertical crack between blocks
    setRect(g, 15, 0, 1, 16, '#080606');
    setRect(g, 0, 7, 16, 1, '#060404'); // horizontal mortar
    // Texture scratches
    setPixel(g, 3, 3, '#0d0a09'); setPixel(g, 4, 4, '#0d0a09');
    setPixel(g, 10, 10, '#0c0909'); setPixel(g, 11, 10, '#0c0909');
    if (v === 1) { setRect(g, 1, 2, 3, 4, moss); }
    if (v === 2) { setRect(g, 12, 9, 2, 5, moss); }
    if (v === 3) { setRect(g, 4, 2, 1, 4, '#08100a'); setRect(g, 8, 9, 1, 5, '#08100a'); }

  } else {
    // Wooden plank wall
    const base = '#0f0a05', plank1 = '#140c06', plank2 = '#110a05', nail = '#0c0804', topEdge = '#1a1008';
    setRect(g, 0, 0, 16, 16, base);
    // Planks (vertical in this case for wall feel)
    setRect(g, 0, 0, 4, 16, plank1); setRect(g, 0, 0, 4, 1, topEdge);
    setRect(g, 5, 0, 4, 16, plank2); setRect(g, 5, 0, 4, 1, topEdge);
    setRect(g, 10, 0, 4, 16, plank1); setRect(g, 10, 0, 4, 1, topEdge);
    setRect(g, 15, 0, 1, 16, '#0a0703'); // thin plank edge
    // Nail positions
    setPixel(g, 2, 3, nail); setPixel(g, 2, 12, nail);
    setPixel(g, 7, 5, nail); setPixel(g, 7, 14, nail);
    setPixel(g, 12, 2, nail); setPixel(g, 12, 11, nail);
    if (v === 1) { setPixel(g, 1, 8, '#1a0e08'); setPixel(g, 2, 9, '#1a0e08'); } // crack
    if (v === 3) { setRect(g, 0, 6, 5, 4, '#0c0804'); } // dark stain
  }

  return gridToTileData(g);
}

// ─── Water/Liquid Tiles ───────────────────────────────────────────────────────

export function generateWaterTile(
  style: 'acid' | 'void' | 'ocean' | 'lava',
  animated: boolean = false
): TileData[] {
  const frameCount = animated ? 4 : 1;
  const frames: TileData[] = [];

  for (let frame = 0; frame < frameCount; frame++) {
    const g = makeGrid(16, 16);
    const f = frame % 4;

    if (style === 'acid') {
      // Toxic green acid
      const base = '#051a08', dark = '#030f05', mid = '#082810', bubble = '#00cc44', foam = '#00ff66';
      setRect(g, 0, 0, 16, 16, base);
      setRect(g, 0, 8, 16, 8, dark);
      // Animated wave line
      const waveY = 4 + Math.sin((f / 4) * Math.PI * 2) * 2 | 0;
      setRect(g, 0, waveY, 16, 2, mid);
      setRect(g, 0, waveY - 1, 8, 1, mid);
      setRect(g, 8, waveY, 8, 1, mid);
      // Bubbles (shift with frame)
      const bubbleX = (2 + f * 3) % 14;
      setPixel(g, bubbleX, 10, bubble); setPixel(g, (bubbleX + 7) % 14, 6, bubble);
      setPixel(g, bubbleX, 9, foam); setPixel(g, (bubbleX + 7) % 14, 5, foam);

    } else if (style === 'void') {
      // Deep purple void water
      const base = '#04020a', deep = '#020108', shimmer = '#1a0033', spark = '#6622aa', bright = '#aa44ff';
      setRect(g, 0, 0, 16, 16, deep);
      setRect(g, 0, 0, 16, 5, base);
      // Shimmer wave
      const sY = 3 + (f % 2);
      setRect(g, 0, sY, 16, 1, shimmer);
      // Sparkle dots shift with frame
      const sx = (f * 4) % 16;
      setPixel(g, sx, 7, spark); setPixel(g, (sx + 8) % 16, 11, spark);
      setPixel(g, (sx + 4) % 16, 13, bright);

    } else if (style === 'ocean') {
      // Dark deep ocean
      const base = '#020810', dark = '#010609', mid = '#030c14', foam = '#1a3a4a', bright = '#004466';
      setRect(g, 0, 0, 16, 16, dark);
      setRect(g, 0, 0, 16, 6, base);
      // Wave bands
      const waveOffset = f % 4;
      for (let wy = 2; wy < 14; wy += 4) {
        const shifted = (wy + waveOffset) % 14;
        setRect(g, 0, shifted, 16, 1, mid);
        setRect(g, 0, shifted + 1, 8, 1, mid);
      }
      // Foam
      setRect(g, (2 + f * 2) % 12, 2, 4, 1, foam);
      setPixel(g, (5 + f * 3) % 14, 5, bright);

    } else {
      // Lava — cathedral realm
      const base = '#1a0800', dark = '#0e0400', hot = '#331000', orange = '#662200', bright = '#aa4400', spark = '#ff6600';
      setRect(g, 0, 0, 16, 16, dark);
      setRect(g, 0, 0, 16, 6, base);
      setRect(g, 0, 6, 16, 10, hot);
      // Lava flow lines
      const lY = 4 + (f % 3);
      setRect(g, 0, lY, 16, 2, orange);
      setRect(g, 0, lY + 2, 8, 1, orange);
      setRect(g, 8, lY + 3, 8, 1, orange);
      // Hot spots
      const hx = (f * 5) % 12;
      setPixel(g, hx, 8, bright); setPixel(g, hx + 1, 9, orange);
      setPixel(g, (hx + 6) % 14, 12, spark);
    }

    frames.push(gridToTileData(g));
  }

  return frames;
}

// ─── Biology Tiles ────────────────────────────────────────────────────────────

export function generateOrganelleTile(
  type: 'mitochondria' | 'nucleus' | 'ribosome'
): TileData {
  const g = makeGrid(16, 16);

  if (type === 'mitochondria') {
    // Oval organelle with cristae folds — teal cytoplasm theme
    const bg = '#020609', membrane = '#003344', inner = '#002233', cristae = '#004455', accent = '#00aacc';
    setRect(g, 0, 0, 16, 16, bg);
    // Outer membrane (oval approximation using rects)
    setRect(g, 3, 1, 10, 14, membrane);
    setRect(g, 2, 2, 12, 12, membrane);
    setRect(g, 1, 4, 14, 8, membrane);
    // Inner matrix
    setRect(g, 4, 3, 8, 10, inner);
    setRect(g, 3, 4, 10, 8, inner);
    // Cristae folds
    setRect(g, 5, 4, 1, 8, cristae); setRect(g, 7, 4, 1, 8, cristae);
    setRect(g, 9, 4, 1, 8, cristae);
    // Accent on membrane top
    setRect(g, 4, 1, 8, 1, accent); setRect(g, 3, 2, 2, 1, accent); setRect(g, 11, 2, 2, 1, accent);

  } else if (type === 'nucleus') {
    // Large nucleus with nuclear envelope and nucleolus
    const bg = '#020609', envelope = '#004433', inner = '#002a22', pore = '#00cc88', nucleolus = '#005533', nBright = '#00ffaa';
    setRect(g, 0, 0, 16, 16, bg);
    // Nuclear envelope (filled circle approximation)
    setRect(g, 3, 1, 10, 14, envelope);
    setRect(g, 2, 2, 12, 12, envelope);
    setRect(g, 1, 3, 14, 10, envelope);
    // Inner nucleoplasm
    setRect(g, 4, 3, 8, 10, inner); setRect(g, 3, 4, 10, 8, inner); setRect(g, 2, 5, 12, 6, inner);
    // Nucleolus (bright central blob)
    setRect(g, 6, 5, 4, 6, nucleolus); setRect(g, 5, 6, 6, 4, nucleolus);
    setPixel(g, 7, 7, nBright); setPixel(g, 8, 7, nBright); setPixel(g, 7, 8, nBright);
    // Nuclear pores
    setPixel(g, 3, 5, pore); setPixel(g, 12, 5, pore);
    setPixel(g, 3, 10, pore); setPixel(g, 12, 10, pore);
    setPixel(g, 7, 1, pore); setPixel(g, 8, 1, pore);
    setPixel(g, 7, 14, pore); setPixel(g, 8, 14, pore);

  } else {
    // Ribosome — small dense dot (genome realm green)
    const bg = '#020a04', body = '#003311', bright = '#005522', accent = '#00aa44', shine = '#00ff66';
    setRect(g, 0, 0, 16, 16, bg);
    // Small (large) subunit
    setRect(g, 4, 3, 8, 7, body); setRect(g, 3, 4, 10, 5, body);
    setRect(g, 5, 4, 6, 5, bright); setPixel(g, 7, 5, accent); setPixel(g, 8, 5, accent);
    // Small subunit (offset)
    setRect(g, 5, 10, 6, 4, body); setRect(g, 4, 11, 8, 2, body);
    setRect(g, 6, 11, 4, 2, bright); setPixel(g, 7, 11, accent);
    // Highlight
    setPixel(g, 6, 4, shine); setPixel(g, 6, 11, shine);
  }

  return gridToTileData(g);
}

// ─── DNA Tile ─────────────────────────────────────────────────────────────────

export function generateDNATile(
  baseType: 'AT' | 'GC',
  frame: number = 0
): TileData {
  const g = makeGrid(16, 16);
  const offset = (frame % 4) * 2;

  // Genome realm: dark green theme
  const bg = '#020a04';
  const backbone1 = '#004422';
  const backbone2 = '#003318';
  const baseAT = '#00ff44';   // Adenine/Thymine pair
  const baseGC = '#44ff00';   // Guanine/Cytosine pair
  const sugar = '#006633';
  const baseColor = baseType === 'AT' ? baseAT : baseGC;

  setRect(g, 0, 0, 16, 16, bg);

  // Left backbone (sinusoidal approximation via shifted columns)
  for (let row = 0; row < 16; row++) {
    const x1 = 2 + Math.round(Math.sin(((row + offset) / 16) * Math.PI * 2) * 2);
    setPixel(g, Math.max(0, Math.min(15, x1)), row, backbone1);
    setPixel(g, Math.max(0, Math.min(15, x1 + 1)), row, sugar);
  }

  // Right backbone (180° offset)
  for (let row = 0; row < 16; row++) {
    const x2 = 13 - Math.round(Math.sin(((row + offset) / 16) * Math.PI * 2) * 2);
    setPixel(g, Math.max(0, Math.min(15, x2)), row, backbone2);
    setPixel(g, Math.max(0, Math.min(15, x2 - 1)), row, sugar);
  }

  // Horizontal base pair rungs (every 4 rows)
  const rungRows = [1, 5, 9, 13];
  for (const ry of rungRows) {
    const shiftedRy = (ry + offset) % 16;
    setRect(g, 3, shiftedRy, 10, 1, baseColor);
    // Hydrogen bond gap in center
    setPixel(g, 8, shiftedRy, bg);
  }

  return gridToTileData(g);
}

// ─── Neural Tile ──────────────────────────────────────────────────────────────

export function generateNeuralTile(activity: number = 0.5): TileData {
  const g = makeGrid(16, 16);

  // Neural nebula theme: dark purple
  const bg = '#060409';
  const wire = '#220044';
  const node = '#440088';
  const activeNode = '#7733bb';
  const synapse = '#aa44ff';
  const glow = '#cc88ff';

  setRect(g, 0, 0, 16, 16, bg);

  // Neural wire paths (diagonal and cross)
  setRect(g, 0, 7, 16, 1, wire);
  setRect(g, 7, 0, 1, 16, wire);
  // Diagonal wire
  for (let i = 0; i < 8; i++) { setPixel(g, i * 2, i * 2, wire); setPixel(g, i * 2 + 1, i * 2, wire); }

  // Neural nodes at intersections
  setRect(g, 6, 6, 3, 3, node);
  if (activity > 0.3) setRect(g, 6, 6, 3, 3, activeNode);
  if (activity > 0.7) setRect(g, 7, 7, 1, 1, synapse);
  if (activity > 0.9) setPixel(g, 7, 7, glow);

  // Corner nodes
  setRect(g, 0, 0, 2, 2, node);
  setRect(g, 14, 0, 2, 2, node);
  setRect(g, 0, 14, 2, 2, node);
  setRect(g, 14, 14, 2, 2, node);

  if (activity > 0.5) {
    setPixel(g, 1, 1, synapse);
    setPixel(g, 14, 14, synapse);
  }

  // Dendrite branches
  setRect(g, 3, 3, 1, 4, wire);
  setRect(g, 11, 3, 1, 4, wire);
  setRect(g, 3, 11, 1, 4, wire);
  setRect(g, 11, 11, 1, 4, wire);

  return gridToTileData(g);
}

// ─── Gothic Tiles ─────────────────────────────────────────────────────────────

export function generateGothicTile(
  type: 'pillar' | 'arch' | 'altar'
): TileData {
  const g = makeGrid(16, 16);
  const bg = '#090601', stone = '#1e1808', darkStone = '#140f04', accent = '#ffcc00', gold = '#aa8800', shadow = '#0e0a02';

  setRect(g, 0, 0, 16, 16, bg);

  if (type === 'pillar') {
    // Gothic column with fluting
    const pillarBase = '#1c1506', pillarMid = '#241c08', pillarLight = '#2c2010', cap = '#1a1304';
    // Column shaft
    setRect(g, 4, 0, 8, 16, pillarBase);
    setRect(g, 5, 0, 6, 16, pillarMid);
    setRect(g, 7, 0, 2, 16, pillarLight); // center highlight
    // Fluting grooves
    setRect(g, 4, 0, 1, 16, shadow); setRect(g, 11, 0, 1, 16, shadow);
    setRect(g, 6, 0, 1, 16, shadow); setRect(g, 9, 0, 1, 16, shadow);
    // Capital (top decoration)
    setRect(g, 2, 0, 12, 3, cap); setRect(g, 3, 0, 10, 1, accent);
    // Base
    setRect(g, 2, 13, 12, 3, cap); setRect(g, 3, 15, 10, 1, gold);

  } else if (type === 'arch') {
    // Gothic pointed arch segment
    const archStone = '#201808', archLight = '#2a2010', mortar = '#100c04', keystone = '#2e2412';
    setRect(g, 0, 0, 16, 16, bg);
    // Left arch side
    setRect(g, 0, 0, 5, 16, archStone); setRect(g, 1, 0, 3, 16, archLight);
    setRect(g, 5, 0, 1, 16, mortar); // mortar line
    // Right arch side
    setRect(g, 11, 0, 5, 16, archStone); setRect(g, 12, 0, 3, 16, archLight);
    setRect(g, 10, 0, 1, 16, mortar);
    // Keystone at top center
    setRect(g, 6, 0, 4, 6, keystone);
    setRect(g, 7, 0, 2, 4, archLight);
    setPixel(g, 7, 1, accent); setPixel(g, 8, 1, accent);
    // Gold trim
    setRect(g, 0, 0, 1, 16, gold); setRect(g, 15, 0, 1, 16, gold);

  } else {
    // Altar — central worship platform
    const altarBase = '#1a1206', altarTop = '#241a08', cloth = '#3a2a0a', candle = '#ffe8aa', flame = '#ffcc00', wax = '#ffeedd';
    setRect(g, 0, 0, 16, 16, bg);
    // Altar body
    setRect(g, 1, 8, 14, 8, altarBase); setRect(g, 1, 8, 14, 1, stone);
    setRect(g, 2, 9, 12, 7, stone); setRect(g, 2, 9, 12, 1, darkStone);
    // Altar top surface
    setRect(g, 0, 7, 16, 2, altarTop); setRect(g, 0, 7, 16, 1, stone);
    // Cloth runner
    setRect(g, 3, 6, 10, 2, cloth); setRect(g, 3, 6, 10, 1, '#4a3a10');
    // Gold trim on altar
    setRect(g, 1, 8, 14, 1, gold);
    setRect(g, 1, 15, 14, 1, gold);
    // Candles
    setRect(g, 2, 2, 2, 6, wax); setPixel(g, 3, 2, candle); setPixel(g, 3, 1, flame);
    setRect(g, 12, 2, 2, 6, wax); setPixel(g, 13, 2, candle); setPixel(g, 13, 1, flame);
    // Accent dot (relic/item)
    setPixel(g, 7, 6, accent); setPixel(g, 8, 6, accent);
  }

  return gridToTileData(g);
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

/**
 * Render a TileData array to a canvas using fillRect calls.
 * @param ctx     Canvas 2D context
 * @param tile    TileData (array of TileInstructions)
 * @param offsetX X pixel offset on canvas (in canvas pixels)
 * @param offsetY Y pixel offset on canvas (in canvas pixels)
 * @param scale   Scale factor (BitBio uses scale=3: 1 game pixel = 3 canvas pixels)
 */
export function renderTile(
  ctx: CanvasRenderingContext2D,
  tile: TileData,
  offsetX: number,
  offsetY: number,
  scale: number = 3
): void {
  for (const { x, y, w, h, color } of tile) {
    if (!color) continue;
    ctx.fillStyle = color;
    ctx.fillRect(
      offsetX + x * scale,
      offsetY + y * scale,
      w * scale,
      h * scale
    );
  }
}
