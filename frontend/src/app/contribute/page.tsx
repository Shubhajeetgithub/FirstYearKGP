'use client'

import { useState, useRef } from 'react'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
  GitFork,
  Users,
  Award,
} from 'lucide-react'

const topContributors = [
  { name: 'Aarav Sharma', contributions: 24, rank: 1 },
  { name: 'Priya Patel', contributions: 18, rank: 2 },
  { name: 'Rahul Kumar', contributions: 15, rank: 3 },
  { name: 'Ananya Singh', contributions: 12, rank: 4 },
  { name: 'Vikram Reddy', contributions: 10, rank: 5 },
]

const guidelines = [
  {
    title: 'Quality Standards',
    items: [
      'Ensure materials are clear and legible',
      'Use descriptive file names',
      'Include proper metadata (course, semester, year)',
      'Scan documents at minimum 300 DPI',
    ],
  },
  {
    title: 'Content Types',
    items: [
      'Lecture notes and slides',
      'Past year question papers',
      'Tutorial solutions',
      'Reference books and materials',
    ],
  },
  {
    title: 'Copyright Notice',
    items: [
      'Only upload materials you have permission to share',
      'Credit original authors when applicable',
      'Do not upload copyrighted textbooks without permission',
      'Respect intellectual property rights',
    ],
  },
]

export default function ContributePage() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'uploading'>(
    'idle'
  )
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    courseName: '',
    resourceType: '',
    semester: '',
    year: '',
    professor: '',
    description: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setUploadStatus('error')
        setTimeout(() => setUploadStatus('idle'), 5000)
        return
      }
      setFileName(file.name)
      setUploadStatus('idle')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-indigo-500/50', 'bg-indigo-500/5')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-indigo-500/50', 'bg-indigo-500/5')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-indigo-500/50', 'bg-indigo-500/5')
    const files = e.dataTransfer.files
    if (files && fileInputRef.current) {
      fileInputRef.current.files = files
      handleFileChange({ target: { files } } as any)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (
      !formData.title ||
      !formData.courseCode ||
      !formData.courseName ||
      !formData.resourceType ||
      !formData.semester ||
      !fileName
    ) {
      setUploadStatus('error')
      setTimeout(() => setUploadStatus('idle'), 5000)
      return
    }

    // Simulate upload
    setUploadStatus('uploading')
    setTimeout(() => {
      setUploadStatus('success')
      // Reset form after success
      setFormData({
        title: '',
        courseCode: '',
        courseName: '',
        resourceType: '',
        semester: '',
        year: '',
        professor: '',
        description: '',
      })
      setFileName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      // Clear success message after 5 seconds
      setTimeout(() => setUploadStatus('idle'), 5000)
    }, 1500)
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <GitFork className="h-4 w-4" />
            Community Contribution
          </div>
          <h1
            className="mb-4 font-bold tracking-[-0.02em]"
            style={{ fontSize: '3rem' }}
          >
            Share Your Knowledge
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Help fellow students by contributing your study materials, notes, and
            resources to our growing collection
          </p>
        </div>

        {/* Stats Banner */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-indigo-400">248</div>
            <div className="text-sm text-slate-400">Total Contributions</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-violet-400">89</div>
            <div className="text-sm text-slate-400">Active Contributors</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-400">4.8</div>
            <div className="text-sm text-slate-400">Average Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <h2 className="mb-6 text-2xl font-semibold">
                Upload Study Material
              </h2>

              {uploadStatus === 'success' && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                  <div>
                    <div className="font-medium text-green-400">
                      Upload Successful!
                    </div>
                    <div className="mt-1 text-sm text-green-300/80">
                      Your contribution is under review and will be published
                      shortly.
                    </div>
                  </div>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                  <div>
                    <div className="font-medium text-red-400">Upload Failed</div>
                    <div className="mt-1 text-sm text-red-300/80">
                      Please check your file and try again.
                    </div>
                  </div>
                </div>
              )}

              {uploadStatus === 'uploading' && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                  <div className="h-5 w-5 flex-shrink-0">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-400">Uploading...</div>
                    <div className="mt-1 text-sm text-blue-300/80">
                      Please wait while your file is being uploaded.
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Machine Learning Complete Lecture Notes"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                {/* Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      value={formData.courseCode}
                      onChange={(e) =>
                        setFormData({ ...formData, courseCode: e.target.value })
                      }
                      placeholder="e.g., CS60050"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      value={formData.courseName}
                      onChange={(e) =>
                        setFormData({ ...formData, courseName: e.target.value })
                      }
                      placeholder="e.g., Machine Learning"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Resource Type and Semester */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Resource Type *
                    </label>
                    <select
                      value={formData.resourceType}
                      onChange={(e) =>
                        setFormData({ ...formData, resourceType: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="notes">Lecture Notes</option>
                      <option value="papers">Past Year Papers</option>
                      <option value="assignments">Assignments</option>
                      <option value="solutions">Tutorial Solutions</option>
                      <option value="books">Reference Books</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Semester *
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({ ...formData, semester: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    >
                      <option value="">Select semester</option>
                      <option value="autumn-2025">Autumn 2025</option>
                      <option value="spring-2025">Spring 2025</option>
                      <option value="autumn-2024">Autumn 2024</option>
                      <option value="spring-2024">Spring 2024</option>
                    </select>
                  </div>
                </div>

                {/* Professor */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Professor Name
                  </label>
                  <input
                    type="text"
                    value={formData.professor}
                    onChange={(e) =>
                      setFormData({ ...formData, professor: e.target.value })
                    }
                    placeholder="e.g., Prof. A. Kumar"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide a brief description of the content..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* File Upload with Drag & Drop */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Upload File * {fileName && <span className="text-indigo-400">({fileName})</span>}
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border-2 border-dashed border-slate-800 bg-slate-950/50 p-8 text-center transition-colors hover:border-indigo-500/50 cursor-pointer"
                  >
                    <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                    <div className="mb-2 text-sm font-medium text-slate-300">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-slate-500">
                      PDF, DOC, DOCX, JPG, PNG up to 50MB
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploadStatus === 'uploading'}
                  className="w-full rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-all hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Submit Contribution'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Guidelines */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-400" />
                <h3 className="font-semibold">Contribution Guidelines</h3>
              </div>
              <div className="space-y-4">
                {guidelines.map((section, index) => (
                  <div key={index}>
                    <div className="mb-2 text-sm font-semibold text-slate-300">
                      {section.title}
                    </div>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <a
                  href="/guidelines/Guidelines.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  View Full Guidelines
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {topContributors.map((contributor) => (
                  <div
                    key={contributor.rank}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          contributor.rank === 1
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : contributor.rank === 2
                            ? 'bg-slate-500/20 text-slate-400'
                            : contributor.rank === 3
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {contributor.rank}
                      </div>
                      <span className="text-sm font-medium">
                        {contributor.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {contributor.contributions}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
