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

# Code Standards: Lnh-design

## Overview

Coding conventions và architectural standards cho Lnh-design registry project. Thư viện theo mô hình shadcn — source được copy vào repo người dùng, nên code phải clean, readable, và không có dependency phức tạp.

## TypeScript

- **Strict mode enabled** — `tsconfig.json` có `"strict": true`
- **No explicit `any`** — `@typescript-eslint/no-explicit-any`: warn
- **Path aliases** — `@/*` maps to `./src/*`
- **moduleResolution**: `bundler`

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"] },
    "moduleResolution": "bundler"
  }
}
```

## ESLint

Sử dụng `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.

```javascript
// eslint.config.mjs
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

### Data-table/table Rule Overrides

Component `data-table/` và `table/` được port nguyên từ `tablecn` — source đó không có eslint-config-next. Bốn rule bị disable cho các file trong `src/components/data-table/**`, `src/components/table/**`, `src/hooks/table/**`:

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

`lucide-react`, `@hugeicons/*` chỉ được import trong `src/components/general/icon-providers/**` và `src/components/ui/**` (`no-restricted-imports`). Còn lại dùng `<AppIcon icon="..." />`.

## Icons

- Chỗ gọi chỉ dùng tên: `<AppIcon icon="trash-2" />`; prop icon của component nhận `IconName`, không nhận component của thư viện.
- Đổi thư viện: đổi dòng import `provider` trong `src/components/general/app-icon.tsx` (`hugeiconsProvider` ⇄ `lucideProvider`).
- Thêm icon: thêm tên vào `icon-providers/icon-names.ts` + một dòng trong **mỗi** provider (`satisfies Record<IconName, …>` → tsc báo nếu thiếu). Hugeicons: `kebab-name` → `PascalNameIcon`, lệch quy ước thì map tay.
- Độ dày nét dùng prop `strokeWidth`, không dùng class `stroke-*`: hugeicons đặt `stroke-width` trên từng `<path>` nên class trên `<svg>` không có tác dụng.
- Primitive shadcn (`src/components/ui/`) giữ lucide để `shadcn add` không phải sửa tay.

## Component Structure

### Naming

- File: kebab-case, mô tả purpose rõ ràng
- Component: PascalCase, trùng với file name
- Demo: `{slug}/{demo-id}.tsx` trong `src/modules/showcase/demos/`

### Import Pattern

```typescript
// Import từ @/components/* (đường dẫn nội bộ)
import { AppButton } from "@/components/general/app-button";

// Import từ package (cho demo source)
import { useForm } from "react-hook-form";
```

### Export Pattern

- **Barrel file per group**: `src/components/{group}/index.ts`
- **No root barrel**: Import theo nhóm hoặc theo file cụ thể

## Demo Standards

### Demo File Structure

```
src/modules/showcase/demos/{group}/{slug}/
├── basic.tsx          # Demo default
├── {demo-id}.tsx     # Additional demos
└── index.ts          # Metadata + demo list
```

### Demo Metadata (index.ts)

```typescript
export const meta = {
  title: "Currency Input",
  description: "...",
};

export const demos = [
  { id: "basic", label: "Basic" },
  { id: "with-prefix", label: "With Prefix" },
];
```

### Demo Rules

- Chỉ import từ `@/components/*` và package có trong `package.json`
- Không tự mount `TooltipProvider` / `Toaster` — showcase shell cung cấp
- Overlay mở bằng nút, không `defaultOpen`
- Demo phải trích nguyên văn từ file nguồn (không cắt theo marker)

## Catalog Definition

### Component Catalog (src/config/catalog/components.ts)

```typescript
export const components = [
  {
    name: "app-button",
    type: "components",
    group: "general",
    description: { vi: "...", en: "..." },
    registryDependencies: [],  // tự suy từ import trong build
  },
];
```

### Block Catalog (src/config/catalog/blocks.ts)

```typescript
export const blocks = [
  {
    name: "data-table",
    type: "blocks",
    group: "data-grid",
    facets: ["application", "data-grid"],
    description: { vi: "...", en: "..." },
  },
];
```

## Registry Build Rules

Registry builder fail build khi:

1. Import bị cấm (`@/lib/i18n` — item phải tự mang chuỗi hiển thị)
2. Item public phụ thuộc item internal (leak)
3. Một file bị hai item cùng nhận
4. Cây dependency không khép kín

## i18n Standards

- Dictionary files: `src/lib/i18n/dictionaries/{vi,en}.json`
- Parity check: `pnpm i18n:check` verify cùng cấu trúc keys
- User-facing strings phải qua dictionary, không hardcode

## Styling

- **Tailwind CSS** với CVA (class-variance-authority) cho variants
- **Design tokens**: CSS variables trong `globals.css`
- **No inline styles** cho component logic — dùng Tailwind classes

## Testing

- Unit tests: Vitest (nếu có)
- Type checking: `pnpm typecheck` (tsc --noEmit)
- Lint: `pnpm lint`
- i18n check: `pnpm i18n:check`

## Change Log

- 2026-10-03: Initial code-standards.md generation via `docs:init`
- 2026-10-04: Icon provider adapter (hugeicons active, lucide dự phòng), ESLint chặn import thẳng thư viện icon
