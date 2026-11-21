import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { FileText, Library, Search, X } from 'lucide-react';
import { cleanResultUrl, isSearchType } from '../lib/pagefind';
import type { Pagefind, PagefindResultData, SearchType } from '../lib/pagefind';

const MAX_RESULTS = 20;
const TYPE_LABELS: Record<SearchType, string> = { all: 'Everything', blog: 'Blog posts', resource: 'Resources' };

type IndexState = 'loading' | 'ready' | 'missing';

export interface SiteSearchProps {
  /** Where the Pagefind bundle is served from. */
  bundlePath?: string;
  /** Loads the bundle; replaceable in tests. */
  loadPagefind?: (url: string) => Promise<Pagefind>;
}

// The bundle only exists after `pagefind` runs on the build output, so it is loaded at runtime.
const importPagefind = (url: string): Promise<Pagefind> => import(/* @vite-ignore */ url) as Promise<Pagefind>;

function writeUrl(q: string, type: SearchType): void {
  const url = new URL(window.location.href);
  if (q.trim()) url.searchParams.set('q', q);
  else url.searchParams.delete('q');
  if (type !== 'all') url.searchParams.set('type', type);
  else url.searchParams.delete('type');
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
}

export default function SiteSearch({ bundlePath = '/pagefind/pagefind.js', loadPagefind = importPagefind }: SiteSearchProps) {
  const [query, setQuery] = useState<string>('');
  const [type, setType] = useState<SearchType>('all');
  const [indexState, setIndexState] = useState<IndexState>('loading');
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searched, setSearched] = useState<string>('');
  const pagefind = useRef<Pagefind | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  // Read ?q= and ?type= once, then load the index.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    const t = params.get('type');
    if (isSearchType(t)) setType(t);
    input.current?.focus();

    let active = true;
    loadPagefind(bundlePath)
      .then(async (pf) => {
        await pf.options?.({ excerptLength: 24 });
        await pf.init?.();
        if (!active) return;
        pagefind.current = pf;
        setIndexState('ready');
      })
      .catch(() => { if (active) setIndexState('missing'); });
    return () => { active = false; };
  }, [bundlePath, loadPagefind]);

  // Run the search whenever the query, filter or index changes.
  useEffect(() => {
    writeUrl(query, type);
    const pf = pagefind.current;
    if (indexState !== 'ready' || !pf) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      setTotal(0);
      setSearched('');
      return;
    }
    let active = true;
    const filters = type === 'all' ? undefined : { type };
    pf.debouncedSearch(q, { filters }, 200).then(async (search) => {
      // null means a newer keystroke superseded this search.
      if (!search || !active) return;
      const data = await Promise.all(search.results.slice(0, MAX_RESULTS).map((r) => r.data()));
      if (!active) return;
      setResults(data);
      setTotal(search.results.length);
      setSearched(q);
    });
    return () => { active = false; };
  }, [query, type, indexState]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form role="search" onSubmit={(e: React.FormEvent) => e.preventDefault()} className="relative group">
        <label htmlFor="site-search" className="sr-only">Search the site</label>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-70 group-focus-within:opacity-100 transition duration-300"></div>
        <div className="relative flex items-center bg-[#0d0d14]/90 backdrop-blur-xl border border-white/10 group-focus-within:border-indigo-500/50 rounded-2xl px-4 py-3 shadow-xl">
          <Search aria-hidden="true" className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 group-focus-within:text-indigo-400" />
          <input
            id="site-search"
            ref={input}
            type="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search blog posts and course resources…"
            autoComplete="off"
            data-search-shortcut
            className="w-full bg-transparent text-white placeholder-slate-400 text-base outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); input.current?.focus(); }}
              aria-label="Clear search"
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X aria-hidden="true" className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <fieldset className="mt-4 flex flex-wrap justify-center gap-2">
        <legend className="sr-only">Show</legend>
        {(Object.keys(TYPE_LABELS) as SearchType[]).map((t) => (
          <label
            key={t}
            className={`cursor-pointer text-sm px-3 py-1 rounded-full border transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500/60 ${
              type === t ? 'bg-indigo-500/20 border-indigo-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <input type="radio" name="search-type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
            {TYPE_LABELS[t]}
          </label>
        ))}
      </fieldset>

      <div className="mt-8" aria-live="polite">
        {indexState === 'missing' && (
          <p className="text-center text-slate-400">
            The search index isn't available. It is generated by <code className="text-indigo-300">npm run build</code>, so search
            works in the built site (<code className="text-indigo-300">npm run preview</code>) but not in <code className="text-indigo-300">npm run dev</code>.
          </p>
        )}
        {indexState === 'loading' && query.trim() && <p className="text-center text-slate-400">Loading the search index…</p>}
        {indexState === 'ready' && searched && (
          <p className="mb-4 text-sm text-slate-400">
            {total === 0
              ? `No results for "${searched}".`
              : `${total} ${total === 1 ? 'result' : 'results'} for "${searched}"${total > MAX_RESULTS ? `, showing the first ${MAX_RESULTS}` : ''}.`}
          </p>
        )}
        <ul className="space-y-3">
          {results.map((r) => {
            const isResource = r.filters.type?.includes('resource');
            const Icon = isResource ? Library : FileText;
            return (
              <li key={r.url}>
                <a
                  href={cleanResultUrl(r.url)}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                >
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <Icon aria-hidden="true" className="w-3.5 h-3.5 text-indigo-400" />
                    {isResource ? 'Resources' : 'Blog'}
                    {r.meta.date && <span>· {r.meta.date}</span>}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-white">{r.meta.title ?? cleanResultUrl(r.url)}</span>
                  {/* Pagefind excerpts are escaped page text with <mark> around the matches. */}
                  <span
                    className="mt-1 block text-sm text-slate-400 leading-relaxed [&_mark]:bg-indigo-500/30 [&_mark]:text-white [&_mark]:rounded [&_mark]:px-0.5"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
