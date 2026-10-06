/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Sheet published as CSV. Unset in environments without a `.env`. */
  readonly VITE_SHEET_CSV_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
