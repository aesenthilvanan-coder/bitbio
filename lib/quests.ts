import type { PlayerProgress, Realm } from './types';

export interface Quest {
  id: string;
  title: string;
  description: string;
  realmId: Realm;
  npcGiver: 'elliot' | 'ben' | 'alex' | 'henry' | 'enzyme';
  npcIcon: string;
  condition: (progress: PlayerProgress) => boolean;
  reward: { xp: number; gems: number; achievementId?: string };
  lore: string;
}

function nodesDone(progress: PlayerProgress, prefix: string): number {
  return Object.keys(progress.completedNodes).filter(
    (id) => id.startsWith(prefix) && progress.completedNodes[id].completed
  ).length;
}

export const QUESTS: Quest[] = [
  // ── Realm 1: Cytoplasm ──────────────────────────────────────────────────────
  {
    id: 'r1-first-steps',
    title: 'First Steps Into the Cell',
    description: 'Complete your first lesson in the Cytoplasm.',
    realmId: 1,
    npcGiver: 'elliot',
    npcIcon: '🔬',
    condition: (p) => nodesDone(p, 'l1-') >= 1,
    reward: { xp: 150, gems: 10 },
    lore: "Elliot grins. \"You actually listened! Most students just wander off chasing ATP. You're different.\"",
  },
  {
    id: 'r1-membrane-master',
    title: 'Membrane Master',
    description: 'Complete 3 lessons in Realm 1.',
    realmId: 1,
    npcGiver: 'elliot',
    npcIcon: '🔬',
    condition: (p) => nodesDone(p, 'l1-') >= 3,
    reward: { xp: 300, gems: 20 },
    lore: "\"The phospholipid bilayer is like life itself,\" Elliot says, dramatically. \"Always keeping the good stuff in and the bad stuff out.\"",
  },
  {
    id: 'r1-organelle-explorer',
    title: 'Organelle Explorer',
    description: 'Complete 6 lessons — explore every corner of the Cytoplasm.',
    realmId: 1,
    npcGiver: 'enzyme',
    npcIcon: '🐱',
    condition: (p) => nodesDone(p, 'l1-') >= 6,
    reward: { xp: 500, gems: 35 },
    lore: "Enzyme hops onto your shoulder. \"You know what all these organelles are? I bet you could name every single one. Go on then.\" You can.",
  },
  {
    id: 'r1-energy-crisis',
    title: 'The Energy Crisis',
    description: "Elliot's ATP generator is failing. Prove you understand cellular respiration by completing 8 lessons.",
    realmId: 1,
    npcGiver: 'elliot',
    npcIcon: '🔬',
    condition: (p) => nodesDone(p, 'l1-') >= 8,
    reward: { xp: 700, gems: 50 },
    lore: "Elliot wipes sweat from his brow. \"32 ATP per glucose. I still can't believe evolution landed on that number. It's so... inelegant. But it works.\"",
  },
  {
    id: 'r1-cytoplasm-champion',
    title: 'Cytoplasm Champion',
    description: 'Defeat LYSO and prove your mastery of the cell.',
    realmId: 1,
    npcGiver: 'elliot',
    npcIcon: '🔬',
    condition: (p) => p.bossesDefeated?.includes(1) ?? false,
    reward: { xp: 1000, gems: 100 },
    lore: "Elliot claps slowly. \"LYSO's been terrorizing this realm since before I arrived. Now it's gone. I think... I think I might actually cry. Don't tell anyone.\"",
  },

  // ── Realm 2: Genome Forest ──────────────────────────────────────────────────
  {
    id: 'r2-sequence-start',
    title: 'Into the Genome',
    description: 'Complete your first lesson in Genome Forest.',
    realmId: 2,
    npcGiver: 'ben',
    npcIcon: '🌿',
    condition: (p) => nodesDone(p, 'l2-') >= 1,
    reward: { xp: 150, gems: 10 },
    lore: "Ben offers you half his sandwich. \"Genome sequencing is basically just reading really, really long books. Except the books are made of chemicals. And they can kill you if you misread them.\"",
  },
  {
    id: 'r2-blast-off',
    title: 'BLAST Off',
    description: 'Complete 3 lessons in Genome Forest.',
    realmId: 2,
    npcGiver: 'ben',
    npcIcon: '🌿',
    condition: (p) => nodesDone(p, 'l2-') >= 3,
    reward: { xp: 300, gems: 20 },
    lore: "\"You ran BLAST for the first time?\" Ben says, impressed. \"I remember my first BLAST search. Hit a flatworm gene. Cried for some reason.\"",
  },
  {
    id: 'r2-crispr-curious',
    title: 'CRISPR Curious',
    description: 'Complete 6 lessons — you are now dangerous with scissors.',
    realmId: 2,
    npcGiver: 'enzyme',
    npcIcon: '🐱',
    condition: (p) => nodesDone(p, 'l2-') >= 6,
    reward: { xp: 500, gems: 35 },
    lore: "Enzyme stares at you intensely. \"With great scissors comes great responsibility. Do not edit the wrong genome. Especially not mine.\"",
  },
  {
    id: 'r2-phylogeny-detective',
    title: 'Phylogeny Detective',
    description: 'Master the evolutionary tree by completing 8 Genome Forest lessons.',
    realmId: 2,
    npcGiver: 'ben',
    npcIcon: '🌿',
    condition: (p) => nodesDone(p, 'l2-') >= 8,
    reward: { xp: 700, gems: 50 },
    lore: "Ben leans back against a DNA tree. \"You know, every organism on Earth is related. Even you and that bacteria over there. Distant cousins. Don't tell it though.\"",
  },
  {
    id: 'r2-genome-guardian',
    title: 'Genome Guardian',
    description: 'Defeat VIRON and protect the genetic library.',
    realmId: 2,
    npcGiver: 'ben',
    npcIcon: '🌿',
    condition: (p) => p.bossesDefeated?.includes(2) ?? false,
    reward: { xp: 1000, gems: 100 },
    lore: "Ben does a little victory dance, then pretends he didn't. \"VIRON thought it could corrupt our sequences. It forgot we had you. And me. Mostly you.\"",
  },

  // ── Realm 3: Neural Nebula ──────────────────────────────────────────────────
  {
    id: 'r3-neural-awakening',
    title: 'Neural Awakening',
    description: 'Complete your first lesson in the Neural Nebula.',
    realmId: 3,
    npcGiver: 'alex',
    npcIcon: '⚡',
    condition: (p) => nodesDone(p, 'l3-') >= 1,
    reward: { xp: 150, gems: 10 },
    lore: "Alex glances up from their laptop. \"Statistics is the language the universe uses to keep secrets from us. Your job is to learn that language.\"",
  },
  {
    id: 'r3-gradient-descent',
    title: 'Descending into ML',
    description: 'Complete 3 Neural Nebula lessons.',
    realmId: 3,
    npcGiver: 'alex',
    npcIcon: '⚡',
    condition: (p) => nodesDone(p, 'l3-') >= 3,
    reward: { xp: 300, gems: 20 },
    lore: "\"Gradient descent,\" Alex says quietly, \"is how the universe learns to be smarter. We just... borrowed the idea.\"",
  },
  {
    id: 'r3-deep-dive',
    title: 'Deep Dive',
    description: 'Complete 6 lessons — you are now thinking in layers.',
    realmId: 3,
    npcGiver: 'enzyme',
    npcIcon: '🐱',
    condition: (p) => nodesDone(p, 'l3-') >= 6,
    reward: { xp: 500, gems: 35 },
    lore: "Enzyme tilts its head. \"I wonder what my neural activation patterns look like when I'm looking at you. Probably something embarrassing.\"",
  },
  {
    id: 'r3-transformer-power',
    title: 'Transformer Power',
    description: 'Master attention mechanisms by completing 8 Neural Nebula lessons.',
    realmId: 3,
    npcGiver: 'alex',
    npcIcon: '⚡',
    condition: (p) => nodesDone(p, 'l3-') >= 8,
    reward: { xp: 700, gems: 50 },
    lore: "Alex closes their laptop. \"Attention is all you need. Turns out, that's true in deep learning and in life.\"",
  },
  {
    id: 'r3-nebula-navigator',
    title: 'Nebula Navigator',
    description: 'Defeat OVERFIT and restore balance to the Neural Nebula.',
    realmId: 3,
    npcGiver: 'alex',
    npcIcon: '⚡',
    condition: (p) => p.bossesDefeated?.includes(3) ?? false,
    reward: { xp: 1000, gems: 100 },
    lore: "Alex stares at the dissolving OVERFIT entity. \"It memorized everything but understood nothing. The oldest mistake in the book. You knew better.\"",
  },

  // ── Realm 4: Protein Cathedral ──────────────────────────────────────────────
  {
    id: 'r4-folding-initiate',
    title: 'Folding Initiate',
    description: 'Complete your first lesson in the Protein Cathedral.',
    realmId: 4,
    npcGiver: 'henry',
    npcIcon: '🔮',
    condition: (p) => nodesDone(p, 'l4-') >= 1,
    reward: { xp: 150, gems: 10 },
    lore: "Henry looks at you from across the altar. \"Every protein is a puzzle that took three billion years to design. You have... considerably less time. Begin.\"",
  },
  {
    id: 'r4-alphafold-acolyte',
    title: 'AlphaFold Acolyte',
    description: 'Complete 3 lessons in the Protein Cathedral.',
    realmId: 4,
    npcGiver: 'henry',
    npcIcon: '🔮',
    condition: (p) => nodesDone(p, 'l4-') >= 3,
    reward: { xp: 300, gems: 20 },
    lore: "\"AlphaFold solved what fifty years of science could not,\" Henry says. \"And yet the proteins keep their deepest secrets still. There is always more.\"",
  },
  {
    id: 'r4-drug-designer',
    title: 'Drug Designer',
    description: 'Complete 6 lessons — you now understand how cures are found.',
    realmId: 4,
    npcGiver: 'enzyme',
    npcIcon: '🐱',
    condition: (p) => nodesDone(p, 'l4-') >= 6,
    reward: { xp: 500, gems: 35 },
    lore: "Enzyme curls up at your feet. \"You know what's funny? The same mathematics that predicts protein folding could theoretically predict me. Don't try it. I value my mystery.\"",
  },
  {
    id: 'r4-systems-thinker',
    title: 'Systems Thinker',
    description: 'Master multi-omics by completing 8 Protein Cathedral lessons.',
    realmId: 4,
    npcGiver: 'henry',
    npcIcon: '🔮',
    condition: (p) => nodesDone(p, 'l4-') >= 8,
    reward: { xp: 700, gems: 50 },
    lore: "Henry turns to face you fully, something rare. \"You see the whole picture now. Genome to proteome to phenome. Most never get here. I'm... surprised. Pleasantly.\"",
  },
  {
    id: 'r4-amyloid-vanquished',
    title: 'The Tyrant Falls',
    description: 'Defeat the AMYLOID TYRANT and complete the BitBio curriculum.',
    realmId: 4,
    npcGiver: 'henry',
    npcIcon: '🔮',
    condition: (p) => p.bossesDefeated?.includes(4) ?? false,
    reward: { xp: 2000, gems: 200 },
    lore: "Henry is silent for a long time. Then: \"Henrietta Lacks gave her cells so science could live. You honored that gift today. Remember it always.\"",
  },
];

export function getActiveQuests(progress: PlayerProgress): Quest[] {
  return QUESTS.filter((q) => !progress.questsCompleted.includes(q.id));
}

export function getCompletableQuests(progress: PlayerProgress): Quest[] {
  return getActiveQuests(progress).filter((q) => q.condition(progress));
}

export function getCompletedQuests(progress: PlayerProgress): Quest[] {
  return QUESTS.filter((q) => progress.questsCompleted.includes(q.id));
}

export function getQuestsForRealm(realm: Realm): Quest[] {
  return QUESTS.filter((q) => q.realmId === realm);
}
