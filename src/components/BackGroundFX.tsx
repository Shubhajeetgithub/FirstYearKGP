import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import MouseGlow from './MouseGlow';
import TouchEffect from './TouchEffect';

interface BackgroundFXProps {
  children?: ReactNode;
}

function BackgroundFX({ children }: BackgroundFXProps) {
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    // Detect touch devices
    const hasTouch = window.matchMedia('(pointer: coarse)').matches;
    console.log(`hasTouch: ${hasTouch}`);
    setIsTouch(hasTouch);
  }, []);

  if (isTouch) {
    return <TouchEffect>{children}</TouchEffect>;
  } else {
    return <MouseGlow>{children}</MouseGlow>;
  }
}

export default BackgroundFX;