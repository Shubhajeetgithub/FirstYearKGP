import type {
  DistanceOptions,
  SearchableSubject,
  SearchOptions,
  SearchResult,
  SubjectDistance,
  SubjectSource,
  WithSemester,
} from "../types/search";

/**
 * Computes the Levenshtein distance (edit distance) between two strings.
 * Space-optimized O(min(m, n)) dynamic programming implementation.
 */
export function levenshteinDistance(a: string = "", b: string = ""): number {
  // Compare by code point so astral characters (e.g. emoji) count as a single edit
  const s1 = Array.from(String(a));
  const s2 = Array.from(String(b));
  const m = s1.length;
  const n = s2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const prev = Array.from({ length: n + 1 }, (_, i) => i);
  const curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
      }
    }
    for (let j = 0; j <= n; j++) {
      prev[j] = curr[j];
    }
  }

  return prev[n];
}

const STOP_WORDS = new Set([
  "and", "of", "in", "to", "for", "the", "a", "an", "with", "on", "at", "&",
  "by", "from", "or", "as", "into", "via", "vs", "its", "is", "are", "through", "using",
]);

/**
 * Extracts first-letter initials / acronyms from a subject name.
 * Returns both full initials and significant-words initials (omitting stop words).
 *
 * @returns List of acronym strings
 */
export function getSubjectAcronyms(name: string = ""): string[] {
  const words = String(name || "")
    .toLowerCase()
    .split(/[\s\-_/]+/)
    .filter(Boolean);

  if (!words.length) return [];

  // All first letters (e.g. "Reinforcement Learning" -> "rl", "Design and Analysis of Algorithms" -> "daaoa")
  const allInitials = words.map((w) => w[0]).join("");

  // First letters of significant words (e.g. "Design and Analysis of Algorithms" -> "daa")
  const sigWords = words.filter((w) => !STOP_WORDS.has(w));
  const sigInitials = sigWords.map((w) => w[0]).join("");

  return Array.from(new Set([allInitials, sigInitials].filter(Boolean)));
}

/**
 * Distance contributed by `q` appearing verbatim inside `text`.
 *
 * @returns 0 if `text` starts with `q`, 0.5 if it contains it elsewhere, Infinity otherwise
 */
function substringDistance(q: string, text: string): number {
  const index = text.indexOf(q);
  if (index === -1) return Infinity;
  return index === 0 ? 0 : 0.5;
}

/**
 * Computes the relevance score (distance) of a subject given a query.
 * Lower score = higher relevance / closer match.
 *
 * @param query - The search query.
 * @param subject - Subject object with id and name.
 * @param [options] - Search options
 */
export function calculateSubjectDistance(
  query: string,
  subject: SearchableSubject,
  options: DistanceOptions = {}
): SubjectDistance {
  const { considerAcronyms = true } = options;
  const q = String(query || "").trim().toLowerCase();
  if (!q) {
    return { distance: Infinity, matchedOn: "name" };
  }

  const name = String(subject.name || "").trim().toLowerCase();
  const id = String(subject.id || "").trim().toLowerCase();

  // Direct Levenshtein distances
  const nameDist = levenshteinDistance(q, name);
  const idDist = levenshteinDistance(q, id);

  // Word-level distances on subject name (e.g. searching "algorithms" against "Design and Analysis of Algorithms")
  const nameWords = name.split(/[\s\-_/]+/).filter(Boolean);
  let minWordDist = Infinity;
  for (const word of nameWords) {
    const dist = levenshteinDistance(q, word);
    if (dist < minWordDist) {
      minWordDist = dist;
    }
  }

  // Acronym / First-letter distances (e.g. "rl" for "Reinforcement Learning", "daa" for "Design and Analysis of Algorithms")
  let minAcronymDist = Infinity;
  if (considerAcronyms) {
    const acronyms = getSubjectAcronyms(name);
    for (const acr of acronyms) {
      const dist = levenshteinDistance(q, acr);
      if (dist < minAcronymDist) {
        minAcronymDist = dist;
      }
    }
  }

  // Exact substring containment: 0 for a prefix, 0.5 elsewhere. Scored separately for name and id
  // so a name match is not attributed to the id (and vice versa).
  const nameSubstringDist = substringDistance(q, name);
  const idSubstringDist = substringDistance(q, id);

  // Calculate best distance for name, id, and acronym
  const bestNameScore = Math.min(nameDist, minWordDist, nameSubstringDist);
  const bestIdScore = Math.min(idDist, idSubstringDist);

  if (minAcronymDist < bestNameScore && minAcronymDist < bestIdScore) {
    return { distance: minAcronymDist, matchedOn: "acronym" };
  }
  if (bestIdScore <= bestNameScore) {
    return { distance: bestIdScore, matchedOn: "id" };
  }
  return { distance: bestNameScore, matchedOn: "name" };
}

/**
 * Flatten semesterData dictionary or accept array of subjects.
 *
 * @returns List of subjects
 */
export function extractAllSubjects<S extends SearchableSubject>(
  data: readonly (S | null | undefined)[]
): readonly (S | null | undefined)[];
export function extractAllSubjects<S extends SearchableSubject>(
  data?: Exclude<SubjectSource<S>, readonly unknown[]>
): WithSemester<S>[];
export function extractAllSubjects<S extends SearchableSubject>(
  data?: SubjectSource<S>
): readonly (S | null | undefined)[];
export function extractAllSubjects<S extends SearchableSubject>(
  data?: SubjectSource<S>
): readonly (S | null | undefined)[] {
  if (!data) return [];
  if (isSubjectList(data)) return data;

  const subjects: WithSemester<S>[] = [];
  for (const [semKey, semVal] of Object.entries(data)) {
    if (semVal && Array.isArray(semVal.subjects)) {
      for (const sub of semVal.subjects) {
        if (!sub || typeof sub !== "object") continue;
        subjects.push({
          ...sub,
          semester: sub.semester || semKey,
          semesterName: sub.semesterName || semVal.name || `Semester ${semKey.replace(/^s/i, "")}`,
        });
      }
    }
  }
  return subjects;
}

/**
 * Index of the first word of `name` at which `query` begins (the query may span several words),
 * or -1 if the query does not start at a word boundary. Words are split on whitespace, '-', '_' and '/'.
 *
 * e.g. ("data", "Programming and Data Structures") -> 2, ("data", "Database Systems") -> 0,
 *      ("data", "Metadata") -> -1
 *
 */
export function wordMatchIndex(query: string, name: string): number {
  const q = splitWords(query).join(" ");
  if (!q) return -1;
  const words = splitWords(name);
  for (let i = 0; i < words.length; i++) {
    if (words.slice(i).join(" ").startsWith(q)) return i;
  }
  return -1;
}

function splitWords(text: string): string[] {
  return String(text || "")
    .trim()
    .toLowerCase()
    .split(/[\s\-_/]+/)
    .filter(Boolean);
}

/**
 * Searches subjects by name, id, or first-letter acronyms using Levenshtein distance.
 *
 * Results are sorted by relevance: lowest distance first, then exact name/id matches, then
 * subjects where the query starts an earlier word of the name (so "Data Science" ranks above
 * "Programming and Data Structures" for "data"), then alphabetically by name.
 *
 * The best `minResults` subjects are always returned (fuzzy matches included, so typos and
 * short queries still show something). Beyond that, only strong matches are added, up to
 * `limit`. A strong match is one where the query starts a word of the name, the id starts with
 * the query, or the query is exactly the subject's acronym.
 *
 * @param query - The search query
 * @param source - Array of subjects or semesterData map
 * @param [limit=3] - Maximum results to return (defaults to 3)
 * @param [options] - Search options.
 *   `minResults` defaults to `limit`, i.e. a fixed number of results.
 * @returns Top matching subjects with relevance metadata
 */
export function searchSubjects<S extends SearchableSubject>(
  query: string,
  source: readonly (S | null | undefined)[],
  limit?: number,
  options?: SearchOptions
): SearchResult<S>[];
export function searchSubjects<S extends SearchableSubject>(
  query: string,
  source: Exclude<SubjectSource<S>, readonly unknown[]>,
  limit?: number,
  options?: SearchOptions
): SearchResult<WithSemester<S>>[];
export function searchSubjects<S extends SearchableSubject>(
  query: string,
  source: SubjectSource<S>,
  limit?: number,
  options?: SearchOptions
): SearchResult<S>[];
export function searchSubjects<S extends SearchableSubject>(
  query: string,
  source: SubjectSource<S>,
  limit: number = 3,
  options: SearchOptions = {}
): SearchResult<S>[] {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];

  const maxResults = Number(limit);
  if (!(maxResults > 0)) return [];

  const requestedMin = Number(options.minResults);
  const minResults = requestedMin >= 0 ? Math.min(requestedMin, maxResults) : maxResults;

  const subjects = extractAllSubjects(source);
  if (!subjects.length) return [];

  // Remove duplicates by subject id if any; skip malformed entries and subjects without an id
  const uniqueSubjectsMap = new Map<string | number, S>();
  for (const s of subjects) {
    if (!s || typeof s !== "object") continue;
    if (s.id == null || s.id === "") continue;
    if (!uniqueSubjectsMap.has(s.id)) {
      uniqueSubjectsMap.set(s.id, s);
    }
  }
  const uniqueSubjects = Array.from(uniqueSubjectsMap.values());

  // Ranking metadata kept off the returned objects
  const rankInfo = new Map<SearchResult<S>, RankInfo>();

  const scored = uniqueSubjects.map((subject) => {
    const { distance, matchedOn } = calculateSubjectDistance(q, subject, options);
    const result: SearchResult<S> = {
      ...subject,
      _distance: distance,
      _matchedOn: matchedOn,
    };
    const name = String(subject.name || "").trim().toLowerCase();
    const id = String(subject.id).trim().toLowerCase();
    const wordIndex = wordMatchIndex(q, name);
    rankInfo.set(result, {
      exact: name === q || id === q,
      wordIndex: wordIndex === -1 ? Infinity : wordIndex,
      strong: wordIndex !== -1 || id.startsWith(q) || (matchedOn === "acronym" && distance === 0),
    });
    return result;
  });

  // Sort by ascending distance (lowest distance is most relevant)
  scored.sort((a, b) => {
    if (a._distance !== b._distance) {
      return a._distance - b._distance;
    }
    const ra = rankInfo.get(a)!; // every scored result was added to rankInfo above
    const rb = rankInfo.get(b)!; // every scored result was added to rankInfo above
    // Exact name/id matches beat prefix matches that share the same distance
    if (ra.exact !== rb.exact) {
      return ra.exact ? -1 : 1;
    }
    // Matches on an earlier word of the name come first
    if (ra.wordIndex !== rb.wordIndex) {
      return ra.wordIndex < rb.wordIndex ? -1 : 1;
    }
    // Tie-breaker: alphabetical by name
    return String(a.name || "").localeCompare(String(b.name || ""));
  });

  return scored
    .filter((result, index) => index < minResults || rankInfo.get(result)!.strong) // set for every result above
    .slice(0, maxResults);
}

interface RankInfo {
  /** The query equals the whole name or id. */
  exact: boolean;
  /** Index of the name word the query starts at; `Infinity` when it starts at none. */
  wordIndex: number;
  /** Shown even beyond `minResults`. */
  strong: boolean;
}

/** `Array.isArray` does not narrow readonly arrays out of a union, so narrow explicitly. */
function isSubjectList<S extends SearchableSubject>(
  data: NonNullable<SubjectSource<S>>
): data is readonly (S | null | undefined)[] {
  return Array.isArray(data);
}
