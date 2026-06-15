"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Props {
  colors?: string[];
  count?: number;
  type?: "stars" | "bubbles" | "sparks";
}

export default function Particles({ colors = ["#39ff14", "#00ff88", "#ffffff"], count = 50, type = "stars" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: type === "bubbles" ? -Math.random() * 0.8 : (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 200,
      maxLife: 200 + Math.random() * 100,
    });

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= p.maxLife || p.x < 0 || p.x > canvas.width || p.y < -10) {
          particles[i] = createParticle();
          particles[i].life = 0;
          continue;
        }

        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.8;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (type === "stars") {
          // Pixel star
          ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        } else if (type === "bubbles") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Spark
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    const raf: { id: number } = { id: 0 };
    const loop = () => {
      animate();
      raf.id = requestAnimationFrame(loop);
    };
    raf.id = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.id);
      window.removeEventListener("resize", resize);
    };
  }, [colors, count, type]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
