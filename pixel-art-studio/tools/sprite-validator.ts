/**
 * BitBio Sprite Validator
 * Validates pixel art sprites stored as 2D color arrays.
 * Checks silhouette, outlines, color economy, and style compliance.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** Pixels are hex strings; empty string means transparent */
export interface Sprite {
  width: number;
  height: number;
  pixels: string[][];
}

export interface SpriteReport {
  style: 'undertale' | 'omori' | 'pokemon';
  valid: boolean;
  score: number;                  // 0-100
  silhouetteScore: number;        // 0-100
  colorCount: number;
  hasOutline: boolean;
  issues: string[];
  passes: string[];
  colorUsage: ColorUsageReport;
}

export interface OutlineIssue {
  type: 'missing-corner' | 'double-outline' | 'thin-section' | 'gap' | 'jagged';
  x: number;
  y: number;
  description: string;
}

export interface ColorUsageReport {
  colors: Record<string, number>;   // hex -> pixel count
  totalPixels: number;
  transparentPixels: number;
  solidPixels: number;
  dominantColor: string;
  colorCount: number;
  mostUsedColors: Array<{ color: string; count: number; percent: number }>;
}

export interface Suggestion {
  priority: 'critical' | 'major' | 'minor';
  description: string;
  location?: { x: number; y: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isTransparent(pixel: string): boolean {
  return !pixel || pixel === '' || pixel === 'transparent';
}

function getNeighbors4(x: number, y: number, w: number, h: number): Array<[number, number]> {
  const n: Array<[number, number]> = [];
  if (x > 0) n.push([x - 1, y]);
  if (x < w - 1) n.push([x + 1, y]);
  if (y > 0) n.push([x, y - 1]);
  if (y < h - 1) n.push([x, y + 1]);
  return n;
}

function getNeighbors8(x: number, y: number, w: number, h: number): Array<[number, number]> {
  const n: Array<[number, number]> = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) n.push([nx, ny]);
    }
  }
  return n;
}

/** Returns all edge pixels of the sprite (solid pixels touching transparent or border) */
function getEdgePixels(sprite: Sprite): Array<{ x: number; y: number; color: string }> {
  const { pixels, width, height } = sprite;
  const edges: Array<{ x: number; y: number; color: string }> = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isTransparent(pixels[y]?.[x])) continue;
      const isEdge = getNeighbors8(x, y, width, height).some(
        ([nx, ny]) => isTransparent(pixels[ny]?.[nx]) || nx < 0 || ny < 0 || nx >= width || ny >= height
      ) || x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (isEdge) edges.push({ x, y, color: pixels[y][x] });
    }
  }
  return edges;
}

/** Determines the darkest color (lowest luminance) in a set of hex colors */
function darkestColor(colors: string[]): string {
  let darkest = colors[0];
  let minLum = Infinity;
  for (const c of colors) {
    const h = c.replace('#', '');
    if (h.length < 6) continue;
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const lin = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    if (lum < minLum) { minLum = lum; darkest = c; }
  }
  return darkest;
}

// ─── Core Exports ─────────────────────────────────────────────────────────────

/**
 * Analyze per-color pixel usage in a sprite.
 */
export function analyzeColorUsage(sprite: Sprite): ColorUsageReport {
  const colors: Record<string, number> = {};
  let transparentPixels = 0;
  const totalPixels = sprite.width * sprite.height;

  for (let y = 0; y < sprite.height; y++) {
    for (let x = 0; x < sprite.width; x++) {
      const p = sprite.pixels[y]?.[x] ?? '';
      if (isTransparent(p)) { transparentPixels++; continue; }
      const key = p.toLowerCase().slice(0, 7);
      colors[key] = (colors[key] ?? 0) + 1;
    }
  }

  const solidPixels = totalPixels - transparentPixels;
  const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]);
  const dominantColor = sorted[0]?.[0] ?? '';
  const mostUsedColors = sorted.slice(0, 8).map(([color, count]) => ({
    color, count, percent: parseFloat(((count / Math.max(solidPixels, 1)) * 100).toFixed(1)),
  }));

  return {
    colors, totalPixels, transparentPixels, solidPixels,
    dominantColor, colorCount: sorted.length, mostUsedColors,
  };
}

/**
 * Silhouette readability score (0-100).
 * Measures how well the sprite's silhouette communicates its shape:
 * - Checks that solid pixels form a connected region
 * - Measures ratio of boundary pixels to solid pixels (too smooth or too jagged = lower score)
 * - Checks for enclosed holes (distracts from silhouette)
 */
export function checkSilhouetteReadability(sprite: Sprite): number {
  const { pixels, width, height } = sprite;
  const visited = Array.from({ length: height }, () => new Array(width).fill(false));

  // BFS from top-left to identify "outside" region (transparent + connected exterior)
  const queue: Array<[number, number]> = [];
  const exterior = new Set<string>();

  // Seed from all border transparent pixels
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      if (isTransparent(pixels[y]?.[x])) { queue.push([x, y]); visited[y][x] = true; }
    }
  }
  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      if (!visited[y]?.[x] && isTransparent(pixels[y]?.[x])) { queue.push([x, y]); visited[y][x] = true; }
    }
  }

  let qi = 0;
  while (qi < queue.length) {
    const [cx, cy] = queue[qi++];
    exterior.add(`${cx},${cy}`);
    for (const [nx, ny] of getNeighbors4(cx, cy, width, height)) {
      if (!visited[ny]?.[nx] && isTransparent(pixels[ny]?.[nx])) {
        visited[ny][nx] = true;
        queue.push([nx, ny]);
      }
    }
  }

  // Enclosed transparent pixels (holes) reduce score
  let enclosedHoles = 0;
  let solidCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isTransparent(pixels[y]?.[x]) && !exterior.has(`${x},${y}`)) enclosedHoles++;
      if (!isTransparent(pixels[y]?.[x])) solidCount++;
    }
  }

  if (solidCount === 0) return 0;

  // Edge pixels ratio: ideally 20-40% of solid pixels are edge pixels
  const edgePixels = getEdgePixels(sprite).length;
  const edgeRatio = edgePixels / solidCount;
  const edgeScore = edgeRatio < 0.15 ? 60 : edgeRatio < 0.5 ? 100 : Math.max(40, 100 - (edgeRatio - 0.5) * 120);

  // Penalize holes
  const holeScore = Math.max(0, 100 - enclosedHoles * 8);

  // Coverage: sprite should use reasonable portion of canvas
  const coverage = solidCount / (width * height);
  const coverageScore = coverage < 0.1 ? 40 : coverage < 0.7 ? 100 : 80;

  return Math.round((edgeScore * 0.4 + holeScore * 0.4 + coverageScore * 0.2));
}

/**
 * Detect outline quality issues in a pixel art sprite.
 * Good pixel art has consistent 1-pixel dark outlines.
 */
export function findOutlineIssues(sprite: Sprite): OutlineIssue[] {
  const { pixels, width, height } = sprite;
  const issues: OutlineIssue[] = [];
  const allColors = analyzeColorUsage(sprite);
  const solidColors = Object.keys(allColors.colors);
  if (solidColors.length === 0) return [];

  const outlineColor = darkestColor(solidColors);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = pixels[y]?.[x] ?? '';
      if (isTransparent(p)) continue;

      // Check for gap in outline: solid pixel touching transparent that is NOT the outline color
      const touchesTransparent = getNeighbors4(x, y, width, height).some(([nx, ny]) => isTransparent(pixels[ny]?.[nx]));
      if (touchesTransparent && p.toLowerCase() !== outlineColor.toLowerCase()) {
        // Check if this looks like a missing outline
        const hasOutlineNeighbor = getNeighbors4(x, y, width, height).some(([nx, ny]) =>
          !isTransparent(pixels[ny]?.[nx]) && pixels[ny][nx].toLowerCase() === outlineColor.toLowerCase()
        );
        if (!hasOutlineNeighbor) {
          issues.push({
            type: 'gap', x, y,
            description: `Edge pixel at (${x},${y}) is not outline color (${p}) and has no adjacent outline`
          });
        }
      }

      // Check for double outline: two adjacent dark pixels both touching transparent
      if (p.toLowerCase() === outlineColor.toLowerCase()) {
        const darkNeighbors = getNeighbors4(x, y, width, height).filter(([nx, ny]) =>
          !isTransparent(pixels[ny]?.[nx]) && pixels[ny]?.[nx]?.toLowerCase() === outlineColor.toLowerCase()
        );
        if (darkNeighbors.length >= 3 && touchesTransparent) {
          issues.push({
            type: 'double-outline', x, y,
            description: `Thick outline cluster at (${x},${y}) — 3+ adjacent dark pixels suggests double-outline`
          });
        }
      }
    }
  }

  // Check for jagged diagonals: consecutive 1-pixel staircase
  let jagCount = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = pixels[y]?.[x] ?? '';
      if (isTransparent(p)) continue;
      const diagTL = !isTransparent(pixels[y - 1]?.[x - 1] ?? '');
      const diagBR = !isTransparent(pixels[y + 1]?.[x + 1] ?? '');
      const left = isTransparent(pixels[y]?.[x - 1] ?? '');
      const top = isTransparent(pixels[y - 1]?.[x] ?? '');
      if (diagTL && diagBR && left && top) jagCount++;
    }
  }
  if (jagCount > 3) {
    issues.push({ type: 'jagged', x: 0, y: 0, description: `${jagCount} potential jagged diagonal pixels — use 2-pixel steps on diagonals` });
  }

  // Deduplicate similar locations
  const deduped: OutlineIssue[] = [];
  const seen = new Set<string>();
  for (const issue of issues) {
    const key = `${issue.type}-${Math.floor(issue.x / 2)}-${Math.floor(issue.y / 2)}`;
    if (!seen.has(key)) { seen.add(key); deduped.push(issue); }
  }

  return deduped.slice(0, 20); // Cap at 20 issues for readability
}

/**
 * Main sprite validation against a specific style.
 */
export function validateSprite(sprite: Sprite, style: 'undertale' | 'omori' | 'pokemon'): SpriteReport {
  const issues: string[] = [];
  const passes: string[] = [];
  let score = 70;

  const colorUsage = analyzeColorUsage(sprite);
  const silhouetteScore = checkSilhouetteReadability(sprite);
  const outlineIssues = findOutlineIssues(sprite);
  const { colorCount, solidPixels, transparentPixels } = colorUsage;
  const outlineColor = darkestColor(Object.keys(colorUsage.colors));
  const hasOutline = outlineIssues.filter(i => i.type === 'gap').length < 5;

  // ── Silhouette ──
  if (silhouetteScore >= 80) { passes.push(`Strong silhouette readability: ${silhouetteScore}/100`); score += 10; }
  else if (silhouetteScore >= 55) { passes.push(`Adequate silhouette: ${silhouetteScore}/100`); }
  else { issues.push(`Weak silhouette (${silhouetteScore}/100) — simplify the shape or add more outline contrast`); score -= 15; }

  // ── Outline ──
  if (hasOutline) { passes.push('Consistent outline detected'); score += 5; }
  else { issues.push('Missing or inconsistent outline — add 1-pixel dark border to all edges'); score -= 15; }

  if (outlineIssues.length > 0) {
    const gapCount = outlineIssues.filter(i => i.type === 'gap').length;
    if (gapCount > 0) { issues.push(`${gapCount} outline gaps found — close them for crisp edges`); score -= gapCount * 2; }
  }

  // ── Solid pixel check ──
  if (solidPixels === 0) { issues.push('Sprite has no solid pixels'); return { style, valid: false, score: 0, silhouetteScore: 0, colorCount: 0, hasOutline: false, issues, passes, colorUsage }; }

  // ── Style-specific rules ──
  if (style === 'undertale') {
    // 4-8 colors, near-black outline, high contrast
    if (colorCount < 3) { issues.push('Too few colors for Undertale style — use 4-8'); score -= 20; }
    else if (colorCount <= 8) { passes.push(`Good color economy: ${colorCount} colors (Undertale ideal: 4-8)`); }
    else if (colorCount <= 12) { issues.push(`${colorCount} colors — Undertale style prefers 4-8 per sprite`); score -= 5; }
    else { issues.push(`${colorCount} colors — too many for Undertale style`); score -= 15; }

    // Outline darkness check
    const h = outlineColor.replace('#', '');
    const maxCh = Math.max(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
    if (maxCh > 40) { issues.push(`Outline color ${outlineColor} is not dark enough — Undertale uses near-black outlines`); score -= 10; }
    else { passes.push(`Dark outline: ${outlineColor}`); }

    // Size check: Undertale sprites are typically small and snappy
    if (sprite.width > 64 || sprite.height > 64) { issues.push('Very large sprite — Undertale style uses small, readable forms'); score -= 5; }

  } else if (style === 'omori') {
    // 5-12 colors, pure black outline, muted palette, thick visible outline
    if (colorCount < 4) { issues.push('Too few colors for OMORI style — use 5-12 for proper shading'); score -= 20; }
    else if (colorCount <= 12) { passes.push(`Good color range: ${colorCount} colors (OMORI ideal: 5-12)`); }
    else { issues.push(`${colorCount} colors — OMORI sprites keep palettes tight`); score -= 8; }

    const h = outlineColor.replace('#', '');
    const maxCh = Math.max(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
    if (maxCh > 20) { issues.push(`OMORI uses pure black outlines (#000000 or very close); current: ${outlineColor}`); score -= 15; }
    else { passes.push(`Correct pure-black outline: ${outlineColor}`); }

    // Check outline thickness: OMORI has slightly thicker outlines at character scale
    const outlinePixels = colorUsage.colors[outlineColor.toLowerCase()] ?? 0;
    const outlineRatio = outlinePixels / solidPixels;
    if (outlineRatio < 0.08) { issues.push('Outline may be too thin for OMORI style — consider slightly thicker edges'); score -= 5; }
    else { passes.push(`Good outline density: ${(outlineRatio * 100).toFixed(0)}% of solid pixels`); }

  } else if (style === 'pokemon') {
    // Classic Game Boy: exactly 4 colors per sprite (light→dark)
    // Or modern DS+: small palette with clean cel shading
    if (colorCount > 16) { issues.push(`${colorCount} colors — Pokemon sprites use ≤16 colors per sprite`); score -= 20; }
    else if (colorCount <= 8) { passes.push(`Clean palette: ${colorCount} colors (Pokemon style ✓)`); }
    else { passes.push(`${colorCount} colors — within Pokemon sprite range`); }

    // Pokemon sprites are typically symmetric or near-symmetric
    let symScore = 0;
    const midX = Math.floor(sprite.width / 2);
    for (let y = 0; y < sprite.height; y++) {
      for (let x = 0; x < midX; x++) {
        const mirrorX = sprite.width - 1 - x;
        const left = isTransparent(sprite.pixels[y]?.[x] ?? '');
        const right = isTransparent(sprite.pixels[y]?.[mirrorX] ?? '');
        if (left === right) symScore++;
      }
    }
    const symTotal = midX * sprite.height;
    const symPct = symTotal > 0 ? (symScore / symTotal) * 100 : 100;
    if (symPct > 70) { passes.push(`Good symmetry: ${symPct.toFixed(0)}%`); score += 5; }
    else { issues.push(`Low symmetry (${symPct.toFixed(0)}%) — Pokemon sprites tend toward symmetrical designs`); }
  }

  // ── Transparency usage ──
  const transpPct = (transparentPixels / (sprite.width * sprite.height)) * 100;
  if (transpPct > 90) { issues.push(`${transpPct.toFixed(0)}% transparent — sprite may be too sparse`); score -= 10; }
  else if (transpPct < 5) { issues.push('Almost no transparency — sprite should have transparent background'); score -= 10; }
  else { passes.push(`Good transparency usage: ${transpPct.toFixed(0)}% transparent background`); }

  return {
    style, valid: issues.length === 0, score: Math.max(0, Math.min(100, score)),
    silhouetteScore, colorCount, hasOutline, issues, passes, colorUsage,
  };
}

/**
 * Generate improvement suggestions based on full sprite analysis.
 * Suggestions are prioritized: critical → major → minor.
 */
export function suggestImprovements(sprite: Sprite): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const colorUsage = analyzeColorUsage(sprite);
  const silhouette = checkSilhouetteReadability(sprite);
  const outlineIssues = findOutlineIssues(sprite);

  if (colorUsage.solidPixels === 0) {
    return [{ priority: 'critical', description: 'Sprite has no visible pixels — nothing to improve' }];
  }

  // Silhouette
  if (silhouette < 50) {
    suggestions.push({ priority: 'critical', description: `Silhouette score is ${silhouette}/100 — redesign the shape to read clearly at a glance. Simple, iconic forms work best.` });
  } else if (silhouette < 75) {
    suggestions.push({ priority: 'major', description: `Silhouette could be stronger (${silhouette}/100) — reduce interior holes and ensure the shape is recognizable in solid black.` });
  }

  // Outline issues
  const gaps = outlineIssues.filter(i => i.type === 'gap');
  if (gaps.length > 0) {
    suggestions.push({
      priority: 'critical',
      description: `${gaps.length} outline gap(s) — paint them with the outline color`,
      location: gaps[0] ? { x: gaps[0].x, y: gaps[0].y } : undefined,
    });
  }
  const jaggeds = outlineIssues.filter(i => i.type === 'jagged');
  if (jaggeds.length > 0) {
    suggestions.push({ priority: 'major', description: 'Jagged diagonal edges detected — use 2-pixel steps on diagonals for clean pixel art curves' });
  }
  const doubles = outlineIssues.filter(i => i.type === 'double-outline');
  if (doubles.length > 2) {
    suggestions.push({ priority: 'minor', description: `${doubles.length} double-outline cluster(s) — thin the outline to exactly 1 pixel` });
  }

  // Color count
  if (colorUsage.colorCount > 16) {
    suggestions.push({ priority: 'major', description: `${colorUsage.colorCount} colors used — reduce to 8-12 for tighter pixel art. Group similar shades into one color.` });
  }
  if (colorUsage.colorCount < 4) {
    suggestions.push({ priority: 'minor', description: `Only ${colorUsage.colorCount} colors — add at least 1-2 shading colors for depth` });
  }

  // Color distribution
  const dominant = colorUsage.mostUsedColors[0];
  if (dominant && dominant.percent > 70) {
    suggestions.push({ priority: 'minor', description: `${dominant.color} covers ${dominant.percent}% of sprite — consider adding more varied shading` });
  }

  // Empty sprite handling
  if (sprite.width < 4 || sprite.height < 4) {
    suggestions.push({ priority: 'critical', description: 'Sprite dimensions too small to contain readable pixel art — minimum 8x8 recommended' });
  }

  return suggestions;
}
