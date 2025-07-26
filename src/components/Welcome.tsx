'use client';

import React, { useState, useEffect } from 'react';

const Welcome: React.FC = () => {
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const text = '$ cat welcome.txt';
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTerminalText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="w-screen flex items-center justify-center">
      <div className="mt-12 w-full max-w-2xl px-4 relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden shadow-2xl">

          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-sm text-gray-400">terminal</span>
          </div>

          {/* Terminal Typing */}
          <div className="p-6 font-mono text-green-400 text-lg">
            {terminalText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
          </div>

          {/* Description Text */}
          <div className="ml-6 mr-6 mb-4 font-mono text-white text-sm leading-relaxed">
            This website provides academic resources from the <strong className="text-lime-400">2024 AI batch</strong>, aimed at assisting KGPians in their studies.
            It serves as a supplementary platform alongside existing sites such as
            <span className="text-yellow-500 font-bold"> CSE 2020</span>,
            <span className="text-pink-600 font-bold"> KGPellence</span>, and
            <span className="text-orange-500 font-bold"> MetaKGP</span>.
            <br /><br />
            Our focus is on hosting resources that are not readily available elsewhere.
            As this website is still a work in progress, we welcome your feedback.
            If you come across any errors or missing content, please feel free to contact us via email (details provided below).
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
