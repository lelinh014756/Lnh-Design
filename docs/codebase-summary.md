---
report_type: codebase-summary
generated_at: "2026-10-18T10:37:33+07:00"
period: ""
status: current
source: "/Users/lehonglinh/Documents/DIP/Source/Lnh-design"
generated_by: "docs-manager"
triggered_by: "docs:update"
---

# Codebase Summary: Lnh-design

## Overview

Registry UI dùng chung cho các dự án React, theo mô hình shadcn (style `radix-mira`). Repo chứa cả source component (`src/`), site showcase (Next.js App Router) và build system (`scripts/`). Registry JSON sinh tự động từ source nên demo không thể lệch với nội dung phát hành.

Quy mô catalog (xác minh 2026-10-18): **92 registry item** = 83 component (48 primitive + 35 cấp app) + 8 block + 1 template (internal).

## Directory Structure

```
/
├── .github/workflows/pr-check.yml # CI PR: lint, typecheck, build
├── .vscode/settings.json      # Format on save bằng Prettier
├── .prettierrc / .prettierignore / .nvmrc (Node 24) / pnpm-workspace.yaml
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (landing)/         # Trang chủ landing
│   │   ├── blocks/            # /blocks, /blocks/[category], /blocks/[category]/[slug]
│   │   ├── components/        # /components, /components/[slug]
│   │   ├── templates/         # /templates, /templates/[slug]
│   │   ├── docs/              # Trang tài liệu cài đặt
│   │   ├── icons/             # Icon browser (ICON_NAMES qua provider đang active)
│   │   ├── tokens/            # Design token viewer
│   │   ├── internal/          # Khu nội bộ (sau cổng session của proxy.ts)
│   │   ├── login/             # Trang đăng nhập nội bộ
│   │   ├── preview/[name]/    # Iframe preview theo slug catalog
│   │   ├── r/                 # public/r (registry JSON tĩnh) + /r/internal/[name] (API, kiểm Bearer)
│   │   └── api/auth/          # login, logout (route handlers)
│   ├── components/
│   │   ├── ui/               # 48 primitive shadcn (ẩn khỏi sidebar, vẫn trong registry)
│   │   ├── general/          # App-level: app-button, actions-button, app-icon, icon-providers/
│   │   ├── layout/           # app-card, statistics-card, chart-card…
│   │   ├── navigation/       # nav-item-recursive
│   │   ├── data-entry/       # app-input, floating-input, status-switch…
│   │   ├── data-display/     # app-stepper/ (thư mục), badge-status, marquee…
│   │   ├── feedback/         # app-dialog, app-sheet, fallback-shell…
│   │   ├── other/            # theme-toggle-provider
│   │   ├── illustrations/    # Bộ hình minh hoạ empty/error/loading (token màu)
│   │   ├── data-table/       # Block: data-table (port từ tablecn)
│   │   └── table/            # Block: table-core, table-chrome
│   ├── config/
│   │   ├── env.ts             # Điểm đọc env duy nhất của app (APP_* constants)
│   │   ├── registry.ts        # Namespace + URL registry dùng cho snippet cài đặt
│   │   ├── site.ts            # siteConfig: tên, domain, repo
│   │   ├── catalog/           # Source of truth: components.ts, blocks.ts, templates.ts, types.ts, index.ts
│   │   └── nav/               # Điều hướng showcase
│   ├── modules/
│   │   ├── showcase/          # components/ (16), demos/ (9 slug, 37 file demo), previews/ (live iframe)
│   │   ├── landing/           # Logic trang chủ
│   │   └── auth/              # components/ cho block auth-login
│   ├── layouts/
│   │   ├── showcase/          # shell, header, footer, catalog-sidebar, command-search…
│   │   └── landing/           # shell, header (+client), footer, use-scrolled
│   ├── hooks/                 # 10 hook gốc + table/ (use-table-core và friends)
│   ├── lib/
│   │   ├── i18n/             # VI/EN dictionaries (15 file JSON namespaced mỗi locale)
│   │   ├── auth/             # Session cookie (verifySession dùng bởi proxy.ts)
│   │   ├── query/            # TanStack Query client (browser/server, CACHE_DURATIONS)
│   │   ├── registry/         # Nạp registry JSON lúc runtime cho showcase
│   │   ├── table/            # types, column-utils, style-utils, localization cho table-core
│   │   └── tokens/           # Design tokens
│   ├── store/
│   │   └── appearance-store.ts # Zustand duy nhất: sidebarStyle (persist localStorage)
│   └── proxy.ts               # Cổng session cho /internal/** (Next 16 proxy)
├── scripts/
│   ├── registry-builder/      # index.mjs, config.mjs, manifest.mjs, resolve-imports.mjs, verify-closure.mjs
│   ├── build-demo-sources.mjs # Trích nguồn demo → generated/sources.json
│   └── hash-password.mjs      # Sinh hash pbkdf2 cho LNHDESIGN_USERS
├── registry.manifest.json     # Bổ sung khai tay: files glob, version, cssVars (tùy item)
└── docs/                      # Documentation này
    ├── adr-001-state-boundary.md
    ├── design-guidelines.md
    ├── deployment-guide.md
    └── design-patterns/task-report/  # Template báo cáo task
```

Lưu ý: `public/r/`, `registry.json`, `registry.internal.json` và `src/modules/showcase/demos/generated/` đều sinh lúc build và nằm trong `.gitignore`.

## File Counts (src/, xác minh 2026-10-18)

| Directory | Loại | Count |
|-----------|------|-------|
| `src/components/ui/` | Primitive shadcn | 48 file |
| `src/components/{general,layout,navigation,data-entry,data-display,feedback,other}/` | App components | 47 file |
| `src/components/illustrations/` | Hình minh hoạ trạng thái | 20 file |
| `src/components/data-table/` | Block data-table | 37 file |
| `src/components/table/` | Block table-core/table-chrome | 23 file |
| `src/config/catalog/` | Catalog source of truth | 5 file |
| `src/modules/showcase/` | Logic showcase (components, demos, previews) | 73 file |
| `src/modules/showcase/demos/` | File demo `.tsx` | 37 file |
| `src/modules/landing/` | Landing | 7 file |
| `src/app/` | Routes + layout | 28 file |
| `src/lib/` | Utilities + i18n | 27 file |
| `src/hooks/` | Custom hooks | 17 file |

## Key Files

| File | Purpose |
|------|---------|
| `scripts/registry-builder/index.mjs` | Điểm vào registry build: 2 lượt (sở hữu file → dựng item), suy dependency từ import |
| `scripts/registry-builder/config.mjs` | `REGISTRY_NAME`, `FORBIDDEN_IMPORTS`, `TARGET_RULES` (ánh xạ đường dẫn → alias CLI) |
| `scripts/build-demo-sources.mjs` | Trích nguyên văn nguồn demo, chặn leak item internal |
| `src/config/catalog/components.ts` | 83 component item: 48 `primitive()` + 35 `app()` |
| `src/config/catalog/blocks.ts` | 8 block item, `blockKind`: application / data-grid |
| `src/config/catalog/templates.ts` | 1 template (`dev-portal`, `visibility: "internal"`) |
| `src/modules/showcase/demos/registry.ts` | `demoModules` — map slug → demo, nạp lười theo chunk |
| `src/modules/showcase/previews/index.ts` | `previewRegistry` — map slug → JSX preview live (iframe) |
| `components.json` | Cấu hình shadcn CLI: style `radix-mira`, iconLibrary `lucide` |
| `registry.manifest.json` | Khai bổ sung per-item: files glob, registryDependencies, version, cssVars |
| `registry.json` / `registry.internal.json` | Catalog sinh ra (public / internal) |

## Component Groups (7 nhóm Ant Design)

Categories chuẩn trong `src/config/catalog/types.ts`, feed thẳng vào field `categories` của registry item:

1. **general** — `app-button`, `actions-button`, `mode-toggle-button`, `app-heading`, `app-title`, `app-icon`, `copy-button`
2. **layout** — `app-card`, `app-content-shell`, `app-toolbar`, `statistics-card`, `statistics-card-grid`, `chart-card`, `page-background`, `home-section-header`
3. **navigation** — `nav-item-recursive`
4. **data-entry** — `app-input`, `app-field`, `floating-input`, `search-input`, `status-switch`, `toggle-group-theme`, `appearance-picker`
5. **data-display** — `app-stepper` (mới, `isNew`), `app-avatar`, `badge-status`, `app-tooltip`, `marquee`, `resize-image`, `code-block`
6. **feedback** — `app-dialog`, `app-sheet`, `alert-dialog-status`, `note-confirm-dialog`, `ping-indicator`, `fallback-shell`, `illustrations`
7. **other** — `theme-toggle-provider`

Ngoài `categories`, component chia 2 **layer**: `primitive` (thẳng từ `ui/`) và `app` (tự build). Block có thêm facet `blockKind` (`application` | `data-grid` | `solutions`) để lọc riêng ở `/blocks`.

## Blocks (8)

| Slug | blockKind | Live preview |
|------|-----------|--------------|
| `data-table` | data-grid | Có |
| `table-core` | data-grid | Chưa |
| `table-chrome` | data-grid | Chưa |
| `data-table-url` | data-grid | Chưa |
| `stats-overview` | application | Có |
| `nav-tree` | application | Chưa |
| `empty-states` | application | Có |
| `auth-login` | application | Chưa |

## Tech Stack (xác minh từ package.json)

- **Framework**: Next.js 16.3.2 (App Router, RSC, `proxy.ts` thay middleware)
- **UI**: React 19.2.8, `radix-ui` (package hợp nhất), Tailwind CSS v4, shadcn CLI 4.19, style `radix-mira`
- **State**: Zustand 5 (1 store), TanStack Query 5, nuqs 2 (URL state)
- **Forms**: react-hook-form 7 + @hookform/resolvers + zod 4
- **Tables**: TanStack Table v8
- **DnD**: @dnd-kit
- **Animation**: motion 13 (Framer Motion replacement)
- **Icons**: lucide-react (provider active) + @hugeicons/react (provider dự phòng), qua `<AppIcon>`
- **Khác**: sonner (toast), embla (carousel), recharts 3 (chart), exceljs (xuất CSV), react-day-picker 10, react-resizable-panels, vaul, next-themes, cmdk
- **i18n**: Hệ dictionary riêng VI/EN (React context + cookie `NEXT_LOCALE`)
- **Package Manager**: pnpm 10.30.3

## Build Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Dev server port 3100 (`predev` chạy `demos:build` trước) |
| `pnpm build` | `demos:build` → `registry:build` → `next build` |
| `pnpm typecheck` | `demos:build` → `tsc --noEmit` |
| `pnpm lint` | ESLint (flat config) |
| `pnpm registry:build` | Sinh `public/r/*.json`, `public/r/registry.json`, `registry.json`, `registry.internal.json` |
| `pnpm demos:build` | Sinh `src/modules/showcase/demos/generated/sources.json` |
| `pnpm i18n:check` | Kiểm parity dictionary VI/EN |

## Change Log

- 2026-10-03: Tạo ban đầu via `docs:init`
- 2026-10-18: Cập nhật theo codebase hiện tại — counts đúng (48 ui, 37 data-table, 23 table, 20 illustrations), thêm nhóm `illustrations`, blocks đủ 8 (thêm `stats-overview`, `empty-states`), schema catalog mới (`slug`/`layer`/`visibility`), tách `previews/` (live) khỏi `demos/` (tab demo), route `/login` + `/r/internal/[name]`, `proxy.ts`, stack versions xác minh từ package.json
- 2026-10-22: Đổi tên AureCook → LnhDesign: namespace @lnhdesign/*, env LNHDESIGN_*, domain lnhdesign.vercel.app; đồng bộ tooling và quy tắc theo Eco-Farm-web.
