import { MapPin, Users } from 'lucide-react'

export function CampusMap() {
  return (
    <section id="map" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h2 className="mb-3 font-bold tracking-[-0.02em]" style={{ fontSize: '2.5rem' }}>
            Classroom Navigator
          </h2>
          <p className="text-lg text-slate-400">
            Find your way around campus with our interactive floor plans
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-[inset_0_0_30px_rgba(99,102,241,0.03)]">
          {/* Map Container */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {/* SVG Floor Plan */}
            <svg
              viewBox="0 0 800 450"
              className="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background */}
              <rect width="800" height="450" fill="#0a0f1e" />

              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="800" height="450" fill="url(#grid)" />

              {/* Corridor */}
              <rect
                x="50"
                y="150"
                width="700"
                height="150"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Classroom NR321 - Highlighted */}
              <g className="cursor-pointer transition-all hover:opacity-80">
                <rect
                  x="100"
                  y="170"
                  width="150"
                  height="110"
                  fill="rgba(99, 102, 241, 0.15)"
                  stroke="#6366f1"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x="175"
                  y="215"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="16"
                  fontWeight="600"
                >
                  NR321
                </text>
                <text
                  x="175"
                  y="235"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  Capacity: 60
                </text>
              </g>

              {/* Classroom NR322 */}
              <g className="cursor-pointer transition-all hover:opacity-80">
                <rect
                  x="270"
                  y="170"
                  width="150"
                  height="110"
                  fill="rgba(51, 65, 85, 0.3)"
                  stroke="#475569"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x="345"
                  y="215"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="16"
                  fontWeight="600"
                >
                  NR322
                </text>
                <text
                  x="345"
                  y="235"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  Capacity: 80
                </text>
              </g>

              {/* Classroom NR323 */}
              <g className="cursor-pointer transition-all hover:opacity-80">
                <rect
                  x="440"
                  y="170"
                  width="150"
                  height="110"
                  fill="rgba(51, 65, 85, 0.3)"
                  stroke="#475569"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x="515"
                  y="215"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="16"
                  fontWeight="600"
                >
                  NR323
                </text>
                <text
                  x="515"
                  y="235"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  Capacity: 60
                </text>
              </g>

              {/* Lab NR324 */}
              <g className="cursor-pointer transition-all hover:opacity-80">
                <rect
                  x="610"
                  y="170"
                  width="130"
                  height="110"
                  fill="rgba(51, 65, 85, 0.3)"
                  stroke="#475569"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x="675"
                  y="215"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="16"
                  fontWeight="600"
                >
                  NR324
                </text>
                <text
                  x="675"
                  y="235"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  Lab
                </text>
              </g>

              {/* Stairs */}
              <rect
                x="50"
                y="320"
                width="80"
                height="60"
                fill="#334155"
                stroke="#475569"
                strokeWidth="2"
                rx="4"
              />
              <text x="90" y="355" textAnchor="middle" fill="#94a3b8" fontSize="12">
                Stairs
              </text>

              {/* Entrance */}
              <rect
                x="360"
                y="140"
                width="80"
                height="20"
                fill="#334155"
                stroke="#475569"
                strokeWidth="2"
                rx="2"
              />
            </svg>

            {/* Tooltip for NR321 */}
            <div className="absolute left-[175px] top-[100px] rounded-lg border border-indigo-500/50 bg-slate-950/95 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">NR321</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <Users className="h-3 w-3" />
                    <span>Capacity: 60 students</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-400">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-indigo-500 bg-indigo-500/15" />
              <span className="text-sm text-slate-400">Current Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-slate-600 bg-slate-700/30" />
              <span className="text-sm text-slate-400">Classroom</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-slate-600 bg-slate-600" />
              <span className="text-sm text-slate-400">Corridor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
