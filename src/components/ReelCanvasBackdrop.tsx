import React, { useEffect, useRef } from 'react';

interface ReelCanvasBackdropProps {
  active: boolean;
  celebrationBurstKey: number;
  sparklerActive: boolean;
}

interface Ember {
  x: number;
  y: number;
  vy: number;
  vx: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
  hue: 'gold' | 'rose' | 'saffron';
}

export const ReelCanvasBackdrop: React.FC<ReelCanvasBackdropProps> = ({
  active,
  celebrationBurstKey,
  sparklerActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const embersRef = useRef<Ember[]>([]);
  const sparklerRef = useRef(sparklerActive);

  useEffect(() => {
    sparklerRef.current = sparklerActive;
  }, [sparklerActive]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnEmber = (w: number, h: number, originX?: number, originY?: number, burst = false): Ember => {
      const hues: Array<'gold' | 'rose' | 'saffron'> = ['gold', 'gold', 'saffron', 'rose'];
      return {
        x: originX ?? (burst ? w * 0.5 + (Math.random() - 0.5) * w * 0.45 : Math.random() * w),
        y: originY ?? (burst ? h * 0.52 + (Math.random() - 0.5) * 90 : h + 10),
        vx: originX !== undefined ? (Math.random() - 0.5) * 2.2 : (Math.random() - 0.5) * (burst ? 1.8 : 0.45),
        vy: originY !== undefined ? -(2.2 + Math.random() * 2.8) : -(0.5 + Math.random() * (burst ? 2.1 : 1.05)),
        radius: 1.4 + Math.random() * 2.6,
        alpha: 0.55 + Math.random() * 0.45,
        life: 0,
        maxLife: originY !== undefined ? 55 + Math.random() * 45 : 120 + Math.random() * 140,
        hue: hues[Math.floor(Math.random() * hues.length)],
      };
    };

    const parentW = canvas.parentElement?.clientWidth || 800;
    const parentH = canvas.parentElement?.clientHeight || 560;
    embersRef.current = Array.from({ length: 44 }, () =>
      spawnEmber(parentW, parentH, undefined, undefined, true)
    );

    const drawStaticOrFrame = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const cx = w * 0.5;
      const cy = h * 0.46;

      ctx.clearRect(0, 0, w, h);

      // 1. Deep Royal Velvet Gradient Backdrop
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(w, h) * 0.74);
      bgGrad.addColorStop(0, '#6E1627');
      bgGrad.addColorStop(0.45, '#420A14');
      bgGrad.addColorStop(1, '#1B0308');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Volumetric Rotating Golden Light Shafts (God Rays)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.08);
      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / rayCount);
        const rayGrad = ctx.createLinearGradient(0, 0, Math.max(w, h) * 0.68, 0);
        rayGrad.addColorStop(0, 'rgba(243, 206, 130, 0.14)');
        rayGrad.addColorStop(0.6, 'rgba(212, 162, 76, 0.03)');
        rayGrad.addColorStop(1, 'rgba(212, 162, 76, 0)');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.max(w, h) * 0.7, -38);
        ctx.lineTo(Math.max(w, h) * 0.7, 38);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 3. Rotating Sacred Mandala Rings in Fine Antique Gold
      const mandalaRadius = Math.min(w, h) * 0.34;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.12);
      ctx.strokeStyle = 'rgba(230, 187, 108, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, mandalaRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, mandalaRadius * 0.84, 0, Math.PI * 2);
      ctx.stroke();

      const petals = 16;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.moveTo(mandalaRadius * 0.84, 0);
        ctx.quadraticCurveTo(mandalaRadius * 0.94, mandalaRadius * 0.08, mandalaRadius, 0);
        ctx.quadraticCurveTo(mandalaRadius * 0.94, -mandalaRadius * 0.08, mandalaRadius * 0.84, 0);
        ctx.strokeStyle = 'rgba(242, 209, 132, 0.26)';
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // 4. Perspective Royal Red-and-Gold Mandap Walkway Floor (पायघड्या)
      const floorTopY = h * 0.58;
      const floorGrad = ctx.createLinearGradient(0, floorTopY, 0, h);
      floorGrad.addColorStop(0, 'rgba(42, 7, 13, 0)');
      floorGrad.addColorStop(0.25, 'rgba(74, 14, 24, 0.65)');
      floorGrad.addColorStop(1, 'rgba(28, 4, 8, 0.95)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorTopY, w, h - floorTopY);

      // Perspective Carpet Ribbon
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - Math.min(w * 0.16, 120), floorTopY + 12);
      ctx.lineTo(cx + Math.min(w * 0.16, 120), floorTopY + 12);
      ctx.lineTo(cx + Math.min(w * 0.42, 340), h);
      ctx.lineTo(cx - Math.min(w * 0.42, 340), h);
      ctx.closePath();
      const carpetGrad = ctx.createLinearGradient(0, floorTopY, 0, h);
      carpetGrad.addColorStop(0, 'rgba(139, 21, 41, 0.25)');
      carpetGrad.addColorStop(1, 'rgba(124, 20, 35, 0.72)');
      ctx.fillStyle = carpetGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(227, 184, 103, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 5. Swaying Overhead Marigold & Jasmine Toran Garlands
      const strands = Math.max(7, Math.floor(w / 95));
      for (let i = 0; i <= strands; i++) {
        const anchorX = (w / strands) * i;
        const nextX = (w / strands) * (i + 1);
        const midX = (anchorX + nextX) * 0.5;
        const sway = Math.sin(time * 1.4 + i * 0.7) * 5;
        const sagY = 44 + (i % 2) * 14;

        if (i < strands) {
          ctx.beginPath();
          ctx.moveTo(anchorX, -2);
          ctx.quadraticCurveTo(midX + sway, sagY, nextX, -2);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.74)';
          ctx.lineWidth = 4;
          ctx.stroke();

          for (let t = 0.2; t <= 0.85; t += 0.2) {
            const bx =
              (1 - t) * (1 - t) * anchorX + 2 * (1 - t) * t * (midX + sway) + t * t * nextX;
            const by = (1 - t) * (1 - t) * -2 + 2 * (1 - t) * t * sagY + t * t * -2;
            ctx.beginPath();
            ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = t === 0.4 || t === 0.8 ? '#FEF3C7' : '#F59E0B';
            ctx.fill();
          }
        }

        const tasselLen = 54 + (i % 3) * 16;
        ctx.beginPath();
        ctx.moveTo(anchorX, 0);
        ctx.quadraticCurveTo(anchorX + sway * 0.6, tasselLen * 0.55, anchorX + sway, tasselLen);
        ctx.strokeStyle = 'rgba(253, 244, 222, 0.55)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(anchorX + sway, tasselLen, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#E07A16';
        ctx.fill();
      }

      // 6. Celebration Fountain Sparklers (फुलबाजी) flanking the walkway when couple unites
      if (sparklerRef.current) {
        const leftJetX = Math.max(40, cx - Math.min(w * 0.28, 220));
        const rightJetX = Math.min(w - 40, cx + Math.min(w * 0.28, 220));
        const jetY = h * 0.62;
        if (embersRef.current.length < 95) {
          embersRef.current.push(spawnEmber(w, h, leftJetX, jetY));
          embersRef.current.push(spawnEmber(w, h, rightJetX, jetY));
        }
      } else if (embersRef.current.length < 48 && Math.random() < 0.35) {
        embersRef.current.push(spawnEmber(w, h));
      }

      embersRef.current = embersRef.current.filter((e) => e.life < e.maxLife && e.y > -20);
      for (const e of embersRef.current) {
        e.life += 1;
        e.x += e.vx + Math.sin(time * 2 + e.life * 0.05) * 0.25;
        e.y += e.vy;
        e.vy += 0.015; // gentle gravity arc for sparkler fountain

        const progress = e.life / e.maxLife;
        const fade = progress < 0.15 ? progress * 6.6 : 1 - (progress - 0.15) / 0.85;
        const alpha = Math.max(0, e.alpha * fade);

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        if (e.hue === 'gold') {
          ctx.fillStyle = `rgba(246, 211, 129, ${alpha})`;
        } else if (e.hue === 'saffron') {
          ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(225, 95, 110, ${alpha})`;
        }
        ctx.fill();
      }
    };

    if (prefersReduced || !active) {
      drawStaticOrFrame();
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    const tick = () => {
      time += 0.016;
      drawStaticOrFrame();
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [active, celebrationBurstKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
