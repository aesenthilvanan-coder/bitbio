"use client";
import { useEffect, useState } from "react";
import type { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Realm } from "@/lib/types";
import { LEVELS, getRealmNodes } from "@/lib/curriculum";
import { useGameStore } from "@/lib/store";
import GameHUD from "@/components/layout/GameHUD";
import CytoplasmRealm from "./CytoplasmRealm";
import GenomeForestRealm from "./GenomeForestRealm";
import NeuralNebulaRealm from "./NeuralNebulaRealm";
import ProteinCathedralRealm from "./ProteinCathedralRealm";
import ProgressBar from "@/components/ui/ProgressBar";

const REALM_BACKGROUNDS: Record<Realm, () => JSX.Element> = {
  1: CytoplasmRealm,
  2: GenomeForestRealm,
  3: NeuralNebulaRealm,
  4: ProteinCathedralRealm,
};

const REALM_COLORS: Record<Realm, string> = {
  1: "#39ff14",
  2: "#52b788",
  3: "#a855f7",
  4: "#00ffff",
};

const MASCOT_ICONS: Record<string, string> = {
  elliot: "🔬",
  ben: "🌿",
  alex: "⚡",
  henry: "🔮",
};

// Path coordinates for the winding node path (relative percentages)
function generatePathPositions(count: number) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const isEvenRow = row % 2 === 0;
    const x = isEvenRow ? 15 + col * 35 : 85 - col * 35;
    const y = 85 - row * 18;
    positions.push({ x, y });
  }
  return positions;
}

interface Props {
  realm: Realm;
}

export default function RealmView({ realm }: Props) {
  const router = useRouter();
  const { progress, setCurrentNode } = useGameStore();
  const [entered, setEntered] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setEntered(true), 100);
  }, []);

  const level = LEVELS.find((l) => l.id === realm);
  const nodes = getRealmNodes(realm);
  const positions = generatePathPositions(nodes.length);
  const color = REALM_COLORS[realm];
  const BackgroundComponent = REALM_BACKGROUNDS[realm];

  const isUnlocked = progress.unlockedRealms.includes(realm);
  const completedIds = new Set(
    Object.entries(progress.completedNodes)
      .filter(([, n]) => n.completed)
      .map(([id]) => id)
  );

  const completedCount = nodes.filter((n) => completedIds.has(n.id)).length;
  const percent = nodes.length > 0 ? (completedCount / nodes.length) * 100 : 0;

  const handleNodeClick = (nodeId: string, isLocked: boolean) => {
    if (isLocked) return;
    setCurrentNode(nodeId);
    router.push(`/lesson/${realm}/${nodeId}`);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <GameHUD />
        <div className="text-center px-4 mt-16">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-pixel text-[12px] text-[#ef4444] mb-4">REALM LOCKED</h1>
          <p className="text-gray-400 mb-6">Complete the previous realm to unlock this one.</p>
          <Link href={`/realm/${Math.max(1, realm - 1)}`} className="pixel-btn pixel-btn-neon">
            ← GO BACK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      <GameHUD />
      <BackgroundComponent />

      {/* Realm UI overlay */}
      <div
        className={`relative z-10 min-h-screen flex flex-col transition-opacity duration-500 ${entered ? "opacity-100" : "opacity-0"}`}
        style={{ paddingTop: 56 }}
      >
        {/* Top bar */}
        <div className="px-4 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
          <div>
            <p className="font-pixel text-[7px] text-gray-500">REALM {realm} OF 4</p>
            <h1 className="font-pixel text-[11px] mt-1" style={{ color }}>
              {MASCOT_ICONS[level?.mascot ?? ""]} {level?.realm}
            </h1>
          </div>
          <div className="text-right">
            <p className="font-pixel text-[7px] text-gray-500 mb-1">PROGRESS</p>
            <div className="w-32">
              <ProgressBar value={percent} max={100} color={color} showPercent />
            </div>
            <p className="font-pixel text-[6px] text-gray-600 mt-1">
              {completedCount}/{nodes.length} nodes
            </p>
          </div>
        </div>

        {/* Realm selector tabs */}
        <div className="flex justify-center gap-2 px-4 mb-4">
          {LEVELS.map((l) => (
            <Link
              key={l.id}
              href={`/realm/${l.id}`}
              className={`font-pixel text-[7px] px-3 py-2 border-2 transition-all ${
                l.id === realm
                  ? "border-current"
                  : "border-[#374151] text-gray-600 hover:border-gray-500"
              } ${!progress.unlockedRealms.includes(l.id as Realm) ? "opacity-30" : ""}`}
              style={{ color: l.id === realm ? REALM_COLORS[l.id as Realm] : undefined }}
            >
              {l.id === realm ? "▶ " : ""}L{l.id}
            </Link>
          ))}
        </div>

        {/* Node path — scrollable */}
        <div className="flex-1 relative overflow-y-auto" style={{ minHeight: 600 }}>
          <div className="relative" style={{ height: Math.max(600, nodes.length * 120) }}>
            {/* SVG path lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
              {positions.slice(1).map((pos, i) => {
                const prev = positions[i];
                const w = 100;
                const h = Math.max(600, nodes.length * 120);
                return (
                  <line
                    key={i}
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${pos.x}%`}
                    y2={`${pos.y}%`}
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    opacity="0.4"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => {
              const pos = positions[i] ?? { x: 50, y: 50 };
              const isCompleted = completedIds.has(node.id);
              const prevNode = nodes[i - 1];
              const isActive = i === 0 || completedIds.has(prevNode?.id ?? "");
              const isLocked = !isActive;
              const isHovered = hoveredNode === node.id;

              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  {/* Node button */}
                  <button
                    onClick={() => handleNodeClick(node.id, isLocked)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    disabled={isLocked}
                    className={`relative w-16 h-16 flex items-center justify-center text-2xl transition-all duration-200 border-2
                      ${isCompleted ? "node-completed border-[#39ff14]" : isActive ? "node-active border-[#f59e0b]" : "node-locked border-[#374151]"}
                      ${isHovered && !isLocked ? "scale-110" : "scale-100"}
                      ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    {isLocked ? "🔒" : node.icon}
                    {/* Stars */}
                    {isCompleted && (
                      <div className="absolute -top-3 -right-3 font-pixel text-[8px] text-[#f59e0b]">
                        {"⭐".repeat(progress.completedNodes[node.id]?.stars ?? 1)}
                      </div>
                    )}
                    {/* Active pulse ring */}
                    {isActive && !isCompleted && (
                      <div
                        className="absolute inset-0 border-2 border-[#f59e0b] animate-ping"
                        style={{ opacity: 0.5 }}
                      />
                    )}
                  </button>

                  {/* Tooltip on hover */}
                  {isHovered && !isLocked && (
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pixel-card border border-[#374151] p-2 w-44 text-center z-20 pointer-events-none animate-slide-in-up"
                    >
                      <p className="font-pixel text-[7px] mb-1" style={{ color }}>
                        {node.title}
                      </p>
                      <p className="text-gray-400 text-xs">{node.description}</p>
                      <p className="font-pixel text-[6px] text-[#f59e0b] mt-1">
                        +{node.xpReward} XP · {node.exercises.length} exercises
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom mascot hint */}
        <div
          className="px-4 py-3 border-t border-[#374151]"
          style={{ background: "#0a0a0a99", backdropFilter: "blur(8px)" }}
        >
          <p className="font-pixel text-[7px] text-center" style={{ color }}>
            {MASCOT_ICONS[level?.mascot ?? ""]} {level?.mascot?.toUpperCase()} · {level?.title}
            <span className="text-gray-600 mx-2">·</span>
            <span className="text-gray-500">{level?.description}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
