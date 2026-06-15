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
// Organic cell interior. Deep blue / teal palette.
// Areas:
//   • Lysosome Pools  – ~ at cols 1-8, rows 5-10
//   • Microtubule Highway – = across rows 13-14
//   • Mitochondria A  – T at cols 15-18, rows 2-4
//   • Mitochondria B  – T at cols 8-12, rows 18-20
//   • Mitochondria C  – T at cols 28-32, rows 6-8
//   • Nucleus         – hollow # oval cols 22-30, rows 8-16
//   • Nodes 1-9, E (Elliot), @ (player start), B (boss gate)
const CYTOPLASM_RAW: string[] = [
  '########################################', // 0
  '#....................................B.#', // 1  B=boss gate at col 37
  '#..............TTTT....................#', // 2  Mito cluster A (cols 15-18)
  '#....1.........TTTT................2...#', // 3  node-1 col 5, node-2 col 35
  '#..............TTTT....................#', // 4  Mito cluster A
  '#~~~~~~~~..............................#', // 5  lysosome pools (cols 1-8)
  '#~~~~~~~~...................TTTTT......#', // 6  + Mito cluster C (cols 28-32)
  '#~~~~~~~~...................TTTTT......#', // 7
  '#~~~~~~~~...............####TTTTT......#', // 8  nucleus top cap (cols 24-27)
  '#~~~~~~~~.............##....###........#', // 9  nucleus upper sides
  '#~~~~~~~~.4..........#.......#.........#', // 10 node-4 col 10; nucleus sides
  '#.....................#.......#........#', // 11 nucleus sides
  '#.....................#..3....#........#', // 12 node-3 at col 25 (inside nucleus)
  '#==================E==#=======#========#', // 13 highway; E at col 19; nucleus walls
  '#=====================#=======#========#', // 14 highway row 2
  '#.....................#.......#........#', // 15 nucleus sides
  '#.......................####...........#', // 16 nucleus bottom cap
  '#.........6...................5........#', // 17 node-6 col 10, node-5 col 30
  '#.......TTTTT..........................#', // 18 Mito cluster B (cols 8-12)
  '#.......TTTTT..........................#', // 19
  '#.......TTTTT..........................#', // 20
  '#......................................#', // 21
  '#....8...................7.............#', // 22 node-8 col 5, node-7 col 25
  '#......................................#', // 23
  '#....@.................................#', // 24 player start col 5
  '#...................9..................#', // 25 node-9 col 20
  '#......................................#', // 26
  '########################################', // 27
];

// ─── Realm 2 · THE GENOME FOREST ─────────────────────────────────────────────
// DNA forest, dark-green palette.
// Areas:
//   • DNA Helix Grove – dense canopy upper-half (nodes 1-4)
//   • RNA River       – water channel through middle (void ~)
//   • Protein Factory – ruins bottom-half (nodes 5-9, Ben in clearing)
const GENOME_FOREST_RAW: string[] = [
  '########################################', // 0
  '#TTTTT.1.TTTTTTT.TTTTTTTT.2.TTTTTTTTT#', // 1  node-1, node-2 in grove
  '#TTTTT...TTTTTTT.TTTTTTTT...TTTTTTTTT#', // 2
  '#TTT.......TTTTT...TTTTTT..T.TTTTTTTT#', // 3
  '#TT.....3...TTTT....TTTT...T..TTTTTTT#', // 4  node-3
  '#T.....TTT..TTTT.T..TTTT.......TTTTTT#', // 5
  '#......TTT..TTTT.T...TTT.....4..TTTTT#', // 6  node-4
  '#......TT..........=======......TTTTT#', // 7  path opens up
  '#...T..T...........=======.....TTTTTT#', // 8
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 9  RNA River (full water row)
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 10
  '#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#', // 11
  '#.....B.....T...T..T..T..T...........#', // 12 Ben in clearing after river
  '#...T.....T.....T.....T..T..T.......T#', // 13
  '#......5..............T.....T........#', // 14 node-5
  '#..T..........T.....T.....T..........#', // 15
  '#....T.....6.....T..T.......T........#', // 16 node-6
  '#.....T.....T.........T.....T.....T..#', // 17
  '#.T.........T......7....T....T.......#', // 18 node-7
  '#...T.......T..T.....T.......T.....T.#', // 19
  '#......T........T......8.............#', // 20 node-8
  '#.T..T.....T..T.....T........T..T....#', // 21
  '#.....T.T..T........T.......T........#', // 22
  '#...T.............T.....9............#', // 23 node-9
  '#.T.....T......T.....T...T...T.....T.#', // 24
  '#....T.....T.........@...............#', // 25 player start
  '#.T........T.......T..........T......#', // 26
  '########################################', // 27
];

// ─── Realm 3 · THE NEURAL NEBULA ─────────────────────────────────────────────
// Space / neon. Dark purple / cyan palette.
// Areas:
//   • Neuron City      – left cluster of platforms on void
//   • Synapse Bridge   – path (=) crossing the void centre
//   • Training Ground  – solid lower-right (Alex + nodes 6-9)
const NEURAL_NEBULA_RAW: string[] = [
  '########################################', // 0
  '#~~~~~...1.....~~~~~..2....~~~~~.......#', // 1  node-1, node-2
  '#~~~~~~~.......~~~~~~~~......~~~~~~~~~~#', // 2
  '#~~~~~~~.......~~~~~~~~......~~~~~~~~~~#', // 3
  '#~~~~.....T....~~~~~~~~.3....~~~~~~~~~~#', // 4  node-3
  '#~~~~..........~~~~~~~~......~~~~~~~~~~#', // 5
  '#~~~~..........~~~~====~~~~~~..........#', // 6  bridge starts
  '#~~~.......T...====..====~~~~..........#', // 7
  '#~~~...4...====.......====~~~..........#', // 8  node-4 + bridge
  '#~~~...====.............====~~~........#', // 9
  '#~..====.................====~~........#', // 10
  '#..====..........5........====~........#', // 11 node-5 on bridge
  '#==...........T.............===~~~~~~~~#', // 12
  '#==...............................=====~#', // 13 bridge to right
  '#==...............................=====.#', // 14
  '#.......T..........A..........T........#', // 15 Alex
  '#..T.......6...................T........#', // 16 node-6
  '#.......T......T.......T...............#', // 17
  '#..T........7.............T............#', // 18 node-7
  '#.....T.....T......T...................#', // 19
  '#.T..........T...........8.............#', // 20 node-8
  '#..T.....T.......T..........T.........#', // 21
  '#.......T.............T.....T..........#', // 22
  '#...T.........9.......T................#', // 23 node-9
  '#.T...T.....T.......T...........T......#', // 24
  '#....T......T.................@.......#', // 25 player start
  '#......T.....T.......T................#', // 26
  '########################################', // 27
];

// ─── Realm 4 · THE PROTEIN CATHEDRAL ─────────────────────────────────────────
// Gothic stone, cyan / gray palette.
// Areas:
//   • Alpha Helix Hall    – left nave with pillar columns
//   • Beta Sheet Bridge   – central crossing (= paths)
//   • Evoformer Courtyard – centre open area (Henry here)
//   • Capstone Sanctum    – upper inner chamber (node-9, boss area)
const PROTEIN_CATHEDRAL_RAW: string[] = [
  '########################################', // 0
  '#T.T.T...1.T.T.T.#.T.T.T.2.T.T.T.T.T#', // 1  node-1, node-2 in nave pillars
  '#..........T.T.T.#.T.T.T...T.T.T.T..#', // 2
  '#T.T.T.....T.T.T.#.T.T.T...T.T.T.T.T#', // 3
  '#..........T.3.T.#.T.T.4.....T.T.T..#', // 4  node-3, node-4
  '#T.T.T.....T.T.T.#.T.T.T...T.T.T.T.T#', // 5
  '#==========.....=#.=====...==========#', // 6  Beta Sheet Bridge (path tiles)
  '#==========.....=#.=====...==========#', // 7
  '#..........T.T.T.#.T.T.T...T.T.T.T..#', // 8
  '#T.T.T.....T.T.T.#.T.T.T.5.T.T.T.T.T#', // 9  node-5
  '#..........T.T.T.#.T.6.T...T.T.T.T..#', // 10 node-6
  '#T.T.T.....T.T.T.#.T.T.T...T.T.T.T.T#', // 11
  '#~~~~~.............7.................##', // 12 node-7 on bridge
  '#~~~~~...........H...................##', // 13 Henry (Evoformer Courtyard)
  '#~~~~~...........*...................##', // 14
  '#~~~~~..............*................##', // 15
  '#~~~~~........8...............*......##', // 16 node-8
  '##~~~~...............................##', // 17
  '##~~~~...*.....*.....*.....*...*....##', // 18
  '##~~~~................................##', // 19
  '##.......T.T.T....................T.T##', // 20
  '##.......T.T.T.......9............T.##', // 21 node-9 (Capstone Sanctum)
  '##.......T.T.T.......................##', // 22
  '##.......T.T.T.......................##', // 23
  '###......T.T.T....*......T.T.T.....###', // 24
  '###......T.@.T...................T.####', // 25 player start
  '###......T.T.T.......................###', // 26
  '########################################', // 27
];

// ─── Export ───────────────────────────────────────────────────────────────────
export const WORLD_MAPS: WorldMap[] = [
  {
    id: 1,
    name: 'The Cytoplasm',
    map: norm(CYTOPLASM_RAW),
    palette: {
      floor: '#050d10',
      wall: '#0a1a22',
      path: '#060d18',
      water: '#150020',
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
      floor: '#050f04',
      wall: '#0a1a05',
      path: '#1c1008',
      water: '#0a182a',
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
      floor: '#080510',
      wall: '#100820',
      path: '#030008',
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
      floor: '#0a080f',
      wall: '#18121f',
      path: '#0c0a1c',
      water: '#08060f',
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
