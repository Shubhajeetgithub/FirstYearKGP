import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
const App = () => {
  const [activeTab, setActiveTab] = useState('Home');


  const navItems = ['Home', 'TimeTable', 'Announcements', 'Resources'];

  return (
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
      <nav className="flex gap-6 mt-12 relative z-10">
        {navItems.map((item) => (
          <NavLink
            to={`/${item}`}
            key={item}
            onClick={() => setActiveTab(item)}
            className={`px-6 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105 ${
              activeTab === item
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 shadow-lg shadow-blue-500/25'
                : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500'
            } backdrop-blur-sm`}
          >
            {item}
          </NavLink>
        ))}
      </nav>
      
      <Outlet />
      

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default App;
