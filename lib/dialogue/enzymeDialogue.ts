// ─── Enzyme's Context-Sensitive Dialogue ─────────────────────────────────────
// Enzyme (white cat companion) reacts to what the player does.
// Used in WorldEntryAnimation and future companion dialogue triggers.

export interface EnzymeQuip {
  id: string;
  trigger: 'enter-realm' | 'open-chest' | 'read-sign' | 'complete-node' | 'near-npc' | 'idle' | 'boss-approach' | 'boss-defeated';
  realmId?: 1 | 2 | 3 | 4;
  lines: string[];
}

export const ENZYME_DIALOGUE: EnzymeQuip[] = [
  // ─── Realm Entry ─────────────────────────────────────────────────────────────
  {
    id: 'enter-1',
    trigger: 'enter-realm',
    realmId: 1,
    lines: [
      '(Enzyme leaps off your head and lands in a crouch.)',
      "It's warm in here. And kind of... jiggly.",
      'The cytoplasm. Everything the cell needs to function floats in this gel.',
      '(She swipes at a passing ribosome.)',
      'This one looks important. Probably.',
    ],
  },
  {
    id: 'enter-2',
    trigger: 'enter-realm',
    realmId: 2,
    lines: [
      "(Enzyme sniffs the air. Her ears swivel toward the canopy.)",
      "There's something deeply old here.",
      'Double helix trees. You don\'t usually find those outside of a nucleus.',
      '(A base pair drifts past. She watches it.)',
      'Someone let the genome grow wild. Bold choice.',
    ],
  },
  {
    id: 'enter-3',
    trigger: 'enter-realm',
    realmId: 3,
    lines: [
      "(Enzyme pads to the edge of the platform and looks down. A long pause.)",
      'That void is very void-y.',
      '(She steps back. Sits. Begins grooming.)',
      "Neural networks, right. Alex's territory. She'll have opinions.",
      'Try not to have opinions back. Trust me on this.',
    ],
  },
  {
    id: 'enter-4',
    trigger: 'enter-realm',
    realmId: 4,
    lines: [
      "(Enzyme's ears flatten briefly, then straighten.)",
      "I can feel Henry from here. That man is always glowing.",
      'Proteins fold in here. Everything is the exact right shape.',
      '(She flexes one paw, studying it.)',
      "We're also the exact right shape. Probably. I hope.",
    ],
  },

  // ─── Chest Opening ───────────────────────────────────────────────────────────
  {
    id: 'chest-0',
    trigger: 'open-chest',
    lines: [
      "(Enzyme peers inside.)",
      "Nice. Cells are very good at hiding things.",
      "It's all compartmentalized. Literally. Biology joke.",
    ],
  },
  {
    id: 'chest-1',
    trigger: 'open-chest',
    lines: [
      '(She sits on the chest lid.)',
      'Technically I got here first.',
      "But I'll let you have it. You seem to need it more.",
    ],
  },
  {
    id: 'chest-2',
    trigger: 'open-chest',
    lines: [
      "(Enzyme's tail puffs slightly.)",
      "Okay but what IS that thing.",
      "(She bats it.)",
      'Still alive. Good sign.',
    ],
  },

  // ─── Sign Reading ─────────────────────────────────────────────────────────────
  {
    id: 'sign-0',
    trigger: 'read-sign',
    lines: [
      "(Enzyme reads the sign too. You can tell because her eyes track left to right.)",
      'Signs are very useful.',
      "I've been saying this for years. No one listens.",
    ],
  },
  {
    id: 'sign-1',
    trigger: 'read-sign',
    lines: [
      '(She tilts her head at the sign.)',
      "Whoever wrote that was trying very hard to be helpful.",
      "I respect the effort. Unclear on the execution.",
    ],
  },

  // ─── Node Complete ────────────────────────────────────────────────────────────
  {
    id: 'node-1',
    trigger: 'complete-node',
    realmId: 1,
    lines: [
      '(Enzyme does a small trot in place.)',
      "You got that one.",
      "The ATP cycle is genuinely elegant, isn't it? Like clockwork, but wetter.",
    ],
  },
  {
    id: 'node-2',
    trigger: 'complete-node',
    realmId: 2,
    lines: [
      "(She headbumps your ankle.)",
      'Four bases. A, T, G, C.',
      "Simple alphabet. Complex everything else. I think about that a lot.",
    ],
  },
  {
    id: 'node-3',
    trigger: 'complete-node',
    realmId: 3,
    lines: [
      "(Enzyme blinks at you slowly. This is a cat compliment.)",
      'Gradient descent. Losing elegantly, over and over, until you win.',
      'Honestly that sounds like most things.',
    ],
  },
  {
    id: 'node-4',
    trigger: 'complete-node',
    realmId: 4,
    lines: [
      '(She stretches — front paws forward, a long arc.)',
      "Protein folding. The original NP-hard problem.",
      "AlphaFold cracked it. So did you. In a more metaphorical sense.",
    ],
  },

  // ─── Near NPC ────────────────────────────────────────────────────────────────
  {
    id: 'near-elliot',
    trigger: 'near-npc',
    realmId: 1,
    lines: [
      "(Enzyme whispers.)",
      "That's Elliot. He'll explain everything very fast and mean it kindly.",
      'He once talked to a ribosome for forty minutes.',
      '(Beat.)',
      "The ribosome didn't respond. He took notes anyway.",
    ],
  },
  {
    id: 'near-ben',
    trigger: 'near-npc',
    realmId: 2,
    lines: [
      "(Enzyme flicks an ear at Ben.)",
      'Ben reads the genome like a recipe book.',
      "He'll have food. He always has food.",
      "(She looks very focused on this information.)",
    ],
  },
  {
    id: 'near-alex',
    trigger: 'near-npc',
    realmId: 3,
    lines: [
      "(Enzyme sits very still.)",
      "Alex is on her third coffee.",
      "Don't ask which layer she's on. She'll show you and it takes a while.",
      '(Pause.)',
      "It's very impressive though. Genuinely.",
    ],
  },
  {
    id: 'near-henry',
    trigger: 'near-npc',
    realmId: 4,
    lines: [
      "(Enzyme stares at Henry's glow. Her pupils are enormous.)",
      "He's flickering.",
      "That's... normal for him. He exists between states.",
      "Like Schrödinger's mentor.",
      "(She looks at you.)",
      "Don't tell him I said that.",
    ],
  },

  // ─── Boss Approach ────────────────────────────────────────────────────────────
  {
    id: 'boss-1',
    trigger: 'boss-approach',
    realmId: 1,
    lines: [
      "(Enzyme's ears go back.)",
      'LYSO. The Lysosomal Overseer.',
      "It thinks it can dissolve anything. Including you.",
      "(She presses against your leg.)",
      "It's not wrong. Be fast.",
    ],
  },
  {
    id: 'boss-2',
    trigger: 'boss-approach',
    realmId: 2,
    lines: [
      "(Enzyme crouches low.)",
      'VIRON. A rogue retrovirus that rewrites what it touches.',
      "It replaced the forest's actual sequence with its own. Twice.",
      "(She looks at you steadily.)",
      "Ben is very upset about this. So are we. Let's go.",
    ],
  },
  {
    id: 'boss-3',
    trigger: 'boss-approach',
    realmId: 3,
    lines: [
      "(Enzyme stands at the edge. Does not look down.)",
      "OVERFIT. An AI that learned everything and understood nothing.",
      "It optimizes perfectly for the wrong objective.",
      "(She turns to you.)",
      'Alex calls it "the mirror problem." You\'ll understand after.',
    ],
  },
  {
    id: 'boss-4',
    trigger: 'boss-approach',
    realmId: 4,
    lines: [
      "(Enzyme goes still. Very still.)",
      "AMYLOID.",
      "A protein that folded wrong and taught others to do the same.",
      "(Long pause.)",
      "Henry says it was once a student.",
      "(She says nothing else.)",
    ],
  },

  // ─── Boss Defeated ────────────────────────────────────────────────────────────
  {
    id: 'victory-1',
    trigger: 'boss-defeated',
    realmId: 1,
    lines: [
      "(Enzyme leaps onto your shoulder.)",
      "LYSO is dissolved.",
      "(Beat.)",
      "Poetic.",
    ],
  },
  {
    id: 'victory-2',
    trigger: 'boss-defeated',
    realmId: 2,
    lines: [
      "(She does three victory laps around you.)",
      "The sequence holds. VIRON is expelled.",
      "Ben is going to eat SO MUCH to celebrate.",
      "I may join him.",
    ],
  },
  {
    id: 'victory-3',
    trigger: 'boss-defeated',
    realmId: 3,
    lines: [
      "(Enzyme stretches, slow and satisfied.)",
      "OVERFIT tried to predict you.",
      "It couldn't.",
      "(She looks very pleased.)",
      "You were the anomaly in its training data.",
    ],
  },
  {
    id: 'victory-4',
    trigger: 'boss-defeated',
    realmId: 4,
    lines: [
      "(Enzyme sits quietly beside you for a moment.)",
      "AMYLOID is gone.",
      "It just needed someone to show it a different fold.",
      "(She looks up at you.)",
      "That was you. You did that.",
      "(Pause.)",
      "Good job.",
    ],
  },

  // ─── Idle Quips ───────────────────────────────────────────────────────────────
  {
    id: 'idle-0',
    trigger: 'idle',
    lines: [
      "(Enzyme is napping. She wakes when you look.)",
      "What. I was thinking.",
      "(She wasn't thinking.)",
    ],
  },
  {
    id: 'idle-1',
    trigger: 'idle',
    lines: [
      "(Enzyme is watching something in the middle distance.)",
      "...",
      "(You follow her gaze. Nothing is there.)",
      "Trust me.",
    ],
  },
  {
    id: 'idle-2',
    trigger: 'idle',
    lines: [
      "(She sits beside you.)",
      "You know what I find interesting about biology?",
      "It all works.",
      "Billions of years of iteration and it just... works.",
      "(Beat.)",
      "Most of the time.",
    ],
  },
];

// ─── Helper: get quips by trigger/realm ──────────────────────────────────────
export function getEnzymeQuips(
  trigger: EnzymeQuip['trigger'],
  realmId?: 1 | 2 | 3 | 4
): EnzymeQuip[] {
  return ENZYME_DIALOGUE.filter(
    (q) => q.trigger === trigger && (q.realmId === undefined || q.realmId === realmId)
  );
}

export function getRandomEnzymeQuip(
  trigger: EnzymeQuip['trigger'],
  realmId?: 1 | 2 | 3 | 4
): EnzymeQuip | null {
  const matches = getEnzymeQuips(trigger, realmId);
  if (!matches.length) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}
