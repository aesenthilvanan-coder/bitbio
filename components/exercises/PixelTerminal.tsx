"use client";
import { useState, useRef, useEffect } from "react";
import type { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

interface Line {
  type: "input" | "output" | "error";
  text: string;
}

export default function PixelTerminal({ exercise, onAnswer }: Props) {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "BitBio Terminal v1.0 — type commands below" },
    { type: "output", text: 'Try: pwd, ls, cd sequences, cat README.txt, python script.py' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [commandCount, setCommandCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const commands = exercise.terminalCommands ?? {};

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const execute = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory((h) => [trimmed, ...h]);
    setHistIdx(-1);

    const newLines: Line[] = [{ type: "input", text: `$ ${trimmed}` }];

    const response = commands[trimmed];
    if (response !== undefined) {
      if (response) {
        newLines.push({ type: "output", text: response });
      }
      setCommandCount((c) => {
        const next = c + 1;
        if (next >= 3) {
          setTimeout(() => onAnswer(true), 800);
        }
        return next;
      });
    } else {
      newLines.push({
        type: "error",
        text: `bash: ${trimmed.split(" ")[0]}: command not found`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput("");
  };

  return (
    <div className="exercise-container space-y-3">
      <div
        className="pixel-terminal"
        style={{ minHeight: 240, maxHeight: 360, overflowY: "auto", cursor: "text" }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={`text-sm leading-6 font-mono ${
              line.type === "input"
                ? "text-[#39ff14]"
                : line.type === "error"
                ? "text-[#ef4444]"
                : "text-gray-300"
            }`}
          >
            {line.text}
          </div>
        ))}
        {/* Input line */}
        <div className="flex items-center text-[#39ff14]">
          <span className="mr-2 text-[#00ff88] font-mono text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                execute(input);
              } else if (e.key === "ArrowUp") {
                const idx = Math.min(histIdx + 1, history.length - 1);
                setHistIdx(idx);
                setInput(history[idx] ?? "");
              } else if (e.key === "ArrowDown") {
                const idx = Math.max(histIdx - 1, -1);
                setHistIdx(idx);
                setInput(idx === -1 ? "" : history[idx] ?? "");
              }
            }}
            className="flex-1 bg-transparent outline-none text-[#39ff14] font-mono text-sm caret-[#39ff14]"
            placeholder="type a command..."
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
      <p className="text-gray-500 text-xs font-mono">
        Execute {3 - commandCount} more valid commands to complete this exercise
      </p>
    </div>
  );
}
