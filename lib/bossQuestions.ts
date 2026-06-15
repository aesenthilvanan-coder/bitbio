export interface BossQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const BOSS_QUESTIONS: Record<1 | 2 | 3 | 4, BossQuestion[]> = {
  1: [
    {
      question: "What is the primary function of the lysosome?",
      options: [
        "Producing ATP through cellular respiration",
        "Digesting cellular waste and foreign materials",
        "Synthesizing proteins from mRNA",
        "Transporting materials out of the cell",
      ],
      correctIndex: 1,
      explanation:
        "Lysosomes contain hydrolytic enzymes that break down cellular waste, damaged organelles, and foreign materials at an acidic pH.",
    },
    {
      question: "Which organelle is known as the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
      correctIndex: 2,
      explanation:
        "Mitochondria produce ATP via oxidative phosphorylation and the electron transport chain — hence 'powerhouse of the cell'.",
    },
    {
      question: "What is the fluid-mosaic model describing?",
      options: [
        "The structure of the cell wall",
        "The arrangement of DNA in the nucleus",
        "The structure of the plasma membrane",
        "The organisation of the cytoskeleton",
      ],
      correctIndex: 2,
      explanation:
        "The fluid-mosaic model describes the plasma membrane as a fluid phospholipid bilayer with embedded proteins that can move laterally.",
    },
    {
      question: "Where does translation (protein synthesis) occur in the cell?",
      options: [
        "In the nucleus on chromatin",
        "On ribosomes in the cytoplasm or rough ER",
        "In the mitochondria only",
        "In the Golgi apparatus",
      ],
      correctIndex: 1,
      explanation:
        "Translation occurs on ribosomes — either free in the cytoplasm or attached to the rough endoplasmic reticulum.",
    },
    {
      question: "What process allows water to move across a semi-permeable membrane?",
      options: ["Active transport", "Facilitated diffusion", "Osmosis", "Endocytosis"],
      correctIndex: 2,
      explanation:
        "Osmosis is the passive movement of water molecules across a semi-permeable membrane from a region of high water potential to low water potential.",
    },
    {
      question: "Which cell structure is responsible for modifying and packaging proteins for export?",
      options: [
        "Smooth endoplasmic reticulum",
        "Rough endoplasmic reticulum",
        "Golgi apparatus",
        "Lysosome",
      ],
      correctIndex: 2,
      explanation:
        "The Golgi apparatus receives proteins from the ER, modifies them (e.g., glycosylation), sorts them, and packages them into vesicles for secretion or delivery.",
    },
    {
      question: "What is the role of the nucleus in the cell?",
      options: [
        "Energy production via ATP synthesis",
        "Digestion of foreign particles",
        "Housing genetic material and controlling gene expression",
        "Lipid synthesis and detoxification",
      ],
      correctIndex: 2,
      explanation:
        "The nucleus contains the cell's DNA and controls gene expression, coordinating cellular activities via mRNA transcription.",
    },
    {
      question: "During which phase of the cell cycle does DNA replication occur?",
      options: [
        "G1 phase",
        "S phase",
        "G2 phase",
        "M phase",
      ],
      correctIndex: 1,
      explanation:
        "DNA replication occurs during the S (synthesis) phase of interphase, duplicating the genome before cell division.",
    },
    {
      question: "What is the main function of the smooth endoplasmic reticulum?",
      options: [
        "Protein synthesis",
        "Lipid synthesis and detoxification",
        "Packaging proteins for export",
        "Breaking down cellular waste",
      ],
      correctIndex: 1,
      explanation:
        "The smooth ER lacks ribosomes and is involved in lipid synthesis, carbohydrate metabolism, and detoxification of drugs and toxins.",
    },
    {
      question: "Which cytoskeletal filament is responsible for maintaining cell shape and resisting compression?",
      options: [
        "Actin microfilaments",
        "Intermediate filaments",
        "Microtubules",
        "Motor proteins",
      ],
      correctIndex: 1,
      explanation:
        "Intermediate filaments (e.g., keratin, vimentin) are rope-like structures that provide mechanical strength and resist compression.",
    },
    {
      question: "What molecule carries amino acids to the ribosome during translation?",
      options: ["mRNA", "rRNA", "tRNA", "snRNA"],
      correctIndex: 2,
      explanation:
        "Transfer RNA (tRNA) has an anticodon that pairs with mRNA codons and carries the corresponding amino acid to the ribosome.",
    },
    {
      question: "The sodium-potassium pump moves ions against their concentration gradient using:",
      options: [
        "Facilitated diffusion",
        "Osmosis",
        "ATP hydrolysis (active transport)",
        "Endocytosis",
      ],
      correctIndex: 2,
      explanation:
        "The Na⁺/K⁺-ATPase uses ATP hydrolysis to pump 3 Na⁺ out and 2 K⁺ in against their gradients — classic active transport.",
    },
    {
      question: "What is the role of enzymes in biochemical reactions?",
      options: [
        "They provide energy to drive reactions uphill",
        "They lower the activation energy of reactions",
        "They increase the activation energy",
        "They permanently bond to substrates",
      ],
      correctIndex: 1,
      explanation:
        "Enzymes are biological catalysts that lower activation energy, speeding up reactions without being consumed in the process.",
    },
    {
      question: "Which process describes cells engulfing large particles by membrane folding?",
      options: ["Pinocytosis", "Exocytosis", "Osmosis", "Phagocytosis"],
      correctIndex: 3,
      explanation:
        "Phagocytosis ('cell eating') involves the plasma membrane wrapping around a large particle to form a phagosome — used by macrophages to engulf pathogens.",
    },
    {
      question: "In oxidative phosphorylation, where are ATP synthase complexes located?",
      options: [
        "Outer mitochondrial membrane",
        "Mitochondrial matrix",
        "Inner mitochondrial membrane",
        "Cytoplasm",
      ],
      correctIndex: 2,
      explanation:
        "ATP synthase is embedded in the inner mitochondrial membrane. Proton flow through it (driven by the electron transport chain) powers ATP synthesis.",
    },
    {
      question: "Which signal directs a newly synthesised protein to the endoplasmic reticulum?",
      options: [
        "Poly-A tail on the mRNA",
        "A signal peptide sequence at the N-terminus",
        "Phosphorylation of the protein",
        "The 5′ cap on the mRNA",
      ],
      correctIndex: 1,
      explanation:
        "A hydrophobic signal peptide at the N-terminus directs the ribosome-mRNA-protein complex to the ER membrane, where the signal peptide is cleaved.",
    },
  ],

  2: [
    {
      question: "What does PCR stand for and what does it amplify?",
      options: [
        "Protein Chain Reaction — amplifies proteins",
        "Polymerase Chain Reaction — amplifies DNA",
        "Polymerase Chain Reaction — amplifies RNA",
        "Protein Coding Region — amplifies genes",
      ],
      correctIndex: 1,
      explanation:
        "PCR (Polymerase Chain Reaction) uses thermostable DNA polymerase to exponentially amplify a specific DNA sequence using primers and thermal cycling.",
    },
    {
      question: "In RNA-seq, what does the count matrix represent?",
      options: [
        "The number of genes in a genome",
        "The number of reads mapping to each gene per sample",
        "The protein expression levels",
        "The DNA methylation status",
      ],
      correctIndex: 1,
      explanation:
        "An RNA-seq count matrix has rows = genes and columns = samples, with each value representing how many sequencing reads mapped to that gene.",
    },
    {
      question: "What is a SNP?",
      options: [
        "A segment of non-protein-coding DNA",
        "A single nucleotide polymorphism — a one-base variation",
        "A type of structural variant spanning >50 bp",
        "A small non-coding RNA",
      ],
      correctIndex: 1,
      explanation:
        "A SNP (Single Nucleotide Polymorphism) is a position in the genome where a single base differs between individuals; used in GWAS and population genetics.",
    },
    {
      question: "Which file format stores both sequence and quality scores from Illumina sequencing?",
      options: ["FASTA", "SAM", "FASTQ", "BED"],
      correctIndex: 2,
      explanation:
        "FASTQ format stores the nucleotide sequence plus per-base quality scores (Phred-encoded), making it the standard raw output from Illumina sequencers.",
    },
    {
      question: "What does BLAST search for?",
      options: [
        "Protein secondary structure",
        "Homologous sequences in a database",
        "Open reading frames in a genome",
        "Splice sites in pre-mRNA",
      ],
      correctIndex: 1,
      explanation:
        "BLAST (Basic Local Alignment Search Tool) finds regions of local similarity between sequences, identifying homologs in databases like GenBank.",
    },
    {
      question: "In CRISPR-Cas9, what directs the Cas9 nuclease to the correct genomic location?",
      options: [
        "A protein recognition domain",
        "A guide RNA (gRNA) complementary to the target",
        "A DNA-binding zinc finger",
        "A restriction enzyme recognition site",
      ],
      correctIndex: 1,
      explanation:
        "The single guide RNA (sgRNA) contains a 20-nt spacer sequence complementary to the target DNA, directing Cas9 to cut 3 bp upstream of the PAM sequence.",
    },
    {
      question: "What does sequence alignment with a BLOSUM62 matrix help determine?",
      options: [
        "Nucleotide substitution rates in DNA",
        "Evolutionary substitution probabilities for protein sequences",
        "Gene expression levels",
        "Codon usage bias",
      ],
      correctIndex: 1,
      explanation:
        "BLOSUM62 is a substitution matrix encoding the log-odds probability of amino acid substitutions observed in alignments with ≥62% identity — used for protein BLAST.",
    },
    {
      question: "In pandas, what does `df.groupby('gene').mean()` compute?",
      options: [
        "The sum of each gene's expression across all samples",
        "The mean expression value per gene across samples",
        "The number of samples per gene",
        "The variance of each gene",
      ],
      correctIndex: 1,
      explanation:
        "groupby('gene').mean() groups rows by gene name, then computes the mean of all numeric columns within each gene group.",
    },
    {
      question: "What is the purpose of a phylogenetic tree?",
      options: [
        "To show protein 3D structure",
        "To display evolutionary relationships between sequences or organisms",
        "To map reads to a reference genome",
        "To predict gene function from sequence",
      ],
      correctIndex: 1,
      explanation:
        "Phylogenetic trees depict evolutionary relationships inferred from sequence (or other) data, with branch lengths often representing evolutionary distance.",
    },
    {
      question: "Which tool is commonly used for variant calling from aligned sequencing reads?",
      options: [
        "STAR",
        "HISAT2",
        "GATK HaplotypeCaller",
        "DESeq2",
      ],
      correctIndex: 2,
      explanation:
        "GATK HaplotypeCaller is the gold-standard tool for calling germline SNPs and indels from DNA-seq data aligned to a reference genome.",
    },
    {
      question: "What does differential expression analysis (e.g., DESeq2) identify?",
      options: [
        "Genes with sequence variants between samples",
        "Genes with statistically significant expression changes between conditions",
        "Protein-protein interactions",
        "Epigenetic marks on histones",
      ],
      correctIndex: 1,
      explanation:
        "DESeq2 uses a negative binomial model to find genes whose read counts differ significantly between experimental conditions, accounting for biological variability.",
    },
    {
      question: "In a FASTA file, what does the '>' character denote?",
      options: [
        "A comment line to be ignored",
        "A sequence header/identifier line",
        "A quality score line",
        "A gap in the alignment",
      ],
      correctIndex: 1,
      explanation:
        "In FASTA format, lines starting with '>' are header lines containing the sequence identifier and optional description; sequence data follows on subsequent lines.",
    },
    {
      question: "What is gene annotation?",
      options: [
        "Measuring gene expression by RT-PCR",
        "Assigning biological information (function, location, structure) to genomic sequences",
        "Editing genes with CRISPR",
        "Sequencing the entire genome",
      ],
      correctIndex: 1,
      explanation:
        "Gene annotation assigns biological meaning to raw genomic sequences — identifying genes, exons, regulatory elements, and their functions using computational and experimental evidence.",
    },
    {
      question: "Which statistical distribution is typically used to model RNA-seq count data?",
      options: [
        "Normal (Gaussian) distribution",
        "Poisson distribution",
        "Negative binomial distribution",
        "Binomial distribution",
      ],
      correctIndex: 2,
      explanation:
        "RNA-seq counts are over-dispersed relative to Poisson, so the negative binomial distribution (which models mean and dispersion separately) is the standard choice.",
    },
    {
      question: "A p-value of 0.03 in a hypothesis test means:",
      options: [
        "There is a 3% chance the null hypothesis is true",
        "The result is practically significant",
        "There is a 3% probability of observing data this extreme if H₀ is true",
        "The effect size is 0.03",
      ],
      correctIndex: 2,
      explanation:
        "A p-value is the probability of observing results at least as extreme as those measured, assuming the null hypothesis is true — it does NOT give the probability that H₀ is true.",
    },
    {
      question: "What does a volcano plot in genomics display?",
      options: [
        "Gene location on chromosomes vs expression level",
        "Log2 fold-change vs -log10 p-value for each gene",
        "Read depth across the genome",
        "GC content vs gene length",
      ],
      correctIndex: 1,
      explanation:
        "A volcano plot shows fold-change (x-axis) against statistical significance (y-axis), making it easy to spot genes that are both highly changed and statistically significant.",
    },
  ],

  3: [
    {
      question: "What is overfitting in machine learning?",
      options: [
        "When a model is too simple to capture patterns in the data",
        "When a model memorises training data but fails to generalise to new data",
        "When a model converges too slowly during training",
        "When the learning rate is set too high",
      ],
      correctIndex: 1,
      explanation:
        "Overfitting occurs when a model learns noise and specific patterns of training data rather than underlying structure, leading to poor generalisation.",
    },
    {
      question: "Which technique helps prevent overfitting by randomly deactivating neurons during training?",
      options: ["Batch normalisation", "L2 regularisation", "Dropout", "Weight decay"],
      correctIndex: 2,
      explanation:
        "Dropout randomly zeros neuron activations with probability p during training, forcing the network to learn redundant representations and reducing co-adaptation.",
    },
    {
      question: "What does backpropagation compute in a neural network?",
      options: [
        "The forward pass activations layer by layer",
        "The gradient of the loss with respect to each parameter",
        "The optimal learning rate automatically",
        "The number of epochs required for convergence",
      ],
      correctIndex: 1,
      explanation:
        "Backpropagation uses the chain rule to compute gradients of the loss function with respect to every weight in the network, enabling gradient descent updates.",
    },
    {
      question: "In a Convolutional Neural Network (CNN), what does a filter/kernel do?",
      options: [
        "Normalises pixel values to [0,1]",
        "Slides over the input to detect local spatial features",
        "Flattens the feature map to a 1D vector",
        "Selects the most important features using attention",
      ],
      correctIndex: 1,
      explanation:
        "A CNN filter slides across the input (via cross-correlation), computing dot products to detect local patterns like edges, textures, or motifs.",
    },
    {
      question: "What is the vanishing gradient problem?",
      options: [
        "Gradients become too large, causing unstable training",
        "Gradients shrink exponentially through layers, slowing learning in early layers",
        "The model forgets earlier training batches",
        "Loss function becomes non-differentiable",
      ],
      correctIndex: 1,
      explanation:
        "In deep networks with sigmoid/tanh activations, gradients are multiplied through many layers and shrink toward zero, making early layers nearly untrainable.",
    },
    {
      question: "What is the attention mechanism in transformers primarily used for?",
      options: [
        "Reducing dimensionality of embeddings",
        "Weighting the relevance of all positions in a sequence relative to each other",
        "Applying convolutions over time steps",
        "Normalising activations across the batch",
      ],
      correctIndex: 1,
      explanation:
        "Self-attention computes query-key similarity scores to weight value vectors, allowing each position to attend to all others — capturing long-range dependencies.",
    },
    {
      question: "Which metric is best for evaluating a classifier on an imbalanced dataset?",
      options: [
        "Raw accuracy",
        "Mean squared error",
        "F1 score or AUC-ROC",
        "R² coefficient",
      ],
      correctIndex: 2,
      explanation:
        "Accuracy is misleading on imbalanced data (a model predicting all majority class gets high accuracy). F1 or AUC-ROC better capture performance on the minority class.",
    },
    {
      question: "In gradient descent, what does the learning rate control?",
      options: [
        "The number of layers in the network",
        "The size of parameter update steps",
        "The batch size used per update",
        "The amount of regularisation applied",
      ],
      correctIndex: 1,
      explanation:
        "The learning rate η scales the gradient before subtracting it from parameters: θ ← θ − η∇L. Too large causes divergence; too small causes slow convergence.",
    },
    {
      question: "What is k-fold cross-validation used for?",
      options: [
        "Selecting the optimal number of neural network layers",
        "Estimating model performance on unseen data by rotating the validation set",
        "Regularising the loss function",
        "Augmenting the training dataset",
      ],
      correctIndex: 1,
      explanation:
        "k-fold CV splits data into k folds, trains on k-1 and validates on 1 (rotating), giving a less biased performance estimate than a single train/val split.",
    },
    {
      question: "What does L2 regularisation (weight decay) add to the loss function?",
      options: [
        "The sum of absolute values of weights",
        "The sum of squared weights multiplied by a penalty coefficient",
        "A dropout probability term",
        "The cross-entropy of the weight distribution",
      ],
      correctIndex: 1,
      explanation:
        "L2 adds λ∑w² to the loss, penalising large weights. This encourages small, distributed weights and improves generalisation by reducing model complexity.",
    },
    {
      question: "In a recurrent neural network (RNN), what is the hidden state?",
      options: [
        "The network's bias terms",
        "A compressed representation of all previous inputs in the sequence",
        "The final output prediction",
        "The gradient computed during backpropagation",
      ],
      correctIndex: 1,
      explanation:
        "The hidden state hₜ is updated at each time step as a function of the current input and previous hidden state, acting as a 'memory' of the sequence so far.",
    },
    {
      question: "What does batch normalisation do during training?",
      options: [
        "Randomly shuffles the training batches",
        "Normalises layer inputs to zero mean and unit variance per mini-batch",
        "Clips gradient norms to prevent explosion",
        "Selects the most informative samples in each batch",
      ],
      correctIndex: 1,
      explanation:
        "Batch norm normalises activations within each mini-batch, then applies learned scale and shift. This stabilises training and allows higher learning rates.",
    },
    {
      question: "What is feature importance in a Random Forest?",
      options: [
        "The correlation between features and labels",
        "A measure of how much each feature reduces impurity across all trees",
        "The variance explained by each feature",
        "The weight assigned to each feature by gradient descent",
      ],
      correctIndex: 1,
      explanation:
        "Random Forest feature importance is computed as the mean decrease in Gini impurity (or permutation importance) across all trees, indicating each feature's predictive contribution.",
    },
    {
      question: "Which loss function is typically used for multi-class classification?",
      options: [
        "Mean squared error (MSE)",
        "Binary cross-entropy",
        "Categorical cross-entropy",
        "Huber loss",
      ],
      correctIndex: 2,
      explanation:
        "Categorical cross-entropy measures the divergence between predicted probability distributions and one-hot encoded true labels across C classes.",
    },
    {
      question: "What does the softmax function do in the output layer of a classifier?",
      options: [
        "Selects the class with the highest logit",
        "Converts logits to a probability distribution summing to 1",
        "Applies a threshold at 0.5 for binary decisions",
        "Normalises activations to zero mean",
      ],
      correctIndex: 1,
      explanation:
        "Softmax transforms a vector of raw logits into probabilities by exponentiating each and dividing by the sum, ensuring all outputs are positive and sum to 1.",
    },
    {
      question: "In a transformer, what are positional encodings for?",
      options: [
        "Encoding the class label into the input",
        "Injecting information about token order since self-attention is permutation-invariant",
        "Normalising token embeddings",
        "Reducing sequence length via pooling",
      ],
      correctIndex: 1,
      explanation:
        "Self-attention has no inherent notion of order. Positional encodings (sine/cosine or learned) are added to embeddings so the model can distinguish sequence positions.",
    },
  ],

  4: [
    {
      question: "What are the four levels of protein structure?",
      options: [
        "Atomic, molecular, domain, full-length",
        "Primary, secondary, tertiary, quaternary",
        "Sequence, fold, assembly, complex",
        "Linear, planar, 3D, multi-chain",
      ],
      correctIndex: 1,
      explanation:
        "Primary = amino acid sequence; Secondary = local structure (α-helix, β-sheet); Tertiary = full 3D fold of one chain; Quaternary = multi-subunit assembly.",
    },
    {
      question: "What type of bond stabilises an α-helix?",
      options: [
        "Disulfide bonds between cysteines",
        "Hydrogen bonds between backbone NH and C=O groups 4 residues apart",
        "Ionic bonds between charged side chains",
        "van der Waals contacts between aromatic rings",
      ],
      correctIndex: 1,
      explanation:
        "α-helices are stabilised by intra-chain hydrogen bonds between the backbone NH of residue i and the C=O of residue i-4, giving 3.6 residues per turn.",
    },
    {
      question: "What does AlphaFold predict?",
      options: [
        "Protein-ligand binding affinity",
        "3D protein structure from amino acid sequence",
        "mRNA secondary structure",
        "Gene expression levels from epigenomics",
      ],
      correctIndex: 1,
      explanation:
        "AlphaFold (DeepMind) predicts a protein's 3D atomic coordinates directly from its amino acid sequence, achieving near-experimental accuracy for many proteins.",
    },
    {
      question: "In the PDB format, what do ATOM records represent?",
      options: [
        "Metadata about the experiment",
        "Atomic coordinates of standard amino acid residues",
        "Sequence information in FASTA format",
        "Ligand binding energies",
      ],
      correctIndex: 1,
      explanation:
        "ATOM records in a PDB file list the 3D coordinates (x, y, z), atom type, residue name, chain ID, and temperature factor for each atom in standard residues.",
    },
    {
      question: "Which driving force is most important for protein folding in aqueous solution?",
      options: [
        "Maximising electrostatic interactions",
        "The hydrophobic effect — burying non-polar residues from water",
        "Forming the maximum number of disulfide bonds",
        "Minimising the number of hydrogen bonds",
      ],
      correctIndex: 1,
      explanation:
        "The hydrophobic effect is the dominant driving force: non-polar residues are thermodynamically driven to bury in the protein core, away from water.",
    },
    {
      question: "What is a contact map in structural bioinformatics?",
      options: [
        "A list of protein-protein interaction partners",
        "A 2D matrix indicating which residue pairs are within a distance threshold",
        "A graph of inter-chain disulfide bonds",
        "A map of solvent-accessible surface areas",
      ],
      correctIndex: 1,
      explanation:
        "A contact map is an L×L binary (or distance) matrix where entry (i,j)=1 if residues i and j are within ~8 Å — used in structure prediction and co-evolution analysis.",
    },
    {
      question: "What is the Michaelis-Menten equation describing?",
      options: [
        "The thermodynamics of protein folding",
        "The relationship between substrate concentration and enzyme reaction rate",
        "The binding affinity between two proteins",
        "The rate of mRNA degradation",
      ],
      correctIndex: 1,
      explanation:
        "Michaelis-Menten kinetics: v = Vmax[S]/(Km+[S]). It models how reaction rate saturates as substrate [S] increases, with Km being the concentration at half-maximal rate.",
    },
    {
      question: "What does ESMFold/ESM use to predict protein structure?",
      options: [
        "Multiple sequence alignments from databases",
        "Language model representations trained on protein sequences",
        "Cryo-EM density maps",
        "Molecular dynamics simulation trajectories",
      ],
      correctIndex: 1,
      explanation:
        "ESMFold uses protein language model (LM) representations (ESM-2) to predict structure in a single forward pass, without needing MSAs.",
    },
    {
      question: "In molecular dynamics simulation, what is a force field?",
      options: [
        "The electromagnetic field around a protein",
        "A mathematical model describing inter-atomic potential energy",
        "The gradient of the loss in neural network training",
        "A database of known protein folds",
      ],
      correctIndex: 1,
      explanation:
        "A force field (e.g., AMBER, CHARMM) defines potential energy functions for bonds, angles, torsions, and non-bonded interactions, enabling Newton's equations of motion.",
    },
    {
      question: "Which structural alignment tool measures similarity using RMSD?",
      options: [
        "BLAST",
        "TM-align",
        "Clustal Omega",
        "MAFFT",
      ],
      correctIndex: 1,
      explanation:
        "TM-align superposes two protein structures and reports TM-score and RMSD (root-mean-square deviation of Cα atoms after optimal superposition).",
    },
    {
      question: "What is a beta-sheet stabilised by?",
      options: [
        "Intra-strand hydrogen bonds along the backbone",
        "Inter-strand hydrogen bonds between backbone NH and C=O groups",
        "Hydrophobic packing of aliphatic side chains",
        "Disulfide bridges between adjacent strands",
      ],
      correctIndex: 1,
      explanation:
        "β-sheets are formed by inter-strand hydrogen bonds between the NH of one strand and the C=O of an adjacent strand, in either parallel or anti-parallel arrangements.",
    },
    {
      question: "What is amyloid fibril formation associated with?",
      options: [
        "Normal protein secretion pathways",
        "Misfolded proteins aggregating into cross-β structures linked to diseases",
        "Efficient protein chaperone activity",
        "mRNA splicing errors",
      ],
      correctIndex: 1,
      explanation:
        "Amyloid fibrils are ordered aggregates of misfolded proteins with a cross-β structure. They are associated with neurodegenerative diseases like Alzheimer's, Parkinson's, and Huntington's.",
    },
    {
      question: "In antibody engineering, what is CDR grafting used for?",
      options: [
        "Inserting CRISPR sequences into antibody genes",
        "Transplanting antigen-binding loops onto a human framework to humanise antibodies",
        "Increasing antibody production in E. coli",
        "Sequencing antibody variable regions",
      ],
      correctIndex: 1,
      explanation:
        "CDR grafting transfers the complementarity-determining regions (antigen-binding loops) from a non-human antibody onto a human IgG framework, reducing immunogenicity.",
    },
    {
      question: "What does a protein embedding (e.g., from ESM-2) capture?",
      options: [
        "The exact 3D coordinates of each residue",
        "A fixed-length numerical representation of sequence and evolutionary context",
        "The gene regulatory elements controlling expression",
        "The solubility score of the protein",
      ],
      correctIndex: 1,
      explanation:
        "Protein language model embeddings encode each residue (or whole sequence) as a dense vector capturing evolutionary patterns, secondary structure propensities, and function.",
    },
    {
      question: "In fragment-based drug discovery, what are 'fragments'?",
      options: [
        "Broken pieces of target proteins",
        "Small, low-MW chemical compounds screened for weak binding to a target",
        "Short peptides derived from the protein sequence",
        "DNA oligonucleotides used as probes",
      ],
      correctIndex: 1,
      explanation:
        "Fragments are small molecules (MW ≈ 100–300 Da) that bind weakly but efficiently to the target. Hits are then grown or linked into drug-sized leads.",
    },
    {
      question: "What is the TM-score threshold often used to classify proteins as having the same fold?",
      options: [
        "TM-score > 0.1",
        "TM-score > 0.5",
        "TM-score > 0.9",
        "TM-score = 1.0 exactly",
      ],
      correctIndex: 1,
      explanation:
        "A TM-score > 0.5 is the widely accepted threshold indicating that two structures share the same overall fold, regardless of sequence identity.",
    },
  ],
};
