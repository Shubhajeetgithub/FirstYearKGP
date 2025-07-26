import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import BackgroundFX from '@/components/BackGroundFX';
import Credits from '@/components/Credits';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI 2024',
  description: 'Department of Artificial Intelligence',
};

const navItems = [
  { id: 1, name: 'Home', route: '/' },
  { id: 2, name: 'TimeTable', route: '/timetable' },
  { id: 3, name: 'Announcements', route: '/announcements' },
  { id: 4, name: 'Resources', route: '/resources' },
];

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackgroundFX>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.1),_transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.05),_transparent_50%)] pointer-events-none"></div>

            {/* Header */}
            <header className="text-center mt-12 relative z-10">
              <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                AI 2024
              </h1>
              <h2 className="text-xl text-gray-300 font-light tracking-wide">
                Department of Artificial Intelligence
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
            </header>

            {/* Navigation */}
            <nav className="flex gap-6 mt-12 relative z-10 flex-wrap justify-evenly">
              {navItems.map((item) => (
                <Link
                  href={item.route}
                  key={item.id}
                  className={`px-6 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105 bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500 backdrop-blur-sm`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Page Content */}
            <main className="w-full relative z-10 mt-10 px-4">
              {children}
            </main>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></div>
            <footer>
              <Credits />
            </footer>
          </div>
        </BackgroundFX>
      </body>
    </html>
  );
}
