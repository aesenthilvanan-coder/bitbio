/**
 * BitBio Style Checker
 * Enforces visual consistency across all BitBio pixel art assets.
 * Validates against the canonical style guide derived from Undertale/OMORI/Pokemon B/W research.
 */

import { hexToHSL, hexToRGB, analyzePalette } from './palette-analyzer';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BitBioStyleGuide {
  scale: 3;
  tileSize: 16;
  spriteTarget: { width: 10; height: 20 };
  palettes: {
    cytoplasm: string[];
    genomeForest: string[];
    neuralNebula: string[];
    proteinCathedral: string[];
    global: { bg: string; dialogueBg: string; dialogueBorder: string; text: string };
  };
  darkMode: true;
  primaryBg: '#030008';
  maxColorsPerSprite: 8;
  maxColorsPerTileSet: 16;
  lightSourceDirection: 'top-left';
}

export const BITBIO_STYLE_GUIDE: BitBioStyleGuide = {
  scale: 3,
  tileSize: 16,
  spriteTarget: { width: 10, height: 20 },
  palettes: {
    cytoplasm: ['#020609','#050d10','#060e12','#0a1a22','#00ffcc','#00aaff','#80ffee','#001a15'],
    genomeForest: ['#030804','#050f04','#040c03','#0a1a05','#00ff44','#44cc00','#88ff88','#001500'],
    neuralNebula: ['#030008','#080510','#060410','#100820','#aa44ff','#ff44aa','#dd99ff','#200040'],
    proteinCathedral: ['#080608','#0a080f','#0c0a10','#18121f','#ffaa00','#ff6600','#ffdd88','#1a0800'],
    global: { bg: '#030008', dialogueBg: '#000000', dialogueBorder: '#ffffff', text: '#ffffff' },
  },
  darkMode: true,
  primaryBg: '#030008',
  maxColorsPerSprite: 8,
  maxColorsPerTileSet: 16,
  lightSourceDirection: 'top-left',
};

export interface StyleIssue {
  severity: 'critical' | 'warning' | 'suggestion';
  rule: string;
  description: string;
  suggestion: string;
}

export interface ConsistencyReport {
  score: number;  // 0–100
  issues: StyleIssue[];
  recommendations: string[];
  passesShipThreshold: boolean; // score >= 70
  passesTargetThreshold: boolean; // score >= 85
}

export interface TileHarmonyReport {
  score: number;
  colorsInPalette: string[];
  colorsOutOfPalette: string[];
  paletteCompliance: number; // % of tile colors that are in realm palette
}

export interface Asset {
  type: 'sprite' | 'tile' | 'ui';
  realm?: 1 | 2 | 3 | 4;
  colors: string[];
  width?: number;
  height?: number;
  name: string;
}

// ─── Color Distance Helpers ───────────────────────────────────────────────────

function colorDistance(hex1: string, hex2: string): number {
  const a = hexToRGB(hex1), b = hexToRGB(hex2);
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

function findNearestPaletteColor(color: string, palette: string[]): { color: string; distance: number } {
  let best = { color: palette[0], distance: Infinity };
  for (const pc of palette) {
    const d = colorDistance(color, pc);
    if (d < best.distance) best = { color: pc, distance: d };
  }
  return best;
}

function getLuminance(hex: string): number {
  const { r, g, b } = hexToRGB(hex);
  const [rs, gs, bs] = [r, g, b].map(v => {
    const sRGB = v / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1), l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Realm Palette Getter ─────────────────────────────────────────────────────

function getRealmPalette(realm: 1 | 2 | 3 | 4): string[] {
  const map: Record<number, string[]> = {
    1: BITBIO_STYLE_GUIDE.palettes.cytoplasm,
    2: BITBIO_STYLE_GUIDE.palettes.genomeForest,
    3: BITBIO_STYLE_GUIDE.palettes.neuralNebula,
    4: BITBIO_STYLE_GUIDE.palettes.proteinCathedral,
  };
  return map[realm] ?? [];
}

// ─── Core Functions ───────────────────────────────────────────────────────────

export function validateTilesetHarmony(tileColors: string[], palette: string[]): TileHarmonyReport {
  const tolerance = 30; // color distance threshold for "close enough"
  const inPalette: string[] = [];
  const outOfPalette: string[] = [];

  for (const color of tileColors) {
    const nearest = findNearestPaletteColor(color, palette);
    if (nearest.distance <= tolerance) {
      inPalette.push(color);
    } else {
      outOfPalette.push(color);
    }
  }

  const compliance = tileColors.length > 0 ? (inPalette.length / tileColors.length) * 100 : 100;
  return {
    score: Math.round(compliance),
    colorsInPalette: inPalette,
    colorsOutOfPalette: outOfPalette,
    paletteCompliance: compliance,
  };
}

export function detectStyleBreakage(asset: Asset, guide: BitBioStyleGuide): StyleIssue[] {
  const issues: StyleIssue[] = [];

  // 1. Check color count
  const uniqueColors = new Set(asset.colors.map(c => c.toLowerCase()));
  const maxAllowed = asset.type === 'sprite' ? guide.maxColorsPerSprite : guide.maxColorsPerTileSet;
  if (uniqueColors.size > maxAllowed) {
    issues.push({
      severity: 'warning',
      rule: 'color-count',
      description: `Asset "${asset.name}" uses ${uniqueColors.size} colors (max: ${maxAllowed})`,
      suggestion: `Reduce to ${maxAllowed} colors by merging similar shades. Use the palette analyzer's mergeSimilarColors() helper.`,
    });
  }

  // 2. Check realm palette compliance
  if (asset.realm) {
    const realmPalette = getRealmPalette(asset.realm);
    const harmony = validateTilesetHarmony(asset.colors, realmPalette);
    if (harmony.paletteCompliance < 80) {
      issues.push({
        severity: 'critical',
        rule: 'realm-palette',
        description: `Asset "${asset.name}" uses colors outside Realm ${asset.realm} palette (${harmony.paletteCompliance.toFixed(0)}% compliant)`,
        suggestion: `Remap these out-of-palette colors: ${harmony.colorsOutOfPalette.slice(0, 3).join(', ')}`,
      });
    }
  }

  // 3. Check background darkness
  for (const color of asset.colors) {
    const lum = getLuminance(color) * 100;
    if (asset.type === 'tile' && lum > 40) {
      const hsl = hexToHSL(color);
      if (hsl.l > 0.5) {
        issues.push({
          severity: 'warning',
          rule: 'dark-background',
          description: `Tile color ${color} (lightness ${(hsl.l * 100).toFixed(0)}%) may be too bright for BitBio's dark aesthetic`,
          suggestion: `Dark BitBio floors should have lightness < 15%. Highlights can go to 30%. Accent colors can be bright but should be small areas only.`,
        });
        break;
      }
    }
  }

  // 4. Check contrast for sprite assets on realm background
  if (asset.type === 'sprite' && asset.realm) {
    const bg = getRealmPalette(asset.realm)[0];
    const maxContrast = Math.max(...asset.colors.map(c => contrastRatio(c, bg)));
    if (maxContrast < 4.5) {
      issues.push({
        severity: 'critical',
        rule: 'character-contrast',
        description: `Sprite "${asset.name}" has insufficient contrast against realm background (max: ${maxContrast.toFixed(1)}:1, need 4.5:1)`,
        suggestion: 'Add lighter highlight colors to the sprite, or darken the realm floor color used near the character.',
      });
    }
  }

  // 5. Check for pure black borders (Undertale-style)
  const hasPureBlack = asset.colors.some(c => c.toLowerCase() === '#000000' || c === '#0a0a0a');
  if (asset.type === 'sprite' && !hasPureBlack) {
    issues.push({
      severity: 'suggestion',
      rule: 'undertale-outline',
      description: `Sprite "${asset.name}" may benefit from a near-black (#0a0a0a) outline following Undertale conventions`,
      suggestion: 'Add #000000 or #0a0a0a outline pixels around the character edge for Undertale-style grounding.',
    });
  }

  return issues;
}

export function checkConsistency(assets: Asset[], guide: BitBioStyleGuide): ConsistencyReport {
  const allIssues: StyleIssue[] = [];
  const recommendations: string[] = [];

  for (const asset of assets) {
    const assetIssues = detectStyleBreakage(asset, guide);
    allIssues.push(...assetIssues);
  }

  // Check cross-asset consistency: same type of asset should use same palette
  const spritesByRealm = new Map<number, Asset[]>();
  for (const asset of assets) {
    if (asset.type === 'sprite' && asset.realm) {
      if (!spritesByRealm.has(asset.realm)) spritesByRealm.set(asset.realm, []);
      spritesByRealm.get(asset.realm)!.push(asset);
    }
  }

  for (const [realm, realmSprites] of spritesByRealm) {
    if (realmSprites.length > 1) {
      // Check that all sprites in same realm share at least 60% of colors
      const allColors = realmSprites.map(s => new Set(s.colors.map(c => c.toLowerCase())));
      for (let i = 0; i < allColors.length - 1; i++) {
        const a = allColors[i], b = allColors[i + 1];
        const union = new Set([...a, ...b]);
        const intersection = [...a].filter(c => b.has(c));
        const similarity = intersection.length / union.size;
        if (similarity < 0.6) {
          recommendations.push(`Sprites in Realm ${realm} share only ${(similarity * 100).toFixed(0)}% of colors. Align palettes for visual cohesion.`);
          break;
        }
      }
    }
  }

  // Score calculation
  const criticals = allIssues.filter(i => i.severity === 'critical').length;
  const warnings = allIssues.filter(i => i.severity === 'warning').length;
  const score = Math.max(0, 100 - criticals * 15 - warnings * 5);

  if (score < 70) recommendations.push('Critical style violations detected. Fix critical issues before deploying assets.');
  if (score >= 70 && score < 85) recommendations.push('Assets meet minimum quality bar. Address warnings to hit target quality.');
  if (score >= 85) recommendations.push('Assets meet target quality standards. Ready for integration.');

  return {
    score,
    issues: allIssues,
    recommendations,
    passesShipThreshold: score >= 70,
    passesTargetThreshold: score >= 85,
  };
}

// ─── Convenience Validators ───────────────────────────────────────────────────

export function validateRealmAsset(colors: string[], realm: 1 | 2 | 3 | 4, name: string): StyleIssue[] {
  const asset: Asset = { type: 'tile', realm, colors, name };
  return detectStyleBreakage(asset, BITBIO_STYLE_GUIDE);
}

export function validateSpriteColors(colors: string[], realm: 1 | 2 | 3 | 4, name: string): StyleIssue[] {
  const asset: Asset = { type: 'sprite', realm, colors, name };
  return detectStyleBreakage(asset, BITBIO_STYLE_GUIDE);
}

export function getRealmAccentColor(realm: 1 | 2 | 3 | 4): string {
  return ['#00ffcc', '#00ff44', '#aa44ff', '#ffaa00'][realm - 1];
}

export function getRealmFloorColor(realm: 1 | 2 | 3 | 4): string {
  return ['#050d10', '#050f04', '#080510', '#0a080f'][realm - 1];
}

export function getRealmWallColor(realm: 1 | 2 | 3 | 4): string {
  return ['#0a1a22', '#0a1a05', '#100820', '#18121f'][realm - 1];
}
