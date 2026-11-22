// Warns about large images (guideline: ≤ 300 KB, WebP or PNG).
// Usage: node scripts/check-images.mjs [folder ...]   (default: public/images and .blog-content)
// The blog content repository's workflow passes its own posts/ and authors/ folders.
// Prints GitHub Actions annotations; exits 0 so a large image never blocks a post.
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const args = process.argv.slice(2);
const ROOTS = args.length ? args : ["public/images", ".blog-content"];
const IMAGE = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"]);
const WARN_BYTES = 500 * 1024;
const GUIDE_BYTES = 300 * 1024;

async function* walk(dir) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (IMAGE.has(extname(entry.name).toLowerCase())) yield path;
  }
}

let warnings = 0;
for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const { size } = await stat(file);
    const kb = Math.round(size / 1024);
    if (size > WARN_BYTES) {
      warnings++;
      console.log(`::warning file=${file}::${file} is ${kb} KB. Please compress it below 300 KB (WebP works well).`);
    } else if (size > GUIDE_BYTES) {
      console.log(`note: ${file} is ${kb} KB (guideline is 300 KB).`);
    }
  }
}
console.log(warnings ? `${warnings} large image(s) found.` : "Image sizes look fine.");
