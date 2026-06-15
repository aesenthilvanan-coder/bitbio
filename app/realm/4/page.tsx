'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PixelWorldEngine from '@/components/world/PixelWorldEngine';
import WorldEntryAnimation from '@/components/world/WorldEntryAnimation';
import GameHUD from '@/components/layout/GameHUD';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';

export default function Realm4Page() {
  const router = useRouter();
  const { progress } = useGameStore();
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    if (progress.unlockedRealms.includes(4) && !localStorage.getItem('visitedRealm4')) {
      setShowEntry(true);
    }
  }, [progress.unlockedRealms]);

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

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#020408' }}>
      <GameHUD />
      <PixelWorldEngine realm={4} onEnterNode={(id) => router.push(`/lesson/4/${id}`)} />
    </div>
  );
}
