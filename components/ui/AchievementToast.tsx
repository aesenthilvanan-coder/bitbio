"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/store";
import { getAchievement } from "@/lib/achievements";
import { playNodeComplete } from "@/lib/sound";
import type { Achievement } from "@/lib/types";

type Phase = "entering" | "visible" | "leaving" | "hidden";

export default function AchievementToast() {
  const showAchievementModal = useGameStore((s) => s.showAchievementModal);
  const dismissAchievement = useGameStore((s) => s.dismissAchievement);

  const [phase, setPhase] = useState<Phase>("hidden");
  const [current, setCurrent] = useState<Achievement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  useEffect(() => {
    if (!showAchievementModal) return;

    const achievement = getAchievement(showAchievementModal);
    if (!achievement) return;

    // If we're in the middle of a previous toast, clear it immediately
    clearTimers();

    setCurrent(achievement);
    setPhase("entering");

    try {
      playNodeComplete();
    } catch {
      // Audio not yet initialised — safe to ignore
    }

    // After slide-in animation (0.4 s), hold visible
    const t1 = setTimeout(() => setPhase("visible"), 400);
    // After 3 s total, start slide-out
    const t2 = setTimeout(() => setPhase("leaving"), 3000);
    // After slide-out animation (0.55 s), hide and dismiss
    const t3 = setTimeout(() => {
      setPhase("hidden");
      setCurrent(null);
      dismissAchievement();
    }, 3550);

    timersRef.current = [t1, t2, t3];

    return clearTimers;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAchievementModal]);

  if (phase === "hidden" || !current) return null;

  const animationStyle =
    phase === "entering"
      ? "toast-slide-in"
      : phase === "leaving"
        ? "toast-slide-out"
        : "";

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes toastSlideOut {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(120%); opacity: 0; }
        }
        .toast-slide-in {
          animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .toast-slide-out {
          animation: toastSlideOut 0.5s ease-in forwards;
        }
      `}</style>

      <div
        role="status"
        aria-live="polite"
        className={`fixed top-4 right-4 z-50 ${animationStyle}`}
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 rounded"
          style={{
            background: "#0a0a0a",
            border: `2px solid ${current.color}`,
            boxShadow: `0 0 16px ${current.color}55, 0 4px 24px rgba(0,0,0,0.85)`,
            minWidth: "260px",
            maxWidth: "340px",
          }}
        >
          {/* Icon */}
          <span
            aria-hidden="true"
            style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}
          >
            {current.icon}
          </span>

          {/* Text block */}
          <div className="flex flex-col gap-1 overflow-hidden">
            <span
              style={{
                color: current.color,
                fontSize: 7,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Achievement Unlocked!
            </span>
            <span
              style={{
                color: "#ffffff",
                fontSize: 8,
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {current.title}
            </span>
            <span
              style={{
                color: "#39ff14",
                fontSize: 7,
                marginTop: 2,
              }}
            >
              +{current.xpReward} XP
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
