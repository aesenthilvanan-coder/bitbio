"use client";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";

export default function ConsentPage() {
  const router = useRouter();
  const { setDiagnosticConsent, progress } = useGameStore();

  const handle = (consent: boolean) => {
    setDiagnosticConsent(consent);
    if (consent) {
      router.push("/onboarding/diagnostic");
    } else {
      router.push("/realm/1");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a472a15 0%, transparent 70%)" }} />

      <div className="relative z-10 text-center max-w-sm w-full">
        <h1 className="font-pixel text-[10px] text-[#39ff14] glow-neon mb-4 leading-relaxed">
          WANT US TO USE YOUR AGE TO PLACE YOU?
        </h1>
        <p className="text-gray-400 text-sm mb-3 leading-relaxed">
          You said you&apos;re <span className="text-[#39ff14] font-pixel text-[10px]">{progress.age}</span>.
        </p>
        <p className="text-gray-400 text-sm mb-10 leading-relaxed">
          Taking the diagnostic quiz places you at the right level — so we don&apos;t waste your time. Should take 5 minutes.
        </p>

        <div className="flex gap-4 justify-center mb-8">
          {/* YES button */}
          <button
            onClick={() => handle(true)}
            className="pixel-btn pixel-btn-neon w-36 h-20 flex flex-col items-center justify-center gap-2 font-pixel text-[14px] hover:-translate-y-2 transition-transform"
          >
            <span className="text-2xl animate-bounce-gentle">👍</span>
            YES
          </button>

          {/* NO button */}
          <button
            onClick={() => handle(false)}
            className="pixel-btn pixel-btn-dark w-36 h-20 flex flex-col items-center justify-center gap-2 font-pixel text-[14px]"
            style={{ animation: "none" }}
          >
            <span className="text-2xl">🙅</span>
            NO THANKS
          </button>
        </div>

        <p className="font-pixel text-[7px] text-gray-600">
          Selecting NO starts you at Level 1 regardless of age
        </p>
      </div>
    </div>
  );
}
