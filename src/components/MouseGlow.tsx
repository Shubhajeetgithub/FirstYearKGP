'use client';

import React, { useState, useEffect } from 'react';

type Coords = {
  x: number;
  y: number;
};

export default function MouseGlow({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed inset-0 z-[10]"
        style={{
          background: `radial-gradient(circle at ${coords.x}px ${coords.y}px, rgba(164, 94, 255, 0.3), transparent 50%)`,
          mixBlendMode: 'screen',
        }}
      />
      {children}
    </div>
  );
}