"use client";
import { useEffect, useRef } from "react";

export default function NeuralNebulaRealm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Neurons
    const neurons = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 3 + Math.random() * 5,
      brightness: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
    }));

    // Connections (synapses)
    const connections: [number, number][] = [];
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const dx = neurons[i].x - neurons[j].x;
        const dy = neurons[i].y - neurons[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) connections.push([i, j]);
      }
    }

    // Data particles flowing along connections
    const dataParticles = Array.from({ length: 60 }, () => {
      const connIdx = Math.floor(Math.random() * connections.length);
      return {
        connIdx,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
        color: ["#f59e0b", "#39ff14", "#a855f7"][Math.floor(Math.random() * 3)],
      };
    });

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space nebula background
      const bg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.8
      );
      bg.addColorStop(0, "#1a0a2e");
      bg.addColorStop(0.4, "#0d0518");
      bg.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Purple nebula clouds
      for (let i = 0; i < 5; i++) {
        const gx = canvas.width * (0.2 + i * 0.15);
        const gy = canvas.height * (0.3 + Math.sin(frame * 0.001 + i) * 0.1);
        const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 180);
        gr.addColorStop(0, "#a855f708");
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(gx, gy, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Synapse connections
      for (const [i, j] of connections) {
        const a = neurons[i];
        const b = neurons[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, 1 - dist / 150) * 0.15;

        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Data particles
      for (const p of dataParticles) {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;

        const [i, j] = connections[p.connIdx] ?? [0, 1];
        const a = neurons[i];
        const b = neurons[j];
        if (!a || !b) continue;

        const px = a.x + (b.x - a.x) * p.progress;
        const py = a.y + (b.y - a.y) * p.progress;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 4);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neurons
      for (const n of neurons) {
        n.phase += n.speed;
        const glow = Math.abs(Math.sin(n.phase));
        const alpha = 0.4 + glow * 0.6;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grad.addColorStop(0, `rgba(245, 158, 11, ${alpha})`);
        grad.addColorStop(0.5, `rgba(245, 158, 11, ${alpha * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 230, 100, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}
