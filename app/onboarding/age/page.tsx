"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import PixelButton from "@/components/ui/PixelButton";

export default function AgePage() {
  const router = useRouter();
  const { setAge } = useGameStore();
  const [age, setAgeLocal] = useState(18);

  const handleConfirm = () => {
    setAge(age);
    router.push("/onboarding/consent");
  };

  const increment = () => setAgeLocal((a) => Math.min(120, a + 1));
  const decrement = () => setAgeLocal((a) => Math.max(5, a - 1));

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a472a15 0%, transparent 70%)" }} />

      <div className="relative z-10 text-center max-w-sm w-full">
        <h1 className="font-pixel text-[12px] text-[#39ff14] glow-neon mb-4">HOW OLD ARE YOU?</h1>
        <p className="font-pixel text-[7px] text-gray-500 mb-10">
          We use this to personalize where you start
        </p>

        {/* Age input */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={decrement}
            className="pixel-btn pixel-btn-dark w-16 h-16 text-2xl font-pixel"
          >
            −
          </button>

          <div className="pixel-card w-32 h-24 flex items-center justify-center border-2 border-[#39ff14]"
            style={{ boxShadow: "0 0 20px #39ff1440" }}>
            <span className="font-pixel text-[28px] text-[#39ff14] glow-neon">{age}</span>
          </div>

          <button
            onClick={increment}
            className="pixel-btn pixel-btn-dark w-16 h-16 text-2xl font-pixel"
          >
            +
          </button>
        </div>

        {/* Age range hint */}
        <div className="pixel-card border-[#374151] border p-3 mb-8 text-left">
          <p className="font-pixel text-[7px] text-gray-500 mb-2">WHAT THIS MEANS:</p>
          {[
            { range: "Under 10", desc: "Simplified language, extra visual exercises" },
            { range: "10–13", desc: "Standard Level 1 track" },
            { range: "14–17", desc: "Faster start — intro modules skipped" },
            { range: "18+", desc: "Diagnostic determines your level" },
          ].map(({ range, desc }) => (
            <div
              key={range}
              className={`flex items-start gap-2 py-1 text-xs ${
                (age < 10 && range === "Under 10") ||
                (age >= 10 && age <= 13 && range === "10–13") ||
                (age >= 14 && age <= 17 && range === "14–17") ||
                (age >= 18 && range === "18+")
                  ? "text-[#39ff14]"
                  : "text-gray-600"
              }`}
            >
              <span className="font-pixel text-[6px] w-14 flex-shrink-0">{range}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>

        <PixelButton variant="neon" size="lg" onClick={handleConfirm} className="w-full">
          CONFIRM →
        </PixelButton>
      </div>
    </div>
  );
}
