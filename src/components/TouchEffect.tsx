'use client';

import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function TouchEffect({ children }: Props) {
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const glow = document.createElement('div');
      
      Object.assign(glow.style, {
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(164, 94, 255, 0.5), transparent 50%)',
        left: `${touch.clientX + window.scrollX - 75}px`,
        top: `${touch.clientY + window.scrollY - 75}px`,
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'opacity 0.6s, transform 0.6s',
        opacity: '1',
        transform: 'scale(1)',
      });

      document.body.appendChild(glow);

      // Animate fade + scale
      requestAnimationFrame(() => {
        glow.style.opacity = '0';
        glow.style.transform = 'scale(2)';
      });

      // Remove after animation
      setTimeout(() => {
        glow.remove();
      }, 600);
    };

    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  return <div className="relative">{children}</div>;
}
