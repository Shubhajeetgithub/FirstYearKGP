import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import BackgroundFX from "./components/BackGroundFX";

const App = () => {
  const navItems = [
    { id: 1, name: "Home", route: "/" },
    { id: 4, name: "Resources", route: "/Resources" },
  ];

  return (
    <BackgroundFX>
      <div className="relative min-h-screen bg-[#07070a] text-slate-200 font-sans selection:bg-indigo-500/30">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 flex flex-col items-center min-h-screen">
          {/* Navigation */}
          <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-1 p-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
              {navItems.map((item) => (
                <NavLink
                  to={item.route}
                  key={item.id}
                  className={({ isActive }) =>
                    `relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                      isActive
                        ? "text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Page Content */}
          <main className="w-full max-w-7xl px-4 pt-32 pb-16 flex-grow flex flex-col">
            <Outlet />
          </main>
        </div>
      </div>
    </BackgroundFX>
  );
};

export default App;
