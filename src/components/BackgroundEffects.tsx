import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import MagneticGrid from './MagneticGrid';

export default function BackgroundEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
      <MagneticGrid />
      
      {/* Interactive Cursor Glow */}
      <motion.div
        animate={{
          x: mousePos.x - 250,
          y: mousePos.y - 250,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 150, mass: 0.5 }}
        className="absolute w-[500px] h-[500px] bg-primary-blue/5 rounded-full blur-[100px] opacity-50"
      />

      {/* Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
}
