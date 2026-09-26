import React, { useEffect, useState } from 'react';
import { ChevronDown, Library, ExternalLink } from 'lucide-react';
import { loadSemesterData } from '../data/loadSemesterData';

function Resources() {
  const [openSemester, setOpenSemester] = useState('s1'); // default to s1
  const [semesterData, setSemesterData] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    loadSemesterData()
      .then(setSemesterData)
      .catch((err) => {
        console.error('Failed to load resources:', err);
        setError(err);
      });
  }, [attempt]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-slate-300 font-medium">Couldn't load resources right now.</p>
          <button
            onClick={() => { setError(null); setAttempt((n) => n + 1); }}
            className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!semesterData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-medium tracking-widest text-sm uppercase">Loading Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col items-center mb-12 space-y-4 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-2 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Library className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Academic Resources</h1>
        <p className="text-slate-400 max-w-xl text-lg">Comprehensive study materials, textbooks, and notes for the Artificial Intelligence curriculum.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar lg:sticky lg:top-32 z-20">
          {Object.keys(semesterData).map((semKey) => (
             <button
              key={semKey}
              onClick={() => setOpenSemester(semKey)}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left border ${
                openSemester === semKey 
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
             >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  openSemester === semKey ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {semKey.substring(1)}
                </div>
                <span className="font-medium whitespace-nowrap">Semester {semKey.substring(1)}</span>
             </button>
          ))}
          {/* Coming Soon Placeholders */}
           {[4, 5, 6, 7, 8].filter((semNum) => !semesterData[`s${semNum}`]).map((semNum) => (
              <button
              key={`s${semNum}`}
              disabled
              className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 bg-white/5 opacity-50 cursor-not-allowed text-slate-500"
             >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-white/5">
                  {semNum}
                </div>
                <span className="font-medium whitespace-nowrap">Semester {semNum}</span>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-h-[500px]">
          {/* Only the active semester is mounted, so hidden semesters can't stretch the page. */}
          {semesterData[openSemester] && (
            <div
              key={openSemester}
              className="animate-fade-up"
            >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {semesterData[openSemester].subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function SubjectCard({ subject }) {
  const [isOpen, setIsOpen] = useState(false);
  const count = subject.resources.length;

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
       {/* Background styling */}
       <div className={`absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border rounded-2xl z-0 transition-colors ${isOpen ? 'border-indigo-500/40' : 'border-white/10 group-hover:border-indigo-500/30'}`}></div>

       {/* Whole header toggles the card */}
       <button
         type="button"
         onClick={() => setIsOpen(!isOpen)}
         aria-expanded={isOpen}
         className="relative z-10 w-full p-5 flex items-center gap-4 text-left rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
       >
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-slate-800">
             <img src={subject.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>

          <div className="flex-1 min-w-0">
             <h3 className="text-lg font-bold text-slate-200 truncate" title={subject.name}>{subject.name}</h3>
             <p className="mt-1 text-sm text-slate-400">
               {count} {count === 1 ? 'resource' : 'resources'}
             </p>
          </div>

          <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors ${isOpen ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-indigo-300'}`}>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
       </button>

       {/* Dropdown resources: grid-rows 0fr -> 1fr animates to the content's real height */}
       <div
         className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
       >
         <div className="overflow-hidden">
           <div className="px-5 pb-5 grid grid-cols-1 gap-2">
             {subject.resources.map((res, idx) => (
               <a
                 key={idx}
                 href={res.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 tabIndex={isOpen ? 0 : -1}
                 className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors group/link"
               >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                      <res.icon className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium text-slate-300 group-hover/link:text-white truncate">
                      {res.name}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover/link:text-indigo-400 flex-shrink-0 transition-colors pointer-events-none" />
               </a>
             ))}
           </div>
         </div>
       </div>
    </div>
  )
}

export default Resources;