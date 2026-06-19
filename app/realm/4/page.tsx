'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import PixelWorldEngine from '@/components/world/PixelWorldEngine';
import WorldEntryAnimation from '@/components/world/WorldEntryAnimation';
import GameHUD from '@/components/layout/GameHUD';
import HenryReveal from '@/components/effects/HenryReveal';
import { useGameStore } from '@/lib/store';
import { getRealmNodes } from '@/lib/curriculum';
import Link from 'next/link';

const REALM_TOTAL_NODES = Math.min(getRealmNodes(4).length, 9);
const REALM_NODE_IDS = getRealmNodes(4).slice(0, 9).map((n) => n.id);

export default function Realm4Page() {
  const router = useRouter();
  const { progress, userName } = useGameStore();
  const [showEntry, setShowEntry] = useState(false);
  const [showHenryReveal, setShowHenryReveal] = useState(false);

  useEffect(() => {
    if (!progress.unlockedRealms.includes(4)) return;

    if (!localStorage.getItem('visitedRealm4')) {
      setShowEntry(true);
      return;
    }

    if (!localStorage.getItem('henryRevealSeen')) {
      const realm4NodeIds = Object.keys(progress.completedNodes).filter((id) =>
        id.startsWith('l4-')
      );
      const hasCompletedRealm4Node = realm4NodeIds.some(
        (id) => progress.completedNodes[id]?.completed
      );
      if (hasCompletedRealm4Node) {
        setShowHenryReveal(true);
      }
    }
  }, [progress.unlockedRealms, progress.completedNodes]);

  const completedCount = useMemo(() => {
    return REALM_NODE_IDS.filter((id) => progress.completedNodes[id]?.completed).length;
  }, [progress.completedNodes]);

  const bossAvailable = completedCount >= REALM_TOTAL_NODES;
  const bossDefeated = progress.bossesDefeated?.includes(4);

  if (!progress.unlockedRealms.includes(4)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <GameHUD />
        <div className="text-center px-4 mt-16">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-pixel text-[12px] text-[#ef4444] mb-4">REALM LOCKED</h1>
          <p className="text-gray-400 mb-6">Complete the previous realm to unlock this one.</p>
          <Link href="/realm/3" className="pixel-btn pixel-btn-neon">← GO BACK</Link>
        </div>
      </div>
    );
  }

  if (showEntry) {
    return (
      <WorldEntryAnimation
        realm={4}
        onComplete={() => {
          localStorage.setItem('visitedRealm4', '1');
          setShowEntry(false);
        }}
      />
    );
  }

  if (showHenryReveal) {
    return (
      <HenryReveal
        playerName={userName || 'Explorer'}
        onComplete={() => {
          localStorage.setItem('henryRevealSeen', '1');
          setShowHenryReveal(false);
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020408' }}>
      <GameHUD />
      <PixelWorldEngine
        realm={4}
        onEnterNode={(id) => {
          if (id === 'BOSS') router.push('/realm/boss/4');
          else router.push(`/lesson/4/${id}`);
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
            onClick={() => router.push('/realm/boss/4')}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              padding: '12px 24px',
              background: '#0a0815',
              border: '2px solid #c0a0ff',
              color: '#c0a0ff',
              boxShadow: '0 0 20px #c0a0ff66, 0 0 40px #c0a0ff33',
              cursor: 'pointer',
              letterSpacing: 2,
              animation: 'pulse 2s infinite',
            }}
          >
            ⚔ CHALLENGE AMYLOID TYRANT — FINAL BOSS
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
          color: '#c0a0ff',
          padding: '8px 16px',
          background: '#0a0815',
          border: '1px solid #c0a0ff44',
          cursor: 'pointer',
        }}
        onClick={() => router.push('/certificate')}
        >
          🎓 AMYLOID TYRANT DEFEATED — VIEW CERTIFICATE
        </div>
      )}
    </div>
  );
}
