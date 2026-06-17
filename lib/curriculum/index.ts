import level1Modules from "./level1";
import level1ExtraModules from "./level1extra";
import level1BonusModules from "./level1bonus";
import level1AdvancedModules from "./level1advanced";
import level2Modules from "./level2";
import level2ExtraModules from "./level2extra";
import level2BonusModules from "./level2bonus";
import level2AdvancedModules from "./level2advanced";
import level3Modules from "./level3";
import level3ExtraModules from "./level3extra";
import level3BonusModules from "./level3bonus";
import level3AdvancedModules from "./level3advanced";
import level4Modules from "./level4";
import level4ExtraModules from "./level4extra";
import level4BonusModules from "./level4bonus";
import level4AdvancedModules from "./level4advanced";
import type { Level, Module, LessonNode, Exercise } from "@/lib/types";

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Eukaryote Elliot",
    mascot: "elliot",
    realm: "The Cytoplasm",
    description: "Journey inside a living cell and learn the foundations of life and Python",
    modules: [...level1Modules, ...level1ExtraModules, ...level1BonusModules, ...level1AdvancedModules],
    unlockXP: 0,
  },
  {
    id: 2,
    title: "Biologist Ben",
    mascot: "ben",
    realm: "The Genome Forest",
    description: "Walk through DNA double-helix forests and master genomics and data analysis",
    modules: [...level2Modules, ...level2ExtraModules, ...level2BonusModules, ...level2AdvancedModules],
    unlockXP: 2000,
  },
  {
    id: 3,
    title: "Analyst Alex",
    mascot: "alex",
    realm: "The Neural Network Nebula",
    description: "Traverse a deep-space neural constellation and build ML models from scratch",
    modules: [...level3Modules, ...level3ExtraModules, ...level3BonusModules, ...level3AdvancedModules],
    unlockXP: 6000,
  },
  {
    id: 4,
    title: "Holographic Henry",
    mascot: "henry",
    realm: "The Protein Fold Cathedral",
    description: "Enter a cathedral of protein architecture and reach the cutting edge of computational biology",
    modules: [...level4Modules, ...level4ExtraModules, ...level4BonusModules, ...level4AdvancedModules],
    unlockXP: 12000,
  },
];

export function getAllNodes(): LessonNode[] {
  return LEVELS.flatMap((l) => l.modules.flatMap((m) => m.nodes));
}

export function getNode(nodeId: string): LessonNode | undefined {
  return getAllNodes().find((n) => n.id === nodeId);
}

export function getModule(moduleId: string): Module | undefined {
  return LEVELS.flatMap((l) => l.modules).find((m) => m.id === moduleId);
}

export function getLevel(realm: number): Level | undefined {
  return LEVELS.find((l) => l.id === realm);
}

export function getLevelForNode(nodeId: string): Level | undefined {
  return LEVELS.find((l) => l.modules.some((m) => m.nodes.some((n) => n.id === nodeId)));
}

export function getRealmNodes(realm: number): LessonNode[] {
  const level = getLevel(realm);
  if (!level) return [];
  return level.modules.flatMap((m) => m.nodes);
}

export function getTotalExerciseCount(): number {
  return getAllNodes().reduce((sum, n) => sum + n.exercises.length, 0);
}

export function getNodesByModule(moduleId: string): LessonNode[] {
  const mod = getModule(moduleId);
  return mod?.nodes ?? [];
}

export function getExercise(exerciseId: string): Exercise | undefined {
  return getAllNodes()
    .flatMap((n) => n.exercises)
    .find((e) => e.id === exerciseId);
}

// Calculate path order for a realm's nodes (for the winding path display)
export function getPathNodes(realm: number): LessonNode[] {
  return getRealmNodes(realm);
}
