# CLAUDE.md: JavaScript to TypeScript Migration

## Goal

Migrate this React app (Vite, deployed on Vercel) from JavaScript to well-designed, strictly typed TypeScript. The app must behave exactly as it does today. This is a type migration, not a rewrite: do not change features, UI, or logic unless a real bug blocks typing (see "Bugs found along the way").

"Well written" means the types describe the domain accurately, not merely that the compiler is silenced.

## Definition of done

All of these must pass before the work is considered complete:

1. `npx tsc --noEmit` passes with `"strict": true` and zero errors.
2. `npm run build` passes (this is what Vercel runs).
3. `npm test -- --run` passes.
4. No `.js` or `.jsx` source files remain in `src/`, except config files that must stay JS.
5. The forbidden-patterns grep below returns nothing.
6. The app renders and behaves the same as on `main` (compare against the Vercel preview of `main`).

## Hard rules

### Forbidden (never use these to silence an error)

- `any` (explicit or implicit)
- `// @ts-ignore`, `// @ts-nocheck`, `// @ts-expect-error`
- `as unknown as X` double casts
- Non-null assertions (`!`) unless a comment on the same line explains why the value cannot be null
- Disabling or loosening `strict` flags in `tsconfig.json`
- Loosening ESLint rules to hide type problems

If you are tempted to use one, stop and write a real type, a type guard, a discriminated union, or a narrowing check instead. If it truly cannot be done, leave a `// TODO(types): <reason>` and list it in your final report. Do not hide it.

### Required practices

- `"strict": true` from the very first commit. Do not migrate loosely and tighten later.
- Prefer `interface` for object shapes and `type` for unions, intersections, and mapped types.
- Use literal unions or `as const` objects instead of bare `string` when a value comes from a fixed set.
- Use `unknown` plus narrowing for untrusted data (fetched JSON, `localStorage`, URL params), never `any`.
- Type function parameters and return values explicitly on all exported functions. Let inference handle local variables.
- Type React props with a named `interface XProps`. Do not use `React.FC`.
- Type hooks fully: `useState<T>`, `useRef<T | null>`, and event handlers (`React.ChangeEvent<HTMLInputElement>` etc.).
- Keep shared domain types (for example `Subject`, `Semester`) in one place, such as `src/types/`, and import them. Do not redeclare the same shape in multiple files.
- Derive types from data where possible (`typeof`, `as const`, `ReturnType`) so data and types cannot drift apart.
- Use `import type { ... }` for type-only imports.

## Order of work

Work in small steps. Each step is its own commit, and `npm run build` must be green after every commit.

1. **Tooling:** install `typescript`, `@types/react`, `@types/react-dom`, `@types/node` (if needed). Add `tsconfig.json` (and `tsconfig.node.json` if using the Vite template layout) with `strict: true`. Rename `vite.config.js` to `vite.config.ts`. Update the `index.html` script path (`main.jsx` to `main.tsx`). Verify `build` and `dev` still work.
2. **Domain types:** read the data files and define the core types first (`src/types/`). Everything else builds on these.
3. **Pure utilities (`src/utils/`):** for example search, Levenshtein, and acronym logic. Convert these first because they are the easiest to verify. **Write or confirm tests before converting each one** and keep them passing.
4. **Custom hooks.**
5. **Leaf components** (no child components), then **parent components**, then **pages and the root `App`**.
6. **Cleanup:** remove `allowJs` if it was used temporarily, remove unused deps, make sure `package.json` scripts are correct.

Do one directory or a handful of files per commit. Do not convert the whole repo in one diff.

## Tests

- The test runner is Vitest. Tests live beside their source as `*.test.ts` or `*.test.tsx`.
- Before converting a module that has no tests, add tests that capture its **current** behavior, including edge cases (empty input, `null`/`undefined`, duplicates, boundaries). Commit them against the JS version first.
- Converted code must pass the same tests with no changes to expected values. If a test must change, explain why in the commit message.
- Never delete or weaken a test to get green.

## Bugs found along the way

The migration will expose real bugs (for example missing `id`s, `null` handling, wrong return types).

- **Do not silently fix them** and do not silently preserve them.
- Add a failing test or a clearly marked test that documents the bug, keep behavior unchanged in the migration commit, and list the bug in the final report.
- Fix bugs only in separate, clearly labeled commits after the migration is done, and only if asked.

## Deployment safety (Vercel)

- Work on a branch named `ts-migration`. Never push to `main`.
- Do not change environment variables, project settings, `vercel.json`, or the build output directory.
- The build command and output directory must stay the same as today. Check `package.json` scripts and Vercel settings before changing anything.
- Before opening a PR, confirm `npm run build` passes locally. The Vercel preview deployment is the final check.

## Final verification

Run this and make sure it prints nothing:

```bash
grep -rnE "(@ts-ignore|@ts-nocheck|@ts-expect-error|as unknown as|: any\b|<any>|as any\b)" src/
```

Then run all three checks:

```bash
npx tsc --noEmit && npm run build && npm test -- --run
```

## Final report (required)

When finished, write a summary containing:

1. What was converted (files and counts).
2. Every `TODO(types)` left and why.
3. Every place where a type is intentionally loose, with the reason.
4. Bugs discovered (with file and line) and whether they are fixed or documented.
5. Any config or dependency changes.
6. Anything you were unsure about and want a human to review.

## Working style

- Ask before making any architectural change (renaming exports, moving files, changing public component APIs).
- If a type error reveals that the code is ambiguous or wrong, explain it instead of casting around it.
- Prefer small, readable diffs over clever types. Avoid deep conditional or recursive types unless they clearly reduce duplication.
- Do not reformat unrelated code, rename variables, or "improve" logic during this migration.