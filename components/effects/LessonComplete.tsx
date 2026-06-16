"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  stars: 1 | 2 | 3;
  xpGained: number;
  nodeTitle: string;
  realm: 1 | 2 | 3 | 4;
  onComplete: () => void;
}

const REALM_COLORS: Record<number, string> = {
  1: "#39ff14",
  2: "#00aaff",
  3: "#ff6600",
  4: "#c0a0ff",
};

const DURATION_MS = 4000;

export default function LessonComplete({ stars, xpGained, nodeTitle, realm, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const accentColor = REALM_COLORS[realm] ?? "#39ff14";

  const parseHex = (hex: string): [number, number, number] => {
    const c = hex.replace("#", "");
    return [
      parseInt(c.substring(0, 2), 16) || 0,
      parseInt(c.substring(2, 4), 16) || 0,
      parseInt(c.substring(4, 6), 16) || 0,
    ];
  };
  const [ar, ag, ab] = parseHex(accentColor);

  const DIALOGUE: Record<number, string> = {
    3: "PERFECT! You are literally a genius. Don't tell the others I said that.",
    2: "Not bad! I've seen worse. Actually, I haven't. But still, good job.",
    1: "...you finished. That's the important part. Mostly.",
  };
  const dialogue = DIALOGUE[stars];

  // Particle system
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    r: number;
    color: [number, number, number];
  }

  const initParticles = useCallback((w: number, h: number): Particle[] => {
    const cx = w / 2;
    const cy = h / 2;
    const out: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.3;
      const speed = 1.5 + Math.random() * 4;
      const colors: [number, number, number][] = [
        [ar, ag, ab],
        [255, 215, 0],
        [255, 255, 255],
      ];
      out.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 90 + Math.random() * 60,
        r: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return out;
  }, [ar, ag, ab]);

  const drawEnzyme = useCallback((ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) => {
    // Simple pixel cat: Enzyme
    const bounceY = cy + Math.sin(t * 6) * 8;
    const scale = 3;
    // Body
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 6 * scale, bounceY - 4 * scale, 12 * scale, 8 * scale);
    // Head
    ctx.fillRect(cx - 4 * scale, bounceY - 9 * scale, 8 * scale, 6 * scale);
    // Ears
    ctx.fillRect(cx - 5 * scale, bounceY - 12 * scale, 3 * scale, 3 * scale);
    ctx.fillRect(cx + 2 * scale, bounceY - 12 * scale, 3 * scale, 3 * scale);
    // Eyes
    ctx.fillStyle = "#000000";
    ctx.fillRect(cx - 3 * scale, bounceY - 8 * scale, 2 * scale, 2 * scale);
    ctx.fillRect(cx + 1 * scale, bounceY - 8 * scale, 2 * scale, 2 * scale);
    // Nose
    ctx.fillStyle = "#ff69b4";
    ctx.fillRect(cx - 1 * scale, bounceY - 6 * scale, 2 * scale, 1 * scale);
    // Tail
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx + 6 * scale, bounceY - 2 * scale + Math.sin(t * 4) * 4, 3 * scale, 2 * scale);
    ctx.fillRect(cx + 9 * scale, bounceY - 4 * scale + Math.sin(t * 4) * 4, 2 * scale, 2 * scale);
  }, []);

  const drawStar = useCallback(
    (ctx: CanvasRenderingContext2D, cx: number, cy: number, filled: boolean, size: number) => {
      const pts = 5;
      const outerR = size;
      const innerR = size * 0.4;
      ctx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const angle = (Math.PI / pts) * i - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (filled) {
        ctx.fillStyle = "#ffd700";
        ctx.fill();
        ctx.strokeStyle = "#ffa500";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = "#333333";
        ctx.fill();
        ctx.strokeStyle = "#555555";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    },
    []
  );

  const handleDismiss = useCallback(() => {
    if (!dismissed) {
      setDismissed(true);
      cancelAnimationFrame(rafRef.current);
      onCompleteRef.current();
    }
  }, [dismissed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let particles = initParticles(canvas.width, canvas.height);
    startRef.current = performance.now();

    const draw = (now: number) => {
      const elapsed = now - startRef.current;
      const t = elapsed / 1000; // seconds
      const progress = Math.min(elapsed / DURATION_MS, 1);

      const w = canvas.width;
      const h = canvas.height;

      // Background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      // Subtle vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, h * 0.8);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Update and draw particles
      for (const p of particles) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        const alpha = Math.max(0, 1 - p.life / p.maxLife) * 0.9;
        if (alpha > 0) {
          ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${alpha})`;
          ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
        }
      }
      particles = particles.filter((p) => p.life < p.maxLife);

      const cx = w / 2;
      const cy = h / 2;

      // Enzyme sprite
      drawEnzyme(ctx, cx, cy + 20, t);

      // Stars
      const starSpacing = 60;
      const starY = cy - 120;
      for (let s = 0; s < 3; s++) {
        const sx = cx + (s - 1) * starSpacing;
        const filled = s < stars;
        // Animate stars popping in
        const starDelay = s * 0.15;
        const starScale = Math.min(1, Math.max(0, (t - starDelay) / 0.3));
        ctx.save();
        ctx.translate(sx, starY);
        ctx.scale(starScale, starScale);
        drawStar(ctx, 0, 0, filled, 22);
        ctx.restore();
      }

      // "LESSON COMPLETE!" title
      const titleAlpha = Math.min(1, t / 0.5);
      ctx.globalAlpha = titleAlpha;
      ctx.font = "bold 22px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = accentColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = accentColor;
      ctx.fillText("LESSON COMPLETE!", cx, cy - 155);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Node title
      const nodeTitleAlpha = Math.min(1, Math.max(0, (t - 0.3) / 0.4));
      ctx.globalAlpha = nodeTitleAlpha;
      ctx.font = "13px 'Courier New', monospace";
      ctx.fillStyle = "#aaaaaa";
      ctx.fillText(nodeTitle, cx, cy - 130);
      ctx.globalAlpha = 1;

      // +XP counter (animate 0 → xpGained over 1.5s)
      const xpAnimDuration = 1.5;
      const xpT = Math.min(1, Math.max(0, (t - 0.2) / xpAnimDuration));
      const displayXP = Math.round(xpT * xpGained);
      const xpAlpha = Math.min(1, Math.max(0, (t - 0.2) / 0.3));
      ctx.globalAlpha = xpAlpha;
      ctx.font = "bold 20px 'Courier New', monospace";
      ctx.fillStyle = "#ffd700";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#ffd700";
      ctx.fillText(`+${displayXP} XP`, cx, cy + 90);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Dialogue
      const dialogueAlpha = Math.min(1, Math.max(0, (t - 0.8) / 0.5));
      if (dialogueAlpha > 0) {
        ctx.globalAlpha = dialogueAlpha;
        ctx.font = "12px 'Courier New', monospace";
        ctx.fillStyle = "#cccccc";
        // Word wrap
        const maxWidth = Math.min(w - 60, 420);
        const words = dialogue.split(" ");
        const lines: string[] = [];
        let line = "";
        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (ctx.measureText(test).width > maxWidth) {
            lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
        const lineH = 18;
        const boxH = lines.length * lineH + 20;
        const boxY = cy + 105;
        // Box
        ctx.fillStyle = "rgba(20,20,20,0.8)";
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.fillRect(cx - maxWidth / 2 - 10, boxY, maxWidth + 20, boxH);
        ctx.strokeRect(cx - maxWidth / 2 - 10, boxY, maxWidth + 20, boxH);
        ctx.fillStyle = "#cccccc";
        ctx.font = "12px 'Courier New', monospace";
        lines.forEach((ln, i) => {
          ctx.fillText(ln, cx, boxY + 14 + i * lineH);
        });
        ctx.globalAlpha = 1;
      }

      // CONTINUE button — pulses
      const btnAlpha = Math.min(1, Math.max(0, (t - 1.2) / 0.4));
      if (btnAlpha > 0) {
        const pulse = 0.7 + 0.3 * Math.sin(t * 4);
        ctx.globalAlpha = btnAlpha;
        const btnW = 200;
        const btnH = 36;
        const btnX = cx - btnW / 2;
        const btnY = h - 80;
        ctx.fillStyle = `rgba(${ar},${ag},${ab},${pulse * 0.3})`;
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, btnY, btnW, btnH);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},${pulse})`;
        ctx.font = "bold 14px 'Courier New', monospace";
        ctx.fillText("CONTINUE →", cx, btnY + 24);
        ctx.globalAlpha = 1;
      }

      // Auto-advance
      if (progress >= 1 && !dismissed) {
        setDismissed(true);
        onCompleteRef.current();
        return;
      }

      if (!dismissed) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [accentColor, ar, ag, ab, dialogue, drawEnzyme, drawStar, initParticles, nodeTitle, stars, xpGained, dismissed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "block",
        cursor: "pointer",
      }}
      onClick={handleDismiss}
    />
  );
}
