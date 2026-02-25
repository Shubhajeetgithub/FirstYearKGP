'use client'

import { Bell, ExternalLink, Activity } from 'lucide-react'

export function BentoGrid() {
  const handleQuickLink = (name: string) => {
    alert(`${name} link - connect to your actual portal here`)
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 - Latest Announcements (Wide) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-[inset_0_0_30px_rgba(99,102,241,0.03)] backdrop-blur-sm">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Bell className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Latest Announcements</h3>
                  <p className="text-sm text-slate-400">Stay updated</p>
                </div>
              </div>
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                New
              </span>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <h4 className="mb-1 font-medium">End Semester Schedule Released</h4>
                <p className="text-sm text-slate-400">
                  Final examinations will commence from May 1st. Check the full schedule on ERP.
                </p>
                <span className="mt-2 inline-block text-xs text-slate-500">2 hours ago</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <h4 className="mb-1 font-medium">AI Workshop Registration Open</h4>
                <p className="text-sm text-slate-400">
                  Join us for a hands-on workshop on Transformers and LLMs this Saturday.
                </p>
                <span className="mt-2 inline-block text-xs text-slate-500">1 day ago</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Quick Links (Tall) */}
          <div className="row-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-[inset_0_0_30px_rgba(99,102,241,0.03)] backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <ExternalLink className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Links</h3>
                <p className="text-sm text-slate-400">Essential portals</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleQuickLink('ERP Portal')}
                className="group w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10">
                    <span className="text-sm font-semibold text-indigo-400">E</span>
                  </div>
                  <span className="font-medium">ERP Portal</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-400" />
              </button>
              <button
                onClick={() => handleQuickLink('MetaKGP')}
                className="group w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10">
                    <span className="text-sm font-semibold text-violet-400">M</span>
                  </div>
                  <span className="font-medium">MetaKGP</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-400" />
              </button>
              <button
                onClick={() => handleQuickLink('Zimbra Mail')}
                className="group w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10">
                    <span className="text-sm font-semibold text-purple-400">Z</span>
                  </div>
                  <span className="font-medium">Zimbra Mail</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-400" />
              </button>
              <button
                onClick={() => handleQuickLink('Gymkhana')}
                className="group w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-pink-500/10">
                    <span className="text-sm font-semibold text-pink-400">G</span>
                  </div>
                  <span className="font-medium">Gymkhana</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Card 3 - Live Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-[inset_0_0_30px_rgba(99,102,241,0.03)] backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Live Status</h3>
                <p className="text-sm text-slate-400">Current session</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs font-medium text-green-400">LIVE NOW</span>
              </div>
              <p className="mb-1 font-medium">Current Class</p>
              <p className="text-sm text-slate-400">Probability & Statistics</p>
              <p className="mt-2 text-sm text-slate-500">📍 NR321</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
