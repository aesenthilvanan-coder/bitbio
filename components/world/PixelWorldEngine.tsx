'use client';
import { useEffect, useRef, useCallback } from 'react';
import { WORLD_MAPS, type WorldMap } from '@/lib/worlds/worldMaps';
import { useGameStore } from '@/lib/store';
import { getRealmNodes } from '@/lib/curriculum';
import type { Realm } from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────
const SCALE = 3;           // game pixels → canvas pixels
const TILE = 16;           // tile size in game pixels
// CW, CH, VP_W, VP_H are computed dynamically from canvasSizeRef each frame

const MAP_W = 40;
const MAP_H = 28;

const MOVE_MS = 180;       // ms per tile move
const ANIM_MS = 500;       // ms per animation frame tick
const WALK_MS = 150;       // ms per walk-frame flip
const CAM_LERP = 0.12;     // camera smoothing

const WALKABLE = new Set(['.','=','*','1','2','3','4','5','6','7','8','9','E','B','A','H','@','C','S']);

// Tracks opened chests across hot-reloads within a session
const SESSION_OPENED: Set<string> = new Set();

// ─── Chest loot table (realmId-tx-ty → reward lines) ─────────────────────────
// Keys match exact 'C' tile positions in worldMaps.ts
const CHEST_LOOT: Record<string, { lines: string[]; gems: number; xp: number }> = {
  // Realm 1 – Cytoplasm
  '1-10-4': { lines: ['Nucleus Key!', 'Grants access to the inner gene vault.', '+50 XP  +10 💎'], gems: 10, xp: 50 },
  '1-22-5': { lines: ['Ribosome Bead!', 'A tRNA binding site, still warm.', '+30 XP  +5 💎'], gems: 5, xp: 30 },
  '1-11-20':{ lines: ['Mitochondria Shard!', '"The powerhouse of the cell."', '+80 XP  +15 💎'], gems: 15, xp: 80 },
  // Realm 2 – Genome Forest
  '2-8-5':  { lines: ['Ancient Base Pair!', 'Adenine + Thymine, intact.', '+60 XP  +10 💎'], gems: 10, xp: 60 },
  '2-29-20':{ lines: ['CRISPR Guide RNA!', 'Precision gene editing tool.', '+100 XP  +20 💎'], gems: 20, xp: 100 },
  // Realm 3 – Neural Nebula
  '3-13-2': { lines: ['Gradient Chip!', 'Backprop, but make it hardware.', '+80 XP  +15 💎'], gems: 15, xp: 80 },
  '3-25-2': { lines: ['Attention Head!', 'Transformer architecture component.', '+100 XP  +18 💎'], gems: 18, xp: 100 },
  '3-12-10':{ lines: ['Loss Crystal!', 'Cross-entropy, crystallized.', '+90 XP  +16 💎'], gems: 16, xp: 90 },
  // Realm 4 – Protein Cathedral
  '4-2-8':  { lines: ['Alpha Helix Pin!', 'Coiled, stable, beautiful.', '+80 XP  +15 💎'], gems: 15, xp: 80 },
  '4-8-20': { lines: ['Proteome Atlas!', 'Every known protein, charted.', '+150 XP  +30 💎'], gems: 30, xp: 150 },
};

// ─── Sign text table (realmId-tx-ty → lines) ─────────────────────────────────
// Keys match exact 'S' tile positions in worldMaps.ts
const SIGN_TEXT: Record<string, string[]> = {
  '1-2-1':  ['Welcome to the Cytoplasm!', 'Press E near glowing nodes to study.', 'Elliot is somewhere inside. Good luck.'],
  '1-11-2': ['⚠ BOSS GATE AHEAD', 'Complete all 9 lessons to challenge LYSO.', 'Bring snacks. It\'s a lysosome.'],
  '2-5-8':  ['RNA River Crossing', 'The bridge holds. Probably.', 'Ben built it. He was eating at the time.'],
  '2-4-12': ['GENOME FOREST SOUTH', 'Dense with ancient helix trees.', 'Ben\'s clearing is just beyond the river.'],
  '3-2-15': ['NEURAL NEBULA TERMINAL', 'Warning: void is not walkable.', 'Alex spilled coffee here once.'],
  '3-20-13':['SYNAPSE BRIDGE', 'Signal travels at 120 m/s here.', 'Do not disrupt the action potential.'],
  '4-2-10': ['PROTEIN CATHEDRAL', 'Built by a thousand misfolded chains.', 'Henry is at the altar. He\'s glowing.'],
  '4-13-20':['THE BETA SHEET TRANSEPT', 'Hydrogen bonds form the lattice.', 'Look closely — it\'s load-bearing.'],
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Dir = 'up' | 'down' | 'left' | 'right';
type CutPhase = 'fadein' | 'npc-walk' | 'dialogue' | 'done';

interface GameState {
  // frame counter (increments every RAF tick)
  frame: number;
  // player
  px: number; py: number;         // tile position (integer)
  pfx: number; pfy: number;       // kept for compat reference; actual progress via moveProgress
  moveProgress: number;           // 0-1, computed directly from (now - lastMoveTime) / MOVE_MS
  prevPx: number; prevPy: number; // previous tile (for lerp origin)
  dir: Dir;
  moving: boolean;
  // camera (in tiles, fractional)
  camX: number; camY: number;
  // timing
  lastMoveTime: number;
  lastAnimTime: number;
  lastWalkTime: number;
  // animation
  animFrame: number;    // 0-3, ticks every ANIM_MS
  walkFrame: number;    // 0 or 1
  // keys held
  keys: Set<string>;
  // interaction
  onNode: string | null;       // tile char currently standing on ('1'-'9' or null)
  nearNpc: string | null;      // 'E'|'B'|'A'|'H' or null
  // dialogue
  dialogueActive: boolean;
  dialogueLine: number;
  dialogueChar: number;        // typewriter progress
  dialogueLastChar: number;    // timestamp of last char tick
  // cutscene
  cutPhase: CutPhase;
  cutProgress: number;         // 0-1
  cutNpcX: number;             // fractional screen-tile x of NPC during cutscene
  cutStartTime: number;
  cutDialogueLine: number;
  cutDialogueChar: number;
  cutDialogueLastChar: number;
  // node prompt
  nodePromptVisible: boolean;
  // helper button overlay
  helperVisible: boolean;
  // chest / sign interaction
  nearChest: { tx: number; ty: number } | null;
  nearSign: { tx: number; ty: number } | null;
  signDialogueActive: boolean;
  signLines: string[];
  signDialogueLine: number;
  signDialogueChar: number;
  signDialogueLastChar: number;
  chestPopup: { text: string; timer: number } | null;
}

interface Props {
  realm: 1 | 2 | 3 | 4;
  onEnterNode: (nodeId: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function tileAt(map: string[], tx: number, ty: number): string {
  if (ty < 0 || ty >= map.length) return '#';
  const row = map[ty];
  if (tx < 0 || tx >= row.length) return '#';
  return row[tx];
}

function isWalkable(map: string[], tx: number, ty: number): boolean {
  return WALKABLE.has(tileAt(map, tx, ty));
}

function findChar(map: string[], ch: string): { x: number; y: number } | null {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf(ch);
    if (x !== -1) return { x, y };
  }
  return null;
}

// ─── Pixel-art drawing helpers ────────────────────────────────────────────────

/** Draw a rect specified in game-pixel coords relative to tile top-left. */
function gr(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,     // canvas px of tile origin
  gx: number, gy: number,     // game-pixel offset within tile
  gw: number, gh: number,     // game-pixel size
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(cx + gx * SCALE, cy + gy * SCALE, gw * SCALE, gh * SCALE);
}

// ─── Tile rendering — Omori-quality: organic shapes, rich textures, layered depth ─────────
function drawTile(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  tile: string,
  animFrame: number,
  palette: WorldMap['palette'],
  realm: number,
  isCompleted: boolean,
  t: number,
  tx: number,
  ty: number,
  frame: number,
  map: string[] = [],
  henryPos: {tx: number; ty: number} | null = null
) {
  const W = TILE; // 16 game pixels per tile

  // Per-realm Omori-inspired color system — one coherent palette per world
  const FL  = ['#1d4d55','#9acfaa','#0c0e2e','#1a1530'] as const; // floor base
  const FLH = ['#255e6a','#b0e4bc','#14163e','#241e40'] as const; // floor highlight
  const WL  = ['#0d2a30','#2e5038','#040310','#0a0818'] as const; // wall
  const WLT = ['#1a4550','#3e6848','#0c0c2a','#16133a'] as const; // wall top-face
  const TC  = ['#005a60','#4abf94','#2a0a6a','#1e1c48'] as const; // tree/org main
  const TH  = ['#00ffcc','#7ee8bc','#8844ff','#ffaa00'] as const; // tree highlight
  const TS  = ['#003040','#28906a','#100438','#100e28'] as const; // tree shadow
  const TR  = ['#1a5060','#7a9870','#1a0848','#2a2060'] as const; // trunk
  const FLW = ['#00ccaa','#ffb8d8','#aa66ff','#ffcc44'] as const; // flower/detail
  const ACC = ['#00ffcc','#00ff88','#aa44ff','#ffaa00'] as const; // accent

  const fl  = FL[realm-1];
  const flH = FLH[realm-1];
  const wl  = WL[realm-1];
  const wlT = WLT[realm-1];
  const tc  = TC[realm-1];
  const tH  = TH[realm-1];
  const tS  = TS[realm-1];
  const tR  = TR[realm-1];
  const flw = FLW[realm-1];
  const acc = ACC[realm-1];

  // Deterministic per-tile hash — drives scatter decorations without Math.random()
  const h1 = (tx * 1664525  + ty * 1013904223) & 0x7fffffff;
  const h2 = (tx * 22695477 + ty * 1103515245) & 0x7fffffff;

  switch (tile) {

    // ─────────────────────────────────────────────────────────────────────────
    // FLOOR — organic, textured, scattered decorations
    // ─────────────────────────────────────────────────────────────────────────
    case '.':
    case '@': {
      gr(ctx, cx, cy, 0, 0, W, W, fl);
      if (h1 % 4 === 0) gr(ctx, cx, cy, 0, 0, W, W, flH);

      if (realm === 2) {
        // Genome Forest: Omori-style soft mint ground with flowers
        for (let r = 0; r < W; r += 4)
          gr(ctx, cx, cy, 0, r, W, 1, shiftColor(fl, -4));
        if (h1 % 7 === 0) {
          const fx = (h1>>8)%10+3, fy = (h2>>8)%10+3;
          gr(ctx, cx, cy, fx,   fy-1, 1, 1, flw); gr(ctx, cx, cy, fx,   fy+1, 1, 1, flw);
          gr(ctx, cx, cy, fx-1, fy,   1, 1, flw); gr(ctx, cx, cy, fx+1, fy,   1, 1, flw);
          gr(ctx, cx, cy, fx,   fy,   1, 1, '#ffffff');
        } else if (h1 % 11 === 0) {
          const gx = (h1>>6)%12+2, gy = (h2>>6)%12+2;
          gr(ctx, cx, cy, gx,   gy,   1, 2, shiftColor(fl, 22));
          gr(ctx, cx, cy, gx+2, gy+1, 1, 2, shiftColor(fl, 16));
        } else if (h1 % 17 === 0) {
          const fx2=(h1>>10)%12+2, fy2=(h2>>10)%12+2;
          gr(ctx, cx, cy, fx2-1, fy2, 3, 1, flw); gr(ctx, cx, cy, fx2, fy2-1, 1, 3, flw);
          gr(ctx, cx, cy, fx2, fy2, 1, 1, '#ffffff');
        }
      } else if (realm === 1) {
        if (ty%3===1) gr(ctx, cx, cy, 0, 10, W, 1, shiftColor(fl, -7));
        if (h1%9===0) {
          const px2=(h1>>4)%12+2, py2=(h2>>4)%12+2;
          if (((frame>>2)+h1)%4<2) { gr(ctx,cx,cy,px2,py2,2,2,'#00ffcc33'); gr(ctx,cx,cy,px2+1,py2+1,1,1,'#00ffcc88'); }
        }
        if (h1%5===0) {
          const p=(frame+(h1&0xff))%40, ax=Math.floor(p/2.5);
          if (ax>=0&&ax<=W-2) { const ay=8+Math.floor(Math.sin(p*0.3)*4); if(ay>=0&&ay<=W-2) gr(ctx,cx,cy,ax,ay,2,2,'#00cc88'); }
        }
      } else if (realm === 3) {
        // ── Grid-pattern tech floor (spec: grid lines every 8px, intersections bright) ──
        gr(ctx, cx, cy, 0, 0, W, W, '#14083a');
        // Grid lines at x=0,8 and y=0,8
        gr(ctx,cx,cy,0,0,W,1,'#1a0840'); gr(ctx,cx,cy,0,8,W,1,'#1a0840');
        gr(ctx,cx,cy,0,0,1,W,'#1a0840'); gr(ctx,cx,cy,8,0,1,W,'#1a0840');
        // Grid intersections: 2×2 bright squares at (0,0),(8,0),(0,8),(8,8)
        gr(ctx,cx,cy,0,0,2,2,'#2a1060'); gr(ctx,cx,cy,7,0,2,2,'#2a1060');
        gr(ctx,cx,cy,0,7,2,2,'#2a1060'); gr(ctx,cx,cy,7,7,2,2,'#2a1060');
        // Occasional bright intersection pulse
        if((frame+h1)%80<6) gr(ctx,cx,cy,7,7,2,2,'#ffffff');
        // ── Metallic platform edge treatment for tiles adjacent to void (~) ──
        if (map.length > 0) {
          const below = tileAt(map,tx,ty+1);
          const above = tileAt(map,tx,ty-1);
          const lft   = tileAt(map,tx-1,ty);
          const rgt   = tileAt(map,tx+1,ty);
          if(below==='~') gr(ctx,cx,cy,0,W-1,W,1,'#4a2880');
          if(above==='~') gr(ctx,cx,cy,0,0,W,1,'#0a0420');
          if(lft  ==='~') gr(ctx,cx,cy,0,0,1,W,'#0a0420');
          if(rgt  ==='~') gr(ctx,cx,cy,W-1,0,1,W,'#0a0420');
          // Corner bright pixel
          if((below==='~'||lft==='~')&&(below==='~'||lft==='~')) gr(ctx,cx,cy,0,W-1,1,1,'#6a3a90');
          if((below==='~'||rgt==='~')&&(below==='~'||rgt==='~')) gr(ctx,cx,cy,W-1,W-1,1,1,'#6a3a90');
        }
      } else {
        const mX=tx%2===0?0:8;
        gr(ctx,cx,cy,mX,0,W,W,shiftColor(fl,7));
        gr(ctx,cx,cy,0,7,W,2,wl); gr(ctx,cx,cy,mX+7,0,2,W,wl);
        if (h1%13===0&&(frame+h1)%35<18) {
          ctx.globalAlpha=0.18;
          gr(ctx,cx,cy,(h1>>4)%12+2,(h2>>4)%12+2,3,3,'#ffaa22');
          ctx.globalAlpha=1;
        }
      }
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WALL — raised terrain with cliff-edge depth
    // ─────────────────────────────────────────────────────────────────────────
    case '#': {
      // ── Realm 4 Forbidden Sanctum: cols 11-19 render darker ──
      const isSanctum = realm === 4 && tx >= 11 && tx <= 19 && ty <= 11;
      if (isSanctum) {
        gr(ctx, cx, cy, 0, 0, W, W, '#100826');
        // Gold carvings on top edge of sanctum boundary
        if (ty <= 1) {
          const notchOff = tx % 3;
          gr(ctx, cx, cy, 0, 0, W, 1, '#ffaa0033');
          if (notchOff === 0) { gr(ctx, cx, cy, 4, 0, 2, 2, '#ffaa0055'); }
        }
        // Side face depth lines
        if (tx === 11) gr(ctx, cx, cy, 0, 0, 1, W, '#3a2060');
        if (tx === 19) gr(ctx, cx, cy, W-1, 0, 1, W, '#3a2060');
        break;
      }
      gr(ctx, cx, cy, 0, 0, W, W, wl);
      gr(ctx, cx, cy, 0, 0, W, 3, wlT);
      gr(ctx, cx, cy, 0, 0, W, 1, shiftColor(wlT, 30));
      gr(ctx, cx, cy, 0, 0, 1, W, shiftColor(wlT, 20));
      gr(ctx, cx, cy, W-1, 0, 1, W, shiftColor(wl, -20));
      gr(ctx, cx, cy, 0, W-4, W, 4, shiftColor(wl, -20));
      gr(ctx, cx, cy, 0, W-2, W, 2, shiftColor(wl, -35));
      gr(ctx, cx, cy, 0, W-1, W, 1, '#000000');
      if (realm===2) {
        const bx=(h1>>4)%13+1; gr(ctx,cx,cy,bx,3,1,W-6,shiftColor(wl,10));
        if((tx*3+ty)%5!==0) { const bx2=(h2>>4)%13+1; gr(ctx,cx,cy,bx2,4,1,W-7,shiftColor(wl,6)); }
      } else if (realm===1) {
        gr(ctx,cx,cy,0,5,W,1,shiftColor(wl,20)); gr(ctx,cx,cy,0,7,W,1,shiftColor(wl,12)); gr(ctx,cx,cy,0,9,W,1,shiftColor(wl,8));
        if(h1%7===0) { const pY=5+(h2%5); gr(ctx,cx,cy,6,pY,4,3,acc+'44'); gr(ctx,cx,cy,7,pY+1,2,1,acc); }
        // ── Outer membrane glow (boundary walls at row 0, row 27, col 0, col 39) ──
        const isOuterMembrane = ty === 0 || ty === 27 || tx === 0 || tx === 39;
        if (isOuterMembrane) {
          const glowAlpha = 0.15 + 0.15 * Math.sin(frame * 0.04);
          ctx.globalAlpha = glowAlpha;
          gr(ctx, cx, cy, 0, 0, W, W, '#00ffcc');
          ctx.globalAlpha = 1;
          // Membrane protein decoration every 8th tile along inner face
          if (tx % 8 === 0 || ty % 8 === 0) {
            // Hexagonal decoration: 3x3 cross pattern
            gr(ctx, cx, cy, 6, 5, 4, 1, '#00ffcc');
            gr(ctx, cx, cy, 7, 4, 2, 3, '#00ffcc');
            gr(ctx, cx, cy, 7, 4, 2, 1, '#aaffee');
          }
        }
      } else if (realm===3) {
        gr(ctx,cx,cy,0,W>>1,W,1,shiftColor(wl,22));
        if(tx%2===0) gr(ctx,cx,cy,W>>1,0,1,W,shiftColor(wl,16));
      } else {
        gr(ctx,cx,cy,0,W>>1,W,2,shiftColor(wl,18));
        if((tx+ty)%3===0) gr(ctx,cx,cy,3,2,W-6,1,acc+'33');
      }
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TREE / ORGANELLE / PILLAR — Omori-quality shapes
    // ─────────────────────────────────────────────────────────────────────────
    case 'T': {
      gr(ctx, cx, cy, 0, 0, W, W, fl);
      if (realm===2&&h1%7===0) { gr(ctx,cx,cy,1,14,1,1,flw); gr(ctx,cx,cy,14,13,1,1,flw); }

      if (realm === 2) {
        // ── GENOME FOREST: DNA Double Helix Tree ──────────────────────────
        // Floor base
        gr(ctx,cx,cy,0,0,W,W,fl);
        // Ground shadow
        gr(ctx,cx,cy,3,W-1,10,1,shiftColor(fl,-18));

        // DNA Helix trunks (two vertical strands with base pair connections)
        // Left strand at x=3, Right strand at x=10, each 3px wide, full height
        const dnaH = 14; // helix zone rows 0-13
        for (let row = 0; row < dnaH; row++) {
          gr(ctx,cx,cy,2,row,3,1,'#1a4010');   // left trunk strand
          gr(ctx,cx,cy,11,row,3,1,'#1a4010');  // right trunk strand
        }
        // Base pair connections every 4px with alternating ATGC colors
        const bpColors: Record<string,string> = { A:'#ff6644', T:'#ff6644', G:'#44aaff', C:'#44aaff' };
        const bpPattern = ['A','T','G','C','A','T','G','C','A','T','G','C','A','T'];
        for (let row = 1; row < dnaH; row += 4) {
          const bp = bpPattern[Math.floor(row/2) % bpPattern.length];
          gr(ctx,cx,cy,5,row,6,1,bpColors[bp]);    // connection bar
          gr(ctx,cx,cy,5,row,1,1,'#ffffff');        // highlight left end
        }
        // Left strand highlight
        for (let row = 0; row < dnaH; row += 2) gr(ctx,cx,cy,2,row,1,1,shiftColor('#1a4010',20));

        // Canopy blob (14×6, top of tile)
        // Dark outline
        gr(ctx,cx,cy,1,0,14,1,shiftColor('#00ff44',-40));
        gr(ctx,cx,cy,0,1,16,1,shiftColor('#00ff44',-40));
        // Main canopy
        gr(ctx,cx,cy,1,1,14,5,'#00ff44');
        gr(ctx,cx,cy,2,0,12,1,'#00ff44');
        // Interior darker
        gr(ctx,cx,cy,3,2,10,3,'#00aa22');
        // Top highlight
        gr(ctx,cx,cy,4,1,5,1,'#88ff88'); gr(ctx,cx,cy,3,2,2,1,'#88ff88');
        gr(ctx,cx,cy,4,1,2,1,'#ffffff');
        // Scattered dots (flower-like)
        [[5,4],[9,3],[4,6],[11,5],[7,4]].forEach(([dx,dy],i)=>{
          if((h1+i*11)%3!==0) gr(ctx,cx,cy,dx,dy,1,1,flw);
        });
        if((h1+animFrame)%5===0) gr(ctx,cx,cy,8,2,1,1,'#ffffff');
        // Trunk connector between helix and canopy
        gr(ctx,cx,cy,6,5,4,2,tR); gr(ctx,cx,cy,7,5,2,2,shiftColor(tR,18));

      } else if (realm === 1) {
        // ── CYTOPLASM: Elongated mitochondria (horizontal oval, 12×8 game px) ──
        const gA = 0.15 + 0.15 * Math.sin(frame * 0.04);
        const bright = Math.sin(frame * 0.06) > 0;
        // Floor under mitochondria
        gr(ctx,cx,cy,0,0,W,W,fl);
        gr(ctx,cx,cy,2,W-2,12,2,'#001a10'); // ground shadow
        // Outer oval body (12×8, centered at x=2,y=5)
        gr(ctx,cx,cy,3,5,10,6,'#2a4020');   // outer
        gr(ctx,cx,cy,2,6,12,4,'#2a4020');   // wider middle
        gr(ctx,cx,cy,3,5,10,1,'#3a6030');   // inner top
        gr(ctx,cx,cy,3,10,10,1,'#1a2810');  // inner bottom shadow
        // Inner membrane folds
        gr(ctx,cx,cy,3,7,10,1,'#1a3018');   // fold 1 at y+2
        gr(ctx,cx,cy,3,9,10,1,'#1a3018');   // fold 2 at y+4
        // Accent glow at tips
        ctx.globalAlpha = gA;
        gr(ctx,cx,cy,2,6,2,3,'#00ffcc');    // left tip glow
        gr(ctx,cx,cy,12,6,2,3,'#00ffcc');   // right tip glow
        ctx.globalAlpha = 1;
        // ATP synthase bright dots on membrane
        if (bright) {
          gr(ctx,cx,cy,4,5,2,1,'#ffcc00'); gr(ctx,cx,cy,10,5,2,1,'#ffcc00');
          gr(ctx,cx,cy,4,10,2,1,'#ffcc00'); gr(ctx,cx,cy,10,10,2,1,'#ffcc00');
        }
        // Highlight top-left
        gr(ctx,cx,cy,4,6,2,1,'#ffffff');

      } else if (realm === 3) {
        // ── NEURAL NEBULA: Crystal neural spire ──────────────────────────
        const pulse=animFrame%2===0;
        gr(ctx,cx,cy,4,W-1,8,1,'#000000');
        gr(ctx,cx,cy,7,0,2,14,'#280a55'); gr(ctx,cx,cy,6,2,4,11,'#4a1080'); gr(ctx,cx,cy,5,5,6,8,'#5a18a0');
        gr(ctx,cx,cy,5,5,1,8,'#9955dd'); gr(ctx,cx,cy,6,2,1,11,'#7733bb'); gr(ctx,cx,cy,10,5,1,8,'#2a0850');
        gr(ctx,cx,cy,7,1,2,2,'#ddaaff'); gr(ctx,cx,cy,8,0,1,1,'#ffffff');
        ctx.globalAlpha=pulse?0.9:0.5; gr(ctx,cx,cy,5,0,6,5,tH); ctx.globalAlpha=1;
        if(pulse) { gr(ctx,cx,cy,7,0,2,1,'#ffffff'); gr(ctx,cx,cy,6,1,4,2,'#eeccff'); }
        gr(ctx,cx,cy,0,7,5,1,shiftColor(tc,-10)); gr(ctx,cx,cy,11,5,5,1,shiftColor(tc,-10));
        gr(ctx,cx,cy,0,7,2,1,acc); gr(ctx,cx,cy,14,5,2,1,acc);
        ctx.globalAlpha=0.2+0.1*Math.sin(t*2+tx); gr(ctx,cx,cy,4,12,8,4,tH); ctx.globalAlpha=1;

      } else {
        // ── PROTEIN CATHEDRAL: Gothic pillar with alpha-helix spiral highlight ──
        gr(ctx,cx,cy,3,W-1,10,1,'#000000');
        gr(ctx,cx,cy,4,0,8,W,wl); gr(ctx,cx,cy,4,0,2,W,shiftColor(wl,22)); gr(ctx,cx,cy,10,0,2,W,shiftColor(wl,-12));
        // Alpha-helix spiral: alternating left/right 1px bright pixels winding up column
        for(let sY=2;sY<W;sY+=2) {
          const isLeft=Math.floor(sY/2)%2===0;
          gr(ctx,cx,cy,isLeft?4:10,sY,1,1,'#4a40a0');
        }
        // Capital (pillar top) + gold accent line
        gr(ctx,cx,cy,1,0,14,4,shiftColor(wl,14)); gr(ctx,cx,cy,0,0,16,2,shiftColor(fl,5)); gr(ctx,cx,cy,1,0,14,1,acc);
        // Base + gold accent bottom
        gr(ctx,cx,cy,1,13,14,3,shiftColor(wl,10)); gr(ctx,cx,cy,0,14,16,2,shiftColor(fl,5)); gr(ctx,cx,cy,1,W-1,14,1,acc);
        gr(ctx,cx,cy,4,6,8,1,shiftColor(wl,-18)); gr(ctx,cx,cy,4,9,8,1,shiftColor(wl,-18));
        gr(ctx,cx,cy,2,3,12,1,acc+'88'); gr(ctx,cx,cy,2,12,12,1,acc+'88');
        // Top glow (spec: #ffaa00 at 20% alpha, radius 12px from top)
        ctx.globalAlpha=0.2; gr(ctx,cx,cy,2,0,12,4,'#ffaa00'); ctx.globalAlpha=1;
        const bP=(frame+tx*23+ty*7)%150;
        if(bP<60) { ctx.globalAlpha=0.22; gr(ctx,cx,cy,4+(bP>>3)%7,0,2,W,'#ffe44c'); ctx.globalAlpha=1; }
      }
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WATER / VOID / ACID / RIVER
    // ─────────────────────────────────────────────────────────────────────────
    case '~': {
      if (realm===1) {
        gr(ctx,cx,cy,0,0,W,W,'#110018'); gr(ctx,cx,cy,2,0,12,W,'#180024');
        const r1=Math.max(1,Math.min(W-2,4+Math.floor(Math.sin(t*0.9+tx*0.5)*2)));
        const r2=Math.max(1,Math.min(W-2,11+Math.floor(Math.sin(t*0.9+ty*0.5+1.5)*2)));
        gr(ctx,cx,cy,0,r1,W,1,'#3a0055'); gr(ctx,cx,cy,0,r2,W,1,'#5500aa');
        const bY=Math.max(2,Math.min(W-5,Math.floor(8+Math.sin(t*1.8+tx)*5)));
        gr(ctx,cx,cy,6,bY,4,4,'#004400'); gr(ctx,cx,cy,7,bY,2,2,'#00cc00'); gr(ctx,cx,cy,7,bY+1,1,1,'#88ff44');
        gr(ctx,cx,cy,0,0,2,2,'#cc0000'); gr(ctx,cx,cy,W-2,0,2,2,'#cc0000');
        gr(ctx,cx,cy,0,0,W,1,'#330044'); gr(ctx,cx,cy,0,W-1,W,1,'#330044');
      } else if (realm===2) {
        // ── RNA River: data packets with correct nucleotide colors A/U/G/C at 3 row offsets ──
        gr(ctx,cx,cy,0,0,W,W,'#051a2a'); gr(ctx,cx,cy,2,0,12,W,'#081220');
        // River bank scatter
        gr(ctx,cx,cy,0,0,W,1,'#0a2a0a'); gr(ctx,cx,cy,0,W-1,W,1,'#0a2a0a');
        // Three rows of packets at y=3,8,12 with speeds 0.3/0.5/0.7 gp/frame
        const nucCols=['#ff6644','#ffaa00','#44aaff','#44ff88'] as const;
        const rowDefs=[[3,frame*0.4],[8,frame*0.7],[12,frame*0.9]] as [number,number][];
        for (const [rowY,speed] of rowDefs) {
          for(let pi=0;pi<5;pi++) {
            const pOff=Math.floor((speed+pi*4+tx*3)%(W+6));
            const pX=pOff%W;
            if(pX>=0&&pX<=W-3) {
              const nc=nucCols[(pi+tx+ty)%4];
              gr(ctx,cx,cy,pX,rowY,3,2,nc);
              gr(ctx,cx,cy,pX,rowY,1,1,'#ffffff');
            }
          }
        }
      } else if (realm===3) {
        gr(ctx,cx,cy,0,0,W,W,'#03000a');
        [[2,3],[7,1],[12,5],[4,10],[14,8],[9,14],[1,13],[11,2],[5,7],[13,11],[3,15],[10,4]].forEach(([sx,sy])=>{
          const ph=(sx*7+sy*13+tx*3+ty*5)%45;
          gr(ctx,cx,cy,sx,sy,1,1,(frame+ph)%45<22?'#ffffff':'#8888bb');
        });
        if((frame+h1)%120<3) gr(ctx,cx,cy,h1%12,h2%12,2,2,'#aa88ff');
        if(h1%4===0) { ctx.globalAlpha=0.12; gr(ctx,cx,cy,(h1>>8)%12+2,(h2>>8)%12+2,4,3,acc); ctx.globalAlpha=1; }
      } else {
        gr(ctx,cx,cy,0,0,W,W,'#070510'); gr(ctx,cx,cy,2,0,12,W,'#0c0920');
        const wv=Math.floor(t*2)%8; gr(ctx,cx,cy,2,wv%W,12,1,'#221444'); gr(ctx,cx,cy,3,(wv+5)%W,10,1,'#331a5a');
        gr(ctx,cx,cy,5,3,2,2,'#5522cc'); gr(ctx,cx,cy,9,9,2,2,'#4422aa'); gr(ctx,cx,cy,6,11,1,1,'#aa66ff');
      }
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PATH — bridge / highway / aisle
    // ─────────────────────────────────────────────────────────────────────────
    case '=': {
      if (realm===1) {
        // ── Dual-track Microtubule Highway: #0d2040 base, #00ffcc tracks at y=4+y=12, cargo dots ──
        gr(ctx,cx,cy,0,0,W,W,'#0d2040');
        gr(ctx,cx,cy,0,5,W,7,'#08162a');
        gr(ctx,cx,cy,0,4,W,1,'#00ffcc'); gr(ctx,cx,cy,0,12,W,1,'#00ffcc');
        gr(ctx,cx,cy,0,5,W,1,'#00ccaa'); gr(ctx,cx,cy,0,13,W,1,'#00ccaa');
        gr(ctx,cx,cy,0,3,1,3,'#00ffcc'); gr(ctx,cx,cy,W-1,3,1,3,'#00ffcc');
        gr(ctx,cx,cy,0,11,1,3,'#00ffcc'); gr(ctx,cx,cy,W-1,11,1,3,'#00ffcc');
        const cX1=Math.floor((frame*2+tx*7)%(W*2))%W;
        const cX2=Math.floor((frame*3+ty*11)%(W*2))%W;
        if(cX1<=W-2) { gr(ctx,cx,cy,cX1,2,2,2,'#00ffee'); gr(ctx,cx,cy,cX1+1,3,1,1,'#ffffff'); }
        if(cX2<=W-2) { gr(ctx,cx,cy,cX2,10,2,2,'#00ffee'); gr(ctx,cx,cy,cX2+1,11,1,1,'#ffffff'); }
      } else if (realm===2) {
        // Wooden bridge planks (Omori-style)
        gr(ctx,cx,cy,0,0,W,W,'#7a4a1a');
        gr(ctx,cx,cy,5,0,1,W,'#4a2a08'); gr(ctx,cx,cy,10,0,1,W,'#4a2a08');
        gr(ctx,cx,cy,0,0,5,1,'#9a6a2a'); gr(ctx,cx,cy,6,0,4,1,'#9a6a2a'); gr(ctx,cx,cy,11,0,5,1,'#9a6a2a');
        gr(ctx,cx,cy,0,W-1,W,1,'#4a2a08');
        gr(ctx,cx,cy,1,5,3,1,'#8a5a22'); gr(ctx,cx,cy,6,3,3,1,'#8a5a22'); gr(ctx,cx,cy,11,7,3,1,'#8a5a22');
        gr(ctx,cx,cy,1,10,3,1,'#8a5a22'); gr(ctx,cx,cy,6,12,3,1,'#8a5a22');
        gr(ctx,cx,cy,2,2,1,1,'#c0903a'); gr(ctx,cx,cy,8,2,1,1,'#c0903a'); gr(ctx,cx,cy,13,2,1,1,'#c0903a');
        gr(ctx,cx,cy,2,W-3,1,1,'#c0903a'); gr(ctx,cx,cy,8,W-3,1,1,'#c0903a'); gr(ctx,cx,cy,13,W-3,1,1,'#c0903a');
      } else if (realm===3) {
        gr(ctx,cx,cy,0,0,W,W,'#050008'); gr(ctx,cx,cy,0,3,W,10,'#0f0520');
        gr(ctx,cx,cy,0,3,W,1,'#8833ee'); gr(ctx,cx,cy,0,4,W,1,'#5511aa');
        gr(ctx,cx,cy,0,12,W,1,'#4411aa'); gr(ctx,cx,cy,0,13,W,1,'#220866');
        const pX=Math.floor(t*6*W)%(W*2)-W;
        if(pX>=0&&pX<W) gr(ctx,cx,cy,pX,5,3,6,'#9933ff');
        if(frame%20<10) { const aP=frame%20; for(let ai=0;ai<5;ai++) gr(ctx,cx,cy,(ai*4+aP)%W,5+(ai%3),1,1,'#ffffff'); }
        if((frame+h1)%30===0) gr(ctx,cx,cy,(h1%12)+2,4,2,1,'#eeccff');
      } else {
        gr(ctx,cx,cy,0,0,W,W,'#0c0a1c');
        gr(ctx,cx,cy,0,0,2,W,'#1a163a'); gr(ctx,cx,cy,W-2,0,2,W,'#1a163a');
        gr(ctx,cx,cy,2,0,12,W,'#100e28'); gr(ctx,cx,cy,2,7,12,2,'#1a163a');
        gr(ctx,cx,cy,7,0,2,W,'#1a163a'); gr(ctx,cx,cy,7,7,2,2,'#2a1a55');
        gr(ctx,cx,cy,0,0,W,1,acc+'44'); gr(ctx,cx,cy,0,W-1,W,1,acc+'44');
        const cY=Math.max(1,Math.min(W-2,Math.floor(5+Math.sin(t*0.8+tx)*4)));
        gr(ctx,cx,cy,8,cY,1,1,'#cc8800');
        if(Math.floor(t*4)%3===0) gr(ctx,cx,cy,8,cY-1,1,1,'#ffcc44');
      }
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DECORATIVE FLOOR (altar / crystal)
    // ─────────────────────────────────────────────────────────────────────────
    case '*': {
      gr(ctx,cx,cy,0,0,W,W,fl);
      const aOn=animFrame%2===0;
      gr(ctx,cx,cy,6,0,4,W,aOn?shiftColor(fl,15):fl); gr(ctx,cx,cy,0,6,W,4,aOn?shiftColor(fl,15):fl);
      gr(ctx,cx,cy,6,6,4,4,aOn?acc:shiftColor(acc,-40));
      if(realm===4) {
        // Gold diamond-inlaid altar with diamond grid pattern (spec)
        gr(ctx,cx,cy,0,0,W,W,'#1e1438');
        // Diamond grid: gold lines every 8px forming diamond (rotated-square) pattern
        const dAlpha=0.7+0.1*Math.sin(t*0.035); // candle-flicker period ~180f
        ctx.globalAlpha=dAlpha;
        gr(ctx,cx,cy,0,7,W,1,'#ffaa00'); gr(ctx,cx,cy,7,0,1,W,'#ffaa00');
        // Diamond center inlays
        gr(ctx,cx,cy,6,6,2,2,'#ffaa00'); gr(ctx,cx,cy,14,6,2,2,'#ffaa00');
        gr(ctx,cx,cy,6,14,2,2,'#ffaa00'); gr(ctx,cx,cy,14,14,2,2,'#ffaa00');
        ctx.globalAlpha=1;
        // Tarnished gold dots between diamonds
        gr(ctx,cx,cy,3,3,1,1,'#aa7700'); gr(ctx,cx,cy,11,3,1,1,'#aa7700');
        gr(ctx,cx,cy,3,11,1,1,'#aa7700'); gr(ctx,cx,cy,11,11,1,1,'#aa7700');
        // Shimmer sweep
        const sY=(frame*2)%W; gr(ctx,cx,cy,0,sY,W,1,'#ffcc8844');
        if(aOn) gr(ctx,cx,cy,7,7,2,2,'#ffdd55');
        // Henry proximity glow: gold tint at 10% alpha when within 3 tiles
        if(henryPos) {
          const dist=Math.abs(tx-henryPos.tx)+Math.abs(ty-henryPos.ty);
          if(dist<=3) { ctx.globalAlpha=0.1*(1-dist/4); gr(ctx,cx,cy,0,0,W,W,'#ffaa00'); ctx.globalAlpha=1; }
        }
      } else if(realm===1) { ctx.globalAlpha=0.4+0.3*Math.sin(t*2); gr(ctx,cx,cy,6,6,4,4,tH); ctx.globalAlpha=1; }
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BOSS GATE
    // ─────────────────────────────────────────────────────────────────────────
    case 'B': {
      const S=SCALE, TS=W*S;
      ctx.fillStyle='#100000'; ctx.fillRect(cx,cy,TS,TS);
      ctx.fillStyle='#2a0000'; ctx.fillRect(cx+6*S,cy,(W-12)*S,TS);
      ctx.fillStyle='#880000'; ctx.fillRect(cx+3*S,cy,(W-6)*S,2*S);
      const bP=0.3+0.3*Math.sin(t*1.8);
      ctx.fillStyle=`rgba(180,0,0,${bP})`; ctx.fillRect(cx+6*S,cy,(W-12)*S,TS);
      ctx.fillStyle='#ff0000'; ctx.fillRect(cx+7*S,cy+4*S,2*S,6*S); ctx.fillRect(cx+7*S,cy+12*S,2*S,2*S);
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TREASURE CHEST
    // ─────────────────────────────────────────────────────────────────────────
    case 'C': {
      gr(ctx,cx,cy,0,0,W,W,fl);
      const chestKey=`${realm}-${tx}-${ty}`, isOpen=SESSION_OPENED.has(chestKey);
      const cC=realm===1?'#0a5a60':realm===2?'#5a3010':realm===3?'#2a0860':'#3a2a08';
      const cH=realm===1?'#00ffcc':realm===2?'#aa6622':realm===3?'#aa44ff':'#ffcc44';
      gr(ctx,cx,cy,3,14,10,2,'#000000'); gr(ctx,cx,cy,2,8,12,8,cC); gr(ctx,cx,cy,2,8,12,1,cH); gr(ctx,cx,cy,2,8,1,8,cH);
      gr(ctx,cx,cy,6,10,4,4,'#111111'); gr(ctx,cx,cy,7,11,2,2,cH);
      if(!isOpen) {
        gr(ctx,cx,cy,2,4,12,5,cC); gr(ctx,cx,cy,2,4,12,1,cH); gr(ctx,cx,cy,2,4,1,5,cH);
        gr(ctx,cx,cy,1,8,14,1,'#000000'); gr(ctx,cx,cy,2,6,12,1,'#000000');
        gr(ctx,cx,cy,3,5,2,2,'#888888'); gr(ctx,cx,cy,11,5,2,2,'#888888');
        const gp=0.25+0.2*Math.sin(t*2.5+tx+ty); ctx.globalAlpha=gp; gr(ctx,cx,cy,0,2,W,14,cH); ctx.globalAlpha=1;
        if(animFrame%2===0) { gr(ctx,cx,cy,1,2,1,1,cH); gr(ctx,cx,cy,14,5,1,1,cH); gr(ctx,cx,cy,7,1,2,1,cH); }
      } else {
        gr(ctx,cx,cy,2,1,12,4,cC); gr(ctx,cx,cy,2,1,12,1,cH);
        const bA=0.35+0.18*Math.sin(t*3); ctx.globalAlpha=bA; gr(ctx,cx,cy,5,4,6,4,cH); ctx.globalAlpha=0.12; gr(ctx,cx,cy,4,2,8,6,cH); ctx.globalAlpha=1;
      }
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SIGN / PLACARD
    // ─────────────────────────────────────────────────────────────────────────
    case 'S': {
      gr(ctx,cx,cy,0,0,W,W,fl);
      const sC=realm===1?'#0a2a30':realm===2?'#3a1e08':realm===3?'#0a0428':'#1a0f28';
      const sB=realm===1?'#00ffcc':realm===2?'#44aa22':realm===3?'#aa44ff':'#ffaa00';
      gr(ctx,cx,cy,7,9,2,7,sC); gr(ctx,cx,cy,7,9,2,1,shiftColor(sC,20));
      gr(ctx,cx,cy,2,2,12,8,sC); gr(ctx,cx,cy,2,2,12,1,sB); gr(ctx,cx,cy,2,9,12,1,sB);
      gr(ctx,cx,cy,2,2,1,8,sB); gr(ctx,cx,cy,13,2,1,8,sB);
      gr(ctx,cx,cy,4,4,8,1,shiftColor(sB,-20)); gr(ctx,cx,cy,4,6,6,1,shiftColor(sB,-30)); gr(ctx,cx,cy,4,8,7,1,shiftColor(sB,-30));
      gr(ctx,cx,cy,3,3,1,1,'#888888'); gr(ctx,cx,cy,12,3,1,1,'#888888'); gr(ctx,cx,cy,3,8,1,1,'#888888'); gr(ctx,cx,cy,12,8,1,1,'#888888');
      const sp=0.12+0.08*Math.sin(t*1.5+tx); ctx.globalAlpha=sp; gr(ctx,cx,cy,1,1,14,10,sB); ctx.globalAlpha=1;
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LESSON NODES (1–9) and NPC floor
    // ─────────────────────────────────────────────────────────────────────────
    default:
      if (tile>='1'&&tile<='9') {
        gr(ctx,cx,cy,0,0,W,W,fl);
        const on=animFrame%2===0;
        if (realm===1) {
          gr(ctx,cx,cy,6,0,4,2,on?'#00ffcc':'#00aa88'); gr(ctx,cx,cy,4,2,8,2,on?'#00ffcc':'#00aa88');
          gr(ctx,cx,cy,2,4,12,4,on?'#00ffcc':'#00aa88'); gr(ctx,cx,cy,4,8,8,2,on?'#00ffcc':'#00aa88');
          gr(ctx,cx,cy,6,10,4,2,on?'#00ffcc':'#00aa88'); gr(ctx,cx,cy,4,2,8,8,'#001a15');
          if(on){gr(ctx,cx,cy,5,4,2,2,'#88ffee');gr(ctx,cx,cy,9,8,2,2,'#44ccaa');}
        } else if (realm===2) {
          gr(ctx,cx,cy,1,1,14,10,'#0a1a05'); gr(ctx,cx,cy,1,1,14,1,'#00cc33'); gr(ctx,cx,cy,1,1,1,10,'#00cc33');
          gr(ctx,cx,cy,3,4,on?8:6,1,'#00ff44'); gr(ctx,cx,cy,3,6,on?6:9,1,'#00cc33'); gr(ctx,cx,cy,3,8,4,1,'#00ff44');
          gr(ctx,cx,cy,5,12,6,2,'#0a1a05'); gr(ctx,cx,cy,4,11,8,2,'#00cc33');
        } else if (realm===3) {
          gr(ctx,cx,cy,5,5,6,6,'#220033'); gr(ctx,cx,cy,4,6,8,4,on?'#aa44ff':'#7722cc');
          gr(ctx,cx,cy,6,4,4,8,on?'#aa44ff':'#7722cc'); gr(ctx,cx,cy,6,6,4,4,on?'#ffffff':'#cc88ff');
          gr(ctx,cx,cy,0,7,4,2,'#440088'); gr(ctx,cx,cy,12,7,4,2,'#440088');
          gr(ctx,cx,cy,7,0,2,4,'#440088'); gr(ctx,cx,cy,7,12,2,4,'#440088');
          const rP=Math.floor(frame/15)%4, rR=3+rP, rX=8-rR, rY=8-rR;
          if(rX>=0&&rY>=0&&rX+rR*2<=W) {
            ctx.globalAlpha=0.4-rP*0.08;
            gr(ctx,cx,cy,rX,rY,rR*2,1,'#cc88ff'); gr(ctx,cx,cy,rX,rY+rR*2-1,rR*2,1,'#cc88ff');
            gr(ctx,cx,cy,rX,rY,1,rR*2,'#cc88ff'); gr(ctx,cx,cy,rX+rR*2-1,rY,1,rR*2,'#cc88ff');
            ctx.globalAlpha=1;
          }
        } else {
          gr(ctx,cx,cy,4,8,8,6,'#1a1535'); gr(ctx,cx,cy,4,8,8,1,'#4433aa');
          gr(ctx,cx,cy,5,4,6,6,on?'#ffaa00':'#cc7700'); gr(ctx,cx,cy,6,3,4,2,on?'#ffdd44':'#ffaa00');
          gr(ctx,cx,cy,7,2,2,2,'#ffffff'); gr(ctx,cx,cy,6,4,2,2,'#ffee88');
        }
        if(isCompleted) { gr(ctx,cx,cy,4,10,4,2,'#00ff88'); gr(ctx,cx,cy,7,8,2,5,'#00ff88'); }
        break;
      }
      gr(ctx,cx,cy,0,0,W,W,fl);
      break;
  }
}

// ─── NPC Sprites ─────────────────────────────────────────────────────────────

function drawElliot(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, globalFrame: number) {
  // Elliot: Cell Biology Guide — per CHARACTER_DESIGN.md spec
  // Skin #f4c08a, lab coat #d8e0f0, glasses #00ccdd, LEFT sock RED #cc2200, RIGHT sock YELLOW #ddcc00
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const legShift = globalFrame % 2 === 1 ? 1 : 0;
  const headBob  = (globalFrame % 90) < 45 ? 0 : -1;
  const eyeH     = (globalFrame % 120) < 6 ? 1 : 2;

  // HEAD — warm tan skin #f4c08a
  gr2(ctx, ox, oy, 10, 0 + headBob, 12, 12, '#f4c08a');
  // Skin shadow on sides
  gr2(ctx, ox, oy, 10, 2 + headBob, 2, 8, '#c88040');
  gr2(ctx, ox, oy, 20, 2 + headBob, 2, 8, '#c88040');

  // HAIR — dark brown #2a1a0a, curly. Crown base + two 3×3 poofs upward
  gr2(ctx, ox, oy, 10,  0 + headBob, 12,  4, '#2a1a0a'); // crown base
  gr2(ctx, ox, oy,  8, -3 + headBob,  3,  3, '#2a1a0a'); // upper-left poof (3×3)
  gr2(ctx, ox, oy, 21, -3 + headBob,  3,  3, '#2a1a0a'); // upper-right poof (3×3)
  gr2(ctx, ox, oy,  8,  0 + headBob,  2,  4, '#5a3a18'); // left-side curl
  gr2(ctx, ox, oy, 22,  0 + headBob,  2,  4, '#5a3a18'); // right-side curl

  // GLASSES — cyan #00ccdd, 3×2 each lens, bridge 1×1 center
  gr2(ctx, ox, oy, 11, 5 + headBob, 3, 2, '#00ccdd'); // left lens
  gr2(ctx, ox, oy, 18, 5 + headBob, 3, 2, '#00ccdd'); // right lens
  gr2(ctx, ox, oy, 14, 5 + headBob, 4, 1, '#00ccdd'); // frame top
  gr2(ctx, ox, oy, 15, 5 + headBob, 2, 1, '#888888'); // nose bridge center

  // EYES behind glasses — dark pupils with 1×1 white highlight
  gr2(ctx, ox, oy, 12, 4 + headBob, 2, eyeH, '#1a1a1a');
  gr2(ctx, ox, oy, 18, 4 + headBob, 2, eyeH, '#1a1a1a');
  gr2(ctx, ox, oy, 13, 4 + headBob, 1, 1, '#ffffff'); // left highlight
  gr2(ctx, ox, oy, 19, 4 + headBob, 1, 1, '#ffffff'); // right highlight

  // EYEBROWS — 1px lines, slightly angled inward toward center
  gr2(ctx, ox, oy, 12, 3 + headBob, 2, 1, '#2a1a0a');
  gr2(ctx, ox, oy, 18, 3 + headBob, 2, 1, '#2a1a0a');
  gr2(ctx, ox, oy, 11, 4 + headBob, 1, 1, '#2a1a0a'); // angled outer

  // NOSE & MOUTH
  gr2(ctx, ox, oy, 15, 7 + headBob, 2, 1, '#c88040');
  gr2(ctx, ox, oy, 14, 9 + headBob, 4, 1, '#8b4513'); // small 2px smile

  // NECK — pale yellow shirt visible #f8f0c8
  gr2(ctx, ox, oy, 14, 12, 4, 3, '#f8f0c8');

  // SHOULDERS (lab coat #d8e0f0)
  gr2(ctx, ox, oy, 6, 14, 20, 4, '#d8e0f0');
  gr2(ctx, ox, oy, 6, 14, 3, 4, '#a0aac0'); // left shoulder shadow
  gr2(ctx, ox, oy, 23, 14, 3, 4, '#a0aac0'); // right shoulder shadow

  // TORSO (lab coat)
  gr2(ctx, ox, oy, 8, 17, 16, 10, '#d8e0f0');
  gr2(ctx, ox, oy, 8, 17, 2, 10, '#a0aac0');  // left edge shadow
  gr2(ctx, ox, oy, 22, 17, 2, 10, '#a0aac0'); // right edge shadow
  // Coat lapels — V-shape, pale yellow shirt visible in V
  gr2(ctx, ox, oy, 12, 17, 4, 5, '#f8f0c8'); // V shirt visible
  gr2(ctx, ox, oy, 11, 17, 2, 5, '#f0f8ff'); // left lapel white
  gr2(ctx, ox, oy, 19, 17, 2, 5, '#f0f8ff'); // right lapel white
  // Buttons down center
  gr2(ctx, ox, oy, 15, 19, 2, 1, '#a0aac0');
  gr2(ctx, ox, oy, 15, 22, 2, 1, '#a0aac0');
  gr2(ctx, ox, oy, 15, 25, 2, 1, '#a0aac0');
  // Chest pocket (left breast, 4×3) with blue pen #0044aa
  gr2(ctx, ox, oy, 10, 20, 4, 3, '#a0aac0');
  gr2(ctx, ox, oy, 11, 19, 1, 4, '#0044aa'); // blue pen visible above pocket

  // ARMS (lab coat sleeves)
  gr2(ctx, ox, oy,  4, 15, 4, 14, '#d8e0f0');
  gr2(ctx, ox, oy, 24, 15, 4, 14, '#d8e0f0');

  // HANDS (skin #f4c08a, 4×3 mitten)
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#f4c08a');
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#f4c08a');

  // BELT at waist — dark line #4a3020 with 3×2 buckle
  gr2(ctx, ox, oy, 9, 27, 14, 2, '#4a3020');
  gr2(ctx, ox, oy, 14, 27, 3, 2, '#888866'); // buckle

  // HIPS (gray-blue pants #6a7888)
  gr2(ctx, ox, oy, 9, 29, 14, 2, '#6a7888');

  // LEGS — gray-blue pants #6a7888
  gr2(ctx, ox, oy,  9, 30 - legShift, 6, 5, '#6a7888'); // left upper leg
  gr2(ctx, ox, oy, 17, 30 + legShift, 6, 5, '#6a7888'); // right upper leg
  gr2(ctx, ox, oy,  9, 33 - legShift, 6, 2, '#4a5868'); // left shadow
  gr2(ctx, ox, oy, 17, 33 + legShift, 6, 2, '#4a5868'); // right shadow

  // SOCKS — LEFT=RED #cc2200, RIGHT=YELLOW #ddcc00 (non-negotiable per spec)
  gr2(ctx, ox, oy,  9, 35 - legShift, 6, 3, '#cc2200'); // LEFT SOCK RED
  gr2(ctx, ox, oy, 17, 35 + legShift, 6, 3, '#ddcc00'); // RIGHT SOCK YELLOW

  // SHOES — dark gray #2a2a36
  gr2(ctx, ox, oy,  8, 38 - legShift, 7, 3, '#2a2a36');
  gr2(ctx, ox, oy, 16, 38 + legShift, 7, 3, '#2a2a36');
}

function drawBen(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, frame: number) {
  // Ben: Bioinformatics Guide — per CHARACTER_DESIGN.md spec
  // Skin #c89060, hoodie #2a6020, flat-top hair #1a0a00, sandwich in RIGHT hand, cargo pants #6a7030, shoes #3a1e0a
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const legShift    = frame % 2 === 1 ? 1 : 0;
  const sandwichBob = frame % 2 === 1 ? -1 : 0; // sandwich bobs up on frame 1

  // HEAD — warm medium brown #c89060, slightly square 11×12
  gr2(ctx, ox, oy, 10, 0, 11, 12, '#c89060');
  gr2(ctx, ox, oy, 10, 2, 2, 8, '#9a6030'); // left shadow
  gr2(ctx, ox, oy, 19, 2, 2, 8, '#9a6030'); // right shadow

  // HAIR — near-black #1a0a00, flat-top: perfectly flat 6×2 block on crown, short sides
  gr2(ctx, ox, oy, 10, 0, 11, 3, '#1a0a00'); // full top
  gr2(ctx, ox, oy, 12, 0,  7, 2, '#1a0a00'); // flat-top block (perfectly flat top)
  gr2(ctx, ox, oy, 10, 0,  2, 4, '#1a0a00'); // left short side
  gr2(ctx, ox, oy, 19, 0,  2, 4, '#1a0a00'); // right short side

  // EYEBROWS — flat, slightly thick 2×1
  gr2(ctx, ox, oy, 11, 4, 2, 1, '#1a0a00');
  gr2(ctx, ox, oy, 18, 4, 2, 1, '#1a0a00');

  // EYES — relaxed squinting (always smiling look), 2×2
  gr2(ctx, ox, oy, 11, 5, 2, 2, '#2a1a0a');
  gr2(ctx, ox, oy, 18, 5, 2, 2, '#2a1a0a');
  gr2(ctx, ox, oy, 12, 5, 1, 1, '#ffffff'); // left highlight
  gr2(ctx, ox, oy, 19, 5, 1, 1, '#ffffff'); // right highlight

  // NOSE
  gr2(ctx, ox, oy, 15, 7, 2, 2, '#9a6030');

  // MOUTH — relaxed wide smile
  gr2(ctx, ox, oy, 13, 9, 5, 1, '#2a1a00'); // base
  gr2(ctx, ox, oy, 12, 9, 1, 1, '#2a1a00'); // left corner
  gr2(ctx, ox, oy, 18, 9, 1, 1, '#2a1a00'); // right corner

  // NECK
  gr2(ctx, ox, oy, 14, 12, 4, 3, '#c89060');

  // SHOULDERS (hoodie #2a6020)
  gr2(ctx, ox, oy, 6, 14, 20, 4, '#2a6020');
  gr2(ctx, ox, oy, 6, 14, 3, 4, '#1a4010'); // left shadow
  gr2(ctx, ox, oy, 23, 14, 3, 4, '#1a4010'); // right shadow

  // TORSO (hoodie #2a6020)
  gr2(ctx, ox, oy, 8, 17, 16, 10, '#2a6020');
  gr2(ctx, ox, oy, 8, 17, 2, 10, '#1a4010'); // left shadow
  gr2(ctx, ox, oy, 22, 17, 2, 10, '#1a4010'); // right shadow
  // Kangaroo pocket — 10×4, same green with 1px darker border
  gr2(ctx, ox, oy, 11, 20, 10, 4, '#1a4010'); // pocket border
  gr2(ctx, ox, oy, 12, 21,  8, 2, '#2a6020'); // pocket interior
  // Drawstrings — two 1px vertical lines, light green #44aa44
  gr2(ctx, ox, oy, 14, 16, 1, 6, '#44aa44');
  gr2(ctx, ox, oy, 17, 16, 1, 6, '#44aa44');

  // ARMS (hoodie sleeves)
  gr2(ctx, ox, oy,  4, 15, 4, 14, '#2a6020');
  gr2(ctx, ox, oy, 24, 15, 4, 14, '#2a6020');

  // HANDS (skin #c89060)
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#c89060'); // left hand
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#c89060'); // right hand

  // SANDWICH — RIGHT hand, per spec: bread #c89040, lettuce #44aa00, tomato #cc2222, cheese #eecc22, top bread #c89040
  const sandY = 22 + sandwichBob;
  gr2(ctx, ox, oy, 25, sandY,     10, 1, '#c89040'); // top bread
  gr2(ctx, ox, oy, 25, sandY + 1, 10, 1, '#44aa00'); // lettuce
  gr2(ctx, ox, oy, 25, sandY + 2, 10, 1, '#cc2222'); // tomato
  gr2(ctx, ox, oy, 25, sandY + 3, 10, 1, '#eecc22'); // cheese
  gr2(ctx, ox, oy, 25, sandY + 4, 10, 1, '#c89040'); // bottom bread

  // HIPS (olive cargo pants #6a7030) + belt
  gr2(ctx, ox, oy, 9, 27, 14, 2, '#2a1a00'); // belt
  gr2(ctx, ox, oy, 9, 29, 14, 2, '#6a7030'); // hips

  // LEGS — olive green cargo pants #6a7030
  gr2(ctx, ox, oy,  9, 30 - legShift, 6, 8, '#6a7030');
  gr2(ctx, ox, oy, 17, 30 + legShift, 6, 8, '#6a7030');
  // Cargo pocket on right leg — 4×5 with 1px border
  gr2(ctx, ox, oy, 18, 31 + legShift, 4, 5, '#4a5018'); // border
  gr2(ctx, ox, oy, 19, 32 + legShift, 2, 3, '#6a7030'); // interior
  // Left leg shadow
  gr2(ctx, ox, oy,  9, 34 - legShift, 6, 2, '#4a5018');
  gr2(ctx, ox, oy, 17, 34 + legShift, 6, 2, '#4a5018');

  // SHOES — dark brown #3a1e0a (NOT white — spec is very clear)
  gr2(ctx, ox, oy,  8, 38 - legShift, 7, 3, '#3a1e0a');
  gr2(ctx, ox, oy, 16, 38 + legShift, 7, 3, '#3a1e0a');
  // Slight toe rounding
  gr2(ctx, ox, oy,  8, 38 - legShift, 1, 1, '#4a2e1a');
  gr2(ctx, ox, oy, 16, 38 + legShift, 1, 1, '#4a2e1a');
}

function drawAlex(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, frame: number) {
  // Alex: ML/AI Guide — per CHARACTER_DESIGN.md spec
  // Skin #e8b888, turtleneck #0a0a14, angular hair #0a0610, coffee cup in RIGHT hand with steam
  // Everything below turtleneck is black. Spec: "unified dark lower body"
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const legShift = frame % 2 === 1 ? 1 : 0;
  const steamOff = Math.floor(frame * 0.12) % 3;

  // HEAD — light warm #e8b888, angular 11×13 (slightly longer face)
  gr2(ctx, ox, oy, 10, 0, 11, 13, '#e8b888');
  gr2(ctx, ox, oy, 10, 2, 2, 9, '#b87840');
  gr2(ctx, ox, oy, 19, 2, 2, 9, '#b87840');

  // HAIR — very dark brown #0a0610, swept-back angular, forward bang
  gr2(ctx, ox, oy,  9, -1, 13, 4, '#0a0610');
  gr2(ctx, ox, oy,  9,  0,  4, 5, '#0a0610');
  gr2(ctx, ox, oy,  9,  3,  5, 2, '#0a0610'); // forward bang over left eye
  gr2(ctx, ox, oy, 10, -1,  8, 1, '#1a1a2a'); // highlight

  // EYEBROWS — thick, angled inward, 3×1 each
  gr2(ctx, ox, oy, 11, 4, 3, 1, '#0a0610');
  gr2(ctx, ox, oy, 17, 4, 3, 1, '#0a0610');
  gr2(ctx, ox, oy, 13, 3, 1, 1, '#0a0610');
  gr2(ctx, ox, oy, 17, 3, 1, 1, '#0a0610');

  // EYES — sharp pupils with eye specular #c0d0ff
  gr2(ctx, ox, oy, 11, 5, 3, 2, '#0a0610');
  gr2(ctx, ox, oy, 17, 5, 3, 2, '#0a0610');
  gr2(ctx, ox, oy, 12, 5, 1, 1, '#c0d0ff');
  gr2(ctx, ox, oy, 18, 5, 1, 1, '#c0d0ff');

  // NOSE
  gr2(ctx, ox, oy, 15, 8, 2, 1, '#b87840');

  // MOUTH — thin pursed line
  gr2(ctx, ox, oy, 14, 10, 3, 1, '#1a0800');

  // TURTLENECK COLLAR — high, rises to chin
  gr2(ctx, ox, oy, 11, 10, 10, 5, '#0a0a14');
  gr2(ctx, ox, oy, 12, 10,  8, 2, '#1a1a2a');

  // NECK
  gr2(ctx, ox, oy, 14, 12, 4, 3, '#0a0a14');

  // SHOULDERS
  gr2(ctx, ox, oy, 6, 14, 20, 4, '#0a0a14');
  gr2(ctx, ox, oy, 8, 14,  3, 2, '#1a1a2a');

  // TORSO — clean minimal silhouette
  gr2(ctx, ox, oy, 8, 17, 16, 10, '#0a0a14');
  gr2(ctx, ox, oy, 8, 17,  2, 10, '#000000');
  gr2(ctx, ox, oy, 22, 17, 2, 10, '#000000');

  // ARMS
  gr2(ctx, ox, oy,  4, 15, 4, 14, '#0a0a14');
  gr2(ctx, ox, oy, 24, 15, 4, 14, '#0a0a14');

  // HANDS
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#e8b888');
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#e8b888');

  // COFFEE CUP — RIGHT hand per spec, white #f0f0f0 body, black band #303040, handle #909090
  const cupX = 25;
  const cupY = 19;
  gr2(ctx, ox, oy, cupX,     cupY,     8, 1, '#909090'); // lid
  gr2(ctx, ox, oy, cupX + 1, cupY,     6, 1, '#606060');
  gr2(ctx, ox, oy, cupX,     cupY + 1, 8, 4, '#f0f0f0'); // upper body
  gr2(ctx, ox, oy, cupX + 2, cupY + 2, 4, 1, '#e8a000'); // coffee at top
  gr2(ctx, ox, oy, cupX,     cupY + 5, 8, 1, '#303040'); // black band
  gr2(ctx, ox, oy, cupX,     cupY + 6, 8, 3, '#f0f0f0'); // lower body
  gr2(ctx, ox, oy, cupX + 8, cupY + 2, 3, 1, '#909090'); // handle top
  gr2(ctx, ox, oy, cupX + 8, cupY + 5, 3, 1, '#909090'); // handle bottom
  gr2(ctx, ox, oy, cupX + 10, cupY + 2, 1, 4, '#909090'); // handle right
  // Steam — animated 1px lines
  gr2(ctx, ox, oy, cupX + 2 + steamOff, cupY - 2, 1, 2, '#ffffff');
  gr2(ctx, ox, oy, cupX + 5 - steamOff, cupY - 3, 1, 2, '#ffffff');
  gr2(ctx, ox, oy, cupX + 4,            cupY - 1 - steamOff, 1, 1, '#ffffff');

  // HIPS + LEGS + SHOES — all black per spec
  gr2(ctx, ox, oy, 9, 27, 14, 3, '#0a0a14');
  gr2(ctx, ox, oy, 10, 30 - legShift, 5, 8, '#0a0a14');
  gr2(ctx, ox, oy, 17, 30 + legShift, 5, 8, '#0a0a14');
  gr2(ctx, ox, oy,  9, 38 - legShift, 7, 3, '#1a0800');
  gr2(ctx, ox, oy, 16, 38 + legShift, 7, 3, '#1a0800');
}

function drawHenry(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: Dir, frame: number) {
  // Henry: Holographic AI Mentor — per CHARACTER_DESIGN.md spec
  // Base #d0f0ff, jacket #b0d8f8, circuit traces #00aaff, 4 orbiting orbs #44ddff with #aaffff inner
  // Alpha 0.7 + sin(frame*0.05)*0.125, scanline glitch random column every 4 frames, orbs at 0.03 speed
  const ox = cx - 8 * SCALE;
  const oy = cy - 16 * SCALE;

  const baseAlpha = 0.7 + Math.sin(frame * 0.05) * 0.125;

  // OUTER GLOW
  ctx.globalAlpha = baseAlpha * 0.15;
  gr2(ctx, ox, oy, 6, -2, 20, 47, '#44ddff');

  ctx.globalAlpha = baseAlpha;

  // HEAD — blue-white holographic #d0f0ff, perfectly symmetrical
  gr2(ctx, ox, oy, 11, 0, 10, 11, '#d0f0ff');
  gr2(ctx, ox, oy, 11, 1,  2,  9, '#90b8e8');
  gr2(ctx, ox, oy, 19, 1,  2,  9, '#90b8e8');
  // Circuit traces on scalp #00aaff (right-angle patterns)
  gr2(ctx, ox, oy, 13, 0, 4, 1, '#00aaff');
  gr2(ctx, ox, oy, 16, 0, 1, 3, '#00aaff');
  gr2(ctx, ox, oy, 11, 2, 3, 1, '#00aaff');
  // L-shaped trace on left cheek
  gr2(ctx, ox, oy, 12, 7, 2, 1, '#00aaff');
  gr2(ctx, ox, oy, 12, 7, 1, 2, '#00aaff');

  // EYES — white circles #ffffff, no pupils at rest
  gr2(ctx, ox, oy, 12, 4, 3, 3, '#ffffff');
  gr2(ctx, ox, oy, 17, 4, 3, 3, '#ffffff');
  gr2(ctx, ox, oy, 13, 5, 1, 1, '#60c8f8');
  gr2(ctx, ox, oy, 18, 5, 1, 1, '#60c8f8');

  // MOUTH — white line, slightly upturned (almost always smiling)
  gr2(ctx, ox, oy, 13, 9, 6, 1, '#ffffff');
  gr2(ctx, ox, oy, 12, 8, 1, 1, '#ffffff');
  gr2(ctx, ox, oy, 19, 8, 1, 1, '#ffffff');

  // NECK
  gr2(ctx, ox, oy, 14, 11, 4, 4, '#b0d8f8');

  // SHOULDERS + JACKET #b0d8f8, lapels
  gr2(ctx, ox, oy, 6, 14, 20, 4, '#b0d8f8');
  gr2(ctx, ox, oy, 6, 14,  3, 4, '#90b8e8');
  gr2(ctx, ox, oy, 23, 14, 3, 4, '#90b8e8');
  gr2(ctx, ox, oy, 12, 14, 3, 5, '#d0f0ff'); // left lapel
  gr2(ctx, ox, oy, 17, 14, 3, 5, '#d0f0ff'); // right lapel

  // TORSO — jacket
  gr2(ctx, ox, oy, 8, 17, 16, 10, '#b0d8f8');
  gr2(ctx, ox, oy, 8, 17,  2, 10, '#90b8e8');
  gr2(ctx, ox, oy, 22, 17, 2, 10, '#90b8e8');
  // Circuit traces on chest #00aaff
  gr2(ctx, ox, oy,  9, 19, 4, 1, '#00aaff');
  gr2(ctx, ox, oy,  9, 19, 1, 4, '#00aaff');
  gr2(ctx, ox, oy, 12, 22, 4, 1, '#00aaff');
  gr2(ctx, ox, oy, 15, 20, 1, 3, '#00aaff');
  gr2(ctx, ox, oy, 18, 18, 4, 1, '#00aaff');
  gr2(ctx, ox, oy, 21, 18, 1, 4, '#00aaff');
  gr2(ctx, ox, oy, 10, 24, 3, 1, '#00aaff');
  gr2(ctx, ox, oy, 17, 24, 1, 3, '#00aaff');

  // ARMS
  gr2(ctx, ox, oy,  4, 15, 4, 14, '#90b8e8');
  gr2(ctx, ox, oy, 24, 15, 4, 14, '#90b8e8');

  // HANDS
  gr2(ctx, ox, oy,  3, 28, 5, 3, '#d0f0ff');
  gr2(ctx, ox, oy, 24, 28, 5, 3, '#d0f0ff');

  // HIPS + LEGS
  gr2(ctx, ox, oy, 9, 27, 14, 3, '#b0d8f8');
  gr2(ctx, ox, oy,  9, 30, 6, 8, '#b0d8f8');
  gr2(ctx, ox, oy, 17, 30, 6, 8, '#b0d8f8');

  // FEET — lower alpha (fade at extremities per spec)
  ctx.globalAlpha = baseAlpha * 0.5;
  gr2(ctx, ox, oy,  8, 38, 7, 3, '#90b8e8');
  gr2(ctx, ox, oy, 16, 38, 7, 3, '#90b8e8');
  ctx.globalAlpha = baseAlpha;

  // SCANLINE GLITCH — every 4 frames, random column, alpha 0.3 per spec
  if (frame % 4 === 0) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    const glitchCol = (Math.floor(frame * 7.3) % 10) * SCALE;
    ctx.fillRect(ox + glitchCol, oy, SCALE, 42 * SCALE);
    ctx.globalAlpha = baseAlpha;
  }

  // 4 ORBITING ORBS — #44ddff (3×3), inner #aaffff (1×1), speed 0.03 per spec
  const ht = frame * 0.03;
  const henryOrbs = [
    { dx: Math.round(16 + 10 * Math.cos(ht)),                   dy: Math.round(20 + 8 * Math.sin(ht)) },
    { dx: Math.round(16 + 10 * Math.cos(ht + Math.PI)),         dy: Math.round(20 + 8 * Math.sin(ht + Math.PI)) },
    { dx: Math.round(16 + 10 * Math.cos(ht + Math.PI / 2)),     dy: Math.round(20 + 8 * Math.sin(ht + Math.PI / 2)) },
    { dx: Math.round(16 + 10 * Math.cos(ht + 3 * Math.PI / 2)), dy: Math.round(20 + 8 * Math.sin(ht + 3 * Math.PI / 2)) },
  ];
  ctx.globalAlpha = 0.8;
  for (const orb of henryOrbs) {
    gr2(ctx, ox, oy, orb.dx, orb.dy, 3, 3, '#44ddff');
    gr2(ctx, ox, oy, orb.dx + 1, orb.dy + 1, 1, 1, '#aaffff');
  }

  ctx.globalAlpha = 1;
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  dir: Dir,
  frame: number,
  skinColor: string,
  clothColor: string,
  hairColor: string,
  pose: string = 'walk',
  globalFrame: number = 0
) {
  const ox = cx - 8 * SCALE;

  // Pose-based Y offset and body color
  let poseYOff = 0;
  let effectiveClothColor = clothColor;

  if (pose === 'idle') {
    poseYOff = (globalFrame % 60) < 30 ? 0 : -1;
  } else if (pose === 'celebrate') {
    poseYOff = globalFrame % 2 === 0 ? -2 : 0;
  } else if (pose === 'hurt') {
    effectiveClothColor = globalFrame % 2 === 1 ? '#ff4444' : clothColor;
  }

  const oy = cy - 16 * SCALE + poseYOff * SCALE;

  let legShift = 0;
  if (pose === 'walk') {
    legShift = frame === 1 ? 1 : 0;
  } else if (pose === 'run') {
    legShift = frame === 1 ? 2 : -1;
  }

  const legColor = shiftColor(effectiveClothColor, -30);

  // HEAD (skin + 1-px dark outline via slightly larger dark block behind)
  gr2(ctx, ox, oy,  9, -1, 14, 14, shiftColor(skinColor, -50)); // outline block
  gr2(ctx, ox, oy, 10,  0, 12, 12, skinColor);                  // fill

  // HAIR & FACE (direction-aware)
  if (dir === 'up') {
    // Back of head — hair covers top 8 rows, no face visible
    gr2(ctx, ox, oy, 10, 0, 12, 8, hairColor);
  } else if (dir === 'down') {
    // Hair on top (14×4 above head)
    gr2(ctx, ox, oy, 9, -1, 14, 4, hairColor);
    // Two eyes
    gr2(ctx, ox, oy, 12, 4, 2, 2, '#1a1a1a');
    gr2(ctx, ox, oy, 18, 4, 2, 2, '#1a1a1a');
    // Nose
    gr2(ctx, ox, oy, 15, 7, 2, 1, shiftColor(skinColor, -20));
    // Mouth
    gr2(ctx, ox, oy, 13, 9, 4, 1, shiftColor(skinColor, -40));
  } else if (dir === 'left') {
    // Profile facing left — hair on right side (back of head), left eye visible
    gr2(ctx, ox, oy, 15, 0, 7, 8, hairColor);
    gr2(ctx, ox, oy, 10, 4, 2, 2, '#1a1a1a'); // left eye at dx=10
    gr2(ctx, ox, oy, 10, 7, 2, 1, shiftColor(skinColor, -20)); // nose
    gr2(ctx, ox, oy, 10, 9, 3, 1, shiftColor(skinColor, -40)); // mouth
  } else {
    // Profile facing right — hair on left side, right eye visible
    gr2(ctx, ox, oy, 10, 0, 7, 8, hairColor);
    gr2(ctx, ox, oy, 18, 4, 2, 2, '#1a1a1a'); // right eye at dx=18
    gr2(ctx, ox, oy, 18, 7, 2, 1, shiftColor(skinColor, -20)); // nose
    gr2(ctx, ox, oy, 17, 9, 3, 1, shiftColor(skinColor, -40)); // mouth
  }

  // NECK
  gr2(ctx, ox, oy, 14, 12, 4, 3, skinColor);

  // SHOULDERS
  gr2(ctx, ox, oy, 6, 15, 20, 3, effectiveClothColor);

  // TORSO
  gr2(ctx, ox, oy, 8, 17, 16, 10, effectiveClothColor);

  // ARMS & HANDS (pose-aware)
  if (pose === 'celebrate') {
    gr2(ctx, ox, oy,  0,  8, 4, 10, effectiveClothColor); // left arm raised
    gr2(ctx, ox, oy, 28,  8, 4, 10, effectiveClothColor); // right arm raised
    gr2(ctx, ox, oy,  0,  5, 5,  3, skinColor);            // left hand up
    gr2(ctx, ox, oy, 27,  5, 5,  3, skinColor);            // right hand up
  } else if (pose === 'run') {
    const runSwing = (globalFrame % 16) < 8 ? -2 : 2;
    gr2(ctx, ox, oy,  4, 15 + runSwing, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy, 24, 15 - runSwing, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy,  3, 28 + runSwing, 5,  3, skinColor);
    gr2(ctx, ox, oy, 24, 28 - runSwing, 5,  3, skinColor);
  } else {
    gr2(ctx, ox, oy,  4, 15, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy, 24, 15, 4, 13, effectiveClothColor);
    gr2(ctx, ox, oy,  3, 28, 5,  3, skinColor);
    gr2(ctx, ox, oy, 24, 28, 5,  3, skinColor);
  }

  // HIPS
  gr2(ctx, ox, oy, 9, 27, 14, 3, legColor);

  // LEGS
  if (pose === 'celebrate') {
    gr2(ctx, ox, oy,  9, 30, 6, 8, legColor);
    gr2(ctx, ox, oy, 17, 30, 6, 8, legColor);
  } else {
    gr2(ctx, ox, oy,  9, 30 - legShift, 6, 8, legColor);
    gr2(ctx, ox, oy, 17, 30 + legShift, 6, 8, legColor);
  }

  // FEET/SHOES
  const fShift = pose === 'celebrate' ? 0 : legShift;
  gr2(ctx, ox, oy,  8, 38 - fShift, 7, 3, '#333333');
  gr2(ctx, ox, oy, 16, 38 + fShift, 7, 3, '#333333');
}

/** Convenience: draw game-pixel rect from local offset inside sprite origin. */
function gr2(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number,
  gx: number, gy: number,
  gw: number, gh: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(ox + gx * SCALE, oy + gy * SCALE, gw * SCALE, gh * SCALE);
}

// ─── Colour utility ───────────────────────────────────────────────────────────
function shiftColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return `#${clamp(r + amount).toString(16).padStart(2, '0')}${clamp(g + amount).toString(16).padStart(2, '0')}${clamp(b + amount).toString(16).padStart(2, '0')}`;
}

// ─── Particle System ─────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}
const particles: Particle[] = [];

function spawnParticles(x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    if (particles.length >= 50) particles.shift();
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 30 + Math.floor(Math.random() * 30),
      maxLife: 60,
      color,
      size: 1 + Math.floor(Math.random() * 2),
    });
  }
}

function drawParticles(ctx: CanvasRenderingContext2D) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life--;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size * SCALE, p.size * SCALE);
  }
  ctx.globalAlpha = 1;
}

// ─── Cherry Blossom Petals (Realm 2) ─────────────────────────────────────────
interface Petal {
  wx: number; wy: number;   // world-space canvas X/Y
  timer: number;            // increments each frame
}
const blossomPetals: Petal[] = [];

// ─── Acid Bubble System (Realm 1 ~) ──────────────────────────────────────────
interface AcidBubble {
  wx: number; wy: number;   // canvas px, absolute
  r: number;                // radius in canvas px
  age: number;              // 0 → 20
  maxAge: number;
}
const acidBubbles: AcidBubble[] = [];
let acidBubbleTimer = 0;

function updateAcidBubbles(acidTileCanvasPositions: Array<{cx:number;cy:number}>, frame: number) {
  // Spawn a bubble every 30 frames if there are acid tiles visible
  acidBubbleTimer++;
  if (acidBubbleTimer >= 30 && acidTileCanvasPositions.length > 0) {
    acidBubbleTimer = 0;
    const tile = acidTileCanvasPositions[Math.floor(Math.random() * acidTileCanvasPositions.length)];
    acidBubbles.push({
      wx: tile.cx + 2 + Math.random() * (TILE * SCALE - 4),
      wy: tile.cy + TILE * SCALE - 4,
      r: 2 + Math.floor(Math.random() * 3),
      age: 0,
      maxAge: 20,
    });
    if (acidBubbles.length > 20) acidBubbles.shift();
  }
  // Move bubbles up
  for (const b of acidBubbles) b.age++;
  // Remove finished bubbles
  for (let i = acidBubbles.length - 1; i >= 0; i--) {
    if (acidBubbles[i].age >= acidBubbles[i].maxAge) acidBubbles.splice(i, 1);
  }
  // Green flash every 45 frames
  if (frame % 45 === 0) {
    const flashTile = acidTileCanvasPositions[Math.floor(Math.random() * acidTileCanvasPositions.length)];
    if (flashTile) {
      acidBubbles.push({ wx: flashTile.cx + 4 + Math.random() * (TILE*SCALE-8), wy: flashTile.cy + 2, r: 1, age: 0, maxAge: 3 });
    }
  }
}

function drawAcidBubbles(ctx: CanvasRenderingContext2D) {
  for (const b of acidBubbles) {
    const progress = b.age / b.maxAge;
    const y = b.wy - progress * (TILE * SCALE - 4);
    const alpha = progress < 0.8 ? 0.6 : 0.6 * (1 - (progress - 0.8) / 0.2);
    if (b.age === b.maxAge - 1) {
      // Pop: draw star burst
      ctx.fillStyle = `rgba(136,255,0,${alpha})`;
      ctx.fillRect(b.wx - 3, y - 3, 3, 3); ctx.fillRect(b.wx + 1, y - 3, 3, 3);
      ctx.fillRect(b.wx - 3, y + 1, 3, 3); ctx.fillRect(b.wx + 1, y + 1, 3, 3);
    } else {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#55ff55';
      ctx.beginPath(); ctx.arc(b.wx, y, b.r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = '#88ff88'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(b.wx, y, b.r, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

// ─── Nebula Drift Particles (Realm 3 void) ───────────────────────────────────
interface DriftParticle {
  x: number; y: number;     // canvas px
  vx: number; vy: number;   // canvas px/frame
  trailX: number[]; trailY: number[];
}
const nebulaDrift: DriftParticle[] = [];

function initNebulaDrift(CW: number, CH: number) {
  if (nebulaDrift.length > 0) return;
  for (let i = 0; i < 18; i++) {
    nebulaDrift.push({
      x: Math.random() * CW,
      y: Math.random() * CH,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      trailX: [], trailY: [],
    });
  }
}

function updateNebulaDrift(CW: number, CH: number) {
  for (const p of nebulaDrift) {
    p.trailX.push(p.x); p.trailY.push(p.y);
    if (p.trailX.length > 3) { p.trailX.shift(); p.trailY.shift(); }
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > CW) p.vx *= -1;
    if (p.y < 0 || p.y > CH) p.vy *= -1;
  }
}

function drawNebulaDrift(ctx: CanvasRenderingContext2D) {
  const alphas = [0.10, 0.20, 0.30];
  for (const p of nebulaDrift) {
    for (let t = 0; t < p.trailX.length; t++) {
      ctx.globalAlpha = alphas[t] ?? 0.10;
      ctx.fillStyle = '#aa44ff';
      ctx.fillRect(Math.round(p.trailX[t]) - 1, Math.round(p.trailY[t]) - 1, 4, 4);
    }
    ctx.globalAlpha = 0.40;
    ctx.fillStyle = '#aa44ff';
    ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 4, 4);
  }
  ctx.globalAlpha = 1;
}

// ─── Enzyme overworld companion ────────────────────────────────────────────────
// Rolling position history so Enzyme trails the player naturally
const ENZYME_LAG = 20; // frames behind
const playerPosHistory: { x: number; y: number }[] = [];

function pushPosHistory(px: number, py: number) {
  playerPosHistory.push({ x: px, y: py });
  if (playerPosHistory.length > ENZYME_LAG + 4) playerPosHistory.shift();
}

function getEnzymePos(interpPX: number, interpPY: number) {
  if (playerPosHistory.length < ENZYME_LAG) return { x: interpPX - 1.5, y: interpPY + 0.5 };
  const h = playerPosHistory[playerPosHistory.length - ENZYME_LAG];
  return { x: h.x - 0.5, y: h.y + 0.5 };
}

function drawEnzymeCompanion(
  ctx: CanvasRenderingContext2D,
  sx: number, sy: number,   // screen pixel position (center of tile)
  globalFrame: number
) {
  // White cat, ~16×20 game pixels, SCALE=3
  const S = SCALE;
  const f = globalFrame;
  const bob = Math.floor(f / 30) % 2 === 0 ? 0 : -1;    // idle head bob
  const tailSwing = Math.round(Math.sin(f * 0.12) * 2);  // tail wag
  const blinkOpen = (f % 80) < 74;
  const eyeH = blinkOpen ? 2 : 1;

  // ox/oy: top-left of 16-wide sprite centred on sx
  const ox = Math.round(sx - 8 * S);
  const oy = Math.round(sy - 14 * S);

  const r = (gx: number, gy: number, gw: number, gh: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox + gx * S, oy + gy * S, gw * S, gh * S);
  };

  // TAIL (behind body, draw first)
  r(0, 10 + tailSwing, 3, 2, '#e8e8e8');
  r(0,  8 + tailSwing, 2, 3, '#e8e8e8');

  // BODY (14×8)
  r(2, 8, 12, 8, '#f0f0f0');
  r(3, 7, 10, 2, '#f0f0f0'); // shoulder rise

  // HEAD (10×9, slightly offset up)
  r(3, bob - 1, 10, 9, '#f0f0f0');

  // EARS (2×3 each, triangular)
  r(3, bob - 3, 2, 3, '#f0f0f0');
  r(11, bob - 3, 2, 3, '#f0f0f0');
  r(3, bob - 3, 1, 2, '#ffb3c6'); // inner ear pink
  r(12, bob - 3, 1, 2, '#ffb3c6');

  // EYES
  r(5, bob + 2, 2, eyeH, '#1a1a1a');
  r(9, bob + 2, 2, eyeH, '#1a1a1a');
  // Eye shine
  if (blinkOpen) {
    r(5, bob + 2, 1, 1, '#ffffff');
    r(9, bob + 2, 1, 1, '#ffffff');
  }

  // NOSE
  r(7, bob + 5, 2, 1, '#ffb3c6');

  // WHISKERS (left)
  r(1, bob + 4, 4, 1, '#cccccc');
  r(1, bob + 6, 4, 1, '#cccccc');
  // WHISKERS (right)
  r(11, bob + 4, 4, 1, '#cccccc');
  r(11, bob + 6, 4, 1, '#cccccc');

  // LEGS (4 small stubs)
  const legPairShift = Math.floor(f / 15) % 2 === 0 ? 0 : 1;
  r(3, 15 - legPairShift, 3, 3, '#f0f0f0');
  r(10, 15 + legPairShift, 3, 3, '#f0f0f0');
  r(5, 15 + legPairShift, 3, 3, '#e8e8e8');
  r(8, 15 - legPairShift, 3, 3, '#e8e8e8');

  // PAW TIPS (pink)
  r(3, 17 - legPairShift, 3, 1, '#ffccd8');
  r(10, 17 + legPairShift, 3, 1, '#ffccd8');
  r(5, 17 + legPairShift, 3, 1, '#ffccd8');
  r(8, 17 - legPairShift, 3, 1, '#ffccd8');
}

// ─── NPC face portraits for dialogue box ──────────────────────────────────────
function drawNpcPortrait(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,   // top-left of 24×24 game-pixel portrait area
  npc: string,
  frame: number
) {
  const S = 3; // portrait scale: 3 canvas px per game px → 72×72 total
  const r = (gx: number, gy: number, gw: number, gh: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(px + gx * S, py + gy * S, gw * S, gh * S);
  };
  const blink = (frame % 90) < 6;

  const npcKey = npc.toUpperCase();
  if (npcKey === 'ELLIOT' || npcKey === 'E') {
    // Background
    r(0, 0, 24, 24, '#0d1a0d');
    // Neck/collar
    r(10, 16, 4, 3, '#4488cc');
    r(5, 18, 14, 6, '#e8e8f0');   // lab coat shoulders
    r(8, 19, 8, 5, '#e8e8f0');
    // Head skin
    r(7, 3, 10, 11, '#c68642');
    // Curly hair
    r(7, 3, 10, 4, '#2a1a0a');
    r(5, 2, 3, 2, '#2a1a0a');
    r(16, 2, 3, 2, '#2a1a0a');
    r(4, 4, 3, 3, '#2a1a0a');
    r(17, 4, 3, 3, '#2a1a0a');
    // Glasses cyan lenses
    r(8, 8, 3, 2, '#00cccc');
    r(13, 8, 3, 2, '#00cccc');
    r(11, 8, 2, 1, '#888888'); // bridge
    // Eyes
    r(9, 7, 2, blink ? 1 : 2, '#1a1a1a');
    r(14, 7, 2, blink ? 1 : 2, '#1a1a1a');
    // Nose
    r(11, 11, 2, 1, '#b07050');
    // Mouth
    r(9, 13, 6, 1, '#8b4513');
    // Buttons
    r(11, 21, 2, 1, '#666');
    r(11, 23, 2, 1, '#666');
    // Chest pocket pen
    r(7, 20, 3, 4, '#d8d8e4');
    r(7, 20, 1, 3, '#4466aa');
  } else if (npcKey === 'BEN' || npcKey === 'B') {
    r(0, 0, 24, 24, '#0d1a09');
    // Hoodie
    r(4, 17, 16, 7, '#2d5a27');
    r(7, 19, 10, 5, '#2d5a27');
    // Pocket
    r(8, 21, 8, 4, '#1a3a17');
    // Neck
    r(10, 15, 4, 3, '#d4956a');
    // Head
    r(7, 3, 10, 12, '#d4956a');
    // Hair flat-top
    r(7, 3, 10, 4, '#8b5e3c');
    // Eyebrows
    r(8, 7, 3, 1, '#6b3e1c');
    r(13, 7, 3, 1, '#6b3e1c');
    // Eyes
    r(8, 8, 3, blink ? 1 : 2, '#3a2a1a');
    r(13, 8, 3, blink ? 1 : 2, '#3a2a1a');
    // Nose
    r(11, 11, 2, 2, '#c07050');
    // Big smile
    r(9, 13, 6, 1, '#a06040');
    r(9, 14, 6, 1, '#884030');
    // Sandwich in hand visible at bottom right
    r(18, 20, 5, 2, '#f5d78a');
    r(18, 22, 5, 2, '#4aaa44');
    r(18, 24, 5, 2, '#f5d78a');
  } else if (npcKey === 'ALEX' || npcKey === 'A') {
    r(0, 0, 24, 24, '#080810');
    // Turtleneck
    r(7, 14, 10, 5, '#111111');
    r(5, 17, 14, 7, '#1a1a1a');
    // Head
    r(7, 3, 10, 12, '#d4a07a');
    // Sleek dark hair
    r(7, 2, 10, 5, '#1a1a1a');
    // Angular brows
    r(8, 7, 3, 1, '#1a1a1a');
    r(13, 7, 3, 1, '#1a1a1a');
    // Sharp eyes (slightly squinting)
    r(9, 8, 2, blink ? 1 : 2, '#2a2a4a');
    r(13, 8, 2, blink ? 1 : 2, '#2a2a4a');
    // Nose (minimal)
    r(11, 11, 2, 1, '#c08060');
    // Pursed lips
    r(10, 13, 4, 1, '#8a6050');
    // Coffee cup in hand
    r(18, 19, 5, 6, '#ffffff');
    r(18, 19, 5, 1, '#cc4400');
    r(19, 20, 3, 5, '#e8e8e8');
  } else if (npcKey === 'HENRY' || npcKey === 'H') {
    const flicker = frame % 3 === 0 ? 0.45 : frame % 3 === 1 ? 0.75 : 0.6;
    ctx.globalAlpha = 0.15;
    r(0, 0, 24, 24, '#001a18');
    ctx.globalAlpha = 1;
    r(0, 0, 24, 24, '#000818');
    // Holographic glow outline
    ctx.globalAlpha = flicker * 0.3;
    r(5, 1, 14, 24, '#00ffcc');
    ctx.globalAlpha = flicker;
    // Body
    r(5, 17, 14, 7, '#00cccc');
    r(7, 19, 10, 5, '#00cccc');
    // Chest circuit traces
    r(8, 20, 4, 1, '#00ffff');
    r(14, 21, 1, 3, '#00ffff');
    // Head
    r(7, 3, 10, 12, '#00ffcc');
    // Silver hair
    r(7, 3, 10, 3, '#e0e0ff');
    // Circuit trace on forehead
    r(7, 5, 10, 1, '#00ffff');
    // Eyes (bright white)
    r(9, 7, 3, blink ? 1 : 3, '#ffffff');
    r(13, 7, 3, blink ? 1 : 3, '#ffffff');
    // Smile
    r(9, 13, 7, 1, '#ffffff');
    // Scan-line glitch
    if (frame % 4 === 0) {
      r(11, 0, 1, 24, '#ffffff');
    }
    ctx.globalAlpha = 1;
  } else {
    // Enzyme fallback
    r(0, 0, 24, 24, '#0d0d0d');
    r(7, 3, 10, 10, '#f0f0f0');
    r(7, 3, 2, 3, '#f0f0f0');
    r(15, 3, 2, 3, '#f0f0f0');
    r(8, 5, 2, 2, '#1a1a1a');
    r(14, 5, 2, 2, '#1a1a1a');
    r(11, 8, 2, 1, '#ffb3c6');
    r(9, 11, 6, 1, '#cccccc');
    r(5, 16, 4, 6, '#e8e8e8');
    r(15, 16, 4, 6, '#e8e8e8');
  }
}

// ─── Mini-map ─────────────────────────────────────────────────────────────────
function drawMinimap(
  ctx: CanvasRenderingContext2D,
  map: string[],
  px: number, py: number,
  palette: WorldMap['palette'],
  completedNodeTiles: Set<string>,
  CW: number
) {
  const MM_W = 80, MM_H = 56;
  const mmX = CW - MM_W - 8, mmY = 8;
  const tW = MM_W / MAP_W, tH = MM_H / MAP_H;

  // Background
  ctx.fillStyle = '#000000cc';
  ctx.fillRect(mmX - 2, mmY - 2, MM_W + 4, MM_H + 4);

  for (let ty = 0; ty < MAP_H; ty++) {
    for (let tx = 0; tx < MAP_W; tx++) {
      const t = tileAt(map, tx, ty);
      let col: string | null = null;
      if (t === '#') col = palette.wall;
      else if (t === '~') col = '#0a0a2a';
      else if (t === 'T') col = '#2a4a2a';
      else if (t === '=') col = palette.path;
      else if (t >= '1' && t <= '9') col = completedNodeTiles.has(t) ? '#00ff88' : palette.accent;
      else col = palette.floor;

      if (col) {
        ctx.fillStyle = col;
        ctx.fillRect(mmX + tx * tW, mmY + ty * tH, Math.max(1, tW), Math.max(1, tH));
      }
    }
  }

  // Player dot (blinking)
  const blink = Math.floor(Date.now() / 400) % 2 === 0;
  if (blink) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(mmX + px * tW - 1, mmY + py * tH - 1, 3, 3);
  }

  // Border
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 1;
  ctx.strokeRect(mmX - 1, mmY - 1, MM_W + 2, MM_H + 2);
}

// ─── Dialogue box (Undertale-style) ──────────────────────────────────────────
function drawDialogueBox(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  lineIndex: number,
  charProgress: number,
  npcName: string,
  accentColor: string,
  CW: number,
  CH: number,
  globalFrame: number = 0
) {
  const PORTRAIT = 80;   // portrait box size
  const PAD = 12;
  const bx = 8, by = CH - 124, bw = CW - 16, bh = 112;
  const textX = bx + PORTRAIT + PAD * 2;
  const textW = bw - PORTRAIT - PAD * 3;

  // ── Outer box: dark background, sharp corners (Undertale style)
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(bx, by, bw, bh);

  // Outer border — 3px solid accent color
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(bx, by, bw, bh);

  // Inner border inset — darker shade
  ctx.lineWidth = 1;
  ctx.strokeStyle = shiftColor(accentColor, -70);
  ctx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);

  // ── Portrait box: render actual NPC face (24×24 game pixels = 72×72 canvas px)
  const PBOX_W = 72, PBOX_H = 72;
  ctx.fillStyle = '#000000';
  ctx.fillRect(bx + PAD, by + PAD, PBOX_W + 8, PBOX_H + 8);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + PAD, by + PAD, PBOX_W + 8, PBOX_H + 8);

  // Clip and draw actual NPC portrait
  ctx.save();
  ctx.beginPath();
  ctx.rect(bx + PAD + 4, by + PAD + 4, PBOX_W, PBOX_H);
  ctx.clip();
  drawNpcPortrait(ctx, bx + PAD + 4, by + PAD + 4, npcName, globalFrame);
  ctx.restore();

  // ── Name label above portrait, Undertale-style colored tag
  ctx.fillStyle = accentColor;
  const nameLabel = npcName.toUpperCase();
  ctx.font = "bold 9px 'Press Start 2P', monospace";
  const nameMeasure = ctx.measureText(nameLabel);
  const nameBgW = nameMeasure.width + 16;
  ctx.fillRect(bx + PAD, by - 18, nameBgW, 20);
  ctx.fillStyle = '#000000';
  ctx.fillText(nameLabel, bx + PAD + 8, by - 4);

  // ── Dialogue text (typewriter) — Press Start 2P, white, 10px
  const effectiveTextX = bx + 80 + PAD * 2 + 8; // offset past wider portrait
  const effectiveTextW = bw - 80 - PAD * 3 - 8;
  const text = lines[lineIndex] ?? '';
  const shown = text.slice(0, charProgress);
  ctx.fillStyle = '#ffffff';
  ctx.font = "10px 'Press Start 2P', monospace";

  // Word-wrap to fit effectiveTextW
  const maxCharsPerLine = Math.floor(effectiveTextW / 6.5);
  const words = shown.split(' ');
  let currentLine = '';
  let lineY = by + 28;
  for (const word of words) {
    const test = currentLine ? currentLine + ' ' + word : word;
    if (test.length > maxCharsPerLine) {
      ctx.fillText(currentLine, effectiveTextX, lineY);
      currentLine = word;
      lineY += 18;
      if (lineY > by + bh - 16) break;
    } else {
      currentLine = test;
    }
  }
  if (currentLine && lineY <= by + bh - 16) {
    ctx.fillText(currentLine, effectiveTextX, lineY);
  }

  // ── "Press E" advance prompt — blinking cyan triangle
  if (charProgress >= text.length) {
    const blink = Math.floor(Date.now() / 500) % 2 === 0;
    if (blink) {
      ctx.fillStyle = accentColor;
      ctx.font = "9px 'Press Start 2P', monospace";
      ctx.fillText('▼', bx + bw - 22, by + bh - 10);
    }
  }
}

// ─── Node prompt overlay ──────────────────────────────────────────────────────
function drawNodePrompt(
  ctx: CanvasRenderingContext2D,
  tileCanvasX: number, tileCanvasY: number,
  accentColor: string,
  CW: number
) {
  const text = '  PRESS ENTER  ';
  const tw = text.length * 7 + 8;
  const tx = Math.max(4, Math.min(CW - tw - 4, tileCanvasX - tw / 2 + TILE * SCALE / 2));
  const ty = tileCanvasY - 28;

  ctx.fillStyle = '#000000cc';
  ctx.fillRect(tx, ty, tw, 18);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(tx, ty, tw, 18);
  ctx.fillStyle = accentColor;
  ctx.font = '10px monospace';
  ctx.fillText(text.trim(), tx + 4, ty + 13);
}

// ─── Cutscene ─────────────────────────────────────────────────────────────────
function drawCutscene(
  ctx: CanvasRenderingContext2D,
  phase: CutPhase,
  progress: number,
  world: WorldMap,
  charProgress: number,
  lineIndex: number,
  palette: WorldMap['palette'],
  realm: number,
  CW: number,
  CH: number
) {
  if (phase === 'done') return;

  if (phase === 'fadein') {
    // Black fade-in: alpha goes 1→0
    const alpha = 1 - progress;
    ctx.fillStyle = `rgba(0,0,0,${Math.max(0, alpha)})`;
    ctx.fillRect(0, 0, CW, CH);
    return;
  }

  if (phase === 'npc-walk') {
    // NPC slides from right edge toward centre
    const npcCanvasX = CW - (CW - CW * 0.4) * progress; // slide from right
    const npcCanvasY = CH * 0.35;
    const af = Math.floor(Date.now() / 300) % 2;

    // Darken world for cutscene focus
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, CW, CH);

    drawNpcSprite(ctx, npcCanvasX, npcCanvasY, world.npcGreeting.npc, 'left', af, palette);
    return;
  }

  if (phase === 'dialogue') {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, CW, CH);

    // Draw NPC sprite on left side
    drawNpcSprite(ctx, CW * 0.12, CH * 0.32, world.npcGreeting.npc, 'right', 0, palette);

    // Dialogue box
    const { npc, lines } = world.npcGreeting;
    const NPC_NAMES: Record<string, string> = { elliot: 'ELLIOT', ben: 'BEN', alex: 'ALEX', henry: 'HENRY' };
    drawDialogueBox(ctx, lines, lineIndex, charProgress, NPC_NAMES[npc] ?? npc, palette.accent, CW, CH, Math.floor(Date.now() / 16));
    return;
  }
}

function drawNpcSprite(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  npc: string, dir: Dir, frame: number,
  palette: WorldMap['palette']
) {
  // Draw NPC at raw canvas position (not tile-based offset)
  const savedAlpha = ctx.globalAlpha;
  // Temporarily compute tile canvas coords for NPC drawing fns
  // The NPC functions use tile-origin coords + internal offsets
  // We'll shift so that tile origin = (x, y)
  const fakeCx = x;
  const fakeCy = y;
  switch (npc) {
    case 'elliot': drawElliot(ctx, fakeCx, fakeCy, dir, frame); break;
    case 'ben':    drawBen(ctx, fakeCx, fakeCy, dir, frame); break;
    case 'alex':   drawAlex(ctx, fakeCx, fakeCy, dir, frame); break;
    case 'henry':  drawHenry(ctx, fakeCx, fakeCy, dir, frame); break;
  }
  ctx.globalAlpha = savedAlpha;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PixelWorldEngine({ realm, onEnterNode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasSizeRef = useRef({ w: 800, h: 600 });
  const stateRef = useRef<GameState | null>(null);
  const onEnterRef = useRef(onEnterNode);
  onEnterRef.current = onEnterNode;

  const { progress, avatar, setCurrentNode, awardGems, awardXP } = useGameStore();

  // Get world data
  const world = WORLD_MAPS.find((w) => w.id === realm)!;
  const map = world.map;
  const realmNodes = getRealmNodes(realm);

  // Completed node tile chars
  const completedNodeTiles = new Set<string>();
  realmNodes.forEach((node, idx) => {
    if (progress.completedNodes[node.id]?.completed && idx < 9) {
      completedNodeTiles.add(String(idx + 1));
    }
  });

  const initState = useCallback((): GameState => {
    const startPos = findChar(map, '@') ?? { x: 20, y: 25 };
    const vpW = Math.ceil(canvasSizeRef.current.w / (TILE * SCALE)) + 2;
    const vpH = Math.ceil(canvasSizeRef.current.h / (TILE * SCALE)) + 2;
    const cam = {
      camX: Math.max(0, startPos.x - vpW / 2),
      camY: Math.max(0, startPos.y - vpH / 2),
    };
    return {
      frame: 0,
      px: startPos.x, py: startPos.y,
      pfx: 0, pfy: 0,
      moveProgress: 0,
      prevPx: startPos.x, prevPy: startPos.y,
      dir: 'down',
      moving: false,
      camX: cam.camX, camY: cam.camY,
      lastMoveTime: 0,
      lastAnimTime: 0,
      lastWalkTime: 0,
      animFrame: 0,
      walkFrame: 0,
      keys: new Set(),
      onNode: null,
      nearNpc: null,
      dialogueActive: false,
      dialogueLine: 0,
      dialogueChar: 0,
      dialogueLastChar: 0,
      cutPhase: 'fadein',
      cutProgress: 0,
      cutNpcX: canvasSizeRef.current.w,
      cutStartTime: performance.now(),
      cutDialogueLine: 0,
      cutDialogueChar: 0,
      cutDialogueLastChar: 0,
      nodePromptVisible: false,
      helperVisible: false,
      nearChest: null,
      nearSign: null,
      signDialogueActive: false,
      signLines: [],
      signDialogueLine: 0,
      signDialogueChar: 0,
      signDialogueLastChar: 0,
      chestPopup: null,
    };
  }, [map]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight - 56;
      canvasSizeRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    ctx.imageSmoothingEnabled = false;

    stateRef.current = initState();
    const gs = stateRef.current;

    // ── Key handlers ──────────────────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      gs.keys.add(e.key);

      // Dismiss cutscene on any key
      if (gs.cutPhase !== 'done') {
        if (gs.cutPhase === 'fadein') {
          gs.cutPhase = 'npc-walk';
          gs.cutProgress = 0;
          gs.cutStartTime = performance.now();
        } else if (gs.cutPhase === 'npc-walk' && gs.cutProgress > 0.3) {
          gs.cutPhase = 'dialogue';
          gs.cutProgress = 0;
          gs.cutStartTime = performance.now();
          gs.cutDialogueChar = 0;
          gs.cutDialogueLastChar = performance.now();
        } else if (gs.cutPhase === 'dialogue') {
          const lines = world.npcGreeting.lines;
          if (gs.cutDialogueChar < (lines[gs.cutDialogueLine]?.length ?? 0)) {
            // Fast-forward typewriter
            gs.cutDialogueChar = lines[gs.cutDialogueLine]?.length ?? 0;
          } else if (gs.cutDialogueLine < lines.length - 1) {
            gs.cutDialogueLine++;
            gs.cutDialogueChar = 0;
            gs.cutDialogueLastChar = performance.now();
          } else {
            gs.cutPhase = 'done';
          }
        }
        e.preventDefault();
        return;
      }

      // Sign dialogue advance
      if (gs.signDialogueActive && (e.key === 'e' || e.key === 'E' || e.key === 'Enter')) {
        if (gs.signDialogueChar < (gs.signLines[gs.signDialogueLine]?.length ?? 0)) {
          gs.signDialogueChar = gs.signLines[gs.signDialogueLine]?.length ?? 0;
        } else if (gs.signDialogueLine < gs.signLines.length - 1) {
          gs.signDialogueLine++;
          gs.signDialogueChar = 0;
          gs.signDialogueLastChar = performance.now();
        } else {
          gs.signDialogueActive = false;
        }
        e.preventDefault();
        return;
      }

      // NPC dialogue advance
      if (gs.dialogueActive && (e.key === 'e' || e.key === 'E' || e.key === 'Enter')) {
        const lines = world.npcGreeting.lines;
        if (gs.dialogueChar < (lines[gs.dialogueLine]?.length ?? 0)) {
          gs.dialogueChar = lines[gs.dialogueLine]?.length ?? 0;
        } else if (gs.dialogueLine < lines.length - 1) {
          gs.dialogueLine++;
          gs.dialogueChar = 0;
          gs.dialogueLastChar = performance.now();
        } else {
          gs.dialogueActive = false;
          gs.dialogueLine = 0;
          gs.dialogueChar = 0;
        }
        e.preventDefault();
        return;
      }

      // Boss castle entry (realm 1)
      if ((e.key === 'Enter' || e.key === 'e' || e.key === 'E') && !gs.dialogueActive && realm === 1 && tileAt(map, gs.px, gs.py) === 'B') {
        onEnterRef.current('BOSS');
        e.preventDefault();
        return;
      }

      // Enter node
      if ((e.key === 'Enter' || e.key === 'e' || e.key === 'E') && gs.onNode && !gs.dialogueActive) {
        const nodeIdx = parseInt(gs.onNode, 10) - 1;
        const node = realmNodes[nodeIdx];
        if (node) {
          setCurrentNode(node.id);
          onEnterRef.current(node.id);
        }
        e.preventDefault();
        return;
      }

      // Interact with NPC
      if ((e.key === 'e' || e.key === 'E') && gs.nearNpc && !gs.dialogueActive && !gs.onNode) {
        gs.dialogueActive = true;
        gs.dialogueLine = 0;
        gs.dialogueChar = 0;
        gs.dialogueLastChar = performance.now();
        e.preventDefault();
        return;
      }

      // Open chest
      if ((e.key === 'e' || e.key === 'E') && gs.nearChest && !gs.dialogueActive && !gs.signDialogueActive && !gs.onNode) {
        const { tx, ty } = gs.nearChest;
        const key = `${realm}-${tx}-${ty}`;
        if (!SESSION_OPENED.has(key)) {
          SESSION_OPENED.add(key);
          const loot = CHEST_LOOT[key] ?? { lines: ['Hidden cache!', 'A secret stash.', '+25 XP  +5 💎'], gems: 5, xp: 25 };
          gs.chestPopup = { text: loot.lines.join(' | '), timer: 180 };
          if (loot.gems > 0) awardGems(loot.gems);
          if (loot.xp > 0) awardXP(loot.xp);
        }
        e.preventDefault();
        return;
      }

      // Read sign
      if ((e.key === 'e' || e.key === 'E') && gs.nearSign && !gs.dialogueActive && !gs.signDialogueActive && !gs.onNode) {
        const { tx, ty } = gs.nearSign;
        const key = `${realm}-${tx}-${ty}`;
        const text = SIGN_TEXT[key] ?? ['A worn sign.', 'The text is too faded to read.', '...'];
        gs.signLines = text;
        gs.signDialogueLine = 0;
        gs.signDialogueChar = 0;
        gs.signDialogueLastChar = performance.now();
        gs.signDialogueActive = true;
        e.preventDefault();
        return;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      gs.keys.delete(e.key);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // ── Game loop ─────────────────────────────────────────────────────────
    let rafId = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      gs.frame++;

      const CW = canvasSizeRef.current.w;
      const CH = canvasSizeRef.current.h;
      const VP_W = Math.ceil(CW / (TILE * SCALE)) + 2;
      const VP_H = Math.ceil(CH / (TILE * SCALE)) + 2;

      // ── Timers ──────────────────────────────────────────────────────────
      if (now - gs.lastAnimTime >= ANIM_MS) {
        gs.animFrame = (gs.animFrame + 1) % 4;
        gs.lastAnimTime = now;
      }

      // ── Cutscene update ─────────────────────────────────────────────────
      if (gs.cutPhase !== 'done') {
        const elapsed = now - gs.cutStartTime;
        if (gs.cutPhase === 'fadein') {
          gs.cutProgress = Math.min(1, elapsed / 1000);
          if (gs.cutProgress >= 1) {
            gs.cutPhase = 'npc-walk';
            gs.cutProgress = 0;
            gs.cutStartTime = now;
          }
        } else if (gs.cutPhase === 'npc-walk') {
          gs.cutProgress = Math.min(1, elapsed / 2000);
          if (gs.cutProgress >= 1) {
            gs.cutPhase = 'dialogue';
            gs.cutProgress = 0;
            gs.cutStartTime = now;
            gs.cutDialogueChar = 0;
            gs.cutDialogueLastChar = now;
          }
        } else if (gs.cutPhase === 'dialogue') {
          // Typewriter
          if (now - gs.cutDialogueLastChar >= 40) {
            const line = world.npcGreeting.lines[gs.cutDialogueLine] ?? '';
            if (gs.cutDialogueChar < line.length) {
              gs.cutDialogueChar++;
              gs.cutDialogueLastChar = now;
            }
          }
        }
      }

      // ── NPC dialogue typewriter ──────────────────────────────────────────
      if (gs.dialogueActive && now - gs.dialogueLastChar >= 40) {
        const line = world.npcGreeting.lines[gs.dialogueLine] ?? '';
        if (gs.dialogueChar < line.length) {
          gs.dialogueChar++;
          gs.dialogueLastChar = now;
        }
      }

      // ── Player movement (only when cutscene done) ────────────────────────
      if (gs.cutPhase === 'done' && !gs.dialogueActive) {
        // Walk frame
        if (gs.moving && now - gs.lastWalkTime >= WALK_MS) {
          gs.walkFrame = gs.walkFrame === 0 ? 1 : 0;
          gs.lastWalkTime = now;
        }

        // Movement interpolation — compute progress directly (not accumulated)
        if (gs.moving) {
          gs.moveProgress = Math.min(1, (now - gs.lastMoveTime) / MOVE_MS);
          gs.pfx = gs.moveProgress;
          gs.pfy = gs.moveProgress;
          if (gs.moveProgress >= 1) {
            gs.moving = false;
            gs.moveProgress = 0;
            gs.pfx = 0;
            gs.pfy = 0;
          }
        }

        // Start new move
        if (!gs.moving && now - gs.lastMoveTime >= MOVE_MS) {
          let dx = 0, dy = 0;
          if (gs.keys.has('ArrowUp')    || gs.keys.has('w') || gs.keys.has('W')) { dy = -1; gs.dir = 'up'; }
          if (gs.keys.has('ArrowDown')  || gs.keys.has('s') || gs.keys.has('S')) { dy =  1; gs.dir = 'down'; }
          if (gs.keys.has('ArrowLeft')  || gs.keys.has('a') || gs.keys.has('A')) { dx = -1; gs.dir = 'left'; }
          if (gs.keys.has('ArrowRight') || gs.keys.has('d') || gs.keys.has('D')) { dx =  1; gs.dir = 'right'; }

          if (dx !== 0 || dy !== 0) {
            const nx = gs.px + dx, ny = gs.py + dy;
            if (isWalkable(map, nx, ny)) {
              gs.prevPx = gs.px; gs.prevPy = gs.py;
              gs.px = nx; gs.py = ny;
              gs.pfx = 0; gs.pfy = 0;
              gs.moveProgress = 0;
              gs.moving = true;
              gs.lastMoveTime = now;
            }
          }
        }

        // Detect node / NPC
        const cur = tileAt(map, gs.px, gs.py);
        gs.onNode = (cur >= '1' && cur <= '9') ? cur : null;
        const onBoss = cur === 'B' && realm === 1;
        gs.nodePromptVisible = gs.onNode !== null || onBoss;

        // Check adjacent tiles for NPCs (in realm 1, 'B' is boss castle not NPC)
        gs.nearNpc = null;
        const npcChars = realm === 1 ? ['E', 'A', 'H'] : ['E', 'B', 'A', 'H'];
        const neighbors = [[0,-1],[0,1],[-1,0],[1,0]];
        for (const [ddx, ddy] of neighbors) {
          const adjTile = tileAt(map, gs.px + ddx, gs.py + ddy);
          if (npcChars.includes(adjTile)) { gs.nearNpc = adjTile; break; }
        }

        // Check adjacent tiles for chests and signs
        gs.nearChest = null;
        gs.nearSign  = null;
        for (const [ddx, ddy] of neighbors) {
          const atx = gs.px + ddx, aty = gs.py + ddy;
          const adj = tileAt(map, atx, aty);
          if (adj === 'C') { gs.nearChest = { tx: atx, ty: aty }; }
          if (adj === 'S') { gs.nearSign  = { tx: atx, ty: aty }; }
        }

        // Decay chest popup
        if (gs.chestPopup) {
          gs.chestPopup.timer--;
          if (gs.chestPopup.timer <= 0) gs.chestPopup = null;
        }

        // Advance sign dialogue typewriter
        if (gs.signDialogueActive && gs.signDialogueChar < (gs.signLines[gs.signDialogueLine]?.length ?? 0)) {
          if (now - gs.signDialogueLastChar > 30) {
            gs.signDialogueChar++;
            gs.signDialogueLastChar = now;
          }
        }
      }

      // ── Camera smooth follow ─────────────────────────────────────────────
      if (gs.cutPhase === 'done') {
        // Interpolated player position
        const interpX = gs.prevPx + (gs.px - gs.prevPx) * (gs.moving ? gs.pfx : 1);
        const interpY = gs.prevPy + (gs.py - gs.prevPy) * (gs.moving ? gs.pfy : 1);

        const targetCamX = interpX - VP_W / 2 + 0.5;
        const targetCamY = interpY - VP_H / 2 + 0.5;
        const maxCamX = MAP_W - VP_W;
        const maxCamY = MAP_H - VP_H;
        gs.camX += (Math.max(0, Math.min(maxCamX, targetCamX)) - gs.camX) * CAM_LERP;
        gs.camY += (Math.max(0, Math.min(maxCamY, targetCamY)) - gs.camY) * CAM_LERP;
      }

      // ── Render ──────────────────────────────────────────────────────────
      render(ctx, gs, world, map, now, realm, completedNodeTiles, realmNodes, avatar, progress, CW, CH, VP_W, VP_H);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', updateSize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      autoFocus
      onClick={(e) => e.currentTarget.focus()}
      style={{
        position: 'fixed',
        top: 56,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
        outline: 'none',
        background: world.palette.sky,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ imageRendering: 'pixelated', display: 'block', width: '100%', height: '100%' } as React.CSSProperties}
      />
    </div>
  );
}

// ─── Render function ──────────────────────────────────────────────────────────
function render(
  ctx: CanvasRenderingContext2D,
  gs: GameState,
  world: WorldMap,
  map: string[],
  now: number,
  realm: number,
  completedNodeTiles: Set<string>,
  realmNodes: ReturnType<typeof getRealmNodes>,
  avatar: { skinTone: string; clothingColorPrimary: string; hairColor: string },
  progress: { completedNodes: Record<string, { completed: boolean }> },
  CW: number,
  CH: number,
  VP_W: number,
  VP_H: number
) {
  const { palette } = world;
  const t = now / 1000;
  const frame = Math.floor(t * 60);

  // Clear
  ctx.fillStyle = palette.sky;
  ctx.fillRect(0, 0, CW, CH);

  // Tile render
  const camTileX = Math.floor(gs.camX);
  const camTileY = Math.floor(gs.camY);
  const camOffX = (gs.camX - camTileX) * TILE * SCALE;
  const camOffY = (gs.camY - camTileY) * TILE * SCALE;

  // Interpolated player position for reference
  const interpPX = gs.prevPx + (gs.px - gs.prevPx) * (gs.moving ? Math.min(1, gs.pfx) : 1);
  const interpPY = gs.prevPy + (gs.py - gs.prevPy) * (gs.moving ? Math.min(1, gs.pfy) : 1);

  // Precompute Henry position for altar proximity glow (realm 4)
  let henryPos: { tx: number; ty: number } | null = null;
  if (realm === 4) {
    outer: for (let ry = 0; ry < MAP_H; ry++) {
      for (let rx = 0; rx < MAP_W; rx++) {
        if (tileAt(map, rx, ry) === 'H') { henryPos = { tx: rx, ty: ry }; break outer; }
      }
    }
  }

  for (let row = -1; row <= VP_H + 1; row++) {
    for (let col = -1; col <= VP_W + 1; col++) {
      const tx = camTileX + col;
      const ty = camTileY + row;
      if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;

      const tile = tileAt(map, tx, ty);
      const cx = Math.round(col * TILE * SCALE - camOffX);
      const cy = Math.round(row * TILE * SCALE - camOffY);

      // In realm 1, 'B' is boss castle (not NPC); in other realms 'B' is Ben NPC
      const isNpcTile = tile === 'E' || (tile === 'B' && realm !== 1) || tile === 'A' || tile === 'H';

      if (isNpcTile) {
        // Draw floor beneath NPC
        drawTile(ctx, cx, cy, '.', gs.animFrame, palette, realm, false, t, tx, ty, frame, map, henryPos);
      } else {
        const isComplete = completedNodeTiles.has(tile);
        drawTile(ctx, cx, cy, tile, gs.animFrame, palette, realm, isComplete, t, tx, ty, frame, map, henryPos);
      }

      // Draw NPC sprite
      if (isNpcTile) {
        const af = gs.animFrame % 2;
        switch (tile) {
          case 'E': drawElliot(ctx, cx, cy, 'down', af); break;
          case 'B': drawBen(ctx, cx, cy, 'down', af); break;
          case 'A': drawAlex(ctx, cx, cy, 'down', af); break;
          case 'H': drawHenry(ctx, cx, cy, 'down', af); break;
        }
      }

      // "Press E to interact" hint near NPCs
      if (isNpcTile && gs.cutPhase === 'done') {
        const nearPlayer = Math.abs(tx - gs.px) <= 1 && Math.abs(ty - gs.py) <= 1;
        if (nearPlayer && !gs.dialogueActive) {
          ctx.fillStyle = palette.accent;
          ctx.font = '9px monospace';
          ctx.fillText('▲ E', cx + TILE * SCALE / 2 - 8, cy - 4);
        }
      }

      // "E" hint above nearby chest/sign
      if ((tile === 'C' || tile === 'S') && gs.cutPhase === 'done') {
        const nearPlayer = Math.abs(tx - gs.px) <= 1 && Math.abs(ty - gs.py) <= 1;
        if (nearPlayer && !gs.dialogueActive && !gs.signDialogueActive) {
          const chestKey = `${realm}-${tx}-${ty}`;
          const alreadyOpen = tile === 'C' && SESSION_OPENED.has(chestKey);
          if (!alreadyOpen) {
            ctx.fillStyle = tile === 'C' ? '#ffdd55' : palette.accent;
            ctx.font = '9px monospace';
            ctx.fillText(tile === 'C' ? '▲ OPEN' : '▲ READ', cx + TILE * SCALE / 2 - 14, cy - 4);
          }
        }
      }
    }
  }

  // Track player position history for Enzyme companion
  pushPosHistory(interpPX, interpPY);

  // Draw Enzyme companion (trails the player)
  {
    const ePos = getEnzymePos(interpPX, interpPY);
    const enzymeScreenX = Math.round((ePos.x - gs.camX) * TILE * SCALE);
    const enzymeScreenY = Math.round((ePos.y - gs.camY) * TILE * SCALE);
    drawEnzymeCompanion(ctx, enzymeScreenX, enzymeScreenY, gs.frame);
  }

  // Draw player (interpolated position, in front of Enzyme)
  {
    const playerScreenX = Math.round((interpPX - gs.camX) * TILE * SCALE);
    const playerScreenY = Math.round((interpPY - gs.camY) * TILE * SCALE);
    const wf = gs.moving ? gs.walkFrame : 0;
    drawPlayer(
      ctx,
      playerScreenX, playerScreenY,
      gs.dir, wf,
      avatar.skinTone,
      avatar.clothingColorPrimary,
      avatar.hairColor ?? '#1a1a1a'
    );
  }

  // Node prompt overlay
  if (gs.nodePromptVisible && gs.cutPhase === 'done') {
    const playerScreenX = Math.round((interpPX - gs.camX) * TILE * SCALE);
    const playerScreenY = Math.round((interpPY - gs.camY) * TILE * SCALE);
    drawNodePrompt(ctx, playerScreenX, playerScreenY, palette.accent, CW);
  }

  // Mini-map (top-right)
  drawMinimap(ctx, map, gs.px, gs.py, palette, completedNodeTiles, CW);

  // Node counter (top-left)
  const totalNodes = Math.min(realmNodes.length, 9);
  const doneCount = [...completedNodeTiles].length;
  ctx.fillStyle = '#000000aa';
  ctx.fillRect(4, 4, 110, 18);
  ctx.fillStyle = palette.accent;
  ctx.font = '10px monospace';
  ctx.fillText(`NODES: ${doneCount} / ${totalNodes}`, 8, 17);

  // Controls hint (bottom-left, during gameplay)
  if (gs.cutPhase === 'done' && !gs.dialogueActive) {
    ctx.fillStyle = '#00000099';
    ctx.fillRect(4, CH - 20, 180, 16);
    ctx.fillStyle = '#888888';
    ctx.font = '9px monospace';
    ctx.fillText('WASD/ARROWS: move  E: interact', 8, CH - 8);
  }

  // NPC dialogue overlay
  if (gs.dialogueActive) {
    const NPC_NAMES: Record<string, string> = { E: 'ELLIOT', B: 'BEN', A: 'ALEX', H: 'HENRY' };
    const npcName = gs.nearNpc ? (NPC_NAMES[gs.nearNpc] ?? 'NPC') : 'NPC';
    drawDialogueBox(ctx, world.npcGreeting.lines, gs.dialogueLine, gs.dialogueChar, npcName, palette.accent, CW, CH, frame);
  }

  // Sign dialogue overlay
  if (gs.signDialogueActive && gs.signLines.length > 0) {
    drawDialogueBox(ctx, gs.signLines, gs.signDialogueLine, gs.signDialogueChar, '-- SIGN --', palette.accent, CW, CH, frame);
  }

  // Chest loot popup
  if (gs.chestPopup) {
    const alpha = Math.min(1, gs.chestPopup.timer / 30);
    const boxW = Math.min(CW - 32, 320), boxH = 60;
    const bx = (CW - boxW) / 2, by = CH * 0.28;
    ctx.globalAlpha = alpha * 0.92;
    ctx.fillStyle = '#000000'; ctx.fillRect(bx + 3, by + 3, boxW, boxH);
    ctx.fillStyle = palette.floor; ctx.fillRect(bx, by, boxW, boxH);
    ctx.strokeStyle = palette.accent; ctx.lineWidth = 2; ctx.strokeRect(bx, by, boxW, boxH);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffdd55';
    ctx.font = 'bold 11px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CHEST OPENED!', bx + boxW / 2, by + 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    const parts = gs.chestPopup.text.split(' | ');
    parts.forEach((p, i) => ctx.fillText(p, bx + boxW / 2, by + 35 + i * 13));
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  // Cutscene overlay
  if (gs.cutPhase !== 'done') {
    drawCutscene(
      ctx, gs.cutPhase, gs.cutProgress, world,
      gs.cutDialogueChar, gs.cutDialogueLine,
      palette, realm, CW, CH
    );
  }
}
