// ─── Core Types ───────────────────────────────────────────────────────────────

export type Realm = 1 | 2 | 3 | 4;
export type ExerciseType =
  | "multiple-choice"
  | "fill-blank"
  | "drag-drop"
  | "code-complete"
  | "debug-code"
  | "terminal"
  | "sequence-order"
  | "matching"
  | "free-text"
  | "interactive-viz"
  | "tap-correct";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  hint?: string;
  explanation?: string;
  xpReward: number;
  // type-specific fields
  options?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  blanks?: { text: string; answer: string; position: number }[];
  codeTemplate?: string;
  codeAnswer?: string;
  bugLine?: number;
  bugFix?: string;
  terminalCommands?: Record<string, string>;
  items?: string[];
  correctOrder?: number[];
  pairs?: { left: string; right: string }[];
  rubric?: string[];
  vizType?: string;
  starterCode?: string;
  minKeywords?: number;
  solution?: string;
}

export interface LessonNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  exercises: Exercise[];
  xpReward: number;
  prerequisites?: string[];
  moduleId: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  realm: Realm;
  nodes: LessonNode[];
  color: string;
}

export interface Level {
  id: Realm;
  title: string;
  mascot: string;
  realm: string;
  description: string;
  modules: Module[];
  unlockXP: number;
}

// ─── Avatar ────────────────────────────────────────────────────────────────────

export interface AvatarConfig {
  skinTone: string;
  eyeShape: number;
  eyeColor: string;
  eyebrow: number;
  nose: number;
  mouth: number;
  hairStyle: number;
  hairColor: string;
  glasses: number;
  facialHair: number;
  bodyType: number;
  clothing: number;
  clothingColorPrimary: string;
  clothingColorSecondary: string;
  accessories: {
    backpack: boolean;
    headphones: boolean;
    badge: boolean;
    earrings: boolean;
  };
  // Extended fields
  characterName: string;
  headwear: number;
  headwearColor: string;
  shoes: number;
  shoesColor: string;
  backpackType: number;
  backpackColor: string;
  auraEffect: number;
  skinMarkings: number;
  expression: number;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: "#c68642",          // medium warm brown
  eyeShape: 1,                   // almond eyes
  eyeColor: "#3b82f6",           // blue
  eyebrow: 0,                    // thick
  nose: 1,                       // button
  mouth: 1,                      // smirk
  hairStyle: 1,                  // short neat (dark, like reference)
  hairColor: "#1a1a1a",          // near-black
  glasses: 0,                    // none
  facialHair: 0,                 // none
  bodyType: 1,                   // average
  clothing: 0,                   // Lab Coat (matching reference)
  clothingColorPrimary: "#e8e8f4",   // white lab coat
  clothingColorSecondary: "#d0d0e8", // slightly blue-white for depth
  accessories: { backpack: true, headphones: false, badge: true, earrings: false },
  characterName: "Explorer",
  headwear: 0,                   // none
  headwearColor: "#333333",
  shoes: 1,                      // high tops
  shoesColor: "#1a1a1a",         // black shoes
  backpackType: 1,               // Lab Pack (DNA backpack from reference)
  backpackColor: "#1a1a2e",      // dark navy
  auraEffect: 0,                 // none (starts plain)
  skinMarkings: 0,
  expression: 1,                 // smile
};

// ─── Player Progress ───────────────────────────────────────────────────────────

export interface NodeProgress {
  nodeId: string;
  completed: boolean;
  stars: number; // 0-3
  exercisesCompleted: number;
  totalExercises: number;
  bestScore: number;
}

export interface PlayerProgress {
  currentRealm: Realm;
  currentNodeId: string | null;
  totalXP: number;
  hearts: number;
  maxHearts: number;
  lastHeartRefill: number; // timestamp
  streakDays: number;
  lastPlayDate: string; // YYYY-MM-DD
  completedNodes: Record<string, NodeProgress>;
  unlockedRealms: Realm[];
  achievements: string[];
  gems: number;
  diagnosticScore?: number;
  age?: number;
  useAgeDiagnostic?: boolean;
  questsCompleted: string[];
  dailyRewardDate: string;
  bossesDefeated: Realm[];
  researchUnlocked: string[];
  inventory: string[];
  openedChests: string[];
  readSigns: string[];
}

export const DEFAULT_PROGRESS: PlayerProgress = {
  currentRealm: 1,
  currentNodeId: null,
  totalXP: 0,
  hearts: 5,
  maxHearts: 5,
  lastHeartRefill: Date.now(),
  streakDays: 0,
  lastPlayDate: "",
  completedNodes: {},
  unlockedRealms: [1],
  achievements: [],
  gems: 50,
  questsCompleted: [],
  dailyRewardDate: "",
  bossesDefeated: [],
  researchUnlocked: [],
  inventory: [],
  openedChests: [],
  readSigns: [],
};

// ─── Achievement ───────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  xpReward: number;
  condition: (progress: PlayerProgress) => boolean;
  secret?: boolean;
}

// ─── Dialogue ─────────────────────────────────────────────────────────────────

export type DialogueTone = "excited" | "encouraging" | "funny" | "disappointed" | "proud" | "neutral" | "mysterious";

export interface MascotDialogue {
  id: string;
  trigger: "correct" | "wrong" | "lesson-start" | "lesson-complete" | "streak" | "idle" | "welcome" | "hint";
  tone: DialogueTone;
  text: string;
  animation: "idle" | "cheer" | "sad" | "wave" | "think" | "jump" | "spin";
}
