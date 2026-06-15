"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function SequenceOrder({ exercise, onAnswer }: Props) {
  const items = exercise.items ?? [];
  const [order, setOrder] = useState<number[]>(() =>
    [...Array(items.length).keys()].sort(() => Math.random() - 0.5)
  );
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (pos: number) => setDraggingIdx(pos);
  const handleDragOver = (e: React.DragEvent, pos: number) => {
    e.preventDefault();
    setDragOverIdx(pos);
  };
  const handleDrop = (e: React.DragEvent, pos: number) => {
    e.preventDefault();
    if (draggingIdx === null || draggingIdx === pos) {
      setDraggingIdx(null);
      setDragOverIdx(null);
      return;
    }
    const newOrder = [...order];
    const [moved] = newOrder.splice(draggingIdx, 1);
    newOrder.splice(pos, 0, moved);
    setOrder(newOrder);
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const submit = () => {
    if (submitted) return;
    const correct = exercise.correctOrder?.every((v, i) => v === order[i]) ?? false;
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onAnswer(correct), 900);
  };

  return (
    <div className="space-y-3 exercise-container">
      <p className="text-gray-400 text-xs font-mono">Drag to reorder from first → last</p>
      <div className="space-y-2">
        {order.map((itemIdx, pos) => {
          const isCorrectPos = submitted && exercise.correctOrder?.[pos] === itemIdx;
          const isWrongPos = submitted && exercise.correctOrder?.[pos] !== itemIdx;
          return (
            <div
              key={itemIdx}
              draggable={!submitted}
              onDragStart={() => handleDragStart(pos)}
              onDragOver={(e) => handleDragOver(e, pos)}
              onDrop={(e) => handleDrop(e, pos)}
              onDragEnd={() => { setDraggingIdx(null); setDragOverIdx(null); }}
              className={`drag-item flex items-center gap-3 p-3 border-2 transition-all
                ${draggingIdx === pos ? "opacity-40" : ""}
                ${dragOverIdx === pos && draggingIdx !== pos ? "border-[#39ff14] bg-[#39ff1410]" : "border-[#374151]"}
                ${submitted ? (isCorrectPos ? "border-[#39ff14] bg-[#39ff1410]" : isWrongPos ? "border-[#ef4444] bg-[#ef444410]" : "") : "bg-[#111827] hover:border-[#39ff14]"}
              `}
            >
              <span className="font-pixel text-[8px] text-[#39ff14] w-6 text-center flex-shrink-0">
                {pos + 1}
              </span>
              <span className="text-sm text-gray-200">{items[itemIdx]}</span>
              {!submitted && <span className="ml-auto text-gray-600 text-xs">⠿</span>}
              {submitted && isCorrectPos && <span className="ml-auto text-[#39ff14]">✓</span>}
              {submitted && isWrongPos && <span className="ml-auto text-[#ef4444]">✗</span>}
            </div>
          );
        })}
      </div>

      {submitted && !isCorrect && (
        <div className="pixel-card border border-[#f59e0b] p-3 text-sm text-gray-300">
          <p className="font-pixel text-[7px] text-[#f59e0b] mb-1">CORRECT ORDER:</p>
          {exercise.correctOrder?.map((idx, pos) => (
            <div key={pos} className="text-xs py-0.5">
              {pos + 1}. {items[idx]}
            </div>
          ))}
        </div>
      )}

      {!submitted && (
        <button onClick={submit} className="pixel-btn pixel-btn-neon">
          LOCK IN ORDER
        </button>
      )}
    </div>
  );
}
