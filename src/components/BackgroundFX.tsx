import { useEffect, useState } from 'react';
import TouchEffect from './TouchEffect';

/**
 * Pointer effect overlay: tap ripples on touch screens, nothing on fine pointers.
 * Rendered as a sibling of the page content (not a wrapper), so it can hydrate late
 * (`client:idle`) without touching the server-rendered page.
 */
function BackgroundFX() {
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    setIsTouch(typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);
  }, []);

  return isTouch ? <TouchEffect /> : null;
}

export default BackgroundFX;
