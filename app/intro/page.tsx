'use client';
import IntroEngine from '@/components/intro/IntroEngine';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';

export default function IntroPage() {
  const router = useRouter();
  const { completeOnboarding } = useGameStore();

  const handleComplete = () => {
    completeOnboarding();
    router.push('/realm/1');
  };

  return <IntroEngine onComplete={handleComplete} />;
}
