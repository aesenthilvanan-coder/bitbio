import type { Module } from "@/lib/types";

const level4Modules: Module[] = [
  {
    id: "l4-m1",
    title: "Structural Biology",
    description: "Why shape determines function — and 50 years of the folding problem",
    realm: 4,
    color: "#00ffff",
    nodes: [
      {
        id: "l4-m1-n1",
        moduleId: "l4-m1",
        title: "Protein Structure Hierarchy",
        description: "Primary through quaternary — shape as function",
        icon: "🔮",
        xpReward: 220,
        exercises: [
          {
            id: "l4-m1-n1-e1",
            type: "sequence-order",
            question: "Put the levels of protein structure in order from simplest to most complex:",
            items: ["Quaternary — multiple subunits assembled together", "Secondary — α-helices and β-sheets", "Primary — amino acid sequence", "Tertiary — full 3D fold of a single chain"],
            correctOrder: [2, 1, 3, 0],
            xpReward: 20,
          },
          {
            id: "l4-m1-n1-e2",
            type: "multiple-choice",
            question: "What drives protein folding in an aqueous environment?",
            options: [
              "Covalent bonds only",
              "The hydrophobic effect — hydrophobic amino acids bury themselves away from water",
              "Disulfide bridges always",
              "The sequence determines folding through an unknown mechanism",
            ],
            correctIndex: 1,
            explanation: "The hydrophobic effect is the dominant driving force: nonpolar residues cluster in the protein core (away from water), while hydrophilic residues stay on the surface. Entropy of water is key.",
            xpReward: 15,
          },
          {
            id: "l4-m1-n1-e3",
            type: "drag-drop",
            question: "Match the experimental method to its structural biology application:",
            pairs: [
              { left: "X-ray crystallography", right: "High-resolution structures of crystallizable proteins — requires crystals" },
              { left: "Cryo-EM", right: "Near-atomic resolution of large complexes in near-native state — doesn't need crystals" },
              { left: "NMR spectroscopy", right: "Solution structures of small proteins (<50 kDa) — gives dynamics info" },
              { left: "AlphaFold2", right: "Computational structure prediction from sequence alone — no experiment needed" },
            ],
            xpReward: 20,
          },
          {
            id: "l4-m1-n1-e4",
            type: "multiple-choice",
            question: "What is Anfinsen's dogma and why is it significant?",
            options: [
              "Proteins always require chaperones to fold",
              "The amino acid sequence contains all the information necessary to specify the 3D structure",
              "Proteins can only fold in aqueous environments",
              "All proteins have similar folds",
            ],
            correctIndex: 1,
            explanation: "Anfinsen denatured RNase A with urea and showed it refolded to full activity — proving sequence encodes structure. This is the theoretical basis for computational structure prediction.",
            xpReward: 20,
          },
          {
            id: "l4-m1-n1-e5",
            type: "free-text",
            question: "The 'protein folding problem' was considered unsolved for ~50 years before AlphaFold2. Explain: (1) what exactly the problem is, (2) why it's hard (Levinthal's paradox), and (3) how AlphaFold2 approached it differently.",
            rubric: ["defines folding problem (sequence → structure)", "Levinthal's paradox (exponential conformational space)", "AlphaFold uses evolutionary covariation/MSA + deep learning"],
            xpReward: 50,
          },
        ],
      },
    ],
  },
  {
    id: "l4-m2",
    title: "AlphaFold — Deep Dive",
    description: "The architecture that cracked a 50-year-old problem",
    realm: 4,
    color: "#a855f7",
    nodes: [
      {
        id: "l4-m2-n1",
        moduleId: "l4-m2",
        title: "The Evoformer Architecture",
        description: "How evolutionary information predicts structure",
        icon: "🧬",
        xpReward: 280,
        exercises: [
          {
            id: "l4-m2-n1-e1",
            type: "multiple-choice",
            question: "What is a Multiple Sequence Alignment (MSA) and why does AlphaFold2 use it?",
            options: [
              "An alignment of multiple reads from sequencing — used to call variants",
              "An alignment of the same protein sequence from different organisms — encodes evolutionary constraints on structure",
              "A matrix of sequence quality scores",
              "A method to find repeats in the genome",
            ],
            correctIndex: 1,
            explanation: "When two positions in a protein co-vary across evolution (mutate together in different species), they're likely in contact in 3D space. The MSA captures this evolutionary covariation as structural information.",
            xpReward: 25,
          },
          {
            id: "l4-m2-n1-e2",
            type: "multiple-choice",
            question: "What does 'co-evolution' of two residue positions in an MSA imply about their spatial relationship?",
            options: [
              "They are far apart — distant residues evolve together",
              "They are likely in contact in the 3D structure — mutations in one are compensated by mutations in the other",
              "They are both on the protein surface",
              "They have the same amino acid identity",
            ],
            correctIndex: 1,
            explanation: "If residue A mutates to something incompatible with residue B, the protein would misfold and die. So co-variation = structural contact. This is the evolutionary signal AlphaFold exploits.",
            xpReward: 20,
          },
          {
            id: "l4-m2-n1-e3",
            type: "drag-drop",
            question: "Match the AlphaFold2 component to its function:",
            pairs: [
              { left: "Evoformer", right: "Iteratively updates sequence and pair representations using attention — processes evolutionary information" },
              { left: "Structure Module", right: "Converts abstract representations to 3D coordinates using invariant point attention" },
              { left: "pLDDT score", right: "Per-residue confidence (0-100) — higher = model is confident about that position" },
              { left: "PAE (Predicted Aligned Error)", right: "2D map showing confidence in relative position of residue pairs — detects multi-domain uncertainty" },
            ],
            xpReward: 25,
          },
          {
            id: "l4-m2-n1-e4",
            type: "multiple-choice",
            question: "A predicted structure has pLDDT scores of 90 in the core domain and 30 in a loop region. How should you interpret this?",
            options: [
              "The loop is predicted to be disordered or unstructured — both the prediction and the protein itself may lack a defined conformation here",
              "The loop is incorrectly modeled — run a better predictor",
              "The core domain is less reliable",
              "The scores indicate sequence conservation, not confidence",
            ],
            correctIndex: 0,
            explanation: "Low pLDDT often indicates intrinsically disordered regions — regions without a fixed structure. AlphaFold is telling you it can't predict this because the protein itself may not have a stable fold there.",
            xpReward: 20,
          },
          {
            id: "l4-m2-n1-e5",
            type: "free-text",
            question: "AlphaFold2 was called a 'rupture event' in biology. Critically evaluate: what can AlphaFold2 do, what can't it do, and what open problems remain in structural biology that it doesn't solve?",
            rubric: ["correctly describes capabilities (monomer/multimer structure prediction)", "limitations (dynamics, ligand binding, conformational changes, disordered regions)", "open problems mentioned (protein design, ensemble, binding affinities)"],
            xpReward: 60,
          },
        ],
      },
    ],
  },
  {
    id: "l4-m3",
    title: "Graph Neural Networks for Biology",
    description: "Molecular graphs, message passing, and drug-target interaction",
    realm: 4,
    color: "#f59e0b",
    nodes: [
      {
        id: "l4-m3-n1",
        moduleId: "l4-m3",
        title: "Graphs as Molecular Representations",
        description: "Atoms as nodes, bonds as edges — learning from molecules",
        icon: "🕸️",
        xpReward: 260,
        exercises: [
          {
            id: "l4-m3-n1-e1",
            type: "multiple-choice",
            question: "Why are graphs better than SMILES strings for representing molecules in deep learning?",
            options: [
              "Graphs are smaller in memory",
              "Graphs naturally encode the topology (atoms and bonds) without a fixed ordering, enabling permutation-invariant learning",
              "SMILES strings are not parseable by computers",
              "Graphs only work for small molecules",
            ],
            correctIndex: 1,
            explanation: "A graph's adjacency structure is inherent — the same molecule has one graph regardless of how atoms are numbered. SMILES strings depend on traversal order and can represent the same molecule differently.",
            xpReward: 20,
          },
          {
            id: "l4-m3-n1-e2",
            type: "multiple-choice",
            question: "In message passing GNNs, each node update step:",
            options: [
              "Replaces each node's features with its neighbor's average",
              "Aggregates messages from neighboring nodes, then updates the node's own representation",
              "Randomly samples a subset of edges",
              "Computes the graph Laplacian",
            ],
            correctIndex: 1,
            explanation: "Message passing: (1) each node sends a 'message' to neighbors, (2) each node aggregates incoming messages, (3) each node updates its state using aggregated messages + its current state.",
            xpReward: 20,
          },
          {
            id: "l4-m3-n1-e3",
            type: "code-complete",
            question: "Build a simple GNN layer using PyTorch Geometric:",
            codeTemplate: `import torch
import torch.nn as nn
from torch_geometric.nn import GCNConv
import torch.nn.functional as F

class MolecularGNN(nn.Module):
    def __init__(self, num_features, hidden_dim, num_classes):
        super().__init__()
        self.conv1 = GCNConv(num_features, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.classifier = nn.Linear(hidden_dim, num_classes)

    def forward(self, x, edge_index, batch):
        # Message passing layers
        x = F.relu(self.conv1(x, edge_index))
        x = F.relu(self.conv2(x, ___))

        # Global pooling (aggregate all atom features → molecule representation)
        from torch_geometric.nn import global_mean_pool
        x = global_mean_pool(x, batch)

        return self.classifier(x)`,
            codeAnswer: "x = F.relu(self.conv2(x, edge_index))",
            xpReward: 25,
          },
          {
            id: "l4-m3-n1-e4",
            type: "free-text",
            question: "Describe how you would set up a drug-target interaction prediction task using a GNN. What are the inputs, outputs, labels, and how would you train it?",
            rubric: ["molecule as graph input", "protein as sequence/graph/embedding", "binary interaction label", "describes training objective and evaluation"],
            xpReward: 50,
          },
        ],
      },
    ],
  },
  {
    id: "l4-m4",
    title: "Generative Models in Biology",
    description: "VAEs, diffusion models, and protein language models",
    realm: 4,
    color: "#ec4899",
    nodes: [
      {
        id: "l4-m4-n1",
        moduleId: "l4-m4",
        title: "Protein Language Models",
        description: "ESM-2, ProtTrans, and embedding protein sequences",
        icon: "🗣️",
        xpReward: 280,
        exercises: [
          {
            id: "l4-m4-n1-e1",
            type: "multiple-choice",
            question: "Why can protein sequences be treated like natural language for transformer models?",
            options: [
              "Amino acids are literally letters",
              "Proteins and sentences both have ~20 'tokens' (amino acids / words)",
              "Sequences have statistical regularities, grammar-like constraints, and long-range dependencies — analogous to language",
              "The mathematics of attention is the same regardless of domain",
            ],
            correctIndex: 2,
            explanation: "Protein sequences have patterns ('grammar') at multiple scales: local (secondary structure motifs), medium (domain folds), and global (function-structure relationships). Transformers capture all of these.",
            xpReward: 20,
          },
          {
            id: "l4-m4-n1-e2",
            type: "multiple-choice",
            question: "ESM-2 is trained using masked language modeling on protein sequences. What does this mean?",
            options: [
              "Some amino acids are hidden and the model learns to predict them from context",
              "The model only trains on known structured proteins",
              "Sequences are masked randomly during inference",
              "Only the first and last positions are used for training",
            ],
            correctIndex: 0,
            explanation: "Like BERT for text, ESM-2 randomly masks ~15% of amino acid positions and predicts the missing residues from context. This forces the model to learn rich representations of protein sequence patterns.",
            xpReward: 20,
          },
          {
            id: "l4-m4-n1-e3",
            type: "code-complete",
            question: "Extract ESM-2 embeddings for a protein sequence:",
            codeTemplate: `import torch
import esm

# Load ESM-2 model (pre-trained)
model, alphabet = esm.pretrained.esm2_t6_8M_UR50D()
batch_converter = alphabet.get_batch_converter()
model.eval()

# Prepare data
data = [("protein1", "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWSTPSELGHAGLNGDILVWNPVLEDAFELSSMGIRVDADTLKHQLALTGDEDRLELEWHQALLRGEMPQTIGGGIGQSRLTMLLLQLPHIGQVQAGVWPAAVRESVPSLL")]
batch_labels, batch_strs, batch_tokens = batch_converter(data)

# Get representations
with torch.no_grad():
    results = model(batch_tokens, repr_layers=[6], return_contacts=True)

# Extract per-residue embeddings from layer 6
token_representations = results["representations"][___]
print(token_representations.shape)`,
            codeAnswer: "token_representations = results['representations'][6]",
            xpReward: 25,
          },
          {
            id: "l4-m4-n1-e4",
            type: "free-text",
            question: "Henry raises the ethical dimension of de novo protein design. Describe TWO potential beneficial applications and TWO potential risks of AI-designed proteins that don't exist in nature.",
            rubric: ["beneficial: therapeutics, industrial enzymes, materials", "risks: biosecurity/bioweapons potential, environmental release, misuse", "nuanced treatment of dual-use nature"],
            xpReward: 50,
          },
        ],
      },
    ],
  },
  {
    id: "l4-m5",
    title: "End-to-End ML Pipeline",
    description: "From biological question to reproducible model",
    realm: 4,
    color: "#39ff14",
    nodes: [
      {
        id: "l4-m5-n1",
        moduleId: "l4-m5",
        title: "Building a Reproducible Pipeline",
        description: "Experiment tracking, Docker, and scientific software engineering",
        icon: "🔧",
        xpReward: 300,
        exercises: [
          {
            id: "l4-m5-n1-e1",
            type: "sequence-order",
            question: "Put the ML pipeline for a biological discovery in correct order:",
            items: [
              "Define biological question and hypothesis",
              "Identify and acquire appropriate datasets",
              "Data preprocessing and quality control",
              "Exploratory data analysis",
              "Model selection and baseline",
              "Hyperparameter optimization",
              "Final model evaluation on held-out test set",
              "Biological interpretation and validation",
              "Write up and share reproducibly",
            ],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            xpReward: 25,
          },
          {
            id: "l4-m5-n1-e2",
            type: "multiple-choice",
            question: "What is experiment tracking (e.g., Weights & Biases, MLflow) and why is it essential?",
            options: [
              "A way to make models run faster",
              "A system to log hyperparameters, metrics, and artifacts for every experiment — enabling reproducibility and comparison",
              "A type of regularization",
              "A database of pre-trained models",
            ],
            correctIndex: 1,
            explanation: "Without tracking: you cannot reproduce your results, cannot compare runs, cannot identify what actually worked. A single experiment's results mean little without the context of what else was tried.",
            xpReward: 20,
          },
          {
            id: "l4-m5-n1-e3",
            type: "code-complete",
            question: "Set up a basic Weights & Biases experiment tracking run:",
            codeTemplate: `import wandb

# Initialize a new run
wandb.init(
    project="protein-structure-classifier",
    config={
        "learning_rate": 0.001,
        "epochs": 100,
        "architecture": "GNN",
        "dataset": "PDB_2024",
    }
)

# During training — log metrics each epoch
for epoch in range(100):
    train_loss = 0.5 * (0.99 ** epoch)  # Simulated
    val_accuracy = 0.7 + (0.3 * epoch / 100)  # Simulated

    wandb.___({"train_loss": train_loss, "val_accuracy": val_accuracy, "epoch": epoch})

wandb.finish()`,
            codeAnswer: "    wandb.log({'train_loss': train_loss, 'val_accuracy': val_accuracy, 'epoch': epoch})",
            xpReward: 20,
          },
          {
            id: "l4-m5-n1-e4",
            type: "free-text",
            question: "You've built a model that predicts antibiotic resistance from bacterial genome sequences, achieving 95% AUC on your test set. Write a critical assessment of what you'd need before claiming this model could be used clinically.",
            rubric: ["independent external validation", "diverse geographic/evolutionary representation", "temporal generalization", "clinical calibration", "regulatory/ethical considerations"],
            xpReward: 60,
          },
        ],
      },
    ],
  },
  {
    id: "l4-m6",
    title: "Your Capstone",
    description: "Design and build a complete computational biology pipeline",
    realm: 4,
    color: "#f59e0b",
    nodes: [
      {
        id: "l4-m6-n1",
        moduleId: "l4-m6",
        title: "Capstone: Choose Your Problem",
        description: "Select a biological problem and build the full pipeline",
        icon: "🏆",
        xpReward: 500,
        exercises: [
          {
            id: "l4-m6-n1-e1",
            type: "multiple-choice",
            question: "Which capstone project would you like to tackle? (All are equally valid — choose what excites you most.)",
            options: [
              "Predict splice sites from DNA sequences using a 1D-CNN",
              "Build a cell type classifier from scRNA-seq data using a Random Forest + UMAP visualization",
              "Fine-tune ESM-2 to predict thermostable mutations in an enzyme",
              "Reproduce a published ChIP-seq peak calling and motif enrichment analysis",
            ],
            correctIndex: 0,
            explanation: "All options are excellent. They cover different skills: sequence models, single-cell analysis, protein language models, and epigenomics.",
            xpReward: 0,
          },
          {
            id: "l4-m6-n1-e2",
            type: "free-text",
            question: "Problem Statement (50-200 words): Describe the biological problem you're solving, why it matters, and what your model will predict.",
            rubric: ["clear problem definition", "biological relevance explained", "computational framing (what is X, what is Y)", "feasible scope"],
            xpReward: 50,
          },
          {
            id: "l4-m6-n1-e3",
            type: "free-text",
            question: "Data Plan: What data will you use? Where does it come from? How will you preprocess it? How will you split it into train/val/test?",
            rubric: ["named data source", "preprocessing steps described", "appropriate splitting strategy for genomic data", "class balance addressed"],
            xpReward: 75,
          },
          {
            id: "l4-m6-n1-e4",
            type: "free-text",
            question: "Model Architecture: Describe your architecture. Why is it appropriate for this problem? What are your baselines?",
            rubric: ["architecture described and justified", "input/output dimensions specified", "appropriate baselines included", "hyperparameter choices reasoned"],
            xpReward: 100,
          },
          {
            id: "l4-m6-n1-e5",
            type: "free-text",
            question: "Results & Interpretation: Present your results. What does the model learn? What are its limitations? What does this mean biologically?",
            rubric: ["quantitative results with appropriate metrics", "honest limitations section", "biological interpretation connects back to the problem", "reproducibility addressed"],
            xpReward: 150,
          },
          {
            id: "l4-m6-n1-e6",
            type: "free-text",
            question: "Final Reflection: What was the hardest part? What would you do differently? What's the most important thing you learned at BitBio?",
            rubric: ["genuine reflection on challenges", "identifies key learning", "future directions mentioned"],
            xpReward: 125,
          },
        ],
      },
    ],
  },
];

export default level4Modules;
