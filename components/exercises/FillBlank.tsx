"use client";
import { useState, useRef } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function FillBlank({ exercise, onAnswer }: Props) {
  const [inputs, setInputs] = useState<string[]>((exercise.blanks ?? []).map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const submit = () => {
    if (submitted) return;
    const res = (exercise.blanks ?? []).map(
      (blank, i) => inputs[i].trim().toLowerCase() === blank.answer.toLowerCase()
    );
    setResults(res);
    setSubmitted(true);
    const allCorrect = res.every(Boolean);
    setTimeout(() => onAnswer(allCorrect), 900);
  };

  // Parse question text and render blanks inline
  const parts = exercise.question.split("_____");

  return (
    <div className="space-y-4 exercise-container">
      <div className="text-gray-200 text-base leading-loose">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < (exercise.blanks?.length ?? 0) && (
              <input
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                value={inputs[i]}
                onChange={(e) => {
                  const next = [...inputs];
                  next[i] = e.target.value;
                  setInputs(next);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (i < parts.length - 2) inputRefs.current[i + 1]?.focus();
                    else submit();
                  }
                }}
                disabled={submitted}
                className={`inline-block mx-1 px-2 py-1 font-mono text-sm border-b-2 bg-transparent outline-none min-w-[80px] text-center transition-colors
                  ${submitted
                    ? results[i]
                      ? "border-[#39ff14] text-[#39ff14]"
                      : "border-[#ef4444] text-[#ef4444]"
                    : "border-[#374151] focus:border-[#39ff14] text-white"
                  }`}
                placeholder="___"
              />
            )}
          </span>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={submit}
          className="pixel-btn pixel-btn-neon"
          disabled={inputs.some((v) => !v.trim())}
        >
          CHECK ANSWER
        </button>
      )}

      {submitted && exercise.explanation && (
        <div className="pixel-card border border-[#39ff14] p-3 animate-slide-in-up">
          <p className="text-[#39ff14] font-pixel text-[7px] mb-1">EXPLANATION</p>
          <p className="text-gray-300 text-sm">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
