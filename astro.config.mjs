// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import { remarkReadingTime } from "./src/lib/readingTime.ts";

const SITE_URL = "https://ai2024-chi.vercel.app";

/** Pages that should not be in the sitemap. */
const EXCLUDED_FROM_SITEMAP = [/\/404$/, /\/search$/, /\/admin(\/|$)/];

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  // One .html file per route (resources/s1.html); Vercel's cleanUrls serves them without ".html".
  build: { format: "file" },
  // Astro 7's default ('jsx') drops whitespace between inline elements; keep the old behaviour.
  compressHTML: true,
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !EXCLUDED_FROM_SITEMAP.some((re) => re.test(page.replace(/\/$/, ""))),
    }),
  ],
  markdown: {
    // Astro 7 defaults to Sätteri; unified keeps the remark/rehype plugin ecosystem (MDX inherits it).
    processor: unified({
      remarkPlugins: [remarkMath, remarkReadingTime],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
        [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
      ],
    }),
    shikiConfig: { theme: "github-dark-dimmed", wrap: false },
    syntaxHighlight: { type: "shiki", excludeLangs: ["math"] },
  },
  image: {
    // Remote images optimised at build time (contributor photos, GitHub avatars).
    domains: ["raw.githubusercontent.com", "avatars.githubusercontent.com"],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
