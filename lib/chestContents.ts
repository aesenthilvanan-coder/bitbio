// ─── Chest & Sign Contents ────────────────────────────────────────────────────
// Keys: 'realmId-tileX-tileY'

export const CHEST_CONTENTS: Record<string, string> = {
  // Realm 1 — Cytoplasm
  '1-4-4':   'golgi-stamp',         // inside Nucleus Lab room
  '1-29-5':  'ribosome-pearl',      // inside Ribosome Chamber
  '1-8-20':  'mitochondria-shard',  // near west mitochondria cluster

  // Realm 2 — Genome Forest
  '2-6-5':   'ancient-base-pair',   // north-west clearing
  '2-8-8':   'rna-strand',          // at wooden bridge entrance
  '2-12-20': 'chromosome-map',      // south forest floor

  // Realm 3 — Neural Nebula
  '3-13-2':  'gradient-chip',       // north-west platform
  '3-26-2':  'dropout-mask',        // north-east platform
  '3-17-10': 'attention-head',      // central hub

  // Realm 4 — Protein Cathedral
  '4-4-8':   'alpha-helix-pin',     // west nave
  '4-30-8':  'beta-sheet-card',     // east nave
  '4-16-15': 'folding-crystal',     // at Henry's altar
};

export const SIGN_CONTENTS: Record<string, string[]> = {
  // Realm 1 — Cytoplasm
  '1-2-1': [
    'Welcome to the Cytoplasm.',
    'Press [E] near glowing nodes to study.',
    'Watch out for the lysosome acid pools.',
    'The mitochondria is the powerhouse of the cell.',
    '— Posted by Elliot, Cell Biologist (Unofficial)',
  ],
  '1-10-2': [
    '⚠ BOSS GATE AHEAD',
    'Complete all 9 lesson nodes to challenge LYSO.',
    'LYSO the Rogue Lysosome has been consuming organelles for weeks.',
    'Good luck. You will need it.',
  ],

  // Realm 2 — Genome Forest
  '2-5-8': [
    'RNA RIVER CROSSING',
    'The RNA River flows with messenger RNA strands.',
    'Cross using the Wooden Bridge to the south.',
    'Do not fall in. mRNA degrades at room temperature.',
    '— Ben (he has sandwiches if you need one)',
  ],
  '2-18-12': [
    'SOUTH CLEARING — Safe Zone',
    'Ben set up camp here after his third genome mapping session.',
    'He says the trees here look like "DNA but bigger and less useful".',
    'He is correct.',
  ],

  // Realm 3 — Neural Nebula
  '3-15-15': [
    'TERMINAL STATION — ALEX\'s LAB',
    'Warning: fourth coffee consumed. Alex is at peak velocity.',
    'Press [E] to interact with Alex for neural network training tips.',
    'Do not mention the vanishing gradient. She knows.',
  ],
  '3-12-6': [
    'SYNAPSE BRIDGE',
    'These bridges simulate synaptic transmission.',
    'Each = tile carries an electrical impulse at ~70 m/s.',
    'Step carefully. The void below is very void-like.',
  ],

  // Realm 4 — Protein Cathedral
  '4-2-12': [
    'WELCOME TO THE PROTEIN CATHEDRAL',
    'All proteins fold here. Most fold correctly.',
    'AMYLOID TYRANT lives at the altar.',
    'It used to be Henry\'s research project.',
    'Things went sideways around beta-sheet 47.',
  ],
  '4-15-6': [
    'EVOFORMER TRANSEPT',
    'This bridge is constructed from beta sheet hydrogen bonds.',
    'It can withstand 480 pN of force per strand.',
    'Henry built it in an afternoon.',
    '(He is very good at protein engineering.)',
  ],
};
