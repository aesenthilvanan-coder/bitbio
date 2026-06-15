'use client';
import { useParams, useRouter } from 'next/navigation';
import BossBattle from '@/components/world/BossBattle';

export default function BossPage() {
  const params = useParams();
  const router = useRouter();
  const realmId = Number(params.realmId) as 1 | 2 | 3 | 4;
  return (
    <BossBattle
      realm={realmId}
      onVictory={() => router.push(`/realm/${realmId}`)}
      onDefeat={() => router.push(`/realm/${realmId}`)}
    />
  );
}
