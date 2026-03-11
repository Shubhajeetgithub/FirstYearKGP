'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  const handleJoinClick = () => {
    // Replace with your actual join flow (modal, redirect, etc.)
    alert('Join flow would be implemented here')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-semibold tracking-tight">AI Society</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive('/') ? 'text-slate-200' : 'text-slate-400'
              }`}
            >
              Home
            </Link>
            <Link
              href="/resources"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive('/resources') ? 'text-slate-200' : 'text-slate-400'
              }`}
            >
              Resources
            </Link>
            <Link
              href="/timetable"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive('/timetable') ? 'text-slate-200' : 'text-slate-400'
              }`}
            >
              Timetable
            </Link>
            <Link
              href="/map"
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive('/map') ? 'text-slate-200' : 'text-slate-400'
              }`}
            >
              Map
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/your-organization/ai-society"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-slate-200"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <button
              onClick={handleJoinClick}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-900"
            >
              Join Society
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
