import type { Module } from "@/lib/types";

const level3ExtraModules: Module[] = [
  {
    id: "l3-m7",
    title: "Interpretability & Explainable AI for Biology",
    description: "Why models decide what they decide — and why it matters in medicine",
    realm: 3,
    color: "#a855f7",
    nodes: [
      {
        id: "l3-m7-n1",
        moduleId: "l3-m7",
        title: "SHAP Values & Feature Importance",
        description: "Opening the black box with Shapley values",
        icon: "🔍",
        xpReward: 190,
        exercises: [
          {
            id: "l3-m7-n1-e1",
            type: "multiple-choice",
            question: "Why is model interpretability especially important in clinical/biomedical AI?",
            options: [
              "It makes models run faster on hospital hardware",
              "Clinicians need to understand model predictions to trust and safely use them — wrong AI predictions can harm patients",
              "Regulators only care about model speed, not interpretability",
              "Interpretable models are always more accurate",
            ],
            correctIndex: 1,
            explanation: "In healthcare, incorrect AI predictions can harm or kill patients. Clinicians must understand WHY a model predicts what it does to catch errors, integrate domain knowledge, and maintain accountability. The FDA and EU AI Act both require explainability for high-risk medical AI.",
            xpReward: 10,
          },
          {
            id: "l3-m7-n1-e2",
            type: "drag-drop",
            question: "Match each interpretability method to its approach:",
            pairs: [
              { left: "SHAP (Shapley values)", right: "Game-theory attribution — how much each feature contributed to this prediction" },
              { left: "LIME", right: "Local surrogate — fit interpretable model around one prediction" },
              { left: "Attention weights", right: "Which input tokens the model 'looked at' — works for transformers" },
              { left: "Integrated Gradients", right: "Sum gradients along path from baseline to input — attribution for neural nets" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m7-n1-e3",
            type: "code-complete",
            question: "Compute a simplified permutation feature importance for a classifier:",
            starterCode: `import numpy as np
from sklearn.metrics import accuracy_score

def permutation_importance(model, X_val, y_val, n_repeats=5):
    \"\"\"
    For each feature, shuffle its values n_repeats times and measure
    the average drop in accuracy. Larger drop = more important feature.
    \"\"\"
    baseline_acc = accuracy_score(y_val, model.predict(X_val))
    importances = {}

    for feature_idx in range(X_val.shape[1]):
        drops = []
        for _ in range(n_repeats):
            X_permuted = X_val.copy()
            # Shuffle only this feature
            ___
            perm_acc = accuracy_score(y_val, model.predict(X_permuted))
            drops.append(baseline_acc - perm_acc)
        importances[feature_idx] = np.mean(drops)

    return importances`,
            solution: `            np.random.shuffle(X_permuted[:, feature_idx])`,
            explanation: "Permutation importance: shuffle one feature at a time — if accuracy drops a lot, the model relied on that feature. If it stays the same, the feature wasn't important. Advantage: works for any model (model-agnostic).",
            xpReward: 25,
          },
          {
            id: "l3-m7-n1-e4",
            type: "fill-blank",
            question: "SHAP values are based on _____ values from cooperative game theory, where each 'player' is a feature and the 'payout' is the model prediction.",
            blanks: [{ text: "Shapley", answer: "Shapley", position: 0 }],
            explanation: "Lloyd Shapley (Nobel Prize 2012) developed Shapley values in game theory. SHAP adapts them to ML: for each feature, the Shapley value is its average marginal contribution across all possible feature orderings. This gives fair, consistent attribution.",
            xpReward: 10,
          },
          {
            id: "l3-m7-n1-e5",
            type: "multiple-choice",
            question: "In a genomics model predicting cancer risk, a SHAP beeswarm plot shows gene BRCA1 with high positive SHAP values. What does this mean?",
            options: [
              "BRCA1 expression reduces cancer risk in this model",
              "BRCA1 has no effect on predictions",
              "High BRCA1 expression pushes the model toward predicting higher cancer risk for these samples",
              "BRCA1 was not used as a feature",
            ],
            correctIndex: 2,
            explanation: "Positive SHAP values push the prediction toward the positive class (high cancer risk). High BRCA1 expression + positive SHAP = BRCA1 is a driver of high-risk predictions in your model. (Note: in reality, BRCA1 loss, not overexpression, drives cancer — so a positive SHAP for expression might indicate your model learned something biologically interesting or potentially spurious.)",
            xpReward: 15,
          },
          {
            id: "l3-m7-n1-e6",
            type: "sequence-order",
            question: "Order the steps to produce a SHAP summary plot for a gradient boosting classifier on gene expression data:",
            items: [
              "Visualize with shap.summary_plot() — shows features ranked by mean |SHAP|",
              "Train model on training set",
              "Compute SHAP values: explainer = shap.TreeExplainer(model); shap_values = explainer(X_test)",
              "Load expression data, split into train/test",
            ],
            correctOrder: [3, 1, 2, 0],
            xpReward: 20,
          },
          {
            id: "l3-m7-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are valid concerns about using attention weights as explanations for transformer model predictions:",
            options: [
              "Attention is not the same as attribution",
              "Attention can be high for features that don't causally affect output",
              "Attention weights don't sum to 1",
              "Multiple attention heads make interpretation complex",
              "Attention weights can be manipulated without changing predictions",
            ],
            correctIndices: [0, 1, 3, 4],
            explanation: "Jain & Wallace (2019) and Wiegreffe & Pinter (2019) showed: attention ≠ explanation (0,1,3,4 are valid concerns). Attention weights DO sum to 1 (they are softmax outputs) — so option 2 is false. Gradient-based methods are often preferred for causal attribution.",
            xpReward: 15,
          },
          {
            id: "l3-m7-n1-e8",
            type: "free-text",
            question: "Describe a scenario where a biologically accurate but 'unfair' feature (like race) might appear as important in a clinical prediction model, and how you would address it.",
            rubric: ["confounding", "proxy", "bias", "fairness", "race", "retraining", "disparate impact", "feature selection"],
            minKeywords: 3,
            explanation: "Race may be a proxy for socioeconomic factors (access to care, diet, stress) that are themselves proxies for disease risk — the model learns a real statistical correlation but the causal chain is problematic. Solutions: remove the proxy feature, use fairness-aware training, analyze performance stratified by demographic, and ensure causal inference rather than correlation-based prediction.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "l3-m7-n2",
        moduleId: "l3-m7",
        title: "Causal Inference in Biology",
        description: "From correlation to causation — the holy grail of bio-statistics",
        icon: "🔗",
        xpReward: 195,
        exercises: [
          {
            id: "l3-m7-n2-e1",
            type: "multiple-choice",
            question: "What is the fundamental problem of causal inference?",
            options: [
              "It's impossible to compute statistical correlations",
              "We can never observe the same unit in both treated and untreated states simultaneously",
              "Biological data is always too noisy for causal analysis",
              "Correlation implies causation when sample sizes are large enough",
            ],
            correctIndex: 1,
            explanation: "The fundamental problem: to know if a treatment caused an outcome, we'd need to observe the same individual both with and without treatment — impossible. We infer causation by comparing groups (RCT, observational methods) that substitute for the missing counterfactual.",
            xpReward: 10,
          },
          {
            id: "l3-m7-n2-e2",
            type: "drag-drop",
            question: "Match each causal inference method to its biological use case:",
            pairs: [
              { left: "Randomized Controlled Trial (RCT)", right: "Gold standard — randomly assign treatment, control confounders by design" },
              { left: "Mendelian randomization", right: "Use genetic variants as natural 'instruments' to test causal effects of biomarkers" },
              { left: "Difference-in-differences (DiD)", right: "Compare treated vs. control before/after a natural experiment or intervention" },
              { left: "Propensity score matching", right: "Match treated/control patients on observed confounders to mimic randomization" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m7-n2-e3",
            type: "fill-blank",
            question: "In Mendelian Randomization, genetic variants (SNPs) associated with an exposure are used as _____ variables to estimate the causal effect of the exposure on an outcome.",
            blanks: [{ text: "instrumental", answer: "instrumental", position: 0 }],
            explanation: "Instrumental variables (IVs) are variables that affect the outcome ONLY through the exposure — not through any other confounded pathway. In MR, genetic variants are IVs because they: (1) associate with exposure, (2) are randomized at conception (unlike lifestyle factors), (3) don't directly cause the outcome.",
            xpReward: 10,
          },
          {
            id: "l3-m7-n2-e4",
            type: "multiple-choice",
            question: "What is a confounder in observational biology studies?",
            options: [
              "A measurement error in the outcome variable",
              "A variable that causes both the exposure and the outcome, creating a spurious association",
              "A missing data point in the dataset",
              "An outlier that inflates the regression coefficient",
            ],
            correctIndex: 1,
            explanation: "A confounder is associated with both exposure and outcome but is not in the causal pathway between them — it creates a spurious correlation. Classic example: ice cream sales correlate with drowning (confounder: summer heat). In biology: smoking confounds many health associations.",
            xpReward: 15,
          },
          {
            id: "l3-m7-n2-e5",
            type: "code-complete",
            question: "Implement a simple average treatment effect (ATE) estimator using propensity score weighting (IPW):",
            starterCode: `import numpy as np
from sklearn.linear_model import LogisticRegression

def ipw_ate(X, treatment, outcome):
    \"\"\"
    Inverse Probability Weighting estimator for ATE.
    X: covariates, treatment: binary (0/1), outcome: binary (0/1)
    \"\"\"
    # Fit propensity score model
    ps_model = LogisticRegression()
    ps_model.fit(X, treatment)
    propensity = ps_model.predict_proba(X)[:, 1]

    # IPW weights: 1/p(T=1) for treated, 1/(1-p(T=1)) for control
    weights = np.where(treatment == 1,
                       ___,
                       ___)

    treated_outcome = np.sum(outcome * treatment * weights) / np.sum(treatment * weights)
    control_outcome = np.sum(outcome * (1 - treatment) * weights) / np.sum((1 - treatment) * weights)
    return treated_outcome - control_outcome`,
            solution: `                       1 / propensity,
                       1 / (1 - propensity))`,
            explanation: "IPW reweights observations to create a 'pseudo-population' where treatment assignment is independent of confounders. Treated units with low propensity scores get high weight (they're 'surprising' treated units), and vice versa.",
            xpReward: 25,
          },
          {
            id: "l3-m7-n2-e6",
            type: "sequence-order",
            question: "Order the steps in a Directed Acyclic Graph (DAG) analysis for causal inference:",
            items: [
              "Identify the minimal sufficient adjustment set from the DAG",
              "Draw the DAG based on domain knowledge — nodes are variables, edges are causal links",
              "Estimate causal effect conditioning on adjustment set",
              "Identify all backdoor paths from exposure to outcome",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 20,
          },
          {
            id: "l3-m7-n2-e7",
            type: "tap-correct",
            question: "Tap ALL that are valid assumptions required for Mendelian Randomization to give valid causal estimates:",
            options: [
              "Relevance: IV must associate with the exposure",
              "Exclusion restriction: IV affects outcome only through exposure",
              "Independence: IV must be independent of confounders",
              "The outcome must be continuous",
              "The sample must be from a single ancestry",
            ],
            correctIndices: [0, 1, 2],
            explanation: "The three core IV assumptions are relevance, exclusion restriction, and independence. MR works across continuous and binary outcomes, and multi-ancestry MR is an active research area. Options 4 and 5 are not required assumptions.",
            xpReward: 15,
          },
          {
            id: "l3-m7-n2-e8",
            type: "free-text",
            question: "Explain why correlation does not imply causation using a biological example, and describe how you would test for causality.",
            rubric: ["confounder", "correlation", "causation", "RCT", "Mendelian", "experiment", "intervention"],
            minKeywords: 3,
            explanation: "Classic example: ice cream consumption correlates with skin cancer. Confounder: sunlight exposure (causes both). To test causation: conduct an RCT (randomly assign ice cream consumption — clearly unethical/silly here), or use MR if there's a genetic variant for ice cream preference, or find a natural experiment. In biology: gene expression levels correlate with disease states, but are they causal drivers or just markers? CRISPRi knockdown or MR with eQTLs can test causality.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m8",
    title: "Reinforcement Learning in Biology",
    description: "Teaching agents to discover drugs and protein sequences by reward",
    realm: 3,
    color: "#f59e0b",
    nodes: [
      {
        id: "l3-m8-n1",
        moduleId: "l3-m8",
        title: "RL Fundamentals for Biological Design",
        description: "MDPs, policies, and rewards — the biologist's guide",
        icon: "🎮",
        xpReward: 185,
        exercises: [
          {
            id: "l3-m8-n1-e1",
            type: "multiple-choice",
            question: "In reinforcement learning, what is the agent's objective?",
            options: [
              "Minimize prediction error on a labeled dataset",
              "Maximize the cumulative discounted reward from the environment",
              "Find the shortest path between two states",
              "Model the probability distribution of the environment",
            ],
            correctIndex: 1,
            explanation: "RL agents learn to select actions that maximize cumulative reward (expected sum of discounted future rewards). Unlike supervised learning, there's no labeled training set — the agent learns by trial and error, receiving reward signals from the environment.",
            xpReward: 10,
          },
          {
            id: "l3-m8-n1-e2",
            type: "drag-drop",
            question: "Match each RL concept to its biological design analogy:",
            pairs: [
              { left: "State (s)", right: "Current molecular design — e.g., partial protein sequence or SMILES string" },
              { left: "Action (a)", right: "Edit to make — add an amino acid, change an atom, mutate a position" },
              { left: "Reward (r)", right: "Binding affinity, toxicity score, or folding stability from an oracle" },
              { left: "Policy (π)", right: "The design strategy — maps current molecule to the next edit to make" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m8-n1-e3",
            type: "fill-blank",
            question: "In an MDP (Markov Decision Process), the _____ property states that the future state depends only on the current state and action, not on the entire history.",
            blanks: [{ text: "Markov", answer: "Markov", position: 0 }],
            explanation: "The Markov property (memorylessness): P(s_{t+1} | s_t, a_t, s_{t-1}, a_{t-1}, ...) = P(s_{t+1} | s_t, a_t). Only the current state matters — not history. This is what makes RL tractable; otherwise we'd need to store all previous states.",
            xpReward: 10,
          },
          {
            id: "l3-m8-n1-e4",
            type: "code-complete",
            question: "Implement a simple epsilon-greedy action selection for drug design exploration:",
            starterCode: `import random
import numpy as np

def epsilon_greedy(Q_values, epsilon=0.1):
    \"\"\"
    Epsilon-greedy action selection.
    Q_values: array of Q-values for each possible action (e.g., atom type to add)
    Returns: selected action index
    \"\"\"
    if random.random() < epsilon:
        # Explore: random action
        return ___
    else:
        # Exploit: best known action
        return ___`,
            solution: `        return random.randrange(len(Q_values))
    else:
        # Exploit: best known action
        return int(np.argmax(Q_values))`,
            explanation: "Epsilon-greedy balances exploration (trying new molecule edits) vs. exploitation (using the best known edits). In drug design, epsilon must be set carefully — too high and you waste compute on random molecules; too low and you get stuck in local optima.",
            xpReward: 25,
          },
          {
            id: "l3-m8-n1-e5",
            type: "multiple-choice",
            question: "Why is RL particularly useful for de novo drug design compared to standard supervised learning?",
            options: [
              "RL models are faster to train than neural networks",
              "RL can explore vast chemical space and optimize for multiple objectives simultaneously, without needing labeled pairs",
              "RL doesn't require any knowledge of the target protein",
              "RL always finds the global optimum in chemical space",
            ],
            correctIndex: 1,
            explanation: "Chemical space for drug-like molecules is estimated at 10^60 — too vast to enumerate. RL can: (1) generate novel molecules (not just optimize existing ones), (2) optimize multiple objectives (binding + solubility + synthesizability simultaneously as reward), and (3) guide generation without needing matched (molecule, activity) training pairs.",
            xpReward: 15,
          },
          {
            id: "l3-m8-n1-e6",
            type: "sequence-order",
            question: "Order the components of the REINFORCE policy gradient algorithm:",
            items: [
              "Compute policy gradient: ∇J(θ) = E[G_t ∇ log π(a_t|s_t; θ)]",
              "Sample a trajectory (sequence of states, actions) from current policy",
              "Update policy parameters: θ ← θ + α ∇J(θ)",
              "Calculate returns G_t (cumulative discounted rewards from time t)",
            ],
            correctOrder: [1, 3, 0, 2],
            xpReward: 20,
          },
          {
            id: "l3-m8-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are real applications of RL in computational biology/chemistry (as of 2024):",
            options: [
              "AlphaFold2 protein structure prediction",
              "MolDQN (molecule optimization via DQN)",
              "GENTRL (drug design for SARS-CoV-2)",
              "REINVENT (de novo molecular generation)",
              "AlphaZero-style CADD",
            ],
            correctIndices: [1, 2, 3],
            explanation: "MolDQN (Shi et al., Google Brain), GENTRL (Insilico Medicine — identified COVID drugs in days), and REINVENT (AstraZeneca's RL drug design tool) are all real RL-based biology applications. AlphaFold2 uses supervised learning + MSA, not RL. 'AlphaZero-style CADD' is not a specific published method.",
            xpReward: 15,
          },
          {
            id: "l3-m8-n1-e8",
            type: "free-text",
            question: "Describe the reward shaping problem in biological RL and how it affects the quality of discovered molecules.",
            rubric: ["reward", "proxy", "Goodhart", "docking", "toxicity", "oracle", "multi-objective", "shaping"],
            minKeywords: 3,
            explanation: "Reward shaping problem: if your reward is docking score alone, RL will find molecules with amazing docking scores that are toxic, unsynthesizable, or chemically unstable (Goodhart's Law: 'When a measure becomes a target, it ceases to be a good measure'). Solutions: multi-objective rewards (docking + QED + SA score + ADMET), uncertainty penalties, penalize novelty-exploitation tradeoffs, and validate with wet-lab oracles.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m9",
    title: "Multi-Modal Learning in Biomedicine",
    description: "Fusing genomics, imaging, and clinical records for holistic prediction",
    realm: 3,
    color: "#00ffff",
    nodes: [
      {
        id: "l3-m9-n1",
        moduleId: "l3-m9",
        title: "Fusing Omics with Clinical Data",
        description: "How to combine data of radically different types",
        icon: "🔀",
        xpReward: 200,
        exercises: [
          {
            id: "l3-m9-n1-e1",
            type: "multiple-choice",
            question: "What is the key challenge in multi-modal learning for biomedical data?",
            options: [
              "There is never enough labeled data in medicine",
              "Different modalities have different scales, sparsities, missing rates, and noise profiles that must be harmonized",
              "Neural networks can only handle one type of data at a time",
              "Clinical records are always too large to process",
            ],
            correctIndex: 1,
            explanation: "Multi-modal biomedical data: genomics (sparse, high-dimensional, continuous), imaging (high-dimensional spatial), clinical records (tabular, mixed types, lots of missingness), text (EHR notes). Each has different statistical properties — naive concatenation usually performs poorly. Careful fusion architectures and data harmonization are essential.",
            xpReward: 10,
          },
          {
            id: "l3-m9-n1-e2",
            type: "drag-drop",
            question: "Match each fusion strategy to its description:",
            pairs: [
              { left: "Early fusion", right: "Concatenate raw features from all modalities before any model — simple but ignores modality structure" },
              { left: "Late fusion", right: "Train separate models per modality, combine predictions at the output — easy but misses cross-modal interactions" },
              { left: "Intermediate fusion", right: "Learn modality-specific encoders, then combine intermediate representations — balances both" },
              { left: "Cross-attention fusion", right: "Transformer attention across modalities — queries from one modality attend to keys/values of another" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m9-n1-e3",
            type: "code-complete",
            question: "Build a simple late-fusion multi-modal classifier combining genomics and imaging features:",
            starterCode: `import torch
import torch.nn as nn

class LateFusionClassifier(nn.Module):
    def __init__(self, genomics_dim, imaging_dim, hidden_dim, num_classes):
        super().__init__()
        # Modality-specific encoders
        self.genomics_enc = nn.Sequential(
            nn.Linear(genomics_dim, hidden_dim), nn.ReLU(), nn.Dropout(0.3)
        )
        self.imaging_enc = nn.Sequential(
            nn.Linear(imaging_dim, hidden_dim), nn.ReLU(), nn.Dropout(0.3)
        )
        # Fusion classifier (takes concatenated embeddings)
        self.classifier = ___

    def forward(self, genomics, imaging):
        g_emb = self.genomics_enc(genomics)
        i_emb = self.imaging_enc(imaging)
        fused = torch.cat([g_emb, i_emb], dim=-1)
        return self.classifier(fused)`,
            solution: `        self.classifier = nn.Linear(hidden_dim * 2, num_classes)`,
            explanation: "Late fusion: encode each modality separately, then concatenate and classify. The classifier takes 2*hidden_dim because we concatenate the two encodings. More sophisticated: use cross-attention instead of concatenation for richer cross-modal interactions.",
            xpReward: 25,
          },
          {
            id: "l3-m9-n1-e4",
            type: "fill-blank",
            question: "In multi-modal learning, the _____ modality problem occurs when training data has all modalities but test data might be missing some — requiring models robust to absent inputs.",
            blanks: [{ text: "missing", answer: "missing", position: 0 }],
            explanation: "Missing modality is a critical practical challenge: a patient at test time may lack imaging, genomics, or other data. Solutions: modality dropout during training (randomly mask modalities so the model learns to work with any subset), imputation, or uncertainty-aware fusion.",
            xpReward: 10,
          },
          {
            id: "l3-m9-n1-e5",
            type: "multiple-choice",
            question: "What is contrastive learning's role in multi-modal biological AI (e.g., CLIP-style models for pathology + genomics)?",
            options: [
              "It trains models to produce identical outputs for all inputs",
              "It learns aligned representations across modalities by pulling paired (image, genomics) embeddings close and pushing non-pairs apart",
              "It is a data augmentation technique specific to imaging",
              "It eliminates the need for labeled data entirely",
            ],
            correctIndex: 1,
            explanation: "Contrastive learning (e.g., CONCH, CHIEF for pathology): given paired (H&E image, genomic profile) of the same patient, pull their embeddings together; push embeddings of different patients apart. This creates a shared 'multi-modal space' where similar patients cluster regardless of which modality you use for the query.",
            xpReward: 15,
          },
          {
            id: "l3-m9-n1-e6",
            type: "sequence-order",
            question: "Order the development stages of a multi-modal cancer prediction model:",
            items: [
              "Prospective clinical validation in an external cohort",
              "Collect and harmonize multi-modal data (genomics, pathology images, clinical)",
              "Develop and cross-validate fusion model on internal dataset",
              "Pre-process each modality separately (normalize, QC, feature extract)",
            ],
            correctOrder: [1, 3, 2, 0],
            xpReward: 20,
          },
          {
            id: "l3-m9-n1-e7",
            type: "tap-correct",
            question: "Tap ALL that are real multi-modal biomedical AI tools/models (as of 2024):",
            options: [
              "HIPT (hierarchical pathology transformer)",
              "PLIP (pathology-language-image pretraining)",
              "BioViL (radiology + text)",
              "GeneGPT (NCBI API + GPT)",
              "OmniMedical-7B",
            ],
            correctIndices: [0, 1, 2, 3],
            explanation: "HIPT (hierarchical vision transformer for pathology), PLIP (pathology vision-language), BioViL (radiology + radiology reports), and GeneGPT (Chen et al., NCBI + LLM) are all real published models. 'OmniMedical-7B' is not a specific real published model.",
            xpReward: 15,
          },
          {
            id: "l3-m9-n1-e8",
            type: "free-text",
            question: "Explain how 'batch effects' between different hospitals or sequencing platforms can undermine a multi-modal model trained on multi-site data.",
            rubric: ["batch effect", "technical variation", "harmonization", "ComBat", "confound", "site", "normalization"],
            minKeywords: 3,
            explanation: "Batch effects: systematic technical differences between hospitals/platforms (different sequencers, staining protocols, scanners) can dominate biological signal. A model trained on Hospital A's data may fail on Hospital B's because it learned to recognize the scanner brand, not the biology. Solutions: ComBat/ComBat-seq harmonization, site as a covariate, contrastive learning to align distributions, and rigorous leave-one-site-out validation.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
];

export default level3ExtraModules;
