import { csvParseRows } from "d3-dsv";
import { RESOURCE_ICONS } from "../types/semester";
import type { ResourceIcon, SemesterData, Subject } from "../types/semester";

// Google Sheet published as CSV (File → Share → Publish to web → CSV).
// Expected header row:
//   semester | subject_id | subject_name | subject_image | resource_name | resource_url | icon
// One row per resource. `icon` is one of: book, file, download (defaults to file).
// A row with an empty resource_name just declares the subject.

export const FETCH_TIMEOUT_MS = 8000;

/** localStorage key for the last good sheet: `{ csv, timestamp }`. Bump the version on shape changes. */
export const CACHE_KEY = "kgp:sheet:v1";

type Column =
  | "semester"
  | "subject_id"
  | "subject_name"
  | "subject_image"
  | "resource_name"
  | "resource_url"
  | "icon";

function isResourceIcon(name: string): name is ResourceIcon {
  return (RESOURCE_ICONS as readonly string[]).includes(name);
}

/** Maps an `icon` cell to a known icon name; anything unknown becomes `"file"`. */
export function toResourceIcon(cell: string): ResourceIcon {
  const name = cell.trim().toLowerCase();
  return isResourceIcon(name) ? name : "file";
}

/** Groups parsed CSV rows (header first) into semesters → subjects → resources. */
export function rowsToSemesterData(rows: string[][]): SemesterData {
  const [header = [], ...body] = rows;
  const col: Partial<Record<string, number>> = Object.fromEntries(
    header.map((h, i) => [h.trim().toLowerCase(), i])
  );
  // A column missing from the header reads as "" in every row.
  const get = (r: string[], key: Column): string => {
    const i = col[key];
    return (i === undefined ? "" : r[i] ?? "").trim();
  };

  const data: SemesterData = {};
  for (const r of body) {
    const sem = get(r, "semester").replace(/^s/i, "");
    const subjectId = get(r, "subject_id");
    if (!sem || !subjectId) continue;

    const semKey = `s${sem}`;
    data[semKey] ??= { name: `Semester ${sem}`, subjects: [] };

    let subject: Subject | undefined = data[semKey].subjects.find((s) => s.id === subjectId);
    if (!subject) {
      subject = {
        id: subjectId,
        name: get(r, "subject_name"),
        image: get(r, "subject_image"),
        semester: semKey,
        semesterName: data[semKey].name,
        resources: [],
      };
      data[semKey].subjects.push(subject);
    }

    const resourceName = get(r, "resource_name");
    if (resourceName) {
      subject.resources.push({
        name: resourceName,
        url: get(r, "resource_url") || "#",
        icon: toResourceIcon(get(r, "icon")),
      });
    }
  }

  // Keep semesters in numeric order regardless of row order in the sheet.
  return Object.fromEntries(
    Object.entries(data).sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)))
  );
}

/** Parses CSV text, rejecting a sheet with no usable rows. */
export function parseSheet(csv: string): SemesterData {
  const data = rowsToSemesterData(csvParseRows(csv));
  if (!Object.keys(data).length) throw new Error("Sheet returned no data");
  return data;
}

/** Fetches the sheet's CSV text, aborting after {@link FETCH_TIMEOUT_MS}. */
export async function fetchSheetCsv(url: string | undefined, timeoutMs = FETCH_TIMEOUT_MS): Promise<string> {
  if (!url) throw new Error("Sheet CSV URL is not set");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------------------------
// Browser cache (stale-while-revalidate). The pages ship build-time data; the browser keeps the
// last sheet it fetched so edits made after the build show up on the next visit.

interface CachedSheet {
  /** Raw CSV text, re-parsed on read. */
  csv: string;
  /** `Date.now()` when the CSV was fetched. */
  timestamp: number;
}

export interface CachedSemesterData {
  data: SemesterData;
  timestamp: number;
}

function isCachedSheet(value: unknown): value is CachedSheet {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).csv === "string" &&
    typeof (value as Record<string, unknown>).timestamp === "number"
  );
}

/** The cached sheet, or null when there is none, it is unreadable, or storage is unavailable. */
export function readCachedSheet(): CachedSemesterData | null {
  // Storage can be missing (Node) or throw (Safari private mode, blocked site data).
  try {
    const raw = globalThis.localStorage?.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCachedSheet(parsed) ? { data: parseSheet(parsed.csv), timestamp: parsed.timestamp } : null;
  } catch {
    return null;
  }
}

function writeCachedSheet(csv: string): void {
  try {
    const entry: CachedSheet = { csv, timestamp: Date.now() };
    globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // A full or blocked storage only costs us the cache.
  }
}

/** Fetches and parses the sheet, caching the CSV only when it parsed to real data. */
export async function fetchSemesterData(url: string | undefined): Promise<SemesterData> {
  const csv = await fetchSheetCsv(url);
  const data = parseSheet(csv);
  writeCachedSheet(csv);
  return data;
}

export interface RefreshOptions {
  /** Client-side sheet URL; without one only the cache is consulted. */
  url: string | undefined;
  /** When the page's build-time data was fetched (ms since epoch). Older caches are ignored. */
  builtAt: number;
  onUpdate: (data: SemesterData) => void;
}

/**
 * Stale-while-revalidate on top of build-time data: passes a cache newer than the build to
 * `onUpdate` straight away, then fetches a fresh copy in the background and passes that too.
 * Failures are logged and otherwise ignored, since the page already shows usable data.
 *
 * @returns A function that stops any further `onUpdate` calls (call it on unmount).
 */
export function refreshSemesterData({ url, builtAt, onUpdate }: RefreshOptions): () => void {
  let active = true;
  const cached = readCachedSheet();
  if (cached && cached.timestamp > builtAt) onUpdate(cached.data);

  if (url) {
    fetchSemesterData(url).then(
      (fresh) => { if (active) onUpdate(fresh); },
      (err: unknown) => console.warn("Background sheet refresh failed; showing the built copy.", err)
    );
  }
  return () => { active = false; };
}
