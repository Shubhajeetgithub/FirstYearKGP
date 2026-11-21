// Self-hosts KaTeX's stylesheet and fonts under public/vendor/katex so math posts can link them
// (only posts with `math: true` do). Runs before `dev` and `build`; the output is gitignored.
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const src = root("node_modules/katex/dist");
const out = root("public/vendor/katex");

await rm(out, { recursive: true, force: true });
await mkdir(`${out}/fonts`, { recursive: true });
await cp(`${src}/katex.min.css`, `${out}/katex.min.css`);
// Every browser we support reads woff2; the CSS's woff/ttf fallbacks are never requested.
const fonts = (await readdir(`${src}/fonts`)).filter((f) => f.endsWith(".woff2"));
await Promise.all(fonts.map((f) => cp(`${src}/fonts/${f}`, `${out}/fonts/${f}`)));
console.log(`KaTeX: copied stylesheet and ${fonts.length} fonts to public/vendor/katex`);
