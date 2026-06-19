'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import PixelWorldEngine from '@/components/world/PixelWorldEngine';
import WorldEntryAnimation from '@/components/world/WorldEntryAnimation';
import GameHUD from '@/components/layout/GameHUD';
import { useGameStore } from '@/lib/store';
import { getRealmNodes } from '@/lib/curriculum';
import Link from 'next/link';

const REALM_TOTAL_NODES = Math.min(getRealmNodes(3).length, 9);
const REALM_NODE_IDS = getRealmNodes(3).slice(0, 9).map((n) => n.id);

export default function Realm3Page() {
  const router = useRouter();
  const { progress } = useGameStore();
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    if (progress.unlockedRealms.includes(3) && !localStorage.getItem('visitedRealm3')) {
      setShowEntry(true);
    }
  }, [progress.unlockedRealms]);

  const completedCount = useMemo(() => {
    return REALM_NODE_IDS.filter((id) => progress.completedNodes[id]?.completed).length;
  }, [progress.completedNodes]);

  const bossAvailable = completedCount >= REALM_TOTAL_NODES;
  const bossDefeated = progress.bossesDefeated?.includes(3);

  if (!progress.unlockedRealms.includes(3)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <GameHUD />
        <div className="text-center px-4 mt-16">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-pixel text-[12px] text-[#ef4444] mb-4">REALM LOCKED</h1>
          <p className="text-gray-400 mb-6">Complete the previous realm to unlock this one.</p>
          <Link href="/realm/2" className="pixel-btn pixel-btn-neon">← GO BACK</Link>
        </div>
      </div>
    );
  }

  if (showEntry) {
    return (
      <WorldEntryAnimation
        realm={3}
        onComplete={() => {
          localStorage.setItem('visitedRealm3', '1');
          setShowEntry(false);
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#030308' }}>
      <GameHUD />
      <PixelWorldEngine
        realm={3}
        onEnterNode={(id) => {
          if (id === 'BOSS') router.push('/realm/boss/3');
          else router.push(`/lesson/3/${id}`);
        }}
      />
      {bossAvailable && !bossDefeated && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
        }}>
          <button
            onClick={() => router.push('/realm/boss/3')}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              padding: '12px 24px',
              background: '#0a001a',
              border: '2px solid #aa44ff',
              color: '#cc88ff',
              boxShadow: '0 0 20px #aa44ff66, 0 0 40px #aa44ff33',
              cursor: 'pointer',
              letterSpacing: 2,
              animation: 'pulse 2s infinite',
            }}
          >
            ⚔ CHALLENGE OVERFIT — REALM BOSS
          </button>
        </div>
      )}
      {bossDefeated && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: '#a855f7',
          padding: '8px 16px',
          background: '#0a001a',
          border: '1px solid #a855f744',
        }}>
          ✓ OVERFIT DEFEATED — PROTEIN CATHEDRAL AWAITS
        </div>
      )}
    </div>
  );
}
