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
  skinTone: "#c68642",
  eyeShape: 0,
  eyeColor: "#3b82f6",
  eyebrow: 0,
  nose: 0,
  mouth: 0,
  hairStyle: 0,
  hairColor: "#1a1a1a",
  glasses: 0,
  facialHair: 0,
  bodyType: 1,
  clothing: 0,
  clothingColorPrimary: "#1f2937",
  clothingColorSecondary: "#374151",
  accessories: { backpack: false, headphones: false, badge: false, earrings: false },
  characterName: "Explorer",
  headwear: 0,
  headwearColor: "#333333",
  shoes: 1,
  shoesColor: "#333333",
  backpackType: 1,
  backpackColor: "#1a1a2e",
  auraEffect: 0,
  skinMarkings: 0,
  expression: 1,
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
