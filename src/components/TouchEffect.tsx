import { useEffect } from 'react';
import { prefersReducedMotion } from '../utils/motion';
import type { ReactNode } from 'react';

interface TouchEffectProps {
  children?: ReactNode;
}

function TouchEffect({ children }: TouchEffectProps) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleTouchStart = (e: TouchEvent) => {
      const glow = document.createElement('div');
      glow.style.position = 'absolute';
      glow.style.width = '150px';
      glow.style.height = '150px';
      glow.style.borderRadius = '50%';
      glow.style.background = 'radial-gradient(circle, rgba(164, 94, 255, 0.5), transparent 50%)';
      glow.style.left = `${e.touches[0].clientX + window.scrollX - 75}px`;
      glow.style.top = `${e.touches[0].clientY + window.scrollY - 75}px`;
      glow.style.pointerEvents = 'none';
      glow.style.zIndex = '9999';
      glow.style.transition = 'opacity 0.6s, transform 0.6s';
      glow.style.opacity = '1';
      glow.style.transform = 'scale(1)';
      document.body.appendChild(glow);

      requestAnimationFrame(() => {
        glow.style.opacity = '0';
        glow.style.transform = 'scale(2)';
      });

      setTimeout(() => {
        glow.remove();
      }, 600);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return <div className="relative">{children}</div>;
}

export default TouchEffect;
