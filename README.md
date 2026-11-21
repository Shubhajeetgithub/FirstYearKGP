# AI Batch 2024 · IIT Kharagpur — Academic Resources

A student-maintained archive of notes, slides, question papers and other study material for the
AI Batch 2024 (Department of Artificial Intelligence, IIT Kharagpur), organised by semester and
subject. It supplements community sites such as CSE 2020, KGPellence and MetaKGP with
material that is hard to find elsewhere.

Live site: <https://ai2024-chi.vercel.app>

## Local setup

Requirements: Node.js 20 or newer.

```sh
git clone https://github.com/Shubhajeetgithub/FirstYearKGP.git
cd FirstYearKGP
npm ci
cp .env_example .env   # then fill in the values below
npm run dev            # http://localhost:5173
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit and component tests (Vitest) |
| `npm run typecheck` | TypeScript, strict mode |
| `npm run lint` | ESLint |
| `npm run images` | Regenerate `public/og.png` and the favicons |

> **Windows:** run the commands from a path with an upper-case drive letter (`E:\FirstYearKGP`,
> not `e:\FirstYearKGP`). Vitest loads two copies of itself when the drive letter's case differs
> and every test file then fails with "failed to find the runner".

## Environment variables

| Name | Required | Description |
|---|---|---|
| `VITE_SHEET_CSV_URL` | yes | The resources Google Sheet, published as CSV (see below) |

The value is public (it ends up in the browser bundle), but keep it out of git anyway so the
sheet can be swapped without a commit. On Vercel, set it under Project → Settings →
Environment Variables.

## Adding resources

All resources live in one Google Sheet. The site reads it as CSV, caches the last good copy in
the browser and refreshes it in the background on every visit.

1. Open the sheet (ask a maintainer for edit access).
2. Add one row per resource:

   | semester | subject_id | subject_name | subject_image | resource_name | resource_url | icon |
   |---|---|---|---|---|---|---|
   | 3 | AI20203 | Design and Analysis of Algorithms | https://… | Class notes | https://drive.google.com/… | book |

   - `semester`: `3` or `s3`.
   - `subject_id`: the course code. Rows with the same code in the same semester form one subject;
     its name and image come from the first such row.
   - `icon`: `book`, `file` or `download` (anything else shows `file`).
   - A row with an empty `resource_name` declares a subject with no resources yet.
3. Make sure links are viewable by anyone with the link.

To publish a new sheet: File → Share → Publish to web → choose the sheet → CSV, and put the URL
in `VITE_SHEET_CSV_URL`.

## Contributing

- Missing or broken material: use the [feedback form](https://forms.gle/bMiuhPwQ4ees6BDQ9).
- Code: fork, branch from `main`, and open a pull request. Before pushing, make sure
  `npm run build`, `npm test` and `npm run typecheck` pass. Use conventional commit messages
  (`feat:`, `fix:`, `chore:`, …).

## Credits

Core contributors: Shubhajeet Das, Kingshuk Patra and Durva Daga.
