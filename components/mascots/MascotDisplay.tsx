"use client";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import type { Realm, MascotDialogue } from "@/lib/types";
import { elliotDialogue } from "@/lib/dialogue/elliot";
import { benDialogue } from "@/lib/dialogue/ben";
import { alexDialogue } from "@/lib/dialogue/alex";
import { henryDialogue } from "@/lib/dialogue/henry";

// ── Pixel art mascots as SVGs ──────────────────────────────────────────────────

function ElliotSVG({ animation }: { animation: string }) {
  const jumping = animation === "jump";
  const cheering = animation === "cheer";
  const spinning = animation === "spin";
  return (
    <svg viewBox="0 0 32 56" width="80" height="112" style={{ imageRendering: "pixelated" }}
      className={`${jumping ? "animate-bounce-gentle" : ""} ${spinning ? "animate-spin-slow" : ""}`}>
      {/* Lab coat */}
      <rect x="8" y="30" width="16" height="18" fill="#f9fafb" />
      <rect x="5" y="30" width="4" height="14" fill="#f9fafb" />
      <rect x="23" y="30" width="4" height="14" fill="#f9fafb" />
      {/* Lab coat details */}
      <path d="M16 30 v8" stroke="#d1d5db" strokeWidth="1" />
      <rect x="17" y="33" width="4" height="3" fill="#3b82f6" opacity="0.7" />
      {/* Mismatched socks */}
      <rect x="8" y="48" width="5" height="5" fill="#ef4444" />
      <rect x="19" y="48" width="5" height="5" fill="#3b82f6" />
      {/* Shoes */}
      <rect x="7" y="52" width="6" height="3" rx="1" fill="#1f2937" />
      <rect x="19" y="52" width="6" height="3" rx="1" fill="#1f2937" />
      {/* Pants */}
      <rect x="8" y="44" width="6" height="6" fill="#374151" />
      <rect x="18" y="44" width="6" height="6" fill="#374151" />
      {/* Neck */}
      <rect x="14" y="28" width="4" height="3" fill="#c68642" />
      {/* Head - slightly elongated */}
      <rect x="7" y="8" width="18" height="22" rx="3" fill="#c68642" />
      {/* Wild curly hair */}
      <ellipse cx="16" cy="9" rx="11" ry="6" fill="#1a1a1a" />
      <circle cx="7" cy="12" r="3" fill="#1a1a1a" />
      <circle cx="25" cy="12" r="3" fill="#1a1a1a" />
      <circle cx="10" cy="7" r="2.5" fill="#1a1a1a" />
      <circle cx="22" cy="7" r="2.5" fill="#1a1a1a" />
      <circle cx="16" cy="5" r="2" fill="#1a1a1a" />
      {/* Thick round glasses */}
      <circle cx="12" cy="18" r="4" fill="none" stroke="#1f2937" strokeWidth="2" />
      <circle cx="20" cy="18" r="4" fill="none" stroke="#1f2937" strokeWidth="2" />
      <path d="M16 18 h0.1" stroke="#1f2937" strokeWidth="2" />
      <path d="M8 18 h0" stroke="#1f2937" strokeWidth="1.5" />
      <path d="M24 18 h0" stroke="#1f2937" strokeWidth="1.5" />
      {/* Eyes behind glasses */}
      <circle cx="12" cy="18" r="2" fill="#3b82f6" />
      <circle cx="20" cy="18" r="2" fill="#3b82f6" />
      <circle cx="12" cy="18" r="0.7" fill="white" />
      <circle cx="20" cy="18" r="0.7" fill="white" />
      {/* Eyebrows - thick arched */}
      <path d="M9 14 q3-2 6 0" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <path d="M17 14 q3-2 6 0" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Mouth - enthusiastic smile */}
      <path d={cheering ? "M11 24 q5 5 10 0" : "M11 24 q5 3 10 0"} stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Cheering arms up */}
      {cheering && (
        <>
          <rect x="2" y="24" width="4" height="10" rx="1" fill="#f9fafb" transform="rotate(-40 4 29)" />
          <rect x="26" y="24" width="4" height="10" rx="1" fill="#f9fafb" transform="rotate(40 28 29)" />
        </>
      )}
    </svg>
  );
}

function BenSVG({ animation }: { animation: string }) {
  const cheering = animation === "cheer";
  return (
    <svg viewBox="0 0 32 56" width="80" height="112" style={{ imageRendering: "pixelated" }}
      className={animation === "jump" ? "animate-bounce-gentle" : ""}>
      {/* Hoodie + joggers */}
      <rect x="8" y="30" width="16" height="18" fill="#374151" />
      <rect x="5" y="30" width="4" height="14" fill="#374151" />
      <rect x="23" y="30" width="4" height="14" fill="#374151" />
      {/* Vintage band tee under hoodie */}
      <rect x="12" y="31" width="8" height="6" fill="#1f2937" />
      {/* Cargo pants */}
      <rect x="8" y="44" width="6" height="8" fill="#4b5563" />
      <rect x="18" y="44" width="6" height="8" fill="#4b5563" />
      {/* Cargo pockets */}
      <rect x="9" y="46" width="4" height="3" fill="#374151" />
      <rect x="19" y="46" width="4" height="3" fill="#374151" />
      {/* Beat-up high tops */}
      <rect x="7" y="51" width="7" height="4" rx="1" fill="#ef4444" />
      <rect x="18" y="51" width="7" height="4" rx="1" fill="#ef4444" />
      <path d="M8 53 h5 M19 53 h5" stroke="white" strokeWidth="0.5" />
      {/* Notebooks in pockets */}
      <rect x="24" y="34" width="3" height="5" fill="#f59e0b" />
      <rect x="5" y="36" width="3" height="4" fill="#10b981" />
      {/* Sandwich in hand! */}
      <rect x="24" y="40" width="5" height="3" rx="1" fill="#f59e0b" />
      <rect x="24" y="41" width="5" height="1" fill="#22c55e" />
      {/* Head */}
      <rect x="8" y="8" width="16" height="20" rx="2" fill="#8d5524" />
      {/* Hair - medium, slightly messy */}
      <rect x="7" y="6" width="18" height="6" rx="2" fill="#1a1a1a" />
      <rect x="6" y="10" width="3" height="4" fill="#1a1a1a" />
      <rect x="23" y="10" width="3" height="4" fill="#1a1a1a" />
      {/* Eyes */}
      <ellipse cx="12" cy="18" rx="2.5" ry="2" fill="#6b4226" />
      <ellipse cx="20" cy="18" rx="2.5" ry="2" fill="#6b4226" />
      <circle cx="12.5" cy="17.5" r="0.7" fill="white" />
      <circle cx="20.5" cy="17.5" r="0.7" fill="white" />
      {/* Eyebrows - slightly raised */}
      <path d="M9 15 h5" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M18 15 h5" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Mouth - relaxed cool kid */}
      <path d={cheering ? "M11 24 q5 4 10 0" : "M11 24 q2 2 6 0"} stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Cheering */}
      {cheering && (
        <>
          <rect x="2" y="26" width="4" height="8" rx="1" fill="#374151" transform="rotate(-30 4 30)" />
          <rect x="26" y="26" width="4" height="8" rx="1" fill="#374151" transform="rotate(30 28 30)" />
        </>
      )}
    </svg>
  );
}

function AlexSVG({ animation }: { animation: string }) {
  const cheering = animation === "cheer";
  return (
    <svg viewBox="0 0 32 56" width="80" height="112" style={{ imageRendering: "pixelated" }}
      className={animation === "jump" ? "animate-bounce-gentle" : ""}>
      {/* All-black turtleneck */}
      <rect x="8" y="28" width="16" height="20" fill="#111827" />
      <rect x="5" y="28" width="4" height="14" fill="#111827" />
      <rect x="23" y="28" width="4" height="14" fill="#111827" />
      {/* Turtleneck collar */}
      <rect x="12" y="26" width="8" height="4" rx="2" fill="#111827" />
      {/* Slim trousers */}
      <rect x="9" y="44" width="5" height="8" fill="#1f2937" />
      <rect x="18" y="44" width="5" height="8" fill="#1f2937" />
      {/* Clean white sneakers */}
      <rect x="8" y="51" width="6" height="4" rx="1" fill="#f9fafb" />
      <rect x="18" y="51" width="6" height="4" rx="1" fill="#f9fafb" />
      <path d="M9 53 h4" stroke="#e5e7eb" strokeWidth="0.5" />
      {/* Coffee cup in hand */}
      <rect x="24" y="38" width="4" height="5" rx="1" fill="#92400e" />
      <path d="M28 40 q2 0 2 2" stroke="#92400e" strokeWidth="1" fill="none" />
      <rect x="24" y="38" width="4" height="1.5" fill="#f9fafb" />
      {/* Head - sharp angular face */}
      <rect x="8" y="8" width="16" height="20" rx="2" fill="#c8a882" />
      {/* Short precise hair */}
      <rect x="8" y="6" width="16" height="5" fill="#1a1a1a" />
      <rect x="7" y="9" width="2" height="3" fill="#1a1a1a" />
      <rect x="23" y="9" width="2" height="3" fill="#1a1a1a" />
      {/* Sharp determined eyes */}
      <ellipse cx="12" cy="17" rx="2.5" ry="2" fill="#1a1a1a" />
      <ellipse cx="20" cy="17" rx="2.5" ry="2" fill="#1a1a1a" />
      <circle cx="12.5" cy="16.5" r="0.7" fill="white" />
      <circle cx="20.5" cy="16.5" r="0.7" fill="white" />
      {/* Arched eyebrows - sharp */}
      <path d="M9 14 q3-2 6 1" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <path d="M17 14 q3-2 6 1" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Mouth - precise slight smile */}
      <path d={cheering ? "M11 24 q5 4 10 0" : "M12 24 q2 1.5 4 0"} stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Cheering */}
      {cheering && (
        <>
          <rect x="1" y="24" width="4" height="10" rx="1" fill="#111827" transform="rotate(-45 3 29)" />
          <rect x="27" y="24" width="4" height="10" rx="1" fill="#111827" transform="rotate(45 29 29)" />
        </>
      )}
    </svg>
  );
}

function HenrySVG({ animation }: { animation: string }) {
  const cheering = animation === "cheer";
  return (
    <svg viewBox="0 0 32 56" width="80" height="112" style={{ imageRendering: "pixelated" }}
      className={`${cheering ? "animate-pulse-glow" : ""}`}>
      {/* Holographic body - translucent geometric */}
      <rect x="8" y="28" width="16" height="20" fill="#00ffff" opacity="0.15" />
      <rect x="8" y="28" width="16" height="20" stroke="#00ffff" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Geometric pattern on body */}
      <path d="M8 34 l16 0 M8 40 l16 0 M16 28 l0 20" stroke="#00ffff" strokeWidth="0.5" opacity="0.3" />
      {/* Holographic arms */}
      <rect x="5" y="28" width="4" height="14" fill="#00ffff" opacity="0.15" stroke="#00ffff" strokeWidth="0.5" />
      <rect x="23" y="28" width="4" height="14" fill="#00ffff" opacity="0.15" stroke="#00ffff" strokeWidth="0.5" />
      {/* Legs */}
      <rect x="9" y="44" width="5" height="10" fill="#00ffff" opacity="0.15" stroke="#00ffff" strokeWidth="0.5" />
      <rect x="18" y="44" width="5" height="10" fill="#00ffff" opacity="0.15" stroke="#00ffff" strokeWidth="0.5" />
      {/* Head - clean, slightly angular */}
      <rect x="8" y="8" width="16" height="20" rx="2" fill="#e0f7fa" />
      {/* Geometric patterns under skin */}
      <path d="M12 12 l8 0 M10 18 l12 0 M12 24 l8 0" stroke="#00ffff" strokeWidth="0.5" opacity="0.4" />
      {/* No hair - smooth */}
      <rect x="8" y="6" width="16" height="4" rx="2" fill="#b2ebf2" />
      {/* Glowing eyes */}
      <ellipse cx="12" cy="18" rx="2.5" ry="2" fill="#00ffff" opacity="0.8" />
      <ellipse cx="20" cy="18" rx="2.5" ry="2" fill="#00ffff" opacity="0.8" />
      <ellipse cx="12" cy="18" rx="1.5" ry="1.2" fill="#00bcd4" />
      <ellipse cx="20" cy="18" rx="1.5" ry="1.2" fill="#00bcd4" />
      <circle cx="12.5" cy="17.5" r="0.6" fill="white" />
      <circle cx="20.5" cy="17.5" r="0.6" fill="white" />
      {/* Eyebrows - thin precise */}
      <path d="M9 15 h6" stroke="#00838f" strokeWidth="1" />
      <path d="M17 15 h6" stroke="#00838f" strokeWidth="1" />
      {/* Subtle smile */}
      <path d={cheering ? "M11 24 q5 4 10 0" : "M12 25 q4 2 8 0"} stroke="#00838f" strokeWidth="1.5" fill="none" />
      {/* Holographic glow effect */}
      <ellipse cx="16" cy="30" rx="8" ry="2" fill="#00ffff" opacity="0.05" />
      {/* Particles */}
      {cheering && (
        <>
          <circle cx="6" cy="20" r="1" fill="#00ffff" opacity="0.8" className="animate-pulse-glow" />
          <circle cx="26" cy="16" r="1" fill="#00ffff" opacity="0.8" className="animate-pulse-glow" />
          <circle cx="4" cy="30" r="0.8" fill="#a855f7" opacity="0.8" />
          <circle cx="28" cy="26" r="0.8" fill="#a855f7" opacity="0.8" />
        </>
      )}
    </svg>
  );
}

const MASCOT_SVG: Record<string, (anim: string) => JSX.Element> = {
  elliot: (a) => <ElliotSVG animation={a} />,
  ben: (a) => <BenSVG animation={a} />,
  alex: (a) => <AlexSVG animation={a} />,
  henry: (a) => <HenrySVG animation={a} />,
};

const MASCOT_COLORS: Record<string, string> = {
  elliot: "#39ff14",
  ben: "#52b788",
  alex: "#f59e0b",
  henry: "#00ffff",
};

const ALL_DIALOGUE: Record<string, MascotDialogue[]> = {
  elliot: elliotDialogue,
  ben: benDialogue,
  alex: alexDialogue,
  henry: henryDialogue,
};

function getMascotForRealm(realm: Realm): string {
  return ["elliot", "ben", "alex", "henry"][realm - 1] ?? "elliot";
}

interface Props {
  realm: Realm;
  trigger?: MascotDialogue["trigger"];
  dialogueId?: string | null;
  animation?: string;
  onDialogueEnd?: () => void;
  size?: "sm" | "md" | "lg";
  showBubble?: boolean;
}

export default function MascotDisplay({
  realm,
  trigger = "idle",
  dialogueId,
  animation = "idle",
  onDialogueEnd,
  size = "md",
  showBubble = true,
}: Props) {
  const mascot = getMascotForRealm(realm);
  const dialogue = ALL_DIALOGUE[mascot] ?? [];
  const color = MASCOT_COLORS[mascot] ?? "#39ff14";

  const [currentDialogue, setCurrentDialogue] = useState<MascotDialogue | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Select dialogue based on trigger
    const options = dialogue.filter((d) =>
      dialogueId ? d.id === dialogueId : d.trigger === trigger
    );
    if (options.length === 0) return;
    const selected = options[Math.floor(Math.random() * options.length)];
    setCurrentDialogue(selected);
    setDisplayedText("");
    setIsTyping(true);

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(selected.text.slice(0, i + 1));
      i++;
      if (i >= selected.text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => {
          onDialogueEnd?.();
        }, 3000);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [trigger, dialogueId]); // eslint-disable-line

  const sizeMap = { sm: 60, md: 90, lg: 120 };
  const svgSize = sizeMap[size];

  return (
    <div className="flex flex-col items-start gap-3 max-w-sm">
      {/* Speech bubble */}
      {showBubble && currentDialogue && (
        <div className="speech-bubble w-full animate-slide-in-up">
          <p className="text-sm text-gray-200 leading-relaxed" style={{ fontFamily: "Space Mono, monospace" }}>
            {displayedText}
            {isTyping && <span className="terminal-cursor ml-1" />}
          </p>
        </div>
      )}
      {/* Mascot character */}
      <div
        className="relative"
        style={{
          filter: `drop-shadow(0 0 12px ${color}80)`,
        }}
      >
        <div style={{ width: svgSize, height: svgSize * 1.5 }}>
          {MASCOT_SVG[mascot]?.(animation) ?? null}
        </div>
        {/* Name tag */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-pixel text-[6px] px-2 py-1 whitespace-nowrap"
          style={{ color, background: "#0a0a0a", border: `1px solid ${color}` }}
        >
          {mascot.charAt(0).toUpperCase() + mascot.slice(1)}
        </div>
      </div>
    </div>
  );
}
