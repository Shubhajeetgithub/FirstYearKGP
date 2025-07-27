'use client';

import { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

export function ThemedLayout({ children }: { children: ReactNode }) {
  const { themeConfig } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${themeConfig.background.main}`}></div>
      <div className={`absolute inset-0 ${themeConfig.background.pattern1} pointer-events-none`}></div>
      <div className={`absolute inset-0 ${themeConfig.background.pattern2} pointer-events-none`}></div>

      {/* Header */}
      <header className="text-center mt-12 relative z-10">
        <h1 className={`text-6xl font-bold mb-2 ${themeConfig.header.gradient} bg-clip-text text-transparent animate-pulse`}>
          AI 2024
        </h1>
        <h2 className={`text-xl ${themeConfig.text.secondary} font-light tracking-wide`}>
          Department of Artificial Intelligence
        </h2>
        <div className={`w-32 h-1 ${themeConfig.header.divider} mx-auto mt-4 rounded-full`}></div>
      </header>

      {children}
    </div>
  );
}
