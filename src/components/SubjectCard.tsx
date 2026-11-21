import { useState } from 'react';
import { BookOpen, ChevronDown, Download, ExternalLink, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ResourceIcon, SemesterKey, Subject } from '../types/semester';

/** Icon names come from the sheet as strings (islands only take serialisable props). */
const RESOURCE_ICON_COMPONENTS: Record<ResourceIcon, LucideIcon> = {
  book: BookOpen,
  file: FileText,
  download: Download,
};

interface SubjectCardProps {
  subject: Subject;
  /** Show the semester name and a "View in semester" link (search results). */
  showSemesterBadge?: boolean;
  /** 1-based position in the search results. */
  rank?: number | null;
  onNavigateSemester?: ((semester: SemesterKey) => void) | null;
}

export default function SubjectCard({ subject, showSemesterBadge = false, rank = null, onNavigateSemester = null }: SubjectCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
                 const IconComponent = RESOURCE_ICON_COMPONENTS[res.icon];
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

       {/* Footer actions live outside the toggle button: no nested interactive content. */}
       {showSemesterBadge && subject.semester && onNavigateSemester && (
         <div className="relative z-10 px-5 pb-4 -mt-2 flex justify-end">
           <button
             type="button"
             onClick={() => onNavigateSemester(subject.semester)}
             className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline rounded outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
           >
             View in semester →
           </button>
         </div>
       )}
    </div>
  );
}
