import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  opacity: number;
  swayPhase: number;
}

interface PetalCanvasProps {
  burstKey: number;
  active: boolean;
}

const PETAL_COLORS = [
  '#E07A16', // Marigold Saffron
  '#F59E0B', // Golden Marigold
  '#9B1B30', // Kumkum Rose
  '#C84B31', // Vermilion Petal
  '#D4A24C', // Warm Gold Flake
];

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ burstKey, active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create an initial celebratory shower when burstKey increments
    const spawnBurst = (count: number) => {
      const w = canvas.width;
      const newPetals: Petal[] = [];
      for (let i = 0; i < count; i++) {
        newPetals.push({
          x: Math.random() * w,
          y: -20 - Math.random() * 240,
          vx: (Math.random() - 0.5) * 1.4,
          vy: 1.3 + Math.random() * 2.1,
          size: 5 + Math.random() * 6,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.06,
          color: PETAL_COLORS[i % PETAL_COLORS.length],
          opacity: 0.7 + Math.random() * 0.25,
          swayPhase: Math.random() * Math.PI * 2,
        });
      }
      petalsRef.current = [...petalsRef.current.slice(-45), ...newPetals];
    };

    spawnBurst(38);

    let frame = 0;
    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gentle ongoing ambient petals (subtle, sparse)
      if (frame % 26 === 0 && petalsRef.current.length < 24) {
        petalsRef.current.push({
          x: Math.random() * canvas.width,
          y: -15,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 0.8 + Math.random() * 1.0,
          size: 4 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.04,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
          opacity: 0.5 + Math.random() * 0.25,
          swayPhase: Math.random() * Math.PI * 2,
        });
      }

      petalsRef.current = petalsRef.current.filter((p) => p.y < canvas.height + 30);

      for (const p of petalsRef.current) {
        p.swayPhase += 0.03;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.55;
        p.y += p.vy;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [burstKey, active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-30 pointer-events-none w-full h-full"
    />
  );
};
