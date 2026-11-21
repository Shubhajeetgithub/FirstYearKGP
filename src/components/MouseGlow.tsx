import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { prefersReducedMotion } from '../utils/motion';

interface MouseGlowProps {
  children?: ReactNode;
}

const GLOW_BACKGROUND =
  'radial-gradient(circle at var(--x, 0px) var(--y, 0px), rgba(164, 94, 255, 0.3), transparent 50%)';

/**
 * A purple glow that follows the cursor. The position lives in CSS custom properties on the
 * overlay, written at most once per animation frame, so moving the mouse never re-renders React.
 */
function MouseGlow({ children }: MouseGlowProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  // Read once on mount: the glow is decoration, so no need to react to a live setting change.
  const [reducedMotion] = useState<boolean>(prefersReducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      const el = overlayRef.current;
      if (!el) return;
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    };

    const handleMouseMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div className="relative">
      {!reducedMotion && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 w-full h-full"
          style={{ background: GLOW_BACKGROUND, mixBlendMode: 'screen' }}
        />
      )}
      {children}
    </div>
  );
}

export default MouseGlow;
