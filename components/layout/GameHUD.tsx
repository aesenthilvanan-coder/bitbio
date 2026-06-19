"use client";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import HeartDisplay from "@/components/ui/HeartDisplay";
import XPDisplay from "@/components/ui/XPDisplay";
import { getAchievement } from "@/lib/achievements";
import { useEffect, useState } from "react";

export default function GameHUD() {
  const { progress, dismissAchievement, showAchievementModal } = useGameStore();
  const [xpFlash, setXpFlash] = useState(false);

  useEffect(() => {
    if (progress.totalXP > 0) {
      setXpFlash(true);
      setTimeout(() => setXpFlash(false), 600);
    }
  }, [progress.totalXP]);

  const achievement = showAchievementModal ? getAchievement(showAchievementModal) : null;

  return (
    <>
      {/* HUD Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b-2 border-[#374151] px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/realm/1" className="font-pixel text-[10px] text-[#39ff14] glow-neon hover:text-white transition-colors flex-shrink-0">
            BIT<span className="text-[#00ff88]">BIO</span>
          </Link>

          {/* Center — XP */}
          <div className={`flex-1 max-w-xs ${xpFlash ? "animate-xp-flash" : ""}`}>
            <XPDisplay xp={progress.totalXP} compact />
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {[
              { href: '/quests', icon: '📜', label: 'QUESTS' },
              { href: '/codex', icon: '📖', label: 'CODEX' },
              { href: '/research', icon: '🔬', label: 'RESEARCH' },
              { href: '/achievements', icon: '🏆', label: 'TROPHIES' },
            ].map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-[#374151] hover:bg-[#1f2937] transition-all"
                title={nav.label}
              >
                <span className="text-sm">{nav.icon}</span>
                <span className="font-pixel text-[6px] text-gray-500 hover:text-gray-300 hidden lg:block">{nav.label}</span>
              </Link>
            ))}
          </div>

          {/* Right — Hearts + Gems + Streak */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Streak */}
            {progress.streakDays > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-lg">🔥</span>
                <span className="font-pixel text-[8px] text-[#f59e0b]">{progress.streakDays}</span>
              </div>
            )}

            {/* Gems — link to shop */}
            <Link href="/shop" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="text-sm">💎</span>
              <span className="font-pixel text-[8px] text-[#00ffff]">{progress.gems}</span>
            </Link>

            {/* Hearts */}
            <HeartDisplay hearts={progress.hearts} maxHearts={progress.maxHearts} size="sm" />

            {/* Profile */}
            <Link href="/profile" className="w-8 h-8 rounded-none border-2 border-[#374151] hover:border-[#39ff14] transition-colors flex items-center justify-center bg-[#1f2937]">
              <span className="text-sm">👤</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      {achievement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div
            className="pixel-card max-w-sm w-full p-6 text-center animate-achievement-pop"
            style={{ border: `2px solid ${achievement.color}`, boxShadow: `0 0 30px ${achievement.color}60` }}
          >
            <div className="text-6xl mb-4 animate-float">{achievement.icon}</div>
            <p className="font-pixel text-[8px] text-gray-400 mb-2">ACHIEVEMENT UNLOCKED</p>
            <h2 className="font-pixel text-[14px] mb-3" style={{ color: achievement.color }}>
              {achievement.title}
            </h2>
            <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
            <p className="font-pixel text-[10px] text-[#f59e0b]">+{achievement.xpReward} XP</p>
            <button
              onClick={dismissAchievement}
              className="pixel-btn pixel-btn-neon mt-4"
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
