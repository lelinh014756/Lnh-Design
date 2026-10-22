---
report_type: adr
adr_id: ADR-001
title: State Boundary — phân tầng state của ứng dụng
status: accepted
generated_at: "2026-10-22T07:35:00+07:00"
source: "/Users/lehonglinh/Documents/DIP/Source/Lnh-design"
generated_by: "docs-manager"
triggered_by: "docs:update"
plan_ref: ""
---

# ADR-001: State Boundary

**Status:** Accepted | **Date:** 2026-10-22 | **Owner:** FE team

> File này là bản chính thức của rule state boundary vốn trước đây chỉ nằm trong
> `.claude/rules/execution-policy.md` và `CLAUDE.md` (đã note là "chưa có ADR file"
> tại `docs/system-architecture.md` và `docs/codebase-summary.md`).

## 1. Context

- App là Next.js App Router với server components + client components trộn nhau;
  server data cần cache và dedupe.
- Codebase đã hình thành 4 tầng state thực tế (TanStack Query, Zustand, React
  Context, local state) nhưng chưa có văn bản quyết định nào chốt boundary,
  dẫn tới risk tạo tầng thứ 5 hoặc đặt state sai tầng.

## 2. Decision

| Tầng | Tech | Vị trí | Ví dụ |
|---|---|---|---|
| Server data | TanStack Query | `src/lib/query/` (`query-client.ts`) | chưa có |
| Global UI state | Zustand singleton | `src/store/` (`appearance-store.ts`) | `appearance-store` |
| Tree-scoped provider | React Context | `src/lib/i18n/context.tsx` | `LocaleProvider` |
| Compound-component state | React Context bên trong component | `src/components/**` | `SidebarContext` (`src/components/ui/sidebar.tsx`), `TableContext` (`src/components/table/table-provider.tsx`) |
| Module-scoped state | Zustand singleton + selector `useXxxContext` | `src/modules/*/stores/` | chưa có |
| Local state | `useState` / `useReducer` | trong component | form draft, tab đang mở |

### Quy tắc bắt buộc

1. **Server data chỉ qua TanStack Query.** Không fetch server data vào Zustand
   hay Context; mutation + optimistic update cũng nằm ở Query.
2. **Zustand cho global/module UI state; Context chỉ cho tree-scoped provider.**
   Nếu cùng một domain có cả `XContext` và `XStore` → kill Context, giữ Store.
3. **Module state mới dùng Zustand singleton** với hook selector dạng
   `useXxxContext`; không tạo React Context module-scoped mới.
4. **Local state mặc định** cho mọi thứ không cần chia sẻ.
5. **Context của compound component chỉ dùng trong thư mục của component đó và
   đi cùng registry item**; không dùng làm state chung của app.

## 3. Context Decision (hiệu chỉnh so với mô tả cũ)

- **`src/context/` KHÔNG tồn tại** trong codebase. Các tài liệu cũ (CLAUDE.md,
  bản init của tài liệu kiến trúc) liệt kê `src/context/` làm vị trí Context —
  sai. Vị trí thật:
  - i18n: `src/lib/i18n/context.tsx`
- Auth không có provider: phiên là cookie tự ký HMAC phía server, đọc trong
  `src/lib/auth/session.ts`.
- Không tạo `src/context/` mới; provider tree-scoped mới đặt cạnh domain của nó.

## 4. Consequences

- Việc thêm tầng state mới (vd: RTC cache, IndexedDB) phải có ADR riêng.

## 5. References

- `src/lib/query/query-client.ts` — browser/server query client + cache tiers.
- `src/store/appearance-store.ts` — Zustand singleton cấp app.
- `src/lib/i18n/context.tsx` — tree-scoped provider thực tế duy nhất.
- `docs/system-architecture.md` §8 State Management.