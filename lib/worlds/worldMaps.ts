// ─── World Maps ──────────────────────────────────────────────────────────────
// Each map is 40 wide × 28 tall.
// Tile legend:
//   .  walkable floor
//   #  solid wall
//   T  tree / pillar (solid, decorated)
//   ~  water / void (solid)
//   =  path tile (walkable, styled differently)
//   *  special decorative floor (walkable)
//   1–9  lesson nodes (walkable, interactive)
//   E  Elliot NPC   B  Ben NPC   A  Alex NPC   H  Henry NPC
//   @  player start position

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

// ─── Utility: normalise rows to exactly 40 chars ─────────────────────────────
function norm(rows: string[]): string[] {
  return rows.map((r) => {
    if (r.length < 40) return r.padEnd(40, '#');
    if (r.length > 40) return r.slice(0, 40);
    return r;
  });
}

// ─── Realm 1 · THE CYTOPLASM ─────────────────────────────────────────────────
// OMORI-style birds-eye cell interior.
// Two enclosed organelle rooms at top (Elliot's Nucleus Lab + Ribosome Chamber).
// Connected by open cytoplasm floor. Lysosome acid pools mid-map.
// Microtubule highway cuts through center. Mitochondria clusters at bottom.
const CYTOPLASM_RAW: string[] = [
  '########################################', // 0  outer border
  '#......................................#', // 1  open entry hall
  '#.######.......######...............B..#', // 2  rooms A+B top walls; B=boss gate
  '#.#1...#.......#2...#..........TTTTT...#', // 3  node1 in A, node2 in B, mito cluster
  '#.#.E..#.......#....#..........TTTTT...#', // 4  Elliot in room A
  '#.#3...#.......#4...#..........TTTTT...#', // 5  node3 in A, node4 in B
  '#.#....#.......#....#..................#', // 6  rooms interior
  '#.######.......######..................#', // 7  rooms A+B bottom walls
  '#......................................#', // 8  open cytoplasm
  '#...~~~~~~~~~~~~.......~~~~~~~~~~~~....#', // 9  lysosome acid pools (both sides)
  '#...~~~~~~~~~~~~.......~~~~~~~~~~~~....#', // 10
  '#...~~~~~~~~~~~~...5...~~~~~~~~~~~~....#', // 11 node5 between pools
  '#......................................#', // 12
  '#================6=====================#', // 13 microtubule highway, node6
  '#======================================#', // 14 highway row 2
  '#......................................#', // 15
  '#......7...............................#', // 16 node7
  '#......................................#', // 17
  '#..TTTTT......................TTTTT.....#', // 18 mitochondria clusters
  '#..TTTTT......................TTTTT.....#', // 19
  '#..TTTTT.......8..............TTTTT....#', // 20 node8
  '#......................................#', // 21
  '#......................................#', // 22
  '#...............9......................#', // 23 node9
  '#..............@.......................#', // 24 player start
  '#......................................#', // 25
  '#......................................#', // 26
  '########################################', // 27
];

// ─── Realm 2 · THE GENOME FOREST ─────────────────────────────────────────────
// OMORI-style birds-eye forest. Dense tree rooms separated by clearings.
// Three forest clearings connected by paths. RNA River cuts across mid-map.
// Ben NPC in central clearing after crossing the river.
const GENOME_FOREST_RAW: string[] = [
  '########################################', // 0
  '#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#', // 1  dense canopy top
  '#TTTTTT.1.TTTTTTTTT.2.TTTTTTTTTTTTTTT#', // 2  node1, node2 in canopy gaps
  '#TTTTT.....TTTTTTT.....TTTTTTTTTTTTTTT#', // 3  clearings open up
  '#TTT.....3...TTTT.....4....TTTTTTTTTT#', // 4  node3, node4
  '#TT..........TTT............TTTTTTTTT#', // 5  clearings widen
  '#T...........TT..============.TTTTTT#', // 6  path = bridge begins
  '#............T...============..TTTTT#', // 7  path continues
  '#............====............==.TT..#', // 8  path branches
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 9  RNA River
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 10
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 11
  '#.......B...............................#', // 12 Ben in first south clearing
  '#..T.....T.....T.....T.....T.....T.....#', // 13 scattered trees
  '#....5..........T.......T..............#', // 14 node5
  '#.T.....T.......T.......T.....T........#', // 15
  '#.......T....6......T.....T............#', // 16 node6
  '#...T.......T.........T.....T.....T....#', // 17
  '#.T.....7.......T.......T..............#', // 18 node7
  '#....T.......T.......T.....T.....T.....#', // 19
  '#.T.....T.......T.......T....8.........#', // 20 node8
  '#...T.......T.......T.....T............#', // 21
  '#.T.....T.......T.......T.....T........#', // 22
  '#...T.......T....9......T.....T........#', // 23 node9
  '#.T.....T.......T.......T.....T........#', // 24
  '#...T.......T.....@.....T.....T........#', // 25 player start
  '#.T.....T.......T.......T.....T.....T..#', // 26
  '########################################', // 27
];

// ─── Realm 3 · THE NEURAL NEBULA ─────────────────────────────────────────────
// OMORI-style birds-eye space station. Platform islands in void sea.
// Three isolated platforms connected by synapse bridges (=).
// Alex NPC in main terminal station at bottom. Void (~) surrounds platforms.
const NEURAL_NEBULA_RAW: string[] = [
  '########################################', // 0
  '#~~~~~~~~~~.1.~~~~~~~~~.2.~~~~~~~~~~~~#', // 1  node1, node2 on platforms
  '#~~~~~~~~~.....~~~~~~~~~...~~~~~~~~~~~#', // 2  platform interiors
  '#~~~~~~~~~..T..~~~~~~~~~.T.~~~~~~~~~~~#', // 3  terminal nodes
  '#~~~~~~~~~~...~~~~~~~~~~...~~~~~~~~~~~#', // 4
  '#~~~~~~~~~~~~~~====~~~~====~~~~~~~~~~~#', // 5  synapse bridges connect
  '#~~~~~~~~~~~~~=....=~~=....=~~~~~~~~~~#', // 6  bridges expand
  '#~~~~~~~~~.3.=......=.=.4...=~~~~~~~~~#', // 7  node3, node4 on bridges
  '#~~~~~~~~~...=......=.=.....=~~~~~~~~~#', // 8
  '#~~~~~~~~~...========.=====.~~~~~~~~~~#', // 9  bridges merge
  '#~~~~~~~~~.............5....~~~~~~~~~~~#', // 10 node5 on central platform
  '#~~~~~~~~~...........T.....~~~~~~~~~~~~#', // 11
  '#~~~~~~~~~=====.....=======~~~~~~~~~~~#', // 12 south bridge
  '#~~~~~~~~~~~~~~~~~================~~~~#', // 13 bridge leads south
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 14 void narrows
  '#..................................A..#', // 15 terminal floor; Alex
  '#...6.................................#', // 16 node6
  '#..T......T.......T.......T...........#', // 17
  '#.....7.......T.......T...............#', // 18 node7
  '#..T.....T.......T.......T............#', // 19
  '#.........T.......T.......T......8....#', // 20 node8
  '#..T.....T.......T.......T............#', // 21
  '#.....T.......T.......T...............#', // 22
  '#..T.....T...9...T.......T............#', // 23 node9
  '#.....T.......T.......T...............#', // 24
  '#..T.....T.......T....@..T............#', // 25 player start
  '#.....T.......T.......T...............#', // 26
  '########################################', // 27
];

// ─── Realm 4 · THE PROTEIN CATHEDRAL ─────────────────────────────────────────
// OMORI-style birds-eye gothic cathedral. Two long nave halls with pillar rows.
// Beta Sheet transept bridges cross the center. Henry at the grand altar.
// Capstone Sanctum (inner chamber) at top center behind iron gate.
const PROTEIN_CATHEDRAL_RAW: string[] = [
  '########################################', // 0
  '#T.T.T.T.T.T.T####T.T.T.T.T.T.T.T.T.#', // 1  nave pillars, inner sanctum walls
  '#.1.......T.T.####.T.T.2.......T.T....#', // 2  node1, node2 in nave
  '#T.T.T.T..T.T.####.T.T...T.T.T.T.T.T#', // 3
  '#..3......T.T.####.T.T.4......T.T.....#', // 4  node3, node4
  '#T.T.T.T..T.T.####.T.T...T.T.T.T.T.T#', // 5
  '#=========....####.....=============#', // 6  beta sheet transept bridge
  '#=========....####.....=============#', // 7
  '#..........T.T.####.T.T............#', // 8  pillars inside transept
  '#T.T.T.T...T.T.####.T.T.5.T.T.T.T.T#', // 9  node5
  '#.......6..T.T.####.T.T....T.T.....#', // 10 node6
  '#T.T.T.T...T.T.####.T.T....T.T.T.T.#', // 11
  '#======================================#', // 12 grand aisle
  '#======================================#', // 13
  '#..T.T..........H..........T.T.........#', // 14 Henry at altar
  '#.T.T.T....*....*.....*....T.T.T.......#', // 15 special altar floor
  '#..T.T.....*............*..T.T.........#', // 16
  '#.T.T.T..7..............T.T.T.T.........#', // 17 node7
  '#..T.T...................T.T............#', // 18
  '#.T.T.T.8................T.T.T.........#', // 19 node8
  '#..T.T...................T.T............#', // 20
  '#.T.T.T..................T.T.T.........#', // 21
  '#..T.T...................T.T............#', // 22
  '#.T.T.T....9.............T.T.T.........#', // 23 node9
  '#..T.T...................T.T............#', // 24
  '#.T.T.T...........@......T.T.T.........#', // 25 player start
  '#..T.T...................T.T............#', // 26
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
        'Explore the forest! Nodes are scattered around. Watch out for the RNA River.',
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
