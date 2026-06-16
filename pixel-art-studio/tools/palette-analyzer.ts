/**
 * BitBio Palette Analyzer
 * Analyzes hex color palettes for pixel art quality using real color math.
 * Checks hue shifting, saturation curves, contrast ratios, and style compliance.
 */

// ─── Color Math Primitives ────────────────────────────────────────────────────

export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }

export function hexToRGB(hex: string): RGB {
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

export function hexToHSL(hex: string): HSL {
  const { r, g, b } = hexToRGB(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToHex({ h, s, l }: HSL): string {
  const hn = ((h % 360) + 360) % 360 / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return rgbToHex({ r: v, g: v, b: v });
  }
  const hue2rgb = (p: number, q: number, t: number): number => {
    const tn = ((t % 1) + 1) % 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return rgbToHex({
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  });
}

/** WCAG relative luminance for contrast ratio calculation */
function relativeLuminance({ r, g, b }: RGB): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRGB(hex1));
  const l2 = relativeLuminance(hexToRGB(hex2));
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Report Types ─────────────────────────────────────────────────────────────

export interface ContrastPair {
  color1: string;
  color2: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

export interface HueShiftReport {
  hasShift: boolean;
  avgShiftDegrees: number;
  direction: 'warm' | 'cool' | 'none' | 'inconsistent';
  quality: 'poor' | 'acceptable' | 'good' | 'excellent';
  details: string;
}

export interface PaletteReport {
  colorCount: number;
  idealRange: boolean;          // 4-16 for a sprite, up to 64 for full game
  hueShift: HueShiftReport;
  saturationCurve: 'flat' | 'good' | 'excellent';
  saturationDetails: string;
  contrastPairs: ContrastPair[];
  overallScore: number;         // 0-100
  suggestions: string[];
  darkest: string;
  lightest: string;
}

export interface ValidationResult {
  valid: boolean;
  score: number;               // 0-100
  issues: string[];
  passes: string[];
}

// ─── Core Analysis ────────────────────────────────────────────────────────────

/**
 * Full palette quality analysis. Pass an array of hex color strings.
 * Colors can optionally include alpha (8-char hex) — alpha channel is ignored for analysis.
 */
export function analyzePalette(colors: string[]): PaletteReport {
  const clean = colors.map(c => c.slice(0, 7)); // strip alpha
  const unique = [...new Set(clean)];
  const hslColors = unique.map(hexToHSL);

  // Sort by lightness for ordered analysis
  const sorted = [...unique].sort((a, b) => hexToHSL(a).l - hexToHSL(b).l);

  // Color count check (4-16 per sprite, 64 for full game)
  const count = unique.length;
  const idealRange = count >= 4 && count <= 64;

  // Hue shift analysis
  const hueShift = checkHueShift(unique);

  // Saturation curve: shadows/darks should have different sat than highlights
  const byLight = hslColors.sort((a, b) => a.l - b.l);
  const darkSats = byLight.slice(0, Math.ceil(byLight.length / 3)).map(c => c.s);
  const lightSats = byLight.slice(Math.floor(byLight.length * 2 / 3)).map(c => c.s);
  const avgDarkSat = darkSats.reduce((a, b) => a + b, 0) / (darkSats.length || 1);
  const avgLightSat = lightSats.reduce((a, b) => a + b, 0) / (lightSats.length || 1);
  const satDiff = Math.abs(avgDarkSat - avgLightSat);
  let saturationCurve: 'flat' | 'good' | 'excellent' = 'flat';
  let saturationDetails = '';
  if (satDiff > 0.3) {
    saturationCurve = 'excellent';
    saturationDetails = `Darks avg sat ${(avgDarkSat * 100).toFixed(0)}% vs lights ${(avgLightSat * 100).toFixed(0)}% — strong variation`;
  } else if (satDiff > 0.1) {
    saturationCurve = 'good';
    saturationDetails = `Moderate sat variation (${(satDiff * 100).toFixed(0)}% delta)`;
  } else {
    saturationDetails = `Flat saturation across palette — shadows and highlights have similar sat`;
  }

  // Contrast pairs: check each adjacent pair in luminance order
  const contrastPairs: ContrastPair[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const ratio = contrastRatio(sorted[i], sorted[i + 1]);
    contrastPairs.push({
      color1: sorted[i], color2: sorted[i + 1], ratio,
      wcagAA: ratio >= 4.5, wcagAAA: ratio >= 7,
    });
  }
  // Also check first vs last (full range contrast)
  if (sorted.length >= 2) {
    const ratio = contrastRatio(sorted[0], sorted[sorted.length - 1]);
    contrastPairs.push({
      color1: sorted[0], color2: sorted[sorted.length - 1], ratio,
      wcagAA: ratio >= 4.5, wcagAAA: ratio >= 7,
    });
  }

  // Score
  const suggestions: string[] = [];
  let score = 60;

  if (count < 4) { suggestions.push('Too few colors — add at least 4 for visual interest'); score -= 20; }
  if (count > 64) { suggestions.push('Too many colors — reduce to 64 max for game-wide palette'); score -= 10; }
  if (hueShift.quality === 'poor') { suggestions.push('Add hue shifting — shadows should lean cool, highlights warm (or vice versa)'); score -= 15; }
  if (hueShift.quality === 'acceptable') score += 5;
  if (hueShift.quality === 'good') score += 10;
  if (hueShift.quality === 'excellent') score += 20;
  if (saturationCurve === 'excellent') score += 15;
  if (saturationCurve === 'good') score += 8;
  if (saturationCurve === 'flat') suggestions.push('Vary saturation between darks and lights — avoid uniform saturation');
  const goodContrast = contrastPairs.filter(p => p.wcagAA).length;
  if (goodContrast === 0) { suggestions.push('No color pairs meet WCAG AA contrast — increase value separation'); score -= 10; }
  else if (goodContrast >= contrastPairs.length * 0.5) score += 5;

  if (suggestions.length === 0) suggestions.push('Palette looks solid!');

  return {
    colorCount: count, idealRange, hueShift, saturationCurve, saturationDetails,
    contrastPairs, overallScore: Math.max(0, Math.min(100, score)), suggestions,
    darkest: sorted[0] ?? '', lightest: sorted[sorted.length - 1] ?? '',
  };
}

/**
 * Build a hue-shifted color ramp from a base color.
 * Dark end shifts hue toward +15° (cooler), highlight end shifts -8° (warmer).
 * This mimics how great pixel art palettes work.
 */
export function buildColorRamp(baseColor: string, steps: number): string[] {
  if (steps < 2) return [baseColor];
  const hsl = hexToHSL(baseColor);

  // Dark end: lower lightness, shift hue +15°, slightly boost saturation
  const darkHSL: HSL = { h: hsl.h + 15, s: Math.min(1, hsl.s + 0.1), l: Math.max(0.03, hsl.l - 0.32) };
  // Light end: higher lightness, shift hue -8°, slightly reduce saturation
  const lightHSL: HSL = { h: hsl.h - 8, s: Math.max(0, hsl.s - 0.15), l: Math.min(0.92, hsl.l + 0.35) };

  return Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0.5 : i / (steps - 1);
    const h = darkHSL.h + (lightHSL.h - darkHSL.h) * t;
    const s = darkHSL.s + (lightHSL.s - darkHSL.s) * t;
    const l = darkHSL.l + (lightHSL.l - darkHSL.l) * t;
    return hslToHex({ h, s, l });
  });
}

/**
 * Analyze how well a palette uses hue shifting.
 * Good pixel art shifts hue as value changes — shadows lean toward a shifted hue,
 * not just darker versions of the same hue.
 */
export function checkHueShift(colors: string[]): HueShiftReport {
  if (colors.length < 2) {
    return { hasShift: false, avgShiftDegrees: 0, direction: 'none', quality: 'poor', details: 'Need at least 2 colors to check hue shift' };
  }

  const hslColors = colors.map(c => ({ hex: c, hsl: hexToHSL(c) }));
  // Sort by lightness
  const sorted = hslColors.sort((a, b) => a.hsl.l - b.hsl.l);

  // Measure hue delta between adjacent steps in lightness
  const hueDeltas: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    let delta = sorted[i].hsl.l > 0.01 && sorted[i - 1].hsl.l > 0.01
      ? sorted[i].hsl.h - sorted[i - 1].hsl.h
      : 0;
    // Normalize to -180..180
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    hueDeltas.push(delta);
  }

  const avgShift = hueDeltas.reduce((a, b) => a + b, 0) / (hueDeltas.length || 1);
  const absAvg = Math.abs(avgShift);
  const allSameSign = hueDeltas.every(d => d >= 0) || hueDeltas.every(d => d <= 0);

  let direction: HueShiftReport['direction'] = 'none';
  if (absAvg > 3) {
    // Positive hue shift going light→dark = rotating CCW through spectrum
    direction = allSameSign ? (avgShift > 0 ? 'cool' : 'warm') : 'inconsistent';
  }

  let quality: HueShiftReport['quality'] = 'poor';
  let details = '';
  if (absAvg < 3) {
    quality = 'poor';
    details = 'Negligible hue shift — palette uses only brightness changes';
  } else if (absAvg < 8) {
    quality = 'acceptable';
    details = `Subtle hue shift (~${absAvg.toFixed(1)}°) — noticeable but could be stronger`;
  } else if (absAvg < 18) {
    quality = 'good';
    details = `Good hue shift (~${absAvg.toFixed(1)}°) — ${direction} lean in shadows`;
  } else {
    quality = 'excellent';
    details = `Strong hue shift (~${absAvg.toFixed(1)}°, ${direction}) — professional palette technique`;
  }

  return { hasShift: absAvg > 3, avgShiftDegrees: parseFloat(absAvg.toFixed(1)), direction, quality, details };
}

/**
 * Return a curated starter palette for a given mood.
 * All palettes work against BitBio's #030008 near-black background.
 */
export function suggestPalette(mood: 'dark' | 'dream' | 'horror' | 'warm'): string[] {
  const palettes: Record<typeof mood, string[]> = {
    dark: [
      '#030008', '#0d0814', '#1a1228', '#2a1a3a',
      '#6644ff', '#aa44ff', '#dd99ff', '#ffffff',
      '#004466', '#00aacc',
    ],
    dream: [
      '#030008', '#080412', '#140828', '#2a1044',
      '#aa44ff', '#ff88cc', '#ffaaee', '#88eeff',
      '#ffffff', '#ffddff', '#ccbbff',
    ],
    horror: [
      '#030008', '#0a0004', '#1a0008', '#2a000a',
      '#ff0022', '#cc0011', '#880008', '#440004',
      '#ffffff', '#ffaaaa', '#ffe0e0',
    ],
    warm: [
      '#030008', '#090601', '#150e02', '#281c04',
      '#ff8800', '#ffcc00', '#ffee44', '#ffffff',
      '#664400', '#aa6600', '#ddaa00',
    ],
  };
  return palettes[mood];
}

/**
 * Validate a palette against Undertale style rules:
 * - Near-black background (#000 or very close)
 * - High contrast between darkest and lightest
 * - Limited palette (4-8 colors per sprite feel)
 * - At least one near-white highlight
 * - Strong shadow (darkest color very dark)
 */
export function validateUndertaleStyle(colors: string[]): ValidationResult {
  const issues: string[] = [];
  const passes: string[] = [];
  let score = 100;

  const hslColors = colors.map(c => ({ hex: c, hsl: hexToHSL(c) }));
  const sorted = hslColors.sort((a, b) => a.hsl.l - b.hsl.l);
  const darkest = sorted[0];
  const lightest = sorted[sorted.length - 1];

  // Near-black background
  if (darkest.hsl.l > 0.1) {
    issues.push('Darkest color is not dark enough — Undertale uses near-black (#050505 or darker)');
    score -= 20;
  } else {
    passes.push(`Good dark anchor: ${darkest.hex} (L=${(darkest.hsl.l * 100).toFixed(0)}%)`);
  }

  // Near-white highlight
  if (lightest.hsl.l < 0.75) {
    issues.push('No bright highlight color — Undertale sprites use near-white for key details');
    score -= 15;
  } else {
    passes.push(`Bright highlight present: ${lightest.hex}`);
  }

  // Full range contrast
  const fullContrast = contrastRatio(darkest.hex, lightest.hex);
  if (fullContrast < 10) {
    issues.push(`Full-range contrast (${fullContrast.toFixed(1)}:1) is low — Undertale has very high contrast`);
    score -= 15;
  } else {
    passes.push(`Strong full-range contrast: ${fullContrast.toFixed(1)}:1`);
  }

  // Color count
  if (colors.length > 8) {
    issues.push(`${colors.length} colors — Undertale sprites typically use 4-8 per sprite`);
    score -= 10;
  } else if (colors.length >= 4) {
    passes.push(`Good color economy: ${colors.length} colors`);
  } else {
    issues.push('Too few colors — need at least 4 for readable Undertale-style sprites');
    score -= 20;
  }

  // Hue shift check
  const hs = checkHueShift(colors);
  if (hs.quality === 'good' || hs.quality === 'excellent') {
    passes.push(`Hue shift present: ${hs.details}`);
  } else {
    issues.push('Add hue shifting — Undertale palettes subtly shift hue in shadows/highlights');
    score -= 5;
  }

  return { valid: issues.length === 0, score: Math.max(0, score), issues, passes };
}

/**
 * Validate a palette against OMORI style rules:
 * - Stark black outlines (#000000 or very close)
 * - Muted, slightly desaturated mid-tones
 * - Clean white highlights
 * - Pastel-to-neutral color range (not neon)
 * - Consistent shadow tone (single shadow color)
 */
export function validateOmoriStyle(colors: string[]): ValidationResult {
  const issues: string[] = [];
  const passes: string[] = [];
  let score = 100;

  const hslColors = colors.map(c => ({ hex: c, hsl: hexToHSL(c) }));
  const sorted = hslColors.sort((a, b) => a.hsl.l - b.hsl.l);
  const darkest = sorted[0];
  const lightest = sorted[sorted.length - 1];

  // True black or very near black for outlines
  const rgb = hexToRGB(darkest.hex);
  const maxChannel = Math.max(rgb.r, rgb.g, rgb.b);
  if (maxChannel > 20) {
    issues.push(`Darkest color ${darkest.hex} is not black enough — OMORI uses pure #000000 or very close outlines`);
    score -= 20;
  } else {
    passes.push(`Correct outline darkness: ${darkest.hex}`);
  }

  // White highlights
  if (lightest.hsl.l < 0.85) {
    issues.push('Highlights not bright enough — OMORI uses clean whites (#ffffff or near-white)');
    score -= 15;
  } else {
    passes.push(`Clean white highlights: ${lightest.hex}`);
  }

  // Saturation check: OMORI uses muted/desaturated tones (not neons)
  const neonColors = hslColors.filter(c => c.hsl.s > 0.85 && c.hsl.l > 0.4 && c.hsl.l < 0.85);
  if (neonColors.length > 0) {
    issues.push(`${neonColors.length} neon/oversaturated color(s) — OMORI uses muted pastels, not vivid neons`);
    score -= 10 * neonColors.length;
  } else {
    passes.push('Good saturation control — no oversaturated colors');
  }

  // Consistent shadow: ideally one shadow tone (low sat, dark)
  const shadowColors = sorted.slice(0, Math.max(1, Math.floor(sorted.length * 0.25)));
  const shadowSats = shadowColors.map(c => c.hsl.s);
  const maxShadowSat = Math.max(...shadowSats);
  if (maxShadowSat > 0.3) {
    issues.push('Shadow colors too saturated — OMORI shadows are near-black with minimal saturation');
    score -= 10;
  } else {
    passes.push('Shadow tones correctly desaturated');
  }

  // Color count: OMORI uses more colors than Undertale for shading
  if (colors.length < 4) {
    issues.push('Too few colors — OMORI sprites use 5-10 colors for smooth flat shading');
    score -= 15;
  } else if (colors.length > 16) {
    issues.push(`${colors.length} colors — consider reducing; OMORI keeps sprite palettes tight`);
    score -= 5;
  } else {
    passes.push(`Color count in range: ${colors.length}`);
  }

  return { valid: issues.length === 0, score: Math.max(0, score), issues, passes };
}
