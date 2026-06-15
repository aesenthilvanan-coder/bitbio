"use client";
import { useEffect, useRef } from "react";

export default function GenomeForestRealm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireflies = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;

    const drawHelix = (x: number, amplitude: number, height: number, offset: number) => {
      // Strand 1
      ctx.strokeStyle = "#39ff1440";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = 0; y < height; y += 4) {
        const sx = x + Math.sin((y * 0.05) + offset) * amplitude;
        if (y === 0) ctx.moveTo(sx, y);
        else ctx.lineTo(sx, y);
      }
      ctx.stroke();

      // Strand 2
      ctx.strokeStyle = "#52b78840";
      ctx.beginPath();
      for (let y = 0; y < height; y += 4) {
        const sx = x - Math.sin((y * 0.05) + offset) * amplitude;
        if (y === 0) ctx.moveTo(sx, y);
        else ctx.lineTo(sx, y);
      }
      ctx.stroke();

      // Base pairs (rungs)
      for (let y = 20; y < height; y += 25) {
        const x1 = x + Math.sin((y * 0.05) + offset) * amplitude;
        const x2 = x - Math.sin((y * 0.05) + offset) * amplitude;
        ctx.strokeStyle = "#39ff1420";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Glowing node on rung
        if (Math.sin((y * 0.05) + offset + frame * 0.01) > 0.8) {
          ctx.fillStyle = "#39ff14";
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc((x1 + x2) / 2, y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark forest background
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#010801");
      bg.addColorStop(0.5, "#030f03");
      bg.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // DNA helix trees
      const helixPositions = [80, 240, 420, 600, 780, canvas.width - 120, canvas.width - 280];
      for (let i = 0; i < helixPositions.length; i++) {
        drawHelix(helixPositions[i], 25 + i * 3, canvas.height, frame * 0.005 + i);
      }

      // mRNA fireflies
      for (const ff of fireflies) {
        ff.x += ff.vx;
        ff.y += ff.vy;
        ff.phase += 0.05;
        if (ff.x < 0) ff.x = canvas.width;
        if (ff.x > canvas.width) ff.x = 0;
        if (ff.y < 0) ff.y = canvas.height;
        if (ff.y > canvas.height) ff.y = 0;

        const glow = Math.abs(Math.sin(ff.phase));
        const grad = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 3);
        grad.addColorStop(0, `rgba(83, 183, 136, ${glow * 0.9})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(200, 255, 200, ${glow * 0.8})`;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Forest floor glow
      const floorGrad = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
      floorGrad.addColorStop(0, "transparent");
      floorGrad.addColorStop(1, "#39ff1408");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

      frame++;
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}
