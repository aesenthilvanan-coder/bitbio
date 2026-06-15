"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function TapCorrect({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;
    const correct = exercise.correctIndices ?? [];
    const selectedArr = [...selected];
    const allCorrect =
      selectedArr.length === correct.length &&
      selectedArr.every((i) => correct.includes(i));
    setSubmitted(true);
    setTimeout(() => onAnswer(allCorrect), 900);
  };

  const correct = exercise.correctIndices ?? [];

  return (
    <div className="space-y-3 exercise-container">
      <p className="text-gray-400 text-xs font-mono">Tap ALL that apply</p>
      <div className="flex flex-wrap gap-2">
        {exercise.options?.map((opt, i) => {
          const isSelected = selected.has(i);
          const isCorrect = correct.includes(i);
          let cls = "px-4 py-2 border-2 font-pixel text-[8px] cursor-pointer transition-all select-none";
          if (submitted) {
            if (isCorrect) cls += " border-[#39ff14] bg-[#39ff1420] text-[#39ff14]";
            else if (isSelected && !isCorrect) cls += " border-[#ef4444] bg-[#ef444420] text-[#ef4444]";
            else cls += " border-[#374151] text-gray-600";
          } else {
            cls += isSelected
              ? " border-[#39ff14] bg-[#39ff1420] text-[#39ff14]"
              : " border-[#374151] text-gray-300 hover:border-[#39ff14]";
          }
          return (
            <button key={i} onClick={() => toggle(i)} className={cls}>
              {isSelected && !submitted && "✓ "}{opt}
            </button>
          );
        })}
      </div>

      {submitted && exercise.explanation && (
        <div className="pixel-card border border-[#39ff14] p-3 text-sm text-gray-300">
          <p className="font-pixel text-[7px] text-[#39ff14] mb-1">EXPLANATION</p>
          {exercise.explanation}
        </div>
      )}

      {!submitted && (
        <button
          onClick={submit}
          disabled={selected.size === 0}
          className="pixel-btn pixel-btn-neon disabled:opacity-40"
        >
          SUBMIT
        </button>
      )}
    </div>
  );
}
