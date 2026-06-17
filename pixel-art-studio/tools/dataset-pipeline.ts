/**
 * BitBio Pixel Art Studio — Dataset Pipeline (Phase 5)
 * Extracts, organizes, and exports pixel art asset metadata for ML training
 */

export type StyleFamily =
  | 'undertale'
  | 'omori'
  | 'pokemon-bw'
  | 'earthbound'
  | 'celeste'
  | 'stardew'
  | 'bitbio';

export interface SpriteMetadata {
  id: string;
  source: string;
  character: string;
  animation: string;
  frameIndex: number;
  totalFrames: number;
  dimensions: { width: number; height: number };
  scale: number;
  palette: string[];
  paletteSize: number;
  tags: string[];
  realm: number | null;
  styleFamily: StyleFamily;
  qualityScore: number;
}

export interface TilesetMetadata {
  id: string;
  source: string;
  biome: string;
  tileSize: number;
  totalTiles: number;
  palette: string[];
  animatedTiles: number[];
  tags: string[];
  styleFamily: StyleFamily;
}

export interface DatasetStats {
  totalSprites: number;
  totalTilesets: number;
  totalAnimationFrames: number;
  paletteDistribution: Record<string, number>;
  styleDistribution: Record<string, number>;
  realmDistribution: Record<number, number>;
  tagCounts: Record<string, number>;
}

// ─── BitBio Known Sprites ────────────────────────────────────────────────────

export const BITBIO_SPRITES: SpriteMetadata[] = [
  // Player animations
  { id: 'player-idle-0', source: 'bitbio', character: 'player', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 6, tags: ['player', 'idle', 'humanoid'], realm: null, styleFamily: 'bitbio', qualityScore: 82 },
  { id: 'player-walk-0', source: 'bitbio', character: 'player', animation: 'walk', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 6, tags: ['player', 'walk', 'humanoid'], realm: null, styleFamily: 'bitbio', qualityScore: 80 },
  { id: 'player-run-0', source: 'bitbio', character: 'player', animation: 'run', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 6, tags: ['player', 'run', 'humanoid'], realm: null, styleFamily: 'bitbio', qualityScore: 78 },
  { id: 'player-celebrate-0', source: 'bitbio', character: 'player', animation: 'celebrate', frameIndex: 0, totalFrames: 6, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 6, tags: ['player', 'celebrate', 'humanoid', 'victory'], realm: null, styleFamily: 'bitbio', qualityScore: 85 },
  // Enzyme (white cat companion)
  { id: 'enzyme-walk-0', source: 'bitbio', character: 'enzyme', animation: 'walk', frameIndex: 0, totalFrames: 4, dimensions: { width: 8, height: 10 }, scale: 3, palette: ['#ffffff', '#e0e0e0', '#cccccc', '#aaaaaa', '#333333', '#66ccff'], paletteSize: 6, tags: ['enzyme', 'cat', 'companion', 'walk'], realm: null, styleFamily: 'bitbio', qualityScore: 88 },
  { id: 'enzyme-sit-0', source: 'bitbio', character: 'enzyme', animation: 'sit', frameIndex: 0, totalFrames: 2, dimensions: { width: 7, height: 8 }, scale: 3, palette: ['#ffffff', '#e0e0e0', '#cccccc', '#aaaaaa', '#333333', '#66ccff'], paletteSize: 6, tags: ['enzyme', 'cat', 'companion', 'idle', 'sit'], realm: null, styleFamily: 'bitbio', qualityScore: 90 },
  { id: 'enzyme-fly-0', source: 'bitbio', character: 'enzyme', animation: 'fly', frameIndex: 0, totalFrames: 4, dimensions: { width: 9, height: 10 }, scale: 3, palette: ['#ffffff', '#e0e0e0', '#cccccc', '#aaaaaa', '#333333', '#66ccff', '#ffff00'], paletteSize: 7, tags: ['enzyme', 'cat', 'companion', 'fly', 'hover'], realm: null, styleFamily: 'bitbio', qualityScore: 86 },
  { id: 'enzyme-onhead-0', source: 'bitbio', character: 'enzyme', animation: 'onhead', frameIndex: 0, totalFrames: 2, dimensions: { width: 8, height: 7 }, scale: 3, palette: ['#ffffff', '#e0e0e0', '#cccccc', '#aaaaaa', '#333333', '#66ccff'], paletteSize: 6, tags: ['enzyme', 'cat', 'companion', 'onhead', 'balance'], realm: null, styleFamily: 'bitbio', qualityScore: 92 },
  { id: 'enzyme-excited-0', source: 'bitbio', character: 'enzyme', animation: 'excited', frameIndex: 0, totalFrames: 4, dimensions: { width: 8, height: 12 }, scale: 3, palette: ['#ffffff', '#e0e0e0', '#cccccc', '#aaaaaa', '#333333', '#66ccff', '#ffff00'], paletteSize: 7, tags: ['enzyme', 'cat', 'companion', 'excited', 'jump'], realm: null, styleFamily: 'bitbio', qualityScore: 89 },
  { id: 'enzyme-surprised-0', source: 'bitbio', character: 'enzyme', animation: 'surprised', frameIndex: 0, totalFrames: 3, dimensions: { width: 8, height: 11 }, scale: 3, palette: ['#ffffff', '#e0e0e0', '#cccccc', '#aaaaaa', '#333333', '#66ccff'], paletteSize: 6, tags: ['enzyme', 'cat', 'companion', 'surprised', 'emote'], realm: null, styleFamily: 'bitbio', qualityScore: 87 },
  // NPCs
  { id: 'elliot-idle-0', source: 'bitbio', character: 'elliot', animation: 'idle', frameIndex: 0, totalFrames: 3, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 7, tags: ['npc', 'elliot', 'idle', 'humanoid', 'realm1'], realm: 1, styleFamily: 'bitbio', qualityScore: 80 },
  { id: 'elliot-walk-0', source: 'bitbio', character: 'elliot', animation: 'walk', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 7, tags: ['npc', 'elliot', 'walk', 'humanoid', 'realm1'], realm: 1, styleFamily: 'bitbio', qualityScore: 78 },
  { id: 'ben-idle-0', source: 'bitbio', character: 'ben', animation: 'idle', frameIndex: 0, totalFrames: 3, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 7, tags: ['npc', 'ben', 'idle', 'humanoid', 'realm2'], realm: 2, styleFamily: 'bitbio', qualityScore: 79 },
  { id: 'ben-walk-0', source: 'bitbio', character: 'ben', animation: 'walk', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 7, tags: ['npc', 'ben', 'walk', 'humanoid', 'realm2'], realm: 2, styleFamily: 'bitbio', qualityScore: 77 },
  { id: 'alex-idle-0', source: 'bitbio', character: 'alex', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 7, tags: ['npc', 'alex', 'idle', 'humanoid', 'realm3', 'typing'], realm: 3, styleFamily: 'bitbio', qualityScore: 81 },
  { id: 'alex-walk-0', source: 'bitbio', character: 'alex', animation: 'walk', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 7, tags: ['npc', 'alex', 'walk', 'humanoid', 'realm3'], realm: 3, styleFamily: 'bitbio', qualityScore: 78 },
  { id: 'henry-idle-0', source: 'bitbio', character: 'henry', animation: 'idle', frameIndex: 0, totalFrames: 5, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 8, tags: ['npc', 'henry', 'idle', 'humanoid', 'realm4', 'hologram', 'flicker'], realm: 4, styleFamily: 'bitbio', qualityScore: 93 },
  { id: 'henry-walk-0', source: 'bitbio', character: 'henry', animation: 'walk', frameIndex: 0, totalFrames: 4, dimensions: { width: 10, height: 18 }, scale: 3, palette: [], paletteSize: 8, tags: ['npc', 'henry', 'walk', 'humanoid', 'realm4', 'hologram'], realm: 4, styleFamily: 'bitbio', qualityScore: 91 },
  // Bosses (3 phases each)
  { id: 'lyso-phase1-0', source: 'bitbio', character: 'lyso', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 24, height: 24 }, scale: 3, palette: ['#8b44cc', '#6622aa', '#4400aa', '#cc22ff', '#ff55ff', '#220033'], paletteSize: 6, tags: ['boss', 'lyso', 'phase1', 'enemy', 'realm1'], realm: 1, styleFamily: 'bitbio', qualityScore: 84 },
  { id: 'lyso-phase2-0', source: 'bitbio', character: 'lyso', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 28, height: 28 }, scale: 3, palette: ['#8b44cc', '#6622aa', '#4400aa', '#cc22ff', '#ff55ff', '#220033', '#ff0000'], paletteSize: 7, tags: ['boss', 'lyso', 'phase2', 'enemy', 'realm1', 'enraged'], realm: 1, styleFamily: 'bitbio', qualityScore: 86 },
  { id: 'lyso-phase3-0', source: 'bitbio', character: 'lyso', animation: 'idle', frameIndex: 0, totalFrames: 6, dimensions: { width: 32, height: 32 }, scale: 3, palette: ['#8b44cc', '#6622aa', '#4400aa', '#cc22ff', '#ff55ff', '#220033', '#ff0000', '#ff8800'], paletteSize: 8, tags: ['boss', 'lyso', 'phase3', 'enemy', 'realm1', 'final', 'massive'], realm: 1, styleFamily: 'bitbio', qualityScore: 88 },
  { id: 'viron-phase1-0', source: 'bitbio', character: 'viron', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 24, height: 24 }, scale: 3, palette: ['#22aa44', '#116633', '#003300', '#44ff66', '#00ff00', '#88ff88'], paletteSize: 6, tags: ['boss', 'viron', 'phase1', 'enemy', 'realm2', 'virus'], realm: 2, styleFamily: 'bitbio', qualityScore: 85 },
  { id: 'viron-phase2-0', source: 'bitbio', character: 'viron', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 28, height: 28 }, scale: 3, palette: ['#22aa44', '#116633', '#003300', '#44ff66', '#00ff00', '#88ff88', '#ff4400'], paletteSize: 7, tags: ['boss', 'viron', 'phase2', 'enemy', 'realm2', 'virus', 'mutating'], realm: 2, styleFamily: 'bitbio', qualityScore: 87 },
  { id: 'viron-phase3-0', source: 'bitbio', character: 'viron', animation: 'idle', frameIndex: 0, totalFrames: 6, dimensions: { width: 32, height: 32 }, scale: 3, palette: ['#22aa44', '#116633', '#003300', '#44ff66', '#00ff00', '#88ff88', '#ff4400', '#ff0000'], paletteSize: 8, tags: ['boss', 'viron', 'phase3', 'enemy', 'realm2', 'virus', 'pandemic'], realm: 2, styleFamily: 'bitbio', qualityScore: 89 },
  { id: 'overfit-phase1-0', source: 'bitbio', character: 'overfit', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 24, height: 24 }, scale: 3, palette: ['#3b82f6', '#1d4ed8', '#1e40af', '#60a5fa', '#93c5fd', '#bfdbfe'], paletteSize: 6, tags: ['boss', 'overfit', 'phase1', 'enemy', 'realm3', 'data'], realm: 3, styleFamily: 'bitbio', qualityScore: 83 },
  { id: 'overfit-phase2-0', source: 'bitbio', character: 'overfit', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 28, height: 28 }, scale: 3, palette: ['#3b82f6', '#1d4ed8', '#1e40af', '#60a5fa', '#93c5fd', '#bfdbfe', '#ef4444'], paletteSize: 7, tags: ['boss', 'overfit', 'phase2', 'enemy', 'realm3', 'data', 'glitch'], realm: 3, styleFamily: 'bitbio', qualityScore: 85 },
  { id: 'overfit-phase3-0', source: 'bitbio', character: 'overfit', animation: 'idle', frameIndex: 0, totalFrames: 6, dimensions: { width: 32, height: 32 }, scale: 3, palette: ['#3b82f6', '#1d4ed8', '#1e40af', '#60a5fa', '#93c5fd', '#bfdbfe', '#ef4444', '#7c3aed'], paletteSize: 8, tags: ['boss', 'overfit', 'phase3', 'enemy', 'realm3', 'data', 'corruption'], realm: 3, styleFamily: 'bitbio', qualityScore: 87 },
  { id: 'amyloid-phase1-0', source: 'bitbio', character: 'amyloid', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 24, height: 32 }, scale: 3, palette: ['#c0a0ff', '#9370db', '#7b2fd5', '#d4b3ff', '#e8d5ff', '#3d0066'], paletteSize: 6, tags: ['boss', 'amyloid', 'phase1', 'enemy', 'realm4', 'fibril', 'protein'], realm: 4, styleFamily: 'bitbio', qualityScore: 86 },
  { id: 'amyloid-phase2-0', source: 'bitbio', character: 'amyloid', animation: 'idle', frameIndex: 0, totalFrames: 4, dimensions: { width: 28, height: 36 }, scale: 3, palette: ['#c0a0ff', '#9370db', '#7b2fd5', '#d4b3ff', '#e8d5ff', '#3d0066', '#ff6600'], paletteSize: 7, tags: ['boss', 'amyloid', 'phase2', 'enemy', 'realm4', 'fibril', 'growing'], realm: 4, styleFamily: 'bitbio', qualityScore: 88 },
  { id: 'amyloid-phase3-0', source: 'bitbio', character: 'amyloid', animation: 'idle', frameIndex: 0, totalFrames: 6, dimensions: { width: 32, height: 40 }, scale: 3, palette: ['#c0a0ff', '#9370db', '#7b2fd5', '#d4b3ff', '#e8d5ff', '#3d0066', '#ff6600', '#ff0000'], paletteSize: 8, tags: ['boss', 'amyloid', 'phase3', 'enemy', 'realm4', 'fibril', 'tyrant', 'massive'], realm: 4, styleFamily: 'bitbio', qualityScore: 90 },
];

export const BITBIO_TILESETS: TilesetMetadata[] = [
  { id: 'cytoplasm-tileset', source: 'bitbio', biome: 'cytoplasm', tileSize: 16, totalTiles: 64, palette: ['#020a08', '#03160e', '#041c12', '#0a2a18', '#1a5533', '#2d8855', '#00ffaa', '#00cc88'], animatedTiles: [4, 5, 12, 13, 20, 21, 28, 29], tags: ['realm1', 'cytoplasm', 'organic', 'bioluminescent', 'cave', 'cell'], styleFamily: 'bitbio' },
  { id: 'genome-forest-tileset', source: 'bitbio', biome: 'genome-forest', tileSize: 16, totalTiles: 80, palette: ['#0a1f0a', '#1a3a1a', '#2d5a2d', '#3d7a3d', '#52b788', '#74c69d', '#b7e4c7', '#40916c'], animatedTiles: [8, 9, 16, 17, 32, 33, 40, 41, 48, 49], tags: ['realm2', 'forest', 'dna', 'trees', 'river', 'waterfall', 'bridge'], styleFamily: 'bitbio' },
  { id: 'neural-nebula-tileset', source: 'bitbio', biome: 'neural-nebula', tileSize: 16, totalTiles: 72, palette: ['#020008', '#080020', '#140040', '#1e0060', '#2d1469', '#a855f7', '#c084fc', '#e9d5ff'], animatedTiles: [6, 7, 14, 15, 22, 23, 30, 31, 38, 39], tags: ['realm3', 'space', 'nebula', 'neural', 'stars', 'constellation', 'synapse'], styleFamily: 'bitbio' },
  { id: 'protein-cathedral-tileset', source: 'bitbio', biome: 'protein-cathedral', tileSize: 16, totalTiles: 96, palette: ['#0a0818', '#150e28', '#1e1438', '#2d1c50', '#3d2870', '#c0a0ff', '#d4b3ff', '#e8d5ff'], animatedTiles: [10, 11, 18, 19, 26, 27, 50, 51, 58, 59], tags: ['realm4', 'cathedral', 'gothic', 'stained-glass', 'altar', 'protein', 'sacred'], styleFamily: 'bitbio' },
];

// ─── Core Functions ───────────────────────────────────────────────────────────

export function buildDatasetIndex(
  sprites: SpriteMetadata[],
  tilesets: TilesetMetadata[],
): DatasetStats {
  const totalAnimationFrames = sprites.reduce((sum, s) => sum + s.totalFrames, 0);
  const paletteDistribution: Record<string, number> = {};
  const styleDistribution: Record<string, number> = {};
  const realmDistribution: Record<number, number> = {};
  const tagCounts: Record<string, number> = {};

  for (const s of sprites) {
    styleDistribution[s.styleFamily] = (styleDistribution[s.styleFamily] ?? 0) + 1;
    if (s.realm !== null) {
      realmDistribution[s.realm] = (realmDistribution[s.realm] ?? 0) + 1;
    }
    const bucket = `${s.paletteSize}-color`;
    paletteDistribution[bucket] = (paletteDistribution[bucket] ?? 0) + 1;
    for (const tag of s.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  return {
    totalSprites: sprites.length,
    totalTilesets: tilesets.length,
    totalAnimationFrames,
    paletteDistribution,
    styleDistribution,
    realmDistribution,
    tagCounts,
  };
}

export function filterByQuality(
  sprites: SpriteMetadata[],
  minScore: number,
): SpriteMetadata[] {
  return sprites.filter((s) => s.qualityScore >= minScore);
}

export function groupByAnimation(
  sprites: SpriteMetadata[],
): Record<string, SpriteMetadata[]> {
  const groups: Record<string, SpriteMetadata[]> = {};
  for (const s of sprites) {
    const key = `${s.character}:${s.animation}`;
    groups[key] = groups[key] ?? [];
    groups[key].push(s);
  }
  return groups;
}

export function exportForTraining(
  sprites: SpriteMetadata[],
  format: 'json' | 'csv',
): string {
  if (format === 'json') {
    return JSON.stringify(sprites, null, 2);
  }
  const header = 'id,source,character,animation,frameIndex,totalFrames,width,height,scale,paletteSize,qualityScore,styleFamily,realm,tags';
  const rows = sprites.map((s) =>
    [
      s.id,
      s.source,
      s.character,
      s.animation,
      s.frameIndex,
      s.totalFrames,
      s.dimensions.width,
      s.dimensions.height,
      s.scale,
      s.paletteSize,
      s.qualityScore,
      s.styleFamily,
      s.realm ?? '',
      `"${s.tags.join('|')}"`,
    ].join(','),
  );
  return [header, ...rows].join('\n');
}

export function validateDataset(
  sprites: SpriteMetadata[],
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const s of sprites) {
    if (ids.has(s.id)) issues.push(`Duplicate ID: ${s.id}`);
    ids.add(s.id);
    if (s.qualityScore < 0 || s.qualityScore > 100) issues.push(`Invalid qualityScore ${s.qualityScore} for ${s.id}`);
    if (s.paletteSize < 2 || s.paletteSize > 16) issues.push(`Unusual paletteSize ${s.paletteSize} for ${s.id} — pixel art should use 2-16 colors`);
    if (s.dimensions.width <= 0 || s.dimensions.height <= 0) issues.push(`Invalid dimensions for ${s.id}`);
    if (s.totalFrames < 1) issues.push(`totalFrames must be >= 1 for ${s.id}`);
    if (s.frameIndex >= s.totalFrames) issues.push(`frameIndex ${s.frameIndex} out of range for ${s.id}`);
    if (s.tags.length === 0) issues.push(`No tags for ${s.id} — add at least character and animation type`);
  }

  return { valid: issues.length === 0, issues };
}

export function printDatasetReport(sprites: SpriteMetadata[], tilesets: TilesetMetadata[]): void {
  const stats = buildDatasetIndex(sprites, tilesets);
  const validation = validateDataset(sprites);

  console.log('═══════════════════════════════════════');
  console.log('  BitBio Pixel Art Dataset Report');
  console.log('═══════════════════════════════════════');
  console.log(`  Total sprites:          ${stats.totalSprites}`);
  console.log(`  Total tilesets:         ${stats.totalTilesets}`);
  console.log(`  Total animation frames: ${stats.totalAnimationFrames}`);
  console.log(`  Dataset valid:          ${validation.valid ? 'YES ✓' : 'NO ✗'}`);
  if (!validation.valid) {
    console.log('  Issues:');
    for (const issue of validation.issues) console.log(`    - ${issue}`);
  }
  console.log('\n  Style distribution:');
  for (const [style, count] of Object.entries(stats.styleDistribution)) {
    console.log(`    ${style.padEnd(16)} ${count} sprites`);
  }
  console.log('\n  Realm distribution:');
  for (const [realm, count] of Object.entries(stats.realmDistribution)) {
    console.log(`    Realm ${realm}:  ${count} sprites`);
  }
  console.log('\n  Top tags:');
  const sortedTags = Object.entries(stats.tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  for (const [tag, count] of sortedTags) {
    console.log(`    ${tag.padEnd(20)} ${count}`);
  }
  console.log('═══════════════════════════════════════\n');
}
