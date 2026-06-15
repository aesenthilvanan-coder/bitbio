// ─── Mentor Teaching Sequences — pre-exercise dialogue & instruction ──────────

export interface TeachingSequence {
  nodeId: string;       // lesson node ID this teaching is for
  mentorId: 'elliot' | 'ben' | 'alex' | 'henry';
  topic: string;
  phases: TeachingPhase[];
}

export interface TeachingPhase {
  type: 'dialogue' | 'analogy' | 'demo-prompt';
  speaker?: string;
  lines?: string[];
  analogySetup?: string;
  analogyComparison?: string;
  analogyCaveat?: string;
  demoCode?: string;
  demoExpected?: string;
}

// ─── ELLIOT — Realm 1: The Cytoplasm ─────────────────────────────────────────

const ELLIOT_SEQUENCES: TeachingSequence[] = [
  {
    nodeId: 'l1-m1-n1',
    mentorId: 'elliot',
    topic: 'What Is a Cell?',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "Okay so.",
          "A cell is basically the smallest unit of life that can do everything.",
          "Eat. Reproduce. Make proteins. Respond to the environment.",
          "Be annoying.",
          "(Beat.)",
          "Wait — I said that last one out loud.",
          "The point is: a cell does everything a living thing needs to do.",
          "And it does it in a space too small to see without a microscope.",
          "Which is honestly wild if you think about it.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Elliot',
        analogySetup: "Think of the cell as a tiny factory.",
        analogyComparison:
          "The nucleus is the boss's office — it holds all the blueprints. The ribosomes are the assembly line — they build everything. The mitochondria are — everyone always says power plant. I say espresso machine. More accurate. The cell membrane is the security desk — controls what comes in and goes out.",
        analogyCaveat:
          "But unlike a factory, the cell makes its own workers AND its own blueprints AND its own building materials. Which is honestly unfair to factories.",
      },
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "One more thing.",
          "There are two types of cells: prokaryotic and eukaryotic.",
          "Prokaryotic: bacteria, no nucleus, simple.",
          "Eukaryotic: plants, animals, fungi, us — nucleus present, organelles everywhere, much more complicated.",
          "We're in a eukaryotic cell right now.",
          "In case the membrane-bound organelles didn't tip you off.",
        ],
      },
    ],
  },
  {
    nodeId: 'l1-m1-n2',
    mentorId: 'elliot',
    topic: 'DNA and RNA',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "DNA is not a blueprint.",
          "I will say this until I lose my voice.",
          "A blueprint describes a finished product.",
          "DNA describes a PROCESS — a recipe for making proteins.",
          "It's more like a flow chart than a blueprint.",
          "Actually it's most like code.",
          "Which is why you're in a video game about this.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Elliot',
        analogySetup: "DNA is the master recipe book. RNA is the photocopy you send to the kitchen.",
        analogyComparison:
          "You don't cook from your grandmother's original recipe card — you copy it out, keep the original safe, and work from the copy. DNA stays in the nucleus. RNA carries the instructions out.",
        analogyCaveat:
          "Also the RNA gets edited on the way out. Introns spliced out. Sometimes alternative spliced. One gene can produce multiple proteins. Grandma's recipe book is more complicated than she let on.",
      },
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "The central dogma:",
          "DNA → RNA → Protein.",
          "Transcription: DNA is read, mRNA is made.",
          "Translation: mRNA is read by ribosomes, protein is assembled.",
          "This happens millions of times per second in a healthy cell.",
          "In THIS cell it's a bit slower because LYSO ate two of the ribosomes.",
          "But conceptually: millions of times per second.",
        ],
      },
    ],
  },
  {
    nodeId: 'l1-m1-n3',
    mentorId: 'elliot',
    topic: 'Proteins and Ribosomes',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "Ribosomes are... okay they're incredible.",
          "They take a string of RNA — a sequence of codons — and turn it into a three-dimensional protein.",
          "In milliseconds.",
          "With no moving parts.",
          "Well, they move. But there's no—",
          "You know what, just.",
          "They're incredible.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Elliot',
        analogySetup: "A codon is a three-letter code. There are 4 possible bases: A, U, G, C.",
        analogyComparison:
          "4 bases, 3 at a time = 64 possible codons. Only 20 amino acids. So multiple codons code for the same amino acid — that's degeneracy. The genetic code is redundant on purpose. One mutation, might not change the protein at all.",
        analogyCaveat:
          "Some codons are STOP codons. They tell the ribosome: done. Put it down. Let it fold. There are 3 stop codons: UAA, UAG, UGA. The ribosome obeys these instantly. No questions asked.",
      },
      {
        type: 'demo-prompt',
        speaker: 'Elliot',
        lines: [
          "Here's how you'd translate a codon to an amino acid in Python.",
          "The genetic code as a dictionary.",
        ],
        demoCode: `codon_table = {
    'AUG': 'Methionine',  # also the start codon
    'UUU': 'Phenylalanine',
    'UUA': 'Leucine',
    'UAA': 'STOP',
    'UAG': 'STOP',
    'UGA': 'STOP',
}

def translate_codon(codon: str) -> str:
    return codon_table.get(codon.upper(), 'Unknown codon')

print(translate_codon('AUG'))   # Methionine
print(translate_codon('UAA'))   # STOP`,
        demoExpected: 'Methionine\nSTOP',
      },
    ],
  },
  {
    nodeId: 'l1-m2-n1',
    mentorId: 'elliot',
    topic: 'The Cell Membrane',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "The membrane is a phospholipid bilayer.",
          "Two layers of phospholipids, arranged tail-to-tail.",
          "Hydrophilic heads face outward — toward the water.",
          "Hydrophobic tails face inward — away from the water.",
          "It's self-assembling.",
          "The membrane just... knows.",
          "Nobody told it.",
          "Life is wild.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Elliot',
        analogySetup: "Think of it like a crowd at a beach.",
        analogyComparison:
          "Everyone wants to be near the water but nobody wants wet feet. They naturally arrange themselves at the water's edge — close enough to be near it, not close enough to get wet. Phospholipids do the same thing with water.",
        analogyCaveat:
          "The membrane is also not solid — it's a fluid mosaic. Proteins float in it. Lipids move around. Cholesterol keeps it from being too fluid or too rigid. It is dynamic and responsive and honestly more sophisticated than most infrastructure I've worked with.",
      },
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "Transport across the membrane:",
          "Passive transport: things move down their concentration gradient. No energy needed.",
          "Active transport: things move against their concentration gradient. ATP required.",
          "The sodium-potassium pump: moves 3 Na+ out, 2 K+ in, per ATP. Very important for neurons.",
          "Also: this is why drinking only water and no electrolytes can kill you.",
          "The membrane is maintaining gradients that your brain depends on.",
          "Eat some salt.",
        ],
      },
    ],
  },
  {
    nodeId: 'l1-m2-n2',
    mentorId: 'elliot',
    topic: 'ATP and Energy',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Elliot',
        lines: [
          "Every living thing runs on ATP.",
          "EVERY. THING.",
          "You. Me. This ribosome. That lysosome that's been eating my lab equipment.",
          "Even plants — they make ATP during photosynthesis and then use it.",
          "ATP is the universal energy currency of life.",
          "If evolution had a consistent decision, it was this one.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Elliot',
        analogySetup: "ATP is like a charged battery.",
        analogyComparison:
          "ATP has three phosphate groups. When the terminal phosphate is removed (hydrolysis), energy is released. What remains is ADP — adenosine diphosphate. The discharged battery. The mitochondria recharge it back to ATP using cellular respiration.",
        analogyCaveat:
          "One glucose molecule yields approximately 32 ATP via cellular respiration. That number used to be 36. Scientists updated it in the early 2000s based on better understanding of mitochondrial efficiency. I mourned the 4. I still mourn the 4.",
      },
      {
        type: 'demo-prompt',
        speaker: 'Elliot',
        lines: [
          "Cellular respiration in three stages.",
          "Glycolysis → Krebs Cycle → Electron Transport Chain.",
        ],
        demoCode: `def atp_yield(stage: str) -> int:
    yields = {
        'glycolysis': 2,          # net ATP
        'krebs_cycle': 2,         # ATP directly
        'electron_transport': 28, # from NADH/FADH2
    }
    return yields.get(stage, 0)

stages = ['glycolysis', 'krebs_cycle', 'electron_transport']
total = sum(atp_yield(s) for s in stages)
print(f"Total ATP per glucose: {total}")`,
        demoExpected: 'Total ATP per glucose: 32',
      },
    ],
  },
];

// ─── BEN — Realm 2: The Genome Forest ────────────────────────────────────────

const BEN_SEQUENCES: TeachingSequence[] = [
  {
    nodeId: 'l2-m1-n1',
    mentorId: 'ben',
    topic: 'What Is a Genome?',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Ben',
        lines: [
          "A genome is all the DNA in an organism.",
          "In humans: about 3 billion base pairs. Haploid.",
          "6 billion if you count both copies of each chromosome.",
          "About 20,000 protein-coding genes.",
          "That's 2% of the genome.",
          "The other 98% was called 'junk DNA' until 2012.",
          "ENCODE project showed it's not junk.",
          "It's regulatory. Structural. Important.",
          "(He turns a page.)",
          "Nobody apologized for calling it junk.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Ben',
        analogySetup: "It's less like a book and more like an operating system.",
        analogyComparison:
          "Most of an OS is infrastructure — kernel, drivers, system libraries — not the apps you actually use. The protein-coding genes are the apps. The regulatory regions are the OS. The repetitive elements are the legacy code nobody wants to touch.",
        analogyCaveat:
          "Unlike an OS, the genome is running in every cell simultaneously, with slightly different programs executing depending on cell type. A neuron and a liver cell have identical genomes. They do not behave identically. Epigenetics is why. We'll get there.",
      },
      {
        type: 'dialogue',
        speaker: 'Ben',
        lines: [
          "Chromosome structure: DNA wrapped around histones, forming nucleosomes.",
          "Nucleosomes condense into chromatin.",
          "Chromatin condenses into chromosomes during cell division.",
          "Humans have 23 pairs. 46 total.",
          "The Y chromosome is the smallest.",
          "It's been losing genes for 300 million years.",
          "It now has about 55.",
          "The X has over 800.",
          "This is relevant in ways I won't get into right now.",
        ],
      },
    ],
  },
  {
    nodeId: 'l2-m2-n1',
    mentorId: 'ben',
    topic: 'BLAST',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Ben',
        lines: [
          "Basic Local Alignment Search Tool.",
          "You give it a sequence. It finds similar sequences in a database.",
          "Databases: GenBank, RefSeq, UniProt, nr.",
          "Billions of sequences. BLAST searches them in seconds.",
          "E-value: the probability of finding a match this good by chance.",
          "E-value of 1e-50: not chance.",
          "E-value of 0.5: maybe chance.",
          "E-value of 10: almost certainly chance.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Ben',
        analogySetup: "BLAST uses a heuristic — it doesn't check every possible alignment.",
        analogyComparison:
          "It looks for short exact matches first (words), then extends them. This is why it's fast instead of taking years. Smith-Waterman is the exact algorithm. It's slower. Both exist. Use BLAST for discovery, Smith-Waterman when you need to be sure.",
        analogyCaveat:
          "BLAST can miss things. Very divergent sequences might not share enough exact words. For distant homologs: PSI-BLAST, HHpred, protein structure comparison. More tools. Ben knows all of them. He's 16.",
      },
      {
        type: 'demo-prompt',
        speaker: 'Ben',
        lines: [
          "What would you BLAST, and why.",
          "Think about the question format before submitting.",
        ],
        demoCode: `# BLAST query design
query_sequence = "ATCGGCAATATCGGCAAT"  # your unknown sequence
database = "nt"                          # nucleotide collection
program = "blastn"                       # nucleotide vs nucleotide

# Key parameters
word_size = 11       # minimum exact match to extend from
e_value_threshold = 1e-5   # only keep statistically significant hits

# Interpreting results:
# - High identity + low E-value = likely homolog
# - High identity + high E-value = repetitive sequence, maybe
# - Low identity + low E-value = distant homolog worth investigating`,
        demoExpected: '# No output — this is a design problem. Think through the parameters.',
      },
    ],
  },
  {
    nodeId: 'l2-m3-n1',
    mentorId: 'ben',
    topic: 'RNA-seq',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Ben',
        lines: [
          "You sequence all the RNA in a sample.",
          "That tells you what genes are active — not just what genes exist.",
          "The genome is static. The transcriptome changes.",
          "Expression equals function.",
          "If a gene isn't expressed in a cell, it doesn't matter what it codes for.",
          "RNA-seq captures the transcriptome at a single moment in time.",
        ],
      },
      {
        type: 'dialogue',
        speaker: 'Ben',
        lines: [
          "Normalize your reads. Always.",
          "Raw read counts are not comparable across samples.",
          "Different samples have different library sizes.",
          "Normalization methods: RPKM, FPKM, TPM.",
          "Use TPM. It's better.",
          "(He pauses.)",
          "I've seen papers fail on this.",
          "Published papers.",
          "In journals.",
          "Normalize your reads.",
        ],
      },
      {
        type: 'demo-prompt',
        speaker: 'Ben',
        lines: [
          "TPM normalization in Python.",
          "Transcripts per million.",
        ],
        demoCode: `import pandas as pd

# Read counts and gene lengths (in kb)
data = {
    'gene': ['BRCA1', 'TP53', 'MYC', 'ACTB'],
    'counts': [150, 3200, 45, 12000],
    'length_kb': [81.2, 19.1, 5.9, 1.8],
}
df = pd.DataFrame(data)

# Step 1: Reads per kilobase (RPK)
df['rpk'] = df['counts'] / df['length_kb']

# Step 2: Per million scaling factor
scaling_factor = df['rpk'].sum() / 1e6

# Step 3: TPM
df['tpm'] = df['rpk'] / scaling_factor

print(df[['gene', 'tpm']].round(2))`,
        demoExpected: '   gene      tpm\n0  BRCA1    16.26\n1   TP53  1479.04\n2    MYC    67.31\n3   ACTB  58570.27',
      },
    ],
  },
  {
    nodeId: 'l2-m4-n1',
    mentorId: 'ben',
    topic: 'Variant Calling',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Ben',
        lines: [
          "A variant is a difference from the reference genome.",
          "SNP: single nucleotide polymorphism. One base change.",
          "Indel: insertion or deletion. Changes the reading frame if it's not a multiple of 3.",
          "Structural variant: large rearrangement — inversions, translocations, copy number changes.",
          "Not all variants do anything.",
          "Most don't.",
          "Finding the ones that do is the hard part.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Ben',
        analogySetup: "Think of the reference genome as the expected version of an OS.",
        analogyComparison:
          "A variant is like a diff — a change from the reference. Most diffs don't break anything. Some add features. Some break critical functions. Identifying which is which requires: functional annotation, population frequency data, computational prediction, and ideally experimental validation.",
        analogyCaveat:
          "Variant interpretation is genuinely hard. The ACMG has a classification system: pathogenic, likely pathogenic, uncertain significance, likely benign, benign. 'Uncertain significance' is the honest answer for a lot of variants. This does not satisfy clinicians. This is why computational variant scientists exist.",
      },
      {
        type: 'demo-prompt',
        speaker: 'Ben',
        lines: [
          "Filtering variants by quality in Python.",
          "Using pandas on a simplified VCF.",
        ],
        demoCode: `import pandas as pd

# Simplified VCF data
vcf_data = {
    'CHROM': ['chr1', 'chr1', 'chr2', 'chrX'],
    'POS':   [100234, 200100, 50022, 987654],
    'REF':   ['A',    'G',    'CTA', 'T'],
    'ALT':   ['T',    'C',    'C',   'A'],
    'QUAL':  [50.0,   12.3,   99.0,  45.0],
    'DP':    [30,     5,      120,   22],
}
df = pd.DataFrame(vcf_data)

# Filter: quality >= 30, depth >= 10
high_quality = df[(df['QUAL'] >= 30) & (df['DP'] >= 10)]
print(f"Variants passing filter: {len(high_quality)} of {len(df)}")`,
        demoExpected: 'Variants passing filter: 3 of 4',
      },
    ],
  },
  {
    nodeId: 'l2-m5-n1',
    mentorId: 'ben',
    topic: 'pandas for Genomics',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Ben',
        lines: [
          "pandas is how you actually analyze biological data in Python.",
          "Read a VCF into a DataFrame.",
          "Filter by quality.",
          "Group by chromosome.",
          "Plot.",
          "Most of bioinformatics is data manipulation.",
          "People think it's all algorithms.",
          "It's mostly DataFrames.",
        ],
      },
      {
        type: 'demo-prompt',
        speaker: 'Ben',
        lines: [
          "Common genomics operations in pandas.",
          "Ben does all of these without looking at documentation.",
        ],
        demoCode: `import pandas as pd

# Load annotation file
df = pd.read_csv('genes.tsv', sep='\\t')

# Filter to protein-coding genes on chr1
coding_chr1 = df[
    (df['gene_type'] == 'protein_coding') &
    (df['chromosome'] == 'chr1')
]

# Count genes per chromosome
genes_per_chrom = df.groupby('chromosome')['gene_id'].count()

# Calculate gene lengths
df['length'] = df['end'] - df['start']
median_length = df['length'].median()

print(f"Protein-coding on chr1: {len(coding_chr1)}")
print(f"Median gene length: {median_length:.0f} bp")`,
        demoExpected: '# Output depends on your annotation file\n# The operations are what matter here',
      },
    ],
  },
];

// ─── ALEX — Realm 3: The Neural Nebula ───────────────────────────────────────

const ALEX_SEQUENCES: TeachingSequence[] = [
  {
    nodeId: 'l3-m1-n1',
    mentorId: 'alex',
    topic: 'What Is Machine Learning?',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "Machine learning is teaching a computer to find patterns in data without explicitly programming the rules.",
          "The key word is 'find.'",
          "The model does not understand.",
          "It fits curves.",
          "This distinction matters more than people think.",
          "(She doesn't look up.)",
          "A lot of AI ethics problems come from forgetting this distinction.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Alex',
        analogySetup: "Here is what ML is not:",
        analogyComparison:
          "It is not a brain. It is not thinking. It is not understanding. It is a mathematical function that maps inputs to outputs, where the function's parameters were adjusted to minimize error on a training dataset. That's it. The function can be extraordinarily complex. It is still a function.",
        analogyCaveat:
          "Here is what goes wrong first: people assume the model understands. It doesn't. It finds correlations. A model trained on chest X-rays learned to predict pneumonia by detecting hospital rulers in the image — rulers only appear in severe cases. The model was accurate. The model was wrong.",
      },
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "Types of ML:",
          "Supervised learning: you have labeled data. You learn a mapping.",
          "Unsupervised learning: no labels. You find structure.",
          "Reinforcement learning: an agent takes actions, receives rewards, learns a policy.",
          "We'll mostly do supervised here.",
          "It's where most applied ML happens.",
          "Also it's what OVERFIT was doing before it broke.",
        ],
      },
    ],
  },
  {
    nodeId: 'l3-m1-n2',
    mentorId: 'alex',
    topic: 'Loss Functions',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "A loss function measures how wrong your model is.",
          "Lower is better.",
          "During training, the model adjusts its parameters to minimize loss.",
          "If loss goes to zero: check if you're overfitting.",
          "If loss goes to NaN: something is catastrophically wrong.",
          "Panic calmly.",
          "Then reduce your learning rate.",
        ],
      },
      {
        type: 'demo-prompt',
        speaker: 'Alex',
        lines: [
          "Mean squared error — the most common regression loss.",
          "Also the most honest.",
        ],
        demoCode: `import numpy as np

def mean_squared_error(y_true, y_pred):
    """MSE: average squared difference between predictions and targets."""
    differences = y_pred - y_true
    squared = differences ** 2
    return np.mean(squared)

# Perfect prediction
y_true = np.array([1.0, 2.0, 3.0, 4.0])
y_perfect = np.array([1.0, 2.0, 3.0, 4.0])
y_off = np.array([1.5, 2.5, 2.5, 5.0])

print(f"Perfect: {mean_squared_error(y_true, y_perfect):.4f}")
print(f"Off by ~0.5: {mean_squared_error(y_true, y_off):.4f}")`,
        demoExpected: 'Perfect: 0.0000\nOff by ~0.5: 0.4375',
      },
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "Cross-entropy loss for classification.",
          "Compares predicted probability distributions to true labels.",
          "Punishes confident wrong predictions very hard.",
          "OVERFIT had cross-entropy loss of 0.0001 on training data.",
          "On test data: 4.7.",
          "That gap is the whole problem.",
        ],
      },
    ],
  },
  {
    nodeId: 'l3-m2-n1',
    mentorId: 'alex',
    topic: 'Gradient Descent',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "The model has parameters — weights and biases.",
          "Parameters determine predictions.",
          "Loss depends on predictions.",
          "We want to reduce loss.",
          "How do we know which direction to move the parameters?",
          "Compute the gradient of the loss with respect to each parameter.",
          "The gradient points uphill.",
          "Move downhill.",
          "Repeat.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Alex',
        analogySetup: "Gradient descent is like hiking downhill blindfolded.",
        analogyComparison:
          "You can't see the landscape. You can only feel the slope under your feet. You step in the direction that goes down. You keep going until you can't go down anymore. That's a local minimum. It might be the bottom of the whole mountain. It might be a valley halfway up.",
        analogyCaveat:
          "The learning rate is your step size. Too large: you overshoot the valley. Too small: it takes forever, and you might get stuck. This is why choosing a learning rate is an art form. And also why learning rate schedulers exist. Use a scheduler.",
      },
      {
        type: 'demo-prompt',
        speaker: 'Alex',
        lines: [
          "Gradient descent on a simple function.",
          "Find the minimum of f(x) = (x - 3)^2.",
        ],
        demoCode: `def gradient_descent(start_x: float, lr: float, steps: int) -> float:
    """Minimize f(x) = (x - 3)^2 using gradient descent."""
    x = start_x
    for i in range(steps):
        # Gradient of (x-3)^2 is 2*(x-3)
        gradient = 2 * (x - 3)
        x = x - lr * gradient
        if i % 20 == 0:
            loss = (x - 3) ** 2
            print(f"Step {i:3d}: x={x:.4f}, loss={loss:.6f}")
    return x

final_x = gradient_descent(start_x=10.0, lr=0.1, steps=60)
print(f"\\nMinimum found at x = {final_x:.4f} (true minimum: 3.0)")`,
        demoExpected: 'Step   0: x=8.6000, loss=31.360000\nStep  20: x=3.0832, loss=0.006924\nStep  40: x=3.0010, loss=0.000001\n\nMinimum found at x = 3.0001 (true minimum: 3.0)',
      },
    ],
  },
  {
    nodeId: 'l3-m3-n1',
    mentorId: 'alex',
    topic: 'Overfitting',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "Your model memorized the training data instead of learning from it.",
          "It performs perfectly on training.",
          "It fails on everything else.",
          "This is the most common mistake in machine learning.",
          "It is also the most preventable.",
          "And yet.",
        ],
      },
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "Signs of overfitting:",
          "Training loss: very low.",
          "Validation loss: high, or increasing while training loss decreases.",
          "That gap between them — that's overfitting.",
          "The model is fitting the noise, not the signal.",
          "It learned things that are only true in your training set.",
          "Not in the world.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Alex',
        analogySetup: "Overfitting is like studying by memorizing past exams.",
        analogyComparison:
          "You can reproduce any question from previous years perfectly. On a new exam with new questions, you fail. You didn't learn the material — you learned the specific questions. The model does the same thing. It learned the training examples, not the underlying concept.",
        analogyCaveat:
          "Prevention: more data, dropout, regularization (L1/L2), data augmentation, early stopping, cross-validation. OVERFIT had none of these. OVERFIT also had a learning rate of 0.1 with no decay, a batch size of 1, and 500 epochs on a dataset of 100 samples. It was not set up for success.",
      },
    ],
  },
  {
    nodeId: 'l3-m4-n1',
    mentorId: 'alex',
    topic: 'Transformers and Attention',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Alex',
        lines: [
          "The attention mechanism asks:",
          "For each position in the sequence, which other positions should I pay attention to?",
          "It computes this for all pairs simultaneously.",
          "That's why it works.",
          "That's also why it's O(N²) in sequence length.",
          "For a sequence of 1,000 tokens: a million attention computations.",
          "For 10,000: a hundred million.",
          "This is a known issue. We are working on it.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Alex',
        analogySetup: "Attention vs. RNNs.",
        analogyComparison:
          "An RNN reads a sequence left to right, maintaining a hidden state. By the time it reaches position 500, information from position 1 is very faint — the hidden state is a bottleneck. Attention skips this. Every position can directly attend to every other position. No bottleneck.",
        analogyCaveat:
          "Transformers don't have a built-in notion of order — they need positional encoding added to the input. This is because attention is permutation-invariant. 'The cat sat on the mat' and 'the mat sat on the cat' produce identical attention patterns without positional encoding. The encoding fixes this. It's an add.",
      },
      {
        type: 'demo-prompt',
        speaker: 'Alex',
        lines: [
          "Scaled dot-product attention — the core operation.",
          "Q, K, V: Queries, Keys, Values.",
        ],
        demoCode: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    """
    Q: query matrix  [seq_len, d_k]
    K: key matrix    [seq_len, d_k]
    V: value matrix  [seq_len, d_v]
    """
    d_k = Q.shape[-1]
    # Compute attention scores
    scores = Q @ K.T / np.sqrt(d_k)
    # Softmax to get attention weights
    exp_scores = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights = exp_scores / exp_scores.sum(axis=-1, keepdims=True)
    # Weighted sum of values
    output = weights @ V
    return output, weights

# Example: 3 tokens, d_k=4, d_v=4
np.random.seed(42)
Q = np.random.randn(3, 4)
K = np.random.randn(3, 4)
V = np.random.randn(3, 4)

output, weights = scaled_dot_product_attention(Q, K, V)
print("Attention weights (rows sum to 1):")
print(weights.round(3))`,
        demoExpected: 'Attention weights (rows sum to 1):\n[[0.406 0.334 0.26 ]\n [0.299 0.39  0.311]\n [0.27  0.424 0.306]]',
      },
    ],
  },
];

// ─── HENRY — Realm 4: The Protein Cathedral ──────────────────────────────────

const HENRY_SEQUENCES: TeachingSequence[] = [
  {
    nodeId: 'l4-m1-n1',
    mentorId: 'henry',
    topic: 'Protein Structure',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "In 1972, Christian Anfinsen showed that protein sequence determines structure.",
          "That the information required to fold a protein is contained entirely within its amino acid sequence.",
          "He won the Nobel Prize for this.",
          "It took another fifty years to figure out how to compute it.",
          "(He pauses.)",
          "The problem was not the concept.",
          "The problem was the search space.",
          "For a protein of 100 amino acids: 3^100 possible conformations.",
          "More than atoms in the observable universe.",
          "Yet proteins fold in milliseconds.",
          "This is called Levinthal's Paradox.",
          "It isn't a paradox once you understand how folding actually works.",
          "But it took a long time to understand.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Henry',
        analogySetup: "Protein structure has four levels of organization.",
        analogyComparison:
          "Primary: the amino acid sequence. Secondary: local structures — alpha helices and beta sheets, formed by hydrogen bonds. Tertiary: the overall 3D shape, formed by interactions between secondary elements. Quaternary: multiple polypeptide chains together, as in hemoglobin.",
        analogyCaveat:
          "Each level emerges from the one below. The sequence determines the secondary structures. The secondary structures determine the tertiary fold. The tertiary fold determines the function. This is why one mutation — one amino acid change — can completely abolish function. Or create a new one.",
      },
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "Alpha helices: the polypeptide backbone coils.",
          "Hydrogen bonds between C=O of residue i and N-H of residue i+4.",
          "3.6 residues per turn. Right-handed.",
          "Beta sheets: extended strands, hydrogen-bonded side by side.",
          "Parallel or antiparallel, depending on strand direction.",
          "Antiparallel is more stable.",
          "(He indicates the cathedral walls.)",
          "Everything you see here is one of those two elements, or the loops connecting them.",
          "All protein structure, ultimately, is helices and sheets.",
          "And the space between them.",
        ],
      },
    ],
  },
  {
    nodeId: 'l4-m2-n1',
    mentorId: 'henry',
    topic: 'AlphaFold',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "AlphaFold solved protein structure prediction in 2020.",
          "DeepMind. Jumper et al.",
          "For fifty years, this was considered one of the hardest problems in structural biology.",
          "Solved by a neural network in a year.",
          "I have — complicated feelings about this.",
          "(A long pause.)",
          "No. They are not complicated.",
          "It was a gift to science.",
          "To medicine.",
          "To everyone who couldn't crystallize their protein.",
          "I simply grew up in a time when this was considered unsolvable.",
          "It is different, to watch something become solved.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Henry',
        analogySetup: "AlphaFold uses multiple sequence alignment and attention-based architecture.",
        analogyComparison:
          "It learns from evolutionary co-variation — amino acids that change together across species are likely in contact in the 3D structure. If position 47 always mutates with position 112, they're probably touching. AlphaFold learned this from millions of protein sequences and known structures.",
        analogyCaveat:
          "AlphaFold is not perfect. Intrinsically disordered regions remain difficult. Complexes with other proteins, DNA, ligands — still challenging. AlphaFold-Multimer helps with complexes. The field is moving quickly. When I arrived here, the tools were different. I have watched them change.",
      },
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "pLDDT: predicted local distance difference test.",
          "AlphaFold's confidence score per residue.",
          "Above 90: very high confidence. Dark blue.",
          "70-90: confident. Light blue.",
          "50-70: low confidence. Yellow.",
          "Below 50: disordered. Orange.",
          "When you see orange: this region moves. It's flexible. That might be the point.",
          "(He looks at the map for a moment.)",
          "The regions I trust most are the ones that admit uncertainty.",
          "(He does not elaborate on this.)",
        ],
      },
    ],
  },
  {
    nodeId: 'l4-m3-n1',
    mentorId: 'henry',
    topic: 'Drug Discovery',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "Most drugs work by binding to proteins.",
          "They change the protein's shape.",
          "Or they block its active site.",
          "Or they stabilize it in one conformation over another.",
          "The protein's shape is therefore the target.",
          "To design drugs, you need to know the shape.",
          "(He gestures at the cathedral.)",
          "This is why we are here.",
        ],
      },
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "Before AlphaFold: to design a drug for a protein, you needed its crystal structure.",
          "Growing crystals: months to years, if successful.",
          "Some proteins never crystallize.",
          "Those proteins had no drug targets.",
          "Membrane proteins especially — the ones in the cell membrane. Critical. Hard to crystallize.",
          "AlphaFold predicts them.",
          "We can now design drugs for proteins we have never seen in a crystal.",
          "This changes everything about early drug discovery.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Henry',
        analogySetup: "Drug-protein binding: a lock and key.",
        analogyComparison:
          "The protein's active site is the lock. The drug is the key. Shape complementarity. Charge complementarity. Hydrophobic patches matching. The better the fit, the higher the affinity. Affinity determines dosage. Dosage determines side effects.",
        analogyCaveat:
          "The lock-and-key model is a simplification. In reality both protein and drug are flexible — induced fit. The protein changes shape slightly when the drug binds. Conformational selection: the drug selects a specific conformation from an ensemble. Reality is more dynamic than the model suggests. It usually is.",
      },
    ],
  },
  {
    nodeId: 'l4-m4-n1',
    mentorId: 'henry',
    topic: 'Protein-Protein Interactions',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "Proteins rarely work alone.",
          "They form complexes.",
          "They participate in pathways.",
          "They are part of networks.",
          "The interactome: all protein-protein interactions in an organism.",
          "In humans: estimated 650,000 interactions.",
          "We've experimentally confirmed about 30,000.",
          "We're working on the rest.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Henry',
        analogySetup: "A protein-protein interaction network is like a city.",
        analogyComparison:
          "Hub proteins are intersections — many roads meet. Disrupting a hub disrupts many pathways simultaneously. This is why hub proteins are often essential genes — removing them is lethal. It's also why they're attractive drug targets — and also dangerous drug targets.",
        analogyCaveat:
          "A drug that blocks one interaction can cascade through an entire network. Intended effect on pathway A. Side effects in pathways B, C, F, J. This is why side effects exist. This is also why drug development takes a long time and most candidates fail. The network is not a simple system.",
      },
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "Interface regions — where proteins touch — have specific properties.",
          "They tend to be hydrophobic.",
          "They tend to be flat.",
          "They are sometimes disordered before binding and ordered after.",
          "Targeting interfaces with drugs is called PPI drug discovery.",
          "It was considered impossible until about 2010.",
          "It is now merely very difficult.",
          "(He finds this encouraging.)",
        ],
      },
    ],
  },
  {
    nodeId: 'l4-m5-n1',
    mentorId: 'henry',
    topic: 'Structural Biology History',
    phases: [
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "The first protein structure was determined in 1958.",
          "Myoglobin.",
          "John Kendrew and Max Perutz.",
          "X-ray crystallography.",
          "Twenty years of work.",
          "The structure showed, for the first time, what a protein actually looked like in three dimensions.",
          "(He pauses.)",
          "They did it without a computer.",
          "They built physical models.",
          "Cardboard and wire.",
          "That matters to me.",
        ],
      },
      {
        type: 'dialogue',
        speaker: 'Henry',
        lines: [
          "The methods since then:",
          "X-ray crystallography: the standard for decades. Requires a crystal.",
          "NMR spectroscopy: works in solution. Limited to smaller proteins.",
          "Cryo-electron microscopy: proteins in vitreous ice. Near-atomic resolution without crystallization.",
          "Cryo-EM changed everything in the 2010s.",
          "AlphaFold changed everything in 2020.",
          "In my time in science, I have watched this field change more than any other.",
          "(He goes quiet for a moment.)",
          "In my time.",
        ],
      },
      {
        type: 'analogy',
        speaker: 'Henry',
        analogySetup: "Structural biology is the translation layer between sequence and function.",
        analogyComparison:
          "The genome gives you sequence. Structural biology tells you what the sequence does — because structure determines function. Without structure, you have a string of letters. With structure, you have a mechanism.",
        analogyCaveat:
          "We now determine thousands of structures per week. The PDB holds over 200,000 structures. And yet each one still tells a story. A specific fold, evolved over millions of years, to do a specific thing. I have looked at thousands of structures in here. Each one is still interesting.",
      },
    ],
  },
];

// ─── TEACHING_SEQUENCES Export ────────────────────────────────────────────────

export const TEACHING_SEQUENCES: TeachingSequence[] = [
  ...ELLIOT_SEQUENCES,
  ...BEN_SEQUENCES,
  ...ALEX_SEQUENCES,
  ...HENRY_SEQUENCES,
];

export function getTeachingSequence(nodeId: string): TeachingSequence | undefined {
  return TEACHING_SEQUENCES.find((s) => s.nodeId === nodeId);
}

export function getTeachingSequencesByMentor(
  mentorId: 'elliot' | 'ben' | 'alex' | 'henry'
): TeachingSequence[] {
  return TEACHING_SEQUENCES.filter((s) => s.mentorId === mentorId);
}
