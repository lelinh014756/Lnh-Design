---
report_type: generic-doc
generated_at: 2026-10-03T17:45:00+07:00
period: ""
status: draft
source: /Users/lehonglinh/Documents/DIP/Source/Lnh-design
generated_by: report-templates
triggered_by: docs:init
plan_ref: ""
---

# Codebase Summary: Lnh-design

## Overview

Registry UI dùng chung cho các dự án React, theo mô hình shadcn. Repo chứa cả source component (src/) lẫn site showcase (Next.js app) và build system (scripts/).

## Directory Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (landing)/         # Landing pages
│   │   ├── blocks/            # Block showcase routes
│   │   ├── components/        # Component showcase routes
│   │   ├── templates/         # Template showcase routes
│   │   ├── docs/              # Documentation pages
│   │   ├── icons/             # Icon browser (ICON_NAMES qua provider đang active)
│   │   ├── tokens/           # Design token viewer
│   │   ├── internal/          # Internal area (auth-protected)
│   │   ├── preview/           # Preview mode
│   │   ├── r/                # Static registry JSON (public)
│   │   └── api/               # API routes (auth)
│   ├── components/
│   │   ├── ui/               # Primitive shadcn (ẩn khỏi UI)
│   │   ├── general/          # 7 nhóm Ant Design
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── data-entry/
│   │   ├── data-display/
│   │   ├── feedback/
│   │   ├── data-table/       # data-table blocks
│   │   └── table/            # table-core blocks
│   ├── config/catalog/        # Catalog source of truth
│   │   ├── components.ts     # Component definitions
│   │   ├── blocks.ts         # Block definitions
│   │   ├── templates.ts      # Template definitions
│   │   ├── types.ts          # Type definitions
│   │   └── index.ts          # Catalog index
│   ├── modules/
│   │   ├── showcase/         # Showcase app logic
│   │   ├── landing/
│   │   └── auth/
│   ├── layouts/               # Layout components
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   │   ├── i18n/            # VI/EN dictionaries
│   │   ├── auth/            # Auth utilities
│   │   ├── query/            # TanStack Query setup
│   │   ├── registry/         # Registry utilities
│   │   └── tokens/          # Design tokens
│   └── store/               # Zustand stores
├── scripts/
│   ├── registry-builder/     # Registry JSON generator
│   ├── build-demo-sources.mjs # Demo source extractor
│   └── hash-password.mjs     # Password hashing for internal auth
├── public/
│   └── r/                   # Static registry JSON files
└── docs/                    # This documentation
```

## File Counts (src/)

| Directory | Type | Count |
|-----------|------|-------|
| `src/components/ui/` | Primitive shadcn | ~15 |
| `src/components/{general,layout,navigation,data-entry,data-display,feedback,other}/` | App components | ~50 |
| `src/components/data-table/` | Block components | ~10 |
| `src/components/table/` | Block components | ~5 |
| `src/config/catalog/` | Config files | 5 |
| `src/modules/showcase/demos/` | Demo files | ~40 |

## Key Files

| File | Purpose |
|------|---------|
| `scripts/registry-builder/index.mjs` | Registry build entry point |
| `scripts/build-demo-sources.mjs` | Extract demo source code |
| `src/config/catalog/components.ts` | Component catalog definitions |
| `src/config/catalog/blocks.ts` | Block catalog definitions |
| `src/config/catalog/templates.ts` | Template catalog definitions |
| `src/modules/showcase/demos/registry.ts` | Demo registry index |
| `components.json` | shadcn CLI config với registries |
| `registry.json` | Generated catalog (public) |
| `registry.internal.json` | Generated catalog (internal) |

## Component Groups (7 nhóm Ant Design)

1. **General** — `app-button`, `actions-button`, `statistics-card`, `app-card`
2. **Layout** — Header, sidebar, container components
3. **Navigation** — `nav-tree`, breadcrumbs, tabs
4. **Data Entry** — Forms, inputs, `currency-input`
5. **Data Display** — Tables, lists, cards
6. **Feedback** — Toast, dialog, modal, alerts
7. **Other** — Misc components

## Tech Stack

- **Framework**: Next.js 16.3.2 (App Router, RSC)
- **UI**: React 19.2.8, Radix UI primitives, Tailwind CSS
- **State**: Zustand, TanStack Query, nuqs (URL state)
- **Forms**: react-hook-form + zod
- **Tables**: TanStack Table v8
- **DnD**: @dnd-kit
- **Animation**: motion (Framer Motion replacement)
- **i18n**: Custom VI/EN dictionary system
- **Package Manager**: pnpm 10

## Build Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Dev server port 3100 (runs `demos:build` first) |
| `pnpm build` | `demos:build` → `registry:build` → `next build` |
| `pnpm typecheck` | `demos:build` → `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm registry:build` | Generate `public/r/*.json`, `registry.json`, `registry.internal.json` |
| `pnpm demos:build` | Generate `src/modules/showcase/demos/generated/sources.json` |
| `pnpm i18n:check` | Verify VI/EN dictionary parity |

## Change Log

- 2026-10-03: Initial docs generation via `docs:init`
