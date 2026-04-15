import React, { useEffect, useState } from 'react';
import { ChevronDown, Library, ExternalLink } from 'lucide-react';

function Resources() {
  const [openSemester, setOpenSemester] = useState('s1'); // default to s1
  const [semesterData, setSemesterData] = useState(null);

  // lazy loading
  useEffect(() => {
    const loadData = async () => {
      const { semesterData } = await import('../data/semester');
      setSemesterData(semesterData);
    };
    loadData();
  }, []);

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
           {[4, 5, 6, 7, 8].map((semNum) => (
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
        <div className="flex-1 w-full relative min-h-[500px]">
          {Object.entries(semesterData).map(([semKey, semData]) => (
            <div 
              key={semKey} 
              className={`transition-all duration-500 absolute inset-0 ${openSemester === semKey ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 translate-y-8 pointer-events-none absolute z-0'}`}
            >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {semData.subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
               </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function SubjectCard({ subject }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
       {/* Background styling */}
       <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl z-0 transition-colors group-hover:border-indigo-500/30"></div>
       
       <div className="relative z-10 p-5 flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-slate-800">
             <img src={subject.image} alt={subject.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          
          <div className="flex-1 min-w-0">
             <h3 className="text-lg font-bold text-slate-200 truncate pr-8" title={subject.name}>{subject.name}</h3>
             
             <button 
               onClick={() => setIsOpen(!isOpen)}
               className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center transition-colors outline-none"
             >
                {isOpen ? 'Hide Resources' : 'View Resources'}
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
             </button>
          </div>
       </div>

       {/* Dropdown resources */}
       <div 
         className={`relative z-10 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
       >
         <div className="px-5 pb-5 pt-2 grid grid-cols-1 gap-2">
           {subject.resources.map((res, idx) => (
             <a
               key={idx}
               href={res.url}
               target="_blank"
               rel="noopener noreferrer"
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
  )
}

export default Resources;