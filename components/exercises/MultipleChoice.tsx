"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handle = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const correct = i === exercise.correctIndex;
    setTimeout(() => onAnswer(correct), 900);
  };

  return (
    <div className="space-y-3 exercise-container">
      <div className="space-y-2">
        {exercise.options?.map((opt, i) => {
          let cls = "pixel-card option-btn w-full text-left p-4 border-2 border-[#374151] text-sm";
          if (revealed && i === exercise.correctIndex) cls += " option-correct";
          else if (revealed && i === selected && i !== exercise.correctIndex) cls += " option-wrong";
          return (
            <button key={i} onClick={() => handle(i)} className={cls}>
              <span className="font-pixel text-[8px] text-[#39ff14] mr-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && exercise.explanation && (
        <div className="pixel-card border-[#39ff14] border p-3 animate-slide-in-up">
          <p className="text-[#39ff14] font-pixel text-[7px] mb-1">EXPLANATION</p>
          <p className="text-gray-300 text-sm">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
