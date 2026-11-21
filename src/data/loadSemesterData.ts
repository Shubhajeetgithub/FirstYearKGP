import { BookOpen, FileText, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { csvParseRows } from "d3-dsv";
import type { SemesterData, Subject } from "../types/semester";

// Google Sheet published as CSV (File → Share → Publish to web → CSV).
// Expected header row:
//   semester | subject_id | subject_name | subject_image | resource_name | resource_url | icon
// One row per resource. `icon` is one of: book, file, download (defaults to file).
// A row with an empty resource_name just declares the subject.
const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL;
const FETCH_TIMEOUT_MS = 8000;

// Partial: a cell may name an icon that is not in the map.
const ICONS: Partial<Record<string, LucideIcon>> = { book: BookOpen, file: FileText, download: Download };

type Column =
  | "semester"
  | "subject_id"
  | "subject_name"
  | "subject_image"
  | "resource_name"
  | "resource_url"
  | "icon";

function rowsToSemesterData(rows: string[][]): SemesterData {
  const [header, ...body] = rows;
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
        icon: ICONS[get(r, "icon").toLowerCase()] ?? FileText,
      });
    }
  }

  // Keep semesters in numeric order regardless of row order in the sheet.
  return Object.fromEntries(
    Object.entries(data).sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)))
  );
}

/** localStorage key for the last good sheet: `{ csv, timestamp }`. Bump the version on shape changes. */
export const CACHE_KEY = "kgp:sheet:v1";

interface CachedSheet {
  /** Raw CSV text, re-parsed on read so the icon components never need serialising. */
  csv: string;
  /** `Date.now()` when the CSV was fetched. */
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

/** Parses CSV text, rejecting a sheet with no usable rows. */
function parseSheet(csv: string): SemesterData {
  const rows = csvParseRows(csv);
  if (!rows.length) throw new Error("Sheet returned no data");
  const data = rowsToSemesterData(rows);
  if (!Object.keys(data).length) throw new Error("Sheet returned no data");
  return data;
}

// Storage can be missing (SSR, Node) or throw (Safari private mode, quota, blocked cookies).
function readCache(): SemesterData | null {
  try {
    const raw = globalThis.localStorage?.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isCachedSheet(parsed) ? parseSheet(parsed.csv) : null;
  } catch {
    return null;
  }
}

function writeCache(csv: string): void {
  try {
    const entry: CachedSheet = { csv, timestamp: Date.now() };
    globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // A full or blocked storage only costs us the cache.
  }
}

async function fetchSheet(): Promise<SemesterData> {
  if (!SHEET_CSV_URL) throw new Error("VITE_SHEET_CSV_URL is not set");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHEET_CSV_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const csv = await res.text();
    const data = parseSheet(csv);
    writeCache(csv);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Loads the semester data with stale-while-revalidate caching.
 *
 * - With a cached sheet: resolves immediately with it, then fetches a fresh copy in the background
 *   and passes it to `onUpdate`. A failed background refresh is ignored (the cache stays).
 * - Without a cache: resolves with the fetched sheet, or rejects if the fetch fails.
 */
export async function loadSemesterData(
  onUpdate?: (data: SemesterData) => void
): Promise<SemesterData> {
  const cached = readCache();
  if (!cached) return fetchSheet();

  fetchSheet().then(
    (fresh) => onUpdate?.(fresh),
    (err: unknown) => console.warn("Background sheet refresh failed; showing cached data.", err)
  );
  return cached;
}
