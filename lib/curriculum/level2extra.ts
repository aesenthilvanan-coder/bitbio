import type { Module } from "@/lib/types";

const level2ExtraModules: Module[] = [
  {
    id: "l2-m7",
    title: "CRISPR & Gene Editing",
    description: "The programmable molecular scissors that changed biology forever",
    realm: 2,
    color: "#52b788",
    nodes: [
      {
        id: "l2-m7-n1",
        moduleId: "l2-m7",
        title: "CRISPR-Cas9 Mechanism",
        description: "Guide RNA, Cas9, and the PAM sequence",
        icon: "✂️",
        xpReward: 160,
        exercises: [
          {
            id: "l2-m7-n1-e1",
            type: "multiple-choice",
            question: "What does CRISPR stand for?",
            options: [
              "Clustered Regularly Interspaced Short Palindromic Repeats",
              "Controlled RNA Insertion Splicing and Protein Replacement",
              "Crick RNA Integration System for Precise Recombination",
              "Catalytic Ribonucleoprotein Insertion Splicing Protocol",
            ],
            correctIndex: 0,
            explanation: "CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) was originally discovered as an adaptive immune system in bacteria. Scientists repurposed it into a precise gene-editing tool.",
            xpReward: 10,
          },
          {
            id: "l2-m7-n1-e2",
            type: "sequence-order",
            question: "Order the steps of CRISPR-Cas9 gene editing:",
            items: [
              "Cell repairs the DSB via NHEJ (error-prone) or HDR (precise, with template)",
              "Guide RNA (gRNA) base-pairs with target DNA sequence",
              "Cas9 protein creates a double-strand break (DSB) 3 bp upstream of PAM",
              "gRNA loaded into Cas9 — complex scans genome for PAM sequence (NGG for SpCas9)",
            ],
            correctOrder: [3, 1, 2, 0],
            xpReward: 20,
          },
          {
            id: "l2-m7-n1-e3",
            type: "fill-blank",
            question: "For SpCas9, the PAM sequence required immediately downstream of the target site is _____.",
            blanks: [{ text: "NGG", answer: "NGG", position: 0 }],
            explanation: "The PAM (Protospacer Adjacent Motif) for the most common Cas9 (from S. pyogenes) is NGG (N=any nucleotide). Without a PAM, Cas9 won't cut. Different Cas orthologs (SaCas9, Cas12a) have different PAM requirements.",
            xpReward: 10,
          },
          {
            id: "l2-m7-n1-e4",
            type: "drag-drop",
            question: "Match each CRISPR application to its mechanism:",
            pairs: [
              { left: "Gene knockout", right: "NHEJ repair after DSB causes frameshift indels → non-functional protein" },
              { left: "Precise gene correction", right: "HDR with provided DNA template — requires donor DNA and is less efficient" },
              { left: "CRISPRi (interference)", right: "Catalytically dead Cas9 (dCas9) + repressor blocks transcription — no cut" },
              { left: "Base editing", right: "Fused deaminase converts C→T (CBE) or A→G (ABE) without double-strand break" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m7-n1-e5",
            type: "code-complete",
            question: "Write a function to find all valid CRISPR target sites (23-mers ending in NGG) in a sequence:",
            starterCode: `def find_crispr_targets(sequence, pam="NGG"):
    \"\"\"Find all 20-mer spacers upstream of PAM sites in the given sequence.\"\"\"
    targets = []
    seq = sequence.upper()
    pam_len = len(pam)
    spacer_len = 20

    for i in range(len(seq) - spacer_len - pam_len + 1):
        pam_site = seq[i + spacer_len : i + spacer_len + pam_len]
        # Check if PAM matches (N = any nucleotide)
        pam_match = ___
        if pam_match:
            spacer = seq[i : i + spacer_len]
            targets.append({'spacer': spacer, 'pam': pam_site, 'position': i})

    return targets`,
            solution: `        pam_match = all(p == 'N' or p == s for p, s in zip(pam, pam_site))`,
            explanation: "We scan the sequence for all positions where a 20-nt spacer is followed by a matching PAM. 'N' matches any nucleotide. This is essentially how guide RNA design tools work.",
            xpReward: 25,
          },
          {
            id: "l2-m7-n1-e6",
            type: "multiple-choice",
            question: "Why is off-target editing a concern in CRISPR, and what is the key factor determining it?",
            options: [
              "Cas9 randomly cuts DNA regardless of guide RNA",
              "Guide RNAs can tolerate mismatches with off-target DNA, especially toward the 5' end of the spacer",
              "The PAM requirement prevents all off-target effects",
              "Off-target effects only occur in non-dividing cells",
            ],
            correctIndex: 1,
            explanation: "gRNA can tolerate several mismatches, especially in the 5' (non-seed) region away from the PAM. The seed region (PAM-proximal, ~10 nt) is most critical for specificity. High-fidelity Cas9 variants (eSpCas9, HiFi Cas9) reduce off-target effects.",
            xpReward: 15,
          },
          {
            id: "l2-m7-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are legitimate CRISPR/Cas-based technologies (not made up):",
            options: ["Prime editing", "Base editing (CBE/ABE)", "CRISPRa (activation)", "Gene drive", "CRISPR-FISH", "Transcripto-CRISPR"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "Prime editing (search-and-replace), base editing (C→T or A→G), CRISPRa (transcription activation via dCas9-activator), gene drives (self-propagating), and CRISPR-FISH (imaging) are all real. 'Transcripto-CRISPR' is not a real technology.",
            xpReward: 15,
          },
          {
            id: "l2-m7-n1-e8",
            type: "free-text",
            question: "Describe a therapeutic application of CRISPR and explain the key biological challenge that must be overcome.",
            rubric: ["delivery", "off-target", "immune", "therapy", "sickle cell", "in vivo", "ex vivo", "specificity"],
            minKeywords: 3,
            explanation: "CRISPR therapies (e.g., for sickle cell disease — Casgevy) show promise. Key challenges: (1) delivery to target tissues in vivo, (2) off-target edits potentially causing cancer, (3) immune response to Cas9 protein, (4) mosaicism in embryos.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "l2-m7-n2",
        moduleId: "l2-m7",
        title: "Transcriptomics & scRNA-seq",
        description: "Reading gene expression one cell at a time",
        icon: "🔭",
        xpReward: 170,
        exercises: [
          {
            id: "l2-m7-n2-e1",
            type: "multiple-choice",
            question: "What is single-cell RNA sequencing (scRNA-seq) measuring?",
            options: [
              "DNA mutations in individual cells",
              "The transcriptome — what genes are expressed and at what level — in each individual cell",
              "Protein abundance in single cells",
              "Chromatin accessibility in single cells",
            ],
            correctIndex: 1,
            explanation: "scRNA-seq captures mRNA from thousands of individual cells, creating a gene expression profile per cell. This reveals cell-type heterogeneity invisible in bulk RNA-seq, which averages across all cells.",
            xpReward: 10,
          },
          {
            id: "l2-m7-n2-e2",
            type: "drag-drop",
            question: "Match each scRNA-seq analysis step to its purpose:",
            pairs: [
              { left: "Quality control (UMI filtering)", right: "Remove low-quality cells (too few genes, high % mitochondrial reads)" },
              { left: "Normalization", right: "Correct for cell-to-cell differences in sequencing depth" },
              { left: "Dimensionality reduction (PCA/UMAP)", right: "Compress thousands of gene dimensions into 2-3D for visualization" },
              { left: "Clustering", right: "Group cells with similar expression profiles — each cluster is a cell type" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m7-n2-e3",
            type: "code-complete",
            question: "Normalize a count matrix using CPM (counts per million) normalization:",
            starterCode: `import numpy as np

def cpm_normalize(count_matrix):
    \"\"\"
    CPM normalize a count matrix.
    count_matrix: numpy array of shape (n_cells, n_genes)
    Returns: CPM-normalized matrix
    \"\"\"
    cell_totals = count_matrix.sum(axis=1, keepdims=True)
    cpm = ___
    return cpm`,
            solution: `    cpm = (count_matrix / cell_totals) * 1_000_000`,
            explanation: "CPM normalizes each cell's counts by dividing by total counts and multiplying by 1 million. This makes cells with different sequencing depths comparable. Log normalization (log1p) is typically applied after CPM.",
            xpReward: 25,
          },
          {
            id: "l2-m7-n2-e4",
            type: "fill-blank",
            question: "In scRNA-seq, UMI stands for _____, which are used to deduplicate PCR amplification artifacts.",
            blanks: [{ text: "Unique Molecular Identifier", answer: "Unique Molecular Identifier", position: 0 }],
            explanation: "UMIs are short random nucleotide barcodes added before PCR amplification. Two reads with the same UMI + cell barcode came from the same original molecule — PCR duplicates. Counting UMIs (not reads) gives true molecule counts.",
            xpReward: 10,
          },
          {
            id: "l2-m7-n2-e5",
            type: "multiple-choice",
            question: "What does a UMAP plot of scRNA-seq data show?",
            options: [
              "The genome-wide mutation profile of each cell",
              "A 2D projection where cells with similar expression cluster together, revealing cell types",
              "The spatial location of cells in a tissue",
              "The proportion of reads mapping to each chromosome",
            ],
            correctIndex: 1,
            explanation: "UMAP (Uniform Manifold Approximation and Projection) reduces the high-dimensional expression space (thousands of genes) to 2D. Cells with similar transcriptomes cluster nearby — each cluster typically represents a cell type or state.",
            xpReward: 15,
          },
          {
            id: "l2-m7-n2-e6",
            type: "sequence-order",
            question: "Order the typical scRNA-seq data analysis pipeline:",
            items: [
              "Dimensionality reduction (PCA → UMAP/t-SNE)",
              "Alignment and UMI counting (CellRanger, STARsolo)",
              "Differential expression analysis + cell type annotation",
              "Quality control, normalization, highly variable gene selection",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 20,
          },
          {
            id: "l2-m7-n2-e7",
            type: "tap-correct",
            question: "Tap ALL tools commonly used in scRNA-seq analysis:",
            options: ["Seurat (R)", "Scanpy (Python)", "DESeq2", "STAR aligner", "Monocle (trajectory)", "GATK"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "Seurat, Scanpy, DESeq2, STAR, and Monocle are all standard scRNA-seq tools. GATK is for variant calling (DNA), not scRNA-seq (though it can be adapted).",
            xpReward: 15,
          },
          {
            id: "l2-m7-n2-e8",
            type: "free-text",
            question: "Explain why scRNA-seq data is considered 'sparse' and how this affects analysis.",
            rubric: ["dropout", "zero", "sparse", "sensitivity", "technical noise", "imputation", "rare"],
            minKeywords: 3,
            explanation: "Typical scRNA-seq captures only ~10-20% of mRNA molecules per cell — most gene-cell entries are zero ('dropout'). This creates extreme sparsity (>90% zeros). Consequences: statistical methods must handle zeros carefully, rare transcripts are often missed, imputation methods try to fill missing values, and normalization must handle the near-zero counts.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m8",
    title: "Proteomics & Mass Spectrometry",
    description: "Identifying and quantifying every protein in a sample",
    realm: 2,
    color: "#39ff14",
    nodes: [
      {
        id: "l2-m8-n1",
        moduleId: "l2-m8",
        title: "Mass Spectrometry for Biologists",
        description: "How MS identifies proteins at scale",
        icon: "⚗️",
        xpReward: 155,
        exercises: [
          {
            id: "l2-m8-n1-e1",
            type: "multiple-choice",
            question: "What does a mass spectrometer measure?",
            options: [
              "The color spectrum emitted by molecules",
              "The mass-to-charge ratio (m/z) of ionized molecules",
              "The radioactivity of biological samples",
              "The electrical conductance of protein solutions",
            ],
            correctIndex: 1,
            explanation: "A mass spectrometer ionizes molecules and measures their m/z (mass-to-charge ratio). For peptides, this allows precise mass determination, enabling protein identification by matching against predicted peptide masses from protein databases.",
            xpReward: 10,
          },
          {
            id: "l2-m8-n1-e2",
            type: "sequence-order",
            question: "Order the steps of a typical shotgun proteomics workflow:",
            items: [
              "Mass spec analysis — measure peptide m/z and MS2 fragment ions",
              "Protein extraction and denaturation",
              "Database search — match spectra to peptide sequences (Mascot, MaxQuant)",
              "Tryptic digestion — cleave proteins after Lys and Arg residues",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 20,
          },
          {
            id: "l2-m8-n1-e3",
            type: "fill-blank",
            question: "Trypsin cleaves proteins on the C-terminal side of _____ and _____ residues (except when followed by Proline).",
            blanks: [
              { text: "lysine", answer: "lysine", position: 0 },
              { text: "arginine", answer: "arginine", position: 1 },
            ],
            explanation: "Trypsin's specificity for Lys (K) and Arg (R) produces peptides of roughly ideal size for MS (6-25 aa). Tryptic peptides are predictable, enabling in-silico digestion of any protein sequence for database matching.",
            xpReward: 10,
          },
          {
            id: "l2-m8-n1-e4",
            type: "code-complete",
            question: "Implement an in-silico tryptic digest function:",
            starterCode: `import re

def tryptic_digest(protein_sequence, missed_cleavages=0):
    \"\"\"
    Digest a protein sequence with trypsin.
    Cleaves after K or R, unless followed by P.
    Returns list of peptide strings.
    \"\"\"
    # Split after K or R not followed by P
    peptides_raw = ___
    peptides = [p for p in peptides_raw if p]  # remove empty strings

    # Handle missed cleavages (joining adjacent peptides)
    if missed_cleavages > 0:
        extended = list(peptides)
        for mc in range(1, missed_cleavages + 1):
            for i in range(len(peptides) - mc):
                extended.append(''.join(peptides[i:i+mc+1]))
        return sorted(set(extended), key=len)

    return peptides`,
            solution: `    peptides_raw = re.split(r'(?<=[KR])(?!P)', protein_sequence.upper())`,
            explanation: "We use a regex with a lookbehind (?<=[KR]) and negative lookahead (?!P) to split after K or R only when not followed by P. This is the standard in silico trypsin rule used by proteomics search engines.",
            xpReward: 25,
          },
          {
            id: "l2-m8-n1-e5",
            type: "drag-drop",
            question: "Match each MS quantification method to its approach:",
            pairs: [
              { left: "Label-free quantification (LFQ)", right: "Compare peptide ion intensities across runs without chemical labels" },
              { left: "TMT (Tandem Mass Tags)", right: "Chemical isobaric labels on peptides — multiplex up to 18 samples in one run" },
              { left: "SILAC", right: "Metabolic labeling with heavy amino acids (13C/15N) — encode samples at protein level" },
              { left: "MRM/SRM", right: "Targeted quantification — select specific peptide transitions for absolute quantification" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m8-n1-e6",
            type: "multiple-choice",
            question: "What is a 'peptide spectral match' (PSM) in proteomics?",
            options: [
              "A match between two spectra from different MS instruments",
              "The assignment of an observed MS2 spectrum to a specific peptide sequence from a database",
              "A quality score for the MS instrument calibration",
              "A match between protein sequences and genomic data",
            ],
            correctIndex: 1,
            explanation: "A PSM (Peptide Spectral Match) is when a software tool (e.g., Mascot, Sequest) assigns a measured MS2 spectrum to a specific peptide sequence. PSM quality is typically assessed using false discovery rate (FDR) using decoy databases.",
            xpReward: 15,
          },
          {
            id: "l2-m8-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are real mass spectrometer analyzer types used in proteomics:",
            options: ["Orbitrap", "Time-of-flight (TOF)", "Ion trap", "Cyclotron resonance (FT-ICR)", "Quadrupole", "Synchrotron"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "Orbitrap, TOF, ion trap, FT-ICR, and quadrupole are all real MS analyzers used in proteomics. Synchrotrons are X-ray sources used in structural biology, not mass analyzers.",
            xpReward: 15,
          },
          {
            id: "l2-m8-n1-e8",
            type: "free-text",
            question: "Explain the concept of False Discovery Rate (FDR) in proteomics database searches and why it matters.",
            rubric: ["false positive", "decoy", "target-decoy", "threshold", "1%", "incorrect", "FDR"],
            minKeywords: 3,
            explanation: "FDR = proportion of false positive identifications among accepted results. In proteomics, the target-decoy approach: search against a 'decoy' database (reversed/scrambled sequences) alongside the real database. Decoy hits are false positives by definition. Setting FDR at 1% means ≤1% of accepted PSMs are false. Critical for large-scale studies where thousands of spectra generate many chance matches.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m9",
    title: "Epigenomics & Chromatin Biology",
    description: "How the same DNA makes 200+ cell types — the code beyond the code",
    realm: 2,
    color: "#a855f7",
    nodes: [
      {
        id: "l2-m9-n1",
        moduleId: "l2-m9",
        title: "Histone Modifications & DNA Methylation",
        description: "The epigenetic language that controls gene expression",
        icon: "🔐",
        xpReward: 165,
        exercises: [
          {
            id: "l2-m9-n1-e1",
            type: "multiple-choice",
            question: "What is epigenetics?",
            options: [
              "Mutations in the DNA sequence inherited across generations",
              "Heritable changes in gene expression that don't involve changes to the DNA sequence itself",
              "The study of genes involved in development only",
              "The entire set of proteins that interact with DNA",
            ],
            correctIndex: 1,
            explanation: "Epigenetics covers heritable changes in gene expression (and cellular identity) caused by chemical modifications to DNA or histones — not DNA sequence changes. Examples: DNA methylation, histone acetylation/methylation, chromatin remodeling.",
            xpReward: 10,
          },
          {
            id: "l2-m9-n1-e2",
            type: "drag-drop",
            question: "Match each epigenetic mark to its typical effect on gene expression:",
            pairs: [
              { left: "H3K4me3 (histone H3, lysine 4 trimethylation)", right: "Active promoters — marks transcriptionally active genes" },
              { left: "H3K27me3 (histone H3, lysine 27 trimethylation)", right: "Polycomb-mediated repression — silences developmental genes" },
              { left: "H3K27ac (histone H3, lysine 27 acetylation)", right: "Active enhancers — marks regulatory elements driving transcription" },
              { left: "DNA methylation (CpG methylation)", right: "Gene silencing — methylated promoters are typically not expressed" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m9-n1-e3",
            type: "fill-blank",
            question: "The ENCODE project revealed that over _____% of the human genome has biochemical activity (histone marks, transcription factor binding, accessible chromatin), far more than the ~1.5% that codes for proteins.",
            blanks: [{ text: "80", answer: "80", position: 0 }],
            explanation: "ENCODE (Encyclopedia of DNA Elements) showed >80% of the human genome has some biochemical function, challenging the earlier view that non-coding DNA was 'junk.' Much of this is regulatory: enhancers, promoters, non-coding RNAs.",
            xpReward: 10,
          },
          {
            id: "l2-m9-n1-e4",
            type: "sequence-order",
            question: "Order the steps in a ChIP-seq experiment (Chromatin Immunoprecipitation sequencing):",
            items: [
              "Sequence immunoprecipitated DNA — map reads to genome → peak calling",
              "Crosslink proteins to DNA in live cells (formaldehyde)",
              "Immunoprecipitate with antibody against specific histone mark or TF",
              "Shear chromatin to ~200 bp fragments by sonication",
            ],
            correctOrder: [1, 3, 2, 0],
            xpReward: 20,
          },
          {
            id: "l2-m9-n1-e5",
            type: "code-complete",
            question: "Write a function to calculate CpG observed/expected ratio (a measure of CpG island presence):",
            starterCode: `def cpg_oe_ratio(sequence):
    \"\"\"
    Calculate CpG observed/expected ratio.
    O/E = (count_CpG * length) / (count_C * count_G)
    Ratio > 0.6 suggests a CpG island.
    \"\"\"
    seq = sequence.upper()
    n = len(seq)
    count_CpG = ___
    count_C = seq.count('C')
    count_G = seq.count('G')
    if count_C == 0 or count_G == 0:
        return 0.0
    return (count_CpG * n) / (count_C * count_G)`,
            solution: `    count_CpG = sum(seq[i:i+2] == 'CG' for i in range(n-1))`,
            explanation: "CpG islands are regions with high CpG O/E ratio (>0.6) and high GC content. They often mark gene promoters. Most CpGs outside islands are methylated; CpG islands at active promoters are often unmethylated.",
            xpReward: 25,
          },
          {
            id: "l2-m9-n1-e6",
            type: "multiple-choice",
            question: "What is ATAC-seq used for?",
            options: [
              "Measuring histone acetylation genome-wide",
              "Mapping open chromatin regions (accessible DNA) genome-wide",
              "Profiling DNA methylation at single-base resolution",
              "Identifying protein-coding genes in a new organism",
            ],
            correctIndex: 1,
            explanation: "ATAC-seq (Assay for Transposase-Accessible Chromatin) uses Tn5 transposase to insert sequencing adapters into accessible (nucleosome-free) chromatin regions. Open regions = active regulatory elements (promoters, enhancers). Far less input material than ChIP-seq DNase-seq.",
            xpReward: 15,
          },
          {
            id: "l2-m9-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are techniques for studying the 3D organization of the genome:",
            options: ["Hi-C", "ChIA-PET", "FISH (fluorescence in situ hybridization)", "Micro-C", "ORCA", "WGBS (whole genome bisulfite)"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "Hi-C, ChIA-PET, FISH, Micro-C, and ORCA (optical reconstruction of chromatin architecture) all reveal 3D genome organization. WGBS profiles DNA methylation (1D), not 3D structure.",
            xpReward: 15,
          },
          {
            id: "l2-m9-n1-e8",
            type: "free-text",
            question: "Explain how all ~200 cell types in the human body can arise from a single genome through epigenetic mechanisms.",
            rubric: ["differentiation", "epigenetics", "methylation", "histone", "enhancer", "transcription factor", "chromatin"],
            minKeywords: 3,
            explanation: "All cells have the same DNA but different epigenetic states. During development, cell-type-specific transcription factors activate specific enhancers, which recruit histone acetyltransferases (opening chromatin), while other regions get methylated or covered in repressive marks (H3K27me3). These patterns are stably inherited through cell division, locking cells into their fate — a neuron stays a neuron, a liver cell stays a liver cell.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
];

export default level2ExtraModules;
