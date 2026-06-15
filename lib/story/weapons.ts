// ─── Weapon / Item Definitions — all 4 realms ────────────────────────────────

export interface Weapon {
  id: string;
  name: string;
  realmId: 1 | 2 | 3 | 4;
  type: 'tool' | 'consumable' | 'artifact';
  description: string;
  effect: 'reveal-answer' | 'extra-time' | 'skip' | 'shield' | 'hint' | 'eliminate-wrong' | 'double-xp';
  effectDescription: string;
  uses: number;
  foundIn: string;
  color: string;
  lore: string;
}

// ─── REALM 1: Cytoplasm ───────────────────────────────────────────────────────

const REALM1_WEAPONS: Weapon[] = [
  {
    id: 'r1-w1',
    name: 'Pipette of Precision',
    realmId: 1,
    type: 'tool',
    description: "Elliot's favorite pipette. He named it Gerald. Gerald has been through a lot.",
    effect: 'reveal-answer',
    effectDescription: 'Reveals the correct answer to the current question. Gerald does the heavy lifting.',
    uses: 1,
    foundIn: "Elliot's overturned equipment pack, near the entrance ribosome",
    color: '#3399ff',
    lore: "Gerald has been calibrated 47 times. He is accurate to 0.1 microliters. Elliot cried when he found him after LYSO ate the spectrometer. 'Gerald made it,' Elliot said. 'Gerald always makes it.'",
  },
  {
    id: 'r1-w2',
    name: 'ATP Capsule',
    realmId: 1,
    type: 'consumable',
    description: 'Concentrated cellular energy. Glows faintly. Smells like phosphate.',
    effect: 'extra-time',
    effectDescription: 'Adds 30 seconds to the current question timer. Cellular energy for cellular thinking.',
    uses: 3,
    foundIn: 'Scattered across the ATP floor near the mitochondrial evacuation zone',
    color: '#ffcc00',
    lore: "ATP: adenosine triphosphate. The energy currency of every living cell. One glucose molecule yields approximately 32 of these. That number used to be 36. Scientists updated it in the 2000s. Elliot mourned the 4.",
  },
  {
    id: 'r1-w3',
    name: 'Nucleus Key',
    realmId: 1,
    type: 'artifact',
    description: 'A nuclear localization signal, crystallized into key form. The nucleus will know.',
    effect: 'skip',
    effectDescription: 'Skips the current question entirely. The nucleus grants you passage through this one.',
    uses: 1,
    foundIn: 'Hidden inside the nuclear pore complex, behind the RESTRICTED ZONE sign',
    color: '#cc44ff',
    lore: "Nuclear localization signals are amino acid sequences that direct proteins into the nucleus. This one has been crystallized by decades of nuclear isolation into something like a key. The nucleus recognizes it. How it ended up outside, Elliot does not know. 'The nucleus has always done things its own way,' he says.",
  },
  {
    id: 'r1-w4',
    name: 'Chaperone Shield',
    realmId: 1,
    type: 'artifact',
    description: "A molecular chaperone, repurposed as armor. It wraps around vulnerable structures and says 'I got you.'",
    effect: 'shield',
    effectDescription: 'Blocks the next wrong-answer heart loss. The chaperone absorbs the mistake instead.',
    uses: 2,
    foundIn: 'Found clinging to an unfolded protein blob near the Rough ER ruins',
    color: '#44cc88',
    lore: "Molecular chaperones assist protein folding without becoming part of the final structure. They prevent aggregation. They recognize exposed hydrophobic patches and shield them. This one is particularly attentive. It says 'I got you' a lot. It means it.",
  },
  {
    id: 'r1-w5',
    name: 'Centrifuge',
    realmId: 1,
    type: 'tool',
    description: 'A miniaturized ultracentrifuge. Separates bad answers from good ones, if you believe.',
    effect: 'eliminate-wrong',
    effectDescription: 'Eliminates 2 incorrect answer options by density. Wrong answers are lighter. Mostly.',
    uses: 2,
    foundIn: "Near Elliot's abandoned lab setup, still spinning from three weeks ago",
    color: '#cc8844',
    lore: "Ultracentrifugation separates cellular components by density. Nuclei pellet first. Mitochondria next. Ribosomes after that. Elliot left this running when the LYSO incident started. It has been spinning for 21 days. It shows no signs of stopping. The rotor is fine. The rotor is always fine.",
  },
];

// ─── REALM 2: Genome Forest ───────────────────────────────────────────────────

const REALM2_WEAPONS: Weapon[] = [
  {
    id: 'r2-w1',
    name: "Ben's Sandwich",
    realmId: 2,
    type: 'consumable',
    description: 'Tuna on whole grain. Ben says omega-3 fatty acids demonstrably support cognitive function during variant calling.',
    effect: 'double-xp',
    effectDescription: 'Doubles XP earned from the next question. Ben was eating one when he found 47 new variants. Correlation is not causation. Probably.',
    uses: 1,
    foundIn: "Beside a fallen chromosomal tree, wrapped in a paper with Ben's handwriting on it: 'Back in 20 min'",
    color: '#cc9944',
    lore: "Tuna contains DHA and EPA omega-3 fatty acids. Omega-3s are associated with improved cognitive performance in peer-reviewed studies. Ben cites three of them. He has also cited 47 variant annotations in the past three months. The sandwiches and the citations are almost certainly related. Ben says this is a hypothesis, not a conclusion.",
  },
  {
    id: 'r2-w2',
    name: 'BLAST Cursor',
    realmId: 2,
    type: 'tool',
    description: 'The search cursor from a BLAST alignment run. It has searched 10 billion bases. It deserves rest.',
    effect: 'hint',
    effectDescription: 'Provides a targeted hint by running sequence similarity against known answers. E-value guidance included.',
    uses: 3,
    foundIn: 'Hovering over a corrupted sequence near the retrovirus insertion site',
    color: '#4466ff',
    lore: "BLAST: Basic Local Alignment Search Tool. Searches databases of billions of sequences in seconds. The cursor has processed 10,847,293,122 bases in this forest. It found the retrovirus. It would find anything. It is very tired. It still works. It is professional about it.",
  },
  {
    id: 'r2-w3',
    name: 'Reference Genome Fragment',
    realmId: 2,
    type: 'artifact',
    description: 'A verified fragment of the correct reference sequence. Peer-reviewed. Coffee stained.',
    effect: 'reveal-answer',
    effectDescription: 'Reveals the correct answer — the reference always knows what the sequence should be.',
    uses: 1,
    foundIn: "In the oldest chromosomal tree, in a region pre-dating the retroviral infection",
    color: '#66ff88',
    lore: "The reference genome is the agreed-upon 'correct' version of a species' genome. Every variant is called relative to it. This fragment predates the retroviral corruption — it shows what the sequence should look like. It has a coffee stain on it. Ben does not know whose coffee it was. He is fairly certain it was not his.",
  },
  {
    id: 'r2-w4',
    name: 'Variant Caller',
    realmId: 2,
    type: 'tool',
    description: 'A heuristic variant calling algorithm. Knows the difference between real variants and sequencing errors.',
    effect: 'eliminate-wrong',
    effectDescription: 'Eliminates 2 incorrect answer options by calling them as sequencing artifacts rather than true variants.',
    uses: 3,
    foundIn: 'Attached to the overgrown sequencing machine, still running its pipeline',
    color: '#ff6644',
    lore: "Variant callers distinguish true biological variants from sequencing errors using quality scores, read depth, allele frequency, and strand bias. GATK, DeepVariant, FreeBayes. This one uses an algorithm Ben wrote at age 14. It outperforms GATK on this dataset. He has not told anyone. He's waiting for the right moment.",
  },
  {
    id: 'r2-w5',
    name: 'Phred Booster',
    realmId: 2,
    type: 'consumable',
    description: 'Q40+ confidence boost. High-quality base calls mean you do not need to rush.',
    effect: 'extra-time',
    effectDescription: 'Adds 45 seconds to the current question timer. High-quality input reduces time pressure.',
    uses: 2,
    foundIn: 'In the quality control station near the BLAST terminal',
    color: '#aaffdd',
    lore: "Phred quality scores: Q10 = 90% accuracy, Q20 = 99%, Q30 = 99.9%, Q40 = 99.99%. Ben requires Q30 minimum. For important calls, Q40. This boost provides Q40-equivalent confidence. You don't need to rush. The answer is there. You have the reads. You have the quality. Take the time.",
  },
];

// ─── REALM 3: Neural Nebula ───────────────────────────────────────────────────

const REALM3_WEAPONS: Weapon[] = [
  {
    id: 'r3-w1',
    name: "Alex's Coffee",
    realmId: 3,
    type: 'consumable',
    description: '6 shots of cold brew. She has been awake 38 hours. The coffee is also, technically, awake.',
    effect: 'extra-time',
    effectDescription: 'Adds 60 seconds to the current question timer. Alex runs on this. The caffeine is load-bearing.',
    uses: 3,
    foundIn: 'On the floating desk, next to the diverged loss curve, next to a second empty cup',
    color: '#4a3000',
    lore: "Caffeine works by blocking adenosine receptors in the brain, preventing the feeling of fatigue. Six shots deliver approximately 360mg of caffeine. The recommended daily limit is 400mg. Alex is at 1,100mg. She says she is fine. The loss curve says otherwise. The coffee does not comment.",
  },
  {
    id: 'r3-w2',
    name: 'Gradient Clip',
    realmId: 3,
    type: 'artifact',
    description: 'Clips gradients to a maximum norm. Also clips damage from bad decisions.',
    effect: 'shield',
    effectDescription: 'Blocks the next wrong-answer heart loss. Gradient clipping prevents catastrophic updates.',
    uses: 2,
    foundIn: 'Attached to a network layer near the NaN Entity warning zone',
    color: '#ff4444',
    lore: "Gradient clipping sets a maximum norm for gradient updates during backpropagation. Prevents the gradient explosion that leads to NaN loss. Alex added this to every model after epoch 3. She calls it 'the thing I should have added from the start.' She says this without inflection. It is accurate.",
  },
  {
    id: 'r3-w3',
    name: 'Dropout Mask',
    realmId: 3,
    type: 'artifact',
    description: 'Randomly disables wrong options. Makes you more resilient by forcing you to not rely on any single path.',
    effect: 'eliminate-wrong',
    effectDescription: 'Randomly eliminates 1-3 incorrect answer options. Dropout rate: 0.3. Expected elimination: 2.',
    uses: 1,
    foundIn: 'Floating over the Overfitted Minion patrol zone',
    color: '#aaaaaa',
    lore: "Dropout randomly sets a fraction of network activations to zero during training. This prevents co-adaptation — neurons cannot rely on specific other neurons. The network learns more robust, distributed representations. Alex uses dropout=0.3 as her default. She has used it in 47 models. It has helped in 46.",
  },
  {
    id: 'r3-w4',
    name: 'Early Stopping Checkpoint',
    realmId: 3,
    type: 'artifact',
    description: "The model stopped here because it was getting worse. Smart. So can you.",
    effect: 'skip',
    effectDescription: 'Skips the current question. The checkpoint preserves the best model state — sometimes knowing when to stop is the skill.',
    uses: 1,
    foundIn: "Saved to a floating disk at the point where the validation loss was lowest",
    color: '#88ff44',
    lore: "Early stopping monitors validation loss during training and stops when it begins to increase — a sign of overfitting. The checkpoint saves the model at the best validation performance. This checkpoint was saved at epoch 127. The model kept training until epoch 500. Epoch 127 was where it should have stopped. The checkpoint knew.",
  },
  {
    id: 'r3-w5',
    name: 'Confusion Matrix Lens',
    realmId: 3,
    type: 'tool',
    description: 'Shows not just if you are wrong, but HOW you are wrong. Categorical insight.',
    effect: 'hint',
    effectDescription: "Provides a structured hint indicating what TYPE of answer is needed — category, direction, or format.",
    uses: 3,
    foundIn: "On Alex's floating desk, tabbed open next to the training curves",
    color: '#ff8800',
    lore: "A confusion matrix shows predictions versus actual labels — not just accuracy, but the pattern of errors. False positives versus false negatives. Precision versus recall. Where the model is confident and wrong versus uncertain and right. Alex reads confusion matrices the way other people read faces. She says they're more honest.",
  },
];

// ─── REALM 4: Protein Cathedral ───────────────────────────────────────────────

const REALM4_WEAPONS: Weapon[] = [
  {
    id: 'r4-w1',
    name: "Henry's Notes",
    realmId: 4,
    type: 'artifact',
    description: "49 years of folding notes. There is a pressed flower on page 207 with no annotation.",
    effect: 'reveal-answer',
    effectDescription: "Reveals the correct answer. Henry has been thinking about these structures for 49 years. He knows.",
    uses: 1,
    foundIn: "On the reading stand near the AlphaFold confidence display, open to a dog-eared page",
    color: '#eeeecc',
    lore: "The notebook contains 49 years of structural observations, hand-drawn protein sketches, and margin notes on every major paper in the field. Page 207 has a pressed flower between two diagrams of an alpha helix. There is no annotation. Henry does not explain it. He does not look at it for very long.",
  },
  {
    id: 'r4-w2',
    name: 'AlphaFold Prediction',
    realmId: 4,
    type: 'tool',
    description: 'pLDDT > 90. This protein knows its shape. Dark blue confidence. Use accordingly.',
    effect: 'hint',
    effectDescription: 'Provides a high-confidence structural hint. High-pLDDT regions are shown — the answer structure is visible.',
    uses: 3,
    foundIn: 'Projected on the cathedral wall near the structural biology methods poster',
    color: '#0044cc',
    lore: "AlphaFold2 predicts protein structure from sequence with pLDDT (predicted local distance difference test) scores from 0-100. Above 90: very high confidence. 70-90: confident. 50-70: low confidence. Below 50: disordered. This prediction is dark blue across 94% of residues. The remaining 6% are genuinely disordered. Henry finds this beautiful.",
  },
  {
    id: 'r4-w3',
    name: 'Crystallization Flask',
    realmId: 4,
    type: 'consumable',
    description: 'A protein crystallization drop, perfectly equilibrated. Crystallizes time as well as protein.',
    effect: 'extra-time',
    effectDescription: 'Adds 45 seconds to the current question timer. Crystal growth requires patience — so does good thinking.',
    uses: 2,
    foundIn: 'In the crystallography station near the old experiment log',
    color: '#88ddff',
    lore: "Vapor diffusion crystallization: a protein drop slowly equilibrates with a well solution, increasing protein concentration until crystals nucleate and grow. Takes days to months. The waiting is most of the work. Henry says: 'A crystal does not hurry. Neither should you.' He has been here 49 years. He has perspective on waiting.",
  },
  {
    id: 'r4-w4',
    name: 'MD Sim',
    realmId: 4,
    type: 'tool',
    description: 'A molecular dynamics simulation. Ruled out 97% of conformations. The remaining 3% are interesting.',
    effect: 'eliminate-wrong',
    effectDescription: 'Eliminates 2-3 incorrect answer options by simulating their dynamics and finding them unstable.',
    uses: 3,
    foundIn: 'Running on a terminal near the back alcove, 847 nanoseconds into a 1-microsecond simulation',
    color: '#44aacc',
    lore: "Molecular dynamics simulations model the physical movement of atoms over time using Newtonian mechanics. They show how proteins flex, breathe, and transition between conformations. This simulation has run for 847 nanoseconds — real time: three weeks. It has eliminated 2,341 possible conformations. Three remain. Henry says they are all interesting for different reasons.",
  },
  {
    id: 'r4-w5',
    name: 'HeLa Cell Fragment',
    realmId: 4,
    type: 'artifact',
    description: 'Immortal. Still proliferating. Henry goes very quiet when you find this.',
    effect: 'double-xp',
    effectDescription: 'Doubles all XP earned during the boss fight. For use against the Amyloid Tyrant only. Handle carefully.',
    uses: 1,
    foundIn: 'In the back alcove, near the terminal. Glowing softly. Henry does not explain how it got there.',
    color: '#ff44aa',
    lore: "[MYSTERY] HeLa cells are the oldest and most widely used human cell line — derived in 1951, still proliferating in labs worldwide. Immortal in culture. Of uncertain origin, in the sense that their origin is documented and known and also complicated. Henry handles this fragment with unusual care. He says it belongs to someone important. He does not say who. He sneezes. He does not acknowledge it.",
  },
];

// ─── ALL_WEAPONS Export ───────────────────────────────────────────────────────

export const ALL_WEAPONS: Weapon[] = [
  ...REALM1_WEAPONS,
  ...REALM2_WEAPONS,
  ...REALM3_WEAPONS,
  ...REALM4_WEAPONS,
];

export function getWeaponById(id: string): Weapon | undefined {
  return ALL_WEAPONS.find((w) => w.id === id);
}

export function getWeaponsByRealm(realmId: 1 | 2 | 3 | 4): Weapon[] {
  return ALL_WEAPONS.filter((w) => w.realmId === realmId);
}
