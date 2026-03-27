import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;
    setPosition({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ 
        x: position.x, 
        y: position.y,
        scale: isHovered ? 1.02 : 1
      }}
      transition={{ 
        x: { type: 'spring', damping: 20, stiffness: 150, mass: 0.1 },
        y: { type: 'spring', damping: 20, stiffness: 150, mass: 0.1 },
        scale: { duration: 0.2 }
      }}
      className={cn("inline-block relative group", className)}
    >
      {children}
    </motion.div>
  );
}
