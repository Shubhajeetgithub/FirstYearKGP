'use client'

import { useState } from 'react'
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

const classes = [
  {
    id: 1,
    subject: 'Machine Learning',
    code: 'CS60050',
    type: 'Lecture',
    professor: 'Prof. A. Kumar',
    room: 'NR321',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'indigo',
  },
  {
    id: 2,
    subject: 'Deep Learning',
    code: 'CS60045',
    type: 'Tutorial',
    professor: 'Prof. S. Patel',
    room: 'NR223',
    day: 'Monday',
    startTime: '14:00',
    endTime: '15:00',
    color: 'violet',
  },
  {
    id: 3,
    subject: 'Probability & Statistics',
    code: 'MA61027',
    type: 'Lecture',
    professor: 'Prof. V. Gupta',
    room: 'NR121',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '11:00',
    color: 'purple',
  },
  {
    id: 4,
    subject: 'Machine Learning',
    code: 'CS60050',
    type: 'Lab',
    professor: 'Prof. A. Kumar',
    room: 'CC105',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '17:00',
    color: 'indigo',
  },
  {
    id: 5,
    subject: 'Natural Language Processing',
    code: 'CS60077',
    type: 'Lecture',
    professor: 'Prof. R. Singh',
    room: 'NR222',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'blue',
  },
  {
    id: 6,
    subject: 'Computer Vision',
    code: 'CS60040',
    type: 'Lecture',
    professor: 'Prof. M. Sharma',
    room: 'NR321',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '12:00',
    color: 'cyan',
  },
  {
    id: 7,
    subject: 'Deep Learning',
    code: 'CS60045',
    type: 'Lecture',
    professor: 'Prof. S. Patel',
    room: 'NR223',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '11:00',
    color: 'violet',
  },
  {
    id: 8,
    subject: 'Reinforcement Learning',
    code: 'CS61008',
    type: 'Lecture',
    professor: 'Prof. N. Reddy',
    room: 'NR121',
    day: 'Thursday',
    startTime: '15:00',
    endTime: '16:00',
    color: 'pink',
  },
  {
    id: 9,
    subject: 'Probability & Statistics',
    code: 'MA61027',
    type: 'Tutorial',
    professor: 'Prof. V. Gupta',
    room: 'NR121',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:00',
    color: 'purple',
  },
  {
    id: 10,
    subject: 'Computer Vision',
    code: 'CS60040',
    type: 'Lab',
    professor: 'Prof. M. Sharma',
    room: 'CC107',
    day: 'Friday',
    startTime: '14:00',
    endTime: '17:00',
    color: 'cyan',
  },
]

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300',
  violet: 'bg-violet-500/15 border-violet-500/50 text-violet-300',
  purple: 'bg-purple-500/15 border-purple-500/50 text-purple-300',
  blue: 'bg-blue-500/15 border-blue-500/50 text-blue-300',
  cyan: 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300',
  pink: 'bg-pink-500/15 border-pink-500/50 text-pink-300',
}

// Fixed version with proper bounds checking
const getClassPosition = (startTime: string, endTime: string) => {
  const startHour = parseInt(startTime.split(':')[0], 10)
  const endHour = parseInt(endTime.split(':')[0], 10)

  // Find the start index with validation
  const startIndex = timeSlots.findIndex((time) =>
    time.startsWith(startHour.toString().padStart(2, '0'))
  )

  // If time not found, return default values
  if (startIndex === -1) {
    return { top: 0, height: 1 }
  }

  // Calculate duration in hours
  const durationHours = Math.max(1, endHour - startHour)

  return { top: startIndex, height: durationHours }
}

export default function TimetablePage() {
  const [currentWeek, setCurrentWeek] = useState('Week 12 • Feb 3 - Feb 9, 2026')
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week')

  const upcomingClasses = [...classes]
    .sort((a, b) => {
      const dayOrder = days.indexOf(a.day) - days.indexOf(b.day)
      if (dayOrder !== 0) return dayOrder
      return a.startTime.localeCompare(b.startTime)
    })
    .slice(0, 5)

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className="mb-2 font-bold tracking-[-0.02em]"
              style={{ fontSize: '3rem' }}
            >
              Class Timetable
            </h1>
            <p className="text-lg text-slate-400">
              Your weekly class schedule at a glance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('week')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-indigo-500 text-white'
                  : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-500 text-white'
                  : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Week Selector */}
        <div className="mb-8 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold">{currentWeek}</span>
          </div>
          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {viewMode === 'week' ? (
          <>
            {/* Timetable Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[900px] rounded-2xl border border-slate-800 bg-slate-900/50">
                {/* Header */}
                <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/50">
                  <div className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Time
                  </div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="border-l border-slate-800 p-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="relative">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="grid grid-cols-7 border-b border-slate-800 last:border-b-0"
                      style={{ minHeight: '80px' }}
                    >
                      <div className="flex items-start p-4 text-sm text-slate-500">
                        {time}
                      </div>
                      {days.map((day) => (
                        <div
                          key={`${day}-${time}`}
                          className="relative border-l border-slate-800 p-2"
                        >
                          {classes
                            .filter(
                              (cls) =>
                                cls.day === day && cls.startTime === time
                            )
                            .map((cls) => {
                              const pos = getClassPosition(
                                cls.startTime,
                                cls.endTime
                              )
                              return (
                                <div
                                  key={cls.id}
                                  className={`group absolute left-2 right-2 cursor-pointer rounded-lg border p-3 transition-all hover:scale-105 hover:shadow-lg ${
                                    colorMap[cls.color]
                                  }`}
                                  style={{
                                    height: `${pos.height * 80 - 8}px`,
                                  }}
                                >
                                  <div className="mb-1 text-xs font-semibold uppercase">
                                    {cls.type}
                                  </div>
                                  <div className="mb-1 text-sm font-bold leading-tight">
                                    {cls.subject}
                                  </div>
                                  <div className="text-xs opacity-90">
                                    {cls.code}
                                  </div>
                                  <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
                                    <MapPin className="h-3 w-3" />
                                    {cls.room}
                                  </div>
                                  <div className="mt-1 text-xs opacity-70">
                                    {cls.startTime} - {cls.endTime}
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <span className="text-sm font-medium text-slate-400">
                Color Legend:
              </span>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-indigo-500/50" />
                <span className="text-sm text-slate-400">Core Subjects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-violet-500/50" />
                <span className="text-sm text-slate-400">Electives</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-cyan-500/50" />
                <span className="text-sm text-slate-400">Lab Sessions</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* List View */}
            <div className="space-y-6">
              {/* Today's Classes */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">Today's Classes</h2>
                <div className="space-y-3">
                  {upcomingClasses.slice(0, 3).map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-slate-700"
                    >
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                        <span className="text-xs text-slate-400">{cls.startTime}</span>
                        <span className="text-xs text-slate-500">to</span>
                        <span className="text-xs text-slate-400">{cls.endTime}</span>
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{cls.subject}</h3>
                          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">
                            {cls.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <span className="font-mono text-indigo-400">{cls.code}</span>
                          <span>•</span>
                          <span>{cls.professor}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {cls.room}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>{cls.day}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Classes */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">All Classes This Week</h2>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="grid grid-cols-12 gap-4 p-5 transition-colors hover:bg-slate-800/30"
                      >
                        <div className="col-span-3">
                          <div className="font-semibold text-slate-200">
                            {cls.subject}
                          </div>
                          <div className="mt-1 text-sm text-slate-400">
                            {cls.code}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium">
                            {cls.type}
                          </span>
                        </div>
                        <div className="col-span-2 text-sm text-slate-400">
                          {cls.professor}
                        </div>
                        <div className="col-span-2 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {cls.room}
                          </div>
                        </div>
                        <div className="col-span-2 text-sm text-slate-400">
                          {cls.day}
                        </div>
                        <div className="col-span-1 text-sm font-medium text-indigo-400">
                          {cls.startTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Total Classes</div>
            <div className="mt-2 text-2xl font-bold">32</div>
            <div className="mt-1 text-xs text-slate-500">per week</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Lab Sessions</div>
            <div className="mt-2 text-2xl font-bold">6</div>
            <div className="mt-1 text-xs text-slate-500">per week</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Contact Hours</div>
            <div className="mt-2 text-2xl font-bold">28</div>
            <div className="mt-1 text-xs text-slate-500">per week</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-sm text-slate-400">Free Slots</div>
            <div className="mt-2 text-2xl font-bold">18</div>
            <div className="mt-1 text-xs text-slate-500">per week</div>
          </div>
        </div>
      </div>
    </main>
  )
}
