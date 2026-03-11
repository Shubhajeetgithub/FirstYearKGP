'use client'

import Link from 'next/link'
import { Github, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h4 className="mb-4 font-semibold">About</h4>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                  onClick={() => alert('Mission page would be implemented here')}
                >
                  Mission
                </button>
              </li>
              <li>
                <button
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                  onClick={() => alert('Team page would be implemented here')}
                >
                  Team
                </button>
              </li>
              <li>
                <button
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                  onClick={() => alert('Events page would be implemented here')}
                >
                  Events
                </button>
              </li>
              <li>
                <a
                  href="/guidelines/Guidelines.md"
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                >
                  Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 - Resources */}
          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                >
                  Study Materials
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                >
                  Past Papers
                </Link>
              </li>
              <li>
                <button
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                  onClick={() => alert('Roadmaps would be implemented here')}
                >
                  Roadmaps
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Community */}
          <div>
            <h4 className="mb-4 font-semibold">Community</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/your-invite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                >
                  Discord
                </a>
              </li>
              <li>
                <Link
                  href="/contribute"
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                >
                  Contribute
                </Link>
              </li>
              <li>
                <a
                  href="/guidelines/Guidelines.md"
                  className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                >
                  Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Connect */}
          <div>
            <h4 className="mb-4 font-semibold">Connect</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/your-organization/ai-society"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/your-company"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/your-account"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-400">
            © 2026 AI Society, IIT Kharagpur. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              className="text-sm text-slate-400 transition-colors hover:text-slate-200"
              onClick={() => alert('Privacy Policy would be implemented here')}
            >
              Privacy Policy
            </button>
            <button
              className="text-sm text-slate-400 transition-colors hover:text-slate-200"
              onClick={() => alert('Terms of Use would be implemented here')}
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
