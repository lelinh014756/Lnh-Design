---
report_type: project-overview-pdr
generated_at: 2026-10-03T17:45:00+07:00
period: ""
status: draft
source: /Users/lehonglinh/Documents/DIP/Source/Lnh-design
generated_by: report-templates
triggered_by: docs:init
plan_ref: ""
---

# Project Overview & PDR: Lnh-design

## 1. Executive Summary

Registry UI dùng chung cho các dự án React, theo mô hình shadcn. Dự án cung cấp bộ component/block/template copyable vào repo người dùng, kèm site showcase để duyệt demo, xem mã nguồn, và lấy lệnh cài tự động.

## 2. Business Context & Goals

### 2.1. Business Context

Mỗi dự án React tự viết lại nút, bảng, form, dialog… dẫn tới giao diện lệch nhau và sửa một lỗi phải sửa ở N repo. Thư viện npm truyền thống giải quyết được "dùng chung" nhưng không cho đội tự sửa; copy tay thì không có nguồn cập nhật.

Mô hình shadcn nằm giữa hai thứ đó: **mã nguồn được copy vào repo người dùng** (sửa tự do), nhưng **nguồn chuẩn nằm một chỗ** (cài lại để lấy bản mới).

### 2.2. Project Goals

- **Component Registry** — Cung cấp bộ UI component cấp app (35+), chia theo 7 nhóm Ant Design, copyable qua CLI
- **Block Library** — Cụm component ghép thành mảng giao diện chạy được (data-table, nav-tree, auth-login…)
- **Template Gallery** — Template nhiều trang hoàn chỉnh (dev-portal)
- **Showcase Site** — Trang web duyệt catalog, xem demo, lấy mã nguồn và lệnh cài
- **AI Integration** — Nút "Chép prompt cho AI" sinh sẵn lệnh cài + URL để agent tự cài

### 2.3. Success Metrics

- **Component coverage**: baseline = 8/35 có demo, target = 35/35 — đo bằng số component có demo trong showcase
- **Block coverage**: baseline = 3/8 có demo, target = 8/8 — đo bằng số block có demo
- **Build integrity**: 0 lỗi registry:build — đo bằng CI exit code
- **i18n parity**: VI/EN dictionary cùng cấu trúc — đo bằng `pnpm i18n:check`

## 3. Scope

### 3.1. In Scope

- Component registry (public + internal channels)
- Block registry (public + internal channels)
- Template registry
- Showcase site (components, blocks, templates, docs, icons, tokens, internal)
- Registry build system (scripts/registry-builder)
- Demo build system (scripts/build-demo-sources.mjs)
- CLI integration via shadcn registry protocol

### 3.2. Out of Scope

- NPM package publishing (chỉ cung cấp registry JSON, không publish lên npm)
- Token package / Tailwind preset / ESLint config (thuộc monorepo cũ, chưa tách)
- Primitive shadcn components trên UI (ẩn khỏi showcase, vẫn nằm trong registry)

## 4. Stakeholders

- **Dev sử dụng registry**: Duyệt component/block, xem demo, copy lệnh cài hoặc mã nguồn
- **Dev duy trì registry**: Thêm/sửa item, viết demo, kiểm tra dependency
- **Agent AI**: Sử dụng registry JSON + prompt để tự động cài component vào dự án

## 5. High-level Requirements

- **Registry system**: JSON-based registry với dependency resolution tự động từ import
- **Public/internal split**: Public (`@aurecook/*`) vs internal (`@aurecook-x/*`) qua Authorization header
- **Build integrity**: Fail build khi public item phụ thuộc internal item (prevent leak)
- **Demo system**: Demo render trực tiếp trong trang (component) hoặc iframe (block)
- **i18n**: Song ngữ VI/EN, dictionary parity check

## 6. Constraints & Assumptions

### 6.1. Constraints

- Registry JSON phải tương thích shadcn CLI protocol
- Demo phải trích nguyên văn từ file nguồn, không cắt theo marker
- Dependency suy tự động từ import, không khai tay

### 6.2. Assumptions

- Namespace `@aurecook/*` sẽ được đổi sang tên mới (hiện đang pending)
- Môi trường Vercel cho deployment (standard Next.js)

## 7. Risks & Mitigations

- **Namespace leak**: Public item phụ thuộc internal → registry:build fail at build time
- **Demo out of sync**: Demo code lệch với source → CI fail, enforced by build system
- **Missing demo coverage**: Component/block không có demo → hiển thị "Chưa có bản demo"

## 8. High-level Architecture / Solution Approach

Xem [System Architecture](./system-architecture.md) đầy đủ.

Tóm tắt: Next.js 16 app với registry builder (Node script), demo sources extractor, và static JSON output cho shadcn CLI.

## 9. Milestones & Timeline

- **Namespace rename**: Chốt tên mới, đổi đồng loạt REGISTRY_NAME + FORBIDDEN_IMPORTS — Owner: team
- **Demo coverage 35/35**: Viết demo cho tất cả component còn thiếu — Owner: team
- **Block coverage 8/8**: Viết demo cho nav-tree, auth-login, table-core, table-chrome, data-table-url

## 10. Open Questions

- [ ] **Namespace rename**: Tên mới đã được chốt chưa?
- [ ] **Token package**: Có tách lại package token/tailwind/ESLint không?
- [ ] **AURECOOK_TOKEN**: Token internal đã được setup chưa?
