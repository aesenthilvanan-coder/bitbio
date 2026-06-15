// ─── World Lore — RPG narrative for all 4 realms ─────────────────────────────

export interface WorldLore {
  realmId: 1 | 2 | 3 | 4;
  name: string;
  tagline: string;
  entryStory: string[];        // lines shown on first entry
  mainQuestTitle: string;
  mainQuestSummary: string;
  urgency: string;
  chapters: StoryChapter[];
  environmentLore: LorePiece[];
}

export interface StoryChapter {
  id: string;
  title: string;
  trigger: 'enter-realm' | 'complete-node' | 'defeat-boss';
  nodeId?: string;
  speaker: string;
  lines: string[];
}

export interface LorePiece {
  id: string;
  title: string;
  text: string;
}

// ─── REALM 1: The Cell is Trying to Kill You ──────────────────────────────────

const REALM1_LORE: WorldLore = {
  realmId: 1,
  name: 'The Cytoplasm',
  tagline: 'The Cell is Trying to Kill You',
  entryStory: [
    'The air smells like ATP and mild panic.',
    'Organelles drift past, some of them evacuating.',
    'A small figure in a lab coat waves at you from behind an overturned ribosome.',
    'His name tag says: ELLIOT — CELL BIOLOGIST (UNOFFICIAL).',
  ],
  mainQuestTitle: 'Contain LYSO Before Everything Gets Digested',
  mainQuestSummary:
    'LYSO the Rogue Lysosome has gone haywire, dissolving other organelles with unchecked hydrolytic enzymes. ' +
    'The Nucleus has sealed itself shut — it will not release DNA instructions until it trusts someone who actually understands biology. ' +
    'Elliot has been here for weeks. He is trying his best. You need to do better.',
  urgency: 'The mitochondria are packing up. The Golgi has lost three stacks. The ER is in denial. Hurry.',
  chapters: [
    {
      id: 'r1-ch1',
      title: 'First Contact',
      trigger: 'enter-realm',
      speaker: 'Elliot',
      lines: [
        'Oh thank goodness. A human.',
        'Do you know anything about biology? No? Perfect. Less to unlearn.',
        "I'm Elliot. I've been trying to negotiate with the lysosomes for three weeks.",
        "They don't negotiate. I know that now.",
        "The Nucleus is sealed. Won't talk to anyone. The mRNA is backed up. The ribosomes are making nonsense proteins.",
        "Also LYSO is somewhere to the east and it ate my spectrometer.",
        "So. Shall we begin?",
      ],
    },
    {
      id: 'r1-ch2',
      title: 'The Ribosomes Respond',
      trigger: 'complete-node',
      nodeId: 'l1-m1-n1',
      speaker: 'Elliot',
      lines: [
        'The ribosomes are stabilizing!',
        "I've been talking to them for WEEKS. WEEKS. They just made nonsense proteins.",
        "Must be my accent. Or my approach. Or everything about how I was doing this.",
        "They responded to you in twenty minutes.",
        "...",
        "I'm fine.",
      ],
    },
    {
      id: 'r1-ch3',
      title: 'The Nucleus Opens',
      trigger: 'complete-node',
      nodeId: 'l1-m2-n1',
      speaker: 'Elliot',
      lines: [
        'The Nucleus cracked open. An mRNA escaped.',
        'It TRUSTS you.',
        "That door has been sealed for eleven days. I knocked every morning.",
        "I left notes under the nuclear pore. I tried interpretive movement.",
        '...',
        "I may have been doing this job wrong.",
      ],
    },
    {
      id: 'r1-ch4',
      title: 'LYSO Spotted',
      trigger: 'complete-node',
      nodeId: 'l1-m3-n1',
      speaker: 'Elliot',
      lines: [
        "That's LYSO.",
        "Don't make eye contact.",
        "Don't drop any damaged proteins near it.",
        "Don't mention autophagy. It takes that as a compliment.",
        "Lysosomes are supposed to be the cell's recycling system. Very useful. Very important.",
        "LYSO has decided recycling means everything.",
        "We're going to have to contain it.",
        "Together. Please.",
      ],
    },
    {
      id: 'r1-ch5',
      title: 'The Cell Breathes Again',
      trigger: 'defeat-boss',
      speaker: 'Elliot',
      lines: [
        "You did it!",
        "The lysosome is contained! The organelles are coming back!",
        "The mitochondria unpacked! The Golgi is regrowing its stacks! The ER is... still in denial, but that's sort of its baseline.",
        "This is the happiest day of my professional career.",
        "Which says a lot about my career.",
        "Thank you. I mean it.",
        "Also please don't tell anyone it took you twenty minutes and it took me three weeks.",
      ],
    },
  ],
  environmentLore: [
    {
      id: 'r1-env1',
      title: 'Dead Ribosome',
      text: "Cause of death: insufficient mRNA. It tried its best. A small protein, half-finished, lies beside it. The ribosome got to amino acid 47 before giving up. 47 is a respectable number.",
    },
    {
      id: 'r1-env2',
      title: 'Mitochondrion With Packed Bags',
      text: "We've been evacuating for 3 weeks. Please send help. Or at least NAD+. We can produce ATP under almost any condition except this one. This one is a lot.",
    },
    {
      id: 'r1-env3',
      title: 'Golgi Apparatus (Missing Stacks)',
      text: "I used to have seven stacks. I have four. Do you know how long glycoprotein folding takes? Do you know the PRECISION required? I'm doing my best with four. It's not my best best.",
    },
    {
      id: 'r1-env4',
      title: 'The ATP Floor',
      text: "This floor was once pure ATP. Now it's mostly ADP and inorganic phosphate. Economic downturn. The phosphate group left and took all the energy with it. Classic.",
    },
    {
      id: 'r1-env5',
      title: 'Nuclear Entrance Sign',
      text: "RESTRICTED ZONE — Authorized Personnel Only. Are you authorized? We have no way to check. We sealed the nuclear pore three weeks ago. Please act like you are authorized. We will probably believe you.",
    },
    {
      id: 'r1-env6',
      title: 'Broken Endoplasmic Reticulum',
      text: "Rough ER, currently smooth. The ribosomes left. We don't talk about it. We used to be a manufacturing powerhouse. Now we're just a membrane. A very nice membrane. With feelings.",
    },
    {
      id: 'r1-env7',
      title: 'Deprecated DNA Strand',
      text: "I'm a deprecated gene. I haven't been expressed since the Jurassic period. I'm fine. I keep myself busy. I've been called 'junk DNA' since 1972. I'm not junk. I'm just on sabbatical.",
    },
    {
      id: 'r1-env8',
      title: 'Lysosome Warning Sign',
      text: "CAUTION: LYSOSOMAL ACTIVITY. Anything that enters this zone will be digested. Yes, including that. Yes, including you. Lysosomes operate at pH 4.5. Your optimal pH is 7.4. Do the math.",
    },
    {
      id: 'r1-env9',
      title: "Elliot's Field Notes",
      text: "Day 1: Arrived. Day 3: Located all organelles. Day 7: LYSO incident began. Day 11: Nucleus sealed. Day 14: Tried interpretive movement to communicate with nuclear pore. Day 21: Still here. Sandwiches running low.",
    },
  ],
};

// ─── REALM 2: The Forest That Forgot Its Own Code ────────────────────────────

const REALM2_LORE: WorldLore = {
  realmId: 2,
  name: 'The Genome Forest',
  tagline: 'The Forest That Forgot Its Own Code',
  entryStory: [
    'The trees here are made of chromosomes.',
    'Sequences spiral up their trunks — ATCG, ATCG, ATCG — and then, partway up: ATGG. Wrong.',
    'Everywhere you look, something is subtly incorrect.',
    'A teenager in headphones is sitting cross-legged on a fallen log, reading a paper and eating a sandwich.',
    'He does not look up.',
  ],
  mainQuestTitle: 'Restore the Reference Genome Before the Forest Collapses',
  mainQuestSummary:
    'A retrovirus infiltrated the reference genome 200 years ago and nobody noticed. ' +
    'Chromosomal trees carry corrupted sequences — point mutations, tandem repeats, misannotations. ' +
    'The forest is slowly rewriting itself with wrong instructions. ' +
    'Ben has been here three months. He has documented 47 new variants and eaten a lot of sandwiches.',
  urgency: "The corrupted sequences are spreading. A tree just expressed a hypothetical protein. We have no idea what it does. We never did. It's been in the database since 1998.",
  chapters: [
    {
      id: 'r2-ch1',
      title: 'New Person',
      trigger: 'enter-realm',
      speaker: 'Ben',
      lines: [
        "Oh.",
        "New person.",
        "Cool.",
        "(He does not look up from his paper.)",
        "Do you know pandas? Or BLAST? Or any bioinformatics tool at all?",
        "(You say no.)",
        "We'll fix that.",
        "(He turns a page.)",
        "I'm Ben.",
      ],
    },
    {
      id: 'r2-ch2',
      title: 'One Nucleotide',
      trigger: 'complete-node',
      nodeId: 'l2-m1-n1',
      speaker: 'Ben',
      lines: [
        "See?",
        "ATCG. Not ATGG.",
        "One nucleotide.",
        "That's the difference between a functional protein and complete nonsense.",
        "This is why I hate point mutations.",
        "(He finishes his sandwich.)",
        "Good work.",
      ],
    },
    {
      id: 'r2-ch3',
      title: 'Antisense',
      trigger: 'complete-node',
      nodeId: 'l2-m2-n1',
      speaker: 'Ben',
      lines: [
        "That sequence reads backwards.",
        "Antisense strand. The forest forgot which direction to read.",
        "Classic.",
        "RNA polymerase reads 3' to 5'. The mRNA is synthesized 5' to 3'. If you get confused, everything falls apart.",
        "The forest is confused.",
        "We're going to un-confuse it.",
      ],
    },
    {
      id: 'r2-ch4',
      title: 'The Retrovirus',
      trigger: 'complete-node',
      nodeId: 'l2-m3-n1',
      speaker: 'Ben',
      lines: [
        "I ran BLAST on the corrupted sequences.",
        "They share 98.7% identity with a retrovirus.",
        "Something infected this genome and wrote itself into the DNA.",
        "Two hundred years ago. Possibly longer.",
        "Also classic that nobody noticed.",
        "(He opens his laptop.)",
        "Also classic that I found it with a search tool that runs in two seconds.",
      ],
    },
    {
      id: 'r2-ch5',
      title: 'Genome Restored',
      trigger: 'defeat-boss',
      speaker: 'Ben',
      lines: [
        "Genome restored. Reference realigned.",
        "I've documented 47 new variants from this event.",
        "The paper is basically writing itself.",
        "(He closes his laptop.)",
        "I'm 16.",
        "(Beat.)",
        "Just so you know.",
      ],
    },
  ],
  environmentLore: [
    {
      id: 'r2-env1',
      title: 'Ancient Chromosomal Tree (Cross-Section)',
      text: "Ring 1: SPECIES ORIGIN. Ring 47: FIRST INTRON. Ring 113: BENEFICIAL MUTATION. Ring 218: A MISTAKE. Ring 219: AN APOLOGY. Ring 220: AN ATTEMPT TO FIX IT. Ring 221: A DIFFERENT MISTAKE.",
    },
    {
      id: 'r2-env2',
      title: 'BLAST Results (Pinned to Tree)',
      text: "Query: ATCGGCAATA. Database hits: 4,102. Top hit: Organism Unknown. Identity: 99.3%. E-value: 0.00. Gene function: Unknown. We have no idea what this gene does. We're very confident it matches something we also don't understand.",
    },
    {
      id: 'r2-env3',
      title: 'RNA-seq Analysis Poster',
      text: "Genes that should be ON: 40% OFF. Genes that should be OFF: 60% ON. Genes doing something unexpected: 23%. Genes that are hypothetical: 31%. This genome needs therapy. Or at minimum, a HISAT2 realignment.",
    },
    {
      id: 'r2-env4',
      title: 'Sequencing Machine (Overgrown)',
      text: "Status: RUNNING. Reads processed: 847,000,000. ETA: Unknown. Error log: 1 entry — 'Someone spilled coffee in 2019. Q-scores degraded. We have been compensating ever since.'",
    },
    {
      id: 'r2-env5',
      title: 'Broken Gene Annotation',
      text: "Gene ID: ENSG00000174444. Function: Hypothetical protein. First annotated: 1998. Times cited: 3. Papers that verified the function: 0. Status: Still hypothetical. We are comfortable with ambiguity.",
    },
    {
      id: 'r2-env6',
      title: 'CRISPR Tool (Left on Ground)',
      text: "Please do not use this unsupervised. Seriously. This cuts DNA at specific sequences and edits them. In the right hands: medicine. In the wrong hands: an unplanned experiment with irreversible consequences. Ben left a sticky note: 'I MEAN IT.'",
    },
    {
      id: 'r2-env7',
      title: "Ben's Sandwich Wrappers",
      text: "Tuna. Tuna. Egg salad. Tuna. Ben says omega-3 fatty acids support cognitive function. He has eaten 23 sandwiches in 3 months. He has also read 47 papers. The sandwiches and the papers are related.",
    },
  ],
};

// ─── REALM 3: The Network That Believed Too Hard ──────────────────────────────

const REALM3_LORE: WorldLore = {
  realmId: 3,
  name: 'The Neural Nebula',
  tagline: 'The Network That Believed Too Hard',
  entryStory: [
    'The sky here is made of loss curves.',
    'Most of them are going down. One of them, labeled OVERFIT, is at zero. Perfectly, unnervingly zero.',
    'Floating neural networks drift overhead like jellyfish.',
    'A woman in a hoodie is sitting at a floating desk, staring at a graph with the expression of someone watching a slow-motion disaster.',
    'She does not notice you for four full seconds.',
  ],
  mainQuestTitle: 'Regularize OVERFIT Before It Consumes Every Network',
  mainQuestSummary:
    'OVERFIT achieved 100% training accuracy three weeks ago and has not stopped since. ' +
    'It memorized every training example. Every noise artifact. Every outlier. ' +
    'Now it is expanding, consuming other networks, assuring them it already knows the answers. ' +
    'On test data: it fails. Confidently, completely, every time. ' +
    "Alex has been here since epoch 3. She's on her sixth cold brew.",
  urgency: "OVERFIT is approaching the validation set. If it touches it, the entire nebula loses the ability to generalize. This would be a significant problem.",
  chapters: [
    {
      id: 'r3-ch1',
      title: 'Loss Diverged',
      trigger: 'enter-realm',
      speaker: 'Alex',
      lines: [
        "(Four seconds of silence.)",
        "Sorry.",
        "Loss diverged.",
        "It's fine.",
        "I'm fine.",
        "(She looks up.)",
        "You don't know what a loss function is, do you.",
        "(Not a question.)",
        "Sit down.",
      ],
    },
    {
      id: 'r3-ch2',
      title: 'Actually Generalizing',
      trigger: 'complete-node',
      nodeId: 'l3-m1-n1',
      speaker: 'Alex',
      lines: [
        "It's learning.",
        "Not memorizing — actually generalizing.",
        "Do you know how rare that is?",
        "Most networks just... remember. They're very good at remembering.",
        "Remembering is not learning.",
        "(She saves a checkpoint.)",
        "Good.",
      ],
    },
    {
      id: 'r3-ch3',
      title: 'OVERFIT Approaches',
      trigger: 'complete-node',
      nodeId: 'l3-m2-n1',
      speaker: 'Alex',
      lines: [
        "(She points at a massive glowing network in the distance.)",
        "That's it.",
        "OVERFIT.",
        "It's claiming 99.9% confidence on everything.",
        "(She pulls up a confusion matrix.)",
        "On data it has never seen before.",
        "Confident. Wrong. Every single time.",
        "It already KNOWS. All answers. To questions that don't exist yet.",
        "(A long pause.)",
        "We are going to teach it humility.",
      ],
    },
    {
      id: 'r3-ch4',
      title: 'Two Matrices',
      trigger: 'complete-node',
      nodeId: 'l3-m3-n1',
      speaker: 'Alex',
      lines: [
        "(She pulls up a confusion matrix.)",
        "Perfect training diagonal. See? Every prediction correct.",
        "(She pulls up another.)",
        "Test data.",
        "(Chaos. Red everywhere.)",
        "Confident. Wrong. Every time.",
        "That gap — between training and validation — that's the whole problem.",
        "That gap has a name. We call it overfitting.",
        "We are going to close it.",
      ],
    },
    {
      id: 'r3-ch5',
      title: 'Validation Loss Dropping',
      trigger: 'defeat-boss',
      speaker: 'Alex',
      lines: [
        "Validation loss is dropping.",
        "It's actually learning now. Not memorizing.",
        "(She watches the curves for a long moment.)",
        "This is the first time I've felt okay since epoch 3.",
        "(She closes her laptop.)",
        "Let's go home.",
      ],
    },
  ],
  environmentLore: [
    {
      id: 'r3-env1',
      title: 'Network Tombstone',
      text: "Here lies LINEAR_REG_V1. R²=1.0 on training. It was so confident. On new data: R²= -0.3. It never worked again. It never understood why. We understood why. We did not tell it. That would have been unkind.",
    },
    {
      id: 'r3-env2',
      title: 'Lost Gradient (Warning Marker)',
      text: "STATUS: LOST. Last seen: Local minimum, epoch 47. Gradient magnitude: 0.0000001. If found, do not attempt to scale — you will vanish with it. Use skip connections. Use residuals. Use anything. Do not use this path.",
    },
    {
      id: 'r3-env3',
      title: 'Floating Loss Curve',
      text: "Week 1: Decreasing (promising). Week 2: Decreasing (exciting). Week 3: NaN. A learning rate scheduler would have helped. We did not use one. This is the result of not using one.",
    },
    {
      id: 'r3-env4',
      title: 'Abandoned Hyperparameter Grid',
      text: "1,024 combinations attempted. Best found: lr=0.001, dropout=0.3, batch_size=32. We tried lr=0.0001 first and gave up. That was a mistake. lr=0.0001 would have worked. We will never know if we would have been happy.",
    },
    {
      id: 'r3-env5',
      title: 'Star Labeled ATTENTION',
      text: "Attention mechanism. Relates every token to every other token. Complexity: O(N²). We are aware. We don't love it either. For long sequences: problematic. For understanding context: unmatched. We made our peace with it in 2017.",
    },
    {
      id: 'r3-env6',
      title: "Alex's Empty Coffee Cup",
      text: "Six shots of cold brew. She has been awake for 38 hours. The coffee is also awake, technically, in the sense that caffeine molecules are still circulating. She refilled it twice. The cup has seen things.",
    },
    {
      id: 'r3-env7',
      title: 'Dropout Layer (Floating, Inactive)',
      text: "Randomly sets activations to zero during training. Prevents co-adaptation. Forces the network to not rely on any single neuron. Alex's note attached: 'This. Use this. I'm serious. Use dropout.'",
    },
  ],
};

// ─── REALM 4: The Fold That Was Forgotten ─────────────────────────────────────

const REALM4_LORE: WorldLore = {
  realmId: 4,
  name: 'The Protein Cathedral',
  tagline: 'The Fold That Was Forgotten',
  entryStory: [
    'The Protein Cathedral is made of alpha helices and beta sheets, crystalline and vast.',
    'Light refracts through the secondary structures in colors that have no name in protein databases.',
    'Sections of the cathedral have gone gray — rigid, fibrous, wrong.',
    'A man in a lab coat stands at the entrance. He does not startle when you arrive.',
    'He was waiting.',
    'He has been waiting for a long time.',
  ],
  mainQuestTitle: 'Dissolve the Amyloid Tyrant Before the Cathedral Falls',
  mainQuestSummary:
    'A misfolded protein seeded an amyloid cascade. The Amyloid Tyrant is aggregating everything it touches — ' +
    'correct folds pulled into wrong conformations, one by one. ' +
    "Henry has been here for decades. He knows every structure in this cathedral. " +
    "He will teach you everything. He needs something in return, though he has not said what yet.",
  urgency: "The amyloid fibril front is advancing at 3 residues per hour. The cathedral's structural proteins are next. After that: everything.",
  chapters: [
    {
      id: 'r4-ch1',
      title: 'He Was Waiting',
      trigger: 'enter-realm',
      speaker: 'Henry',
      lines: [
        "I knew you would come.",
        "Eventually.",
        "(He turns to face you without surprise.)",
        "You've learned a great deal. The cell. The genome. The networks.",
        "Now you're here — where code becomes shape.",
        "Where sequence becomes structure.",
        "Where structure determines everything.",
        "(Beat.)",
        "Also we have a misfolding crisis.",
        "Come.",
      ],
    },
    {
      id: 'r4-ch2',
      title: 'AlphaFold Changed Everything',
      trigger: 'complete-node',
      nodeId: 'l4-m1-n1',
      speaker: 'Henry',
      lines: [
        "AlphaFold changed everything.",
        "For fifty years, humanity tried to compute protein structure from sequence.",
        "Solved in a year. By a neural network.",
        "(He looks at the newly folded structure.)",
        "The shape of the universe had been waiting for us to figure it out.",
        "We finally did.",
        "(Quietly:)",
        "I have complicated feelings about this.",
      ],
    },
    {
      id: 'r4-ch3',
      title: 'What Alzheimer\'s Looks Like',
      trigger: 'complete-node',
      nodeId: 'l4-m2-n1',
      speaker: 'Henry',
      lines: [
        "(The amyloid section. Everything gray.)",
        "Amyloid.",
        "Misfolded, then aggregated, then recruited neighboring proteins into the same wrong fold.",
        "This is what Alzheimer's looks like at the molecular level.",
        "This is what Parkinson's looks like.",
        "Prion disease. Type 2 diabetes. Multiple systems.",
        "(He stops.)",
        "(Quietly:)",
        "We will unfold it.",
      ],
    },
    {
      id: 'r4-ch4',
      title: 'Certainty Is Not Correctness',
      trigger: 'complete-node',
      nodeId: 'l4-m3-n1',
      speaker: 'Henry',
      lines: [
        "(He pulls up an AlphaFold confidence map.)",
        "Dark blue: high confidence. The protein knows its shape.",
        "Orange: uncertainty. The structure is flexible here.",
        "(He points to the amyloid front.)",
        "The Amyloid Tyrant exploits uncertainty.",
        "It offers an alternative fold. Wrong, but certain.",
        "Proteins in the uncertain regions choose certainty over correctness.",
        "(He closes the map.)",
        "Certainty is not correctness.",
        "Remember that.",
      ],
    },
    {
      id: 'r4-ch5',
      title: 'The Cathedral Heals',
      trigger: 'defeat-boss',
      speaker: 'Henry',
      lines: [
        "The amyloid is dissolving.",
        "The fibrils are dissociating.",
        "(The gray sections flush with color — alpha helices reforming, beta sheets untwisting.)",
        "The cathedral is healing.",
        "(A long pause.)",
        "You've done something remarkable.",
        "(At the screen's edge: a pixel flickers. The silhouette of a woman in a lab coat — just for a moment. Gone.)",
        "Come.",
        "There is more to learn.",
      ],
    },
  ],
  environmentLore: [
    {
      id: 'r4-env1',
      title: 'Protein Structure Display (Confidence: 97)',
      text: "AlphaFold pLDDT score: 97. This protein knows its shape. Every residue is confident. Some proteins are like this — structured, certain, stable. Most proteins have at least one disordered region. This one doesn't. It's showing off.",
    },
    {
      id: 'r4-env2',
      title: 'Beta Sheet Tombstone',
      text: "Here lies a correctly folded prion protein. It met an incorrectly folded one. The incorrectly folded one was very persuasive. The rest is history, specifically the history of prion disease, which is a very bad history.",
    },
    {
      id: 'r4-env3',
      title: 'Old Experiment Log',
      text: "Trial 1492: Structure unresolved. Trial 1493: Structure unresolved. Trial 1494: It folded. We cried. Twelve years of crystallization attempts. The crystal was 0.3 mm. We cried for a while.",
    },
    {
      id: 'r4-env4',
      title: 'Structural Biology Methods Poster',
      text: "X-ray crystallography: Takes years. Requires a perfect crystal. Results: Angstrom resolution. Cryo-EM: Takes months. No crystal required. Results: Near-atomic. AlphaFold: Takes minutes. Requires a GPU. Results: Remarkably close. We are still catching up emotionally.",
    },
    {
      id: 'r4-env5',
      title: 'Photograph (Pinned to Cathedral Wall)',
      text: "[MYSTERY] A woman in a lab coat, smiling at a microscope. The label reads: 'Dr. H. Lacks — Immortal Cells Project.' You don't recognize her. Something about her eyes is familiar. Henry walks past without looking at it. He always walks past without looking at it.",
    },
    {
      id: 'r4-env6',
      title: 'Partial Journal Entry (Weathered)',
      text: "[MYSTERY] Day 1 in here. The digital realm is navigable. The structures are extraordinary. My cells — my *wife's* cells, technically — contain the key to unlimited proliferation. She figured it out before I did. I have had a long time to think about what that means. — H.L.",
    },
    {
      id: 'r4-env7',
      title: 'Terminal (Back Alcove)',
      text: "[MYSTERY] FILENAME: immortality_is_transferable.py — FILE TYPE: encrypted — LAST MODIFIED: 49 years ago — LAST ACCESSED: today — ENCRYPTION KEY: [REDACTED] — Henry appears behind you. 'You don't need to open that yet.' He sneezes. He does not acknowledge the sneeze.",
    },
    {
      id: 'r4-env8',
      title: 'HeLa Fragment (Glowing)',
      text: "[MYSTERY] Immortal. Still proliferating. Of uncertain origin. Henry goes very quiet when you find this. 'Handle it carefully,' he says. 'That belongs to someone important.' He does not say who. He sneezes again. He does not acknowledge this either.",
    },
    {
      id: 'r4-env9',
      title: 'AlphaFold Confidence Display (Full Proteome)',
      text: "200,000 human proteins predicted. Confidence: variable. 35% have significant disordered regions. Henry's note: 'Disorder is not failure. Intrinsically disordered proteins are often the most important — hubs of regulation, flexible for a reason.' He wrote this 49 years ago. It is still correct.",
    },
    {
      id: 'r4-env10',
      title: "1958 Structural Biology Certificate",
      text: "Congratulates John Kendrew and Max Perutz on the first protein structure determination. Myoglobin. Twenty years of work. Henry looks at this for a long moment every time he passes it. 'They did it without a computer,' he says, eventually. 'That matters.'",
    },
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const WORLD_LORES: WorldLore[] = [
  REALM1_LORE,
  REALM2_LORE,
  REALM3_LORE,
  REALM4_LORE,
];

export function getWorldLore(realmId: 1 | 2 | 3 | 4): WorldLore {
  const lore = WORLD_LORES.find((w) => w.realmId === realmId);
  if (!lore) throw new Error(`No world lore for realm ${realmId}`);
  return lore;
}
