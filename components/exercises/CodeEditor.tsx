"use client";
import { useState, useCallback } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function CodeEditor({ exercise, onAnswer }: Props) {
  const [code, setCode] = useState(exercise.codeTemplate ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const normalizeCode = (s: string) =>
    s.trim().replace(/\s+/g, " ").replace(/\n\s+/g, "\n");

  const checkAnswer = useCallback(() => {
    if (submitted) return;
    const expected = normalizeCode(exercise.codeAnswer ?? "");
    const actual = normalizeCode(code);
    const correct = actual.includes(expected) || expected.includes(actual);
    setIsCorrect(correct);
    setSubmitted(true);
    setOutput(correct ? "✓ Correct!" : "✗ Not quite right");
    setTimeout(() => onAnswer(correct), 900);
  }, [code, exercise.codeAnswer, submitted, onAnswer]);

  const lines = code.split("\n");

  return (
    <div className="space-y-3 exercise-container">
      {/* Code editor — custom pixel-styled textarea */}
      <div className="pixel-terminal relative">
        <div className="flex">
          {/* Line numbers */}
          <div className="text-gray-600 select-none pr-4 text-right" style={{ minWidth: 32 }}>
            {lines.map((_, i) => (
              <div key={i} className="text-xs leading-6">{i + 1}</div>
            ))}
          </div>
          {/* Editor */}
          <textarea
            value={code}
            onChange={(e) => !submitted && setCode(e.target.value)}
            className="flex-1 bg-transparent outline-none resize-none text-[#e5e7eb] text-sm leading-6 font-mono"
            rows={Math.max(6, lines.length + 1)}
            style={{ caretColor: "#39ff14" }}
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const newCode = code.substring(0, start) + "    " + code.substring(end);
                setCode(newCode);
                setTimeout(() => {
                  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                }, 0);
              }
            }}
          />
        </div>
      </div>

      {/* Output panel */}
      {output && (
        <div
          className={`p-3 border-2 text-sm font-mono animate-slide-in-up ${isCorrect ? "border-[#39ff14] text-[#39ff14]" : "border-[#ef4444] text-[#ef4444]"}`}
        >
          {output}
        </div>
      )}

      {/* Explanation */}
      {submitted && exercise.explanation && (
        <div className="pixel-card border border-[#39ff14] p-3">
          <p className="text-[#39ff14] font-pixel text-[7px] mb-1">EXPLANATION</p>
          <p className="text-gray-300 text-sm">{exercise.explanation}</p>
        </div>
      )}

      {!submitted && (
        <div className="flex gap-3">
          <button onClick={checkAnswer} className="pixel-btn pixel-btn-neon">
            ▶ RUN & CHECK
          </button>
          <button
            onClick={() => setCode(exercise.codeTemplate ?? "")}
            className="pixel-btn pixel-btn-dark text-[9px]"
          >
            RESET
          </button>
        </div>
      )}
    </div>
  );
}
