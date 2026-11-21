import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import SubjectCard from './SubjectCard';
import { searchSubjects } from '../utils/search';
import { refreshSemesterData } from '../lib/sheet';
import { semesterPageTitle } from '../config/site';
import type { SemesterData, SemesterKey } from '../types/semester';

export interface ResourcesExplorerProps {
  /** Build-time sheet data, rendered into the HTML. */
  data: SemesterData;
  /** Semester shown first: the route's semester, or the first one on /resources. */
  initialSemester: SemesterKey;
  /** When `data` was fetched; a browser cache newer than this is shown instead. */
  builtAt: number;
  /** Public CSV URL for the background refresh. Without it the build-time data stays. */
  sheetUrl?: string;
}

/** Semesters shown as disabled placeholders until the sheet has them. */
const PLACEHOLDER_SEMESTERS = [6, 7, 8];

const semesterPath = (sem: SemesterKey): string => `/resources/${sem}`;

/** The semester a /resources/sN path points at, if it is one we have. */
function semesterFromPath(pathname: string, data: SemesterData): SemesterKey | null {
  const match = /^\/resources\/(s[^/]+)\/?$/i.exec(pathname);
  const sem = match?.[1].toLowerCase();
  return sem && data[sem] ? sem : null;
}

/** Writes `q` into the current URL's query string without adding a history entry. */
function replaceQueryParam(q: string): void {
  const url = new URL(window.location.href);
  if (q.trim()) url.searchParams.set('q', q);
  else url.searchParams.delete('q');
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
}

function isPlainLeftClick(e: React.MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

export default function ResourcesExplorer({ data, initialSemester, builtAt, sheetUrl }: ResourcesExplorerProps) {
  const [semesterData, setSemesterData] = useState<SemesterData>(data);
  const [openSemester, setOpenSemester] = useState<SemesterKey>(initialSemester);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInput = useRef<HTMLInputElement | null>(null);
  const semesterNav = useRef<HTMLElement | null>(null);

  // Background refresh: show sheet edits made after the build without waiting for a rebuild.
  useEffect(
    () => refreshSemesterData({ url: sheetUrl, builtAt, onUpdate: setSemesterData }),
    [sheetUrl, builtAt]
  );

  // Read ?q= once on mount (the server render has no query string), and follow back/forward.
  useEffect(() => {
    const syncFromLocation = () => {
      setSearchQuery(new URLSearchParams(window.location.search).get('q') ?? '');
      const sem = semesterFromPath(window.location.pathname, data);
      if (sem) setOpenSemester(sem);
    };
    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, [data]);

  // On phones the semester list scrolls sideways: bring the current one into view on load.
  useEffect(() => {
    const nav = semesterNav.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (nav && active && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
    }
  }, []);

  const updateQuery = (q: string) => {
    setSearchQuery(q);
    replaceQueryParam(q);
  };

  const navigateToSemester = (sem: SemesterKey) => {
    setOpenSemester(sem);
    setSearchQuery('');
    const target = semesterPath(sem);
    if (window.location.pathname !== target || window.location.search) {
      window.history.pushState(null, '', target);
    }
    const name = semesterData[sem]?.name;
    if (name) document.title = semesterPageTitle(name);
  };

  // At least 3 results (fuzzy fallback), plus every other strong match up to 12
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchSubjects(searchQuery, semesterData, 12, { minResults: 3 });
  }, [semesterData, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const activeSemester = semesterData[openSemester];

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10 w-full px-2" role="search" data-pagefind-ignore="all">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-70 group-focus-within:opacity-100 transition duration-300"></div>
          <div className="relative flex items-center bg-[#0d0d14]/90 backdrop-blur-xl border border-white/10 group-focus-within:border-indigo-500/50 rounded-2xl px-4 py-3 shadow-xl transition-all">
            <Search aria-hidden="true" className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 group-focus-within:text-indigo-400 transition-colors" />
            <input
              ref={searchInput}
              type="search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuery(e.target.value)}
              placeholder="Search by subject name, ID (e.g. AI20203), or initials (e.g. RL, DAA)..."
              aria-label="Search subjects"
              data-search-shortcut
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm md:text-base outline-none focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { updateQuery(''); searchInput.current?.focus(); }}
                aria-label="Clear search"
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isSearching && (
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-2">
            <span className="flex items-center gap-1.5">
              <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-indigo-400" />
              Best matches ordered by relevance (Levenshtein distance)
            </span>
            <button
              type="button"
              onClick={() => updateQuery('')}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Search Results Mode */}
      {isSearching ? (
        <div className="w-full max-w-4xl mx-auto min-h-[400px]" aria-live="polite">
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
                    key={`${subject.semester}-${subject.id}-${index}`}
                    subject={subject}
                    showSemesterBadge={true}
                    rank={index + 1}
                    onNavigateSemester={navigateToSemester}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white/5 border border-white/5 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Search aria-hidden="true" className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300">No matching subjects found</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-md">
                We couldn't find any subjects matching "{searchQuery}". Try searching with a different subject name or course code.
              </p>
              <button
                type="button"
                onClick={() => updateQuery('')}
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
          {/* Sidebar Nav: real links, so each semester page is crawlable and works without JS */}
          <nav
            ref={semesterNav}
            aria-label="Semesters"
            data-pagefind-ignore="all"
            className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar lg:sticky lg:top-32 z-20"
          >
            {Object.keys(semesterData).map((semKey) => {
              const active = openSemester === semKey;
              return (
                <a
                  key={semKey}
                  href={semesterPath(semKey)}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    if (!isPlainLeftClick(e)) return;
                    e.preventDefault();
                    navigateToSemester(semKey);
                  }}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left border ${
                    active
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    active ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300'
                  }`}>
                    {semKey.substring(1)}
                  </span>
                  <span className="font-medium whitespace-nowrap">Semester {semKey.substring(1)}</span>
                </a>
              );
            })}
            {/* Coming Soon Placeholders */}
            {PLACEHOLDER_SEMESTERS.filter((semNum) => !semesterData[`s${semNum}`]).map((semNum) => (
              <button
                type="button"
                key={`s${semNum}`}
                disabled
                title="Coming soon"
                className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 bg-white/5 opacity-50 cursor-not-allowed text-slate-400"
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-white/5">
                  {semNum}
                </span>
                <span className="font-medium whitespace-nowrap">Semester {semNum}</span>
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="flex-1 w-full min-h-[500px]">
            {/* Only the active semester is mounted, so hidden semesters can't stretch the page. */}
            {activeSemester && (
              <section key={openSemester} className="animate-fade-up" aria-label={activeSemester.name}>
                <h2 className="sr-only">{activeSemester.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {activeSemester.subjects.map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
