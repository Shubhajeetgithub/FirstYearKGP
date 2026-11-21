import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Treats "" and null as missing, as editors may save blank optional fields that way. */
const blankAsMissing = (value: unknown) => (value === "" || value === null ? undefined : value);

/** Lowercase, hyphenated tag ("Signal Processing" → "signal-processing"), so tag URLs are stable. */
const tag = z
  .string()
  .trim()
  .min(1)
  .transform((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));

const authors = defineCollection({
  // Entry id = file name without extension, e.g. src/content/authors/shubhajeet-das.json → "shubhajeet-das".
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string().min(1),
    /** GitHub username, without "@". */
    github: z.string().regex(/^[A-Za-z0-9-]+$/, "GitHub username only, without @ or a URL"),
    /** Photo URL; defaults to the GitHub avatar. */
    avatar: z.preprocess(blankAsMissing, z.url().optional()),
    bio: z.preprocess(blankAsMissing, z.string().optional()),
    role: z.preprocess(blankAsMissing, z.string().optional()),
    /** Shown obfuscated on the home page credits, e.g. "name [at] kgpian.iitkgp.ac.in". */
    email: z.preprocess(blankAsMissing, z.string().optional()),
    /** Listed under "Core Contributors" on the home page, in ascending `order`. */
    core: z.boolean().default(false),
    order: z.preprocess(blankAsMissing, z.number().default(100)),
  }),
});

const blog = defineCollection({
  // Either src/content/blog/<slug>.md or src/content/blog/<slug>/index.md (the CMS layout, with
  // images next to the post). Files starting with "_" (like _template.md) are ignored.
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      /** Used for the meta description and social cards. */
      description: z.string().min(1).max(160, "Keep the description to 160 characters or fewer"),
      pubDate: z.coerce.date(),
      updatedDate: z.preprocess(blankAsMissing, z.coerce.date().optional()),
      /** One author id, or several for co-authored posts (file names in src/content/authors). */
      author: z.union([reference("authors"), z.array(reference("authors")).min(1)]),
      tags: z.preprocess(blankAsMissing, z.array(tag).default([])),
      /** Course code, e.g. "AI20203". */
      subject: z.preprocess(blankAsMissing, z.string().trim().toUpperCase().optional()),
      cover: z.preprocess(blankAsMissing, image().optional()),
      coverAlt: z.preprocess(blankAsMissing, z.string().optional()),
      draft: z.boolean().default(false),
      /** Loads the KaTeX stylesheet for this post. */
      math: z.boolean().default(false),
    }),
});

export const collections = { authors, blog };
