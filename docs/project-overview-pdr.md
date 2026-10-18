---
report_type: project-overview-pdr
generated_at: "2026-10-18T10:37:33+07:00"
period: ""
status: current
source: "/Users/lehonglinh/Documents/DIP/Source/Lnh-design"
generated_by: "docs-manager"
triggered_by: "docs:update"
---

# Project Overview & PDR: Lnh-design

## 1. Executive Summary

Registry UI dùng chung cho các dự án React, theo mô hình shadcn (style `radix-mira`). Dự án cung cấp **92 registry item** — 83 component (48 primitive shadcn + 35 cấp app), 8 block, 1 template (internal) — copyable vào repo người dùng, kèm site showcase để duyệt demo, xem mã nguồn, và lấy lệnh cài tự động.

## 2. Business Context & Goals

### 2.1. Business Context

Mỗi dự án React tự viết lại nút, bảng, form, dialog… dẫn tới giao diện lệch nhau và sửa một lỗi phải sửa ở N repo. Thư viện npm truyền thống giải quyết được "dùng chung" nhưng không cho đội tự sửa; copy tay thì không có nguồn cập nhật.

Mô hình shadcn nằm giữa hai thứ đó: **mã nguồn được copy vào repo người dùng** (sửa tự do), nhưng **nguồn chuẩn nằm một chỗ** (cài lại để lấy bản mới).

### 2.2. Project Goals

- **Component Registry** — Bộ component hai tầng: 48 primitive shadcn (ẩn khỏi sidebar showcase) + 35 component cấp app chia theo 7 nhóm Ant Design, copyable qua CLI
- **Block Library** — 8 cụm component ghép thành mảng giao diện chạy được: 4 data-grid (`data-table`, `table-core`, `table-chrome`, `data-table-url`) + 4 application (`stats-overview`, `nav-tree`, `empty-states`, `auth-login`)
- **Template Gallery** — 1 template nhiều trang hoàn chỉnh (`dev-portal`, internal)
- **Showcase Site** — Trang web duyệt catalog, xem demo (tab demo + live iframe preview), lấy mã nguồn và lệnh cài, kèm props table
- **AI Integration** — Prompt cài đặt sẵn để agent tự cài item qua shadcn CLI

### 2.3. Success Metrics (cập nhật 2026-10-18)

- **Component demo coverage**: 9/35 app component có demo tab — mục tiêu 35/35; đo bằng số slug đăng ký trong `demoModules` (`src/modules/showcase/demos/registry.ts`)
- **Block preview coverage**: 3/8 block có live preview — mục tiêu 8/8; đo qua `hasPreview()` (`src/modules/showcase/previews/index.ts`)
- **Build integrity**: 0 lỗi `registry:build` / `demos:build` — đo bằng exit code; fail ngay khi leak internal hoặc forbidden import
- **i18n parity**: VI/EN dictionary cùng cấu trúc — đo bằng `pnpm i18n:check`

## 3. Scope

### 3.1. In Scope

- Component registry (public + internal channels, 92 item)
- Block registry (public + internal channels)
- Template registry
- Showcase site (components, blocks, templates, docs, icons, tokens, internal, login)
- Registry build system (`scripts/registry-builder`)
- Demo build system (`scripts/build-demo-sources.mjs`)
- CLI integration qua shadcn registry protocol (style `radix-mira`)

### 3.2. Out of Scope

- NPM package publishing (chỉ cung cấp registry JSON, không publish lên npm)
- Token package / Tailwind preset / ESLint config (chưa tách — xem [project-roadmap](./project-roadmap.md) Phase 4)
- Primitive shadcn trên UI (ẩn khỏi sidebar showcase, vẫn nằm trong registry)
- Test infra unit/E2E (chưa có)

## 4. Stakeholders

- **Dev sử dụng registry**: Duyệt component/block, xem demo, copy lệnh cài hoặc mã nguồn
- **Dev duy trì registry**: Thêm/sửa item, viết demo, kiểm tra dependency
- **Agent AI**: Sử dụng registry JSON + prompt để tự động cài component vào dự án

## 5. High-level Requirements

- **Registry system**: JSON-based registry với dependency resolution tự động từ import (2 lượt: bảng sở hữu file → dựng item)
- **Public/internal split**: Public (`@aurecook/*`) vs internal (`@aurecook-x/*`) qua Authorization header `Bearer {AURECOOK_TOKEN}`
- **Build integrity**: Fail build khi public item phụ thuộc internal item, import cấm (`@aurecook/*`, `@/lib/i18n`), file không khớp `TARGET_RULES`, hoặc cây dependency không khép kín
- **Demo system**: Hai đường — demo tab (nạp lười `demoModules`) và live preview iframe (`previewRegistry` qua `/preview/[name]`); demo source trích nguyên văn, loại item internal khỏi output tĩnh
- **i18n**: Song ngữ VI/EN — dictionary namespaced cho site, `{vi,en}` inline cho catalog/demo

## 6. Constraints & Assumptions

### 6.1. Constraints

- Registry JSON phải tương thích shadcn CLI protocol
- Demo phải trích nguyên văn từ file nguồn (một demo = một file), không cắt theo marker
- Dependency suy tự động từ import, không khai tay
- Catalog là data thuần (không JSX) để script Node nạp trực tiếp

### 6.2. Assumptions

- Namespace `@aurecook/*` sẽ được đổi sang tên mới (đang pending — Phase 1 roadmap)
- Môi trường Vercel cho deployment (standard Next.js)

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Namespace leak | Public phụ thuộc internal → `registry:build` fail at build time |
| Demo out of sync | Một demo một file, trích nguyên văn — không thể lệch với chính nó |
| Missing demo coverage | Item chưa có demo hiển thị trạng thái "chưa có demo", tự suy từ registry |
| Internal leak qua đường tĩnh | `build-demo-sources.mjs` loại item internal khỏi `sources.json`, fail nếu lọt |

## 8. High-level Architecture / Solution Approach

Xem [System Architecture](./system-architecture.md) đầy đủ.

Tóm tắt: Next.js 16 app (App Router, `proxy.ts` gate `/internal/**`) với registry builder Node (2 lượt, suy dependency từ import), demo source extractor, và static JSON output cho shadcn CLI (public qua CDN `public/r/`, internal sau cổng Bearer token).

## 9. Milestones & Timeline

| Milestone | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Stepper: primitive + `app-stepper` + 19 demo | **Hoàn thành** (commit `b990d96`) | Indicator, inline, vertical, validated wizard |
| Props table + inline code cho trang component | **Hoàn thành** (commit `0c78f7c`) | `PropDoc` trong demo definition |
| Block `stats-overview` + `empty-states` có preview | **Hoàn thành** | Cộng với `data-table` = 3/8 blocks |
| Demo coverage 35/35 component | Đang tiến hành (9/35) | Ưu tiên nhóm feedback + data-entry |
| Block coverage 8/8 | Đang tiến hành (3/8) | Còn: table-core, table-chrome, data-table-url, nav-tree, auth-login |
| Namespace rename | Chưa bắt đầu | Phase 1 roadmap |

## 10. Open Questions

- [ ] **Namespace rename**: Tên mới đã được chốt chưa?
- [ ] **Token package**: Có tách lại package token/tailwind/ESLint không?
- [ ] **AURECOOK_TOKEN**: Token internal đã được setup chưa? (`.env.example` đã document cách sinh)

