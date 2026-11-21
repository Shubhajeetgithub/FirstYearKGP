// Build-time only: reads server env vars and fails the build instead of deploying empty pages.
import { readFile } from "node:fs/promises";
import { fetchSheetCsv, parseSheet } from "./sheet";
import type { SemesterData } from "../types/semester";

export interface BuildSheet {
  data: SemesterData;
  /** When the sheet was fetched (ms since epoch); shown as "Last updated" and used by the SWR refresh. */
  fetchedAt: number;
}

const BUILD_FETCH_TIMEOUT_MS = 30_000;
const ATTEMPTS = 3;

/** The sheet URL for the build: SHEET_CSV_URL, falling back to VITE_SHEET_CSV_URL. */
export function buildSheetUrl(): string | undefined {
  return (
    import.meta.env.SHEET_CSV_URL ||
    process.env.SHEET_CSV_URL ||
    import.meta.env.VITE_SHEET_CSV_URL ||
    process.env.VITE_SHEET_CSV_URL ||
    undefined
  );
}

/**
 * A local CSV used instead of the sheet when no URL is configured: CI on pull requests from forks
 * (no secrets) and contributors without the sheet URL. Never set it on Vercel.
 */
export function buildSheetFile(): string | undefined {
  return process.env.SHEET_CSV_FILE || undefined;
}

async function load(url: string | undefined, file: string | undefined = undefined): Promise<BuildSheet> {
  if (!url && file) {
    console.warn(`[resources] SHEET_CSV_URL is not set; building from the local file ${file}.`);
    return { data: parseSheet(await readFile(file, "utf8")), fetchedAt: Date.now() };
  }
  if (!url) {
    throw new Error(
      "[resources] SHEET_CSV_URL is not set, so the resources pages cannot be built. " +
        "Set it (or VITE_SHEET_CSV_URL) in .env locally or in the Vercel project's environment variables."
    );
  }
  let lastError: unknown;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const csv = await fetchSheetCsv(url, BUILD_FETCH_TIMEOUT_MS);
      return { data: parseSheet(csv), fetchedAt: Date.now() };
    } catch (err) {
      lastError = err;
    }
  }
  const reason = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `[resources] Could not load the resources Google Sheet at build time (${ATTEMPTS} attempts): ${reason}. ` +
      "Failing the build rather than deploying an empty resources page.",
    { cause: lastError }
  );
}

let pending: Promise<BuildSheet> | undefined;

/** Loads the sheet once per build; every resources page shares the result. */
export function getBuildSheet(): Promise<BuildSheet> {
  pending ??= load(buildSheetUrl(), buildSheetFile());
  return pending;
}

/** For tests: loads from an explicit URL without the per-build memo. */
export const loadBuildSheet = load;
