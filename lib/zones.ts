import type { Realm } from './types';

export interface Zone {
  id: string;
  name: string;
  realm: Realm;
  description: string;
  unlockCondition: 'default' | string;
  connections: string[];
  icon: string;
  accentColor: string;
  ambientTheme: string;
}

export const ZONES: Zone[] = [
  // REALM 1 — CYTOPLASM
  { id: 'cytoplasm-main', name: 'The Living Cell', realm: 1, description: 'The main cytoplasm hub — where organelles float freely and life hums around you.', unlockCondition: 'default', connections: ['nucleus-chamber', 'er-golgi-pathway'], icon: '🧫', accentColor: '#00ffaa', ambientTheme: 'cytoplasm' },
  { id: 'nucleus-chamber', name: 'The Nucleus', realm: 1, description: 'The command center — chromatin strands coil through the nuclear pore gate.', unlockCondition: 'l1-m1-n2', connections: ['cytoplasm-main'], icon: '🔵', accentColor: '#4488ff', ambientTheme: 'nucleus' },
  { id: 'er-golgi-pathway', name: 'The Secretory Pathway', realm: 1, description: 'Wind through the ER membrane to the Golgi stacks where proteins are packaged.', unlockCondition: 'l1-m2-n1', connections: ['cytoplasm-main'], icon: '🟢', accentColor: '#22aa66', ambientTheme: 'golgi' },

  // REALM 2 — GENOME FOREST
  { id: 'forest-entrance', name: 'DNA Forest Entrance', realm: 2, description: 'Cherry blossoms fall among the first DNA helix trees. A stone path leads inward.', unlockCondition: 'default', connections: ['helix-grove', 'stream-crossing'], icon: '🌸', accentColor: '#52b788', ambientTheme: 'forest-entry' },
  { id: 'helix-grove', name: 'The Helix Grove', realm: 2, description: 'Dense cathedral of giant DNA trees — base pairs glow between ancient strands.', unlockCondition: 'l2-m1-n1', connections: ['forest-entrance', 'stream-crossing', 'sequence-archive'], icon: '🧬', accentColor: '#44dd88', ambientTheme: 'helix-grove' },
  { id: 'stream-crossing', name: 'The Data Stream', realm: 2, description: 'A bioluminescent stream of genomic data flows beneath a wooden bridge.', unlockCondition: 'l2-m1-n2', connections: ['forest-entrance', 'helix-grove'], icon: '🌊', accentColor: '#00ccbb', ambientTheme: 'stream' },
  { id: 'sequence-archive', name: 'The Sequence Archive', realm: 2, description: 'Ancient stone terminals hold every sequenced genome. Ben guards the archives.', unlockCondition: 'l2-m2-n1', connections: ['helix-grove'], icon: '📚', accentColor: '#88ffcc', ambientTheme: 'archive' },

  // REALM 3 — NEURAL NEBULA
  { id: 'nebula-surface', name: 'The Nebula Surface', realm: 3, description: 'Amethyst crystals jut from the void floor. Constellations pulse overhead.', unlockCondition: 'default', connections: ['floating-platforms', 'nebula-caves'], icon: '🔮', accentColor: '#a855f7', ambientTheme: 'nebula-surface' },
  { id: 'floating-platforms', name: 'The Floating Platforms', realm: 3, description: 'Workstations drift between platforms suspended in the neural void. Alex trains models here.', unlockCondition: 'l3-m1-n1', connections: ['nebula-surface', 'neural-tree-base'], icon: '🖥️', accentColor: '#8844ff', ambientTheme: 'platforms' },
  { id: 'neural-tree-base', name: 'The Brain Tree', realm: 3, description: 'At the base of the great neural tree — signals cascade down glowing branches.', unlockCondition: 'l3-m2-n1', connections: ['floating-platforms'], icon: '🧠', accentColor: '#00ccff', ambientTheme: 'neural-tree' },
  { id: 'nebula-caves', name: 'Crystal Caves', realm: 3, description: 'Below the platforms, crystal caverns glow with bioluminescent formations.', unlockCondition: 'l3-m1-n2', connections: ['nebula-surface'], icon: '💎', accentColor: '#6600cc', ambientTheme: 'caves' },

  // REALM 4 — PROTEIN CATHEDRAL
  { id: 'cathedral-entrance', name: 'Cathedral Gates', realm: 4, description: 'You stand at the entrance, looking down the grand nave at the glowing protein altar.', unlockCondition: 'default', connections: ['main-nave', 'left-transept', 'right-transept'], icon: '⛪', accentColor: '#c0a0ff', ambientTheme: 'cathedral-entry' },
  { id: 'main-nave', name: 'The Grand Nave', realm: 4, description: 'Stone pillars flank the checkered floor. The floating protein altar glows at the far end.', unlockCondition: 'l4-m1-n1', connections: ['cathedral-entrance', 'left-transept', 'right-transept', 'altar-sanctum'], icon: '🏛️', accentColor: '#aa88ff', ambientTheme: 'nave' },
  { id: 'left-transept', name: 'AlphaFold Chapel', realm: 4, description: 'The left wing, where protein structures are predicted and validated.', unlockCondition: 'l4-m1-n2', connections: ['cathedral-entrance', 'main-nave'], icon: '🔵', accentColor: '#4488ff', ambientTheme: 'alphafold-chapel' },
  { id: 'right-transept', name: 'Drug Discovery Wing', realm: 4, description: 'Crystal formations and drug molecule models fill the right wing.', unlockCondition: 'l4-m2-n1', connections: ['cathedral-entrance', 'main-nave'], icon: '💊', accentColor: '#cc88ff', ambientTheme: 'drug-wing' },
  { id: 'altar-sanctum', name: 'The Protein Sanctum', realm: 4, description: "Henry's study. His holographic form waits here with the final truth.", unlockCondition: 'l4-m3-n2', connections: ['main-nave'], icon: '✨', accentColor: '#ffffff', ambientTheme: 'sanctum' },
];

export function getZone(id: string): Zone | undefined {
  return ZONES.find(z => z.id === id);
}

export function getRealmZones(realm: Realm): Zone[] {
  return ZONES.filter(z => z.realm === realm);
}

export function getDefaultZone(realm: Realm): Zone | undefined {
  return ZONES.find(z => z.realm === realm && z.unlockCondition === 'default');
}

export function isZoneUnlocked(zone: Zone, completedNodeIds: string[]): boolean {
  if (zone.unlockCondition === 'default') return true;
  return completedNodeIds.includes(zone.unlockCondition);
}
