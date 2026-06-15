"use client";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";
import GameHUD from "@/components/layout/GameHUD";
import XPDisplay from "@/components/ui/XPDisplay";
import HeartDisplay from "@/components/ui/HeartDisplay";
import ProgressBar from "@/components/ui/ProgressBar";
import { LEVELS } from "@/lib/curriculum";
import { ACHIEVEMENTS } from "@/lib/achievements";
import type { Realm } from "@/lib/types";

const REALM_COLORS: Record<number, string> = { 1: "#39ff14", 2: "#52b788", 3: "#a855f7", 4: "#00ffff" };

export default function ProfilePage() {
  const { progress, avatar, userName, userEmail } = useGameStore();

  const completedNodes = Object.values(progress.completedNodes).filter((n) => n.completed).length;
  const totalAchievements = ACHIEVEMENTS.filter((a) => !a.secret).length;
  const earnedAchievements = progress.achievements.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ paddingTop: 56 }}>
      <GameHUD />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          {/* Avatar */}
          <div className="relative">
            <div
              className="p-2 scanlines relative"
              style={{ background: "#111827", border: "3px solid #374151", boxShadow: "0 0 20px #39ff1430" }}
            >
              <AvatarRenderer config={avatar} size={100} animate />
            </div>
            <div
              className="absolute -bottom-2 -right-2 font-pixel text-[7px] px-2 py-1"
              style={{ background: "#0a0a0a", border: "1px solid #39ff14", color: "#39ff14" }}
            >
              LV.{progress.currentRealm}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-pixel text-[14px] text-white mb-1">{userName || "BitBio Player"}</h1>
            <p className="text-gray-500 text-sm mb-4">{userEmail}</p>
            <XPDisplay xp={progress.totalXP} />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🔥", label: "Streak", value: `${progress.streakDays}d` },
              { icon: "💎", label: "Gems", value: progress.gems },
              { icon: "❤️", label: "Hearts", value: `${progress.hearts}/${progress.maxHearts}` },
              { icon: "⭐", label: "Nodes", value: completedNodes },
            ].map((stat) => (
              <div key={stat.label} className="pixel-card border border-[#374151] p-3 text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="font-pixel text-[11px] text-[#39ff14]">{stat.value}</div>
                <div className="font-pixel text-[6px] text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Realm progress */}
        <section className="mb-10">
          <h2 className="font-pixel text-[10px] text-[#39ff14] mb-4">REALM PROGRESS</h2>
          <div className="space-y-3">
            {LEVELS.map((level) => {
              const nodes = level.modules.flatMap((m) => m.nodes);
              const completed = nodes.filter((n) => progress.completedNodes[n.id]?.completed).length;
              const pct = nodes.length > 0 ? (completed / nodes.length) * 100 : 0;
              const isUnlocked = progress.unlockedRealms.includes(level.id as Realm);
              const color = REALM_COLORS[level.id] ?? "#39ff14";
              return (
                <Link
                  key={level.id}
                  href={isUnlocked ? `/realm/${level.id}` : "#"}
                  className={`block pixel-card border p-4 transition-all ${isUnlocked ? "hover:border-current cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                  style={{ borderColor: isUnlocked ? `${color}60` : "#374151" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-pixel text-[7px]" style={{ color }}>
                        LV.{level.id} — {level.realm}
                      </p>
                      <p className="text-gray-400 text-xs">{level.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-pixel text-[8px] text-gray-400">{completed}/{nodes.length}</p>
                      {!isUnlocked && <p className="font-pixel text-[6px] text-gray-600">🔒 LOCKED</p>}
                    </div>
                  </div>
                  <ProgressBar value={pct} max={100} color={color} showPercent />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent achievements */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-pixel text-[10px] text-[#39ff14]">ACHIEVEMENTS</h2>
            <Link href="/achievements" className="font-pixel text-[7px] text-gray-500 hover:text-gray-300">
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {ACHIEVEMENTS.filter((a) => !a.secret).slice(0, 6).map((achievement) => {
              const earned = progress.achievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`achievement-badge pixel-card border p-3 text-center ${earned ? "" : "achievement-locked"}`}
                  style={{ borderColor: earned ? `${achievement.color}60` : "#374151" }}
                  title={achievement.title}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className="font-pixel text-[5px] leading-tight" style={{ color: earned ? achievement.color : "#6b7280" }}>
                    {achievement.title}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="font-pixel text-[7px] text-gray-600 mt-3 text-center">
            {earnedAchievements} / {totalAchievements} earned
          </p>
        </section>

        {/* Certificate link */}
        {progress.achievements.includes("all-levels") && (
          <section>
            <Link
              href="/certificate"
              className="block pixel-card cert-border p-6 text-center hover:bg-[#39ff1408] transition-colors"
            >
              <div className="text-4xl mb-3 animate-float">🎓</div>
              <p className="font-pixel text-[10px] text-[#39ff14] glow-neon">VIEW YOUR CERTIFICATE</p>
              <p className="text-gray-400 text-sm mt-2">Certified Computational Biologist</p>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
