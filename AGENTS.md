# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds TypeScript source; keep public exports in `src/index.ts` and group features under `src/core/` or `src/utils/`.
- Vitest specs sit in `tests/`, mirroring source paths (`tests/utils.test.ts` pairs with `src/utils/index.ts`).
- Release utilities reside in `scripts/`; avoid runtime code there.
- `dist/` is generated output—never edit by hand. Shared configs stay at the root (`biome.json`, `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`, `bunfig.toml`).

## Build, Test, and Development Commands
- `bun install` installs dependencies; stick to Bun to match the existing lockfile and scripts.
- `bun run lint` / `bun run lint:fix` run Biome linting and formatting.
- `bun run typecheck` executes the strict TypeScript compiler.
- `bun run test`, `bun run test:watch`, and `bun run test:coverage` run Vitest suites and emit V8 coverage.
- `bun run build` compiles via tsdown to ESM/CJS bundles plus declarations; follow with `bun run check:exports` (AreTheTypesWrong) before publishing.
- `bun run ci` chains lint → typecheck → test → build → export checks for reliable local validation.

## Coding Style & Naming Conventions
- Follow Biome defaults: two-space indentation, double quotes in TypeScript, trailing commas where supported, and semicolons omitted.
- Prefer named exports and keep files/folders kebab-case or folder-index pairs.
- Use PascalCase for types and enums, camelCase for values and functions, and SCREAMING_SNAKE_CASE only for true globals.
- Run `bun run lint:fix` before committing so lint-staged produces minimal diffs.

## Testing Guidelines
- Author Vitest specs under `tests/` with `.test.ts` suffixes and descriptive `describe` blocks aligned to exported APIs.
- Maintain ≥90% coverage (enforced via `bunfig.toml`); confirm with `bun run test:coverage` before merging.
- For targeted checks, run `bun run test -- --filter <pattern>` to execute a subset while iterating.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (`type(scope): summary`), as seen in `docs(changeset): …` and `chore(package.json): …`. Keep scopes tied to folders or configs and write concise Mandarin or English summaries.
- Before opening a PR, ensure `bun run ci` passes locally, capture notable output in the description, and link related issues. Add screenshots only when docs or assets change.

## Release & Versioning
- Use Changesets for version bumps: `bunx changeset` to draft notes, then `bun run release:version` to sync versions and changelogs.
- Publish with `bun run release:publish`; the script triggers `prepublishOnly` to rerun the CI chain, so resolve any failing step first.
