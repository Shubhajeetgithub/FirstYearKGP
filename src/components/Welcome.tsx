'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

const Welcome: React.FC = () => {
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const { themeConfig } = useTheme();

  useEffect(() => {
    const text = ' cat welcome.txt';
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
        <div
        className={`
          ${themeConfig.terminal.background.main}
          backdrop-blur-sm border rounded-lg overflow-hidden shadow-2xl transition-colors duration-300
        `}
        >

          {/* Terminal Header */}
          <div
          className={`
            ${themeConfig.terminal.background.pattern1}
            px-4 py-3 flex items-center gap-2 transition-colors duration-300
          `}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={`ml-4 text-sm ${themeConfig.terminal.text.pattern1}`}>terminal</span>
          </div>

          {/* Terminal Typing */}
          <div className={`p-6 font-mono text-lg ${themeConfig.terminal.text.pattern2}`}>
            <span className="text-blue-500">$</span>{terminalText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
          </div>

          {/* Description Text */}
          <div className={`px-6 pb-6 font-mono ${themeConfig.terminal.text.main} text-sm leading-relaxed transition-colors duration-300`}>
            This website provides academic resources from the <strong className={themeConfig.terminal.text.pattern3}>2024 AI batch</strong>, aimed at assisting KGPians in their studies.
            It serves as a supplementary platform alongside existing sites such as
            <span className={themeConfig.terminal.text.pattern4}> CSE 2020</span>,
            <span className={themeConfig.terminal.text.pattern5}> KGPellence</span>, and
            <span className={themeConfig.terminal.text.pattern6}> MetaKGP</span>.
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
