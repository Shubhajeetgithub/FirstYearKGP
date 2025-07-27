'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

const navItems = [
  { id: 1, name: 'Home', route: '/' },
  { id: 2, name: 'TimeTable', route: '/timetable' },
  { id: 3, name: 'Announcements', route: '/announcements' },
  { id: 4, name: 'Resources', route: '/resources' },
];

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('Home');
  const { theme, toggleTheme, themeConfig } = useTheme();

  useEffect(() => {
    // Set active tab based on current path on initial load
    const path = window.location.pathname;
    const currentTab = navItems.find(item => item.route === path)?.name || 'Home';
    setActiveTab(currentTab);
  }, []);

  return (
    <nav className="flex gap-6 mt-12 relative z-10 flex-wrap justify-evenly items-center">
      {navItems.map((item) => (
        <Link
          href={item.route}
          key={item.id}
          onClick={() => setActiveTab(item.name)}
          className={`${themeConfig.navigation.main} ${
            activeTab === item.name
              ? themeConfig.navigation.active
              : themeConfig.navigation.inactive
          }`}
        >
          {item.name}
        </Link>
      ))}
      <button
        onClick={toggleTheme}
        className={`${themeConfig.navigation.main} cursor-pointer`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌒'}
      </button>
    </nav>
  );
}
