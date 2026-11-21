# AI Batch 2024 · IIT Kharagpur — Academic Resources

A student-maintained archive of notes, slides, question papers and other study material for the
AI Batch 2024 (Department of Artificial Intelligence, IIT Kharagpur), plus a student blog. It
supplements community sites such as CSE 2020, KGPellence and MetaKGP with material that is hard
to find elsewhere.

Live site: <https://ai2024-chi.vercel.app>

Everything runs on free tiers: Vercel Hobby (hosting), GitHub (code, content, comments, CI),
Cloudflare Workers (CMS sign-in) and Pagefind (search, built at deploy time).

## Architecture

```text
Google Sheet ──CSV──▶ astro build ──▶ static HTML ──▶ Vercel
 (resources)            │   ▲
                        │   └── src/content/blog/*, src/content/authors/*  ◀── Sveltia CMS (/admin)
                        └──▶ pagefind (search index)                          commits to main via GitHub
```

- **Astro, static output.** Every page is plain HTML built ahead of time. React only runs in
  small islands: the resources explorer (search, cards, semester switching), the site search
  and the cursor glow.
- **Resources** come from a published Google Sheet. The build fetches it, renders every subject
  and link into `/resources/s1`, `/resources/s2`, …, and **fails if the sheet cannot be loaded**,
  so an empty page is never deployed. In the browser, the explorer also refreshes from the
  sheet in the background (cached in `localStorage`), so edits show up before the next build.
  A GitHub Action rebuilds the site every morning.
- **Blog** posts are Markdown in `src/content/blog/<slug>/index.md` (images sit next to the
  post), validated by `src/content.config.ts`. Maths uses KaTeX, loaded only on posts with
  `math: true`. Comments and reactions use Giscus (GitHub Discussions).
- **Search** (`/search`) is Pagefind, indexing blog posts and semester pages at build time.
- **CMS**: Sveltia CMS at `/admin` edits posts and authors and commits straight to the repo.

Key files:

| Path | What it is |
|---|---|
| `astro.config.mjs` | Site URL, integrations, Markdown pipeline |
| `src/config/site.ts` | Site constants, nav, Giscus ids |
| `src/content.config.ts` | Blog and author schemas |
| `src/lib/sheet.ts`, `src/lib/buildSheet.ts` | Sheet parsing, build-time fetch, browser cache |
| `src/pages/` | Routes (`resources/`, `blog/`, `authors/`, `search`, `rss.xml`, `robots.txt`) |
| `public/admin/` | Sveltia CMS (`index.html`, `config.yml`) |
| `.github/workflows/` | Daily rebuild, content check (CI), weekly link check |

## Local development

Requirements: Node.js 22.12 or newer.

```sh
git clone https://github.com/Shubhajeetgithub/FirstYearKGP.git
cd FirstYearKGP
npm ci
cp .env_example .env   # then fill in the values below
npm run dev            # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload (search is not available here) |
| `npm run build` | Production build into `dist/`, then the Pagefind index |
| `npm run preview` | Serve the production build, search included |
| `npm test` | Unit and component tests (Vitest) |
| `npm run typecheck` | `astro check` and `tsc` |
| `npm run lint` | ESLint |
| `npm run images` | Regenerate `public/og.png` and the favicons |
| `npm run check:images` | Warn about images over 500 KB |

No sheet URL? Build against the sample data instead:
`SHEET_CSV_FILE=fixtures/sheet.sample.csv npm run dev`.

> **Windows:** run commands from a path with an upper-case drive letter (`E:\FirstYearKGP`, not
> `e:\FirstYearKGP`). Vitest loads two copies of itself when the drive letter's case differs, and
> every test file then fails with "failed to find the runner".

## Environment variables

| Name | Where | Description |
|---|---|---|
| `SHEET_CSV_URL` | Vercel, `.env`, GitHub repo variable | The resources sheet, published as CSV. Read at build time. **Required**: the build fails without it. |
| `VITE_SHEET_CSV_URL` | Vercel, `.env` | The same URL, used by the browser for the background refresh. Also a build-time fallback. |
| `PUBLIC_VERCEL_ANALYTICS` | Vercel | `true` to load Vercel Web Analytics (enable it in the Vercel dashboard first). |
| `SHEET_CSV_FILE` | CI, local | Path to a local CSV used **only** when no sheet URL is set. Never set it on Vercel. |

GitHub repository settings used by the workflows:

| Name | Kind | Used by |
|---|---|---|
| `VERCEL_DEPLOY_HOOK` | secret | `rebuild.yml`: daily rebuild |
| `SHEET_CSV_URL` | variable (or secret) | `content-check.yml`, `links.yml` |

### Daily rebuild (deploy hook)

Resources are baked into the HTML, so the site rebuilds daily at about 06:00 IST to pick up sheet
edits. In Vercel → Project → Settings → Git → **Deploy Hooks**, create a hook for `main`, then
save its URL as the GitHub secret `VERCEL_DEPLOY_HOOK`. Run the workflow manually (Actions →
Daily rebuild → Run workflow) to publish sheet edits immediately.

## Adding resources

All resources live in one Google Sheet:

| semester | subject_id | subject_name | subject_image | resource_name | resource_url | icon |
|---|---|---|---|---|---|---|
| 3 | AI20203 | Design and Analysis of Algorithms | https://… | Class notes | https://… | book |

- `semester`: `3` or `s3`.
- `subject_id`: the course code. Rows with the same code in the same semester form one subject;
  its name and image come from the first such row.
- `icon`: `book`, `file` or `download` (anything else shows `file`).
- A row with an empty `resource_name` declares a subject with no resources yet.
- Make links viewable by anyone with the link.

To publish a new sheet: File → Share → Publish to web → choose the sheet → CSV. Put the URL in
`SHEET_CSV_URL` and `VITE_SHEET_CSV_URL`.

## Writing for the blog

See [/blog/contribute](https://ai2024-chi.vercel.app/blog/contribute) for the author guide
(frontmatter fields, maths, images). In short:

- **Who:** GitHub users with write access to this repository (Settings → Collaborators).
- **Online:** sign in at `/admin` with GitHub, or with a fine-grained personal access token
  (Contents: read and write, this repository only) if the GitHub button isn't set up.
- **Locally:** `npm run dev`, open <http://localhost:4321/admin/index.html> in Chrome or Edge, and
  choose *Work with Local Repository*.
- **By pull request:** copy `src/content/blog/_template.md` to `src/content/blog/<slug>/index.md`.

### Adding an author

Authors are JSON files in `src/content/authors/`; the file name is the author id used in a post's
`author` field. Create one in the CMS (Authors → New) or by hand:

```json
{
  "name": "Firstname Lastname",
  "github": "their-github-username",
  "role": "Contributor",
  "bio": "One line about you."
}
```

`avatar` (a photo URL) is optional and defaults to the GitHub avatar. `core: true` and `order`
put someone in the home page credits.

### How CMS sign-in works

Sveltia CMS talks to GitHub directly from the browser; there is no server or database. GitHub's
OAuth flow needs a client secret, which lives only in a small Cloudflare Worker
([sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)):

1. The editor clicks *Sign In with GitHub* at `/admin`.
2. The CMS opens the Worker (`base_url` in `public/admin/config.yml`), which redirects to GitHub.
3. GitHub redirects back to `<worker>/callback`; the Worker exchanges the code for a token and
   hands it to the CMS.
4. The CMS commits with that token. GitHub only allows it for users with write access.

Setup: deploy the Worker on the Cloudflare free plan, register a GitHub App (the Worker's README
has a pre-filled link; an OAuth App also works) with callback URL `<worker>/callback` and
Contents + Pull requests read/write permissions, install it on this repository, set
`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (as a secret) and
`ALLOWED_DOMAINS=ai2024-chi.vercel.app` on the Worker, then set `base_url` in
`public/admin/config.yml`.

## Comments

Giscus maps each post's path to a GitHub Discussion in the **Blog Comments** category. The ids in
`src/config/site.ts` come from <https://giscus.app>; comments stay hidden until they are set.

## Contributing code

- Missing or broken material: use the [feedback form](https://forms.gle/bMiuhPwQ4ees6BDQ9).
  A weekly job also files broken links as a GitHub issue.
- Code: branch from `main` and open a pull request. CI runs the typecheck, tests and build. Use
  conventional commit messages (`feat:`, `fix:`, `chore:`, …).

## Credits

Core contributors: Shubhajeet Das, Kingshuk Patra and Durva Daga.
