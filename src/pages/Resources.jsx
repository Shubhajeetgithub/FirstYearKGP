import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Library, ExternalLink, Search, X, Sparkles, BookOpen } from 'lucide-react';
import { loadSemesterData } from '../data/loadSemesterData';
import { searchSubjects } from '../utils/search';

function Resources() {
  const [openSemester, setOpenSemester] = useState('s1'); // default to s1
  const [semesterData, setSemesterData] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSemesterData()
      .then(setSemesterData)
      .catch((err) => {
        console.error('Failed to load resources:', err);
        setError(err);
      });
  }, [attempt]);

  // At least 3 results (fuzzy fallback), plus every other strong match up to 12
  const searchResults = useMemo(() => {
    if (!semesterData || !searchQuery.trim()) return [];
    return searchSubjects(searchQuery, semesterData, 12, { minResults: 3 });
  }, [semesterData, searchQuery]);

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

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 space-y-4 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-2 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Library className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Academic Resources</h1>
        <p className="text-slate-400 max-w-xl text-lg">Comprehensive study materials, textbooks, and notes for the Artificial Intelligence curriculum.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10 w-full px-2">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-70 group-focus-within:opacity-100 transition duration-300"></div>
          <div className="relative flex items-center bg-[#0d0d14]/90 backdrop-blur-xl border border-white/10 group-focus-within:border-indigo-500/50 rounded-2xl px-4 py-3 shadow-xl transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject name, ID (e.g. AI20203), or initials (e.g. RL, DAA)..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm md:text-base outline-none focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isSearching && (
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Best matches ordered by relevance (Levenshtein distance)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Search Results Mode */}
      {isSearching ? (
        <div className="w-full max-w-4xl mx-auto min-h-[400px]">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span>Matches for</span>
                  <span className="text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 font-mono text-sm">
                    "{searchQuery}"
                  </span>
                </h2>
                <span className="text-xs text-slate-400">
                  {searchResults.length} {searchResults.length === 1 ? 'subject found' : 'subjects found'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((subject, index) => (
                  <SubjectCard
                    key={`${subject.id}-${index}`}
                    subject={subject}
                    showSemesterBadge={true}
                    rank={index + 1}
                    onNavigateSemester={(sem) => {
                      if (sem) {
                        setOpenSemester(sem);
                        setSearchQuery('');
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white/5 border border-white/5 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300">No matching subjects found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                We couldn't find any subjects matching "{searchQuery}". Try searching with a different subject name or course code.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-slate-200 transition-colors"
              >
                View all semesters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Regular Semester Mode */
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
             {[6, 7, 8].filter((semNum) => !semesterData[`s${semNum}`]).map((semNum) => (
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
      )}
    </div>
  );
}

function SubjectCard({ subject, showSemesterBadge = false, rank = null, onNavigateSemester = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const count = subject.resources ? subject.resources.length : 0;

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
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-slate-800 relative">
             {subject.image ? (
               <img src={subject.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                 <BookOpen className="w-6 h-6" />
               </div>
             )}
             {rank && (
               <span className="absolute top-1 left-1 bg-indigo-600/90 text-[10px] font-bold px-1.5 py-0.5 rounded shadow text-white">
                 #{rank}
               </span>
             )}
          </div>

          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 flex-wrap mb-1">
               {subject.id && (
                 <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                   {subject.id}
                 </span>
               )}
               {showSemesterBadge && subject.semesterName && (
                 <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                   {subject.semesterName}
                 </span>
               )}
             </div>
             <h3 className="text-lg font-bold text-slate-200 truncate" title={subject.name}>{subject.name}</h3>
             <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
               <span>
                 {count} {count === 1 ? 'resource' : 'resources'}
               </span>
               {showSemesterBadge && subject.semester && onNavigateSemester && (
                 <span
                   onClick={(e) => {
                     e.stopPropagation();
                     onNavigateSemester(subject.semester);
                   }}
                   className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                 >
                   View in semester →
                 </span>
               )}
             </div>
          </div>

          <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors ${isOpen ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-indigo-300'}`}>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
       </button>

       {/* Dropdown resources */}
       <div
         className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
       >
         <div className="overflow-hidden">
           <div className="px-5 pb-5 grid grid-cols-1 gap-2">
             {subject.resources && subject.resources.length > 0 ? (
               subject.resources.map((res, idx) => {
                 const IconComponent = res.icon || ExternalLink;
                 return (
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
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-300 group-hover/link:text-white truncate">
                          {res.name}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover/link:text-indigo-400 flex-shrink-0 transition-colors pointer-events-none" />
                   </a>
                 );
               })
             ) : (
               <p className="text-xs text-slate-500 italic py-2">No resources listed for this subject yet.</p>
             )}
           </div>
         </div>
       </div>
    </div>
  );
}

export default Resources;
