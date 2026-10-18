---
report_type: code-standards
generated_at: "2026-10-18T10:37:33+07:00"
period: ""
status: current
source: "/Users/lehonglinh/Documents/DIP/Source/Lnh-design"
generated_by: "docs-manager"
triggered_by: "docs:update"
---

# Code Standards: Lnh-design

## Overview

Coding conventions và architectural standards cho Lnh-design registry project. Thư viện theo mô hình shadcn (style `radix-mira`) — source được copy vào repo người dùng, nên code phải clean, readable, và không có dependency phức tạp.

## TypeScript

- **Strict mode enabled** — `tsconfig.json` có `"strict": true` (xác minh 2026-10-18)
- **No explicit `any`** — `@typescript-eslint/no-explicit-any`: warn
- **Path aliases** — `@/*` maps to `./src/*`
- **moduleResolution**: `bundler`

```json
// tsconfig.json (compilerOptions chính)
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"] },
    "moduleResolution": "bundler"
  }
}
```

## ESLint (flat config, ESLint 9)

Sử dụng `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`, gói trong `defineConfig`.

```javascript
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

Global rules thêm: `@typescript-eslint/no-explicit-any: warn`, `react/no-unescaped-entities: warn`. `globalIgnores` bổ sung `.claude/**` (script hook .cjs, không phải mã nguồn).

### Data-table/table Rule Overrides

Component `data-table/` và `table/` được port nguyên từ `tablecn` — nguồn đó không có eslint-config-next nên các rule react-hooks chưa từng được kiểm ở thượng nguồn. Sáu rule bị disable cho `src/components/data-table/**`, `src/components/table/**`, `src/hooks/table/**`:

```javascript
{
  files: ["src/components/data-table/**", "src/components/table/**", "src/hooks/table/**"],
  rules: {
    "react-hooks/refs": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/preserve-manual-memoization": "off",
    "react-hooks/incompatible-library": "off",
    "react-hooks/set-state-in-effect": "off",
    "@typescript-eslint/no-empty-object-type": "off",
  },
}
```

### Icon Import Restriction

`lucide-react` và `@hugeicons/*` chỉ được import trong `src/components/general/icon-providers/**` và `src/components/ui/**` (`no-restricted-imports`, mức **error**). Còn lại bắt buộc `<AppIcon icon="..." />`.

## Icons

- Chỗ gọi chỉ dùng tên: `<AppIcon icon="trash-2" />`; prop icon nhận `IconName`, không nhận component của thư viện.
- Provider active: **lucide** (xác minh `src/components/general/app-icon.tsx`); hugeicons giữ làm dự phòng, đổi bằng một dòng import trong `app-icon.tsx`.
- Thêm icon: thêm tên vào `icon-providers/icon-names.ts` + một dòng trong **mỗi** provider (`satisfies Record<IconName, …>` → tsc báo nếu thiếu). Hugeicons: `kebab-name` → `PascalNameIcon`, lệch quy ước thì map tay.
- Độ dày nét dùng prop `strokeWidth`, không dùng class `stroke-*`: hugeicons đặt `stroke-width` trên từng `<path>` nên class trên `<svg>` không có tác dụng.
- Primitive shadcn (`src/components/ui/`) giữ lucide để `shadcn add` không phải sửa tay.

## Component Structure

### Naming

- File: kebab-case, mô tả purpose rõ ràng
- Component: PascalCase, trùng với file name
- Demo: `demos/{category}/{slug}/{demo-id}.tsx` trong `src/modules/showcase/demos/`

### Import Pattern

```typescript
// Import từ @/components/* (đường dẫn nội bộ)
import { AppButton } from "@/components/general/app-button";

// Import từ package (cho demo source)
import { useForm } from "react-hook-form";
```

### Export Pattern

- **Barrel file per group**: `src/components/{group}/index.ts` (xác minh: mọi group đều có `index.ts`)
- **No root barrel**: Import theo nhóm hoặc theo file cụ thể

## Demo Standards

### Demo File Structure (xác minh từ 9 slug đang có)

```
src/modules/showcase/demos/{category}/{slug}/
├── {demo-id}.tsx     # Một demo = một file (nguyên văn = source hiển thị)
└── index.ts          # Export `demos: ComponentDemo[]`
```

### Demo Definition (index.ts)

`index.ts` export **`demos: ComponentDemo[]`** (không có object `meta` riêng):

```typescript
import type { ComponentDemo, PropDoc } from "../../types";

import AppButtonFamily from "./family";

export const demos: ComponentDemo[] = [
  {
    id: "family",
    title: { vi: "Họ nút đặt sẵn", en: "Preset family" },
    description: { vi: "...", en: "..." },
    snippet: `<ButtonAdd>Thêm căn</ButtonAdd>`,
    render: AppButtonFamily,
  },
];
```

| Field | Bắt buộc | Ghi chú |
|-------|----------|---------|
| `id` | Có | Trùng tên file `{demo-id}.tsx` |
| `title`, `description` | Có | `{ vi, en }` — nằm ngay trong demo, không qua dictionary |
| `snippet` | Có | Code ngắn hiển thị kèm demo (hỗ trợ inline code) |
| `render` | Có | Component React của demo |
| `props` | Không | `PropDoc[]` — feed props table (thêm 2026-10, commit `0c78f7c`) |

### Đăng Ký Demo

Demo **phải** được khai tường minh trong `src/modules/showcase/demos/registry.ts` (`demoModules` — map slug → `() => import(...)` nạp lười). Khai tường minh thay vì quét thư mục: gõ sai đường dẫn là lỗi biên dịch, không phải trang trống lúc chạy.

```typescript
export const demoModules: Record<string, () => Promise<DemoModule>> = {
  "app-button": () => import("./general/app-button"),
  "app-stepper": () => import("./data-display/app-stepper"),
};
```

### Demo Rules

- Chỉ import từ `@/components/*` và package có trong `package.json`
- Không tự mount `TooltipProvider` / `Toaster` — showcase shell cung cấp
- Overlay mở bằng nút, không `defaultOpen`
- Demo phải trích nguyên văn từ file nguồn (một demo = một file, không cắt theo marker)
- Item `visibility: "internal"` bị loại khỏi `sources.json` — chặn leak qua đường tĩnh

## Catalog Definition

Catalog là **data thuần** (không JSX), dùng hàm dựng `primitive()` / `app()` trong `src/config/catalog/components.ts`:

```typescript
// primitive: mặc định files = src/components/ui/{slug}.tsx
primitive("stepper", "Stepper", ["data-display"],
  "Khung stepper headless: nav, trigger, indicator, panel.",
  "Headless stepper scaffold with roving-focus keyboard nav.");

// app component; options có thể chứa { isNew: true }
app("app-stepper", "AppStepper", ["data-display"],
  "Wizard nhiều bước: guard async, chế độ tuần tự, 6 bố cục.",
  "Multi-step wizard with async guards, linear mode, six layouts.",
  { isNew: true });
```

Schema item (types.ts): `slug`, `name`, `description: {vi,en}`, `categories`, `kind`, `layer` (component), `visibility`, `isNew`, `thumbnail`; block có thêm `blockKind`; template có `techStack` + `framework/base/style/surface`. Field `slug` phải trùng: thư mục demo, tên registry item, param `/preview/[name]`.

Block khai trực tiếp object trong `blocks.ts` với `blockKind: "application" | "data-grid" | "solutions"`; template khai trong `templates.ts` với `visibility: "internal"` hiện tại.

## Registry Build Rules

`scripts/registry-builder/` fail build khi:

1. **Import cấm** — `FORBIDDEN_IMPORTS` trong `config.mjs`: `@aurecook/*` (alias workspace không resolve được ở repo khách) và `@/lib/i18n` (item phải tự mang chuỗi hiển thị)
2. **Public → internal leak** — public item kéo theo internal item qua `registryDependencies`
3. **File không phân loại được** — không khớp `TARGET_RULES` nào trong `config.mjs` (`src/components/ui/` → `@ui/`, `src/components/` → `@components/`, `src/hooks/` → `@hooks/`, `src/lib/` → `@lib/`, `src/config|layouts|store/` → `~/`)
4. **Cây dependency không khép kín** — `verify-closure.mjs`
5. **Glob không khớp file nào** — pattern trong `registry.manifest.json` trống

Ngoài ra: dependency suy từ import (`@/…` → tra `ownerOfFile`, npm package → version trong `package.json`, bỏ react/react-dom/next); `src/lib/utils.ts` do `shadcn init` tạo sẵn nên item không mang theo.

## i18n Standards

- **Dictionary namespaced**: `src/lib/i18n/dictionaries/{vi,en}/*.json` — 15 file mỗi locale (`auth`, `blocks`, `common`, `components`, `docs`, `header`, `icons`, `internal`, `landing`, `nav`, `nav-sections`, `breadcrumb`, `showcase`, `templates`, `tokens`), nạp theo section cần dùng.
- Parity check: `pnpm i18n:check` (`verify-dictionary-parity.mjs`) verify cùng cấu trúc keys
- User-facing strings phải qua dictionary; riêng **catalog và demo** mang `description: {vi, en}` ngay trong data (script Node import được, không thể lệch — quên dịch là lỗi kiểu)

## Styling

- **Tailwind CSS v4** với CVA (class-variance-authority) cho variants
- **Design tokens**: CSS variables trong `src/app/globals.css`; site dùng style `radix-mira`
- **No inline styles** cho component logic — dùng Tailwind classes

## Testing

- Unit tests: chưa có infra test unit
- Type checking: `pnpm typecheck` (`demos:build` → `tsc --noEmit`)
- Lint: `pnpm lint`
- i18n check: `pnpm i18n:check`
- Registry/demo build: fail sớm các lỗi leak/forbidden import ngay lúc build

## Change Log

- 2026-10-03: Tạo ban đầu via `docs:init`
- 2026-10-04: Icon provider adapter (hugeicons active, lucide dự phòng), ESLint chặn import thẳng thư viện icon
- 2026-10-04: Chuyển provider active về lucide; hugeicons giữ làm dự phòng
- 2026-10-18: Cập nhật theo source đã xác minh — schema demo thật (`demos: ComponentDemo[]` với snippet/props, đăng ký `demoModules` nạp lười), schema catalog (`primitive()`/`app()`, `slug`/`layer`/`visibility`), FORBIDDEN_IMPORTS đủ 2 rule (+`@aurecook/*`), TARGET_RULES, i18n namespaced JSON, ESLint global rules + `.claude/**` ignore
