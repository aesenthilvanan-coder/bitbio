import type { Achievement, PlayerProgress } from "./types";

export const ACHIEVEMENTS: Achievement[] = [
  // ── Onboarding ──────────────────────────────────────────────────────────────
  {
    id: "first-steps",
    title: "First Steps",
    description: "Created your pixel avatar and began your journey",
    icon: "👣",
    color: "#39ff14",
    xpReward: 50,
    condition: (p) => p.totalXP >= 0,
  },
  // ── Completion ───────────────────────────────────────────────────────────────
  {
    id: "cytoplasm-complete",
    title: "Cell Graduate",
    description: "Completed the Cytoplasm — Elliot is proud",
    icon: "🔬",
    color: "#39ff14",
    xpReward: 500,
    condition: (p) => p.unlockedRealms.includes(2),
  },
  {
    id: "genome-complete",
    title: "Genome Walker",
    description: "Completed the Genome Forest — Ben finished his sandwich in celebration",
    icon: "🌿",
    color: "#52b788",
    xpReward: 750,
    condition: (p) => p.unlockedRealms.includes(3),
  },
  {
    id: "nebula-complete",
    title: "Neural Architect",
    description: "Completed the Neural Nebula — Alex logged your achievement at p < 0.001",
    icon: "🌌",
    color: "#a855f7",
    xpReward: 1000,
    condition: (p) => p.unlockedRealms.includes(4),
  },
  {
    id: "cathedral-complete",
    title: "Holographic Scholar",
    description: "Completed the Protein Cathedral — Henry almost sneezed",
    icon: "🏛️",
    color: "#00ffff",
    xpReward: 2000,
    condition: (p) => {
      const cathedralNodes = Object.keys(p.completedNodes).filter((id) =>
        id.startsWith("l4-")
      );
      return cathedralNodes.length >= 5;
    },
  },
  // ── Streaks ──────────────────────────────────────────────────────────────────
  {
    id: "streak-3",
    title: "Mitosis Rhythm",
    description: "3-day streak — consistent like G1/S/G2",
    icon: "🔥",
    color: "#f59e0b",
    xpReward: 75,
    condition: (p) => p.streakDays >= 3,
  },
  {
    id: "streak-7",
    title: "Weekly Replication",
    description: "7-day streak — one full cell cycle",
    icon: "🔥🔥",
    color: "#f59e0b",
    xpReward: 150,
    condition: (p) => p.streakDays >= 7,
  },
  {
    id: "streak-30",
    title: "Chronic Researcher",
    description: "30-day streak — the lab never closes",
    icon: "⚡",
    color: "#39ff14",
    xpReward: 500,
    condition: (p) => p.streakDays >= 30,
  },
  {
    id: "streak-100",
    title: "Tenured",
    description: "100-day streak — you are now part of the institution",
    icon: "🏆",
    color: "#f59e0b",
    xpReward: 2000,
    condition: (p) => p.streakDays >= 100,
  },
  // ── XP Milestones ────────────────────────────────────────────────────────────
  {
    id: "xp-500",
    title: "Nucleotide",
    description: "Earned 500 XP — the building block of greatness",
    icon: "🧪",
    color: "#39ff14",
    xpReward: 25,
    condition: (p) => p.totalXP >= 500,
  },
  {
    id: "xp-2000",
    title: "Gene",
    description: "2,000 XP — you're coding for real things now",
    icon: "🧬",
    color: "#52b788",
    xpReward: 100,
    condition: (p) => p.totalXP >= 2000,
  },
  {
    id: "xp-6000",
    title: "Chromosome",
    description: "6,000 XP — compacted and ready",
    icon: "🔵",
    color: "#3b82f6",
    xpReward: 300,
    condition: (p) => p.totalXP >= 6000,
  },
  {
    id: "xp-12000",
    title: "Genome",
    description: "12,000 XP — you contain multitudes",
    icon: "🌍",
    color: "#a855f7",
    xpReward: 1000,
    condition: (p) => p.totalXP >= 12000,
  },
  {
    id: "xp-50000",
    title: "Proteome",
    description: "50,000 XP — the full expression of your potential",
    icon: "💎",
    color: "#00ffff",
    xpReward: 5000,
    condition: (p) => p.totalXP >= 50000,
  },
  // ── Gem Collector ─────────────────────────────────────────────────────────────
  {
    id: "gem-collector",
    title: "Gem Hoarder",
    description: "Accumulated 500 gems without spending them",
    icon: "💎",
    color: "#06b6d4",
    xpReward: 100,
    condition: (p) => p.gems >= 500,
  },
  // ── Accuracy ─────────────────────────────────────────────────────────────────
  {
    id: "perfect-10",
    title: "Perfect Score",
    description: "Completed 10 lessons without any mistakes",
    icon: "⭐",
    color: "#f59e0b",
    xpReward: 300,
    condition: (p) => {
      const perfectNodes = Object.values(p.completedNodes).filter(
        (n) => n.stars === 3
      );
      return perfectNodes.length >= 10;
    },
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Completed a lesson with perfect score in record time",
    icon: "⚡",
    color: "#39ff14",
    xpReward: 150,
    condition: (p) => {
      const perfectNodes = Object.values(p.completedNodes).filter(
        (n) => n.stars === 3
      );
      return perfectNodes.length >= 1;
    },
  },
  // ── Explorer ──────────────────────────────────────────────────────────────────
  {
    id: "nodes-25",
    title: "Explorer",
    description: "Completed 25 lesson nodes",
    icon: "🗺️",
    color: "#52b788",
    xpReward: 200,
    condition: (p) =>
      Object.values(p.completedNodes).filter((n) => n.completed).length >= 25,
  },
  {
    id: "nodes-100",
    title: "Pathfinder",
    description: "Completed 100 lesson nodes",
    icon: "🧭",
    color: "#a855f7",
    xpReward: 1000,
    condition: (p) =>
      Object.values(p.completedNodes).filter((n) => n.completed).length >= 100,
  },
  // ── Secret ───────────────────────────────────────────────────────────────────
  {
    id: "lysosome-survivor",
    title: "Lysosome Survivor",
    description: "Lost all 5 hearts in a single session but kept going — Elliot respects this",
    icon: "💀",
    color: "#ef4444",
    xpReward: 100,
    condition: (p) => p.hearts === 0,
    secret: true,
  },
  {
    id: "nan-loss",
    title: "NaN Loss",
    description: "Got 0 correct answers on your first try in a lesson — Alex has been there",
    icon: "∞",
    color: "#6b7280",
    xpReward: 50,
    condition: (_p) => false, // Triggered programmatically
    secret: true,
  },
  {
    id: "blast-beef",
    title: "Ben's Beef",
    description: "Completed all BLAST-related exercises — Ben nods grimly",
    icon: "💢",
    color: "#f59e0b",
    xpReward: 200,
    condition: (p) => {
      const blastNodes = Object.keys(p.completedNodes).filter(
        (id) => id.includes("l2-m2")
      );
      return blastNodes.length >= 3;
    },
    secret: true,
  },
  {
    id: "henry-sneeze",
    title: "Bless You",
    description: "Triggered Henry's sneeze dialogue 5 times — you're encouraging the behavior",
    icon: "🤧",
    color: "#00ffff",
    xpReward: 75,
    condition: (_p) => false, // Triggered programmatically
    secret: true,
  },
  {
    id: "all-levels",
    title: "Certified Computational Biologist",
    description: "Completed all four realms — the full journey from cell to cathedral",
    icon: "🎓",
    color: "#39ff14",
    xpReward: 10000,
    condition: (p) => p.unlockedRealms.includes(4) && Object.keys(p.completedNodes).filter((id) => id.startsWith("l4-m6")).length > 0,
  },
];

export function checkNewAchievements(progress: PlayerProgress): string[] {
  const newlyUnlocked: string[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!progress.achievements.includes(achievement.id) && achievement.condition(progress)) {
      newlyUnlocked.push(achievement.id);
    }
  }
  return newlyUnlocked;
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
