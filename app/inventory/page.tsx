'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import { ALL_ITEMS } from '@/lib/items';
import type { GameItem } from '@/lib/items';

// ─── Pixel art rarity border colors ──────────────────────────────────────────
const RARITY_COLOR: Record<string, string> = {
  common:    '#4488cc',
  rare:      '#aa44ff',
  legendary: '#ffcc00',
};
const RARITY_GLOW: Record<string, string> = {
  common:    'rgba(68,136,204,0.3)',
  rare:      'rgba(170,68,255,0.35)',
  legendary: 'rgba(255,204,0,0.45)',
};
const REALM_ACCENT: Record<number, string> = {
  1: '#00ffcc',
  2: '#44ff88',
  3: '#aa44ff',
  4: '#ffaa00',
};
const REALM_NAME: Record<number, string> = {
  1: 'Cytoplasm',
  2: 'Genome Forest',
  3: 'Neural Nebula',
  4: 'Protein Cathedral',
};

// ─── Canvas item icon renderer ────────────────────────────────────────────────
function ItemIconCanvas({
  item, size, obtained,
}: { item: GameItem; size: number; obtained: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const W = size;
    ctx.clearRect(0, 0, W, W);

    const accent = REALM_ACCENT[item.realmId] ?? '#00ffcc';
    const col    = RARITY_COLOR[item.rarity] ?? '#4488cc';

    if (!obtained) {
      // Silhouette — blacked out with subtle border
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, W, W);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, W - 2, W - 2);
      ctx.fillStyle = '#222';
      ctx.font = `${Math.floor(W * 0.5)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', W / 2, W / 2 + 1);
      return;
    }

    // Background glow
    const grd = ctx.createRadialGradient(W/2, W/2, 0, W/2, W/2, W/2);
    grd.addColorStop(0, RARITY_GLOW[item.rarity] ?? 'rgba(68,136,204,0.3)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, W);

    // Per-type pixel art icon
    const px = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(
        Math.round(x * W / 16), Math.round(y * W / 16),
        Math.round(w * W / 16), Math.round(h * W / 16)
      );
    };

    if (item.type === 'consumable') {
      // Crystal gem shape
      px(6, 0, 4, 2, col);
      px(4, 2, 8, 4, col);
      px(2, 6, 12, 5, col);
      px(4, 11, 8, 3, col);
      px(6, 14, 4, 2, col);
      px(5, 2, 2, 2, '#ffffff');
      px(7, 1, 1, 1, '#ffffffaa');
    } else if (item.type === 'key') {
      // Key shape
      px(2, 5, 6, 6, col);
      px(3, 6, 4, 4, '#000000aa');
      px(3, 6, 4, 4, col === '#4488cc' ? '#224466' : '#770088');
      px(8, 7, 6, 2, col);
      px(12, 9, 2, 3, col);
      px(10, 9, 2, 3, col);
      px(2, 5, 1, 1, '#ffffffaa');
    } else if (item.type === 'artifact') {
      // Orb with inner glow
      px(5, 2, 6, 2, col);
      px(3, 4, 10, 8, col);
      px(5, 12, 6, 2, col);
      px(5, 4, 4, 4, '#ffffff33');
      px(5, 4, 2, 2, '#ffffff88');
      px(4, 4, 1, 1, '#ffffffcc');
    } else if (item.type === 'lore') {
      // Scroll
      px(3, 1, 10, 2, '#aa8844');
      px(2, 3, 12, 10, '#eecc88');
      px(3, 4, 8, 1, accent);
      px(3, 6, 6, 1, '#aa8844');
      px(3, 8, 9, 1, '#aa8844');
      px(3, 13, 10, 2, '#aa8844');
    } else if (item.type === 'cosmetic') {
      // Star
      px(7, 0, 2, 4, col);
      px(0, 6, 16, 4, col);
      px(2, 2, 3, 3, col);
      px(11, 2, 3, 3, col);
      px(2, 11, 3, 3, col);
      px(11, 11, 3, 3, col);
      px(7, 7, 2, 2, '#ffffff');
    }

    // Border
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.5, 0.5, W - 1, W - 1);
  }, [item, size, obtained]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
  );
}

// ─── Single item card ─────────────────────────────────────────────────────────
function ItemCard({ item, obtained }: { item: GameItem; obtained: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const col = RARITY_COLOR[item.rarity] ?? '#4488cc';
  const accent = REALM_ACCENT[item.realmId] ?? '#00ffcc';

  return (
    <button
      onClick={() => obtained && setExpanded((v) => !v)}
      className="relative text-left w-full"
      style={{
        background: obtained ? '#111820' : '#0a0a0f',
        border: `2px solid ${obtained ? col : '#222'}`,
        boxShadow: obtained ? `0 0 12px ${RARITY_GLOW[item.rarity]}` : 'none',
        padding: '12px',
        cursor: obtained ? 'pointer' : 'default',
        imageRendering: 'pixelated',
        transition: 'box-shadow 0.15s',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <ItemIconCanvas item={item} size={56} obtained={obtained} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 9,
            color: obtained ? col : '#444',
            marginBottom: 4,
          }}>
            {obtained ? item.name : '???'}
          </div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: obtained ? '#888' : '#333',
            lineHeight: 1.6,
          }}>
            {obtained ? item.description : 'Not yet discovered'}
          </div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 6,
            color: accent,
            marginTop: 6,
            opacity: obtained ? 0.8 : 0.3,
          }}>
            {item.rarity.toUpperCase()} · {REALM_NAME[item.realmId]}
          </div>
        </div>
      </div>

      {expanded && obtained && (
        <div style={{
          marginTop: 10,
          padding: '10px 12px',
          background: '#060e16',
          borderTop: `1px solid ${col}44`,
        }}>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: '#aac',
            lineHeight: 1.9,
            whiteSpace: 'pre-wrap',
          }}>
            {item.loreText}
          </div>
          {item.effect && (
            <div style={{
              marginTop: 8,
              display: 'flex',
              gap: 12,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 7,
            }}>
              {item.effect.xp    && <span style={{ color: '#00ffcc' }}>+{item.effect.xp} XP</span>}
              {item.effect.gems  && <span style={{ color: '#ffcc00' }}>+{item.effect.gems} 💎</span>}
              {item.effect.hearts && <span style={{ color: '#ff4466' }}>+{item.effect.hearts} ❤</span>}
            </div>
          )}
        </div>
      )}

      {/* Rarity pip in corner */}
      <div style={{
        position: 'absolute',
        top: 8, right: 8,
        width: 8, height: 8,
        background: obtained ? col : '#222',
        boxShadow: obtained ? `0 0 6px ${col}` : 'none',
      }} />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InventoryPage() {
  const { progress } = useGameStore();
  const obtained = new Set(progress.inventory ?? []);

  const [filterRealm, setFilterRealm] = useState<number | null>(null);
  const [filterRarity, setFilterRarity] = useState<string | null>(null);
  const [filterObtained, setFilterObtained] = useState(false);

  const filtered = ALL_ITEMS.filter((item) => {
    if (filterRealm   && item.realmId !== filterRealm)    return false;
    if (filterRarity  && item.rarity  !== filterRarity)   return false;
    if (filterObtained && !obtained.has(item.id))          return false;
    return true;
  });

  const total     = ALL_ITEMS.length;
  const collected = ALL_ITEMS.filter((i) => obtained.has(i.id)).length;

  const btnStyle = (active: boolean, col: string) => ({
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 7,
    padding: '6px 10px',
    background: active ? col : '#111820',
    color: active ? '#000' : '#666',
    border: `1px solid ${active ? col : '#333'}`,
    cursor: 'pointer',
    imageRendering: 'pixelated' as const,
    letterSpacing: '0.05em',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060c14',
      color: '#ccddee',
      fontFamily: '"Press Start 2P", monospace',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '2px solid #0a3a50',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: '#040a10',
      }}>
        <Link href="/" style={{ color: '#00ffcc', textDecoration: 'none', fontSize: 9 }}>← HOME</Link>
        <div style={{ fontSize: 14, color: '#00ffcc', flex: 1 }}>INVENTORY</div>
        <div style={{ fontSize: 9, color: '#888' }}>
          {collected} / {total} COLLECTED
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#111820' }}>
        <div style={{
          height: '100%',
          width: `${(collected / total) * 100}%`,
          background: 'linear-gradient(90deg, #00ffcc, #aa44ff)',
          transition: 'width 0.5s',
        }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          <span style={{ fontSize: 7, color: '#555', alignSelf: 'center' }}>REALM:</span>
          {[1, 2, 3, 4].map((r) => (
            <button key={r} style={btnStyle(filterRealm === r, REALM_ACCENT[r])}
              onClick={() => setFilterRealm(filterRealm === r ? null : r)}>
              {REALM_NAME[r]}
            </button>
          ))}
          <span style={{ fontSize: 7, color: '#555', alignSelf: 'center', marginLeft: 12 }}>RARITY:</span>
          {['common', 'rare', 'legendary'].map((r) => (
            <button key={r} style={btnStyle(filterRarity === r, RARITY_COLOR[r])}
              onClick={() => setFilterRarity(filterRarity === r ? null : r)}>
              {r}
            </button>
          ))}
          <button style={{
            ...btnStyle(filterObtained, '#ffffff'),
            marginLeft: 'auto',
          }} onClick={() => setFilterObtained((v) => !v)}>
            {filterObtained ? 'SHOWING FOUND' : 'SHOW ALL'}
          </button>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} obtained={obtained.has(item.id)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            fontSize: 9,
            color: '#334',
          }}>
            NO ITEMS MATCH THESE FILTERS
          </div>
        )}
      </div>
    </div>
  );
}
