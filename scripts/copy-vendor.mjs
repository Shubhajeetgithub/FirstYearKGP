// Self-hosts third-party browser files under public/vendor (gitignored), before `dev` and `build`:
// - KaTeX stylesheet and fonts: linked by blog posts that contain maths.
// - KaTeX and marked scripts: used by the CMS preview (public/admin/preview.js) to render maths.
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const katex = root("node_modules/katex/dist");
const out = root("public/vendor");

await rm(out, { recursive: true, force: true });
await mkdir(`${out}/katex/fonts`, { recursive: true });
await mkdir(`${out}/marked`, { recursive: true });

await cp(`${katex}/katex.min.css`, `${out}/katex/katex.min.css`);
await cp(`${katex}/katex.min.js`, `${out}/katex/katex.min.js`);
// Every browser we support reads woff2; the CSS's woff/ttf fallbacks are never requested.
const fonts = (await readdir(`${katex}/fonts`)).filter((f) => f.endsWith(".woff2"));
await Promise.all(fonts.map((f) => cp(`${katex}/fonts/${f}`, `${out}/katex/fonts/${f}`)));

await cp(root("node_modules/marked/lib/marked.umd.js"), `${out}/marked/marked.umd.js`);

console.log(`vendor: copied KaTeX (stylesheet, script, ${fonts.length} fonts) and marked to public/vendor`);
