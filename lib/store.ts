"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PlayerProgress, AvatarConfig, Realm } from "./types";
import { DEFAULT_PROGRESS, DEFAULT_AVATAR } from "./types";
import { checkNewAchievements, getAchievement } from "./achievements";

interface GameState {
  // Player data
  progress: PlayerProgress;
  avatar: AvatarConfig;
  userName: string;
  userEmail: string;
  isAuthenticated: boolean;
  onboardingComplete: boolean;

  // UI state
  currentExerciseIndex: number;
  showAchievementModal: string | null; // achievement id
  lastXPGain: number;
  mascotAnimation: string;
  mascotDialogueId: string | null;
  heartRefillTimer: number; // seconds until next heart

  // Actions — auth
  setUser: (name: string, email: string) => void;
  logout: () => void;

  // Actions — onboarding
  setAvatar: (avatar: Partial<AvatarConfig>) => void;
  setAge: (age: number) => void;
  setDiagnosticConsent: (consent: boolean) => void;
  setDiagnosticScore: (score: number) => void;
  completeOnboarding: () => void;

  // Actions — learning
  completeExercise: (nodeId: string, correct: boolean, xp: number) => void;
  completeNode: (nodeId: string, stars: number) => void;
  useHint: () => void;
  useSkip: () => void;
  setCurrentNode: (nodeId: string) => void;
  setCurrentExerciseIndex: (i: number) => void;

  // Actions — rewards
  awardXP: (amount: number) => void;
  awardGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  loseHeart: () => void;
  refillHearts: () => void;
  dismissAchievement: () => void;

  // Actions — progression
  unlockRealm: (realm: Realm) => void;
  defeatBoss: (realm: Realm) => void;
  completeQuest: (questId: string) => void;
  unlockResearch: (nodeId: string, cost: number) => void;
  claimDailyReward: () => void;

  // Actions — mascot
  setMascotAnimation: (anim: string) => void;
  setMascotDialogue: (id: string | null) => void;

  // Helpers
  getCurrentRealm: () => Realm;
  getXPForLevel: () => number;
  getProgressPercent: () => number;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      progress: DEFAULT_PROGRESS,
      avatar: DEFAULT_AVATAR,
      userName: "",
      userEmail: "",
      isAuthenticated: false,
      onboardingComplete: false,
      currentExerciseIndex: 0,
      showAchievementModal: null,
      lastXPGain: 0,
      mascotAnimation: "idle",
      mascotDialogueId: null,
      heartRefillTimer: 0,

      // ── Auth ──────────────────────────────────────────────────────────────────
      setUser: (name, email) =>
        set({ userName: name, userEmail: email, isAuthenticated: true }),

      logout: () =>
        set({
          isAuthenticated: false,
          userName: "",
          userEmail: "",
          onboardingComplete: false,
          progress: DEFAULT_PROGRESS,
          avatar: DEFAULT_AVATAR,
        }),

      // ── Onboarding ────────────────────────────────────────────────────────────
      setAvatar: (partial) =>
        set((state) => ({
          avatar: {
            ...state.avatar,
            accessories: { ...state.avatar.accessories, ...(partial.accessories ?? {}) },
            ...partial,
          },
        })),

      setAge: (age) =>
        set((state) => ({
          progress: { ...state.progress, age },
        })),

      setDiagnosticConsent: (consent) =>
        set((state) => ({
          progress: { ...state.progress, useAgeDiagnostic: consent },
        })),

      setDiagnosticScore: (score) => {
        const { progress } = get();
        let realm: Realm = 1;
        const age = progress.age ?? 18;
        if (score >= 80 && age >= 18) realm = 4;
        else if (score >= 60) realm = 3;
        else if (score >= 40 || (age >= 14 && age <= 17)) realm = 2;

        set((state) => ({
          progress: {
            ...state.progress,
            diagnosticScore: score,
            currentRealm: realm,
            unlockedRealms: [1, 2, 3, 4].slice(0, realm) as Realm[],
          },
        }));
      },

      completeOnboarding: () => set({ onboardingComplete: true }),

      // ── Learning ──────────────────────────────────────────────────────────────
      completeExercise: (nodeId, correct, xp) => {
        const state = get();
        const existing = state.progress.completedNodes[nodeId];
        const current: typeof existing = existing ?? {
          nodeId,
          completed: false,
          stars: 0,
          exercisesCompleted: 0,
          totalExercises: 0,
          bestScore: 0,
        };

        const updates: Partial<PlayerProgress> = {};
        if (correct) {
          updates.gems = state.progress.gems + 1;
        } else {
          // Lose a heart on wrong answer (not in practice mode)
          if (state.progress.hearts > 0) {
            updates.hearts = state.progress.hearts - 1;
          }
        }

        const newXP = correct ? state.progress.totalXP + xp : state.progress.totalXP;
        const newCompleted = {
          ...state.progress.completedNodes,
          [nodeId]: {
            ...current,
            exercisesCompleted: current.exercisesCompleted + 1,
          },
        };

        // Check for new achievements
        const updatedProgress: PlayerProgress = {
          ...state.progress,
          ...updates,
          totalXP: newXP,
          completedNodes: newCompleted,
        };
        const newAchievements = checkNewAchievements(updatedProgress);

        set({
          progress: {
            ...updatedProgress,
            achievements: [...updatedProgress.achievements, ...newAchievements],
          },
          lastXPGain: correct ? xp : 0,
          showAchievementModal: newAchievements[0] ?? state.showAchievementModal,
        });
      },

      completeNode: (nodeId, stars) => {
        const state = get();
        const existing = state.progress.completedNodes[nodeId];
        const today = new Date().toISOString().split("T")[0];

        // Streak logic
        let newStreak = state.progress.streakDays;
        const lastDate = state.progress.lastPlayDate;
        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split("T")[0];
          newStreak = lastDate === yStr ? newStreak + 1 : 1;
        }

        const updatedProgress: PlayerProgress = {
          ...state.progress,
          streakDays: newStreak,
          lastPlayDate: today,
          completedNodes: {
            ...state.progress.completedNodes,
            [nodeId]: {
              nodeId,
              completed: true,
              stars: Math.max(stars, existing?.stars ?? 0),
              exercisesCompleted: existing?.exercisesCompleted ?? 0,
              totalExercises: existing?.totalExercises ?? 0,
              bestScore: Math.max(stars, existing?.bestScore ?? 0),
            },
          },
        };

        const newAchievements = checkNewAchievements(updatedProgress);
        set({
          progress: {
            ...updatedProgress,
            achievements: [...updatedProgress.achievements, ...newAchievements],
          },
          showAchievementModal: newAchievements[0] ?? state.showAchievementModal,
        });
      },

      useHint: () =>
        set((state) => ({
          progress: { ...state.progress, gems: Math.max(0, state.progress.gems - 5) },
        })),

      useSkip: () =>
        set((state) => ({
          progress: { ...state.progress, gems: Math.max(0, state.progress.gems - 10) },
        })),

      setCurrentNode: (nodeId) =>
        set((state) => ({
          progress: { ...state.progress, currentNodeId: nodeId },
          currentExerciseIndex: 0,
        })),

      setCurrentExerciseIndex: (i) => set({ currentExerciseIndex: i }),

      // ── Rewards ───────────────────────────────────────────────────────────────
      awardXP: (amount) =>
        set((state) => ({
          progress: { ...state.progress, totalXP: state.progress.totalXP + amount },
          lastXPGain: amount,
        })),

      awardGems: (amount) =>
        set((state) => ({
          progress: { ...state.progress, gems: state.progress.gems + amount },
        })),

      spendGems: (amount) => {
        const { progress } = get();
        if (progress.gems < amount) return false;
        set((state) => ({
          progress: { ...state.progress, gems: state.progress.gems - amount },
        }));
        return true;
      },

      // ── Progression ───────────────────────────────────────────────────────────
      unlockRealm: (realm) =>
        set((state) => ({
          progress: {
            ...state.progress,
            unlockedRealms: state.progress.unlockedRealms.includes(realm)
              ? state.progress.unlockedRealms
              : ([...state.progress.unlockedRealms, realm].sort((a, b) => a - b) as Realm[]),
            currentRealm: realm,
          },
        })),

      defeatBoss: (realm) =>
        set((state) => ({
          progress: {
            ...state.progress,
            bossesDefeated: state.progress.bossesDefeated.includes(realm)
              ? state.progress.bossesDefeated
              : ([...state.progress.bossesDefeated, realm] as Realm[]),
          },
        })),

      completeQuest: (questId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            questsCompleted: state.progress.questsCompleted.includes(questId)
              ? state.progress.questsCompleted
              : [...state.progress.questsCompleted, questId],
          },
        })),

      unlockResearch: (nodeId, cost) =>
        set((state) => ({
          progress: {
            ...state.progress,
            researchUnlocked: state.progress.researchUnlocked.includes(nodeId)
              ? state.progress.researchUnlocked
              : [...state.progress.researchUnlocked, nodeId],
            totalXP: Math.max(0, state.progress.totalXP - cost),
          },
        })),

      claimDailyReward: () => {
        const today = new Date().toISOString().split('T')[0];
        const { progress } = get();
        const streak = progress.streakDays;
        let gems = 10;
        let xp = 0;
        if (streak >= 6) { gems = 50; xp = 500; }
        else if (streak >= 3) { gems = 25; xp = 0; }
        set((state) => ({
          progress: {
            ...state.progress,
            dailyRewardDate: today,
            gems: state.progress.gems + gems,
            totalXP: state.progress.totalXP + xp,
          },
        }));
      },

      loseHeart: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            hearts: Math.max(0, state.progress.hearts - 1),
          },
        })),

      refillHearts: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            hearts: state.progress.maxHearts,
            lastHeartRefill: Date.now(),
          },
        })),

      dismissAchievement: () => set({ showAchievementModal: null }),

      // ── Mascot ────────────────────────────────────────────────────────────────
      setMascotAnimation: (anim) => set({ mascotAnimation: anim }),
      setMascotDialogue: (id) => set({ mascotDialogueId: id }),

      // ── Helpers ───────────────────────────────────────────────────────────────
      getCurrentRealm: () => get().progress.currentRealm,
      getXPForLevel: () => {
        const xp = get().progress.totalXP;
        const thresholds = [0, 2000, 6000, 12000, 50000];
        for (let i = thresholds.length - 1; i >= 0; i--) {
          if (xp >= thresholds[i]) {
            const next = thresholds[i + 1] ?? 50000;
            return (xp - thresholds[i]) / (next - thresholds[i]);
          }
        }
        return 0;
      },
      getProgressPercent: () => {
        const { completedNodes } = get().progress;
        const completed = Object.values(completedNodes).filter((n) => n.completed).length;
        return Math.round((completed / 50) * 100); // approximate total
      },
    }),
    {
      name: "bitbio-game-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        progress: state.progress,
        avatar: state.avatar,
        userName: state.userName,
        userEmail: state.userEmail,
        isAuthenticated: state.isAuthenticated,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
