// ─── Item System ─────────────────────────────────────────────────────────────

export type ItemRarity = 'common' | 'rare' | 'legendary';
export type ItemType = 'consumable' | 'artifact' | 'lore' | 'cosmetic' | 'key';

export interface GameItem {
  id: string;
  name: string;
  icon: string;
  realmId: 1 | 2 | 3 | 4;
  rarity: ItemRarity;
  type: ItemType;
  effect?: { xp?: number; gems?: number; hearts?: number };
  loreText: string;
  description: string;
}

export const ALL_ITEMS: GameItem[] = [
  // ─── Realm 1: The Cytoplasm ───────────────────────────────────────────────
  {
    id: 'atp-crystal',
    name: 'ATP Crystal',
    icon: '⚡',
    realmId: 1,
    rarity: 'common',
    type: 'consumable',
    effect: { xp: 200, gems: 5 },
    loreText:
      'ATP (adenosine triphosphate) is the universal energy currency of the cell. A single cell uses and regenerates its own weight in ATP every day. This crystallized form radiates the same 30.5 kJ/mol of free energy released by hydrolysis.',
    description: 'A crystallized burst of cellular energy. Grants 200 XP and 5 gems.',
  },
  {
    id: 'lysosome-key',
    name: 'Lysosome Key',
    icon: '🗝️',
    realmId: 1,
    rarity: 'rare',
    type: 'key',
    loreText:
      'Lysosomes maintain an internal pH of 4.5–5.0 using proton pumps, creating the acidic environment needed to activate their 50+ hydrolytic enzymes. This key is shaped like a V-ATPase proton pump.',
    description: 'Unlocks the sealed Lysosome Chamber near the boss gate.',
  },
  {
    id: 'mitochondria-shard',
    name: 'Mitochondria Shard',
    icon: '🔴',
    realmId: 1,
    rarity: 'common',
    type: 'artifact',
    effect: { xp: 150 },
    loreText:
      'Mitochondria have their own circular DNA — a relic of the ancient endosymbiotic event ~1.5 billion years ago when an archaeon engulfed an alpha-proteobacterium. The maternal lineage of your mitochondria traces back to that single event.',
    description: 'A fragment of crystallized inner membrane. Grants 150 XP.',
  },
  {
    id: 'golgi-stamp',
    name: 'Golgi Stamp',
    icon: '📮',
    realmId: 1,
    rarity: 'common',
    type: 'lore',
    loreText:
      'The Golgi apparatus acts as the cell\'s postal service, modifying and addressing proteins with glycosylation tags before shipping them to their destinations. It processes ~1,000 protein shipments per minute in active cells.',
    description: 'A postal tag from the Golgi sorting system. Adds a Codex entry.',
  },
  {
    id: 'er-fragment',
    name: 'ER Fragment',
    icon: '🕸️',
    realmId: 1,
    rarity: 'common',
    type: 'lore',
    loreText:
      'The endoplasmic reticulum spans nearly half the total membrane area of a cell. The rough ER is studded with 13 million ribosomes in a typical mammalian cell, each threading nascent polypeptides directly into the ER lumen.',
    description: 'A membrane fragment from the endoplasmic reticulum network.',
  },
  {
    id: 'nuclear-pore-badge',
    name: 'Nuclear Pore Badge',
    icon: '🏅',
    realmId: 1,
    rarity: 'rare',
    type: 'artifact',
    effect: { gems: 20 },
    loreText:
      'Nuclear pore complexes are the largest protein structures in the cell at ~120 MDa, assembled from ~30 different proteins (nucleoporins) each present in multiple copies. They transport ~1,000 molecules per second between nucleus and cytoplasm.',
    description: 'A badge issued by the Nucleus. Grants 20 gems.',
  },
  {
    id: 'ribosome-pearl',
    name: 'Ribosome Pearl',
    icon: '🔮',
    realmId: 1,
    rarity: 'rare',
    type: 'consumable',
    effect: { xp: 350 },
    loreText:
      'Ribosomes are the only molecular machines that make other molecular machines. They are so conserved across all life that you can swap yeast ribosomes into bacteria and they still function — the fundamental mechanism of translation is 3.5 billion years old.',
    description: 'A perfectly formed ribosomal core. Grants 350 XP.',
  },
  {
    id: 'cell-membrane-patch',
    name: 'Cell Membrane Patch',
    icon: '🛡️',
    realmId: 1,
    rarity: 'common',
    type: 'consumable',
    effect: { hearts: 2 },
    loreText:
      'The plasma membrane is a fluid mosaic of ~100 billion phospholipid molecules per cell, plus ~1 million protein molecules of >100 different types. It is only 7–10 nm thick yet maintains an electrical potential of ~70 mV across it.',
    description: 'Repaired membrane material. Restores 2 hearts.',
  },

  // ─── Realm 2: The Genome Forest ───────────────────────────────────────────
  {
    id: 'ancient-base-pair',
    name: 'Ancient Base Pair',
    icon: '🧬',
    realmId: 2,
    rarity: 'rare',
    type: 'artifact',
    effect: { xp: 250 },
    loreText:
      'The four DNA bases — adenine, thymine, guanine, cytosine — are universal across all life on Earth. A-T pairs form 2 hydrogen bonds; G-C form 3, making G-C rich regions harder to denature. The human genome contains ~3.2 billion base pairs, ~98.8% identical to chimpanzees.',
    description: 'A fossilized AT-GC pair from the oldest tree in the Genome Forest.',
  },
  {
    id: 'crispr-guide-rna',
    name: 'CRISPR Guide RNA',
    icon: '✂️',
    realmId: 2,
    rarity: 'legendary',
    type: 'key',
    effect: { xp: 500, gems: 25 },
    loreText:
      'CRISPR-Cas9 guide RNAs are ~100 nucleotides long and provide specificity through a 20 nt spacer sequence that matches the target DNA. Cas9 can edit up to 3 locations per 1,000 base pairs, limited by the requirement for a PAM sequence (NGG for SpCas9).',
    description: 'A legendary editing tool. Grants 500 XP and 25 gems.',
  },
  {
    id: 'restriction-enzyme',
    name: 'Restriction Enzyme',
    icon: '🔪',
    realmId: 2,
    rarity: 'common',
    type: 'artifact',
    loreText:
      'Restriction enzymes evolved in bacteria as a defense against phage infection. Over 3,000 restriction enzymes have been discovered, recognizing sequences of 4–8 base pairs. EcoRI — the most commonly used — cuts at G|AATTC, leaving 4-base sticky ends.',
    description: 'A molecular scissors from the Genome Forest armory.',
  },
  {
    id: 'telomere-loop',
    name: 'Telomere Loop',
    icon: '🔄',
    realmId: 2,
    rarity: 'rare',
    type: 'lore',
    loreText:
      'Telomeres are TTAGGG hexanucleotide repeats that cap chromosome ends, protecting against erosion. Human telomeres are 5,000–15,000 base pairs long. Telomerase — absent in most somatic cells but active in stem cells and 85% of cancers — replenishes them.',
    description: 'A protective telomeric cap structure. Adds a Codex entry.',
  },
  {
    id: 'transposon-chip',
    name: 'Transposon Chip',
    icon: '💾',
    realmId: 2,
    rarity: 'common',
    type: 'lore',
    loreText:
      'Transposable elements (jumping genes) make up ~45% of the human genome. Barbara McClintock discovered them in 1944 and won the Nobel Prize for it in 1983 — 35 years later. LINE-1 elements alone constitute ~17% of your DNA and occasionally still jump.',
    description: 'A mobile genetic element, frozen mid-jump.',
  },
  {
    id: 'rna-strand',
    name: 'RNA Strand',
    icon: '〰️',
    realmId: 2,
    rarity: 'common',
    type: 'consumable',
    effect: { xp: 180, gems: 8 },
    loreText:
      'RNA differs from DNA by a single oxygen atom on the 2\' carbon and uses uracil instead of thymine. The RNA world hypothesis proposes that RNA both stored genetic information AND catalyzed reactions before DNA and proteins existed — ~4 billion years ago.',
    description: 'A freshly transcribed messenger RNA. Grants 180 XP and 8 gems.',
  },
  {
    id: 'chromosome-map',
    name: 'Chromosome Map',
    icon: '🗺️',
    realmId: 2,
    rarity: 'rare',
    type: 'lore',
    loreText:
      'Humans have 46 chromosomes (23 pairs), but chromosome number doesn\'t correlate with complexity — dogs have 78, potatoes have 48, some ferns have over 1,200. The human genome project, completed in 2003, took 13 years and $2.7 billion. A genome can now be sequenced in 24 hours for ~$200.',
    description: 'A complete karyotype map of the Genome Forest.',
  },
  {
    id: 'exon-token',
    name: 'Exon Token',
    icon: '🎫',
    realmId: 2,
    rarity: 'common',
    type: 'consumable',
    effect: { xp: 120 },
    loreText:
      'Only ~1.5% of the human genome codes for proteins (exons), but through alternative splicing, ~95% of multi-exon human genes produce multiple protein isoforms. A single gene like titin has 363 exons and can produce proteins up to 3.7 MDa.',
    description: 'A ticket to the coding regions of the genome.',
  },

  // ─── Realm 3: The Neural Nebula ───────────────────────────────────────────
  {
    id: 'gradient-chip',
    name: 'Gradient Chip',
    icon: '📉',
    realmId: 3,
    rarity: 'common',
    type: 'consumable',
    effect: { xp: 200 },
    loreText:
      'Gradient descent finds minima by iteratively moving opposite the gradient direction. The loss landscape of a neural network in high-dimensional space has exponentially fewer local minima than saddle points — meaning networks mostly get stuck at saddle points, not local minima.',
    description: 'A crystallized gradient signal. Grants 200 XP.',
  },
  {
    id: 'dropout-mask',
    name: 'Dropout Mask',
    icon: '🎭',
    realmId: 3,
    rarity: 'common',
    type: 'artifact',
    loreText:
      'Dropout (Srivastava et al., 2014) randomly zeros activations during training with probability p, preventing co-adaptation of neurons. At test time, all neurons are used but outputs are scaled by (1−p). It\'s equivalent to training ~2^n different neural networks and averaging them.',
    description: 'A regularization mask worn by neurons to prevent overfitting.',
  },
  {
    id: 'activation-key',
    name: 'Activation Key',
    icon: '🔑',
    realmId: 3,
    rarity: 'rare',
    type: 'key',
    effect: { gems: 15 },
    loreText:
      'ReLU (max(0,x)) became the dominant activation function after Glorot et al. (2011) showed it mitigates the vanishing gradient problem. GELU — used in BERT and GPT — approximates ReLU * sigmoid and outperforms it on many NLP benchmarks by allowing small negative values.',
    description: 'Unlocks a sealed section of the Neural Nebula terminal. Grants 15 gems.',
  },
  {
    id: 'weight-matrix',
    name: 'Weight Matrix',
    icon: '⚖️',
    realmId: 3,
    rarity: 'common',
    type: 'lore',
    loreText:
      'A single layer of GPT-3 contains 768×768 = 589,824 weights in its attention projections, plus 4×768×768×4 = 9.4M parameters in its MLP. All 96 layers × 12 parameters matrices = ~175B total. These weights are randomly initialized — all knowledge is learned from data.',
    description: 'A frozen weight tensor from an ancient model.',
  },
  {
    id: 'attention-head',
    name: 'Attention Head',
    icon: '👁️',
    realmId: 3,
    rarity: 'rare',
    type: 'artifact',
    effect: { xp: 300 },
    loreText:
      'Self-attention computes Q, K, V projections then scores = softmax(QKᵀ/√d_k)V. The √d_k scaling prevents softmax from entering saturation regions in high dimensions. Multi-head attention runs h attention functions in parallel then concatenates — GPT-4 uses ~96 heads per layer.',
    description: 'A crystallized attention pattern. Grants 300 XP.',
  },
  {
    id: 'loss-crystal',
    name: 'Loss Crystal',
    icon: '💎',
    realmId: 3,
    rarity: 'rare',
    type: 'consumable',
    effect: { xp: 280, gems: 12 },
    loreText:
      'Cross-entropy loss for classification is −Σ yᵢ log(ŷᵢ). A perfect prediction yields 0. A random classifier on 1,000 classes yields −log(0.001) = 6.9 nats. GPT-3 achieves ~1.7 nats on WikiText-103 — meaning it\'s better than randomly selecting 1 of 5.5 tokens.',
    description: 'Crystallized training loss from a successful epoch. Grants 280 XP and 12 gems.',
  },
  {
    id: 'backprop-orb',
    name: 'Backprop Orb',
    icon: '🌀',
    realmId: 3,
    rarity: 'legendary',
    type: 'consumable',
    effect: { xp: 600, gems: 30 },
    loreText:
      'Backpropagation (Rumelhart et al., 1986) computes ∂L/∂w for all weights via the chain rule in O(n) time — the same cost as a forward pass. The key insight: store intermediate activations, then traverse the computation graph in reverse. Modern autodiff frameworks (PyTorch, JAX) do this automatically.',
    description: 'A legendary training artifact. Grants 600 XP and 30 gems.',
  },
  {
    id: 'training-epoch',
    name: 'Training Epoch',
    icon: '⏰',
    realmId: 3,
    rarity: 'common',
    type: 'lore',
    loreText:
      'Training GPT-3 consumed ~3.14×10²³ floating point operations over ~355 GPU-years on V100s. At $0.90/hr, this cost ~$4.6M. GPT-4\'s training cost was estimated at >$100M. In contrast, inference for a single token costs ~1×10⁻⁸ of training FLOPS.',
    description: 'A completed training run, captured in crystal.',
  },

  // ─── Realm 4: The Protein Cathedral ──────────────────────────────────────
  {
    id: 'alpha-helix-pin',
    name: 'Alpha Helix Pin',
    icon: '🌀',
    realmId: 4,
    rarity: 'common',
    type: 'artifact',
    loreText:
      'The alpha helix (Pauling, 1951) has 3.6 residues per turn with H-bonds between residue n and n+4. It is the most common secondary structure element, comprising ~32% of all residues in known protein structures. Collagen is a triple helix with only 3.3 residues/turn.',
    description: 'A perfectly formed alpha-helical pin from the Cathedral spires.',
  },
  {
    id: 'beta-sheet-card',
    name: 'Beta Sheet Card',
    icon: '📄',
    realmId: 4,
    rarity: 'common',
    type: 'lore',
    loreText:
      'Beta sheets can be parallel (strands run same direction, weaker H-bonds) or antiparallel (opposite direction, stronger H-bonds). Amyloid fibrils — implicated in Alzheimer\'s and Parkinson\'s — are cross-beta sheets where strands run perpendicular to the fibril axis, creating an almost indestructible scaffold.',
    description: 'A transept card from the Beta Sheet Bridge.',
  },
  {
    id: 'disulfide-bond',
    name: 'Disulfide Bond',
    icon: '🔗',
    realmId: 4,
    rarity: 'rare',
    type: 'artifact',
    effect: { xp: 250, gems: 10 },
    loreText:
      'Disulfide bonds form between cysteine residues in oxidizing environments (extracellular, ER lumen) and provide structural stability of ~60 kJ/mol. Human insulin has 3 disulfide bonds critical for its structure. Reducing agents like DTT cleave them — used to denature proteins in gel electrophoresis.',
    description: 'A covalent bond stronger than most non-covalent interactions. Grants 250 XP and 10 gems.',
  },
  {
    id: 'chaperone-token',
    name: 'Chaperone Token',
    icon: '🤝',
    realmId: 4,
    rarity: 'rare',
    type: 'consumable',
    effect: { hearts: 3, xp: 100 },
    loreText:
      'Molecular chaperones (Hsp70, Hsp90, GroEL/GroES) prevent misfolding by binding exposed hydrophobic regions. GroEL-GroES forms a barrel that encapsulates ~30% of newly synthesized E. coli proteins, giving them an isolated environment for up to 15 seconds to fold correctly.',
    description: 'Help from a molecular chaperone. Restores 3 hearts and grants 100 XP.',
  },
  {
    id: 'cofactor-gem',
    name: 'Cofactor Gem',
    icon: '💠',
    realmId: 4,
    rarity: 'rare',
    type: 'consumable',
    effect: { xp: 320, gems: 18 },
    loreText:
      'Cofactors extend enzyme function beyond the 20 amino acids. Heme (iron-containing) enables oxygen transport by hemoglobin and electron transfer in cytochromes. Vitamin B12 (cobalamin) is the only known biological molecule with a C-Co bond — synthesized only by microorganisms, yet essential for all animals.',
    description: 'An enzyme cofactor crystallized at the Cathedral altar. Grants 320 XP and 18 gems.',
  },
  {
    id: 'prion-shard',
    name: 'Prion Shard',
    icon: '☠️',
    realmId: 4,
    rarity: 'legendary',
    type: 'artifact',
    loreText:
      'Prions are misfolded proteins (PrPSc) that propagate by converting normal PrPC into their misfolded form — replication without nucleic acid. Stanley Prusiner won the 1997 Nobel Prize for this heretical idea. CJD, scrapie, and chronic wasting disease are all prion diseases. The misfolded form is protease-resistant and largely indestructible.',
    description: 'A legendary artifact recovered from AMYLOID TYRANT. Handle with extreme care.',
  },
  {
    id: 'folding-crystal',
    name: 'Folding Crystal',
    icon: '✨',
    realmId: 4,
    rarity: 'legendary',
    type: 'consumable',
    effect: { xp: 800, gems: 40 },
    loreText:
      'AlphaFold2 (2021) solved the 50-year-old protein folding problem with median TM-score >0.92. It uses 48 Evoformer blocks processing multiple sequence alignments and pair representations. The AlphaFold Database now contains >200 million predicted structures — covering essentially the entire known proteome.',
    description: 'A perfectly folded crystal embodying AlphaFold\'s knowledge. Grants 800 XP and 40 gems.',
  },
  {
    id: 'proteome-atlas',
    name: 'Proteome Atlas',
    icon: '📚',
    realmId: 4,
    rarity: 'legendary',
    type: 'lore',
    loreText:
      'The human proteome contains ~20,000 protein-coding genes that produce >1 million distinct protein forms through alternative splicing and post-translational modifications. Mass spectrometry can now identify and quantify thousands of proteins from a single cell. The Human Protein Atlas project has mapped expression of all proteins in 83 tissue types.',
    description: 'A legendary Codex entry unlocking the entire protein knowledge tree.',
  },
];

export function getItem(id: string): GameItem | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

export function getRealmItems(realmId: 1 | 2 | 3 | 4): GameItem[] {
  return ALL_ITEMS.filter((item) => item.realmId === realmId);
}

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#aaaaaa',
  rare: '#4488ff',
  legendary: '#ffaa00',
};
