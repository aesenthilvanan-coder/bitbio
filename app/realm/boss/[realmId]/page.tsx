'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BossBattle from '@/components/world/BossBattle';
import { useGameStore } from '@/lib/store';
import type { Realm } from '@/lib/types';

export default function BossPage() {
  const params = useParams();
  const router = useRouter();
  const realmId = Number(params.realmId) as Realm;
  const { unlockRealm, defeatBoss, awardXP, awardGems, progress } = useGameStore();

  const handleVictory = () => {
    defeatBoss(realmId);
    awardXP(1000);
    awardGems(100);
    const nextRealm = (realmId + 1) as Realm;
    if (realmId < 4) {
      unlockRealm(nextRealm);
      router.push(`/realm/${nextRealm}`);
    } else {
      router.push('/certificate');
    }
  };

  const handleDefeat = () => {
    router.push(`/realm/${realmId}`);
  };

  return (
    <BossBattle
      realm={realmId}
      onVictory={handleVictory}
      onDefeat={handleDefeat}
    />
  );
}
