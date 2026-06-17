'use client';
import { useRef, useEffect, useCallback } from 'react';
import { getRealmZones, isZoneUnlocked, type Zone } from '@/lib/zones';
import type { Realm } from '@/lib/types';

interface Props {
  realm: Realm;
  currentZoneId: string;
  completedNodeIds: string[];
  onZoneSelect: (zoneId: string) => void;
  onClose: () => void;
}

const REALM_COLORS: Record<number, string> = { 1: '#00ffaa', 2: '#52b788', 3: '#a855f7', 4: '#c0a0ff' };

export default function ZoneMap({ realm, currentZoneId, completedNodeIds, onZoneSelect, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const accent = REALM_COLORS[realm] ?? '#ffffff';
    const zones = getRealmZones(realm);

    // Dark overlay background
    ctx.fillStyle = 'rgba(0,0,0,0.92)';
    ctx.fillRect(0, 0, W, H);

    // Title bar
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(20, 20, W - 40, 50);
    ctx.fillStyle = accent;
    ctx.fillRect(20, 20, W - 40, 3);
    ctx.fillRect(20, 67, W - 40, 3);

    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('ZONE MAP', 40, 50);
    ctx.font = '11px "Courier New", monospace';
    ctx.fillStyle = accent;
    ctx.fillText('[ ESC / MAP to close ]', W - 200, 50);

    // Layout zones in a flow layout
    const BOX_W = 160, BOX_H = 70, GAP = 20;
    const cols = Math.min(3, zones.length);
    const startX = (W - (cols * (BOX_W + GAP) - GAP)) / 2;
    const startY = 100;

    const zonePositions: Record<string, { x: number; y: number }> = {};

    zones.forEach((zone, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const bx = startX + col * (BOX_W + GAP);
      const by = startY + row * (BOX_H + GAP);
      zonePositions[zone.id] = { x: bx + BOX_W / 2, y: by + BOX_H / 2 };

      const unlocked = isZoneUnlocked(zone, completedNodeIds);
      const isCurrent = zone.id === currentZoneId;

      // Box background
      ctx.fillStyle = isCurrent ? '#1a1a2e' : unlocked ? '#0e0e1a' : '#080808';
      ctx.fillRect(bx, by, BOX_W, BOX_H);

      // Border (2px)
      const borderCol = isCurrent ? accent : unlocked ? '#444466' : '#222233';
      ctx.fillStyle = borderCol;
      ctx.fillRect(bx, by, BOX_W, 2);
      ctx.fillRect(bx, by + BOX_H - 2, BOX_W, 2);
      ctx.fillRect(bx, by, 2, BOX_H);
      ctx.fillRect(bx + BOX_W - 2, by, 2, BOX_H);

      // Current indicator
      if (isCurrent) {
        ctx.fillStyle = accent;
        ctx.fillRect(bx + 4, by + 4, 8, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(bx + 6, by + 6, 4, 4);
      }

      // Lock icon if locked
      if (!unlocked) {
        ctx.fillStyle = '#555566';
        ctx.fillRect(bx + BOX_W - 20, by + 8, 12, 9);
        ctx.fillRect(bx + BOX_W - 18, by + 4, 8, 7);
        ctx.fillStyle = '#333344';
        ctx.fillRect(bx + BOX_W - 17, by + 5, 6, 5);
      }

      // Zone icon and name
      ctx.font = '18px serif';
      ctx.fillText(zone.icon, bx + 10, by + 30);

      ctx.font = `bold 10px "Courier New", monospace`;
      ctx.fillStyle = unlocked ? '#ffffff' : '#555566';
      ctx.fillText(zone.name.slice(0, 18), bx + 36, by + 26);

      ctx.font = '8px "Courier New", monospace';
      ctx.fillStyle = unlocked ? '#888899' : '#333344';
      // Wrap description to 2 lines
      const desc = zone.description.slice(0, 60);
      ctx.fillText(desc.slice(0, 30), bx + 36, by + 40);
      if (desc.length > 30) ctx.fillText(desc.slice(30, 60), bx + 36, by + 52);
    });

    // Draw connection lines between connected zones
    zones.forEach(zone => {
      const posA = zonePositions[zone.id];
      if (!posA) return;
      zone.connections.forEach(connId => {
        const posB = zonePositions[connId];
        if (!posB) return;
        // Only draw each connection once (lower id draws it)
        if (zone.id > connId) return;
        const steps = 20;
        ctx.fillStyle = 'rgba(100,100,180,0.4)';
        for (let s = 0; s <= steps; s++) {
          const lx = posA.x + (posB.x - posA.x) * s / steps;
          const ly = posA.y + (posB.y - posA.y) * s / steps;
          ctx.fillRect(lx - 1, ly - 1, 2, 2);
        }
      });
    });

    // Close button
    ctx.fillStyle = '#1a0a1a';
    ctx.fillRect(W - 80, H - 50, 60, 28);
    ctx.fillStyle = '#ff4466';
    ctx.fillRect(W - 80, H - 50, 60, 2);
    ctx.fillRect(W - 80, H - 24, 60, 2);
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#ff4466';
    ctx.fillText('[ CLOSE ]', W - 75, H - 32);
  }, [realm, currentZoneId, completedNodeIds]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const zones = getRealmZones(realm);
    const cols = Math.min(3, zones.length);
    const BOX_W = 160, BOX_H = 70, GAP = 20;
    const startX = (canvas.width - (cols * (BOX_W + GAP) - GAP)) / 2;
    const startY = 100;
    zones.forEach((zone, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const bx = startX + col * (BOX_W + GAP);
      const by = startY + row * (BOX_H + GAP);
      if (mx >= bx && mx <= bx + BOX_W && my >= by && my <= by + BOX_H) {
        if (isZoneUnlocked(zone, completedNodeIds)) {
          onZoneSelect(zone.id);
        }
      }
    });
    // Close button
    if (mx >= canvas.width - 80 && my >= canvas.height - 50) onClose();
  }, [realm, completedNodeIds, onZoneSelect, onClose]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 1000,
        cursor: 'pointer',
        imageRendering: 'pixelated',
      }}
    />
  );
}
