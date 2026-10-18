---
report_type: project-roadmap
generated_at: "2026-10-18T10:37:33+07:00"
period: ""
status: current
source: "/Users/lehonglinh/Documents/DIP/Source/Lnh-design"
generated_by: "docs-manager"
triggered_by: "docs:update"
---

# Project Roadmap: Lnh-design

## 1. Overview

Lnh-design là registry UI theo mô hình shadcn (style `radix-mira`), đang trong giai đoạn early development với mục tiêu đạt full coverage cho component/block demo và hoàn thiện hệ thống build.

## 2. Strategy & Themes

- **Theme 1: Coverage** — Hoàn thiện demo cho tất cả component (35 app) và block (8) còn thiếu
- **Theme 2: Branding** — Đổi namespace từ `@aurecook/*` sang tên mới, cập nhật env/domain
- **Theme 3: Quality** — Registry build 100% pass, i18n parity, type safety
- **Theme 4: Package Decisions** — Quyết định có tách token/tailwind preset/eslint config không

## 3. Timeline by Phase

### Phase 1: Namespace Rename — CHƯA BẮT ĐẦU

- **Goal:** Đổi toàn bộ namespace và branding từ AureCook sang tên mới
- **Status:** `REGISTRY_NAME = "aurecook"` vẫn đang active trong `scripts/registry-builder/config.mjs` (xác minh 2026-10-18); `site.ts` vẫn trỏ `aurecook.vercel.app`
- **Start:** TBD · **End:** TBD · **Owner:** Team

#### Scope
- Chốt tên registry mới
- Cập nhật `REGISTRY_NAME` + `FORBIDDEN_IMPORTS` trong `scripts/registry-builder/config.mjs`
- Cập nhật `qualifyDependency()` (namespace `@aurecook`/`@aurecook-x`) trong `scripts/registry-builder/index.mjs`
- Cập nhật env variables (`AURECOOK_*` → mới) + `.env.example`
- Cập nhật domain trong `src/config/site.ts`
- Chạy lại `registry:build`

#### Risks
- **Leak risk** — Public item đã publish trước khi rename → backward compatibility cần xử lý

---

### Phase 2: Demo Coverage — Components (9/35) — ĐANG TIẾN HÀNH

- **Goal:** Tất cả 35 component cấp app có demo
- **Status (2026-10-18):** 9/35 có demo tab; 26 còn thiếu

#### Đã có demo (9)
`app-button`, `actions-button`, `app-icon`, `app-card`, `statistics-card`, `statistics-card-grid`, `nav-item-recursive`, `illustrations`, `app-stepper` (mới — 19 demo, commit `b990d96`)

#### Scope còn lại
- Viết demo cho 26 component: ưu tiên nhóm `feedback` (`app-dialog`, `app-sheet`, `note-confirm-dialog`, `alert-dialog-status`, `ping-indicator`, `fallback-shell`) và `data-entry` (`app-input`, `floating-input`, `search-input`, `status-switch`…)
- Đăng ký trong `demos/registry.ts` (`demoModules`) + thêm live preview trong `previews/` nếu phù hợp

#### Success Criteria
- `/components` không còn item "chưa có demo"
- Mỗi component có ≥1 demo chạy được + đăng ký trong `demoModules`

---

### Phase 3: Demo Coverage — Blocks (3/8) — ĐANG TIẾN HÀNH

- **Goal:** Tất cả 8 block có demo (live preview iframe)
- **Status (2026-10-18):** 3/8 có live preview: `data-table`, `stats-overview`, `empty-states`

#### Còn thiếu (5)
- `table-core` — nền state/options bảng (hook lõi đã có: `src/hooks/table/`)
- `table-chrome` — mật độ, fullscreen, ẩn/hiện cột, sheet bộ lọc
- `data-table-url` — đồng bộ URL state qua nuqs
- `nav-tree` — cây điều hướng (`nav-item-recursive` đã có demo component)
- `auth-login` — form đăng nhập hai cột (`src/modules/auth/components/` đã có source)

#### Dependencies
- Phase 2 (infra demo component) — đã thỏa

---

### Phase 4: Token/Package Decisions — CHƯA BẮT ĐẦU

- **Goal:** Quyết định có tách lại token package, Tailwind preset, ESLint config không
- **Start:** TBD · **Owner:** Team

#### Scope
- Đánh giá token package: có cần publish riêng không? (catalog comment tham chiếu `@aurecook/tokens` — chưa tách)
- Tailwind preset: standalone hay bundle trong registry?
- ESLint config: tách hay giữ nguyên?

---

## 4. Release Plan

### Release 1.0.0: MVP — CHƯA CÓ NGÀY

- **Type:** Major
- **Key Features:**
  - 35 component cấp app với demo (+ 48 primitive sẵn dùng)
  - 8 block với demo
  - Public registry (`@aurecook/*`), showcase site đầy đủ, internal registry với auth

### Release 2.0.0: Branding Rename — CHƯA CÓ NGÀY

- **Type:** Major
- **Key Features:** Namespace mới, domain mới, updated CLI config

## 5. Current Status (as of 2026-10-18)

### Catalog Coverage

| Metric | Current | Target |
|--------|---------|--------|
| App components có demo tab | 9/35 | 35/35 |
| Blocks có live preview | 3/8 | 8/8 |
| Primitives có live preview | 34/48 | – (primitives ẩn khỏi sidebar, không bắt buộc) |
| Templates | 1 (`dev-portal`, internal) | TBD |
| Tổng registry item | 92 | – |

### Hoàn thành gần đây (từ 2026-10-03)

| Item | Commit | Ghi chú |
|------|--------|---------|
| Stepper primitive + `app-stepper` (`isNew`) + 19 demo | `b990d96` | Indicator, inline, vertical, wizard validated… |
| Props table + inline code cho demo | `0c78f7c` | `PropDoc` feed props-table trong trang component |
| Block `stats-overview` + `empty-states` | – | Đã có live preview |
| Bộ illustrations (20 file) + demo gallery | – | Hình vẽ bằng token màu |
| Xoá `RefreshButton` component standalone | `b4270f7` | Chức năng refresh còn trong họ `app-button` |

### Known Gaps

| Item | Status | Notes |
|------|--------|-------|
| `table-core`, `table-chrome`, `data-table-url` blocks | Missing preview | Source đầy đủ, chỉ thiếu demo |
| `nav-tree`, `auth-login` blocks | Missing preview | Source có sẵn (`nav-item-recursive`, `modules/auth`) |
| 26/35 app components | Missing demo | Cần coverage push, ưu tiên feedback + data-entry |

### Technical Debt

| Item | Description |
|------|-------------|
| Namespace `@aurecook/*` | Pending rename (kéo theo `@aurecook-x`, env, domain) |
| `FORBIDDEN_IMPORTS`/`qualifyDependency` | Hardcode namespace trong 2 file scripts |
| Domain `aurecook.vercel.app` | Pending update |
| Token/eslint package | Undecided |
| Comment stale trong `types.ts` | Trỏ tới `src/config/preview-registry.tsx` không tồn tại — map thật nằm ở `src/modules/showcase/previews/index.ts` |

## 6. Monitoring & Feedback

- **Registry build**: `pnpm registry:build` fail nếu leak/forbidden import/closure vỡ
- **Demo coverage**: `hasDemos()` / `hasPreview()` tự suy từ registry — không có cờ viết tay để lệch
- **i18n parity**: `pnpm i18n:check` fail nếu dictionary lệch cấu trúc

## 7. Change Log

- 2026-10-03: Tạo ban đầu via `docs:init`
- 2026-10-18: Cập nhật trạng thái — component demo 9/35 (+`app-stepper`), block preview 3/8 (`stats-overview`, `empty-states` có preview), hoàn thành gần đây (stepper, props table, illustrations), sửa `nav-tree` từ "component" sang "block", thêm debt: stale comment preview-registry trong `types.ts`
