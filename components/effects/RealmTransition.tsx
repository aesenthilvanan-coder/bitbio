"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  color: string;
  onComplete: () => void;
  direction: "in" | "out";
}

export default function RealmTransition({ color, onComplete, direction }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const w = canvas.width;
    const h = canvas.height;
    const DURATION_MS = 500;
    const start = performance.now();
    let raf = 0;

    // Parse the hex color to RGB
    const parseColor = (hex: string): [number, number, number] => {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.substring(0, 2), 16) || 0;
      const g = parseInt(clean.substring(2, 4), 16) || 0;
      const b = parseInt(clean.substring(4, 6), 16) || 0;
      return [r, g, b];
    };
    const [cr, cg, cb] = parseColor(color);

    const draw = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION_MS, 1);

      // 'in': sweep from left (black to color), 'out': sweep from left (color to black)
      const sweepX = Math.floor(t * w);

      ctx.clearRect(0, 0, w, h);

      if (direction === "in") {
        // Left of sweep: filled with color
        // Right of sweep: black
        // Background (right side)
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        // Sweep the color fill column by column (draw filled region as image data for scanline noise)
        if (sweepX > 0) {
          const imageData = ctx.createImageData(sweepX, h);
          const data = imageData.data;
          for (let y = 0; y < h; y++) {
            const scanlineDim = y % 2 === 0 ? 1.0 : 0.82;
            for (let x = 0; x < sweepX; x++) {
              const idx = (y * sweepX + x) * 4;
              // Add slight noise per pixel
              const noise = (Math.random() - 0.5) * 18;
              data[idx] = Math.min(255, Math.max(0, cr * scanlineDim + noise));
              data[idx + 1] = Math.min(255, Math.max(0, cg * scanlineDim + noise));
              data[idx + 2] = Math.min(255, Math.max(0, cb * scanlineDim + noise));
              data[idx + 3] = 255;
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }
      } else {
        // 'out': sweep FROM color to black
        // Left of sweep: black (already swept away)
        // Right of sweep: color
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        const colorStart = sweepX;
        const colorWidth = w - sweepX;
        if (colorWidth > 0) {
          const imageData = ctx.createImageData(colorWidth, h);
          const data = imageData.data;
          for (let y = 0; y < h; y++) {
            const scanlineDim = y % 2 === 0 ? 1.0 : 0.82;
            for (let x = 0; x < colorWidth; x++) {
              const idx = (y * colorWidth + x) * 4;
              const noise = (Math.random() - 0.5) * 18;
              data[idx] = Math.min(255, Math.max(0, cr * scanlineDim + noise));
              data[idx + 1] = Math.min(255, Math.max(0, cg * scanlineDim + noise));
              data[idx + 2] = Math.min(255, Math.max(0, cb * scanlineDim + noise));
              data[idx + 3] = 255;
            }
          }
          ctx.putImageData(imageData, colorStart, 0);
        }
      }

      if (t < 1) {
        raf = requestAnimationFrame(draw);
      } else {
        setVisible(false);
        onComplete();
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [color, direction, onComplete]);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "block",
        pointerEvents: "all",
      }}
    />
  );
}
