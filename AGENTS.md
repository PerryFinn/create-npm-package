# Repository Guidelines

Use this guide to align contributions with the project's conventions.

## Project Structure & Module Organization

Source lives in `src/`; expose public APIs via `src/index.ts` and group features under `src/core/` or `src/utils/`. Tests mirror source paths inside `tests/` (e.g. `tests/utils.test.ts` targets `src/utils/index.ts`). Automation scripts belong in `scripts/`; no runtime logic there. Generated bundles land in `dist/` and must stay untouched. Shared configs (`biome.json`, `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`, `bunfig.toml`) sit at the repository root.

## Build, Test, and Development Commands

Install dependencies with `bun install`. Run `bun run lint` or `bun run lint:fix` for Biome checks, and `bun run typecheck` for strict TypeScript validation. Execute unit tests through `bun run test`; add `-- --watch` while iterating and `bun run test:coverage` before merging. Build distributables with `bun run build`, verify exported types via `bun run check:exports`, and rely on `bun run ci` for the full lint → typecheck → test → build flow.

## Coding Style & Naming Conventions

Stick to Biome defaults: two-space indentation, double quotes in TypeScript, trailing commas where supported, and no semicolons. Favor named exports and keep folders kebab-case or folder-index pairs. Use PascalCase for types and enums, camelCase for runtime identifiers, and reserve SCREAMING_SNAKE_CASE for true globals. Run `bun run lint:fix` prior to commit to keep diffs tidy.

## Testing Guidelines

Vitest powers the suite. Create `.test.ts` specs under `tests/` with descriptive `describe` blocks that reflect the exported function or module. Maintain ≥90% coverage; confirm with `bun run test:coverage`. Focus on modules while iterating using `bun run test -- --filter <pattern>` and capture edge cases alongside happy paths.

## Commit & Pull Request Guidelines

Follow Conventional Commits such as `feat(core): add formatter` or `docs(changeset): update release notes`, using scopes that match directories or tooling. Before opening a PR, ensure `bun run ci` passes, summarize notable output, link related issues, and include screenshots only for documentation or asset changes. Keep PRs small, reference this guide when mentoring contributors, and note any follow-up work.

## Release & Versioning

Manage versions with Changesets: call `bunx changeset add` to capture changes, then `bun run release:version` to sync versions and changelogs. Publish via `bun run release:publish`; it triggers `prepublishOnly`, so rerun the full CI chain locally until it passes.
