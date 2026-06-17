import type { Module, Realm } from "@/lib/types";

const modules: Module[] = [
  {
    id: "l4-adv-m1",
    title: "AlphaFold & Protein Structure",
    description: "From amino acid sequence to 3D structure — and how AI cracked the 50-year folding problem",
    realm: 4 as Realm,
    color: "#c0a0ff",
    nodes: [
      {
        id: "l4-adv-m1-n1",
        moduleId: "l4-adv-m1",
        title: "Protein Structure Hierarchy",
        description: "Primary sequence to quaternary assembly — how shape encodes function",
        icon: "🧬",
        xpReward: 120,
        exercises: [
          {
            id: "l4-adv-m1-n1-e1",
            type: "sequence-order",
            question: "Arrange the levels of protein structure from simplest to most complex:",
            items: [
              "Quaternary — multiple polypeptide chains assembled into one functional complex",
              "Secondary — local folding into α-helices and β-sheets stabilized by hydrogen bonds",
              "Primary — linear sequence of amino acids linked by peptide bonds",
              "Tertiary — full 3D fold of a single polypeptide chain",
            ],
            correctOrder: [2, 1, 3, 0],
            xpReward: 20,
            hint: "⚗️ TEACHING: Protein structure is hierarchical — each level builds on the one below. Primary is just the sequence; secondary adds local folding patterns; tertiary gives the overall 3D shape; quaternary assembles multiple chains.\n\nReal example: Hemoglobin has quaternary structure — four subunits (2α + 2β chains) that carry oxygen cooperatively.\n\nWhy it matters: Each level is targeted by different drugs — some disrupt peptide bonds, others interfere with helix packing, others block subunit assembly.",
            explanation: "Protein structure builds from primary (sequence) → secondary (local motifs) → tertiary (global fold) → quaternary (multi-chain assemblies). Each level depends on the one below.",
          },
          {
            id: "l4-adv-m1-n1-e2",
            type: "multiple-choice",
            question: "What type of bond stabilizes α-helices and β-sheets in secondary protein structure?",
            options: [
              "Covalent peptide bonds",
              "Hydrogen bonds between backbone NH and C=O groups",
              "Disulfide bridges between cysteines",
              "Ionic bonds between charged side chains",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: Secondary structures are stabilized by hydrogen bonds between backbone atoms — the NH of one residue and the C=O of another. In an α-helix the i and i+4 residues bond; in β-sheets adjacent strands pair up.\n\nReal example: Collagen's triple helix relies on backbone H-bonds between glycine-rich strands — mutations in glycine break this and cause osteogenesis imperfecta.\n\nWhy it matters: Understanding these bonds helps design peptide mimetics that disrupt or stabilize specific secondary structures as drugs.",
            explanation: "α-helices and β-sheets are both stabilized by backbone hydrogen bonds. Covalent bonds hold primary structure; disulfide bridges contribute to tertiary stability; ionic bonds affect tertiary and quaternary structure.",
          },
          {
            id: "l4-adv-m1-n1-e3",
            type: "matching",
            question: "Match each structural feature to its correct level of protein structure:",
            pairs: [
              { left: "Peptide bond between Met-Ala-Gly", right: "Primary structure" },
              { left: "α-helix stabilized by hydrogen bonds", right: "Secondary structure" },
              { left: "Hydrophobic core burying leucine residues", right: "Tertiary structure" },
              { left: "Hemoglobin's four-subunit assembly", right: "Quaternary structure" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: Each structural level has characteristic features: primary = covalent sequence; secondary = local H-bonded motifs; tertiary = overall 3D fold of one chain; quaternary = assembly of multiple chains.\n\nReal example: Insulin has primary (51 AA sequence), secondary (helices), tertiary (compact fold), and exists as a hexamer (quaternary) in storage but monomer in blood.\n\nWhy it matters: Drug targets are often disrupted at a specific structural level — protease inhibitors at primary, kinase inhibitors at tertiary, complex disruptors at quaternary.",
            explanation: "Peptide bond = primary; α-helix = secondary; burying hydrophobic residues = tertiary feature; multi-chain assembly = quaternary.",
          },
          {
            id: "l4-adv-m1-n1-e4",
            type: "fill-blank",
            question: "A ___ plot maps allowed φ (phi) and ψ (psi) backbone dihedral angles for amino acids, revealing which secondary structures are geometrically favorable and used to validate crystal structures.",
            blanks: [
              { text: "name of the structural validation plot", answer: "Ramachandran", position: 0 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: The Ramachandran plot maps backbone dihedral angles (φ and ψ) for each residue. Allowed regions correspond to α-helices and β-sheets; disallowed regions are sterically impossible. Used to validate protein crystal structures.\n\nReal example: Proline has a cyclic side chain — it shows up in a very restricted Ramachandran region, explaining why Pro breaks α-helices.\n\nWhy it matters: Structure validation tools like PROCHECK and MolProbity use Ramachandran plots to assess model quality before publication.",
            explanation: "The Ramachandran plot (named after G.N. Ramachandran) maps φ and ψ dihedral angles — the basis for understanding which protein conformations are geometrically allowed.",
          },
          {
            id: "l4-adv-m1-n1-e5",
            type: "multiple-choice",
            question: "Why do proteins form a hydrophobic core?",
            options: [
              "Hydrophobic amino acids are attracted to water molecules",
              "Burying hydrophobic residues away from water is thermodynamically favorable — it releases ordered water molecules and increases entropy",
              "Disulfide bridges force hydrophobic residues inward",
              "Hydrophobic cores are held together by strong ionic interactions",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: The hydrophobic effect is driven by entropy. Water molecules form ordered cages around nonpolar residues — burying them in the protein core releases these water molecules, increasing solvent entropy (thermodynamically favorable).\n\nReal example: Apolar residues like Leu, Val, Ile, Phe are found predominantly in protein cores — mutations exposing them to water are destabilizing and often cause disease.\n\nWhy it matters: Hydrophobic pockets in protein cores are druggable — many inhibitors work by inserting hydrophobic groups into these cavities.",
            explanation: "Hydrophobic core formation is driven by the hydrophobic effect: burying nonpolar residues away from water increases overall entropy by releasing ordered water molecules surrounding those residues.",
          },
          {
            id: "l4-adv-m1-n1-e6",
            type: "code-complete",
            question: "Complete the Python function that classifies amino acids by chemical property:",
            codeTemplate: `def classify_amino_acid(aa):
    hydrophobic = set("AVILMFYW")
    charged = set("RKHDE")
    polar = set("STNQCG")

    if aa in hydrophobic:
        return ___
    elif aa in charged:
        return "charged"
    else:
        return "polar/other"

print(classify_amino_acid("L"))  # Expected: hydrophobic
print(classify_amino_acid("K"))  # Expected: charged`,
            codeAnswer: `def classify_amino_acid(aa):
    hydrophobic = set("AVILMFYW")
    charged = set("RKHDE")
    polar = set("STNQCG")

    if aa in hydrophobic:
        return "hydrophobic"
    elif aa in charged:
        return "charged"
    else:
        return "polar/other"

print(classify_amino_acid("L"))  # Expected: hydrophobic
print(classify_amino_acid("K"))  # Expected: charged`,
            xpReward: 30,
            hint: "⚗️ TEACHING: Amino acids are classified by their side chain chemistry: hydrophobic (nonpolar, found in core), charged (ionic, found on surface), and polar (uncharged but hydrophilic). Single-letter codes are standard in bioinformatics.\n\nReal example: L (Leucine), I (Isoleucine), and V (Valine) are the most commonly buried hydrophobic amino acids in protein cores.\n\nWhy it matters: Bioinformatics pipelines routinely classify amino acids by property to predict structural features, design mutations, or analyze evolutionary conservation.",
            explanation: "The blank should be `\"hydrophobic\"` — the string matching the category of amino acids in the hydrophobic set.",
          },
        ],
      },
      {
        id: "l4-adv-m1-n2",
        moduleId: "l4-adv-m1",
        title: "AlphaFold2 Architecture",
        description: "Inside the neural network that solved protein folding — MSA, EvoFormer, and confidence scores",
        icon: "🔵",
        xpReward: 140,
        exercises: [
          {
            id: "l4-adv-m1-n2-e1",
            type: "multiple-choice",
            question: "Why does AlphaFold2 use Multiple Sequence Alignment (MSA) as input?",
            options: [
              "To increase the length of the input protein sequence",
              "Coevolving residues across species reveal spatial contacts — positions that vary together are likely close in 3D structure",
              "MSA converts amino acid sequences to numeric tensors",
              "To find the most recently evolved protein sequences",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: Evolution is the key insight. If two residues are spatially close, a mutation in one is often compensated by a correlated mutation in the other across species. MSA captures this coevolution signal — column pairs that vary together are likely in spatial contact.\n\nReal example: Contact maps can be predicted with >80% accuracy from MSA alone using mutual information — AlphaFold leverages this with the EvoFormer attention mechanism.\n\nWhy it matters: Proteins with deep MSAs (many related sequences) get better predictions — orphan proteins with no homologs are harder to fold accurately.",
            explanation: "MSA encodes evolutionary covariation — residues that coevolve are spatially close. AlphaFold2's EvoFormer extracts these structural constraints from the MSA, not just the single sequence.",
          },
          {
            id: "l4-adv-m1-n2-e2",
            type: "multiple-choice",
            question: "What is the role of the EvoFormer module in AlphaFold2?",
            options: [
              "It predicts secondary structure only",
              "It iteratively updates both MSA representations and pairwise residue distance representations using attention, enabling bidirectional exchange between evolutionary and geometric data",
              "It converts 2D distance maps directly to 3D coordinates",
              "It performs energy minimization after the structure is generated",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: The EvoFormer is a specialized transformer maintaining two representations: the MSA (evolutionary) representation and the pair (pairwise distances) representation. These communicate through attention, allowing the model to reason about 3D geometry from evolutionary signals.\n\nReal example: After 48 EvoFormer blocks, the pair representation encodes rich geometric constraints — effectively learning contact prediction plus distance geometry end-to-end.\n\nWhy it matters: The EvoFormer architecture inspired later protein language models (ESMFold) and geometric deep learning in structural biology.",
            explanation: "The EvoFormer iteratively updates MSA and pair representations with attention operations, allowing evolutionary information (MSA) to inform geometric reasoning (pair distances) bidirectionally.",
          },
          {
            id: "l4-adv-m1-n2-e3",
            type: "fill-blank",
            question: "AlphaFold's per-residue confidence score is called ___, and scores above ___ indicate very high confidence suitable for structure-based drug design.",
            blanks: [
              { text: "confidence score abbreviation", answer: "pLDDT", position: 0 },
              { text: "very high confidence threshold", answer: "90", position: 1 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: pLDDT stands for predicted Local Distance Difference Test. It scores each residue 0–100. >90 = very high confidence (dark blue); 70–90 = confident (light blue); 50–70 = low confidence (yellow); <50 = very low/disordered (orange).\n\nReal example: pLDDT correlates strongly with experimental B-factors — disordered loops have low pLDDT, matching their high experimental flexibility.\n\nWhy it matters: Drug designers use pLDDT to identify reliable binding pockets (high pLDDT) vs. unreliable disordered loops to avoid.",
            explanation: "pLDDT (predicted Local Distance Difference Test) is AlphaFold's per-residue confidence metric. Scores >90 indicate very high confidence; >70 is generally reliable for structural analysis.",
          },
          {
            id: "l4-adv-m1-n2-e4",
            type: "matching",
            question: "Match each pLDDT score range to its AlphaFold confidence category:",
            pairs: [
              { left: "pLDDT > 90", right: "Very high confidence — backbone reliable for drug design (dark blue)" },
              { left: "pLDDT 70–90", right: "Confident — generally trustworthy for most analyses (light blue)" },
              { left: "pLDDT 50–70", right: "Low confidence — treat with caution, may be disordered (yellow)" },
              { left: "pLDDT < 50", right: "Very low — likely intrinsically disordered region (orange)" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: AlphaFold colors structures by pLDDT: dark blue (>90), light blue (70–90), yellow (50–70), orange (<50). The coloring makes it easy to spot reliable vs unreliable regions at a glance.\n\nReal example: Transcription factors often have well-folded DNA-binding domains (pLDDT >90) with long disordered activation domains (pLDDT <50) — matching known biology from NMR and biochemistry.\n\nWhy it matters: Selecting drug binding sites in high-pLDDT regions increases the chance the predicted structure matches the true structure.",
            explanation: "AlphaFold pLDDT: >90 very high (dark blue), 70–90 confident (light blue), 50–70 low (yellow), <50 very low/disordered (orange).",
          },
          {
            id: "l4-adv-m1-n2-e5",
            type: "multiple-choice",
            question: "What does PAE (Predicted Aligned Error) measure in AlphaFold2?",
            options: [
              "The energy of the predicted protein structure",
              "The expected positional error in Angstroms for residue j when the structure is aligned at residue i — useful for assessing domain-domain orientation accuracy",
              "The accuracy of secondary structure prediction only",
              "The confidence of each amino acid's identity in the sequence",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: PAE is a pairwise confidence metric — a 2D matrix where PAE(i,j) is the expected error at residue j's position if you align on residue i. Low inter-domain PAE means their relative orientations are predicted reliably.\n\nReal example: For a two-domain protein, PAE is low within each domain but high between them — indicating uncertain domain-domain orientation even if each domain folds correctly.\n\nWhy it matters: Low inter-domain PAE is essential for modeling protein-protein interfaces and predicting complex structures for drug design.",
            explanation: "PAE is a 2D matrix measuring positional error (Å) between residue pairs. Low off-diagonal PAE indicates confident domain-domain orientation; high PAE indicates uncertain relative positioning.",
          },
          {
            id: "l4-adv-m1-n2-e6",
            type: "multiple-choice",
            question: "Which of the following does AlphaFold2 NOT reliably predict?",
            options: [
              "The backbone fold of a globular protein with deep MSA",
              "The position of conserved active site residues",
              "How a protein's conformation changes upon ligand binding (conformational dynamics)",
              "The tertiary structure of a single-domain protein",
            ],
            correctIndex: 2,
            xpReward: 20,
            hint: "⚗️ TEACHING: AlphaFold predicts a single static conformation — typically the apo or ground-state structure. It cannot capture alternative conformations, induced fit upon ligand binding, or the full conformational ensemble proteins explore.\n\nReal example: Many GPCRs exist in active and inactive conformational states — AlphaFold often predicts one state but not both, limiting its utility for understanding receptor activation.\n\nWhy it matters: Drug binding often induces conformational changes — missing this limits AlphaFold's use for induced-fit docking and allosteric site discovery.",
            explanation: "AlphaFold2 predicts a single static structure. Conformational dynamics, ligand-induced changes, and alternative states require MD simulations or ensemble methods beyond AlphaFold's scope.",
          },
        ],
      },
      {
        id: "l4-adv-m1-n3",
        moduleId: "l4-adv-m1",
        title: "Applications & Limitations",
        description: "AlphaFold's revolution in biology — and where it still falls short",
        icon: "⭐",
        xpReward: 160,
        exercises: [
          {
            id: "l4-adv-m1-n3-e1",
            type: "multiple-choice",
            question: "How has AlphaFold most directly impacted drug discovery?",
            options: [
              "It automatically synthesizes drug candidates",
              "It provides structural models of previously unsolved drug targets, enabling structure-based drug design for proteins that resisted crystallography",
              "It predicts drug toxicity from sequence alone",
              "It performs clinical trials in silico",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: The AlphaFold Protein Structure Database contains predicted structures for >200 million proteins — including thousands of human disease proteins with no experimental structure. This unlocks structure-based drug design for previously intractable targets.\n\nReal example: AlphaFold structures of Chagas disease and leishmaniasis proteins enabled novel inhibitor design for neglected tropical diseases — targets with no crystal structure before.\n\nWhy it matters: Structure-based drug design is 2–3x more efficient than blind screening — AlphaFold dramatically expands the universe of druggable targets.",
            explanation: "AlphaFold provides structures for proteins that resisted crystallization or cryo-EM, enabling structure-based drug design for a vastly expanded set of disease targets.",
          },
          {
            id: "l4-adv-m1-n3-e2",
            type: "matching",
            question: "Match each real-world application to its AlphaFold use case:",
            pairs: [
              { left: "Designing synthetic insulin analogs", right: "AlphaFold structure reveals receptor-binding interface geometry" },
              { left: "COVID-19 spike protein vaccines", right: "Rapid structural prediction enabled antigen design before experimental structures existed" },
              { left: "Antibody engineering", right: "Predicting CDR loop conformations for affinity maturation campaigns" },
              { left: "Antimicrobial resistance", right: "Modeling bacterial enzyme structures to find novel inhibitor pockets" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: AlphaFold's impact spans the breadth of medicine. From understanding insulin-receptor interfaces to designing vaccines, rapid structural prediction compressed timelines from years to days.\n\nReal example: During COVID-19, AlphaFold predicted structures of Orf3a and other accessory proteins lacking experimental structures — enabling rapid understanding of viral biology.\n\nWhy it matters: Speed matters in drug discovery — AlphaFold compresses target-to-structure time from months (crystallography) to hours.",
            explanation: "AlphaFold applications span insulin design (receptor interface), vaccine development (antigen engineering), antibody optimization (CDR loops), and antimicrobial discovery (enzyme modeling).",
          },
          {
            id: "l4-adv-m1-n3-e3",
            type: "multiple-choice",
            question: "What is a key limitation of AlphaFold2 when applied to protein-protein complexes?",
            options: [
              "It cannot predict structures of proteins with more than 100 residues",
              "It was primarily trained on single-chain structures, so complex interfaces may be less accurate — AlphaFold-Multimer partially addresses this",
              "It only works on bacterial proteins",
              "It requires a crystal structure as a starting point",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: AlphaFold2 was trained predominantly on single-chain proteins from the PDB. AlphaFold-Multimer was developed with additional training on complexes, but interfaces are still harder to predict accurately than monomeric folds.\n\nReal example: Predicting how a kinase interacts with its substrate peptide gives lower pLDDT and higher PAE at the interface than the kinase core itself.\n\nWhy it matters: Many drug targets are protein-protein interfaces — PPI inhibitors require accurate complex structures that AlphaFold still struggles with.",
            explanation: "AlphaFold2 was primarily trained on monomeric structures. Complex interfaces can be less accurate. AlphaFold-Multimer improves this but limitations remain.",
          },
          {
            id: "l4-adv-m1-n3-e4",
            type: "fill-blank",
            question: "AlphaFold ___ extended the approach to DNA, RNA, and small molecules in addition to proteins, using a diffusion-based architecture to predict multicomponent biological complexes.",
            blanks: [
              { text: "version number", answer: "3", position: 0 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: AlphaFold3 (DeepMind, 2024) uses a diffusion-based Evoformer-Diffusion model. Unlike AF2, it can predict complexes containing proteins, DNA, RNA, ions, and small molecules simultaneously — a major step for drug discovery.\n\nReal example: AlphaFold3 can predict how a small molecule drug binds its protein target — a capability AF2 entirely lacked, which previously required separate docking software.\n\nWhy it matters: Predicting protein-ligand complexes directly from sequence + SMILES removes a critical bottleneck in structure-based drug design workflows.",
            explanation: "AlphaFold3 expanded beyond proteins to include DNA, RNA, and small molecules, using a diffusion-based approach that enables direct prediction of multicomponent biological complexes.",
          },
          {
            id: "l4-adv-m1-n3-e5",
            type: "multiple-choice",
            question: "In de novo protein design, what role does AlphaFold play?",
            options: [
              "It designs new amino acid sequences from scratch",
              "It validates whether computationally designed sequences are predicted to fold into the intended target structure",
              "It synthesizes designed proteins in the lab automatically",
              "It only works with natural protein sequences, not designed ones",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: De novo design tools like RFdiffusion and ProteinMPNN generate new sequences intended to fold into desired structures. AlphaFold acts as a filter/validator — if AlphaFold predicts the designed sequence folds to the intended structure, it passes; otherwise it is rejected.\n\nReal example: David Baker's lab used RFdiffusion + ProteinMPNN + AlphaFold to design proteins binding influenza hemagglutinin — generating thousands of candidates filtered by AlphaFold confidence.\n\nWhy it matters: AlphaFold-validated de novo design can create entirely new enzymes, vaccines, and therapeutic proteins that don't exist in nature.",
            explanation: "In de novo design, AlphaFold serves as a fast computational oracle — validating whether designed sequences are predicted to fold correctly before expensive experimental testing.",
          },
          {
            id: "l4-adv-m1-n3-e6",
            type: "code-complete",
            question: "Complete the Python function that filters high-confidence residues from AlphaFold pLDDT scores:",
            codeTemplate: `def get_confident_residues(sequence, plddt_scores, threshold=90):
    """Return residues with pLDDT at or above threshold."""
    confident = []
    for i, (aa, score) in enumerate(zip(sequence, plddt_scores)):
        if score ___ threshold:
            confident.append((i + 1, aa, score))
    return confident

seq = "MKVLWAALLV"
plddt = [95, 92, 88, 91, 96, 74, 93, 85, 90, 97]
high_conf = get_confident_residues(seq, plddt)
print(f"High-confidence residues: {len(high_conf)}")`,
            codeAnswer: `def get_confident_residues(sequence, plddt_scores, threshold=90):
    """Return residues with pLDDT at or above threshold."""
    confident = []
    for i, (aa, score) in enumerate(zip(sequence, plddt_scores)):
        if score >= threshold:
            confident.append((i + 1, aa, score))
    return confident

seq = "MKVLWAALLV"
plddt = [95, 92, 88, 91, 96, 74, 93, 85, 90, 97]
high_conf = get_confident_residues(seq, plddt)
print(f"High-confidence residues: {len(high_conf)}")`,
            xpReward: 30,
            hint: "⚗️ TEACHING: Filtering AlphaFold outputs by pLDDT threshold is standard preprocessing in structure-based drug design pipelines. Only high-confidence regions are used for docking or virtual screening.\n\nReal example: Pharma pipelines extract pLDDT >90 regions and define binding pockets only within these regions using fpocket or SiteMap.\n\nWhy it matters: Including low-confidence disordered regions in docking generates false positive binding sites — pLDDT filtering is essential quality control.",
            explanation: "The `>=` operator checks if the score meets or exceeds the threshold, keeping residues with pLDDT at or above the confidence cutoff.",
          },
        ],
      },
    ],
  },

  {
    id: "l4-adv-m2",
    title: "Drug Discovery Pipeline",
    description: "From target to molecule — the computational tools that power modern pharmaceutical R&D",
    realm: 4 as Realm,
    color: "#c0a0ff",
    nodes: [
      {
        id: "l4-adv-m2-n1",
        moduleId: "l4-adv-m2",
        title: "Target Identification & Validation",
        description: "Finding and proving the right protein to drug — before spending millions in chemistry",
        icon: "🎯",
        xpReward: 130,
        exercises: [
          {
            id: "l4-adv-m2-n1-e1",
            type: "multiple-choice",
            question: "Which combination of features makes an ideal small-molecule drug target?",
            options: [
              "Large disordered protein with no known function",
              "Well-structured binding pocket, essential for disease, genetically validated, and expressed in the target tissue",
              "Any protein upregulated in cancer cells, regardless of function",
              "A protein with no homologs in the human genome",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: A good drug target must satisfy: (1) druggable — has a binding pocket for a small molecule; (2) disease-relevant — causally linked to pathology; (3) genetically validated — human genetics supports its role; (4) tissue-specific enough to minimize off-target effects.\n\nReal example: BCR-ABL kinase in CML — essential for cancer cell survival, structurally characterized, genetically validated by the Philadelphia chromosome translocation, and highly specific to leukemic cells.\n\nWhy it matters: Poor target selection is the #1 cause of late-stage drug failure — most Phase III failures happen because the target wasn't truly driving disease.",
            explanation: "The ideal drug target must be druggable (has a binding site), disease-causal, genetically validated, and appropriately expressed in the target tissue.",
          },
          {
            id: "l4-adv-m2-n1-e2",
            type: "multiple-choice",
            question: "What does 'druggability' mean in the context of target selection?",
            options: [
              "The target causes a disease that can be treated",
              "The target protein has a suitable binding pocket that can accommodate a small molecule with appropriate binding affinity",
              "The drug can be synthesized cheaply",
              "The target is expressed in liver cells where drugs are metabolized",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: Druggability refers to a protein's structural properties allowing binding of drug-like small molecules. It requires a concave binding pocket with appropriate volume (300–1000 Å³), hydrophobic character, and geometric complementarity.\n\nReal example: Transcription factors are classically 'undruggable' — they have large flat protein-protein interaction surfaces rather than deep pockets. PROTACs emerged partly to address this limitation.\n\nWhy it matters: ~80% of human proteins are estimated to be undruggable by small molecules — identifying the 20% that are druggable is critical.",
            explanation: "Druggability refers to the presence of a binding pocket that can accommodate a small molecule with sufficient affinity. Flat protein surfaces or disordered proteins are typically undruggable.",
          },
          {
            id: "l4-adv-m2-n1-e3",
            type: "matching",
            question: "Match each omics approach to its role in drug target identification:",
            pairs: [
              { left: "Genomics (GWAS)", right: "Identifies disease-associated genetic variants pointing to causal genes" },
              { left: "Transcriptomics (RNA-seq)", right: "Reveals genes differentially expressed in diseased vs healthy tissue" },
              { left: "Proteomics (mass spec)", right: "Measures actual protein abundance and post-translational modifications" },
              { left: "Metabolomics", right: "Identifies metabolic pathway disruptions pointing to enzyme targets" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: Multi-omics target ID integrates multiple data layers. GWAS provides genetic causality; transcriptomics shows expression changes; proteomics confirms protein-level changes; metabolomics connects to biochemical function. Each layer reduces false positives.\n\nReal example: PCSK9 was identified through genetics (GWAS variants), protein biology (degrades LDL receptors), and metabolomics (plasma LDL levels) — a multi-layer validated target.\n\nWhy it matters: Targets with genetic + proteomic + metabolomic validation have 2–3x higher Phase II success rates than single-layer validated targets.",
            explanation: "GWAS → genetic causality; RNA-seq → expression changes; proteomics → protein levels/modifications; metabolomics → pathway function. Each layer adds orthogonal target validation.",
          },
          {
            id: "l4-adv-m2-n1-e4",
            type: "fill-blank",
            question: "___ randomization uses genetic variants as instrumental variables to test causal relationships between a biomarker and disease, providing stronger evidence for target validation than observational studies alone.",
            blanks: [
              { text: "statistical method name", answer: "Mendelian", position: 0 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: Mendelian randomization (MR) exploits the random assortment of genetic variants at conception as a natural randomized experiment. If variants that raise LDL also raise cardiovascular disease risk, LDL is causally linked to CVD — regardless of confounders.\n\nReal example: MR confirmed LDL-C is causally linked to coronary artery disease, validating PCSK9 as a drug target. MR evidence also supported IL-6R targeting for cardiovascular disease.\n\nWhy it matters: Drugs with MR-supported targets have significantly higher Phase III success rates — it's one of the strongest forms of human target validation.",
            explanation: "Mendelian randomization uses genetic variants as natural experiments to establish causal relationships between exposures (proteins, biomarkers) and diseases, providing strong human genetic target validation.",
          },
          {
            id: "l4-adv-m2-n1-e5",
            type: "multiple-choice",
            question: "A GWAS identifies 47 SNPs associated with Type 2 diabetes. How should you prioritize these for drug target discovery?",
            options: [
              "Select the SNP with the lowest p-value regardless of gene function",
              "Prioritize SNPs in coding regions of druggable genes with expression in pancreatic β-cells and functional validation evidence",
              "Focus only on the most common SNPs (highest allele frequency)",
              "Use all 47 SNPs equally in downstream analysis",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: GWAS hits require multi-level prioritization: (1) coding vs regulatory — coding variants are easier to interpret; (2) druggability of the gene; (3) tissue expression — for T2D, pancreatic β-cells are key; (4) functional validation through eQTLs, CRISPR, or animal models.\n\nReal example: TCF7L2 is the strongest T2D GWAS hit — it regulates Wnt signaling in β-cells. Despite its strength, it's been challenging to drug due to its transcription factor function.\n\nWhy it matters: Most GWAS hits are in non-coding regions affecting gene regulation — bioinformatics fine-mapping is needed to identify the causal gene and variant.",
            explanation: "GWAS prioritization requires considering coding/regulatory context, druggability, tissue-specific expression, and functional evidence — p-value alone is insufficient.",
          },
          {
            id: "l4-adv-m2-n1-e6",
            type: "sequence-order",
            question: "Arrange the target identification and validation steps in the correct drug discovery order:",
            items: [
              "Biomarker development — identify patient selection markers for clinical trials",
              "Disease association — link the protein to disease using omics and genetics",
              "Functional validation — CRISPR knockout or inhibitor experiments confirm causal role",
              "Druggability assessment — check for binding pockets using structural data or AlphaFold",
              "Target identification — nominate candidate proteins from GWAS, proteomics, or literature",
            ],
            correctOrder: [4, 1, 2, 3, 0],
            xpReward: 20,
            hint: "⚗️ TEACHING: Target validation follows a logical hierarchy: find candidates from data, establish disease linkage, validate causally, assess druggability, then develop biomarkers to track target engagement in the clinic.\n\nReal example: CDK4/6 inhibitor palbociclib — Rb pathway identified from cancer genomics → validated by CRISPR → CDK4/6 shown druggable via crystal structure → Ki67 used as clinical biomarker.\n\nWhy it matters: Skipping validation steps (going straight from identification to chemistry) is a major cause of expensive late-stage clinical failures.",
            explanation: "Target validation order: identify candidates → link to disease → functionally validate → assess druggability → develop biomarkers. Skipping steps leads to clinical failure.",
          },
        ],
      },
      {
        id: "l4-adv-m2-n2",
        moduleId: "l4-adv-m2",
        title: "Molecular Docking",
        description: "Computationally predicting how small molecules bind proteins — the backbone of virtual screening",
        icon: "⚗️",
        xpReward: 150,
        exercises: [
          {
            id: "l4-adv-m2-n2-e1",
            type: "multiple-choice",
            question: "What does molecular docking software calculate?",
            options: [
              "The synthesis route for a drug molecule",
              "The predicted binding pose (orientation and conformation) of a ligand in a protein binding site, plus an estimated binding affinity score",
              "The pharmacokinetic profile of a drug candidate",
              "The molecular weight and solubility of a compound",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: Molecular docking has two goals: (1) pose prediction — finding the correct 3D orientation and conformation of a ligand in the binding site; (2) affinity estimation — scoring the pose to rank how strongly the ligand is likely to bind relative to other compounds.\n\nReal example: Glide docking predicted the binding pose of oseltamivir in neuraminidase within 1.5 Å RMSD of the crystal structure — enabling rational design of Tamiflu analogs.\n\nWhy it matters: Docking can virtually screen millions of compounds in days — enriching hits from 0.01% (random screening) to 1–10%, dramatically reducing experimental cost.",
            explanation: "Molecular docking predicts both the 3D binding pose of a ligand and an estimated binding affinity score, enabling virtual screening of large compound libraries.",
          },
          {
            id: "l4-adv-m2-n2-e2",
            type: "matching",
            question: "Match each binding affinity measurement to its correct definition:",
            pairs: [
              { left: "Kd (dissociation constant)", right: "Ligand concentration at which 50% of protein is bound at equilibrium — pure thermodynamic affinity" },
              { left: "IC50", right: "Inhibitor concentration reducing activity by 50% in an assay — dependent on assay conditions" },
              { left: "Ki (inhibition constant)", right: "True thermodynamic inhibition constant corrected for substrate competition — mechanism-independent" },
              { left: "ΔG (binding free energy)", right: "Gibbs free energy of binding; ΔG = RT ln(Kd) — the fundamental thermodynamic quantity" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: These measures are related but distinct. Kd is pure thermodynamic binding. IC50 depends on assay conditions (substrate concentration, enzyme concentration). Ki corrects IC50 for competitive substrate effects using the Cheng-Prusoff equation. ΔG is the underlying thermodynamic quantity.\n\nReal example: A compound with IC50 = 10 nM in a high-substrate assay might have Ki = 2 nM — the IC50 can be misleading without knowing assay conditions.\n\nWhy it matters: Comparing compounds across different assays requires converting to Ki or ΔG — IC50 values alone can give a false ranking of potency.",
            explanation: "Kd = thermodynamic affinity; IC50 = assay-dependent potency; Ki = corrected inhibition constant; ΔG = fundamental free energy. Each measures a different aspect of the same interaction.",
          },
          {
            id: "l4-adv-m2-n2-e3",
            type: "multiple-choice",
            question: "What type of scoring function does AutoDock Vina use?",
            options: [
              "Pure quantum mechanical energy calculation",
              "An empirical scoring function trained on experimental binding data, combining van der Waals, hydrogen bonding, and hydrophobic terms",
              "A machine learning model trained from SMILES strings alone",
              "A force field with explicit water molecules",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: AutoDock Vina uses an empirical scoring function — a weighted sum of physical terms (vdW, H-bond, electrostatics, hydrophobic) with weights optimized by fitting to experimental binding data (PDBbind database). It is fast and reasonably accurate for ranking.\n\nReal example: AutoDock Vina can dock 10,000 compounds against a target in hours on a single workstation — making it the workhorse of academic virtual screening campaigns.\n\nWhy it matters: Knowing the scoring function type helps understand failure modes — empirical functions can fail for highly charged sites or unusual chemistry not in the training set.",
            explanation: "AutoDock Vina uses an empirical scoring function — physical interaction terms (vdW, H-bonds, hydrophobic) with weights fitted to experimental data. It balances speed with reasonable accuracy.",
          },
          {
            id: "l4-adv-m2-n2-e4",
            type: "fill-blank",
            question: "After docking, pose quality is evaluated by comparing the predicted pose to the crystal structure using ___ (Root Mean Square Deviation). A value below ___ Å indicates a successful prediction.",
            blanks: [
              { text: "pose quality metric abbreviation", answer: "RMSD", position: 0 },
              { text: "success threshold in Angstroms", answer: "2.0", position: 1 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: RMSD measures the average distance between corresponding atoms in two structures. For docking validation, the predicted pose is compared to the crystallographic pose — RMSD < 2.0 Å is the accepted threshold for a 'correct' pose prediction.\n\nReal example: In the D3R Grand Challenge (blind docking competition), top methods achieved RMSD < 2.0 Å for ~40% of test cases — leaving significant room for improvement.\n\nWhy it matters: RMSD validation is essential before using docking results — if the method cannot reproduce known poses, its predictions for novel compounds are unreliable.",
            explanation: "RMSD (Root Mean Square Deviation) measured in Angstroms compares predicted to crystallographic poses. RMSD < 2.0 Å is the standard threshold for a correct docking prediction.",
          },
          {
            id: "l4-adv-m2-n2-e5",
            type: "multiple-choice",
            question: "Oseltamivir (Tamiflu) was designed based on the structure of influenza neuraminidase. What type of inhibitor is it?",
            options: [
              "An allosteric inhibitor that changes neuraminidase conformation",
              "A competitive active-site inhibitor that mimics the sialic acid transition state, blocking cleavage of sialic acid from host cell surfaces",
              "A covalent inhibitor that permanently modifies the active site",
              "A PROTAC that degrades neuraminidase",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: Oseltamivir is a prodrug (converted to oseltamivir carboxylate in vivo). It is a competitive inhibitor mimicking the sialic acid transition state — fitting precisely into neuraminidase's active site and blocking viral budding from host cells.\n\nReal example: The active site of neuraminidase is highly conserved across influenza strains — explaining oseltamivir's broad-spectrum activity. Structure-based design from the crystal structure led to clinical approval.\n\nWhy it matters: Oseltamivir's development demonstrated the power of structure-based drug design — from crystal structure to clinical drug in under 10 years.",
            explanation: "Oseltamivir is a competitive active-site inhibitor mimicking the sialic acid transition state. It binds tightly to the conserved neuraminidase active site, preventing viral release from host cells.",
          },
          {
            id: "l4-adv-m2-n2-e6",
            type: "code-complete",
            question: "Complete the Python code to calculate RMSD between two sets of atom coordinates:",
            codeTemplate: `import numpy as np

def calculate_rmsd(coords1, coords2):
    """Calculate RMSD between two coordinate arrays (shape: N x 3)."""
    if len(coords1) != len(coords2):
        raise ValueError("Coordinate arrays must have same length")
    diff = coords1 - coords2
    squared_diff = ___  # element-wise squaring
    return np.sqrt(np.mean(squared_diff))

predicted = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0],
                       [7.0, 8.0, 9.0], [1.5, 2.5, 3.5],
                       [4.5, 5.5, 6.5]])
crystal   = np.array([[1.1, 2.1, 3.1], [4.0, 5.1, 6.0],
                       [7.2, 7.9, 9.1], [1.4, 2.6, 3.6],
                       [4.6, 5.4, 6.4]])
rmsd = calculate_rmsd(predicted, crystal)
print(f"RMSD: {rmsd:.3f} Å — {'Good' if rmsd < 2.0 else 'Poor'}")`,
            codeAnswer: `import numpy as np

def calculate_rmsd(coords1, coords2):
    """Calculate RMSD between two coordinate arrays (shape: N x 3)."""
    if len(coords1) != len(coords2):
        raise ValueError("Coordinate arrays must have same length")
    diff = coords1 - coords2
    squared_diff = diff ** 2  # element-wise squaring
    return np.sqrt(np.mean(squared_diff))

predicted = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0],
                       [7.0, 8.0, 9.0], [1.5, 2.5, 3.5],
                       [4.5, 5.5, 6.5]])
crystal   = np.array([[1.1, 2.1, 3.1], [4.0, 5.1, 6.0],
                       [7.2, 7.9, 9.1], [1.4, 2.6, 3.6],
                       [4.6, 5.4, 6.4]])
rmsd = calculate_rmsd(predicted, crystal)
print(f"RMSD: {rmsd:.3f} Å — {'Good' if rmsd < 2.0 else 'Poor'}")`,
            xpReward: 30,
            hint: "⚗️ TEACHING: RMSD = sqrt(mean(squared differences per atom per coordinate)). NumPy's element-wise `** 2` squares all values. This exact calculation is performed by docking validation tools like AutoDock, Glide, and DOCK.\n\nReal example: MDAnalysis and MDTraj implement this for real trajectories — handling periodic boundary conditions, alignment, and file I/O for GROMACS and AMBER formats.\n\nWhy it matters: RMSD is fundamental to computational chemistry — used in MD simulation analysis, NMR structure validation, and docking pose quality assessment.",
            explanation: "`diff ** 2` performs element-wise squaring of the difference array — the standard first step in RMSD: differences → square → mean → sqrt.",
          },
        ],
      },
      {
        id: "l4-adv-m2-n3",
        moduleId: "l4-adv-m2",
        title: "ADMET & Drug-Likeness",
        description: "Why most drug candidates fail — absorption, metabolism, toxicity, and the rules that predict failure",
        icon: "💊",
        xpReward: 170,
        exercises: [
          {
            id: "l4-adv-m2-n3-e1",
            type: "sequence-order",
            question: "Arrange the ADMET components in the order a drug encounters them after oral administration:",
            items: [
              "Excretion — elimination via kidneys (urine) or liver (bile/feces)",
              "Absorption — drug crosses the gut wall into systemic circulation",
              "Metabolism — liver CYP450 enzymes chemically transform the drug",
              "Toxicity — unwanted effects on off-target tissues",
              "Distribution — drug travels through blood to target tissues",
            ],
            correctOrder: [1, 4, 2, 0, 3],
            xpReward: 20,
            hint: "⚗️ TEACHING: After oral dosing: absorb across the gut wall (A), distribute to tissues via blood (D), metabolized by liver enzymes (M), eliminated via kidneys or bile (E), and ideally produce no toxicity (T). This sequence defines a drug's pharmacokinetic profile.\n\nReal example: Aspirin is rapidly absorbed, distributes throughout the body, metabolized to salicylate, excreted by kidneys, and generally well-tolerated — a good ADMET profile that's made it a century-old drug.\n\nWhy it matters: ~40% of drug failures in clinical trials are due to ADMET problems — early computational prediction saves enormous cost.",
            explanation: "Oral drug ADMET sequence: Absorption (gut) → Distribution (tissues) → Metabolism (liver) → Excretion (kidneys/bile) → Toxicity (if off-target). This is the pharmacokinetic lifecycle.",
          },
          {
            id: "l4-adv-m2-n3-e2",
            type: "multiple-choice",
            question: "A compound has MW = 550 Da, logP = 4.5, 3 hydrogen bond donors, and 9 hydrogen bond acceptors. Which Lipinski Rule of 5 does it violate?",
            options: [
              "It violates the HBD rule (must be ≤5)",
              "It violates the molecular weight rule (MW must be <500 Da)",
              "It violates the HBA rule (must be ≤10) and the MW rule",
              "It violates no rules — all properties are within limits",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: Lipinski's Rule of 5 for oral bioavailability: MW < 500 Da, logP < 5, HBD ≤ 5, HBA ≤ 10. The 550 Da MW alone violates the rule. The other properties are within limits.\n\nReal example: Many successful drugs violate Ro5 — atorvastatin (MW=558), erythromycin (MW=734) — but these use active transporters or are dosed parenterally. Ro5 predicts passive permeability.\n\nWhy it matters: Ro5 is a first-pass filter in drug optimization — compounds violating it require extra justification or active transport to achieve oral bioavailability.",
            explanation: "MW = 550 Da violates the MW < 500 Da rule. logP = 4.5 (<5 ✓), HBD = 3 (≤5 ✓), HBA = 9 (≤10 ✓). Only MW is violated.",
          },
          {
            id: "l4-adv-m2-n3-e3",
            type: "fill-blank",
            question: "Blocking the ___ cardiac potassium channel causes QT interval prolongation and potentially fatal arrhythmia — a toxicity liability screened in every drug discovery program.",
            blanks: [
              { text: "cardiac potassium channel name", answer: "hERG", position: 0 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: The hERG (human Ether-à-go-go Related Gene) channel repolarizes the heart after each beat. Blocking it delays repolarization, prolonging the QT interval — potentially triggering Torsades de Pointes, a fatal arrhythmia.\n\nReal example: Terfenadine (Seldane) was withdrawn because it blocked hERG — causing fatal arrhythmias when combined with CYP3A4 inhibitors that raised plasma levels. The incident established mandatory hERG screening.\n\nWhy it matters: hERG liability testing is now mandatory in drug development (FDA Safety Pharmacology guidance S7B). All candidates are screened computationally and experimentally.",
            explanation: "hERG channel blockade causes QT prolongation and potentially fatal arrhythmias. Multiple drug withdrawals (terfenadine, cisapride) established this as mandatory screening.",
          },
          {
            id: "l4-adv-m2-n3-e4",
            type: "matching",
            question: "Match each CYP450 enzyme to its key role in drug metabolism:",
            pairs: [
              { left: "CYP3A4", right: "Metabolizes ~50% of all drugs; inhibition by grapefruit juice can dangerously elevate drug plasma levels" },
              { left: "CYP2D6", right: "Metabolizes codeine to morphine; poor metabolizers get no pain relief, ultra-metabolizers risk overdose" },
              { left: "CYP2C9", right: "Metabolizes warfarin; genetic variants cause widely varying anticoagulation doses between patients" },
              { left: "CYP1A2", right: "Induced by cigarette smoking; metabolizes clozapine — smokers require higher antipsychotic doses" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: CYP450 enzymes are the liver's main drug-metabolizing machinery. CYP3A4 is the workhorse (50% of drugs), CYP2D6 and CYP2C9 have important pharmacogenomic variants, CYP1A2 is induced by environmental factors. Drug-drug interactions often occur when one drug inhibits the CYP metabolizing another.\n\nReal example: Simvastatin + clarithromycin — clarithromycin inhibits CYP3A4, causing simvastatin to accumulate → rhabdomyolysis (dangerous muscle destruction).\n\nWhy it matters: CYP interaction screening is now standard — both computational (in silico) and experimental (microsomal assays) are required in drug development.",
            explanation: "CYP3A4 metabolizes most drugs; CYP2D6 converts prodrugs like codeine with genetic variability; CYP2C9 controls warfarin metabolism; CYP1A2 is smoking-inducible.",
          },
          {
            id: "l4-adv-m2-n3-e5",
            type: "multiple-choice",
            question: "What property best predicts blood-brain barrier (BBB) penetration for small molecules?",
            options: [
              "High molecular weight (>500 Da) and many H-bond donors",
              "Low molecular weight, moderate lipophilicity (logP 1–4), low polar surface area (TPSA < 90 Å²), and few H-bond donors",
              "High water solubility and many charged groups",
              "High protein binding (>99%) and multiple aromatic rings",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: The BBB is a tight junction barrier with minimal paracellular transport. CNS drugs must passively permeate — requiring moderate lipophilicity (logP 1–4), low TPSA (<90 Å²), MW <450 Da, and ≤3 HBD. High TPSA and many HBDs predict poor CNS penetration.\n\nReal example: CNS drug rule of 5: MW < 450, logP 1–4, TPSA < 90 Å², HBD ≤ 3. Diazepam satisfies all criteria; metformin (TPSA = 91 Å²) does not penetrate the BBB.\n\nWhy it matters: ~98% of small molecules fail to penetrate the BBB — CNS drug development has the lowest success rates in pharma. Early TPSA/logP filtering saves enormous resources.",
            explanation: "BBB penetration favors: low MW, moderate logP, low TPSA (<90 Å²), few H-bond donors. High TPSA and many H-bond donors greatly reduce passive BBB permeation.",
          },
          {
            id: "l4-adv-m2-n3-e6",
            type: "multiple-choice",
            question: "What is Topological Polar Surface Area (TPSA) and why does it matter for drug absorption?",
            options: [
              "The 3D surface area of a molecule used to calculate volume",
              "The sum of surface area contributions from polar atoms (O, N, and attached H atoms) — a fast 2D predictor of membrane permeability and oral absorption",
              "The total charged surface area at physiological pH",
              "A measure of protein binding surface area",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: TPSA is calculated from 2D structure — it sums tabulated surface area fragments for polar atoms (O, N, H attached to O/N). TPSA < 140 Å² predicts adequate oral absorption; TPSA < 90 Å² predicts CNS penetration. It is fast to calculate and highly predictive.\n\nReal example: Verapamil (TPSA = 63 Å²) penetrates the BBB; metformin (TPSA = 91 Å²) does not — the TPSA difference explains their different CNS access.\n\nWhy it matters: TPSA is one of the fastest and most predictive ADMET filters — calculated in microseconds and used in early-stage compound triage before any synthesis.",
            explanation: "TPSA sums polar atom surface contributions from 2D structure. TPSA < 140 Å² → oral absorption; TPSA < 90 Å² → BBB penetration. Fast and predictive for early-stage filtering.",
          },
        ],
      },
    ],
  },

  {
    id: "l4-adv-m3",
    title: "Cutting-Edge Modalities",
    description: "Molecular dynamics, generative AI for molecules, and next-generation drugs — PROTACs, ADCs, and molecular glues",
    realm: 4 as Realm,
    color: "#c0a0ff",
    nodes: [
      {
        id: "l4-adv-m3-n1",
        moduleId: "l4-adv-m3",
        title: "Molecular Dynamics",
        description: "Simulating the movies of protein motion — from femtoseconds to microseconds",
        icon: "🔬",
        xpReward: 160,
        exercises: [
          {
            id: "l4-adv-m3-n1-e1",
            type: "multiple-choice",
            question: "What does a molecular dynamics (MD) force field define?",
            options: [
              "The external magnetic field applied to orient molecules",
              "Mathematical equations and parameters describing the potential energy of a molecular system — bonds, angles, dihedrals, van der Waals, and electrostatics",
              "The force required to break a protein apart experimentally",
              "The electric field inside a protein binding site",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: Force fields are the physical laws of MD simulations. They define: (1) bonded terms — bond stretching (harmonic), angle bending, dihedral rotation; (2) non-bonded terms — van der Waals (Lennard-Jones) and electrostatics (Coulomb). Parameters are derived from quantum mechanics and experiments.\n\nReal example: AMBER ff14SB is optimized for proteins; AMBER GAFF is for small molecules; CHARMM36 is widely used for lipids and membranes. Choosing the wrong force field for your molecule class gives inaccurate results.\n\nWhy it matters: Force field accuracy determines simulation reliability — force field validation before production MD runs saves wasted compute.",
            explanation: "Force fields define the mathematical potential energy function for all atomic interactions: bonded (bonds, angles, dihedrals) and non-bonded (van der Waals, electrostatics).",
          },
          {
            id: "l4-adv-m3-n1-e2",
            type: "matching",
            question: "Match each MD analysis metric to what it reveals about protein behavior:",
            pairs: [
              { left: "RMSD (Root Mean Square Deviation)", right: "Overall structural deviation from starting structure — reveals global conformational changes and simulation convergence" },
              { left: "RMSF (Root Mean Square Fluctuation)", right: "Per-residue flexibility over time — identifies rigid domains vs flexible loops" },
              { left: "Radius of gyration (Rg)", right: "Protein compactness — decreases when a disordered protein folds, increases upon unfolding" },
              { left: "Hydrogen bond count over time", right: "Stability of secondary structure and protein-ligand interactions throughout the simulation" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: MD analysis metrics capture different aspects of motion: RMSD tells you if the protein stays near its starting structure; RMSF identifies which parts are most mobile; Rg measures compactness; H-bond analysis tracks interaction stability.\n\nReal example: High RMSF in loop regions of a kinase often coincides with known flexible activation loops that shift between active and inactive states — revealing allosteric mechanisms.\n\nWhy it matters: Relying on RMSD alone misses important local dynamics — always combine multiple metrics for a complete picture of protein motion.",
            explanation: "RMSD = global deviation; RMSF = per-residue flexibility; Rg = compactness; H-bond count = interaction stability. Each captures a different dimension of protein dynamics.",
          },
          {
            id: "l4-adv-m3-n1-e3",
            type: "fill-blank",
            question: "The standard timestep in molecular dynamics simulations is ___ femtoseconds, chosen to be smaller than the fastest atomic vibration — the ___ bond stretch.",
            blanks: [
              { text: "standard timestep value", answer: "2", position: 0 },
              { text: "fastest bond type in proteins", answer: "C-H", position: 1 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: The MD timestep must be smaller than the fastest motion. C-H bonds vibrate at ~10¹⁴ Hz (period ~10 fs) — a 2 fs timestep safely samples this motion. SHAKE/LINCS constraints on C-H bonds allow 4 fs timesteps. GPU MD can simulate ~1 μs/day with 2 fs timesteps.\n\nReal example: A 1 μs simulation of a kinase-inhibitor complex requires 5×10⁸ steps at 2 fs — feasible in days on a GPU cluster, revealing conformational sampling that docking misses entirely.\n\nWhy it matters: Timestep choice is a fundamental tradeoff between accuracy and speed — too large causes instability, too small wastes computation.",
            explanation: "The 2 femtosecond timestep adequately samples C-H bond vibrations, the fastest motion in biological systems. SHAKE constraints can allow larger timesteps by removing high-frequency C-H vibrations.",
          },
          {
            id: "l4-adv-m3-n1-e4",
            type: "multiple-choice",
            question: "What is the main advantage of metadynamics over standard MD simulations?",
            options: [
              "It uses quantum mechanics for more accurate force calculations",
              "It adds a history-dependent bias potential to discourage revisiting conformational states, enabling sampling of rare events on much longer effective timescales",
              "It simulates multiple protein copies simultaneously to improve statistics",
              "It uses coarse-grained models to speed up simulation by 100x",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: Standard MD gets trapped in local energy minima and cannot cross barriers on accessible timescales. Metadynamics floods visited basins with Gaussian potentials, forcing exploration of new regions. Combined with reweighting, the true free energy landscape is recovered.\n\nReal example: Metadynamics was used to compute the free energy of penicillin binding to PBP2a — revealing cryptic allosteric pockets missed by X-ray crystallography.\n\nWhy it matters: Drug binding/unbinding occurs on millisecond-to-second timescales inaccessible to standard MD (nanoseconds-microseconds). Enhanced sampling bridges this gap.",
            explanation: "Metadynamics adds Gaussian penalty potentials to visited conformational states, preventing revisiting and enabling sampling of rare events and free energy surfaces.",
          },
          {
            id: "l4-adv-m3-n1-e5",
            type: "multiple-choice",
            question: "What key insight about drug binding does MD provide that static docking cannot?",
            options: [
              "MD predicts the exact binding pose with atomic precision",
              "MD reveals conformational selection and induced fit — protein motions that open cryptic pockets, gate binding, or modulate affinity dynamically",
              "MD always gives lower binding free energies than docking",
              "MD can predict the synthesis route to the drug molecule",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: Docking uses a single protein structure; MD simulates protein breathing over time. Key MD insights: (1) cryptic pockets that open transiently; (2) induced fit — protein conformational change upon ligand binding; (3) residence time (how long the drug stays bound); (4) water-mediated interactions.\n\nReal example: Imatinib (Gleevec) binds a DFG-out inactive conformation of ABL kinase — a cryptic pocket invisible in the active structure. MD revealed the DFG-flip kinetics explaining imatinib's selectivity.\n\nWhy it matters: Residence time (koff) is emerging as a better predictor of in vivo efficacy than static affinity — MD can predict it while docking cannot.",
            explanation: "MD reveals dynamic binding mechanisms: cryptic pocket opening, induced fit, water displacement, and residence time — all invisible to static docking.",
          },
          {
            id: "l4-adv-m3-n1-e6",
            type: "code-complete",
            question: "Complete the Python code to calculate per-residue RMSF from an MD trajectory:",
            codeTemplate: `import numpy as np

def calculate_rmsf(trajectory):
    """
    trajectory: numpy array of shape (n_frames, n_residues, 3)
    Returns: RMSF array of shape (n_residues,)
    """
    mean_positions = np.mean(trajectory, axis=___)  # average over frames
    deviations = trajectory - mean_positions[np.newaxis, :, :]
    squared_dev = np.sum(deviations ** 2, axis=2)  # sum over x,y,z
    return np.sqrt(np.mean(squared_dev, axis=0))

np.random.seed(42)
traj = np.random.randn(100, 10, 3) * 0.5  # 100 frames, 10 residues
rmsf = calculate_rmsf(traj)
print("Per-residue RMSF (Å):", np.round(rmsf, 3))`,
            codeAnswer: `import numpy as np

def calculate_rmsf(trajectory):
    """
    trajectory: numpy array of shape (n_frames, n_residues, 3)
    Returns: RMSF array of shape (n_residues,)
    """
    mean_positions = np.mean(trajectory, axis=0)  # average over frames
    deviations = trajectory - mean_positions[np.newaxis, :, :]
    squared_dev = np.sum(deviations ** 2, axis=2)  # sum over x,y,z
    return np.sqrt(np.mean(squared_dev, axis=0))

np.random.seed(42)
traj = np.random.randn(100, 10, 3) * 0.5  # 100 frames, 10 residues
rmsf = calculate_rmsf(traj)
print("Per-residue RMSF (Å):", np.round(rmsf, 3))`,
            xpReward: 30,
            hint: "⚗️ TEACHING: RMSF measures how much each residue fluctuates around its average position. Axis 0 is the frame dimension in a (frames, residues, 3) array — averaging over axis 0 gives the mean position per residue.\n\nReal example: MDAnalysis and MDTraj implement this calculation on real trajectories, handling periodic boundary conditions, alignment, and GROMACS/AMBER file formats.\n\nWhy it matters: High-RMSF residues in drug-binding pockets indicate flexibility relevant for explaining selectivity and designing conformationally selective inhibitors.",
            explanation: "`axis=0` averages over the trajectory frames dimension, giving mean position (n_residues, 3) for each residue — needed to calculate deviations and RMSF.",
          },
        ],
      },
      {
        id: "l4-adv-m3-n2",
        moduleId: "l4-adv-m3",
        title: "Generative AI for Drug Design",
        description: "Teaching AI to invent new molecules — from SMILES to VAEs, GANs, and diffusion models",
        icon: "🤖",
        xpReward: 180,
        exercises: [
          {
            id: "l4-adv-m3-n2-e1",
            type: "fill-blank",
            question: "___ notation encodes molecular structure as a human-readable string. For example, aspirin is CC(=O)Oc1ccccc1C(=O)O and caffeine is Cn1cnc2c1c(=O)n(c(=O)n2C)C.",
            blanks: [
              { text: "molecular string notation acronym", answer: "SMILES", position: 0 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: SMILES (Simplified Molecular Input Line Entry System) encodes molecules as text: atoms are their symbols, branches use parentheses, rings use numbers, lowercase letters indicate aromaticity. This text format enables ML models to process molecules as sequences.\n\nReal example: Aspirin SMILES = CC(=O)Oc1ccccc1C(=O)O — CC(=O)O is the acetyl group, c1ccccc1 is benzene, C(=O)O is carboxylic acid. RDKit can convert SMILES to 2D/3D structures in milliseconds.\n\nWhy it matters: SMILES is the universal language of cheminformatics — generative models (VAE, GAN, transformers) treat molecules as SMILES strings, applying NLP techniques to chemistry.",
            explanation: "SMILES (Simplified Molecular Input Line Entry System) is the universal text representation of chemical structures, enabling computational processing of molecules as character sequences.",
          },
          {
            id: "l4-adv-m3-n2-e2",
            type: "multiple-choice",
            question: "What are Morgan fingerprints (ECFP — Extended Connectivity Fingerprints)?",
            options: [
              "3D coordinates of atoms in a molecular structure",
              "Binary or count vectors encoding local chemical neighborhoods around each atom out to a specified radius — used for molecular similarity and ML features",
              "The sequence of atoms along the longest chain in a molecule",
              "A fingerprint of protein binding site electrostatics",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: Morgan/ECFP fingerprints work iteratively: (1) each atom gets an identifier based on its properties; (2) for each radius r, identifiers update by hashing local neighborhoods; (3) bits are set for each unique substructure found. ECFP4 = radius 2, ECFP6 = radius 3.\n\nReal example: Tanimoto similarity between ECFP4 fingerprints is the most common molecular similarity metric in drug discovery. Tanimoto > 0.4 = structurally similar; > 0.7 = highly similar.\n\nWhy it matters: Morgan fingerprints are the dominant feature representation for QSAR models, virtual screening, and compound library clustering — foundational to ML in drug discovery.",
            explanation: "Morgan/ECFP fingerprints encode circular atomic neighborhoods as bit vectors, capturing local chemical substructures. The standard feature representation for cheminformatics ML.",
          },
          {
            id: "l4-adv-m3-n2-e3",
            type: "multiple-choice",
            question: "How does a Variational Autoencoder (VAE) enable molecular generation?",
            options: [
              "It memorizes all known drug molecules and randomly outputs one",
              "It encodes molecules into a continuous latent space and decodes sampled points back to SMILES — interpolation and sampling in latent space generates novel molecules",
              "It downloads new molecules from a database when needed",
              "It combines two known drugs to generate a hybrid molecule",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: VAE for molecules: (1) Encoder converts SMILES to latent vector z; (2) Decoder regenerates SMILES from z; (3) At generation time, sample z from the latent distribution — novel SMILES emerge. Property optimization uses gradient ascent in latent space.\n\nReal example: Junction Tree VAE (JTVAE) encodes molecules as molecular graph trees, achieving >95% validity of generated molecules — compared to ~35% for simple character VAEs on SMILES.\n\nWhy it matters: VAEs provide a smooth molecular latent space enabling property-guided optimization — targeted navigation toward desired properties (high affinity, good ADMET), not just random generation.",
            explanation: "VAEs create a continuous latent space for molecules — encoding real molecules, sampling and decoding from the latent space generates novel structures. Optimization in latent space guides toward desired properties.",
          },
          {
            id: "l4-adv-m3-n2-e4",
            type: "matching",
            question: "Match each generative AI approach to its key characteristic for drug design:",
            pairs: [
              { left: "SMILES-based RNN", right: "Generates SMILES character-by-character — simple, effective, can be fine-tuned toward target properties" },
              { left: "Graph Neural Network (GNN)", right: "Works directly with molecular graph topology — avoids SMILES invalidity, naturally captures chemical bonding" },
              { left: "Diffusion model (DiffSBDD)", right: "Generates 3D ligand point clouds conditioned on protein binding pocket — directly structure-based design" },
              { left: "Reinforcement learning (REINVENT)", right: "Trains generator with reward from property predictors — explicit multi-objective property optimization" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: Each generative approach has a different inductive bias: RNNs treat molecules as sequences (fast but validity issues), GNNs treat them as graphs (chemically natural), diffusion models generate 3D structures, RL explicitly optimizes properties.\n\nReal example: AstraZeneca's REINVENT (SMILES-based RL) was used in production drug discovery — simultaneously optimizing for target affinity, selectivity, ADMET, and synthesizability.\n\nWhy it matters: No single generative approach dominates all scenarios — matching the method to the drug design problem requires understanding each approach's strengths.",
            explanation: "RNN = sequence-based; GNN = graph-based; diffusion = 3D structure-based; RL = property-optimizing. Each has distinct advantages for different drug design scenarios.",
          },
          {
            id: "l4-adv-m3-n2-e5",
            type: "multiple-choice",
            question: "How does the hit rate of generative AI drug design compare to traditional virtual screening?",
            options: [
              "Generative AI always outperforms virtual screening by 10x or more",
              "Traditional virtual screening has higher validated hit rates because generative AI produces unrealistic molecules",
              "Generative AI can enrich hit rates significantly (2–10x) over virtual screening in ideal cases, but real-world performance depends heavily on training data quality and property model accuracy",
              "Both methods have identical hit rates of about 0.01%",
            ],
            correctIndex: 2,
            xpReward: 20,
            hint: "⚗️ TEACHING: Head-to-head comparisons are rare, but generative AI shows promise for de novo scaffold generation against difficult targets. The challenge is that generative models can produce molecules scoring well computationally but failing experimentally — errors in property models compound. Synthesis feasibility is a key bottleneck.\n\nReal example: Insilico Medicine's generative design for USP1 inhibitor (ISM3412) reached Phase I trial — one of the first AI-generated drugs in human testing. But overall hit rates across published campaigns are highly variable.\n\nWhy it matters: Hype about generative AI must be balanced by realistic assessment — experimental validation rates, synthesis feasibility, and ADMET success determine real-world impact.",
            explanation: "Generative AI can improve hit rates 2–10x in favorable conditions, but real-world performance is highly variable. Training data quality, property prediction accuracy, and synthesis feasibility are critical.",
          },
          {
            id: "l4-adv-m3-n2-e6",
            type: "code-complete",
            question: "Complete the Python code to compute Tanimoto similarity between two molecules using Morgan fingerprints:",
            codeTemplate: `from rdkit import Chem
from rdkit.Chem import rdMolDescriptors, DataStructs

def tanimoto_similarity(smiles1, smiles2, radius=2, nbits=2048):
    """Compute Tanimoto similarity using Morgan (ECFP4) fingerprints."""
    mol1 = Chem.MolFromSmiles(smiles1)
    mol2 = Chem.MolFromSmiles(smiles2)
    if mol1 is None or mol2 is None:
        return None
    fp1 = rdMolDescriptors.GetMorganFingerprintAsBitVect(mol1, radius, nBits=nbits)
    fp2 = rdMolDescriptors.GetMorganFingerprintAsBitVect(mol2, radius, nBits=nbits)
    return DataStructs.___(fp1, fp2)

aspirin   = "CC(=O)Oc1ccccc1C(=O)O"
ibuprofen = "CC(C)Cc1ccc(cc1)C(C)C(=O)O"
sim = tanimoto_similarity(aspirin, ibuprofen)
print(f"Tanimoto similarity: {sim:.3f}")
print("Similar?" , "Yes" if sim > 0.4 else "No")`,
            codeAnswer: `from rdkit import Chem
from rdkit.Chem import rdMolDescriptors, DataStructs

def tanimoto_similarity(smiles1, smiles2, radius=2, nbits=2048):
    """Compute Tanimoto similarity using Morgan (ECFP4) fingerprints."""
    mol1 = Chem.MolFromSmiles(smiles1)
    mol2 = Chem.MolFromSmiles(smiles2)
    if mol1 is None or mol2 is None:
        return None
    fp1 = rdMolDescriptors.GetMorganFingerprintAsBitVect(mol1, radius, nBits=nbits)
    fp2 = rdMolDescriptors.GetMorganFingerprintAsBitVect(mol2, radius, nBits=nbits)
    return DataStructs.TanimotoSimilarity(fp1, fp2)

aspirin   = "CC(=O)Oc1ccccc1C(=O)O"
ibuprofen = "CC(C)Cc1ccc(cc1)C(C)C(=O)O"
sim = tanimoto_similarity(aspirin, ibuprofen)
print(f"Tanimoto similarity: {sim:.3f}")
print("Similar?" , "Yes" if sim > 0.4 else "No")`,
            xpReward: 30,
            hint: "⚗️ TEACHING: `DataStructs.TanimotoSimilarity(fp1, fp2)` computes |A∩B| / |A∪B| for bit vectors — the Jaccard coefficient. RDKit's DataStructs module also provides Dice and Cosine similarity. Tanimoto is the gold standard in medicinal chemistry.\n\nReal example: Scaffold hopping in drug design uses Tanimoto similarity to find structurally dissimilar molecules with similar bioactivity — finding new chemical series with different IP from known drugs.\n\nWhy it matters: Tanimoto drives compound library design, diversity selection, nearest-neighbor QSAR predictions, and patent landscape navigation.",
            explanation: "`DataStructs.TanimotoSimilarity()` computes the Jaccard/Tanimoto coefficient between two bit fingerprints: |A∩B|/|A∪B|. It ranges from 0 (no similarity) to 1 (identical).",
          },
        ],
      },
      {
        id: "l4-adv-m3-n3",
        moduleId: "l4-adv-m3",
        title: "PROTACs & Novel Modalities",
        description: "Beyond small molecules — bifunctional degraders, molecular glues, and antibody-drug conjugates",
        icon: "🧪",
        xpReward: 200,
        exercises: [
          {
            id: "l4-adv-m3-n3-e1",
            type: "sequence-order",
            question: "Arrange the steps of PROTAC-mediated target degradation in the correct mechanistic order:",
            items: [
              "The proteasome degrades the ubiquitinated target protein into short peptide fragments",
              "The PROTAC recruits an E3 ubiquitin ligase to the target protein, forming a ternary complex",
              "The PROTAC is released after degradation and can recruit another E3 ligase — catalytic turnover",
              "The E3 ligase polyubiquitinates the target protein (attaches a ubiquitin chain)",
              "The PROTAC molecule binds the target protein via its target warhead",
            ],
            correctOrder: [4, 1, 3, 0, 2],
            xpReward: 25,
            hint: "⚗️ TEACHING: PROTAC mechanism: (1) PROTAC warhead binds target; (2) E3 ligase ligand recruits E3; (3) ternary complex forms, E3 ubiquitinates target; (4) proteasome degrades ubiquitinated target; (5) PROTAC is released and repeats. This catalytic mechanism means one PROTAC degrades many target copies.\n\nReal example: ARV-110 (bavdegalutamide) targets androgen receptor in prostate cancer. It degrades AR even with point mutations that make direct inhibitors ineffective — a key advantage.\n\nWhy it matters: Catalytic degradation means PROTACs work at lower doses and overcome resistance caused by target overexpression or binding-site mutations.",
            explanation: "PROTAC mechanism: bind target → recruit E3 ligase → form ternary complex → ubiquitinate target → proteasomal degradation → PROTAC released for catalytic recycling.",
          },
          {
            id: "l4-adv-m3-n3-e2",
            type: "multiple-choice",
            question: "What is the 'hook effect' in PROTAC pharmacology?",
            options: [
              "The physical hook shape of the PROTAC linker region",
              "At very high PROTAC concentrations, separate binary complexes (PROTAC:target and PROTAC:E3) predominate over the productive ternary complex — reducing degradation efficiency",
              "The hook-shaped dose-response curve seen in kinase inhibitors",
              "The covalent hook formed between PROTAC and the target protein",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: At low concentrations, PROTAC forms productive ternary complexes. At saturating concentrations, PROTAC occupies all target and E3 ligase molecules separately — preventing ternary complex formation and reducing degradation. This creates an inverted-U dose-response curve.\n\nReal example: Many published PROTACs show reduced Dmax (maximal degradation) at high concentrations in Western blot assays — the telltale sign of the hook effect. Optimal PROTAC dosing must avoid this.\n\nWhy it matters: The hook effect means PROTAC dosing must be carefully optimized — more is not better. Clinical dosing regimens must stay in the effective window.",
            explanation: "The hook effect: excess PROTAC saturates target and E3 separately, preventing productive ternary complex formation. This creates a non-monotonic (inverted U) dose-response curve for target degradation.",
          },
          {
            id: "l4-adv-m3-n3-e3",
            type: "fill-blank",
            question: "Unlike PROTACs which are bifunctional, ___ glues stabilize a new protein-protein interaction between an E3 ligase and a neosubstrate target protein — recruiting the target for degradation without linking two separate binding warheads.",
            blanks: [
              { text: "drug modality type", answer: "molecular", position: 0 },
            ],
            xpReward: 20,
            hint: "⚗️ TEACHING: Molecular glues work by stabilizing a protein-protein interaction between an E3 ligase and a 'neosubstrate' — a protein not normally degraded by that E3. The small molecule reshapes the interface to create a new productive interaction surface rather than independently binding both proteins.\n\nReal example: Thalidomide and its analogs (lenalidomide, pomalidomide) are molecular glues — they cause CRBN E3 ligase to degrade Ikaros, Aiolos, and GSPT1, explaining both therapeutic activity and teratogenicity.\n\nWhy it matters: Molecular glues can access targets without structural pockets — degrading transcription factors and other undruggable proteins that also resist PROTACs through traditional binding.",
            explanation: "Molecular glues stabilize new protein-protein interactions between E3 ligases and neosubstrate targets — they don't need separate warheads for each protein like PROTACs.",
          },
          {
            id: "l4-adv-m3-n3-e4",
            type: "matching",
            question: "Match each novel drug modality to its key distinguishing feature:",
            pairs: [
              { left: "PROTAC (Proteolysis-Targeting Chimera)", right: "Bifunctional small molecule recruits E3 ligase to ubiquitinate and catalytically degrade target protein" },
              { left: "ADC (Antibody-Drug Conjugate)", right: "Antibody delivers cytotoxic payload directly to antigen-expressing tumor cells, sparing normal tissue" },
              { left: "Molecular glue", right: "Monofunctional small molecule stabilizes neosubstrate-E3 ligase interaction for targeted degradation" },
              { left: "Covalent inhibitor", right: "Forms permanent bond with a target residue (e.g., Cys or Lys), achieving sustained inhibition even after drug clearance" },
            ],
            xpReward: 25,
            hint: "⚗️ TEACHING: Each modality has a distinct mechanism: PROTACs = bifunctional catalytic degraders; ADCs = antibody-guided cytotoxin delivery; molecular glues = monofunctional PPI enhancers; covalent inhibitors = irreversible binders. These modalities expand the druggable space beyond classical inhibition.\n\nReal example: Kadcyla (ado-trastuzumab emtansine) is an ADC — trastuzumab delivers emtansine cytotoxin to HER2+ breast cancer cells, reducing mortality in patients who progressed on trastuzumab alone.\n\nWhy it matters: Each modality accesses different targets — PROTACs and molecular glues reach undruggable proteins; ADCs deliver cell-killing payloads with high specificity.",
            explanation: "PROTACs = bifunctional catalytic degraders; ADCs = antibody-guided cytotoxin delivery; molecular glues = PPI-stabilizing degraders; covalent inhibitors = irreversible target modification.",
          },
          {
            id: "l4-adv-m3-n3-e5",
            type: "multiple-choice",
            question: "ARV-110 (bavdegalutamide), one of the first PROTACs to enter Phase II clinical trials, targets which protein in which disease?",
            options: [
              "BCR-ABL kinase in chronic myeloid leukemia",
              "Androgen receptor (AR) in metastatic castration-resistant prostate cancer",
              "KRAS G12C in non-small cell lung cancer",
              "BRD4 bromodomain in multiple myeloma",
            ],
            correctIndex: 1,
            xpReward: 20,
            hint: "⚗️ TEACHING: ARV-110 was developed by Arvinas and targets the androgen receptor (AR) — the primary driver of prostate cancer growth. Unlike enzalutamide (an AR inhibitor), ARV-110 degrades AR entirely, overcoming resistance mutations like AR-F876L that render inhibitors ineffective.\n\nReal example: Phase I data showed ARV-110 achieved PSA responses in ~46% of patients who had failed enzalutamide and abiraterone. Patients with specific AR mutations (L702H) showed particularly strong responses.\n\nWhy it matters: ARV-110 validated the PROTAC concept in humans — proving that targeted protein degradation is achievable as a clinical therapeutic mechanism.",
            explanation: "ARV-110 targets the androgen receptor (AR) in metastatic castration-resistant prostate cancer. It degrades AR rather than just inhibiting it, overcoming resistance to enzalutamide.",
          },
          {
            id: "l4-adv-m3-n3-e6",
            type: "multiple-choice",
            question: "What fundamental advantage does PROTAC-mediated degradation have over traditional occupancy-based inhibition?",
            options: [
              "PROTACs are always smaller and easier to synthesize than traditional inhibitors",
              "Catalytic mechanism — one PROTAC molecule degrades many copies of the target, so efficacy depends on degradation rate rather than stoichiometric occupancy",
              "PROTACs always have better oral bioavailability than traditional drugs",
              "PROTACs can only be used against kinases and no other target class",
            ],
            correctIndex: 1,
            xpReward: 25,
            hint: "⚗️ TEACHING: Traditional inhibitors require continuous stoichiometric occupancy — enough drug at all times to occupy sufficient fraction of the target. PROTACs are catalytic: they tag a target, the proteasome degrades it, the PROTAC is released and tags another. Drug effects persist even after PROTAC is cleared — limited by protein resynthesis rate.\n\nReal example: Studies show 10 nM PROTAC can achieve the same efficacy as 1 μM of a traditional inhibitor against the same target — 100-fold dose advantage from catalytic degradation.\n\nWhy it matters: Catalytic degradation also eliminates residual activity — mutant proteins partially escaping inhibitors are still degraded if they can form a ternary complex.",
            explanation: "PROTACs work catalytically — one molecule degrades many target copies then is recycled. Inhibitors require stoichiometric occupancy. Efficacy depends on degradation rate vs protein synthesis rate.",
          },
        ],
      },
    ],
  },
];

export default modules;
