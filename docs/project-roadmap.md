---
report_type: project-roadmap
generated_at: 2026-10-03T17:45:00+07:00
period: ""
status: draft
source: /Users/lehonglinh/Documents/DIP/Source/Lnh-design
generated_by: report-templates
triggered_by: docs:init
plan_ref: ""
---

# Project Roadmap: Lnh-design

## 1. Overview

Lnh-design là registry UI theo mô hình shadcn, đang trong giai đoạn early development với mục tiêu đạt full coverage cho component/block demo và hoàn thiện hệ thống build.

## 2. Strategy & Themes

- **Theme 1: Coverage** — Hoàn thiện demo cho tất cả component (35) và block (8) còn thiếu
- **Theme 2: Branding** — Đổi namespace từ `@aurecook/*` sang tên mới, cập nhật env/domain
- **Theme 3: Quality** — Đảm bảo registry build 100% pass, i18n parity, type safety
- **Theme 4: Package Decisions** — Quyết định có tách token/tailwind preset/eslint config không

## 3. Timeline by Phase

### Phase 1: Namespace Rename

- **Goal:** Đổi toàn bộ namespace và branding từ AureCook sang tên mới
- **Start:** TBD · **End:** TBD · **Owner:** Team

#### Scope
- Chốt tên registry mới
- Cập nhật `REGISTRY_NAME` + `FORBIDDEN_IMPORTS` trong `scripts/registry-builder/config.mjs`
- Cập nhật `registryItemName()` trong catalog
- Cập nhật env variables (`AURECOOK_*` → mới)
- Cập nhật domain trong `site.ts`
- Chạy lại `registry:build`

#### Dependencies
- Namespace mới phải được chốt trước

#### Risks
- **Leak risk** — Public item đã publish trước khi rename → backward compatibility cần xử lý

---

### Phase 2: Demo Coverage — Components (35/35)

- **Goal:** Tất cả component cấp app có demo
- **Start:** TBD · **End:** TBD · **Owner:** Team

#### Scope
- Viết demo cho 27 component còn thiếu (hiện chỉ 8/35 có demo)
- Demo theo pattern: `src/modules/showcase/demos/{group}/{slug}/{demo-id}.tsx`
- Metadata trong `index.ts` per component

#### Success Criteria
- `/components` page hiển thị "Chưa có bản demo" = 0
- Mỗi component có ≥1 demo chạy được

---

### Phase 3: Demo Coverage — Blocks (8/8)

- **Goal:** Tất cả block có demo
- **Start:** TBD · **End:** TBD · **Owner:** Team

#### Scope
- Viết demo cho 5 block còn thiếu:
  - `table-core`
  - `table-chrome`
  - `data-table-url`
  - `nav-tree`
  - `auth-login`

#### Dependencies
- Phase 2 hoàn thành (component demo infrastructure)

---

### Phase 4: Token/Package Decisions

- **Goal:** Quyết định có tách lại token package, Tailwind preset, ESLint config không
- **Start:** TBD · **End:** TBD · **Owner:** Team

#### Scope
- Đánh giá token package: có cần publish riêng không?
- Tailwind preset: standalone hay bundle trong registry?
- ESLint config: tách hay giữ nguyên?

---

## 4. Release Plan

### Release 1.0.0: MVP

- **Target Date:** TBD
- **Type:** Major
- **Key Features:**
  - 35 component với demo
  - 8 block với demo
  - Public registry (`@aurecook/*`)
  - Showcase site đầy đủ
  - Internal registry với auth

### Release 2.0.0: Branding Rename

- **Target Date:** TBD
- **Type:** Major
- **Key Features:**
  - Namespace mới
  - Domain mới
  - Updated CLI config

## 5. Current Status (as of 2026-10-03)

### Component Coverage

| Metric | Current | Target |
|--------|---------|--------|
| Components with demo | 8/35 | 35/35 |
| Blocks with demo | 3/8 | 8/8 |
| Templates | 1 | TBD |

### Known Gaps

| Item | Status | Notes |
|------|--------|-------|
| `table-core` block | Missing demo | Table core ported from tablecn |
| `table-chrome` block | Missing demo | Chrome for table |
| `data-table-url` block | Missing demo | URL state integration |
| `nav-tree` component | Missing demo | Navigation tree |
| `auth-login` block | Missing demo | Auth block |
| 27/35 app components | Missing demo | Need coverage push |

### Technical Debt

| Item | Description |
|------|-------------|
| Namespace `@aurecook/*` | Pending rename to new name |
| AURECOOK_* env vars | Pending rename |
| Domain `aurecook.vercel.app` | Pending update |
| Token/eslint package | Undecided |

## 6. Monitoring & Feedback

- **Registry build**: CI/CD fail nếu `registry:build` có lỗi
- **Demo coverage**: Manual check trên `/components` page
- **i18n parity**: `pnpm i18n:check` fail nếu dictionary lệch cấu trúc

## 7. Change Log

- 2026-10-03: Initial roadmap generation via `docs:init`
