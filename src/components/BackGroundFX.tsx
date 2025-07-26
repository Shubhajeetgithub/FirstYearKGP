"use client"

import { useEffect, useState } from 'react';
import MouseGlow from '@/components/MouseGlow';
import TouchEffect from '@/components/TouchEffect';

function BackgroundFX({ children }: Readonly<{
  children: React.ReactNode;
}>) {
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