/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Google Sheet published as CSV, read at build time (server only). */
  readonly SHEET_CSV_URL?: string;
  /** The same sheet URL, exposed to the browser for the background refresh. */
  readonly VITE_SHEET_CSV_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Plain `tsc` cannot resolve .astro files (`astro check` can, and uses their real types).
// This lets .ts tests import components for the Container API.
declare module "*.astro" {
  const Component: import("astro/runtime/server/index.js").AstroComponentFactory;
  export default Component;
}
