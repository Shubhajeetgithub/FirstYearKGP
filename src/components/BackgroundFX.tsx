import { useEffect, useState } from 'react';
import MouseGlow from './MouseGlow';
import TouchEffect from './TouchEffect';

/**
 * Pointer effect overlay: a cursor glow on fine pointers, tap ripples on touch screens.
 * Rendered as a sibling of the page content (not a wrapper), so it can hydrate late
 * (`client:idle`) without touching the server-rendered page.
 */
function BackgroundFX() {
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    setIsTouch(typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);
  }, []);

  return isTouch ? <TouchEffect /> : <MouseGlow />;
}

export default BackgroundFX;
