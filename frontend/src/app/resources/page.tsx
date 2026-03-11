'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Download,
  FileText,
  Video,
  BookOpen,
  FileCode,
  Search,
  Filter,
  Star,
  Eye,
  Upload,
} from 'lucide-react'

const categories = [
  { id: 'all', name: 'All Resources', count: 48 },
  { id: 'notes', name: 'Lecture Notes', count: 18 },
  { id: 'papers', name: 'Past Papers', count: 12 },
  { id: 'videos', name: 'Video Lectures', count: 8 },
  { id: 'assignments', name: 'Assignments', count: 10 },
]

const subjects = [
  { id: 'ml', name: 'Machine Learning' },
  { id: 'dl', name: 'Deep Learning' },
  { id: 'nlp', name: 'Natural Language Processing' },
  { id: 'cv', name: 'Computer Vision' },
  { id: 'rl', name: 'Reinforcement Learning' },
  { id: 'prob', name: 'Probability & Statistics' },
]

const resources = [
  {
    id: 1,
    title: 'Machine Learning - Complete Lecture Notes',
    subject: 'ml',
    category: 'notes',
    code: 'CS60050',
    professor: 'Prof. A. Kumar',
    semester: 'Autumn 2025',
    size: '15.4 MB',
    pages: 248,
    downloads: 1240,
    views: 3420,
    rating: 4.8,
    type: 'PDF',
    featured: true,
  },
  {
    id: 2,
    title: 'Deep Learning Mid-Semester Exam',
    subject: 'dl',
    category: 'papers',
    code: 'CS60045',
    professor: 'Prof. S. Patel',
    semester: 'Spring 2025',
    size: '2.1 MB',
    pages: 8,
    downloads: 890,
    views: 2100,
    rating: 4.9,
    type: 'PDF',
    featured: false,
  },
  {
    id: 3,
    title: 'NLP Transformers Video Series',
    subject: 'nlp',
    category: 'videos',
    code: 'CS60077',
    professor: 'Prof. R. Singh',
    semester: 'Autumn 2025',
    size: '1.2 GB',
    pages: null,
    downloads: 560,
    views: 1800,
    rating: 4.7,
    type: 'Video',
    featured: true,
  },
  {
    id: 4,
    title: 'Computer Vision Assignment Solutions',
    subject: 'cv',
    category: 'assignments',
    code: 'CS60040',
    professor: 'Prof. M. Sharma',
    semester: 'Spring 2025',
    size: '8.7 MB',
    pages: 45,
    downloads: 720,
    views: 1950,
    rating: 4.6,
    type: 'PDF',
    featured: false,
  },
  {
    id: 5,
    title: 'Probability Theory Complete Notes',
    subject: 'prob',
    category: 'notes',
    code: 'MA61027',
    professor: 'Prof. V. Gupta',
    semester: 'Autumn 2025',
    size: '12.3 MB',
    pages: 180,
    downloads: 1450,
    views: 4200,
    rating: 4.9,
    type: 'PDF',
    featured: true,
  },
  {
    id: 6,
    title: 'Reinforcement Learning End-Sem Paper',
    subject: 'rl',
    category: 'papers',
    code: 'CS61008',
    professor: 'Prof. N. Reddy',
    semester: 'Spring 2024',
    size: '1.8 MB',
    pages: 6,
    downloads: 340,
    views: 890,
    rating: 4.5,
    type: 'PDF',
    featured: false,
  },
  {
    id: 7,
    title: 'ML Algorithms Implementation Guide',
    subject: 'ml',
    category: 'assignments',
    code: 'CS60050',
    professor: 'Prof. A. Kumar',
    semester: 'Autumn 2025',
    size: '5.2 MB',
    pages: 67,
    downloads: 980,
    views: 2340,
    rating: 4.7,
    type: 'Jupyter',
    featured: false,
  },
  {
    id: 8,
    title: 'Deep Learning CNN Architectures',
    subject: 'dl',
    category: 'notes',
    code: 'CS60045',
    professor: 'Prof. S. Patel',
    semester: 'Spring 2025',
    size: '18.9 MB',
    pages: 156,
    downloads: 1120,
    views: 3100,
    rating: 4.8,
    type: 'PDF',
    featured: true,
  },
]

const getIconForType = (type: string) => {
  switch (type) {
    case 'Video':
      return Video
    case 'Jupyter':
      return FileCode
    default:
      return FileText
  }
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === 'all' || resource.category === activeCategory
    const matchesSubject =
      !selectedSubject || resource.subject === selectedSubject
    const matchesSearch =
      searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.code.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSubject && matchesSearch
  })

  const featuredResources = resources.filter((r) => r.featured)

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="mb-4 font-bold tracking-[-0.02em]"
            style={{ fontSize: '3rem' }}
          >
            Academic Resources
          </h1>
          <p className="text-lg text-slate-400">
            Comprehensive collection of lecture notes, past papers, assignments,
            and video lectures
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources by title or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-600"
            >
              <Upload className="h-4 w-4" />
              Contribute
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Featured Resources */}
        {activeCategory === 'all' && !selectedSubject && searchQuery === '' && (
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="font-semibold text-xl">Featured Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredResources.map((resource) => {
                const Icon = getIconForType(resource.type)
                return (
                  <div
                    key={resource.id}
                    className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-[inset_0_0_30px_rgba(99,102,241,0.03)] transition-all hover:border-indigo-500/50"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                        <Icon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400">
                        Featured
                      </span>
                    </div>
                    <h3 className="mb-2 font-medium text-sm leading-snug line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="mb-3 text-xs text-slate-500">
                      {resource.code} • {resource.semester}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {resource.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {resource.rating}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="mb-4 px-3 text-sm font-semibold text-slate-400">
                CATEGORIES
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      activeCategory === category.id
                        ? 'border-l-2 border-indigo-500 bg-indigo-500/10 text-slate-200'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-xs text-slate-500">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="mb-4 px-3 text-sm font-semibold text-slate-400">
                SUBJECTS
              </h3>
              <div className="space-y-1">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() =>
                      setSelectedSubject(
                        selectedSubject === subject.id ? null : subject.id
                      )
                    }
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      selectedSubject === subject.id
                        ? 'bg-slate-800 text-slate-200'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing {filteredResources.length} resources
              </p>
            </div>

            {/* Resources List */}
            <div className="space-y-3">
              {filteredResources.map((resource) => {
                const Icon = getIconForType(resource.type)
                return (
                  <div
                    key={resource.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                        <Icon className="h-6 w-6 text-indigo-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-slate-200">
                              {resource.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                              <span className="font-mono text-indigo-400">
                                {resource.code}
                              </span>
                              <span>•</span>
                              <span>{resource.professor}</span>
                              <span>•</span>
                              <span>{resource.semester}</span>
                            </div>
                          </div>
                          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-indigo-500 hover:bg-slate-800 hover:text-indigo-400">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {resource.pages
                                ? `${resource.pages} pages`
                                : resource.size}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            <span>{resource.downloads} downloads</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{resource.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-slate-400">
                              {resource.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
