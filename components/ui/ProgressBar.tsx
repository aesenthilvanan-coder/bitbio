"use client";

interface Props {
  value: number; // 0-100
  max?: number;
  color?: string;
  label?: string;
  showPercent?: boolean;
  height?: number;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "#39ff14",
  label,
  showPercent = false,
  height = 12,
  animated = true,
}: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="font-pixel text-[8px] text-gray-400">{label}</span>}
          {showPercent && (
            <span className="font-pixel text-[8px]" style={{ color }}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className="progress-bar w-full"
        style={{ height }}
      >
        <div
          className={`progress-bar-fill ${animated ? "transition-all duration-700" : ""}`}
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}60, ${color})`,
          }}
        />
      </div>
    </div>
  );
}
