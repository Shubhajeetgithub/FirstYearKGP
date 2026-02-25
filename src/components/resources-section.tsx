'use client'

import { useState } from 'react'
import { Download, FileText } from 'lucide-react'

const semesters = [
  { id: 'sem1', name: 'Semester 1' },
  { id: 'sem2', name: 'Semester 2' },
  { id: 'electives', name: 'Electives' },
  { id: 'labs', name: 'Labs' },
]

const resources = [
  {
    code: 'CS60050',
    name: 'Machine Learning',
    type: 'Lecture Notes (PDF)',
    semester: 'sem1',
  },
  {
    code: 'CS60045',
    name: 'Deep Learning',
    type: 'Problem Sets',
    semester: 'sem1',
  },
  {
    code: 'CS60077',
    name: 'Natural Language Processing',
    type: 'Past Year Papers',
    semester: 'sem2',
  },
  {
    code: 'MA61027',
    name: 'Probability & Statistics',
    type: 'Tutorial Solutions',
    semester: 'sem1',
  },
  {
    code: 'CS60040',
    name: 'Computer Vision',
    type: 'Lecture Notes (PDF)',
    semester: 'sem2',
  },
  {
    code: 'CS61008',
    name: 'Reinforcement Learning',
    type: 'Research Papers',
    semester: 'electives',
  },
]

export function ResourcesSection() {
  const [activeSemester, setActiveSemester] = useState('sem1')

  const filteredResources = resources.filter(
    (resource) => resource.semester === activeSemester
  )

  return (
    <section id="resources" className="px-6 py-24 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h2 className="mb-3 font-bold tracking-[-0.02em]" style={{ fontSize: '2.5rem' }}>
            Academic Resources
          </h2>
          <p className="text-lg text-slate-400">
            Access curated study materials, lecture notes, and past papers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="mb-4 px-3 text-sm font-semibold text-slate-400">
                FILTER BY
              </h3>
              <div className="space-y-1">
                {semesters.map((semester) => (
                  <button
                    key={semester.id}
                    onClick={() => setActiveSemester(semester.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      activeSemester === semester.id
                        ? 'border-l-2 border-indigo-500 bg-indigo-500/10 text-slate-200'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    {semester.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-slate-800 bg-slate-950/50 px-6 py-4">
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Code
                </div>
                <div className="col-span-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Subject Name
                </div>
                <div className="col-span-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Resource Type
                </div>
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-800">
                {filteredResources.map((resource, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-slate-800/30"
                  >
                    <div className="col-span-2 flex items-center">
                      <span className="font-mono text-sm font-medium text-indigo-400">
                        {resource.code}
                      </span>
                    </div>
                    <div className="col-span-4 flex items-center">
                      <span className="text-sm font-medium text-slate-200">
                        {resource.name}
                      </span>
                    </div>
                    <div className="col-span-4 flex items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-400">
                          {resource.type}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
