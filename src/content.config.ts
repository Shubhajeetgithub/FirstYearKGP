import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { blogContentLoader } from "./lib/blogContent";

// Posts and authors live in a separate repository (BLOG_CONTENT_REPO, by default
// Shubhajeetgithub/FirstYearKGP-blog), downloaded at build time. See README → "Blog content".

/** Treats "" and null as missing, as editors may save blank optional fields that way. */
const blankAsMissing = (value: unknown) => (value === "" || value === null ? undefined : value);

/** Lowercase, hyphenated tag ("Signal Processing" → "signal-processing"), so tag URLs are stable. */
const tag = z
  .string()
  .trim()
  .min(1)
  .transform((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));

const authors = defineCollection({
  // Entry id = file name without extension, e.g. authors/shubhajeet-das.json → "shubhajeet-das".
  loader: blogContentLoader("authors", "**/[^_]*.json"),
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
  // posts/<slug>/index.md (the CMS layout, with images next to the post) or posts/<slug>.md.
  // Files starting with "_" are ignored.
  loader: blogContentLoader("posts", "**/[^_]*.{md,mdx}"),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      /** Used for the meta description and social cards. */
      description: z.string().min(1).max(160, "Keep the description to 160 characters or fewer"),
      pubDate: z.coerce.date(),
      updatedDate: z.preprocess(blankAsMissing, z.coerce.date().optional()),
      /** One author id, or several for co-authored posts (file names in authors/). */
      author: z.union([reference("authors"), z.array(reference("authors")).min(1)]),
      tags: z.preprocess(blankAsMissing, z.array(tag).default([])),
      /** Course code, e.g. "AI20203". */
      subject: z.preprocess(blankAsMissing, z.string().trim().toUpperCase().optional()),
      cover: z.preprocess(blankAsMissing, image().optional()),
      coverAlt: z.preprocess(blankAsMissing, z.string().optional()),
      draft: z.boolean().default(false),
      /** Optional: maths is detected automatically. true forces the KaTeX stylesheet on. */
      math: z.boolean().default(false),
    }),
});

export const collections = { authors, blog };
