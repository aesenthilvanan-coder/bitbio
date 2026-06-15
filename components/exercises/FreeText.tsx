"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function FreeText({ exercise, onAnswer }: Props) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);

  const submit = () => {
    if (submitted || text.trim().length < 20) return;
    setSubmitted(true);

    // Simple rubric check (client-side heuristic — real app uses Anthropic API)
    const lower = text.toLowerCase();
    const rubric = exercise.rubric ?? [];
    const met = rubric.filter((criterion) =>
      criterion
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 4)
        .some((word) => lower.includes(word))
    );
    const pct = rubric.length > 0 ? met.length / rubric.length : 0.8;
    const correct = pct >= 0.5;
    setScore(Math.round(pct * 100));
    setFeedback(met);
    setTimeout(() => onAnswer(correct), 1200);
  };

  return (
    <div className="space-y-3 exercise-container">
      <textarea
        value={text}
        onChange={(e) => !submitted && setText(e.target.value)}
        disabled={submitted}
        rows={6}
        placeholder="Type your answer here... (minimum 20 characters)"
        className="w-full bg-[#050505] border-2 border-[#374151] focus:border-[#39ff14] outline-none p-4 text-sm text-gray-200 font-mono resize-none transition-colors"
      />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{text.length} characters</span>
        <span className={text.length >= 20 ? "text-[#39ff14]" : "text-[#ef4444]"}>
          {text.length >= 20 ? "✓ Min length met" : `${20 - text.length} more to go`}
        </span>
      </div>

      {!submitted && (
        <button
          onClick={submit}
          disabled={text.trim().length < 20}
          className="pixel-btn pixel-btn-neon disabled:opacity-40"
        >
          SUBMIT ANSWER
        </button>
      )}

      {submitted && score !== null && (
        <div className="space-y-2 animate-slide-in-up">
          <div className={`pixel-card border p-3 ${score >= 50 ? "border-[#39ff14]" : "border-[#f59e0b]"}`}>
            <div className="flex justify-between items-center mb-2">
              <p className="font-pixel text-[7px] text-[#39ff14]">AI ASSESSMENT</p>
              <span className={`font-pixel text-[10px] ${score >= 50 ? "text-[#39ff14]" : "text-[#f59e0b]"}`}>
                {score}%
              </span>
            </div>
            {exercise.rubric && exercise.rubric.length > 0 && (
              <div className="space-y-1">
                {exercise.rubric.map((criterion, i) => {
                  const met = feedback.includes(criterion);
                  return (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={met ? "text-[#39ff14]" : "text-gray-600"}>
                        {met ? "✓" : "○"}
                      </span>
                      <span className={met ? "text-gray-300" : "text-gray-600"}>{criterion}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {score < 50 && (
            <p className="text-gray-400 text-xs">
              Good attempt! Try expanding on the key concepts in the rubric above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
