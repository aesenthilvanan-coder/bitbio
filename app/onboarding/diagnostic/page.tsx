"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import PixelButton from "@/components/ui/PixelButton";
import ProgressBar from "@/components/ui/ProgressBar";

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    question: "What is DNA?",
    options: [
      "A molecule that stores genetic information in cells",
      "A type of protein found in the bloodstream",
      "An organelle that produces energy",
      "A hormone released during stress",
    ],
    correct: 0,
    level: 1,
  },
  {
    id: 2,
    question: "Which of these is a valid Python variable assignment?",
    options: ["gene name = 'BRCA1'", "gene_name = 'BRCA1'", "gene-name = 'BRCA1'", "1gene = 'BRCA1'"],
    correct: 1,
    level: 1,
  },
  {
    id: 3,
    question: "What does the Central Dogma of molecular biology describe?",
    options: [
      "The structure of the cell membrane",
      "The flow of genetic information: DNA → RNA → Protein",
      "The process of natural selection",
      "The replication of chromosomes during cell division",
    ],
    correct: 1,
    level: 1,
  },
  {
    id: 4,
    question: "What is RNA-seq used for?",
    options: [
      "Sequencing DNA for variant calling",
      "Measuring gene expression levels across a genome",
      "Editing genes using CRISPR",
      "Determining protein structure",
    ],
    correct: 1,
    level: 2,
  },
  {
    id: 5,
    question: "What does a p-value of 0.05 mean in a hypothesis test?",
    options: [
      "There is a 5% chance the null hypothesis is true",
      "The result is 95% accurate",
      "If the null hypothesis were true, we'd see this result ~5% of the time by chance",
      "The effect size is 5%",
    ],
    correct: 2,
    level: 2,
  },
  {
    id: 6,
    question: "What does this Python snippet output?\n`x = [1,2,3]; print(sum(x))`",
    options: ["[1,2,3]", "123", "6", "TypeError"],
    correct: 2,
    level: 1,
  },
  {
    id: 7,
    question: "What is a loss function in machine learning?",
    options: [
      "A measure of model complexity",
      "A function that quantifies the error between predictions and true labels",
      "The number of layers in a neural network",
      "A method for initializing model weights",
    ],
    correct: 1,
    level: 3,
  },
  {
    id: 8,
    question: "In a pandas DataFrame, what does `df.groupby('cell_type').mean()` do?",
    options: [
      "Sorts the DataFrame by cell_type",
      "Filters rows where cell_type equals 'mean'",
      "Groups rows by cell_type and computes the mean of each group",
      "Creates a new column called cell_type_mean",
    ],
    correct: 2,
    level: 2,
  },
  {
    id: 9,
    question: "What is backpropagation in neural networks?",
    options: [
      "The process of loading training data in reverse order",
      "Using the chain rule to compute gradients of the loss w.r.t. model parameters",
      "Regularizing a model by dropping neurons during training",
      "Running the model on validation data after each epoch",
    ],
    correct: 1,
    level: 3,
  },
  {
    id: 10,
    question: "What does the pLDDT score in an AlphaFold2 prediction represent?",
    options: [
      "The probability that the sequence is a real protein",
      "Per-residue confidence in the predicted 3D structure (0-100)",
      "The predicted binding affinity to a drug molecule",
      "The multiple sequence alignment depth",
    ],
    correct: 1,
    level: 4,
  },
  {
    id: 11,
    question: "Which of these is a valid NumPy operation?",
    options: [
      "np.array([1,2,3]) + 'hello'",
      "np.array([1,2,3]) * 2",
      "np.array([1,2,3]).append(4)",
      "np.array([1,2,3])[4]",
    ],
    correct: 1,
    level: 2,
  },
  {
    id: 12,
    question: "What does gradient descent minimize?",
    options: [
      "The number of model parameters",
      "The learning rate over time",
      "The loss function by adjusting model weights in the negative gradient direction",
      "The size of the training dataset",
    ],
    correct: 2,
    level: 3,
  },
  {
    id: 13,
    question: "What is the self-attention mechanism in Transformer models?",
    options: [
      "A method where each position attends to all other positions, weighted by relevance",
      "A loop that processes sequence elements one at a time",
      "A regularization technique that masks random positions",
      "A pooling operation that aggregates nearby tokens",
    ],
    correct: 0,
    level: 3,
  },
  {
    id: 14,
    question: "What is Multiple Sequence Alignment (MSA) used for in AlphaFold2?",
    options: [
      "Aligning sequencing reads to a reference genome",
      "Providing evolutionary covariation information — co-varying positions likely contact in 3D",
      "Creating a consensus sequence for database search",
      "Estimating the number of genes in a genome",
    ],
    correct: 1,
    level: 4,
  },
  {
    id: 15,
    question: "Identify the error in this PyTorch training loop:\n`loss.backward(); optimizer.step(); optimizer.zero_grad()`",
    options: [
      "zero_grad() should be called BEFORE backward(), not after",
      "step() should come before backward()",
      "backward() is not needed if using Adam optimizer",
      "There is no error in this order",
    ],
    correct: 0,
    level: 3,
  },
];

export default function DiagnosticPage() {
  const router = useRouter();
  const { setDiagnosticScore, completeOnboarding, progress } = useGameStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const q = DIAGNOSTIC_QUESTIONS[currentQ];

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected ?? -1];
    setAnswers(newAnswers);
    setSelected(null);
    setRevealed(false);

    if (currentQ < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      // Calculate score
      const correct = newAnswers.filter((a, i) => a === DIAGNOSTIC_QUESTIONS[i].correct).length;
      const score = Math.round((correct / DIAGNOSTIC_QUESTIONS.length) * 100);
      setDiagnosticScore(score);
      completeOnboarding();
      setDone(true);
    }
  };

  if (done) {
    const correct = answers.filter((a, i) => a === DIAGNOSTIC_QUESTIONS[i].correct).length;
    const score = Math.round((correct / DIAGNOSTIC_QUESTIONS.length) * 100);
    const realm = progress.currentRealm;
    const realmNames = ["", "The Cytoplasm", "The Genome Forest", "The Neural Nebula", "The Protein Cathedral"];
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-4 animate-float">
            {score >= 80 ? "🏆" : score >= 60 ? "⭐" : score >= 40 ? "🔬" : "🧬"}
          </div>
          <h1 className="font-pixel text-[11px] text-[#39ff14] glow-neon mb-4">
            DIAGNOSTIC COMPLETE
          </h1>
          <div className="pixel-card border border-[#39ff14] p-4 mb-6 text-center">
            <p className="font-pixel text-[24px] text-[#39ff14] mb-1">{score}%</p>
            <p className="font-pixel text-[7px] text-gray-400">
              {correct} / {DIAGNOSTIC_QUESTIONS.length} correct
            </p>
          </div>
          <p className="font-pixel text-[8px] text-gray-400 mb-2">YOU&apos;RE STARTING AT:</p>
          <p className="font-pixel text-[12px] text-[#00ff88] glow-neon-soft mb-8">
            LEVEL {realm} — {realmNames[realm]}
          </p>
          <PixelButton variant="neon" size="lg" onClick={() => router.push(`/realm/${realm}`)} className="w-full">
            ENTER THE REALM →
          </PixelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a472a10 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-pixel text-[7px] text-gray-500 mb-2">DIAGNOSTIC QUIZ</p>
          <p className="font-pixel text-[9px] text-[#39ff14]">
            {currentQ + 1} / {DIAGNOSTIC_QUESTIONS.length}
          </p>
          <div className="mt-3">
            <ProgressBar value={currentQ + 1} max={DIAGNOSTIC_QUESTIONS.length} color="#39ff14" />
          </div>
        </div>

        {/* Question card */}
        <div className="pixel-card border-2 border-[#374151] p-6 mb-4 animate-slide-in-up">
          <div className="flex items-start gap-3 mb-6">
            <span className="font-pixel text-[10px] text-[#39ff14] flex-shrink-0">Q{currentQ + 1}.</span>
            <p className="text-gray-200 leading-relaxed whitespace-pre-line">{q.question}</p>
          </div>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let cls = "w-full text-left p-3 border-2 text-sm transition-all option-btn";
              if (revealed && i === q.correct) cls += " option-correct";
              else if (revealed && i === selected && i !== q.correct) cls += " option-wrong";
              else cls += " border-[#374151] text-gray-300 hover:border-[#39ff14]";
              return (
                <button key={i} onClick={() => handleSelect(i)} className={cls}>
                  <span className="font-pixel text-[7px] text-[#39ff14] mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        {revealed && (
          <PixelButton variant="neon" size="md" onClick={handleNext} className="w-full animate-slide-in-up">
            {currentQ < DIAGNOSTIC_QUESTIONS.length - 1 ? "NEXT QUESTION →" : "SEE RESULTS →"}
          </PixelButton>
        )}

        {!revealed && (
          <p className="text-center font-pixel text-[7px] text-gray-600">SELECT AN ANSWER TO CONTINUE</p>
        )}
      </div>
    </div>
  );
}
