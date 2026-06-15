"use client";
import { useEffect, useRef } from "react";

export default function CytoplasmRealm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Organelles
    const organelles = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 20 + Math.random() * 40,
      type: ["mitochondria", "ribosome", "vacuole"][i % 3],
      speed: 0.2 + Math.random() * 0.3,
      angle: Math.random() * Math.PI * 2,
      color: ["#2d6a4f", "#52b788", "#1a472a"][i % 3],
      opacity: 0.15 + Math.random() * 0.2,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const bg = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      bg.addColorStop(0, "#1a3020");
      bg.addColorStop(0.5, "#0d1f0d");
      bg.addColorStop(1, "#050a05");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ER membrane structure (background lines)
      ctx.strokeStyle = "#39ff1410";
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const y = (canvas.height / 8) * i + (frame * 0.1) % (canvas.height / 8);
        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.lineTo(x, y + Math.sin(x * 0.02 + frame * 0.02) * 30);
        }
        ctx.stroke();
      }

      // Draw organelles
      for (const org of organelles) {
        org.x += Math.cos(org.angle) * org.speed;
        org.y += Math.sin(org.angle) * org.speed;
        org.angle += 0.005;

        // Wrap around
        if (org.x < -60) org.x = canvas.width + 60;
        if (org.x > canvas.width + 60) org.x = -60;
        if (org.y < -60) org.y = canvas.height + 60;
        if (org.y > canvas.height + 60) org.y = -60;

        ctx.save();
        ctx.globalAlpha = org.opacity;

        if (org.type === "mitochondria") {
          // Oval with inner membrane folds
          ctx.fillStyle = org.color;
          ctx.beginPath();
          ctx.ellipse(org.x, org.y, org.radius, org.radius * 0.6, frame * 0.01, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#39ff1440";
          ctx.lineWidth = 1;
          ctx.stroke();
          // Cristae
          ctx.strokeStyle = "#39ff1430";
          for (let c = 0; c < 3; c++) {
            ctx.beginPath();
            ctx.moveTo(org.x - org.radius * 0.4 + c * org.radius * 0.3, org.y - org.radius * 0.4);
            ctx.quadraticCurveTo(org.x - org.radius * 0.2 + c * org.radius * 0.3, org.y, org.x - org.radius * 0.4 + c * org.radius * 0.3, org.y + org.radius * 0.4);
            ctx.stroke();
          }
        } else if (org.type === "ribosome") {
          // Small dots
          ctx.fillStyle = "#00ff8860";
          ctx.beginPath();
          ctx.arc(org.x, org.y, org.radius * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(org.x + org.radius * 0.2, org.y + org.radius * 0.1, org.radius * 0.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Vacuole — large transparent bubble
          ctx.fillStyle = "#39ff1415";
          ctx.strokeStyle = "#39ff1440";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(org.x, org.y, org.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }

      // Nucleus glow in distance
      const nucX = canvas.width * 0.8;
      const nucY = canvas.height * 0.3;
      const nucGrad = ctx.createRadialGradient(nucX, nucY, 0, nucX, nucY, 120);
      nucGrad.addColorStop(0, "#39ff1430");
      nucGrad.addColorStop(0.5, "#39ff1410");
      nucGrad.addColorStop(1, "transparent");
      ctx.fillStyle = nucGrad;
      ctx.beginPath();
      ctx.arc(nucX, nucY, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#39ff1440";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(nucX, nucY, 80, 0, Math.PI * 2);
      ctx.stroke();

      frame++;
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
