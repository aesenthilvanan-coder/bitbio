"use client";
import { useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import GameHUD from "@/components/layout/GameHUD";
import { ACHIEVEMENTS } from "@/lib/achievements";

export default function AchievementsPage() {
  const { progress } = useGameStore();
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");

  const visible = ACHIEVEMENTS.filter((a) => {
    const earned = progress.achievements.includes(a.id);
    if (filter === "earned") return earned;
    if (filter === "locked") return !earned;
    return !a.secret || earned; // hide secret locked achievements
  });

  const earnedCount = progress.achievements.length;
  const totalCount = ACHIEVEMENTS.filter((a) => !a.secret).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ paddingTop: 56 }}>
      <GameHUD />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/profile" className="font-pixel text-[7px] text-gray-500 hover:text-gray-300 block mb-2">
              ← PROFILE
            </Link>
            <h1 className="font-pixel text-[12px] text-[#39ff14] glow-neon">ACHIEVEMENTS</h1>
          </div>
          <div className="text-right">
            <p className="font-pixel text-[18px] text-[#f59e0b]">{earnedCount}</p>
            <p className="font-pixel text-[7px] text-gray-500">/ {totalCount} earned</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "earned", "locked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-pixel text-[7px] px-4 py-2 border-2 transition-all capitalize ${
                filter === f ? "border-[#39ff14] text-[#39ff14] bg-[#39ff1410]" : "border-[#374151] text-gray-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((achievement) => {
            const earned = progress.achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`achievement-badge pixel-card border p-4 text-center transition-all ${
                  earned ? "hover:scale-105" : "achievement-locked"
                }`}
                style={{
                  borderColor: earned ? `${achievement.color}60` : "#374151",
                  boxShadow: earned ? `0 0 10px ${achievement.color}30` : "none",
                }}
              >
                <div className={`text-4xl mb-3 ${earned ? "animate-float" : ""}`}>{achievement.icon}</div>
                <p
                  className="font-pixel text-[7px] leading-relaxed mb-2"
                  style={{ color: earned ? achievement.color : "#6b7280" }}
                >
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{achievement.description}</p>
                {earned && (
                  <p className="font-pixel text-[6px] text-[#f59e0b]">+{achievement.xpReward} XP</p>
                )}
                {!earned && achievement.secret && (
                  <p className="font-pixel text-[6px] text-gray-600">🔒 SECRET</p>
                )}
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-16">
            <p className="font-pixel text-[10px] text-gray-600">
              {filter === "earned" ? "No achievements yet — keep learning!" : "All achievements earned!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
