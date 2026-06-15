import type { Module } from "@/lib/types";

const level3BonusModules: Module[] = [
  {
    id: "l3-m10",
    title: "Federated Learning & Privacy in Biomedicine",
    description: "Training models on patient data without moving it — the future of medical AI",
    realm: 3,
    color: "#a855f7",
    nodes: [
      {
        id: "l3-m10-n1",
        moduleId: "l3-m10",
        title: "Federated Learning Fundamentals",
        description: "Training across hospitals without sharing patient data",
        icon: "🔒",
        xpReward: 200,
        exercises: [
          {
            id: "l3-m10-n1-e1",
            type: "multiple-choice",
            question: "What is the core idea of federated learning?",
            options: [
              "Storing all patient data in a central secure cloud server",
              "Training model updates locally on each hospital's data, then aggregating only model weights — not data",
              "Using synthetic data instead of real patient data",
              "Removing all patient identifiers before sharing data",
            ],
            correctIndex: 1,
            explanation: "Federated learning: model weights (gradients) are shared, not raw data. Each node (hospital) trains locally → sends gradient updates to a server → server aggregates (e.g., FedAvg) → broadcasts updated model → repeat. Patient data never leaves the hospital. Key paper: McMahan et al. (Google, 2017).",
            xpReward: 10,
          },
          {
            id: "l3-m10-n1-e2",
            type: "drag-drop",
            question: "Match each federated learning challenge to its solution:",
            pairs: [
              { left: "Data heterogeneity (non-IID)", right: "FedProx — adds proximal term to keep local model close to global; personalized FL" },
              { left: "Communication cost", right: "Gradient compression, sparsification, quantization — send fewer bits" },
              { left: "Privacy leakage via gradients", right: "Differential privacy — add calibrated noise to gradients; secure aggregation" },
              { left: "Client dropout (unreliable nodes)", right: "Robust aggregation — ignore missing clients; retry mechanisms" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m10-n1-e3",
            type: "code-complete",
            question: "Implement FedAvg — the simplest federated aggregation method:",
            starterCode: `import numpy as np

def fedavg(client_weights, client_sample_counts):
    \"\"\"
    Federated Averaging: compute weighted average of client model weights.
    client_weights: list of weight arrays (one per client)
    client_sample_counts: list of training samples per client
    Returns: aggregated global weights
    \"\"\"
    total_samples = sum(client_sample_counts)
    global_weights = None

    for weights, n_samples in zip(client_weights, client_sample_counts):
        weighted = [w * (n_samples / total_samples) for w in weights]
        if global_weights is None:
            global_weights = weighted
        else:
            global_weights = ___

    return global_weights`,
            solution: `            global_weights = [gw + cw for gw, cw in zip(global_weights, weighted)]`,
            explanation: "FedAvg: weighted average of client model weights, proportional to each client's dataset size. Larger hospitals contribute more to the global model. This simple aggregation works surprisingly well when data is IID, but struggles with heterogeneous (non-IID) datasets — FedProx, SCAFFOLD, and FedNova address this.",
            xpReward: 25,
          },
          {
            id: "l3-m10-n1-e4",
            type: "fill-blank",
            question: "Differential privacy adds _____ noise to model updates to prevent inference of individual training examples from the shared gradients.",
            blanks: [{ text: "Gaussian", answer: "Gaussian", position: 0 }],
            explanation: "Differential privacy (DP): adding calibrated Gaussian (or Laplace) noise to gradients ensures that the output doesn't change significantly if any single individual's data is added or removed. The privacy budget is measured in epsilon (ε) — lower ε = more privacy, but at cost of model accuracy.",
            xpReward: 10,
          },
          {
            id: "l3-m10-n1-e5",
            type: "multiple-choice",
            question: "The MELLODDY project used federated learning across 10 pharmaceutical companies for drug discovery. Why was federated learning essential here?",
            options: [
              "The companies wanted to train faster using distributed compute",
              "Each company's compound-activity data is proprietary — they benefit from larger combined datasets without sharing trade secrets",
              "Federated learning reduces the need for regulatory approval",
              "Central cloud training was too expensive",
            ],
            correctIndex: 1,
            explanation: "MELLODDY (10 pharma companies, millions of compounds): each company has proprietary compound-activity data (multi-billion dollar value). FL allowed training on ~10× more data than any single company had — improving model accuracy — without any company seeing competitors' structures or bioactivities. Published results showed >10% improvement over single-company models.",
            xpReward: 15,
          },
          {
            id: "l3-m10-n1-e6",
            type: "sequence-order",
            question: "Order the rounds in a federated learning training cycle:",
            items: [
              "Server broadcasts updated global model to all clients",
              "Server aggregates client updates (FedAvg) → new global model",
              "Selected clients train locally on their data for E epochs",
              "Clients send gradient updates (or model diffs) to server",
            ],
            correctOrder: [0, 2, 3, 1],
            xpReward: 20,
          },
          {
            id: "l3-m10-n1-e7",
            type: "tap-correct",
            question: "Tap ALL real federated learning frameworks and platforms used in healthcare:",
            options: [
              "PySyft (OpenMined)",
              "NVIDIA FLARE",
              "TensorFlow Federated (TFF)",
              "HealthFL (fictional)",
              "Flower (flwr)",
            ],
            correctIndices: [0, 1, 2, 4],
            explanation: "PySyft (privacy-preserving ML), NVIDIA FLARE (healthcare FL), TensorFlow Federated, and Flower are all real open-source FL frameworks used in biomedical research. 'HealthFL' is fictional.",
            xpReward: 15,
          },
          {
            id: "l3-m10-n1-e8",
            type: "free-text",
            question: "Explain a gradient inversion attack and what it reveals about federated learning's privacy guarantees.",
            rubric: ["gradient inversion", "recover", "training data", "privacy", "noise", "differential", "attack", "gradient"],
            minKeywords: 3,
            explanation: "Gradient inversion attacks (Zhu et al., 2019, 'Deep Leakage from Gradients'): from a client's shared gradients alone, an attacker can reconstruct the original training images/data with high fidelity — breaking the naive privacy assumption. This shows that sharing gradients is NOT equivalent to sharing no data. Solutions: differential privacy (add noise), gradient clipping, secure aggregation (cryptographic), and local DP. The field is still evolving — federated learning with privacy requires careful implementation.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "l3-m10-n2",
        moduleId: "l3-m10",
        title: "Foundation Models in Biology",
        description: "GPT for proteins, genomes, and clinical records",
        icon: "🧠",
        xpReward: 210,
        exercises: [
          {
            id: "l3-m10-n2-e1",
            type: "multiple-choice",
            question: "What makes biological sequences (DNA, RNA, protein) amenable to language model training?",
            options: [
              "They are all the same length",
              "They are sequential, discrete, and have statistical regularities — grammar-like rules govern structure and function",
              "There is unlimited training data",
              "The biology is fully understood, making supervised training easy",
            ],
            correctIndex: 1,
            explanation: "Biological sequences share properties with natural language: discrete alphabet (4 nucleotides or 20 amino acids), sequential ordering, context-dependent meaning (codon context matters; domain context in protein), long-range dependencies (distal regulatory elements; protein tertiary contacts). This motivated applying Transformer architectures to sequences as 'biological language models.'",
            xpReward: 10,
          },
          {
            id: "l3-m10-n2-e2",
            type: "drag-drop",
            question: "Match each biological foundation model to its domain:",
            pairs: [
              { left: "ESM-2 / ESM3 (Meta)", right: "Protein language model — 650M-15B params; learns sequence-structure-function" },
              { left: "Nucleotide Transformer (InstaDeep)", right: "DNA foundation model — trained on 850 genomes; predicts regulatory elements" },
              { left: "GatorTron (NVIDIA/UF)", right: "Clinical NLP model — trained on 90B words of clinical text (EHRs, notes)" },
              { left: "scGPT (University of Toronto)", right: "Single-cell foundation model — trained on 33M cells for cell type, perturbation prediction" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m10-n2-e3",
            type: "code-complete",
            question: "Load a pretrained ESM-2 model and extract protein embeddings using the transformers library:",
            starterCode: `from transformers import EsmModel, EsmTokenizer
import torch

def get_protein_embedding(sequence, model_name="facebook/esm2_t6_8M_UR50D"):
    \"\"\"Get mean-pooled protein embedding from ESM-2.\"\"\"
    tokenizer = EsmTokenizer.from_pretrained(model_name)
    model = EsmModel.from_pretrained(model_name)
    model.eval()

    inputs = tokenizer(sequence, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)

    # Mean pool across sequence length dimension (dim=1)
    embedding = ___
    return embedding.squeeze().numpy()`,
            solution: `        embedding = outputs.last_hidden_state.mean(dim=1)`,
            explanation: "ESM-2 produces per-residue embeddings (shape: [batch, seq_len, hidden_dim]). Mean pooling across sequence length gives a fixed-size protein-level embedding regardless of sequence length. This embedding can then be used for downstream tasks: function prediction, structure clustering, drug-target interaction.",
            xpReward: 25,
          },
          {
            id: "l3-m10-n2-e4",
            type: "fill-blank",
            question: "Foundation models are typically pre-trained using self-supervised objectives like _____ language modeling, where randomly masked tokens are predicted from context.",
            blanks: [{ text: "masked", answer: "masked", position: 0 }],
            explanation: "Masked Language Modeling (MLM, BERT-style): randomly mask 15% of tokens → model predicts masked tokens from unmasked context. For proteins: mask amino acids → model learns which amino acids are compatible at each position given surrounding sequence = implicit protein evolution and structure. ESM models use this as their pre-training objective.",
            xpReward: 10,
          },
          {
            id: "l3-m10-n2-e5",
            type: "multiple-choice",
            question: "What is 'zero-shot' prediction in the context of protein language models?",
            options: [
              "Making predictions with 0 training examples for the specific task",
              "Predicting protein properties from sequence alone, without any task-specific fine-tuning or labeled data",
              "Predicting protein structures with zero computational cost",
              "Making predictions on proteins that have never been synthesized",
            ],
            correctIndex: 1,
            explanation: "Zero-shot prediction: use the pre-trained LM directly for a new task without any labeled data for that task. Example: ESM-1v predicts mutation effects by comparing log-likelihoods: log P(mutant sequence) - log P(wild-type sequence). If negative: mutation is likely deleterious. This requires zero labeled mutation data — the model learned fitness landscapes from evolutionary sequences alone.",
            xpReward: 15,
          },
          {
            id: "l3-m10-n2-e6",
            type: "sequence-order",
            question: "Order the stages of fine-tuning a protein language model for thermostability prediction:",
            items: [
              "Evaluate on held-out test proteins; compare to baseline LSTM/linear models",
              "Add task-specific prediction head (linear layer) on top of frozen ESM-2 embeddings",
              "Load pre-trained ESM-2; extract protein embeddings for all proteins in dataset",
              "Train prediction head on labeled (sequence, Tm) pairs from ProThermDB",
            ],
            correctOrder: [2, 1, 3, 0],
            xpReward: 20,
          },
          {
            id: "l3-m10-n2-e7",
            type: "tap-correct",
            question: "Tap ALL demonstrated capabilities of protein language models (as of 2024):",
            options: [
              "Predicting protein structure from sequence",
              "Designing new proteins with desired functions (inverse folding)",
              "Predicting mutation effects on stability and function",
              "Directly synthesizing proteins in the lab",
              "Predicting protein-protein interaction interfaces",
            ],
            correctIndices: [0, 1, 2, 4],
            explanation: "ESM-Fold/AlphaFold2 predict structures; RFdiffusion/ProteinMPNN design new proteins; ESM-1v predicts mutation effects; structure-based models predict PPI interfaces. Language models cannot physically synthesize proteins — that requires wet lab work (solid-phase peptide synthesis or recombinant expression).",
            xpReward: 15,
          },
          {
            id: "l3-m10-n2-e8",
            type: "free-text",
            question: "Explain why evaluating foundation models in biology requires careful choice of train/test splits, using protein example.",
            rubric: ["homology", "leak", "sequence identity", "split", "overfitting", "family", "benchmark", "contamination"],
            minKeywords: 3,
            explanation: "If train/test splits are random, proteins with >50% sequence identity end up in both sets — the model essentially memorizes homologs. True generalization requires 'homology-reduced' splits: train on proteins <30% identity to any test protein. The ProteinGym benchmark and CASP structure prediction use such splits. Without this, reported accuracies are wildly optimistic — the model learned the training distribution, not generalizable features. A similar problem exists for genomics (using nearby genomic windows in train/test) and clinical AI (same hospital in both sets).",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m11",
    title: "Bayesian Deep Learning for Biology",
    description: "Uncertainty quantification — knowing what you don't know",
    realm: 3,
    color: "#f59e0b",
    nodes: [
      {
        id: "l3-m11-n1",
        moduleId: "l3-m11",
        title: "Uncertainty in Biological Predictions",
        description: "Why a model's confidence matters as much as its predictions",
        icon: "🎲",
        xpReward: 205,
        exercises: [
          {
            id: "l3-m11-n1-e1",
            type: "multiple-choice",
            question: "What is the difference between aleatoric and epistemic uncertainty in biological ML models?",
            options: [
              "They are the same thing — just two terms for model uncertainty",
              "Aleatoric = irreducible data noise (measurement error, stochasticity); Epistemic = model uncertainty (lack of data in a region)",
              "Aleatoric = model uncertainty; Epistemic = data uncertainty",
              "Aleatoric is for classification; epistemic is for regression",
            ],
            correctIndex: 1,
            explanation: "Aleatoric uncertainty: noise inherent in the data (e.g., experimental measurement error in Tm measurement — can't reduce without better experiments). Epistemic uncertainty: lack of training data in a region of chemical/sequence space — can reduce by getting more data. Critical in drug discovery: don't explore areas of high epistemic uncertainty blindly — use active learning to query informative new experiments.",
            xpReward: 10,
          },
          {
            id: "l3-m11-n1-e2",
            type: "drag-drop",
            question: "Match each uncertainty quantification method to its mechanism:",
            pairs: [
              { left: "Monte Carlo Dropout", right: "Apply dropout at inference time and average multiple stochastic forward passes — variance = uncertainty" },
              { left: "Deep Ensembles", right: "Train N independent models; prediction variance across models = uncertainty" },
              { left: "Bayesian Neural Networks (BNNs)", right: "Place probability distributions over weights; posterior = uncertainty via VI or MCMC" },
              { left: "Conformal prediction", right: "Construct prediction sets with guaranteed coverage probability — distribution-free" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m11-n1-e3",
            type: "code-complete",
            question: "Implement Monte Carlo Dropout for uncertainty estimation:",
            starterCode: `import torch
import torch.nn as nn
import numpy as np

def mc_dropout_predict(model, x, n_samples=100):
    \"\"\"
    Run n_samples stochastic forward passes with dropout active.
    Returns mean prediction and uncertainty (std deviation).
    model must have dropout layers.
    \"\"\"
    model.train()  # keep dropout active during inference
    predictions = []

    with torch.no_grad():
        for _ in range(n_samples):
            pred = ___
            predictions.append(pred.numpy())

    predictions = np.array(predictions)
    mean_pred = predictions.mean(axis=0)
    uncertainty = ___
    return mean_pred, uncertainty`,
            solution: `            pred = model(x)

    uncertainty = predictions.std(axis=0)`,
            explanation: "MC Dropout: training-mode inference keeps dropout active → each forward pass uses a different random subset of neurons → predictions differ. The variance across N passes estimates epistemic uncertainty. Gal & Ghahramani (2016) showed this approximates Bayesian inference. Cheap to implement — just call model.train() at inference time.",
            xpReward: 25,
          },
          {
            id: "l3-m11-n1-e4",
            type: "fill-blank",
            question: "Active learning uses model _____ to choose the most informative next experiments to label, reducing the cost of building biological datasets.",
            blanks: [{ text: "uncertainty", answer: "uncertainty", position: 0 }],
            explanation: "Active learning: select unlabeled samples for experimental assay based on model uncertainty (or other acquisition functions like EI, UCB). Query the most uncertain points — where the model would learn the most from new labels. In drug discovery: choose the top-N uncertain compounds to synthesize and test. Reduces experimental cost 5-10× vs random screening.",
            xpReward: 10,
          },
          {
            id: "l3-m11-n1-e5",
            type: "multiple-choice",
            question: "Why are well-calibrated uncertainty estimates especially important for clinical AI applications?",
            options: [
              "Calibrated models always have higher accuracy",
              "Clinicians can appropriately trust high-confidence predictions and flag uncertain cases for expert review or additional testing",
              "Uncalibrated models are slower to deploy",
              "Calibration only matters for binary classification tasks",
            ],
            correctIndex: 1,
            explanation: "Clinical AI requires calibration: a model that says '95% confident' should be right ~95% of the time. Overconfident models give clinicians false confidence in wrong predictions. Calibrated uncertainty allows: flagging uncertain cases for specialist review, identifying patients who need additional diagnostics, and appropriate risk communication. This is a core requirement of EU AI Act for high-risk medical AI.",
            xpReward: 15,
          },
          {
            id: "l3-m11-n1-e6",
            type: "sequence-order",
            question: "Order the steps in a Bayesian active learning loop for protein engineering:",
            items: [
              "Retrain model on all labeled data; update uncertainty estimates",
              "Screen all unlabeled variants; compute model uncertainty for each",
              "Synthesize and measure activity of top-N most uncertain variants (wet lab)",
              "Start with initial labeled dataset; train uncertainty-aware model",
            ],
            correctOrder: [3, 1, 2, 0],
            xpReward: 20,
          },
          {
            id: "l3-m11-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are valid acquisition functions used in Bayesian optimization for drug discovery:",
            options: [
              "Expected Improvement (EI)",
              "Upper Confidence Bound (UCB)",
              "Probability of Improvement (PI)",
              "Thompson Sampling",
              "Random Selection",
            ],
            correctIndices: [0, 1, 2, 3],
            explanation: "EI, UCB, PI, and Thompson Sampling are all principled Bayesian optimization acquisition functions. Random selection has no acquisition function — it's the baseline, not a Bayesian method. EI is most common in drug discovery (seeks compounds with high expected improvement over the current best).",
            xpReward: 15,
          },
          {
            id: "l3-m11-n1-e8",
            type: "free-text",
            question: "Explain how an overconfident ML model could cause harm in a clinical genomics pipeline, and how uncertainty quantification prevents it.",
            rubric: ["overconfident", "calibration", "clinical", "harm", "uncertainty", "flag", "decision", "pathogenic"],
            minKeywords: 3,
            explanation: "Scenario: A variant pathogenicity classifier predicts BRCA1 variant as 'Benign' with 99% confidence, but the model is overconfident in an area of high epistemic uncertainty (few similar training examples). A clinician, trusting the 99% confidence, skips genetic counseling. The patient later develops cancer. UQ solution: the model's uncertainty score flags this variant as 'high epistemic uncertainty — recommend expert review.' A calibrated model showing lower confidence triggers appropriate clinical escalation. UQ converts a binary (benign/pathogenic) decision into a risk-stratified recommendation.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
];

export default level3BonusModules;
