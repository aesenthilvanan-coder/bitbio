'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';

// ─── Seeded RNG (stable across SSR/CSR, no hydration mismatch) ───────────────
function mkRng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
}
const rng = mkRng(0xdeadbeef);

// ─── Pre-generated scene data (deterministic) ─────────────────────────────────
const STARS = Array.from({ length: 240 }, () => ({
  x: rng(), y: rng() * 0.54,
  r: rng() > 0.85 ? 2 : 1,
  phase: rng() * Math.PI * 2,
  speed: 0.3 + rng() * 1.6,
}));

const FLOWERS = Array.from({ length: 50 }, (_, i) => ({
  xr: 0.02 + rng() * 0.96,
  yr: 0.73 + rng() * 0.17,
  size: 2 + Math.floor(rng() * 3),
  color: ['#ff5599', '#00ffcc', '#bb55ff', '#55ffaa', '#ffcc22'][i % 5],
  phase: rng() * Math.PI * 2,
  speed: 0.35 + rng() * 0.8,
  glow: rng() > 0.45,
}));

const FAR_TREES  = Array.from({ length: 30 }, (_, i) => ({ xr: (i + rng()*0.7-0.35)/29, h: 28 + rng()*22 }));
const MID_TREES  = Array.from({ length: 22 }, (_, i) => ({ xr: (i + rng()*0.7-0.35)/21, h: 44 + rng()*32, glow: rng()>0.55 }));
const NEAR_TREES = Array.from({ length: 15 }, (_, i) => ({ xr: (i + rng()*0.7-0.35)/14, h: 58 + rng()*42 }));

const mkPeaks = (n: number, lo: number, hi: number) =>
  Array.from({ length: n }, () => lo + rng() * (hi - lo));
const M_FAR  = mkPeaks(32, 0.07, 0.22);
const M_MID  = mkPeaks(26, 0.055, 0.17);
const M_NEAR = mkPeaks(22, 0.04, 0.13);

// ─── Canvas drawing primitives ────────────────────────────────────────────────
const ip = Math.round;

function drawMountains(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  peaks: number[], baseFrac: number, col: string,
) {
  const baseY = H * baseFrac;
  const step   = W / (peaks.length - 1);
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, baseY - peaks[0] * H);
  for (let i = 0; i < peaks.length - 1; i++) {
    const x0 = i * step, x1 = (i + 1) * step;
    const y0 = baseY - peaks[i] * H, y1 = baseY - peaks[i + 1] * H;
    ctx.quadraticCurveTo(x0 + step * 0.5, Math.min(y0, y1) - H * 0.008, x1, y1);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
}

function drawDNATree(
  ctx: CanvasRenderingContext2D, cx: number, baseY: number,
  h: number, col: string, glowCol?: string,
) {
  if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 7; }
  const cx_ = ip(cx), topY = ip(baseY - h);
  ctx.fillStyle = col;
  // trunk
  ctx.fillRect(cx_ - 1, topY, 2, ip(h * 0.72));
  // double-helix rungs
  const rungs = ip(h / 10);
  for (let r = 0; r < rungs; r++) {
    const ry = ip(baseY - (r + 0.5) * 10);
    const sp = ip(5 - (r / rungs) * 3);
    if (ry > topY + 6 && ry < ip(baseY)) {
      ctx.fillRect(cx_ - sp - 1, ry, sp, 1);
      ctx.fillRect(cx_ + 1,      ry, sp, 1);
    }
  }
  // crown
  ctx.fillRect(cx_ - 6, topY - 1, 12, 4);
  ctx.fillRect(cx_ - 4, topY - 3, 8,  2);
  ctx.fillRect(cx_ - 2, topY - 5, 4,  2);
  ctx.shadowBlur = 0;
}

function drawFlower(
  ctx: CanvasRenderingContext2D, x: number, y: number,
  sz: number, col: string, glow: boolean,
) {
  if (glow) { ctx.shadowColor = col; ctx.shadowBlur = sz * 3.5; }
  const s = ip(sz), x_ = ip(x), y_ = ip(y);
  ctx.fillStyle = col;
  ctx.fillRect(x_ - ip(s/2), y_ - s*2, s, s); // up
  ctx.fillRect(x_ - ip(s/2), y_,       s, s); // down
  ctx.fillRect(x_ - s*2,     y_ - s,   s, s); // left
  ctx.fillRect(x_,           y_ - s,   s, s); // right
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x_ - ip(s/2), y_ - s, s, s);   // center
  ctx.shadowBlur = 0;
}

function drawEnzyme(ctx: CanvasRenderingContext2D, cx: number, by: number, frame: number) {
  const S = 2.4;
  const f = ip(frame / 10) % 4;
  const cx_ = ip(cx), by_ = ip(by);
  ctx.shadowColor = 'rgba(255,255,255,0.3)';
  ctx.shadowBlur = 5;
  // body
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(cx_ - ip(5*S), by_ - ip(10*S), ip(10*S), ip(8*S));
  // head
  ctx.fillRect(cx_ - ip(4*S), by_ - ip(16*S), ip(8*S), ip(7*S));
  // ears
  ctx.fillRect(cx_ - ip(5*S), by_ - ip(19*S), ip(3*S), ip(3*S));
  ctx.fillRect(cx_ + ip(2*S), by_ - ip(19*S), ip(3*S), ip(3*S));
  ctx.fillStyle = '#ffb6c1';
  ctx.fillRect(cx_ - ip(4*S), by_ - ip(18*S), ip(2*S), ip(2*S));
  ctx.fillRect(cx_ + ip(2*S), by_ - ip(18*S), ip(2*S), ip(2*S));
  // eyes
  const blink = frame % 90 > 84;
  ctx.fillStyle = blink ? '#f0f0f0' : '#111111';
  ctx.fillRect(cx_ - ip(2*S), by_ - ip(13*S), ip(S), blink ? 0 : ip(S));
  ctx.fillRect(cx_ + ip(S),   by_ - ip(13*S), ip(S), blink ? 0 : ip(S));
  if (!blink) { ctx.fillStyle = '#00bbaa'; ctx.fillRect(cx_ - ip(2*S), by_ - ip(13*S), ip(S/2), ip(S/2)); }
  // nose
  ctx.fillStyle = '#ffb6c1';
  ctx.fillRect(cx_ - ip(S/2), by_ - ip(11.5*S), ip(S), ip(S/2));
  // whiskers
  ctx.fillStyle = '#c8c8c8';
  ctx.fillRect(cx_ - ip(6.5*S), by_ - ip(12*S), ip(4*S), 1);
  ctx.fillRect(cx_ + ip(2.5*S), by_ - ip(12*S), ip(4*S), 1);
  // tail
  const tWag = ip(Math.sin(frame * 0.1) * 3 * S);
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(cx_ + ip(4*S) + tWag, by_ - ip(7*S), ip(4*S), ip(S));
  ctx.fillRect(cx_ + ip(7*S) + tWag, by_ - ip(9*S), ip(S),   ip(3*S));
  // legs
  const l1 = f < 2 ? ip(S) : 0;
  const l2 = f < 2 ? 0 : ip(S);
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(cx_ - ip(3*S), by_ - ip(2*S) + l1, ip(2*S), ip(4*S));
  ctx.fillRect(cx_ + ip(S),   by_ - ip(2*S) + l2, ip(2*S), ip(4*S));
  ctx.fillStyle = '#d0d0d0';
  ctx.fillRect(cx_ - ip(4*S), by_ - ip(2*S) + l2, ip(2*S), ip(3*S));
  ctx.fillRect(cx_ + ip(2*S), by_ - ip(2*S) + l1, ip(2*S), ip(3*S));
  // paws
  ctx.fillStyle = '#ffb6c1';
  ctx.fillRect(cx_ - ip(3*S), by_ + ip(2*S) + l1, ip(2*S), ip(S));
  ctx.fillRect(cx_ + ip(S),   by_ + ip(2*S) + l2, ip(2*S), ip(S));
  ctx.shadowBlur = 0;
}

function renderScene(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, frame: number) {
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;

  // 1. Sky gradient
  const sg = ctx.createLinearGradient(0, 0, 0, H * 0.76);
  sg.addColorStop(0,    '#010810');
  sg.addColorStop(0.28, '#021220');
  sg.addColorStop(0.60, '#061c34');
  sg.addColorStop(1,    '#0c2a48');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);

  // Horizon glow
  const hg = ctx.createRadialGradient(W*.5, H*.58, 0, W*.5, H*.58, W*.42);
  hg.addColorStop(0, 'rgba(0,200,110,0.06)');
  hg.addColorStop(.6, 'rgba(0,80,60,0.025)');
  hg.addColorStop(1, 'transparent');
  ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);

  // 2. Stars
  for (const s of STARS) {
    const a = 0.42 + 0.58 * Math.sin(t * s.speed + s.phase);
    ctx.fillStyle = `rgba(210,228,255,${a.toFixed(2)})`;
    ctx.fillRect(ip(s.x * W), ip(s.y * H), s.r, s.r);
  }

  // 3. Aurora bands
  const aColors = ['rgba(0,255,150,.044)','rgba(100,20,220,.040)','rgba(0,190,220,.036)'];
  for (let i = 0; i < 3; i++) {
    const drift = Math.sin(t * 0.17 + i * 2.0) * 16;
    const ay = H * 0.11 + i * 22 + drift;
    const ag = ctx.createLinearGradient(0, ay, 0, ay + 20);
    ag.addColorStop(0, 'transparent');
    ag.addColorStop(.5, aColors[i]);
    ag.addColorStop(1, 'transparent');
    ctx.fillStyle = ag; ctx.fillRect(0, ip(ay), W, 20);
  }

  // 4. Three mountain ranges (gothic protein-spire silhouettes)
  drawMountains(ctx, W, H, M_FAR,  0.54, '#0a1620');
  drawMountains(ctx, W, H, M_MID,  0.57, '#0e1e2c');
  drawMountains(ctx, W, H, M_NEAR, 0.60, '#122438');

  // 5. Far DNA tree layer
  const farBase = H * 0.64;
  for (const tr of FAR_TREES) drawDNATree(ctx, tr.xr*W, farBase, tr.h*.52, '#08160a');

  // Mid-ground rolling hill fill
  const mg = ctx.createLinearGradient(0, H*.60, 0, H*.78);
  mg.addColorStop(0, '#0d280a'); mg.addColorStop(1, '#091c06');
  ctx.fillStyle = mg;
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, H*.71);
  for (let xi = 0; xi <= 28; xi++) {
    const xf = xi/28;
    ctx.lineTo(xf*W, H*(0.67 + Math.sin(xf*Math.PI*5+.6)*.038));
  }
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

  // 6. Mid DNA tree layer
  const midBase = H * 0.72;
  for (const tr of MID_TREES)
    drawDNATree(ctx, tr.xr*W, midBase, tr.h*.68, '#142c10', tr.glow ? '#00ff8826' : undefined);

  // Near hill fill
  const ng = ctx.createLinearGradient(0, H*.73, 0, H);
  ng.addColorStop(0, '#1a3c12'); ng.addColorStop(.5,'#122c0c'); ng.addColorStop(1,'#0c1e08');
  ctx.fillStyle = ng;
  ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(0, H*.77);
  for (let xi = 0; xi <= 34; xi++) {
    const xf = xi/34;
    ctx.lineTo(xf*W, H*(0.74 + Math.sin(xf*Math.PI*7+1.3)*.022));
  }
  ctx.lineTo(W,H); ctx.closePath(); ctx.fill();

  // 7. Near DNA tree layer
  const nearBase = H * 0.80;
  for (const tr of NEAR_TREES) drawDNATree(ctx, tr.xr*W, nearBase, tr.h*.84, '#1e4418', '#00ff4422');

  // 8. Foreground grass base
  const fg = ctx.createLinearGradient(0, H*.83, 0, H);
  fg.addColorStop(0,'#0e2408'); fg.addColorStop(.55,'#091a06'); fg.addColorStop(1,'#030802');
  ctx.fillStyle = fg; ctx.fillRect(0, ip(H*.85), W, H);

  // Grass blades
  ctx.fillStyle = '#1a4010';
  for (let gx = 0; gx < W; gx += 5) {
    const bh = 3 + Math.sin(gx*.32 + t*.5)*3;
    const gy = H*.855 + Math.sin(gx*.08)*2;
    ctx.fillRect(ip(gx), ip(gy-bh), 1, ip(bh));
    if (gx%15===0) ctx.fillRect(ip(gx+2), ip(gy-bh*.6), 1, ip(bh*.6));
  }

  // 9. Bioluminescent flowers
  for (const fl of FLOWERS) {
    const fy = fl.yr*H + Math.sin(t*fl.speed + fl.phase)*1.8;
    if (fy > H*.77 && fy < H*.91)
      drawFlower(ctx, fl.xr*W, fy, fl.size, fl.color, fl.glow);
  }

  // 10. Enzyme cat walking across left side
  const catPeriod = 420;
  const catXFrac = (frame % catPeriod) / catPeriod;
  drawEnzyme(ctx, W*.06 + catXFrac*W*.28, H*.857, frame);

  // 11. Dark foreground silhouette
  const ds = ctx.createLinearGradient(0, H*.90, 0, H);
  ds.addColorStop(0,'transparent'); ds.addColorStop(.35,'rgba(3,8,2,.85)'); ds.addColorStop(1,'#020602');
  ctx.fillStyle = ds; ctx.fillRect(0, ip(H*.90), W, H);

  // Dense silhouette grass
  ctx.fillStyle = '#050c03';
  for (let gx = 0; gx < W; gx += 3) {
    const bh = 5 + Math.sin(gx*.23+t*.28)*5;
    ctx.fillRect(ip(gx), ip(H*.93-bh), 1, ip(bh));
  }
}

// ─── Biology Scene Canvas ─────────────────────────────────────────────────────
function BiologySceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let startTs = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = (ts - startTs) / 1000;
      frameRef.current++;
      const { width: W, height: H } = canvas;
      if (W > 0 && H > 0) renderScene(ctx, W, H, t, frameRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function LandingNav({ onStart, isReturning }: { onStart: () => void; isReturning: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(1,8,16,0.97)' : 'rgba(1,8,16,0.88)',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(0,255,150,0.12)' : '1px solid transparent',
        height: 60,
      }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span
            className="font-pixel"
            style={{ fontSize: 14, color: '#39ff14', textShadow: '0 0 12px #39ff1466', letterSpacing: '0.06em' }}
          >
            BIT
          </span>
          <span style={{ fontSize: 14, color: '#00ffcc', fontFamily: "'Press Start 2P', monospace", textShadow: '0 0 12px #00ffcc66' }}>
            BIO
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'Learn',     href: '#realms' },
            { label: 'Realms',    href: '#realms' },
            { label: 'Community', href: '#about'  },
            { label: 'About',     href: '#about'  },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                padding: '8px 14px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: '#8899aa',
                textDecoration: 'none',
                transition: 'color 0.15s',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ccddee')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8899aa')}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStart}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8, color: '#8899aa', padding: '8px 12px',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8899aa')}
          >
            {isReturning ? 'CONTINUE' : 'SIGN IN'}
          </button>
          <button
            onClick={onStart}
            style={{
              background: '#b8e643',
              border: '2px solid #8ab022',
              color: '#0a1a00',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              padding: '10px 20px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'background 0.12s, transform 0.08s',
              imageRendering: 'pixelated',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#cef855'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#b8e643'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isReturning ? 'RESUME →' : 'START FREE →'}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Realm data ───────────────────────────────────────────────────────────────
const REALMS = [
  {
    name: 'The Cytoplasm',      num: 1, color: '#00ffcc',
    accent: '#00ffcc22',        emoji: '🔬',
    mentor: 'Elliot',           mentorQuip: '"Mitochondria is the powerhouse of the cell. I will say it forever."',
    topics: ['Cell biology', 'Organelles', 'ATP synthesis', 'Membrane dynamics', 'Cell cycle'],
    desc: 'Enter a living cell. Navigate organelle rooms, cross lysosome acid pools, and defend against a rogue protease.',
    bg: '#020a0e',
  },
  {
    name: 'The Genome Forest',  num: 2, color: '#52d483',
    accent: '#52d48322',        emoji: '🌿',
    mentor: 'Ben',              mentorQuip: '"DNA double helix? More like a double helix of DELICIOUS information."',
    topics: ['DNA sequencing', 'BLAST', 'RNA-seq', 'CRISPR', 'Population genetics'],
    desc: 'Navigate ancient helix trees, decode corrupted sequences, and cross the RNA River to reach the gene vault.',
    bg: '#020a04',
  },
  {
    name: 'The Neural Nebula',  num: 3, color: '#a855f7',
    accent: '#a855f722',        emoji: '🌌',
    mentor: 'Alex',             mentorQuip: '"*sips fourth coffee* Back-propagation is just coffee flowing in reverse."',
    topics: ['Neural networks', 'Transformers', 'CNNs', 'Overfitting', 'PyTorch'],
    desc: 'Float through deep space platforms. Train models that actually generalize. Face the OVERFIT.',
    bg: '#03000c',
  },
  {
    name: 'Protein Cathedral',  num: 4, color: '#c0a0ff',
    accent: '#c0a0ff22',        emoji: '🏛️',
    mentor: 'Henry',            mentorQuip: '"*flickers* Greetings. I am definitely not a hologram. Achoo!"',
    topics: ['Protein structure', 'AlphaFold', 'Drug discovery', 'GNNs', 'Systems biology'],
    desc: 'Explore a gothic cathedral of misfolded proteins. Henry\'s holographic form waits at the grand altar.',
    bg: '#040210',
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, onboardingComplete, progress } = useGameStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isReturning = isAuthenticated && onboardingComplete;

  const handleStart = () => {
    if (isAuthenticated && onboardingComplete) {
      router.push(`/realm/${progress.currentRealm}`);
    } else {
      router.push('/onboarding/character');
    }
  };

  return (
    <div style={{ background: '#010810', color: '#e5e7eb', fontFamily: "'Press Start 2P', 'Courier New', monospace" }}>
      <LandingNav onStart={handleStart} isReturning={isReturning} />

      {/* ═══════════════════════════ HERO SECTION ════════════════════════════ */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden' }}>
        <BiologySceneCanvas />

        {/* Gradient fade at bottom of hero */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
            background: 'linear-gradient(to bottom, transparent, #010810)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero text overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            paddingTop: 60,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* "START YOUR" label */}
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(8px, 1.4vw, 14px)',
              letterSpacing: '0.35em',
              color: '#7aaa8a',
              marginBottom: 16,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            START YOUR
          </p>

          {/* BIOLOGY ADVENTURE title */}
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(36px, 7.5vw, 88px)',
              lineHeight: 1.18,
              marginBottom: 28,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.7s 0.1s',
            }}
          >
            <span
              style={{
                display: 'block',
                color: '#c8f044',
                textShadow: '4px 4px 0 #2a4a00, 7px 7px 0 #0f1e00',
              }}
            >
              Biology
            </span>
            <span
              style={{
                display: 'block',
                color: '#c8f044',
                textShadow: '4px 4px 0 #2a4a00, 7px 7px 0 #0f1e00',
              }}
            >
              Adventure
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 'clamp(12px, 1.6vw, 16px)',
              color: '#aabbaa',
              marginBottom: 36,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.7s 0.2s',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
              letterSpacing: '0.02em',
            }}
          >
            The most immersive way to learn biology. Ever. ✦
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            style={{
              pointerEvents: 'all',
              background: '#b8e643',
              border: '3px solid #7ab010',
              color: '#0a1800',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(10px, 1.4vw, 13px)',
              padding: 'clamp(14px, 2vw, 20px) clamp(28px, 4vw, 48px)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.7s 0.3s, background 0.12s, transform 0.08s, box-shadow 0.12s',
              boxShadow: '0 4px 0 #4a7000, 0 0 40px #b8e64355',
              imageRendering: 'pixelated',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#cef855';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 0 #4a7000, 0 0 60px #c8f04466';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#b8e643';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 0 #4a7000, 0 0 40px #b8e64355';
            }}
          >
            {isReturning ? 'CONTINUE JOURNEY →' : 'BEGIN JOURNEY →'}
          </button>

          {/* Partner/credit bar */}
          <div
            style={{
              marginTop: 48,
              display: 'flex', alignItems: 'center', gap: 24,
              opacity: mounted ? 0.65 : 0,
              transition: 'opacity 0.8s 0.4s',
            }}
          >
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: '#556655', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              POWERED BY
            </span>
            {['SCIENCE', 'PIXEL ART', 'CURIOSITY'].map((label) => (
              <span
                key={label}
                style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: '#7aaa6a', letterSpacing: '0.08em' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ STATS BAR ════════════════════════════════ */}
      <section
        style={{
          background: '#06100a',
          borderTop: '2px solid #1a3a20',
          borderBottom: '2px solid #1a3a20',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 900, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 40, textAlign: 'center',
          }}
        >
          {[
            { n: '500+', label: 'Interactive exercises' },
            { n: '4',    label: 'Immersive realms' },
            { n: '4',    label: 'NPC mentors' },
            { n: '100%', label: 'Free to play' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#b8e643', fontFamily: "'Press Start 2P', monospace", marginBottom: 12 }}>
                {n}
              </div>
              <div style={{ fontSize: 'clamp(10px, 1.2vw, 14px)', color: '#4a6a50', fontFamily: "'Courier New', monospace", lineHeight: 1.5, letterSpacing: '0.04em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ REALMS SECTION ═════════════════════════════ */}
      <section id="realms" style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: '#010c06' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(8px, 1.1vw, 11px)', color: '#4a8a5a', letterSpacing: '0.3em', marginBottom: 20 }}>
              YOUR ADVENTURE AWAITS
            </p>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(22px, 4vw, 40px)', color: '#c8f044', textShadow: '3px 3px 0 #2a4a00', lineHeight: 1.3 }}>
              Explore Your Four Realms
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {REALMS.map((realm) => (
              <div
                key={realm.name}
                style={{
                  background: realm.bg,
                  border: `2px solid ${realm.color}33`,
                  padding: 28,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = realm.color + '88';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 40px ${realm.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = realm.color + '33';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={handleStart}
              >
                {/* Background corner glow */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 80, height: 80,
                  background: `radial-gradient(circle at top right, ${realm.color}18, transparent)`,
                  pointerEvents: 'none',
                }} />

                <div style={{ fontSize: 36, marginBottom: 14 }}>{realm.emoji}</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: realm.color, marginBottom: 10, lineHeight: 1.6 }}>
                  {realm.name}
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: '#5a7a60', marginBottom: 18, lineHeight: 1.75 }}>
                  {realm.desc}
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: '#3a5a40', marginBottom: 14 }}>
                  MENTOR: <span style={{ color: realm.color }}>{realm.mentor}</span>
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: realm.color + 'aa', marginBottom: 16, lineHeight: 1.6, fontStyle: 'italic' }}>
                  {realm.mentorQuip}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {realm.topics.map((t) => (
                    <span key={t} style={{
                      background: '#ffffff06',
                      border: `1px solid ${realm.color}28`,
                      color: realm.color + 'cc',
                      fontFamily: "'Courier New', monospace",
                      fontSize: 9, padding: '3px 8px',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ HOW IT WORKS ═══════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: '#010810' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(8px, 1.1vw, 11px)', color: '#445566', letterSpacing: '0.3em', marginBottom: 20 }}>
              YOUR JOURNEY
            </p>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(20px, 3.5vw, 38px)', color: '#c8f044', textShadow: '3px 3px 0 #2a4a00', lineHeight: 1.3 }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 36 }}>
            {[
              {
                step: '01', icon: '🎮',
                title: 'Choose Your Avatar',
                desc: 'Design your character. Pick skin tone, hair, outfit. Your avatar walks the realms with Enzyme, your white cat companion.',
                color: '#00ffcc',
              },
              {
                step: '02', icon: '🗺️',
                title: 'Explore the World',
                desc: 'Move through 40×28 tile maps — organelle rooms, DNA forest clearings, neural platform hubs, protein cathedral naves.',
                color: '#52d483',
              },
              {
                step: '03', icon: '📚',
                title: 'Learn Through Quests',
                desc: 'Approach glowing lesson nodes. Answer questions about biology & ML. Earn XP, gems, and lore entries in the Codex.',
                color: '#a855f7',
              },
              {
                step: '04', icon: '⚔️',
                title: 'Defeat the Realm Boss',
                desc: 'Complete all 9 nodes to unlock the boss gate. Defeat LYSO, VIRON, OVERFIT, and the AMYLOID TYRANT.',
                color: '#c0a0ff',
              },
              {
                step: '05', icon: '🔬',
                title: 'Unlock the Research Tree',
                desc: 'Spend earned XP to unlock 24 research nodes — from Cell Theory to Foundation Models. Build your knowledge graph.',
                color: '#ffaa00',
              },
              {
                step: '06', icon: '🏆',
                title: 'Earn Your Certificate',
                desc: 'Defeat all 4 bosses to unlock your completion certificate. 50+ achievements to collect along the way.',
                color: '#ff5599',
              },
            ].map(({ step, icon, title, desc, color }) => (
              <div key={step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 28, lineHeight: 1,
                    color: color, opacity: 0.25,
                    marginBottom: 10,
                  }}>{step}</div>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color, marginBottom: 12, lineHeight: 1.6 }}>
                    {title}
                  </div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: '#4a6a55', lineHeight: 1.75 }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ CAST SECTION ═══════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: '#060e08' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(8px, 1.1vw, 11px)', color: '#3a5a3a', letterSpacing: '0.3em', marginBottom: 20 }}>
            YOUR MENTORS
          </p>
          <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(18px, 3vw, 34px)', color: '#c8f044', textShadow: '3px 3px 0 #2a4a00', lineHeight: 1.3, marginBottom: 48 }}>
            Meet the Cast
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 28 }}>
            {[
              { name: 'Elliot', role: 'Cytoplasm Guide', color: '#00ffcc', emoji: '🔬',
                bio: 'Lab coat. Curly hair. Has opinions about ribosomes. Very strong opinions.' },
              { name: 'Ben',    role: 'Genome Forest Guide', color: '#52d483', emoji: '🌿',
                bio: 'Always eating a sandwich. Sequenced 3 genomes today. Productive morning.' },
              { name: 'Alex',   role: 'Neural Nebula Guide', color: '#a855f7', emoji: '☕',
                bio: 'Four coffees in. Convinced back-prop flows backward like cold espresso.' },
              { name: 'Henry',  role: 'Protein Cathedral Guide', color: '#c0a0ff', emoji: '👻',
                bio: '*flickers* I am definitely not a hologram. Please stop trying to walk through me.' },
              { name: 'Enzyme', role: 'Your Companion', color: '#ffaa44', emoji: '🐱',
                bio: 'White cat. Teal eyes. Follows you everywhere. Has never missed a boss fight.' },
            ].map(({ name, role, color, emoji, bio }) => (
              <div
                key={name}
                style={{
                  background: '#010c04',
                  border: `2px solid ${color}28`,
                  padding: 24,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = color + '66')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = color + '28')}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{emoji}</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color, marginBottom: 8 }}>{name}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: color + '88', marginBottom: 12 }}>{role}</div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: '#3a5a40', lineHeight: 1.7 }}>{bio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FINAL CTA ════════════════════════════════ */}
      <section
        id="about"
        style={{
          padding: 'clamp(80px, 10vw, 120px) 24px',
          background: 'linear-gradient(180deg, #020a06 0%, #010810 100%)',
          textAlign: 'center',
          borderTop: '2px solid #1a3a20',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🐱</div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(22px, 4vw, 44px)',
              color: '#c8f044',
              textShadow: '4px 4px 0 #2a4a00, 7px 7px 0 #0f1e00',
              lineHeight: 1.3,
              marginBottom: 28,
            }}
          >
            Your cells are<br />waiting.
          </h2>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              color: '#4a6a50',
              lineHeight: 1.8, marginBottom: 44,
            }}
          >
            Enzyme has been sitting by the Cytoplasm entrance for three days.
            <br />She&apos;s starting to judge you.
          </p>
          <button
            onClick={handleStart}
            style={{
              background: '#b8e643',
              border: '3px solid #7ab010',
              color: '#0a1800',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(10px, 1.4vw, 14px)',
              padding: 'clamp(16px, 2.5vw, 24px) clamp(32px, 5vw, 64px)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              boxShadow: '0 5px 0 #4a7000, 0 0 60px #b8e64340',
              transition: 'background 0.12s, transform 0.08s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#cef855'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#b8e643'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isReturning ? 'CONTINUE YOUR ADVENTURE →' : 'START FOR FREE →'}
          </button>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ═════════════════════════════════════ */}
      <footer
        style={{
          background: '#010810',
          borderTop: '1px solid #0e2010',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10 }}>
          <span style={{ color: '#39ff14' }}>BIT</span>
          <span style={{ color: '#00ffcc' }}>BIO</span>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: '#2a3a2a', letterSpacing: '0.04em', textAlign: 'center' }}>
          Built entirely with Next.js + Canvas API. No image files — every sprite is drawn from scratch.
          <br />
          Made by <span style={{ color: '#39ff14' }}>Aaryan Senthilvanan</span> · BitBio v1.0
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Next.js 16', color: '#334' },
            { label: 'Canvas API', color: '#334' },
            { label: 'TypeScript', color: '#334' },
            { label: 'Zustand', color: '#334' },
          ].map(({ label }) => (
            <span
              key={label}
              style={{
                background: '#0a1408',
                border: '1px solid #1a2818',
                color: '#2a4a2a',
                fontFamily: "'Courier New', monospace",
                fontSize: 9, padding: '3px 8px',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
