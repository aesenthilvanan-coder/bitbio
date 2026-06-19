'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import PixelWorldEngine from '@/components/world/PixelWorldEngine';
import WorldEntryAnimation from '@/components/world/WorldEntryAnimation';
import GameHUD from '@/components/layout/GameHUD';
import DailyReward from '@/components/ui/DailyReward';
import { useGameStore } from '@/lib/store';
import { getRealmNodes } from '@/lib/curriculum';
import Link from 'next/link';

const REALM_TOTAL_NODES = Math.min(getRealmNodes(1).length, 9);
const REALM_NODE_IDS = getRealmNodes(1).slice(0, 9).map((n) => n.id);

export default function Realm1Page() {
  const router = useRouter();
  const { progress } = useGameStore();
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    if (progress.unlockedRealms.includes(1) && !localStorage.getItem('visitedRealm1')) {
      setShowEntry(true);
    }
  }, [progress.unlockedRealms]);

  const completedCount = useMemo(() => {
    return REALM_NODE_IDS.filter((id) => progress.completedNodes[id]?.completed).length;
  }, [progress.completedNodes]);

  const bossAvailable = completedCount >= REALM_TOTAL_NODES;
  const bossDefeated = progress.bossesDefeated?.includes(1);

  if (!progress.unlockedRealms.includes(1)) {
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
        realm={1}
        onComplete={() => {
          localStorage.setItem('visitedRealm1', '1');
          setShowEntry(false);
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050a05' }}>
      <GameHUD />
      <DailyReward />
      <PixelWorldEngine
        realm={1}
        onEnterNode={(id) => {
          if (id === 'BOSS') router.push('/realm/boss/1');
          else router.push(`/lesson/1/${id}`);
        }}
      />
      {bossAvailable && !bossDefeated && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          animation: 'pulse 2s infinite',
        }}>
          <button
            onClick={() => router.push('/realm/boss/1')}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              padding: '12px 24px',
              background: '#1a0000',
              border: '2px solid #ff0000',
              color: '#ff4444',
              boxShadow: '0 0 20px #ff000066, 0 0 40px #ff000033',
              cursor: 'pointer',
              letterSpacing: 2,
            }}
          >
            ⚔ CHALLENGE LYSO — REALM BOSS
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
          color: '#00ff88',
          padding: '8px 16px',
          background: '#001a0e',
          border: '1px solid #00ff8844',
        }}>
          ✓ LYSO DEFEATED — GENOME FOREST AWAITS
        </div>
      )}
    </div>
  );
}
