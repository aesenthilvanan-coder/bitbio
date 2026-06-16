'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PixelWorldEngine from '@/components/world/PixelWorldEngine';
import WorldEntryAnimation from '@/components/world/WorldEntryAnimation';
import GameHUD from '@/components/layout/GameHUD';
import HenryReveal from '@/components/effects/HenryReveal';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';

export default function Realm4Page() {
  const router = useRouter();
  const { progress, userName } = useGameStore();
  const [showEntry, setShowEntry] = useState(false);
  const [showHenryReveal, setShowHenryReveal] = useState(false);

  useEffect(() => {
    if (!progress.unlockedRealms.includes(4)) return;

    // Check world entry first
    if (!localStorage.getItem('visitedRealm4')) {
      setShowEntry(true);
      return;
    }

    // Henry Lacks reveal: show if not seen AND player has completed at least 1 Realm 4 node
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
      <PixelWorldEngine realm={4} onEnterNode={(id) => router.push(`/lesson/4/${id}`)} />
    </div>
  );
}
