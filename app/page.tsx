"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";

// ── Pixel art canvas hero ──────────────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const S = 2; // 2px per game pixel

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
      // White cat body
      gr(ox + 2, oy + 4, 8, 6, "#ffffff");
      gr(ox + 1, oy + 5, 10, 4, "#ffffff");
      // Head
      gr(ox + 3, oy, 6, 5, "#ffffff");
      // Ears
      gr(ox + 3, oy - 2, 2, 2, "#ffffff");
      gr(ox + 7, oy - 2, 2, 2, "#ffffff");
      gr(ox + 3, oy - 1, 1, 1, "#ffaaaa");
      gr(ox + 7, oy - 1, 1, 1, "#ffaaaa");
      // Eyes
      gr(ox + 4, oy + 1, 2, 1, "#000000");
      gr(ox + 7, oy + 1, 2, 1, "#000000");
      gr(ox + 4, oy + 1, 1, 1, "#00ffcc"); // shine
      // Nose
      gr(ox + 6, oy + 2, 1, 1, "#ffaaaa");
      // Tail (animated)
      const tailY = frame === 0 ? 1 : 0;
      gr(ox + 11, oy + 5 + tailY, 2, 3, "#ffffff");
      gr(ox + 13, oy + 3 + tailY, 2, 2, "#ffffff");
      // Legs
      gr(ox + 2, oy + 9, 2, 3, "#dddddd");
      gr(ox + 5, oy + 9, 2, 3, "#dddddd");
      gr(ox + 8, oy + 9, 2, 3, "#dddddd");
    };

    const drawAvatar = (ox: number, oy: number, frame: number) => {
      // Lab coat body
      gr(ox + 2, oy + 8, 8, 10, "#e8e8e8");
      gr(ox + 1, oy + 9, 2, 8, "#e8e8e8");
      gr(ox + 9, oy + 9, 2, 8, "#e8e8e8");
      // Pants
      gr(ox + 3, oy + 18, 3, 6, "#1a3a6a");
      gr(ox + 7, oy + 18, 3, 6, "#1a3a6a");
      // Shoes
      gr(ox + 2, oy + 23, 4, 2, "#222222");
      gr(ox + 7, oy + 23, 4, 2, "#222222");
      // Head
      gr(ox + 2, oy + 1, 8, 7, "#c68642");
      // Hair
      gr(ox + 2, oy, 8, 3, "#2a1a0a");
      // Eyes
      gr(ox + 3, oy + 3, 2, 1, "#000000");
      gr(ox + 7, oy + 3, 2, 1, "#000000");
      // Backpack
      gr(ox + 9, oy + 8, 3, 8, "#225522");
      gr(ox + 9, oy + 10, 3, 1, "#338833");
      // Walk animation
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

      // Sky gradient
      ctx.fillStyle = "#030008";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      const starPositions = [[12,8],[45,15],[78,5],[110,20],[148,3],[180,12],[200,25],[230,8],[265,18]];
      starPositions.forEach(([sx, sy]) => drawStar(sx, sy, Math.sin(t + sx * 0.1) > 0.3));

      // World 1 zone (left) — cyan cell
      ctx.fillStyle = "#020609";
      ctx.fillRect(0, 0, 120 * S, 100 * S);
      drawDNA(5, 10, t, "#1166bb", "#11aa66");
      drawDNA(25, 5, t * 0.8 + 1, "#ff4422", "#4488ff");
      ctx.fillStyle = "#00ffcc22";
      ctx.fillRect(0, 0, 120 * S, 100 * S);

      // World 2 zone (center-left) — dark green
      ctx.fillStyle = "#020602";
      ctx.fillRect(120 * S, 0, 100 * S, 100 * S);
      drawDNA(130, 5, t * 1.2 + 2, "#44cc44", "#ffcc00");

      // World 3 zone (center-right) — nebula
      ctx.fillStyle = "#030008";
      ctx.fillRect(220 * S, 0, 100 * S, 100 * S);
      // Neural nodes
      [[235,15],[255,8],[275,20],[260,30]].forEach(([nx,ny]) => {
        ctx.fillStyle = Math.sin(t + nx * 0.1) > 0 ? "#aa44ff" : "#550088";
        ctx.fillRect(nx * S, ny * S, 4 * S, 4 * S);
        ctx.fillStyle = "#440066";
        ctx.fillRect((nx+1) * S, (ny+1) * S, 2 * S, 2 * S);
      });

      // World 4 zone (right) — cathedral
      ctx.fillStyle = "#040210";
      ctx.fillRect(320 * S, 0, 80 * S, 100 * S);
      // Cathedral pillars
      [[325,0],[345,0],[360,0]].forEach(([px,py]) => {
        ctx.fillStyle = "#1a1530";
        ctx.fillRect((px+2) * S, py * S, 4 * S, 50 * S);
        ctx.fillStyle = "#ffaa00";
        ctx.fillRect((px+2) * S, py * S, 4 * S, S);
      });

      // Walking avatar
      walk.x = 60 + Math.sin(t * 0.3) * 20;
      walk.enzX = walk.x + 14;
      drawAvatar(walk.x, 68, frame);
      drawEnzyme(walk.enzX, 75, frame);

      // Ground line
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

// ── World preview cards ────────────────────────────────────────────────────
const WORLDS = [
  {
    name: "The Cytoplasm",
    color: "#00ffcc",
    bg: "#020609",
    border: "#00ffcc33",
    mentor: "Elliot",
    topics: ["Cell biology", "DNA & RNA", "Proteins", "Organelles", "ATP synthesis"],
    emoji: "🔬",
    desc: "Enter a living cell. Guide ribosomes, repair membranes, and face a rogue lysosome.",
  },
  {
    name: "Genome Forest",
    color: "#00ff44",
    bg: "#020602",
    border: "#00ff4433",
    mentor: "Ben",
    topics: ["DNA sequencing", "BLAST", "RNA-seq", "CRISPR", "Variant calling"],
    emoji: "🌿",
    desc: "Navigate DNA helix trees, decode corrupted sequences, and fix a retrovirus-infected genome.",
  },
  {
    name: "Neural Nebula",
    color: "#aa44ff",
    bg: "#030008",
    border: "#aa44ff33",
    mentor: "Alex",
    topics: ["Neural networks", "Transformers", "Model evaluation", "Overfitting", "PyTorch"],
    emoji: "🌌",
    desc: "Float through deep space. Train models that actually generalize. Fight OVERFIT — 100% training accuracy, 0% knowledge.",
  },
  {
    name: "Protein Cathedral",
    color: "#ffaa00",
    bg: "#040210",
    border: "#ffaa0033",
    mentor: "Henry",
    topics: ["Protein structure", "AlphaFold", "Drug discovery", "GNNs", "Structural biology"],
    emoji: "🏛️",
    desc: "Explore a gothic cathedral of misfolded proteins. Henry waits at the end with secrets about immortality.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, onboardingComplete, setUser } = useGameStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    if (isAuthenticated && onboardingComplete) router.push("/realm/1");
    else if (isAuthenticated && !onboardingComplete) router.push("/onboarding/character");
  }, [isAuthenticated, onboardingComplete, router]);

  const handleStart = () => {
    setUser("BitBio Player", "player@bitbio.io");
    router.push("/onboarding/character");
  };

  return (
    <div style={{ background: "#030008", minHeight: "100vh", color: "#e5e7eb", fontFamily: "Space Mono, monospace" }}>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #1a1a2a", background: "#030008ee", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(8px)" }}>
        <span style={{ fontFamily: "Press Start 2P, monospace", fontSize: 16, color: "#00ffcc" }}>
          BIT<span style={{ color: "#00ff88" }}>BIO</span>
        </span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#worlds" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>Worlds</a>
          <a href="#learn" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>Curriculum</a>
          <a href="#about" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>About</a>
          <button onClick={handleStart} style={{ background: "transparent", border: "1px solid #00ffcc", color: "#00ffcc", padding: "8px 20px", fontFamily: "Press Start 2P, monospace", fontSize: 9, cursor: "pointer" }}>
            PLAY →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px 0" }}>
        {/* Canvas */}
        <div style={{ border: "2px solid #1a1a2a", marginBottom: 48, background: "#030008", overflow: "hidden" }}>
          <HeroCanvas />
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 48, letterSpacing: "0.1em", lineHeight: 1.2, marginBottom: 24 }}>
            <span style={{ color: "#00ffcc", textShadow: "0 0 40px #00ffcc66" }}>BIT</span>
            <span style={{ color: "#00ff88" }}>BIO</span>
          </div>
          <p style={{ fontSize: 18, color: "#aaa", marginBottom: 8, lineHeight: 1.6 }}>
            Learn computational biology and machine learning
          </p>
          <p style={{ fontSize: 18, color: "#666", marginBottom: 48 }}>
            through a pixel art RPG adventure. Completely free. Forever.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={handleStart} style={{ background: "#00ffcc", color: "#000", border: "none", padding: "18px 48px", fontFamily: "Press Start 2P, monospace", fontSize: 12, cursor: "pointer", boxShadow: "0 0 40px #00ffcc44" }}>
              START GAME →
            </button>
            <button style={{ background: "transparent", color: "#888", border: "1px solid #333", padding: "18px 32px", fontFamily: "Press Start 2P, monospace", fontSize: 9, cursor: "not-allowed", opacity: 0.6 }}>
              G  LOG IN WITH GOOGLE
              <span style={{ display: "block", fontSize: 7, marginTop: 6, color: "#555" }}>coming soon</span>
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[["442+", "EXERCISES"], ["4", "REALMS"], ["4", "MENTORS"], ["100%", "FREE"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 28, color: "#00ffcc" }}>{n}</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLDS */}
      <section id="worlds" style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 14, color: "#00ffcc", marginBottom: 16 }}>
            4 WORLDS TO EXPLORE
          </div>
          <p style={{ color: "#666", fontSize: 14 }}>Each world = one domain. Each world has a mentor, enemies, a boss, and dozens of lessons.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {WORLDS.map((w) => (
            <div key={w.name} style={{ background: w.bg, border: `2px solid ${w.border}`, padding: 24, position: "relative", overflow: "hidden" }}>
              {/* Glow */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle at top right, ${w.color}22, transparent)` }} />

              <div style={{ fontSize: 32, marginBottom: 12 }}>{w.emoji}</div>
              <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 10, color: w.color, marginBottom: 12, lineHeight: 1.6 }}>
                {w.name}
              </div>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 16, lineHeight: 1.7 }}>
                {w.desc}
              </div>

              <div style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>MENTOR: <span style={{ color: w.color }}>{w.mentor}</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {w.topics.map((topic) => (
                  <span key={topic} style={{ background: "#ffffff08", border: `1px solid ${w.color}22`, color: w.color, fontSize: 9, padding: "3px 8px" }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="learn" style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 14, color: "#00ff44", marginBottom: 16 }}>
            WHAT YOU&apos;LL LEARN
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ color: "#00ffcc", fontSize: 11, marginBottom: 16, fontFamily: "Press Start 2P, monospace" }}>BIOLOGY</div>
            {["Cell biology & organelles", "DNA replication & transcription", "Protein synthesis & folding", "Membrane dynamics", "Enzyme kinetics", "CRISPR-Cas9"].map(t => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: "#00ffcc", fontSize: 10 }}>▸</span>
                <span style={{ color: "#888", fontSize: 12 }}>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "#aa44ff", fontSize: 11, marginBottom: 16, fontFamily: "Press Start 2P, monospace" }}>COMPUTATION</div>
            {["Python & bioinformatics tools", "Sequence alignment & BLAST", "Machine learning fundamentals", "Neural networks & transformers", "AlphaFold & structure prediction", "Drug discovery pipelines"].map(t => (
              <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: "#aa44ff", fontSize: 10 }}>▸</span>
                <span style={{ color: "#888", fontSize: 12 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The journey */}
        <div style={{ marginTop: 48, padding: 32, background: "#08050f", border: "1px solid #1a1a2a" }}>
          <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 10, color: "#555", marginBottom: 20 }}>YOUR JOURNEY</div>
          <div style={{ display: "flex", gap: 0, alignItems: "center", flexWrap: "wrap" }}>
            {["Cell Interior", "→", "Genome Forest", "→", "Neural Nebula", "→", "Protein Cathedral"].map((step, i) => (
              <div key={i} style={{ color: i % 2 === 0 ? (["#00ffcc","#00ff44","#aa44ff","#ffaa00"][Math.floor(i/2)] ?? "#fff") : "#333", fontFamily: i % 2 === 0 ? "Press Start 2P, monospace" : "inherit", fontSize: i % 2 === 0 ? 9 : 20, padding: "4px 12px", whiteSpace: "nowrap" }}>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 14, color: "#ffaa00", marginBottom: 16 }}>
            HOW IT WORKS
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {[
            { icon: "🎮", title: "EXPLORE", desc: "Free-roam pixel art worlds. Talk to mentors. Find secrets." },
            { icon: "📚", title: "LEARN", desc: "Mentors teach you the content before every lesson with analogies and code." },
            { icon: "⚔️", title: "BATTLE", desc: "Answer questions to defeat bosses. Wrong answers = damage." },
            { icon: "⬆️", title: "PROGRESS", desc: "Earn XP, unlock realms, customize your character." },
          ].map(step => (
            <div key={step.title} style={{ background: "#080510", border: "1px solid #1a1a2a", padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{step.icon}</div>
              <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 9, color: "#ffaa00", marginBottom: 12 }}>{step.title}</div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ maxWidth: 700, margin: "0 auto", padding: "96px 24px 0", textAlign: "center" }}>
        <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 14, color: "#00ffcc", marginBottom: 32 }}>
          MADE BY
        </div>
        <div style={{ background: "#050d10", border: "2px solid #00ffcc22", padding: 48 }}>
          <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 18, color: "#fff", marginBottom: 16 }}>
            Aaryan Senthilvanan
          </div>
          <div style={{ color: "#666", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
            A game about learning biology and ML the way games should be — through exploration,
            storytelling, and pixel art that slaps. Built entirely from scratch with Next.js and canvas.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {["Next.js 16", "Canvas API", "TypeScript", "Zustand", "Tailwind CSS"].map(t => (
              <span key={t} style={{ background: "#00ffcc11", border: "1px solid #00ffcc22", color: "#00ffcc", fontSize: 10, padding: "4px 12px" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ textAlign: "center", padding: "96px 24px 48px" }}>
        <div style={{ fontFamily: "Press Start 2P, monospace", fontSize: 20, color: "#fff", marginBottom: 16 }}>
          Ready to start?
        </div>
        <div style={{ color: "#555", fontSize: 14, marginBottom: 32 }}>It's free. No account required to play.</div>
        <button onClick={handleStart} style={{ background: "#00ffcc", color: "#000", border: "none", padding: "20px 64px", fontFamily: "Press Start 2P, monospace", fontSize: 14, cursor: "pointer", boxShadow: "0 0 60px #00ffcc44" }}>
          ENTER BITBIO →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #111", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "Press Start 2P, monospace", fontSize: 10, color: "#333" }}>BITBIO © 2026</span>
        <span style={{ fontSize: 12, color: "#333" }}>by Aaryan Senthilvanan · free & open source · all 4 realms · forever</span>
      </footer>
    </div>
  );
}
