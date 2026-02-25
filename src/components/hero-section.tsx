import Link from 'next/link'
import { ArrowRight, GitFork } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative px-6 pt-32 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="mb-6 font-bold tracking-[-0.02em]" style={{ fontSize: '3.75rem', lineHeight: '1.1' }}>
              The Knowledge Base for AI at IIT KGP.
            </h1>
            <p className="mb-8 text-lg text-slate-400 leading-relaxed">
              Curated academic resources, past year papers, and roadmaps. Built
              and maintained by the students.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/resources"
                className="group inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-all hover:bg-indigo-600"
              >
                Browse Resources
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-transparent px-6 py-3 font-medium text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-900"
              >
                <GitFork className="h-4 w-4" />
                Contribute
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="relative h-[500px] w-full">
              {/* Mesh Gradient Background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 blur-3xl" />

              {/* Geometric Shapes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Large Circle */}
                <div className="absolute h-64 w-64 rounded-full border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-violet-600/10 shadow-[inset_0_0_60px_rgba(99,102,241,0.1)]" />

                {/* Medium Circle */}
                <div className="absolute right-12 top-12 h-40 w-40 rounded-full border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-purple-600/10 shadow-[inset_0_0_40px_rgba(139,92,246,0.1)]" />

                {/* Small Circle */}
                <div className="absolute bottom-20 left-12 h-32 w-32 rounded-full border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 shadow-[inset_0_0_30px_rgba(168,85,247,0.1)]" />

                {/* Connecting Lines */}
                <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="75%"
                    y2="20%"
                    stroke="rgba(99,102,241,0.2)"
                    strokeWidth="2"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="25%"
                    y2="70%"
                    stroke="rgba(139,92,246,0.2)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
    </section>
  )
}
