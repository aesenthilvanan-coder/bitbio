import type { Module } from "@/lib/types";

const level1BonusModules: Module[] = [
  {
    id: "l1-m10",
    title: "Enzymes: Life's Catalysts",
    description: "How proteins speed up reactions by billions — without being consumed",
    realm: 1,
    color: "#00ff88",
    nodes: [
      {
        id: "l1-m10-n1",
        moduleId: "l1-m10",
        title: "Enzyme Kinetics",
        description: "Michaelis-Menten, Km, Vmax, and catalytic efficiency",
        icon: "⚗️",
        xpReward: 125,
        exercises: [
          {
            id: "l1-m10-n1-e1",
            type: "multiple-choice",
            question: "What is an enzyme's active site?",
            options: [
              "The entire surface of the enzyme",
              "The specific region where substrate binds and the reaction is catalyzed",
              "The region that binds allosteric regulators",
              "The signal peptide that directs the enzyme to the correct compartment",
            ],
            correctIndex: 1,
            explanation: "The active site is a precisely shaped pocket or cleft in the enzyme — usually 10-20 amino acids — that binds substrate via complementary shape, charge, and hydrophobicity. Induced fit: the enzyme changes shape slightly upon substrate binding, improving the fit.",
            xpReward: 10,
          },
          {
            id: "l1-m10-n1-e2",
            type: "fill-blank",
            question: "In the Michaelis-Menten equation, Km is the substrate concentration at which the reaction proceeds at _____% of Vmax.",
            blanks: [{ text: "50", answer: "50", position: 0 }],
            explanation: "Km (Michaelis constant) = [S] when v = Vmax/2. A low Km means the enzyme reaches half-max velocity at low substrate concentration — it has high affinity for its substrate. Km is roughly the enzyme-substrate binding affinity (Kd).",
            xpReward: 10,
          },
          {
            id: "l1-m10-n1-e3",
            type: "code-complete",
            question: "Implement the Michaelis-Menten equation to model reaction rate vs substrate concentration:",
            starterCode: `def michaelis_menten(substrate_conc, vmax, km):
    \"\"\"
    Calculate reaction velocity given substrate concentration.
    v = Vmax * [S] / (Km + [S])
    \"\"\"
    return ___`,
            solution: `    return (vmax * substrate_conc) / (km + substrate_conc)`,
            explanation: "The MM equation is foundational to enzyme kinetics. At [S] << Km: v ≈ (Vmax/Km)*[S] — first order. At [S] >> Km: v ≈ Vmax — zero order (enzyme saturated). The kcat/Km ratio = catalytic efficiency.",
            xpReward: 20,
          },
          {
            id: "l1-m10-n1-e4",
            type: "drag-drop",
            question: "Match each enzyme inhibition type to its mechanism:",
            pairs: [
              { left: "Competitive inhibition", right: "Inhibitor resembles substrate — competes for active site; increase [S] overcomes it" },
              { left: "Noncompetitive inhibition", right: "Binds allosteric site — reduces Vmax but doesn't affect Km; can't overcome with [S]" },
              { left: "Uncompetitive inhibition", right: "Only binds enzyme-substrate complex — reduces both Km and Vmax" },
              { left: "Irreversible inhibition", right: "Covalently modifies active site — permanently inactivates enzyme (e.g., aspirin, nerve agents)" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m10-n1-e5",
            type: "multiple-choice",
            question: "Catalase converts H₂O₂ → H₂O + O₂ at a rate of ~40 million reactions/second. What does this tell you about its kcat?",
            options: [
              "kcat ≈ 40 s⁻¹",
              "kcat ≈ 40,000 s⁻¹",
              "kcat ≈ 40,000,000 s⁻¹",
              "kcat = 1 (it's saturated)",
            ],
            correctIndex: 2,
            explanation: "kcat (turnover number) = reactions per second per enzyme molecule when fully saturated. Catalase has kcat ≈ 4×10⁷ s⁻¹ — one of the fastest known enzymes. It's so fast because H₂O₂ is a toxic radical: cells needed an extremely efficient detoxifying enzyme.",
            xpReward: 10,
          },
          {
            id: "l1-m10-n1-e6",
            type: "sequence-order",
            question: "Order the events in an enzymatic reaction according to the induced fit model:",
            items: [
              "Product released; enzyme returns to original conformation",
              "Substrate binds loosely to active site",
              "Enzyme undergoes conformational change to grip substrate tightly",
              "Reaction occurs: substrate converted to product",
            ],
            correctOrder: [1, 2, 3, 0],
            xpReward: 15,
          },
          {
            id: "l1-m10-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are factors affecting enzyme activity:",
            options: ["Temperature", "pH", "Substrate concentration", "Cofactor availability", "Salt concentration", "Oxygen tension (for non-redox enzymes)"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "Temperature (up to optimum, then denaturation), pH (active site ionization states), [S] (saturation kinetics), cofactors (many enzymes need metals or vitamins), and salt concentration (affects protein structure and charge) all affect enzyme activity. Oxygen tension only matters for oxidases/oxygenases.",
            xpReward: 15,
          },
        ],
      },
      {
        id: "l1-m10-n2",
        moduleId: "l1-m10",
        title: "Regulation of Enzyme Activity",
        description: "Allosteric control, feedback inhibition, and zymogen activation",
        icon: "🎛️",
        xpReward: 130,
        exercises: [
          {
            id: "l1-m10-n2-e1",
            type: "multiple-choice",
            question: "What is allosteric regulation?",
            options: [
              "Enzyme regulation by direct modification of the active site",
              "Regulation by a molecule binding to a site other than the active site, changing enzyme shape and activity",
              "Regulation only by feedback inhibition",
              "Regulation by gene expression changes",
            ],
            correctIndex: 1,
            explanation: "Allosteric (Greek: 'other site') regulation: an effector molecule binds to a site distinct from the active site, causing a conformational change that either activates or inhibits the enzyme. Key advantage: allows fast, reversible regulation without changing gene expression.",
            xpReward: 10,
          },
          {
            id: "l1-m10-n2-e2",
            type: "fill-blank",
            question: "In a biosynthetic pathway, the end product inhibiting the first enzyme in the pathway is called _____ inhibition.",
            blanks: [{ text: "feedback", answer: "feedback", position: 0 }],
            explanation: "Feedback inhibition (negative feedback): the final product of a pathway allosterically inhibits the first enzyme. This elegantly prevents overproduction. Classic example: isoleucine inhibits threonine deaminase (first enzyme in its own biosynthetic pathway) in E. coli.",
            xpReward: 10,
          },
          {
            id: "l1-m10-n2-e3",
            type: "drag-drop",
            question: "Match each regulatory mechanism to its example:",
            pairs: [
              { left: "Zymogen activation", right: "Trypsinogen cleaved to trypsin in the small intestine — prevents autodigestion of the pancreas" },
              { left: "Covalent modification (phosphorylation)", right: "Glycogen phosphorylase activated by phosphorylation via PKA in response to adrenaline" },
              { left: "Allosteric activation", right: "AMP activates phosphofructokinase-1 — low energy → ramp up glycolysis" },
              { left: "Isoenzyme expression", right: "Hexokinase (low Km, saturable) vs. glucokinase (high Km, not saturable) — tissue-specific glucose sensing" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m10-n2-e4",
            type: "multiple-choice",
            question: "Aspirin (acetylsalicylate) irreversibly inhibits COX (cyclooxygenase) by acetylating a serine residue. Why is irreversible inhibition useful for a pain reliever?",
            options: [
              "It means you only need to take one dose ever",
              "Platelets (which make prostaglandins) can't make new COX — their effect is permanent until new platelets form (~8 days)",
              "It prevents the drug from entering cells",
              "It reduces the needed dose because the drug works faster",
            ],
            correctIndex: 1,
            explanation: "Platelets lack nuclei — they can't synthesize new proteins. When aspirin permanently inactivates COX in platelets, they can't make thromboxane A₂ (promotes clotting) for their entire 8-10 day lifespan. This is why aspirin is used for anti-platelet therapy (heart attack prevention) — one dose has lasting effects on platelets.",
            xpReward: 15,
          },
          {
            id: "l1-m10-n2-e5",
            type: "code-complete",
            question: "Simulate feedback inhibition in a simple pathway with 3 enzymes:",
            starterCode: `def simulate_pathway(initial_substrate, steps=20, feedback_threshold=10.0):
    \"\"\"
    Simple 3-enzyme pathway: A -> B -> C -> Product
    Product inhibits enzyme 1 when concentration exceeds threshold.
    Returns: list of [A, B, C, Product] concentrations at each step.
    \"\"\"
    A, B, C, P = initial_substrate, 0.0, 0.0, 0.0
    history = []

    for _ in range(steps):
        # Enzyme 1: A -> B. Inhibited by P above threshold.
        k1 = 0.3 if P < feedback_threshold else ___
        # Enzymes 2 and 3: normal kinetics
        k2, k3 = 0.4, 0.5

        dA = -k1 * A
        dB = k1 * A - k2 * B
        dC = k2 * B - k3 * C
        dP = k3 * C

        A, B, C, P = A+dA, B+dB, C+dC, P+dP
        history.append([A, B, C, P])

    return history`,
            solution: `        k1 = 0.05  # inhibited — much slower rate`,
            explanation: "When product P exceeds the threshold, enzyme 1's rate constant drops to 0.05 (6× slower). This mimics allosteric feedback inhibition — product buildup slows its own synthesis. A biologically elegant control system.",
            xpReward: 20,
          },
          {
            id: "l1-m10-n2-e6",
            type: "sequence-order",
            question: "Order the steps in the activation of the adrenaline signaling cascade that activates glycogen breakdown:",
            items: [
              "Phosphorylase kinase phosphorylates glycogen phosphorylase b → a (active)",
              "Adrenaline binds β-adrenergic receptor (GPCR)",
              "Glycogen phosphorylase cleaves glucose-1-phosphate from glycogen",
              "Adenylyl cyclase produces cAMP → PKA activated → phosphorylase kinase activated",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 15,
          },
          {
            id: "l1-m10-n2-e7",
            type: "tap-correct",
            question: "Tap ALL that are examples of post-translational modifications (PTMs) that regulate enzyme activity:",
            options: ["Phosphorylation", "Ubiquitination", "Acetylation", "Methylation", "SUMOylation", "Alternative splicing"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "Phosphorylation, ubiquitination, acetylation, methylation, and SUMOylation are all PTMs — chemical modifications added to proteins after translation. Alternative splicing occurs at the RNA level before translation, so it's not a PTM.",
            xpReward: 15,
          },
        ],
      },
      {
        id: "l1-m10-n3",
        moduleId: "l1-m10",
        title: "Enzyme Engineering",
        description: "Directed evolution, rational design, and the Rosetta suite",
        icon: "🔧",
        xpReward: 140,
        exercises: [
          {
            id: "l1-m10-n3-e1",
            type: "multiple-choice",
            question: "What is directed evolution and why is it powerful for enzyme engineering?",
            options: [
              "Designing enzymes entirely from scratch using computers",
              "Iterative cycles of mutagenesis + screening to evolve enzymes with improved properties without needing to understand the mechanism",
              "Using CRISPR to direct which proteins are expressed",
              "Training neural networks on enzyme structures",
            ],
            correctIndex: 1,
            explanation: "Directed evolution (Frances Arnold — Nobel Prize 2018): create enzyme variants by mutagenesis, screen/select for improved activity, use winners as parents for next round. Critically, you don't need to understand WHY mutations improve function — the evolutionary pressure finds the solution. This has produced industrially important enzymes with properties not found in nature.",
            xpReward: 15,
          },
          {
            id: "l1-m10-n3-e2",
            type: "drag-drop",
            question: "Match each enzyme engineering approach to its description:",
            pairs: [
              { left: "Error-prone PCR", right: "Mutagenesis method — low-fidelity PCR introduces random point mutations throughout the gene" },
              { left: "DNA shuffling", right: "Recombine gene fragments from multiple related enzymes — combines beneficial mutations from different parents" },
              { left: "Computational design (Rosetta)", right: "Design active sites from first principles — place catalytic residues, design surrounding scaffold" },
              { left: "Semi-rational design", right: "Mutate only residues near the active site based on structural knowledge — smaller, targeted library" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m10-n3-e3",
            type: "fill-blank",
            question: "The Nobel Prize-winning enzyme Kemp eliminase was designed using _____ to create a new enzyme with no natural equivalent, proving computational protein design works.",
            blanks: [{ text: "Rosetta", answer: "Rosetta", position: 0 }],
            explanation: "Röthlisberger et al. (2008) used Rosetta to computationally design the first artificial enzyme for a non-biological reaction (Kemp elimination). The designed enzyme was then improved 200-fold by directed evolution — showing that computation and evolution work together beautifully.",
            xpReward: 10,
          },
          {
            id: "l1-m10-n3-e4",
            type: "multiple-choice",
            question: "Industrial enzyme engineering often seeks thermostable enzymes. Why?",
            options: [
              "Thermostable enzymes are always more active at room temperature",
              "Higher temperature = faster reaction kinetics and easier sterilization; thermostable enzymes don't denature in these conditions",
              "Thermostable enzymes require fewer cofactors",
              "They are smaller and cheaper to produce",
            ],
            correctIndex: 1,
            explanation: "Industrial advantage of thermostability: (1) faster reactions at high T (k_cat increases), (2) fewer contamination concerns (most pathogens are killed at 70°C+), (3) longer shelf life, (4) compatibility with high-temperature industrial processes. Source: thermophilic organisms (Thermus thermophilus, Sulfolobus etc.).",
            xpReward: 15,
          },
          {
            id: "l1-m10-n3-e5",
            type: "code-complete",
            question: "Score candidate enzyme mutations by estimating the effect of amino acid changes on stability (simplified ΔΔG):",
            starterCode: `def score_mutations(mutations, stability_matrix):
    \"\"\"
    Score a list of mutations. Each mutation is a tuple: (position, wild_type_aa, mutant_aa).
    stability_matrix[aa1][aa2] gives estimated ΔΔG of changing aa1 to aa2.
    Returns: list of (mutation, score) sorted best (most stabilizing, negative ΔΔG) first.
    \"\"\"
    scored = []
    for mut in mutations:
        pos, wt_aa, mut_aa = mut
        ddG = ___
        scored.append((mut, ddG))
    return sorted(scored, key=lambda x: x[1])  # sort by ΔΔG (most negative = most stabilizing)`,
            solution: `        ddG = stability_matrix.get(wt_aa, {}).get(mut_aa, 0.0)`,
            explanation: "A simplified scoring function: look up the estimated stability change for each amino acid substitution in a precomputed matrix (similar to FoldX or Rosetta's scoring). Negative ΔΔG = stabilizing mutation. In real enzyme engineering, you'd also score activity, solubility, and epistatic interactions.",
            xpReward: 25,
          },
          {
            id: "l1-m10-n3-e6",
            type: "sequence-order",
            question: "Order the steps in a directed evolution campaign:",
            items: [
              "Screen library for improved activity using HTS assay",
              "Introduce random mutations via error-prone PCR or saturation mutagenesis",
              "Select top variants as parents for next round",
              "Start with wild-type gene; characterize baseline activity",
            ],
            correctOrder: [3, 1, 0, 2],
            xpReward: 15,
          },
          {
            id: "l1-m10-n3-e7",
            type: "free-text",
            question: "Explain why directed evolution and rational design are complementary approaches in enzyme engineering.",
            rubric: ["directed evolution", "rational", "random", "structure", "mechanism", "synergy", "Rosetta", "screening"],
            minKeywords: 3,
            explanation: "Directed evolution: doesn't need mechanistic understanding, explores large sequence space randomly, finds solutions we didn't predict — but requires a good assay and many variants. Rational design: needs structural and mechanistic knowledge, makes targeted changes, smaller variant libraries — but can't explore epistatic combinations. Best practice: computational design creates a good starting scaffold, directed evolution then optimizes it. Example: Kemp eliminase (Rosetta design → directed evolution 200× improvement).",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m11",
    title: "Genomics & Sequencing Technologies",
    description: "From Sanger to long-reads — reading the book of life",
    realm: 1,
    color: "#52b788",
    nodes: [
      {
        id: "l1-m11-n1",
        moduleId: "l1-m11",
        title: "Sequencing Revolution",
        description: "Next-gen, long-read, and single-molecule sequencing",
        icon: "🔍",
        xpReward: 135,
        exercises: [
          {
            id: "l1-m11-n1-e1",
            type: "multiple-choice",
            question: "What did the Human Genome Project (completed 2003) cost, and what can the same task be done for today?",
            options: [
              "$3 billion → ~$100",
              "$100 million → ~$1,000",
              "$3 billion → ~$200-500",
              "$500 million → ~$5,000",
            ],
            correctIndex: 2,
            explanation: "HGP cost ~$3 billion and took 13 years. Today, a human genome can be sequenced for ~$200-500 (2024 prices) in a few days. This ~10-million-fold cost reduction — faster than Moore's Law — is the sequencing revolution. It has democratized genomics research.",
            xpReward: 10,
          },
          {
            id: "l1-m11-n1-e2",
            type: "drag-drop",
            question: "Match each sequencing technology to its key feature:",
            pairs: [
              { left: "Sanger sequencing (1st gen)", right: "Chain termination with dideoxynucleotides — high accuracy, short reads (~1 kb), low throughput" },
              { left: "Illumina (2nd gen/NGS)", right: "Sequencing by synthesis with reversible terminators — high throughput, short reads (150-300 bp), low error" },
              { left: "PacBio SMRT (3rd gen)", right: "Single-molecule, real-time sequencing — long reads (10-30 kb), higher error rate but correctable" },
              { left: "Oxford Nanopore (3rd gen)", right: "Ionic current through nanopore — real-time, longest reads (>1 Mb possible), works on USB stick" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m11-n1-e3",
            type: "fill-blank",
            question: "Illumina sequencing reads have typical lengths of _____ base pairs, while Oxford Nanopore reads can span over _____ kilobases.",
            blanks: [
              { text: "150-300", answer: "150", position: 0 },
              { text: "100", answer: "100", position: 1 },
            ],
            explanation: "Illumina: ~150 bp (paired-end = 2×150 bp, effective 300 bp with overlaps). Nanopore: routinely 10-50 kb, with ultra-long reads >1 Mb possible. Long reads are critical for assembling repetitive regions, phasing variants, and detecting structural variants.",
            xpReward: 10,
          },
          {
            id: "l1-m11-n1-e4",
            type: "code-complete",
            question: "Calculate sequencing coverage (depth) from reads data:",
            starterCode: `def calculate_coverage(num_reads, read_length, genome_size):
    \"\"\"
    Calculate average sequencing coverage.
    Coverage = (num_reads * read_length) / genome_size
    Convention: 30x coverage means each base covered ~30 times on average.
    \"\"\"
    return ___`,
            solution: `    return (num_reads * read_length) / genome_size`,
            explanation: "Coverage (depth) = total bases sequenced / genome size. 30x is standard for variant calling (WGS); 100x for detecting rare variants; 1000x for detecting low-frequency somatic mutations. Lander-Waterman equation predicts expected base coverage given this depth.",
            xpReward: 20,
          },
          {
            id: "l1-m11-n1-e5",
            type: "sequence-order",
            question: "Order the steps in a standard Illumina whole-genome sequencing workflow:",
            items: [
              "Alignment of reads to reference genome (BWA, STAR)",
              "DNA extraction and quality check",
              "Library preparation: fragment, end-repair, adapter ligation, size selection",
              "Cluster generation on flow cell → sequencing by synthesis",
            ],
            correctOrder: [1, 2, 3, 0],
            xpReward: 15,
          },
          {
            id: "l1-m11-n1-e6",
            type: "multiple-choice",
            question: "Why do long-read sequencing technologies have higher error rates than Illumina, and how is this compensated?",
            options: [
              "They use worse chemistry — error rates can't be fixed",
              "Single-molecule reads have inherent noise; compensated by deep coverage and consensus calling (circular consensus sequencing or read polishing)",
              "They are designed for population-level studies only",
              "The error rate is actually lower than Illumina",
            ],
            correctIndex: 1,
            explanation: "Single-molecule sequencing doesn't amplify signal like Illumina does — inherently noisier. Compensation: PacBio CCS (HiFi) reads the same molecule multiple times in a circle, achieving >99.9% accuracy. Nanopore accuracy now ~99% with Q20+ kits. Also: 'polishing' uses short Illumina reads to correct long-read assemblies.",
            xpReward: 15,
          },
          {
            id: "l1-m11-n1-e7",
            type: "tap-correct",
            question: "Tap ALL applications where long-read sequencing has a clear advantage over short reads:",
            options: [
              "Resolving repetitive sequences (tandem repeats, centromeres)",
              "Phasing haplotypes (which variants are on the same chromosome)",
              "De novo genome assembly of complex genomes",
              "Detecting large structural variants (inversions, translocations)",
              "Counting mRNA molecules in single-cell RNA-seq",
            ],
            correctIndices: [0, 1, 2, 3],
            explanation: "Long reads excel at: repetitive regions (short reads can't span them), phasing (you see both variants on the same read), de novo assembly (contiguous assembly across repeats), and structural variants (one read spans the whole event). scRNA-seq currently uses Illumina short reads for gene expression quantification.",
            xpReward: 15,
          },
        ],
      },
      {
        id: "l1-m11-n2",
        moduleId: "l1-m11",
        title: "Variant Calling & Population Genomics",
        description: "SNPs, indels, and reading human population history from DNA",
        icon: "👥",
        xpReward: 140,
        exercises: [
          {
            id: "l1-m11-n2-e1",
            type: "multiple-choice",
            question: "What is a SNP (Single Nucleotide Polymorphism)?",
            options: [
              "A mutation that always causes disease",
              "A position in the genome where the nucleotide differs between individuals in the population with a frequency >1%",
              "Any change in the DNA sequence at any frequency",
              "A type of insertion or deletion mutation",
            ],
            correctIndex: 1,
            explanation: "SNPs (snips) are common DNA variants at single positions — at least 1% frequency by definition (rarer = mutation). The human genome has ~4-5 million SNPs between any two people (out of 3.2 billion bases = ~0.1% difference). SNPs are the basis of GWAS and personal genomics.",
            xpReward: 10,
          },
          {
            id: "l1-m11-n2-e2",
            type: "drag-drop",
            question: "Match each genomic variant type to its definition:",
            pairs: [
              { left: "SNP", right: "Single nucleotide change — A→G, T→C, etc. Most common variant type" },
              { left: "Indel", right: "Insertion or deletion of 1-50 bp — frameshift if not divisible by 3" },
              { left: "CNV (Copy Number Variant)", right: "Duplication or deletion of >1 kb — hundreds to millions of bp" },
              { left: "Structural variant (SV)", right: "Large-scale rearrangements: inversions, translocations, complex rearrangements >50 bp" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m11-n2-e3",
            type: "code-complete",
            question: "Parse a simple VCF (Variant Call Format) file and count variant types:",
            starterCode: `def parse_vcf_variants(vcf_lines):
    \"\"\"
    Parse VCF lines (ignoring header lines starting with '#').
    Each variant line: CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO...
    Returns: dict with counts of SNPs, indels, and other variants.
    \"\"\"
    counts = {'SNP': 0, 'indel': 0, 'other': 0}

    for line in vcf_lines:
        if line.startswith('#'):
            continue
        parts = line.strip().split('\\t')
        ref, alt = parts[3], parts[4]

        if len(ref) == 1 and len(alt) == 1:
            ___
        elif len(ref) != len(alt):
            counts['indel'] += 1
        else:
            counts['other'] += 1

    return counts`,
            solution: `            counts['SNP'] += 1`,
            explanation: "VCF format is the standard for storing genomic variants. SNPs have REF and ALT of equal length (1 bp). Indels have different REF/ALT lengths. This is a toy parser; real VCF parsing uses tools like PyVCF, cyvcf2, or htslib.",
            xpReward: 25,
          },
          {
            id: "l1-m11-n2-e4",
            type: "fill-blank",
            question: "The _____ effect refers to the reduction in genetic diversity observed in populations that went through a severe bottleneck — e.g., the colonization of the Americas from a small founding population.",
            blanks: [{ text: "founder", answer: "founder", position: 0 }],
            explanation: "The founder effect: when a small subset of a population establishes a new one, genetic diversity is reduced (not all alleles are represented). Examples: Ashkenazi Jewish population (increased frequency of Tay-Sachs, BRCA1 185delAG); Finns (Finnish disease heritage). Important for population genomics and medical genetics.",
            xpReward: 10,
          },
          {
            id: "l1-m11-n2-e5",
            type: "multiple-choice",
            question: "What is linkage disequilibrium (LD) and why does it matter for GWAS?",
            options: [
              "Two genes being on different chromosomes — they don't affect each other",
              "Non-random association of alleles at different loci — nearby SNPs tend to be inherited together as haplotype blocks",
              "The tendency of mutations to cluster near gene boundaries",
              "The correlation between gene expression and DNA methylation",
            ],
            correctIndex: 1,
            explanation: "LD: nearby SNPs are inherited together because recombination rarely separates them in recent evolutionary time. In GWAS, a hit SNP may not be the causal variant — its association comes from LD with the true causal variant. Fine-mapping + functional annotation is needed to identify the actual causal variant.",
            xpReward: 15,
          },
          {
            id: "l1-m11-n2-e6",
            type: "sequence-order",
            question: "Order the steps in a typical GWAS analysis:",
            items: [
              "Correct for population stratification using principal components",
              "Genotype 500K-1M SNPs across 5,000-500,000 individuals",
              "Plot Manhattan plot; apply genome-wide significance threshold (p < 5×10⁻⁸)",
              "Test association of each SNP with phenotype (logistic regression for case/control)",
            ],
            correctOrder: [1, 0, 3, 2],
            xpReward: 20,
          },
          {
            id: "l1-m11-n2-e7",
            type: "tap-correct",
            question: "Tap ALL common tools in a variant calling pipeline (GATK best practices):",
            options: ["BWA-MEM (alignment)", "GATK HaplotypeCaller", "Picard MarkDuplicates", "samtools", "VEP (variant annotation)", "HISAT2"],
            correctIndices: [0, 1, 2, 3, 4],
            explanation: "BWA-MEM (alignment), GATK HaplotypeCaller (variant calling), Picard MarkDuplicates (remove PCR duplicates), samtools (BAM processing), and VEP/ANNOVAR (variant effect prediction/annotation) are all in GATK best practices. HISAT2 is for RNA-seq alignment, not DNA-seq variant calling.",
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: "l1-m12",
    title: "Python Mastery for Biology",
    description: "Advanced Python patterns used daily in computational biology",
    realm: 1,
    color: "#f59e0b",
    nodes: [
      {
        id: "l1-m12-n1",
        moduleId: "l1-m12",
        title: "Comprehensions & Generators",
        description: "Pythonic code that reads like prose",
        icon: "🐍",
        xpReward: 130,
        exercises: [
          {
            id: "l1-m12-n1-e1",
            type: "multiple-choice",
            question: "What is the memory advantage of a generator expression over a list comprehension?",
            options: [
              "Generators are always faster to compute",
              "Generators produce values lazily — one at a time — without storing the entire sequence in memory",
              "Generators can contain any data type; lists cannot",
              "There is no difference — they are equivalent",
            ],
            correctIndex: 1,
            explanation: "List comprehension: computes all values immediately, stores in memory (O(n) space). Generator expression: computes values on demand (lazy evaluation) — constant O(1) space. Critical when processing large genomic files (billions of variants) where you'd run out of RAM loading everything at once.",
            xpReward: 10,
          },
          {
            id: "l1-m12-n1-e2",
            type: "code-complete",
            question: "Convert this memory-hungry list comprehension to a generator that streams FASTA sequences:",
            starterCode: `# MEMORY HUNGRY (loads all sequences at once):
def load_all_sequences(filename):
    return [line.strip() for line in open(filename) if not line.startswith('>')]

# MEMORY EFFICIENT (generator version):
def stream_sequences(filename):
    ___`,
            solution: `    with open(filename) as f:
        for line in f:
            if not line.startswith('>'):
                yield line.strip()`,
            explanation: "Generators use 'yield' instead of 'return' — they produce one item at a time. For a 30 GB human genome FASTA file, a generator uses ~bytes of memory vs. ~30 GB for the list version. The caller processes one sequence at a time without loading everything.",
            xpReward: 25,
          },
          {
            id: "l1-m12-n1-e3",
            type: "fill-blank",
            question: "In Python, a dictionary comprehension to count base frequencies in a DNA sequence can be written as: `{base: _____ for base in 'ACGT'}`",
            blanks: [{ text: "seq.count(base)", answer: "seq.count(base)", position: 0 }],
            explanation: "Dictionary comprehensions: {key: value for key in iterable}. This one counts how many times each of A, C, G, T appears in the sequence. Concise alternative to a for loop with .setdefault() or Counter.",
            xpReward: 10,
          },
          {
            id: "l1-m12-n1-e4",
            type: "drag-drop",
            question: "Match each Python construct to its best use case in bioinformatics:",
            pairs: [
              { left: "List comprehension", right: "Transform short sequences: [seq.upper() for seq in reads if len(seq) > 20]" },
              { left: "Generator expression", right: "Stream large VCF files without loading into RAM" },
              { left: "Dict comprehension", right: "Build amino acid → codon table lookup dictionary from flat data" },
              { left: "Set comprehension", right: "Get unique gene IDs from a list with duplicates: {gene for gene in gene_list}" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m12-n1-e5",
            type: "multiple-choice",
            question: "What does `from itertools import chain` help with in genomics pipeline code?",
            options: [
              "Creating blockchain data structures for genomic data",
              "Flattening nested iterables without loading everything into memory — e.g., chaining reads from multiple files",
              "Encrypting genomic data for HIPAA compliance",
              "Linking genes in a pathway graph",
            ],
            correctIndex: 1,
            explanation: "itertools.chain flattens iterables lazily: chain(file1_reads, file2_reads, file3_reads) gives one iterator over all reads without loading all files at once. Also: chain.from_iterable() flattens a nested list of lists. Essential for processing multiple sequencing files in a pipeline.",
            xpReward: 15,
          },
          {
            id: "l1-m12-n1-e6",
            type: "code-complete",
            question: "Use a nested dict comprehension to build a codon table mapping each codon to its amino acid:",
            starterCode: `# Given flat codon data as list of (codon, amino_acid) pairs
codon_data = [
    ("ATG", "Met"), ("TTT", "Phe"), ("TTC", "Phe"),
    ("TTA", "Leu"), ("TAA", "Stop"), ("TAG", "Stop"),
    ("TGA", "Stop"),
]

# Build lookup dict: codon -> amino_acid
codon_table = ___

# Build reverse dict: amino_acid -> [codons]
reverse_table = {}
for codon, aa in codon_data:
    reverse_table.setdefault(aa, []).append(codon)`,
            solution: `codon_table = {codon: aa for codon, aa in codon_data}`,
            explanation: "Dict comprehension builds codon_table in one line. The reverse table uses .setdefault() to collect all codons for each amino acid — this builds the genetic code degeneracy table (most amino acids have multiple codons, called synonymous/silent codons).",
            xpReward: 20,
          },
          {
            id: "l1-m12-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are valid ways to iterate over a DNA sequence in triplets (codons):",
            options: [
              "`[seq[i:i+3] for i in range(0, len(seq)-2, 3)]`",
              "`zip(seq[::3], seq[1::3], seq[2::3])`",
              "`(seq[i:i+3] for i in range(0, len(seq), 3))`",
              "`re.findall(r'.{3}', seq)`",
              "`seq.split(' ')`",
            ],
            correctIndices: [0, 1, 2, 3],
            explanation: "All of options 1-4 work for extracting codons. List comp and generator are the clearest. zip with slicing works but produces tuples of characters (need ''.join). re.findall with .{3} matches non-overlapping triplets. Splitting on space would only work if bases were space-separated (they aren't).",
            xpReward: 15,
          },
        ],
      },
      {
        id: "l1-m12-n2",
        moduleId: "l1-m12",
        title: "NumPy for Genomics",
        description: "Vectorized biology — because loops are for amateurs",
        icon: "📊",
        xpReward: 145,
        exercises: [
          {
            id: "l1-m12-n2-e1",
            type: "multiple-choice",
            question: "Why is NumPy array computation typically 100-1000× faster than equivalent Python loops?",
            options: [
              "NumPy uses multiple CPU cores automatically",
              "NumPy operations are implemented in C/Fortran and operate on contiguous memory blocks — avoiding Python object overhead per element",
              "NumPy uses GPU acceleration by default",
              "NumPy skips error checking for speed",
            ],
            correctIndex: 1,
            explanation: "NumPy's speed comes from: (1) C/Fortran implementations (compiled, not interpreted), (2) contiguous memory blocks (cache-friendly), (3) vectorized SIMD CPU instructions, (4) no Python object overhead per element (a NumPy array stores raw numbers, not Python int objects). Python loops are slow because each iteration involves Python interpreter overhead.",
            xpReward: 10,
          },
          {
            id: "l1-m12-n2-e2",
            type: "code-complete",
            question: "Compute GC content across a sliding window of a DNA sequence using NumPy:",
            starterCode: `import numpy as np

def gc_sliding_window(sequence, window_size=1000):
    \"\"\"
    Calculate GC content in sliding windows along a sequence.
    Returns array of GC fractions, one per window.
    \"\"\"
    # Convert sequence to binary array: 1 if G or C, 0 otherwise
    seq_array = np.array([1 if c in 'GC' else 0 for c in sequence.upper()])

    n_windows = len(seq_array) - window_size + 1
    gc_fractions = np.zeros(n_windows)

    for i in range(n_windows):
        gc_fractions[i] = ___

    return gc_fractions`,
            solution: `        gc_fractions[i] = seq_array[i:i + window_size].mean()`,
            explanation: "The GC sliding window is used to detect CpG islands, segmental duplications, and genome regions. .mean() on a binary array gives the fraction. For production code, use np.convolve or scipy.signal.uniform_filter1d for even faster windowed computation.",
            xpReward: 25,
          },
          {
            id: "l1-m12-n2-e3",
            type: "fill-blank",
            question: "In NumPy, _____ operations apply element-wise to entire arrays without explicit Python loops — making them orders of magnitude faster on large genomic datasets.",
            blanks: [{ text: "vectorized", answer: "vectorized", position: 0 }],
            explanation: "Vectorized operations (broadcasting): numpy_array + 5 adds 5 to every element simultaneously in optimized C code. Compare to a Python for loop that processes each element individually with full Python interpreter overhead. Key principle: avoid loops over array elements; let NumPy loop in C.",
            xpReward: 10,
          },
          {
            id: "l1-m12-n2-e4",
            type: "drag-drop",
            question: "Match each NumPy operation to its bioinformatics use case:",
            pairs: [
              { left: "np.corrcoef(expr_matrix)", right: "Compute gene-gene correlation matrix for co-expression network" },
              { left: "np.argmax(scores, axis=1)", right: "Find the highest-scoring alignment position for each query sequence" },
              { left: "np.unique(variants, return_counts=True)", right: "Count occurrences of each unique variant type in VCF data" },
              { left: "np.linalg.svd(count_matrix)", right: "Dimensionality reduction of gene expression matrix (LSA/LSI)" },
            ],
            xpReward: 20,
          },
          {
            id: "l1-m12-n2-e5",
            type: "code-complete",
            question: "Use NumPy broadcasting to z-score normalize a gene expression matrix (genes × samples):",
            starterCode: `import numpy as np

def zscore_normalize(expression_matrix):
    \"\"\"
    Z-score normalize each gene (row) across samples.
    Z = (x - mean) / std
    expression_matrix shape: (n_genes, n_samples)
    \"\"\"
    means = expression_matrix.mean(axis=1, keepdims=True)
    stds = expression_matrix.std(axis=1, keepdims=True)
    # Avoid division by zero for non-expressed genes
    stds = np.where(stds == 0, 1, stds)
    return ___`,
            solution: `    return (expression_matrix - means) / stds`,
            explanation: "Broadcasting: means and stds have shape (n_genes, 1); expression_matrix has shape (n_genes, n_samples). NumPy broadcasts the subtraction/division across all samples automatically. Z-scoring makes genes with different expression levels comparable by normalizing to mean=0, std=1.",
            xpReward: 25,
          },
          {
            id: "l1-m12-n2-e6",
            type: "sequence-order",
            question: "Order these NumPy operations from least to most memory efficient for analyzing a 20,000-gene × 10,000-sample matrix:",
            items: [
              "Load entire matrix; compute all pairwise gene correlations (20,000² matrix)",
              "Load matrix in chunks; compute correlations for each chunk",
              "Use memory-mapped arrays (np.memmap) to access data without loading into RAM",
              "Stream from disk row by row using a generator",
            ],
            correctOrder: [0, 1, 2, 3],
            xpReward: 20,
          },
          {
            id: "l1-m12-n2-e7",
            type: "multiple-choice",
            question: "What does the 'axis' parameter in np.mean(matrix, axis=0) control?",
            options: [
              "The dimensionality of the output",
              "axis=0 collapses along rows (compute mean across all rows, for each column)",
              "axis=0 computes the mean of the first row only",
              "axis=0 normalizes by the zeroth element",
            ],
            correctIndex: 1,
            explanation: "axis=0 reduces along the first dimension (rows): np.mean(matrix, axis=0) gives one mean per column (mean across all samples for each gene = per-gene mean). axis=1 reduces along columns: gives one mean per row (mean across all genes for each sample = per-sample mean). Gets confusing but critical for genomics data.",
            xpReward: 15,
          },
        ],
      },
    ],
  },
];

export default level1BonusModules;
