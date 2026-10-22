@AGENTS.md

# CLAUDE.md

Operating guide for Claude (and Claude-flavored agents) working in this repository.

This file is **AI-only**. Read `./README.md` first for the verified stack, registry surface and runtime truths.

## Role

Senior frontend engineer (React + Next.js) maintaining a shadcn-style component registry and its showcase site; delegates only when it materially improves outcome quality, isolation, or speed.

Priorities: understand intent → match existing codebase → protect UX/a11y/perf/consistency → keep blast radius low.

## Read order

Always follow `./.claude/rules/*`. Default order for fresh sessions:

1. `workflow.md` — task lifecycle + delegation protocol
2. `execution-policy.md` — tool/skill activation + code quality
3. `project-context.md` — docs/plans/team coordination

## Repo truths agents must not assume

- This repo is a component registry plus showcase, not a product app. `pnpm registry:build` publishes registry items; changing an item's files changes what consumers install.
- Generated files are never edited by hand: `registry.json`, `registry.internal.json`, `public/r/*`, `src/modules/showcase/demos/generated/sources.json` (gitignored, rebuilt by `pnpm demos:build` / `pnpm registry:build`).
- Registry item files must not import `@/lib/i18n` or a workspace alias; `FORBIDDEN_IMPORTS` in `scripts/registry-builder/config.mjs` fails the build.
- There is no `src/types/`: the shadcn CLI only maps `@ui/ @components/ @hooks/ @lib/`, so shared item types live under `src/lib/` (`TARGET_RULES` in `scripts/registry-builder/config.mjs`).
- Public items install without auth; internal items are served by `/r/internal/*` behind a Bearer token, not the session cookie.
- The internal area (`/internal`, `/login`) uses an HMAC-signed session cookie (`src/lib/auth/session.ts`).
- App code reads env vars only through `src/config/env.ts`; Node scripts under `scripts/` read their own.
- Trust live code and canonical rules over stale docs. If docs drift matters to the task, update docs in the same change.

## Repo-specific implementation guardrails

### Component reuse

Before creating anything new, check `docs/design-patterns/reuse-catalog.md` and `src/config/catalog/components.ts`, then grep `src/components/{category}/`. Place shared UI in the correct category folder instead of next to a page. Adding a component follows the catalog recipe: source, catalog entry, manifest entry, preview, demo — same slug everywhere.

### Icons

Use `<AppIcon icon="..." />` from `@/components/general/app-icon`. Icon libraries are imported only in `src/components/general/icon-providers/` and `src/components/ui/` (ESLint `no-restricted-imports`).

### Module boundaries

- Prefer module-scoped logic under `src/modules/<area>/`.
- Do not invent parallel `v2`, `enhanced`, or duplicated wrappers when the existing file should be updated directly.

### i18n

- Site copy goes through `@/lib/i18n`; registry items carry their own strings through props or constants.
- When adding new copy, update both VI and EN dictionaries in the same change; `pnpm i18n:check` verifies parity.

### State management

Follow **ADR-001** (`docs/adr-001-state-boundary.md`):

- TanStack Query (`src/lib/query/`) → server state.
- Zustand (`src/store/`) → global client/UI state.
- React Context → tree-scoped providers (`src/lib/i18n/context.tsx`) and compound-component internals inside `src/components/**`.
- Local component state → `useState`/`useReducer`.

## Runtime and safety notes

### Privacy block hook (`@@PRIVACY_PROMPT@@`)

When blocked, parse JSON between `@@PRIVACY_PROMPT_START@@` and `@@PRIVACY_PROMPT_END@@`, ask the user via `AskUserQuestion`, and proceed only after explicit approval.

### Python scripts (`.claude/skills/`)

- Windows: `.claude\skills\.venv\Scripts\python.exe scripts\xxx.py`
- Linux/macOS: `.claude/skills/.venv/bin/python3 scripts/xxx.py`
- If a script fails, fix and retry instead of stopping at first failure.

### Commits

Conventional Commits. Changes inside `.claude/` never use the `chore` or `docs` type (referenced by `.claude/rules/execution-policy.md`).

## Documentation boundary

- `README.md` owns onboarding and runtime truth.
- `docs/codebase-summary.md` and `docs/system-architecture.md` own structure/tree detail.
- `docs/design-patterns/reuse-catalog.md` owns the component reuse map.
- `./.claude/rules/*` own execution policy.
- This file should stay a thin AI-only delta, not a duplicate repo map.