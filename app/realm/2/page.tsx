'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import PixelWorldEngine from '@/components/world/PixelWorldEngine';
import WorldEntryAnimation from '@/components/world/WorldEntryAnimation';
import GameHUD from '@/components/layout/GameHUD';
import { useGameStore } from '@/lib/store';
import { getRealmNodes } from '@/lib/curriculum';
import Link from 'next/link';

const REALM_TOTAL_NODES = Math.min(getRealmNodes(2).length, 9);
const REALM_NODE_IDS = getRealmNodes(2).slice(0, 9).map((n) => n.id);

export default function Realm2Page() {
  const router = useRouter();
  const { progress } = useGameStore();
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    if (progress.unlockedRealms.includes(2) && !localStorage.getItem('visitedRealm2')) {
      setShowEntry(true);
    }
  }, [progress.unlockedRealms]);

  const completedCount = useMemo(() => {
    return REALM_NODE_IDS.filter((id) => progress.completedNodes[id]?.completed).length;
  }, [progress.completedNodes]);

  const bossAvailable = completedCount >= REALM_TOTAL_NODES;
  const bossDefeated = progress.bossesDefeated?.includes(2);

  if (!progress.unlockedRealms.includes(2)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <GameHUD />
        <div className="text-center px-4 mt-16">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-pixel text-[12px] text-[#ef4444] mb-4">REALM LOCKED</h1>
          <p className="text-gray-400 mb-6">Complete the previous realm to unlock this one.</p>
          <Link href="/realm/1" className="pixel-btn pixel-btn-neon">← GO BACK</Link>
        </div>
      </div>
    );
  }

  if (showEntry) {
    return (
      <WorldEntryAnimation
        realm={2}
        onComplete={() => {
          localStorage.setItem('visitedRealm2', '1');
          setShowEntry(false);
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#030808' }}>
      <GameHUD />
      <PixelWorldEngine
        realm={2}
        onEnterNode={(id) => {
          if (id === 'BOSS') router.push('/realm/boss/2');
          else router.push(`/lesson/2/${id}`);
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
            onClick={() => router.push('/realm/boss/2')}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              padding: '12px 24px',
              background: '#001a00',
              border: '2px solid #00ff44',
              color: '#00ff44',
              boxShadow: '0 0 20px #00ff4466, 0 0 40px #00ff4433',
              cursor: 'pointer',
              letterSpacing: 2,
              animation: 'pulse 2s infinite',
            }}
          >
            ⚔ CHALLENGE VIRON — REALM BOSS
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
          color: '#52b788',
          padding: '8px 16px',
          background: '#001a0e',
          border: '1px solid #52b78844',
        }}>
          ✓ VIRON DEFEATED — NEURAL NEBULA AWAITS
        </div>
      )}
    </div>
  );
}
