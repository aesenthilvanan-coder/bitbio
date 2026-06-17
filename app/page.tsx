"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";

// ── Matrix bio rain canvas ─────────────────────────────────────────────────────
function BioRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const TERMS = [
      "ADENINE","THYMINE","GUANINE","CYTOSINE","PYTHON","DNA","RNA","ML",
      "ATP","GTP","HELIX","CODON","EXON","INTRON","RIBOSOME","MRNA","TRNA",
      "CRISPR","BLAST","PROTEIN","FOLDING","NEURON","SYNAPSE","GRADIENT",
    ];
    const COLS = 40;
    const drops: { x: number; y: number; speed: number; term: string; opacity: number }[] = [];

    for (let i = 0; i < COLS; i++) {
      drops.push({
        x: (i / COLS) * window.innerWidth + Math.random() * 30,
        y: Math.random() * -window.innerHeight,
        speed: 0.3 + Math.random() * 0.5,
        term: TERMS[Math.floor(Math.random() * TERMS.length)],
        opacity: 0.04 + Math.random() * 0.08,
      });
    }

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "10px 'Press Start 2P', monospace";

      drops.forEach((d) => {
        ctx.fillStyle = `rgba(0, 80, 20, ${d.opacity})`;
        d.term.split("").forEach((ch, ci) => {
          ctx.fillText(ch, d.x, d.y + ci * 14);
        });
        d.y += d.speed;
        if (d.y > canvas.height + 200) {
          d.y = -200;
          d.term = TERMS[Math.floor(Math.random() * TERMS.length)];
          d.x = Math.random() * canvas.width;
        }
      });

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        imageRendering: "pixelated",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}

// ── Pixel art canvas hero ──────────────────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const S = 2;

    const gr = (x: number, y: number, w: number, h: number, c: string) => {
      ctx.fillStyle = c;
      ctx.fillRect(x * S, y * S, w * S, h * S);
    };

    const drawDNA = (ox: number, oy: number, t: number, color1: string, color2: string) => {
      for (let i = 0; i < 40; i++) {
        const wave = Math.sin((i * 0.4) + t) * 8;
        gr(ox + 10 + wave, oy + i * 2, 3, 2, color1);
        gr(ox + 10 - wave, oy + i * 2, 3, 2, color2);
        if (i % 4 === 0) {
          const lx = Math.min(10 + wave, 10 - wave);
          const lw = Math.abs(wave * 2);
          if (lw > 1) {
            gr(ox + lx + 3, oy + i * 2, lw, 1, i % 8 === 0 ? "#ff4422" : "#44cc44");
          }
        }
      }
    };

    const drawEnzyme = (ox: number, oy: number, frame: number) => {
      gr(ox + 2, oy + 4, 8, 6, "#ffffff");
      gr(ox + 1, oy + 5, 10, 4, "#ffffff");
      gr(ox + 3, oy, 6, 5, "#ffffff");
      gr(ox + 3, oy - 2, 2, 2, "#ffffff");
      gr(ox + 7, oy - 2, 2, 2, "#ffffff");
      gr(ox + 3, oy - 1, 1, 1, "#ffaaaa");
      gr(ox + 7, oy - 1, 1, 1, "#ffaaaa");
      gr(ox + 4, oy + 1, 2, 1, "#000000");
      gr(ox + 7, oy + 1, 2, 1, "#000000");
      gr(ox + 4, oy + 1, 1, 1, "#00ffcc");
      gr(ox + 6, oy + 2, 1, 1, "#ffaaaa");
      const tailY = frame === 0 ? 1 : 0;
      gr(ox + 11, oy + 5 + tailY, 2, 3, "#ffffff");
      gr(ox + 13, oy + 3 + tailY, 2, 2, "#ffffff");
      gr(ox + 2, oy + 9, 2, 3, "#dddddd");
      gr(ox + 5, oy + 9, 2, 3, "#dddddd");
      gr(ox + 8, oy + 9, 2, 3, "#dddddd");
    };

    const drawAvatar = (ox: number, oy: number, frame: number) => {
      gr(ox + 2, oy + 8, 8, 10, "#e8e8e8");
      gr(ox + 1, oy + 9, 2, 8, "#e8e8e8");
      gr(ox + 9, oy + 9, 2, 8, "#e8e8e8");
      gr(ox + 3, oy + 18, 3, 6, "#1a3a6a");
      gr(ox + 7, oy + 18, 3, 6, "#1a3a6a");
      gr(ox + 2, oy + 23, 4, 2, "#222222");
      gr(ox + 7, oy + 23, 4, 2, "#222222");
      gr(ox + 2, oy + 1, 8, 7, "#c68642");
      gr(ox + 2, oy, 8, 3, "#2a1a0a");
      gr(ox + 3, oy + 3, 2, 1, "#000000");
      gr(ox + 7, oy + 3, 2, 1, "#000000");
      gr(ox + 9, oy + 8, 3, 8, "#225522");
      gr(ox + 9, oy + 10, 3, 1, "#338833");
      if (frame === 1) {
        gr(ox + 3, oy + 21, 3, 3, "#1a3a6a");
        gr(ox + 7, oy + 18, 3, 5, "#1a3a6a");
      }
    };

    const drawStar = (x: number, y: number, bright: boolean) => {
      gr(x, y, 1, 1, bright ? "#ffffff" : "#554477");
    };

    let rafId: number;
    const walk = { x: 5, enzX: 20 };

    const animate = () => {
      const t = (tRef.current += 0.03);
      const frame = Math.floor(t * 2) % 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#030008";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const starPositions = [[12,8],[45,15],[78,5],[110,20],[148,3],[180,12],[200,25],[230,8],[265,18]];
      starPositions.forEach(([sx, sy]) => drawStar(sx, sy, Math.sin(t + sx * 0.1) > 0.3));

      ctx.fillStyle = "#020609";
      ctx.fillRect(0, 0, 120 * S, 100 * S);
      drawDNA(5, 10, t, "#1166bb", "#11aa66");
      drawDNA(25, 5, t * 0.8 + 1, "#ff4422", "#4488ff");
      ctx.fillStyle = "#00ffcc22";
      ctx.fillRect(0, 0, 120 * S, 100 * S);

      ctx.fillStyle = "#020602";
      ctx.fillRect(120 * S, 0, 100 * S, 100 * S);
      drawDNA(130, 5, t * 1.2 + 2, "#44cc44", "#ffcc00");

      ctx.fillStyle = "#030008";
      ctx.fillRect(220 * S, 0, 100 * S, 100 * S);
      [[235,15],[255,8],[275,20],[260,30]].forEach(([nx,ny]) => {
        ctx.fillStyle = Math.sin(t + nx * 0.1) > 0 ? "#aa44ff" : "#550088";
        ctx.fillRect(nx * S, ny * S, 4 * S, 4 * S);
        ctx.fillStyle = "#440066";
        ctx.fillRect((nx+1) * S, (ny+1) * S, 2 * S, 2 * S);
      });

      ctx.fillStyle = "#040210";
      ctx.fillRect(320 * S, 0, 80 * S, 100 * S);
      [[325,0],[345,0],[360,0]].forEach(([px,py]) => {
        ctx.fillStyle = "#1a1530";
        ctx.fillRect((px+2) * S, py * S, 4 * S, 50 * S);
        ctx.fillStyle = "#ffaa00";
        ctx.fillRect((px+2) * S, py * S, 4 * S, S);
      });

      walk.x = 60 + Math.sin(t * 0.3) * 20;
      walk.enzX = walk.x + 14;
      drawAvatar(walk.x, 68, frame);
      drawEnzyme(walk.enzX, 75, frame);

      ctx.fillStyle = "#1a1a2a";
      ctx.fillRect(0, 94 * S, canvas.width, 6 * S);
      ctx.fillStyle = "#2a2a3a";
      ctx.fillRect(0, 93 * S, canvas.width, S);

      rafId = requestAnimationFrame(animate);
    };

    canvas.width = 800;
    canvas.height = 200;
    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ imageRendering: "pixelated", width: "100%", maxWidth: 800, display: "block" } as React.CSSProperties}
    />
  );
}

// ── Menu item with SOUL heart ──────────────────────────────────────────────────
const MENU_ITEMS = [
  { label: "START GAME", action: "start" },
  { label: "WORLDS",     action: "worlds" },
  { label: "CURRICULUM", action: "learn" },
  { label: "ABOUT",      action: "about" },
];

function SoulHeart({ visible }: { visible: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        marginRight: 12,
        color: "#00ffcc",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.05s",
        fontSize: 12,
        lineHeight: "10px",
        verticalAlign: "middle",
        filter: visible ? "drop-shadow(0 0 4px #00ffcc)" : "none",
      }}
    >
      ❤
    </span>
  );
}

// ── World preview cards ────────────────────────────────────────────────────────
const WORLDS = [
  {
    name: "The Cytoplasm",
    color: "#00ffaa",
    bg: "#020609",
    border: "#00ffaa33",
    mentor: "Elliot",
    topics: ["Cell biology", "DNA & RNA", "Proteins", "Organelles", "ATP synthesis"],
    emoji: "🔬",
    desc: "Enter a living cell. Guide ribosomes, repair membranes, and face a rogue lysosome.",
  },
  {
    name: "Genome Forest",
    color: "#52b788",
    bg: "#020602",
    border: "#52b78833",
    mentor: "Ben",
    topics: ["DNA sequencing", "BLAST", "RNA-seq", "CRISPR", "Variant calling"],
    emoji: "🌿",
    desc: "Navigate DNA helix trees, decode corrupted sequences, and fix a retrovirus-infected genome.",
  },
  {
    name: "Neural Nebula",
    color: "#a855f7",
    bg: "#030008",
    border: "#a855f733",
    mentor: "Alex",
    topics: ["Neural networks", "Transformers", "Model evaluation", "Overfitting", "PyTorch"],
    emoji: "🌌",
    desc: "Float through deep space. Train models that actually generalize. Fight OVERFIT.",
  },
  {
    name: "Protein Cathedral",
    color: "#c0a0ff",
    bg: "#040210",
    border: "#c0a0ff33",
    mentor: "Henry",
    topics: ["Protein structure", "AlphaFold", "Drug discovery", "GNNs", "Structural biology"],
    emoji: "🏛️",
    desc: "Explore a gothic cathedral of misfolded proteins. Henry waits at the end.",
  },
];

// ── Main page ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, onboardingComplete, setUser } = useGameStore();
  const [loaded, setLoaded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [view, setView] = useState<"title" | "worlds" | "learn" | "about">("title");

  useEffect(() => {
    setLoaded(true);
    if (isAuthenticated && onboardingComplete) router.push("/realm/1");
    else if (isAuthenticated && !onboardingComplete) router.push("/onboarding/character");
  }, [isAuthenticated, onboardingComplete, router]);

  const handleStart = () => {
    setUser("BitBio Player", "player@bitbio.io");
    router.push("/onboarding/character");
  };

  const handleMenuItem = (action: string) => {
    if (action === "start") { handleStart(); return; }
    setView(action as typeof view);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        color: "#e5e7eb",
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Bio rain background */}
      <BioRain />

      {/* Animated pixel-art border */}
      <div
        className="animate-border-cycle"
        style={{
          position: "fixed",
          inset: 0,
          border: "4px solid var(--realm-1)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* CRT scanline overlay */}
      <div
        className="scanlines"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* ── Title screen view ── */}
      {view === "title" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 0,
          }}
        >
          {/* Hero canvas */}
          <div
            style={{
              border: "2px solid #1a1a2a",
              background: "#030008",
              overflow: "hidden",
              width: "min(800px, 90vw)",
              marginBottom: 32,
            }}
          >
            <HeroCanvas />
          </div>

          {/* BITBIO logo with color-cycling glow */}
          <div
            className="animate-realm-color"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(28px, 6vw, 56px)",
              letterSpacing: "0.12em",
              lineHeight: 1.2,
              marginBottom: 40,
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          >
            BITBIO
          </div>

          {/* Menu items */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignItems: "flex-start",
              minWidth: 260,
            }}
          >
            {MENU_ITEMS.map((item, i) => (
              <button
                key={item.action}
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleMenuItem(item.action)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: hoveredItem === i ? "#ffffff" : "#888888",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 11,
                  cursor: "pointer",
                  padding: "10px 0",
                  display: "flex",
                  alignItems: "center",
                  animation: `menu-item-fade 0.4s ease-out ${i * 0.1}s both`,
                  letterSpacing: "0.05em",
                  transition: "color 0.05s",
                  textShadow: hoveredItem === i ? "0 0 12px #00ffcc88" : "none",
                }}
              >
                <SoulHeart visible={hoveredItem === i} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 40,
              flexWrap: "wrap",
              justifyContent: "center",
              opacity: 0.6,
            }}
          >
            {[["442+","EXERCISES"],["4","REALMS"],["4","MENTORS"],["100%","FREE"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, color: "#00ffcc", marginBottom: 6 }}>{n}</div>
                <div style={{ fontSize: 7, color: "#555" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Version text */}
          <div
            style={{
              position: "fixed",
              bottom: 20,
              right: 24,
              fontSize: 7,
              color: "#333",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.02em",
            }}
          >
            BitBio v1.0 // by Dr. Henry Lacks
          </div>
        </div>
      )}

      {/* ── Worlds view ── */}
      {view === "worlds" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            overflowY: "auto",
            height: "100%",
            padding: "40px 24px",
          }}
        >
          <button
            onClick={() => setView("title")}
            style={{ background: "none", border: "none", color: "#00ffcc", fontFamily: "'Press Start 2P', monospace", fontSize: 9, cursor: "pointer", marginBottom: 32 }}
          >
            ← BACK
          </button>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 14, color: "#00ffcc", marginBottom: 12 }}>4 WORLDS</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto" }}>
            {WORLDS.map((w) => (
              <div key={w.name} style={{ background: w.bg, border: `2px solid ${w.border}`, padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle at top right, ${w.color}22, transparent)` }} />
                <div style={{ fontSize: 28, marginBottom: 10 }}>{w.emoji}</div>
                <div style={{ fontSize: 9, color: w.color, marginBottom: 10, lineHeight: 1.6 }}>{w.name}</div>
                <div style={{ fontSize: 9, color: "#555", marginBottom: 14, lineHeight: 1.8, fontFamily: "'Courier New', monospace" }}>{w.desc}</div>
                <div style={{ fontSize: 8, color: "#555", marginBottom: 6 }}>MENTOR: <span style={{ color: w.color }}>{w.mentor}</span></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {w.topics.map((topic) => (
                    <span key={topic} style={{ background: "#ffffff08", border: `1px solid ${w.color}22`, color: w.color, fontSize: 7, padding: "2px 6px" }}>{topic}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Curriculum view ── */}
      {view === "learn" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            overflowY: "auto",
            height: "100%",
            padding: "40px 24px",
            maxWidth: 900,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <button
            onClick={() => setView("title")}
            style={{ background: "none", border: "none", color: "#00ffcc", fontFamily: "'Press Start 2P', monospace", fontSize: 9, cursor: "pointer", marginBottom: 32 }}
          >
            ← BACK
          </button>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: "#52b788" }}>WHAT YOU&apos;LL LEARN</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ color: "#00ffcc", fontSize: 9, marginBottom: 14 }}>BIOLOGY</div>
              {["Cell biology & organelles","DNA replication & transcription","Protein synthesis & folding","Membrane dynamics","Enzyme kinetics","CRISPR-Cas9"].map(t => (
                <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ color: "#00ffcc", fontSize: 10 }}>▸</span>
                  <span style={{ color: "#888", fontSize: 9, fontFamily: "'Courier New', monospace" }}>{t}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: "#a855f7", fontSize: 9, marginBottom: 14 }}>COMPUTATION</div>
              {["Python & bioinformatics tools","Sequence alignment & BLAST","Machine learning fundamentals","Neural networks & transformers","AlphaFold & structure prediction","Drug discovery pipelines"].map(t => (
                <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ color: "#a855f7", fontSize: 10 }}>▸</span>
                  <span style={{ color: "#888", fontSize: 9, fontFamily: "'Courier New', monospace" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── About view ── */}
      {view === "about" && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "40px 24px",
          }}
        >
          <button
            onClick={() => setView("title")}
            style={{ background: "none", border: "none", color: "#00ffcc", fontFamily: "'Press Start 2P', monospace", fontSize: 9, cursor: "pointer", marginBottom: 40 }}
          >
            ← BACK
          </button>
          <div style={{ fontSize: 12, color: "#00ffcc", marginBottom: 28 }}>MADE BY</div>
          <div style={{ background: "#050d10", border: "2px solid #00ffcc33", padding: 40, maxWidth: 560, textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#fff", marginBottom: 14 }}>Aaryan Senthilvanan</div>
            <div style={{ color: "#666", fontSize: 9, lineHeight: 2, marginBottom: 20, fontFamily: "'Courier New', monospace" }}>
              A game about learning biology and ML the way games should be — through exploration,
              storytelling, and pixel art that slaps. Built entirely from scratch with Next.js and canvas.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {["Next.js 16","Canvas API","TypeScript","Zustand","Tailwind CSS"].map(t => (
                <span key={t} style={{ background: "#00ffcc11", border: "1px solid #00ffcc22", color: "#00ffcc", fontSize: 7, padding: "3px 8px" }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24, fontSize: 7, color: "#333", fontFamily: "'Courier New', monospace" }}>
            BitBio v1.0 // by Dr. Henry Lacks
          </div>
        </div>
      )}
    </div>
  );
}
