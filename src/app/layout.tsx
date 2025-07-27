import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import BackgroundFX from '@/components/BackGroundFX';
import { ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemedLayout } from '@/components/ThemedLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI 2024',
  description: 'Department of Artificial Intelligence',
  icons: {
    icon: [
      { url: '/ai.png' },
      { url: '/ai.png', sizes: '32x32', type: 'image/png' },
      { url: '/ai.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/ai.png',
    apple: '/ai.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <BackgroundFX>
            <ThemedLayout>
              {/* Navigation */}
              <Navigation />

              {/* Page Content */}
              <main className="w-full relative z-10 mt-10 px-4">
                {children}
              </main>

              {/* Floating Elements */}
              <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <div className="absolute top-40 right-20 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></div>
            </ThemedLayout>
        </BackgroundFX>
        </ThemeProvider>
      </body>
    </html>
  );
}
