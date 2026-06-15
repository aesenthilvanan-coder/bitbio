import type { Module } from "@/lib/types";

const level2BonusModules: Module[] = [
  {
    id: "l2-m10",
    title: "Structural Variant & Long-Read Analysis",
    description: "The dark genome — what short reads miss",
    realm: 2,
    color: "#52b788",
    nodes: [
      {
        id: "l2-m10-n1",
        moduleId: "l2-m10",
        title: "Detecting Structural Variants",
        description: "SVs cause more sequence difference between humans than SNPs",
        icon: "🔀",
        xpReward: 175,
        exercises: [
          {
            id: "l2-m10-n1-e1",
            type: "multiple-choice",
            question: "Structural variants (SVs) contribute more to human genetic diversity than SNPs by what measure?",
            options: [
              "By count — there are more SVs than SNPs",
              "By base pairs affected — SVs affect more total DNA sequence despite being fewer in number",
              "By disease burden — SVs cause more disease",
              "By evolutionary conservation — SVs are more conserved",
            ],
            correctIndex: 1,
            explanation: "Any two humans differ by ~4-5 million SNPs (~0.1% of bases). But SVs, though fewer in number (~20,000-30,000 per genome), affect ~10-20 million bases of sequence — more total sequence variation. CNVs alone account for >12 Mb of difference. SVs are deeply understudied because short reads miss them.",
            xpReward: 10,
          },
          {
            id: "l2-m10-n1-e2",
            type: "drag-drop",
            question: "Match each SV detection signal to the SV type it indicates:",
            pairs: [
              { left: "Paired reads mapping too far apart", right: "Deletion — sequence between reads is missing from query genome" },
              { left: "Paired reads mapping to different chromosomes", right: "Translocation — portions of two chromosomes are joined" },
              { left: "Increased read depth in a region", right: "Tandem duplication — extra copy(ies) of the region" },
              { left: "Split reads at a breakpoint", right: "Any SV — reads spanning the breakpoint are split in alignment" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m10-n1-e3",
            type: "code-complete",
            question: "Detect putative deletions from discordant paired-end reads (simplified):",
            starterCode: `def find_deletion_signals(paired_reads, expected_insert_size, std_dev, threshold_std=3):
    \"\"\"
    Find read pairs where insert size is much larger than expected,
    suggesting a deletion between the reads.
    Each read pair: {'read1_pos': int, 'read2_pos': int, 'chr': str}
    Returns: list of putative deletion signals
    \"\"\"
    upper_limit = expected_insert_size + threshold_std * std_dev
    deletions = []

    for pair in paired_reads:
        insert_size = ___
        if insert_size > upper_limit:
            deletions.append({
                'chr': pair['chr'],
                'start': pair['read1_pos'],
                'end': pair['read2_pos'],
                'insert_size': insert_size
            })

    return deletions`,
            solution: `        insert_size = pair['read2_pos'] - pair['read1_pos']`,
            explanation: "Deletion signal: if the distance between paired reads (insert size) is much larger than expected (by 3+ standard deviations), there may be deleted sequence between them in the sample. This is the core principle behind tools like DELLY and Manta for SV detection.",
            xpReward: 25,
          },
          {
            id: "l2-m10-n1-e4",
            type: "fill-blank",
            question: "The ENCODE project found that human centromeres and _____ (telomere-to-telomere) regions, completely inaccessible to short reads, were finally assembled using Oxford Nanopore ultra-long reads.",
            blanks: [{ text: "T2T", answer: "T2T", position: 0 }],
            explanation: "The T2T (Telomere-to-Telomere) Consortium (2022) completed the first truly gapless human genome assembly using Oxford Nanopore ultra-long reads and PacBio HiFi. They filled 200 Mb of missing sequence including centromeres, rDNA arrays, and segmental duplications — invisible to Illumina.",
            xpReward: 10,
          },
          {
            id: "l2-m10-n1-e5",
            type: "sequence-order",
            question: "Order steps in a long-read structural variant calling pipeline:",
            items: [
              "Genotype and phase SVs against population reference panel",
              "Align long reads to reference (minimap2 for nanopore/PacBio)",
              "Filter and annotate SVs: overlap with genes, known SV databases (gnomAD-SV, DGV)",
              "Call SVs from aligned reads (Sniffles2, PBSV, cuteSV)",
            ],
            correctOrder: [1, 3, 2, 0],
            xpReward: 20,
          },
          {
            id: "l2-m10-n1-e6",
            type: "tap-correct",
            question: "Tap ALL that are reasons why short-read sequencing fails to detect SVs in repetitive regions:",
            options: [
              "Reads can't be uniquely aligned — they map to multiple repetitive loci",
              "Reads are too short to span the entire SV breakpoint",
              "PCR amplification during library prep fails in GC-rich repeats",
              "Repetitive sequences have identical k-mer profiles, confusing aligners",
              "Short reads can't detect methylation in repeats",
            ],
            correctIndices: [0, 1, 2, 3],
            explanation: "Short reads in repeats: (1) multi-mapping (non-unique alignment), (2) too short to bridge breakpoints in long repeats (STRs, satellites), (3) PCR bias/failure in high-GC or palindromic regions, (4) identical k-mers make graph-based assembly fail. Methylation detection is a separate issue (not relevant to SV detection failure).",
            xpReward: 15,
          },
          {
            id: "l2-m10-n1-e7",
            type: "free-text",
            question: "Explain why tandem repeat expansions like those in Huntington's disease are so difficult to detect and accurately size using traditional sequencing.",
            rubric: ["CAG", "repeat", "short read", "span", "PCR", "stutter", "long read", "expansion"],
            minKeywords: 3,
            explanation: "Huntington's: CAG repeat in HTT (>36 = disease). Problems: (1) PCR during library prep causes 'stutter' — polymerase slippage creates artificial length variants; (2) short reads (150 bp) can't span long repeats (HD repeats can be >200 CAG = 600 bp); (3) the repeat region appears as a pile of ambiguous alignments; (4) genome assemblers collapse repeats. Long-read sequencing (Nanopore) directly reads through the repeat without PCR, giving accurate repeat count in a single read.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m11",
    title: "Microbiome Analysis",
    description: "The 38 trillion bacteria in your body and how we study them",
    realm: 2,
    color: "#39ff14",
    nodes: [
      {
        id: "l2-m11-n1",
        moduleId: "l2-m11",
        title: "16S rRNA Amplicon Sequencing",
        description: "The workhorse of microbiome studies",
        icon: "🦠",
        xpReward: 170,
        exercises: [
          {
            id: "l2-m11-n1-e1",
            type: "multiple-choice",
            question: "Why is 16S rRNA used for identifying bacteria in microbiome studies?",
            options: [
              "It is easy to extract from stool samples",
              "It has conserved primer regions flanking variable regions that differ between bacterial species — like a barcode",
              "All bacteria have exactly the same 16S sequence — it's a housekeeping gene",
              "16S rRNA is the most expressed gene in bacteria",
            ],
            correctIndex: 1,
            explanation: "16S rRNA has: (1) universal conserved regions → PCR primers that amplify from ALL bacteria; (2) hypervariable regions (V1-V9) that differ enough between species to distinguish them. This 'universal bacterial barcode' doesn't exist for DNA sequencing of random genes — you'd miss species without good reference databases.",
            xpReward: 10,
          },
          {
            id: "l2-m11-n1-e2",
            type: "drag-drop",
            question: "Match each alpha diversity metric to what it measures:",
            pairs: [
              { left: "Shannon diversity (H')", right: "Richness + evenness — weighted by species proportions; sensitive to rare species" },
              { left: "Chao1 richness", right: "Estimates true species richness including unseen rare species" },
              { left: "Simpson's index (1-D)", right: "Probability two random individuals are different species — dominance-focused" },
              { left: "Faith's PD (phylogenetic diversity)", right: "Sum of branch lengths in phylogenetic tree — accounts for evolutionary distinctiveness" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m11-n1-e3",
            type: "code-complete",
            question: "Calculate Shannon diversity index for a microbiome sample:",
            starterCode: `import numpy as np

def shannon_diversity(counts):
    \"\"\"
    Calculate Shannon diversity index H' = -sum(p_i * log(p_i))
    counts: array of read counts per OTU/ASV
    Returns: Shannon H' (higher = more diverse)
    \"\"\"
    counts = np.array(counts, dtype=float)
    counts = counts[counts > 0]  # remove zeros
    proportions = ___
    return -np.sum(proportions * np.log(proportions))`,
            solution: `    proportions = counts / counts.sum()`,
            explanation: "Shannon diversity: H' = -∑(p_i * ln(p_i)) where p_i is the relative abundance of taxon i. Maximum H' = ln(n_species) when all species equally abundant. Minimum = 0 when only one species. Commonly used to compare gut microbiome diversity between healthy and diseased individuals.",
            xpReward: 25,
          },
          {
            id: "l2-m11-n1-e4",
            type: "fill-blank",
            question: "QIIME2's DADA2 algorithm produces _____ (ASVs) rather than OTUs — exact sequence variants that are more precise than 97% similarity clustering.",
            blanks: [{ text: "Amplicon Sequence Variants", answer: "Amplicon Sequence Variants", position: 0 }],
            explanation: "OTUs (Operational Taxonomic Units): cluster reads at 97% similarity — fast but imprecise. ASVs (DADA2, Deblur): correct sequencing errors then find exact sequences that are biological — each ASV is a real biological sequence. ASVs can distinguish strains differing by a single base, are reproducible across studies, and can be compared without re-running OTU clustering.",
            xpReward: 10,
          },
          {
            id: "l2-m11-n1-e5",
            type: "sequence-order",
            question: "Order the steps in a QIIME2 16S amplicon analysis pipeline:",
            items: [
              "Beta diversity (UniFrac, Bray-Curtis) + ordination (PCoA)",
              "Import raw reads, demultiplex by barcode",
              "Taxonomic classification using trained classifier (SILVA, GreenGenes)",
              "Denoise with DADA2/Deblur → feature table (ASV × sample counts)",
            ],
            correctOrder: [1, 3, 2, 0],
            xpReward: 20,
          },
          {
            id: "l2-m11-n1-e6",
            type: "multiple-choice",
            question: "What is the 'compositional' nature of microbiome data and why does it matter statistically?",
            options: [
              "Microbiome data has many zeros, requiring zero-inflated models",
              "Read counts are relative (sum to constant sequencing depth) — increasing one taxon artificially decreases others, violating standard statistical assumptions",
              "Different bacteria have different genome sizes, biasing counts",
              "Microbiome samples have high batch effects between studies",
            ],
            correctIndex: 1,
            explanation: "Compositional data: relative (not absolute) abundances. If Taxon A increases in reality, all other taxa appear to decrease in relative abundance — a spurious negative correlation. Standard methods (Pearson, t-test) give wrong results. Solutions: ALDEx2, DESeq2, ANCOM-BC, or centered log-ratio (CLR) transformation before standard analyses.",
            xpReward: 15,
          },
          {
            id: "l2-m11-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are real research findings about the human gut microbiome:",
            options: [
              "Antibiotics cause significant and sometimes lasting changes in gut microbiome composition",
              "The gut microbiome influences obesity and metabolic syndrome",
              "Fecal microbiota transplantation (FMT) is effective for recurrent C. difficile infection",
              "All humans have identical core microbiome species",
              "The gut-brain axis allows microbiome to influence mood and behavior",
            ],
            correctIndices: [0, 1, 2, 4],
            explanation: "Antibiotics, obesity (Turnbaugh et al.), FMT for C. diff (FDA-approved), and gut-brain axis (through vagus nerve + metabolites) are all well-established. Each person has a unique microbiome — there is a 'core' of common functions but not identical species composition.",
            xpReward: 15,
          },
        ],
      },
      {
        id: "l2-m11-n2",
        moduleId: "l2-m11",
        title: "Metagenomics: Reading All the Genomes",
        description: "Shotgun sequencing of entire microbial communities",
        icon: "🌐",
        xpReward: 180,
        exercises: [
          {
            id: "l2-m11-n2-e1",
            type: "multiple-choice",
            question: "What is the key advantage of shotgun metagenomics over 16S amplicon sequencing?",
            options: [
              "It is cheaper and faster",
              "It sequences all DNA in the sample — resolving functional genes, metabolic pathways, and viral populations alongside bacteria",
              "It has better bacterial taxonomy resolution",
              "It requires less bioinformatics expertise",
            ],
            correctIndex: 1,
            explanation: "Shotgun metagenomics: sequence all DNA (bacterial, viral, fungal, archaeal, even host). Advantages over 16S: (1) functional profiling (genes, pathways, antibiotic resistance), (2) viral metagenomics (virome — invisible to 16S), (3) strain-level resolution, (4) de novo gene discovery. Disadvantages: much more expensive, complex data, dominated by host DNA in some samples.",
            xpReward: 10,
          },
          {
            id: "l2-m11-n2-e2",
            type: "drag-drop",
            question: "Match each metagenomics analysis step to its purpose:",
            pairs: [
              { left: "Host read removal (Bowtie2 + human genome)", right: "Remove contaminating human reads before microbial analysis" },
              { left: "Taxonomic profiling (Kraken2, MetaPhlAn4)", right: "Assign reads to known species using k-mer databases or marker genes" },
              { left: "Functional profiling (HUMAnN3)", right: "Map reads to gene families and metabolic pathways (KEGG, MetaCyc)" },
              { left: "MAG binning (MaxBin, MetaBAT)", right: "Reconstruct draft genomes of individual microorganisms from metagenome assembly" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m11-n2-e3",
            type: "code-complete",
            question: "Compute relative abundance from raw metagenomic read counts per species:",
            starterCode: `import pandas as pd

def compute_relative_abundance(read_counts):
    \"\"\"
    Convert raw read counts to relative abundances.
    read_counts: dict or Series mapping species -> read count
    Returns: Series with relative abundances summing to 1.0
    \"\"\"
    counts = pd.Series(read_counts)
    total = counts.sum()
    if total == 0:
        return counts
    return ___`,
            solution: `    return counts / total`,
            explanation: "Relative abundance normalizes for sequencing depth differences between samples. Note: this converts to compositional data (sums to 1), which has the statistical caveats discussed earlier. For differential abundance, use raw counts with DESeq2, ALDEx2, or ANCOM-BC which account for compositionality.",
            xpReward: 20,
          },
          {
            id: "l2-m11-n2-e4",
            type: "fill-blank",
            question: "Metagenome-assembled genomes (MAGs) are draft genomes reconstructed from metagenomes. Quality is assessed by completeness and _____ — ideally >90% complete and <5% contaminated.",
            blanks: [{ text: "contamination", answer: "contamination", position: 0 }],
            explanation: "MAG quality (CheckM2 standard): high-quality MAG = ≥90% complete + ≤5% contaminated. Completeness: what % of known single-copy marker genes are present. Contamination: what % of markers appear multiple times (from different genomes mixed in). Quality MAGs enable studying uncultured microbes with no reference genome.",
            xpReward: 10,
          },
          {
            id: "l2-m11-n2-e5",
            type: "sequence-order",
            question: "Order steps in a metagenome-assembled genome (MAG) recovery pipeline:",
            items: [
              "Bin contigs by co-abundance and tetranucleotide frequency → MAGs",
              "Quality check MAGs with CheckM2; taxonomically classify with GTDB-Tk",
              "Remove host reads; quality filter microbial reads",
              "Assemble metagenome (MEGAHIT, metaSPAdes) → contigs",
            ],
            correctOrder: [2, 3, 0, 1],
            xpReward: 20,
          },
          {
            id: "l2-m11-n2-e6",
            type: "tap-correct",
            question: "Tap ALL that are applications of metagenomics beyond the gut microbiome:",
            options: [
              "Ocean microbiome (Tara Oceans project)",
              "Antibiotic resistance gene surveillance in wastewater",
              "Soil microbiome for agriculture and carbon cycling",
              "Ancient DNA from archaeological sites",
              "Clinical metagenomics for pathogen detection",
            ],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "All five are real metagenomics applications: Tara Oceans sequenced ocean microbes globally; wastewater surveillance for AMR genes; soil metagenomics for nitrogen cycling and biofuel; ancient metagenomics from Neanderthal remains and medieval plague; clinical metagenomics (IDseq, Karius) for undiagnosed infections.",
            xpReward: 15,
          },
          {
            id: "l2-m11-n2-e7",
            type: "free-text",
            question: "Explain the dark matter of microbiology — what we don't know about uncultured microbes and how metagenomics addresses it.",
            rubric: ["unculturable", "culture", "plate", "dark matter", "MAG", "novel", "phylogenetic", "tree of life"],
            minKeywords: 3,
            explanation: "The 'great plate count anomaly': only ~1% of microbes visible under microscope will grow on standard culture media. The other 99% — the 'microbial dark matter' — includes entire phyla with no cultured representatives (e.g., CPR bacteria, DPANN archaea). Metagenomics recovers their DNA from environmental samples without culturing, revealing the true diversity of life. This has expanded the tree of life by ~40 new phyla in recent years — entirely through genomics.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m12",
    title: "Network Biology & Systems Genomics",
    description: "Genes don't work alone — understanding interaction networks",
    realm: 2,
    color: "#a855f7",
    nodes: [
      {
        id: "l2-m12-n1",
        moduleId: "l2-m12",
        title: "Gene Regulatory Networks",
        description: "Who regulates whom — and how to infer it from data",
        icon: "🕸️",
        xpReward: 175,
        exercises: [
          {
            id: "l2-m12-n1-e1",
            type: "multiple-choice",
            question: "What is a gene regulatory network (GRN)?",
            options: [
              "The physical proximity of genes in the genome",
              "A graph where nodes are genes/proteins and edges represent regulatory interactions (TF → target gene)",
              "The set of all genes expressed in a cell type",
              "A diagram of metabolic pathways",
            ],
            correctIndex: 1,
            explanation: "A GRN is a directed graph: transcription factors (TFs) bind to promoters/enhancers to regulate target gene expression. Edges typically represent 'TF activates/represses target.' GRNs control cell fate decisions, developmental programs, and responses to stimuli — and their disruption drives cancer and disease.",
            xpReward: 10,
          },
          {
            id: "l2-m12-n1-e2",
            type: "drag-drop",
            question: "Match each network property to its biological meaning:",
            pairs: [
              { left: "Hub node (high degree)", right: "Gene with many interaction partners — often essential; TFs like CTCF, TP53" },
              { left: "Scale-free topology", right: "Few hubs, many low-degree nodes — follows power law distribution; robust but fragile" },
              { left: "Network motif (e.g., FFL)", right: "Recurring sub-graph pattern — Feed-Forward Loop filters noise and generates delays" },
              { left: "Strongly connected component", right: "Set of nodes all mutually reachable — often feedback loops in regulatory networks" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m12-n1-e3",
            type: "code-complete",
            question: "Build a simple directed gene regulatory network using networkx and find all transcription factors (nodes with outgoing edges to 3+ targets):",
            starterCode: `import networkx as nx

def build_grn_and_find_tfs(edges, min_targets=3):
    \"\"\"
    edges: list of (regulator, target) tuples
    Returns: (GRN DiGraph, list of transcription factor names)
    \"\"\"
    grn = nx.DiGraph()
    grn.add_edges_from(edges)

    # Find nodes with >= min_targets outgoing edges (potential TFs)
    tfs = ___

    return grn, tfs`,
            solution: `    tfs = [node for node, degree in grn.out_degree() if degree >= min_targets]`,
            explanation: "Out-degree in a directed network = number of targets a regulator controls. High out-degree nodes are candidate master regulators (TFs). This is a simplified heuristic — real TF identification uses ChIP-seq data, motif analysis, and gene expression perturbation experiments.",
            xpReward: 25,
          },
          {
            id: "l2-m12-n1-e4",
            type: "fill-blank",
            question: "WGCNA (Weighted Gene Co-expression Network Analysis) groups genes into _____ based on correlated expression patterns across samples — useful for identifying gene modules associated with clinical traits.",
            blanks: [{ text: "modules", answer: "modules", position: 0 }],
            explanation: "WGCNA modules: clusters of co-expressed genes (often in the same pathway or regulated by the same TF). Each module is represented by an eigengene (first PC of module expression). Module-trait correlations identify which modules (and thus which pathways) are associated with disease severity, treatment response, etc.",
            xpReward: 10,
          },
          {
            id: "l2-m12-n1-e5",
            type: "sequence-order",
            question: "Order the steps in GRN inference from scRNA-seq data using SCENIC:",
            items: [
              "Prune co-expression modules using TF motif analysis (RcisTarget) → regulons",
              "Score regulon activity per cell (AUCell) → cell-type-specific GRNs",
              "Identify co-expression modules: find target genes correlated with each TF (GENIE3/GRNBoost2)",
              "Start with normalized scRNA-seq expression matrix",
            ],
            correctOrder: [3, 2, 0, 1],
            xpReward: 20,
          },
          {
            id: "l2-m12-n1-e6",
            type: "tap-correct",
            question: "Tap ALL that are experimental methods for validating predicted gene regulatory interactions:",
            options: [
              "ChIP-seq (TF binding to target promoters)",
              "Reporter gene assay (TF drives GFP expression)",
              "CRISPRi knockdown of TF → measure target expression change",
              "Co-immunoprecipitation (protein-protein interaction)",
              "RNA-seq",
            ],
            correctIndices: [0, 1, 2, 3],
            explanation: "ChIP-seq (direct TF binding evidence), reporter assays (functional activation), CRISPRi (perturbation — gold standard for causality), and Co-IP (if TF forms complex with regulator) all validate interactions. RNA-seq alone only measures correlation — it's how you infer the network, not validate specific edges.",
            xpReward: 15,
          },
          {
            id: "l2-m12-n1-e7",
            type: "free-text",
            question: "Explain why network 'hubs' in gene regulatory networks are often essential genes, and why this has implications for cancer biology.",
            rubric: ["hub", "essential", "degree", "cancer", "oncogene", "master regulator", "vulnerability", "targeted therapy"],
            minKeywords: 3,
            explanation: "Hubs (high-degree nodes in GRNs) control many downstream genes. Disruption = global disruption of the network. In development, master TF hubs (OCT4, SOX2, NANOG) are essential. In cancer, oncogenic TF hubs (MYC, TP53, KRAS pathway targets) are often amplified/mutated. Cancer cells are 'addicted' to these oncogenic hubs ('oncogene addiction') — they rely on them so heavily that targeted inhibition is selectively toxic to cancer but not normal cells. This is the rationale for targeted therapies (e.g., KRAS G12C inhibitors).",
            xpReward: 20,
          },
        ],
      },
    ],
  },
];

export default level2BonusModules;
