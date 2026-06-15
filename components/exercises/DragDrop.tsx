"use client";
import { useState, useCallback } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function DragDrop({ exercise, onAnswer }: Props) {
  const pairs = exercise.pairs ?? [];
  const [dropped, setDropped] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const available = pairs
    .map((p) => p.right)
    .sort(() => Math.random() - 0.5)
    .filter((r, i, self) => self.indexOf(r) === i);

  const [shuffled] = useState(() => [...available].sort(() => Math.random() - 0.5));
  const usedRights = Object.values(dropped);

  const handleDrop = useCallback(
    (left: string, right: string) => {
      if (submitted) return;
      setDropped((prev) => ({ ...prev, [left]: right }));
    },
    [submitted]
  );

  const handleSubmit = () => {
    if (submitted) return;
    const res: Record<string, boolean> = {};
    for (const pair of pairs) {
      res[pair.left] = dropped[pair.left] === pair.right;
    }
    setResults(res);
    setSubmitted(true);
    const allCorrect = Object.values(res).every(Boolean);
    setTimeout(() => onAnswer(allCorrect), 1200);
  };

  const allDropped = pairs.every((p) => dropped[p.left]);

  return (
    <div className="space-y-4 exercise-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column — prompts */}
        <div className="space-y-2">
          <p className="font-pixel text-[8px] text-gray-500 mb-2">DRAG FROM RIGHT →</p>
          {pairs.map((pair) => {
            const match = dropped[pair.left];
            const correct = results[pair.left];
            return (
              <div
                key={pair.left}
                className={`drop-zone p-3 border-2 border-dashed rounded flex items-start gap-2 min-h-[60px] transition-all
                  ${match ? (submitted ? (correct ? "border-[#39ff14] bg-[#39ff1410]" : "border-[#ef4444] bg-[#ef444410]") : "border-[#374151] bg-[#1f2937]") : "border-[#374151]"}`}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
                onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("drag-over");
                  const right = e.dataTransfer.getData("text/plain");
                  handleDrop(pair.left, right);
                }}
              >
                <span className="font-pixel text-[8px] text-[#39ff14] flex-shrink-0">{pair.left}</span>
                {match && (
                  <span
                    className="text-xs text-gray-300 cursor-grab"
                    draggable={!submitted}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", match);
                      setDragging(match);
                      // Remove from dropped
                      setDropped((prev) => {
                        const n = { ...prev };
                        delete n[pair.left];
                        return n;
                      });
                    }}
                  >
                    {match}
                  </span>
                )}
                {!match && <span className="text-gray-600 text-xs italic">Drop here...</span>}
              </div>
            );
          })}
        </div>

        {/* Right column — draggable options */}
        <div className="space-y-2">
          <p className="font-pixel text-[8px] text-gray-500 mb-2">DRAG ITEMS</p>
          {shuffled
            .filter((r) => !usedRights.includes(r))
            .map((right) => (
              <div
                key={right}
                className="drag-item p-3 pixel-card border-[#374151] border-2 text-xs text-gray-300 cursor-grab select-none"
                draggable={!submitted}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", right);
                  setDragging(right);
                }}
                onDragEnd={() => setDragging(null)}
                style={{ opacity: dragging === right ? 0.5 : 1 }}
              >
                {right}
              </div>
            ))}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allDropped}
          className="pixel-btn pixel-btn-neon disabled:opacity-40"
        >
          CHECK MATCHES
        </button>
      )}
    </div>
  );
}
