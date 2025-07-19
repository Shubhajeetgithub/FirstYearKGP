import React, { useState, useEffect } from 'react';

function MouseGlow({ children }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full"
        style={{
          background: `radial-gradient(circle at ${coords.x}px ${coords.y}px, rgba(164, 94, 255, 0.3), transparent 50%)`,
          mixBlendMode: 'screen',
        }}
      />
      {children}
    </div>
  );
}

export default MouseGlow;
