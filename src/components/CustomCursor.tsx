import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Immediate update for the main dot (zero latency)
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const animate = () => {
      // Smooth follow for the ring only
      const lerp = 0.15;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * lerp;
      
      ring.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      
      requestAnimationFrame(animate);
    };

    const onMouseDown = () => {
      ring.style.width = '24px';
      ring.style.height = '24px';
      ring.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
    };

    const onMouseUp = () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.backgroundColor = 'transparent';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    const rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary-blue rounded-full pointer-events-none z-[9999] -ml-[0.75px] -mt-[0.75px] will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-primary-blue/30 rounded-full pointer-events-none z-[9998] -ml-4 -mt-4 will-change-transform transition-[width,height,background-color] duration-200"
      />
    </>
  );
}
