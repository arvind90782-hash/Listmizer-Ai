import React, { useEffect, useRef } from 'react';

export default function MagneticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const spacing = 50; // Increased spacing for better performance
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.lineWidth = 1;

      // Draw vertical lines with less segments for performance
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 20) { // Increased step size
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const force = Math.max(0, (22500 - distSq) / 22500); // dist < 150
          
          const offsetX = dx * force * 0.15;
          ctx.lineTo(x + offsetX, y);
        }
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 20) { // Increased step size
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const force = Math.max(0, (22500 - distSq) / 22500);
          
          const offsetY = dy * force * 0.15;
          ctx.lineTo(x, y + offsetY);
        }
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}
