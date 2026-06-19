'use client';
import { useState } from 'react';
import Link from 'next/link';
import GameHUD from '@/components/layout/GameHUD';
import { useGameStore } from '@/lib/store';
import { QUESTS, getCompletableQuests, getCompletedQuests } from '@/lib/quests';
import type { Quest } from '@/lib/quests';

const REALM_COLORS: Record<number, string> = {
  1: '#00ffcc', 2: '#52b788', 3: '#a855f7', 4: '#c0a0ff',
};
const REALM_NAMES: Record<number, string> = {
  1: 'CYTOPLASM', 2: 'GENOME FOREST', 3: 'NEURAL NEBULA', 4: 'PROTEIN CATHEDRAL',
};

function QuestCard({ quest, claimable, completed, onClaim }: {
  quest: Quest;
  claimable: boolean;
  completed: boolean;
  onClaim: (q: Quest) => void;
}) {
  const color = REALM_COLORS[quest.realmId];
  return (
    <div style={{
      background: completed ? '#060606' : claimable ? '#0a0f08' : '#080808',
      border: `2px solid ${completed ? '#33333366' : claimable ? color : '#222'}`,
      boxShadow: claimable ? `0 0 12px ${color}33` : 'none',
      padding: 16,
      marginBottom: 12,
      opacity: completed ? 0.6 : 1,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{quest.npcIcon}</span>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: completed ? '#555' : claimable ? color : '#888',
              letterSpacing: 1,
            }}>
              {quest.title}
            </span>
            {completed && <span style={{ fontSize: 10 }}>✓</span>}
          </div>
          <p style={{ fontSize: 11, color: '#666', margin: '0 0 8px 0', lineHeight: 1.5 }}>
            {quest.description}
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#f59e0b' }}>
              +{quest.reward.xp} XP
            </span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#00ffff' }}>
              +{quest.reward.gems} 💎
            </span>
          </div>
          {completed && (
            <p style={{
              fontSize: 10,
              color: '#444',
              fontStyle: 'italic',
              marginTop: 8,
              lineHeight: 1.6,
              borderLeft: `2px solid #333`,
              paddingLeft: 8,
            }}>
              {quest.lore}
            </p>
          )}
        </div>
        {claimable && !completed && (
          <button
            onClick={() => onClaim(quest)}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              padding: '8px 14px',
              background: '#0a1a0a',
              border: `2px solid ${color}`,
              color: color,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: `0 0 8px ${color}44`,
            }}
          >
            CLAIM
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuestsPage() {
  const { progress, completeQuest, awardXP, awardGems } = useGameStore();
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [claimLore, setClaimLore] = useState<string | null>(null);

  const claimableQuests = getCompletableQuests(progress);
  const completedQuests = getCompletedQuests(progress);
  const activeQuests = QUESTS.filter(
    (q) => !progress.questsCompleted.includes(q.id) && !q.condition(progress)
  );

  const handleClaim = (quest: Quest) => {
    completeQuest(quest.id);
    awardXP(quest.reward.xp);
    awardGems(quest.reward.gems);
    setClaimLore(quest.lore);
    setTimeout(() => setClaimLore(null), 4000);
  };

  const visibleQuests = filter === 'active'
    ? [...claimableQuests, ...activeQuests]
    : completedQuests;

  return (
    <div style={{ minHeight: '100vh', background: '#08080e', paddingTop: 56 }}>
      <GameHUD />

      {claimLore && (
        <div style={{
          position: 'fixed',
          top: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: '#0a0a0a',
          border: '2px solid #39ff14',
          boxShadow: '0 0 20px #39ff1444',
          padding: '12px 20px',
          maxWidth: 400,
          width: '90%',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          color: '#39ff14',
          textAlign: 'center',
          lineHeight: 1.8,
        }}>
          QUEST COMPLETE! ✓
        </div>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
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
              color: '#39ff14',
              textShadow: '0 0 10px #39ff1466',
              margin: 0,
            }}>QUEST LOG</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: '#f59e0b' }}>
              {completedQuests.length}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#555' }}>
              / {QUESTS.length} COMPLETE
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                padding: '8px 16px',
                background: filter === f ? '#0a1a0a' : 'transparent',
                border: `2px solid ${filter === f ? '#39ff14' : '#333'}`,
                color: filter === f ? '#39ff14' : '#555',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {f} {f === 'active' ? `(${claimableQuests.length + activeQuests.length})` : `(${completedQuests.length})`}
            </button>
          ))}
        </div>

        {/* Claimable banner */}
        {filter === 'active' && claimableQuests.length > 0 && (
          <div style={{
            background: '#0a1a08',
            border: '1px solid #39ff1444',
            padding: '8px 12px',
            marginBottom: 16,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: '#39ff14',
          }}>
            {claimableQuests.length} QUEST{claimableQuests.length > 1 ? 'S' : ''} READY TO CLAIM ▼
          </div>
        )}

        {/* Quest list */}
        {visibleQuests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 48,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: '#333',
          }}>
            {filter === 'completed' ? 'NO QUESTS COMPLETED YET' : 'ALL QUESTS COMPLETE!'}
          </div>
        ) : (
          visibleQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              claimable={claimableQuests.includes(quest)}
              completed={progress.questsCompleted.includes(quest.id)}
              onClaim={handleClaim}
            />
          ))
        )}
      </div>
    </div>
  );
}
