import type { Module } from "@/lib/types";

const level2Modules: Module[] = [
  {
    id: "l2-m1",
    title: "Genomics: The Genome as a Dataset",
    description: "Reference genomes, annotation, and biological databases",
    realm: 2,
    color: "#52b788",
    nodes: [
      {
        id: "l2-m1-n1",
        moduleId: "l2-m1",
        title: "What Is a Genome?",
        description: "Scale, complexity, and the genome paradox",
        icon: "🌍",
        xpReward: 150,
        exercises: [
          {
            id: "l2-m1-n1-e1",
            type: "multiple-choice",
            question: "The 'C-value paradox' (or genome size paradox) refers to the fact that:",
            options: [
              "Larger organisms always have larger genomes",
              "Genome size does not correlate well with organismal complexity",
              "Coding genes take up most of the genome",
              "All genomes have the same number of chromosomes",
            ],
            correctIndex: 1,
            explanation: "Onions have 5x more DNA than humans. Salamanders have 10x more. Genome size and gene count are poorly correlated with complexity — much of the extra DNA is repetitive sequences.",
            xpReward: 15,
          },
          {
            id: "l2-m1-n1-e2",
            type: "drag-drop",
            question: "Match the organism to its approximate genome size:",
            pairs: [
              { left: "E. coli (bacteria)", right: "4.6 Mb (megabases)" },
              { left: "Yeast (S. cerevisiae)", right: "12 Mb" },
              { left: "Human", right: "3,200 Mb (3.2 Gb)" },
              { left: "Onion (Allium cepa)", right: "~16,000 Mb (~16 Gb)" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m1-n1-e3",
            type: "multiple-choice",
            question: "A reference genome is best described as:",
            options: [
              "The genome of a specific individual used as a universal standard",
              "A representative composite genome assembled from multiple individuals of a species",
              "The first genome ever sequenced",
              "A perfectly error-free genome sequence",
            ],
            correctIndex: 1,
            explanation: "Reference genomes are assembled from multiple individuals to create a representative consensus. They're not perfect and are continuously improved (e.g., GRCh38 → T2T-CHM13).",
            xpReward: 15,
          },
          {
            id: "l2-m1-n1-e4",
            type: "matching",
            question: "Match each database to what it stores:",
            pairs: [
              { left: "NCBI GenBank", right: "Nucleotide sequences from all organisms" },
              { left: "Ensembl", right: "Annotated vertebrate and invertebrate genomes" },
              { left: "UniProt", right: "Protein sequences and functional annotation" },
              { left: "PDB", right: "3D protein and nucleic acid structures" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m1-n1-e5",
            type: "free-text",
            question: "Ben says your genome is like a '3.2-billion-character text file.' Extend this analogy: what would 'ctrl+F' be? What would 'search and replace' be? What would a 'bug in the document' be?",
            rubric: ["ctrl+F analogy is biologically meaningful (BLAST, sequence search)", "search/replace is reasonable (gene editing, CRISPR)", "bug analogy is reasonable (mutation)"],
            xpReward: 30,
          },
        ],
      },
      {
        id: "l2-m1-n2",
        moduleId: "l2-m1",
        title: "Biopython Fundamentals",
        description: "Parsing FASTA, GenBank, and working with SeqRecord",
        icon: "🐍",
        xpReward: 160,
        exercises: [
          {
            id: "l2-m1-n2-e1",
            type: "code-complete",
            question: "Import Biopython's SeqIO to parse sequences:",
            codeTemplate: `from Bio import ___

records = list(SeqIO.parse("sequences.fasta", "fasta"))
print(f"Found {len(records)} sequences")
print(f"First ID: {records[0].id}")`,
            codeAnswer: "from Bio import SeqIO",
            xpReward: 15,
          },
          {
            id: "l2-m1-n2-e2",
            type: "multiple-choice",
            question: "In Biopython, a SeqRecord object contains:",
            options: [
              "Only the raw sequence string",
              "The sequence (Seq object), ID, name, description, and annotations",
              "The sequence and quality scores only",
              "A file path to the sequence",
            ],
            correctIndex: 1,
            explanation: "SeqRecord bundles the sequence with its metadata — ID, name, description, features, dbxrefs, and arbitrary annotations.",
            xpReward: 15,
          },
          {
            id: "l2-m1-n2-e3",
            type: "code-complete",
            question: "Write code to get the reverse complement of a sequence using Biopython:",
            codeTemplate: `from Bio.Seq import Seq

sequence = Seq("ATCGATCG")
rev_comp = sequence.___()
print(rev_comp)  # CGATCGAT`,
            codeAnswer: "rev_comp = sequence.reverse_complement()",
            xpReward: 15,
          },
          {
            id: "l2-m1-n2-e4",
            type: "code-complete",
            question: "Translate a DNA sequence to protein using Biopython:",
            codeTemplate: `from Bio.Seq import Seq

dna = Seq("ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG")
protein = dna.___()
print(protein)`,
            codeAnswer: "protein = dna.translate()",
            xpReward: 15,
          },
          {
            id: "l2-m1-n2-e5",
            type: "debug-code",
            question: "Fix this Biopython parsing code:",
            codeTemplate: `from Bio import SeqIO

for record in SeqIO.parse("genes.fasta"):
    print(record.id, len(record.seq))`,
            bugLine: 2,
            bugFix: 'for record in SeqIO.parse("genes.fasta", "fasta"):',
            explanation: "SeqIO.parse() requires TWO arguments: the filename AND the format string ('fasta', 'genbank', 'fastq', etc.).",
            xpReward: 20,
          },
          {
            id: "l2-m1-n2-e6",
            type: "free-text",
            question: "You have 10,000 FASTA sequences and need to find all sequences over 1000 bp and write them to a new file. Write pseudocode (or real Python) to accomplish this.",
            rubric: ["uses SeqIO.parse to read", "filters by sequence length", "writes results to file (ideally SeqIO.write)"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m2",
    title: "Sequence Analysis",
    description: "Alignment, BLAST, and phylogenetics",
    realm: 2,
    color: "#f59e0b",
    nodes: [
      {
        id: "l2-m2-n1",
        moduleId: "l2-m2",
        title: "Sequence Alignment",
        description: "Smith-Waterman vs. Needleman-Wunsch",
        icon: "🔗",
        xpReward: 170,
        exercises: [
          {
            id: "l2-m2-n1-e1",
            type: "multiple-choice",
            question: "What is sequence alignment?",
            options: [
              "Sorting sequences by length",
              "Finding the best correspondence between characters in two or more sequences",
              "Translating sequences from DNA to protein",
              "Visualizing sequences on a chromosome map",
            ],
            correctIndex: 1,
            explanation: "Alignment identifies which positions in two sequences correspond to each other, accounting for mutations, insertions, and deletions (gaps).",
            xpReward: 10,
          },
          {
            id: "l2-m2-n1-e2",
            type: "drag-drop",
            question: "Match the algorithm to its purpose:",
            pairs: [
              { left: "Needleman-Wunsch", right: "Global alignment — aligns the ENTIRE length of both sequences" },
              { left: "Smith-Waterman", right: "Local alignment — finds the best matching REGION" },
              { left: "BLAST", right: "Fast heuristic search — finds similar sequences in a database quickly" },
              { left: "ClustalW / MUSCLE", right: "Multiple sequence alignment — aligns 3+ sequences simultaneously" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m2-n1-e3",
            type: "multiple-choice",
            question: "In alignment, what is a 'gap penalty'?",
            options: [
              "A limit on how many gaps are allowed",
              "A score reduction applied for inserting gaps in the alignment",
              "The space between two sequences in the output",
              "An error in the sequencing data",
            ],
            correctIndex: 1,
            explanation: "Gap penalties discourage excessive gaps. Opening a gap costs more than extending one (affine gap penalties). This models real biology: insertions/deletions are rarer than they'd be without penalty.",
            xpReward: 15,
          },
          {
            id: "l2-m2-n1-e4",
            type: "multiple-choice",
            question: "When would you use LOCAL alignment (Smith-Waterman) over GLOBAL alignment?",
            options: [
              "When comparing two full-length genes of similar size",
              "When comparing chromosomes from two species",
              "When looking for a specific domain within a larger protein or finding a short query in a long genome",
              "When sequences are identical",
            ],
            correctIndex: 2,
            explanation: "Local alignment excels for finding conserved domains, motifs, or short queries within long sequences — the aligned region can be much smaller than the full sequences.",
            xpReward: 15,
          },
          {
            id: "l2-m2-n1-e5",
            type: "free-text",
            question: "Ben says he has 'beef with BLAST' but won't fully explain. You don't need to explain Ben's beef. Instead: explain what BLAST does and why it's faster than a true dynamic programming alignment, and what the tradeoff is.",
            rubric: ["explains BLAST uses heuristics (seeds, hits, extensions)", "correctly identifies speed tradeoff (not guaranteed optimal)", "mentions E-value or statistical significance"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m3",
    title: "RNA-seq from the Ground Up",
    description: "Transcriptomics: measuring gene expression",
    realm: 2,
    color: "#ec4899",
    nodes: [
      {
        id: "l2-m3-n1",
        moduleId: "l2-m3",
        title: "The RNA-seq Pipeline",
        description: "From raw reads to expression counts",
        icon: "📊",
        xpReward: 180,
        exercises: [
          {
            id: "l2-m3-n1-e1",
            type: "sequence-order",
            question: "Put the RNA-seq analysis pipeline in correct order:",
            items: [
              "Extract RNA from cells",
              "Sequence with next-gen sequencer",
              "Quality control (FastQC)",
              "Align reads to reference genome (STAR/HISAT2)",
              "Count reads per gene (featureCounts/HTSeq)",
              "Normalize counts",
              "Differential expression analysis (DESeq2/edgeR)",
              "Biological interpretation",
            ],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            xpReward: 25,
          },
          {
            id: "l2-m3-n1-e2",
            type: "multiple-choice",
            question: "What is a 'read' in RNA-seq?",
            options: [
              "A gene being actively transcribed",
              "A short DNA sequence produced by the sequencer from a cDNA fragment",
              "A count of how many times a gene is expressed",
              "An alignment of two sequences",
            ],
            correctIndex: 1,
            explanation: "Sequencers read short fragments (50-300 bp) from cDNA (reverse-transcribed RNA). These reads are then mapped back to the genome to count gene expression.",
            xpReward: 15,
          },
          {
            id: "l2-m3-n1-e3",
            type: "multiple-choice",
            question: "Why must raw read counts be normalized before comparing samples?",
            options: [
              "Sequencers make random errors",
              "Samples may have different sequencing depth and gene lengths affect count numbers",
              "Genes are expressed in different cells",
              "RNA degrades differently in different samples",
            ],
            correctIndex: 1,
            explanation: "A gene might have more reads because it's longer (more fragments) or because more RNA was sequenced overall (depth). Normalization (RPKM, TPM, or DESeq2's internal method) corrects for this.",
            xpReward: 15,
          },
          {
            id: "l2-m3-n1-e4",
            type: "drag-drop",
            question: "Match the normalization method to what it corrects for:",
            pairs: [
              { left: "RPM / CPM", right: "Sequencing depth only" },
              { left: "RPKM / FPKM", right: "Sequencing depth AND gene length" },
              { left: "TPM", right: "Sequencing depth AND gene length (more comparable across samples)" },
              { left: "DESeq2 size factors", right: "Library composition differences using median-of-ratios" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m3-n1-e5",
            type: "multiple-choice",
            question: "A gene has a fold change of 4 and adjusted p-value of 0.001 when comparing tumor vs. normal. This means:",
            options: [
              "The gene is 4 times more expressed in tumor with 99.9% confidence",
              "The gene's expression doubled twice in tumor, and this difference is statistically significant",
              "The gene has 4 mutations in tumor cells",
              "The gene is expressed in 4% of tumor cells",
            ],
            correctIndex: 1,
            explanation: "Fold change of 4 means the gene has 4x more expression in tumor vs. normal. Adjusted p-value < 0.05 means the difference is unlikely due to chance (after correcting for multiple testing).",
            xpReward: 15,
          },
          {
            id: "l2-m3-n1-e6",
            type: "free-text",
            question: "A volcano plot shows -log10(p-value) on the Y axis and log2(fold change) on the X axis. Describe where you would look on this plot to find genes that are STRONGLY and SIGNIFICANTLY upregulated.",
            rubric: ["upper right quadrant", "high on y-axis (significant)", "right on x-axis (upregulated)", "mentions both conditions simultaneously"],
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m4",
    title: "pandas Deep Dive",
    description: "Working with expression data as DataFrames",
    realm: 2,
    color: "#06b6d4",
    nodes: [
      {
        id: "l2-m4-n1",
        moduleId: "l2-m4",
        title: "DataFrames as Expression Matrices",
        description: "Indexing, filtering, and slicing biological data",
        icon: "🗂️",
        xpReward: 170,
        exercises: [
          {
            id: "l2-m4-n1-e1",
            type: "code-complete",
            question: "Load an expression matrix CSV into a DataFrame:",
            codeTemplate: `import ___ as pd

expr = pd.read_csv("expression_matrix.csv", index_col=0)
print(expr.shape)  # (genes, samples)
print(expr.head())`,
            codeAnswer: "import pandas as pd",
            xpReward: 10,
          },
          {
            id: "l2-m4-n1-e2",
            type: "code-complete",
            question: "Filter to keep only rows (genes) where mean expression > 10:",
            codeTemplate: `import pandas as pd
expr = pd.DataFrame({'sample1': [5, 20, 2, 15], 'sample2': [8, 25, 1, 12]},
                    index=['GeneA','GeneB','GeneC','GeneD'])

high_expr = expr[expr.___(axis=1) > 10]
print(high_expr)`,
            codeAnswer: "high_expr = expr[expr.mean(axis=1) > 10]",
            xpReward: 20,
          },
          {
            id: "l2-m4-n1-e3",
            type: "multiple-choice",
            question: "In pandas, what is the difference between `.loc[]` and `.iloc[]`?",
            options: [
              "loc is faster; iloc is more accurate",
              "loc selects by LABEL (name); iloc selects by INTEGER position (index number)",
              "loc works on rows; iloc works on columns",
              "They are identical",
            ],
            correctIndex: 1,
            explanation: "`.loc['BRCA1']` selects the row named 'BRCA1'. `.iloc[0]` selects the first row (position 0). Use loc for named access, iloc for positional.",
            xpReward: 15,
          },
          {
            id: "l2-m4-n1-e4",
            type: "code-complete",
            question: "Use groupby to calculate mean expression per cell type:",
            codeTemplate: `import pandas as pd

# metadata has 'cell_type' and 'sample' columns
# expr has genes as rows, samples as columns

# Transpose so samples are rows, then merge with metadata
expr_T = expr.T
merged = expr_T.merge(metadata[['cell_type']], left_index=True, right_index=True)

mean_by_type = merged.groupby('cell_type').___()
print(mean_by_type)`,
            codeAnswer: "mean_by_type = merged.groupby('cell_type').mean()",
            xpReward: 20,
          },
          {
            id: "l2-m4-n1-e5",
            type: "debug-code",
            question: "Fix this merge operation (gene expression + gene annotations):",
            codeTemplate: `import pandas as pd

expr = pd.read_csv("expression.csv", index_col=0)
annotations = pd.read_csv("gene_annotations.csv")

# Both DataFrames have 'gene_id' as a column in annotations,
# and it's the index in expr
merged = pd.merge(expr, annotations, left_on="gene_id", right_on="gene_id")`,
            bugLine: 6,
            bugFix: 'merged = pd.merge(expr.reset_index(), annotations, left_on="index", right_on="gene_id")',
            explanation: "When one DataFrame has the key as its index (not a column), you need to reset_index() or use left_index=True in the merge call.",
            xpReward: 25,
          },
          {
            id: "l2-m4-n1-e6",
            type: "free-text",
            question: "Describe the concept of 'tidy data' and explain why expression matrices (genes × samples) are often NOT in tidy format, and what tidy format would look like for this data.",
            rubric: ["tidy = one row per observation", "expression matrix is wide not long", "tidy version would have gene, sample, expression as 3 columns"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m5",
    title: "Statistics for Biology",
    description: "From p-values to multiple testing correction",
    realm: 2,
    color: "#a855f7",
    nodes: [
      {
        id: "l2-m5-n1",
        moduleId: "l2-m5",
        title: "Hypothesis Testing",
        description: "t-tests, Mann-Whitney, and when to use which",
        icon: "📐",
        xpReward: 180,
        exercises: [
          {
            id: "l2-m5-n1-e1",
            type: "multiple-choice",
            question: "What does a p-value of 0.03 mean?",
            options: [
              "There is a 3% chance the null hypothesis is true",
              "There is a 97% chance the alternative hypothesis is true",
              "IF the null hypothesis were true, we'd see this result (or more extreme) ~3% of the time by chance",
              "The effect size is 3%",
            ],
            correctIndex: 2,
            explanation: "P-value = P(data | H₀). It's the probability of observing this result assuming no effect. It does NOT give the probability that H₀ is true or false.",
            xpReward: 15,
          },
          {
            id: "l2-m5-n1-e2",
            type: "drag-drop",
            question: "Match the statistical test to its use case:",
            pairs: [
              { left: "Student's t-test", right: "Compare means of 2 groups — normally distributed data, equal variance" },
              { left: "Mann-Whitney U", right: "Non-parametric alternative to t-test — no normality assumption" },
              { left: "ANOVA", right: "Compare means of 3+ groups simultaneously" },
              { left: "Chi-squared test", right: "Test association between categorical variables" },
            ],
            xpReward: 20,
          },
          {
            id: "l2-m5-n1-e3",
            type: "multiple-choice",
            question: "Why is multiple testing correction needed in genomics (e.g., RNA-seq comparing 20,000 genes)?",
            options: [
              "Genomic data is always noisy",
              "At p < 0.05, we'd expect ~1,000 false positives by chance alone (5% × 20,000)",
              "The sequencer makes 5% errors",
              "We need more than 5% power",
            ],
            correctIndex: 1,
            explanation: "If you test 20,000 genes at α=0.05, you expect 1,000 false positives even if NO genes are truly different. Multiple testing correction (Bonferroni or BH/FDR) controls this.",
            xpReward: 15,
          },
          {
            id: "l2-m5-n1-e4",
            type: "multiple-choice",
            question: "Which multiple testing correction is less conservative and commonly used in genomics?",
            options: [
              "Bonferroni correction",
              "Sidak correction",
              "Benjamini-Hochberg (FDR correction)",
              "Holm-Bonferroni",
            ],
            correctIndex: 2,
            explanation: "BH/FDR controls the False Discovery Rate rather than the family-wise error rate. It's less conservative than Bonferroni and better suited for large-scale genomic analyses.",
            xpReward: 15,
          },
          {
            id: "l2-m5-n1-e5",
            type: "code-complete",
            question: "Perform a t-test between two groups of gene expression values:",
            codeTemplate: `from scipy import stats
import numpy as np

tumor = np.array([15.2, 18.3, 22.1, 19.4, 16.8])
normal = np.array([8.1, 9.3, 7.5, 10.2, 8.9])

t_stat, p_value = stats.ttest_ind(___, ___)
print(f"t={t_stat:.3f}, p={p_value:.4f}")`,
            codeAnswer: "t_stat, p_value = stats.ttest_ind(tumor, normal)",
            xpReward: 20,
          },
          {
            id: "l2-m5-n1-e6",
            type: "free-text",
            question: "A paper reports p=0.04 for a finding but does NOT mention multiple testing correction. The study tested 500 candidate genes. Should you trust this result? Explain your reasoning using statistics.",
            rubric: ["calculates expected false positives (0.04 × 500 = 20)", "questions absence of correction", "recommends looking for corrected p-values or replication"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
  {
    id: "l2-m6",
    title: "Visualization",
    description: "Telling stories with biological data",
    realm: 2,
    color: "#f59e0b",
    nodes: [
      {
        id: "l2-m6-n1",
        moduleId: "l2-m6",
        title: "matplotlib & seaborn",
        description: "Heatmaps, volcano plots, and publication-ready figures",
        icon: "📈",
        xpReward: 160,
        exercises: [
          {
            id: "l2-m6-n1-e1",
            type: "code-complete",
            question: "Create a basic expression heatmap with seaborn:",
            codeTemplate: `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# expression_df: rows=genes, cols=samples
expression_df = pd.DataFrame(np.random.randn(10, 5),
                              index=[f'Gene{i}' for i in range(10)],
                              columns=['S1','S2','S3','S4','S5'])

sns.___(expression_df, cmap='RdBu_r', center=0)
plt.title("Gene Expression Heatmap")
plt.tight_layout()
plt.show()`,
            codeAnswer: "sns.heatmap(expression_df, cmap='RdBu_r', center=0)",
            xpReward: 20,
          },
          {
            id: "l2-m6-n1-e2",
            type: "multiple-choice",
            question: "In a volcano plot, what do points in the UPPER RIGHT represent?",
            options: [
              "Genes with no significant change",
              "Genes that are significantly DOWNREGULATED",
              "Genes that are significantly UPREGULATED (high fold change, low p-value)",
              "Genes with high variance",
            ],
            correctIndex: 2,
            explanation: "Upper right = high log2(fold change) AND low adjusted p-value (high -log10(p)). These are your most strongly and significantly upregulated genes.",
            xpReward: 15,
          },
          {
            id: "l2-m6-n1-e3",
            type: "code-complete",
            question: "Create a volcano plot from DESeq2 results:",
            codeTemplate: `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

results = pd.DataFrame({
    'log2FC': np.random.normal(0, 2, 1000),
    'padj': np.random.uniform(0, 1, 1000)
})

# Calculate -log10(padj)
results['neglog10p'] = -np.log10(results['padj'] + 1e-300)

plt.figure(figsize=(8, 6))
plt.scatter(results['log2FC'], results['neglog10p'], alpha=0.5, s=10, color='gray')

# Highlight significant genes (padj < 0.05 and |log2FC| > 1)
sig = results[(results['padj'] < 0.05) & (results['log2FC'].abs() > ___)]
plt.scatter(sig['log2FC'], sig['neglog10p'], alpha=0.7, s=10, color='red')

plt.axhline(-np.log10(0.05), color='blue', linestyle='--', alpha=0.5)
plt.axvline(-1, color='gray', linestyle='--', alpha=0.3)
plt.axvline(1, color='gray', linestyle='--', alpha=0.3)
plt.xlabel("log2(Fold Change)")
plt.ylabel("-log10(adjusted p-value)")
plt.title("Volcano Plot")
plt.show()`,
            codeAnswer: "sig = results[(results['padj'] < 0.05) & (results['log2FC'].abs() > 1)]",
            xpReward: 25,
          },
          {
            id: "l2-m6-n1-e4",
            type: "multiple-choice",
            question: "A PCA plot shows PC1 explains 45% of variance and PC2 explains 20%. Two groups of samples separate cleanly along PC1. What does this suggest?",
            options: [
              "The groups are not different",
              "The major source of variation in the data separates your two groups — they are gene-expression-distinct",
              "45% of genes are differentially expressed",
              "The data quality is poor",
            ],
            correctIndex: 1,
            explanation: "PC1 captures the largest source of variation. If your groups separate on PC1, the biological difference between them is the dominant signal in the transcriptome.",
            xpReward: 15,
          },
          {
            id: "l2-m6-n1-e5",
            type: "free-text",
            question: "When would you use a PCA plot vs. a UMAP? Describe the key philosophical difference between them and when each is appropriate.",
            rubric: ["PCA is linear, interpretable, preserves global structure", "UMAP is non-linear, preserves local structure, better for single-cell", "appropriate use cases mentioned"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
];

export default level2Modules;
