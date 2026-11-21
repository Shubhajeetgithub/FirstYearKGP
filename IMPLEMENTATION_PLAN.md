# FirstYearKGP — Implementation Plan (for Claude Code)

> **How to use this file:** put it in the repo root as `IMPLEMENTATION_PLAN.md`, then tell Claude Code:
> *"Read IMPLEMENTATION_PLAN.md and carry it out phase by phase. Stop at every step marked 🧑 HUMAN STEP and tell me exactly what to do."*

---

## 0. Context and ground rules

**Repo:** `Shubhajeetgithub/FirstYearKGP`, deployed on Vercel at `https://ai2024-chi.vercel.app`.

**What's there now:** a Vite + React 19 + TypeScript + Tailwind v4 single-page app with React Router.
- `src/pages/Home.tsx` holds `Welcome` and `Credits`.
- `src/pages/Resources.tsx` is a semester sidebar, collapsible subject cards and fuzzy search (`src/utils/search.ts`, Levenshtein distance).
- `src/data/loadSemesterData.ts` fetches a published Google Sheet CSV in the browser. The URL comes from `VITE_SHEET_CSV_URL`.
- `MouseGlow` / `TouchEffect` / `BackGroundFX` are the cursor effects.
- Vitest + Testing Library tests sit next to the components.

**Goal:** migrate to **Astro** (static output) and keep the current look and behaviour. Fix SEO and performance. Add a **Markdown blog** that trusted members edit through **Sveltia CMS** (GitHub login), with **KaTeX** math, **Giscus** comments and reactions, and **Pagefind** search. **Everything must stay on free tiers** (Vercel Hobby, GitHub, Cloudflare Workers free, Giscus).

**Rules for Claude Code**
1. Work on a branch `astro-migration`, with one commit (or a few) per phase, and conventional commit messages (`feat:`, `fix:`, `chore:`). Do not push to `main`.
2. After each phase, run `npm run build`, `npm test` and `npm run typecheck`. All must pass before the next phase starts.
3. Use the **latest stable** Astro and official integrations (`npm create astro@latest` / `npx astro add …`). Check the current Astro docs for API changes rather than relying on memory (content collections / `glob()` loader, `astro:content`, `<ClientRouter />`, etc.).
4. Keep the existing visual design: dark `#07070a` background, indigo/purple accents, glassy cards, pill nav. No redesign.
5. Never commit secrets. The sheet URL stays in an env var. OAuth secrets live only in Cloudflare.
6. At a 🧑 HUMAN STEP, stop and print clear instructions. Continue only when the user says it's done, or stub it with a clearly marked placeholder and carry on.

---

## Phase 1 — Quick fixes on the current Vite app (small, safe PR first)

Ship these before the migration, so production improves even if the migration takes a while. Do it on a separate branch `quick-fixes`.

1. **Favicon:** in `index.html`, `href="public/ai.png"` → `href="/ai.png"` and `type="image/png"`.
2. **Title and meta:**
   - Title: `AI Batch 2024 · IIT Kharagpur — Academic Resources`.
   - Rewrite the description so it doesn't promise timetables or announcements that don't exist.
   - Delete `<meta name="keywords">`.
   - Add Open Graph and Twitter tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:type=website`, `twitter:card=summary_large_image`) and `<link rel="canonical">`.
   - Add `<meta name="theme-color" content="#07070a">`.
3. **OG image:** create `public/og.png` (1200×630, dark background, the site title in indigo/purple gradient text). Generating it with a small script is fine (e.g. `satori` + `@resvg/resvg-js` as dev deps, or an SVG converted to PNG).
4. **robots.txt and sitemap:** move both into `public/` and change every URL to `https://ai2024-chi.vercel.app`. Add `/resources` to the sitemap.
5. **MouseGlow performance:** stop storing the cursor in React state. Use a `ref` to a fixed overlay div, and update `--x` / `--y` CSS custom properties inside a `requestAnimationFrame`-throttled `mousemove` listener. The background becomes `radial-gradient(circle at var(--x) var(--y), …)`. The children must **not** re-render on mouse move. Respect `prefers-reduced-motion` (no glow).
6. **TouchEffect:** rename `handleTouchMove` → `handleTouchStart`, mark the listener `{ passive: true }`, and skip it under `prefers-reduced-motion`.
7. Remove `console.log` from `BackGroundFX.tsx`.
8. **Accessibility bug in `Resources.tsx`:** the "View in semester →" `<span onClick>` sits inside the card's `<button>` (nested interactive content). Move it outside the toggle button as a real `<button type="button">` in the card footer.
9. **Sheet caching:** in `loadSemesterData.ts`, add stale-while-revalidate.
   - Store the raw CSV text and a timestamp in `localStorage` under `kgp:sheet:v1`, wrapped in try/catch.
   - On load, return the cached data immediately if it exists, then fetch fresh data in the background and update.
   - Show the error screen only if there is no cache *and* the fetch fails.
   - Add tests for these paths.
10. Delete the empty `src/components/notificationSystem.ts`.
11. Rewrite `README.md`: what the site is, local setup, env vars, how to add resources to the sheet, and how to contribute.

✅ **Done when:** build, tests and typecheck pass. The favicon shows on `/` and `/Resources`. `/robots.txt` and `/sitemap.xml` are served by `vite preview`. React DevTools Profiler shows no re-renders on mouse move.

---

## Phase 2 — Migrate to Astro (static output)

### 2.1 Scaffold
- Set up Astro in the repo, replacing the Vite app config: `astro`, `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/mdx`, and Tailwind v4 through `@tailwindcss/vite` in `astro.config.mjs` (`vite.plugins`).
- `output: 'static'`, `site: 'https://ai2024-chi.vercel.app'`, `trailingSlash: 'never'`.
- No server adapter is needed (pure static on Vercel). Add `@astrojs/vercel` only if a later step truly needs it.
- Keep `public/ai.png` and `public/og.png`. Delete `public/robots.txt` and the old sitemap: generate robots via `src/pages/robots.txt.ts` and the sitemap via `@astrojs/sitemap`.
- Update `package.json` scripts: `dev: astro dev`, `build: astro build && pagefind --site dist` (Pagefind comes in Phase 4; add it then), `preview: astro preview`, `typecheck: astro check && tsc --noEmit`, `test: vitest run`.
- Configure Vitest with Astro's `getViteConfig()` so the existing tests keep working.
- Delete `vercel.json`'s SPA catch-all rewrite. Replace it with:
  ```json
  { "redirects": [ { "source": "/Resources", "destination": "/resources", "permanent": true } ] }
  ```
  Also set `trailingSlash: false` and `cleanUrls: true`.

### 2.2 Layout and SEO component
- `src/layouts/BaseLayout.astro` takes the props `title`, `description`, `image?`, `type?: 'website'|'article'`, `publishedTime?`, `noindex?`.
- It renders the canonical URL (`new URL(Astro.url.pathname, Astro.site)`), OG/Twitter tags, the favicon, theme-color, and an RSS `<link rel="alternate">`.
- It renders the pill nav (Home, Resources, **Blog**) as plain `<a>` tags. Mark the active item with `aria-current="page"`, using the same styling as `App.tsx`.
- Add a small footer with the feedback form link, the GitHub repo link, and "Write for us" → `/blog/contribute`.
- Mount the background effect as a React island: `<BackgroundFX client:idle />`, now as an overlay sibling rather than a wrapper around the content.
- Optional: `<ClientRouter />` for view transitions, but only if it doesn't break the islands or Giscus. Otherwise skip it.

### 2.3 Pages
- `src/pages/index.astro`: render `Welcome` and `Credits`.
  - Convert `Credits` to static `.astro` markup (no JS).
  - Keep `Welcome` as a React island (`client:visible`) only because of the typing animation. Better still, make it a static `.astro` component with a CSS-only typing animation.
  - Link "Browse Resources" to `/resources`.
- `src/pages/resources/index.astro` and `src/pages/resources/[semester].astro` (`s1`…`sN`):
  - **Fetch the Google Sheet at build time** in frontmatter, reusing `rowsToSemesterData`. Move it to `src/lib/sheet.ts` and export both functions. The sheet URL comes from `import.meta.env.SHEET_CSV_URL` (server-side env, so no `VITE_` prefix is needed. Keep `VITE_SHEET_CSV_URL` as a fallback for the client refresh).
  - Render every subject and resource link as **real HTML**, so crawlers and Pagefind can see it.
  - Hydrate an interactive `ResourcesExplorer` React island (`client:load`), passing it the build-time data as props. It keeps the search box, collapsible cards and semester switching.
  - Lucide icon components can't be passed as props from Astro. Pass the icon *name* string (`'book'|'file'|'download'`) and map it inside the island. Update the `Subject`/`Resource` types to match.
  - The island may optionally do a background refresh from the CSV URL (the Phase 1 SWR logic), so sheet edits show up before the next rebuild.
  - Sync state to the URL: `/resources/s3` is the semester page, and `?q=daa` pre-fills search (read on mount, update with `history.replaceState`).
  - Each semester page gets its own `<title>` and description (e.g. "Semester 3 resources — AI Batch 2024, IIT KGP").
  - Show a "Last updated: <build date>" line.
- `src/pages/404.astro`: a styled not-found page with links home, to resources and to the blog.
- If the sheet fetch fails **at build time**, fail the build loudly with a clear message. Never deploy an empty resources page.

### 2.4 Keep the sheet fresh (free)
- 🧑 HUMAN STEP: in Vercel → Project → Settings → Git → **Deploy Hooks**, create a hook. Add its URL as a GitHub repo secret `VERCEL_DEPLOY_HOOK`. Add `SHEET_CSV_URL` (and `VITE_SHEET_CSV_URL`) to Vercel environment variables.
- `.github/workflows/rebuild.yml`: `on: schedule: cron '30 0 * * *'` (≈ 06:00 IST daily) plus `workflow_dispatch`. It runs `curl -X POST "$VERCEL_DEPLOY_HOOK"`.

### 2.5 Port tests
- Move the existing tests to the new file locations. Update them where components became `.astro` (test the pure functions in `src/lib/sheet.ts` and `src/utils/search.ts`, and the React islands with Testing Library).
- Add a test that `rowsToSemesterData` produces icon *names*.

✅ **Done when:** `astro build` produces static HTML in which `curl https://<preview>/resources/s1 | grep <a known subject name>` matches. Lighthouse (mobile) on `/` and `/resources` scores ≥ 90 for Performance, Accessibility, Best Practices and SEO. `/Resources` → 308 → `/resources`. `/sitemap-index.xml` and `/robots.txt` exist. Search and card toggling still work.

---

## Phase 3 — Blog (Markdown, content collections, KaTeX)

### 3.1 Content model
`src/content.config.ts` defines two collections with the `glob()` loader:

**authors** in `src/content/authors/*.json`:
```ts
{ name: string; github: string; avatar?: string; bio?: string; role?: string }
```
Seed it with the three current credits (Shubhajeet Das, Kingshuk Patra, Durva Daga), using their GitHub-hosted photos. Also refactor the home-page `Credits` to read from this collection.

**blog** in `src/content/blog/*.md` (MDX allowed):
```ts
{
  title: string;
  description: string;            // ≤ 160 chars, used for meta/OG
  pubDate: Date;
  updatedDate?: Date;
  author: reference('authors');   // or array of references for co-authors
  tags: string[];                 // lowercase, e.g. ["signals", "fourier"]
  subject?: string;               // optional course code, e.g. "AI20203"
  cover?: image();                // optional
  draft: boolean (default false);
  math: boolean (default false);  // load KaTeX CSS only when true
}
```
Exclude drafts from production builds (`import.meta.env.PROD && data.draft`).

### 3.2 Markdown pipeline
- `remark-math` + `rehype-katex` in the `markdown` config (and MDX). Load `katex/dist/katex.min.css` **only** on posts with `math: true` (import it in the post layout conditionally, or self-host the CSS and fonts from `public/`).
- Use Shiki syntax highlighting (built in) with a dark theme that matches the site (e.g. `github-dark-dimmed`).
- `rehype-slug` + `rehype-autolink-headings` for heading anchors.
- Compute reading time with a small remark plugin that writes `minutesRead` into frontmatter.
- External links get `target="_blank" rel="noopener noreferrer"` (`rehype-external-links`).

### 3.3 Pages and components
- `/blog` (`src/pages/blog/index.astro`): list of posts, newest first, as cards (title, description, author avatar and name, date, reading time, tags), with a tag filter row. Paginate at 10 per page with `/blog/page/[n]`, using Astro `paginate()`.
- `/blog/[...slug]`: the post page, with `BlogPostLayout.astro` providing:
  - title, meta line, cover image, and a table of contents from `headings` (sticky on desktop, collapsible on mobile)
  - a prose body styled with `@tailwindcss/typography` (`prose prose-invert`, indigo links, styled `code`/`pre`, and KaTeX display blocks that scroll horizontally on mobile)
  - an "Edit this post on GitHub" link and a "Last updated" date
  - prev/next post links and an author card
  - the Giscus comments slot (Phase 5)
  - JSON-LD `BlogPosting` structured data, and `type="article"` OG tags with `article:published_time` and `article:author`
- `/blog/tags/[tag]`: posts by tag. `/blog/tags`: all tags with counts.
- `/authors/[id]`: the author profile with their posts (Codeforces-style "blog of user").
- `/rss.xml` via `@astrojs/rss`.
- `/blog/contribute`: a static page explaining how trusted members write posts (CMS login at `/admin`, or a pull request), the frontmatter fields, how to write math (`$…$` and `$$…$$`), and the image size guideline.
- Home page: add a "Latest from the blog" section with the 3 newest posts.

### 3.4 Seed content
- One real sample post: `src/content/blog/fourier-tricks-for-signals.md`, with `math: true`, a few inline and display equations (e.g. the Fourier transform pair, the convolution theorem, Parseval's theorem), a code block and an image. This proves the whole pipeline works. Mark it `draft: true` if the user wants to write the real one themselves.
- Add `src/content/blog/_template.md` (excluded from the glob by its `_` prefix) showing every frontmatter field.

✅ **Done when:** the sample post renders math correctly on desktop and mobile without layout overflow. KaTeX CSS loads only on math posts. Tag, author, RSS and pagination pages build. The posts appear in the sitemap. `astro check` is clean.

---

## Phase 4 — Search (Pagefind)

- Install `pagefind` as a dev dependency. The build script becomes `astro build && pagefind --site dist`.
- Index blog posts and resource pages:
  - Add `data-pagefind-body` to the main content of blog posts and resource pages only, so the nav and footer aren't indexed.
  - Add `data-pagefind-filter="type:blog"` / `type:resource` and `data-pagefind-meta` for title and date.
- `src/pages/search.astro`: a search page using Pagefind's UI (or a small custom React island over `pagefind.js`), styled to match the dark theme, with a type filter. Add a search icon to the nav that links to `/search`, and keyboard shortcut `/` to focus it.
- The existing fuzzy subject search on `/resources` stays as it is; Pagefind is the site-wide search.

✅ **Done when:** after `npm run build && npm run preview`, searching "fourier" finds the sample post and searching a subject code finds its resource page.

---

## Phase 5 — Comments and reactions (Giscus)

- 🧑 HUMAN STEP:
  1. Make sure the repo is **public**.
  2. Enable **Discussions** (repo → Settings → Features).
  3. Create a Discussion category **"Blog Comments"** of type *Announcement*, so only Giscus and maintainers can create threads.
  4. Install the giscus GitHub App on the repo: https://github.com/apps/giscus
  5. Go to https://giscus.app, enter the repo, and copy `data-repo-id` and `data-category-id`.
- Put the IDs in `src/config/site.ts` (they aren't secret) along with other site constants (site name, URL, repo, feedback form URL).
- `src/components/Comments.astro` loads the Giscus `<script>` lazily with these settings:
  - `data-mapping="pathname"`, `data-strict="1"`, `data-reactions-enabled="1"`
  - `data-emit-metadata="0"`, `data-input-position="top"`, `data-theme="transparent_dark"` (or a custom theme CSS in `public/giscus-theme.css` matching indigo), `data-lang="en"`, `data-loading="lazy"`
  - Render it only on blog posts (not resources), below the post.
- If `<ClientRouter />` is used, re-initialise Giscus on `astro:page-load`.
- Optional: show reaction and comment counts on `/blog` cards using the GitHub GraphQL API at **build time** with a `GITHUB_TOKEN` (read-only, public data). Skip this if it complicates the build, since reactions inside each post are enough.

✅ **Done when:** a test comment and a 👍 reaction posted on the preview deployment show up in GitHub Discussions under "Blog Comments".

---

## Phase 6 — CMS for trusted authors (Sveltia CMS, GitHub backend)

**Trust model:** "trusted members" = GitHub users with **write access** to the repo (Settings → Collaborators). GitHub handles all auth, there is no database, and every post is a git commit (history, rollback, review).

### 6.1 Admin app
- `public/admin/index.html`, a plain static file, **not** an `.astro` page (Sveltia's docs warn that framework pages can break the CMS UI):
  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex" />
      <title>Content Manager · AI Batch 2024</title>
    </head>
    <body>
      <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
    </body>
  </html>
  ```
  (Per Sveltia's docs: no `type="module"` and no version pin in the URL.)
- `public/admin/config.yml`:
  ```yaml
  backend:
    name: github
    repo: Shubhajeetgithub/FirstYearKGP
    branch: main
    base_url: https://sveltia-cms-auth.<SUBDOMAIN>.workers.dev   # from 6.2
  site_url: https://ai2024-chi.vercel.app
  media_folder: public/images/blog
  public_folder: /images/blog
  collections:
    - name: blog
      label: Blog posts
      folder: src/content/blog
      create: true
      slug: "{{slug}}"
      extension: md
      format: frontmatter
      fields:
        - { name: title, label: Title, widget: string }
        - { name: description, label: Description, widget: text }
        - { name: pubDate, label: Published, widget: datetime }
        - { name: updatedDate, label: Updated, widget: datetime, required: false }
        - { name: author, label: Author, widget: relation, collection: authors, value_field: "{{slug}}", search_fields: [name], display_fields: [name] }
        - { name: tags, label: Tags, widget: list }
        - { name: subject, label: Course code, widget: string, required: false }
        - { name: cover, label: Cover image, widget: image, required: false }
        - { name: math, label: Uses math (KaTeX), widget: boolean, default: false }
        - { name: draft, label: Draft, widget: boolean, default: true }
        - { name: body, label: Body, widget: markdown }
    - name: authors
      label: Authors
      folder: src/content/authors
      create: true
      extension: json
      format: json
      fields:
        - { name: name, label: Name, widget: string }
        - { name: github, label: GitHub username, widget: string }
        - { name: avatar, label: Avatar URL, widget: string, required: false }
        - { name: role, label: Role, widget: string, required: false }
        - { name: bio, label: Bio, widget: text, required: false }
  ```
  Check every field against the current Sveltia CMS docs (https://sveltiacms.app/en/docs) and adjust names and options where they differ. Make sure the relation's `value_field` matches how `reference('authors')` resolves IDs (the file name without extension).
- Exclude `/admin` from the sitemap and Pagefind, and add `Disallow: /admin` to robots.

### 6.2 OAuth (free, Cloudflare Workers)
- 🧑 HUMAN STEP:
  1. Deploy https://github.com/sveltia/sveltia-cms-auth to Cloudflare Workers (free plan), either with its "Deploy to Cloudflare" button or with `npx wrangler deploy`. Note the Worker URL.
  2. Create a GitHub OAuth App (github.com → Settings → Developer settings → OAuth Apps). Set Homepage URL to the site and **Authorization callback URL** to `<WORKER_URL>/callback`.
  3. In the Worker settings, add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (as a secret) and `ALLOWED_DOMAINS=ai2024-chi.vercel.app` (add `localhost` while testing if needed).
  4. Put the Worker URL into `base_url` in `config.yml`.
- Fallback with no Worker: Sveltia also lets a user sign in with a GitHub personal access token. Document this on `/blog/contribute` as plan B.
- Local editing: document Sveltia's local-repository workflow (`npm run dev`, open `http://localhost:4321/admin/`, "Work with Local Repository").

### 6.3 Guard rails (free)
- `.github/workflows/content-check.yml` runs on PRs and on pushes to `main` that touch `src/content/**` or `public/images/blog/**`. It runs `npm ci && npm run typecheck && npm run build`, so a bad frontmatter field fails CI. Vercel won't auto-deploy a broken build anyway.
- Add `CODEOWNERS` (`src/content/blog/ @Shubhajeetgithub`) for review notifications.
- On `/blog/contribute`, state that new authors must first add themselves to `authors/`.
- Image guideline: ≤ 300 KB, use WebP. Optionally add a CI step that warns on images > 500 KB.

✅ **Done when:** a collaborator can log in at `/admin`, create a post with an equation and an image, and save it. The commit appears on `main`. Vercel redeploys. The post renders at `/blog/<slug>` with math, comments and search.

---

## Phase 7 — Hardening, link health, docs

1. **Link checker:** `.github/workflows/links.yml`, weekly cron plus `workflow_dispatch`, using `lycheeverse/lychee-action` on `dist/` (after a build) or on the resource URLs in the sheet. On broken links, open or update a GitHub issue "Broken resource links" listing them (`peter-evans/create-issue-from-file`). Exclude Google Drive URLs that need sign-in if they produce false positives.
2. **Security headers** in `vercel.json`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone and geolocation off). Add a CSP **only** if it is verified to allow giscus.app, unpkg.com (for `/admin`), the Google Sheets CSV origin, and GitHub avatars. Skip CSP otherwise.
3. **Analytics (optional, free):** enable Vercel Web Analytics with `@vercel/analytics`. 🧑 HUMAN STEP: turn it on in the Vercel dashboard.
4. **Accessibility pass:**
   - visible focus rings everywhere
   - colour contrast ≥ 4.5:1 for body text (check `text-slate-500` on dark backgrounds)
   - a skip-to-content link
   - `prefers-reduced-motion` disables the glow, typing animation and fade-ins
5. **Docs:** update `README.md` with architecture, local dev, env vars (`SHEET_CSV_URL`, `VITE_SHEET_CSV_URL`), the deploy hook, how the CMS auth works, and how to add an author. Update `.env_example`.
6. **Final verification:** run Lighthouse on `/`, `/resources`, `/blog` and one post (all ≥ 90 on mobile), the full test suite, `astro check`, and a manual check on a phone-sized viewport. Then open one PR `astro-migration` → `main` with a summary, before/after Lighthouse scores, and a checklist of the 🧑 HUMAN STEPs.

---

## Appendix A — Target file tree (key files)

```
.github/workflows/{rebuild.yml, content-check.yml, links.yml}
public/
  admin/{index.html, config.yml}
  images/blog/
  ai.png  og.png
src/
  config/site.ts
  content.config.ts
  content/
    authors/*.json
    blog/*.md
  components/
    BackgroundFX.tsx  MouseGlow.tsx  TouchEffect.tsx
    ResourcesExplorer.tsx  SubjectCard.tsx
    Nav.astro  Footer.astro  SEO.astro  Comments.astro
    PostCard.astro  AuthorCard.astro  TOC.astro  Credits.astro  Welcome.(astro|tsx)
  layouts/{BaseLayout.astro, BlogPostLayout.astro}
  lib/{sheet.ts, readingTime.ts}
  utils/search.ts
  pages/
    index.astro  404.astro  search.astro  robots.txt.ts  rss.xml.ts
    resources/{index.astro, [semester].astro}
    blog/{index.astro, [...slug].astro, contribute.astro, page/[page].astro, tags/index.astro, tags/[tag].astro}
    authors/[id].astro
astro.config.mjs  vercel.json  IMPLEMENTATION_PLAN.md
```

## Appendix B — Checklist of 🧑 HUMAN STEPs

- [ ] Vercel: add `SHEET_CSV_URL` and `VITE_SHEET_CSV_URL` env vars; create a Deploy Hook and save it as GitHub secret `VERCEL_DEPLOY_HOOK` (Phase 2.4)
- [ ] GitHub: repo public, Discussions on, "Blog Comments" announcement category, giscus app installed, IDs copied (Phase 5)
- [ ] Cloudflare: deploy `sveltia-cms-auth`; GitHub OAuth App with callback `<worker>/callback`; Worker env vars set (Phase 6.2)
- [ ] GitHub: add trusted authors as collaborators with Write access (Phase 6)
- [ ] Vercel: enable Web Analytics (optional, Phase 7)

## Appendix C — Cost check (all free)

| Piece | Service | Free-tier note |
|---|---|---|
| Hosting and builds | Vercel Hobby | Static site, a daily rebuild is fine |
| Auth for authors | GitHub OAuth via Cloudflare Worker | Workers free plan is far more than enough |
| Content storage | Git repo | No database to pause or back up |
| Comments and reactions | Giscus (GitHub Discussions) | Free and open source |
| Search | Pagefind | Runs at build time, no server |
| CI, link checks, cron | GitHub Actions | Free for public repos |