"use client";
import { useRef } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";
import GameHUD from "@/components/layout/GameHUD";

function CertificateMascotSignature({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="border-t border-[#39ff14] pt-1 mt-1">
        <p className="font-pixel text-[6px] text-[#39ff14]">{name}</p>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  const { progress, avatar, userName } = useGameStore();
  const certRef = useRef<HTMLDivElement>(null);

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certId = `BITBIO-${Date.now().toString(36).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ paddingTop: 56 }}>
      <GameHUD />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/profile" className="font-pixel text-[7px] text-gray-500 hover:text-gray-300">
            ← PROFILE
          </Link>
          <button onClick={handlePrint} className="pixel-btn pixel-btn-neon text-[8px] py-2 px-4">
            📄 SAVE / PRINT
          </button>
        </div>

        {/* Certificate */}
        <div
          ref={certRef}
          className="cert-border cert-holo relative p-8 md:p-12"
          style={{ background: "#070d07" }}
        >
          {/* Corner decorations */}
          {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 border-l-2 border-t-2 border-[#39ff14]`}
              style={{ transform: i === 1 ? "rotate(90deg)" : i === 2 ? "rotate(-90deg)" : i === 3 ? "rotate(180deg)" : undefined }} />
          ))}

          {/* Header */}
          <div className="text-center mb-8">
            <p className="font-pixel text-[8px] text-[#00ff88] mb-2 tracking-widest">
              BITBIO LEARNING PLATFORM
            </p>
            <h1 className="font-pixel text-[18px] md:text-[24px] text-[#39ff14] glow-neon mb-2">
              CERTIFICATE
            </h1>
            <p className="font-pixel text-[9px] text-[#00ff88] tracking-wider">
              OF COMPUTATIONAL BIOLOGY PROFICIENCY
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-[#39ff1440]" />
            <span className="text-[#39ff14] text-xl">🧬</span>
            <div className="flex-1 h-px bg-[#39ff1440]" />
          </div>

          {/* Recipient */}
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm mb-3">This certifies that</p>

            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div style={{ border: "2px solid #39ff14", padding: 4, boxShadow: "0 0 20px #39ff1440" }}>
                <AvatarRenderer config={avatar} size={80} />
              </div>
            </div>

            <h2 className="font-pixel text-[16px] text-white mb-2">{userName || "BitBio Scholar"}</h2>
            <p className="text-gray-400 text-sm">has successfully completed the full BitBio curriculum</p>
          </div>

          {/* Competencies */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            {[
              { icon: "🔬", text: "Molecular Biology & Genomics" },
              { icon: "🐍", text: "Python for Scientific Computing" },
              { icon: "📊", text: "Statistical Data Analysis" },
              { icon: "🧠", text: "Machine Learning & Deep Learning" },
              { icon: "🏛️", text: "Protein Structure Prediction" },
              { icon: "🔗", text: "Graph Neural Networks & GNNs" },
            ].map((comp) => (
              <div key={comp.text} className="flex items-center gap-2 text-sm">
                <span>{comp.icon}</span>
                <span className="text-gray-300 text-xs">{comp.text}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-[#39ff1440]" />
            <span className="text-[#39ff14] text-xl">⚡</span>
            <div className="flex-1 h-px bg-[#39ff1440]" />
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <CertificateMascotSignature name="Elliot" icon="🔬" />
            <CertificateMascotSignature name="Ben" icon="🌿" />
            <CertificateMascotSignature name="Alex" icon="⚡" />
            <CertificateMascotSignature name="Henry" icon="🔮" />
          </div>

          {/* Footer details */}
          <div className="flex justify-between items-end">
            <div>
              <p className="font-pixel text-[6px] text-gray-600">ISSUED</p>
              <p className="font-pixel text-[7px] text-gray-400">{completionDate}</p>
            </div>
            <div className="text-center">
              {/* QR code placeholder */}
              <div
                className="w-16 h-16 flex items-center justify-center border border-[#374151] text-[8px] text-gray-600 font-mono mb-1"
              >
                QR
              </div>
            </div>
            <div className="text-right">
              <p className="font-pixel text-[6px] text-gray-600">CERT ID</p>
              <p className="font-pixel text-[7px] text-[#39ff14]">{certId}</p>
            </div>
          </div>

          {/* Total XP */}
          <div className="text-center mt-4">
            <p className="font-pixel text-[7px] text-[#f59e0b]">
              Total XP: {progress.totalXP.toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-center font-pixel text-[7px] text-gray-600 mt-4">
          Verify at bitbio.io/verify/{certId}
        </p>
      </div>
    </div>
  );
}
