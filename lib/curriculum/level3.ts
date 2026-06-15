import type { Module } from "@/lib/types";

const level3Modules: Module[] = [
  {
    id: "l3-m1",
    title: "Machine Learning — What It Actually Is",
    description: "The real foundations before the magic",
    realm: 3,
    color: "#f59e0b",
    nodes: [
      {
        id: "l3-m1-n1",
        moduleId: "l3-m1",
        title: "Supervised vs. Unsupervised Learning",
        description: "The fundamental taxonomy of ML approaches",
        icon: "🧭",
        xpReward: 180,
        exercises: [
          {
            id: "l3-m1-n1-e1",
            type: "drag-drop",
            question: "Sort these tasks into Supervised vs. Unsupervised learning:",
            pairs: [
              { left: "Predict whether a tumor is malignant given gene expression", right: "Supervised" },
              { left: "Cluster cells by gene expression without pre-defined types", right: "Unsupervised" },
              { left: "Predict protein function from sequence with labeled training data", right: "Supervised" },
              { left: "Find groups of patients with similar disease trajectories", right: "Unsupervised" },
              { left: "Classify ATAC-seq peaks as active/inactive enhancers", right: "Supervised" },
            ],
            xpReward: 25,
          },
          {
            id: "l3-m1-n1-e2",
            type: "multiple-choice",
            question: "Alex describes ML as 'sophisticated curve fitting.' Which of these correctly captures why?",
            options: [
              "All ML models literally draw curves through data points",
              "ML learns a mathematical function mapping inputs to outputs by minimizing error on training data",
              "ML always produces smooth, continuous outputs",
              "ML only works for numerical data",
            ],
            correctIndex: 1,
            explanation: "At its core, ML is finding a function f(x) ≈ y by minimizing the difference between predictions and true labels. Whether linear regression or a transformer, this is the underlying principle.",
            xpReward: 15,
          },
          {
            id: "l3-m1-n1-e3",
            type: "multiple-choice",
            question: "Why do we split data into train, validation, and test sets?",
            options: [
              "To use less memory",
              "Train: fit the model. Validation: tune hyperparameters. Test: unbiased final evaluation (never seen during development).",
              "Train: fit. Test: retrain. Validation: deploy.",
              "To create three identical models and average them",
            ],
            correctIndex: 1,
            explanation: "Using a held-out test set prevents 'peeking' — if you tune on test data, your final evaluation is optimistic and unreliable. Validation is for iterative decisions; test is the sacred final evaluation.",
            xpReward: 15,
          },
          {
            id: "l3-m1-n1-e4",
            type: "drag-drop",
            question: "Match the concept to the correct definition:",
            pairs: [
              { left: "Overfitting", right: "Model performs well on training data but poorly on new data — memorized noise" },
              { left: "Underfitting", right: "Model is too simple — fails to capture the real pattern even in training data" },
              { left: "Bias", right: "Systematic error from wrong assumptions — consistently wrong in the same direction" },
              { left: "Variance", right: "Sensitivity to small fluctuations in training data — inconsistent across datasets" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m1-n1-e5",
            type: "multiple-choice",
            question: "A model trained on genomic data from European populations is deployed on a diverse global cohort. What problem does this illustrate?",
            options: [
              "Overfitting to the training set population — the model generalizes poorly to distributions it wasn't trained on",
              "Underfitting — the model needs more parameters",
              "Dataset shift / distribution shift",
              "Both A and C",
            ],
            correctIndex: 3,
            explanation: "This is both overfitting to a biased training population AND dataset shift — the test distribution differs from training. This is a major problem in genomics ML with real clinical implications.",
            xpReward: 20,
          },
          {
            id: "l3-m1-n1-e6",
            type: "free-text",
            question: "Alex says she once ran a model for 3 days that learned to output the mean of the training set for every input. What is this called? Why might a model do this? What does it tell you about the task or the model?",
            rubric: ["names it (degenerate/trivial solution or lazy baseline)", "explains lack of signal or poorly specified loss", "mentions this is a useful debugging signal"],
            xpReward: 30,
          },
        ],
      },
      {
        id: "l3-m1-n2",
        moduleId: "l3-m1",
        title: "Loss Functions & Gradient Descent",
        description: "How models learn — the math behind the magic",
        icon: "⛰️",
        xpReward: 200,
        exercises: [
          {
            id: "l3-m1-n2-e1",
            type: "multiple-choice",
            question: "What is a loss function?",
            options: [
              "A function that generates new training data",
              "A measure of how wrong the model's predictions are — minimized during training",
              "The number of parameters in the model",
              "The learning rate schedule",
            ],
            correctIndex: 1,
            explanation: "The loss function quantifies the error between predictions and true labels. Gradient descent minimizes this function by adjusting model parameters.",
            xpReward: 15,
          },
          {
            id: "l3-m1-n2-e2",
            type: "drag-drop",
            question: "Match the loss function to its appropriate task:",
            pairs: [
              { left: "Mean Squared Error (MSE)", right: "Regression — predicting continuous values (e.g., gene expression level)" },
              { left: "Binary Cross-Entropy", right: "Binary classification (e.g., cancer vs. normal)" },
              { left: "Categorical Cross-Entropy", right: "Multi-class classification (e.g., cell type from 20 classes)" },
              { left: "Contrastive Loss", right: "Self-supervised learning — embedding similar items close together" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m1-n2-e3",
            type: "multiple-choice",
            question: "What does gradient descent do?",
            options: [
              "Finds the global minimum of any loss function",
              "Iteratively adjusts parameters in the direction that decreases the loss",
              "Automatically selects the right learning rate",
              "Prevents overfitting",
            ],
            correctIndex: 1,
            explanation: "Gradient descent computes the gradient of the loss w.r.t. each parameter and moves them in the negative gradient direction. It finds a local minimum, not necessarily the global one.",
            xpReward: 15,
          },
          {
            id: "l3-m1-n2-e4",
            type: "multiple-choice",
            question: "Learning rate too high → learning rate too low. What are the respective symptoms?",
            options: [
              "Too high: loss decreases slowly. Too low: loss oscillates wildly.",
              "Too high: loss oscillates or diverges. Too low: training is extremely slow, gets stuck.",
              "Too high: overfitting. Too low: underfitting.",
              "They have the same effect at extreme values.",
            ],
            correctIndex: 1,
            explanation: "High LR → big steps → may overshoot the minimum → loss explodes or oscillates. Low LR → tiny steps → extremely slow convergence → may never find good solution.",
            xpReward: 15,
          },
          {
            id: "l3-m1-n2-e5",
            type: "code-complete",
            question: "Implement a simple gradient descent update step in pure NumPy:",
            codeTemplate: `import numpy as np

# Simple linear regression: y = w*x + b
# Loss: MSE = mean((y_pred - y_true)^2)
def update_params(X, y_true, w, b, learning_rate):
    n = len(X)
    y_pred = w * X + b

    # Gradients via chain rule
    dL_dw = (2/n) * np.sum((y_pred - y_true) * X)
    dL_db = (2/n) * np.sum(y_pred - y_true)

    # Update parameters
    w_new = w - ___ * dL_dw
    b_new = b - ___ * dL_db
    return w_new, b_new`,
            codeAnswer: `    w_new = w - learning_rate * dL_dw
    b_new = b - learning_rate * dL_db`,
            xpReward: 25,
          },
          {
            id: "l3-m1-n2-e6",
            type: "free-text",
            question: "Explain the difference between batch gradient descent, stochastic gradient descent (SGD), and mini-batch SGD. Which is most commonly used in deep learning and why?",
            rubric: ["correctly defines all three", "mini-batch is most common", "explains tradeoff between stability and speed/noise"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m2",
    title: "Classical ML for Biology",
    description: "Random forests, SVMs, and clustering for biology",
    realm: 3,
    color: "#06b6d4",
    nodes: [
      {
        id: "l3-m2-n1",
        moduleId: "l3-m2",
        title: "Random Forests & scikit-learn",
        description: "Decision trees, ensembles, and feature importance",
        icon: "🌳",
        xpReward: 190,
        exercises: [
          {
            id: "l3-m2-n1-e1",
            type: "multiple-choice",
            question: "A decision tree splits the data by:",
            options: [
              "Randomly selecting features",
              "Finding the feature and threshold that best separates the classes (maximizes information gain)",
              "Sorting the data alphabetically",
              "Averaging values at each node",
            ],
            correctIndex: 1,
            explanation: "At each node, a decision tree greedily finds the best split — the feature and threshold that maximizes information gain (or minimizes Gini impurity).",
            xpReward: 15,
          },
          {
            id: "l3-m2-n1-e2",
            type: "multiple-choice",
            question: "A random forest improves over a single decision tree by:",
            options: [
              "Using deeper trees",
              "Training many trees on random subsets of data/features and averaging their predictions (bagging)",
              "Using the training data twice",
              "Selecting only the best features",
            ],
            correctIndex: 1,
            explanation: "Random forests use bagging (bootstrap aggregating) — each tree trains on a random sample with replacement and considers a random subset of features. The ensemble reduces variance.",
            xpReward: 15,
          },
          {
            id: "l3-m2-n1-e3",
            type: "code-complete",
            question: "Train a Random Forest classifier on gene expression data:",
            codeTemplate: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

X = np.random.randn(200, 100)  # 200 samples, 100 genes
y = np.random.randint(0, 2, 200)  # binary labels

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(___, ___)

y_pred = rf.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")`,
            codeAnswer: "rf.fit(X_train, y_train)",
            xpReward: 20,
          },
          {
            id: "l3-m2-n1-e4",
            type: "code-complete",
            question: "Get and sort feature importances from the trained Random Forest:",
            codeTemplate: `import pandas as pd

gene_names = [f'Gene{i}' for i in range(100)]
importances = pd.Series(rf.feature_importances_, index=gene_names)
top_genes = importances.sort_values(ascending=False).___
print(top_genes)`,
            codeAnswer: "top_genes = importances.sort_values(ascending=False).head(10)",
            xpReward: 15,
          },
          {
            id: "l3-m2-n1-e5",
            type: "free-text",
            question: "Feature importance from a Random Forest identifies which genes best predict the label. What biological validation would you do to confirm these are truly meaningful, rather than just statistical artifacts?",
            rubric: ["independent validation cohort", "literature check or known biology", "experimental validation suggestion", "multiple testing awareness"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m3",
    title: "Neural Networks from Scratch",
    description: "Perceptrons, backpropagation, and NumPy implementation",
    realm: 3,
    color: "#a855f7",
    nodes: [
      {
        id: "l3-m3-n1",
        moduleId: "l3-m3",
        title: "The Perceptron & Forward Pass",
        description: "Building a neural network by hand in NumPy",
        icon: "🧠",
        xpReward: 220,
        exercises: [
          {
            id: "l3-m3-n1-e1",
            type: "multiple-choice",
            question: "What is an activation function and why is it necessary?",
            options: [
              "It speeds up training",
              "It introduces non-linearity — without it, deep networks collapse to a single linear transformation",
              "It normalizes the input data",
              "It prevents gradient explosion",
            ],
            correctIndex: 1,
            explanation: "Without activation functions, stacking linear layers = one big linear layer. Non-linear activations (ReLU, sigmoid, tanh) let networks learn complex, non-linear patterns.",
            xpReward: 15,
          },
          {
            id: "l3-m3-n1-e2",
            type: "code-complete",
            question: "Implement the ReLU activation function:",
            codeTemplate: `import numpy as np

def relu(x):
    return np.maximum(___, x)

print(relu(np.array([-2, -1, 0, 1, 2])))
# Expected: [0, 0, 0, 1, 2]`,
            codeAnswer: "return np.maximum(0, x)",
            xpReward: 15,
          },
          {
            id: "l3-m3-n1-e3",
            type: "code-complete",
            question: "Implement the forward pass of a single neural network layer:",
            codeTemplate: `import numpy as np

def layer_forward(X, W, b, activation='relu'):
    """
    X: input (batch_size, input_dim)
    W: weights (input_dim, output_dim)
    b: bias (output_dim,)
    """
    z = np.dot(X, ___) + ___
    if activation == 'relu':
        return np.maximum(0, z)
    elif activation == 'sigmoid':
        return 1 / (1 + np.exp(-z))
    return z`,
            codeAnswer: "z = np.dot(X, W) + b",
            xpReward: 20,
          },
          {
            id: "l3-m3-n1-e4",
            type: "multiple-choice",
            question: "What is backpropagation?",
            options: [
              "Running the forward pass in reverse to reconstruct the input",
              "Using the chain rule of calculus to compute gradients of the loss w.r.t. every parameter",
              "A method of regularization that drops neurons",
              "The process of loading data in batches",
            ],
            correctIndex: 1,
            explanation: "Backprop applies the chain rule layer by layer, going backwards from the loss to compute how much each weight contributed to the error. These gradients guide parameter updates.",
            xpReward: 15,
          },
          {
            id: "l3-m3-n1-e5",
            type: "free-text",
            question: "Explain the vanishing gradient problem in your own words. Why does it particularly affect sigmoid activations in deep networks? What was the solution that made deep learning possible?",
            rubric: ["gradients shrink as they propagate back", "sigmoid squashes to 0-1 so derivatives < 0.25", "ReLU/residual connections as solution mentioned"],
            xpReward: 35,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m4",
    title: "PyTorch",
    description: "Tensors, autograd, nn.Module, and training loops",
    realm: 3,
    color: "#ef4444",
    nodes: [
      {
        id: "l3-m4-n1",
        moduleId: "l3-m4",
        title: "Tensors and Autograd",
        description: "PyTorch's core data structure and automatic differentiation",
        icon: "⚡",
        xpReward: 200,
        exercises: [
          {
            id: "l3-m4-n1-e1",
            type: "code-complete",
            question: "Create a PyTorch tensor that requires gradient tracking:",
            codeTemplate: `import torch

# Create a tensor with gradient tracking enabled
x = torch.tensor([1.0, 2.0, 3.0], requires_grad=___)
print(x)`,
            codeAnswer: "x = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)",
            xpReward: 10,
          },
          {
            id: "l3-m4-n1-e2",
            type: "code-complete",
            question: "Build a simple neural network using nn.Module:",
            codeTemplate: `import torch
import torch.nn as nn

class BiologyClassifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_classes):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, num_classes)
        )

    def forward(self, x):
        return self.network(___)

model = BiologyClassifier(100, 64, 5)
print(model)`,
            codeAnswer: "return self.network(x)",
            xpReward: 20,
          },
          {
            id: "l3-m4-n1-e3",
            type: "code-complete",
            question: "Write a complete PyTorch training loop:",
            codeTemplate: `import torch
import torch.nn as nn

def train_epoch(model, dataloader, optimizer, criterion):
    model.train()
    total_loss = 0

    for batch_X, batch_y in dataloader:
        # Zero gradients
        optimizer.___()

        # Forward pass
        predictions = model(batch_X)
        loss = criterion(predictions, batch_y)

        # Backward pass
        loss.___()

        # Update parameters
        optimizer.step()
        total_loss += loss.item()

    return total_loss / len(dataloader)`,
            codeAnswer: `        optimizer.zero_grad()
        loss.backward()`,
            xpReward: 25,
          },
          {
            id: "l3-m4-n1-e4",
            type: "debug-code",
            question: "Alex's NaN loss situation — find the bug in this training loop:",
            codeTemplate: `import torch
import torch.nn as nn

model = nn.Linear(10, 1)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.BCELoss()  # Binary Cross Entropy

for epoch in range(100):
    x = torch.randn(32, 10)
    y = torch.randint(0, 2, (32,)).float()

    pred = model(x)  # Raw logits — can be any value
    loss = criterion(pred, y)  # BCELoss expects values between 0 and 1!

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()`,
            bugLine: 11,
            bugFix: "    pred = torch.sigmoid(model(x))  # Apply sigmoid to get probabilities 0-1",
            explanation: "BCELoss expects probabilities (0 to 1), but the model outputs raw logits. Use torch.sigmoid() or switch to BCEWithLogitsLoss (more numerically stable).",
            xpReward: 25,
          },
          {
            id: "l3-m4-n1-e5",
            type: "free-text",
            question: "Explain what `optimizer.zero_grad()` does and what happens if you forget it. Why does PyTorch accumulate gradients by default instead of resetting them?",
            rubric: ["gradients accumulate if not zeroed", "effect: effectively trains on sum of many batches' gradients", "intentional design for RNN/recurrent-style accumulation"],
            xpReward: 30,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m5",
    title: "Transformers",
    description: "Attention mechanism, BERT, and fine-tuning for biology",
    realm: 3,
    color: "#39ff14",
    nodes: [
      {
        id: "l3-m5-n1",
        moduleId: "l3-m5",
        title: "The Attention Mechanism",
        description: "Query, key, value — and why it revolutionized ML",
        icon: "👁️",
        xpReward: 250,
        exercises: [
          {
            id: "l3-m5-n1-e1",
            type: "multiple-choice",
            question: "Henry describes attention using a biology analogy: a transcription factor binding a promoter. In this analogy, the 'query' is:",
            options: [
              "The promoter sequence",
              "The RNA polymerase",
              "The transcription factor looking for its binding site",
              "The gene being expressed",
            ],
            correctIndex: 2,
            explanation: "The query 'searches' for relevant information. Like a TF scanning for its motif — the TF (query) looks through promoters (keys) to find matches and then activates transcription (aggregates values).",
            xpReward: 20,
          },
          {
            id: "l3-m5-n1-e2",
            type: "multiple-choice",
            question: "Self-attention in a sequence model allows each position to:",
            options: [
              "Attend to all other positions in the sequence, weighting by relevance",
              "Only look at adjacent positions (like a convolution)",
              "Attend to a fixed window of positions",
              "Remember only the previous hidden state",
            ],
            correctIndex: 0,
            explanation: "Self-attention lets every token consider every other token. This is why Transformers capture long-range dependencies better than RNNs or CNNs.",
            xpReward: 15,
          },
          {
            id: "l3-m5-n1-e3",
            type: "code-complete",
            question: "Implement scaled dot-product attention:",
            codeTemplate: `import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V):
    """
    Q, K, V: (batch, seq_len, d_k)
    """
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(___)
    attention_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(___, V)
    return output, attention_weights`,
            codeAnswer: `    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    output = torch.matmul(attention_weights, V)`,
            xpReward: 30,
          },
          {
            id: "l3-m5-n1-e4",
            type: "multiple-choice",
            question: "Why do Transformers need positional encodings?",
            options: [
              "To make the model faster",
              "Attention has no inherent sense of order — positional encodings inject position information",
              "To reduce memory usage",
              "To help the model attend to longer sequences",
            ],
            correctIndex: 1,
            explanation: "Self-attention treats inputs as a set, not a sequence — it has no concept of 'first' vs 'last'. Positional encodings (sinusoidal or learned) inject position information so order matters.",
            xpReward: 15,
          },
          {
            id: "l3-m5-n1-e5",
            type: "free-text",
            question: "Explain the concept of 'pre-training + fine-tuning' as pioneered by BERT. Why is this paradigm particularly useful for biological sequence models like ESM-2?",
            rubric: ["pre-training learns general representations from unlabeled data", "fine-tuning adapts to specific task with labeled data", "ESM-2 or protein LLM context is correct"],
            xpReward: 40,
          },
        ],
      },
    ],
  },
  {
    id: "l3-m6",
    title: "Evaluating Models Properly",
    description: "Beyond accuracy — the full evaluation toolkit",
    realm: 3,
    color: "#06b6d4",
    nodes: [
      {
        id: "l3-m6-n1",
        moduleId: "l3-m6",
        title: "Metrics That Matter",
        description: "Precision, recall, AUC-ROC, and class imbalance",
        icon: "📏",
        xpReward: 200,
        exercises: [
          {
            id: "l3-m6-n1-e1",
            type: "multiple-choice",
            question: "A cancer detection model achieves 99% accuracy. The dataset is 99% healthy, 1% cancer. What does this tell you?",
            options: [
              "The model is excellent",
              "The model may have learned to predict 'healthy' for every patient — accuracy is useless here",
              "The model needs more data",
              "99% accuracy is always suspicious",
            ],
            correctIndex: 1,
            explanation: "A model that says 'healthy' for everyone achieves 99% accuracy but has 0% recall for cancer patients. For imbalanced datasets, use precision, recall, F1, or AUC-ROC.",
            xpReward: 20,
          },
          {
            id: "l3-m6-n1-e2",
            type: "drag-drop",
            question: "Match the metric to its definition:",
            pairs: [
              { left: "Precision", right: "Of all positive predictions, what fraction were truly positive?" },
              { left: "Recall (Sensitivity)", right: "Of all true positives, what fraction did the model find?" },
              { left: "F1 Score", right: "Harmonic mean of precision and recall — balances both" },
              { left: "AUC-ROC", right: "Area under the ROC curve — model's ability to distinguish classes across all thresholds" },
            ],
            xpReward: 20,
          },
          {
            id: "l3-m6-n1-e3",
            type: "multiple-choice",
            question: "In genomics, why is random cross-validation often WRONG for sequence-based models?",
            options: [
              "It uses too much memory",
              "Genomic sequences have spatial correlations — nearby sequences in the genome are similar and will leak between train/test splits",
              "Cross-validation requires balanced classes",
              "Genomic data has too many features",
            ],
            correctIndex: 1,
            explanation: "If training and test sequences are from nearby genomic regions, the model has 'seen' similar sequences and evaluation is optimistic. Chromosome-level splits are more honest.",
            xpReward: 20,
          },
          {
            id: "l3-m6-n1-e4",
            type: "code-complete",
            question: "Calculate precision, recall, F1 using scikit-learn:",
            codeTemplate: `from sklearn.metrics import precision_recall_fscore_support, roc_auc_score
import numpy as np

y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 0])

precision, recall, f1, _ = precision_recall_fscore_support(y_true, ___, average='binary')
auc = roc_auc_score(y_true, y_pred)

print(f"Precision: {precision:.3f}")
print(f"Recall: {recall:.3f}")
print(f"F1: {f1:.3f}")
print(f"AUC: {auc:.3f}")`,
            codeAnswer: "precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='binary')",
            xpReward: 20,
          },
          {
            id: "l3-m6-n1-e5",
            type: "free-text",
            question: "You're building a model to predict rare disease-causing mutations (1 in 10,000 variants). Design an evaluation strategy from scratch — what metrics, what splits, what baselines?",
            rubric: ["mentions extreme class imbalance issue", "recommends precision-recall over accuracy/ROC", "meaningful baseline (population frequency)", "honest splitting strategy"],
            xpReward: 40,
          },
        ],
      },
    ],
  },
];

export default level3Modules;
