// ─── Weapon System ────────────────────────────────────────────────────────────
// Combat-use items distinct from lore collectibles in items.ts.
// Used during lessons and boss battles to gain mechanical advantages.

export type WeaponEffect =
  | 'reveal-answer'       // show correct answer
  | 'extra-time'          // +N seconds on timer
  | 'unlock-path'         // artifact, opens sealed tiles (infinite use)
  | 'block-damage'        // negate next incoming damage hit
  | 'eliminate-wrong'     // remove N wrong answer options
  | 'restore-hearts'      // restore player to full HP
  | 'give-hint'           // surface hint text for current question
  | 'skip-question'       // advance past question with no penalty
  | 'cap-nan-damage'      // NaN Entity damage capped at 1 for N hits
  | 'show-error-category' // reveal which mistake category player is making
  | 'reveal-baseline'     // show if current answer differs from baseline
  | 'restore-checkpoint'  // rewind to position of last correct answer
  | 'remove-noise'        // clear crystallographic/glitch noise from question
  | 'show-over-time'      // correct answer revealed progressively over 8 seconds
  | 'secret';             // HeLa Cell Fragment — effect unknown until used

export interface Weapon {
  id: string;
  name: string;
  realm: 1 | 2 | 3 | 4;
  effect: WeaponEffect;
  effectValue?: number;  // e.g. 30 for +30s, 2 for eliminate-2-wrong
  maxUses: number;       // -1 = infinite (Nucleus Key artifact)
  sourceHint: string;
  flavourText: string;
  icon: string;
  secret?: boolean;
  drawIcon: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    t: number,
  ) => void;
}

// ─── Icon drawing helpers ─────────────────────────────────────────────────────

function px(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  ox: number, oy: number,
  u: number,
  w: number, h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(ox + x * u, oy + y * u, w * u, h * u);
}

// ─── Weapons ─────────────────────────────────────────────────────────────────

export const WEAPONS: Weapon[] = [
  // ─── Realm 1: The Cytoplasm ────────────────────────────────────────────────

  {
    id: 'pipette-of-precision',
    name: 'Pipette of Precision (Gerald)',
    realm: 1,
    effect: 'reveal-answer',
    maxUses: 1,
    sourceHint: "Found in Elliot's dropped kit near the Nucleus Lab entrance.",
    flavourText:
      "Elliot named it Gerald. He's had it since undergrad. He dropped it when he saw you coming. He insists this was an accident. It reveals the correct answer once, then needs to be recalibrated (it won't be).",
    icon: '🧪',
    drawIcon(ctx, x, y, size, _t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Bulb at top
      p(5, 0, 6, 4, '#c8e8ff');
      p(4, 1, 8, 3, '#e0f4ff');
      p(5, 0, 6, 1, '#ffffff');
      // Tube
      p(6, 4, 4, 7, '#b0ccee');
      p(7, 4, 2, 7, '#ddeeff');
      // Narrow tip
      p(7, 11, 2, 3, '#99bbdd');
      p(7, 13, 2, 1, '#aaaaff');
      // Liquid inside
      p(7, 5, 2, 5, '#00ffcc');
      p(7, 5, 1, 2, '#aaffee');
      // Label line
      p(6, 8, 4, 1, '#6699cc');
    },
  },

  {
    id: 'atp-capsule',
    name: 'ATP Capsule',
    realm: 1,
    effect: 'extra-time',
    effectValue: 30,
    maxUses: 3,
    sourceHint: 'Scattered near the mitochondria clusters in the lower Cytoplasm.',
    flavourText:
      'Adenosine triphosphate in capsule form. The cell usually makes this itself, but BioBit is not a cell, so here you are. Adds 30 seconds to the lesson timer. Do not chew.',
    icon: '⚡',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const glow = 0.5 + 0.5 * Math.sin(t * 4);
      // Capsule oval
      p(3, 4, 10, 8, '#005533');
      p(4, 3, 8, 10, '#00ffaa');
      p(4, 3, 4, 10, '#00cc88');
      p(5, 4, 6, 8, '#00ffaa');
      p(5, 4, 2, 3, '#aaffdd'); // highlight
      // + glyph
      p(7, 6, 2, 4, '#ffffff');
      p(6, 7, 4, 2, '#ffffff');
      // Glow ring
      if (glow > 0.6) {
        ctx.globalAlpha = (glow - 0.6) * 0.5;
        p(2, 3, 12, 10, '#00ffaa');
        ctx.globalAlpha = 1;
      }
    },
  },

  {
    id: 'nucleus-key',
    name: 'Nucleus Key',
    realm: 1,
    effect: 'unlock-path',
    maxUses: -1,
    sourceHint: 'Inside the nucleus chamber — guarded by a nuclear pore complex.',
    flavourText:
      "Shaped like a V-ATPase proton pump, which is either very elegant design or complete overkill for a key. It unlocks sealed paths throughout the Cytoplasm. Infinite uses — it's an artifact, not a consumable. Elliot says you'll need it.",
    icon: '🗝️',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const pulse = 0.7 + 0.3 * Math.sin(t * 2);
      ctx.globalAlpha = pulse;
      // Key head (circle-ish)
      p(2, 2, 7, 7, '#001155');
      p(3, 1, 5, 9, '#0044aa');
      p(3, 2, 5, 7, '#2266cc');
      p(4, 3, 3, 5, '#4488ee');
      p(4, 3, 2, 2, '#aaccff'); // shine
      // Hole in key
      p(4, 5, 3, 3, '#000022');
      p(5, 5, 2, 3, '#001144');
      // Key shaft
      p(7, 7, 6, 2, '#0044aa');
      p(7, 8, 6, 1, '#2266cc');
      // Teeth
      p(10, 9, 2, 3, '#0044aa');
      p(12, 9, 2, 2, '#0044aa');
      ctx.globalAlpha = 1;
    },
  },

  {
    id: 'chaperone-shield',
    name: 'Chaperone Shield',
    realm: 1,
    effect: 'block-damage',
    maxUses: 2,
    sourceHint: 'In the chaperone cache near the endoplasmic reticulum.',
    flavourText:
      "Molecular chaperones prevent misfolding by binding exposed hydrophobic regions. This one has been repurposed as a shield. It will absorb the next hit you take — exactly like GroEL-GroES absorbs a misfolded protein and gives it a safe space to try again. 2 uses.",
    icon: '🛡️',
    drawIcon(ctx, x, y, size, _t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Shield outline
      p(3, 1, 10, 2, '#220033');
      p(2, 3, 12, 8, '#440066');
      p(3, 11, 10, 2, '#220033');
      p(5, 13, 6, 1, '#220033');
      p(6, 14, 4, 1, '#220033');
      p(7, 15, 2, 1, '#220033');
      // Shield fill
      p(3, 2, 10, 9, '#9933bb');
      p(4, 11, 8, 1, '#9933bb');
      p(5, 12, 6, 1, '#7722aa');
      p(6, 13, 4, 1, '#7722aa');
      p(7, 14, 2, 1, '#6611aa');
      // Highlight
      p(4, 2, 5, 4, '#bb66dd');
      p(4, 2, 2, 7, '#bb66dd');
      // Protein helix motif in center
      p(6, 5, 4, 1, '#ffccff');
      p(7, 6, 2, 1, '#ffccff');
      p(6, 7, 4, 1, '#ffccff');
      p(7, 8, 2, 1, '#ffccff');
    },
  },

  {
    id: 'centrifuge',
    name: 'Centrifuge',
    realm: 1,
    effect: 'eliminate-wrong',
    effectValue: 2,
    maxUses: 2,
    sourceHint: 'Lab equipment zone — northeast corner of the Cytoplasm.',
    flavourText:
      'Spins at 100,000 RPM until the wrong answer options separate out by density and settle at the bottom. You then remove them. Scientifically, this is not how a centrifuge works. Mechanically, it removes 2 wrong answer choices. 2 uses.',
    icon: '🌀',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const spin = Math.floor(t * 8) % 4;
      // Body
      p(2, 6, 12, 6, '#444455');
      p(3, 5, 10, 8, '#667788');
      p(3, 5, 10, 1, '#99aabb');
      // Rotor (spinning)
      const rots = [[6,3,4,3],[3,5,3,4],[10,5,3,4],[6,10,4,3]];
      const col = ['#aabbcc','#889aab','#bbccdd','#99aabb'];
      p(6, 3, 4, 3, col[spin % 4]);
      p(3, 5, 3, 4, col[(spin+1) % 4]);
      p(10, 5, 3, 4, col[(spin+2) % 4]);
      p(6, 10, 4, 3, col[(spin+3) % 4]);
      void rots; // suppress unused warning
      // Center hub
      p(6, 6, 4, 4, '#334455');
      p(7, 7, 2, 2, '#99ccff');
      // Base
      p(1, 12, 14, 3, '#333344');
      p(2, 12, 12, 1, '#555566');
    },
  },

  // ─── Realm 2: The Genome Forest ────────────────────────────────────────────

  {
    id: 'bens-sandwich',
    name: "Ben's Sandwich",
    realm: 2,
    effect: 'restore-hearts',
    maxUses: 1,
    sourceHint: "Ben's inventory. He gives it reluctantly. Very reluctantly.",
    flavourText:
      "Ben's actual lunch. He will be upset about this. He had been looking forward to that sandwich since 7am. The lettuce was fresh. It had exactly the right amount of mustard. He will not stop mentioning it. Restores all hearts. Is it worth it? That's for you to decide.",
    icon: '🥪',
    drawIcon(ctx, x, y, size, _t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Top bread
      p(2, 2, 12, 3, '#c89040');
      p(3, 1, 10, 1, '#aa7030');
      p(2, 2, 12, 1, '#ddaa60');
      // Lettuce
      p(1, 5, 14, 2, '#44aa00');
      p(2, 5, 2, 1, '#66cc00');
      p(6, 5, 2, 1, '#66cc00');
      p(10, 5, 2, 1, '#66cc00');
      // Tomato
      p(2, 7, 12, 2, '#cc2222');
      p(3, 7, 2, 1, '#ee4444');
      // Cheese
      p(1, 9, 14, 2, '#eecc22');
      p(2, 9, 3, 1, '#ffee44');
      // Bottom bread
      p(2, 11, 12, 3, '#c89040');
      p(2, 13, 12, 1, '#aa7030');
      // Sesame seeds
      p(4, 2, 1, 1, '#f0d080');
      p(8, 2, 1, 1, '#f0d080');
      p(12, 2, 1, 1, '#f0d080');
    },
  },

  {
    id: 'blast-cursor',
    name: 'BLAST Cursor',
    realm: 2,
    effect: 'give-hint',
    maxUses: 3,
    sourceHint: 'In the sequence archive — the building with the scrolls.',
    flavourText:
      "BLAST (Basic Local Alignment Search Tool) finds regions of similarity between sequences. This cursor finds regions of similarity between the current question and your existing knowledge, then surfaces the relevant connection. Basically a hint. But a genomically validated one. 3 uses.",
    icon: '🔍',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // DNA bases floating (ATGC)
      const bases = ['#ff6644','#ffaa00','#44aaff','#44ff88'];
      const off = Math.floor(t * 3) % 4;
      p(0, 0, 2, 2, bases[off % 4]);
      p(0, 4, 2, 2, bases[(off+1) % 4]);
      p(0, 8, 2, 2, bases[(off+2) % 4]);
      p(0, 12, 2, 2, bases[(off+3) % 4]);
      // Cursor arrow
      p(5, 2, 2, 10, '#e8e8e8');
      p(5, 2, 8, 2, '#e8e8e8');
      p(7, 4, 2, 2, '#e8e8e8');
      p(9, 6, 2, 2, '#cccccc');
      p(11, 8, 2, 4, '#cccccc');
      // Outline
      p(4, 1, 1, 12, '#333333');
      p(4, 1, 10, 1, '#333333');
      p(4, 12, 4, 1, '#333333');
      p(8, 10, 2, 1, '#333333');
      // Search pulse ring
      const ring = Math.floor(t * 6) % 6;
      if (ring < 3) {
        ctx.globalAlpha = 0.3;
        p(13 - ring, 1 - ring, 2 + ring * 2, 2 + ring * 2, '#44ffaa');
        ctx.globalAlpha = 1;
      }
    },
  },

  {
    id: 'reference-genome-fragment',
    name: 'Reference Genome Fragment',
    realm: 2,
    effect: 'eliminate-wrong',
    effectValue: 1,
    maxUses: 4,
    sourceHint: 'In the reference library — the scroll building near the RNA River.',
    flavourText:
      "A verified fragment from the reference genome. Comparing your answer against the reference eliminates one wrong option — the one that deviates most from known annotations. This is how bioinformatics works: align against the reference, discard what doesn't match. 4 uses.",
    icon: '📜',
    drawIcon(ctx, x, y, size, _t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Scroll body
      p(3, 2, 10, 12, '#d4b87a');
      p(4, 2, 8, 12, '#e8cc88');
      p(4, 3, 8, 1, '#f0d898');
      // DNA base pair lines
      const atCol = '#ff6644';
      const gcCol = '#44aaff';
      p(5, 4, 2, 1, atCol); p(8, 4, 2, 1, atCol);
      p(5, 6, 2, 1, gcCol); p(8, 6, 2, 1, gcCol);
      p(5, 8, 2, 1, atCol); p(8, 8, 2, 1, atCol);
      p(5, 10, 2, 1, gcCol); p(8, 10, 2, 1, gcCol);
      // Center connector
      p(7, 4, 1, 7, '#a08840');
      // Scroll caps
      p(2, 1, 12, 2, '#a07030');
      p(2, 13, 12, 2, '#a07030');
      p(1, 0, 14, 2, '#c89050');
      p(1, 14, 14, 2, '#c89050');
    },
  },

  {
    id: 'variant-caller',
    name: 'Variant Caller',
    realm: 2,
    effect: 'reveal-baseline',
    maxUses: 2,
    sourceHint: "Alex's station in the south Genome Forest — near the sequencing terminals.",
    flavourText:
      "Alex built this. It calls single-nucleotide variants — differences from the reference baseline. Applied to the current question, it highlights if the correct answer has been altered from its original form (which happens when certain enemies corrupt the question text). 2 uses.",
    icon: '🔬',
    drawIcon(ctx, x, y, size, _t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Terminal screen
      p(1, 1, 14, 10, '#001122');
      p(2, 2, 12, 8, '#002233');
      // Sequence display
      const cols = ['#ff6644','#ffaa00','#44aaff','#44ff88'];
      for (let i = 0; i < 4; i++) {
        p(3, 3 + i * 2, 10, 1, '#003344');
        for (let j = 0; j < 5; j++) {
          p(3 + j * 2, 3 + i * 2, 1, 1, cols[(i + j) % 4]);
        }
      }
      // Variant highlight (red marker)
      p(7, 5, 2, 1, '#ff2244');
      p(7, 4, 2, 3, '#ff224444'.slice(0, 7));
      ctx.globalAlpha = 0.3;
      p(7, 4, 2, 3, '#ff2244');
      ctx.globalAlpha = 1;
      // Base
      p(3, 11, 10, 2, '#334455');
      p(6, 13, 4, 2, '#223344');
      p(4, 15, 8, 1, '#334455');
    },
  },

  {
    id: 'phred-booster',
    name: 'Phred Booster',
    realm: 2,
    effect: 'extra-time',
    effectValue: 20,
    maxUses: 3,
    sourceHint: 'At the quality control station — the glowing console northeast of the RNA River.',
    flavourText:
      "Phred quality scores (Q) measure base-call accuracy: Q20 = 99% accuracy, Q30 = 99.9%. This booster raises the quality of your current read, which in game terms adds 20 seconds to the timer. Improving quality takes time. That's the joke. 3 uses.",
    icon: '📈',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Chart background
      p(1, 1, 14, 13, '#001a2a');
      // Axes
      p(2, 2, 1, 10, '#4488aa');
      p(2, 11, 11, 1, '#4488aa');
      // Q score bar (rising)
      const h2 = Math.floor(4 + (Math.sin(t * 2) + 1) * 2);
      p(4, 12 - h2, 2, h2, '#52b788');
      p(7, 12 - 6, 2, 6, '#52b788');
      p(10, 12 - 8, 2, 8, '#00ffaa');
      p(10, 12 - 8, 2, 1, '#aaffdd'); // highlight
      // Q20/Q30 labels implied by tick marks
      p(2, 8, 2, 1, '#4488aa');
      p(2, 5, 2, 1, '#4488aa');
      // Arrow up
      p(12, 2, 2, 6, '#00ffaa');
      p(10, 4, 6, 2, '#00ffaa');
      p(11, 3, 4, 1, '#00ffaa');
    },
  },

  // ─── Realm 3: The Neural Nebula ────────────────────────────────────────────

  {
    id: 'alexs-coffee',
    name: "Alex's Coffee",
    realm: 3,
    effect: 'skip-question',
    maxUses: 1,
    sourceHint: "Alex's desk. She is not currently watching. She is always currently watching.",
    flavourText:
      "Alex's desk coffee. She will know. She ALWAYS knows when her coffee has been touched. You have approximately 30 seconds before she notices and approximately 30 minutes of her silence after that. Skips the current question with no penalty. Worth it. Probably.",
    icon: '☕',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Cup body
      p(3, 5, 10, 9, '#f0f0f0');
      p(4, 5, 8, 9, '#ffffff');
      // Coffee inside
      p(4, 5, 8, 1, '#e8a000');
      p(4, 5, 2, 1, '#ffcc44'); // surface highlight
      // Dark band
      p(3, 9, 10, 2, '#303040');
      // Handle
      p(13, 7, 2, 1, '#cccccc');
      p(14, 7, 1, 4, '#cccccc');
      p(13, 10, 2, 1, '#cccccc');
      // Lid
      p(2, 3, 12, 2, '#909090');
      p(3, 2, 10, 1, '#b0b0b0');
      p(6, 1, 4, 2, '#777788');
      // Steam wisps (animated)
      const st = Math.floor(t * 4) % 4;
      ctx.globalAlpha = 0.7;
      p(5 + (st % 2), 0, 1, 2, '#ffffff');
      p(8 - (st % 2), 0, 1, 2, '#ffffff');
      p(11, (st < 2 ? 0 : 1), 1, 1, '#ffffff');
      ctx.globalAlpha = 1;
    },
  },

  {
    id: 'gradient-clip',
    name: 'Gradient Clip',
    realm: 3,
    effect: 'cap-nan-damage',
    effectValue: 1,
    maxUses: 2,
    sourceHint: 'At the gradient flow debug station — the terminal with the red overflow warnings.',
    flavourText:
      "Gradient clipping caps the L2 norm of the gradient to prevent exploding updates. Applied to the NaN Entity, it caps incoming damage at 1 regardless of the actual attack value. The NaN Entity will be annoyed. It considers unclipped gradients an artistic statement. 2 uses.",
    icon: '✂️',
    drawIcon(ctx, x, y, size, _t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Gradient line (going up from left, then clipped flat)
      p(1, 13, 1, 1, '#3355ff');
      p(2, 11, 1, 2, '#4466ff');
      p(3, 9, 1, 2, '#5577ff');
      p(4, 7, 1, 2, '#6688ff');
      // Clip ceiling
      p(5, 5, 8, 2, '#ff4444');
      p(5, 5, 8, 1, '#ff6666');
      // After clip: flat
      p(5, 6, 8, 2, '#6688ff');
      // Scissors blades
      p(12, 2, 3, 1, '#cccccc');
      p(13, 3, 2, 1, '#aaaaaa');
      p(11, 4, 2, 1, '#cccccc');
      p(12, 5, 2, 1, '#aaaaaa');
      p(14, 4, 1, 1, '#cccccc');
      // Scissors handles
      p(10, 5, 3, 5, '#888899');
      p(13, 3, 2, 5, '#888899');
      p(10, 9, 3, 2, '#666677');
      p(13, 7, 2, 2, '#666677');
    },
  },

  {
    id: 'dropout-mask',
    name: 'Dropout Mask',
    realm: 3,
    effect: 'eliminate-wrong',
    effectValue: 2,
    maxUses: 3,
    sourceHint: 'In the training control room — the console that controls regularization parameters.',
    flavourText:
      "Dropout (p=0.5) randomly zeros approximately half the activations during training, preventing co-adaptation. Applied to the current question, it randomly eliminates wrong answer options — up to 2. The selection is genuinely random. That is the point. 3 uses.",
    icon: '🎭',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const flip = Math.floor(t * 3) % 2;
      if (flip === 0) {
        // Mask with X pattern (zeroed)
        p(2, 2, 12, 12, '#1a0840');
        p(3, 3, 10, 10, '#2a1060');
        // X marks (zero'd neurons)
        p(4, 4, 2, 2, '#aa44ff'); p(10, 4, 2, 2, '#aa44ff');
        p(7, 7, 2, 2, '#aa44ff'); p(4, 10, 2, 2, '#aa44ff');
        p(10, 10, 2, 2, '#aa44ff');
        // Zeros
        p(5, 5, 1, 1, '#000011'); p(11, 5, 1, 1, '#000011');
      } else {
        // Active neurons
        p(2, 2, 12, 12, '#0a0420');
        p(3, 3, 10, 10, '#1a0840');
        p(4, 4, 2, 2, '#ffaaff'); p(10, 4, 2, 2, '#ffaaff');
        p(4, 10, 2, 2, '#ffaaff'); p(10, 10, 2, 2, '#ffaaff');
        p(7, 7, 2, 2, '#ffffff');
      }
    },
  },

  {
    id: 'early-stopping-checkpoint',
    name: 'Early Stopping Checkpoint',
    realm: 3,
    effect: 'restore-checkpoint',
    maxUses: 1,
    sourceHint: 'In the checkpoint archive — the glowing save point in the east terminal.',
    flavourText:
      "Early stopping saves the model weights at the point of best validation performance, before overfitting sets in. This item restores you to the position of your last correct answer — same concept, different stakes. 1 use. Save it for when things go wrong.",
    icon: '💾',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const glow = 0.6 + 0.4 * Math.sin(t * 3);
      // Floppy/checkpoint disk
      p(2, 2, 12, 12, '#1a1a2e');
      p(3, 2, 10, 12, '#252545');
      // Label area
      p(4, 3, 8, 5, '#e8e8ff');
      p(5, 4, 6, 3, '#ffffff');
      // Checkmark on label
      p(6, 5, 1, 2, '#00aa44');
      p(7, 6, 3, 1, '#00aa44');
      p(8, 5, 2, 1, '#00aa44');
      // Metal slider
      p(5, 9, 6, 3, '#aaaacc');
      p(6, 9, 4, 3, '#ccccee');
      // Glow
      ctx.globalAlpha = glow * 0.3;
      p(1, 1, 14, 14, '#aa44ff');
      ctx.globalAlpha = 1;
    },
  },

  {
    id: 'confusion-matrix-lens',
    name: 'Confusion Matrix Lens',
    realm: 3,
    effect: 'show-error-category',
    maxUses: 2,
    sourceHint: 'In the evaluation lab — the room with all the screens showing TP/FP/TN/FN.',
    flavourText:
      "A confusion matrix reveals whether you're making false positive errors (selecting wrong answers confidently) or false negative errors (avoiding the right answer). This lens shows which category of mistake you're currently making, which is the first step toward not making it. 2 uses.",
    icon: '🔭',
    drawIcon(ctx, x, y, size, _t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // 2×2 matrix
      p(2, 2, 6, 6, '#004400'); // TP (green)
      p(8, 2, 6, 6, '#440000'); // FP (red)
      p(2, 8, 6, 6, '#440000'); // FN (red)
      p(8, 8, 6, 6, '#004400'); // TN (green)
      // Labels
      p(3, 3, 4, 4, '#00cc44');
      p(9, 3, 4, 4, '#cc2222');
      p(3, 9, 4, 4, '#cc2222');
      p(9, 9, 4, 4, '#00cc44');
      // Lens overlay (magnifying glass)
      p(4, 4, 2, 2, '#ffffff');
      p(10, 4, 2, 2, '#ffffff');
      // Grid lines
      p(2, 7, 12, 1, '#ffffff');
      p(7, 2, 1, 12, '#ffffff');
      // Lens circle
      ctx.globalAlpha = 0.15;
      p(2, 2, 12, 12, '#aaddff');
      ctx.globalAlpha = 1;
    },
  },

  // ─── Realm 4: The Protein Cathedral ────────────────────────────────────────

  {
    id: 'henrys-notes',
    name: "Henry's Notes",
    realm: 4,
    effect: 'give-hint',
    maxUses: 2,
    sourceHint: "Henry's holographic shelf — the floating bookcase to the left of the altar.",
    flavourText:
      "Henry has been teaching since 1951. His notes are comprehensive. They are also slightly glitchy, because he is slightly glitchy, but the content is intact. Reveals a full hint for any question. 2 uses. He will notice they've been moved. He will not say anything. He will definitely say something.",
    icon: '📓',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const alpha = 0.75 + 0.2 * Math.sin(t * 3);
      ctx.globalAlpha = alpha;
      // Notebook (holographic teal)
      p(3, 1, 10, 14, '#003355');
      p(4, 2, 8, 12, '#b0d8f8');
      p(4, 2, 8, 1, '#d0f0ff'); // top highlight
      // Circuit trace lines (Henry's style)
      p(5, 4, 6, 1, '#00aaff');
      p(5, 6, 4, 1, '#00aaff');
      p(9, 6, 2, 3, '#00aaff');
      p(5, 9, 4, 1, '#00aaff');
      p(5, 11, 6, 1, '#00aaff');
      // Binding
      p(3, 1, 1, 14, '#002244');
      p(3, 3, 2, 2, '#004488');
      p(3, 7, 2, 2, '#004488');
      p(3, 11, 2, 2, '#004488');
      // Glitch line (occasional)
      if (Math.floor(t * 4) % 4 === 0) {
        p(4, 7, 8, 1, '#ffffff');
      }
      ctx.globalAlpha = 1;
    },
  },

  {
    id: 'alphafold-prediction',
    name: 'AlphaFold Prediction',
    realm: 4,
    effect: 'reveal-answer',
    maxUses: 1,
    sourceHint: 'At the computing altar — the glowing terminal at the back of the Cathedral.',
    flavourText:
      "AlphaFold2 solved the 50-year protein folding problem in 2021, achieving median TM-score >0.92 across known structures. This prediction reveals the correct structure-related answer with the same confidence. TM-score: 1.0. It is correct. It is always correct. 1 use.",
    icon: '🧬',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const ph = t * 0.5;
      // Protein ribbon (alpha helix spiral suggestion)
      const cols = ['#c0a0ff','#9966ff','#7733ee','#aa55ff'];
      for (let i = 0; i < 6; i++) {
        const yy = 2 + i * 2;
        const xOff = Math.round(Math.sin(ph + i * 1.1) * 3);
        p(6 + xOff, yy, 4, 2, cols[i % cols.length]);
        if (i < 5) p(7 + xOff, yy + 1, 2, 2, cols[(i+1) % cols.length]);
      }
      // Confidence glow
      const glow = 0.4 + 0.3 * Math.sin(t * 2);
      ctx.globalAlpha = glow;
      p(3, 1, 10, 14, '#aa77ff');
      ctx.globalAlpha = 1;
      // Border
      p(2, 0, 12, 1, '#c0a0ff');
      p(2, 15, 12, 1, '#c0a0ff');
      p(2, 0, 1, 16, '#c0a0ff');
      p(13, 0, 1, 16, '#c0a0ff');
    },
  },

  {
    id: 'crystallization-flask',
    name: 'Crystallization Flask',
    realm: 4,
    effect: 'remove-noise',
    maxUses: 2,
    sourceHint: 'In the crystallography wing — the side nave with the X-ray diffraction panels.',
    flavourText:
      "X-ray crystallography requires perfectly ordered crystals — any noise in the diffraction pattern corrupts the structure solution. This flask removes noise from the current question text, reversing the effects of Phantom Crystal groups and Prediction Ghost obscuration. 2 uses.",
    icon: '🔮',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const spark = Math.floor(t * 6) % 3;
      // Flask body
      p(5, 6, 6, 8, '#1a1030');
      p(6, 7, 4, 7, '#c0a0ff');
      p(6, 7, 2, 3, '#e0ccff'); // highlight
      // Neck
      p(6, 3, 4, 4, '#8060cc');
      p(7, 2, 2, 2, '#9070dd');
      // Contents glow
      const glow = 0.5 + 0.5 * Math.sin(t * 4);
      ctx.globalAlpha = glow * 0.6;
      p(6, 8, 4, 5, '#ffaa00');
      ctx.globalAlpha = 1;
      // Crystal sparks
      const sparkPos = [[4,10],[11,9],[5,13],[10,12]];
      if (spark < sparkPos.length) {
        p(sparkPos[spark][0], sparkPos[spark][1], 2, 2, '#ffffff');
      }
      // Rim
      p(5, 6, 6, 1, '#7755bb');
    },
  },

  {
    id: 'md-sim',
    name: 'MD Sim',
    realm: 4,
    effect: 'show-over-time',
    maxUses: 1,
    sourceHint: 'In the simulation chamber — the room with the holographic protein models.',
    flavourText:
      "Molecular dynamics simulation runs Newton's equations of motion for every atom in a protein, over femtosecond timesteps, for nanoseconds of simulated time. This simulation runs the current question's answer over 8 seconds of game time — you watch the correct answer emerge from the physics. 1 use.",
    icon: '⚗️',
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      // Simulation frame
      p(1, 1, 14, 14, '#060810');
      p(2, 2, 12, 12, '#0c1020');
      // Atoms in motion
      const ph = t * 1.5;
      const atoms = [
        [4, 4, '#ff6644'], [8, 6, '#44aaff'], [12, 4, '#44ff88'],
        [6, 10, '#ffaa00'], [10, 11, '#aa44ff'], [3, 8, '#ff4488'],
      ];
      atoms.forEach(([ax, ay, ac], i) => {
        const dx = Math.round(Math.sin(ph + i * 1.3) * 1.5);
        const dy = Math.round(Math.cos(ph + i * 0.9) * 1.5);
        p(Number(ax) + dx, Number(ay) + dy, 2, 2, String(ac));
        p(Number(ax) + dx, Number(ay) + dy, 1, 1, '#ffffff');
      });
      // Bond lines between atoms 0-1 and 2-3
      p(5, 5, 3, 1, '#555577');
      p(6, 10, 4, 1, '#555577');
      // Timer bar at bottom
      const prog = (t % 8) / 8;
      p(2, 14, 12, 1, '#111122');
      p(2, 14, Math.round(prog * 12), 1, '#00ffaa');
    },
  },

  {
    id: 'hela-cell-fragment',
    name: 'HeLa Cell Fragment',
    realm: 4,
    effect: 'secret',
    maxUses: 1,
    sourceHint: 'Dropped by Dr. Henry Lacks after his final reveal. You did not expect this.',
    flavourText:
      "You don't know what this does yet. Neither does Enzyme. Neither, apparently, does it. It pulses with a warmth that has nothing to do with temperature. It has been alive since 1951. You carry it carefully.",
    icon: '✨',
    secret: true,
    drawIcon(ctx, x, y, size, t) {
      const u = size / 16;
      const p = (gx: number, gy: number, w: number, h: number, c: string) =>
        px(ctx, gx, gy, x, y, u, w, h, c);
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
      const pulse2 = 0.5 + 0.5 * Math.sin(t * 1.7 + 1);
      // Irregular cell fragment shape
      p(4, 2, 8, 2, '#ffaa00');
      p(2, 4, 12, 8, '#ffaa00');
      p(4, 12, 8, 2, '#ffaa00');
      p(3, 3, 10, 10, '#ffcc44');
      p(4, 4, 8, 8, '#ffe060');
      p(5, 5, 6, 6, '#fff0aa');
      // Inner glow
      ctx.globalAlpha = pulse * 0.7;
      p(5, 5, 6, 6, '#ffffff');
      ctx.globalAlpha = 1;
      // Organelle-like structure inside
      p(6, 6, 4, 4, '#ffaa00');
      p(7, 7, 2, 2, '#ff8800');
      // Pulse aura
      ctx.globalAlpha = pulse * 0.25;
      p(2, 2, 12, 12, '#ffdd00');
      ctx.globalAlpha = pulse2 * 0.15;
      p(0, 0, 16, 16, '#ffcc00');
      ctx.globalAlpha = 1;
      // Membrane channel details
      p(4, 6, 2, 1, '#cc8800');
      p(10, 9, 2, 1, '#cc8800');
      p(7, 3, 1, 2, '#cc8800');
    },
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getWeapon(id: string): Weapon | undefined {
  return WEAPONS.find((w) => w.id === id);
}

export function getRealmWeapons(realm: 1 | 2 | 3 | 4): Weapon[] {
  return WEAPONS.filter((w) => w.realm === realm);
}

// ─── Player weapon inventory ─────────────────────────────────────────────────

export interface WeaponInventory {
  [weaponId: string]: number; // remaining uses (0 = depleted)
}

export function useWeapon(
  inventory: WeaponInventory,
  weaponId: string,
): { inventory: WeaponInventory; success: boolean; weapon: Weapon | undefined } {
  const weapon = getWeapon(weaponId);
  if (!weapon) return { inventory, success: false, weapon: undefined };

  const remaining = inventory[weaponId] ?? 0;
  if (remaining === 0 && weapon.maxUses !== -1) {
    return { inventory, success: false, weapon };
  }

  const next: WeaponInventory = { ...inventory };
  if (weapon.maxUses !== -1) {
    next[weaponId] = Math.max(0, remaining - 1);
  }
  return { inventory: next, success: true, weapon };
}

export function addWeaponToInventory(
  inventory: WeaponInventory,
  weaponId: string,
): WeaponInventory {
  const weapon = getWeapon(weaponId);
  if (!weapon) return inventory;
  const current = inventory[weaponId] ?? 0;
  const max = weapon.maxUses === -1 ? 1 : weapon.maxUses;
  return { ...inventory, [weaponId]: Math.min(current + max, max === 1 ? 1 : max) };
}

export function getDefaultInventory(): WeaponInventory {
  return {};
}
