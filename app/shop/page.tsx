'use client';
import { useState } from 'react';
import Link from 'next/link';
import GameHUD from '@/components/layout/GameHUD';
import { useGameStore } from '@/lib/store';

interface ShopItem {
  id: string;
  icon: string;
  name: string;
  description: string;
  cost: number;
  currency: 'gems';
  action: 'hearts' | 'xp' | 'skip' | 'hint' | 'aura';
  value?: number;
  colorAccent: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'heart-refill',
    icon: '❤️',
    name: 'Heart Refill',
    description: 'Restore all hearts instantly. Never stop learning.',
    cost: 10,
    currency: 'gems',
    action: 'hearts',
    colorAccent: '#ef4444',
  },
  {
    id: 'xp-boost-sm',
    icon: '⭐',
    name: 'XP Capsule',
    description: 'Inject 500 XP directly into your brain. Science!',
    cost: 25,
    currency: 'gems',
    action: 'xp',
    value: 500,
    colorAccent: '#f59e0b',
  },
  {
    id: 'xp-boost-lg',
    icon: '🌟',
    name: 'XP Overdrive',
    description: 'A massive 2,000 XP surge. Handle with care.',
    cost: 75,
    currency: 'gems',
    action: 'xp',
    value: 2000,
    colorAccent: '#fbbf24',
  },
  {
    id: 'skip-token',
    icon: '⏭️',
    name: 'Skip Token',
    description: "Skip one exercise. Enzyme won't judge. Much.",
    cost: 15,
    currency: 'gems',
    action: 'skip',
    colorAccent: '#00ffcc',
  },
  {
    id: 'hint-bundle',
    icon: '💡',
    name: 'Hint Bundle',
    description: '5 hints for tough exercises. Use wisely.',
    cost: 20,
    currency: 'gems',
    action: 'hint',
    value: 5,
    colorAccent: '#60a5fa',
  },
  {
    id: 'aura-cyan',
    icon: '💠',
    name: 'Cyan Aura',
    description: 'A crackling teal aura. Makes you look like you know things.',
    cost: 50,
    currency: 'gems',
    action: 'aura',
    value: 1,
    colorAccent: '#00ffff',
  },
  {
    id: 'aura-purple',
    icon: '🔮',
    name: 'Neural Aura',
    description: 'Purple synaptic glow. For the machine learning aesthetic.',
    cost: 50,
    currency: 'gems',
    action: 'aura',
    value: 2,
    colorAccent: '#a855f7',
  },
  {
    id: 'aura-gold',
    icon: '✨',
    name: 'Golden Aura',
    description: 'Pure gold shimmer. Certified genius energy.',
    cost: 100,
    currency: 'gems',
    action: 'aura',
    value: 3,
    colorAccent: '#fbbf24',
  },
];

export default function ShopPage() {
  const { progress, spendGems, refillHearts, awardXP, setAvatar } = useGameStore();
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean } | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const showFeedback = (message: string, ok: boolean) => {
    setFeedback({ message, ok });
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleBuy = (item: ShopItem) => {
    if (purchasing) return;
    setPurchasing(item.id);

    const success = spendGems(item.cost);
    if (!success) {
      showFeedback('NOT ENOUGH GEMS!', false);
      setPurchasing(null);
      return;
    }

    switch (item.action) {
      case 'hearts':
        refillHearts();
        showFeedback('HEARTS RESTORED!', true);
        break;
      case 'xp':
        awardXP(item.value ?? 0);
        showFeedback(`+${item.value} XP GAINED!`, true);
        break;
      case 'skip':
        // Skip tokens stored in localStorage for lesson engine
        const skips = parseInt(localStorage.getItem('skipTokens') || '0', 10);
        localStorage.setItem('skipTokens', String(skips + 1));
        showFeedback('SKIP TOKEN ADDED!', true);
        break;
      case 'hint':
        const hints = parseInt(localStorage.getItem('hintCredits') || '0', 10);
        localStorage.setItem('hintCredits', String(hints + (item.value ?? 1)));
        showFeedback(`+${item.value} HINTS ADDED!`, true);
        break;
      case 'aura':
        setAvatar({ auraEffect: item.value ?? 0 });
        showFeedback('AURA UNLOCKED!', true);
        break;
    }

    setTimeout(() => setPurchasing(null), 500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#08080e', paddingTop: 56 }}>
      <GameHUD />

      {/* Feedback toast */}
      {feedback && (
        <div style={{
          position: 'fixed',
          top: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: feedback.ok ? '#001a0e' : '#1a0000',
          border: `2px solid ${feedback.ok ? '#39ff14' : '#ef4444'}`,
          padding: '10px 20px',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: feedback.ok ? '#39ff14' : '#ef4444',
          boxShadow: feedback.ok ? '0 0 20px #39ff1444' : '0 0 20px #ef444444',
          pointerEvents: 'none',
        }}>
          {feedback.message}
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <Link href="/realm/1" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#444',
              textDecoration: 'none',
              display: 'block',
              marginBottom: 8,
            }}>← BACK</Link>
            <h1 style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 14,
              color: '#00ffff',
              textShadow: '0 0 10px #00ffff66',
              margin: 0,
            }}>ENZYME'S SHOP</h1>
            <p style={{ color: '#555', fontSize: 11, margin: '8px 0 0 0' }}>
              "Everything here is scientifically certified to be worth your gems." — Enzyme
            </p>
          </div>
          <div style={{
            background: '#080810',
            border: '2px solid #00ffff44',
            padding: '12px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24 }}>💎</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#00ffff', marginTop: 4 }}>
              {progress.gems}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#555', marginTop: 2 }}>
              YOUR GEMS
            </div>
          </div>
        </div>

        {/* Shop grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {SHOP_ITEMS.map((item) => {
            const canAfford = progress.gems >= item.cost;
            return (
              <div
                key={item.id}
                style={{
                  background: '#0a0a0a',
                  border: `2px solid ${canAfford ? item.colorAccent + '44' : '#1a1a1a'}`,
                  padding: 20,
                  transition: 'all 0.2s',
                  opacity: canAfford ? 1 : 0.7,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>{item.icon}</div>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: item.colorAccent,
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  {item.name}
                </div>
                <p style={{
                  color: '#666',
                  fontSize: 11,
                  marginBottom: 16,
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  {item.description}
                </p>
                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford || purchasing === item.id}
                  style={{
                    width: '100%',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    padding: '10px 0',
                    background: canAfford ? '#0a0f0a' : '#0a0a0a',
                    border: `2px solid ${canAfford ? item.colorAccent : '#333'}`,
                    color: canAfford ? item.colorAccent : '#444',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <span>💎</span>
                  <span>{item.cost} GEMS</span>
                </button>
              </div>
            );
          })}
        </div>

        <p style={{
          textAlign: 'center',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 6,
          color: '#333',
          marginTop: 32,
        }}>
          EARN GEMS BY COMPLETING LESSONS AND QUESTS
        </p>
      </div>
    </div>
  );
}
