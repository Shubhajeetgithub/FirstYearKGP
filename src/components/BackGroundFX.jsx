import { useEffect, useState } from 'react';
import MouseGlow from './MouseGlow';

function HasTouchBG({ children }) {
  return <div>{children}</div>
}

function BackgroundFX({ children }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch devices
    const hasTouch = window.matchMedia('(pointer: coarse)').matches;
    console.log(`hasTouch: ${hasTouch}`);
    setIsTouch(hasTouch);
  }, []);

  if (isTouch) {
    return <HasTouchBG>{children}</HasTouchBG>;
  } else {
    return <MouseGlow>{children}</MouseGlow>;
  }
}

export default BackgroundFX;