"use client";

interface Props {
  hearts: number;
  maxHearts: number;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: 16, md: 24, lg: 32 };

export default function HeartDisplay({ hearts, maxHearts, size = "md" }: Props) {
  const px = sizes[size];
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <span
          key={i}
          style={{ fontSize: px }}
          className={i < hearts ? "animate-heartbeat drop-shadow-[0_0_6px_#ef4444]" : "opacity-25 grayscale"}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
