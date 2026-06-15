"use client";
import { useEffect, useRef } from "react";

interface Props {
  chars?: string;
  color?: string;
  density?: number;
  speed?: number;
  opacity?: number;
}

export default function MatrixRain({
  chars = "ATCGATCGAAATCGTAGCATCGATCGATGCGAT0110ATCG",
  color = "#39ff14",
  density = 0.5,
  speed = 1,
  opacity = 0.15,
}: Props) {
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

    const fontSize = 14;
    let cols = Math.floor(canvas.width / fontSize * density);
    const drops: number[] = Array(Math.floor(cols)).fill(1);

    const draw = () => {
      ctx.fillStyle = `rgba(10, 10, 10, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px "Press Start 2P", monospace`;
      ctx.globalAlpha = opacity * 6;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize * (1 / density), drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += speed;
      }
      ctx.globalAlpha = 1;
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, [chars, color, density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
}
