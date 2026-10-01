/**
 * Computes the Levenshtein distance (edit distance) between two strings.
 * Space-optimized O(min(m, n)) dynamic programming implementation.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function levenshteinDistance(a = "", b = "") {
  const s1 = String(a);
  const s2 = String(b);
  const m = s1.length;
  const n = s2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1);

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

const STOP_WORDS = new Set(["and", "of", "in", "to", "for", "the", "a", "an", "with", "on", "at", "&"]);

/**
 * Extracts first-letter initials / acronyms from a subject name.
 * Returns both full initials and significant-words initials (omitting stop words).
 *
 * @param {string} name
 * @returns {string[]} List of acronym strings
 */
export function getSubjectAcronyms(name = "") {
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
 * Computes the relevance score (distance) of a subject given a query.
 * Lower score = higher relevance / closer match.
 *
 * @param {string} query - The search query.
 * @param {{ id?: string, name?: string }} subject - Subject object with id and name.
 * @param {{ considerAcronyms?: boolean }} [options={ considerAcronyms: true }] - Search options
 * @returns {{ distance: number, matchedOn: 'id' | 'name' | 'acronym' }}
 */
export function calculateSubjectDistance(query, subject, options = {}) {
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

  // Exact substring containment bonus/reduction
  let substringDist = Infinity;
  if (name.includes(q)) {
    // If the query is an exact substring, distance is scaled relative to match quality
    substringDist = Math.max(0, name.indexOf(q) === 0 ? 0 : 0.5);
  } else if (id.includes(q)) {
    substringDist = Math.max(0, id.indexOf(q) === 0 ? 0 : 0.5);
  }

  // Calculate best distance for name, id, and acronym
  const bestNameScore = Math.min(nameDist, minWordDist, substringDist);
  const bestIdScore = Math.min(idDist, substringDist);
  const bestScore = Math.min(bestNameScore, bestIdScore, minAcronymDist);

  if (bestScore === minAcronymDist && minAcronymDist < bestNameScore && minAcronymDist < bestIdScore) {
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
 * @param {Array | Object} data
 * @returns {Array} List of subjects
 */
export function extractAllSubjects(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  const subjects = [];
  for (const [semKey, semVal] of Object.entries(data)) {
    if (semVal && Array.isArray(semVal.subjects)) {
      for (const sub of semVal.subjects) {
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
 * Searches subjects by name, id, or first-letter acronyms using Levenshtein distance.
 * Lowercases the query, calculates distance with name/id/acronyms, and returns
 * top `limit` results sorted in order of relevance (lowest distance first).
 *
 * @param {string} query - The search query
 * @param {Array | Object} source - Array of subjects or semesterData map
 * @param {number} [limit=3] - Maximum results to return (defaults to 3)
 * @param {{ considerAcronyms?: boolean }} [options={ considerAcronyms: true }] - Search options
 * @returns {Array} Top matching subjects with relevance metadata
 */
export function searchSubjects(query, source, limit = 3, options = {}) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];

  const subjects = extractAllSubjects(source);
  if (!subjects.length) return [];

  // Remove duplicates by subject id if any
  const uniqueSubjectsMap = new Map();
  for (const s of subjects) {
    if (s.id && !uniqueSubjectsMap.has(s.id)) {
      uniqueSubjectsMap.set(s.id, s);
    }
  }
  const uniqueSubjects = Array.from(uniqueSubjectsMap.values());

  const scored = uniqueSubjects.map((subject) => {
    const { distance, matchedOn } = calculateSubjectDistance(q, subject, options);
    return {
      ...subject,
      _distance: distance,
      _matchedOn: matchedOn,
    };
  });

  // Sort by ascending distance (lowest distance is most relevant)
  scored.sort((a, b) => {
    if (a._distance !== b._distance) {
      return a._distance - b._distance;
    }
    // Tie-breaker: alphabetical by name
    return String(a.name || "").localeCompare(String(b.name || ""));
  });

  return scored.slice(0, limit);
}
