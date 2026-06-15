import type { Module } from "@/lib/types";

const level4ExtraModules: Module[] = [
  {
    id: "l4-m7",
    title: "Drug Discovery AI Pipeline",
    description: "From target identification to IND filing — accelerated by ML",
    realm: 4,
    color: "#00ffff",
    nodes: [
      {
        id: "l4-m7-n1",
        moduleId: "l4-m7",
        title: "Target Identification & Validation",
        description: "Finding the right protein to attack — and proving it matters",
        icon: "🎯",
        xpReward: 230,
        exercises: [
          {
            id: "l4-m7-n1-e1",
            type: "multiple-choice",
            question: "What is the key distinction between a 'druggable' target and a 'validated' target?",
            options: [
              "They are synonymous terms in drug discovery",
              "Druggable = has a binding site accessible to small molecules; Validated = modulating it actually affects the disease",
              "Druggable = already has approved drugs; Validated = in clinical trials",
              "Druggable = protein target; Validated = RNA target",
            ],
            correctIndex: 1,
            explanation: "Druggability: does the protein have a suitable binding pocket for a drug molecule? Validation: does modulating this target cause the desired biological effect in disease models? Many proteins are druggable (have pockets) but not validated, and some validated targets are 'undruggable' (flat surfaces, protein-protein interactions).",
            xpReward: 15,
          },
          {
            id: "l4-m7-n1-e2",
            type: "drag-drop",
            question: "Match each target ID method to its approach:",
            pairs: [
              { left: "GWAS (Genome-Wide Association Study)", right: "Find genomic variants associated with disease — genes near hits are candidate targets" },
              { left: "Phenotypic screening", right: "Screen compounds in disease-relevant cell models, then identify their targets" },
              { left: "Proteomics (thermal proteome profiling)", right: "Find proteins whose thermal stability changes with drug/disease state" },
              { left: "Mendelian Randomization", right: "Use genetic instruments to test if modulating a biomarker causally affects disease" },
            ],
            xpReward: 20,
          },
          {
            id: "l4-m7-n1-e3",
            type: "code-complete",
            question: "Build a target prioritization scorer that combines druggability, genetic evidence, and expression specificity:",
            starterCode: `import numpy as np

def prioritize_targets(targets_df):
    \"\"\"
    Score and rank targets. DataFrame columns:
    - druggability_score: 0-1 (1 = very druggable)
    - genetic_evidence: 0-1 (1 = strong GWAS/MR evidence)
    - tissue_specificity: 0-1 (1 = highly specific to disease tissue)
    - safety_flag: bool (True = known safety concern)

    Returns DataFrame sorted by composite score.
    \"\"\"
    df = targets_df.copy()

    # Composite score: weighted sum
    df['score'] = (0.3 * df['druggability_score'] +
                   0.5 * df['genetic_evidence'] +
                   0.2 * df['tissue_specificity'])

    # Penalize safety-flagged targets
    df.loc[df['safety_flag'], 'score'] = ___

    return df.sort_values('score', ascending=False)`,
            solution: `        df.loc[df['safety_flag'], 'score'] *= 0.5`,
            explanation: "Target prioritization combines multiple evidence streams. Genetic evidence gets highest weight (50%) — causal genetic links predict clinical success better than other criteria. Safety flags halve the score rather than eliminating targets entirely, since some safety issues can be managed.",
            xpReward: 25,
          },
          {
            id: "l4-m7-n1-e4",
            type: "fill-blank",
            question: "The concept of 'human genetic validation' is important because drugs with genetic support for their target have a ___× higher probability of success in clinical trials.",
            blanks: [{ text: "2", answer: "2", position: 0 }],
            explanation: "Nelson et al. (Nature Genetics, 2015) and follow-up analyses showed that genetic evidence from GWAS roughly doubles the probability of clinical success (~40% vs ~20%). This is why companies like Open Targets, AstraZeneca, and GSK have built human genetics at the core of their target ID strategies.",
            xpReward: 10,
          },
          {
            id: "l4-m7-n1-e5",
            type: "sequence-order",
            question: "Order the typical stages of drug discovery from target to clinic:",
            items: [
              "IND filing and Phase I clinical trial (first-in-human, safety)",
              "Target identification and validation",
              "Lead optimization — improve potency, selectivity, ADMET properties",
              "High-throughput screening (HTS) → hit identification → lead identification",
            ],
            correctOrder: [1, 3, 2, 0],
            xpReward: 20,
          },
          {
            id: "l4-m7-n1-e6",
            type: "multiple-choice",
            question: "What is the 'valley of death' in drug discovery?",
            options: [
              "The period when a drug causes serious adverse events in clinical trials",
              "The funding gap between promising preclinical results and the expensive clinical trials needed to advance",
              "The transition from in vitro to in vivo studies where most drugs fail",
              "The period after Phase III where drugs fail regulatory approval",
            ],
            correctIndex: 1,
            explanation: "The valley of death: promising academic/early-stage drug candidates often can't attract funding for the expensive IND-enabling studies and Phase I trials needed to move forward. Academic labs can't afford it; industry doesn't invest without proof-of-concept in humans. ~90% of drugs entering clinical trials fail, making investors risk-averse.",
            xpReward: 15,
          },
          {
            id: "l4-m7-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are ADMET properties that must be optimized during drug development:",
            options: ["Absorption", "Distribution", "Metabolism", "Efficacy", "Toxicity", "Excretion"],
            correctIndices: [0, 1, 2, 4, 5],
            explanation: "ADMET = Absorption, Distribution, Metabolism, Excretion, Toxicity. 'Efficacy' is not part of the ADMET acronym — it's the primary pharmacodynamic property but evaluated separately. ADMET concerns the pharmacokinetics (what the body does to the drug).",
            xpReward: 15,
          },
          {
            id: "l4-m7-n1-e8",
            type: "free-text",
            question: "Explain how AI is being used to reduce the 'ADMET cliff' problem in drug optimization.",
            rubric: ["ADMET", "model", "predict", "toxicity", "absorption", "optimization", "scaffold", "in silico"],
            minKeywords: 3,
            explanation: "The ADMET cliff: improving potency often worsens ADMET (e.g., adding lipophilicity improves binding but kills solubility). AI approaches: train ADMET predictors on large experimental datasets (Tox21, CHEMBL), use multi-objective optimization (Pareto front across potency + ADMET scores), generative models conditioned on desired ADMET profiles, and active learning loops with rapid experimental feedback to iteratively improve predictions.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "l4-m7-n2",
        moduleId: "l4-m7",
        title: "Virtual Screening & Docking at Scale",
        description: "Screening billions of molecules computationally before synthesizing one",
        icon: "💊",
        xpReward: 240,
        exercises: [
          {
            id: "l4-m7-n2-e1",
            type: "multiple-choice",
            question: "What is the key advantage of structure-based virtual screening (SBVS) over ligand-based VS?",
            options: [
              "SBVS is always faster",
              "SBVS uses the 3D protein structure to identify binding modes, enabling discovery of chemically novel actives",
              "SBVS doesn't require any knowledge of existing active compounds",
              "Both B and C",
            ],
            correctIndex: 3,
            explanation: "SBVS (docking) uses the protein structure directly — no known actives needed. This enables de novo discovery of novel chemotypes that share no structural similarity with known drugs. Ligand-based VS (pharmacophore, shape) requires known actives but is faster and applicable when no structure exists.",
            xpReward: 15,
          },
          {
            id: "l4-m7-n2-e2",
            type: "drag-drop",
            question: "Match each docking scoring function type to its description:",
            pairs: [
              { left: "Force field-based", right: "Uses molecular mechanics energy terms (van der Waals, electrostatics) — physically grounded but slow" },
              { left: "Empirical scoring", right: "Weighted sum of physical terms trained against experimental affinities — GlideScore, Vina" },
              { left: "Knowledge-based", right: "Derives potentials from statistical preferences seen in protein-ligand crystal structures" },
              { left: "ML-based (DeepDocking, EquiBind)", right: "Trained on large datasets of known poses/affinities — fast, but accuracy depends on training domain" },
            ],
            xpReward: 20,
          },
          {
            id: "l4-m7-n2-e3",
            type: "code-complete",
            question: "Filter a virtual screening library for drug-likeness using Lipinski's Rule of Five:",
            starterCode: `def lipinski_filter(molecules):
    \"\"\"
    Filter molecules by Lipinski Ro5 criteria.
    Each molecule is a dict with: MW, HBD, HBA, logP
    Ro5: MW <= 500, HBD <= 5, HBA <= 10, logP <= 5
    \"\"\"
    passed = []
    for mol in molecules:
        ro5_violations = sum([
            mol['MW'] > 500,
            mol['HBD'] > 5,
            mol['HBA'] > 10,
            mol['logP'] > 5,
        ])
        # Accept molecules with at most 1 violation (extended Ro5)
        if ___:
            passed.append(mol)
    return passed`,
            solution: `        if ro5_violations <= 1:`,
            explanation: "Lipinski's Rule of Five (1997) predicts oral bioavailability: MW≤500, HBD≤5, HBA≤10, logP≤5. The extended rule allows 1 violation. Note: biologics (antibiotics, natural products) often violate Ro5 yet are orally bioavailable, so Ro5 has evolved (e.g., 'beyond Ro5' space for larger molecules).",
            xpReward: 25,
          },
          {
            id: "l4-m7-n2-e4",
            type: "fill-blank",
            question: "Modern ultra-large virtual screening can dock over _____ billion compounds using GPU-accelerated tools like Glide SP, FRED, or DockStream.",
            blanks: [{ text: "1", answer: "1", position: 0 }],
            explanation: "The Enamine REAL Space contains ~48 billion make-on-demand compounds. GPU-accelerated docking (DockGPU, AutoDock-GPU) and ML-based surrogate screening enable screening at this scale. Recent campaigns (Lyu et al., Nature 2019 — 170M compounds; Gorgulla et al., Nature 2020 — VirtualFlow >1B) demonstrate the scale now possible.",
            xpReward: 10,
          },
          {
            id: "l4-m7-n2-e5",
            type: "sequence-order",
            question: "Order the typical virtual screening funnel from largest to smallest set:",
            items: [
              "In vitro biochemical assay validation (~100-1000 compounds)",
              "Commercial database / enumerated library (~10^9-10^12 compounds)",
              "Rigid docking / pharmacophore filter (~10^6-10^8 compounds)",
              "Flexible docking / accurate scoring (~10^4-10^6 compounds)",
            ],
            correctOrder: [1, 2, 3, 0],
            xpReward: 20,
          },
          {
            id: "l4-m7-n2-e6",
            type: "multiple-choice",
            question: "What is the 'docking pose' vs 'binding affinity' distinction and why does it matter?",
            options: [
              "They are the same concept",
              "A pose predicts the 3D binding conformation; affinity predicts ΔG — both can be wrong independently",
              "Poses are experimental; affinity is computational",
              "Docking pose accuracy always correlates with predicted affinity",
            ],
            correctIndex: 1,
            explanation: "Docking failure modes: (1) wrong pose (correct affinity but ligand placed incorrectly — misleads SAR interpretation), (2) correct pose but wrong affinity (bad ranking — misses the best compound), (3) both wrong. Pose accuracy is evaluated by RMSD to crystal structure; affinity by correlation with experimental IC50/Kd. Both must be validated separately.",
            xpReward: 15,
          },
          {
            id: "l4-m7-n2-e7",
            type: "tap-correct",
            question: "Tap ALL methods that go beyond rigid docking to account for protein flexibility:",
            options: [
              "Induced fit docking (IFD)",
              "Ensemble docking",
              "MD-based docking (MDock)",
              "Covalent docking",
              "WaterMap analysis",
            ],
            correctIndices: [0, 1, 2],
            explanation: "Induced fit docking (IFD — Schrödinger) allows binding site residues to move. Ensemble docking uses multiple protein conformations from MD. MD-based docking samples conformational space. Covalent docking handles reactive warheads (irreversible inhibitors) but doesn't specifically address protein flexibility. WaterMap analyzes binding site hydration — related but not a protein flexibility method.",
            xpReward: 15,
          },
          {
            id: "l4-m7-n2-e8",
            type: "free-text",
            question: "Explain the 'activity cliff' phenomenon in drug discovery and how ML models typically handle it.",
            rubric: ["activity cliff", "similar structure", "different activity", "SAR", "discontinuous", "QSAR", "local model"],
            minKeywords: 3,
            explanation: "Activity cliffs: pairs of structurally very similar molecules (e.g., one methyl group difference) that have dramatically different activities (e.g., 1000-fold difference in IC50). Most ML QSAR models assume smooth structure-activity landscapes (similar structure = similar activity) — cliffs violate this. Consequences: models confidently predict the wrong activity near cliffs. Solutions: use matched molecular pairs (MMPs) to identify cliffs explicitly in training, use local models, or uncertainty quantification to flag cliff regions.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l4-m8",
    title: "Genome-Scale Metabolic Modeling",
    description: "Constraint-based modeling to predict cellular metabolism at systems scale",
    realm: 4,
    color: "#39ff14",
    nodes: [
      {
        id: "l4-m8-n1",
        moduleId: "l4-m8",
        title: "Flux Balance Analysis (FBA)",
        description: "Optimizing metabolic flux through thousands of reactions simultaneously",
        icon: "🔄",
        xpReward: 245,
        exercises: [
          {
            id: "l4-m8-n1-e1",
            type: "multiple-choice",
            question: "What is the key assumption of Flux Balance Analysis (FBA)?",
            options: [
              "Metabolite concentrations must be measured to run FBA",
              "Metabolic fluxes are at steady state — metabolite concentrations don't change over time",
              "All enzymatic reactions are reversible",
              "The cell maximizes all metabolites simultaneously",
            ],
            correctIndex: 1,
            explanation: "FBA's core assumption: steady-state — the rate of production of every internal metabolite equals its rate of consumption (∑ S·v = 0, where S is the stoichiometric matrix and v is the flux vector). This constraint-based approach allows optimization without requiring kinetic parameters.",
            xpReward: 15,
          },
          {
            id: "l4-m8-n1-e2",
            type: "fill-blank",
            question: "In FBA, the objective function is typically to maximize _____ (cellular growth rate), which corresponds to the biomass reaction.",
            blanks: [{ text: "biomass", answer: "biomass", position: 0 }],
            explanation: "The biomass objective: a cell wants to grow. In genome-scale models (GEMs), a 'biomass reaction' consumes the cell's building blocks (amino acids, nucleotides, lipids, cofactors) in the ratios needed for growth. Maximizing its flux = maximizing growth rate.",
            xpReward: 10,
          },
          {
            id: "l4-m8-n1-e3",
            type: "drag-drop",
            question: "Match each GEM concept to its definition:",
            pairs: [
              { left: "Stoichiometric matrix (S)", right: "Matrix where rows = metabolites, columns = reactions; entries = stoichiometric coefficients" },
              { left: "Exchange reaction", right: "Allows metabolites to enter or leave the system — represents nutrient uptake or secretion" },
              { left: "Gene-protein-reaction (GPR) rule", right: "Boolean logic linking genes to enzymes to reactions — enables gene deletion studies" },
              { left: "Shadow price", right: "Dual variable of the LP — how much biomass increases per unit increase in a metabolite's bound" },
            ],
            xpReward: 20,
          },
          {
            id: "l4-m8-n1-e4",
            type: "code-complete",
            question: "Implement FBA for a simple 3-reaction network using scipy's linear programming:",
            starterCode: `import numpy as np
from scipy.optimize import linprog

def simple_fba():
    \"\"\"
    Toy FBA: 3 reactions, 2 metabolites
    R1: A -> B (v1)
    R2: B -> C (v2, objective)
    R3: A -> C (v3)
    Steady state: S @ v = 0
    Bounds: 0 <= v <= 10
    Maximize v2 (growth = R2 flux)
    \"\"\"
    # Stoichiometric matrix (2 metabolites x 3 reactions)
    S = np.array([[-1, 0, -1],   # metabolite A: consumed by R1 and R3
                  [ 1, -1, 0]])  # metabolite B: produced by R1, consumed by R2

    # linprog minimizes, so negate objective to maximize v2
    c = ___  # objective: maximize v2 (index 1)

    # Equality constraints (steady state): S @ v = 0
    bounds = [(0, 10)] * 3
    result = linprog(c, A_eq=S, b_eq=np.zeros(2), bounds=bounds)
    return -result.fun, result.x  # return max v2 and flux vector`,
            solution: `    c = [0, -1, 0]  # objective: maximize v2 (index 1)`,
            explanation: "FBA is a linear program: minimize c·v subject to S·v=0 (steady state) and lb≤v≤ub (bounds). We negate the objective to maximize. The solution gives optimal fluxes — here, all flux goes through R1→R2 (v1=v2=10, v3=0) since R2 is the objective.",
            xpReward: 25,
          },
          {
            id: "l4-m8-n1-e5",
            type: "multiple-choice",
            question: "What is gene essentiality in the context of genome-scale metabolic models?",
            options: [
              "Genes that are expressed at the highest level",
              "A gene whose in silico deletion reduces predicted growth to zero (or below a threshold)",
              "Genes shared between bacteria and humans",
              "Genes that catalyze the most reactions",
            ],
            correctIndex: 1,
            explanation: "In silico single gene knockouts: delete a gene → remove the enzyme it encodes → constrain the corresponding reaction flux to 0. If this reduces predicted biomass to ~0, the gene is 'essential'. GEMs predict essential genes with ~80% accuracy vs. experimental essentiality screens — useful for identifying antibiotic targets.",
            xpReward: 15,
          },
          {
            id: "l4-m8-n1-e6",
            type: "sequence-order",
            question: "Order the steps to build a genome-scale metabolic model for a new organism:",
            items: [
              "Gap filling — add reactions to ensure model can produce all biomass components",
              "Annotate genome — identify all metabolic genes using RAST, Prokka, or manual curation",
              "Validate against experimental data (growth phenotypes, exchange fluxes)",
              "Build draft model using ModelSEED or CarveMe — assign reactions from biochemical databases",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 20,
          },
          {
            id: "l4-m8-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are extensions of basic FBA that account for its limitations:",
            options: [
              "parsimonious FBA (pFBA) — minimizes total flux",
              "Dynamic FBA (dFBA) — time-varying bounds",
              "Ensemble FBA — accounts for model uncertainty",
              "Regularized FBA (rFBA)",
              "Context-specific FBA (using RNA-seq to constrain active reactions)",
            ],
            correctIndices: [0, 1, 4],
            explanation: "pFBA, dFBA, and context-specific FBA (GIMME, INIT, FASTCORE) are all established methods. 'Ensemble FBA' and 'Regularized FBA' as described are not established standardized methods in the GEM literature.",
            xpReward: 15,
          },
          {
            id: "l4-m8-n1-e8",
            type: "free-text",
            question: "Describe two limitations of FBA and how researchers have addressed them.",
            rubric: ["steady state", "kinetics", "thermodynamics", "regulation", "gene expression", "pFBA", "dynamic", "context"],
            minKeywords: 3,
            explanation: "FBA limitations: (1) Assumes steady state — doesn't capture transient dynamics. Solution: Dynamic FBA (dFBA) updates bounds as metabolite pools change over time. (2) No regulatory constraints — all thermodynamically feasible reactions assumed active. Solution: GIMME, INIT integrate gene expression (RNA-seq) to deactivate reactions with low expression, making models context-specific. (3) Assumes optimal behavior — cells may not maximize growth (e.g., under stress). Solution: multi-objective or parsimonious FBA (minimize total flux while achieving near-optimal growth).",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l4-m9",
    title: "Spatial Biology & Spatial Omics",
    description: "Mapping molecular data to physical space in tissues",
    realm: 4,
    color: "#f59e0b",
    nodes: [
      {
        id: "l4-m9-n1",
        moduleId: "l4-m9",
        title: "Spatial Transcriptomics",
        description: "Gene expression with X,Y coordinates — biology in 2D and 3D",
        icon: "🗺️",
        xpReward: 250,
        exercises: [
          {
            id: "l4-m9-n1-e1",
            type: "multiple-choice",
            question: "What does spatial transcriptomics add over bulk or single-cell RNA-seq?",
            options: [
              "Higher sequencing depth per cell",
              "The physical location of gene expression within the tissue — preserving spatial context",
              "Faster library preparation",
              "Better detection of low-abundance transcripts",
            ],
            correctIndex: 1,
            explanation: "Spatial transcriptomics preserves where each gene is expressed within the tissue — critical for understanding cell-cell communication, tumor microenvironments, tissue gradients, and niche effects that are lost when you dissociate tissue into single cells.",
            xpReward: 10,
          },
          {
            id: "l4-m9-n1-e2",
            type: "drag-drop",
            question: "Match each spatial transcriptomics platform to its key distinguishing feature:",
            pairs: [
              { left: "10x Visium", right: "Spots (~55 μm) with barcoded capture probes — transcriptome-wide, 1-10 cells/spot" },
              { left: "MERFISH / seqFISH+", right: "Single-molecule imaging — subcellular resolution, targeted gene panels (1000+ genes)" },
              { left: "Slide-seq v2", right: "10 μm bead array — near-single-cell resolution, transcriptome-wide" },
              { left: "Xenium (10x)", right: "In situ sequencing on tissue sections — single-cell resolution, fixed panels" },
            ],
            xpReward: 20,
          },
          {
            id: "l4-m9-n1-e3",
            type: "code-complete",
            question: "Compute Moran's I spatial autocorrelation statistic to test if a gene is spatially clustered:",
            starterCode: `import numpy as np

def morans_i(expression, coordinates):
    \"\"\"
    Compute Moran's I for spatial autocorrelation.
    expression: array of gene expression values per spot
    coordinates: array of (x, y) coordinates per spot
    Returns: Moran's I statistic (-1=dispersed, 0=random, 1=clustered)
    \"\"\"
    n = len(expression)
    z = expression - expression.mean()

    # Build inverse distance weight matrix
    W = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            if i != j:
                dist = np.linalg.norm(coordinates[i] - coordinates[j])
                W[i, j] = ___

    W_sum = W.sum()
    numerator = n * np.sum(W * np.outer(z, z))
    denominator = W_sum * np.sum(z**2)
    return numerator / denominator`,
            solution: `                W[i, j] = 1.0 / dist`,
            explanation: "Moran's I measures spatial autocorrelation. Values near 1 = clustered (similar expression neighbors), near -1 = dispersed (dissimilar neighbors), near 0 = random. Spatially variable genes (SVGs) with high Moran's I are biologically interesting — they mark spatial domains like tumor cores, immune infiltrates, or tissue layers.",
            xpReward: 25,
          },
          {
            id: "l4-m9-n1-e4",
            type: "fill-blank",
            question: "The _____ problem in spatial transcriptomics refers to the difficulty of assigning multiple cell types when a single spot/pixel contains multiple cells.",
            blanks: [{ text: "deconvolution", answer: "deconvolution", position: 0 }],
            explanation: "Deconvolution: most spatial platforms have spots larger than a single cell (Visium spots average 3-10 cells). Methods like RCTD, SPOTlight, and Cell2location use scRNA-seq references to estimate the proportion of each cell type within each spot — 'deconvolving' the mixture.",
            xpReward: 10,
          },
          {
            id: "l4-m9-n1-e5",
            type: "multiple-choice",
            question: "What is cell-cell communication analysis in spatial data and why does spatial context improve it?",
            options: [
              "It studies how cells move between tissues",
              "It infers ligand-receptor interactions — spatial data allows restricting to physically proximal cells",
              "It identifies genes co-expressed across all cells in a tissue",
              "It measures direct cell contact via imaging",
            ],
            correctIndex: 1,
            explanation: "Cell-cell communication (CCC): ligand from cell A binds receptor on cell B. Without spatial data (bulk/scRNA-seq), you analyze all possible sender-receiver pairs. With spatial data: restrict to cells within physical proximity (e.g., <100 μm), dramatically reducing false positives and revealing spatially organized signaling axes (e.g., tumor cells speaking to adjacent macrophages).",
            xpReward: 15,
          },
          {
            id: "l4-m9-n1-e6",
            type: "sequence-order",
            question: "Order the steps in a spatial transcriptomics data analysis pipeline:",
            items: [
              "Spatial domain identification — cluster spots by expression + location",
              "Tissue imaging, library preparation, and sequencing",
              "Read alignment and spot barcode demultiplexing (SpaceRanger)",
              "Normalization, QC, spatially variable gene identification",
            ],
            correctOrder: [1, 2, 3, 0],
            xpReward: 20,
          },
          {
            id: "l4-m9-n1-e7",
            type: "tap-correct",
            question: "Tap ALL analysis tools commonly used for spatial transcriptomics data:",
            options: ["Squidpy", "BANKSY", "stLearn", "SpatialDE", "CellChat", "CellPhoneDB"],
            correctIndices: [0, 1, 2, 3, 4, 5],
            explanation: "Squidpy (spatial analysis in Python, scverse ecosystem), BANKSY (spatial clustering using neighbor expression), stLearn (transfer learning + spatial), SpatialDE (spatially variable gene detection), CellChat (CCC inference), CellPhoneDB (curated CCC database + analysis) — all are real, actively used tools.",
            xpReward: 15,
          },
          {
            id: "l4-m9-n1-e8",
            type: "free-text",
            question: "Describe how spatial transcriptomics has changed our understanding of tumor microenvironments compared to what we could learn from bulk RNA-seq.",
            rubric: ["spatial", "tumor", "immune", "microenvironment", "neighborhood", "heterogeneity", "niches", "gradient"],
            minKeywords: 3,
            explanation: "Bulk RNA-seq: average expression across all cells — hides spatial organization. Spatial ST reveals: (1) spatial gradients from tumor core to invasive front to immune infiltrate, (2) immune exclusion zones where T cells are blocked at certain spatial boundaries, (3) spatially organized CAF subtypes near vs. far from tumor, (4) communication axes (e.g., tumor cells expressing CXCL12 attract CXCR4+ T cells to specific niches), (5) heterogeneous tumor subclones occupying distinct spatial territories. This spatial map is essential for understanding why immune therapies succeed or fail.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
];

export default level4ExtraModules;
