'use client';
import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';

export default function DailyReward() {
  const { progress, claimDailyReward } = useGameStore();
  const [show, setShow] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.dailyRewardDate !== today) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show || claimed) return null;

  const streak = progress.streakDays;
  let gems = 10;
  let xp = 0;
  let label = 'DAILY BONUS';
  if (streak >= 6) { gems = 50; xp = 500; label = 'WEEK STREAK!'; }
  else if (streak >= 3) { gems = 25; label = '3-DAY STREAK!'; }

  const handleClaim = () => {
    claimDailyReward();
    setClaimed(true);
    setTimeout(() => setShow(false), 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
    }}>
      <div style={{
        background: '#0a0a0a',
        border: '2px solid #f59e0b',
        boxShadow: '0 0 40px #f59e0b44, 0 0 80px #f59e0b22',
        padding: '32px 40px',
        textAlign: 'center',
        maxWidth: 320,
        width: '90%',
        fontFamily: "'Press Start 2P', monospace",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {claimed ? '✨' : '🎁'}
        </div>
        <div style={{ fontSize: 8, color: '#f59e0b', marginBottom: 8, letterSpacing: 2 }}>
          {claimed ? 'CLAIMED!' : label}
        </div>
        {!claimed && (
          <>
            <div style={{ fontSize: 7, color: '#888', marginBottom: 16 }}>
              DAY {streak + 1} LOGIN REWARD
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>💎</div>
                <div style={{ fontSize: 10, color: '#00ffff', marginTop: 4 }}>+{gems}</div>
                <div style={{ fontSize: 6, color: '#555', marginTop: 2 }}>GEMS</div>
              </div>
              {xp > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20 }}>⭐</div>
                  <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 4 }}>+{xp}</div>
                  <div style={{ fontSize: 6, color: '#555', marginTop: 2 }}>XP</div>
                </div>
              )}
            </div>
            <button
              onClick={handleClaim}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                padding: '10px 20px',
                background: '#1a0f00',
                border: '2px solid #f59e0b',
                color: '#f59e0b',
                cursor: 'pointer',
                letterSpacing: 1,
                width: '100%',
              }}
            >
              CLAIM REWARD
            </button>
            <button
              onClick={() => setShow(false)}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 6,
                padding: '6px 12px',
                background: 'transparent',
                border: 'none',
                color: '#444',
                cursor: 'pointer',
                marginTop: 8,
                letterSpacing: 1,
              }}
            >
              LATER
            </button>
          </>
        )}
      </div>
    </div>
  );
}
