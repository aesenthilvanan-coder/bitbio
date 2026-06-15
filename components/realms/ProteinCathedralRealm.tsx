"use client";
import { useEffect, useRef } from "react";

export default function ProteinCathedralRealm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Alpha helices (columns)
    const helices = Array.from({ length: 10 }, (_, i) => ({
      x: (canvas.width / 11) * (i + 1),
      phase: (i / 10) * Math.PI * 2,
    }));

    // Floating holographic terminals (lesson nodes)
    const terminals = Array.from({ length: 6 }, (_, i) => ({
      x: 100 + (canvas.width - 200) * (i / 5),
      y: 150 + Math.sin(i * 1.2) * 100,
      phase: i * 0.7,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cathedral background — cold blue-green
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#001a1a");
      bg.addColorStop(0.3, "#000d0d");
      bg.addColorStop(1, "#020808");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor grid
      ctx.strokeStyle = "#00ffff08";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, canvas.height * 0.7);
        ctx.lineTo(canvas.width / 2 + (x - canvas.width / 2) * 0.3, canvas.height);
        ctx.stroke();
      }
      for (let z = 0; z < 20; z++) {
        const progress = z / 20;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.7 + progress * canvas.height * 0.3);
        ctx.lineTo(canvas.width, canvas.height * 0.7 + progress * canvas.height * 0.3);
        ctx.stroke();
      }

      // Alpha helices as cathedral columns
      for (const helix of helices) {
        const t = frame * 0.01 + helix.phase;
        ctx.strokeStyle = "#00ffff20";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let y = canvas.height * 0.1; y < canvas.height * 0.9; y += 3) {
          const x = helix.x + Math.sin(y * 0.06 + t) * 12;
          if (y === canvas.height * 0.1) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Helix glow dots
        for (let step = 0; step < 20; step++) {
          const y = canvas.height * 0.1 + (canvas.height * 0.8 / 20) * step;
          const x = helix.x + Math.sin(y * 0.06 + t) * 12;
          const glowAlpha = Math.abs(Math.sin(step * 0.3 + frame * 0.02)) * 0.5;
          ctx.fillStyle = `rgba(0, 255, 255, ${glowAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Beta sheet ceiling
      ctx.strokeStyle = "#00ffff15";
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 15, 80);
        ctx.lineTo(x + 30, 0);
        ctx.stroke();
      }

      // Holographic ambient glow
      const centerGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.6
      );
      centerGlow.addColorStop(0, "#00ffff05");
      centerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating holographic terminals
      for (const term of terminals) {
        term.phase += 0.015;
        const floatY = term.y + Math.sin(term.phase) * 15;
        const alpha = 0.3 + Math.abs(Math.sin(term.phase * 0.7)) * 0.4;

        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.fillRect(term.x - 40, floatY - 25, 80, 50);
        ctx.strokeRect(term.x - 40, floatY - 25, 80, 50);

        // Terminal contents
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.7})`;
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("[ NODE ]", term.x, floatY + 5);
      }
      ctx.textAlign = "left";

      frame++;
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}
