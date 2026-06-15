"use client";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

interface Props {
  xp: number;
  compact?: boolean;
}

const THRESHOLDS = [0, 2000, 6000, 12000, 50000];
const LEVEL_NAMES = ["Nucleotide", "Gene", "Chromosome", "Genome", "Proteome"];

export default function XPDisplay({ xp, compact = false }: Props) {
  const [display, setDisplay] = useState(xp);

  useEffect(() => {
    // Animate count-up
    const start = display;
    const end = xp;
    if (start === end) return;
    const diff = end - start;
    const duration = 600;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [xp]); // eslint-disable-line

  let levelIdx = 0;
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) { levelIdx = i; break; }
  }
  const nextThreshold = THRESHOLDS[levelIdx + 1] ?? 50000;
  const prevThreshold = THRESHOLDS[levelIdx] ?? 0;
  const pct = ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[#39ff14] font-pixel text-[8px]">⭐ {display.toLocaleString()}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="font-pixel text-[8px] text-[#39ff14]">{LEVEL_NAMES[levelIdx]}</span>
        <span className="font-pixel text-[8px] text-gray-400">{display.toLocaleString()} XP</span>
      </div>
      <ProgressBar value={pct} max={100} color="#39ff14" />
      <div className="text-right">
        <span className="font-pixel text-[7px] text-gray-500">
          {(nextThreshold - xp).toLocaleString()} to {LEVEL_NAMES[levelIdx + 1] ?? "Max"}
        </span>
      </div>
    </div>
  );
}
