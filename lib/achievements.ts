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
    condition: (p) =>
      p.unlockedRealms.includes(4) &&
      Object.keys(p.completedNodes).filter((id) => id.startsWith("l4-m6")).length > 0,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Boss-Specific ─────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "lysosome-bane",
    title: "Lysosome's Bane",
    description: "Defeated LYSO without losing a single heart — immaculate autophagy",
    icon: "🫧",
    color: "#ef4444",
    xpReward: 400,
    condition: (_p) => false, // Triggered programmatically when LYSO boss is defeated with full hearts
    secret: true,
  },
  {
    id: "sequence-purified",
    title: "Sequence Purified",
    description: "Defeated VIRON by answering every genome question correctly on the first try",
    icon: "🦠",
    color: "#52b788",
    xpReward: 450,
    condition: (_p) => false, // Triggered programmatically on perfect VIRON run
    secret: true,
  },
  {
    id: "generalize-this",
    title: "Generalize This",
    description: "Defeated OVERFIT by exploiting the dropout mechanic — regularization wins",
    icon: "🎯",
    color: "#a855f7",
    xpReward: 350,
    condition: (_p) => false, // Triggered programmatically when dropout ability is used to defeat OVERFIT
  },
  {
    id: "fibril-crusher",
    title: "Fibril Crusher",
    description: "Defeated the Amyloid Tyrant in under 5 minutes — no time for aggregation",
    icon: "⚔️",
    color: "#00ffff",
    xpReward: 500,
    condition: (_p) => false, // Triggered programmatically: boss defeated with elapsed < 300s
    secret: true,
  },
  {
    id: "one-last-lesson",
    title: "One Last Lesson",
    description: "Answered all 5 of Henry's synthesis questions correctly — he almost sneezed in joy",
    icon: "📖",
    color: "#00ffff",
    xpReward: 600,
    condition: (_p) => false, // Triggered programmatically on perfect Henry final sequence
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── NPC Relationship ──────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "elliots-favorite",
    title: "Elliot's Favorite",
    description: "Triggered all of Elliot's unique dialogue lines — he denies having favorites",
    icon: "🐢",
    color: "#39ff14",
    xpReward: 150,
    condition: (_p) => false, // Triggered programmatically when all Elliot dialogue IDs have fired
  },
  {
    id: "bens-lunch",
    title: "Ben's Lunch",
    description: "Found Ben's Sandwich weapon and used it — he was NOT happy about this",
    icon: "🥪",
    color: "#f59e0b",
    xpReward: 200,
    condition: (_p) => false, // Triggered programmatically when sandwich item is equipped and used
    secret: true,
  },
  {
    id: "alexs-protege",
    title: "Alex's Protégé",
    description: "Cleared every node in the Neural Nebula — Alex logged it at p < 0.001",
    icon: "📊",
    color: "#a855f7",
    xpReward: 350,
    condition: (p) => {
      const nebulaNodes = Object.keys(p.completedNodes).filter((id) =>
        id.startsWith("l3-")
      );
      return (
        nebulaNodes.length >= 10 &&
        nebulaNodes.every((id) => p.completedNodes[id]?.completed)
      );
    },
  },
  {
    id: "henrys-student",
    title: "Henry's Student",
    description: "Completed the full Henry boss conversation and synthesis sequence",
    icon: "🏛️",
    color: "#00ffff",
    xpReward: 300,
    condition: (_p) => false, // Triggered programmatically after Henry final sequence completes
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Explorer / Secrets ────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "moms-room",
    title: "Moms Room",
    description: "Read every one of Mom's hidden diary entries — this was a private folder",
    icon: "📔",
    color: "#f472b6",
    xpReward: 175,
    condition: (_p) => false, // Triggered programmatically when all diary entry IDs are read
    secret: true,
  },
  {
    id: "jefferys-shadow",
    title: "Jeffery's Shadow",
    description: "The name Jeffery appears 5 times in this game. You found all of them.",
    icon: "👤",
    color: "#6b7280",
    xpReward: 100,
    condition: (_p) => false, // Triggered programmatically: jeffery_sighting_count >= 5
    secret: true,
  },
  {
    id: "closet-survivor",
    title: "Closet Survivor",
    description: "Witnessed the full textbook zoom cutscene without skipping — respect",
    icon: "📚",
    color: "#f59e0b",
    xpReward: 75,
    condition: (_p) => false, // Triggered programmatically when textbook cutscene completes naturally
    secret: true,
  },
  {
    id: "stubborn",
    title: "Stubborn",
    description: "Chose NO at the DNA portal — so Enzyme threw you in anyway",
    icon: "🚪",
    color: "#ef4444",
    xpReward: 50,
    condition: (_p) => false, // Triggered programmatically on portal_choice === "no"
    secret: true,
  },
  {
    id: "willing",
    title: "Willing",
    description: "Chose YES at the DNA portal — bravery acknowledged",
    icon: "✅",
    color: "#39ff14",
    xpReward: 50,
    condition: (_p) => false, // Triggered programmatically on portal_choice === "yes"
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Combat ────────────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "pest-control",
    title: "Pest Control",
    description: "Defeated all 20 enemy types at least once — a complete bestiary",
    icon: "🪲",
    color: "#52b788",
    xpReward: 750,
    condition: (_p) => false, // Triggered programmatically: defeatedEnemyTypes.size >= 20
  },
  {
    id: "snip-prevention",
    title: "Snip Prevention",
    description: "Defeated the Nuclease Specter without getting cut once",
    icon: "✂️",
    color: "#3b82f6",
    xpReward: 300,
    condition: (_p) => false, // Triggered programmatically: nuclease fight ended with 0 cut events
    secret: true,
  },
  {
    id: "answer-is-7",
    title: "Answer is 7",
    description: "Defeated the Overfitted Minion on the very first try",
    icon: "7️⃣",
    color: "#f59e0b",
    xpReward: 200,
    condition: (_p) => false, // Triggered programmatically: overfitted_minion_attempts === 1
    secret: true,
  },
  {
    id: "undefined-behavior",
    title: "Undefined Behavior",
    description: "Encountered the NaN Entity — most players never see it",
    icon: "👾",
    color: "#6b7280",
    xpReward: 100,
    condition: (_p) => false, // Triggered programmatically on nan_entity spawn
    secret: true,
  },
  {
    id: "infinity-loop",
    title: "Infinity Loop",
    description: "Caused the Attention Head Hydra to sprout 20 heads — it's a feature",
    icon: "♾️",
    color: "#a855f7",
    xpReward: 150,
    condition: (_p) => false, // Triggered programmatically: hydra_head_count >= 20
    secret: true,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Learning ─────────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "speed-runner",
    title: "Speed Runner",
    description: "Completed any lesson in under 30 seconds — did you even read the questions?",
    icon: "🏃",
    color: "#39ff14",
    xpReward: 125,
    condition: (_p) => false, // Triggered programmatically: lesson elapsed_ms < 30000
    secret: true,
  },
  {
    id: "no-hints-needed",
    title: "No Hints Needed",
    description: "Completed all exercises in a module without using a single hint",
    icon: "🧠",
    color: "#3b82f6",
    xpReward: 250,
    condition: (_p) => false, // Triggered programmatically: module completed with hints_used === 0
  },
  {
    id: "deep-reader",
    title: "Deep Reader",
    description: "Read the lore entry for every enemy encountered — you are the lore",
    icon: "📜",
    color: "#f59e0b",
    xpReward: 200,
    condition: (_p) => false, // Triggered programmatically: lore_entries_read.size >= total_enemies
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Completed exercises of 3 different types in a single session",
    icon: "🗣️",
    color: "#52b788",
    xpReward: 175,
    condition: (_p) => false, // Triggered programmatically: session exercise_types_seen.size >= 3
  },
  {
    id: "consistent",
    title: "Consistent",
    description: "Submitted correct first answers 5 exercises in a row — no backtracking",
    icon: "✔️",
    color: "#39ff14",
    xpReward: 150,
    condition: (_p) => false, // Triggered programmatically: consecutive_correct_first_tries >= 5
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Cosmetic ─────────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "fashion-icon",
    title: "Fashion Icon",
    description: "Visited the character creator 5 times — the fit matters",
    icon: "👗",
    color: "#f472b6",
    xpReward: 100,
    condition: (_p) => false, // Triggered programmatically: character_creator_visits >= 5
  },
  {
    id: "random-walk",
    title: "Random Walk",
    description: "Hit the Random button in the character creator 3 times in a row",
    icon: "🎲",
    color: "#a855f7",
    xpReward: 50,
    condition: (_p) => false, // Triggered programmatically: consecutive_random_clicks >= 3
    secret: true,
  },
  {
    id: "this-is-me",
    title: "This Is Me",
    description: "Kept the default appearance and still completed Realm 1 — brave",
    icon: "🪞",
    color: "#06b6d4",
    xpReward: 100,
    condition: (_p) => false, // Triggered programmatically: realm 1 complete + avatar unchanged from defaults
    secret: true,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // ── Meta ─────────────────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: "skip-everything",
    title: "Skip Everything",
    description: "Skipped every single cutscene in the game — the plot found you anyway",
    icon: "⏭️",
    color: "#6b7280",
    xpReward: 75,
    condition: (_p) => false, // Triggered programmatically: all_cutscene_ids are in skipped_cutscenes set
    secret: true,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Played between 12 AM and 4 AM — the lab is quieter at this hour",
    icon: "🦉",
    color: "#3b82f6",
    xpReward: 100,
    condition: (_p) => false, // Triggered programmatically: new Date().getHours() < 4 on any action
    secret: true,
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
