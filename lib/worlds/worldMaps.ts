// ─── World Maps ──────────────────────────────────────────────────────────────
// Each map is EXACTLY 40 wide × 28 tall.
// Tile legend:
//   .  walkable floor
//   #  solid wall
//   T  tree / pillar / organelle (solid, decorated)
//   ~  water / void / acid (solid, impassable)
//   =  path tile (walkable, styled)
//   *  special decorative floor (walkable, altar/crystal)
//   1–9  lesson nodes (walkable, interactive)
//   E  Elliot NPC   B  Ben NPC   A  Alex NPC   H  Henry NPC
//   @  player start position
//   C  treasure chest (walkable, E to open)
//   S  sign / placard (walkable, E to read)

export interface WorldMap {
  id: 1 | 2 | 3 | 4;
  name: string;
  /** Array of exactly 40-character strings, 28 rows */
  map: string[];
  palette: {
    floor: string;
    wall: string;
    path: string;
    water: string;
    accent: string;
    sky: string;
  };
  npcGreeting: {
    npc: 'elliot' | 'ben' | 'alex' | 'henry';
    lines: string[];
  };
}

// ─── Utility: normalise rows to exactly 40 chars ──────────────────────────────
function norm(rows: string[]): string[] {
  return rows.map((r) => {
    if (r.length < 40) return r.padEnd(40, '#');
    if (r.length > 40) return r.slice(0, 40);
    return r;
  });
}

// ─── Realm 1 · THE CYTOPLASM ──────────────────────────────────────────────────
// Birds-eye cell interior. Fully explorable.
// Nucleus Lab (top-left), Ribosome Chamber (top-right), Lysosome Acid Pools,
// Microtubule Highway, Mitochondria Gardens (bottom), Boss Gate (top-center).
const CYTOPLASM_RAW: string[] = [
  '########################################', // 0  outer membrane
  '#.S....................................#', // 1  entry vestibule; S=sign
  '#.#######..S.B....#######..............#', // 2  organelle room walls; B=boss gate; S=sign near boss gate
  '#.#.....#.........#.....#..............#', // 3  room interiors open
  '#.#.1.E.#.C.......#.2...#..TTTTTTTTT..#', // 4  node1+Elliot in Nucleus Lab; C=chest
  '#.#.....#.........#.3.C.#..TTTTTTTTT..#', // 5  node3+chest in Ribosome Chamber
  '#.#.....#.........#.....#..TTTTTTTTT..#', // 6
  '#.#######.........#######..TTTTTTTTT..#', // 7  room walls close
  '#..........4...........................#', // 8  central cytoplasm; node4
  '#...~~~~~~~~~~...........~~~~~~~~~~....#', // 9  left lysosome acid pool
  '#...~~~~~~~~~~...........~~~~~~~~~~....#', // 10
  '#...~~~~~~~~~~....5......~~~~~~~~~~....#', // 11 node5 between pools
  '#...~~~~~~~~~~...........~~~~~~~~~~....#', // 12
  '#==============================6=======', // 13 microtubule highway; node6
  '#======================================', // 14 highway row 2
  '#......................................#', // 15
  '#.....7................................#', // 16 node7 west side
  '#......................................#', // 17
  '#..TTTTT.......................TTTTT...#', // 18 mitochondria west cluster
  '#..TTTTT.......................TTTTT...#', // 19
  '#..TTTTT...C....8..............TTTTT..#', // 20 node8; C=chest near mitochondria
  '#..TTTTT.......................TTTTT...#', // 21
  '#.......................9...............', // 22 node9 east side
  '#..............@.......................#', // 23 player start
  '#......................................#', // 24
  '#..TTTTTTTTT.................TTTTTTT..#', // 25 bottom organelle clusters
  '#......................................#', // 26
  '########################################', // 27
];

// ─── Realm 2 · THE GENOME FOREST ─────────────────────────────────────────────
// Dense helix forest. Three clearings north of the RNA River.
// Cross the Wooden Bridge south to reach Ben and deeper forest.
// Every column of trees explorable between clearings.
const GENOME_FOREST_RAW: string[] = [
  '########################################', // 0
  '#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT.#', // 1  dense canopy
  '#TTTTT.1.TTTTTTTT.2.TTTTTTTTTTTTTTTT.#', // 2  node1, node2 poke through canopy
  '#TTTT.....TTTTTTT.....TTTTTTTTTTTTTTT#', // 3  clearing gaps widen
  '#TTT...........TT..........TTTTTTTTTTT', // 4  big clearing opens
  '#TT...3.C.......T....4.....TTTTTTTTTT#', // 5  node3, node4 in clearings; C=chest
  '#T............................................', // 6  clearings merge — NOTE: truncated to 40
  '#T...........====.......====..TTTTTT.#', // 7  wooden bridge planks
  '#....S.......====.......====.........#', // 8  bridge continues; S=sign at RNA river
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~.#', // 9  RNA River west
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 10 RNA River center
  '#.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 11 RNA River east
  '#...S...B..............................#', // 12 Ben in south clearing; S=south clearing sign
  '#..T.....T.....T.....T.....T.....T...#', // 13 scattered south trees
  '#....5.......T.......T...............#', // 14 node5
  '#.T.....T.....T.......T.....T........#', // 15
  '#.......T....6.......T.....T.........#', // 16 node6
  '#...T.......T.......T.....T.....T....#', // 17
  '#.T.....7.......T.......T............#', // 18 node7
  '#....T.....T.......T.....T.....T.....#', // 19
  '#.T.....T.....T.......T....8.C.......#', // 20 node8; C=chest
  '#...T.......T.......T.....T..........#', // 21
  '#.T.....T.......T.......T.....T......#', // 22
  '#...T.......T....9......T.....T......#', // 23 node9
  '#.T.....T.......T.......T.....T......#', // 24
  '#...T.......T....@......T.....T......#', // 25 player start
  '#.T.....T.......T.......T.....T......#', // 26
  '########################################', // 27
];

// ─── Realm 3 · THE NEURAL NEBULA ─────────────────────────────────────────────
// Space-station platforms floating in void. Synapse bridges connect them.
// Top-north: two small research platforms. Central hub platform.
// South terminal floor where Alex works. All void between platforms impassable.
const NEURAL_NEBULA_RAW: string[] = [
  '########################################', // 0
  '#~~~~~~~~~~~.1.~~~~~~~~.2.~~~~~~~~~~~~#', // 1  node1, node2 on north platforms
  '#~~~~~~~~~~..C..~~~~~~~..C..~~~~~~~~~~#', // 2  platform interiors walkable; C=chests on north platforms
  '#~~~~~~~~~~..T..~~~~~~~..T..~~~~~~~~~~#', // 3  terminal pillars
  '#~~~~~~~~~~.....~~~~~~~.....~~~~~~~~~~#', // 4
  '#~~~~~~~~~~~===~~~~~~~~===~~~~~~~~~~~~#', // 5  synapse bridge stubs
  '#~~~~~~~~~~~=..~~~~~~~~=..~~~~~~~~~~~~#', // 6  bridge expands
  '#~~~~~~~~~.3.=..........=.4..~~~~~~~~~#', // 7  node3, node4 on mid-platforms
  '#~~~~~~~~~.....========.....~~~~~~~~~~#', // 8  platforms connected
  '#~~~~~~~~~...=..........=...~~~~~~~~~~#', // 9  bridge arches
  '#~~~~~~~~~..C.5..............~~~~~~~~~#', // 10 node5 on central hub; C=chest
  '#~~~~~~~~~...T...........T...~~~~~~~~~#', // 11 hub pillars
  '#~~~~~~~~~...=.............=.~~~~~~~~~#', // 12 south bridges
  '#~~~~~~~~~====......S......====~~~~~~~#', // 13 bridge widens; S=sign on bridge
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 14 void narrows to terminal
  '#.S................................A..#', // 15 terminal floor; S=sign, Alex NPC
  '#...6..................................#', // 16 node6
  '#..T........T.........T...............#', // 17
  '#......7.......T.......T..............#', // 18 node7
  '#..T.......T.......T.......T..........#', // 19
  '#...........T.......T.......T....8....#', // 20 node8
  '#..T.......T.......T.......T..........#', // 21
  '#.......T.......T.......T.............#', // 22
  '#..T.......T...9...T.......T..........#', // 23 node9
  '#.......T.......T.......T.............#', // 24
  '#..T.......T.......T...@..T...........#', // 25 player start
  '#.......T.......T.......T.............#', // 26
  '########################################', // 27
];

// ─── Realm 4 · THE PROTEIN CATHEDRAL ─────────────────────────────────────────
// Gothic cathedral. Two nave wings flanking a sealed inner sanctum.
// Grand Evoformer Aisle connects to Henry's Altar in the center.
// Beta Sheet Transepts cross perpendicular. Holographic Henry guards the altar.
const PROTEIN_CATHEDRAL_RAW: string[] = [
  '########################################', // 0
  '#T.T.T.T.T.##########.T.T.T.T.T.T.T.#', // 1  nave pillars; sanctum walls
  '#.1.....T.T.##########.T.T.2.....T...#', // 2  node1, node2 in nave
  '#T.T.T..T.T.##########.T.T..T.T.T.T.#', // 3
  '#.3.....T.T.##########.T.T.4.....T...#', // 4  node3, node4
  '#T.T.T..T.T.##########.T.T..T.T.T.T.#', // 5
  '#==========.##########.==============#', // 6  beta transept bridge
  '#==========.##########.==============#', // 7
  '#.CT.T.T.T..##########..T.T.T.T.T.T.#', // 8  C=chest at (2,8)
  '#.T.T.T..T..##########..T.5.T.T.T.T.#', // 9  node5
  '#.S...6..T..##########..T...T.T.T...#', // 10 S=sign, node6
  '#.T.T.T..T..##########..T.T.T.T.T.T.#', // 11
  '#=====================================#', // 12 grand cathedral aisle
  '#=====================================#', // 13
  '#..T.T.......H.......T.T.............#', // 14 Henry at grand altar
  '#.T.T.T...*.......*...T.T.T..........#', // 15 altar special floor
  '#..T.T.......*.*......T.T............#', // 16
  '#.T.T.T..7.............T.T.T.........#', // 17 node7
  '#..T.T.................T.T...........#', // 18
  '#.T.T.T..8.............T.T.T.........#', // 19 node8
  '#..T.T..C....S.........T.T...........#', // 20 C=chest at (8,20), S=sign at (13,20)
  '#.T.T.T................T.T.T.........#', // 21
  '#..T.T.................T.T...........#', // 22
  '#.T.T.T....9...........T.T.T.........#', // 23 node9
  '#..T.T.................T.T...........#', // 24
  '#.T.T.T.........@.......T.T.T........#', // 25 player start
  '#..T.T.................T.T...........#', // 26
  '########################################', // 27
];

// ─── Export ───────────────────────────────────────────────────────────────────
export const WORLD_MAPS: WorldMap[] = [
  {
    id: 1,
    name: 'The Cytoplasm',
    map: norm(CYTOPLASM_RAW),
    palette: {
      floor: '#1a3a44',
      wall: '#0f2530',
      path: '#0d2040',
      water: '#1a0035',
      accent: '#00ffcc',
      sky: '#020609',
    },
    npcGreeting: {
      npc: 'elliot',
      lines: [
        "Oh! A new organelle! ...Wait, you're a person.",
        'Welcome to the Cytoplasm! Try not to get phagocytosed.',
        "The mitochondria is the powerhouse of the cell. I'll say it until I die.",
        'Press E near nodes to study. And PLEASE stop stepping on my ribosomes.',
      ],
    },
  },
  {
    id: 2,
    name: 'The Genome Forest',
    map: norm(GENOME_FOREST_RAW),
    palette: {
      floor: '#162a0a',
      wall: '#0d1e05',
      path: '#1c1008',
      water: '#051a2a',
      accent: '#00ff44',
      sky: '#020602',
    },
    npcGreeting: {
      npc: 'ben',
      lines: [
        "Oh hey! I was just eating this sandwich and thinking about genomics.",
        "DNA double helix? More like a double HELIX of DELICIOUS information.",
        "I've mapped 3 genomes and eaten 7 sandwiches today. Productive morning.",
        'Explore the forest! Nodes scattered around. Watch out for the RNA River.',
      ],
    },
  },
  {
    id: 3,
    name: 'The Neural Nebula',
    map: norm(NEURAL_NEBULA_RAW),
    palette: {
      floor: '#14083a',
      wall: '#0e052a',
      path: '#0a0528',
      water: '#030008',
      accent: '#aa44ff',
      sky: '#030008',
    },
    npcGreeting: {
      npc: 'alex',
      lines: [
        '*sips coffee* Neural networks? Easy. Hold on, let me refill first.',
        "This is my fourth coffee. The nebula gives me ENERGY. Or that's the caffeine.",
        'Back-propagation is just coffee flowing in reverse. I think.',
        "Cross the Synapse Bridge! Don't fall into the void. ...I fell once.",
      ],
    },
  },
  {
    id: 4,
    name: 'The Protein Cathedral',
    map: norm(PROTEIN_CATHEDRAL_RAW),
    palette: {
      floor: '#1e1438',
      wall: '#160f30',
      path: '#0c0a1c',
      water: '#100820',
      accent: '#ffaa00',
      sky: '#040210',
    },
    npcGreeting: {
      npc: 'henry',
      lines: [
        '*flickers* Greetings, carbon-based lifeform. I am definitely not a hologram.',
        'Achoo! ...I have no nose. Fascinating. *flickers more intensely*',
        "AlphaFold predicted I'd say something profound here. It was wrong.",
        'The Evoformer Courtyard awaits! Also, please stop walking through me.',
      ],
    },
  },
];
